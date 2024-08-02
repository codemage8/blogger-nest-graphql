import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '~/utils/pagination'

@InputType()
export class SearchUsersInput extends PaginationInput {
  @Field({ nullable: true, description: 'Search by email' })
  email?: string

  @Field({ nullable: true, description: 'Only search admin/user' })
  isAdmin?: boolean
}
