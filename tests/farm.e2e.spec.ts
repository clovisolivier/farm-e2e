import { test, expect } from "@playwright/test";

test("Farm scenario: create farm -> barn -> cows -> verify", async ({ request }) => {
  // 1) reset
  const reset = await request.post("/api/test/reset");
  expect(reset.ok()).toBeTruthy();

  // 2) create farm
  const farmRes = await request.post("/api/farmes", {
    data: { name: "Green Farm" },
  });
  expect(farmRes.status()).toBe(201);
  const farmJson = await farmRes.json();
  const farmId = farmJson.farm.id as string;
  expect(farmId).toBeTruthy();

  // 3) create barn
  const barnRes = await request.post(`/api/farms/${farmId}/barns`, {
    data: { name: "Barn A" },
  });
  expect(barnRes.status()).toBe(201);
  const barnJson = await barnRes.json();
  const barnId = barnJson.barn.id as string;
  expect(barnId).toBeTruthy();

  // 4) add cows
  const cow1 = await request.post(`/api/barns/${barnId}/cows`, { data: { name: "Bella" } });
  expect(cow1.status()).toBe(201);

  const cow2 = await request.post(`/api/barns/${barnId}/cows`, { data: { name: "Luna" } });
  expect(cow2.status()).toBe(201);

  // 5) verify
  const farmsRes = await request.get("/api/farms");
  expect(farmsRes.ok()).toBeTruthy();
  const farmsJson = await farmsRes.json();

  const savedFarm = (farmsJson.farms as any[]).find((f) => f.id === farmId);
  expect(savedFarm).toBeTruthy();
  expect(savedFarm.name).toBe("Green Farm");

  const savedBarn = (savedFarm.barns as any[]).find((b) => b.id === barnId);
  expect(savedBarn).toBeTruthy();
  expect(savedBarn.name).toBe("Barn A");

  const cowNames = (savedBarn.cows as any[]).map((c) => c.name).sort();
  expect(cowNames).toEqual(["Bella", "Luna"].sort());
});

test("Farm scenario (Given/When/Then)", async ({ request }) => {
  let farmId = "";
  let barnId = "";

  await test.step("Given the API is reset", async () => {
    const res = await request.post("/api/test/reset");
    expect(res.ok()).toBeTruthy();
  });

  await test.step("When I create a farm 'Green Farm'", async () => {
    const res = await request.post("/api/farms", { data: { name: "Green Farm" } });
    expect(res.status()).toBe(201);
    const json = await res.json();
    farmId = json.farm.id;
  });

  await test.step("And I create a barn 'Barn A' in that farm", async () => {
    const res = await request.post(`/api/farms/${farmId}/barns`, { data: { name: "Barn A" } });
    expect(res.status()).toBe(201);
    const json = await res.json();
    barnId = json.barn.id;
  });

  await test.step("And I add cows 'Bella' and 'Luna' in that barn", async () => {
    const c1 = await request.post(`/api/barns/${barnId}/cows`, { data: { name: "Bella" } });
    expect(c1.status()).toBe(201);
    const c2 = await request.post(`/api/barns/${barnId}/cows`, { data: { name: "Luna" } });
    expect(c2.status()).toBe(201);
  });

  await test.step("Then listing farms should contain the farm with barn and cows", async () => {
    const res = await request.get("/api/farms");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();

    const farm = json.farms.find((f: any) => f.id === farmId);
    expect(farm.name).toBe("Green Farm");

    const barn = farm.barns.find((b: any) => b.id === barnId);
    const cowNames = barn.cows.map((c: any) => c.name).sort();
    expect(cowNames).toEqual(["Bella", "Luna"].sort());
  });
});