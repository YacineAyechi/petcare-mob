import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

class ServiceService {
  async getAllServices(): Promise<Service[]> {
    return apiClient.get<Service[]>(API_ENDPOINTS.SERVICES.BASE);
  }

  async getServiceById(id: string): Promise<Service> {
    return apiClient.get<Service>(API_ENDPOINTS.SERVICES.BY_ID(id));
  }

  async createService(data: CreateServiceData): Promise<Service> {
    return apiClient.post<Service>(API_ENDPOINTS.SERVICES.BASE, data);
  }

  async updateService(id: string, data: UpdateServiceData): Promise<Service> {
    return apiClient.put<Service>(API_ENDPOINTS.SERVICES.BY_ID(id), data);
  }

  async deleteService(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.SERVICES.BY_ID(id));
  }
}

export const serviceService = new ServiceService();

