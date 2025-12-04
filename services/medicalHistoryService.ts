import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export interface MedicalRecord {
  _id: string;
  pet: string;
  date: string;
  type: string;
  description: string;
  veterinarian?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordData {
  date: string;
  type: string;
  description: string;
  veterinarian?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface UpdateMedicalRecordData
  extends Partial<CreateMedicalRecordData> {}

class MedicalHistoryService {
  async getPetMedicalHistory(petId: string): Promise<MedicalRecord[]> {
    return apiClient.get<MedicalRecord[]>(
      API_ENDPOINTS.PETS.MEDICAL_HISTORY(petId)
    );
  }

  async createMedicalRecord(
    petId: string,
    data: CreateMedicalRecordData
  ): Promise<MedicalRecord> {
    return apiClient.post<MedicalRecord>(
      API_ENDPOINTS.PETS.MEDICAL_HISTORY(petId),
      data
    );
  }

  async updateMedicalRecord(
    petId: string,
    recordId: string,
    data: UpdateMedicalRecordData
  ): Promise<MedicalRecord> {
    return apiClient.put<MedicalRecord>(
      `${API_ENDPOINTS.PETS.MEDICAL_HISTORY(petId)}/${recordId}`,
      data
    );
  }

  async deleteMedicalRecord(petId: string, recordId: string): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.PETS.MEDICAL_HISTORY(petId)}/${recordId}`
    );
  }
}

export const medicalHistoryService = new MedicalHistoryService();

