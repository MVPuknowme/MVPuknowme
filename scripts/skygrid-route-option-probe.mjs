#!/usr/bin/env node

const now = new Date().toISOString();

const routes = [
  {
    id: "primary-vercel-onramp",
    kind: "https",
    status: process.env.SKYGRID_PRIMARY_STATUS ?? "healthy",
    latencyMs: Number(process.env.SKYGRID_PRIMARY_LATENCY_MS ?? 42),
    reliability: Number(process.env.SKYGRID_PRIMARY_RELIABILITY ?? 0.97),
    cost: Number(process.env.SKYGRID_PRIMARY_COST ?? 2),
    priority: 100,
  },
  {
    id: "aws-emergency-onramp",
    kind: "aws",
    status: process.env.SKYGRID_AWS_STATUS ?? "healthy",
    latencyMs: Number(process.env.SKYGRID_AWS_LATENCY_MS ?? 68),
    reliability: Number(process.env.SKYGRID_AWS_RELIABILITY ?? 0.95),
    cost: Number(process.env.SKYGRID_AWS_COST ?? 3),
    priority: 95,
  },
  {
    id: "local-worker-fallback",
    kind: "local",
    status: process.env.SKYGRID_LOCAL_STATUS ?? "standby",
    latencyMs: Number(process.env.SKYGRID_LOCAL_LATENCY_MS ?? 90),
    reliability: Number(process.env.SKYGRID_LOCAL_RELIABILITY ?? 0.88),
    cost: Number(process.env.SKYGRID_LOCAL_COST ?? 1),
    priority: 80,
  },
  {
    id: "safe-queue-preserve",
    kind: "queue",
    status: "preserve",
    latencyMs: 999,
    reliability: 1,
    cost: 0,
    priority: 10,
  },
];

function healthWeight(status) {
  if (["healthy", "ready", "online"].includes(status)) return 1;
  if (["standby", "degraded", "slow"].includes(status)) return 0.72;
  if (["preserve", "queue"].includes(status)) return 0.4;
  return 0;
}

function scoreRoute(route) {
  const health = healthWeight(route.status);
  const latencyPenalty = Math.min(route.latencyMs / 2, 80);
  const costPenalty = route.cost * 5;
  const reliabilityBonus = route.reliability * 50;
  const score = route.priority + reliabilityBonus + health * 100 - latencyPenalty - costPenalty;

  return {
    ...route,
    health,
    score: Number(score.toFixed(2)),
    eligible: health >= 0.7 && route.reliability >= 0.8,
  };
}

const candidates = routes.map(scoreRoute).sort((a, b) => b.score - a.score);
const selected = candidates.find((route) => route.eligible) ?? candidates.find((route) => route.kind === "queue");

const proof = {
  ok: Boolean(selected),
  mode: "SKYGRID Emergency Data On-Ramp route option probe",
  timestamp: now,
  selectedRoute: selected?.id ?? "safe-queue-preserve",
  decision: selected?.kind === "queue" ? "queue-for-preservation" : "route-selected",
  candidates,
};

console.log(JSON.stringify(proof, null, 2));

if (!selected) {
  process.exitCode = 1;
}
