import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SessionModule } from '~/session/session.module'
import { User, UserSchema } from '~/user/entities/user.entity'
import { UserResolver } from '~/user/user.resolver'
import { UserService } from '~/user/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    SessionModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
