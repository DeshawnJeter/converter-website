# 0001: No database backend for now

Status: accepted (2026-11-07)

## Context
`schema.sql` describes a PostgreSQL backend (players, sessions, attempts, leaderboard). No server uses it. The game stores progress in `localStorage` (`uq_gold`, `uq_stars`, `uq_unlock`, `uq_quests`). `players.email` would be personal data.

## Decision
Keep `localStorage`. Do not build accounts, a database, or a leaderboard yet. `schema.sql` stays an untracked draft.
The AI parse endpoint (ADR 0002) is stateless: it stores nothing and holds no player data.

## Why
- No feature needs shared state today; a backend adds accounts, personal data, and privacy duties (NIST Govern/Map).
- The AI feature needs only a stateless proxy to hold the API key.
- Reversible: the draft schema can be adopted later.

## Revisit when
A leaderboard or cross-device progress is wanted. Then decide auth, minimal data (no email unless needed), and retention before any code.
