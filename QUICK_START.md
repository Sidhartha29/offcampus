# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Backend

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_here
TOKEN_EXPIRES=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Step 3: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin account
- 2 Mentor accounts
- 2 Student accounts

### Step 4: Start Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Step 5: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Step 6: Login

Use these test accounts:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Mentor:**
- Email: `riya.mentor@example.com`
- Password: `mentor123`

**Student:**
- Email: `neha.student@example.com`
- Password: `student123`

## 🎯 What You Can Do

### As Student:
- ✅ Check in to campus with location tracking
- ✅ Book campus resources
- ✅ Join student clubs
- ✅ Request holidays
- ✅ Submit assignments
- ✅ Schedule mentor sessions
- ✅ View notifications

### As Mentor:
- ✅ View all mentees
- ✅ Create and grade assignments
- ✅ Manage sessions
- ✅ Track student performance

### As Admin:
- ✅ View comprehensive analytics
- ✅ Assign mentors to students
- ✅ Approve holiday requests
- ✅ Manage users
- ✅ View performance reports

## 🔧 Important Notes

1. **Campus Coordinates:** Update in `frontend/src/pages/Dashboard.jsx` (lines 76-77) with your actual campus location

2. **OAuth:** Google/Microsoft login buttons are ready - integrate OAuth SDKs for production

3. **Language:** Use the language switcher in the header to change languages

4. **Location:** Allow location access when prompted for check-in functionality

## 🎉 You're All Set!

The project is complete and ready to use. Explore all features and enjoy!

