/**
 * PRESENTATION DEMO - JS Compiler & Optimized Code
 *
 * A comprehensive demonstration of V8 optimization principles
 * Run with: npm run build && node --trace-opt --trace-deopt dist/examples/pres-demo.js
 *
 * Topics covered:
 * 1. Optimization vs Deoptimization (Stable vs Unstable Functions)
 * 2. Hidden Classes & Object Shapes (Monomorphic vs Megamorphic)
 * 3. Inline Cache States (IC - Method Call Optimization)
 * 4. Double (==) vs Triple (===) Equals
 * 5. Object Arrays & Copying Performance
 * 6. Negative Numbers Impact (SMI Optimization)
 * 7. Holey Arrays Performance
 * 8. DELETE vs UNDEFINED vs NULL (Property Removal)
 * 9. Amdahl's Law (Hot Path Optimization)
 */

export {};

const ITERATIONS = 5_000_000;
const WARMUP = 100_000;

console.log('='.repeat(70));
console.log('JS COMPILER & OPTIMIZATION - PRESENTATION DEMO');
console.log('='.repeat(70));
console.log('');

// =============================================================================
// 1. OPTIMIZATION vs DEOPTIMIZATION
// =============================================================================
console.log('━'.repeat(70));
console.log('1. OPTIMIZATION vs DEOPTIMIZATION (Stable vs Unstable Functions)');
console.log('━'.repeat(70));

// GOOD: Stable, monomorphic function
function addStable(a: number, b: number): number {
  return a + b;
}

// BAD: Unstable, polymorphic function
function addUnstable(a: any, b: any): any {
  return a + b;
}

// Warm-up stable function with consistent types
console.log('\n📊 Testing STABLE function (always numbers)...');
for (let i = 0; i < WARMUP; i++) {
  addStable(i, i + 1);
}

// Measure stable
console.time('✓ Stable function');
let stableSum = 0;
for (let i = 0; i < ITERATIONS; i++) {
  stableSum += addStable(i, i + 1);
}
console.timeEnd('✓ Stable function');

// Warm-up unstable with mixed types (prevents optimization)
console.log('\n📊 Testing UNSTABLE function (mixed types)...');
for (let i = 0; i < WARMUP; i++) {
  if (i % 3 === 0) addUnstable(i, i + 1);
  else if (i % 3 === 1) addUnstable('a', 'b');
  else addUnstable(i.toString(), 'x');
}

// Measure unstable with mixed types
console.time('✗ Unstable function');
let unstableSum: any = 0;
for (let i = 0; i < ITERATIONS; i++) {
  if (i % 3 === 0) unstableSum = addUnstable(i, i + 1);
  else if (i % 3 === 1) unstableSum = addUnstable('a', 'b');
  else unstableSum = addUnstable(i.toString(), 'x');
}
console.timeEnd('✗ Unstable function');
console.log(`   (Results: stable=${stableSum}, unstable=${unstableSum})`);

console.log('\n💡 Key Point: Stable, monomorphic functions are optimized by TurboFan');
console.log('   Unstable functions with mixed types cannot be optimized\n');

// =============================================================================
// 2. HIDDEN CLASSES & INLINE CACHING (Object Shapes)
// =============================================================================
console.log('━'.repeat(70));
console.log('2. HIDDEN CLASSES & INLINE CACHING (Object Shapes Matter)');
console.log('━'.repeat(70));

// GOOD: Monomorphic - Same hidden class
class Point {
  constructor(public x: number, public y: number) {}
}

function distanceMonomorphic(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// Create points with SAME shape
const monoPoints: Point[] = [];
for (let i = 0; i < 1000; i++) {
  monoPoints.push(new Point(i, i + 1));
}

// Warm-up
console.log('\n📊 Testing MONOMORPHIC property access (same shape)...');
for (let i = 0; i < WARMUP; i++) {
  distanceMonomorphic(monoPoints[i % monoPoints.length]);
}

// Measure
console.time('✓ Monomorphic access');
let monoSum = 0;
for (let i = 0; i < ITERATIONS; i++) {
  monoSum += distanceMonomorphic(monoPoints[i % monoPoints.length]);
}
console.timeEnd('✓ Monomorphic access');

// BAD: Megamorphic - Different hidden classes
interface PointLike {
  x: number;
  y: number;
  [key: string]: any;
}

function distanceMegamorphic(p: PointLike): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// Create points with DIFFERENT shapes (5+ different hidden classes)
const megaPoints: PointLike[] = [];
for (let i = 0; i < 1000; i++) {
  const p: PointLike = { x: i, y: i + 1 };

  // Add different properties to create different shapes
  if (i % 5 === 0) p.z = i;
  else if (i % 5 === 1) p.color = 'red';
  else if (i % 5 === 2) p.id = i;
  else if (i % 5 === 3) p.name = 'point';
  else if (i % 5 === 4) p.label = 'p' + i;

  megaPoints.push(p);
}

// Warm-up
console.log('\n📊 Testing MEGAMORPHIC property access (different shapes)...');
for (let i = 0; i < WARMUP; i++) {
  distanceMegamorphic(megaPoints[i % megaPoints.length]);
}

// Measure
console.time('✗ Megamorphic access');
let megaSum = 0;
for (let i = 0; i < ITERATIONS; i++) {
  megaSum += distanceMegamorphic(megaPoints[i % megaPoints.length]);
}
console.timeEnd('✗ Megamorphic access');
console.log(`   (Results: mono=${monoSum.toFixed(2)}, mega=${megaSum.toFixed(2)})`);

console.log('\n💡 Key Point: Objects with same shape enable inline caching');
console.log('   Different shapes cause megamorphic property access (slower)\n');

// =============================================================================
// 3. INLINE CACHE (IC) STATES - Monomorphic vs Polymorphic vs Megamorphic
// =============================================================================
console.log('━'.repeat(70));
console.log('3. INLINE CACHE STATES (IC Optimization)');
console.log('━'.repeat(70));

// Define different animal types with same interface
interface Animal {
  name: string;
  age: number;
  makeSound(): string;
}

class Dog implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Woof!';
  }
}

class Cat implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Meow!';
  }
}

class Bird implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Tweet!';
  }
}

class Horse implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Neigh!';
  }
}

class Cow implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Moo!';
  }
}

class Sheep implements Animal {
  constructor(public name: string, public age: number) {}
  makeSound(): string {
    return 'Baa!';
  }
}

// Function to call - V8 will cache the call site
function getAnimalInfo(animal: Animal): string {
  return animal.name + ': ' + animal.makeSound();
}

// Test 1: MONOMORPHIC - Single type (fastest IC state)
console.log('\n📊 Testing MONOMORPHIC IC (1 type - fastest)...');

const dogs: Animal[] = [];
for (let i = 0; i < 1000; i++) {
  dogs.push(new Dog(`Dog${i}`, i % 10));
}

// Warm-up
for (let i = 0; i < WARMUP; i++) {
  getAnimalInfo(dogs[i % dogs.length]);
}

console.time('✓ Monomorphic IC (1 type)');
let monoIC = 0;
for (let i = 0; i < ITERATIONS; i++) {
  const result = getAnimalInfo(dogs[i % dogs.length]);
  monoIC += result.length;
}
console.timeEnd('✓ Monomorphic IC (1 type)');

// Test 2: POLYMORPHIC - 2-4 types (moderate IC state)
console.log('\n📊 Testing POLYMORPHIC IC (2-4 types - moderate)...');

const mixedAnimals: Animal[] = [];
for (let i = 0; i < 1000; i++) {
  if (i % 4 === 0) mixedAnimals.push(new Dog(`Dog${i}`, i % 10));
  else if (i % 4 === 1) mixedAnimals.push(new Cat(`Cat${i}`, i % 10));
  else if (i % 4 === 2) mixedAnimals.push(new Bird(`Bird${i}`, i % 10));
  else mixedAnimals.push(new Horse(`Horse${i}`, i % 10));
}

// Create new function to have fresh IC state
function getAnimalInfoPoly(animal: Animal): string {
  return animal.name + ': ' + animal.makeSound();
}

// Warm-up with mixed types
for (let i = 0; i < WARMUP; i++) {
  getAnimalInfoPoly(mixedAnimals[i % mixedAnimals.length]);
}

console.time('⚠ Polymorphic IC (4 types)');
let polyIC = 0;
for (let i = 0; i < ITERATIONS; i++) {
  const result = getAnimalInfoPoly(mixedAnimals[i % mixedAnimals.length]);
  polyIC += result.length;
}
console.timeEnd('⚠ Polymorphic IC (4 types)');

// Test 3: MEGAMORPHIC - 5+ types (slowest - IC abandoned)
console.log('\n📊 Testing MEGAMORPHIC IC (5+ types - slowest)...');

const manyAnimals: Animal[] = [];
for (let i = 0; i < 1000; i++) {
  if (i % 6 === 0) manyAnimals.push(new Dog(`Dog${i}`, i % 10));
  else if (i % 6 === 1) manyAnimals.push(new Cat(`Cat${i}`, i % 10));
  else if (i % 6 === 2) manyAnimals.push(new Bird(`Bird${i}`, i % 10));
  else if (i % 6 === 3) manyAnimals.push(new Horse(`Horse${i}`, i % 10));
  else if (i % 6 === 4) manyAnimals.push(new Cow(`Cow${i}`, i % 10));
  else manyAnimals.push(new Sheep(`Sheep${i}`, i % 10));
}

// Create new function to have fresh IC state
function getAnimalInfoMega(animal: Animal): string {
  return animal.name + ': ' + animal.makeSound();
}

// Warm-up with many types
for (let i = 0; i < WARMUP; i++) {
  getAnimalInfoMega(manyAnimals[i % manyAnimals.length]);
}

console.time('✗ Megamorphic IC (6 types)');
let megaIC = 0;
for (let i = 0; i < ITERATIONS; i++) {
  const result = getAnimalInfoMega(manyAnimals[i % manyAnimals.length]);
  megaIC += result.length;
}
console.timeEnd('✗ Megamorphic IC (6 types)');
console.log(`   (Results: mono=${monoIC}, poly=${polyIC}, mega=${megaIC})`);

console.log('\n💡 Key Point: Inline Cache (IC) states matter for method calls');
console.log('   Monomorphic (1 type) → Fastest - V8 knows exactly what to call');
console.log('   Polymorphic (2-4 types) → Moderate - V8 checks a few options');
console.log('   Megamorphic (5+ types) → Slowest - V8 abandons caching');
console.log('   Keep call sites monomorphic when possible!\n');

// =============================================================================
// 4. DOUBLE (==) vs TRIPLE (===) EQUALS
// =============================================================================
console.log('━'.repeat(70));
console.log('4. DOUBLE (==) vs TRIPLE (===) EQUALS PERFORMANCE');
console.log('━'.repeat(70));

// Setup test data
const testValues = new Array(1000);
for (let i = 0; i < testValues.length; i++) {
  testValues[i] = i;
}

// Test with === (strict equality - no type coercion)
console.log('\n📊 Testing === (strict equality, no type coercion)...');
console.time('✓ Triple equals (===)');
let tripleCount = 0;
for (let i = 0; i < ITERATIONS; i++) {
  const val = testValues[i % testValues.length];
  if (val === 500) tripleCount++;
  if (val === 250) tripleCount++;
  if (val === 750) tripleCount++;
}
console.timeEnd('✓ Triple equals (===)');

// Test with == (loose equality - requires type coercion)
console.log('\n📊 Testing == (loose equality, with type coercion)...');
console.time('✗ Double equals (==)');
let doubleCount = 0;
for (let i = 0; i < ITERATIONS; i++) {
  const val = testValues[i % testValues.length];
  if (val == 500) doubleCount++;
  if (val == 250) doubleCount++;
  if (val == 750) doubleCount++;
}
console.timeEnd('✗ Double equals (==)');
console.log(`   (Match counts: triple=${tripleCount}, double=${doubleCount})`);

console.log('\n💡 Key Point: === is faster (no type coercion needed)');
console.log('   == requires type checking and potential conversion\n');

// =============================================================================
// 5. OBJECT ARRAYS & COPYING PERFORMANCE
// =============================================================================
console.log('━'.repeat(70));
console.log('5. OBJECT ARRAYS & COPYING PERFORMANCE');
console.log('━'.repeat(70));

interface User {
  id: number;
  name: string;
  age: number;
}

// Create test data
const users: User[] = [];
for (let i = 0; i < 1000; i++) {
  users.push({ id: i, name: `User${i}`, age: 20 + (i % 50) });
}

// Method 1: Spread operator
console.log('\n📊 Testing spread operator [...]...');
console.time('Spread operator');
for (let i = 0; i < 50000; i++) {
  const copy = [...users];
  if (copy.length === 0) console.log('never'); // Prevent optimization
}
console.timeEnd('Spread operator');

// Method 2: Array.slice()
console.log('\n📊 Testing Array.slice()...');
console.time('✓ Array.slice()');
for (let i = 0; i < 50000; i++) {
  const copy = users.slice();
  if (copy.length === 0) console.log('never');
}
console.timeEnd('✓ Array.slice()');

// Method 3: Array.from()
console.log('\n📊 Testing Array.from()...');
console.time('Array.from()');
for (let i = 0; i < 50000; i++) {
  const copy = Array.from(users);
  if (copy.length === 0) console.log('never');
}
console.timeEnd('Array.from()');

// Method 4: Manual loop (fastest for large arrays)
console.log('\n📊 Testing manual loop...');
console.time('✓ Manual loop');
for (let i = 0; i < 50000; i++) {
  const copy: User[] = new Array(users.length);
  for (let j = 0; j < users.length; j++) {
    copy[j] = users[j];
  }
  if (copy.length === 0) console.log('never');
}
console.timeEnd('✓ Manual loop');

console.log('\n💡 Key Point: slice() is fastest for copying arrays');
console.log('   Spread operator is nearly as fast and more readable\n');

// =============================================================================
// 6. NEGATIVE NUMBERS IMPACT (SMI Optimization)
// =============================================================================
console.log('━'.repeat(70));
console.log('6. NEGATIVE NUMBERS IMPACT (SMI Optimization)');
console.log('━'.repeat(70));

// SMI Range: -2^30 to 2^30-1 (approximately -1 billion to +1 billion)
// Numbers outside this range are heap-allocated (slower)

// Test 1: Small integers (SMI - optimized)
console.log('\n📊 Testing SMALL integers (SMI range: -1000 to 1000)...');
function sumSmallIntegers(): number {
  let sum = 0;
  for (let i = -1000; i < 1000; i++) {
    sum += i;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < WARMUP; i++) {
  sumSmallIntegers();
}

console.time('✓ SMI numbers');
let smiSum = 0;
for (let i = 0; i < 10000; i++) {
  smiSum += sumSmallIntegers();
}
console.timeEnd('✓ SMI numbers');

// Test 2: Large numbers (heap-allocated - slower)
console.log('\n📊 Testing LARGE numbers (outside SMI range)...');
function sumLargeNumbers(): number {
  let sum = 0;
  const base = 2_000_000_000; // Outside SMI range
  for (let i = 0; i < 2000; i++) {
    sum += base + i;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < WARMUP; i++) {
  sumLargeNumbers();
}

console.time('✗ Large numbers');
let largeSum = 0;
for (let i = 0; i < 10000; i++) {
  largeSum += sumLargeNumbers();
}
console.timeEnd('✗ Large numbers');

// Test 3: Negative numbers in SMI range (still optimized)
console.log('\n📊 Testing NEGATIVE integers (in SMI range)...');
function sumNegativeIntegers(): number {
  let sum = 0;
  for (let i = 0; i > -2000; i--) {
    sum += i;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < WARMUP; i++) {
  sumNegativeIntegers();
}

console.time('✓ Negative SMI numbers');
let negSum = 0;
for (let i = 0; i < 10000; i++) {
  negSum += sumNegativeIntegers();
}
console.timeEnd('✓ Negative SMI numbers');
console.log(`   (Results: smi=${smiSum}, large=${largeSum}, neg=${negSum})`);

console.log('\n💡 Key Point: Numbers in SMI range (-2^30 to 2^30-1) are optimized');
console.log('   Negative numbers are fine if they stay in SMI range');
console.log('   Large numbers outside SMI range require heap allocation\n');

// =============================================================================
// 7. HOLEY ARRAYS
// =============================================================================
console.log('━'.repeat(70));
console.log('7. HOLEY ARRAYS PERFORMANCE');
console.log('━'.repeat(70));

const ARRAY_SIZE = 10000;

// GOOD: Packed array (no holes)
console.log('\n📊 Testing PACKED array (no holes)...');
const packedArray: number[] =[1, 2, 3]
for (let i = 0; i < ARRAY_SIZE; i++) {
  packedArray[i] = i;
}

function sumPacked(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Warm-up
for (let i = 0; i < 1000; i++) {
  sumPacked(packedArray);
}

console.time('✓ Packed array');
let packedSum = 0;
for (let i = 0; i < 50000; i++) {
  packedSum += sumPacked(packedArray);
}
console.timeEnd('✓ Packed array');

// BAD: Holey array (has holes)
console.log('\n📊 Testing HOLEY array (with holes)...');
const holeyArray: number[] = new Array(ARRAY_SIZE);
for (let i = 0; i < ARRAY_SIZE; i += 2) {
  holeyArray[i] = i; // Only fill even indices, leaving holes
}

function sumHoley(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i] || 0; // Need to handle undefined
  }
  return sum;
}

// Warm-up
for (let i = 0; i < 1000; i++) {
  sumHoley(holeyArray);
}

console.time('✗ Holey array');
let holeySum = 0;
for (let i = 0; i < 50000; i++) {
  holeySum += sumHoley(holeyArray);
}
console.timeEnd('✗ Holey array');

// ALSO BAD: Array created with holes then filled
console.log('\n📊 Testing array created with holes then FILLED...');
const filledHoleyArray: number[] = new Array(ARRAY_SIZE); // Creates holes!
// Even if we fill it now, V8 remembers it was holey
for (let i = 0; i < ARRAY_SIZE; i++) {
  filledHoleyArray[i] = i;
}

console.time('✗ Originally holey');
let filledSum = 0;
for (let i = 0; i < 50000; i++) {
  filledSum += sumPacked(filledHoleyArray);
}
console.timeEnd('✗ Originally holey');
console.log(`   (Results: packed=${packedSum}, holey=${holeySum}, filled=${filledSum})`);

console.log('\n💡 Key Point: Holey arrays force V8 to check prototype chain');
console.log('   Use Array(size).fill(0) or pre-initialize all elements');
console.log('   Once holey, always holey in V8\'s view\n');

// =============================================================================
// 8. DELETE vs UNDEFINED vs NULL
// =============================================================================
console.log('━'.repeat(70));
console.log('8. DELETE vs UNDEFINED vs NULL (Property Removal)');
console.log('━'.repeat(70));

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number | null | undefined;
}

// BAD: Using delete operator
console.log('\n📊 Testing DELETE operator (changes hidden class)...');

function processWithDelete(): number {
  const products: any[] = [];

  // Create products
  for (let i = 0; i < 1000; i++) {
    products.push({ id: i, name: `Product${i}`, price: i * 10, stock: i });
  }

  // "Remove" stock using delete
  for (let i = 0; i < products.length; i++) {
    if (i % 2 === 0) {
      delete products[i].stock; // Changes hidden class!
    }
  }

  // Access products
  let sum = 0;
  for (let i = 0; i < products.length; i++) {
    sum += products[i].price;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < 100; i++) {
  processWithDelete();
}

console.time('✗ Using delete');
let deleteSum = 0;
for (let i = 0; i < 5000; i++) {
  deleteSum += processWithDelete();
}
console.timeEnd('✗ Using delete');

// BETTER: Using undefined
console.log('\n📊 Testing UNDEFINED (keeps hidden class)...');

function processWithUndefined(): number {
  const products: Product[] = [];

  // Create products
  for (let i = 0; i < 1000; i++) {
    products.push({ id: i, name: `Product${i}`, price: i * 10, stock: i });
  }

  // "Remove" stock using undefined
  for (let i = 0; i < products.length; i++) {
    if (i % 2 === 0) {
      products[i].stock = undefined; // Same hidden class
    }
  }

  // Access products
  let sum = 0;
  for (let i = 0; i < products.length; i++) {
    sum += products[i].price;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < 100; i++) {
  processWithUndefined();
}

console.time('✓ Using undefined');
let undefinedSum = 0;
for (let i = 0; i < 5000; i++) {
  undefinedSum += processWithUndefined();
}
console.timeEnd('✓ Using undefined');

// BEST: Using null (more explicit)
console.log('\n📊 Testing NULL (keeps hidden class, more explicit)...');

function processWithNull(): number {
  const products: Product[] = [];

  // Create products
  for (let i = 0; i < 1000; i++) {
    products.push({ id: i, name: `Product${i}`, price: i * 10, stock: i });
  }

  // "Remove" stock using null
  for (let i = 0; i < products.length; i++) {
    if (i % 2 === 0) {
      products[i].stock = null; // Same hidden class, intentional absence
    }
  }

  // Access products
  let sum = 0;
  for (let i = 0; i < products.length; i++) {
    sum += products[i].price;
  }
  return sum;
}

// Warm-up
for (let i = 0; i < 100; i++) {
  processWithNull();
}

console.time('✓ Using null');
let nullSum = 0;
for (let i = 0; i < 5000; i++) {
  nullSum += processWithNull();
}
console.timeEnd('✓ Using null');
console.log(`   (Results: delete=${deleteSum}, undefined=${undefinedSum}, null=${nullSum})`);

console.log('\n💡 Key Point: NEVER use delete operator for performance-critical code');
console.log('   delete changes the hidden class (very slow!)');
console.log('   Use null (explicit absence) or undefined instead');
console.log('   null is more semantic: "intentionally empty" vs "not yet set"\n');

// =============================================================================
// 9. AMDAHL'S LAW DEMONSTRATION
// =============================================================================
console.log('━'.repeat(70));
console.log('9. AMDAHL\'S LAW - Why Optimizing Hot Paths Matters');
console.log('━'.repeat(70));

console.log('\n📚 Amdahl\'s Law: Speedup = 1 / ((1 - P) + P/S)');
console.log('   P = Portion that can be parallelized/optimized');
console.log('   S = Speedup of that portion\n');

// Simulate a program with initialization, hot loop, and cleanup
function simulateProgram(optimizeHotPath: boolean): void {
  // 1. Initialization (10% of time) - Cannot optimize
  const initStart = performance.now();
  let initSum = 0;
  for (let i = 0; i < 1000000; i++) {
    initSum += Math.sqrt(i);
  }
  const initTime = performance.now() - initStart;

  // 2. Hot path (80% of time) - CAN optimize
  const hotStart = performance.now();
  let hotSum = 0;

  if (optimizeHotPath) {
    // Optimized: Monomorphic, packed arrays, SMI numbers
    const data: number[] = new Array(1000);
    for (let i = 0; i < data.length; i++) data[i] = i;

    for (let i = 0; i < 100000; i++) {
      for (let j = 0; j < data.length; j++) {
        hotSum += data[j];
      }
    }
  } else {
    // Unoptimized: Megamorphic, mixed types, holey arrays
    const data: any[] = new Array(1000); // Holey!
    for (let i = 0; i < data.length; i += 2) {
      data[i] = i % 3 === 0 ? i : i % 3 === 1 ? i.toString() : { val: i };
    }

    for (let i = 0; i < 100000; i++) {
      for (let j = 0; j < data.length; j++) {
        const val = data[j];
        hotSum += typeof val === 'number' ? val :
                   typeof val === 'string' ? 0 :
                   val?.val || 0;
      }
    }
  }

  const hotTime = performance.now() - hotStart;

  // 3. Cleanup (10% of time) - Cannot optimize
  const cleanStart = performance.now();
  let cleanSum = 0;
  for (let i = 0; i < 1000000; i++) {
    cleanSum += Math.random();
  }
  const cleanTime = performance.now() - cleanStart;

  const totalTime = initTime + hotTime + cleanTime;

  console.log(`   Init: ${initTime.toFixed(1)}ms (${((initTime/totalTime)*100).toFixed(1)}%)`);
  console.log(`   Hot:  ${hotTime.toFixed(1)}ms (${((hotTime/totalTime)*100).toFixed(1)}%)`);
  console.log(`   Clean: ${cleanTime.toFixed(1)}ms (${((cleanTime/totalTime)*100).toFixed(1)}%)`);
  console.log(`   Total: ${totalTime.toFixed(1)}ms`);

  if (hotSum === 0 && initSum === 0 && cleanSum === 0) console.log('never');
}

console.log('📊 Running UNOPTIMIZED program (hot path not optimized)...');
simulateProgram(false);

console.log('\n📊 Running OPTIMIZED program (hot path optimized)...');
simulateProgram(true);

console.log('\n💡 Key Point: Focus optimization efforts on hot paths (frequently executed)');
console.log('   Even 10x improvement on rarely-run code has minimal impact');
console.log('   Identify bottlenecks with profiling before optimizing\n');

// =============================================================================
// SUMMARY
// =============================================================================
console.log('='.repeat(70));
console.log('SUMMARY - OPTIMIZATION PRINCIPLES');
console.log('='.repeat(70));
console.log('');
console.log('✓ Keep functions monomorphic (consistent types)');
console.log('✓ Maintain stable object shapes (hidden classes)');
console.log('✓ Keep call sites monomorphic (avoid megamorphic IC)');
console.log('✓ Use === instead of == (avoid type coercion)');
console.log('✓ Prefer slice() for array copying (spread operator also good)');
console.log('✓ Keep numbers in SMI range when possible (-2^30 to 2^30-1)');
console.log('✓ Avoid holey arrays (always initialize all elements)');
console.log('✓ Never use delete - use null or undefined instead');
console.log('✓ Profile first, optimize hot paths (Amdahl\'s Law)');
console.log('');
console.log('Remember: Premature optimization is evil, but understanding');
console.log('          optimization principles helps you write better code!');
console.log('='.repeat(70));
