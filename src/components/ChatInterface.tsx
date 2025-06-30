import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatMessagesAtom, addChatMessageAtom, isChatLoadingAtom } from '@/store/chat';
import { sendChatMessage } from '@/api/chatGPT';
import { quantum } from 'ldrs';

quantum.register();

interface ChatInterfaceProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

// Basic recipe responses for fallback
const basicRecipeResponses: { [key: string]: string } = {
  'pasta': "Here's a simple pasta recipe: Boil water, add salt, cook pasta for 8-12 minutes, drain, and toss with your favorite sauce!",
  'chicken': "For basic chicken: Season with salt and pepper, cook in a pan with oil over medium heat for 6-7 minutes per side until internal temp reaches 165°F.",
  'rice': "Perfect rice: 1 cup rice to 2 cups water. Bring to boil, reduce heat, cover and simmer for 18 minutes. Let stand 5 minutes before fluffing.",
  'eggs': "Scrambled eggs: Whisk 2-3 eggs with a splash of milk, cook in butter over low heat, stirring constantly until creamy.",
  'soup': "Basic vegetable soup: Sauté onions, carrots, celery. Add broth, simmer 20 minutes. Season with salt, pepper, and herbs.",
  'bread': "Simple bread: Mix flour, water, yeast, salt. Knead 10 minutes, rise 1 hour, shape, rise again, bake at 450°F for 30 minutes.",
  'salad': "Fresh salad: Mix your favorite greens, add vegetables, nuts, and dress with olive oil, vinegar, salt, and pepper.",
  'steak': "Perfect steak: Let come to room temp, season with salt and pepper, sear in hot pan 3-4 minutes per side, rest 5 minutes."
};

const getBasicResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(basicRecipeResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // General cooking tips
  if (lowerMessage.includes('cook') || lowerMessage.includes('recipe') || lowerMessage.includes('how')) {
    return "I'd love to help with more detailed recipes! Due to LLM access limitations, I can only provide basic cooking tips. Try asking about pasta, chicken, rice, eggs, soup, bread, salad, or steak for some quick recipes!";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Murphy, your kitchen assistant. I can help with basic recipes and cooking tips. What would you like to cook today?";
  }
  
  return "I'd love to give you a detailed response! Unfortunately, due to limited LLM access, I can only provide basic cooking guidance. Try asking about specific ingredients like pasta, chicken, rice, or eggs for quick recipes!";
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isMinimized,
  onToggleMinimize,
}) => {
  const [messages] = useAtom(chatMessagesAtom);
  const [, addMessage] = useAtom(addChatMessageAtom);
  const [isLoading, setIsLoading] = useAtom(isChatLoadingAtom);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chat is first opened
    if (messages.length === 0 && !isMinimized) {
      addMessage({
        role: 'assistant',
        content: "Hello! I'm Murphy, your AI kitchen assistant. I can help with basic recipes and cooking tips. Due to limited LLM access, my responses are simplified, but I'd love to help you cook something delicious! What would you like to make today?",
      });
    }
  }, [isMinimized, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsLoading(true);

    try {
      // Try PICA GPT-4o first, but fallback to basic responses
      let response: string;
      try {
        response = await sendChatMessage(messages, userMessage);
      } catch (error) {
        console.log('LLM unavailable, using basic responses');
        response = getBasicResponse(userMessage);
      }

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: getBasicResponse(userMessage),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="w-full h-full flex items-end justify-end p-4">
        <Button
          onClick={onToggleMinimize}
          size="icon"
          className="size-14 rounded-2xl shadow-lg hover:shadow-xl"
        >
          <MessageSquare className="size-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass-effect rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/30 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Chat with Murphy</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="size-3" />
              <span>Basic mode - Limited LLM access</span>
            </div>
          </div>
        </div>
        <Button
          onClick={onToggleMinimize}
          size="icon"
          variant="ghost"
          className="size-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="p-6 bg-primary/10 rounded-2xl w-fit mx-auto">
              <MessageSquare className="size-12 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Start a conversation!</p>
              <p className="text-sm text-muted-foreground">
                Ask Murphy about recipes, techniques, or cooking tips.
              </p>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="size-3" />
                  <span>Note: Responses are basic due to limited LLM access</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm break-words shadow-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/80 text-secondary-foreground border border-border/30'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/80 border border-border/30 rounded-2xl px-4 py-3 flex items-center gap-3">
              <l-quantum size="16" speed="1.75" color="hsl(var(--primary))"></l-quantum>
              <span className="text-sm text-muted-foreground">Murphy is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border/30 bg-secondary/20">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Murphy about cooking... (e.g., 'how to cook pasta')"
            className="flex-1 bg-background/80 border-border/50 h-12"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0 size-12 rounded-xl"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Try asking about: pasta, chicken, rice, eggs, soup, bread, salad, or steak
        </div>
      </div>
    </div>
  );
};