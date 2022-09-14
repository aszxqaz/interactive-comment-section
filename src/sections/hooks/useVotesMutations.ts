import { useQueryClient, useMutation } from "@tanstack/react-query"
import produce from "immer"
import { CommentServerResponse } from "server/server-response.types"
import { voteComment, voteReply } from "client/api/fetchers"
import { VoteCommentDto, VoteReplyDto } from "common/comment.dto"

export const useVotesMutations = (username: string) => {
  const client = useQueryClient()
  const voteCommentMutation = useMutation(voteComment, {
    onMutate: async args => {
      await client.cancelQueries(["comments"])
      const prevComments = client.getQueryData(["comments"])
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          let comment = draft.find(comment => comment.id === args.commentId)

          comment.score += args.isUp ? 1 : -1

          if (comment["downvoted"].includes(username) && args.isUp) {
            comment["downvoted"] = comment["downvoted"].filter(vote => vote !== username)
            return draft
          }

          if (comment["upvoted"].includes(username) && !args.isUp) {
            comment["upvoted"] = comment["upvoted"].filter(vote => vote !== username)
            return draft
          }

          comment[args.isUp ? "upvoted" : "downvoted"].push(username)
          return draft
        })
      )
      return { prevComments }
    },
    onError: (err, vars, ctx) => {
      client.setQueryData(["comments"], ctx.prevComments)
    },
  })

  const voteReplyMutation = useMutation(voteReply, {
    onMutate: async args => {
      await client.cancelQueries(["comments"])
      const prevComments = client.getQueryData(["comments"])
      client.setQueryData<CommentServerResponse[]>(["comments"], comments =>
        produce(comments, draft => {
          let reply
          for (const comment of draft) {
            reply = comment.replies.find(r => r.id === args.replyId)
            if (reply) break
          }

          reply.score += args.isUp ? 1 : -1

          if (reply["downvoted"].includes(username) && args.isUp) {
            reply["downvoted"] = reply["downvoted"].filter(vote => vote !== username)
            return draft
          }

          if (reply["upvoted"].includes(username) && !args.isUp) {
            reply["upvoted"] = reply["upvoted"].filter(vote => vote !== username)
            return draft
          }

          reply[args.isUp ? "upvoted" : "downvoted"].push(username)
          return draft
        })
      )
      return { prevComments }
    },
    onError: (err, vars, ctx) => {
      client.setQueryData(["comments"], ctx.prevComments)
    },
  })

  const handleVoteComment = (args: VoteCommentDto) => {
    if (!voteCommentMutation.isLoading) {
      voteCommentMutation.mutate(args)
    }
  }

  const handleVoteReply = (args: VoteReplyDto) => {
    if (!voteReplyMutation.isLoading) {
      voteReplyMutation.mutate(args)
    }
  }

  return { handleVoteComment, handleVoteReply }
}
