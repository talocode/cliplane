#!/usr/bin/env node
/**
 * ClipLoop Motion Spec CLI
 *
 * Usage:
 *   npx tsx scripts/motion.ts validate <spec.json>
 *   npx tsx scripts/motion.ts plan <spec.json>
 *   npx tsx scripts/motion.ts render <spec.json>
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateMotionSpec, printValidationResult } from '../src/core/motion/validator.js';
import { createScenePlan, printScenePlan } from '../src/core/motion/renderer.js';

const args = process.argv.slice(2);
const command = args[0];
const specPath = args[1];

function printUsage(): void {
  console.log(`
  ClipLoop Motion Spec CLI

  Commands:
    validate <spec.json>   Validate a motion spec
    plan <spec.json>       Print the scene plan
    render <spec.json>     Attempt rendering (scaffolded)

  Examples:
    npx tsx scripts/motion.ts validate examples/motion/codra-code-launch.motion.json
    npx tsx scripts/motion.ts plan examples/motion/codra-code-launch.motion.json
  `);
}

if (!command || !specPath) {
  printUsage();
  process.exit(0);
}

const resolvedPath = path.resolve(specPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`\x1b[31m  File not found: ${resolvedPath}\x1b[0m`);
  process.exit(1);
}

let spec: unknown;
try {
  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  spec = JSON.parse(raw);
} catch (e) {
  console.error(`\x1b[31m  Failed to parse JSON: ${e instanceof Error ? e.message : 'unknown error'}\x1b[0m`);
  process.exit(1);
}

switch (command) {
  case 'validate': {
    const result = validateMotionSpec(spec);
    printValidationResult(result);
    process.exit(result.valid ? 0 : 1);
  }

  case 'plan': {
    const result = validateMotionSpec(spec);
    if (!result.valid) {
      printValidationResult(result);
      process.exit(1);
    }
    const plan = createScenePlan(spec as any);
    printScenePlan(plan);
    break;
  }

  case 'render': {
    const result = validateMotionSpec(spec);
    if (!result.valid) {
      printValidationResult(result);
      process.exit(1);
    }
    const plan = createScenePlan(spec as any);
    printScenePlan(plan);
    console.log('\n  \x1b[33mMotion rendering is scaffolded but not fully implemented yet.\x1b[0m');
    console.log('  The spec validates successfully and the scene plan is ready.');
    console.log('  Implement a renderer (Remotion, HTML Video, or Cloud) to produce output.\n');
    break;
  }

  default:
    console.error(`\x1b[31m  Unknown command: ${command}\x1b[0m`);
    printUsage();
    process.exit(1);
}
