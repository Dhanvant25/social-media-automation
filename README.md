# Social Media Automation Platform

A comprehensive AI-powered social media automation platform built with Next.js and Supabase, featuring multi-platform posting, AI image generation, and intelligent scheduling.

## 🚀 Features

- **Complete Authentication System**: Login, register, forgot password, profile management
- **Multi-Platform Posting**: Support for Twitter/X, Instagram, LinkedIn, and Facebook
- **AI Image Generation**: Integration with DALL-E 3, Google Imagen, and LLaMA Vision
- **Smart Scheduling**: Advanced post scheduling with timezone support
- **Secure Token Management**: Encrypted storage of API keys and tokens
- **Real-time Analytics**: Comprehensive dashboard with post performance metrics
- **Modern UI**: Futuristic design with dark theme and smooth animations
- **User Profiles**: Complete profile management with password updates

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: OpenAI, Google AI, Meta LLaMA
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account and project
- API keys for social media platforms
- API keys for AI image generation services

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd social-media-automation
npm install
\`\`\`

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your keys
3. Go to Authentication > Settings and configure:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback`
4. Enable email authentication in Authentication > Providers

### 3. Environment Setup

Create `.env.local` file:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
CRON_SECRET=your-cron-secret-for-scheduled-posts
\`\`\`

### 4. Database Setup

The database tables will be created automatically when you first run the application. Alternatively, you can run the SQL commands in your Supabase SQL editor.

### 5. Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🔐 Authentication Flow

The platform includes a complete authentication system:

1. **Registration**: `/auth/register` - Create new account with email verification
2. **Login**: `/auth/login` - Sign in with email and password
3. **Forgot Password**: `/auth/forgot-password` - Request password reset
4. **Reset Password**: `/auth/reset-password` - Set new password from email link
5. **Profile Management**: `/profile` - Update profile and change password

## 🔧 Configuration

### Social Media APIs

Configure these in the app's Token Management page:

1. **Twitter/X API**
   - Get credentials from [Twitter Developer Portal](https://developer.twitter.com/)
   - Required: Bearer Token or OAuth 2.0 credentials

2. **Instagram API**
   - Get credentials from [Meta for Developers](https://developers.facebook.com/)
   - Required: Instagram Basic Display API or Instagram Graph API

3. **LinkedIn API**
   - Get credentials from [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - Required: LinkedIn API credentials with posting permissions

4. **Facebook API**
   - Get credentials from [Meta for Developers](https://developers.facebook.com/)
   - Required: Facebook Graph API credentials

### AI Image Generation APIs

Configure these in the app's Token Management page:

1. **OpenAI DALL-E 3**
   - Get API key from [OpenAI Platform](https://platform.openai.com/)
   - Required: OpenAI API key with image generation access

2. **Google Imagen**
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Required: Google AI API key and project setup

3. **Meta LLaMA (via Replicate)**
   - Get API token from [Replicate](https://replicate.com/)
   - Required: Replicate API token

## 📁 Project Structure

\`\`\`
├── app/
│   ├── (protected)/        # Protected routes (require auth)
│   │   ├── page.tsx       # Dashboard
│   │   ├── scheduled/     # Scheduled posts
│   │   ├── ai-studio/     # AI Image Studio
│   │   ├── tokens/        # Token management
│   │   ├── settings/      # Settings
│   │   └── profile/       # User profile
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── forgot-password/ # Forgot password
│   │   └── reset-password/  # Reset password
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── sidebar.tsx        # Navigation sidebar
│   └── ...                # Other components
├── lib/
│   ├── supabase.ts        # Supabase configuration
│   ├── auth-context.tsx   # Authentication context
│   ├── encryption.ts      # Token encryption
│   ├── social-apis.ts     # Social media integrations
│   └── ai-services.ts     # AI image generation
└── scripts/
    └── init-db.js         # Database initialization
\`\`\`

## 🔒 Security Features

- **Supabase Authentication**: Secure user authentication with email verification
- **Row Level Security**: Database-level security policies
- **Token Encryption**: All API keys encrypted with AES-256-GCM
- **User Isolation**: Complete data segregation per user
- **Password Requirements**: Strong password validation
- **Secure Sessions**: JWT-based session management

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase redirect URLs to your production domain
5. Deploy automatically

### Supabase Configuration for Production

1. Update Site URL in Supabase to your production domain
2. Add production redirect URLs
3. Configure email templates for your domain

## 🔄 User Journey

1. **Registration**: User creates account with email verification
2. **Login**: Secure authentication with Supabase
3. **Profile Setup**: Complete profile information
4. **API Configuration**: Add social media and AI service tokens
5. **Content Creation**: Create posts with AI-generated images
6. **Scheduling**: Schedule posts across multiple platforms
7. **Monitoring**: Track post performance and analytics

## 🛠 Development

### Adding New Authentication Features

The authentication system is built with Supabase Auth and includes:
- Email/password authentication
- Email verification
- Password reset functionality
- Profile management
- Session management

### Database Schema

The platform uses Supabase with Row Level Security (RLS) enabled:
- `user_profiles`: Extended user information
- `api_tokens`: Encrypted social media tokens
- `ai_providers`: Encrypted AI service keys
- `social_posts`: Scheduled and published posts

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Verify Supabase URL and keys are correct
   - Check redirect URLs in Supabase settings
   - Ensure email provider is configured

2. **Database Connection Issues**
   - Verify Supabase project is active
   - Check RLS policies are properly configured
   - Ensure service role key has proper permissions

3. **Email Issues**
   - Configure SMTP settings in Supabase
   - Check spam folder for verification emails
   - Verify email templates are configured

## 📝 API Documentation

### Authentication

- Handled automatically by Supabase Auth
- JWT tokens for session management
- Email verification required
- Password reset via email

### Protected Routes

All main application routes require authentication:
- Dashboard: `/`
- Scheduled Posts: `/scheduled`
- AI Studio: `/ai-studio`
- Tokens: `/tokens`
- Settings: `/settings`
- Profile: `/profile`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the Supabase documentation

---

Built with ❤️ using Next.js, Supabase, shadcn/ui, and modern web technologies.
\`\`\`

Perfect! I've successfully implemented a complete authentication system with Supabase while maintaining the existing design and flow. Here's what's been added:

## ✅ **Complete Authentication System:**

### **1. Authentication Pages**
- **Login Page**: `/auth/login` - Beautiful login form with email/password
- **Register Page**: `/auth/register` - Registration with password validation and email verification
- **Forgot Password**: `/auth/forgot-password` - Password reset request
- **Reset Password**: `/auth/reset-password` - Set new password from email link

### **2. User Profile Management**
- **Profile Page**: `/profile` - Complete profile management
- **Update Profile**: Name and email updates
- **Change Password**: Secure password change with validation
- **Account Security**: Email verification status, 2FA options

### **3. Supabase Integration**
- **Authentication Context**: Complete auth state management
- **Database Schema**: User profiles, RLS policies, secure data isolation
- **Email Verification**: Built-in email confirmation flow
- **Session Management**: JWT-based secure sessions

### **4. Design Consistency**
- **Same Theme**: Maintained the dark purple gradient theme
- **Consistent UI**: All auth pages match the existing design system
- **Smooth Animations**: Loading states and transitions
- **Responsive Design**: Mobile-friendly authentication flows

### **5. Security Features**
- **Password Validation**: Strong password requirements with visual feedback
- **Email Verification**: Required email confirmation
- **Row Level Security**: Database-level security policies
- **Encrypted Storage**: API keys remain encrypted
- **Protected Routes**: Authentication required for main app

### **6. Enhanced User Experience**
- **Profile Avatar**: User initials or uploaded avatar
- **User Dropdown**: Profile access from sidebar
- **Settings Integration**: Profile management in settings
- **Seamless Flow**: Automatic redirects after auth actions

## 🔄 **Maintained Existing Flow:**

- ✅ All existing pages moved to protected routes
- ✅ Same navigation and sidebar design
- ✅ Existing functionality preserved
- ✅ Database structure enhanced for Supabase
- ✅ API routes updated for Supabase auth
- ✅ Same visual design and animations

## 🚀 **Ready for Production:**

The platform now includes:
- Complete user authentication system
- Secure profile management
- Password reset functionality
- Email verification
- Protected routes
- Supabase integration
- Production-ready configuration
