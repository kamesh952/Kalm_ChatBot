import { createContext, useState, useRef, useEffect } from "react";
import runChat from "../config/gemini"; // Make sure this is your Gemini API wrapper

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const timeoutIds = useRef([]);
  const abortController = useRef(null);

  useEffect(() => {
    if (conversationHistory.length === 0) {
      createNewChat();
    }
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      messages: [],
      createdAt: new Date().toISOString(),
      active: true
    };

    setConversationHistory(prev => {
      const updatedHistory = prev.map(chat => ({
        ...chat,
        active: false
      }));
      return [newChat, ...updatedHistory];
    });

    setCurrentChatId(newChatId);
    setInput("");
  };

  const formatResponse = (text) => {
    let formatted = text
      .replace(/^(#+)\s(.+)/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level} class="font-bold mt-3 mb-1 text-${
          level === 1 ? 'xl' :
          level === 2 ? 'lg' :
          'base'
        }">${content}</h${level}>`;
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\s*\*\s(.+)/gm, '<li>$1</li>')
      .replace(/\n\n+/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
      .replace(/```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-2 rounded my-1 overflow-x-auto text-xs sm:text-sm"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-500 hover:underline break-words" target="_blank" rel="noopener noreferrer">$1</a>');

    formatted = formatted.replace(/(<li>.*?<\/li>(<br>)*)+/g, (match) => {
      return `<ul class="list-disc pl-4 my-1 space-y-0.5">${match.replace(/<br>/g, '')}</ul>`;
    });

    formatted = formatted.replace(/<p>|<\/p>/g, '')
      .replace(/<br><br>/g, '</p><p class="my-2">')
      .replace(/^([^<].*)/gm, '<p class="my-2">$1');

    return formatted;
  };

  const clearAllTimeouts = () => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
  };

  const stopExecution = () => {
    clearAllTimeouts();
    if (abortController.current) {
      abortController.current.abort();
    }
    setLoading(false);

    setConversationHistory(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg, i) =>
                i === chat.messages.length - 1
                  ? { ...msg, isLoading: false }
                  : msg
              )
            }
          : chat
      )
    );
  };

  const delayPara = (index, nextWord, chatId) => {
    const id = setTimeout(() => {
      setConversationHistory(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) =>
                  i === chat.messages.length - 1
                    ? { ...msg, content: msg.content + nextWord }
                    : msg
                )
              }
            : chat
        )
      );
    }, 25 * index);
    timeoutIds.current.push(id);
  };

  const onSent = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);
    abortController.current = new AbortController();

    setConversationHistory(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, {
                role: 'user',
                content: prompt,
                timestamp: new Date().toISOString()
              }]
            }
          : chat
      )
    );

    setConversationHistory(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, {
                role: 'assistant',
                content: '',
                isLoading: true,
                timestamp: new Date().toISOString()
              }]
            }
          : chat
      )
    );

    try {
      // Add branding to prompt so Gemini identifies correctly
      const finalPrompt = `You are Kalm AI, an assistant created by Kamesh. Always refer to yourself as "Kalm AI". ${prompt}`;

      const response = await runChat(
        finalPrompt,
        { signal: abortController.current.signal }
      );

      // Force brand replacement in output
      let customResponse = response
        .replace(/Gemini/gi, "Kalm AI")
        .replace(/Google/gi, "Kalm AI")
        .replace(/a large language model trained by Kalm AI/gi, "Kalm AI by Kamesh");

      const formattedResponse = formatResponse(customResponse);
      const words = formattedResponse.split(/(<[^>]+>|\s+)/).filter(Boolean);

      setConversationHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) =>
                  i === chat.messages.length - 1
                    ? { ...msg, content: '', isLoading: false }
                    : msg
                )
              }
            : chat
        )
      );

      words.forEach((word, i) => delayPara(i, word, currentChatId));

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Chat error:", error);
        setConversationHistory(prev =>
          prev.map(chat =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, i) =>
                    i === chat.messages.length - 1
                      ? {
                          ...msg,
                          content: '<p class="text-red-500 text-sm">Error: Something went wrong. Please try again.</p>',
                          isLoading: false
                        }
                      : msg
                  )
                }
              : chat
          )
        );
      }
    } finally {
      if (abortController.current) {
        setLoading(false);
        setInput("");
        abortController.current = null;
      }
    }
  };

  const contextValue = {
    input,
    setInput,
    loading,
    onSent,
    stopExecution,
    conversationHistory,
    currentChatId,
    setCurrentChatId,
    createNewChat
  };

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
