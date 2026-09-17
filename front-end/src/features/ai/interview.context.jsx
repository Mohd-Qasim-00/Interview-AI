
import { createContext, useState } from "react";

export const InterviewContext = createContext();


export const InterviewProvider = ({ children }) => {
  const [interviewReport, setInterviewReport] = useState(null);

  const [loading, setLoading] = useState(false);
  const [report,setReport] = useState([]);

  return (
    <InterviewContext.Provider value={{ interviewReport, setInterviewReport, loading, setLoading, report, setReport }}>
      {children}
    </InterviewContext.Provider>
  );
};

