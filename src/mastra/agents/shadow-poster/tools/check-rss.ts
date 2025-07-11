import { createTool } from "@mastra/core/tools";
import Parser from "rss-parser";
import { z } from "zod";

const parser = new Parser();

export const checkRssTool = createTool({
  id: "check-rss-feed",
  description: "Check RSS feed and return the latest blog post",
  inputSchema: z.object({
    rssUrl: z.string().url().describe("RSS feed URL of the blog"),
  }),
  outputSchema: z.object({
    title: z.string(),
    link: z.string(),
    content: z.string().optional(),
    pubDate: z.string(),
  }),
  execute: async ({ context }) => {
    const { rssUrl } = context;
    const feed = await parser.parseURL(rssUrl);
    const latestPost = feed.items[0];

    return {
      title: latestPost.title || "No title",
      link: latestPost.link || "",
      content: latestPost.contentSnippet || "",
      pubDate: latestPost.pubDate || "",
    };
  },
});
