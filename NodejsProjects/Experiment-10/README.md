# 🚀 CLI Employee Management System

A **Node.js Command Line Interface (CLI)** application for managing employees using in-memory arrays. This interactive terminal application provides a complete employee management system with CRUD operations, colorful interface, and robust error handling.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [File Structure](#-file-structure)
- [API Documentation](#-api-documentation)
- [Learning Objectives](#-learning-objectives)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **➕ Add Employees**: Add new employees with name and unique ID
- **📋 List All Employees**: Display all employees in a formatted table
- **🗑️ Remove Employees**: Remove employees by their ID
- **🔍 Find Employees**: Search for specific employees by ID
- **📊 Employee Count**: Display total number of employees
- **🎨 Colorful Interface**: Beautiful CLI with colors and emojis
- **✅ Input Validation**: Comprehensive error handling and validation
- **🔄 Interactive Menu**: Easy-to-navigate menu system
- **💾 In-Memory Storage**: Uses arrays for fast data access during session

## 🔧 Prerequisites

- **Node.js** version 14.0.0 or higher
- **npm** (comes with Node.js)
- Terminal or Command Prompt

## 🚀 Installation

1. **Clone or download** this project to your local machine
2. **Navigate** to the project directory:
   ```bash
   cd my-project
   ```
3. **Install dependencies** (if any):
   ```bash
   npm install
   ```

## 📖 Usage

### Starting the Application

Run the application using one of these commands:

```bash
# Method 1: Using npm script
npm start

# Method 2: Using Node directly
node src/app.js
```

### Menu Options

Once the application starts, you'll see an interactive menu:

```
==================================================
     CLI EMPLOYEE MANAGEMENT SYSTEM
==================================================
1. Add Employee
2. List All Employees
3. Remove Employee by ID
4. Find Employee by ID
5. Show Employee Count
6. Exit
==================================================
```

### Sample Workflow

1. **Start the application** - Sample employees are automatically added
2. **View all employees** (Option 2) to see the current list
3. **Add a new employee** (Option 1):
   - Enter employee name: `Alice Johnson`
   - Enter employee ID: `EMP003`
4. **Find an employee** (Option 4):
   - Enter employee ID to search: `EMP003`
5. **Remove an employee** (Option 3):
   - View the list and enter ID to remove
6. **Exit** (Option 6) when done

## 📁 File Structure

```
my-project/
├── src/
│   ├── routes/
│   │   └── employees.js      # Employee management functions
│   └── app.js                # Main CLI application
├── package.json              # Project configuration
├── package-lock.json         # Dependency lock file
├── index.html               # Documentation (HTML)
└── README.md                # Project documentation
```

### File Descriptions

- **`src/app.js`**: Main application file with CLI interface and menu system
- **`src/routes/employees.js`**: Employee management module with CRUD operations
- **`package.json`**: Node.js project configuration and scripts
- **`index.html`**: HTML documentation page
- **`README.md`**: Comprehensive project documentation

## 🔌 API Documentation

### Employee Management Functions (`src/routes/employees.js`)

#### `addEmployee(name, id)`
- **Purpose**: Add a new employee to the array
- **Parameters**: 
  - `name` (string): Employee name
  - `id` (string): Unique employee ID
- **Returns**: Object with success status and message
- **Validation**: Checks for duplicate IDs and empty fields

#### `getAllEmployees()`
- **Purpose**: Retrieve all employees
- **Parameters**: None
- **Returns**: Array of employee objects

#### `removeEmployee(id)`
- **Purpose**: Remove an employee by ID
- **Parameters**: 
  - `id` (string): Employee ID to remove
- **Returns**: Object with success status and removed employee data

#### `findEmployeeById(id)`
- **Purpose**: Find a specific employee by ID
- **Parameters**: 
  - `id` (string): Employee ID to search
- **Returns**: Employee object or null if not found

#### `getEmployeeCount()`
- **Purpose**: Get total number of employees
- **Parameters**: None
- **Returns**: Number of employees

### Employee Object Structure

```javascript
{
  id: "EMP001",           // Unique identifier
  name: "John Doe",       // Employee name
  dateAdded: "2024-01-15" // Date added (YYYY-MM-DD format)
}
```

## 🎯 Learning Objectives

This project helps you learn:

- **Node.js Fundamentals**: Understanding built-in modules and CLI applications
- **Readline Module**: Interactive terminal input/output handling
- **Array Operations**: CRUD operations with JavaScript arrays
- **Modular Programming**: Code organization with modules and exports
- **Error Handling**: Input validation and error management
- **User Experience**: Creating intuitive CLI interfaces
- **Asynchronous Programming**: Handling user input and callbacks

## 📸 Screenshots

### Welcome Screen
```
🚀 Welcome to CLI Employee Management System!
Manage your employees with simple commands.

✅ Sample employees added for demonstration.
```

### Employee List Display
```
📋 EMPLOYEE LIST:
────────────────────────────────────────────────────────────
ID              Name                    Date Added
────────────────────────────────────────────────────────────
EMP001          John Doe                2024-01-15
EMP002          Jane Smith              2024-01-15
────────────────────────────────────────────────────────────
Total Employees: 2
```

## 🛠️ Technical Details

### Built With
- **Node.js**: Runtime environment
- **Readline**: For interactive CLI input
- **JavaScript ES6+**: Modern JavaScript features
- **ANSI Colors**: Terminal styling and colors

### Key Features Implementation
- **Modular Design**: Separation of concerns with routes module
- **Input Validation**: Comprehensive error checking
- **Memory Management**: Efficient array operations
- **User Experience**: Colorful, intuitive interface
- **Error Handling**: Graceful error management

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:

1. Check the [Issues](../../issues) section
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your problem
