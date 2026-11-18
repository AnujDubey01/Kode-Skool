import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── images ──────────────────────────────────────────────────────────────── */
import logo from '../Assets/Img/logo.png';
import footerLogo from '../Assets/Img/footer-logo.png';
import companyLogo from '../Assets/Img/company-section-logo.png';
import tick from '../Assets/Img/tick.png';
import whyCard1 from '../Assets/Img/why-card-1.png';
import whyCard2 from '../Assets/Img/why-choose-2.png';
import whyCard3 from '../Assets/Img/why-choose-3.png';
import bigFeature1 from '../Assets/Img/big-feature-1.png';
import bigFeature2 from '../Assets/Img/big-feature-2.png';
import bigFeature3 from '../Assets/Img/big-feature-3.png';
import bigFeature4 from '../Assets/Img/big-feature-4.png';
import heroImg1 from '../Assets/Img/hero-img1.png';
import heroImg2 from '../Assets/Img/heor-img2.png';
import heroImg3 from '../Assets/Img/heror-img3.png';
import downloadSection from '../Assets/Img/download-section.png';

/* ── data ────────────────────────────────────────────────────────────────── */
const heroImages = [heroImg2, heroImg1, heroImg3];

const skills = [
    { icon: 'fa-brands fa-html5', label: 'HTML' },
    { icon: 'fa-brands fa-css3', label: 'CSS' },
    { icon: 'fa-brands fa-js', label: 'JavaScript' },
    { icon: 'fa-solid fa-c', label: 'C Lang' },
    { icon: 'fa-brands fa-java', label: 'Java' },
    { icon: 'fa-brands fa-python', label: 'Python' },
    { icon: 'fa-brands fa-node', label: 'Node.js' },
    { icon: 'fa-solid fa-database', label: 'Database' },
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

/* ── HERO CAROUSEL ── */
function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const next = () => setCurrent(c => (c + 1) % heroImages.length);

    useEffect(() => {
        timerRef.current = setInterval(next, 2500);
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] relative overflow-hidden rounded-3xl p-2">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {heroImages.map((src, i) => (
                    <img key={i} src={src} alt={`Hero ${i + 1}`} className="min-w-full w-full max-h-[380px] sm:max-h-[420px] object-contain drop-shadow-2xl" />
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {heroImages.map((_, i) => (
                    <span
                        key={i}
                        className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${current === i ? 'bg-[#404d8d] w-7' : 'bg-[#183b56]/30 w-2'
                            }`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── FAQ ITEM ── */
function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative overflow-hidden border rounded-2xl transition-all duration-200 ${open ? 'border-[#596db5] shadow-[0_4px_18px_rgba(64,77,141,0.12)] bg-slate-50/70' : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}>
            {/* Subtle corner wave for active FAQ item */}
            {open && (
                <div className="absolute -bottom-1 -right-1 w-28 h-16 pointer-events-none opacity-20">
                    <svg viewBox="0 0 120 70" fill="none" className="w-full h-full">
                        <path d="M0,70 C30,50 60,60 90,30 C105,15 115,25 120,10 L120,70 Z" fill="#414D8E" />
                    </svg>
                </div>
            )}
            <div className="flex justify-between items-center p-4 sm:p-5 cursor-pointer gap-3 relative z-10" onClick={() => setOpen(o => !o)}>
                <p className="text-sm sm:text-base font-medium text-[#2a3775] m-0 flex-1 font-mitr">{q}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-blue-100 text-[#404d8d]' : 'bg-slate-100 text-slate-500'}`}>
                    <i className={`fa-solid fa-plus text-xs transition-transform duration-300 ${open ? 'rotate-45' : ''}`}></i>
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out px-4 sm:px-5 relative z-10 ${open ? 'max-h-96 pb-4 sm:pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'
                }`}>
                <p className="text-xs sm:text-sm text-[#485e76] m-0 leading-relaxed font-poppins">{a}</p>
            </div>
        </div>
    );
}

/* ── LANDING PAGE ── */
function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const goLogin = (tab) => {
        navigate(`/login?tab=${tab}`);
    };

    return (
        <div className="font-mitr bg-white overflow-x-hidden min-h-screen text-[#183b56]">
            {/* ── NAVBAR ── */}
            <nav className="absolute top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5 flex flex-row items-center justify-between">
                <div>
                    <img src={logo} alt="KodeSkool" className="w-36 sm:w-44" />
                </div>

                <ul className="hidden md:flex flex-row items-center gap-8 list-none m-0 p-0">
                    <li><a href="#skills" className="text-[#183b56] hover:text-[#2294ed] text-base font-normal transition-colors no-underline">Courses</a></li>
                    <li><a href="#features" className="text-[#183b56] hover:text-[#2294ed] text-base font-normal transition-colors no-underline">About Us</a></li>
                    <li><a href="#faq" className="text-[#183b56] hover:text-[#2294ed] text-base font-normal transition-colors no-underline">Contact Us</a></li>
                </ul>

                <div className="hidden md:flex flex-row gap-3 items-center">
                    <button
                        className="border-2 border-[#183b56] text-[#183b56] hover:border-[#2294ed] hover:text-[#2294ed] bg-white/70 backdrop-blur-sm rounded-xl font-medium px-5 py-2 text-sm sm:text-base cursor-pointer font-mitr transition-colors shadow-2xs"
                        onClick={() => goLogin('signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className="text-white border-none px-6 py-2.5 bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] hover:opacity-90 rounded-xl font-medium text-sm sm:text-base cursor-pointer font-mitr transition-all shadow-md hover:scale-105"
                        onClick={() => goLogin('signin')}
                    >
                        Sign In
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Menu"
                >
                    <span className="w-6 h-0.5 bg-[#183b56] rounded-full"></span>
                    <span className="w-6 h-0.5 bg-[#183b56] rounded-full"></span>
                    <span className="w-6 h-0.5 bg-[#183b56] rounded-full"></span>
                </button>
            </nav>

            {/* Mobile nav menu */}
            <div className={`${menuOpen ? 'flex' : 'hidden'} md:hidden flex-col gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-5 absolute top-20 left-5 right-5 z-50 shadow-xl border border-gray-100`}>
                <a href="#skills" className="text-[#183b56] text-base font-medium py-2 border-b border-gray-100 no-underline" onClick={() => setMenuOpen(false)}>Courses</a>
                <a href="#features" className="text-[#183b56] text-base font-medium py-2 border-b border-gray-100 no-underline" onClick={() => setMenuOpen(false)}>About Us</a>
                <a href="#faq" className="text-[#183b56] text-base font-medium py-2 border-b border-gray-100 no-underline" onClick={() => setMenuOpen(false)}>Contact Us</a>
                <div className="flex gap-3 pt-2">
                    <button
                        className="flex-1 border-2 border-[#183b56] text-[#183b56] rounded-xl font-medium py-2 text-sm font-mitr"
                        onClick={() => goLogin('signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className="flex-1 text-white border-none py-2 bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] rounded-xl font-medium text-sm font-mitr"
                        onClick={() => goLogin('signin')}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* ── HERO SECTION WITH ENHANCED BG EFFECTS ── */}
            <section className="relative min-h-screen bg-gradient-to-br from-[#c9d5ff] via-[#94bcf9] to-[#6eaaf3] flex flex-col justify-between pt-28 px-6 sm:px-12 overflow-hidden">
                {/* Ambient Soft Glow Orbs */}
                <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-300/40 pointer-events-none blur-3xl"></div>
                <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-indigo-400/30 pointer-events-none blur-3xl"></div>
                <div className="absolute bottom-24 left-1/3 w-72 h-72 rounded-full bg-sky-200/50 pointer-events-none blur-2xl"></div>

                {/* Floating Glassmorphism Code Badges / Sparks */}
                <div className="hidden lg:block absolute top-36 left-12 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-2 shadow-lg -rotate-12 animate-pulse pointer-events-none">
                    <span className="font-mono text-xs font-bold text-[#141e46] flex items-center gap-1.5">
                        <i className="fa-brands fa-python text-amber-500"></i> print("Hello World")
                    </span>
                </div>
                <div className="hidden lg:block absolute bottom-36 left-24 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-2 shadow-lg rotate-6 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}>
                    <span className="font-mono text-xs font-bold text-[#141e46] flex items-center gap-1.5">
                        <span className="text-blue-600">&lt;</span>KodeSkool <span className="text-blue-600">/&gt;</span>
                    </span>
                </div>
                <div className="hidden lg:block absolute top-44 right-16 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl px-3.5 py-1.5 shadow-lg rotate-12 animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}>
                    <span className="font-mono text-xs font-bold text-[#141e46] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> const champion = true;
                    </span>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 w-full my-auto pb-8 sm:pb-12">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 px-3.5 py-1 rounded-full text-xs font-semibold text-[#183b56] mb-4 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#1877f2]"></span>
                            <span>#1 Interactive Coding Platform for Schools</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium text-[#183b56] mb-4 leading-tight font-mitr">
                            Become a coding champ
                        </h1>
                        <p className="text-base sm:text-xl text-[#485e76] mb-8 font-mitr">
                            Engaging Lessons for Future Tech Leaders with us.
                        </p>
                        <button
                            className="inline-block text-white border-none px-10 sm:px-14 py-4 bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] hover:opacity-90 rounded-2xl font-semibold text-lg sm:text-xl cursor-pointer font-mitr transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            onClick={() => goLogin('signup')}
                        >
                            Let's Start
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center items-center w-full">
                        <HeroCarousel />
                    </div>
                </div>

                {/* Flowing Organic Wave Bottom Transition to Page */}
                <div className="relative w-full overflow-hidden leading-none z-10">
                    <svg className="relative block w-full h-12 sm:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" fill="#ffffff" opacity="0.6" />
                        <path d="M0,30 C200,110 420,10 600,70 C800,130 1000,30 1200,80 L1200,120 L0,120 Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            {/* ── BANNER STRIP ── */}
            <div className="bg-white shadow-[0_0_24px_rgba(65,77,142,0.16)] border border-slate-100 rounded-2xl max-w-4xl mx-4 sm:mx-auto -mt-8 sm:-mt-10 px-6 sm:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
                <img src={companyLogo} alt="KodeSkool" className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0" />
                <p className="text-sm sm:text-lg text-[#485e76] font-normal m-0 text-center font-mitr">
                    KodeSkool Makes Coding Fun For School Students With Interactive Animations.
                </p>
            </div>

            {/* ── SKILLS SECTION WITH FLUID WAVES & AMBIENT GLOW ── */}
            <section id="skills" className="relative my-16 sm:my-24 px-4 sm:px-10">
                <div className="relative overflow-hidden bg-gradient-to-tr from-[#1a2559] via-[#243572] to-[#2195da] rounded-3xl p-8 sm:p-14 flex flex-col items-center gap-8 max-w-6xl mx-auto shadow-xl">
                    {/* Ambient Glow Orbs (Modern, smooth, no dotmatrix) */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none"></div>

                    {/* Corner decorative wave curves (Inspired by references) */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 pointer-events-none opacity-20">
                        <svg viewBox="0 0 200 200" fill="none">
                            <circle cx="100" cy="100" r="80" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 6" />
                            <circle cx="100" cy="100" r="50" stroke="#ffffff" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-80 h-48 pointer-events-none opacity-25">
                        <svg viewBox="0 0 300 180" fill="none" className="w-full h-full">
                            <path d="M0,180 C80,110 160,150 240,70 C280,30 300,50 300,40 L300,180 Z" fill="rgba(255,255,255,0.25)" />
                            <path d="M60,180 C120,130 200,140 270,90 L300,75 L300,180 Z" fill="rgba(255,255,255,0.3)" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-center">
                        <span className="inline-block text-xs uppercase tracking-widest text-sky-200 font-semibold bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full mb-3 border border-white/15">
                            Comprehensive Curriculum
                        </span>
                        <h2 className="text-2xl sm:text-4xl text-white font-medium m-0 text-center font-mitr">
                            Develop your skills and stand out
                        </h2>
                    </div>

                    <div className="relative z-10 flex flex-row flex-wrap justify-center gap-5 sm:gap-7 w-full">
                        {skills.map((s, i) => (
                            <div className="bg-white rounded-2xl w-32 h-32 sm:w-40 sm:h-40 flex justify-center items-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group" key={i}>
                                <div className="flex flex-col justify-center items-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#2a3775] to-[#2195da] text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                                    <i className={`${s.icon} text-2xl sm:text-3xl mt-1.5`}></i>
                                    <h3 className="text-xs sm:text-sm text-white mt-1.5 font-light text-center font-mitr">{s.label}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('skills');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="relative z-10 inline-flex items-center gap-2.5 px-10 sm:px-12 py-3.5 rounded-full font-mitr text-base sm:text-lg font-bold text-slate-900 bg-white hover:bg-gradient-to-r hover:from-[#404d8d] hover:to-[#169bdf] hover:text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-none cursor-pointer"
                    >
                        <span>Explore All Courses</span>
                        <span className="text-xl">&rarr;</span>
                    </button>
                </div>
            </section>

            {/* ── WHY CHOOSE US (WITH CORNER WAVE CARDS MATCHING REFERENCE) ── */}
            <section className="relative py-12 sm:py-20 px-4 sm:px-10 text-center overflow-hidden">
                {/* Soft pastel ambient background blobs */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-100/50 pointer-events-none blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-100/50 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <span className="inline-block text-xs uppercase tracking-widest text-[#404d8d] font-semibold bg-blue-50 px-3.5 py-1 rounded-full mb-3 border border-blue-200/60">
                        Why KodeSkool
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-medium bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] bg-clip-text text-transparent mb-12 font-mitr block">
                        Why Schools choose us?
                    </h2>
                </div>

                <div className="relative z-10 flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                    {whyCards.map((c, i) => (
                        <div
                            className="relative overflow-hidden flex-1 min-w-[280px] max-w-[340px] bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            key={i}
                        >
                            {/* Decorative corner fluid wave in bottom-right (Matches Reference Images) */}
                            <div className="absolute -bottom-1 -right-1 w-36 h-24 pointer-events-none overflow-hidden z-0">
                                <svg className="w-full h-full" viewBox="0 0 160 100" fill="none" preserveAspectRatio="none">
                                    <path
                                        d="M0,100 C40,70 80,85 120,45 C140,25 155,35 160,20 L160,100 Z"
                                        fill={i === 0 ? 'rgba(56, 189, 248, 0.16)' : i === 1 ? 'rgba(99, 102, 241, 0.16)' : 'rgba(168, 85, 247, 0.16)'}
                                    />
                                    <path
                                        d="M35,100 C75,85 110,88 135,60 C150,42 155,45 160,40 L160,100 Z"
                                        fill={i === 0 ? 'rgba(14, 165, 233, 0.25)' : i === 1 ? 'rgba(79, 70, 229, 0.25)' : 'rgba(147, 51, 234, 0.25)'}
                                    />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <div className="overflow-hidden rounded-2xl mb-5 shadow-sm">
                                    <img className="w-full object-cover max-h-44 group-hover:scale-105 transition-transform duration-300" src={c.img} alt={c.title} />
                                </div>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <h4 className="text-lg font-medium bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] bg-clip-text text-transparent m-0 font-mitr">{c.title}</h4>
                                    <img src={tick} alt="verified" className="h-5" />
                                </div>
                                <p className="text-xs sm:text-sm text-[#485e76] leading-relaxed m-0 font-poppins">{c.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES (WITH ORGANIC FLUID BACKDROP BLOBS) ── */}
            <section id="features" className="relative py-12 sm:py-20 px-4 sm:px-10 text-center overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-blue-100/40 pointer-events-none blur-3xl"></div>
                <div className="absolute bottom-1/3 -left-24 w-96 h-96 rounded-full bg-indigo-100/40 pointer-events-none blur-3xl"></div>

                <div className="relative z-10 mb-14">
                    <span className="inline-block text-xs uppercase tracking-widest text-[#404d8d] font-semibold bg-blue-50 px-3.5 py-1 rounded-full mb-3 border border-blue-200/60">
                        Platform Capabilities
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-medium bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] bg-clip-text text-transparent m-0 font-mitr">
                        What KodeSkool is providing?
                    </h2>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-16 sm:gap-20">
                    {features.map((f, i) => (
                        <div className={`flex flex-col ${f.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-14`} key={i}>
                            {/* Feature Illustration with organic fluid SVG backdrop */}
                            <div className="flex-1 flex justify-center relative">
                                {/* Organic pastel fluid blob behind the illustration */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <svg viewBox="0 0 320 280" className="w-[115%] h-[115%] max-w-[420px] drop-shadow-sm opacity-60">
                                        <defs>
                                            <linearGradient id={`featBlob${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor={i === 0 ? '#dbeafe' : i === 1 ? '#e0e7ff' : i === 2 ? '#dcfce7' : '#fef3c7'} />
                                                <stop offset="100%" stopColor={i === 0 ? '#bfdbfe' : i === 1 ? '#c7d2fe' : i === 2 ? '#bbf7d0' : '#fde68a'} />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M160,25 C230,10 290,60 295,130 C300,200 240,255 170,260 C100,265 30,220 25,150 C20,80 90,40 160,25 Z"
                                            fill={`url(#featBlob${i})`}
                                        />
                                    </svg>
                                </div>
                                <img src={f.img} alt={f.title} className="relative z-10 max-w-[80%] sm:max-w-[70%] md:max-w-[85%] max-h-72 object-contain hover:scale-105 transition-transform duration-300" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                                    <i className="fa-solid fa-sparkles text-xs text-amber-500"></i>
                                    <span>Feature 0{i + 1}</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] bg-clip-text text-transparent mb-3 leading-snug font-mitr">
                                    {f.title}
                                </h3>
                                <p className="text-sm sm:text-base text-[#485e76] leading-relaxed m-0 font-poppins">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ SECTION ── */}
            <section id="faq" className="relative py-12 sm:py-20 px-4 sm:px-10 text-center overflow-hidden">
                <div className="absolute top-1/2 left-10 w-72 h-72 rounded-full bg-blue-100/35 pointer-events-none blur-3xl"></div>
                <div className="relative z-10 mb-10">
                    <span className="inline-block text-xs uppercase tracking-widest text-[#404d8d] font-semibold bg-blue-50 px-3.5 py-1 rounded-full mb-3 border border-blue-200/60">
                        Help & Support
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-medium bg-gradient-to-r from-[#404d8d] via-[#596db5] to-[#169bdf] bg-clip-text text-transparent m-0 font-mitr">
                        Frequently Asked Questions
                    </h2>
                </div>
                <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-3.5 text-left">
                    {faqs.map((f, i) => (
                        <FaqItem key={i} q={f.q} a={f.a} />
                    ))}
                </div>
            </section>

            {/* ── CTA / START LEARNING (WITH GLOWING GRADIENT EFFECT) ── */}
            <div className="relative mx-4 sm:mx-10 mb-16 rounded-3xl overflow-hidden shadow-2xl">
                <img src={downloadSection} alt="Start Learning" className="w-full h-full object-cover block rounded-3xl min-h-[220px] max-h-[360px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center gap-5 text-center p-6">
                    <span className="inline-block text-xs uppercase tracking-widest text-sky-300 font-semibold bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
                        Ready To Begin?
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl text-white font-semibold leading-snug m-0 font-mitr max-w-2xl">
                        Start your coding adventure with KodeSkool
                    </h2>
                    <button
                        type="button"
                        onClick={() => goLogin('signup')}
                        className="inline-flex items-center gap-2.5 px-9 sm:px-11 py-3.5 rounded-full font-mitr text-sm sm:text-base font-bold text-slate-900 bg-white hover:bg-gradient-to-r hover:from-[#404d8d] hover:to-[#169bdf] hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-none cursor-pointer"
                    >
                        <span>Start Learning Now</span>
                        <span className="text-lg">&rarr;</span>
                    </button>
                </div>
            </div>

            {/* ── FOOTER (WITH TOP WAVE CURVE) ── */}
            <footer className="relative bg-[#f8f9fa] rounded-3xl mx-3 sm:mx-6 mb-6 p-8 sm:p-14 overflow-hidden">
                {/* Decorative subtle background wave in footer */}
                <div className="absolute -bottom-4 -right-4 w-72 h-44 pointer-events-none opacity-20">
                    <svg viewBox="0 0 240 140" fill="none" className="w-full h-full">
                        <path d="M0,140 C60,95 120,120 180,60 C210,30 230,40 240,25 L240,140 Z" fill="#414D8E" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-10 mb-10 flex-wrap">
                    <div className="flex-[1.5] min-w-[220px] flex flex-col gap-4">
                        <img src={footerLogo} alt="KodeSkool" className="w-40 sm:w-48" />
                        <p className="text-xs sm:text-sm text-[#6c757d] m-0 leading-relaxed font-poppins">
                            KodeSkool makes coding fun for school students with interactive animations
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <a href="#!" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors" aria-label="Twitter"><i className="fa-brands fa-x-twitter text-base"></i></a>
                            <a href="#!" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram text-base"></i></a>
                            <a href="#!" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook text-base"></i></a>
                            <a href="https://www.linkedin.com/company/kode-skool/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin text-base"></i>
                            </a>
                            <a href="#!" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors" aria-label="YouTube"><i className="fa-brands fa-youtube text-base"></i></a>
                        </div>
                    </div>

                    <div className="flex-1 min-w-[140px] flex flex-col gap-2.5">
                        <h6 className="text-base font-semibold text-[#1a1a2e] mb-1 font-mitr">KodeSkool</h6>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">C++</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Java</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">JavaScript</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Python</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">SQL</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Swift</a>
                    </div>

                    <div className="flex-1 min-w-[140px] flex flex-col gap-2.5">
                        <h6 className="text-base font-semibold text-[#1a1a2e] mb-1 font-mitr">Legal</h6>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Terms &amp; conditions</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Privacy Policy</a>
                    </div>

                    <div className="flex-1 min-w-[140px] flex flex-col gap-2.5">
                        <h6 className="text-base font-semibold text-[#1a1a2e] mb-1 font-mitr">Company</h6>
                        <a href="#features" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">About us</a>
                        <a href="#!" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">Contact us</a>
                        <a href="#faq" className="text-xs sm:text-sm text-[#6c757d] hover:text-[#2294ed] transition-colors no-underline font-poppins">FAQ</a>
                    </div>
                </div>

                <hr className="border-t border-gray-200 mb-6" />
                <p className="text-center text-xs text-[#6c757d] m-0 font-poppins">© Copyright 2024 KodeSkool. All rights reserved</p>
            </footer>
        </div>
    );
}

export default LandingPage;
