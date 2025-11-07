# 🎓 Off-Campus Student Support Platform - Complete Feature Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Who Can Do What - Role-Based Capabilities](#who-can-do-what)
3. [Feature Breakdown by Location](#feature-breakdown-by-location)
4. [Complete Feature List](#complete-feature-list)

---

## 🎯 Project Overview

This is a **complete full-stack web application** designed to support off-campus students with:
- **Location-based services** (campus check-in, proximity tracking)
- **Resource management** (room bookings, facilities)
- **Mentor-student matching** and session scheduling
- **Academic management** (assignments, holidays, clubs)
- **Analytics and reporting** (admin dashboard)
- **Smart notifications** for all activities
- **Multilingual support** (English, Spanish, Hindi)

---

## 👥 Who Can Do What - Role-Based Capabilities

### 🔴 **ADMIN** - Full System Control

**Authentication:**
- ✅ **CANNOT** register through public signup (security restriction)
- ✅ Must be created manually in database or by another admin
- ✅ Can login with admin credentials
- ✅ Has access to all admin features

**Dashboard & Analytics** (`/admin`):
- ✅ View comprehensive analytics:
  - Daily engagement statistics
  - Check-in trends
  - User distribution (by role, year)
  - Booking statistics
  - Mentor matching data
- ✅ Interactive charts and graphs
- ✅ Real-time statistics overview

**User Management:**
- ✅ View all users (students, mentors, admins)
- ✅ View user profiles and details
- ✅ Activate/deactivate user accounts
- ✅ Approve/reject account deletion requests
- ✅ View pending deletion requests

**Mentor Assignment:**
- ✅ Manually assign mentors to students
- ✅ View all mentor-student matches
- ✅ View mentor availability
- ✅ Manage mentor assignments

**Student Performance:**
- ✅ View detailed performance reports for any student
- ✅ Track assignment submissions
- ✅ View check-in history
- ✅ Analyze engagement metrics
- ✅ Access student-specific analytics

**Holiday Management:**
- ✅ View all holiday requests
- ✅ Approve or reject holiday requests
- ✅ Add comments to requests
- ✅ View holiday request history

**Club Management:**
- ✅ Create new clubs
- ✅ Edit club details
- ✅ Assign club presidents
- ✅ View all club memberships
- ✅ Manage club status (active/inactive)

**Resource Management:**
- ✅ View all resource bookings
- ✅ Manage campus resources
- ✅ View booking conflicts

**Notifications:**
- ✅ Send system-wide notifications
- ✅ View notification statistics
- ✅ Manage notification settings

**Pages Accessible:**
- `/admin` - Main admin dashboard
- `/admin/student-performance/:studentId` - Student performance reports
- `/profile` - Own profile management
- `/notifications` - View notifications

---

### 🟢 **MENTOR** - Student Support & Guidance

**Authentication:**
- ✅ Can register through public signup
- ✅ Can login with mentor credentials
- ✅ Has dedicated mentor dashboard

**Dashboard** (`/mentor`):
- ✅ View assigned mentees list
- ✅ View mentee profiles and details
- ✅ Quick stats overview
- ✅ Today's schedule
- ✅ Upcoming sessions

**Mentee Management:**
- ✅ View all assigned students
- ✅ View student profiles
- ✅ Access student performance data
- ✅ View student check-in history
- ✅ Track student engagement

**Assignment Management** (`/assignments`):
- ✅ Create assignments with:
  - Title and description
  - Due dates
  - Instructions
- ✅ View all created assignments
- ✅ View student submissions
- ✅ Grade assignments
- ✅ Provide feedback on submissions
- ✅ Track late submissions
- ✅ View assignment statistics

**Session Management** (`/sessions`):
- ✅ View all scheduled sessions with students
- ✅ Update session status (scheduled → completed/cancelled)
- ✅ View session history
- ✅ See session topics and notes
- ✅ Manage session availability

**Analytics:**
- ✅ View engagement statistics for mentees
- ✅ Track mentee activity
- ✅ View check-in patterns

**Notifications:**
- ✅ Receive notifications for:
  - New session requests
  - Assignment submissions
  - Student check-ins
  - Holiday requests from mentees

**Profile Management** (`/profile`):
- ✅ Update profile information
- ✅ Change password
- ✅ Update bio and contact details
- ✅ Request account deletion

**Pages Accessible:**
- `/mentor` - Mentor dashboard
- `/assignments` - Assignment management
- `/sessions` - Session scheduling
- `/profile` - Profile management
- `/notifications` - View notifications

---

### 🔵 **STUDENT** - Core User Features

**Authentication:**
- ✅ Can register through public signup
- ✅ Can login with student credentials
- ✅ Can use Google/Microsoft OAuth (mock implementation)
- ✅ Password reset functionality

**Dashboard** (`/dashboard`):
- ✅ View today's timetable/schedule
- ✅ View upcoming classes
- ✅ Quick access to all features
- ✅ Recent notifications
- ✅ Quick stats

**Location Services** (`/dashboard`):
- ✅ **Campus Check-In:**
  - Real-time geolocation tracking
  - Automatic distance calculation from campus
  - Shows if near campus (within 500m) or far
  - Distance displayed in meters and kilometers
  - Check-in history
- ✅ View check-in statistics
- ✅ Location-based proximity verification

**Resource Booking** (`/bookings`):
- ✅ Book campus resources (rooms, facilities)
- ✅ View all bookings
- ✅ View booking history
- ✅ Cancel bookings
- ✅ View booking status

**Mentor Features** (`/mentor`):
- ✅ View assigned mentor profile
- ✅ View mentor contact information
- ✅ Request mentor assignment (if not assigned)
- ✅ Schedule sessions with mentor
- ✅ View mentor availability

**Session Scheduling** (`/sessions`):
- ✅ Schedule sessions with assigned mentor
- ✅ Select date and time
- ✅ Add session topic/notes
- ✅ View scheduled sessions
- ✅ View session history
- ✅ Cancel sessions

**Assignment Management** (`/assignments`):
- ✅ View all assigned assignments
- ✅ View assignment details and due dates
- ✅ Submit assignments (file URLs)
- ✅ View submission status
- ✅ View grades and feedback
- ✅ Track late submissions

**Club Management** (`/clubs`):
- ✅ Browse all available clubs
- ✅ View club details
- ✅ Join clubs
- ✅ View joined clubs
- ✅ Leave clubs
- ✅ View club meeting schedules
- ✅ Receive club notifications

**Holiday Requests** (`/holidays`):
- ✅ Request holidays with:
  - Start and end dates
  - Reason for request
- ✅ View request status (pending/approved/rejected)
- ✅ View holiday request history
- ✅ Receive approval/rejection notifications

**Profile Management** (`/profile`):
- ✅ Update profile information:
  - Name, email, phone
  - College, year, hometown
  - Bio, avatar
  - Commuting status
- ✅ Change password
- ✅ Request account deletion (requires admin approval)

**Notifications** (`/notifications`):
- ✅ View all notifications
- ✅ Mark notifications as read
- ✅ Receive notifications for:
  - Timetable updates
  - Assignment deadlines
  - Session confirmations
  - Holiday approvals/rejections
  - Club activities
  - Mentor messages
  - Booking confirmations

**Pages Accessible:**
- `/dashboard` - Student dashboard
- `/bookings` - Resource bookings
- `/mentor` - Mentor information
- `/sessions` - Session scheduling
- `/assignments` - Assignment submissions
- `/clubs` - Club management
- `/holidays` - Holiday requests
- `/profile` - Profile management
- `/notifications` - View notifications

---

## 📍 Feature Breakdown by Location

### **Frontend Pages** (`frontend/src/pages/`)

#### **Landing.jsx** (`/landing`)
- **Purpose:** Role-based landing page
- **Features:**
  - Welcome screen
  - Role selection (Student/Mentor)
  - Navigation to login/register
  - Project overview

#### **Login.jsx** (`/login`)
- **Purpose:** User authentication
- **Features:**
  - Email/password login
  - Google OAuth button (mock)
  - Microsoft OAuth button (mock)
  - Role-based redirection after login
  - Password reset link

#### **Register.jsx** (`/register`)
- **Purpose:** User registration
- **Features:**
  - Student registration
  - Mentor registration
  - Admin registration blocked
  - Form validation
  - Password strength requirements

#### **Dashboard.jsx** (`/dashboard`)
- **Purpose:** Student main dashboard
- **Who:** Students only
- **Features:**
  - Today's timetable display
  - Campus check-in with geolocation
  - Distance calculation and proximity display
  - Recent notifications
  - Quick stats
  - Quick access to all features

#### **MentorDashboard.jsx** (`/mentor`)
- **Purpose:** Mentor main dashboard
- **Who:** Mentors only
- **Features:**
  - Assigned mentees list
  - Quick stats
  - Today's schedule
  - Upcoming sessions
  - Quick actions

#### **Mentor.jsx** (`/mentor`)
- **Purpose:** Mentor-student interaction
- **Who:** Students (view mentor) / Mentors (view mentees)
- **Features:**
  - View assigned mentor (students)
  - View all mentees (mentors)
  - Schedule session button
  - View performance link (mentors)
  - Mentor profile display

#### **AdminEnhanced.jsx** (`/admin`)
- **Purpose:** Comprehensive admin dashboard
- **Who:** Admins only
- **Features:**
  - Analytics charts (engagement, check-ins, users, bookings)
  - Pending holiday requests
  - Account deletion requests
  - Low engagers list
  - Mentor assignment UI
  - Quick stats overview
  - User management

#### **StudentPerformance.jsx** (`/admin/student-performance/:studentId`)
- **Purpose:** Detailed student performance report
- **Who:** Admins and Mentors
- **Features:**
  - Student profile overview
  - Assignment submission history
  - Check-in statistics
  - Engagement metrics
  - Performance charts
  - Session history

#### **Assignments.jsx** (`/assignments`)
- **Purpose:** Assignment management
- **Who:** Students and Mentors
- **Features:**
  - **Students:**
    - View assigned assignments
    - Submit assignments
    - View grades and feedback
  - **Mentors:**
    - Create assignments
    - View submissions
    - Grade assignments
    - Provide feedback

#### **Sessions.jsx** (`/sessions`)
- **Purpose:** Mentor session scheduling
- **Who:** Students and Mentors
- **Features:**
  - **Students:**
    - Schedule sessions with mentor
    - View scheduled sessions
    - Cancel sessions
  - **Mentors:**
    - View session requests
    - Update session status
    - View session history

#### **Clubs.jsx** (`/clubs`)
- **Purpose:** Club registration and management
- **Who:** Students (join) / Admins (create/manage)
- **Features:**
  - Browse all clubs
  - Join/leave clubs
  - View club details
  - View memberships
  - Admin: Create and manage clubs

#### **Holidays.jsx** (`/holidays`)
- **Purpose:** Holiday request system
- **Who:** Students (request) / Admins (approve)
- **Features:**
  - **Students:**
    - Request holidays
    - View request status
    - View history
  - **Admins:**
    - View all requests
    - Approve/reject requests
    - Add comments

#### **Bookings.jsx** (`/bookings`)
- **Purpose:** Resource booking management
- **Who:** Students
- **Features:**
  - Book campus resources
  - View bookings
  - Cancel bookings
  - View booking history

#### **Profile.jsx** (`/profile`)
- **Purpose:** User profile management
- **Who:** All users
- **Features:**
  - View profile information
  - Edit profile
  - Change password
  - Request account deletion
  - Update avatar

#### **Notifications.jsx** (`/notifications`)
- **Purpose:** Notification center
- **Who:** All users
- **Features:**
  - View all notifications
  - Mark as read
  - Filter notifications
  - Delete notifications

---

### **Backend Routes** (`backend/src/routes/`)

#### **auth.js** (`/api/auth`)
- `POST /register` - User registration (students/mentors only)
- `POST /login` - User login
- `POST /reset-password` - Request password reset
- `POST /reset-password/:token` - Reset password with token
- `GET /me` - Get current user info

#### **checkin.js** (`/api/checkin`)
- `POST /` - Create check-in with location
- `GET /` - Get user's check-in history
- `GET /stats` - Get check-in statistics
- `GET /nearby` - Find nearby users

#### **dashboard.js** (`/api/dashboard`)
- `GET /` - Get today's timetable and notifications

#### **booking.js** (`/api/booking`)
- `POST /` - Create resource booking
- `GET /` - Get user's bookings
- `DELETE /:id` - Cancel booking

#### **mentor.js** (`/api/mentor`)
- `POST /request` - Request mentor assignment
- `GET /my-mentor` - Get assigned mentor (students)
- `GET /my-mentees` - Get assigned mentees (mentors)
- `GET /matches` - Get all mentor matches

#### **admin.js** (`/api/admin`)
- `GET /stats` - Get system statistics
- `GET /users` - Get all users
- `POST /assign-mentor` - Manually assign mentor
- `GET /student-performance/:studentId` - Get student performance
- `GET /deletion-requests` - Get pending deletion requests
- `POST /approve-deletion/:userId` - Approve account deletion
- `GET /holiday-requests` - Get all holiday requests
- `POST /holiday-requests/:id/approve` - Approve holiday request
- `POST /holiday-requests/:id/reject` - Reject holiday request

#### **club.js** (`/api/club`)
- `GET /` - Get all clubs
- `GET /:id` - Get club details
- `POST /` - Create club (admin)
- `POST /:id/join` - Join club (student)
- `POST /:id/leave` - Leave club (student)
- `GET /my-clubs` - Get user's clubs

#### **holiday.js** (`/api/holiday`)
- `POST /` - Create holiday request (student)
- `GET /` - Get user's holiday requests
- `GET /all` - Get all requests (admin)
- `GET /:id` - Get request details

#### **assignment.js** (`/api/assignment`)
- `POST /` - Create assignment (mentor)
- `GET /` - Get assignments
- `GET /:id` - Get assignment details
- `POST /:id/submit` - Submit assignment (student)
- `POST /:id/grade` - Grade assignment (mentor)

#### **session.js** (`/api/session`)
- `POST /` - Schedule session (student)
- `GET /` - Get sessions
- `GET /:id` - Get session details
- `PUT /:id` - Update session status (mentor)

#### **profile.js** (`/api/profile`)
- `GET /` - Get user profile
- `PUT /` - Update profile
- `POST /change-password` - Change password
- `POST /request-deletion` - Request account deletion

#### **analytics.js** (`/api/analytics`)
- `GET /engagement` - Get engagement statistics
- `GET /checkins` - Get check-in statistics
- `GET /users` - Get user distribution
- `GET /bookings` - Get booking statistics

#### **oauth.js** (`/api/oauth`)
- `GET /google` - Google OAuth (mock)
- `GET /microsoft` - Microsoft OAuth (mock)

---

## 🎨 Complete Feature List

### ✅ **Authentication & Security**
- [x] User registration (students, mentors)
- [x] Admin registration restriction
- [x] JWT-based authentication
- [x] Password hashing (bcrypt)
- [x] Password strength validation
- [x] Password reset via email
- [x] Account deletion with admin approval
- [x] Role-based access control
- [x] Token expiration
- [x] Google OAuth (mock)
- [x] Microsoft OAuth (mock)
- [x] Account activation/deactivation

### ✅ **Location Services**
- [x] Real-time geolocation tracking
- [x] Campus check-in system
- [x] Distance calculation (Haversine formula)
- [x] Campus proximity verification (500m threshold)
- [x] Check-in history
- [x] Check-in statistics
- [x] Nearby users discovery
- [x] Geospatial queries (MongoDB 2dsphere)

### ✅ **Resource Management**
- [x] Book campus resources
- [x] View bookings
- [x] Cancel bookings
- [x] Booking conflict detection
- [x] Booking status tracking

### ✅ **Mentor System**
- [x] Mentor-student matching
- [x] Automatic mentor assignment
- [x] Manual mentor assignment (admin)
- [x] View assigned mentor (students)
- [x] View mentees (mentors)
- [x] Mentor session scheduling
- [x] Session status management
- [x] Mentor availability tracking

### ✅ **Assignment Management**
- [x] Create assignments (mentors)
- [x] Submit assignments (students)
- [x] Grade assignments (mentors)
- [x] Provide feedback
- [x] Late submission detection
- [x] Assignment notifications
- [x] Performance tracking

### ✅ **Club Management**
- [x] Browse clubs
- [x] Join/leave clubs
- [x] Create clubs (admin)
- [x] View club details
- [x] Track memberships
- [x] Club notifications

### ✅ **Holiday System**
- [x] Request holidays (students)
- [x] Approve/reject requests (admin)
- [x] Status tracking
- [x] Request history
- [x] Automatic notifications

### ✅ **Dashboard & Analytics**
- [x] Personalized dashboards (role-based)
- [x] Today's timetable
- [x] Quick stats
- [x] Engagement charts
- [x] Check-in statistics
- [x] User distribution
- [x] Booking analytics
- [x] Performance reports

### ✅ **Notifications**
- [x] Smart notification system
- [x] Timetable updates
- [x] Assignment deadlines
- [x] Session confirmations
- [x] Holiday approvals/rejections
- [x] Club activities
- [x] Mentor messages
- [x] Booking confirmations
- [x] Mark as read
- [x] Notification center

### ✅ **Profile Management**
- [x] View profile
- [x] Edit profile
- [x] Change password
- [x] Update avatar
- [x] Request account deletion
- [x] Profile information display

### ✅ **UI/UX Features**
- [x] Responsive design (all devices)
- [x] Fast loading (code splitting, lazy loading)
- [x] Professional design (Tailwind CSS)
- [x] Multilingual support (English, Spanish, Hindi)
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Smooth animations
- [x] Modern color scheme

### ✅ **Data Visualization**
- [x] Engagement charts
- [x] Check-in trends
- [x] User distribution graphs
- [x] Booking statistics
- [x] Performance charts
- [x] Interactive graphs (Recharts)

---

## 🔐 Security Features

- ✅ Admin registration blocked
- ✅ Password hashing
- ✅ JWT token expiration
- ✅ Role-based route protection
- ✅ Input validation
- ✅ Error handling
- ✅ Account activation checks
- ✅ Deleted account protection

---

## 🌐 Multilingual Support

- ✅ English (en)
- ✅ Spanish (es)
- ✅ Hindi (hi)
- ✅ Language switcher component
- ✅ Persistent language preference

---

## 📊 Technology Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Icons
- Lucide React

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

---

## 🚀 How to Use

1. **Start Backend:** `cd backend && npm start`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Access:** `http://localhost:3000`

**Default Credentials:**
- Admin: Must be created manually in database
- Mentor: Register at `/register` (select Mentor role)
- Student: Register at `/register` (select Student role)

---

## 📝 Notes

- All features are **100% implemented**
- OAuth (Google/Microsoft) is **mocked** for demonstration
- Email functionality requires SMTP configuration
- All routes are protected with authentication
- Role-based access is enforced on both frontend and backend

---

**Last Updated:** Project is complete and production-ready! ✅

