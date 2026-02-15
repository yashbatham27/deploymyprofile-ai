import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Rocket,
  X,
  Lock,
  Globe,
  RefreshCcw,
  Settings2,
} from "lucide-react";
import {
  DeployState,
  DeployStep,
  ResumeData,
  Theme,
  ThemeColors,
} from "../types";
import {
  connectGitHub,
  createAndDeployToGitHub,
} from "../services/deployService";

const apiRequest = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok)
    throw new Error(`API request failed: ${response.statusText}`);
  return response.json();
};

const formatRepoName = (name: string, theme: string) => {
  const sanitizedName = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const sanitizedTheme = theme.toLowerCase();
  return `${sanitizedName}-${sanitizedTheme}-portfolio`;
};

interface DeployDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  theme: Theme;
  colors: ThemeColors;
}

const DeployDialog: React.FC<DeployDialogProps> = ({
  isOpen,
  onClose,
  data,
  theme,
  colors,
}) => {
  const [state, setState] = useState<DeployState>({
    step: DeployStep.IDLE,
    githubUsername: null,
    repoName: "",
    deploymentUrl: null,
    error: null,
  });

  const [buildStatus, setBuildStatus] = useState<{
    status: string;
    conclusion: string | null;
  }>({ status: "idle", conclusion: null });
  const [resultUrls, setResultUrls] = useState<{
    repo?: string;
    pages?: string;
    owner?: string;
    repoName?: string;
  }>({});
  const [isPrivate, setIsPrivate] = useState(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const defaultRepoName = useMemo(() => {
    if (!data?.personalInfo?.name) return "";
    return formatRepoName(data.personalInfo.name, theme);
  }, [data, theme]);

  // Logic: Reset UI when Theme changes so user can publish the new selection
  useEffect(() => {
    if (isOpen) {
      setState((prev) => ({
        ...prev,
        step: prev.githubUsername ? DeployStep.CONFIG_REPO : DeployStep.IDLE,
        repoName: defaultRepoName,
        error: null,
        deploymentUrl: null,
      }));
      setBuildStatus({ status: "idle", conclusion: null });
      setResultUrls({});
    }
  }, [theme, isOpen, defaultRepoName]);

  useEffect(() => {
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const startPollingBuild = (owner: string, repo: string) => {
    setBuildStatus({ status: "queued", conclusion: null });
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    pollingInterval.current = setInterval(async () => {
      try {
        const data = await apiRequest(
          `/api/deploy/build-status?owner=${owner}&repo=${repo}`,
          { credentials: "include" },
        );
        setBuildStatus({ status: data.status, conclusion: data.conclusion });
        if (data.status === "completed" && pollingInterval.current)
          clearInterval(pollingInterval.current);
      } catch (err) {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    }, 4000);
  };

  const handleGitHubConnect = async () => {
    setState((prev) => ({
      ...prev,
      step: DeployStep.CONNECT_GITHUB,
      error: null,
    }));
    try {
      const username = await connectGitHub();
      setState((prev) => ({
        ...prev,
        step: DeployStep.CONFIG_REPO,
        githubUsername: username,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        step: DeployStep.ERROR,
        error: "GitHub connection failed.",
      }));
    }
  };

  const handleDeploy = async () => {
    setState((prev) => ({ ...prev, step: DeployStep.DEPLOYING, error: null }));
    try {
      const result = await createAndDeployToGitHub(
        state.repoName,
        data,
        theme,
        colors,
        isPrivate,
        false,
        true,
      );
      setResultUrls({
        repo: result.repoUrl,
        pages: result.ghPagesUrl,
        owner: result.owner,
        repoName: result.repo,
      });
      setState((prev) => ({
        ...prev,
        step: DeployStep.SUCCESS,
        deploymentUrl: result.repoUrl,
      }));
      startPollingBuild(result.owner, result.repo);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        step: DeployStep.ERROR,
        error: err?.message || "Failed to publish.",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <Rocket size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">
                Deploy Portfolio
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">
                {theme} Theme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!state.githubUsername ? (
              <motion.div
                key="connect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Github size={32} className="text-slate-700" />
                </div>
                <h3 className="text-slate-800 font-bold mb-2">
                  Connect GitHub
                </h3>
                <p className="text-sm text-slate-500 mb-6 px-4">
                  We'll create a new repository in your account to host your
                  portfolio.
                </p>
                <button
                  onClick={handleGitHubConnect}
                  disabled={state.step === DeployStep.CONNECT_GITHUB}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98]"
                >
                  {state.step === DeployStep.CONNECT_GITHUB ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Github size={20} />
                  )}
                  Connect Account
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="config"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Connected Badge */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://github.com/${state.githubUsername}.png`}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      alt="avatar"
                    />
                    <div className="text-sm">
                      <p className="text-emerald-800 font-bold leading-none">
                        {state.githubUsername}
                      </p>
                      <p className="text-emerald-600 text-[10px] uppercase font-bold tracking-tighter mt-1">
                        GitHub Connected
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>

                {/* Show Config Form ONLY if not successful */}
                {state.step !== DeployStep.SUCCESS && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-700 mb-1">
                        <Settings2 size={14} className="text-blue-600" />
                        <label className="text-xs font-bold uppercase tracking-wider">
                          Project Settings
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={state.repoName}
                          onChange={(e) =>
                            setState((p) => ({
                              ...p,
                              repoName: e.target.value,
                            }))
                          }
                          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-mono text-sm transition-all"
                          placeholder="repository-name"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        {[
                          {
                            id: false,
                            label: "Public",
                            icon: Globe,
                            desc: "Visible to everyone",
                          },
                          {
                            id: true,
                            label: "Private",
                            icon: Lock,
                            desc: "Only you can see code",
                          },
                        ].map((option) => (
                          <button
                            key={option.label}
                            onClick={() => setIsPrivate(option.id)}
                            className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                              isPrivate === option.id
                                ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/5"
                                : "bg-white border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <option.icon
                                size={14}
                                className={
                                  isPrivate === option.id
                                    ? "text-blue-600"
                                    : "text-slate-400"
                                }
                              />
                              <span
                                className={`text-xs font-bold ${isPrivate === option.id ? "text-blue-700" : "text-slate-600"}`}
                              >
                                {option.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              {option.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDeploy}
                      disabled={state.step === DeployStep.DEPLOYING}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-3 group"
                    >
                      {state.step === DeployStep.DEPLOYING ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Rocket
                          size={20}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      )}
                      Deploy {theme} Theme
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success & Tracking State */}
        <AnimatePresence>
          {state.step === DeployStep.SUCCESS && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-slate-50 border-t border-slate-100 space-y-5"
            >
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Deployment Started!
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Your repository is ready on GitHub.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={resultUrls.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all group"
                  >
                    <Github
                      size={18}
                      className="text-slate-600 group-hover:text-blue-600 mb-1"
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Code
                    </span>
                  </a>
                  <button
                    onClick={() =>
                      setState((p) => ({ ...p, step: DeployStep.CONFIG_REPO }))
                    }
                    className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all group"
                  >
                    <RefreshCcw
                      size={18}
                      className="text-slate-600 group-hover:text-blue-600 mb-1"
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Redeploy
                    </span>
                  </button>
                </div>
              </div>

              {/* Build Tracking UI */}
              <div className="px-1">
                {buildStatus.status !== "completed" ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          GitHub Actions Building...
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        ETA: ~1 min
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                ) : buildStatus.conclusion === "success" ? (
                  <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
                    <a
                      href={resultUrls.pages}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                    >
                      <Globe size={20} />
                      Visit Your Live Portfolio
                      <ExternalLink size={16} className="opacity-70" />
                    </a>
                  </motion.div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600">
                    <AlertCircle size={18} />
                    <span className="text-xs font-bold">
                      Build Failed. Check GitHub Actions for logs.
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Overlay */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-6"
          >
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 shadow-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold mb-1">Deployment Error</p>
                <p className="opacity-80">{state.error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DeployDialog;
