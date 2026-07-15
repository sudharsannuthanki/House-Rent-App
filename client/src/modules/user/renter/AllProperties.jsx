import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../../../api";
import AllPropertiesCards from "../AllPropertiesCards";
import { PropertyGridSkeleton } from "../../../components/Skeleton";

const propertyTypes = [
  { value: "", label: "Any Type" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "Independent House" },
  { value: "pg", label: "PG / Hostel" },
];

function AllProperties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
  });

  function loadProperties(currentFilters) {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (currentFilters.search) params.set("search", currentFilters.search);
    if (currentFilters.city) params.set("city", currentFilters.city);
    if (currentFilters.listingType) params.set("listingType", currentFilters.listingType);
    if (currentFilters.propertyType) params.set("propertyType", currentFilters.propertyType);
    const query = params.toString() ? `?${params.toString()}` : "";

    getProperties(query).then(setProperties).finally(() => setIsLoading(false));
  }

  // Re-run whenever the URL's query params change (e.g. arriving here from the
  // hero search or a homepage category link), not just on the initial mount.
  useEffect(() => {
    const next = {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      listingType: searchParams.get("listingType") || "",
      propertyType: searchParams.get("propertyType") || "",
    };
    setFilters(next);
    loadProperties(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <div className="container">
      <h1>Browse Properties</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); loadProperties(filters); }}
        className="card"
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "end" }}
      >
        <div className="form-row" style={{ marginBottom: 0 }}>
          <label>Search title</label>
          <input name="search" value={filters.search} onChange={updateFilter} />
        </div>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <label>City</label>
          <input name="city" value={filters.city} onChange={updateFilter} />
        </div>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <label>Type</label>
          <select name="listingType" value={filters.listingType} onChange={updateFilter}>
            <option value="">Rent or Sale</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <label>Property type</label>
          <select name="propertyType" value={filters.propertyType} onChange={updateFilter}>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <button className="btn" type="submit">Search</button>
      </form>

      {isLoading ? (
        <PropertyGridSkeleton />
      ) : properties.length === 0 ? (
        <p className="empty-state">No properties match your search.</p>
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

export default AllProperties;
