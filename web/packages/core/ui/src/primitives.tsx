"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import { cx } from "./cx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type LinkButtonProps = {
  href: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>;

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

type ButtonProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & (LinkButtonProps | NativeButtonProps);

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-surface shadow-soft border border-transparent hover:-translate-y-0.5 hover:bg-primary-strong",
  secondary:
    "bg-primary-soft text-muted-strong border border-primary-soft hover:-translate-y-0.5 hover:border-primary",
  ghost:
    "bg-surface text-muted-strong border border-border hover:border-primary",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-sm",
};

export function Button({
  children,
  className,
  icon,
  size = "lg",
  variant = "primary",
  ...rest
}: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:pointer-events-none",
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {icon}
        {children}
      </Link>
    );
  }

  const buttonProps = rest as NativeButtonProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      {...buttonProps}
    >
      {icon}
      {children}
    </button>
  );
}

type CardTone = "surface" | "muted";
type CardPadding = "md" | "lg";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
  padding?: CardPadding;
};

const cardTone: Record<CardTone, string> = {
  surface: "bg-surface",
  muted: "bg-surface-muted",
};

const cardPadding: Record<CardPadding, string> = {
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  className,
  tone = "surface",
  padding = "lg",
}: CardProps) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-border shadow-soft",
        cardTone[tone],
        cardPadding[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

type EyebrowProps = {
  children: ReactNode;
  tone?: "primary" | "muted";
};

export function Eyebrow({ children, tone = "primary" }: EyebrowProps) {
  const toneClass =
    tone === "primary"
      ? "bg-primary-soft text-primary"
      : "bg-surface-muted text-muted-strong";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase",
        toneClass
      )}
    >
      {children}
    </span>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-sm text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

type PillProps = {
  children: ReactNode;
  tone?: "muted" | "success";
};

export function Pill({ children, tone = "muted" }: PillProps) {
  const toneClass =
    tone === "success"
      ? "bg-primary-soft text-primary"
      : "bg-surface-muted text-muted-strong";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneClass
      )}
    >
      {children}
    </span>
  );
}

type FieldBaseProps = {
  label: string;
  hint?: string;
  error?: string;
  requiredLabel?: boolean;
  wrapperClassName?: string;
};

type FormFieldProps = FieldBaseProps & {
  children: ReactNode;
};

export function FormField({
  label,
  hint,
  error,
  requiredLabel,
  wrapperClassName,
  children,
}: FormFieldProps) {
  return (
    <div className={cx("flex flex-col gap-2 text-sm text-muted-strong", wrapperClassName)}>
      <span className="font-semibold">
        {label}
        {requiredLabel ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldBaseProps;

export function InputField({
  label,
  hint,
  className,
  error,
  requiredLabel,
  wrapperClassName,
  ...rest
}: InputFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error} requiredLabel={requiredLabel} wrapperClassName={wrapperClassName}>
      <input
        className={cx(
          "rounded-xl border bg-surface px-3 py-2 text-sm text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          error ? "border-red-500" : "border-border",
          className
        )}
        {...rest}
      />
    </FormField>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldBaseProps;

export function TextAreaField({
  label,
  hint,
  className,
  error,
  requiredLabel,
  wrapperClassName,
  rows,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error} requiredLabel={requiredLabel} wrapperClassName={wrapperClassName}>
      <textarea
        rows={rows ?? 4}
        className={cx(
          "min-h-[120px] resize-none rounded-xl border bg-surface px-3 py-2 text-sm text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          error ? "border-red-500" : "border-border",
          className
        )}
        {...rest}
      />
    </FormField>
  );
}

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldBaseProps & {
    options?: SelectOption[];
  };

export function SelectField({
  label,
  hint,
  className,
  error,
  requiredLabel,
  wrapperClassName,
  options,
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <FormField label={label} hint={hint} error={error} requiredLabel={requiredLabel} wrapperClassName={wrapperClassName}>
      <select
        className={cx(
          "rounded-xl border bg-surface px-3 py-2 text-sm text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          error ? "border-red-500" : "border-border",
          className
        )}
        {...rest}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    </FormField>
  );
}
