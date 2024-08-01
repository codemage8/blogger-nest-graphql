import { Module } from '@nestjs/common'
import { ConfigModule, type ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { type AppConfig, appConfig } from '~/config/app.config'
import type { AllConfigType } from '~/config/config.type'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: configService.get<AppConfig>('app').mongodbUri,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
