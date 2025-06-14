# Introduction

SQLocal makes it easy to run SQLite3 in the browser, backed by the origin private file system which provides high-performance read/write access to a SQLite database file stored on the user's device.

SQLocal acts as a lightweight wrapper of the [WebAssembly build of SQLite3](https://sqlite.org/wasm/doc/trunk/index.md) and gives you a simple interface to interact with databases running locally using tagged template literals for SQL queries.

Having the ability to store and query relational data on device makes it possible to build powerful, local-first web apps and games no matter the complexity of your data model.

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
	{ id: 3, name: 'rice' },
];
```


