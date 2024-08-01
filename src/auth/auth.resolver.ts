import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { Auth } from '~/auth/auth.decorator'
import { AuthService } from '~/auth/auth.service'
import { LoginUserInput } from '~/auth/dto/login.input'
import { LoginUserResponse } from '~/auth/dto/login.response'
import { RegisterUserInput } from '~/auth/dto/register.input'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { JwtPayload } from '~/auth/strategy/types'
import { User } from '~/user/entities/user.entity'
import { UserService } from '~/user/user.service'

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Mutation(() => LoginUserResponse)
  login(@Args('loginInput') input: LoginUserInput) {
    return this.authService.login(input)
  }

  @Mutation(() => User)
  register(@Args('registerInput') input: RegisterUserInput) {
    return this.authService.register(input)
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@Auth() auth: JwtPayload) {
    return this.userService.findById(new Types.ObjectId(auth.id))
  }
}
