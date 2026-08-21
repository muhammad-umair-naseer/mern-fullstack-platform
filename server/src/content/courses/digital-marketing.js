import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'digital-marketing',
  title: 'Digital Marketing & SEO',
  category: 'Marketing',
  level: 'Beginner',
  duration: '8 weeks',
  accent: 'orange',
  coverKey: 'digital-marketing',
  summary:
    'Learn the whole growth stack the way it is actually run — funnel maths, keyword research, on-page and technical SEO, content, links, analytics, paid, email and social — with real numbers on every decision.',
  description:
    'You work one business through every channel: map its funnel, write its positioning, build a keyword map, fix its titles and internal links, audit its indexing and Core Web Vitals, plan its content and links, wire up its analytics, and set budgets for paid, email and social. Each chapter ends with you able to diagnose a specific failure — a leaking checkout, a page targeting the wrong intent, a site Google crawls but will not index, a report that credits the wrong channel, and an ad account burning 38% of its budget on the wrong searches.',
  chapters: [
    chapter(
      'Strategy and Search Intent',
      'The funnel maths that decides where to spend, the positioning that makes every channel cheaper, and the keyword research that follows from both.',
      [
        lesson('The Funnel and the Numbers That Move It', 13, `
Every marketing decision is a bet on one number in a chain. Write the chain down with real figures and most arguments about tactics answer themselves.

### The chain, with real numbers

Riverbend Coffee roasts and ships beans and runs one café. We will use it for the whole course. Last month, online:

| Stage | Count | Step rate |
|---|---|---|
| Saw a post or an ad | 240,000 | — |
| Visited the site | 12,000 | 5.0% |
| Viewed a product page | 4,800 | 40% |
| Added to basket | 720 | 15% |
| Started checkout | 430 | 60% |
| Bought | 258 | 60% |
| Bought again within 90 days | 62 | 24% |

Average order value is $34, so the month produced 258 × $34 = **$8,772**.

### Fix the leak before you buy more traffic

The instinct is always "we need more traffic". Read the step rates instead. Moving checkout completion from 60% to 75% — usually by showing shipping cost earlier, allowing guest checkout, and cutting form fields — turns those same 430 checkout starts into 322 orders instead of 258. That is **64 extra orders and $2,176, with no extra ad spend**.

Doubling traffic to 24,000 visits at a $0.80 cost per click costs **$9,600** to earn back roughly the same $8,772. One of those is a project; the other is a bad trade. And note the worst row: product page to basket loses 85% of people who were interested enough to look at a product. That is where the money is.

### Every stage has a different job

| Stage | What they are thinking | What you publish | What you measure |
|---|---|---|---|
| Awareness | "Why does my coffee taste bitter?" | Guides, short video, social | Impressions, new users |
| Consideration | "Burr or blade grinder?" | Comparisons, reviews, email course | Engaged sessions, signups |
| Decision | "1kg Ethiopian, delivered Thursday" | Product page, clear shipping and returns | Add to basket, purchases |
| Retention | "Do I reorder or try someone else?" | Post-purchase email, subscription | Repeat rate, 90-day revenue |

### The most common mistake on real marketing teams

Judging a top-of-funnel page by immediate sales. "Why does my coffee taste bitter" converts at maybe 0.2% today, because its job is to get you into the consideration set six weeks before anyone buys. Cancel it for "not converting" and the decision-stage pages quietly starve two quarters later, at which point nobody connects the two events. **Score each asset against the job of its stage, not against revenue.**

The mirror-image mistake is pouring money into decision-stage ads when nothing feeds them. If only 900 people a month search your brand name, brand-term advertising has a ceiling you cannot bid past.

### The two numbers that decide whether any of it works

**CAC** — customer acquisition cost. $4,000 spent, 200 new customers, so **$20 each**.

**LTV** — lifetime value at *gross margin*, never at revenue. $34 order × 55% margin × 2.6 lifetime orders = **$48.62**.

That is an LTV:CAC of **2.4:1**. The working rule of thumb is 3:1 or better; below it you are buying growth at nearly cost. Check payback too: the first order contributes $18.70 of gross profit against a $20 CAC, so you lose money on order one and make it back on order two. That single fact makes the retention email flow in Chapter 5 more valuable to Riverbend than any new ad channel.

### Do this now

Rebuild the first table with your own numbers from last month, estimating at most two rows. Circle the worst step rate. That circle is your next project, and every chapter that follows is a tool for moving one of those rows.
        `),
        lesson('Positioning: Choosing Who You Are For', 12, `
Positioning is the sentence that decides which keywords are worth targeting, which ads will be cheap, and which visitors will convert. Leave it vague and every downstream channel gets more expensive.

### Before: wallpaper

> **Riverbend Coffee — premium coffee, roasted with passion.** We source the finest beans from around the world to deliver an exceptional coffee experience.

Read it word by word. *Premium* is unmeasurable and claimed by every roaster. *Roasted with passion* has no opposite — nobody advertises indifference. *Finest beans from around the world* names no origin, no roast style, no buyer. *Exceptional experience* is not a product attribute at all.

Apply the only test that matters: **could a direct competitor paste this onto their homepage tomorrow without lying?** If yes, it is not positioning. It is wallpaper.

### After: a claim someone could disprove

> **Roasted Tuesday, in your kitchen Thursday.** Whole-bean coffee for people who own a grinder.

Three things changed. It names the buyer — *owns a grinder* deliberately excludes the instant-coffee market, which was never going to buy anyway. It makes a **falsifiable claim**: 48 hours from roast to door, which you can be caught failing. And it implies the alternative it beats: supermarket bags that average four months old. Falsifiability is the point, because a claim a competitor could disprove is a claim a customer can believe.

### The template

> For **[specific customer]** who **[situation]**, **[brand]** is the **[category]** that **[one benefit]**, unlike **[named alternative]**, because **[proof]**.

Filled in: *For home coffee drinkers who grind their own beans, Riverbend is the mail-order roaster that ships within 48 hours of roasting, unlike supermarket coffee that averages four months old, because we roast to order every Tuesday and Friday.*

### Narrow costs you reach and buys you conversion

| | Broad claim | Narrow claim |
|---|---|---|
| Monthly visits | 12,000 | 7,000 |
| Conversion rate | 2.15% | 4.5% |
| Orders | 258 | 315 |
| Keywords worth targeting | ~400 | ~180 |

Fewer visitors, more orders, and half the keyword list to earn. Narrowing is not modesty; it is how a small budget beats a large one.

### Three proofs, not thirty features

Build a hierarchy: one claim in the headline, three proofs beneath it, then evidence.

- **Claim:** roasted Tuesday, in your kitchen Thursday.
- **Proofs:** roast date printed on every bag; two roast days a week; free replacement if it arrives more than five days after roasting.
- **Evidence:** a photograph of the date stamp, and 1,900 reviews averaging 4.7.

"We offer 12 origins" is a feature and belongs on a product page. "Roast date printed on every bag" is proof, and belongs on the homepage, because it makes the claim checkable.

### Where positioning shows up later

Homepage title tag (Chapter 2). Which keywords are worth the effort (next lesson). Ad copy — a specific claim earns a higher click-through rate, which directly lowers your cost per click through Quality Score (Chapter 5). Content pillars for social and the three welcome emails, which are just the three proofs expanded.

### The classic mistake

**Positioning by adjective**: fastest, best, most trusted, leading, innovative. Your competitor uses the same adjectives in the same week, so the customer files all of you as noise and defaults to whoever is cheapest or first in the results. The second most common is writing the sentence for your investors — "category-defining platform" — instead of for the person standing in their kitchen with a bag of stale beans.

### A 20-minute exercise

Write your current homepage headline. Cross out every word a competitor could truthfully use. Whatever survives is your real positioning. If nothing survives, you have just found this quarter's highest-value project.
        `),
        lesson('Keyword Research and Search Intent', 15, `
Keyword research is not collecting words with big numbers next to them. It is deciding, for each thing people search, whether you can win it and whether winning it is worth anything.

### Four intents, and the page type each one demands

| Intent | Example query | What the searcher wants | Page type that wins |
|---|---|---|---|
| Informational | "why is my coffee bitter" | An explanation | Guide or article |
| Commercial | "best burr grinder under $200" | Help choosing | Comparison or review |
| Transactional | "buy ethiopian coffee beans 1kg" | To purchase now | Product or category page |
| Navigational | "riverbend coffee login" | A specific site | Your own utility page |

### Read the results page, do not guess the intent

Search the keyword and look at what is actually ranking. Google has already decided what kind of answer this query deserves, and it publishes that decision in the top ten results.

| Keyword | Monthly volume | Top 10 are mostly | So the right page is |
|---|---|---|---|
| coffee | 450,000 | Wikipedia, news, definitions | Nothing — do not target |
| best coffee grinder | 27,000 | Magazine listicles | A comparison article |
| burr vs blade grinder | 3,600 | How-to guides | A guide |
| coffee subscription | 8,100 | Brand landing pages | A subscription landing page |
| buy ethiopian yirgacheffe 1kg | 320 | Product pages | A product page |

**This is the most common mistake in real keyword work:** writing a 2,000-word blog post to target "coffee subscription" when all ten results are landing pages. You are not competing on quality, you are offering the wrong *kind* of thing. Match the page type the results page shows you, or do not enter.

### Volume is the least useful of the three numbers

Score every candidate on three axes, and score the third one yourself:

1. **Volume** — how many searches a month. Directionally useful, wrong in detail; treat 27,000 as "a lot" and 320 as "a few".
2. **Difficulty** — open the top ten and count how many independent sites link to each. If the weakest result has 180 referring domains and you have 12, you will not rank this year regardless of how good your page is.
3. **Business value, 0–3.** "Coffee subscription" is a 3 for Riverbend. "History of coffee in Ethiopia" is a 0 — big volume, zero buyers.

A page ranking third for a 320-search keyword at 4.5% conversion produces more revenue than page two of a 27,000-search keyword, which produces none at all.

### The long tail is where a small site wins

| Approach | Pages | Avg monthly visits each | Total |
|---|---|---|---|
| Chase "best coffee grinder" | 1 | 0 (stuck on page 3) | 0 |
| Build 40 specific guides | 40 | 150 | 6,000 |

Specific queries — "how to store coffee beans after opening", "grind size for aeropress" — have less competition, clearer intent, and convert better because the searcher told you exactly what they need.

### Building the map

Start with 10 seed terms from your positioning. Expand with Google autocomplete, the "People also ask" box, the related searches at the bottom of the results, your Search Console query report, and any keyword tool. Then **cluster by intent**: queries that want the same answer belong on the same page.

"burr vs blade grinder", "is a burr grinder worth it", "difference between burr and blade" are one page, not three. Publishing three near-identical pages causes **cannibalisation** — Google picks one and rotates it, so all three underperform, and your internal links (Chapter 2) get split between them.

Finish with a spreadsheet: URL, primary keyword, intent, page type, business value, secondary keywords. **One primary keyword and one intent per page.** That sheet is the input to every chapter that follows.
        `),
      ],
      [
        q('A store gets 12,000 visits, 430 checkout starts and 258 orders at $34. Which change earns the most for the least spend?', [
          'Doubling ad spend to double the traffic',
          'Adding a second social channel',
          'Raising checkout completion from 60% to 75%',
          'Increasing average order value by $1',
        ], 2, 'Lifting a late-stage step rate converts traffic you have already paid for — 64 extra orders here, with no extra media cost.'),
        q('Which homepage headline is real positioning rather than wallpaper?', [
          'Roasted Tuesday, in your kitchen Thursday — coffee for people who own a grinder',
          'Premium coffee, roasted with passion',
          'The finest beans from around the world',
          'An exceptional coffee experience',
        ], 0, 'It names a specific buyer and makes a falsifiable claim a competitor cannot honestly copy — the test the other three fail.'),
        q('All ten results for "coffee subscription" are brand landing pages. You publish a 2,000-word blog post targeting it. Why will it fail?', [
          'The post is too long for the keyword',
          'Blog posts cannot rank for commercial terms',
          'The keyword has too much search volume',
          'The results page shows Google has already decided this query wants a landing page, not an article',
        ], 3, 'Intent determines page type; offering the wrong kind of page means you are not really in the competition at all.'),
        q('Riverbend spends $4,000 to win 200 customers whose lifetime gross profit is $48.62. What does that ratio say?', [
          'The channel is unprofitable and should be stopped',
          'It works, but at 2.4:1 it is below the 3:1 rule of thumb and depends on repeat orders',
          'CAC is irrelevant once LTV is above $40',
          'The business should raise ad spend immediately',
        ], 1, 'LTV:CAC of 2.4:1 leaves thin headroom, and since order one only returns $18.70 against a $20 CAC, profit starts at the second order.'),
      ]
    ),
    chapter(
      'On-Page SEO',
      'The elements on the page itself: what the title and description have to do, how headings and internal links carry meaning, and the markup that changes how your result looks.',
      [
        lesson('Titles, Meta Descriptions, and Headings', 14, `
The title tag and meta description are the advert for your page. They are the only thing most people ever see, and they decide whether a ranking becomes a visit.

### The title tag does two jobs

It is the strongest on-page relevance signal, and it is the blue clickable line in the results. Write it for both, in that order of importance.

Riverbend's grinder guide, before and after:

\`\`\`text
BEFORE  Home | Riverbend Coffee | Blog | Buy Coffee Online UK | Best Beans
AFTER   Burr vs Blade Grinder: Which Tastes Better? | Riverbend
\`\`\`

The first is a keyword dump: it names no page, repeats the brand, and describes nothing a human wanted. The second front-loads the query, adds a reason to click, and keeps the brand as a short suffix.

Practical rules:

- **Length: aim for 50–60 characters.** Google truncates on pixel width (about 580px on desktop), not character count, so a title full of capitals and Ws truncates earlier. Anything past the cut is invisible.
- **Front-load the primary keyword.** Words at the start carry more weight for both the algorithm and the eye.
- **Every title on the site must be unique.** Duplicate titles across 40 product variants is the single most common finding in a small-site audit.
- **Brand goes last**, separated by a pipe or dash, and can be dropped entirely on pages where space is tight.

Formulas that work by page type:

| Page type | Formula |
|---|---|
| Product | Product Name — Key Attribute \\| Brand |
| Category | Primary Keyword: Modifier (2026) \\| Brand |
| Guide | Question or Promise \\| Brand |
| Local | Service in City \\| Brand |

### The meta description does not rank you — it does earn clicks

It is not a ranking factor. It is a click-through-rate factor, and click-through rate is worth more than most ranking work. Do the maths:

\`\`\`text
12,000 impressions at position 4
CTR 4.1%  ->  492 clicks
CTR 6.0%  ->  720 clicks    (+228 visits/month, same ranking)
\`\`\`

Write about 150–155 characters, include the keyword so it appears bolded when matched, state the specific benefit, and end with an action. Google rewrites the description roughly 60–70% of the time when it thinks a passage from the page fits the query better. Write it anyway for the pages that matter — being rewritten sometimes is not a reason to leave it empty always.

\`\`\`text
BEFORE  Riverbend Coffee sells a wide range of high quality coffee products.
AFTER   Blade grinders produce dust and boulders in the same batch. See
        what changes when you switch to burr, tested across 6 brew
        methods — and what to spend.
\`\`\`

### Headings are an outline, not a font size

- **One \`<h1>\` per page**, describing the page. It can differ from the title tag; the title is for the results page, the h1 is for the reader.
- **\`<h2>\` for each main section, \`<h3>\` for subsections.** Never skip a level to get smaller text — that is styling, and it belongs in CSS.
- Headings should read as a table of contents on their own. If you read only the headings and cannot tell what the page covers, the page is disorganised, not just badly labelled.
- Write headings as the questions people actually ask. "How long do beans stay fresh?" earns featured snippets; "Freshness" does not.

**The classic mistake:** a theme that wraps the sidebar's "Recent Posts" widget in an \`<h2>\`, or the logo in an \`<h1>\` on every page. Now every page on the site claims to be about your brand name, and the real heading structure is buried. Right-click, inspect, and check what your template is actually emitting before you rewrite a single word of copy.

### The 30-minute win

Export your top 20 pages by impressions from Search Console, sort by click-through rate ascending, and rewrite the titles and descriptions of the ten worst. Those are pages already ranking — you are not fighting the algorithm, only the copy.
        `),
        lesson('Internal Linking and Site Architecture', 13, `
Internal links are the one ranking factor you fully control. Nobody has to agree to them, they cost nothing, and most sites are leaving obvious wins in place for years.

### What an internal link does

1. **Discovery.** A page with no internal links pointing at it — an **orphan page** — may never be crawled at all.
2. **Authority flow.** Ranking strength earned by one page passes along its links. Your homepage usually has the most; every link is a share of it.
3. **Relevance.** The **anchor text** — the visible words in the link — tells Google what the destination is about. This is one of the strongest signals you can send about your own page.
4. **Revenue.** A guide reader who clicks through to a product page is worth far more than one who leaves.

### Anchor text, before and after

\`\`\`text
BEFORE  To learn more about grinders, click here.
AFTER   Our burr grinder buying guide compares 14 models under $200.
\`\`\`

"Click here" tells the algorithm nothing and tells a screen-reader user scanning links nothing either. Descriptive anchors do both jobs at once. Vary them naturally — six links all saying the exact phrase "best burr grinder" reads as manipulation.

### Structure: hub and spoke

Pick a topic you want to own. Build one **pillar page** covering it broadly, and 8–15 **spoke pages** covering specific sub-questions in depth. Every spoke links up to the pillar with a descriptive anchor; the pillar links down to every spoke; closely related spokes link sideways to each other.

\`\`\`text
PILLAR   /guides/coffee-grinding            (broad, targets "how to grind coffee")
SPOKES   /guides/burr-vs-blade
         /guides/grind-size-for-aeropress
         /guides/why-coffee-tastes-bitter
         /guides/cleaning-a-burr-grinder
\`\`\`

Real effect from a real pattern: a pillar page with 4 internal links sitting at position 14 typically moves into the 5–8 range within two months of gaining 12 contextual links from its own cluster. Nothing about the page itself changed.

### Click depth and orphans

Every page that matters should be reachable within **three clicks of the homepage**. Crawl your site with Screaming Frog (free up to 500 URLs), sort by "Inlinks" ascending, and you will find the truth quickly: pages with 0 or 1 internal link, usually old posts and deep product variants. **Add three contextual links to every page with fewer than two.** This is the highest ratio of result to effort in on-page SEO.

### The rules that keep it clean

- Link **from the body copy**, not only from navigation. Contextual links carry more weight and get clicked more.
- **Link from strong pages to the ones that need help**, not the reverse. Your best-ranking guide is an asset; spend it deliberately.
- Keep URLs readable and stable: \`/guides/burr-vs-blade\` beats \`/p?id=8842&cat=17\`. Include breadcrumbs, which also produce the breadcrumb line in search results (next lesson).
- Do not dump 200 links into the footer. Site-wide links carry very little weight and dilute what your body links are saying.

### The classic mistake

Linking every mention of the word "coffee" back to the homepage. The homepage already has more authority than anything else on the site and ranks for your brand regardless; you are spending every link on the page that needs them least, while the guides that could actually rank sit at one inlink each. **Point links downward and inward — toward the pages trying to earn a position, not toward the one that already has it.**

The second version of this mistake is a "nofollow to sculpt PageRank" strategy. It has not worked since 2009; nofollowed links simply lose their share rather than redistributing it.
        `),
        lesson('Structured Data and Rich Results', 12, `
Structured data is a block of machine-readable facts you add to a page. It does not directly raise your ranking. It changes what your result **looks like**, and a result with stars, a price, and stock status against nine plain blue links wins clicks it did not previously deserve.

### What it looks like

Use **JSON-LD** — a script block in the page's head. Google recommends it, and unlike older formats it does not tangle with your HTML.

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Ethiopian Yirgacheffe, Whole Bean 1kg",
  "image": "https://riverbend.example/img/yirgacheffe-1kg.jpg",
  "description": "Washed Yirgacheffe, roasted to order. Jasmine, bergamot, lemon.",
  "brand": { "@type": "Brand", "name": "Riverbend Coffee" },
  "offers": {
    "@type": "Offer",
    "price": "28.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "1900"
  }
}
\`\`\`

Every value there must also be **visible on the page**. Marking up a 4.7 rating that no visitor can see is a policy violation, and the penalty is losing rich results across the whole site, not just that page.

### The types worth your time

| Type | What you gain | Use it on |
|---|---|---|
| \`Product\` + \`Offer\` | Price, availability, stars in the result | Product pages |
| \`Article\` | Eligibility for Top Stories and article carousels | Guides and posts |
| \`BreadcrumbList\` | The readable path replacing the raw URL | Everything with a hierarchy |
| \`LocalBusiness\` | Hours, address, phone in the result and in Maps | Contact and location pages |
| \`Organization\` | Logo and profile links in knowledge panels | Homepage only |
| \`Recipe\`, \`Event\`, \`JobPosting\`, \`Video\` | Dedicated rich formats | Wherever they genuinely apply |

Two notes on what has changed: \`FAQPage\` rich results were cut back in 2023 and now show only for well-known authoritative sites, so adding FAQ markup to a small business site buys nothing. \`HowTo\` results were retired outright. Structured data types come and go — check Google's search gallery before building anything elaborate on one.

### What it is actually worth

Product stars and prices typically lift click-through rate by **10–20% relative** — a page at 4.1% CTR moving to roughly 4.7%. On 12,000 impressions that is about 70 extra visits a month for one block of markup written once. Breadcrumb markup rarely changes CTR but makes deep pages look less like junk in the results.

### Validate, then watch

Paste the URL into Google's **Rich Results Test** to check eligibility, and use the **Schema Markup Validator** for syntax. Then watch Search Console's *Enhancements* reports over the following weeks: they show which pages are valid, which have warnings, and which are invalid. Warnings are optional fields and can usually wait; errors mean no rich result at all.

### The classic mistakes

**Inventing reviews.** A five-star \`aggregateRating\` with no review system behind it is the fastest route to a manual action, and Google audits this category specifically.

**Copying the homepage \`LocalBusiness\` block onto every page**, so a 30-page site claims to be 30 businesses at one address. Mark the business up once, on the page that describes it.

**Marking up and forgetting.** Prices and stock go stale; a result advertising $28 for a product that now costs $34 gets flagged and drops out. If your markup is not generated from the same data as the visible page, it will drift out of sync within a quarter — every time.
        `),
      ],
      [
        q('Rewriting the meta description on a page already ranking at position 4 lifts CTR from 4.1% to 6.0%. What has changed?', [
          'The page ranks higher because meta descriptions are a ranking factor',
          'The page earns about 228 extra visits a month at the same ranking',
          'Nothing, because Google always rewrites descriptions',
          'The page loses long-tail impressions',
        ], 1, 'Descriptions do not rank a page, but on 12,000 impressions that CTR gain converts the same position into far more traffic.'),
        q('Your theme wraps the logo in an <h1> on every page. Why does that matter?', [
          'It slows the page down',
          'It breaks the meta description',
          'Google ignores all headings once one is duplicated',
          'Every page now claims to be about the brand name, so the real heading structure is buried',
        ], 3, 'The h1 should describe the individual page; templating the brand into it makes every page send the same, useless signal.'),
        q('A crawl shows 60 blog posts with one internal link each while every mention of "coffee" links to the homepage. The fix is to', [
          'Add contextual links from strong pages down into the posts that need authority',
          'Add all 60 posts to the footer navigation',
          'Nofollow the homepage links to redistribute authority',
          'Delete the posts with low inlinks',
        ], 0, 'Authority should be spent on pages trying to earn a position, not on the homepage that already ranks for the brand.'),
        q('You add aggregateRating markup showing 4.7 stars, but no reviews appear anywhere on the page. What happens?', [
          'The stars show and CTR improves',
          'Google ignores the markup silently with no other effect',
          'It violates the policy that markup must match visible content, risking rich results across the whole site',
          'The page is deindexed immediately',
        ], 2, 'Structured data must describe what a visitor can actually see; invented ratings are the category Google audits most aggressively.'),
      ]
    ),
    chapter(
      'Technical SEO and Local Search',
      'Getting found by the crawler, staying in the index, passing the speed thresholds, and winning the map pack.',
      [
        lesson('Crawling, Indexing, Canonicals, and Sitemaps', 15, `
Ranking is the third step, and most sites lose before they get there. The sequence is **crawl → index → serve**, and a page can be crawled and still never indexed.

| Step | What happens | Where you check it |
|---|---|---|
| Crawl | Googlebot fetches the URL | Server logs, Crawl Stats report |
| Index | Google decides to store it | Search Console *Page indexing* |
| Serve | It becomes eligible to rank | Performance report |

### robots.txt blocks crawling, not indexing

This distinction causes more damage than any other technical misunderstanding.

\`\`\`text
User-agent: *
Disallow: /cart/
Disallow: /search?
Sitemap: https://riverbend.example/sitemap.xml
\`\`\`

\`robots.txt\` says "do not fetch this". It does **not** say "do not list this". A blocked URL that other sites link to can still appear in results as a bare link with no description — the infamous "Indexed, though blocked by robots.txt".

**The classic mistake** is trying to remove a page from Google by adding it to \`robots.txt\`. To remove a page you use a \`noindex\` meta tag — and for Google to *see* that tag it must be allowed to crawl the page. Block it and \`noindex\` never gets read, so the page stays in the index forever. **Never apply \`robots.txt\` and \`noindex\` to the same URL.** Use \`robots.txt\` for crawl waste (faceted URLs, internal search, cart), \`noindex\` for pages that must not be listed (thank-you pages, thin tag archives, staging).

The worst version of this: a \`Disallow: /\` left in place after a site launch, deindexing everything. Check it on launch day, and check it again a week later.

### Reading the Page Indexing report

| Status | What it means | Action |
|---|---|---|
| Crawled – currently not indexed | Google saw it and judged it not worth storing | Improve depth, add internal links, or delete |
| Discovered – currently not indexed | Never even fetched — crawl budget or quality doubt | Reduce URL bloat, link it better |
| Duplicate, Google chose a different canonical | Two pages look the same | Consolidate or fix canonicals |
| Alternate page with proper canonical tag | Working as intended | None |
| Excluded by noindex | Deliberate — verify it was | Check it is not a money page |

"Crawled – currently not indexed" across dozens of pages is a **quality** verdict, not a bug. Twelve near-identical location or product-variant pages is the usual cause.

### Canonicals consolidate duplicates

One product reachable at four URLs — \`?color=black\`, \`?sort=price\`, a session parameter, and the clean path — is four competing copies. A canonical tag names the real one:

\`\`\`text
<link rel="canonical" href="https://riverbend.example/beans/yirgacheffe-1kg" />
\`\`\`

Put a **self-referencing canonical** on every page; it costs nothing and removes ambiguity. Canonical is a strong hint, not a command — if the tag points somewhere that looks nothing like the page, Google overrules it, which is exactly what "Duplicate, Google chose a different canonical" is telling you.

### Redirects

Use **301** for a permanent move (it passes ranking signals), **302** only for genuinely temporary ones. Redirect each old URL to its **closest equivalent**, not to the homepage — mass homepage redirects are treated as soft 404s and lose everything. Keep chains short: A → B → C wastes crawl budget and leaks signal; point A straight at C.

### Sitemaps

An XML sitemap is a list of URLs you want indexed. It only helps discovery — it does not force indexing.

Include only pages that return **200**, are **indexable**, and are **self-canonical**. Exclude redirects, noindexed pages, and parameter junk. Keep \`lastmod\` honest; a site where every URL claims it changed today gets the field ignored. Limits are 50,000 URLs and 50MB uncompressed per file — split into multiple files with an index above them beyond that, which also makes the coverage report diagnostic per section.

Submit it in Search Console, reference it in \`robots.txt\`, and compare "submitted" against "indexed". A 900-URL sitemap with 210 indexed is a quality conversation, not a technical one.
        `),
        lesson('Core Web Vitals and Mobile', 14, `
Speed is a real ranking factor and a much larger conversion factor. Google measures it with three numbers, taken from **real visitors**, at the **75th percentile**, over a rolling **28 days**.

| Metric | Measures | Good | Needs work | Poor |
|---|---|---|---|---|
| **LCP** — Largest Contentful Paint | When the main content appears | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** — Interaction to Next Paint | How fast the page responds to taps | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** — Cumulative Layout Shift | How much things jump around | ≤ 0.1 | 0.1–0.25 | > 0.25 |

INP replaced First Input Delay in March 2024 and is much harsher: FID measured only the delay before the *first* interaction began, while INP measures how long every interaction takes to produce a visible result. Sites that comfortably passed FID routinely fail INP.

### Field data and lab data are not the same thing

**Lab data** is Lighthouse or PageSpeed Insights running a simulated load on a simulated device. **Field data** is the Chrome User Experience Report: your actual visitors, on their actual phones and networks. Only field data counts for ranking.

**The most common mistake in technical SEO reporting** is celebrating a Lighthouse score of 96 on a developer's laptop while the field data on 4G phones sits at LCP 4.8s and fails. Read the top of the PageSpeed Insights page — the field section — before the score. And read the 75th percentile, not the average: if a quarter of your visitors have a bad experience, you fail.

### What actually causes each failure

| Metric | Usual cause | Fix |
|---|---|---|
| LCP | A 2.4MB hero image | Compress to WebP at the displayed size (~180KB), preload it, never lazy-load the hero |
| LCP | Slow server response (TTFB > 800ms) | Caching, a CDN, better hosting |
| CLS | Images and iframes with no width/height | Set dimensions so the browser reserves the space |
| CLS | A cookie banner or promo bar injected after load | Reserve its height, or overlay rather than push |
| CLS | Web fonts swapping in late | \`font-display: swap\` with a matched fallback metric |
| INP | Heavy JavaScript on the main thread | Remove unused scripts, break up long tasks |
| INP | Third-party marketing tags | Audit them — see below |

### Audit your own tags

A typical small ecommerce site loads 14 third-party scripts: analytics, two ad pixels, a chat widget, a review widget, a heatmap tool, three A/B tools nobody has used since last year. Together they routinely add **1.5–2 seconds** and are the leading cause of INP failures. Open the Network tab, sort by size, and delete every tag whose owner cannot say what decision it informs. This is a marketing job, not a developer job — marketers installed them.

### Mobile-first indexing

Google indexes the **mobile** version of your page. Whatever is not in the mobile HTML effectively does not exist, even if the desktop version is perfect. So mobile and desktop must have parity of: body content, headings, internal links, structured data, and meta tags.

Then the basics: readable text without zooming (16px body minimum), tap targets around 44×44px with space between them, no horizontal scrolling, and **no intrusive interstitials** — a full-screen popup covering the content on arrival from search is an explicit demotion, not a grey area. A small banner, or a popup after real engagement, is fine.

### Keep it in proportion

Core Web Vitals is a tiebreaker between comparable results, not a substitute for relevance. A fast page answering the wrong intent still loses to a slower page answering the right one. Fix "poor" — anything red in field data — because it costs conversions regardless of ranking. Do not spend a quarter chasing 100 out of 100 while your titles and internal links go untouched.
        `),
        lesson('Local SEO and the Map Pack', 13, `
Search "coffee shop near me" and two separate contests are being decided. The **map pack** — three businesses on a map, usually above everything else — and the **local organic** results below it. They rank on different signals, and the map pack takes the majority of clicks.

### The three local ranking factors

1. **Relevance** — does the profile match the search? Driven mostly by your **primary category**.
2. **Distance** — how far the searcher is from you. You cannot change this and you cannot rank across a whole city from one address.
3. **Prominence** — reviews, links, mentions, and how well known the business is offline.

### Google Business Profile is the highest-leverage asset you own

For a business with a physical location, the profile matters more than the website.

- **Primary category** is the single most important field on the internet for a local business. "Coffee shop" and "Coffee roaster" surface for different searches. Pick the one that matches what people search for, then add secondary categories.
- **Hours, including holiday hours.** Wrong hours generate one-star reviews you cannot argue with.
- **Photos.** Profiles with 20+ real photos get meaningfully more direction requests than those with three stock images. Add a few every month; freshness is visible.
- **Services and products** with descriptions and prices, filled in completely.
- **Q&A** — you may ask and answer your own questions. If you leave it empty, strangers answer for you.
- **Posts** — short updates, weekly. Low effort, and they occupy space in your own result.

### Reviews are the compounding asset

| Business | Rating | Reviews | Usually wins |
|---|---|---|---|
| A | 5.0 | 6 | No |
| B | 4.7 | 132 | Yes |

Volume, recency and velocity all count. Ten reviews this month beats 200 from 2019. Ask every satisfied customer, in person or by email, with a direct link. **Respond to every review**, especially the bad ones — a calm, specific reply is read by every future customer, and review text mentioning your services ("best flat white in Leeds") feeds relevance.

Never buy reviews, never gate them ("only leave one if you enjoyed it"), and never review yourself. Detection is good and the penalty is losing the whole review set.

### NAP consistency and citations

Your **N**ame, **A**ddress and **P**hone must be byte-identical everywhere they appear: your site, Google, Apple Maps, Bing Places, Yelp, Facebook, industry directories. "Suite 4" versus "Ste 4" versus an old phone number splits your identity across records and weakens all of them. Fix your own site first, then Google, then the top ten directories in your industry. Hunt down duplicate listings — an old profile from a previous owner competing with yours is common and quietly expensive.

### On the website itself

Give each location a real page with unique content: the address in HTML text (not baked into an image), an embedded map, parking and transport notes, staff, opening hours, and \`LocalBusiness\` structured data from Chapter 2. Three location pages that differ only by the city name get "Crawled – currently not indexed", exactly as Chapter 3 described. Write about the actual place.

### Measuring it

Business Profile performance separates **discovery** searches (someone searched a category and found you) from **direct** searches (they searched your name). Growing discovery is acquisition; growing direct is brand. Then track calls, direction requests, and website clicks — for a café or a plumber, direction requests are a better proxy for revenue than sessions.

### The classic mistake

Stuffing keywords into the business name: "Riverbend Coffee | Best Coffee Shop & Roastery Leeds". It works briefly, competitors report it, and Google edits the name or suspends the profile. Reinstatement takes weeks and you lose the map pack entirely for that time. Your name field is your legal signage, nothing else.
        `),
      ],
      [
        q('You add a live page to robots.txt to get it out of Google. Two months later it still appears. Why?', [
          'Sitemaps override robots.txt',
          'Google caches results for 12 months',
          'Removal always requires a new sitemap submission',
          'robots.txt blocks crawling, not indexing — and blocking it means the noindex tag can never be read',
        ], 3, 'A blocked URL can still be listed from external links, and Googlebot cannot see a noindex directive on a page it is forbidden to fetch.'),
        q('Search Console shows 180 pages as "Crawled – currently not indexed". What does that usually mean?', [
          'The server is returning 500 errors',
          'Google fetched them and judged them not worth storing — usually thin or near-duplicate content',
          'The sitemap is missing those URLs',
          'The pages are blocked by a canonical tag',
        ], 1, 'That status is a quality verdict rather than a technical fault, and near-identical variant pages are the usual cause.'),
        q('Lighthouse scores 96 on the office laptop, but Search Console reports the URL group as failing LCP. Which is right?', [
          'Lighthouse, because it measures the page directly',
          'Neither — LCP applies only to mobile',
          'Search Console, because ranking uses field data from real visitors at the 75th percentile',
          'Whichever was measured most recently',
        ], 2, 'Lab tests simulate one ideal load; only Chrome User Experience field data reflects the devices and networks your visitors actually have.'),
        q('A café renames its Google profile to "Riverbend Coffee | Best Coffee Shop Leeds". What is the likely outcome?', [
          'The name is edited or the profile suspended, costing map pack visibility for weeks',
          'A permanent ranking gain for "coffee shop leeds"',
          'No effect, since the name field is not a ranking factor',
          'The reviews are reset to zero',
        ], 0, 'The name field must match real-world signage; keyword stuffing it is reported by competitors and enforced against routinely.'),
      ]
    ),
    chapter(
      'Content, Links, and Measurement',
      'Planning and writing pages that earn their position, acquiring links you could defend in an audit, and reporting numbers that survive scrutiny.',
      [
        lesson('Content Strategy and Writing That Ranks', 14, `
Content strategy is deciding what to publish and in what order. Writing that ranks is delivering the answer faster and more specifically than the pages already there. Both are unglamorous and both are mostly editing.

### Plan in clusters, not in posts

Take the keyword map from Chapter 1 and group it into clusters, each with one pillar page and 8–15 supporting pages, all interlinked as Chapter 2 described. Publish a whole cluster before starting the next. Ten pages covering one topic thoroughly outrank fifty pages covering ten topics thinly, because relevance accumulates at the topic level, not the page level.

Sequence by **business value first, difficulty second**. Riverbend's order: subscription cluster (value 3, moderate difficulty), grinder cluster (value 2, low difficulty), brewing-method cluster (value 1, very low difficulty and a good place to learn). "History of coffee" never gets written.

### Every page starts as a brief

| Field | Example |
|---|---|
| Primary keyword | burr vs blade grinder |
| Intent and page type | Informational → guide |
| Who it is for | Owns a $20 blade grinder, suspects it is the problem |
| Must cover | Particle size, taste result, price bands, when blade is fine |
| Questions to answer | The four "People also ask" entries, verbatim |
| Internal links | Up to the grinding pillar; out to two product pages |
| Angle | We tested both across 6 brew methods |
| Success metric | Top 5 within 90 days; 40 product clicks a month |

Word count is not a field on this list. Length is a symptom of covering the topic, never a target. "Make it 2,000 words" produces padding, and padding is what a reader bounces from.

### Answer in the first 40 words

Searchers arrive impatient and Google reads the top of the page as your summary. Lead with the answer, then justify it. This is also how featured snippets are won: a direct 40–55 word answer immediately under a question heading.

\`\`\`text
BEFORE  Choosing a coffee grinder can be a daunting task. There are many
        options on the market today, and it is important to consider your
        individual needs and preferences before making a decision.
        (32 words, zero information)

AFTER   A burr grinder crushes beans between two plates and produces grounds
        within about ±100 microns. A blade grinder chops them, producing dust
        and boulders in the same batch — which is why blade-ground coffee
        tastes bitter and sour at the same time. Expect $80–$400 for a burr
        grinder worth owning.
\`\`\`

The second version is barely longer and carries five checkable facts. **Specificity is the whole craft.** Replace every "many", "various", "high quality" and "affordable" with a number, a name, or a price.

### Refresh before you write something new

Content decays. A guide at position 4 slides to 9 over 14 months as competitors update and facts go stale. Each quarter, pull Search Console for pages whose clicks fell most, and update them: current prices, current year in the title, new sections for questions that have appeared in "People also ask", removal of anything now wrong. **A refresh usually returns more traffic per hour than a new post** and needs no new links.

### The classic mistake

Publishing to a schedule rather than to the map. "Two posts a week" fills a calendar with tangential topics nobody searched for, each one an orphan, none reinforcing another. It feels productive and moves nothing. Publish one properly researched, properly interlinked page a fortnight instead, and stop when the cluster is complete.

The related failure is writing for the algorithm: pages assembled from what other pages already say, adding nothing. Google's helpful-content systems are specifically aimed at this, and the visible symptom is a site full of "Crawled – currently not indexed" from Chapter 3. If the page contains no test, no data, no photograph, and no opinion you could be wrong about, it has no reason to outrank what exists.
        `),
        lesson('Link Building That Survives an Audit', 13, `
Links from other sites remain one of the strongest ranking signals, because they are the one thing you cannot award yourself. That is exactly why the shortcuts are policed so heavily.

### Count referring domains, not links

One site linking to you 40 times is roughly one vote. Forty sites linking once each is forty. Track **referring domains** and ignore the raw backlink number in tool dashboards — it is inflated by site-wide footer and blogroll links that count for almost nothing.

Quality is judged by relevance first, then authority, then placement:

| Strong link | Weak link |
|---|---|
| Coffee magazine, in the body of an article | Generic "business directory" |
| The page gets real traffic | The page has no visitors and 300 outbound links |
| Editorially given, in context | Paid, exchanged, or in a footer |
| Topically related to your site | An unrelated niche, or every niche |

### Tactics that work, in order of return

1. **Original data.** Riverbend surveyed 800 home coffee drinkers: 62% had never cleaned their grinder. Cost: $600 and two days. Pitched to 40 journalists and bloggers, it earned 6 links from sites in the 60–80 authority range, plus citations that arrived for a year afterwards. **Nothing else buys links this reliably** — journalists need statistics, and statistics need a source.
2. **Be the source.** Publish a statistics page for your industry and keep it current. It accumulates links passively.
3. **Genuine guest contributions** to publications with real readers, where you would want the traffic even with no link at all. That last condition is the filter.
4. **Unlinked mention reclamation.** Search your brand name, find the articles that mention you without linking, and email the author. Conversion on this is high because the endorsement already exists.
5. **Relationships you already have.** Suppliers, trade associations, event listings, local press, "stockists" pages, sponsorships you genuinely fund. Boring and durable.
6. **Broken link building.** Find dead pages on resource lists in your niche, offer your live equivalent.

### The outreach email

\`\`\`text
BEFORE  Subject: Link exchange opportunity
        Hi, I came across your amazing blog and I really loved your content.
        I have written an article that your readers would find valuable...

AFTER   Subject: 62% never clean their grinder — data for your bitterness piece
        Hi Sam — your piece on bitter coffee cites the 2019 SCA figure.
        We surveyed 800 UK home brewers last month; 62% have never cleaned
        their grinder, with the breakdown by machine type here: [link].
        Use it however is useful, credit or not.
\`\`\`

The second names the person, names their article, and offers something they can use. Response rates on specific, useful pitches run around 8–15%; on the first template, under 1%.

### What to avoid, and why

Buying links, private blog networks, mass guest posting, comment and forum spam, directory blasts, and reciprocal link schemes are all covered by Google's link spam policies. The current enforcement mostly **neutralises** the links rather than penalising the site — which means the $300 you spent on 200 links bought exactly nothing, and if a manual action does land you lose rankings across the whole domain until you clean up and get reinstated.

Watch **anchor text distribution** too. A natural profile is roughly 60% brand or bare URL, 25% generic or partial phrases, under 10% exact-match keywords. A profile where 70% of anchors say "best coffee subscription uk" is a pattern no editor produces by accident.

### The classic mistake

Chasing the linking site's authority score while ignoring whether the page has any readers. A guest post on a domain-authority-70 site that publishes 40 sponsored articles a week, on a page nobody visits, is worth less than a link from a 25-authority regional food blog whose readers are exactly your customers. **If you would not want the click, do not want the link.**
        `),
        lesson('Analytics: Goals, Reports, and Attribution', 15, `
Analytics is only worth having if it changes decisions. Start from the decision and work backwards to the number, never the other way around.

### Write the measurement plan before touching a tool

| Business goal | KPI | Event to track | Threshold |
|---|---|---|---|
| Sell more beans | Orders, revenue | \`purchase\` | 300/month |
| Build the list | Subscribers | \`newsletter_signup\` | 400/month |
| Fill the café | Direction requests | Profile actions | 900/month |
| Prove content works | Guide → product path | \`view_item\` after a guide | 40%/month growth |

Anything not on this list is a report nobody reads.

### Macro and micro conversions

Track the sale, but also track the steps: newsletter signup, add to basket, checkout start, 60-second engagement on a guide, product-page click from a guide. Micro conversions are what let you judge a top-of-funnel page fairly, which is the fairness problem from Chapter 1.

Give leads a value so they can be compared with sales. Riverbend's wholesale form: 100 enquiries → 18 become accounts → average first-year gross profit $1,200. That is **$216 per enquiry**, and it means an $80 cost per lead is excellent, not expensive.

### Reading a traffic report without fooling yourself

Know what the words mean. **Users** are people (approximately — really browsers), **sessions** are visits, and a **session** ends after 30 minutes of inactivity. One person visiting four times is 1 user and 4 sessions; reporting the larger number because it looks better is the oldest trick in the trade.

Default channel groupings: Organic Search, Direct, Referral, Paid Search, Paid Social, Organic Social, Email. **Direct is a junk drawer** — genuine type-ins, but also untagged email clicks, PDFs, apps, QR codes, and anything that lost its referrer over an HTTPS-to-HTTP hop. A sudden jump in Direct is almost always a tagging failure, not a surge of brand love.

### UTM tags, and the mistake that corrupts everything

\`\`\`text
https://riverbend.example/subscribe
  ?utm_source=newsletter
  &utm_medium=email
  &utm_campaign=october_subscription
\`\`\`

Two rules. **Lower-case everything and keep a shared spreadsheet of the values you use** — \`Facebook\`, \`facebook\` and \`FB\` become three different channels and your social numbers split three ways.

And the one that silently ruins reports: **never put UTM tags on internal links between your own pages.** A tagged internal link starts a brand-new session and reassigns the credit, so the homepage banner takes the sale away from the organic search that actually delivered the visitor. Once it is in place, every channel report has been quietly wrong for months.

### Attribution: who gets the credit

A customer sees an Instagram post, reads a guide from Google two weeks later, clicks a retargeting ad, then searches the brand name and buys.

| Model | Credit goes to | Consequence if you rely on it |
|---|---|---|
| Last click | Brand search | You cut the channels that created the demand |
| First click | Instagram post | You over-invest in the top of the funnel |
| Linear | 25% each | Simple, but treats a glance as equal to a decision |
| Data-driven | Modelled from real paths | The sane default, and now the GA4 default |

Also expect the platform to disagree with your analytics. Facebook Ads reporting 40 conversions while GA4 reports 9 is normal, not a bug: the platform counts view-through conversions and claims anyone who saw the ad within its attribution window, while GA4 counts the last click. Pick **one** system as the source of truth for budget decisions and hold every channel to it.

### Two habits that separate analysts from dashboard-readers

**Segment before concluding.** "Conversion rate fell to 1.9%" usually means mobile fell while desktop held, or one campaign brought unqualified traffic.

**Respect noise.** A move from 2.1% to 2.3% on 200 sessions is 4 orders versus 5. That is not a trend, and rebuilding a page because of it is how teams stay busy while nothing improves.
        `),
      ],
      [
        q('Which brief field should NOT drive how a page gets written?', [
          'A 2,000-word length target',
          'The intent and page type shown by the results page',
          'The questions in the "People also ask" box',
          'The internal links the page must send and receive',
        ], 0, 'Length is a symptom of covering the topic properly; setting it as a target produces padding that readers bounce from.'),
        q('A site buys 200 links for $300 and sees no ranking change at all. What most likely happened?', [
          'The links need six months to take effect',
          'Google needs a disavow file before counting them',
          'The links were neutralised as link spam, so the money bought nothing',
          'The links were too topically relevant to count',
        ], 2, 'Current enforcement mostly ignores paid and networked links rather than penalising, so the spend simply produces no signal.'),
        q('Organic traffic looks flat but Direct has doubled since the new email campaign launched. What should you check first?', [
          'Whether the email links are missing UTM tags',
          'Whether the sitemap has been resubmitted',
          'Whether Core Web Vitals regressed',
          'Whether brand awareness has genuinely increased',
        ], 0, 'Direct is where untagged traffic lands, so an unexplained jump alongside a campaign is nearly always a tagging failure.'),
        q('Facebook reports 40 conversions for a campaign; GA4 reports 9. What is the right conclusion?', [
          'GA4 is broken and should be reinstalled',
          'The campaign should be paused for underperformance',
          'The pixel is firing twice',
          'Both are counting differently — platform view-through vs last click — so pick one source of truth for budget decisions',
        ], 3, 'Ad platforms claim view-through and longer windows while analytics counts the last click, so the gap is expected rather than an error.'),
      ]
    ),
    chapter(
      'Paid, Email, and Social',
      'Buying attention without overpaying for it, owning an audience nobody can take away, and using social for the job it is actually good at.',
      [
        lesson('Paid Basics: Search vs Social, Bidding, and Quality Score', 15, `
Paid media is not a different discipline from everything so far — it is the same funnel with a faster feedback loop and a meter running.

### Search harvests demand, social creates it

| | Paid search | Paid social |
|---|---|---|
| Targeting is based on | What they typed | Who they are and what they do |
| Intent | High — they asked for this | None — you interrupted them |
| Typical cost per click | $0.60–$4.00 | $0.20–$1.20 |
| What decides success | Keyword and landing page match | Creative, by a wide margin |
| Funnel stage | Decision | Awareness and consideration |
| Realistic conversion rate | 3–6% | 0.5–2% |

Cheaper clicks are not cheaper customers. Riverbend's social clicks cost a third of its search clicks and convert at a fifth of the rate, which makes social the more expensive channel per order — and still worth running, because it is what fills the search demand two months later.

### The auction is not won by the highest bid

Every search runs an auction, and position is decided by **Ad Rank ≈ your bid × Quality Score** (plus the effect of extensions and formats). Quality Score, on a 1–10 scale, is built from three things:

1. **Expected click-through rate** — the heaviest component.
2. **Ad relevance** — does the ad text match the query.
3. **Landing page experience** — does the page deliver what the ad promised, quickly.

Worked example:

\`\`\`text
Advertiser A:  bid $4.00 x Quality Score 4  =  Ad Rank 16
Advertiser B:  bid $2.00 x Quality Score 9  =  Ad Rank 18   <- wins

B pays: (competitor Ad Rank 16 / own QS 9) + $0.01 = $1.79 per click
\`\`\`

B wins the higher position at less than half the bid. **Quality Score is a discount, not a vanity metric** — the practical route to it is one tight ad group per intent, the query echoed in the headline, and a landing page that shows exactly what the ad promised.

### Match types and the negative keyword list

- **Exact** \`[coffee subscription]\` — that query and close variants.
- **Phrase** \`"coffee subscription"\` — that meaning, with words around it.
- **Broad** \`coffee subscription\` — anything Google judges related, which includes a great deal you did not want.

Run the search terms report weekly. A new broad-match account typically burns **30–40% of its budget** on terms like "free coffee samples", "coffee shop jobs", "coffee subscription cancel" and "how to make coffee". Add each as a negative keyword. **Not building a negative list is the single most expensive mistake in small ad accounts**, and it compounds daily while the dashboard shows a healthy click-through rate.

### Work out what a click is allowed to cost

Do this before launching, never after:

\`\`\`text
Average order value          $34.00
Gross margin 55%             $18.70 gross profit per order
Target cost per acquisition  $12.00   (leaves $6.70 contribution)
Landing page conversion rate  3.2%
Maximum cost per click = $12.00 x 0.032 = $0.38
\`\`\`

If the keyword costs $1.40 a click, you are not "testing" — you are losing $1.02 per click by arithmetic. Either the conversion rate has to triple, the margin has to grow, or that keyword is not for you.

Judge campaigns on **cost per acquisition** and **ROAS**, never on click-through rate or impressions. And read ROAS at margin: 3.4× revenue on a 55% margin is 1.87× gross profit — real, but half as impressive as it sounds.

### Getting social ads right

The creative *is* the targeting now; platforms find the audience if the creative signals who it is for. Run 3–5 genuinely different concepts, not five colours of the same image, and let them run: an ad set needs roughly 50 conversions a week to exit the learning phase, so a $10/day budget spread over six ad sets learns nothing and spends everything.

Match the ad to the landing page exactly. An ad promising "1kg Ethiopian, $28, free delivery" that lands on a generic homepage wastes the click, and in search it also lowers Quality Score, so you pay more for the next one too.
        `),
        lesson('Email Marketing', 13, `
Email is the only audience you own. Social reach is rented from an algorithm that can halve it overnight; search rankings are rented from an algorithm that can do the same. A list of 8,400 addresses is yours, and it is why email routinely returns more revenue per hour of work than anything else in this course.

### Build the list with an exchange, not a request

\`\`\`text
BEFORE  "Subscribe to our newsletter"                        -> 1.2% of visitors
AFTER   "The 6 mistakes that make home coffee bitter —
         one email, no course, no spam."                     -> 3.8% of visitors
\`\`\`

On 12,000 monthly visits that is 144 signups versus 456. Same traffic, same popup, different offer. Say what they get, how often, and make it specific to why they were on the page. **Never buy a list** — the addresses are unengaged at best and spam traps at worst, and one traps your domain.

### Deliverability is a prerequisite, not a detail

Email that lands in spam has no metrics worth discussing.

- **Authenticate the domain**: SPF says which servers may send as you, DKIM signs each message, DMARC tells receivers what to do when the first two fail. Set all three once, with your email platform's instructions.
- **Send from your own domain**, never a free address.
- **Keep spam complaints under 0.1%** — one in a thousand. Above that, providers start filtering everything you send.
- **One-click unsubscribe, visible.** Hiding it converts unsubscribes into spam complaints, which are far more damaging.
- **Sunset inactive subscribers.** Anyone who has not opened in 180 days is dead weight; try one re-permission email, then remove them.

**The classic mistake**: a company that has not emailed in a year blasts its entire 20,000-address list to "re-engage". Bounces spike, complaints spike, and the sending domain gets throttled or blocked — so the next campaign, to the people who *did* want it, never arrives. Warm up gradually: most recent 500 first, then widen as the metrics hold.

### The automations earn more than the campaigns

| Flow | Trigger | Typical result |
|---|---|---|
| Welcome (3 emails) | Signup | Highest open rates you will ever see; sets expectations |
| Abandoned basket (1h, 24h, 72h) | Basket, no order | Recovers 5–12% of abandoned baskets |
| Post-purchase | Order shipped | Drives review requests and reorders |
| Winback | 120 days inactive | Cheap revenue from people who already trust you |

Riverbend's numbers from Chapter 1: 430 checkouts started, 258 completed, so **172 abandoned**. Recovering 9% of them is 15 orders, about **$510 a month**, from three emails written once. That is a better return than any equivalent hour spent on new traffic.

### Segment, and stop reporting open rates

Send different things to different people: buyers in the last 90 days, lapsed at 12 months, subscribers who have never ordered, subscription customers. A relevant offer to 900 people beats a generic one to 8,400 on revenue and on complaint rate.

Since Apple's Mail Privacy Protection pre-loads images, **open rates are inflated and no longer comparable** — a 42% "open rate" may be 20% real. Judge on click rate, conversion rate, and above all **revenue per recipient**: total revenue ÷ emails delivered. That number is honest, comparable across sends, and directly answers whether the email was worth writing.

### Subject lines, briefly

Specific beats clever. "Your grinder is why the coffee is bitter" outperforms "Our October Newsletter" every time, because it names a problem the reader recognises. Keep it under about 50 characters so it survives on mobile, use the preheader as a second line rather than letting the client fill it with "View in browser", and never mislead — a bait subject line earns one open and one unsubscribe.
        `),
        lesson('Social Media Strategy', 12, `
Social media's job in the funnel is awareness and trust, and it is measured badly almost everywhere because people ask it to produce last-click sales it was never going to produce.

### Pick two platforms, not six

Choose on two criteria: where your buyers already are, and which format you can sustain weekly for a year. A café that can shoot 30-second videos belongs on TikTok and Instagram; a B2B roasting-equipment supplier belongs on LinkedIn and YouTube. **Two platforms done consistently beat six done occasionally**, because every platform rewards frequency and punishes gaps.

### Content pillars and a real calendar

Three or four recurring themes, drawn straight from the positioning proofs in Chapter 1. Riverbend's:

| Pillar | Share | Example |
|---|---|---|
| Brewing help | 40% | "Your grind is too fine — here is how it looks when it is right" |
| Behind the roastery | 30% | Tuesday roast day, green beans arriving |
| Origin stories | 20% | The Yirgacheffe co-op, with photographs |
| Offers | 10% | Subscription launch |

That ratio matters. An account that is 80% offers gets muted; the useful posts are what earn the right to make the occasional ask.

### Understand what you are actually buying

Organic reach on most platforms is **2–5% of followers** for a typical post. On 4,000 followers that is 80–200 people. If your plan depends on organic reach to drive sales, the arithmetic never works.

What the algorithms reward is watch time, saves, shares and comments — signals that a stranger found it worth their time. Which is why "10 grind sizes, one photo each" outperforms "New bags in stock" by an order of magnitude, and why the second post only works at all once the first ones have built an audience.

### Measure the job, not the vanity

| Do not report | Report instead |
|---|---|
| Follower count | Email signups from social |
| Impressions | Saves and shares per post |
| Likes | Branded search volume in Search Console |
| Last-click sales from social | Assisted conversions and direction requests |

Branded search is the sharpest signal available: if social is working, more people search "riverbend coffee" by name each month, and Search Console shows exactly that. It also explains why social always looks weak on last-click reports from Chapter 4 — the sale gets credited to the brand search that social caused.

### Make one asset go six places

Film a two-minute grinder comparison once. That becomes a short-form video, three still images with captions, a written guide on the site (Chapter 4's cluster), an email, a Business Profile post, and a paid social creative. Teams that "cannot keep up with content" are usually producing one thing per channel instead of one thing for all of them.

### Amplify what already works

Let posts run organically for a week, then put a small budget behind the top 10% — the ones that already proved strangers respond to them. This is far more efficient than promoting a post because a manager liked it, and it is the cleanest bridge between organic social and the paid tactics in this chapter's first lesson.

### The classic mistake

Broadcasting rather than participating. Posting daily product photos, never replying to comments, never answering a direct message inside a day. Social platforms are conversation systems; an account that only transmits gets deprioritised by the algorithm and ignored by humans. Budget as much time for replies as for posting, and treat the reply as the marketing — it is read by everyone who scrolls past afterwards.
        `),
      ],
      [
        q('Advertiser A bids $4.00 with Quality Score 4; advertiser B bids $2.00 with Quality Score 9. What happens?', [
          'A wins because the bid is higher',
          'Both pay their full bid',
          'B wins the better position and pays about $1.79 per click',
          'The auction is decided by daily budget',
        ], 2, 'Ad Rank multiplies bid by Quality Score, so B ranks 18 against 16 and pays only enough to beat the advertiser below.'),
        q('A new broad-match campaign shows a healthy CTR but no sales. What should you check first?', [
          'Raise bids to reach position 1',
          'Add more keywords to the ad group',
          'Switch the landing page to the homepage',
          'The search terms report, for irrelevant queries that need negative keywords',
        ], 3, 'Broad match commonly spends 30–40% of budget on unrelated searches, which produces clicks that could never convert.'),
        q('Why should you judge email on revenue per recipient rather than open rate?', [
          'Apple Mail Privacy Protection pre-loads images, so open rates are inflated and not comparable',
          'Open rate is not reported by most platforms',
          'Revenue per recipient is easier to inflate',
          'Open rates only apply to automated flows',
        ], 0, 'Machine-triggered opens broke the metric, while revenue divided by emails delivered stays honest and comparable across sends.'),
        q('Social posts get 4,000 impressions a month and almost no last-click sales. What is the best conclusion?', [
          'Social does not work for this business and should be dropped',
          'Social is doing an awareness job, so measure saves, shares, email signups and branded search instead',
          'The posting frequency should be doubled immediately',
          'The budget should move entirely to paid social',
        ], 1, 'Awareness channels rarely take the last click, so they must be judged on the demand they create further up the funnel.'),
      ]
    ),
    chapter(
      'Conversion Rate Optimisation and Testing',
      'Finding the leak before you test anything, running experiments whose results you could defend in a meeting, and building landing pages that keep the promise the ad made.',
      [
        lesson('Finding the Leak Before You Test It', 13, `
Chapter 1 asked you to circle your worst step rate. For Riverbend that circle is product page to basket: 4,800 product views, 720 baskets, **15%**. Eighty-five per cent of the people interested enough to open a product page left without it. This lesson is how you find out why, before you spend a month testing the wrong thing.

### Segment first, because an average hides the fault

Split the number before you look at anything else. Device, then traffic source, then new versus returning.

| Segment | Product views | Added to basket | Rate |
|---|---|---|---|
| Desktop | 1,900 | 380 | 20.0% |
| Mobile | 2,900 | 340 | 11.7% |
| **All traffic** | **4,800** | **720** | **15.0%** |

The site does not have a 15% problem. It has a mobile problem, on 60% of its traffic. Every hour spent on the desktop layout is an hour spent on the smaller third of the leak.

### Four tools, cheapest first

**1. The funnel report.** In GA4: Explore, then Funnel exploration. Steps \`view_item\` to \`add_to_cart\` to \`begin_checkout\` to \`purchase\`, with device as the breakdown dimension. Switch on elapsed time — a step that takes people 90 seconds is a step they are struggling with, even when they eventually complete it.

**2. Session recordings and heatmaps.** Microsoft Clarity is free and Hotjar has a free tier. Do not binge them. Filter to the exact failure — mobile sessions that viewed a product and left without adding — and watch fifteen. Fifteen is usually enough to see the same thing three times, and three times is a finding rather than an anecdote.

On Riverbend's mobile product page you see it inside five sessions: the image gallery is 900px tall, so price, weight selector and the Add to basket button all sit below the fold on a phone. The tooling flags the symptoms independently — **dead clicks** on gallery images where people expect a zoom that does not exist, and **rage clicks** on a size button that is greyed out with no explanation.

**3. Form analytics** for anything with fields. Field-level drop-off tells you exactly which question people refuse to answer. Riverbend's wholesale enquiry form loses 41% of the people who start it at "VAT number" — a field the sales team has never once used.

**4. Ask people.** A one-question exit poll — *"What nearly stopped you buying today?"* — on mobile product pages for a week produces more usable direction than a quarter of dashboard-watching. Support tickets and the counter staff in the cafe are free research that nobody reads.

### Turn findings into ranked hypotheses

Score each one so the running order is not decided by whoever spoke last in the meeting. **ICE** works: Impact, Confidence, Ease, each scored 1 to 5, multiplied.

| Finding | Proposed change | I | C | E | Score |
|---|---|---|---|---|---|
| Buy button below the fold on mobile | Sticky buy bar with price | 5 | 5 | 4 | 100 |
| Shipping cost only revealed at checkout | Show delivery price on the product page | 4 | 4 | 5 | 80 |
| VAT field abandoned by 41% | Delete the field | 3 | 5 | 5 | 75 |
| Dead clicks on the gallery | Add pinch zoom | 2 | 3 | 3 | 18 |

Confidence is where the honesty lives. A 5 means you watched real people fail at it; a 2 means somebody had an idea. Teams that inflate confidence end up with a test queue sorted by enthusiasm.

### The classic mistake

Copying somebody else's test. "A case study says removing the navigation lifted conversion 12%" — that was their diagnosis, on their traffic, for their problem. Their nav was in the way; yours might be the only route to the size guide. **You cannot borrow a conclusion, only a method.**

The second, quieter mistake is testing where there is no traffic. A page with 300 sessions a month cannot finish a test this year, as the next lesson works out in numbers. Fix low-traffic pages by judgement and known good practice, and spend your scarce testing capacity on the pages carrying the volume.
        `),
        lesson('Running an A/B Test You Can Trust', 15, `
A test answers exactly one question: is the difference you are looking at bigger than the noise? Nearly every failure in conversion testing is a failure to respect that sentence.

### Write the hypothesis before you build the variant

> Because **mobile recordings show the buy button below a 900px gallery**, we believe **a sticky buy bar showing price and Add to basket** will raise **mobile add-to-basket rate** from **11.7% to at least 14%**. We judge it on add-to-basket rate, with **revenue per session** as the guardrail.

The guardrail matters as much as the target metric. Plenty of changes lift a micro conversion and cost money — a large discount banner raises add-to-basket rate and destroys margin at the same time.

### Sample size decides whether the test is even possible

For a 95% two-sided test at 80% power, a reliable desk approximation for the sessions needed **per variant** is:

\`\`\`text
n = 16 x p x (1 - p) / d²

p = baseline rate                (0.15)
d = absolute lift to detect      (0.015 = a 10% relative lift)

n = 16 x 0.15 x 0.85 / 0.015²  =  9,067 per variant
\`\`\`

Now hold that against the traffic you actually have. 4,800 product views a month is about 1,100 a week, so 550 per variant per week.

| Lift you want to detect | Absolute d | Per variant | Weeks needed |
|---|---|---|---|
| 5% relative | 0.0075 | 36,300 | 66 |
| 10% relative | 0.015 | 9,100 | 17 |
| 20% relative | 0.030 | 2,270 | 5 |
| 30% relative | 0.045 | 1,010 | 2 |

Read the 10% and 20% rows together: **doubling the effect you are willing to detect cuts the required sample roughly fourfold**, because d is squared. On this traffic, polish tests are simply not available. Test the sticky buy bar, not the button colour — and if the only honest option is a bold change, make the bold change.

### Duration rules that are not negotiable

- **Two full weeks minimum, and always whole weeks.** Tuesday behaves nothing like Saturday, so a test that starts on Monday and ends on Friday has quietly over-weighted the working week.
- **Stop on the pre-declared date or sample, never on the number.**
- Cover a full business cycle. If you email the list on the 1st, the test window must contain one.

### Peeking is the bug that manufactures winners

Checking a live test every morning and stopping the first day it crosses 95% turns a 5% false-positive rate into roughly **25–30%**. You are taking twenty looks at the noise and stopping on whichever one flatters you. One in three or four of your celebrated wins is then nothing at all, which is precisely why so many teams have a folder full of successful tests and a flat revenue line.

Two legitimate fixes: fix the sample and the end date up front and do not look, or use a tool with **sequential testing** built in, which is designed for continuous monitoring.

### Small numbers, big claims

\`\`\`text
Control  12 orders / 300 sessions = 4.0%
Variant  18 orders / 300 sessions = 6.0%      "+50% uplift!"

95% confidence interval on that difference: about -1.4pp to +5.4pp
\`\`\`

The interval contains zero, and it contains a loss. "+50%" is a headline written over six extra orders. Report the interval or report nothing.

### Sample ratio mismatch: check it every single time

You split 50/50 and the tool reports 52.6% against 47.4% across 18,000 sessions. That gap is far too large to be chance, so the split itself is broken — a redirect failing on one variant, bot traffic landing in one bucket, a caching layer serving control twice. **An SRM invalidates the entire test.** Throw the result away and fix the plumbing; never "adjust for it".

Two more mechanical faults worth knowing. **Flicker**, where a client-side tool paints the original and then swaps it, which both biases behaviour and damages the LCP you fixed in Chapter 3. And running two tests on the same page at once without accounting for how they interact.

### Expect to lose

Mature programmes win roughly **one test in five**, and the honest ones count flat results as losses. That is not failure, it is the cost of finding the change worth keeping. What makes the programme pay is the log — every test, its hypothesis, its result and what it taught — so you stop re-running the same idea every eighteen months.
        `),
        lesson('Landing Pages and Message Match', 13, `
Chapter 5 flagged the ad promising "1kg Ethiopian, $28, free delivery" that lands on a generic homepage. Here is the page it should have landed on, and why building it is usually worth more than another week of bid tuning.

### Message match is the first rule

Whatever the ad promised, the page repeats in the same words, above the fold. The visitor arrives with one sentence in their head. If the page does not confirm that sentence within about two seconds they assume they clicked the wrong thing and leave.

\`\`\`text
AD        1kg Ethiopian Yirgacheffe - $28, free delivery, roasted Tuesday

HOMEPAGE  "Riverbend Coffee - premium coffee, roasted with passion"      1.1%
LANDING   "Ethiopian Yirgacheffe, 1kg - $28 with free delivery.
           Roasted Tuesday, at your door Thursday."                      3.8%
\`\`\`

At $0.90 a click that is a cost per acquisition of **$82 against $24**. Nothing in the ad account changed. Chapter 5's Quality Score rewards it a second time: landing page experience is one of its three components, so the better page also lowers what you pay for the next click.

### What belongs above the fold

Five things, and nothing else:

1. **The promise**, as the headline, in the ad's own language.
2. **One line naming who it is for** — "whole bean, for people who own a grinder", Chapter 1's positioning finally earning its keep.
3. **A real photograph of the actual product**, not a stock image of someone smiling at a mug.
4. **One action.** One button, one colour, repeated down the page rather than competing with other actions.
5. **The nearest proof** — price, delivery cost, 4.7 from 1,900 reviews, the roast-date guarantee.

Below that, answer objections in the order people raise them: when does it arrive, what if I do not like it, is it ground or whole bean, who are you. Put the button under each answer.

### Forms: every field has a price

| Fields | Typical completion |
|---|---|
| 3 | 39% |
| 6 | 28% |
| 11 | 14% |

Ask for what you need to take the next step and nothing more. Riverbend's wholesale form lost 41% of its starters on a VAT number the sales team never used, so deleting the field is a free win that needs no test at all — there is no trade-off to measure. Allow guest checkout, set the right mobile keyboard with \`inputmode="numeric"\` on postcode and card fields, and validate inline instead of returning six red errors after submit.

### Remove the exits, keep the trust

Paid landing pages usually perform better with site navigation removed or cut back, because every nav item is an exit. Treat that as a strong default rather than a law, and test it on pages with enough traffic to test, per the previous lesson.

Trust is mostly specificity. Delivery price stated before checkout. A returns policy written as one sentence a human can read. Payment marks at the payment step, where the anxiety actually is. Real reviews beside the button, not a testimonial carousel three screens down.

And keep the page fast. This is the page you paid to send people to, which makes it the worst possible place for a hero carousel, four web fonts and eleven tracking tags. Chapter 3's LCP budget applies here with money attached to every second.

### The classic mistake

Sending all paid traffic to the homepage because "the homepage converts at 2.15%, which is fine". Segment that number and it collapses: the homepage rate is propped up by brand searchers and returning customers who had already decided to buy. Non-brand paid visitors landing there convert at roughly a third of the rate, and the blended figure hides it completely.

The mirror-image mistake is a landing page carrying five calls to action — buy, subscribe, download the guide, book a tasting, follow us. Every extra choice is taken out of the primary one. **One page, one job, one button.**

### Do this now

Take your three highest-spending ads. Open each one's landing page on a phone and read only what is visible without scrolling. If the ad's promise is not in that first screen, in the ad's own words, you have found this week's work.
        `),
      ],
      [
        q('A product page gets 4,800 views a month at a 15% add-to-basket rate. A test designed to detect a 5% relative lift needs about 36,000 sessions per variant. What should you do?', [
          'Run it anyway and read the result after three weeks',
          'Split traffic 90/10 so the winner gets more exposure',
          'Test a bigger change, since doubling the lift you detect cuts the sample roughly fourfold',
          'Stop the test the first day it reaches 95% significance',
        ], 2, 'Sample size scales with the square of the effect you want to detect, so on modest traffic only substantial changes are testable at all.'),
        q('You check a running test every morning and stop it the first day it shows 95% significance. What is wrong with that?', [
          'Significance cannot be calculated until a test has ended',
          'Repeated looks inflate the false-positive rate well above 5%, so many of those wins are noise',
          'The testing tool only updates its numbers once a week',
          'Nothing, provided the total sample is over 1,000',
        ], 1, 'Every extra look is another chance for random fluctuation to cross the threshold, which is why peeked tests produce winners that never replicate.'),
        q('Your 50/50 test reports 52.6% of sessions in control and 47.4% in the variant across 18,000 sessions. What does that tell you?', [
          'The variant is losing and should be stopped early',
          'Nothing — random splits are never exactly even',
          'The totals should be weighted to correct the imbalance',
          'A sample ratio mismatch: the split is broken, so the whole result must be discarded',
        ], 3, 'A gap that size cannot happen by chance, so something is misassigning traffic and every number in the test is suspect.'),
        q('Your homepage converts at 2.15%, so you send all paid traffic there instead of building landing pages. Why is that reasoning wrong?', [
          'The homepage rate is propped up by brand and returning visitors, while non-brand paid clicks need the ad promise repeated on the page',
          'Google Ads does not allow homepages as landing pages',
          'The homepage loads too slowly to accept paid traffic',
          'Paid traffic is excluded from the homepage conversion rate',
        ], 0, 'A blended rate hides the segment you are actually buying, and paid non-brand visitors landing on a generic page convert at a fraction of it.'),
      ]
    ),
    chapter(
      'Traffic Drops, Migrations, and Budget',
      'What to do when the graph falls off a cliff, how to move a site without losing the rankings you earned, and how to split a fixed budget between channels that all claim the credit.',
      [
        lesson('Diagnosing a Traffic Drop', 14, `
The graph falls off a cliff on a Tuesday and somebody wants an answer by lunchtime. Work the list in order, cheapest and most likely first, and write down what you rule out — because the second-worst outcome is spending a fortnight fixing something that was never broken.

### Step 1: is the traffic gone, or only the measurement?

Compare two systems that do not share a tag. If **Search Console** clicks are flat while **GA4** organic sessions fell 60%, the visitors are still arriving and your measurement is broken. The usual causes: a deploy that dropped the container from the template, a consent banner change that now blocks the tag by default, a tag that never fires on the routes of a new single-page app, or somebody adding UTM parameters to internal links and re-attributing everything, exactly as Chapter 4 warned.

If both systems fell, the traffic is genuinely gone. Continue.

### Step 2: is it the calendar?

Compare **year on year**, never month on month. Riverbend loses roughly 30% of its coffee searches every August and gets them back in September; a report that calls that a crisis every year burns the credibility you will need during a real one. Check too for a missing day of data, a bank holiday, or a platform-side outage.

### Step 3: which segment fell?

This is where the diagnosis actually happens. In Search Console, split the drop by:

- **Brand versus non-brand queries.** A drop that is entirely brand queries is not an SEO problem at all — it is a PR event, a seasonal brand dip, or a competitor bidding on your name.
- **Page group.** All of \`/guides/\` but none of \`/beans/\` points at one template or one content assessment. Everything falling equally points at something site-wide: robots, a server fault, or a domain-level action.
- **Country and device.** A mobile-only drop usually means a mobile template change, and Chapter 3's mobile-first indexing is the mechanism that turns it into a ranking loss.

### Step 4: read the fingerprint

| Impressions | Clicks | Avg position | Most likely cause |
|---|---|---|---|
| Flat | Flat in GSC, gone in GA4 | Flat | Tracking break |
| Flat | Down | Flat | Something now sits above you: AI overview, ads, a carousel |
| Down | Down | Worse | Ranking loss: an update or a competitor overtaking you |
| Down hard | Down hard | Missing | Pages have fallen out of the index — technical |
| Down | Down | Flat | Fewer people are searching: seasonality or a dead trend |

Row two is the one people misdiagnose most often. You are still at position 3; the results page changed shape above you. There is no ranking work to do — the available moves are better titles and descriptions from Chapter 2, structured data, or accepting that this query set is no longer worth chasing.

### Step 5: what did you change?

Before blaming Google, read your own deploy log for the week before the drop. Template changes, a plugin update, a new cookie banner, a canonical rewritten by a CMS setting, a \`robots.txt\` shipped from staging, a new CDN rule. **Most "algorithm updates" are a deploy.** Fetch the live \`robots.txt\`, run a key page through URL Inspection, and confirm the rendered HTML still contains the content and the internal links it had last month.

### Step 6: was there a confirmed update, and does it line up?

Google's Search Status Dashboard publishes the start and end date of every ranking update. If your drop is on the 4th and the rollout began on the 12th, it is not the update. While you are in Search Console, check **Security and Manual Actions** — a manual action is rare, but it is the one cause that needs a reconsideration request rather than a fix.

### The classic mistake

"It was a core update" offered as a diagnosis. That is a category, not a cause: you still have to name the pages, the queries and the pattern they share. The second mistake follows straight from the first — shipping fifteen fixes in one week, so that when traffic returns nobody can say which one did it, including you, in the next drop.

Set expectations as well. Technical faults recover within days of the fix and a recrawl. A quality assessment from a core update is usually only re-evaluated at the next update, potentially months away, and the work in between is Chapter 4's content work rather than a trick.
        `),
        lesson('Site Migrations Without Losing Rankings', 13, `
Every migration is the same job: make sure every URL that held value points, in one hop, at the page that inherits it. Almost every migration disaster traces back to one missing spreadsheet.

### Know which kind you are doing

| Migration | Risk | Note |
|---|---|---|
| Design refresh, same URLs | Low | Watch content and internal links, not redirects |
| HTTP to HTTPS | Low to medium | Redirect every URL, update internal links and canonicals |
| URL structure change | Medium | The redirect map is the whole job |
| Platform or CMS replatform | High | URLs, templates, content and speed all change at once |
| Domain change | High | Add Change of Address in Search Console |
| Consolidating two sites | Highest | Two redirect maps plus a duplication problem |

Doing two of these in one release does not save a weekend. It removes your ability to diagnose the drop, because the fingerprint work in the previous lesson cannot separate two simultaneous causes.

### Build the redirect map from four sources

Crawl the **old** site before anything changes. Once it is gone you cannot get this back.

1. A full crawl — Screaming Frog is free to 500 URLs — capturing every URL that returns 200.
2. Search Console, last 12 months, every page with clicks or impressions.
3. GA4 landing pages, last 12 months.
4. Top pages by **referring domains** from a backlink tool. This is the source people forget: a 2019 press page with almost no traffic can be holding a third of your links, and dropping it throws away the asset you spent Chapter 4 earning.

Deduplicate into one sheet:

| Old URL | Status | Clicks 12m | Ref domains | New URL | Type |
|---|---|---|---|---|---|
| /blog/burr-vs-blade | 200 | 4,100 | 12 | /guides/burr-vs-blade | 301 |
| /coffee.php?id=88 | 200 | 340 | 0 | /beans/yirgacheffe-1kg | 301 |
| /old-press-2019 | 200 | 6 | 31 | /about/press | 301 |
| /tag/coffee | 200 | 0 | 0 | — | 410 |

Three rules. **Closest equivalent, never the homepage** — Chapter 3 covered why mass homepage redirects are read as soft 404s and pass nothing. **One hop only**, so no A to B to C chains. And a deliberate \`410\` for pages that genuinely should die, rather than a redirect to something irrelevant that Google will treat the same way.

### Pre-launch

- Staging is password-protected or \`noindex\`, and that block lives in the deploy config, not in a file somebody has to remember to change.
- Every internal link, canonical, sitemap entry and navigation item in the new build points at **new** URLs directly. Relying on your own redirects for internal navigation wastes crawl budget and slows every page for real users.
- Analytics, tags and the consent banner are installed on the new templates and verified on staging.
- A crawl of staging shows the expected titles, h1s, structured data and word counts. Content silently dropped by a new template is the second most common migration loss, behind redirects.

### Launch day, in this order

1. Remove the staging block, then **check the live \`robots.txt\` and a live page's meta robots within five minutes**. Shipping \`Disallow: /\` or a site-wide \`noindex\` from staging is the single most expensive mistake in this lesson, and it is common.
2. Deploy the redirects, then crawl the old URL list and confirm every row returns a single 301 landing on a 200. No chains, no loops, no 404s.
3. Submit the new XML sitemap, and keep a sitemap of the **old** URLs live for a few weeks so Google recrawls them and finds the redirects quickly.
4. For a domain change, verify the new property and run **Change of Address**.
5. Annotate the date in analytics, so the next person reading the graph knows what the step is.

### Weeks one to six

Expect a dip. Even a clean migration usually loses **10–20% for two to six weeks** while Google recrawls and reassigns signals. Watch, in this order: Page indexing coverage, the 404 report, crawl stats, then clicks by page group. A gradual return is normal. A flat line at minus 40% after six weeks is a redirect map with holes in it, and the fix is to crawl the old URL list again and find the rows nobody mapped.

### The classic mistake

Changing URLs "for SEO" with no other reason. The gain from a keyword in a URL is close to nothing and the migration risk is not. If your current URLs are readable and stable, leave them alone — the best migration is the one you did not need to do.
        `),
        lesson('Splitting the Budget and Reporting It', 14, `
Every channel in the last six chapters can prove it works if it is allowed to pick its own metric. Real budget decisions come from marginal return, holdout tests, and one number nobody can argue with.

### Average return hides the decision; marginal return is the decision

After the checkout and product-page fixes from Chapter 6, Riverbend is running about 315 orders a month at $18.70 gross profit each. The ceiling for a new customer is $12 on the first order alone, or roughly $16 if you accept Chapter 1's finding that payback lands on order two.

| Channel | Monthly spend | New customers | Average CPA | CPA of the last $500 added |
|---|---|---|---|---|
| Brand search | $400 | 48 | $8.33 | $11 |
| Non-brand search | $2,000 | 125 | $16.00 | $23 |
| Paid social prospecting | $900 | 22 | $40.91 | $61 |
| Email flows | $180 tooling | 96 | $1.88 | — |

Read the last column, not the third. Non-brand search averages a healthy $16, but the next $500 costs $23 per customer, which is above the ceiling — so the correct answer is not "search works, spend more". **Every channel gets more expensive as you scale it**, because you buy the cheapest demand first. The job is to find the point on each curve where the next dollar stops paying, and stop there.

### Before adding budget, check there is anything left to buy

Brand search has the best CPA on the sheet and almost no headroom, because only so many people search your name each month. Google reports **search impression share lost to budget**: if that figure is 4%, more money buys you 4% more of something small. A channel capped by demand rather than by budget will spend any increase on worse inventory, which is exactly what the marginal CPA column is showing you.

### Incrementality: would they have bought anyway?

Brand search is the standing example. Some of those 48 customers typed your name and would have clicked the organic result underneath, for free.

Run a **geo holdout**. Split comparable regions into two matched halves, pause brand ads in one half for three weeks, and compare **total** orders — paid plus organic together, never paid alone.

\`\`\`text
Holdout regions   brand ads paused    total orders  -6%
Control regions   brand ads running   total orders  -1%   (baseline drift)

Incremental effect = about 5% of orders, not the 15% brand search claims
\`\`\`

Typical finding: **60–80% of brand-search conversions are not incremental**. That does not automatically mean stop — sometimes you are defending the click from a competitor bidding on your name — but you now know what you are buying, which is more than any platform report will ever tell you.

### The number nobody can argue with

Chapter 4's attribution arguments end at **blended CAC** and **MER**, the marketing efficiency ratio:

\`\`\`text
Blended CAC = all marketing spend / all new customers
            = $3,480 / 291 = $11.96

MER         = total revenue / total marketing spend
\`\`\`

No model, no cookie window, no platform's opinion of itself. Track both monthly alongside the channel view. When a platform reports a 6x ROAS and blended CAC has not moved at all, that 6x was mostly reallocation.

### A budget frame that survives contact with reality

**70 / 20 / 10.** Seventy per cent to what is proven at an acceptable marginal CPA, twenty to scaling whatever is currently improving, ten to genuinely new bets — a new channel, a new creative format — each with a **kill criterion written before it starts**: "if CPA is above $30 after $1,000 of spend, we stop." Bets without a kill number quietly become permanent line items.

### The monthly report is one page

- Three numbers: revenue, new customers, blended CAC, each against last month and the same month last year.
- Three things that moved, and why, in one sentence each.
- The experiment log from Chapter 6: what ran, what won, what is next.
- Three decisions requested, each with the number that triggers it.

Nobody reads a forty-tab dashboard, and building one is a way of avoiding a recommendation.

### The classic mistake

Cutting the channel with the worst last-click CPA. That is almost always the awareness channel from Chapter 5 which fills the brand search you are crediting; cut it and brand search shrinks a quarter later, at which point nobody connects the two events — Chapter 1's failure again, now with a budget attached. **Run the holdout before you cut, not after.**
        `),
      ],
      [
        q('GA4 organic sessions fell 60% overnight, but Search Console clicks for the same period are unchanged. What happened?', [
          'A core algorithm update hit the site',
          'The measurement broke — the visitors are still arriving but the tag is not recording them',
          'The affected pages were dropped from the index',
          'Seasonality, which always shows up first in GA4',
        ], 1, 'Two systems that do not share a tag disagreeing means the fault lies in the one doing the tagging, not in the traffic itself.'),
        q('Impressions and average position are flat, but clicks are down 30% and CTR with them. What is the likely cause?', [
          'A manual action against the site',
          'The XML sitemap needs resubmitting',
          'Crawl budget has been exhausted',
          'The results page changed shape above you — an AI overview, ads or a carousel taking the clicks',
        ], 3, 'Holding position while losing clicks is a click-through problem on the results page, not a ranking loss you can fix by optimising further.'),
        q('A replatform retires 900 URLs and redirects them all to the new homepage. What is the result?', [
          'They are treated as soft 404s, so the rankings and links those pages held are lost',
          'Authority is consolidated onto the homepage, which usually helps it rank',
          'Google follows each redirect on to the closest matching new page automatically',
          'Nothing is lost, because a 301 always passes full signal',
        ], 0, 'A redirect only passes signal when the destination is a genuine equivalent, and a mass homepage redirect is read as page-not-found.'),
        q('Brand search shows the lowest CPA in the account at $8.33. Should you move budget into it?', [
          'Yes — always fund the lowest-CPA channel first',
          'Yes, but only after refreshing the ad creative',
          'Check impression share lost to budget and run a geo holdout first, since most brand clicks are not incremental',
          'No — brand terms should never be paid for under any circumstances',
        ], 2, 'A low average CPA can hide both a demand ceiling and traffic that would have arrived organically for nothing.'),
      ]
    ),
  ],
  final: [
    q('A site converts 2.15% of visitors and loses 85% of product-page visitors before the basket. The best next move is to', [
      'buy twice as much traffic',
      'fix the product page to basket step before increasing spend',
      'add a second social platform',
      'rewrite the homepage headline',
    ], 1, 'Improving a step rate multiplies traffic you have already paid for, while more traffic multiplies the same leak.'),
    q('Which sentence is real positioning?', [
      'Premium quality at an affordable price',
      'The leading provider of coffee solutions',
      'Passionate about great coffee since 2011',
      'Roasted Tuesday, in your kitchen Thursday — for people who own a grinder',
    ], 3, 'It names a specific buyer and makes a falsifiable claim, which is exactly what the other three cannot do.'),
    q('Every result for a keyword is a product or category page. What should you build to target it?', [
      'A product or category page, because the results reveal the intent Google has already decided on',
      'A long-form blog post, which gives more room for the keyword',
      'A homepage section, since the homepage is strongest',
      'A PDF guide gated behind an email form',
    ], 0, 'You cannot outrank a page type by offering a different one; matching intent is the entry requirement, not an optimisation.'),
    q('A page is blocked in robots.txt and also carries a noindex tag, yet it stays in the index. Why?', [
      'noindex only works on the homepage',
      'The sitemap is overriding the tag',
      'Googlebot cannot crawl the page, so it never reads the noindex directive',
      'Canonical tags always take precedence over noindex',
    ], 2, 'Crawling and indexing are separate steps, and a directive on a page Google is forbidden to fetch can never be seen.'),
    q('PageSpeed Insights shows a Lighthouse score of 96 but the field data fails LCP. Which drives ranking?', [
      'The Lighthouse score, since it is measured directly',
      'The field data, because it reflects real visitors at the 75th percentile over 28 days',
      'Whichever number is higher',
      'Neither — Core Web Vitals is not a ranking input',
    ], 1, 'Lab tests simulate one ideal load, while Core Web Vitals assessment uses real Chrome user data from your actual audience.'),
    q('Which internal linking change usually produces the biggest gain?', [
      'Adding contextual links from strong pages to pages with fewer than two inlinks',
      'Adding 200 links to the site footer',
      'Linking every mention of the main keyword to the homepage',
      'Nofollowing navigation links to conserve authority',
    ], 0, 'Orphaned and near-orphaned pages are where authority and discovery are missing, and contextual body links carry the most weight.'),
    q('Publishing two posts a week on whatever topic is convenient tends to fail because', [
      'Google penalises frequent publishing',
      'Posts under 2,000 words cannot rank',
      'Search Console cannot track more than one post a week',
      'unclustered posts stay orphaned and reinforce no topic, so relevance never accumulates',
    ], 3, 'Relevance builds at the topic level through interlinked clusters, not by adding unrelated pages to a calendar.'),
    q('Untagged links in an email campaign will show up in analytics as', [
      'Organic Search',
      'Referral from the email provider',
      'Direct, because Direct collects any traffic with no identifying source',
      'Paid Social',
    ], 2, 'Direct is the junk drawer for untracked traffic, which is why an unexplained Direct spike usually means a tagging failure.'),
    q('Two advertisers compete: one bids high with a poor landing page, one bids low with a tightly matched ad and page. Who typically wins the position at a lower cost?', [
      'The low bidder, because Quality Score multiplies the bid into a higher Ad Rank',
      'The high bidder, because auctions are decided by budget',
      'Neither — position rotates evenly',
      'Whoever has been advertising longer',
    ], 0, 'Ad Rank is bid multiplied by Quality Score, so relevance functions as a direct discount on cost per click.'),
    q('Which metric best shows that organic social is doing its job?', [
      'Follower count growth',
      'Growth in branded search volume and email signups attributable to social',
      'Total impressions per month',
      'Likes per post',
    ], 1, 'Social works upstream of the click, so demand it creates shows up as people later searching the brand and joining the list.'),
    q('A test on a page with 300 sessions a month shows a 40% lift after nine days. What is the honest reading?', [
      'It is a clear winner and should be rolled out to everyone',
      'It should run one more day to confirm the result',
      'The sample is far too small — the confidence interval on that difference spans losses as well as gains',
      'The result is invalid because tests must be run on desktop traffic only',
    ], 2, 'A handful of extra conversions on a few hundred sessions produces huge percentage swings that carry almost no information.'),
    q('An ad promises "1kg Ethiopian, $28, free delivery". Where should the click land?', [
      'On a page whose headline repeats that promise in the same words, with one action',
      'On the homepage, because it carries the most authority',
      'On a blog post about Ethiopian coffee regions',
      'On the category page listing all 12 origins',
    ], 0, 'Message match confirms within seconds that the visitor clicked the right thing, and it lifts Quality Score as well as conversion rate.'),
    q('Organic clicks fell 45% on the 4th. A confirmed core update began rolling out on the 12th. What follows?', [
      'The update caused it, because core updates are applied retroactively',
      'The drop and the update are the same event seen twice',
      'Nothing can be diagnosed until the rollout finishes',
      'The update cannot be the cause — look at your own deploys and template changes from that week instead',
    ], 3, 'A cause cannot come after its effect, and most drops blamed on updates turn out to be a release the site shipped itself.'),
    q('Non-brand search averages a $16 CPA, but the last $500 added cost $23 per customer against a $16 ceiling. What should you do?', [
      'Increase spend, since the average is still under the ceiling',
      'Hold spend where the marginal cost crosses the ceiling, rather than scaling on the average',
      'Cut the channel entirely, because part of its spend is unprofitable',
      'Move the budget to whichever channel reports the highest ROAS',
    ], 1, 'Scaling decisions are made on the cost of the next customer, not on the blended average of the customers you have already bought.'),
  ],
});
