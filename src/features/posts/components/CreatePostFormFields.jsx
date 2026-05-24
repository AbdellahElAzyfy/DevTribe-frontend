function FormField({ label, htmlFor, children, helperText }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium tracking-tight text-slate-200"
      >
        {label}
      </label>
      {children}
      {helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

function getFieldError(field) {
  const shouldShowError =
    field.state.meta.isBlurred && Boolean(field.state.meta.errors?.[0]);

  return shouldShowError ? field.state.meta.errors[0] : "";
}

function TextInputField({
  formApi,
  name,
  label,
  htmlFor,
  placeholder,
  helperText,
  validators,
  required = false,
}) {
  const Form = formApi;

  return (
    <Form.Field name={name} validators={validators}>
      {(field) => {
        const error = getFieldError(field);

        return (
          <FormField label={label} htmlFor={htmlFor} helperText={helperText}>
            <input
              id={htmlFor}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              className={`h-12 w-full rounded-xl border bg-slate-950/45 px-4 text-base text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 ${
                error
                  ? "border-red-400/70 focus:border-red-400/70"
                  : "border-slate-700/70 focus:border-blue-400/60"
              }`}
              placeholder={placeholder}
              required={required}
            />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </FormField>
        );
      }}
    </Form.Field>
  );
}

function TextareaField({
  formApi,
  name,
  label,
  htmlFor,
  placeholder,
  helperText,
  validators,
  rows,
  required = false,
  isCode = false,
}) {
  const Form = formApi;

  return (
    <Form.Field name={name} validators={validators}>
      {(field) => {
        const error = getFieldError(field);

        return (
          <FormField label={label} htmlFor={htmlFor} helperText={helperText}>
            <textarea
              id={htmlFor}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={rows}
              className={`w-full rounded-xl border px-4 py-3 outline-none transition duration-300 placeholder:text-slate-500 ${
                isCode
                  ? "bg-slate-950/85 font-mono text-xs leading-relaxed text-slate-200"
                  : "bg-slate-950/45 text-sm leading-relaxed text-slate-100"
              } ${
                error
                  ? "border-red-400/70 focus:border-red-400/70"
                  : "border-slate-700/70 focus:border-blue-400/60"
              }`}
              placeholder={placeholder}
              required={required}
            />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </FormField>
        );
      }}
    </Form.Field>
  );
}

function FileInputField({
  formApi,
  name,
  label,
  htmlFor,
  helperText,
  validators,
}) {
  const Form = formApi;

  return (
    <Form.Field name={name} validators={validators}>
      {(field) => {
        const error = getFieldError(field);

        return (
          <FormField label={label} htmlFor={htmlFor} helperText={helperText}>
            <input
              id={htmlFor}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onBlur={field.handleBlur}
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                field.handleChange(selectedFile);
              }}
              className={`w-full rounded-xl border bg-slate-950/45 px-3 py-2 text-sm leading-5 text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:leading-none file:text-slate-100 outline-none transition duration-300 ${
                error
                  ? "border-red-400/70 focus:border-red-400/70"
                  : "border-slate-700/70 focus:border-blue-400/60"
              }`}
            />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </FormField>
        );
      }}
    </Form.Field>
  );
}

export { FileInputField, FormField, TextInputField, TextareaField };
