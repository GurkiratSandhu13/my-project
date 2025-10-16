# Experiment 17a: Full Stack Integration with React and Express.js

## Overview
This experiment demonstrates a simple full-stack web application using Express.js backend API integrated with a React frontend. The application provides functionality to display a list of products fetched from an Express API server, showcasing the complete data flow from backend to frontend.

## Learning Objectives
- Understanding Express.js server setup and API endpoint creation
- Implementing React frontend with modern hooks (useState, useEffect)
- Using Axios for HTTP requests and API communication
- Handling asynchronous data fetching with loading states and error management
- Setting up CORS for cross-origin requests between frontend and backend
- Integrating Vite as a modern React development tool

## Project Structure
```
Experiment-17a/
├── Backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend dependencies
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductList.jsx    # Product display component
│   │   ├── App.jsx        # Main React application
│   │   ├── App.css        # Application styles
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── node_modules/      # Frontend dependencies
└── README.md             # Project documentation
```

## Technologies Used
- **Backend**:
  - Node.js: JavaScript runtime environment
  - Express.js: Web application framework
  - CORS: Cross-Origin Resource Sharing middleware
- **Frontend**:
  - React: UI library with hooks
  - Vite: Modern build tool and dev server
  - Axios: HTTP client for API requests
- **Development Tools**:
  - npm: Package manager

## Prerequisites
- Node.js (v16 or higher)
- npm package manager
- Modern web browser

## Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd "Experiment-17a"
   ```

2. **Install Backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

## Running the Application

### Method 1: Run Both Services Manually
1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   Server will start on `http://localhost:5000`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

### Method 2: Alternative Commands
```bash
# Backend alternatives
cd Backend
npm run dev        # Same as npm start

# Frontend alternatives
cd Frontend
npm run build      # Build for production
npm run preview    # Preview production build
```

## API Endpoints

### 1. Get Products
- **GET** `/api/products`
- **Description**: Returns a list of products with id, name, and price
- **Response**: JSON array of product objects
- **Example Response**:
  ```json
  [
    { "id": 1, "name": "Laptop", "price": 999.99 },
    { "id": 2, "name": "Mouse", "price": 29.99 },
    { "id": 3, "name": "Keyboard", "price": 79.99 },
    { "id": 4, "name": "Monitor", "price": 299.99 },
    { "id": 5, "name": "Webcam", "price": 89.99 }
  ]
  ```

## Code Explanation

### Backend Implementation (`Backend/server.js`)
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  { id: 1, name: 'Laptop', price: 999.99 },
  // ... more products
];

// API endpoint to get products
app.get('/api/products', (req, res) => {
  res.json(products);
});
```
- Sets up Express server with CORS enabled
- Defines in-memory product data
- Provides RESTful API endpoint for products

### Frontend Implementation (`Frontend/src/components/ProductList.jsx`)
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // ... component render logic
}
```
- Uses React hooks for state management
- Implements async data fetching with proper error handling
- Displays loading states and error messages

## Key Features

### 1. Asynchronous Data Fetching
- React component fetches data when mounted using `useEffect`
- Axios handles HTTP requests to the Express API
- Proper error handling for network issues

### 2. State Management
- Loading state while fetching data
- Error state for failed requests
- Products state for successful data retrieval

### 3. Cross-Origin Resource Sharing
- CORS middleware enables frontend-backend communication
- Configured to allow requests from React development server

### 4. Responsive Design
- Simple grid layout for product display
- Clean, minimal styling appropriate for learning

## Testing the Application

### Manual Testing
1. Start both servers as described above
2. Open browser to `http://localhost:5173`
3. Verify products load and display correctly
4. Test error handling by stopping backend server

### API Testing with cURL
```bash
# Test the products API
curl http://localhost:5000/api/products
```

### Browser Developer Tools
- Check Network tab for API requests
- Verify JSON response structure
- Monitor for any console errors

## Data Flow

1. **React App Initialization**: Frontend starts and ProductList component mounts
2. **API Request**: useEffect triggers Axios GET request to backend
3. **Backend Processing**: Express server receives request and returns product data
4. **Frontend Update**: React updates state with received data
5. **UI Rendering**: Component renders products in user interface

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend has CORS middleware installed and configured
2. **Port Conflicts**: Change ports in configuration if defaults are occupied
3. **API Connection Failed**: Verify backend server is running before starting frontend
4. **Module Not Found**: Run `npm install` in both Backend and Frontend directories

### Error Messages
- "Failed to fetch products": Backend server is not running or unreachable
- Loading indefinitely: Check browser console for network errors
- Blank page: Verify React development server started correctly

## Future Enhancements
- Add user authentication and authorization
- Implement full CRUD operations (Create, Update, Delete products)
- Add product categories and filtering
- Implement database integration (MongoDB/PostgreSQL)
- Add form validation and user input sanitization
- Create comprehensive test suite with Jest/React Testing Library
- Add environment variable configuration
- Implement production deployment setup

## Dependencies

### Backend Dependencies
```json
{
  "express": "^4.x.x",
  "cors": "^2.x.x"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.x.x",
  "axios": "^1.x.x",
  "vite": "^5.x.x"
}
```

## Author
@admin

## License
ISC

---
*This experiment is part of Full Stack Development coursework, Semester 5*