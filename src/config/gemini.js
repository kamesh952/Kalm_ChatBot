import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const runChat = async (prompt, options = {}) => {
  // Validate API key exists
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Use a valid model
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.9,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 65536,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  });

  try {
    const result = await model.generateContent(prompt, {
      signal: options.signal || null
    });
    
    const response = result.response;
    return response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
      throw error;
    }
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export default runChat;
