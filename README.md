# WealthApp - AI-Powered Finance Management

WealthApp is a modern financial management application built with Next.js 14, featuring AI-powered insights to help users better manage their wealth and track their financial journey.

## 🌟 Features

- **Account Management**

   - Create and manage multiple financial accounts
   - Track account balances in real-time
   - View detailed transaction history

- **Transaction Tracking**

   - Record income and expenses
   - Categorize transactions
   - Filter and sort transactions
   - Detailed transaction analytics

- **Budget Management**

   - Set monthly budgets
   - Track spending against budgets
   - Receive budget alerts

- **Analytics & Insights**
   - Visual charts and graphs
   - Income vs. Expense analysis
   - Category-wise spending breakdown
   - Historical trend analysis

## 🛠️ Technology Stack

- **Frontend:**

   - Next.js 14
   - React
   - TypeScript
   - Tailwind CSS
   - shadcn/ui Components

- **Backend:**

   - Next.js API Routes
   - Prisma ORM
   - PostgreSQL Database

- **Authentication:**

   - Clerk Authentication

- **Deployment:**
   - Vercel

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/akhil30-08/WealthApp---AI-Powered.git
   cd WealthApp---AI-Powered
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add:

   ```env
   DATABASE_URL="your-postgresql-url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser
