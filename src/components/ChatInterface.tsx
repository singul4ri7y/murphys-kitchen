import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatMessagesAtom, addChatMessageAtom, isChatLoadingAtom } from '@/store/chat';
import { sendChatMessage } from '@/api/chatGPT';
import { quantum } from 'ldrs';

quantum.register();

interface ChatInterfaceProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

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
      // Send to ChatGPT
      const response = await sendChatMessage(messages, userMessage);

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
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
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          size="icon"
          className="size-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageSquare className="size-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 bottom-20 w-80 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <h3 className="font-semibold">Chat with Murphy</h3>
        </div>
        <Button
          onClick={onToggleMinimize}
          size="icon"
          variant="ghost"
          className="size-8"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="size-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">Start a conversation with Murphy!</p>
            <p className="text-xs mt-1">Ask about recipes, techniques, or cooking tips.</p>
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
                'max-w-[80%] rounded-lg px-3 py-2 text-sm break-words',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
              <l-quantum size="16" speed="1.75" color="hsl(var(--muted-foreground))"></l-quantum>
              <span className="text-xs text-muted-foreground">Murphy is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Murphy about cooking..."
            className="flex-1 bg-background"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};