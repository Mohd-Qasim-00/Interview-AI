import style from "../style/style.module.css";

import Nava from "../components/Nav";

import InterviewForm from "../components/InterviewForm";

function GenerateReport() {
  return (
    <main className={style.home}>
      <Nava></Nava>

      <section className={style.formShell} aria-label="Generate interview report">
        <div className={style.formIntro}>
          <p className={style.eyebrow}>Report generator</p>
          <h1 className={style.pageTitle}>Build a focused interview plan</h1>
          <p className={style.pageCopy}>
            Upload a resume and paste the role details to generate targeted
            questions, model answers, skill gaps, and a match score.
          </p>
        </div>

        <InterviewForm />
      </section>
    </main>
  );
}

export default GenerateReport;
