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
      // Send to PICA GPT-4o
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
          <h3 className="font-semibold text-lg">Chat with Murphy</h3>
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
              <span className="text-sm text-muted-foreground">Murphy is typing...</span>
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
            placeholder="Ask Murphy about cooking..."
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
      </div>
    </div>
  );
};