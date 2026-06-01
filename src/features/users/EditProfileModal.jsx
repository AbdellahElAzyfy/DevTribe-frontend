import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

import {
  useUpdateProfile,
  useChangePassword,
} from "../../hooks/useAuthQueries";
import { authInputClassName, authSubmitClassName } from "../auth/authStyles";
import resolveImageUrl from "../../utils/resolveImageUrl";

const MAX_BIO_LENGTH = 160;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateProfile({ username, email, bio }) {
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

function validatePassword({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Enter your current password.";
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    errors.newPassword = "New password must be different from the current one.";
  }

  if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-800 text-slate-100 shadow-sm shadow-black/30"
          : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdated,
}) {
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile tab state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSubmitError, setProfileSubmitError] = useState("");

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitError, setPasswordSubmitError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const fileInputRef = useRef(null);

  // Reset everything whenever the modal opens with the latest profile values
  useEffect(() => {
    if (isOpen && profile) {
      setActiveTab("profile");
      setUsername(profile.username ?? "");
      setEmail(profile.email ?? "");
      setBio(profile.bio ?? "");
      setAvatarFile(null);
      setAvatarPreview(null);
      setProfileErrors({});
      setProfileSubmitError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      setPasswordSubmitError("");
      setPasswordSuccess("");
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSubmitError("");

    const errors = validateProfile({ username, email, bio });
    setProfileErrors(errors);
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
      setProfileSubmitError(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSubmitError("");
    setPasswordSuccess("");

    const errors = validatePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordSubmitError(
        error instanceof Error ? error.message : "Failed to change password.",
      );
    }
  };

  const currentAvatar =
    avatarPreview ||
    resolveImageUrl(profile?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "default"}`;

  const isSavingProfile = updateProfile.isPending;
  const isSavingPassword = changePassword.isPending;

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
            Account Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-800 hover:text-slate-200 active:scale-90"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800 bg-slate-900/60 px-8 py-3">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </TabButton>
          <TabButton
            active={activeTab === "password"}
            onClick={() => setActiveTab("password")}
          >
            Password
          </TabButton>
        </div>

        {activeTab === "profile" ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4 p-8">
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
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="edit-username"
              >
                Username
              </label>
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${authInputClassName} ${
                  profileErrors.username ? "border-red-400/80" : ""
                }`}
              />
              {profileErrors.username ? (
                <p className="mt-1 text-sm text-red-400">
                  {profileErrors.username}
                </p>
              ) : null}
            </div>

            {/* Email */}
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="edit-email"
              >
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${authInputClassName} ${
                  profileErrors.email ? "border-red-400/80" : ""
                }`}
              />
              {profileErrors.email ? (
                <p className="mt-1 text-sm text-red-400">
                  {profileErrors.email}
                </p>
              ) : null}
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium text-slate-300"
                  htmlFor="edit-bio"
                >
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
                  profileErrors.bio ? "border-red-400/80" : ""
                }`}
              />
              {profileErrors.bio ? (
                <p className="mt-1 text-sm text-red-400">{profileErrors.bio}</p>
              ) : null}
            </div>

            {profileSubmitError ? (
              <p className="text-sm text-red-400">{profileSubmitError}</p>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`${authSubmitClassName} mt-0 flex-1`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className={`${authSubmitClassName} mt-0 flex-1`}
              >
                {isSavingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 p-8">
            {/* Current password */}
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="current-password"
              >
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${authInputClassName} ${
                  passwordErrors.currentPassword ? "border-red-400/80" : ""
                }`}
              />
              {passwordErrors.currentPassword ? (
                <p className="mt-1 text-sm text-red-400">
                  {passwordErrors.currentPassword}
                </p>
              ) : null}
            </div>

            {/* New password */}
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="new-password"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${authInputClassName} ${
                  passwordErrors.newPassword ? "border-red-400/80" : ""
                }`}
              />
              {passwordErrors.newPassword ? (
                <p className="mt-1 text-sm text-red-400">
                  {passwordErrors.newPassword}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  At least {MIN_PASSWORD_LENGTH} characters.
                </p>
              )}
            </div>

            {/* Confirm new password */}
            <div>
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="confirm-password"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${authInputClassName} ${
                  passwordErrors.confirmPassword ? "border-red-400/80" : ""
                }`}
              />
              {passwordErrors.confirmPassword ? (
                <p className="mt-1 text-sm text-red-400">
                  {passwordErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            {passwordSubmitError ? (
              <p className="text-sm text-red-400">{passwordSubmitError}</p>
            ) : null}
            {passwordSuccess ? (
              <p className="text-sm text-emerald-400">{passwordSuccess}</p>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`${authSubmitClassName} mt-0 flex-1`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingPassword}
                className={`${authSubmitClassName} mt-0 flex-1`}
              >
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
