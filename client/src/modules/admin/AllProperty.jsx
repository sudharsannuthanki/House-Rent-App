import { useEffect, useState } from "react";
import { getAdminProperties } from "../../api";
import AllPropertiesCards from "../user/AllPropertiesCards";

function AllProperty() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminProperties().then(setProperties).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>All Properties</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p className="empty-state">No properties yet.</p>
      ) : (
        <div className="grid">
          {properties.map((property) => (
            <AllPropertiesCards
              key={property._id}
              property={property}
              actions={<span style={{ fontSize: 12, color: "var(--muted)" }}>Owner: {property.owner?.name}</span>}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProperty;
