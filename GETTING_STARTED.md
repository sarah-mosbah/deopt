# Getting Started with TurboFan TypeScript Demo

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Run Your First Example**
   ```bash
   npm run opt
   ```

## Project Structure

```
deopt/
├── src/                      # TypeScript source files
│   ├── examples/            # Demo examples
│   │   ├── optimization.ts
│   │   ├── deoptimization.ts
│   │   ├── monomorphic.ts
│   │   ├── polymorphic.ts
│   │   ├── hidden-class.ts
│   │   ├── inline-cache.ts
│   │   └── advanced.ts
│   └── trace.ts             # Tracing utility
├── dist/                    # Compiled JavaScript (gitignored)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Full documentation
```

## Quick Commands

```bash
# Development
npm run build          # Compile TypeScript
npm run build:watch    # Auto-compile on changes
npm run dev:opt        # Run without building (ts-node)

# Run Examples
npm run opt            # Optimization examples
npm run deopt          # Deoptimization examples
npm run monomorphic    # Monomorphic vs polymorphic
npm run all            # Run all main examples

# Advanced
npm run trace optimization.js  # Detailed V8 traces
npm run advanced               # V8 intrinsics demo
```

## Understanding the Output

When you run examples with `npm run opt`, look for:

✅ **Optimization messages:**
```
[marking 0x... <functionName> for optimized recompilation]
[optimized <functionName> (target TURBOFAN)]
```

⚠️ **Deoptimization messages:**
```
[deoptimizing (DEOPT soft): begin ...]
[bailout (kind: deopt-soft): ...]
```

## TypeScript & V8

Important concepts:

1. **Types are erased at runtime** - TypeScript compiles to JavaScript
2. **V8 optimizes JavaScript** - Based on runtime behavior, not types
3. **TypeScript helps** - Enforces consistent patterns at compile-time
4. **Validation matters** - Always validate external data

## Next Steps

1. Read through the examples in `src/examples/`
2. Run each example and observe the output
3. Try modifying examples to see how changes affect optimization
4. Check `README.md` for detailed explanations
5. Review `QUICK_REFERENCE.md` for optimization tips

## Common Issues

**TypeScript errors with % syntax:**
- This is expected for `advanced.ts`
- The % syntax is V8-specific and requires `--allow-natives-syntax`
- Use `@ts-ignore` comments in TypeScript (examples show how)

**Build errors:**
- Make sure you ran `npm install`
- Delete `dist/` and `node_modules/`, then reinstall

**Runtime errors:**
- Make sure you built the project: `npm run build`
- Check that you're using Node.js v16 or higher

## Resources

- Full docs: `README.md`
- Quick reference: `QUICK_REFERENCE.md`
- TypeScript config: `tsconfig.json`

Happy learning! 🚀
