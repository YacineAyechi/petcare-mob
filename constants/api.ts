// API configuration driven by environment variables.
// Set EXPO_PUBLIC_API_BASE_URL in your .env file (Expo reads EXPO_PUBLIC_*).
// Fallback to API_BASE_URL for non-Expo environments.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "";

if (!API_BASE_URL) {
  console.warn(
    "[API] Base URL is not set. Define EXPO_PUBLIC_API_BASE_URL in your .env."
  );
}

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
