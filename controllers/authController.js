const jwt = require("jsonwebtoken");
const User = require("../models/User");

// sign a token that carries identity + role
function signToken(user) {
return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
expiresIn: "3d", 
});
}

// Return only safe user fields
function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already in use",
      });
    }
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);

  }
};

// GET /auth/me
exports.me = async (req, res, next) => {
  return res.status(200).json({
    user: safeUser(req.user),
  });
};