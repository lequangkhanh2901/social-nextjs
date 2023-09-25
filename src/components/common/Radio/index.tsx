'use client'

import Item from './Item'

interface Props {
  label?: string
  listValue: { key: string; label: string }[]
  currentValue: string
  className?: string
  onChange: (key: string) => void
}

export default function Radio({
  label,
  listValue,
  currentValue,
  className,
  onChange
}: Props) {
  const handleClickItem = (key: string) => {
    if (key !== currentValue) onChange(key)
  }

  return (
    <div className={`py-2 ${className} `}>
      {label && (
        <>
          <label className="text-sm font-semibold py-2 inline-block">
            {label}
          </label>
        </>
      )}
      <div className="flex justify-evenly">
        {listValue.map((item) => (
          <Item
            key={item.key}
            label={item.label}
            onClick={() => handleClickItem(item.key)}
            checked={item.key === currentValue}
          />
        ))}
      </div>
    </div>
  )
}
