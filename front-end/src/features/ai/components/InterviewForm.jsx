import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../style/style.module.css";
import { useInterview } from "../hooks/useInterview";

const InterviewForm = () => {
  const navigate = useNavigate();
  const { loading, generateReport } = useInterview();

  const [jobDescription, setJobDescription]   = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume]                   = useState(null);
  const [error, setError]                     = useState(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const resumeInputRef = useRef(null);
  const submitLockRef = useRef(false);
  const isGenerating = loading || isSubmitting;

  const handleGenerateReport = async (event) => {
    event.preventDefault();
    if (submitLockRef.current || isGenerating) return;

    setError(null);

    const resumeFile = resumeInputRef.current?.files[0];
    if (!resumeFile) { setError("Please select a resume PDF file."); return; }

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const generatedReport = await generateReport({ selfDescription, jobDescription, resumeFile });
      if (!generatedReport?._id) {
        throw new Error("Report generated, but the server did not return the saved report.");
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to generate your report. Please try again.");
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isGenerating) {
    return (
      <div className={`${style.fullLoader} flex-column text-center p-4`} aria-busy="true" aria-live="polite">
        <div className={`card border-secondary shadow-lg p-5 ${style.loaderCard}`}>
          <div className={`spinner-border mb-4 mx-auto ${style.spinnerBrand}`} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold mb-2">Generating your interview report...</h4>
          <p className="text-secondary mb-4">
            Analyzing your resume and job description to prepare personalized questions,
            skill gaps, and a preparation plan...
          </p>
          <div className="progress mb-3">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-danger w-100"
              role="progressbar"
              aria-label="Report generation in progress"
            />
          </div>
          <small className="text-secondary">This may take 15-30 seconds. Please do not close this page.</small>
        </div>
      </div>
    );
  }

  /* Form */
  return (
    <div className={style.formPanel}>
      <div className={style.formHeader}>
        <span className={style.formIcon}>PDF</span>
        <div>
          <h2>Interview Preparation</h2>
          <p>Resume, candidate context, and role details</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="flex-shrink-0">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          {error}
        </div>
      )}

      <form className={style.reportForm} onSubmit={handleGenerateReport}>
        <label className={style.fieldGroup} htmlFor="resume">
          <span>Resume PDF</span>
          <input
            type="file" id="resume" accept=".pdf,application/pdf"
            ref={resumeInputRef}
            onChange={(e) => setResume(e.target.files[0] || null)}
            required disabled={isGenerating}
          />
          <small>{resume ? resume.name : "Only PDF files are allowed."}</small>
        </label>

        <label className={style.fieldGroup} htmlFor="selfDescription">
          <span>Self Description</span>
          <textarea
            id="selfDescription" rows="6"
            placeholder="Tell us about your experience, projects, strengths, and target role."
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            required disabled={isGenerating}
          />
        </label>

        <label className={style.fieldGroup} htmlFor="jobDescription">
          <span>Job Description</span>
          <textarea
            id="jobDescription" rows="8"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required disabled={isGenerating}
          />
        </label>

        <button className={style.submitButton} type="submit" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              Generating your interview report...
            </>
          ) : (
            "Generate Interview Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;
