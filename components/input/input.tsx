"use client"

import { Icon } from "@/components/icon"
import { formatNumber } from "@/lib/utils/number"
import { Variants } from "@/types/Variants"
import { clsx } from "clsx"
import { forwardRef, InputHTMLAttributes, ReactNode } from "react"
import { Button } from "../button"
import s from "./input.module.scss"

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string
  icon?: string
  balance?: number
  showMaxButton?: boolean
  onMaxClick?: () => void
  className?: string
  error?: string
  helperText?: string
  helperVariant?: Variants
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      balance,
      showMaxButton = false,
      onMaxClick,
      className,
      error,
      helperVariant,
      helperText,
      startAdornment,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const handleFocusInput = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        e.currentTarget.querySelector("input")?.focus()
      }
    }

    return (
      <div className={clsx(s.wrapper, className)}>
        <div className={s.input} onClick={handleFocusInput}>
          {icon && <Icon icon={icon} className={s.icon} />}
          {startAdornment}
          <input ref={ref} className={s.value} {...props} />
          {endAdornment}
          {label && (
            <label className={s.label}>
              {label}
              {balance !== undefined && (
                <small>Balance: {formatNumber(balance)}</small>
              )}
            </label>
          )}
          {showMaxButton && (
            <Button
              className={s.max}
              onClick={onMaxClick}
              variant="secondary"
              size="xsmall"
            >
              Max
            </Button>
          )}
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

Input.displayName = "Input"
