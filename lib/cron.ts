// import { supabase } from "./supabase";
import { createClient } from "@supabase/supabase-js";
import cron from "node-cron";
import axios from "axios";
import { publishToPlatforms } from "./socialAutoPost";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

cron.schedule("* 9 * * *", async () => {
  console.log("Checking scheduled posts...");

  const now = new Date().toISOString();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .lte("scheduledTime", now)
    .eq("isPublished", false);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("No scheduled posts found.");
    return;
  }

  for (const post of posts) {
    console.log(
      "Publishing post:",
      post.content,
      post.platforms,
      post.isPublished
    );

    const { data: accounts, error: accError } = await supabase
      .from("socialMedia")
      .select("*")
      .in("platform", post.platforms.split(","))
      .eq("isActive", true);

    // console.log("Accounts:", accounts);

    if (accError) {
      console.error("Error fetching accounts:", accError);
      continue;
    }

    const publishResult = await publishToPlatforms(post, accounts);

    // console.log("Publish result:", publishResult);

    if (publishResult?.success) {
      try {
        const { data: updatedPost } = await supabase
          .from("posts")
          .update({ isPublished: true })
          .eq("id", post.id)
          .single();
        console.log("Post updated:", updatedPost);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  }
});
