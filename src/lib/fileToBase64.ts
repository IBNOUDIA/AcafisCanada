// Shared by KoccBarmaWidget and MentorAISecution: reads a user-attached file
// (image, PDF, or text document) into base64 so it can be sent to /api/mentor
// for Gemini's multimodal document analysis.

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB raw, to stay safely under Vercel's serverless body-size limit once base64-encoded (~+33%).

export interface EncodedFile {
  base64: string;
  mimeType: string;
  name: string;
}

export function readFileAsBase64(file: File): Promise<EncodedFile> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error("Fichier trop volumineux (max 4 Mo)."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; // "data:<mime>;base64,<data>"
      const base64 = result.split(",")[1] || "";
      resolve({ base64, mimeType: file.type || "application/octet-stream", name: file.name });
    };
    reader.onerror = () => reject(reader.error || new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}
