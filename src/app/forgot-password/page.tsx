"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword, getAuthErrorMessage, isFirebaseError } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
      await resetPassword(email);
      setSubmitted(true);
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
      {/* Left Panel */}
      <div className={styles.authLeft}>
        <div className={styles.authLeftContent}>
          <Link href="/login" className={styles.backToHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Login
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
            <h1 className={styles.authBrandTitle}>Reset Password</h1>
            <p className={styles.authBrandSubtitle}>
              Don&apos;t worry, it happens to the best of us. We&apos;ll send
              you a link to reset your password and get back to making an
              impact.
            </p>
          </div>

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

        <div className={styles.authLeftDecor1} />
        <div className={styles.authLeftDecor2} />
      </div>

      {/* Right Panel */}
      <div className={styles.authRight}>
        <div className={styles.authFormContainer}>
          {/* Mobile logo */}
          <Link href="/" className={styles.mobileLogoLink}>
            <span className={styles.mobileLogo}>
              MOE
            </span>
          </Link>

          {!submitted ? (
            <>
              <div className={styles.forgotIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="var(--color-sage)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 11V7a5 5 0 0110 0v4"
                    stroke="var(--color-sage)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="1.5"
                    fill="var(--color-sage)"
                  />
                </svg>
              </div>

              <div className={styles.authFormHeader}>
                <h2>Forgot Password?</h2>
                <p>
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
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

              <form onSubmit={handleSubmit} className={styles.authForm}>
                <div className="input-group">
                  <label htmlFor="forgot-email" className="input-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    className="input-field"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                  id="forgot-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link href="/login" className={styles.authLink}>
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13"
                    stroke="var(--color-sage)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="var(--color-sage)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className={styles.successTitle}>Check Your Email</h2>
              <p className={styles.successText}>
                We&apos;ve sent a password reset link to{" "}
                <span className={styles.successEmail}>{email}</span>. Please
                check your inbox and follow the instructions to reset your
                password.
              </p>

              <Link
                href="/login"
                className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                id="back-to-login-btn"
              >
                Back to Sign In
              </Link>

              <p
                style={{
                  marginTop: "20px",
                  fontSize: "0.85rem",
                  color: "var(--color-warm-brown-lighter)",
                }}
              >
                Didn&apos;t receive the email?{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-sage)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                  }}
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
