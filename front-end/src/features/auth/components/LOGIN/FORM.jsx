import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import style from "../../../ai/style/style.module.css";

function FORM() {
  const { handleLogin, loading } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const newErrors = {};

    if (!email)                       newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password)                    newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className={`${style.authPage} d-flex align-items-center justify-content-center p-3`}>
      <div className={`w-100 ${style.authShell}`}>

        {/* Brand */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-3">
            <span className={`${style.brandMark} fw-black`}>AI</span>
            <span className="fw-bold fs-6 text-white">Interview Coach</span>
          </div>
          <h2 className="fw-bold text-white mb-1">Welcome back</h2>
          <p className="text-secondary mb-0">Sign in to your account</p>
        </div>

        <div className="card shadow-lg border-secondary">
          <div className="card-body p-4">

            {apiError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="flex-shrink-0">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                <span className="small">{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email" id="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold small">Password</label>
                <input
                  type="password" id="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${style.btnBrand}`}
              >
                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-secondary small">
          No account?{" "}
          <Link to="/register" className="text-danger fw-bold text-decoration-none">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default FORM;