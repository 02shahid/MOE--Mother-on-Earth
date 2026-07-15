"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./page.module.css";

/* ───────────────────────────────────────
   Animated Counter Hook
   ─────────────────────────────────────── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

/* ───────────────────────────────────────
   Scroll-triggered Fade-in Hook
   ─────────────────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ───────────────────────────────────────
   Featured NGOs Data
   ─────────────────────────────────────── */
const featuredNGOs = [
  {
    name: "GreenRoots Jaipur",
    category: "Environment",
    location: "Malviya Nagar, Jaipur",
    description:
      "Planting trees, developing urban parks, and restoring dry ecosystems across Jaipur to tackle rising summer heatwaves.",
    volunteers: 1240,
    icon: "🌱",
    color: "#7A9E7E",
  },
  {
    name: "PinkCity LitPath Initiative",
    category: "Education",
    location: "Mansarovar, Jaipur",
    description:
      "Providing free evening tutorials, books, digital literacy modules, and school supplies to kids living in slums.",
    volunteers: 890,
    icon: "📚",
    color: "#6BA3BE",
  },
  {
    name: "HealRajasthan Foundation",
    category: "Healthcare",
    location: "C-Scheme, Jaipur",
    description:
      "Operating mobile clinic vans, health awareness camps, and distributing free essential medicines in rural clusters.",
    volunteers: 650,
    icon: "🏥",
    color: "#C67B5C",
  },
  {
    name: "Jaipur Stray Shield",
    category: "Animal Welfare",
    location: "Vidyadhar Nagar, Jaipur",
    description:
      "Rescuing, vaccinating, medical rehabilitation, and daily feeding runs for stray dogs and abandoned cattle.",
    volunteers: 420,
    icon: "🐾",
    color: "#D4A843",
  },
  {
    name: "Rajasthan WaterFirst",
    category: "Clean Water",
    location: "Sanganer, Jaipur",
    description:
      "Constructing rainwater harvesting units, cleaning local stepwells, and setting up community filter taps in villages.",
    volunteers: 310,
    icon: "💧",
    color: "#6BA3BE",
  },
  {
    name: "EmpowerHer Rajasthan",
    category: "Women Empowerment",
    location: "Jagatpura, Jaipur",
    description:
      "Training underprivileged and rural women in block printing, sewing, and e-commerce marketing to earn livelihoods.",
    volunteers: 780,
    icon: "✊",
    color: "#9E7A9E",
  },
];

/* ───────────────────────────────────────
   Testimonials Data
   ─────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "MOE made it incredibly easy to find meaningful volunteer work. I connected with GreenRoots and planted 200 trees in just one weekend!",
    name: "Ananya Mehta",
    role: "Volunteer",
    avatar: "A",
  },
  {
    quote:
      "As a small NGO, visibility was our biggest challenge. MOE brought us 50+ dedicated volunteers in our first month on the platform.",
    name: "Rajesh Kumar",
    role: "Founder, LitPath Initiative",
    avatar: "R",
  },
  {
    quote:
      "I donate monthly through MOE and love the transparency. I can see exactly how my contributions are making an impact.",
    name: "Priya Sharma",
    role: "Monthly Donor",
    avatar: "P",
  },
];

/* ═══════════════════════════════════════
   HOME PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Home() {
  const { count: count1, ref: ref1 } = useCounter(500, 2000);
  const { count: count2, ref: ref2 } = useCounter(12000, 2500);
  const { count: count3, ref: ref3 } = useCounter(85, 1800);
  const { count: count4, ref: ref4 } = useCounter(35, 1600);

  const { ref: howItWorksRef, visible: howItWorksVisible } = useFadeIn();
  const { ref: ngosSectionRef, visible: ngosSectionVisible } = useFadeIn();
  const { ref: impactSectionRef, visible: impactSectionVisible } = useFadeIn();
  const { ref: testimonialSectionRef, visible: testimonialSectionVisible } = useFadeIn();
  const { ref: ctaSectionRef, visible: ctaSectionVisible } = useFadeIn();

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      {/* ──────────── HERO SECTION ──────────── */}
      <section className={styles.hero} id="hero">
        {/* Background decorative elements */}
        <div className={styles.heroBgCircle1} />
        <div className={styles.heroBgCircle2} />
        <div className={styles.heroBgCircle3} />

        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Join 12,000+ changemakers
          </span>
          <h1 className={styles.heroTitle}>
            Small Acts of Kindness,{" "}
            <span className={styles.heroHighlight}>Big Waves of Change</span>
          </h1>
          <p className={styles.heroSubtitle}>
            MOE connects passionate individuals with NGOs that need your
            help. Volunteer your time, donate to causes you believe in, or share
            your skills — every contribution matters.
          </p>
          <div className={styles.heroCtas}>
            <Link
              href="/register"
              className={`btn btn-primary btn-lg ${styles.heroBtn}`}
              id="hero-volunteer-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Start Volunteering
            </Link>
            <Link
              href="/register"
              className={`btn btn-outline btn-lg ${styles.heroBtn}`}
              id="hero-ngo-btn"
            >
              Register Your NGO
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={styles.trustRow}>
            <div className={styles.trustAvatars}>
              {["A", "S", "R", "M", "P"].map((letter, i) => (
                <div
                  key={letter}
                  className={styles.trustAvatar}
                  style={{ zIndex: 5 - i, marginLeft: i > 0 ? "-8px" : "0" }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className={styles.trustText}>
              <strong>500+</strong> NGOs already trust MOE
            </p>
          </div>
        </div>

        {/* Hero illustration */}
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>🤝</div>
            <div className={styles.heroCardContent}>
              <span className={styles.heroCardLabel}>New Match!</span>
              <span className={styles.heroCardTitle}>
                You&apos;ve been connected with GreenRoots Foundation
              </span>
              <span className={styles.heroCardTag}>
                🌿 Environment · Weekend Volunteering
              </span>
            </div>
          </div>
          <div className={`${styles.heroCard} ${styles.heroCardSecond}`}>
            <div className={styles.heroCardIcon}>💰</div>
            <div className={styles.heroCardContent}>
              <span className={styles.heroCardLabel}>Donation Received</span>
              <span className={styles.heroCardTitle}>
                ₹2,500 donated to LitPath Initiative
              </span>
              <span className={styles.heroCardTag}>
                📚 Education · Monthly Donor
              </span>
            </div>
          </div>
          <div className={`${styles.heroCard} ${styles.heroCardThird}`}>
            <div className={styles.heroCardIcon}>⭐</div>
            <div className={styles.heroCardContent}>
              <span className={styles.heroCardLabel}>Milestone</span>
              <span className={styles.heroCardTitle}>
                You&apos;ve completed 10 volunteer hours!
              </span>
              <span className={styles.heroCardTag}>
                🏆 Impact Badge Unlocked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Organic wave divider */}
      <div className={styles.waveDivider}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C360 70 720 0 1080 40C1260 60 1380 30 1440 30V80H0V30Z"
            fill="var(--color-cream)"
          />
        </svg>
      </div>

      {/* ──────────── HOW IT WORKS ──────────── */}
      <section
        className={`${styles.howItWorks} ${howItWorksVisible ? styles.fadeInVisible : ""}`}
        ref={howItWorksRef}
        id="how-it-works"
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Simple & Effective</span>
            <h2>How MOE Works</h2>
            <p>
              Three simple steps to start making a real difference in your
              community.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {[
              {
                step: "01",
                icon: "📝",
                title: "Create Your Profile",
                desc: "Sign up as a volunteer, donor, or NGO. Tell us about your passions, skills, and the causes you care about most.",
              },
              {
                step: "02",
                icon: "🔍",
                title: "Discover & Connect",
                desc: "Browse verified NGOs, filter by cause, location, or type of help needed. Find the perfect match for your interests.",
              },
              {
                step: "03",
                icon: "🌟",
                title: "Make an Impact",
                desc: "Volunteer your time, donate funds, mentor someone, or offer your professional skills. Track your contribution and see your impact grow.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={styles.stepCard}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className={styles.stepNumber}>{item.step}</span>
                <div className={styles.stepIcon}>{item.icon}</div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Connecting line between steps */}
          <div className={styles.stepsConnector}>
            <div className={styles.connectorLine} />
          </div>
        </div>
      </section>

      {/* ──────────── FEATURED NGOs ──────────── */}
      <section
        className={`${styles.featuredSection} ${ngosSectionVisible ? styles.fadeInVisible : ""}`}
        ref={ngosSectionRef}
        id="featured-ngos"
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Trusted Partners</span>
            <h2>Featured NGOs</h2>
            <p>
              Explore verified organizations making a real difference. Find the
              cause that speaks to your heart.
            </p>
          </div>

          <div className={styles.ngoGrid}>
            {featuredNGOs.map((ngo, i) => (
              <div
                key={ngo.name}
                className={styles.ngoCard}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={styles.ngoCardAccent}
                  style={{ background: ngo.color }}
                />
                <div className={styles.ngoCardHeader}>
                  <span className={styles.ngoIcon}>{ngo.icon}</span>
                  <span
                    className={styles.ngoCategory}
                    style={{
                      color: ngo.color,
                      background: `${ngo.color}15`,
                    }}
                  >
                    {ngo.category}
                  </span>
                </div>
                <h3 className={styles.ngoName}>{ngo.name}</h3>
                <p className={styles.ngoDesc}>{ngo.description}</p>
                <div className={styles.ngoLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: "4px", color: "var(--color-terracotta)" }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
                  </svg>
                  <span>{ngo.location}</span>
                </div>
                <div className={styles.ngoFooter}>
                  <span className={styles.ngoVolunteers}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {ngo.volunteers.toLocaleString()} volunteers
                  </span>
                  <Link
                    href="/register"
                    className={styles.ngoJoinBtn}
                    style={{ color: ngo.color }}
                  >
                    Join →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── IMPACT STATS ──────────── */}
      <section
        className={`${styles.impactSection} ${impactSectionVisible ? styles.fadeInVisible : ""}`}
        ref={impactSectionRef}
        id="impact"
      >
        <div className={styles.impactBg} />
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span
              className={styles.sectionSubtitle}
              style={{ color: "var(--color-golden)" }}
            >
              Our Collective Impact
            </span>
            <h2 style={{ color: "var(--color-cream)" }}>
              Together, We&apos;re Making a Difference
            </h2>
            <p style={{ color: "rgba(245,240,232,0.65)" }}>
              Every number represents real lives touched, real communities
              transformed.
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard} ref={ref1}>
              <span className={styles.statIcon}>🏢</span>
              <span className={styles.statNumber}>{count1}+</span>
              <span className={styles.statLabel}>NGOs Registered</span>
            </div>
            <div className={styles.statCard} ref={ref2}>
              <span className={styles.statIcon}>🙋</span>
              <span className={styles.statNumber}>
                {count2.toLocaleString()}+
              </span>
              <span className={styles.statLabel}>Active Volunteers</span>
            </div>
            <div className={styles.statCard} ref={ref3}>
              <span className={styles.statIcon}>🌍</span>
              <span className={styles.statNumber}>{count3}+</span>
              <span className={styles.statLabel}>Cities Reached</span>
            </div>
            <div className={styles.statCard} ref={ref4}>
              <span className={styles.statIcon}>🎯</span>
              <span className={styles.statNumber}>₹{count4}L+</span>
              <span className={styles.statLabel}>Funds Channeled</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section
        className={`${styles.testimonialsSection} ${testimonialSectionVisible ? styles.fadeInVisible : ""}`}
        ref={testimonialSectionRef}
        id="testimonials"
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Stories of Impact</span>
            <h2>What Our Community Says</h2>
          </div>

          <div className={styles.testimonialCarousel}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`${styles.testimonialCard} ${
                  i === activeTestimonial ? styles.activeTestimonial : ""
                }`}
              >
                <div className={styles.quoteIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                      fill="var(--color-sage)"
                      opacity="0.2"
                    />
                  </svg>
                </div>
                <p className={styles.testimonialQuote}>{t.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <span className={styles.testimonialName}>{t.name}</span>
                    <span className={styles.testimonialRole}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className={styles.testimonialDots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeTestimonial ? styles.activeDot : ""}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA SECTION ──────────── */}
      <section
        className={`${styles.ctaSection} ${ctaSectionVisible ? styles.fadeInVisible : ""}`}
        ref={ctaSectionRef}
        id="cta"
      >
        <div className={styles.ctaBg} />
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2>Ready to Make a Difference?</h2>
            <p>
              Join thousands of changemakers who are already bridging the gap
              between passion and purpose. Your journey starts here.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                href="/register"
                className="btn btn-accent btn-lg"
                id="cta-volunteer-btn"
              >
                Join as Volunteer
              </Link>
              <Link
                href="/register"
                className="btn btn-outline btn-lg"
                id="cta-ngo-btn"
                style={{
                  borderColor: "var(--color-cream)",
                  color: "var(--color-cream)",
                }}
              >
                Register Your NGO
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
