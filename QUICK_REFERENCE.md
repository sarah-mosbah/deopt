# TurboFan Quick Reference

## Optimization States

### Inline Cache (IC) States
- **Uninitialized (0)**: Never executed
- **Monomorphic (1)**: One type/shape - FASTEST ⚡
- **Polymorphic (P)**: 2-4 types/shapes - MODERATE 🐌
- **Megamorphic (N)**: 5+ types/shapes - SLOWEST 🐢

### Function Optimization States
- **Interpreted**: Running in Ignition interpreter
- **Optimized**: Compiled by TurboFan
- **Deoptimized**: Fell back to interpreter

## Common Deoptimization Triggers

1. **Type Changes**
   - Number → String
   - Integer → Float
   - SMI → HeapNumber

2. **Hidden Class Changes**
   - Adding properties after creation
   - Different property order
   - Deleting properties
   - Changing property attributes

3. **Array Issues**
   - Holes in arrays: `[1, 2, , 4]`
   - Element type changes: `[1, 2, "three"]`
   - Sparse arrays: `arr[1000] = 1`
   - Switching array types (SMI → Double → Object)

4. **Function Issues**
   - Using `arguments` object
   - Try-catch blocks in hot code
   - eval() usage
   - with() statements

5. **Object Issues**
   - Inconsistent constructors
   - Prototype modifications
   - Getter/setter on hot paths

## Quick Tips

### ✅ DO
- Initialize all properties in constructor
- Keep function signatures consistent
- Use typed arrays for numeric data
- Preallocate arrays to known size
- Use classes for consistent shapes
- Use rest parameters over arguments
- Keep hot loops simple

### ❌ DON'T
- Change types after initialization
- Delete properties (use null)
- Add properties to existing objects
- Create holes in arrays
- Use try-catch in hot code
- Mix number types in arrays
- Use arguments object

## V8 Intrinsics Cheat Sheet

```javascript
// Enable with: node --allow-natives-syntax file.js

%OptimizeFunctionOnNextCall(fn)      // Force optimization
%DeoptimizeFunction(fn)              // Force deoptimization
%NeverOptimizeFunction(fn)           // Prevent optimization
%GetOptimizationStatus(fn)           // Check if optimized
%GetOptimizationCount(fn)            // How many times optimized
%PrepareFunctionForOptimization(fn)  // Prepare for optimization
%DebugPrint(obj)                     // Print object details
%HaveSameMap(obj1, obj2)             // Check if same hidden class
```

## Optimization Status Flags

```
Status & 1 << 0  → Is optimized
Status & 1 << 1  → Marked for optimization
Status & 1 << 2  → Marked for concurrent optimization
Status & 1 << 3  → Being optimized
Status & 1 << 4  → Optimized by TurboFan
Status & 1 << 5  → Is interpreted
```

## Performance Priorities

1. **Correctness** - Always write correct code first
2. **Readability** - Code is read more than written
3. **Maintainability** - Easy to understand and modify
4. **Performance** - Optimize hot paths only

"Premature optimization is the root of all evil" - Donald Knuth

But understanding performance is always valuable! 🚀
