const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/dashboard", require("./routes/api/dashboard"));
app.use("/api/people", require("./routes/api/people"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/teams", require("./routes/api/teams"));
app.use("/api/users", require("./routes/api/users"));

// Serve static assets in production.
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
