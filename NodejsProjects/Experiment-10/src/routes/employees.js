// Employee Management Routes
// In-memory storage for employees
let employees = [];

/**
 * Add a new employee to the array
 * @param {string} name - Employee name
 * @param {string} id - Employee ID
 * @returns {Object} - Success/error response
 */
function addEmployee(name, id) {
    // Validate input
    if (!name || !id) {
        return { success: false, message: "Name and ID are required!" };
    }

    // Check if employee ID already exists
    const existingEmployee = employees.find(emp => emp.id === id);
    if (existingEmployee) {
        return { success: false, message: `Employee with ID ${id} already exists!` };
    }

    // Add new employee
    const newEmployee = {
        name: name.trim(),
        id: id.trim(),
        dateAdded: new Date().toISOString().split('T')[0]
    };

    employees.push(newEmployee);
    return { 
        success: true, 
        message: `Employee ${name} (ID: ${id}) added successfully!`,
        employee: newEmployee
    };
}

/**
 * Get all employees
 * @returns {Array} - Array of all employees
 */
function getAllEmployees() {
    return employees;
}

/**
 * Remove an employee by ID
 * @param {string} id - Employee ID to remove
 * @returns {Object} - Success/error response
 */
function removeEmployee(id) {
    if (!id) {
        return { success: false, message: "Employee ID is required!" };
    }

    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return { success: false, message: `Employee with ID ${id} not found!` };
    }

    const removedEmployee = employees.splice(employeeIndex, 1)[0];
    return { 
        success: true, 
        message: `Employee ${removedEmployee.name} (ID: ${id}) removed successfully!`,
        employee: removedEmployee
    };
}

/**
 * Find an employee by ID
 * @param {string} id - Employee ID to find
 * @returns {Object|null} - Employee object or null if not found
 */
function findEmployeeById(id) {
    return employees.find(emp => emp.id === id) || null;
}

/**
 * Get total count of employees
 * @returns {number} - Total number of employees
 */
function getEmployeeCount() {
    return employees.length;
}

module.exports = {
    addEmployee,
    getAllEmployees,
    removeEmployee,
    findEmployeeById,
    getEmployeeCount
};