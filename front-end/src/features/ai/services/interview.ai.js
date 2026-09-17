import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { getAuthToken } from "../../../config/authToken";


const api = axios.create({
  baseURL: `${API_BASE_URL}/api/interview`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export async function generateInterviewReport({ selfDescription, jobDescription, resumeFile }) {
  const formData = new FormData();
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/", formData);

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
