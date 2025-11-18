import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCrY6K_enGq_JOwTEqf0oca6OCVZfL7CfU";

const ai = new GoogleGenerativeAI(apiKey);

async function runGemini(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);

    console.log(result.response.text());
    return result.response.text();

  } catch (err) {
    console.error("Gemini error:", err);
    return "Error generating response";
  }
}

export default runGemini;
