A full-stack platform that connects students with consultants for study abroad guidance.
Built with Node.js, Express, MongoDB, React, and Tailwind, the app supports bookings, availability management, authentication, notifications, and video sessions.
Future versions will integrate AI assistance (OpenAI / Gemini APIs) for personalized student guidance.

🚀 Features (Modules Completed)

Authentication & Authorization

Role-based login (student, consultant, admin)

JWT secured endpoints

Availability Management

Consultants can create and manage availability slots

Slots automatically lock once booked

Booking System

Students can book consultant slots

Bookings can be created, fetched, or deleted

Admin can view all bookings

User Dashboards

Student dashboard: booked sessions

Consultant dashboard: scheduled consultations

Admin dashboard: system-wide view

Notifications (in progress)

Email confirmations with Nodemailer

Planned: in-app + push notifications

Video Consultation (up next)

Secure 1:1 video sessions with Twilio Video

Rooms created dynamically per booking

AI Integration (planned)

Use OpenAI/Gemini for personalized guidance

E.g., “Suggest top 3 universities for my profile”

📌 API Routes (Current & Planned)
🔑 Auth

POST /api/auth/register → Register user

POST /api/auth/login → Login

📅 Availability

POST /api/availability/create → Consultant creates availability

GET /api/availability/all → Get all available slots

📖 Bookings

GET /api/bookings/mine → Get my bookings (student/consultant)

POST /api/bookings/create/:availabilityId → Book a slot

POST /api/bookings/delete/:bookingId → Cancel booking

GET /api/bookings/admin/all → Admin: fetch all bookings

GET /api/bookings/:id → Get booking by ID (with populated details)

📹 Video Sessions (Planned)

POST /api/bookings/:id/session → Create session + token

GET /api/bookings/:id/session → Fetch session details

🔔 Notifications (Planned)

POST /api/notifications/email → Send email confirmation

GET /api/notifications/mine → Fetch my notifications

🤖 AI Guidance (Planned)

POST /api/ai/advice → Generate study abroad advice using OpenAI/Gemini

🛠️ Tech Stack

Backend: Node.js, Express, MongoDB, Mongoose

Frontend: React, Tailwind CSS, shadcn/ui

Video Sessions: Twilio Video SDK

Notifications: Nodemailer (emails), push notifications planned

AI: OpenAI API / Google Gemini API (planned)

🎯 Vision

The goal of this project is to build a production-ready consultation platform that:

Helps students connect with verified consultants

Streamlines the booking + availability workflow

Adds video calls, payments, and AI guidance for a modern experience

Scales for real-world usage (indexes, caching, monitoring to be added later)
