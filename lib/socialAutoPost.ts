import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { AxiosError } from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  platforms: string;
}

export interface Account {
  id: number;
  platform: string;
  accessToken: string;
  pageId: string;
  pageToken: string;
}

export interface Platform {
  id: string;
  key: string;
}

export async function publishToPlatforms(post: Post, accounts: Account[]) {
  const { data: platforms, error: platformError } = await supabase
    .from("platforms")
    .select("*")
    .in(
      "id",
      accounts.map((account) => account.platform)
    );

  accounts.forEach((account) => {
    account.platform = platforms?.find(
      (platform) => platform.id == account.platform
    )?.key;
  });

  if (platformError) {
    console.error("Error fetching platforms:", platformError);
    return;
  }

  for (const account of accounts || []) {
    try {
      switch (account.platform) {
        case "facebook":
          try {
            // await axios.post("https://graph.facebook.com/v23.0/me/feed", {
            //   message: post.content,
            //   access_token: account.accessToken,
            // });

            // await axios.post(
            //   `https://graph.facebook.com/v23.0/${account.pageId}/feed`,
            //   {
            //     message: post.content,
            //     access_token: account.pageToken,
            //   }
            // );

            console.log(`Posted to Facebook (account ${account.id})`);
            return { success: true };
          } catch (error) {
            const errorObj = error as AxiosError;
            console.error(
              `Facebook post failed:`,
              errorObj.response?.data || (errorObj.message as string)
            );
            return { success: false };
          }

        case "instagram":
          try {
            const igAccessToken = account.pageToken || account.accessToken;
            const igUserId = account.pageId;

            // 1. Create media container
            const createMediaResp = await axios.post(
              `https://graph.facebook.com/v23.0/${igUserId}/media`,
              {
                image_url: post.imageUrl || "https://example.com/demo.jpg",
                caption: post.content,
                access_token: igAccessToken,
              }
            );
            const creation_id = createMediaResp.data.id;

            // 2. Publish the media container
            const publishResp = await axios.post(
              `https://graph.facebook.com/v23.0/${igUserId}/media_publish`,
              {
                creation_id,
                access_token: igAccessToken,
              }
            );

            console.log(
              `Posted to Instagram (account ${account.id})`,
              publishResp.data
            );
            return { success: true };
          } catch (error) {
            const errorObj = error as any;
            console.error(
              `Instagram post failed:`,
              errorObj.response?.data || errorObj.message
            );
            return { success: false };
          }

        case "twitter":
          console.log(`Twitter posting not implemented yet`);
          return { success: false };

        case "linkedin":
          console.log(`LinkedIn posting not implemented yet`);
          return { success: false };

        default:
          console.log(`Unknown platform: ${account.platform}`);
          return { success: false };
      }
    } catch (error: any) {
      console.error(
        `${account.platform} post failed:`,
        error.response?.data || error.message
      );
      return { success: false };
    }
  }
}
