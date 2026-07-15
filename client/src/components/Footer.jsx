import { Link } from "react-router-dom";
import { IconBuilding } from "./icons";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-brand">
          <span className="brand-icon"><IconBuilding size={16} /></span>
          <span>HouseRent India</span>
        </div>

        <nav className="site-footer-links">
          <Link to="/renter/properties">Browse Properties</Link>
          <Link to="/register">Create account</Link>
          <Link to="/login">Login</Link>
        </nav>

        <p className="site-footer-copy">&copy; {year} HouseRent India. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
