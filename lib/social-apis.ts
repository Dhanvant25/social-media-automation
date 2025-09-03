// Social Media API integrations
interface PostData {
  content: string
  imageUrl?: string
}

interface PlatformConfig {
  accessToken: string
  [key: string]: any
}

export class SocialMediaAPI {
  // Twitter/X API
  static async postToTwitter(postData: PostData, config: PlatformConfig) {
    try {
      const twitterAPI = "https://api.twitter.com/2/tweets"

      const payload: any = {
        text: postData.content,
      }

      if (postData.imageUrl) {
        // First upload media
        const mediaResponse = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_data: postData.imageUrl,
          }),
        })

        const mediaData = await mediaResponse.json()
        payload.media = { media_ids: [mediaData.media_id_string] }
      }

      const response = await fetch(twitterAPI, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      return await response.json()
    } catch (error) {
      throw new Error(`Twitter posting failed: ${error}`)
    }
  }

  // Instagram API
  static async postToInstagram(postData: PostData, config: PlatformConfig) {
    try {
      const instagramAPI = `https://graph.facebook.com/v18.0/${config.accountId}/media`

      // Create media object
      const mediaResponse = await fetch(instagramAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: postData.imageUrl,
          caption: postData.content,
          access_token: config.accessToken,
        }),
      })

      const mediaData = await mediaResponse.json()

      // Publish media
      const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${config.accountId}/media_publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: config.accessToken,
        }),
      })

      return await publishResponse.json()
    } catch (error) {
      throw new Error(`Instagram posting failed: ${error}`)
    }
  }

  // LinkedIn API
  static async postToLinkedIn(postData: PostData, config: PlatformConfig) {
    try {
      const linkedInAPI = "https://api.linkedin.com/v2/ugcPosts"

      const payload: any = {
        author: `urn:li:person:${config.personId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postData.content,
            },
            shareMediaCategory: postData.imageUrl ? "IMAGE" : "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }

      if (postData.imageUrl) {
        // Upload image first
        const uploadResponse = await this.uploadToLinkedIn(postData.imageUrl, config)
        payload.specificContent["com.linkedin.ugc.ShareContent"].media = [
          {
            status: "READY",
            description: {
              text: "Image",
            },
            media: uploadResponse.asset,
            title: {
              text: "Image",
            },
          },
        ]
      }

      const response = await fetch(linkedInAPI, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(payload),
      })

      return await response.json()
    } catch (error) {
      throw new Error(`LinkedIn posting failed: ${error}`)
    }
  }

  // Facebook API
  static async postToFacebook(postData: PostData, config: PlatformConfig) {
    try {
      const facebookAPI = `https://graph.facebook.com/v18.0/${config.pageId}/feed`

      const payload: any = {
        message: postData.content,
        access_token: config.accessToken,
      }

      if (postData.imageUrl) {
        payload.link = postData.imageUrl
      }

      const response = await fetch(facebookAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      return await response.json()
    } catch (error) {
      throw new Error(`Facebook posting failed: ${error}`)
    }
  }

  private static async uploadToLinkedIn(imageUrl: string, config: PlatformConfig) {
    // LinkedIn image upload logic
    const registerResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${config.personId}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    })

    return await registerResponse.json()
  }
}
