# Bahir Chalo Backend

An **AI-powered platform** that helps students find study abroad opportunities and connect with professional consultants for **1:1 guidance**. Built with **Node.js, Express, TypeScript, and MongoDB**.

The platform implements a comprehensive backend system for managing user authentication, consultant bookings, payments, file uploads, and AI-powered guidance features.

---

## System Overview

The Bahir Chalo platform works as follows:

1. **Students** register and complete onboarding to access the platform
2. **Consultants** apply for approval and set their availability slots
3. **Students** browse available consultants and book 1:1 sessions
4. **Payments** are processed securely through Stripe integration
5. **AI guidance** provides personalized study abroad recommendations
6. **Real-time communication** enables seamless interactions

This architecture forms the foundation for connecting students with expert consultants globally.

---

## Architecture

The system consists of several key layers:

### API Layer (Express.js)

- RESTful API endpoints for all platform features
- Request validation using Zod schemas
- Rate limiting and security middleware
- Cookie-based authentication with JWT

### Service Layer

- Business logic separation
- Integration with external services (Stripe, Cloudinary, etc.)
- Email and SMS notifications
- AI-powered guidance system

### Data Layer

- MongoDB with Mongoose ODM
- User, booking, and transaction models
- File storage with Cloudinary
- Real-time data synchronization

### External Integrations

- Stripe for payment processing
- Twilio for SMS/OTP verification
- Google Gemini for AI features
- Cloudflare RealtimeKit for real-time communication

---

## Tech Stack

### Runtime & Framework

- **Node.js** 20+
- **Express.js** - Web framework
- **TypeScript** - Type safety

### Database

- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security

- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting

### Payments & Integrations

- **Stripe** - Payment processing
- **Cloudinary** - File storage
- **Nodemailer** - Email services

### AI & Real-time

- **Google Generative AI** - AI-powered features
- **Cloudflare RealtimeKit** - Real-time communication

### Development Tools

- **Nodemon** - Development server
- **Swagger UI** - API documentation
- **Zod** - Schema validation

### Deployment

- **Vercel** - Serverless deployment

---

## Project Structure

```
.
├── src/
│   ├── server.ts                 # Main application entry point
│   ├── config/
│   │   ├── database.config.ts    # MongoDB connection
│   │   ├── cloudinary.config.ts  # Cloudinary setup
│   │   ├── stripe.config.ts      # Stripe configuration
│   │   └── realtime.config.ts    # Real-time setup
│   ├── controllers/              # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── consultant.controller.ts
│   │   ├── payment.controller.ts
│   │   └── ...
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.ts               # Authentication middleware
│   │   ├── error.ts              # Error handling
│   │   ├── validateRequest.ts    # Request validation
│   │   └── upload.middleware.ts  # File upload handling
│   ├── models/                   # Mongoose models
│   │   ├── user.model.ts
│   │   ├── booking.model.ts
│   │   ├── availability.model.ts
│   │   └── ...
│   ├── routes/                   # API route definitions
│   │   ├── auth.route.ts
│   │   ├── booking.route.ts
│   │   └── ...
│   ├── schemas/                  # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── booking.schema.ts
│   │   └── ...
│   ├── services/                 # Business logic services
│   │   ├── auth.service.ts
│   │   ├── payment.service.ts
│   │   └── ...
│   ├── types/                    # TypeScript type definitions
│   │   └── express/index.d.ts
│   └── utils/                    # Utility functions
│       ├── email.ts              # Email utilities
│       ├── rateLimiters.ts       # Rate limiting config
│       └── ...
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

### Key Files Description

**server.ts**
Main application entry point that sets up Express server, middleware, database connection, and routes.

**config/database.config.ts**
Handles MongoDB connection using Mongoose with connection pooling and error handling.

**controllers/**
Contains route handlers for different modules (auth, booking, payments, etc.).

**models/**
Mongoose schemas and models for User, Booking, Availability, Transaction, etc.

**services/**
Business logic layer containing service classes for complex operations and external integrations.

**schemas/**
Zod schemas for request/response validation ensuring type safety at runtime.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DB_URI=mongodb://localhost:27017/bahir-chalo

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google AI
GOOGLE_API_KEY=your_google_api_key

# Cloudflare Realtime
REALTIME_API_KEY=your_realtime_api_key

# Application
NODE_ENV=dev
PORT=3000
```

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd bahir-chalo-be

npm install
```

---

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## Production Build

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## API Documentation

API documentation is available via Swagger UI. Uncomment the Swagger setup in `server.ts` to enable:

```typescript
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Access documentation at `http://localhost:3000/api-docs`

---

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the deployment configuration.

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## Key Features

### Authentication System

- User registration and login
- OTP verification via SMS
- Password reset functionality
- JWT-based session management
- Role-based access control (Student, Consultant, Admin)

### Booking Management

- Consultant availability scheduling
- Student booking system
- Booking cancellation and management
- Admin oversight of all bookings

### Payment Integration

- Stripe payment processing
- Secure webhook handling
- Transaction tracking
- Subscription/credit system foundation

### File Upload

- Cloudinary integration for file storage
- Authenticated file uploads
- Support for various file types

### AI Features

- Google Gemini integration
- Personalized study abroad guidance
- AI-powered recommendations

### Real-time Communication

- Cloudflare RealtimeKit integration
- Real-time notifications
- Live chat capabilities

---

## Database Models

### User Model

- Authentication details
- Profile information
- Role management (student/consultant/admin)

### Booking Model

- Session scheduling
- Payment tracking
- Status management

### Availability Model

- Consultant time slots
- Scheduling management

### Transaction Model

- Payment records
- Credit system tracking

---

## Security Features

- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Zod schemas for all requests
- **Authentication**: JWT tokens with refresh mechanism
- **Password Security**: bcrypt hashing
- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data protection

---

## Future Improvements

Potential enhancements for the platform include:

- Video calling integration (WebRTC/Zoom)
- Advanced AI chatbots for initial guidance
- Multi-language support
- Mobile app development
- Advanced analytics dashboard
- Referral system
- Review and rating system
- Advanced search and filtering
- Calendar integration
- Push notifications
- Comprehensive testing suite
- CI/CD pipeline
- Monitoring and logging

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

ISC License

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: NextJS, Tailwind CSS, shadcn/ui
- **Auth**: JWT
- **File Uploads**: Multer, Cloudinary
- **Planned**: Vonage (video), Nodemailer (email), OpenAI/Gemini (AI)
