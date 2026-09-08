import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  GraduationCap,
  BookOpen,
  Code2,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Compass,
  Lightbulb,
  Award,
} from "lucide-react";
import { ChatMessage } from "../types";

export const MentorAISecution: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("culture");
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "mentor",
      text: "Bonjour jeune talent ! 🎓\n\nJe suis Acafis Mentor, ton agent IA éducatif officiel. Je suis là pour t'aider dans tes devoirs, te faire progresser en programmation (Code, Algorithmique, IA) et te faire découvrir l'histoire du Sénégal.\n\nQue souhaites-tu explorer aujourd'hui ? 🚀",
      timestamp: "À l'instant",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const topics = [
    {
      id: "culture",
      label: "Quiz Culture Sénégal",
      icon: <HelpCircle className="w-4 h-4 text-emerald-500" />,
      color: "border-emerald-300 bg-emerald-50/70 text-emerald-900",
      description: "Histoire, patrimoine, Teranga & géographie",
      quickPrompts: [
        "Lance-moi une question quiz sur l'Île de Gorée",
        "Raconte-moi l'histoire du Musée des Civilisations Noires de Dakar",
        "Quels sont les fleuves et les régions du Sénégal ?",
      ],
    },
    {
      id: "maths",
      label: "Aide Maths & Sciences",
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      color: "border-blue-300 bg-blue-50/70 text-blue-900",
      description: "Du primaire au secondaire & cégep",
      quickPrompts: [
        "Aide-moi à comprendre le théorème de Pythagore facilement",
        "Comment résoudre une équation avec des fractions ?",
        "Explique-moi le cycle de l'eau et la photosynthèse",
      ],
    },
    {
      id: "code",
      label: "Découvrir Code & IA",
      icon: <Code2 className="w-4 h-4 text-purple-500" />,
      color: "border-purple-300 bg-purple-50/70 text-purple-900",
      description: "Scratch, Python, HTML & Logique",
      quickPrompts: [
        "Comment écrire mon premier programme 'Bonjour Monde' en Python ?",
        "Comment fonctionne une Intelligence Artificielle comme toi ?",
        "Qu'est-ce qu'une boucle 'for' et une variable ?",
      ],
    },
    {
      id: "orientation",
      label: "Orientation Scolaire",
      icon: <Compass className="w-4 h-4 text-amber-500" />,
      color: "border-amber-300 bg-amber-50/70 text-amber-900",
      description: "Cégeps, Universités au Canada & métiers d'avenir",
      quickPrompts: [
        "Quelles études faire au Canada pour travailler en Intelligence Artificielle ?",
        "Comment fonctionnent les admissions au cégep et à l'université ?",
        "Conseils pour réussir mes examens de fin d'année",
      ],
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          topic: selectedTopic,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion au serveur du Mentor");
      }

      const data = await response.json();
      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: "mentor",
        text: data.reply || "Excellente question ! Poursuivons notre apprentissage.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topic: selectedTopic,
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (error) {
      console.warn("Using offline fallback for Mentor ACAFIS:", error);
      const fallbackMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: "mentor",
        text: `Bravo pour ta curiosité ! En tant que Mentor ACAFIS, je te félicite pour cette question sur "${messageContent}". Rappelle-toi que chaque effort d'apprentissage te rapproche de tes rêves. N'hésite pas à demander à tes parents ou aux tuteurs bénévoles d'ACAFIS lors de nos ateliers du samedi !`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "initial-welcome",
        sender: "mentor",
        text: "Bonjour jeune talent ! 🎓\n\nJe suis Acafis Mentor, ton agent IA éducatif officiel. Je suis là pour t'aider dans tes devoirs, te faire progresser en programmation (Code, Algorithmique, IA) et te faire découvrir l'histoire du Sénégal.\n\nQue souhaites-tu explorer aujourd'hui ? 🚀",
        timestamp: "À l'instant",
      },
    ]);
  };

  const currentTopicObj = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <section id="acafis-mentor" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden border-y border-sky-900/60">
      {/* Background glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-900/70 text-sky-200 border border-sky-600/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Agent AI d'Apprentissage • Canada 🇨🇦 & Sénégal 🇸🇳</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
            Acafis Mentor
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto">
            L'agent IA bienveillant d'ACAFIS Canada dédié à la réussite de nos enfants. Aide aux devoirs, quiz historiques et initiation au code pour propulser nos jeunes talents.
          </p>

          {/* Online status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-emerald-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Agent AI Actif</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300">Acafis Mentor 🎓</span>
          </div>
        </div>

        {/* 4 Topic Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-8">
          {topics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                id={`mentor-topic-${topic.id}`}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40"
                    : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-md bg-slate-900 border border-slate-700">
                    {topic.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {topic.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {topic.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Chat Playground Card */}
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[620px]">
          
          {/* Header of Chat */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Le Mentor ACAFIS</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    IA Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Thème sélectionné : <span className="text-amber-300 font-medium">{currentTopicObj.label}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/90">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "mentor" && (
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-1">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      msg.sender === "user" ? "text-emerald-200 text-right" : "text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-slate-400 italic">Le Mentor réfléchit...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 bg-slate-900/70 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Exemples :
            </span>
            {currentTopicObj.quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/80 transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              id="mentor-input-message"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pose ta question au Mentor (ex: Explique-moi un concept, un devoir, ou lance un quiz)..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-slate-800 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />

            <button
              id="mentor-btn-submit"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0"
            >
              <span>Envoyer</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};
