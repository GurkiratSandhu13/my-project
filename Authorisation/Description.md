# Experiment 18: Role-Based Access Control (RBAC) System

## Overview
This project implements a complete Role-Based Access Control (RBAC) system using Node.js and Express.js. It demonstrates secure backend API development with JWT-based authentication and role-based authorization, allowing different levels of access for Admin, Moderator, and User roles.

## Project Description
A production-ready backend authentication and authorization system that showcases modern security practices. The application uses JSON Web Tokens (JWT) for stateless authentication and implements middleware-based role checking to protect routes based on user permissions. This is a fundamental pattern used in enterprise applications to manage user access and secure sensitive resources.

## Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Role-Based Authorization](#role-based-authorization)
- [Testing Guide](#testing-guide)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Learning Outcomes](#learning-outcomes)

## Key Features

### 1. JWT-Based Authentication
- **Stateless Authentication**: No server-side session storage required
- **Token-Based Security**: Secure, encrypted tokens containing user identity and role
- **Automatic Expiration**: Tokens expire after a configured time period
- **Bearer Token Format**: Industry-standard Authorization header format

### 2. Role-Based Access Control (RBAC)
- **Three User Roles**: Admin, Moderator, and User
- **Granular Permissions**: Different access levels for different routes
- **Role Hierarchy**: Flexible permission structure
- **Easy to Extend**: Add new roles without modifying core logic

### 3. Protected Routes
- **Admin Dashboard**: Accessible only to Admin users
- **Moderator Management**: Restricted to Moderator role
- **User Profile**: Available to all authenticated users
- **Public Login**: Open authentication endpoint

### 4. Secure Password Handling
- **Bcrypt Hashing**: Industry-standard password encryption
- **Salt Rounds**: Configurable hashing complexity (8 rounds)
- **No Plaintext Storage**: Passwords never stored in readable format
- **Secure Comparison**: Timing-attack resistant password verification

### 5. Middleware Architecture
- **Reusable Components**: Modular middleware functions
- **Token Verification**: Centralized JWT validation
- **Permission Checking**: Flexible role-based access control
- **Error Handling**: Consistent error responses

### 6. Environment Configuration
- **Dotenv Integration**: Secure environment variable management
- **Secret Key Protection**: JWT secrets stored outside codebase
- **Configurable Settings**: Port, token expiration, etc.
- **Production Ready**: Easy deployment configuration

## Technology Stack

### Backend Framework
- **Node.js**: v14+ recommended
- **Express.js**: v5.1.0 - Fast, minimalist web framework

### Authentication & Security
- **jsonwebtoken**: v9.0.2 - JWT creation and verification
- **bcryptjs**: v3.0.2 - Password hashing and comparison
- **dotenv**: v17.2.3 - Environment variable management

### Middleware & Utilities
- **body-parser**: v2.2.0 - Request body parsing (JSON)

## System Architecture

### Authentication Architecture
```
Client Request → Express Server → Authentication Middleware → Route Handler
                                        ↓
                                  JWT Verification
                                        ↓
                                  Role Checking
                                        ↓
                                  Access Granted/Denied
```

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 1,
    "username": "admin",
    "role": "Admin",
    "iat": 1678901234,
    "exp": 1678987634
  },
  "signature": "encrypted_signature"
}
```

### Role Hierarchy
```
Admin
  ├── Full system access
  ├── Can access admin dashboard
  └── Highest privilege level

Moderator
  ├── Moderate level access
  ├── Can manage users
  └── Limited administrative functions

User
  ├── Basic access
  ├── Can view own profile
  └── Standard user privileges
```

## Project Structure

```
Authorisation/
├── index.js                    # Application entry point
├── package.json                # Project dependencies
├── package-lock.json           # Locked dependency versions
├── .env                        # Environment variables (not committed)
│
├── middleware/
│   └── auth.js                 # JWT verification & role checking
│
├── models/
│   └── users.js                # Sample user data with hashed passwords
│
├── routes/
│   ├── auth.js                 # Authentication route (login)
│   ├── admin.js                # Admin-only protected routes
│   ├── moderator.js            # Moderator protected routes
│   └── user.js                 # User accessible routes
│
├── Screenshots/                # Project documentation images
└── Description.md              # This file
```

## Installation & Setup

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Terminal/Command Line**: Access to CLI
- **API Testing Tool**: Postman, Thunder Client, or curl

### Step 1: Navigate to Project Directory
```bash
cd "/Users/admin/University/Semester 5/Full Stack/workspace/my-project/Authorisation"
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express
- jsonwebtoken
- bcryptjs
- body-parser
- dotenv

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:
```bash
touch .env
```

Add the following configuration:
```env
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Node Environment
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

### Step 4: Start the Server
```bash
node index.js
```

Expected output:
```
Server running on http://localhost:3000
```

### Step 5: Verify Server is Running
Open browser or use curl:
```bash
curl http://localhost:3000
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### 1. Authentication Endpoint

#### Login
**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "admin",
  "password": "1234"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "Admin"
  }
}
```

**Error Responses**:

404 Not Found - User doesn't exist:
```json
{
  "error": "User not found"
}
```

401 Unauthorized - Wrong password:
```json
{
  "error": "Invalid password"
}
```

**Test Users**:
| Username | Password | Role |
|----------|----------|------|
| admin | 1234 | Admin |
| moderator | 1234 | Moderator |
| user | 1234 | User |

### 2. Admin Routes

#### Admin Dashboard
**Endpoint**: `GET /admin/dashboard`

**Description**: Access admin dashboard (Admin only)

**Required Role**: Admin

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200 OK):
```json
{
  "message": "Welcome to the Admin Dashboard!"
}
```

**Error Responses**:

401 Unauthorized - No token:
```json
{
  "error": "Token missing"
}
```

403 Forbidden - Wrong role:
```json
{
  "error": "Access denied: Admin only"
}
```

### 3. Moderator Routes

#### Moderator Management
**Endpoint**: `GET /moderator/manage`

**Description**: Access user management (Moderator only)

**Required Role**: Moderator

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200 OK):
```json
{
  "message": "Welcome, Moderator! Manage users here."
}
```

**Error Responses**:

403 Forbidden - Wrong role:
```json
{
  "error": "Access denied: Moderator only"
}
```

### 4. User Routes

#### User Profile
**Endpoint**: `GET /user/profile`

**Description**: View user profile (All authenticated users)

**Required Role**: Any authenticated user

**Request Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Success Response** (200 OK):
```json
{
  "username": "user",
  "role": "User",
  "profile": {
    "email": "user@gmail.com",
    "joined": "2025-01-15"
  }
}
```

**Error Responses**:

404 Not Found - User not in database:
```json
{
  "error": "User not found"
}
```

## Authentication Flow

### 1. User Login Process
```
1. User sends credentials (username + password)
2. Server finds user in database
3. Server compares hashed password
4. If valid, server generates JWT token
5. Token includes user ID, username, and role
6. Server returns token to client
7. Client stores token (localStorage/sessionStorage)
```

### 2. Protected Route Access
```
1. Client includes token in Authorization header
2. Server extracts token from header
3. Middleware verifies token signature
4. Middleware checks token expiration
5. Middleware decodes user information
6. Middleware checks user role against required role
7. If authorized, request proceeds to route handler
8. If not authorized, error response returned
```

### 3. Token Verification Flow
```javascript
// Token format in header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Middleware extracts and verifies:
1. Split header by space: ["Bearer", "token"]
2. Extract token: header.split(" ")[1]
3. Verify with JWT_SECRET
4. Decode payload
5. Attach user info to request object
```

## Role-Based Authorization

### Middleware Implementation

#### verifyToken Middleware
**Purpose**: Verify JWT token validity

**Process**:
1. Extract token from Authorization header
2. Check if token exists
3. Verify token signature using JWT_SECRET
4. Check token expiration
5. Decode user information
6. Attach decoded user to request object
7. Call next() to proceed or return error

**Code Example**:
```javascript
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; 
    next();
  });
}
```

#### permit Middleware
**Purpose**: Check if user has required role

**Process**:
1. Accept array of allowed roles
2. Return middleware function
3. Check if user exists (from verifyToken)
4. Check if user role is in allowed roles
5. Call next() if authorized or return error

**Code Example**:
```javascript
function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied: ${allowedRoles.join(", ")} only` 
      });
    }
    next();
  };
}
```

### Using Middleware in Routes

#### Admin-Only Route
```javascript
router.get("/dashboard", verifyToken, permit("Admin"), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});
```

#### Moderator-Only Route
```javascript
router.get("/manage", verifyToken, permit("Moderator"), (req, res) => {
  res.json({ message: "Welcome, Moderator! Manage users here." });
});
```

#### All Authenticated Users
```javascript
router.get("/profile", verifyToken, (req, res) => {
  // Any authenticated user can access
  res.json({ username: req.user.username });
});
```

#### Multiple Roles
```javascript
// Allow both Admin and Moderator
router.get("/reports", verifyToken, permit("Admin", "Moderator"), (req, res) => {
  res.json({ message: "View reports" });
});
```

## Testing Guide

### Using Postman

#### Test 1: Login as Admin
1. **Method**: POST
2. **URL**: `http://localhost:3000/auth/login`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "username": "admin",
  "password": "1234"
}
```
5. **Expected Response**: Token and user info
6. **Copy the token** for next requests

#### Test 2: Access Admin Dashboard
1. **Method**: GET
2. **URL**: `http://localhost:3000/admin/dashboard`
3. **Headers**: 
   - `Authorization: Bearer <paste_token_here>`
4. **Expected Response**: "Welcome to the Admin Dashboard!"

#### Test 3: Try Unauthorized Access
1. **Method**: GET
2. **URL**: `http://localhost:3000/admin/dashboard`
3. **Headers**: Use moderator or user token
4. **Expected Response**: "Access denied: Admin only"

### Using curl

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}'
```

#### Access Protected Route
```bash
# Replace YOUR_TOKEN with actual token from login
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Thunder Client (VS Code Extension)

1. **Install Thunder Client** extension
2. **Create New Request**
3. **Set Method and URL**
4. **Add Headers and Body**
5. **Send Request**
6. **View Response**

### Test Scenarios

#### Scenario 1: Successful Admin Access
```
1. Login as admin
2. Receive token
3. Access /admin/dashboard with token
4. Result: Success ✅
```

#### Scenario 2: Role Mismatch
```
1. Login as user
2. Receive token
3. Try to access /admin/dashboard
4. Result: 403 Forbidden ❌
```

#### Scenario 3: Missing Token
```
1. Don't login
2. Try to access /user/profile
3. Result: 401 Unauthorized ❌
```

#### Scenario 4: Expired Token
```
1. Login and get token
2. Wait for token expiration (24h default)
3. Try to access protected route
4. Result: 403 Invalid token ❌
```

#### Scenario 5: Moderator Access
```
1. Login as moderator
2. Access /moderator/manage
3. Result: Success ✅
4. Try /admin/dashboard
5. Result: 403 Forbidden ❌
```

## Security Features

### 1. Password Security
- **Bcrypt Hashing**: One-way encryption
- **Salt Rounds**: 8 rounds of hashing
- **No Plaintext**: Passwords never stored readable
- **Secure Comparison**: `bcrypt.compareSync()` prevents timing attacks

### 2. JWT Security
- **Secret Key**: Strong secret for signing tokens
- **Token Expiration**: Automatic timeout (24h default)
- **Signature Verification**: Prevents token tampering
- **Payload Encryption**: Secure data transmission

### 3. HTTP Security Headers
**Recommendation**: Add helmet middleware for production
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Environment Variables
- **Sensitive Data Protection**: Secrets not in codebase
- **.env File**: Gitignored by default
- **Production Separation**: Different configs per environment

### 5. Error Handling
- **No Information Leakage**: Generic error messages
- **Consistent Responses**: Predictable error format
- **Status Codes**: Proper HTTP status codes

### 6. Input Validation
**Recommendation**: Add express-validator
```javascript
const { body, validationResult } = require('express-validator');

router.post('/login',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 4 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process login
  }
);
```

## Error Handling

### Error Response Format
All errors follow consistent JSON format:
```json
{
  "error": "Description of error"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful request |
| 401 | Unauthorized | Missing or invalid credentials |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Common Errors

#### 401 Unauthorized
**Cause**: Token missing or invalid credentials
```json
{ "error": "Token missing" }
{ "error": "Invalid password" }
```

#### 403 Forbidden
**Cause**: Valid token but wrong role
```json
{ "error": "Invalid token" }
{ "error": "Access denied: Admin only" }
{ "error": "Unauthorized" }
```

#### 404 Not Found
**Cause**: Resource doesn't exist
```json
{ "error": "User not found" }
```

## Troubleshooting

### Issue: "Token missing" error
**Solution**:
- Ensure Authorization header is set
- Format: `Authorization: Bearer <token>`
- Check space between "Bearer" and token

### Issue: "Invalid token" error
**Solution**:
- Token may be expired (24h default)
- Login again to get new token
- Check JWT_SECRET matches in .env
- Verify token wasn't modified

### Issue: "Access denied" error
**Solution**:
- You're logged in with wrong role
- Login with appropriate user:
  - Admin for /admin/* routes
  - Moderator for /moderator/* routes

### Issue: Server won't start
**Solution**:
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different port in .env
PORT=4000
```

### Issue: "User not found" during login
**Solution**:
- Check username spelling (case-sensitive)
- Available usernames: admin, moderator, user
- Check models/users.js for user list

### Issue: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: .env not loading
**Solution**:
- Verify .env file exists in root directory
- Check file is named exactly `.env` (not .env.txt)
- Restart server after creating .env
- Verify require("dotenv").config() is in code

## Best Practices

### 1. Security
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Rotate secrets periodically
- ✅ Set appropriate token expiration times
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Add input validation
- ✅ Sanitize user inputs
- ✅ Use environment variables for secrets

### 2. Code Organization
- ✅ Separate routes into different files
- ✅ Keep middleware in dedicated folder
- ✅ Use consistent naming conventions
- ✅ Add comments for complex logic
- ✅ Follow RESTful API conventions

### 3. Error Handling
- ✅ Use try-catch blocks for async operations
- ✅ Return consistent error formats
- ✅ Log errors for debugging
- ✅ Don't expose sensitive error details

### 4. Performance
- ✅ Use connection pooling for databases
- ✅ Implement caching where appropriate
- ✅ Compress responses (gzip)
- ✅ Optimize middleware order

### 5. Testing
- ✅ Write unit tests for middleware
- ✅ Test all authentication scenarios
- ✅ Test role-based access control
- ✅ Perform security audits

## Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=8080
JWT_SECRET=use_very_strong_random_secret_here
JWT_EXPIRES_IN=1h
```

### Security Enhancements
```javascript
// Add security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/auth/', limiter);
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### HTTPS Setup
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt')
};

https.createServer(options, app).listen(443);
```

## Future Enhancements

### Phase 1: Database Integration
- Replace in-memory users with MongoDB/PostgreSQL
- Implement user registration endpoint
- Add password reset functionality
- Store refresh tokens in database

### Phase 2: Advanced Features
- Refresh token mechanism
- Two-factor authentication (2FA)
- OAuth2 integration (Google, GitHub)
- Account activation via email
- Password complexity requirements
- Account lockout after failed attempts

### Phase 3: Admin Features
- User management dashboard
- Role assignment interface
- Permission management
- Audit logs and activity tracking
- Analytics and reporting

### Phase 4: API Enhancements
- API versioning
- GraphQL implementation
- WebSocket support for real-time features
- File upload with role-based access
- Pagination and filtering

## Learning Outcomes

After completing this experiment, you will understand:

### 1. Authentication Concepts
- JWT structure and how it works
- Stateless vs stateful authentication
- Token-based authentication flow
- Password hashing and security

### 2. Authorization Patterns
- Role-Based Access Control (RBAC)
- Permission management
- Middleware-based authorization
- Principle of least privilege

### 3. Backend Development
- Express.js application structure
- RESTful API design
- Middleware architecture
- Error handling strategies

### 4. Security Practices
- Secure password storage with bcrypt
- Environment variable management
- JWT best practices
- Common security vulnerabilities

### 5. API Development
- HTTP methods and status codes
- Request/response cycle
- Header management
- API testing techniques

## Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

### Tutorials
- [RESTful API Design](https://restfulapi.net/)
- [Authentication vs Authorization](https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization)
- [Middleware in Express](https://expressjs.com/en/guide/using-middleware.html)

## License
This project is for educational purposes as part of Full Stack Development coursework.

## Author
Created for Full Stack Development - Semester 5

## Acknowledgments
- Express.js community
- Node.js security best practices
- JWT.io resources
- Stack Overflow community

---

**Note**: This is a learning project. For production use, implement additional security measures, use a real database, add comprehensive error handling, and follow security audits.
