import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(CategoryScale);


function ResultsSection(props) {
    /* Running Number Animation. */
    const [result, setResult] = useState({
        badges: 10,
        certificates: 12
    });

    const targetValues = props.results;

    const sectionRef = useRef(null);
    const observerRef = useRef(null);

    const startRunningNumbers = useCallback(() => {
        const duration = 1000; // Animation duration in milliseconds
        const frameRate = 60; // 60 frames per second
        const totalFrames = (duration / 1000) * frameRate;

        // Initial frame for the animation
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;

            // Calculate the current state based on progress
            setResult({
                badges: Math.floor(progress * targetValues.badges),
                certificates: Math.floor(progress * targetValues.certificates)
            });

            // Continue animation or stop at the final frame
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                // Set the final values to make sure they reach the targets exactly
                setResult(targetValues);
            }
        };


        // Start the animation
        requestAnimationFrame(animate);
    }, [targetValues]);

    const resultData = targetValues.resultData;
    const chartRef = useRef(null);

    const [pieChartData, setPieChartData] = React.useState({
        labels: ['Failed', 'Passed'],
        datasets: [
            {
                data: [0, 0],
                backgroundColor: ['#F44336', '#4CAF50'], // green for pass, red for fail
                orderColor: 'transparent', // Makes the border invisible
                borderWidth: 1
            },
        ],
    });

    useEffect(() => {
        // Intersection Observer callback
        const handleIntersection = (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                startRunningNumbers();
                const chart = chartRef.current;
                if (chart) {
                    const ctx = chart.ctx;
                    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient1.addColorStop(0.18, '#414D8E');
                    gradient1.addColorStop(0.18, '#424F90');
                    gradient1.addColorStop(0.44, '#5D74BD');
                    gradient1.addColorStop(0.75, '#169BDF');

                    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient2.addColorStop(0.18, '#7F8DC4');  // Lighter version of #414D8E
                    gradient2.addColorStop(0.18, '#8490C7');  // Lighter version of #424F90
                    gradient2.addColorStop(0.44, '#A3B2DE');  // Lighter version of #5D74BD
                    gradient2.addColorStop(0.75, '#4EBEF2');  // Lighter version of #169BDF

                    setPieChartData({
                        labels: ['Failed', 'Passed'],
                        datasets: [
                            {
                                data: [resultData.failed, resultData.passed],
                                backgroundColor: [gradient2, gradient1],
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
    }, [startRunningNumbers, resultData]);


    return (
        <>
            <div className="test-section" ref={sectionRef}>
                <h2>Results</h2>
                <div className="test-container mt-3">
                    <div className={"pass-fail-chart " + props.toggleMode}>
                        <h3 className='pass-fail-title'>Pass VS Fail</h3>
                        <Pie
                            ref={chartRef}
                            data={pieChartData}
                            options={{
                                rotation: 90,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw;
                                                const total = resultData.passed + resultData.failed;
                                                const percentage = ((value / total) * 100).toFixed(1);
                                                return `${label}: ${value} (${percentage}%)`;
                                            },
                                        },
                                    },
                                }
                            }}
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-between">
                        <div className={"test-written " + props.toggleMode}>
                            <div className={"pen-bg " + props.toggleMode}>
                                <i className="fa-solid fa-ribbon"></i>
                            </div>
                            <div className="test-content d-flex flex-column py-1 justify-content-center">
                                <h2 className="test-count">{result.badges}</h2>
                                <p>Badges Earned</p>
                            </div>
                        </div>
                        <div className={"test-average " + props.toggleMode}>
                            <div className={"pen-bg " + props.toggleMode}>
                                <i className="fa-solid fa-certificate"></i>
                            </div>
                            <div className="test-content d-flex flex-column py-1 justify-content-center">
                                <h2 className="test-count">{result.certificates}</h2>
                                <p>Certificate Earned</p>
                            </div>
                        </div>
                    </div>
                    <div className={"reminder-container " + props.toggleMode}>
                        <h2 className="reminder-head">Reminders</h2>
                        <div className="reminder-list mt-3">
                            <div className="d-flex flex-row gap-2">
                                <div className="reminder-selector-selected"></div>
                                <p className="reminder-name">Python</p>
                            </div>
                        </div>
                        <div className="reminder-list mt-3">
                            <div className="d-flex flex-row gap-2">
                                <div className="reminder-selector"></div>
                                <p className="reminder-name">Hard Questions</p>
                            </div>
                        </div>
                        <div className="reminder-list mt-3">
                            <div className="d-flex flex-row gap-2">
                                <div className="reminder-selector"></div>
                                <p className="reminder-name"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultsSection;