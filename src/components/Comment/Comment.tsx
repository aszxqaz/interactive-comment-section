import { UserContext } from "pages"
import { memo, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react"
import { CommentsContext } from "src/sections/Comments/CommentsContext"
import { useVotesMutations } from "src/sections/hooks/useVotesMutations"
import { setOutsideClickHandler } from "src/utils/setOutsideClickHandler"
import { CommentServerResponse, ReplyServerResponse } from "../../../server/server-response.types"
import { getClassName } from "../../utils/getClassName"
import { timeSince } from "../../utils/timeSince"
import { Avatar } from "../Avatar/Avatar"
import {
  DeleteCommentButton,
  EditCommentButton,
  ReplyCommentButton,
} from "../CommentButtons/CommentButton"
import { useDialog } from "../Modal/useDialog"
import { ReplyPanel } from "../ReplyPanel/ReplyPanel"
import { Score } from "../Score/Score"
import { BaseSpinner } from "../Spinner/Spinner"
import { BaseProps } from "../types"
import styles from "./Comment.module.scss"

interface CommentProps extends BaseProps {
  comment: CommentServerResponse | ReplyServerResponse
  voted: "upvoted" | "downvoted" | undefined
  children?: ReactNode
}

function getIsReply(
  comment: CommentServerResponse | ReplyServerResponse
): comment is ReplyServerResponse {
  if ("replyingTo" in comment) return true
  return false
}

let Comment = ({ className, style, comment, children, voted }: CommentProps) => {
  const panelRef = useRef<HTMLDivElement>()
  const showDialog = useDialog()
  const me = useContext(UserContext)
  const {
    commentOrReplySelectedToReply,
    setCommentOrReplySelectedToReply,
    commentOrReplyIdCreated,
    setCommentOrReplyIdCreated,
    handleCreateReply,
    handleUpdateComment,
    handleUpdateReply,
    handleDeleteComment,
    handleDeleteReply,
  } = useContext(CommentsContext)
  const { handleVoteComment, handleVoteReply } = useVotesMutations(me.username)
  const [isReplyClicked, setIsReplyClicked] = useState(false)
  const [isEditingMode, setIsEditingMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCommentActuallyReply = getIsReply(comment)
  const _className = isCommentActuallyReply ? "reply" : "comment"
  const { content, createdAt, id, score, user, upvoted, downvoted } = comment
  const isAuthor = comment.user.username === me.username

  const containerRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (comment.id === commentOrReplyIdCreated) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [commentOrReplyIdCreated, comment.id])

  const repliesVoted = useMemo(() => {
    return !isCommentActuallyReply
      ? comment.replies?.map(reply =>
          reply.upvoted.includes(me.username)
            ? "upvoted"
            : reply.downvoted.includes(me.username)
            ? "downvoted"
            : undefined
        )
      : null
  }, [isCommentActuallyReply, comment, me.username])

  const handleVote = (isUp: boolean) => {
    if (isCommentActuallyReply) {
      handleVoteReply({ replyId: comment.id, isUp })
    } else {
      handleVoteComment({ commentId: comment.id, isUp })
    }
  }

  const handleUpdate = async (content: string) => {
    if (isCommentActuallyReply) {
      await handleUpdateReply({ replyId: comment.id, content })
    } else {
      await handleUpdateComment({ commentId: comment.id, content })
    }
  }

  return (
    <article className={getClassName([_className, className])}>
      <div
        ref={containerRef}
        className={getClassName([
          `${_className}__container`,
          {
            created: commentOrReplyIdCreated === comment.id,
          },
        ])}
      >
        {isSubmitting && <BaseSpinner className={`${_className}__spinner`} />}
        <div className={`${_className}__main`}>
          <div className={`${_className}__header ${styles["message-header"]}`}>
            <Avatar
              className={`${_className}__avatar ${styles["message-header__avatar"]}`}
              size="sm"
              image={user.image}
              alt={user.username}
            />
            <span className={`${_className}__username ${styles["message-header__username"]}`}>
              {user.username}
            </span>
            {user.username === me.username && <span className={`${_className}__you`}></span>}
            <span className={`${_className}__createdAt`}>{timeSince(new Date(createdAt))}</span>
          </div>
          {isEditingMode ? (
            <ReplyPanel
              style={{ flexDirection: "column", padding: 0 }}
              placeholder=""
              showAvatar={false}
              autoFocus
              buttonText="Update"
              replyTo={comment.user.username}
              initialContent={comment.content}
              onSubmit={async content => {
                setIsSubmitting(true)
                await handleUpdate(content)
                setIsSubmitting(false)
                setIsEditingMode(false)
              }}
            />
          ) : (
            <p className={`${_className}__text`}>
              {isCommentActuallyReply && (
                <span className={`${_className}__replying`}>@{comment.replyingTo}</span>
              )}{" "}
              {content}
            </p>
          )}
        </div>
        <div className={`${_className}__secondary`}>
          <Score
            className={`${_className}__score`}
            voted={voted}
            score={score}
            isScoreMinusDisabled={isAuthor}
            isScorePlusDisabled={isAuthor}
            onScoreMinus={() => {
              handleVote(false)
            }}
            onScorePlus={() => {
              handleVote(true)
            }}
          />
          <div className={`${_className}__controls`}>
            {!isAuthor && (
              <ReplyCommentButton
                onClick={e => {
                  console.log("here")
                  e.stopPropagation()
                  setCommentOrReplySelectedToReply(comment.id)
                  setOutsideClickHandler(
                    () => panelRef.current,
                    () => {
                      console.log(panelRef.current)
                      setCommentOrReplySelectedToReply(null)
                    }
                  )
                }}
                className={`${_className}__controls-btn`}
              />
            )}
            {isAuthor && (
              <>
                <DeleteCommentButton
                  onClick={async () => {
                    showDialog({
                      isOpened: true,
                      secondaryBtnText: "No, cancel",
                      primaryBtnText: "Yes, delete",
                      primaryBtnType: "danger",
                      text: "Are you sure you want to delete this comment? This will remove the comment and can't be undone.",
                      title: "Delete comment",
                      primaryBtnOnClick: async () => {
                        setIsSubmitting(true)
                        const res = isCommentActuallyReply
                          ? await handleDeleteReply({ replyId: comment.id })
                          : await handleDeleteComment({ commentId: comment.id })
                        setIsSubmitting(false)
                      },
                    })
                  }}
                  className={`${_className}__controls-btn`}
                />
                <EditCommentButton
                  onClick={e => {
                    e.stopPropagation()
                    setIsEditingMode(true)
                    setOutsideClickHandler(
                      () => containerRef.current,
                      () => {
                        setIsEditingMode(false)
                      }
                    )
                  }}
                  className={`${_className}__controls-btn`}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {commentOrReplySelectedToReply === comment.id && (
        <ReplyPanel
          ref={panelRef}
          className={`${_className}__reply-panel`}
          placeholder="Add a reply..."
          buttonText="Reply"
          autoFocus={true}
          replyTo={user.username}
          onSubmit={async content => {
            console.log("hereee")
            const data = await handleCreateReply({
              commentOrReplyId: comment.id,
              content,
            })
            setCommentOrReplyIdCreated(data.id)
            setCommentOrReplySelectedToReply(null)
          }}
        />
      )}
      {!isCommentActuallyReply && (
        <div className="comment__replies-container">
          <div className="comment__placeholder"></div>
          <div className="comment__replies">
            {" "}
            {comment.replies.length > 0 &&
              comment.replies.map((reply, i) => {
                return <Comment comment={reply} key={reply.id} voted={repliesVoted[i]} />
              })}
          </div>
        </div>
      )}
    </article>
  )
}

Comment = memo(Comment)

export { Comment }
