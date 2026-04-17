import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navStyle = {
    backgroundColor: "#1b4332",
    padding: "0 2rem",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "18px",
    textDecoration: "none",
    letterSpacing: "0.3px",
  };

  const linksContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <NavLink to="/" style={logoStyle}>
        {/* Leaf/plant icon SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" opacity="0"/>
          <path d="M17 8C17 8 15 6 12 6C9 6 7 8 7 8C7 8 5 10 5 13C5 16 7 18 12 18C17 18 19 16 19 13C19 10 17 8 17 8Z" fill="white" stroke="white" strokeWidth="0.5"/>
          <path d="M12 18V10" stroke="#1b4332" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        KeenKeeper
      </NavLink>

      {/* Nav Links */}
      <div style={linksContainerStyle}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: isActive ? "600" : "400",
            color: isActive ? "#1b4332" : "rgba(255,255,255,0.85)",
            backgroundColor: isActive ? "#ffffff" : "transparent",
            textDecoration: "none",
            transition: "all 0.2s",
          })}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Home
        </NavLink>

        <NavLink
          to="/timeline"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: isActive ? "600" : "400",
            color: isActive ? "#1b4332" : "rgba(255,255,255,0.85)",
            backgroundColor: isActive ? "#ffffff" : "transparent",
            textDecoration: "none",
            transition: "all 0.2s",
          })}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
          </svg>
          Timeline
        </NavLink>

        <NavLink
          to="/stats"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: isActive ? "600" : "400",
            color: isActive ? "#1b4332" : "rgba(255,255,255,0.85)",
            backgroundColor: isActive ? "#ffffff" : "transparent",
            textDecoration: "none",
            transition: "all 0.2s",
          })}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/>
          </svg>
          Stats
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;