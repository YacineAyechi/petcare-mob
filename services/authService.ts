import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  profilePicture?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthService {
  register: (data: RegisterData) => Promise<RegisterResponse>;
  login: (data: LoginData) => Promise<LoginResponse>;
  getProfile: () => Promise<User>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<{ message: string }>;
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  fullName?: string;
  profilePicture?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthServiceImpl implements AuthService {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    // Save token after successful registration
    if (response.token) {
      await apiClient.saveToken(response.token);
    }

    return response;
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Save token after successful login
    if (response.token) {
      await apiClient.saveToken(response.token);
    }

    return response;
  }

  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
      { email }
    );
  }

  async logout(): Promise<void> {
    await apiClient.clearToken();
  }
}

export const authService = new AuthServiceImpl();
