INSERT INTO department (department_name)
VALUES ("Operations"),
        ("Marketing"),
        ("IT"),
        ("HR");

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketer", 90000, 2),
        ("Software Engineer", 100000, 3),
        ("Director of IT", 120000, 3),
        ("Head of Operations", 90000, 4),
        ("Accountant", 100000, 4),
        ("Manufacturer", 800000, 1),
        ("Purchaser", 800000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Art","Vandeley", 3, NULL),
        ("Charles","Cheese", 4, NULL),
        ("Greg","McMuffin", 2, 1),
        ("Scoobert","Doo", 2, 1),
        ("Pepe","Sylvia", 1, 2),
        ("Peg","Legge", 5, 2),
        ("Saul","Goodman", 5, 2);
        
        