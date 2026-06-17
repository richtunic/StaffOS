import fs from "node:fs";

const requiredFiles = [
  "AGENTS.md",
  "skills/staffos/SKILL.md",
  "commands/staffos-review.md",
  "commands/staffos-audit.md",
  "commands/staffos-security.md",
  "commands/staffos-handoff.md",
  "commands/staffos-help.md",
  "docs/AI_CONTEXT.md",
  "docs/PROJECT_OVERVIEW.md",
  "docs/ARCHITECTURE.md",
  "docs/DECISIONS.md",
  "docs/CHANGELOG_AI.md",
  "docs/TODO.md",
  "docs/HANDOFF.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const skill = fs.readFileSync("skills/staffos/SKILL.md", "utf8");

const requiredPhrases = [
  "Security Gate",
  "Anti AI Code Slop",
  "Progressive Implementation Protocol",
  "Project Memory Layer",
  "Context7",
  "Challenge Assumptions"
];

for (const phrase of requiredPhrases) {
  if (!skill.includes(phrase)) {
    console.error(`Missing required phrase in SKILL.md: ${phrase}`);
    process.exit(1);
  }
}

console.log("StaffOS rules are complete.");
