import React, { useState, useEffect } from "react";
import "./about.css";
import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconX,
} from "@tabler/icons-react";
import { isLoggedIn, getLoggedInUser } from "../../api/loginApi";
import { bookEvent } from "../../api/auth";
import { fetchEvents } from "../../api/fetchEvents";
import Banner from "./Banner";

const AboutUsWithCalendar = () => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [events, setEvents] = useState({}); // map: "YYYY-M-D" -> [events]
  const [selectedEventDay, setSelectedEventDay] = useState(null); // { date, events }
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // NEW: event picker modal state
  const [pickerOpen, setPickerOpen] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    Email: "",
    events: "",
    date: "",
  });
  console.log(bookingDetails);
  // Fetch calendar events and set initial month around first event
  useEffect(() => {
    (async () => {
      const map = await fetchEvents();
      setEvents(map);

      const keys = Object.keys(map || {});
      if (keys.length) {
        keys.sort((a, b) => {
          const [ay, am, ad] = a.split("-").map(Number);
          const [by, bm, bd] = b.split("-").map(Number);
          return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd);
        });
        const [firstKey] = keys;
        const [y, m] = firstKey.split("-").map(Number);
        setCurrentDate(new Date(y, m - 1, 1));
      }
    })();
  }, []);

  // History back button closes any open modal in LIFO order
  useEffect(() => {
    const anyModalOpen = pickerOpen || selectedEventDay || confirmationOpen;
    if (anyModalOpen) {
      window.history.pushState({ modalOpen: true }, "");
      document.body.style.overflow = "hidden"; // lock scroll while any modal open
    } else {
      document.body.style.overflow = ""; // release
    }

    const handlePopState = () => {
      if (confirmationOpen) {
        setConfirmationOpen(false);
        return;
      }
      if (selectedEventDay) {
        setSelectedEventDay(null);
        return;
      }
      if (pickerOpen) {
        setPickerOpen(false);
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // ensure unlock on unmount
      if (!pickerOpen && !selectedEventDay && !confirmationOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [pickerOpen, selectedEventDay, confirmationOpen]);

  // Esc to close topmost modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (confirmationOpen) return setConfirmationOpen(false);
      if (selectedEventDay) return setSelectedEventDay(null);
      if (pickerOpen) return setPickerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickerOpen, selectedEventDay, confirmationOpen]);

  // Helpers for calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const openDay = (date) => {
    const key = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const dayEvents = events[key] || [];
    if (dayEvents.length > 0) {
      setSelectedEventDay({ date, events: dayEvents });
    }
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  // ---- ACTIVE EVENTS PICKER LOGIC ----
  // Convert your events map into an array of event rows with date/time
  const flattenEvents = (map) => {
    if (!map) return [];
    const rows = [];
    Object.entries(map).forEach(([key, list]) => {
      const [y, m, d] = key.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      (list || []).forEach((ev) => {
        let evDate =
          ev?.dateObj instanceof Date && !isNaN(ev.dateObj)
            ? ev.dateObj
            : ev?.isoDate
            ? new Date(ev.isoDate)
            : dateObj; // fallback to map key date
        rows.push({
          keyDate: dateObj, // normalized day date
          evDate, // specific time if available
          dayKey: key,
          ...ev,
        });
      });
    });
    // Sort by event date/time
    rows.sort(
      (a, b) =>
        (a.evDate?.getTime?.() ?? a.keyDate) -
        (b.evDate?.getTime?.() ?? b.keyDate)
    );
    return rows;
  };

  // Decide if an event is "active" — keep simple: today or future, or ev.active===true
  const isActiveEvent = (row) => {
    const now = new Date();
    // if the payload has a boolean 'active', prefer that
    if (typeof row.active === "boolean") return row.active;
    const cmp =
      row.evDate instanceof Date && !isNaN(row.evDate)
        ? row.evDate
        : row.keyDate;
    // same-day is allowed
    return cmp.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0);
  };

  const allRows = flattenEvents(events);
  const activeRows = allRows.filter(isActiveEvent);

  // “Register For Event” → open picker instead of picking first event
  const handleTopBookClick = () => {
    if (!isLoggedIn()) {
      alert("You need to login first!");
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!activeRows.length) {
      alert("No active events available to book yet!");
      return;
    }
    setPickerOpen(true);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  // When user picks an event in the picker
  const handleChooseEvent = (row) => {
    // open your existing day modal preloaded with that event's day + list
    const dayEvents = events[row.dayKey] || [];
    const [y, m, d] = row.dayKey.split("-").map(Number);
    setSelectedEventDay({ date: new Date(y, m - 1, d), events: dayEvents });
    setPickerOpen(false);
  };

  return (
    <div id="about">
      {/* About Us */}
      <div className="banner">
        <Banner data={events} />
      </div>

      <div className="app-container">
        <div className="about-us-container">
          <h1 className="about-us-title">ABOUT US</h1>
          <p className="about-us-text">
            More Than Off-Roading <br />
            At Off-Road Adda, adventure goes beyond the trail — it's about the
            people, the stories, and the shared moments that bring us together.
          </p>
          <button className="book-now-button" onClick={handleTopBookClick}>
            Register For Event
          </button>
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          <div className="calendar-header">
            <IconCircleChevronLeftFilled onClick={prevMonth} />
            <h2 className="calendar-month">
              {monthName} {year}
            </h2>
            <IconCircleChevronRightFilled onClick={nextMonth} />
          </div>

          <div className="calendar-grid">
            {weekdays.map((day, i) => (
              <div
                key={i}
                className={`weekday-header ${
                  day === "SAT" || day === "SUN" ? "weekend-header" : ""
                }`}
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="empty-day" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const key = `${year}-${month + 1}-${day}`;
              const dayEvents = events[key] || [];
              const hasEvent = dayEvents.length > 0;
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? "today" : ""} ${
                    hasEvent ? "event-day" : ""
                  } ${isWeekend ? "weekend" : ""}`}
                  onClick={() => openDay(date)}
                  title={
                    hasEvent ? dayEvents.map((e) => e.title).join(", ") : ""
                  }
                >
                  {String(day).padStart(2, "0")}
                  {hasEvent && <span className="event-dot" aria-hidden />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== Event Picker Modal (NEW) ===================== */}
        {pickerOpen && (
          <div
            className="modal-overlay"
            onClick={() => setPickerOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Select an event"
          >
            <div
              className="modal-content event-picker"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
              <h2 className="modal-title">Choose an Event</h2>

              {activeRows.length ? (
                <div className="event-list">
                  {activeRows.map((row) => {
                    const when =
                      row.evDate instanceof Date && !isNaN(row.evDate)
                        ? `${row.evDate.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} • ${row.evDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : new Date(row.keyDate).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });

                    return (
                      <div
                        key={`${row.dayKey}-${row.id ?? row.title}`}
                        className="event-card"
                      >
                        <div className="event-card-main">
                          <div className="event-card-title">{row.title}</div>
                          <div className="event-card-meta">
                            <span>📍 {row.location ?? "TBA"}</span>
                            <span>⏰ {when}</span>
                          </div>
                        </div>
                        <div className="event-card-actions">
                          <button
                            className="book-now-button"
                            type="button"
                            onClick={() => handleChooseEvent(row)}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="modal-text">No active events available.</p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => setPickerOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== Per-day Event Modal (existing) ===================== */}
        {selectedEventDay && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedEventDay(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                type="button"
                onClick={() => setSelectedEventDay(null)}
                aria-label="Close"
              >
                <IconX size={20} />
              </button>

              <h2 className="modal-title">
                Events on{" "}
                {selectedEventDay.date.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>

              {selectedEventDay.events.map((ev) => {
                const evDate =
                  ev.dateObj instanceof Date && !isNaN(ev.dateObj)
                    ? ev.dateObj
                    : ev.isoDate
                    ? new Date(ev.isoDate)
                    : null;

                const timeText =
                  evDate && !isNaN(evDate)
                    ? evDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ev.isoDate ?? "Time unavailable";

                const handleRegisterClick = async () => {
                  if (!isLoggedIn()) {
                    alert("You need to login first!");
                    setSelectedEventDay(null);
                    document
                      .getElementById("home")
                      ?.scrollIntoView({ behavior: "smooth" });
                    return;
                  }

                  const user = getLoggedInUser();
                  if (!user) return;
                 
                  const bookingPayload = {
                    Email: user.email,
                    EventDetails: ev.title,
                    date:
                      evDate instanceof Date
                        ? evDate.toISOString().split("T")[0]
                        : null,
                  };

                  setBookingDetails(bookingPayload); // fix: actually set the payload

                  try {
                    await bookEvent(bookingPayload);
                    setConfirmationOpen(true);
                  } catch (err) {
                    alert(
                      "Booking failed: " + (err?.message ?? "Unknown error")
                    );
                  }
                };

                return (
                  <div key={ev.id ?? ev.title} className="event-block">
                    <h3 className="event-title">{ev.title}</h3>
                    <p className="modal-text">📍 {ev.location ?? "TBA"}</p>
                    <p className="modal-text">⏰ {timeText}</p>
                    <div className="modal-actions">
                      <button
                        className="book-now-button"
                        type="button"
                        onClick={handleRegisterClick}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                );
              })}

              {confirmationOpen && (
                <div
                  className="modal-confirmation"
                  onClick={() => setConfirmationOpen(false)}
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Registration Confirmed!</h2>
                    <p>You have successfully registered for the event.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmationOpen(false);
                        document
                          .getElementById("explore")
                          ?.scrollIntoView({ behavior: "smooth" });
                        setSelectedEventDay(null);
                      }}
                      className="cancel-button-1"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => setSelectedEventDay(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsWithCalendar;
