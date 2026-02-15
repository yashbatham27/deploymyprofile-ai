import React from 'react';
import { ResumeData, ThemeColors } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Github, Linkedin, Mail, Cpu, Terminal, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
  customColors?: ThemeColors;
}

const Cyberpunk: React.FC<TemplateProps> = ({ 
  data, 
  isEditing = false, 
  onUpdate,
  customColors = { primary: '#00ff41', secondary: '#ff00ff' } 
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
    <div 
        className="min-h-full bg-black p-4 md:p-8 font-mono overflow-y-auto selection:text-black"
        style={{ color: primary }}
    >
      <style>{`
        ::selection {
          background-color: ${primary};
          color: black;
        }
      `}</style>
      <div className="max-w-6xl mx-auto border-2 p-2 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]" style={{ borderColor: primary, boxShadow: `0 0 20px ${primary}40` }}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 -mt-1 -ml-1" style={{ borderColor: primary }}></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 -mt-1 -mr-1" style={{ borderColor: primary }}></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 -mb-1 -ml-1" style={{ borderColor: primary }}></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 -mb-1 -mr-1" style={{ borderColor: primary }}></div>

        <div className="bg-[#050505] p-6 md:p-12 min-h-[calc(100vh-6rem)]">
             <header className="mb-16 border-b pb-8 relative" style={{ borderColor: primary }}>
                 <div className="absolute -top-6 -left-2 text-xs text-black px-2 py-0.5" style={{ backgroundColor: primary }}>NETRUNNER_ID: {data.personalInfo.name.toUpperCase().replace(/\s/g, '_')}</div>
                 <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 glitch-text" 
                    style={{ textShadow: `2px 2px 0px ${secondary}` }}
                 >
                    <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
                 </motion.h1>
                 <div className="text-xl md:text-2xl font-bold mb-6" style={{ color: secondary }}>
                    <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
                 </div>
                 <div className="flex gap-4">
                    {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Github size={20}/></a>}
                    {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Linkedin size={20}/></a>}
                    {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:text-black transition-colors p-2 border" style={{ borderColor: primary }}><Mail size={20}/></a>}
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
                                        style={{ borderColor: `${primary}50` }}
                                        whileHover={{ borderColor: primary }}
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: primary }}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold transition-colors" style={{ color: primary }}><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                            <span className="text-xs border px-2 py-1" style={{ borderColor: primary }}><EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/></span>
                                        </div>
                                        <div className="mb-4 text-sm font-bold uppercase" style={{ color: secondary }}><EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                                        <ul className="list-square list-inside text-sm space-y-2" style={{ color: `${primary}cc` }}>
                                            {job.description.map((desc, i) => (
                                                <li key={i}><span className="mr-2" style={{ color: secondary }}></span><EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
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
                                        whileHover={{ boxShadow: `4px 4px 0px ${secondary}`, borderColor: secondary }}
                                        className="bg-[#050505] border p-6 transition-all"
                                        style={{ borderColor: `${secondary}80`, boxShadow: `4px 4px 0px ${secondary}` }}
                                    >
                                        <h4 className="text-xl font-bold mb-2" style={{ color: secondary }}><EditableField value={project.name} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h4>
                                        <p className="text-sm mb-4 opacity-80"><EditableField value={project.description} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/></p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="text-xs px-2 py-1 border" style={{ backgroundColor: `${secondary}20`, color: secondary, borderColor: `${secondary}50` }}>
                                                    <EditableField value={tech} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].technologies[i]=val;updateField('projects',n)}}/>
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
                        <form onSubmit={handleContactSubmit} className="bg-[#001a05] border p-6 space-y-4 shadow-[4px_4px_0px]" style={{ borderColor: primary, boxShadow: `4px 4px 0px ${primary}` }}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="name" type="text" placeholder="ID_NAME" className="bg-black border px-4 py-2 focus:outline-none" style={{ borderColor: primary, color: primary }} required disabled={isEditing}/>
                                <input name="email" type="email" placeholder="COMMS_LINK" className="bg-black border px-4 py-2 focus:outline-none" style={{ borderColor: primary, color: primary }} required disabled={isEditing}/>
                            </div>
                            <textarea name="message" rows={4} placeholder="DATA_PACKET" className="w-full bg-black border px-4 py-2 focus:outline-none resize-none" style={{ borderColor: primary, color: primary }} required disabled={isEditing}></textarea>
                            <button type="submit" disabled={isEditing} className="w-full text-black font-bold py-3 transition-colors flex justify-center items-center gap-2 disabled:opacity-50" style={{ backgroundColor: primary }}>
                                UPLOAD <Send size={18}/>
                            </button>
                        </form>
                     </section>
                 </div>

                 <aside className="space-y-12">
                      <div className="border p-6 bg-[#001a05]" style={{ borderColor: primary }}>
                         <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: primary, borderColor: primary }}>SYSTEM_SUMMARY</h3>
                         <p className="text-sm leading-relaxed opacity-80">
                             <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
                         </p>
                      </div>

                      {data.skills && data.skills.length > 0 && (
                          <div>
                             <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: secondary, borderColor: secondary }}>INSTALLED_MODULES</h3>
                             <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-xs px-2 py-1 border" style={{ backgroundColor: `${secondary}20`, color: secondary, borderColor: secondary }}>
                                        <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
                                    </span>
                                ))}
                             </div>
                          </div>
                      )}

                      {data.education && data.education.length > 0 && (
                          <div>
                             <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: secondary, borderColor: secondary }}>ACADEMIC_DATA</h3>
                             <div className="space-y-4">
                                 {data.education.map((edu, i) => (
                                     <div key={i}>
                                         <div className="font-bold text-sm"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                         <div className="text-xs opacity-70"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
                                     </div>
                                 ))}
                             </div>
                          </div>
                      )}
                 </aside>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Cyberpunk;