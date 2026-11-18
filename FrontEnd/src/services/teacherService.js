import api from './api';

export const getTeacherDashboard = async () => {
    const response = await api.get('/api/teacher/dashboard');
    return response.data;
};

export const getStudentsProgress = async () => {
    const response = await api.get('/api/teacher/students');
    return response.data;
};

export const getAssessmentOverview = async () => {
    const response = await api.get('/api/teacher/assessments');
    return response.data;
};

const teacherService = {
    getTeacherDashboard,
    getStudentsProgress,
    getAssessmentOverview
};

export default teacherService;
