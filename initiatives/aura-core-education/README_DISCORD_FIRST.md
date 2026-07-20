# Discord-First Implementation Note

The first Aura-Core Education pilot should use the existing Discord server as its collaboration surface while keeping all privileged services outside Discord.

## Recommended first release

- one private education category;
- adult test cohort before youth participation;
- five starter missions;
- a least-privilege Aura bot;
- browser-based project work;
- no public publishing;
- no payments or wallet features;
- no unrestricted direct messages;
- human review for every showcased project.

## Why Discord first

Discord already provides channels, roles, commands, moderation surfaces, and community interaction. This makes it suitable for validating the curriculum and support model before investing in console-native applications.

## What still needs a separate backend

- identity and consent enforcement;
- sandboxed code execution;
- project storage;
- validation and malware scanning;
- AI tutoring policy controls;
- audit records;
- retention and deletion workflows.

The Discord bot should remain a thin, authenticated client of those services.