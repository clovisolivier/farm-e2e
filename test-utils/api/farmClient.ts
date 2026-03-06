import { APIRequestContext, expect, TestInfo } from "@playwright/test";
import { attachApiResponse } from "../attach";

export type Cow = { id: string; name: string };
export type Barn = { id: string; name: string; cows: Cow[] };
export type Farm = { id: string; name: string; barns: Barn[] };


export class FarmClient {
  constructor(
    private request: APIRequestContext,
    private testInfo: TestInfo) {}

  async reset(): Promise<void> {
    const res = await this.request.post("/api/test/reset");
    expect(res.ok()).toBeTruthy();
  }

  async createFarm(name: string): Promise<Farm> {
    const res = await this.request.post("/api/farmss", { data: { name } });
    if (!res.ok()) {
        await attachApiResponse(this.testInfo, "create-farm-failed", res);
    }      
    expect(res.status()).toBe(201);
    return (await res.json()).farm as Farm;
  }

  async listFarms(): Promise<Farm[]> {
    const res = await this.request.get("/api/farms");
    if (!res.ok()) {
        await attachApiResponse(this.testInfo, "create-farm-failed", res);
    }
    expect(res.ok()).toBeTruthy();
    return (await res.json()).farms as Farm[];
  }

  async createBarn(farmId: string, name: string): Promise<Barn> {
    const res = await this.request.post(`/api/farms/${farmId}/barns`, { data: { name } });
    if (!res.ok()) {
        await attachApiResponse(this.testInfo, "create-farm-failed", res);
    }
    expect(res.status()).toBe(201);
    return (await res.json()).barn as Barn;
  }

  async addCow(barnId: string, name: string): Promise<Cow> {
    const res = await this.request.post(`/api/barns/${barnId}/cows`, { data: { name } });
    if (!res.ok()) {
        await attachApiResponse(this.testInfo, "create-farm-failed", res);
    }
    expect(res.status()).toBe(201);
    return (await res.json()).cow as Cow;
  }
}