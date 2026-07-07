import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function CircularProgress({ value }) {
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    const [progress, setProgress] = useState(circumference); // Start from 0%

    useEffect(() => {
        const duration = 400; // Animation duration in ms
        const startTime = performance.now(); // Get the start time

        const animateProgress = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progressValue = Math.min((elapsedTime / duration) * value, value);

            // Calculate the new progress value based on the percentage
            const updatedProgress = circumference - (progressValue / 100) * circumference;
            setProgress(updatedProgress);

            if (elapsedTime < duration) {
                requestAnimationFrame(animateProgress); // Continue animation
            }
        };

        requestAnimationFrame(animateProgress); // Start animation
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
                {/* Background (empty) circle */}
                <circle
                    className="progress-ring__background"
                    stroke='#D7D7D7'
                    strokeWidth="12"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                {/* Foreground (progress) circle */}
                <circle
                    className="progress-ring__circle"
                    stroke='url(#progressGradient)'
                    strokeWidth="13"
                    fill="transparent"
                    strokeLinecap="round" // Rounded ends
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

const getCourseDetails = async (host, id) => {
    const response = await fetch(`${host}/api/get-course?course_id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json();
}

async function fetchStructure(host, courseId) {
    const response = await fetch(`${host}/api/get-course-struct?course_id=${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}

async function fetchEnrollStatus(host, courseId) {
    const response = await fetch(`${host}/api/my-courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth_token')
        }
    });
    const data = await response.json();

    let status = null;
    data.forEach(enroll => {
        if (enroll.Course_ID === courseId) {
            status = enroll.Status;
        }
    })

    return status;
}

function CourseView(props) {
    const [course, setCourse] = useState({})
    const [unitList, setUnitList] = useState([])
    const [resume, setResume] = useState('')

    useEffect(() => {
        async function fetchData() {
            const params = new URLSearchParams(window.location.search);
            const course_id = params.get('course_id')
            const crs = await getCourseDetails(props.host, course_id);
            setCourse(crs);
            const struct = await fetchStructure(props.host, course_id);
            const sts = await fetchEnrollStatus(props.host, course_id);

            // Guard: if course structure hasn't been set up yet, stop here
            if (!struct || !struct.Unit_List) {
                setUnitList([]);
                return;
            }

            // Guard: if user isn't enrolled, treat all topics as incomplete
            const enrolledStatus = sts || [];

            let filterUnit = [];
            struct.Unit_List.forEach(unit => {
                let filterTopic = [];
                unit.Topic_List.forEach(topic => {
                    if (enrolledStatus.includes(topic._id)) {
                        topic.complete = true;
                        filterTopic.push(topic);
                    } else {
                        topic.complete = false;
                        filterTopic.push(topic);
                    }
                })
                unit.Topic_List = filterTopic;
                filterUnit.push(unit);
            });

            setUnitList(filterUnit);

            let nextTopic = '';
            for (const i in filterUnit) {
                let checkBreak = false;
                for (const j in filterUnit[i].Topic_List) {
                    if (!filterUnit[i].Topic_List[j].complete) {
                        nextTopic = filterUnit[i].Topic_List[j]._id;
                        checkBreak = true;
                        break;
                    }
                }
                if (checkBreak) break;
            }


            setResume(nextTopic);
        }

        fetchData();
    }, [props])

    return (
        <>
            <div className="board-heading">
                <div className="welcome-text">
                    <h4 onClick={() => { window.history.back() }} style={{ cursor: "pointer", color: "black" }}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </h4>
                </div>
            </div>
            <div className="courses-section my-5">
                <div className="courses-head my-4 d-flex justify-content-between px-3">
                    <div className="course-details d-flex flex-column">
                        <div className="course-name">
                            <h2>{course.Course_Name}</h2>
                        </div>
                        <div className="course-about">
                            <p>{course.Description}</p>
                        </div>
                    </div>
                    <div className={'your-course-box-o ' + props.toggleMode}>
                        <div className="your-course-background"></div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>{course.Course_Name}</h3>
                                    <p>2.Arrays & pointers</p>
                                </div>
                                <Link to={'/Courses/Video?topic_id=' + resume}>
                                    <button type="button" className='course-resume-btn'>Resume</button>
                                </Link>
                            </div>
                            <CircularProgress value={16} />
                        </div>
                    </div>
                </div>
                <div className="courses-body container">
                    <div className="course-topics">
                        {unitList.map(unit => (
                            <div className="course-topic-card">
                                <div className="course-topic-head">
                                    <div className="topic-head">
                                        <h3>Unit {unit.Unit_No}: {unit.Unit_Name}</h3>
                                    </div>
                                    {/* <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play" style={{ textDecoration: 'none' }}>Play</Link>
                                </div> */}
                                </div>
                                <div className="course-topic-body">
                                    <ul>
                                        {unit.Topic_List.map(topic => (
                                            <li>
                                                <p>{topic.Topic_Name}</p>
                                                <p className='topic-description'>{topic.Description}</p>
                                                <Link to={`/Courses/Video?topic_id=${topic._id}`} style={{ color: 'rgba(0,0,0,0.9)' }}>
                                                    <div className="topic-complete">
                                                        <i className={topic.complete ? "fa-solid fa-circle-check" : "fa-regular fa-circle-play"}></i>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseView