// import dependencies
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const consoleTable = require('console.table');

//Connection to database
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'business_db'
});
db.connect(err => {
    if(err) throw err;
    console.log('Connected to the business_db database!');
    console.log(`Employee Manager`);
    userPrompts();
});

function userPrompts(){
    inquirer.prompt([
        {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: 
            ["View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Quit"]
        }
    ]).then((answers) => {
        switch (answers.options) {
            case "View All Departments":
                viewDeps();
                break;

            case "View All Roles":
                viewRoles();
                break;
                
            case "View All Employees":
                viewEmployees();
                break;
            
            case "Add Department":
                addDep();
                break;
            
            case "Add Role":
                addRole();
                break;
    
            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Quit":
                db.end();
                break;
        }
    })
};

function viewDeps(){
    db.query(`SELECT department.id AS id, department.department_name AS department FROM department`, function (err, results) {
        if (err) throw err;
        console.table(results);
        userPrompts();
    })
};

function viewRoles(){
    db.query(`SELECT roles.id, roles.title, department.department_name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        userPrompts();
    })
};

function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        userPrompts();
    }) 
};

function addDep(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDep',
            message: "Enter name of new department: ",
        }
    ])
        .then((response) => {
            db.query(`INSERT INTO department (department_name)
            VALUES (?)`, response.newDep, function (err, response) {
                if (err) throw err;
                console.log('Successfully added ' + response.newDep + ' to departments.');
                viewDeps();
            });
        });
};

function addRole(){
    inquirer.prompt([
        {
          type: 'input',
          name: 'newRole',
          message: 'Enter the name of the new role: '
        },
        {
          type: 'input',
          name: 'newSalary',
          message: 'Enter the salary for the role: '
        },
        {
          type: 'input',
          name: 'depID',
          message: 'Enter the department ID (1 for Operations, 2 for Marketing, 3 for IT, 4 for HR): '
        }
      ])
        .then((response) => {
            db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [response.newRole, response.newSalary, response.depID], function (err, response) {
                if (err) throw err;
                console.log('Successfully added ' + response.newRole + ' to roles.');
                viewRoles();
            });
        });
};

function addEmployee(){
    const roles = `SELECT * FROM roles`;
    const managers = `SELECT * FROM manager`;
    
    inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Enter employee's first name: "
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Enter employee's last name: "
        },
        {
          type: 'list',
          name: 'role',
          message: "Select the employee's role: ",
          choices: roles
        },
        {
          type: 'list',
          name: 'manager',
          message: "Select the employee's manager: ",
          choices: managers
        },
      ])
        .then((response) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [response.firstName, response.lastName, response.role, response.manager], (err, response) => {
            if (err) throw err;
            console.log('Successfully added ' + response.firstName + ' ' + response.lastName + ' to employees.');
            viewEmployees();
          })
        })
};

// function updateRole(){

// };










