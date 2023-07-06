import Image from 'next/image'
import Link from 'next/link'
import logo from '~/public/next.svg'

function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`h-14 p-1 ${className}`}>
      <Link href={'/'} className="h-full flex items-center">
        <Image src={logo} alt="" className=" h-full" />
      </Link>
    </div>
  )
}

export default Logo
