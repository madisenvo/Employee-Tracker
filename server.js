// import dependencies
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const consoleTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require("process");

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
    connection.query(`SELECT department.id AS id, department.name AS department FROM department`, function (err, rows) {
        if (err) throw err;
        consoleTable(results);
        userPrompts();
    })
};

function viewRoles(){
    db.query(`SELECT roles.id, roles.title, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`, function (err, results) {
        if (err) throw err;
        consoleTable(results);
        userPrompts();
    })
};

function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id`, function (err, results) {
        if (err) throw err;
        consoleTable(results);
        userPrompts();
    }) 
};

function addDep(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDep',
            message: "Enter name of new department: ",
            validate: addDep => {
                if (addDep) {
                    return true;
                } else {
                    console.log('Please enter a department name.');
                    return false;
                }
            }
        }
    ])
        .then((response) => {
            db.query(`INSERT INTO department (department_name)
            VALUES (?)`, response.addDep, (err, result) => {
                if (err) throw err;
                console.log('Successfully added ' + response.addDep + " to departments.");
                viewDeps();
            });
        });
};

function addRole(){

};

function addEmployee(){

};

function updateRole(){

};










