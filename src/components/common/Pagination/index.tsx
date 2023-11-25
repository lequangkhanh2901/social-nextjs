import { useRouter } from 'next/navigation'
import { updateSearchParam } from '~/helper/logic/method'
import Block from './Block'

interface Props {
  current: number
  total: number
  perPage: number
  updateRouter?: boolean
  searchParamName?: string
  onChange?: (page: number) => void
}

export default function Pagination({
  current,
  total,
  perPage,
  updateRouter = true,
  searchParamName = 'page',
  onChange
}: Props) {
  const router = useRouter()

  let isRenderPrev = false
  let isRenderNext = false

  const handlePrev = () => {
    handleChangePage(current - 1)
  }

  const handleNext = () => {
    handleChangePage(current + 1)
  }

  const handleChangePage = (page: number) => {
    if (onChange) onChange(page)
    if (updateRouter) {
      router.replace(updateSearchParam(searchParamName, page + ''))
    }
  }

  return (
    <div className="mt-5 flex gap-1">
      <Block label="<" onClick={handlePrev} disable={current === 1} />
      {[...Array(Math.ceil(total / perPage))].map((item, index) =>
        index + 1 > current - 3 && index + 1 < current + 3 ? (
          <Block
            key={index}
            label={index + 1}
            onClick={() => handleChangePage(index + 1)}
            active={current === index + 1}
          />
        ) : index + 1 <= current - 3 ? (
          !isRenderPrev ? (
            (() => {
              isRenderPrev = true
              return (
                <Block
                  label="..."
                  onClick={() => {
                    //
                  }}
                  disable
                  key={'prev'}
                />
              )
            })()
          ) : null
        ) : !isRenderNext ? (
          (() => {
            isRenderNext = true
            return (
              <Block
                key={'next'}
                label="..."
                onClick={() => {
                  //
                }}
                disable
              />
            )
          })()
        ) : null
      )}
      <Block
        label=">"
        onClick={handleNext}
        disable={current === Math.ceil(total / perPage)}
      />
    </div>
  )
}
