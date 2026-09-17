const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../module/InterviewReport.module");


async function generteInterviewReport(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required." });
    }

    // pdf-parse v2: call as a function with the buffer directly
    const resumeContent = await pdfParse(req.file.buffer);

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({ message: "selfDescription and jobDescription are required." });
    }

    const InterviewReportAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    if (!InterviewReportAi) {
      return res.status(500).json({ message: "AI failed to generate the report. Please try again." });
    }

    const interviewReport = await interviewReportModel.create({
      userId: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...InterviewReportAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({ message: "Internal server error. Please try again." });
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
