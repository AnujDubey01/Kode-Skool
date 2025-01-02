import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import cLang from '../../Assets/Img/cLang.png';

const getEnrolledCourses = async (host) => {
    const response = await fetch(`${host}/api/my-courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth_token')
        }
    });

    return response.json();
}

const getCourseDetails = async (host, id) => {
    const response = await fetch(`${host}/api/get-course?course_id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json();
}

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

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let tempCourses = [];
            const Enrolled_Courses = await getEnrolledCourses(props.host);

            for (const crs of Enrolled_Courses) {
                const Course_Details = await getCourseDetails(props.host, crs.Course_ID);
                const queryParams = new URLSearchParams({ course_id: crs.Course_ID }).toString();
                tempCourses.push({
                    id: crs.Course_ID,
                    name: Course_Details.Course_Name,
                    image: cLang,
                    level: 'Beginner',
                    units: Course_Details.Units,
                    link: `/Courses/View?${queryParams}`
                });
            }

            setCourses(tempCourses);
        }

        fetchData();
    }, [props]);


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
                    <h1>All Courses Catalog</h1>
                </div>
                <div className="courses-body d-flex align-items-center justify-content-center">
                    <div className="row gap-4 course-card-collection">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="course-card col-md-5 p-4 d-flex align-items-center flex-column gap-3"
                            >
                                <div className="course-card-head">
                                    <div className="course-image">
                                        <img src={course.image} alt={course.name} />
                                    </div>
                                    <div className="course-name">
                                        <h4>{course.name}</h4>
                                    </div>
                                </div>
                                <div className="course-body">
                                    <div className="level">{course.level}</div>
                                    <div className="d-flex gap-2">
                                        <div className="units-number">
                                            <h5>{course.units}</h5>
                                        </div>
                                        <div className="units-number">
                                            <h5>Units</h5>
                                        </div>
                                    </div>
                                    <Link to={course.link}>
                                        <div className="playBtn d-flex align-items-center justify-content-center">
                                            <i className="fa-solid fa-play"></i>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        <div className="course-card col-md-5 p-4 d-flex align-items-center justify-content-center flex-column gap-3">
                            <div className="course-card-head d-flex align-items-center justify-content-center">
                                <div className="course-name">
                                    <h5>Many More Options to Explore</h5>
                                </div>
                            </div>
                            <div className="course-explore">
                                <a href="#!" className="btn1 course-play" style={{textDecoration: 'none'}}>
                                    Explore
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseList;