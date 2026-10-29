require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB error:", err));

app.use("/auth", authRoutes);

app.use(notFound); 
app.use(errorHandler); 
app.listen(3000, () => console.log("Server on port 3000"));