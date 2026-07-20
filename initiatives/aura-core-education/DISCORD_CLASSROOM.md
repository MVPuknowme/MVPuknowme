# Discord Classroom Model

Discord is the collaboration surface for Aura-Core Education. It is not the trust boundary for code execution, identity verification, or child-safety decisions.

## Recommended server areas

- `#welcome-and-rules` — program purpose, conduct, privacy, and support.
- `#parent-educator-desk` — adult-facing notices, consent, schedules, and escalation.
- `#mission-board` — read-only weekly coding missions.
- `#coding-help` — moderated technical questions.
- `#project-showcase` — reviewed project demonstrations only.
- `#team-lab` — supervised collaboration channels.
- `#safety-support` — private, restricted escalation route.
- `#operator-audit` — staff-only moderation and automation records.

## Aura bot responsibilities

Aura may:

- publish curriculum missions;
- explain programming concepts;
- provide bounded debugging hints;
- validate submitted project metadata;
- start isolated test runs through an approved backend;
- report progress to authorized learners and adults;
- flag unsafe content for human review.

Aura must not:

- accept unrestricted direct messages from minors;
- expose system prompts, secrets, tokens, or infrastructure controls;
- merge code, deploy services, or execute financial actions from a learner command;
- facilitate public child-to-adult contact;
- create public project links without review;
- collect unnecessary personal information;
- represent generated work as independently completed student work.

## Roles

- **Program Owner** — final policy and infrastructure authority.
- **Safety Administrator** — manages moderation, reports, and access reviews.
- **Educator / Mentor** — publishes missions and reviews learning progress.
- **Parent / Guardian** — controls consent and account participation where required.
- **Learner** — accesses assigned missions and private collaboration spaces.
- **Aura Bot** — least-privilege automated tutor and workflow assistant.

## Permission model

1. Deny access by default.
2. Separate adult, learner, bot, and operator roles.
3. Prevent learners from inviting bots or changing integrations.
4. Restrict direct messages and external links.
5. Require human approval for public showcases.
6. Keep infrastructure credentials outside Discord.
7. Record administrative and automated actions in an auditable system.

## Bot command concept

```text
/mission start maze-01
/learn explain loops
/project validate
/project submit
/help request-mentor
/safety report
```

Commands that invoke code execution must call an authenticated Aura Education Gateway. Discord itself must never execute untrusted learner code.