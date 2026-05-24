function PageHeaderBlock({ title, description }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}

export default PageHeaderBlock;
