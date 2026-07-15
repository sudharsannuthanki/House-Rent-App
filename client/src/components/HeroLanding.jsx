import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconPin, IconBuilding } from "./icons";

const propertyTypes = [
  { value: "", label: "Property Type" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "House" },
  { value: "pg", label: "PG / Hostel" },
];

function HeroLanding({ featured }) {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (propertyType) params.set("propertyType", propertyType);
    const query = params.toString() ? `?${params.toString()}` : "";
    navigate(`/renter/properties${query}`);
  }

  return (
    <section className="hero">

      <div className="hero-overlay" />

      <div className="container hero-content">

        <div className="hero-left">

          <span className="hero-badge">
            Trusted Rental Platform
          </span>

          <h1>
            Find Your Perfect Home
          </h1>

          <p>
            Discover verified rental properties across India.
            Connect directly with property owners, compare listings,
            and rent your next home with confidence.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>

            <div className="search-item">
              <IconPin size={18} />
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="search-item">
              <IconBuilding size={18} />
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="hero-search-btn">
                🔍 Search
            </button>

          </form>

          <div className="hero-buttons">

            <Link
              to="/renter/properties"
              className="btn-primary"
            >
              Browse Properties
            </Link>

            <Link
              to="/register"
              className="btn-outline"
            >
              Become an Owner
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <img
            src={featured?.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"}
            alt={featured?.title || "House"}
          />

          {featured && (
            <div className="hero-card">

              <h3>Featured Property</h3>

              <h2>{featured.title}</h2>

              <p>{featured.city}, {featured.state}</p>

              <strong>
                &#8377;{Number(featured.price).toLocaleString("en-IN")}
                {featured.listingType === "rent" ? " / month" : ""}
              </strong>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default HeroLanding;
