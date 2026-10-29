const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        if (!token) return res.status(401).json({ error: "Not logged in" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ error: "User no longer exists" });
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

