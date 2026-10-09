'use strict';
const CATALOGUE = [
  { id: 'first_match', name: 'First draft', desc: 'Finish a match', icon: '🎟️' },
  { id: 'first_win', name: 'Number one pick', desc: 'Win a match', icon: '🏆' },
  { id: 'crowd_fav', name: 'Crowd favourite', desc: 'Take every vote in a round with 3+ voters', icon: '📣' },
  { id: 'mind_reader', name: 'Mind reader', desc: 'Match all three loves in one topic', icon: '🔮' },
  { id: 'open_book', name: 'Open book', desc: 'As the Mind, have all three loves drafted', icon: '📖' },
  { id: 'busted', name: 'Walked right into it', desc: "Draft the Mind's dud", icon: '💀' },
  { id: 'bargain', name: 'Bargain hunter', desc: 'Win a top-three card for 3 coins or less', icon: '🪙' },
  { id: 'big_spender', name: 'Big spender', desc: 'Spend 15 coins on a single card', icon: '💸' },
  { id: 'clean_sweep', name: 'Clean sweep', desc: 'Win every topic in a match', icon: '🧹' },
  { id: 'regular', name: 'Regular', desc: 'Finish 10 matches', icon: '🪑' },
  { id: 'veteran', name: 'Veteran', desc: 'Finish 50 matches', icon: '🎖️' },
  { id: 'streak3', name: 'Three days running', desc: 'Visit 3 days in a row', icon: '🔥' },
  { id: 'streak7', name: 'Full week', desc: 'Visit 7 days in a row', icon: '📆' },
  { id: 'perfect_read', name: 'Perfect read', desc: 'Hit all 4 picks in a Crowd read topic', icon: '💯' },
  { id: 'solo_1k', name: 'Reads the room', desc: 'Score 1,000 in one Crowd read run', icon: '🎯' },
  { id: 'solo_5k', name: 'Crowd whisperer', desc: 'Score 5,000 in one Crowd read run', icon: '🧠' },
];

const AVATARS = ['🦊', '🐼', '🐸', '🦁', '🐙', '🦉', '🐯', '🐧', '🔮', '🏆', '🧠', '📆'];
// avatar → achievement that unlocks it
const AVATAR_UNLOCKS = { '🔮': 'mind_reader', '🏆': 'first_win', '🧠': 'solo_5k', '📆': 'streak7' };

module.exports = { CATALOGUE, AVATARS, AVATAR_UNLOCKS };
