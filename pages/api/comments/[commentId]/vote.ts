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
        typeof req.query.commentId !== "string" ||
        !["true", "false"].includes(req.query.isUp)
      )
        return res.json({ error: new ServiceError(400, "Wrong query parameters") })

      const result = await commentsService.voteComment({
        commentId: req.query.commentId,
        isUp: req.query.isUp === "true",
        username: user.username,
      })

      if('error' in result) return res.status(result.error.status).json(result.error)
      return res.status(200).json(result)
    }
    default:
      res.status(404).json({ message: "Request unresolved" })
  }
}
