import api from './api';
import { CompilerResponse, ExecuteCodePayload } from '../types';

/**
 * Sends source code to the backend compiler proxy (powered by JDoodle)
 * @param payload - Object containing script, language, and optional stdin
 */
export const executeCode = async (payload: ExecuteCodePayload): Promise<CompilerResponse> => {
    const response = await api.post<CompilerResponse>('/api/compiler/execute', payload);
    return response.data;
};

const compilerService = {
    executeCode
};

export default compilerService;
