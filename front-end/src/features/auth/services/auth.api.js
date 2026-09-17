import axios from "axios"

const api = axios.create({
  baseURL: "back-end-nine-plum.vercel.app/api/auth",
  withCredentials: true,
})

export async function register({username, email, password}) {

try {
    const response = await api.post("/register", {
      username,
      email,
      password
    })
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
    return response.data
  } catch (error) {
    throw error
  }

}


export async function logout() {
  try {
    const response = await api.get("/logout")
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