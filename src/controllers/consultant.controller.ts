import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";

export const getVerifiedConsultants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultants = await User.find({
      role: "consultant",
      "consultantProfile.status": "approved",
    })
      .select(SAFE_USER_SELECT)
      .lean();

    // (todo) - get by pagination
    res.status(200).json({
      success: true,
      message: "Consultants Fetched Successfuly",
      data: { consultants },
    });
  } catch (error) {
    next(error);
  }
};

export const searchConsultants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = (req.query?.search as string).trim();

    if (!search) {
      const consultants = await User.find({
        role: "consultant",
        "consultantProfile.status": "approved",
      });

      res.status(200).json({
        success: true,
        message: "consultants fetched successfully",
        data: { consultants },
      });
    }

    const consultants = await User.find({
      role: "consultant",
      "consultantProfile.status": "approved",
      $or: [
        { username: { $regex: search, $options: "i" } },
        { "consultantProfile.bio": { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "consultants fetched successfully",
      data: { consultants },
    });
  } catch (error) {
    next(error);
  }
};

export const validateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;

    if (loggedInUser?.role != "consultant")
      throw new CustomError("only consultants can view status", 401);

    res.json({
      success: true,
      message: "status fetched successfully",
      status: loggedInUser?.consultantProfile?.status,
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id).select(SAFE_USER_SELECT);
    if (!data) new CustomError("Invalid Id. Consultant does not exist", 404);

    return res.status(200).json({
      success: true,
      message: "Consultant Fetched Successfully",
      data: {
        consultant: data,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const createDailyAvailabilities = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const loggedInUser = req.user!;
//     if (loggedInUser.role != "consultant")
//       new CustomError("You are Not Authenticated", 401);

//     const { timings, gapTime } = req.body;
//     const APPOINTMENT_TIME = 50; // means 50% of hour - 30 minutes
//     /*
//       timings: [
//         monday: {startTime: 9, endTime: 11},
//         tuesday: {startTime: 9, endTime: 11},
//         wednesday: {startTime: 9, endTime: 11},
//         thursday: {startTime: 9, endTime: 11},
//         friday: null, // no free availability
//         saturday: null, // no free availability
//         sunday: null // no free availability
//       ]
//     */
//     timings.map(
//       (day: { startTime: number; endTime: number } | null, index: number) => {
//         if (day != null) {
//           console.log(
//             "create appointments for each monday but not right now we can create them as the day approaches"
//           );
//         }
//       }
//     );
//   } catch (error) {
//     next(error);
//   }
// };
