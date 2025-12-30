import { NextFunction, Request, Response } from "express";
import * as studentService from "../services/student.service";
import * as studentSchema from "../schemas/student.schema";
import { CustomError } from "../middlewares/error";

export const generateRoadmap = async (
  req: Request<studentSchema.generateRoadmapParams, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = studentSchema.generateRoadmapParamsSchema.safeParse(
      req.params
    );
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { studyRoadmap, country } = await studentService.generateRoadmap(
      req.user!,
      result.data
    );

    res.status(200).json({
      success: true,
      message: `Roadmap for ${country} generated Successfully`,
      data: studyRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRoadmaps = async (
  req: Request<{}, studentSchema.getAllRoadmapsQuery, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = studentSchema.getAllRoadmapsQuerySchema.safeParse(req.query);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { roadmaps, totalRoadmaps, limit, page } =
      await studentService.getAllRoadmaps(req.user!, result.data);

    res.status(200).json({
      success: true,
      message: "Roadmaps fetched successfully",
      data: {
        pagination: roadmaps,
        totalPages: Math.ceil(totalRoadmaps / limit),
        hasNext: page < Math.ceil(totalRoadmaps / limit),
        hasPrev: page > 1,
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoadmapById = async (
  req: Request<studentSchema.getRoadmapByIdParams, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = studentSchema.getRoadmapByIdParamsSchema.safeParse(
      req.params
    );
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { roadmap } = await studentService.getRoadmapById(
      req.user!,
      result?.data
    );

    res.status(200).json({
      success: true,
      message: "Roadmap fetched successfully",
      data: { roadmapData: roadmap },
    });
  } catch (error) {
    next(error);
  }
};
