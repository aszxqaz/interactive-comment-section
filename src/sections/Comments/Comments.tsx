import { useQuery } from "@tanstack/react-query"
import { UserContext } from "pages"
import { useContext, useMemo, useState } from "react"
import { getComments } from "client/api/fetchers"
import { ReplyPanel } from "src/components/ReplyPanel/ReplyPanel"
import { Comment } from "../../components"
import { BaseProps } from "../../components/types"
import { getClassName } from "../../utils/getClassName"
import { CommentsContext } from "./CommentsContext"
import { useCommentsMutations } from "./useCommentsMutations"
import { useCommentsQuery } from "client/api/useQueries"
import { BaseSpinner } from "src/components/Spinner/Spinner"

interface CommentsProps extends BaseProps {}

export const Comments = ({ className, style }: CommentsProps) => {
  const { data: comments = [], isLoading } = useCommentsQuery()
  const me = useContext(UserContext)
  const {
    handleCreateComment,
    handleCreateReply,
    handleDeleteComment,
    handleDeleteReply,
    handleUpdateComment,
    handleUpdateReply,
  } = useCommentsMutations()

  const [commentOrReplySelectedToReply, setCommentOrReplySelectedToReply] = useState<string | null>(
    null
  )
  const [commentOrReplyIdCreated, setCommentOrReplyIdCreated] = useState<string | null>(null)

  const voted = useMemo(() => {
    if (me?.username)
      return comments.map(comment =>
        comment.upvoted.includes(me.username)
          ? "upvoted"
          : comment.downvoted.includes(me.username)
          ? "downvoted"
          : undefined
      )
  }, [comments, me?.username])

  return isLoading ? (
    <BaseSpinner
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "scale(3) translate(-50%, -50%)",
        transformOrigin: "0 0",
      }}
    />
  ) : (
    <section className={getClassName(["comments", className])} style={style}>
      <CommentsContext.Provider
        value={{
          commentOrReplySelectedToReply,
          setCommentOrReplySelectedToReply,
          handleCreateReply,
          handleUpdateComment,
          handleUpdateReply,
          handleDeleteComment,
          handleDeleteReply,
          commentOrReplyIdCreated,
          setCommentOrReplyIdCreated,
        }}
      >
        {comments.map((comment, i) => (
          <Comment comment={comment} key={comment.id} voted={voted[i]} />
        ))}
      </CommentsContext.Provider>
      <ReplyPanel
        placeholder="Add a comment..."
        buttonText="Send"
        onSubmit={async content => {
          handleCreateComment({ content })
        }}
      />
    </section>
  )
}
