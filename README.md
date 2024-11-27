# Mini Library System

The Mini Library System is a backend project built with Node.js, Express, and MongoDB. This system manages books, users, roles, wishlists, and loans, and it includes a feature for overdue penalty calculation. Additionally, it supports notifications for due dates and new books.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **User Management**: Role-based access control with admin and user roles.
- **Book Management**: CRUD operations for books with a review and rating system.
- **Wishlist**: Users can add or remove books to/from their wishlist.
- **Loan System**: Tracks book loans with due dates.
- **Penalty Calculation**: Calculates overdue penalties.
- **Notifications**: Automated due date reminders and new book notifications.
- **Search and Filter**: Search by title, author, genre, and publication date range.

## Prerequisites

- Node.js v22+ and npm v10+
- MongoDB instance
- Nodemailer SMTP configuration for email notifications

## Getting Started
```bash
git clone https://github.com/yourusername/mini-library-system.git
cd mini-library-system
cp .env.example .env
npm install
npm run build
npm start
```

## API Documentation
The API is documented using Swagger. Once the server is running, you can access the documentation by visiting [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Project Structure

### Folder Explanations

- **controllers/**: Contains logic to handle incoming requests and send responses.
- **models/**: Defines Mongoose schemas for database structure and validation.
- **services/**: Holds business logic, handling data manipulation and database interactions.
- **routes/**: Defines API endpoints and integrates with Swagger documentation.
- **utils/**: Contains utility functions like email and scheduled cron jobs.
- **middlewares/**: Middleware for request processing, such as authentication.
- **config/**: Holds configuration files, including database and environment setup.

This structure organizes the project logically, making it easy to navigate and maintain.


## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this software, provided that this license file is included with all copies or substantial portions of the software.

