import React, { useRef } from 'react';
import './Dashboard.css';
import TestSection from './Dashboard/TestSection';
import ScreenTimeSection from './Dashboard/ScreenTimeSection';
import ResultsSection from './Dashboard/ResultsSection';
import Timeline from './Dashboard/Timeline';
import YourCourses from './Dashboard/YourCourses';

function Dashboard(props) {
    const welcome = useRef(null);
    const search = useRef(null);

    const handleClickOutside = (event) => {
        if (search.current.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current.classList.remove('openSearch');
            search.current.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };

    const openSearchOpt = () => {
        welcome.current.classList.add('openSearch');
        search.current.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    }

    return (
        <>
            <div className="dashboardContainer">
                <div className="board-heading">
                    <div className="welcome-text d-flex flex-row">
                        <div className="menu-icon" onClick={props.controlNav}>
                            <i className="fa-solid fa-list-ul"></i>
                        </div>
                        <div ref={welcome} className='d-flex flex-column welcome-effect'>
                            <h1>Welcome {props.user.name}!</h1>
                            <p>Let's crack the code</p>
                        </div>
                    </div>
                    <div className="search-notify-box">
                        <div className={'search-bar ' + props.toggleMode}>
                            <i className="fa-solid fa-magnifying-glass" onClick={openSearchOpt}></i>
                            <input ref={search} type="text" name="search" id="search" className={props.toggleMode} placeholder='Search' />
                        </div>
                        <div className="notify-box">
                            <span className="notify-count">5</span>
                            <ion-icon name="notifications"></ion-icon>
                        </div>
                    </div>
                </div>

                <YourCourses toggleMode={props.toggleMode} />
                <Timeline toggleMode={props.toggleMode} activity={props.user.activity} />
                <TestSection toggleMode={props.toggleMode} test={props.user.test} />
                <ScreenTimeSection toggleMode={props.toggleMode} screenTime={props.user.screenTime} />
                <ResultsSection toggleMode={props.toggleMode} results={props.user.results} />
            </div>
        </>
    )
}

export default Dashboard