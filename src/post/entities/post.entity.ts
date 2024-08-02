import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { User } from '~/user/entities/user.entity'

export type PostDocument = HydratedDocument<Post>

@ObjectType()
@Schema({ timestamps: true })
export class Post {
  @Field(() => String)
  _id: Types.ObjectId

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  user?: User

  @Field()
  @Prop()
  title: string

  @Field({ nullable: true })
  @Prop()
  content?: string

  @Field()
  @Prop()
  createdAt: Date

  @Field({ nullable: true })
  @Prop()
  updatedAt?: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)
