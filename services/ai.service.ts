import axiosInstance from "@/lib/axios";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const aiService = {
  ask: async (
    question: string,
    history: ChatMessage[],
    file?: File | null
  ) => {
    // Limit to the 5 most recent messages
    let recentHistory = history.slice(-5);

    // Gemini requires history to start with user
    if (
      recentHistory.length > 0 &&
      recentHistory[0].role === "assistant"
    ) {
      recentHistory = recentHistory.slice(1);
    }

    // Transform history for Gemini
    const formattedHistory = recentHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // CREATE FORMDATA
    const formData = new FormData();

    // TEXT INPUT
    formData.append("question", question);

    // HISTORY
    formData.append(
      "history",
      JSON.stringify(formattedHistory)
    );

    // FILE
    if (file) {
      formData.append("file", file);
    }

    // SEND REQUEST
    try {
      const response = await axiosInstance.post(
      "/api/ai/v1/ask",
      formData,
      {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
    );

    return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};