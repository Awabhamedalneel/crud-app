const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./models/users");
const port = 3400;

const app = express();
app.use(cors());
app.use(express.json());

// For deployment, use an environment variable for the MongoDB connection string
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crud")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/getusers", async (req, res) => {
  users
    .find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json({ message: err.message }));
});

app.get("/getusers/:id", async (req, res) => {
  users
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(400).json({ message: err.message }));
});

app.post("/createusers", async (req, res) => {
  users
    .create(req.body)
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json({ message: err.message }));
});

// Update user by ID
app.put("/updateuser/:id", async (req, res) => {
  const { id } = req.params;
  users
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    })
    .catch((err) => res.status(400).json({ message: err.message }));
});

// Delete user by ID
app.delete("/deleteuser/:id", async (req, res) => {
  users
    .findByIdAndDelete(req.params.id)
    .then((result) => res.json({ success: true, result }))
    .catch((err) => res.status(500).json({ success: false, error: err }));
});

app.listen(port, () => console.log(`server running on port ${port}`));
