import assert from "node:assert/strict";
import test from "node:test";

import { generateChangelog } from "../src/changelog/generate-changelog.js";

const options = {
  title: "Changelog Preview",
  sectionOrder: [
    "Breaking Changes",
    "Features",
    "Fixes",
    "Documentation",
    "Maintenance",
    "Other"
  ],
  labelSections: {
    feature: "Features",
    bug: "Fixes",
    docs: "Documentation"
  }
};

test("groups pull requests by label section", () => {
  const changelog = generateChangelog(
    [
      {
        title: "Add dark mode",
        number: 12,
        url: "https://github.com/nlln19/changelogsmith/pull/12",
        author: "nlln19",
        labels: ["feature"]
      },
      {
        title: "Fix login crash",
        number: 13,
        url: "https://github.com/nlln19/changelogsmith/pull/13",
        author: "nlln19",
        labels: ["bug"]
      }
    ],
    options
  );

  assert.match(changelog, /### Features/);
  assert.match(changelog, /Add dark mode/);
  assert.match(changelog, /### Fixes/);
  assert.match(changelog, /Fix login crash/);
});