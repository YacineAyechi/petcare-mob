import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight?: number;
  color?: string;
  photo?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetData {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight?: number;
  color?: string;
  photo?: string;
}

export interface UpdatePetData extends Partial<CreatePetData> {}

class PetService {
  async getAllPets(): Promise<Pet[]> {
    return apiClient.get<Pet[]>(API_ENDPOINTS.PETS.BASE);
  }

  async getPetById(id: string): Promise<Pet> {
    return apiClient.get<Pet>(API_ENDPOINTS.PETS.BY_ID(id));
  }

  async createPet(data: CreatePetData): Promise<Pet> {
    return apiClient.post<Pet>(API_ENDPOINTS.PETS.BASE, data);
  }

  async updatePet(id: string, data: UpdatePetData): Promise<Pet> {
    return apiClient.put<Pet>(API_ENDPOINTS.PETS.BY_ID(id), data);
  }

  async deletePet(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PETS.BY_ID(id));
  }
}

export const petService = new PetService();
