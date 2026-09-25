'use strict';

const AVATARS = ['bolt', 'bug', 'ghost', 'robot', 'alien', 'fox', 'owl', 'cat', 'octopus', 'rocket', 'dino', 'wizard'];

class Player {
  constructor(id, ws) {
    this.id = id;
    this.ws = ws;
    this.name = 'Guest';
    this.country = 'UN';
    this.avatar = 'bolt';
    this.isBot = false;
    this.room = null;
    this.account = null;   // persistent account record, humans only
    this.watching = null;  // ranking board this client has open
    this.connected = true;
    this.lastChatAt = 0;
    this.resetGame();
  }

  /** Per-match state. */
  resetGame() {
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.roundsPlayed = 0;
    this.correctRounds = 0;
    this.lifelines = 0;
    this.fastestMs = null;
    this.totalAnswerMs = 0;
    this.langs = { js: { rounds: 0, correct: 0 }, py: { rounds: 0, correct: 0 } };
    this.rank = null;
    this.resetRound();
  }

  /** Per-round state. */
  resetRound() {
    this.answer = null;      // string[] once locked in
    this.answerAt = null;    // server time of lock-in
    this.lifeline = false;   // used the multiple-choice lifeline this round
    this.choices = null;
    this.roundResult = null;
  }

  get locked() { return this.answer !== null; }

  info() {
    return {
      id: this.id, name: this.name, country: this.country, avatar: this.avatar, isBot: this.isBot,
      score: this.score, combo: this.combo, locked: this.locked, lifeline: this.lifeline, rank: this.rank,
      connected: this.connected,
    };
  }

  send(obj) { this.sendRaw(JSON.stringify(obj)); }

  sendRaw(raw) {
    if (this.isBot || !this.ws || this.ws.readyState !== 1) return;
    try { this.ws.send(raw); } catch (_) { /* socket closing */ }
  }
}

Player.AVATARS = AVATARS;
module.exports = Player;
