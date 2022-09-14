import { validate } from "class-validator"
import { NextApiRequest, NextApiResponse } from "next"
import { CreateReplyDto } from "common/comment.dto"
import { getToken } from "src/api/auth"
import { commentsService } from "../../../server/services/comment.service"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getToken(req)
  if(!user) return res.status(401).end()

  switch (req.method) {
    case "POST": {
      const dto = new CreateReplyDto()
      dto.commentOrReplyId = req.query.to as string
      dto.content = req.body.content

      const errors = await validate(dto)
      if(errors.length) return res.status(400).json({ errors })

      const dataOrError = await commentsService.createReply({
        username: user.username,
        ...dto
      })
      if ('data' in dataOrError) return res.status(201).json(dataOrError.data)
      return res.status(dataOrError.error.status).json(dataOrError.error)
    }
    case "GET": {
      const dataOrError = await commentsService.getAll()
      if ('data' in dataOrError) return res.status(200).json(dataOrError.data)
      return res.status(dataOrError.error.status).json(dataOrError.error)
    }
    default:
      res.status(400).json({ message: "Unresolved request" })
  }
}
