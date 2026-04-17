import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const onTrackCount = friends.filter((f) => f.status === "on-track").length;
  const needAttentionCount = friends.filter(
    (f) => f.status === "overdue" || f.status === "almost due"
  ).length;

  const getStatusColor = (status) => {
    if (status === "overdue") return { bg: "#e63946", text: "#fff" };
    if (status === "almost due") return { bg: "#f4a261", text: "#fff" };
    return { bg: "#2d6a4f", text: "#fff" };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
        <div style={{
          width: "44px", height: "44px", border: "4px solid #e9ecef",
          borderTop: "4px solid #2d6a4f", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "#6c757d", fontSize: "14px" }}>Loading your friends...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 56px)" }}>
      {/* Banner Section */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e9ecef",
        padding: "3rem 2rem 5rem",
        textAlign: "center",
        position: "relative",
      }}>
        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          color: "#1b4332",
          marginBottom: "0.75rem",
          letterSpacing: "-0.5px",
          lineHeight: "1.2",
        }}>
          Friends to keep close in your life
        </h1>
        <p style={{
          color: "#6c757d",
          fontSize: "0.875rem",
          maxWidth: "440px",
          margin: "0 auto 1.5rem",
          lineHeight: "1.6",
        }}>
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>
        <button style={{
          backgroundColor: "#1b4332",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 22px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2d6a4f"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1b4332"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add a Friend
        </button>

        {/* Summary Cards - positioned to hang below */}
        <div style={{
          position: "absolute",
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 4rem)",
          maxWidth: "780px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}>
          {[
            { label: "Total Friends", value: friends.length },
            { label: "On Track", value: onTrackCount },
            { label: "Need Attention", value: needAttentionCount },
            { label: "Interactions This Month", value: 12 },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <p style={{ fontSize: "1.6rem", fontWeight: "800", color: "#1b4332", lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: "0.7rem", color: "#6c757d", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      <div style={{ padding: "5rem 2rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#212529", marginBottom: "1.25rem" }}>
          Your Friends
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "14px",
        }}>
          {friends.map((friend) => {
            const { bg, text } = getStatusColor(friend.status);
            return (
              <Link
                to={`/friend/${friend.id}`}
                key={friend.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e9ecef",
                  borderRadius: "10px",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Card Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
                  <img
                    src={friend.picture}
                    alt={friend.name}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "0.75rem",
                      border: "3px solid #f8f9fa",
                    }}
                  />
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#212529", marginBottom: "2px" }}>
                    {friend.name}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#6c757d", marginBottom: "10px" }}>
                    {friend.days_since_contact}d ago
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center", marginBottom: "10px" }}>
                    {friend.tags.map((tag, i) => (
                      <span key={i} style={{
                        backgroundColor: "#f1f3f5",
                        color: "#495057",
                        fontSize: "0.6rem",
                        padding: "2px 7px",
                        borderRadius: "10px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    backgroundColor: bg,
                    color: text,
                    fontSize: "0.6rem",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    textTransform: "capitalize",
                    letterSpacing: "0.3px",
                  }}>
                    {friend.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;