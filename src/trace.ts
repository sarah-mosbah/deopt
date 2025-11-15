/**
 * Advanced Tracing Script
 * 
 * Runs Node.js with various V8 flags to trace optimization and deoptimization.
 * Usage: npm run trace examples/optimization.js
 */

import { spawn } from 'child_process';
import * as path from 'path';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node dist/trace.js <example-file>');
  console.log('\nAvailable examples:');
  console.log('  - optimization.js');
  console.log('  - deoptimization.js');
  console.log('  - monomorphic.js');
  console.log('  - polymorphic.js');
  console.log('  - hidden-class.js');
  console.log('  - inline-cache.js');
  console.log('\nExample: node dist/trace.js optimization.js');
  process.exit(1);
}

const exampleFile = args[0];
const filePath = exampleFile.includes('/') || exampleFile.includes('\\')
  ? exampleFile
  : path.join(__dirname, 'examples', exampleFile);

console.log('═══════════════════════════════════════════════════════');
console.log('  V8 TurboFan Optimization Tracer');
console.log('═══════════════════════════════════════════════════════');
console.log(`Running: ${filePath}\n`);

const v8Flags: string[] = [
  '--trace-opt',              // Trace optimizations
  '--trace-deopt',            // Trace deoptimizations
  '--trace-opt-verbose',      // Verbose optimization info
  '--trace-ic',               // Trace inline cache state changes
  '--allow-natives-syntax',   // Allow V8 intrinsics like %OptimizeFunctionOnNextCall
];

const nodeProcess = spawn('node', [...v8Flags, filePath], {
  stdio: 'inherit',
  shell: true
});

nodeProcess.on('error', (error: Error) => {
  console.error('Error running example:', error);
  process.exit(1);
});

nodeProcess.on('close', (code: number | null) => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Trace Complete');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\nLook for these key messages:');
  console.log('  [marking ... for optimized recompilation]');
  console.log('  [compiling method ... using TurboFan]');
  console.log('  [optimizing ...]');
  console.log('  [deoptimizing ...]');
  console.log('  [bailout ...]');
  console.log('\nIC States:');
  console.log('  [LoadIC] - Property load inline cache');
  console.log('  [StoreIC] - Property store inline cache');
  console.log('  [CallIC] - Function call inline cache');
  console.log('  0->1, 1->P, P->N, etc. - IC state transitions');
  process.exit(code ?? 0);
});
