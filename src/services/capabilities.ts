import { AxiosInstance } from 'axios';
import {
  PagedResult,
  Capability,
  CapabilityAssociation,
  CapabilitiesCreateInput,
  CapabilitiesGetEntityQuery,
  CapabilitiesListQuery,
  CapabilitiesSetEntityInput,
  CapabilitiesUpdateInput,
} from '../types';

export class CapabilitiesService {
  constructor(
    private readonly http: AxiosInstance,
    private readonly assertMutationAllowed: (operation: string) => void
  ) {}

  async list(query?: CapabilitiesListQuery): Promise<PagedResult<Capability>> {
    const resp = await this.http.get<PagedResult<Capability>>(
      '/learning/capabilities',
      { params: query ? { q: query.search, limit: query.limit, token: query.token } : undefined }
    );
    return resp.data;
  }

  async search(query?: string, limit?: number): Promise<Capability[]> {
    const resp = await this.http.get<Capability[]>(
      '/learning/capabilities/search',
      { params: { q: query, limit } }
    );
    return resp.data;
  }

  async create(input: CapabilitiesCreateInput): Promise<Capability> {
    this.assertMutationAllowed('capabilities.create');
    const resp = await this.http.post<Capability>(
      '/learning/capabilities',
      input
    );
    return resp.data;
  }

  async update(input: CapabilitiesUpdateInput): Promise<Capability> {
    this.assertMutationAllowed('capabilities.update');
    const resp = await this.http.put<Capability>(
      `/learning/capabilities/${input.capabilityId}`,
      { name: input.name }
    );
    return resp.data;
  }

  async delete(capabilityId: string): Promise<void> {
    this.assertMutationAllowed('capabilities.delete');
    await this.http.delete(`/learning/capabilities/${capabilityId}`);
  }

  async getEntityCapabilities(query: CapabilitiesGetEntityQuery): Promise<Capability[]> {
    const resp = await this.http.get<Capability[]>(
      '/learning/capabilities/by-entity',
      { params: { entityType: query.entityType, entityId: query.entityId } }
    );
    return resp.data;
  }

  async setEntityCapabilities(input: CapabilitiesSetEntityInput): Promise<void> {
    this.assertMutationAllowed('capabilities.setEntityCapabilities');
    await this.http.put('/learning/capabilities/by-entity', input);
  }

  async associate(
    capabilityId: string,
    association: CapabilityAssociation
  ): Promise<void> {
    this.assertMutationAllowed('capabilities.associate');
    await this.http.post(`/learning/capabilities/${capabilityId}/associations`, association);
  }

  async disassociate(
    capabilityId: string,
    association: CapabilityAssociation
  ): Promise<void> {
    this.assertMutationAllowed('capabilities.disassociate');
    await this.http.delete(`/learning/capabilities/${capabilityId}/associations`, {
      data: association,
    });
  }
}
