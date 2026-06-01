import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ContentRenderer = ({ content }) => {
  if (!content) return null;

  // Normalize Windows/FormData line endings to standard \n
  const normalizedContent = content.replace(/\r\n/g, '\n');

  // Split content by markdown code blocks: ```language ... ```
  // Regex matches ```language (optional) \n code \n ```
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  let hasMarkdownCode = false;

  while ((match = regex.exec(normalizedContent)) !== null) {
    hasMarkdownCode = true;
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: normalizedContent.slice(lastIndex, match.index)
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'javascript',
      value: match[2].trim()
    });

    lastIndex = regex.lastIndex;
  }

  if (hasMarkdownCode) {
    if (lastIndex < normalizedContent.length) {
      parts.push({
        type: 'text',
        value: normalizedContent.slice(lastIndex)
      });
    }
  } else {
    // Legacy support for posts created before Markdown integration
    const legacySeparator = '\n\n\n\n';
    const legacyIndex = normalizedContent.indexOf(legacySeparator);
    
    if (legacyIndex !== -1) {
      parts.push({
        type: 'text',
        value: normalizedContent.slice(0, legacyIndex)
      });
      parts.push({
        type: 'code',
        language: 'javascript',
        value: normalizedContent.slice(legacyIndex + legacySeparator.length).trim()
      });
    } else {
      parts.push({
        type: 'text',
        value: normalizedContent
      });
    }
  }

  // If there are no code blocks, just render text
  if (parts.length === 1 && parts[0].type === 'text') {
    return (
      <div className="whitespace-pre-wrap break-words">
        {parts[0].value}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // trim empty parts
          if (!part.value.trim()) return null;
          return (
            <p key={index} className="whitespace-pre-wrap break-words">
              {part.value.trim()}
            </p>
          );
        }

        return (
          <div key={index} className="code-snippet-block my-5 overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl bg-slate-950 ring-1 ring-black/50">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              </div>
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-slate-400 opacity-80">{part.language}</span>
              <div className="w-12"></div>
            </div>
            <div className="p-4 overflow-x-auto bg-slate-950">
              <SyntaxHighlighter
                language={part.language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'transparent',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                }}
              >
                {part.value}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentRenderer;
