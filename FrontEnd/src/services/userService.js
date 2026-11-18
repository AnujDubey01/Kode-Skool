import api from './api';

export const getProfile = async () => {
    const response = await api.get('/api/profile/student');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.post('/api/profile/student/update', profileData);
    return response.data;
};

const userService = {
    getProfile,
    updateProfile
};

export default userService;
