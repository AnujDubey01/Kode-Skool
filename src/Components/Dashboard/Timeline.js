import React, { useEffect, useState } from 'react'

const getActivityByYear = (year, activity) => {
    return activity.filter(activity => {
        const activityYear = new Date(activity.date).getFullYear();
        return activityYear === year;
    });
};

function Timeline(props) {
    /* TimeLine Section Handling. */
    const [timelineYear, setTimelineYear] = useState(new Date().getFullYear());

    const handleYearChange = (event) => {
        setTimelineYear(Number(event.target.value));
    };

    useEffect(() => {
        const currentYear = timelineYear;
        const yearData = getActivityByYear(currentYear, props.activity);

        const Jan1Date = new Date(`January 01, ${currentYear}`);
        const Jan1Day = Jan1Date.getDay(); // Getting the day of first Jan

        const dayBox = document.querySelectorAll('.day-box');
        dayBox.forEach(box => { box.classList = 'day-box' }); // Clearing previous classlist

        yearData.forEach(day => {
            const date2 = new Date(day.date); // Current selected date
            const diffTime = Math.abs(date2 - Jan1Date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Getting no. of days difference between 1 Jan & curr date.

            const targetBox = diffDays + Jan1Day; // Getting the serial of date in timeline boxes.

            dayBox[targetBox].classList.add(day.workTime);
        })

    }, [timelineYear, props.activity]);

    return (
        <>
            <div className="timeline">
                <h2>Timeline</h2>
                <div className={'timeline-container mt-3 px-4 pt-4 pb-2 ' + props.toggleMode}>
                    <div className="px-2 d-flex flex-row justify-content-between fw-medium" style={{ height: '30px' }}>
                        <p>Timeline</p>
                        <div className="d-flex flex-row justify-content-between" style={{ width: '30%' }}>
                            <p>Total active days:40</p>
                            <p>Max streak:23</p>
                        </div>
                    </div>
                    <div className="d-flex flex-row gap-2">
                        <div className={'timeline-box d-flex flex-row rounded-2 ' + props.toggleMode}>
                            <div className="week-days">
                                <p></p>
                                <p>Sun</p>
                                <p>Mon</p>
                                <p>Tue</p>
                                <p>Wed</p>
                                <p>Thu</p>
                                <p>Fri</p>
                                <p>Sar</p>
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
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                    <div className="day-box"></div>
                                </div>
                            </div>
                        </div>
                        <div className="timeline-years">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                                <input type="radio" className="btn-check" name="timeline-year" id="vbtn-radio1" autoComplete="off" value="2024" checked={timelineYear === 2024} onChange={handleYearChange} />
                                <label className="btn btn-outline-primary" htmlFor="vbtn-radio1">2024</label>
                                <input type="radio" className="btn-check" name="timeline-year" id="vbtn-radio2" autoComplete="off" value="2023" checked={timelineYear === 2023} onChange={handleYearChange} />
                                <label className="btn btn-outline-primary" htmlFor="vbtn-radio2">2023</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Timeline