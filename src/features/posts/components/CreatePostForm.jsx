import { z } from "zod";
import CommunityPicker from "./CommunityPicker";
import {
  FileInputField,
  FormField,
  TextInputField,
  TextareaField,
} from "./CreatePostFormFields";

const titleSchema = z.string().trim().min(5).max(300);
const contentSchema = z.string().trim().min(10).max(20000);
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;

function parseTagsInput(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeTagsInput(value) {
  const unique = [];

  parseTagsInput(value).forEach((tag) => {
    if (!unique.includes(tag) && unique.length < MAX_TAGS) {
      unique.push(tag);
    }
  });

  return unique.join(", ");
}

const tagsSchema = z
  .string()
  .optional()
  .superRefine((value, context) => {
    const tags = parseTagsInput(value ?? "");

    if (tags.length > MAX_TAGS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Use up to ${MAX_TAGS} tags.`,
      });
    }

    for (const tag of tags) {
      if (tag.length > MAX_TAG_LENGTH) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Each tag must be ${MAX_TAG_LENGTH} characters or fewer.`,
        });
        return;
      }

      if (!/^[a-z0-9-]+$/.test(tag)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tags can only contain letters, numbers, and hyphens.",
        });
        return;
      }
    }
  });

const imageSchema = z
  .any()
  .nullable()
  .optional()
  .refine(
    (file) => !file || file.size <= 5 * 1024 * 1024,
    "Image must be 5MB or smaller.",
  )
  .refine(
    (file) =>
      !file ||
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type,
      ),
    "Image must be JPG, PNG, GIF, or WEBP.",
  );

function CreatePostForm({
  formApi,
  onSubmit,
  communitiesList,
  isSubmitting = false,
}) {
  const Form = formApi;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5 shadow-lg shadow-black/25 sm:p-6"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        Create post
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Share your idea in a clean writing flow designed for developers.
      </p>

      <div className="mt-6 space-y-5">
        <TextInputField
          formApi={Form}
          name="title"
          label="Title"
          htmlFor="create-post-title"
          helperText="Make it clear and specific so developers immediately understand the topic."
          placeholder="Example: How I optimized React Query cache for fast dashboards"
          required
          validators={{
            onChange: ({ value }) => {
              const result = titleSchema.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        />

        <Form.Field name="communitySlug">
          {(field) => (
            <FormField label="Community" htmlFor="create-post-community">
              <CommunityPicker field={field} options={communitiesList} />
            </FormField>
          )}
        </Form.Field>

        <TextareaField
          formApi={Form}
          name="content"
          label="Content"
          htmlFor="create-post-content"
          helperText="Write your thoughts, explanation, and key takeaways."
          placeholder="Tell the community what you built, what challenge you faced, and what you learned..."
          rows={10}
          required
          validators={{
            onChange: ({ value }) => {
              const result = contentSchema.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        />

        <Form.Field
          name="tagsInput"
          validators={{
            onChange: ({ value }) => {
              const result = tagsSchema.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const hasError = Boolean(field.state.meta.errors?.[0]);
            const showMessage = field.state.meta.isBlurred && hasError;
            const currentTags = parseTagsInput(field.state.value);
            const tagCount = currentTags.length;

            return (
              <FormField
                label={
                  <div className="flex items-center justify-between">
                    <span>Tags</span>
                    <span
                      className={`text-xs font-medium ${
                        tagCount >= MAX_TAGS
                          ? "text-amber-400"
                          : "text-slate-400"
                      }`}
                    >
                      {tagCount}/{MAX_TAGS}
                    </span>
                  </div>
                }
                htmlFor="create-post-tags"
                helperText="Optional. Up to 5 tags, comma-separated (example: nodejs, api, performance)."
              >
                <input
                  id="create-post-tags"
                  value={field.state.value}
                  onBlur={() => {
                    field.handleBlur();
                    field.handleChange(normalizeTagsInput(field.state.value));
                  }}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className={`h-12 w-full rounded-xl border bg-slate-950/45 px-4 text-base text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 ${
                    hasError
                      ? "border-red-400/70 focus:border-red-400/70"
                      : "border-slate-700/70 focus:border-blue-400/60"
                  }`}
                  placeholder="react, tanstack-query, caching"
                />
                {showMessage ? (
                  <p className="text-xs text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </FormField>
            );
          }}
        </Form.Field>

        <FileInputField
          formApi={Form}
          name="imageFile"
          label="Cover image"
          htmlFor="create-post-image"
          helperText="Optional. Upload JPG, PNG, GIF, or WEBP up to 5MB."
          validators={{
            onChange: ({ value }) => {
              const result = imageSchema.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        />

        <TextareaField
          formApi={Form}
          name="codeSnippet"
          label="Optional code snippet"
          htmlFor="create-post-code"
          helperText="Add a short code sample if it helps explain your post."
          placeholder={`const query = useQuery({ \n  queryKey: ['posts'],\n  queryFn: fetchPosts,\n});`}
          rows={7}
          isCode
        />
      </div>

      <Form.Subscribe selector={(state) => [state.values, state.isSubmitting]}>
        {([values, formIsSubmitting]) => {
          const canSubmit =
            titleSchema.safeParse(values.title).success &&
            contentSchema.safeParse(values.content).success &&
            tagsSchema.safeParse(values.tagsInput).success &&
            imageSchema.safeParse(values.imageFile).success;
          const isLoading = isSubmitting || formIsSubmitting;

          return (
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-800 px-5 text-sm font-semibold text-slate-100 transition duration-300 hover:border-blue-400/60 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create Post"}
            </button>
          );
        }}
      </Form.Subscribe>
    </form>
  );
}

export default CreatePostForm;
