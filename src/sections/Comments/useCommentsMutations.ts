import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
  CreateCommentDto,
  CreateReplyDto,
  DeleteCommentDto,
  DeleteReplyDto,
  UpdateCommentDto,
  UpdateReplyDto,
} from "common/comment.dto"
import produce from "immer"
import { CommentServerResponse } from "server/server-response.types"
import {
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  updateComment,
  updateReply,
} from "client/api/fetchers"

export const useCommentsMutations = () => {
  const client = useQueryClient()

  const createCommentMutation = useMutation(createComment, {
    onSuccess: (data, args) => {
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          draft.push(data)
          return draft
        })
      )
    },
  })

  const createReplyMutation = useMutation(createReply, {
    onSuccess: (data, args) => {
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          const { commentId, ...reply } = data
          const comment = draft.find(_ => _.id === commentId)
          comment.replies.push(reply)
          return draft
        })
      )
    },
  })

  const updateCommentMutation = useMutation(updateComment, {
    onSuccess: (data, args) => {
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          const comment = draft.find(_ => _.id === data.id)
          comment.content = data.content
          return draft
        })
      )
    },
  })

  const updateReplyMutation = useMutation(updateReply, {
    onSuccess: (data, args) => {
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          return draft.map(comment => ({
            ...comment,
            replies: comment.replies.map(reply => ({
              ...reply,
              content: reply.id === data.id ? data.content : reply.content,
            })),
          }))
        })
      )
    },
  })

  const deleteCommentMutation = useMutation(deleteComment, {
    onMutate: async args => {
      await client.cancelQueries(["comments"])
      const prevComments = client.getQueryData(["comments"])
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          return draft.filter(comment => comment.id !== args.commentId)
        })
      )
      return { prevComments }
    },
    onError: (err, args, ctx) => {
      client.setQueryData(["comments"], ctx.prevComments)
    },
  })

  const deleteReplyMutation = useMutation(deleteReply, {
    onMutate: async args => {
      await client.cancelQueries(["comments"])
      const prevComments = client.getQueryData(["comments"])
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          return draft.map(comment => ({
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== args.replyId),
          }))
        })
      )
      return { prevComments }
    },
    onError: (err, args, ctx) => {
      client.setQueryData(["comments"], ctx.prevComments)
    },
  })

  const handleCreateComment = (args: CreateCommentDto) => createCommentMutation.mutateAsync(args)
  const handleCreateReply = (args: CreateReplyDto) => createReplyMutation.mutateAsync(args)
  const handleDeleteComment = (args: DeleteCommentDto) => deleteCommentMutation.mutateAsync(args)
  const handleDeleteReply = (args: DeleteReplyDto) => deleteReplyMutation.mutateAsync(args)
  const handleUpdateComment = (args: UpdateCommentDto) => updateCommentMutation.mutateAsync(args)
  const handleUpdateReply = (args: UpdateReplyDto) => updateReplyMutation.mutateAsync(args)

  return {
    handleCreateComment,
    handleCreateReply,
    handleUpdateComment,
    handleUpdateReply,
    handleDeleteComment,
    handleDeleteReply,
  }
}
