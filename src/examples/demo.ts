/**
 * COMPREHENSIVE V8 OPTIMIZATION DEMO
 * 
 * This file demonstrates all major V8 optimization concepts with clear performance differences.
 * Run with: npm run demo
 * 
 * Covers:
 * 1. Optimization vs Deoptimization
 * 2. Monomorphic vs Polymorphic vs Megamorphic
 * 3. Interface properties: undefined vs optional (?)
 * 4. Property deletion impact
 * 5. == vs === comparison performance
 * 6. Hollow arrays performance
 */

export {};

console.log('=== V8 OPTIMIZATION COMPREHENSIVE DEMO ===\n');

// =============================================================================
// 1. OPTIMIZATION vs DEOPTIMIZATION
// =============================================================================
console.log('1. OPTIMIZATION vs DEOPTIMIZATION\n');

// Optimized function - consistent types
function addNumbers(a: number, b: number): number {
  return a + b;
}

// Function that will deoptimize - inconsistent types
function addAnything(a: any, b: any): any {
  return a + b;
}

console.log('--- OPTIMIZED FUNCTION ---');
// Warm-up with numbers only
for (let i = 0; i < 100000; i++) {
  addNumbers(i, i + 1);
}

console.time('Optimized (numbers only)');
let sum1 = 0;
for (let i = 0; i < 10000000; i++) {
  sum1 += addNumbers(i, i + 1);
}
console.timeEnd('Optimized (numbers only)');
console.log(`Result: ${sum1}`);

console.log('\n--- DEOPTIMIZED FUNCTION ---');
// Warm-up with mixed types - causes deoptimization
for (let i = 0; i < 100000; i++) {
  if (i % 3 === 0) addAnything(i, i + 1);           // numbers
  else if (i % 3 === 1) addAnything('a', 'b');      // strings
  else addAnything(i.toString(), 'x');              // mixed
}

console.time('Deoptimized (mixed types)');
let sum2: any = 0;
for (let i = 0; i < 10000000; i++) {
  if (i % 3 === 0) sum2 = addAnything(i, i + 1);
  else if (i % 3 === 1) sum2 = addAnything('a', 'b');
  else sum2 = addAnything(i.toString(), 'x');
}
console.timeEnd('Deoptimized (mixed types)');
console.log(`Result: ${sum2}\n`);

// =============================================================================
// 2. MONOMORPHIC vs POLYMORPHIC vs MEGAMORPHIC
// =============================================================================
console.log('2. MONOMORPHIC vs POLYMORPHIC vs MEGAMORPHIC\n');

interface Point {
  x: number;
  y: number;
}

function calculateDistance(point: Point): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

// --- MONOMORPHIC (1 shape) ---
console.log('--- MONOMORPHIC (1 shape) ---');
const monoPoints: Point[] = [];
for (let i = 0; i < 50000; i++) {
  monoPoints.push({ x: i, y: i + 1 }); // Always same shape
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  calculateDistance(monoPoints[i % monoPoints.length]);
}

console.time('Monomorphic (1 shape)');
let monoSum = 0;
for (let i = 0; i < 5000000; i++) {
  monoSum += calculateDistance(monoPoints[i % monoPoints.length]);
}
console.timeEnd('Monomorphic (1 shape)');
console.log(`Result: ${monoSum.toFixed(2)}`);

// --- POLYMORPHIC (4 shapes) ---
console.log('\n--- POLYMORPHIC (4 shapes) ---');
const polyPoints: Point[] = [];
for (let i = 0; i < 50000; i++) {
  let p: Point;
  switch (i % 4) {
    case 0: p = { x: i, y: i + 1 }; break;           // Shape 1
    case 1: p = { y: i + 1, x: i }; break;           // Shape 2
    case 2: 
      const temp1: any = {}; temp1.x = i; temp1.y = i + 1; p = temp1; break; // Shape 3
    default: 
      const temp2: any = {}; temp2.y = i + 1; temp2.x = i; p = temp2; break; // Shape 4
  }
  polyPoints.push(p);
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  calculateDistance(polyPoints[i % polyPoints.length]);
}

console.time('Polymorphic (4 shapes)');
let polySum = 0;
for (let i = 0; i < 5000000; i++) {
  polySum += calculateDistance(polyPoints[i % polyPoints.length]);
}
console.timeEnd('Polymorphic (4 shapes)');
console.log(`Result: ${polySum.toFixed(2)}`);

// --- MEGAMORPHIC (10+ shapes) ---
console.log('\n--- MEGAMORPHIC (10+ shapes) ---');
const megaPoints: Point[] = [];
for (let i = 0; i < 50000; i++) {
  let p: any;
  switch (i % 10) {
    case 0: p = { x: i, y: i + 1 }; break;
    case 1: p = { y: i + 1, x: i }; break;
    case 2: p = {}; p.x = i; p.y = i + 1; break;
    case 3: p = {}; p.y = i + 1; p.x = i; break;
    case 4: p = { x: i, y: i + 1, z: 0 }; break;
    case 5: p = { y: i + 1, x: i, z: 0 }; break;
    case 6: p = Object.create(null); p.x = i; p.y = i + 1; break;
    case 7: p = { x: i }; p.y = i + 1; break;
    case 8: p = { y: i + 1 }; p.x = i; break;
    default: p = new (class { x: number; y: number; constructor(x: number, y: number) { this.x = x; this.y = y; } })(i, i + 1); break;
  }
  megaPoints.push(p);
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  calculateDistance(megaPoints[i % megaPoints.length]);
}

console.time('Megamorphic (10+ shapes)');
let megaSum = 0;
for (let i = 0; i < 5000000; i++) {
  megaSum += calculateDistance(megaPoints[i % megaPoints.length]);
}
console.timeEnd('Megamorphic (10+ shapes)');
console.log(`Result: ${megaSum.toFixed(2)}\n`);

// =============================================================================
// 3. UNDEFINED vs OPTIONAL (?) PROPERTY PERFORMANCE
// =============================================================================
console.log('3. UNDEFINED vs OPTIONAL (?) PROPERTY PERFORMANCE\n');

// Interface with undefined initialization
interface UserUndefined {
  name: string;
  age: number;
  email: string | undefined; // Explicitly undefined
  city: string | undefined;
}

// Interface with optional properties
interface UserOptional {
  name: string;
  age: number;
  email?: string; // Optional
  city?: string;
}

function processUserUndefined(user: UserUndefined): number {
  return user.name.length + user.age + (user.email ? user.email.length : 0);
}

function processUserOptional(user: UserOptional): number {
  return user.name.length + user.age + (user.email ? user.email.length : 0);
}

console.log('--- UNDEFINED INITIALIZATION ---');
const undefinedUsers: UserUndefined[] = [];
for (let i = 0; i < 10000; i++) {
  undefinedUsers.push({
    name: `User${i}`,
    age: i,
    email: i % 2 === 0 ? `user${i}@example.com` : undefined,
    city: i % 3 === 0 ? 'NYC' : undefined
  });
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  processUserUndefined(undefinedUsers[i % undefinedUsers.length]);
}

console.time('Undefined properties');
let undefinedSum = 0;
for (let i = 0; i < 2000000; i++) {
  undefinedSum += processUserUndefined(undefinedUsers[i % undefinedUsers.length]);
}
console.timeEnd('Undefined properties');
console.log(`Result: ${undefinedSum}`);

console.log('\n--- OPTIONAL PROPERTIES ---');
const optionalUsers: UserOptional[] = [];
for (let i = 0; i < 10000; i++) {
  const user: any = { name: `User${i}`, age: i };
  if (i % 2 === 0) user.email = `user${i}@example.com`;
  if (i % 3 === 0) user.city = 'NYC';
  optionalUsers.push(user);
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  processUserOptional(optionalUsers[i % optionalUsers.length]);
}

console.time('Optional properties');
let optionalSum = 0;
for (let i = 0; i < 2000000; i++) {
  optionalSum += processUserOptional(optionalUsers[i % optionalUsers.length]);
}
console.timeEnd('Optional properties');
console.log(`Result: ${optionalSum}\n`);

// =============================================================================
// 4. PROPERTY DELETION IMPACT
// =============================================================================
console.log('4. PROPERTY DELETION IMPACT\n');

interface Product {
  name: string;
  price: number;
  stock?: number;
}

function calculateValue(product: Product): number {
  return product.stock !== undefined ? product.price * product.stock : 0;
}

console.log('--- WITH PROPERTY DELETION ---');
const deletedProducts: Product[] = [];
for (let i = 0; i < 10000; i++) {
  const product: any = { name: `Product${i}`, price: i * 10, stock: i };
  if (i % 2 === 0) {
    delete product.stock; // VERY BAD - creates holey object
  }
  deletedProducts.push(product);
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  calculateValue(deletedProducts[i % deletedProducts.length]);
}

console.time('With deletions');
let deletedSum = 0;
for (let i = 0; i < 2000000; i++) {
  deletedSum += calculateValue(deletedProducts[i % deletedProducts.length]);
}
console.timeEnd('With deletions');
console.log(`Result: ${deletedSum}`);

console.log('\n--- WITH NULL VALUES ---');
const nullProducts: Product[] = [];
for (let i = 0; i < 10000; i++) {
  nullProducts.push({
    name: `Product${i}`,
    price: i * 10,
    stock: i % 2 === 0 ? undefined : i // Use undefined instead of delete
  });
}

// Warm-up
for (let i = 0; i < 100000; i++) {
  calculateValue(nullProducts[i % nullProducts.length]);
}

console.time('With null values');
let nullSum = 0;
for (let i = 0; i < 2000000; i++) {
  nullSum += calculateValue(nullProducts[i % nullProducts.length]);
}
console.timeEnd('With null values');
console.log(`Result: ${nullSum}\n`);

// =============================================================================
// 5. == vs === COMPARISON PERFORMANCE
// =============================================================================
console.log('5. == vs === COMPARISON PERFORMANCE\n');

const mixedArray: any[] = [];
for (let i = 0; i < 100000; i++) {
  if (i % 4 === 0) mixedArray.push(i);           // number
  else if (i % 4 === 1) mixedArray.push(i.toString()); // string
  else if (i % 4 === 2) mixedArray.push(null);   // null
  else mixedArray.push(undefined);                // undefined
}

console.log('--- LOOSE EQUALITY (==) ---');
console.time('Loose equality (==)');
let looseCount = 0;
for (let i = 0; i < 5000000; i++) {
  if (mixedArray[i % mixedArray.length] == 0) looseCount++; // Triggers type coercion
}
console.timeEnd('Loose equality (==)');
console.log(`Matches: ${looseCount}`);

console.log('\n--- STRICT EQUALITY (===) ---');
console.time('Strict equality (===)');
let strictCount = 0;
for (let i = 0; i < 5000000; i++) {
  if (mixedArray[i % mixedArray.length] === 0) strictCount++; // No coercion
}
console.timeEnd('Strict equality (===)');
console.log(`Matches: ${strictCount}\n`);

// =============================================================================
// 6. HOLLOW ARRAYS PERFORMANCE
// =============================================================================
console.log('6. HOLLOW ARRAYS PERFORMANCE\n');

console.log('--- DENSE ARRAY ---');
const denseArray: number[] = [];
for (let i = 0; i < 100000; i++) {
  denseArray[i] = i; // Sequential, no holes
}

console.time('Dense array sum');
let denseSum = 0;
for (let i = 0; i < denseArray.length; i++) {
  denseSum += denseArray[i];
}
console.timeEnd('Dense array sum');
console.log(`Sum: ${denseSum}`);

console.log('\n--- HOLLOW ARRAY ---');
const hollowArray: number[] = [];
for (let i = 0; i < 100000; i++) {
  if (i % 2 === 0) {
    hollowArray[i] = i; // Creates holes at odd indices
  }
  // Even indices remain undefined (holes)
}

console.time('Hollow array sum');
let hollowSum = 0;
for (let i = 0; i < hollowArray.length; i++) {
  if (hollowArray[i] !== undefined) { // Must check for holes
    hollowSum += hollowArray[i];
  }
}
console.timeEnd('Hollow array sum');
console.log(`Sum: ${hollowSum}`);

console.log('\n--- SPARSE ARRAY ---');
const sparseArray: number[] = [];
sparseArray[0] = 1;
sparseArray[50000] = 2;
sparseArray[99999] = 3; // Very sparse - mostly holes

console.time('Sparse array iteration');
let sparseSum = 0;
for (let i = 0; i < sparseArray.length; i++) {
  if (sparseArray[i] !== undefined) {
    sparseSum += sparseArray[i];
  }
}
console.timeEnd('Sparse array iteration');
console.log(`Sum: ${sparseSum}\n`);

// =============================================================================
// SUMMARY
// =============================================================================
console.log('=== PERFORMANCE SUMMARY ===');
console.log('FASTER →                                                  ← SLOWER');
console.log('✓ Optimized functions          vs  ✗ Deoptimized functions');
console.log('✓ Monomorphic (1 shape)        vs  ✗ Megamorphic (10+ shapes)');
console.log('✓ Undefined initialization     vs  ✗ Optional properties');
console.log('✓ Using null/undefined          vs  ✗ Property deletion');
console.log('✓ Strict equality (===)        vs  ✗ Loose equality (==)');
console.log('✓ Dense arrays                 vs  ✗ Hollow/Sparse arrays');
console.log('\n🎯 Key Takeaway: Consistency and predictability = Performance!');
