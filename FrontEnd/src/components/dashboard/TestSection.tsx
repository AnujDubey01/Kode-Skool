import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TestSectionProps, TestStats } from '../../types';

function TestSection(props: TestSectionProps) {
    const [test, setTest] = useState<TestStats>({
        testWritten: 0,
        overallAvg: 0,
        testsTaken: 0,
        passed: 0,
        failed: 0,
        resultWaiting: 0
    });

    const targetValues = useMemo(() => {
        return props.test || {
            testWritten: 32,
            overallAvg: 80,
            testsTaken: 32,
            passed: 12,
            failed: 19,
            resultWaiting: 1
        };
    }, [props.test]);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const startRunningNumbers = useCallback(() => {
        const duration = 2000;
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;

            setTest({
                testWritten: Math.floor(progress * targetValues.testWritten),
                overallAvg: Math.floor(progress * targetValues.overallAvg),
                testsTaken: Math.floor(progress * targetValues.testsTaken),
                passed: Math.floor(progress * targetValues.passed),
                failed: Math.floor(progress * targetValues.failed),
                resultWaiting: Math.floor(progress * targetValues.resultWaiting)
            });

            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                setTest(targetValues);
            }
        };

        requestAnimationFrame(animate);
    }, [targetValues]);

    const container = useRef<HTMLDivElement | null>(null);
    const dropBtn = useRef<HTMLDivElement | null>(null);
    const handleOpenContainer = () => {
        if (container.current) container.current.classList.toggle('close');
        if (dropBtn.current) {
            dropBtn.current.classList.toggle('fa-circle-chevron-up');
            dropBtn.current.classList.toggle('fa-circle-chevron-down');
        }
    };

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                startRunningNumbers();
                if (observerRef.current) observerRef.current.disconnect();
            }
        };

        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: null,
            threshold: 0.5
        });

        if (sectionRef.current) {
            observerRef.current.observe(sectionRef.current);
        }

        return () => observerRef.current && observerRef.current.disconnect();
    }, [startRunningNumbers]);

    return (
        <div className="test-section" ref={sectionRef}>
            {window.innerWidth <= 500 ? (
                <div className={"drop-down d-flex flex-row justify-content-between " + props.toggleMode} style={{ width: '100%' }} onClick={handleOpenContainer}>
                    <h2>Tests</h2>
                    <i className="fa-solid fa-circle-chevron-down" ref={dropBtn}></i>
                </div>
            ) : <h2>Tests</h2>}

            <div ref={container} className={window.innerWidth <= 500 ? "test-container mt-3 close" : "test-container mt-3"}>
                <div className={"upcoming-test " + props.toggleMode}>
                    <h3>Upcoming Test</h3>
                    <p className="test-name">C language</p>
                    <div className="calendar-icon">
                        <i className="fa-solid fa-calendar"></i>
                        <p className="date-number">02</p>
                    </div>
                    <p className="test-date">2nd Sep, 2024</p>
                    <button type="button" className={'test-access-btn ' + props.toggleMode}>Get access</button>
                </div>
                <div className="d-flex flex-column justify-content-between">
                    <div className={"test-written " + props.toggleMode}>
                        <div className={"pen-bg " + props.toggleMode}>
                            <i className="fa-solid fa-pen"></i>
                        </div>
                        <div className="test-content d-flex flex-column py-1 justify-content-center">
                            <h4 className="test-count">{test.testWritten}</h4>
                            <p>Tests Written</p>
                        </div>
                    </div>
                    <div className={"test-average " + props.toggleMode}>
                        <div className={"pen-bg " + props.toggleMode}>
                            <i className="fa-solid fa-percent"></i>
                        </div>
                        <div className="test-content d-flex flex-column py-1 justify-content-center">
                            <h4 className="test-count">{test.overallAvg}%</h4>
                            <p>Overall Average</p>
                        </div>
                    </div>
                </div>
                <div className={"test-score d-flex flex-row flex-wrap justify-content-between " + props.toggleMode}>
                    <div className="d-flex flex-column align-items-center">
                        <div className={"score-icon-bg " + props.toggleMode}>
                            <i className="fa-solid fa-thumbs-up"></i>
                        </div>
                        <h4 className="test-score-count">{test.testsTaken}</h4>
                        <p>No. of Tests</p>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div className={"score-icon-bg " + props.toggleMode}>
                            <i className="fa-solid fa-thumbs-up"></i>
                        </div>
                        <h4 className="test-score-count">{test.passed}</h4>
                        <p>Passed</p>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div className={"score-icon-bg " + props.toggleMode}>
                            <i className="fa-solid fa-thumbs-down"></i>
                        </div>
                        <h4 className="test-score-count">{test.failed}</h4>
                        <p>Failed</p>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div className={"score-icon-bg " + props.toggleMode}>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <h4 className="test-score-count">{test.resultWaiting}</h4>
                        <p>Waiting for result</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestSection;
