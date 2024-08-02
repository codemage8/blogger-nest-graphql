import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { Session, SessionDocument } from './entities/session.entity'

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  findOne(query: FilterQuery<SessionDocument>) {
    return this.sessionModel.findOne(query).exec()
  }

  create(data: Session) {
    return this.sessionModel.create(data)
  }

  update(id: Types.ObjectId, hash: string) {
    return this.sessionModel.findByIdAndUpdate(id, { hash }, { new: true })
  }

  deleteAllForUser(userId: Types.ObjectId | string) {
    return this.sessionModel.deleteMany({ user: userId }).exec()
  }

  deleteOtherSessions(userId: Types.ObjectId | string, keepSessionId: Types.ObjectId | string) {
    return this.sessionModel.deleteMany({ user: userId, _id: { $ne: keepSessionId } }).exec()
  }

  delete(id: Types.ObjectId) {
    return this.sessionModel.deleteOne({ _id: id }).exec()
  }
}
