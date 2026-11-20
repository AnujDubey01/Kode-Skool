import api from './api';
import type {
    UserProfile,
    UpdateProfileData,
    UpdateProfileResponse
} from '../types';

// export const getProfile = async () => {
//     const response = await api.get('/api/profile/student');
//     return response.data;
// };

export const getProfile = async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/profile/student');
    return response.data
}

// export const updateProfile = async (profileData) => {
//     const response = await api.post('/api/profile/student/update', profileData);
//     return response.data;
// };

export const updateProfile = async (
    profileData: UpdateProfileData
): Promise<UpdateProfileResponse> => {
    const response = await api.post<UpdateProfileResponse>(
        '/api/profile/student/update', profileData
    );
    return response.data

}

const userService = {
    getProfile,
    updateProfile
};

export default userService;
