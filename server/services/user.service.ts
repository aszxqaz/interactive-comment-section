import prismaClient from "../prisma"
import { BaseService } from "./base.service"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { User } from "@prisma/client"
import { ServiceError, ServerResponse } from "./types"
import { CreateUserArgs } from "./args"

class UserService extends BaseService {
  public async create({
    username,
    image,
  }: CreateUserArgs): Promise<ServerResponse<User>> {
    try {
      const user = await this.prismaClient.user.create({
        data: {
          username,
          image,
        },
      })

      return {
        data: user,
      }
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2002": {
            return {
              error: new ServiceError(
                409,
                "User with this username already exists"
              ),
            }
          }
          default: {
          }
        }
      } else {
        console.log(e)
      }
    }
  }
}

export const userService = new UserService(prismaClient)
