export interface CreateUserArgs {
  username: string
  image: string[]
}

export interface CreateCommentArgs {
  username: string
  content: string
}

export interface CreateReplyArgs {
  username: string
  commentOrReplyId: string
  content: string
}

export interface DeleteCommentArgs {
  username: string
  commentId: string
}

export interface DeleteReplyArgs {
  username: string
  replyId: string
}

export interface UpdateCommentArgs {
  username: string
  commentId: string
  content: string
}

export interface UpdateReplyArgs {
  username: string
  replyId: string
  content: string
}

export interface VoteCommentArgs {
  username: string
  commentId: string
  isUp: boolean
}

export interface VoteReplyArgs {
  username: string
  replyId: string
  isUp: boolean
}