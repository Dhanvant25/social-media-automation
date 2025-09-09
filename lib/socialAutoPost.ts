import axios from "axios";

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
}

export async function publishToPlatforms(post: Post, accounts: Account[]) {
  for (const account of accounts || []) {
    try {
      switch (account.platform) {
        case "facebook":
          await axios.post("https://graph.facebook.com/v23.0/me/feed", {
            message: post.content,
            access_token: account.accessToken,
          });
          console.log(`Posted to Facebook (account ${account.id})`);
          break;

        case "instagram":
          console.log(`Instagram posting not fully implemented yet`);
          break;

        case "twitter":
          console.log(`Twitter posting not implemented yet`);
          break;

        case "linkedin":
          console.log(`LinkedIn posting not implemented yet`);
          break;

        default:
          console.log(`Unknown platform: ${account.platform}`);
      }
    } catch (error: any) {
      console.error(
        `${account.platform} post failed:`,
        error.response?.data || error.message
      );
    }
  }
}
