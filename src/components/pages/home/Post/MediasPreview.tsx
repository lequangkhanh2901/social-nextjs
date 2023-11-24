import Image from 'next/image'
import { MediaType } from '~/helper/enum/post'
import { Media } from '~/helper/type/common'
import play from '~/public/icons/play_active.svg'

interface Props {
  medias: Media[]
  onClick: () => void
}

export default function MediasPreview({ medias, onClick }: Props) {
  return (
    <div className="flex flex-wrap cursor-pointer mt-1" onClick={onClick}>
      {medias.length === 1 ? (
        medias[0].type === MediaType.IMAGE ? (
          <Image
            src={medias[0].cdn}
            alt=""
            width={800}
            height={500}
            className="w-full max-h-[80vh] object-cover"
          />
        ) : (
          <video
            src={medias[0].cdn}
            preload="metadata"
            className="aspect-square w-full object-cover"
          ></video>
        )
      ) : (
        medias.map((media, index) => {
          if (index > 3) return null
          if (index === 3) {
            return (
              <div className="w-1/2 relative" key={media.id}>
                {media.type === MediaType.IMAGE ? (
                  <Image
                    alt=""
                    src={media.cdn}
                    width={800}
                    height={500}
                    className="aspect-square object-cover"
                  />
                ) : (
                  <video className="w-full h-full object-cover">
                    <source src={media.cdn} />
                  </video>
                )}
                {medias.length > 4 ? (
                  <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] text-[60px] flex justify-center items-center text-common-white drop-shadow-[0_1px_2px_#aaaaaa] font-bold">
                    {medias.length - 4}+
                  </div>
                ) : (
                  media.type === MediaType.VIDEO && (
                    <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] flex justify-center items-center">
                      <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#aaaaaaaa]">
                        <Image src={play} alt="play" width={24} />
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          }

          return (
            <div key={media.id} className="w-1/2 aspect-square relative">
              {media.type === MediaType.IMAGE ? (
                <Image
                  alt=""
                  src={media.cdn}
                  width={800}
                  height={500}
                  className="aspect-square object-cover"
                />
              ) : (
                <>
                  <video
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    <source src={media.cdn} />
                  </video>
                  <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] flex justify-center items-center">
                    <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#aaaaaaaa]">
                      <Image src={play} alt="play" width={24} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
