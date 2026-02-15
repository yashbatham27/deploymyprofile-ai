
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { ResumeData, Theme, ThemeColors } from '../types';

export const downloadPortfolio = async (data: ResumeData, theme: Theme, colors?: ThemeColors) => {
  const zip = new JSZip();

  // Create package.json
  const packageJson = {
    name: "my-ai-portfolio",
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "framer-motion": "^10.16.4",
      "lucide-react": "^0.263.1",
      "clsx": "^2.0.0",
      "tailwind-merge": "^1.14.0"
    },
    devDependencies: {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3",
      "autoprefixer": "^10.4.14",
      "postcss": "^8.4.27",
      "tailwindcss": "^3.3.3",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };

  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // Create PostCSS Config (Crucial for Tailwind to work)
  const postCssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
  zip.file("postcss.config.js", postCssConfig);

  // Create index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.personalInfo.name} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  zip.file("index.html", indexHtml);

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  };
  zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
  
   const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "bundler",
      allowSyntheticDefaultImports: true
    },
    include: ["vite.config.ts"]
  };
  zip.file("tsconfig.node.json", JSON.stringify(tsConfigNode, null, 2));

  const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;
  zip.file("vite.config.ts", viteConfig);

  const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
  zip.file("tailwind.config.js", tailwindConfig);
  
  // Tailwind Directives
  zip.file("src/index.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);

  zip.file("src/main.tsx", `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

  const themeComponentCode = getThemeComponentCode(theme, data, colors);
  zip.file("src/App.tsx", themeComponentCode);

  const content = await zip.generateAsync({ type: "blob" });
  // Updated filename to include Theme Name
  saveAs(content, `${data.personalInfo.name.replace(/\s+/g, '_')}_${theme}_Portfolio.zip`);
};

export function getThemeComponentCode(theme: Theme, data: ResumeData, colors?: ThemeColors): string {
  const dataString = JSON.stringify(data, null, 2);
  const colorsString = JSON.stringify(colors || { primary: '#000000', secondary: '#ffffff' }, null, 2);

  const imports = `
import React from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Code, Briefcase, 
  GraduationCap, Terminal, Send, Leaf, Cpu, Monitor, 
  Palette, Layout, Box, Zap, Type, FileText, Square, Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Read-only EditableField for exported version
const EditableField = ({ value, multiline }) => {
  return <span className="whitespace-pre-wrap">{value}</span>;
};
`;

  const commonLogic = `
const Portfolio = () => {
  const data = ${dataString};
  const customColors = ${colorsString};
  const isEditing = false; // Exported portfolio is read-only
  const { primary, secondary } = customColors;
  
  // Helper variables for themes that use them
  const primaryColor = customColors.primary;
  const secondaryColor = customColors.secondary;
  
  const updateField = () => {}; // No-op
  const updatePersonalInfo = () => {}; // No-op

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = data.personalInfo.email;
    if (!email) {
        alert("No email address found in portfolio data.");
        return;
    }
    const name = formData.get('name');
    const senderEmail = formData.get('email');
    const message = formData.get('message');

    const subject = \`Portfolio Contact from \${name}\`;
    const body = \`Name: \${name}\\nEmail: \${senderEmail}\\n\\nMessage:\\n\${message}\`;
    
    window.location.href = \`mailto:\${email}?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`;
  };
`;

  let jsxContent = "";

  // Inject full styling for each theme
  switch (theme) {
    case Theme.Minimalist:
        jsxContent = `
    return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200 overflow-y-auto">
      <header className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-serif font-bold mb-4">
          <EditableField value={data.personalInfo.name} />
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          <EditableField value={data.personalInfo.title} />
        </p>
        <div className="text-gray-500 max-w-2xl leading-relaxed mb-8">
          <EditableField value={data.personalInfo.summary} multiline />
        </div>
        
        <div className="flex gap-4">
          {data.personalInfo.email && (
            <a href={\`mailto:\${data.personalInfo.email}\`} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Mail size={20} />
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Github size={20} />
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Linkedin size={20} />
            </a>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 pb-20 space-y-20">
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Experience</h2>
            <div className="space-y-12">
              {data.experience.map((job, index) => (
                <div key={index} className="grid md:grid-cols-[1fr_3fr] gap-4">
                  <div className="text-gray-500 text-sm">
                     <EditableField value={job.startDate} /> - <EditableField value={job.endDate} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1"><EditableField value={job.role} /></h3>
                    <div className="text-gray-600 mb-4"><EditableField value={job.company} /></div>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                       {job.description?.map((desc, i) => (
                         <li key={i}><EditableField value={desc} multiline /></li>
                       ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <div key={index} className="border border-gray-100 p-6 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium flex-1"><EditableField value={project.name} /></h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm mb-6 h-20 overflow-hidden text-ellipsis">
                     <EditableField value={project.description} multiline />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                         <EditableField value={tech} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                 <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-medium"><EditableField value={edu.school} /></h3>
                      <span className="text-sm text-gray-500"><EditableField value={edu.year} /></span>
                    </div>
                    <div className="text-gray-600"><EditableField value={edu.degree} /></div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
               {data.skills.map((skill, i) => (
                  <span key={i} className="text-gray-600 text-sm border-b border-transparent hover:border-gray-300 transition-colors pb-0.5">
                     <EditableField value={skill} />
                  </span>
               ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Get in Touch</h2>
          <div className="max-w-xl">
             <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                   <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input type="email" name="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                   <textarea name="message" required rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all resize-none"></textarea>
                </div>
                <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                   <span>Send Message</span>
                   <Send size={16} />
                </button>
             </form>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} {data.personalInfo.name}. All rights reserved.
      </footer>
    </div>
    );`;
        break;

    case Theme.Developer:
        jsxContent = `
    return (
    <div className="w-full min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono selection:bg-[#238636] selection:text-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <header className="mb-20">
           <div className="text-[#238636] mb-4">User: ~/portfolio/{data.personalInfo.name.toLowerCase().replace(/\\s/g, '-')}</div>
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
             <span className="text-[#238636] mr-4">&gt;</span>
             <EditableField value={data.personalInfo.name} />
           </h1>
           <div className="text-xl text-[#8b949e] border-l-2 border-[#30363d] pl-4 mb-8">
             <EditableField value={data.personalInfo.title} />
             {' // '}
             <EditableField value={data.personalInfo.summary} multiline />
           </div>
           
           <div className="flex gap-6 text-[#8b949e]">
               {data.personalInfo.github && (
                 <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                   <Github size={18} /> <span>github</span>
                 </a>
               )}
               {data.personalInfo.linkedin && (
                 <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                   <Linkedin size={18} /> <span>linkedin</span>
                 </a>
               )}
               {data.personalInfo.email && (
                 <a href={\`mailto:\${data.personalInfo.email}\`} className="hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                   <Mail size={18} /> <span>email</span>
                 </a>
               )}
           </div>
        </header>
        
        <main className="grid gap-16">
           {data.experience && data.experience.length > 0 && (
             <section>
               <h2 className="text-2xl text-white font-bold mb-8 flex items-center">
                  <Terminal className="mr-3 text-[#238636]" /> ./experience
               </h2>
               <div className="space-y-12">
                 {data.experience.map((job, index) => (
                   <div key={index} className="relative pl-8 border-l border-[#30363d]">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#30363d] border border-[#0d1117]"></div>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                        <h3 className="text-xl text-[#58a6ff] font-bold"><EditableField value={job.role} /></h3>
                        <span className="text-sm text-[#8b949e] font-mono">
                           [ <EditableField value={job.startDate} /> : <EditableField value={job.endDate} /> ]
                        </span>
                      </div>
                      <div className="text-[#79c0ff] mb-4">@ <EditableField value={job.company} /></div>
                      <ul className="space-y-2 text-[#c9d1d9] text-sm">
                        {job.description?.map((desc, i) => (
                           <li key={i} className="flex items-start">
                              <span className="mr-2 text-[#30363d]">$</span> 
                              <EditableField value={desc} multiline />
                           </li>
                        ))}
                      </ul>
                   </div>
                 ))}
               </div>
             </section>
           )}
           
           {data.projects && data.projects.length > 0 && (
             <section>
               <h2 className="text-2xl text-white font-bold mb-8 flex items-center">
                  <Code className="mr-3 text-[#238636]" /> ./projects
               </h2>
               <div className="grid md:grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="bg-[#161b22] border border-[#30363d] rounded p-6 hover:border-[#58a6ff] transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-lg font-bold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors flex-1">
                            <EditableField value={project.name} />
                         </h3>
                         {project.link && (
                             <a href={project.link} target="_blank" rel="noreferrer" className="text-[#8b949e] hover:text-white">
                               <ExternalLink size={16} />
                             </a>
                         )}
                      </div>
                      <div className="text-sm text-[#8b949e] mb-6 h-16 overflow-hidden">
                         <EditableField value={project.description} multiline />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech, i) => (
                          <span key={i} className="text-xs text-[#238636] border border-[#238636] px-2 py-0.5 rounded-full">
                             <EditableField value={tech} />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
             </section>
           )}

           <div className="grid md:grid-cols-2 gap-16">
              {data.education && data.education.length > 0 && (
                <section>
                   <h2 className="text-2xl text-white font-bold mb-8 flex items-center">
                      <GraduationCap className="mr-3 text-[#238636]" /> ./education
                   </h2>
                   <div className="space-y-6">
                      {data.education.map((edu, index) => (
                         <div key={index} className="bg-[#161b22] p-4 rounded border-l-2 border-[#238636]">
                            <div className="text-[#c9d1d9] font-bold"><EditableField value={edu.school} /></div>
                            <div className="text-[#79c0ff] text-sm"><EditableField value={edu.degree} /></div>
                            <div className="text-[#8b949e] text-xs mt-2"><EditableField value={edu.year} /></div>
                         </div>
                      ))}
                   </div>
                </section>
              )}
              
              {data.skills && data.skills.length > 0 && (
                <section>
                   <h2 className="text-2xl text-white font-bold mb-8 flex items-center">
                      <Briefcase className="mr-3 text-[#238636]" /> ./skills
                   </h2>
                   <div className="bg-[#161b22] p-6 rounded border border-[#30363d]">
                      <div className="flex flex-wrap gap-3">
                         {data.skills.map((skill, i) => (
                            <span key={i} className="text-sm text-[#c9d1d9]">
                              <span className="text-[#8b949e]">const</span> 
                               <span className="mx-1"><EditableField value={skill.replace(/\\s/g, '_')} /></span>
                               = <span className="text-[#238636]">true</span>;
                            </span>
                         ))}
                      </div>
                   </div>
                </section>
              )}
           </div>
           
           <section>
             <h2 className="text-2xl text-white font-bold mb-8 flex items-center">
                <Mail className="mr-3 text-[#238636]" /> ./contact-me
             </h2>
             <form onSubmit={handleContactSubmit} className="bg-[#161b22] border border-[#30363d] rounded p-8 max-w-2xl">
                 <div className="space-y-4 font-mono text-sm">
                    <div className="flex flex-col">
                       <label className="text-[#8b949e] mb-1">// Enter your name</label>
                       <input name="name" type="text" required placeholder="const name = '...'" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                       <label className="text-[#8b949e] mb-1">// Enter your email</label>
                       <input name="email" type="email" required placeholder="const email = '...'" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                       <label className="text-[#8b949e] mb-1">// Enter your message</label>
                       <textarea name="message" required rows={4} placeholder="/* Message */" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" className="bg-[#238636] text-white px-4 py-2 rounded hover:bg-[#2ea043] transition-colors flex items-center gap-2 w-fit">
                       <Send size={14} />
                       <span>git push message</span>
                    </button>
                 </div>
             </form>
           </section>
        </main>
      </div>
    </div>
    );`;
        break;

    case Theme.Creative:
        jsxContent = `
    return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-white/30 selection:text-white overflow-y-auto relative">
       {/* Background Blobs */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px]" 
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px]" 
            style={{ backgroundColor: secondaryColor }}
          />
       </div>

       <header className="relative z-10 min-h-[60vh] flex flex-col justify-center items-center text-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
             <h2 className="font-medium tracking-widest uppercase text-sm mb-4" style={{ color: secondaryColor }}>
                Portfolio
             </h2>
             
             <div className="text-5xl md:text-7xl font-bold mb-6">
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{ backgroundImage: \`linear-gradient(to right, \${primaryColor}, \${secondaryColor})\` }}
                >
                  <EditableField value={data.personalInfo.name} />
                </span>
             </div>

             <div className="text-2xl md:text-3xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
               <EditableField value={data.personalInfo.title} />
             </div>
             
             <div className="text-slate-400 max-w-lg mx-auto mb-10">
               <EditableField value={data.personalInfo.summary} multiline />
             </div>
             
             <div className="flex justify-center gap-6 flex-wrap">
                {data.personalInfo.github && (
                   <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-sm">
                      <Github size={24} />
                   </a>
                )}
                {data.personalInfo.linkedin && (
                   <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-sm">
                      <Linkedin size={24} />
                   </a>
                )}
                {data.personalInfo.email && (
                   <a href={\`mailto:\${data.personalInfo.email}\`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-sm">
                      <Mail size={24} />
                   </a>
                )}
             </div>
          </motion.div>
       </header>

       <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">
          {data.experience && data.experience.length > 0 && (
            <section>
               <h3 className="text-4xl font-bold mb-16 text-center">My Journey</h3>
               <div className="space-y-8">
                  {data.experience.map((job, index) => (
                     <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors"
                     >
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                           <div className="w-full">
                              <div className="text-2xl font-bold text-white"><EditableField value={job.role} /></div>
                              <div style={{ color: primaryColor }}><EditableField value={job.company} /></div>
                           </div>
                           <div className="text-slate-400 text-sm mt-2 md:mt-0 whitespace-nowrap">
                              <EditableField value={job.startDate} /> — <EditableField value={job.endDate} />
                           </div>
                        </div>
                        <ul className="space-y-2 text-slate-300 w-full">
                           {job.description?.map((desc, i) => (
                              <li key={i} className="flex items-start gap-2">
                                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: secondaryColor }} />
                                 <div className="flex-1"><EditableField value={desc} multiline /></div>
                              </li>
                           ))}
                        </ul>
                     </motion.div>
                  ))}
               </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
               <h3 className="text-4xl font-bold mb-16 text-center">Selected Works</h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.projects.map((project, index) => (
                     <motion.div
                        key={index}
                        whileHover={{ y: -10 }}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col"
                     >
                        <div className="p-6 h-full flex flex-col">
                           <div className="flex justify-between items-start mb-4">
                              <div className="text-xl font-bold flex-1 mr-2"><EditableField value={project.name} /></div>
                                 {project.link && (
                                  <a href={project.link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: primaryColor }}>
                                    <ExternalLink size={20}/>
                                  </a>
                                 )}
                           </div>
                           <div className="text-slate-400 text-sm mb-6 flex-grow">
                              <EditableField value={project.description} multiline />
                           </div>
                           <div className="flex flex-wrap gap-2 mt-auto">
                              {project.technologies?.map((tech, i) => (
                                 <span key={i} className="text-xs font-bold text-slate-900 bg-slate-200 px-2 py-1 rounded">
                                    <EditableField value={tech} />
                                 </span>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-12">
             {data.education && data.education.length > 0 && (
               <section>
                  <h3 className="text-3xl font-bold mb-8">Education</h3>
                  <div className="space-y-6">
                     {data.education.map((edu, index) => (
                        <div key={index} className="flex gap-4 items-start">
                           <div className="p-3 rounded-lg" style={{ backgroundColor: \`\${primaryColor}20\`, color: primaryColor }}>
                              <GraduationCap size={24} />
                           </div>
                           <div className="flex-1">
                              <div className="text-xl font-bold"><EditableField value={edu.school} /></div>
                              <div className="text-slate-300"><EditableField value={edu.degree} /></div>
                              <div className="text-slate-500 text-sm"><EditableField value={edu.year} /></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
             )}

             {data.skills && data.skills.length > 0 && (
               <section>
                  <h3 className="text-3xl font-bold mb-8">Skillset</h3>
                  <div className="flex flex-wrap gap-3">
                     {data.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-default"
                        >
                           <EditableField value={skill} />
                        </span>
                     ))}
                  </div>
               </section>
             )}
          </div>

          <section>
              <h3 className="text-3xl font-bold mb-8 text-center">Contact Me</h3>
              <div className="max-w-xl mx-auto">
                 <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                            <label className="text-xs text-slate-400 ml-2 block">Name</label>
                            <input name="name" type="text" required className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                            <label className="text-xs text-slate-400 ml-2 block">Email</label>
                            <input name="email" type="email" required className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600" />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                        <label className="text-xs text-slate-400 ml-2 block">Message</label>
                        <textarea name="message" required rows={4} className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600 resize-none"></textarea>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full text-white font-bold py-3 rounded-lg shadow-lg transition-shadow flex justify-center items-center gap-2"
                        style={{ 
                          backgroundImage: \`linear-gradient(to right, \${primaryColor}, \${secondaryColor})\`,
                          boxShadow: \`0 10px 15px -3px \${primaryColor}40\`
                        }}
                    >
                        <span>Send Message</span>
                        <Send size={18} />
                    </motion.button>
                 </form>
              </div>
          </section>
       </main>
       
       <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-800 mt-20">
          <p>Designed with AI. Built for the future.</p>
       </footer>
    </div>
    );`;
        break;

    case Theme.BentoGrid:
      jsxContent = `
      return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8 font-sans text-neutral-900">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto"
      >
        <motion.div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-neutral-200">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase">Available for work</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{data.personalInfo.name}</h1>
            <p className="text-xl text-neutral-500 font-medium">{data.personalInfo.title}</p>
          </div>
          <div className="mt-8">
            <p className="text-neutral-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        </motion.div>

        <motion.div className="md:col-span-1 bg-neutral-900 text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-4 shadow-sm min-h-[200px]">
            <div className="flex gap-4">
                {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Github size={24}/></a>}
                {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={24}/></a>}
                {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Mail size={24}/></a>}
            </div>
            <p className="text-sm text-neutral-400">Connect with me</p>
        </motion.div>

        {data.skills && (
          <motion.div className="md:col-span-1 bg-blue-600 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-lg font-bold mb-4 opacity-90">Core Stack</h3>
              <div className="flex flex-wrap gap-2 content-start">
                  {data.skills.slice(0, 10).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 rounded-md text-sm font-medium backdrop-blur-sm">{skill}</span>
                  ))}
              </div>
          </motion.div>
        )}

        {data.experience && (
          <motion.div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">Experience</h3>
              <div className="space-y-8">
                  {data.experience.map((job, index) => (
                      <div key={index} className="border-l-2 border-neutral-100 pl-4 group hover:border-blue-500 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                               <span className="font-bold text-lg">{job.role}</span>
                               <span className="text-xs text-neutral-400 font-medium bg-neutral-100 px-2 py-1 rounded w-fit mt-1 sm:mt-0">{job.startDate}</span>
                          </div>
                          <div className="text-blue-600 font-medium mb-2">{job.company}</div>
                          <ul className="text-sm text-neutral-600 list-disc list-inside space-y-1">
                              {job.description.slice(0, 3).map((desc, i) => <li key={i}>{desc}</li>)}
                          </ul>
                      </div>
                  ))}
              </div>
          </motion.div>
        )}

         {data.projects && (
           <motion.div className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h3 className="text-2xl font-bold mb-6">Selected Work</h3>
              <div className="grid gap-4">
                  {data.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold">{project.name}</h4>
                               {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-900"><ExternalLink size={16}/></a>}
                          </div>
                          <div className="text-sm text-neutral-600 mb-2 line-clamp-2">{project.description}</div>
                          {project.technologies && (
                            <div className="flex gap-2 flex-wrap">
                                {project.technologies.map((t, ti) => (
                                    <span key={ti} className="text-[10px] uppercase font-bold text-neutral-400">{t}</span>
                                ))}
                            </div>
                          )}
                      </div>
                  ))}
              </div>
           </motion.div>
         )}

         <motion.div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Name" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
                  <input name="email" type="email" placeholder="Email" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
               </div>
               <textarea name="message" rows={3} placeholder="Message" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none" required ></textarea>
               <button type="submit" className="bg-neutral-900 text-white font-bold py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                  Send <Send size={16} />
               </button>
            </form>
         </motion.div>
      </motion.div>
    </div>
      );`;
      break;

    case Theme.Glassmorphism:
      jsxContent = `
    return (
    <div 
      className="min-h-screen p-8 font-sans text-white overflow-y-auto"
      style={{ background: \`linear-gradient(to bottom right, \${primaryColor}, \${secondaryColor})\` }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-xl text-center">
             <h1 className="text-5xl font-bold mb-2 drop-shadow-md">{data.personalInfo.name}</h1>
             <p className="text-xl text-white/80 mb-6 font-light tracking-wide">{data.personalInfo.title}</p>
             <div className="flex justify-center gap-4">
                {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Mail size={20}/></a>}
                {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Github size={20}/></a>}
                {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Linkedin size={20}/></a>}
             </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">About Me</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{data.personalInfo.summary}</p>
                </div>
                {data.skills && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10 hover:bg-white/20 transition-colors">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="md:col-span-2 space-y-8">
                 {data.experience && (
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Experience</h2>
                        <div className="space-y-8">
                            {data.experience.map((job, index) => (
                                <div key={index} className="relative pl-6 border-l border-white/20">
                                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                    <div className="flex flex-col sm:flex-row justify-between mb-1">
                                        <h3 className="text-xl font-semibold">{job.role}</h3>
                                        <span className="text-sm text-white/60">{job.startDate}</span>
                                    </div>
                                    <div className="text-white/80 mb-2 italic">{job.company}</div>
                                    <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                                        {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
                  {data.projects && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Projects</h2>
                        <div className="grid gap-4">
                            {data.projects.map((project, index) => (
                                <div key={index} className="bg-black/20 p-4 rounded-xl hover:bg-black/30 transition-colors">
                                    <h4 className="font-bold text-lg mb-1">{project.name}</h4>
                                    <p className="text-sm text-white/70 mb-2">{project.description}</p>
                                </div>
                            ))}
                        </div>
                      </div>
                  )}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                     <h2 className="text-2xl font-bold mb-6">Contact Me</h2>
                     <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                           <input name="name" type="text" placeholder="Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors" required />
                           <input name="email" type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors" required />
                        </div>
                        <textarea name="message" rows={4} placeholder="Your Message" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors resize-none" required ></textarea>
                        <button type="submit" className="w-full py-3 bg-white font-bold rounded-lg hover:bg-white/90 transition-colors flex justify-center items-center gap-2" style={{ color: customColors.primary }}>
                           Send Message <Send size={18}/>
                        </button>
                     </form>
                  </div>
            </div>
        </div>
      </div>
    </div>
    );`;
      break;

    case Theme.Cyberpunk:
      jsxContent = `
    return (
    <div 
        className="min-h-screen bg-black p-4 md:p-8 font-mono overflow-y-auto selection:text-black"
        style={{ color: primary }}
    >
      <style>{\`
        ::selection {
          background-color: \${primary};
          color: black;
        }
      \`}</style>
      <div className="max-w-6xl mx-auto border-2 p-2 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]" style={{ borderColor: primary, boxShadow: \`0 0 20px \${primary}40\` }}>
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 -mt-1 -ml-1" style={{ borderColor: primary }}></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 -mt-1 -mr-1" style={{ borderColor: primary }}></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 -mb-1 -ml-1" style={{ borderColor: primary }}></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 -mb-1 -mr-1" style={{ borderColor: primary }}></div>

        <div className="bg-[#050505] p-6 md:p-12 min-h-[calc(100vh-6rem)]">
             <header className="mb-16 border-b pb-8 relative" style={{ borderColor: primary }}>
                 <div className="absolute -top-6 -left-2 text-xs text-black px-2 py-0.5" style={{ backgroundColor: primary }}>NETRUNNER_ID: {data.personalInfo.name.toUpperCase().replace(/\\s/g, '_')}</div>
                 <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4" 
                    style={{ textShadow: \`2px 2px 0px \${secondary}\` }}
                 >
                    {data.personalInfo.name}
                 </motion.h1>
                 <div className="text-xl md:text-2xl font-bold mb-6" style={{ color: secondary }}>
                    {data.personalInfo.title}
                 </div>
                 <div className="flex gap-4">
                    {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Github size={20}/></a>}
                    {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Linkedin size={20}/></a>}
                    {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Mail size={20}/></a>}
                 </div>
             </header>

             <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
                 <div className="space-y-12">
                     {data.experience && data.experience.length > 0 && (
                         <section>
                             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 border-l-4 pl-4" style={{ color: secondary, borderColor: secondary }}>
                                 <Terminal className="animate-pulse"/> MISSION_LOG (EXPERIENCE)
                             </h2>
                             <div className="space-y-8">
                                {data.experience.map((job, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="border p-6 bg-[#001a05] transition-colors group relative overflow-hidden"
                                        style={{ borderColor: \`\${primary}50\` }}
                                        whileHover={{ borderColor: primary }}
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: primary }}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold transition-colors" style={{ color: primary }}>{job.role}</h3>
                                            <span className="text-xs border px-2 py-1" style={{ borderColor: primary }}>{job.startDate}</span>
                                        </div>
                                        <div className="mb-4 text-sm font-bold uppercase" style={{ color: secondary }}>{job.company}</div>
                                        <ul className="list-inside text-sm space-y-2" style={{ color: \`\${primary}cc\` }}>
                                            {job.description.map((desc, i) => (
                                                <li key={i} className="flex gap-2"><span style={{ color: secondary }}>&gt;</span> <span>{desc}</span></li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                             </div>
                         </section>
                     )}

                     {data.projects && data.projects.length > 0 && (
                         <section>
                             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 border-l-4 pl-4" style={{ color: secondary, borderColor: secondary }}>
                                 <Cpu className="animate-spin-slow"/> DEPLOYMENTS (PROJECTS)
                             </h2>
                             <div className="grid gap-6">
                                {data.projects.map((project, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ boxShadow: \`4px 4px 0px \${secondary}\`, borderColor: secondary }}
                                        className="bg-[#050505] border p-6 transition-all"
                                        style={{ borderColor: \`\${secondary}80\`, boxShadow: \`4px 4px 0px \${secondary}\` }}
                                    >
                                        <h4 className="text-xl font-bold mb-2" style={{ color: secondary }}>{project.name}</h4>
                                        <p className="text-sm mb-4 opacity-80">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="text-xs px-2 py-1 border" style={{ backgroundColor: \`\${secondary}20\`, color: secondary, borderColor: \`\${secondary}50\` }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                             </div>
                         </section>
                     )}
                     
                     <section>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 border-l-4 pl-4" style={{ color: secondary, borderColor: secondary }}>
                            <Mail className="animate-pulse"/> TRANSMISSION (CONTACT)
                        </h2>
                        <form onSubmit={handleContactSubmit} className="bg-[#001a05] border p-6 space-y-4 shadow-[4px_4px_0px]" style={{ borderColor: primary, boxShadow: \`4px 4px 0px \${primary}\` }}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="name" type="text" placeholder="ID_NAME" className="bg-black border px-4 py-2 focus:outline-none" style={{ borderColor: primary, color: primary }} required />
                                <input name="email" type="email" placeholder="COMMS_LINK" className="bg-black border px-4 py-2 focus:outline-none" style={{ borderColor: primary, color: primary }} required />
                            </div>
                            <textarea name="message" rows={4} placeholder="DATA_PACKET" className="w-full bg-black border px-4 py-2 focus:outline-none resize-none" style={{ borderColor: primary, color: primary }} required ></textarea>
                            <button type="submit" className="w-full text-black font-bold py-3 transition-colors flex justify-center items-center gap-2" style={{ backgroundColor: primary }}>
                                UPLOAD <Send size={18}/>
                            </button>
                        </form>
                     </section>
                 </div>

                 <aside className="space-y-12">
                      <div className="border p-6 bg-[#001a05]" style={{ borderColor: primary }}>
                         <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: primary, borderColor: primary }}>SYSTEM_SUMMARY</h3>
                         <p className="text-sm leading-relaxed opacity-80">
                             {data.personalInfo.summary}
                         </p>
                      </div>
                      {data.skills && data.skills.length > 0 && (
                          <div>
                             <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: secondary, borderColor: secondary }}>INSTALLED_MODULES</h3>
                             <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-xs px-2 py-1 border" style={{ backgroundColor: \`\${secondary}20\`, color: secondary, borderColor: secondary }}>
                                        {skill}
                                    </span>
                                ))}
                             </div>
                          </div>
                      )}
                 </aside>
             </div>
        </div>
      </div>
    </div>
    );`;
      break;
      
    case Theme.ClassicSerif:
        jsxContent = `
    return (
    <div className="min-h-full bg-[#fdfbf7] text-[#2c2c2c] font-serif p-8 md:p-16 overflow-y-auto">
      <div className="max-w-4xl mx-auto border-t-4 border-black pt-12">
        <header className="mb-20 grid md:grid-cols-[2fr_1fr] gap-12 items-end">
             <div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4 tracking-tight">
                    <EditableField value={data.personalInfo.name} />
                </h1>
                <p className="text-2xl italic text-neutral-600">
                    <EditableField value={data.personalInfo.title} />
                </p>
             </div>
             <div className="text-right font-sans text-sm space-y-1 text-neutral-500">
                {data.personalInfo.email && <div className="hover:text-black transition-colors"><a href={\`mailto:\${data.personalInfo.email}\`}>{data.personalInfo.email}</a></div>}
                {data.personalInfo.linkedin && <div className="hover:text-black transition-colors"><a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
                {data.personalInfo.github && <div className="hover:text-black transition-colors"><a href={data.personalInfo.github} target="_blank" rel="noreferrer">GitHub</a></div>}
                {data.personalInfo.location && <div><EditableField value={data.personalInfo.location} /></div>}
             </div>
        </header>

        <div className="grid md:grid-cols-[1fr_3fr] gap-12 md:gap-24">
            <aside className="space-y-12 font-sans pt-2">
                 <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">About</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">
                        <EditableField value={data.personalInfo.summary} multiline />
                    </p>
                 </section>

                 {data.skills && data.skills.length > 0 && (
                     <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Expertise</h3>
                        <ul className="text-sm space-y-2 text-neutral-600">
                            {data.skills.map((skill, i) => (
                                <li key={i}>
                                    <EditableField value={skill} />
                                </li>
                            ))}
                        </ul>
                     </section>
                 )}

                 {data.education && data.education.length > 0 && (
                     <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Education</h3>
                         {data.education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <div className="font-bold text-sm"><EditableField value={edu.school} /></div>
                                <div className="text-xs text-neutral-500 italic"><EditableField value={edu.degree} /></div>
                                <div className="text-xs text-neutral-400 mt-1"><EditableField value={edu.year} /></div>
                            </div>
                        ))}
                     </section>
                 )}
            </aside>

            <main className="space-y-20">
                 {data.experience && data.experience.length > 0 && (
                     <section>
                         <h2 className="text-4xl font-bold mb-12">Experience.</h2>
                         <div className="space-y-12">
                            {data.experience.map((job, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-baseline mb-2 font-sans">
                                        <h3 className="text-xl font-bold"><EditableField value={job.role} /></h3>
                                        <span className="text-sm text-neutral-400"><EditableField value={job.startDate} /> - <EditableField value={job.endDate} /></span>
                                    </div>
                                    <div className="text-lg italic text-neutral-600 mb-4"><EditableField value={job.company} /></div>
                                    <ul className="space-y-3 font-sans text-neutral-600 leading-relaxed">
                                        {job.description.map((desc, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="text-neutral-300 block mt-2 h-1 w-1 bg-neutral-300 rounded-full shrink-0"></span>
                                                <EditableField value={desc} multiline />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                         </div>
                     </section>
                 )}

                 {data.projects && data.projects.length > 0 && (
                     <section>
                         <h2 className="text-4xl font-bold mb-12">Projects.</h2>
                         <div className="grid gap-12">
                            {data.projects.map((project, index) => (
                                <div key={index} className="border-b border-neutral-200 pb-8 last:border-0">
                                    <div className="flex justify-between items-baseline mb-4 font-sans">
                                         <h3 className="text-xl font-bold"><EditableField value={project.name} /></h3>
                                         {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest border-b border-black hover:bg-black hover:text-white transition-all">View Project</a>}
                                    </div>
                                    <p className="font-sans text-neutral-600 leading-relaxed">
                                        <EditableField value={project.description} multiline />
                                    </p>
                                </div>
                            ))}
                         </div>
                     </section>
                 )}
                 
                 <section>
                    <h2 className="text-4xl font-bold mb-12">Contact.</h2>
                    <form onSubmit={handleContactSubmit} className="space-y-6 max-w-lg font-sans">
                        <div className="grid md:grid-cols-2 gap-6">
                            <input name="name" type="text" placeholder="Name" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent" required />
                            <input name="email" type="email" placeholder="Email" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent" required />
                        </div>
                        <textarea name="message" rows={4} placeholder="Message" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent resize-none" required ></textarea>
                        <button type="submit" className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2">
                            Send Message <Send size={14} />
                        </button>
                    </form>
                 </section>
            </main>
        </div>
      </div>
    </div>
    );`;
        break;

    case Theme.ResumeFirst:
        jsxContent = `
    return (
    <div className="min-h-full bg-white text-slate-900 font-sans p-8 md:p-12 overflow-y-auto">
      <div className="max-w-[21cm] mx-auto bg-white shadow-lg md:min-h-[29.7cm] p-8 md:p-12">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
                  <EditableField value={data.personalInfo.name} />
              </h1>
              <p className="text-lg text-slate-600 font-medium mb-4">
                  <EditableField value={data.personalInfo.title} />
              </p>
              <div className="flex justify-center flex-wrap gap-4 text-sm text-slate-500">
                  {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                  {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                  {data.personalInfo.linkedin && <span>• <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a></span>}
                  {data.personalInfo.github && <span>• <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></span>}
              </div>
          </div>

          {/* Summary */}
          <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-4">Professional Summary</h2>
              <p className="text-sm leading-relaxed text-slate-700 text-justify">
                  <EditableField value={data.personalInfo.summary} multiline />
              </p>
          </section>

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
              <section className="mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-6">Experience</h2>
                  <div className="space-y-6">
                      {data.experience.map((job, index) => (
                          <div key={index}>
                              <div className="flex justify-between items-baseline font-bold text-slate-800">
                                  <h3><EditableField value={job.role} /></h3>
                                  <span className="text-sm"><EditableField value={job.startDate} /> – <EditableField value={job.endDate} /></span>
                              </div>
                              <div className="text-sm font-semibold text-slate-600 mb-2">
                                  <EditableField value={job.company} />
                              </div>
                              <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                                  {job.description.map((desc, i) => (
                                      <li key={i}><EditableField value={desc} multiline /></li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          <div className="grid md:grid-cols-2 gap-8">
               {/* Skills */}
               {data.skills && data.skills.length > 0 && (
                   <section>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-4">Technical Skills</h2>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-700">
                          {data.skills.map((skill, i) => (
                              <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                                  <EditableField value={skill} />
                              </span>
                          ))}
                      </div>
                   </section>
               )}

               {/* Education */}
               {data.education && data.education.length > 0 && (
                   <section>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-4">Education</h2>
                      <div className="space-y-4">
                          {data.education.map((edu, i) => (
                              <div key={i}>
                                  <div className="font-bold text-sm text-slate-800"><EditableField value={edu.school} /></div>
                                  <div className="text-sm text-slate-700"><EditableField value={edu.degree} /></div>
                                  <div className="text-xs text-slate-500"><EditableField value={edu.year} /></div>
                              </div>
                          ))}
                      </div>
                   </section>
               )}
          </div>
          
          <section className="mt-12 pt-8 border-t border-slate-200">
             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Contact</h2>
             <form onSubmit={handleContactSubmit} className="grid gap-4 max-w-lg">
                <div className="flex gap-4">
                   <input name="name" type="text" placeholder="Your Name" className="w-full border border-slate-300 p-2 text-sm rounded" required />
                   <input name="email" type="email" placeholder="Your Email" className="w-full border border-slate-300 p-2 text-sm rounded" required />
                </div>
                <textarea name="message" rows={3} placeholder="Your Message" className="w-full border border-slate-300 p-2 text-sm rounded resize-none" required></textarea>
                <button type="submit" className="w-fit bg-slate-900 text-white px-4 py-2 text-sm font-medium rounded hover:bg-slate-800 flex items-center gap-2">
                    Send Inquiry <Send size={14}/>
                </button>
             </form>
          </section>
      </div>
    </div>
    );`;
        break;

    case Theme.Brutalist:
      jsxContent = `
    return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-8 font-mono text-black overflow-y-auto">
       <motion.div 
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="max-w-6xl mx-auto border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
       >
           <header className="border-b-4 border-black p-8 md:p-16" style={{ backgroundColor: primary }}>
               <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-4 break-words">
                  {data.personalInfo.name}
               </h1>
               <div className="text-2xl md:text-4xl font-bold bg-black text-white inline-block px-4 py-2 transform -rotate-1 hover:rotate-2 transition-transform cursor-default">
                  {data.personalInfo.title}
               </div>
           </header>

           <div className="grid md:grid-cols-[1fr_2fr] divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                <aside className="p-8 space-y-12" style={{ backgroundColor: secondary }}>
                     <section>
                         <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Contact</h2>
                         <div className="space-y-2 text-lg font-bold">
                             {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="block hover:underline truncate hover:translate-x-2 transition-transform">{data.personalInfo.email}</a>}
                             {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="block hover:underline hover:translate-x-2 transition-transform">LinkedIn</a>}
                             {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="block hover:underline hover:translate-x-2 transition-transform">GitHub</a>}
                         </div>
                     </section>
                     {data.skills && (
                         <section>
                             <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Skills</h2>
                             <div className="flex flex-wrap gap-2">
                                 {data.skills.map((skill, i) => (
                                     <span key={i} className="border-2 border-black bg-white px-2 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{skill}</span>
                                 ))}
                             </div>
                         </section>
                     )}
                     {data.education && (
                         <section>
                             <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Edu</h2>
                             {data.education.map((edu, i) => (
                                 <div key={i} className="mb-4 border-2 border-black bg-white p-4 hover:bg-black hover:text-white transition-colors">
                                     <div className="font-black text-lg">{edu.school}</div>
                                     <div className="font-bold text-sm">{edu.degree}</div>
                                 </div>
                             ))}
                         </section>
                     )}
                </aside>
                <main className="bg-white p-8 md:p-12 space-y-16">
                     {data.experience && (
                         <section>
                             <h2 className="text-5xl font-black uppercase mb-8 decoration-4 underline decoration-black underline-offset-8">Experience</h2>
                             <div className="space-y-12">
                                 {data.experience.map((job, index) => (
                                     <div key={index} className="relative">
                                         <div className="border-4 border-black p-6 hover:bg-black hover:text-white transition-colors group shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1">
                                             <div className="flex flex-col md:flex-row justify-between mb-4 border-b-4 border-black group-hover:border-white pb-4">
                                                  <div>
                                                      <h3 className="text-2xl font-black uppercase">{job.role}</h3>
                                                      <div className="text-xl font-bold">{job.company}</div>
                                                  </div>
                                                  <div className="text-lg font-bold">{job.startDate} - {job.endDate}</div>
                                             </div>
                                             <ul className="list-disc list-inside font-medium space-y-2">
                                                 {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                             </ul>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </section>
                     )}
                     {data.projects && (
                         <section>
                             <h2 className="text-5xl font-black uppercase mb-8 decoration-4 underline decoration-black underline-offset-8">Projects</h2>
                             <div className="grid gap-8">
                                 {data.projects.map((project, index) => (
                                     <div key={index} className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: \`\${primary}40\` }}>
                                         <h3 className="text-2xl font-black uppercase mb-2">{project.name}</h3>
                                         <p className="font-bold mb-4 border-t-4 border-black pt-4">{project.description}</p>
                                         <div className="flex flex-wrap gap-2">
                                             {project.technologies.map((tech, i) => (
                                                 <span key={i} className="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold">{tech}</span>
                                             ))}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </section>
                     )}
                     <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-4xl font-black uppercase mb-6">Drop a Message</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                           <div className="grid md:grid-cols-2 gap-4">
                              <input name="name" type="text" placeholder="NAME" className="border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all" required />
                              <input name="email" type="email" placeholder="EMAIL" className="border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all" required />
                           </div>
                           <textarea name="message" rows={4} placeholder="WHAT'S UP?" className="w-full border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all resize-none" required ></textarea>
                           <button type="submit" className="bg-black text-white font-black uppercase px-8 py-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 w-full justify-center">
                              SEND IT <Send size={24}/>
                           </button>
                        </form>
                     </section>
                </main>
           </div>
       </motion.div>
    </div>
    );`;
      break;

    case Theme.Nature:
        jsxContent = `
    return (
    <div className="min-h-full bg-[#f4f1ea] text-[#3a4a3b] font-sans overflow-y-auto selection:bg-[#a3b18a] selection:text-white">
      <div className="max-w-5xl mx-auto p-6 md:p-12 relative">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#daddd8] rounded-full blur-3xl -z-10 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e9edc9] rounded-full blur-3xl -z-10 opacity-50"></div>

          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16"
          >
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="mb-4 text-[#588157]"
              >
                  <Leaf size={48} strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#344e41] mb-3">
                  <EditableField value={data.personalInfo.name} />
              </h1>
              <p className="text-xl text-[#588157] font-medium mb-6">
                  <EditableField value={data.personalInfo.title} />
              </p>
              <div className="flex gap-4">
                  {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="p-2 rounded-full bg-[#a3b18a]/20 text-[#344e41] hover:bg-[#a3b18a]/40 transition-colors"><Mail size={18}/></a>}
                  {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-[#a3b18a]/20 text-[#344e41] hover:bg-[#a3b18a]/40 transition-colors"><Linkedin size={18}/></a>}
                  {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-[#a3b18a]/20 text-[#344e41] hover:bg-[#a3b18a]/40 transition-colors"><Github size={18}/></a>}
              </div>
          </motion.header>

          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
               {/* Left Column */}
               <div className="space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#dad7cd] shadow-sm"
                    >
                        <h3 className="text-lg font-serif font-bold text-[#344e41] mb-4 border-b border-[#dad7cd] pb-2">About</h3>
                        <p className="text-sm leading-relaxed text-[#3a4a3b]">
                             <EditableField value={data.personalInfo.summary} multiline />
                        </p>
                    </motion.div>

                    {data.skills && data.skills.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#dad7cd] shadow-sm"
                        >
                            <h3 className="text-lg font-serif font-bold text-[#344e41] mb-4 border-b border-[#dad7cd] pb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#e9edc9] rounded-lg text-xs font-semibold text-[#3a4a3b]">
                                        <EditableField value={skill} />
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {data.education && data.education.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-[#dad7cd] shadow-sm"
                        >
                            <h3 className="text-lg font-serif font-bold text-[#344e41] mb-4 border-b border-[#dad7cd] pb-2">Education</h3>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-[#344e41]"><EditableField value={edu.school} /></div>
                                        <div className="text-sm text-[#588157]"><EditableField value={edu.degree} /></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
               </div>

               {/* Right Column */}
               <div className="space-y-12">
                    {data.experience && data.experience.length > 0 && (
                        <section>
                             <motion.h2 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-3xl font-serif font-bold text-[#344e41] mb-8"
                             >
                                Experience
                             </motion.h2>
                             <div className="space-y-10">
                                 {data.experience.map((job, index) => (
                                     <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="relative pl-8 border-l-2 border-[#a3b18a]"
                                     >
                                         <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#a3b18a] border-4 border-[#f4f1ea]"></div>
                                         <div className="flex flex-col sm:flex-row justify-between mb-2">
                                              <h3 className="text-xl font-bold text-[#344e41]"><EditableField value={job.role} /></h3>
                                              <span className="text-sm font-medium text-[#588157] bg-[#e9edc9]/50 px-2 py-1 rounded"><EditableField value={job.startDate} /></span>
                                         </div>
                                         <div className="text-lg font-serif italic text-[#588157] mb-3"><EditableField value={job.company} /></div>
                                         <ul className="space-y-2 text-sm text-[#3a4a3b] list-disc list-inside marker:text-[#a3b18a]">
                                             {job.description.map((desc, i) => (
                                                 <li key={i}><EditableField value={desc} multiline /></li>
                                             ))}
                                         </ul>
                                     </motion.div>
                                 ))}
                             </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                             <motion.h2 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-3xl font-serif font-bold text-[#344e41] mb-8"
                             >
                                Projects
                             </motion.h2>
                             <div className="grid gap-6">
                                 {data.projects.map((project, index) => (
                                     <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-[#dad7cd] hover:border-[#a3b18a] transition-colors"
                                     >
                                         <h3 className="text-xl font-bold text-[#344e41] mb-2"><EditableField value={project.name} /></h3>
                                         <p className="text-sm text-[#3a4a3b] mb-4"><EditableField value={project.description} multiline /></p>
                                         <div className="flex flex-wrap gap-2">
                                             {project.technologies.map((tech, i) => (
                                                 <span key={i} className="text-xs text-[#588157] border border-[#a3b18a] px-2 py-1 rounded-full">
                                                     <EditableField value={tech} />
                                                 </span>
                                             ))}
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                        </section>
                    )}
                    
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-[#dad7cd] shadow-sm"
                    >
                        <h2 className="text-2xl font-serif font-bold text-[#344e41] mb-6">Contact</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="name" type="text" placeholder="Your Name" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157]" required />
                                <input name="email" type="email" placeholder="Your Email" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157]" required />
                            </div>
                            <textarea name="message" rows={4} placeholder="Your Message" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157] resize-none" required ></textarea>
                            <button type="submit" className="bg-[#588157] text-white px-6 py-2 rounded-lg hover:bg-[#344e41] transition-colors flex items-center gap-2">
                                Send Message <Send size={16}/>
                            </button>
                        </form>
                    </motion.section>
               </div>
          </div>
      </div>
    </div>
    );`;
        break;

    // Default Fallback
    default:
      jsxContent = `
    return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <header className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-serif font-bold mb-4">{data.personalInfo.name}</h1>
        <p className="text-xl text-gray-600 mb-8">{data.personalInfo.title}</p>
        <p className="text-gray-500 max-w-2xl leading-relaxed mb-8">{data.personalInfo.summary}</p>
        <div className="flex gap-4">
            {data.personalInfo.email && <a href={\`mailto:\${data.personalInfo.email}\`} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"><Mail size={20} /></a>}
            {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"><Github size={20} /></a>}
            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"><Linkedin size={20} /></a>}
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-8 pb-20 space-y-20">
        {data.experience && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Experience</h2>
            <div className="space-y-12">
              {data.experience.map((job, index) => (
                <div key={index} className="grid md:grid-cols-[1fr_3fr] gap-4">
                  <div className="text-gray-500 text-sm">{job.startDate} - {job.endDate}</div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">{job.role}</h3>
                    <div className="text-gray-600 mb-4">{job.company}</div>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                       {job.description?.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.projects && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <div key={index} className="border border-gray-100 p-6 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium flex-1">{project.name}</h3>
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900"><ExternalLink size={18} /></a>}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 h-20 overflow-hidden text-ellipsis">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Get in Touch</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl">
             <input type="text" name="name" placeholder="Name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 outline-none" />
             <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 outline-none" />
             <textarea name="message" rows={4} placeholder="Message" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 outline-none resize-none"></textarea>
             <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"><span>Send Message</span><Send size={16} /></button>
          </form>
        </section>
      </main>
      <footer className="py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} {data.personalInfo.name}. All rights reserved.
      </footer>
    </div>
    );`;
      break;
  }

  return imports + commonLogic + jsxContent + `\n};\nexport default Portfolio;`;
}
