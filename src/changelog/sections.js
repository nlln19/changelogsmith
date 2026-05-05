export function getSectionForLabels(labels, options) {
  const normalizedLabels = labels.map((label) => label.toLowerCase());
  const sectionOrder = options.sectionOrder;
  const labelSections = options.labelSections;

  for (const section of sectionOrder) {
    const hasMatchingLabel = normalizedLabels.some(
      (label) => labelSections[label] === section
    );

    if (hasMatchingLabel) {
      return section;
    }
  }

  return "Other";
}