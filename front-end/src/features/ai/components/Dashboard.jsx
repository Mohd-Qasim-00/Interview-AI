import { useState } from "react";
import style from "../style/style.module.css";


const getReportData = (r) => r?.data || r?.report || r || {};

const normalizeQuestions = (qs) => {
  if (!Array.isArray(qs)) return [];
  return qs.map((q, i) =>
    typeof q === "string"
      ? { id: String(i + 1).padStart(2, "0"), question: q, intention: "", answer: "" }
      : {
          id: q.id || String(i + 1).padStart(2, "0"),
          question: q.question || q.title || "",
          intention: q.intention || q.reason || "",
          answer: q.answer || q.modelAnswer || q.expectedAnswer || "",
        }
  );
};

const techQs   = (r) => normalizeQuestions(getReportData(r).technicalQuestions   || getReportData(r).questions);
const behQs    = (r) => normalizeQuestions(getReportData(r).behaviouralQuestions  || getReportData(r).behavioralQuestions);
const normScore = (v) => { const n = Number(String(v).replace("%", "")); return Number.isNaN(n) ? 0 : Math.min(100, Math.max(0, Math.round(n))); };
const getScore  = (r) => normScore(getReportData(r).matchScore ?? getReportData(r).score ?? 0);

const sevMap   = { high: "danger", medium: "warning", low: "success" };
const sevLabel = { high: "High",   medium: "Medium",  low: "Low" };

const getGaps = (r) => {
  const gaps = getReportData(r).skillGaps || getReportData(r).gaps;
  if (!Array.isArray(gaps) || !gaps.length) return [];
  return gaps.map((g, i) => {
    const sev = typeof g === "object" ? String(g.severity).toLowerCase() : "";
    return {
      label: typeof g === "string" ? g : g.skill || g.label || g.name || "",
      severity: sev,
      tone: sevMap[sev] || ["danger", "warning", "success"][i % 3],
    };
  });
};

const getRoadmap = (r) => {
  const rm = getReportData(r).preparationPlans || getReportData(r).preparationPlan || getReportData(r).roadmap;
  if (!Array.isArray(rm)) return [];
  return rm.map((p, i) => ({
    day: p.day || i + 1,
    focus: p.focus || p.title || "",
    tasks: Array.isArray(p.task) ? p.task : Array.isArray(p.tasks) ? p.tasks : [],
  }));
};

const fmtDate = (d) => {
  if (!d) return "";
  try { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d)); }
  catch { return ""; }
};

const trunc = (s, n = 55) => typeof s === "string" && s.length > n ? s.slice(0, n) + "..." : s || "";


const QuestionAccordion = ({ questions, idPrefix }) => (
  <div className="accordion" id={`acc-${idPrefix}`}>
    {questions.map((item, idx) => {
      const id = `${idPrefix}-${idx}`;
      return (
        <div key={`${item.id}-${idx}`} className="accordion-item border-secondary">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed fw-semibold gap-2 d-flex align-items-center"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#c-${id}`}
              aria-expanded="false"
              aria-controls={`c-${id}`}
            >
              <span className="badge bg-secondary me-1">{item.id}</span>
              {item.question}
            </button>
          </h2>
          <div id={`c-${id}`} className="accordion-collapse collapse" data-bs-parent={`#acc-${idPrefix}`}>
            <div className="accordion-body">
              {item.intention && (
                <div className="mb-3">
                  <span className="badge bg-primary mb-1">Intention</span>
                  <p className="mb-0 text-secondary">{item.intention}</p>
                </div>
              )}
              {item.answer && (
                <div>
                  <span className="badge bg-success mb-1">Model Answer</span>
                  <p className="mb-0 text-secondary">{item.answer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);


const PrepPlan = ({ roadmap }) => (
  <div className="list-group list-group-flush">
    {roadmap.map((plan) => (
      <div key={`${plan.day}-${plan.focus}`} className="list-group-item border-secondary bg-transparent">
        <div className="d-flex gap-3">
          <div className="flex-shrink-0">
            <span className="badge bg-danger px-2 py-2">Day {plan.day}</span>
          </div>
          <div>
            <h6 className="fw-bold mb-1">{plan.focus}</h6>
            <ul className="mb-0 ps-3">
              {plan.tasks.map((t) => <li key={t} className="text-secondary small">{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    ))}
  </div>
);


const ReportHistory = ({ allReports, activeReportId, onSelectReport }) => {
  if (!Array.isArray(allReports) || !allReports.length) return null;

  return (
    <div className="card border-secondary shadow-sm mt-4">
      <div className="card-header border-secondary d-flex align-items-center gap-2">
        <h6 className="mb-0 fw-bold">Previous Reports / Report History</h6>
        <span className="badge bg-secondary">{allReports.length}</span>
      </div>

      <div className="list-group list-group-flush">
        {allReports.map((r) => {
          const isActive  = String(r._id) === String(activeReportId);
          const score     = normScore(r.matchScore ?? 0);
          const scoreTone = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
          const label     = r.title || trunc(r.jobDescription) || "Interview Report";
          const date      = fmtDate(r.createdAt);

          return (
            <button
              key={r._id}
              type="button"
              onClick={() => onSelectReport(r._id)}
              className={`list-group-item list-group-item-action border-secondary ${isActive ? style.historyActive : ""}`}
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div className="overflow-hidden">
                  <div className="fw-semibold text-truncate">{label}</div>
                  {date && <small className="text-secondary">Generated: {date}</small>}
                </div>
                <span className={`badge bg-${scoreTone} flex-shrink-0 px-2 py-1`}>{score}%</span>
              </div>
              <div className="text-end mt-2">
                <small className="fw-semibold text-secondary">View Report &gt;</small>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


const AiReportCard = ({ report, allReports = [], activeReportId, onSelectReport }) => {
  const [activeTab, setActiveTab] = useState("technical");

  if (!report) return null;

  const technicalQs   = techQs(report);
  const behaviouralQs = behQs(report);
  const roadmap       = getRoadmap(report);
  const score         = getScore(report);
  const gaps          = getGaps(report);
  const data          = getReportData(report);
  const title         = report?.title || data?.title || "Interview Report";
  const scoreTone       = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  const scoreWidthClass = score >= 88 ? "w-100" : score >= 63 ? "w-75" : score >= 38 ? "w-50" : score >= 13 ? "w-25" : "w-0";
  const scoreLabel    = score >= 80 ? "Strong match for this role" : score >= 60 ? "Good base Ã¢â‚¬â€ room to grow" : "Significant prep needed";

  const tabs = [
    { id: "technical",   label: "Technical Questions",   count: technicalQs.length,   unit: "Q" },
    { id: "behavioural", label: "Behavioural Questions", count: behaviouralQs.length, unit: "Q" },
    { id: "roadmap",     label: "Preparation Plan",      count: roadmap.length,       unit: "days" },
  ];

  return (
    <>
     
      <div className="row g-4 mt-1">

        {/* Sidebar */}
        <div className="col-12 col-lg-3 order-lg-last d-flex flex-column gap-3">

          {/* Match Score */}
          <div className="card border-secondary shadow-sm text-center p-4">
            <p className="text-uppercase text-secondary fw-bold mb-3 small">Match Score</p>
            <div className={`display-4 fw-bold text-${scoreTone}`}>
              {score}<span className="fs-4">%</span>
            </div>
            <div className="progress my-3">
              <div className={`progress-bar bg-${scoreTone} ${scoreWidthClass}`} role="progressbar" aria-valuenow={score} aria-valuemin="0" aria-valuemax="100" />
            </div>
            <span className={`badge bg-${scoreTone} px-3 py-2`}>{scoreLabel}</span>
          </div>

          {/* Skill Gaps */}
          <div className="card border-secondary shadow-sm p-4">
            <p className="text-uppercase text-secondary fw-bold mb-3 small">Skill Gaps</p>
            {gaps.length === 0 ? (
              <p className="text-secondary mb-0">No gaps identified.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {gaps.map((gap) => (
                  <div key={gap.label} className="d-flex justify-content-between align-items-center">
                    <span className="text-truncate me-2">{gap.label}</span>
                    <span className={`badge bg-${gap.tone} flex-shrink-0`}>
                      {sevLabel[gap.severity] || gap.severity || ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main report card */}
        <div className="col-12 col-lg-9">
          <div className="card border-secondary shadow-sm">
            <div className="card-header border-secondary d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">{title}</h5>
                <small className="text-secondary">Interview Report</small>
              </div>
              <span className="badge bg-secondary px-3 py-2">
                {tabs.find((t) => t.id === activeTab)?.count || 0}{" "}
                {tabs.find((t) => t.id === activeTab)?.unit}
              </span>
            </div>

            {/* Nav tabs */}
            <div className="card-header border-secondary pt-0 pb-0 border-top-0">
              <ul className="nav nav-tabs card-header-tabs border-0 gap-1">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <button
                      type="button"
                      className={`nav-link border-0 fw-semibold ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                      <span className="badge bg-secondary ms-1">{tab.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-body">
              {activeTab === "technical" && (
                technicalQs.length > 0
                  ? <QuestionAccordion questions={technicalQs} idPrefix="tech" />
                  : <p className="text-secondary">No technical questions generated.</p>
              )}
              {activeTab === "behavioural" && (
                behaviouralQs.length > 0
                  ? <QuestionAccordion questions={behaviouralQs} idPrefix="beh" />
                  : <p className="text-secondary">No behavioural questions generated.</p>
              )}
              {activeTab === "roadmap" && (
                roadmap.length > 0
                  ? <PrepPlan roadmap={roadmap} />
                  : <p className="text-secondary">No preparation plan generated.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report History */}
      <ReportHistory
        allReports={allReports}
        activeReportId={activeReportId}
        onSelectReport={onSelectReport}
      />
    </>
  );
};

export default AiReportCard;
