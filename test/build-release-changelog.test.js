import assert from "node:assert/strict";
import test from "node:test";

import { buildReleaseChangelog } from "../src/changelog/build-release-changelog.js";

const options = {
  title: "Release Changelog since v0.1.0",
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
    enhancement: "Features",
    bug: "Fixes",
    fix: "Fixes",
    docs: "Documentation",
    documentation: "Documentation"
  }
};

test("builds a release changelog from merged pull requests", () => {
  const changelog = buildReleaseChangelog(
    [
      {
        title: "Add dark mode",
        number: 12,
        html_url: "https://github.com/nlln19/changelogsmith/pull/12",
        user: {
          login: "nlln19"
        },
        merged_at: "2026-05-05T19:00:00Z",
        labels: [
          {
            name: "feature"
          }
        ]
      },
      {
        title: "Fix release parser",
        number: 13,
        html_url: "https://github.com/nlln19/changelogsmith/pull/13",
        user: {
          login: "nlln19"
        },
        merged_at: "2026-05-05T20:00:00Z",
        labels: [
          {
            name: "bug"
          }
        ]
      }
    ],
    options
  );

  assert.match(changelog, /## Release Changelog since v0.1.0/);
  assert.match(changelog, /### Features/);
  assert.match(changelog, /Add dark mode/);
  assert.match(changelog, /### Fixes/);
  assert.match(changelog, /Fix release parser/);
});