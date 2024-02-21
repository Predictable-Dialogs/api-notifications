import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SessionService } from './api-notifications.session';

@Injectable()
export class ApiNotifyService {
  private readonly endpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly sessionService: SessionService,
    @Inject('API_OPTIONS') options: { apiKey: string; endpoint: string },
  ) {
    this.endpoint = options.endpoint;
  }

  async notify(apiName: string, id: string, data: any) {
    const jobId = `${apiName}-${id}`;
    const session = this.sessionService.getSession(jobId);

    if (!session) {
      console.log(`Session not found for jobId: ${jobId}`);
      return;
    }

    const payload = {
      ...session,
      ...data,
    };

    const response = await this.httpService.post(this.endpoint, payload).toPromise();
    return response.data;
  }
}
