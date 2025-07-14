import { RuntimeContext } from "@mastra/core/runtime-context";
import "../../config"


export const createRuntimeContext = () => {
  return new RuntimeContext(
    new Map<string, unknown>([
      ["fbPageId", process.env.META_FB_PAGE_ID],
      ["igUserId", process.env.META_IG_USER_ID],
      ["accessToken", process.env.META_ACCESS_TOKEN],
    ])
  );
};
