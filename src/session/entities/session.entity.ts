import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import type { User } from '~/user/entities/user.entity'

export type SessionDocument = HydratedDocument<Session>

@Schema()
export class Session {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  user: User

  @Prop({ required: true, index: true })
  hash: string
}

export const SessionSchema = SchemaFactory.createForClass(Session)
