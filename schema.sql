CREATE TABLE departments(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE employee(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  department_id INT,
  department_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE,
  profile_picture_url TEXT,
  bio TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
);
