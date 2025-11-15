/**
 * Advanced Optimization Testing with V8 Intrinsics
 * 
 * This example uses V8's native syntax to explicitly control optimization.
 * Run with: npm run advanced
 * 
 * Note: V8 intrinsics use % syntax which TypeScript doesn't support.
 * We use @ts-ignore to bypass type checking. These work at runtime with --allow-natives-syntax
 */

console.log('=== Advanced V8 Intrinsics Demo ===\n');

// Example 1: Manual optimization control
console.log('1. Manual Optimization Control');

function heavyCalculation(n: number): number {
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// Check optimization status
// @ts-ignore - V8 intrinsic
console.log('Initial status:', %GetOptimizationStatus(heavyCalculation));

// Warm up
for (let i = 0; i < 1000; i++) {
  heavyCalculation(100);
}

// Check if optimized
// @ts-ignore - V8 intrinsic
console.log('After warm-up:', %GetOptimizationStatus(heavyCalculation));

// Force optimization
// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(heavyCalculation);
heavyCalculation(100);

// @ts-ignore - V8 intrinsic
console.log('After forced optimization:', %GetOptimizationStatus(heavyCalculation));
console.log('Result:', heavyCalculation(1000));
console.log();

// Example 2: Testing deoptimization
console.log('2. Forced Deoptimization');

function flexibleAdd(a: number, b: number): number {
  return a + b;
}

// Optimize for numbers
// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(flexibleAdd);
for (let i = 0; i < 1000; i++) {
  flexibleAdd(i, i + 1);
}
// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(flexibleAdd);
flexibleAdd(5, 10);

// @ts-ignore - V8 intrinsic
console.log('Status (optimized for numbers):', %GetOptimizationStatus(flexibleAdd));

// Force deoptimization by changing types (bypass TypeScript)
const anyAdd = flexibleAdd as any;
anyAdd('hello', 'world');
// @ts-ignore - V8 intrinsic
console.log('Status (after type change):', %GetOptimizationStatus(flexibleAdd));
console.log();

// Example 3: Never optimize
console.log('3. Prevent Optimization');

function neverOptimize(x: number): number {
  return x * 2;
}

// @ts-ignore - V8 intrinsic
%NeverOptimizeFunction(neverOptimize);

for (let i = 0; i < 100000; i++) {
  neverOptimize(i);
}

// @ts-ignore - V8 intrinsic
console.log('Status (marked never optimize):', %GetOptimizationStatus(neverOptimize));
console.log();

// Example 4: Check if function is optimized
console.log('4. Optimization Status Checks');

function testFunction(a: number, b: number, c: number): number {
  return a + b + c;
}

// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(testFunction);

// @ts-ignore - V8 intrinsic
console.log('Before optimization:', %GetOptimizationStatus(testFunction));
// @ts-ignore - V8 intrinsic
console.log('Is optimized?', %GetOptimizationStatus(testFunction) & (1 << 0) ? 'Yes' : 'No');
// @ts-ignore - V8 intrinsic
console.log('Is turbofanned?', %GetOptimizationStatus(testFunction) & (1 << 4) ? 'Yes' : 'No');

for (let i = 0; i < 1000; i++) {
  testFunction(i, i + 1, i + 2);
}

// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(testFunction);
testFunction(1, 2, 3);

// @ts-ignore - V8 intrinsic
console.log('\nAfter optimization:', %GetOptimizationStatus(testFunction));
// @ts-ignore - V8 intrinsic
console.log('Is optimized?', %GetOptimizationStatus(testFunction) & (1 << 0) ? 'Yes' : 'No');
// @ts-ignore - V8 intrinsic
console.log('Is turbofanned?', %GetOptimizationStatus(testFunction) & (1 << 4) ? 'Yes' : 'No');
console.log();

// Example 5: Debug optimization with classes
console.log('5. TypeScript Class Optimization');

class Calculator {
  constructor(private multiplier: number) {}
  
  calculate(x: number, y: number, z: number): number {
    return (x * y + z) * this.multiplier;
  }
}

const calc = new Calculator(2);

// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(calc.calculate.bind(calc));

for (let i = 0; i < 1000; i++) {
  calc.calculate(i, i + 1, i + 2);
}

console.log('Calculator method optimizable with consistent usage');
console.log();

// Example 6: Generic function optimization
console.log('6. Generic Function Optimization');

function processItems<T>(items: T[], callback: (item: T) => number): number {
  let sum = 0;
  for (const item of items) {
    sum += callback(item);
  }
  return sum;
}

// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(processItems);

const numbers: number[] = Array.from({ length: 1000 }, (_, i) => i);
const squareCallback = (x: number): number => x * x;

// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(squareCallback);

for (let i = 0; i < 100; i++) {
  processItems(numbers, squareCallback);
}

// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(processItems);
// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(squareCallback);

const result = processItems(numbers, squareCallback);
console.log('Generic function result:', result);
console.log('✓ Generics can be optimized when used with consistent types\n');

// Example 7: Deoptimize on next call
console.log('7. Force Deoptimization');

function willDeopt(n: number): number {
  return n * n;
}

// @ts-ignore - V8 intrinsic
%PrepareFunctionForOptimization(willDeopt);
for (let i = 0; i < 1000; i++) {
  willDeopt(i);
}

// @ts-ignore - V8 intrinsic
%OptimizeFunctionOnNextCall(willDeopt);
willDeopt(5);

// @ts-ignore - V8 intrinsic
console.log('Before deopt:', %GetOptimizationStatus(willDeopt));

// @ts-ignore - V8 intrinsic
%DeoptimizeFunction(willDeopt);

// @ts-ignore - V8 intrinsic
console.log('After deopt:', %GetOptimizationStatus(willDeopt));
console.log();

console.log('=== Optimization Status Flags ===');
console.log('Bit 0: Is function optimized');
console.log('Bit 1: Is function marked for optimization');
console.log('Bit 2: Is function marked for concurrent optimization');
console.log('Bit 3: Is function being optimized');
console.log('Bit 4: Is function optimized by TurboFan');
console.log('Bit 5: Is function interpreted');
console.log('\n=== TypeScript & V8 Intrinsics ===');
console.log('• TypeScript types are erased at runtime');
console.log('• V8 intrinsics work on transpiled JavaScript');
console.log('• Use @ts-ignore to suppress TypeScript errors for % syntax');
console.log('• Optimization depends on runtime behavior, not types');

