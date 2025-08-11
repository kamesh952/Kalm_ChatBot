import { GoogleGenerativeAI } from"@google/generative-ai";

const API_KEY = "AIzaSyDV2CHd2Ufv1B7VlTlycIbVhU5n3XBArCs";

const runChat = async (prompt) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // ✅ Use the latest supported model
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
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
