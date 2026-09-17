import {
  generateInterviewReport,
  getMyLatestReport,
  getLatestReport,
  getAllInterviewReports,
} from "../services/interview.ai.js";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

const sortReportsByCreatedAt = (reports = []) =>
  [...reports].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) throw new Error("useInterview must be used within an InterviewProvider");

  const {
    interviewReport, setInterviewReport,
    loading, setLoading,
    report, setReport,
  } = context;

  const generateReport = async ({ selfDescription, jobDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({ selfDescription, jobDescription, resumeFile });
      setInterviewReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestReport = async () => {
    try {
      const response = await getMyLatestReport();
      setInterviewReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      if (error?.response?.status === 404) {
        setInterviewReport(null);
        return null;
      }
      console.error("Error fetching latest report:", error);
      throw error;
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getLatestReport(interviewId);
      setInterviewReport(response.report);
      return response.report;
    } catch (error) {
      console.error("Error fetching report by id:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    try {
      const response = await getAllInterviewReports();
      const reports = sortReportsByCreatedAt(response.reports ?? []);
      setReport(reports);
      return reports;
    } catch (error) {
      console.error("Error fetching all reports:", error);
      setReport([]);
      throw error;
    }
  };

  return {
    interviewReport, setInterviewReport,
    loading, setLoading,
    report, setReport,
    generateReport,
    fetchLatestReport,
    getReportById,
    getAllReports,
  };
};
