export {};

// console.log('=== TurboFan Optimization Examples ===\n');

// // Example 1: Monomorphic function (easily optimized)
// console.log('1. Monomorphic Function (Optimized)');


// function addNumbers(x: any, y: any): number  {
//   return x + y;
// }

// performance.mark('start-monomorphic');
// // Warm up the function with consistent types
// for (let i = 0; i < 1000000000; i++) {
//   addNumbers(i, i + 1);
// }
// // console.log('Result:', addNumbers('5', '10'));

// for (let i = 0; i < 1000000000; i++) {
//   addNumbers(i, i + 1);
// }



// console.log('Result:', addNumbers(5, 10));
// //  
// performance.mark('end-monomorphic');
// const measure = performance.measure('Monomorphic Function', 'start-monomorphic', 'end-monomorphic');
// console.log(measure);


// Deleting Props
class Point {
  public x;
  public y;


  constructor(x: any, y: any) {
    this.x = x;
    this.y = y;
  }
  
}

performance.mark('start-point-creation');

for(let i = 0; i < 10000000; i++) {
    const p = new Point(1, 2);

  //  p.z = undefined;
 delete p.y
    JSON.stringify(p);
}

performance.mark('end-point-creation');
const measurePointCreation = performance.measure('Point Creation', 'start-point-creation', 'end-point-creation');
console.log(measurePointCreation);
