import { createBrowserRouter } from "react-router-dom"

import Home from "./features/ai/pages/Home"

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"

import GenerateReport from "./features/ai/pages/GenerateReport"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Protected><Home></Home></Protected>
  }
  ,
  {
    path: "/generate-report",
    element: <Protected><GenerateReport /></Protected>
  }
])