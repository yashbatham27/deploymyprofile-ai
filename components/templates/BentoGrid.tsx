import React from 'react';
import { ResumeData } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Github, Linkedin, Mail, ExternalLink, Send } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const BentoGrid: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-full bg-neutral-100 p-4 md:p-8 font-sans text-neutral-900">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto"
      >
        
        {/* Header Block - Span 2 */}
        <motion.div variants={item} className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-neutral-200">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase">Available for work</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
            </h1>
            <p className="text-xl text-neutral-500 font-medium">
              <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
            </p>
          </div>
          <div className="mt-8">
            <p className="text-neutral-600 leading-relaxed">
              <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
            </p>
          </div>
        </motion.div>

        {/* Socials Block - Span 1 */}
        <motion.div variants={item} className="md:col-span-1 bg-neutral-900 text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-4 shadow-sm min-h-[200px]">
            <div className="flex gap-4">
                {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Github size={24}/></a>}
                {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={24}/></a>}
                {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Mail size={24}/></a>}
            </div>
            <p className="text-sm text-neutral-400">Connect with me</p>
        </motion.div>

        {/* Skills Block - Span 1 */}
        {data.skills && data.skills.length > 0 && (
          <motion.div variants={item} className="md:col-span-1 bg-blue-600 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-lg font-bold mb-4 opacity-90">Core Stack</h3>
              <div className="flex flex-wrap gap-2 content-start">
                  {(data.skills || []).slice(0, 10).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 rounded-md text-sm font-medium backdrop-blur-sm">
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
          </motion.div>
        )}

        {/* Experience Block - Span 2 or 4 depending on content */}
        {data.experience && data.experience.length > 0 && (
          <motion.div variants={item} className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">Experience</h3>
              <div className="space-y-8">
                  {data.experience.map((job, index) => (
                      <div key={index} className="border-l-2 border-neutral-100 pl-4 group hover:border-blue-500 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                               <span className="font-bold text-lg"><EditableField value={job.role} isEditing={isEditing} onSave={(val) => {const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></span>
                               <span className="text-xs text-neutral-400 font-medium bg-neutral-100 px-2 py-1 rounded w-fit mt-1 sm:mt-0"><EditableField value={job.startDate} isEditing={isEditing} onSave={(val) => {const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/></span>
                          </div>
                          <div className="text-blue-600 font-medium mb-2"><EditableField value={job.company} isEditing={isEditing} onSave={(val) => {const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                          <ul className="text-sm text-neutral-600 list-disc list-inside space-y-1">
                              {(job.description || []).slice(0, 3).map((desc, i) => (
                                  <li key={i}><EditableField value={desc} isEditing={isEditing} multiline onSave={(val) => {const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>
          </motion.div>
        )}

         {/* Projects - Span 2 */}
         {data.projects && data.projects.length > 0 && (
           <motion.div variants={item} className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h3 className="text-2xl font-bold mb-6">Selected Work</h3>
              <div className="grid gap-4">
                  {(data.projects || []).slice(0, 3).map((project, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold"><EditableField value={project.name} isEditing={isEditing} onSave={(val) => {const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h4>
                               {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-900"><ExternalLink size={16}/></a>}
                          </div>
                          <div className="text-sm text-neutral-600 mb-2 line-clamp-2"><EditableField value={project.description} isEditing={isEditing} multiline onSave={(val) => {const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/></div>
                          {project.technologies && project.technologies.length > 0 && (
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

         {/* Contact Card - New Addition */}
         <motion.div variants={item} className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Name" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required disabled={isEditing} />
                  <input name="email" type="email" placeholder="Email" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required disabled={isEditing} />
               </div>
               <textarea name="message" rows={3} placeholder="Message" className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none" required disabled={isEditing}></textarea>
               <button type="submit" disabled={isEditing} className="bg-neutral-900 text-white font-bold py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  Send <Send size={16} />
               </button>
            </form>
         </motion.div>
         
      </motion.div>
    </div>
  );
};

export default BentoGrid;