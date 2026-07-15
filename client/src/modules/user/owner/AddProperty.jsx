import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProperty, updateProperty, getPropertyById } from "../../../api";
import Toast from "../../common/Toast";

const initialForm = {
  title: "", description: "", street: "", city: "", state: "", pincode: "",
  listingType: "rent", propertyType: "apartment", price: "", bedrooms: "", bathrooms: "", area: "", amenities: "",
};

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "Independent House" },
  { value: "pg", label: "PG / Hostel" },
];

function AddProperty() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditMode) return;

    getPropertyById(id)
      .then((property) => {
        setForm({
          title: property.title || "",
          description: property.description || "",
          street: property.street || "",
          city: property.city || "",
          state: property.state || "",
          pincode: property.pincode || "",
          listingType: property.listingType || "rent",
          propertyType: property.propertyType || "apartment",
          price: property.price ?? "",
          bedrooms: property.bedrooms ?? "",
          bathrooms: property.bathrooms ?? "",
          area: property.area ?? "",
          amenities: (property.amenities || []).join(", "),
        });
        setExistingImages(property.images || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((file) => formData.append("images", file));

      if (isEditMode) {
        await updateProperty(id, formData);
      } else {
        await addProperty(formData);
      }
      navigate("/owner/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="container" style={{ maxWidth: 560 }}><p>Loading property...</p></div>;
  }

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h1>{isEditMode ? "Edit Property" : "Add Property"}</h1>
      <div className="card">
        <Toast message={error} type="error" />

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input name="title" required value={form.title} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea name="description" rows="3" required value={form.description} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Street</label>
            <input name="street" required value={form.street} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>City</label>
            <input name="city" required value={form.city} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>State</label>
            <input name="state" required value={form.state} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Pincode</label>
            <input name="pincode" required value={form.pincode} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Listing type</label>
            <select name="listingType" value={form.listingType} onChange={updateForm}>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
          <div className="form-row">
            <label>Property type</label>
            <select name="propertyType" value={form.propertyType} onChange={updateForm}>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Price</label>
            <input type="number" name="price" required value={form.price} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Bedrooms</label>
            <input type="number" name="bedrooms" value={form.bedrooms} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Bathrooms</label>
            <input type="number" name="bathrooms" value={form.bathrooms} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Area (sqft)</label>
            <input type="number" name="area" value={form.area} onChange={updateForm} />
          </div>
          <div className="form-row">
            <label>Amenities (comma separated)</label>
            <input name="amenities" value={form.amenities} onChange={updateForm} placeholder="Parking, Lift" />
          </div>

          {isEditMode && existingImages.length > 0 && (
            <div className="form-row">
              <label>Current images</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {existingImages.map((src) => (
                  <img key={src} src={src} alt="Current listing" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} />
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <label>{isEditMode ? "Add more images (optional)" : "Images"}</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
          </div>

          <button className="btn" type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
