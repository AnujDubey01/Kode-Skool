import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import courseService from '../services/courseService';
import { CircularProgress } from '../components/dashboard/YourCourses';
import CourseCardBackground from '../components/dashboard/CourseCardBackground';

function CourseView(props) {
    const [course, setCourse] = useState({});
    const [unitList, setUnitList] = useState([]);
    const [resume, setResume] = useState('');
    const location = useLocation();

    useEffect(() => {
        async function fetchData() {
            try {
                const params = new URLSearchParams(location.search);
                const course_id = params.get('course_id');
                if (!course_id) return;

                const crs = await courseService.getCourse(course_id);
                setCourse(crs || {});

                const struct = await courseService.getCourseStruct(course_id);
                const myCourses = await courseService.getMyCourses();

                let sts = [];
                if (Array.isArray(myCourses)) {
                    myCourses.forEach(enroll => {
                        if (enroll.Course_ID === course_id) {
                            sts = enroll.Status || [];
                        }
                    });
                }

                if (!struct || !struct.Unit_List) {
                    setUnitList([]);
                    return;
                }

                const enrolledStatus = sts || [];
                let filterUnit = [];
                struct.Unit_List.forEach(unit => {
                    let filterTopic = [];
                    (unit.Topic_List || []).forEach(topic => {
                        const isComplete = enrolledStatus.includes(topic._id);
                        filterTopic.push({
                            ...topic,
                            complete: isComplete
                        });
                    });
                    filterUnit.push({
                        ...unit,
                        Topic_List: filterTopic
                    });
                });

                setUnitList(filterUnit);

                let nextTopic = '';
                for (const u of filterUnit) {
                    let checkBreak = false;
                    for (const t of u.Topic_List) {
                        if (!t.complete) {
                            nextTopic = t._id;
                            checkBreak = true;
                            break;
                        }
                    }
                    if (checkBreak) break;
                }

                setResume(nextTopic);
            } catch (err) {
                console.error("Error fetching course view:", err);
            }
        }

        fetchData();
    }, [location.search]);

    return (
        <div className="w-full">
            {/* Back Bar */}
            <div className="mb-6 flex items-center">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-blue transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to Courses</span>
                </button>
            </div>

            {/* Course Header Banner */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="max-w-xl">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.Course_Name || 'Course'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {course.Description || ''}
                    </p>
                </div>

                <div className="relative overflow-hidden w-full sm:w-80 h-36 rounded-2xl bg-gradient-to-r from-[#18233C] to-[#253255] text-white p-4 flex items-center justify-between shadow-lg shrink-0">
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <CourseCardBackground title={course.Course_Name || ''} />
                    </div>
                    <div className="z-10 flex flex-col justify-between h-full">
                        <div>
                            <h4 className="text-sm font-semibold text-white truncate max-w-[170px]">
                                {course.Course_Name || 'Course'}
                            </h4>
                            <p className="text-[11px] text-gray-300">Continue Learning</p>
                        </div>
                        <Link to={'/Courses/Video?topic_id=' + resume}>
                            <button
                                type="button"
                                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#414D8E] to-[#169BDF] hover:opacity-95 shadow transition-all cursor-pointer"
                            >
                                Resume
                            </button>
                        </Link>
                    </div>
                    <div className="z-10 scale-90">
                        <CircularProgress value={20} />
                    </div>
                </div>
            </div>

            {/* Syllabus Units */}
            <div className="w-full space-y-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum & Syllabus</h3>
                {unitList.map((unit, uIdx) => (
                    <div
                        key={uIdx}
                        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm"
                    >
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-zinc-800 text-brand-blue flex items-center justify-center text-xs font-bold">
                                {unit.Unit_No}
                            </span>
                            Unit {unit.Unit_No}: {unit.Unit_Name}
                        </h4>

                        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {(unit.Topic_List || []).map((topic, tIdx) => (
                                <div key={tIdx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {topic.Topic_Name}
                                        </p>
                                        {topic.Description && (
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                                {topic.Description}
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        to={`/Courses/Video?topic_id=${topic._id}`}
                                        className="shrink-0 text-xl transition-transform hover:scale-110"
                                        title={topic.complete ? 'Completed' : 'Start Lesson'}
                                    >
                                        {topic.complete ? (
                                            <i className="fa-solid fa-circle-check text-emerald-500"></i>
                                        ) : (
                                            <i className="fa-regular fa-circle-play text-brand-blue hover:text-brand-sky"></i>
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseView;
