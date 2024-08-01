import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '~/auth/auth.module'
import { authConfig } from '~/auth/config/auth.config'
import { AppConfig, appConfig } from '~/config/app.config'
import { AllConfigType } from '~/config/config.type'

const env = process.env.NODE_ENV || 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${env}.local`, `.env.${env}`, `.env.local`, `.env`],
      isGlobal: true,
      load: [appConfig, authConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService<AllConfigType>],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: configService.get<AppConfig>('app').mongodbUri,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
