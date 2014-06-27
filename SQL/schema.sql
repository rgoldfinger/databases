-- CREATE DATABASE chat;

USE chat;


CREATE TABLE Users (
  id_user INT auto_increment NOT NULL,
  user_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_user)
);

CREATE TABLE Rooms (
  id_room INT auto_increment NOT NULL,
  room_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_room)
);


CREATE TABLE Messages (
  id_message INT auto_increment NOT NULL,
  id_user INT NOT NULL,
  id_room INT,
  message_text VARCHAR(140) NOT NULL,
  PRIMARY KEY (id_message),
  FOREIGN KEY (id_user) REFERENCES Users (id_user),
  FOREIGN KEY (id_room) REFERENCES Rooms (id_room)

);


/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




