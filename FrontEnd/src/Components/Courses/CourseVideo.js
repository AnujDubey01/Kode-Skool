import React from 'react'

function CourseVideo() {
    return (
        <>
            <div className="board-heading">
                <div className="welcome-text">
                    <h4 onClick={() => { window.history.back() }} style={{ cursor: "pointer", color: "black" }}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </h4>
                </div>
            </div>
            <div className="courses-section my-3">
                <div className="courses-head my-2 d-flex justify-content-between px-3">
                    <div className="course-details d-flex flex-column">
                        <div className="course-name">
                            <h2  id="course-unit">Unit 1: Variables and Data types</h2>
                        </div>
                        <div className="course-video">
                            <iframe src="https://www.youtube.com/embed/60kyKPfVMAM?si=fevWcxCk9zBYAjwQ"
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <div className="course-outline course-topic-card course-topic-body">
                            <ul>
                                <li>
                                    <h5>Types of Variables</h5>
                                </li>
                                <li>
                                    <h5>Types of Data types</h5>
                                </li>
                                <li>
                                    <h5>Representation of data types and variables</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseVideo