function EmptyStateCard({
  title,
  description,
  icon,
  meta,
  className = "",
  titleClassName = "text-slate-100",
  descriptionClassName = "text-slate-400",
  iconWrapperClassName = "",
  iconContainerClassName = "",
}) {
  return (
    <section
      className={`rounded-xl border border-slate-700/70 bg-slate-900/55 p-6 text-center ${className}`}
    >
      {icon ? (
        <div className={`mb-4 flex justify-center ${iconWrapperClassName}`}>
          <div className={iconContainerClassName}>{icon}</div>
        </div>
      ) : null}

      <h2 className={`text-lg font-semibold ${titleClassName}`}>{title}</h2>
      {description ? (
        <p className={`mt-2 text-sm ${descriptionClassName}`}>{description}</p>
      ) : null}

      {meta ? <div className="mt-4 text-xs text-slate-500">{meta}</div> : null}
    </section>
  );
}

export default EmptyStateCard;
