import { mountChrome, setActiveNav, loadOnline, cameFromHere, focusHeading } from './nav.js';
import { enhance } from './pages.js';
import { Background } from './background.js';
import './cx-auth.js';   // takes the website's sign-in when this page is embedded there

/**
 * Start-up for the server-rendered pages (/, /practice, /daily, /leaderboard,
 * /how, /u, /t, /r). The game (/app) does the same things itself in main.js.
 */
const canvas = document.getElementById('bg');
if (canvas) new Background(canvas);
mountChrome();
const main = document.getElementById('main');
setActiveNav(main ? main.dataset.nav || '' : '');
loadOnline();
if (main) enhance(main);
// arriving from another TypeDash page: start on this page's title, as the game's own pages do
if (main && cameFromHere() && !location.hash) focusHeading(main);
