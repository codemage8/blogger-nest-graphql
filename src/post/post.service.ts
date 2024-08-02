import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreatePostInput } from '~/post/dto/create-post.input'
import { Post, PostDocument } from '~/post/entities/post.entity'

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

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
}
