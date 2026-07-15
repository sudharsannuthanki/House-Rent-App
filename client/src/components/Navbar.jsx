import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../auth";
import ThemeToggle from "./ThemeToggle";
import { IconHeart } from "./icons";

const homePathByRole = {
  admin: "/admin",
  owner: "/owner",
  user: "/renter",
};

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <header className="navbar">
      <div className="container">

        {/* Logo */}
        <Link to="/" className="brand">
          🏠HouseRent <span className="brand-india">India</span>
        </Link>

        {/* Navigation */}
        <nav>

          <Link
            to="/"
            className={isActive("/") ? "active-link" : ""}
          >
            Home
          </Link>

          <Link
            to="/renter/properties"
            className={isActive("/renter/properties") ? "active-link" : ""}
          >
            Properties
          </Link>

          {user && (
            <Link
              to="/saved"
              className="nav-icon-link"
              title="Saved Properties"
            >
              <IconHeart size={19} />
            </Link>
          )}

          <ThemeToggle />

          {!user ? (
            <div className="auth-buttons">

              <Link
                to="/login"
                className="btn btn-secondary"
              >
                Login
              </Link>

              <span
                style={{
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              >
                /
              </span>

              <Link
                to="/register"
                className="btn"
              >
                Register
              </Link>

            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >

              <Link
                to={homePathByRole[user.role]}
                className="user-chip"
              >
                👋 {user.name}
              </Link>

              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;