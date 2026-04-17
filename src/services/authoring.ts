import { AxiosInstance } from 'axios';
import { AuthoringEventRegistryItem } from '../types';

export class AuthoringService {
  constructor(private readonly http: AxiosInstance) {}

  async getEventRegistry(): Promise<AuthoringEventRegistryItem[]> {
    const resp = await this.http.get<{ items: AuthoringEventRegistryItem[] }>(
      '/authoring/event-registry'
    );
    return resp.data.items;
  }
}
