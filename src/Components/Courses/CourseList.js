import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import cLang from '../../Assets/Img/cLang.png';

function CourseList(props) {
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
            <div className="courses-section my-5">
                <div className="courses-head my-4">
                    <h1>All courses catalog</h1>
                </div>
                <div className="courses-body container">
                    <div className="row gap-4 course-card-collection">

                        <div className="course-card col-md-5 p-4 d-flex align-items-center flex-column gap-3">
                            <div className="course-card-head">
                                <div className="course-image">
                                    <img src={cLang} alt="C language" />
                                </div>
                                <div className="course-name">
                                    <h4>Learn C Programming</h4>
                                </div>
                            </div>
                            <div className="course-body">
                                <div className="level">Beginner</div>
                                <div className="d-flex align-items-center">
                                    <div className="units-number me-2">
                                        <h5>36</h5>
                                    </div>
                                    <div className="units-number">
                                        <h5>Units</h5>
                                    </div>
                                </div>
                                <Link to="/Courses/View">
                                    <div className="playBtn d-flex align-items-center justify-content-center">
                                        <i className="fa-solid fa-play"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="course-card col-md-5 p-4 d-flex align-items-center flex-column gap-3">
                            <div className="course-card-head">
                                <div className="course-image">
                                    <img src={cLang} alt="C language" />
                                </div>
                                <div className="course-name">
                                    <h4>Learn C Programming</h4>
                                </div>
                            </div>
                            <div className="course-body">
                                <div className="level">Beginner</div>
                                <div className="d-flex align-items-center">
                                    <div className="units-number me-2">
                                        <h5>36</h5>
                                    </div>
                                    <div className="units-number">
                                        <h5>Units</h5>
                                    </div>
                                </div>
                                <Link to="/Courses/View" >
                                    <div className="playBtn d-flex align-items-center justify-content-center">
                                        <i className="fa-solid fa-play"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="course-card col-md-5 p-4 d-flex align-items-center flex-column gap-3">
                            <div className="course-card-head">
                                <div className="course-image">
                                    <img src={cLang} alt="C language" />
                                </div>
                                <div className="course-name">
                                    <h4>Learn Java</h4>
                                </div>
                            </div>
                            <div className="course-body">
                                <div className="level">Beginner</div>
                                <div className="d-flex align-items-center">
                                    <div className="units-number me-2">
                                        <h5>36</h5>
                                    </div>
                                    <div className="units-number">
                                        <h5>Units</h5>
                                    </div>
                                </div>
                                <Link to="/Courses/View">
                                    <div className="playBtn d-flex align-items-center justify-content-center">
                                        <i className="fa-solid fa-play"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="course-card col-md-5 p-4 d-flex align-items-center flex-column gap-3">
                            <div className="course-card-head">
                                <div className="course-name">
                                    <h5>Many More Options to Explore</h5>
                                </div>
                            </div>
                            <div className="course-body">
                                <a href='#!' className="btn1 course-play">Explore</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseList;