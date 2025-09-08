import { Router } from "express";
import { uploadSingleFile } from "../controllers/upload.controller";
import uploadMiddleware from "../middlewares/upload.middleware";
import { isAuthenticated } from "../middlewares/auth";

const uploadRouter = Router();

const upload = uploadMiddleware("consultant-certificates");

uploadRouter.post(
  "/single",
  isAuthenticated,
  upload.single("file"),
  uploadSingleFile
);

export default uploadRouter;
