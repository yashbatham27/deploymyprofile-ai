import { ResumeData, Theme, ThemeColors } from "../types";
import { getThemeComponentCode } from "./exportService";

const API_BASE_URL = "/api";

// --- Static Templates ---

const VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });`;

const POSTCSS_CONFIG = `export default { 
  plugins: { tailwindcss: {}, autoprefixer: {} } 
};`;

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}`;

// --- Helpers ---

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) throw new Error("Request failed");
  }

  if (!response.ok) {
    let message = data?.error ?? data ?? "Request failed";
    if (typeof message === "object") message = message.message || JSON.stringify(message);
    throw new Error(message);
  }
  return data;
}

const GH_ACTION_WORKFLOW = `name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

const generateFilesForRepo = (
  data: ResumeData, 
  theme: Theme, 
  colors: ThemeColors, 
  repoName: string, 
  deployGhPages: boolean
) => {
  const themeAppCode = getThemeComponentCode(theme, data, colors);

  // 1. Dynamic Vite Config with Base Path for GH Pages
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ 
  plugins: [react()],
  base: ${deployGhPages ? `'/${repoName}/'` : "'/'"}, 
});`;

  const files = [
    {
      path: "package.json",
      content: JSON.stringify({
        name: repoName,
        version: "1.0.0",
        type: "module",
        scripts: { 
          dev: "vite", 
          build: "vite build", 
          preview: "vite preview" 
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "framer-motion": "^10.16.4",
          "lucide-react": "^0.263.1",
          clsx: "^2.0.0",
          "tailwind-merge": "^1.14.0",
        },
        devDependencies: {
          "@types/react": "^18.2.15",
          "@types/react-dom": "^18.2.7",
          "@vitejs/plugin-react": "^4.0.3",
          autoprefixer: "^10.4.14",
          postcss: "^8.4.27",
          tailwindcss: "^3.3.3",
          typescript: "^5.0.2",
          vite: "^4.4.5",
        },
      }, null, 2),
    },
    { path: "tailwind.config.js", content: TAILWIND_CONFIG },
    { path: "postcss.config.js", content: POSTCSS_CONFIG },
    { path: "vite.config.ts", content: viteConfig },
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.personalInfo.name} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="src/main.tsx"></script>
  </body>
</html>`,
    },
    { path: "src/main.tsx", content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);` },
    { path: "src/index.css", content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
    { path: "src/App.tsx", content: themeAppCode },
    { path: "README.md", content: `# ${data.personalInfo.name}'s Portfolio\n\nGenerated via Portfolio-AI.` },
  ];

  // 2. Add GitHub Action Workflow if GH Pages is selected
  if (deployGhPages) {
    files.push({
      path: ".github/workflows/deploy.yml",
      content: GH_ACTION_WORKFLOW,
    });
  }

  return files;
};

// --- Exported Services ---

export const connectGitHub = async (): Promise<string> => {
  const { url } = await apiRequest("/auth/github/url");
  const popup = window.open(url, "_blank", "width=600,height=700");
  if (!popup) throw new Error("Popup blocked.");

  return new Promise((resolve, reject) => {
    const handleMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      const { type, username, error } = ev.data || {};
      if (type === "github_auth_success") { cleanup(); resolve(username); }
      else if (type === "github_auth_error") { cleanup(); reject(new Error(error)); }
    };
    const cleanup = () => window.removeEventListener("message", handleMessage);
    window.addEventListener("message", handleMessage);
  });
};

export const createAndDeployToGitHub = async (
  repoName: string,
  data: ResumeData,
  theme: Theme,
  colors: ThemeColors,
  isPrivate: boolean = false,
  createVercel: boolean = false,
  deployGhPages: boolean = false // New Param
): Promise<{ repoUrl: string; vercelUrl?: string; ghPagesUrl?: string; owner?: string; repo?: string }> => {
  const files = generateFilesForRepo(data, theme, colors, repoName, deployGhPages);
  
  const result = await apiRequest("/deploy/create-repo", {
    method: "POST",
    body: JSON.stringify({ 
        repoName, 
        files, 
        private: isPrivate, 
        createVercel, 
        deployGhPages // Send to backend
    }),
  });
  return result; // Return the whole object now
};

export const connectVercel = async (): Promise<string> => {
  const { url } = await apiRequest('/auth/vercel/url');
  
  // Create and store CSRF token
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem("latestCSRFToken", state);

  // Vercel flow usually requires /install or /new depending on version
  const finalUrl = `${url}?state=${state}`;
  
  const popup = window.open(finalUrl, '_blank', 'width=600,height=700');
  if (!popup) throw new Error('Popup blocked.');

  return new Promise((resolve, reject) => {
    const handleMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;

      const { type, username, state: returnedState, error } = ev.data || {};

      if (type === 'vercel_auth_success') {
        const storedState = localStorage.getItem("latestCSRFToken");
        localStorage.removeItem("latestCSRFToken");

        // Validate CSRF state
        if (returnedState !== storedState) {
          cleanup();
          return reject(new Error("CSRF Validation failed. State mismatch."));
        }

        cleanup();
        resolve(username || "Vercel User");
      } else if (type === 'vercel_auth_error') {
        cleanup();
        reject(new Error(error || 'Vercel auth failed'));
      }
    };

    const cleanup = () => window.removeEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
  });
};

export const enableGitHubPages = async (
  owner: string,
  repo: string
): Promise<{ ghPagesUrl: string }> => {
  const result = await apiRequest("/deploy/enable-pages", {
    method: "POST",
    body: JSON.stringify({ owner, repo }),
  });
  return result;
};