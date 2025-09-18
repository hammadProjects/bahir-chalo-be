# 🌍 Bahir Chalo

An **AI-powered platform** that helps students find study abroad opportunities and connect with professional consultants for **1:1 guidance**.  
Built with **Node.js, Express, MongoDB**.

---

## 🚀 Features (Modules Completed)

### 🔑 Authentication

- Signup, login, logout
- OTP verification & resend
- Password reset (forgot + reset via token)

### 👨‍💼 Consultant Availability

- Consultants create availability slots
- Students fetch available slots
- Consultants delete slots

### 📅 Booking System

- Students book a slot by availability ID
- Students cancel a booking
- Fetch personal bookings (`/mine`)
- Admin can view all bookings
- Fetch booking by ID (admin only)

### 🎓 Onboarding

- Student onboarding
- Consultant onboarding

### 👑 Admin

- Approve or reject consultant applications
- Fetch pending consultants

### 📤 Upload

- Upload single file (authenticated)

---

## 📌 API Routes

### 🔑 Auth

- `POST /auth/signup` → Register
- `POST /auth/login` → Login
- `DELETE /auth/session` → Logout
- `POST /auth/otp/verify` → Verify OTP
- `POST /auth/otp/resend` → Resend OTP
- `POST /auth/password/forgot` → Forgot password
- `PATCH /auth/password/reset/:token` → Reset password

### 👨‍💼 Consultant

- `POST /consultant` → Add consultant availability
- `GET /consultant` → Get consultants
- `GET /consultant/get-availabilities` → Get availabilities
- `DELETE /consultant/availability/:id` → Delete availability
- `PATCH /consultant/onboarding` → Consultant onboarding

### 🎓 Student

- `PATCH /student/onboarding` → Student onboarding

### 📅 Bookings

- `GET /booking/mine` → Get my bookings
- `POST /booking/create/:availabilityId` → Create booking
- `POST /booking/delete/:bookingId` → Cancel booking
- `GET /booking/admin/all` → Get all bookings (admin only)
- `GET /booking/:bookingId` → Get booking by ID (admin only)

### 🗓 Availability

- `POST /availability` → Set availability (consultant only)
- `GET /availability/:id/availability` → Get availability by ID
- `DELETE /availability/:id` → Delete availability

### 👑 Admin

- `GET /admin/consultants/pending` → Get pending consultants
- `PATCH /admin/consultants/:id` → Approve/reject consultant

### 📤 Upload

- `POST /upload/single` → Upload single file

---

## 🔮 Modules To Be Completed

- Notifications (emails, in-app, push)
- Payments (subscription/credit system)
- Video Calls
- AI Guidance (OpenAI / Gemini integration)

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: NextJS, Tailwind CSS, shadcn/ui
- **Auth**: JWT
- **File Uploads**: Multer, Cloudinary
- **Planned**: Vonage (video), Nodemailer (email), OpenAI/Gemini (AI)
