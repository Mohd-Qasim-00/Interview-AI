const deployedApiUrl = "https://back-end-nine-plum.vercel.app";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? deployedApiUrl : "http://localhost:3000");
