import { expect } from "@playwright/test";
import type { Farm } from "../api/farmClient";

export function expectFarmContainsBarnWithCows(
  farm: Farm,
  barnName: string,
  cowNames: string[]
) {
  const barn = farm.barns.find((b) => b.name === barnName);
  expect(barn, `Expected barn "${barnName}" to exist`).toBeTruthy();

  const actual = barn!.cows.map((c) => c.name).sort();
  expect(actual).toEqual([...cowNames].sort());
}