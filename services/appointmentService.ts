import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import { Pet } from "./petService";
import { Service } from "./serviceService";

export interface PopulatedUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface Appointment {
  _id: string;
  petId: Pet | string;
  ownerId: PopulatedUser | string;
  veterinarianId?: PopulatedUser | string | null;
  serviceId: Service | string;
  clinicName: string;
  clinicAddress: string;
  appointmentType: string;
  dateTime: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  petId: string;
  serviceId: string;
  clinicName?: string;
  clinicAddress?: string;
  appointmentType: string;
  dateTime: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  status?: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
  dateTime?: string;
  notes?: string;
}

class AppointmentService {
  async getAllAppointments(): Promise<Appointment[]> {
    return apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BASE);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    return apiClient.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.BASE, data);
  }

  async updateAppointment(
    id: string,
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    return apiClient.put<Appointment>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(id),
      data
    );
  }

  async deleteAppointment(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
  }
}

export const appointmentService = new AppointmentService();
