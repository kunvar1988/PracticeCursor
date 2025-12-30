export interface ApiKey {
  id: string;
  name: string;
  key: string;
  value?: string;
  type?: string;
  usage?: number;
  limit?: number | null;
  environment?: string;
  createdAt: string;
  lastUsed?: string;
}

export interface FormData {
  name: string;
  key: string;
  keyType: string;
  limitMonthly: boolean;
  monthlyLimit: string;
}

