# Aura-Core Education Architecture

## Trust zones

### Learning clients

Xbox, PlayStation, PC, browser, and mobile clients present lessons, collect code, and display results. They are not trusted to enforce policy or execute privileged operations.

### Discord learning hub

Discord provides community, commands, mission delivery, and supervised collaboration. Discord messages are untrusted input and must pass through authentication, authorization, moderation, and validation.

### Aura Education Gateway

The gateway performs:

- server and channel allowlisting;
- role authorization;
- request validation;
- consent and participation checks;
- rate limiting;
- content moderation routing;
- sandbox job creation;
- project metadata validation;
- audit event emission.

### Isolated execution workers

Workers execute learner projects using disposable environments with no secrets, no host access, bounded resources, and denied network access by default.

### Evidence and project services

These services retain only approved project artifacts, validation results, reviewer decisions, and limited progress records under a documented retention policy.

## Non-goals

- Distributed AI training on consumer consoles.
- Cryptocurrency mining or wallet activity.
- Unsupervised public social networking for minors.
- Direct production deployments from learner commands.
- General-purpose shell access.
- Silent collection of voice, biometric, precise-location, or behavioral advertising data.

## Suggested event flow

```text
Discord command
  -> interaction signature verification
  -> server/channel/role allowlist
  -> policy and consent check
  -> normalized mission request
  -> isolated sandbox job
  -> deterministic validation
  -> moderated response
  -> evidence record
```

## Separation from SKYGRID operations

Education workloads should not share production credentials, privileged operator roles, or write access with emergency and continuity workloads. Shared Aura-Core libraries may be reused only after explicit threat modeling and least-privilege review.