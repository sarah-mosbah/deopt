/**
 * OPTIMIZATION EXAMPLES
 * 
 * This file demonstrates how V8's TurboFan compiler optimizes TypeScript code.
 * Run with: npm run opt
 */

// Make this file a module to avoid global scope conflicts
export {};

console.log('=== TurboFan Optimization Examples ===\n');

// Example 1: Monomorphic function (easily optimized)
console.log('1. Monomorphic Function (Optimized)');


function addNumbers(x: any, y: any): number  {
  return x + y;
}

performance.mark('start-monomorphic');
// Warm up the function with consistent types
for (let i = 0; i < 1000000000; i++) {
  addNumbers(i, i + 1);
}
// console.log('Result:', addNumbers('5', '10'));

for (let i = 0; i < 1000000000; i++) {
  addNumbers(i, i + 1);
}



console.log('Result:', addNumbers(5, 10));
//  
performance.mark('end-monomorphic');
const measure = performance.measure('Monomorphic Function', 'start-monomorphic', 'end-monomorphic');
console.log(measure);


// console.log('This function will be optimized because it always receives numbers\n');

// Example 2: Array iteration with stable shapes
// console.log('2. Array Operations (Optimized)');

// function sumArray(arr: number[]): number {
//   let sum = 0;
//   for (let i = 0; i < arr.length; i++) {
//     sum += arr[i];
//   }
//   return sum;
// }

// const numbers: number[] = new Array(10000).fill(0).map((_, i) => i);
// for (let i = 0; i < 1000; i++) {
//   sumArray(numbers);
// }

// console.log('Sum:', sumArray([1, 2, 3, 4, 5]));
// console.log('Optimized due to consistent array structure and types\n');

// // Example 3: Object with stable hidden class
// console.log('3. Stable Hidden Class (Optimized)');

// class Point {
//   public x: number;
//   public y: number;

//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
  
//   distance(): number {
//     return Math.sqrt(this.x * this.x + this.y * this.y);
//   }
// }

// function calculateDistance(point: Point): number {
//   return point.distance();
// }

// // Create many points with the same structure
// for (let i = 0; i < 100000; i++) {
//   const p = new Point(i, i + 1);
//   calculateDistance(p);
// }

// console.log('Distance:', calculateDistance(new Point(3, 4)));
// console.log('Optimized because all Point objects have the same shape\n');

// // Example 4: Inline caching with interfaces
// console.log('4. Property Access (Inline Cached)');

// interface User {
//   name: string;
//   age: number;
//   city: string;
// }

// const user: User = { name: 'Alice', age: 30, city: 'NYC' };

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
