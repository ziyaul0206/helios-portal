import clsx from "clsx"
import localFont from "next/font/local"

const main = localFont({
  variable: "--font-main",
  display: "swap",
  preload: true,
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Variable.woff2",
      style: "normal",
      weight: "300 800"
    }
  ],
  fallback: ["system-ui", "Arial"]
})

export const fonts = clsx(main.variable)
