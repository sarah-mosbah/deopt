/**
 * OPTIMIZATION EXAMPLES
 * 
 * Demonstrates TurboFan optimization principles with ACCURATE benchmarking.
 * Run with: npm run opt
 * 
 * Key principles for accurate benchmarking:
 * 1. Large iteration counts (millions, not thousands)
 * 2. Warm-up phase before measurement
 * 3. Measure only the operation, not setup
 * 4. Use separate functions to prevent cross-optimization
 */

export {};

console.log('=== TurboFan Optimization Examples ===\n');

// =============================================================================
// Example 1: Monomorphic function (easily optimized)
// =============================================================================
console.log('1. Monomorphic Function (Optimized)');

function addNumbersMonomorphic(x: number, y: number): number {
  return x + y;
}

// Warm-up: Let TurboFan optimize this function
let warmup1 = 0;
for (let i = 0; i < 1000000; i++) {
  warmup1 += addNumbersMonomorphic(i, i + 1);
}

// Actual measurement
console.time('Monomorphic (numbers only)');
let sum1 = 0;
for (let i = 0; i < 10000000; i++) {
  sum1 += addNumbersMonomorphic(i, i + 1);
}
console.timeEnd('Monomorphic (numbers only)');
console.log(`Result: ${sum1}`);
console.log('✓ Function is optimized - always receives numbers\n');

// =============================================================================
// Example 2: Polymorphic function (slower)
// =============================================================================
console.log('2. Polymorphic Function (Deoptimized)');

function addPolymorphic(x: any, y: any): any {
  return x + y;
}

// Warm-up with MIXED types - prevents optimization
for (let i = 0; i < 1000000; i++) {
  const _warmup2 = i % 3 === 0
    ? addPolymorphic(i, i + 1)
    : i % 3 === 1
    ? addPolymorphic('a', 'b')
    : addPolymorphic(i.toString(), 'x');
  if (_warmup2 === -1) console.log(_warmup2); // Prevent optimization
}

// Measurement with mixed types
console.time('Polymorphic (mixed types)');
let sum2: any = 0;
for (let i = 0; i < 10000000; i++) {
  if (i % 3 === 0) {
    sum2 = addPolymorphic(i, i + 1);
  } else if (i % 3 === 1) {
    sum2 = addPolymorphic('a', 'b');
  } else {
    sum2 = addPolymorphic(i.toString(), 'x');
  }
}
console.timeEnd('Polymorphic (mixed types)');
console.log(`Result: ${sum2}`);
console.log('✗ Function cannot be optimized - receives different types\n');

// =============================================================================
// Example 3: Array operations with stable shapes
// =============================================================================
console.log('3. Array Operations (Optimized)');

function sumArray(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Pre-create array
const numbers: number[] = new Array(10000).fill(0).map((_, i) => i);

// Warm-up
let warmup3 = 0;
for (let i = 0; i < 1000; i++) {
  warmup3 += sumArray(numbers);
}

// Measurement
console.time('Array sum');
let sum3 = 0;
for (let i = 0; i < 10000; i++) {
  sum3 += sumArray(numbers);
}
console.timeEnd('Array sum');
console.log(`Result: ${sum3}`);
console.log('✓ Optimized - consistent array structure and types\n');

// =============================================================================
// Example 4: Object with stable hidden class
// =============================================================================
console.log('4. Stable Hidden Class (Optimized)');

class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
  
  distance(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

function calculateDistance(point: Point): number {
  return point.distance();
}

// Pre-create points
const points: Point[] = [];
for (let i = 0; i < 10000; i++) {
  points.push(new Point(i, i + 1));
}

// Warm-up
let warmup4 = 0;
for (let i = 0; i < 100000; i++) {
  warmup4 += calculateDistance(points[i % points.length]);
}

// Measurement
console.time('Object method calls');
let sum4 = 0;
for (let i = 0; i < 1000000; i++) {
  sum4 += calculateDistance(points[i % points.length]);
}
console.timeEnd('Object method calls');
console.log(`Result: ${sum4.toFixed(2)}`);
console.log('✓ Optimized - all Point objects have the same shape\n');

// =============================================================================
// Summary
// =============================================================================
console.log('=== SUMMARY ===');
console.log('✓ Use consistent types (monomorphic functions)');
console.log('✓ Keep array elements the same type');
console.log('✓ Maintain stable object shapes');
console.log('✗ Avoid mixing types in the same function');
console.log('✗ Avoid changing object shapes after creation\n');

// function getAge(obj: User): number {
//   return obj.age;
// }

// // Warm up with same object shape
// for (let i = 0; i < 100000; i++) {
//   getAge({ name: 'Bob', age: i, city: 'LA' });
// }

// console.log('Age:', getAge(user));
// console.log('Property access is optimized via inline caching\n');

// // Example 5: Small integer operations (SMI - Small Integer)
// console.log('5. Small Integer Operations (SMI Optimized)');

// function fibonacci(n: number): number {
//   if (n <= 1) return n;
//   let a = 0, b = 1;
//   for (let i = 2; i <= n; i++) {
//     const temp = a + b;
//     a = b;
//     b = temp;
//   }
//   return b;
// }

// // Warm up
// for (let i = 0; i < 10000; i++) {
//   fibonacci(20);
// }

// console.log('Fibonacci(20):', fibonacci(20));
// console.log('Small integers (SMI) are highly optimized in V8\n');

// // Example 6: Typed arrays for numeric operations
// console.log('6. Typed Arrays (Highly Optimized)');

// function sumTypedArray(arr: Float64Array): number {
//   let sum = 0;
//   for (let i = 0; i < arr.length; i++) {
//     sum += arr[i];
//   }
//   return sum;
// }

// const typedArray = new Float64Array(10000);
// for (let i = 0; i < typedArray.length; i++) {
//   typedArray[i] = i * 1.5;
// }

// // Warm up
// for (let i = 0; i < 1000; i++) {
//   sumTypedArray(typedArray);
// }

// console.log('Typed array sum (first 5):', sumTypedArray(typedArray.slice(0, 5)));
// console.log('Typed arrays provide predictable, optimizable memory layout\n');

// // Example 7: Generic functions with constraints
// console.log('7. Generic Functions with Type Constraints');

// function multiply<T extends number>(a: T, b: T): number {
//   return a * b;
// }

// // Warm up - TypeScript ensures type safety at compile time
// for (let i = 0; i < 100000; i++) {
//   multiply(i, 2);
// }

// console.log('Multiply:', multiply(5, 10));
// console.log('Generics with constraints maintain type safety and optimization\n');

// console.log('=== Check the output above for optimization messages ===');
// console.log('Look for "[marking ... for optimized recompilation]" messages');
