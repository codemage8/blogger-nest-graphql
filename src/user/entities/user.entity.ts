import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: Types.ObjectId

  @Field()
  @Prop({ required: true, index: true })
  email: string

  @Field({ nullable: true })
  @Prop()
  firstName?: string

  @Field({ nullable: true })
  @Prop()
  lastName?: string

  @Field()
  @Prop({ required: true })
  isAdmin: boolean

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
