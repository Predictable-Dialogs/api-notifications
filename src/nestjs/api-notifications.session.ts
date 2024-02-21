import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SessionService {
  private readonly endpoint: string;
  private sessions: Map<string, any> = new Map<string, any>();
  private defaultSessionTimeout: number = 30000; //2 minutes. 10 minute = 600000, 1 minute = 60,000 , you can adjust this

  constructor(
    private readonly httpService: HttpService,
    @Inject('API_OPTIONS') options: { apiKey: string; endpoint: string },
  ) {
    this.endpoint = options.endpoint;
  }

  createSession(sessionId: string, jobId: string, sessionTimeout?: number, data?: any) {
    const effectiveSessionTimeout = sessionTimeout ?? this.defaultSessionTimeout;

    const session = {
      lastActivity: Date.now(),
      jobId,
      sessionTimeout: effectiveSessionTimeout,
      sessionId,
      data,
    };
    this.sessions.set(jobId, session);
    return session;
  }

  getSession(jobId: string) {
    return this.sessions.get(jobId);
  }

  async checkAndDeleteExpiredSessions() {
    const keysToDelete = [];
  
    for (let [key, session] of this.sessions.entries()) {
      if (Date.now() - session.lastActivity > session.sessionTimeout) {
        console.log(`ApiNotifications: timeout, deleting session: ${key}`);
        await this.cancel(session);
        keysToDelete.push(key);
      }
    }
  
    for (let key of keysToDelete) {
      this.sessions.delete(key);
    }
  }


  async deleteSession(jobId) {
    this.sessions.delete(jobId);
  }

  
  async cancel(session) {
    const payload = {
      ...session,
    };
    const response = await this.httpService.post(`${this.endpoint}/timeout`, payload).toPromise();
    return response.data;
  }

}
