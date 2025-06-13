import type { StatementInput, Statement } from '../types.js';
import { sqlTag } from './sql-tag.js';

export function normalizeStatement(statement: StatementInput): Statement {
	if (typeof statement === 'function') {
		statement = statement(sqlTag);
	}

	const sql = statement.sql;
	let params: unknown[] = [];

	if ('params' in statement) {
		params = statement.params;
	} else if ('parameters' in statement) {
		params = statement.parameters as unknown[];
	}

	return { sql, params };
}