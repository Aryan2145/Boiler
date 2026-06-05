"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const FIELD_BASE =
  "w-full border bg-white px-3.5 text-base text-navy-900 placeholder:text-navy-400 transition-colors focus:outline-2 focus:outline-offset-1";

function fieldClasses(error?: string) {
  return error
    ? `${FIELD_BASE} border-red-600 focus:outline-red-700`
    : `${FIELD_BASE} border-navy-300 hover:border-navy-400 focus:outline-navy-700`;
}

type WrapperProps = {
  label: string;
  error?: string;
  hint?: string;
};

function FieldWrapper({
  label,
  error,
  hint,
  htmlFor,
  errorId,
  children,
}: WrapperProps & {
  htmlFor: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-semibold uppercase tracking-wide text-navy-700"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-navy-500">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  label,
  error,
  hint,
  className = "",
  ...rest
}: WrapperProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id} errorId={errorId}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`h-11 ${fieldClasses(error)} ${className}`}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  ...rest
}: WrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id} errorId={errorId}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-24 py-2.5 ${fieldClasses(error)} ${className}`}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  hint,
  className = "",
  children,
  ...rest
}: WrapperProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id} errorId={errorId}>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`h-11 ${fieldClasses(error)} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
