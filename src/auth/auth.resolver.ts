import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { Auth } from '~/auth/auth.decorator'
import { AuthService } from '~/auth/auth.service'
import { LoginUserInput } from '~/auth/dto/login.input'
import { LoginUserResponse } from '~/auth/dto/login.response'
import { RefreshTokenResponse } from '~/auth/dto/refresh-token.response'
import { RegisterUserInput } from '~/auth/dto/register.input'
import { UpdateMeInput } from '~/auth/dto/update-me.input'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { JwtRefreshAuthGuard } from '~/auth/jwt-refresh-auth.guard'
import { JwtPayload, JwtRefreshPayload } from '~/auth/strategy/types'
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

  @Mutation(() => RefreshTokenResponse)
  @UseGuards(JwtRefreshAuthGuard)
  refreshToken(@Context('req') request: { user: JwtRefreshPayload }) {
    return this.authService.refreshToken(request.user)
  }

  @Mutation(() => User)
  async updateMe(@Auth() auth: JwtPayload, @Args('updateMeInput') input: UpdateMeInput) {
    const result = await this.userService.update(auth.id, input)
    // whenever password was changed, logout all other users
    if (input.password) {
      await this.authService.logOutOthers(auth.id, auth.sessionId)
    }
    return result
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Auth() auth: JwtPayload) {
    const result = await this.userService.findById(new Types.ObjectId(auth.id))
    if (!result) {
      await this.authService.logOut(auth.id)
      throw new UnauthorizedException()
    }
  }
}
