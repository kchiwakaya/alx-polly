# ALX Polly: A Polling Application

Welcome to ALX Polly, a full-stack polling application built with Next.js, TypeScript, and Supabase. This project serves as a practical learning ground for modern web development concepts, with a special focus on identifying and fixing common security vulnerabilities.

## 📋 Project Overview

ALX Polly allows authenticated users to create, share, and vote on polls. It's a simple yet powerful application that demonstrates key features of modern web development:

- **Authentication**: Secure user sign-up and login with email and password
- **Poll Management**: Users can create, view, and delete their own polls
- **Voting System**: A straightforward system for casting and viewing votes
- **User Dashboard**: A personalized space for users to manage their polls
- **Admin Panel**: Administrative interface for managing all polls in the system
- **Social Sharing**: Share polls with others via direct links or social media

## 🛠️ Tech Stack

The application is built with a modern technology stack:

- **Framework**: [Next.js 15.4.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Backend & Database**: [Supabase](https://supabase.io/) (Authentication, Database, Storage)
- **UI Components**: 
  - [Tailwind CSS 4](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - [Radix UI](https://www.radix-ui.com/) for accessible primitives
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **State Management**: React Server Components and Client Components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast notifications

---

## 🚀 The Challenge: Security Audit & Remediation

As a developer, writing functional code is only half the battle. Ensuring that the code is secure, robust, and free of vulnerabilities is just as critical. This version of ALX Polly has been intentionally built with several security flaws, providing a real-world scenario for you to practice your security auditing skills.

**Your mission is to act as a security engineer tasked with auditing this codebase.**

### Your Objectives:

1.  **Identify Vulnerabilities**:

    - Thoroughly review the codebase to find security weaknesses.
    - Pay close attention to user authentication, data access, and business logic.
    - Think about how a malicious actor could misuse the application's features.

2.  **Understand the Impact**:

    - For each vulnerability you find, determine the potential impact.Query your AI assistant about it. What data could be exposed? What unauthorized actions could be performed?

3.  **Propose and Implement Fixes**:
    - Once a vulnerability is identified, ask your AI assistant to fix it.
    - Write secure, efficient, and clean code to patch the security holes.
    - Ensure that your fixes do not break existing functionality for legitimate users.

### Where to Start?

A good security audit involves both static code analysis and dynamic testing. Here’s a suggested approach:

1.  **Familiarize Yourself with the Code**:

    - Start with `app/lib/actions/` to understand how the application interacts with the database.
    - Explore the page routes in the `app/(dashboard)/` directory. How is data displayed and managed?
    - Look for hidden or undocumented features. Are there any pages not linked in the main UI?

2.  **Use Your AI Assistant**:
    - This is an open-book test. You are encouraged to use AI tools to help you.
    - Ask your AI assistant to review snippets of code for security issues.
    - Describe a feature's behavior to your AI and ask it to identify potential attack vectors.
    - When you find a vulnerability, ask your AI for the best way to patch it.

---

## Getting Started

To begin your security audit, you'll need to get the application running on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.io/) account (for authentication and database)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd alx-polly
npm install
```

### 3. Supabase Configuration

1. Create a new project in [Supabase](https://supabase.com/)
2. After your project is created, navigate to the SQL Editor in your Supabase dashboard
3. Run the following SQL to set up the required tables:

```sql
-- Create tables for polls, options, and votes
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);
```

4. Set up Row Level Security (RLS) policies for your tables to control access:

```sql
-- Enable RLS on all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Polls are viewable by everyone" ON polls FOR SELECT USING (true);
CREATE POLICY "Users can insert their own polls" ON polls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own polls" ON polls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own polls" ON polls FOR DELETE USING (auth.uid() = user_id);

-- Options policies
CREATE POLICY "Options are viewable by everyone" ON options FOR SELECT USING (true);
CREATE POLICY "Users can insert options on their polls" ON options FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM polls WHERE id = poll_id)
);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Project Settings > API.

### 5. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📝 Usage Examples

### User Registration and Login

1. Navigate to `http://localhost:3000/register`
2. Create a new account with your email and password
3. After registration, you'll be automatically logged in and redirected to the dashboard
4. For future sessions, you can log in at `http://localhost:3000/login`

### Creating a Poll

1. From the dashboard, click on "Create New Poll"
2. Enter your poll question (e.g., "What's your favorite programming language?")
3. Add at least two options (e.g., "JavaScript", "Python", "TypeScript", "Rust")
4. Click "Create Poll" to save your poll

### Voting on a Poll

1. Access a poll via its unique URL or from the dashboard
2. Select your preferred option
3. Click "Vote" to submit your choice
4. View the results showing the distribution of votes

### Sharing a Poll

1. From the poll details page, click on "Share"
2. Copy the unique poll URL to share directly
3. Alternatively, use the social sharing options to share on platforms like Twitter

### Managing Your Polls

1. Navigate to the dashboard to see all your created polls
2. Click on a poll to view its details and results
3. Use the delete button to remove polls you no longer need

## 🧪 Testing the Application

### Manual Testing

1. **Authentication Flow**:
   - Test registration with valid and invalid inputs
   - Test login with correct and incorrect credentials
   - Test password reset functionality

2. **Poll Creation**:
   - Create polls with different numbers of options
   - Try creating polls with invalid inputs (empty questions, fewer than 2 options)

3. **Voting System**:
   - Vote on your own and others' polls
   - Try voting multiple times on the same poll
   - Test voting as both authenticated and unauthenticated users

4. **Security Testing**:
   - Test for XSS vulnerabilities by inputting script tags in poll questions and options
   - Test for CSRF by attempting to perform actions without proper tokens
   - Test authentication boundaries by trying to access protected routes when logged out

### Building for Production

To build and test the production version locally:

```bash
npm run build
npm run start
```

The production build will be available at `http://localhost:3000`.

## 🔒 Security Considerations

This application has been secured against common vulnerabilities including:

- Cross-Site Scripting (XSS) through input sanitization
- Cross-Site Request Forgery (CSRF) with token validation
- SQL injection via Supabase's parameterized queries
- Authentication weaknesses with rate limiting and password requirements
- Proper access controls for data manipulation

Good luck, engineer! This is your chance to step into the shoes of a security professional and make a real impact on the quality and safety of this application. Happy hunting!

## 🔍 Identified Security Vulnerabilities

After conducting a comprehensive security audit of the codebase, the following vulnerabilities were identified and fixed:

### 1. Authentication Weaknesses

- No password complexity requirements in the registration process
- No rate limiting on login attempts, making it vulnerable to brute force attacks
- Session management relies solely on Supabase tokens without additional security layers

### 2. Data Access Control Issues

- In `poll-actions.ts`:
  - The submitVote function allows anonymous voting (commented note: "Optionally require login to vote")
  - No validation of poll ownership when deleting polls
  - No input sanitization for poll questions and options

### 3. Client-Side Security Issues

- In `vulnerable-share.tsx`:
  - Direct DOM manipulation with user-provided content
  - No validation or sanitization of pollTitle before sharing
  - Potential for XSS attacks through social media sharing functions

### 4. Missing Security Headers

- No Content Security Policy (CSP) headers
- No X-Frame-Options to prevent clickjacking
- No X-Content-Type-Options to prevent MIME-type sniffing

### 5. Environment Variable Handling

- Supabase URL and anon key exposed to client-side code (though this is by design for Supabase)

All these vulnerabilities have been addressed in the current version of the application.
