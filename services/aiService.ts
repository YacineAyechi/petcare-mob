import { apiClient } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export interface AIService {
  chat: (message: string) => Promise<ChatResponse>;
}

class AIServiceImpl implements AIService {
  async chat(message: string): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(
      `${API_ENDPOINTS.AI.BASE}/chat`,
      { message }
    );

    return response;
  }
}

export const aiService = new AIServiceImpl();
