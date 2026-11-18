import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import courseService from '../services/courseService';

function CourseVideo(props) {
  const [courseData, setCourseData] = useState({
    Course_ID: '',
    Topic_Name: '',
    Description: '',
    Video_Link: '',
    Notes_Link: ''
  });
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams(location.search);
        const topic_id = params.get('topic_id');
        if (topic_id) {
          const data = await courseService.getCourseTopic(topic_id);
          if (data) {
            setCourseData(data);
          }
        }
      } catch (err) {
        console.error("Error fetching course topic:", err);
      }
    }

    fetchData();
  }, [location.search]);

  const handleBackClick = async () => {
    try {
      if (courseData.Course_ID && courseData._id) {
        const result = await courseService.updateCourseStatus(courseData.Course_ID, courseData._id);
        if (result && result.success) {
          alert(result.msg);
        }
      }
    } catch (err) {
      console.error("Error updating course status:", err);
    }

    window.history.back();
  };

  return (
    <div className="w-full">
      {/* Back Bar */}
      <div className="mb-4">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-blue transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Course</span>
        </button>
      </div>

      <div className="w-full flex flex-col gap-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {courseData.Topic_Name || 'Lesson Topic'}
        </h1>

        {/* Video Player */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
          {courseData.Video_Link ? (
            <iframe
              src={courseData.Video_Link}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No video available for this lesson.
            </div>
          )}
        </div>

        {/* Notes & Outline */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-book-open text-brand-blue"></i>
            Lesson Notes & Resources
          </h3>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            {courseData.Description || 'No description provided for this topic.'}
          </p>
          {courseData.Notes_Link && (
            <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mr-2">Documentation:</span>
              <a
                href={courseData.Notes_Link}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-medium text-brand-navy dark:text-brand-sky hover:underline break-all"
              >
                {courseData.Notes_Link}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseVideo;
