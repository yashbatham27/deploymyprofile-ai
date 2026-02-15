import React from 'react';
import { ResumeData, ThemeColors } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Github, Linkedin, Mail, Send } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
  customColors?: ThemeColors;
}

const Glassmorphism: React.FC<TemplateProps> = ({ 
  data, 
  isEditing = false, 
  onUpdate,
  customColors = { primary: '#6366f1', secondary: '#ec4899' } // Indigo to Pink default
}) => {
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
      className="min-h-full p-8 font-sans text-white overflow-y-auto transition-colors duration-500"
      style={{ background: `linear-gradient(to bottom right, ${customColors.primary}, ${customColors.secondary})` }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-xl text-center">
             <h1 className="text-5xl font-bold mb-2 drop-shadow-md">
                <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
             </h1>
             <p className="text-xl text-white/80 mb-6 font-light tracking-wide">
                <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
             </p>
             <div className="flex justify-center gap-4">
                {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Mail size={20}/></a>}
                {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Github size={20}/></a>}
                {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><Linkedin size={20}/></a>}
             </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar info */}
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">About Me</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
                    </p>
                </div>
                
                {data.skills && data.skills.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10 hover:bg-white/20 transition-colors">
                                    <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                 {data.education && data.education.length > 0 && (
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Education</h3>
                         {data.education.map((edu, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <div className="font-bold"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                <div className="text-sm text-white/70"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
                 {data.experience && data.experience.length > 0 && (
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Experience</h2>
                        <div className="space-y-8">
                            {data.experience.map((job, index) => (
                                <div key={index} className="relative pl-6 border-l border-white/20">
                                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                    <div className="flex flex-col sm:flex-row justify-between mb-1">
                                        <h3 className="text-xl font-semibold"><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                        <span className="text-sm text-white/60"><EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/></span>
                                    </div>
                                    <div className="text-white/80 mb-2 italic"><EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                                    <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                                        {job.description.map((desc, i) => (
                                            <li key={i}><EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
                 
                  {data.projects && data.projects.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Projects</h2>
                        <div className="grid gap-4">
                            {data.projects.map((project, index) => (
                                <div key={index} className="bg-black/20 p-4 rounded-xl hover:bg-black/30 transition-colors">
                                    <h4 className="font-bold text-lg mb-1"><EditableField value={project.name} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h4>
                                    <p className="text-sm text-white/70 mb-2"><EditableField value={project.description} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/></p>
                                </div>
                            ))}
                        </div>
                      </div>
                  )}

                  {/* Contact Form */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-lg">
                     <h2 className="text-2xl font-bold mb-6">Contact Me</h2>
                     <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                           <input name="name" type="text" placeholder="Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors" required disabled={isEditing}/>
                           <input name="email" type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors" required disabled={isEditing}/>
                        </div>
                        <textarea name="message" rows={4} placeholder="Your Message" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-colors resize-none" required disabled={isEditing}></textarea>
                        <button type="submit" disabled={isEditing} className="w-full py-3 bg-white font-bold rounded-lg hover:bg-white/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50" style={{ color: customColors.primary }}>
                           Send Message <Send size={18}/>
                        </button>
                     </form>
                  </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Glassmorphism;