import { Comment as PrismaComment, Reply, User as PrismaUser, User } from "@prisma/client"
import {
  CommentServerResponse,
  UserEntityServerResponse,
  UserServerResponse,
} from "./server-response.types"

class ResponseAdapter {
  public transformUser(user: PrismaUser): UserEntityServerResponse {
    return {
      username: user.username,
      image: this.transformImage(user.image),
    }
  }

  public transformImage(image: User["image"]): UserEntityServerResponse["image"] {
    const img = image.reduce((acc, s) => {
      const idx = s.split("").findIndex((c) => c === ":")
      return {
        ...acc,
        [s.slice(0, idx)]: s.slice(idx + 1),
      }
    }, {})
    return img
  }
}

export const responseAdapter = new ResponseAdapter()
