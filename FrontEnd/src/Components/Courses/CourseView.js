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

function CourseView(props) {

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
                            <h2>Python</h2>
                        </div>
                        <div className="course-about">
                            <p>Learn python to quickly develop anything from web development to artificial intelligence
                            </p>
                        </div>
                    </div>
                    <div className={'your-course-box-o ' + props.toggleMode}>
                        <div className="your-course-background"></div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>C Programming</h3>
                                    <p>2.Arrays & pointers</p>
                                </div>
                                <button type="button" className='course-resume-btn'>Resume</button>
                            </div>
                            <CircularProgress value={16} />
                        </div>
                    </div>
                </div>
                <div className="courses-body container">
                    <div className="course-topics">
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 1: Variables and Data types</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play" style={{ textDecoration: 'none' }}>Play</Link>
                                </div>
                            </div>
                            <div className="course-topic-body">
                                <ul>
                                    <li>Types of variables</li>
                                    <li>Types of Data types</li>
                                    <li>Representation of data types and variables</li>
                                </ul>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 2: Strings and Conditional statements</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>
                            <div className="course-topic-body">
                                <ul>
                                    <li>Types of strings</li>
                                    <li>If..Else</li>
                                    <li>ElseIf</li>
                                    <li>Else</li>
                                    <li>Nested If</li>
                                </ul>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 3: List and Tuple</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 4: Dictionary and Set</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseView