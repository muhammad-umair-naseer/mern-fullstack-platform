'use strict';

/**
 * Achievements are evaluated on the server from validated results so they
 * follow the account across devices. check(acc, r): `acc` is the account after
 * the game was applied, `r` the summary of the game just played
 * ({ mode, rank, rounds, correct, bestCombo, score, racers, humans, ranked,
 *    perfect, fastestMs, langs: {js:{rounds,correct}, py:{...}}, hour }).
 */
const ACHIEVEMENTS = [
  { id: 'first_match', icon: '🎬', name: 'Hello, world', desc: 'Finish your first match', check: (a) => a.matches >= 1 },
  { id: 'first_win', icon: '🥇', name: 'Top of the stack', desc: 'Win a match', check: (a) => a.wins >= 1 },
  { id: 'podium_5', icon: '🏆', name: 'Regular', desc: 'Reach the podium 5 times', check: (a) => a.podiums >= 5 },
  { id: 'perfect', icon: '💎', name: 'Zero defects', desc: 'Get every round right in a match', check: (a, r) => r.mode === 'match' && r.perfect },
  { id: 'combo_5', icon: '🔥', name: 'On a roll', desc: 'Answer 5 rounds in a row correctly', check: (a) => a.bestCombo >= 5 },
  { id: 'combo_10', icon: '☄️', name: 'Unstoppable', desc: 'Answer 10 rounds in a row correctly', check: (a) => a.bestCombo >= 10 },
  { id: 'fast_5s', icon: '⚡', name: 'Speed reader', desc: 'Lock in a correct answer within 5 seconds', check: (a, r) => r.fastestMs != null && r.fastestMs <= 5000 },
  { id: 'solved_25', icon: '🧩', name: 'Puzzler', desc: 'Solve 25 puzzles', check: (a) => a.correct >= 25 },
  { id: 'solved_100', icon: '🧠', name: 'Big brain', desc: 'Solve 100 puzzles', check: (a) => a.correct >= 100 },
  { id: 'solved_500', icon: '🌌', name: 'Language lawyer', desc: 'Solve 500 puzzles', check: (a) => a.correct >= 500 },
  { id: 'js_20', icon: '🟨', name: 'Coercion whisperer', desc: 'Solve 20 JavaScript puzzles', check: (a) => a.langs.js.correct >= 20 },
  { id: 'py_20', icon: '🐍', name: 'Snake charmer', desc: 'Solve 20 Python puzzles', check: (a) => a.langs.py.correct >= 20 },
  { id: 'polyglot', icon: '🌐', name: 'Polyglot', desc: 'Solve 10 puzzles in each language', check: (a) => a.langs.js.correct >= 10 && a.langs.py.correct >= 10 },
  { id: 'rush_1000', icon: '🏃', name: 'Rush hour', desc: 'Score 1,000 in Solo Rush', check: (a) => a.bestRush >= 1000 },
  { id: 'rush_5000', icon: '🚀', name: 'Escape velocity', desc: 'Score 5,000 in Solo Rush', check: (a) => a.bestRush >= 5000 },
  { id: 'rush_rounds_15', icon: '🛡️', name: 'Survivor', desc: 'Last 15 rounds in a single Rush', check: (a, r) => r.mode === 'rush' && r.rounds >= 15 },
  { id: 'no_lifeline', icon: '🙈', name: 'No hints needed', desc: 'Win a match without using a lifeline', check: (a, r) => r.mode === 'match' && r.rank === 1 && r.lifelines === 0 },
  { id: 'points_10k', icon: '💰', name: 'Point collector', desc: 'Earn 10,000 ranked points', check: (a) => a.points >= 10000 },
  { id: 'points_50k', icon: '👑', name: 'Hall of fame', desc: 'Earn 50,000 ranked points', check: (a) => a.points >= 50000 },
  { id: 'streak_3', icon: '📅', name: 'Habit forming', desc: 'Play on 3 days in a row', check: (a) => a.streak >= 3 },
  { id: 'streak_7', icon: '🗓️', name: 'Seven day streak', desc: 'Play on 7 days in a row', check: (a) => a.streak >= 7 },
  { id: 'streak_30', icon: '🔒', name: 'Unbreakable', desc: 'Play on 30 days in a row', check: (a) => a.streak >= 30 },
  { id: 'friendly_5', icon: '🤝', name: 'Good company', desc: 'Finish 5 friendly matches with other people', check: (a) => a.friendlies >= 5 },
  { id: 'rival_win_5', icon: '⚔️', name: 'Nemesis', desc: 'Beat the same rival 5 times', check: (a) => Object.values(a.rivals || {}).some((r) => r.w >= 5) },
  { id: 'night_owl', icon: '🦉', name: 'Night owl', desc: 'Finish a match between midnight and 4 am', check: (a, r) => r.hour >= 0 && r.hour < 4 },
];

const CATALOGUE = ACHIEVEMENTS.map(({ id, icon, name, desc }) => ({ id, icon, name, desc }));

module.exports = { ACHIEVEMENTS, CATALOGUE };
