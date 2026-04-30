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
