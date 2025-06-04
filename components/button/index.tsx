"use client"

import { Sizes } from "@/types/Sizes"
import clsx from "clsx"
import { ReactNode } from "react"
import { Icon } from "../icon"
import { Link } from "../link"
import { Logotype } from "../logotype"
import s from "./button.module.scss"
import { Variants } from "@/types/feedback"

export interface ButtonProps {
  children?: ReactNode
  icon?: string | "logo"
  iconRight?: string | "logo"
  iconLeft?: string | "logo"
  href?: string
  className?: string
  classNameIcon?: string
  classNameActive?: string
  disabled?: boolean
  border?: boolean
  variant?: Variants
  size?: Sizes
  hovering?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  isActive?: boolean
  isNav?: boolean
}

export const Button = ({
  children,
  icon,
  iconRight,
  iconLeft,
  href,
  className,
  onClick,
  disabled = false,
  border = false,
  variant = "primary",
  size = "medium",
  hovering = false,
  isActive = false,
  classNameActive,
  classNameIcon,
  isNav = false,
  ...props
}: ButtonProps) => {
  const classIcon = clsx(s.icon, classNameIcon)
  const IconLeft =
    iconLeft &&
    (iconLeft === "logo" ? (
      <Logotype className={classIcon} data-icon data-icon-left />
    ) : (
      <Icon icon={iconLeft} className={classIcon} data-icon data-icon-left />
    ))

  const IconRight =
    (iconRight || icon) &&
    (iconRight === "logo" || icon === "logo" ? (
      <Logotype className={classIcon} data-icon data-icon-right />
    ) : (
      <Icon
        icon={iconRight || icon || ""}
        className={classIcon}
        data-icon
        data-icon-right
      />
    ))

  const Content = (
    <>
      {IconLeft}
      {children}
      {IconRight}
    </>
  )

  if (!children) {
  }

  const classNames = clsx(
    s.btn,
    className,
    border && s.border,
    !children && s.iconOnly,
    hovering && s.hovering,
    isActive && classNameActive,
    isNav && s.nav
  )

  const attrs = {
    className: classNames,
    "data-variant": variant,
    "data-size": size,
    "data-active": isActive,
    "data-nav": isNav,
    onClick,
    disabled
  }

  if (href) {
    return (
      <Link
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...attrs}
        href={!disabled ? href : ""}
      >
        {Content}
      </Link>
    )
  } else {
    return (
      <button
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        {...attrs}
      >
        {Content}
      </button>
    )
  }
}
