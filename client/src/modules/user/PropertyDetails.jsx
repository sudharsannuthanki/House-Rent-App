import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, createBooking } from "../../api";
import { getUser } from "../../auth";
import { isFavorite, toggleFavorite } from "../../favorites";
import { IconHeart } from "../../components/icons";
import { Skeleton } from "../../components/Skeleton";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({ startDate: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getPropertyById(id)
      .then(setProperty)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
    setSaved(isFavorite(id));
    setActiveImage(0);
  }, [id]);

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleBook(event) {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await createBooking({ propertyId: id, ...form });
      setSuccess("Request sent! The owner will approve or reject it soon.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div>
          <Skeleton style={{ width: "100%", height: 360, borderRadius: 8, marginBottom: 16 }} />
          <Skeleton style={{ width: "60%", height: 28, marginBottom: 10 }} />
          <Skeleton style={{ width: "40%", height: 16 }} />
        </div>
        <div className="card"><Skeleton style={{ width: "50%", height: 24 }} /></div>
      </div>
    );
  }
  if (!property) return <p className="container empty-state">Property not found.</p>;

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
      <div>
        <div style={{ position: "relative" }}>
          {property.images?.length > 0 ? (
            <img src={property.images[activeImage]} alt={property.title} style={{ width: "100%", borderRadius: 8, maxHeight: 360, objectFit: "cover" }} />
          ) : null}
          <button
            type="button"
            className={`favorite-btn ${saved ? "is-saved" : ""}`}
            onClick={() => setSaved(toggleFavorite(id))}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved properties" : "Save this property"}
          >
            <IconHeart size={18} filled={saved} />
          </button>
        </div>
        {property.images?.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {property.images.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`${property.title} thumbnail ${index + 1}`}
                onClick={() => setActiveImage(index)}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                  opacity: index === activeImage ? 1 : 0.6,
                  outline: index === activeImage ? "2px solid var(--primary)" : "none",
                }}
              />
            ))}
          </div>
        )}
        <h1>{property.title}</h1>
        <p style={{ color: "var(--muted)" }}>{property.street}, {property.city}, {property.state} - {property.pincode}</p>
        <p>{property.bedrooms || 0} bed &middot; {property.bathrooms || 0} bath{property.area ? ` \u00b7 ${property.area} sqft` : ""}</p>
        <p>{property.description}</p>
        {property.amenities?.length > 0 && (
          <p>Amenities: {property.amenities.join(", ")}</p>
        )}
      </div>

      <div className="card" style={{ alignSelf: "start" }}>
        <p className="price">&#8377;{property.price}{property.listingType === "rent" ? " / month" : ""}</p>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Listed by {property.owner?.name}</p>

        {error && <p className="status error">{error}</p>}
        {success && <p className="status success">{success}</p>}

        {!success && (
          <form onSubmit={handleBook}>
            {property.listingType === "rent" && (
              <div className="form-row">
                <label>Move-in date</label>
                <input type="date" name="startDate" required value={form.startDate} onChange={updateForm} />
              </div>
            )}
            <div className="form-row">
              <label>Message (optional)</label>
              <textarea name="message" rows="3" value={form.message} onChange={updateForm} />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : property.listingType === "rent" ? "Request to Book" : "Request to Buy"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PropertyDetails;
