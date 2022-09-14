import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string
}

export class CreateReplyDto {
  @IsUUID()
  commentOrReplyId: string

  @IsString()
  @IsNotEmpty()
  content: string
}

export class UpdateCommentDto {
  @IsUUID()
  commentId: string

  @IsString()
  @IsNotEmpty()
  content: string
}

export class UpdateReplyDto {
  @IsUUID()
  replyId: string

  @IsString()
  @IsNotEmpty()
  content: string
}

export class DeleteCommentDto {
  @IsUUID()
  commentId: string
}

export class DeleteReplyDto {
  @IsUUID()
  replyId: string
}

export class VoteCommentDto {
  @IsUUID()
  commentId: string

  @IsBoolean()
  isUp: boolean
}

export class VoteReplyDto {
  @IsUUID()
  replyId: string

  @IsBoolean()
  isUp: boolean
}