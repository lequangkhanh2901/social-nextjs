import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { toast } from 'react-hot-toast'
import { getRequest } from '~/services/client/getRequest'
import Select from '~/components/common/Select'
import CommentItem from './CommentItem'
import { MediaType } from '~/helper/enum/post'

interface Props {
  idPost: string
  onDeletComment: (total: number) => void
}

export interface Comment {
  id: number
  content?: string
  createdAt: string
  user: {
    name: string
    username: string
    avatarId: {
      cdn: string
    }
  }
  children: {
    id: number
  }[]
  parent: null | {
    id: number
  }
  likeData: {
    total: number
    isLiked: boolean
  }
  media?: {
    id: string
    cdn: string
    type: MediaType
  }
}

interface ConvertedComment extends Comment {
  childrenComment: ConvertedComment[]
}

export interface CommentsRef {
  addComment: (comment: Comment) => void
}

function Comments({ idPost, onDeletComment }: Props, ref: Ref<CommentsRef>) {
  const [comments, setComments] = useState<Comment[]>([])
  const [sort, setSort] = useState<'NEWEST_FIRST' | 'OLDEST_FIRST'>(
    'NEWEST_FIRST'
  )

  const addComment = (comment: Comment) => {
    setComments((prev) => [comment, ...prev])
  }

  useImperativeHandle(ref, () => ({
    addComment
  }))

  useEffect(() => {
    // fetch comment
    ;(async () => {
      try {
        const data: any = await getRequest(`/comment/${idPost}`)

        setComments(data)
      } catch (error) {
        toast.error('Server error')
      }
    })()
  }, [])

  const convertedComments = useMemo(() => {
    const data: ConvertedComment[] = []
    const canceled: Comment[] = [...comments]
    const handleds: { id: number; level: number; link: number[] }[] = []

    while (canceled.length > 0) {
      canceled.forEach((comment, index) => {
        if (comment.parent) {
          const handledItem = handleds.find(
            (item) => item.id === comment.parent?.id
          )
          if (handledItem) {
            if (handledItem.level === 1) {
              const cmt = data.find(
                (dataComment) => dataComment.id === handledItem.id
              ) as ConvertedComment
              cmt.childrenComment = [
                ...(cmt.childrenComment || []),
                { ...comment, childrenComment: [] }
              ]
              handleds.push({
                id: comment.id,
                level: 2,
                link: [cmt.id, comment.id]
              })
              canceled.splice(index, 1)
            }

            if (handledItem.level === 2) {
              const cmt = data
                .find((dataCmt) => dataCmt.id === handledItem.link[0])
                ?.childrenComment.find(
                  (childComment) => childComment.id === handledItem.link[1]
                ) as ConvertedComment

              cmt.childrenComment = [
                ...(cmt.childrenComment || []),
                comment as ConvertedComment
              ]
              handleds.push({
                id: comment.id,
                level: 3,
                link: [...handledItem.link, comment.id]
              })
              canceled.splice(index, 1)
            }
          } else {
            return
          }
        } else {
          handleds.push({
            id: comment.id,
            level: 1,
            link: []
          })

          const [cmt] = canceled.splice(index, 1)
          data.push({ ...cmt, childrenComment: [] } as ConvertedComment)
        }
      })
    }

    data.sort((a, b) => (sort === 'NEWEST_FIRST' ? b.id - a.id : a.id - b.id))
    data.forEach((comments) => {
      comments.childrenComment.forEach((subChildComments) => {
        subChildComments.childrenComment.sort((a, b) => a.id - b.id)
      })
      comments.childrenComment.sort((a, b) => a.id - b.id)
    })

    return data
  }, [comments, sort])

  const handleLike = (id: number, message: string) => {
    setComments((prev) => {
      const comment = prev.find((cmt) => cmt.id === id) as Comment
      comment.likeData.total =
        message === 'LIKED'
          ? comment.likeData.total + 1
          : comment.likeData.total - 1
      comment.likeData.isLiked = message === 'LIKED'

      return [...prev]
    })
  }

  return (
    <>
      {convertedComments.length > 0 && (
        <div className="w-fit ml-auto my-1 mt-2">
          <Select
            data={[
              {
                key: 'NEWEST_FIRST',
                label: 'Newest first'
              },
              {
                key: 'OLDEST_FIRST',
                label: 'Oldest first'
              }
            ]}
            currentActiveKey={sort}
            onChange={(key) => setSort(key as typeof sort)}
            passClass="w-[120px] text-sm font-semibold border-0 rounded-full bg-common-gray-light py-[2px] hover:bg-common-gray-medium duration-100"
            itemClassName="font-medium"
            trigger="click"
          />
        </div>
      )}

      {convertedComments.map((comment) => (
        <>
          <CommentItem
            key={comment.id}
            comment={comment}
            porstId={idPost}
            onLike={(id, message) => handleLike(id, message)}
            setComments={setComments}
            onDeletComment={onDeletComment}
          />
          {comment?.childrenComment.length > 0 &&
            comment.childrenComment.map((childComment) => (
              <>
                <CommentItem
                  key={childComment.id}
                  comment={childComment}
                  onLike={(id, message) => handleLike(id, message)}
                  porstId={idPost}
                  level={2}
                  setComments={setComments}
                  onDeletComment={onDeletComment}
                />
                {childComment.childrenComment.map((subChildComment) => (
                  <CommentItem
                    key={subChildComment.id}
                    comment={subChildComment}
                    porstId={idPost}
                    level={3}
                    onLike={(id, message) => handleLike(id, message)}
                    setComments={setComments}
                    onDeletComment={onDeletComment}
                  />
                ))}
              </>
            ))}
        </>
      ))}
    </>
  )
}

export default forwardRef(Comments)
