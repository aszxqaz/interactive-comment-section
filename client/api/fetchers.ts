import axios from "axios"
import {
  CreateCommentDto,
  CreateReplyDto,
  DeleteCommentDto,
  DeleteReplyDto,
  UpdateCommentDto,
  UpdateReplyDto,
  VoteCommentDto,
  VoteReplyDto,
} from "common/comment.dto"
import { CommentServerResponse, UserEntityServerResponse } from "server/server-response.types"
import {
  CreateReplyData,
  DeleteCommentData,
  DeleteReplyData,
  UpdateCommentData,
  UpdateReplyData,
} from "server/services/types"

export const getMe = async () => {
  return axios.get<UserEntityServerResponse>("/api/me").then(res => res.data)
}

export const getComments = async () => {
  return axios.get<CommentServerResponse[]>("/api/comments").then(res => res.data)
}

export const createComment = async ({ content }: CreateCommentDto) => {
  return axios
    .post<CommentServerResponse>(`/api/comments/`, {
      content,
    })
    .then(res => res.data)
}

export const createReply = async ({ content, commentOrReplyId }: CreateReplyDto) => {
  return axios
    .post<CreateReplyData>(`/api/replies?to=${commentOrReplyId}`, {
      content,
    })
    .then(res => res.data)
}

export const updateComment = async ({ commentId, content }: UpdateCommentDto) => {
  return axios
    .patch<UpdateCommentData>(`/api/comments/${commentId}`, { content })
    .then(res => res.data)
}

export const updateReply = async ({ replyId, content }: UpdateReplyDto) => {
  return axios.patch<UpdateReplyData>(`/api/replies/${replyId}`, { content }).then(res => res.data)
}

export const deleteComment = async ({ commentId }: DeleteCommentDto) => {
  return axios.delete<DeleteCommentData>(`/api/comments/${commentId}`).then(res => res.data)
}

export const deleteReply = async ({ replyId }: DeleteReplyDto) => {
  return axios.delete<DeleteReplyData>(`/api/replies/${replyId}`).then(res => res.data)
}

export const voteComment = async ({ commentId, isUp }: VoteCommentDto) => {
  return axios
    .put<CommentServerResponse>(`/api/comments/${commentId}/vote?isUp=${isUp}`)
    .then(res => res.data)
}

export const voteReply = async ({ replyId, isUp }: VoteReplyDto) => {
  return axios
    .put<CommentServerResponse>(`/api/replies/${replyId}/vote?isUp=${isUp}`)
    .then(res => res.data)
}
