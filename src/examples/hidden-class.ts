/**
 * HIDDEN CLASS Examples
 * 
 * Demonstrates how object shape (hidden class) affects optimization.
 * Run with: npm run hidden-class
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== Hidden Class Optimization Examples ===\n');

// Example 1: Good - Consistent hidden class
console.log('1. GOOD: Consistent Object Shape');

class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
}

function distance(point: Point): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

// All points have same hidden class
const points: Point[] = [];
for (let i = 0; i < 100000; i++) {
  points.push(new Point(i, i + 1));
}

console.time('Consistent shape');
for (const point of points) {
  distance(point);
}
console.timeEnd('Consistent shape');
console.log('✓ All objects share the same hidden class - optimized!\n');

// Example 2: Bad - Inconsistent property order
console.log('2. BAD: Inconsistent Property Order');

interface PointShape {
  x: number;
  y: number;
}

function createPointBad1(x: number, y: number): PointShape {
  return { x, y };
}

function createPointBad2(x: number, y: number): PointShape {
  return { y, x }; // Different order - different hidden class!
}

const badPoints: PointShape[] = [];
for (let i = 0; i < 50000; i++) {
  badPoints.push(createPointBad1(i, i + 1));
  badPoints.push(createPointBad2(i, i + 1));
}

console.time('Inconsistent order');
for (const point of badPoints) {
  distance(point as Point);
}
console.timeEnd('Inconsistent order');
console.log('✗ Different hidden classes - slower!\n');

// Example 3: Bad - Adding properties dynamically
console.log('3. BAD: Dynamic Property Addition');

class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}

const users: User[] = [];
for (let i = 0; i < 10000; i++) {
  const user = new User('User' + i, i);
  
  // Randomly add extra properties
  if (i % 2 === 0) {
    (user as any).email = 'user@example.com';
  }
  if (i % 3 === 0) {
    (user as any).city = 'NYC';
  }
  
  users.push(user);
}

function getUserInfo(user: User): string {
  return `${user.name}, ${user.age}`;
}

console.time('Dynamic properties');
for (const user of users) {
  getUserInfo(user);
}
console.timeEnd('Dynamic properties');
console.log('✗ Multiple hidden classes created!\n');

// Example 4: Good - Initialize all properties in constructor
console.log('4. GOOD: Initialize All Properties Upfront');

class BetterUser {
  constructor(
    public name: string,
    public age: number,
    public email: string | null = null,
    public city: string | null = null
  ) {}
}

const betterUsers: BetterUser[] = [];
for (let i = 0; i < 10000; i++) {
  const email = i % 2 === 0 ? 'user@example.com' : null;
  const city = i % 3 === 0 ? 'NYC' : null;
  betterUsers.push(new BetterUser('User' + i, i, email, city));
}

console.time('Initialized properties');
for (const user of betterUsers) {
  getUserInfo(user);
}
console.timeEnd('Initialized properties');
console.log('✓ Same hidden class for all objects!\n');

// Example 5: Bad - Deleting properties
console.log('5. BAD: Deleting Properties');

class Product {
  constructor(
    public name: string,
    public price: number,
    public stock: number | undefined
  ) {}
}

function getTotalValue(product: Product): number {
  return product.stock !== undefined ? product.price * product.stock : 0;
}

const products: Product[] = [];
for (let i = 0; i < 10000; i++) {
  const product = new Product('Product' + i, i * 10, i);
  
  // Delete property on some objects - Very bad!
  if (i % 2 === 0) {
    delete (product as any).stock;
  }
  
  products.push(product);
}

console.time('With deletions');
for (const product of products) {
  getTotalValue(product);
}
console.timeEnd('With deletions');
console.log('✗ Deleting properties is very slow!\n');

// Example 6: Good - Use null/undefined instead of delete
console.log('6. GOOD: Use null Instead of Delete');

class BetterProduct {
  constructor(
    public name: string,
    public price: number,
    public stock: number | null
  ) {}
}

const betterProducts: BetterProduct[] = [];
for (let i = 0; i < 10000; i++) {
  const stock = i % 2 === 0 ? null : i;
  betterProducts.push(new BetterProduct('Product' + i, i * 10, stock));
}

function getBetterTotalValue(product: BetterProduct): number {
  return product.stock !== null ? product.price * product.stock : 0;
}

console.time('With null values');
for (const product of betterProducts) {
  getBetterTotalValue(product);
}
console.timeEnd('With null values');
console.log('✓ Using null maintains hidden class!\n');

// Example 7: TypeScript readonly for immutable shapes
console.log('7. GOOD: Readonly Properties for Immutability');

class ImmutablePoint {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
  
  distanceFromOrigin(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

const immutablePoints: ImmutablePoint[] = [];
for (let i = 0; i < 100000; i++) {
  immutablePoints.push(new ImmutablePoint(i, i + 1));
}

console.time('Readonly properties');
for (const point of immutablePoints) {
  point.distanceFromOrigin();
}
console.timeEnd('Readonly properties');
console.log('✓ Immutable objects guarantee stable shapes!\n');

console.log('=== Key Principles ===');
console.log('1. Initialize all properties in constructor');
console.log('2. Always add properties in the same order');
console.log('3. Never delete properties (use null/undefined instead)');
console.log('4. Avoid adding properties after object creation');
console.log('5. Keep object shapes consistent');
console.log('6. Use TypeScript readonly for guaranteed immutability');
console.log('7. TypeScript interfaces ensure shape consistency at compile-time');
