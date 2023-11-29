import Image from 'next/image'
import loadingIcon from '~/public/icons/loading-dots.svg'

interface SwitchProps {
  active: boolean
  passClass?: string
  loading?: boolean
  onChange: (e: any) => void
}

function Switch({ active, passClass = '', loading, onChange }: SwitchProps) {
  const handleChange = () => {
    onChange(!active)
  }

  return (
    <div
      className={`w-10 h-5 bg-common-gray-light border border-common-gray-dark rounded-full overflow-hidden relative ${passClass} duration-300 hover:shadow-sm hover:shadow-common-purble ${
        loading ? '' : 'cursor-pointer'
      }`}
      onClick={handleChange}
    >
      <div
        className={`duration-300 h-full ${
          active ? 'w-full' : 'w-0'
        } bg-common-purble`}
      ></div>
      <span
        className={`block absolute top-0 duration-300 ${
          active ? 'right-0' : 'right-[calc(100%-18px)]'
        } bg-[#fff] h-[18px] w-[18px] rounded-full`}
      ></span>
      {loading && (
        <div className="absolute h-full w-full top-0 left-0 flex justify-center items-center bg-[#ffffff20] rounded-full backdrop-blur-[1px]">
          <Image
            src={loadingIcon}
            alt=""
            width={10}
            className="animate-loading-rolling"
          />
        </div>
      )}
    </div>
  )
}

export default Switch
