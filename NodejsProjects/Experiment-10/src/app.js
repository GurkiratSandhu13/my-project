#!/usr/bin/env node

const readline = require('readline');
const employeeRoutes = require('./routes/employees');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// CLI Colors for better UX
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * Display the main menu
 */
function displayMenu() {
    console.log('\n' + '='.repeat(50));
    console.log(colors.cyan + colors.bright + '     CLI EMPLOYEE MANAGEMENT SYSTEM' + colors.reset);
    console.log('='.repeat(50));
    console.log(colors.green + '1.' + colors.reset + ' Add Employee');
    console.log(colors.green + '2.' + colors.reset + ' List All Employees');
    console.log(colors.green + '3.' + colors.reset + ' Remove Employee by ID');
    console.log(colors.green + '4.' + colors.reset + ' Find Employee by ID');
    console.log(colors.green + '5.' + colors.reset + ' Show Employee Count');
    console.log(colors.red + '6.' + colors.reset + ' Exit');
    console.log('='.repeat(50));
}

/**
 * Display all employees in a formatted table
 */
function displayEmployees() {
    const employees = employeeRoutes.getAllEmployees();
    
    if (employees.length === 0) {
        console.log(colors.yellow + '\nNo employees found!' + colors.reset);
        return;
    }

    console.log(colors.cyan + '\n📋 EMPLOYEE LIST:' + colors.reset);
    console.log('─'.repeat(60));
    console.log(colors.bright + 'ID\t\tName\t\t\tDate Added' + colors.reset);
    console.log('─'.repeat(60));
    
    employees.forEach(emp => {
        console.log(`${emp.id}\t\t${emp.name}\t\t\t${emp.dateAdded}`);
    });
    console.log('─'.repeat(60));
    console.log(colors.blue + `Total Employees: ${employees.length}` + colors.reset);
}

/**
 * Handle adding a new employee
 */
function handleAddEmployee() {
    rl.question(colors.cyan + 'Enter employee name: ' + colors.reset, (name) => {
        if (!name.trim()) {
            console.log(colors.red + '❌ Name cannot be empty!' + colors.reset);
            showMenu();
            return;
        }

        rl.question(colors.cyan + 'Enter employee ID: ' + colors.reset, (id) => {
            if (!id.trim()) {
                console.log(colors.red + '❌ ID cannot be empty!' + colors.reset);
                showMenu();
                return;
            }

            const result = employeeRoutes.addEmployee(name, id);
            
            if (result.success) {
                console.log(colors.green + '✅ ' + result.message + colors.reset);
            } else {
                console.log(colors.red + '❌ ' + result.message + colors.reset);
            }
            
            showMenu();
        });
    });
}

/**
 * Handle removing an employee
 */
function handleRemoveEmployee() {
    const employees = employeeRoutes.getAllEmployees();
    
    if (employees.length === 0) {
        console.log(colors.yellow + '\n❌ No employees to remove!' + colors.reset);
        showMenu();
        return;
    }

    // Show current employees first
    displayEmployees();

    rl.question(colors.cyan + '\nEnter employee ID to remove: ' + colors.reset, (id) => {
        if (!id.trim()) {
            console.log(colors.red + '❌ ID cannot be empty!' + colors.reset);
            showMenu();
            return;
        }

        const result = employeeRoutes.removeEmployee(id);
        
        if (result.success) {
            console.log(colors.green + '✅ ' + result.message + colors.reset);
        } else {
            console.log(colors.red + '❌ ' + result.message + colors.reset);
        }
        
        showMenu();
    });
}

/**
 * Handle finding an employee by ID
 */
function handleFindEmployee() {
    rl.question(colors.cyan + 'Enter employee ID to find: ' + colors.reset, (id) => {
        if (!id.trim()) {
            console.log(colors.red + '❌ ID cannot be empty!' + colors.reset);
            showMenu();
            return;
        }

        const employee = employeeRoutes.findEmployeeById(id);
        
        if (employee) {
            console.log(colors.green + '\n✅ Employee Found:' + colors.reset);
            console.log('─'.repeat(40));
            console.log(colors.bright + 'ID:' + colors.reset + ` ${employee.id}`);
            console.log(colors.bright + 'Name:' + colors.reset + ` ${employee.name}`);
            console.log(colors.bright + 'Date Added:' + colors.reset + ` ${employee.dateAdded}`);
            console.log('─'.repeat(40));
        } else {
            console.log(colors.red + `❌ Employee with ID ${id} not found!` + colors.reset);
        }
        
        showMenu();
    });
}

/**
 * Show employee count
 */
function showEmployeeCount() {
    const count = employeeRoutes.getEmployeeCount();
    console.log(colors.blue + `\n📊 Total Employees: ${count}` + colors.reset);
    showMenu();
}

/**
 * Main menu handler
 */
function showMenu() {
    displayMenu();
    rl.question(colors.yellow + '\nSelect an option (1-6): ' + colors.reset, (choice) => {
        switch (choice.trim()) {
            case '1':
                handleAddEmployee();
                break;
            case '2':
                displayEmployees();
                showMenu();
                break;
            case '3':
                handleRemoveEmployee();
                break;
            case '4':
                handleFindEmployee();
                break;
            case '5':
                showEmployeeCount();
                break;
            case '6':
                console.log(colors.green + '\n👋 Thank you for using CLI Employee Management System!' + colors.reset);
                rl.close();
                break;
            default:
                console.log(colors.red + '\n❌ Invalid option! Please select 1-6.' + colors.reset);
                showMenu();
                break;
        }
    });
}

/**
 * Welcome message and app initialization
 */
function initializeApp() {
    console.clear();
    console.log(colors.magenta + colors.bright + '\n🚀 Welcome to CLI Employee Management System!' + colors.reset);
    console.log(colors.blue + 'Manage your employees with simple commands.\n' + colors.reset);
    
    // Add some sample data for demonstration
    employeeRoutes.addEmployee('John Doe', 'EMP001');
    employeeRoutes.addEmployee('Jane Smith', 'EMP002');
    console.log(colors.green + '✅ Sample employees added for demonstration.' + colors.reset);
    
    showMenu();
}

// Handle graceful shutdown
rl.on('close', () => {
    console.log(colors.yellow + '\n💼 Employee Management System closed.' + colors.reset);
    process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log(colors.yellow + '\n\n👋 Goodbye!' + colors.reset);
    rl.close();
});

// Start the application
initializeApp();