import type { ReactNode } from "react";

export const adminInputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-dark-black placeholder:text-neutral-400 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-dark-black">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue = "",
  placeholder,
  type = "text",
  required,
  hint,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint} className={className}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={adminInputClass}
      />
    </Field>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue = "",
  rows = 4,
  hint,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint} className={className}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={`${adminInputClass} font-mono text-sm`}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  hint,
  className,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint} className={className}>
      <select id={name} name={name} defaultValue={defaultValue} className={adminInputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-3 text-sm font-bold text-dark-black">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 accent-[#d4af37]"
        />
        {label}
      </label>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}
