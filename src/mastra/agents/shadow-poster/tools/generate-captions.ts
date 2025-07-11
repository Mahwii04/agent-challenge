import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { model } from "../../../config";

const captionAgent = new Agent({
  name: "Caption Agent",
  model,
  instructions: `
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
  `,
});

export const generateCaptionsTool = createTool({
  id: "generate-captions",
  description: "Generate social media captions for a blog post",
  inputSchema: z.object({
    title: z.string(),
    content: z.string(),
    link: z.string(),
  }),
  outputSchema: z.object({
    instagram: z.string(),
    linkedin: z.string(),
    youtube: z.string(),
    tiktok: z.string(),
  }),
  execute: async ({ context }) => {
    const { title, content, link } = context;

    const prompt = `Here's a new blog post titled "${title}".

${content}

Link: ${link}

Generate social media captions for each platform as instructed.`;

    const response = await captionAgent.generate([
      { role: "user", content: prompt },
    ]);

    const text = response.text;

    return {
      instagram: text.match(/Instagram:\s*([\s\S]*?)LinkedIn:/)?.[1]?.trim() || "",
      linkedin: text.match(/LinkedIn:\s*([\s\S]*?)YouTube Shorts:/)?.[1]?.trim() || "",
      youtube: text.match(/YouTube Shorts:\s*([\s\S]*?)TikTok:/)?.[1]?.trim() || "",
      tiktok: text.match(/TikTok:\s*([\s\S]*)/)?.[1]?.trim() || "",
    };
  },
});
