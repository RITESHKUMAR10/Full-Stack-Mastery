# Software Testing Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide covers **manual and automated software testing** for web, API and mobile applications: QA fundamentals (SDLC/STLC, test design techniques, bug lifecycle), automation with **Jest 29 / Vitest 2-3**, **React Testing Library**, **Playwright 1.4x**, **Cypress 13/14**, **Selenium 4**, **Supertest**, **Postman/Newman**, **k6**, **Pact**, **Testcontainers**, **Storybook/Chromatic**, **axe-core**, **Stryker** (mutation), plus CI integration (GitHub Actions) and AI-assisted testing. Tool APIs change quickly: anything marked "verify" should be checked in the official docs for your exact version. Examples use the sample name **Ritesh Kumar**.
> This file covers testing principles and the 7 testing principles (ISTQB), SDLC/STLC, test levels and types, test design techniques (equivalence partitioning, boundary value analysis, decision tables, state transition, pairwise), test plans/cases/bugs, severity vs priority, the test pyramid/trophy, TDD/BDD, unit/integration/E2E/API/contract/performance/security/accessibility/visual/mobile testing, mocking/stubbing/spying, test data and environments, flaky tests, code coverage and mutation testing, CI/CD integration, shift-left/shift-right testing, exploratory testing, metrics, and leadership topics (test strategy, quality culture). Related topics: microservices testing in `../03_Backend/039_Microservices.md`, API styles in `../03_Backend/035_GraphQL-and-REST-APIs.md`, security in `../03_Backend/036_Authentication-and-Security.md`, React in `../02_Frontend/008_React.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Code](#-part-6-hands-on-tasks--code)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Topics + Mixed)](#-part-11-complete-coverage-topics--mixed)
- [Part 12: Testing Internals](#-part-12-testing-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is software testing? *(Must-know)*
The process of evaluating a software product to find defects, verify it meets requirements and gain confidence in its quality. It includes **verification** ("are we building the product right?") and **validation** ("are we building the right product?"). Testing can show the presence of defects, not their absence.

### Q2. Why is testing important?
Finds bugs early (cheaper to fix), reduces risk (financial, safety, reputation), ensures requirements are met, improves reliability and security, enables safe refactoring and continuous delivery, and builds stakeholder confidence.

### Q3. The 7 principles of testing (ISTQB) *(Must-know)*
1. Testing shows the presence of defects, not their absence.
2. Exhaustive testing is impossible (use risk and priorities).
3. Early testing saves time and money (shift-left).
4. Defects cluster together (Pareto: ~80% in ~20% of modules).
5. Pesticide paradox: repeating the same tests stops finding new bugs; update tests.
6. Testing is context dependent (banking vs game).
7. Absence-of-errors fallacy: bug-free software can still fail user needs.

### Q4. QA vs QC vs Testing
- **QA (Quality Assurance):** process-oriented, preventive (standards, reviews, audits).
- **QC (Quality Control):** product-oriented, detective (inspect/test the product).
- **Testing:** an activity within QC that executes the software to find defects.

### Q5. Verification vs validation
Verification: checks work products against specs without running code (reviews, walkthroughs, inspections, static analysis). Validation: checks the running product meets user needs (dynamic testing, UAT).

### Q6. SDLC and STLC *(Must-know)*
**SDLC** (Software Development Life Cycle): requirements → design → development → testing → deployment → maintenance. **STLC** (Software Testing Life Cycle): requirement analysis → test planning → test case design → test environment setup → test execution → test closure. Each STLC phase has entry/exit criteria and deliverables (test plan, test cases, RTM, bug reports, summary report).

### Q7. Development models and testing
Waterfall (testing after build), V-model (test levels map to development phases), Agile/Scrum (continuous testing inside sprints, whole-team quality), DevOps (automation + continuous testing in pipelines). In Agile, testers collaborate from story refinement ("three amigos": dev, QA, product).

### Q8. Levels of testing *(Must-know)*
| Level | Scope | Who |
|---|---|---|
| Unit | Single function/class/component | Developers |
| Integration | Interaction between modules/services/DB | Devs/QA |
| System | Whole application end-to-end against requirements | QA |
| Acceptance (UAT) | Business validation before release | Business/Users/QA |

### Q9. Types of testing: functional vs non-functional
Functional: what the system does (feature, regression, smoke, sanity, API, UI). Non-functional: how well (performance, load, stress, security, usability, accessibility, compatibility, reliability, localization, compliance).

### Q10. Smoke vs sanity vs regression testing *(Must-know)*
- **Smoke:** quick, broad check that critical functions work after a new build ("is the build stable enough to test?").
- **Sanity:** narrow, deep check of a specific change or bug fix.
- **Regression:** re-testing existing functionality to ensure changes didn't break it; prime candidate for automation.
- **Retesting (confirmation):** re-running the failed test after a fix.

### Q11. Black-box vs white-box vs grey-box
Black-box: tests behaviour from the outside using requirements (no code knowledge). White-box: uses internal structure (statement/branch/path coverage). Grey-box: partial knowledge (e.g., DB access, API contracts) to design smarter tests.

### Q12. Static vs dynamic testing
Static: no execution (code review, linting, requirement reviews, SAST). Dynamic: running the code (unit, integration, system tests). Both are needed; static finds problems earlier.

### Q13. Manual vs automation testing
Manual: human-executed, good for exploratory, usability, ad-hoc, one-off checks. Automation: scripts/tools execute tests repeatedly (regression, data-driven, performance). Automate stable, repetitive, high-value tests; don't automate everything (maintenance cost).

### Q14. Test plan, test strategy, test case, test scenario
- **Test strategy:** high-level organization-wide approach (levels, tools, risks).
- **Test plan:** project-specific document (scope, schedule, resources, entry/exit criteria, risks).
- **Test scenario:** a high-level thing to test ("user logs in").
- **Test case:** detailed steps with preconditions, test data, expected result, postconditions.

### Q15. Anatomy of a good test case
ID, title, description/objective, preconditions, test data, steps, expected result, actual result, status, priority, requirement link, environment, postconditions. Good test cases are clear, independent, repeatable and traceable.

### Q16. Requirement Traceability Matrix (RTM)
A table mapping requirements to test cases (and defects) to ensure coverage and show impact when requirements change.

### Q17. Bug/defect life cycle *(Must-know)*
New → Assigned → Open → Fixed → Retest → Verified → Closed. Alternate paths: Reopened (fix failed), Rejected/Not a bug, Duplicate, Deferred, Cannot reproduce. Track in Jira, Azure DevOps, Bugzilla, Linear.

### Q18. Anatomy of a good bug report
Title (specific), environment (build, OS, browser, device), steps to reproduce, expected vs actual result, severity/priority, attachments (screenshots, video, logs, HAR), frequency (always/intermittent), root-cause hints. Reproducible, minimal, factual.

### Q19. Severity vs priority *(Must-know)*
**Severity:** technical impact of the defect (blocker, critical, major, minor, trivial). **Priority:** urgency to fix (business decision). Examples: logo typo on homepage → low severity, high priority; crash in rarely-used admin report → high severity, low priority.

### Q20. Error vs defect vs failure
Error (mistake by a human) → defect/bug/fault (flaw in code or document) → failure (visible deviation when executed).

### Q21. Entry and exit criteria
Entry: conditions to start testing (build deployed, environment ready, test cases reviewed). Exit: conditions to stop (all critical tests executed, no open blockers, coverage targets met, defect trends acceptable).

### Q22. Test environment and test data
Environment mirrors production as closely as feasible (OS, DB versions, configs, integrations). Test data: realistic but anonymized, covers valid/invalid/boundary cases, managed via seeds/factories; never use real PII in lower environments.

### Q23. Alpha vs beta testing
Alpha: internal testing by employees/QA in a controlled environment. Beta: limited release to real external users to gather feedback before general availability.

### Q24. Exploratory testing
Simultaneous learning, test design and execution without predefined scripts, guided by charters and heuristics; finds unexpected bugs. Document sessions (session-based test management: charter, time-box, notes, bugs).

### Q25. Ad-hoc testing
Informal, unstructured testing without documentation; relies on tester intuition. Less repeatable than exploratory testing.

### Q26. Compatibility testing
Verify behaviour across browsers (Chrome, Safari, Firefox, Edge), OS versions, devices, screen sizes, network conditions and locales. Use BrowserStack/Sauce Labs/LambdaTest and analytics-driven support matrices.

### Q27. Usability and accessibility testing
Usability: ease of learning/use (heuristic evaluation, user testing). Accessibility: usable by people with disabilities (WCAG 2.2 AA: keyboard navigation, screen readers, contrast, labels). Tools: axe, Lighthouse, NVDA/VoiceOver.

### Q28. Performance testing types
Load (expected load), stress (beyond limits), spike (sudden surges), soak/endurance (long duration), scalability, volume (large data). Metrics: response time, throughput, error rate, resource utilization, percentile latency.

### Q29. Security testing basics
Check authentication, authorization, input validation, session handling, encryption, OWASP Top 10 (SQLi, XSS, CSRF, IDOR, misconfigurations). Techniques: SAST, DAST, dependency scanning, pen testing. See `../03_Backend/036_Authentication-and-Security.md`.

### Q30. Definition of Done and acceptance criteria
Acceptance criteria describe the conditions a story must satisfy ("Given a registered user, when they enter a valid password, then they see the dashboard"). The **Definition of Done** is the team-wide checklist (code reviewed, unit and integration tests pass, no critical bugs, docs updated, deployed to staging, accessibility checked). Testers help sharpen both during refinement.

### Q31. Test design techniques overview *(Must-know)*
Black-box: **equivalence partitioning**, **boundary value analysis**, **decision tables**, **state transition**, **use-case testing**, **pairwise/combinatorial**, **error guessing**. White-box: statement, branch/decision, condition, path coverage.

### Q32. Equivalence partitioning (EP)
Divide inputs into classes expected to behave the same; test one value per class. Example: age 18-60 valid → partitions: <18 (invalid), 18-60 (valid), >60 (invalid) → test 10, 30, 70.

### Q33. Boundary value analysis (BVA)
Bugs cluster at edges: test min, min±1, max, max±1. For 18-60: 17, 18, 19, 59, 60, 61. Two-value BVA tests boundary and adjacent invalid; three-value adds the value inside.

### Q34. Decision table testing
Table of conditions and resulting actions covering all combinations of rules.
| Rule | Member | Order > ₹1000 | Coupon | Discount |
|---|---|---|---|---|
| R1 | Y | Y | Y | 25% |
| R2 | Y | Y | N | 15% |
| R3 | N | Y | Y | 10% |
| R4 | N | N | N | 0% |
Useful for business-rule-heavy features.

### Q35. State transition testing
Model system states, events and transitions (order: Created → Paid → Shipped → Delivered; invalid transitions like Delivered → Created must be rejected). Derive tests for valid and invalid transitions.

### Q36. Pairwise (all-pairs) testing
Covers every pair of parameter values with far fewer tests than full combinations (browser × OS × locale × role). Tools: PICT, AllPairs. Based on the observation that most defects involve ≤ 2 interacting factors.

### Q37. Code coverage types
Statement, branch/decision, condition, path, function, line. 100% line coverage doesn't mean good tests. Coverage shows what code ran, not whether assertions are meaningful.

### Q38. Positive vs negative testing
Positive: valid inputs produce expected behaviour. Negative: invalid/unexpected inputs are handled gracefully (error messages, no crashes, no security holes). Both are essential.

### Q39. Test case example: login
| ID | Scenario | Data | Expected |
|---|---|---|---|
| TC1 | Valid login | ritesh@example.com / Correct#123 | Redirect to dashboard |
| TC2 | Wrong password | valid email / wrong | Error "Invalid credentials", no lockout leak |
| TC3 | Empty fields | blank | Inline validation messages |
| TC4 | SQL injection | `' OR 1=1 --` | Rejected, no auth bypass |
| TC5 | Lockout | 5 failed attempts | Account locked/rate limited |
| TC6 | Session expiry | idle 30 min | Redirect to login |

### Q40. Common testing tools overview
Test management: Jira + Xray/Zephyr, TestRail. API: Postman, REST Client, Insomnia, Bruno. UI automation: Playwright, Cypress, Selenium, Appium. Unit: Jest, Vitest, JUnit, PyTest. Performance: k6, JMeter, Gatling, Locust. Security: OWASP ZAP, Burp Suite. Cross-browser/device: BrowserStack, Sauce Labs. CI: GitHub Actions, GitLab CI, Jenkins.

---

# 🔵 Part 2: Junior (1–3 years)

### Q41. The test pyramid *(Must-know)*
Many fast **unit** tests at the base, fewer **integration/service** tests in the middle, and a small number of slow **E2E/UI** tests at the top. Rationale: lower-level tests are faster, cheaper, more stable and pinpoint failures. Anti-pattern: the **ice-cream cone** (mostly manual/E2E tests, few unit tests).

### Q42. Testing trophy and other models
Kent C. Dodds' **testing trophy** emphasizes static analysis (TypeScript, ESLint) at the base, then unit, **integration** (the largest portion, best confidence per cost for frontends), and a few E2E. The **honeycomb** (Spotify) favours integration tests for microservices. Choose by architecture; the principle is "write tests that give confidence at low cost."

### Q43. Unit testing principles (F.I.R.S.T.)
**F**ast, **I**ndependent, **R**epeatable, **S**elf-validating, **T**imely. A unit test checks one behaviour in isolation, without network, real DB or clock dependence. Name tests by behaviour: `returns 404 when user does not exist`.

### Q44. Arrange-Act-Assert (AAA) and Given-When-Then
```js
test("applies 10% discount for members", () => {
  // Arrange
  const cart = new Cart({ member: true }); cart.add({ price: 1000, qty: 1 });
  // Act
  const total = cart.total();
  // Assert
  expect(total).toBe(900);
});
```
Given-When-Then expresses the same structure in BDD style.

### Q45. Jest basics *(Must-know)*
```js
// sum.test.js
import { sum } from "./sum";
describe("sum", () => {
  test("adds numbers", () => expect(sum(2, 3)).toBe(5));
  test("handles negatives", () => expect(sum(-2, -3)).toBe(-5));
  it.each([[1, 1, 2], [0, 5, 5]])("sum(%i, %i) = %i", (a, b, r) => expect(sum(a, b)).toBe(r));
});
```
Matchers: `toBe` (identity), `toEqual` (deep equality), `toStrictEqual`, `toBeNull`, `toContain`, `toThrow`, `toHaveBeenCalledWith`, `resolves/rejects`. Lifecycle: `beforeAll`, `beforeEach`, `afterEach`, `afterAll`. Run: `npx jest --coverage`.

### Q46. Jest vs Vitest
Vitest is Vite-native, ESM-first, very fast (watch mode with HMR), with a Jest-compatible API (`vi.fn`, `vi.mock`), built-in TypeScript/JSX support and in-source testing. Jest has the larger legacy ecosystem and mature tooling. For Vite projects prefer Vitest; for existing CRA/webpack/Node projects Jest remains common.

### Q47. Test doubles: dummy, stub, spy, mock, fake *(Must-know)*
| Double | Purpose |
|---|---|
| Dummy | Fills a parameter, never used |
| Stub | Returns canned answers |
| Spy | Wraps a real function to record calls |
| Mock | Pre-programmed with expectations about calls (verifies interactions) |
| Fake | Working lightweight implementation (in-memory DB) |
```js
const sendEmail = jest.fn().mockResolvedValue({ ok: true });         // stub/mock
await registerUser({ email: "ritesh@example.com" }, { sendEmail });
expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "ritesh@example.com" }));
```

### Q48. Mocking modules and timers
```js
jest.mock("./api");                       // automock a module
import { fetchUser } from "./api";
fetchUser.mockResolvedValueOnce({ id: 1, name: "Ritesh Kumar" });

jest.useFakeTimers();
const cb = jest.fn(); setTimeout(cb, 1000);
jest.advanceTimersByTime(1000);
expect(cb).toHaveBeenCalledTimes(1);
jest.useRealTimers();
```
Mock only boundaries (network, time, randomness); over-mocking makes tests pass while the real system is broken.

### Q49. Testing async code
```js
test("loads user", async () => {
  await expect(getUser(1)).resolves.toMatchObject({ id: 1 });
});
test("rejects on 404", async () => {
  await expect(getUser(999)).rejects.toThrow("Not found");
});
```
Always `await`/return promises; otherwise tests finish before assertions run.

### Q50. Snapshot testing: pros and cons
Snapshots store serialized output and compare on future runs (`toMatchSnapshot`, `toMatchInlineSnapshot`). Good for stable serializable output (error messages, small structures); bad for large UI trees: noisy diffs get rubber-stamped. Keep snapshots small and review diffs carefully.

### Q51. React Testing Library (RTL) philosophy *(Must-know)*
"The more your tests resemble the way your software is used, the more confidence they give." Query by role/label/text (what users perceive), not by implementation details (state, class names).
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("submits the form", async () => {
  const user = userEvent.setup(); const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  await user.type(screen.getByLabelText(/email/i), "ritesh@example.com");
  await user.type(screen.getByLabelText(/password/i), "Secret#123");
  await user.click(screen.getByRole("button", { name: /sign in/i }));
  expect(onSubmit).toHaveBeenCalledWith({ email: "ritesh@example.com", password: "Secret#123" });
});
```
Query priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort). Use `findBy*` for async, `queryBy*` to assert absence.

### Q52. Testing hooks and context
Use `renderHook` from RTL with a wrapper providing context/providers; assert on `result.current`; wrap updates in `act` (RTL does it for user events). Prefer testing hooks through components that use them when behaviour is UI-driven. See `../02_Frontend/008_React.md`.

### Q53. Mocking network with MSW
Mock Service Worker intercepts requests at the network layer so app code is unchanged.
```js
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
const server = setupServer(http.get("/api/user", () => HttpResponse.json({ name: "Ritesh Kumar" })));
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
The same handlers can power Storybook, local development and E2E.

### Q54. API testing basics *(Must-know)*
Verify status codes, response bodies/schemas, headers, error handling, auth, pagination, idempotency, rate limiting and performance. Tools: Postman/Newman, REST Client, Supertest, Playwright `request`, RestAssured, Karate.
```js
import request from "supertest";
it("creates a user", async () => {
  const res = await request(app).post("/api/users").send({ name: "Ritesh Kumar", email: "r@x.com" }).expect(201);
  expect(res.body).toMatchObject({ id: expect.any(String), name: "Ritesh Kumar" });
  expect(res.headers.location).toMatch(/\/api\/users\/.+/);
});
```

### Q55. Postman essentials
Collections, environments/variables, pre-request scripts, tests (`pm.test`, `pm.expect`), data-driven runs with CSV/JSON, chaining requests (extract token → next call), Newman CLI for CI.
```js
pm.test("status is 200", () => pm.response.to.have.status(200));
pm.test("has id", () => pm.expect(pm.response.json().id).to.be.a("string"));
pm.environment.set("token", pm.response.json().token);
```

### Q56. JSON schema validation in API tests
Validate response shape with JSON Schema/OpenAPI (Ajv, `jest-openapi`, Postman `tv4`) to catch missing fields and wrong types, not just values. Pair with contract tests for consumer expectations.

### Q57. Selenium WebDriver basics
Browser automation via the W3C WebDriver protocol: locate elements (`By.id`, CSS, XPath), actions, explicit waits, page object model. Drawbacks: slower, flakier than modern tools without disciplined waits. Selenium Grid scales parallel runs. Still common in enterprises and Java stacks.
```js
const { Builder, By, until } = require("selenium-webdriver");
const driver = await new Builder().forBrowser("chrome").build();
await driver.get("https://example.com/login");
await driver.findElement(By.css("#email")).sendKeys("ritesh@example.com");
await driver.wait(until.elementLocated(By.css(".dashboard")), 5000);
await driver.quit();
```

### Q58. Playwright basics *(Must-know)*
```ts
import { test, expect } from "@playwright/test";
test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("ritesh@example.com");
  await page.getByLabel("Password").fill("Secret#123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: "Welcome, Ritesh" })).toBeVisible();
});
```
Features: auto-waiting, web-first assertions with retries, multiple browsers (Chromium/Firefox/WebKit), parallelism, tracing (`trace: "on-first-retry"`), codegen, network interception, fixtures, API testing, component testing (experimental). Run: `npx playwright test --ui`.

### Q59. Cypress basics and differences
Runs in the browser alongside the app; time-travel debugging, automatic retries, network stubbing (`cy.intercept`). Limitations: historically single-origin (relaxed with `cy.origin`), no multi-tab, JS/TS only. Playwright offers broader browser coverage, multi-tab and built-in parallelism; Cypress has a rich interactive runner. Both are production-grade.
```js
cy.visit("/login");
cy.findByLabelText(/email/i).type("ritesh@example.com");
cy.intercept("POST", "/api/login", { fixture: "login.json" }).as("login");
cy.contains("button", /sign in/i).click();
cy.wait("@login");
cy.url().should("include", "/dashboard");
```

### Q60. Locators strategy
Prefer user-facing locators (role, label, text) and stable `data-testid` attributes over brittle CSS chains or XPath (`//div[3]/span[2]`). Avoid locating by auto-generated class names. Locator stability is the biggest factor in maintenance cost.

### Q61. Waiting: implicit, explicit, auto-wait
Avoid `sleep(5000)`. Use auto-waiting (Playwright/Cypress) or explicit conditions (`waitForSelector`, `expect(...).toBeVisible()`). Hard sleeps make tests slow and still flaky.

### Q62. Page Object Model (POM)
Encapsulate page structure and actions in classes to reduce duplication and isolate selector changes.
```ts
class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }
}
```
Keep assertions in tests, not in page objects (or use sparingly). Alternatives: component objects, fixtures, screenplay pattern.

### Q63. Data-driven and parameterized testing
Run the same test with multiple data sets (CSV/JSON, `test.each`, Playwright parametrized tests). Improves coverage of boundary and negative cases without duplicating code.

### Q64. TDD (Test-Driven Development) *(Must-know)*
Red → Green → Refactor: write a failing test, write the minimum code to pass, then refactor safely. Benefits: design pressure toward testable code, living documentation, fewer regressions. Costs: discipline, learning curve; works best for logic-heavy code. Not mandatory for every line (spikes, UI layout).

### Q65. BDD (Behaviour-Driven Development) and Gherkin
Collaboration technique expressing behaviour in business language, often executable.
```gherkin
Feature: Login
  Scenario: Successful login
    Given a registered user "ritesh@example.com"
    When they sign in with the correct password
    Then they see the dashboard
```
Tools: Cucumber, SpecFlow, Behave, playwright-bdd. Value comes from shared understanding (three amigos), not from the tool; avoid UI-detail steps.

### Q66. Test data management
Factories/builders (Fishery, @faker-js/faker) for flexible objects, seed scripts for baseline data, per-test isolation (unique IDs, transactions rolled back, containers per suite), anonymized production snapshots when needed, cleanup strategies. Avoid shared mutable data between tests.

### Q67. Test isolation and independence
Each test sets up and tears down its own state; no order dependencies; parallel-safe. Dependencies between tests are a top source of flakiness and hard-to-debug failures.

### Q68. Flaky tests *(Must-know)*
Tests that pass/fail non-deterministically without code changes. Causes: timing/race conditions, shared state, environment instability, network/third-party dependencies, randomness, time zones/dates, test order dependence, resource limits in CI. Fix root causes: deterministic waits, isolation, mock externals, freeze time, seed randomness; quarantine flaky tests, track flake rate, and never normalize "just re-run."

### Q69. Code coverage: what it tells you
Coverage measures executed code, not correctness. Use it to find untested areas, not as a target to game. Healthy targets differ (e.g., 70-85% overall, higher for critical logic). Combine with mutation testing to evaluate assertion quality. `jest --coverage`, `c8`, `nyc`, JaCoCo.

### Q70. Static analysis and linting as testing
Type checkers (TypeScript), ESLint with security plugins, Prettier, SonarQube, Semgrep, dependency audit. Cheap, fast feedback that prevents entire classes of bugs before runtime tests.

### Q71. Regression suite design
Prioritize by risk and usage: critical user journeys first, stable features, past defects. Keep it fast (parallelize, tiered suites: smoke on every commit, full regression nightly). Remove obsolete tests; fix or delete flaky ones.

### Q72. Bug triage and reproduction skills
Reproduce reliably, isolate variables (browser, data, account), find minimal steps, check logs/network/console, compare versions (bisect), identify recent changes, and provide evidence. Good triage speeds fixes more than any tool.

### Q73. Testing REST vs GraphQL
REST: assert status codes, headers, schemas per endpoint. GraphQL: single endpoint, test queries/mutations, nullability, errors array with partial data, authorization per field, depth/complexity limits, N+1 performance. See `../03_Backend/035_GraphQL-and-REST-APIs.md`.

### Q74. Database testing basics
Verify schema, constraints, migrations, stored procedures, data integrity and transactions; use test DBs (Testcontainers), rollback or truncate between tests; check SQL performance with realistic volumes. For ORMs, test queries against a real engine, not only mocks.

### Q75. Mobile testing basics
Real devices vs emulators/simulators, OS/version fragmentation, gestures, permissions, interruptions (calls, notifications), network changes (offline/3G), battery, app lifecycle, store compliance. Tools: Appium, Detox (React Native), Espresso (Android), XCUITest (iOS), Maestro, BrowserStack App Automate.

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. Designing a test automation framework *(Must-know)*
Layers: test runner + assertions; page/component objects or helpers; fixtures for setup (auth, data); utilities (API clients, DB access, wait helpers); config for environments; reporting (HTML, Allure, JUnit XML); CI integration; secrets management. Principles: readable tests, DRY helpers without over-abstraction, fast feedback, parallel-safe, deterministic, easy to debug (traces, videos, screenshots, logs).

### Q77. Reusing authentication in UI tests
Log in once via API/UI, save `storageState` (cookies/localStorage) and reuse it across tests to avoid repeating slow logins.
```ts
// global-setup.ts
await page.request.post("/api/login", { data: { email, password } });
await page.context().storageState({ path: "auth.json" });
// playwright.config.ts → use: { storageState: "auth.json" }
```
Use separate states per role (admin, user).

### Q78. API-first test setup
Create test data through APIs or DB seeds rather than clicking through the UI; assert UI behaviour only for the scenario under test. Cuts runtime and flakiness. Tear down via API.

### Q79. Parallel execution and sharding
Run tests across workers/CI machines: Playwright `workers`, `--shard=1/4`; Jest `--maxWorkers`; Cypress parallelization (Cloud or sorry-cypress). Requires isolated data and stateless tests; balance shards by historical duration.

### Q80. Test reporting and observability
Artifacts: JUnit XML, HTML report, traces (Playwright trace viewer), videos/screenshots on failure, console and network logs. Dashboards for pass rate, duration, flake rate, top failing tests (Allure, ReportPortal, Datadog CI Visibility, BuildPulse).

### Q81. Integration testing with real dependencies (Testcontainers) *(Must-know)*
Spin up real DB/broker/Redis in Docker per test run for realistic integration tests.
```ts
import { PostgreSqlContainer } from "@testcontainers/postgresql";
let container, db;
beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16").start();
  db = new Pool({ connectionString: container.getConnectionUri() });
  await migrate(db);
}, 60_000);
afterAll(async () => { await db.end(); await container.stop(); });
```
Slower than mocks but catches SQL, serialization and config bugs. See `../03_Backend/033_Prisma-and-ORMs.md` style integration patterns.

### Q82. Contract testing (Pact)
Consumer defines expectations; provider verifies them in CI, enabling independent deployments and avoiding brittle E2E environments. `can-i-deploy` checks compatibility before release. For events, validate schemas via a registry. See `../03_Backend/039_Microservices.md`.

### Q83. Component and visual testing
Test UI components in isolation (Storybook + interaction tests, Playwright component testing, Cypress component testing). Visual regression: screenshot comparison (Playwright `toHaveScreenshot`, Chromatic, Percy, Applitools) with masking of dynamic regions and stable fonts/viewports to reduce noise.

### Q84. Accessibility testing in automation
```ts
import AxeBuilder from "@axe-core/playwright";
test("home page has no a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
```
Automation catches ~30-40% of issues; manual keyboard and screen-reader testing is still required.

### Q85. Performance testing with k6 *(Must-know)*
```js
import http from "k6/http"; import { check, sleep } from "k6";
export const options = {
  stages: [{ duration: "2m", target: 100 }, { duration: "5m", target: 100 }, { duration: "1m", target: 0 }],
  thresholds: { http_req_duration: ["p(95)<500"], http_req_failed: ["rate<0.01"] },
};
export default function () {
  const res = http.get("https://api.example.com/products");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
```
Thresholds make the test fail in CI when SLOs regress. Alternatives: JMeter, Gatling, Locust, Artillery.

### Q86. Designing realistic load tests
Model real user journeys and think times, realistic data volumes and distributions, ramp-up/steady-state/ramp-down, cache warm vs cold, environment parity, monitor server metrics (CPU, memory, DB, GC), distinguish client-side from server bottlenecks, run multiple times and compare baselines. Avoid load testing third-party production systems.

### Q87. Interpreting performance results
Use percentiles (p50/p95/p99), not averages; watch throughput vs latency curve (knee point), error rates, saturation, queue lengths. Identify bottlenecks via APM/profiling; confirm with targeted experiments.

### Q88. Security testing in the pipeline
SAST (CodeQL, Semgrep), dependency scanning (npm audit, Snyk, OSV), secrets scanning, container scanning (Trivy), DAST (ZAP baseline) against staging, API security tests (auth bypass, IDOR, rate limit), and periodic pen tests. Write automated regression tests for fixed vulnerabilities. See `../03_Backend/036_Authentication-and-Security.md`.

### Q89. Chaos and resilience testing
Inject failures (latency, dependency outages, pod kills) to verify timeouts, retries, circuit breakers and alerting; run in staging first; define steady-state hypotheses and abort conditions. Tools: Chaos Mesh, Litmus, Gremlin, Toxiproxy.

### Q90. Mutation testing
Tools (Stryker, PIT) mutate code (change `>` to `>=`, remove calls) and check whether tests fail; surviving mutants reveal weak assertions. Expensive: run on critical modules or nightly. Mutation score complements coverage.

### Q91. Property-based testing
Generate many random inputs and assert invariants (e.g., `decode(encode(x)) === x`; sorting is idempotent). Libraries: fast-check, Hypothesis, QuickCheck. Finds edge cases humans miss; shrinks failing inputs to minimal examples.
```js
import fc from "fast-check";
test("reverse twice is identity", () => fc.assert(fc.property(fc.array(fc.integer()), (a) => expect([...a].reverse().reverse()).toEqual(a))));
```

### Q92. Testing time, randomness and external services
Inject clocks and RNGs (or fake them: `jest.useFakeTimers`, `vi.setSystemTime`), seed random generators, wrap third parties behind interfaces and use contract tests or sandboxes, record/replay HTTP (Polly.js, nock, VCR) carefully to avoid stale fixtures.

### Q93. Testing asynchronous workflows (queues, webhooks)
Use polling with timeouts and eventual assertions (`expect.poll`, `waitFor`), unique correlation IDs, test brokers (Testcontainers), idempotency tests (deliver twice), DLQ behaviour tests, and fake time for delayed jobs. See `../03_Backend/038_Message-Queues.md`.

### Q94. Testing microservices
Unit tests per service; component tests with stubbed dependencies; contract tests between services; a few E2E journeys in a production-like environment; observability-based testing in production (synthetics, canaries). Avoid a giant shared E2E suite as the primary safety net.

### Q95. Testing in CI/CD *(Must-know)*
Pipeline stages: lint/typecheck → unit → build → integration/contract → deploy to ephemeral/staging env → E2E smoke → security/perf checks → deploy with canary and synthetic monitoring. Fail fast, parallelize, cache dependencies, publish reports, gate merges on required checks, track flakiness.

### Q96. Test environments strategy
Local (Docker Compose), ephemeral per-PR environments, shared staging, pre-prod, production (with feature flags and synthetic tests). Prefer ephemeral environments for isolation; manage data and secrets carefully; keep parity via IaC.

### Q97. Feature flags and testing
Test both flag states; use deterministic flag overrides in tests; run smoke tests with defaults; clean up flags; avoid combinatorial explosions by testing critical combinations (pairwise).

### Q98. Shift-left and shift-right testing
Shift-left: involve testing early (requirement reviews, testable design, unit/contract tests, static analysis). Shift-right: test in production safely (canary releases, A/B tests, synthetic monitoring, real user monitoring, observability, chaos). Both reduce risk.

### Q99. Exploratory testing charters and heuristics
Charter: "Explore checkout with expired cards to discover error handling issues." Heuristics: SFDIPOT (Structure, Function, Data, Interfaces, Platform, Operations, Time), CRUD, boundaries, interruptions, state. Record notes, bugs, questions and risks.

### Q100. Risk-based testing
Prioritize by likelihood × impact: complex or changed code, critical business flows (payments), security-sensitive areas, historically defect-prone modules. Allocate depth of testing accordingly and document accepted risks.

### Q101. Metrics that matter in QA
Defect escape rate, defect density, test pass rate, automation coverage of critical flows, flake rate, mean time to detect/repair, cycle time for tests, change failure rate (DORA). Beware vanity metrics (number of test cases, raw coverage).

### Q102. Test estimation techniques
Work breakdown, historical data, three-point estimation (optimistic/likely/pessimistic), percentage of dev effort, risk-adjusted effort, story-point alignment in Agile. Include automation maintenance and environment setup.

### Q103. Handling third-party dependencies in tests
Sandbox accounts, mock servers (WireMock, MSW), contract tests, circuit-breaker behaviour tests, test failure modes (timeouts, 5xx, malformed payloads). Avoid depending on live third parties in CI.

### Q104. Testing authentication and authorization
Positive and negative flows: valid/invalid credentials, expired tokens, token tampering, role-based access, IDOR attempts, session fixation/logout, MFA flows, password reset security, rate limiting. Automate role matrices (user × resource × action).

### Q105. Localization and internationalization testing
Pseudo-localization, long strings (German), RTL languages (Arabic/Hebrew), date/number/currency formats, time zones/DST, Unicode input, encoding, locale fallback. Don't hard-code strings; verify layout resilience.

### Q106. Testing file uploads and downloads
Valid/invalid types, size limits, empty files, corrupted files, special characters in names, concurrent uploads, virus scanning behaviour, resumable uploads, content-type spoofing, download integrity (hash), permissions on stored files.

### Q107. Testing emails, SMS and notifications
Use mail catchers (MailHog, Mailpit, Mailtrap) or provider test modes; assert content, links, templates, localization, deliverability headers; for SMS use test numbers/sandbox; avoid sending real messages from CI.

### Q108. Test debt and maintenance
Signs: slow suites, flaky tests, duplicated setup, commented-out tests, brittle selectors, unclear failures. Reduce with regular suite health reviews, refactoring helpers, deleting low-value tests, improving locators and data management, and treating tests as production code.

---

# 🟠 Part 4: Senior (5–7 years)

### Q109. Designing a test strategy for a new product *(Must-know)*
1. **Understand risk:** business-critical flows, regulatory needs, architecture, team size.
2. **Choose the shape:** testing trophy/pyramid per architecture (frontend-heavy → integration-heavy; microservices → contract + component).
3. **Define levels and owners:** developers own unit/integration; QA engineers own framework health, exploratory, risk analysis.
4. **Tooling:** Vitest/Jest, RTL, Playwright, Pact, k6, axe, Testcontainers, CI.
5. **Quality gates:** required checks on PRs, coverage on changed code, flake budget.
6. **Environments & data:** ephemeral envs, factories, secrets.
7. **Non-functional:** performance budgets, security scans, accessibility, resilience drills.
8. **Metrics & feedback loops:** escape rate, flake rate, DORA; retros on escaped defects.

### Q110. Building a reliable E2E suite
Keep it small and focused on critical journeys (signup, login, checkout); API-based setup; stable locators; deterministic data; parallel-safe; retries only as a diagnostic aid (not to hide flakiness); trace/video on failure; run smoke E2E on every PR and the full suite nightly; quarantine and fix flaky tests quickly with owners and SLAs.

### Q111. Root-cause analysis of flaky tests
Collect history (which tests, which runners, time of day), reproduce with repeated runs (`--repeat-each`), capture traces, check shared state, timing (network, animations), resource limits (CPU throttling in CI), test order, dependency on external services, date/time boundaries. Fix at the source (wait for conditions, isolate data, mock externals); measure flake rate over time.

### Q112. Quality gates in CI
Required: lint/type check, unit and integration pass, contract verification (`can-i-deploy`), security scans (no high vulns), coverage of changed lines, bundle-size and performance budgets, accessibility checks on key pages. Gates must be fast and trusted; slow or flaky gates get bypassed.

### Q113. Test impact analysis & selective testing
Run only tests affected by a change (dependency graph, `jest --findRelatedTests`, Nx affected, Bazel, Launchable/ML-based selection), with periodic full runs. Cuts feedback time in large monorepos; risk: missed indirect dependencies, so validate with nightly full suites.

### Q114. Contract testing at scale
Pact Broker with environments and `can-i-deploy`, provider states managed via APIs, versioning by git SHA, webhooks triggering provider verification, handling of pending/WIP pacts, and schema-based contracts (OpenAPI/Protobuf/Avro) for async messaging. Combine with consumer-driven expectations to avoid false confidence in overly broad contracts.

### Q115. Testing data pipelines and ETL
Unit tests for transformations (small fixtures), schema/contract tests, data quality checks (Great Expectations, dbt tests: not null, unique, accepted values, referential integrity), reconciliation of counts/aggregates, idempotency tests, backfill tests, performance with representative volumes, and monitoring in production.

### Q116. Testing ML/AI features
Deterministic components: unit tests. Models: offline evaluation sets, regression benchmarks, slice-based metrics, drift monitoring, bias/fairness checks, robustness (adversarial/noisy inputs). LLM apps: golden datasets, rubric/LLM-as-judge evaluations with human calibration, prompt regression tests, safety/red-team tests, cost/latency budgets, nondeterminism handling (temperature 0, tolerance-based asserts). See `../11_Generative_AI/072_LLM-Evaluation-and-Guardrails.md`.

### Q117. AI-assisted testing (tools & caution)
Uses: generate test cases/data, suggest locators, self-healing selectors, visual diffing, test summarization, log triage. Risks: plausible but wrong tests, hidden flakiness, privacy leakage, over-trust. Review generated tests like code, keep humans accountable for oracles and risk decisions.

### Q118. Testing for resilience in distributed systems
Fault injection (latency, packet loss, dependency down), duplicate/out-of-order messages, partial failures, clock skew, retries/idempotency, circuit-breaker verification, backup/restore drills, region failover tests, game days with observability. Assert on user-visible SLOs, not just internals.

### Q119. Performance engineering workflow
Define SLOs → baseline with load tests → profile (APM, flamegraphs, DB slow logs) → fix hotspots → re-test → add performance budgets in CI (Lighthouse CI, k6 thresholds, bundle-size limits) → monitor in production (RUM, synthetic). Investigate regressions per commit with trend tracking.

### Q120. Frontend performance testing
Lighthouse CI for Core Web Vitals (LCP, INP, CLS), WebPageTest, Playwright performance traces, bundle analyzers, throttled CPU/network profiles, RUM with web-vitals library; set budgets (JS size, LCP < 2.5 s at p75). See `../01_Website/007_Web-Performance-and-Browser-Internals.md`.

### Q121. Test architecture for monorepos
Shared test utilities package, per-package test configs, consistent runners, affected-only CI, cached builds (Turborepo/Nx), shared MSW handlers/fixtures, strict ownership of cross-package E2E, and per-package coverage thresholds.

### Q122. Testing legacy code
Characterization tests capture current behaviour before refactoring; add seams (dependency injection) to isolate; approval/snapshot testing for complex outputs; strangle gradually; prioritize high-change, high-risk areas; use mutation testing to validate characterization quality.

### Q123. Regression strategy under time pressure
Risk-based selection: changed areas + critical journeys + high-defect modules; automated smoke + targeted regression; exploratory sessions on risky changes; feature flags to limit exposure; canary release with monitoring; clear go/no-go criteria and documented residual risks.

### Q124. Defect prevention vs detection
Prevent via requirements clarity (examples, acceptance criteria), design reviews, static analysis, code reviews, TDD, pairing, threat modelling. Detect via layered tests and monitoring. Track root causes of escaped defects and feed back into prevention (updated checklists, tests, templates).

### Q125. Production monitoring as testing
Synthetic monitoring (Playwright scripts on schedules), health checks, SLO alerts, error tracking (Sentry), RUM, canary analysis, feature-flagged rollouts with automatic rollback, log-based anomaly detection. Production is a test environment for reality; use safeguards.

### Q126. Test strategy for mobile apps at scale
Pyramid with unit + component tests, device-cloud smoke/regression across popular devices, staged rollouts, crash reporting (Crashlytics), analytics-based device matrix, offline/poor-network tests, deep link and permission flows, accessibility (TalkBack/VoiceOver), release checklist with store requirements.

### Q127. Compliance, audit and traceability
For regulated domains (finance, healthcare), maintain traceability from requirements to tests to results, immutable test evidence, validation protocols, change control, segregation of duties, retention of artifacts, and risk assessments. Automate evidence collection from CI.

### Q128. Quality engineering vs QA
Quality engineering embeds quality across the lifecycle: building automation frameworks, enabling developers, observability, reliability, and tooling, rather than only executing test cases. The tester role evolves into SDET/quality coach with strong coding, systems and risk skills.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q129. Building a quality culture
Make quality a team responsibility (devs write tests, QA coaches), define the Definition of Done including testing, celebrate prevention, run blameless retros on escaped defects, expose quality metrics, invest in fast feedback, and align incentives so shipping fast and safely are both rewarded.

### Q130. Evolving the testing strategy as the product scales
Start with unit + a few E2E; add integration/contract tests as services multiply; introduce performance and security gating at maturity; adopt ephemeral environments and progressive delivery; invest in test infrastructure (sharding, flake tracking, test data services). Review the strategy quarterly against defect data and cycle time.

### Q131. Automation ROI and prioritization
Automate by value: high-risk, stable, repetitive, high-frequency flows; skip volatile, one-off or low-risk tests. ROI = (manual effort saved × runs) − (build + maintenance cost). Track maintenance load and delete low-value tests. Automation is a product with a backlog and roadmap.

### Q132. Organizing QA in different team models
Embedded SDETs per squad, centralized quality platform team providing frameworks/tooling/enablement, hybrid with communities of practice. Decide based on org size and maturity; avoid a separate "test phase" team gating releases after development.

### Q133. Release readiness and go/no-go
Criteria: critical defects resolved, regression and smoke green, performance/security checks within budgets, rollout and rollback plans, monitoring/alerts ready, documentation updated, stakeholder sign-off. Use progressive delivery to reduce reliance on "perfect" pre-release testing.

### Q134. Test data and environments platform
Self-service ephemeral environments (Kubernetes namespaces per PR), synthetic data generators with privacy guarantees, service virtualization for unavailable dependencies, data refresh pipelines, secrets management, cost controls (auto-teardown). Treat as an internal product with SLAs.

### Q135. Managing a large flaky/slow test estate
Baseline metrics (duration, flake rate, failure causes), triage top offenders, enforce ownership, introduce quarantine with deadlines, shard and cache, delete redundant tests, shift coverage down the pyramid, and report progress. Aim for a trusted <10-15 minute PR feedback loop.

### Q136. Risk communication to leadership
Present quality in business terms: customer impact, incident cost, release confidence, DORA metrics, trend lines of escaped defects and MTTR; offer options with trade-offs (invest in automation vs accept risk); use dashboards, not anecdotes.

### Q137. Hiring and growing testers/SDETs
Assess testing mindset (risk thinking, exploratory skills), coding ability, debugging, system understanding, communication. Provide growth paths (SDET, performance, security, quality coach), mentoring, and cross-training with developers.

### Q138. Governance of tooling
Standardize on a small set of supported tools (one E2E framework, one unit framework per language, one performance tool), provide templates and CI components, deprecate redundant tools, evaluate new tools with time-boxed spikes on real tests before adoption.

### Q139. Testing in regulated/safety-critical contexts
Formal verification of requirements, MC/DC coverage (avionics), independent validation, hazard analysis (FMEA), simulation/hardware-in-the-loop, extensive traceability and documentation, and strict change control. Understand when agile practices must adapt to regulations.

### Q140. Future trends
AI-assisted test generation and maintenance, autonomous exploratory agents, production-first quality with observability and progressive delivery, contract-first development, shift-left security, model-based testing, and consolidated "quality platforms." Fundamentals (risk thinking, clear oracles, fast feedback) remain constant.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Vitest + RTL test suite for a todo component
```tsx
// TodoList.test.tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  it("adds and completes a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);
    await user.type(screen.getByRole("textbox", { name: /new todo/i }), "Write tests");
    await user.click(screen.getByRole("button", { name: /add/i }));
    const item = screen.getByRole("listitem");
    expect(within(item).getByText("Write tests")).toBeInTheDocument();
    await user.click(within(item).getByRole("checkbox"));
    expect(within(item).getByRole("checkbox")).toBeChecked();
  });

  it("shows an error when saving fails", async () => {
    server.use(http.post("/api/todos", () => HttpResponse.json({ error: "boom" }, { status: 500 })));
    const user = userEvent.setup();
    render(<TodoList />);
    await user.type(screen.getByRole("textbox", { name: /new todo/i }), "x");
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not save/i);
  });
});
```

### H2. Playwright config with projects, sharding, traces and auth reuse
```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [["html", { open: "never" }], ["junit", { outputFile: "results/junit.xml" }]],
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3000", trace: "on-first-retry", screenshot: "only-on-failure", video: "retain-on-failure" },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "chromium", use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/user.json" }, dependencies: ["setup"] },
    { name: "webkit", use: { ...devices["Desktop Safari"], storageState: "e2e/.auth/user.json" }, dependencies: ["setup"] },
    { name: "mobile", use: { ...devices["Pixel 7"], storageState: "e2e/.auth/user.json" }, dependencies: ["setup"] },
  ],
  webServer: { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI },
});
```
```ts
// e2e/auth.setup.ts
import { test as setup } from "@playwright/test";
setup("authenticate", async ({ request }) => {
  await request.post("/api/login", { data: { email: "ritesh@example.com", password: process.env.E2E_PASSWORD } });
  await request.storageState({ path: "e2e/.auth/user.json" });
});
```

### H3. Checkout E2E with network control and POM
```ts
test("user completes checkout", async ({ page }) => {
  await page.route("**/api/payments", (route) => route.fulfill({ json: { status: "succeeded", id: "pay_123" } }));
  const cart = new CartPage(page);
  await cart.goto(); await cart.addProduct("Mechanical Keyboard");
  await cart.checkout({ name: "Ritesh Kumar", card: "4242 4242 4242 4242" });
  await expect(page.getByRole("heading", { name: /thank you/i })).toBeVisible();
  await expect(page.getByText(/order #\d+/i)).toBeVisible();
});
```
Stub external payment calls; verify real payment integration separately in a sandbox contract/smoke test.

### H4. Supertest API integration tests with Testcontainers
```ts
describe("POST /orders", () => {
  it("creates an order and is idempotent by key", async () => {
    const body = { userId: "u1", items: [{ sku: "A1", qty: 2 }] };
    const a = await request(app).post("/orders").set("Idempotency-Key", "k-1").send(body).expect(201);
    const b = await request(app).post("/orders").set("Idempotency-Key", "k-1").send(body).expect(201);
    expect(b.body.id).toBe(a.body.id);
    const { rows } = await db.query("SELECT count(*) FROM orders WHERE user_id='u1'");
    expect(Number(rows[0].count)).toBe(1);
  });
  it("rejects invalid payloads", async () => {
    const res = await request(app).post("/orders").send({ items: [] }).expect(422);
    expect(res.body.errors).toContainEqual(expect.objectContaining({ field: "userId" }));
  });
});
```

### H5. k6 load test with scenarios and thresholds
```js
import http from "k6/http"; import { check, sleep } from "k6";
export const options = {
  scenarios: {
    browse:   { executor: "ramping-vus", stages: [{ duration: "2m", target: 200 }, { duration: "5m", target: 200 }], exec: "browse" },
    checkout: { executor: "constant-arrival-rate", rate: 20, timeUnit: "1s", duration: "5m", preAllocatedVUs: 50, exec: "checkout" },
  },
  thresholds: { "http_req_duration{scenario:browse}": ["p(95)<400"], "http_req_duration{scenario:checkout}": ["p(95)<900"], http_req_failed: ["rate<0.01"] },
};
export function browse() { check(http.get(`${__ENV.BASE}/products`), { ok: (r) => r.status === 200 }); sleep(1); }
export function checkout() { check(http.post(`${__ENV.BASE}/orders`, JSON.stringify({ sku: "A1" }), { headers: { "Content-Type": "application/json" } }), { created: (r) => r.status === 201 }); }
```

### H6. Pact consumer test and CI verification
```ts
provider.addInteraction({ states: [{ description: "user 42 exists" }], uponReceiving: "get user", withRequest: { method: "GET", path: "/users/42" },
  willRespondWith: { status: 200, body: { id: "42", name: like("Ritesh Kumar") } } });
```
```yaml
- run: npx pact-broker publish ./pacts --consumer-app-version ${{ github.sha }} --broker-base-url $PACT_BROKER
- run: npx pact-broker can-i-deploy --pacticipant web --version ${{ github.sha }} --to-environment production
```

### H7. Mutation testing with Stryker
```json
// stryker.config.json
{ "testRunner": "vitest", "mutate": ["src/pricing/**/*.ts", "!src/**/*.test.ts"], "thresholds": { "high": 85, "low": 70, "break": 60 }, "reporters": ["html", "clear-text"] }
```
`npx stryker run` → investigate surviving mutants (weak assertions or dead code); break the build below the threshold for critical modules.

### H8. GitHub Actions: test pipeline with sharding and artifacts
```yaml
name: ci
on: [pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm run lint && npm run typecheck && npm test -- --coverage
  e2e:
    runs-on: ubuntu-latest
    strategy: { fail-fast: false, matrix: { shard: [1, 2, 3, 4] } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: report-${{ matrix.shard }}, path: playwright-report }
```

### H9. Accessibility and visual regression checks
```ts
test("pricing page visual + a11y", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page).toHaveScreenshot("pricing.png", { fullPage: true, mask: [page.locator(".live-chat"), page.locator("time")], maxDiffPixelRatio: 0.01 });
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations).toEqual([]);
});
```

### H10. Test data factory with Faker
```ts
import { faker } from "@faker-js/faker";
export const buildUser = (over: Partial<User> = {}): User => ({
  id: faker.string.uuid(), name: faker.person.fullName(), email: faker.internet.email().toLowerCase(),
  createdAt: faker.date.past(), role: "user", ...over,
});
faker.seed(42);       // reproducible data in a given run
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Test passes locally but fails in CI
Environment differences (timezone, locale, CPU speed, screen size), missing env vars/secrets, different Node/browser versions, parallelism exposing shared state, headless vs headed behaviour, case-sensitive file systems. Reproduce with the same container image (`docker run`), enable traces/videos, pin versions, fix time zones (`TZ=UTC`).

### D2. `Unable to find element` / `element not clickable`
Element not rendered yet, hidden/covered by overlay, inside iframe/shadow DOM, locator wrong or changed, stale reference. Use auto-wait locators, assert visibility first, handle iframes (`frameLocator`), wait for network/animations to settle, inspect trace/DOM snapshot.

### D3. Intermittent timeouts in E2E
Slow environment, race with API responses, animations, heavy first load. Wait on specific responses/conditions rather than time, increase action timeout selectively, mock slow third parties, run fewer workers on small CI machines.

### D4. Jest "Cannot log after tests are done" / open handles
Unawaited promises, timers, servers/DB connections not closed. Await async operations, clear timers, close servers in `afterAll`, run `jest --detectOpenHandles`.

### D5. `act(...)` warnings in React tests
State updates occurring outside test awareness (async effects). Use `await screen.findBy...`, `waitFor`, `userEvent` (wrapped with act), flush promises; ensure mocked APIs resolve and components unmount cleanly.

### D6. Snapshot tests failing on every change
Snapshots too large/volatile (dates, IDs, class hashes). Freeze time, mock IDs, narrow snapshots to relevant parts, prefer explicit assertions, review snapshot diffs.

### D7. Mocks leaking between tests
Forgot to reset (`jest.resetAllMocks`, `restoreMocks: true`), module-level state, global overrides. Configure auto-reset in config, create fresh instances per test, avoid shared singletons.

### D8. Data collisions in parallel tests
Tests share the same user/records. Use unique IDs per test/worker (`test.info().workerIndex`), isolate DB schemas, or run each test in a rolled-back transaction/ephemeral container.

### D9. Visual regression noise
Font rendering differences, dynamic content, animations, different OS/GPU. Run in the same container/OS as baseline, disable animations, mask dynamic regions, freeze time, set deterministic viewports.

### D10. API tests pass but UI fails (or vice versa)
Contract mismatch, CORS/auth differences, caching, feature flags, environment config. Compare network logs between UI and API tests, validate OpenAPI/contract, test with the same auth path.

### D11. Performance test results inconsistent
Noisy shared environments, cold vs warm caches, test client bottlenecks, insufficient ramp-up, GC pauses, different data volumes. Isolate the environment, warm up, monitor the load generator, repeat runs, compare baselines.

### D12. Coverage drops unexpectedly
New untested code, excluded files misconfigured, source maps broken, tests not running (skipped `it.skip`/`only`). Check coverage config includes, CI test list, and use diff coverage on changed lines.

### D13. Selenium `StaleElementReferenceException`
DOM re-rendered after locating the element. Re-locate right before use, use explicit waits for stability, prefer frameworks with auto-retrying locators.

### D14. Tests slow down over time
Growing E2E suite, heavy setup per test, unneeded sleeps, large fixtures, serial execution. Profile durations, move coverage down the pyramid, parallelize/shard, reuse auth state, trim setup.

### D15. Bug can't be reproduced by dev
Missing environment details/data, timing issues, specific browser/device. Provide logs/HAR/trace/video, exact build and account data, steps with timestamps, request IDs; add observability hooks and try on the same environment.

---

# 🧩 Part 8: Tricky Questions

### T1. Can 100% code coverage guarantee no bugs?
No. Coverage only shows executed lines; tests may lack assertions or miss requirements, integration issues and edge cases.

### T2. Is more automation always better?
No. Poorly chosen automation is costly to maintain and gives false confidence. Automate stable, high-value checks; use exploratory testing for discovery.

### T3. Should E2E tests mock the backend?
Depends on intent. True E2E hits real services; many "UI integration" tests stub the network for speed and determinism. A balanced suite includes both: few real-stack journeys, many stubbed UI tests.

### T4. Is retrying failed tests acceptable?
As a temporary diagnostic or to reduce noise while fixing flakiness, yes (with tracking). As a permanent policy it hides defects and slows pipelines.

### T5. Does TDD mean writing all tests first?
No. It's an incremental loop: one small failing test, minimal code, refactor, repeat.

### T6. Unit test vs integration test: where is the line?
Unit tests isolate a unit from slow/out-of-process dependencies; integration tests exercise collaboration among real components (DB, HTTP, queues). Teams differ on in-process component tests; define conventions explicitly.

### T7. Are mocks bad?
Mocks are tools; overuse couples tests to implementation and hides integration bugs. Mock at boundaries, prefer fakes/real dependencies when cheap, and verify behaviour, not internals.

### T8. Why can a test suite give false confidence?
Weak assertions, mocks hiding integration errors, unrealistic data, coverage chasing, flaky tests ignored, outdated tests (pesticide paradox).

### T9. Severity high but priority low: example?
A crash in a rarely used legacy export feature used by one internal team; severe impact but low urgency.

### T10. Is exploratory testing unstructured?
It's structured by charters, time-boxes and heuristics; just not scripted. It complements automation.

### T11. Should testers write code?
Modern quality engineering expects automation and tooling skills (SDET), but exploratory/product/risk skills remain valuable; roles vary by organization.

### T12. Does passing tests mean the feature is correct?
Only relative to what the tests assert. Requirements ambiguity, missing cases and wrong oracles can all lead to passing tests on wrong behaviour.

### T13. Is testing in production irresponsible?
Not when done safely: feature flags, canaries, synthetic checks, observability and rollbacks. Pre-production testing alone can't replicate real traffic.

### T14. What's the difference between a test oracle and test data?
Oracle: the mechanism to decide if the outcome is correct (expected results, specs, invariants). Data: inputs used to run the test.

### T15. Why do tests become brittle?
Coupling to implementation details (CSS selectors, private methods), shared state, timing assumptions, excessive mocking, and dynamic content. Use behaviour-focused assertions and stable locators.

### T16. Can AI replace testers?
AI can accelerate test generation and maintenance, but judgement about risk, requirements, ethics and usability, and accountability for quality remain human responsibilities.

### T17. What is the difference between load and stress testing?
Load tests validate expected/peak load behaviour; stress tests push beyond limits to find breaking points and recovery behaviour.

### T18. Smoke vs sanity: is one a subset of the other?
Smoke is broad and shallow on a new build; sanity is narrow and deep on specific changes. Conceptually different, often both in a release flow.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Verification vs validation?** Built right vs built the right thing.
- **Severity vs priority?** Impact vs urgency.
- **Smoke test?** Quick critical-path check on a build.
- **Regression test?** Ensure old features still work.
- **Black-box?** Test without code knowledge.
- **BVA?** Test boundaries (min, max, ±1).
- **EP?** One test per equivalence class.
- **Pairwise?** Cover all parameter pairs.
- **AAA?** Arrange, Act, Assert.
- **TDD cycle?** Red, Green, Refactor.
- **BDD syntax?** Given-When-Then (Gherkin).
- **Test pyramid base?** Unit tests.
- **RTL query priority?** Role > Label > Text > TestId.
- **Mock vs stub?** Verify interactions vs canned answers.
- **Network mocking tool?** MSW / `page.route`.
- **E2E tools?** Playwright, Cypress, Selenium.
- **Mobile automation?** Appium, Detox, Espresso, XCUITest.
- **Load tools?** k6, JMeter, Gatling, Locust.
- **Contract testing?** Pact.
- **Mutation testing?** Stryker, PIT.
- **Property-based?** fast-check, Hypothesis.
- **Flaky fix?** Isolate, wait on conditions, mock externals.
- **Coverage caution?** Executed ≠ verified.
- **a11y automation?** axe-core.
- **Security scans?** SAST, DAST, SCA, ZAP.
- **Test data tool?** Faker, factories.
- **CI parallelism?** Sharding/workers.
- **Shift-left?** Test earlier.
- **Shift-right?** Test in production safely.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a testing strategy you implemented.
STAR: "For a React + Node SaaS I introduced a trophy-shaped strategy: TypeScript/ESLint, Vitest + RTL integration tests with MSW, Playwright for 12 critical journeys, Pact contracts between web and API, and k6 performance gates. PR feedback stayed under 9 minutes via sharding; escaped production defects dropped 55% and release frequency doubled."

### P2. Describe how you reduced flaky tests.
"Our E2E suite had a 14% flake rate. I added traces and flake dashboards, found root causes (shared test accounts, hard sleeps, third-party calls), introduced per-worker data isolation, replaced sleeps with condition waits, stubbed external services and quarantined repeat offenders. Flake rate fell below 1% and the team stopped re-running pipelines."

### P3. How do you decide what to automate?
"I score candidates by risk, frequency, stability and execution cost. Smoke/regression on critical journeys, API and contract checks, and data-driven validations get automated; exploratory, usability and rapidly changing UI stay manual until stable."

### P4. Tell me about a critical bug that escaped to production.
"A rounding bug in discounts affected a subset of orders. Root cause: boundary values untested and mocked pricing service. We added property-based tests for pricing rules, a contract test with the real calculation service, a canary check, and a postmortem action to include boundary analysis in story refinement."

### P5. How do you collaborate with developers?
"Three-amigos refinement, shared acceptance criteria, pairing on testability, code review of tests, fast CI feedback, and a shared quality dashboard. I frame defects as team learning, not blame."

### P6. How do you test with tight deadlines?
"Risk-based plan: smoke + targeted regression on changed areas and critical journeys, exploratory sessions on high-risk items, feature flags and canary rollout with monitoring, and explicit communication of residual risk."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** testing principles, verification/validation, QA vs QC, SDLC/STLC, test levels and types, static vs dynamic testing.
- **Test design:** equivalence partitioning, boundary value analysis, decision tables, state transition, pairwise, error guessing, exploratory testing, risk-based testing.
- **Artifacts and process:** test strategy, plan, scenarios, cases, RTM, bug reports, severity/priority, entry/exit criteria, metrics.
- **Unit and component testing:** Jest/Vitest, AAA, mocks/stubs/spies/fakes, snapshots, RTL, hooks, MSW.
- **API and integration testing:** Postman/Newman, Supertest, schema validation, Testcontainers, contract testing (Pact).
- **UI/E2E automation:** Playwright, Cypress, Selenium, locators, waiting, POM, fixtures, auth reuse, parallelization, visual regression.
- **Non-functional:** performance (k6/JMeter), security (SAST/DAST/SCA), accessibility (axe, WCAG), compatibility, localization, resilience/chaos.
- **Practices:** TDD, BDD, property-based and mutation testing, test data management, flaky test handling, CI/CD gates, shift-left/shift-right.
- **Leadership:** test strategy, quality culture, metrics, tooling governance, release readiness, hiring and team models.

## Mixed topics
- Testing + React/Next.js (`../02_Frontend/008_React.md`, `../02_Frontend/009_Nextjs.md`): RTL, MSW, Playwright component tests.
- Testing + Node/Express APIs (`../03_Backend/013_Express.md`): Supertest, integration with DB.
- Testing + microservices (`../03_Backend/039_Microservices.md`): contract tests, component tests, chaos.
- Testing + queues (`../03_Backend/038_Message-Queues.md`): idempotency, DLQ, async assertions.
- Testing + security (`../03_Backend/036_Authentication-and-Security.md`): authZ matrices, DAST in CI.
- Testing + DevOps (`../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`): pipelines, ephemeral environments, canary/synthetics.
- Testing + databases (`../04_Database/`): migrations, Testcontainers, data seeds.
- Testing + AI (`../11_Generative_AI/072_LLM-Evaluation-and-Guardrails.md`): evals, golden sets, red teaming.

---

# 🔬 Part 12: Testing Internals

### I1. How Jest/Vitest run tests
Test files are discovered, transformed (Babel/ts/esbuild/Vite), executed in isolated contexts (Jest uses `vm` contexts/worker processes; Vitest uses worker threads/processes), with `describe/it` registering tests, hooks run around them, results aggregated into reporters. Module mocking is implemented by intercepting the module registry (hoisted `jest.mock`/`vi.mock`).

### I2. How Playwright works
Playwright drives browsers over the DevTools Protocol (Chromium), custom protocols for Firefox/WebKit patched builds. Actions auto-wait for actionability (visible, stable, enabled, receives events). Browser contexts provide isolated sessions cheaply. Tracing records DOM snapshots, network and actions for post-mortem debugging.

### I3. How Selenium WebDriver works
Client library sends W3C WebDriver HTTP commands to a browser driver (ChromeDriver/GeckoDriver) which controls the browser. Grid routes sessions to nodes. Overhead from HTTP round trips makes it slower than in-process/CDP approaches.

### I4. Mocking mechanics
Function mocks replace implementations and record calls; module mocks swap exports in the module cache; network mocks intercept at the service worker (MSW browser), Node HTTP layer (MSW node/nock) or browser routing (Playwright `route`). Dependency injection avoids global patching.

### I5. Code coverage instrumentation
Source is instrumented (Istanbul/babel-plugin-istanbul) or measured via V8 coverage (`c8`), counting statements/branches/functions executed; reports (lcov, HTML) map hits to source lines via source maps.

### I6. Mutation testing internals
Parse code to AST, apply mutation operators (arithmetic, conditional, logical, return values), run the test subset covering each mutant, classify killed/survived/timeouts/no-coverage; compute mutation score; use incremental mode and coverage analysis to cut runtime.

### I7. Property-based testing shrinking
On failure, the framework reduces the failing input toward a minimal counterexample by shrinking structures (smaller arrays, simpler numbers) while the property still fails, producing readable repro cases and a seed to replay.

### I8. Load generation mechanics
Virtual users are lightweight JS/Go routines issuing requests with timers; open vs closed workload models: closed (fixed VUs wait for responses) vs open (constant arrival rate regardless of latency). Open models avoid coordinated omission and reveal queueing behaviour.

### I9. Coordinated omission
When the load generator waits for slow responses before sending the next request, it under-reports latency during stalls. Use arrival-rate executors and latency correction (HdrHistogram) to measure what users would experience.

---

# 📊 Part 13: Reference Tables

### Testing levels and ownership
| Level | Speed | Cost | Typical owner | Tools |
|---|---|---|---|---|
| Unit | ms | Low | Developers | Jest, Vitest, JUnit, PyTest |
| Component/integration | 10s ms–s | Medium | Devs/QA | RTL, Supertest, Testcontainers |
| Contract | s | Medium | Devs | Pact, schema registry |
| E2E | 10s of s | High | QA/SDET | Playwright, Cypress, Selenium |
| Manual/exploratory | Human time | High | QA | Charters, session notes |

### Test types cheat sheet
| Type | Question answered |
|---|---|
| Smoke | Is the build basically working? |
| Sanity | Did this specific fix/change work? |
| Regression | Did we break existing behaviour? |
| Integration | Do components work together? |
| System/E2E | Does the whole flow work? |
| UAT | Does it meet business needs? |
| Performance | How fast/scalable is it? |
| Security | Can it be abused? |
| Usability/a11y | Can people use it? |
| Compatibility | Does it work across platforms? |

### Test design techniques
| Technique | Best for |
|---|---|
| Equivalence partitioning | Input ranges/categories |
| Boundary value analysis | Edge conditions |
| Decision table | Business rules with combinations |
| State transition | Workflows and statuses |
| Pairwise | Many parameters/configurations |
| Error guessing | Experience-based edge cases |

### Tool selection guide
| Need | Options |
|---|---|
| JS unit | Vitest, Jest |
| React components | RTL (+ Vitest/Jest), Storybook tests |
| API | Supertest, Postman/Newman, Playwright request, RestAssured |
| Browser E2E | Playwright, Cypress, Selenium |
| Mobile | Appium, Detox, Maestro, Espresso, XCUITest |
| Performance | k6, JMeter, Gatling, Locust |
| Contract | Pact |
| Visual | Playwright screenshots, Chromatic, Percy |
| A11y | axe-core, Lighthouse |
| Mutation | Stryker, PIT |
| Test management | TestRail, Xray, Zephyr |

### Mock types
| Double | Verifies | Example |
|---|---|---|
| Stub | Nothing; returns canned data | `mockResolvedValue(user)` |
| Spy | Calls on real function | `jest.spyOn(obj, "fn")` |
| Mock | Expected interactions | `toHaveBeenCalledWith(...)` |
| Fake | Behaviour with simple implementation | In-memory repo |

### Version highlights (verify)
| Item | Notes |
|---|---|
| Vitest 2-3 | Browser mode, workspace/projects, improved snapshot/ESM handling |
| Playwright 1.4x+ | UI mode, trace viewer, component testing (experimental), sharding |
| Cypress 13/14 | Component testing GA, `cy.origin`, test replay (Cloud) |
| Selenium 4 | W3C WebDriver, relative locators, Selenium Manager |
| WCAG 2.2 | New success criteria (target size, focus appearance) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```js
expect([1, 2]).toBe([1, 2]);
```
**Result:** fails. `toBe` uses `Object.is` (reference equality); use `toEqual` for deep equality.

### O2.
```js
test("async", () => {
  fetchData().then((d) => expect(d).toBe(1));
});
```
**Result:** test passes before the promise resolves (no `return`/`await`), so failures may be missed or reported after the test ends.

### O3.
```js
jest.useFakeTimers();
setTimeout(cb, 5000);
jest.advanceTimersByTime(4999);
```
**Result:** `cb` has not been called; advance by 1 more ms triggers it.

### O4.
Boundary test for age 18-60 inclusive with inputs 17, 18, 60, 61.
**Expected:** 17 invalid, 18 valid, 60 valid, 61 invalid.

### O5.
```ts
await page.click("#submit");           // button appears after 2 s animation
```
**Result (Playwright):** auto-waits until the element is actionable (up to the timeout), so it clicks after it appears; Selenium without waits would throw `NoSuchElementException`.

### O6.
A test uses `Math.random()` to pick data and sometimes fails.
**Result:** flaky; seed or inject the RNG, or use deterministic factories.

### O7.
```js
const spy = jest.spyOn(console, "error");
render(<Comp />);
expect(spy).not.toHaveBeenCalled();
```
**Result:** catches React warnings (act, key props) as test failures; restore the spy afterward (`mockRestore`).

### O8.
Two Playwright tests both register user `test@example.com` and run in parallel.
**Result:** one fails with "email already exists" or data collision; use unique emails per test/worker.

### O9.
Coverage shows 100% lines, mutation score 55%.
**Result:** many surviving mutants → assertions are weak even though lines execute.

### O10.
```js
expect(fn).toHaveBeenCalledTimes(1);   // fn called twice due to React StrictMode
```
**Result:** assertion fails in dev StrictMode double-invocation scenarios; test the observable outcome or configure the environment appropriately.

### O11.
k6 threshold `http_req_duration: ["p(95)<500"]`; p95 measured = 620 ms.
**Result:** k6 exits non-zero and the CI job fails.

### O12.
`getByRole("button", { name: /save/i })` finds two buttons ("Save" and "Save as draft").
**Result:** throws "multiple elements" error; refine the name (`/^save$/i`) or scope within a container.

---

# ✅ Part 15: MCQs

**1. Which is a static testing technique?**
A) Unit test  B) Code review  C) Load test  D) Smoke test
**Answer: B**

**2. Testing a build quickly to see if it is stable enough for deeper testing is:**
A) Regression  B) Smoke testing  C) Stress testing  D) UAT
**Answer: B**

**3. Boundary value analysis for range 1-100 includes:**
A) 1 and 100 only  B) 0, 1, 2, 99, 100, 101  C) 50 only  D) Random values
**Answer: B**

**4. High severity, low priority example:**
A) Typo on landing page  B) Crash in rarely used admin feature  C) Payment failure  D) Slow homepage
**Answer: B**

**5. The test pyramid recommends the most tests at:**
A) E2E level  B) Unit level  C) Manual level  D) Performance level
**Answer: B**

**6. In RTL, the preferred query for a button is:**
A) `getByTestId`  B) `getByRole`  C) `container.querySelector`  D) `getByClassName`
**Answer: B**

**7. TDD cycle is:**
A) Green-Red-Refactor  B) Red-Green-Refactor  C) Refactor-Red-Green  D) Plan-Do-Check
**Answer: B**

**8. Which tool is used for consumer-driven contract testing?**
A) Pact  B) k6  C) Stryker  D) axe
**Answer: A**

**9. A test that sometimes passes and sometimes fails without code changes is:**
A) Robust  B) Flaky  C) Stable  D) Obsolete
**Answer: B**

**10. Mutation testing evaluates:**
A) Page load speed  B) Quality of test assertions  C) Accessibility  D) Browser support
**Answer: B**

**11. Which is NOT a performance test type?**
A) Load  B) Stress  C) Soak  D) Smoke-free
**Answer: D**

**12. Which technique tests many parameter combinations efficiently?**
A) Pairwise testing  B) Smoke testing  C) Alpha testing  D) Static analysis
**Answer: A**

**13. Re-running a failed test after a fix is called:**
A) Regression testing  B) Retesting (confirmation testing)  C) Smoke testing  D) Exploratory testing
**Answer: B**

**14. Playwright auto-waiting ensures:**
A) Tests never fail  B) Elements are actionable before interactions  C) No network use  D) Parallelism disabled
**Answer: B**

**15. Which stub library intercepts network in browser and Node using the same handlers?**
A) MSW  B) Faker  C) Allure  D) Stryker
**Answer: A**

**16. WCAG stands for:**
A) Web Content Accessibility Guidelines  B) Web Code API Guide  C) World Compliance and Governance  D) Wide Client App Group
**Answer: A**

**17. An oracle in testing is:**
A) A database  B) A mechanism to determine expected results  C) A CI server  D) A browser
**Answer: B**

**18. Coverage of 100% lines means:**
A) No bugs  B) All lines executed at least once by tests  C) All requirements tested  D) Perfect assertions
**Answer: B**

**19. Which environment strategy reduces test interference and cost over time?**
A) One shared staging for all  B) Ephemeral per-PR environments  C) Testing only in prod  D) Local only
**Answer: B**

**20. Shift-right testing refers to:**
A) Testing late in the cycle only  B) Testing/monitoring in production safely  C) Skipping tests  D) Manual testing
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Testing implementation details** instead of behaviour.
2. **Over-mocking**, hiding integration problems.
3. **Relying on E2E for everything** (ice-cream cone).
4. **Hard-coded sleeps** and brittle selectors.
5. **Shared mutable test data** and order-dependent tests.
6. **Ignoring flaky tests** or blanket retries.
7. **Chasing coverage numbers** without meaningful assertions.
8. **No negative/boundary tests.**
9. **Snapshot overuse** with unreviewed diffs.
10. **Skipping non-functional testing** (performance, security, accessibility).
11. **Testing against production-like data without anonymization.**
12. **Automating unstable features** too early.
13. **Poor bug reports** (no steps, environment or evidence).
14. **Late testing** (no shift-left, requirements not testable).
15. **No test ownership** or maintenance plan.
16. **Slow pipelines** developers bypass.
17. **Testing only the happy path** in async/distributed flows.
18. **Using real third-party services in CI.**
19. **Time/randomness dependence** in tests.
20. **Treating QA as a gate at the end** instead of a shared responsibility.
21. **Not testing migrations, rollbacks and deployments.**
22. **No production monitoring/synthetic checks** to complement pre-release tests.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You think in **risk and feedback speed**, choosing the right level (unit/integration/contract/E2E) for each check.
- You write **behaviour-focused, deterministic, isolated tests** and keep suites fast and trusted.
- You diagnose **flakiness** systematically and fix root causes instead of retrying.
- You use **test design techniques** (EP/BVA/decision tables/state models) and exploratory testing intelligently.
- You integrate testing into **CI/CD** with quality gates, sharding, reports and ephemeral environments.
- You cover **non-functional** quality: performance budgets, security scans, accessibility, resilience.
- You use **contract and mutation/property-based testing** where they add value.
- You communicate quality with **metrics and risk narratives**, not just bug counts.
- You build **quality culture**: shared ownership, testability in design, blameless learning from escapes.
- You stay pragmatic about tools and AI assistance, keeping humans accountable for oracles.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core concepts
```
Verification vs validation • QA vs QC • Smoke / sanity / regression / retest
Severity (impact) vs priority (urgency) • Entry/exit criteria • RTM
Pyramid: many unit → some integration/contract → few E2E • Trophy: static + integration heavy
EP + BVA + decision tables + state transition + pairwise • Exploratory with charters
```

### Automation rules
```
AAA / Given-When-Then • one behaviour per test • independent & deterministic tests
Mock boundaries only • prefer user-facing locators (role/label/text) • no sleeps
API-first test data • storageState auth reuse • traces/videos on failure
Parallel + shard • quarantine & fix flaky tests • coverage as a signal, mutation for quality
```

### Tool quick picks
Unit: Vitest/Jest • UI components: RTL + MSW • E2E: Playwright/Cypress • API: Supertest/Postman • Contract: Pact • Perf: k6 • A11y: axe • Visual: Playwright screenshots/Chromatic • Mutation: Stryker • Containers: Testcontainers • Mobile: Appium/Detox/Maestro.

### CI/CD pipeline checklist
Lint/typecheck → unit → integration/contract → build → deploy ephemeral env → E2E smoke → security & performance gates → progressive deploy → synthetic monitoring → rollback plan.

### Bug report template
```
Title: <Component> – <what happens> when <condition>
Environment: build, OS, browser/device, account
Steps: 1… 2… 3…
Expected: …  Actual: …
Severity/Priority: …  Frequency: always/intermittent
Evidence: screenshot/video/HAR/logs/trace id
```

### Interview strategy
1. Clarify product risk, architecture, team and release cadence.
2. Propose a layered strategy (levels, tools, environments, gates).
3. Show concrete examples (test cases with EP/BVA, an automation snippet).
4. Address flakiness, data, environments and speed.
5. Cover non-functional testing and production feedback.
6. Share metrics and a story about reducing escaped defects.

### Final checklist before the interview
- [ ] Explain testing principles, STLC, levels/types, smoke vs sanity vs regression.
- [ ] Apply EP, BVA, decision tables and state transitions to a sample feature.
- [ ] Write unit tests (AAA), use mocks/spies correctly, test async code.
- [ ] Use RTL queries properly; mock network with MSW.
- [ ] Build E2E tests with Playwright/Cypress using good locators and POM/fixtures.
- [ ] Test APIs (status, schema, auth, idempotency) and contracts (Pact).
- [ ] Explain performance, security and accessibility testing basics.
- [ ] Diagnose flaky tests and CI-only failures; design quality gates.
- [ ] Describe TDD/BDD, mutation/property-based testing and when to use them.
- [ ] Prepare a strategy story, a flaky-test story and an escaped-defect story with numbers.
