import { ObjectType } from '@nestjs/graphql'
import { User } from '~/user/entities/user.entity'
import { Paginated } from '~/utils/pagination'

@ObjectType()
export class SearchUsersResponse extends Paginated(User) {}
