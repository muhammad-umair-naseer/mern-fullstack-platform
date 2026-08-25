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
        `,
        [
          q('Which row of the Riverbend funnel table is the worst leak?', [
            'Visit to product page view, at 40%',
            'Product page view to add to basket, at 15%',
            'Checkout start to purchase, at 60%',
            'Purchase to repeat purchase within 90 days, at 24%',
          ], 1, 'It loses 85% of the people who were interested enough to open a product page, the largest drop among visitors who have already shown intent.'),
          q('A guide answering "why is my coffee bitter" converts at 0.2%. What is the right response?', [
            'Cancel it, because it does not pay for itself',
            'Gate it behind an email form so it produces leads',
            'Add a discount code to force conversions',
            'Keep it and judge it on awareness metrics, because its job is to enter the consideration set weeks before a purchase',
          ], 3, 'Each asset is scored against the job of its funnel stage, and cutting top-of-funnel pages quietly starves the decision stage two quarters later.'),
          q('A team calculates lifetime value as $34 average order x 2.6 orders = $88.40 and sets its CAC ceiling from that. What is wrong?', [
            'LTV must be taken at gross margin, so the real figure is $48.62',
            'Lifetime orders should be counted over 12 months only',
            'CAC should be compared with average order value instead',
            'Nothing, as long as the ratio stays above 2:1',
          ], 0, 'Revenue-based LTV counts money that goes straight to cost of goods, which inflates the budget you believe each customer can carry.'),
        ]),
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
        `,
        [
          q('What is the test that separates positioning from wallpaper?', [
            'Whether it names the product category',
            'Whether it is shorter than twelve words',
            'Whether a direct competitor could paste it onto their homepage tomorrow without lying',
            'Whether it contains the primary keyword',
          ], 2, 'A sentence any rival could truthfully claim describes the category, not you, so it cannot make anyone choose you.'),
          q('Narrowing the claim takes Riverbend from 12,000 visits at 2.15% to 7,000 visits at 4.5%. What has that trade bought?', [
            'More impressions for the same spend',
            '315 orders instead of 258, and roughly half the keyword list to earn, at the cost of reach',
            'A higher average order value',
            'A lower cost per click across every channel',
          ], 1, 'Fewer but better-matched visitors produced more orders while halving the number of keywords the site has to compete for.'),
          q('"We offer 12 origins" or "roast date printed on every bag" — which belongs on the homepage under the claim?', [
            'The 12 origins, because range appeals to more buyers',
            'Neither; a homepage should carry only the claim',
            'Both, joined in one sentence',
            'The roast date, because it is proof that makes the headline claim checkable',
          ], 3, 'Proof is evidence a stranger can verify, while a feature list belongs further down the funnel on a product page.'),
        ]),
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
        `,
        [
          q('"History of coffee in Ethiopia" has 12,000 searches a month and weak competition. What score does it get on business value, and what follows?', [
            '0 — the volume is real but nobody searching it is a buyer, so it does not get written',
            '3 — large volume always converts to commercial value eventually',
            '2 — it can be linked to product pages',
            '1 — write it last, once everything else exists',
          ], 0, 'Business value is scored separately from volume precisely so that large, buyerless topics are rejected rather than ranked.'),
          q('How do you judge whether a keyword is realistically winnable this year?', [
            'By the difficulty score a tool reports, taken on its own',
            'By comparing your total traffic with the top-ranking site',
            'By opening the top ten and counting referring domains against your own profile',
            'By the number of words in the query',
          ], 2, 'If the weakest page in the top ten has 180 referring domains and you have 12, no amount of page quality closes that gap this year.'),
          q('You publish separate pages for "burr vs blade grinder", "is a burr grinder worth it" and "difference between burr and blade". What happens?', [
            'Each ranks for its own phrase, tripling the traffic',
            'Cannibalisation — Google rotates one of them, all three underperform, and internal links are split between them',
            'Google merges them into a single result automatically',
            'The oldest of the three is deindexed',
          ], 1, 'Queries wanting the same answer belong on one page, because splitting them splits both the relevance signals and the internal links.'),
        ]),
        lesson('Competitor Analysis and the Keyword Gap', 13, `
Your ranking is a position relative to other people. Competitor analysis is how you find out who those people actually are, and which of their positions are takeable this year rather than in principle.

### Search competitors are not business competitors

Riverbend names three rival roasters it meets at trade shows. Run the twenty keywords from the keyword map and a different list appears: one of those roasters, a kitchen magazine, a gear review site, and a supermarket. The magazine and the review site take most of the informational traffic that feeds the top of the funnel, and neither of them sells a bean.

Build the set from evidence rather than memory. Take your 20 highest-value keywords, record the domains in each top ten, and count.

| Domain | Top-10 appearances (of 20) | Avg position | What it wins |
|---|---|---|---|
| beanreview.example | 16 | 3.4 | Comparison and "best" queries |
| kitchenmag.example | 11 | 5.1 | Troubleshooting and how-to |
| rivalroaster.example | 9 | 6.8 | Origin pages, subscription |
| riverbend.example | 4 | 8.9 | Brand plus two product terms |

That table is the strategy conversation. Riverbend is not losing to the roaster it worries about at trade shows; it is absent from the two publishers that own the questions its buyers ask first.

### Share of voice turns twenty rankings into one number

Weight each keyword by volume and by what a position at that rank actually earns. A workable planning curve:

| Position | 1 | 2 | 3 | 4-6 | 7-10 |
|---|---|---|---|---|---|
| Share of clicks | 27% | 15% | 11% | 6% | 2% |

Estimated clicks equals volume multiplied by the rate for your position, summed across the keyword set, divided by all the clicks available in it. Riverbend scores 3% of its own category; beanreview.example takes 41%. Track that quarterly. It moves slowly, which is exactly what makes it honest — a chart of individual rankings looks busy while nothing has really changed.

### The gap analysis, and which gaps to take

Export the keywords each competitor ranks in the top ten for and you do not rank for at all. Then filter, hard.

| Keyword | Volume | Their position | Referring domains of the weakest top-10 result | Business value | Verdict |
|---|---|---|---|---|---|
| how to store coffee beans | 4,400 | 2 | 14 | 2 | Take it |
| coffee subscription uk | 2,900 | 4 | 260 | 3 | Not this year |
| grind size chart | 1,600 | 6 | 9 | 2 | Take it |
| history of coffee | 12,000 | 3 | 40 | 0 | Never |

Two of those rows are work. The other two fail the tests from the previous lesson: one is defended by links you cannot match in twelve months, and one has no buyers behind it at any position.

### Copy the shape, not the page

Open the result that beats you and answer four questions. What does it answer in its first 40 words? What proof does it carry that you could not invent — its own photographs, a test, a price table? What page type is it? How many internal links does its own site point at it? Every one of those is reproducible. Word count is not a target, it is a symptom, and matching it is how you end up with 2,400 words of padding wrapped around the same thin answer.

### Watch what they ship

Once a month, check three things: their XML sitemap for new URLs, their offer and pricing pages for changes, and their new referring domains in a backlink tool. A competitor that picked up 40 new domains in a month did something specific and repeatable — usually a data study of the kind Chapter 4 covers. You can read the tactic straight off their link profile.

### The classic mistake

Benchmarking against the strongest domain on the results page. Wikipedia, a national newspaper and a magazine with 4,000 referring domains are not your competition; the tenth result is. If the weakest page in the top ten has 14 referring domains and answers the question in three thin paragraphs, that is the position you are buying, and the entry price is far lower than the top of the page suggests.

### Do this now

Take your 20 highest-value keywords, build the appearance table, and mark the three keywords where the weakest top-ten result sits within reach of your own link profile. Those three are the first cluster you build in Chapter 4.
        `,
        [
          q('You name three rival roasters, but the top ten for your 20 target keywords is dominated by a kitchen magazine and a gear review site. What follows?', [
            'Ignore them, because they do not sell what you sell',
            'Target only the keywords your rival roasters already rank for',
            'They are your search competitors for the queries that feed the funnel, so the competitor set has to be built from the results pages',
            'Bid on their brand names in paid search instead',
          ], 2, 'Whoever occupies the top ten is who you have to displace, regardless of whether they compete with you commercially.'),
          q('Two gaps: "coffee subscription uk" at business value 3, where the weakest top-ten page has 260 referring domains, and "grind size chart" at value 2, where the weakest has 9. Which do you take first?', [
            'Grind size chart, because the entry price matches the link profile you actually have',
            'Coffee subscription uk, because business value always wins',
            'Both at once, to hedge the outcome',
            'Neither, because search volume should decide the order',
          ], 0, 'A gap is only an opportunity when the weakest page holding the position is one you can realistically outrank this year.'),
          q('What should you take from a competitor page that outranks you?', [
            'Its word count, matched or exceeded',
            'Its keyword density',
            'Its publishing frequency',
            'Its shape — the answer in the first 40 words, the proof it carries, the page type, and the internal links pointed at it',
          ], 3, 'Those elements are reproducible causes of the ranking, whereas length is only a by-product of covering the topic.'),
        ]),
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
        `,
        [
          q('Your title is 58 characters yet it is still cut off in the results. Why?', [
            'Google truncates on pixel width, around 580px, so capitals and wide letters run out of room sooner',
            'Titles longer than 50 characters are always truncated',
            'The brand name must come first or the title is cut',
            'The meta description length pushes the title out',
          ], 0, 'Truncation is measured in pixels, not characters, so two titles of identical length can cut at different points.'),
          q('Google rewrites your meta descriptions roughly 60-70% of the time. What follows?', [
            'Leave them blank and let Google choose every time',
            'Repeat the title tag in the description',
            'Still write them for the pages that matter, since being rewritten sometimes is not a reason to leave them empty always',
            'Move the description text into the h1',
          ], 2, 'The description is a click-through-rate lever on the pages you care about, and Google only substitutes its own when it judges a passage fits better.'),
          q('A designer skips from h2 straight to h4 because h4 is the size they want. What is the objection?', [
            'h4 text is too small to read on mobile',
            'Headings are the page outline, so level order carries meaning; size belongs in CSS',
            'Google reads only h1 and h2',
            'Skipping a level breaks the meta description',
          ], 1, 'Heading levels describe structure, and using them for visual size destroys the outline a reader and a crawler both rely on.'),
        ]),
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
        `,
        [
          q('What is an orphan page?', [
            'A page with no outbound links',
            'A page missing from the XML sitemap',
            'A page nobody has visited in 90 days',
            'A page with no internal links pointing at it, which may never be crawled at all',
          ], 3, 'Discovery runs along internal links, so a page nothing links to can sit unfetched indefinitely regardless of its quality.'),
          q('Why replace "click here" with "our burr grinder buying guide compares 14 models under $200"?', [
            'Longer anchors rank better because of their length',
            'Anchor text tells Google what the destination is about, and tells a link-scanning reader the same thing',
            '"Click here" is penalised by Google',
            'It increases the total number of links on the page',
          ], 1, 'The visible words of a link are one of the strongest relevance signals you control, and they double as accessibility.'),
          q('A developer offers to put all 300 pages in the footer so nothing is more than one click deep. What is the problem?', [
            'Site-wide footer links carry very little weight and dilute what the body links are saying',
            'Footers cannot contain links to product pages',
            'Click depth has no effect on crawling',
            'Google ignores any page linked from more than one place',
          ], 0, 'Contextual links inside body copy carry the weight and the clicks; a 300-link footer mostly adds noise to every page on the site.'),
        ]),
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
        `,
        [
          q('What does valid Product markup actually do for a page?', [
            'It raises the ranking directly by a small amount',
            'It changes what the result looks like, typically lifting click-through rate by 10-20% relative',
            'It replaces the meta description in the results',
            'It guarantees a rich result on every query',
          ], 1, 'Structured data is not a ranking signal; it earns clicks by adding stars, price and availability beside nine plain blue links.'),
          q('You plan to add FAQPage markup to a small business site to take more space in the results. What should you expect?', [
            'Roughly double the click-through rate',
            'A manual action for over-marking a page',
            'Nothing — FAQ rich results were cut back in 2023 and now show only for well-known authoritative sites',
            'The FAQ answers to be used as your meta description',
          ], 2, 'Rich result types are withdrawn as well as added, so eligibility has to be checked in the search gallery before the work is planned.'),
          q('A price changes from $28 to $34 in the CMS but the JSON-LD still says $28. What happens?', [
            'Google averages the two values',
            'The visible price is ignored in favour of the markup',
            'Nothing, since price is an optional field',
            'The mismatch is flagged and the rich result drops out, which is why markup must be generated from the same data as the page',
          ], 3, 'Hand-maintained markup drifts out of sync within a quarter, and a result advertising a stale price is exactly what Google removes.'),
        ]),
        lesson('Images, Alt Text, and URL Slugs', 12, `
Two on-page details get delegated to whoever uploads the page and are then never revisited: the URL and the image. Both are cheap to get right on the way in and expensive to change afterwards.

### URLs are read by people first

\`\`\`text
BEFORE  /blog/2019/11/post-id-8842?ref=nav
AFTER   /guides/burr-vs-blade
\`\`\`

Rules that hold up:

- **Short, lower-case, hyphen-separated.** Underscores are not word separators, so \`burr_vs_blade\` reads as a single token.
- **No dates in the path.** A URL containing \`/2019/\` looks stale in the results for the next six years, and it discourages refreshing the page rather than replacing it.
- **Drop the stop words, keep the meaning.** \`/guides/how-to-store-coffee-beans\` is fine; \`/guides/store-coffee\` saves nine characters and loses the topic.
- **One folder of meaning per cluster** — \`/guides/\`, \`/beans/\`, \`/subscription/\`. That grouping is what makes the page-group segmentation in Chapter 7 possible when traffic moves.
- **Stable.** A keyword in a slug is worth very little; the redirect risk of changing it is real. If the URL is readable, leave it alone.

### Filenames are content too

\`IMG_4821.jpeg\` tells Google nothing. \`yirgacheffe-1kg-whole-bean.webp\` describes the picture before anything else on the page does, and image search is a genuine traffic source for products, food and anything visual.

### Alt text is written for a person, not a crawler

The test: if the image failed to load and someone read the alt text aloud, would the sentence still make sense?

| Image | Weak alt | Strong alt |
|---|---|---|
| Product photo | \`coffee\` | \`1kg bag of Riverbend Ethiopian Yirgacheffe with the roast date stamped on the front\` |
| Grind comparison | \`coffee beans grinder best burr grinder uk\` | \`Grounds from a burr and a blade grinder side by side, showing even particles against dust and boulders\` |
| Decorative divider | \`decoration\` | \`alt=""\`, so screen readers skip it |

Three rules. Describe what the image shows and why it is there. Keep it under about 125 characters, which is where common screen readers cut. And give decorative images an **empty** alt attribute rather than **no** alt attribute — a missing attribute makes the reader announce the filename instead.

Stuffing keywords into alt text is one of the few old tricks that is both useless and actively hostile to a blind visitor using your site.

### Captions are read more than your body copy

People read captions and skip paragraphs. A caption is therefore the cheapest place on the page to put a fact: the price, the finding, the difference between the two photographs.

### Markup that earns image traffic

\`\`\`html
<figure>
  <img src="/img/burr-vs-blade-grounds.webp"
       srcset="/img/burr-vs-blade-grounds-480.webp 480w,
               /img/burr-vs-blade-grounds-960.webp 960w"
       sizes="(max-width: 600px) 100vw, 600px"
       width="960" height="640" loading="lazy"
       alt="Burr grounds beside blade grounds on white paper, showing even particles against dust and boulders">
  <figcaption>Same beans, same 15 seconds. The blade batch contains dust and chunks at once.</figcaption>
</figure>
\`\`\`

\`width\` and \`height\` protect the CLS score from Chapter 3, because the browser reserves the space before the file arrives. \`loading="lazy"\` belongs on everything **except** the largest image above the fold — lazy-loading the hero delays the very paint that LCP measures.

### The classic mistake

Loading product photography as a CSS \`background-image\`. It is invisible to image search, it cannot carry alt text, and a screen reader has nothing to describe. Backgrounds are for decoration; anything that is content belongs in an \`<img>\` element.

The second is renaming URLs during a redesign because somebody wanted keywords in them, with no redirect map. That is Chapter 7's migration lesson, caused here, for a gain measured in rounding error.

### Do this now

Crawl the site and list two things: content images with a missing alt attribute or an alt that just repeats the filename, and URLs carrying a date or a query string. Fix the alt text everywhere. Fix URLs only where they are genuinely unreadable, and redirect every one you change.
        `,
        [
          q('What alt text should a purely decorative divider image carry?', [
            'A short keyword phrase describing the page',
            'An empty alt attribute, so screen readers skip it',
            'No alt attribute at all',
            'The image filename',
          ], 1, 'An empty alt tells assistive technology to ignore the image, while a missing attribute makes it read out the filename instead.'),
          q('Product photography is loaded as a CSS background-image. What is lost?', [
            'Nothing, provided the file is compressed properly',
            'Only the ability to lazy-load it',
            'Caching, because background images are re-fetched on every view',
            'Image search visibility, alt text, and any description for screen readers',
          ], 3, 'A background image is decoration as far as the browser and the crawler are concerned, so content should always be a real img element.'),
          q('Which image should not get loading="lazy"?', [
            'The largest image above the fold, because lazy-loading it delays the paint LCP measures',
            'Images below the fold on mobile',
            'Any image inside a figure element',
            'Images in the footer',
          ], 0, 'Lazy loading defers the request, which is exactly the wrong thing to do to the element that defines Largest Contentful Paint.'),
        ]),
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
        `,
        [
          q('You retire 40 old blog URLs during a cleanup. What is the correct treatment for each?', [
            'A 301 to the homepage, to consolidate authority',
            'A 301 to the closest equivalent page, in a single hop with no chain',
            'A 302 to the blog index until you decide',
            'A custom 404 page explaining the move',
          ], 1, 'A redirect only passes signal when the destination is a genuine equivalent, and chains waste crawl budget while leaking value.'),
          q('Your sitemap lists 900 URLs and Search Console reports 210 indexed. What does that mean?', [
            'The sitemap file is malformed',
            'Sitemaps have to be resubmitted weekly to take effect',
            'A sitemap aids discovery but does not force indexing, so this is a content quality conversation',
            'The other 690 URLs must be blocked in robots.txt',
          ], 2, 'Listing a URL only offers it to Google; whether it is stored is a judgement about the page, not about the sitemap.'),
          q('A page carries a canonical pointing elsewhere and Search Console reports "Duplicate, Google chose a different canonical". What is happening?', [
            'Canonical is a strong hint rather than a command, and Google has overruled a tag that does not match the page',
            'The canonical tag contains a syntax error',
            'The page has been penalised for duplication',
            'Both URLs will now be removed from the index',
          ], 0, 'When the declared canonical looks nothing like the page, Google substitutes its own choice and tells you so in that report.'),
        ]),
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
        `,
        [
          q('Your site passed FID comfortably but fails INP. How is that possible?', [
            'INP is measured only on desktop',
            'FID measured only the delay before the first interaction began, while INP measures how long every interaction takes to paint a result',
            'INP replaced CLS, so the thresholds moved',
            'FID scores carry over for 28 days and mask the new metric',
          ], 1, 'INP judges the full response of every interaction, which exposes slow handlers that the old first-input-delay metric never looked at.'),
          q('Content jumps down the page a second after load and CLS sits at 0.28. What is the most likely cause?', [
            'A slow server response time',
            'Too much JavaScript occupying the main thread',
            'A cookie banner injected after load, or images with no width and height reserving no space',
            'Images served as WebP rather than JPEG',
          ], 2, 'Layout shift comes from content arriving without its space reserved, which is why dimensions and reserved banner height fix it.'),
          q('A pricing table is hidden on mobile to save space but is present on desktop. What is the consequence?', [
            'None, because Google indexes the desktop version',
            'It improves mobile usability with no trade-off',
            'The table ranks only for desktop searches',
            'Google indexes the mobile version, so content missing there effectively does not exist',
          ], 3, 'Mobile-first indexing means the mobile HTML is the page as far as Google is concerned, whatever the desktop version contains.'),
        ]),
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
        `,
        [
          q('Which Google Business Profile field does the most for local relevance?', [
            'The business description',
            'The primary category',
            'The website URL',
            'The number of photos uploaded',
          ], 1, 'The primary category decides which searches the profile is eligible for, so "coffee shop" and "coffee roaster" surface in different results.'),
          q('Business A has 5.0 from 6 reviews; business B has 4.7 from 132, most of them recent. Who usually wins the map pack?', [
            'A, because rating is the only review factor',
            'Neither; reviews do not affect map pack ranking',
            'B, because volume, recency and velocity all count towards prominence',
            'A, because a perfect rating outweighs volume',
          ], 2, 'Prominence rewards a steady flow of recent reviews, so ten this month beat two hundred from several years ago.'),
          q('Your address reads "Suite 4" on the website, "Ste 4" on Yelp, and carries an old phone number on two directories. Why does that matter?', [
            'It splits the identity of the business across records and weakens all of them',
            'Directories charge more for inconsistent data',
            'It affects Apple Maps only',
            'Google merges the records automatically, so it does not matter',
          ], 0, 'Name, address and phone are the keys that tie listings to one business, and inconsistent keys produce several weak identities instead of one strong one.'),
        ]),
        lesson('JavaScript Rendering and Crawl Budget', 14, `
A modern front end can be perfect for users and invisible to Google. Both halves of this lesson come from one fact: crawling is cheap, rendering is expensive, and Google budgets accordingly.

### Two waves, and the gap between them

Googlebot fetches your HTML and indexes what it finds there. Anything that exists only after JavaScript runs waits in a **render queue** — usually minutes, sometimes days on a low-priority site. Whatever the renderer eventually sees is merged in later. A news site publishing client-side rendered articles is therefore indexed hours late, which for that business is much the same as not being indexed.

| Approach | What arrives in the first fetch | Risk |
|---|---|---|
| Server-side rendering | The full page | Lowest |
| Static generation at build time | The full page | Lowest |
| Hydration on top of rendered HTML | The full page | Low |
| Client-side rendering only | An empty \`<div id="root">\` | High |

### Check what the crawler actually gets

Three checks, in order of how much you should trust them:

1. **URL Inspection in Search Console**, then *View crawled page* and the *HTML* tab. This is Google's own rendered output. Search it for a sentence from the middle of your page.
2. **Fetch the raw HTML** and look for the same sentence.

\`\`\`bash
curl -s https://riverbend.example/guides/burr-vs-blade | grep -c "dust and boulders"
\`\`\`

3. **Disable JavaScript in the browser** and reload. Crude, but it finds missing navigation in seconds.

If the sentence appears in the rendered output but not in the raw HTML, you are depending on the render queue. That is survivable for an evergreen guide and dangerous for anything time-sensitive.

### The failures that actually happen

- **Links that are not links.** \`<div onclick="router.go('/beans')">\` and \`<a href="#">\` are not crawlable. Googlebot follows \`<a href="/beans">\` and nothing else, so a menu built from click handlers orphans the entire catalogue.
- **Content behind an interaction.** Tabs and accordions are fine when the text is in the DOM and merely hidden. Content fetched *on click*, or on scroll with no paginated URLs, is never seen — the renderer does not click and does not scroll.
- **Blocked resources.** A \`Disallow: /static/js/\` in robots.txt means the renderer loads nothing and sees a blank page. Check this first whenever a JavaScript site indexes as empty.
- **Routes with no unique metadata.** A single-page app that swaps views with \`pushState\` but never updates the title, description or canonical gives every route the homepage title, so every URL competes as a duplicate of the homepage.
- **Soft 404s.** A removed product that renders "not found" inside a 200 response stays indexed forever. Return a real 404 status code.

Dynamic rendering — serving a pre-rendered copy to bots — was Google's own recommended workaround and has since been deprecated as a long-term solution. Render on the server instead.

### Crawl budget: who it applies to

Below roughly 10,000 URLs, crawl budget is not your problem; indexing quality is, and the first lesson of this chapter covered that. Above it, or on any site that generates URLs combinatorially, it decides what gets seen at all.

Faceted navigation is the usual generator. Five filters with six values each, combinable and sortable, produce tens of thousands of crawlable URLs for 200 products:

\`\`\`text
/beans?origin=ethiopia&roast=light&size=1kg&sort=price&page=3
\`\`\`

The controls, in order:

| Tool | Use it for |
|---|---|
| \`robots.txt\` with \`Disallow: /*?sort=\` | Crawl waste you never want fetched at all |
| Canonical to the clean URL | Near-duplicates that must stay reachable |
| Filter links behind a POST, or not linked | Stopping the URLs being generated in the first place |
| Clean XML sitemaps | Pointing the budget at pages that matter |

Note the order of operations: canonical and \`noindex\` both require the URL to be crawled before they can be read, so neither of them saves crawl budget. Only the robots rule prevents the fetch.

Then confirm it worked in **Crawl stats**: total requests, average response time, and the breakdowns by file type and purpose. Server logs are better still — a Googlebot-filtered log showing 60% of hits landing on parameter URLs tells you exactly where the budget went. Keep the server fast while you are there, because crawl rate falls as response times rise, so slow hosting costs indexing as well as the Core Web Vitals from the last lesson.

### The classic mistake

Treating your own browser as evidence that Google can see the page. Your browser runs JavaScript immediately, with your cookies, on your connection. The crawler renders later, without cookies, and gives up on anything that requires interaction. **Check the rendered HTML in Search Console, not the page in your tab.**
        `,
        [
          q('A sentence from your page appears in the Search Console rendered HTML but not in the raw HTML response. What does that mean?', [
            'The page is blocked by robots.txt',
            'Search Console is showing a cached copy from before the last deploy',
            'The content depends on the render queue, which delays indexing and is risky for anything time-sensitive',
            'The sentence is inside a noscript tag',
          ], 2, 'Content that only exists after JavaScript runs waits for the second wave, so it is indexed later than the HTML around it.'),
          q('A navigation menu is built from div elements with onclick handlers that call the router. What is the consequence?', [
            'Googlebot follows href attributes only, so the linked pages can end up orphaned',
            'The menu is fine as long as it works with JavaScript enabled',
            'Google clicks page elements to discover further links',
            'The links pass less authority but are still crawled normally',
          ], 0, 'Discovery runs on anchor elements with real href values; click handlers are invisible to a crawler that never clicks.'),
          q('A faceted catalogue generates tens of thousands of URLs from five filters. Which control stops those URLs being fetched at all?', [
            'A canonical tag on each filtered URL',
            'A noindex tag on each filtered URL',
            'Leaving them out of the XML sitemap',
            'A robots.txt disallow on the parameter pattern',
          ], 3, 'Canonical and noindex have to be crawled to be read, so only a robots rule actually saves the crawl budget being wasted.'),
        ]),
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
        `,
        [
          q('Why publish an entire cluster before starting the next one?', [
            'Because Google indexes pages in batches',
            'Because relevance accumulates at topic level, so ten interlinked pages on one topic outrank fifty thin ones spread across ten',
            'Because a cluster shares a single URL',
            'Because internal links only pass value between pages published in the same month',
          ], 1, 'Authority on a subject is built by covering it thoroughly and linking it together, not by touching many subjects once each.'),
          q('What belongs in the first 40 words of a guide?', [
            'Context explaining why the topic matters',
            'The primary keyword used twice',
            'A short introduction to the brand',
            'The direct answer, in specifics, because impatient readers and featured snippets both take it from there',
          ], 3, 'Leading with the answer serves the searcher immediately and gives Google the concise passage that wins the snippet.'),
          q('A guide has slid from position 4 to 9 over 14 months. What usually returns the most traffic per hour of work?', [
            'Refreshing it — current prices, sections for the new questions, and removing whatever is now wrong',
            'Deleting it and writing a new post on the same topic',
            'Building links to it before touching the content',
            'Adding another 1,000 words',
          ], 0, 'A page that already ranks has the signals; restoring its accuracy recovers position without needing new links.'),
        ]),
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
        `,
        [
          q('One site links to you 40 times; forty sites link once each. How should you count them?', [
            'As 40 links each, so the two are equivalent',
            'Roughly one vote against forty, which is why referring domains is the metric to track',
            'The single site is worth more because it links repeatedly',
            'Neither counts unless the links sit in the body copy',
          ], 1, 'Repeated links from one domain are largely one endorsement, so the raw backlink count in a dashboard flatters a weak profile.'),
          q('Choose between a guest post on an authority-70 site that publishes 40 sponsored articles a week to pages nobody reads, and a link from a 25-authority regional food blog read by your customers.', [
            'The authority-70 site, because scores drive rankings',
            'Neither, since both are placements you arranged',
            'The food blog, because relevance and real readers matter more than the score — if you would not want the click, do not want the link',
            'The authority-70 site, because publishing volume signals an active site',
          ], 2, 'A link on a page with no readers on a site that sells placements carries little relevance and no traffic, whatever the domain score says.'),
          q('An audit shows 70% of your inbound anchors read "best coffee subscription uk". Why is that a problem?', [
            'Exact-match anchors are ignored entirely',
            'It exceeds the limit of 50 anchors per phrase',
            'Anchor text only counts for internal links',
            'A natural profile is mostly brand names and bare URLs, so that distribution is a pattern no set of editors produces by accident',
          ], 3, 'Anchor distribution is a fingerprint, and an unnatural one marks the profile as built rather than earned.'),
        ]),
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
        `,
        [
          q('One person visits your site four times in a week. How does that appear in the report?', [
            '4 users and 4 sessions',
            '1 user and 4 sessions, with a session ending after 30 minutes of inactivity',
            '1 user and 1 session',
            '4 users and 1 session',
          ], 1, 'Users approximate people and sessions count visits, which is why quoting sessions as an audience size overstates it.'),
          q('A homepage banner links to /subscribe with UTM parameters attached. What does that do to your reporting?', [
            'It starts a new session and reassigns the credit, so the banner takes the sale from the channel that actually delivered the visitor',
            'Nothing, because internal UTM parameters are stripped automatically',
            'It improves attribution by showing which banner works',
            'It moves that traffic into the Referral channel only',
          ], 0, 'UTM tags are for entrances; putting them on internal links restarts the session and quietly corrupts every channel report.'),
          q('100 wholesale enquiries produce 18 accounts worth $1,200 gross profit each in year one. What is an enquiry worth, and is an $80 cost per lead expensive?', [
            '$1,200 per enquiry, so $80 is trivial',
            '$216 per enquiry, so $80 is a good price',
            '$12 per enquiry, so $80 is far too expensive',
            'It cannot be valued until the accounts renew',
          ], 1, 'Multiplying the close rate by the gross profit values the lead, and $216 of value against $80 of cost is a comfortable margin.'),
        ]),
        lesson('E-E-A-T and the Evidence a Page Carries', 13, `
E-E-A-T — experience, expertise, authoritativeness, trust — is not a score inside an algorithm. It is the framework Google's quality raters use, and rater judgements are what the ranking systems are trained to approximate. So the practical question is never "how do I raise my E-E-A-T". It is **what evidence does this page carry that a stranger could check?**

### Trust is the centre; the other three feed it

- **Experience** — did the author actually do the thing? First-hand use, photographs you took, a test you ran.
- **Expertise** — do they know the subject? Decisive for advice; for a product review, experience matters more.
- **Authoritativeness** — is the site known for this topic? Built by the clusters earlier in this chapter and the links in the last lesson.
- **Trust** — is the business real, accurate and safe to deal with? This is the one that decides; the other three exist to support it.

### What evidence looks like on the page

| Signal | Weak version | Strong version |
|---|---|---|
| Author | "By Admin", or no byline at all | Named author, photo, short bio, linked profile page |
| Experience | "Burr grinders are generally better" | "We ground 400g through 14 machines over six weeks; here are the sieve results" |
| Sourcing | An unattributed statistic | The figure, the study, the year, linked |
| Currency | No date anywhere | Published and updated dates, where the update genuinely happened |
| The business | A contact form | Address, phone, company number, returns policy in plain English |
| Reviews | A testimonial carousel with no names | Verified reviews with dates, including the three-star ones |

Riverbend's grinder guide carries a photograph of the two grounds samples on the roastery bench, the model numbers, the date tested, and the sentence *we bought all fourteen at retail price*. None of that is writing skill. It is the reason to believe this page rather than the four that copied each other.

### YMYL raises the bar, not the rules

Pages that could affect health, money, safety or a major life decision — your money or your life — are held to a much higher standard, because being wrong costs the reader something real. A guide to grind size is not YMYL. A page about caffeine intake during pregnancy is, and it needs a named source with relevant qualifications, citations to primary research, and a visible review date.

### Author pages are infrastructure, not decoration

Give every regular author a real page: what they do, how long they have done it, what they have published elsewhere, and links to the profiles that corroborate it. Mark it up with \`Person\` and \`sameAs\` from Chapter 2, and link the byline to it from every article. That is how a name stops being a string and becomes an entity.

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Priya Anand",
  "jobTitle": "Head Roaster, Riverbend Coffee",
  "sameAs": [
    "https://riverbend.example/about/priya",
    "https://www.linkedin.com/in/example"
  ]
}
\`\`\`

### Link out to your sources

Outbound links do not leak anything worth keeping. Citing the study you used costs one click and buys the reader the ability to check you, which is the whole mechanism trust runs on. A page that makes numeric claims and cites nothing reads exactly like the pages assembled from other pages that this chapter opened with.

### The classic mistake

Bolting the furniture on and changing nothing underneath: adding author boxes to 400 old posts, inventing a "reviewed by" line nobody read, or generating a byline and a headshot for a writer who does not exist. Raters and the systems trained on them are looking for evidence, and a byline is not evidence — the test you ran is. **If the page would be identical without the author, the author box is not what is missing.**

### Do this now

Take your five highest-value pages and add one thing to each that no competitor can copy: a photograph you took, a number you measured, a customer quoted by name, or a paragraph explaining how you know what you are asserting.
        `,
        [
          q('Which page is YMYL, and therefore held to a higher standard?', [
            'A guide to grind size for an Aeropress',
            'A page about caffeine intake during pregnancy',
            'A comparison of 14 grinders under $200',
            'A photo essay about a roastery tour',
          ], 1, 'Health advice can affect a reader materially, which is what puts a page in the your-money-or-your-life category.'),
          q('A team adds author boxes to 400 existing posts and changes nothing else. What should they expect?', [
            'A ranking gain, because author markup is a ranking factor',
            'Little or nothing, because a byline is not the evidence — the test, photograph or measurement is',
            'A manual action for author spam',
            'Immediate eligibility for rich results',
          ], 1, 'E-E-A-T is judged on what the page demonstrates, so the furniture around unchanged content changes nothing.'),
          q('Why cite and link the study behind a statistic you quote?', [
            'Outbound links raise the authority of the linking page',
            'Google requires at least three outbound links per page',
            'It lets the reader check you, which is the mechanism trust actually runs on',
            'It stops competitors from reusing the figure',
          ], 2, 'A checkable claim is what separates a page that knows something from a page assembled out of other pages.'),
        ]),
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
        `,
        [
          q('Target cost per acquisition is $12 and the landing page converts at 3.2%. What is the most a click can cost?', [
            '$0.38',
            '$1.20',
            '$3.84',
            '$12.00',
          ], 0, 'Target CPA multiplied by conversion rate gives the break-even click price, so anything above $0.38 loses money by arithmetic.'),
          q('Social clicks cost a third of search clicks and convert at a fifth of the rate. What follows?', [
            'Social is the cheaper channel per customer and should take budget from search',
            'Social is the more expensive channel per order, and is still worth running because it creates the demand search later harvests',
            'Social clicks should be bid up until the two rates match',
            'The conversion difference is a tracking artefact',
          ], 1, 'Cheaper clicks are not cheaper customers, but an awareness channel is judged on the demand it creates rather than on last-click orders.'),
          q('You spread $10 a day across six ad sets and none of them performs. Why?', [
            'Platforms reject daily budgets under $50',
            'Six ad sets always cannibalise one another',
            'An ad set needs roughly 50 conversions a week to leave the learning phase, and this budget cannot get any of them there',
            'The creative was not refreshed often enough',
          ], 2, 'Splitting a small budget across many ad sets keeps every one of them below the volume the optimiser needs to learn.'),
        ]),
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
        `,
        [
          q('A company that has not emailed in a year blasts its entire 20,000-address list to re-engage. What happens?', [
            'Bounces and complaints spike and the sending domain gets throttled, so the next campaign never reaches the people who did want it',
            'Open rates are unusually high because the list has been rested',
            'The provider automatically re-warms the domain',
            'Nothing, provided the unsubscribe link works',
          ], 0, 'Reputation is built on recent sending behaviour, so a cold blast damages deliverability for every message that follows.'),
          q('Riverbend has 172 abandoned baskets a month at $34 an order. What does a 9% recovery from a three-email flow produce?', [
            'About $1,500 a month',
            'About $170 a month',
            'About $510 a month, from three emails written once',
            'Nothing measurable until the list passes 10,000',
          ], 2, 'Fifteen recovered orders at $34 is roughly $510 every month for a one-off piece of work, which is why flows beat campaigns.'),
          q('What does DMARC add on top of SPF and DKIM?', [
            'It encrypts the message body in transit',
            'It tells receiving servers what to do when the SPF or DKIM checks fail',
            'It removes the need for an unsubscribe link',
            'It signs each message with a private key',
          ], 1, 'SPF authorises servers and DKIM signs messages, while DMARC is the policy that says how failures should be handled and reported.'),
        ]),
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
        `,
        [
          q('An account with 4,000 followers publishes a post. How many followers typically see it?', [
            'Roughly 80 to 200, since organic reach runs at about 2-5% of followers',
            'All 4,000, minus whoever is inactive that day',
            'About half, depending on the posting time',
            'Reach has no relationship to follower count',
          ], 0, 'Organic distribution is a small fraction of the follower list, which is why plans that depend on it for sales never add up.'),
          q('An account posts 80% offers and 20% everything else. What is the consequence?', [
            'A higher conversion rate, because more asks produce more sales',
            'Better distribution, because platforms reward commercial intent',
            'It gets muted, because the useful posts are what earn the right to make the occasional ask',
            'No effect, provided the offers are genuinely good',
          ], 2, 'Attention is paid for with usefulness, and an account that mostly sells loses the audience that made selling possible.'),
          q('What is the most efficient way to spend a small paid budget alongside organic posting?', [
            'Promote every post evenly for a week',
            'Promote whichever posts a manager likes best',
            'Boost every new post immediately at publication',
            'Let posts run organically for a week, then put budget behind the top 10% that already proved strangers respond to them',
          ], 3, 'Amplifying proven posts spends money on evidence rather than on opinion, which is the cheapest signal you will ever get.'),
        ]),
        lesson('Retargeting and Audience Building', 13, `
Prospecting on paid social costs Riverbend about $41 per new customer. Advertising to somebody who already viewed a product costs a fraction of that, which makes retargeting the most profitable line in most ad accounts and the easiest one to overstate.

### Build audiences from behaviour, not from "all visitors"

| Audience | Window | Monthly size | What the ad should say |
|---|---|---|---|
| Viewed a product, did not add | 14 days | 3,900 | The product, plus the objection: free delivery, roast date |
| Added to basket, did not buy | 7 days | 620 | The exact item, one reason to return, no discount on day one |
| Bought once | 30-120 days | 480 | The subscription, or the origin they have not tried |
| Read a guide, never saw a product | 30 days | 2,400 | The category, not the item — they are still learning |
| All site visitors | 30 days | 9,100 | Almost nothing useful; far too mixed to write for |

The last row is how most accounts are actually set up, and it is why their retargeting underperforms. **An audience you cannot write one specific sentence for is not a segment.**

### Exclusions are half the work

Every audience needs the people it should not reach removed: recent purchasers out of the basket-abandonment ad, existing subscribers out of the subscription pitch, current customers out of the "10% off your first order" that quietly insults them. Following a customer for three weeks with the bag they already bought is the most common fault in the discipline, and it costs money twice — the impressions, and the goodwill.

### Recency changes the message

\`\`\`text
Day 0-2     The item they viewed. Answer the objection. No discount.
Day 3-10    Proof: 1,900 reviews at 4.7, the roast-date guarantee.
Day 11-30   Widen: the subscription, the guide, the category.
Day 30+     Stop. This is prospecting again, not retargeting.
\`\`\`

Cap frequency at roughly 3-4 impressions a week per person. Past that the response rate falls while the spend does not, and the cost is invisible in the dashboard — nobody reports the number of people now irritated by you.

### Size the audience before you build it

Retargeting needs volume to spend sensibly. Below roughly 1,000 qualified visitors a month a campaign will either sit unspent or hit the same 200 people forty times. Riverbend's 12,000 visits support it comfortably; a site with 900 visits should go back to Chapter 4 and Chapter 6 first.

### Do not pay to reach people your email already reaches

The 172 abandoned baskets from the email lesson are already receiving three emails that cost nothing per send. Retarget the ones with no email address and let the flow handle the rest — or accept the overlap deliberately, knowing it inflates the platform's reported conversions with sales the email would have made anyway.

### The privacy squeeze, and what still works

Cookie windows have shortened, app tracking prompts cut match rates, and third-party cookies are unreliable everywhere. Three consequences:

1. **First-party data wins.** Customer list uploads, hashed emails and consented on-site events outlive cookies.
2. **Server-side event sending** — a conversions API rather than a browser pixel alone — recovers a meaningful share of lost signal, and is worth doing before you touch bids.
3. **Seed lookalikes from buyers**, not from all visitors. A lookalike modelled on mixed traffic is a lookalike of nobody in particular.

Respect consent properly while you do it. An audience built from visitors who declined tracking is a compliance problem, not a growth tactic.

### The classic mistake

Reading retargeting ROAS as incremental. A campaign showing 9x return is advertising to people who visited a product page last week, a substantial share of whom would have come back regardless. It is usually still worth running, but the number is not the number. Test it the way Chapter 7 tests brand search: hold out a matched region or a random 10% of the audience for three weeks and compare **total** orders, not the campaign's own report. The honest figure is normally a fraction of the claimed one.
        `,
        [
          q('Why is "all site visitors, 30 days" a weak retargeting audience?', [
            'It is always too small to spend against',
            'Platforms cap the size of generic audiences',
            'The window is too short for a considered purchase',
            'It mixes people at different stages, so no single message fits — an audience you cannot write one sentence for is not a segment',
          ], 3, 'Segmentation exists so the ad can say something specific, and a bucket containing guide readers and basket abandoners together cannot.'),
          q('A retargeting campaign reports 9x ROAS. How should you read it?', [
            'As the incremental return, since the platform tracked every sale',
            'As inflated, because much of that audience would have returned anyway — hold out a matched group and compare total orders',
            'As a reason to move the whole prospecting budget into retargeting',
            'As unreliable only when the pixel is client-side',
          ], 1, 'Advertising to people who already chose to visit takes credit for returns that were going to happen, which only a holdout can separate.'),
          q('Which exclusion prevents the most common retargeting waste?', [
            'Excluding recent purchasers from product and basket-abandonment ads',
            'Excluding visitors outside your delivery area',
            'Excluding desktop users',
            'Excluding anyone who visited only once',
          ], 0, 'Chasing someone for three weeks with the item they have already bought spends budget on a sale that has happened and annoys a new customer.'),
        ]),
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
        `,
        [
          q('Site-wide add-to-basket rate is 15%: desktop 20.0%, mobile 11.7% on 60% of traffic. What does that change?', [
            'Nothing, since the blended figure is what customers experience',
            'The site has a mobile problem, so desktop work is spent on the smaller part of the leak',
            'It shows the desktop layout should be redesigned first',
            'It means the tracking is double-counting mobile sessions',
          ], 1, 'An average hides the fault; segmenting shows the loss is concentrated in the device carrying most of the traffic.'),
          q('In ICE scoring, what does a confidence of 5 mean?', [
            'The change is quick to build',
            'The team agrees it is a good idea',
            'You watched real people fail at exactly this, in recordings or research',
            'The uplift has been reported in another company case study',
          ], 2, 'Confidence is the honest column, and reserving high scores for observed failure stops the queue being sorted by enthusiasm.'),
          q('A case study reports that removing site navigation lifted conversion 12%. Should you copy it?', [
            'Yes, if your traffic volumes are comparable',
            'Yes, because navigation is always a distraction on product pages',
            'Only on mobile, where space is scarce',
            'No — that was their diagnosis for their problem; you can borrow the method, not the conclusion',
          ], 3, 'Their nav was in the way of their buyers, while yours may be the only route to the size guide your buyers need.'),
        ]),
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
        `,
        [
          q('Why does a hypothesis need a guardrail metric as well as a target metric?', [
            'To satisfy the statistics engine',
            'Because a change can lift the target metric while costing money — a big discount banner raises add-to-basket rate and destroys margin',
            'Because two metrics halve the sample needed',
            'To give the test a second chance at significance',
          ], 1, 'Without a guardrail such as revenue per session, a test can be declared a win while the business is worse off.'),
          q('Your test reaches its calculated sample after nine days. When should it stop?', [
            'Immediately, since the sample condition has been met',
            'At two full weeks minimum and always in whole weeks, so weekdays and weekends are represented evenly',
            'Once the confidence figure passes 99%',
            'When the variant has led for three consecutive days',
          ], 1, 'Tuesday behaves nothing like Saturday, so a part-week test over-weights whichever days it happened to contain.'),
          q('A client-side testing tool paints the original page and then swaps in the variant. Why does that matter?', [
            'It invalidates the tool licence',
            'It doubles the sample size required',
            'The flicker both biases behaviour and delays the largest paint, damaging the LCP fixed in Chapter 3',
            'It affects returning visitors only',
          ], 2, 'Visitors react to what they saw first, and the repaint pushes back the very moment Core Web Vitals measures.'),
        ]),
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
        `,
        [
          q('The same ad at $0.90 a click converts at 1.1% on the homepage and 3.8% on a matched landing page. What does that do to cost per acquisition?', [
            'It falls from about $82 to about $24',
            'It falls from about $24 to about $12',
            'It stays the same, because the click price did not change',
            'It rises, because landing pages cost more to build',
          ], 0, 'Cost per click divided by conversion rate gives CPA, so tripling the conversion rate cuts the cost of a customer to roughly a third.'),
          q('A form grows from 3 fields to 11. What happens, and what is the rule?', [
            'Completion roughly halves; ask only for what the next step needs',
            'Completion is unaffected if the extra fields are optional',
            'Completion falls from about 39% to about 14%; every field has a price, so ask only for what the next step needs',
            'Completion improves, because longer forms qualify leads better',
          ], 2, 'Each additional field costs a share of the people who started, so fields have to be justified by a use the business actually has.'),
          q('A landing page offers buy, subscribe, download the guide, book a tasting and follow us. What is the effect?', [
            'More total conversions, since everyone finds something to do',
            'Every extra choice is taken out of the primary one — one page, one job, one button',
            'A better Quality Score, because the page offers more',
            'No effect as long as the buy button is the largest',
          ], 1, 'Attention is finite on a page you paid to send someone to, and competing calls to action split it.'),
        ]),
        lesson('Fixing the Checkout', 13, `
430 people started checkout last month and 258 finished. The 172 who did not are the most expensive visitors on the site: you paid to acquire every one of them, they chose a product, and they left at the last step. This is what to change, in order.

### Why people abandon, and what each reason costs

Surveys of abandoned checkouts have said the same thing for a decade. Unexpected extra costs is always first, forced account creation is always near the top, and the rest is friction.

| Reason | Roughly what share say so | The fix |
|---|---|---|
| Extra costs seen too late | Around half | Show delivery and tax on the product page and in the basket |
| Forced account creation | About a quarter | Guest checkout; offer the account after payment |
| Delivery too slow or vague | About a fifth | State the actual date, not "3-5 working days" |
| Checkout too long or confusing | About a fifth | Cut fields, fix the step order |
| Would not trust the site with card details | About a sixth | Real reviews, plain policies, payment marks beside the card field |

Note that the top two are not design problems. They are honesty and policy problems, and both are fixed before anyone opens a design tool.

### Cut the fields, then cut them again

Count what you ask for. Riverbend's checkout collected 23 inputs; 11 of them were needed to ship a bag of coffee.

- Delete anything the business does not use — the VAT number from earlier in this chapter, "how did you hear about us", title, company name, a required second address line.
- Default the billing address to the delivery address, with a checkbox to change it.
- Use postcode lookup: one field replacing five.
- Combine first and last name into one field unless you genuinely personalise on the first name.

### Let the browser do the typing

\`\`\`html
<input name="postcode" autocomplete="postal-code"
       inputmode="text" autocapitalize="characters">
<input name="cardnumber" autocomplete="cc-number"
       inputmode="numeric">
<input name="email" type="email" autocomplete="email"
       inputmode="email" spellcheck="false">
\`\`\`

Correct \`autocomplete\` tokens let a phone fill the whole form from its saved profile, and \`inputmode\` brings up the numeric keypad instead of a full keyboard. On a mobile-heavy store this is worth more than a redesign and takes an afternoon. Then add the wallets — Apple Pay, Google Pay, PayPal — which turn a two-minute form into a fingerprint and routinely carry a third of mobile orders.

### Validate like a helpful human

Inline, as the visitor leaves the field, not on submit. Say what is wrong and what to do: "we need a 5-digit postcode" beats "invalid input". Never clear the card field on an error. Never reject a card number because of the spaces someone typed — strip them yourself. And fire an analytics event for each validation failure: if 38% of failed submissions come from one field, you have found the leak without watching a single recording.

### Measure the step, not the total

Send \`begin_checkout\`, \`add_shipping_info\`, \`add_payment_info\` and \`purchase\`, then read the funnel split by device. A loss concentrated between shipping and payment is a cost or trust problem; a loss at the very first step is usually a login wall.

### What this is worth

\`\`\`text
430 checkout starts at 60% completion  ->  258 orders
430 checkout starts at 75% completion  ->  322 orders
+64 orders x $34  =  $2,176 a month, with no extra traffic
\`\`\`

Chapter 1 circled this step. The work above is how it moves.

### The classic mistake

Putting a discount code box in a checkout that has no discount codes. A visible empty field sends people off to a coupon site to hunt for something you do not offer, and a good share of them never come back. Show it only to traffic that arrived with a code, or collapse it behind a small link.

The second is testing what does not need testing. Deleting a field nobody uses has no trade-off to measure, so ship it. Reserve the A/B machinery from the previous lesson for changes that really do cost something — removing the account requirement your CRM depends on, for instance.
        `,
        [
          q('What is consistently the top reason people abandon a checkout?', [
            'A missing payment method',
            'The pages loading slowly',
            'Extra costs such as delivery and tax appearing too late',
            'The absence of a discount code',
          ], 2, 'Cost surprises break the deal the visitor thought they had, which is why delivery and tax belong on the product page.'),
          q('Your checkout shows an empty discount code box and you run no promotions. What does it do?', [
            'It reassures buyers that good deals exist on the site',
            'It sends people away to hunt for a code that does not exist, and many of them do not return',
            'Nothing, because the field is optional',
            'It improves completion by giving people a sense of control',
          ], 1, 'An empty coupon field advertises a discount you do not offer and hands the visitor a reason to leave the page.'),
          q('You find a required "how did you hear about us" field that nobody in the business uses. What is the right move?', [
            'A/B test removing it against the current version',
            'Make it optional and test again next quarter',
            'Move it to the confirmation page and test it there',
            'Delete it — there is no trade-off to measure, so scarce testing capacity belongs on changes that have one',
          ], 3, 'Testing is for decisions with a real cost on both sides; removing pure friction with no business use is simply a fix.'),
        ]),
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
        `,
        [
          q('Organic traffic is down 28% against last month. What is the first comparison to make?', [
            'Against the same month last year, because seasonality repeats and month-on-month comparisons manufacture crises',
            'Against the best month on record',
            'Against an industry benchmark',
            'Against paid traffic over the same period',
          ], 0, 'Riverbend loses about 30% of its searches every August and gets them back in September, so only a year-on-year view separates season from problem.'),
          q('The drop is entirely in brand queries while non-brand is flat. What does that point at?', [
            'A core algorithm update',
            'An indexing fault in the templates',
            'Not an SEO problem — a PR event, a seasonal brand dip, or a competitor bidding on your name',
            'A broken canonical tag on the homepage',
          ], 2, 'Brand demand is created off-site, so a brand-only fall means fewer people are searching for you rather than that you rank worse.'),
          q('Before blaming a Google update for a drop, what should you read?', [
            'Industry forums for chatter about a rollout',
            'Your own deploy log for the week before the drop, since most "algorithm updates" turn out to be a release you shipped',
            'Competitor pricing pages',
            'The disavow file',
          ], 1, 'Template changes, plugin updates and a robots file shipped from staging cause far more drops than algorithm changes do.'),
        ]),
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
        `,
        [
          q('Which source of old URLs do teams most often leave out of the redirect map?', [
            'The XML sitemap',
            'GA4 landing pages',
            'Top pages by referring domains, where a page with almost no traffic can hold a third of your links',
            'The CMS page list',
          ], 2, 'Traffic-based lists miss the 2019 press page that six people read and thirty-one sites link to, and dropping it throws the links away.'),
          q('What must be checked within five minutes of a migration going live?', [
            'That analytics is recording sessions',
            'That the new sitemap has been submitted',
            'That the homepage title is correct',
            'The live robots.txt and a live page meta robots, in case a staging block shipped with the release',
          ], 3, 'A Disallow or site-wide noindex carried over from staging is both common and the most expensive thing that can happen on launch day.'),
          q('Six weeks after a migration, traffic is still flat at minus 40%. What does that tell you?', [
            'This is the normal dip and it will recover on its own',
            'The redirect map has holes, so the old URL list needs crawling again to find the unmapped rows',
            'Google needs another Change of Address request',
            'The content was rewritten too heavily',
          ], 1, 'A clean migration loses 10-20% for two to six weeks and then climbs; a flat line at minus 40% means value is pointing nowhere.'),
        ]),
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
        `,
        [
          q('Non-brand search averages a $16 CPA while the last $500 added cost $23 per customer. Which number decides whether to scale?', [
            'The average, because it covers all the spend',
            'The marginal CPA, because every channel gets more expensive once the cheapest demand has been bought',
            'Whichever is closer to the target CPA',
            'Neither; ROAS is the only scaling metric',
          ], 1, 'Budget decisions are about the next customer, and the next customer here costs more than the business can pay for one.'),
          q('A platform reports 6x ROAS but blended CAC has not moved at all. What does that suggest?', [
            'The blended figure lags and will catch up',
            'The platform is under-reporting conversions',
            'The reported return is mostly reallocation of sales you were already making',
            'The gross margin assumption must be wrong',
          ], 2, 'Blended CAC counts every sale and every dollar spent, so a channel claiming a large return without moving it is claiming credit rather than creating sales.'),
          q('In a 70/20/10 budget, what must every 10% bet carry before it launches?', [
            'A dedicated agency',
            'A kill criterion written in advance, such as stopping if CPA is above $30 after $1,000 of spend',
            'A minimum three-month commitment',
            'Its own attribution model',
          ], 1, 'A bet without a stopping rule quietly becomes a permanent line item that nobody can justify or cancel.'),
        ]),
        lesson('Forecasting and the Annual Plan', 14, `
A forecast is not a prediction. It is a set of assumptions written down so that by March you can tell whether the plan is working. Build it from the funnel chain in Chapter 1, never from a percentage somebody would like to see.

### Forecast the drivers, not the total

"Revenue up 20%" is a wish. Break it into the numbers that produce it and every one becomes something you can check monthly.

\`\`\`text
Organic revenue = sessions x conversion rate x average order value
Sessions        = impressions x click-through rate
Impressions     = pages published x keywords each ranks for x volume
\`\`\`

Riverbend plans 24 guides next year, 12 in the subscription cluster and 12 on brewing. From the last cluster it published, a guide reaches roughly 60% of its steady traffic at month 3 and 90% at month 6, settling near 380 visits a month.

| Published | Pages | Visits each by December |
|---|---|---|
| Jan-Mar | 6 | 380 |
| Apr-Jun | 6 | 340 |
| Jul-Sep | 6 | 230 |
| Oct-Dec | 6 | 90 |

That totals 6,240 monthly visits by December, not 24 x 380 = 9,120. **Ramp is the assumption everyone forgets**, and it is why a plan that publishes everything in the fourth quarter delivers almost nothing inside the year it was written for.

### Apply seasonality before you compare anything

Twelve months of history gives you an index: each month divided by the average month.

| Month | Jan | Apr | Jun | Aug | Nov | Dec |
|---|---|---|---|---|---|---|
| Index | 1.05 | 0.95 | 0.85 | 0.70 | 1.40 | 1.25 |

August is not a crisis and November is not a triumph. Forecast the baseline, multiply by the index, and hold each monthly review against that month's expectation rather than against the month before it.

### Three scenarios, each with one changed assumption

| | Low | Base | High |
|---|---|---|---|
| Guides published | 16 | 24 | 24 |
| Steady visits per guide | 250 | 380 | 480 |
| Conversion rate | 2.1% | 2.6% | 3.0% |
| Added monthly revenue by December | $2,900 | $5,500 | $8,200 |

Present the range and name what separates the columns — publishing capacity, and the conversion work from Chapter 6. A single number invites an argument about the number; three scenarios invite a decision about which one you are staffing for.

### Sanity checks that catch nonsense

- **Does it assume a ranking you have never held?** A forecast needing position 2 for a term where you sit at 14 with a quarter of the links is not a forecast.
- **Does it exceed the market?** The cluster totals 41,000 searches a month. Claiming 12,000 visits from it means taking 29% of every search in the category.
- **Does it scale paid linearly?** It never does. Extra paid spend must be forecast at the marginal cost per acquisition from the previous lesson, not the average.
- **Is the capacity real?** 24 guides is one a fortnight with briefs, photography and interlinking. If nobody is assigned, the forecast is fiction on the day it is signed.

### Leading indicators tell you in month two

Revenue moves last, so track the inputs that move first.

| Indicator | Monthly target |
|---|---|
| Guides published | 2 |
| Pages ranking in the top 20 | +8 |
| Referring domains gained | +4 |
| Email list net growth | +350 |
| Marginal CPA, non-brand search | under $16 |

Two consecutive months of missing the publishing target means December is already gone, whatever the revenue line still says at the time.

### The classic mistake

Forecasting the outcome and not the work: a revenue line that goes up and to the right with no headcount, no publishing schedule and no link acquisition behind it. The mirror image is extrapolating from a single strong month — take November, draw a line, and commit the year to a seasonal peak you have already had.

### Do this now

Write next quarter as three numbers a month — visits, orders, revenue — with the seasonality index applied, and list the four inputs you will check on the first Monday of each month. That page is the plan. Everything else is a dashboard.
        `,
        [
          q('You will publish 24 guides across the year, each settling near 380 visits a month. Why is 24 x 380 the wrong December figure?', [
            'Because December is a low season for the category',
            'Because pages published late in the year are nowhere near steady state by December',
            'Because guides in the same cluster cannibalise each other',
            'Because average visits per guide always falls as you publish more',
          ], 1, 'A guide reaches only about 60% of its traffic by month 3, so publishing date determines how much of the year each page actually contributes.'),
          q('August carries a 0.70 seasonality index. How should the August review read?', [
            'As a 30% shortfall requiring a recovery plan',
            'As the new baseline for the rest of the year',
            'Against the seasonally adjusted expectation, because that dip repeats every year',
            'As evidence that the forecasting method is broken',
          ], 2, 'Comparing a seasonal trough with an unadjusted target manufactures a crisis and spends the credibility needed for a real one.'),
          q('A forecast claims 12,000 monthly visits from a cluster whose keywords total 41,000 searches a month. Which check does it fail?', [
            'It implies taking 29% of every search in the category, which is beyond the available market',
            'It ignores the conversion rate',
            'It uses monthly rather than quarterly figures',
            'It leaves out paid traffic',
          ], 0, 'Forecast traffic can never exceed the demand that exists, so total search volume is the ceiling every projection has to sit under.'),
        ]),
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
      chapter(
      'Large-Site and International SEO',
      'The problems that only appear at hundreds of thousands of URLs and several markets: what the crawler really fetches, where the index fills with junk, and how one site serves many languages without competing with itself.',
      [
      lesson('Log File Analysis: What Googlebot Actually Fetches', 14, `
Thirty days of logs from riverbend.example: 4.2 million Googlebot requests, and 61% of them landed on URLs nobody ever wanted crawled. Internal search results, sort parameters, and a tracking parameter the email team added in 2023. Meanwhile 38,000 product URLs listed in the sitemap were fetched once, or never.

Chapter 3 said crawl budget stops being theoretical above roughly 10,000 URLs. At 240,000 it decides what ranks at all, and the log is the only place the truth lives. Crawl Stats in Search Console samples and rounds. The log records every request.

### Get the right file first

Ask for the raw access log from nginx, Apache, or the load balancer, 30 days minimum. One warning before you count anything: if the site sits behind a CDN, the origin log records only cache misses. On a well cached catalogue that hides most crawler traffic and makes your busiest sections look ignored. Pull the CDN log instead (Cloudflare Logpush, Fastly, CloudFront to S3) or accept that you are reading a fragment.

Then verify the crawler, because anyone can put \`Googlebot\` in a user agent string and scrapers do it constantly. Google publishes no stable IP list, so the check is a reverse lookup followed by a forward one.

\`\`\`bash
host 66.249.66.1
# 1.66.249.66.in-addr.arpa domain name pointer crawl-66-249-66-1.googlebot.com
host crawl-66-249-66-1.googlebot.com
# crawl-66-249-66-1.googlebot.com has address 66.249.66.1
\`\`\`

Both steps have to agree. A hostname under \`googlebot.com\` that resolves back to the same address is genuine. Anything else is somebody's scraper eating your bandwidth and your report's credibility.

### Where the budget went

One command tells you more than a week of crawling with a desktop tool:

\`\`\`bash
zcat /var/log/nginx/access.log-2026-07-*.gz \\
  | grep -i googlebot \\
  | awk '{print $7}' | cut -d/ -f2 \\
  | sort | uniq -c | sort -rn | head -5
\`\`\`

\`\`\`text
1842301 search
 901447 beans
 402118 blog
  96330 basket
  38204 checkout
\`\`\`

Internal search took 44% of the budget. Basket and checkout took another 3% for pages that must never rank. That is the finding, and it took nine seconds.

### The four sets

Join the crawled URLs against the URLs in your XML sitemap and every URL falls into one of four buckets.

| Set | What it means | What to do |
|---|---|---|
| In sitemap, crawled often | Working as intended | Nothing |
| In sitemap, never crawled | Discovery failure: too deep, or budget spent elsewhere | Link it from a hub, cut the waste |
| Crawled, not in sitemap | Waste, or pages you forgot you publish | Block it, or add it if it earns a place |
| Crawled, returns 301 or 404 | Stale internal links and old redirect chains | Fix the links at source |

The third bucket is where index bloat is born. The second is where revenue quietly sits: 38,000 uncrawled product URLs do not have a ranking problem yet, because they have never been seen.

### Response time buys crawl rate

Googlebot backs off a slow host. Two months on the same site:

| Month | Mean response | Googlebot requests |
|---|---|---|
| June | 310ms | 4.2M |
| July | 940ms | 1.6M |

Nothing changed in the content. A database migration in July halved the crawl, and new products took nine days longer to appear. Server speed is not only a Core Web Vitals question, it is a discovery question.

### The mistake

Reading the log for status codes only. A clean 200 on every request feels healthy and tells you nothing about whether those 200s were worth serving. Group by directory and by parameter first, then look at the codes.
      `,
        [
          q('Your site sits behind a CDN and the origin nginx log shows Googlebot fetching only 40,000 URLs a month. What is wrong with that number?', [
            'The origin log records only cache misses, so most crawler traffic never reaches it',
            'Googlebot reduces its crawl rate on any site served from an edge cache',
            'Log rotation runs weekly, so a full month can never be counted accurately',
            'Crawl rate is capped at 40,000 requests per month for every single host',
          ], 0, 'A cached hit is served at the edge and never touches your server, so the origin log describes only the fraction of crawler requests that missed the cache.'),
          q('A log line carries the Googlebot user agent string. What actually confirms it is Google?', [
            'The request comes from a published Googlebot IP range that Google keeps fixed',
            'The session begins by requesting robots.txt before any other URL on the host',
            'A reverse lookup on the IP returns a googlebot.com host that resolves back to it',
            'The user agent string contains a version number and a valid crawl identifier',
          ], 2, 'Google publishes no stable IP list, so the accepted check is a reverse DNS lookup followed by a forward lookup that returns the original address.'),
          q('Mean response time rose from 310ms to 940ms and Googlebot requests fell from 4.2M to 1.6M, with no content changes. What follows from that?', [
            'Crawling is unaffected by server speed, so the drop must come from lost backlinks',
            'Fewer requests will lift rankings, because thin pages are being fetched less often',
            'Response time only matters for Core Web Vitals, so the two numbers are unrelated',
            'Googlebot backs off a slow host, so new and updated pages get discovered later',
          ], 3, 'Crawl rate is throttled by host load, so a slower server directly reduces how much of the site is fetched and delays indexing of anything new.'),
        ]
      ),
      lesson('Faceted Navigation, Parameters, and Index Bloat', 14, `
\`site:riverbend.example\` returns about 512,000 results. The catalogue holds 4,100 products and 140 categories. Everything else is a filter combination, a sort order, or a session parameter, and each one competes for the crawl budget you just measured.

Chapter 3 gave you the controls. Here is the harder question: which filtered URLs deserve to exist as indexable pages at all.

### The combinatorics are worse than they look

The bean listing has six facets: origin (14 values), roast (3), grind (5), size (4), price band (5), certification (4). Multi select is allowed and three sort orders sit on top.

\`\`\`text
14 x 3 x 5 x 4 x 5 x 4  = 16,800 single value combinations
x 3 sort orders         = 50,400
x pagination to page 12 = 604,800 crawlable URLs
\`\`\`

For 4,100 products. Nobody planned that. It fell out of a filter component that appends a parameter and links every option.

### Index only what has demand behind it

A facet combination earns an indexable URL when three things are true at once. People search for it: "ethiopian light roast coffee" gets searches, "ethiopian light roast 250g fairtrade sorted by price" does not. The result set genuinely differs from the parent category. And enough products sit on it, say eight or more, that it is not thin today and empty next month.

| Facet | Search demand | Decision |
|---|---|---|
| origin | High | Indexable path \`/beans/ethiopian\` |
| roast | High | Indexable path \`/beans/light-roast\` |
| origin plus roast | Moderate | Indexable, whitelisted pairs only |
| grind, size | None | Crawlable, noindex, canonical to parent |
| price band, sort | None | Blocked in robots.txt, links behind POST |

The whitelist matters more than the blocking rules. Left alone the site generates everything. You are choosing the few hundred URLs that get a clean path, a unique H1, an intro paragraph and a place in the sitemap.

### The robots.txt that made it worse

Broken, deployed on a Friday:

\`\`\`text
User-agent: *
Disallow: /beans/
\`\`\`

Products live at \`/beans/yirgacheffe-1kg\`. Filters live at \`/beans?sort=price\`. That rule blocked all 4,100 product pages and not one filter URL, because a query string is not a path segment. Organic revenue fell 71% in eleven days.

Fixed, targeting the parameter:

\`\`\`text
User-agent: *
Disallow: /*?*sort=
Disallow: /*?*price_band=
Disallow: /*?*session=
Disallow: /search
\`\`\`

Test every rule against a real product URL in the robots.txt tester before it ships. This file has taken more revenue off more sites than any algorithm update.

### Two things that surprise people

Google retired the URL Parameters tool in Search Console in 2022. If you learned the "tell Google to ignore this parameter" workflow, the setting no longer exists. The job is robots.txt, canonicals, and not generating the links.

The second one bites slowly. A page left on \`noindex\` for a long time gets crawled less and less, and Google ends up treating the links on it as nofollow. So \`noindex, follow\` on a filtered listing does not keep passing signal to the products underneath forever. If products are reachable only through noindexed filters, they go orphaned. Reach them through crawlable pagination or a real category page.

### Measuring bloat

Track two numbers monthly: URLs submitted in the sitemap, and pages reported as indexed. A healthy large site sits near 1:1.

| Month | Sitemap URLs | Indexed | Ratio |
|---|---|---|---|
| March | 4,240 | 3,905 | 0.92 |
| April | 4,260 | 41,700 | 9.8 |

April is the alarm. Something started linking parameter URLs and 37,000 near duplicates walked into the index. The logs will show you which template did it.
      `,
        [
          q('Which of these filtered listings has earned its own indexable URL?', [
            '`/beans?grind=fine&size=250g`, because those two filters are used most often',
            '`/beans/ethiopian-light-roast`, which has search demand and 40 products on it',
            '`/beans?sort=price&page=7`, because deep pages need the extra help being found',
            '`/beans?price_band=10-15`, because price is the first thing shoppers compare',
          ], 1, 'A facet combination is worth indexing only when people search for it and the result set is distinct and large enough to stay useful, which internal sort orders never are.'),
          q('Product pages are reachable only through filtered listings carrying noindex with follow. What happens over the following months?', [
            'The products inherit the noindex directive and drop out of the index within days',
            'Nothing changes, because the follow directive keeps those links live permanently',
            'The listings gain ranking, because noindex concentrates value onto the products',
            'Google crawls the listings less and treats their links as nofollow, orphaning products',
          ], 3, 'A page left on noindex long term is fetched less and less and Google ends up treating its links as nofollow, so anything reachable only through it loses its discovery path.'),
          q('Products live at /beans/yirgacheffe-1kg and filters at /beans?sort=price. A team deploys Disallow: /beans/ to stop filter crawling. What have they done?', [
            'Blocked all 4,100 product pages while not blocking a single filter URL',
            'Blocked the sort and price band parameters exactly as they intended to',
            'Removed filtered URLs from the index while keeping the products crawlable',
            'Written a rule Googlebot ignores, so nothing about the crawl has changed',
          ], 0, 'The rule matches a path segment, and a query string is not a path segment, so it hits every product under /beans/ and misses the parameter URLs entirely.'),
        ]
      ),
      lesson('Building Thousands of Pages Without Building Junk', 13, `
Two teams shipped roughly 12,000 new pages last quarter. One finished with 9,400 indexed and 180,000 monthly clicks. The other got 600 indexed, then a manual action for scaled content abuse, and spent five months getting it lifted. The templates were about equally pretty. The difference was what sat inside them.

Google's March 2024 spam policy named this directly: generating many pages at scale that add no value for users is a violation whether a person, a script, or a model produced them. Scale is not the offence. Empty pages at scale are.

### The delete the template test

Take one generated page and strike out every word that appears identically on the other 11,999. Read what survives. If it is a city name, a product count and a price, you have published a mail merge.

Weak: "Coffee Beans in Sheffield. We deliver coffee beans to Sheffield. Browse our range of coffee beans in Sheffield."

Strong, same URL: three named stockists with addresses, the two roasts Sheffield customers reorder most, the next day cutoff for that postcode area, and average delivery time measured across 1,240 real orders. All of it already sits in tables you own.

| Layer | Source | Varies per page? |
|---|---|---|
| Template copy | Written once | No |
| Product rows | \`inventory\` table | Yes |
| Delivery cutoff | Carrier zone data | Yes |
| Stockist list | CRM accounts | Yes |
| Reorder ranking | 18 months of orders | Yes |

Four layers out of five vary. That page has a reason to exist.

### Kill the tail before you build it

Run the pattern against real search volume and drop every row with none. Teams skip this step, and it is where the junk comes from.

\`\`\`python
rows = [
    r for r in inventory_by_city()
    if r.searches_per_month >= 40    # demand exists
    and r.products_in_stock >= 8     # page will not be thin
    and r.stockists >= 1             # something specific to say
]
print(len(rows))   # 2,180 of 9,600 candidate cities
\`\`\`

Seven thousand pages died in a list comprehension. That is the correct outcome, and far cheaper than building them and later asking Google to forget them.

### Ship in batches and read the indexation rate

Publish 300, put them in their own sitemap file, wait four weeks, then read submitted against indexed for that file alone.

| Batch | Submitted | Indexed at 4 weeks | Rate |
|---|---|---|---|
| cities-01 | 300 | 271 | 90% |
| cities-02 | 1,000 | 902 | 90% |
| cities-03 | 4,000 | 1,180 | 30% |

Batch three broke the pattern. Either the data thinned out at the long tail or the internal linking never reached those pages. Find out before batch four ships. Partitioned sitemaps exist so the coverage report can answer per batch instead of per site.

### They still need links

Twelve thousand pages that live only in a sitemap are twelve thousand orphans. Build the hub: a browsable index by region, cross links to the three nearest cities, and a link from the category page each one belongs under. Keep depth from the homepage under four clicks.

### The cost that arrives later

A large batch of weak pages does not only fail on its own. Quality is assessed partly at site level, so thin pages drag down sections that were doing fine, which is how a programmatic launch takes out a blog that had nothing to do with it. If a batch is still not indexing after eight weeks, do not tinker with the title tags. Remove it, return 410, and put the effort into the rows that had data behind them.
      `,
        [
          q('You strike out every word repeated identically across all 12,000 generated pages. Only a city name and a product count survive. What does that tell you?', [
            'The template is efficient, so those pages should index quickly once they are linked',
            'The pages need more copy above the fold to clear the quality threshold for indexing',
            'Nothing on the page gives a searcher a reason to land there, which is scaled content abuse',
            'The pages are fine, provided each one targets a different keyword from the others',
          ], 2, 'Value has to come from data that varies between pages, so a page whose only unique tokens are a name and a number offers a searcher nothing the template did not already say.'),
          q('Batches one and two indexed at 90%. Batch three of 4,000 pages indexed at 30% after four weeks. What is the right response?', [
            'Stop and find out whether the data thinned out or the internal linking never arrived',
            'Ship batch four straight away, since more volume lifts the overall indexation rate',
            'Resubmit the sitemap file every day until the remaining pages get picked up again',
            'Rewrite the title tags across all 4,000 pages and give it another month to settle',
          ], 0, 'A rate that collapses at the long tail is a signal about those pages or their links, and shipping more of the same widens the damage while making the diagnosis harder.'),
          q('A launch of 8,000 thin programmatic pages fails to index, and traffic to the existing blog falls as well. Why would the blog be affected?', [
            'The sitemap size limit was exceeded, so the blog URLs stopped being submitted',
            'Quality is judged partly at site level, so a batch of weak pages drags down the rest',
            'The blog posts and the new pages competed for exactly the same keywords throughout',
            'Crawl budget is fixed per site, so the blog stopped being crawled once quota ran out',
          ], 1, 'Google forms a view of the site as a whole, so publishing a large volume of low value pages can lower how favourably unrelated sections of the same site are treated.'),
        ]
      ),
      lesson('Hreflang and Running One Site in Many Markets', 14, `
German visitors kept landing on the UK product pages: prices in pounds, delivery quoted from Leeds, a checkout demanding a postcode in the wrong format. Conversion rate 0.4%, against 2.6% on the German pages. Those German pages existed, at \`/de/\`, and had done for six months. Google went on showing the English ones, because the annotations pointed one way and never came back.

### hreflang swaps versions, it does not win markets

The most expensive misunderstanding in international SEO: hreflang is not a ranking signal. It tells Google which of several near identical versions to show a given searcher. It will not make \`/de/\` rank in Germany if nothing on the site earns a ranking there. You still need German links, German content and German demand. hreflang only stops your own pages competing with each other.

### The return tag rule

Every annotation must be reciprocal. If the UK page lists the German one, the German page must list the UK one, and both must list themselves.

\`\`\`html
<link rel="alternate" hreflang="en-gb" href="https://riverbend.example/beans/yirgacheffe-1kg" />
<link rel="alternate" hreflang="de-de" href="https://riverbend.example/de/kaffee/yirgacheffe-1kg" />
<link rel="alternate" hreflang="fr-fr" href="https://riverbend.example/fr/cafe/yirgacheffe-1kg" />
<link rel="alternate" hreflang="x-default" href="https://riverbend.example/beans/yirgacheffe-1kg" />
\`\`\`

That exact block goes in the head of all three pages, unchanged, with absolute URLs. \`x-default\` is the fallback for every visitor you did not name.

Three more rules that break clusters quietly:

- Each annotated page must be self canonical. A canonical pointing elsewhere contradicts the annotation, and Google drops the lot.
- Codes are ISO 639-1 for language, ISO 3166-1 alpha 2 for region. \`en-GB\` is valid. \`en-UK\` is not, because the country code for the United Kingdom is GB. That typo is live on thousands of sites.
- Language first, region optional. \`de\` covers German everywhere, \`de-AT\` narrows it to Austria.

### Where to put them on a large site

| Method | Best for | Cost |
|---|---|---|
| HTML head | Few markets, small sites | Bytes on every page |
| HTTP header | PDFs and other non HTML files | Server config work |
| XML sitemap | Large sites | One build step, no page weight |

Forty thousand URLs across four markets is 160,000 annotations. In the head that is real weight on every request. In the sitemap it is a build step nobody has to remember.

### Structure

| Structure | Geo signal | Notes |
|---|---|---|
| \`riverbend.de\` | Strongest | Separate authority to build, separate everything |
| \`riverbend.example/de/\` | Moderate | Shares site authority, cheapest to run |
| \`de.riverbend.example\` | Moderate | Treated closer to a separate site |

For most businesses the subdirectory wins, because one domain's links carry every market instead of four domains each starting at zero.

### The redirect that hides you from Google

Never auto redirect by IP address. Googlebot crawls predominantly from United States addresses, so an IP redirect means it fetches the US version whichever URL it asked for, and your German and French pages never get indexed. Show a dismissible banner instead: "Shopping from Germany? Visit our German store." Suggest, link, let the visitor choose. The same trap applies to switching content on \`Accept-Language\`, since a crawler that sends no such header is invisible to the rule.

### Same language, different market

\`en-GB\`, \`en-US\` and \`en-AU\` pages differing only in spelling are duplicates. hreflang handles that with no penalty, but if the pages are truly identical Google may pick one canonical and ignore the annotations anyway. Give each market its own prices, currency, delivery terms, stockists and returns policy. That is what makes them three pages rather than one page with three URLs.
      `,
        [
          q('You ship correct hreflang for /fr/ and expect French rankings to follow. Three months later there is almost no French traffic. Why?', [
            'hreflang takes six to twelve months to be fully processed on a large site',
            'French pages need a country domain before hreflang has any effect at all',
            'The x-default annotation overrides regional ones unless you remove it first',
            'hreflang chooses between versions you already rank with, it creates no rankings',
          ], 3, 'The annotation is a swap instruction between near duplicate versions, so a market with no French links, content depth or demand behind it still has nothing to rank with.'),
          q('The site redirects every visitor to a market version based on their IP address. What does that do to indexing?', [
            'Nothing, because Googlebot declares its target country in a request header',
            'Googlebot crawls mostly from US addresses, so it only ever sees the US pages',
            'Crawl demand doubles, because each URL now gets fetched once per market',
            'It is harmless once hreflang is live, since annotations override any redirect',
          ], 1, 'A crawler redirected before it can fetch the URL it asked for never reaches the other market versions, so those pages go unindexed no matter how correct the annotations are.'),
          q('Your UK page carries an hreflang entry for the German page, but the German page lists no alternates at all. What is the result?', [
            'Google keeps the one way annotation and starts showing the German page in Germany',
            'The German page gets treated as a canonical duplicate and merged into the UK page',
            'The annotation is unconfirmed, so Google discards it and keeps showing the UK page',
            'Only the x-default fallback stops working, and the rest of the cluster still applies',
          ], 2, 'Annotations have to be reciprocal, so a cluster where one page never points back is treated as unverified and dropped, which is exactly what leaves German visitors on the UK page.'),
        ]
      ),
      ],
      [
      q('38,000 product URLs sit in your sitemap and appear nowhere in 30 days of verified Googlebot logs. What does that describe?', [
        'A discovery failure: budget went elsewhere, or those pages sit too deep to reach',
        'A duplicate content problem that self referencing canonical tags would resolve',
        'A rendering problem that only server side rendering of the catalogue can fix',
        'A quality penalty, since Google skips URLs it has already judged to be thin',
      ], 0, 'Pages that were never fetched have not been judged on quality at all, so the problem is how the crawler reaches them rather than what they contain.'),
      q('Sitemap URLs stayed at about 4,250 while indexed pages jumped from 3,905 to 41,700 in one month. What should you look for?', [
        'A rise in server response time that slowed the crawl of your real product pages',
        'Something began linking parameter URLs, so near duplicates entered the index',
        'A canonical tag change that quietly removed product pages from the sitemap file',
        'A Search Console reporting delay that will correct itself over the next 28 days',
      ], 1, 'Indexed pages far exceeding submitted pages means Google found URLs you never offered it, and newly linked filter or sort parameters are the usual source of them.'),
      q('Which pair of checks best decides whether a page template should ship at 12,000 pages?', [
        'Word count per page, and how many internal links currently point at each one',
        'Keyword density in the H1, and how many images the finished template carries',
        'Whether the query has real demand, and whether unique data survives the template',
        'Mobile page speed, and whether the generated URL slug contains the target keyword',
      ], 2, 'Scaled pages fail when nobody searches for them or when nothing on them varies, so demand and data density are the two filters that decide which rows are worth building.'),
      q('A UK retailer opening in Germany, France and Spain wants the fastest route to ranking in all three. Which structure usually serves it best?', [
        'Three country domains, since each one carries the strongest possible geo signal',
        'Three subdomains, so that each market can be hosted inside its own country',
        'One URL per product, with the content switched by the Accept-Language header',
        'Subdirectories on the existing domain, so one site\'s authority carries all markets',
      ], 3, 'Subdirectories let every market inherit the links the domain already has, while separate country domains each begin at zero authority and need their own link building.'),
      ]
    ),
    chapter(
      'Consent, Server-Side Tracking, and First-Party Data',
      'Rebuilding measurement for a world where a large share of visitors decline cookies: moving the tag onto your own server, feeding real revenue back from the CRM, and staying inside the rules while you do it.',
      [
      lesson('Consent Mode and the Data You Never Collect', 13, `
Riverbend's cookie banner went live on 3 March. On 4 March, GA4 reported 6 purchases against a normal Tuesday's 11. Shopify reported 11. Nothing broke, and no tag was misconfigured. The site simply stopped being allowed to watch most of the people using it.

That is the whole subject in one paragraph. A large share of your visitors are now invisible by law, and the job is to rebuild measurement that is honest about the hole instead of pretending it closed.

### What a consent banner actually switches off

Consent Mode is not the banner. It is four flags that every Google tag reads before it does anything at all:

| Signal | What it gates |
|---|---|
| analytics_storage | GA4 cookies, so the client ID, sessions and user counts |
| ad_storage | Ads cookies, so click ID storage and remarketing lists |
| ad_user_data | Whether user data may be sent to Google for advertising |
| ad_personalization | Whether that data may drive personalised ads |

The defaults have to be set before the tag container loads, not after. Get the order wrong and the first pageview fires with storage granted, which is the exact thing the banner exists to prevent, and it is the most common finding in a cookie audit.

\`\`\`html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
</script>
<!-- the GTM container loads after this block, never before -->
\`\`\`

When someone accepts, you push an update. Nothing reloads.

\`\`\`javascript
gtag('consent', 'update', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
\`\`\`

### Basic, advanced, and why the difference decides your numbers

In **basic** consent mode, tags do not load until someone accepts. A visitor who declines produces literally nothing: no pageview, no event, no row.

In **advanced** consent mode, the tag loads and sends a cookieless ping. No client ID, no cookies, just an event carrying its consent state. Google then models the missing conversions from the behaviour of consented users.

The modelling is where people get caught. It only switches on above volume thresholds, and they are not small: roughly 1,000 events a day with analytics_storage denied for seven straight days, plus around 1,000 consented daily users on seven of the last 28, per property and per country. Riverbend does 400 sessions a day across three countries. It will never model anything. Advanced mode still earns its keep, because the cookieless pings preserve traffic source and let you see which channel the invisible visitors came from, but the conversion gap stays a gap.

### Consent rates are not a constant

The same banner, the same site, three markets, one month:

| Market | Accept all | Reject all | Share of orders GA4 sees |
|---|---|---|---|
| United States | 88% | 12% | roughly 88% |
| United Kingdom | 71% | 29% | roughly 71% |
| Germany | 44% | 56% | roughly 44% |

Germany now looks like the weakest market in every platform report. It is only the most private one. Any comparison across countries that leans on tag data is measuring banner behaviour as much as buying behaviour, and the gap is wide enough to reverse a ranking.

### The mistake that costs a quarter

Comparing post-banner numbers with pre-banner numbers and calling it a traffic drop. Re-baseline on the day the banner shipped, annotate the chart so the next person does not repeat the panic, and hold every target against the new baseline.

Then keep one uncensored source of truth: the orders table in the shop database, the invoices, the rows nobody needs permission to count. Platform figures become a ratio you apply to that number, never the number itself.

And the tempting fix that is not one. Making the reject button harder to find, three clicks deep behind a settings panel while accept sits under the thumb, is a breach of the requirement that refusal be as easy as consent. It is also the first thing a regulator checks, because it takes ten seconds to test.
      `,
        [
          q('Riverbend adds Consent Mode but the GTM container loads above the consent default block. What actually happens?', [
            'The first pageview fires with storage granted, which is the exact thing the banner exists to prevent',
            'The container queues its events until the defaults arrive, so nothing is lost',
            'Consent Mode silently falls back to basic mode for that visitor',
            'GA4 discards the session and records no data for that user',
          ], 0, 'Tags read the consent flags at load time, so defaults set after the container has loaded arrive too late to stop the first hit writing cookies.'),
          q('Riverbend runs advanced consent mode at 400 sessions a day across three countries. Why do modelled conversions never appear in GA4?', [
            'Advanced consent mode only models data for ecommerce properties',
            'Modelling needs roughly 1,000 denied events a day for seven days, a bar the site never reaches',
            'Modelling switches off whenever a property receives traffic from more than one country',
            'Cookieless pings carry no traffic source, so there is nothing left to model from',
          ], 1, 'Conversion modelling has volume thresholds per property and per country, and a site at 400 sessions a day sits far below them however the tags are configured.'),
          q('Germany accepts cookies at 44% and the United States at 88%. What is the safest way to compare the two markets\' revenue?', [
            'Use GA4 purchases, since consent affects both markets in the same way',
            'Multiply the German GA4 revenue by two to correct for the gap',
            'Leave Germany out of reporting until its consent rate improves',
            'Count orders in the shop database and treat platform figures as a ratio',
          ], 3, 'The orders table is uncensored by consent, so it gives a comparable number for both markets while tag data measures banner behaviour as much as buying behaviour.'),
        ]
      ),
      lesson('Server-Side Tagging and the Conversion API', 14, `
On that same Tuesday, Meta's browser pixel reported 61 purchases. The shop database reported 104. Riverbend moved the purchase event to a server container and matched purchases went to 96 of 104, for about $118 a month in hosting. Reported ROAS moved from 2.1 to 3.3 on unchanged spend. That is not growth. It is the same sales, finally counted.

### Two different things people both call server-side

**Server-side tagging** is a container you run yourself, usually a Google tagging server on Cloud Run, answering on a subdomain of your own site such as \`metrics.riverbend.example\`. The browser sends one request to your server, and your server decides what goes on to GA4, Meta and the rest.

**A conversions API** is a direct server to server call from your own backend to a platform endpoint. It needs no tagging server at all. Riverbend's order-paid webhook can post straight to Meta.

| Approach | Where the event starts | Survives ad blockers | Effort |
|---|---|---|---|
| Browser pixel | Visitor's browser | No | None |
| Tagging server | Browser, proxied by you | Mostly | Container plus DNS |
| Conversions API direct | Your backend | Yes | One webhook |

The recovery has two mechanics behind it. Safari's tracking prevention caps a cookie written by JavaScript at seven days, and at 24 hours when the visitor arrived through a link carrying a cross-site click identifier. A cookie written by your own server in an HTTP response header, on your own domain, is not subject to that cap. Separately, blockers drop requests to known tracker hostnames, and a request to your own subdomain is not one.

### The bug that doubles your ROAS

\`event_id\` is the whole game. Send the browser event and the server event without a shared id and the platform counts both.

Broken: 104 real orders arrive as 92 browser events plus 96 server events, so the dashboard shows 188 purchases and a ROAS near 6.0. Someone lifts the budget 40% on that number. Nothing improves, because the extra sales were arithmetic.

Fixed: identical \`event_name\` and \`event_id\` on both sides, deduplicated inside the platform's window, and 104 orders report as roughly 104. Take the id from something that already exists and is stable, such as the order id, never from a random value generated twice.

\`\`\`javascript
// server/webhooks/order-paid.js
import crypto from 'crypto';
const sha = (v) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

export async function sendPurchase(order) {
  const body = { data: [{
    event_name: 'Purchase',
    event_time: Math.floor(Date.parse(order.paid_at) / 1000),
    event_id: order.id,              // the browser event must send this too
    action_source: 'website',
    event_source_url: 'https://riverbend.example/checkout/thank-you',
    user_data: {
      em: [sha(order.email)],
      ph: [sha(order.phone_e164)],
      client_ip_address: order.ip,
      client_user_agent: order.user_agent,
      fbc: order.fbc, fbp: order.fbp
    },
    custom_data: { currency: 'GBP', value: order.total_gbp }
  }]};
  await postToGraphApi(body);
}
\`\`\`

### Match quality is a dial, not a switch

Riverbend's matched purchases, out of the same 104 real orders:

| What is sent | Matched |
|---|---|
| Browser pixel only | 61 |
| Server event, IP and user agent only | 68 |
| Plus hashed email | 89 |
| Plus hashed phone and the fbc click id | 96 |

\`fbc\` is built from the \`fbclid\` parameter on the landing URL. Capture it on entry and carry it onto the order record, because by the time checkout finishes the original query string is long gone, and it is the strongest single signal in the payload.

### What it does not fix

Server-side tagging is not a consent workaround. Moving the request to your own domain changes where data flows, not whether you were allowed to collect it. The consent state travels with the event, and a server container that quietly forwards events for people who declined is a worse finding than the pixel ever was, because it reads as deliberate.

Watch the bill as volume grows. Riverbend's 600,000 events a month run on two small instances for about $118. At 30 million events the same design is a four figure invoice, and the first move is filtering junk events at the server rather than adding capacity.
      `,
        [
          q('Riverbend sends both a browser Purchase event and a server Purchase event with no shared event_id. What is the first symptom?', [
            'Meta rejects the server events as malformed and logs an error',
            'Purchases roughly double in the platform and reported ROAS rises with no extra sales',
            'The browser pixel stops firing once a server event arrives for the order',
            'Match quality falls because the two events compete for the same user',
          ], 1, 'Deduplication depends on a shared event name and event id, so without one the platform treats the two sends as separate sales and inflates every efficiency metric built on them.'),
          q('Why does a cookie written by Riverbend\'s own tagging server outlive one written by the GA4 JavaScript in Safari?', [
            'A cookie set by your server on your own domain escapes the seven day cap applied to script-written cookies',
            'Safari extends the life of any cookie carrying the Secure and SameSite attributes',
            'Server cookies are held in local storage rather than the cookie jar',
            'Tracking prevention only limits cookies belonging to a third-party domain',
          ], 0, 'Safari\'s tracking prevention caps cookies written by document.cookie, so moving the write into an HTTP response header from your own server is what restores the longer lifetime.'),
          q('A team moves every tag server-side and forwards events for visitors who rejected the banner, arguing the request now comes from their own domain. Why is that wrong?', [
            'Nothing is wrong, because first-party requests sit outside the rules',
            'Only the analytics events break the rules, advertising events are exempt',
            'The platform will reject the events during its own consent checks',
            'Consent governs whether you may collect and share the data, not which server sends it',
          ], 3, 'The lawful basis attaches to the processing of a person\'s data, so relocating the request changes the plumbing while leaving the original refusal fully in force.'),
        ]
      ),
      lesson('Offline Conversions and Closing the CRM Loop', 14, `
Riverbend's wholesale side runs two Google Ads campaigns. Both deliver enquiries at about $80, so Smart Bidding, seeing only form fills, splits the budget evenly and drifts towards the cheaper one. Six months of pipeline tells a different story.

| Campaign | Leads | Cost per lead | Close rate | Accounts | Revenue | Cost per account |
|---|---|---|---|---|---|---|
| wholesale coffee supplier | 90 | $82 | 26% | 23 | $27,600 | $321 |
| cheap coffee bulk | 110 | $78 | 4% | 4 | $3,800 | $2,145 |

The platform cannot see the last four columns, so it keeps buying the second campaign and calling it the winner. Nobody is lying. The algorithm is optimising exactly the thing you gave it.

### The loop, in four moves

1. Capture the click identifier when the visitor lands.
2. Store it on the CRM record, not only in a cookie.
3. When the deal closes, send the conversion back with its value.
4. Bid to that value instead of to the lead.

The identifiers are \`gclid\` for Google Ads, \`wbraid\` and \`gbraid\` for app and web to app journeys where \`gclid\` is unavailable, \`msclkid\` for Microsoft, and \`fbclid\` for Meta.

\`\`\`javascript
// public/js/capture-click-id.js
const params = new URLSearchParams(location.search);
for (const key of ['gclid', 'wbraid', 'gbraid', 'msclkid', 'fbclid']) {
  const value = params.get(key);
  if (value) document.cookie = \`rb_\${key}=\${value};path=/;max-age=7776000;samesite=lax\`;
}
\`\`\`

Copy that cookie into a hidden field on the enquiry form and write it to the CRM record. A click id that lives only in a cookie dies the moment a buyer switches from the phone they browsed on to the office desktop they enquire from, which for wholesale is most of them.

The upload itself is unglamorous:

\`\`\`csv
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
Cj0KCQjw_ry1BhCPARIsAM,Wholesale account opened,2026-05-14 09:42:00 Europe/London,1240,GBP
\`\`\`

### The three things that catch people

**The window.** Google will not accept a conversion whose click falls outside the campaign's click-through conversion window, which tops out at 90 days. Riverbend's wholesale cycle averages 47 days with a tail past 120. Set the window to 90 before the campaign runs, because you cannot apply it retrospectively, and every deal that closes after day 90 is invisible for good. Where the cycle is genuinely longer, enhanced conversions for leads matches on a hashed email address instead of a click id and sidesteps the problem.

**The lag.** A bidding algorithm learning from a signal that arrives 47 days late is steering with old information, and it wants roughly 30 conversions in 30 days per campaign to learn at all. Riverbend closes 27 accounts a quarter. The fix is a weighted proxy: upload a "qualified enquiry" action the moment sales marks the lead qualified, valued at close rate multiplied by average gross profit, and upload the real account as a separate action later.

**The value.** Upload gross profit, not revenue. A target ROAS of 4 tells the system to spend 25% of the revenue it expects. On the 38% margin house blend that is fine. On a 12% margin wholesale sack it loses money on every order while the dashboard glows green, because the margin is thinner than the ad cost the target permits.

### The check that proves it is live

Two months in, pull cost per **account** by campaign rather than cost per lead. If the ranking has not changed, either the close rates were never that different or the upload is failing silently. Google Ads shows a "last imported" timestamp on each imported conversion action, and a stale one is the first thing to look at, because a broken upload and a campaign that genuinely stopped working produce the same flat line.
      `,
        [
          q('Riverbend\'s wholesale deals close 47 days after the click on average, with a tail running past 120 days. What breaks?', [
            'Deals closing beyond the 90 day click-through window can never be imported against their click',
            'The gclid itself expires after 30 days and the upload row is rejected',
            'Late conversions get counted twice, once as a lead and once as a sale',
            'Google reassigns the conversion to whichever campaign ran most recently',
          ], 0, 'The click-through conversion window tops out at 90 days and cannot be applied retrospectively, so the longest and most valuable deals fall outside it permanently.'),
          q('Riverbend uploads order revenue as the conversion value and bids to a target ROAS of 4. Where does that lose money?', [
            'On any line where the average order value sits below the cost per click',
            'On any line whose gross margin is under the 25% of revenue the target allows as ad cost',
            'Nowhere, because target ROAS already accounts for cost of goods sold',
            'Only on subscription lines, where the revenue arrives across many months',
          ], 1, 'A target ROAS of 4 permits spending a quarter of revenue on ads, so any product whose margin is thinner than that quarter is sold at a loss even when the target is hit exactly.'),
          q('Smart Bidding wants around 30 conversions in 30 days, and Riverbend closes 27 wholesale accounts a quarter. What is the practical fix?', [
            'Switch the campaign to manual CPC and reset the bids by hand each week',
            'Loosen keyword match types until conversion volume climbs above the threshold',
            'Upload a weighted qualified-enquiry action valued at close rate times gross profit',
            'Extend the conversion window well past 90 days so more deals qualify',
          ], 2, 'A mid-funnel action fires often enough to train the algorithm while its value still encodes what the deal is really worth, which a raw form fill count does not.'),
        ]
      ),
      lesson('First-Party Data and What You Are Allowed to Keep', 13, `
A partner offers Riverbend 40,000 email addresses of "verified coffee buyers" for 600 pounds. It is the cheapest list anyone will ever offer you, and buying it is the most expensive decision on this page.

Consent under the GDPR must be freely given, specific, informed, unambiguous, and given to you by name. Consent collected by somebody else for their own list does not travel. Send to it anyway and the commercial damage arrives long before any regulator does: a bought list bounces hard, complaint rates spike, and your sending domain reputation takes months to rebuild, which puts the shipping notices your real customers are waiting for into their spam folder.

### The lawful basis decides everything downstream

| Basis | When it applies | What it permits |
|---|---|---|
| Consent | An unticked box the person chose to tick | Marketing email, ads audiences, personalisation |
| Contract | Needed to deliver what was bought | Order confirmations, shipping, returns |
| Legitimate interest | Fraud checks, some B2B contact, some analytics | Narrow, and needs a balancing test you write down |
| Soft opt-in | Existing customer, similar product, opt-out offered every time | Marketing to people who already bought |

Soft opt-in is the basis businesses forget they already hold. Riverbend's 3,100 past customers can be emailed about coffee without a separate marketing tick, provided an opt-out was offered at the point of sale and appears in every message since. They cannot be emailed about the partner's grinder subscription, because that is not a similar product and the exemption does not stretch to it.

### Hashing is not anonymising

The most expensive misconception in ad tech: a SHA-256 of an email address is still personal data. It is pseudonymised, which is a security control, not an exemption. The entire point of the hash is that it still matches one specific human on the other side. So a customer list upload is a disclosure of personal data, and it needs a basis, a line in your privacy notice, and a route back out.

\`\`\`javascript
import crypto from 'crypto';
// normalise first, or nothing matches and you blame the platform
const normalise = (email) => email.trim().toLowerCase();
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

hash(normalise('  Ada.Okafor@Example.COM  '));
// same digest as hash('ada.okafor@example.com')
\`\`\`

Skip the normalise step and match rates collapse to something like 30%, which teams almost always diagnose as a broken integration.

### Keep less, on purpose

Minimisation is not a legal nicety. It is what makes a breach survivable, because data you never stored cannot leak.

| Field | Retention | Reason |
|---|---|---|
| Name, email, delivery address | Account life plus 7 years of orders | Tax records require the order history |
| Card number | Never stored, payment token only | Removes the worst thing to lose |
| Full IP in the events table | 30 days, then truncated | Debugging, and nothing after that |
| GA4 user level data | 14 months | The longest setting the product offers |
| Purchased lists | Never | No basis exists to hold them |

Erasure has to reach outward too. Deleting the row from your database while the hashed email still sits inside a Meta custom audience and a Google customer match list is a half-finished deletion, and the person will keep seeing your ads and know it.

One more trap. Special category data covers health, ethnicity, religion and similar, and it is defined by what a segment implies rather than what you named it. Coffee sounds safe until somebody builds a "decaf, pregnancy" audience, at which point the segment infers a health condition and both major ad platforms ban it outright.

### The one document worth an afternoon

Write a data map: every field you collect, where it lives, its lawful basis, its retention, and who else receives it. It is the first thing an enterprise buyer's security review asks for, the first thing a regulator asks for, and the only reliable way to discover that you have been keeping full IP addresses in an access log since 2019. Rules differ by jurisdiction, so treat this as the shape of the problem rather than advice on yours.
      `,
        [
          q('A partner offers Riverbend 40,000 addresses of verified coffee buyers. Why can Riverbend not email them?', [
            'The addresses would need to be hashed before they could be used lawfully',
            'Consent is given to a named organisation and does not transfer with a list',
            'The list may be used to build ads audiences but never for email',
            'It becomes lawful as soon as an unsubscribe link is added to the first message',
          ], 1, 'Consent has to be specific and informed about who will contact the person, so permission given to one company creates no permission for another that later buys the file.'),
          q('A team argues that uploading SHA-256 hashed emails to an ad platform is not processing personal data. What is wrong with that?', [
            'Hashing is pseudonymisation, and the hash still picks out one specific person',
            'SHA-256 is reversible, so the platform can simply recover the address',
            'The upload is anonymous but the platform\'s response back is not',
            'The reasoning holds only once the hash has been salted before upload',
          ], 0, 'The hash is built precisely so it matches an individual on the other side, which is what makes it personal data rather than anonymous data.'),
          q('A customer asks to be deleted and the row is removed from the shop database. What is still incomplete?', [
            'The order history has to go too, including the records kept for tax',
            'A confirmation must be emailed to the address that was just deleted',
            'The hashed email still sits in the custom audience and customer match lists',
            'Last night\'s backup has to be restored and edited before it expires',
          ], 2, 'Erasure has to reach every place the data was sent, and lists already uploaded to ad platforms keep matching the person until they are removed there as well.'),
        ]
      ),
      ],
      [
      q('GA4 purchases fall 41% the week a consent banner ships, while the shop database shows orders flat. What is the right response?', [
        'Roll the banner back until the reporting has been repaired',
        'Re-baseline reporting on the banner date and use the orders table as the truth',
        'Move to basic consent mode so that the numbers settle down',
        'Scale GA4 purchases up by the inverse of the accept rate each month',
      ], 1, 'The sales did not change, only the share of them you are permitted to observe, so the fix is a new baseline plus an uncensored source of truth rather than any tag change.'),
      q('Which problem does moving to server-side tagging genuinely solve?', [
        'The requirement to collect consent before gathering advertising data',
        'The 56% of German visitors who reject the banner outright',
        'Cookie lifetime caps and blocked requests to third-party tracker hosts',
        'Disagreements between Meta\'s reported conversions and GA4\'s figures',
      ], 2, 'Server-set first-party cookies escape the browser caps on script-written ones and requests to your own subdomain are not on blocker lists, while consent and attribution differences are untouched.'),
      q('A wholesale campaign optimises to form fills, buying leads at $78 that close at 4% while a pricier campaign closes at 26%. Which change fixes the incentive?', [
        'Lower the target cost per lead until only the good leads come through',
        'Add negative keywords until the cheaper campaign stops serving at all',
        'Move to broader match types and let the bidding algorithm sort it out',
        'Send closed deal value back from the CRM and bid to that value',
      ], 3, 'The algorithm optimises whatever signal it receives, so it keeps favouring cheap leads until the signal itself carries the value of the deals those leads become.'),
      q('Riverbend has 3,100 past coffee customers who never ticked a marketing box. What may it lawfully email them about?', [
        'Nothing at all, until each of them gives fresh explicit consent',
        'Any offer it likes, since an existing customer relationship covers marketing',
        'The partner\'s grinder subscription, because it is a closely related category',
        'Similar coffee products, under soft opt-in, with an opt-out in every message',
      ], 3, 'Soft opt-in covers marketing of similar products to people who already bought, provided an opt-out was offered when the data was collected and is repeated in each send.'),
      ]
    ),
    chapter(
      'Incrementality, Experiments, and Mix Modelling',
      'Separating the sales your marketing actually caused from the sales the platforms merely reported, using geo holdouts, mix modelling, and a calendar of tests that keeps both honest.',
      [
      lesson('Why Three Platforms All Claim the Same Sale', 13, `
Riverbend's October closed with 2,180 orders in Shopify. Then the ad platforms filed their own accounts of the same month.

| Source | Conversions claimed | Revenue claimed |
|---|---|---|
| Google Ads | 1,240 | $71,900 |
| Meta Ads | 980 | $54,300 |
| TikTok Ads | 310 | $17,200 |
| Klaviyo (email) | 640 | $38,800 |
| **Sum of platforms** | **3,170** | **$182,200** |
| **Actually happened** | **2,180** | **$126,400** |

The platforms between them claim 145% of the orders that existed. Nobody is lying. Every one of those numbers is correctly calculated under the rules the platform wrote for itself.

### Three mechanisms, stacked on top of each other

**No deduplication across walled gardens.** Google cannot see Meta's touchpoints and Meta cannot see Google's. A customer who clicks a Meta ad on Tuesday and a search ad on Thursday appears whole in both ledgers. There is no referee holding the two reports side by side, and there never will be.

**View-through windows.** Meta's default is 7-day click plus 1-day view. Someone who scrolled past your ad without clicking, then bought the next day from an email, is a Meta conversion. Display and video are worse: a 30-day view window on a retargeting campaign claims almost everybody who has ever visited the site.

**Modelled conversions.** With consent rates where Chapter 9 left them, a large share of what platforms report is estimated rather than observed. The estimate is produced by the company that gets paid when the number is large.

### The question the reports never ask

Attribution asks which touchpoints came before the sale. Incrementality asks something different and much harder.

\`\`\`text
Incremental orders = orders while the campaign runs
                   - orders that would have happened anyway
\`\`\`

That second term is a counterfactual. It is never observed, for any campaign, ever. Platform reporting quietly sets it to zero, which is the strongest assumption available and is almost never true.

### Why "the exposed group converted more" proves nothing

The broken analysis, run in some form at nearly every company:

\`\`\`text
Saw the retargeting ad:    8,400 people,  9.2% bought
Did not see it:           41,000 people,  1.1% bought
Conclusion drawn: "retargeting multiplies conversion by 8x"
\`\`\`

The exposed group was picked by an optimisation algorithm whose entire job is finding people likely to buy. It found them by reading what they had already done: viewed a product, added to basket, came back three times this week. The gap measures the targeting. Run the same comparison for a placebo campaign advertising an unrelated charity to the same audience and the gap barely moves.

The famous version is eBay's 2013 experiment. It switched branded search advertising off across matched US regions and found that nearly all of those paid clicks simply moved down the page to the free organic result sitting directly beneath. Those ads had been reporting a healthy return for years.

### What changes on Monday morning

- Stop summing platform-reported revenue. The total is not a quantity of anything.
- Stop ranking channels by their own ROAS. Two figures computed under different windows and different rules are not comparable, even to one decimal place.
- Keep one number nobody owns: blended CAC and MER from Chapter 7, computed from the order system.
- Treat every platform figure as an upper bound on that channel's contribution. Useful for steering inside the channel, useless for choosing between channels.

Everything that follows exists to produce that second term in the equation. There are exactly two ways to get it. Hold something out and watch what happens, or model the whole system and hold the model to account against the holdouts. Serious teams do both, and each one catches what the other misses.
      `,
        [
          q('Google, Meta, TikTok and Klaviyo together claim 3,170 conversions in a month when the order system recorded 2,180 orders. What is the most likely explanation?', [
            'One of the platforms has a conversion tag firing twice on the thank-you page',
            'The order system is undercounting because of consent refusals at checkout',
            'Each platform credits itself for the same sales, with no deduplication between them',
            'The surplus is offline and phone orders that the ecommerce system never sees',
          ], 2, 'Walled gardens cannot see each other\'s touchpoints, so a customer who met two platforms is counted once by each and the totals overlap rather than add up.'),
          q('A retargeting audience converts at 9.2% while unexposed visitors convert at 1.1%. Why is calling that an 8x lift wrong?', [
            'The algorithm selected the exposed group for buying intent, so the gap measures targeting',
            'Conversion rates cannot be compared across audiences of unequal size',
            'The unexposed group contains bot traffic, which drags its rate downward',
            'View-through conversions have inflated the exposed group\'s revenue figure',
          ], 0, 'Ad delivery is not random, so the exposed group was already far more likely to buy and the comparison confounds selection with the effect of the advertising.'),
          q('What does every platform conversion report assume about the counterfactual?', [
            'That it matches the organic conversion rate over the same reporting period',
            'That it is estimated from a matched and randomly held out control group',
            'That it decays across the length of the configured attribution window',
            'That it is zero, so no credited sale would have happened without the ad',
          ], 3, 'Reports count the sales that followed an ad and never subtract the sales that would have occurred anyway, which is the strongest assumption a report can make.'),
        ]
      ),
      lesson('Designing a Geo Holdout Test', 14, `
Riverbend paused Meta prospecting in five cities for two weeks. Orders in those cities fell 3.1%. The read-out said "no significant effect", and three months of argument followed about whether paid social does anything at all.

The test never had a chance. With five regions and two weeks of data, the smallest change it could distinguish from noise was around 12%. It was hunting an effect of maybe 5%. The result was decided by the design, before a single ad was paused.

### The unit of randomisation is the region, not the person

Person-level holdouts inside an ad platform are graded by the platform. A geo test is graded by your order system, which is the only ledger that counts each sale once.

**1. Pick regions your buying platform can actually target.** In the UK that means postcode areas or the 15 ITV regions. In the US, the 210 DMAs. Do not invent regions the ad platform cannot include or exclude, because the design has to survive contact with a campaign setting.

**2. Match on behaviour, not on the map.** Pull 52 weeks of orders per region, then pair regions with similar volume, similar trend and similar seasonal shape, and randomise inside each pair. Manchester pairs with Leeds, not with a rural region carrying a tenth of the volume.

**3. Run the power calculation before you commit anything.**

\`\`\`text
Weekly orders per region: mean 78, standard deviation 11   (CV = 0.14)
Rule of thumb MDE = 2.8 x CV / sqrt(regions x weeks)

12 regions, 6 weeks:  2.8 x 0.14 / sqrt(72)  = 0.046  ->  4.6%
 5 regions, 2 weeks:  2.8 x 0.14 / sqrt(10)  = 0.124  ->  12.4%
\`\`\`

A test whose minimum detectable effect is larger than the effect you expect is a six week donation of clarity to the platform. Calculate it first, every time.

**4. Hold a pre-period.** Four weeks with nothing changed, checking that the two arms move together. Arms that already drift apart before the test cannot be rescued by any analysis afterwards.

**5. Read total orders, never the paused channel's own report.**

\`\`\`text
                        Pre 6 wks   Test 6 wks   Change
Holdout  (ads paused)      4,680       4,142     -11.5%
Control  (ads running)     4,540       4,489      -1.1%

Difference in differences: -10.4%
Incremental orders lost:   10.4% x 4,680 = 487
Spend saved in the holdout: $9,900
Incremental cost per order: $9,900 / 487 = $20.33
\`\`\`

Meta reported 1,090 conversions in those same regions at $9.08 each. The honest figure is $20.33, against $18.70 of gross profit per order. That spend loses money, and no amount of creative testing inside the account would have revealed it.

### Four ways a geo test quietly breaks

**Spillover.** Platforms infer location and get it wrong at the edges. Commuters cross boundaries, word of mouth crosses boundaries. Spillover always drags the estimate toward zero, so a contaminated test understates the channel.

**Budget reallocation.** Pausing half the country does not halve a national budget. The algorithm pours that money into the control regions, lifting them while the holdout falls, and the measured gap comes out roughly double the truth. Run the two arms as separate campaigns with separate budgets, and check spend by region weekly.

**Too short for the purchase cycle.** Riverbend's median gap from first visit to first order is 9 days. A two week test measures barely one cycle and misses the delayed response entirely. Run at least four times the median lag.

**Peeking.** Checking daily and stopping the moment the number looks good turns a 5% false positive rate into something closer to 25%.

### When you cannot turn the channel off

"We cannot go dark" is a fair objection, and the answer is not to argue. Double the spend in half the matched regions instead. Identical design, identical arithmetic, and it measures what the next dollar buys rather than what all the dollars buy. That is the number the budget meeting actually needs.
      `,
        [
          q('A geo test uses 5 regions over 2 weeks to hunt an effect of about 5%, with a regional coefficient of variation of 0.14. What is wrong?', [
            'Two weeks is too short for the campaign to exit its learning phase',
            'The design can only detect changes above roughly 12%, so a 5% effect is unreadable',
            'Five regions works only if they are matched on population rather than orders',
            'The coefficient of variation should be measured on revenue instead of orders',
          ], 1, 'Minimum detectable effect falls with the square root of regions times weeks, so a design whose MDE exceeds the expected effect is inconclusive before it launches.'),
          q('During a holdout, the paused campaign shares a single national budget with the control regions. What happens to the result?', [
            'The platform pauses the entire campaign, which ends the test early',
            'Nothing, because budget is allocated by auction rather than by region',
            'The holdout regions keep seeing ads through lookalike audience expansion',
            'Spend floods into the control regions, inflating them and overstating the effect',
          ], 3, 'Difference in differences assumes only the treatment arm changed, so extra spend landing in the control arm widens the gap and exaggerates the measured lift.'),
          q('Holdout regions fall 11.5% while control regions fall 1.1% over the same six weeks. Which figure is the incremental effect?', [
            '10.4%, the difference between the two changes',
            '11.5%, the fall in the regions where ads were paused',
            '12.6%, the two observed changes added together',
            '1.1%, the underlying drift shared by both arms',
          ], 0, 'The control arm measures what would have happened anyway, so subtracting its drift from the treatment change isolates the part caused by the advertising.'),
        ]
      ),
      lesson('Marketing Mix Modelling and Its Limits', 14, `
The agency's mix model said paid social contributed 18% of revenue at an incremental return of 3.1. Two settings were changed and no new data was added: the adstock decay went from 0.6 to 0.2, and the saturation half-point from $40,000 to $12,000. The same 156 weeks now said 9% and a return of 1.4.

That is the honest place to start. A mix model is an argument assembled from data, not a measurement taken from it.

### What the model actually is

A regression on weekly time series, nothing more exotic.

\`\`\`text
sales_week = baseline
           + b1 x adstock(saturate(search_spend))
           + b2 x adstock(saturate(social_spend))
           + b3 x adstock(saturate(tv_spend))
           + b4 x discount_depth
           + b5 x price_index
           + b6 x seasonality and holidays
           + error
\`\`\`

No cookies, no pixels, no consent banner. That is the appeal: every problem Chapter 9 wrestled with is irrelevant here, because the model never observes a person.

### Two transformations do most of the work

**Adstock**, the carryover of an impression into later weeks.

\`\`\`python
def adstock(spend, lam):
    out, carry = [], 0.0
    for s in spend:
        carry = s + lam * carry
        out.append(round(carry))
    return out

adstock([10000, 0, 0, 0], 0.6)   # [10000, 6000, 3600, 2160]
adstock([10000, 0, 0, 0], 0.2)   # [10000, 2000, 400, 80]
\`\`\`

Total effective exposure is spend divided by (1 minus lambda): $25,000 at 0.6, and $12,500 at 0.2. Halve the accumulated exposure and the credit the model can assign halves with it. Lambda is usually estimated from data that cannot really pin it down, which is exactly how the opening paragraph happened.

**Saturation**, the flattening response curve.

| Weekly spend | Modelled orders | Orders from the last $2,000 | Marginal cost per order |
|---|---|---|---|
| $4,000 | 210 | 210 | $19.05 |
| $6,000 | 288 | 78 | $25.64 |
| $8,000 | 340 | 52 | $38.46 |
| $10,000 | 375 | 35 | $57.14 |

That curve is the output worth having, not the headline ROAS. It answers the only question a budget meeting asks: what does the next $2,000 buy.

### Where mix models go wrong

**Collinearity.** If search and social always ramp together in November and cut together in January, the regression cannot separate them. It splits the credit somewhere between arbitrary and accidental, then reports both coefficients with a confident-looking interval. Print the correlation matrix of your spend columns first. Any pair above about 0.8 means those two numbers are trading with each other.

**Not enough rows.** Three years of weekly data is 156 observations. Eight channels with a decay and a saturation parameter each, plus price, promotion, seasonality and holidays, and you are fitting well over thirty parameters. Fit is not the problem. Identification is.

**In-sample fit is not evidence.** An R-squared of 0.94 tells you nothing at all. Hold out the last twelve weeks, refit on the rest, and report the error on the weeks the model never saw. Within 8% is useful. A perfect fit that misses the holdout by 25% is a curve drawn through noise.

**Baseline swallows everything.** Typically 55% to 75% of sales land in baseline. Some is real brand equity and some is last year's advertising that the decay never captured. Reporting baseline as "what we would sell with no marketing" is a long-run claim made by a short-run model.

**It cannot see inside a channel.** No creative, no keyword, no audience, no placement. It allocates between channels. Using its coefficient to justify a decision about one campaign is a category error.

### When it is worth building

Roughly: two years of weekly history, five or more channels, and enough spend that a 10% misallocation costs more than building and maintaining the model. Below about $2M a year in media, an experiment calendar plus blended CAC will beat anything you can afford to build. Robyn, Meridian and PyMC-Marketing removed the licence fee, not the data requirement.
      `,
        [
          q('An adstock decay rate is changed from 0.6 to 0.2 with no new data added. Why does that channel\'s modelled contribution fall?', [
            'A lower decay compresses the saturation curve, so each dollar buys fewer orders',
            'The regression drops the weeks in which the channel recorded no spend at all',
            'A smaller decay raises collinearity between that channel and the baseline term',
            'Effective exposure drops from spend/0.4 to spend/0.8, leaving less to credit',
          ], 3, 'Geometric adstock accumulates spend across weeks, so a smaller carryover rate leaves far less accumulated exposure for the model to associate with sales.'),
          q('Search and social spend both rise every November and both fall every January. What does that do to a mix model?', [
            'It improves the fit, because seasonality is now explained by media spend',
            'The two coefficients cannot be separated, so the credit split is largely arbitrary',
            'The model automatically merges them into one combined paid channel',
            'It biases the baseline downward and the holiday terms upward',
          ], 1, 'Regression can only distinguish inputs that vary independently, so tightly correlated spend series leave the split between them unidentified by the data.'),
          q('A mix model is presented with an R-squared of 0.94. What should you ask for before trusting the channel splits?', [
            'The full list of channel-level ROAS figures with their confidence bands',
            'Daily rather than weekly data, in order to increase the sample size',
            'Its prediction error on held-out weeks it was never fitted on',
            'Confirmation that the baseline sits below 50% of total sales',
          ], 2, 'In-sample fit rises with every parameter added, so only out-of-sample error shows whether the model learned real structure rather than memorising noise.'),
        ]
      ),
      lesson('Calibrating the Model With a Year of Experiments', 14, `
The mix model says paid social returns 3.1. The geo test in the same quarter says the incremental cost was $20.33 an order against $18.70 of gross profit, which is a return near 0.9. One channel, one quarter, two answers that differ by a factor of three.

The instinct is to pick a side. The correct move is to let the experiment overrule the model, refit, and then watch very carefully where the missing revenue lands.

### Three instruments, three different jobs

| Method | Answers | Blind to | Refresh |
|---|---|---|---|
| Platform reports | which ad, which keyword, today | anything outside its own walls | daily |
| Geo experiments | did this channel cause sales | every channel not under test | quarterly |
| Mix model | how the whole budget should split | creative, keywords, audiences | monthly |

Only the experiment has a real counterfactual, so it is the calibration standard. Only the model covers every channel at once, so it is the allocator. Only the platform runs daily, so it steers inside the channel. Ranking them misses the point: each corrects a blind spot the other two share.

### How calibration actually works

Bayesian mix models take a prior on each channel's return. Uncalibrated, that prior is a wide guess with an agency's opinion inside it. After a geo test you have a measured estimate and a real interval.

\`\`\`text
Geo test result:   incremental ROAS 0.9, 90% interval 0.6 to 1.3
Prior before test: lognormal centred on 2.5, deliberately wide
Prior after test:  lognormal centred on 0.9, spread set by the interval
\`\`\`

Robyn does the same thing through a calibration input: you supply the test window and its measured lift, and candidate models that disagree with it are penalised during fitting. Meridian accepts ROI priors directly.

Then refit and check what moved. The revenue has to be explained by something, so credit taken from social reappears elsewhere, usually in baseline or in whichever channel was collinear with it. If it all jumps into email, you have just learned that email and social spend move together and the model was never separating them in the first place.

### A year of tests, planned like a publishing calendar

One live test at a time, so two effects can never overlap.

| Quarter | Test | Design | Cost of running it |
|---|---|---|---|
| Q1 | Brand search | Holdout, 12 of 24 regions, 6 weeks | about $2,400 of paused spend |
| Q2 | Paid social prospecting | Holdout, 6 weeks | about $9,900 of paused spend |
| Q3 | Non-brand search | Scale-up, spend doubled in 12 regions | about $14,000 of extra spend |
| Q4 | Email frequency | Random 10% holdout of the list | opportunity cost only |

Four rules keep it honest. Write the metric, the read window and the decision rule before launch: "if incremental CPA is above $16 we cut the budget by a third" belongs in the plan, not in the debrief. Read once, at the end. Never test across a peak, because a result measured in late November describes late November. Re-test every channel every 12 to 18 months, since creative fatigues, auctions shift and audiences saturate. An incrementality number is perishable.

### The output is a reallocation, not a report

| Channel | Weekly spend | Marginal cost per order | Move |
|---|---|---|---|
| Non-brand search | $8,000 | $38 | down $2,000 |
| Paid social | $2,200 | $31 | down $700 |
| Email and SMS | $250 | $6 | up, capped by list size |
| Retail media | $0 | untested | $700 as a 10% bet |

Take money from the highest marginal cost, add it where the marginal cost is lowest, and stop when they level out. That is Chapter 7's 70/20/10 frame with real coefficients underneath it instead of last-click guesses.

The failure that ends most programmes is quieter than a bad model. A team runs one test, dislikes the answer, and never runs another. One test on one channel in one quarter is a data point. The calendar is the deliverable.
      `,
        [
          q('A geo test on paid social returns an incremental ROAS of 0.9 while the mix model reports 3.1. What is the right response?', [
            'Set the model\'s prior for that channel from the test, refit, and see where the credit moves',
            'Average the two figures and plan next quarter\'s budget on 2.0',
            'Discard the model, since only the experiment has a counterfactual',
            'Rerun the geo test until it agrees with the modelled estimate',
          ], 0, 'The experiment supplies causal ground truth for one channel while the model allocates across all of them, so the test should constrain the model rather than replace it.'),
          q('After calibrating social downward, the refitted model moves that revenue into email. What does that most likely indicate?', [
            'Email was being under-reported by its own platform the whole time',
            'The calibration was accidentally applied to the wrong time window',
            'Social and email spend move together, so the model never separated them',
            'The baseline has been set too low across the entire modelled period',
          ], 2, 'Revenue has to be explained by something, and credit landing on one specific channel points to collinearity between those two spend series.'),
          q('Why should an incrementality result be refreshed every 12 to 18 months?', [
            'Statistical confidence intervals widen automatically as the data ages',
            'Creative fatigues, auctions shift and audiences saturate, so the effect changes',
            'Platforms reset their attribution windows on a fixed annual cycle',
            'Mix models are unable to use observations older than eighteen months',
          ], 1, 'A channel\'s incremental effect is a property of the current market and current creative, so an old measurement describes conditions that no longer hold.'),
        ]
      ),
      ],
      [
      q('Four platforms report 3,170 conversions in a month when 2,180 orders were placed. What should the team do with that sum?', [
        'Divide it by the number of platforms to get a deduplicated figure',
        'Report it as reach, since each touchpoint did contribute something',
        'Use it after subtracting the view-through conversions from each platform',
        'Discard it and set budgets from blended CAC in the order system',
      ], 3, 'Overlapping credit across walled gardens makes the sum meaningless, while a blended figure from your own order data counts every sale exactly once.'),
      q('Which design measures what the next dollar in a channel does, without ever turning the channel off?', [
        'A scale-up test that doubles spend in half of the matched regions',
        'A brand lift survey run inside the advertising platform itself',
        'A last-click revenue report filtered to new customers only',
        'A holdout that pauses the channel nationally for two weeks',
      ], 0, 'Raising spend in a randomised half measures the marginal response at the top of the curve, which is precisely the number a budget decision requires.'),
      q('A mix model fits three years of weekly data using more than thirty parameters and reports an R-squared of 0.96. The biggest risk is that', [
        'the seasonality terms are absorbing too little of the variance',
        'weekly aggregation is hiding the true adstock decay rate',
        'the parameters are not identified, so the fit reflects noise not structure',
        'the baseline share has been forced above 70% of total sales',
      ], 2, 'With 156 observations and thirty parameters a model can fit almost anything, so a high in-sample R-squared says nothing about whether the channel splits are real.'),
      q('A team runs one holdout, dislikes the answer, and cancels the rest of the test calendar. What has been lost?', [
        'The ability to compare platform ROAS figures across different channels',
        'The stream of causal estimates that keeps the mix model honest over time',
        'The consent-free measurement that mix modelling fundamentally depends on',
        'The daily granularity needed to steer creative inside each channel',
      ], 1, 'Calibration has to be continuous because incremental effects change, so a model left uncalibrated drifts back toward whatever its priors and correlations suggest.'),
      ]
    ),
    chapter(
      'Retention, Cohorts, and Unit Economics',
      'Reading retention as a cohort curve, working out what a customer is worth after contribution margin and payback, and building the lifecycle programme that decides how much you can afford to spend acquiring the next one.',
      [
      lesson('Cohort Analysis and the Retention Curve', 13, `
Riverbend's repeat rate has printed 24% for eight months. Over those same eight months retention actually improved by nine points. Both sentences are true, and the second one is invisible in the first.

### A blended rate measures your acquisition mix, not your product

A blended repeat rate divides repeat buyers by every buyer in the window. Acquire hard in April and the denominator fills with people who have had three weeks to come back, so the rate sags even when each new group behaves better than the last. Group customers by the month of their first order instead, then measure each group by months since that order.

| First order | New customers | M1 | M3 | M6 | M12 |
|---|---|---|---|---|---|
| Jan | 186 | 11% | 26% | 39% | 47% |
| Feb | 203 | 12% | 27% | 41% | 48% |
| Mar | 241 | 13% | 29% | 44% | |
| Apr | 388 | 9% | 21% | 33% | |
| May | 402 | 8% | 19% | | |
| Jun | 375 | 14% | 30% | | |

Each cell is the share of that cohort that has placed a second order by month N. Two things jump out. April and May retain badly, and those were the months of the paid social push carrying a 20% welcome code. They are also the two largest cohorts, which is precisely why the blended figure refused to move. June went back to full price and beat January at every age.

### Read the tail, not the drop

Every retention curve falls off a cliff between the first order and the second. That drop is not the interesting part. The question is whether the curve flattens into a floor or keeps sliding to zero. January adds eight points between M6 and M12, so a real base of people has settled into a rhythm. A cohort that reads 39%, then 40%, then 40% has no floor at all: it is a treadmill, and every month you must buy the whole business again.

Keep two curves apart or you will argue about nothing. **Cumulative repeat rate** is the share who have ever ordered again by month N, and it can only rise. **Active rate** is the share who ordered in month N itself, and it decays. Revenue retention is a third curve, and it can sit above the customer curve when the survivors buy bigger bags.

### Build it from orders, not from the analytics tool

\`\`\`sql
WITH first_order AS (
  SELECT customer_id, MIN(ordered_at) AS acquired_at
  FROM orders
  WHERE status = 'fulfilled'
  GROUP BY customer_id
)
SELECT date_trunc('month', f.acquired_at)                       AS cohort,
       COUNT(DISTINCT f.customer_id)                            AS customers,
       COUNT(DISTINCT CASE
             WHEN o.ordered_at >  f.acquired_at
              AND o.ordered_at <= f.acquired_at + INTERVAL '90 days'
             THEN o.customer_id END)                            AS repeat_90d
FROM first_order f
JOIN orders o USING (customer_id)
GROUP BY 1
ORDER BY 1;
\`\`\`

Run this against the fulfilled order table from the CRM loop, not against session data. Consent gaps mean a share of these customers were never recorded client side at all, and refunded orders must drop out or the curve flatters itself.

### The cell that is empty, not zero

The most common misreading in the whole discipline is the bottom right corner of the triangle. May has no M6 figure because May is four months old. Immature cells look like collapse to anyone scanning for a downward slope, and every quarter somebody presents that slope as evidence that retention is failing. Compare cohorts only at the same age, and mark young cells blank rather than filling them with a zero.

Then cut the same triangle by acquisition channel and by first product. Riverbend's discovery was that the 250g sampler produced a 12% M6 repeat rate while the 1kg bag produced 44%, which changed what the ads were allowed to sell.

### Do this now

Build the triangle for 18 months, blank the immature cells, and rebuild it split by channel. Circle the cohort with the flattest tail, because that is the customer the rest of this chapter is about paying to find.
      `,
        [
          q('Riverbend\'s blended repeat rate sat at 24% all year while cohort retention improved by nine points. Why did the blended figure not move?', [
            'Repeat rates are always slower to move than acquisition metrics',
            'Refunded orders were being counted in the denominator',
            'The largest cohorts were the newest ones, so most of the denominator had barely had time to return',
            'Seasonality cancelled the improvement out across the year',
          ], 2, 'A blended rate divides repeat buyers by everyone acquired in the window, so a big recent intake with only weeks of exposure holds the average down even when every cohort is behaving better.'),
          q('A monthly deck shows the cohort triangle sloping down towards the bottom right and concludes that retention is collapsing. What is wrong with that reading?', [
            'The bottom right cells are young cohorts measured at a younger age, not cohorts that retained worse',
            'The triangle is showing revenue retention rather than customer retention',
            'Cohorts should be grouped by calendar month of purchase instead',
            'Repeat rates cannot be compared across different acquisition channels',
          ], 0, 'Cohorts are only comparable at the same age, and an immature cell is empty rather than zero, so the apparent slope is an artefact of how recently each group was acquired.'),
          q('One cohort reads 39% at M6 and 47% at M12. Another reads 39% at M6 and 40% at M12. What does the second pattern tell you?', [
            'The second cohort was acquired through a cheaper channel',
            'The second cohort has no returning base, so the business must buy its volume again every month',
            'The second cohort has a higher average order value hiding the difference',
            'The second cohort\'s data has not matured enough to compare',
          ], 1, 'A curve that stops rising after the first drop means almost nobody settled into a repeat rhythm, which leaves acquisition carrying the whole business indefinitely.'),
        ]
      ),
      lesson('Contribution Margin, Payback, and the CAC You Can Afford', 14, `
Riverbend books $18.70 of gross profit on a $34 order. The bank sees $8.54. The gap between those two numbers is the entire advertising budget, which is why using the first one to set bids has quietly bankrupted more ecommerce brands than any algorithm update.

### Every line between the sale and the bank

| Line | Per order |
|---|---|
| Average order value, shipping collected included | $34.00 |
| Beans, roasting, bag | 15.30 |
| Packaging, pick and pack | 1.85 |
| Carrier cost | 6.20 |
| Payment processing at 2.9% plus $0.30 | 1.29 |
| Refunds and replacements, 2.4% allowance | 0.82 |
| **Contribution** | **$8.54** |

Gross margin says 55%. Contribution margin is 25.1%. The missing $10.16 was already spent before a single ad ran, and most of it is the carrier: shipping one kilogram of coffee costs more than the roasting does. Leave fixed costs out of this table. Salaries and software do not change when one more order arrives, so they belong in the profit and loss, not in the number that decides a bid.

### Payback is a date, not a ratio

You pay CAC once, up front. Contribution arrives in instalments.

| Months since first order | Cumulative orders per customer | Cumulative contribution |
|---|---|---|
| 0 | 1.00 | $8.54 |
| 1 | 1.13 | $9.65 |
| 3 | 1.34 | $11.44 |
| 6 | 1.71 | $14.60 |
| 12 | 2.21 | $18.87 |
| 18 | 2.60 | $22.20 |

At a $20 CAC that cohort crosses into profit around month 14. The tidy 2.4:1 lifetime ratio from the opening chapter is still true and still useless on its own, because a business that pays its card bill in 30 days and its roaster in 45 cannot finance a 14 month wait, however good the ratio looks on the slide.

### The CAC you can afford is a function of the window you can fund

\`\`\`text
CAC ceiling = cumulative contribution per acquired customer inside the payback window

 60-day window   ->  $9.60
 90-day window   -> $11.44
180-day window   -> $14.60
365-day window   -> $18.87
\`\`\`

Pick the window from the bank balance first, then hand the resulting ceiling to whoever buys media. A team told "keep CAC under $18.87" and a team told "keep CAC under $11.44" will build two completely different accounts, and only one of them is solvent in March.

### Blending the channels hides the one that never pays back

| Channel | CAC | 12 month contribution | Ratio | Payback |
|---|---|---|---|---|
| Organic and email | $2.10 | $21.40 | 10.2 | first order |
| Non-brand search | $16.00 | $19.80 | 1.24 | month 13 |
| Paid social, code led | $23.00 | $11.60 | 0.50 | never |

Averaged together these produce a comfortable looking blended figure that hides a channel losing $11.40 on every customer it delivers, forever. The cohort work from the previous topic is what lets you split this table, and the code led row is worse than it looks because those customers arrive expecting the code.

### The two errors to check for by name

**Revenue LTV.** Multiplying order value by lifetime orders counts money that belongs to the roaster and the carrier. Always compute lifetime value on contribution.

**An uncapped horizon.** A model that runs 60 months forward will justify almost any bid. Cap it at a horizon you have actually observed, discount it if the horizon is long, and remember that a subscription cancelling at a median of 3.2 cycles does not deliver 24 of them.
      `,
        [
          q('Riverbend shows 55% gross margin but only 25.1% contribution margin on the same $34 order. Where did the difference go?', [
            'Into salaries and software allocated per order',
            'Into carrier cost, packaging, payment fees and a refund allowance, none of which sit in cost of goods',
            'Into advertising spend charged against each new customer',
            'Into the discount codes applied at checkout by most buyers',
          ], 1, 'Gross margin stops at cost of goods, while the variable costs of actually delivering and collecting payment for the order take another $10.16 before any advertising happens.'),
          q('A brand pays suppliers in 45 days and cannot borrow. Why is its 2.4:1 lifetime value ratio not enough to justify a $20 CAC?', [
            'Because ratios below 3:1 are always unprofitable in ecommerce',
            'Because the ratio uses revenue rather than contribution by definition',
            'Because platform reported conversions inflate the customer count',
            'Because the contribution that repays that $20 does not arrive until around month 14, long after the cash went out',
          ], 3, 'Payback is a date rather than a ratio, and a business paying its bills monthly cannot fund fourteen months of waiting however healthy the lifetime multiple looks.'),
          q('Three channels post CACs of $2.10, $16.00 and $23.00 against 12 month contributions of $21.40, $19.80 and $11.60. What does reporting only the blended figure do?', [
            'It hides that one channel loses money on every customer it will ever deliver',
            'It overstates the contribution of the organic and email channel',
            'It makes the payback period look longer than it really is',
            'It removes the effect of seasonality from the comparison',
          ], 0, 'Averaging a channel that pays back on the first order with one that never pays back produces a comfortable number that conceals a permanent loss of about $11.40 per customer.'),
        ]
      ),
      lesson('Lifecycle Programmes: Onboarding, Reorder, and Win-Back', 13, `
The reorder email went out on day 34, because 34 was the median gap between a first and second order. That one number cost Riverbend most of the programme's value, because by day 34 half of the people who were going to reorder already had, and the email was mailing customers who had bought two days earlier.

### Time the trigger from consumption, then from the distribution

A 500g bag at two cups a day and 15g a cup runs dry on day 17. Now look at when second orders actually land.

| Percentile of second orders | Day |
|---|---|
| 10th | 12 |
| 25th | 21 |
| 50th | 34 |
| 75th | 58 |
| 90th | 96 |

The useful send sits on the left shoulder, not the median: day 14 and day 24, before the cupboard is empty and before a competitor's ad fills the gap. Median timing is not a compromise, it is a guarantee that half your sends arrive too late to change anything.

### Three programmes, three different jobs

| Programme | Trigger | Timing | The number that judges it |
|---|---|---|---|
| Onboarding | first order shipped | day 0, 3, 9 | share of cohort ordering again by day 60 |
| Reorder | days since last order, by product size | day 14, 24, 40 | incremental orders against a holdout |
| Win-back | past the lapse threshold | day 120, 150 | incremental contribution per recipient |

Onboarding is not a thank you note. The second order is the real conversion, so those three emails teach the grind setting, name the roast date on the bag, and only then, on day 9, offer the subscription. Pitching the subscription in the first hour converts the few who were always going to take it and burns the moment for everyone else.

### Hold out ten per cent or you are just reporting coincidence

Riverbend's win-back is the standing example. The tool credited every order that followed a click: 316 orders, $10,744 of revenue, a triumph in the monthly deck. Then 10% of eligible customers were held out and received nothing.

\`\`\`text
eligible          9,000
mailed            8,100   order rate 3.9%   ->  316 orders
held out            900   order rate 2.6%   ->   23 orders

expected without email   8,100 x 2.6%  =  211 orders
incremental              316 - 211     =  105 orders
incremental contribution 105 x $8.54   =  $897
\`\`\`

The flow is worth about $900 of contribution a quarter, not $10,744 of revenue. It is still worth running, because it costs nothing to send, but it is not the reason to hire another email specialist. This is the geo holdout method applied one customer at a time, and every lifecycle flow deserves it, permanently rather than once.

### Suppression is what keeps the programme from embarrassing you

\`\`\`text
suppress reorder_nudge when
  subscription_active      = true
  or open_support_ticket   = true
  or order_in_transit      = true
  or messages_sent_7d      >= 3
  or marketing_consent     = false
\`\`\`

Every line there is a real complaint. The worst is the third: a cheerful "running low?" landing while the customer is arguing about a bag that arrived crushed. Consent state belongs in the same rule set, and it must be read from the source of truth rather than from whatever the sending tool cached last month.

### Frequency, and the thing nobody measures

Add SMS and push and the caps multiply rather than add. Count messages per person across all channels, not per channel, and watch unsubscribe rate per send alongside revenue per send. A flow that earns $1,200 a month while shedding 400 addresses is borrowing from next year's list to pay for this month's number.

### Do this now

Pull the gap distribution for each product size, move every reorder trigger to the 25th percentile, and switch 10% of eligible customers into a permanent holdout so next quarter's report can say what the programme actually caused.
      `,
        [
          q('Second orders land at day 12 for the 10th percentile, day 21 for the 25th and day 34 for the median. Why is a day 34 reorder email the wrong trigger?', [
            'Because unsubscribe rates rise sharply after the first month of silence',
            'Because deliverability suffers when a flow waits longer than 30 days',
            'Because most customers still have coffee left at day 34',
            'Because half the people who were going to reorder have already done so, so the email mostly follows purchases it did not cause',
          ], 3, 'Sending on the median guarantees that half of the eligible reorders happened first, which converts the flow into a report of purchases rather than a cause of them.'),
          q('A win-back mailed 8,100 people who ordered at 3.9%, while a 900 person holdout ordered at 2.6%. What is the flow actually worth?', [
            '316 orders, since every one of them followed a send',
            '23 orders, the difference between the two group sizes',
            'About 105 incremental orders, roughly $897 of contribution',
            'Nothing, because the holdout also produced orders',
          ], 2, 'The holdout rate is what would have happened anyway, so only the 1.3 point lift on 8,100 recipients belongs to the flow, and it is valued at contribution rather than revenue.'),
          q('Which suppression rule prevents the complaint that damages trust the most?', [
            'Skipping anyone who has already opened three emails this week',
            'Skipping anyone with an open support ticket or a parcel still in transit',
            'Skipping anyone acquired through paid social in the last month',
            'Skipping anyone whose first order was below the average value',
          ], 1, 'A cheerful reorder nudge arriving while somebody is disputing a crushed delivery reads as the company not knowing who they are, which costs far more than the order it was chasing.'),
        ]
      ),
      lesson('Churn, Discount Dependence, and Customers Worth Losing', 13, `
The win-back with the 25% code was the best looking campaign of the year: 610 orders and $19,800 of revenue in eleven days. It contributed just over $300, and it taught 610 people to wait for the next code.

### A discount is not a promotion, it is a new set of unit economics

| | Full price | 25% off |
|---|---|---|
| Revenue | $34.00 | $25.50 |
| Variable costs | $25.46 | $25.00 |
| Contribution | $8.54 | $0.50 |
| Orders needed to cover a $20 CAC | 2.3 | 40 |

Only the revenue line moves. Beans, packaging and the carrier do not care what you charged, so a quarter off the price takes 94% of the contribution with it. Free shipping on a $30 order does the same damage while sounding generous, which is why it is the offer that most often gets waved through.

### Discount dependence is a measurable trait, not a mood

Track the share of a customer's orders that carried a code, then cut the cohort triangle by the discount on the first order.

| First order | Customers | Second order by M6 | 12 month contribution each |
|---|---|---|---|
| Full price | 1,240 | 41% | $22.90 |
| 10% welcome code | 980 | 33% | $15.10 |
| 25% or deeper | 610 | 14% | $2.70 |

Deep discount cohorts do not graduate to full price. They wait. Worse, feeding that segment back as a seed audience trains the platform to find more people exactly like them, so the cheapest looking prospecting audience quietly becomes the most expensive one you own.

### Churn you cannot see has to be inferred

Nobody cancels a coffee habit. Set a lapse threshold from the gap distribution instead: the 90th percentile is 96 days, so 120 days without an order is a defensible definition of lapsed. Apply that threshold per segment, because a 250g buyer reorders every 21 days and is long gone by day 120, while a 1kg subscriber at 45 day cycles is merely between orders. One global 90 day rule mislabels both.

### Involuntary churn is the cheapest retention in the business

Of 214 subscription cancellations last quarter, 81 were failed cards rather than decisions. Retries on day 1, 3, 5 and 9, a card updater service, and one email with a single tap update link recovered 62% of them.

\`\`\`text
81 failed payments x 62% recovered = 50 subscribers kept
50 x 5.4 remaining cycles x $8.54  = $2,306 of contribution per quarter
\`\`\`

That is a settings change, not a campaign. Most brands run an expensive win-back programme while leaking a third of their subscribers to expired cards.

### Some customers are worth losing

| Segment | Share | 12 month contribution each | Action |
|---|---|---|---|
| Full price repeat | 34% | $31.40 | protect, prioritise service |
| Single order, full price | 44% | $8.54 | onboarding and reorder flows |
| Code led | 15% | $2.70 | stop bidding for them |
| Free shipped small orders, high returns | 7% | -$4.10 | change the offer |

Riverbend raised the free shipping threshold from $30 to $45. Average order value moved to $41, order count fell 6%, contribution per order rose to $10.80, and total contribution rose 19%. The bottom segment did not become profitable, it mostly stopped ordering, and that was the point.

Two cautions. Worth losing means stop paying to acquire and stop subsidising, never treat badly, because a bad segment still writes reviews. And before condemning any segment, check whether the customer is bad or the offer you gave them was: people acquired with a 25% code behave differently from the same people acquired with a free shipping upgrade.
      `,
        [
          q('A 25% code cuts a $34 order to $25.50 while variable costs stay near $25. What does that do to the economics?', [
            'Contribution falls from $8.54 to about $0.50, so it takes roughly 40 orders to repay a $20 CAC',
            'Contribution falls by exactly 25%, in line with the discount',
            'Contribution is unchanged because cost of goods falls with the price',
            'Contribution improves, because the extra volume spreads fixed costs',
          ], 0, 'Costs do not move when the price does, so a quarter off the price removes almost all of the contribution and the discounted order barely covers itself.'),
          q('Riverbend\'s 90th percentile gap between orders is 96 days for 1kg buyers and far shorter for 250g buyers. What is wrong with one global 90 day lapse rule?', [
            'It triggers win-backs before the refund window has closed',
            'It counts subscription customers twice in the churn figure',
            'It requires consent data the business is not allowed to store',
            'It calls 1kg buyers lapsed while they are simply between orders, and leaves fast cycling 250g buyers unflagged for months',
          ], 3, 'Lapse is inferred from each segment\'s own purchase gap distribution, so a single threshold is simultaneously too aggressive for slow cycles and far too patient for fast ones.'),
          q('Of 214 subscription cancellations, 81 were failed cards. Why is fixing that the cheapest retention available?', [
            'Failed payments are refunded automatically by the processor',
            'Card failures reduce sender reputation across all campaigns',
            'Those customers never chose to leave, so retries, a card updater and one update email keep most of them',
            'Involuntary churn is excluded from the reported churn rate anyway',
          ], 2, 'Recovering people who still want the product needs a dunning schedule rather than an offer, which is why 62% of them came back for the cost of a settings change.'),
        ]
      ),
      ],
      [
      q('Which pair of numbers should set the ceiling a media buyer is given for a new customer?', [
        'Average order value and last click return on ad spend',
        'Contribution per order and the payback window the business can fund',
        'Gross margin and the platform reported conversion count',
        'Lifetime revenue and the blended repeat purchase rate',
      ], 1, 'Contribution is the only money that can pay for acquisition, and the window decides how much of the future contribution the business is able to wait for.'),
      q('A cohort acquired with a 25% code shows 14% repeat by M6 against 41% for full price customers. What follows for prospecting?', [
        'Stop seeding audiences with that cohort, because the platform will find more people who only buy at a discount',
        'Increase the discount so the offer stands out further from competitors',
        'Move the code into the win-back flow where the customers are already lapsed',
        'Keep the cohort in the blended lifetime value so the average stays stable',
      ], 0, 'Lookalike targeting reproduces whatever you feed it, so a discount led seed list makes the cheapest looking audience into the one with the worst contribution.'),
      q('Which report proves a lifecycle flow created revenue rather than reported it?', [
        'Revenue attributed to clicks inside the flow\'s own emails',
        'Revenue per recipient compared with the previous quarter',
        'Open and click rates compared against category benchmarks',
        'Order rate of recipients minus the order rate of a randomly held out slice',
      ], 3, 'Only a holdout shows what would have happened without the send, and the difference between the two rates is the part of the revenue the flow actually caused.'),
      q('Retention improved in every cohort last quarter, yet the blended repeat rate fell. What is the most likely cause?', [
        'Refunds were reclassified as cancellations in the order table',
        'Average order value rose faster than order counts',
        'A large intake of new customers arrived recently and has not had time to return',
        'Consent rates fell, so fewer repeat orders were recorded',
      ], 2, 'Growth in acquisition loads the denominator with customers only weeks old, which drags a blended rate down even while every individual cohort is improving.'),
      ]
    ),
    chapter(
      'AI Search, Platform Risk, and the Growth Model',
      'What to do when the results page stops sending clicks, when one platform owns most of your demand, and when the growth model that got you here has run out of room.',
      [
      lesson('AI Overviews, Zero-Click Search, and What Still Earns a Visit', 13, `
Riverbend's guide at \`/guides/storing-coffee-beans\` held position 3 all year. In March it took 1,240 clicks from 18,400 impressions. In September it took 410 clicks from 18,900 impressions. Same page, same position, no penalty, two thirds of the traffic gone.

Nothing broke. The results page grew an answer above the listing, and the click stopped being necessary.

### The mechanism, not the acronym

An AI Overview is a generated answer assembled from a few retrieved pages and placed above the organic results. It does not replace your ranking, it pushes it down the screen. Your listing is still served, so Search Console still counts the impression. That is why the fingerprint reads flat impressions, flat average position, collapsed click-through rate: row two of the traffic-drop table in Chapter 7, and the row teams most often misread as a demotion.

Coverage is not uniform across queries. It tracks how completely a question can be answered from public facts.

| Query | Volume | CTR before | CTR now | Why |
|---|---|---|---|---|
| how long do roasted beans stay fresh | 6,600 | 6.7% | 2.2% | One fact, no stakes |
| what is washed process coffee | 3,100 | 5.9% | 1.8% | A definition |
| burr vs blade grinder | 4,400 | 7.1% | 5.4% | A decision, people want a view |
| best coffee subscription | 2,900 | 8.2% | 7.6% | Commercial, the results are the answer |
| ethiopian yirgacheffe 1kg | 880 | 11.4% | 11.1% | Needs your price and your stock |

Read the last two rows. The money queries barely moved. What vanished was traffic that was never going to buy this month anyway, which is a smaller disaster than the graph suggests and a real one for anyone whose content plan was priced in sessions.

### The test for whether a page still earns its click

Can a paragraph of generated text deliver what this page delivers? If yes, the click was always fragile. Six things a summary cannot carry:

- **Price, stock and a delivery date.** Facts that change hourly and belong to you.
- **A tool.** A freshness calculator answers for the user's roast date, not in general.
- **Your own data.** Riverbend's cupping scores across 14 harvests exist nowhere else, so an answer that uses them has to name where they came from.
- **A judgement with someone behind it.** "We stopped buying this lot in 2024, here is why."
- **The transaction.** Nothing completes a purchase inside an answer box.
- **Images, video and community.** Formats a text answer cannot reproduce.

### Broken, then fixed

The old guide opened with a definition and worked toward the advice.

\`\`\`text
H1: How to store coffee beans
p:  Coffee is a hygroscopic product, meaning it absorbs moisture
    from the surrounding air. Understanding oxidation is key to...
\`\`\`

Everything above the useful sentence is exactly what a summary now supplies for free. The rebuild leads with the specific answer, then adds what a summary cannot copy.

\`\`\`text
H1: How to store coffee beans (and how long they actually last)
p:  Airtight, opaque, room temperature, away from the grinder.
    Not the freezer, unless you freeze in single doses.
Tool:  roast date -> days of peak flavour left
Data:  our 21 day oxygen test, 6 grams a day, tasted blind
Block: roasted this week, in stock, ships Thursday
\`\`\`

### The counter-intuitive part

Teams reach for \`robots.txt\` and block \`Google-Extended\` to keep their content out of AI answers. It does not do that. \`Google-Extended\` governs Gemini and grounding products, not Search. Overviews are built from the ordinary Googlebot crawl, so the block removes you from the assistants covered in the next topic while leaving overviews exactly as they were. You lose the surface you wanted and keep the one you did not.

### Do this now

Group your top 200 queries into fact, decision and transaction. Compare click-through rate year on year inside each group. If the fact group has halved and the transaction group has not, your traffic loss is real and your revenue loss is not, and the content plan is what needs rewriting.
      `,
        [
          q('A guide holds position 3 with flat impressions, but clicks fell from 1,240 to 410. Which conclusion follows?', [
            'Google reassessed the page and quietly demoted it in the index',
            'Crawl budget ran out, so the page is refreshed far less often',
            'Something above the listing now answers the query, so no click',
            'The tracking tag was dropped from the guide template in a deploy',
          ], 2, 'Holding position while losing clicks is a results page shape problem, and Search Console still records the impression because your listing was served.'),
          q('Which Riverbend query is least likely to lose its clicks to a generated summary?', [
            '"ethiopian yirgacheffe 1kg in stock, shipped Thursday"',
            '"how long do roasted coffee beans stay fresh"',
            '"difference between burr and blade grinders"',
            '"what does washed process coffee mean"',
          ], 0, 'A summary can restate public facts but cannot confirm your price, your stock or your delivery date, so the visit still has to happen.'),
          q('A team blocks Google-Extended in robots.txt to keep its content out of AI Overviews. What actually happens?', [
            'The pages drop out of overviews within one full crawl cycle',
            'The pages leave the index along with the overview citations',
            'Overviews continue but Search Console stops counting impressions',
            'Overviews are unaffected, since they run on the Googlebot crawl',
          ], 3, 'Google-Extended governs Gemini and grounding products rather than Search, so the block costs you the assistant surfaces and leaves overviews exactly where they were.'),
        ]
      ),
      lesson('Getting Cited by AI Assistants, and Measuring It', 13, `
Forty-one sessions arrived from \`chatgpt.com\` last month. Riverbend's team nearly ignored them. They converted at 9.2% against a site average of 2.6%, which makes those 41 sessions worth roughly what 145 organic ones are worth.

Small, valuable, and almost invisible. All three of those matter, and the last one is why the channel gets ignored.

### How a citation actually happens

Assistants reach you two ways. The first is training data: slow, opaque, not a channel you can work. The second is retrieval, where the assistant issues a search, reads a handful of returned pages, and writes its answer from them. Retrieval is the path you can influence, and it rewards something different from ranking.

Ranking rewards a page that covers a topic. Retrieval rewards a passage that answers a question and can be lifted out intact. Being quoted requires being quotable.

Broken:

\`\`\`text
Coffee freshness is a subject of some debate among roasters, and
opinions vary depending on roast level, packaging and storage
conditions, but most professionals agree there is a window in...
\`\`\`

Nothing there can be extracted as a claim. Fixed:

\`\`\`text
Whole beans hold peak flavour for 14 to 21 days after roasting when
stored airtight at room temperature. Ground coffee drops off within
30 minutes. Riverbend measured this over 21 days in 2025, tasting
6 grams a day blind against a sealed control jar.
\`\`\`

That version has a number, a unit, a time window, a method and an owner. It survives being pulled into someone else's sentence, which is all a citation is.

### Most of the work is off your own site

Ask an assistant for the best coffee subscription and watch what it pulls: a forum thread, two roundup posts, a comparison site, a review aggregator. It is repeating the consensus of pages that are not yours. So the job is not only publishing, it is being named accurately in the sources the assistant reaches for. That is the digital PR work from Chapter 4 aimed at a different target, and the deliverable is a mention with your name and one true attribute beside it. A link is a bonus, not the goal.

### Measuring it without lying to yourself

| Method | What it captures | What it misses |
|---|---|---|
| Referral hosts in GA4 | Clicks out of assistant apps | Every answer with no click |
| Direct traffic anomalies | In-app browsers, copy-paste | Impossible to attribute cleanly |
| Server log user agents | Retrieval fetches of your pages | Anything about the answer given |
| Scripted prompt panel | Whether you are named at all | Volume and revenue |
| Post-purchase survey | Self-reported discovery | Recall bias, low response rate |

Referral traffic is a floor, not the size of the channel. Most answers end with no click at all, which is the previous topic wearing different clothes. A regex keeps the floor honest:

\`\`\`text
GA4 exploration, dimension Session source, filter matches regex:
^(chatgpt\\.com|perplexity\\.ai|copilot\\.microsoft\\.com|gemini\\.google\\.com|claude\\.ai)$
\`\`\`

The prompt panel is the only method that measures the thing you care about. Fix 30 buyer questions. Run them against three assistants on the first Monday of each month. Record one row each: named or not, described correctly or not, which source was cited.

| Month | Named | Described correctly | Own page cited |
|---|---|---|---|
| June | 6 of 30 | 4 of 30 | 2 |
| July | 9 of 30 | 8 of 30 | 5 |
| August | 13 of 30 | 12 of 30 | 7 |

That is a share of voice you can move, and it moves months before the referral line does.

### The mistake that kills the channel

Judging it on sessions. Forty-one sessions in a dashboard sorted by volume sits below a spam referral, so it gets cut from the report, so nobody notices it tripling. Sort by revenue per session and it appears near the top of the page instead. The mirror-image mistake is building a strategy, a role and a budget line for 41 sessions. This is worth an hour a month of measurement and the passage rewriting you should be doing anyway, not a headcount.
      `,
        [
          q('Which passage is most likely to be lifted into an assistant answer as a citation?', [
            'A balanced overview of how roasters disagree about freshness',
            'A sentence giving a 14 to 21 day window, a storage condition and a test',
            'A long guide covering roasting, grinding, brewing and storage',
            'A page repeating the keyword in the heading, intro and conclusion',
          ], 1, 'Retrieval rewards a passage that states a claim with numbers, units and a method attached, because that is what survives being pulled into someone else\'s sentence.'),
          q('Assistant referral sessions in GA4 are almost certainly an undercount. What is the main reason?', [
            'Assistants strip UTM parameters from every link they produce',
            'GA4 files all AI hosts under Organic Search by default',
            'Consent mode blocks assistant referrals more than other traffic',
            'Most answers end with no click, and many clicks carry no referrer',
          ], 3, 'The channel is mostly zero-click, and in-app browsers plus copy-paste push the clicks that do happen into Direct, so referral counts are a floor rather than a size.'),
          q('Riverbend gets 41 assistant sessions a month converting at 9.2% against a 2.6% site average. What follows?', [
            'Report it by revenue per session, or a volume-sorted view buries it',
            'Move the content budget into assistant optimisation this quarter',
            'Treat it as noise until it passes 1,000 sessions in a month',
            'Block the assistant crawlers until the click rate improves',
          ], 0, 'A channel worth roughly 145 organic sessions vanishes from any report sorted by volume, which is how teams miss it tripling.'),
        ]
      ),
      lesson('Platform Dependency and Concentration Risk', 14, `
On a Tuesday in April, Meta disabled Riverbend's ad account. No warning, no stated reason, an automated policy flag on a photograph of a roasting drum. It took nine days to reverse. Those nine days cost about $4,600 in gross profit, and the more useful number sits behind it: paid social was carrying 31% of new customers that quarter.

The loss was not the ban. The loss was that one automated decision at a company Riverbend has no relationship with could remove a third of new customer flow overnight.

### Measure concentration before arguing about it

Take each channel's share of revenue, square it, add them up. The sum is a concentration index between 0 and 1, and it moves faster than the individual shares do.

\`\`\`text
Channel shares:  0.44, 0.23, 0.18, 0.09, 0.06
Index = 0.44^2 + 0.23^2 + 0.18^2 + 0.09^2 + 0.06^2
      = 0.194 + 0.053 + 0.032 + 0.008 + 0.004
      = 0.291
\`\`\`

Below 0.15 you are genuinely diversified. Above 0.30 one company having a bad quarter means you are having one. Riverbend sits at 0.291 and thought of itself as diversified because it ran five channels. Counting channels tells you nothing. The distribution is the risk.

### Three risks that all get called one thing

| Risk | What changes | Early warning | Cost |
|---|---|---|---|
| Access | Account or listing suspended | Policy mails, review queues | Revenue stops that day |
| Economics | CPM, take rate or fees rise | Marginal CPA creeping up | Margin erodes quietly |
| Demand | The platform changes what it shows | Impression share, reach per post | Volume falls, spend cannot fix it |

Access risk is the one people plan for, because it is dramatic. Economics risk is the one that takes businesses, because a take rate moving from 15% to 21% never triggers an alert and never gets a meeting.

### The ladder from rented to owned

- **Rented.** Ad accounts, follower counts, marketplace listings. Someone else sets the terms and can end them this afternoon.
- **Leased.** Your email provider, registrar and payment processor. Portable in principle, painful in practice, and a suspension here is as total as a rented one.
- **Owned.** The list as a file you hold, customer records in your own database, branded search demand, the product itself.

The test is not what you call the asset. It is this: if that vendor closed your account today, what do you still have tomorrow morning? An email list exported weekly is owned. An email list that exists only inside a tool you can no longer log into is not.

### Do not diversify too early

The reflex answer is "add channels", and it is often wrong. Every channel carries a fixed cost to learn, a minimum spend before its data means anything, and a stretch where it loses money. Two channels at 40% of a small number are worse than one channel that still pays back, because you have doubled the learning cost and halved the attention.

The signal to open a second channel is the marginal cost from Chapter 7 crossing the affordable CAC from Chapter 11, or a live access threat. Not a feeling about risk.

### Write the runbook before you need it

A backup channel you have never run is not a backup. Four rows, agreed in advance:

| Trigger | Action within 48 hours | Owner |
|---|---|---|
| Ad account disabled | Shift budget to search, send win-back to 8,400 lapsed buyers | Priya |
| CPM up 30% for 14 days | Cut prospecting to break-even, hold retargeting | Priya |
| Marketplace listing pulled | Site-wide banner, email the 900 buyers it produced | Sam |
| Card processor freeze | Switch to the secondary processor, tested every quarter | Dan |

"Tested every quarter" is the whole point of that last row. A secondary processor you would have to integrate during the outage is a plan, not a mitigation.

### The dependency nobody lists

It is rarely the ad platform. It is the single roaster, the single fulfilment partner, the one bag size that 60% of orders use. Marketing concentration shows up in a dashboard. Operational concentration only becomes visible on the day it breaks.
      `,
        [
          q('Riverbend runs five channels and scores 0.291 on the squared-share concentration index. What does that indicate?', [
            'Well diversified, since no single channel exceeds half of revenue',
            'The index is unusable below six separate channels of revenue',
            'Concentrated enough that one company\'s bad quarter becomes yours',
            'Diversification now matters more than channel profitability does',
          ], 2, 'Counting channels hides how revenue is distributed across them, and above 0.30 a single platform decision moves the whole business.'),
          q('Which platform risk is most likely to damage a business without anyone noticing in time?', [
            'Access risk, since a suspension halts revenue on the day it lands',
            'Economics risk, since a rising take rate never triggers an alert',
            'Demand risk, since reach per post is visible in every dashboard',
            'Creative risk, since fatigue shows up in frequency reports fast',
          ], 1, 'A fee moving from 15% to 21% erodes margin quietly month after month, while suspensions and reach collapses announce themselves immediately.'),
          q('A founder wants a second paid channel purely to cut risk, while the first still pays back on the next dollar. What is the better trigger?', [
            'Any channel passing 30% of total revenue for two quarters',
            'The moment a competitor is seen advertising on that channel',
            'A calendar rule, such as adding one new channel each year',
            'Marginal cost crossing the affordable CAC, or live access risk',
          ], 3, 'Every new channel carries a learning cost and a loss-making stretch, so it is worth opening when the first can no longer absorb money profitably or its access is genuinely threatened.'),
        ]
      ),
      lesson('Saturation, the Growth Ceiling, and Changing the Model', 14, `
Riverbend grew 6% a month for two years. Then five flat months while spend rose 30%. Nothing was broken, which is what made it hard: the funnel converted the same, the ads still worked, the guides still ranked. The model had simply run out of room.

Growth stops for four different reasons and they take four different answers. Naming the wrong one costs a quarter.

### Which ceiling are you actually hitting

| Symptom | Ceiling | The move |
|---|---|---|
| Spend rises, marginal CPA rises, conversion steady | Channel | New channel, or raise the CAC you can afford |
| Impression share near 100%, category volume flat | Demand | New segment, geography or category |
| Traffic grows, orders do not | Conversion | Chapter 6 work: message match, checkout |
| New customers steady, revenue flat | Retention | Chapter 11 work: frequency, lifecycle, AOV |

Riverbend's numbers said channel and demand at once. Non-brand search sat at 82% impression share on a keyword set totalling 41,000 monthly searches. Paid social marginal CPA had crossed $61 against a ceiling of $16. There was no clever bid strategy left to find.

### The sizing check that ends the argument

\`\`\`text
Category searches per month (whole-bean mail order)   41,000
Realistic click share for a mid-size roaster             12%
Sessions available                                     4,920
Site conversion rate                                    2.6%
Orders available per month from search                    128
Riverbend already takes                                   119
\`\`\`

Nine orders of headroom. Every plan that opens with "double organic search" is arguing with that table, and the table wins.

### Four ways to change the model

1. **New segment.** Same beans, different buyer. Offices of 20 to 60 people buy the same product at eight times the volume with almost no consumer marketing.
2. **New geography.** Ireland and the Netherlands sit inside shipping range, and the hreflang work from Chapter 8 is already understood.
3. **New product.** Grinders, filters, gift sets. Raises order value without new customers.
4. **New model.** Subscription, wholesale, business to business.

### Why changing frequency beats finding a channel

The CAC ceiling is not a fixed fact about your business. It is an output of frequency and margin, so you can move it.

| | One-off buyers | With subscription |
|---|---|---|
| Orders per customer per year | 2.6 | 7.4 |
| Average order value | $34 | $27 |
| Gross margin | 55% | 55% |
| Annual gross profit per customer | $48.62 | $109.94 |
| Affordable CAC at 12 month payback | $16 | $41 |

Read the last row twice. Getting 22% of buyers onto a monthly 500g plan does not only add revenue. It raises what you are allowed to pay for a customer from $16 to $41. Paid social at $61 is still not viable, but non-brand search at a $23 marginal cost becomes comfortably profitable again. A retention change reopened an acquisition channel, and that move is nearly always available before a new channel is.

Wholesale does the same thing from the other end. Forty kilos a month to three cafes at 32% margin carries no acquisition cost after the first conversation, and it fills the August trough the seasonality index in Chapter 7 keeps flagging.

### Four tests before you commit

- **Is it a real market or your existing market renamed?** Office coffee has its own buyers and its own search terms. A "premium tier" usually does not.
- **Does it use an asset you already have?** Roasting capacity, brand and the shipping run all serve wholesale. A grinder line uses none of them.
- **Can you test it for under 5% of the year's budget?** Three cafes and one landing page is a test. A warehouse is a bet.
- **What breaks if it works?** Wholesale at forty kilos a week fills Tuesday roasting, and the 48 hour promise from Chapter 1 is the first casualty.

### Do this now

Write the ceiling table with your own numbers and circle the row that fits. Then recompute the CAC you could afford if frequency rose by one order a year. If that number reopens a channel you switched off, you have found next quarter's growth without buying a single new impression.
      `,
        [
          q('Spend is rising, marginal CPA is rising, conversion rate is unchanged and impression share is near 100%. Which ceiling is it?', [
            'Channel and demand together, so more budget cannot fix it',
            'Conversion, so the checkout and landing pages need the work',
            'Retention, so the lifecycle programme is the right project',
            'Measurement, so attribution is understating the real return',
          ], 0, 'A steady conversion rate rules out the funnel, and near-total impression share means the cheap demand is already bought, so the answer is a different market rather than a bigger bid.'),
          q('A subscription lifts annual gross profit per customer from $48.62 to $109.94. Why does that matter for acquisition?', [
            'It lowers average order value, so the ads become cheaper to run',
            'It removes the need to measure payback on a first order at all',
            'It raises the affordable CAC, reopening a channel you switched off',
            'It shifts revenue into retention, so acquisition spend can be cut',
          ], 2, 'The CAC ceiling is an output of frequency and margin, so raising frequency makes a $23 marginal cost profitable when it was not before.'),
          q('Which proposed expansion best passes the test of using assets Riverbend already has?', [
            'A branded grinder line sourced from a new overseas manufacturer',
            'Wholesale bags to three local cafes on the same Tuesday roast run',
            'A coffee shop franchise across two neighbouring city centres',
            'A mobile app with brew timers built for the existing audience',
          ], 1, 'Wholesale runs on the roasting capacity, brand and shipping that already exist, while a grinder line uses none of them.'),
        ]
      ),
      ],
      [
      q('Across a set of definitional guides, impressions and average position are flat while clicks have halved. What is the correct response?', [
        'Rebuild internal links to push more authority into those guides',
        'Refresh the content and resubmit every affected URL for indexing',
        'Disavow the links pointing at the affected guide templates',
        'Accept the change and reprice a plan that was built on sessions',
      ], 3, 'Holding position while losing clicks is a results page shape problem rather than a ranking loss, so the work is deciding which query types still earn a visit.'),
      q('A team blocks Google-Extended hoping to disappear from AI Overviews. What is the outcome?', [
        'Overviews stop citing the site within one full crawl cycle',
        'Overviews continue, and the assistant surfaces are lost instead',
        'The site leaves the index alongside the overview citations',
        'Nothing changes, because that directive covers images only',
      ], 1, 'Google-Extended governs Gemini and grounding products rather than Search, so the block costs the surfaces the team might have wanted and leaves overviews untouched.'),
      q('Which asset would still be usable the morning after a vendor closed the account holding it?', [
        'An email list exported weekly into your own customer database',
        'A 60,000 follower audience on a single social media platform',
        'A marketplace storefront with four years of seller reviews',
        'A retargeting audience built inside one ad platform account',
      ], 0, 'The test is what survives the vendor rather than what the asset is called, and only a copy you hold yourself passes it.'),
      q('Search headroom is nine orders a month and paid social marginal CPA is $61 against a $16 ceiling. What is the strongest next move?', [
        'Rebid the search account around exact match to lift efficiency',
        'Increase publishing volume to widen the ranking keyword set',
        'Change the model so frequency and the affordable CAC both rise',
        'Cut paid social entirely and hold spend until the CPMs fall',
      ], 2, 'Both the channel and the demand ceiling have been reached, so the only lever left is altering the unit economics that decide what you can pay for a customer.'),
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
      q('Log analysis shows filter URLs eating most of the crawl budget, so a team blocks them in robots.txt. Those filtered listings were also the only internal links reaching 12,000 product pages, which remain in the XML sitemap. What happens next?', [
      'The crawl budget freed by the block is reassigned to the product pages, which then rank better',
      'Nothing changes for the products, because a sitemap entry carries the same weight as an internal link',
      'Google keeps following the links on those URLs, since robots.txt governs indexing rather than crawling',
      'The products go orphaned, because a URL Google may not fetch is a URL whose links it never follows',
    ], 3, 'Blocking a URL stops Googlebot fetching it at all, so the links it was carrying stop passing discovery and authority, and a sitemap only gets pages found rather than replacing the internal linking they lost.'),
    q('A conversions API is added alongside the existing browser pixel with no shared event_id. Reported ROAS climbs from 2.1 to 6.0, budget is raised 40%, and blended MER computed from the order system does not move at all. What happened?', [
      'One order was counted twice, so the reported gain was duplication rather than extra sales',
      'Server events match better, so the ROAS is real and the order system lags by a purchase cycle',
      'The extra budget landed on a saturated audience, so the orders it bought were nearly zero',
      'Consent mode modelling inflated the browser conversions once the tagging container changed',
    ], 0, 'Without a shared event_id the platform cannot deduplicate the browser and server versions of the same purchase, so real orders report as roughly double, and the uncensored order system is what exposes the arithmetic.'),
    q('A geo holdout puts paid social\'s incremental cost at $20.33 an order. Gross profit is $18.70 an order, and contribution after carrier, packaging, payment processing and refunds is $8.54. What is the honest read of that channel?', [
      'It loses about $1.60 an order, the gap between incremental cost and gross profit',
      'It is acceptable, since the incremental cost sits below the $34 average order value',
      'It loses about $12 an order, because the ad has to be paid out of contribution',
      'It cannot be judged until the platform\'s own reported cost per order is included',
    ], 2, 'Advertising is funded from what survives every variable cost, so incremental cost has to be compared with contribution rather than gross profit, and $20.33 against $8.54 is a far bigger loss than the gross figure suggests.'),
    q('Cumulative contribution per acquired customer is $9.60 at 60 days, $11.44 at 90, $14.60 at 180 and $18.87 at 365. The business can only fund a 90 day payback, and media is currently buying customers at $16. What follows?', [
      'The CAC is fine, because each customer eventually contributes $18.87 against the $16 paid',
      'They are buying above what 90 days funds, so CAC falls or order frequency rises',
      'Raise the target ROAS until reported revenue reaches the 365 day contribution figure',
      'Payback timing does not matter while the lifetime value ratio stays above two to one',
    ], 1, 'The CAC you can afford is whatever contribution arrives inside the window your cash can fund, so $16 against $11.44 is insolvent at 90 days unless frequency or margin lifts the ceiling itself.'),
    q('A set of definitional guides has lost most of its clicks to AI Overviews, and the same team also wants to be cited by AI assistants. Which single change does the most for both goals at once?', [
      'Add FAQ markup to every guide so that the answers can be extracted more easily',
      'Block Google-Extended so assistants have to link to the page rather than summarise it',
      'Publish many more guides, since retrieval favours the site with the most pages on a topic',
      'Lead with a measured claim you own, then add the tool, stock and data no summary carries',
    ], 3, 'A claim with a number, a method and an owner behind it is what makes a passage quotable by an assistant, and the material a generated summary cannot reproduce is exactly what still earns a click from the results page.'),
    q('A geo test planned as 12 regions over 6 weeks has a minimum detectable effect of 4.6%. To finish sooner the team proposes 24 regions over 3 weeks, which the same rule of thumb also puts at 4.6%. The median gap from first visit to order is 9 days. What is wrong with the swap?', [
      'Three weeks is too short for a nine day purchase cycle, so the delayed response is missed',
      'Doubling the regions raises spillover enough to push the detectable effect well above 4.6%',
      'Detectable effect depends on elapsed weeks alone, so the shorter test resolves far less',
      'A holdout arm must always hold at least half of the regions, which 24 regions cannot satisfy',
    ], 0, 'Region weeks fix the statistical power but not the buying cycle, so a test should run at least four times the median lag or the orders the paused ads would have produced never arrive inside the read window.'),
  ],
});
