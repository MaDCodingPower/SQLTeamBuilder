// Import and require mysql2 and express
const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./config/connection')


// MAIN MENU FUNCTION TO RECALL TO SELECT AN OPTION
const mainMenu = () => {

  inquirer.prompt(
    [
      {
        type:'',
        name:'',
        message:'',
        choices: [
          'View Departments',
          'View Roles',
          'View Employees',
          'Add Department',
          'Add Employee',
          'Add Role',
          'Update Role'
        ]
      },
    ]
  )

  .then((data) => {
    switch (data.answer) {
      case 'View Departments':
        showDept();
        break;
      case 'View Roles':
        showRoles();
        break;
      case 'View Employees':
        showEmployees();
        break;
      case 'Add Department':
        addDept();
        break;
      case 'Add Employee':
        addEmp();
        break;
      case 'Add Role':
        addRole();     
        break;
      case 'Update Role':
        updateRole();
        break;
    }
  })
  .catch((err) => console.err(error))

}

// ------------------------------------------------------------
// functions to view employees, depts, and roles

const showRoles = () => {
  connection.query("SELECT * FROM roles", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

const showEmployees = () => {
  connection.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

const showDept = () => {
  connection.query("SELECT * FROM departments", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};


// -----------------------------------------------------------
// functions to add emp, dept, and role

const addEmp= () =>{
  inquirer.prompt([
    {
        type: "input",
        name: "firstName",
        message: "Enter the first name of new employee."
    },
    {
        type: "input",
        name: "lastName",
        message: "Enter the last name of new employee."
    }
  ])

  .then(data => {

    let newEmployeeData = [data.firstName, data.lastName];
    connection.query("SELECT title, id FROM roles", (err, result) => {

      if (err) {
        console.log(err);
      }

      let roles = result.map(({title, id}) => ({ name: title, value: id }));

      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "Choose the employee's role.",
          choices: roles
        }
      ])

      .then(data => {

        let role = data.role;
        newEmployeeData.push(role);
        connection.query("SELECT first_name, last_name, id FROM employees WHERE manager_id IS NULL", (err, result) => {

            if (err) {
              console.log(err);
            }

            let managers = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
            managers.push({ name: "No manager", value: null });
            inquirer.prompt([
              {
                type: "list",
                name: "manager",
                message: "Choose the employee's manager.",
                choices: managers
              }
            ])
            .then (data => {
              let manager = data.manager;
              params.push(manager);
              connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", params, (err) => {
                if (err) {
                  console.log(err);
                }
                console.log("New employee added");
                return showEmployees();
              })
            })
          })
      })
  })
})}

const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "newRole",
      message: "Enter the name of the role you'd like to add."
    },
    {
      type: "number",
      name: "newSalary",
      message: "Enter the salary for this new role."
    },
])
  .then(response => {
    let params = [response.newRole, response.newSalary];
    connection.query("SELECT * FROM departments", (err, result) => {
      if (err) {
        console.log(err);
      }
      let depts = result.map(({ name, id }) => ({ name: name, value: id }));
      inquirer.prompt([
        {
          type: "list",
          name: "dept",
          message: "Choose which department the new role is a part of.",
          choices: depts
        }
      ])
        .then(response => {
          let dept = response.dept;
          params.push(dept);
          connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", params, (err) => {
            if (err) {
              console.log(err);
            }
            console.log("Role added");
            return showRoles();
          });
        });
    });
  });
};

const addDept = () => {
  inquirer.prompt([
  {
    type: "input",
    name: "deptName",
    message: "Enter the name of the new department."
  }
])
  .then(response => {
    let newDept = [response.deptName];
    connection.query("INSERT INTO departments (name) VALUES (?)", newDept, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Department added");
      return showDept();
    });
  });
};

// -----------------------------------------------------------
// function to update role

const updateRole = () => {
  connection.query("SELECT first_name, last_name, id FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    }
    let employees = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
      {
        type: "list",
        name: "employeeUpdate",
        message: "Which employee's role would you like to change?",
        choices: employees
      }
    ])
      .then(response => {
        let employeeChoice = response.employeeUpdate;
        let params = [employeeChoice];
        connection.query("SELECT title, id FROM roles", (err, result) => {
          if (err) {
            console.log(err);
          }
          let roles = result.map(({ title, id }) => ({ name: title, value: id }));
          inquirer.prompt([
            {
              type: "list",
              name: "roleUpdate",
              message: "What is their new role?",
              choices: roles
            }
          ])
            .then(response => {
              let roleChoice = (response.roleUpdate);
              params.unshift(roleChoice);
              connection.query("SELECT first_name, last_name, id FROM employees WHERE manager_id IS NULL", (err, result) => {
                if (err) {
                  console.log(err);
                }
                let managers = result.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                managers.push({ name: "No manager", value: null });
                inquirer.prompt([
                  {
                    type: "list",
                    name: "newManager",
                    message: "Choose the employee's new manager, if any.",
                    choices: managers
                  }
                ])
                  .then(response => {
                    let newManager = (response.newManager);
                    params.unshift(newManager);
                    connection.query("UPDATE employees SET manager_id = ?, role_id = ? WHERE id = ?", params, (err) => {
                      if (err) {
                        console.log(err);
                      }
                      console.log("Employee updated!");
                      return showEmployees();
                    });
                });
            });
        });
      });
    });
  });
};
