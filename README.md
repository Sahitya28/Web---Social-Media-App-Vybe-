# Vybe — Communities That Hit Different ✨

A modern full-stack community platform built with Next.js 14, Tailwind CSS, Prisma, SQLite, and NextAuth.js. Vybe combines community discussions, posts, comments, emoji reactions, a weighted down-vote system, account management, and a dark Gen-Z-inspired interface.

## ✨ Features

- 🔐 Email/password authentication using NextAuth.js Credentials Provider and JWT sessions
- 🏘️ Create and browse communities at `/r/[community-slug]`
- ✍️ Create text posts with optional image URLs
- 💬 Comment on posts
- 🔥 Emoji reactions on posts and comments
- 👎 Down-vote reaction on posts and comments
- 🔄 Add, remove, or switch reactions
- 🆕 Sort posts by **New**
- 🏆 Sort posts by **Top** using a weighted reaction score
- 🗑️ Delete your own posts and comments
- ⚠️ Delete communities you created, with cascading removal of their posts
- 👤 Change your username without logging in again
- 🧹 Permanently delete your account with cascading cleanup
- 🖼️ Upload JPG/PNG/WEBP/GIF profile photos up to 3 MB
- 🛡️ Protected routes using Next.js middleware
- 💀 Skeleton loading states
- 📱 Responsive dark UI with purple, pink, and cyan gradients

## ❤️ Reaction System

Vybe uses reactions instead of traditional upvote/downvote buttons while still supporting a dedicated down-vote reaction.

Available reactions:

| Reaction | Meaning |
|---|---|
| 🔥 | Fire |
| 😂 | Laugh |
| 😮 | Wow |
| 😢 | Sad |
| 👀 | Watching |
| ❤️ | Love |
| 👎 | Down-vote |

Each user can have one reaction per post or comment.

- Click a reaction to add it.
- Click the same reaction again to remove it.
- Click another reaction to switch to it.

The 👎 reaction is weighted negatively and therefore lowers a post's Top score.

## 🏆 Sorting

Posts can be sorted by:

### New
Shows the newest posts first.

### Top
Ranks posts using a weighted reaction score. Positive reactions contribute positively to the score, while 👎 contributes negatively.

This makes Top sorting more meaningful than simply counting the number of reactions.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 — App Router |
| UI | React + Tailwind CSS |
| Backend | Next.js Route Handlers |
| ORM | Prisma |
| Database | SQLite by default |
| Production DB | PostgreSQL-ready |
| Authentication | NextAuth.js |
| Sessions | JWT |
| Password hashing | bcryptjs |

## 📁 Project Structure

```text
app/
├── api/
│   ├── auth/              # NextAuth + registration
│   ├── posts/             # Posts + reactions
│   ├── comments/          # Comments + reactions
│   ├── communities/       # Communities
│   └── account/           # Username/account management
├── communities/           # Browse/create communities
├── login/                 # Login
├── register/              # Registration
├── profile/               # User profile
├── post/[id]/             # Post detail + comments
└── r/[slug]/              # Community + submit-post pages

components/                # Reusable UI components
lib/                       # Prisma + authentication utilities
prisma/                    # Schema, migrations, seed
public/uploads/avatars/    # Local profile uploads
middleware.js              # Protected routes
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`.

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

Configure:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

### 3. Set up Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npm run seed
```

The seed creates demo users, communities, posts, comments, and reactions.

### 5. Start the application

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

## 🔑 Demo Accounts

| Email | Password |
|---|---|
| `alice@example.com` | `password123` |
| `bob@example.com` | `password123` |

These credentials are intended for local development/testing only.

## 🏘️ Communities

Users can create communities with a name, unique slug, description, and vibe emoji.

Example:

```text
/r/webdev
/r/gaming
```

Community creators can delete their communities. Deleting a community removes its posts and associated comments/reactions through cascading relationships.

## 📝 Posts

Posts belong to communities and can contain:

- Title
- Text content
- Optional image URL
- Author
- Timestamp
- Comments
- Reactions

Users can delete their own posts.

## 💬 Comments

Comments support:

- Text
- Author
- Timestamp
- Emoji reactions
- Deletion by their author

Nested/threaded comments are not currently implemented.

## 👤 Profiles & Account Management

Users can:

- View their profile
- Change their username
- Upload a profile photo
- Permanently delete their account

Profile photos support JPG, PNG, WEBP, and GIF files up to 3 MB and are stored locally in `public/uploads/avatars`.

Deleting an account removes the user's posts, comments, reactions, and communities they created.

## 🔐 Authentication & Protected Routes

Vybe uses NextAuth.js Credentials Provider with JWT sessions.

Protected functionality includes:

```text
/r/[slug]/submit
/communities/new
/profile
```

## 🗄️ Database

Main Prisma models:

```text
User
Community
Post
Comment
Reaction
CommentReaction
```

Reaction models enforce one reaction per user per target through unique constraints.

Cascading deletes clean up dependent records when posts, communities, or accounts are deleted.

## 🐘 Switching to PostgreSQL

Change the Prisma datasource from SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

to:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Set the PostgreSQL connection string in `.env`, then run the appropriate Prisma migration commands.

For production:

```bash
npx prisma migrate deploy
```

## ☁️ Deployment

Recommended production setup:

```text
Browser
   ↓
Vercel
   ↓
Next.js
   ↓
Route Handlers
   ↓
Prisma
   ↓
PostgreSQL
```

Configure:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
```

For production deployments, local avatar storage should be replaced with persistent cloud/object storage because serverless filesystems may not persist between deployments.

## 📜 Useful Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run linting |
| `npm run seed` | Seed demo data |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Development migration |
| `npx prisma migrate deploy` | Production migration |

## 🔌 API Overview

### Authentication
`/api/auth/*`

### Posts
`/api/posts`  
`/api/posts/[id]`  
`/api/posts/[id]/react`

### Comments
`/api/comments`  
`/api/comments/[id]`  
`/api/comments/[id]/react`

### Communities
`/api/communities`  
`/api/communities/[slug]`

### Account
`/api/account`

## 🎨 Design

Vybe uses a dark, expressive interface featuring:

- Purple gradients
- Pink accents
- Cyan highlights
- Rounded cards
- Emoji-driven interactions
- Responsive layouts
- Loading skeletons
- Gen-Z-inspired visual styling

## 🔮 Future Improvements

- 🧵 Nested/threaded comments
- 🔔 Notifications
- 🔖 Bookmarks
- ⚡ Real-time updates with WebSockets
- ☁️ Cloud-based image storage
- 🛡️ Admin/moderation tools
- 🚨 Reporting system
- 🔎 Search
- 📊 Community analytics
- 🏅 Reputation and badges
- 📱 PWA/mobile experience

## 📌 MVP Limitations

- Post images currently use image URLs rather than uploaded files.
- Avatars are stored locally.
- Comments are not nested.
- No real-time notification system.
- No dedicated moderation/admin system.
- SQLite is primarily intended for local development.

## 📄 License

No license is currently specified for the project. Add a license if the repository will be distributed publicly.

## 💜 Built with Vybe

Communities should have a little more personality.

**No boring arrows. Just vibes. ✨**
