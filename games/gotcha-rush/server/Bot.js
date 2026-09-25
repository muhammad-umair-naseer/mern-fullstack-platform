'use strict';
const Player = require('./Player');
const { normalizeOutput } = require('../shared/scoring');

const NAMES = ['Ada', 'Linus', 'Grace', 'Dennis', 'Guido', 'Brendan', 'Margaret', 'Ken', 'Barbara', 'Bjarne', 'Yukihiro', 'Anders', 'Rasmus', 'Hedy', 'Alan', 'Radia', 'Ritchie', 'Lovelace', 'Torvalds', 'Hopper'];
const COUNTRIES = ['US', 'GB', 'DE', 'IN', 'PK', 'BR', 'JP', 'FR', 'NG', 'CA', 'AU', 'KR', 'ES', 'EG', 'TR', 'ID', 'MX', 'SE', 'PL', 'SA'];

/**
 * A bot that behaves like a plausible opponent: reads for a while, then locks
 * in; the better its skill and the easier the puzzle, the likelier it is to be
 * right. Wrong answers come from the puzzle's own distractors, so they look
 * like real mistakes on the reveal screen.
 */
class Bot extends Player {
  constructor(id, name, country) {
    super(id, null);
    this.isBot = true;
    this.name = name;
    this.country = country;
    this.avatar = Player.AVATARS[Math.floor(Math.random() * Player.AVATARS.length)];
    this.skill = 0.35 + Math.random() * 0.5;   // 0.35 … 0.85
    this.tempo = 0.7 + Math.random() * 0.8;    // multiplies its reading time
    this.plan = null;
  }

  /** Decide what this bot will do for the round. */
  planRound(puzzle, roundStartAt, roundMs) {
    const d = puzzle.difficulty;
    const think = (4000 + d * 3500 + Math.random() * 9000) * this.tempo;
    const at = roundStartAt + Math.min(roundMs - 1500, Math.max(2500, think));
    const pCorrect = Math.max(0.05, Math.min(0.95, this.skill * (1.2 - d * 0.16)));
    const correct = Math.random() < pCorrect;
    let answer;
    if (correct) {
      answer = puzzle.output.slice();
    } else if (puzzle.distractors.length) {
      answer = normalizeOutput(puzzle.distractors[Math.floor(Math.random() * puzzle.distractors.length)]);
    } else {
      answer = puzzle.output.map((l, i) => (i === 0 ? l + '1' : l));
    }
    // bots sometimes skip a hard one entirely
    const skip = !correct && d >= 4 && Math.random() < 0.3;
    this.plan = { at, answer, skip };
  }

  /** Called every tick; returns true when the bot locks in now. */
  tick(now) {
    if (!this.plan || this.locked || this.plan.skip) return false;
    if (now < this.plan.at) return false;
    this.answer = this.plan.answer;
    this.answerAt = now;
    return true;
  }
}

function makeBots(count, usedNames) {
  const out = [];
  const pool = NAMES.filter((n) => !usedNames.has(n));
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const name = pool.splice(idx, 1)[0];
    out.push(new Bot(`bot_${Math.random().toString(36).slice(2, 8)}`, name, COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]));
  }
  return out;
}

module.exports = { Bot, makeBots };
