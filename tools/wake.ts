/**
 * wake.ts — 50 First Dates Agent Wake Protocol
 * 
 * Runs every hour (via cron or setInterval).
 * Reads AGENT_STATE.json to restore context so the agent
 * never starts a session blind. Like the notebook in the movie.
 * 
 * Usage:
 *   npx tsx tools/wake.ts          (manual)
 *   Add to cron: 0 * * * * npx tsx /path/to/tools/wake.ts
 */

import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentState {
  lastRun: string;           // ISO timestamp
  sessionId: string;         // UUID for this wake cycle
  currentBranch: string;     // Git branch at last run
  triageStatus: TriageItem[];
  pendingTasks: string[];
  notes: string;
}

interface TriageItem {
  id: string;
  category: 'BROKEN' | 'GARBLED' | 'UNOPTIMIZED' | 'STRUCTURAL';
  description: string;
  resolved: boolean;
  resolvedAt?: string;
}

interface WakeReport {
  wakeTime: string;
  sessionId: string;
  branch: string;
  unresolvedCount: number;
  pendingTasks: string[];
  nextAction: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATE_FILE = path.join(process.cwd(), '.agent', 'AGENT_STATE.json');
const LOG_FILE   = path.join(process.cwd(), '.agent', 'wake.log');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureAgentDir(): void {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadState(): AgentState {
  if (!fs.existsSync(STATE_FILE)) {
    // First ever wake — bootstrap empty state
    const bootstrap: AgentState = {
      lastRun: new Date().toISOString(),
      sessionId: crypto.randomUUID(),
      currentBranch: 'fix/50-first-dates-refactor',
      triageStatus: [],
      pendingTasks: [
        'Review TRIAGE.md and begin 🔴 BROKEN fixes',
        'Run depcheck on package.json',
        'Move all .md docs to /docs folder',
      ],
      notes: 'Fresh bootstrap. No prior session data.',
    };
    saveState(bootstrap);
    return bootstrap;
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')) as AgentState;
}

function saveState(state: AgentState): void {
  ensureAgentDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function appendLog(entry: string): void {
  ensureAgentDir();
  const line = `[${new Date().toISOString()}] ${entry}\n`;
  fs.appendFileSync(LOG_FILE, line, 'utf-8');
}

// ─── Core Wake Logic ──────────────────────────────────────────────────────────

function wake(): WakeReport {
  const state = loadState();

  const unresolved = state.triageStatus.filter(t => !t.resolved);
  const newSession = crypto.randomUUID();

  // Determine next action from triage priority order
  const categoryOrder: TriageItem['category'][] = [
    'BROKEN', 'GARBLED', 'UNOPTIMIZED', 'STRUCTURAL'
  ];
  
  let nextAction = 'All triage items resolved. Review ROADMAP_V2.md for next phase.';
  for (const cat of categoryOrder) {
    const item = unresolved.find(t => t.category === cat);
    if (item) {
      nextAction = `[${cat}] ${item.description}`;
      break;
    }
  }

  const report: WakeReport = {
    wakeTime: new Date().toISOString(),
    sessionId: newSession,
    branch: state.currentBranch,
    unresolvedCount: unresolved.length,
    pendingTasks: state.pendingTasks,
    nextAction,
  };

  // Update state with new session
  state.lastRun = report.wakeTime;
  state.sessionId = newSession;
  saveState(state);

  appendLog(
    `WAKE | session=${newSession} | unresolved=${unresolved.length} | next=${nextAction}`
  );

  return report;
}

// ─── Mark Item Resolved (utility export) ─────────────────────────────────────

export function resolveTriageItem(id: string, note?: string): void {
  const state = loadState();
  const item = state.triageStatus.find(t => t.id === id);
  if (item) {
    item.resolved = true;
    item.resolvedAt = new Date().toISOString();
    appendLog(`RESOLVED | id=${id} | note=${note ?? 'none'}`);
    saveState(state);
  }
}

// ─── Add Task (utility export) ────────────────────────────────────────────────

export function addTask(description: string): void {
  const state = loadState();
  state.pendingTasks.push(description);
  saveState(state);
  appendLog(`TASK_ADDED | ${description}`);
}

// ─── Entrypoint ───────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = wake();
  console.log('\n🌅 AGENT WAKE REPORT');
  console.log('═'.repeat(50));
  console.log(`Session   : ${report.sessionId}`);
  console.log(`Time      : ${report.wakeTime}`);
  console.log(`Branch    : ${report.branch}`);
  console.log(`Unresolved: ${report.unresolvedCount} triage items`);
  console.log(`\n📋 Pending Tasks:`);
  report.pendingTasks.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  console.log(`\n⚡ Next Action:\n  ${report.nextAction}`);
  console.log('═'.repeat(50) + '\n');
}
