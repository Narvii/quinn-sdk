import { PaginationQuery, Privilege } from './common';

export interface Member {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  privilege: Privilege;
  managerUid: string | null;
  roleIds: string[];
  groupIds: string[];
  locationId: string | null;
  createdAt: string;
  phoneNumber: string | null;
}

export interface MembersListQuery extends PaginationQuery {
  search?: string;
  privilege?: Privilege | Privilege[];
  managerUid?: string;
  groupId?: string;
  locationId?: string;
  roleId?: string;
}

export interface MembersBatchGetInput {
  ids?: string[];
  emails?: string[];
}

export interface MembersCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  sendInvite?: boolean;
}

export interface MembersUpdatePrivilegeInput {
  memberId: string;
  privilege: Privilege;
}

export interface MembersUpdateRolesInput {
  memberId: string;
  roleIds: string[];
}

export interface MembersUpdateManagerInput {
  memberId: string;
  managerUid: string;
}

export interface MembersUpdateGroupsInput {
  memberId: string;
  groupIds: string[];
}

export interface MembersUpdateLocationInput {
  memberId: string;
  locationId: string | null;
}

export interface MembersUpdateProfileInput {
  memberId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export type MemberCustomFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'string_list'
  | 'ordered_list'
  | 'field_group'
  | 'user_picker_org'
  | 'user_picker_internal';

export interface MemberCustomFieldDefinition {
  id: string;
  key: string;
  label: string;
  type: MemberCustomFieldType;
  // Type-specific configuration. For `field_group`, holds the sub-field schema
  // (e.g. `{ subFields: [{ name, type }] }`). Null/absent for simple types.
  config: unknown;
}

export interface MembersCreateCustomFieldDefinitionInput {
  key: string;
  label: string;
  type: MemberCustomFieldType;
  // Type-specific configuration. Required for `field_group` to declare its
  // sub-fields (e.g. `{ subFields: [{ name, type }] }`).
  config?: unknown;
}

export interface MemberCustomFieldValue {
  fieldId: string;
  key: string;
  label: string;
  type: MemberCustomFieldType;
  value: unknown;
}

export interface MembersSetCustomFieldInput {
  memberId: string;
  fieldKey: string;
  value: unknown;
}

export interface MembersDeleteCustomFieldInput {
  memberId: string;
  fieldKey: string;
}
