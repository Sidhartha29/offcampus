const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/* ---------- Get my profile ---------- */
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .lean();
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

/* ---------- Update my profile ---------- */
router.patch('/me', async (req, res, next) => {
  try {
    const updates = req.body;
    delete updates.passwordHash;
    delete updates.role;
    delete updates.userId;
    delete updates.email; // Email should be changed through separate endpoint

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({ user });
  } catch (e) {
    next(e);
  }
});

/* ---------- Change password ---------- */
router.patch('/me/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    const user = await User.findById(req.user._id);
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Request account deletion ---------- */
router.post('/me/delete-request', async (req, res, next) => {
  try {
    // In production, this should create a deletion request that requires admin approval
    // For now, we'll mark the account as inactive
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      deletedAt: new Date()
    });

    res.json({ message: 'Account deletion requested. Admin approval required.' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Approve account deletion (admin only) ---------- */
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete accounts' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

