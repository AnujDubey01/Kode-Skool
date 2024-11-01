import './App.css';
import logo from './Assets/Img/logo.png';
import { useState } from 'react';
import Dashboard from './Components/Dashboard';

// Simulating the JSON data
const navData = {
  navItems: [
    { label: 'Home', icon: 'fa-house', isActive: true },
    { label: 'Editor', icon: 'fa-pen', isActive: false },
    { label: 'Courses', icon: 'fa-note-sticky', isActive: false },
    { label: 'Profile', icon: 'fa-user-tie', isActive: false },
    { label: 'Chat Bot', icon: 'fa-comment-dots', isActive: false },
    { label: 'Settings', icon: 'fa-gear', isActive: false, position: 'bottom' },
    { label: 'Log Out', icon: 'fa-arrow-right-from-bracket', isActive: false, position: 'bottom', rotateIcon: true }
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
  

  return (
    <div className={'App ' + toggleMode}>
      <nav className={'dashboard-nav ' +toggleMode}>
        <div className="logo-image">
          <img src={logo} alt="kodeskool" />
        </div>
        <div className="nav-links">
          <div className="nav-top">
            {navItems
              .filter(item => !item.position)
              .map(item => (
                <div
                  key={item.label}
                  className={`nav-item ${item.isActive ? 'active' : ''} ${toggleMode}`}
                  onClick={() => handleNavClick(item.label)}
                >
                  <i className={`${item.isActive ? 'fa-solid' : 'fa-regular'} ${item.icon}`} />
                  <span className='navLabel'>{item.label}</span>
                </div>
              ))}
          </div>
          <div className="nav-bottom">
            {navItems
              .filter(item => item.position === 'bottom')
              .map(item => (
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
              <div className={'modeNotSet '+toggleMode} onClick={() => handleToggleMode('light')}>
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
          <Dashboard toggleMode={toggleMode} />
      </main>
    </div>
  );
}

export default App;
