import { createContext, useState } from "react";
import runGemini from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, index * 75);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    // Use provided prompt or current input
    const promptToSend = prompt || input;
    
    // Store in recent prompt and history
    setRecentPrompt(promptToSend);
    
    // Add to previous prompts if not already there
    if (promptToSend && !previousPrompts.includes(promptToSend)) {
      setPreviousPrompts((prev) => [...prev, promptToSend]);
    }

    try {
      const response = await runGemini(promptToSend);

      // Check if response is an error
      if (response.startsWith("Error")) {
        setResultData(response);
        setLoading(false);
        return;
      }

      // Format the response
      // Handle bold text wrapped in **
      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      // Replace single * with line breaks
      let newResponse2 = newResponse.split("*").join("<br/>");
      
      // Optional: Add typing effect
      // Uncomment below for typing animation
      /*
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      */
      
      // Set response immediately (comment this if using typing effect)
      setResultData(newResponse2);
      
      setLoading(false);
      setInput("");
      
      console.log("AI Response:", response);
    } catch (error) {
      console.error("Error in onSent:", error);
      setResultData("Error: Failed to process response");
      setLoading(false);
    }
  };

  const contextValue = {
    previousPrompts,
    setPreviousPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  );
};

export default ContextProvider;