export interface UserEntityServerResponse {
  image: Record<string, string>
  username: string
}

export class MessageEntityServerResponse {
  id: string
  content: string
  createdAt: string
  score: number
  user: UserEntityServerResponse
  upvoted: string[]
  downvoted: string[]
}

export interface UserServerResponse {
  user: UserEntityServerResponse
}

export class ReplyServerResponse extends MessageEntityServerResponse {
  replyingTo: string
}

export interface CommentServerResponse extends MessageEntityServerResponse {
  replies: ReplyServerResponse[]
}
