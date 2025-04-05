import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the interface for the AI response
export interface AIResponse {
  text: string;
  imageUrl?: string;
}

/**
 * Generate a response from the AI assistant
 * @param query User's query or question
 * @param includeImage Whether to generate an image along with the text response
 * @returns Text response and optional image URL
 */
export async function generateAIResponse(query: string, includeImage: boolean = false): Promise<AIResponse> {
  try {
    // Generate text response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are Lovely, a friendly and helpful AI assistant for an image upload website. 
          Your goal is to help users understand how to use the website's features:
          - Upload images via drag and drop or file selection
          - Preview images before uploading
          - Track upload progress
          - View the gallery of uploaded images
          - Delete images they no longer want
          - Download images to their device
          
          Keep your responses concise, friendly, and helpful. Sign your responses with "~ Lovely 💖".
          If you don't know the answer to a question, politely say so and offer to help with something else.`
        },
        { 
          role: "user", 
          content: query 
        }
      ],
      max_tokens: 500,
    });

    const textResponse = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response. ~ Lovely 💖";
    
    // If image is requested, generate an image based on the query
    let imageUrl: string | undefined = undefined;
    
    if (includeImage) {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a simple, friendly, and helpful illustration related to: ${query}. The image should be cute, pastel-colored, and appealing. Perfect for a user interface of an image uploader website.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });
      
      imageUrl = imageResponse.data[0].url;
    }
    
    return {
      text: textResponse,
      imageUrl
    };
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      text: "I'm sorry, I encountered an error while processing your request. Please try again later. ~ Lovely 💖"
    };
  }
}

/**
 * Generate a greeting message for new users
 * @returns Welcome message and image URL
 */
export async function generateWelcomeMessage(): Promise<AIResponse> {
  try {
    const welcomeText = "Welcome to our Image Uploader! I'm Lovely, your assistant. I can help you learn how to upload, manage, and share your images. Feel free to ask me any questions about using this website! ~ Lovely 💖";
    
    // Generate a welcoming avatar image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a friendly, cute anime-style avatar for an AI assistant named Lovely with pink hair and a soft, welcoming expression. The image should be in a soft, pastel color palette, perfect for a user interface. The character should appear approachable and helpful.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    
    return {
      text: welcomeText,
      imageUrl: imageResponse.data[0].url
    };
    
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return {
      text: "Welcome to our Image Uploader! I'm Lovely, your assistant. I'm here to help you with any questions you might have about using this website! ~ Lovely 💖"
    };
  }
}