# transaction

Execute SQL transactions against the database.

## Usage

Access or destructure `transaction` from the `SQLocal` client.

```javascript
import { SQLocal } from 'sqlocal';

const { transaction } = new SQLocal('database.sqlite3');
```

<!-- @include: ../.partials/initialization-note.md -->

The `transaction` method provides a way to execute a transaction on the database, ensuring atomicity and isolation of the SQL queries executed within it. `transaction` takes a callback that is passed a `tx` object containing a `sql` tagged template for executing SQL within the transaction.

This `sql` tag function passed in the `tx` object works similarly to the [`sql` tag function used for single queries](sql.md), but it ensures that the queries are executed in the context of the open transaction. Any logic can be carried out in the callback between the queries as needed.

If any of the queries fail or any other error is thrown within the callback, `transaction` will throw an error and the transaction will be rolled back automatically. If the callback completes successfully, the transaction will be committed.

The callback can return any value desired, and if the transaction succeeds, this value will be returned from `transaction`.

```javascript
const productName = 'rice';
const productPrice = 2.99;

const newProductId = await transaction(async (tx) => {
	const [product] = await tx.sql`
		INSERT INTO groceries (name) VALUES (${productName}) RETURNING *
	`;
	await tx.sql`
		INSERT INTO prices (groceryId, price) VALUES (${product.id}, ${productPrice})
	`;
	return product.id;
});
```

