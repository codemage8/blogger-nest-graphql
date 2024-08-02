import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import { Post } from '~/post/entities/post.entity'

@ObjectType()
export class PostItem extends OmitType(Post, ['user']) {
  @Field()
  user: string
}
