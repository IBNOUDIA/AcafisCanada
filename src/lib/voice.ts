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

// Voices load asynchronously in most browsers (empty on first call, populated
// once the "voiceschanged" event fires) — this waits for that, with a timeout
// fallback for browsers that never fire the event.
let cachedVoices: SpeechSynthesisVoice[] = [];
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isTtsSupported()) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    const onVoicesChanged = () => {
      cachedVoices = synth.getVoices();
      resolve(cachedVoices);
    };
    synth.addEventListener("voiceschanged", onVoicesChanged, { once: true });
    setTimeout(() => resolve(synth.getVoices()), 500);
  });
}

// Kocc Barma is portrayed as a wise elder — prefer a male-sounding voice when
// the browser/OS offers one for the target language. Voice availability is
// entirely platform-dependent, so this is best-effort name matching, not a
// guarantee (some systems only ship a single voice per language).
const MALE_VOICE_HINTS = [
  "male", "homme", "guy", "daniel", "thomas", "paul", "nicolas", "yannick",
  "thierry", "henri", "mark", "alex", "fred", "david", "george", "james", "matthew",
];
const FEMALE_VOICE_HINTS = [
  "female", "femme", "amelie", "amélie", "julie", "audrey", "celine", "céline",
  "chantal", "samantha", "victoria", "zira", "susan", "karen", "hazel", "salli",
];

export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const langPrefix = lang.slice(0, 2).toLowerCase();
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  if (!candidates.length) return null;

  const byMaleHint = candidates.find((v) => MALE_VOICE_HINTS.some((h) => v.name.toLowerCase().includes(h)));
  if (byMaleHint) return byMaleHint;

  const nonFemale = candidates.find((v) => !FEMALE_VOICE_HINTS.some((h) => v.name.toLowerCase().includes(h)));
  if (nonFemale) return nonFemale;

  return candidates[0];
}

// Gemini replies use Markdown/LaTeX-ish formatting (**bold**, *italics*,
// `code`, $$x = y$$, \frac{a}{b}...) which reads as literal, jarring symbols
// ("asterisk", "dollar") when spoken aloud — strip/translate it before TTS.
export function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1 sur $2")
    .replace(/\\sqrt\{([^{}]*)\}/g, "racine de $1")
    .replace(/\$\$?(.*?)\$\$?/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}
