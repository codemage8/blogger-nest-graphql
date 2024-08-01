import { registerAs } from '@nestjs/config'
import { IsEnum, IsUrl } from 'class-validator'
import { validateConfig } from '~/utils/validate-config'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface AppConfig {
  nodeEnv: Environment
  mongodbUri: string
}

class VarsValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsUrl()
  MONGODB_URI: string
}

export const appConfig = registerAs<AppConfig>('app', () => {
  const parsed = validateConfig(process.env, VarsValidator)
  return {
    nodeEnv: parsed.NODE_ENV,
    mongodbUri: parsed.MONGODB_URI,
  }
})
