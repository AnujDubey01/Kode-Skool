import React from 'react';
import './Dashboard.css';
import TestSection from './Dashboard/TestSection';
import ScreenTimeSection from './Dashboard/ScreenTimeSection';
import ResultsSection from './Dashboard/ResultsSection';
import Timeline from './Dashboard/Timeline';
import YourCourses from './Dashboard/YourCourses';

const user = {
    name: 'Uday',
    activity: [
        { date: new Date('2023-01-15').toString(), workTime: 'high' },
        { date: new Date('2023-01-28').toString(), workTime: 'low' },
        { date: new Date('2023-02-10').toString(), workTime: 'high' },
        { date: new Date('2023-02-22').toString(), workTime: 'low' },
        { date: new Date('2023-03-05').toString(), workTime: 'high' },
        { date: new Date('2023-03-20').toString(), workTime: 'low' },
        { date: new Date('2023-04-05').toString(), workTime: 'high' },
        { date: new Date('2023-04-15').toString(), workTime: 'low' },
        { date: new Date('2023-05-01').toString(), workTime: 'high' },
        { date: new Date('2023-05-18').toString(), workTime: 'low' },
        { date: new Date('2023-06-02').toString(), workTime: 'high' },
        { date: new Date('2023-06-20').toString(), workTime: 'low' },
        { date: new Date('2023-07-05').toString(), workTime: 'high' },
        { date: new Date('2023-07-18').toString(), workTime: 'low' },
        { date: new Date('2023-08-10').toString(), workTime: 'high' },
        { date: new Date('2023-08-25').toString(), workTime: 'low' },
        { date: new Date('2023-09-05').toString(), workTime: 'high' },
        { date: new Date('2023-09-20').toString(), workTime: 'low' },
        { date: new Date('2023-10-10').toString(), workTime: 'high' },
        { date: new Date('2023-10-25').toString(), workTime: 'low' },
        { date: new Date('2023-11-05').toString(), workTime: 'high' },
        { date: new Date('2023-11-20').toString(), workTime: 'low' },
        { date: new Date('2023-12-10').toString(), workTime: 'high' },
        { date: new Date('2023-12-25').toString(), workTime: 'high' },
    
        { date: new Date('2024-01-10').toString(), workTime: 'low' },
        { date: new Date('2024-01-25').toString(), workTime: 'high' },
        { date: new Date('2024-02-14').toString(), workTime: 'low' },
        { date: new Date('2024-02-28').toString(), workTime: 'high' },
        { date: new Date('2024-03-15').toString(), workTime: 'low' },
        { date: new Date('2024-03-30').toString(), workTime: 'high' },
        { date: new Date('2024-04-18').toString(), workTime: 'high' },
        { date: new Date('2024-04-30').toString(), workTime: 'low' },
        { date: new Date('2024-05-15').toString(), workTime: 'high' },
        { date: new Date('2024-05-30').toString(), workTime: 'low' },
        { date: new Date('2024-06-10').toString(), workTime: 'high' },
        { date: new Date('2024-06-28').toString(), workTime: 'low' },
        { date: new Date('2024-07-09').toString(), workTime: 'low' },
        { date: new Date('2024-07-25').toString(), workTime: 'high' },
        { date: new Date('2024-08-12').toString(), workTime: 'low' },
        { date: new Date('2024-08-28').toString(), workTime: 'high' },
        { date: new Date('2024-09-10').toString(), workTime: 'low' },
        { date: new Date('2024-09-25').toString(), workTime: 'high' },
        { date: new Date('2024-10-22').toString(), workTime: 'low' },
        { date: new Date('2024-11-05').toString(), workTime: 'high' },
        { date: new Date('2024-11-18').toString(), workTime: 'low' },
        { date: new Date('2024-12-01').toString(), workTime: 'high' },
        { date: new Date('2024-12-05').toString(), workTime: 'high' },
    ],    
    test: {
        testWritten: 32,
        overallAvg: 80,
        testsTaken: 32,
        passed: 12,
        failed: 19,
        resultWaiting: 1
    },
    screenTime: {
        today: [
            {time: '12am', usages: 0 },
            {time: '1am', usages: 0 },
            {time: '2am', usages: 0 },
            {time: '3am', usages: 0 },
            {time: '4am', usages: 0 },
            {time: '5am', usages: 12 },
            {time: '6am', usages: 0 },
            {time: '7am', usages: 0 },
            {time: '8am', usages: 0 },
            {time: '9am', usages: 0 },
            {time: '10am', usages: 0 },
            {time: '11am', usages: 30},
            {time: '12pm', usages: 0 },
            {time: '1pm', usages: 0 },
            {time: '2pm', usages: 0 },
            {time: '3pm', usages: 4},
            {time: '4pm', usages: 0 },
            {time: '5pm', usages: 0 },
            {time: '6pm', usages: 20},
            {time: '7pm', usages: 59},
            {time: '8pm', usages: 34},
            {time: '9pm', usages: 0 },
            {time: '10pm', usages: 0 },
            {time: '11pm', usages: 0 },
            {time: '12am', usages: 0 },
        ],
        streak: 32,
        upvote: 32,
        editor: '36m',
        productivity: '11h 20min'
    },
    results: {
        resultData: {
            passed: 15,
            failed: 4
        },
        badges: 10,
        certificates: 12
    }
};

function Dashboard(props) {
    return (
        <>
            <div className="board-heading">
                <div className="welcome-text d-flex flex-column">
                    <h1>Welcome {user.name}!</h1>
                    <p>Let's crack the code</p>
                </div>
                <div className="search-notify-box">
                    <input type="text" name="search" id="search" className={props.toggleMode} placeholder='Search' />
                    <div className="notify-box">
                        <span className="notify-count">5</span>
                        <ion-icon name="notifications"></ion-icon>
                    </div>
                </div>
            </div>

            <YourCourses toggleMode={props.toggleMode} />            
            <Timeline toggleMode={props.toggleMode} activity={user.activity} />
            <TestSection toggleMode={props.toggleMode} test={user.test} />
            <ScreenTimeSection toggleMode={props.toggleMode} screenTime={user.screenTime} />
            <ResultsSection toggleMode={props.toggleMode} results={user.results} />
        </>
    )
}

export default Dashboard