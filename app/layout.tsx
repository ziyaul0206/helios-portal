import { APP_THEME_COLOR } from "@/config/app"
import { MetadataSeo } from "@/lib/metadata"
import "@/styles/globals.scss"
import { Wrapper } from "./(components)/wrapper"
import { fonts } from "./fonts"
import ContextProvider from "@/context"
import { headers } from "next/headers"
import { NewsBanner } from "./(components)/news-banner"

export const metadata = MetadataSeo({
  title: "Your Gateway to Staking, Delegation & Cross-Chain Governance",
  description:
    "Enter the Helios Portal — your unified access point for staking, delegation, cross-chain governance, and token bridging. Power the next era of decentralized coordination."
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
      <body className={fonts} style={{ paddingTop: 60 }}>
        <NewsBanner />
        <ContextProvider cookies={cookies}>
          <Wrapper>{children}</Wrapper>
        </ContextProvider>
      </body>
    </html>
  )
}
