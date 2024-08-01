import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from '~/auth/auth.resolver'
import { AuthService } from '~/auth/auth.service'
import { JwtRefreshStrategy } from '~/auth/strategy/jwt-refresh.strategy'
import { JwtStrategy } from '~/auth/strategy/jwt.strategy'
import { SessionModule } from '~/session/session.module'
import { UserModule } from '~/user/user.module'

@Module({
  providers: [AuthService, AuthResolver, JwtStrategy, JwtRefreshStrategy],
  imports: [SessionModule, UserModule, PassportModule, JwtModule.register({})],
})
export class AuthModule {}
