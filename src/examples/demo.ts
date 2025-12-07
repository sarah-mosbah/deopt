export {};

// console.log('=== TurboFan Optimization Examples ===\n');

// // Example 1: Monomorphic function (easily optimized)
console.log('1. Monomorphic Function (Optimized)');


function addNumbers(x: any, y: any): number  {
  return x + y;
}

performance.mark('start-monomorphic');
// Warm up the function with consistent types
for (let i = 0; i < 10000000; i++) {
  addNumbers(i, i + 1);
}

//addNumbers('5', '10');

for (let i = 0; i < 10000000; i++) {
  addNumbers(i, i + 1);
 // addNumbers('5', '10');
}

 
performance.mark('end-monomorphic');
const measure = performance.measure('Monomorphic Function', 'start-monomorphic', 'end-monomorphic');
console.log(measure);


// Deleting Props
// class Point {
//   public x;
//   public y;


//   constructor(x: any, y: any) {
//     this.x = x;
//     this.y = y;
//   }
  
// }

// performance.mark('start-point-creation');

// for(let i = 0; i < 10000000; i++) {
//     const p = new Point(1, 2);

//   //  p.z = undefined;
//  delete p.y
//     JSON.stringify(p);
// }

// performance.mark('end-point-creation');
// const measurePointCreation = performance.measure('Point Creation', 'start-point-creation', 'end-point-creation');
// console.log(measurePointCreation);



// Example hidden class
console.log('\n=== Hidden Class and Deoptimization Examples ===\n');

// Example 1: Consistent object shape (optimized)
console.log('1. Consistent Object Shape (Optimized)');

// interface Point {
//   x: number;
//   y: number;
// }

// function calculateDistance(point: Point): number {
//   return Math.sqrt(point.x * point.x + point.y * point.y);
// }

// // // =============================================================================
// // // Example 1: MONOMORPHIC - All points have the SAME hidden class
// // // =============================================================================
// console.log('1. MONOMORPHIC - Consistent Object Shape');

// const monomorphicPoints: Point[] = [];
// for (let i = 0; i < 100000; i++) {
//   // All created exactly the same way - same hidden class
//   monomorphicPoints.push({ x: i, y: i + 1 });
// }

// // // Warm-up phase (let JIT optimize)
// let warmup1 = 0;
// for (let i = 0; i < 1000000; i++) {
//   warmup1 += calculateDistance(monomorphicPoints[i % monomorphicPoints.length]);
// }

// // // Actual measurement
// performance.mark('start-hidden-class-example-monomorphic');

// let sum1 = 0;
// for (let i = 0; i < 10000000; i++) {
//   sum1 += calculateDistance(monomorphicPoints[i % monomorphicPoints.length]);
// }

// performance.mark('end-hidden-class-example-monomorphic');
// // const measure = performance.measure('Monomorphic (1 shape)', 'start-hidden-class-example-monomorphic', 'end-hidden-class-example-monomorphic');
// // console.log(measure);

// // // =============================================================================
// // // Example 2: POLYMORPHIC - 4 different hidden classes
// // // =============================================================================
// console.log('2. POLYMORPHIC - 4 Different Object Shapes');

// const polymorphicPoints: Point[] = [];
// for (let i = 0; i < 100000; i++) {
//   let p: Point;

//   switch (i % 4) {
//     case 0:
//       p = { x: i, y: i + 1 };           // Shape 1: x first, y second
//       break;
//     case 1:
//       p = { y: i + 1, x: i };           // Shape 2: y first, x second
//       break;
//     case 2:
//       const temp2: any = {};            // Shape 3: empty, then add x, then y
//       temp2.x = i;
//       temp2.y = i + 1;
//       p = temp2;
//       break;
//     default:
//       const temp3: any = {};            // Shape 4: empty, then add y, then x
//       temp3.y = i + 1;
//       temp3.x = i;
//       p = temp3;
//       break;
//   }
  
//   polymorphicPoints.push(p);
// }

// let warmup2 = 0;
// for (let i = 0; i < 1000000; i++) {
//   warmup2 += calculateDistance(polymorphicPoints[i % polymorphicPoints.length]);
// }

// performance.mark('start-hidden-class-example-polymorphic');
// console.time('Polymorphic (4 shapes)');
// let sum2 = 0;
// for (let i = 0; i < 10000000; i++) {
//   sum2 += calculateDistance(polymorphicPoints[i % polymorphicPoints.length]);
// }

// performance.mark('end-hidden-class-example-polymorphic');
// const measure2 = performance.measure('Polymorphic (4 shapes)', 'start-hidden-class-example-polymorphic', 'end-hidden-class-example-polymorphic');
// console.log(measure2);

// // =============================================================================
// // Example 3: MEGAMORPHIC - 10+ different hidden classes
// // =============================================================================
// console.log('3. MEGAMORPHIC - 10+ Different Object Shapes');

// const megamorphicPoints: Point[] = [];
// for (let i = 0; i < 100000; i++) {
//   let p: any;
  
//   switch (i % 10) {
//     case 0:
//       p = { x: i, y: i + 1 };                    // Shape 1
//       break;
//     case 1:
//       p = { y: i + 1, x: i };                    // Shape 2
//       break;
//     case 2:
//       p = {};
//       p.x = i;
//       p.y = i + 1;                               // Shape 3
//       break;
//     case 3:
//       p = {};
//       p.y = i + 1;
//       p.x = i;                                   // Shape 4
//       break;
//     case 4:
//       p = { x: i, y: i + 1, z: 0 };             // Shape 5 (extra property)
//       break;
//     case 5:
//       p = { y: i + 1, x: i, z: 0 };             // Shape 6
//       break;
//     case 6:
//       p = Object.create(null);                   // Shape 7 (null prototype)
//       p.x = i;
//       p.y = i + 1;
//       break;
//     case 7:
//       p = { x: i };                              // Shape 8 (missing y)
//       p.y = i + 1;
//       break;
//     case 8:
//       p = { y: i + 1 };                          // Shape 9 (missing x)
//       p.x = i;
//       break;
//     default:
//       p = new (class {                           // Shape 10 (class instance)
//         x: number;
//         y: number;
//         constructor(x: number, y: number) {
//           this.x = x;
//           this.y = y;
//         }
//       })(i, i + 1);
//       break;
//   }
  
//   megamorphicPoints.push(p);
// }

// // Warm-up
// let warmup3 = 0;
// for (let i = 0; i < 1000000; i++) {
//   warmup3 += calculateDistance(megamorphicPoints[i % megamorphicPoints.length]);
// }

// // Measurement
// performance.mark('start-hidden-class-example-megamorphic');
// let sum3 = 0;
// for (let i = 0; i < 10000000; i++) {
//   sum3 += calculateDistance(megamorphicPoints[i % megamorphicPoints.length]);
// }
// performance.mark('end-hidden-class-example-megamorphic');
// const measure3 = performance.measure('Megamorphic (10 shapes)', 'start-hidden-class-example-megamorphic', 'end-hidden-class-example-megamorphic');
// console.log(measure3);