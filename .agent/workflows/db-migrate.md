---
description: Run database migrations (TURBO)
---

# Database Migrations

This workflow runs database migrations for MysticFortune.

// turbo-all

## Steps

1. Generate migrations (if schema changed)
```bash
npm run db:generate
```

2. Push migrations to database
```bash
npm run db:push
```

3. Verify database status
```bash
npm run db:studio
```

**Note**: Make sure your `.env` file has the correct `DATABASE_URL` configured.
