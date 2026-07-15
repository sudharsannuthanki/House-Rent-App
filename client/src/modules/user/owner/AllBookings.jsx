import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOwnerBookings, updateBookingStatus } from "../../../api";
import Toast from "../../common/Toast";

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyFilter = searchParams.get("property") || "";

  function loadBookings() {
    setIsLoading(true);
    getOwnerBookings().then(setBookings).finally(() => setIsLoading(false));
  }

  useEffect(() => { loadBookings(); }, []);

  async function handleAction(id, status) {
    try {
      await updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleBookings = propertyFilter
    ? bookings.filter((booking) => booking.property?._id === propertyFilter)
    : bookings;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h1>Booking Requests</h1>
        {propertyFilter && (
          <button className="btn btn-secondary" onClick={() => setSearchParams({})}>
            Showing bookings for this property &middot; Clear filter
          </button>
        )}
      </div>
      <Toast message={error} type="error" />

      {isLoading ? (
        <p>Loading...</p>
      ) : visibleBookings.length === 0 ? (
        <p className="empty-state">
          {propertyFilter ? "No booking requests for this property yet." : "No booking requests yet."}
        </p>
      ) : (
        visibleBookings.map((booking) => (
          <div key={booking._id} className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{booking.property?.title}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                Requested by {booking.user?.name} ({booking.user?.email})
              </p>
              {booking.message && <p style={{ fontSize: 13, fontStyle: "italic" }}>"{booking.message}"</p>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={`badge ${booking.status}`}>{booking.status}</span>
              {booking.status === "pending" && (
                <>
                  <button className="btn" onClick={() => handleAction(booking._id, "approved")}>Approve</button>
                  <button className="btn btn-danger" onClick={() => handleAction(booking._id, "rejected")}>Reject</button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AllBookings;
