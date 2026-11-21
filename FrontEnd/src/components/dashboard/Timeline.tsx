import React, { useEffect, useState } from 'react';
import { TimelineProps, UserActivityItem } from '../../types';

const getActivityByYear = (year: number, activity?: UserActivityItem[]): UserActivityItem[] => {
    if (!activity) return [];
    return activity.filter(item => {
        const activityYear = new Date(item.date).getFullYear();
        return activityYear === year;
    });
};

function Timeline({ toggleMode = '', activity = [] }: TimelineProps) {
    const [timelineYear, setTimelineYear] = useState(new Date().getFullYear());

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimelineYear(Number(event.target.value));
    };

    useEffect(() => {
        const currentYear = timelineYear;
        const yearData = getActivityByYear(currentYear, activity);

        const Jan1Date = new Date(`January 01, ${currentYear}`);
        const Jan1Day = Jan1Date.getDay();

        const dayBox = document.querySelectorAll('.day-box');
        dayBox.forEach(box => { box.className = 'day-box'; });

        yearData.forEach(day => {
            const date2 = new Date(day.date);
            const diffTime = Math.abs(date2.getTime() - Jan1Date.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const targetBox = diffDays + Jan1Day;

            if (dayBox[targetBox]) {
                dayBox[targetBox].classList.add(day.workTime);
            }
        });

    }, [timelineYear, activity]);

    return (
        <div className="timeline">
            <h2>Timeline</h2>
            <div className={'timeline-container mt-3 px-4 pt-4 pb-2 ' + toggleMode}>
                <div className="timeline-head-section px-2 d-flex flex-row justify-content-between fw-medium">
                    <p>Timeline</p>
                    <div className="active-days-max-streak d-flex flex-row justify-content-between">
                        <p>Total active days:40</p>
                        <p>Max streak:23</p>
                    </div>
                </div>
                <div className="timeline-box-year gap-2">
                    <div className={'timeline-box d-flex flex-row rounded-2 ' + toggleMode}>
                        <div className="week-days">
                            <p></p>
                            <p>Sun</p>
                            <p>Mon</p>
                            <p>Tue</p>
                            <p>Wed</p>
                            <p>Thu</p>
                            <p>Fri</p>
                            <p>Sat</p>
                        </div>
                        <div className="month-timeline">
                            <div className="month-list">
                                <p className="month-name">Jan</p>
                                <p className="month-name">Feb</p>
                                <p className="month-name">Mar</p>
                                <p className="month-name">Apr</p>
                                <p className="month-name">May</p>
                                <p className="month-name">Jun</p>
                                <p className="month-name">July</p>
                                <p className="month-name">Aug</p>
                                <p className="month-name">Sep</p>
                                <p className="month-name">Oct</p>
                                <p className="month-name">Nov</p>
                                <p className="month-name">Dec</p>
                            </div>
                            <div className="month-days">
                                {Array.from({ length: 371 }, (_, i) => (
                                    <div key={i} className="day-box"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="timeline-years">
                        <div className="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                            <input type="radio" className="btn-check" name="timeline-year" id="vbtn-radio1" autoComplete="off" value="2025" checked={timelineYear === 2025} onChange={handleYearChange} />
                            <label className="btn btn-outline-primary" htmlFor="vbtn-radio1">2025</label>
                            <input type="radio" className="btn-check" name="timeline-year" id="vbtn-radio2" autoComplete="off" value="2024" checked={timelineYear === 2024} onChange={handleYearChange} />
                            <label className="btn btn-outline-primary" htmlFor="vbtn-radio2">2024</label>
                            <input type="radio" className="btn-check" name="timeline-year" id="vbtn-radio3" autoComplete="off" value="2023" checked={timelineYear === 2023} onChange={handleYearChange} />
                            <label className="btn btn-outline-primary" htmlFor="vbtn-radio3">2023</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Timeline;
