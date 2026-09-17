const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://interview-ai-kappa-dun.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Interview AI backend is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "MulterError" || error.message === "Only PDF files are allowed.") {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
});

module.exports = app;
