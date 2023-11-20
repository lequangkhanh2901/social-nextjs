import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Document, Page, pdfjs } from 'react-pdf'

import { MediaType } from '~/helper/enum/post'
import { Media } from '~/helper/type/common'
import { getRequest } from '~/services/client/getRequest'

import Modal from '~/components/common/Modal/Modal'
import Video from '~/components/common/Video'
import Button from '~/components/common/Button'

import play from '~/public/icons/play_solid_white.svg'
import close from '~/public/icons/close_white.svg'
import doc from '~/public/icons/document.svg'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString()

export default function Media() {
  const conversationId = useParams().conversationId as string

  const [medias, setMedias] = useState<Media[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState({
    src: '',
    type: MediaType.IMAGE
  })
  const [totalPages, setTotalPages] = useState<number>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data: any = await getRequest(
          `/conversation/${conversationId}/medias`,
          {
            params: {
              limit: 10,
              skip: (page - 1) * 10
            }
          }
        )
        setMedias((prev) => [...prev, ...data.medias])
        setTotal(data.count)
      } catch (error) {
        toast.error('Server error')
      } finally {
        setLoading(false)
      }
    })()
  }, [page])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
  }

  return (
    <>
      <div className="px-1 max-h-[100vh] flex flex-col pb-5">
        <h3 className="text-xl font-medium text-center py-2">
          Medias in chats
        </h3>
        <div className="flex flex-wrap justify-between gap-y-2 grow overflow-y-auto">
          {medias.map((media) => (
            <div
              key={media.id}
              className="w-[48%] aspect-square rounded relative cursor-pointer"
              onClick={() =>
                setView({
                  src: media.cdn,
                  type: media.type
                })
              }
            >
              {media.type === MediaType.IMAGE ? (
                <Image
                  src={media.cdn}
                  alt=""
                  fill
                  className="object-cover rounded"
                />
              ) : media.type === MediaType.PDF ? (
                <div className="w-full h-full flex items-center justify-center bg-common-gray-light rounded">
                  <div className="relative w-2/3 aspect-square">
                    <Image src={doc} alt="" fill className="opacity-30" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl flex w-12 aspect-square rounded-full text-common-gray-dark backdrop-blur-[1px] bg-[#ffffff80] items-center justify-center">
                      PDF
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <video
                    src={media.cdn}
                    preload="metadata"
                    className="w-full h-full rounded object-cover"
                  />
                  <div className="p-2 rounded-full bg-common-gray-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image src={play} width={20} alt="play" />
                  </div>
                </div>
              )}
            </div>
          ))}
          {total > medias.length && (
            <Button
              title="Load more"
              isOutline
              passClass="w-full mt-3"
              loadding={loading}
              onClick={() => {
                if (!loading) setPage((prev) => prev + 1)
              }}
            />
          )}
        </div>
      </div>
      <Modal
        isOpen={!!view.src}
        onRequestClose={() => setView((prev) => ({ ...prev, src: '' }))}
      >
        <div className="max-h-[90vh] max-w-[90vw] w-[90vw] h-[90vh] relative group flex justify-center items-center">
          {view.type === MediaType.IMAGE ? (
            <Image
              fill
              src={view.src}
              alt=""
              className="object-contain rounded-[inherit]"
            />
          ) : view.type === MediaType.PDF ? (
            <div className="overflow-y-auto max-h-full border border-common-purble">
              <Document file={view.src} onLoadSuccess={onDocumentLoadSuccess}>
                {[...Array(totalPages)]
                  .map((x, i) => i + 1)
                  .map((page) => (
                    <Page
                      key={page}
                      pageNumber={page}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
              </Document>
            </div>
          ) : (
            <Video src={view.src} className="max-w-full max-h-full" />
          )}
          <div
            className="absolute top-3 right-3 w-10 aspect-square rounded-full bg-[#00000080] cursor-pointer justify-center items-center hidden group-hover:flex opacity-40 hover:opacity-90"
            onClick={() => setView((prev) => ({ ...prev, src: '' }))}
          >
            <Image src={close} alt="" width={20} />
          </div>
        </div>
      </Modal>
    </>
  )
}
