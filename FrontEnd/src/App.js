import './App.css';
import logo from './Assets/Img/logo.png';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from './Components/Dashboard';
import Footer from './Components/Footer';
import Editor from './Components/Editor';
import Chatbot from './Components/Chatbot';
import CourseList from './Components/Courses/CourseList';
import Courses from './Components/Courses';
import CourseView from './Components/Courses/CourseView';
import CourseVideo from './Components/Courses/CourseVideo';

// Simulating the JSON data
const navData = {
  navItems: [
    { label: 'Home', icon: 'fa-house', linkTo: '/', isActive: true },
    { label: 'Editor', icon: 'fa-pen', linkTo: '/Editor', isActive: false },
    { label: 'Courses', icon: 'fa-note-sticky', linkTo: '/Courses', isActive: false },
    { label: 'Profile', icon: 'fa-user-tie', linkTo: '/Profile', isActive: false },
    { label: 'Chat Bot', icon: 'fa-comment-dots', linkTo: '/ChatBot', isActive: false },
    { label: 'Settings', icon: 'fa-gear', linkTo: '/Settings', isActive: false, position: 'bottom' },
    { label: 'Log Out', icon: 'fa-arrow-right-from-bracket', linkTo: '/Log-Out', isActive: false, position: 'bottom', rotateIcon: true }
  ]
};

// Sample Error
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
          { time: '12am', usages: 0 },
          { time: '1am', usages: 0 },
          { time: '2am', usages: 0 },
          { time: '3am', usages: 0 },
          { time: '4am', usages: 0 },
          { time: '5am', usages: 12 },
          { time: '6am', usages: 0 },
          { time: '7am', usages: 0 },
          { time: '8am', usages: 0 },
          { time: '9am', usages: 0 },
          { time: '10am', usages: 0 },
          { time: '11am', usages: 30 },
          { time: '12pm', usages: 0 },
          { time: '1pm', usages: 0 },
          { time: '2pm', usages: 0 },
          { time: '3pm', usages: 4 },
          { time: '4pm', usages: 0 },
          { time: '5pm', usages: 0 },
          { time: '6pm', usages: 20 },
          { time: '7pm', usages: 59 },
          { time: '8pm', usages: 34 },
          { time: '9pm', usages: 0 },
          { time: '10pm', usages: 0 },
          { time: '11pm', usages: 0 },
          { time: '12am', usages: 0 },
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

function App() {

  const [navItems, setNavItems] = useState(navData.navItems);
  const [toggleMode, setToggleMode] = useState('light');

  const handleNavClick = (label) => {
    const updatedNavItems = navItems.map(item =>
      item.label === label ? { ...item, isActive: true } : { ...item, isActive: false }
    );
    setNavItems(updatedNavItems);
  };

  const handleToggleMode = (mode) => {
    if (mode === 'light') setToggleMode('light');
    else if (mode === 'dark') setToggleMode('dark');
  }

  const dashboardNav = useRef(null);
  const controlNav = () => {
    dashboardNav.current.classList.toggle('show');

    const handleClickOutside = (event) => {
      if (dashboardNav.current && !dashboardNav.current.contains(event.target)) {
        dashboardNav.current.classList.remove('show');
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll);
      }
    };

    const handleScroll = () => {
      if (dashboardNav.current.classList.contains('show')) {
        dashboardNav.current.classList.remove('show');
        document.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };

    // Add the event listeners when the navbar is opened
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Only update state if necessary
    setNavItems((prevNavItems) =>
      prevNavItems.map((item) => ({
        ...item,
        isActive: item.linkTo === currentPath,
      }))
    );
  }, []);

  return (<>
    <BrowserRouter>
      <div className={'App ' + toggleMode}>
        <div className="App-main">
          <nav ref={dashboardNav} className={'dashboard-nav ' + toggleMode}>
            <div className="logo-image">
              <img src={logo} alt="kodeskool" />
            </div>
            <div className="nav-links">
              <div className="nav-top">
                {navItems
                  .filter(item => !item.position)
                  .map(item => (
                    <Link to={item.linkTo} style={{ textDecoration: 'none' }}>
                      <div
                        key={item.label}
                        className={`nav-item ${item.isActive ? 'active' : ''} ${toggleMode}`}
                        onClick={() => handleNavClick(item.label)}
                      >
                        <i className={`${item.isActive ? 'fa-solid' : 'fa-regular'} ${item.icon}`} />
                        <span className='navLabel'>{item.label}</span>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="nav-bottom">
                {navItems
                  .filter(item => item.position === 'bottom')
                  .map(item => (
                    <Link to={item.linkTo} style={{ textDecoration: 'none' }}>
                      <div
                        key={item.label}
                        className={`nav-item ${item.isActive ? 'active' : ''} ${toggleMode}`}
                        onClick={() => handleNavClick(item.label)}
                      >
                        <span style={{ rotate: item.rotateIcon ? '180deg' : '0deg' }}>
                          <i className={`${item.isActive ? 'fa-solid' : 'fa-regular'} ${item.icon}`} />
                        </span>
                        <span className='navLabel'>{item.label}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
            <div className={'d-flex flex-row modeChangeBtn ' + toggleMode}>
              {toggleMode === 'light' ? (
                <>
                  <div className="modeSet" onClick={() => handleToggleMode('light')}>
                    <ion-icon name="sunny"></ion-icon>
                    <span className='navLabel'>Light</span>
                  </div>
                  <div className="modeNotSet" onClick={() => handleToggleMode('dark')}>
                    <ion-icon name="moon-outline"></ion-icon>
                    <span className='navLabel'>Dark</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={'modeNotSet ' + toggleMode} onClick={() => handleToggleMode('light')}>
                    <ion-icon name="sunny-outline"></ion-icon>
                    <span className='navLabel'>Light</span>
                  </div>
                  <div className="modeSet" onClick={() => handleToggleMode('dark')}>
                    <ion-icon name="moon"></ion-icon>
                    <span className='navLabel'>Dark</span>
                  </div>
                </>
              )}
            </div>
          </nav>
          <main>
            <Routes>
              <Route exact path="/" element={<Dashboard toggleMode={toggleMode} user={user} controlNav={controlNav} />} />
              <Route exact path="/Editor" element={<Editor toggleMode={toggleMode} dashboardNav={dashboardNav} user={user} controlNav={controlNav} />} />
              <Route exact path="/Courses" element={<Courses toggleMode={toggleMode} />} >
                <Route path="" element={<CourseList toggleMode={toggleMode} user={user} controlNav={controlNav} />} />
                <Route path="View" element={<CourseView toggleMode={toggleMode}/>} />
                <Route path="Video" element={<CourseVideo toggleMode={toggleMode}/>} />
              </Route>
              <Route exact path="/Chatbot" element={<Chatbot toggleMode={toggleMode} user={user} controlNav={controlNav} />} />
            </Routes>
          </main>
        </div>
        <Footer toggleMode={toggleMode} />
      </div>
    </BrowserRouter>
  </>
  );
}

export default App;
