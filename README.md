# Ride Booking API

### **🎯 Project Overview**

Design and build a **secure, scalable, and role-based backend API** for a **ride booking system** (like Uber, Pathao) using **Express.js** and **Mongoose**.

Your task is to implement a system where **riders** can request rides, **drivers** can accept and complete rides, and **admins** can manage the overall system.

You must implement:

- 🔐 Authentication
- 🎭 Role-based Authorization
- 🧍 Rider & Driver Logic
- 🚗 Ride Management Logic
- 📦 Modular Code Architecture
- 🔁 Proper API Endpoints

While the **system design is up to you**, the implementation **must include the following minimum requirements**.

---

### **📌 Minimum Functional Requirements**

- ✅ JWT-based login system with three roles: `admin`, `rider`, `driver`
- ✅ Secure password hashing (using bcrypt or other appropriate way)
- ✅ Riders should be able to:
  - Request a ride with pickup & destination location
  - Cancel a ride (within allowed window)
  - View ride history
- ✅ Drivers should be able to:
  - Accept/reject ride requests
  - Update ride status (Picked Up → In Transit → Completed)
  - View earnings history
  - Set availability status (Online/Offline)
- ✅ Admins should be able to:
  - View all users, drivers, and rides
  - Approve/suspend drivers
  - Block/unblock user accounts
  - Generate reports (optional)
- ✅ All rides must be **stored with complete history**
- ✅ Role-based route protection must be implemented

---

### **🧠 Design Thinking Guide**

Think through the following aspects to ensure clean logic and future scalability.

---

### **🚘 Ride Request & Fulfillment**

- How will ride requests be matched with available drivers?
  - Manual via driver action or auto-match?
- How will cancellation be handled?
  - Allowed only before driver accepts?
- What happens if no driver is available?
  - Waitlist or error response?
- How will pickup/destination locations be stored?
  - Coordinates (lat/lng)? Addresses?

---

### **🛠 Ride Lifecycle & Status**

- What statuses will a ride go through?
  - e.g., requested → accepted → picked_up → in_transit → completed
- Can a ride be canceled at any stage?
- Who can update which status?
  - Driver only? Admin?
- Will you log timestamps for each status?

---

### **👥 Role Representation**

- Will you use a single User model with role field?
- Will drivers have extra fields?
  - Approval status? Online status? Vehicle info?
- What is the minimum data required at registration?

---

### **🫵 Validations & Business Rules**

- Can a suspended driver accept rides?
- What if a driver is already on a ride?
- Can multiple rides be active for a single rider?
- Will there be maximum allowed cancel attempts?

---

### **📜 Access & Visibility**

- Can riders view all past rides?
- Can drivers see only completed rides or pending ones too?
- Can admins:
  - View all ride records?
  - Block riders/drivers?
  - Change ride statuses manually (optional)?

---

### **🔐 Role-Based Control**

- What endpoints are only for riders?
- What endpoints are only for drivers?
- What endpoints are shared or admin-only?
- How will you protect routes based on JWT + role?

---

### **🧩 API Design**

- Follow RESTful route conventions:
  - POST /rides/request, PATCH /rides/:id/status, GET /rides/me
  - PATCH /drivers/approve/:id, PATCH /users/block/:id
- Handle all common edge cases:
  - Ride conflicts, invalid requests, blocked users, etc.
- Use proper status codes and clear messages:
  - 200, 201, 400, 403, 404, etc.

---

### **🧠 Optional (Bonus Considerations)**

- Will you implement:
  - **Driver ratings**?
  - **Rider feedback system**?
  - **Fare estimation logic**?
  - **Admin dashboard analytics?**
  - **Geo-based driver search?**

> ⚠️ Use this section as your planning tool before you write code.

---

### **📁 Suggested Project Structure**

Maintain a modular, production-ready architecture:

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

Feel free to customize as needed.

---

### **🧪 Testing & Documentation**

- ✅ Use **Postman** to test and document your endpoints
- ✅ Submit a professional README.md with:
  - Project overview
  - Setup & environment instructions
  - API endpoints summary
- ✅ Submit a **5–10 minute screen-recorded video** demonstrating:
  - **Intro (30s)** – Name, project name, core idea
  - **Folder Structure (1 min)** – Brief walkthrough of src/
  - **Auth Flow (1 min)** – Register, login, JWT, roles
  - **Rider Features (1 min)** – Request, cancel, ride history
  - **Driver Features (1 min)** – Accept ride, update status, earnings
  - **Admin Features (1 min)** – Approve/suspend drivers, view system
  - **Postman Demo (3–4 min)** – End-to-end test flow
  - **Wrap Up (30s)** – Summary + README mention

---

### **📊 Evaluation Rubric (Total: 60 Marks)**

| **Criteria**                                             | **Marks** |
| -------------------------------------------------------- | --------- |
| 🔐 Authentication (JWT + bcrypt)                         | 5         |
| 🔒 Role-Based Authorization Middleware                   | 5         |
| 👤 Rider/Driver/Admin Logic + Schema Design + Validation | 10        |
| 🚕 Ride Logic + History + Status Flow + Validation       | 10        |
| 📜 Ride History + Cancellation Handling                  | 10        |
| 🧱 Code Structure + Error Handling                       | 5         |
| 🧠 Creativity + Thoughtful Architecture                  | 5         |
| 📄 README + 🔁 API Testing + 🎥 Video                    | 10        |
| **Total**                                                | **60**    |
