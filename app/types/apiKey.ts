export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type?: string;
  usage?: number;
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

