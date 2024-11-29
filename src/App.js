import './App.css';
import logo from './Assets/Img/logo.png';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from './Components/Dashboard';
import Footer from './Components/Footer';
import Editor from './Components/Editor';

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
              <Route exact path="/" element={<Dashboard toggleMode={toggleMode} controlNav={controlNav} />} />
              <Route exact path="/Editor" element={<Editor toggleMode={toggleMode} dashboardNav={dashboardNav} />} />
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
