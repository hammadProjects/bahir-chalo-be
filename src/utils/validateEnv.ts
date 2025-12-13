export const validateEnv = () => {
  const requiredEnv = [
    // Server
    "PORT",
    "DB_URI",

    // JWT
    "JWT_SECRET_KEY",

    // Cloudinary
    "CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",

    // App
    "APPOINTMENT_COST",

    // Email
    "APP_EMAIL",
    "APP_PASSWORD",

    // Gemini
    "GEMINI_API_KEY",

    // Stripe
    "STRIPE_SECRET",
    "PUBLIC_KEY",
    "PREMIUM_PRODUCT_ID",
    "STANDARD_PRODUCT_ID",

    // Cloudflare Realtime
    "REALTIME_ORG_ID",
    "REALTIME_API_KEY",
  ];

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
};
