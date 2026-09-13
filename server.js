const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // built-in parser
app.use(cors());

app.use(express.static(path.join(__dirname, "public"))); 
// ilagay mo ang index.html at style.css sa folder na "public"

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// ✅ Connect to MongoDB (simplified, no extra options)
mongoose.connect("mongodb://127.0.0.1:27017/ratingsDB");

// ✅ Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  text: String,
  client: String,
  stars: String
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// ✅ Rating Schema
const ratingSchema = new mongoose.Schema({
  value: Number,
  createdAt: { type: Date, default: Date.now }
});
const Rating = mongoose.model("Rating", ratingSchema);

// ✅ Route: Get testimonials
app.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

// ✅ Route: Submit rating
app.post("/rating", async (req, res) => {
  try {
    const { rating } = req.body;
    console.log("User rating received:", rating);

    if (!rating) {
      return res.status(400).json({ message: "No rating provided" });
    }

    const newRating = new Rating({ value: rating });
    await newRating.save();

    res.json({ message: "Rating received successfully!" });
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Error saving rating" });
  }
});

// ✅ Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
