# 🧪 Lab Sample Tracker

A full-stack web application built using **ReactJS**, **Spring Boot**, and **Microsoft SQL Server**.  
It allows lab users to securely create, track, and manage lab samples with **user authentication**, **pagination**, and **status-based workflow**.

---

## 🚀 Key Features

✅ **JWT Authentication** – Secure login and logout using tokens.  
✅ **User-Specific Samples** – Each user only sees their own samples.  
✅ **CRUD Operations** – Create, View, Update, and Delete samples.  
✅ **Auto Sample ID Generation** – `S-YYMMDD-000001` format.  
✅ **Pagination & Filtering** – View samples with pagination and filter by status.  
✅ **Responsive UI** – Built with Material UI components.  

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | ReactJS (Material UI, Axios, Redux Toolkit, React Router) |
| **Backend** | Spring Boot 3.3.x (Java 17) |
| **Database** | Microsoft SQL Server (Local instance) |
| **Authentication** | JWT (JSON Web Token) |
| **Build Tools** | Maven for backend, npm for frontend |

---

## ⚙️ Prerequisites

Make sure the following are installed:

- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [Node.js 18+ (with npm)](https://nodejs.org/)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) or Azure Data Studio
- IDE (IntelliJ IDEA / VS Code)

---

## 🧱 Database Setup (Local SQL Server)

1. **Open SSMS / Azure Data Studio**
2. **Create a new database:**
   ```sql
   CREATE DATABASE lab_tracker;
   GO
 
---    
   
## ⚙️ To run application locally
1️⃣ To start the Backend

cd backend

mvn spring-boot:run

✅ The backend will start at
👉 http://localhost:8081

When it runs for the first time, tables like users and samples are auto-created in SQL Server by Hibernate.

2️⃣ To start the Frontend
In a new terminal:

cd frontend

npm install

npm start


✅ The frontend will start at
👉 http://localhost:3000

🔐 To register and login

A user needs to be registered (in Postman or frontend)

POST http://localhost:8081/api/auth/register

{
  "username": "YourUsername",
  
  "password": "YourPassword"
}

To login (from frontend)

Open http://localhost:3000

Enter your credentials

A JWT token will be generated and saved automatically.

---

✅ Now you’re ready to run the Lab Sample Tracker locally!

Start both servers, open http://localhost:3000, login, and begin managing your samples.
