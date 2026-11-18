import React, { useState, useEffect } from 'react';
import teacherService from '../../services/teacherService';

export default function TeacherDashboard({ toggleMode }) {
    const [data, setData] = useState(null);
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'students' | 'assessments'
    const [loading, setLoading] = useState(true);
    const [filterClass, setFilterClass] = useState('All');
    const [searchStudent, setSearchStudent] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [dashRes, stdRes, testRes] = await Promise.allSettled([
                    teacherService.getTeacherDashboard(),
                    teacherService.getStudentsProgress(),
                    teacherService.getAssessmentOverview()
                ]);

                if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
                    setData(dashRes.value);
                }
                if (stdRes.status === 'fulfilled' && stdRes.value?.students) {
                    setStudents(stdRes.value.students);
                }
                if (testRes.status === 'fulfilled' && testRes.value?.assessments) {
                    setAssessments(testRes.value.assessments);
                }
            } catch (err) {
                console.error('Error loading teacher data:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredStudents = students.filter(s => {
        const matchesClass = filterClass === 'All' || s.classSection === filterClass;
        const matchesSearch = !searchStudent ||
            s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
            s.email.toLowerCase().includes(searchStudent.toLowerCase());
        return matchesClass && matchesSearch;
    });

    return (
        <div className="my-8 md:my-14 mx-3 sm:mx-6 md:mx-12 lg:mx-16 px-1 sm:px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-zinc-800 text-brand-blue dark:text-brand-ice px-3.5 py-1 rounded-full text-xs font-semibold mb-3 border border-indigo-100 dark:border-zinc-700">
                    <i className="fa-solid fa-chalkboard-user"></i> Faculty Portal
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome, {data?.teacher?.name || 'Professor'}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    Department of {data?.teacher?.department || 'Computer Science'} · Monitoring {data?.stats?.totalStudents || 0} Students
                </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-users-rectangle"></i>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.stats?.totalClasses || 0}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Assigned Classes</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.stats?.totalStudents || 0}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Active Students</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.stats?.averageScore || 78}%</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Class Average</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-certificate"></i>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data?.stats?.certificatesEligible || 0}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Certificates Qualified</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2.5 mb-6">
                {[
                    { id: 'classes', label: 'Classes Overview', icon: 'fa-chalkboard' },
                    { id: 'students', label: 'Student Progress', icon: 'fa-chart-simple' },
                    { id: 'assessments', label: 'Assessments & Tests', icon: 'fa-clipboard-list' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === t.id
                                ? 'bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] text-white shadow-sm'
                                : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                        }`}
                    >
                        <i className={`fa-solid ${t.icon}`}></i>
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#5D74BD] rounded-full animate-spin"></div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">Loading class dashboard...</p>
                </div>
            ) : (
                <div className="w-full">
                    {/* ── TAB 1: CLASSES OVERVIEW ── */}
                    {activeTab === 'classes' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {(data?.classes || []).map((cls, idx) => (
                                <div key={idx} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cls.className}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                                                {cls.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                                            <p className="flex items-center gap-2">
                                                <i className="fa-solid fa-user-group text-brand-blue"></i>
                                                <span><strong>{cls.studentsCount}</strong> Enrolled Students</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <i className="fa-solid fa-code text-brand-blue"></i>
                                                <span>Python, C Programming & Web Development</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterClass(cls.className);
                                            setActiveTab('students');
                                        }}
                                        className="w-full py-2 px-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-brand-navy dark:text-brand-ice text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer border border-gray-200 dark:border-zinc-700"
                                    >
                                        <span>View Student Roster</span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── TAB 2: STUDENT MONITORING ── */}
                    {activeTab === 'students' && (
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Student Learning & Assessment Performance
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                                    Track syllabus completion indicators and identify students needing additional guidance
                                </p>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Class:</label>
                                    <select
                                        value={filterClass}
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className="text-xs sm:text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 outline-none text-gray-800 dark:text-gray-100 cursor-pointer"
                                    >
                                        <option value="All">All Classes</option>
                                        {(data?.teacher?.assignedClasses || ['Class 9', 'Class 10']).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-xs sm:text-sm">
                                    <i className="fa-solid fa-magnifying-glass text-gray-400 mr-2"></i>
                                    <input
                                        type="text"
                                        placeholder="Search student by name or email..."
                                        value={searchStudent}
                                        onChange={(e) => setSearchStudent(e.target.value)}
                                        className="bg-transparent outline-none w-48 sm:w-64 text-gray-800 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                                <table className="w-full text-left text-xs sm:text-sm text-gray-700 dark:text-zinc-300">
                                    <thead className="bg-gray-50 dark:bg-zinc-800/80 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Student Name</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">Class</th>
                                            <th className="py-3 px-4">Course Progress</th>
                                            <th className="py-3 px-4">Latest Score</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-400 text-xs">
                                                    No students found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map(s => (
                                                <tr key={s._id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                                                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{s.name}</td>
                                                    <td className="py-3 px-4 text-gray-500 dark:text-zinc-400">{s.email}</td>
                                                    <td className="py-3 px-4">{s.classSection}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-24 sm:w-28 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-[#414D8E] to-[#169BDF] rounded-full"
                                                                    style={{ width: `${s.progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-semibold">{s.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{s.latestScore}%</td>
                                                    <td className="py-3 px-4">
                                                        {s.needsSupport ? (
                                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800">
                                                                Needs Support
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
                                                                On Track
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 3: ASSESSMENTS ── */}
                    {activeTab === 'assessments' && (
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scheduled & Completed Assessments</h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Review student test submissions and score distributions</p>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                                <table className="w-full text-left text-xs sm:text-sm text-gray-700 dark:text-zinc-300">
                                    <thead className="bg-gray-50 dark:bg-zinc-800/80 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Assessment Title</th>
                                            <th className="py-3 px-4">Scheduled Date</th>
                                            <th className="py-3 px-4">Submissions</th>
                                            <th className="py-3 px-4">Average Score</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        {assessments.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-8 text-gray-400 text-xs">
                                                    No assessments scheduled currently.
                                                </td>
                                            </tr>
                                        ) : (
                                            assessments.map(t => (
                                                <tr key={t._id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                                                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{t.title}</td>
                                                    <td className="py-3 px-4 text-gray-500 dark:text-zinc-400">{new Date(t.date).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4">{t.submissions} Submissions</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{t.averageScore}%</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800">
                                                            {t.status}
                                                        </span>
                                                    </td>
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
        </div>
    );
}
