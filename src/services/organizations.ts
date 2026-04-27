import { AxiosInstance } from 'axios';
import { Organization, OrganizationUpdateInput } from '../types';

export class OrganizationsService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async current(): Promise<Organization | null> {
    const resp = await this.http.get<{ item: Organization | null }>('/');
    return resp.data.item;
  }

  async update(input: OrganizationUpdateInput): Promise<Organization | null> {
    this.assertMutationAllowed('organizations.update');
    const resp = await this.http.patch<{ item: Organization | null }>(
      '/',
      input
    );
    return resp.data.item;
  }
}
