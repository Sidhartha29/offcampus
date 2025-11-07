const router = require('express').Router();
const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');
const User = require('../models/User');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/* ---------- Request OTP for login ---------- */
router.post('/request', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    await OTP.create({
      email,
      otp,
      expiresAt
    });

    // Send OTP via email (mock for now, configure SMTP in production)
    try {
      await sendMail(
        email,
        'Your Login OTP',
        `
        <h2>Your Login OTP</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Still return success as OTP is generated (for development)
    }

    res.json({ 
      message: 'OTP sent to your email',
      // In development, return OTP for testing (remove in production)
      ...(process.env.NODE_ENV !== 'production' && { otp })
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Verify OTP and login ---------- */
router.post('/verify', async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is provided, verify it
    if (password) {
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(400).json({ message: 'Invalid password' });
      }
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Generate JWT token
    const jwt = require('jsonwebtoken');
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

