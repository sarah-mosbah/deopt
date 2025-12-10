/**
 * DEOPTIMIZATION EXAMPLES
 * 
 * This file demonstrates common scenarios that cause V8 to deoptimize code.
 * Run with: npm run deopt
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== TurboFan Deoptimization Examples ===\n');

// Example 1: Type change deoptimization
console.log('1. Type Change Deoptimization');

function calculate(a: number, b: number): number {
  return a + b;
}

// Optimize for numbers
for (let i = 0; i < 100000; i++) {
  calculate(i, i + 1);
}

console.log('Optimized for numbers:', calculate(10, 20));

// At runtime, if we bypass TypeScript's type checking
// (e.g., through `any` or external data), deoptimization can still occur
const untypedCalculate = calculate as any;
console.log('With type coercion:', untypedCalculate('Hello' as any, 'World' as any));
console.log('⚠ Runtime type changes cause deoptimization even in TypeScript!\n');

// Example 2: Hidden class changes
console.log('2. Hidden Class Change Deoptimization');

interface UserShape {
  name: string;
  age: number;
}

// Good: Consistent object creation
function createUser(name: string, age: number): UserShape {
  return { name, age };
}

// Warm up
for (let i = 0; i < 100000; i++) {
  createUser('User' + i, i);
}

const user1 = createUser('Alice', 30);
console.log('User 1:', user1);


console.log('User 1:', user1);

// Bad: Different property order creates different hidden class
function createBadUser(name: string, age: number): UserShape {
  return { age, name }; // Different order!
}

const user2 = createBadUser('Bob', 25);
console.log('User 2:', user2);
console.log('⚠ Property order matters for hidden classes even with same interface!\n');

// Example 3: Adding properties after creation
console.log('3. Dynamic Property Addition');

class Person {
  constructor(
    public name: string,
    public age: number
  ) {}
}

function processPersonOptimized(person: Person): string {
  return `${person.name} is ${person.age}`;
}

// Warm up
for (let i = 0; i < 100000; i++) {
  const p = new Person('User' + i, i);
  processPersonOptimized(p);
}

const alice = new Person('Alice', 30);
console.log('Before:', processPersonOptimized(alice));

// Add property dynamically - changes hidden class
(alice as any).city = 'NYC';
console.log('After adding property:', processPersonOptimized(alice));
console.log('⚠ Adding properties dynamically causes deoptimization!\n');

// Example 4: Array with holes
console.log('4. Array Holes Deoptimization');

function sumArrayOptimized(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Packed array (optimized)
const packed: number[] = [1, 2, 3, 4, 5];
console.log('Packed array sum:', sumArrayOptimized(packed));

// Holey array (deoptimized) - TypeScript can't prevent this at runtime
const holey: number[] = new Array(5);
holey[0] = 1;
holey[1] = 2;
holey[3] = 4;
holey[4] = 5;
console.log('Holey array sum:', sumArrayOptimized(holey));
console.log('⚠ Arrays with holes cannot be fully optimized!\n');

// Example 5: Array type change
console.log('5. Array Element Type Change');

function processArray(arr: (number | string)[]): number {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    result += typeof val === 'number' ? val : 0;
  }
  return result;
}

const numArray: (number | string)[] = [1, 2, 3, 4, 5];
console.log('Number array:', processArray(numArray));

// Change array element type
numArray.push('string');
console.log('Mixed array:', processArray(numArray));
console.log('⚠ Changing array element types causes deoptimization!\n');

// Example 6: Try-catch blocks
console.log('6. Try-Catch Deoptimization');

function withoutTryCatch(n: number): number {
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += i;
  }
  return result;
}

function withTryCatch(n: number): number {
  try {
    let result = 0;
    for (let i = 0; i < n; i++) {
      result += i;
    }
    return result;
  } catch (e) {
    return 0;
  }
}

console.time('Without try-catch');
for (let i = 0; i < 100000; i++) {
  withoutTryCatch(100);
}
console.timeEnd('Without try-catch');

console.time('With try-catch');
for (let i = 0; i < 100000; i++) {
  withTryCatch(100);
}
console.timeEnd('With try-catch');
console.log('⚠ Try-catch blocks can prevent optimization!\n');

// Example 7: Rest parameters vs Arguments
console.log('7. Modern JavaScript Patterns (Optimizable)');

function useRest(...args: number[]): number {
  return args.reduce((a, b) => a + b, 0);
}

// TypeScript doesn't support 'arguments' in arrow functions,
// and discourages it in regular functions
function oldStyleArguments(...args: any[]): number {
  let sum = 0;
  // Using rest parameters instead - this is the TypeScript way
  for (let i = 0; i < args.length; i++) {
    sum += args[i];
  }
  return sum;
}

console.log('Rest parameters:', useRest(1, 2, 3, 4, 5));
console.log('Old style with rest (TS-safe):', oldStyleArguments(1, 2, 3, 4, 5));
console.log('✓ TypeScript encourages rest parameters which are more optimizable!\n');

// Example 8: TypeScript-specific - Optional chaining doesn't hurt optimization
console.log('8. Modern TypeScript Features');

interface OptionalData {
  user?: {
    profile?: {
      name?: string;
    };
  };
}

function getNameSafely(data: OptionalData): string {
  return data.user?.profile?.name ?? 'Unknown';
}

const dataWithName: OptionalData = { user: { profile: { name: 'Alice' } } };
const dataWithoutName: OptionalData = { user: {} };

for (let i = 0; i < 100000; i++) {
  getNameSafely(dataWithName);
  getNameSafely(dataWithoutName);
}

console.log('With name:', getNameSafely(dataWithName));
console.log('Without name:', getNameSafely(dataWithoutName));
console.log('✓ Optional chaining is transpiled efficiently\n');

console.log('=== Check the output above for deoptimization messages ===');
console.log('Look for "[deoptimize ...]" or "[bailout ...]" messages');
console.log('\n=== TypeScript Helps But... ===');
console.log('• Compile-time types don\'t prevent runtime deoptimization');
console.log('• External data (APIs, user input) can violate type assumptions');
console.log('• Use type guards and validation for external data');
console.log('• TypeScript transpilation is generally V8-friendly');
