import { getHttpErrorMeta, resolveHttpErrorMessage, type ErrorTranslationMap } from "@api-boilerplate/http/errors";

export type Translator = (key: string, params?: Record<string, string | number>) => string;

export type FieldErrorRule<TField extends string = string> = {
  field: TField;
  key: string;
};

export type FieldErrorMap<TField extends string = string> = Record<string, FieldErrorRule<TField>>;

export type ErrorContract<TField extends string = string> = {
  mapping?: ErrorTranslationMap;
  fieldMap?: FieldErrorMap<TField>;
};

export type ErrorPresentation<TField extends string = string> = {
  formError?: string;
  fieldErrors?: Partial<Record<TField, string>>;
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function resolveRule<TField extends string>(
  fieldMap: FieldErrorMap<TField>,
  value?: string
): FieldErrorRule<TField> | undefined {
  if (!value) return undefined;
  return fieldMap[normalizeKey(value)];
}

export function mapHttpFieldErrors<TField extends string>(
  err: unknown,
  t: Translator,
  fieldMap: FieldErrorMap<TField>
): Partial<Record<TField, string>> {
  const meta = getHttpErrorMeta(err);
  if (!meta) return {};
  if (meta.fields && meta.fields.length > 0) {
    const mapped: Partial<Record<TField, string>> = {};
    for (const entry of meta.fields) {
      const candidates: Array<string | undefined> = [];
      if (entry.field && entry.code) {
        candidates.push(`${entry.field}.${entry.code}`, `${entry.field}:${entry.code}`, `${entry.field}_${entry.code}`);
      }
      candidates.push(entry.code, entry.field, entry.message);
      for (const candidate of candidates) {
        const rule = resolveRule(fieldMap, candidate);
        if (rule) {
          mapped[rule.field] = t(rule.key);
          break;
        }
      }
    }
    if (Object.keys(mapped).length > 0) {
      return mapped;
    }
  }
  const candidates = [meta.code, meta.detail, meta.title].filter((value): value is string => typeof value === "string");
  for (const candidate of candidates) {
    const rule = resolveRule(fieldMap, candidate);
    if (rule) {
      return { [rule.field]: t(rule.key) } as Partial<Record<TField, string>>;
    }
  }
  return {};
}

export function presentHttpError<TField extends string>(
  err: unknown,
  t: Translator,
  fallback: string,
  contract?: ErrorContract<TField>
): ErrorPresentation<TField> {
  const fieldErrors = contract?.fieldMap ? mapHttpFieldErrors(err, t, contract.fieldMap) : {};
  const formError = resolveHttpErrorMessage(err, t, fallback, contract?.mapping);
  return {
    formError,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  };
}

export { resolveHttpErrorMessage, type ErrorTranslationMap };

export const membershipCreateErrorMap: ErrorTranslationMap = {
  codes: {
    company_limit_reached: "memberships.create.limit",
    limit_reached: "memberships.create.limit",
    membership_limit_reached: "memberships.create.limit",
    company_conflict: "memberships.create.conflict",
  },
  titles: {
    "company limit reached": "memberships.create.limit",
    "company already exists": "memberships.create.conflict",
    "limit reached": "memberships.create.limit",
  },
};

export const membershipRequestErrorMap: ErrorTranslationMap = {
  codes: {
    membership_limit_reached: "memberships.request.limit",
    limit_reached: "memberships.request.limit",
    company_not_found: "memberships.request.notFound",
    already_member: "memberships.request.alreadyMember",
    membership_request_pending: "memberships.request.pending",
  },
  titles: {
    "membership limit reached": "memberships.request.limit",
    "company not found": "memberships.request.notFound",
    "limit reached": "memberships.request.limit",
  },
  details: {
    "already a member": "memberships.request.alreadyMember",
    "membership request already pending": "memberships.request.pending",
  },
};
