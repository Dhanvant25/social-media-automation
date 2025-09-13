// import { supabase } from "./supabase";
import { createClient } from "@supabase/supabase-js";
import cron from "node-cron";
import axios from "axios";
import { publishToPlatforms } from "./socialAutoPost";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

cron.schedule("* * * * *", async () => {
  console.log("Checking scheduled posts...");

  const today = new Date().toISOString().split("T")[0];

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .gte("scheduledTime", `${today}T00:00:00.000Z`)
    .lt("scheduledTime", `${today}T23:59:59.999Z`)
    .eq("isPublished", false);

  // const now = new Date().toISOString();

  // const { data: posts, error } = await supabase
  //   .from("posts")
  //   .select("*")
  //   .eq("scheduledTime", now)
  //   .eq("isPublished", false);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("No scheduled posts found.");
    return;
  }

  for (const post of posts) {
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

    if (accounts.length === 0) {
      console.log("No active accounts found for post:", post);
      continue;
    }

    console.log("Accounts Check=============>", accounts, post);

    const publishResult = await publishToPlatforms(post, accounts);

    console.log("Publish result=============>:", publishResult);

    if (publishResult?.success) {
      try {
        const { data, error, count } = await supabase
          .from("posts")
          .update({ isPublished: true })
          .eq("uuid", post.uuid)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Error updating post:", error);
        } else if (!data) {
          console.error("No post found to update. ID:", post.uuid);
        } else {
          console.log("✅ Post updated:", data);
        }
      } catch (err) {
        console.error("Unexpected error updating post:", err);
      }
    }
  }
});
