---
description: Build the project (TURBO)
---

# Build Project

This workflow builds the MysticFortune project for production.

// turbo-all

## Steps

1. Clean previous build (if exists)
```bash
rm -rf dist
```

2. Install dependencies
```bash
npm install
```

3. Run build
```bash
npm run build
```

4. Check build output
```bash
ls -la dist
```

The production build will be in the `dist` directory.
