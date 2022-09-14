import { NextApiRequest, NextApiResponse } from "next"
import { responseAdapter } from "../../server/response-adapters"
import { userService } from "../../server/services/user.service"
import { objectKeys } from "../../src/utils/objectKeys"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const password = req.query.password
  if (password !== process.env.API_ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Access denied" })
  }

  switch (req.method) {
    case "POST": {
      const { username, image } = req.body
      if (req.body.username) {
        const { data, error } = await userService.create({
          username,
          image: objectKeys(image).map(key => `${key as string}:${image[key]}`)
        })
        if (error) return res.status(error.status).json(error)

        const userResponse = responseAdapter.transformUser(data)
        return res.status(201).json(userResponse)
      }
    }
    default:
      res.status(400).json({ message: "Unresolved request" })
  }
}
