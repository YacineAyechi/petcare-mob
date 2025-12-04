import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export interface Vaccination {
  _id: string;
  pet: string;
  vaccineName: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVaccinationData {
  pet: string;
  vaccineName: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  notes?: string;
}

export interface UpdateVaccinationData extends Partial<CreateVaccinationData> {}

class VaccinationService {
  async getAllVaccinations(): Promise<Vaccination[]> {
    return apiClient.get<Vaccination[]>(API_ENDPOINTS.VACCINATIONS.BASE);
  }

  async getPetVaccinations(petId: string): Promise<Vaccination[]> {
    return apiClient.get<Vaccination[]>(
      API_ENDPOINTS.PETS.VACCINATIONS(petId)
    );
  }

  async createVaccination(
    petId: string,
    data: CreateVaccinationData
  ): Promise<Vaccination> {
    return apiClient.post<Vaccination>(
      API_ENDPOINTS.PETS.VACCINATIONS(petId),
      data
    );
  }

  async updateVaccination(
    petId: string,
    vaccinationId: string,
    data: UpdateVaccinationData
  ): Promise<Vaccination> {
    return apiClient.put<Vaccination>(
      `${API_ENDPOINTS.PETS.VACCINATIONS(petId)}/${vaccinationId}`,
      data
    );
  }

  async deleteVaccination(
    petId: string,
    vaccinationId: string
  ): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.PETS.VACCINATIONS(petId)}/${vaccinationId}`
    );
  }
}

export const vaccinationService = new VaccinationService();

