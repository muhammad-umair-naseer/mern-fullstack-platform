import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { parseCsv, stringifyCsv, csvToObjects, jsonToRows, detectDelimiter, parseYaml, stringifyYaml, diffLines, diffChars, unifiedDiff, md5, formatSql, minifySql, sqlInsertsToTable, tableToSqlInserts } from '../../src/core/formats/data.js';
import { parseXml, serializeXml, xmlToJson, jsonToXml } from '../../src/core/xml.js';
import { hex, utf8 } from '../../src/core/bytes.js';
import { has } from './_helpers.mjs';

test('CSV: RFC 4180 quoting, delimiter detection, objects, JSON flattening', () => {
  const csv = 'name,age,city\n"Smith, John",42,"New\nYork"\nAna,7,"She said ""hi"""\n';
  const rows = parseCsv(csv);
  assert.deepEqual(rows, [['name', 'age', 'city'], ['Smith, John', '42', 'New\nYork'], ['Ana', '7', 'She said "hi"']]);
  assert.equal(stringifyCsv(rows), 'name,age,city\n"Smith, John",42,"New\nYork"\nAna,7,"She said ""hi"""');
  assert.deepEqual(csvToObjects(rows)[0], { name: 'Smith, John', age: 42, city: 'New\nYork' });
  assert.equal(detectDelimiter('a;b;c\n1;2;3\n'), ';'); assert.equal(detectDelimiter('a\tb\n1\t2\n'), '\t');
  assert.deepEqual(jsonToRows([{ a: 1, b: { c: 2 } }, { a: 3, d: [1, 2] }]), [['a', 'b.c', 'd.0', 'd.1'], [1, 2, '', ''], [3, '', 1, 2]]);
});
test('YAML: parse practical subset, dump, round-trip, agrees with PyYAML', () => {
  const y = `# c\nname: Cortexis   # trailing\nversion: 1.2\nenabled: true\nnothing: ~\ntags:\n  - alpha\n  - "beta: gamma"\n  - 3\nnested:\n  deep:\n    key: value\n    list:\n      - a: 1\n        b: 2\n      - a: 3\n        b: [x, y, {z: 1}]\nflow: {a: 1, b: [1, 2, "three"]}\nmulti: |\n  line one\n  line two\nfolded: >\n  this is\n  folded text\nquoted: "with \\"escapes\\" and \\n newline"\nsingle: 'it''s'\nanchor: &base\n  x: 1\nref: *base\nempty_list: []\nempty_map: {}\n`;
  const v = parseYaml(y);
  assert.deepEqual(v, { name: 'Cortexis', version: 1.2, enabled: true, nothing: null, tags: ['alpha', 'beta: gamma', 3], nested: { deep: { key: 'value', list: [{ a: 1, b: 2 }, { a: 3, b: ['x', 'y', { z: 1 }] }] } }, flow: { a: 1, b: [1, 2, 'three'] }, multi: 'line one\nline two\n', folded: 'this is folded text\n', quoted: 'with "escapes" and \n newline', single: "it's", anchor: { x: 1 }, ref: { x: 1 }, empty_list: [], empty_map: {} });
  const dumped = stringifyYaml(v);
  assert.deepEqual(parseYaml(dumped), v);
  if (has('python3')) { try { const py = execSync('python3 -c "import yaml,sys,json; print(json.dumps(yaml.safe_load(sys.stdin.read())))"', { input: dumped, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); assert.deepEqual(JSON.parse(py), JSON.parse(JSON.stringify(v))); } catch (e) { if (!/No module/.test(String(e))) throw e; } }
  assert.throws(() => parseYaml('a: [1, 2'), /flow|Unexpected|Invalid/);
});
test('diff: Myers line/char diff and unified output', () => {
  const d = diffLines('a\nb\nc\nd', 'a\nc\nd\ne');
  assert.deepEqual(d.map((o) => o.type), ['eq', 'del', 'eq', 'eq', 'ins']);
  assert.equal(diffChars('kitten', 'sitting').filter((o) => o.type !== 'eq').length, 5);
  assert.match(unifiedDiff('a\nb\nc\nd', 'a\nc\nd\ne'), /@@ -1,4 \+1,4 @@\n a\n-b\n c\n d\n\+e/);
});
test('MD5 matches Node crypto incl. padding edge cases', () => {
  for (const s of ['', 'abc', 'The quick brown fox jumps over the lazy dog', 'x'.repeat(1000), 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64)]) assert.equal(hex(md5(utf8.encode(s))), createHash('md5').update(s).digest('hex'));
});
test('SQL: formatter, minifier, INSERT parsing and generation', () => {
  const f = formatSql("select a.id, count(*) as n from users a left join orders b on a.id=b.user_id where a.active = 1 and b.total > 10 group by a.id order by n desc limit 10;");
  assert.match(f, /^SELECT a\.id,\n  count\(\*\) AS n\nFROM users a\nLEFT JOIN orders b\n  ON a\.id = b\.user_id\nWHERE a\.active = 1\n  AND b\.total > 10\nGROUP BY a\.id\nORDER BY n DESC\nLIMIT 10;/);
  assert.equal(minifySql('SELECT  a ,\n b FROM   t ; -- c'), 'SELECT a,b FROM t;');
  const t = sqlInsertsToTable("INSERT INTO `users` (`id`, `name`, `score`) VALUES (1, 'Ann O''Neil', 3.5), (2, 'Bob', NULL);\nINSERT INTO users (id,name,score) VALUES (3,'C',-1);");
  assert.deepEqual(t, [{ table: 'users', columns: ['id', 'name', 'score'], rows: [[1, "Ann O'Neil", 3.5], [2, 'Bob', null], [3, 'C', -1]] }]);
  const gen = tableToSqlInserts('users', ['id', 'name'], [[1, "O'Neil"], [2, null]], { dialect: 'postgres', createTable: true, batch: 10 });
  assert.match(gen, /CREATE TABLE "users" \(\n  "id" INTEGER,\n  "name" VARCHAR\(32\)\n\);/);
  assert.match(gen, /\(1, 'O''Neil'\),\n  \(2, NULL\);/);
  assert.deepEqual(sqlInsertsToTable(gen)[0].rows, [[1, "O'Neil"], [2, null]]);
});
test('XML: parse/serialize, JSON mapping round-trip', () => {
  const xml = `<?xml version="1.0"?><root a="1"><item id="x">Hello &amp; bye</item><item id="y"/><![CDATA[raw <b>]]><!-- c --><nested><deep>1.5</deep></nested></root>`;
  const doc = parseXml(xml); const j = xmlToJson(doc);
  assert.deepEqual(j, { root: { '@a': 1, item: [{ '@id': 'x', '#text': 'Hello & bye' }, { '@id': 'y' }], '#text': 'raw <b>', nested: { deep: 1.5 } } });
  assert.deepEqual(xmlToJson(parseXml(jsonToXml(j))), j);
  assert.match(serializeXml(doc, { indent: '  ' }), /<root a="1">\n  <item id="x">Hello &amp; bye<\/item>\n  <item id="y"\/>/);
  assert.equal(jsonToXml([1, 2], { rootName: 'nums', itemName: 'n', declaration: false }), '<nums>\n  <n>1</n>\n  <n>2</n>\n</nums>');
});
