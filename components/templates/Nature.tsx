import React from 'react';
import { ResumeData } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Leaf, Mail, Linkedin, Github, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const Nature: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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
                  <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
              </h1>
              <p className="text-xl text-[#588157] font-medium mb-6">
                  <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
              </p>
              <div className="flex gap-4">
                  {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="p-2 rounded-full bg-[#a3b18a]/20 text-[#344e41] hover:bg-[#a3b18a]/40 transition-colors"><Mail size={18}/></a>}
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
                             <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
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
                                        <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
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
                                        <div className="font-bold text-[#344e41]"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                        <div className="text-sm text-[#588157]"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
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
                                              <h3 className="text-xl font-bold text-[#344e41]"><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                              <span className="text-sm font-medium text-[#588157] bg-[#e9edc9]/50 px-2 py-1 rounded"><EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/></span>
                                         </div>
                                         <div className="text-lg font-serif italic text-[#588157] mb-3"><EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                                         <ul className="space-y-2 text-sm text-[#3a4a3b] list-disc list-inside marker:text-[#a3b18a]">
                                             {job.description.map((desc, i) => (
                                                 <li key={i}><EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
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
                                         <h3 className="text-xl font-bold text-[#344e41] mb-2"><EditableField value={project.name} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h3>
                                         <p className="text-sm text-[#3a4a3b] mb-4"><EditableField value={project.description} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/></p>
                                         <div className="flex flex-wrap gap-2">
                                             {project.technologies.map((tech, i) => (
                                                 <span key={i} className="text-xs text-[#588157] border border-[#a3b18a] px-2 py-1 rounded-full">
                                                     <EditableField value={tech} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].technologies[i]=val;updateField('projects',n)}}/>
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
                                <input name="name" type="text" placeholder="Your Name" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157]" required disabled={isEditing}/>
                                <input name="email" type="email" placeholder="Your Email" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157]" required disabled={isEditing}/>
                            </div>
                            <textarea name="message" rows={4} placeholder="Your Message" className="w-full bg-[#f4f1ea] border border-[#dad7cd] px-4 py-2 rounded-lg text-[#344e41] outline-none focus:border-[#588157] resize-none" required disabled={isEditing}></textarea>
                            <button type="submit" disabled={isEditing} className="bg-[#588157] text-white px-6 py-2 rounded-lg hover:bg-[#344e41] transition-colors flex items-center gap-2 disabled:opacity-50">
                                Send Message <Send size={16}/>
                            </button>
                        </form>
                    </motion.section>
               </div>
          </div>
      </div>
    </div>
  );
};

export default Nature;