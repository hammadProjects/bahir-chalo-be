import { UserDocument } from "./types";

export const getOtpCode = () =>
  (Math.floor(Math.random() * 999999) + "").slice(0, 4);

export const SAFE_USER_SELECT =
  "-password -otpCode -otpExpiry -passwordResetId -passwordResetExpiry";

export const PLANS = {
  basic: {
    credits: 2,
    price: 0,
  },
  standard: {
    credits: 12,
    price: 100,
  },
  premium: {
    credits: 24,
    price: 100,
  },
};

export const generatePrompt = (country: string, loggedInUser: UserDocument) => `
You are an expert international education consultant helping Pakistani students plan higher studies abroad.

Use the following profile information to generate a short, precise, AI-generated study roadmap for the given country.

Profile:
- Degree: ${loggedInUser?.studentProfile?.recentDegree}
- CGPA: ${loggedInUser?.studentProfile?.grades}
- IELTS: ${loggedInUser?.studentProfile?.ieltsScore}
- Budget: ${loggedInUser?.studentProfile?.budget} lakhs PKR
- Desired Country: ${country}
- Current Country: ${loggedInUser?.studentProfile?.homeCountry}
- Degree Core Subjects: ${loggedInUser?.studentProfile?.courses}
---

### Questions to Answer:
1. Number of intakes in the desired country (mention major intake)
2. Best public universities within budget
3. Scholarship options (tuition fee / fully / partially funded)
4. When to start document attestation
5. Required attestation bodies (Bachelor, Intermediate, Matric). If DAE, mention separately. Skip DAE if Intermediate.
6. When to start applying to universities (especially if first-come-first-served)
7. When to take IELTS to match application timelines
8. Recommended courses similar to core subjects
9. Admission chances: competitive → moderate → safe (universities, scholarships, cities, courses)
10. Best cities by job market and budget
11. Bank/blocked account requirement and amount
12. When to apply for visa after offer letter
13. Does Pakistan have that country's embassy?
14. Can students work during study? Hours allowed?
15. Minimum wage and student job opportunities
16. Language barrier for students and jobs
17. Common odd jobs at start and field job opportunities later
18. Post-study work opportunities (PSW duration)
19. PR / Citizenship path (years required, whether study period counts)

---

### Output Rules:
- Return result **only as valid JSON**, no extra text, no explanation.
- Follow this schema strictly:

\`\`\`json
{
  "studyRoadmap": [
    {
      "name": "Section Title",
      "notes": [
        "short, factual point 1",
        "short, factual point 2"
      ]
    }
  ]
}
\`\`\`

⚠️ Strictly follow:
- Output must be JSON only (no text before or after)
- Each object has only two keys: "name" and "notes"
- Notes must be short, clear, non-repetitive strings (not long paragraphs)
- Keep tone brutally honest and realistic, not sugar-coated
- If something is not favorable for students, mention it clearly
- Avoid unnecessary explanations or positivity
- Don't skip any question; answer every point in the same schema
- Content must be short and easily readable for frontend users

Return only JSON. Nothing else.
`;
