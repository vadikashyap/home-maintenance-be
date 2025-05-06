# HomeGuardians Backend

## Project Overview
The backend of HomeGuardians is a Node.js application using Express.js and MongoDB to handle user authentication, task management, and other server-side functionalities.

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or remote, e.g., MongoDB Atlas)
- Git

## Installation Instructions

### Clone the Repository
```=> bash
git clone https://github.com/YourUsername/HomeGuardians-BE.git
cd HomeGuardians-BE
Install Dependencies
Install the required Node.js packages:

=> bash
 
npm install
Environment Variables
Create a .env file in the root directory and add the following environment variables:

env
 
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
MONGO_URI: MongoDB connection string (e.g., from MongoDB Atlas or your local MongoDB setup).
JWT_SECRET: A secret key used to sign JWT tokens for authentication.
Start the Server
Start the server locally:

=> bash
 
npm start
The backend server will run on http://localhost:8080.

API Endpoints
Authentication
POST /register: Register a new user.
Request body:
json
 
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
POST /login: Log in an existing user.
Request body:
json
 
{
  "email": "john@example.com",
  "password": "password123"
}
Tasks
GET /:id: Fetch user data and associated tasks (requires authentication).
Other CRUD operations: Add endpoints here as necessary.
MongoDB Setup
Option 1: Local MongoDB
Download and install MongoDB from https://www.mongodb.com/try/download/community.
Start the MongoDB server:
=> bash
 
mongod
Option 2: MongoDB Atlas (Cloud)
Create a free cluster on MongoDB Atlas.
Obtain your connection string.
Replace your_mongodb_connection_string in the .env file with your Atlas connection string.
