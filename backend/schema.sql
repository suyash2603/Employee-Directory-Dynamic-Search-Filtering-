-- Create and select the database
CREATE DATABASE IF NOT EXISTS employee_directory;
USE employee_directory;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS employee_roles;
DROP TABLE IF EXISTS salary_slips;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

-- Department table with auto-incremented 6-digit ID
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
) AUTO_INCREMENT=1001;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert predefined roles
INSERT INTO roles (role_name) VALUES
('employee'),
('hr'),
('manager'),
('designer'),
('ceo'),
('developer'),
('qa'),
('tester'),
('devops'),
('admin');

-- Employees table with RANDOM 6-digit primary key (NOT auto-incremented)
CREATE TABLE employees (
  id INT PRIMARY KEY,  -- Random 6-digit ID from backend
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  profile_pic VARCHAR(255),
  department_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employee_roles (
  employee_id INT,
  role_id INT,
  PRIMARY KEY (employee_id, role_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ,
  FOREIGN KEY (role_id) REFERENCES roles(id) 
);
-- Salary slips table
CREATE TABLE salary_slips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);


-- Insert some departments
INSERT INTO departments (name) VALUES
('HR'),
('Finance'),
('Accounting'),
('Marketing'),
('Sales'),
('Information Technology'),
('Customer Support'),
('Legal'),
('Research and Development'),
('Operations'),
('Procurement'),
('Logistics'),
('Administration'),
('Engineering'),
('Quality Assurance'),
('Production'),
('Public Relations'),
('Business Development'),
('Design'),
('Training and Development'),
('Security'),
('Compliance'),
('Product Management'),
('Strategy'),
('Facilities Management'),
('Internal Audit'),
('Data Analytics'),
('Medical Services'),
('Project Management Office'),
('Executive Management'),
('Frontend Development'),
('Backend Development'),
('Full Stack Development'),
('Mobile App Development'),
('DevOps'),
('Manual Testing'),
('Automation Testing'),
('QA Engineering'),
('Test Management');


select * from departments;

ALTER TABLE employees
ADD COLUMN hire_date DATE,
ADD COLUMN location VARCHAR(100);
ALTER TABLE employees
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;
select * from employees;
SELECT * FROM employee_roles;
ALTER TABLE employees ADD COLUMN role ENUM('employee', 'hr', 'manager', 'designer','ceo','developer','qa','tester','devops','admin') DEFAULT 'employee';
