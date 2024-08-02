import { Injectable, UnauthorizedException } from '@nestjs/common'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto'
import { Types } from 'mongoose'
import ms from 'ms'
import { LoginUserInput } from '~/auth/dto/login.input'
import { LoginUserResponse } from '~/auth/dto/login.response'
import { RefreshTokenResponse } from '~/auth/dto/refresh-token.response'
import { RegisterUserInput } from '~/auth/dto/register.input'
import { JwtRefreshPayload } from '~/auth/strategy/types'
import { AllConfigType } from '~/config/config.type'
import { SessionService } from '~/session/session.service'
import { User } from '~/user/entities/user.entity'
import { UserService } from '~/user/user.service'
import { bcryptCheckHash } from '~/utils/bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private jwtService: JwtService,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  async login(input: LoginUserInput): Promise<LoginUserResponse> {
    const user = await this.userService.findByEmail(input.email)
    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordMatch = await bcryptCheckHash(input.password, user?.password)
    if (!isPasswordMatch) {
      throw new UnauthorizedException()
    }
    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex')
    const session = await this.sessionService.create({
      user,
      hash,
    })

    const { token, refreshToken } = await this.generateTokens({
      id: session.user._id.toString(),
      isAdmin: session.user.isAdmin,
      email: session.user.email,
      sessionId: session._id.toString(),
      hash,
    })

    return {
      refreshToken,
      token,
      user,
    }
  }

  async refreshToken(
    data: Pick<JwtRefreshPayload, 'sessionId' | 'hash'>
  ): Promise<RefreshTokenResponse> {
    const session = await this.sessionService.findOne({
      _id: data.sessionId,
    })
    if (!session || session.hash !== data.hash) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findById(session.user._id)
    if (!user) {
      throw new UnauthorizedException()
    }
    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex')
    await this.sessionService.update(session._id, hash)
    const { token, refreshToken } = await this.generateTokens({
      id: session.user._id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      sessionId: session._id.toString(),
      hash,
    })

    return {
      token,
      refreshToken,
    }
  }

  async register(input: RegisterUserInput): Promise<User> {
    return this.userService.create({
      ...input,
      isAdmin: false,
    })
  }

  async logOutOthers(userId: Types.ObjectId | string, keepSessionId: Types.ObjectId | string) {
    return this.sessionService.deleteOtherSessions(userId, keepSessionId)
  }

  logOut(id: Types.ObjectId | string) {
    return this.sessionService.deleteAllForUser(id)
  }

  private async generateTokens(data: {
    id: string
    email: string
    isAdmin: boolean
    sessionId: string
    hash: string
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    })
    const refreshTokenExpiresIn = this.configService.getOrThrow('auth.refreshExpires', {
      infer: true,
    })
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          isAdmin: data.isAdmin,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', {
            infer: true,
          }),
          expiresIn: Math.floor(ms(tokenExpiresIn) / 1000),
          subject: data.email,
        }
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: Math.floor(ms(refreshTokenExpiresIn) / 1000),
          subject: data.email,
        }
      ),
    ])
    return {
      token,
      refreshToken,
    }
  }
}
