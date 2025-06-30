import { IConversation } from "@/types";
import { settingsAtom } from "@/store/settings";
import { getDefaultStore } from "jotai";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Get settings from Jotai store
  const settings = getDefaultStore().get(settingsAtom);
  
  // Add debug logs
  console.log('Creating conversation with settings:', settings);
  console.log('Greeting value:', settings.greeting);
  console.log('Context value:', settings.context);
  
  // Build the context string
  let contextString = "";
  if (settings.name) {
    contextString = `You are talking with the user, ${settings.name}. Additional context: `;
  }
  contextString += settings.context || "";

  // Fix greeting to handle empty/undefined name properly
  let greeting;
  if (settings.name && settings.name.trim()) {
    greeting = `Hello ${settings.name}, I am Murphy, your kitchen assistant. What dish should I help you with?`;
  } else {
    greeting = `Hello! I am Murphy, your kitchen assistant. What dish should I help you with?`;
  }
  
  const payload = {
    persona_id: settings.persona || "pcd2c84e5c66",
    custom_greeting: greeting,
    conversational_context: contextString
  };
  
  console.log('Sending payload to API:', payload);
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorBody = await response.text();
      if (errorBody) {
        errorMessage += ` - ${errorBody}`;
      }
    } catch (e) {
      // If we can't read the response body, just use the status
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};