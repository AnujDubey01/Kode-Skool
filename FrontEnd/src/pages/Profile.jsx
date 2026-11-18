import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import userService from '../services/userService';
import courseService from '../services/courseService';

function getInitials(name = '') {
    if (!name) return 'AD';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile(props) {
    const [profile, setProfile] = useState(null);
    const [coursesCount, setCoursesCount] = useState(3);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'academic' | 'achievements' | 'activity'
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const welcome = useRef(null);
    const search = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current?.classList.remove('openSearch');
            search.current?.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const openSearchOpt = () => {
        welcome.current?.classList.add('openSearch');
        search.current?.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    };

    /* load profile and enrolled courses */
    useEffect(() => {
        const load = async () => {
            try {
                const [data, myCourses] = await Promise.allSettled([
                    userService.getProfile(),
                    courseService.getMyCourses()
                ]);

                if (myCourses.status === 'fulfilled' && Array.isArray(myCourses.value) && myCourses.value.length > 0) {
                    setCoursesCount(myCourses.value.length);
                }

                if (data.status === 'fulfilled' && data.value && data.value.Name) {
                    const prof = data.value;
                    setProfile(prof);
                    localStorage.setItem('user_name', prof.Name);

                    const sh = prof.Social_Handles || [];
                    const getHandle = (name) => sh.find(h => h.handle_name === name)?.handle_link || '';

                    setForm({
                        name: prof.Name || '',
                        phone: prof.Phone || '',
                        dob: prof.DOB ? prof.DOB.split('T')[0] : '',
                        gender: prof.Gender || '',
                        street: prof.Address?.street || '',
                        city: prof.Address?.city || 'Delhi',
                        state: prof.Address?.state || 'Delhi',
                        country: prof.Address?.country || 'India',
                        pin: prof.Address?.pin || '110001',
                        university_type: prof.Education?.university_type || 'School',
                        school_clg_name: prof.Education?.school_clg_name || 'Kode-Skool Academy',
                        class_year: prof.Education?.class_year || 'Class 10 — 12',
                        linkedin: getHandle('linkedin'),
                        github: getHandle('github'),
                        codechef: getHandle('codechef'),
                        instagram: getHandle('instagram'),
                    });
                } else {
                    setError('Failed to load profile.');
                }
            } catch {
                setError('Could not reach the server.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openEdit = () => {
        setEditMode(true);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const res = await userService.updateProfile(form);
            if (res.success) {
                const fresh = await userService.getProfile();
                setProfile(fresh);
                if (fresh && fresh.Name) {
                    localStorage.setItem('user_name', fresh.Name);
                }
                setEditMode(false);
                showToast('Profile updated successfully!', 'success');
            } else {
                showToast(res.msg || 'Update failed.', 'error');
            }
        } catch {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        if (profile) {
            const sh = profile.Social_Handles || [];
            const getHandle = (name) => sh.find(h => h.handle_name === name)?.handle_link || '';
            setForm({
                name: profile.Name || '',
                phone: profile.Phone || '',
                dob: profile.DOB ? profile.DOB.split('T')[0] : '',
                gender: profile.Gender || '',
                street: profile.Address?.street || '',
                city: profile.Address?.city || 'Delhi',
                state: profile.Address?.state || 'Delhi',
                country: profile.Address?.country || 'India',
                pin: profile.Address?.pin || '110001',
                university_type: profile.Education?.university_type || 'School',
                school_clg_name: profile.Education?.school_clg_name || 'Kode-Skool Academy',
                class_year: profile.Education?.class_year || 'Class 10 — 12',
                linkedin: getHandle('linkedin'),
                github: getHandle('github'),
                codechef: getHandle('codechef'),
                instagram: getHandle('instagram'),
            });
        }
    };

    const getHandle = (name) =>
        (profile?.Social_Handles || []).find(h => h.handle_name === name)?.handle_link || form[name] || '';

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Calculate Dynamic Profile Completeness Percentage
    const profileCompleteness = useMemo(() => {
        let score = 25; // Base registered student
        if (form.name || profile?.Name) score += 15;
        if (form.city || profile?.Address?.city) score += 15;
        if (form.school_clg_name || profile?.Education?.school_clg_name) score += 15;
        if (form.phone) score += 10;
        if (form.dob) score += 10;
        if (form.gender) score += 5;
        if (form.linkedin || form.github) score += 5;
        return Math.min(score, 100);
    }, [form, profile]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-[#5D74BD] rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading student profile…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-center p-6">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mb-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to connect</h3>
                <p className="text-sm text-red-600 dark:text-red-400 max-w-sm">{error}</p>
            </div>
        );
    }

    const displayName = profile?.Name || form.name || 'Anuj Dubey';
    const displayEmail = profile?.Email || 'student@kodeskool.com';
    const userInitials = getInitials(displayName);

    // SVG stroke calculations for 75% circle
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (profileCompleteness / 100) * circumference;

    return (
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-8 font-poppins bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors relative overflow-hidden">
            {/* Ambient Background Gradient Orbs (Modern, subtle, no dotmatrix) */}
            <div className="absolute top-60 -right-20 w-96 h-96 rounded-full bg-blue-100/35 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full bg-indigo-100/30 dark:bg-indigo-900/10 blur-3xl pointer-events-none"></div>

            {/* Subtle floating background code brackets in margins */}
            <div className="absolute bottom-32 right-12 pointer-events-none opacity-20 hidden lg:block">
                <span className="font-mono text-4xl font-extrabold text-[#414D8E] select-none">&lt; / &gt;</span>
            </div>
            <div className="absolute top-96 left-8 pointer-events-none opacity-15 hidden lg:block">
                <span className="font-mono text-3xl font-extrabold text-[#169BDF] select-none">&#123; &#125;</span>
            </div>

            <div className="max-w-[1240px] mx-auto relative z-10">
                {/* ── 1. Top Navbar Header ── */}
                <div className="flex flex-row justify-between items-center w-full mb-6">
                    <div className="flex flex-row items-center gap-3.5">
                        <button
                            type="button"
                            className="cursor-pointer text-xl text-gray-700 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border-none bg-transparent"
                            onClick={props.controlNav}
                            title="Toggle Navigation"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div ref={welcome} className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">
                                My Profile
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Manage your account details and learning progress
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search with Ctrl+K shortcut pill */}
                        <div className="hidden sm:flex items-center px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-xs shadow-sm hover:border-[#5D74BD] transition-all cursor-pointer" onClick={openSearchOpt}>
                            <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2.5"></i>
                            <input
                                ref={search}
                                type="text"
                                placeholder="Search anything..."
                                className="bg-transparent outline-none w-32 md:w-48 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                            />
                            <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700 text-[10px] font-semibold text-slate-500 dark:text-slate-300 border border-slate-200/80 dark:border-zinc-600">
                                Ctrl + K
                            </span>
                        </div>

                        {/* Notification Bell Badge */}
                        <div className="relative cursor-pointer w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-sm shadow-md hover:bg-slate-800 transition-colors" title="Notifications">
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">5</span>
                            <i className="fa-solid fa-bell"></i>
                        </div>

                        {/* Avatar Icon */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-sm shrink-0 cursor-pointer overflow-hidden">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                                {userInitials}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. Hero Banner (Exact Replica in Kode-Skool Theme) ── */}
                <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#141e46] via-[#243572] to-[#169BDF] text-white p-6 sm:p-8 md:p-9 mb-6 shadow-xl">
                    {/* Subtle Ambient Radial Lighting */}
                    <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Left: User Identity Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 min-w-0">
                            {/* Avatar with Double Ring & Status Dot */}
                            <div className="relative shrink-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-white/35 via-white/15 to-white/5 border-2 border-white/80 p-1 flex items-center justify-center shadow-2xl backdrop-blur-md">
                                    <div className="w-full h-full rounded-full bg-[#1e2b58]/80 flex items-center justify-center border border-white/40">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
                                            {userInitials}
                                        </span>
                                    </div>
                                </div>
                                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-[#141e46] rounded-full shadow-sm" title="Active"></span>
                            </div>

                            {/* Name + Badges */}
                            <div className="text-center sm:text-left min-w-0">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white m-0 tracking-tight truncate">
                                        {displayName}
                                    </h2>
                                    <span className="w-5 h-5 rounded-full bg-[#169BDF] flex items-center justify-center text-[10px] text-white shadow-sm" title="Verified Account">
                                        <i className="fa-solid fa-check"></i>
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-blue-100/90 mb-3 font-normal">
                                    {displayEmail}
                                </p>

                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        <i className="fa-solid fa-graduation-cap text-sky-200 text-xs"></i> Student
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        <i className="fa-solid fa-school text-sky-200 text-xs"></i>
                                        {form.university_type || profile?.Education?.university_type || 'School'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        <i className="fa-solid fa-location-dot text-rose-300 text-xs"></i>
                                        {form.city || profile?.Address?.city || 'Delhi'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        <i className="fa-solid fa-star text-amber-300 text-xs"></i> Kodeskool Scholar
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Center: 3D Coding Desk Artwork Representation (Shifted upper-left and visible on md+) */}
                        <div className="hidden md:flex items-center justify-center relative w-56 sm:w-64 h-32 shrink-0 -translate-y-2 -translate-x-3">
                            <svg viewBox="0 0 240 130" className="w-full h-full drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="laptopGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#1e293b" />
                                        <stop offset="100%" stopColor="#0f172a" />
                                    </linearGradient>
                                    <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1e3a8a" />
                                        <stop offset="100%" stopColor="#0284c7" />
                                    </linearGradient>
                                    <linearGradient id="deskGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                                        <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                                    </linearGradient>
                                </defs>

                                {/* Desk surface */}
                                <ellipse cx="120" cy="115" rx="90" ry="12" fill="url(#deskGrad)" />

                                {/* Laptop Screen */}
                                <rect x="75" y="25" width="90" height="60" rx="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2.5" />
                                <rect x="80" y="30" width="80" height="50" rx="3" fill="url(#screenGrad)" />
                                {/* Code symbol on screen */}
                                <text x="120" y="62" fill="#ffffff" fontFamily="monospace" fontSize="22" fontWeight="bold" textAnchor="middle">&lt; / &gt;</text>

                                {/* Laptop Base */}
                                <polygon points="62,90 178,90 168,98 72,98" fill="#94a3b8" />
                                <rect x="105" y="90" width="30" height="3" rx="1.5" fill="#64748b" />

                                {/* Potted Plant */}
                                <ellipse cx="48" cy="100" rx="8" ry="4" fill="#64748b" />
                                <polygon points="42,100 54,100 52,112 44,112" fill="#e2e8f0" />
                                <circle cx="48" cy="92" r="6" fill="#10b981" />
                                <circle cx="45" cy="88" r="4" fill="#34d399" />
                                <circle cx="51" cy="88" r="4" fill="#059669" />

                                {/* Stack of Books */}
                                <rect x="180" y="98" width="30" height="6" rx="2" fill="#f43f5e" />
                                <rect x="182" y="91" width="28" height="6" rx="2" fill="#0284c7" />
                                <rect x="181" y="84" width="29" height="6" rx="2" fill="#fbbf24" />

                                {/* Floating code tags */}
                                <g opacity="0.9" transform="translate(185, 30)">
                                    <rect width="32" height="18" rx="6" fill="#8b5cf6" />
                                    <text x="16" y="13" fill="#ffffff" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                                </g>
                            </svg>
                        </div>

                        {/* Right: Edit Button + 3 Stats with Dividers */}
                        <div className="flex flex-col items-center sm:items-end gap-5 shrink-0 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => openEdit('all')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-800 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-none"
                            >
                                <i className="fa-solid fa-pen text-[11px] text-[#414D8E]"></i>
                                <span>Edit Profile</span>
                            </button>

                            {/* 3 Metric Cards with Vertical Dividers */}
                            <div className="flex items-center divide-x divide-white/20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-3 py-2 shadow-sm w-full sm:w-auto justify-around">
                                <div className="flex flex-col items-center px-4">
                                    <i className="fa-solid fa-graduation-cap text-sky-200 text-sm mb-1"></i>
                                    <span className="text-base sm:text-lg font-extrabold text-white">{coursesCount}</span>
                                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Courses</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <i className="fa-solid fa-file-pen text-sky-200 text-sm mb-1"></i>
                                    <span className="text-base sm:text-lg font-extrabold text-white">0</span>
                                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Tests</span>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <i className="fa-solid fa-certificate text-sky-200 text-sm mb-1"></i>
                                    <span className="text-base sm:text-lg font-extrabold text-white">1</span>
                                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Certificate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3. Profile Completion + 5 Stats Cards Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                    {/* Profile Completion Box (Matches Mockup) */}
                    <div className="lg:col-span-4 bg-gradient-to-r from-cyan-50/70 via-blue-50/50 to-indigo-50/40 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-800/80 border border-cyan-100 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
                        {/* Circular Radial Gauge */}
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <defs>
                                    <linearGradient id="compGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke="#e2e8f0"
                                    strokeWidth="5.5"
                                    fill="transparent"
                                    className="dark:stroke-zinc-800"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke="url(#compGradient)"
                                    strokeWidth="5.5"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    className="transition-all duration-700 ease-out"
                                />
                            </svg>
                            <span className="absolute text-xs font-bold text-slate-800 dark:text-white">
                                {profileCompleteness}%
                            </span>
                        </div>

                        {/* Completion Info */}
                        <div className="min-w-0 flex-grow">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                                Profile Completion
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                Complete your profile to unlock personalized learning.
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            type="button"
                            onClick={() => openEdit('all')}
                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-[#414D8E] dark:text-sky-300 bg-white/90 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
                        >
                            Complete Profile &rarr;
                        </button>
                    </div>

                    {/* 5 Stats Cards (Matches Mockup) */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* Card 1: Completed Courses */}
                        <div className="bg-[#f0f6ff]/90 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                                    <i className="fa-solid fa-book-bookmark"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 leading-tight">
                                    Completed Courses
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 ml-1">
                                0
                            </span>
                        </div>

                        {/* Card 2: Overall Average */}
                        <div className="bg-[#f0fdf4]/90 dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                                    <i className="fa-solid fa-rotate"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 leading-tight">
                                    Overall Average
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 ml-1">
                                0%
                            </span>
                        </div>

                        {/* Card 3: Badges Earned */}
                        <div className="bg-[#faf5ff]/90 dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">
                                    <i className="fa-solid fa-certificate"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 leading-tight">
                                    Badges Earned
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 ml-1">
                                1
                            </span>
                        </div>

                        {/* Card 4: Certificates */}
                        <div className="bg-[#fffbeb]/90 dark:bg-zinc-900 border border-amber-100 dark:border-zinc-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                                    <i className="fa-solid fa-file-invoice"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 leading-tight">
                                    Certificates
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 ml-1">
                                0
                            </span>
                        </div>

                        {/* Card 5: Day Streak */}
                        <div className="bg-[#fff1f2]/90 dark:bg-zinc-900 border border-rose-100 dark:border-zinc-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center text-xs">
                                    <i className="fa-solid fa-fire"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 leading-tight">
                                    Day Streak
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-rose-600 ml-1">
                                1 Day
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── 4. Navigation Tab Pills Bar ── */}
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: 'fa-table-cells-large' },
                        { id: 'academic', label: 'Academic', icon: 'fa-graduation-cap' },
                        { id: 'achievements', label: 'Achievements', icon: 'fa-trophy' },
                        { id: 'activity', label: 'Activity', icon: 'fa-clock-rotate-left' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border ${activeTab === tab.id
                                ? 'bg-[#183b8a] text-white border-transparent shadow-md'
                                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-zinc-700/80 hover:bg-slate-50'
                                }`}
                        >
                            <i className={`fa-solid ${tab.icon} text-xs`}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── 5. Main 2x2 Grid of Cards (Exact Layout from Mockup) ── */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
                        {/* Card 1: Personal Information */}
                        <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col justify-between">
                            {/* Decorative wave curves shifted upper-left and prominently styled */}
                            <div className="absolute -bottom-1 right-0 w-64 sm:w-80 h-40 sm:h-48 pointer-events-none overflow-hidden z-0">
                                <svg className="w-full h-full" viewBox="0 0 280 170" fill="none" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="personalWaveGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#414D8E" stopOpacity="0.14" />
                                            <stop offset="100%" stopColor="#169BDF" stopOpacity="0.28" />
                                        </linearGradient>
                                        <linearGradient id="personalWaveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.38" />
                                        </linearGradient>
                                        <linearGradient id="personalWaveGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
                                            <stop offset="100%" stopColor="#414D8E" stopOpacity="0.35" />
                                        </linearGradient>
                                    </defs>
                                    {/* Back wave sweeping higher up and left */}
                                    <path
                                        d="M0,170 C40,110 110,135 180,75 C220,35 255,45 280,25 L280,170 Z"
                                        fill="url(#personalWaveGrad1)"
                                    />
                                    {/* Middle smooth accent wave */}
                                    <path
                                        d="M50,170 C100,135 150,148 200,88 C240,42 265,58 280,48 L280,170 Z"
                                        fill="url(#personalWaveGrad2)"
                                    />
                                    {/* Foreground gentle wave crest */}
                                    <path
                                        d="M110,170 C160,148 200,138 240,110 C265,92 275,85 280,80 L280,170 Z"
                                        fill="url(#personalWaveGrad3)"
                                    />
                                </svg>
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#414D8E] dark:text-sky-400 flex items-center justify-center text-base shadow-sm">
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Personal Information</h3>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 m-0">Your basic account details and contact information.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEdit('personal')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border-none cursor-pointer transition-colors"
                                    >
                                        <i className="fa-solid fa-pen text-[10px] text-blue-600"></i> Edit
                                    </button>
                                </div>

                                {/* 2-Column Fields Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-user text-blue-500 text-xs"></i>
                                            <span>Full Name</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6">
                                            {displayName}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-envelope text-blue-500 text-xs"></i>
                                            <span>Email Address</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6 truncate">
                                            {displayEmail}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-phone text-blue-500 text-xs"></i>
                                            <span>Phone Number</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 m-0 pl-6">
                                            {profile?.Phone || form.phone || <span className="text-slate-400">Not set</span>}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-venus-mars text-blue-500 text-xs"></i>
                                            <span>Gender</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 m-0 pl-6">
                                            {profile?.Gender || form.gender || <span className="text-slate-400">Not set</span>}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-calendar text-blue-500 text-xs"></i>
                                            <span>Date of Birth</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 m-0 pl-6">
                                            {profile?.DOB ? formatDate(profile.DOB) : form.dob || <span className="text-slate-400">Not set</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Address & Location */}
                        <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col justify-between">
                            {/* Decorative travel route with looped path, drop pin & code brackets (Matches Reference) */}
                            <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-8 md:bottom-6 md:right-10 pointer-events-none z-0">
                                <svg width="190" height="110" viewBox="0 0 190 110" fill="none">
                                    <defs>
                                        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.85" />
                                            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
                                        </linearGradient>
                                    </defs>

                                    {/* Soft organic pastel background wave/blob */}
                                    <path
                                        d="M60,110 C60,65 95,50 125,35 C155,18 185,35 190,70 C195,100 170,110 140,110 Z"
                                        fill="url(#blobGrad)"
                                        className="dark:opacity-20"
                                    />

                                    {/* Dashed flight/travel route with smooth loop-the-loop */}
                                    <path
                                        d="M18,92 C36,76 52,70 66,70 C80,70 90,78 86,88 C82,98 68,96 70,84 C72,72 92,66 108,52 C118,44 124,38 130,34"
                                        stroke="#93c5fd"
                                        strokeWidth="2.2"
                                        strokeDasharray="4 4"
                                        strokeLinecap="round"
                                    />

                                    {/* Destination Pin Location with < 📍 > code brackets */}
                                    <g>
                                        {/* Left code bracket < */}
                                        <path
                                            d="M116,28 L110,33 L116,38"
                                            stroke="#93c5fd"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                        />
                                        {/* Right code bracket > */}
                                        <path
                                            d="M144,28 L150,33 L144,38"
                                            stroke="#93c5fd"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                        />

                                        {/* Vertical dashed notch under pin */}
                                        <line
                                            x1="130"
                                            y1="34"
                                            x2="130"
                                            y2="41"
                                            stroke="#93c5fd"
                                            strokeWidth="2.2"
                                            strokeDasharray="2 2"
                                            strokeLinecap="round"
                                        />

                                        {/* Map Pin Droplet */}
                                        <path
                                            d="M130,8 C124,8 119,13 119,19 C119,26.5 130,36 130,36 C130,36 141,26.5 141,19 C141,13 136,8 130,8 Z"
                                            fill="#2563eb"
                                            filter="drop-shadow(0 2px 5px rgba(37,99,235,0.35))"
                                        />
                                        {/* Center white circle inside pin */}
                                        <circle cx="130" cy="19" r="4" fill="#ffffff" />
                                    </g>
                                </svg>
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base shadow-sm">
                                            <i className="fa-solid fa-location-dot"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Address & Location</h3>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 m-0">Your current address and location details.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEdit('address')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border-none cursor-pointer transition-colors"
                                    >
                                        <i className="fa-solid fa-pen text-[10px] text-blue-600"></i> Edit
                                    </button>
                                </div>

                                {/* 2-Column Fields Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-house text-blue-500 text-xs"></i>
                                            <span>Street</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 m-0 pl-6">
                                            {profile?.Address?.street || form.street || <span className="text-slate-400">Not set</span>}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-flag text-emerald-500 text-xs"></i>
                                            <span>Country</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6">
                                            {profile?.Address?.country || form.country || 'India'}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-city text-blue-500 text-xs"></i>
                                            <span>City</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6">
                                            {profile?.Address?.city || form.city || 'Delhi'}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-location-dot text-blue-500 text-xs"></i>
                                            <span>PIN / Postal Code</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6">
                                            {profile?.Address?.pin || form.pin || '110001'}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1 text-slate-400 dark:text-zinc-500 font-medium">
                                            <i className="fa-solid fa-map text-blue-500 text-xs"></i>
                                            <span>State / Province</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white m-0 pl-6">
                                            {profile?.Address?.state || form.state || 'Delhi'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Education Details */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                            <div>
                                {/* Card Header */}
                                <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#414D8E] dark:text-sky-400 flex items-center justify-center text-base shadow-sm">
                                            <i className="fa-solid fa-graduation-cap"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Education Details</h3>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 m-0">Your academic information and current institution.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEdit('education')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border-none cursor-pointer transition-colors"
                                    >
                                        <i className="fa-solid fa-pen text-[10px] text-blue-600"></i> Edit
                                    </button>
                                </div>

                                {/* Institution Card (Matches Mockup) */}
                                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors cursor-pointer" onClick={() => openEdit('education')}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#414D8E] to-[#169BDF] flex items-center justify-center text-white shadow-sm text-lg shrink-0">
                                            <i className="fa-solid fa-building-columns"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0">
                                                {profile?.Education?.school_clg_name || form.school_clg_name || 'Kode-Skool Academy'}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 m-0 font-medium">
                                                {profile?.Education?.class_year || form.class_year || 'Class 10 — 12'}
                                            </p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-slate-400 text-sm mr-2"></i>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Coding & Social Profiles */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                            <div>
                                {/* Card Header */}
                                <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-base shadow-sm">
                                            <i className="fa-solid fa-code"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Coding & Social Profiles</h3>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 m-0">Connect your developer handles and social accounts.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEdit('social')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border-none cursor-pointer transition-colors"
                                    >
                                        <i className="fa-solid fa-pen text-[10px] text-blue-600"></i> Edit
                                    </button>
                                </div>

                                {/* 2x2 Connected Accounts Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        {
                                            key: 'linkedin',
                                            icon: 'fa-brands fa-linkedin-in',
                                            bg: 'bg-[#0077b5]',
                                            label: 'LinkedIn',
                                            handle: getHandle('linkedin')
                                        },
                                        {
                                            key: 'github',
                                            icon: 'fa-brands fa-github',
                                            bg: 'bg-black text-white',
                                            label: 'GitHub',
                                            handle: getHandle('github')
                                        },
                                        {
                                            key: 'codechef',
                                            icon: 'fa-solid fa-code',
                                            bg: 'bg-[#5b3c11] text-white',
                                            label: 'CodeChef',
                                            handle: getHandle('codechef')
                                        },
                                        {
                                            key: 'instagram',
                                            icon: 'fa-brands fa-instagram',
                                            bg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
                                            label: 'Instagram',
                                            handle: getHandle('instagram')
                                        },
                                    ].map(s => (
                                        <div
                                            key={s.key}
                                            className="p-3 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-xl ${s.bg} text-white flex items-center justify-center shrink-0 text-xs shadow-sm`}>
                                                    <i className={s.icon}></i>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white m-0 truncate">{s.label}</p>
                                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 m-0 truncate">
                                                        {s.handle ? 'Attached' : 'Not attached'}
                                                    </p>
                                                </div>
                                            </div>
                                            {s.handle ? (
                                                <a
                                                    href={s.handle}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline shrink-0"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit('social')}
                                                    className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 bg-transparent border-none cursor-pointer shrink-0"
                                                >
                                                    + Connect
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Academic Tab View */}
                {activeTab === 'academic' && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Academic Curriculum Progress</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">Track your syllabus completion, unit progression and upcoming assessments.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Learn Python 3', 'Learn JavaScript', 'Learn C++'].map((crs, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex flex-col justify-between gap-3">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">{crs}</h4>
                                    <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(idx + 1) * 25}%` }}></div>
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-medium">Unit 1: Fundamentals</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Tab View */}
                {activeTab === 'achievements' && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Student Badges & Certifications</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">Honors earned through code submissions, unit tests, and active streaks.</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
                                <i className="fa-solid fa-medal text-purple-600 text-2xl"></i>
                                <div>
                                    <h5 className="text-sm font-bold text-purple-900 dark:text-purple-300 m-0">Early Scholar</h5>
                                    <p className="text-[11px] text-purple-700 dark:text-purple-400 m-0">Joined Kode-Skool academic portal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity Tab View */}
                {activeTab === 'activity' && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Coding Activity & Study Streak</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">Recent learning sessions, compiler runs, and test completions.</p>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 max-w-sm">
                            <i className="fa-solid fa-fire text-rose-500 text-2xl"></i>
                            <div>
                                <h5 className="text-sm font-bold text-rose-900 dark:text-rose-300 m-0">1 Day Study Streak</h5>
                                <p className="text-[11px] text-rose-700 dark:text-rose-400 m-0">Continue practicing tomorrow to maintain your streak!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 6. Full Interactive Edit Modal ── */}
                {editMode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-700 w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white m-0">
                                        Edit Profile Information
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                        Update your account, location, academic details and social links.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 flex items-center justify-center border-none cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Personal Details Section */}
                                <div>
                                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                                        Personal & Contact Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={form.dob}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3">
                                        Address & Location
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                name="street"
                                                value={form.street}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="House / Apartment / Street"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. Delhi"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">State / Province</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. Delhi NCR"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. India"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">PIN / Postal Code</label>
                                            <input
                                                type="text"
                                                name="pin"
                                                value={form.pin}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. 110001"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Details Section */}
                                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                                        Academic Institution Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">School / College Name</label>
                                            <input
                                                type="text"
                                                name="school_clg_name"
                                                value={form.school_clg_name}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. St. Xavier's High School"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Class / Grade Level</label>
                                            <input
                                                type="text"
                                                name="class_year"
                                                value={form.class_year}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="e.g. Class 10 — 12"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Developer & Social Handles Section */}
                                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                                        Coding & Social Handles
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={form.linkedin}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">GitHub URL</label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={form.github}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">CodeChef Profile URL</label>
                                            <input
                                                type="url"
                                                name="codechef"
                                                value={form.codechef}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="https://codechef.com/users/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Instagram URL</label>
                                            <input
                                                type="url"
                                                name="instagram"
                                                value={form.instagram}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm outline-none focus:border-blue-500"
                                                placeholder="https://instagram.com/username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-colors border-none cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] hover:opacity-95 shadow-md transition-all border-none cursor-pointer flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Saving…</>
                                        ) : (
                                            <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {toast && (
                    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white shadow-2xl flex items-center gap-3 border-l-4 ${toast.type === 'success' ? 'bg-zinc-900 border-emerald-500' : 'bg-zinc-900 border-red-500'
                        } animate-bounce`}>
                        <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-red-400'}`}></i>
                        <span>{toast.msg}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
