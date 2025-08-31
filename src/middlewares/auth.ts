import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "./error";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.headers;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "You are Not Authenticated" });

    // (todo) - verfiy token with jwt and get ID
    const id = "68b3386c896ec1841bb5677f"; // get from token
    const findUser = await User.findById(id);
    if (!findUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

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
