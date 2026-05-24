import ContentRenderer from "../../../ui/ContentRenderer";

function PostCardBody({ title, content, imageUrl, tags }) {
  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight text-slate-100 transition-all duration-300 ease-out group-hover:text-blue-400">
        {title}
      </h2>

      <div
        className={`mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
          imageUrl
            ? "max-h-[4.5rem] group-hover:max-h-[2000px] after:absolute after:bottom-0 after:left-0 after:h-8 after:w-full after:bg-gradient-to-t after:from-slate-900 after:to-transparent after:transition-opacity after:duration-500 group-hover:after:opacity-0 [&_.code-snippet-block]:opacity-0 group-hover:[&_.code-snippet-block]:opacity-100 [&_.code-snippet-block]:translate-y-4 group-hover:[&_.code-snippet-block]:translate-y-0 [&_.code-snippet-block]:transition-all [&_.code-snippet-block]:duration-700 [&_.code-snippet-block]:delay-200"
            : ""
        }`}
      >
        <ContentRenderer content={content} />
      </div>

      {tags && tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-blue-400 shadow-sm shadow-blue-500/10 backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-blue-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      {imageUrl ? (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-700/60 bg-black/40 relative group/image">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[32rem] w-full object-contain backdrop-blur-sm transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : null}
    </>
  );
}

export default PostCardBody;
