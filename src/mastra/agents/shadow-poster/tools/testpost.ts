import { rssTool } from "./rssTool";
import { captionGeneratorTool } from "./captionGeneratorTool";
import { postToMeta } from "./postToMeta";
import { config } from "dotenv";
import { RuntimeContext } from "@mastra/core/runtime-context";

config(); // Load env vars

const createRuntimeContext = (): RuntimeContext => {
  return {} as RuntimeContext;
};

async function testPostFlow() {
  try {
    // Step 1: Get latest post from RSS
    const rssResult = await rssTool.execute({
      context: {
        feedUrl: "https://www.straikasports.buzz/rss.xml",
      },
      runtimeContext: createRuntimeContext(),
    });

    console.log("✅ Fetched Latest Post:\n", rssResult);

    // Step 2: Generate captions
    const captions = await captionGeneratorTool.execute({
      context: {
        title: rssResult.title,
        content: rssResult.content,
        link: rssResult.link,
      },
      runtimeContext: createRuntimeContext(),
    });

    console.log("✅ Generated Captions:\n", captions);

    // Step 3: Post to Meta
    const metaResult = await postToMeta.execute({
      context: {
        fbPageId: process.env.META_FB_PAGE_ID!, // Make sure these are in your .env
        igUserId: process.env.META_IG_USER_ID!,
        accessToken: process.env.META_ACCESS_TOKEN!,
        captions: {
          instagram: captions.instagram,
          facebook: captions.facebook,
        },
        imageUrl: rssResult.imageUrl,
      },
      runtimeContext: createRuntimeContext(),
    });

    console.log("✅ Successfully Posted to Meta:\n", metaResult);
  } catch (err) {
    console.error("❌ Error in testPostFlow:\n", err);
  }
}

testPostFlow();
