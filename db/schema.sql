DROP DATABASE IF EXISTS techblog_db;
CREATE DATABASE techblog_db;

USE techblog_db;

-- Create the User table
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for users
  username VARCHAR(255) NOT NULL,          -- User's username (not email)
  password VARCHAR(255) NOT NULL           -- Hashed password for security
);

-- Create the Posts table
CREATE TABLE Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  body TEXT,
  userId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Use DATETIME instead of TIMESTAMP
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Use DATETIME
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- Create the Comments table
CREATE TABLE Comments (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for comments
  body TEXT,                               -- Content of the comment
  userId INT,                             -- Foreign key to associate with the user who created the comment
  postId INT,                              -- Foreign key to associate with the post the comment belongs to
  FOREIGN KEY (userId) REFERENCES User(id),  -- Establishes a relationship between Comments and Users
  FOREIGN KEY (postId) REFERENCES Posts(id)  -- Establishes a relationship between Comments and Posts
);
