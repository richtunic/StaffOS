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

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m'
};

const itemsToCopy = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'skills/staffos/SKILL.md', dest: 'skills/staffos/SKILL.md' },
  { src: 'skills/staffos/SKILL.md', dest: '.opencode/skills/staffos/SKILL.md' },
  { src: 'commands', dest: 'commands' },
  { src: 'commands', dest: '.opencode/commands' },
  { src: 'docs', dest: 'docs' }
];

const targetDir = process.cwd();

// Helper to recursively copy directories/files
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

// Asynchronous update checker
async function checkForUpdates() {
  try {
    const res = await fetch('https://registry.npmjs.org/staffos/latest', {
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.version && data.version !== currentVersion) {
        console.log('\n==================================================');
        console.log(`📢  A new version of StaffOS is available: ${colors.bold}${data.version}${colors.reset} (current: ${currentVersion})`);
        console.log(`👉  Run '${colors.cyan}npx staffos@latest${colors.reset}' to update.`);
        console.log('==================================================\n');
      }
    }
  } catch (error) {
    // Fail silently so it doesn't break offline use
  }
}

// Recurse directories to find text files
function getFilesRecursive(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (e) {
      continue;
    }
    
    if (stat.isDirectory()) {
      // Exclude build/vcs/deps folders
      if (
        file === 'node_modules' ||
        file === '.git' ||
        file === '.next' ||
        file === 'dist' ||
        file === 'build' ||
        file === '.opencode' ||
        file === 'out' ||
        file === 'coverage' ||
        file === '.gemini'
      ) {
        continue;
      }
      getFilesRecursive(filePath, fileList);
    } else {
      // Exclude binaries, images, locks
      const ext = path.extname(file).toLowerCase();
      const ignoredExtensions = [
        '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.mp3', '.pdf', '.zip', '.tar', '.gz',
        '.lock', '.package-lock.json', '.pnpm-lock.yaml', '.yarn.lock', '.woff', '.woff2', '.ttf', '.eot'
      ];
      if (ignoredExtensions.includes(ext) || file.startsWith('.')) {
        continue;
      }
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Model Pricing Registry (2026 Standard Rates per 1M tokens)
const modelsPricing = {
  'claude-sonnet': { name: 'Claude 4.8 Sonnet', input: 3.00, output: 15.00 },
  'claude-opus': { name: 'Claude 4.8 Opus', input: 15.00, output: 75.00 },
  'gemini-pro': { name: 'Gemini 3.1 Pro', input: 2.00, output: 12.00 },
  'gemini-flash': { name: 'Gemini 3.5 Flash', input: 0.075, output: 0.30 },
  'gpt-5.5': { name: 'GPT 5.5', input: 5.00, output: 30.00 },
  'local': { name: 'Modelos Locales (Ollama/DeepSeek)', input: 0.00, output: 0.00 }
};

function getModelFromArgs() {
  const modelArg = process.argv.find(arg => arg.startsWith('--model='));
  if (modelArg) {
    return modelArg.split('=')[1].toLowerCase();
  }
  const modelIndex = process.argv.indexOf('-m');
  if (modelIndex !== -1 && process.argv[modelIndex + 1]) {
    return process.argv[modelIndex + 1].toLowerCase();
  }
  return 'claude-sonnet'; // default
}

// Estimate token savings for the current workspace
function runEstimator() {
  const modelKey = getModelFromArgs();
  const pricing = modelsPricing[modelKey] || modelsPricing['claude-sonnet'];

  console.log(`${colors.cyan}${colors.bold}=== StaffOS Token & Cost Estimator ===${colors.reset}\n`);
  console.log(`Scanning workspace at: ${colors.gray}${targetDir}${colors.reset}`);
  console.log(`Target AI Model: ${colors.yellow}${colors.bold}${pricing.name}${colors.reset} (Input: $${pricing.input}/1M, Output: $${pricing.output}/1M)`);
  
  const files = getFilesRecursive(targetDir);
  let totalCharacters = 0;
  let textFilesCount = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      totalCharacters += content.length;
      textFilesCount++;
    } catch (e) {
      // Skip binary or unreadable files
    }
  }

  // Token math modeling
  // 1 token approx 3.8 characters in code
  const codebaseTokens = Math.round(totalCharacters / 3.8);

  // Scenario A: Traditional Agent (Unconstrained)
  const tradInputTokens = codebaseTokens * 4;
  const tradOutputTokens = 1500 * 4;
  
  const tradInputCost = (tradInputTokens / 1_000_000) * pricing.input;
  const tradOutputCost = (tradOutputTokens / 1_000_000) * pricing.output;
  const tradTotalCost = tradInputCost + tradOutputCost;

  // Scenario B: StaffOS Agent
  let staffOsContextLength = 0;
  const docsToCheck = [
    path.join(targetDir, 'AGENTS.md'),
    path.join(targetDir, 'skills/staffos/SKILL.md'),
    path.join(targetDir, 'docs/AI_CONTEXT.md'),
    path.join(targetDir, 'docs/HANDOFF.md')
  ];
  
  let foundDocs = false;
  for (const doc of docsToCheck) {
    if (fs.existsSync(doc)) {
      try {
        staffOsContextLength += fs.readFileSync(doc, 'utf8').length;
        foundDocs = true;
      } catch (e) {}
    }
  }
  
  const staffOsInputTokens = foundDocs 
    ? Math.round(staffOsContextLength / 3.8) 
    : 1500; // default baseline

  const staffOsOutputTokens = 100;

  const staffOsInputCost = (staffOsInputTokens / 1_000_000) * pricing.input;
  const staffOsOutputCost = (staffOsOutputTokens / 1_000_000) * pricing.output;
  const staffOsTotalCost = staffOsInputCost + staffOsOutputCost;

  // Savings
  const savingsPercent = tradTotalCost > 0 
    ? Math.min(99.9, Math.max(0, ((tradTotalCost - staffOsTotalCost) / tradTotalCost) * 100))
    : 0;

  // Render Table
  console.log(`\nFound ${colors.bold}${textFilesCount}${colors.reset} readable files in codebase (${colors.bold}${Math.round(totalCharacters / 1024)} KB${colors.reset}).`);
  console.log('--------------------------------------------------------------------------------');
  console.log(`${colors.bold}${'Métrica / Escenario'.padEnd(28)} | ${'Agente Tradicional'.padEnd(20)} | ${'Con StaffOS'.padEnd(14)} | ${'Ahorro (%)'.padEnd(10)}${colors.reset}`);
  console.log('--------------------------------------------------------------------------------');
  
  console.log(`${'Tokens de Entrada (Lectura)'.padEnd(28)} | ${tradInputTokens.toLocaleString().padEnd(20)} | ${staffOsInputTokens.toLocaleString().padEnd(14)} | ${colors.green}${savingsPercent.toFixed(1)}%${colors.reset}`);
  console.log(`${'Tokens de Salida (Escritura)'.padEnd(28)} | ${tradOutputTokens.toLocaleString().padEnd(20)} | ${staffOsOutputTokens.toLocaleString().padEnd(14)} | ${colors.green}${(((tradOutputTokens - staffOsOutputTokens)/tradOutputTokens)*100).toFixed(1)}%${colors.reset}`);
  console.log(`${'Costo Estimado de Entrada'.padEnd(28)} | $${tradInputCost.toFixed(4).padEnd(19)} | $${staffOsInputCost.toFixed(4).padEnd(13)} | ${colors.green}${savingsPercent.toFixed(1)}%${colors.reset}`);
  console.log(`${'Costo Estimado de Salida'.padEnd(28)} | $${tradOutputCost.toFixed(4).padEnd(19)} | $${staffOsOutputCost.toFixed(4).padEnd(13)} | ${colors.green}${(((tradOutputCost - staffOsOutputCost)/tradOutputCost)*100).toFixed(1)}%${colors.reset}`);
  
  console.log('--------------------------------------------------------------------------------');
  console.log(`${colors.bold}${'COSTO TOTAL ESTIMADO / TAREA'.padEnd(28)} | $${tradTotalCost.toFixed(4).padEnd(19)} | $${staffOsTotalCost.toFixed(4).padEnd(13)} | ${colors.green}${savingsPercent.toFixed(1)}%${colors.reset}`);
  console.log('--------------------------------------------------------------------------------');
  
  if (pricing.input === 0) {
    console.log(`\n${colors.green}${colors.bold}🎉  Ahorro Estimado: ~${savingsPercent.toFixed(0)}% en tokens por tarea (ejecución local gratuita).${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}${colors.bold}🎉  Ahorro Estimado: ~${savingsPercent.toFixed(0)}% en costos de API por tarea.${colors.reset}\n`);
  }
}

// Help command
function runHelp() {
  console.log(`\n${colors.cyan}${colors.bold}StaffOS CLI v${currentVersion}${colors.reset}`);
  console.log('Uso:');
  console.log(`  ${colors.bold}npx staffos${colors.reset}           - Instala e inicializa StaffOS en el proyecto actual.`);
  console.log(`  ${colors.bold}npx staffos estimate${colors.reset}  - Escanea el proyecto y calcula los ahorros usando el modelo predeterminado.`);
  console.log(`  ${colors.bold}npx staffos estimate --model=<tipo>${colors.reset} - Estima usando un modelo de IA específico.`);
  console.log(`  ${colors.bold}npx staffos help${colors.reset}      - Muestra este menú de ayuda.`);
  console.log('\nModelos de IA soportados para estimación (`--model=`):');
  Object.keys(modelsPricing).forEach(key => {
    console.log(`  - ${colors.yellow}${key.padEnd(15)}${colors.reset} : ${modelsPricing[key].name}`);
  });
  console.log();
}

async function runInstaller() {
  console.log(`Installing StaffOS v${currentVersion} in:`, targetDir);
  try {
    for (const item of itemsToCopy) {
      const srcPath = path.join(packageRoot, item.src);
      const destPath = path.join(targetDir, item.dest);
      if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath);
      }
    }
    console.log(`\n${colors.green}${colors.bold}StaffOS instalado con éxito! 🎉${colors.reset}`);
    console.log(`Dile a tu Agente de IA que lea ${colors.bold}AGENTS.md${colors.reset} para comenzar.`);
    console.log(`\n👉  Puedes calcular el ahorro de tokens de este proyecto ejecutando: ${colors.cyan}npx staffos estimate${colors.reset}`);
    
    await checkForUpdates();
  } catch (error) {
    console.error('Error installing StaffOS:', error.message);
    process.exit(1);
  }
}

// Main router
const args = process.argv.slice(2);
const command = args[0];

if (command === 'estimate' || command === 'stats' || command === 'calc') {
  runEstimator();
} else if (command === 'help' || command === '--help' || command === '-h') {
  runHelp();
} else {
  runInstaller();
}
