import { useContext, useState } from "react";
import { TimelineContext } from "../context/TimelineContext";

const Timeline = () => {
  const { timeline } = useContext(TimelineContext);
  const [filter, setFilter] = useState("All");

  const getIconDetails = (type) => {
    if (type === "Call") return {
      bg: "#ffe5e5",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#e63946">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
    };
    if (type === "Text") return {
      bg: "#e8f0fe",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#4a80f5">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      ),
    };
    if (type === "Video") return {
      bg: "#e8f5e9",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#2d6a4f">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
      ),
    };
    // Meetup / default - gold/yellow
    return {
      bg: "#fff8e1",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      ),
    };
  };

  const filteredTimeline = filter === "All"
    ? timeline
    : timeline.filter((item) => item.type === filter);

  return (
    <div style={{ padding: "2rem", maxWidth: "760px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#212529", marginBottom: "1.25rem" }}>
        Timeline
      </h1>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: "1.5rem" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            border: "1px solid #e9ecef",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "7px 32px 7px 12px",
            fontSize: "0.8rem",
            color: "#495057",
            cursor: "pointer",
            outline: "none",
            fontFamily: "inherit",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236c757d'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            minWidth: "160px",
          }}
        >
          <option value="All">Filter timeline</option>
          <option value="Call">Calls Only</option>
          <option value="Text">Texts Only</option>
          <option value="Video">Video Calls Only</option>
        </select>
      </div>

      {/* Timeline List */}
      {timeline.length === 0 ? (
        <div style={{
          backgroundColor: "#ffffff", border: "1px solid #e9ecef",
          borderRadius: "10px", padding: "3rem", textAlign: "center",
          color: "#6c757d", fontSize: "0.875rem",
        }}>
          No interactions logged yet. Go to a friend&apos;s profile to check in!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {filteredTimeline.map((item, index) => {
            const { bg, icon } = getIconDetails(item.type);
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 0",
                  borderBottom: index < filteredTimeline.length - 1 ? "1px solid #f1f3f5" : "none",
                }}
              >
                {/* Icon Circle */}
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  backgroundColor: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#212529", marginBottom: "2px" }}>
                    <span style={{ fontWeight: "700" }}>{item.type}</span>
                    <span style={{ fontWeight: "400", color: "#495057" }}>
                      {" "}with {item.title.replace(`${item.type} with `, "")}
                    </span>
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#adb5bd" }}>{item.date}</p>
                </div>
              </div>
            );
          })}

          {filteredTimeline.length === 0 && (
            <div style={{
              padding: "2rem", textAlign: "center",
              color: "#6c757d", fontSize: "0.875rem",
            }}>
              No entries match this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;