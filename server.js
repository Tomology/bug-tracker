const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/dashboard", require("./routes/api/dashboard"));
app.use("/api/people", require("./routes/api/people"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/teams", require("./routes/api/teams"));
app.use("/api/users", require("./routes/api/users"));
