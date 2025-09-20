import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "./error";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/types";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new CustomError("Invalid token", 401);

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY)
      throw new CustomError("JWT_SECRET_KEY is Missing!", 500);

    const { id } = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload; // (todo) - make this better
    const findUser = await User.findById(id);
    if (!findUser) throw new CustomError("User not found", 404);
    req.user = findUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser && loggedInUser.role != "admin")
      throw new CustomError("You are Not an Admin!", 401);

    next();
  } catch (error) {
    next(error);
  }
};

export const isConsultant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser && loggedInUser.role != "consultant")
      throw new CustomError("Only Consultant can access It!", 401);

    next();
  } catch (error) {
    next(error);
  }
};
