DROP DATABASE IF EXISTS crowdfund_db;
CREATE DATABASE crowdfund_db;

-- Create the Users table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for users
  username VARCHAR(255) NOT NULL,          -- User's username (not email)
  password VARCHAR(255) NOT NULL           -- Hashed password for security
);

-- Create the Posts table
CREATE TABLE Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for posts
  title VARCHAR(255),                      -- Title of the blog post
  body TEXT,                               -- Content of the blog post
  userId INT,                             -- Foreign key to associate with the user who created the post
  FOREIGN KEY (userId) REFERENCES Users(id) -- Establishes a relationship between Posts and Users
);

-- Create the Comments table
CREATE TABLE Comments (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for comments
  body TEXT,                               -- Content of the comment
  userId INT,                             -- Foreign key to associate with the user who created the comment
  postId INT,                              -- Foreign key to associate with the post the comment belongs to
  FOREIGN KEY (userId) REFERENCES Users(id),  -- Establishes a relationship between Comments and Users
  FOREIGN KEY (postId) REFERENCES Posts(id)  -- Establishes a relationship between Comments and Posts
);
