import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Session, SessionSchema } from './entities/session.entity'
import { SessionService } from './session.service'

@Module({
  providers: [SessionService],
  exports: [SessionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
  ],
})
export class SessionModule {}
