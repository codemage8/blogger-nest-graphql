import { ObjectType } from '@nestjs/graphql'
import { PostItem } from '~/post/dto/post-item'
import { Paginated } from '~/utils/pagination'

@ObjectType()
export class SearchPostsResponse extends Paginated(PostItem) {}
