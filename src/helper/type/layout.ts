import { StaticImageData } from 'next/image'

interface SideBarMenu {
  key: number | string
  icon: StaticImageData | string
  label: string
  link: string
}

export type { SideBarMenu }
