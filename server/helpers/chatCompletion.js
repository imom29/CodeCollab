import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyDH_kpjlKHiqi8u-jO2aVVa-fUaVkiIqFI";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const generateResponse = async (question) => {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: question,
  });

  return response.text;
}

export {generateResponse}