import { useForm } from "@tanstack/react-form";
import { useCreateCommunity, useUpdateCommunity } from "../../../hooks/useCommunityQueries";
import { FaSpinner } from "react-icons/fa";

export default function CreateCommunityForm({ onSuccess, initialData }) {
  const isEditing = !!initialData;
  
  const createMutation = useCreateCommunity({
    onSuccess: () => {
      form.reset();
      if (onSuccess) onSuccess();
    },
  });

  const updateMutation = useUpdateCommunity({
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isPrivate: initialData?.isPrivate || false,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        updateMutation.mutate({ slug: initialData.slug, data: value });
      } else {
        createMutation.mutate(value);
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => 
            !value ? "Name is required" : value.length < 3 ? "Name must be at least 3 characters" : undefined,
        }}
        children={(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">
              Community Name
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g., frontEndDevs"
              className={`w-full rounded-lg border bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all ${
                field.state.meta.errors.length 
                  ? "border-rose-500/50 focus:border-rose-500" 
                  : "border-slate-700/50 focus:border-blue-500/50"
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-[11px] font-medium text-rose-400 pl-1">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">
              Description
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What is this community about?"
              rows={3}
              className="w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all resize-none"
            />
          </div>
        )}
      />

      <form.Field
        name="isPrivate"
        children={(field) => (
          <div className="flex items-center gap-3 rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
            <input
              id={field.name}
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
            />
            <div>
              <label htmlFor={field.name} className="text-sm font-bold text-slate-200">
                Private Community
              </label>
              <p className="text-xs text-slate-500">Only approved members can view posts.</p>
            </div>
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <FaSpinner className="h-4 w-4 animate-spin" />
        ) : (
          isEditing ? "Update Community" : "Create Community"
        )}
      </button>
    </form>
  );
}
