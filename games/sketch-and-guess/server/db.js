'use strict';
/**
 * SQLite storage for player identities and the Best Drawing gallery.
 * (Leaderboards and streaks live in ./ranking.js, which owns its own tables.)
 */
const fs = require('fs');
const path = require('path');
let Database;
try {
  Database = require('better-sqlite3');
} catch (_) {
  const { DatabaseSync } = require('node:sqlite');
  Database = class NodeSqliteAdapter {
    constructor(file) { this.db = new DatabaseSync(file); }
    pragma(sql) {
      try { return this.db.exec('PRAGMA ' + sql); } catch (_) {}
    }
    exec(sql) { return this.db.exec(sql); }
    prepare(sql) {
      const stmt = this.db.prepare(sql);
      const paramNames = [...sql.matchAll(/@([a-zA-Z0-9_]+)/g)].map((m) => m[1]);
      const cleanArgs = (args) => {
        if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0]) && paramNames.length > 0) {
          const obj = args[0];
          const filtered = {};
          for (const k of paramNames) if (k in obj) filtered[k] = obj[k];
          return [filtered];
        }
        return args;
      };
      return {
        run: (...args) => stmt.run(...cleanArgs(args)),
        get: (...args) => stmt.get(...cleanArgs(args)),
        all: (...args) => stmt.all(...cleanArgs(args)),
      };
    }
    transaction(fn) {
      return (...args) => {
        this.exec('BEGIN');
        try {
          const res = fn(...args);
          this.exec('COMMIT');
          return res;
        } catch (e) {
          this.exec('ROLLBACK');
          throw e;
        }
      };
    }
    close() { return this.db.close(); }
  };
}

function openDb(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      token            TEXT UNIQUE NOT NULL,
      name             TEXT NOT NULL DEFAULT 'Player',
      avatar           INTEGER NOT NULL DEFAULT 0,
      cortexis_user_id TEXT,
      created_at       INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS gallery (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      word          TEXT NOT NULL,
      artist_id     INTEGER NOT NULL,
      artist_name   TEXT NOT NULL,
      artist_avatar INTEGER NOT NULL,
      ops           TEXT NOT NULL,
      votes         INTEGER NOT NULL DEFAULT 0,
      likes         INTEGER NOT NULL DEFAULT 0,
      created_at    INTEGER NOT NULL
    );
  `);
  try { db.exec('ALTER TABLE players ADD COLUMN cortexis_user_id TEXT'); } catch (_) {}
  return db;
}

/** Thin query layer used by the game server and HTTP routes. */
function createStore(db) {
  const q = {
    byToken: db.prepare('SELECT * FROM players WHERE token = ?'),
    byId: db.prepare('SELECT * FROM players WHERE id = ?'),
    allPlayers: db.prepare('SELECT id, token, name, avatar, cortexis_user_id AS cortexisUserId, created_at AS createdAt FROM players ORDER BY id DESC LIMIT 500'),
    insert: db.prepare('INSERT INTO players (token, created_at) VALUES (?, ?)'),
    update: db.prepare('UPDATE players SET name = ?, avatar = ? WHERE id = ?'),
    linkCx: db.prepare('UPDATE players SET cortexis_user_id = ? WHERE id = ?'),
    deletePlayer: db.prepare('DELETE FROM players WHERE id = ?'),
    addArt: db.prepare(`INSERT INTO gallery (word, artist_id, artist_name, artist_avatar, ops, votes, likes, created_at)
                        VALUES (@word, @artistId, @artistName, @artistAvatar, @ops, @votes, @likes, @createdAt)`),
    listArt: db.prepare(`SELECT id, word, artist_name AS artistName, artist_avatar AS artistAvatar, ops, votes, likes,
                         created_at AS createdAt FROM gallery WHERE id < ? ORDER BY id DESC LIMIT ?`)
  };
  return {
    findPlayer: (token) => q.byToken.get(token),
    getOrCreatePlayer(token) {
      return q.byToken.get(token) || { id: Number(q.insert.run(token, Date.now()).lastInsertRowid), token };
    },
    updatePlayer: (id, name, avatar) => q.update.run(name, avatar, id),
    linkCortexisUser: (id, cxUserId) => { try { q.linkCx.run(String(cxUserId), id); } catch (_) {} },
    updatePlayerFields(id, { name, avatar }) {
      const p = q.byId.get(id);
      if (!p) return;
      const newName = name !== undefined ? name : p.name;
      const newAvatar = avatar !== undefined ? avatar : p.avatar;
      q.update.run(newName, newAvatar, id);
    },
    deletePlayer(id) {
      try { q.deletePlayer.run(id); } catch (_) {}
      try { db.prepare('DELETE FROM rank_stats WHERE player_id = ?').run(String(id)); } catch (_) {}
      try { db.prepare('DELETE FROM rank_games WHERE player_id = ?').run(String(id)); } catch (_) {}
    },
    allPlayers() {
      let rows = [];
      try {
        rows = q.allPlayers.all();
      } catch (_) {
        return [];
      }
      return rows.map((p) => {
        let stats = null;
        try {
          stats = db.prepare('SELECT * FROM rank_stats WHERE player_id = ?').get(String(p.id));
        } catch (_) {}
        const cxId = p.cortexisUserId ? (String(p.cortexisUserId).startsWith('cx_') ? Number(String(p.cortexisUserId).slice(3)) : Number(p.cortexisUserId) || null) : null;
        return {
          id: String(p.id),
          name: p.name,
          country: 'UN',
          cortexisUserId: cxId,
          points: stats?.total_points || 0,
          played: stats?.games_played || 0,
          wins: stats?.wins || 0,
          streak: stats?.win_streak || 0,
          bestStreak: stats?.best_win_streak || 0,
          extra: {
            wins: stats?.wins || 0,
            bestScore: stats?.best_game_score || 0,
            streak: stats?.best_win_streak || 0
          },
          createdAt: p.createdAt || null,
          lastSeen: stats?.last_play_day || null
        };
      });
    },
    addGalleryEntry: (e) => q.addArt.run({ ...e, ops: JSON.stringify(e.ops), createdAt: Date.now() }),
    listGallery({ before, limit }) {
      return q.listArt.all(before || Number.MAX_SAFE_INTEGER, limit).map((r) => ({ ...r, ops: JSON.parse(r.ops) }));
    }
  };
}

module.exports = { openDb, createStore };
