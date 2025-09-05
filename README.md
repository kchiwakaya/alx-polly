# ALX Polly: A Polling Application

Welcome to ALX Polly, a full-stack polling application built with Next.js, TypeScript, and Supabase. This project serves as a practical learning ground for modern web development concepts, with a special focus on identifying and fixing common security vulnerabilities.

## About the Application

ALX Polly allows authenticated users to create, share, and vote on polls. It's a simple yet powerful application that demonstrates key features of modern web development:

- **Authentication**: Secure user sign-up and login.
- **Poll Management**: Users can create, view, and delete their own polls.
- **Voting System**: A straightforward system for casting and viewing votes.
- **User Dashboard**: A personalized space for users to manage their polls.

The application is built with a modern tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Server Components and Client Components

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
- A [Supabase](https://supabase.io/) account (the project is pre-configured, but you may need your own for a clean slate).

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd alx-polly
npm install
```

### 3. Environment Variables

The project uses Supabase for its backend. An environment file `.env.local` is needed.Use the keys you created during the Supabase setup process.

### 4. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

Good luck, engineer! This is your chance to step into the shoes of a security professional and make a real impact on the quality and safety of this application. Happy hunting!

## Identified vulnerabilities are as follows

Builder

Let's conduct a comprehensive security audit by first examining authentication implementation and data access controls.

Search codebase for 'Find files related to authentication, authorization, and data access control including middleware, auth context, and database queries'

Let's examine the vulnerable-share.tsx file as it appears to have potential security implications.

alx-polly\app\(dashboard)\polls\vulnerable-share.tsx 1 - 50

Let's examine the poll-actions.ts file to understand how poll data is accessed and manipulated.

alx-polly\app\lib\actions\poll-actions.ts 1 - 100

Let's check the auth-actions.ts file to review authentication implementation and potential vulnerabilities.

alx-polly\app\lib\actions\auth-actions.ts 1 - 100

After reviewing the codebase, I've identified several security vulnerabilities:

1. 1. Authentication Weaknesses:

- No password complexity requirements in the registration process
- No rate limiting on login attempts, making it vulnerable to brute force attacks
- Session management relies solely on Supabase tokens without additional security layers

2. 1. Data Access Control Issues:

- In `poll-actions.ts` :
  - The submitVote function allows anonymous voting (commented note: "Optionally require login to vote")
  - No validation of poll ownership when deleting polls
  - No input sanitization for poll questions and options

3. 1. Client-Side Security Issues:

- In `vulnerable-share.tsx` :
  - Direct DOM manipulation with user-provided content
  - No validation or sanitization of pollTitle before sharing
  - Potential for XSS attacks through social media sharing functions

4. 1. Missing Security Headers:

- No Content Security Policy (CSP) headers
- No X-Frame-Options to prevent clickjacking
- No X-Content-Type-Options to prevent MIME-type sniffing

5. 1. Environment Variable Handling:

- Supabase URL and anon key exposed to client-side code (though this is by design for Supabase)
