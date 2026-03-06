# Farm API – Playwright E2E Tests

End-to-end backend tests for the **Farm API** using **Playwright**.

The goal of this project is to validate the API behaviour through realistic workflows instead of isolated endpoint tests.

Example workflow tested:

create farm  
create barn  
add cows  
verify farm structure  

The API under test runs locally on:

http://localhost:3001

---

# Requirements

- Node.js >= 18
- npm

The **Farm API** must be available locally.

Repository structure assumes:
- farm-api/
- farm-e2e/


---

# Installation

Install dependencies:

```bash
npm install
```

Install Playwright:

```bash
npx playwright install
```

---
## Running tests

Run all tests:
```bash
npm test
```
Run tests with Playwright UI:

```bash
npx playwright test tests/farm.e2e.spec.ts
```

---
## Test report

Playwright generates an HTML report.

Open the report:
```bash
npx playwright show-report
```
The report includes:
- test results
- execution time
- step breakdown
- attached API responses (on failure)

---
## Project Structure
```bash

farm-e2e

tests/
farm.e2e.spec.ts

test-utils/
fixtures.ts

api/
farmClient.ts

workflows/
farmWorkflows.ts

expect/
farmExpect.ts

playwright.config.ts
```
Description:
| Folder      | Purpose                     |
| ----------- | --------------------------- |
| `tests`     | End-to-end scenarios        |
| `api`       | API clients used by tests   |
| `workflows` | Reusable business workflows |
| `expect`    | Domain-specific assertions  |
| `fixtures`  | Playwright fixtures         |

---
## Testing Strategy

Tests are written at the workflow level, not endpoint level.

Instead of testing individual routes:
```bash

POST /farms
POST /barns
POST /cows
```
tests validate business behaviour:
```bash

Farm lifecycle
→ create farm
→ create barn
→ add cows
→ verify farm state
```

This approach ensures that:

- the API behaves correctly from a user perspective
- integrations between endpoints work
- regressions are caught earlier

---
## Fixtures

Playwright fixtures are used to provide reusable API clients.

Example:
```bash

test("farm scenario", async ({ clients }) => {

await clients.farm.reset()

const farm = await clients.farm.createFarm("Green Farm")

})
```

The clients fixture exposes all API clients used by the tests.

---
## API Clients

API clients wrap HTTP requests and provide typed helpers.

Example:
```bash

const farm = await clients.farm.createFarm("Green Farm")
```

This avoids repeating request code in tests and centralizes API behaviour.

---
## Workflows

Workflows represent reusable domain actions.

Example:
```bash

await createFarmWithBarnAndCows(client, {
farmName: "Green Farm",
barnName: "Barn A",
cowNames: ["Bella", "Luna"]
})
```

Workflows keep tests concise and readable.

---
## Attachments

When a request fails, the response is attached to the test report.

Example attachment:
```bash
create-farm-error.txt

status: 400

body:
{
"error": "VALIDATION_ERROR"
}
```

This makes debugging failures easier in CI.

---
## Running tests in CI

Typical pipeline:

```bash
1. Start Farm API
2. Run Playwright tests
3. Publish HTML report
4. Collect JUnit results
```

Playwright reporters configured:
- HTML
- JUnit

---
Example Scenario

```bash
Given the API is reset
When a farm "Green Farm" is created
And a barn "Barn A" is created
And cows "Bella" and "Luna" are added
Then the farm should contain the barn with the cows
```

---
# Purpose of this project

This repository demonstrates how to build maintainable backend E2E tests using:

- Playwright
- API clients
- reusable workflows
- domain assertions

The focus is on readable tests that scale as the API grows.

---

Si tu veux, je peux aussi te générer une **version encore plus “pro” du README** avec :

- badges CI  
- diagramme du workflow de test  
- exemple de **report Playwright**  
- section **“How to add a new test scenario”** (très apprécié dans les équipes QA).