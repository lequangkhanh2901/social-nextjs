import { twMerge } from 'tailwind-merge'

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={twMerge('text-3xl text-common-purble', className)}>
      Khanhle
    </div>
  )
}
