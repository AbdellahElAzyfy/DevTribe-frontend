import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import AuthPageLayout from "./AuthPageLayout";
import { signupSchema } from "./authSchemas";
import { authInputClassName, authSubmitClassName } from "./authStyles";
import { useAuth } from "../../hooks/useAuth";

export default function SignupForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

      const { confirmPassword: _confirmPassword, ...payload } = value;

      try {
        await register(payload);
        navigate("/home", { replace: true });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Signup failed.",
        );
      }
    },
  });

  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Join devTribe and start sharing with your community."
    >
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.username.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div>
              {(() => {
                const hasError = Boolean(field.state.meta.errors?.[0]);
                const showMessage = field.state.meta.isBlurred && hasError;

                return (
                  <>
                    <label
                      className="text-sm font-medium text-slate-300"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="your_username"
                      className={`${authInputClassName} ${
                        hasError
                          ? "border-red-400/80 focus:border-red-400/80 focus:ring-red-500/25"
                          : ""
                      }`}
                    />
                    {showMessage ? (
                      <p className="mt-1 text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div>
              {(() => {
                const hasError = Boolean(field.state.meta.errors?.[0]);
                const showMessage = field.state.meta.isBlurred && hasError;

                return (
                  <>
                    <label
                      className="text-sm font-medium text-slate-300"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@example.com"
                      className={`${authInputClassName} ${
                        hasError
                          ? "border-red-400/80 focus:border-red-400/80 focus:ring-red-500/25"
                          : ""
                      }`}
                    />
                    {showMessage ? (
                      <p className="mt-1 text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.password.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div>
              {(() => {
                const hasError = Boolean(field.state.meta.errors?.[0]);
                const showMessage = field.state.meta.isBlurred && hasError;

                return (
                  <>
                    <label
                      className="text-sm font-medium text-slate-300"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Create a password"
                      className={`${authInputClassName} ${
                        hasError
                          ? "border-red-400/80 focus:border-red-400/80 focus:ring-red-500/25"
                          : ""
                      }`}
                    />
                    {showMessage ? (
                      <p className="mt-1 text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              const result =
                signupSchema.shape.confirmPassword.safeParse(value);
              if (!result.success) return result.error.issues[0]?.message;

              const passwordValue = fieldApi.form.getFieldValue("password");
              if (value !== passwordValue) return "Passwords do not match";

              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              {(() => {
                const hasError = Boolean(field.state.meta.errors?.[0]);
                const showMessage = field.state.meta.isBlurred && hasError;

                return (
                  <>
                    <label
                      className="text-sm font-medium text-slate-300"
                      htmlFor="confirmPassword"
                    >
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Repeat your password"
                      className={`${authInputClassName} ${
                        hasError
                          ? "border-red-400/80 focus:border-red-400/80 focus:ring-red-500/25"
                          : ""
                      }`}
                    />
                    {showMessage ? (
                      <p className="mt-1 text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.values, state.isSubmitting]}
        >
          {([values, isSubmitting]) => {
            const isValid = signupSchema.safeParse(values).success;
            return (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={authSubmitClassName}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            );
          }}
        </form.Subscribe>

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}
      </form>

      <p className="mt-4 text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-400 transition duration-300 hover:text-blue-300"
        >
          Sign in
        </Link>
      </p>
    </AuthPageLayout>
  );
}
