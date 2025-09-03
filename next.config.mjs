/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net', // OpenAI DALL-E
      'storage.googleapis.com', // Google Imagen
      'replicate.delivery', // Replicate/LLaMA
      'cdn.openai.com',
      'lh3.googleusercontent.com' // Google profile images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

export default nextConfig
