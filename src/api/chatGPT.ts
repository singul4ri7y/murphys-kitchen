import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Pica } from "@picahq/ai";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const pica = new Pica(import.meta.env.VITE_PICA_SECRET_KEY!, {
  connectors: ["*"]
});

async function runMurphyTask(message: string): Promise<string> {
  const system = await pica.generateSystemPrompt();
  
  // Add Murphy's Kitchen context to the system prompt
  const murphySystemPrompt = `${system}\n\nYou are Murphy, an AI cooking assistant in Murphy's Kitchen. You help users with cooking questions, recipes, techniques, and culinary advice. Be friendly, knowledgeable, and encouraging. Keep responses concise but helpful. Focus on practical cooking advice and creative culinary solutions.`;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: murphySystemPrompt,
    prompt: message,
    tools: { ...pica.oneTool },
    maxSteps: 10,
    maxTokens: 500,
    temperature: 0.7,
  });

  return text;
}

export const sendChatMessage = async (
  messages: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    // Format conversation history
    const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const fullPrompt = conversationHistory ? `${conversationHistory}\nuser: ${userMessage}` : userMessage;

    const response = await runMurphyTask(fullPrompt);
    return response;
  } catch (error) {
    console.error('Error with Pica GPT-4o integration:', error);
    throw new Error('Failed to send message using Pica GPT-4o');
  }
};