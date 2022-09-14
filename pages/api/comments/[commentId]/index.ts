import { validate } from "class-validator"
import { DeleteCommentDto, UpdateCommentDto } from "common/comment.dto"
import { commentsService } from "server/services/comment.service"
import { ServiceError } from "server/services/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "src/api/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getToken(req)
  if (!user) return res.status(401).end()

  switch (req.method) {
    case "DELETE": {
      const dto = new DeleteCommentDto()
      dto.commentId = req.query.commentId as string
      const errors = await validate(dto)
      if(errors.length) return res.json({ error: new ServiceError(400, "Wrong query parameters") })

      const result = await commentsService.deleteComment({
        ...dto,
        username: user.username
      })

      if ("error" in result) return res.status(result.error.status).json(result.error)
      return res.status(200).json(result)
    }

    case "PATCH": {
      const dto = new UpdateCommentDto()
      dto.commentId = req.query.commentId as string
      dto.content = req.body.content
      const errors = await validate(dto)
      if(errors.length) return res.json({ error: new ServiceError(400, "Wrong query parameters") })

      const result = await commentsService.updateComment({
        ...dto,
        username: user.username
      })

      if ("error" in result) return res.status(result.error.status).json(result.error)
      return res.status(200).json(result.data)
    }

    default:
      return res.status(404).json({ message: "Request unresolved" })
  }
}
