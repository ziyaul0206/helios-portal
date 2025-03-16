import { usePathname } from "next/navigation"

export const useActive = (href?: string): boolean => {
  if (!href) return false

  const pathname = usePathname()

  if (href === "/" && pathname === "/") {
    return true
  }

  if (href !== "/" && pathname.includes(href)) {
    return true
  }

  return false
}
