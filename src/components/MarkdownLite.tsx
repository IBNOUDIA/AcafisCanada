import React from "react";

// Renders the constrained subset of Markdown/LaTeX-lite formatting Gemini
// uses in Kocc Barma's replies (bold, italic, inline code, bullet/numbered
// lists, simple LaTeX fractions) as real elements instead of showing raw
// "**"/"$$" symbols. Deliberately not a full Markdown parser — just enough
// for this chat bubble, so we avoid pulling in a markdown library.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const normalized = text
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√$1")
    .replace(/\$\$?(.*?)\$\$?/g, "$1");

  const tokens = normalized.split(/(\*\*.+?\*\*|\*.+?\*|`.+?`)/g).filter((t) => t !== "");
  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={key} className="px-1 py-0.5 rounded bg-black/20 text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 1) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

export const MarkdownLite: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!listBuffer) return;
    const { type, items } = listBuffer;
    const ListTag = type;
    blocks.push(
      <ListTag key={key} className={type === "ul" ? "list-disc pl-5 space-y-0.5 my-1.5" : "list-decimal pl-5 space-y-0.5 my-1.5"}>
        {items.map((item, i) => (
          <li key={i}>{renderInline(item, `${key}-li-${i}`)}</li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trimStart();
    // A lone "---" / "***" horizontal-rule line — just drop it, no <hr> needed
    // in a chat bubble.
    if (/^(-{3,}|\*{3,})\s*$/.test(trimmed)) {
      flushList(`flush-${idx}`);
      return;
    }
    const line = trimmed.replace(/^#{1,6}\s+/, "");
    const bulletMatch = line.match(/^[-•*]\s+(.*)/);
    const numberedMatch = line.match(/^\d+\.\s+(.*)/);

    if (bulletMatch) {
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList(`flush-${idx}`);
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(bulletMatch[1]);
      return;
    }
    if (numberedMatch) {
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList(`flush-${idx}`);
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(numberedMatch[1]);
      return;
    }

    flushList(`flush-${idx}`);
    if (line.trim() !== "") {
      blocks.push(
        <p key={`p-${idx}`} className="mb-2 last:mb-0">
          {renderInline(line, `p-${idx}`)}
        </p>
      );
    }
  });
  flushList("flush-end");

  return <>{blocks}</>;
};
