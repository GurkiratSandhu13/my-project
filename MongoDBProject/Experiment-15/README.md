# Experiment 15: MongoDB User Management with Express.js

## Overview
This experiment demonstrates a simple Node.js web application using Express.js framework integrated with MongoDB database for user management operations. The application provides functionality to add users with email, password, and location information to a MongoDB database.

## Learning Objectives
- Understanding MongoDB connection setup with Mongoose
- Creating MongoDB schemas and models
- Implementing RESTful API endpoints with Express.js
- Handling JSON data in Express applications
- Performing basic CRUD operations (Create) with MongoDB

## Project Structure
```
Experiment-15/
├── config/
│   └── db.js              # Database configuration
├── models/
│   └── usermodels.js      # User schema and model
├── images/                # Screenshots of experiment results
│   ├── exp15.1.png
│   ├── exp15.2.png
│   ├── exp15.3.png
│   ├── exp15.4.png
│   └── exp15.5.png
├── index.js              # Main application file
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## Technologies Used
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **Nodemon**: Development tool for auto-restarting server

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally on port 27017
- npm or yarn package manager

## Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd "Experiment-15"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB service**
   Make sure MongoDB is running on your local machine at `mongodb://127.0.0.1:27017`

4. **Run the application**
   ```bash
   # For development (with auto-restart)
   npm run server
   
   # Or run directly
   node index.js
   ```

5. **Server will start on port 3000**
   ```
   Server is running on port 3000
   Connected to the database
   ```

## API Endpoints

### 1. Health Check
- **GET** `/`
- **Description**: Simple endpoint to verify server is running
- **Response**: `"Hello World"`

### 2. Add User
- **POST** `/adduser`
- **Description**: Creates a new user in the MongoDB database
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword",
    "location": "User Location"
  }
  ```
- **Success Response**: `"User added successfully"`
- **Error Response**: Error message

## Code Explanation

### Database Configuration (`config/db.js`)
```javascript
const mongoose = require('mongoose');
const connection = mongoose.connect("mongodb://127.0.0.1:27017/MongoDB?tls=false")
module.exports = {connection};
```
- Establishes connection to local MongoDB instance
- Database name: `MongoDB`
- TLS disabled for local development

### User Schema (`models/usermodels.js`)
```javascript
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
});
const UserModel = mongoose.model('User', userSchema);
```
- Defines structure for user documents
- All fields (email, password, location) are required
- Creates a `User` model for database operations

### Main Application (`index.js`)
- Sets up Express server with JSON parsing middleware
- Implements database connection handling
- Provides user creation endpoint with error handling
- Starts server and connects to MongoDB

## Testing the Application

### Using cURL
```bash
# Test health check
curl http://localhost:3000/

# Add a new user
curl -X POST http://localhost:3000/adduser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword",
    "location": "Test City"
  }'
```

### Using Postman
1. **GET Request**: `http://localhost:3000/`
2. **POST Request**: `http://localhost:3000/adduser`
   - Set Content-Type to `application/json`
   - Add JSON body with email, password, and location

## Screenshots
The `images/` directory contains screenshots demonstrating:
- Server startup and database connection
- API testing with various tools
- Database verification of created users
- Error handling scenarios

## Key Learning Points

1. **MongoDB Integration**: Using Mongoose for seamless MongoDB operations
2. **Express Middleware**: Implementing JSON parsing for request bodies
3. **Async/Await**: Proper handling of asynchronous database operations
4. **Error Handling**: Try-catch blocks for robust error management
5. **RESTful Design**: Following REST principles for API endpoints
6. **Database Modeling**: Creating structured schemas for data consistency

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB service is running
2. **Port Already in Use**: Change port in `index.js` if 3000 is occupied
3. **Missing Dependencies**: Run `npm install` to install required packages
4. **Database Access**: Verify MongoDB is accessible at the specified connection string

## Future Enhancements
- Add user authentication and authorization
- Implement additional CRUD operations (Read, Update, Delete)
- Add input validation and sanitization
- Implement password hashing for security
- Add environment variable configuration
- Create comprehensive test suite

## Author
@GurkiratSinghSandhu

## License
ISC

---
*This experiment is part of Full Stack Development coursework, Semester 5*

#ckhsckabecubeqcq