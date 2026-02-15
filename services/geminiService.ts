import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema definition for the resume data to ensure structured JSON output
const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["name", "email", "summary"],
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
        },
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING },
        },
      },
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          link: { type: Type.STRING },
        },
      },
    },
  },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const parseResumeWithGemini = async (base64Data: string, mimeType: string): Promise<ResumeData> => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: `You are an expert resume parser. Your sole purpose is to extract structured data from the provided resume document (PDF/Image) and output it as a valid JSON object matching the schema.

              **CRITICAL EXTRACTION RULES:**
              
              1. **PARSE THE ENTIRE DOCUMENT:** Do not stop at the first page. Process every visible section.
              
              2. **SECTION DETECTION:**
                 - **Experience:** Look for "Professional Experience", "Work History", "Experience", "Employment", or similar headers.
                   - Extract *every* job entry.
                   - **Description:** Convert *each* bullet point in the resume into a string in the 'description' array. Do not summarize. Copy the text exactly.
                 - **Projects:** Look for "Projects", "Key Projects", "Academic Projects".
                   - Extract project Name.
                   - Combine description bullet points into a single summary string for 'description'.
                   - Extract specific tools/languages mentioned (e.g., "React", "Node.js") into 'technologies'.
                 - **Education:** Look for "Education", "Academic Background". Extract School, Degree, and Year (e.g., "2019 - 2023").
                 - **Skills:** Look for "Technical Skills", "Skills", "Core Concepts". Collect all distinct skills into a flat array.
              
              3. **PERSONAL INFO:**
                 - Extract Name (usually at the top).
                 - Extract Title (if explicitly stated, otherwise infer from the most recent role or summary).
                 - Extract Email, Phone, LinkedIn, GitHub, Location.
                 - **Summary:** Look for "Professional Summary", "About", "Profile". If not present, generate a concise professional summary based on the candidate's skills and experience.

              4. **NO HALLUCINATIONS:** Only extract what is present in the document. If a field is missing, leave it as an empty string or null, but do not invent data. However, *do not* return empty arrays for Experience, Education, or Projects if the text is clearly present in the document.

              5. **FORMATTING:**
                 - Dates: Keep them as they appear (e.g., "Jul 2023 - Present").
                 - Links: Ensure URLs are fully formed (e.g., https://...).
              `,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: resumeSchema,
          temperature: 0.1, // Slight temperature to allow for flexible text interpretation while keeping structure
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as ResumeData;
      } else {
        throw new Error("No text returned from Gemini.");
      }
    } catch (error: any) {
      console.error(`Gemini Parsing Attempt ${attempt + 1} Error:`, error);
      
      // Check for 429 or Resource exhausted error
      const isResourceExhausted = 
        error?.status === 429 || 
        error?.code === 429 || 
        (error?.error && error.error.code === 429) ||
        JSON.stringify(error).includes("Resource exhausted");

      if (isResourceExhausted && attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500; // Exponential backoff with jitter
        console.warn(`Resource exhausted. Retrying in ${Math.round(waitTime)}ms...`);
        await delay(waitTime);
        attempt++;
        continue;
      }

      if (isResourceExhausted) {
         throw new Error("Service is currently busy (Quota Exceeded). Please try again in a few moments.");
      }
      
      throw new Error("Failed to parse resume. Please ensure the file is readable.");
    }
  }
  throw new Error("Failed to parse resume after multiple attempts.");
};