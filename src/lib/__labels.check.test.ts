import { describe, it } from "vitest";
import { resolveFieldLabel } from "./fieldLabels";
const cases: [string,string][] = [
  ["telecoms","commitmentEnd"],
  ["mutuelle-sante","beneficiariesAges"],
  ["sante-animale","currentInsurer"],
  ["sante-animale","currentPremium"],
  ["assurances-pro","subcontractingAmount"],
  ["assurances-pro","claimsDetail"],
  ["assurances-pro","terminationReason"],
  ["assurances-pro","decennaleActivities"],
];
describe("labels", () => { it("report", () => {
  for (const [p,k] of cases) { const l = resolveFieldLabel(p,k); console.log(`${l===k?"FAIL":"OK  "} ${p}.${k} -> ${l}`); }
}); });
