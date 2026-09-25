'use strict';
const cfg = require('./config');
const Room = require('./Room');

class RoomManager {
  constructor({ bank, accounts = null, boards = null }) {
    this.bank = bank;
    this.accounts = accounts;
    this.boards = boards;
    this.rooms = new Map();
    this.onGameSettled = null;
    this.timer = setInterval(() => this.tick(), cfg.TICK_MS);
    this.timer.unref?.();
  }

  tick() {
    const now = Date.now();
    for (const room of this.rooms.values()) {
      try { room.tick(now); } catch (err) { console.error(`[room ${room.code}]`, err); }
    }
  }

  create(opts) {
    const room = new Room(this, opts);
    this.rooms.set(room.code, room);
    return room;
  }

  retire(room) {
    this.rooms.delete(room.code);
  }

  /** Public matchmaking: prefer the fullest waiting room for that language. */
  quickMatch(player, lang = 'mix') {
    if (player.room) player.room.removePlayer(player);
    const candidates = [...this.rooms.values()]
      .filter((r) => !r.isPrivate && r.lang === lang && !r.isFull && (r.state === 'waiting' || r.state === 'finished'))
      .sort((a, b) => (a.state === b.state ? b.players.size - a.players.size : a.state === 'waiting' ? -1 : 1));
    const room = candidates[0] || this.create({ isPrivate: false, lang });
    return room.addPlayer(player);
  }

  createPrivate(player, { lang = 'mix', rounds } = {}) {
    if (player.room) player.room.removePlayer(player);
    const room = this.create({ isPrivate: true, lang, rounds });
    return room.addPlayer(player);
  }

  join(player, code) {
    const room = this.rooms.get(String(code || '').toUpperCase());
    if (!room) return { ok: false, error: 'Room not found. Check the code and try again.' };
    if (player.room === room) return { ok: true };
    if (player.room) player.room.removePlayer(player);
    return room.addPlayer(player);
  }

  leave(player) {
    if (player.room) player.room.removePlayer(player);
  }

  stats() {
    let inMatch = 0;
    let humans = 0;
    for (const r of this.rooms.values()) { if (r.inProgress) inMatch++; humans += r.humans.length; }
    return { rooms: this.rooms.size, inMatch, humansInRooms: humans, puzzles: this.bank.size };
  }
}

module.exports = RoomManager;
