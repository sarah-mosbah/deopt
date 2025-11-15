# Using V8 Intrinsics (% syntax)

## The Problem

V8 intrinsics use `%` syntax (like `%NeverOptimizeFunction()`), which:
- ❌ TypeScript doesn't recognize as valid syntax
- ❌ Causes compilation errors
- ✅ Only works in plain JavaScript files
- ✅ Requires `--allow-natives-syntax` flag

## Solutions

### Option 1: Use the Pre-made JavaScript File (Recommended)

```bash
# Run the JavaScript file with V8 intrinsics
npm run opt:test
```

This uses `dist/examples/optimization-intrinsics.js` which demonstrates:
- `%NeverOptimizeFunction()` - Prevent optimization
- `%PrepareFunctionForOptimization()` - Prepare function
- `%OptimizeFunctionOnNextCall()` - Force optimization
- `%GetOptimizationStatus()` - Check if optimized
- Performance comparisons

### Option 2: Create Your Own JavaScript File

1. Create a `.js` file in `dist/examples/` (NOT in `src/`)
2. Use V8 intrinsics directly:

```javascript
function myFunction(x) {
  return x * 2;
}

// V8 intrinsics
%NeverOptimizeFunction(myFunction);
%PrepareFunctionForOptimization(myFunction);
%OptimizeFunctionOnNextCall(myFunction);
console.log('Status:', %GetOptimizationStatus(myFunction));
```

3. Run with:
```bash
node --allow-natives-syntax dist/examples/your-file.js
```

### Option 3: Modify TypeScript (Not Recommended)

If you really want to use it in TypeScript:

1. Add `@ts-ignore` before each intrinsic:
```typescript
// @ts-ignore
%NeverOptimizeFunction(addNumbers);
```

2. Build will still fail, so you need to either:
   - Exclude the file from `tsconfig.json`
   - Use `ts-node --transpile-only` (skips type checking)
   - Manually edit the compiled JS after building

## Available V8 Intrinsics

```javascript
%NeverOptimizeFunction(fn)              // Prevent optimization
%OptimizeFunctionOnNextCall(fn)         // Force optimization next call
%PrepareFunctionForOptimization(fn)     // Prepare for optimization
%DeoptimizeFunction(fn)                 // Force deoptimization
%GetOptimizationStatus(fn)              // Get optimization state (returns number)
%GetOptimizationCount(fn)               // How many times optimized
%DebugPrint(obj)                        // Print object details
%HaveSameMap(obj1, obj2)                // Check if same hidden class
```

## Optimization Status Flags

The `%GetOptimizationStatus()` returns a number. Check bits:

```javascript
const status = %GetOptimizationStatus(myFunction);

console.log('Optimized?', status & (1 << 0) ? 'Yes' : 'No');
console.log('TurboFanned?', status & (1 << 4) ? 'Yes' : 'No');
```

Bit meanings:
- Bit 0: Is function optimized
- Bit 1: Marked for optimization  
- Bit 2: Marked for concurrent optimization
- Bit 3: Being optimized
- Bit 4: Optimized by TurboFan
- Bit 5: Is interpreted

## Complete Example

See `dist/examples/optimization-intrinsics.js` for a working example that shows:
- ✅ How to prevent optimization
- ✅ How to force optimization
- ✅ Performance comparisons
- ✅ Checking optimization status

## Summary

**For TypeScript projects:**
- Use plain `.js` files for V8 intrinsics
- Keep them in `dist/` folder (not compiled by TypeScript)
- Run with `node --allow-natives-syntax your-file.js`

**Quick Commands:**
```bash
npm run opt:test          # Run pre-made intrinsics example
npm run advanced          # Advanced examples (when ready)
```
