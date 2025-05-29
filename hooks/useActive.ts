import { usePathname } from "next/navigation"

export const useActive = (href?: string): boolean => {
  const pathname = usePathname()

  if (!href) return false

  if (href === "/" && pathname === "/") {
    return true
  }

  if (href !== "/" && pathname.includes(href)) {
    return true
  }

  return false
}
