// src/routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendMail } = require('../utils/email');
require('dotenv').config();

/* ---------- Register ---------- */
router.post('/register', async (req, res, next) => {
  try {
    let { userId, name, email, password, role = 'student', profile } = req.body;
    
    // Restrict admin signup - only allow student and mentor
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed. Contact system administrator.' });
    }

    // Validate password strength
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!userId) {
      // auto-generate user ID based on role
      const prefix = role === 'mentor' ? 'M' : 'S';
      userId = `${prefix}${Date.now().toString().slice(-6)}`;
    }
    
    const exists = await User.findOne({ $or: [{ email }, { userId }] });
    if (exists)
      return res.status(400).json({ message: 'Email or userId already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId,
      name,
      email,
      passwordHash,
      role,
      profile,
    });
    res.status(201).json({ message: 'Registered successfully', userId: user.userId });
  } catch (e) {
    next(e);
  }
});

/* ---------- Login ---------- */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, isActive: { $ne: false } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.deletedAt) {
      return res.status(403).json({ message: 'Account has been deleted' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES || '7d' }
    );

    res.json({
      token,
      user: { 
        userId: user.userId, 
        name: user.name, 
        role: user.role,
        email: user.email,
        profile: user.profile
      },
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Request password reset ---------- */
router.post('/request-reset', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond positively to prevent user enumeration
      return res.json({ message: 'If the email exists, a reset link was sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await PasswordResetToken.create({ userId: user._id, token, expiresAt });

    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
    const html = `<p>Hello ${user.name},</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 30 minutes.</p>`;

    await sendMail(user.email, 'Password Reset – ByteXL', html);
    res.json({ message: 'If the email exists, a reset link was sent' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Reset password ---------- */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const record = await PasswordResetToken.findOne({ token });
    if (!record)
      return res.status(400).json({ message: 'Invalid or expired token' });

    if (record.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'Token expired' });
    }

    const user = await User.findById(record.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    await PasswordResetToken.deleteOne({ _id: record._id });

    res.json({ message: 'Password reset successful' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
