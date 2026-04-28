# Opal Dashboard

A full-stack task-tracker and team productivity dashboard built with Next.js, NextAuth, and MongoDB.

## Features

- Publicly viewable dashboard (no login required to view)
- User authentication with NextAuth
- MongoDB database integration
- Task management and tracking
- Team productivity analytics
- Real-time name updates

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (for database)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anujsingh-nickelfox/opal.git
cd opal/opal-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file with the following environment variables:

```env
DATABASE_URL="mongodb+srv://your_username:your_password@cluster0.mongodb.net/opal?retryWrites=true&w=majority"
MONGODB_URI="mongodb+srv://your_username:your_password@cluster0.mongodb.net/opal?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
opal-main/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js  # NextAuth configuration
│   │   └── user/update-name/route.js    # User name update API
│   ├── dashboard/                        # Dashboard pages
│   └── layout.tsx                       # Root layout
├── components/
│   └── dashboard/                       # Dashboard components
├── lib/
│   ├── authOptions.js                   # Shared NextAuth config
│   └── mongodb.js                       # MongoDB connection
├── models/
│   └── User.js                          # Mongoose User schema
└── .env.local                           # Environment variables (not committed)
```

## Deploy on Netlify

### Prerequisites

- Netlify account
- MongoDB Atlas database
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to a Git repository
2. Make sure `.env.local` is in `.gitignore` (it should be by default)

### Step 2: Connect Netlify to Git

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider
4. Select the `opal-main` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: Leave empty or set to `opal-main` if needed

### Step 3: Configure Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add the following environment variables:

```
DATABASE_URL = mongodb+srv://your_username:your_password@cluster0.mongodb.net/opal?retryWrites=true&w=majority
MONGODB_URI = mongodb+srv://your_username:your_password@cluster0.mongodb.net/opal?retryWrites=true&w=majority
NEXTAUTH_SECRET = your_secret_key_here (generate a secure random string)
NEXTAUTH_URL = https://your-site-name.netlify.app
```

**Important:** 
- Replace `your-site-name` with your actual Netlify site URL
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

3. Select **All** environments (Production, Preview, Development)
4. Click **Save**

### Step 4: Deploy

1. Click **Deploy site**
2. Netlify will build and deploy your application
3. Once deployed, visit your Netlify URL to verify the deployment

### Step 5: Verify Environment Variables

After deployment, check that all environment variables are set correctly:

1. Go to **Deploys** → Select your latest deploy
2. Click **Deploy log** to view the build log
3. Ensure no errors related to missing environment variables

### Troubleshooting

**Build fails with "Module not found" errors:**
- Ensure all dependencies are in `package.json`
- Check that `npm install` ran successfully during build

**Authentication errors:**
- Verify `NEXTAUTH_SECRET` is set in Netlify environment variables
- Ensure `NEXTAUTH_URL` matches your Netlify site URL exactly
- Check MongoDB connection string is correct

**Database connection errors:**
- Verify MongoDB Atlas IP whitelist allows Netlify's IP addresses (or set to 0.0.0.0/0 for testing)
- Check database username and password are correct
- Ensure the database name matches your MongoDB Atlas database name

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | Yes |
| `MONGODB_URI` | Alternative MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption | Yes |
| `NEXTAUTH_URL` | Your deployed application URL | Yes |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [NextAuth.js Documentation](https://next-auth.js.org) - Authentication for Next.js
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com) - Cloud database documentation
- [Netlify Documentation](https://docs.netlify.com) - Deployment platform documentation

## License

This project is licensed under the MIT License.
