import api from './api';

import { TeacherDashboardResponse, TeacherStudentsResponse, TeacherAssessmentsResponse } from '../types'

export const getTeacherDashboard = async (): Promise<TeacherDashboardResponse> => {
    const response = await api.get<TeacherDashboardResponse>('/api/teacher/dashboard');
    return response.data;
};

export const getStudentsProgress = async (): Promise<TeacherStudentsResponse> => {
    const response = await api.get<TeacherStudentsResponse>('/api/teacher/students');
    return response.data;
};

export const getAssessmentOverview = async (): Promise<TeacherAssessmentsResponse> => {
    const response = await api.get<TeacherAssessmentsResponse>('/api/teacher/assessments');
    return response.data;
};

const teacherService = {
    getTeacherDashboard,
    getStudentsProgress,
    getAssessmentOverview
};

export default teacherService;
