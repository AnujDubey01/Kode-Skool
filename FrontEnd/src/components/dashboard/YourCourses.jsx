import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import CourseCardBackground from './CourseCardBackground';

function CircularProgress({ value }) {
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    const [progress, setProgress] = useState(circumference);

    useEffect(() => {
        const duration = 400;
        const startTime = performance.now();

        const animateProgress = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progressValue = Math.min((elapsedTime / duration) * value, value);
            const updatedProgress = circumference - (progressValue / 100) * circumference;
            setProgress(updatedProgress);

            if (elapsedTime < duration) {
                requestAnimationFrame(animateProgress);
            }
        };

        requestAnimationFrame(animateProgress);
    }, [value, circumference]);

    return (
        <div className="progress-container">
            <svg className="progress-ring" viewBox='0 0 100 100'>
                <linearGradient id="progressGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(167)">
                    <stop offset="18%" stopColor="#414D8E" />
                    <stop offset="18%" stopColor="#424F90" />
                    <stop offset="44%" stopColor="#5D74BD" />
                    <stop offset="75%" stopColor="#169BDF" />
                </linearGradient>
                <circle
                    className="progress-ring__background"
                    stroke='#D7D7D7'
                    strokeWidth="12"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <circle
                    className="progress-ring__circle"
                    stroke='url(#progressGradient)'
                    strokeWidth="13"
                    fill="transparent"
                    strokeLinecap="round"
                    r={radius}
                    cx="50"
                    cy="50"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: progress,
                    }}
                />
            </svg>
            <div className="progress-text">
                {value}%
            </div>
        </div>
    );
}

function YourCourses(props) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchEnrolledCourses() {
            try {
                let list = [];
                let enrolledList = [];

                try {
                    enrolledList = await courseService.getMyCourses();
                } catch (e) {
                    enrolledList = [];
                }

                if (Array.isArray(enrolledList) && enrolledList.length > 0) {
                    for (const crs of enrolledList) {
                        try {
                            const details = await courseService.getCourse(crs.Course_ID);
                            if (details && details.Course_Name) {
                                let subtitle = 'Unit 1: Fundamentals';
                                let progress = 20;

                                try {
                                    const struct = await courseService.getCourseStruct(crs.Course_ID);
                                    if (struct && Array.isArray(struct.Unit_List) && struct.Unit_List.length > 0) {
                                        let totalTopics = 0;
                                        let nextTopicName = '';
                                        const completedSet = new Set(crs.Status || []);

                                        for (const unit of struct.Unit_List) {
                                            for (const topic of unit.Topic_List || []) {
                                                totalTopics++;
                                                if (!nextTopicName && !completedSet.has(String(topic._id))) {
                                                    nextTopicName = topic.Topic_Name;
                                                    subtitle = `Unit ${unit.Unit_No}: ${unit.Unit_Name}`;
                                                }
                                            }
                                        }

                                        if (totalTopics > 0) {
                                            progress = Math.round((completedSet.size / totalTopics) * 100);
                                            if (progress === 0) progress = 18;
                                        }
                                    }
                                } catch (e) {
                                    // fallback subtitle
                                }

                                list.push({
                                    id: crs.Course_ID,
                                    name: details.Course_Name,
                                    subtitle: subtitle,
                                    progress: progress,
                                    technology: details.Technology,
                                    link: `/Courses/View?course_id=${crs.Course_ID}`
                                });
                            }
                        } catch (err) {
                            console.error('Error loading course card detail:', err);
                        }
                    }
                }

                // If user has no enrollments yet, load from the full course catalog so it matches the Courses page
                if (list.length === 0) {
                    try {
                        const allCourses = await courseService.getAllCourses();
                        if (Array.isArray(allCourses) && allCourses.length > 0) {
                            list = allCourses.slice(0, 4).map((c, idx) => ({
                                id: c._id,
                                name: c.Course_Name,
                                subtitle: `Unit 1: Fundamentals`,
                                progress: [20, 35, 15, 60][idx % 4],
                                technology: c.Technology,
                                link: `/Courses/View?course_id=${c._id}`
                            }));
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                if (isMounted && list.length > 0) {
                    setCourses(list);
                }
            } catch (err) {
                console.error('Error fetching dashboard courses:', err);
            }
        }

        fetchEnrolledCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleResume = (link) => {
        if (link) {
            navigate(link);
        } else {
            navigate('/Courses');
        }
    };

    return (
        <div className="your-courses">
            <h2>Your courses</h2>
            <div className="your-course-list">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className={'your-course-box-o ' + props.toggleMode}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResume(course.link)}
                    >
                        <div className="your-course-background">
                            <CourseCardBackground title={course.name} technology={course.technology} />
                        </div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>{course.name}</h3>
                                    <p>{course.subtitle}</p>
                                </div>
                                <button
                                    type="button"
                                    className='course-resume-btn'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResume(course.link);
                                    }}
                                >
                                    Resume
                                </button>
                            </div>
                            <CircularProgress value={course.progress} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YourCourses;
export { CircularProgress };
