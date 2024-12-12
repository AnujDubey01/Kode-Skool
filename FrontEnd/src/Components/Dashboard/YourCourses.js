import React, { useState, useEffect } from 'react';

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

function YourCourses(props) {
    return (
        <>
            <div className="your-courses">
                <h2>Your courses</h2>                
                <div className="your-course-list">
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
                    <div className={'your-course-box-o ' + props.toggleMode}>
                        <div className="your-course-background"></div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>Python Programming</h3>
                                    <p>2.Logical operators</p>
                                </div>
                                <button type="button" className='course-resume-btn'>Resume</button>
                            </div>
                            <CircularProgress value={20} />
                        </div>
                    </div>
                    <div className={'your-course-box-o ' + props.toggleMode}>
                        <div className="your-course-background"></div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>SQL</h3>
                                    <p>7.Connecting tables</p>
                                </div>
                                <button type="button" className='course-resume-btn'>Resume</button>
                            </div>
                            <CircularProgress value={60} />
                        </div>
                    </div>
                    <div className={'your-course-box-o ' + props.toggleMode}>
                        <div className="your-course-background"></div>
                        <div className={'your-course-box-i ' + props.toggleMode}>
                            <div className="your-course-details">
                                <div className="your-course-text-block">
                                    <h3>SQL</h3>
                                    <p>7.Connecting tables</p>
                                </div>
                                <button type="button" className='course-resume-btn'>Resume</button>
                            </div>
                            <CircularProgress value={60} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default YourCourses