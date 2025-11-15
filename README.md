# TurboFan Optimization & Deoptimization Demo (TypeScript)

A comprehensive demonstration project showing how V8's TurboFan optimizing compiler works with TypeScript, including optimization techniques and common deoptimization pitfalls.

## 📚 Table of Contents

- [What is TurboFan?](#what-is-turbofan)
- [Installation](#installation)
- [Running Examples](#running-examples)
- [Examples Overview](#examples-overview)
- [TypeScript & V8 Optimization](#typescript--v8-optimization)
- [Key Concepts](#key-concepts)
- [Best Practices](#best-practices)
- [Understanding the Output](#understanding-the-output)

## 🚀 What is TurboFan?

**TurboFan** is V8's optimizing compiler (used in Node.js and Chrome). It compiles frequently-executed JavaScript code into highly optimized machine code. Understanding how it works helps you write faster JavaScript.

### The Optimization Pipeline

1. **Ignition** (Interpreter) - Executes code initially
2. **Profiling** - Collects type information during execution
3. **TurboFan** - Optimizes hot functions based on profiled data
4. **Deoptimization** - Falls back to interpreter if assumptions break

## 📦 Installation

```bash
# Navigate to the project directory
cd deopt

# Install dependencies
npm install

# Build TypeScript files
npm run build
```

The build process compiles TypeScript files from `src/` to JavaScript in `dist/`.

## ▶️ Running Examples

### Quick Start

```bash
# Build and run individual examples
npm run opt           # Optimization examples
npm run deopt         # Deoptimization examples
npm run monomorphic   # Monomorphic vs polymorphic
npm run polymorphic   # Polymorphic performance
npm run hidden-class  # Hidden class examples
npm run inline-cache  # Inline cache examples
npm run advanced      # V8 intrinsics (advanced)

# Run all main examples
npm run all

# Development mode (faster, no build)
npm run dev:opt       # Run optimization with ts-node
npm run dev:deopt     # Run deoptimization with ts-node
```

### Advanced Tracing

For detailed V8 traces:

```bash
# Use the trace utility
npm run trace optimization.js
npm run trace deoptimization.js

# Or run directly with V8 flags (after building)
node --trace-opt --trace-deopt dist/examples/optimization.js
```

### Development Workflow

```bash
# Watch mode - automatically recompile on changes
npm run build:watch

# Clean build output
npm run clean

# Build from scratch
npm run build
```

## 📋 Examples Overview

All examples are written in TypeScript with proper type annotations. The TypeScript compiler ensures type safety at compile-time, but optimization/deoptimization behavior happens at runtime in V8.

### 1. **optimization.ts** - Good Practices ✅

Demonstrates code that TurboFan optimizes well:
- Monomorphic functions (same types)
- Stable array operations  
- Consistent object shapes (hidden classes)
- Inline caching
- Small integer (SMI) operations
- Typed arrays
- Generic functions with consistent usage

**Key Takeaway**: TypeScript helps enforce consistent types, but runtime behavior determines optimization.

### 2. **deoptimization.ts** - Common Pitfalls ⚠️

Shows what causes deoptimization:
- Type changes (number → string) even when bypassing TypeScript
- Hidden class modifications
- Dynamic property additions
- Arrays with holes
- Array element type changes
- Try-catch blocks
- Modern TypeScript features that transpile well

**Key Takeaway**: TypeScript types are erased at runtime; external data can still cause deoptimization.

### 3. **monomorphic.ts** - IC States

Compares performance across different inline cache states:
- **Monomorphic** (1 type) - Fastest ⚡
- **Polymorphic** (2-4 types) - Moderate 🐌
- **Megamorphic** (5+ types) - Slowest 🐢
- Type-safe monomorphic patterns with TypeScript

**Key Takeaway**: Use TypeScript interfaces to enforce consistent shapes at compile-time.

### 4. **polymorphic.ts** - Type Handling

Shows how to handle multiple types efficiently:
- Union types and runtime polymorphism
- Type guards for type-safe routing
- Discriminated unions
- Best practices for multi-type handling

**Key Takeaway**: Use discriminated unions and type guards for type-safe, optimizable code.

### 5. **hidden-class.ts** - Object Shapes

Demonstrates how object structure affects performance:
- Property initialization order
- Dynamic property addition
- Property deletion (very slow!)
- Using `null` vs `delete`
- Readonly properties for immutability

**Key Takeaway**: Initialize all properties in constructor; TypeScript classes help maintain consistent shapes.

### 6. **inline-cache.ts** - IC Performance

Shows how inline caching speeds up property access:
- Monomorphic property access
- Polymorphic property access
- Method call caching
- Generics with consistent types
- IC state transitions

**Key Takeaway**: TypeScript interfaces and abstract classes create predictable, optimizable patterns.

### 7. **advanced.ts** - V8 Intrinsics

Uses V8's internal functions to control optimization:
- Manual optimization control
- Optimization status checking
- Forced deoptimization
- TypeScript class method optimization
- Generic function optimization

**Key Takeaway**: V8 intrinsics work on transpiled JavaScript; use `@ts-ignore` for % syntax.

## 🎯 Key Concepts

### TypeScript & V8 Optimization

**Important**: TypeScript types are erased at compilation. V8 optimization happens at runtime based on actual values, not TypeScript types.

```typescript
// TypeScript says this is safe:
function add(a: number, b: number): number {
  return a + b;
}

// But at runtime, if you bypass types:
const anyAdd = add as any;
anyAdd("hello", "world"); // Causes deoptimization!
```

**TypeScript Benefits for Optimization**:
- ✅ Enforces consistent types at compile-time
- ✅ Interfaces ensure consistent object shapes
- ✅ Classes create predictable hidden classes
- ✅ Generics with constraints maintain type safety
- ✅ Readonly properties prevent accidental mutations
- ❌ Does NOT prevent runtime type changes from external data

### Hidden Classes (Maps)

V8 creates hidden classes (also called "maps" or "shapes") for objects. Objects with the same structure share the same hidden class, enabling optimizations.

**Good (TypeScript):**
```typescript
class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
}
```

**Bad:**
```typescript
interface Point { x: number; y: number; }
const p1: Point = { x: 1, y: 2 };
const p2: Point = { y: 2, x: 1 };  // Different order = different hidden class!
```

### Inline Caching (IC)

V8 caches property access locations and method calls:

- **Monomorphic**: One type/shape → Very fast
- **Polymorphic**: 2-4 types/shapes → Moderate
- **Megamorphic**: 5+ types/shapes → Slow (cache abandoned)

**TypeScript Advantage**: Interfaces and abstract classes help maintain monomorphic call sites.

### Small Integers (SMI)

Integers in range `-2^30` to `2^30-1` are stored efficiently as SMIs (Small Integers), not heap-allocated objects.

### Type Feedback

V8 collects type information during execution and uses it for optimization. Changing types invalidates these assumptions.

**TypeScript**: Helps prevent accidental type changes but can't control external data.

## ✅ Best Practices

### DO:

1. ✅ **Use TypeScript classes for consistent shapes**
   ```typescript
   class User {
     constructor(
       public name: string,
       public email: string | null = null
     ) {}
   }
   ```

2. ✅ **Keep functions monomorphic with proper typing**
   ```typescript
   function add(a: number, b: number): number {
     return a + b;
   }
   ```

3. ✅ **Use interfaces for consistent object shapes**
   ```typescript
   interface Point { x: number; y: number; }
   const p1: Point = { x: 1, y: 2 };
   const p2: Point = { x: 3, y: 4 };  // Same order
   ```

4. ✅ **Use typed arrays for numeric data**
   ```typescript
   const arr = new Float64Array(1000);
   ```

5. ✅ **Use discriminated unions for type-safe variants**
   ```typescript
   type Shape = 
     | { kind: 'circle'; radius: number }
     | { kind: 'square'; side: number };
   
   function area(shape: Shape): number {
     switch (shape.kind) {
       case 'circle': return Math.PI * shape.radius ** 2;
       case 'square': return shape.side ** 2;
     }
   }
   ```

6. ✅ **Use readonly for immutable properties**
   ```typescript
   class Point {
     constructor(
       public readonly x: number,
       public readonly y: number
     ) {}
   }
   ```

7. ✅ **Initialize all properties in constructor**
   ```typescript
   class Product {
     constructor(
       public name: string,
       public price: number,
       public stock: number | null = null  // Even optional ones
     ) {}
   }
   ```

### DON'T:

1. ❌ **Don't bypass TypeScript types with any**
   ```typescript
   const x: any = 5;
   x = "string";  // Causes deoptimization
   ```

2. ❌ **Don't delete properties**
   ```typescript
   delete obj.property;  // Very slow! Use null instead
   ```

3. ❌ **Don't add properties after creation**
   ```typescript
   const obj = new User('Alice');
   (obj as any).newProp = 'value';  // Changes hidden class
   ```

4. ❌ **Don't create holes in arrays**
   ```typescript
   const arr: number[] = new Array(5);
   arr[0] = 1;
   arr[2] = 3;  // Hole at index 1
   ```

5. ❌ **Don't mix types in arrays unnecessarily**
   ```typescript
   const arr: (number | string)[] = [1, 2, 'three'];  // Slower
   ```

6. ❌ **Don't use different property orders**
   ```typescript
   const p1 = { x: 1, y: 2 };
   const p2 = { y: 2, x: 1 };  // Different hidden classes!
   ```

## 📊 Understanding the Output

### Optimization Messages

When running with `--trace-opt`:

```
[marking 0x... <functionName> for optimized recompilation, reason: small function]
[compiling method 0x... using TurboFan]
[optimized <functionName> (target TURBOFAN)]
```

These indicate successful optimization! 🎉

### Deoptimization Messages

When running with `--trace-deopt`:

```
[deoptimizing (DEOPT soft): begin ...]
[bailout (kind: deopt-soft): ...]
```

These indicate the function was deoptimized. Look at what happened just before! ⚠️

### IC State Messages

When running with `--trace-ic`:

```
[LoadIC in ~functionName+123 at ...#name 0 -> 1]  // Uninitialized → Monomorphic
[LoadIC in ~functionName+123 at ...#name 1 -> P]  // Monomorphic → Polymorphic
[LoadIC in ~functionName+123 at ...#name P -> N]  // Polymorphic → Megamorphic
```

States:
- `0` = Uninitialized
- `1` = Monomorphic
- `P` = Polymorphic
- `N` = Megamorphic

## 🔧 V8 Flags Reference

```bash
--trace-opt              # Trace optimizations
--trace-deopt            # Trace deoptimizations
--trace-opt-verbose      # Verbose optimization info
--trace-ic               # Trace inline cache state changes
--allow-natives-syntax   # Enable % intrinsic functions
--print-opt-code         # Print generated optimized code
--print-bytecode         # Print bytecode
```

## 📘 TypeScript-Specific Tips

### 1. Type Safety vs Runtime Optimization

TypeScript provides compile-time safety, but V8 optimizes based on runtime behavior:

```typescript
// Compile-time: TypeScript ensures type safety
function process(data: number[]): number {
  return data.reduce((a, b) => a + b, 0);
}

// Runtime: V8 optimizes based on actual values
process([1, 2, 3]);  // Optimized for numbers

// External data can break assumptions
const externalData: any = JSON.parse('["1", "2", "3"]');
process(externalData as number[]);  // Type assertion, but runtime strings!
```

### 2. Use Strict Mode and Strict Compiler Options

The project uses strict TypeScript settings for better optimization:
- `strict: true` - Enables all strict checks
- `noImplicitAny: true` - Requires explicit types
- `strictNullChecks: true` - Prevents null/undefined issues

### 3. Generics Stay Optimizable

Generics are erased at runtime but don't hurt optimization if used consistently:

```typescript
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of items) {
    result.push(fn(item));
  }
  return result;
}

// Monomorphic usage - optimizes well
const numbers = [1, 2, 3, 4, 5];
map(numbers, x => x * 2);  // Always called with number[]
```

### 4. Interfaces vs Type Aliases

Both work well for optimization, but classes create more predictable hidden classes:

```typescript
// Interface - Good for object shapes
interface User {
  name: string;
  age: number;
}

// Class - Best for consistent hidden classes
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}
```

### 5. Enums and Const Assertions

```typescript
// Enum - Transpiled to object
enum Status { Active, Inactive }

// Const assertion - Inlined at compile time
const STATUS = { Active: 0, Inactive: 1 } as const;

// Both work, but const assertions may inline better
```

### 6. Validating External Data

Always validate data from external sources:

```typescript
interface ApiResponse {
  id: number;
  name: string;
}

function validateApiResponse(data: any): data is ApiResponse {
  return (
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    typeof data.name === 'string'
  );
}

const rawData = await fetch('/api').then(r => r.json());
if (validateApiResponse(rawData)) {
  // Now safe to use as ApiResponse
  processApiResponse(rawData);
}
```

## 📖 Further Reading

- [V8 Blog](https://v8.dev/blog)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
- [How JavaScript Works](https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e)
- [V8 Optimization Killers](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers)
- [Understanding V8's Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)
- [TypeScript Deep Dive - Performance](https://basarat.gitbook.io/typescript/main-1/performance)

## 🤝 Contributing

Feel free to add more examples or improve existing ones! Common areas for expansion:

- WebAssembly integration with TypeScript
- Worker threads optimization
- Promise optimization patterns
- Async/await performance
- Class vs function performance
- Modern TypeScript features (optional chaining, nullish coalescing, etc.)
- Decorators and their impact on optimization
- TypeScript utility types and runtime performance

## 📝 License

MIT

---

**Happy Optimizing with TypeScript! 🚀**

Remember: Premature optimization is the root of all evil, but understanding how your code performs is always valuable! TypeScript helps you write safer code, and understanding V8 helps you write faster code.
