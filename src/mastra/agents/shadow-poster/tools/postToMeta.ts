import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";
import "../../../config";
import { createRuntimeContext } from "../runtime";

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
    const fbPageId = createRuntimeContext().get("fbPageId") as string;
    const igUserId = createRuntimeContext().get("igUserId") as string;
    const accessToken = createRuntimeContext().get("accessToken") as string;
    const { captions, imageUrl } = context;

    // Create FB container
    if (!imageUrl) {
      throw new Error("❌ Facebook post requires an image URL.")
    }
    const fbResponse = await fetch(`https://graph.facebook.com/v20.0/${fbPageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        message: captions.facebook,
        access_token: accessToken,
      }),
    });

    const fbData = (await fbResponse.json()) as FacebookPostResponse | MetaErrorResponse;

    if ("error" in fbData) {
      throw new Error(`❌ Facebook Post Error: ${JSON.stringify(fbData)}`);
    }

    // Create IG container
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

    // Publish IG post
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
