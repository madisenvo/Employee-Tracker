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
            ["View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"]
        }
    ]).then((answers) => {
        switch (answers.options) {
            case "View All Employees":
                viewEmployees();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "Add Role":
                addRole();
                break;

            case "View All Departments":
                viewDeps();
                break;

            case "Add Department":
                addDep();
                break;

            case "Quit":
                db.end();
                break;
        }
    })
};

function viewEmployees(){
    db.query('SELECT department(id) AS id, department.department_name AS department FROM department', function (err, results) {
        if (err) throw err;
        consoleTable(results);
        userPrompts();
})};

function addEmployee(){

};

function updateRole(){

};

function viewRoles(){

};

function addRole(){

};

function viewDeps(){

};

function addDep(){

};


