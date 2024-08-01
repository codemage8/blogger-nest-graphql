import type { User } from '~/user/entities/user.entity'

export interface JwtPayload extends Pick<User, 'isAdmin'> {
  id: string
  sub: string
  sessionId: string
  iat: number
  exp: number
}

export interface JwtRefreshPayload {
  sessionId: string
  hash: string
  iat: number
  exp: number
}
