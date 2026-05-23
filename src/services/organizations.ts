import { AxiosInstance } from 'axios';
import {
  Organization,
  OrganizationCustomFieldDefinition,
  OrganizationsCreateCustomFieldDefinitionInput,
  OrganizationUpdateInput,
} from '../types';

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

  async listCustomFieldDefinitions(): Promise<OrganizationCustomFieldDefinition[]> {
    const resp = await this.http.get<{ items: OrganizationCustomFieldDefinition[] }>(
      '/custom-field-definitions'
    );
    return resp.data.items;
  }

  async createCustomFieldDefinition(
    input: OrganizationsCreateCustomFieldDefinitionInput
  ): Promise<OrganizationCustomFieldDefinition> {
    this.assertMutationAllowed('organizations.createCustomFieldDefinition');
    const resp = await this.http.post<{ item: OrganizationCustomFieldDefinition }>(
      '/custom-field-definitions',
      input
    );
    return resp.data.item;
  }
}
