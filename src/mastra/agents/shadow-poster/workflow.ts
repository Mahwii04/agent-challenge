import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { shadowAgent } from "./agent";
import { createRuntimeContext } from "./runtime";
import "../../config";

// Define schemas
const rssPostSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  content: z.string(),
  pubDate: z.string(),
  imageUrl: z.string().optional(),
});

const captionsSchema = z.object({
  instagram: z.string(),
  facebook: z.string(),
});

const socialPostResultSchema = z.object({
  success: z.boolean(),
  fbPostId: z.string().optional(),
  igPostId: z.string().optional(),
});

// Step 1: Fetch latest post from RSS feed
const fetchLatestPost = createStep({
  id: "fetch-latest-post",
  description: "Fetches the latest blog post from RSS feed",
  inputSchema: z.object({
    feedUrl: z.string().url(),
  }),
  outputSchema: rssPostSchema,
  execute: async ({ inputData }) => {
    return await shadowAgent.tools.rssTool.execute({
      context: {
        feedUrl: inputData.feedUrl,
      },
      runtimeContext: createRuntimeContext(),
    });
  },
});

// Step 2: Generate captions from post
const generateCaptions = createStep({
  id: "generate-captions",
  description: "Creates platform-optimized social media captions",
  inputSchema: rssPostSchema,
  outputSchema: captionsSchema,
  execute: async ({ inputData }) => {
    return await shadowAgent.tools.captionGeneratorTool.execute({
      context: {
        title: inputData.title,
        content: inputData.content,
        link: inputData.link,
      },
      runtimeContext: createRuntimeContext(),
    });
  },
});

// Step 3: Post to Meta
const postToSocial = createStep({
  id: "post-to-social",
  description: "Publishes content to Facebook and Instagram",
  inputSchema: captionsSchema.extend({
    imageUrl: z.string().optional(),
  }),
  outputSchema: socialPostResultSchema,
  execute: async ({ inputData }) => {
    return await shadowAgent.tools.postToMeta.execute({
      context: {
        captions: {
          facebook: inputData.facebook,
          instagram: inputData.instagram,
        },
        imageUrl: inputData.imageUrl,
      },
      runtimeContext: createRuntimeContext(),
    });
  },
});

// Define the complete workflow
const shadowPosterWorkflow = createWorkflow({
  id: "shadow-poster-workflow",
  inputSchema: z.object({
    feedUrl: z.string().url(),
  }),
  outputSchema: socialPostResultSchema,
})
  .then(fetchLatestPost)
  .then(generateCaptions)
  .then(postToSocial);

// Commit the workflow
shadowPosterWorkflow.commit();

export { shadowPosterWorkflow };
