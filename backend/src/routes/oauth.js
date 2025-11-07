const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/* ---------- Google OAuth Login ---------- */
router.post('/google', async (req, res, next) => {
  try {
    const { email, name, googleId, picture } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Google account
      const userId = `S${Date.now().toString().slice(-6)}`;
      const randomPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        userId,
        name,
        email,
        passwordHash,
        role: 'student', // Default role for OAuth users
        profile: {
          avatar: picture
        }
      });
    } else {
      // Update avatar if provided
      if (picture && !user.profile?.avatar) {
        user.profile = user.profile || {};
        user.profile.avatar = picture;
        await user.save();
      }
    }

    // Check if account is active
    if (!user.isActive || user.deletedAt) {
      return res.status(403).json({ message: 'Account is inactive or deleted' });
    }

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
      }
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Microsoft OAuth Login ---------- */
router.post('/microsoft', async (req, res, next) => {
  try {
    const { email, name, microsoftId, picture } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Microsoft account
      const userId = `S${Date.now().toString().slice(-6)}`;
      const randomPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        userId,
        name,
        email,
        passwordHash,
        role: 'student', // Default role for OAuth users
        profile: {
          avatar: picture
        }
      });
    } else {
      // Update avatar if provided
      if (picture && !user.profile?.avatar) {
        user.profile = user.profile || {};
        user.profile.avatar = picture;
        await user.save();
      }
    }

    // Check if account is active
    if (!user.isActive || user.deletedAt) {
      return res.status(403).json({ message: 'Account is inactive or deleted' });
    }

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
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

