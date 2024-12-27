import React from 'react';

function CourseVideo() {
  const courseData = {
    unit: 'Unit 1: Variables and Data Types',
    videoLink: 'https://www.youtube.com/embed/60kyKPfVMAM?si=fevWcxCk9zBYAjwQ',
    outline: [
      'Types of Variables',
      'Types of Data Types',
      'Representation of Data Types and Variables',
    ],
  };

  return (
    <>
      <div className="board-heading">
        <div className="welcome-text">
          <h4
            onClick={() => {
              window.history.back();
            }}
            style={{ cursor: 'pointer', color: 'black' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </h4>
        </div>
      </div>
      <div className="courses-section my-3">
        <div className="courses-head my-2 d-flex justify-content-between px-3">
          <div className="course-details d-flex flex-column">
            <div className="course-name">
              <h2 id="course-unit">{courseData.unit}</h2>
            </div>
            <div className="course-video">
              <iframe
                src={courseData.videoLink}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <div className="course-outline course-topic-card course-topic-body">
              <ul>
                {courseData.outline.map((topic, index) => (
                  <li key={index}>
                    <h5>{topic}</h5>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseVideo;
