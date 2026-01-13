import api from './axios';

interface TransferRequest {
  sourceBucket: string;
  destinationBucket: string;
  fileKey: string;
}

export const startTransfer = async (data: TransferRequest): Promise<string> => {
  const response = await api.post<string>('/transfer', data);
  return response.data;
};

export const getTransferStatus = async (jobId: string): Promise<string> => {
  const response = await api.get<string>(`/transfer/${jobId}/status`);
  return response.data;
};