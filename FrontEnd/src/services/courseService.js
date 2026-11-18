import api from './api';

export const getMyCourses = async () => {
    const response = await api.get('/api/my-courses');
    return response.data;
};

export const getCourse = async (courseId) => {
    const response = await api.get(`/api/get-course?course_id=${courseId}`);
    return response.data;
};

export const getCourseStruct = async (courseId) => {
    const response = await api.get(`/api/get-course-struct?course_id=${courseId}`);
    return response.data;
};

export const getCourseTopic = async (topicId) => {
    const response = await api.get(`/api/get-course-topic?topic_id=${topicId}`);
    return response.data;
};

export const rateCourse = async (courseId, rating, feedback) => {
    const response = await api.post('/api/rate-course', {
        course_id: courseId,
        rating,
        feedback
    });
    return response.data;
};

export const enrollCourse = async (courseId) => {
    const response = await api.post('/api/enroll-course', { course_id: courseId });
    return response.data;
};

export const updateCourseStatus = async (courseId, topicId) => {
    const response = await api.post('/api/update-course-status', {
        course_id: courseId,
        topic_id: topicId
    });
    return response.data;
};

export const addCourse = async (courseData) => {
    const response = await api.post('/api/add-course', courseData);
    return response.data;
};

export const getAllCourses = async () => {
    const response = await api.get('/api/all-courses');
    return response.data;
};

export const addCourseStruct = async (structData) => {
    const response = await api.post('/api/add-course-struct', structData);
    return response.data;
};

const courseService = {
    getMyCourses,
    getAllCourses,
    getCourse,
    getCourseStruct,
    getCourseTopic,
    rateCourse,
    enrollCourse,
    updateCourseStatus,
    addCourse,
    addCourseStruct
};

export default courseService;
