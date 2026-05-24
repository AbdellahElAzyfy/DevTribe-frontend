import ContentRenderer from "../../../ui/ContentRenderer";
import hljs from "highlight.js";

function DraftPreview({ draft }) {
  if (!draft) return null;

  let detectedLang = "javascript";
  if (draft.codeSnippet) {
    try {
      const commonLangs = ["javascript", "python", "java", "c", "cpp", "csharp", "php", "ruby", "swift", "go", "rust", "typescript", "html", "css", "sql", "bash", "json"];
      const result = hljs.highlightAuto(draft.codeSnippet, commonLangs);
      if (result.language) {
        detectedLang = result.language;
      }
    } catch (e) {
      // ignore
    }
  }

  const finalContent = draft.codeSnippet
    ? `${draft.content}\n\n\`\`\`${detectedLang}\n${draft.codeSnippet}\n\`\`\``
    : draft.content;

  return (
    <section className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-sm shadow-black/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        Draft preview
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-300/85">
        r/{draft.communitySlug}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-slate-100">
        {draft.title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-slate-300">
        <ContentRenderer content={finalContent} />
      </div>
    </section>
  );
}

export default DraftPreview;
