import { atom } from "jotai";
import { ChatMessage } from "@/api/chatGPT";

export const chatMessagesAtom = atom<ChatMessage[]>([]);
export const isChatLoadingAtom = atom<boolean>(false);

// Action atom to add a message
export const addChatMessageAtom = atom(
  null,
  (get, set, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const messages = get(chatMessagesAtom);
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set(chatMessagesAtom, [...messages, newMessage]);
  }
);

// Action atom to clear messages
export const clearChatMessagesAtom = atom(null, (_, set) => {
  set(chatMessagesAtom, []);
});