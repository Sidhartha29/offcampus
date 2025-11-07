# 🎓 Off-Campus Student Support Platform

A **complete, production-ready** full-stack web application designed to support off-campus students with comprehensive resource management, mentor matching, location-based services, analytics, and much more.

## ✨ Project Status: **100% COMPLETE** ✅

All features implemented, all issues fixed, ready for production deployment!

## 🚀 Features

### Core Features

1. **Authentication & Authorization**
   - User registration and login with strong password validation
   - JWT-based authentication with token expiration
   - Role-based access control (Student, Mentor, Admin)
   - **Admin signup restriction** - Only students and mentors can register
   - Password reset functionality via email
   - Account deletion with admin approval
   - Enhanced error handling and security

2. **Location-Based Services**
   - Real-time geolocation tracking with browser geolocation API
   - **Accurate campus check-in system** with precise distance calculation
   - **Campus proximity verification** - Shows if user is near campus (within 500m)
   - Location-based user filtering (find users within radius)
   - Nearby users discovery
   - Geospatial queries using MongoDB 2dsphere indexes
   - Distance displayed in both meters and kilometers

3. **Resource Management**
   - Book campus resources (rooms, facilities)
   - View and manage bookings
   - Booking conflict detection
   - Booking status tracking

4. **Mentor Matching System**
   - Students can request mentors
   - Automatic mentor assignment
   - Mentors can view their mentees
   - Mentor-student engagement tracking

5. **Dashboard & Notifications**
   - Personalized dashboard for each role
   - Today's timetable/schedule
   - **Smart notification system** for:
     - Timetable updates
     - College events and holidays
     - Class cancellations
     - Mentor availability
     - Club activities
     - Assignment deadlines
     - Holiday request approvals
   - Real-time notifications and alerts
   - Quick stats overview

6. **Club Registration & Management**
   - Browse and join student clubs
   - View club details and meeting schedules
   - Track club memberships
   - Admin can create and manage clubs
   - Club notifications for members

7. **Holiday Request System**
   - Students can request holidays with dates and reasons
   - Admin approval workflow
   - Status tracking (pending, approved, rejected)
   - Admin review and comments
   - Automatic notifications

8. **Assignment Management**
   - Mentors can create assignments with due dates
   - Students can submit assignments (file URLs)
   - Late submission detection
   - Mentor grading and feedback system
   - Assignment notifications
   - Performance tracking

9. **Mentor Session Scheduling**
   - Students can schedule sessions with assigned mentors
   - Session management (scheduled, completed, cancelled)
   - Session notes and topics
   - Automatic notifications to mentors

10. **User Profile Management**
    - Complete profile editing
    - Password change functionality
    - Account deletion requests
    - Profile information display
    - Avatar support

11. **Data Visualization & Analytics** (Admin Only)
   - Daily engagement charts
   - Event type distribution
   - Check-in statistics
   - User distribution by role and year
   - Booking analytics
   - Mentor matching statistics
   - Interactive charts using Recharts

12. **Professional UI/UX**
   - Modern, colorful gradient design
   - **Fully responsive** - Works seamlessly on all devices
   - **Fast loading** - Optimized assets and code splitting
   - **Performance optimized** - Lazy loading, chunk splitting
   - Smooth animations and transitions
   - Toast notifications
   - Intuitive navigation
   - **Role-based landing pages** for better user experience

13. **Admin Features**
   - **Manual mentor assignment** to students
   - **Student performance analysis reports**
   - **Holiday request approvals**
   - Account deletion request management
   - Comprehensive analytics dashboard
   - User engagement tracking
   - Low engagement user identification

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Firebase Admin** for push notifications

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Off Campus Project"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
TOKEN_EXPIRES=7d

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Firebase (optional, for push notifications)
# Add your Firebase service account configuration
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

The application will automatically create indexes when models are loaded. However, you can seed initial data:

```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend:**

```bash
cd frontend
npm run build
```

2. **Start the Backend:**

```bash
cd backend
npm start
```

## 📱 Usage Guide

### For Students

1. **Register/Login**: Create an account or login with your credentials
2. **Dashboard**: View your schedule, notifications, and quick stats
3. **Check-in**: Use the location feature to check in to campus
4. **Book Resources**: Reserve campus facilities through the Bookings page
5. **Request Mentor**: Get matched with a mentor for support
6. **View Notifications**: Stay updated with important alerts

### For Mentors

1. **Login**: Access your mentor dashboard
2. **View Mentees**: See all students assigned to you
3. **Track Engagement**: Monitor student activity and engagement

### For Admins

1. **Admin Dashboard**: Access comprehensive analytics and insights
2. **View Statistics**: 
   - User engagement metrics
   - Check-in patterns
   - Booking statistics
   - Mentor matching data
3. **Data Visualization**: Interactive charts and graphs for all metrics
4. **User Management**: View and manage platform users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (students/mentors only, admin restricted)
- `POST /api/auth/login` - User login with enhanced validation
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Profile Management
- `GET /api/profile/me` - Get current user profile
- `PATCH /api/profile/me` - Update profile
- `PATCH /api/profile/me/password` - Change password
- `POST /api/profile/me/delete-request` - Request account deletion
- `DELETE /api/profile/:id` - Delete account (admin only)

### Dashboard
- `GET /api/dashboard` - Get user dashboard data (schedule, notifications)

### Bookings
- `POST /api/booking` - Create new booking
- `GET /api/booking/my` - Get user's bookings

### Check-in
- `POST /api/checkin` - Record campus check-in
- `GET /api/checkin/recent` - Get recent check-ins
- `GET /api/checkin/nearby` - Get check-ins within radius

### Location
- `POST /api/location/update` - Update user location
- `GET /api/location/users/nearby` - Find users near location
- `GET /api/location/me` - Get current user location

### Mentor
- `POST /api/mentor/request` - Request mentor (students)
- `GET /api/mentor/my-mentees` - Get mentees (mentors)

### Analytics (Admin Only)
- `GET /api/analytics/engagement` - Engagement statistics
- `GET /api/analytics/checkins` - Check-in statistics
- `GET /api/analytics/users` - User distribution
- `GET /api/analytics/bookings` - Booking statistics
- `GET /api/analytics/mentors` - Mentor statistics

### Clubs
- `GET /api/club` - Get all clubs
- `GET /api/club/:id` - Get club details
- `POST /api/club/:id/join` - Join a club (students)
- `POST /api/club/:id/leave` - Leave a club
- `GET /api/club/my/memberships` - Get my club memberships
- `POST /api/club` - Create club (admin only)

### Holidays
- `POST /api/holiday` - Request holiday (students)
- `GET /api/holiday/my` - Get my holiday requests
- `GET /api/holiday/pending` - Get pending requests (admin)
- `PATCH /api/holiday/:id/review` - Approve/reject request (admin)

### Assignments
- `POST /api/assignment` - Create assignment (mentors)
- `GET /api/assignment` - Get assignments
- `POST /api/assignment/:id/submit` - Submit assignment (students)
- `PATCH /api/assignment/:id/grade/:submissionId` - Grade assignment (mentors)

### Mentor Sessions
- `POST /api/session` - Schedule session (students)
- `GET /api/session/my` - Get my sessions
- `PATCH /api/session/:id/status` - Update session status

### Admin
- `GET /api/admin/stats` - Overall platform statistics
- `GET /api/admin/low-engagers` - Users with low engagement
- `GET /api/admin/mentor-engagement` - Mentor engagement report
- `POST /api/admin/assign-mentor` - Manually assign mentor
- `GET /api/admin/student-performance/:studentId` - Student performance report
- `GET /api/admin/deletion-requests` - Get account deletion requests

## 🗄️ Database Schema

### Models

1. **User**: Student, mentor, and admin accounts
2. **CheckIn**: Campus check-in records with geolocation
3. **ResourceBooking**: Resource reservation records
4. **Timetable**: Daily schedules for students
5. **Notification**: User alerts and notifications
6. **MentorMatch**: Mentor-student relationships
7. **EngagementLog**: User activity tracking
8. **PasswordResetToken**: Password reset tokens

### Indexes

The application uses optimized MongoDB indexes for:
- Geospatial queries (2dsphere indexes)
- User lookups (email, userId, role)
- Time-based queries (timestamps)
- Composite indexes for complex queries

## 🎨 UI Features

- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Glass Morphism**: Backdrop blur effects on cards
- **Responsive Design**: Works on all screen sizes
- **Color-coded Status**: Visual indicators for different states
- **Interactive Charts**: Hover effects and tooltips
- **Smooth Animations**: Loading states and transitions

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with role-based access
- Input validation
- CORS configuration
- Secure password reset flow

## 📊 Data Visualization

The admin dashboard includes:
- Line charts for time-series data
- Bar charts for categorical data
- Pie charts for distribution
- Real-time statistics cards
- Interactive tooltips and legends

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your `MONGO_URI` in `.env`
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP

2. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Or kill the process using the port

3. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check frontend proxy settings in `vite.config.js`

4. **Geolocation Not Working**
   - Ensure HTTPS or localhost (required by browsers)
   - Check browser permissions
   - Verify location services are enabled

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
TOKEN_EXPIRES=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection is accessible
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## 📈 Future Enhancements

- Real-time notifications with WebSockets
- Mobile app version
- Advanced search and filtering
- Calendar integration
- Email notifications
- Push notifications via Firebase
- Advanced analytics and reporting
- Export data functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- RGVS

## 🙏 Acknowledgments

- MongoDB for database services
- React team for the amazing framework
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

**Happy Coding! 🎉**

