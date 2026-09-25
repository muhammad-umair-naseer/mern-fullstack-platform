import { twoPane } from './_data-convert.js';
import { parseCsv, stringifyCsv, coerceCsv, sqlInsertsToTable, tableToSqlInserts } from '../core/formats/data.js';
export function mount(root) {
  twoPane(root, { left: 'CSV or SQL', accept: '.csv,.sql,.txt', sample: 'id,name,score,active\n1,Ayesha,91.5,true\n2,"O\'Neil, Bilal",78,false', right: [['csv2sql', 'CSV → SQL INSERT'], ['sql2csv', 'SQL INSERT → CSV']],
    options: [{ type: 'select', key: 'dialect', label: 'SQL dialect', value: 'mysql', options: [['mysql', 'MySQL / MariaDB'], ['postgres', 'PostgreSQL'], ['sqlite', 'SQLite'], ['mssql', 'SQL Server']] }, { type: 'select', key: 'table', label: 'Table name', value: 'my_table', options: [['my_table', 'my_table'], ['data', 'data'], ['records', 'records'], ['import', 'import']] }, { type: 'select', key: 'batch', label: 'Rows per INSERT', value: '100', options: [['1', '1'], ['100', '100'], ['1000', '1000']] }, { type: 'check', key: 'create', label: 'Include CREATE TABLE', value: true }],
    name: (d) => (d === 'csv2sql' ? 'inserts.sql' : 'rows.csv'),
    convert: (text, dir, o) => {
      if (dir === 'csv2sql') { const rows = parseCsv(text); if (rows.length < 2) throw new Error('Need a header row and at least one data row.'); const cols = rows[0].map((c, i) => c.trim() || `col${i + 1}`); const data = rows.slice(1).map((r) => cols.map((_, i) => coerceCsv(r[i] ?? ''))); return { text: tableToSqlInserts(o.table, cols, data, { dialect: o.dialect, batch: Number(o.batch), createTable: o.create }), mime: 'application/sql', note: `${data.length} row(s) → INSERT statements.` }; }
      const tables = sqlInsertsToTable(text); if (!tables.length) throw new Error('No INSERT statements found.');
      const t = tables[0]; const cols = t.columns.length ? t.columns : t.rows[0].map((_, i) => `col${i + 1}`);
      return { text: stringifyCsv([cols, ...t.rows]), mime: 'text/csv', note: `Table "${t.table}": ${t.rows.length} row(s)${tables.length > 1 ? ` (${tables.length} tables found — first one exported)` : ''}.` };
    } });
}
