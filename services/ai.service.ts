import axiosInstance from "@/lib/axios";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const aiService = {
  ask: async (question: string, history: ChatMessage[]) => {
    // Limit to the 5 most recent messages
    let recentHistory = history.slice(-5);

    // Gemini requires the history to start with a 'user' message.
    // If our slice starts with a bot message, remove it.
    if (recentHistory.length > 0 && recentHistory[0].role === "assistant") {
      recentHistory = recentHistory.slice(1);
    }

    // Transform history to match backend askSchema (Gemini format)
    const formattedHistory = recentHistory.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    console.log("format hsitory", formattedHistory);

    const response = await axiosInstance.post("/api/ai/v1/ask", {
      question,
      history: formattedHistory
    });
    return response.data;
  }
};