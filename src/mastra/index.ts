import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { weatherAgent } from "./agents/weather-agent/weather-agent"; // This can be deleted later
import { weatherWorkflow } from "./agents/weather-agent/weather-workflow"; // This can be deleted later
import { shadowAgent } from "./agents/shadow-poster/agent"; // Build your agent here
import { shadowPosterWorkflow } from "./agents/shadow-poster/workflow";

export const mastra = new Mastra({
	workflows: { weatherWorkflow, shadowPosterWorkflow }, // can be deleted later
	agents: { weatherAgent, shadowAgent },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
});
