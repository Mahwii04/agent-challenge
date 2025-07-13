import { createTool } from "@mastra/core/tools";
import Parser from "rss-parser";
import { z } from "zod";

const parser = new Parser();

export const rssTool = createTool({
  id: "check-rss-feed",
  description: "Check an RSS feed for the latest blog post",
  inputSchema: z.object({
    feedUrl: z.string().url().describe("RSS feed URL"),
  }),
  outputSchema: z.object({
    title: z.string(),
    link: z.string().url(),
    content: z.string(),
    pubDate: z.string(),
    imageUrl: z.string().optional(), // ✅ New
  }),
  execute: async ({ context }) => {
    const feed = await parser.parseURL(context.feedUrl);

    if (!feed.items.length) {
      throw new Error("No posts found in the RSS feed.");
    }

    const latest = feed.items[0];
    // Extract image URL from enclosure or media:content
    const enclosure = latest.enclosure as any;

    const imageUrl =
      enclosure?.url ||
      enclosure?.link ||
      (latest as any)["media:content"]?.url ||
      "";

    return {
      title: latest.title ?? "Untitled",
      link: latest.link ?? "",
      content: latest.contentSnippet ?? "",
      pubDate: latest.pubDate ?? new Date().toISOString(),
      imageUrl,
    };
  },
});
