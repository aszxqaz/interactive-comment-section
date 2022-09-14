import { commentsService } from "server/services/comment.service"
import { ServiceError } from "server/services/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "src/api/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getToken(req)
  switch (req.method) {
    case "PUT": {
      if (
        typeof req.query.isUp !== "string" ||
        typeof req.query.replyId !== "string" ||
        !["true", "false"].includes(req.query.isUp)
      )
        return res.json({ error: new ServiceError(400, "Wrong query parameters") })

      const dataOrError = await commentsService.voteReply({
        replyId: req.query.replyId,
        isUp: req.query.isUp === "true",
        username: user.username,
      })

      if('error' in dataOrError) return res.status(dataOrError.error.status).json(dataOrError.error)
      return res.status(200).json(dataOrError.data)
    }
    default:
      res.status(404).json({ message: "Request unresolved" })
  }
}
