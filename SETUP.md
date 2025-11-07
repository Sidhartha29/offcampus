# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
TOKEN_EXPIRES=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Run the Application

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

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` and `<dbname>` in the connection string
5. Add your IP address to the whitelist
6. Copy the connection string to `MONGO_URI` in `.env`

## Email Setup (Optional)

For password reset functionality:

1. For Gmail:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the app password in `SMTP_PASS`

2. For other providers, update `SMTP_HOST` and `SMTP_PORT` accordingly

## Testing the Application

1. Register a new user at http://localhost:3000/register
2. Login with your credentials
3. Explore the dashboard and features

## Troubleshooting

- **Port already in use**: Change the PORT in `.env`
- **MongoDB connection error**: Check your connection string and IP whitelist
- **CORS errors**: Ensure backend is running and CORS is configured
- **Geolocation not working**: Use HTTPS or localhost (browser requirement)

