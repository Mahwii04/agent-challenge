// import { rssTool } from "./rssTool";
// import { z } from "zod";
// import { RuntimeContext } from "@mastra/core/runtime-context";

// // 1. First, let's discover the actual RuntimeContext shape
// type ExpectedRuntimeContext = Parameters<typeof rssTool.execute>[0]['runtimeContext'];

// // 2. Define minimal safe context (adjust based on discovery)
// const createRuntimeContext = (): RuntimeContext => {
//   return {} as RuntimeContext; // Temporary safe cast
// };


// // 3. Define input schema
// const rssToolInputSchema = z.object({
//   feedUrl: z.string().url(),
// });

// async function testRSS() {
//   try {
//     const executionContext = {
//       context: { feedUrl: "https://straikasports.buzz/rss.xml" },
//       runtimeContext: createRuntimeContext(),
//       // Optional standard properties
//       runId: `run-${Date.now()}`,
//       threadId: `thread-${Date.now()}`,
//     };

//     const validatedContext = {
//       ...executionContext,
//       context: rssToolInputSchema.parse(executionContext.context),
//     };

//     const result = await rssTool.execute(validatedContext);
//     console.log("✅ Result:", result);
//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// }

// testRSS();


import { captionGeneratorTool } from "./captionGeneratorTool";
import { RuntimeContext } from "@mastra/core/runtime-context";

const createRuntimeContext = (): RuntimeContext => {
  return {} as RuntimeContext;
};

async function testCaption() {
  try {
    const executionContext = {
      context: {
        title: "Tyrese Haliburton Joins NBA Legends With Historic Finals Performance Before Age 26",
        content: "Tyrese Haliburton made NBA history during the Finals, recording a standout stat line that etched his name among elite players.",
        link: "https://www.straikasports.buzz/post/tyrese-haliburton-joins-nba-legends",
      },
      runtimeContext: createRuntimeContext(),
    };

    const result = await captionGeneratorTool.execute(executionContext);
    console.log("✅ Captions:\n", result);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testCaption();
