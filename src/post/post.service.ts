import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { AllConfigType } from '~/config/config.type'
import { searchPaginated } from '~/utils/pagination'
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
    const { userId, title, before, after, limit } = input
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

    return searchPaginated({
      model: this.postModel,
      filter,
      input: {
        ...input,
        limit: Math.min(this.configService.getOrThrow('app.maxPageLimit', { infer: true }), limit),
      },
    })
  }
}
