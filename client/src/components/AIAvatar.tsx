import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ImageUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIResponse, getAIResponse, getWelcomeMessage } from '@/lib/aiService';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AIAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [includeImage, setIncludeImage] = useState(false);
  const [conversation, setConversation] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch welcome message on first open
  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setIsLoading(true);
      getWelcomeMessage()
        .then((response) => {
          setConversation([response]);
          setHasWelcomed(true);
        })
        .catch((error) => {
          console.error('Error fetching welcome message:', error);
          toast({
            title: 'Error',
            description: 'Failed to load Lovely. Please try again later.',
            variant: 'destructive',
          });
          // Fallback welcome message
          setConversation([{
            text: "Welcome to our Image Uploader! I'm Lovely, your assistant. I can help you learn how to upload, manage, and share your images. Feel free to ask me any questions about using this website! ~ Lovely 💖"
          }]);
          setHasWelcomed(true);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, hasWelcomed, toast]);

  // Scroll to bottom of chat when conversation updates
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;

    const userQuery = query.trim();
    setQuery('');
    setIsLoading(true);

    // Display user message immediately
    setConversation(prev => [...prev, { text: userQuery }]);

    try {
      const response = await getAIResponse(userQuery, includeImage);
      
      // Add AI response with typing effect
      setIsTyping(true);
      setConversation(prev => [...prev, response]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      setConversation(prev => [...prev, { 
        text: "I'm sorry, I encountered an error while processing your request. Please try again later. ~ Lovely 💖" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button to open chat */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full p-3 h-14 w-14 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 z-50"
          aria-label="Chat with Lovely"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[480px] rounded-lg shadow-xl bg-background border border-border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h3 className="font-bold text-lg">Chat with Lovely</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat area */}
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto p-3 space-y-4"
          >
            {conversation.map((message, index) => {
              const isUser = index > 0 && !message.text.includes("~");
              return (
                <div 
                  key={index}
                  className={cn(
                    "flex flex-col max-w-[80%] space-y-2",
                    isUser ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div 
                    className={cn(
                      "rounded-lg p-3",
                      isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  
                  {/* Show avatar image */}
                  {message.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img 
                        src={message.imageUrl} 
                        alt="AI generated image" 
                        className="max-w-full h-auto"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs">Lovely is typing...</span>
              </div>
            )}
            
            {isLoading && !isTyping && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Lovely a question..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  size="icon"
                  variant={includeImage ? "default" : "outline"}
                  onClick={() => setIncludeImage(!includeImage)}
                  title={includeImage ? "Don't include image" : "Include image"}
                  className={cn(
                    includeImage && "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-transparent"
                  )}
                >
                  <ImageUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!query.trim() || isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-transparent"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Styling is handled in index.css */}
    </>
  );
}