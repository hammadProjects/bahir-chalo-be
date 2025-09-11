import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";
import User from "../models/user.model";
import { Types } from "mongoose";

export const setAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const { startTime, endTime } = req.body;

    if (startTime <= Date.now() || endTime <= Date.now())
      throw new CustomError("Availability Time is Invalid", 400);

    if (startTime >= endTime)
      throw new CustomError("Availability Time is Invalid", 400);

    const availabilities = await Availability.create({
      consultantId: _id,
      startTime,
      endTime,
    });
    res.status(201).json({
      success: true,
      message: "Availability Created",
      data: availabilities,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const findConsultant = await User.findById(id);
    if (!findConsultant || findConsultant.role != "consultant")
      throw new CustomError("Consultant Not Found", 404);

    const availabilities = await Availability.find({
      consultantId: id,
      startTime: { $gte: Date.now() }, // (todo) - documents greater than or equal to current date and time
    }).sort({
      startTime: 1, // (todo) - will sort according to startTime in ascending order
    });

    res.status(200).json({
      success: true,
      message: `Availabilities of ${findConsultant.username}.`,
      data: availabilities,
    });
  } catch (error) {
    next(error);
  }
};

// export const getAllAvailabilities = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const loggedInUser = req.user!;
//     const { consultantId } = req.params;

//     const availabiliies = await Availability.find({ consultantId });
//     if (loggedInUser.role == "consultant")
//       return res.json({
//         success: true,
//         message: "Availabilities Fetched Successfully",
//         data: {
//           availabiliies,
//         },
//       });

//     const filteredAvailabilities = availabiliies.filter(
//       (av) => av.isBooked == false
//     );

//     return res.json({
//       success: true,
//       message: "Availabilities Fetched Successfully",
//       data: {
//         filteredAvailabilities,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user!;
    const availability = await Availability.findById(id);

    if (!availability) throw new CustomError("Availability Not Found", 404);

    const loggedInUserId = new Types.ObjectId(loggedInUser._id as string);

    if (!availability?.consultantId.equals(loggedInUserId))
      // (todo) - look for equals method to verify if they are equal or not
      throw new CustomError(
        "You are Not Authorized to delete Availability",
        403
      );

    if (availability.isBooked)
      throw new CustomError("Booked Availability can't be deleted", 400);

    await availability.deleteOne();
    res.status(200).json({
      success: true,
      message: "Availability Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
