import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";

import CreatePostForm from "./components/CreatePostForm";
import PageShell from "../../ui/PageShell";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import EmptyStateCard from "../../ui/EmptyStateCard";
import { usePost, useUpdatePost } from "../../hooks/usePostQueries";
import { useAuth } from "../../hooks/useAuth";

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

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: post, isLoading, isError } = usePost(id);
  const [submitError, setSubmitError] = useState("");

  const updatePost = useUpdatePost({
    onSuccess: () => {
      setSubmitError("");
      navigate(`/post/${id}`);
    },
    onError: (error) => {
      setSubmitError(
        error?.message || "Something went wrong while updating the post.",
      );
    },
  });

  const form = useForm({
    defaultValues: {
      title: post?.title ?? "",
      // Content already contains any embedded code fences; edit it as one field.
      content: post?.content ?? "",
      codeSnippet: "",
      tagsInput: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
      imageFile: null,
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

      const tags = parseTags(value.tagsInput);
      const finalContent = value.codeSnippet
        ? `${value.content}\n\n\`\`\`\n${value.codeSnippet}\n\`\`\``
        : value.content;

      // Community is intentionally omitted — it isn't an editable field.
      const payload = value.imageFile
        ? (() => {
            const formData = new FormData();
            formData.append("title", value.title.trim());
            formData.append("content", finalContent.trim());
            formData.append("image", value.imageFile);
            tags.forEach((tag) => formData.append("tags", tag));
            return formData;
          })()
        : {
            title: value.title.trim(),
            content: finalContent.trim(),
            tags,
          };

      try {
        await updatePost.mutateAsync({ postId: id, data: payload });
      } catch (error) {
        setSubmitError(
          error?.message || "Something went wrong while updating the post.",
        );
      }
    },
  });

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <AsyncStateNotice message="Loading post..." />
      </PageShell>
    );
  }

  if (isError || !post) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <EmptyStateCard
          title="Post not found"
          description="This post does not exist or has been deleted."
        />
      </PageShell>
    );
  }

  const isOwner =
    currentUser?.username && currentUser.username === post.author?.username;

  if (!isOwner) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <EmptyStateCard
          title="You can't edit this post"
          description="Only the author can edit this post."
          meta={
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition duration-300 hover:border-blue-400/60 hover:bg-slate-700"
            >
              Back to post
            </button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-3xl" spacing="space-y-4 sm:space-y-5" padding="pb-5">
      {(submitError || updatePost.error) && (
        <AsyncStateNotice
          tone="error"
          message={
            submitError || updatePost.error?.message || "Something went wrong"
          }
        />
      )}
      <CreatePostForm
        formApi={form}
        mode="edit"
        communityLabel={post.community?.slug ?? post.community?.name ?? ""}
        isSubmitting={updatePost.isPending}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      />
    </PageShell>
  );
}
