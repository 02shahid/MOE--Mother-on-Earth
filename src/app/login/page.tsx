"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialButtons from "../components/SocialButtons";
import { signInWithEmail, getAuthErrorMessage, isFirebaseError } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err) {
      if (isFirebaseError(err)) {
        setError(getAuthErrorMessage(err.code));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Left Panel — Illustration / Branding */}
      <div className={styles.authLeft}>
        <div className={styles.authLeftContent}>
          <Link href="/" className={styles.backToHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </Link>

          <div className={styles.authBranding}>
            <div className={styles.authLogo}>
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="rgba(255,255,255,0.15)"
                />
                <path
                  d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6z"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M16 10c-1.5 2-3 4-3 6 0 2.5 1.5 4 3 4s3-1.5 3-4c0-2-1.5-4-3-6z"
                  fill="rgba(255,255,255,0.8)"
                />
                <circle cx="16" cy="14" r="1.5" fill="#C67B5C" />
              </svg>
            </div>
            <h1 className={styles.authBrandTitle}>Welcome Back</h1>
            <p className={styles.authBrandSubtitle}>
              Continue your journey of making a difference. Every login brings
              you closer to the change you want to see.
            </p>
          </div>

          {/* Decorative Stats */}
          <div className={styles.authStats}>
            <div className={styles.authStat}>
              <span className={styles.authStatNumber}>12K+</span>
              <span className={styles.authStatLabel}>Active Members</span>
            </div>
            <div className={styles.authStatDivider} />
            <div className={styles.authStat}>
              <span className={styles.authStatNumber}>500+</span>
              <span className={styles.authStatLabel}>Partner NGOs</span>
            </div>
            <div className={styles.authStatDivider} />
            <div className={styles.authStat}>
              <span className={styles.authStatNumber}>85+</span>
              <span className={styles.authStatLabel}>Cities</span>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className={styles.authLeftDecor1} />
        <div className={styles.authLeftDecor2} />
      </div>

      {/* Right Panel — Login Form */}
      <div className={styles.authRight}>
        <div className={styles.authFormContainer}>
          {/* Mobile logo */}
          <Link href="/" className={styles.mobileLogoLink}>
            <span className={styles.mobileLogo}>
              MOE
            </span>
          </Link>

          <div className={styles.authFormHeader}>
            <h2>Sign In</h2>
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className={styles.authLink}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Social Buttons */}
          <SocialButtons mode="login" onError={setError} />

          {/* Divider */}
          <div className={styles.divider}>
            <span>or sign in with email</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className="input-group">
              <label htmlFor="login-email" className="input-label">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password" className="input-label">
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox} htmlFor="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkmark} />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className={styles.forgotLink}
                id="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              id="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
