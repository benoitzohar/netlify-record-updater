export interface IpifyResult {
  ip: string;
}

export interface DnsRecord {
  id: string;
  hostname: string;
  value: string;
  type: string;
  ttl: number;
  priority?: number | null;
  weight?: number | null;
  port?: number | null;
  flag?: number | null;
  tag?: string | null;
  site_id?: string;
  dns_zone_id?: string;
  errors?: [];
  managed?: boolean;
}
