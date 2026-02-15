# DeployMyProfile AI

**DeployMyProfile AI** is a modern React application that leverages Google's Gemini 3 Flash model to instantly transform static PDF/Image resumes into stunning, deployable personal portfolio websites.

![Project Banner](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000)

## 🚀 Features

- **AI-Powered Parsing**: Uses `gemini-3-flash-preview` to extract structured data (Experience, Education, Skills, Projects) from PDF or Image resumes.
- **10+ Professional Themes**: Includes diverse styles like Cyberpunk, Bento Grid, Glassmorphism, Brutalist, and Minimalist.
- **Live Preview & Editing**: Real-time editing of parsed data directly within the selected theme.
- **Theme Customization**: Color pickers for themes that support dynamic styling (Creative, Cyberpunk, etc.).
- **Code Export**: Downloads the full React source code as a ZIP file, ready for local development (Vite + Tailwind).
- **Deployment Workflow (UI)**: A guided UI for connecting GitHub and Vercel accounts to deploy the portfolio instantly.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utils**: JSZip (for export), FileSaver

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── templates/       # Individual Portfolio Themes (Minimalist, Cyberpunk, etc.)
│   │   ├── ui/              # Shared UI components (EditableField, etc.)
│   │   ├── DeployDialog.tsx # Modal for GitHub/Vercel deployment flow
│   │   ├── ResumeUploader.tsx # File upload & AI processing component
│   │   └── ThemeSwitcher.tsx # Theme selection carousel
│   ├── services/
│   │   ├── deployService.ts # Mock service for deployment logic (needs backend)
│   │   ├── exportService.ts # Generates & zips React code for download
│   │   └── geminiService.ts # Handles interaction with Gemini API
│   ├── types.ts             # TypeScript interfaces for Resume Data & State
│   └── App.tsx              # Main application controller
```

## 🔌 Real Deployment Integration Guide

The current application uses a **Mock Service** (`services/deployService.ts`) to demonstrate the UI/UX of the "One-Click Deploy" feature. To make this functional, you need a backend server.

### 1. Prerequisites
- **GitHub OAuth App**: Register at [GitHub Developer Settings](https://github.com/settings/developers).
- **Vercel Integration**: Create an integration at [Vercel Integrations Console](https://vercel.com/dashboard/integrations).
- **Backend Server**: Node.js/Express (recommended).

### 2. Architecture Overview
1.  **Client**: Initiates Auth -> Sends Token to Server -> Polls for Deployment Status.
2.  **Server**: Handles OAuth Handshakes -> Stores Tokens Securely (HttpOnly Cookies) -> Calls GitHub/Vercel APIs.

### 3. Implementation Steps

#### Step A: Backend - GitHub Auth
Create a Node.js route to handle the OAuth callback.
```javascript
// POST /api/auth/github
// Exchange 'code' from client for 'access_token'
const response = await axios.post('https://github.com/login/oauth/access_token', {
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  code: req.body.code
});
// Store response.data.access_token securely
```

#### Step B: Backend - Create Repository
Use the stored token to create a repo and upload files.
```javascript
// POST /api/deploy/create-repo
const octokit = new Octokit({ auth: userGithubToken });
const repo = await octokit.repos.createForAuthenticatedUser({
  name: 'my-portfolio',
  auto_init: true
});

// Use Octokit to commit the generated React files (App.tsx, package.json, etc.)
// You will need to convert the `ResumeData` JSON into file strings server-side.
```

#### Step C: Backend - Vercel Deployment
Link the new GitHub repo to Vercel.
```javascript
// POST https://api.vercel.com/v9/projects
const vercelRes = await fetch('https://api.vercel.com/v9/projects', {
  method: 'POST',
  headers: { Authorization: `Bearer ${userVercelToken}` },
  body: JSON.stringify({
    name: 'my-portfolio',
    gitRepository: { type: 'github', repo: 'username/my-portfolio' }
  })
});
```

#### Step D: Frontend Update
Update `services/deployService.ts` to call your new backend endpoints instead of the mock delays.

```typescript
// services/deployService.ts (Real Implementation Example)
export const connectGitHub = async () => {
  // 1. Redirect user to GitHub OAuth URL
  window.location.href = `https://github.com/login/oauth/authorize?client_id=YOUR_ID&scope=repo`;
  // 2. Handle the callback in a separate route/component to send the 'code' to your backend
};

export const createAndDeploy = async (data: ResumeData) => {
  const response = await fetch('/api/deploy', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json(); // Returns the live URL
};
```

## 🔒 Security Best Practices

1.  **Never expose Client Secrets** in the React frontend code.
2.  **Token Storage**: Do not store OAuth tokens in `localStorage`. Use secure, HttpOnly cookies set by your backend.
3.  **Scope**: Only request the minimum required scopes (`public_repo` for GitHub).

## 📄 License

MIT License. Built with ❤️ using Google Gemini.
