import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { toast } from 'react-hot-toast'
import { getRequest } from '~/services/client/getRequest'
import CommentItem from './CommentItem'

interface Props {
  idPost: string
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
}

// interface ConvertedComment extends Comment {
//   childrenComment: Comment[]
// }

export interface CommentsRef {
  addComment: (comment: Comment) => void
}

function Comments({ idPost }: Props, ref: Ref<CommentsRef>) {
  const [comments, setComments] = useState<Comment[]>([])

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

  // const convertComments = useMemo(() => {
  //   const data: ConvertedComment[] = []
  //   const canceled: Comment[] = [...comments]

  //   const handleds: { id: number; level: number; link: number[] }[] = []

  //   while (canceled.length > 0) {
  //     canceled.forEach((comment, index) => {
  //       if (comment.parent) {
  //         const handledItem = handleds.find(
  //           (item) => item.id === comment.parent?.id
  //         )
  //         if (handledItem) {
  //           if (handledItem.level === 1) {
  //             const cmt = data.find(
  //               (dataComment) => dataComment.id === handledItem.id
  //             ) as ConvertedComment
  //             cmt.childrenComment = [...(cmt.childrenComment || []), comment]
  //             handleds.push({
  //               id: comment.id,
  //               level: 2,
  //               link: [cmt.id, comment.id]
  //             })
  //             canceled.splice(index, 1)
  //           }

  //           if (handledItem.level === 2) {
  //             const cmt = data
  //               .find((dataCmt) => dataCmt.id === handledItem.link[0])
  //               ?.childrenComment.find(
  //                 (childComment) => childComment.id === handledItem.link[1]
  //               ) as ConvertedComment

  //             cmt.childrenComment = [...(cmt.childrenComment || []), comment]
  //             handleds.push({
  //               id: comment.id,
  //               level: 3,
  //               link: [...handledItem.link, comment.id]
  //             })
  //             canceled.splice(index, 1)
  //           }
  //         } else {
  //           return
  //         }
  //       } else {
  //         handleds.push({
  //           id: comment.id,
  //           level: 1,
  //           link: []
  //         })

  //         const [cmt] = canceled.splice(index, 1)
  //         data.push(cmt as ConvertedComment)
  //       }
  //     })
  //   }
  //   return data
  // }, [comments])

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
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          porstId={idPost}
          onLike={(id, message) => handleLike(id, message)}
        />
        // <div key={comment.id} className="flex gap-2 mt-3">
        //   <div>
        //     <Avatar src={comment.user.avatarId.cdn} width={36} />
        //   </div>
        //   <div>
        //     <div className="w-fit p-1 px-3 rounded-xl bg-common-gray-light">
        //       <Link
        //         href={`/user/${comment.user.username}`}
        //         className="font-bold"
        //       >
        //         {comment.user.name}
        //       </Link>
        //       <p>{comment.content}</p>
        //     </div>
        //     <div className="flex gap-4 text-xs font-semibold text-common-gray-dark px-3">
        //       <div
        //         className={`cursor-pointer ${
        //           comment.likeData.isLiked ? 'text-common-purble' : ''
        //         }`}
        //         onClick={() => handleLikeComment(comment.id)}
        //       >
        //         Like
        //       </div>
        //       <div
        //         className={`cursor-pointer `}
        //         // onClick={() => handleLikeComment(comment.id)}
        //       >
        //         Reply
        //       </div>
        //     </div>
        //   </div>
        // </div>
      ))}
    </div>
  )
}

export default forwardRef(Comments)
