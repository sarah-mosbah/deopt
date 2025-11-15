/**
 * INLINE CACHE Examples
 * 
 * Demonstrates how V8's inline caching works and when it breaks.
 * Run with: npm run inline-cache
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== Inline Cache (IC) Examples ===\n');

// Example 1: Monomorphic IC (best case)
console.log('1. MONOMORPHIC IC - Best Performance');

class Rectangle {
  constructor(
    public width: number,
    public height: number
  ) {}
  
  area(): number {
    return this.width * this.height;
  }
}

function calculateArea(shape: Rectangle): number {
  return shape.area();
}

// Create many rectangles
const rectangles: Rectangle[] = [];
for (let i = 0; i < 10000; i++) {
  rectangles.push(new Rectangle(i, i + 1));
}

console.time('Monomorphic IC');
for (const rect of rectangles) {
  calculateArea(rect);
}
console.timeEnd('Monomorphic IC');
console.log('✓ IC caches single class - very fast!\n');

// Example 2: Polymorphic IC (moderate performance)
console.log('2. POLYMORPHIC IC - Moderate Performance');

interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  
  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Triangle implements Shape {
  constructor(
    public base: number,
    public height: number
  ) {}
  
  area(): number {
    return 0.5 * this.base * this.height;
  }
}

function calculatePolymorphicArea(shape: Shape): number {
  return shape.area();
}

const shapes: Shape[] = [];
for (let i = 0; i < 10000; i++) {
  if (i % 3 === 0) {
    shapes.push(new Rectangle(i, i + 1));
  } else if (i % 3 === 1) {
    shapes.push(new Circle(i));
  } else {
    shapes.push(new Triangle(i, i + 1));
  }
}

console.time('Polymorphic IC');
for (const shape of shapes) {
  calculatePolymorphicArea(shape);
}
console.timeEnd('Polymorphic IC');
console.log('⚠ IC handles 3 classes - slower than monomorphic\n');

// Example 3: Property access IC
console.log('3. Property Access Inline Cache');

interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
}

const userList: UserData[] = [];
for (let i = 0; i < 10000; i++) {
  userList.push({
    id: i,
    name: 'User' + i,
    email: 'user' + i + '@example.com',
    age: 20 + (i % 50)
  });
}

function getUserEmail(user: UserData): string {
  return user.email; // Property access will be cached
}

console.time('Property access IC');
for (const user of userList) {
  getUserEmail(user);
}
console.timeEnd('Property access IC');
console.log('✓ Property offset cached for fast access\n');

// Example 4: Breaking IC with different object shapes
console.log('4. Breaking Property Access IC');

type MixedUser = UserData & Record<string, any>;

const mixedUsers: MixedUser[] = [];
for (let i = 0; i < 10000; i++) {
  if (i % 2 === 0) {
    // Shape 1: id, name, email, age
    mixedUsers.push({
      id: i,
      name: 'User' + i,
      email: 'user' + i + '@example.com',
      age: 20 + (i % 50)
    });
  } else {
    // Shape 2: id, email, name, age (different order!)
    mixedUsers.push({
      id: i,
      email: 'user' + i + '@example.com',
      name: 'User' + i,
      age: 20 + (i % 50)
    });
  }
}

console.time('Broken property IC');
for (const user of mixedUsers) {
  getUserEmail(user);
}
console.timeEnd('Broken property IC');
console.log('⚠ Different shapes slow down property access\n');

// Example 5: Method call IC
console.log('5. Method Call Inline Cache');

abstract class Animal {
  constructor(public name: string) {}
  abstract speak(): string;
}

class Dog extends Animal {
  speak(): string {
    return 'Woof!';
  }
}

class Cat extends Animal {
  speak(): string {
    return 'Meow!';
  }
}

function makeAnimalSpeak(animal: Animal): string {
  return animal.speak();
}

// Monomorphic call site
const dogs: Dog[] = [];
for (let i = 0; i < 10000; i++) {
  dogs.push(new Dog('Dog' + i));
}

console.time('Monomorphic method call');
for (const dog of dogs) {
  makeAnimalSpeak(dog);
}
console.timeEnd('Monomorphic method call');

// Polymorphic call site
const animals: Animal[] = [];
for (let i = 0; i < 10000; i++) {
  if (i % 2 === 0) {
    animals.push(new Dog('Dog' + i));
  } else {
    animals.push(new Cat('Cat' + i));
  }
}

console.time('Polymorphic method call');
for (const animal of animals) {
  makeAnimalSpeak(animal);
}
console.timeEnd('Polymorphic method call');
console.log('⚠ Method calls also benefit from monomorphic IC\n');

// Example 6: TypeScript generics and IC
console.log('6. Generics with Consistent Types');

interface Measurable {
  measure(): number;
}

class Length implements Measurable {
  constructor(private value: number) {}
  measure(): number {
    return this.value;
  }
}

class Weight implements Measurable {
  constructor(private value: number) {}
  measure(): number {
    return this.value;
  }
}

function getTotalMeasurement<T extends Measurable>(items: T[]): number {
  let total = 0;
  for (const item of items) {
    total += item.measure();
  }
  return total;
}

// Monomorphic - all same type
const lengths: Length[] = [];
for (let i = 0; i < 10000; i++) {
  lengths.push(new Length(i));
}

console.time('Generic monomorphic');
getTotalMeasurement(lengths);
console.timeEnd('Generic monomorphic');

// Polymorphic - mixed types
const measurements: Measurable[] = [];
for (let i = 0; i < 10000; i++) {
  measurements.push(i % 2 === 0 ? new Length(i) : new Weight(i));
}

console.time('Generic polymorphic');
getTotalMeasurement(measurements);
console.timeEnd('Generic polymorphic');
console.log('✓ Generics work well with monomorphic types\n');

console.log('=== IC States Summary ===');
console.log('Monomorphic:  Caches 1 type/class     → Fastest');
console.log('Polymorphic:  Caches 2-4 types/classes → Slower');
console.log('Megamorphic:  5+ types/classes        → Slowest (no cache)');
console.log('\n=== TypeScript Benefits ===');
console.log('• Interfaces enforce consistent shapes at compile-time');
console.log('• Generics maintain type safety while allowing reuse');
console.log('• Abstract classes create predictable inheritance hierarchies');
console.log('• Type system helps avoid accidental polymorphism');
