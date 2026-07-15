import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      {/* Wave divider */}
      <div className={styles.waveDivider}>
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V100H0V40Z"
            fill="#5C4033"
          />
        </svg>
      </div>

      <div className={styles.footerInner}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandColumn}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="#7A9E7E"
                      opacity="0.3"
                    />
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
                    <circle cx="16" cy="14" r="1.5" fill="#C67B5C" />
                  </svg>
                </span>
                <span className={styles.logoText}>
                  MOE
                </span>
              </Link>
              <p className={styles.tagline}>
                Mother On Earth — connecting hearts to causes
                that need them most.
              </p>

              {/* Social Links */}
              <div className={styles.socials}>
                <a
                  href="#"
                  className={styles.socialLink}
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#" className={styles.socialLink} aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7.47v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className={styles.socialLink}
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
                <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Platform</h4>
              <Link href="/#how-it-works" className={styles.footerLink}>
                How It Works
              </Link>
              <Link href="/#featured-ngos" className={styles.footerLink}>
                Explore NGOs
              </Link>
              <Link href="/#impact" className={styles.footerLink}>
                Our Impact
              </Link>
              <Link href="/help-and-care" className={styles.footerLink}>
                Help & Care
              </Link>
              <Link href="/register" className={styles.footerLink}>
                Register Your NGO
              </Link>
            </div>

            {/* Get Involved */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Get Involved</h4>
              <Link href="/register" className={styles.footerLink}>
                Volunteer
              </Link>
              <Link href="/register" className={styles.footerLink}>
                Donate
              </Link>
              <Link href="/register" className={styles.footerLink}>
                Mentor
              </Link>
              <Link href="/register" className={styles.footerLink}>
                Partner With Us
              </Link>
            </div>

            {/* Newsletter */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Stay Updated</h4>
              <p className={styles.newsletterText}>
                Get weekly stories of impact and new opportunities.
              </p>
              <form
                className={styles.newsletterForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className={styles.newsletterInput}
                  id="footer-newsletter-email"
                />
                <button
                  type="submit"
                  className={styles.newsletterBtn}
                  id="footer-newsletter-submit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} MOE — Mother On Earth. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <a href="#" className={styles.bottomLink}>
                Privacy Policy
              </a>
              <a href="#" className={styles.bottomLink}>
                Terms of Service
              </a>
              <a href="#" className={styles.bottomLink}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
