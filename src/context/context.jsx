import { createContext, useState, useRef, useEffect } from "react"; // Added useEffect here
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
  const [isRecipeMode, setIsRecipeMode] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isStopped, setIsStopped] = useState(false);
  
  // Store timeout IDs for cleanup
  const timeoutIds = useRef([]);
  const abortController = useRef(null);

  const formatResponse = (text) => {
    let formatted = text
      .replace(/^(#+)\s(.+)/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level} class="font-bold mt-4 mb-2 text-${level === 1 ? 'xl' : level === 2 ? 'lg' : 'base'}">${content}</h${level}>`;
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\s*\*\s(.+)/gm, '<li>$1</li>')
      .replace(/\n\n+/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    formatted = formatted.replace(/(<li>.*?<\/li>(<br>)*)+/g, (match) => {
      return `<ul class="list-disc pl-5 my-2">${match.replace(/<br>/g, '')}</ul>`;
    });

    return formatted;
  };

  const extractRecipeDetails = (text) => {
    const recipePatterns = {
      title: /^(.*?)(?=\nIngredients:|$)/s,
      ingredients: /Ingredients:([\s\S]*?)(?=\nInstructions:|$)/,
      instructions: /Instructions:([\s\S]*?)(?=\nNutrition:|$)/,
      nutrition: /Nutrition:([\s\S]*?)$/,
    };

    const details = {};
    for (const [key, pattern] of Object.entries(recipePatterns)) {
      const match = text.match(pattern);
      if (match) details[key] = match[1].trim();
    }
    return Object.keys(details).length > 0 ? details : null;
  };

  // Clear all pending timeouts
  const clearAllTimeouts = () => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
  };

  // Stop the current execution
  const stopExecution = () => {
    setIsStopped(true);
    clearAllTimeouts();
    if (abortController.current) {
      abortController.current.abort();
    }
    setLoading(false);
  };

  const delayPara = (index, nextWord) => {
    const id = setTimeout(() => {
      if (!isStopped) {
        setResultData((prev) => prev + nextWord);
      }
    }, 25 * index);
    timeoutIds.current.push(id);
  };

  const onSent = async (prompt) => {
    if (!prompt.trim()) return;

    // Reset states for new query
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setIsStopped(false);
    setRecentPrompt(prompt);
    abortController.current = new AbortController();

    // Detect recipe mode
    const recipeMode = prompt.toLowerCase().includes("recipe") || 
                      prompt.toLowerCase().includes("cook") || 
                      prompt.toLowerCase().includes("make");
    setIsRecipeMode(recipeMode);

    // Update prompt history
    setPrevPrompts((prev) => {
      const updated = prev.filter((p) => p !== prompt);
      return [prompt, ...updated];
    });

    try {
      const response = await runChat(
        recipeMode 
          ? `Provide a detailed recipe for: ${prompt}. Include sections for Ingredients, Instructions, and Nutrition. Format with clear headings.`
          : prompt,
        { signal: abortController.current.signal }
      );

      if (isStopped) return;

      if (recipeMode) {
        const details = extractRecipeDetails(response);
        if (details) setRecipeDetails(details);
      }

      const formattedResponse = formatResponse(response);
      const words = formattedResponse.split(/(<[^>]+>|\s+)/).filter(Boolean);

      words.forEach((word, i) => delayPara(i, word));

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Chat error:", error);
        setResultData('<p class="text-red-500">Error: Something went wrong. Please try again.</p>');
      }
    } finally {
      if (!isStopped) {
        setLoading(false);
        setInput("");
      }
      abortController.current = null;
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
    isRecipeMode,
    recipeDetails,
    stopExecution,
    isStopped,
    setIsStopped
  };

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;