import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from './entities/post.entity'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
