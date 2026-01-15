"use client";

import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { parseForm, type FormErrors, type SchemaValidator } from "./validation";
import { cx } from "./cx";

export type FormStatus = "idle" | "submitting" | "success" | "error";

export type FormSubmitResult<T> = {
  fieldErrors?: FormErrors<T>;
  formError?: string;
};

type FormValidator<T> =
  | ((values: T) => FormErrors<T> | FormSubmitResult<T> | null | undefined)
  | undefined;

type UseFormSubmitOptions<T> = {
  schema?: SchemaValidator<T>;
  validate?: FormValidator<T>;
  validationError?: string;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: (values: T) => void | Promise<void>;
  onError?: (error: unknown, values: T) => FormSubmitResult<T> | void;
  errorFallback?: string;
};

type UseFormSubmitResult<T> = {
  status: FormStatus;
  formError: string | null;
  fieldErrors: FormErrors<T>;
  submit: (values: T) => Promise<{ ok: boolean }>;
  reset: () => void;
  setFormError: (value: string | null) => void;
  setFieldErrors: (value: FormErrors<T>) => void;
  clearFieldError: (key: keyof T) => void;
};

function toValidationResult<T>(
  result: FormErrors<T> | FormSubmitResult<T> | null | undefined
): FormSubmitResult<T> {
  if (!result) return {};
  if (typeof result === "object" && ("fieldErrors" in result || "formError" in result)) {
    return result as FormSubmitResult<T>;
  }
  return { fieldErrors: result as FormErrors<T> };
}

function hasFieldErrors<T>(errors: FormErrors<T>) {
  return Object.values(errors).some(Boolean);
}

export function useFormSubmit<T extends Record<string, unknown>>(
  options: UseFormSubmitOptions<T>
): UseFormSubmitResult<T> {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors<T>>({});

  const clearFieldError = useCallback((key: keyof T) => {
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setFormError(null);
    setFieldErrors({});
  }, []);

  const submit = useCallback(
    async (values: T) => {
      setFormError(null);
      const schemaErrors = options.schema ? parseForm(options.schema, values).errors : {};
      const validation = toValidationResult(options.validate?.(values));
      const mergedErrors = { ...schemaErrors, ...(validation.fieldErrors || {}) };
      const validationFailed = hasFieldErrors(mergedErrors) || Boolean(validation.formError);

      if (validationFailed) {
        setFieldErrors(mergedErrors);
        setFormError(validation.formError ?? options.validationError ?? null);
        setStatus("error");
        return { ok: false };
      }

      setStatus("submitting");
      setFieldErrors({});
      try {
        await options.onSubmit(values);
        setStatus("success");
        await options.onSuccess?.(values);
        return { ok: true };
      } catch (err) {
        const mapped = options.onError?.(err, values);
        if (mapped?.fieldErrors) {
          setFieldErrors(mapped.fieldErrors);
        }
        const nextError = mapped?.formError ?? options.errorFallback ?? null;
        setFormError(nextError);
        setStatus("error");
        return { ok: false };
      }
    },
    [options]
  );

  return useMemo(
    () => ({
      status,
      formError,
      fieldErrors,
      submit,
      reset,
      setFormError,
      setFieldErrors,
      clearFieldError,
    }),
    [clearFieldError, fieldErrors, formError, reset, status, submit]
  );
}

type FormMessageTone = "muted" | "error" | "success" | "warning";

const formMessageTone: Record<FormMessageTone, string> = {
  muted: "text-muted",
  error: "text-red-600",
  success: "text-primary",
  warning: "text-amber-700",
};

export function FormMessage({
  tone = "muted",
  className,
  children,
}: {
  tone?: FormMessageTone;
  className?: string;
  children: ReactNode;
}) {
  return <p className={cx("text-sm", formMessageTone[tone], className)}>{children}</p>;
}
