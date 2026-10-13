import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../seo/Seo';
import { breadcrumbs, hostedArticle, itemList } from '../seo/schema';
import PageHero from '../components/PageHero';
import GamesVisual from '../components/heroes/GamesVisual';
import PostCard from '../components/PostCard';
import ServiceArticle from '../components/ServiceArticle';
import { POSTS, postPath } from '../data/blog.generated';
import { parseBlogContent } from '../lib/blogParser';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useGridReveal } from '../hooks/useGridReveal';
import { gamesPhotos } from '../assets/games';

// One line and three tags each; the games speak for themselves once opened.
// Every claim here is in the game's own README (games/<id>/README.md).
const GAMES = [
  {
    id: 'gotcha-rush',
    kind: 'Code quiz',
    title: 'Gotcha Rush',
    line: 'Read the snippet, call what it prints, beat the clock.',
    tags: ['JavaScript & Python', 'Live rooms', 'Solo Rush'],
    port: 3001,
  },
  {
    id: 'typedash',
    kind: 'Typing race',
    title: 'TypeDash',
    line: 'Race four other cars through the same passage, live.',
    tags: ['Live races', 'Ghost replays', 'Daily challenge'],
    port: 4001,
  },
  {
    id: 'pickparty',
    kind: 'Party draft',
    title: 'PickParty',
    line: 'Draft the best picks, read the room, dodge the dud.',
    tags: ['Snake drafts', 'Live auction', 'Mind reader'],
    port: 5001,
  },
];

// The whole stack starts from the compose file at the repository root. It
// refuses to start without three secrets, hence the .env step.
const QUICK_START = [
  { cmd: 'git clone https://github.com/abdullah5654/cortexis-website.git' },
  { cmd: 'cd cortexis-website' },
  { cmd: 'cp .env.example .env', note: '# add your three secrets' },
  { cmd: 'docker compose up --build' },
];

const SERVICES = ['website', 'gotcha-rush', 'typedash', 'pickparty', 'postgres', 'redis'];

// The guide that lives on this page (its markdown names /games as home), and
// the other game guides, each on its own URL so each can rank for its query.
const PATH = '/games';
const ARTICLE = POSTS.find((p) => p.slug === 'free-coding-games-in-your-browser' || p.home === PATH);
const GUIDES = POSTS.filter((p) => (p.category === 'games' || (p.tags && p.tags.includes('games'))) && p.slug !== 'free-coding-games-in-your-browser');
const SCHEMA = [
  breadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Games', path: PATH },
  ]),
  ...(GUIDES.length ? [itemList(GUIDES, postPath)] : []),
  ...(ARTICLE ? hostedArticle(ARTICLE, PATH, parseBlogContent(ARTICLE.body).faqs) : []),
];

// The games run as their own servers, so a new tab opens them on their port
// of whatever host this page is on.
const directUrl = (port) => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:${port}`;
};

export default function Games() {
  const gamesRef = useRevealOnScroll();
  const localRef = useRevealOnScroll();
  const guidesRef = useRevealOnScroll();
  const guidesGridRef = useGridReveal([]);

  return (
    <main className="gp">
      <Seo
        title="Free Browser Games: Code Quiz, Typing Race, and Party Draft"
        description="Free multiplayer browser games: guess code outputs in Gotcha Rush, race live in TypeDash, or draft and outwit friends in PickParty. No sign-up required."
        path={PATH}
        image={ARTICLE?.image}
        schema={SCHEMA}
      />

      <PageHero
        label="Playground"
        lines={['Play fast,', <em>think faster.</em>]}
        lede="Three multiplayer games: a code quiz, a typing race, and a drafting party game."
        actions={[
          { href: '#game-cards', label: 'Choose a game', primary: true },
          { href: '#run-locally', label: 'Run it locally' },
        ]}
        visual={<GamesVisual />}
      />

      <section
        id="game-cards"
        ref={gamesRef}
        className="gp-section lx-wrap"
        aria-labelledby="gp-games-title"
      >
        <header className="gp-head">
          <span className="lx-label" data-reveal>
            <span className="lx-label-num">01</span>Three games
          </span>
          <h2 id="gp-games-title" className="lx-h2 gp-title" data-reveal>
            Pick your <em>arena.</em>
          </h2>
        </header>

        <div className="gp-grid">
          {GAMES.map((game, i) => {
            const photo = gamesPhotos[game.id];
            return (
              // The cell takes the scroll entrance and the card the hover lift,
              // so GSAP and the CSS transition never drive the same transform.
              <div key={game.id} className="gp-cell" data-reveal>
                <article className="gp-card lx-glass">
                  <Link
                    to={`/games/${game.id}`}
                    className="gp-media lx-frame"
                    data-reveal-media
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <span className="gp-drift" data-parallax="4">
                      <span className="gp-zoom">
                        <img src={photo.src} alt="" loading="lazy" decoding="async" />
                      </span>
                    </span>
                    <span className="gp-num">{String(i + 1).padStart(2, '0')}</span>
                  </Link>

                  <div className="gp-body">
                    <span className="gp-kind">{game.kind}</span>
                    <h3 className="gp-name">{game.title}</h3>
                    <p className="gp-line">{game.line}</p>
                    <ul className="gp-tags" aria-label={`${game.title} features`}>
                      {game.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className="gp-actions">
                      <Link to={`/games/${game.id}`} className="btn lx-btn">
                        Play {game.title}
                        <span className="lx-btn-disc" aria-hidden="true">
                          <ArrowUpRight size={15} />
                        </span>
                      </Link>
                      <a
                        href={directUrl(game.port)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lx-link gp-newtab"
                      >
                        New tab <ArrowUpRight size={15} aria-hidden="true" />
                        <span className="sr-only"> (opens {game.title} on its own)</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      {GUIDES.length > 0 && (
        <section
          id="guides"
          ref={guidesRef}
          className="gp-section lx-wrap"
          aria-labelledby="gp-guides-title"
        >
          <header className="gp-head">
            <span className="lx-label" data-reveal>
              <span className="lx-label-num">02</span>Guides
            </span>
            <h2 id="gp-guides-title" className="lx-h2 gp-title" data-reveal>
              Sharpen <em>up.</em>
            </h2>
          </header>

          {/* The first card spans two columns, so five guides fill two rows of three. */}
          <div ref={guidesGridRef} className="grid gap-6 lg:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((p, i) => (
              <div key={p.slug} className={i === 0 ? 'sm:col-span-2 grid' : 'grid'}>
                <PostCard post={p} featured={i === 0} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section
        id="run-locally"
        ref={localRef}
        className="gp-section gp-local-wrap lx-wrap"
        aria-labelledby="gp-local-title"
      >
        <div className="gp-local lx-glass">
          <div className="gp-local-copy">
            <span className="lx-label" data-reveal>
              <span className="lx-label-num">03</span>Run locally
            </span>
            <h2 id="gp-local-title" className="lx-h2 gp-title" data-reveal>
              One <em>compose</em> file.
            </h2>
            <p className="gp-local-lede" data-reveal>
              Docker runs all three games beside the site.
            </p>
            <ul className="gp-ports" data-reveal>
              {GAMES.map((g) => (
                <li key={g.id}>
                  <span>{g.title}</span>
                  <code>:{g.port}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="gp-term" data-reveal>
            <div className="gp-term-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <pre className="gp-term-body">
              <code>
                {QUICK_START.map((l) => (
                  <span className="gp-term-line" key={l.cmd} data-reveal>
                    <span className="gp-term-prompt" aria-hidden="true">$ </span>
                    {l.cmd}
                    {l.note && <span className="gp-term-note">  {l.note}</span>}
                  </span>
                ))}
                <span className="gp-term-line" aria-hidden="true" data-reveal>
                  <span className="gp-term-prompt">$ </span>
                  <span className="gp-term-caret" />
                </span>
              </code>
            </pre>
            <ul className="gp-stack" aria-label="Services the compose file starts">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {ARTICLE && <ServiceArticle post={ARTICLE} label="From the playground" />}
    </main>
  );
}
