import { GoogleGenerativeAI } from "@google/generative-ai";
import { CustomError } from "../middlewares/error";
import Roadmap from "../models/roadmap.model";
import * as studentSchema from "../schemas/student.schema";
import { UserDocument } from "../utils/types";
import { generatePrompt } from "../utils/utils";

export const generateRoadmap = async (
  user: UserDocument,
  { country }: studentSchema.generateRoadmapParams
) => {
  const genAI = new GoogleGenerativeAI(process.env?.GEMINI_API_KEY!);
  const findPrevRoadmap = await Roadmap.findOne({
    studentId: user?._id,
    country,
  });

  if (findPrevRoadmap) return { studyRoadmap: findPrevRoadmap, country };

  if (user?.role != "student")
    throw new CustomError("Only Students can generate Roadmaps", 401);

  if (!country) throw new CustomError("Country Is Required", 400);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(generatePrompt(country, user));
  const text = result.response.text();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  const cleanText = text.slice(jsonStart, jsonEnd);

  const studyRoadmap = JSON.parse(cleanText)?.studyRoadmap || [];

  // store roadmap in DB
  await Roadmap.create({
    title: `Study Roadmap - ${country}`,
    studentId: user?._id,
    roadmapData: studyRoadmap,
    country,
  });

  return { studyRoadmap, country };
};

export const getRoadmapById = async (
  user: UserDocument,
  { roadmapId }: studentSchema.getRoadmapByIdParams
) => {
  if (user?.role != "student")
    throw new CustomError("You can not access the roadmap", 401);

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new CustomError("Roadmap does not exists", 404);
  return { roadmap };
};

export const getAllRoadmaps = async (
  user: UserDocument,
  { page, limit, search }: studentSchema.getAllRoadmapsQuery
) => {
  if (user?.role != "student")
    throw new CustomError("You are not authenticated", 401);

  const skip = limit * (page - 1);

  const roadmaps = await Roadmap.find({
    studentId: user?._id,
    $or: [
      { title: { $regex: search, $option: "i" } },
      { country: { $regex: search, $option: "i" } },
    ],
  })
    .select("-roadmapData")
    .sort({ createdAt: -1 }) // most recent will come at front
    .skip(skip)
    .limit(limit);

  const totalRoadmaps = await Roadmap.countDocuments({
    studentId: user?._id,
    $or: [
      { title: { $regex: search, $option: "i" } },
      { country: { $regex: search, $option: "i" } },
    ],
  });

  return { roadmaps, totalRoadmaps, page, limit };
};
