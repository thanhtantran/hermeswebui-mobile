export interface HermesURL {
  id: string;
  name: string;
  url: string;
  password?: string;
  saveCredentials: boolean;
  createdAt?: number;
  lastConnectedAt?: number;
  notes?: string;
}

export type ViewportMode = 'mobile' | 'tablet' | 'responsive';
