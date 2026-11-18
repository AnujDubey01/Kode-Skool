import api from './api';

export const getAdminStats = async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
};

export const getSchool = async () => {
    const response = await api.get('/api/admin/school');
    return response.data;
};

export const updateSchool = async (schoolData) => {
    const response = await api.post('/api/admin/school', schoolData);
    return response.data;
};

export const getUsers = async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/api/admin/users/create', userData);
    return response.data;
};

export const bulkImportUsers = async (users) => {
    const response = await api.post('/api/admin/users/bulk-import', { users });
    return response.data;
};

export const assignCourse = async (assignmentData) => {
    const response = await api.post('/api/admin/courses/assign', assignmentData);
    return response.data;
};

export const getReports = async () => {
    const response = await api.get('/api/admin/reports');
    return response.data;
};

const adminService = {
    getAdminStats,
    getSchool,
    updateSchool,
    getUsers,
    createUser,
    bulkImportUsers,
    assignCourse,
    getReports
};

export default adminService;
