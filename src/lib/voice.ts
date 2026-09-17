// Shared Web Speech API helpers for KoccBarmaWidget and MentorAISecution.
// Not fully typed in the default DOM lib — narrow "any" casts keep this
// optional, progressively-enhanced feature isolated to these small helpers.

export const getSpeechRecognitionCtor = (): any =>
  typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

export const isTtsSupported = (): boolean => typeof window !== "undefined" && "speechSynthesis" in window;

// Rough heuristic to pick a voice that actually pronounces the reply well —
// no browser ships a Wolof voice, so Wolof text falls back to the French voice.
export const detectSpeechLang = (text: string): string => {
  const lower = text.toLowerCase();
  const englishHits = [" the ", " you ", " is ", " are ", "hello", "thank", "school"].filter((m) =>
    lower.includes(m)
  ).length;
  return englishHits > 0 ? "en-US" : "fr-CA";
};
