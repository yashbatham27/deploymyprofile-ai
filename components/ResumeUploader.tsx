
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, Clock, Lightbulb } from 'lucide-react';
import { parseResumeWithGemini } from '../services/geminiService';
import { ResumeData } from '../types';

interface ResumeUploaderProps {
  onUploadComplete: (data: ResumeData) => void;
}

const TRIVIA_FACTS = [
  "Recruiters spend an average of only 7 seconds scanning a resume.",
  "The first resume was written by Leonardo da Vinci in 1482.",
  "75% of resumes are rejected by ATS (Applicant Tracking Systems) before a human sees them.",
  "The global AI market is projected to reach $407 billion by 2027.",
  "Python is currently the most requested language for AI and Data Science roles.",
  "Including a professional summary can increase your interview chances by 20%.",
  "The 'World Wide Web' was invented by Tim Berners-Lee in 1989.",
  "Remote work listings have increased by 350% since 2020.",
  "Soft skills are listed in 91% of job postings alongside technical skills.",
  "Blockchain technology is now being used to verify academic credentials."
];

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    let triviaInterval: any;

    if (isProcessing) {
      setProgress(0);
      setTriviaIndex(Math.floor(Math.random() * TRIVIA_FACTS.length));
      
      // Progress bar logic: Fast at first, slows down as it approaches 90%
      interval = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 90) return 90; // Stall at 90% until actually done
            const remaining = 90 - prev;
            const increment = Math.max(0.5, remaining * 0.1); // Asymptotic approach
            return prev + increment;
        });
      }, 500);

      // Rotate trivia every 4 seconds
      triviaInterval = setInterval(() => {
        setTriviaIndex((prev) => (prev + 1) % TRIVIA_FACTS.length);
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(triviaInterval);
    };
  }, [isProcessing]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file format. Please upload a PDF, PNG, or JPG.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        setError('File is too large. Please upload a file smaller than 5MB.');
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const data = await parseResumeWithGemini(base64String, file.type);
          setProgress(100); // Complete!
          setTimeout(() => onUploadComplete(data), 500); // Short delay to show 100%
        } catch (err: any) {
          let message = 'AI Parsing failed. Please ensure the resume is readable.';
          if (err.message.includes('Quota Exceeded')) {
            message = 'Our AI service is currently busy. Please try again in a few seconds.';
          } else if (err.message.includes('No text returned')) {
             message = 'Could not extract text from this document. Try a clearer PDF or Image.';
          }
          setError(message);
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file from your device.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('An unexpected system error occurred.');
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out text-center cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }
          ${isProcessing ? 'pointer-events-none border-blue-200 bg-blue-50/20' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          {isProcessing ? (
            <>
              <div className="relative mb-2">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <div className="space-y-4 w-full max-w-md">
                <div className="flex justify-between text-sm text-slate-600 font-medium">
                    <span>Analyzing Resume...</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                {/* Trivia Section */}
                <div className="mt-6 bg-white/60 p-4 rounded-lg border border-slate-100 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500 key={triviaIndex}">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                        <Lightbulb size={12} />
                        <span>Did you know?</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-snug">
                        {TRIVIA_FACTS[triviaIndex]}
                    </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-white rounded-full shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-700">
                  Drop your resume PDF here
                </p>
                <p className="text-sm text-slate-500">
                  or click to browse files
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">Upload Error</span>
            {error}
          </div>
        </div>
      )}
      
      {!isProcessing && (
        <div className="mt-6 flex gap-4 justify-center text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileText size={12}/> PDF, PNG, JPG</span>
            <span>•</span>
            <span>Max 5MB</span>
            <span>•</span>
            <span>Gemini 3 Flash</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
