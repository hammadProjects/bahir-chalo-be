import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "../utils/utils";
import Roadmap from "../models/roadmap.model";
const genAI = new GoogleGenerativeAI(process.env?.GEMINI_API_KEY!);

export const generateRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { country } = req.params;

    if (loggedInUser?.role != "student")
      throw new CustomError("Only Students can generate Roadmaps", 401);

    if (!country) throw new CustomError("Country Is Required", 400);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      generatePrompt(country, loggedInUser)
    );
    const text = result.response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const cleanText = text.slice(jsonStart, jsonEnd);

    const studyRoadmap = JSON.parse(cleanText)?.studyRoadmap || [];

    // store roadmap in DB
    await Roadmap.create({
      title: `Study Roadmap - ${country}`,
      studentId: loggedInUser?._id,
      roadmapData: studyRoadmap,
    });

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    if (loggedInUser?.role != "student")
      throw new CustomError("You are not authenticated", 401);

    const roadmaps = await Roadmap.find({
      studentId: loggedInUser?._id,
    })
      .select("-roadmapData")
      .sort({ createdAt: -1 }); // most recent will come at front

    res.status(200).json({
      success: true,
      message: "Roadmaps fetched successfully",
      data: { roadmaps },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoadmapById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { roadmapId } = req.params;

    if (loggedInUser?.role != "student")
      throw new CustomError("You can not access the roadmap", 401);

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) throw new CustomError("Roadmap does not exists", 404);
    res.status(200).json({
      success: true,
      message: "Roadmap fetched successfully",
      data: { roadmapData: roadmap },
    });
  } catch (error) {
    next(error);
  }
};
