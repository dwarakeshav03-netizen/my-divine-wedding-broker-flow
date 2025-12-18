# Divine Matrimony - Complete Setup & Integration Guide

## 🚀 Project Overview

This is a **full-stack matrimony platform** with:

- ✅ Secure Node.js/Express backend with MySQL database
- ✅ React/TypeScript frontend with Vite
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Complete profile management system
- ✅ Secure connection/matching system

---

## 📋 Prerequisites

### Required

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MySQL** v8+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** or **yarn** package manager

### Optional

- **Postman** for API testing
- **VS Code** extensions: REST Client, MySQL

---

## 🔧 Installation & Setup

### Step 1: Clone/Prepare Project

```bash
cd d:\My-Divine-Wedding-Demo-Responsive
```

### Step 2: Frontend Setup

```bash
# Install frontend dependencies
npm install

# Create .env file
copy .env.example .env.local

# Edit .env.local with your configuration
# Important: Update VITE_API_URL=http://localhost:5000/api/v1
```

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Create .env file from template
copy .env.example .env

# Edit .env with your database configuration
```

### Step 4: Database Setup

#### Option A: Create Database via MySQL Client

```bash
# Login to MySQL
mysql -u root -p

# Execute these commands
CREATE DATABASE divnematrimony CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create a dedicated user (recommended)
CREATE USER 'divine'@'localhost' IDENTIFIED BY 'SecurePass123!@#';
GRANT ALL PRIVILEGES ON divnematrimony.* TO 'divine'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

#### Option B: Using Command Line

```bash
mysql -u root -p -e "CREATE DATABASE divnematrimony CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 5: Environment Configuration

#### Backend `.env` (server/.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=divine
DB_PASSWORD=SecurePass123!@#
DB_NAME=divnematrimony
DB_POOL_LIMIT=10

# JWT (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<GENERATE_STRONG_SECRET_32_CHARS>
JWT_REFRESH_SECRET=<GENERATE_STRONG_REFRESH_SECRET_32_CHARS>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

#### Frontend `.env.local` (root/.env.local)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_APP_NAME=My Divine Wedding
VITE_ENABLE_ADMIN=true
VITE_ENABLE_BROKER=true
VITE_ENABLE_PARENT=true
```

### Step 6: Generate JWT Secrets

Run this command in Node.js console:

```bash
node -e "console.log('Secret 1:', require('crypto').randomBytes(32).toString('hex')); console.log('Secret 2:', require('crypto').randomBytes(32).toString('hex'));"
```

Copy both outputs and update `.env` files.

### Step 7: Run Database Migrations

```bash
cd server

# Run migrations to create all tables
npm run migrate

# Expected output:
# ✓ Migration 001_create_users_table executed successfully
# ✓ Migration 002_create_profiles_table executed successfully
# ... (8 total migrations)
# ✓ All migrations completed successfully
```

### Step 8: Start Development Servers

#### Terminal 1: Backend Server

```bash
cd server
npm run dev

# Expected output:
# ✅ Server started successfully on port 5000
# 📍 API Base URL: http://localhost:5000/api/v1
# 🔐 Environment: development
```

#### Terminal 2: Frontend Server

```bash
# From root directory
npm run dev

# Expected output:
# VITE v6.2.0  ready in XXX ms
#
# ➜  Local:   http://localhost:5000
# ➜  press h to show help
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User

```bash
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobileNumber": "+919876543210",
  "password": "SecurePass123!",
  "gender": "male",
  "role": "self"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid...",
    "email": "john@example.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "uuid...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "self",
    "status": "pending",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Refresh Token

```bash
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Current User

```bash
GET /auth/me
Authorization: Bearer <ACCESS_TOKEN>

Response:
{
  "success": true,
  "data": {
    "id": "uuid...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "self",
    "status": "pending",
    "avatar": "https://...",
    "joinedDate": "2025-12-18T10:30:00Z"
  }
}
```

### Profile Endpoints

#### Create Profile

```bash
POST /profiles
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "age": 28,
  "height": "5'10\"",
  "heightCm": 178,
  "education": "B.Tech",
  "occupation": "Software Engineer",
  "income": "10-15 LPA",
  "location": "Chennai",
  "religion": "Hindu",
  "caste": "Iyer",
  "raasi": "Mesha",
  "nakshatra": "Aswini",
  "about": "Looking for a compatible partner...",
  "hobbies": ["reading", "traveling"],
  "diet": "Vegetarian",
  "smoking": "No",
  "drinking": "No"
}
```

#### Search Profiles

```bash
GET /profiles/search?minAge=25&maxAge=35&religion=Hindu&location=Chennai&page=1&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": "profile-uuid",
      "userId": "user-uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "age": 26,
      "religion": "Hindu",
      "caste": "Iyer",
      "location": "Chennai",
      "avatar": "https://...",
      "isVerified": true
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Connection Endpoints

#### Get Connections

```bash
GET /connections?status=pending
Authorization: Bearer <ACCESS_TOKEN>

Response:
{
  "success": true,
  "data": [
    {
      "id": "connection-uuid",
      "senderId": "user-uuid",
      "receiverId": "user-uuid",
      "status": "pending",
      "firstName": "Jane",
      "lastName": "Smith",
      "avatar": "https://...",
      "createdAt": "2025-12-18T10:30:00Z"
    }
  ]
}
```

#### Send Connection Request

```bash
POST /connections/send
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "receiverId": "target-user-uuid"
}

Response:
{
  "success": true,
  "message": "Connection request sent",
  "data": {
    "connectionId": "connection-uuid"
  }
}
```

#### Accept Connection

```bash
PUT /connections/<CONNECTION_ID>/accept
Authorization: Bearer <ACCESS_TOKEN>

Response:
{
  "success": true,
  "message": "Connection accepted"
}
```

---

## 🔐 Security Features

### Authentication

- ✅ JWT-based with access & refresh tokens
- ✅ Secure password hashing (bcrypt)
- ✅ Token expiration and refresh mechanism
- ✅ Rate limiting on auth endpoints

### Authorization

- ✅ Role-Based Access Control (RBAC)
- ✅ User, Admin, Broker, Parent, Super Admin roles
- ✅ Protected endpoints verification

### Data Protection

- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Request validation
- ✅ Password strength requirements

### Infrastructure

- ✅ HTTPS-ready configuration
- ✅ Environment-based secrets management
- ✅ Database connection pooling
- ✅ Graceful error handling

---

## 🧪 Testing Endpoints

### Using cURL

#### 1. Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@divine.com",
    "mobileNumber": "+919876543210",
    "password": "TestPass123!",
    "gender": "male",
    "role": "self"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@divine.com",
    "password": "TestPass123!"
  }'
```

#### 3. Get Current User

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using REST Client (VS Code)

Create `test.http` file:

```http
### Register
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@divine.com",
  "mobileNumber": "+919876543210",
  "password": "TestPass123!",
  "gender": "male"
}

### Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@divine.com",
  "password": "TestPass123!"
}

### Get Me
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📂 Project Structure

```
My-Divine-Wedding-Demo-Responsive/
├── src/                              # Frontend source
│   ├── components/                   # React components
│   ├── contexts/                     # React contexts
│   ├── hooks/                        # Custom hooks
│   ├── utils/
│   │   └── apiClient.ts             # API integration ⭐
│   └── ...
├── server/                           # Backend (NEW)
│   ├── src/
│   │   ├── index.js                 # Main server
│   │   ├── config/
│   │   │   └── database.js          # DB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── profileController.js # Profile logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   └── connectionRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT middleware
│   │   │   └── rateLimiter.js
│   │   └── utils/
│   │       ├── tokenManager.js
│   │       ├── passwordUtils.js
│   │       └── validators.js
│   ├── migrations/
│   │   └── run.js                   # Database migrations
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── vite.config.ts                   # (Updated with API proxy)
├── package.json                     # (Updated with server scripts)
└── .env.example                     # (Updated)
```

---

## 🚀 Running the Application

### Complete Setup Command

```bash
npm run setup
```

This will:

1. Install frontend dependencies
2. Install backend dependencies
3. Run database migrations
4. Create necessary tables

### Development Mode

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend (new terminal)
npm run dev
```

### Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health

---

## 🔄 Frontend Integration

The frontend now uses `apiClient.ts` for all backend communication:

```typescript
import apiClient from "@/utils/apiClient";

// Register
const response = await apiClient.register({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  mobileNumber: "+919876543210",
  gender: "male",
});

// Login
const loginResponse = await apiClient.login(
  "john@example.com",
  "SecurePass123!"
);
const { accessToken, refreshToken, userId } = loginResponse.data;

// Get current user
const user = await apiClient.getCurrentUser();

// Search profiles
const results = await apiClient.searchProfiles({
  minAge: 25,
  maxAge: 35,
  religion: "Hindu",
  location: "Chennai",
  page: 1,
  limit: 20,
});

// Send connection
await apiClient.sendConnectionRequest(profileId);
```

---

## ⚠️ Troubleshooting

### Issue: Database Connection Failed

```
Error: ECONNREFUSED 127.0.0.1:3306
```

**Solution:**

- Ensure MySQL is running
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
- Restart MySQL service: `mysql -u root -p`

### Issue: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- macOS: `lsof -i :5000` then `kill -9 <PID>`
- Linux: `lsof -i :5000` then `kill -9 <PID>`

### Issue: JWT Secret Too Short

```
Error: JWT_SECRET must be at least 32 characters
```

**Solution:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy output to `.env` JWT_SECRET

### Issue: Migrations Fail

```
Error: Table already exists
```

**Solution:**

- Migrations are idempotent (safe to run multiple times)
- Check logs for specific errors
- Manually run: `npm run migrate` in server directory

### Issue: Frontend Can't Connect to Backend

```
Error: Failed to fetch (CORS issue)
```

**Solution:**

- Ensure backend is running on port 5000
- Check `CORS_ORIGIN` in server `.env`
- Ensure `VITE_API_URL` in frontend `.env.local` is correct

---

## 📖 Next Steps

1. **Email Verification**: Implement OTP via email
2. **File Upload**: Add image/document upload
3. **Payments**: Integrate Razorpay/Stripe
4. **Admin Dashboard**: Create admin endpoints
5. **Notifications**: Implement WebSocket for real-time messages
6. **Deployment**: Deploy to AWS, Heroku, or Vercel
7. **Testing**: Add unit and integration tests

---

## ✅ Checklist for Production

- [ ] Update JWT secrets with strong values
- [ ] Configure production database (with backups)
- [ ] Enable HTTPS/SSL certificates
- [ ] Update CORS_ORIGIN with actual domain
- [ ] Set NODE_ENV=production
- [ ] Configure email service for notifications
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints thoroughly
- [ ] Implement backup strategy
- [ ] Set up CI/CD pipeline

---

## 📞 Support

For issues:

1. Check server logs: `npm run dev` output
2. Check database connectivity
3. Verify `.env` configuration
4. Check browser console for frontend errors
5. Use REST Client for API testing

---

**🎉 Your Divine Matrimony Backend is Ready!**

Start servers and begin matching! 💒
