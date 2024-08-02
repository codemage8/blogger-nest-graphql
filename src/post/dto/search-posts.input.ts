import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '~/utils/dto/pagination'
import { Trim } from '~/utils/transformer'

@InputType()
export class SearchPostsInput extends PaginationInput {
  @Field({ nullable: true, description: 'Search by User Id' })
  userId?: string

  @Field({ nullable: true, description: 'Search by Title (Includes)' })
  @Trim()
  title?: string

  @Field({ nullable: true, description: 'After Date' })
  after?: Date

  @Field({ nullable: true, description: 'Before Date' })
  before?: Date
}
