import { supabase } from "./supabase";
import cron from "node-cron";
import axios from "axios";
import "dotenv/config";
import { publishToPlatforms } from "./socialAutoPost";

cron.schedule("* * * * *", async () => {
  console.log("Checking scheduled posts...");

  const now = new Date().toISOString();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .lte("scheduledTime", now);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("No scheduled posts found.");
    return;
  }

  for (const post of posts) {
    console.log("Publishing post:", post.content);

    const { data: accounts, error: accError } = await supabase
      .from("socialMedia")
      .select("*")
      .in("platform", post.platforms.split(","))
      .eq("isActive", true);

    if (accError) {
      console.error("Error fetching accounts:", accError);
      continue;
    }

    await publishToPlatforms(post, accounts);
  }
});
