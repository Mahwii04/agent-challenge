import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

// -------------------- TYPES --------------------

type FacebookPostResponse = {
  id: string;
};

type InstagramContainerResponse = {
  id: string;
};

type InstagramPublishResponse = {
  id: string;
};

type MetaErrorResponse = {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
};

// -------------------- TOOL --------------------

export const postToMeta = createTool({
  id: "post-to-meta",
  description: "Post content to Facebook Page and Instagram account via Meta Graph API",
  inputSchema: z.object({
    fbPageId: z.string().describe("The Facebook Page ID"),
    igUserId: z.string().describe("The Instagram User ID connected to the page"),
    accessToken: z.string().describe("Long-lived Page Access Token"),
    captions: z.object({
      facebook: z.string(),
      instagram: z.string(),
    }),
    imageUrl: z.string().url().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    fbPostId: z.string().optional(),
    igPostId: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { fbPageId, igUserId, accessToken, captions, imageUrl } = context;

    // ✅ 1. Post TEXT ONLY to Facebook (via /feed)
    const fbResponse = await fetch(`https://graph.facebook.com/v20.0/${fbPageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: captions.facebook,
        access_token: accessToken,
      }),
    });

    const fbData = (await fbResponse.json()) as FacebookPostResponse | MetaErrorResponse;

    if ("error" in fbData) {
      throw new Error(`❌ Facebook Post Error: ${JSON.stringify(fbData)}`);
    }

    // ✅ 2. Create IG container (requires image)
    if (!imageUrl) {
      throw new Error("❌ Instagram post requires an image URL.");
    }

    const igContainerRes = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: captions.instagram,
        access_token: accessToken,
      }),
    });

    const igContainerData = (await igContainerRes.json()) as InstagramContainerResponse | MetaErrorResponse;

    if ("error" in igContainerData || !("id" in igContainerData)) {
      throw new Error(`❌ Instagram Container Error: ${JSON.stringify(igContainerData)}`);
    }

    // ✅ 3. Publish IG post
    const igPublishRes = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: igContainerData.id,
        access_token: accessToken,
      }),
    });

    const publishData = (await igPublishRes.json()) as InstagramPublishResponse | MetaErrorResponse;

    if ("error" in publishData || !("id" in publishData)) {
      throw new Error(`❌ Instagram Publish Error: ${JSON.stringify(publishData)}`);
    }

    return {
      success: true,
      fbPostId: fbData.id,
      igPostId: publishData.id,
    };
  },
});
