# SQLocal

SQLocal makes it easy to run SQLite3 in the browser, backed by the origin private file system. It wraps the [WebAssembly build of SQLite3](https://sqlite.org/wasm/doc/trunk/index.md) and gives you a simple interface to interact with databases running on device.

[Documentation](https://sqlocal.dev) - [GitHub](https://github.com/DallasHoff/sqlocal) - [NPM](https://www.npmjs.com/package/sqlocal) - [Fund](https://www.paypal.com/biz/fund?id=U3ZNM2Q26WJY8)

## Features

- 🔎 Locally executes any query that SQLite3 supports
- 🧵 Runs the SQLite engine in a web worker so queries do not block the main thread
- 📂 Persists data to the origin private file system, which is optimized for fast file I/O
- 🔒 Each user can have their own private database instance
- 🚀 Simple API; just name your database and start running SQL queries
- 🛠️ Simple tagged template literals for SQL queries

## Examples

```javascript
import { SQLocal } from 'sqlocal';

// Create a client with a name for the SQLite file to save in
// the origin private file system
const { sql } = new SQLocal('database.sqlite3');

// Use the "sql" tagged template to execute a SQL statement
// against the SQLite database
await sql`CREATE TABLE groceries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`;

// Execute a parameterized statement just by inserting
// parameters in the SQL string
const items = ['bread', 'milk', 'rice'];
for (let item of items) {
  await sql`INSERT INTO groceries (name) VALUES (${item})`;
}

// SELECT queries and queries with the RETURNING clause will
// return the matched records as an array of objects
const data = await sql`SELECT * FROM groceries`;
console.log(data);
```

Log:

```javascript
[
  { id: 1, name: 'bread' },
  { id: 2, name: 'milk' },
  { id: 3, name: 'rice' }
]
```

Or, you can use SQLocal as a driver for [Drizzle ORM](https://orm.drizzle.team/) to make fully-typed queries.

## Install

Install the SQLocal package in your application using your package manager.

```sh
npm install sqlocal
# or...
yarn add sqlocal
# or...
pnpm install sqlocal
```

### Cross-Origin Isolation

In order to persist data to the origin private file system, this package relies on APIs that require cross-origin isolation, so the page you use this package on must be served with the following HTTP headers. Otherwise, the browser will block access to the origin private file system.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

If your development server uses Vite, you can do this by adding the following to your Vite configuration.

```javascript
plugins: [
  {
    name: 'configure-response-headers',
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        next();
      });
    },
  },
],
```

### Vite Configuration

Vite currently has an issue that prevents it from loading web worker files correctly with the default configuration. If you use Vite, please add the below to your Vite configuration to fix this.

```javascript
optimizeDeps: {
  exclude: ['sqlocal'],
},
```
