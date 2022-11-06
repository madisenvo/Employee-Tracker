// import dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql2 = require('mysql2');

function userPrompts(){
    inquirer
    .prompt([
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
                // view employees
                break;

            case "Add Employee":
                // add employee
                break;

            case "Update Employee Role":
                // function to update role
                break;

            case "View All Roles":
                // function to view roles
                break;

            case "Add Role":
                // function to add role
                break;

            case "View All Departments":
                // function to view departments
                break;

            case "Add Department":
                // function to add department
                break;

            case "Quit":
                // restart app
                break;
        }
    })
};