'use strict';
const cfg = require('./config');
const Room = require('./Room');

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

class RoomManager {
  constructor({ bank, ratings, accounts }) {
    this.bank = bank;
    this.ratings = ratings;
    this.accounts = accounts;
    this.rooms = new Map();
    this.codes = new Map();
  }

  newCode() {
    let c;
    do { c = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join(''); }
    while (this.codes.has(c));
    return c;
  }

  register(room) {
    this.rooms.set(room.id, room);
    if (room.code) this.codes.set(room.code, room);
    return room;
  }

  closeRoom(room, reason = 'closed') {
    if (room.closed) return;
    room.closed = true;
    room.clearTimers();
    clearTimeout(room.graceTimer);
    for (const s of room.seats) {
      if (s.player && s.player.room === room) {
        s.player.room = null;
        s.player.sid = null;
        s.player.send({ type: 'room_closed', reason });
      }
    }
    this.rooms.delete(room.id);
    if (room.code) this.codes.delete(room.code);
  }

  leave(player) { if (player.room) player.room.detach(player); }

  // Known topic ids, once each, in the order given, up to the match size.
  topicList(topics) {
    const out = [];
    for (const id of Array.isArray(topics) ? topics : []) if (typeof id === 'string' && this.bank.has(id) && !out.includes(id)) out.push(id);
    return out.slice(0, cfg.TOPICS_PER_MATCH);
  }

  // Public tables are matched on mode and on what the player asked to play:
  // the same topic list first, then any table opening on the same first topic
  // (its other topics were set by whoever opened it). A player with no
  // preference takes any open seat; bots top up the rest.
  // Culture too: a desi or global player only sits at a table of that culture; a mix player sits anywhere.
  quick(player, mode, topics, culture, rounds) {
    this.leave(player);
    mode = Room.normMode(mode);
    culture = Room.normCulture(culture);
    rounds = Room.normRounds(rounds);
    const list = this.topicList(topics).filter((id) => this.bank.inCulture(id, culture)).slice(0, rounds);
    const open = [...this.rooms.values()].filter((r) => !r.isPrivate && !r.closed && r.state === 'lobby' && r.mode === mode && r.rounds === rounds && r.seats.length < cfg.MAX_SEATS && (culture === 'mix' || r.culture === culture));
    let room = null;
    if (list.length) room = open.find((r) => r.listKey === list.join(',')) || open.find((r) => r.topicKey === list[0]);
    else room = open[0];
    if (!room) room = this.register(new Room(this, { mode, isPrivate: false, topics: list, culture, rounds }));
    return room.addHuman(player);
  }

  create(player, mode, topics, culture, rounds) {
    this.leave(player);
    const room = this.register(new Room(this, { mode, isPrivate: true, topics: this.topicList(topics), culture, rounds }));
    return room.addHuman(player);
  }

  join(player, code) {
    const room = this.codes.get(String(code || '').toUpperCase().trim());
    if (!room || room.closed) return { error: 'No table with that code. Check it and try again.' };
    if (room.state !== 'lobby') return { error: 'That table is mid-match. Try again when it finishes.' };
    if (room.seats.length >= cfg.MAX_SEATS) return { error: 'That table is full.' };
    this.leave(player);
    return room.addHuman(player) ? { ok: true } : { error: 'Could not join that table.' };
  }

  // A player who reloads mid-match gets their seat back.
  tryRejoin(player) {
    for (const room of this.rooms.values()) {
      if (room.closed || room.state === 'lobby') continue;
      const seat = room.seats.find((s) => !s.bot && s.accountId === player.account.id && s.away);
      if (seat) { room.rejoin(player, seat); return true; }
    }
    return false;
  }

  settleSeat(room, seat, info) {
    const acc = this.accounts.get(seat.accountId);
    if (!acc) return;
    const r = this.accounts.settleMatch(acc, { ranked: room.ranked, ...info });
    if (seat.player) {
      seat.player.send({
        type: 'result', ranked: room.ranked, place: info.place, score: info.score,
        points: r.points, unlocked: r.unlocked, profile: this.accounts.public(acc),
      });
    }
  }

  stats() {
    let players = 0;
    for (const r of this.rooms.values()) players += r.activeHumans().length;
    return { rooms: this.rooms.size, players };
  }
}

module.exports = RoomManager;
