import React from 'react';
import { ResumeData } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Send } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const ClassicSerif: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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
    <div className="min-h-full bg-[#fdfbf7] text-[#2c2c2c] font-serif p-8 md:p-16 overflow-y-auto">
      <div className="max-w-4xl mx-auto border-t-4 border-black pt-12">
        <header className="mb-20 grid md:grid-cols-[2fr_1fr] gap-12 items-end">
             <div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4 tracking-tight">
                    <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
                </h1>
                <p className="text-2xl italic text-neutral-600">
                    <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
                </p>
             </div>
             <div className="text-right font-sans text-sm space-y-1 text-neutral-500">
                {data.personalInfo.email && <div className="hover:text-black transition-colors"><a href={`mailto:${data.personalInfo.email}`}>{data.personalInfo.email}</a></div>}
                {data.personalInfo.linkedin && <div className="hover:text-black transition-colors"><a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
                {data.personalInfo.github && <div className="hover:text-black transition-colors"><a href={data.personalInfo.github} target="_blank" rel="noreferrer">GitHub</a></div>}
                {data.personalInfo.location && <div><EditableField value={data.personalInfo.location} isEditing={isEditing} onSave={(val) => updatePersonalInfo('location', val)} /></div>}
             </div>
        </header>

        <div className="grid md:grid-cols-[1fr_3fr] gap-12 md:gap-24">
            <aside className="space-y-12 font-sans pt-2">
                 <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">About</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">
                        <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
                    </p>
                 </section>

                 {data.skills && data.skills.length > 0 && (
                     <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Expertise</h3>
                        <ul className="text-sm space-y-2 text-neutral-600">
                            {data.skills.map((skill, i) => (
                                <li key={i}>
                                    <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
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
                                <div className="font-bold text-sm"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                <div className="text-xs text-neutral-500 italic"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
                                <div className="text-xs text-neutral-400 mt-1"><EditableField value={edu.year} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].year=val;updateField('education',n)}}/></div>
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
                                        <h3 className="text-xl font-bold"><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                        <span className="text-sm text-neutral-400"><EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/> - <EditableField value={job.endDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].endDate=val;updateField('experience',n)}}/></span>
                                    </div>
                                    <div className="text-lg italic text-neutral-600 mb-4"><EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/></div>
                                    <ul className="space-y-3 font-sans text-neutral-600 leading-relaxed">
                                        {job.description.map((desc, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="text-neutral-300 block mt-2 h-1 w-1 bg-neutral-300 rounded-full shrink-0"></span>
                                                <EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/>
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
                                         <h3 className="text-xl font-bold"><EditableField value={project.name} isEditing={isEditing} onSave={(val)=>{const n=[...data.projects];n[index].name=val;updateField('projects',n)}}/></h3>
                                         {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest border-b border-black hover:bg-black hover:text-white transition-all">View Project</a>}
                                    </div>
                                    <p className="font-sans text-neutral-600 leading-relaxed">
                                        <EditableField value={project.description} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.projects];n[index].description=val;updateField('projects',n)}}/>
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
                            <input name="name" type="text" placeholder="Name" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent" required disabled={isEditing}/>
                            <input name="email" type="email" placeholder="Email" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent" required disabled={isEditing}/>
                        </div>
                        <textarea name="message" rows={4} placeholder="Message" className="w-full border-b border-black py-2 outline-none focus:border-neutral-400 bg-transparent resize-none" required disabled={isEditing}></textarea>
                        <button type="submit" disabled={isEditing} className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50">
                            Send Message <Send size={14} />
                        </button>
                    </form>
                 </section>
            </main>
        </div>
      </div>
    </div>
  );
};

export default ClassicSerif;