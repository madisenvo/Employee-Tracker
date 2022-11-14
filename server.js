// import dependencies
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const consoleTable = require('console.table');

// connection to database
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

// prompt user for desired action
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
            "Update Employee Manager",
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

            case "Update Employee Manager":
                updateManager();
                break;

            case "Quit":
                db.end();
                break;
        }
    })
};

//show department names and department ids
function viewDeps(){
    db.query(`SELECT department.id AS id, department.department_name AS department FROM department`, function (err, response) {
        if (err) throw err;
        console.table(response);
        userPrompts();
    })
};

// show job title, role id, role salary, and the department that role belongs to
function viewRoles(){
    db.query(`SELECT roles.id, roles.title, roles.salary, department.department_name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`, function (err, response) {
        if (err) throw err;
        console.table(response);
        userPrompts();
    })
};

// show employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, response) {
        if (err) throw err;
        console.table(response);
        userPrompts();
    }) 
};

// prompt user to enter the name of the department and add department to database
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
                console.log('Successfully added department!');
                viewDeps();
            });
        });
};

// prompt user to enter the name, salary, and department for the role and add role to database
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
            message: 'Enter the department ID: '
        }
        ])
        .then((response) => {
            db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [response.newRole, response.newSalary, response.depID], function (err, response) {
                if (err) throw err;
                console.log('Successfully added role!');
                viewRoles();
            });
        });
};

// prompt user to enter the employee’s first name, last name, role, and manager, and add employee to database
function addEmployee(){
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
        }
    ]).then(response => {
        const inputArr = [response.firstName, response.lastName]

        db.query(`SELECT roles.id, roles.title FROM roles`, (err, response) => {
            if (err) throw err;

            const roles = response.map(({ id, title }) => ({ name: title, value: id }));


            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Select the employee's role: ",
                    choices: roles
                }
            ]).then(roleSelection => {
                const role = roleSelection.role;
                inputArr.push(role);

                db.query(`SELECT * FROM employee`, (err, response) => {
                    if (err) throw err;

                    const managers = response.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Select the employee's manager: ",
                            choices: managers
                        }
                    ]).then(managerSelection => {
                        const manager = managerSelection.manager;

                        inputArr.push(manager);

                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`, inputArr, (err,response) => {
                            if (err) throw err;
                            console.log("Successfully added employee!")

                            viewEmployees();
                        })
                    })
                })
            })
    })
})}

// prompt user to select an employee to update and their new role and add to database
function updateRole(){
    db.query(`SELECT * FROM employee`, (err, response) => {
        if (err) throw err;

        const employeeList = response.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id })); 

        inquirer.prompt([
            {
                type: 'list',
                name: 'updateEmp',
                message: "Select an employee to update: ",
                choices: employeeList
            }
        ]).then(response =>{
            const employee = response.updateEmp;
            const employeeArr = [];
            employeeArr.push(employee);

            db.query(`SELECT * FROM roles`, (err, response) =>{
                if (err) throw err;

                const roleList = response.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateRole',
                        message: "Select the employee's new role: ",
                        choices: roleList
                    }
                ]).then(response => {
                    const role = response.updateRole;
                    employeeArr.push(role);

                    let employee = employeeArr[0]
                    employeeArr[0] = role
                    employeeArr[1] = employee

                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, employeeArr, (err, response) => {
                        if (err) throw err;
                        console.log('Successfully updated employee role!')

                        viewEmployees();
                    })
                })
            });
        })
    })
};

// prompt user to select an employee and that employee's new manager and add to database
function updateManager(){
    db.query(`SELECT * FROM employee`, (err, response) => {
        if (err) throw err;
        const employeeList = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Select an employee to update: ",
                choices: employeeList
            }
        ])
            .then(response => {
                const employee = response.employee;
                const employeeArr = [];
                employeeArr.push(employee);

                db.query(`SELECT * FROM employee`, (err, response) => {
                    if (err) throw err;
                    const managersList = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Select the employee's new manager: ",
                            choices: managersList
                        }
                    ])
                        .then(response => {
                            const manager = response.manager;
                            employeeArr.push(manager);

                            let employee = employeeArr[0]
                            employeeArr[0] = manager
                            employeeArr[1] = employee

                            db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, employeeArr, (err, response) => {
                                if (err) throw err;
                                console.log("Successfully updated manager!");

                                viewEmployees();
                            });
                        });
                });
            });
    });
};







