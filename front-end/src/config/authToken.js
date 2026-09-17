const TOKEN_STORAGE_KEY = "interview_ai_token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
