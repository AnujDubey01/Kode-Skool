import React, { useEffect, useState } from 'react';

const fetchTopic = async (host, topic_id) => {
  const response = await fetch(`${host}/api/get-course-topic?topic_id=${topic_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return response.json();
}

function CourseVideo(props) {
  const [ courseData, setCourseData ] = useState({
    Topic_Name: '',
    Description: '',
    Video_Link: '',
    Notes_Link: ''
  });

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(window.location.search);
      const topic_id = params.get('topic_id')
      let data = await fetchTopic(props.host, topic_id);
      setCourseData(data)
    }

    fetchData();
  }, [props, setCourseData])



  return (
    <>
      <div className="back-arrow">
          <h4
            onClick={() => {
              window.history.back();
            }}
            style={{ cursor: 'pointer', color: 'black' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </h4>
      </div>
      <div className="courses-section">
        <div className="courses-head my-2 d-flex justify-content-between px-3">
          <div className="course-details d-flex flex-column">
            <div className="course-name">
              <h2 id="course-unit">{courseData.Topic_Name}</h2>
            </div>
            <div className="course-video">
              <iframe
                src={courseData.Video_Link}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <div className="course-outline course-topic-card course-topic-body">
              <ul type='circle'>
                <li>{courseData.Description}</li>
                <li>Notes: {courseData.Notes_Link}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseVideo;
