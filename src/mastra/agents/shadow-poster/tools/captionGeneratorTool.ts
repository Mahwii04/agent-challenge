import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { model } from "../../../config"; // ✅ Use your actual model instance

export const captionGeneratorTool = createTool({
  id: "generate-social-captions",
  description: "Generate IG and FB captions based on a blog post",
  inputSchema: z.object({
    title: z.string(),
    content: z.string(),
    link: z.string().url(),
  }),
  outputSchema: z.object({
    instagram: z.string(),
    facebook: z.string(),
  }),
  execute: async ({ context }) => {
    const { title, content, link } = context;

    const response = await model.doGenerate({
      mode: {
        type: "regular",
      },
      inputFormat: "messages",
      prompt: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
You're a social media strategist.

Based on this blog post:
Title: ${title}
Content: ${content}
Link: ${link}

Generate two captions:
1. Instagram: short, engaging, with 3 hashtags
2. Facebook: longer, informative, and ends with a link + call to action

Respond with:
Instagram: ...
Facebook: ...
              `.trim(),
            },
          ],
        },
      ],
    });

    const output = response.text ?? "";

    const [_, igRaw, fbRaw] = output.split(/Instagram:\s*|Facebook:\s*/g);

    return {
      instagram: igRaw?.trim() ?? "",
      facebook: fbRaw?.trim() ?? "",
    };
  },
});
