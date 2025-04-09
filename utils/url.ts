import { CDN_URL } from "@/config/app"

export function getLogoByHash(logoHash: string): string {
  return CDN_URL + "/hash/" + logoHash
}
