# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `bun run build` - Compiles TypeScript to JavaScript in dist/
- **Type checking**: `bun run typecheck` - Runs TypeScript compiler without emitting files
- **Testing**: `bun run test` - Runs Vitest tests in Chrome browser
- **Test UI**: `bun run test:ui` - Opens Vitest UI for interactive testing
- **Test CI**: `bun run test:ci` - Runs tests in CI mode (headless)
- **Test Safari**: `bun run test:safari` - Runs tests in Safari browser
- **Format**: `bun run format` - Formats code with Prettier
- **Format check**: `bun run format:check` - Checks if code is formatted correctly
- **Documentation**: `bun run docs:dev` - Starts VitePress dev server for docs

## Architecture

SQLocal is a browser-based SQLite library that runs SQLite WebAssembly in a web worker with persistence via Origin Private File System (OPFS).

### Core Components

- **SQLocal** (`src/client.ts`): Main client class that provides the public API
- **SQLocalProcessor** (`src/processor.ts`): Handles SQLite operations and message processing
- **Worker** (`src/worker.ts`): Web worker entry point using OPFS driver
- **Drivers** (`src/drivers/`): Different storage backends (OPFS, memory, localStorage/sessionStorage)

### Architecture Flow

1. **Client** creates SQLocal instance with database path
2. **Driver Selection**: Automatically chooses driver based on database path:
   - OPFS driver for file paths (uses web worker)
   - Memory driver for `:memory:` 
   - KVVFS driver for `local`/`session` storage
3. **Message Passing**: Client communicates with processor via message passing
4. **Query Processing**: Processor executes SQL via SQLite WASM and returns results

### Key Utilities

- **Mutation Lock** (`src/lib/mutation-lock.ts`): Prevents concurrent database modifications
- **Transaction Management**: Supports both manual and automatic transactions
- **User Functions**: Support for scalar, aggregate, and callback functions
- **Database File Operations**: Import/export, delete, and overwrite database files

## Browser Requirements

- Cross-Origin Isolation required for OPFS (headers: `Cross-Origin-Embedder-Policy: require-corp`, `Cross-Origin-Opener-Policy: same-origin`)
- Vite optimization excludes `@sqlite.org/sqlite-wasm` from bundling
- Tests run in real browsers (Chrome/Safari) via WebDriverIO

## Testing Notes

- All tests require browser environment due to WebAssembly and OPFS dependencies
- Test timeout: 1000ms for tests, hooks, and teardown
- Browser instances configured for both Chrome (headless) and Safari