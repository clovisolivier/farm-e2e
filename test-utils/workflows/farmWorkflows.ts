import { FarmClient } from "../api/farmClient";

export async function createFarmWithBarnAndCows(
  client: FarmClient,
  input: { farmName: string; barnName: string; cowNames: string[] }
) {
  const farm = await client.createFarm(input.farmName);
  const barn = await client.createBarn(farm.id, input.barnName);

  for (const name of input.cowNames) {
    await client.addCow(barn.id, name);
  }

  return { farm, barn };
}