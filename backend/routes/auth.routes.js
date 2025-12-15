import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import User from "../models/User.model.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

    if (username.length < 5) return res.status(400).json({ message: "Username must be at least 5 characters long" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long" });
    if (!/(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return res.status(400).json({ message: "Password must contain at least one number and one symbol" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ message: "Username or email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed });
    const userSafe = { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
    req.login(user, (err) => { if (err) return next(err); return res.status(201).json({ user: userSafe }); });
  } catch (err) {
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const userSafe = { id: user._id, username: user.username, email: user.email };
      return res.json({ user: userSafe });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      return res.json({ message: "Logged out" });
    });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.status(401).json({ user: null });
  const user = req.user;
  const userSafe = { id: user._id, username: user.username, email: user.email };
  res.json({ user: userSafe });
});

export default router;
