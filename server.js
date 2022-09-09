const mysql = require('mysql2') ;
const inquirer = require("inquirer");
const cTable =require("console.table");

const deptSql = `SELECT id AS 'ID', name AS 'Department Name' FROM departments;`;
const roleSql = `SELECT r.id AS 'ID', r.title AS 'Role Name', r.salary AS 'Salary', d.name AS 'Department' FROM roles AS r JOIN departments AS d ON d.id = r.department_id;`;
const empSql = `SELECT e1.id AS 'ID', concat(e1.first_name, ' ',e1.last_name) AS 'Name', r.title AS 'Role', d.name AS 'Department', r.salary AS salary, concat(e2.first_name,' ',e2.last_name) AS 'Manager' FROM employees AS e1 INNER JOIN roles AS r ON r.id = e1.role_id INNER JOIN departments AS d ON d.id = r.department_id LEFT OUTER JOIN employees AS e2 ON e2.id = e1.manager_id;`;

// Establishing a connection to the database in the /db folder
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "staff_db"
    },
    console.log("Connected to the database")
);

// Called whenever a table from the database needs to be rendered in the console
const logTable = (sql) => {
    db.query(sql, (err, res) => {
        console.log('\n'); 
        console.table(res);
        console.log('\n');
        console.log('\tPress an arrow key to return to main menu');
    });
};

const addDept = () => {
    inquirer.prompt([
        {
        type: 'input',
        message: 'Please enter the new department name',
        name: 'deptName'
        }
    ])
    .then(res => {
        sql = `INSERT INTO departments (name) VALUES ('${res.deptName}');`
        db.execute(sql, (err, res) => {
            try {
                console.log('\n\tUpdated Database');
            } catch {
                console.error(err);
            };
        })
    })
    .then( () => {
        logTable(deptSql);
    })
    .then( () => {
        firstPrompt();
    })
    .catch( (err) => {
        console.error(err);
    });
};

const addRole = () => {
    inquirer.prompt([
        {
        type: 'input',
        message: `Please enter the new role's title`,
        name: 'title'
        },
        {
        type: 'number',
        message: `Please enter the new role's salary`,
        name: 'salary'
        },
        {
        type: 'number',
        message: `Please enter the new role's department ID`,
        name: 'deptId'
        },
    ])
    .then(res => {
        if (!res.title || !res.salary || !res.deptId ) {
            console.error('Please Enter valid values for role fields!')
        };

        sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${res.title}', ${res.salary}, ${res.deptId});`
        
        db.execute(sql, (err, res) => {
            try {
                console.log('\n\tUpdated Database');
            } catch {
                console.error(err);
            };
        });
    })
    .then( () => {
        logTable(roleSql);
    })
    .then( () => {
        firstPrompt();
    })
    .catch( (err) => {
        console.error(err);
    });
};

const addEmp = async () => {
    inquirer.prompt([
        {
        type: 'input',
        message: 'Please enter the new employees first name',
        name: 'fName'
        },
        {
        type: 'input',
        message: 'Please enter the new employees last name',
        name: 'lName'
        },
        {
        type: 'input',
        message: 'Please enter the new employees role ID',
        name: 'roleId'
        },
        {
        type: 'input',
        message: 'Please enter the new employees managers ID',
        name: 'managerId'
        }
    ])
    .then(res => {
        if (!res.fName || !res.lName || !res.roleId || !res.managerId) {
            console.error('Please Enter valid values for employee fields!')
        };

        sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${res.fName}','${res.lName}', ${res.roleId}, ${res.managerId});`

        db.execute(sql, (err, res) => {
            try {
                console.log('\n\tUpdated Database');
            } catch {
                console.error(err);
            };
        });
    })
    .then( () => {
        logTable(empSql);
    })
    .then( () => {
        firstPrompt();
    })
    .catch( (err) => {
        console.error(err);
    });
};

const updateRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please input the ID of the employee whose role will be changed.',
            name: 'empId'
        },
        {
            type: 'input',
            message: 'Please enter the new role ID',
            name: 'roleId'
        }
    ])
    .then( (res) => {
        if (!res.empId || !res.roleId) {
            console.error('Please enter valid values for id fields');
            return;
        };

        sql = `UPDATE employees AS e1 SET role_id = '${res.roleId}' WHERE id = ${res.empId};`

        db.execute(sql, (err, res) => {
            try {
                console.log('\n\tUpdated Database');
            } catch {
                console.error(err);
            };
        });
    })
    .then( () => {
        logTable(empSql);
    })
    .then( () => {
        firstPrompt();
    })
    .catch( (err) => {
        console.error(err);
    });
};

// This handles calling the correct function for database manipulation
const firstPrompt = async () => {
await inquirer
    .prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name:"selection",
        choices:[
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee's Role"
        ]
        }
    ])
    .then(async (response) => {
        if (response.selection === "View All Departments") {
            logTable(deptSql);
            firstPrompt();
        }else if (response.selection === "View All Roles") {
            logTable(roleSql);
            firstPrompt();
        }else if (response.selection === "View All Employees") {
            logTable(empSql);
            firstPrompt();
        }else if (response.selection === "Add a Department") {
            addDept();
        }else if (response.selection === "Add a Role") {
            addRole();
        }else if (response.selection === "Add an Employee") {
            addEmp();
        }else if (response.selection === "Update an Employee's Role") {
            updateRole();
        }else {
            console.error("Unexpected selection please try again");
            firstPrompt();
        };
    })
    .catch((err) => {
        console.error(err);
    });
}

firstPrompt();