import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';

import logo from './Assets/Img/logo.png';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Courses from './pages/Courses';
import CourseList from './pages/CourseList';
import CourseView from './pages/CourseView';
import CourseVideo from './pages/CourseVideo';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Footer from './components/common/Footer';
import userService from './services/userService';

const navData = {
  navItems: [
    { label: 'Home', icon: 'fa-house', linkTo: '/dashboard', isActive: true },
    { label: 'Editor', icon: 'fa-pen', linkTo: '/Editor', isActive: false },
    { label: 'Courses', icon: 'fa-note-sticky', linkTo: '/Courses', isActive: false },
    { label: 'Profile', icon: 'fa-user-tie', linkTo: '/Profile', isActive: false },
    { label: 'Chat Bot', icon: 'fa-comment-dots', linkTo: '/Chatbot', isActive: false },
    { label: 'Settings', icon: 'fa-gear', linkTo: '/Settings', isActive: false, position: 'bottom' },
    { label: 'Log Out', icon: 'fa-arrow-right-from-bracket', linkTo: '/Logout', isActive: false, position: 'bottom', rotateIcon: true }
  ]
};

// Sample Data For Dashboard
const defaultUser = {
  name: localStorage.getItem('user_name') || 'Student',
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

/* ── AppShell: the authenticated dashboard wrapper ── */
function AppShell({ toggleMode, handleToggleMode, navItems, handleNavClick, dashboardNav, controlNav, user }) {
  const { isLoggedIn, role, logout, userName, setUserName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function syncName() {
      try {
        if (localStorage.getItem('auth_token')) {
          const profile = await userService.getProfile();
          if (profile && profile.Name) {
            localStorage.setItem('user_name', profile.Name);
            if (setUserName) setUserName(profile.Name);
          }
        }
      } catch (e) {
        // non-blocking
      }
    }
    syncName();
  }, [setUserName]);

  const dynamicName = userName || localStorage.getItem('user_name') || user?.name || 'Student';
  const dynamicUser = {
    ...user,
    name: dynamicName
  };

  const isChatbot = location.pathname.toLowerCase().startsWith('/chatbot');

  if (!isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const effectiveNavItems = role === 'Admin' ? [
    { label: 'Admin Hub', icon: 'fa-shield-halved', linkTo: '/admin/dashboard', isActive: location.pathname.toLowerCase().startsWith('/admin') },
    { label: 'Courses', icon: 'fa-note-sticky', linkTo: '/Courses', isActive: location.pathname.toLowerCase().startsWith('/courses') },
    { label: 'Settings', icon: 'fa-gear', linkTo: '/Settings', isActive: false, position: 'bottom' },
    { label: 'Log Out', icon: 'fa-arrow-right-from-bracket', linkTo: '/Logout', isActive: false, position: 'bottom', rotateIcon: true }
  ] : (role === 'Faculty' || role === 'Teacher') ? [
    { label: 'Faculty Hub', icon: 'fa-chalkboard-user', linkTo: '/teacher/dashboard', isActive: location.pathname.toLowerCase().startsWith('/teacher') },
    { label: 'Courses', icon: 'fa-note-sticky', linkTo: '/Courses', isActive: location.pathname.toLowerCase().startsWith('/courses') },
    { label: 'Editor', icon: 'fa-pen', linkTo: '/Editor', isActive: location.pathname.toLowerCase().startsWith('/editor') },
    { label: 'Profile', icon: 'fa-user-tie', linkTo: '/Profile', isActive: location.pathname.toLowerCase().startsWith('/profile') },
    { label: 'Settings', icon: 'fa-gear', linkTo: '/Settings', isActive: false, position: 'bottom' },
    { label: 'Log Out', icon: 'fa-arrow-right-from-bracket', linkTo: '/Logout', isActive: false, position: 'bottom', rotateIcon: true }
  ] : navItems.map(item => ({
    ...item,
    isActive: location.pathname.toLowerCase().startsWith(item.linkTo.toLowerCase())
  }));

  const handleNavClickInternal = (label) => {
    if (label === 'Log Out') {
      logout();
      navigate('/login?tab=signin');
      return;
    }
    handleNavClick(label);
  };

  return (
    <div className={'App ' + toggleMode}>
      <div className="App-main">
        <nav ref={dashboardNav} className={'dashboard-nav ' + toggleMode}>
          <div className="logo-image">
            <Link to={role === 'Admin' ? '/admin/dashboard' : (role === 'Faculty' || role === 'Teacher') ? '/teacher/dashboard' : '/dashboard'}>
              <img src={logo} alt="kodeskool" />
            </Link>
          </div>
          <div className="nav-links">
            <div className="nav-top">
              {effectiveNavItems
                .filter(item => !item.position)
                .map(item => (
                  <Link key={item.label} to={item.linkTo} style={{ textDecoration: 'none' }}>
                    <div
                      className={`nav-item ${item.isActive ? 'active' : ''} ${toggleMode}`}
                      onClick={() => handleNavClickInternal(item.label)}
                    >
                      <i className={`fa-solid ${item.icon}`} />
                      <span className='navLabel'>{item.label}</span>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="nav-bottom">
              {effectiveNavItems
                .filter(item => item.position === 'bottom')
                .map(item => (
                  <Link key={item.label} to={item.linkTo} style={{ textDecoration: 'none' }}>
                    <div
                      className={`nav-item ${item.isActive ? 'active' : ''} ${toggleMode}`}
                      onClick={() => handleNavClickInternal(item.label)}
                    >
                      <span style={{ rotate: item.rotateIcon ? '180deg' : '0deg' }}>
                        <i className={`fa-solid ${item.icon}`} />
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
            <Route path="/admin/dashboard" element={<AdminDashboard toggleMode={toggleMode} />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard toggleMode={toggleMode} />} />
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard toggleMode={toggleMode} user={dynamicUser} controlNav={controlNav} />} />
            <Route path="/Editor" element={<Editor toggleMode={toggleMode} dashboardNav={dashboardNav} user={dynamicUser} controlNav={controlNav} />} />
            <Route path="/editor" element={<Editor toggleMode={toggleMode} dashboardNav={dashboardNav} user={dynamicUser} controlNav={controlNav} />} />
            <Route exact path="/Courses" element={<Courses toggleMode={toggleMode} />}>
              <Route path="" element={<CourseList toggleMode={toggleMode} user={dynamicUser} controlNav={controlNav} />} />
              <Route path="View" element={<CourseView toggleMode={toggleMode} />} />
              <Route path="Video" element={<CourseVideo toggleMode={toggleMode} />} />
            </Route>
            <Route exact path="/courses" element={<Courses toggleMode={toggleMode} />}>
              <Route path="" element={<CourseList toggleMode={toggleMode} user={dynamicUser} controlNav={controlNav} />} />
              <Route path="View" element={<CourseView toggleMode={toggleMode} />} />
              <Route path="Video" element={<CourseVideo toggleMode={toggleMode} />} />
            </Route>
            <Route path="/Chatbot" element={<Chatbot toggleMode={toggleMode} user={dynamicUser} controlNav={controlNav} />} />
            <Route path="/chatbot" element={<Chatbot toggleMode={toggleMode} user={dynamicUser} controlNav={controlNav} />} />
            <Route path="/Profile" element={<Profile toggleMode={toggleMode} controlNav={controlNav} />} />
            <Route path="/profile" element={<Profile toggleMode={toggleMode} controlNav={controlNav} />} />
            <Route path="*" element={<Navigate to={role === 'Admin' ? '/admin/dashboard' : (role === 'Faculty' || role === 'Teacher') ? '/teacher/dashboard' : '/dashboard'} replace />} />
          </Routes>
        </main>
      </div>
      {!isChatbot && <Footer toggleMode={toggleMode} />}
    </div>
  );
}

function AppContent() {
  const [navItems, setNavItems] = useState(navData.navItems);
  const [toggleMode, setToggleMode] = useState('light');

  const handleNavClick = (label) => {
    const updatedNavItems = navItems.map(item => {
      return item.label === label ? { ...item, isActive: true } : { ...item, isActive: false };
    });
    setNavItems(updatedNavItems);
  };

  const handleToggleMode = (mode) => {
    setToggleMode(mode);
  };

  const dashboardNav = useRef(null);
  const controlNav = () => {
    if (!dashboardNav.current) return;
    dashboardNav.current.classList.toggle('show');

    const handleClickOutside = (event) => {
      if (dashboardNav.current && !dashboardNav.current.contains(event.target)) {
        dashboardNav.current.classList.remove('show');
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll);
      }
    };

    const handleScroll = () => {
      if (dashboardNav.current?.classList.contains('show')) {
        dashboardNav.current.classList.remove('show');
        document.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
  };

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) return;
    const currentPath = window.location.pathname;
    setNavItems((prevNavItems) =>
      prevNavItems.map((item) => ({
        ...item,
        isActive: item.linkTo.toLowerCase() === currentPath.toLowerCase(),
      }))
    );
  }, []);

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public landing page */}
      <Route path="/home" element={<LandingPage />} />

      {/* Public Login & Register page (migrated from Pug) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />

      {/* Authenticated dashboard shell */}
      <Route
        path="/*"
        element={
          <AppShell
            toggleMode={toggleMode}
            handleToggleMode={handleToggleMode}
            navItems={navItems}
            handleNavClick={handleNavClick}
            dashboardNav={dashboardNav}
            controlNav={controlNav}
            user={defaultUser}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
