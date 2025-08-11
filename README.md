# 🚖 Ride Express (Backend)

A **modular, scalable, and production-ready** backend for a ride-hailing platform built with **TypeScript**, **Express.js**, and **MongoDB**. It supports **secure authentication**, **role-based access**, and a complete **ride request & fulfillment workflow** with real-time status updates.

---

## 🌍 Live API

**Base URL:** `https://ride-express-backend.vercel.app`

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

## 🚀 Features

### 🛵 Rider Features

- **User Registration & Login** (via credentials or Google OAuth)
- **Profile Management** – View and update personal details
- **Request a Ride** – Specify pickup and destination coordinates, choose vehicle type
- **Ride History** – View list of completed and cancelled rides
- **Cancel Ride** – Cancel a requested or accepted ride before pickup
- **Password Management** – Change/reset/set password securely

---

### 🚗 Driver Features

- **Driver Application** – Riders can apply to become drivers
- **Update Driver Availability** – Toggle availability for accepting rides
- **Accept & Fulfill Rides** – Update ride status through full workflow:
  `REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED`
- **Earnings Tracking** – View total earnings from completed rides

---

### 🛠️ Admin & Super Admin Features

- **User Management** – View all registered users, view individual profiles, update user details
- **Driver Application Management** – Review and update driver application status
- **Ride Management** – View all rides in the system
- **Role-Based Access Control** – Restrict actions to only authorized roles

---

## 📡 API Endpoints

Below is the complete list of available API endpoints for **Ride Express**.

---

### **1️⃣ User Management**

#### **Register User** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/user/register
```

**Body:**

```json
{
  "name": "Your Name",
  "email": "your-email@gmail.com",
  "password": "123456Ab@"
}
```

**Access:** Public

---

#### **Get All Users** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/user/all-users
```

**Access:** `ADMIN`, `SUPER_ADMIN`

---

#### **Get Single User** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/user/:id
```

**Access:** `ADMIN`, `SUPER_ADMIN`

---

#### **Get My Profile** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/user/me
```

**Access:** All authenticated users

---

#### **Update User** – `PATCH`

```
https://ride-express-backend.vercel.app/api/v1/user/:id
```

**Body Example:**

```json
{
  "address": "Nandina",
  "phone": "017XXXXXXXX",
  "picture": "https://example.com/profile.jpg",
  "role": "DRIVER", // only admin and super admin
  "isActive": "ACTIVE", // only admin and super admin
  "isDeleted": false, // only admin and super admin
  "isVerified": true // only admin and super admin
}
```

**Access:**

- User can update own profile
- `ADMIN` & `SUPER_ADMIN` can update any user

---

### **2️⃣ Authentication**

#### **Login** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/auth/login
```

**Body:**

```json
{
  "email": "registered-email@gmail.com",
  "password": "your-password"
}
```

**Access:** Public

---

#### **Refresh Token** – `POST`

```
http://localhost:5000/api/v1/auth/refresh-token
```

**Access:** Public (with valid refresh token)

---

#### **Logout** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/auth/logout
```

**Access:** Authenticated users

---

#### **Set Password (Google Users)** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/auth/set-password
```

**Body:**

```json
{
  "password": "753952Bd@"
}
```

**Access:** Authenticated Google users

---

#### **Reset / Change Password** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/auth/reset-password
```

**Body:**

```json
{
  "oldPassword": "your-old-password",
  "newPassword": "your-new-password"
}
```

**Access:** Authenticated users

---

### **3️⃣ Driver Management**

#### **Apply to Become Driver** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/driver/apply-driver
```

**Body:**

```json
{
  "vehicleType": "CAR",
  "vehicleModel": "Honda City 2021",
  "licenseNumber": "MH-2024-XYZ123",
  "vehicleNumber": "MH12AB4567"
}
```

**Access:** `RIDER` only

---

#### **Get All Driver Applications** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/driver/driver-application
```

**Query Params:**

- `status=APPROVED`
- `vehicleType=CAR`
- `availability=AVAILABLE`

**Access:** `ADMIN`, `SUPER_ADMIN`

---

#### **Update Driver Status** – `PATCH`

**URL:**

```
https://ride-express-backend.vercel.app/api/v1/driver/driver-application/status/:driverId
```

**Body:**

```json
{
  "driverStatus": "APPROVED"
}
```

**Access:** `ADMIN`, `SUPER_ADMIN`

---

#### **Update Availability** – `PATCH`

**URL:**

```
https://ride-express-backend.vercel.app/api/v1/driver/update-availability
```

**Body:**

```json
{
  "availability": "AVAILABLE"
}
```

**Access:** `DRIVER` only

---

### **4️⃣ Ride Management**

#### **Request Ride** – `POST`

```
https://ride-express-backend.vercel.app/api/v1/ride
```

**Body:**

```json
{
  "pickupLocation": {
    "type": "Point",
    "coordinates": [23.7722057738986, 90.40114048717416] // lat, lan
  },
  "destinationLocation": {
    "type": "Point",
    "coordinates": [23.793921843208647, 90.40349750156938] // lat, lan
  },
  "vehicleType": "CAR"
}
```

**Access:** `RIDER` only

---

#### **Update Ride Status** – `PATCH`

```
https://ride-express-backend.vercel.app/api/v1/ride/rideStatus/:rideId
```

**Body:**

```json
{
  "rideStatus": "COMPLETED"
}
```

## 🔄 Ride Status Flow

```
REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED
     ↘ REJECTED
     ↘ CANCELLED
```

**Access:** `DRIVER` only

---

#### **Get All Rides** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/ride
```

**Access:** `ADMIN`, `SUPER_ADMIN`

---

#### **Cancel Ride** – `PATCH`

```
https://ride-express-backend.vercel.app/api/v1/ride/cancel/:rideId
```

**Body:**

```json
{
  "rideStatus": "CANCELLED"
}
```

**Access:** `RIDER` only

---

#### **Ride History (Rider)** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/ride/rideHistory
```

**Access:** `RIDER` only

---

#### **Earning History (Driver)** – `GET`

```
https://ride-express-backend.vercel.app/api/v1/ride/earnings
```

**Access:** `DRIVER` only

---

## 📌 Validation Rules

- **Coordinates** must be `[latitude, longitude]` format within valid ranges.
- **Vehicle type** must match the driver’s registered type.
- **Driver availability** must be set to AVAILABLE before accepting rides.

---

## ⚙️ Setup & Environment

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ride-express-backend.git
cd ride-express-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the **root directory** and copy the following demo configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Demo Mongo URI)
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/demo-db?retryWrites=true&w=majority

# JWT Auth (Demo secrets)
JWT_ACCESS_SECRET=demo_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=demo_refresh_secret
JWT_REFRESH_EXPIRES=30d

# Express Session
EXPRESS_SESSION_SECRET=demo_session_secret

# Password Hashing
BCRYPT_SALT_ROUND=10

# Super Admin (Demo credentials)
SUPER_ADMIN_EMAIL=demo_super_admin@example.com
SUPER_ADMIN_PASSWORD=DemoPassword123!

# Frontend URL (Demo)
FRONTEND_URL=http://localhost:5173

# Google OAuth (Demo credentials)
GOOGLE_CLIENT_ID=your-demo-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-demo-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

> 💡 **Note:** Replace placeholder values (`<username>`, `<password>`, `your-demo-google-client-id`, etc.) with actual credentials in your local development environment.

---

## 🚀 Start the Project

### Development Mode

Runs with **hot reload**:

```bash
npm run dev
```

### Production Build

Build and run optimized code:

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

---

## 📜 License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it for educational and commercial purposes, provided that the original copyright notice is included.

---

## 👨‍💻 Author

**Your Name** – [GitHub](https://github.com/raufurislam) | [LinkedIn](https://www.linkedin.com/in/raufur-islam/)

---

## 🙌 Acknowledgements

Special thanks to:

- **MongoDB**, **Express**, **TypeScript**, **Node.js** – for powering the backend.
- **Zod** – for making validation clean and maintainable.
- **Open Source Community** – for inspiring architecture and best practices.

---

## 📧 Contact

For questions, feedback, or collaboration opportunities:

- **Email:** [raufurislam@gmail.com](mailto:youremail@example.com)
- **GitHub Issues:** Please open a ticket in this repository.
