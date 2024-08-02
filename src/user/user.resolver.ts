import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { AdminAuthGuard } from '~/auth/admin-auth.guard'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { SessionService } from '~/session/session.service'
import { CreateUserInput } from '~/user/dto/create-user-input'
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
  async deleteUser(@Args('id') id: string) {
    const _id = new Types.ObjectId(id)
    await this.sessionService.deleteAllForUser(_id)
    return this.userService.delete(_id)
  }
}
