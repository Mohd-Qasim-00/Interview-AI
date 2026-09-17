const interviewReportModel = require("../module/InterviewReport.module");

async function extractPdfText(buffer) {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}

async function generteInterviewReport(req, res) {
  try {
    const generateInterviewReport = require("../services/ai.service");

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required." });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({ message: "selfDescription and jobDescription are required." });
    }

    let resumeText;

    try {
      resumeText = await extractPdfText(req.file.buffer);
    } catch (error) {
      console.error("PDF text extraction failed:", error); // full error object, not just .message
      return res.status(400).json({
        message: "The uploaded PDF could not be processed. Please upload a valid PDF with selectable text.",
        details: error.message,
      });
    }

    if (!resumeText?.trim()) {
      return res.status(400).json({
        message: "This PDF has no selectable text. Please upload a text-based resume PDF, not a scanned image PDF.",
      });
    }

    let InterviewReportAi;

    try {
      InterviewReportAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
      });
    } catch (error) {
      console.error("AI failed to generate interview report:", error);
      return res.status(502).json({
        message: "AI service failed to generate the report. Please check GOOGLE_API_KEY/GEMINI_MODEL in Vercel and try again.",
      });
    }

    const interviewReport = await interviewReportModel.create({
      userId: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...InterviewReportAi,
    });

    res.status(200).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({
      message: "Internal server error. Please try again.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

async function getMyLatestReport(req, res) {
  try {
    const report = await interviewReportModel
      .findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({ message: "No report found." });
    }

    res.status(200).json({
      message: "Latest report fetched successfully",
      interviewReport: report,
    });
  } catch (error) {
    console.error("Error fetching latest report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getLatestReport(req, res) {
  const { interviewId } = req.params;

  try {
    const report = await interviewReportModel.findOne({
      _id: interviewId,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function AllInterviewReports(req, res) {
  try {
    const reports = await interviewReportModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -__v");

    res.status(200).json({
      message: "All interview reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { generteInterviewReport, getLatestReport, getMyLatestReport, AllInterviewReports };