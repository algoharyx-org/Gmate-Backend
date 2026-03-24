# GMATE Backend Server

A robust Node.js backend for the GMATE platform, built with Express, Mongoose, and modular architecture.

## 🚀 Features
- **Modular Architecture**: Organized into specific modules (auth, user, project, task).
- **Authentication**: Secure JWT-based authentication and authorization.
- **Environment Driven**: Configuration managed via environment variables.
- **Security**: Includes Helmet for header security and Express Rate Limit.
- **Error Handling**: Centralized error handling middleware.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Validation**: Joi
- **Security**: bcrypt, jsonwebtoken, helmet, express-rate-limit

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the values in `.env` with your actual configuration.

### Running the App
- **Development mode**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

## 📂 Project Structure
- `src/DB`: Database connection setup.
- `src/config`: Environment and app configuration.
- `src/middlewares`: Global and custom middlewares (auth, errors, etc.).
- `src/modules`: Feature-based modules (Auth, Users, Projects, Tasks).
- `src/utils`: Utility functions and helpers.

## 📄 License
ISC
