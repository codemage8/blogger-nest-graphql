import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  refreshToken: string

  @Field()
  token: string
}
