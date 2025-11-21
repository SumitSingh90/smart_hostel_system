// ---------------------------
// SERVER SETUP
// ---------------------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------
// ENV VARIABLES
// ---------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ---------------------------
// MONGOOSE MODELS
// ---------------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  contact: { type: Number, required: true, maxLength: 10 },
  password: String,
  role: { type: String, enum: ["admin", "student", "worker"], required: true },
  roomNo: String, // only for students
});

const User = mongoose.model("User", userSchema);

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  description: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

const cleanSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomNo: String,
  preferredTime: String,
  status: { type: String, default: "pending" },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Cleaning = mongoose.model("Cleaning", cleanSchema);

// ---------------------------
// MIDDLEWARES
// ---------------------------
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const role = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: "Forbidden" });
  next();
};

// ---------------------------
// AUTH ROUTES
// ---------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN BODY =>", req.body);

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

// ---------------------------
// USER MANAGEMENT (Admin only)
// ---------------------------
app.post("/api/create-user", auth, role(["admin"]), async (req, res) => {
  const { name, email, contact, password, role, roomNo } = req.body;
  console.log("BODY =>", req.body);
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, contact, password: hashed, role, roomNo });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Error creating user" });
  }
});

app.get("/api/users", auth, role(["admin"]), async (req, res) => {
  const users = await User.find({});
  res.json({ users });
});

app.get("/api/dashboard/room-status", async (req, res) => {
  try {
    // Get all students with rooms
    const students = await User.find({ role: "student" });

    // Get cleaning requests
    const cleaningRequests = await Cleaning.find().sort({ createdAt: -1 });

    // Mapping room -> latest cleaning status
    const roomMap = {};

    cleaningRequests.forEach((req) => {
      if (!roomMap[req.roomNo]) {
        roomMap[req.roomNo] = {
          roomNo: req.roomNo,
          status: req.status,
          student: req.student,
          assignedWorker: req.assignedWorker || null,
          lastRequestDate: req.createdAt,
        };
      }
    });

    // Build final room list
    const rooms = students.map((s) => ({
      roomNo: s.roomNo || "-",
      student: s.name,
      status: roomMap[s.roomNo]?.status || "Not Requested",
      worker: roomMap[s.roomNo]?.assignedWorker || null,
      lastRequestDate: roomMap[s.roomNo]?.lastRequestDate || null,
    }));

    // Summary stats
    const totalRooms = rooms.length;
    const cleaned = rooms.filter((r) => r.status === "completed").length;
    const pending = rooms.filter((r) => r.status === "pending").length;
    const notRequested = rooms.filter((r) => r.status === "Not Requested").length;

    res.json({
      totalRooms,
      cleaned,
      pending,
      notRequested,
      rooms,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});


// ---------------------------
// COMPLAINT ROUTES
// ---------------------------
app.post("/api/complaint", auth, role(["student"]), async (req, res) => {
  const { category, description } = req.body;
  const complaint = await Complaint.create({
    student: req.user._id,
    category,
    description,
  });
  res.json(complaint);
});

app.get("/api/student/complaints", auth, role(["student"]), async (req, res) => {
  const complaints = await Complaint.find({ student: req.user._id });
  res.json(complaints);
});

app.get("/api/complaints/all", auth, role(["admin"]), async (req, res) => {
  const complaints = await Complaint.find({})
    .populate("student", "name email roomNo");
  res.json(complaints);
});

app.put("/api/complaints/:id/resolve", auth, role(["admin"]), async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: "resolved" },
    { new: true }
  ).populate("student", "name email roomNo");
  res.json(complaint);
});

// ---------------------------
// CLEANING REQUEST ROUTES
// ---------------------------
app.post("/api/clean", auth, role(["student"]), async (req, res) => {
  const { roomNo, preferredTime } = req.body;
  const cleaning = await Cleaning.create({
    student: req.user._id,
    roomNo,
    preferredTime,
  });
  res.json(cleaning);
});

app.get("/api/student/cleanRequests", auth, role(["student"]), async (req, res) => {
  const requests = await Cleaning.find({ student: req.user._id })
    .populate("assignedWorker", "name email");
  res.json(requests);
});

app.get("/api/cleaning/all", auth, role(["admin"]), async (req, res) => {
  const requests = await Cleaning.find({})
    .populate("student", "name email roomNo")
    .populate("assignedWorker", "name email");
  res.json(requests);
});

app.put("/api/cleaning/:id/assign", auth, role(["admin"]), async (req, res) => {
  const { workerId } = req.body;
  const request = await Cleaning.findByIdAndUpdate(
    req.params.id,
    { assignedWorker: workerId },
    { new: true }
  )
    .populate("student", "name email roomNo")
    .populate("assignedWorker", "name email");
  res.json(request);
});

app.get("/api/worker/assigned", auth, role(["worker"]), async (req, res) => {
  const requests = await Cleaning.find({ assignedWorker: req.user._id })
    .populate("student", "name email roomNo");
  res.json(requests);
});

app.put("/api/cleaning/:id/status", auth, role(["worker"]), async (req, res) => {
  const { status } = req.body;
  const request = await Cleaning.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
    .populate("student", "name email roomNo")
    .populate("assignedWorker", "name email");
  res.json(request);
});

// ---------------------------
// CONNECT TO MONGO & START SERVER
// ---------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));