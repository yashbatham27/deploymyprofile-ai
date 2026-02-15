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
} from "lucide-react";

export const THEME_SAMPLES = [
  {
    label: "Cyberpunk",
    icon: Zap,
   preview: (
  <div className="w-full h-full bg-black rounded-3xl overflow-hidden font-mono text-[5px] text-[#00ff41] relative">

    {/* Outer Glow */}
    <div className="absolute inset-0 border-2 border-[#00ff41] rounded-3xl shadow-[0_0_10px_#00ff41] pointer-events-none"></div>

    <div className="relative h-full flex flex-col p-2">

      {/* Header */}
      <div className="border-b border-[#00ff41] pb-1 mb-2">
        <div className="text-[#ff00ff] uppercase text-center">
          NETRUNNER_ID
        </div>
        <div className="text-[6px] font-bold text-center tracking-tight">
          YASH_BATHAM
        </div>
      </div>

      {/* Main Layout (Now fills space) */}
      <div className="flex-1 grid grid-cols-[2fr_1fr] gap-2">

        {/* Left Column */}
        <div className="flex flex-col gap-2">

          <div className="flex-1 border border-[#00ff41]/60 bg-[#001a05] p-1">
            <div className="text-[#ff00ff]">MISSION_LOG</div>
            <div className="h-1 w-3/4 bg-[#00ff41]/60 mt-1"></div>
            <div className="h-1 w-1/2 bg-[#00ff41]/40 mt-1"></div>
          </div>

          <div className="border border-[#ff00ff]/60 bg-[#050505] p-1 shadow-[2px_2px_0px_#ff00ff]">
            <div className="text-[#ff00ff]">DEPLOYMENT</div>
            <div className="h-1 w-full bg-[#00ff41]/50 mt-1"></div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-2">

          <div className="border border-[#00ff41] bg-[#001a05] p-1">
            <div className="text-[#ff00ff]">SYSTEM</div>
            <div className="h-1 w-full bg-[#00ff41]/40 mt-1"></div>
          </div>

          <div className="flex-1 border border-[#ff00ff] p-1">
            <div className="text-[#ff00ff]">MODULES</div>
            <div className="flex gap-1 mt-1 flex-wrap">
              <div className="px-1 border border-[#ff00ff] text-[#ff00ff]">
                REACT
              </div>
              <div className="px-1 border border-[#ff00ff] text-[#ff00ff]">
                TS
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar (Always sticks to bottom) */}
      <div className="mt-2 border border-[#00ff41] bg-[#001a05] p-1">
        <div className="h-1 w-1/2 bg-[#00ff41]/60"></div>
      </div>

    </div>
  </div>
),
  },
  {
  label: "Bento Grid",
  icon: Layout,
  preview: (
    <div className="w-full h-full bg-neutral-100 rounded-3xl overflow-hidden p-2">

      <div className="grid grid-cols-4 gap-1 h-full auto-rows-fr text-[5px] font-sans">

        {/* Header Block (span 2) */}
        <div className="col-span-2 bg-white rounded-xl p-1 border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="w-1/3 h-1 bg-blue-200 rounded-full mb-1"></div>
            <div className="h-2 w-3/4 bg-neutral-900 mb-1"></div>
            <div className="h-1 w-1/2 bg-neutral-400"></div>
          </div>
          <div className="h-2 w-full bg-neutral-200 mt-1"></div>
        </div>

        {/* Social Card */}
        <div className="bg-neutral-900 rounded-xl p-1 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-blue-600 rounded-xl p-1 flex flex-wrap gap-1 content-start">
          <div className="px-1 h-1 bg-white/60 rounded"></div>
          <div className="px-1 h-1 bg-white/60 rounded"></div>
          <div className="px-1 h-1 bg-white/60 rounded"></div>
        </div>

        {/* Experience Block (span 2 rows, span 2 cols) */}
        <div className="col-span-2 row-span-2 bg-white rounded-xl p-1 border border-neutral-200 flex flex-col gap-1">
          <div className="h-1 w-1/3 bg-neutral-900"></div>
          <div className="flex-1 space-y-1">
            <div className="h-1 w-3/4 bg-neutral-300"></div>
            <div className="h-1 w-1/2 bg-neutral-300"></div>
            <div className="h-1 w-2/3 bg-neutral-300"></div>
          </div>
        </div>

        {/* Projects Block (span 2) */}
        <div className="col-span-2 bg-neutral-50 rounded-xl p-1 border border-neutral-200 flex flex-col gap-1">
          <div className="h-1 w-1/3 bg-neutral-900"></div>
          <div className="h-2 w-full bg-white border border-neutral-200 rounded"></div>
        </div>

        {/* Contact Block (span 2) */}
        <div className="col-span-2 bg-white rounded-xl p-1 border border-neutral-200 flex flex-col gap-1">
          <div className="h-1 w-1/3 bg-neutral-900"></div>
          <div className="h-1 w-full bg-neutral-200"></div>
          <div className="h-1 w-full bg-neutral-200"></div>
          <div className="h-2 w-1/2 bg-neutral-900 mt-auto"></div>
        </div>

      </div>
    </div>
  )
},
  {
  label: "Developer",
  icon: Terminal,
  preview: (
    <div className="w-full h-full bg-[#0d1117] rounded-3xl overflow-hidden font-mono text-[5px] text-[#c9d1d9] p-2">

      <div className="flex flex-col h-full gap-2">

        {/* Header */}
        <div>
          <div className="text-[#238636]">
            User: ~/portfolio/yash-batham
          </div>

          <div className="flex items-center mt-1">
            <span className="text-[#238636] mr-1">&gt;</span>
            <div className="h-2 w-1/2 bg-white"></div>
          </div>

          <div className="mt-1 border-l border-[#30363d] pl-1">
            <div className="h-1 w-3/4 bg-[#8b949e]"></div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="flex-1 space-y-1">

          <div className="text-white flex items-center">
            <div className="w-2 h-2 bg-[#238636] mr-1"></div>
            ./experience
          </div>

          <div className="border-l border-[#30363d] pl-2 space-y-1">
            <div className="h-1 w-2/3 bg-[#58a6ff]"></div>
            <div className="h-1 w-1/2 bg-[#79c0ff]"></div>
            <div className="h-1 w-3/4 bg-[#c9d1d9]/50"></div>
          </div>

          {/* Projects Block */}
          <div className="text-white mt-2">./projects</div>

          <div className="bg-[#161b22] border border-[#30363d] rounded p-1">
            <div className="h-1 w-2/3 bg-[#c9d1d9] mb-1"></div>
            <div className="h-1 w-full bg-[#8b949e] mb-1"></div>
            <div className="flex gap-1">
              <div className="px-1 border border-[#238636] text-[#238636]">
                REACT
              </div>
              <div className="px-1 border border-[#238636] text-[#238636]">
                TS
              </div>
            </div>
          </div>

        </div>

        {/* Skills Footer */}
        <div className="bg-[#161b22] border border-[#30363d] rounded p-1">
          <div className="text-[#8b949e]">
            const <span className="text-[#c9d1d9]">react</span> =
            <span className="text-[#238636]"> true</span>;
          </div>
        </div>

      </div>
    </div>
  )
},
  {
  label: "Brutalist",
  icon: Square,
  preview: (
    <div className="w-full h-full bg-[#f0f0f0] rounded-3xl overflow-hidden p-2 font-mono text-[5px]">

      {/* Main Container */}
      <div className="h-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_black] flex flex-col">

        {/* Header */}
        <div className="bg-[#ff4800] border-b-4 border-black p-1">
          <div className="h-3 w-3/4 bg-black mb-1"></div>
          <div className="inline-block bg-black text-white px-1 py-0.5 -rotate-2">
            TITLE
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-1 divide-x-4 divide-black">

          {/* Sidebar */}
          <div className="w-1/3 bg-[#fde047] p-1 space-y-2">

            <div>
              <div className="h-1 w-1/2 bg-black mb-1"></div>
              <div className="h-1 w-3/4 bg-black"></div>
            </div>

            <div className="flex flex-wrap gap-1">
              <div className="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_black]">
                JS
              </div>
              <div className="bg-white border-2 border-black px-1 shadow-[2px_2px_0px_0px_black]">
                REACT
              </div>
            </div>

          </div>

          {/* Main */}
          <div className="flex-1 p-1 space-y-2">

            {/* Experience Card */}
            <div className="border-4 border-black p-1 shadow-[4px_4px_0px_0px_black]">
              <div className="h-1 w-1/2 bg-black mb-1"></div>
              <div className="h-1 w-3/4 bg-black"></div>
            </div>

            {/* Project Card */}
            <div className="border-4 border-black p-1 shadow-[4px_4px_0px_0px_black] bg-[#ff4800]/40">
              <div className="h-1 w-2/3 bg-black mb-1"></div>
              <div className="h-1 w-full bg-black"></div>
            </div>

          </div>

        </div>

        {/* Contact Block */}
        <div className="border-t-4 border-black p-1 shadow-[4px_4px_0px_0px_black]">
          <div className="h-1 w-1/2 bg-black mb-1"></div>
          <div className="h-2 w-full bg-black"></div>
        </div>

      </div>
    </div>
  )
},
 {
  label: "Glassmorphism",
  icon: Box,
  preview: (
    <div className="w-full h-full relative overflow-hidden rounded-3xl font-sans text-[5px]">

      {/* Smooth Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500" />

      {/* Subtle Light Glow */}
      <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/30 rounded-full blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-3xl opacity-50" />

      {/* Content Wrapper */}
      <div className="relative h-full flex flex-col p-2 gap-2">

        {/* Header */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-lg">
          <div className="h-2 w-1/2 bg-white/80 rounded mb-1 mx-auto" />
          <div className="h-1 w-1/3 bg-white/60 rounded mx-auto mb-1" />

          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-white/70 rounded-full" />
            <div className="w-2 h-2 bg-white/70 rounded-full" />
            <div className="w-2 h-2 bg-white/70 rounded-full" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-3 gap-2">

          {/* Sidebar */}
          <div className="flex flex-col gap-2">

            <div className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-md">
              <div className="h-1 w-1/2 bg-white/70 rounded mb-1" />
              <div className="h-1 w-full bg-white/40 rounded" />
            </div>

            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-md">
              <div className="h-1 w-1/3 bg-white/70 rounded mb-1" />
              <div className="flex gap-1 flex-wrap">
                <div className="h-1 w-6 bg-white/50 rounded-full" />
                <div className="h-1 w-5 bg-white/50 rounded-full" />
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="col-span-2 flex flex-col gap-2">

            <div className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-md">
              <div className="h-1 w-1/4 bg-white/70 rounded mb-1" />
              <div className="space-y-1">
                <div className="h-1 w-3/4 bg-white/40 rounded" />
                <div className="h-1 w-2/3 bg-white/40 rounded" />
                <div className="h-1 w-1/2 bg-white/40 rounded" />
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-md">
              <div className="h-1 w-1/4 bg-white/70 rounded mb-1" />
              <div className="h-2 w-full bg-black/20 rounded" />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-1.5 shadow-md">
          <div className="h-1 w-1/3 bg-white/70 rounded mb-1" />
          <div className="h-1 w-full bg-white/40 rounded" />
        </div>

      </div>
    </div>
  )
},
  {
  label: "Minimalist",
  icon: Monitor,
  preview: (
    <div className="w-full h-full bg-white rounded-3xl overflow-hidden font-sans text-[5px] text-gray-800">

      <div className="flex flex-col h-full p-2">

        {/* Header */}
        <div className="mb-2">
          <div className="h-2 w-1/2 bg-gray-900 mb-1"></div>
          <div className="h-1 w-1/3 bg-gray-500 mb-1"></div>
          <div className="h-1 w-3/4 bg-gray-300"></div>

          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
            <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
            <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-2"></div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-2">

          {/* Experience */}
          <div>
            <div className="h-1 w-1/4 bg-gray-900 mb-1"></div>
            <div className="h-px bg-gray-100 mb-1"></div>

            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="h-1 w-full bg-gray-400"></div>
                <div className="col-span-2 h-1 w-full bg-gray-600"></div>
              </div>
              <div className="h-1 w-3/4 bg-gray-300"></div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="h-1 w-1/4 bg-gray-900 mb-1"></div>
            <div className="h-px bg-gray-100 mb-1"></div>

            <div className="grid grid-cols-2 gap-1">
              <div className="border border-gray-100 rounded p-1">
                <div className="h-1 w-2/3 bg-gray-700 mb-1"></div>
                <div className="h-1 w-full bg-gray-300"></div>
              </div>
              <div className="border border-gray-100 rounded p-1">
                <div className="h-1 w-2/3 bg-gray-700 mb-1"></div>
                <div className="h-1 w-full bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-auto">
            <div className="h-1 w-1/4 bg-gray-900 mb-1"></div>
            <div className="h-px bg-gray-100 mb-1"></div>

            <div className="flex flex-wrap gap-1">
              <div className="h-1 w-8 bg-gray-400"></div>
              <div className="h-1 w-6 bg-gray-400"></div>
              <div className="h-1 w-10 bg-gray-400"></div>
            </div>
          </div>

        </div>

        {/* Footer Line */}
        <div className="mt-2 h-px bg-gray-100"></div>
        <div className="h-1 w-1/3 bg-gray-300 mt-1 mx-auto"></div>

      </div>
    </div>
  )
},
  {
  label: "Creative",
  icon: Palette,
  preview: (
    <div className="w-full h-full bg-slate-900 rounded-3xl overflow-hidden relative font-sans text-[5px] text-white">

      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-xl"></div>
      </div>

      <div className="relative h-full flex flex-col p-2">

        {/* Hero */}
        <div className="text-center mb-2">
          <div className="h-1 w-1/4 bg-blue-400 mx-auto mb-1 rounded"></div>

          <div className="h-3 w-2/3 mx-auto mb-1 rounded bg-linear-to-r from-purple-400 to-blue-400"></div>

          <div className="h-1 w-1/2 bg-slate-400 mx-auto mb-1 rounded"></div>
          <div className="h-1 w-3/4 bg-slate-600 mx-auto rounded"></div>

          <div className="flex justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-2">

          {/* Journey Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
            <div className="h-1 w-1/3 bg-white mb-1 rounded"></div>
            <div className="space-y-1">
              <div className="h-1 w-3/4 bg-slate-400 rounded"></div>
              <div className="h-1 w-2/3 bg-slate-500 rounded"></div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-1">
              <div className="h-1 w-2/3 bg-white mb-1 rounded"></div>
              <div className="h-1 w-full bg-slate-500 rounded"></div>
            </div>
            <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-1">
              <div className="h-1 w-2/3 bg-white mb-1 rounded"></div>
              <div className="h-1 w-full bg-slate-500 rounded"></div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-auto flex flex-wrap gap-1">
            <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700"></div>
            <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700"></div>
            <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700"></div>
          </div>

        </div>

        {/* Contact Button */}
        <div className="mt-2 h-2 w-full rounded bg-linear-to-r from-purple-500 to-blue-500"></div>

      </div>
    </div>
  )
},
  {
  label: "Classic Serif",
  icon: Type,
  preview: (
    <div className="w-full h-full bg-[#fdfbf7] rounded-3xl overflow-hidden font-serif text-[5px] text-neutral-800">

      <div className="flex flex-col h-full p-2 border-t-2 border-black">

        {/* Header */}
        <div className="grid grid-cols-3 gap-2 mb-2 items-end">
          <div className="col-span-2">
            <div className="h-3 w-3/4 bg-neutral-900 mb-1"></div>
            <div className="h-1 w-1/2 bg-neutral-500 italic"></div>
          </div>

          <div className="text-right space-y-1">
            <div className="h-1 w-full bg-neutral-400 ml-auto"></div>
            <div className="h-1 w-3/4 bg-neutral-400 ml-auto"></div>
            <div className="h-1 w-1/2 bg-neutral-300 ml-auto"></div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 grid grid-cols-3 gap-2">

          {/* Sidebar */}
          <div className="space-y-2 font-sans">

            <div>
              <div className="h-1 w-1/2 bg-black mb-1"></div>
              <div className="h-px bg-black mb-1"></div>
              <div className="h-1 w-full bg-neutral-300"></div>
              <div className="h-1 w-3/4 bg-neutral-300 mt-1"></div>
            </div>

            <div>
              <div className="h-1 w-1/2 bg-black mb-1"></div>
              <div className="h-px bg-black mb-1"></div>
              <div className="space-y-1">
                <div className="h-1 w-2/3 bg-neutral-400"></div>
                <div className="h-1 w-1/2 bg-neutral-400"></div>
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="col-span-2 flex flex-col gap-2">

            {/* Experience */}
            <div>
              <div className="h-2 w-1/3 bg-neutral-900 mb-1"></div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-1 w-1/3 bg-neutral-800"></div>
                  <div className="h-1 w-1/4 bg-neutral-400"></div>
                </div>
                <div className="h-1 w-1/2 bg-neutral-500 italic"></div>
                <div className="h-1 w-3/4 bg-neutral-300"></div>
              </div>
            </div>

            {/* Projects */}
            <div className="mt-auto">
              <div className="h-2 w-1/3 bg-neutral-900 mb-1"></div>

              <div className="border-b border-neutral-200 pb-1">
                <div className="flex justify-between mb-1">
                  <div className="h-1 w-1/3 bg-neutral-800"></div>
                  <div className="h-1 w-1/4 bg-neutral-600"></div>
                </div>
                <div className="h-1 w-3/4 bg-neutral-300"></div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-2">
          <div className="h-2 w-1/3 bg-neutral-900 mb-1"></div>
          <div className="h-1 w-full bg-neutral-300"></div>
        </div>

      </div>
    </div>
  )
},
  {
  label: "Nature",
  icon: Leaf,
  preview: (
    <div className="w-full h-full bg-[#f4f1ea] rounded-3xl overflow-hidden font-sans text-[5px] text-[#3a4a3b] relative">

      {/* Soft Blobs */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#daddd8] rounded-full blur-xl"></div>
        <div className="absolute bottom-0 -left-4 w-24 h-24 bg-[#e9edc9] rounded-full blur-xl"></div>
      </div>

      <div className="relative h-full flex flex-col p-2">

        {/* Header */}
        <div className="text-center mb-2">
          <div className="w-4 h-4 mx-auto mb-1 bg-[#588157] rounded-full"></div>

          <div className="h-2 w-2/3 bg-[#344e41] mx-auto mb-1 rounded"></div>
          <div className="h-1 w-1/2 bg-[#588157] mx-auto mb-1 rounded"></div>

          <div className="flex justify-center gap-1 mt-1">
            <div className="w-2 h-2 bg-[#a3b18a]/50 rounded-full"></div>
            <div className="w-2 h-2 bg-[#a3b18a]/50 rounded-full"></div>
            <div className="w-2 h-2 bg-[#a3b18a]/50 rounded-full"></div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 grid grid-cols-3 gap-2">

          {/* Left Cards */}
          <div className="flex flex-col gap-2">

            <div className="flex-1 bg-white/60 border border-[#dad7cd] rounded-xl p-1">
              <div className="h-1 w-1/3 bg-[#344e41] mb-1 rounded"></div>
              <div className="h-1 w-full bg-[#a3b18a]/60 rounded"></div>
              <div className="h-1 w-3/4 bg-[#a3b18a]/60 mt-1 rounded"></div>
            </div>

            <div className="bg-white/60 border border-[#dad7cd] rounded-xl p-1">
              <div className="h-1 w-1/3 bg-[#344e41] mb-1 rounded"></div>
              <div className="flex gap-1 flex-wrap">
                <div className="h-1 w-6 bg-[#e9edc9] rounded-full"></div>
                <div className="h-1 w-8 bg-[#e9edc9] rounded-full"></div>
              </div>
            </div>

          </div>

          {/* Timeline + Projects */}
          <div className="col-span-2 flex flex-col gap-2">

            {/* Timeline */}
            <div className="flex-1 relative pl-2 border-l-2 border-[#a3b18a]">
              <div className="absolute -left-0.75 top-1 w-2 h-2 bg-[#a3b18a] rounded-full"></div>

              <div className="h-1 w-1/3 bg-[#344e41] mb-1 rounded"></div>
              <div className="h-1 w-3/4 bg-[#a3b18a]/70 rounded"></div>
              <div className="h-1 w-2/3 bg-[#a3b18a]/60 mt-1 rounded"></div>
            </div>

            {/* Project Card */}
            <div className="bg-white border border-[#dad7cd] rounded-xl p-1">
              <div className="h-1 w-1/2 bg-[#344e41] mb-1 rounded"></div>
              <div className="h-1 w-full bg-[#a3b18a]/60 rounded"></div>

              <div className="flex gap-1 mt-1">
                <div className="h-1 w-5 border border-[#a3b18a] rounded-full"></div>
                <div className="h-1 w-6 border border-[#a3b18a] rounded-full"></div>
              </div>
            </div>

          </div>

        </div>

        {/* Contact Bar */}
        <div className="mt-2 h-2 w-full bg-[#588157] rounded"></div>

      </div>
    </div>
  )
},
  {
  label: "Resume First",
  icon: FileText,
  preview: (
    <div className="w-full h-full bg-slate-100 rounded-3xl overflow-hidden font-sans text-[5px] text-slate-800 flex items-center justify-center p-2">

      {/* A4 Sheet */}
      <div className="w-full h-full bg-white shadow-md border border-slate-200 p-2 flex flex-col">

        {/* Header */}
        <div className="text-center border-b border-slate-800 pb-1 mb-1">
          <div className="h-2 w-1/2 bg-slate-900 mx-auto mb-1"></div>
          <div className="h-1 w-1/3 bg-slate-600 mx-auto mb-1"></div>

          <div className="flex justify-center gap-1">
            <div className="h-1 w-10 bg-slate-400"></div>
            <div className="h-1 w-6 bg-slate-400"></div>
            <div className="h-1 w-8 bg-slate-400"></div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-1">
          <div className="h-1 w-1/4 bg-slate-900 mb-1"></div>
          <div className="h-px bg-slate-200 mb-1"></div>
          <div className="h-1 w-full bg-slate-300"></div>
          <div className="h-1 w-3/4 bg-slate-300 mt-1"></div>
        </div>

        {/* Experience */}
        <div className="flex-1 flex flex-col gap-1">

          <div>
            <div className="h-1 w-1/4 bg-slate-900 mb-1"></div>
            <div className="h-px bg-slate-200 mb-1"></div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="h-1 w-1/3 bg-slate-800"></div>
                <div className="h-1 w-1/4 bg-slate-500"></div>
              </div>
              <div className="h-1 w-1/2 bg-slate-600"></div>
              <div className="h-1 w-3/4 bg-slate-300"></div>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-2 gap-1 mt-auto">

            <div>
              <div className="h-1 w-1/3 bg-slate-900 mb-1"></div>
              <div className="h-px bg-slate-200 mb-1"></div>
              <div className="flex flex-wrap gap-1">
                <div className="h-1 w-6 bg-slate-200 border border-slate-300 rounded"></div>
                <div className="h-1 w-8 bg-slate-200 border border-slate-300 rounded"></div>
              </div>
            </div>

            <div>
              <div className="h-1 w-1/3 bg-slate-900 mb-1"></div>
              <div className="h-px bg-slate-200 mb-1"></div>
              <div className="h-1 w-2/3 bg-slate-300"></div>
              <div className="h-1 w-1/2 bg-slate-300 mt-1"></div>
            </div>

          </div>

        </div>

        {/* Contact Footer */}
        <div className="mt-1 border-t border-slate-200 pt-1">
          <div className="h-1 w-1/4 bg-slate-900 mb-1"></div>
          <div className="h-1 w-1/2 bg-slate-300"></div>
        </div>

      </div>
    </div>
  )
},
];