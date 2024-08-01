import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import type { User } from '~/user/entities/user.entity'

export type SessionDocument = HydratedDocument<Session>

@Schema()
export class Session {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop({ required: true })
  hash: string
}

export const SessionSchema = SchemaFactory.createForClass(Session)
