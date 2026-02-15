import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import {
  Download,
  Rocket,
  RefreshCw,
  Edit2,
  Check,
  Palette,
  Sparkles,
  Layout,
  Zap,
  FileText,
  Monitor,
  Terminal,
  Box,
  Type,
  Square,
  Leaf,
  ArrowRight,
  Github,
  Mail,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { THEME_SAMPLES } from "./ThemeSamples";
import { ResumeData, Theme, ThemeColors } from "./types";
import { downloadPortfolio } from "./services/exportService";
import ResumeUploader from "./components/ResumeUploader";
import "./index.css";

// Lazy load heavy components and templates
const DeployDialog = lazy(() => import("./components/DeployDialog"));

const TEMPLATE_COMPONENTS: Record<Theme, React.LazyExoticComponent<any>> = {
  [Theme.Minimalist]: lazy(() => import("./components/templates/Minimalist")),
  [Theme.Developer]: lazy(() => import("./components/templates/Developer")),
  [Theme.Creative]: lazy(() => import("./components/templates/Creative")),
  [Theme.BentoGrid]: lazy(() => import("./components/templates/BentoGrid")),
  [Theme.Glassmorphism]: lazy(
    () => import("./components/templates/Glassmorphism"),
  ),
  [Theme.Cyberpunk]: lazy(() => import("./components/templates/Cyberpunk")),
  [Theme.ClassicSerif]: lazy(
    () => import("./components/templates/ClassicSerif"),
  ),
  [Theme.ResumeFirst]: lazy(() => import("./components/templates/ResumeFirst")),
  [Theme.Brutalist]: lazy(() => import("./components/templates/Brutalist")),
  [Theme.Nature]: lazy(() => import("./components/templates/Nature")),
};

const THEME_DEFAULTS: Partial<Record<Theme, ThemeColors>> = {
  [Theme.Cyberpunk]: { primary: "#00ff41", secondary: "#ff00ff" },
  [Theme.Brutalist]: { primary: "#ff4800", secondary: "#fde047" },
  [Theme.Glassmorphism]: { primary: "#6366f1", secondary: "#ec4899" },
  [Theme.Creative]: { primary: "#a855f7", secondary: "#3b82f6" },
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.Minimalist);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: "#6366f1",
    secondary: "#a855f7",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update theme colors when theme changes
  useEffect(() => {
    const defaults = THEME_DEFAULTS[theme];
    if (defaults) setThemeColors(defaults);
  }, [theme]);

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to reset? You will lose your current progress.",
      )
    ) {
      setResumeData(null);
      setTheme(Theme.Minimalist);
      setIsEditing(false);
    }
  }, []);

  const handleExport = useCallback(async () => {
    if (!resumeData) return;
    setIsExporting(true);
    try {
      await downloadPortfolio(resumeData, theme, themeColors);
    } catch (e) {
      alert("Export failed");
    } finally {
      setIsExporting(false);
    }
  }, [resumeData, theme, themeColors]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        {/* Logo Section - Scaled for mobile */}
        <span className="font-bold text-base md:text-2xl tracking-tighter whitespace-nowrap">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-600 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            Deploy
            <span className="xs:inline">MyProfile</span>
          </span>{" "}
          <span className="text-cyan-400 font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            AI
          </span>
        </span>

        {resumeData && (
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* 1. Edit Button - Primary Action on Mobile */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center justify-center gap-2 p-2 md:px-4 md:py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
                isEditing
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              title={isEditing ? "Live Preview" : "Edit Content"}
            >
              {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
              <span className="hidden lg:inline">
                {isEditing ? "Live Preview" : "Edit Content"}
              </span>
            </button>

            {/* 2. Publish Button - High Priority */}
            <button
              onClick={() => setShowDeployModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-2 md:px-5 md:py-2 rounded-full text-sm font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Rocket size={18} />
              <span className="hidden sm:inline">Publish</span>
            </button>

            {/* 3. Mobile Actions Dropdown / Reset & Export */}
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden"
              >
                <MoreVertical size={20} />
              </button>

              {/* Desktop View: Show these buttons normally */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 md:hidden animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => {
                      handleExport();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Download size={18} /> Export Code
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleReset();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} /> Reset Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {resumeData && (
        <div className="sticky top-16 z-40 w-full bg-white border-b border-slate-100 py-3 px-4 md:px-8 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mr-4 shrink-0">
              <Palette size={14} /> Style Engine
            </div>
            {Object.values(Theme).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-300 border hover:scale-105 active:scale-95 ${
                  theme === t
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-4 ring-indigo-50"
                    : "bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 border-slate-200 shadow-sm"
                }`}
              >
                {t.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">
        {!resumeData ? (
          <LandingPage onUpload={setResumeData} />
        ) : (
          <div className="p-4 md:p-8 lg:p-12 bg-slate-100/50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all animate-in fade-in zoom-in duration-700">
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center font-bold text-slate-400">
                    Loading Template...
                  </div>
                }
              >
                <TemplateRenderer
                  theme={theme}
                  data={resumeData}
                  isEditing={isEditing}
                  onUpdate={setResumeData}
                  colors={themeColors}
                />
              </Suspense>
            </div>
          </div>
        )}
      </main>

      {!resumeData && <Footer />}

      <Suspense fallback={null}>
        <DeployDialog
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          data={resumeData}
          theme={theme}
          colors={themeColors}
        />
      </Suspense>
    </div>
  );
}

/**
 * Landing Page Components
 */
const LandingPage = React.memo(
  ({ onUpload }: { onUpload: (data: ResumeData) => void }) => {
    return (
      <div className="flex flex-col items-center w-full">
        <section className="pt-20 pb-16 px-6 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-indigo-50 to-blue-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-100 animate-bounce-slow">
            <Sparkles size={14} /> Powered by Gemini 3 Flash
          </div>
          <h1 className="font-black text-slate-900 mb-6 tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl">
            <span className="block">
              Build your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
                Portfolio
              </span>
            </span>
            <span className="block text-slate-700 mt-2 sm:mt-3">
              in seconds.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto font-medium leading-relaxed italic">
            Turn a static PDF into a high-performance, responsive React
            portfolio. Choose your aesthetic and ship it.
          </p>

          <div className="w-full max-w-2xl mx-auto mb-28">
            <div className="relative p-2 bg-linear-to-tr from-slate-200 via-white to-slate-200 rounded-[2.5rem] shadow-2xl border border-white">
              <div className="bg-white rounded-4xl p-4 shadow-inner">
                <ResumeUploader onUploadComplete={onUpload} />
              </div>
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </section>

        <section className="w-full bg-slate-950 py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-white text-3xl md:text-5xl font-black mb-4 tracking-tight">
                The Ship Cycle
              </h2>
              <div className="h-1.5 w-20 bg-indigo-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <FunStep
                title="Upload"
                desc="Drop your PDF resume."
                icon={FileText}
                color="bg-blue-500"
              />
              <FunStep
                title="Analyze"
                desc="AI extracts your soul."
                icon={Zap}
                color="bg-yellow-400"
              />
              <FunStep
                title="Style"
                desc="Pick from 10+ themes."
                icon={Monitor}
                color="bg-purple-500"
              />
              <FunStep
                title="Tweak"
                desc="Edit content live."
                icon={Palette}
                color="bg-pink-500"
              />
              <FunStep
                title="Deploy"
                icon={Rocket}
                desc="Go live on GitHub."
                color="bg-emerald-500"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              Your Aesthetic, Your Choice.
            </h2>
            <p className="text-slate-500 mb-20 text-lg font-medium">
              Explore all 10 premium templates designed for impact.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {THEME_SAMPLES.map((sample) => (
                <ThemeCard key={sample.label} sample={sample} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  },
);

const FunStep = React.memo(({ num, title, desc, icon: Icon, color }: any) => (
  <div className="flex flex-col items-center group">
    <div
      className={`w-20 h-20 rounded-4xl ${color} flex items-center justify-center text-white mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}
    >
      <Icon size={32} />
    </div>
    <div className="relative">
      <div className="text-4xl font-black text-white/10 absolute -top-4 -left-6">
        {num}
      </div>
      <h3 className="text-white text-xl font-bold mb-2 relative z-10">
        {title}
      </h3>
    </div>
    <p className="text-slate-500 text-sm font-medium">{desc}</p>
  </div>
));

function ThemeCard({ sample }: any) {
  const [style, setStyle] = useState({});
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 12;
    const rotateY = (x / rect.width - 0.5) * -12;

    setMagnifierPos({ x, y });
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
    });
  };

  const reset = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
  };

  return (
    <div
      className="group cursor-pointer relative"
      onMouseMove={handleMove}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => {
        setShowMagnifier(false);
        reset();
      }}
    >
      <div
        style={style}
        className="relative w-full aspect-3/4 rounded-3xl bg-white border border-slate-200/70 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out overflow-hidden mb-5"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 origin-center">
            {sample.preview}
          </div>
        </div>

        {/* {showMagnifier && (
          <div className="absolute bottom-4 right-4 w-32 h-40 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden pointer-events-none z-10">
            <div
              className="absolute w-full h-full"
              style={{
                transform: `scale(2) translate(-${magnifierPos.x / 2}px, -${magnifierPos.y / 2}px)`,
                transformOrigin: "top left",
              }}
            >
              {sample.preview}
            </div>
          </div>
        )} */}

        <div
          className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
            sample.label === "Cyberpunk"
              ? "group-hover:bg-green-400/10"
              : sample.label === "Brutalist"
                ? "group-hover:shadow-[inset_0_0_0_4px_black]"
                : "group-hover:bg-indigo-600/5"
          }`}
        />
      </div>

      <div className="flex items-center justify-center gap-2 font-black text-slate-800 uppercase text-xs tracking-widest group-hover:text-indigo-600 transition-colors">
        <sample.icon size={16} />
        {sample.label}
      </div>
    </div>
  );
}

const Footer = React.memo(() => (
  <footer className="w-full py-20 px-6 bg-slate-950 border-t border-white/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="text-center md:text-left">
        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em] mb-4">
          Architected By
        </p>
        <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Yash Batham
        </h4>
        <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
          <a
            href="mailto:yashombatham@gmail.com"
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              <Mail size={18} />
            </div>
            <span className="text-sm font-bold">yashombatham@gmail.com</span>
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end text-slate-500 text-sm font-bold uppercase tracking-widest">
        <p className="text-white mb-2 tracking-normal capitalize font-black text-lg">
          DeployMyProfile AI &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
));

function TemplateRenderer({ theme, data, isEditing, onUpdate, colors }: any) {
  const Component = TEMPLATE_COMPONENTS[theme as Theme];

  return (
    <div className="transition-all duration-500 ease-in-out">
      <Component
        data={data}
        isEditing={isEditing}
        onUpdate={onUpdate}
        customColors={colors}
      />
    </div>
  );
}

export default App;
