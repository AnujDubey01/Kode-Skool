import api from './api';
import { AdminStatsResponse, SchoolResponse, AdminUsersResponse, CreateUserResponse, BulkImportResponse, AssignCoursePayload, AdminReportsResponse, SchoolData, GetUsersParams, ActionResponse } from '../types';

export const getAdminStats = async (): Promise<AdminStatsResponse> => {
    const response = await api.get<AdminStatsResponse>('/api/admin/stats');
    return response.data;
};

export const getSchool = async (): Promise<SchoolResponse> => {
    const response = await api.get<SchoolResponse>('/api/admin/school');
    return response.data;
};

export const updateSchool = async (schoolData: Partial<SchoolData>): Promise<SchoolResponse> => {
    const response = await api.post<SchoolResponse>('/api/admin/school', schoolData);
    return response.data;
};

export const getUsers = async (params: GetUsersParams = {}): Promise<AdminUsersResponse> => {
    const response = await api.get<AdminUsersResponse>('/api/admin/users', { params });
    return response.data;
};

export const createUser = async (userData): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/api/admin/users/create', userData);
    return response.data;
};

export const bulkImportUsers = async (users: BulkImportResponse[]): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/admin/users/bulk-import', { users });
    return response.data;
};

export const assignCourse = async (assignmentData: AssignCoursePayload): Promise<ActionResponse> => {
    const response = await api.post<ActionResponse>('/api/admin/courses/assign', assignmentData);
    return response.data;
};

export const getReports = async (): Promise<AdminReportsResponse> => {
    const response = await api.get<AdminReportsResponse>('/api/admin/reports');
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
