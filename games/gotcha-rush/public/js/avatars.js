/** Avatar catalogue: an emoji, an accent colour, and the level that unlocks it. Ids must match server/Player.js. */
export const AVATARS = [
  { id: 'bolt',    emoji: '⚡', color: '#f59e0b', unlock: 1,  name: 'Bolt' },
  { id: 'bug',     emoji: '🐛', color: '#10b981', unlock: 1,  name: 'Bug' },
  { id: 'ghost',   emoji: '👻', color: '#8b5cf6', unlock: 1,  name: 'Ghost' },
  { id: 'robot',   emoji: '🤖', color: '#0ea5e9', unlock: 1,  name: 'Robot' },
  { id: 'alien',   emoji: '👾', color: '#ec4899', unlock: 1,  name: 'Alien' },
  { id: 'fox',     emoji: '🦊', color: '#f97316', unlock: 1,  name: 'Fox' },
  { id: 'owl',     emoji: '🦉', color: '#06b6d4', unlock: 3,  name: 'Owl' },
  { id: 'cat',     emoji: '🐱', color: '#f43f5e', unlock: 5,  name: 'Cat' },
  { id: 'octopus', emoji: '🐙', color: '#d946ef', unlock: 8,  name: 'Octopus' },
  { id: 'rocket',  emoji: '🚀', color: '#22c55e', unlock: 11, name: 'Rocket' },
  { id: 'dino',    emoji: '🦖', color: '#84cc16', unlock: 15, name: 'Dino' },
  { id: 'wizard',  emoji: '🧙', color: '#a855f7', unlock: 20, name: 'Wizard' },
];
export const AVATAR_BY_ID = Object.fromEntries(AVATARS.map((a) => [a.id, a]));
export const avatarFor = (id) => AVATAR_BY_ID[id] || AVATARS[0];
