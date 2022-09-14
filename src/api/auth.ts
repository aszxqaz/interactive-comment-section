import { faker } from "@faker-js/faker"
import { serialize } from "cookie"
import { sign, verify } from "jsonwebtoken"
import { responseAdapter } from "server/response-adapters"
import { userService } from "server/services/user.service"
import { NextApiRequest, NextApiResponse } from "next"

export const getToken = (req: NextApiRequest) => {
  const token = req.cookies.token

  try {
    const user = verify(req.cookies.token, process.env.COOKIE_SECRET) as {
      username: string
      image: string[]
    }
    return {
      username: user.username,
      image: responseAdapter.transformImage(user.image),
    }
  } catch (e) {
    return null
  }
}

export const createFakeUser = async (res: NextApiResponse) => {
  const username = `${faker.word.adjective()}-${faker.word.noun()}`
  const image = [`jpg:${faker.image.avatar()}`]
  const token = sign({ username, image }, process.env.COOKIE_SECRET)
  await userService.create({ username, image })
  res.setHeader("Set-Cookie", serialize("token", token, { path: "/" }))
  return {
    res,
    user: {
      username,
      image: responseAdapter.transformImage(image),
    },
  }
}
