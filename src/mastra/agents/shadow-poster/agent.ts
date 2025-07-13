import { Agent } from "@mastra/core/agent";
import { model } from "../../config";
import { rssTool } from "./tools/rssTool";
import { generateCaptionsTool } from "./tools/captionGeneratorTool";

// Agent Name
const name = "ShadowPoster Agent";

// Instructions for the agent
// TODO: Add link here for recommendations on how to properly define instructions for an agent.
// TODO: Remove comments (// ...) from `instructions`
const instructions = `
      You are a social media copy expert. When given a blog post title and content, respond with highly engaging captions optimized for each of the following platforms:

    Instagram:
    - Short and emotionally engaging
    - Include 1–2 relevant hashtags
    - Avoid links

    LinkedIn:
    - Professional tone
    - Include key insight or takeaway
    - Encourage discussion

    YouTube Shorts:
    - Hook-heavy
    - Use emojis and energy
    - No more than 2 sentences

    TikTok:
    - Trend-aware and punchy
    - Use a strong CTA

    Format your response exactly as:

    Instagram: ...
    LinkedIn: ...
    YouTube Shorts: ...
    TikTok: ...
`;

export const shadowAgent = new Agent({
	name,
	instructions,
	model,
	tools: { rssTool, generateCaptionsTool }, 
});
