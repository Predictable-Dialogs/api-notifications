import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiNotificationsController } from './api-notifications.controller';
import { ApiNotifyService } from './api-notifications.notify';
import { SessionService } from './api-notifications.session';

interface ApiNotificationsOptions {
  apiKey: string;
  endpoint: string;
}

@Global()
@Module({})
export class ApiNotificationsModule {
  static register(options: ApiNotificationsOptions) {
    return {
      module: ApiNotificationsModule,
      imports: [
        HttpModule.register({
          timeout: 500000,
          maxRedirects: 0,
        }),
      ],
      controllers: [ApiNotificationsController],
      providers: [
        {
          provide: 'API_OPTIONS',
          useValue: options,
        },
        SessionService,
        ApiNotifyService
      ],
      exports: [ApiNotifyService],
    };
  }
}
