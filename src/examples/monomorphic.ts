/**
 * MONOMORPHIC vs POLYMORPHIC Examples
 * 
 * Demonstrates the performance difference between monomorphic and polymorphic functions.
 * Run with: npm run monomorphic
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== Monomorphic vs Polymorphic Comparison ===\n');

// MONOMORPHIC: Function always receives same type/shape
console.log('1. MONOMORPHIC Function (Fast & Optimized)');

interface MonomorphicObject {
  value: number;
}

function processMonomorphic(obj: MonomorphicObject): number {
  return obj.value * 2;
}

// Always pass objects with same shape
const obj1: MonomorphicObject = { value: 10 };
const obj2: MonomorphicObject = { value: 20 };
const obj3: MonomorphicObject = { value: 30 };

console.time('Monomorphic');
for (let i = 0; i < 1000000; i++) {
  processMonomorphic(obj1);
  processMonomorphic(obj2);
  processMonomorphic(obj3);
}
console.timeEnd('Monomorphic');
console.log('✓ TurboFan can optimize this effectively\n');

// POLYMORPHIC: Function receives different types/shapes
console.log('2. POLYMORPHIC Function (Slower)');

// Using type unions to show polymorphic behavior at runtime
type PolymorphicObject = 
  | { value: number }
  | { value: number; extra: string }
  | { other: number; value: number }
  | { value: number; x: number; y: number };

function processPolymorphic(obj: PolymorphicObject): number {
  return obj.value * 2;
}

// Pass objects with different shapes
const objA: PolymorphicObject = { value: 10 };
const objB: PolymorphicObject = { value: 20, extra: 'data' };
const objC: PolymorphicObject = { other: 5, value: 30 };
const objD: PolymorphicObject = { value: 40, x: 1, y: 2 };

console.time('Polymorphic');
for (let i = 0; i < 1000000; i++) {
  processPolymorphic(objA);
  processPolymorphic(objB);
  processPolymorphic(objC);
  processPolymorphic(objD);
}
console.timeEnd('Polymorphic');
console.log('⚠ Harder to optimize - must handle multiple shapes\n');

// MEGAMORPHIC: Too many different shapes (worst case)
console.log('3. MEGAMORPHIC Function (Very Slow)');

type MegamorphicObject = { value: number; [key: string]: any };

function processMegamorphic(obj: MegamorphicObject): number {
  return obj.value * 2;
}

// Create many objects with different shapes
const objects: MegamorphicObject[] = [];
for (let i = 0; i < 100; i++) {
  const obj: MegamorphicObject = { value: i };
  // Add random properties to create different shapes
  for (let j = 0; j < i % 5; j++) {
    obj[`prop${j}`] = j;
  }
  objects.push(obj);
}

console.time('Megamorphic');
for (let i = 0; i < 1000000; i++) {
  processMegamorphic(objects[i % objects.length]);
}
console.timeEnd('Megamorphic');
console.log('✗ Cannot optimize - falls back to slow path\n');

// Example 4: Type-safe monomorphic approach
console.log('4. Type-Safe Monomorphic Approach');

interface StrictShape {
  readonly value: number;
  readonly id: number;
}

function processStrictShape(obj: StrictShape): number {
  return obj.value * obj.id;
}

const strictObjects: StrictShape[] = [];
for (let i = 0; i < 10000; i++) {
  strictObjects.push({ value: i, id: i + 1 });
}

console.time('Strict monomorphic');
for (let i = 0; i < 1000000; i++) {
  processStrictShape(strictObjects[i % strictObjects.length]);
}
console.timeEnd('Strict monomorphic');
console.log('✓ TypeScript ensures consistent shape at compile time\n');

console.log('=== Key Takeaways ===');
console.log('• Monomorphic (1 type): Fastest - fully optimized');
console.log('• Polymorphic (2-4 types): Moderate - partially optimized');
console.log('• Megamorphic (5+ types): Slowest - no optimization');
console.log('• TypeScript helps enforce consistent shapes at compile time');
