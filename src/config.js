export const DEFAULT_CONFIG = {
  commentOnMergedPullRequest: false,
  changelogTitle: "Changelog Preview",
  sectionOrder: [
    "Breaking Changes",
    "Features",
    "Fixes",
    "Documentation",
    "Maintenance",
    "Other"
  ],
  labelSections: {
    breaking: "Breaking Changes",
    "breaking-change": "Breaking Changes",

    feature: "Features",
    enhancement: "Features",

    bug: "Fixes",
    fix: "Fixes",

    docs: "Documentation",
    documentation: "Documentation",

    chore: "Maintenance",
    maintenance: "Maintenance",
    refactor: "Maintenance",
    dependencies: "Maintenance",
    deps: "Maintenance"
  }
};

export async function loadConfig(context) {
  try {
    const repoConfig = await context.config("changelogsmith.yml", {});

    return {
      ...DEFAULT_CONFIG,
      ...repoConfig,
      sectionOrder: repoConfig.sectionOrder ?? DEFAULT_CONFIG.sectionOrder,
      labelSections: {
        ...DEFAULT_CONFIG.labelSections,
        ...(repoConfig.labelSections ?? {})
      }
    };
  } catch (error) {
    context.log.warn(
      {
        status: error.status,
        message: error.message,
        requestUrl: error.request?.url
      },
      "Could not load ChangelogSmith config. Falling back to default config."
    );

    return DEFAULT_CONFIG;
  }
}
