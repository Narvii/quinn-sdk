export interface Location {
  id: string;
  orgId: string;
  label: string;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationsCreateInput {
  label: string;
}

export interface LocationsUpdateInput {
  locationId: string;
  label: string;
}
