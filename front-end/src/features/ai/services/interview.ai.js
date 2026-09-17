import axios from "axios";
import { API_BASE_URL } from "../../../config/api";


const api = axios.create({
  baseURL: `${API_BASE_URL}/api/interview`,
  withCredentials: true,
});


export async function generateInterviewReport({ selfDescription, jobDescription, resumeFile }) {
  const formData = new FormData();
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}


export async function getMyLatestReport() {
  const response = await api.get("/latest");
  return response.data;
}


export async function getLatestReport(interviewId) {
  const response = await api.get(`/report/${interviewId}`);
  return response.data;
}


export async function getAllInterviewReports() {
  const response = await api.get("/");
  return response.data;
}
