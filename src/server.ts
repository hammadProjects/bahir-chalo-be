import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/database.config";
import { bootstrap } from "./utils/bootstrap";
import { error } from "./middlewares/error";
import cookieParser from "cookie-parser";
import { stripeWebhook } from "./controllers/payment.controller";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerPath = path.join(__dirname, "auth.swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

const app = express();
// app.use(morgan())

let isConnected = false;
if (!isConnected) {
  connectDB();
  isConnected = true;
}

if (process.env?.NODE_ENV === "dev") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });
}

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json()); // parses data coming from body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // no trailing / as cors matches exact same string
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  }),
);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Baahir Chalo BE!");
});
bootstrap(app);

app.use(error);

export default app;
