import { z } from "zod";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormValidationResult<T> = {
  data?: T;
  errors: FormErrors<T>;
  valid: boolean;
};

export type SchemaValidator<TOutput> = {
  safeParse: (
    values: unknown
  ) =>
    | { success: true; data: TOutput }
    | { success: false; error?: z.ZodError<unknown> }
    | unknown;
};

export function toFormErrors<T extends Record<string, unknown>>(error: z.ZodError<unknown>): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    const typedKey = key as keyof T;
    if (errors[typedKey]) continue;
    errors[typedKey] = issue.message;
  }
  return errors;
}

export function parseForm<TOutput extends Record<string, unknown>>(
  schema: SchemaValidator<TOutput>,
  values: unknown
): FormValidationResult<TOutput> {
  const result = schema.safeParse(values) as
    | { success: true; data: TOutput }
    | { success: false; error?: z.ZodError<unknown> };

  if (result.success) {
    return { data: result.data, errors: {}, valid: true };
  }
  const errors = result.error ? toFormErrors<TOutput>(result.error) : {};
  return { errors, valid: false };
}

export { z };
