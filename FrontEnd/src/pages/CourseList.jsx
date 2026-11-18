import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';
import TechIcon from '../components/common/TechIcon';

const TECH_META = {
    python: {
        category: 'PYTHON',
        badge: 'Core Program',
        rating: '4.8',
        desc: 'Master fundamentals, control structures, and functional scripting with interactive exercises.',
        level: 'Intermediate',
        topics: '8 Topics · 2 Quizzes',
        ide: 'Web IDE Included'
    },
    javascript: {
        category: 'JAVASCRIPT',
        badge: 'Popular Track',
        rating: '4.8',
        desc: 'Modern web scripting, DOM manipulation, asynchronous logic, and hands-on browser projects.',
        level: 'Beginner',
        topics: '10 Topics · 3 Quizzes',
        ide: 'Web IDE Included'
    },
    cpp: {
        category: 'C++',
        badge: 'High Performance',
        rating: '4.8',
        desc: 'Systems programming, pointers, object-oriented paradigms, and competitive problem solving.',
        level: 'Intermediate',
        topics: '7 Topics · 2 Quizzes',
        ide: 'Web IDE Included'
    },
    default: {
        category: 'COURSE',
        badge: 'Core Program',
        rating: '4.8',
        desc: 'Explore, learn, and practice structured programming courses with guided lessons and evaluations.',
        level: 'Beginner',
        topics: '6 Topics · 2 Quizzes',
        ide: 'Web IDE Included'
    }
};

function getMeta(technology = '', name = '') {
    const t = `${technology} ${name}`.toLowerCase();
    if (t.includes('python')) return TECH_META.python;
    if (t.includes('javascript') || t.includes('js')) return TECH_META.javascript;
    if (t.includes('c++') || t.includes('cpp')) return TECH_META.cpp;
    return TECH_META.default;
}

const DEFAULT_COURSES = [
    {
        id: 'python-3',
        name: 'Learn Python 3',
        technology: 'Python',
        category: 'PYTHON',
        badge: 'Core Program',
        rating: '4.8',
        description: 'Master fundamentals, control structures, and functional scripting with interactive exercises.',
        level: 'Intermediate',
        units: 1,
        topics: '8 Topics · 2 Quizzes',
        ide: 'Web IDE Included',
        link: '/Courses/View?course_id=python-3'
    },
    {
        id: 'javascript',
        name: 'Learn JavaScript',
        technology: 'JavaScript',
        category: 'JAVASCRIPT',
        badge: 'Popular Track',
        rating: '4.8',
        description: 'Modern web scripting, DOM manipulation, asynchronous logic, and hands-on browser projects.',
        level: 'Beginner',
        units: 1,
        topics: '10 Topics · 3 Quizzes',
        ide: 'Web IDE Included',
        link: '/Courses/View?course_id=javascript'
    },
    {
        id: 'cpp',
        name: 'Learn C++',
        technology: 'C++',
        category: 'C++',
        badge: 'High Performance',
        rating: '4.8',
        description: 'Systems programming, pointers, object-oriented paradigms, and competitive problem solving.',
        level: 'Intermediate',
        units: 1,
        topics: '7 Topics · 2 Quizzes',
        ide: 'Web IDE Included',
        link: '/Courses/View?course_id=cpp'
    }
];

function CourseList(props) {
    const welcome = useRef(null);
    const search = useRef(null);
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const handleClickOutside = (event) => {
        if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current?.classList.remove('openSearch');
            search.current?.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };

    const openSearchOpt = () => {
        welcome.current?.classList.add('openSearch');
        search.current?.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let tempCourses = [];
                let enrolledList = [];
                try {
                    enrolledList = await courseService.getMyCourses();
                } catch (e) {
                    enrolledList = [];
                }

                if (Array.isArray(enrolledList) && enrolledList.length > 0) {
                    for (const crs of enrolledList) {
                        try {
                            const Course_Details = await courseService.getCourse(crs.Course_ID);
                            if (Course_Details && Course_Details.Course_Name) {
                                const meta = getMeta(Course_Details.Technology, Course_Details.Course_Name);
                                const queryParams = new URLSearchParams({ course_id: crs.Course_ID }).toString();
                                tempCourses.push({
                                    id: crs.Course_ID,
                                    name: Course_Details.Course_Name,
                                    technology: Course_Details.Technology || meta.category,
                                    category: meta.category,
                                    badge: meta.badge,
                                    description: Course_Details.Course_Description || meta.desc,
                                    level: Course_Details.Duration > 20 ? 'Intermediate' : meta.level,
                                    units: Course_Details.Units || 1,
                                    topics: meta.topics,
                                    ide: meta.ide,
                                    rating: Course_Details.Course_Rating || meta.rating,
                                    enrolled: true,
                                    link: `/Courses/View?${queryParams}`
                                });
                            }
                        } catch (err) {
                            console.error("Error fetching course detail:", err);
                        }
                    }
                }

                // If user has no enrollments yet, load the full catalog so they can browse
                if (tempCourses.length === 0) {
                    try {
                        const allCourses = await courseService.getAllCourses();
                        if (Array.isArray(allCourses) && allCourses.length > 0) {
                            tempCourses = allCourses.map(c => {
                                const meta = getMeta(c.Technology, c.Course_Name);
                                return {
                                    id: c._id,
                                    name: c.Course_Name,
                                    technology: c.Technology || meta.category,
                                    category: meta.category,
                                    badge: meta.badge,
                                    description: c.Course_Description || meta.desc,
                                    level: c.Duration > 20 ? 'Intermediate' : meta.level,
                                    units: c.Units || 1,
                                    topics: meta.topics,
                                    ide: meta.ide,
                                    rating: c.Course_Rating || meta.rating,
                                    enrolled: false,
                                    link: `/Courses/View?${new URLSearchParams({ course_id: c._id }).toString()}`
                                };
                            });
                        }
                    } catch (e) {
                        // ignore and use default
                    }
                }

                // If still empty (e.g. freshly created empty database), provide default flagship curriculum
                if (tempCourses.length === 0) {
                    tempCourses = DEFAULT_COURSES;
                }

                setCourses(tempCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setCourses(DEFAULT_COURSES);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const userName = props.user?.name || localStorage.getItem('user_name') || 'Anuj Dubey';

    // Filter Logic
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = !searchQuery ||
                course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (course.technology && course.technology.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (selectedCategory === 'All') return true;
            if (selectedCategory === 'Beginner') return course.level === 'Beginner';
            if (selectedCategory === 'Intermediate') return course.level === 'Intermediate';
            if (selectedCategory === 'Python') return course.technology?.toLowerCase().includes('python');
            if (selectedCategory === 'JavaScript') return course.technology?.toLowerCase().includes('javascript') || course.name.toLowerCase().includes('js');
            if (selectedCategory === 'C++') return course.technology?.toLowerCase().includes('c') || course.name.toLowerCase().includes('c');
            return true;
        });
    }, [courses, searchQuery, selectedCategory]);

    return (
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-8 font-poppins bg-[#f8fafc] dark:bg-zinc-950 relative overflow-hidden">
            {/* Ambient Background Gradient Orbs & Flowing Modern Elements (No dotmatrix) */}
            <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full bg-indigo-100/35 dark:bg-indigo-900/10 blur-3xl pointer-events-none"></div>

            {/* Subtle background curved dashed travel path with loop-the-loop */}
            <div className="absolute bottom-10 right-12 pointer-events-none opacity-20 hidden xl:block">
                <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
                    <path
                        d="M10,95 C45,75 65,70 85,70 C105,70 120,80 115,90 C110,100 90,96 95,84 C100,70 125,60 155,42 C175,30 195,26 210,18"
                        stroke="#93c5fd"
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                    />
                    <circle cx="210" cy="18" r="4" fill="#3b82f6" />
                </svg>
            </div>

            <div className="max-w-[1240px] mx-auto relative z-10">
                {/* ── 1. Top Navigation Bar (Matches Mockup) ── */}
                <div className="flex flex-row justify-between items-center w-full mb-6">
                    {/* Left: Hamburger + Greeting + Student Portal Badge */}
                    <div className="flex flex-row items-center gap-3">
                        <button
                            type="button"
                            className="cursor-pointer text-slate-700 dark:text-gray-200 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border-none bg-transparent"
                            onClick={props.controlNav}
                            title="Toggle Navigation"
                        >
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <div ref={welcome} className="flex flex-col">
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                                    Welcome, <span className="font-extrabold text-slate-900 dark:text-white">{userName}!</span>
                                </h1>
                                <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                    Student Portal
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 m-0 font-medium">
                                Let's master computer science and crack the code
                            </p>
                        </div>
                    </div>

                    {/* Right: Search Pill + Notification Bell + User Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-xs shadow-sm hover:border-blue-400 transition-all">
                            <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2 cursor-pointer text-xs" onClick={openSearchOpt}></i>
                            <input
                                ref={search}
                                type="text"
                                name="search"
                                id="search"
                                className="bg-transparent outline-none w-28 sm:w-44 text-xs text-slate-800 dark:text-gray-100 placeholder-slate-400"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 ml-1 bg-transparent border-none cursor-pointer text-xs"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>

                        {/* Notification Bell with Red Badge */}
                        <div className="relative cursor-pointer text-slate-700 dark:text-gray-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors" title="Notifications">
                            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                5
                            </span>
                            <i className="fa-solid fa-bell text-base text-slate-700 dark:text-slate-200"></i>
                        </div>

                        {/* Cartoon User Avatar (Matches Mockup) */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <circle cx="18" cy="18" r="18" fill="#fef3c7" />
                                <path d="M6,36 C6,27 12,23 18,23 C24,23 30,27 30,36 Z" fill="#2563eb" />
                                <path d="M14,23 L18,27 L22,23 Z" fill="#fb7185" />
                                <circle cx="18" cy="15" r="8" fill="#fcd34d" />
                                <path d="M10,14 C10,9 13.5,6 18,6 C22.5,6 26,9 26,14 C26,13 25,10 22.5,9.5 C20,9 16,9 13.5,9.5 C11,10 10,12 10,14 Z" fill="#1e293b" />
                                <circle cx="15.5" cy="15" r="1.1" fill="#1e293b" />
                                <circle cx="20.5" cy="15" r="1.1" fill="#1e293b" />
                                <path d="M16,18 Q18,20 20,18" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── 2. Catalog Hero Banner (Matches Mockup) ── */}
                <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#142360] via-[#1a3891] to-[#169BDF] text-white p-6 sm:p-8 mb-6 shadow-md">
                    {/* Ambient glow backgrounds */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-400/20 pointer-events-none blur-3xl"></div>
                    <div className="absolute -bottom-16 right-48 w-56 h-56 rounded-full bg-indigo-500/20 pointer-events-none blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xl">
                            {/* Top Badge: Academic Curriculum */}
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 shadow-2xs">
                                <i className="fa-solid fa-book-open text-xs"></i>
                                <span>Academic Curriculum 2024 – 2025</span>
                            </div>

                            {/* Title with decorative burst spark */}
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight flex items-center gap-3">
                                <span>All Courses Catalog</span>
                                {/* Cyan burst rays (\ | /) */}
                                <svg className="w-5 h-5 text-sky-300 shrink-0 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="3" x2="12" y2="7" />
                                    <line x1="4.5" y1="6.5" x2="7.5" y2="9.5" />
                                    <line x1="19.5" y1="6.5" x2="16.5" y2="9.5" />
                                </svg>
                            </h2>

                            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed m-0 max-w-lg">
                                Explore, learn, and practice structured programming courses with guided lessons, interactive browser compilers, and structured evaluations.
                            </p>
                        </div>

                        {/* Right side: 3D Browser IDE + Mortarboard + Desk Books Artwork */}
                        <div className="hidden md:flex items-center justify-center shrink-0 relative w-64 sm:w-72 h-36 sm:h-40">
                            <svg viewBox="0 0 260 150" className="w-full h-full drop-shadow-xl" fill="none">
                                <defs>
                                    <linearGradient id="ideHeaderGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#1e293b" />
                                        <stop offset="100%" stopColor="#334155" />
                                    </linearGradient>
                                    <linearGradient id="ideBodyGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0f172a" />
                                        <stop offset="100%" stopColor="#1e293b" />
                                    </linearGradient>
                                    <linearGradient id="bookPurple" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#7e22ce" />
                                    </linearGradient>
                                    <linearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="#0284c7" />
                                    </linearGradient>
                                    <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#4338ca" />
                                    </linearGradient>
                                </defs>

                                {/* Yellow and Cyan floating spark stars */}
                                <g fill="#fde047">
                                    <polygon points="35,30 37,36 43,38 37,40 35,46 33,40 27,38 33,36" />
                                    <polygon points="230,20 231.5,24 235.5,25.5 231.5,27 230,31 228.5,27 224.5,25.5 228.5,24" />
                                </g>
                                <circle cx="240" cy="55" r="2" fill="#38bdf8" />

                                {/* 3D Browser IDE Window */}
                                <g transform="translate(45, 25)">
                                    <rect width="140" height="92" rx="8" fill="url(#ideBodyGrad)" stroke="#475569" strokeWidth="1.5" />
                                    {/* Header bar */}
                                    <rect width="140" height="18" rx="8" fill="url(#ideHeaderGrad)" />
                                    <rect y="12" width="140" height="6" fill="url(#ideHeaderGrad)" />
                                    {/* Window dots */}
                                    <circle cx="12" cy="9" r="3" fill="#ef4444" />
                                    <circle cx="20" cy="9" r="3" fill="#f59e0b" />
                                    <circle cx="28" cy="9" r="3" fill="#10b981" />
                                    {/* Code lines inside window */}
                                    <rect x="14" y="28" width="55" height="4" rx="2" fill="#f59e0b" opacity="0.9" />
                                    <rect x="74" y="28" width="30" height="4" rx="2" fill="#38bdf8" opacity="0.9" />
                                    <rect x="14" y="38" width="35" height="4" rx="2" fill="#a855f7" opacity="0.8" />
                                    <rect x="54" y="38" width="50" height="4" rx="2" fill="#e2e8f0" opacity="0.7" />
                                    <rect x="14" y="48" width="70" height="4" rx="2" fill="#38bdf8" opacity="0.85" />
                                    <rect x="14" y="58" width="45" height="4" rx="2" fill="#10b981" opacity="0.75" />
                                </g>

                                {/* 3D Mortarboard Cap resting on top-right of window */}
                                <g transform="translate(165, 8)">
                                    {/* Cap Diamond */}
                                    <polygon points="35,8 65,2 35,-4 5,2" fill="#0f172a" />
                                    <polygon points="35,8 65,2 62,6 35,11" fill="#1e293b" />
                                    <polygon points="35,8 5,2 8,6 35,11" fill="#334155" />
                                    {/* Cap Skull Cap below */}
                                    <ellipse cx="35" cy="11" rx="14" ry="5" fill="#0f172a" />
                                    {/* Golden Button & Tassel */}
                                    <circle cx="35" cy="2" r="2.5" fill="#f59e0b" />
                                    <path d="M35,2 C44,5 50,14 50,22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" />
                                    <rect x="47.5" y="22" width="5" height="7" rx="1.5" fill="#f59e0b" />
                                </g>

                                {/* Plant Leaves on Left */}
                                <g transform="translate(30, 80)">
                                    <path d="M12,40 C10,25 2,15 -4,8 C6,14 14,24 14,40 Z" fill="#22c55e" />
                                    <path d="M14,40 C16,22 26,14 34,10 C26,18 20,28 16,40 Z" fill="#16a34a" />
                                    <path d="M13,40 C12,18 10,8 12,0 C15,8 16,18 15,40 Z" fill="#4ade80" />
                                </g>

                                {/* Stack of 2 Books on Right */}
                                <g transform="translate(185, 95)">
                                    {/* Bottom Book (Blue) */}
                                    <rect x="0" y="16" width="48" height="11" rx="2.5" fill="url(#bookBlue)" />
                                    <rect x="2" y="18" width="44" height="2" fill="#ffffff" opacity="0.9" />
                                    {/* Top Book (Purple) */}
                                    <rect x="2" y="4" width="44" height="11" rx="2.5" fill="url(#bookPurple)" />
                                    <rect x="4" y="6" width="40" height="2" fill="#ffffff" opacity="0.9" />
                                </g>

                                {/* Floating Foreground Badge with < / > */}
                                <g transform="translate(125, 98)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.35))">
                                    <rect width="36" height="26" rx="8" fill="url(#badgeGrad)" stroke="#818cf8" strokeWidth="1.5" />
                                    <text x="18" y="17" fill="#ffffff" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── 3. Category Filter Pills (Matches Mockup) ── */}
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-6">
                    {[
                        { id: 'All', label: 'All Courses' },
                        { id: 'Beginner', label: 'Beginner Friendly', icon: 'fa-solid fa-seedling text-emerald-500' },
                        { id: 'Intermediate', label: 'Intermediate', icon: 'fa-solid fa-signal text-blue-500' },
                        { id: 'Python', label: 'Python', icon: 'fa-brands fa-python text-amber-500' },
                        { id: 'JavaScript', label: 'JavaScript', customIcon: 'js' },
                        { id: 'C++', label: 'C++', customIcon: 'cpp' },
                    ].map(cat => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${isActive
                                    ? 'bg-[#1877f2] text-white border-transparent shadow-sm'
                                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs'
                                    }`}
                            >
                                {cat.icon && <i className={`${cat.icon} text-xs`}></i>}
                                {cat.customIcon === 'js' && (
                                    <span className="w-4 h-4 rounded bg-[#f7df1e] text-black font-black text-[9px] flex items-center justify-center shrink-0">
                                        JS
                                    </span>
                                )}
                                {cat.customIcon === 'cpp' && (
                                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-zinc-300">
                                        &lt;/&gt;
                                    </span>
                                )}
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── 4. Courses Grid & Explorer Card (2x2 Layout Matches Mockup) ── */}
                {loading ? (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1877f2] rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Loading courses catalog...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-md mx-auto my-10 shadow-sm">
                        <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center mx-auto text-blue-500 text-2xl mb-3">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No courses found</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">No results matching "{searchQuery}" in {selectedCategory}.</p>
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-gray-200 hover:bg-slate-200 transition-colors border-none cursor-pointer"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
                        {filteredCourses.map((course) => {
                            const meta = getMeta(course.technology, course.name);
                            const categoryName = course.category || meta.category;
                            const badgeText = course.badge || meta.badge;
                            const ratingVal = course.rating || meta.rating;
                            const descText = course.description || meta.desc;
                            const topicsText = course.topics || meta.topics;

                            return (
                                <div
                                    key={course.id}
                                    className="group bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5"
                                >
                                    <div>
                                        {/* Top Row: Tech Icon + Category + Badge + Rating */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 min-w-0">
                                                {/* Tech Icon Container */}
                                                <div className="shrink-0">
                                                    <TechIcon technology={course.technology} name={course.name} size={54} />
                                                </div>

                                                {/* Title & Category Tags */}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-blue-600 uppercase">
                                                            {categoryName}
                                                        </span>
                                                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                                            {badgeText}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate mt-1 m-0">
                                                        {course.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Rating on Top-Right */}
                                            <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                                                <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                                                <span>{ratingVal}</span>
                                            </div>
                                        </div>

                                        {/* Course Description */}
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-2.5 mb-4 line-clamp-2">
                                            {descText}
                                        </p>

                                        {/* 3 Metadata Badges */}
                                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                                            {/* Level */}
                                            <div className="flex items-center gap-1.5">
                                                {course.level === 'Intermediate' ? (
                                                    <i className="fa-solid fa-signal text-blue-500 text-xs"></i>
                                                ) : (
                                                    <i className="fa-solid fa-seedling text-emerald-500 text-xs"></i>
                                                )}
                                                <span>{course.level}</span>
                                            </div>

                                            {/* Units & Topics */}
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-graduation-cap text-blue-500 text-xs"></i>
                                                <span>{course.units || 1} Unit ({topicsText})</span>
                                            </div>

                                            {/* Web IDE */}
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-regular fa-window-maximize text-blue-500 text-xs"></i>
                                                <span>Web IDE Included</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Footer Row: Self-paced Check + Start Learning Button */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                                            <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                                            <span>Self-paced · Certified</span>
                                        </div>

                                        <Link
                                            to={course.link}
                                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#1877f2] hover:bg-[#1565c0] shadow-sm hover:shadow hover:scale-105 transition-all no-underline"
                                        >
                                            <span>Start Learning</span>
                                            <span className="text-xs">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {/* ── Card 4: Special Course Explorer (3D Rocket Card Matches Mockup) ── */}
                        <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Decorative pastel wave curves in bottom-right corner (Matches Reference) */}
                            <div className="absolute -bottom-1 -right-1 w-48 sm:w-60 h-28 sm:h-36 pointer-events-none overflow-hidden z-0">
                                <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="expWave1" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.65" />
                                        </linearGradient>
                                        <linearGradient id="expWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
                                        </linearGradient>
                                    </defs>
                                    {/* Back lighter wave */}
                                    <path
                                        d="M0,120 C50,85 100,105 150,55 C175,30 190,40 200,25 L200,120 Z"
                                        fill="url(#expWave1)"
                                    />
                                    {/* Front wave crest */}
                                    <path
                                        d="M45,120 C95,100 135,105 170,70 C188,52 195,50 200,45 L200,120 Z"
                                        fill="url(#expWave2)"
                                    />
                                </svg>
                            </div>

                            {/* Left Side: 3D Rocket Blast-off Illustration */}
                            <div className="w-40 sm:w-44 h-36 shrink-0 flex items-center justify-center relative z-10">
                                <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-md" fill="none">
                                    <defs>
                                        <linearGradient id="rocketBodyGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="50%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#4338ca" />
                                        </linearGradient>
                                        <linearGradient id="rocketFlameGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="60%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#e2e8f0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Sparkle Stars */}
                                    <polygon points="30,35 32,39 36,41 32,43 30,47 28,43 24,41 28,39" fill="#fbbf24" />
                                    <polygon points="135,28 136.5,31 140,32.5 136.5,34 135,37 133.5,34 130,32.5 133.5,31" fill="#fbbf24" />
                                    <polygon points="120,70 121,72 124,73 121,74 120,76 119,74 116,73 119,72" fill="#fbbf24" />

                                    {/* Cumulus Puffy Smoke Cloud at Base */}
                                    <ellipse cx="80" cy="120" rx="36" ry="14" fill="url(#cloudGrad)" />
                                    <ellipse cx="56" cy="116" rx="22" ry="15" fill="url(#cloudGrad)" />
                                    <ellipse cx="104" cy="116" rx="22" ry="15" fill="url(#cloudGrad)" />
                                    <ellipse cx="80" cy="108" rx="26" ry="16" fill="#ffffff" />

                                    {/* Exhaust Jet Flame */}
                                    <path
                                        d="M72,88 Q80,105 80,118 Q80,105 88,88 Z"
                                        fill="url(#rocketFlameGrad)"
                                    />
                                    <path
                                        d="M75,88 Q80,100 80,110 Q80,100 85,88 Z"
                                        fill="#fef08a"
                                    />

                                    {/* Rocket Body pointing diagonally */}
                                    <g transform="translate(80, 52) rotate(-35)">
                                        {/* Left Fin */}
                                        <path d="M-12,18 L-22,34 L-12,32 Z" fill="#c7d2fe" />
                                        {/* Right Fin */}
                                        <path d="M12,18 L22,34 L12,32 Z" fill="#a5b4fc" />
                                        {/* Main Fuselage */}
                                        <path
                                            d="M0,-28 C14,-10 14,20 12,30 L-12,30 C-14,20 -14,-10 0,-28 Z"
                                            fill="url(#rocketBodyGrad)"
                                        />
                                        {/* White Nose Cone */}
                                        <path
                                            d="M0,-28 C6,-20 8,-12 8,-8 L-8,-8 C-8,-12 -6,-20 0,-28 Z"
                                            fill="#ffffff"
                                        />
                                        {/* Porthole Window */}
                                        <circle cx="0" cy="4" r="6" fill="#e0e7ff" />
                                        <circle cx="0" cy="4" r="4.5" fill="#38bdf8" />
                                        <ellipse cx="-1.5" cy="2.5" rx="1.5" ry="2" fill="#ffffff" opacity="0.8" />
                                        {/* Center Fin */}
                                        <path d="M0,15 L0,32 L2,32 L2,15 Z" fill="#4338ca" />
                                    </g>
                                </svg>
                            </div>

                            {/* Right Side: Explorer Details with Left Border Divider */}
                            <div className="w-full md:border-l md:border-slate-200/80 md:dark:border-zinc-800 md:pl-6 flex flex-col justify-between relative z-10">
                                <div>
                                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-blue-600 uppercase block">
                                        COURSE EXPLORER
                                    </span>
                                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 mb-1 m-0">
                                        Many More Options to Explore
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed m-0">
                                        Data Structures, Web Development, Java & SQL learning tracks are currently in development.
                                    </p>
                                </div>

                                {/* Learning Track Tags */}
                                <div className="flex flex-wrap gap-2 my-3">
                                    {['Data Structures', 'Full-Stack Web', 'SQL Database', 'Java OOP'].map(tag => (
                                        <span
                                            key={tag}
                                            className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-slate-200/80 dark:border-zinc-700 shadow-2xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Request a Track Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => alert("New curriculums will be rolled out soon! Stay tuned to your student portal.")}
                                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-[#1d4ed8] bg-[#dbeafe] hover:bg-[#bfdbfe] border border-blue-200 transition-all cursor-pointer shadow-2xs hover:scale-105"
                                    >
                                        <i className="fa-solid fa-bell text-xs"></i>
                                        <span>Request a Track</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Learning Milestone & Progress Roadmap Banner ── */}
                <div className="relative overflow-hidden mt-8 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-sky-50/80 dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-800/80 border border-blue-100/90 dark:border-zinc-800 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
                    {/* Decorative subtle fluid wave in corner */}
                    <div className="absolute -bottom-1 -right-1 w-48 h-28 pointer-events-none opacity-40">
                        <svg viewBox="0 0 180 90" fill="none" className="w-full h-full">
                            <path d="M0,90 C45,60 90,70 135,35 C155,18 168,28 180,12 L180,90 Z" fill="url(#waveGradMilestone)" />
                            <defs>
                                <linearGradient id="waveGradMilestone" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#414D8E" />
                                    <stop offset="100%" stopColor="#169BDF" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#414D8E] to-[#169BDF] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white m-0">
                                Ready for your next certification milestone?
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 m-0 leading-relaxed">
                                Complete all unit modules, practice live coding in the in-browser IDE, and track your verified certificates.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 shrink-0 flex items-center gap-3">
                        <Link
                            to="/Profile"
                            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#414D8E] to-[#169BDF] hover:opacity-95 shadow-sm hover:shadow hover:scale-105 transition-all no-underline inline-flex items-center gap-2"
                        >
                            <span>View My Profile</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseList;
