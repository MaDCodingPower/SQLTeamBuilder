// Import and require mysql2 and express
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'root',
    database: 'company_db'
  },
  console.log(`Connected to the movies_db database.`)
);

// {
//   type:'',
//   name:'',
//   message:'',
// },

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

  .then(data)

}

// ------------------------------------------------------------
// functions to view employees, depts, and roles

const showRoles = () => {

};

const showEmployees = () => {

};

const showDept = () => {

};


// -----------------------------------------------------------
// functions to add emp, dept, and role

const addEmployee = () =>{

};

const addRole = () => {

};

const addDept = () => {

};

// -----------------------------------------------------------
// function to update role

const updateRole = () => {

};