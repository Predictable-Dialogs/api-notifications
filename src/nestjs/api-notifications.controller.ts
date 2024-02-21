import { Controller, Get, Post, Res, Body, HttpStatus, Inject, BadRequestException } from '@nestjs/common';
import { SessionService } from './api-notifications.session';

@Controller('/pd-api-notifications')
export class ApiNotificationsController {
  constructor(
    @Inject('API_OPTIONS') options: { apiKey: string; endpoint: string },
    private readonly sessionService:SessionService,
    ) {}

  @Post()
  async handleRequest(@Body() { sessionId, jobName, sessionTimeout, jobKeyId, blockId, pageId }: { sessionId: string, jobName: string, sessionTimeout?: number, jobKeyId: string, blockId: string, pageId?: string }, @Res() response) {
    console.log('Endpoint hit:', { sessionId, sessionTimeout, jobName, jobKeyId });

    if (!sessionId) {
      throw new BadRequestException(`sessionId is mandatory`);
    }

    if (!jobName) {
      throw new BadRequestException(`jobName is mandatory`);
    }

    if (!jobKeyId) {
      throw new BadRequestException(`jobKeyId is mandatory`);
    }

    if (!blockId) {
      throw new BadRequestException(`blockId is mandatory`);
    }

    let data = {
      pageId, blockId
    }

    const jobId = `${jobName}-${jobKeyId}`;
    console.log(`ApiNotifications: The jobId is: ${jobId}`);
    const session = this.sessionService.createSession(sessionId, jobId, sessionTimeout, data);
    await this.sessionService.checkAndDeleteExpiredSessions();
    response.status(HttpStatus.OK).send();
    return;
  }

  @Post('/cancelJob')
  async handleCancel(@Body() { sessionId, jobName, sessionTimeout, jobKeyId }: { sessionId: string, jobName: string, sessionTimeout?: number, jobKeyId: string }, @Res() response) {
    console.log('ApiNotifications: Cancel Job Endpoint:', { sessionId, sessionTimeout, jobName, jobKeyId });

    if (!sessionId) {
      throw new BadRequestException(`sessionId is mandatory`);
    }

    if (!jobName) {
      throw new BadRequestException(`jobName is mandatory`);
    }

    if (!jobKeyId) {
      throw new BadRequestException(`jobKeyId is mandatory`);
    }

    const jobId = `${jobName}-${jobKeyId}`;
    console.log(`The jobId is: ${jobId}`);
    const session = this.sessionService.deleteSession(jobId);
    console.log(`Session deleted: ${JSON.stringify(session)}`);
    response.status(HttpStatus.OK).send();
    return;
  }


  @Get('/cleanExpiredSessions')
  async cleanExpiredSessions(@Res() response) {
    await this.sessionService.checkAndDeleteExpiredSessions();
    response.status(HttpStatus.OK).send();
  }

}
