# Repository Guidelines

## Project Structure & Module Organization

- `api/` holds the HTTP service (`cmd/api` entrypoint, `internal/*` domain layers, `migrations/` SQL, and generated `swagger/` specs).
- `api/migrations/` defines the seeds, sessions, requests, and results tables plus the global audit chain state; keep new migrations in timestamped `*.up.sql`/`*.down.sql` pairs.
- `swagger/public/` exposes the synced OpenAPI bundle for the nginx sidecar, while root assets (`Makefile`, `docker-compose.yml`, `todo.md`) define automation and roadmap.

- Architecture invariants
  - Use `api-toolkit` adapters/interfaces for router, CORS, logging, DB, validation etc.
  - Emit errors as RFC-7807 problem+json via `api-toolkit/httpx`; successes via `response_writer`.

## Environment Variables

- `api/test` contains API integration tests.
- `api/.env` contains API environment variables for local development, not Git-committed. `api/.env.example` is the Git-committed example file for it.
- `api/.env.test` contains API environment variables for local development integration tests, not Git-committed. `api/.env.test.example` is the Git-committed example file for it.
- `/.env` contains Docker Compose environment variables for local development, not Git-committed. `api/.env.example` is the Git-committed example file for it.

- Load env at startup; fail fast on missing vars.
- Define new environment variables in corresponding `.env` and `.env.example` file.
- Integration tests must use a separate `.env.test` file and own config structure with only needed variables.
- Docker Compose should use the `/.env` file.
- Always load environment variables on program launch phase.
- In code environment variables must exist i.e. program must panic/fail if environment variable doesn't exist.

## Running Code

Service runs in hot reloaded Docker Compose container and is probably already started by the human operator but verify this on suitable error situations and start service with proper `make` command.

## Build, Test, and Development Commands

Most useful commands are the following:

- `make dev` start the full stack via Docker Compose with live reload.
- `make down` stop the services and remove volumes.
- `make build` build Docker Compose images without cache.
- `make codegen` regenerate OpenAPI (`api/swagger`) and sync artifacts into `swagger/public/`.
- `make test` runs all tests inside container.
- `make fmt`, `make lint` apply `gofmt` and `go vet`.
- `make health` service healthiness check.

- In any commands prefer non-interactive flags; run long-lived commands in the background.
- Primary targets are the `make` commands.

`/Makefile` contains all the commands.

## Coding Style & Naming Conventions

- Do not edit auto-generated files; regenerate instead (e.g., `make codegen`).
- Follow idiomatic language naming patterns: e.g Golang exported identifiers use `CamelCase`, package-private code stays lowerCamel, and tests mirror package names.
- Keep handlers and services thin.
- Write secure, robust, scalable, extendable, performant, developer-friendly code.
- Write idiomatic, industry best practice code and patterns.

## Testing Guidelines

- Unit tests reside alongside code (`*_test.go`). Extend them when adding capabilities or utilities.
- Integration tests reside in `api/test`.
- Tests should use random data for testing.
- Use `make test` for all tests.
- Use `make health` to verify service is functional.

## Feature Completion

- A feature is ready when the code works as intended, both unit and integration test coverage is sufficient, tests succeed, `make codegen`, `make fmt`, `make lint`, `make health` succeed.
- If using a backlog or todo file, mark complete items with a checkmark emoji or with markdown box `[x]` when applicable.

## Commit Guidelines

- Only commit when requested.
- Commit only when feature criteria are met; use Conventional Commits; keep diffs minimal.
- Prefer Conventional Commit-style subjects (e.g., `feat(api): add bytes handler`) in active voice.

## Security & Configuration Notes

- Default config comes from environment variables defined in various `.env` files.
- Keep secrets out of commits: use local `.env`.
