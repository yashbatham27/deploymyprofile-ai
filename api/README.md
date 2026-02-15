🛠 Setup & Installation
Environment Configuration Copy the example environment file and populate it with your GitHub OAuth credentials.

Bash
cp .env.example .env
Note: Ensure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correctly filled in .env.

Start the Server

Bash
cd server
npm install
npm run dev
🔐 Authentication Flow
The application uses GitHub OAuth for authentication. Below is the sequence of operations:

Authorization: The Frontend opens /auth/github/url in a popup to retrieve the GitHub authorization URL.

Callback: GitHub redirects the user to FRONTEND_ORIGIN/github-callback.html with a ?code=... query parameter.

Token Exchange: github-callback.html sends a POST request containing the code to /auth/github/exchange. The backend then stores the session token in a secure cookie.

User Verification: The Frontend calls /auth/github/user to fetch the authenticated user's profile.

🚀 Deployment API
Create Repository
Create a new GitHub repository and initialize it with files.

Endpoint: POST /deploy/create-repo

Request Body:

JSON
{
  "repoName": "my-new-app",
  "files": [
    {
      "path": "index.html",
      "content": "<h1>Hello World</h1>"
    },
    {
      "path": "style.css",
      "content": "body { background: #000; }"
    }
  ]
}