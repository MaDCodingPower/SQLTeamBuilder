INSERT INTO (departments) (department_name)
VALUES  ("Human Resources"),
        ("Finances");

INSERT INTO (roles) (title, salary, department_id)
VALUES  ('President', 125000.00, 2),
        ('Assistant', 70000.00, 1);

INSERT INTO (employees) (firstname, lastname, role_id, manager_id)
VALUES  ('Matthew', 'Davis', 1, NULL),
        ('Bob', 'Bobert', 2, 1)