import { useEffect, useState } from "react";
import { getFavoriteIds } from "../../favorites";
import { getPropertyById } from "../../api";
import AllPropertiesCards from "../user/AllPropertiesCards";
import { PropertyGridSkeleton } from "../../components/Skeleton";

// Shows whatever properties the visitor has hearted, wherever they hearted them
// (home page, browse page, property details). Pure client-side, no login needed.
function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadSaved() {
      const ids = getFavoriteIds();
      if (ids.length === 0) {
        setProperties([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      Promise.all(ids.map((id) => getPropertyById(id).catch(() => null)))
        .then((results) => setProperties(results.filter(Boolean)))
        .finally(() => setIsLoading(false));
    }

    loadSaved();
    window.addEventListener("favorites-changed", loadSaved);
    return () => window.removeEventListener("favorites-changed", loadSaved);
  }, []);

  return (
    <div className="container">
      <h1>Saved Properties</h1>

      {isLoading ? (
        <PropertyGridSkeleton count={3} />
      ) : properties.length === 0 ? (
        <p className="empty-state">
          You haven't saved any properties yet. Tap the heart on a listing to save it here.
        </p>
      ) : (
        <div className="grid">
          {properties.map((property) => (
            <AllPropertiesCards key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedProperties;
