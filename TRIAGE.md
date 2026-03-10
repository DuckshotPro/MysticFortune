# MysticFortune — Replit Garble & Optimization Triage
> Generated: 2026-03-10 | Branch: fix/50-first-dates-refactor

---

## 🔴 BROKEN (Non-functional)
- [ ] **server/** — Verify all Express routes compile & respond; Replit agent may have left unresolved import paths
- [ ] **drizzle.config.ts** — Confirm DB URL env var resolves at runtime (`DATABASE_URL` in `.env.example` must be wired)
- [ ] **vite.config.ts** — Check proxy config for `/api` target; broken proxy = blank frontend in prod
- [ ] **GitHub Actions workflow** — `.github/` dir exists; confirm secrets match `setup-github-secrets.ps1` names exactly
- [ ] **.replit** — `run` command must match actual entrypoint in `package.json#scripts.start`

---

## 🟡 GARBLED / LOGIC ERRORS
- [ ] **Duplicate route registration** — Replit agent often re-registers routes on hot reload; check `server/index.ts` for double `app.use()` calls
- [ ] **Mixed async patterns** — Scan for mixed `async/await` + raw `.then()` chains in same function (agent mixes these constantly)
- [ ] **shared/ schema drift** — `shared/` types must match Drizzle schema exactly; agent edits one but not the other
- [ ] **client/ API calls** — Hardcoded `localhost:5000` URLs instead of relative `/api` paths (breaks in deploy)
- [ ] **`.autopilot.json`** — Review for conflicting task instructions left from agent sessions that contradict current state

---

## 🟠 UNOPTIMIZED
- [ ] **package.json bloat** — Likely has unused deps from agent trial-and-error; run `npx depcheck`
- [ ] **No DB connection pooling** — Drizzle without pool config will leak connections under load
- [ ] **No response caching** — Fortune/reading endpoints have no cache headers; every hit is a full DB round-trip
- [ ] **Missing error boundaries** — Client React tree has no `<ErrorBoundary>`; one bad API response crashes full UI
- [ ] **No rate limiting** — Express server has no `express-rate-limit`; open to abuse on `/api/fortune` etc.
- [ ] **package-lock.json is 371KB** — Bloated; indicates dependency tree not pruned

---

## 🔵 STRUCTURAL / ARCHITECTURE
- [ ] **30+ .md files in root** — All Replit agent docs belong in `/docs` folder, not root; clutters project nav
- [ ] **No environment validation** — Missing `zod` or similar env schema check at startup (crashes silently with missing vars)
- [ ] **No logging layer** — No `pino` or `winston`; `console.log` scattered throughout (no structured logs in prod)
- [ ] **No health endpoint** — Add `GET /health` for uptime monitoring
- [ ] **Missing `src/` structure** — `server/`, `client/`, `shared/` are flat; will become unmaintainable as code grows

---

## ✅ FIX ORDER (Systematic)
1. Fix all 🔴 BROKEN items first — get it running
2. Fix 🟡 GARBLED items — get it correct
3. Fix 🟠 UNOPTIMIZED — get it performant
4. Fix 🔵 STRUCTURAL — get it maintainable

> Each fix = one isolated commit. Never batch across categories.
