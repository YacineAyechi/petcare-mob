// API Configuration
// For development, use your local IP address or localhost
// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address

import { Platform } from "react-native";

// Get the base URL based on the platform
const getBaseURL = () => {
  // You can set this to your backend URL
  // For development:
  // - Android Emulator: 'http://10.0.2.2:5000'
  // - iOS Simulator: 'http://localhost:5000'
  // - Physical Device: 'http://YOUR_IP_ADDRESS:5000'

  if (__DEV__) {
    // Development mode
    if (Platform.OS === "android") {
      // For Android emulator
      return "https://petcare-backend-r4j9.onrender.com";
    } else {
      // For iOS simulator or web
      return "https://petcare-backend-r4j9.onrender.com";
    }
  } else {
    // Production mode - replace with your production API URL
    return "https://petcare-backend-r4j9.onrender.com";
  }
};

export const API_BASE_URL = getBaseURL();

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
  },
  // Pet endpoints
  PETS: {
    BASE: "/api/pets",
    BY_ID: (id: string) => `/api/pets/${id}`,
    VACCINATIONS: (petId: string) => `/api/pets/${petId}/vaccinations`,
    MEDICAL_HISTORY: (petId: string) => `/api/pets/${petId}/medical-history`,
    MEDICATIONS: (petId: string) => `/api/pets/${petId}/medications`,
  },
  // Vaccination endpoints
  VACCINATIONS: {
    BASE: "/api/vaccinations",
  },
  // Appointment endpoints
  APPOINTMENTS: {
    BASE: "/api/appointments",
    BY_ID: (id: string) => `/api/appointments/${id}`,
  },
  // Service endpoints
  SERVICES: {
    BASE: "/api/services",
    BY_ID: (id: string) => `/api/services/${id}`,
  },
  // AI endpoints
  AI: {
    BASE: "/api/ai",
  },
} as const;
