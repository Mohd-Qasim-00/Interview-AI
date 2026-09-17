const { GoogleGenAI, Type } = require("@google/genai");
const z = require("zod");

let ai;

function getAiClient() {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is not defined in the environment variables");
    }

    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY
        });
    }

    return ai;
}

// ============================================================
// ZOD VALIDATION SCHEMA
// ============================================================

const interviewReportZodSchema = z.object({

    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
            intention: z.string()
        })
    ),

    behaviouralQuestions: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
            intention: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlans: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            task: z.array(z.string())
        })
    ),

   title: z.string().describe("Title of the report")

});


// ============================================================
// GEMINI STRUCTURED OUTPUT SCHEMA
// ============================================================

const interviewReportGeminiSchema = {

    type: Type.OBJECT,

    properties: {

        matchScore: {
            type: Type.NUMBER
        },

        technicalQuestions: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    question: {
                        type: Type.STRING
                    },

                    answer: {
                        type: Type.STRING
                    },

                    intention: {
                        type: Type.STRING
                    }
                },

                required: [
                    "question",
                    "answer",
                    "intention"
                ]
            }
        },

        behaviouralQuestions: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    question: {
                        type: Type.STRING
                    },

                    answer: {
                        type: Type.STRING
                    },

                    intention: {
                        type: Type.STRING
                    }
                },

                required: [
                    "question",
                    "answer",
                    "intention"
                ]
            }
        },

        skillGaps: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    skill: {
                        type: Type.STRING
                    },

                    severity: {
                        type: Type.STRING,
                        enum: [
                            "low",
                            "medium",
                            "high"
                        ]
                    }
                },

                required: [
                    "skill",
                    "severity"
                ]
            }
        },

        preparationPlans: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    day: {
                        type: Type.NUMBER
                    },

                    focus: {
                        type: Type.STRING
                    },

                    task: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                },

                required: [
                    "day",
                    "focus",
                    "task"
                ]
            }
        },
        title: {
            type: Type.STRING,
            description: "Title of the report"
        }


    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behaviouralQuestions",
        "skillGaps",
        "preparationPlans",
        "title"
    ]
};


// ============================================================
// GENERATE INTERVIEW REPORT
// ============================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `

You are an expert technical interviewer and recruitment analyst.

Analyze the following candidate information.

RESUME:
${resume || "Not provided"}

SELF DESCRIPTION:
${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription || "Not provided"}


Generate an interview preparation report.

Requirements:

1. matchScore:
   Give a score from 0 to 100 representing the match between
   the candidate and the job description.

2. technicalQuestions:
   Generate relevant technical interview questions.
   Every question must contain:
   - question
   - answer
   - intention

3. behaviouralQuestions:
   Generate relevant behavioural interview questions.
   Every question must contain:
   - question
   - answer
   - intention

4. skillGaps:
   Identify missing or weak skills.
   Every skill gap must contain:
   - skill
   - severity

   severity must be:
   low, medium, or high

5. preparationPlans:
   Create a preparation plan.
   Every plan must contain:
   - day
   - focus
   - task

   task must be an array of strings.

6. title:
   Generate a title for the report.

IMPORTANT:
Return only the structured JSON report.
Do not return markdown.
Do not return explanations.
Do not return any text outside the JSON.
`;

    try {

        // ====================================================
        // GEMINI REQUEST
        // ====================================================

        const response = await getAiClient().models.generateContent({

            model: "gemini-3.5-flash-lite",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseSchema: interviewReportGeminiSchema
            }
        });


       

       const parsedReport = JSON.parse(response.text);

        // Validate the object using Zod
        const report =
            interviewReportZodSchema.parse(parsedReport);

        // Return only final report
        return report;
       


        

    } catch (error) {

        console.error(
            "Interview Report Error:",
            error.message
        );

        return null;
    }
}



module.exports = generateInterviewReport;
