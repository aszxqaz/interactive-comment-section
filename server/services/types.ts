import { CommentsService } from "./comment.service"

export class ServiceError {
  constructor(public readonly status: number, public readonly message: string) {}
}

export type ServerResponse<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: ServiceError
    }

export type DataFromServer<T extends keyof InstanceType<typeof CommentsService>> = Awaited<
  ReturnType<InstanceType<typeof CommentsService>[T]>
>[Extract<keyof Awaited<ReturnType<InstanceType<typeof CommentsService>[T]>>, "data">]

export type CreateReplyData = DataFromServer<"createReply">
export type DeleteCommentData = DataFromServer<"deleteComment">
export type DeleteReplyData = DataFromServer<"deleteReply">
export type UpdateCommentData = DataFromServer<"updateComment">
export type UpdateReplyData = DataFromServer<"updateReply">