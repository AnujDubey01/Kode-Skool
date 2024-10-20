import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png'; // Import the logo image
import loginImg from '../assets/img/loginImg.png';

function Authentication(props) {
    const [authRole, setAuthRole] = useState('signup');

    useEffect(() => {
        setAuthRole(props.params.tab || 'signup');
    }, [props.params]);

    function switchToSignin() {
        setAuthRole('signin');
    }

    function switchToSignup() {
        setAuthRole('signup');
    }

    function toggleRoles() {
        const roleSelection = document.getElementById('roleSelection');
        const instituteSelect = document.querySelector('input[name="institution"]:checked');
        if (instituteSelect) {
            roleSelection.style.display = (instituteSelect.value === 'school' || instituteSelect.value === 'college') ? 'flex' : 'none';
        }
    }

    function validateSignup() {
        const email = document.getElementById('email').value;
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const institutionSelectedSignup = document.querySelector('input[name="institution"]:checked');

        if (!email || !username || !password || !institutionSelectedSignup) {
            alert("Please fill in all fields and select an institution.");
            return false; // Prevent form submission
        }
        return true; // Allow form submission
    }

    function validateSignin() {
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        const institutionSelectedSignin = document.querySelector('input[name="institution"]:checked');
        if (!email || !password || !institutionSelectedSignin) {
            alert("Please fill in all fields and select an institution.");
            return false; // Prevent form submission
        }
        return true; // Allow form submission
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navCustom">
                <div className="container">
                    <div className="logo col-md-2">
                        <img src={logo} alt="KodeSkool" />
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse text-center fs-5 col-md-10" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto my-3">
                            <li className="nav-item">
                                <a className="nav-link me-3 txtBtn" href="#About">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-3 txtBtn" href="#Course">Courses</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <header id="header">
                <div className="container px-4">
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center justify-content-start">
                            <img src={loginImg} alt="" className="img-fluid hero-img" />
                        </div>


                        <div className="col-md-6 rightSec">
                            <div id="ele1"
                                className={`OuterCircle animateElement ${authRole} d-flex align-items-center justify-content-center `}>
                                <div className="InnerCircle"></div>
                            </div>
                            <div id="ele2"
                                className={`OuterCircle1 animateElement ${authRole} d-flex align-items-center justify-content-center `}>
                                <div className="InnerCircle1"></div>
                            </div>
                            <div id='ele3'
                                className={`CoursesOuter animateElement ${authRole} d-flex align-items-center justify-content-center`}>
                                <p>Courses</p>
                            </div>
                            <div id='ele4'
                                className={`TestOuter animateElement ${authRole} d-flex align-items-center justify-content-center`}>
                                <p>Test</p>
                            </div>
                            <div className="card py-1 d-flex flex-column align-items-center gap-3">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <button className={`nav-link ${authRole === 'signup' ? 'active' : ''}`} id="signup-tab"
                                            type="button" role="tab" aria-controls="signup"
                                            aria-selected={authRole === 'signup'} onClick={switchToSignup}>Sign Up</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${authRole === 'signin' ? 'active' : ''}`} id="signin-tab"
                                            type="button" role="tab" aria-controls="signin"
                                            aria-selected={authRole === 'signin'} onClick={switchToSignin}>Sign In</button>
                                    </li>
                                </ul>
                                <div className="selectUser d-flex flex-column">
                                    <div id="instituteSelect" className="d-flex gap-5">
                                        <label className="custom-radio">
                                            <input type="radio" name="institution" value="school" onClick={toggleRoles}
                                                required />
                                            <span className="radio-btn"></span> School
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="institution" value="college" onClick={toggleRoles}
                                                required />
                                            <span className="radio-btn"></span> College
                                        </label>
                                    </div>
                                    <hr className="m-1" />
                                    <div id="roleSelection" className="gap-5" style={{ display: 'none' }}>
                                        <label className="custom-radio">
                                            <input type="radio" name="role" value="faculty" checked="checked" />
                                            <span className="radio-btn"></span> Faculty
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="role" value="student" />
                                            <span className="radio-btn"></span> Student
                                        </label>
                                    </div>
                                </div>
                                <div className="tab-content" id="myTabContent">
                                    <div className={`tab-pane fade ${authRole === 'signin' ? 'show active' : ''}`} id="signin" role="tabpanel" aria-labelledby="signin-tab">
                                        <form onSubmit={validateSignin}>
                                            <div className="mb-3">
                                                <label htmlFor="signinEmail" className="form-label">Email ID</label>
                                                <input type="email" className="form-control" id="signinEmail"
                                                    placeholder="Enter Email Id..." required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="signinPassword" className="form-label">Password</label>
                                                <input type="password" className="form-control" id="signinPassword"
                                                    placeholder="Enter Password..." required />
                                            </div>
                                            <button type="submit" className="btn regBtn">Sign In</button>
                                            <p className="mt-3">Don't have an account?
                                                <a href="#!" className="mt-0 anc-link" id="toggleToSignup" onClick={switchToSignup}>Sign Up</a>
                                            </p>
                                        </form>
                                    </div>
                                    <div className={`tab-pane fade ${authRole === 'signup' ? 'show active' : ''}`} id="signup" role="tabpanel" aria-labelledby="signup-tab">
                                        <form onSubmit={validateSignup}>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email ID</label>
                                                <input type="email" className="form-control" id="email"
                                                    placeholder="Enter Email Id..." required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newUsername" className="form-label">User Name</label>
                                                <input type="text" className="form-control" id="newUsername"
                                                    placeholder="Enter User Name..." required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label">Password</label>
                                                <input type="password" className="form-control" id="newPassword"
                                                    placeholder="Create Password..." required />
                                            </div>
                                            <button type="submit" className="btn regBtn">Register</button>
                                            <p className="mt-3">Already have an account?
                                                <a href="#!" className="mt-0 anc-link" id="toggleToSignin" onClick={switchToSignin}>Sign In</a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Authentication;
