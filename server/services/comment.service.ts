import { Comment, Reply, User, UserReplyVote } from "@prisma/client"
import prismaClient from "../prisma"
import { responseAdapter } from "../response-adapters"
import { CommentServerResponse, ReplyServerResponse } from "../server-response.types"
import { BaseService } from "./base.service"
import {
  UpdateCommentArgs,
  UpdateReplyArgs,
  CreateReplyArgs,
  CreateCommentArgs,
  DeleteCommentArgs,
  DeleteReplyArgs,
  VoteCommentArgs,
  VoteReplyArgs,
} from "./args"
import { ServerResponse, ServiceError } from "./types"

type DetailedComment = Awaited<
  ReturnType<InstanceType<typeof CommentsService>["getComments"]>
>[number]

export class CommentsService extends BaseService {
  public async getAll(): Promise<ServerResponse<CommentServerResponse[]>> {
    let comments = await this.getComments()
    const transformComment = this.transformComment.bind(this)
    return {
      data: comments.map(transformComment),
    }
  }

  public async createComment({
    content,
    username,
  }: CreateCommentArgs): Promise<ServerResponse<CommentServerResponse>> {
    const user = await this.prismaClient.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { error: new ServiceError(401, "Unauthorized") }
    }

    const comment = await this.prismaClient.comment.create({
      data: {
        username: user.username,
        content,
      },
      include: {
        user: true,
      },
    })

    return {
      data: this.transformComment({
        ...comment,
        replies: [],
        votes: [],
      }),
    }
  }

  public async createReply({
    content,
    username,
    commentOrReplyId,
  }: CreateReplyArgs): Promise<ServerResponse<ReplyServerResponse & { commentId: string }>> {
    const comment = await this.prismaClient.comment.findUnique({
      where: { id: commentOrReplyId },
      include: { replies: { include: { user: true } }, user: true },
    })

    let reply: Reply & {
      comment: Comment
    }
    if (!comment) {
      reply = await this.prismaClient.reply.findUnique({
        where: { id: commentOrReplyId },
        include: {
          comment: true,
        },
      })
      if (!reply)
        return {
          error: new ServiceError(400, "Can't reply because target comment/reply not found"),
        }
    }

    const resultReply = await this.prismaClient.reply.create({
      data: {
        content,
        commentId: comment?.id || reply.commentId,
        replyingTo: comment?.username || reply.username,
        username,
      },
      include: {
        user: true,
      },
    })

    const data = this.transformReply(resultReply)

    return {
      data: {
        ...data,
        commentId: comment?.id || reply.commentId,
      },
    }
  }

  public async updateComment({ username, commentId, content }: UpdateCommentArgs) {
    const comment = await this.prismaClient.comment.findUnique({ where: { id: commentId } })
    if (comment.username !== username) {
      return {
        error: new ServiceError(403, "Access denied"),
      }
    }
    const newComment = await this.prismaClient.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    })

    return {
      data: newComment,
    }
  }

  public async updateReply({ content, replyId, username }: UpdateReplyArgs) {
    const reply = await this.prismaClient.reply.findUnique({ where: { id: replyId } })
    if (reply.username !== username) {
      return {
        error: new ServiceError(403, "Access denied"),
      }
    }
    const newComment = await this.prismaClient.comment.update({
      where: { id: replyId },
      data: {
        content,
      },
    })

    return {
      data: newComment,
    }
  }

  public async deleteComment({
    commentId: id,
    username,
  }: DeleteCommentArgs): Promise<ServerResponse<Comment>> {
    const comment = await this.prismaClient.comment.findUnique({ where: { id } })
    if (comment.username !== username)
      return {
        error: new ServiceError(403, "Access denied"),
      }

    const data = await this.prismaClient.comment.delete({ where: { id } })
    return { data }
  }

  public async deleteReply({
    replyId: id,
    username,
  }: DeleteReplyArgs): Promise<ServerResponse<Reply>> {
    const reply = await this.prismaClient.reply.findUnique({ where: { id } })
    if (reply.username !== username)
      return {
        error: new ServiceError(403, "Access denied"),
      }

    const data = await this.prismaClient.reply.delete({ where: { id } })
    return { data }
  }

  public async voteComment({
    commentId,
    username,
    isUp,
  }: VoteCommentArgs): Promise<ServerResponse<Comment>> {
    const comment = await this.prismaClient.comment.findUnique({
      where: { id: commentId },
      include: { votes: true },
    })
    if (!comment)
      return {
        error: new ServiceError(400, "Comment not found"),
      }

    if (comment.username === username)
      return {
        error: new ServiceError(400, "Author cannot upvote for his comment"),
      }

    let isVoted = false

    for (const vote of comment.votes) {
      if (vote.username === username) {
        if (vote.isUp === isUp)
          return {
            error: new ServiceError(400, "User can not upvote or downvote twice"),
          }
        isVoted = true
        break
      }
    }

    let data

    if (!isVoted) {
      data = await this.prismaClient.comment.update({
        where: { id: comment.id },
        data: {
          votes: {
            create: {
              isUp,
              username,
            },
          },
        },
      })
    } else {
      data = await this.prismaClient.comment.update({
        where: { id: comment.id },
        data: {
          votes: {
            delete: {
              commentId_username: {
                commentId: comment.id,
                username,
              },
            },
          },
        },
      })
    }
    return data
  }

  public async voteReply({
    isUp,
    replyId,
    username,
  }: VoteReplyArgs): Promise<ServerResponse<Reply>> {
    const reply = await this.prismaClient.reply.findUnique({
      where: { id: replyId },
      include: { votes: true },
    })
    if (!reply)
      return {
        error: new ServiceError(400, "Reply not found"),
      }

    if (reply.username === username)
      return {
        error: new ServiceError(400, "Author cannot vote for his reply"),
      }

    let isVoted = false

    for (const vote of reply.votes) {
      if (vote.username === username) {
        if (vote.isUp === isUp)
          return {
            error: new ServiceError(400, "User can not upvote or downvote twice"),
          }
        isVoted = true
        break
      }
    }

    let data

    if (!isVoted) {
      data = await this.prismaClient.reply.update({
        where: { id: reply.id },
        data: {
          votes: {
            create: {
              isUp,
              username,
            },
          },
        },
      })
    } else {
      data = await this.prismaClient.reply.update({
        where: { id: reply.id },
        data: {
          votes: {
            delete: {
              replyId_username: {
                replyId: reply.id,
                username,
              },
            },
          },
        },
      })
    }
    return data
  }

  private async getComments() {
    return await this.prismaClient.comment.findMany({
      include: {
        replies: {
          include: {
            user: true,
            votes: true,
          },
        },
        votes: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  private transformComment(comment: DetailedComment): CommentServerResponse {
    {
      const { content, id, createdAt, replies, user, votes } = comment
      const upvoted = votes.filter(vote => vote.isUp).map(vote => vote.username)
      const downvoted = votes.filter(vote => !vote.isUp).map(vote => vote.username)
      const transformReply = this.transformReply.bind(this)
      return {
        content,
        id,
        score: upvoted.length - downvoted.length,
        user: { ...user, image: responseAdapter.transformImage(user.image) },
        createdAt: createdAt.toUTCString(),
        upvoted,
        downvoted,
        replies: replies.map(transformReply),
      }
    }
  }

  private transformReply(
    reply: Reply & {
      user: User
      votes?: UserReplyVote[]
    }
  ): ReplyServerResponse {
    const { content, id, replyingTo } = reply
    const votes = "votes" in reply ? reply.votes : []
    const upvoted = votes.filter(vote => vote.isUp).map(vote => vote.username)
    const downvoted = votes.filter(vote => !vote.isUp).map(vote => vote.username)
    return {
      content,
      id,
      replyingTo,
      score: upvoted.length - downvoted.length,
      createdAt: reply.createdAt.toUTCString(),
      upvoted,
      downvoted,
      user: { ...reply.user, image: responseAdapter.transformImage(reply.user.image) },
    }
  }
}

export const commentsService = new CommentsService(prismaClient)
