import React from 'react';
import { ResumeData } from '../../types';
import { Github, Linkedin, Mail, ExternalLink, Send, Link as LinkIcon } from 'lucide-react';
import { EditableField } from '../ui/EditableField';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const Minimalist: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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
    <div className="w-full min-h-full bg-white text-gray-900 font-sans selection:bg-gray-200 overflow-y-auto">
      <header className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-serif font-bold mb-4">
          <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
        </p>
        <div className="text-gray-500 max-w-2xl leading-relaxed mb-8">
          <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
        </div>
        
        <div className="flex gap-4">
           {isEditing ? (
              <div className="flex flex-col gap-2 w-full max-w-sm bg-gray-50 p-4 rounded border border-gray-200">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Edit Social Links</div>
                <input 
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-full" 
                  placeholder="GitHub URL"
                  value={data.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                />
                <input 
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-full" 
                  placeholder="LinkedIn URL"
                  value={data.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                />
                <input 
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-full" 
                  placeholder="Email Address"
                  value={data.personalInfo.email || ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
              </div>
           ) : (
             <>
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
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
             </>
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
                     <EditableField 
                        value={job.startDate} 
                        isEditing={isEditing} 
                        onSave={(val) => {
                          const newExp = [...data.experience];
                          newExp[index] = { ...newExp[index], startDate: val };
                          updateField('experience', newExp);
                        }}
                     />
                     {' - '}
                     <EditableField 
                        value={job.endDate} 
                        isEditing={isEditing} 
                        onSave={(val) => {
                          const newExp = [...data.experience];
                          newExp[index] = { ...newExp[index], endDate: val };
                          updateField('experience', newExp);
                        }}
                     />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">
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
                    <div className="text-gray-600 mb-4">
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
                    <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                       {job.description?.map((desc, i) => (
                         <li key={i}>
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
                    <h3 className="text-lg font-medium flex-1">
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
                          <LinkIcon size={18} className="text-gray-400" />
                           <div className="absolute right-0 top-full mt-2 w-48 bg-white p-2 rounded shadow-xl border border-gray-200 z-50">
                              <input 
                                className="w-full border border-gray-300 rounded px-1 text-xs"
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
                        <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900">
                          <ExternalLink size={18} />
                        </a>
                      )
                    )}
                  </div>
                  <div className="text-gray-600 text-sm mb-6 h-20 overflow-hidden text-ellipsis">
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
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
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
        
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                 <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-medium">
                         <EditableField 
                          value={edu.school} 
                          isEditing={isEditing} 
                          onSave={(val) => {
                            const newEdu = [...data.education];
                            newEdu[index] = { ...newEdu[index], school: val };
                            updateField('education', newEdu);
                          }}
                       />
                      </h3>
                      <span className="text-sm text-gray-500">
                         <EditableField 
                          value={edu.year} 
                          isEditing={isEditing} 
                          onSave={(val) => {
                            const newEdu = [...data.education];
                            newEdu[index] = { ...newEdu[index], year: val };
                            updateField('education', newEdu);
                          }}
                       />
                      </span>
                    </div>
                    <div className="text-gray-600">
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

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-2">Get in Touch</h2>
          <div className="max-w-xl">
             <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                   <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all" disabled={isEditing}/>
                </div>
                <div>
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input type="email" name="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all" disabled={isEditing}/>
                </div>
                <div>
                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                   <textarea name="message" required rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none transition-all resize-none" disabled={isEditing}></textarea>
                </div>
                <button type="submit" disabled={isEditing} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
  );
};

export default Minimalist;