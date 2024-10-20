import '../css/navbar.css';
import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png'; // Import the logo image

function Navbar() {
  const navbarCollapseRef = useRef(null);
  const navbarTogglerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const navbarCollapse = navbarCollapseRef.current;
    const navbarToggler = navbarTogglerRef.current;

    const handleTogglerClick = () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('glassmorphism');
      } else if (window.innerWidth < 992) {
        navbarCollapse.classList.add('glassmorphism');
      }
    };

    const handleCollapseHidden = () => {
      navbarCollapse.classList.remove('glassmorphism');
    };

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        navbarCollapse.classList.remove('glassmorphism');
        navbarCollapse.classList.remove('show');
      } else if (!navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.add('glassmorphism');
      }
    };

    navbarToggler.addEventListener('click', handleTogglerClick);
    navbarCollapse.addEventListener('hidden.bs.collapse', handleCollapseHidden);
    window.addEventListener('resize', handleResize);

    return () => {
      navbarToggler.removeEventListener('click', handleTogglerClick);
      navbarCollapse.removeEventListener('hidden.bs.collapse', handleCollapseHidden);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navCustom">
      <div className="container">
        <div className="logo col-md-2">
          <img src={logo} alt="KodeSkool" />
        </div>
        <button
          className="navbar-toggler"
          ref={navbarTogglerRef}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse text-center fs-5 col-md-10" id="navbarSupportedContent" ref={navbarCollapseRef}>
          <ul className="navbar-nav ms-auto my-3">
            <li className="nav-item">
              <a className="nav-link me-3 txtBtn" href="#Home">
                Courses
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link me-3 txtBtn" href="#About">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link me-3 txtBtn" href="#Contact">
                Contact Us
              </a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto my-3 d-flex flex-row center-btns">
            <li className="nav-item m-1">
              <button
                type="button"
                className="btn btn0"
                onClick={() => navigate('/login?tab=signup')}
              >
                Sign Up
              </button>
            </li>
            <li className="nav-item m-1">
              <button
                type="button"
                className="btn btn1"
                onClick={() => navigate('/login?tab=signin')}
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar