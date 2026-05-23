export interface Organization {
  id: string;
  name: string;
  brandColor: string;
  logo: {
    mediaId: string;
    url: string;
  } | null;
}

export interface OrganizationUpdateInput {
  name?: string;
  logoMediaId?: string;
  brandColor?: string;
}

export type OrganizationCustomFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'string_list';

export interface OrganizationCustomFieldDefinition {
  id: string;
  key: string;
  label: string;
  type: OrganizationCustomFieldType;
  config: unknown;
  archivedAt: string | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationsCreateCustomFieldDefinitionInput {
  key: string;
  label: string;
  type: OrganizationCustomFieldType;
  config?: unknown;
}
