import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TimelineContext } from "../context/TimelineContext";
import toast from "react-hot-toast";

const FriendDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addInteraction } = useContext(TimelineContext);
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((f) => f.id === parseInt(id));
        if (!found) navigate("/404");
        else setFriend(found);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
        <div style={{
          width: "44px", height: "44px", border: "4px solid #e9ecef",
          borderTop: "4px solid #2d6a4f", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "#6c757d", fontSize: "14px" }}>Loading details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!friend) return null;

  const getStatusColor = (status) => {
    if (status === "overdue") return { bg: "#e63946", text: "#fff" };
    if (status === "almost due") return { bg: "#f4a261", text: "#fff" };
    return { bg: "#2d6a4f", text: "#fff" };
  };

  const { bg: statusBg, text: statusText } = getStatusColor(friend.status);

  const handleInteraction = (type) => {
    addInteraction(type, friend.name);
    toast.success(`${type} logged with ${friend.name}!`, {
      style: { background: "#1b4332", color: "#fff" },
      iconTheme: { primary: "#52b788", secondary: "#fff" },
    });
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e9ecef",
    borderRadius: "10px",
    padding: "1.5rem",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px" }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Profile Card */}
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <img
              src={friend.picture}
              alt={friend.name}
              style={{
                width: "90px", height: "90px", borderRadius: "50%",
                objectFit: "cover", margin: "0 auto 0.75rem",
                display: "block", border: "3px solid #f8f9fa",
              }}
            />
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#212529", marginBottom: "2px" }}>
              {friend.name}
            </h2>
            <span style={{
              backgroundColor: statusBg, color: statusText,
              fontSize: "0.6rem", padding: "2px 10px", borderRadius: "10px",
              fontWeight: "700", textTransform: "capitalize",
              display: "inline-block", marginBottom: "0.75rem",
            }}>
              {friend.status}
            </span>
            <p style={{ fontSize: "0.7rem", color: "#6c757d", fontStyle: "italic", marginBottom: "0.75rem" }}>
              "{friend.bio}"
            </p>
            <p style={{ fontSize: "0.7rem", color: "#6c757d" }}>{friend.email}</p>
          </div>

          {/* Action Buttons */}
          <div style={{ ...cardStyle, padding: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Snooze 2 Weeks", icon: "⏰", color: "#212529", borderColor: "#e9ecef", hoverBg: "#f8f9fa" },
              { label: "Archive", icon: "📦", color: "#212529", borderColor: "#e9ecef", hoverBg: "#f8f9fa" },
              { label: "Delete", icon: "🗑️", color: "#e63946", borderColor: "#fde8ea", hoverBg: "#fff5f5" },
            ].map(({ label, icon, color, borderColor, hoverBg }) => (
              <button
                key={label}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 12px", borderRadius: "6px",
                  border: `1px solid ${borderColor}`, backgroundColor: "#ffffff",
                  color, fontSize: "0.8rem", fontWeight: "500",
                  cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
              >
                <span style={{ fontSize: "14px" }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {[
              { label: "Days Since Contact", value: friend.days_since_contact },
              { label: "Goal (Days)", value: friend.goal },
              { label: "Next Due", value: friend.next_due_date },
            ].map(({ label, value }) => (
              <div key={label} style={{ ...cardStyle, textAlign: "center", padding: "1.25rem 1rem" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1b4332", marginBottom: "4px" }}>
                  {value}
                </p>
                <p style={{ fontSize: "0.65rem", color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Relationship Goal */}
          <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#212529", marginBottom: "4px" }}>
                Relationship Goal
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                Connect every <strong>{friend.goal} days</strong>
              </p>
            </div>
            <button style={{
              border: "1px solid #e9ecef", backgroundColor: "#ffffff",
              borderRadius: "6px", padding: "6px 16px",
              fontSize: "0.75rem", fontWeight: "600", cursor: "pointer",
              color: "#212529", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
            >
              Edit
            </button>
          </div>

          {/* Quick Check-In */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#212529", marginBottom: "1rem" }}>
              Quick Check-In
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[
                {
                  type: "Call",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2d6a4f">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  ),
                },
                {
                  type: "Text",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2d6a4f">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                  ),
                },
                {
                  type: "Video",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2d6a4f">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  ),
                },
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => handleInteraction(type)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: "6px",
                    padding: "1.1rem 1rem",
                    border: "1px solid #e9ecef", borderRadius: "8px",
                    backgroundColor: "#ffffff", cursor: "pointer",
                    transition: "all 0.15s", color: "#212529",
                    fontSize: "0.8rem", fontWeight: "600",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "#f0faf5";
                    e.currentTarget.style.borderColor = "#2d6a4f";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#e9ecef";
                  }}
                >
                  {icon}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .friend-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default FriendDetails;