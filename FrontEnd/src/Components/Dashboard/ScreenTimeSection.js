import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale);


function ScreenTimeSection(props) {
    const [screenTime, setScreenTime] = useState({
        streak: 0,
        upvote: 0
    });

    const targetValues = props.screenTime;

    const sectionRef = useRef(null);
    const observerRef = useRef(null);

    // Function to start the running numbers animation
    const startRunningNumbers = useCallback(() => {
        const duration = 2000; // Animation duration in milliseconds
        const frameRate = 60; // 60 frames per second
        const totalFrames = (duration / 1000) * frameRate;

        // Initial frame for the animation
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;

            // Calculate the current state based on progress
            setScreenTime({
                streak: Math.floor(progress * targetValues.streak),
                upvote: Math.floor(progress * targetValues.upvote)
            });

            // Continue animation or stop at the final frame
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                // Set the final values to make sure they reach the targets exactly
                setScreenTime(targetValues);
            }
        };

        // Start the animation
        requestAnimationFrame(animate);
    }, [targetValues]);


    const Data = targetValues.today;
    const chartRef = useRef(null);

    const [chartData, setChartData] = React.useState({
        labels: Data.map((data) => data.time),
        datasets: [
            {
                label: "Screen Time",
                data: 0,
                backgroundColor: "rgba(75,192,192,1)", // temporary placeholder
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10
            },
        ],
    });

    const container = useRef(null);
    const dropBtn = useRef(null);
    const handleOpenContainer = () => {
        container.current.classList.toggle('close');
        dropBtn.current.classList.toggle('fa-circle-chevron-up');
        dropBtn.current.classList.toggle('fa-circle-chevron-down');
    }

    useEffect(() => {
        // Intersection Observer callback
        const handleIntersection = (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                startRunningNumbers();
                const chart = chartRef.current;
                if (chart) {
                    const ctx = chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0.18, '#414D8E');
                    gradient.addColorStop(0.18, '#424F90');
                    gradient.addColorStop(0.44, '#5D74BD');
                    gradient.addColorStop(0.75, '#169BDF');

                    setChartData({
                        labels: Data.map((data) => data.time),
                        datasets: [
                            {
                                label: "Screen Time",
                                data: Data.map((data) => data.usages),
                                backgroundColor: gradient,
                                borderColor: "white",
                                borderWidth: 0,
                                borderRadius: 10
                            },
                        ],
                    });
                }
                observerRef.current.disconnect(); // Stop observing after animation starts
            }
        };

        // Initialize Intersection Observer
        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: null,
            threshold: 0.5 // Trigger when 50% of #test-section is in view
        });

        if (sectionRef.current) {
            observerRef.current.observe(sectionRef.current);
        }

        // Cleanup on component unmount
        return () => observerRef.current && observerRef.current.disconnect();
    }, [startRunningNumbers, Data]);


    return (
        <>
            <div className="test-section" ref={sectionRef}>
                {window.screen.width <= 500 ? <div className={"drop-down d-flex flex-row justify-content-between "+props.toggleMode} style={{ width: '100%' }}  onClick={handleOpenContainer}>
                    <h2>Screen Time</h2>
                    <i className="fa-solid fa-circle-chevron-down" ref={dropBtn}></i>
                </div> : <h2>Screen Time</h2>}
                <div ref={container} className={window.screen.width <= 500 ? "test-container mt-3 close" : "test-container mt-3"}>
                    <div className={"screen-time-chart "+props.toggleMode}>
                        <h3 className="total-screen-time">1h 34m</h3>
                        <Bar
                            ref={chartRef}
                            data={chartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: false,
                                        text: "Users Gained between 2016-2020",
                                    },
                                    legend: {
                                        display: false,
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: false,
                                            text: 'Hour of Day',
                                        },
                                        ticks: {
                                            autoSkip: false, // Ensures all ticks are considered
                                            maxTicksLimit: 4, // Limits number of visible ticks to 4 on x-axis
                                            callback: (val, index) => (index % 6 === 0 ? chartData.labels[index] : ''), // Show every 6th hour label
                                        },
                                        grid: {
                                            color: '#8A8A8A' // Use CSS variable for x-axis grid lines
                                        },
                                    },
                                    y: {
                                        position: 'right',
                                        beginAtZero: true,
                                        title: {
                                            display: false,
                                            text: 'Minutes',
                                        },
                                        ticks: {
                                            autoSkip: true,
                                            maxTicksLimit: 4
                                        },
                                        grid: {
                                            color: '#8A8A8A' // Use CSS variable for x-axis grid lines
                                        },
                                        border: {
                                            color: '#8A8A8A' // Set color for y-axis line
                                        }
                                    },
                                },
                                responsive: true,
                            }}
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-between">
                        <div className={"test-written " + props.toggleMode}>
                            <div className={"pen-bg " + props.toggleMode}>
                                <i className="fa-brands fa-gripfire"></i>
                            </div>
                            <div className="test-content d-flex flex-column py-1 justify-content-center">
                                <h4 className="test-count">{screenTime.streak}</h4>
                                <p>Streak</p>
                            </div>
                        </div>
                        <div className={"test-average " + props.toggleMode}>
                            <div className={"pen-bg " + props.toggleMode}>
                                <i className="fa-solid fa-up-long"></i>
                            </div>
                            <div className="test-content d-flex flex-column py-1 justify-content-center">
                                <h4 className="test-count">{screenTime.upvote}</h4>
                                <p>Upvote</p>
                            </div>
                        </div>
                    </div>
                    <div className={"test-score d-flex flex-row flex-wrap justify-content-between " + props.toggleMode}>
                        <div className="d-flex flex-column align-items-center">
                            <div className={"score-icon-bg " + props.toggleMode}>
                                <i className="fa-solid fa-square-pen"></i>
                            </div>
                            <h4 className="test-score-count">{targetValues.editor}</h4>
                            <p>Editor</p>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <div className={"score-icon-bg " + props.toggleMode}>
                                <i className="fa-solid fa-hourglass-half"></i>
                            </div>
                            <h4 className="test-score-count">{targetValues.productivity}</h4>
                            <p>Productivity</p>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <div className={"score-icon-bg " + props.toggleMode}>
                                <i className="fa-solid fa-stopwatch"></i>
                            </div>
                            <h4 className="test-score-count">{targetValues.productivity}</h4>
                            <p>Productivity</p>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <div className={"score-icon-bg " + props.toggleMode}>
                                <i className="fa-solid fa-square-pen"></i>
                            </div>
                            <h4 className="test-score-count">{targetValues.editor}</h4>
                            <p>Editor</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ScreenTimeSection