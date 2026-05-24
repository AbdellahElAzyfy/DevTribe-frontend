import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import AuthPageLayout from "./AuthPageLayout";
import { loginSchema } from "./authSchemas";
import { authInputClassName, authSubmitClassName } from "./authStyles";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError("");

      try {
        await login(value);
        navigate("/home", { replace: true });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Login failed.",
        );
      }
    },
  });

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue to devTribe."
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
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div>
              {/** Border reacts on change, message appears after blur/touch */}
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
              const result = loginSchema.shape.password.safeParse(value);
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
                      placeholder="Enter your password"
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
            const isValid = loginSchema.safeParse(values).success;
            return (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={authSubmitClassName}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            );
          }}
        </form.Subscribe>

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}
      </form>

      <p className="mt-4 text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-blue-400 transition duration-300 hover:text-blue-300"
        >
          Create one
        </Link>
      </p>
    </AuthPageLayout>
  );
}
