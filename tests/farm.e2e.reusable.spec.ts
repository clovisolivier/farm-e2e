import { test, expect } from "@playwright/test";
import { FarmClient } from "../test-utils/api/farmClient";
import { createFarmWithBarnAndCows } from "../test-utils/workflows/farmWorkflows";
import { expectFarmContainsBarnWithCows } from "../test-utils/expect/farmExpect";

test("E2E: farm -> barn -> cows", async ({ request }, testinfo) => {
  const client = new FarmClient(request, testinfo);

  await client.reset();

  await createFarmWithBarnAndCows(client, {
    farmName: "Green Farm",
    barnName: "Barn A",
    cowNames: ["Bella", "Luna"],
  });

  const farms = await client.listFarms();
  expect(farms).toHaveLength(1);

  const farm = farms[0];
  expect(farm.name).toBe("Green Farm");
  expectFarmContainsBarnWithCows(farm, "Barn A", ["Bella", "Luna"]);
});