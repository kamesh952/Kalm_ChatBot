import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recipePrompt, setRecipePrompt] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord + " ");
    }, 75 * index);
  };

  const onSent = async (prompt) => {
    if (!prompt.trim()) return;

    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(prompt);

    // Move prompt to top if it already exists
    setPrevPrompts((prev) => {
      const updated = prev.filter((p) => p !== prompt);
      return [prompt, ...updated];
    });

    try {
      const response = await runChat(prompt);

      // Optional formatting (e.g. replace "*" with newline or other symbol)
      const cleanedResponse = response.replace(/\*/g, "<br>");
      const words = cleanedResponse.split(" ");

      words.forEach((word, i) => delayPara(i, word));

      console.log("Gemini Response:", cleanedResponse);
    } catch (error) {
      console.error("Chat error:", error);
      setResultData("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    input,
    setInput,
    recipePrompt,
    setRecipePrompt,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    resultData,
    setResultData,
    onSent,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
