# Avisek Ray (biisal) - Portfolio

A modern, full-stack developer portfolio built with Next.js 16, React 19, and Tailwind CSS v4. This project showcases my skills, projects, and thoughts through a clean, dark-themed interface with smooth animations and robust backend integration.

## Live Link [codeltix.com](https://codeltix.com)

![Portfolio Preview](./demo/hero.png)

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) / Shadcn-like Implementation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content Management**: Custom Blog & Project System
- **Integrations**:
  - Telegram Bot (Contact Form)
  - Cloudinary (Image Hosting)
  - Wakatime (Coding Stats)

## ✨ Features

- **Dynamic Content**: CMS-like features for managing Projects and Blog posts.
- **Admin Dashboard**: Secure admin area for content management.
- **Interactive UI**: Smooth transitions, scroll animations, and a polished dark mode aesthetic.
- **Contact Form**: Direct integration with Telegram for instant message delivery.
- **Real-time Stats**: Live coding statistics via Wakatime API.
- **SEO Optimized**: Built-in metadata and Open Graph support.

## � Screenshots

### Projects

![Projects](./demo/projects.png)

|            Skills            |           Blog            |
| :--------------------------: | :-----------------------: |
| ![Skills](./demo/skills.png) | ![Blog](./demo/blogs.png) |

### Contact

![Contact](./demo/contact.png)

## �🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Database
- Cloudinary Account
- Telegram Bot Token (optional, for contact form)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/biisal/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Environment Setup:**

    Rename `.env.example` to `.env` and fill in your secrets:

    ```bash
    cp .env.example .env
    ```

    Required variables:
    - `DATABASE_URL`: MongoDB connection string
    - `BETTER_AUTH_SECRET`: Secret for authentication
    - `ADMIN_SECRET`: Secret header for admin actions
    - `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: For contact form
    - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: For images

4.  **Database Setup:**

    Generate Prisma client and push schema:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🛣️ Routes

### Pages

- `/`: Home Page (Intro, About, Skills, etc.)
- `/projects`: All Projects List
- `/project/[slug]`: Single Project Details
- `/blog`: Blog Posts
- `/contact`: Contact Page
- `/login`: Admin Login

### Admin Routes (Protected)

- `/blog/editor`: Create/Edit Blog Posts
- `/projects/form`: Create/Edit Projects

### API Endpoints

- `GET /api/projects`: Fetch all projects
- `POST /api/projects`: Create a new project (Admin)
- `GET /api/blog/[slug]`: Get a specific blog post
- `POST /api/contact`: Send a contact message

## 📂 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components.
- `/lib`: Utility functions, Prisma client, and configurations.
- `/prisma`: Database schema.
- `/public`: Static assets.

## 👤 Author

**Avisek Ray (biisal)**

- Website: [codeltix.com](https://codeltix.com)
- GitHub: [@biisal](https://github.com/biisal)
- LinkedIn: [Avisek Ray](https://www.linkedin.com/in/biisal)
- X (Twitter): [@biisal18](https://x.com/biisal18)

## 📄 License

This project is licensed under the MIT License.
