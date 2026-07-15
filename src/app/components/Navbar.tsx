"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <nav
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}
      id="main-navbar"
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="navbar-logo">
          <span className={styles.logoIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" fill="#7A9E7E" opacity="0.2" />
              <path
                d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6z"
                stroke="#7A9E7E"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M16 10c-1.5 2-3 4-3 6 0 2.5 1.5 4 3 4s3-1.5 3-4c0-2-1.5-4-3-6z"
                fill="#7A9E7E"
              />
              <path
                d="M12 18c1-1 2.5-1.5 4-1.5s3 .5 4 1.5"
                stroke="#C67B5C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="14" r="1.5" fill="#C67B5C" />
            </svg>
          </span>
          <span className={styles.logoText}>
            MOE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks} id="desktop-nav">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/#how-it-works" className={styles.navLink}>
            How It Works
          </Link>
          <Link href="/#featured-ngos" className={styles.navLink}>
            Explore NGOs
          </Link>
          <Link href="/#impact" className={styles.navLink}>
            Impact
          </Link>
          <Link href="/help-and-care" className={styles.navLink}>
            Help & Care
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons} id="auth-buttons">
          {loading ? (
            <span className={styles.navLoading}>...</span>
          ) : user ? (
            <div className={styles.userProfileMenu}>
              <span className={styles.userName} title={user.email || ""}>
                Hi, {user.displayName || user.email?.split("@")[0] || "User"}
              </span>
              <button
                onClick={() => signOut()}
                className="btn btn-ghost btn-sm"
                id="logout-btn"
                style={{ marginLeft: "8px" }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={`btn btn-ghost ${styles.loginBtn}`}>
                Log In
              </Link>
              <Link
                href="/register"
                className={`btn btn-primary ${styles.registerBtn}`}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${isMobileOpen ? styles.active : ""}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileOpen ? styles.open : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMobileOpen ? styles.open : ""}`}
        id="mobile-menu"
      >
        <div className={styles.mobileMenuInner}>
          <Link
            href="/"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/#featured-ngos"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            Explore NGOs
          </Link>
          <Link
            href="/#impact"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            Impact
          </Link>
          <Link
            href="/help-and-care"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            Help & Care
          </Link>
          <div className={styles.mobileDivider} />
          {loading ? (
            <span className={styles.mobileLoading}>Loading...</span>
          ) : user ? (
            <>
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileUserName}>
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <span className={styles.mobileUserEmail}>{user.email}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileOpen(false);
                }}
                className={`btn btn-outline ${styles.mobileAuthBtn}`}
                style={{ borderColor: "var(--color-error)", color: "var(--color-error)", marginTop: "12px" }}
                id="mobile-logout-btn"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`btn btn-outline ${styles.mobileAuthBtn}`}
                onClick={() => setIsMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className={`btn btn-primary ${styles.mobileAuthBtn}`}
                onClick={() => setIsMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
