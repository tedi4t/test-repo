const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;
const LOG_FILE = "server.log";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });










function logMessage(message) {
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logEntry, "utf8");
}

app.get("/", (req, res) => {
  logMessage("Home page accessed");
  res.send("Welcome to the Node.js Server!");
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  logMessage(`Fetching user data for ID: ${userId}`);

  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ];

  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    logMessage(`User with ID ${userId} not found`);
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    logMessage("File upload failed: No file provided");
    return res.status(400).json({ error: "No file uploaded" });
  }

  logMessage(`File uploaded: ${req.file.filename}`);
  res.json({ message: "File uploaded successfully", filename: req.file.filename });
});

app.use((req, res) => {
  logMessage(`404 - Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  logMessage(`500 - Server Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  logMessage(`Server running on http://localhost:${PORT}`);
});
