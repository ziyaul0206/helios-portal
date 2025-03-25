import { APP_THEME_COLOR } from "@/config/app"
import { MetadataSeo } from "@/lib/metadata"
import "@/styles/globals.scss"
import { Wrapper } from "./(components)/wrapper"
import { fonts } from "./fonts"
import ContextProvider from "@/context"
import { headers } from "next/headers"

export const metadata = MetadataSeo({
  title: "Dashboard",
  description: "Helios Dashboard"
})

export const viewport = {
  themeColor: APP_THEME_COLOR
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = (await headers()).get("cookie")

  return (
    <html lang="en" dir="ltr">
      <body className={fonts}>
        <ContextProvider cookies={cookies}>
          <Wrapper>{children}</Wrapper>
        </ContextProvider>
      </body>
    </html>
  )
}
