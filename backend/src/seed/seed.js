// seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const MentorMatch = require('../models/MentorMatch');
const ResourceBooking = require('../models/ResourceBooking');
const Club = require('../models/Club');

const SAMPLE_USERS = [
  // admin
  {
    userId: 'admin001',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    profile: { college: 'ByteXL University', year: 0, commuting: false }
  },
  // mentors
  {
    userId: 'mentor001',
    name: 'Riya Sharma',
    role: 'mentor',
    email: 'riya.mentor@example.com',
    password: 'mentor123',
    profile: { college: 'ByteXL University', year: 3, commuting: true, homeTown: 'Bangalore' }
  },
  {
    userId: 'mentor002',
    name: 'Arun Kumar',
    role: 'mentor',
    email: 'arun.mentor@example.com',
    password: 'mentor123',
    profile: { college: 'ByteXL University', year: 4, commuting: false }
  },
  // students
  {
    userId: 'stu001',
    name: 'Neha Patel',
    role: 'student',
    email: 'neha.student@example.com',
    password: 'student123',
    profile: { college: 'ByteXL University', year: 1, commuting: true, homeTown: 'Ahmedabad' }
  },
  {
    userId: 'stu002',
    name: 'Karan Singh',
    role: 'student',
    email: 'karan.student@example.com',
    password: 'student123',
    profile: { college: 'ByteXL University', year: 2, commuting: false }
  }
];

const SAMPLE_TIMETABLE = [
  {
    userId: 'stu001',
    date: new Date(), // today
    slots: [
      { start: '09:00', end: '10:30', course: 'Calculus I', type: 'lecture' },
      { start: '11:00', end: '12:30', course: 'Physics Lab', type: 'lab' },
      { start: '14:00', end: '15:30', course: 'Introduction to CS', type: 'lecture' }
    ]
  },
  {
    userId: 'stu002',
    date: new Date(),
    slots: [
      { start: '08:30', end: '10:00', course: 'Chemistry', type: 'lecture' },
      { start: '10:30', end: '12:00', course: 'Data Structures', type: 'lecture' },
      { start: '13:30', end: '15:00', course: 'English Communication', type: 'lecture' }
    ]
  }
];

const SAMPLE_NOTIFICATIONS = [
  {
    userId: 'stu001',
    title: 'Class Cancelled',
    body: 'CS101 lecture at 9 AM is cancelled due to faculty emergency.',
    type: 'class',
    read: false
  },
  {
    userId: 'stu001',
    title: 'Campus Bus Delay',
    body: 'Bus route 3 will be 15 minutes late today.',
    type: 'transport',
    read: false
  },
  {
    userId: 'stu002',
    title: 'New Study Room Available',
    body: 'Room 402 is now free for booking.',
    type: 'general',
    read: false
  }
];

const SAMPLE_BOOKINGS = [
  {
    userId: 'stu001',
    resource: 'Study Room 401',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
    from: '10:00',
    to: '12:00',
    status: 'confirmed'
  },
  {
    userId: 'stu002',
    resource: 'Counselling Slot',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    from: '14:00',
    to: '14:30',
    status: 'confirmed'
  }
];

async function createUsers() {
  for (const u of SAMPLE_USERS) {
    const exists = await User.findOne({ $or: [{ email: u.email }, { userId: u.userId }] });
    if (!exists) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, passwordHash });
      console.log(`Created user ${u.userId}`);
    }
  }
}

async function createTimetables() {
  for (const t of SAMPLE_TIMETABLE) {
    const exists = await Timetable.findOne({ userId: t.userId, date: t.date });
    if (!exists) {
      await Timetable.create(t);
      console.log(`Timetable for ${t.userId} added`);
    }
  }
}

async function createNotifications() {
  for (const n of SAMPLE_NOTIFICATIONS) {
    await Notification.create({
      ...n,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Notification for ${n.userId} added`);
  }
}

async function createBookings() {
  for (const b of SAMPLE_BOOKINGS) {
    const exists = await ResourceBooking.findOne({
      resource: b.resource,
      date: b.date,
      from: b.from,
      to: b.to
    });
    if (!exists) {
      await ResourceBooking.create(b);
      console.log(`Booking for ${b.userId} added`);
    }
  }
}

async function createMentorMatches() {
  // Assign each student a random mentor if not already assigned
  const mentors = await User.find({ role: 'mentor' });
  const students = await User.find({ role: 'student' });

  for (const s of students) {
    const existing = await MentorMatch.findOne({ student: s._id, status: 'active' });
    if (existing) continue;

    const mentor = mentors[Math.floor(Math.random() * mentors.length)];
    await MentorMatch.create({
      student: s._id,
      mentor: mentor._id,
      status: 'active'
    });
    console.log(`Mentor ${mentor.userId} assigned to student ${s.userId}`);
  }
}

const SAMPLE_CLUBS = [
  {
    name: 'Coding Club',
    description: 'A community for coding enthusiasts to learn, share, and collaborate on programming projects.',
    category: 'technical',
    meetingSchedule: {
      day: 'Friday',
      time: '18:00',
      location: 'Tech Lab 101'
    }
  },
  {
    name: 'Basketball Team',
    description: 'Join our basketball team for regular practice sessions and inter-college tournaments.',
    category: 'sports',
    meetingSchedule: {
      day: 'Tuesday & Thursday',
      time: '17:00',
      location: 'Sports Complex'
    }
  },
  {
    name: 'Drama Society',
    description: 'Express your creativity through theater, acting, and stage performances.',
    category: 'cultural',
    meetingSchedule: {
      day: 'Saturday',
      time: '15:00',
      location: 'Auditorium'
    }
  },
  {
    name: 'Debate Club',
    description: 'Sharpen your argumentation skills and participate in competitive debates.',
    category: 'academic',
    meetingSchedule: {
      day: 'Wednesday',
      time: '16:00',
      location: 'Seminar Hall'
    }
  },
  {
    name: 'Photography Club',
    description: 'Capture moments, learn photography techniques, and showcase your work.',
    category: 'cultural',
    meetingSchedule: {
      day: 'Sunday',
      time: '10:00',
      location: 'Art Studio'
    }
  },
  {
    name: 'Robotics Club',
    description: 'Build robots, participate in competitions, and explore the world of automation.',
    category: 'technical',
    meetingSchedule: {
      day: 'Monday & Friday',
      time: '19:00',
      location: 'Robotics Lab'
    }
  },
  {
    name: 'Music Society',
    description: 'Join musicians, singers, and music lovers for jam sessions and performances.',
    category: 'cultural',
    meetingSchedule: {
      day: 'Thursday',
      time: '18:30',
      location: 'Music Room'
    }
  },
  {
    name: 'Entrepreneurship Club',
    description: 'Learn about startups, business, and innovation from successful entrepreneurs.',
    category: 'academic',
    meetingSchedule: {
      day: 'Saturday',
      time: '14:00',
      location: 'Business Center'
    }
  }
];

async function createClubs() {
  const mentors = await User.find({ role: 'mentor' });
  
  for (const clubData of SAMPLE_CLUBS) {
    const exists = await Club.findOne({ name: clubData.name });
    if (!exists) {
      // Assign a random mentor as president
      const president = mentors.length > 0 ? mentors[Math.floor(Math.random() * mentors.length)] : null;
      
      await Club.create({
        ...clubData,
        president: president ? president._id : null
      });
      console.log(`Club ${clubData.name} created`);
    }
  }
}

async function seed() {
  try {
    await connectDB();

    await Promise.all([
      createUsers(),
      createTimetables(),
      createNotifications(),
      createBookings(),
      createMentorMatches(),
      createClubs()
    ]);
    // hello

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error', err);
    process.exit(1);
  }
}

seed();