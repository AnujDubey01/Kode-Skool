import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

/* ── images ──────────────────────────────────────────────────────────────── */
import logo          from '../Assets/Img/logo.png';
import footerLogo    from '../Assets/Img/footer-logo.png';
import companyLogo   from '../Assets/Img/company-section-logo.png';
import tick          from '../Assets/Img/tick.png';
import whyCard1      from '../Assets/Img/why-card-1.png';
import whyCard2      from '../Assets/Img/why-choose-2.png';
import whyCard3      from '../Assets/Img/why-choose-3.png';
import bigFeature1   from '../Assets/Img/big-feature-1.png';
import bigFeature2   from '../Assets/Img/big-feature-2.png';
import bigFeature3   from '../Assets/Img/big-feature-3.png';
import bigFeature4   from '../Assets/Img/big-feature-4.png';
import heroImg1      from '../Assets/Img/hero-img1.png';
import heroImg2      from '../Assets/Img/heor-img2.png';
import heroImg3      from '../Assets/Img/heror-img3.png';
import downloadSection from '../Assets/Img/download-section.png';

/* ── data ────────────────────────────────────────────────────────────────── */
const heroImages = [heroImg2, heroImg1, heroImg3];

const skills = [
    { icon: 'fa-brands fa-html5',   label: 'HTML'       },
    { icon: 'fa-brands fa-css3',    label: 'CSS'        },
    { icon: 'fa-brands fa-js',      label: 'JavaScript' },
    { icon: 'fa-solid fa-c',        label: 'C Lang'     },
    { icon: 'fa-brands fa-java',    label: 'Java'       },
    { icon: 'fa-brands fa-python',  label: 'Python'     },
    { icon: 'fa-brands fa-node',    label: 'Node.js'    },
    { icon: 'fa-solid fa-database', label: 'Database'   },
];

const whyCards = [
    {
        img: whyCard1,
        title: 'Personalized learning',
        desc: 'Unlock your potential with personalized coding lessons that make learning fun and engaging.',
    },
    {
        img: whyCard2,
        title: 'Trusted content',
        desc: 'Learn coding with content you can trust, made by experts to give you the best and most reliable learning experience.',
    },
    {
        img: whyCard3,
        title: 'Empower teachers',
        desc: 'Give teachers easy-to-use tools that make coding lessons fun and help them inspire students to learn.',
    },
];

const features = [
    {
        img: bigFeature1,
        title: 'Learn with Animated Videos',
        desc: 'Engage with fun and interactive animations that make coding concepts easy to understand and remember.',
        reverse: false,
    },
    {
        img: bigFeature2,
        title: 'Code and create with ease',
        desc: 'Our simple editor helps students from 8th to 12th grade practice and improve their coding skills.',
        reverse: true,
    },
    {
        img: bigFeature3,
        title: 'Master Coding with Our Interactive Editor',
        desc: 'Practice coding easily and improve your skills with our simple and user-friendly editor.',
        reverse: false,
    },
    {
        img: bigFeature4,
        title: 'Assessments, Quizzes, Tests',
        desc: 'Easily launch live assignments, quizzes and tests. Student results are automatically entered in the online gradebook.',
        reverse: true,
    },
];

const faqs = [
    {
        q: 'What age group is the platform designed for?',
        a: 'KodeSkool is designed for school students from grades 8 to 12, typically between 13 and 18 years old. The content is tailored to match their learning pace and curriculum.',
    },
    {
        q: 'How do the video lessons and animations help me learn coding?',
        a: 'Our animated videos break down complex coding concepts into simple, visual stories. Seeing code in action helps you understand the logic and remember it much longer than reading alone.',
    },
    {
        q: 'Do I need any prior coding experience to start?',
        a: 'Not at all! KodeSkool is built for beginners. Every course starts from the basics and gradually builds up your skills step by step.',
    },
    {
        q: 'How do the coding exercises work?',
        a: 'After each lesson you get hands-on exercises inside our in-browser editor. You write, run, and test your code in real time without installing anything.',
    },
    {
        q: 'Can I learn at my own pace?',
        a: 'Yes! All lessons are available on demand. You can pause, rewind, and revisit any topic as many times as you need.',
    },
    {
        q: "Does the platform align with my school's curriculum?",
        a: 'Our courses are mapped to standard school curricula for computer science and IT subjects, making them a perfect supplement to your regular classes.',
    },
    {
        q: 'Are there any quizzes or tests to check my progress?',
        a: 'Yes. Each unit comes with short quizzes, and there are scheduled tests that your teacher can assign to track your progress and provide feedback.',
    },
    {
        q: 'Is there any support if I get stuck or have questions?',
        a: 'You can reach out through the in-app chatbot for instant help, or contact our support team via email. Community forums are coming soon!',
    },
];

/* ════════════════════════════════════════════════════════════════════════════
   HERO CAROUSEL
════════════════════════════════════════════════════════════════════════════ */
function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const next = () => setCurrent(c => (c + 1) % heroImages.length);

    useEffect(() => {
        timerRef.current = setInterval(next, 2500);
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="lp-hero-carousel">
            <div
                className="lp-hero-carousel-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {heroImages.map((src, i) => (
                    <img key={i} src={src} alt={`Hero ${i + 1}`} />
                ))}
            </div>
            <div className="lp-carousel-dots">
                {heroImages.map((_, i) => (
                    <span
                        key={i}
                        className={`lp-dot${current === i ? ' active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   FAQ ITEM
════════════════════════════════════════════════════════════════════════════ */
function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`lp-faq-item${open ? ' open' : ''}`}>
            <div className="lp-faq-question" onClick={() => setOpen(o => !o)}>
                <p>{q}</p>
                <i className="fa-solid fa-plus"></i>
            </div>
            <div className="lp-faq-answer">
                <p>{a}</p>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════════════════════════════════ */
function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const BACKEND = 'http://localhost:5000';

    const goLogin = (tab) => {
        window.location.href = `${BACKEND}/login?tab=${tab}`;
    };

    return (
        <div className="lp-root">

            {/* ── NAVBAR ── */}
            <nav className="lp-nav">
                <div className="lp-nav-logo">
                    <img src={logo} alt="KodeSkool" />
                </div>

                <ul className="lp-nav-links">
                    <li><a href="#skills">Courses</a></li>
                    <li><a href="#features">About Us</a></li>
                    <li><a href="#faq">Contact Us</a></li>
                </ul>

                <div className="lp-nav-actions">
                    <button className="lp-btn-outline" onClick={() => goLogin('signup')}>Sign Up</button>
                    <button className="lp-btn-solid"   onClick={() => goLogin('signin')}>Sign In</button>
                </div>

                {/* Mobile hamburger */}
                <button className="lp-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </nav>

            {/* Mobile nav menu */}
            <div className={`lp-mobile-menu${menuOpen ? ' open' : ''}`}>
                <a href="#skills"   onClick={() => setMenuOpen(false)}>Courses</a>
                <a href="#features" onClick={() => setMenuOpen(false)}>About Us</a>
                <a href="#faq"      onClick={() => setMenuOpen(false)}>Contact Us</a>
                <div className="lp-mobile-menu-btns">
                    <button className="lp-btn-outline" onClick={() => goLogin('signup')}>Sign Up</button>
                    <button className="lp-btn-solid"   onClick={() => goLogin('signin')}>Sign In</button>
                </div>
            </div>

            {/* ── HERO ── */}
            <section className="lp-hero">
                <div className="lp-hero-inner">
                    <div className="lp-hero-text">
                        <h1>Become a coding champ</h1>
                        <p>Engaging Lessons for Future Tech Leaders with us.</p>
                        <button className="lp-btn-cta" onClick={() => goLogin('signup')}>
                            Let's Start
                        </button>
                    </div>
                    <div className="lp-hero-image">
                        <HeroCarousel />
                    </div>
                </div>
            </section>

            {/* ── BANNER STRIP ── */}
            <div className="lp-banner">
                <img src={companyLogo} alt="KodeSkool" />
                <p>KodeSkool Makes Coding Fun For School Students With Interactive Animations.</p>
            </div>

            {/* ── SKILLS ── */}
            <section id="skills" className="lp-skills">
                <div className="lp-skills-inner">
                    <h2>Develop your skills and stand out</h2>
                    <div className="lp-skills-grid">
                        {skills.map((s, i) => (
                            <div className="lp-skill-card" key={i}>
                                <div className="lp-skill-icon">
                                    <i className={s.icon}></i>
                                    <h3>{s.label}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lp-explore-wrap">
                        <button className="lp-explore-btn">Explore</button>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section className="lp-why">
                <h2 className="lp-section-heading">Why Schools choose us?</h2>
                <div className="lp-why-grid">
                    {whyCards.map((c, i) => (
                        <div className="lp-why-card" key={i}>
                            <img className="lp-why-img" src={c.img} alt={c.title} />
                            <div className="lp-why-card-head">
                                <h4>{c.title}</h4>
                                <img src={tick} alt="verified" />
                            </div>
                            <p>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="lp-features">
                <h2 className="lp-section-heading">What KodeSkool is providing?</h2>
                <div className="lp-features-list">
                    {features.map((f, i) => (
                        <div className={`lp-feature-row${f.reverse ? ' reverse' : ''}`} key={i}>
                            <div className="lp-feature-img">
                                <img src={f.img} alt={f.title} />
                            </div>
                            <div className="lp-feature-text">
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="lp-faq">
                <h2 className="lp-section-heading">Frequently Asked Questions</h2>
                <div className="lp-faq-list">
                    {faqs.map((f, i) => (
                        <FaqItem key={i} q={f.q} a={f.a} />
                    ))}
                </div>
            </section>

            {/* ── CTA / START LEARNING ── */}
            <div className="lp-cta">
                <img src={downloadSection} alt="Start Learning" className="lp-cta-img" />
                <div className="lp-cta-overlay">
                    <h2>Start your coding adventure with KodeSkool</h2>
                    <div className="lp-cta-learn-wrap">
                        <button className="lp-cta-learn-btn" onClick={() => goLogin('signup')}>
                            Start Learning
                        </button>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-brand">
                        <img src={footerLogo} alt="KodeSkool" />
                        <p>KodeSkool makes coding fun for school students with interactive animations</p>
                        <div className="lp-footer-socials">
                            <a href="#!" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="#!" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#!" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://www.linkedin.com/company/kode-skool/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="#!" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    <div className="lp-footer-col">
                        <h6>KodeSkool</h6>
                        <a href="#!">C++</a>
                        <a href="#!">Java</a>
                        <a href="#!">JavaScript</a>
                        <a href="#!">Python</a>
                        <a href="#!">SQL</a>
                        <a href="#!">Swift</a>
                    </div>

                    <div className="lp-footer-col">
                        <h6>Legal</h6>
                        <a href="#!">Terms &amp; conditions</a>
                        <a href="#!">Privacy Policy</a>
                    </div>

                    <div className="lp-footer-col">
                        <h6>Company</h6>
                        <a href="#features">About us</a>
                        <a href="#!">Contact us</a>
                        <a href="#faq">FAQ</a>
                    </div>
                </div>

                <hr className="lp-footer-divider" />
                <p className="lp-footer-bottom">© Copyright 2024 KodeSkool. All rights reserved</p>
            </footer>
        </div>
    );
}

export default LandingPage;
