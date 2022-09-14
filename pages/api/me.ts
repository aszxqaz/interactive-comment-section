import { NextApiRequest, NextApiResponse } from "next"
import { createFakeUser, getToken } from "src/api/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      const user = getToken(req)
      console.log('user' , user)
      if (user) return res.status(200).json(user)

      const { res: response, user: token } = await createFakeUser(res)
      console.log('token', token)
      return response.status(200).json(token)
    }

    default:
      res.status(400).json({ message: "Unresolved request" })
  }
}

function setCookie(token: string) {}
