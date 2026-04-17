const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-12 rounded-t-xl">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by KeenKeeper</p>
      </aside>
    </footer>
  );
};

export default Footer;