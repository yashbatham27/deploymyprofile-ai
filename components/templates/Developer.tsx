import React from 'react';
import { ResumeData } from '../../types';
import { Github, Linkedin, Mail, ExternalLink, Terminal, Code, Briefcase, GraduationCap, Send, Link as LinkIcon } from 'lucide-react';
import { EditableField } from '../ui/EditableField';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const Developer: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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
    <div className="w-full min-h-full bg-[#0d1117] text-[#c9d1d9] font-mono selection:bg-[#238636] selection:text-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <header className="mb-20">
           <div className="text-[#238636] mb-4">User: ~/portfolio/{data.personalInfo.name.toLowerCase().replace(/\s/g, '-')}</div>
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
             <span className="text-[#238636] mr-4">&gt;</span>
             <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
           </h1>
           <div className="text-xl text-[#8b949e] border-l-2 border-[#30363d] pl-4 mb-8">
             <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
             {' // '}
             <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
           </div>
           
           <div className="flex gap-6 text-[#8b949e]">
             {isEditing ? (
                <div className="flex flex-col gap-2 w-full max-w-sm bg-[#161b22] p-4 rounded border border-[#30363d]">
                   <div className="text-xs text-[#8b949e] uppercase tracking-wider mb-2">// Edit Social Links</div>
                   <input 
                     className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-sm text-[#c9d1d9] w-full" 
                     placeholder="GitHub URL"
                     value={data.personalInfo.github || ''}
                     onChange={(e) => updatePersonalInfo('github', e.target.value)}
                   />
                   <input 
                     className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-sm text-[#c9d1d9] w-full" 
                     placeholder="LinkedIn URL"
                     value={data.personalInfo.linkedin || ''}
                     onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                   />
                   <input 
                     className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-sm text-[#c9d1d9] w-full" 
                     placeholder="Email Address"
                     value={data.personalInfo.email || ''}
                     onChange={(e) => updatePersonalInfo('email', e.target.value)}
                   />
                </div>
             ) : (
                <>
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
                   <a href={`mailto:${data.personalInfo.email}`} className="hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                     <Mail size={18} /> <span>email</span>
                   </a>
                 )}
                </>
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
                        <h3 className="text-xl text-[#58a6ff] font-bold">
                          <EditableField 
                              value={job.role} 
                              isEditing={isEditing} 
                              onSave={(val) => {
                                const newExp = [...data.experience];
                                newExp[index] = { ...newExp[index], role: val };
                                updateField('experience', newExp);
                              }}
                           />
                        </h3>
                        <span className="text-sm text-[#8b949e] font-mono">
                           [
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
                           {' : '}
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
                           ]
                        </span>
                      </div>
                      <div className="text-[#79c0ff] mb-4">
                          @
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
                      <ul className="space-y-2 text-[#c9d1d9] text-sm">
                        {job.description?.map((desc, i) => (
                           <li key={i} className="flex items-start">
                              <span className="mr-2 text-[#30363d]">$</span> 
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
                            <EditableField 
                              value={project.name} 
                              isEditing={isEditing} 
                              onSave={(val) => {
                                const newProjs = [...data.projects];
                                newProjs[index] = { ...newProjs[index], name: val };
                                updateField('projects', newProjs);
                              }}
                           />
                         </h3>
                         
                         {isEditing ? (
                            <div className="relative group ml-2">
                              <LinkIcon size={16} className="text-[#8b949e]" />
                               <div className="absolute right-0 top-full mt-2 w-48 bg-[#161b22] p-2 rounded shadow-xl border border-[#30363d] z-50">
                                  <input 
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-1 text-xs text-[#c9d1d9]"
                                    placeholder="Project Link"
                                    value={project.link || ''}
                                    onChange={(e) => {
                                        const newProjs = [...data.projects];
                                        newProjs[index] = { ...newProjs[index], link: e.target.value };
                                        updateField('projects', newProjs);
                                    }}
                                 />
                              </div>
                            </div>
                         ) : (
                           project.link && (
                             <a href={project.link} target="_blank" rel="noreferrer" className="text-[#8b949e] hover:text-white">
                               <ExternalLink size={16} />
                             </a>
                           )
                         )}
                      </div>
                      <div className="text-sm text-[#8b949e] mb-6 h-16 overflow-hidden">
                         <EditableField 
                              value={project.description} 
                              isEditing={isEditing} 
                              multiline
                              onSave={(val) => {
                                const newProjs = [...data.projects];
                                newProjs[index] = { ...newProjs[index], description: val };
                                updateField('projects', newProjs);
                              }}
                           />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech, i) => (
                          <span key={i} className="text-xs text-[#238636] border border-[#238636] px-2 py-0.5 rounded-full">
                             <EditableField 
                              value={tech} 
                              isEditing={isEditing} 
                              onSave={(val) => {
                                const newProjs = [...data.projects];
                                newProjs[index].technologies[i] = val;
                                updateField('projects', newProjs);
                              }}
                           />
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
                            <div className="text-[#c9d1d9] font-bold">
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
                            <div className="text-[#79c0ff] text-sm">
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
                            <div className="text-[#8b949e] text-xs mt-2">
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
                               <span className="mx-1">
                                 <EditableField 
                                    value={skill.replace(/\s/g, '_')} 
                                    isEditing={isEditing} 
                                    onSave={(val) => {
                                      const newSkills = [...data.skills];
                                      newSkills[i] = val;
                                      updateField('skills', newSkills);
                                    }}
                                 />
                               </span>
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
                       <input name="name" type="text" required placeholder="const name = '...'" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none" disabled={isEditing}/>
                    </div>
                    <div className="flex flex-col">
                       <label className="text-[#8b949e] mb-1">// Enter your email</label>
                       <input name="email" type="email" required placeholder="const email = '...'" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none" disabled={isEditing}/>
                    </div>
                    <div className="flex flex-col">
                       <label className="text-[#8b949e] mb-1">// Enter your message</label>
                       <textarea name="message" required rows={4} placeholder="/* Message */" className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none resize-none" disabled={isEditing}></textarea>
                    </div>
                    <button type="submit" disabled={isEditing} className="bg-[#238636] text-white px-4 py-2 rounded hover:bg-[#2ea043] transition-colors flex items-center gap-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed">
                       <Send size={14} />
                       <span>git push message</span>
                    </button>
                 </div>
             </form>
           </section>
        </main>
      </div>
    </div>
  );
};

export default Developer;