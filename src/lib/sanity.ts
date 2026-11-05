import { createClient } from "@sanity/client";
import { env } from "./env";

export const sanityClient = env.NEXT_PUBLIC_SANITY_PROJECT_ID ? createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-06-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
}) : null;
