<div align="center">
<img width="1200" height="475" alt="Divine Matrimony Banner" src="https://res.cloudinary.com/dkpwmrjkq/image/upload/v1765959373/Screenshot_55_p2wzgs.png" />
</div>

# 🎭 Divine Matrimony - Complete Platform

> **A secure, full-stack Tamil matrimony platform with modern architecture, JWT authentication, and MySQL database.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8+-orange.svg)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure-yellow.svg)](https://jwt.io/)

## 🌟 What's New

✨ **Full Backend Integration** - Secure Node.js + Express server  
🔐 **JWT Authentication** - Secure token-based auth with refresh mechanism  
💾 **MySQL Database** - Complete schema with 8 migration tables  
🚀 **API-Ready** - All endpoints tested and documented  
📱 **Production-Ready** - Security headers, rate limiting, validation

## 🚀 Quick Start (< 5 minutes)

### Windows

```bash
setup.bat
```

### Linux/Mac

```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
npm install
cd server && npm install && npm run migrate
npm run dev          # Terminal 1: Frontend
npm run server       # Terminal 2: Backend
```

Visit: http://localhost:3000 (Frontend) & http://localhost:5000 (Backend)

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup with troubleshooting
- **[server/README.md](server/README.md)** - Backend API reference
- **[ARCHITECTURE.md](#-project-structure)** - Project structure below

## 🏗️ Technology Stack

| Component | Technology                                 |
| --------- | ------------------------------------------ |
| Frontend  | React 19.2, TypeScript, Vite, Tailwind CSS |
| Backend   | Node.js, Express, MySQL                    |
| Auth      | JWT (Access + Refresh tokens)              |
| Security  | Bcrypt, Helmet, CORS, Rate Limiting        |
| Database  | MySQL 8+ with connection pooling           |

## ✨ Core Features

### 🔐 Security

- JWT-based authentication with refresh tokens
- Bcrypt password hashing (10 rounds)
- SQL injection prevention
- CORS & Helmet security headers
- Rate limiting on sensitive endpoints
- Role-based access control (RBAC)

### 👤 User Management

- Self, Parent, Broker, Admin, Super Admin roles
- Profile creation with 50+ fields
- ID verification workflow
- Activity logging & audit trail

### 💘 Matching System

- Advanced profile search (age, religion, caste, location, occupation)
- Smart connection requests
- Shortlist management
- Messaging between connections

### 💎 Features by Plan

- **Free**: Basic profile
- **Gold**: Contact details
- **Diamond**: Unlimited messaging
- **Platinum**: Priority support + all features

### 🌍 Internationalization

- 5+ languages (English, Tamil, Hindi, Telugu, Malayalam)
- Dark mode support
- Mobile-responsive design

## 📊 Database Schema

```
users (authentication & basic info)
├── profiles (detailed profiles with 50+ fields)
├── connections (connection requests between users)
├── messages (messaging system)
├── shortlist (saved favorites)
├── verification (ID verification)
├── refresh_tokens (JWT token management)
└── activity_log (audit trail)
```

## 🔌 API Endpoints

### Auth (No token needed)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
```

### Protected Endpoints

```
GET    /api/v1/auth/me
POST   /api/v1/profiles
GET    /api/v1/profiles/search
POST   /api/v1/connections/send
GET    /api/v1/connections
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete API documentation.

## 🧪 Test API Endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Test123!@#","gender":"male"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123!@#"}'

# Get current user (use token from login response)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
├── src/                              Frontend source
│   ├── utils/apiClient.ts           ✨ Backend integration
│   ├── components/                  React components
│   └── contexts/                    State management
├── server/                           Backend (NEW)
│   ├── src/
│   │   ├── index.js                 Main server
│   │   ├── config/database.js       MySQL config
│   │   ├── controllers/             Business logic
│   │   ├── routes/                  API endpoints
│   │   ├── middleware/              Auth & security
│   │   └── utils/                   Helpers
│   ├── migrations/                  Database migrations
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── SETUP_GUIDE.md                   ⭐ Complete guide
├── setup.bat / setup.sh             Auto-setup scripts
└── README.md                        This file
```

## ⚙️ Configuration

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_USER=divine
DB_PASSWORD=SecurePass123!@#
DB_NAME=divnematrimony

# JWT (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<strong_32_char_secret>
JWT_REFRESH_SECRET=<strong_32_char_secret>

# Server
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🔒 Security Features

✅ Password hashing with bcrypt  
✅ JWT token-based authentication  
✅ Refresh token mechanism  
✅ Rate limiting (5 attempts per 15 min)  
✅ SQL injection prevention  
✅ CORS protection  
✅ Helmet.js security headers  
✅ Request validation  
✅ Role-based access control  
✅ Activity logging

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check MySQL is running
# Verify DB credentials in server/.env
mysql -u root -p -e "SELECT 1"
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### JWT Error

```bash
# Generate new secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting.

## 🚀 Running the Application

### Development

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npm run dev
```

### Production

```bash
# Build frontend
npm run build

# Start backend
cd server && npm start
```

### Commands

```bash
npm run dev          # Frontend dev
npm run build        # Frontend build
npm run setup        # Full setup
npm run server       # Start backend
cd server && npm run migrate    # Run migrations
```

## 📋 Setup Checklist

- [ ] Node.js v18+ installed
- [ ] MySQL v8+ installed & running
- [ ] .env files configured
- [ ] Database created
- [ ] Migrations run
- [ ] Backend started
- [ ] Frontend started
- [ ] Test endpoints working

## 🎯 Next Steps

1. Complete the [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Test API endpoints with provided curl commands
3. Review [server/README.md](server/README.md) for API details
4. Implement file uploads (optional)
5. Integrate payment gateway (optional)
6. Deploy to production

## 📖 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL 8 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [JWT Introduction](https://jwt.io/introduction)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

## 📞 Support

For issues:

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting
2. Review [server/README.md](server/README.md) for API help
3. Check console logs for errors
4. Verify database configuration

## 📄 License

ISC License - See LICENSE for details

## 🙏 Acknowledgments

- React & Vite teams for amazing tools
- Express.js community
- MySQL documentation
- All contributors

---

**🎉 Ready to match hearts with culture and tradition!**

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000/api/v1  
**Database**: divnematrimony

Last Updated: December 18, 2025
