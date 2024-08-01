import { registerAs } from '@nestjs/config'
import { IsEnum, IsString } from 'class-validator'
import { validateConfig } from '~/utils/validate-config'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface AppConfig {
  appEnv: Environment
  mongodbUri: string
}

class VarsValidator {
  @IsEnum(Environment)
  APP_ENV: Environment

  @IsString()
  MONGODB_URI: string
}

export const appConfig = registerAs<AppConfig>('app', () => {
  const parsed = validateConfig(process.env, VarsValidator)
  return {
    appEnv: parsed.APP_ENV,
    mongodbUri: parsed.MONGODB_URI,
  }
})
