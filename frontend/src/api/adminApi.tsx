import api from './axios';

interface AWSCredential {
  accountName: string;
  accessKey: string;
  secretKey: string;
  region: string;
}

interface StoredCredential {
  id: string;
  accountName: string;
  region: string;
}

export const saveCredentials = async (credentials: AWSCredential): Promise<string> => {
  const response = await api.post<string>('/admin/aws', credentials);
  return response.data;
};

export const getCredentials = async (): Promise<StoredCredential[]> => {
  const response = await api.get<StoredCredential[]>('/admin/aws');
  return response.data;
};