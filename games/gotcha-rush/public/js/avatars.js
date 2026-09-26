/** Avatar catalogue: an emoji, an accent colour (muted to sit on the ivory palette), and the level that unlocks it. Ids must match server/Player.js. */
export const AVATARS = [
  { id: 'bolt',    emoji: '⚡', color: '#C08A2E', unlock: 1,  name: 'Bolt' },
  { id: 'bug',     emoji: '🐛', color: '#62805A', unlock: 1,  name: 'Bug' },
  { id: 'ghost',   emoji: '👻', color: '#7D6A9A', unlock: 1,  name: 'Ghost' },
  { id: 'robot',   emoji: '🤖', color: '#4F7A8C', unlock: 1,  name: 'Robot' },
  { id: 'alien',   emoji: '👾', color: '#A45A7A', unlock: 1,  name: 'Alien' },
  { id: 'fox',     emoji: '🦊', color: '#B8612E', unlock: 1,  name: 'Fox' },
  { id: 'owl',     emoji: '🦉', color: '#5C8A86', unlock: 3,  name: 'Owl' },
  { id: 'cat',     emoji: '🐱', color: '#B5594F', unlock: 5,  name: 'Cat' },
  { id: 'octopus', emoji: '🐙', color: '#8A5A8C', unlock: 8,  name: 'Octopus' },
  { id: 'rocket',  emoji: '🚀', color: '#6E8B3D', unlock: 11, name: 'Rocket' },
  { id: 'dino',    emoji: '🦖', color: '#8A8F45', unlock: 15, name: 'Dino' },
  { id: 'wizard',  emoji: '🧙', color: '#5E5A8F', unlock: 20, name: 'Wizard' },
];
export const AVATAR_BY_ID = Object.fromEntries(AVATARS.map((a) => [a.id, a]));
export const avatarFor = (id) => AVATAR_BY_ID[id] || AVATARS[0];
