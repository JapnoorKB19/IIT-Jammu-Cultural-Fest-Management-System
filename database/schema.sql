-- Create a new database if it doesn't exist
CREATE DATABASE IF NOT EXISTS iit_jammu_fest;
USE iit_jammu_fest;

-- Group 1: Core Entities

CREATE TABLE DaySchedule (
  DayID INT PRIMARY KEY AUTO_INCREMENT,
  DayNumber INT NOT NULL,
  EventDate DATE,
  Description VARCHAR(255)
);

CREATE TABLE Venues (
  VenueID INT PRIMARY KEY AUTO_INCREMENT,
  VenueName VARCHAR(100) NOT NULL UNIQUE,
  Capacity INT,
  Location VARCHAR(255)
);

CREATE TABLE Teams (
  Team_ID INT PRIMARY KEY AUTO_INCREMENT,
  Team_Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Student_Members (
  Student_ID VARCHAR(20) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Role ENUM('Head', 'Co-head') NOT NULL,
  Team_ID INT NOT NULL,
  FOREIGN KEY (Team_ID) REFERENCES Teams(Team_ID)
);

CREATE TABLE Sponsors (
  Sponsor_ID INT PRIMARY KEY AUTO_INCREMENT,
  Sponsor_Name VARCHAR(100) NOT NULL UNIQUE,
  Amount DECIMAL(12, 2) NOT NULL,
  Sponsor_Type VARCHAR(50)
);

CREATE TABLE Participants (
  Participant_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Phone VARCHAR(15),
  College VARCHAR(100)
);

CREATE TABLE Performers (
  Performer_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Performer_Type ENUM('Singer', 'DJ', 'Standup', 'Band') NOT NULL
);

CREATE TABLE Budget_Expenses (
  Expense_ID INT PRIMARY KEY AUTO_INCREMENT,
  Item_Description VARCHAR(255) NOT NULL,
  Allocated_Amount DECIMAL(12, 2) NOT NULL
);

-- Group 2: The Central Events Table

CREATE TABLE Events (
  Event_ID INT PRIMARY KEY AUTO_INCREMENT,
  Event_Name VARCHAR(100) NOT NULL,
  Event_Type ENUM('Cultural', 'Performance') NOT NULL,
  Prize_Money DECIMAL(10, 2),
  Max_Participants INT,
  DayID INT,
  VenueID INT,
  Performer_ID INT,
  FOREIGN KEY (DayID) REFERENCES DaySchedule(DayID),
  FOREIGN KEY (VenueID) REFERENCES Venues(VenueID),
  FOREIGN KEY (Performer_ID) REFERENCES Performers(Performer_ID)
);

-- Group 3: Junction & Linking Tables

CREATE TABLE Tickets (
  Ticket_ID INT PRIMARY KEY AUTO_INCREMENT,
  Event_ID INT NOT NULL,
  Participant_ID INT NOT NULL,
  Quantity INT NOT NULL DEFAULT 1,
  Purchase_Date DATETIME NOT NULL,
  FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
  FOREIGN KEY (Participant_ID) REFERENCES Participants(Participant_ID)
);

CREATE TABLE Event_Registrations (
  Registration_ID INT PRIMARY KEY AUTO_INCREMENT,
  Event_ID INT NOT NULL,
  Participant_ID INT NOT NULL,
  Registration_Date DATETIME NOT NULL,
  FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
  FOREIGN KEY (Participant_ID) REFERENCES Participants(Participant_ID),
  UNIQUE(Event_ID, Participant_ID) -- Enforces the unique index
);

CREATE TABLE Event_Management (
  Management_ID INT PRIMARY KEY AUTO_INCREMENT,
  Event_ID INT NOT NULL,
  Team_ID INT NOT NULL,
  FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
  FOREIGN KEY (Team_ID) REFERENCES Teams(Team_ID),
  UNIQUE(Event_ID, Team_ID) -- Enforces the unique index
);

CREATE TABLE Event_Sponsorships (
  Sponsorship_ID INT PRIMARY KEY AUTO_INCREMENT,
  Event_ID INT NOT NULL,
  Sponsor_ID INT NOT NULL,
  Contribution_Amount DECIMAL(12,2),
  FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
  FOREIGN KEY (Sponsor_ID) REFERENCES Sponsors(Sponsor_ID),
  UNIQUE(Event_ID, Sponsor_ID) -- Enforces the unique index
);

ALTER TABLE Participants
ADD COLUMN Password VARCHAR(255) NOT NULL;

ALTER TABLE Student_Members
ADD COLUMN Password VARCHAR(255) NOT NULL;

USE iit_jammu_fest;

-- 1. Add 'SuperAdmin' to the ENUM list
ALTER TABLE Student_Members
MODIFY COLUMN Role ENUM('Head', 'Co-head', 'SuperAdmin') NOT NULL;

-- 2. Make the Team_ID optional (nullable)
ALTER TABLE Student_Members
MODIFY COLUMN Team_ID INT NULL;

USE iit_jammu_fest;

-- This adds 'Member' to the list of allowed roles
ALTER TABLE Student_Members
MODIFY COLUMN Role ENUM('Head', 'Co-head', 'SuperAdmin', 'Member') NOT NULL;

Show Tables ;

Select * from Participants;
Select * from Tickets;
Select * from Events;
Select * from DaySchedule;
Select * from Student_Members;


