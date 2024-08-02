import { ForbiddenException, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '~/auth/auth.decorator'
import { JwtAuthGuard } from '~/auth/jwt-auth.guard'
import { JwtPayload } from '~/auth/strategy/types'
import { SearchPostsInput } from '~/post/dto/search-posts.input'
import { SearchPostsResponse } from '~/post/dto/search-posts.response'
import { CreatePostInput } from './dto/create-post.input'
import { Post } from './entities/post.entity'
import { PostService } from './post.service'

@Resolver()
@UseGuards(JwtAuthGuard)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  getPost(@Args('postId') id: string) {
    return this.postService.findById(id)
  }

  @Mutation(() => Post)
  createPost(@Auth() auth: JwtPayload, @Args('createPostInput') input: CreatePostInput) {
    return this.postService.create(auth.id, input)
  }

  @Mutation(() => Post)
  async updatePost(
    @Auth() auth: JwtPayload,
    @Args('postId') id: string,
    @Args('updatePostInput') input: CreatePostInput
  ) {
    const post = await this.postService.findById(id)
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }
    if (auth.id !== post.user?._id.toString() && !auth.isAdmin) {
      throw new ForbiddenException('Only admin or owner can update the post')
    }
    return this.postService.update(id, input)
  }

  @Mutation(() => Boolean)
  async deletePost(@Auth() auth: JwtPayload, @Args('postId') id: string) {
    const post = await this.postService.findById(id)
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }
    if (auth.id !== post.user?._id.toString() && !auth.isAdmin) {
      throw new ForbiddenException('Only admin or owner can delete the post')
    }
    await this.postService.delete(id)
    return true
  }

  @Query(() => SearchPostsResponse)
  async searchPosts(@Auth() auth: JwtPayload, @Args('searchPostsInput') input: SearchPostsInput) {
    return this.postService.search(input)
  }
}
