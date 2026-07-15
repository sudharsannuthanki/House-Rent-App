import mongoose from "mongoose";

// Blueprint for a property listing, either for rent or for sale.
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    listingType: { type: String, enum: ["rent", "sale"], required: true },
    propertyType: { type: String, enum: ["apartment", "villa", "house", "pg"], default: "apartment" },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, min: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
