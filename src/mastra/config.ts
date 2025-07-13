import dotenv from "dotenv";
import { createOllama } from "ollama-ai-provider";

// Load environment variables once at the beginning
dotenv.config();

// Export all your environment variables
// Defaults to Ollama gemma3
// https://ollama.com/library/gemma3
export const modelName = process.env.MODEL_NAME_AT_ENDPOINT ?? "gemma3";
export const baseURL = process.env.API_BASE_URL ?? "http://127.0.0.1:11434/api";

// Create and export the model instance
export const model = createOllama({ baseURL }).chat(modelName, {
  simulateStreaming: true,
});

console.log(`ModelName: ${modelName}\nbaseURL: ${baseURL}`);