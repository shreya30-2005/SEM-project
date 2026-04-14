console.log("Starting server...");
const Menu = require("./models/Menu");
const Order = require("./models/Order");
const User = require("./models/User");
const Review = require("./models/Review");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT DB
mongoose.connect("mongodb://127.0.0.1:27017/canteenDB1")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

// TEST
app.get("/", (req, res) => {
  res.send("Server is running");
});


// ---------------- USER ----------------

// Register
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("User registered");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ message: "Login success", role: user.role });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// ---------------- MENU ----------------

// Add item
app.post("/add-item", async (req, res) => {
  const item = new Menu(req.body);
  await item.save();
  res.send("Item added");
});

// Update item
app.patch("/update-item/:id", async (req, res) => {
  try {
    await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send("Item updated");
  } catch (err) {
    res.status(500).send("Error updating item");
  }
});

// Get menu
app.get("/menu", async (req, res) => {
  const items = await Menu.find({
    $or: [
      { available: true },
      { available: { $exists: false } }
    ]
  });

  res.json(items);
});

// Delete item (soft delete)
app.delete("/delete-item/:id", async (req, res) => {
  await Menu.findByIdAndUpdate(req.params.id, { available: false });
  res.send("Item hidden");
});

// ---------------- ORDER ----------------

// Place order
app.post("/place-order", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.send("Order placed");
});

// Get orders
app.get("/orders", async (req, res) => {
  const query = {};
  if (req.query.user) {
    query.user = req.query.user;
  }
  const orders = await Order.find(query).sort({ date: -1 });
  res.json(orders);
});

// Update order status (Admin)
app.patch("/update-order-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.send("Order status updated");
  } catch (err) {
    res.status(500).send("Error updating order");
  }
});

// ---------------- REVIEW ----------------

// Add review
app.post("/add-review", async (req, res) => {
  try {
    console.log('Add review request:', req.body);
    const review = new Review(req.body);
    await review.save();
    console.log('Review saved:', review);
    res.json({ message: "Review added", review });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).send("Error adding review");
  }
});

// Get reviews for a menu item
app.get("/reviews/:menuId", async (req, res) => {
  try {
    const reviews = await Review.find({ menuId: req.params.menuId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).send("Error fetching reviews");
  }
});

// Get average rating for a menu item
app.get("/average-rating/:menuId", async (req, res) => {
  try {
    const reviews = await Review.find({ menuId: req.params.menuId });
    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    res.json({ averageRating: average.toFixed(1), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).send("Error calculating average rating");
  }
});

// ---------------- FAVOURITES ----------------

// Add to favourites
app.post("/add-favourite", async (req, res) => {
  try {
    console.log('Add favourite request:', req.body);
    const { username, menuId } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.favourites) {
      user.favourites = [];
    }

    if (!user.favourites.includes(menuId)) {
      user.favourites.push(menuId);
      await user.save();
    }

    console.log('User after add:', user);
    res.json({ message: "Added to favourites", favourites: user.favourites });
  } catch (err) {
    console.error('Error adding to favourites:', err);
    res.status(500).send("Error adding to favourites");
  }
});

// Remove from favourites
app.post("/remove-favourite", async (req, res) => {
  try {
    console.log('Remove favourite request:', req.body);
    const { username, menuId } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.favourites = user.favourites.filter(id => id.toString() !== menuId);
    await user.save();

    console.log('User after remove:', user);
    res.json({ message: "Removed from favourites", favourites: user.favourites });
  } catch (err) {
    console.error('Error removing from favourites:', err);
    res.status(500).send("Error removing from favourites");
  }
});

// Get user favourites
app.get("/favourites/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('favourites');
    if (user) {
      res.json(user.favourites);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching favourites");
  }
});

console.log("Before server start");
// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
  
});

