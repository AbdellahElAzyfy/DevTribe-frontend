import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

import { useUpdateProfile } from "../../hooks/useAuthQueries";
import { authInputClassName, authSubmitClassName } from "../auth/authStyles";
import resolveImageUrl from "../../utils/resolveImageUrl";

const MAX_BIO_LENGTH = 160;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ username, email, bio }) {
  const errors = {};

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
    errors.username = "Username must be between 3 and 30 characters.";
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (bio.length > MAX_BIO_LENGTH) {
    errors.bio = `Bio must be ${MAX_BIO_LENGTH} characters or fewer.`;
  }

  return errors;
}

export default function EditProfileModal({ isOpen, onClose, profile, onUpdated }) {
  const updateProfile = useUpdateProfile();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef(null);

  // Reset the form whenever the modal opens with the latest profile values
  useEffect(() => {
    if (isOpen && profile) {
      setUsername(profile.username ?? "");
      setEmail(profile.email ?? "");
      setBio(profile.bio ?? "");
      setAvatarFile(null);
      setAvatarPreview(null);
      setFieldErrors({});
      setSubmitError("");
    }
  }, [isOpen, profile]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Build/cleanup the avatar object URL preview
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const errors = validate({ username, email, bio });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const trimmed = {
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
    };

    let payload;
    if (avatarFile) {
      payload = new FormData();
      payload.append("username", trimmed.username);
      payload.append("email", trimmed.email);
      payload.append("bio", trimmed.bio);
      payload.append("avatar", avatarFile);
    } else {
      payload = trimmed;
    }

    try {
      const result = await updateProfile.mutateAsync(payload);
      await onUpdated?.(result?.user ?? result);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    }
  };

  const currentAvatar =
    avatarPreview ||
    resolveImageUrl(profile?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "default"}`;

  const isSubmitting = updateProfile.isPending;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/30 px-8 py-5">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-100">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-800 hover:text-slate-200 active:scale-90"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={currentAvatar}
              alt="Avatar preview"
              className="h-20 w-20 rounded-2xl border-2 border-slate-700/70 object-cover"
            />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-400/60 hover:bg-slate-700"
              >
                Change avatar
              </button>
              {avatarFile ? (
                <p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">
                  {avatarFile.name}
                </p>
              ) : null}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-slate-300" htmlFor="edit-username">
              Username
            </label>
            <input
              id="edit-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${authInputClassName} ${
                fieldErrors.username ? "border-red-400/80" : ""
              }`}
            />
            {fieldErrors.username ? (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.username}</p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-300" htmlFor="edit-email">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${authInputClassName} ${
                fieldErrors.email ? "border-red-400/80" : ""
              }`}
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
            ) : null}
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300" htmlFor="edit-bio">
                Bio
              </label>
              <span className="text-xs text-slate-500">
                {bio.length}/{MAX_BIO_LENGTH}
              </span>
            </div>
            <textarea
              id="edit-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the tribe a little about yourself."
              className={`${authInputClassName} resize-none ${
                fieldErrors.bio ? "border-red-400/80" : ""
              }`}
            />
            {fieldErrors.bio ? (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.bio}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-red-400">{submitError}</p>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${authSubmitClassName} mt-0 flex-1`}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
