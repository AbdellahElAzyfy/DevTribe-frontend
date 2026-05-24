export default function PostsSectionHeader({ title, description }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </section>
  );
}
