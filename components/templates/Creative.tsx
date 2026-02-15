import React from 'react';
import { ResumeData, ThemeColors } from '../../types';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, GraduationCap, Send, Link as LinkIcon } from 'lucide-react';
import { EditableField } from '../ui/EditableField';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
  customColors?: ThemeColors;
}

const Creative: React.FC<TemplateProps> = ({ 
  data, 
  isEditing = false, 
  onUpdate,
  customColors = { primary: '#a855f7', secondary: '#3b82f6' } 
}) => {
  const primaryColor = customColors.primary;
  const secondaryColor = customColors.secondary;

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
    <div className="w-full min-h-full bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-white/30 selection:text-white overflow-y-auto relative">
       {/* Background Blobs with Dynamic Colors */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] transition-colors duration-500" 
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-500" 
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
                  style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                >
                  <EditableField 
                    value={data.personalInfo.name} 
                    isEditing={isEditing} 
                    onSave={(val) => updatePersonalInfo('name', val)}
                  />
                </span>
             </div>

             <div className="text-2xl md:text-3xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
               <EditableField 
                  value={data.personalInfo.title} 
                  isEditing={isEditing} 
                  onSave={(val) => updatePersonalInfo('title', val)}
                />
             </div>
             
             <div className="text-slate-400 max-w-lg mx-auto mb-10">
               <EditableField 
                  value={data.personalInfo.summary} 
                  isEditing={isEditing} 
                  multiline
                  onSave={(val) => updatePersonalInfo('summary', val)}
                />
             </div>
             
             <div className="flex justify-center gap-6 flex-wrap">
                {/* Social Links Editing */}
                {isEditing ? (
                   <div className="flex flex-col gap-2 w-full max-w-md mx-auto bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm border border-slate-700">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Edit Social Links</div>
                      <input 
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-full" 
                        placeholder="GitHub URL"
                        value={data.personalInfo.github || ''}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      />
                      <input 
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-full" 
                        placeholder="LinkedIn URL"
                        value={data.personalInfo.linkedin || ''}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      />
                      <input 
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-full" 
                        placeholder="Email Address"
                        value={data.personalInfo.email || ''}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      />
                   </div>
                ) : (
                  <>
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
                       <a href={`mailto:${data.personalInfo.email}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-sm">
                          <Mail size={24} />
                       </a>
                    )}
                  </>
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
                        initial={!isEditing ? { opacity: 0, x: -20 } : {}}
                        whileInView={!isEditing ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors"
                        style={{ borderColor: isEditing ? primaryColor : undefined }}
                     >
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                           <div className="w-full">
                              <div className="text-2xl font-bold text-white">
                                <EditableField 
                                  value={job.role} 
                                  isEditing={isEditing} 
                                  onSave={(val) => {
                                    const newExp = [...data.experience];
                                    newExp[index] = { ...newExp[index], role: val };
                                    updateField('experience', newExp);
                                  }}
                                />
                              </div>
                              <div style={{ color: primaryColor }}>
                                <EditableField 
                                  value={job.company} 
                                  isEditing={isEditing} 
                                  onSave={(val) => {
                                    const newExp = [...data.experience];
                                    newExp[index] = { ...newExp[index], company: val };
                                    updateField('experience', newExp);
                                  }}
                                />
                              </div>
                           </div>
                           <div className="text-slate-400 text-sm mt-2 md:mt-0 whitespace-nowrap">
                              <EditableField 
                                  value={job.startDate} 
                                  isEditing={isEditing} 
                                  onSave={(val) => {
                                    const newExp = [...data.experience];
                                    newExp[index] = { ...newExp[index], startDate: val };
                                    updateField('experience', newExp);
                                  }}
                                  className="inline-block w-auto min-w-[60px]"
                                />
                                {' — '}
                                <EditableField 
                                  value={job.endDate} 
                                  isEditing={isEditing} 
                                  onSave={(val) => {
                                    const newExp = [...data.experience];
                                    newExp[index] = { ...newExp[index], endDate: val };
                                    updateField('experience', newExp);
                                  }}
                                  className="inline-block w-auto min-w-[60px]"
                                />
                           </div>
                        </div>
                        <ul className="space-y-2 text-slate-300 w-full">
                           {job.description?.map((desc, i) => (
                              <li key={i} className="flex items-start gap-2">
                                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: secondaryColor }} />
                                 <div className="flex-1">
                                   <EditableField 
                                      value={desc} 
                                      isEditing={isEditing} 
                                      multiline
                                      onSave={(val) => {
                                        const newExp = [...data.experience];
                                        newExp[index].description[i] = val;
                                        updateField('experience', newExp);
                                      }}
                                    />
                                 </div>
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
                        whileHover={!isEditing ? { y: -10 } : {}}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col"
                     >
                        <div className="p-6 h-full flex flex-col">
                           <div className="flex justify-between items-start mb-4">
                              <div className="text-xl font-bold flex-1 mr-2">
                                <EditableField 
                                  value={project.name} 
                                  isEditing={isEditing} 
                                  onSave={(val) => {
                                    const newProjects = [...data.projects];
                                    newProjects[index] = { ...newProjects[index], name: val };
                                    updateField('projects', newProjects);
                                  }}
                                />
                              </div>
                              
                              {isEditing ? (
                                <div className="relative group">
                                  <LinkIcon size={20} className="text-slate-500" />
                                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 p-2 rounded shadow-xl border border-slate-700 z-50">
                                     <input 
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-1 text-xs text-white"
                                        placeholder="Project Link"
                                        value={project.link || ''}
                                        onChange={(e) => {
                                            const newProjects = [...data.projects];
                                            newProjects[index] = { ...newProjects[index], link: e.target.value };
                                            updateField('projects', newProjects);
                                        }}
                                     />
                                  </div>
                                </div>
                              ) : (
                                 project.link && (
                                  <a href={project.link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: primaryColor }}>
                                    <ExternalLink size={20}/>
                                  </a>
                                 )
                              )}
                           </div>
                           <div className="text-slate-400 text-sm mb-6 flex-grow">
                              <EditableField 
                                  value={project.description} 
                                  isEditing={isEditing} 
                                  multiline
                                  onSave={(val) => {
                                    const newProjects = [...data.projects];
                                    newProjects[index] = { ...newProjects[index], description: val };
                                    updateField('projects', newProjects);
                                  }}
                                />
                           </div>
                           <div className="flex flex-wrap gap-2 mt-auto">
                              {project.technologies?.map((tech, i) => (
                                 <span key={i} className="text-xs font-bold text-slate-900 bg-slate-200 px-2 py-1 rounded">
                                    <EditableField 
                                      value={tech} 
                                      isEditing={isEditing} 
                                      onSave={(val) => {
                                        const newProjects = [...data.projects];
                                        newProjects[index].technologies[i] = val;
                                        updateField('projects', newProjects);
                                      }}
                                    />
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
                           <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                              <GraduationCap size={24} />
                           </div>
                           <div className="flex-1">
                              <div className="text-xl font-bold">
                                 <EditableField 
                                    value={edu.school} 
                                    isEditing={isEditing} 
                                    onSave={(val) => {
                                      const newEdu = [...data.education];
                                      newEdu[index] = { ...newEdu[index], school: val };
                                      updateField('education', newEdu);
                                    }}
                                  />
                              </div>
                              <div className="text-slate-300">
                                 <EditableField 
                                    value={edu.degree} 
                                    isEditing={isEditing} 
                                    onSave={(val) => {
                                      const newEdu = [...data.education];
                                      newEdu[index] = { ...newEdu[index], degree: val };
                                      updateField('education', newEdu);
                                    }}
                                  />
                              </div>
                              <div className="text-slate-500 text-sm">
                                 <EditableField 
                                    value={edu.year} 
                                    isEditing={isEditing} 
                                    onSave={(val) => {
                                      const newEdu = [...data.education];
                                      newEdu[index] = { ...newEdu[index], year: val };
                                      updateField('education', newEdu);
                                    }}
                                  />
                              </div>
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
                          style={!isEditing ? { borderColor: 'transparent' } : { borderColor: secondaryColor }}
                        >
                           <EditableField 
                              value={skill} 
                              isEditing={isEditing} 
                              onSave={(val) => {
                                const newSkills = [...data.skills];
                                newSkills[i] = val;
                                updateField('skills', newSkills);
                              }}
                            />
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
                            <input name="name" type="text" required className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600" disabled={isEditing} />
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                            <label className="text-xs text-slate-400 ml-2 block">Email</label>
                            <input name="email" type="email" required className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600" disabled={isEditing} />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2">
                        <label className="text-xs text-slate-400 ml-2 block">Message</label>
                        <textarea name="message" required rows={4} className="w-full bg-transparent px-2 py-1 outline-none text-white placeholder-slate-600 resize-none" disabled={isEditing}></textarea>
                    </div>
                    <motion.button 
                        whileHover={!isEditing ? { scale: 1.02 } : {}}
                        whileTap={!isEditing ? { scale: 0.98 } : {}}
                        type="submit" 
                        disabled={isEditing}
                        className="w-full text-white font-bold py-3 rounded-lg shadow-lg transition-shadow flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          boxShadow: !isEditing ? `0 10px 15px -3px ${primaryColor}40` : 'none'
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
  );
};

export default Creative;