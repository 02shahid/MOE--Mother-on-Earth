"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

interface CareRequest {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  urgency: "high" | "medium" | "low";
  status: "pending" | "fulfilling" | "fulfilled";
  icon: string;
  date: string;
  fulfilledBy?: {
    name: string;
    contact: string;
  };
}

const INITIAL_REQUESTS: CareRequest[] = [
  {
    id: "req-1",
    title: "Emergency Dry Ration Kits Needed",
    category: "Food & Essentials",
    location: "Sanganer Slum Cluster, Jaipur",
    description: "Over 40 daily-wage families require emergency dry grains (wheat flour, lentils, oil) and baby milk formula.",
    urgency: "high",
    status: "pending",
    icon: "🌾",
    date: "2 hours ago",
  },
  {
    id: "req-2",
    title: "Elderly Care & Weekly Medication Delivery",
    category: "Medical Care",
    location: "C-Scheme, Jaipur",
    description: "An elderly disabled couple needs volunteer assistance with collecting prescriptions from SMS Hospital and delivering weekly groceries.",
    urgency: "medium",
    status: "pending",
    icon: "💊",
    date: "Yesterday",
  },
  {
    id: "req-3",
    title: "Animal Shelter Afternoon Feeding Support",
    category: "Animal Welfare",
    location: "Vidyadhar Nagar, Jaipur",
    description: "Jaipur Stray Shield shelter requires 3 volunteers to assist in preparation and delivery of stray dog feeding rounds and cow shed cleaning.",
    urgency: "low",
    status: "fulfilling",
    icon: "🐾",
    date: "3 days ago",
  },
  {
    id: "req-4",
    title: "Primary School Textbook Donation",
    category: "Education Support",
    location: "Mansarovar, Jaipur",
    description: "Evening community tutorial initiative needs 80 units of basic Hindi/English alphabets coloring notebooks, pencils, and educational toys.",
    urgency: "medium",
    status: "pending",
    icon: "📚",
    date: "5 hours ago",
  },
  {
    id: "req-5",
    title: "Mental Wellness Companion Phone Calls",
    category: "Mental Wellness",
    location: "Remote / Telephone",
    description: "Empathetic listeners wanted to make supportive check-in calls to local university students feeling extreme stress during upcoming exams.",
    urgency: "low",
    status: "fulfilled",
    icon: "🧠",
    date: "2 days ago",
  },
];

const FAQS = [
  {
    question: "How fast are community care requests fulfilled?",
    answer: "Most high-urgency care requests are coordinated with local volunteers and nearest NGO partners within 4 to 12 hours. Lower urgency requests may take 2 to 3 days depending on volunteer availability in that specific locality.",
  },
  {
    question: "Are the direct requests for care verified?",
    answer: "Yes. When a request is submitted, our coordinator team checks the details and contacts the requester if needed. Verified requests are flagged to ensure that aid directly reaches those who genuinely require it.",
  },
  {
    question: "Can I submit a request anonymously?",
    answer: "You can choose to hide your name from public dashboard cards; however, you must provide verified contact coordinates (phone or email) so our dispatch volunteers can arrange the delivery of goods or services.",
  },
  {
    question: "How do I become an official Care Partner NGO?",
    answer: "Registered NGOs can sign up via our portal and complete verification. Once approved, you will gain access to an expanded dashboard to claim, dispatch, and document aid fulfillment with high transparency.",
  },
];

const HELPLINES = [
  {
    title: "National Emergency Help",
    desc: "Direct toll-free line for immediate police, fire, or safety emergencies.",
    phone: "112",
    icon: "🚨",
  },
  {
    title: "Kiran Mental Health Helpline",
    desc: "Government mental wellness counseling and psychological support system.",
    phone: "1800-599-0019",
    icon: "🧠",
  },
  {
    title: "National Medical Helpline",
    desc: "Ambulance, health counseling, and immediate clinical assistance dispatch.",
    phone: "102",
    icon: "🚑",
  },
  {
    title: "Childline India",
    desc: "24/7 emergency support and rescue service for children in distress.",
    phone: "1098",
    icon: "👶",
  },
  {
    title: "Jaipur Animal Rescue (Stray Shield)",
    desc: "Urgent medical transport and aid for injured or distressed stray animals.",
    phone: "+91 98765 43210",
    icon: "🐾",
  },
];

const CATEGORIES = ["All", "Food & Essentials", "Medical Care", "Education Support", "Animal Welfare", "Mental Wellness"];

export default function HelpAndCare() {
  const [activeTab, setActiveTab] = useState<"need-care" | "give-care">("need-care");
  const [requests, setRequests] = useState<CareRequest[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Food & Essentials",
    location: "",
    urgency: "medium" as "high" | "medium" | "low",
    description: "",
    name: "",
    contact: "",
  });

  // Modals state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFulfillReq, setSelectedFulfillReq] = useState<CareRequest | null>(null);
  const [fulfillFormData, setFulfillFormData] = useState({
    name: "",
    contact: "",
  });
  const [showFulfillSuccess, setShowFulfillSuccess] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("moe_care_requests");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setRequests(parsed);
        }, 0);
      } catch (e) {
        console.error("Failed to parse saved requests", e);
      }
    }
  }, []);

  // Save to LocalStorage
  const saveRequests = (updated: CareRequest[]) => {
    setRequests(updated);
    localStorage.setItem("moe_care_requests", JSON.stringify(updated));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFulfillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFulfillFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Care Request
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description || !formData.name || !formData.contact) {
      alert("Please fill in all the required fields.");
      return;
    }

    const categoryIcons: Record<string, string> = {
      "Food & Essentials": "🌾",
      "Medical Care": "💊",
      "Education Support": "📚",
      "Animal Welfare": "🐾",
      "Mental Wellness": "🧠",
    };

    const newRequest: CareRequest = {
      id: `req-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      location: formData.location,
      description: formData.description,
      urgency: formData.urgency,
      status: "pending",
      icon: categoryIcons[formData.category] || "🤝",
      date: "Just now",
    };

    const updated = [newRequest, ...requests];
    saveRequests(updated);
    setShowSuccessModal(true);

    // Reset Form
    setFormData({
      title: "",
      category: "Food & Essentials",
      location: "",
      urgency: "medium",
      description: "",
      name: "",
      contact: "",
    });
  };

  // Click Fulfill Request
  const handleOpenFulfill = (req: CareRequest) => {
    setSelectedFulfillReq(req);
    setFulfillFormData({ name: "", contact: "" });
  };

  const handleSubmitFulfill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFulfillReq || !fulfillFormData.name || !fulfillFormData.contact) {
      alert("Please enter your name and contact details.");
      return;
    }

    const updated = requests.map((req) => {
      if (req.id === selectedFulfillReq.id) {
        return {
          ...req,
          status: "fulfilling" as const,
          fulfilledBy: {
            name: fulfillFormData.name,
            contact: fulfillFormData.contact,
          },
        };
      }
      return req;
    });

    saveRequests(updated);
    setSelectedFulfillReq(null);
    setShowFulfillSuccess(true);
  };

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || req.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Helper to determine Category Badge styling
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Food & Essentials":
        return { color: "var(--color-terracotta)", bg: "rgba(198,123,92,0.12)" };
      case "Medical Care":
        return { color: "var(--color-sky)", bg: "rgba(107,163,190,0.12)" };
      case "Education Support":
        return { color: "var(--color-sage)", bg: "rgba(122,158,126,0.12)" };
      case "Animal Welfare":
        return { color: "var(--color-golden)", bg: "rgba(212,168,67,0.12)" };
      case "Mental Wellness":
        return { color: "#9E7A9E", bg: "rgba(158,122,158,0.12)" };
      default:
        return { color: "var(--color-warm-brown-light)", bg: "var(--color-sand)" };
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      {/* ─── HEADER ─── */}
      <header className={styles.header}>
        <div className={styles.headerBgCircle1} />
        <div className={styles.headerBgCircle2} />
        <div className={styles.headerContent}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Community Aid & Support
          </span>
          <h1 className={styles.title}>
            Compassion in Action: <span className={styles.highlight}>Help & Care Center</span>
          </h1>
          <p className={styles.subtitle}>
            At Mother On Earth (MOE), we believe no one should stand alone. Whether you need immediate support
            or wish to volunteer care for others, this is our dedicated portal for mutual aid.
          </p>
        </div>
      </header>

      {/* ─── TABS NAV ─── */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab("need-care")}
            className={`${styles.tabBtn} ${activeTab === "need-care" ? styles.tabBtnActive : ""}`}
          >
            <span>❤️</span> Request Support & Info
          </button>
          <button
            onClick={() => setActiveTab("give-care")}
            className={`${styles.tabBtn} ${activeTab === "give-care" ? styles.tabBtnActive : ""}`}
          >
            <span>🤝</span> Offer Help & Helplines
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className={styles.mainContent}>
        <div className="container">
          {activeTab === "need-care" ? (
            /* TAB 1: NEED HELP */
            <div className={styles.sectionGrid}>
              {/* Request Assistance Form */}
              <div className={styles.leftColumn}>
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Request Assistance</h2>
                  <p className={styles.formSubtitle}>
                    Fill in this form to share your requirement. Your request will be reviewed and posted
                    on our community bulletin so local volunteers and partner NGOs can assist.
                  </p>
                  <form onSubmit={handleSubmitRequest} className={styles.form}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="title">
                        What do you need support with? *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="e.g. Weekly Groceries for Elderly Couple, Veterinary Transport"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="category">
                          Care Category *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`input-field ${styles.selectField}`}
                        >
                          <option value="Food & Essentials">Food & Essentials</option>
                          <option value="Medical Care">Medical Care</option>
                          <option value="Education Support">Education Support</option>
                          <option value="Animal Welfare">Animal Welfare</option>
                          <option value="Mental Wellness">Mental Wellness</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label" htmlFor="urgency">
                          Urgency Level *
                        </label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleInputChange}
                          className={`input-field ${styles.selectField}`}
                        >
                          <option value="low">Low (1-3 Days)</option>
                          <option value="medium">Medium (Within 24 Hours)</option>
                          <option value="high">High (Immediate Need)</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label" htmlFor="location">
                        Location / Neighborhood (Jaipur / Rajasthan) *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        placeholder="e.g. Sector 5, Mansarovar, Jaipur"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" htmlFor="description">
                        Describe the Need *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Provide details about what you need, how volunteers can help, and any special instructions..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`input-field ${styles.textareaField}`}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="name">
                          Your Name (Hidden publicly if requested) *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label" htmlFor="contact">
                          Contact Info (Phone / Email) *
                        </label>
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          required
                          placeholder="Phone number or email"
                          value={formData.contact}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
                      Submit Care Request
                    </button>
                  </form>
                </div>
              </div>

              {/* FAQs Section */}
              <div className={styles.rightColumn}>
                <div className={styles.faqSection}>
                  <h2 className={styles.sectionTitle}>
                    <span>💡</span> Frequently Asked Questions
                  </h2>
                  <div className={styles.faqList}>
                    {FAQS.map((faq, index) => (
                      <div key={index} className={styles.faqItem}>
                        <button
                          onClick={() => toggleFaq(index)}
                          className={styles.faqHeader}
                          aria-expanded={openFaqIndex === index}
                        >
                          <span>{faq.question}</span>
                          <span
                            className={`${styles.faqIcon} ${
                              openFaqIndex === index ? styles.faqIconOpen : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        <div
                          className={`${styles.faqContent} ${
                            openFaqIndex === index ? styles.faqContentOpen : ""
                          }`}
                        >
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: GIVE HELP */
            <div className={`${styles.sectionGrid} ${styles.sectionGridFull}`}>
              <div className={styles.leftColumn}>
                <div className={styles.filterRow}>
                  <div className={styles.searchWrapper}>
                    <svg
                      className={styles.searchIcon}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search requests by title, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`input-field ${styles.searchInput}`}
                    />
                  </div>

                  <div className={styles.filterBadges}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`${styles.filterBadge} ${
                          selectedCategory === cat ? styles.filterBadgeActive : ""
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionGrid}>
                  {/* Requests BULLETIN BOARD */}
                  <div className={styles.leftColumn}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: "8px" }}>
                      <span>📋</span> Community Bulletin Board
                    </h2>
                    <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
                      Browse immediate needs submitted directly by citizens in Jaipur. Click &apos;Lend a Hand&apos;
                      to connect and provide direct aid.
                    </p>

                    <div className={styles.requestsGrid}>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((req) => {
                          const catStyles = getCategoryColor(req.category);
                          return (
                            <div key={req.id} className={styles.requestCard}>
                              <div
                                className={styles.cardAccent}
                                style={{ background: catStyles.color }}
                              />
                              <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>{req.icon}</span>
                                <div className={styles.badgeGroup}>
                                  <span
                                    className={styles.categoryTag}
                                    style={{
                                      color: catStyles.color,
                                      background: catStyles.bg,
                                    }}
                                  >
                                    {req.category}
                                  </span>
                                  <span
                                    className={`${styles.urgencyTag} ${
                                      req.urgency === "high"
                                        ? styles.urgencyHigh
                                        : req.urgency === "medium"
                                        ? styles.urgencyMedium
                                        : styles.urgencyLow
                                    }`}
                                  >
                                    {req.urgency} Urgency
                                  </span>
                                </div>
                              </div>

                              <h3 className={styles.cardTitle}>{req.title}</h3>
                              <p className={styles.cardDesc}>{req.description}</p>

                              <div className={styles.cardMeta}>
                                <div className={styles.metaItem}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  <span>{req.location}</span>
                                </div>
                                <div className={styles.metaItem}>
                                  <span>🕒 Posted {req.date}</span>
                                </div>
                              </div>

                              <div className={styles.cardFooter}>
                                <div className={styles.statusWrapper}>
                                  {req.status === "pending" && (
                                    <span className={`${styles.statusLabel} ${styles.statusPending}`}>
                                      🟢 Active Bulletin
                                    </span>
                                  )}
                                  {req.status === "fulfilling" && (
                                    <span className={`${styles.statusLabel} ${styles.statusFulfilling}`}>
                                      🤝 Volunteer Coordinating
                                    </span>
                                  )}
                                  {req.status === "fulfilled" && (
                                    <span className={`${styles.statusLabel} ${styles.statusFulfilled}`}>
                                      ✅ Fulfilled Aid
                                    </span>
                                  )}
                                </div>

                                {req.status === "pending" && (
                                  <button
                                    onClick={() => handleOpenFulfill(req)}
                                    className={`${styles.actionBtn} ${styles.actionBtnFulfill}`}
                                  >
                                    Lend a Hand →
                                  </button>
                                )}
                                {req.status === "fulfilling" && (
                                  <span style={{ fontSize: "0.85rem", color: "var(--color-sky)", fontWeight: "bold" }}>
                                    In Progress
                                  </span>
                                )}
                                {req.status === "fulfilled" && (
                                  <span style={{ fontSize: "0.85rem", color: "var(--color-success)", fontWeight: "bold" }}>
                                    Done
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={styles.emptyState}>
                          <div className={styles.emptyIcon}>🔍</div>
                          <h3 className={styles.emptyTitle}>No matching care requests found</h3>
                          <p>Try searching for a different keyword or selecting another filter category.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Helplines and Urgent support */}
                  <div className={styles.rightColumn}>
                    <div className={styles.helplinesCard}>
                      <h2 className={styles.sectionTitle} style={{ marginBottom: "8px" }}>
                        <span>☎️</span> Immediate Help Services
                      </h2>
                      <p className={styles.formSubtitle} style={{ marginBottom: "20px" }}>
                        For urgent life safety, immediate medical crises, or emergency search-and-rescue, call direct
                        emergency numbers:
                      </p>
                      <div className={styles.helplineList}>
                        {HELPLINES.map((h, i) => (
                          <div key={i} className={styles.helplineItem}>
                            <div className={styles.helplineIcon}>{h.icon}</div>
                            <div className={styles.helplineDetails}>
                              <h3 className={styles.helplineTitle}>{h.title}</h3>
                              <p className={styles.helplineDesc}>{h.desc}</p>
                              <a href={`tel:${h.phone.replace(/\s+/g, "")}`} className={styles.callBtn}>
                                📞 Call {h.phone}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── SUCCESS MODAL FOR CARE REQUEST ─── */}
      {showSuccessModal && (
        <div className={styles.overlay} onClick={() => setShowSuccessModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Request Submitted</h3>
              <button className={styles.closeBtn} onClick={() => setShowSuccessModal(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successModal}>
                <div className={styles.successIcon}>❤️</div>
                <h3 className={styles.successTitle}>Request Submitted Successfully</h3>
                <p className={styles.successText}>
                  Your request has been saved and posted to the community bulletin board. Local volunteers
                  and partner NGOs in your area have been notified and will coordinate to assist you.
                </p>
                <button className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>
                  Go to Bulletin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VOLUNTEER FULFILL FORM MODAL ─── */}
      {selectedFulfillReq && (
        <div className={styles.overlay} onClick={() => setSelectedFulfillReq(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Fulfill Care Request</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedFulfillReq(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitFulfill}>
              <div className={styles.modalBody}>
                <p style={{ marginBottom: "16px", fontSize: "0.95rem", color: "var(--color-warm-brown-light)" }}>
                  You are volunteering to fulfill: <strong>&quot;{selectedFulfillReq.title}&quot;</strong>.
                  Please enter your details so we can connect you directly with the requester.
                </p>

                <div className="input-group" style={{ marginBottom: "16px" }}>
                  <label className="input-label" htmlFor="volunteerName">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="volunteerName"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={fulfillFormData.name}
                    onChange={handleFulfillChange}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="volunteerContact">
                    Your Contact (Phone or Email) *
                  </label>
                  <input
                    type="text"
                    id="volunteerContact"
                    name="contact"
                    required
                    placeholder="Enter your phone or email"
                    value={fulfillFormData.contact}
                    onChange={handleFulfillChange}
                    className="input-field"
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedFulfillReq(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm Fulfill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SUCCESS MODAL FOR FULFILLMENT ─── */}
      {showFulfillSuccess && (
        <div className={styles.overlay} onClick={() => setShowFulfillSuccess(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Thank You!</h3>
              <button className={styles.closeBtn} onClick={() => setShowFulfillSuccess(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successModal}>
                <div className={styles.successIcon}>🤝</div>
                <h3 className={styles.successTitle}>Coordination In Progress</h3>
                <p className={styles.successText}>
                  Thank you for lending a hand! We have marked this request as active under your care.
                  Our team or the requester will contact you soon with coordination details.
                </p>
                <button className="btn btn-primary" onClick={() => setShowFulfillSuccess(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
