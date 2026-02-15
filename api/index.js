require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Octokit } = require("@octokit/rest");

const app = express();
const router = express.Router();

const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const VERCEL_CLIENT_ID = process.env.VERCEL_CLIENT_ID;
const VERCEL_CLIENT_SECRET = process.env.VERCEL_CLIENT_SECRET;

// Helper to wait for GitHub to catch up (prevents 404 on tree creation)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function verifyRef(octokit, owner, repo, ref, retries = 7) {
  for (let i = 0; i < retries; i++) {
    try {
      // 1. Check if the branch ref exists
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${ref}`,
      });
      const commitSha = refData.object.sha;

      // 2. Check if the commit is actually readable (ensures DB is ready)
      const { data: commitData } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: commitSha,
      });

      return {
        commitSha: commitSha,
        treeSha: commitData.tree.sha,
      };
    } catch (e) {
      console.log(`Git DB sync in progress... retrying (${i + 1}/${retries})`);
      await sleep(3000); // 3-second intervals
    }
  }
  throw new Error(`Repository Git database failed to initialize in time.`);
}

// --- GITHUB OAUTH ---

// router.get("/auth/github/url", (req, res) => {
//   const redirectUri = `${FRONTEND_ORIGIN}/github-callback.html`;
//   const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,workflow&redirect_uri=${encodeURIComponent(redirectUri)}`;
//   res.json({ url });
// });

router.post("/auth/github/exchange", async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResp = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const token = tokenResp.data.access_token;
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.users.getAuthenticated();

    res.cookie("gh_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.json({ username: user.login });
  } catch (err) {
    res.status(500).json({ error: "GitHub exchange failed" });
  }
});

router.post("/deploy/enable-pages", async (req, res) => {
  const gh_token = req.cookies.gh_token;
  const { owner, repo } = req.body;

  if (!gh_token) {
    return res
      .status(401)
      .json({ error: "GitHub token missing. Reconnect GitHub." });
  }

  if (!owner || !repo) {
    return res.status(400).json({ error: "Owner and repo name are required." });
  }

  const octokit = new Octokit({ auth: gh_token });

  try {
    console.log(`Enabling Pages for ${owner}/${repo}...`);

    // Give GitHub time to process the workflow file
    await sleep(3000);

    const pagesResp = await octokit.repos.createPagesSite({
      owner,
      repo,
      build_type: "workflow",
    });

    console.log("Pages enabled successfully:", pagesResp.data);
    res.json({ ghPagesUrl: `https://${owner}.github.io/${repo}/` });
  } catch (err) {
    console.error("Enable Pages Error:", {
      status: err.response?.status,
      message: err.response?.data?.message || err.message,
      data: err.response?.data,
    });

    // Handle specific GitHub errors
    if (err.response?.status === 409) {
      // Pages already enabled
      return res.json({ ghPagesUrl: `https://${owner}.github.io/${repo}/` });
    }

    const errorMsg =
      err.response?.data?.message || err.message || "Could not enable Pages";
    res.status(err.response?.status || 500).json({ error: errorMsg });
  }
});

// --- VERCEL OAUTH ---

router.get("/auth/vercel/url", (req, res) => {
  const slug = "resume-2-portfolio";
  const url = `https://vercel.com/integrations/${slug}/install`;
  res.json({ url });
});

router.post("/auth/vercel/exchange", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const params = new URLSearchParams();
    params.append("client_id", VERCEL_CLIENT_ID);
    params.append("client_secret", VERCEL_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", `${FRONTEND_ORIGIN}/vercel-callback.html`);

    const tokenResp = await axios.post(
      "https://api.vercel.com/v2/oauth/access_token",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const { access_token, team_id } = tokenResp.data;

    res.cookie("vc_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    if (team_id)
      res.cookie("vc_team_id", team_id, { httpOnly: true, sameSite: "lax" });
    else res.clearCookie("vc_team_id");

    const userResp = await axios.get("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.json({
      username:
        userResp.data?.user?.username ||
        userResp.data?.user?.email ||
        "Vercel User",
    });
  } catch (err) {
    console.error("Vercel Exchange Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Vercel authentication failed" });
  }
});

// --- DEPLOYMENT ---

router.post("/deploy/create-repo", async (req, res) => {
  const gh_token = req.cookies.gh_token;
  if (!gh_token) {
    return res.status(401).json({ error: "Connect GitHub first." });
  }

  const { repoName, files, private: isPrivate } = req.body;

  if (!repoName || !Array.isArray(files)) {
    return res.status(400).json({ error: "Invalid repoName or files." });
  }

  const octokit = new Octokit({ auth: gh_token });

  try {
    console.log(`Step 1: Creating repository ${repoName}...`);

    // 1️⃣ Create repository with auto_init
    const createResp = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: !!isPrivate,
      auto_init: true,
    });

    const owner = createResp.data.owner.login;
    const repo = createResp.data.name;
    const branch = createResp.data.default_branch;

    console.log("Waiting for default branch to be ready...");
    await sleep(2000);

    // 2️⃣ Prepare workflow
    const GH_ACTION_WORKFLOW = `name: Deploy to GitHub Pages
on:
  push:
    branches: ["${branch}"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4`;

    const workflowPath = ".github/workflows/deploy.yml";

    // 3️⃣ Deduplicate + sanitize
    const filesMap = new Map();

    files.forEach((f) => {
      if (!f?.path) return;
      const cleanPath = f.path.replace(/^\/+/, "");
      filesMap.set(cleanPath, f.content || "");
    });

    filesMap.set(workflowPath, GH_ACTION_WORKFLOW);

    const allFiles = Array.from(filesMap.entries()).map(([path, content]) => ({
      path,
      content,
    }));

    // 4️⃣ Split normal files & workflow
    const normalFiles = [];
    let workflowFile = null;

    for (const file of allFiles) {
      if (file.path.startsWith(".github/workflows/")) {
        workflowFile = file;
      } else {
        normalFiles.push(file);
      }
    }

    console.log(`Step 2: Uploading ${normalFiles.length} normal files...`);

    // 5️⃣ Upload normal files first
    for (const file of normalFiles) {
      let existingSha;

      try {
        const existing = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: branch,
        });

        if (!Array.isArray(existing.data)) {
          existingSha = existing.data.sha;
        }
      } catch (err) {
        if (err.status !== 404) throw err;
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: `Add ${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
        branch,
        sha: existingSha,
      });
    }

    // 6️⃣ Wait for Actions provisioning
    if (workflowFile) {
      console.log("Waiting for GitHub Actions provisioning...");
      await sleep(4000);

      console.log("Uploading workflow file...");

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: workflowFile.path,
        message: "Add GitHub Pages workflow",
        content: Buffer.from(workflowFile.content).toString("base64"),
        branch,
      });
    }

    console.log("Step 3: Enabling GitHub Pages...");

    const ghPagesUrl = `https://${owner}.github.io/${repo}/`;

    try {
      await octokit.repos.createPagesSite({
        owner,
        repo,
        build_type: "workflow",
      });
    } catch (e) {
      if (e.response?.status !== 409) {
        console.error("Pages enable error:", e.response?.data || e.message);
      }
    }

    return res.json({
      repoUrl: createResp.data.html_url,
      owner,
      repo,
      ghPagesUrl,
    });
  } catch (err) {
    console.error("Final Deploy Error:", err.response?.data || err.message);

    return res.status(500).json({
      error: err.response?.data?.message || "Failed to publish files",
    });
  }
});

router.get("/deploy/build-status", async (req, res) => {
  const gh_token = req.cookies.gh_token;
  const { owner, repo } = req.query;

  if (!gh_token) {
    return res.status(401).json({ error: "GitHub token missing." });
  }

  if (!owner || !repo) {
    return res.status(400).json({ error: "Owner and repo required." });
  }

  const octokit = new Octokit({ auth: gh_token });

  try {
    const runs = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 1,
    });

    if (!runs.data.workflow_runs.length) {
      return res.json({ status: "not_found" });
    }

    const latestRun = runs.data.workflow_runs[0];

    return res.json({
      status: latestRun.status, // queued | in_progress | completed
      conclusion: latestRun.conclusion, // success | failure
      html_url: latestRun.html_url,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch build status." });
  }
});

app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

router.get("/auth/github/url", (req, res) => {
  try {
    console.log("GitHub Auth Request Received");
    console.log("CLIENT_ID Status:", !!CLIENT_ID); // Should be true

    const redirectUri = `${FRONTEND_ORIGIN}/github-callback.html`;
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,workflow&redirect_uri=${encodeURIComponent(redirectUri)}`;

    res.json({ url });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.use("/api", router);
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
