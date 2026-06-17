#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, '..');

// Files and folders to copy to the user's local project
const itemsToCopy = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'skills/staffos/SKILL.md', dest: 'skills/staffos/SKILL.md' },
  { src: 'commands', dest: 'commands' },
  { src: 'docs', dest: 'docs' }
];

const targetDir = process.cwd();

console.log('Installing StaffOS in:', targetDir);

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
} catch (error) {
  console.error('Error installing StaffOS:', error.message);
  process.exit(1);
}
