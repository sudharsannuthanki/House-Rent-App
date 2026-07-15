import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProperties, deleteProperty } from "../../../api";
import AllPropertiesCards from "../AllPropertiesCards";
import Toast from "../../common/Toast";

function AllProperties() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties() {
    try {
      const data = await getMyProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this property?")) return;

    try {
      await deleteProperty(id);

      setProperties((prev) =>
        prev.filter((property) => property._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">

      <div className="dashboard-header">

        <div>
          <h1>My Properties</h1>
          <p>
            Manage all properties listed by you.
          </p>
        </div>

        <Link
          to="/owner/properties/new"
          className="btn-primary"
        >
          + Add Property
        </Link>

      </div>

      <Toast
        message={error}
        type="error"
      />

      {loading ? (

        <p>Loading properties...</p>

      ) : properties.length === 0 ? (

        <div className="empty-state">

          <h2>No Properties Found</h2>

          <p>
            Start by adding your first property.
          </p>

          <Link
            className="btn-primary"
            to="/owner/properties/new"
          >
            Add Property
          </Link>

        </div>

      ) : (

        <div className="grid">

          {properties.map((property) => (

            <AllPropertiesCards
              key={property._id}
              property={property}
              actions={
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <Link
                    to={`/owner/properties/${property._id}/edit`}
                    className="btn-secondary"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/owner/bookings?property=${property._id}`}
                    className="btn-secondary"
                  >
                    Bookings
                  </Link>

                  <button
                    className="btn-danger"
                    onClick={() =>
                      handleDelete(property._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              }
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default AllProperties;