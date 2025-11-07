// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const protect = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const mentorRoutes = require('./routes/mentor');
const bookingRoutes = require('./routes/booking');
const checkinRoutes = require('./routes/checkin');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/location');
const analyticsRoutes = require('./routes/analytics');
const clubRoutes = require('./routes/club');
const holidayRoutes = require('./routes/holiday');
const assignmentRoutes = require('./routes/assignment');
const sessionRoutes = require('./routes/session');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notification');
const oauthRoutes = require('./routes/oauth');
const otpRoutes = require('./routes/otp');
const leisureRoutes = require('./routes/leisure');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ---------- API routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/leisure', protect, leisureRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/mentor', protect, mentorRoutes);
app.use('/api/booking', protect, bookingRoutes);
app.use('/api/checkin', protect, checkinRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/location', protect, locationRoutes);
app.use('/api/analytics', protect, analyticsRoutes);
app.use('/api/club', protect, clubRoutes);
app.use('/api/holiday', protect, holidayRoutes);
app.use('/api/assignment', protect, assignmentRoutes);
app.use('/api/session', protect, sessionRoutes);
app.use('/api/profile', protect, profileRoutes);
app.use('/api/notification', protect, notificationRoutes);

/* ---------- Global error handler ---------- */
app.use(errorHandler);

/* ---------- Start server ---------- */
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});