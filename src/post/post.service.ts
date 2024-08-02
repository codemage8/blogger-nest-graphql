import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { AllConfigType } from '~/config/config.type'
import { PostItem } from '~/post/dto/post-item'
import { SortDirection } from '~/utils/dto/pagination'
import { CreatePostInput } from './dto/create-post.input'
import { SearchPostsInput } from './dto/search-posts.input'
import { SearchPostsResponse } from './dto/search-posts.response'
import { Post, PostDocument } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private configService: ConfigService<AllConfigType>
  ) {}

  async create(userId: Types.ObjectId | string, input: CreatePostInput): Promise<PostDocument> {
    const newPost = new this.postModel({ ...input, user: userId })
    return newPost.save()
  }

  findById(id: Types.ObjectId | string) {
    return this.postModel.findById(id).exec()
  }

  async update(id: Types.ObjectId | string, input: CreatePostInput): Promise<Post> {
    const post = await this.findById(id)
    post.title = input.title
    post.content = input.content || ''

    return post.save()
  }

  async delete(id: Types.ObjectId | string) {
    await this.postModel.findByIdAndDelete(id).exec()
  }

  async search(input: SearchPostsInput): Promise<SearchPostsResponse> {
    const { userId, title, before, after, sortDirection, limit, skip, cursor } = input
    const filter: FilterQuery<Post> = {}
    if (userId) {
      filter.userId = userId
    }
    if (after) {
      filter.createdAt = { $gte: new Date(after) }
    }
    if (before) {
      filter.createdAt = { $lt: new Date(before) }
    }
    if (title) {
      filter.title = { $regex: title, $options: 'i' }
    }

    // mongodb id has timestamp, so we use it for sort direction.
    // default is descending for the latest first
    const _sortDirection = sortDirection ?? SortDirection.DESCENDING
    const sort = { _id: _sortDirection }

    // Always pick less than max page limit
    const refinedLimit = Math.min(
      this.configService.getOrThrow('app.maxPageLimit', { infer: true }),
      limit
    )

    const totalCount = await this.postModel.find(filter).countDocuments()

    // cursor based query
    if (cursor) {
      filter._id = _sortDirection === SortDirection.DESCENDING ? { $lte: cursor } : { $gte: cursor }
    }

    let query = this.postModel
      .find<PostItem>(filter)
      .sort(sort)
      .limit(refinedLimit + 1)
    if (skip && !cursor) {
      query = query.skip(skip)
    }
    const items = await query.limit(refinedLimit + 1).exec()
    const hasMore = items.length > refinedLimit
    const nextCursor = hasMore ? items[refinedLimit]._id.toString() : undefined
    if (hasMore) {
      items.pop()
    }

    return {
      totalCount,
      items,
      nextCursor,
    }
  }
}
