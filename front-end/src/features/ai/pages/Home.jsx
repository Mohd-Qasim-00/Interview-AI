import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../style/style.module.css";
import Nava from "../components/Nav";
import AiReportCard from "../components/Dashboard";
import { AuthContext } from "../../auth/auth.context";
import { getAllInterviewReports, getLatestReport } from "../services/interview.ai.js";

const getReportTime = (report) => new Date(report?.createdAt || 0).getTime();

const getLatestCreatedReport = (reports = []) =>
  reports.reduce((latest, current) => {
    if (!latest) return current;
    return getReportTime(current) > getReportTime(latest) ? current : latest;
  }, null);

const loadFullReport = async (reportId, fallbackReport = null) => {
  if (!reportId) return fallbackReport;

  const response = await getLatestReport(reportId);
  return response.report || fallbackReport;
};

export default function Home() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);
      setError("");

      try {
        if (!user) {
          setReports([]);
          setSelectedReport(null);
          return;
        }

        const response = await getAllInterviewReports();
        if (!isMounted) return;

        const sortedReports = [...(response.reports ?? [])].sort(
          (a, b) => getReportTime(b) - getReportTime(a)
        );

        setReports(sortedReports);

        if (!sortedReports.length) {
          setSelectedReport(null);
          return;
        }

        const latestReport = getLatestCreatedReport(sortedReports);
        let fullLatestReport = latestReport;

        try {
          fullLatestReport = await loadFullReport(latestReport?._id, latestReport);
        } catch (error) {
          console.error("Unable to load full latest report:", error);
        }

        if (!isMounted) return;

        setSelectedReport(fullLatestReport);
      } catch (error) {
        if (!isMounted) return;
        setReports([]);
        setSelectedReport(null);
        setError(error?.response?.data?.message || "Unable to load your reports. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const handleSelectReport = async (reportId) => {
    if (String(selectedReport?._id) === String(reportId)) return;

    const report = reports.find((item) => String(item._id) === String(reportId));
    if (!report) return;

    setLoading(true);
    setError("");

    try {
      const fullReport = await loadFullReport(reportId, report);
      setSelectedReport(fullReport);
    } catch (error) {
      console.error("Unable to load selected report:", error);
      setSelectedReport(report);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = authLoading || loading;

  if (isLoading) {
    return (
      <main className={style.home}>
        <Nava />
        <div className={`d-flex align-items-center justify-content-center ${style.homeLoader}`}>
          <div className="text-center">
            <div className={`spinner-border mb-3 ${style.spinnerBrand}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary mb-0">Loading your reports...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={style.home}>
        <Nava />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-danger shadow text-center p-5">
                <h4 className="fw-bold mb-2">Could Not Load Reports</h4>
                <p className="text-secondary mb-4">{error}</p>
                <button
                  type="button"
                  className={`btn px-4 py-2 ${style.btnBrand}`}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!selectedReport) {
    return (
      <main className={style.home}>
        <Nava />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-secondary shadow text-center p-5">
                <div className="mb-4">
                  <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="text-danger" viewBox="0 0 16 16">
                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="fw-bold mb-2">No Interview Report Yet</h4>
                <p className="text-secondary mb-4">
                  Generate your first personalized interview report by uploading
                  your resume and adding the job description.
                </p>
                <Link to="/generate-report" className={`btn px-4 py-2 ${style.btnBrand}`}>
                  Generate Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={style.home}>
      <Nava />
      <section className={style.dashboardShell} aria-label="AI-generated reports">

        <div className={style.pageHeader}>
          <div>
            <p className={style.eyebrow}>AI interview report</p>
            <h1 className={style.pageTitle}>Candidate report</h1>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/generate-report" className={`btn btn-sm px-3 ${style.btnBrand}`}>
              + New Report
            </Link>
          </div>
        </div>

        <AiReportCard
          report={selectedReport}
          allReports={reports}
          activeReportId={selectedReport?._id}
          onSelectReport={handleSelectReport}
        />
      </section>
    </main>
  );
}
