"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { FieldConfig } from "./field-config";
import type { RefundFormValues } from "./field-config";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/10";

export function FieldRenderer({
  field,
  control,
  errors,
}: {
  field: FieldConfig;
  control: Control<RefundFormValues>;
  errors: FieldErrors<RefundFormValues>;
}) {
  const name = field.name as keyof RefundFormValues;
  const error = errors[name]?.message as string | undefined;
  const borderClass = error ? "border-red-300" : "border-slate-200";

  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-semibold text-slate-800">
        {field.label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field: rhf }) => {
          switch (field.type) {
            case "textarea":
              return (
                <textarea
                  {...rhf}
                  id={field.name}
                  rows={4}
                  placeholder={field.placeholder}
                  className={`${inputBase} ${borderClass} resize-none`}
                />
              );
            case "select":
              return (
                <select
                  {...rhf}
                  id={field.name}
                  className={`${inputBase} ${borderClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              );
            default:
              return (
                <input
                  {...rhf}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`${inputBase} ${borderClass}`}
                />
              );
          }
        }}
      />

      {field.helperText && !error && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{field.helperText}</p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
