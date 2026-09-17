import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import style from "../../ai/style/style.module.css";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className={`${style.fullLoader} text-center`}>
        <div>
          <div className={`spinner-border mb-3 ${style.spinnerBrand}`} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mb-0">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;