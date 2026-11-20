import api from './api';
import { Course, CourseStruct, Topic, CourseEnrollment, ActionResponse } from '../types';

export const getMyCourses = async (): Promise<CourseEnrollment[]> => {
    const response = await api.get<CourseEnrollment[]>('/api/my-courses');
    return response.data;
};

export const getAllCourses = async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/all-courses');
    return response.data;
};

export const getCourses = getAllCourses;

export const getCourse = async (courseId: string): Promise<Course> => {
    const response = await api.get<Course>(`/api/get-course?course_id=${courseId}`);
    return response.data;
};

export const getCourseStruct = async (courseId: string): Promise<CourseStruct> => {
    const response = await api.get<CourseStruct>(`/api/get-course-struct?course_id=${courseId}`);
    return response.data;
};

export const getCourseTopic = async (topicId: string): Promise<Topic> => {
    const response = await api.get<Topic>(`/api/get-course-topic?topic_id=${topicId}`);
    return response.data;
};

export const rateCourse = async (courseId: string, rating: number, feedback?: string): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/rate-course', {
        course_id: courseId,
        rating,
        feedback
    });
    return response.data;
};

export const enrollCourse = async (courseId: string): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/enroll-course', { course_id: courseId });
    return response.data;
};

export const updateCourseStatus = async (courseId: string, topicId: string): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/update-course-status', {
        course_id: courseId,
        topic_id: topicId
    });
    return response.data;
};

export const addCourse = async (courseData: Partial<Course>): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/add-course', courseData);
    return response.data;
};

export const addCourseStruct = async (structData: Partial<CourseStruct>): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/add-course-struct', structData);
    return response.data;
};

const courseService = {
    getMyCourses,
    getAllCourses,
    getCourses,
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