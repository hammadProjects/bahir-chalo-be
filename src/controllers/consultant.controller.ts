import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";
import Availability from "../models/availability.model";

export const consultantOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bio, certificateUrl, experience } = req.body;
    if (experience <= 0)
      throw new CustomError("Experience must be atleast 1 Year", 400);
    // (todo) - get the jwt from the request as headers. Make an auth middleware that stores the logged in user in the headers

    const loggedInUser = req.user!; // (!) - we are sure that loggedInUser will be available

    if (loggedInUser.role != "unassigned")
      throw new CustomError(
        `You are already been assigned as ${loggedInUser.role}`,
        400
      );

    loggedInUser.consultantProfile = {
      bio,
      certificateUrl,
      experience,
      status: "pending",
      // will be verified by admin - just to ensure ts is error free (as it is required to enter status)
    };

    loggedInUser.role = "consultant";
    await loggedInUser.save();
    res
      .status(200)
      .json({ success: true, message: "Your Profile has been updated!" });
  } catch (error) {
    next(error);
  }
};

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

export const getConsultantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id).select(SAFE_USER_SELECT);
    if (!data) new CustomError("Invalid Id. Consultant does not exist", 404);

    // const availabilities = await Availability.find({
    //   consultantId: data?._id,
    // }).sort({ startTime: 1 });

    // const transformedAvailabilities = availabilities.reduce(
    //   (acc, availability) => {
    //     const dateKey = `${availability.startTime.getDate()} (${availability.startTime.toLocaleDateString(
    //       "en-US",
    //       {
    //         weekday: "short",
    //       }
    //     )})`;

    //     if (!acc[dateKey]) acc[dateKey] = [];
    //     acc[dateKey].push(availability);
    //     return acc;
    //   },
    //   {} as Record<string, typeof availabilities>
    // );

    return res.status(200).json({
      success: true,
      message: "Consultant Fetched Successfully",
      data: {
        consultant: data,
        // availabilities: transformedAvailabilities,
        // totalAvailabilities: availabilities.length,
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
