import mongoose from "mongoose";

// Blueprint for a registered account. role decides what the person can do:
// "admin" oversees everything, "owner" lists properties, "user" rents/buys.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner", "user"], default: "user" },
    phone: { type: String, trim: true },
    // Used for the in-app "forgot password" flow (no email sending needed)
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
