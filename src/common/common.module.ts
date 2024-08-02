import { Module } from '@nestjs/common'
import { LoggingPlugin } from '~/common/plugins/logging.plugin'

@Module({
  providers: [LoggingPlugin],
})
export class CommonModule {}
