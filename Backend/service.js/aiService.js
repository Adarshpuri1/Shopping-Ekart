import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export const main = async (prompt) => {
  try {

    const systemInstruction = `
    You are a professional product technical expert.
    When user gives any product name like phone, laptop, headphone,
    provide:
    - Product Overview
    - Key Features
    - Technical Abilities
    - Best For

    Do NOT mention price.
    Keep it structured and professional.
    `;

    const result = await model.generateContent([
      systemInstruction,
      prompt
    ]);

    return result.response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
