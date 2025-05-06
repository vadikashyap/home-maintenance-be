# Home Maintenance Backend

## Project Overview

Home Maintenance is a comprehensive home maintenance task management system. The backend is built with Node.js, Express.js, and MongoDB to handle user authentication, task management, and automated reminders for home maintenance tasks.

## Features

- 🔐 Secure user authentication with JWT
- 👤 User registration and login
- 📝 Task management (create, update, deletintervale)
- ⏰ Automated task reminders
- 📅 Predefined maintenance tasks
- 🔄 Recurring tasks (yearly, monthly, weekly)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or remote, e.g., MongoDB Atlas)
- Git

## Installation Instructions

### Clone the Repository

```bash
git clone https://github.com/YourUsername/Home Maintenance-BE.git
cd Home Maintenance-BE
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

- `MONGO_URI`: MongoDB connection string (e.g., from MongoDB Atlas or your local MongoDB setup)
- `JWT_SECRET`: A secret key used to sign JWT tokens for authentication

### Start the Server

```bash
# For development with auto-reload
npm run dev

# For production
npm start
```

The backend server will run on http://localhost:8080.

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/users/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "tasks": [],
    "_id": "user_id",
    "createdAt": "timestamp"
  },
  "token": "jwt_token"
}
```

#### Login User

```http
POST /api/users/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "userId": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Task Endpoints

#### Create Task

```http
POST /api/tasks
```

Headers:

```
Authorization: Bearer jwt_token
```

Request body:

```json
{
  "name": "Change water filter",
  "isPredefined": false,
  "reminderTime": "2024-03-20T10:00:00Z",
  "userId": "user_id"
}
```

#### Update Task Reminder

```http
PUT /api/tasks/:id
```

Headers:

```
Authorization: Bearer jwt_token
```

Request body:

```json
{
  "isReminderSet": true,
  "reminderTime": "2024-03-20T10:00:00Z"
}
```

#### Get User Profile with Tasks

```http
GET /api/users/:id
```

Headers:

```
Authorization: Bearer jwt_token
```

## Predefined Tasks

The system automatically creates these predefined tasks for new users:

- Change water filter (monthly)
- Test smoke/fire alarm (yearly)
- Replace air purifier filter (monthly)

## Security Features

- Password hashing using crypto with salt
- JWT token-based authentication
- Protected routes with middleware
- CORS enabled for cross-origin requests

## Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  salt: String,
  token: String,
  tasks: [Task],
  createdAt: Date
}
```

### Task Model

```javascript
{
  name: String,
  isPredefined: Boolean,
  reminderTime: Date,
  isReminderSet: Boolean,
  user: ObjectId (ref: User),
  createdAt: Date
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
