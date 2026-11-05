import { getDB } from '../setup/db.js';

// Reproduces the casting the old Mongoose schemas did for us: `trim` on every
// string field, `lowercase` on emails, and boolean <-> INTEGER for SQLite.
const cast = (field, raw) => {
  if (raw === undefined || raw === null) {
    if (field.default !== undefined) return field.default;
    return field.type === 'boolean' ? 0 : null;
  }
  if (field.type === 'boolean') return raw ? 1 : 0;
  if (typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  return field.lowercase ? trimmed.toLowerCase() : trimmed;
};

const revive = (fields, row) => {
  if (!row) return row;
  const out = { ...row };
  for (const field of fields) {
    if (field.type === 'boolean') out[field.name] = Boolean(out[field.name]);
  }
  return out;
};

export const createRepository = (table, fields) => {
  const names = fields.map((f) => f.name);
  const insertSQL =
    `INSERT INTO ${table} (${[...names, 'createdAt', 'updatedAt'].join(', ')}) ` +
    `VALUES (${[...names, 'createdAt', 'updatedAt'].map((n) => `@${n}`).join(', ')})`;

  return {
    async create(value) {
      const db = getDB();
      const now = new Date().toISOString();
      const params = { createdAt: now, updatedAt: now };
      for (const field of fields) params[field.name] = cast(field, value[field.name]);

      const { lastInsertRowid } = await db.prepare(insertSQL).run(params);
      return this.findById(lastInsertRowid);
    },

    async findById(id) {
      const row = await getDB().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
      return revive(fields, row);
    },

    // Newest first, matching the old `.sort({ createdAt: -1 })`.
    async findAll({ page = 1 } = {}) {
      const offset = (Math.min(100000, Math.max(1, Number.parseInt(page, 10) || 1)) - 1) * 50;
      const rows = await getDB()
        .prepare(`SELECT * FROM ${table} ORDER BY createdAt DESC, id DESC LIMIT 50 OFFSET ?`)
        .all(offset);
      return rows.map((row) => revive(fields, row));
    },

    async count() {
      return (await getDB().prepare(`SELECT COUNT(*) AS n FROM ${table}`).get()).n;
    },
  };
};
