import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { shadowAgent } from "./agents/shadow-poster/agent"; // Build your agent here
import { shadowPosterWorkflow } from "./agents/shadow-poster/workflow";

export const mastra = new Mastra({
	workflows: { shadowPosterWorkflow }, // can be deleted later
	agents: { shadowAgent },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
});
