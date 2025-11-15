/**
 * POLYMORPHIC FUNCTION Examples
 * 
 * Shows how polymorphic call sites affect optimization.
 * Run with: npm run polymorphic
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== Polymorphic Function Performance ===\n');

// Example 1: Type polymorphism with union types
console.log('1. Type Polymorphism with Union Types');

function multiply(a: number | string, b: number): number | string {
  return typeof a === 'number' ? a * b : a.repeat(b);
}

// Warm up with numbers
for (let i = 0; i < 50000; i++) {
  multiply(i, 2);
}

console.log('Number × Number:', multiply(5, 3));

// Now introduce different types - causes deoptimization
console.log('String × Number:', multiply('hello', 3));
console.log('⚠ Function may deoptimize due to type change\n');

// Example 2: Object shape polymorphism with inheritance
console.log('2. Object Shape Polymorphism with Classes');

interface Animal {
  name: string;
  type: string;
  speak(): string;
}

class Dog implements Animal {
  constructor(
    public name: string,
    public type: string = 'dog'
  ) {}
  
  speak(): string {
    return 'Woof!';
  }
}

class Cat implements Animal {
  constructor(
    public name: string,
    public type: string = 'cat'
  ) {}
  
  speak(): string {
    return 'Meow!';
  }
}

class Bird implements Animal {
  constructor(
    public name: string,
    public type: string = 'bird'
  ) {}
  
  speak(): string {
    return 'Tweet!';
  }
}

function makeSound(animal: Animal): string {
  return animal.speak();
}

// Create instances
const dog = new Dog('Rex');
const cat = new Cat('Whiskers');
const bird = new Bird('Tweety');

// Warm up with one type
for (let i = 0; i < 50000; i++) {
  makeSound(dog);
}

console.log('Dog says:', makeSound(dog));

// Introduce polymorphism
console.log('Cat says:', makeSound(cat));
console.log('Bird says:', makeSound(bird));
console.log('⚠ Function becomes polymorphic (handles multiple classes)\n');

// Example 3: Array element polymorphism
console.log('3. Array Element Type with Generics');

function sumElements<T extends number | string>(arr: T[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    sum += typeof val === 'number' ? val : parseInt(val as string, 10) || 0;
  }
  return sum;
}

// Homogeneous array (all numbers)
const numbers: number[] = [1, 2, 3, 4, 5];
console.log('Sum of numbers:', sumElements(numbers));

// Mixed types array
const mixed: (number | string)[] = [1, 2, '3', 4, 5];
console.log('Sum of mixed:', sumElements(mixed));
console.log('⚠ Mixed type arrays prevent full optimization\n');

// Example 4: Best practice - Type guards and separate functions
console.log('4. Best Practice: Type Guards and Separate Functions');

function processNumber(n: number): number {
  return n * n;
}

function processString(s: string): number {
  return s.length;
}

function processObject(o: Record<string, any>): number {
  return Object.keys(o).length;
}

// Type-safe routing with type guards
function processValue(value: number | string | Record<string, any>): number {
  if (typeof value === 'number') return processNumber(value);
  if (typeof value === 'string') return processString(value);
  return processObject(value);
}

console.log('Number:', processValue(5));
console.log('String:', processValue('hello'));
console.log('Object:', processValue({ a: 1, b: 2 }));
console.log('✓ Each helper function stays monomorphic\n');

// Example 5: Using discriminated unions (TypeScript pattern)
console.log('5. Discriminated Unions for Type Safety');

interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}

const circle: Circle = { kind: 'circle', radius: 5 };
const square: Square = { kind: 'square', sideLength: 4 };
const rectangle: Rectangle = { kind: 'rectangle', width: 3, height: 7 };

console.log('Circle area:', calculateArea(circle));
console.log('Square area:', calculateArea(square));
console.log('Rectangle area:', calculateArea(rectangle));
console.log('✓ Discriminated unions provide type safety while handling variants\n');

console.log('=== Key Takeaways ===');
console.log('• TypeScript types help at compile-time, but runtime polymorphism still affects V8');
console.log('• Use discriminated unions for type-safe variant handling');
console.log('• Separate functions for different types keep each monomorphic');
console.log('• Type guards enable safe, optimizable code paths');
