'use client'

import Image, { StaticImageData } from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Props {
  href: string
  icon: string | StaticImageData
  activeIcon: string | StaticImageData
  alt: string
  developing?: true
}

export default function NavigateItem({
  href,
  icon,
  activeIcon,
  alt,
  developing
}: Props) {
  const pathName = usePathname()
  const router = useRouter()

  const handleClick = () => {
    if (developing) {
      toast.success('Developing')
    } else {
      router.replace(href)
    }
  }

  return (
    <div
      className="rounded hover:bg-common-gray-light py-3 grow flex justify-center duration-100"
      onClick={handleClick}
    >
      <Image src={pathName === href ? activeIcon : icon} alt={alt} width={26} />
    </div>
  )
}
