import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "../../favorites";
import {
  IconHeart,
  IconPin,
  IconBed,
  IconBath,
  IconArea,
} from "../../components/icons";

const propertyTypeLabels = {
  apartment: "Apartment",
  villa: "Villa",
  house: "Independent House",
  pg: "PG / Hostel",
};

function AllPropertiesCards({ property, actions }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(property._id));
  }, [property._id]);

  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleFavorite(property._id));
  }

  const image =
    property.images?.[0] || "/images/property-placeholder.jpg";

  return (
    <article className="property-card">

      <Link
        to={`/properties/${property._id}`}
        className="property-image-wrapper"
      >
        <img
          src={image}
          alt={property.title}
          className="property-image"
          loading="lazy"
        />

        <span
          className={`listing-badge ${
            property.listingType === "rent"
              ? "rent"
              : "sale"
          }`}
        >
          {property.listingType === "rent"
            ? "For Rent"
            : "For Sale"}
        </span>

        <button
          className={`favorite-btn ${
            saved ? "is-saved" : ""
          }`}
          onClick={handleToggleFavorite}
        >
          <IconHeart
            size={18}
            filled={saved}
          />
        </button>
      </Link>

      <div className="property-content">

        <div className="property-price">

          ₹{Number(property.price).toLocaleString("en-IN")}

          {property.listingType === "rent" && (
            <span>/month</span>
          )}

        </div>

        <h3 className="property-title">

          <Link
            to={`/properties/${property._id}`}
          >
            {property.title}
          </Link>

        </h3>

        <div className="property-location">

          <IconPin size={15} />

          <span>
            {property.city}, {property.state}
          </span>

          {property.propertyType && (
            <span className="property-type-tag">
              {propertyTypeLabels[property.propertyType] || property.propertyType}
            </span>
          )}

        </div>

        <div className="property-features">

          <div>

            <IconBed size={16} />

            {property.bedrooms || 0} Beds

          </div>

          <div>

            <IconBath size={16} />

            {property.bathrooms || 0} Baths

          </div>

          <div>

            <IconArea size={16} />

            {property.area || "--"} sqft

          </div>

        </div>

        <div className="property-footer">

          <Link
            to={`/properties/${property._id}`}
            className="view-btn"
          >
            View Details
          </Link>

          {actions}

        </div>

      </div>

    </article>
  );
}

export default AllPropertiesCards;