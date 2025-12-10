/**
 * POLYMORPHIC FUNCTION Examples
 * 
 * Shows how polymorphic call sites affect optimization.
 * Run with: npm run polymorphic
 */

// Make this file a module to avoid global scope conflicts
export {};






function deepRead(obj: any) {
  return obj.a.b.c;
}


// Create ONE stable shape
const stableMonomorphic = {
  a: {
    b: {
      c: 123
    }
  },
  x: 1
};

for (let i = 0; i < 50000; i++) {
  deepRead(stableMonomorphic);
}

performance.mark('start-mono');


for (let i = 0; i < 50000; i++) {
  deepRead(stableMonomorphic);
}

performance.mark('end-mono');

console.log(performance.measure('Monomorphic', 'start-mono', 'end-mono'));



const shape1 = { a: { b: { c: 1 } }, x: 1 };

const shape2 = { a: { b: { c: 2, d: 10 } }, y: 2 };

const shape3 = { a: { b: { c: 3 } }, z: 3, extra: true };

const shapes = [shape1, shape2, shape3];


performance.mark('start-poly');

for (let i = 0; i < 50000; i++) {
  deepRead(shapes[i % shapes.length]);
}

performance.mark('end-poly');

console.log(performance.measure('Polymorphic', 'start-poly', 'end-poly'));


function makeShape(i: number) {
  return {
    a: {
      b: {
        c: i,
        ["d" + i]: i * 2
      }
    },
    extra: i % 2 === 0 ? i : undefined,
    ["x" + i]: i * 5
  };
}

const objs = [];
for (let i = 0; i < 10000; i++) {
  objs.push(makeShape(i))
}
performance.mark('start-mega');

for (let i = 0; i < 50000; i++) {
  deepRead(objs[i % objs.length]);
}

performance.mark('end-mega');
console.log(performance.measure('Megamorphic', 'start-mega', 'end-mega'));
