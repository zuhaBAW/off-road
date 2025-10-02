// src/components/AboutUsWithCalendar.jsx
import React, { useState, useEffect } from "react";
import "./about.css";
import {
  IconCircleChevronLeftFilled,
  IconCircleChevronRightFilled,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/fetchEvents"; // adjust path if needed

const AboutUsWithCalendar = () => {
  const today = new Date();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [events, setEvents] = useState({}); // { "2025-9-29": [eventObj, ...] }
  const [selectedEventDay, setSelectedEventDay] = useState(null); // { date: Date, events: [...] }

  useEffect(() => {
    (async () => {
      const map = await fetchEvents();
      setEvents(map);

      // move calendar to earliest event month if exists
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
    console.log("openDay", key, "->", dayEvents);
    if (dayEvents.length) {
      setSelectedEventDay({ date, events: dayEvents });
    }
  };

  return (
    <div className="app-container">
      {/* About Us */}
      <div className="about-us-container">
        <h1 className="about-us-title">ABOUT US</h1>
        <p className="about-us-text">
          More Than Off-Roading <br />
          At Off-Road Adda, adventure goes beyond the trail — it's about the
          people, the stories, and the shared moments that bring us together.
        </p>
        <button className="book-now-button" onClick={() => navigate("/book")}>
          Book Now
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
                title={hasEvent ? dayEvents.map((e) => e.title).join(", ") : ""}
              >
                {String(day).padStart(2, "0")}
                {hasEvent && <span className="event-dot" aria-hidden />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedEventDay && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setSelectedEventDay(null)}
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
              // safe date parsing fallback
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

              return (
                <div key={ev.id} className="event-block">
                  <h3 className="event-title">{ev.title}</h3>
                  <p className="modal-text">📍 {ev.location}</p>
                  <p className="modal-text">⏰ {timeText}</p>
                  <div className="modal-actions">
                    <button
                      className="book-now-button"
                      onClick={() => navigate(`/book?event=${ev.id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <button
                className="cancel-button"
                onClick={() => setSelectedEventDay(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsWithCalendar;
