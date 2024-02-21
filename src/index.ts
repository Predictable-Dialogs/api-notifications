import expressMiddleware from './express/expressMiddleware';
import { INestApplication } from '@nestjs/common';
import { Express } from 'express';
import { ApiNotifyService } from './nestjs/api-notifications.notify';

interface InitializeOptions {
  framework: 'Express' | 'NestJS';
  app: INestApplication | Express;
}

const initialize = ({ framework, app }: InitializeOptions): void => {
  if (framework === 'Express') {
    (app as Express).use('/pd-api-notifications', expressMiddleware);
  } else if (framework === 'NestJS') {
  } else {
    throw new Error('Invalid framework specified');
  }
};

export { initialize };
export { ApiNotificationsModule } from './nestjs/api-notifications.module';
export { ApiNotifyService } from './nestjs/api-notifications.notify';
