INSERT INTO departments (name)
    VALUES ('Administration'),
           ('Development'),
           ('Sales')
;

INSERT INTO roles (title, salary, department_id)
    VALUES ('Manager', 110000.00, 1),
           ('Engineer', 80000.00, 2),
           ('Intern', 40000.00, 2)
;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('John', 'Smith', 1, null),
           ('Matthew', 'Davis', 2, 1)
;

SELECT * FROM departments;

SELECT * FROM roles;

SELECT * FROM employees;

SELECT r.title AS 'Title', concat('$ ', r.salary) AS 'Salary', d.name AS 'Department'
FROM roles AS r
JOIN departments AS d
ON r.department_id = d.id;

SELECT r.title AS 'Title', concat('$ ', r.salary) AS 'Salary', d.name AS 'Department'
FROM roles AS r
JOIN departments AS d
ON r.department_id = d.id;

SELECT concat(e1.first_name, ' ',e1.last_name) AS 'Name', concat(e2.first_name, ' ',e2.last_name) AS 'Manager Name'
FROM employees AS e1
JOIN employees AS e2
ON e1.manager_id = e2.id