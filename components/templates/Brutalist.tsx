import React from 'react';
import { ResumeData, ThemeColors } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
  customColors?: ThemeColors;
}

const Brutalist: React.FC<TemplateProps> = ({ 
  data, 
  isEditing = false, 
  onUpdate,
  customColors = { primary: '#ff4800', secondary: '#fde047' } // Orange and Yellow default
}) => {
  const { primary, secondary } = customColors;

  const updateField = (section: keyof ResumeData, value: any) => {
    if (onUpdate) onUpdate({ ...data, [section]: value });
  };
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    if (onUpdate) onUpdate({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) return;
    const formData = new FormData(e.currentTarget);
    const subject = `Portfolio Contact from ${formData.get('name')}`;
    const body = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\nMessage:\n${formData.get('message')}`;
    window.location.href = `mailto:${data.personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-full bg-[#f0f0f0] p-4 md:p-8 font-mono text-black overflow-y-auto">
       <motion.div 
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="max-w-6xl mx-auto border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
       >
           <header className="border-b-4 border-black p-8 md:p-16" style={{ backgroundColor: primary }}>
               <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-4 break-words">
                  <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
               </h1>
               <div className="text-2xl md:text-4xl font-bold bg-black text-white inline-block px-4 py-2 transform -rotate-1 hover:rotate-2 transition-transform cursor-default">
                  <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
               </div>
           </header>

           <div className="grid md:grid-cols-[1fr_2fr] divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                {/* Sidebar */}
                <aside className="p-8 space-y-12" style={{ backgroundColor: secondary }}>
                     <section>
                         <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Contact</h2>
                         <div className="space-y-2 text-lg font-bold">
                             {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="block hover:underline truncate hover:translate-x-2 transition-transform">{data.personalInfo.email}</a>}
                             {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="block hover:underline hover:translate-x-2 transition-transform">LinkedIn</a>}
                             {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="block hover:underline hover:translate-x-2 transition-transform">GitHub</a>}
                         </div>
                     </section>

                     {data.skills && data.skills.length > 0 && (
                         <section>
                             <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Skills</h2>
                             <div className="flex flex-wrap gap-2">
                                 {data.skills.map((skill, i) => (
                                     <motion.span 
                                        key={i} 
                                        whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
                                        className="border-2 border-black bg-white px-2 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default"
                                     >
                                         <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
                                     </motion.span>
                                 ))}
                             </div>
                         </section>
                     )}

                     {data.education && data.education.length > 0 && (
                         <section>
                             <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black inline-block">Edu</h2>
                             {data.education.map((edu, i) => (
                                 <div key={i} className="mb-4 border-2 border-black bg-white p-4 hover:bg-black hover:text-white transition-colors">
                                     <div className="font-black text-lg"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                     <div className="font-bold text-sm"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
                                 </div>
                             ))}
                         </section>
                     )}
                </aside>

                {/* Main */}
                <main className="bg-white p-8 md:p-12 space-y-16">
                     {data.experience && data.experience.length > 0 && (
                         <section>
                             <h2 className="text-5xl font-black uppercase mb-8 decoration-4 underline decoration-black underline-offset-8">Experience</h2>
                             <div className="space-y-12">
                                 {data.experience.map((job, index) => (
                                     <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                     >
                                         <div className="border-4 border-black p-6 hover:bg-black hover:text-white transition-colors group shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1">
                                             <div className="flex flex-col md:flex-row justify-between mb-4 border-b-4 border-black group-hover:border-white pb-4">
                                                  <div>
                                                      <h3 className="text-2xl font-black uppercase"><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                                      <div className="text-xl font-bold"><EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                                                  </div>
                                                  <div className="text-lg font-bold">
                                                      <EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/> - <EditableField value={job.endDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].endDate=val;updateField('experience',n)}}/>
                                                  </div>
                                             </div>
                                             <ul className="list-disc list-inside font-medium space-y-2">
                                                 {job.description.map((desc, i) => (
                                                     <li key={i}><EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
                                                 ))}
                                             </ul>
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                         </section>
                     )}

                     {data.projects && data.projects.length > 0 && (
                         <section>
                             <h2 className="text-5xl font-black uppercase mb-8 decoration-4 underline decoration-black underline-offset-8">Projects</h2>
                             <div className="grid gap-8">
                                 {data.projects.map((project, index) => (
                                     <motion.div 
                                        key={index} 
                                        whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                                        className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                                        style={{ backgroundColor: `${primary}40` }} // Using semi-transparent primary
                                     >
                                         <h3 className="text-2xl font-black uppercase mb-2"><EditableField value={project.name} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h3>
                                         <p className="font-bold mb-4 border-t-4 border-black pt-4">
                                             <EditableField value={project.description} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/>
                                         </p>
                                         <div className="flex flex-wrap gap-2">
                                             {project.technologies.map((tech, i) => (
                                                 <span key={i} className="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold">
                                                     <EditableField value={tech} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].technologies[i]=val;updateField('projects',n)}}/>
                                                 </span>
                                             ))}
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                         </section>
                     )}
                     
                     <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-4xl font-black uppercase mb-6">Drop a Message</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                           <div className="grid md:grid-cols-2 gap-4">
                              <input 
                                name="name" 
                                type="text" 
                                placeholder="NAME" 
                                className="border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all focus:bg-[var(--focus-bg)]" 
                                style={{ '--focus-bg': secondary } as React.CSSProperties} 
                                required 
                                disabled={isEditing}
                              />
                              <input 
                                name="email" 
                                type="email" 
                                placeholder="EMAIL" 
                                className="border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all focus:bg-[var(--focus-bg)]" 
                                style={{ '--focus-bg': secondary } as React.CSSProperties} 
                                required 
                                disabled={isEditing}
                              />
                           </div>
                           <textarea 
                              name="message" 
                              rows={4} 
                              placeholder="WHAT'S UP?" 
                              className="w-full border-4 border-black p-3 font-bold placeholder-black uppercase focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-all resize-none focus:bg-[var(--focus-bg)]" 
                              style={{ '--focus-bg': secondary } as React.CSSProperties} 
                              required 
                              disabled={isEditing}
                            ></textarea>
                           <button 
                              type="submit" 
                              disabled={isEditing} 
                              className="bg-black text-white font-black uppercase px-8 py-4 hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 w-full justify-center disabled:opacity-50 hover:bg-[var(--hover-bg)]" 
                              style={{ '--hover-bg': primary } as React.CSSProperties}
                           >
                              SEND IT <Send size={24}/>
                           </button>
                        </form>
                     </section>
                </main>
           </div>
       </motion.div>
    </div>
  );
};

export default Brutalist;