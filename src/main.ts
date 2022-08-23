import fetch from "node-fetch";
import { DnsRecord, IpifyResult } from "./types";

export const getCurrentIp = async (): Promise<string> => {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) {
    throw new Error(`Failed to get current IP: ${res.statusText}`);
  }
  const data = await res.json();
  return (data as IpifyResult).ip;
};

export const getDomain = (url: string): string => {
  if (!url) {
    throw new Error("Domain is required");
  }
  const split = url.split(".");
  if (split.length < 2) {
    throw new Error("Domain is invalid: " + url);
  }
  const tld = split[split.length - 1];
  const domain = split[split.length - 2];

  if (!tld || !domain) {
    throw new Error("Domain is invalid: " + url);
  }

  return [domain, tld].join("_");
};

const NETLIFY_DNS_ENDPOINT = "https://api.netlify.com/api/v1/dns_zones";
export const fetchNetlifyApi = async <T>(
  path: string,
  apiToken: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: unknown = undefined,
  noJsonParse = false
) => {
  const res = await fetch(`${NETLIFY_DNS_ENDPOINT}/${path}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${apiToken}`,
    },
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Domain not found: ${path.split("/")[0]}`);
    }
    throw new Error(
      `Failed to ${method} on the Netlify API (${NETLIFY_DNS_ENDPOINT}/${path}): ${res.statusText}`
    );
  }
  if (noJsonParse) return;
  return (await res.json()) as T;
};

export const getExistingRecord = async (url: string, apiToken: string) => {
  const domain = getDomain(url);
  const dnsRecords = await fetchNetlifyApi<DnsRecord[]>(
    `${domain}/dns_records`,
    apiToken
  );
  const host = dnsRecords?.find((r) => r.type === "A" && r.hostname === url);
  return host;
};

export const createRecord = async (
  url: string,
  ip: string,
  apiToken: string
) => {
  const domain = getDomain(url);
  const newRecord = await fetchNetlifyApi<DnsRecord>(
    `${domain}/dns_records`,
    apiToken,
    "POST",
    {
      hostname: url,
      ttl: 3600,
      type: "A",
      value: ip,
    }
  );

  if (!newRecord?.id) {
    throw new Error(
      `Failed to create new record: ${JSON.stringify(newRecord)}`
    );
  }
};

export const deleteRecord = async (
  url: string,
  recordId: string,
  apiToken: string
) => {
  if (!recordId) {
    throw new Error("Record ID is required to delete a record");
  }

  const domain = getDomain(url);
  await fetchNetlifyApi<DnsRecord>(
    `${domain}/dns_records/${recordId}`,
    apiToken,
    "DELETE",
    undefined,
    true
  );
};

export const run = async (url: string, apiToken: string, ip?: string) => {
  const newIp = ip || (await getCurrentIp());

  const existingRecord = await getExistingRecord(url, apiToken);
  if (!existingRecord || !existingRecord.id) {
    throw new Error(`No existing record found for ${url}`);
  }

  if (existingRecord.value === newIp) {
    console.log(`${url} is already set to ${newIp}`);
    return;
  }

  await createRecord(url, newIp, apiToken);
  await deleteRecord(url, existingRecord.id, apiToken);

  console.log("Updated DNS record for " + url + " to " + newIp);
};
