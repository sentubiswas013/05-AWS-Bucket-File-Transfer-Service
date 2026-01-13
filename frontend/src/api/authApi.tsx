import api from './axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<void> => {
  const response = await api.post<LoginResponse>('/auth/login', { username, password });
  localStorage.setItem('token', response.data.token);
};