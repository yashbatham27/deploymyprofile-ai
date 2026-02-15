import React from 'react';
import { ResumeData } from '../../types';
import { EditableField } from '../ui/EditableField';
import { Send } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
}

const ResumeFirst: React.FC<TemplateProps> = ({ data, isEditing = false, onUpdate }) => {
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
    <div className="min-h-full bg-white text-slate-900 font-sans p-8 md:p-12 overflow-y-auto">
      <div className="max-w-[21cm] mx-auto bg-white shadow-lg md:min-h-[29.7cm] p-8 md:p-12">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
                  <EditableField value={data.personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
              </h1>
              <p className="text-lg text-slate-600 font-medium mb-4">
                  <EditableField value={data.personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />
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
                  <EditableField value={data.personalInfo.summary} isEditing={isEditing} multiline onSave={(val) => updatePersonalInfo('summary', val)} />
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
                                  <h3><EditableField value={job.role} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].role=val;updateField('experience',n)}}/></h3>
                                  <span className="text-sm"><EditableField value={job.startDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].startDate=val;updateField('experience',n)}}/> – <EditableField value={job.endDate} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].endDate=val;updateField('experience',n)}}/></span>
                              </div>
                              <div className="text-sm font-semibold text-slate-600 mb-2">
                                  <EditableField value={job.company} isEditing={isEditing} onSave={(val)=>{const n=[...data.experience];n[index].company=val;updateField('experience',n)}}/>
                              </div>
                              <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                                  {job.description.map((desc, i) => (
                                      <li key={i}><EditableField value={desc} isEditing={isEditing} multiline onSave={(val)=>{const n=[...data.experience];n[index].description[i]=val;updateField('experience',n)}}/></li>
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
                                  <EditableField value={skill} isEditing={isEditing} onSave={(val) => {const n=[...data.skills];n[i]=val;updateField('skills',n)}} />
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
                                  <div className="font-bold text-sm text-slate-800"><EditableField value={edu.school} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].school=val;updateField('education',n)}}/></div>
                                  <div className="text-sm text-slate-700"><EditableField value={edu.degree} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].degree=val;updateField('education',n)}}/></div>
                                  <div className="text-xs text-slate-500"><EditableField value={edu.year} isEditing={isEditing} onSave={(val)=>{const n=[...data.education];n[i].year=val;updateField('education',n)}}/></div>
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
                   <input name="name" type="text" placeholder="Your Name" className="w-full border border-slate-300 p-2 text-sm rounded" required disabled={isEditing}/>
                   <input name="email" type="email" placeholder="Your Email" className="w-full border border-slate-300 p-2 text-sm rounded" required disabled={isEditing}/>
                </div>
                <textarea name="message" rows={3} placeholder="Your Message" className="w-full border border-slate-300 p-2 text-sm rounded resize-none" required disabled={isEditing}></textarea>
                <button type="submit" disabled={isEditing} className="w-fit bg-slate-900 text-white px-4 py-2 text-sm font-medium rounded hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50">
                    Send Inquiry <Send size={14}/>
                </button>
             </form>
          </section>
      </div>
    </div>
  );
};

export default ResumeFirst;