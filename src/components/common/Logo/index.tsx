import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export default function Logo({
  className,
  href = '/'
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={twMerge('text-3xl text-common-purble block', className)}
    >
      KAN
    </Link>
  )
}
