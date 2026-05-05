import { getSectionForLabels } from "./sections.js";

export function generateChangelog(entries, options) {
  const title = options.title ?? "Changelog";
  const sectionOrder = options.sectionOrder;
  const labelSections = options.labelSections;

  if (entries.length === 0) {
    return [`## ${title}`, "", "_No merged pull requests found._", ""].join(
      "\n"
    );
  }

  const groupedEntries = groupEntriesBySection(entries, {
    sectionOrder,
    labelSections
  });

  const lines = [`## ${title}`, ""];

  for (const section of sectionOrder) {
    const sectionEntries = groupedEntries.get(section);

    if (!sectionEntries || sectionEntries.length === 0) {
      continue;
    }

    lines.push(`### ${section}`);

    for (const entry of sectionEntries) {
      lines.push(`- ${formatEntry(entry)}`);
    }

    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function groupEntriesBySection(entries, options) {
  const groupedEntries = new Map();

  for (const entry of entries) {
    const section = getSectionForLabels(entry.labels, options);

    if (!groupedEntries.has(section)) {
      groupedEntries.set(section, []);
    }

    groupedEntries.get(section).push(entry);
  }

  return groupedEntries;
}

function formatEntry(entry) {
  const pullRequestReference = entry.url
    ? `[#${entry.number}](${entry.url})`
    : `#${entry.number}`;

  return `${entry.title} (${pullRequestReference}) by @${entry.author}`;
}