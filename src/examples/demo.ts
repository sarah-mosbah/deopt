// ============================================================================
// V8 OPTIMIZATION DEMO WITH PERFORMANCE INDICATORS (TYPESCRIPT VERSION)
// ============================================================================

interface BenchmarkResult {
  name: string;
  time: number;
}

function runBenchmark(
  name: string,
  fn: () => void,
  iterations: number = 1
): BenchmarkResult {
  // Warmup
  fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const end = performance.now();

  return { name, time: end - start };
}

function compare(results: BenchmarkResult[]): void {
  const baseline = results[0].time;

  console.log("\n=== PERFORMANCE SUMMARY ===\n");

  for (const r of results) {
    const ratio = r.time / baseline;

    const slower =
      ratio === 1
        ? ""
        : ratio > 1
        ? `(+${((ratio - 1) * 100).toFixed(0)}% slower)`
        : `(${((1 - ratio) * 100).toFixed(0)}% faster)`;

    let stars = "";
    if (ratio <= 1.3) stars = "★★★★★";
    else if (ratio <= 2) stars = "★★★★☆";
    else if (ratio <= 3) stars = "★★★☆☆";
    else if (ratio <= 5) stars = "★★☆☆☆";
    else stars = "★☆☆☆☆";

    console.log(
      `${r.name.padEnd(20)} ${r.time.toFixed(2).padStart(10)} ms   ${stars}  ${slower}`
    );
  }

  console.log("");
}

// ============================================================================
// 1. Simulated Optimization vs Deoptimization Using Stable/Mixed Types
// ============================================================================

console.log("\n1) Optimized vs Deoptimized (Simulated)\n");

function addFast(a: number, b: number): number {
  return a + b;
}

function addSlow(a: any, b: any): any {
  return a + b;
}

const fast = runBenchmark("Fast (numbers only)", () => {
  let sum = 0;
  for (let i = 0; i < 4_000_000; i++) sum += addFast(i, i + 1);
});

const slow = runBenchmark("Slow (mixed types)", () => {
  for (let i = 0; i < 4_000_000; i++) {
    if (i % 3 === 0) addSlow(i, i + 1);
    else if (i % 3 === 1) addSlow("x", "y");
    else addSlow(i.toString(), "z");
  }
});

compare([fast, slow]);

// ============================================================================
// 2. Hidden Classes: Monomorphic → Polymorphic → Megamorphic
// ============================================================================

console.log("2) Hidden Class Stability (Mono vs Poly vs Mega)\n");

interface Point {
  x: number;
  y: number;
  z?: number;
}

function dist(p: Point): number {
  return p.x * p.x + p.y * p.y;
}

const monoPoint: Point = { x: 1, y: 2 };

const polyPoints: Point[] = [
  { x: 1, y: 2 },
  { y: 2, x: 1 }, // different property order
  (() => {
    const o: any = {};
    o.x = 1;
    o.y = 2;
    return o as Point;
  })(),
];

const megaPoints: Point[] = [
  { x: 1, y: 2 },
  { y: 2, x: 1 },
  (() => {
    const o: any = {};
    o.x = 1;
    o.y = 2;
    return o;
  })(),
  { x: 1, y: 2, z: 0 },
  Object.create(null),
  new (class {
    x = 1;
    y = 2;
  })(),
];

const monoResult = runBenchmark("Monomorphic", () => {
  for (let i = 0; i < 3_000_000; i++) dist(monoPoint);
});

const polyResult = runBenchmark("Polymorphic", () => {
  for (let i = 0; i < 3_000_000; i++)
    dist(polyPoints[i % polyPoints.length]);
});

const megaResult = runBenchmark("Megamorphic", () => {
  for (let i = 0; i < 3_000_000; i++)
    dist(megaPoints[i % megaPoints.length]);
});

compare([monoResult, polyResult, megaResult]);

// ============================================================================
// 3. DELETE vs UNDEFINED
// ============================================================================

console.log("3) delete vs undefined\n");

interface Product {
  price: number;
  stock?: number;
}

function calcValue(p: Product): number {
  return (p.stock ?? 0) * p.price;
}

const undefinedResult = runBenchmark("Undefined (stable)", () => {
  for (let i = 0; i < 600_000; i++) {
    const p: Product = { price: i, stock: undefined };
    calcValue(p);
  }
});

const deleteResult = runBenchmark("Delete (unstable)", () => {
  for (let i = 0; i < 600_000; i++) {
    const p: any = { price: i, stock: i };
    delete p.stock;
    calcValue(p);
  }
});

compare([undefinedResult, deleteResult]);

// ============================================================================
// 4. Dense vs Holey vs Sparse Arrays (FIXED REALISTIC BENCHMARK)
// ============================================================================

console.log("4) Dense vs Holey vs Sparse Arrays\n");

// Dense array (FAST ELEMENTS)
const denseArray: number[] = Array.from({ length: 100_000 }, (_, i) => i);

// Holey array — has actual HOLES
const holeyArray: number[] = new Array(100_000);
for (let i = 0; i < 100_000; i += 2) holeyArray[i] = i;

// Sparse array (DICTIONARY MODE)
const sparseArray: number[] = [];
sparseArray[0] = 1;
sparseArray[50_000] = 2;
sparseArray[99_999] = 3;

// Correct sum functions (NO branching!)
function sumDense(arr: number[]) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
  }
  return s;
}

function sumHoley(arr: number[]) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i] ?? 0; // force reading holes
  }
  return s;
}

function sumSparse(arr: number[]) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i] ?? 0; // dictionary mode
  }
  return s;
}

const denseTime = runBenchmark("Dense array", () => sumDense(denseArray));
const holeyTime = runBenchmark("Holey array", () => sumHoley(holeyArray));
const sparseTime = runBenchmark("Sparse array", () => sumSparse(sparseArray));

compare([denseTime, holeyTime, sparseTime]);

// ============================================================================
// 5. Strict vs Loose Equality
// ============================================================================

console.log("5) Strict vs Loose Equality\n");

const mixedValues: any[] = [];
for (let i = 0; i < 200_000; i++)
  mixedValues.push(i % 4 === 0 ? 0 : i % 4 === 1 ? "0" : null);

const strictEq = runBenchmark("Strict ===", () => {
  let c = 0;
  for (let i = 0; i < mixedValues.length; i++)
    if (mixedValues[i] === 0) c++;
});

const looseEq = runBenchmark("Loose ==", () => {
  let c = 0;
  for (let i = 0; i < mixedValues.length; i++)
    if (mixedValues[i] == 0) c++;
});

compare([strictEq, looseEq]);

console.log("=== END OF DEMO ===\n");
