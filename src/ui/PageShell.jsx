function PageShell({
  children,
  maxWidth = "max-w-4xl",
  spacing = "space-y-4 sm:space-y-6",
  padding = "pb-4",
}) {
  return (
    <div className={`mx-auto w-full ${maxWidth} ${spacing} ${padding}`}>
      {children}
    </div>
  );
}

export default PageShell;
