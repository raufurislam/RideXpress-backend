# 🚖 Ride Express (Backend)

A **modular, scalable, and production-ready** backend for a ride-hailing platform built with **TypeScript**, **Express.js**, and **MongoDB**. It supports **secure authentication**, **role-based access**, and a complete **ride request & fulfillment workflow** with real-time status updates.

---

## 🌍 Live API

**Base URL:** `https://your-api-name.vercel.app/api/v1`

---

## ✨ Key Features

- **JWT-Based Authentication** – Secure login for all user roles (**admin**, **rider**, **driver**).
- **Role-Based Authorization** – Middleware ensures users only access endpoints allowed for their role.
- **Driver & Rider Profiles** – Store and manage personal & vehicle details.
- **Ride Request & Fulfillment Workflow**

  - `REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED`
  - Includes validations for proper status transitions.

- **Earnings Tracking** – Automatically update driver earnings upon ride completion.
- **Real-time Ride Status Updates** – Instant feedback for users and drivers.
- **Data Validation** – Strong schema validation using **Zod**.
- **MongoDB Transactions** – Ensures data consistency in multi-step operations.
- **Error Handling** – Centralized handling with custom `AppError` class.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── config/
│   ├── errorHelpers/
│   ├── helpers/
│   ├── interface/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── driver/
│   │   ├── ride/
│   │   └── user/
│   ├── routes/
│   ├── utils/
│   └── constants
├── app.ts/
├── server.ts
```

---

Here’s a **Tech Stack** section you can use for your README based on your `package.json` and your project setup:

---

## 🛠 Tech Stack

**Core Framework & Language**

- **Node.js** – Runtime environment
- **Express.js (v5)** – Web framework for building RESTful APIs
- **TypeScript** – Static typing for better maintainability

**Database & ORM**

- **MongoDB** – NoSQL database for flexible data storage
- **Mongoose** – Elegant MongoDB object modeling

**Authentication & Security**

- **JWT (jsonwebtoken)** – Token-based authentication
- **bcryptjs** – Password hashing
- **Passport.js** – Authentication middleware
- **Passport-Local & Passport-Google-OAuth20** – Local and Google login strategies

**Validation & Utilities**

- **Zod** – Data schema validation
- **Day.js** – Date and time manipulation
- **Http-Status-Codes** – Clean HTTP response codes
- **Axios** – HTTP client for external API calls

**Development & Tooling**

- **ts-node-dev** – Hot-reloading for TypeScript
- **ESLint** – Code linting
- **dotenv** – Environment variable management

---

## 🚦 API Endpoints

### **Authentication**

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/v1/auth/signup` | Create a new user account    |
| POST   | `/api/v1/auth/login`  | Log in and receive JWT token |

### **Rides**

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/api/v1/ride`                | Create a ride request |
| PATCH  | `/api/v1/ride/:rideId/status` | Update ride status    |
| GET    | `/api/v1/ride/:rideId`        | Get ride details      |

---

## 🔄 Ride Status Flow

```
REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED
     ↘ REJECTED
     ↘ CANCELLED
```

Invalid transitions (e.g., `REQUESTED → COMPLETED`) will return an error showing the correct flow.

---

## 📌 Validation Rules

- **Coordinates** must be `[longitude, latitude]` format within valid ranges.
- **Vehicle type** must match the driver’s registered type.
- **Driver availability** must be set to AVAILABLE before accepting rides.

---

## 📦 Installation

```bash
git clone <repo-url>
cd ride-hailing-backend
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster-url/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

---

## 🚀 Running the Project

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

---

## 🧪 Testing API with Example Request

**POST** `/api/v1/ride`

```json
{
  "pickupLocation": {
    "type": "Point",
    "coordinates": [90.40114048717416, 23.7722057738986]
  },
  "destinationLocation": {
    "type": "Point",
    "coordinates": [90.40349750156938, 23.793921843208647]
  },
  "vehicleType": "BIKE"
}
```

---

## 📜 License

This project is part of the **Next Level Development Assignment 5** and is for educational purposes.

---

I can make this README **extra polished** by adding:

- 🖼 API flow diagrams
- 📊 ERD database diagram
- 📍 Example coordinate map screenshots

Do you want me to enhance it that way? That would make it perfect for your assignment submission.
