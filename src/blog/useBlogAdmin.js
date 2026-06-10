import { useCallback, useState } from "react";

const STORAGE_KEY = "csk_blog_admin_secret_v1";

export function useBlogAdmin() {
  const [adminSecret, setAdminSecretState] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const setAdminSecret = useCallback((value) => {
    setAdminSecretState(value);
    try {
      if (value) sessionStorage.setItem(STORAGE_KEY, value);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const clearAdminSecret = useCallback(() => setAdminSecret(""), [setAdminSecret]);

  return { adminSecret, setAdminSecret, clearAdminSecret, isLoggedIn: !!adminSecret };
}
