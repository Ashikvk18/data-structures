"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({ code, language = "cpp", title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border my-4">
      {title && (
        <div className="flex items-center justify-between bg-card px-4 py-2 border-b border-border">
          <span className="text-xs font-medium text-muted">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted/60">{language}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-card-hover rounded transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted" />
              )}
            </button>
          </div>
        </div>
      )}
      <pre className="bg-code-bg p-4 overflow-x-auto">
        <code className="text-sm leading-relaxed text-foreground/90 font-mono whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
