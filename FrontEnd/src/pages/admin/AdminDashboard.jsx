import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import courseService from '../../services/courseService';

export default function AdminDashboard({ toggleMode }) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'school' | 'users' | 'courses' | 'reports'
    const [stats, setStats] = useState(null);
    const [school, setSchool] = useState({});
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // User management state
    const [userFilter, setUserFilter] = useState('All');
    const [userSearch, setUserSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '', email: '', password: '', role: 'Student', classSection: 'Class 9', department: '', phone: ''
    });
    const [bulkCsvText, setBulkCsvText] = useState('');
    const [bulkImporting, setBulkImporting] = useState(false);

    // Course assignment state
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [assigning, setAssigning] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, schoolRes, usersRes, coursesRes, reportsRes] = await Promise.allSettled([
                adminService.getAdminStats(),
                adminService.getSchool(),
                adminService.getUsers(),
                courseService.getCourses(),
                adminService.getReports()
            ]);

            if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
                setStats(statsRes.value.stats);
            }
            if (schoolRes.status === 'fulfilled' && schoolRes.value?.school) {
                setSchool(schoolRes.value.school);
            }
            if (usersRes.status === 'fulfilled' && usersRes.value?.users) {
                setUsers(usersRes.value.users);
            }
            if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)) {
                setCourses(coursesRes.value);
            }
            if (reportsRes.status === 'fulfilled' && reportsRes.value?.success) {
                setReports(reportsRes.value);
            }
        } catch {
            showToast('Error loading administrative data.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Handle School Update
    const handleSaveSchool = async (e) => {
        e.preventDefault();
        try {
            const res = await adminService.updateSchool(school);
            if (res.success) {
                showToast('School configuration saved successfully!');
            }
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to save school details.', 'error');
        }
    };

    // Handle Create Single User
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await adminService.createUser(newUserData);
            if (res.success) {
                showToast(res.msg);
                setShowCreateModal(false);
                setNewUserData({ name: '', email: '', password: '', role: 'Student', classSection: 'Class 9', department: '', phone: '' });
                const updated = await adminService.getUsers();
                setUsers(updated.users || []);
            }
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to create user.', 'error');
        }
    };

    // Handle Bulk CSV Import
    const handleBulkImport = async () => {
        if (!bulkCsvText.trim()) {
            showToast('Please paste or upload CSV data.', 'error');
            return;
        }

        setBulkImporting(true);
        try {
            const lines = bulkCsvText.trim().split('\n');
            const parsed = [];
            const header = lines[0].toLowerCase().includes('email') ? 1 : 0;
            for (let i = header; i < lines.length; i++) {
                const parts = lines[i].split(',').map(p => p.trim());
                if (parts.length >= 2) {
                    parsed.push({
                        name: parts[0],
                        email: parts[1],
                        role: parts[2] || 'Student',
                        password: parts[3] || 'KodeSkool@2024',
                        classSection: parts[4] || '',
                        phone: parts[5] || ''
                    });
                }
            }

            if (parsed.length === 0) {
                showToast('No valid user rows detected.', 'error');
                setBulkImporting(false);
                return;
            }

            const res = await adminService.bulkImportUsers(parsed);
            if (res.success) {
                showToast(res.msg);
                setShowBulkModal(false);
                setBulkCsvText('');
                const updated = await adminService.getUsers();
                setUsers(updated.users || []);
            }
        } catch (err) {
            showToast(err.response?.data?.msg || 'Bulk import failed.', 'error');
        } finally {
            setBulkImporting(false);
        }
    };

    // Handle Course Assignment
    const handleAssignCourse = async (e) => {
        e.preventDefault();
        if (!selectedCourseId) {
            showToast('Please select a course to assign.', 'error');
            return;
        }

        setAssigning(true);
        try {
            const res = await adminService.assignCourse({
                courseId: selectedCourseId,
                classSection: selectedClass
            });
            if (res.success) {
                showToast(res.msg);
                const updatedReports = await adminService.getReports();
                if (updatedReports.success) setReports(updatedReports);
            }
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to assign course.', 'error');
        } finally {
            setAssigning(false);
        }
    };

    // Export Reports to CSV
    const handleExportCSV = () => {
        if (!reports?.enrollments || reports.enrollments.length === 0) {
            showToast('No enrollment data to export.', 'error');
            return;
        }

        const headers = 'Student Email,Course Name,Status,Enrollment Date\n';
        const rows = reports.enrollments.map(e =>
            `"${e.User_Id?.Email || ''}","${e.Course_Id?.Course_Name || ''}","${e.Status || ''}","${new Date(e.createdAt).toLocaleDateString()}"`
        ).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `KodeSkool_Academic_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Academic report downloaded successfully!');
    };

    // Filter Users
    const filteredUsers = users.filter(u => {
        const matchesRole = userFilter === 'All' || u.role?.toLowerCase() === userFilter.toLowerCase() || (userFilter === 'Faculty' && (u.role === 'Faculty' || u.role === 'Teacher'));
        const matchesSearch = !userSearch ||
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className={`w-full min-h-screen px-4 py-8 md:px-12 md:py-10 font-poppins text-slate-800 dark:text-slate-100 bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-200 ${toggleMode}`}>
            {/* Top Header */}
            <div className="flex justify-between items-start mb-8 flex-wrap gap-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-2 shadow-sm">
                        <i className="fa-solid fa-shield-halved"></i> Administrator
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1.5 bg-gradient-to-r from-[#1e293b] to-[#414D8E] dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                        Platform Control Center
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
                        Manage institution, users, course assignments, and academic performance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm"
                        onClick={loadAllData}
                    >
                        <i className="fa-solid fa-arrows-rotate"></i> Refresh
                    </button>
                    <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <i className="fa-solid fa-user-plus"></i> New User
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 border-b border-slate-200 dark:border-slate-800">
                {[
                    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
                    { id: 'school', icon: 'fa-school', label: 'School Setup' },
                    { id: 'users', icon: 'fa-users-gear', label: 'User Management' },
                    { id: 'courses', icon: 'fa-book-bookmark', label: 'Course Assignment' },
                    { id: 'reports', icon: 'fa-file-invoice', label: 'Reports & Certificates' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-[#414D8E] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-[#414D8E] dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-medium">Loading administrative dashboard...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* ── TAB 1: OVERVIEW ── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                                        <i className="fa-solid fa-user-graduate"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{stats?.totalStudents || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Total Students</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                                        <i className="fa-solid fa-chalkboard-user"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{stats?.totalTeachers || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Total Teachers</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                                        <i className="fa-solid fa-layer-group"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{stats?.totalCourses || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Coding Courses</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <i className="fa-solid fa-certificate"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{stats?.totalCertifications || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Certificates Earned</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Flow Blueprint Panel */}
                            <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                        <i className="fa-solid fa-diagram-project text-[#414D8E] dark:text-blue-400"></i> Core Platform Workflow
                                    </h3>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                        Admin · Teacher · Student
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/40">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#414D8E] to-[#169BDF] text-white font-bold flex items-center justify-center text-sm mb-2 shadow-sm">1</div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">School Setup</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Configure institution details, board, and classes</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/40">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#414D8E] to-[#169BDF] text-white font-bold flex items-center justify-center text-sm mb-2 shadow-sm">2</div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Onboarding</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Import students & faculty manually or via CSV</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/40">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#414D8E] to-[#169BDF] text-white font-bold flex items-center justify-center text-sm mb-2 shadow-sm">3</div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Course Assignment</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Assign coding curriculum to classes or groups</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/40">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#414D8E] to-[#169BDF] text-white font-bold flex items-center justify-center text-sm mb-2 shadow-sm">4</div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Assessment & Certs</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Track test outcomes & issue digital credentials</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions & Institution Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                            <i className="fa-solid fa-bolt text-amber-500"></i> Quick Actions
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500 transition-all text-left"
                                            onClick={() => setActiveTab('school')}
                                        >
                                            <i className="fa-solid fa-gear text-blue-500"></i> Configure School Info
                                        </button>
                                        <button
                                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500 transition-all text-left"
                                            onClick={() => { setActiveTab('users'); setShowBulkModal(true); }}
                                        >
                                            <i className="fa-solid fa-file-csv text-emerald-500"></i> Bulk CSV Onboarding
                                        </button>
                                        <button
                                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500 transition-all text-left"
                                            onClick={() => setActiveTab('courses')}
                                        >
                                            <i className="fa-solid fa-paper-plane text-purple-500"></i> Assign Course to Class
                                        </button>
                                        <button
                                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500 transition-all text-left"
                                            onClick={handleExportCSV}
                                        >
                                            <i className="fa-solid fa-download text-indigo-500"></i> Export Academic Report
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                            <i className="fa-solid fa-building-columns text-[#414D8E] dark:text-blue-400"></i> Institution Snapshot
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                                        <div className="flex justify-between items-center py-2.5">
                                            <span className="text-slate-500 dark:text-slate-400">Institution Name:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{school?.name || 'Kode-Skool Academy'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2.5">
                                            <span className="text-slate-500 dark:text-slate-400">Affiliation Board:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{school?.board || 'CBSE'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2.5">
                                            <span className="text-slate-500 dark:text-slate-400">Academic Year:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{school?.academicYear || '2024-2025'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2.5">
                                            <span className="text-slate-500 dark:text-slate-400">Active Classes:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{(school?.classes || []).length} Classes configured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 2: SCHOOL SETUP ── */}
                    {activeTab === 'school' && (
                        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                    <i className="fa-solid fa-school text-[#414D8E] dark:text-blue-400"></i> School & Institutional Configuration
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage school credentials, educational board, and class sections</p>
                            </div>
                            <form className="space-y-4" onSubmit={handleSaveSchool}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">School / Institution Name *</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.name || ''}
                                            onChange={(e) => setSchool({ ...school, name: e.target.value })}
                                            placeholder="e.g. St. Xavier's High School"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">School Code / ID</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.code || ''}
                                            onChange={(e) => setSchool({ ...school, code: e.target.value })}
                                            placeholder="e.g. SCH-104"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Affiliation Board</label>
                                        <select
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.board || 'CBSE'}
                                            onChange={(e) => setSchool({ ...school, board: e.target.value })}
                                        >
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="IB">IB</option>
                                            <option value="Cambridge">Cambridge</option>
                                            <option value="University">University</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Year</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.academicYear || '2024-2025'}
                                            onChange={(e) => setSchool({ ...school, academicYear: e.target.value })}
                                            placeholder="e.g. 2024-2025"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Contact Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.email || ''}
                                            onChange={(e) => setSchool({ ...school, email: e.target.value })}
                                            placeholder="admin@school.edu"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                            value={school?.phone || ''}
                                            onChange={(e) => setSchool({ ...school, phone: e.target.value })}
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 text-left mt-4">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Configured Classes (comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                        value={(school?.classes || []).join(', ')}
                                        onChange={(e) => setSchool({
                                            ...school,
                                            classes: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                                        })}
                                        placeholder="Class 6, Class 7, Class 8, Class 9, Class 10"
                                    />
                                    <small className="text-xs text-slate-500 dark:text-slate-400">Enter the classes offered at your institution separated by commas.</small>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                        <i className="fa-solid fa-floppy-disk"></i> Save School Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── TAB 3: USER MANAGEMENT ── */}
                    {activeTab === 'users' && (
                        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                        <i className="fa-solid fa-users text-[#414D8E] dark:text-blue-400"></i> User Directory & Onboarding
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage student and faculty accounts individually or via bulk CSV upload</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm"
                                        onClick={() => setShowBulkModal(true)}
                                    >
                                        <i className="fa-solid fa-file-csv text-emerald-500"></i> Bulk CSV Import
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <i className="fa-solid fa-user-plus"></i> Add User
                                    </button>
                                </div>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
                                    {['All', 'Student', 'Faculty', 'Admin'].map(r => (
                                        <button
                                            key={r}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                userFilter === r
                                                    ? 'bg-white dark:bg-slate-800 text-[#414D8E] dark:text-blue-400 shadow-sm'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                            onClick={() => setUserFilter(r)}
                                        >
                                            {r === 'Faculty' ? 'Teachers' : r}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative flex items-center w-full sm:w-72">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 text-slate-400 text-xs"></i>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        placeholder="Search by name, email, or role..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Name</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Email</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Role</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Class / Department</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Phone</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Date Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-slate-400 text-sm">
                                                    No users found matching your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map(u => (
                                                <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 shrink-0">
                                                                <i className={`fa-solid ${u.role === 'Admin' ? 'fa-shield-halved' : u.role === 'Faculty' ? 'fa-chalkboard-user' : 'fa-user-graduate'}`}></i>
                                                            </div>
                                                            <span className="font-semibold text-slate-900 dark:text-white">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            u.role === 'Admin'
                                                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                                                : u.role === 'Faculty'
                                                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                                        }`}>
                                                            {u.role === 'Faculty' ? 'Teacher' : u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{u.classSection || u.department || '—'}</td>
                                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{u.phone || '—'}</td>
                                                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 4: COURSE ASSIGNMENT ── */}
                    {activeTab === 'courses' && (
                        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                    <i className="fa-solid fa-book-bookmark text-[#414D8E] dark:text-blue-400"></i> Course Assignment
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Assign coding curriculum to specific classes or student groups</p>
                            </div>

                            <form className="space-y-4" onSubmit={handleAssignCourse}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Course to Assign *</label>
                                        <select
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Course --</option>
                                            {courses.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.Course_Name} ({c.Course_Level || 'All Levels'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Class / Student Group *</label>
                                        <select
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                        >
                                            <option value="All Classes">All Students in School</option>
                                            {(school?.classes || ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']).map(cls => (
                                                <option key={cls} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50" disabled={assigning}>
                                        <i className={`fa-solid ${assigning ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                                        {assigning ? 'Assigning...' : 'Assign & Enroll Class'}
                                    </button>
                                </div>
                            </form>

                            {/* Available Course Library Grid */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Active Course Catalog ({courses.length})</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {courses.map(c => (
                                        <div key={c._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0">
                                                <i className="fa-solid fa-code"></i>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-900 dark:text-white m-0">{c.Course_Name}</h5>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 my-1">{c.Course_Description?.substring(0, 80) || 'Comprehensive coding course.'}...</p>
                                                <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                                                    Rating: {c.Course_Rating || 5}/5
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 5: REPORTS & CERTIFICATES ── */}
                    {activeTab === 'reports' && (
                        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                        <i className="fa-solid fa-chart-line text-[#414D8E] dark:text-blue-400"></i> Academic Progress & Certification Reports
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comprehensive overview of enrollment, test submissions, and certification</p>
                                </div>
                                <button
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={handleExportCSV}
                                >
                                    <i className="fa-solid fa-file-csv"></i> Download CSV Report
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                                        <i className="fa-solid fa-clipboard-check"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{reports?.enrollments?.length || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Total Enrollments</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <i className="fa-solid fa-award"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{stats?.totalCertifications || 0}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 m-0">Qualified for Certificates</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Student Email</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Course Assigned</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Enrollment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {(reports?.enrollments || []).length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-slate-400 text-sm">
                                                    No enrollment records yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            reports.enrollments.slice(0, 50).map((e, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{e.User_Id?.Email || 'Student'}</td>
                                                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">{e.Course_Id?.Course_Name || 'Course'}</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                                            {e.Status || 'Enrolled'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{new Date(e.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── MODAL: CREATE INDIVIDUAL USER ── */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                <i className="fa-solid fa-user-plus text-[#414D8E] dark:text-blue-400"></i> Create New User
                            </h3>
                            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-lg p-1" onClick={() => setShowCreateModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Role *</label>
                                <select
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    value={newUserData.role}
                                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher / Faculty</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    required
                                    value={newUserData.name}
                                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                                <input
                                    type="email"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    required
                                    value={newUserData.email}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    placeholder="user@kodeskool.com"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Initial Password *</label>
                                <input
                                    type="password"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    required
                                    value={newUserData.password}
                                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            {newUserData.role === 'Student' ? (
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Class / Section</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        value={newUserData.classSection}
                                        onChange={(e) => setNewUserData({ ...newUserData, classSection: e.target.value })}
                                        placeholder="e.g. Class 9A"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        value={newUserData.department}
                                        onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border-none bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: BULK CSV ONBOARDING ── */}
            {showBulkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                                <i className="fa-solid fa-file-csv text-emerald-500"></i> Bulk CSV User Onboarding
                            </h3>
                            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-lg p-1" onClick={() => setShowBulkModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 mb-4">
                            <p className="font-semibold mb-1">Paste comma-separated rows. Expected format:</p>
                            <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[#414D8E] dark:text-blue-400 font-mono text-xs">name,email,role,password,class,phone</code>
                            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                                Example: <code className="font-mono">Aarav Sharma,aarav@school.edu,Student,Pass@123,Class 9,9876543210</code>
                            </p>
                        </div>
                        <div className="flex flex-col gap-1.5 text-left mb-4">
                            <textarea
                                rows="8"
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                placeholder="name,email,role,password,class,phone&#10;Rohan Verma,rohan@school.edu,Student,Pass@123,Class 10,9876543210&#10;Dr. Priya Sen,priya@school.edu,Teacher,Pass@123,CS,9876543211"
                                value={bulkCsvText}
                                onChange={(e) => setBulkCsvText(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                onClick={() => setShowBulkModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-none bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                                onClick={handleBulkImport}
                                disabled={bulkImporting}
                            >
                                <i className={`fa-solid ${bulkImporting ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                                {bulkImporting ? 'Importing Users...' : 'Import Users Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white transition-all transform duration-300 ${
                    toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
