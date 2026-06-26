import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

const runChat = async (prompt) => {
  // Validate API key exists
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // ✅ Use the latest stable model
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash"  // Note: "gemini-3.5-flash" doesn't exist. Use 1.5 or 2.0 models
  });

  const chat = model.startChat({
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
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());
  return response.text();
};

export default runChat;
