import { Link } from "react-router-dom";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#1b4332",
    color: "#ffffff",
    padding: "3rem 2rem 1.5rem",
    textAlign: "center",
    marginTop: "auto",
  };

  const logoStyle = {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "0.5rem",
    letterSpacing: "-0.5px",
  };

  const taglineStyle = {
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.8rem",
    marginBottom: "1.5rem",
    maxWidth: "380px",
    margin: "0 auto 1.5rem",
    lineHeight: "1.5",
  };

  const socialLabelStyle = {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const socialIconsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "2.5rem",
  };

  const socialIconStyle = {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
    color: "white",
  };

  const dividerStyle = {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  };

  const smallTextStyle = {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.45)",
  };

  const footerLinksStyle = {
    display: "flex",
    gap: "1.25rem",
  };

  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={logoStyle}>KeenKeeper</p>
        <p style={taglineStyle}>
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>

        <p style={socialLabelStyle}>Social Links</p>
        <div style={socialIconsStyle}>
          {/* Facebook */}
          <a href="#" style={socialIconStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          {/* Twitter/X */}
          <a href="#" style={socialIconStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
            </svg>
          </a>
          {/* X/close icon (as shown in design) */}
          <a href="#" style={socialIconStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        <div style={dividerStyle}>
          <p style={smallTextStyle}>© {new Date().getFullYear()} KeenKeeper. All rights reserved.</p>
          <div style={footerLinksStyle}>
            <a href="#" style={{ ...smallTextStyle, textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ ...smallTextStyle, textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ ...smallTextStyle, textDecoration: "none" }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;