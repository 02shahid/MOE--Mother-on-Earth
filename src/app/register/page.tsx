"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialButtons from "../components/SocialButtons";
import { signUpWithEmail, getAuthErrorMessage, isFirebaseError } from "@/lib/auth";
import { createUserProfile, createNGOProfile } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

const interests = [
  "🤝 Volunteer",
  "💰 Donate",
  "🎓 Mentor",
  "💻 Tech Skills",
  "📢 Advocacy",
  "🎨 Creative",
  "📦 Logistics",
  "🩺 Medical",
];

const ngoCategories = [
  "Environment & Climate",
  "Education & Literacy",
  "Healthcare & Wellness",
  "Animal Welfare",
  "Women Empowerment",
  "Clean Water & Sanitation",
  "Poverty & Hunger",
  "Disability & Inclusion",
  "Disaster Relief",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [role, setRole] = useState<"user" | "ngo">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // User fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // NGO fields
  const [ngoName, setNgoName] = useState("");
  const [ngoRegNumber, setNgoRegNumber] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoPassword, setNgoPassword] = useState("");
  const [ngoMission, setNgoMission] = useState("");
  const [ngoCategory, setNgoCategory] = useState("");

  // Redirect if already logged in
  if (user) {
    router.push("/");
    return null;
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (role === "user") {
      if (userPassword !== userConfirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (userPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    } else {
      if (ngoPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (role === "user") {
        // Create Firebase Auth account
        const firebaseUser = await signUpWithEmail(
          userEmail,
          userPassword,
          userName
        );

        // Save profile to Firestore
        await createUserProfile(firebaseUser.uid, {
          name: userName,
          email: userEmail,
          phone: userPhone,
          interests: selectedInterests,
        });
      } else {
        // Create Firebase Auth account for NGO
        const firebaseUser = await signUpWithEmail(
          ngoEmail,
          ngoPassword,
          ngoName
        );

        // Save NGO profile to Firestore
        await createNGOProfile(firebaseUser.uid, {
          name: ngoName,
          regNumber: ngoRegNumber,
          email: ngoEmail,
          mission: ngoMission,
          category: ngoCategory,
        });
      }

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
      {/* Left Panel */}
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
                <circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.15)" />
                <path d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
                <path d="M16 10c-1.5 2-3 4-3 6 0 2.5 1.5 4 3 4s3-1.5 3-4c0-2-1.5-4-3-6z" fill="rgba(255,255,255,0.8)" />
                <circle cx="16" cy="14" r="1.5" fill="#C67B5C" />
              </svg>
            </div>
            <h1 className={styles.authBrandTitle}>Join MOE</h1>
            <p className={styles.authBrandSubtitle}>
              {role === "user"
                ? "Start your journey as a changemaker. Find NGOs that match your passion and make a tangible impact in your community."
                : "Bring your NGO to a platform of 12,000+ passionate individuals ready to support your mission. Get visibility, volunteers, and funding."}
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

      {/* Right Panel — Register Form */}
      <div className={styles.authRight}>
        <div className={styles.authFormContainer}>
          <Link href="/" className={styles.mobileLogoLink}>
            <span className={styles.mobileLogo}>MOE</span>
          </Link>

          <div className={styles.authFormHeader}>
            <h2>Create Account</h2>
            <p>
              Already have an account?{" "}
              <Link href="/login" className={styles.authLink}>Sign in</Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className={styles.roleToggle} id="role-toggle">
            <button
              className={`${styles.roleOption} ${role === "user" ? styles.roleOptionActive : ""}`}
              onClick={() => { setRole("user"); setError(""); }}
              type="button"
              id="role-user-btn"
            >
              🙋 I Want to Help
            </button>
            <button
              className={`${styles.roleOption} ${role === "ngo" ? styles.roleOptionActive : ""}`}
              onClick={() => { setRole("ngo"); setError(""); }}
              type="button"
              id="role-ngo-btn"
            >
              🏢 Register as NGO
            </button>
          </div>

          <SocialButtons mode="register" onError={setError} />

          <div className={styles.divider}>
            <span>or register with email</span>
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
            {role === "user" ? (
              <>
                <div className="input-group">
                  <label htmlFor="register-name" className="input-label">Full Name</label>
                  <input type="text" id="register-name" className="input-field" placeholder="Your full name" value={userName} onChange={(e) => setUserName(e.target.value)} required disabled={loading} />
                </div>

                <div className="input-group">
                  <label htmlFor="register-email" className="input-label">Email Address</label>
                  <input type="email" id="register-email" className="input-field" placeholder="you@example.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required disabled={loading} />
                </div>

                <div className={styles.inputRow}>
                  <div className="input-group">
                    <label htmlFor="register-password" className="input-label">Password</label>
                    <div className={styles.passwordWrapper}>
                      <input type={showPassword ? "text" : "password"} id="register-password" className="input-field" placeholder="Min. 6 characters" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required disabled={loading} />
                      <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="register-confirm" className="input-label">Confirm Password</label>
                    <input type="password" id="register-confirm" className="input-field" placeholder="Re-enter password" value={userConfirmPassword} onChange={(e) => setUserConfirmPassword(e.target.value)} required disabled={loading} />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="register-phone" className="input-label">
                    Phone Number <span style={{ fontWeight: 400, color: "var(--color-warm-brown-lighter)" }}>(optional)</span>
                  </label>
                  <input type="tel" id="register-phone" className="input-field" placeholder="+91 XXXXXXXXXX" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} disabled={loading} />
                </div>

                <div className="input-group">
                  <label className="input-label">How would you like to help?</label>
                  <div className={styles.interestGrid}>
                    {interests.map((interest) => (
                      <button key={interest} type="button" className={`${styles.interestTag} ${selectedInterests.includes(interest) ? styles.interestTagActive : ""}`} onClick={() => toggleInterest(interest)} disabled={loading}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label htmlFor="ngo-name" className="input-label">Organization Name</label>
                  <input type="text" id="ngo-name" className="input-field" placeholder="Your NGO's official name" value={ngoName} onChange={(e) => setNgoName(e.target.value)} required disabled={loading} />
                </div>

                <div className={styles.inputRow}>
                  <div className="input-group">
                    <label htmlFor="ngo-reg" className="input-label">Registration Number</label>
                    <input type="text" id="ngo-reg" className="input-field" placeholder="e.g., NGO-2024-XXXX" value={ngoRegNumber} onChange={(e) => setNgoRegNumber(e.target.value)} required disabled={loading} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="ngo-category" className="input-label">Category</label>
                    <select id="ngo-category" className={styles.selectField} value={ngoCategory} onChange={(e) => setNgoCategory(e.target.value)} required disabled={loading}>
                      <option value="" disabled>Select category</option>
                      {ngoCategories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="ngo-email" className="input-label">Official Email</label>
                  <input type="email" id="ngo-email" className="input-field" placeholder="contact@yourngo.org" value={ngoEmail} onChange={(e) => setNgoEmail(e.target.value)} required disabled={loading} />
                </div>

                <div className="input-group">
                  <label htmlFor="ngo-password" className="input-label">Password</label>
                  <div className={styles.passwordWrapper}>
                    <input type={showPassword ? "text" : "password"} id="ngo-password" className="input-field" placeholder="Min. 6 characters" value={ngoPassword} onChange={(e) => setNgoPassword(e.target.value)} required disabled={loading} />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="ngo-mission" className="input-label">Mission Statement</label>
                  <textarea id="ngo-mission" className={styles.textareaField} placeholder="Briefly describe your organization's mission and goals..." value={ngoMission} onChange={(e) => setNgoMission(e.target.value)} rows={3} disabled={loading} />
                </div>
              </>
            )}

            <label className={styles.checkbox} htmlFor="agree-terms">
              <input type="checkbox" id="agree-terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span className={styles.checkmark} />
              <span className={styles.termsLabel}>
                I agree to the <a href="#" className={styles.termsLink}>Terms of Service</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} id="register-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : role === "user" ? "Create Account" : "Register NGO"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
