import { Agent } from "@mastra/core/agent";
import { model } from "../../config";
import { checkRssTool } from "./tools/check-rss";
import { generateCaptionsTool } from "./tools/generate-captions";

// Define Agent Name
const name = "ShadowPoster Agent";

// Define instructions for the agent
// TODO: Add link here for recommendations on how to properly define instructions for an agent.
// TODO: Remove comments (// ...) from `instructions`
const instructions = `
      // Define the character of the agent.
      You are a helpful assistant that provides accurate information.

      // Define how the agent should behave here.
      Your primary function is to help users get accurate details for specific topics. When responding:
      - If the location name isn’t in English, please translate it
      - Keep responses concise but informative

      // Define function that the agent needs to call
      Use the yourTool to fetch current weather data.
`;

export const shadowAgent = new Agent({
	name,
	instructions,
	model,
	tools: { checkRssTool, generateCaptionsTool }, 
});
