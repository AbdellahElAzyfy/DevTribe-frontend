import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hljs from "highlight.js";
import { useForm } from "@tanstack/react-form";
import CreatePostForm from "./components/CreatePostForm";
import DraftPreview from "./components/DraftPreview";
import PageShell from "../../ui/PageShell";
import { useListCommunities } from "../../hooks/useCommunityQueries";
import { useCreatePost } from "../../hooks/usePostQueries";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import EmptyStateCard from "../../ui/EmptyStateCard";

const INITIAL_VALUES = {
  title: "",
  communitySlug: "",
  content: "",
  codeSnippet: "",
  tagsInput: "",
  imageFile: null,
};

function parseTags(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  const uniqueTags = [];

  value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .forEach((tag) => {
      if (!uniqueTags.includes(tag) && uniqueTags.length < 5) {
        uniqueTags.push(tag);
      }
    });

  return uniqueTags;
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [draftPreview, setDraftPreview] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const { data: communities = [] } = useListCommunities();

  // Users can only post in communities they have joined.
  const joinedCommunities = communities.filter(
    (community) => community.isJoined,
  );

  const createPost = useCreatePost({
    onSuccess: async (data) => {
      setDraftPreview(null);
      setSubmitError("");
      form.reset();
      // Wait for cache invalidation to finish before navigating
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/profile");
    },
    onError: (error) => {
      setSubmitError(
        error?.message || "Something went wrong while creating the post.",
      );
      console.error("Failed to create post:", error);
    },
  });

  const form = useForm({
    defaultValues: INITIAL_VALUES,
    onSubmit: async ({ value }) => {
      setSubmitError("");

      const tags = parseTags(value.tagsInput);

      let detectedLang = "javascript";
      if (value.codeSnippet) {
        try {
          const commonLangs = ["javascript", "python", "java", "c", "cpp", "csharp", "php", "ruby", "swift", "go", "rust", "typescript", "html", "css", "sql", "bash", "json"];
          const result = hljs.highlightAuto(value.codeSnippet, commonLangs);
          if (result.language) {
            detectedLang = result.language;
          }
        } catch (e) {
          // ignore
        }
      }

      const finalContent = value.codeSnippet
        ? `${value.content}\n\n\`\`\`${detectedLang}\n${value.codeSnippet}\n\`\`\``
        : value.content;

      // Prepare payload - send as published post
      const payload = value.imageFile
        ? (() => {
            const formData = new FormData();
            formData.append("communitySlug", value.communitySlug);
            formData.append("title", value.title.trim());
            formData.append("content", finalContent.trim());
            formData.append("image", value.imageFile);
            tags.forEach((tag) => formData.append("tags", tag));
            return formData;
          })()
        : {
            communitySlug: value.communitySlug,
            title: value.title.trim(),
            content: finalContent.trim(),
            tags,
            isDraft: false,
          };

      try {
        await createPost.mutateAsync(payload);
      } catch (error) {
        setSubmitError(
          error?.message || "Something went wrong while creating the post.",
        );
      }
    },
  });

  return (
    <PageShell
      maxWidth="max-w-3xl"
      spacing="space-y-4 sm:space-y-5"
      padding="pb-5"
    >
      {(submitError || createPost.error) && (
        <AsyncStateNotice
          isError
          title="Failed to create post"
          message={
            submitError || createPost.error?.message || "Something went wrong"
          }
        />
      )}
      {joinedCommunities.length === 0 ? (
        <EmptyStateCard
          title="Join a community first"
          description="You can only post in communities you've joined. Explore communities and join one to start posting."
          meta={
            <button
              type="button"
              onClick={() => navigate("/communities")}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition duration-300 hover:border-blue-400/60 hover:bg-slate-700"
            >
              Browse communities
            </button>
          }
        />
      ) : (
        <CreatePostForm
          formApi={form}
          communitiesList={joinedCommunities}
          isSubmitting={createPost.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        />
      )}
      <DraftPreview draft={draftPreview} />
    </PageShell>
  );
}
