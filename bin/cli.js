#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, '..');

// Get current version from package.json
const packageJsonPath = path.join(packageRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = pkg.version;

// Files and folders to copy to the user's local project
const itemsToCopy = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'skills/staffos/SKILL.md', dest: 'skills/staffos/SKILL.md' },
  { src: 'skills/staffos/SKILL.md', dest: '.opencode/skills/staffos/SKILL.md' },
  { src: 'commands', dest: 'commands' },
  { src: 'commands', dest: '.opencode/commands' },
  { src: 'docs', dest: 'docs' }
];

const targetDir = process.cwd();

console.log(`Installing StaffOS v${currentVersion} in:`, targetDir);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`- Created ${path.relative(targetDir, dest)}`);
  }
}

async function checkForUpdates() {
  try {
    const res = await fetch('https://registry.npmjs.org/staffos/latest', {
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.version && data.version !== currentVersion) {
        console.log('\n==================================================');
        console.log(`📢  A new version of StaffOS is available: ${data.version} (current: ${currentVersion})`);
        console.log("👉  Run 'npx staffos@latest' to update.");
        console.log('==================================================\n');
      }
    }
  } catch (error) {
    // Fail silently so it doesn't break the offline/slow network installations
  }
}

async function main() {
  try {
    for (const item of itemsToCopy) {
      const srcPath = path.join(packageRoot, item.src);
      const destPath = path.join(targetDir, item.dest);
      if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath);
      }
    }
    console.log('\nStaffOS installed successfully! 🎉');
    console.log('Ask your AI Agent to read AGENTS.md to begin.');
    
    await checkForUpdates();
  } catch (error) {
    console.error('Error installing StaffOS:', error.message);
    process.exit(1);
  }
}

main();
