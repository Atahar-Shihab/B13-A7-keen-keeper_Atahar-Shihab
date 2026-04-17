import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", textAlign: "center",
      padding: "2rem",
    }}>
      <h1 style={{ fontSize: "5rem", fontWeight: "800", color: "#e63946", marginBottom: "0.5rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6c757d", marginBottom: "2rem", fontSize: "0.9rem" }}>
        The route you are looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: "#1b4332", color: "#ffffff",
          padding: "10px 24px", borderRadius: "6px",
          textDecoration: "none", fontWeight: "600", fontSize: "0.875rem",
          transition: "background 0.2s",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;