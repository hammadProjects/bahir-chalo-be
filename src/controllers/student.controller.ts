import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "../utils/utils";
const genAI = new GoogleGenerativeAI(process.env?.GEMINI_API_KEY!);

export const studentOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    if (loggedInUser.role != "unassigned")
      throw new CustomError("Bad Request", 400);

    loggedInUser.role = "student";
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "You are successfully Registered as Student",
    });
  } catch (error) {
    next(error);
  }
};

export const generateRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.user!;
    const { country } = req.params;

    if (role != "student")
      throw new CustomError("Only Students can generate Roadmaps", 401);

    if (!country) throw new CustomError("Country Is Required", 400);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(generatePrompt(country));
    const text = result.response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const cleanText = text.slice(jsonStart, jsonEnd);

    const studyRoadmap = JSON.parse(cleanText)?.studyRoadmap || [];

    res.status(200).json({
      success: true,
      message: `Roadmap for ${country} generated Successfully`,
      data: studyRoadmap,
      // data: [
      //   {
      //     name: "Intakes & Application",
      //     notes: [
      //       "Major intake: September/October (Fall).",
      //       "Minor intake: January/February (Spring).",
      //       "Applications open: Typically November-March for Fall intake.",
      //       "Apply early, especially for popular programs as seats can be limited.",
      //     ],
      //   },
      //   {
      //     name: "Universities & Budget",
      //     notes: [
      //       "Budget (50 lakhs PKR ~ €16,000-€17,000) is tight for combined tuition and living costs for one year.",
      //       "Public universities like University of Lisbon, University of Porto, NOVA University of Lisbon, University of Coimbra, University of Minho offer relevant programs.",
      //       "Tuition fees for international Master's in public universities range from €1,500-€7,000/year.",
      //       "Living expenses in Lisbon/Porto: €700-€1000/month. Other cities like Coimbra/Braga: €500-€800/month.",
      //       "Prioritize programs with lower tuition fees to manage overall costs.",
      //     ],
      //   },
      //   {
      //     name: "Scholarship Options",
      //     notes: [
      //       "Limited fully funded scholarships for Master's for international students.",
      //       "Some universities offer merit-based tuition fee waivers (partial) for high CGPA students.",
      //       "Erasmus Mundus scholarships are highly competitive but fully funded (if program offered in Portugal).",
      //     ],
      //   },
      //   {
      //     name: "Document Attestation",
      //     notes: [
      //       "Start attestation immediately after receiving final degree and transcripts.",
      //       "Bachelor's Degree & Transcripts: HEC (Higher Education Commission).",
      //       "Intermediate & Matric: IBCC (Inter Board Committee of Chairmen).",
      //       "All documents: Ministry of Foreign Affairs (MOFA) after HEC/IBCC.",
      //       "Portuguese Embassy/Consulate legalization often required for visa and university enrollment.",
      //     ],
      //   },
      //   {
      //     name: "IELTS & English Proficiency",
      //     notes: [
      //       "Take IELTS by January-February for Fall intake applications.",
      //       "Expected score of 6.5 is generally sufficient for Master's programs.",
      //       "Some universities may issue conditional offers, allowing IELTS submission later.",
      //     ],
      //   },
      //   {
      //     name: "Recommended Courses",
      //     notes: [
      //       "Master's in Computer Science, Informatics Engineering, Software Engineering, Data Science, Artificial Intelligence.",
      //       "Look for specializations in Machine Learning, Deep Learning, Web Development, aligning with your core subjects.",
      //     ],
      //   },
      //   {
      //     name: "Admission Chances",
      //     notes: [
      //       "Admission to top public universities (Lisbon, Porto): Moderate to Competitive for self-funded.",
      //       "Admission to other public universities (Coimbra, Minho): Moderate.",
      //       "Scholarships (beyond partial tuition waivers): Highly Competitive.",
      //       "Cities: Lisbon/Porto are competitive for admissions and jobs; Coimbra/Braga less so.",
      //       "Courses: General CS and AI/ML are competitive due to popularity.",
      //     ],
      //   },
      //   {
      //     name: "Best Cities (Job Market & Budget)",
      //     notes: [
      //       "Best job market: Lisbon and Porto (major tech hubs).",
      //       "Best budget/lower cost of living: Coimbra and Braga.",
      //       "Expect a trade-off between job opportunities and cost of living.",
      //     ],
      //   },
      //   {
      //     name: "Proof of Funds for Visa",
      //     notes: [
      //       "No 'blocked account' like Germany, but proof of funds for living expenses is required.",
      //       "Typically around €8,000 - €9,000 for the first year of living expenses.",
      //       "Your total budget of €16,000-€17,000 will be very tight covering both tuition and living for the first year.",
      //     ],
      //   },
      //   {
      //     name: "Visa Application",
      //     notes: [
      //       "Apply for visa immediately after receiving unconditional offer letter and enrollment confirmation.",
      //       "Visa processing can take 1-3 months; apply as early as possible.",
      //       "Embassy of Portugal is in Islamabad, Pakistan.",
      //     ],
      //   },
      //   {
      //     name: "Work During Study",
      //     notes: [
      //       "Allowed to work part-time (up to 20 hours/week) during semesters.",
      //       "Allowed to work full-time (up to 40 hours/week) during holidays.",
      //     ],
      //   },
      //   {
      //     name: "Minimum Wage & Job Opportunities",
      //     notes: [
      //       "Minimum wage (2024): €820/month.",
      //       "Common odd jobs: Food delivery, retail, hospitality, call centers.",
      //       "Field-related jobs (junior level): Limited without Portuguese proficiency at entry level.",
      //     ],
      //   },
      //   {
      //     name: "Language Barrier",
      //     notes: [
      //       "Many Master's programs are in English.",
      //       "Significant language barrier for daily life and most non-tech jobs without Portuguese.",
      //       "Portuguese proficiency is highly beneficial for social integration and crucial for better job prospects, even in tech.",
      //     ],
      //   },
      //   {
      //     name: "Post-Study Work (PSW)",
      //     notes: [
      //       "Graduates can apply for a 12-month job search visa extension (requires proof of funds).",
      //       "Upon securing a job, students can switch to a work visa/residence permit.",
      //     ],
      //   },
      //   {
      //     name: "PR / Citizenship Path",
      //     notes: [
      //       "Permanent Residency (PR): After 5 years of legal residence. Study period counts.",
      //       "Citizenship: After 5 years of legal residence, plus Portuguese language and culture knowledge. Study period counts.",
      //     ],
      //   },
      // ],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
