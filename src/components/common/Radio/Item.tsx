interface Props {
  label: string
  checked?: boolean
  onClick: () => void
}

export default function Item({ label, checked, onClick }: Props) {
  return (
    <div className="cursor-pointer">
      <div className="flex items-center gap-1" onClick={onClick}>
        <div
          className={`rounded-full h-4 w-4 border border-common-gray-dark hover:border-common-purble duration-100 ${
            checked ? 'bg-common-purble' : ''
          }`}
        ></div>
        <span>{label}</span>
      </div>
    </div>
  )
}
