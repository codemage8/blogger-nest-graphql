import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '~/user/entities/user.entity'

@ObjectType()
export class LoginUserResponse {
  @Field()
  refreshToken: string

  @Field()
  token: string

  @Field(() => User)
  user: User
}
