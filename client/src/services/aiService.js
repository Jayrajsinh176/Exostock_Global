import { AuthService } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API_URL = `${API_BASE_URL}/api/assistant/chat`;

export const sendMessageToAI = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to connect AI Assistant");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Service Error:", error);

    return {
      reply:
        "I'm unable to connect to the AI Assistant right now. Please try again later.",
    };
  }
};
