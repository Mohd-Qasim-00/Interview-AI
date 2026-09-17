import axios from "axios"
import { API_BASE_URL } from "../../../config/api"
import { clearAuthToken, getAuthToken, setAuthToken } from "../../../config/authToken"

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function register({username, email, password}) {

try {
    const response = await api.post("/register", {
      username,
      email,
      password
    })
    setAuthToken(response.data.token)
    return response.data
  } catch (error) {
    throw error
  }

}

export async function login({email, password}) {
  try {
    const response = await api.post("/login", {
      email,
      password
    })
    setAuthToken(response.data.token)
    return response.data
  } catch (error) {
    throw error
  }

}


export async function logout() {
  try {
    const response = await api.get("/logout")
    clearAuthToken()
    return response.data
  } catch (error) {
    throw error
  }

}


export async function getMe() {
  try {
    const response = await api.get("/get-me")
    return response.data
  } catch (error) {
    throw error
  }

}
