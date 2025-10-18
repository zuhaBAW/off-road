// src/components/About/BannerCalendar.jsx
import React, { useState, useEffect } from "react";
import "./about.css";
import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconX,
} from "@tabler/icons-react";
import { isLoggedIn, getLoggedInUser } from "../../api/loginApi";
import {
  bookEvent,
  fetchBookedUsers,
  buildBookingIndex,
  hasBooked as _hasBooked, // we'll wrap to normalize
} from "../../api/auth";
import { fetchEvents } from "../../api/fetchEvents";
import Banner from "./Banner";

// ---- Timezone helpers (match fetchEvents) ----
const TZ = "Asia/Dubai";
function ymdInTZ(date, tz = TZ) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${String(Number(m))}-${String(Number(d))}`;
}

// Toggle this to true to see helpful console logs
const DEBUG = false;

/** Date → YYYY-MM-DD in LOCAL time (kept for internal consistency if needed) */
// function toLocalYMD(d) {
//   if (!(d instanceof Date) || isNaN(d)) return "";
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

/** Wrap hasBooked to force same normalization for comparisons */
function hasBooked(index, { email, event, date }) {
  const norm = {
    email: String(email || "")
      .toLowerCase()
      .trim(),
    event: String(event || "")
      .toLowerCase()
      .trim(), // IMPORTANT: lowercase event
    date: String(date || "").trim(),
  };
  return _hasBooked(index, norm);
}

const AboutUsWithCalendar = () => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [events, setEvents] = useState({});
  const [selectedEventDay, setSelectedEventDay] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    Email: "",
    events: "",
    date: "",
  });

  /** === Load booked-users once and build index === */
  const [bookingIndex, setBookingIndex] = useState(null);
  const [bookingIdxLoading, setBookingIdxLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchBookedUsers();
        if (DEBUG) console.log("[booked-users rows]", rows);
        console.log(bookingDetails)
        if (!alive) return;
        setBookingIndex(buildBookingIndex(rows));
      } catch (e) {
        console.error("Failed to load booked users:", e);
      } finally {
        if (alive) setBookingIdxLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** === Load event calendar === */
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

  /** === Modal controls (Esc/back) === */
  useEffect(() => {
    const anyModalOpen = pickerOpen || selectedEventDay || confirmationOpen;
    if (anyModalOpen) {
      window.history.pushState({ modalOpen: true }, "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handlePopState = () => {
      if (confirmationOpen) return setConfirmationOpen(false);
      if (selectedEventDay) return setSelectedEventDay(null);
      if (pickerOpen) return setPickerOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (!pickerOpen && !selectedEventDay && !confirmationOpen)
        document.body.style.overflow = "";
    };
  }, [pickerOpen, selectedEventDay, confirmationOpen]);

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

  /** === Calendar helpers === */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const openDay = (date) => {
    // Build key using Dubai day to align with fetchEvents grouping
    const key = ymdInTZ(date, TZ);
    const dayEvents = events[key] || [];
    if (dayEvents.length > 0) setSelectedEventDay({ date, events: dayEvents });
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  /** === Build active event list for picker === */
  const flattenEvents = (map) => {
    if (!map) return [];
    const rows = [];
    Object.entries(map).forEach(([key, list]) => {
      const [y, m, d] = key.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      (list || []).forEach((ev) => {
        const evDate =
          ev?.dateObj instanceof Date && !isNaN(ev.dateObj)
            ? ev.dateObj
            : ev?.isoDate
            ? new Date(ev.isoDate)
            : dateObj;
        rows.push({ keyDate: dateObj, evDate, dayKey: key, ...ev });
      });
    });
    rows.sort(
      (a, b) =>
        (a.evDate?.getTime?.() ?? a.keyDate) -
        (b.evDate?.getTime?.() ?? b.keyDate)
    );
    return rows;
  };

  const isActiveEvent = (row) => {
    const now = new Date();
    // Compare by Dubai's midnight to avoid UTC drift
    const dubaiDay = ymdInTZ(row.evDate || row.keyDate, TZ);
    const todayDubai = ymdInTZ(now, TZ);
    return dubaiDay >= todayDubai;
  };

  const allRows = flattenEvents(events);
  const activeRows = allRows.filter(isActiveEvent);

  /** === Top CTA: Register For Event (opens picker) === */
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

  /** Picker → choose an event row to open per-day modal */
  const handleChooseEvent = (row) => {
    const dayEvents = events[row.dayKey] || [];
    const [y, m, d] = row.dayKey.split("-").map(Number);
    setSelectedEventDay({ date: new Date(y, m - 1, d), events: dayEvents });
    setPickerOpen(false);
  };

  return (
    <div id="about">
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

        {/* === Calendar === */}
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
              const cellDate = new Date(year, month, day);
              const key = ymdInTZ(cellDate, TZ); // align with events grouping
              const dayEvents = events[key] || [];
              const hasEvent = dayEvents.length > 0;

              const isTodayDubai = ymdInTZ(cellDate, TZ) === ymdInTZ(today, TZ);

              const dow = cellDate.getDay();
              const isWeekend = dow === 0 || dow === 6;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isTodayDubai ? "today" : ""} ${
                    hasEvent ? "event-day" : ""
                  } ${isWeekend ? "weekend" : ""}`}
                  onClick={() => openDay(cellDate)}
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

        {/* === Event Picker Modal === */}
        {pickerOpen && (
          <div
            className="modal-overlay"
            onClick={() => setPickerOpen(false)}
            role="dialog"
            aria-modal="true"
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
                        ? new Intl.DateTimeFormat(undefined, {
                            timeZone: TZ,
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(row.evDate)
                        : new Intl.DateTimeFormat(undefined, {
                            timeZone: TZ,
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(row.keyDate));

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

        {/* === Per-day Event Modal === */}
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
                {new Intl.DateTimeFormat(undefined, {
                  timeZone: TZ,
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(selectedEventDay.date)}
              </h2>

              {selectedEventDay.events.map((ev) => {
                const evDate =
                  ev.dateObj instanceof Date && !isNaN(ev.dateObj)
                    ? ev.dateObj
                    : ev.isoDate
                    ? new Date(ev.isoDate)
                    : null;

                // Dubai-local time text
                const timeText =
                  evDate && !isNaN(evDate)
                    ? new Intl.DateTimeFormat(undefined, {
                        timeZone: TZ,
                        hour: "2-digit",
                        minute: "2-digit",
                        // hour12: false, // enable if you prefer 24h
                      }).format(evDate)
                    : "Time unavailable";

                // Current user
                const user = getLoggedInUser?.();
                const userEmail = user?.email || "";

                // Normalize event + date for comparisons
                const eventName = String(ev.title || "").trim();
                const eventNameKey = eventName.toLowerCase(); // IMPORTANT

                // Date string for booking uniqueness should be Dubai's date
                const eventDateStr =
                  evDate && !isNaN(evDate)
                    ? ymdInTZ(evDate, TZ)
                    : ymdInTZ(selectedEventDay.date, TZ);

                const alreadyBooked =
                  !!userEmail &&
                  !bookingIdxLoading &&
                  hasBooked(bookingIndex, {
                    email: userEmail,
                    event: eventNameKey,
                    date: eventDateStr,
                  });

                const handleRegisterClick = async () => {
                  if (!isLoggedIn()) {
                    alert("You need to login first!");
                    setSelectedEventDay(null);
                    document.getElementById("home")?.scrollIntoView({
                      behavior: "smooth",
                    });
                    return;
                  }

                  const user = getLoggedInUser();
                  if (!user) return;

                  // Duplicate check before booking
                  if (
                    !bookingIdxLoading &&
                    hasBooked(bookingIndex, {
                      email: user.email,
                      event: eventNameKey,
                      date: eventDateStr,
                    })
                  ) {
                    alert("You have already registered for this event date.");
                    return;
                  }

                  const bookingPayload = {
                    Email: user.email,
                    EventDetails: eventName, // original case for backend
                    date: eventDateStr, // Dubai day
                  };

                  setBookingDetails(bookingPayload);

                  try {
                    await bookEvent(bookingPayload);
                    // Optimistically add to index so UI disables immediately
                    setBookingIndex((prev) => {
                      const next = new Set(prev || []);
                      next.add(
                        `${bookingPayload.Email.toLowerCase().trim()}|${eventNameKey}|${bookingPayload.date.trim()}`
                      );
                      return next;
                    });
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
                        disabled={bookingIdxLoading || alreadyBooked}
                        title={
                          alreadyBooked
                            ? "You already booked this event date."
                            : "Register"
                        }
                        style={{
                          opacity: bookingIdxLoading || alreadyBooked ? 0.6 : 1,
                          cursor:
                            bookingIdxLoading || alreadyBooked
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {alreadyBooked ? "Already Booked" : "Register"}
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
