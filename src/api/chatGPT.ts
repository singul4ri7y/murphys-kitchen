import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const sendChatMessage = async (
  messages: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    const formattedMessages = [
      {
        role: 'system' as const,
        content: `You are Murphy, an AI cooking assistant in Murphy's Kitchen. You help users with cooking questions, recipes, techniques, and culinary advice. Be friendly, knowledgeable, and encouraging. Keep responses concise but helpful.`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not process your message.';
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message to ChatGPT');
  }
};