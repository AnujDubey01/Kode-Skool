import React from 'react'
import { Link } from 'react-router-dom';

import card from '../../Assets/Img/card.png';

function CourseView() {

    return (
        <>
            <div className="board-heading">
                <div className="welcome-text">
                    <h4 onClick={() => {window.history.back()}} style={{ cursor: "pointer", color: "black" }}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </h4>
                </div>
            </div>
            <div className="courses-section my-5">
                <div className="courses-head my-4 d-flex justify-content-between px-3">
                    <div className="course-details d-flex flex-column gap-3">
                        <div className="course-name">
                            <h2>Python</h2>
                        </div>
                        <div className="course-about">
                            <p>Learn python to quickly develop anything from web development to artificial intelligence
                            </p>
                        </div>
                    </div>
                    <div className="course-img">
                        <img src={card /* It's temporary */} alt="coursecard" />
                    </div>
                </div>
                <div className="courses-body container">
                    <div className="course-topics">
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 1: Variables and Data types</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play" style={{textDecoration: 'none'}}>Play</Link>
                                </div>
                            </div>
                            <div className="course-topic-body">
                                <ul>
                                    <li>Types of variables</li>
                                    <li>Types of Data types</li>
                                    <li>Representation of data types and variables</li>
                                </ul>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 2: Strings and Conditional statements</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>
                            <div className="course-topic-body">
                                <ul>
                                    <li>Types of strings</li>
                                    <li>If..Else</li>
                                    <li>ElseIf</li>
                                    <li>Else</li>
                                    <li>Nested If</li>
                                </ul>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 3: List and Tuple</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>

                        </div>
                        <div className="course-topic-card">
                            <div className="course-topic-head">
                                <div className="topic-head">
                                    <h3>Unit 4: Dictionary and Set</h3>
                                </div>
                                <div className="playbtn">
                                    <Link to="/Courses/Video" className="btn1 course-play">Play</Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseView