import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  href: string
  icon: string | StaticImageData
  activeIcon: string | StaticImageData
  alt: string
}

export default function NavigateItem({ href, icon, activeIcon, alt }: Props) {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      className="rounded hover:bg-common-gray-light py-3 grow flex justify-center duration-100"
    >
      <Image src={pathName === href ? activeIcon : icon} alt={alt} width={26} />
    </Link>
  )
}
