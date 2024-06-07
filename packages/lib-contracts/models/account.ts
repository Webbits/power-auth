type Account = {
  id: string;
  label: string;
  issuer: string;
  period: number;
  digits: number;
  algorithm: string;
  lastUpdatedAt: string;
  secret?: string;
  synced?: boolean;
};

export default Account;
