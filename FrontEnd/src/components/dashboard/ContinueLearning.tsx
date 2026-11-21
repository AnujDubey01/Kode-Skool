import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import { ContinueLearningProps } from '../../types';

export default function ContinueLearning({ course, lesson, progress = 68, toggleMode = "" }: ContinueLearningProps) {
    const [activeCourse, setActiveCourse] = useState({
        title: 'Learn Python 3',
        lesson: 'Unit 1: Hello World & Syntax',
        progress: 25,
        link: '/Courses'
    });

    useEffect(() => {
        let isMounted = true;
        async function fetchTopCourse() {
            try {
                const myCourses = await courseService.getMyCourses();
                if (Array.isArray(myCourses) && myCourses.length > 0) {
                    const first = myCourses[0];
                    const courseId = typeof first.Course_ID === 'string' ? first.Course_ID : first.Course_ID?._id;
                    if (!courseId) return;
                    const details = await courseService.getCourse(courseId);
                    if (details && details.Course_Name && isMounted) {
                        let currentLessonName = 'Unit 1: Core Concepts & Practice';
                        try {
                            const struct = await courseService.getCourseStruct(courseId);
                            if (struct?.Unit_List?.[0]) {
                                const unit1 = struct.Unit_List[0];
                                const topic1 = unit1.Topic_List?.[0];
                                currentLessonName = `Unit ${unit1.Unit_No}: ${unit1.Unit_Name} - ${topic1?.Topic_Name || 'Lesson 1'}`;
                            }
                        } catch (e) {
                            // ignore
                        }

                        setActiveCourse({
                            title: details.Course_Name,
                            lesson: currentLessonName,
                            progress: 30,
                            link: `/Courses/View?course_id=${courseId}`
                        });
                    }
                }
            } catch (err) {
                // Keep default
            }
        }
        fetchTopCourse();

        return () => {
            isMounted = false;
        };
    }, []);

    const courseTitle = course?.title || activeCourse.title;
    const currentLesson = lesson || activeCourse.lesson;
    const currentProgress = course?.progress || activeCourse.progress;
    const resumeLink = course?.link || activeCourse.link;

    return (
        <div className={`continue-learning-card ${toggleMode}`}>
            <div className="continue-learning-content">
                <div className="continue-learning-badge">
                    <i className="fa-solid fa-play"></i> Continue Learning
                </div>
                <h2>{courseTitle}</h2>
                <p className="continue-lesson-title">
                    <i className="fa-regular fa-circle-play"></i> {currentLesson}
                </p>
                <div className="continue-progress-wrap">
                    <div className="continue-progress-bar">
                        <div className="continue-progress-fill" style={{ width: `${currentProgress}%` }}></div>
                    </div>
                    <span className="continue-progress-text">{currentProgress}% Completed</span>
                </div>
            </div>
            <div className="continue-learning-action">
                <Link to={resumeLink} className="continue-resume-btn">
                    <span>Resume Lesson</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
}
