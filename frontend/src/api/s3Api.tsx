import api from './axios';

export const listFiles = async (bucket: string): Promise<string[]> => {
  const response = await api.get<string[]>(`/s3/${bucket}/files`);
  return response.data;
};

export const uploadFile = async (bucket: string, file: File, key?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  if (key) formData.append('key', key);
  
  const response = await api.post<string>(`/s3/${bucket}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const downloadFile = async (bucket: string, key: string): Promise<Blob> => {
  const response = await api.get(`/s3/${bucket}/download/${encodeURIComponent(key)}`, {
    responseType: 'blob'
  });
  return response.data;
};