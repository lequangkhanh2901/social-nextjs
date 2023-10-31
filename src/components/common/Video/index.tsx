import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { convertSecondsToHHMMSS } from '~/helper/logic/method'

import playActive from '~/public/icons/play_active.svg'
import playSolidWhite from '~/public/icons/play_solid_white.svg'
import pauseActive from '~/public/icons/pause_active.svg'
import pauseSolidWhite from '~/public/icons/pause-solid_white.svg'
import speaker from '~/public/icons/speaker_white.svg'
import muted from '~/public/icons/muted_white.svg'
import Action from './Action'

interface Props {
  src: string
  preload?: 'none' | 'auto' | 'metadata'
  className?: string
}

export default function Video({
  src,
  preload = 'metadata',
  className = ''
}: Props) {
  const [isShow, setIsShow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [speed, setSpeed] = useState(1)

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      videoRef.current?.pause()
    } else {
      setIsPlaying(true)
      videoRef.current?.play()
    }
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [speed])

  const toggleMuted = () => {
    if (isMuted) setIsMuted(false)
    else setIsMuted(true)
  }

  return (
    <div
      className={twMerge(
        'relative overflow-y-hidden overflow-x-visible',
        className
      )}
      onMouseEnter={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
    >
      <video
        ref={videoRef}
        preload={preload}
        className={twMerge('object-contain w-full h-full', className)}
        onPlaying={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        muted={isMuted}
      >
        <source src={src} />
      </video>
      {isPlaying ? (
        isShow && (
          <div
            className="absolute top-1/2 left-1/2 rounded-full w-14 h-14 flex justify-center items-center bg-[#00000040] hover:bg-[#00000080] duration-100 -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-[0_0_10px_#ffffff80]"
            onClick={handlePlay}
          >
            <Image
              src={isPlaying ? pauseActive : playActive}
              alt="play"
              width={30}
            />
          </div>
        )
      ) : (
        <div
          className="absolute top-1/2 left-1/2 rounded-full w-14 h-14 flex justify-center items-center bg-[#00000040] hover:bg-[#00000080] duration-100 -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-[0_0_10px_#ffffff80]"
          onClick={handlePlay}
        >
          <Image
            src={isPlaying ? pauseActive : playActive}
            alt="play"
            width={30}
          />
        </div>
      )}
      {isShow && (
        <div className="absolute bottom-0 inset-x-0 bg-[#000000aa] shadow-[0_0_10px_#000000aa] flex items-center py-1 px-2 gap-2">
          <button className="" onClick={handlePlay}>
            <Image
              src={isPlaying ? pauseSolidWhite : playSolidWhite}
              alt="play"
              width={20}
            />
          </button>
          <div className="flex grow items-center text-common-white gap-2">
            <span>{convertSecondsToHHMMSS(Math.round(currentTime))}</span>
            <input
              type="range"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current)
                  videoRef.current.currentTime = +e.target.value
              }}
              className="block grow bg-common-gray-dark appearance-none rounded-md h-2 cursor-pointer overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[0px] [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:shadow-[-999px_0_0_999px_#fff]"
            />
            <span>{convertSecondsToHHMMSS(Math.round(duration))}</span>
          </div>
          <div onClick={toggleMuted} className="cursor-pointer ml-auto">
            <Image src={isMuted ? muted : speaker} alt="" width={20} />
          </div>
          <Action speed={speed} setSpeed={setSpeed} />
        </div>
      )}
    </div>
  )
}
