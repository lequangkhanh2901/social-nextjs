import { Dispatch, SetStateAction } from 'react'
import usePopup from '~/helper/hooks/usePopup'

interface Props {
  speed: number
  setSpeed: Dispatch<SetStateAction<number>>
}

const speeds = [0.25, 0.5, 1, 1.25, 1.5, 2]

export default function SetSpeed({ speed, setSpeed }: Props) {
  const { isShow, togglePopup } = usePopup()

  return (
    <div
      className="hover:bg-common-gray-light duration-100 px-3 py-1 rounded relative select-none"
      onClick={togglePopup}
    >
      Speed: {speed}x
      {isShow && (
        <div className="absolute right-full bottom-0 bg-common-white shadow-[0_0_6px_#eeeeee90] w-[100px] p-1 rounded ">
          {speeds.map((speed) => (
            <div
              key={speed}
              className="hover:bg-common-gray-light p-1"
              onClick={() => setSpeed(speed)}
            >
              {speed}x
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
