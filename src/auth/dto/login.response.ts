import { Field, ObjectType } from '@nestjs/graphql'
import { RefreshTokenResponse } from '~/auth/dto/refresh-token.response'
import { User } from '~/user/entities/user.entity'

@ObjectType()
export class LoginUserResponse extends RefreshTokenResponse {
  @Field(() => User)
  user: User
}
