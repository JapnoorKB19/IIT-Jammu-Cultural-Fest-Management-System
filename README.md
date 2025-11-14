
-----

# IIT Jammu Cultural Fest Management System

This is a full-stack web application built to manage all aspects of the IIT Jammu Cultural Fest. It features a secure, role-based administrative panel for managing events, participants, and budgets, as well as a public-facing website for attendees to browse events and register.


-----

## ✨ Features

The application is split into two main parts: a secure admin panel and a public website.

### 1\. 🛡️ Secure Admin Panel

A complete internal dashboard for managing the festival, protected by a JWT-based authentication system.

  * **Role-Based Access Control (RBAC):**
      * **SuperAdmin:** Has full control over the entire system, including deleting sensitive data and managing other admins.
      * **Head / Co-head:** Can manage most day-to-day operations, such as editing events and adding new team members.
      * **Member:** (Can be expanded for read-only access).
  * **Dynamic Dashboard:** A central dashboard showing key statistics like Total Events, Total Participants, Total Sponsors, and Budget vs. Revenue.
  * **Full CRUD Management:** A complete, user-friendly interface to Create, Read, Update, and Delete data for all 14 database tables:
      * Events
      * Day Schedule
      * Venues
      * Performers
      * Sponsors
      * Organizing Teams
      * Student Members
      * Participants
      * Budget & Expenses
  * **Junction Table Management:** Intuitive interfaces for managing relationships:
      * **Event Registrations:** View, add, or remove participants from an event.
      * **Event Sponsorships:** Link sponsors to an event and set their contribution amount.
      * **Event Management:** Assign organizing teams (e.g., "Tech Team") to an event.
  * **Admin Registration:** A secure, `SuperAdmin`-only page for creating new `Head` or `Co-head` accounts.

### 2\. 🌎 Public-Facing Website

The main website for festival attendees.

  * **Event Catalog:** A dynamic home page that fetches and displays all events in a card-based layout.
  * **Event Detail Pages:** Each event has its own public page showing details like the performer, venue, day, and prize money.
  * **Full Participant Authentication:**
      * Users can **register** for a new participant account.
      * Users can **log in** and **log out**.
      * The navbar dynamically updates based on login status.
  * **Event Registration:** Logged-in participants can register for events from the event detail page. The system handles users who are already registered.
  * **Personal Dashboards:**
      * **My Registrations:** A protected page where users can see a list of all events they are registered for.
      * **My Tickets:** A protected page that lists all tickets generated from their registrations.

-----

## 🚀 Tech Stack

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js (with Vite)** | For building a fast, modern single-page application (SPA). |
| | **React Router** | For client-side routing and creating multiple pages. |
| | **Tailwind CSS** | For utility-first styling and a professional, responsive UI. |
| | **Axios** | A promise-based HTTP client for all API requests. |
| | **React Context API** | For global state management (managing admin & participant auth state). |
| **Backend** | **Node.js** | The JavaScript runtime environment for the server. |
| | **Express.js** | The web framework used to build our RESTful API. |
| | **MySQL2** | The Node.js driver used to connect to our database. |
| **Database** | **MySQL** | A robust relational database to ensure data integrity. |
| **Security** | **JSON Web Tokens (JWT)** | For creating secure, stateless authentication tokens. |
| | **bcrypt.js** | For hashing and salting all user and admin passwords. |

-----

## 🗃️ Database Schema

The database is highly normalized to **BCNF (Boyce-Codd Normal Form)** to ensure data integrity and eliminate redundancy. The design is centered around the `Events` table, which is linked to all other core entities via foreign keys or junction tables.

The schema from the design report was modified during development to include:

  * `Password` columns in `Student_Members` and `Participants`.
  * An expanded `Role` ENUM (`Head`, `Co-head`, `SuperAdmin`, `Member`) in `Student_Members`.
  * A `NULL`-able `Team_ID` in `Student_Members` to accommodate the `SuperAdmin` role.

-----

## 🏁 Getting Started (Local Setup)

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v20+ recommended)
  * An active MySQL server (local or cloud-based)

### 1\. Backend Setup

1.  **Navigate to the server folder:**
    ```bash
    cd server
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Create your environment file:**
      * Create a file named `.env` in the `server` folder.
      * Copy the contents of `.env.example` (see below) into it.
      * Fill in your MySQL database credentials and a `JWT_SECRET`.
4.  **Run the server:**
    ```bash
    npm run dev
    ```
    Your backend API will be running at `http://localhost:5000`.

### 2\. Frontend Setup

1.  **Navigate to the client folder (in a new terminal):**
    ```bash
    cd client
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Run the client:**
    ```bash
    npm run dev
    ```
    Your React app will be running at `http://localhost:5173`.

-----

### `.env.example` file

Create this file in your `/server` directory and rename it to `.env`.

```ini
# Server Port
PORT=5000

# MySQL Database Credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=iit_jammu_fest

# JSON Web Token Secret
JWT_SECRET=thisisatopsecretkeyandshouldbechanged
```
