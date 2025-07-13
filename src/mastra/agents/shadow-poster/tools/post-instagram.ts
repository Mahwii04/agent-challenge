import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { model } from "../../../config";


export const instagramTool = createTool({
    id: "instagram-post",
    description: "Generate Instagram post for latest blog post",
    inputSchema: z.object({
        title: z.string(),
        content: z.string(),
        link: z.string(),
    })
})