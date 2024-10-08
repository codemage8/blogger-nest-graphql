import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { AdminAuthGuard } from '~/auth/admin-auth.guard'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { SessionService } from '~/session/session.service'
import { CreateUserInput } from '~/user/dto/create-user-input'
import { SearchUsersInput } from '~/user/dto/search-users.input'
import { SearchUsersResponse } from '~/user/dto/search-users.response'
import { User } from '~/user/entities/user.entity'
import { UserService } from '~/user/user.service'

@Resolver()
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  @Query(() => User)
  getUser(@Args('id') id: string) {
    return this.userService.findById(new Types.ObjectId(id))
  }

  @Mutation(() => User)
  @UseGuards(AdminAuthGuard)
  createUser(@Args('createUserInput') input: CreateUserInput) {
    return this.userService.create(input)
  }

  @UseGuards(AdminAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    const _id = new Types.ObjectId(id)
    await this.sessionService.deleteAllForUser(_id)
    await this.userService.delete(_id)
    return true
  }

  @UseGuards(AdminAuthGuard)
  @Query(() => SearchUsersResponse, {
    description: 'Paginated user search, Only available for admin users',
  })
  async searchUsers(@Args('searchUsersInput') input: SearchUsersInput) {
    return this.userService.search(input)
  }
}
