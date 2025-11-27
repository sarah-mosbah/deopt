# Presentation Demo Guide

## Quick Start

```bash
# Run the full demo (clean output)
npm run pres

# Run with V8 optimization traces (advanced)
npm run pres:trace
```

## What the Demo Shows

### 1. **Optimization vs Deoptimization** (3.8x faster)
- **Stable function**: Always receives numbers → TurboFan optimizes it
- **Unstable function**: Mixed types (numbers, strings) → Cannot optimize
- **Key takeaway**: Keep function parameter types consistent

### 2. **Hidden Classes & Inline Caching** (4.2x faster)
- **Monomorphic**: All objects have same shape → Fast property access
- **Megamorphic**: Objects have 5+ different shapes → Slow property access
- **Key takeaway**: Use classes to maintain consistent object shapes

### 3. **Inline Cache (IC) States** (1.97x faster)
- **Monomorphic IC**: Function called with 1 type → Fastest (296ms)
- **Polymorphic IC**: Function called with 2-4 types → Moderate (324ms)
- **Megamorphic IC**: Function called with 5+ types → Slowest (584ms)
- **Key takeaway**: Keep call sites monomorphic - avoid calling same function with many different object types

### 4. **Double vs Triple Equals** (1.1x faster)
- **===**: No type coercion, direct comparison
- **==**: Requires type checking and potential conversion
- **Key takeaway**: Always use === unless you specifically need coercion

### 5. **Array Copying Performance**
- **slice()**: Fastest (27ms)
- **Spread operator**: Nearly as fast (29ms), more readable
- **Array.from()**: Slower (38ms)
- **Manual loop**: Slowest for small arrays (54ms)
- **Key takeaway**: Use `slice()` or spread operator for copying

### 6. **SMI (Small Integer) Optimization** (1.3x faster)
- **SMI range**: -2^30 to 2^30-1 (~-1 billion to +1 billion)
- **In range**: Stored efficiently, no heap allocation
- **Out of range**: Requires heap allocation (slower)
- **Key takeaway**: Negative numbers are fine if they're in SMI range

### 7. **Holey Arrays** (2.6x faster)
- **Packed array**: No holes, fast iteration
- **Holey array**: Has undefined slots, must check prototype chain
- **Once holey, always holey**: V8 remembers the array type
- **Key takeaway**: Always initialize all array elements

### 8. **DELETE vs UNDEFINED vs NULL** (7.8x faster!)
- **delete operator**: Changes hidden class, extremely slow (575ms)
- **undefined**: Keeps hidden class, fast (76ms)
- **null**: Keeps hidden class, fast and semantic (74ms)
- **Key takeaway**: NEVER use delete in performance-critical code
- Use `null` for "intentionally empty", `undefined` for "not yet set"

### 9. **Amdahl's Law** (2.2x speedup)
- Demonstrates that optimizing hot paths (frequently executed code) matters most
- Example shows program with 95% hot path time
- Optimizing hot path gives 2.2x overall speedup
- **Key takeaway**: Profile first, optimize bottlenecks

## Presentation Flow

### Opening (2 min)
1. Run the demo: `npm run pres`
2. Point out the dramatic differences in performance
3. "This is the same algorithm, just written differently"

### Section-by-Section Walkthrough (18-22 min)

For each section:
1. **Explain the concept** (30 sec)
2. **Show the code** in [pres-demo.ts](src/examples/pres-demo.ts) (1 min)
3. **Highlight the results** from terminal output (30 sec)
4. **Key takeaway** (30 sec)

### Deep Dive: Hidden Classes & Delete Operator (7 min)
These are the most dramatic performance impacts - spend extra time here.

**Show this visual explanation:**
```
Monomorphic (Same Shape):
  Point { x: 1, y: 2 }  ──┐
  Point { x: 3, y: 4 }  ──┼──> Same Hidden Class → FAST
  Point { x: 5, y: 6 }  ──┘

Megamorphic (Different Shapes):
  { x: 1, y: 2 }           → Hidden Class A
  { x: 1, y: 2, z: 3 }     → Hidden Class B
  { x: 1, y: 2, color: 'red' } → Hidden Class C
  { x: 1, y: 2, id: 5 }    → Hidden Class D
  { x: 1, y: 2, name: 'p' } → Hidden Class E
                              ⤷ 5+ classes → SLOW (megamorphic)
```

**The delete operator problem:**
```
Object created:    { id: 1, name: 'Product', stock: 5 }  → Hidden Class A
After delete:      { id: 1, name: 'Product' }            → Hidden Class B ⚠️

// V8 creates a NEW hidden class!
// All cached optimizations are invalidated
// Property access becomes 7-8x slower!

Instead, use null:
Object created:    { id: 1, name: 'Product', stock: 5 }    → Hidden Class A
Set to null:       { id: 1, name: 'Product', stock: null } → Hidden Class A ✓
// Same hidden class! Optimizations preserved!
```

### Advanced Demo (Optional - 3 min)
If your audience is technical, run with traces:
```bash
npm run pres:trace
```

Point out messages like:
- `[marking <function> for optimized recompilation]`
- `[optimized <function> (target TURBOFAN)]`
- `[deoptimizing ...]`

### Closing (2 min)
1. Show the summary principles
2. Emphasize: "Profile first, optimize hot paths"
3. Share the repo for hands-on experimentation

## Tips for Success

### Do's ✓
- **Pre-run the demo** before presenting (warm up your laptop)
- **Keep terminal font large** (zoom in)
- **Pause after each section** to let numbers sink in
- **Use the Amdahl's Law section** to tie everything together
- **Encourage questions** throughout

### Don'ts ✗
- Don't get bogged down in exact millisecond comparisons
- Don't try to explain V8 internals unless asked
- Don't skip the summary at the end
- Don't optimize without profiling first (practice what you preach!)

## Common Questions & Answers

**Q: "Should I always optimize like this?"**
A: No! These principles matter for hot paths (code that runs millions of times). Write clean code first, profile, then optimize bottlenecks.

**Q: "Does TypeScript help with optimization?"**
A: TypeScript helps at compile-time by enforcing consistent types. But V8 optimizes at runtime based on actual values. TypeScript can't prevent runtime deoptimization from external data.

**Q: "What about modern frameworks like React?"**
A: These principles still apply to your business logic and data processing. Frameworks handle their own optimization. Focus on your hot paths (e.g., list rendering, state updates, calculations).

**Q: "How do I find hot paths in my code?"**
A: Use Chrome DevTools Profiler, Node.js `--prof` flag, or tools like `clinic.js`. Look for functions that consume the most CPU time.

**Q: "Is the performance difference worth the readability trade-off?"**
A: For 99% of code, no. But for that 1% hot path that runs millions of times per second, absolutely yes. Always measure first.

**Q: "When should I use null vs undefined?"**
A: Both are fast (unlike delete). Use `null` for "intentionally empty" (e.g., optional field explicitly cleared). Use `undefined` for "not yet set" (e.g., optional field never initialized). The performance is identical - it's about semantic clarity.

**Q: "I've been using delete for years - should I rewrite all my code?"**
A: No! Only optimize hot paths that are proven bottlenecks. If code runs once during initialization, delete is fine. But in loops that run millions of times? Definitely switch to null/undefined.

## Code Snippets for Slides

### Good vs Bad: Hidden Classes
```typescript
// ❌ BAD - Different property orders
const p1 = { x: 1, y: 2 };
const p2 = { y: 2, x: 1 }; // Different hidden class!

// ✅ GOOD - Use classes
class Point {
  constructor(public x: number, public y: number) {}
}
```

### Good vs Bad: Monomorphic Functions
```typescript
// ❌ BAD - Accepts any type
function add(a: any, b: any) {
  return a + b;
}
add(1, 2);        // Numbers
add('a', 'b');    // Strings → Deoptimized!

// ✅ GOOD - Consistent types
function addNumbers(a: number, b: number): number {
  return a + b;
}
addNumbers(1, 2); // Always numbers → Optimized!
```

### Good vs Bad: Inline Cache (IC) States
```typescript
interface Animal {
  name: string;
  makeSound(): string;
}

function processAnimal(animal: Animal): string {
  return animal.name + ': ' + animal.makeSound();
}

// ❌ BAD - Megamorphic IC (6+ types)
const animals: Animal[] = [
  new Dog('Fido'),    // Type 1
  new Cat('Whiskers'), // Type 2
  new Bird('Tweety'),  // Type 3
  new Horse('Spirit'), // Type 4
  new Cow('Bessie'),   // Type 5
  new Sheep('Dolly'),  // Type 6 → Megamorphic!
];
animals.forEach(a => processAnimal(a)); // Slow!

// ✅ GOOD - Monomorphic IC (1 type)
const dogs: Animal[] = [
  new Dog('Fido'),
  new Dog('Rex'),
  new Dog('Buddy'),
];
dogs.forEach(d => processAnimal(d)); // Fast!

// ⚠️ ACCEPTABLE - Polymorphic IC (2-4 types)
const pets: Animal[] = [
  new Dog('Fido'),
  new Cat('Whiskers'),
  new Bird('Tweety'),
];
pets.forEach(p => processAnimal(p)); // Moderate speed
```

### Good vs Bad: Holey Arrays
```typescript
// ❌ BAD - Creates holes
const arr = new Array(100);
arr[0] = 1;
arr[50] = 2; // Holes between 0 and 50!

// ✅ GOOD - Fill immediately
const arr = new Array(100).fill(0);
// OR
const arr = Array.from({ length: 100 }, (_, i) => i);
```

### Good vs Bad: Property Removal
```typescript
// ❌ BAD - Delete changes hidden class (VERY SLOW!)
interface Product {
  name: string;
  price: number;
  stock: number;
}
const product = { name: 'Widget', price: 10, stock: 5 };
delete product.stock; // 7-8x slower!

// ✅ GOOD - Use null (keeps hidden class)
interface Product {
  name: string;
  price: number;
  stock: number | null;
}
const product = { name: 'Widget', price: 10, stock: 5 };
product.stock = null; // Fast! And semantic: "intentionally empty"

// ✅ ALSO GOOD - Use undefined
interface Product {
  name: string;
  price: number;
  stock?: number;
}
const product = { name: 'Widget', price: 10, stock: 5 };
product.stock = undefined; // Fast! Means "not set"
```

## Additional Resources

After your presentation, share:
- This repo: Your GitHub URL
- [V8 Blog](https://v8.dev/blog)
- [Understanding V8's Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)
- Your comprehensive [README.md](README.md)

Good luck with your presentation! 🚀
