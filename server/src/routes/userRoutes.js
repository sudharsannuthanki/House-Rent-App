import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// REGISTER: creates a Renter or Owner account (Admins are seeded separately)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, securityQuestion, securityAnswer } = req.body;

    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === "owner" ? "owner" : "user",
      phone,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// FORGOT PASSWORD - step 1: look up the security question for an email
router.post("/forgot-password/verify", async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || "").toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }
    res.json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// FORGOT PASSWORD - step 2: check the answer and set a new password
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const isCorrect = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.securityAnswer);
    if (!isCorrect) {
      return res.status(401).json({ message: "Security answer is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
});

// BROWSE properties - open to everyone, supports simple search/filter
router.get("/properties", async (req, res) => {
  try {
    const { city, listingType, propertyType, search } = req.query;
    const filter = { status: "active" };

    if (city) filter.city = new RegExp(city, "i");
    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;
    if (search) filter.title = new RegExp(search, "i");

    const properties = await Property.find(filter).populate("owner", "name email phone").sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch properties" });
  }
});

// Single property details
router.get("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch property" });
  }
});

// Renter/buyer sends a booking request - owner approves or rejects it later
router.post("/bookings", protect, async (req, res) => {
  try {
    const { propertyId, startDate, message } = req.body;
    const property = await Property.findById(propertyId);

    if (!property || property.status !== "active") {
      return res.status(404).json({ message: "Property not available" });
    }
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own property" });
    }

    if (property.listingType === "rent" && !startDate) {
      return res.status(400).json({ message: "Move-in date is required for rentals" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      property: propertyId,
      type: property.listingType,
      startDate: property.listingType === "rent" ? startDate : undefined,
      message,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Could not create booking", error: error.message });
  }
});

// Renter's own booking history
router.get("/bookings/mine", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("property").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
});

// Renter cancels their own booking
router.patch("/bookings/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Could not cancel booking" });
  }
});

export default router;
