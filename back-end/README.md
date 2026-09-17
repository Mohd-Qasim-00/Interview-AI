
## 1. Project Title

Interview AI Backend

## 2. Project Description

This is the Express.js and MongoDB backend for the Interview AI application. It provides user authentication and generates personalized interview preparation reports from a candidate's resume, self-description, and target job description.

## 3. Features

- User registration, login, logout, and current-user lookup
- JWT authentication using cookies
- PDF resume upload and text extraction
- AI-generated interview preparation reports using Google GenAI
- MongoDB storage for users and interview reports
- Protected, user-specific interview report endpoints

## 4. Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Google GenAI
- JWT and bcryptjs for authentication
- Multer for in-memory file uploads
- pdf-parse for PDF text extraction
- Zod for AI response validation

## 5. Requirements / Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or available through a cloud connection
- Google GenAI API key

## 6. Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/interview-ai
GOOGLE_API_KEY=your_google_genai_api_key
jwtSecret=your_jwt_secret
```

Keep the `.env` file private and do not commit it to version control.

## 7. Installation & Setup

Open a terminal in the `back-end` directory and install the dependencies:

```bash
npm install
```

Make sure MongoDB is running, then create the `.env` file described above.

## 8. Running the Project

Start the backend:

```bash
npm start
```

For development with automatic server restarts:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

The frontend is expected to run at `http://localhost:5173`.

## 9. API Documentation

All API routes are prefixed with `/api`.

### Authentication Endpoints

1. Register a user
   - Method: `POST`
   - Endpoint: `/api/auth/register`
   - Authentication: Not required
   - Description: Creates a new user account.

   Request body:

   ```json
   {
     "username": "candidate",
     "email": "candidate@example.com",
     "password": "password123"
   }
   ```

2. Log in
   - Method: `POST`
   - Endpoint: `/api/auth/login`
   - Authentication: Not required
   - Description: Authenticates the user and sets the JWT cookie.

   Request body:

   ```json
   {
     "email": "candidate@example.com",
     "password": "password123"
   }
   ```

3. Log out
   - Method: `GET`
   - Endpoint: `/api/auth/logout`
   - Authentication: Not required
   - Description: Logs out the user and clears the authentication cookie.

4. Get the current user
   - Method: `GET`
   - Endpoint: `/api/auth/get-me`
   - Authentication: Required
   - Description: Returns the authenticated user's information.

### Interview Report Endpoints

These endpoints require the authentication cookie created during registration or login.

1. Generate an interview report
   - Method: `POST`
   - Endpoint: `/api/interview`
   - Authentication: Required
   - Content type: `multipart/form-data`
   - Description: Generates and saves an interview preparation report.

   Required fields:
   - `resume`: PDF file containing the candidate's resume
   - `selfDescription`: Candidate's self-description
   - `jobDescription`: Target job description

2. Get all interview reports
   - Method: `GET`
   - Endpoint: `/api/interview`
   - Authentication: Required
   - Description: Retrieves all reports belonging to the current user.

3. Get the latest interview report
   - Method: `GET`
   - Endpoint: `/api/interview/latest`
   - Authentication: Required
   - Description: Retrieves the current user's latest report.

4. Get an interview report by ID
   - Method: `GET`
   - Endpoint: `/api/interview/report/:interviewId`
   - Authentication: Required
   - Description: Retrieves a specific report by ID.

Example request for generating a report:

```bash
curl -X POST http://localhost:3000/api/interview \
  -b cookies.txt \
  -F "resume=@resume.pdf" \
  -F "selfDescription=Frontend developer with three years of experience" \
  -F "jobDescription=Looking for a React developer with Node.js experience"
```

## 10. How It Works

1. The user registers or logs in.
2. The server authenticates the user using a JWT stored in a cookie.
3. The user uploads a PDF resume with a self-description and target job description.
4. The backend extracts text from the resume in memory.
5. The resume content and user-provided information are sent to Google GenAI.
6. The AI generates a personalized interview preparation report.
7. The report is stored in MongoDB and associated with the authenticated user.
8. The user can retrieve their previous, latest, or individual reports.

## 11. Project Highlights / Security

- Passwords are hashed with bcryptjs before they are stored.
- Protected routes verify the JWT before accessing user data.
- Users can access only their own interview reports.
- Resume files are processed in memory and are not permanently saved to disk.
- CORS allows credentialed requests from `http://localhost:5173`.
- Environment files are excluded from version control.

## 12. Future Improvements

- Add refresh tokens and stronger cookie security settings.
- Add request validation and centralized error handling.
- Add automated tests for authentication and interview report routes.
- Add pagination for interview report history.
- Add rate limiting for authentication and AI-generation endpoints.

## 13. Author 

MOHD QASIM