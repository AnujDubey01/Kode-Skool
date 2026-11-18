import React, { useRef, useState } from 'react';
import ContinueLearning from '../components/dashboard/ContinueLearning';
import CertificateModal from '../components/dashboard/CertificateModal';
import TestSection from '../components/dashboard/TestSection';
import ScreenTimeSection from '../components/dashboard/ScreenTimeSection';
import ResultsSection from '../components/dashboard/ResultsSection';
import Timeline from '../components/dashboard/Timeline';
import YourCourses from '../components/dashboard/YourCourses';

function Dashboard(props) {
    const welcome = useRef(null);
    const search = useRef(null);
    const [showCertModal, setShowCertModal] = useState(false);

    const handleClickOutside = (event) => {
        if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current?.classList.remove('openSearch');
            search.current?.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };

    const openSearchOpt = () => {
        welcome.current?.classList.add('openSearch');
        search.current?.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    };

    const userName = props.user?.name || localStorage.getItem('user_name') || 'Student';

    return (
        <div className="dashboardContainer relative overflow-hidden">
            {/* Ambient background glow orbs (No dotmatrix) */}
            <div className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-blue-100/35 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-40 -left-24 w-96 h-96 rounded-full bg-indigo-100/30 dark:bg-indigo-900/10 blur-3xl pointer-events-none"></div>

            <div className="board-heading">
                <div className="welcome-text d-flex flex-row">
                    <div className="menu-icon" onClick={props.controlNav}>
                        <i className="fa-solid fa-list-ul"></i>
                    </div>
                    <div ref={welcome} className='d-flex flex-column welcome-effect'>
                        <h1>Welcome {userName}!</h1>
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

            {/* Quick Continue Learning Resume Card */}
            <ContinueLearning toggleMode={props.toggleMode} />

            <YourCourses toggleMode={props.toggleMode} />
            <Timeline toggleMode={props.toggleMode} activity={props.user?.activity} />
            <TestSection toggleMode={props.toggleMode} test={props.user?.test} />
            <ScreenTimeSection toggleMode={props.toggleMode} screenTime={props.user?.screenTime} />
            <ResultsSection
                toggleMode={props.toggleMode}
                results={props.user?.results}
                onOpenCert={() => setShowCertModal(true)}
            />

            {/* Printable Certificate Modal */}
            {showCertModal && (
                <CertificateModal
                    studentName={userName}
                    courseName="Full-Stack Web & C Programming"
                    onClose={() => setShowCertModal(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;
