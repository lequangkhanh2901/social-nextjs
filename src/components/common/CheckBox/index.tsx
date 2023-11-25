import Image from 'next/image'
import tick from '~/public/icons/tick.svg'

interface Props {
  checked: boolean
  label: string
  disable?: boolean
  onChange?: (checked: boolean) => void
}

export default function CheckBox({ checked, label, disable, onChange }: Props) {
  const handleClick = () => {
    if (!disable && onChange) onChange(!checked)
  }

  return (
    <div
      className={`flex gap-2 items-center w-fit px-1 select-none ${
        disable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      <div
        className={`w-4 aspect-square rounded border border-common-gray-medium flex items-center justify-center ${
          checked ? 'bg-common-purble' : ''
        }`}
      >
        <Image src={tick} alt="" width={18} />
      </div>
      <span>{label}</span>
    </div>
  )
}
