import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Share2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { ChatMessage } from "../types";
import koccBarmaAvatar from "../assets/images/kocc-barma-avatar.jpg";

const WELCOME_MESSAGE: ChatMessage = {
  id: "initial-welcome",
  sender: "mentor",
  text: "Bonjour ! 🎓 Je suis Kocc Barma, l'agent IA éducatif d'ACAFIS Canada. Pose-moi une question sur tes études, le code, la robotique, ton orientation ou la culture sénégalaise !",
  timestamp: "À l'instant",
};

// Web Speech API isn't fully typed in the default DOM lib — narrow "any" casts
// keep this optional, progressively-enhanced feature isolated to this file.
const getSpeechRecognitionCtor = (): any =>
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const KoccBarmaWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== "undefined" && !!getSpeechRecognitionCtor();
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const shareSupported = typeof navigator !== "undefined" && !!(navigator as any).share;

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Stop any speech synthesis if the widget unmounts mid-utterance.
  useEffect(() => {
    return () => {
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  // Avoid duplicating the experience on the dedicated Acafis Mentor page.
  if (location.pathname === "/acafis-mentor") return null;

  const speak = (text: string) => {
    if (!ttsSupported || !voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-CA";
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend ?? inputValue).trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, topic: "general" }),
      });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      const reply: string = data.reply || "Bonjour ! Comment puis-je t'aider aujourd'hui ?";
      setMessages((prev) => [
        ...prev,
        {
          id: `mentor-${Date.now()}`,
          sender: "mentor",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speak(reply);
    } catch {
      const fallback =
        "Bonne question ! Pour une réponse plus complète, rends-toi sur la page Acafis Mentor. En attendant, n'hésite pas à me donner plus de détails !";
      setMessages((prev) => [
        ...prev,
        {
          id: `mentor-${Date.now()}`,
          sender: "mentor",
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const RecognitionCtor = getSpeechRecognitionCtor();
    const recognition = new RecognitionCtor();
    recognition.lang = "fr-CA";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) setInputValue(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const getTranscript = () =>
    messages
      .map((m) => `${m.sender === "user" ? "Moi" : "Kocc Barma"} (${m.timestamp}) : ${m.text}`)
      .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getTranscript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied — silently ignore, non-critical.
    }
  };

  const handleShare = async () => {
    const transcript = getTranscript();
    if (shareSupported) {
      try {
        await (navigator as any).share({
          title: "Conversation avec Kocc Barma — ACAFIS Canada",
          text: transcript,
        });
      } catch {
        // User cancelled the native share sheet — no action needed.
      }
    } else {
      await handleCopy();
    }
  };

  const handleClear = () => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 w-16 h-16 rounded-full shadow-2xl border-2 border-amber-400 overflow-hidden hover:scale-105 transition-transform cursor-pointer bg-slate-950"
          aria-label="Ouvrir Kocc Barma, l'agent IA ACAFIS"
          title="Kocc Barma — Agent IA ACAFIS"
        >
          <img src={koccBarmaAvatar} alt="Kocc Barma" className="w-full h-full object-cover" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
        </button>
      )}

      {/* Expanded chat panel */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[600px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/50 shrink-0">
                <img src={koccBarmaAvatar} alt="Kocc Barma" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white leading-tight truncate">Kocc Barma</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> En ligne
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer shrink-0"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action toolbar: voice, copy, share, delete */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 shrink-0">
            {ttsSupported && (
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                title={voiceEnabled ? "Désactiver la lecture vocale" : "Activer la lecture vocale des réponses"}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  voiceEnabled ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              onClick={handleCopy}
              title="Copier la conversation"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleShare}
              title="Partager la conversation"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              title="Supprimer la conversation"
              className="ml-auto p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/90">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs"
                  }`}
                >
                  {msg.text}
                  <div className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-emerald-200" : "text-slate-500"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-t border-slate-800 flex items-center gap-1.5 shrink-0"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Arrêter l'écoute" : "Parler à Kocc Barma"}
                className={`p-2.5 rounded-xl cursor-pointer shrink-0 transition-colors ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pose ta question..."
              disabled={isLoading}
              className="flex-1 min-w-0 bg-slate-900 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-xs border border-slate-800 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 shrink-0 cursor-pointer transition-colors"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
