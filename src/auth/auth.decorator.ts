import { type ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { JwtPayload } from '~/auth/strategy/types'

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  return GqlExecutionContext.create(ctx).getContext().req.user
})
