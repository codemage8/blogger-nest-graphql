import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '~/auth/auth.service'
import { LoginUserInput } from '~/auth/dto/login.input'
import { LoginUserResponse } from '~/auth/dto/login.response'
import { RegisterUserInput } from '~/auth/dto/register.input'
import { User } from '~/user/entities/user.entity'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserResponse)
  login(@Args('loginInput') input: LoginUserInput) {
    return this.authService.login(input)
  }

  @Mutation(() => User)
  register(@Args('registerInput') input: RegisterUserInput) {
    return this.authService.register(input)
  }

  @Query(() => User)
  me() {
    return {}
  }
}
