"use client"

import { Icon } from "@/components/icon"
import { clsx } from "clsx"
import { forwardRef, ReactNode, SelectHTMLAttributes } from "react"
import s from "./input.module.scss"
import { Variants } from "@/types/feedback"

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label?: string
  icon?: string
  className?: string
  placeholder?: string
  error?: string
  helperText?: string
  helperVariant?: Variants
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  options: Array<{
    value: string
    label: string
  }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      icon,
      className,
      error,
      placeholder,
      helperVariant,
      helperText,
      startAdornment,
      endAdornment,
      options,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx(s.wrapper, className)}>
        {label && <label className={s.label}>{label}</label>}
        <div className={s.input}>
          {icon && <Icon icon={icon} className={s.icon} />}
          {startAdornment}
          <select ref={ref} className={s.value} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {endAdornment}
          <Icon icon="hugeicons:arrow-down-01" className={s.icon} />
        </div>
        {(error || helperText) && (
          <span
            className={s.helper}
            data-color={error ? "danger" : helperVariant}
          >
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"
