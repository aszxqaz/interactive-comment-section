import {
  CreateReplyDto,
  DeleteCommentDto,
  DeleteReplyDto,
  UpdateCommentDto,
  UpdateReplyDto,
} from "common/comment.dto"
import {
  CreateReplyData,
  DeleteCommentData,
  DeleteReplyData,
  UpdateCommentData,
  UpdateReplyData,
} from "server/services/types"
import { Dispatch, SetStateAction, createContext } from "react"

interface CommentsState {
  commentOrReplySelectedToReply: string | null
  setCommentOrReplySelectedToReply: Dispatch<SetStateAction<string>> | null
  commentOrReplyIdCreated: string | null
  setCommentOrReplyIdCreated: Dispatch<SetStateAction<string>> | null
  handleCreateReply: (args: CreateReplyDto) => Promise<CreateReplyData> | null
  handleDeleteComment: (args: DeleteCommentDto) => Promise<DeleteCommentData> | null
  handleDeleteReply: (args: DeleteReplyDto) => Promise<DeleteReplyData> | null
  handleUpdateComment: (args: UpdateCommentDto) => Promise<UpdateCommentData> | null
  handleUpdateReply: (args: UpdateReplyDto) => Promise<UpdateReplyData> | null
}

export const CommentsContext = createContext<CommentsState>({
  commentOrReplySelectedToReply: null,
  setCommentOrReplySelectedToReply: null,
  handleCreateReply: null,
  handleDeleteComment: null,
  handleDeleteReply: null,
  commentOrReplyIdCreated: null,
  setCommentOrReplyIdCreated: null,
  handleUpdateComment: null,
  handleUpdateReply: null,
})
