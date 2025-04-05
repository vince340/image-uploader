import { apiRequest } from "./queryClient";

export interface AIResponse {
  text: string;
  imageUrl?: string;
}

/**
 * Get a response from the AI assistant for a query
 * @param query The user's query
 * @param includeImage Whether to include an image in the response
 * @returns A promise resolving to the AI response
 */
export async function getAIResponse(query: string, includeImage: boolean = false): Promise<AIResponse> {
  return apiRequest<AIResponse>({
    url: "/api/ai/query",
    method: "POST",
    data: { query, includeImage },
    on401: "throw",
  });
}

/**
 * Get the welcome message with Lovely's avatar
 * @returns A promise resolving to the welcome response
 */
export async function getWelcomeMessage(): Promise<AIResponse> {
  return apiRequest<AIResponse>({
    url: "/api/ai/welcome",
    method: "GET",
    on401: "throw",
  });
}