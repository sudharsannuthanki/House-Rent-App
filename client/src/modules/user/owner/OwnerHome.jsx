import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerBookings } from "../../../api";

function OwnerHome() {
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    getOwnerBookings()
      .then((bookings) => {
        const total = bookings
          .filter((booking) => booking.status === "approved")
          .reduce((sum, booking) => sum + (booking.property?.price || 0), 0);
        setRevenue(total);
      })
      .catch(() => setRevenue(null));
  }, []);

  return (
    <div className="container owner-dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Owner Dashboard</h1>
          <p>Manage your properties and booking requests.</p>
        </div>

        <Link to="/owner/properties/new" className="btn-primary">
          + Add Property
        </Link>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>🏠</h2>
          <h3>My Properties</h3>
          <p>View and manage all your listed properties.</p>

          <Link to="/owner/properties">
            View Properties →
          </Link>
        </div>

        <div className="stat-card">
          <h2>📅</h2>
          <h3>Bookings</h3>
          <p>Track booking requests and approvals.</p>

          <Link to="/owner/bookings">
            View Requests →
          </Link>
        </div>

        <div className="stat-card">
          <h2>💰</h2>
          <h3>Revenue</h3>
          <p>
            {revenue === null
              ? "Loading..."
              : `₹${revenue.toLocaleString("en-IN")} from approved bookings`}
          </p>

          <Link to="/owner/bookings">
            View Bookings →
          </Link>
        </div>

      </div>

    </div>
  );
}

export default OwnerHome;
