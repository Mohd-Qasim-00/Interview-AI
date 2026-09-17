# Interview AI Frontend

## 1. Project Title

Interview AI Frontend

## 2. Project Description

This is the React frontend for the Interview AI application. It provides the user interface for authentication, interview report generation, and viewing saved AI-generated interview reports.

## 3. Features

- User registration and login forms
- Protected application routes
- Authentication loading state and redirect to login
- Resume PDF selection
- Self-description and job-description form fields
- Interview report generation workflow
- Loading and error states during report generation
- Dashboard for viewing saved reports
- Report history with report selection
- Match score and skill-gap display
- Technical and behavioural question sections
- Expandable question details with intentions and model answers
- Preparation plan displayed by day
- Logout action

## 4. Tech Stack

- React 19
- Vite
- React Router
- Axios
- Bootstrap 5
- CSS Modules
- ESLint

## 5. Requirements / Prerequisites

- Node.js 18 or newer
- npm
- The application API available at `http://localhost:3000`

## 6. Environment Variables

The frontend currently does not use a `.env` file. API URLs are configured directly in the service files:

- Authentication API: `http://localhost:3000/api/auth`
- Interview API: `http://localhost:3000/api/interview`

## 7. Installation & Setup

Open a terminal in the `front-end` directory and install the dependencies:

```bash
npm install
```

## 8. Running the Project

Start the Vite development server:

```bash
npm run dev
```

The frontend is normally available at:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## 9. Application Routes and User Flow

### Login

- Route: `/login`
- Displays the login form.
- Sends the user's email and password to the authentication service.

### Register

- Route: `/register`
- Displays the registration form.
- Sends the user's username, email, and password to the authentication service.

### Home Dashboard

- Route: `/`
- Protected route.
- Loads the user's interview reports.
- Shows the latest report by default.
- Allows the user to select a report from the report history.
- Shows an empty state when no report exists.

### Generate Report

- Route: `/generate-report`
- Protected route.
- Accepts a resume PDF, self-description, and job description.
- Displays a loading state while the report is being generated.
- Redirects to the dashboard after a successful report generation.

## 10. How It Works

1. The user opens the login or registration page.
2. After authentication, protected routes become available.
3. The dashboard loads the user's saved reports.
4. The user opens the report generator and selects a resume PDF.
5. The user enters a self-description and job description.
6. The frontend sends the form data with credentials enabled.
7. After a successful response, the frontend returns the user to the dashboard.
8. The dashboard displays the report score, skill gaps, questions, answers, and preparation plan.

## 11. Project Highlights / Security

- Protected routes redirect unauthenticated users to `/login`.
- Axios requests use `withCredentials: true` for authentication cookies.
- Authentication and interview state are managed with React context providers.
- Report generation prevents duplicate submissions while a request is active.
- Loading and error states are shown during authentication, report loading, and report generation.
- Resume input accepts PDF files only in the report form.

## 12. Future Improvements 

- Move API URLs into Vite environment variables.
- Add a production API URL configuration.
- Add stronger client-side form validation and file-size validation.
- Add pagination or filtering for report history.
- Add a dedicated report details route.
- Add automated component and route tests.

## 13. Author 

MOHD QASIM
