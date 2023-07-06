import { useState } from 'react'

interface SwitchProps {
  active?: boolean
  passClass?: string
  onChange?: (e: any) => void
}

function Switch({ active, passClass = '', onChange }: SwitchProps) {
  const [isActive, setIsActive] = useState<boolean>(active || false)

  const handleChange = () => {
    if (onChange) {
      onChange(!isActive)
    }
    setIsActive(!isActive)
  }

  return (
    <div
      className={`w-10 h-5 bg-common-gray-light border border-common-gray-dark rounded-full overflow-hidden relative ${passClass} cursor-pointer duration-300 hover:shadow-sm hover:shadow-common-purble`}
      onClick={handleChange}
    >
      <div
        className={`duration-300 h-full ${
          isActive ? 'w-full' : 'w-0'
        } bg-common-purble`}
      ></div>
      <span
        className={`block absolute top-0 duration-300 ${
          isActive ? 'right-0' : 'right-[calc(100%-18px)]'
        } bg-[#fff] h-[18px] w-[18px] rounded-full`}
      ></span>
    </div>
  )
}

export default Switch
