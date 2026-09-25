import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'freelancing-upwork-fiverr',
  title: 'Freelancing: Upwork, Fiverr & LinkedIn',
  category: 'Business',
  level: 'Beginner',
  duration: '5 weeks',
  accent: 'emerald',
  coverKey: 'freelancing-upwork-fiverr',
  summary:
    'Turn a skill into steady international income: choose a service clients pay for, build profiles that get noticed, write proposals that win, price with confidence and get paid safely in Pakistan.',
  description:
    'You start with how freelancing really works and what clients actually buy, then build a portfolio before your first client. You set up an Upwork profile that gets invited, write proposals that win, create Fiverr gigs that sell and turn LinkedIn into a steady source of clients. Then you learn to price with confidence, manage clients and scope, protect yourself from scams and disputes, and get paid in Pakistan with tax and records in order. The course ends with reviews and repeat work, and the move from solo freelancer to a small agency.',
  chapters: [
    chapter(
      'How Freelancing Really Works',
      'Understand what clients are really paying for, choose a service you can deliver well, and pick the platforms that fit it, with honest expectations.',
      [
      lesson('What Clients Actually Buy', 12, `
Bilal from Rawalpindi spent three months on Upwork applying to logo design jobs with the same message: "I am a professional graphic designer with 3 years of experience. I can do your work. Please hire me." He sent over sixty proposals and got two replies. His designs were good. His message was about him, and clients were not buying him.

### Clients buy outcomes, not skills

A client never wakes up wanting "a graphic designer". They want a logo that makes their new bakery look trustworthy, before the shop opens next month, without endless back and forth. The skill is how you deliver that; it is not what they pay for.

| What freelancers say they sell | What clients actually buy |
|---|---|
| "Graphic design" | A brand that looks credible to their customers |
| "WordPress development" | A website that brings enquiries and does not break |
| "Video editing" | Videos that keep viewers watching and grow the channel |
| "Data entry" | Clean data, delivered on time, so they can stop worrying about it |
| "SEO" | More customers finding them on Google |

Once you see the right-hand column, everything changes: your profile, your proposals and your prices start speaking the language clients think in.

### The three things every client wants

Behind almost every job post are three hopes:

1. **A result.** The problem solved, the thing working, the goal reached.
2. **Low risk.** Confidence that you will deliver, on time, without drama. Clients hiring a stranger on the internet are nervous.
3. **Low effort.** They want to explain once, get clear updates and not manage you.

Cheap prices matter far less than beginners think. A client who has been burned by a freelancer who disappeared halfway through will happily pay more for someone who feels safe. That is why a clear portfolio, reviews and good communication often beat a lower price.

### Your job is to reduce their risk

Every part of this course is a way to make a stranger feel safe paying you:

- A **portfolio** proves you can do the work.
- A **clear profile** proves you understand their problem.
- A **specific proposal** proves you read their job post.
- **Reviews** prove that others trusted you and were happy.
- **Good communication** proves you will not disappear.

### Rewriting Bilal's message

Here is the same designer, speaking to the outcome:

\`\`\`text
Hi Ayesha, congratulations on the new bakery in DHA.

A bakery logo has one job: to look warm and trustworthy on the shop sign,
the boxes and Instagram. I recently designed the brand for a café in
Lahore (sample attached) and delivered three directions within four days.

For you I would start with three concepts based on your colours and the
feel you described, then refine the chosen one twice. Final files for
signage, print and social media, ready before your opening date.

Would you like to see how the café logo looks on their packaging?
\`\`\`

Bilal's reply rate changed within a week. The skill was the same. The message finally answered the questions a nervous client was asking.

### A habit to build now

Whenever you read a job post, a gig or a client's message, ask one question before anything else: "What result is this person hoping for, and what are they afraid of?" Answer that in your first two sentences, and you will already be ahead of most freelancers competing for the same work.
      `,
        [
          q('According to this lesson, why did Bilal\'s early proposals get so few replies?', [
            'His designs were not good enough for Upwork',
            'He applied only to jobs outside his skill',
            'His messages talked about himself instead of the client\'s goal',
            'He charged far more than other designers',
          ], 2, 'His work was good, but a generic message about his experience did not answer what the client wanted, so it looked like every other proposal.'),
          q('Which three things does almost every client hope for?', [
            'The lowest price, the fastest delivery and unlimited revisions',
            'A result, low risk and low effort',
            'A famous freelancer, a long contract and daily calls',
            'Free samples, a discount and a money-back guarantee',
          ], 1, 'Clients want the problem solved, confidence that you will deliver, and a process that does not demand constant management.'),
          q('Why can a freelancer who charges more still win against a cheaper one?', [
            'Platforms always rank expensive freelancers first',
            'Clients assume cheap work is illegal',
            'Higher prices remove the need for a portfolio',
            'Clients often pay more for someone who feels safer to hire',
          ], 3, 'Hiring a stranger feels risky, so proof, reviews and clear communication that reduce that risk often matter more to clients than a lower price.'),
        ]
      ),
      lesson('Choosing a Service You Can Deliver Well', 13, `
The most common beginner mistake is listing ten services: logo design, video editing, data entry, WordPress, social media, virtual assistance and more. It feels safer to cast a wide net. In practice it makes you look like someone who is good at nothing in particular, and clients hire specialists.

### The three questions that choose your service

A good freelance service sits where three answers overlap:

1. **Can you deliver it well today, or within a few weeks of focused practice?** Clients pay for results now, not for your learning journey.
2. **Do clients pay for it, repeatedly?** Check that there are plenty of recent job posts and active gigs for it.
3. **Would you be happy doing it forty hours a week?** You will do a lot of it. Boredom shows in the work.

### Test demand before you commit

Spend an hour researching before choosing. On Upwork, search the service and look at jobs posted in the last few days. On Fiverr, search it and look at how many gigs exist and how many reviews the top ones have. Write down what you see:

| Service | Recent Upwork jobs | Fiverr competition | Typical budget | Your skill today |
|---|---|---|---|---|
| Shopify store setup | Many, every day | High, but clients want specifics | Medium | Strong |
| Logo design | Many | Very high | Low to medium | Strong |
| n8n automation | Growing steadily | Low | Medium to high | Learning |
| Data entry | Many | Extremely high | Low | Strong |

The table makes trade-offs visible. Data entry has endless demand but crushing competition and low budgets. Automation has fewer jobs but less competition and better pay. Neither answer is wrong; you are choosing deliberately instead of by accident.

### Narrow down, then narrow again

"Web developer" is too broad. "WordPress developer" is better. "WordPress speed optimisation for WooCommerce stores" is a specialism clients search for, remember and pay more for. You can always widen later; it is much harder to stand out while wide.

Narrowing can be by skill, by industry or by result:

\`\`\`text
Broad:        Video editor
By skill:     Short-form video editor for Reels, TikTok and Shorts
By industry:  Video editor for real estate agents' property tours
By result:    Video editor who turns long podcasts into daily short clips
\`\`\`

The last three each attract a specific client who instantly recognises themselves.

### Skills that combine well

Your strongest offer is often two skills that clients would otherwise hire separately. A designer who also writes copy can deliver a complete landing page. A virtual assistant who can build simple automations saves clients hours every week. Combinations are harder to compete with and easier to price well.

### Pick one, commit for ninety days

Choose one primary service, build the portfolio for it in the next chapter, and give it three focused months before deciding it does not work. Switching services every few weeks resets your progress every time: new portfolio, new profile, no reviews. Consistency is what compounds.
      `,
        [
          q('Why is listing ten unrelated services a weak strategy for a new freelancer?', [
            'Platforms forbid more than three services per profile',
            'It makes the profile too long to load',
            'Clients prefer specialists, and a scattered list looks like no clear strength',
            'Each extra service costs Connects on Upwork',
          ], 2, 'Clients hire people who clearly solve their specific problem, so a long mixed list makes a freelancer look unfocused rather than expert.'),
          q('Which positioning is most likely to attract a specific, well-paying client?', [
            '"Video editor"',
            '"Creative professional for all your digital needs"',
            '"Freelancer available for any task"',
            '"Video editor who turns long podcasts into daily short clips"',
          ], 3, 'A narrow, result-focused description lets the right client recognise themselves immediately and signals expertise worth paying for.'),
          q('How long does the lesson suggest committing to one primary service before judging it?', [
            'About ninety days of focused effort',
            'One week, then switch if no client appears',
            'Two years, regardless of results',
            'Until you have fifty reviews',
          ], 0, 'Three focused months gives a portfolio, profile and first reviews time to build, whereas switching every few weeks resets progress each time.'),
        ]
      ),
      lesson('Platforms Compared: Upwork, Fiverr and LinkedIn', 13, `
Upwork, Fiverr and LinkedIn all lead to paid work, but they work in opposite ways. On Upwork you go to the client. On Fiverr the client comes to you. On LinkedIn you build a reputation that brings both. Knowing the difference saves months of using the wrong approach on the right platform.

### How each one works

| | Upwork | Fiverr | LinkedIn |
|---|---|---|---|
| Who moves first | You apply to jobs clients post | Clients search and buy your gig | You post, connect and start conversations |
| What you create | A profile, then a proposal for each job | Gigs: fixed packages with prices | A profile and regular content |
| Typical work | Custom projects, hourly and fixed-price | Clearly defined, packaged services | Larger projects and long-term clients |
| Cost to you | Connects to submit proposals, plus a service fee on earnings | A commission on each order | Free, with optional paid features |
| Payment protection | Escrow and hourly protection built in | Payment held by Fiverr until delivery | None built in; you arrange it yourself |

Fees on all platforms change from time to time. Always check each platform's current fee page before calculating what you will actually receive.

### Upwork: best for custom work and higher budgets

Upwork suits services where every project is a little different: web development, automation, writing, design systems. You compete with other freelancers for each job by writing a proposal, which rewards people who read carefully and write well. Budgets can be substantial, and long-term hourly contracts are common. The cost is that you need Connects for every application, and your early weeks involve a lot of proposals with few replies.

### Fiverr: best for packaged services

Fiverr suits services that can be described as a product with a fixed price: "a logo with three concepts", "a 60-second video edit", "a WordPress site speed fix". Buyers browse and purchase without negotiation. The work is in making gigs that rank in search and convert visitors. Early growth is slow until your first reviews arrive, and then it can accelerate quickly.

### LinkedIn: best for trust and long-term clients

LinkedIn is not a marketplace. There is no job board built for freelancers in the same way, and no escrow. Instead, people see your posts, check your profile and message you directly. It takes longer to start, but clients from LinkedIn often come already trusting you, pay more and stay longer. It also works for local Pakistani businesses and overseas companies alike.

### Which should you start with?

- If your service is **custom and project-based**, start with Upwork.
- If your service is **easy to package with a fixed price**, start with Fiverr.
- Whatever you choose, **set up LinkedIn in parallel** and post regularly; it compounds over months.

Two platforms done well beat four done badly. Each needs daily attention in the first months: new proposals, gig improvements, replies within hours. Spread yourself across everything and you do each of them poorly.

### A word about everything else

Other marketplaces, Facebook groups and local referrals all produce clients too, and nothing in this course stops you using them. The principles are identical everywhere: clear outcome, proof, low risk for the client, fast replies. Learn them properly on one or two platforms, and they transfer to any other.
      `,
        [
          q('What is the key difference between how Upwork and Fiverr bring you work?', [
            'Upwork is only for hourly work and Fiverr only for monthly retainers',
            'Fiverr requires proposals while Upwork does not',
            'On Upwork you apply to jobs; on Fiverr clients find and buy your gigs',
            'There is no difference apart from the website colours',
          ], 2, 'Upwork is proposal-driven, with freelancers applying to posted jobs, while Fiverr is catalogue-driven, with buyers searching and purchasing packaged gigs.'),
          q('Which service fits Fiverr\'s packaged model best?', [
            'A custom enterprise software project with changing requirements',
            'A logo with three concepts and two revisions for a fixed price',
            'A year-long hourly contract to manage a team',
            'An open-ended research partnership',
          ], 1, 'Fiverr works best for services that can be described as a clear product with a set price, like a defined logo package.'),
          q('Why set up LinkedIn in parallel even if you start on Upwork or Fiverr?', [
            'It builds trust over months and brings clients who arrive already confident in you',
            'LinkedIn pays freelancers a fee for every post',
            'It is required before you can withdraw money from Upwork',
            'LinkedIn has built-in escrow for every project',
          ], 0, 'Consistent LinkedIn activity compounds into a reputation that attracts clients directly, often for larger and longer engagements.'),
        ]
      ),
      lesson('Honest Expectations for the First Three Months', 12, `
Social media is full of screenshots of freelancers earning thousands of dollars in their first month. Those stories are real for a few people and misleading for almost everyone else. Expecting instant results is the main reason capable people quit after four weeks, just before things would have started working.

### What the first three months usually look like

| Month | What you mostly do | Typical results |
|---|---|---|
| 1 | Build portfolio, set up profiles, send many proposals or publish gigs | Few replies; possibly no clients yet |
| 2 | Refine proposals and gigs from what you learned, keep applying | First small projects, often below your target rate |
| 3 | Deliver excellently, collect reviews, raise rates slightly | Replies improve because reviews now reduce client risk |

These are patterns, not promises. Some people get their first client in a week, and some take longer than three months. What predicts success is not luck; it is how consistently you apply the methods in this course and how quickly you learn from each rejection.

### Why the first client is the hardest

To a client, a profile with zero reviews is a risk. The same profile with three strong reviews is a much safer bet. That means your first few projects are about **earning trust** as much as earning money. It is normal, and sensible, to take a first project at a modest price if it brings a solid review and a portfolio piece. It is not sensible to work for almost nothing indefinitely; once you have a few reviews, prices should rise.

### Protect yourself while you build

Freelancing income starts slowly and arrives unevenly. Plan for that:

- **Keep your current income source** if you can, or start freelancing alongside studies, until freelance income is steady.
- **Have savings for a few months of expenses** before relying on freelancing alone.
- **Track your time** so you know which activities actually produce clients.

### Measure the process, not just the income

In the early weeks, income is a poor signal because it lags. Track the activities that lead to it:

\`\`\`text
Week 3 tracker
Proposals sent:                 22
Replies received:               3   (14%)
Calls or chats:                 2
Projects won:                   1
Portfolio pieces added:         1
LinkedIn posts published:       3
What I will change next week:   shorter opening, mention similar past project
\`\`\`

If proposals get no replies, fix the proposals. If replies do not turn into projects, fix your conversations and pricing. The numbers tell you exactly which chapter of this course to revisit.

### The long game

Freelancers who last treat it as building a business, not buying a lottery ticket. Each good project makes the next one easier: more reviews, a stronger portfolio, higher rates, repeat clients and referrals. Most people who say "freelancing does not work" stopped during the hardest part, the first few months, which is exactly when the compounding had not started yet.
      `,
        [
          q('Why are the first few projects often worth taking at a modest price?', [
            'Because platforms require beginners to charge the minimum',
            'Because reviews and portfolio pieces make later clients far more willing to hire you',
            'Because low prices guarantee five-star reviews',
            'Because clients refuse to pay beginners at all',
          ], 1, 'Early projects build the trust signals that reduce risk for future clients, after which rates can and should rise.'),
          q('In the early weeks, what should you track most closely?', [
            'Only the money earned each day',
            'The number of followers on social media',
            'Activities such as proposals sent, replies and projects won',
            'How many hours you spent reading about freelancing',
          ], 2, 'Income lags behind effort, so tracking activities and conversion rates shows which part of your process needs fixing.'),
          q('Your proposals get replies, but the replies rarely become projects. What should you improve?', [
            'Your conversations with clients and your pricing',
            'The number of proposals you send',
            'Your profile photo only',
            'Nothing, because it is purely luck',
          ], 0, 'If clients reply but do not hire, the proposals are working and the conversation or offer that follows is where the process breaks down.'),
        ]
      ),
      ],
      [
      q('What is a client really paying for when they hire a freelancer?', [
        'The freelancer\'s years of experience',
        'An outcome delivered with low risk and little effort on their side',
        'The number of tools the freelancer knows',
        'The cheapest possible price',
      ], 1, 'Clients buy results and peace of mind; skills and tools are only the means of delivering them.'),
      q('Which service choice follows the lesson\'s advice best?', [
        'Listing every skill you have ever learned',
        'Choosing whatever has the most competition',
        'Changing services every two weeks',
        'One focused service you can deliver well, with proven demand, for ninety days',
      ], 3, 'A focused, in-demand service pursued consistently builds a portfolio, profile and reviews that compound over time.'),
      q('Which platform is built around clients searching and buying packaged services?', [
        'Upwork',
        'Fiverr',
        'LinkedIn',
        'None of them',
      ], 1, 'Fiverr presents services as gigs with fixed packages that buyers search for and purchase directly.'),
      q('Replies to your proposals are very low. What does the lesson suggest?', [
        'Stop freelancing, since results should be instant',
        'Double your prices immediately',
        'Rewrite the proposals, because that is the step that is failing',
        'Switch to a completely different service at once',
      ], 2, 'Tracking each step shows where the process breaks, and low replies point directly at the proposals as the thing to improve.'),
      ]
    ),
    chapter(
      'A Portfolio Before Your First Client',
      'Build a small portfolio that proves results, write case studies clients read, create honest practice work, and share it where clients look.',
      [
      lesson('Portfolio Pieces That Prove Results', 13, `
A client scrolling through freelancer profiles spends a few seconds on each portfolio. In those seconds they are not asking "is this person talented?". They are asking "has this person solved a problem like mine before?". A portfolio that answers that question wins projects; one that simply shows nice work often does not.

### Quality and relevance beat quantity

Three to five strong, relevant pieces are more persuasive than twenty mixed ones. Every weak piece lowers the client's impression of the strong ones, because they judge you by the worst thing they see. If you offer Shopify store setup, a client wants to see Shopify stores, not your university assignment in C++.

| Weak portfolio piece | Strong portfolio piece |
|---|---|
| A screenshot with no explanation | A screenshot plus two lines on the problem and result |
| Work unrelated to your service | Work that matches exactly what you are selling |
| "Logo design" as the only caption | "Logo for a Karachi bakery: three concepts, chosen in 4 days" |
| Only the final result | Before and after, or a short look at the process |
| A broken link or a file needing permission | Opens instantly on a phone |

### Show the problem and the result

For every piece, answer three questions in a line or two each:

1. **What was the situation?** "A clothing store's product pages loaded slowly on mobile."
2. **What did you do?** "Compressed images, removed unused apps, switched to a lighter theme."
3. **What changed?** "The main page went from very slow to loading in under three seconds on a phone."

Numbers make it concrete, but only use numbers you can stand behind. "Loading time fell from 9 seconds to 3" is persuasive if true and disastrous if a client checks and finds it invented.

### Different services, same principle

- **Designers:** show the design in use, on a shop sign, packaging or phone screen, not only on a white background.
- **Developers:** link to the live site or a short screen recording, and describe the hardest problem you solved.
- **Writers:** show the published piece, and if possible what it achieved: rankings, sign-ups, replies.
- **Video editors:** a 30 to 60 second showreel of your best moments, then full examples.
- **Virtual assistants and data work:** a short document showing a messy starting sheet and the clean, organised result.

### Order matters

Put your single strongest, most relevant piece first. Many clients only open one. If you offer two related services, lead with the one you most want to be hired for, and remove anything that does not support either.

### Review it as a client would

Before publishing, open your portfolio on your phone, pretend you are a client with a specific problem, and give yourself fifteen seconds. Can you tell what this freelancer does, see a result, and find a way to contact them? If not, cut and reorder until you can. Then ask a friend to do the same test; they will notice what you have become blind to.
      `,
        [
          q('What question is a client really asking when they look at your portfolio?', [
            'How many years has this person been freelancing?',
            'Has this person solved a problem like mine before?',
            'Which design software does this person use?',
            'How many pieces are in this portfolio?',
          ], 1, 'Clients scan portfolios for evidence that you have handled a similar problem, which reduces their risk in hiring you.'),
          q('Why can adding more pieces make a portfolio weaker?', [
            'Platforms penalise portfolios with more than five items',
            'More pieces make the page load too slowly',
            'Clients only have permission to view three items',
            'Clients judge you by the weakest or least relevant work they see',
          ], 3, 'Unrelated or weaker pieces dilute the impression of your best work, so a short, relevant selection is more persuasive.'),
          q('Which caption best follows the lesson\'s advice?', [
            '"Logo design"',
            '"My best work, hire me"',
            '"Logo for a Karachi bakery: three concepts, chosen in 4 days"',
            '"Created using professional tools"',
          ], 2, 'A specific caption names the kind of client, the work and the outcome, which helps a similar client recognise themselves.'),
        ]
      ),
      lesson('Writing Case Studies Clients Actually Read', 13, `
A case study is a portfolio piece with a story. It turns "here is a website I made" into "here is how I helped a business like yours get a result". Clients rarely read long essays, so a good case study is short, structured and scannable, and it does more selling than any sentence about yourself.

### The structure

Every case study answers the same five questions, in this order:

\`\`\`text
Client and context:  Who they are, in one line.
The problem:         What was wrong or needed, in their terms.
What I did:          The approach, in three or four short points.
The result:          What changed, with numbers you can stand behind.
In their words:      A one-line quote from the client, if you have one.
\`\`\`

Here is one filled in:

\`\`\`text
Client:     A home bakery in Lahore selling through Instagram
Problem:    Orders arrived by DM with no record, and some were forgotten.
What I did: - Built a simple order form linked to a Google Sheet
            - Set up automatic WhatsApp confirmations
            - Trained the owner to use it in a 20-minute call
Result:     No missed orders in the first two months; the owner saves
            about an hour every evening she used to spend on messages.
Quote:      "I finally stopped worrying about forgetting a cake."
\`\`\`

That is under 100 words, and it tells a similar client exactly what you can do for them.

### Write in the client's language

Clients describe problems in plain terms: "I keep missing orders", "my website is slow", "nobody watches my videos to the end". Use those phrases in the problem section. Technical detail belongs in "what I did", kept short. A potential client should recognise their own situation in the first two lines.

### Getting honest numbers

Results are strongest with numbers, and weakest with invented ones. Ways to get real figures:

- Ask the client at the end of the project: "Has anything changed since we launched?"
- Measure before and after yourself: page speed, time taken, number of steps.
- Use what the platform shows: views, watch time, clicks, sales if the client shares them.

If you have no numbers, describe the change plainly and specifically instead: "orders are now all recorded in one sheet" is honest and still persuasive.

### Visuals that support the story

Add one or two images: a before and after, the final result in use, or a short screen recording. Visuals should prove the words, not replace them. A beautiful image with no explanation leaves the client to guess what you did and why it mattered.

### Where case studies go

Use them in the portfolio sections of your profiles, as the basis of LinkedIn posts, and as attachments to proposals when a job matches. One case study, reused well, can win you several similar projects, because clients with the same problem keep appearing.

Write the case study within a week of finishing the project, while you still remember the details and the client is happy to give you a quote. Waiting months usually means it never gets written.
      `,
        [
          q('In which order should a case study present its information?', [
            'Client and context, problem, what you did, result, client\'s words',
            'Your skills, your tools, your prices, your availability',
            'Result, your biography, the tools used, the invoice amount',
            'What you did, then the problem, with no mention of results',
          ], 0, 'The structure moves from the client\'s situation to the outcome, so a reader with a similar problem can follow how you solved it.'),
          q('A project had no measurable numbers. How should the result be described?', [
            'Invent realistic numbers to make it persuasive',
            'Leave the result section out entirely',
            'Describe the change plainly and specifically without figures',
            'Copy numbers from another freelancer\'s case study',
          ], 2, 'Honest, specific descriptions still persuade, while invented numbers destroy trust the moment a client checks them.'),
          q('Why use the client\'s own phrases, such as "I keep missing orders", in the problem section?', [
            'Because technical terms are banned on freelance platforms',
            'Because it makes the case study longer',
            'Because clients only read the quote at the end',
            'Because similar clients recognise their own situation immediately',
          ], 3, 'Plain problem descriptions match how potential clients think about their situation, so they see themselves in the story.'),
        ]
      ),
      lesson('Practice Projects, Spec Work and Honesty', 12, `
Every freelancer faces the same loop: clients want to see previous work, and you cannot get previous work without clients. The way out is practice projects, built deliberately for your portfolio. Done honestly, they are completely acceptable and very effective. Done dishonestly, they can end a freelance career before it starts.

### Ways to create real portfolio work

- **Redesign or rebuild something that exists**, such as a local restaurant's outdated website, clearly labelled as a concept.
- **Help people you know**: a relative's shop, a friend's startup, your university society. Small, real projects with real feedback.
- **Volunteer for a non-profit** or community project that needs design, a website or content.
- **Build your own project**: a blog, a small online store, a YouTube channel, a template you sell.
- **Solve a public problem**: an open-source contribution, a free tool, a detailed tutorial.

Each of these produces work you can show and, for real projects, sometimes a testimonial.

### The honesty rules

| Acceptable | Not acceptable |
|---|---|
| A concept redesign labelled "concept, not commissioned" | Presenting a concept as paid client work |
| A project for your uncle's shop, described as such | Inventing a client name or company |
| Work from a team, with your role stated clearly | Claiming a whole team's project as yours alone |
| A tutorial project you extended significantly | Copying a tutorial's result and presenting it as original |
| Using a template, disclosed | Downloading someone else's portfolio images |

Clients and platforms do check. A reverse image search takes seconds, and a single discovered fake can get a profile suspended. Honest concept work is respected; fake client work is not forgiven.

### Label concept work clearly

A simple caption keeps you on the right side:

\`\`\`text
Concept project: Restaurant website redesign
Not commissioned. I redesigned a real Islamabad restaurant's website
to show how a clearer menu and online ordering could look on mobile.
\`\`\`

Clients understand that new freelancers build concepts. What impresses them is the quality of thinking, and the honesty.

### Beware of "test tasks" that are really free work

Some job posts ask applicants to complete a "small test" before hiring: write three full articles, design a complete logo, translate a whole document. Sometimes these are genuine, short assessments. Sometimes the client collects free work from dozens of applicants and hires nobody.

Protect yourself:

- A reasonable test is **small**, often under an hour, and clearly a sample.
- For anything larger, offer a **paid trial** instead: "I am happy to do this as a small paid first milestone."
- Never do test work outside the platform's protection, and never send final, usable files for free.

### From practice to paid

Two or three good practice projects are enough to start applying. As real projects arrive, replace practice pieces one by one with paid client work. Within a few months your portfolio should be mostly real work, and the concepts can quietly retire.
      `,
        [
          q('Which of these is an honest way to present a practice project?', [
            'Naming a well-known brand as your client',
            'Labelling a redesign as a concept that was not commissioned',
            'Removing the template author\'s name from the design',
            'Describing a team project as entirely your own work',
          ], 1, 'Clearly labelled concept work shows your ability without misleading clients, whereas inventing clients or hiding others\' contributions is dishonest.'),
          q('A job post asks you to write three full articles as a free "test". What is the safest response?', [
            'Write all three immediately so you stand out',
            'Ignore the job and report the client for fraud',
            'Send the articles by email outside the platform',
            'Offer a short sample, or do the work as a small paid first milestone',
          ], 3, 'Large unpaid tests can be a way to collect free work, so a small sample or a paid trial protects your time while still showing your ability.'),
          q('What should happen to practice projects as paid work arrives?', [
            'They should be kept at the top of the portfolio forever',
            'They should be relabelled as client work',
            'They should be replaced gradually by real client projects',
            'They should be sold to the first client who asks',
          ], 2, 'As real results and testimonials accumulate, they become stronger proof than concepts, so practice pieces can be retired one by one.'),
        ]
      ),
      lesson('Where to Host and Share Your Portfolio', 12, `
A great portfolio that a client cannot open is worth nothing. Broken Google Drive links asking for permission, a 50 MB PDF that will not load on mobile data, or a website that takes ten seconds to appear all lose clients before they see your work. Where and how you host it matters almost as much as what is in it.

### Use each platform's own portfolio first

Upwork profiles have a portfolio section, and Fiverr gigs have image and video galleries. Clients browsing those platforms look there first, and they never have to leave the site. Fill them with your best, most relevant pieces before anything else.

### Then a home of your own

Beyond the platforms, choose a place that suits your service:

| Service | Good places to host work |
|---|---|
| Design and illustration | Behance or Dribbble, plus a simple personal site |
| Web development | Live links to sites you built, a GitHub profile for code |
| Writing | Published links, or a clean personal site with samples |
| Video editing | YouTube or Vimeo, with a short showreel pinned |
| Virtual assistance and data | A short PDF case study or a page on a personal site |
| Any service | A simple one-page personal website linking to everything |

A one-page personal site with your name, your service, three case studies and contact details is cheap to run and makes you look established. Many freelancers use a free or low-cost website builder; what matters is that it loads fast and reads well on a phone.

### Check every link like a client

Before sending a portfolio link to anyone, test it:

\`\`\`text
[ ] Opens in a private browser window, not only when you are logged in
[ ] Google Drive or Dropbox files are set to "anyone with the link can view"
[ ] Loads in a few seconds on mobile data, not just on Wi-Fi
[ ] Images are sharp, not blurry or stretched
[ ] Videos play without downloading a huge file
[ ] Your contact details or profile link are visible
\`\`\`

The first item catches the most common problem: files that open perfectly for you because you are logged in, and show "request access" to everyone else.

### Keep one link that leads to everything

Clients and contacts will ask "where can I see your work?" in chats, emails and calls. Have one short, memorable link ready, usually your personal site or your strongest profile, that leads to everything else. Put it in your email signature, your LinkedIn profile and your proposal templates.

### Keep it current

Set a reminder every month to add your newest good project and remove your weakest one. A portfolio whose most recent piece is two years old quietly tells clients you are not getting work. A portfolio that changes monthly tells them you are busy and improving, which makes them more comfortable hiring you now.
      `,
        [
          q('A client says your Google Drive portfolio link asks them to request access. What went wrong?', [
            'The client\'s internet connection is too slow',
            'Google Drive does not allow portfolios',
            'The files were not shared as viewable by anyone with the link',
            'The files were too small to open',
          ], 2, 'Drive files often open for their owner but not for others, so sharing must be set to anyone with the link can view.'),
          q('Where should a freelancer on Upwork put their best work first?', [
            'In Upwork\'s own portfolio section, where clients already look',
            'Only on a personal website outside the platform',
            'In a large PDF emailed after the first call',
            'Nowhere until a client asks to see work',
          ], 0, 'Clients browsing a platform check its built-in portfolio first, so filling it keeps them on the page and reduces friction.'),
          q('Why update the portfolio every month?', [
            'Platforms delete portfolios that are not updated',
            'Clients can only view portfolios that are less than a month old',
            'It improves your Connects balance',
            'A current portfolio signals that you are active and improving',
          ], 3, 'Fresh work shows clients you are busy and developing, while an outdated portfolio suggests you are not getting projects.'),
        ]
      ),
      ],
      [
      q('How many strong pieces does the chapter suggest is enough to start applying?', [
        'At least fifty',
        'Around three to five strong, relevant pieces',
        'Exactly one, to keep things simple',
        'None, because clients never look at portfolios',
      ], 1, 'A small set of strong, relevant work is more persuasive than a large mixed collection, and it is achievable before your first client.'),
      q('What makes a case study persuasive to a potential client?', [
        'A long description of the tools used',
        'A list of every hour worked',
        'A clear problem, what you did and an honest result, in the client\'s language',
        'A promise that every project will get the same result',
      ], 2, 'A short story of a recognisable problem and a real outcome shows clients what you can do for them.'),
      q('Which portfolio practice could get a profile suspended?', [
        'Labelling concept work as not commissioned',
        'Showing work you did for a relative\'s shop',
        'Hosting design work on Behance',
        'Presenting someone else\'s images as your own work',
      ], 3, 'Platforms and clients can detect copied work quickly, and misrepresenting it is treated as a serious violation.'),
      q('What is the best first test of a portfolio link?', [
        'Opening it while logged in on your laptop',
        'Checking that the file is as large as possible',
        'Opening it in a private window on a phone using mobile data',
        'Asking the platform\'s support team to approve it',
      ], 2, 'Testing logged out on a phone reveals permission problems and slow loading exactly as a client would experience them.'),
      ]
    ),
    chapter(
      'An Upwork Profile That Gets Invited',
      'Write a title and overview clients respond to, choose categories and skills that surface you in search, complete every section, and get approved.',
      [
      lesson('A Title and Overview That Speak to Clients', 13, `
On Upwork, clients see your profile in two places: in search results, where only your photo, title, rate and the first lines of your overview appear, and on your full profile page. The title and the opening of the overview decide whether they click. Most profiles waste both on generic phrases.

### A title that says what you solve

Your title is the single most important line. It should name your service specifically and, where possible, the result or the client type.

| Weak title | Strong title |
|---|---|
| Professional Web Developer | Shopify Developer, Store Setup and Speed Fixes |
| Graphic Designer | Logo and Brand Identity Designer for Small Businesses |
| Virtual Assistant | Executive Assistant for Email, Calendar and CRM |
| Video Editor | YouTube Video Editor, Retention-Focused Edits and Shorts |
| Data Entry Expert | Data Cleaning and Google Sheets Automation |

The strong titles contain words clients actually search for, and they tell a client in two seconds whether you fit their job.

### The overview: open with their problem

Only the first couple of lines of your overview show before a client clicks "more". Spend them on the client, not on you. Compare:

\`\`\`text
Weak opening:
"Hello! I am a hardworking and passionate professional with 3 years of
experience. I am committed to providing quality work and client satisfaction."

Strong opening:
"Is your Shopify store slow, confusing on mobile or not converting visitors
into buyers? I set up and fix Shopify stores so they load fast and sell more."
\`\`\`

The weak opening could belong to anyone. The strong one speaks directly to a store owner with a specific pain.

### The rest of the overview

After the opening, build trust in a structure a busy client can scan:

\`\`\`text
1. The problem you solve (the opening lines above)
2. What you do, as a short list:
   - New store setup with theme customisation
   - Speed optimisation for mobile
   - Product page and checkout improvements
3. Proof: "Recently I helped a Lahore clothing brand cut mobile load time
   from 8 seconds to under 3." (only true results)
4. How you work: "I start with a quick audit, agree a clear plan and
   milestones, and send updates every two days."
5. A clear call to action: "Send me your store link and what is not
   working, and I will reply with first suggestions."
\`\`\`

Keep it scannable: short paragraphs, a list, no walls of text. Clients read on phones between meetings.

### Words to avoid

Phrases like "hardworking", "passionate", "quality work", "100% satisfaction" and "expert in everything" appear in thousands of profiles and communicate nothing. Replace every adjective with evidence: a result, a client type, a number, a process. "I reply within a few hours during Pakistani working hours" is more convincing than "excellent communication skills".

### Write for one ideal client

Picture one specific client, for example a small clothing brand owner in the UK selling through Shopify, and write the whole overview to them. Other similar clients will recognise themselves too. A profile written for everyone speaks to no one, and it disappears among the many that look exactly the same.
      `,
        [
          q('Which Upwork title best follows the lesson\'s advice?', [
            'Professional Freelancer, Available for Any Work',
            'Hardworking Web Developer',
            'Shopify Developer, Store Setup and Speed Fixes',
            'Expert in Design, Development, Marketing and Writing',
          ], 2, 'A strong title names a specific service and outcome using words clients search for, so the right client recognises the fit instantly.'),
          q('Why should the first lines of the overview focus on the client\'s problem?', [
            'They are the only part shown before a client clicks to read more',
            'Upwork deletes overviews that mention the freelancer',
            'Clients never read titles',
            'It lowers the Upwork service fee',
          ], 0, 'The opening lines appear in search previews, so using them to name the client\'s problem is what earns the click.'),
          q('What should replace phrases like "hardworking" and "excellent communication skills"?', [
            'More adjectives in capital letters',
            'A longer list of personal qualities',
            'Nothing, because they are required phrases',
            'Evidence such as results, client types and how you work',
          ], 3, 'Generic adjectives appear in countless profiles, while specific evidence actually demonstrates the qualities they claim.'),
        ]
      ),
      lesson('Skills, Categories and Specialised Profiles', 12, `
Upwork matches freelancers to jobs and search results using the category you choose and the skills you list. Pick them carelessly and clients looking for exactly your service never see you. Pick them deliberately and Upwork starts showing your profile, and sending invitations, to the right people.

### Choose the most accurate category

When you set up your profile, you choose a category and subcategory that describe your main work. Choose the one where clients looking for your specific service would search, not the broadest one available. A Shopify developer belongs under web development with e-commerce, not under a general design category.

### Skills: relevant, specific and searched

Upwork lets you add a set of skills to your profile, and you add skills to each portfolio project too. Use them for the exact terms your ideal clients search for.

| Service | Strong skill choices | Weak choices |
|---|---|---|
| Shopify development | Shopify, Shopify Theme, Liquid, Ecommerce Website, Page Speed Optimization | Computer Skills, Internet, Microsoft Word |
| Logo design | Logo Design, Brand Identity, Adobe Illustrator, Brand Guidelines | Creativity, Drawing, Hardworking |
| Video editing | Video Editing, Adobe Premiere Pro, YouTube, Short Video Ads | Computer, Movies, Social Media Addict |

The weak choices either describe everyone or describe nothing clients hire for.

### Match skills across your profile

Consistency helps both Upwork and clients understand you. If your title says Shopify, your skills include Shopify, your portfolio shows Shopify stores and your overview talks about Shopify problems, you look like a specialist. If your title says Shopify but your portfolio shows logos and your skills list data entry, you look confused.

### Specialised profiles

Upwork lets you create a small number of **specialised profiles** in addition to your general one. Each can have its own title, overview, rate, skills and portfolio, focused on a different service. When you apply to a job, you choose which profile to send.

They are useful when you genuinely offer two distinct services:

\`\`\`text
General profile:      Web developer for small businesses
Specialised profile:  Shopify developer, store setup and speed fixes
Specialised profile:  WordPress speed optimisation for WooCommerce stores
\`\`\`

Each specialised profile should stand on its own, with relevant portfolio pieces and a rate that matches that market. Do not create specialised profiles for services you cannot yet prove; an empty specialised profile does more harm than none.

### Search is not only keywords

Skills and categories get you into search results, but Upwork also considers your activity and track record: how often you apply, how clients respond, your job success and reviews once you have them. You cannot game your way to the top with keywords alone. The keywords make you findable; good proposals and good work make you rank.

### Review it monthly

Your skills should evolve with your work. Every month, look at the jobs you won and the ones you wanted: which skills did those clients mention? Add the relevant ones, remove the ones that attract the wrong jobs, and keep the profile focused on the work you actually want more of.
      `,
        [
          q('Which skills list suits a Shopify developer\'s profile best?', [
            'Shopify, Shopify Theme, Liquid, Ecommerce Website',
            'Computer Skills, Internet, Microsoft Word, Typing',
            'Creativity, Hardworking, Punctual, Friendly',
            'Logo Design, Data Entry, Translation, Voice Acting',
          ], 0, 'Skills should match the exact terms clients searching for that service use, not general or unrelated abilities.'),
          q('When is a specialised profile worth creating?', [
            'For every skill you are thinking of learning',
            'To copy your general profile under a new name',
            'When you genuinely offer a distinct service with its own proof',
            'Only after you earn Top Rated status',
          ], 2, 'Specialised profiles work when a separate service has its own portfolio and positioning; empty ones weaken your presentation.'),
          q('Why can\'t keywords alone put you at the top of Upwork search?', [
            'Upwork ignores skills completely',
            'Only paid accounts appear in search',
            'Keywords are hidden from clients',
            'Upwork also weighs activity, client responses and your track record',
          ], 3, 'Relevant keywords make you findable, but ranking also reflects how clients respond to you and how well your projects go.'),
        ]
      ),
      lesson('Portfolio, Rate and a Complete Profile', 13, `
A client comparing ten proposals opens each profile and scans it quickly. An incomplete profile, with no photo, an empty portfolio or a missing work history, looks risky before they read a word. Completing every section is one of the few things fully in your control, and it is worth an afternoon.

### The completeness checklist

\`\`\`text
[ ] A clear, friendly photo: your face, good light, plain background
[ ] A specific title, as in the first lesson of this chapter
[ ] An overview that opens with the client's problem
[ ] At least three relevant portfolio projects with descriptions
[ ] Skills that match the title and the portfolio
[ ] Hourly rate set deliberately
[ ] Employment history and education, honestly described
[ ] Languages, with your English level stated honestly
[ ] Certifications that relate to your service, if you have them
[ ] Availability and response time
\`\`\`

### The photo matters more than you think

Clients are hiring a person they cannot meet. A clear photo of your face builds more trust than a logo, a cartoon or a distant holiday picture. It does not need a studio: a phone camera, daylight from a window, a plain wall and a neat shirt are enough.

### Setting your hourly rate

Your profile rate is shown in search results and shapes clients' first impression. Too low looks inexperienced or desperate; too high without reviews looks unjustified. Set it deliberately:

| Stage | Approach |
|---|---|
| No reviews yet | Around the lower-middle of what similar freelancers charge, not the lowest |
| A few good reviews | Raise it, and keep raising it as demand grows |
| Steady invitations | Price for the value you deliver, not for competition |

Remember that Upwork deducts a service fee from your earnings, so the amount you receive is less than the rate clients see. Check the current fee on Upwork's help pages and factor it in.

Chapter 7 covers pricing in depth. For now, avoid the race to the bottom: the lowest rate attracts the most difficult clients and teaches the platform to show you low-budget work.

### Employment history, education and honesty

List relevant experience honestly, including projects for local businesses or your own ventures. A student with genuine portfolio projects and a clear description is more credible than someone claiming ten years of vague experience. Never inflate: clients ask about experience in interviews, and inconsistencies end conversations.

### State your English level truthfully

Communication is a large part of what clients buy. Choose the level that honestly describes your written and spoken English. Overstating it leads to uncomfortable calls and misunderstandings; understating it wastes a strength. If your writing is stronger than your speaking, say so and offer written updates as your main channel.

### The profile video

Upwork lets you add a short introduction video. It is optional, and for many services it helps: a 60-second, natural introduction of who you help and how, filmed on a phone in a quiet room, lets clients hear you and builds trust faster than text. Keep it simple and human; a polished script read nervously is worse than a friendly, slightly imperfect explanation.
      `,
        [
          q('Why does a clear photo of your face matter on a freelance profile?', [
            'Upwork ranks profiles by photo quality alone',
            'Clients are hiring someone they cannot meet, and a real face builds trust',
            'It removes the need for a portfolio',
            'It lowers the service fee for new freelancers',
          ], 1, 'A genuine, clear photo helps a client feel they are dealing with a real person, which reduces the perceived risk of hiring.'),
          q('What is the problem with setting the lowest possible hourly rate?', [
            'Upwork refuses profiles with low rates',
            'Low rates remove you from all search results',
            'It attracts difficult low-budget clients and can signal inexperience',
            'Clients are legally required to pay more',
          ], 2, 'The lowest rates tend to attract clients focused only on price, and they can make a profile look inexperienced rather than good value.'),
          q('Your written English is strong but your spoken English is weaker. What does the lesson recommend?', [
            'Claim native-level English to win more work',
            'Hide your language level entirely',
            'Refuse any client who wants a call',
            'State your level honestly and offer written updates as your main channel',
          ], 3, 'Honest representation avoids misunderstandings, and leading with your stronger written communication plays to your strength.'),
        ]
      ),
      lesson('Verification and Getting Your Profile Approved', 12, `
Before you can work, Upwork needs to know who you are, and in some categories it decides whether to accept your profile at all. Understanding this process, and the rules behind it, avoids weeks of frustration and protects the account you are building.

### Verification steps

Expect to complete several checks, usually over a few days:

- **Email and phone verification**, simple codes sent to you.
- **Identity verification**, with an official ID such as your CNIC or passport, and sometimes a short video call or selfie check.
- **Tax information**. As a freelancer outside the United States, Upwork asks you to complete a tax form stating that you are not a US person.
- **A payment method** for withdrawals, which chapter 10 covers for Pakistan.

Use your real name and details exactly as they appear on your ID. Mismatches are a common reason for delays.

### Why profiles get rejected

Upwork sometimes declines new profiles, especially in categories with many freelancers. It is not personal, and it is often fixable.

| Common reason | What to do |
|---|---|
| The category already has many freelancers | Specialise further and show clearer proof |
| The profile is incomplete | Complete every section from the previous lesson |
| The overview is generic | Rewrite it around a specific client problem |
| No portfolio or weak portfolio | Add three relevant, well-described pieces |
| Details do not match your ID | Correct name and information to match |

If rejected, improve the profile based on this table and resubmit when Upwork allows. Many successful freelancers were rejected at first.

### One person, one account

This rule deserves emphasis because it causes so many problems in Pakistan. Upwork allows each person one freelancer account in their own name. Common schemes break it:

- **Renting or buying someone else's account**, often advertised as "ready accounts with reviews".
- **Working on a relative's account** because it was approved and yours was not.
- **Using a VPN or false details** to appear to be in another country.

All of these violate Upwork's terms. Accounts found doing them are suspended, earnings can be held, and the person often loses the ability to open any account again. A rented account may also be taken back by its owner at any time, along with your money. The short cut is not worth the risk to your livelihood.

### Keep the account healthy from day one

- Log in from your usual devices and location.
- Respond to messages promptly, even to decline politely.
- Keep all communication and payment on the platform, as chapter 9 explains.
- Read Upwork's help pages when unsure, rather than trusting advice from social media groups.

### What happens after approval

Once approved and verified, your profile becomes visible to clients and you can start sending proposals. The next chapter covers exactly how to read job posts and write proposals that win. Keep improving the profile as you learn what clients respond to; approval is the start line, not the finish.
      `,
        [
          q('Why should you use your real name exactly as it appears on your CNIC or passport?', [
            'Upwork displays your full ID number to clients',
            'Mismatched details are a common reason for verification delays',
            'Clients can only pay freelancers with long names',
            'It raises your hourly rate automatically',
          ], 1, 'Identity verification compares your profile with your official document, so matching details avoid delays and problems.'),
          q('What is the risk of working on a rented or borrowed Upwork account?', [
            'It only affects the account\'s colour scheme',
            'There is no risk if the owner agrees',
            'Upwork rewards shared accounts with more invitations',
            'It violates the terms, and the account and earnings can be suspended or lost',
          ], 3, 'Upwork allows one account per person in their own name, so rented or shared accounts risk suspension, held earnings and permanent bans.'),
          q('Your new profile is declined because the category is crowded. What should you do?', [
            'Specialise further, strengthen your proof, and resubmit when allowed',
            'Create a second account under a different name',
            'Use a VPN to appear in another country',
            'Give up on Upwork permanently',
          ], 0, 'Rejections in busy categories are often fixable by narrowing your service and improving your profile before trying again.'),
        ]
      ),
      ],
      [
      q('Which part of an Upwork profile appears in search results?', [
        'Only your full work history',
        'Your ID documents',
        'Your photo, title, rate and the first lines of your overview',
        'Your private messages with clients',
      ], 2, 'Search results show a compact preview, so the title and opening lines of the overview must earn the click.'),
      q('Why should your title, skills, portfolio and overview all point to the same service?', [
        'Upwork charges extra for mixed profiles',
        'It makes the profile shorter',
        'Clients can only read one section',
        'Consistency makes you look like a specialist rather than confused',
      ], 3, 'When every section reinforces one service, clients and the platform both understand clearly what you offer.'),
      q('What should influence where you set your first hourly rate?', [
        'What similar freelancers charge, the Upwork fee, and your lack of reviews',
        'The lowest rate you can find on the platform',
        'A random number that sounds impressive',
        'The rate your friend charges for a different service',
      ], 0, 'A deliberate starting rate considers the market, your current proof and the fee deducted from your earnings.'),
      q('Which of these keeps your Upwork account safe?', [
        'Buying an older account with reviews',
        'Letting a relative use your approved account',
        'Hiding your location with a VPN',
        'One account in your own name, used honestly from your usual location',
      ], 3, 'The platform\'s terms require one genuine account per person, and honest use is what protects your earnings and reputation.'),
      ]
    ),
    chapter(
      'Proposals That Win on Upwork',
      'Read job posts for the signals that matter, write short proposals built around the client\'s problem, spend Connects wisely, and learn from every result.',
      [
      lesson('Reading a Job Post Like a Detective', 13, `
Before you write a single word of a proposal, the job post has already told you most of what you need to know: whether the client is serious, whether they pay, how many people you are competing with, and what they are really worried about. Reading it carefully saves Connects and doubles your hit rate.

### The signals around the post

Upwork shows information about the client beside every job. Learn to read it in ten seconds:

| Signal | What it tells you |
|---|---|
| Payment method verified | The client has set up a way to pay; unverified is a warning sign |
| Total spent and number of hires | Whether they have actually hired freelancers before |
| Hire rate | How often their posts end in a hire |
| Reviews they have left for freelancers | How they treat people and what they value |
| Proposals and interviewing counts | How crowded the job is and whether they are already talking to people |
| Posted time | Early proposals are read more often than late ones |
| Client location and local time | When they are awake to reply, and cultural context |

A client with a verified payment method, a history of hires and kind reviews for past freelancers is worth a careful proposal. A new client with no history is not necessarily bad, since everyone starts somewhere, but pay closer attention to the other signals.

### Reading the description

Read it twice. The first time for what they want, the second time for what they fear. Clients often reveal their worry in one sentence: "my last developer disappeared", "we need this before our launch on the 20th", "please only apply if you have done Shopify speed work". That sentence is where your proposal should start.

Look for **hidden instructions** too. Some clients write "start your proposal with the word Karachi" or "tell me your favourite Shopify app" to filter out copy-pasted proposals. Missing them is an instant rejection.

### Screening questions and attachments

If the post includes questions, answer each one specifically. "See my proposal" or a one-word answer tells the client you did not care enough to reply properly. If the client attached a file, open it; it often contains the real requirements.

### Red flags worth skipping

- The budget is far below any reasonable price for the work described.
- The client asks you to contact them on WhatsApp, Telegram or email before any contract.
- They want a large "free test" or "sample" before hiring.
- The description is vague and the client has a record of posts with no hires.
- They mention paying outside Upwork, cheques, cryptocurrency or "training fees".

Chapter 9 covers scams in detail. For now, remember: a job that feels wrong usually is, and there are always other jobs.

### Decide in two minutes

With practice, reading a post, checking the client and deciding "apply" or "skip" takes two minutes. That speed matters, because the best jobs attract many proposals within hours. A freelancer who reads carefully and applies to fewer, better-matched jobs early will outperform one who sends generic proposals to everything.
      `,
        [
          q('Which combination makes a client most worth a careful proposal?', [
            'Verified payment, a history of hires and kind reviews for freelancers',
            'No payment method, no hires and a very vague description',
            'A request to continue the conversation on WhatsApp immediately',
            'A budget far below the work described and many unfinished posts',
          ], 0, 'Verified payment and a positive hiring history show the client is serious and pays, which makes a detailed proposal a good investment.'),
          q('A job post says "start your proposal with the word Karachi". Why?', [
            'The client only hires freelancers from Karachi',
            'It is a formatting requirement of Upwork',
            'It filters out freelancers who send copy-pasted proposals without reading',
            'The word unlocks a higher budget',
          ], 2, 'Hidden instructions test whether applicants actually read the post, so ignoring them signals a generic proposal.'),
          q('Why read a job description twice?', [
            'Because Upwork hides half the text on the first view',
            'Once for what the client wants, and again for what they are worried about',
            'To count how many words the client used',
            'To find spelling mistakes to point out in the proposal',
          ], 1, 'A client\'s worry, such as a missed deadline or a previous freelancer disappearing, is often the most important thing to address in your opening.'),
        ]
      ),
      lesson('The Structure of a Winning Proposal', 14, `
A client posting a job may receive dozens of proposals. They read the first two lines of each in a list, and open only those that seem to understand their problem. Your proposal is not a CV. It is a short, specific answer to one question: "can this person solve my problem, safely?"

### The structure

\`\`\`text
1. Opening (2 lines): their problem or goal, in their words, and your
   relevant proof in one phrase.
2. Why you: one or two relevant past results, with a link or attachment.
3. How you would approach it: a short plan in 3 or 4 steps.
4. A question: something specific that starts a conversation.
5. Sign-off: your name. Nothing else.
\`\`\`

### An example

For a job titled "Shopify store is slow on mobile, need speed optimisation before our sale":

\`\`\`text
Hi Emma, a slow mobile store right before a sale costs the most sales of
all, so I would start with your product pages, where speed matters most.

Last month I brought a clothing store's mobile load time from about 8
seconds to under 3 by compressing images, removing unused apps and fixing
theme scripts. Before and after report attached.

My plan for your store:
1. A quick audit to find the three biggest slowdowns (day 1)
2. Fix images, apps and scripts on a duplicate theme, so nothing breaks live
3. Test on real phones, then publish before your sale date

Which apps did you install in the last few months? Recently added apps
are often the cause, and knowing this helps me estimate accurately.

Bilal
\`\`\`

It is about 130 words. It names the client, speaks to their worry (the sale), proves relevant experience, shows a safe plan and ends with a question that invites a reply.

### What makes the opening work

The opening lines are your preview. They should show that you read the post and understand the goal. Compare:

| Opening that gets skipped | Opening that gets read |
|---|---|
| "Dear Sir, I read your job and I am very interested." | "Hi Emma, a slow mobile store right before a sale costs the most sales of all..." |
| "I am an expert with 5 years of experience." | "I recently fixed this exact problem for a clothing store." |
| "Please check my profile." | A relevant result, attached |

### Keep it short

Most winning proposals are between 100 and 200 words. Long proposals are skimmed or skipped, and they often bury the one relevant sentence in paragraphs about the freelancer. If you need to explain more, save it for the conversation.

### Personalise every time, but use a system

You should never send an identical proposal twice, but you do not need to start from nothing. Keep a document of strong paragraphs: proof statements for different project types, approach steps for common jobs, good closing questions. Assemble and adapt them for each job. That keeps quality high while letting you write a strong proposal in ten minutes.

### Attach proof, not everything

Attach one or two pieces directly relevant to the job: a before and after, a similar project, a short sample. Ten attachments look like a scattergun. One precise match looks like the answer to their problem.

### End with a real question

A good closing question shows expertise and makes replying easy. "Which apps did you add recently?" or "Is the new logo mainly for signage or social media?" beats "Looking forward to hearing from you". A question the client wants to answer is the start of a conversation, and conversations become contracts.
      `,
        [
          q('What should the first two lines of a proposal do?', [
            'List all your qualifications and years of experience',
            'Ask the client to check your profile',
            'Show you understand the client\'s goal and give relevant proof',
            'Explain your hourly rate and availability',
          ], 2, 'The opening lines appear in the client\'s preview, so they must immediately connect the client\'s problem with your relevant experience.'),
          q('Roughly how long are most winning proposals?', [
            'Around 100 to 200 words',
            'At least 1,000 words, to show effort',
            'One sentence, to save time',
            'As long as the job description plus your CV',
          ], 0, 'Short, specific proposals are read, while long ones get skimmed and often hide the one relevant point.'),
          q('Why end a proposal with a specific question?', [
            'Because Upwork requires every proposal to end with a question mark',
            'To delay giving a price',
            'To make the proposal longer',
            'It shows expertise and gives the client an easy reason to reply',
          ], 3, 'A thoughtful, specific question invites the client into a conversation, which is how proposals turn into contracts.'),
        ]
      ),
      lesson('Connects, Boosts and Choosing Which Jobs to Apply For', 13, `
Every proposal on Upwork costs **Connects**, a platform credit. You receive a small allowance and can buy more. The number needed varies by job, and you can spend extra to **boost** a proposal so it appears higher in the client's list. Because Connects cost money, where you spend them is a business decision, not a reflex.

### How Connects work

- Each job shows how many Connects a proposal requires.
- You can bid additional Connects to boost a proposal; the highest boosts appear near the top of the client's list.
- Proposals sent in reply to a client's invitation generally do not use Connects, which is one more reason invitations are valuable.
- Connect prices and allowances change, so check Upwork's current rules on its help pages.

### Spend on fit, not on hope

The worst use of Connects is applying to everything loosely related to your skills. The best use is applying early to jobs where you are an obvious match. A quick scoring habit helps:

| Question | Score 0 | Score 1 | Score 2 |
|---|---|---|---|
| How well does it match my service and proof? | Barely | Partly | Exactly |
| How strong is the client's history? | New and unverified | Some history | Verified, hires, good reviews |
| Is the budget reasonable for the work? | Far too low | Workable | Good |
| How crowded is it? | 50+ proposals, already interviewing | 20 to 50 | Under 20, recent |

Apply to jobs scoring 6 or more. Skip anything with a zero on fit or budget, however tempting the client. Over a month, this simple habit concentrates your Connects where replies actually come from.

### When to boost

Boosting helps most when the job is an excellent fit and competition is high, because the client may never scroll down to a normal proposal. It helps least on poorly matched jobs, where being seen first does not change the client's decision. Boost selectively, track the results, and stop if boosted proposals do not reply at a clearly better rate.

### Timing matters

Clients often review the first proposals that arrive and start conversations before the rest come in. Check for new jobs a few times a day at times when your target clients are posting, often their morning. Many Pakistani freelancers serving US clients check in the evening Pakistan time, which is morning on the US east coast.

Job alerts and saved searches with your specific keywords do the watching for you, so you can respond within the first hour to the jobs that matter.

### Budget your Connects like money

Decide how many Connects you will spend each week, and treat it like an advertising budget. Track which kinds of jobs produce replies for each Connect spent:

\`\`\`text
Last 4 weeks
Jobs scoring 6+:    18 proposals   5 replies   2 contracts
Jobs scoring 3-5:   22 proposals   1 reply     0 contracts
Conclusion: stop applying below 6; spend those Connects on early, high-fit jobs.
\`\`\`

Numbers like these usually surprise freelancers. Fewer, better proposals win more work at lower cost.
      `,
        [
          q('Which job most deserves your Connects?', [
            'A loosely related job with 80 proposals and an unverified client',
            'Any job, because more proposals always means more contracts',
            'An exact match posted recently by a verified client with a good budget',
            'The job with the lowest Connect cost regardless of fit',
          ], 2, 'Connects produce replies when spent on well-matched jobs from serious clients, early, before competition piles up.'),
          q('When does boosting a proposal help most?', [
            'When the job is an excellent fit and competition is high',
            'When the job barely matches your skills',
            'When you have no portfolio yet',
            'When the client has already hired someone',
          ], 0, 'Boosting improves visibility, which matters when your proposal is strong but might otherwise be buried among many others.'),
          q('Why might a Pakistani freelancer check for US jobs in the evening?', [
            'Upwork only publishes US jobs at night',
            'It is morning on the US east coast, when many clients post jobs',
            'Connects cost less in the evening',
            'Proposals sent at night are automatically boosted',
          ], 1, 'Time zones mean Pakistani evenings overlap with US mornings, when clients post and first review proposals.'),
        ]
      ),
      lesson('Following Up and Learning From Silence', 12, `
Most proposals receive no reply. That is normal for every freelancer, experienced ones included. The difference between those who improve and those who give up is what they do with the silence: guess and complain, or measure and adjust.

### Track every proposal

A simple sheet turns silence into information:

\`\`\`text
Date   | Job type        | Score | Opening used         | Viewed | Reply | Hired
Mar 02 | Shopify speed   | 7     | "slow before a sale" | yes    | yes   | yes
Mar 02 | Shopify theme   | 5     | "custom sections"    | yes    | no    | no
Mar 03 | WordPress fix   | 4     | "WooCommerce errors" | no     | no    | no
Mar 04 | Shopify speed   | 7     | "slow before a sale" | yes    | yes   | no
\`\`\`

Upwork shows whether a client viewed your proposal. That single column separates two very different problems.

### Diagnose with the funnel

| Pattern | Likely problem | What to change |
|---|---|---|
| Few proposals are viewed | Your opening lines, or you apply too late | Stronger openings, apply earlier |
| Viewed but no replies | Proof or plan does not convince | Better matched samples, clearer plan |
| Replies but no hires | Conversation, price or trust | Chapter 7 on pricing, chapter 8 on calls |
| Hires but poor reviews | Delivery or communication | Chapters 8 and 11 |

Fix one stage at a time, starting from the earliest broken one.

### Test one change at a time

Change one thing, such as the opening style, for ten proposals, then compare its reply rate with your previous ten. If you change the opening, the samples and the price all at once, you will never know which one helped. Small, deliberate experiments improve your rate steadily over a couple of months.

### Following up

On Upwork, repeatedly messaging clients who did not reply is not usually possible or welcome. Where a conversation has started and then gone quiet, a single polite follow-up after a few days is fine:

\`\`\`text
Hi Emma, just checking whether you had a chance to review the plan.
If the timing has changed, no problem at all. Happy to help whenever
you are ready.
\`\`\`

Short, friendly and easy to answer. Then let it go. Some clients return weeks later; many simply hired someone else or paused the project.

### Learn from the winners

Your hired proposals are your best teachers. When one wins, save it and note why you think it worked: the opening, the sample, the question, the timing. After a few wins, patterns appear, and your template document from the second lesson should grow from what actually won, not from what you hoped would.

### Silence is not a verdict on you

A client may have hired a friend, changed plans or received a hundred proposals in an hour. Individual rejections tell you little; patterns across twenty proposals tell you a lot. Keep the tracker, trust the numbers, and keep going. Replies rise as your proof, reviews and skill with proposals grow together.
      `,
        [
          q('Many of your proposals are never viewed by the client. What is the likely problem?', [
            'Your prices are too high',
            'Your delivery quality is poor',
            'Weak opening lines, or applying too late after many others',
            'Your follow-up messages are too long',
          ], 2, 'If clients do not even open the proposal, the preview lines or the timing are failing before anything else can be judged.'),
          q('Why change only one thing at a time when improving proposals?', [
            'So you can tell which change actually affected your reply rate',
            'Because Upwork limits edits to one per week',
            'Because clients notice multiple changes',
            'It saves Connects on every proposal',
          ], 0, 'Changing several things together hides which one helped, while single changes compared over a batch reveal what works.'),
          q('A client started a conversation and then went quiet. What is a reasonable follow-up?', [
            'A message every day until they reply',
            'Asking them to switch to WhatsApp',
            'A long message repeating your whole proposal',
            'One short, polite check-in after a few days, then letting it go',
          ], 3, 'A single friendly follow-up respects the client\'s time and leaves the door open, while repeated messages damage your chances.'),
        ]
      ),
      ],
      [
      q('Which is a red flag in a job post?', [
        'The client has a verified payment method',
        'The description mentions a specific deadline',
        'The client asks to continue on Telegram before any contract',
        'The client includes screening questions',
      ], 2, 'Moving conversations off the platform before a contract removes protection and is a common pattern in scams.'),
      q('What is the main purpose of a proposal?', [
        'To list your entire CV',
        'To answer whether you can solve this client\'s problem safely',
        'To negotiate the lowest price quickly',
        'To ask the client for a free trial',
      ], 1, 'A proposal succeeds when it shows understanding of the problem, relevant proof and a safe plan in a short, readable form.'),
      q('How should you decide which jobs to spend Connects on?', [
        'Apply to every job in your category',
        'Only apply to jobs with the most proposals',
        'Score fit, client quality, budget and competition, and apply to strong matches',
        'Only apply to jobs that cost the fewest Connects',
      ], 2, 'Scoring jobs concentrates Connects where replies are likely, which lowers cost per contract and improves results.'),
      q('Your proposals get replies but rarely become contracts. Which part of the process should you work on?', [
        'The opening lines of the proposals',
        'The time of day you apply',
        'The number of Connects you boost with',
        'Your conversations, pricing and the trust you build after replying',
      ], 3, 'When replies come but hires do not, the proposals are working and the later stages of the conversation need improvement.'),
      ]
    ),
    chapter(
      'Fiverr Gigs That Sell',
      'Research demand before creating a gig, write titles and tags buyers find, design packages that guide the choice, and build a gig page that converts.',
      [
      lesson('Researching Gig Demand and Competition', 13, `
On Fiverr, buyers come to you, but only if your gig appears when they search and looks like the best choice when it does. Before creating a gig, spend an hour studying what already exists. It shows you what buyers want, what they pay, and where there is a gap you can fill.

### Search like a buyer

Type the words a buyer would use for your service, such as "shopify store setup" or "youtube video editing", and study the first page of results. Those gigs are what Fiverr believes buyers want, based on how they perform. Open the top ten and take notes:

| What to note | Why it matters |
|---|---|
| Number of reviews on the top gigs | Shows how much demand exists for this service |
| Starting prices and package prices | Shows what buyers are used to paying |
| Delivery times | Shows what speed buyers expect |
| What each package includes | Shows how sellers define the service |
| Gig images and titles | Shows what catches attention in results |
| What reviews praise and complain about | Shows what buyers really care about |

The reviews are the richest part. Complaints such as "took too long to reply" or "did not explain how to edit the site" tell you exactly what to promise and deliver better.

### Look for your angle

Copying the top gig guarantees you look like a weaker version of it. Instead, look for a gap you can own:

- **A niche:** "Shopify store setup for clothing brands" instead of general setup.
- **A platform or tool:** "Canva templates you can edit yourself" or "CapCut editing for Reels".
- **A language:** Urdu voiceovers, Urdu subtitles, or English content for Pakistani businesses.
- **Speed:** a clearly faster delivery for a well-defined small job.
- **Clarity:** packages that are easier to understand than the confusing ones in results.

### Check demand is real

A gap with no buyers is not an opportunity. A useful sign is several gigs in your niche with a healthy number of reviews, meaning people buy it, but not so many established sellers that a newcomer cannot be seen. Very broad searches such as "logo design" have enormous demand and overwhelming competition; narrower searches such as "restaurant menu design" may have less demand but a better chance for a new gig.

### Write it down

\`\`\`text
Search:          restaurant menu design
Top gig reviews: 150 to 900 across the top ten
Price range:     basic packages from low to medium; premium includes print files
Common delivery: 2 to 3 days
Complaints:      slow replies, food photos not included, no Urdu version
My angle:        bilingual English and Urdu menus for Pakistani restaurants,
                 print-ready and editable, delivered in 2 days
\`\`\`

That note becomes the foundation of your gig: the title, the packages and the description all grow from the angle you found.

### Research again later

Markets move. Revisit the search every couple of months to see new competitors, changing prices and new complaints. The gig that ranks in a year is usually one that kept adapting to what buyers were saying.
      `,
        [
          q('Which part of competing gigs is richest for research?', [
            'The sellers\' profile photos',
            'The reviews, especially what buyers praise and complain about',
            'The number of words in each gig title',
            'The colour schemes of the gig images',
          ], 1, 'Reviews reveal what buyers value and what frustrated them, which tells you exactly what to promise and deliver better.'),
          q('Why is copying the top gig a weak strategy?', [
            'Fiverr allows only one gig per service',
            'Top gigs are hidden from new sellers',
            'You end up looking like a weaker version of an established seller',
            'Buyers are not allowed to compare gigs',
          ], 2, 'An established gig with many reviews wins a direct comparison, so a new seller needs a distinct angle instead.'),
          q('What suggests a niche is a real opportunity for a new gig?', [
            'No gigs exist at all and nobody searches for it',
            'Thousands of sellers with enormous review counts',
            'It is a service you have never tried',
            'Several gigs with healthy reviews but not too many dominant sellers',
          ], 3, 'Existing reviews prove buyers pay for it, while moderate competition means a new, well-positioned gig can still be seen.'),
        ]
      ),
      lesson('Titles, Tags and Search on Fiverr', 13, `
Fiverr's search decides which gigs a buyer sees first, and your title, category and tags decide whether yours is even considered. Getting them right does not guarantee sales, but getting them wrong guarantees nobody finds you.

### The title

Fiverr gig titles start with "I will", followed by the service. Write it the way a buyer would describe what they want, with your main keyword near the start:

| Weak title | Strong title |
|---|---|
| I will do amazing design work for you | I will design a bilingual restaurant menu in English and Urdu |
| I will be your best video editor | I will edit engaging YouTube videos with captions and b-roll |
| I will do all website work | I will fix and speed up your slow Shopify store |
| I will do data entry | I will clean and organise messy Excel and Google Sheets data |

A strong title reads naturally, contains the words buyers search, and tells the buyer exactly what they will get. Stuffing it with keywords, such as "shopify store shopify website shopify developer", reads badly and converts worse.

### Category and service details

Choose the most accurate category and subcategory, then fill in the service details Fiverr offers for it, such as the platform, the style or the file formats. Buyers filter by these details, so a Shopify gig left without the Shopify detail may be filtered out of the very searches you want.

### Tags

Fiverr lets you add a small number of search tags to each gig. Use the specific phrases buyers type:

\`\`\`text
Gig: I will fix and speed up your slow Shopify store
Tags: shopify speed, shopify optimization, page speed, shopify expert, store fix
\`\`\`

Avoid wasting tags on words already in your title or on vague words like "professional" and "best".

### What moves a gig up

Fiverr does not publish its ranking formula, and anyone who claims to know it exactly is guessing. What is widely observed, and what Fiverr itself encourages, is that gigs rise when buyers respond well to them and sellers perform reliably:

- **Buyers click and order** after seeing the gig in search.
- **Orders are delivered on time** and not cancelled.
- **Reviews are good.**
- **Messages are answered quickly.**

That is why the next two lessons, packages and the gig page itself, matter as much as keywords. Keywords get you seen; the gig and your service get you chosen and keep you visible.

### Be available

Fiverr shows buyers how quickly sellers respond, and slow replies cost orders. In your first months, reply to messages within hours, ideally faster. Set up the mobile app and quick-response templates for common questions. Many first orders come from a buyer who messaged three sellers and bought from the one who answered first with a clear, helpful reply.

### Give a new gig time

A new gig rarely sells on day one. Share it with your network, keep improving the title and images based on how often it is viewed and clicked, and focus on delivering the first few orders perfectly. Early reviews change everything that follows.
      `,
        [
          q('Which Fiverr gig title follows the lesson\'s advice?', [
            'I will do amazing design work for you',
            'I will design a bilingual restaurant menu in English and Urdu',
            'I will shopify store shopify website shopify developer',
            'I will be the best freelancer you ever hired',
          ], 1, 'A strong title reads naturally, uses words buyers search for and says exactly what they will receive.'),
          q('Why fill in the service details for your category?', [
            'They replace the need for a gig description',
            'Buyers filter searches by them, so missing details can hide your gig',
            'They increase the price buyers must pay',
            'Fiverr charges less commission when they are filled in',
          ], 1, 'Buyers narrow results with these details, and a gig without the matching detail may be excluded from relevant searches.'),
          q('What most helps a gig stay visible once people find it?', [
            'Changing the title every day',
            'Adding as many keywords as possible to the title',
            'Offering the lowest price in the category',
            'Buyers ordering, on-time delivery, good reviews and fast replies',
          ], 3, 'Keywords get a gig seen, but buyer response and reliable performance are what keep it showing up in search.'),
        ]
      ),
      lesson('Packages, Pricing Tiers and Extras', 13, `
Fiverr gigs can offer up to three packages, usually labelled Basic, Standard and Premium. Well-designed packages do more than list prices: they guide buyers towards the choice that suits them and you, and they answer questions before the buyer has to ask.

### Design the three tiers

Each package should have clear deliverables, a number of revisions and a delivery time. Here is an example for restaurant menu design:

| | Basic | Standard | Premium |
|---|---|---|---|
| Menu pages | 1 page, English | 2 pages, English and Urdu | Up to 4 pages, English and Urdu |
| Design concepts | 1 | 2 | 3 |
| Revisions | 2 | 3 | 5 |
| Print-ready PDF | Yes | Yes | Yes |
| Editable source file | No | Yes | Yes |
| Social media version | No | No | Yes |
| Delivery | 3 days | 3 days | 4 days |

Notice what the table does. Basic is useful but limited. Premium is complete. Standard sits in the middle with the features most restaurants actually need, bilingual text and an editable file, which makes it the natural choice.

### Why the middle package matters

Many buyers avoid both the cheapest and the most expensive option. A strong Standard package with clearly better value than Basic, and a Premium that makes Standard look reasonable, steers most buyers to the middle. Design Standard around what your typical client truly needs, and price it where you are happy to sell it all day.

### Price for what you actually receive

Fiverr keeps a share of every order, which at the time of writing is 20 percent, including tips; check Fiverr's current terms. That means a package priced at 50 dollars pays you 40 before any withdrawal costs. Set prices with the amount you receive in mind, not the amount the buyer pays.

### Extras that add value

Gig extras let buyers add options to any package:

- **Faster delivery** for buyers with a deadline.
- **Additional revisions** for buyers who want reassurance.
- **Source files** where they are not already included.
- **Extra pages, minutes or items** for larger jobs.

Extras raise the average order value without making the base packages confusing. Offer a few useful ones, not a long list.

### Define revisions carefully

"Unlimited revisions" sounds generous and invites endless changes that eat your profit and patience. Offer a clear number, and describe what a revision means: changes to the agreed design, not a completely new design. Clear limits protect you and, surprisingly, make buyers more confident, because they signal a professional process.

### Start reasonably, raise steadily

New gigs often start a little below established competitors to win the first reviews, then raise prices as reviews and demand grow. Raise gradually and watch whether orders continue. If you are busy all the time, your prices are too low. If orders stop after a raise, adjust the packages or the value you communicate before dropping the price back.
      `,
        [
          q('Why is the Standard package often the most important one to design well?', [
            'Fiverr only shows the Standard package to buyers',
            'Many buyers choose the middle option, so it should fit what most clients need',
            'It is the only package that can have extras',
            'Standard packages pay no commission',
          ], 1, 'Buyers often avoid extremes, so a middle package built around typical needs becomes the natural and most common choice.'),
          q('A package is priced at 50 dollars, and the platform keeps 20 percent. What do you receive before withdrawal costs?', [
            '50 dollars',
            '45 dollars',
            '40 dollars',
            '30 dollars',
          ], 2, 'Twenty percent of 50 dollars is 10 dollars, so the seller receives 40 dollars before any withdrawal fees.'),
          q('Why avoid offering unlimited revisions?', [
            'Fiverr forbids more than five revisions',
            'Buyers never ask for revisions',
            'It makes the gig rank lower in search',
            'It invites endless changes that consume your time and profit',
          ], 3, 'A clear, defined revision limit keeps projects manageable and signals a professional process to buyers.'),
        ]
      ),
      lesson('Gig Images, Video and a Description That Converts', 13, `
In search results, a buyer sees your gig image, title, rating and starting price. The image does most of the work of earning a click. Once they click, the gallery, video and description must convince them to order, or at least to message you.

### The gig image

The first gig image appears in search results, so design it for a small thumbnail on a phone:

- **Show the result**, such as the finished menu on a table or the fast store on a phone screen, rather than a generic stock photo.
- **Use a few large words**, the service name or a key benefit, readable at thumbnail size.
- **Keep it clean**: one idea, strong contrast, no clutter.
- **Be honest**: show your own work, never someone else's or an unrealistic promise.

Fiverr publishes recommended image dimensions for gig images; use them so your image is not cropped awkwardly. Add two or three more images to the gallery showing different examples or a before and after.

### A short video

A gig video lets buyers see and hear you. A simple 30 to 60 second video works well: introduce yourself, show two or three examples of your work, and explain what the buyer receives and how quickly. Film it on a phone in a quiet room with good light. Real and clear beats polished and stiff.

### The description

Structure the description so a buyer can scan it in seconds:

\`\`\`text
Is your restaurant menu hard to read, outdated or only in one language?

I design clear, attractive menus in English and Urdu that customers
actually read, ready for printing and easy to update.

What you get:
- A custom menu design matched to your restaurant's style
- English, Urdu or both, with correct Urdu typography
- Print-ready PDF, plus an editable file in Standard and Premium

How it works:
1. You send your menu items, prices, logo and any photos
2. I deliver concepts within the package time
3. You choose one, request changes, and receive final files

Why me: I have designed menus for cafés and restaurants in Lahore and
Islamabad (see gallery). I reply to messages within a few hours.

Message me before ordering if you are not sure which package fits.
\`\`\`

It opens with the buyer's problem, lists concrete deliverables, explains the process and ends with an easy next step.

### Requirements and FAQ

Fiverr lets you set **requirements**, questions the buyer answers when they order, such as "please send your menu items and prices" or "share your logo file". Good requirements prevent delays at the start of every order.

The gig **FAQ** section answers common questions before buyers ask: "Can you design a menu with food photos?", "Do you print the menu?", "Can I edit it later?". Each good FAQ answer removes one reason a buyer might hesitate.

### Keep improving

Fiverr shows analytics for each gig: impressions, clicks and orders. If a gig gets impressions but few clicks, improve the image and title. If it gets clicks but few orders, improve the packages, gallery and description. Change one thing at a time and give it a week or two before judging, exactly as you would test Upwork proposals.
      `,
        [
          q('What should the first gig image do?', [
            'Show the result clearly with a few large words readable on a phone',
            'Show a long paragraph explaining your whole service',
            'Use a famous brand\'s logo to attract attention',
            'Display your full price list in small text',
          ], 0, 'The first image appears as a small thumbnail in search, so it must communicate the service and result at a glance.'),
          q('What are gig requirements used for?', [
            'To list the tools you use',
            'To set the buyer\'s budget automatically',
            'To collect what you need from the buyer when they order, preventing delays',
            'To hide the gig from certain countries',
          ], 2, 'Requirements ask buyers for the information and files you need at the start, so orders do not stall waiting for them.'),
          q('A gig gets many impressions but few clicks. What should you improve first?', [
            'The delivery time of the Premium package',
            'The FAQ section',
            'The requirements questions',
            'The gig image and title',
          ], 3, 'Impressions without clicks mean the search preview is not persuading buyers, which is controlled by the image and title.'),
        ]
      ),
      ],
      [
      q('What is the best starting point before creating a Fiverr gig?', [
        'Choosing the lowest price in the category',
        'Copying the best-selling gig exactly',
        'Researching existing gigs, their reviews and gaps you could fill',
        'Creating ten gigs at once to see which sells',
      ], 2, 'Research shows what buyers want, what they pay and where a new seller can stand out, which shapes the whole gig.'),
      q('How should a Fiverr gig title be written?', [
        'Naturally, starting "I will", with the words buyers actually search for',
        'As a list of repeated keywords',
        'With as many adjectives as possible',
        'In capital letters to stand out',
      ], 0, 'A natural title with relevant search terms is both findable and persuasive, while keyword stuffing reads badly.'),
      q('Why include extras such as faster delivery or source files?', [
        'They are required for every Fiverr gig',
        'They raise the average order value without complicating the base packages',
        'They reduce Fiverr\'s commission',
        'They improve the gig\'s search ranking directly',
      ], 1, 'Extras let buyers who need more pay for it, increasing earnings while keeping the three main packages simple.'),
      q('A gig gets clicks but few orders. What should you work on?', [
        'Only the search tags',
        'Only the category choice',
        'Nothing, because clicks are enough',
        'The packages, gallery and description on the gig page',
      ], 3, 'Clicks mean the preview works, so the gig page itself is where buyers are deciding not to order.'),
      ]
    ),
    chapter(
      'LinkedIn as a Client Magnet',
      'Build a LinkedIn profile that explains your service in seconds, post content that attracts clients, reach out without spamming, and turn chats into calls.',
      [
      lesson('A Profile That Says What You Do in Five Seconds', 13, `
On LinkedIn, potential clients find you through a post, a comment or a search, click your name and decide within seconds whether you are relevant. Most freelancers' profiles fail that test because the headline says "Student" or "Aspiring Developer" and nothing about how they help anyone.

### The sections that matter most

| Section | What to put there |
|---|---|
| Photo | A clear, friendly photo of your face |
| Banner | A simple image stating your service and who it is for |
| Headline | Who you help and the result you deliver |
| About | The problem you solve, how, proof, and how to contact you |
| Featured | Your best case studies, portfolio link and a way to book a call |
| Experience | Your freelance business as a real position, with results |
| Recommendations | Short testimonials from clients or colleagues |

### The headline

The headline appears beside your name everywhere: in posts, comments, search and messages. It is your most-read sentence.

\`\`\`text
Weak:    Freelancer | Hardworking | Web Developer | Student at NUST
Strong:  I help clothing brands build fast Shopify stores that sell more on mobile
Strong:  YouTube video editor for coaches and educators | Retention-focused edits
\`\`\`

A strong headline lets the right client think "that is exactly what I need" before they read anything else.

### The About section

Write it like the Upwork overview from chapter 3, in the first person and in plain language:

\`\`\`text
Most small clothing brands lose sales because their store is slow or
confusing on a phone.

I build and fix Shopify stores so they load fast and make buying easy.
Recent work:
- Cut a Lahore brand's mobile load time from about 8 seconds to under 3
- Set up a new store for a UK-based modest fashion label in two weeks

I work with brands in Pakistan, the UK and the Gulf, with clear
milestones and updates every two days.

If your store feels slow or is not converting, send me a message with
your store link.
\`\`\`

### Featured and experience

The **Featured** section sits high on your profile and can hold links, posts and documents. Pin your strongest case study, your portfolio and, if you use one, a link to book a call. Clients who are interested will click there first.

In **Experience**, list your freelance work as a real position, for example "Shopify Developer, Self-employed", with two or three concrete results. It shows you treat freelancing as a business, not a hobby between jobs.

### Keep it consistent

Your LinkedIn, Upwork and Fiverr profiles should tell the same story: the same service, the same kind of client, the same proof. A client who finds you on LinkedIn and then checks your Upwork reviews should see one consistent professional, which is itself a strong trust signal.

### The five-second test

Ask a friend to look at your profile for five seconds, close it, and tell you what you do and for whom. If they cannot, your headline and banner need rewriting. If they can, your profile is ready to support everything that follows.
      `,
        [
          q('Which LinkedIn headline best follows the lesson\'s advice?', [
            'Freelancer | Hardworking | Student',
            'Aspiring professional open to opportunities',
            'I help clothing brands build fast Shopify stores that sell more on mobile',
            'Web developer, designer, marketer, writer and editor',
          ], 2, 'A strong headline states who you help and the result, so the right client recognises the fit immediately.'),
          q('What should go in the Featured section?', [
            'A list of every course you have ever taken',
            'Personal holiday photos',
            'Your full employment contract',
            'Your best case studies, portfolio and a way to book a call',
          ], 3, 'Featured sits high on the profile, so it should hold the proof and next step an interested client looks for.'),
          q('Why keep LinkedIn, Upwork and Fiverr profiles consistent?', [
            'LinkedIn deletes profiles that differ from Upwork',
            'It lowers the fees on all platforms',
            'A client checking several profiles sees one trustworthy professional',
            'Consistency is required to send connection requests',
          ], 2, 'Clients often check more than one profile, and a consistent story across them builds trust instead of raising doubts.'),
        ]
      ),
      lesson('Posting Content That Attracts Clients', 13, `
Your profile is where clients decide; your posts are how they find you in the first place. Consistent, useful posts put you in front of potential clients and the people who refer them, week after week, without you sending a single cold message.

### What to post

The best freelancer content shows clients that you understand their problems and can solve them:

| Post type | Example |
|---|---|
| Case study story | How you fixed a slow store before a big sale |
| Before and after | A menu redesign, a cleaned spreadsheet, an edited video clip |
| A lesson learned | "Three things I check first on every slow Shopify store" |
| A client's common mistake | "Why your WhatsApp orders keep getting lost" |
| Behind the scenes | How you plan a project in the first hour |
| An honest opinion | When a client does not need a new website at all |

Notice that almost everything is about the client's world, not about you being available for work.

### Anatomy of a strong post

\`\`\`text
A clothing brand lost most of its Eid sale traffic in one afternoon.

The store was not down. It was just slow: 9 seconds to load on a phone,
and most visitors gave up before seeing a single product.

What we changed in two days:
1. Compressed 400 product images
2. Removed four apps nobody used anymore
3. Moved a heavy review widget below the product details

Load time on mobile: under 3 seconds.

If your store feels slow, check the apps you installed last. That is
where I find the problem most often.
\`\`\`

The first line is the hook: it appears before "see more", so it must earn the click. The body is short lines and white space, easy to read on a phone. The end gives useful advice, not a sales pitch.

### Consistency beats brilliance

Two or three posts a week for six months will do far more than one viral post. Keep a list of ideas from your real work, and turn each project into two or three posts: the problem, the process, the result. You will never run out, because every project teaches something.

### Engage with others

LinkedIn rewards conversation. Comment thoughtfully on posts by potential clients and people in your industry, adding a real opinion or experience rather than "Great post!". A good comment on a popular post can bring more profile views than your own post.

### What to avoid

- **Engagement bait**, such as "comment YES for the free guide", which attracts the wrong audience.
- **Constant selling**, where every post says "DM me for services".
- **Copying others' posts**, which people notice.
- **Inventing results**, which destroys the trust your content is building.

### Measure what matters

Likes are pleasant but not the goal. Watch the numbers that lead to clients: profile views from people in your target industry, connection requests from potential clients, and direct messages asking about your work. When a post brings a message from a real prospect, note what the post was about and make more like it.
      `,
        [
          q('What is the main job of a post\'s first line?', [
            'To list your services and prices',
            'To hook readers so they click to read the rest',
            'To tag as many people as possible',
            'To include your contact details',
          ], 1, 'The first line shows before "see more", so it must make the reader want to continue.'),
          q('Which posting approach builds a client pipeline most reliably?', [
            'Two or three useful posts a week, consistently, for months',
            'One post a year that you hope will go viral',
            'Daily posts that only say you are available for work',
            'Posting only when you urgently need a client',
          ], 0, 'Steady, useful content keeps you visible to potential clients over time, which matters far more than a single popular post.'),
          q('Which number best shows your LinkedIn content is working for your business?', [
            'The total number of likes on your posts',
            'How many emojis your posts contain',
            'The number of hashtags used',
            'Messages from potential clients asking about your work',
          ], 3, 'Likes feel good, but enquiries from prospects are the result that actually leads to paid work.'),
        ]
      ),
      lesson('Outreach Without Spam', 13, `
Posting brings clients to you over time. Outreach lets you start conversations with specific businesses now. Done badly, it is spam that damages your reputation and can get your account restricted. Done well, it is simply introducing yourself to someone you can genuinely help.

### The spam everyone ignores

Everyone on LinkedIn has received this within minutes of accepting a connection:

\`\`\`text
Hi, thanks for connecting! I am a professional web developer with 5 years
of experience. I offer website design, SEO, logo design and more at
affordable prices. Let me know if you need any services!
\`\`\`

It is about the sender, it could be sent to anyone, and it asks for work before any relationship exists. It gets ignored or reported.

### A better sequence

1. **Choose people deliberately.** Businesses in your niche that visibly have the problem you solve: a clothing brand whose store loads slowly, a coach whose videos are unedited.
2. **Engage first.** Follow them and leave a genuine comment on a post or two. They start to recognise your name.
3. **Connect with a short, personal note, or none.** Never pitch in the connection request.
4. **Start a conversation about them.** When you message, lead with something specific and useful.

\`\`\`text
Hi Sara, I enjoyed your post about launching the summer collection.

I had a quick look at the store on my phone and the product pages took
a while to load. Often that comes down to large images or leftover apps,
which is quick to fix.

Happy to send you three specific things I noticed, no strings attached,
if that would be useful.
\`\`\`

This message is about her business, shows you looked, offers real value and asks permission rather than pushing a sale.

### Spam versus outreach

| Spam | Good outreach |
|---|---|
| Sent to everyone | Sent to a few chosen, relevant people |
| Pitches immediately | Starts with something about them |
| Lists all your services | Mentions one specific, relevant observation |
| Asks for work | Offers useful value first |
| Follows up daily | Follows up once, politely |

### Respect the limits

LinkedIn limits how many invitations you can send and may restrict accounts whose invitations are often ignored or reported. Automation tools that send hundreds of messages for you risk exactly that. Ten thoughtful, personal messages a week are worth more than five hundred automated ones, and they keep your account safe.

### Follow up once

If someone does not reply, one friendly follow-up after a week is reasonable. After that, let it go and keep engaging with their posts. Many clients reply months later, when the problem becomes urgent, because they remember the freelancer who was helpful rather than pushy.

### Track your outreach

Keep a simple list of who you contacted, when, what you offered and what happened. After a month, you will see which kinds of businesses respond and which messages work, and you can focus your effort where it pays.
      `,
        [
          q('What should you avoid putting in a LinkedIn connection request?', [
            'A short, personal note',
            'Nothing at all',
            'A pitch for your services',
            'A mention of a post you enjoyed',
          ], 2, 'Pitching before any relationship exists reads as spam, while a brief personal note or no note keeps the connection welcome.'),
          q('Which outreach message is most likely to get a reply?', [
            'A list of all your services and your rates',
            'A copied message sent to hundreds of people',
            'A request for the person to send you work',
            'A specific observation about their business with an offer of free, useful advice',
          ], 3, 'Messages about the recipient that offer genuine value first build interest and trust, unlike generic pitches.'),
          q('Why avoid tools that send hundreds of automated messages?', [
            'They risk account restrictions and produce far fewer real conversations',
            'LinkedIn charges a fee for every automated message',
            'Automated messages cannot include links',
            'They only work on weekends',
          ], 0, 'Mass automated outreach gets ignored and reported, which can restrict the account, while a few personal messages start real conversations.'),
        ]
      ),
      lesson('Turning Conversations Into Calls', 12, `
A LinkedIn conversation becomes business when it becomes a call, and a call becomes business when it ends with a clear next step. Unlike Upwork and Fiverr, LinkedIn gives you no built-in contracts or payment protection, so this stage is also where you set the terms that protect you.

### Suggest the call at the right moment

When a prospect shows real interest, such as asking about price or timing, suggest a short call with a clear purpose:

\`\`\`text
Happy to help with this. Would a 20-minute call this week be useful?
I would like to understand how orders reach you now, and I can then
suggest a plan and a price. Here are two times that work for me in
your time zone: Tuesday 3 pm or Wednesday 11 am (UK time).
\`\`\`

A specific length, a clear purpose and concrete times make it easy to say yes. Always propose times in the client's time zone.

### Prepare, even for a short call

Before the call, look at their website and social media, note two or three observations, and prepare your discovery questions from chapter 8. Clients remember the freelancer who arrived already understanding their business.

### A simple agenda

\`\`\`text
1. Their goal and the problem today (most of the call)
2. What they have tried, and what did not work
3. Timeline, budget range and who decides
4. A rough outline of how you would approach it
5. Next step: "I will send a short proposal by tomorrow evening"
\`\`\`

Listen far more than you talk. The client should do most of the speaking in the first half.

### After the call

Within a day, send a short written summary and proposal: what you understood, what you will deliver, timeline, price and how payment works. The summary alone impresses many clients, because few freelancers bother.

### Protect yourself off-platform

Work from LinkedIn usually happens outside the freelance marketplaces, so you must create the protection yourself:

| Protection | How |
|---|---|
| A written agreement | A short document or email both sides confirm: scope, price, timeline, revisions |
| A deposit | Part of the fee paid before work starts, commonly a third to a half |
| Milestones | Deliver and get paid in stages for larger projects |
| Clear ownership | Final files handed over after final payment |
| A traceable payment method | Bank transfer or a reputable payment service, never vague promises |

Chapter 9 covers contracts and scams in detail. The principle is simple: never do large amounts of work for a new client with nothing agreed in writing and nothing paid in advance.

### Close the loop

If the client says no, thank them, ask what would have made it a yes, and stay connected. Today's "not now" often becomes next quarter's project, especially when the client keeps seeing your useful posts in their feed.
      `,
        [
          q('What makes an invitation to a call easy to accept?', [
            'Asking the client to suggest any time they like',
            'A clear purpose, a set length and specific times in the client\'s time zone',
            'Insisting on a one-hour call to show commitment',
            'Scheduling the call without asking',
          ], 1, 'A short call with a stated purpose and concrete options in their time zone removes friction from saying yes.'),
          q('What should happen within a day after a discovery call?', [
            'Nothing until the client contacts you again',
            'Starting the work immediately without agreement',
            'Sending your full CV and certificates',
            'A written summary of what you understood and a proposal',
          ], 3, 'A prompt written summary and proposal shows professionalism and turns the conversation into a clear, reviewable offer.'),
          q('A new client from LinkedIn wants a large project. What protects you best?', [
            'Starting immediately to impress them',
            'Waiting until the end to discuss payment',
            'A written agreement, a deposit and milestone payments',
            'A verbal promise on the call',
          ], 2, 'Without platform protection, written terms, an upfront deposit and staged payments are what protect your time and income.'),
        ]
      ),
      ],
      [
      q('Why is a strong LinkedIn headline so important?', [
        'It is the only part of the profile clients can see',
        'It appears beside your name everywhere and is your most-read sentence',
        'It controls how many connections you can have',
        'It sets your hourly rate',
      ], 1, 'The headline shows in posts, comments, search and messages, so it tells people what you do before they visit your profile.'),
      q('What should most of your LinkedIn posts focus on?', [
        'Announcing that you are available for work',
        'Copying popular posts from other freelancers',
        'Asking people to comment for a free guide',
        'Your clients\' problems and how they are solved',
      ], 3, 'Content about the client\'s world shows understanding and expertise, which attracts the right people far better than constant selling.'),
      q('What is the right first step when reaching out to a potential client?', [
        'Engaging genuinely with their posts before messaging',
        'Sending a full proposal in the connection request',
        'Messaging them daily until they reply',
        'Sending the same message to hundreds of profiles',
      ], 0, 'Engaging first builds familiarity, so a later personal message is welcome rather than feeling like spam.'),
      q('What is different about clients from LinkedIn compared with Upwork or Fiverr?', [
        'They never pay for work',
        'They must be paid through Fiverr',
        'There is no built-in contract or payment protection, so you set terms yourself',
        'They cannot have calls with freelancers',
      ], 2, 'LinkedIn is not a marketplace, so written agreements, deposits and milestones must replace the protection platforms provide.'),
      ]
    ),
    chapter(
      'Pricing With Confidence',
      'Choose between hourly, fixed and value pricing, calculate the minimum you can accept, raise rates without losing clients, and negotiate on scope instead of price.',
      [
      lesson('Hourly, Fixed and Value Pricing', 13, `
Two freelancers do identical work for identical clients. One earns twice as much, not because she is faster, but because she chose the right pricing model for each job. How you charge changes who carries the risk, what you are rewarded for, and how clients perceive you.

### The three models

| | Hourly | Fixed price | Value-based |
|---|---|---|---|
| You are paid for | Time spent | A defined deliverable | The result for the client's business |
| Who carries the risk of overruns | The client | You | Shared, but mostly you |
| Best when | Scope is unclear or ongoing | Scope is clear and repeatable | The business impact is measurable and large |
| Rewards you for | Working more hours | Working efficiently | Understanding the business |
| Main danger | Clients watch the clock | Scope creep eats your profit | Needs strong trust and proof |

### Hourly: fair when the work is uncertain

When a client says "our site has several bugs and we are not sure what is causing them", nobody can estimate honestly. Hourly pricing is fair to both sides: you are paid for the investigation, and the client only pays for what is needed. On Upwork, hourly contracts come with time tracking that also protects you, which chapter 9 explains.

The weakness is that it punishes skill. As you get faster, you earn less for the same result, and clients may question every hour.

### Fixed price: rewarding efficiency

For clearly defined work, such as "a three-page website with a contact form" or "a 60-second video edit", a fixed price is simpler for clients and better for experienced freelancers. If you finish faster because you have done it twenty times, you keep the benefit.

The weakness is scope. If the definition is vague, the project grows while the price does not. Fixed pricing only works with a clear written scope and a defined number of revisions.

### Value-based: pricing the outcome

Value pricing asks what the result is worth to the client. A speed fix that saves an online store's sales during its biggest week may be worth far more to the owner than the hours it took you. Value pricing is powerful, but it requires understanding the client's business, having proof you can deliver, and a client who thinks in business results.

### One job, three prices

A clothing brand wants its Shopify store sped up before Eid:

\`\`\`text
Hourly:  about 10 hours of work at your hourly rate
Fixed:   a set price for "audit, fixes on a duplicate theme, testing,
         publish", based on your usual time plus a buffer
Value:   the brand expects its Eid week to be its biggest of the year;
         a price reflecting that the fix protects those sales
\`\`\`

Early on, most freelancers use hourly and fixed pricing. As you build proof and understand clients' businesses, look for the projects where the value is clearly large and you can price accordingly.

### Choosing in practice

Ask two questions. Can the scope be defined clearly? If not, choose hourly. Is the result's business value large and visible? If so, consider value pricing. Otherwise, a fixed price with a tight scope is usually best for both sides.
      `,
        [
          q('A client\'s website has several bugs and nobody knows the cause yet. Which pricing model is fairest?', [
            'Hourly, because the scope cannot be estimated honestly',
            'Fixed price, because it is always simpler',
            'Value-based, because bugs are always valuable to fix',
            'Free, because the cause is unknown',
          ], 0, 'When the work is uncertain, hourly pricing pays you for investigation while the client only pays for what is actually needed.'),
          q('What is the main risk of fixed-price work?', [
            'Clients refuse to pay fixed prices',
            'Platforms charge double fees on fixed-price contracts',
            'Scope creep can grow the work while the price stays the same',
            'You earn less when you work efficiently',
          ], 2, 'With a fixed price, extra requests reduce your effective rate, so fixed pricing needs a clear written scope and revision limit.'),
          q('What does value-based pricing require to work well?', [
            'The lowest price in the market',
            'A client who has never hired a freelancer',
            'Charging by the minute',
            'Understanding the client\'s business, proof you can deliver, and a measurable result',
          ], 3, 'Value pricing depends on a credible link between your work and a significant business outcome that the client recognises.'),
        ]
      ),
      lesson('Calculating Your Minimum Rate', 14, `
Many freelancers set rates by copying competitors or guessing what clients will accept. Then, months later, they realise they are working full weeks and still cannot cover their costs. Before accepting any price, you should know the lowest rate that actually sustains your life and business. That number is your floor.

### Start from what you need, not what others charge

The calculation has five parts: what you need to live on, what your work costs to run, a buffer for tax and savings, platform fees, and the hours you can really bill.

### Billable hours are fewer than you think

A full working month has roughly 160 hours, but you cannot bill them all. Writing proposals, replying to messages, learning, invoicing, revisions the client does not pay for, and slow weeks all take time. Many freelancers can realistically bill somewhere between half and two thirds of their working hours. Use a conservative figure; overestimating billable hours is the most common reason rates end up too low.

### A worked example

Every figure below is an example. Replace them with your own, and use today's exchange rate:

\`\`\`text
Personal income you need each month        PKR 150,000
Business costs (internet, electricity and
  backup power, software, a laptop fund)   PKR  30,000
Subtotal                                   PKR 180,000
Tax and savings buffer, 15%                PKR  27,000
Needed after fees                          PKR 207,000
Gross before a 10% platform fee
  (207,000 ÷ 0.90)                         PKR 230,000
Billable hours per month                   90
Minimum hourly rate                        PKR 2,556
At an example rate of PKR 280 per dollar   about USD 9.13
\`\`\`

Round up. In this example, anything below about 9 or 10 dollars an hour means working at a loss for the life you planned, however busy you are.

### The floor is not the price

Your minimum rate is the point below which you should not work, except for a deliberate, short-term reason such as winning your very first reviews. Your actual price should be higher, based on the market for your service and the value you deliver. Knowing the floor simply gives you the confidence to say no to offers that would quietly hurt you.

### Convert it for fixed-price work

For fixed-price projects, estimate the hours honestly, add a buffer for revisions and surprises, and multiply by your rate:

| Step | Example |
|---|---|
| Estimated hours | 12 |
| Buffer for revisions and surprises (25%) | 3 |
| Total hours | 15 |
| Your hourly rate | USD 12 |
| Fixed price | USD 180 |

If the buffer is not needed, you have earned a better effective rate. If the project runs over, the buffer absorbs it instead of your profit.

### Revisit it every six months

Costs change: electricity bills rise, you replace a laptop, your family's needs grow, and exchange rates move. Recalculate your floor twice a year. Rates set once and never revisited are one of the quiet ways freelancers fall behind.
      `,
        [
          q('Why should you assume fewer billable hours than the hours you work?', [
            'Platforms limit freelancers to 90 hours a month',
            'Clients only pay for work done before noon',
            'Proposals, messages, learning, admin and slow weeks take unpaid time',
            'Billable hours are taxed at a higher rate',
          ], 2, 'Much working time is not billable, so overestimating billable hours makes your calculated rate too low to sustain your costs.'),
          q('What is your minimum rate used for?', [
            'It is the price you should quote to every client',
            'It is the floor below which working does not sustain your life and business',
            'It is the rate the platform sets for you',
            'It is the rate you charge only to friends',
          ], 1, 'The minimum rate marks the point below which work loses money, so your actual prices should sit above it.'),
          q('A fixed-price project is estimated at 12 hours. Why add a buffer before multiplying by your rate?', [
            'To make the price look larger than competitors\'',
            'Because clients always pay late',
            'Because platforms require a 25 percent markup',
            'To absorb revisions and surprises without cutting into your earnings',
          ], 3, 'A buffer protects your effective rate when the work takes longer than estimated, and it becomes extra profit when it does not.'),
        ]
      ),
      lesson('Raising Rates Without Losing Clients', 12, `
The rate that won your first reviews should not be the rate you charge a year later. Your skill, speed and proof have grown, and your prices should follow. Many freelancers delay raising rates for fear of losing clients, and end up overbooked and underpaid instead.

### Signs it is time

- You are consistently busy and turning work away.
- You win a high share of the proposals you send.
- Clients rarely question your price.
- You have strong reviews and case studies in your niche.
- Your minimum rate calculation has risen since you last set prices.

Any two of these together are a clear signal.

### Raise for new clients first

The easiest step is raising prices for new clients only. Update your profile rate and your gig packages, and quote the new rate in new proposals. Existing clients continue at their current rate for now. You immediately learn how the market responds, with no risk to relationships you already have.

### Then existing clients, with notice

For long-term clients, give clear notice, usually around a month, and explain it simply:

\`\`\`text
Hi Emma,

Thank you for the last eight months of work together. It has been a
pleasure helping the store grow.

From 1 June my hourly rate will be USD 15, up from USD 12. The rate
reflects the additional experience and speed I now bring, including the
speed and checkout work we completed this spring.

Nothing changes before 1 June, and I would love to keep working together.
Happy to discuss if you have any questions.

Bilal
\`\`\`

It is warm, specific, gives notice, and does not apologise or over-explain. Most good clients accept reasonable, well-communicated increases.

### How much to raise

Steady, moderate increases are easier for clients to accept than rare, dramatic ones. Many freelancers raise by a modest percentage when demand justifies it, rather than doubling overnight. If you are drastically underpriced, move towards the market rate in a couple of steps.

### Some clients will leave, and that is fine

Raising rates may cost you a client who was only there for the low price. That is often healthy: price-driven clients are frequently the most demanding, and replacing them with clients who value your work improves both your income and your workload.

| Before the increase | After the increase |
|---|---|
| Five clients at USD 10 per hour, fully booked | Four clients at USD 14 per hour |
| 150 billable hours, exhausted | 110 billable hours |
| USD 1,500 a month | USD 1,540 a month, with 40 hours back |

Earning the same or more for fewer hours gives you time to find better clients, improve your skills or rest.

### Add value as prices rise

Pair increases with visible improvements: faster turnaround, clearer reports, a new service that saves the client time. Clients rarely object to paying more for a professional who keeps getting better; they object to paying more for exactly the same thing.
      `,
        [
          q('What is the lowest-risk first step when raising your rates?', [
            'Raise prices for new clients only and see how the market responds',
            'Double every existing client\'s rate without notice',
            'Stop taking any new clients',
            'Lower prices first so clients do not notice later',
          ], 0, 'Raising rates for new clients tests demand at the new level without putting existing relationships at risk.'),
          q('How should you tell a long-term client about a rate increase?', [
            'Apply it silently on the next invoice',
            'Apologise repeatedly and offer a discount instead',
            'Tell them only after they complain',
            'Give clear notice, state the new rate and date, and keep it warm and brief',
          ], 3, 'Notice, clarity and a friendly tone let good clients plan for the change and usually keep the relationship strong.'),
          q('A client leaves after a reasonable rate increase. What does the lesson suggest?', [
            'Immediately return to your old rate for everyone',
            'It can be healthy, freeing time for clients who value your work',
            'You should never raise rates again',
            'Offer that client the work for free',
          ], 1, 'Clients who stay only for low prices are often the most demanding, and replacing them can improve both income and workload.'),
        ]
      ),
      lesson('Discounts, Negotiation and Saying No', 13, `
Clients negotiate. Some ask for a discount out of habit, some have genuine budget limits, and a few test how easily you will lower your price. How you respond decides whether you earn what you are worth and whether the client respects you.

### Negotiate scope, not price

When a client says "that is more than our budget", the weakest response is simply dropping the price. It tells the client your first number was not real, and it trains them to push every time. Instead, change what they get for the lower amount:

\`\`\`text
"I understand. For your budget of USD 300, I can deliver the three most
important pages first, product, home and checkout, and we can add the
blog and about pages in a second phase. Would that work?"
\`\`\`

The price per unit of work stays the same. The client gets a choice and a path forward.

### Offer options up front

Presenting two or three options, similar to Fiverr packages, often prevents negotiation altogether. The client chooses the level that fits their budget instead of arguing about one number. Make the middle option the one you most want to sell.

### When a discount makes sense

Discounts are not always wrong. Give them in exchange for something valuable, never for nothing:

| Discount in exchange for | Why it can be worth it |
|---|---|
| A long-term commitment or retainer | Steady income and less time finding work |
| Payment in full upfront | No risk of chasing payment |
| A larger volume of work at once | Less overhead per task |
| Permission to use the project as a case study | Valuable proof for future clients |
| A non-profit cause you care about | Your own choice, stated openly |

### Phrases that should make you careful

- "We have lots of future work if you do this one cheaply." Future work is rarely guaranteed and often never arrives.
- "It will be great exposure for you." Exposure does not pay bills; real case studies and testimonials can, if agreed clearly.
- "Other freelancers charge half." They may, and the client is free to hire them.
- "It should only take you an hour." The client is estimating your work; politely explain what it involves.

### Saying no gracefully

Some projects are wrong for you: budgets far below your minimum rate, unclear scope with unreasonable deadlines, or clients who are disrespectful before any work starts. Declining politely protects your time and reputation:

\`\`\`text
"Thank you for considering me. At this budget I would not be able to
deliver the quality you deserve, so I will step back. If the scope or
budget changes, I would be glad to talk again."
\`\`\`

No arguments, no insults, the door left open.

### Your walk-away point

Decide your walk-away point before the conversation, using your minimum rate from the second lesson. When you already know the number below which you will say no, negotiation stops feeling like pressure and becomes a calm conversation about what works for both sides.
      `,
        [
          q('A client says your quote is above their budget. What is the stronger response?', [
            'Immediately lower the price to match',
            'Reduce the scope to fit the budget while keeping your rate',
            'Refuse to discuss it any further',
            'Ask them to pay the full amount in instalments without changing anything',
          ], 1, 'Adjusting what the client receives keeps your pricing credible while giving them a workable option within their budget.'),
          q('When can a discount be worth giving?', [
            'Whenever a client asks politely and mentions a tight budget',
            'When a client promises the project will bring great exposure',
            'In exchange for something valuable, like upfront payment',
            'When another freelancer on the platform charges less',
          ], 2, 'Discounts make sense when they buy you something real, like guaranteed income or reduced risk, not when they are given for nothing.'),
          q('Why decide your walk-away point before a negotiation?', [
            'So you can quote it to the client immediately',
            'Because platforms require a minimum price',
            'To make the client pay more than they planned',
            'So you can respond calmly and decline offers below what sustains you',
          ], 3, 'Knowing your limit in advance removes pressure during the conversation and protects you from accepting unsustainable work.'),
        ]
      ),
      ],
      [
      q('Which pricing model rewards you for getting faster at a repeatable job?', [
        'Hourly pricing',
        'Fixed pricing with a clear scope',
        'Working for free',
        'Discounted pricing',
      ], 1, 'With a fixed price, finishing faster increases your effective hourly earnings, while hourly pricing pays less as you speed up.'),
      q('Which factor most often makes freelancers set their rates too low?', [
        'Charging in dollars instead of rupees',
        'Including business costs in the calculation',
        'Recalculating the rate every six months',
        'Overestimating how many hours they can actually bill',
      ], 3, 'Assuming too many billable hours spreads costs too thinly, producing a rate that cannot sustain real expenses.'),
      q('What is a good sign that it is time to raise your rates?', [
        'You are consistently busy and win most proposals you send',
        'You have had no replies to proposals for a month',
        'A client asked for a discount',
        'You just started your first project',
      ], 0, 'Strong demand and a high win rate show the market values your work above your current price.'),
      q('A client says, "Do it cheaply now and there will be lots of future work." What does the chapter advise?', [
        'Accept, because future work is guaranteed',
        'Double the price to make up for it',
        'Be careful, because promised future work rarely materialises',
        'Ask for the future work to be paid first',
      ], 2, 'Promises of future work are not commitments, so pricing today\'s project on them usually means working below your rate with nothing to show later.'),
      ]
    ),
    chapter(
      'Communication and Client Management',
      'Run discovery calls that uncover the real goal, send updates clients trust, handle revisions and scope creep calmly, and set boundaries across time zones.',
      [
      lesson('The First Call and Discovery Questions', 13, `
Many freelance projects go wrong before any work begins, because the freelancer started building what the client said rather than what the client needed. A short discovery conversation, by call or message, fixes that. It also shows the client that you think like a professional, which often wins the contract on its own.

### Goal of the first conversation

You want to leave the conversation knowing four things: the business goal behind the request, what "done" looks like, the constraints (budget, deadline, tools, access), and who makes decisions. If you cannot answer those, you are not ready to quote.

### Questions that uncover the real need

\`\`\`text
About the goal
- What is prompting this project now?
- If this goes perfectly, what changes for your business?

About success
- How will you judge whether it worked?
- Is there an example you like, and what do you like about it?

About constraints
- Is there a date this must be ready by, and why that date?
- What tools, accounts or systems will I be working with?

About people
- Who else needs to approve the work?
- Who will I communicate with day to day?
\`\`\`

Notice that none of these ask "what is your budget?" as the first question. Budget matters, but asking about the goal first lets you propose a solution that fits it.

### Listen for the problem behind the request

A client asks for "a new logo". Discovery reveals that sales are flat and customers find the brand looks outdated beside competitors. The real need might be a logo refresh plus updated social templates and packaging labels. A client asks for "a website redesign", and it turns out their current site is fine but slow on mobile. Understanding the problem lets you recommend the right work, sometimes smaller and cheaper, which builds enormous trust.

### Summarise in writing

After the conversation, send a short written summary. This single habit prevents most misunderstandings:

\`\`\`text
Thanks for the call, Ahmed. To confirm what we discussed:

Goal:        More enquiries from the website for your Islamabad clinic
Scope:       Redesign the home and services pages, add a booking form
Not included: Blog, new photography, SEO content writing
Deadline:    Live before 15 March, for the new branch opening
Approvals:   You approve designs; Dr Sadia signs off the final page
Next step:   I will send a fixed-price proposal by tomorrow evening

Please let me know if I have missed anything.
\`\`\`

The "Not included" line is especially valuable. It sets the scope before anyone has an opportunity to assume otherwise.

### Calls or messages?

Some clients prefer calls; others want everything in writing. Offer both and follow their lead. Calls build rapport quickly and are good for complex projects, but always follow a call with a written summary. On Upwork, keep project communication inside the platform's messages where possible, since that record matters if there is ever a dispute.

### Small signals of professionalism

Arrive on time. Test your microphone and internet beforehand, and have a backup plan for power cuts. Take notes. Repeat key points back to the client. None of these require experience, and clients notice all of them.
      `,
        [
          q('What should you know before quoting a price for a project?', [
            'Only the client\'s budget',
            'How many other freelancers applied',
            'The business goal, what done looks like, the constraints and who decides',
            'The client\'s personal social media accounts',
          ], 2, 'Without understanding the goal, success criteria, constraints and decision-makers, any quote is a guess that may not match the real need.'),
          q('Why include a "Not included" line in your written summary?', [
            'To make the proposal look longer',
            'To set the scope clearly before anyone assumes otherwise',
            'Because the platform requires it',
            'To discourage the client from hiring you',
          ], 1, 'Stating what is outside the scope early prevents disagreements later about work the client assumed was included.'),
          q('A client asks for a redesign, but discovery shows the site is simply slow on mobile. What builds the most trust?', [
            'Doing the full redesign anyway because it pays more',
            'Ignoring the speed issue',
            'Declining the project',
            'Recommending the work that actually solves the problem',
          ], 3, 'Recommending the right solution, even when it is smaller, shows you put the client\'s goal first, which earns trust and future work.'),
        ]
      ),
      lesson('Clear Updates and Good Questions', 12, `
Clients hire freelancers they cannot see. They cannot walk past your desk to check progress, so silence feels like risk. The single most reliable way to keep clients happy is to tell them what is happening before they need to ask.

### A simple update rhythm

Agree how often you will update the client at the start of the project. For short jobs, an update at key milestones is enough. For longer work, a brief update every two or three days, or weekly for ongoing contracts, works well. Then keep to it.

### The shape of a good update

\`\`\`text
Hi Emma, quick update on the store speed project:

Done:     Compressed all product images, removed two unused apps
Next:     Testing the checkout on mobile and fixing the slow cart drawer
Blocked:  I need staff access to the Shopify theme settings to continue
ETA:      On track for Friday, assuming access by tomorrow
\`\`\`

Four lines, readable in fifteen seconds. The client knows the progress, what is next, what you need from them, and whether the deadline is safe.

### Deliver bad news early

Problems happen: a feature is harder than expected, a file is missing, you fall ill, or the power goes out for a day. The mistake is hiding the problem until the deadline. Tell the client as soon as you know, with a plan:

\`\`\`text
Hi Ahmed, I want to flag something early. The booking plugin we chose
does not support Urdu dates, which we need. I have two options:

1. Use a different plugin that supports it. Adds about one day.
2. Keep the current plugin and show dates in English only.

I recommend option 1. Which would you prefer?
\`\`\`

Clients forgive delays they hear about early. They rarely forgive surprises on the deadline.

### Asking good questions

Clients are busy, and a stream of small questions wastes their time. Batch your questions, make them easy to answer, and suggest a default:

| Weak question | Strong question |
|---|---|
| "What colour do you want?" | "Should the button be your brand orange or dark blue? I suggest orange so it stands out." |
| "What should I do about images?" | "Some product images are low resolution. Shall I use them as they are, or will you send better ones by Wednesday?" |
| Five separate messages in an hour | One message with three numbered questions |

A suggested default lets the client reply "yes, go with your suggestion", which takes seconds.

### Tone in writing

Written messages lose tone of voice, so be a little warmer than feels necessary. Thank clients for feedback, even critical feedback. Avoid all capital letters, and never reply while angry; wait an hour and reread the message first. If English is your second language, a clear, simple sentence always beats a complicated one.

### Response time

You do not need to reply within minutes around the clock, but a reply within a working day, even if it only says "received, I will look at this tomorrow morning", keeps clients calm. Platforms also notice response times, which affects how your profile is shown.
      `,
        [
          q('What are the four parts of the update format shown?', [
            'Done, next, blocked and ETA',
            'Greeting, apology, invoice and signature',
            'Price, discount, deadline and review request',
            'Problems, excuses, delays and questions',
          ], 0, 'A short update covering what is done, what is next, what you need and whether the deadline is safe answers the client\'s main questions at a glance.'),
          q('You discover a problem that may delay delivery. When should you tell the client?', [
            'On the deadline, together with the delivery',
            'Only if they ask',
            'As soon as you know, with options and a recommendation',
            'Never, just work extra hours',
          ], 2, 'Early notice with a plan lets the client decide calmly, while surprises at the deadline damage trust.'),
          q('Why suggest a default answer when asking a client a question?', [
            'To make the decision for the client without their approval',
            'To make the message longer and more detailed',
            'Because clients are not allowed to choose',
            'So the client can reply quickly by agreeing',
          ], 3, 'A clear suggestion reduces the client\'s effort to a quick yes or no, keeping the project moving.'),
        ]
      ),
      lesson('Revisions, Scope Creep and Difficult Clients', 14, `
Almost every freelancer eventually meets the project that keeps growing. First a small extra section, then a different colour scheme, then "while you are at it, could you also add a blog?". Each request seems small, but together they can double the work without changing the price. This is scope creep, and managing it calmly is a core freelancing skill.

### Revisions versus new work

A revision changes something within the agreed scope: adjusting the layout of a page you designed, rewording a paragraph you wrote. New work adds something that was not agreed: an extra page, a new feature, a different product. Your proposal or gig package should state how many revisions are included, and your written summary should list what is not included. Those two documents are what make this conversation easy.

### The friendly change request

When a client asks for something outside the scope, do not refuse and do not silently do it. Acknowledge it, name it as additional work, and offer options:

\`\`\`text
"Happy to add the blog. That is outside the original scope, so I would
treat it as an add-on: about USD 80 and two extra days. I can do it
after the main pages go live, or include it now and move the delivery
date to Monday. Which do you prefer?"
\`\`\`

This tone keeps the relationship warm. Most reasonable clients accept, because you have made it easy and fair.

### When revisions keep coming

If a client requests revision after revision, often the brief was unclear. Pause and reset:

1. Summarise the feedback so far and what has changed.
2. Ask the client to share examples of what they want, or to explain what is still not right.
3. Agree what the final round will include.
4. Refer to the revision limit politely if needed, and offer extra rounds at a stated price.

### Recognising difficult clients

| Behaviour | A calm response |
|---|---|
| Changes their mind constantly | Written confirmation before each stage |
| Demands work before paying the milestone | Hold firm: work starts after the milestone is funded |
| Rude or insulting messages | Stay professional, set a boundary, and consider ending the contract |
| Disappears for weeks, then wants it urgently | Explain your schedule and give a realistic new date |
| Threatens a bad review to get free work | Keep records, do not give in, and contact platform support if needed |

### Ending a contract professionally

Sometimes a project is not working. If so, end it politely: deliver what has been completed, agree payment for that work, and close the contract. Chapter 9 covers disputes, but many endings need no dispute at all, just an honest message such as "I do not think I am the right fit for the direction this has taken; here is everything completed so far."

### Protect yourself with records

Keep all agreements, scope changes and approvals in writing, ideally in the platform's messages. When a client says "that was always included", a written summary from the first week settles it instantly and calmly.
      `,
        [
          q('What is the difference between a revision and new work?', [
            'Revisions are paid and new work is free',
            'A revision changes agreed work; new work adds something not agreed',
            'There is no difference between them',
            'New work is only requested by difficult clients',
          ], 1, 'Revisions adjust deliverables already in scope, while new work expands the scope and should be priced separately.'),
          q('A client asks for an extra blog page outside the scope. What is the recommended response?', [
            'Refuse and end the contract',
            'Add it silently for free to keep them happy',
            'Ignore the message',
            'Name it as an add-on and offer price and timing options',
          ], 3, 'Framing extra requests as optional add-ons with clear options keeps the relationship positive while protecting your time.'),
          q('A client threatens a bad review unless you do extra work for free. What should you do?', [
            'Keep records, do not give in, and contact platform support if needed',
            'Do the free work immediately',
            'Threaten the client back',
            'Delete your account and start again',
          ], 0, 'Giving in rewards the behaviour; records and platform support protect you through a fair process.'),
        ]
      ),
      lesson('Time Zones, Availability and Boundaries', 12, `
Working from Pakistan with clients in the United States, the United Kingdom, Europe, the Gulf or Australia means your working day and theirs rarely line up neatly. Handled well, time zones are an advantage: work happens while the client sleeps. Handled badly, they lead to midnight calls, missed messages and burnout.

### Know the overlap

Pakistan Standard Time is ahead of most Western clients. The gap varies with daylight saving time in those countries, so always check a world clock rather than relying on memory:

| Client location | Rough difference from Pakistan | Typical overlap |
|---|---|---|
| UK | Pakistan is 4 to 5 hours ahead | Your afternoon, their morning |
| Central Europe | Pakistan is 3 to 4 hours ahead | Your late morning and afternoon |
| US East Coast | Pakistan is 9 to 10 hours ahead | Your evening, their morning |
| US West Coast | Pakistan is 12 to 13 hours ahead | Very little; plan asynchronous work |
| UAE and Saudi Arabia | Pakistan is 1 to 2 hours ahead | Most of the working day |
| Australia (east) | Pakistan is 5 to 6 hours behind | Your morning, their afternoon |

### State your availability clearly

Put your working hours in your profile and your first message, expressed in the client's time zone as well as your own:

\`\`\`text
I am available 2pm to 10pm Pakistan time, which is 9am to 5pm in
London. I reply to messages within a few hours during that window and
by the next morning otherwise.
\`\`\`

Clients value predictability more than constant availability.

### Work asynchronously

Most freelance work does not need live conversation. Use written updates, short screen recordings to explain a design or a bug, and shared documents for feedback. A two-minute video walkthrough often replaces a thirty-minute call and lets the client watch it at their convenience.

### Boundaries that protect you

- Decide which late-evening calls you will take, and offer them only for important moments such as kick-off or launch.
- Turn off notifications outside your working hours. An urgent emergency is rare; most messages can wait until morning.
- Do not reply instantly at 2am. It trains clients to expect it.
- Schedule time for rest, family and prayer, and treat it as seriously as a client meeting.

### Plan for power and internet

Load-shedding and internet outages are real risks for freelancers in Pakistan. A UPS or solar backup for your router and laptop, and a mobile data backup, protect your deadlines. If an outage does affect work, tell the client early, as the previous lesson recommended.

### Holidays and time off

Tell clients about Eid, other holidays and personal time off well in advance. On Fiverr, you can use the platform's away or availability settings so orders do not pile up unanswered. Arrange handovers for ongoing work. Clients do not mind you taking time off; they mind being surprised by it.

### Consistency beats heroics

The freelancer who replies within the stated hours every day builds more trust than the one who works through the night for one project and then disappears for three days. Sustainable routines keep both your clients and your health in good shape over the years it takes to build a strong freelance career.
      `,
        [
          q('Why should you check a world clock rather than rely on a fixed time difference?', [
            'Pakistan changes its clocks every month',
            'The gap changes when other countries switch to or from daylight saving time',
            'Clients always lie about their location',
            'Platforms show the wrong time',
          ], 1, 'Many client countries use daylight saving time, so the gap with Pakistan shifts during the year.'),
          q('How should you state your availability to an international client?', [
            'Say you are available at any time, day or night',
            'Only in Pakistan time, without conversion',
            'In both your time zone and theirs, with expected response times',
            'Do not mention availability at all',
          ], 2, 'Showing hours in both time zones and your usual response time sets predictable expectations for the client.'),
          q('Why might a short screen recording be better than a call?', [
            'Clients are not allowed to join calls',
            'Recordings are required by every platform',
            'Calls always cost extra money',
            'The client can watch it at a convenient time, avoiding time-zone clashes',
          ], 3, 'Asynchronous explanations work across time zones and often communicate complex points faster than a live meeting.'),
        ]
      ),
      ],
      [
      q('What habit after a discovery call prevents most misunderstandings?', [
        'Sending an invoice immediately',
        'Starting work before the client replies',
        'Sending a written summary of goal, scope, exclusions and deadline',
        'Asking the client to call again the next day',
      ], 2, 'A written summary creates a shared record of what was agreed, which prevents disputes about scope and expectations.'),
      q('A client has not heard from you in a week on a two-week project. What is the main risk?', [
        'The platform will charge a fee',
        'Silence makes the client worry about progress and trust you less',
        'The client will automatically receive a refund',
        'Nothing, as long as the deadline is met',
      ], 1, 'Remote clients cannot see your work, so regular updates are how they know the project is on track.'),
      q('Which is an example of scope creep?', [
        'Adjusting a colour on a page you already designed',
        'Fixing a spelling mistake in your own work',
        'Sending a progress update',
        'Adding a new blog section that was never agreed',
      ], 3, 'Scope creep is new work beyond the agreed scope, while small adjustments to agreed deliverables are revisions.'),
      q('What builds more trust over a long freelance career?', [
        'Replying consistently within stated hours',
        'Working through the night on every project',
        'Being available instantly at all hours',
        'Never telling clients about holidays',
      ], 0, 'Predictable, sustainable routines build lasting trust, while occasional heroics followed by silence damage it.'),
      ]
    ),
    chapter(
      'Contracts, Payments and Protection',
      'Use escrow, milestones and time tracking to make sure you get paid, spot common scams early, handle disputes calmly, and follow platform rules about working off-platform.',
      [
      lesson('Escrow, Milestones and Platform Protection', 13, `
The biggest fear for new freelancers is simple: "What if I do the work and the client never pays?" Freelance platforms exist largely to solve this problem, but their protection only works if you use their systems correctly. Knowing how it works lets you take on international clients with confidence.

### Fixed-price contracts on Upwork: milestones and escrow

On a fixed-price contract, the client funds each milestone before you start it. The money sits in escrow, held by the platform, not the client. When you submit the work, the client approves it and the payment is released to you. If the client does not respond after submission, the platform's rules generally release payment automatically after a set review period. Check Upwork's current help pages for the exact timings.

The golden rule follows directly: never start a milestone until it shows as funded. A client who promises to fund it "later today" and asks you to begin now is asking you to work without protection.

### Splitting work into milestones

Large projects should be split, so both sides take small, manageable risks:

| Milestone | Deliverable | Share of price |
|---|---|---|
| 1 | Design mock-ups for three pages, approved | 30% |
| 2 | Pages built on a staging site | 40% |
| 3 | Launch, testing and handover | 30% |

If the relationship breaks down after milestone 1, you have been paid for what you delivered, and the client has not paid for work they never received.

### Hourly contracts: protection depends on tracking

On Upwork hourly contracts, payment protection applies to time logged through the platform's time tracker, which records activity and screenshots in the Work Diary. Manually added time is generally not covered by the same protection. The requirements, such as a client's valid payment method and a contract set up correctly, are described in Upwork's Hourly Protection rules; read them before your first hourly job.

Work with the tracker running, write clear memos for each block of time, and avoid logging time that does not match the work described.

### Fiverr: the client pays before you start

On Fiverr, buyers pay when they place an order, so the payment is secured before you begin. You deliver through the order page, the buyer accepts or the order completes automatically after a period, and after a clearance period the funds become available to withdraw. Cancellations and disputes go through Fiverr's resolution process.

### Keep everything on the platform

The protection only covers work agreed, delivered and paid through the platform. That means:

\`\`\`text
Keep inside the platform
- The contract or order, with a clear scope
- Messages about scope changes and approvals
- Deliverables, submitted through the milestone or order page
- Payment, always
\`\`\`

Files shared through a link are fine, but the delivery and approval should be recorded on the platform. If a dispute ever happens, the platform will look at what is on the platform.

### Protection for the client, too

Clients also rely on escrow: they know they will not lose money to a freelancer who disappears. Explaining that you work through milestones reassures new clients and shows you understand how professional freelancing works.
      `,
        [
          q('On an Upwork fixed-price contract, when should you start work on a milestone?', [
            'When the client says they will fund it later',
            'As soon as the job post is published',
            'Only once the milestone shows as funded in escrow',
            'After you deliver the final files',
          ], 2, 'Funded escrow means the payment is secured by the platform, so starting before funding means working without protection.'),
          q('Why split a large project into several milestones?', [
            'Platforms charge lower fees on milestones',
            'Both sides take smaller risks, and you are paid as each part is delivered',
            'Clients cannot leave reviews on single-milestone projects',
            'It makes the project finish faster',
          ], 1, 'Milestones limit the amount at risk for both freelancer and client and ensure payment tracks delivered work.'),
          q('What does Upwork\'s hourly protection generally rely on?', [
            'Time you tell the client about in messages',
            'Manually added hours',
            'Screenshots you take on your phone',
            'Time logged with the platform\'s time tracker in the Work Diary',
          ], 3, 'Hourly protection covers tracked time recorded in the Work Diary, so working with the tracker running matters.'),
        ]
      ),
      lesson('Scams and Red Flags', 14, `
Freelance platforms attract scammers because new freelancers are eager for work and may not know the warning signs. Most scams follow a small number of patterns, and once you recognise them they are easy to avoid. The cost of falling for one can be your money, your personal data or your account.

### Common scam patterns

| Scam | How it works | The warning sign |
|---|---|---|
| Off-platform move | "Let us continue on Telegram or WhatsApp" before any contract | Contact requested before hiring |
| Fake cheque or overpayment | Client "overpays" and asks you to send the difference back | Any request to send money to a client |
| Pay to start | You must buy software, training or a "starter kit" to begin | Paying to get a job |
| Fake interview | A chat interview on another app, then a request for ID or bank details | Personal data requested early |
| Free test work | A "test" that is actually the full project, never paid | Large unpaid tasks |
| Crypto or unusual payments | Payment in gift cards, crypto or through a third party | Any payment outside the platform |
| Account rental | Someone asks to use your account or verification | Sharing your identity |

### Why moving off the platform is the biggest red flag

Almost every scam begins with an attempt to take the conversation away from the platform, where the scammer is not monitored and you are not protected. A legitimate client who found you on Upwork or Fiverr has no reason to move you to another app before a contract exists.

A safe reply is short:

\`\`\`text
"Thanks for reaching out. I keep all communication and payment on
Upwork until the contract is in place, as the platform requires. Happy
to continue the discussion here."
\`\`\`

Real clients accept this. Scammers usually vanish.

### Protect your identity and account

- Never share your platform password or verification codes, even with someone claiming to be support.
- Never let anyone else log into your account or verify their identity through yours. Account sharing is against platform rules and can lead to permanent suspension.
- Do not send copies of your CNIC, passport or bank details to clients.
- Check links carefully; fake login pages that copy the platform's design are common.

### Test tasks: be generous but careful

A small, unpaid sample task can be reasonable when a client is choosing between freelancers. A test that takes hours or looks like a real piece of their product is not a test, it is free work. Offer your portfolio instead, or suggest a small paid first milestone.

### Too good to be true

A client offering a large budget for very simple work, praising you excessively before seeing your work, or pushing you to act urgently, is using pressure. Pause, check the client's history on the platform (payment verification, past hires, reviews), and trust your judgement.

### Report it

Platforms rely on freelancers reporting suspicious messages. Reporting helps remove scammers before they reach the next new freelancer, possibly someone just starting out like you.
      `,
        [
          q('A client you have not been hired by asks to continue the conversation on Telegram. What is the safest response?', [
            'Move to Telegram immediately',
            'Keep communication on the platform until a contract exists',
            'Share your phone number and bank details',
            'Ask them to pay you a deposit on Telegram',
          ], 1, 'Requests to move off-platform before hiring are the most common start of a scam, and staying on the platform keeps you protected.'),
          q('A client overpays and asks you to send the difference back. What is this?', [
            'A normal business practice',
            'A bonus you should keep',
            'A classic overpayment scam',
            'A new platform feature',
          ], 2, 'Overpayment scams trick victims into sending real money back before the original payment is reversed or proves fake.'),
          q('Why should you never let someone else use your freelance account?', [
            'It slows down your internet connection',
            'It reduces your profile views',
            'Clients do not mind, but it is impolite',
            'Account sharing breaks platform rules and can lead to permanent suspension',
          ], 3, 'Platforms require each account to belong to one verified person, and sharing can cost you the account and its earnings.'),
        ]
      ),
      lesson('Disputes, Refunds and Your Reputation', 13, `
Even careful freelancers sometimes face disagreements. A client may feel the work does not match what was agreed, or you may feel a client is refusing to pay for completed work. Disputes are stressful, but they are usually resolved well by staying calm, relying on records and following the platform's process.

### Try to resolve it directly first

Most disagreements come from misunderstanding, not bad intent. Before involving the platform:

1. Reread the original scope, your written summary and the messages.
2. Ask the client exactly what they feel is missing or wrong.
3. Offer a fair fix: a revision, a partial refund, or completing the missing part.
4. Agree the solution in writing.

\`\`\`text
"I understand the checkout page does not work as you expected. Looking
at our scope, it included the design and build of the page. The payment
integration was listed under 'not included'. I am happy to add it as a
small add-on, or we can close this milestone as delivered. Which works
better for you?"
\`\`\`

Calm, factual messages that point to the written agreement resolve most issues quickly.

### When a partial refund is wiser

If part of the work genuinely fell short, a partial refund can be the best outcome. It closes the matter, shows good faith, and often protects your reputation better than a long argument you might lose.

### Using the platform's process

If direct discussion fails, both Upwork and Fiverr have formal processes. On Upwork, fixed-price disputes can go to mediation, where a platform team reviews the contract, messages and deliverables. On Fiverr, the Resolution Center handles requests such as cancellations and delivery disagreements, and customer support can step in. In each case, the outcome depends heavily on the records inside the platform, which is why the previous lessons insisted on keeping them there.

### What decides the outcome

| Helps your case | Hurts your case |
|---|---|
| A clear written scope | Agreements made only on calls or other apps |
| Deliveries submitted through the platform | Files sent by email with no record |
| Polite, factual messages | Angry or insulting messages |
| Evidence of revisions offered | Ignoring the client's concerns |

### Reviews after a difficult project

A dispute can end with a disappointing review. Platforms generally let you respond publicly on your profile. A calm, professional reply, such as thanking the client and briefly noting what was delivered, reassures future clients far more than defensiveness. One weaker review among many good ones rarely harms a strong profile.

### Learn from each dispute

After any dispute, ask what would have prevented it: a clearer scope, an earlier warning, more frequent updates, or spotting a warning sign during discovery. Adjust your templates and process. Most experienced freelancers can point to one early dispute that permanently improved how they write proposals.

### Protecting your mental health

Disputes can feel personal, especially early in your career. Remember it is a business disagreement, not a judgement of your worth. Take breaks, talk to a mentor or a fellow freelancer, and keep your other clients' work on track while the process runs.
      `,
        [
          q('What should you do first when a client disputes your delivery?', [
            'Reread the scope and messages, then offer a fair fix',
            'Open a formal dispute immediately',
            'Leave the client a negative review',
            'Stop replying until the client gives up',
          ], 0, 'Most disagreements come from misunderstanding, so reviewing the agreement and proposing a solution resolves many without a formal process.'),
          q('What most influences the outcome of a platform dispute?', [
            'How long you have been a member',
            'Which country the client is from',
            'The records of scope, messages and deliveries inside the platform',
            'How angry the messages are',
          ], 2, 'Platforms decide disputes based on the contract, messages and deliverables recorded on the platform.'),
          q('How should you respond publicly to a disappointing review?', [
            'Argue in detail and criticise the client',
            'Ask friends to leave fake positive reviews',
            'Delete your profile and create a new one',
            'Reply calmly and professionally, briefly noting what was delivered',
          ], 3, 'A composed response reassures future clients, while defensive replies or fake reviews damage trust and break rules.'),
        ]
      ),
      lesson('Platform Rules About Working Off-Platform', 12, `
A client you met on Upwork loves your work and suggests: "Let us skip the fees. I will pay you directly from now on." It sounds like a good deal, since you would keep the full amount. In reality it can put your account, your income and your protection at serious risk.

### What the rules say

Upwork's Terms of Service include rules about circumvention. In general, if you meet a client through Upwork, you must keep paying and being paid through Upwork for a set period, which has been 24 months at the time of writing, unless a conversion fee is paid to move the relationship off the platform. Fiverr's rules prohibit asking for or accepting payment outside Fiverr for work connected to the platform, and sharing contact details to take work elsewhere. Both platforms can suspend or close accounts that break these rules.

Because terms change, always read the current Terms of Service and help pages for the platform you use.

### Why it matters so much

| If you move a client off-platform improperly | The consequence |
|---|---|
| Account flagged for circumvention | Suspension or permanent closure, losing your reviews and history |
| Payment disputes | No escrow, no hourly protection, no mediation |
| Scam risk | Many "direct payment" offers are the start of a scam |
| Reputation | Your Job Success Score or seller level cannot count that work |

Saving a platform fee is rarely worth risking the account that brings you clients.

### How to say no without losing the client

\`\`\`text
"Thank you, I really appreciate that. Upwork's terms require us to keep
working through the platform, and honestly I prefer it: the escrow and
records protect both of us. Let us keep going here."
\`\`\`

Most good clients respect this. Many do not know the rule exists and are glad you explained it.

### Platform messaging filters

Platforms scan messages for attempts to share phone numbers, email addresses or external payment links before a contract, and may warn or restrict accounts. Keep contact within the platform's messaging and calls, and share files through the platform or via links related to the project, not to move the conversation elsewhere.

### What is allowed

Rules are not meant to stop you building a business. Generally allowed and useful:

- Linking to your portfolio where the platform permits.
- Having clients you found yourself, outside the platform, without involving the platform at all.
- Using video calls and shared tools for the project while the contract stays on the platform.
- Moving a platform client off-platform through the official conversion route when both sides agree the fee is worth it.

Check the current details for each platform before relying on any of these.

### Build your own channels too

The healthiest freelance businesses do not depend on one platform. LinkedIn, referrals, your portfolio site and your professional network bring clients who were never platform clients, which you can serve however you both agree. Chapter 12 returns to this as you grow from freelancer to agency.
      `,
        [
          q('A client you met on Upwork offers to pay you directly to avoid fees. What is the main risk?', [
            'The client will pay you twice',
            'You will earn less money on that project',
            'Breaking circumvention rules can get your account suspended or closed',
            'The platform will lower your rate',
          ], 2, 'Upwork\'s terms restrict moving platform clients off-platform without the conversion route, and violations can cost you the account.'),
          q('Why do the lessons suggest checking the current Terms of Service?', [
            'Platform rules and periods can change over time',
            'The rules are identical on every platform',
            'Terms of Service never apply to freelancers',
            'Clients write the Terms of Service',
          ], 0, 'Platform terms are updated periodically, so the current version is the reliable source for rules like conversion periods and fees.'),
          q('Which is generally allowed under platform rules?', [
            'Sharing your phone number before a contract to avoid fees',
            'Asking a Fiverr buyer to pay you through a bank transfer',
            'Letting a friend use your account',
            'Serving clients you found yourself outside the platform',
          ], 3, 'Clients you find independently, without the platform\'s involvement, are not covered by the platform\'s circumvention rules.'),
        ]
      ),
      ],
      [
      q('What is the golden rule for fixed-price milestones?', [
        'Deliver everything before asking for funding',
        'Ask the client to pay you on another app',
        'Start work as soon as the client sends a message',
        'Never start a milestone until it is funded',
      ], 3, 'A funded milestone is held in escrow by the platform, so waiting for funding means your payment is protected.'),
      q('What do most freelance scams have in common at the start?', [
        'An attempt to move you off the platform',
        'A detailed written scope',
        'A funded milestone',
        'A verified payment method',
      ], 0, 'Scammers move conversations away from the platform, where their actions are not monitored and freelancers lose protection.'),
      q('During a dispute, which of these helps your case most?', [
        'Agreements made in a phone call',
        'A clear written scope and deliveries recorded on the platform',
        'Files sent by personal email',
        'Angry messages showing your frustration',
      ], 1, 'Platforms decide disputes from the records they can see, so written scope and platform deliveries carry the most weight.'),
      q('A client suggests paying outside Fiverr to save fees. What does the chapter recommend?', [
        'Accept, as it saves both of you money',
        'Accept, but only for large orders',
        'Politely decline and keep payment on the platform',
        'Ask for payment in cryptocurrency instead',
      ], 2, 'Fiverr\'s rules prohibit off-platform payment for platform work, and declining protects your account, your earnings and your protection.'),
      ]
    ),
    chapter(
      'Getting Paid in Pakistan',
      'Choose withdrawal methods that suit Pakistani freelancers, understand exchange rates and fees, register for tax the right way, and keep records and a budget that survive irregular income.',
      [
      lesson('Withdrawal Methods: Bank Transfer and Payoneer', 13, `
Earning in dollars is only half the job. The other half is getting that money into your Pakistani bank account safely, cheaply and in a way that is properly recorded. The options available to you depend on the platform, and they change from time to time, so treat this lesson as a map and always confirm the details on the platform's current withdrawal page.

### PayPal is not the route

Many new freelancers ask about PayPal first. PayPal does not support receiving payments for users in Pakistan, so do not plan your freelance income around it, and be wary of anyone offering to "receive PayPal for you" through their account. That breaks PayPal's rules and exposes your money to someone else.

### The main options

| Method | How it works | Good to know |
|---|---|---|
| Upwork direct to local bank | Upwork sends PKR to your Pakistani bank account | Simple; check the conversion rate and per-withdrawal fee |
| Payoneer | Earnings go to a Payoneer account, then to your local bank | Common for Fiverr sellers in Pakistan; one account can receive from several platforms |
| Wire transfer | A USD transfer to your bank | Usually a higher fixed fee, so better for large amounts |

Payoneer is widely used because it connects to many platforms and marketplaces. Upwork's direct local bank option is convenient for Upwork income on its own. Many freelancers use both.

### Setting up correctly

- Use an account in your own name, matching your platform identity. Using a relative's or friend's account causes verification problems and can freeze payments.
- Give your bank's details exactly as your bank provides them, including your IBAN.
- Tell your bank that you receive freelance income from abroad. Correctly classified inward remittances matter for your tax records, which the third lesson covers.
- Ask your bank about foreign currency accounts and any schemes for freelancers and IT exporters. Rules issued by the State Bank of Pakistan have allowed exporters of IT services to keep a portion of their earnings in foreign currency; ask your bank what currently applies.

### Proof of income: keep your certificates

When foreign money arrives in your Pakistani bank account, the bank can issue a certificate showing the inward remittance, often called a proceeds realisation certificate or encashment certificate. Ask for these regularly and keep them. They prove your income came from abroad through official banking channels, which matters for tax, visa applications, loans and account verification.

### A sensible withdrawal routine

\`\`\`text
Weekly or fortnightly
- Check available balance on each platform
- Withdraw once the amount makes the fee worthwhile
- Download the platform statement for that period

Monthly
- Collect bank certificates for inward remittances
- Save statements in a folder named by year and month
\`\`\`

Withdrawing tiny amounts every day wastes money on fixed fees; leaving large balances on a platform for months adds risk if an account issue ever appears. A regular rhythm balances both.

### Beware of "exchange agents"

Informal agents who offer to convert your platform balance at a "better rate" are a common source of fraud, frozen accounts and money that cannot be proven as legitimate income. Official channels may cost a little more, but they protect your earnings and your records.
      `,
        [
          q('Why is PayPal not the recommended route for freelancers in Pakistan?', [
            'PayPal charges no fees at all',
            'PayPal does not support receiving payments for users in Pakistan',
            'PayPal only works for Fiverr',
            'Banks in Pakistan require PayPal',
          ], 1, 'PayPal does not offer receiving services to Pakistani users, and using someone else\'s account breaks its rules and puts your money at risk.'),
          q('Why should your withdrawal account be in your own name?', [
            'Banks charge less for relatives\' accounts',
            'Platforms prefer family accounts',
            'Mismatched names cause verification problems and can freeze payments',
            'It makes no difference to the platform',
          ], 2, 'Platforms and banks verify identity, so an account in someone else\'s name creates compliance problems and delays.'),
          q('What is a bank certificate for inward remittances useful for?', [
            'Increasing your platform rating',
            'Avoiding all taxes permanently',
            'Replacing your CNIC',
            'Proving foreign income arrived through official channels',
          ], 3, 'Certificates document that your earnings came from abroad via proper banking channels, which supports tax filing and other applications.'),
        ]
      ),
      lesson('Currency, Exchange Rates and Fees', 12, `
Two freelancers each earn USD 1,000 in a month. One receives noticeably more rupees than the other. The difference is not their work, it is the fees and exchange rates along the way. Understanding where money is lost lets you keep more of what you earn.

### Where the money goes

Between the client's payment and your bank account, there are usually several deductions:

| Stage | What is deducted |
|---|---|
| Platform service fee | A share of each payment, taken by the platform |
| Connects or promotion | Optional spending on bids or ads (for example Upwork Connects) |
| Withdrawal fee | A fixed or percentage fee per withdrawal |
| Currency conversion | A markup above the market exchange rate when USD becomes PKR |
| Bank charges | Occasionally, a fee from the receiving bank |

Each looks small alone. Together they can add up to a meaningful share of your income.

### Understanding exchange rates

The rate you see on the news is the interbank or market rate. When a platform or Payoneer converts your dollars, it usually applies its own rate, which includes a margin. Compare:

\`\`\`text
Example, not real rates

Market rate                          PKR 280.00 per USD
Rate offered by method A             PKR 275.50 per USD
Rate offered by method B             PKR 277.80 per USD

On USD 1,000:
Method A    PKR 275,500
Method B    PKR 277,800
Difference  PKR   2,300 each month, about PKR 27,600 a year
\`\`\`

Check the actual rate offered at the moment of withdrawal, not the advertised rate.

### Practical ways to keep more

- Compare methods every few months. The cheapest route can change.
- Withdraw in sensible amounts so fixed fees are a smaller share of each transfer.
- For large balances, compare wire transfer costs against percentage-based fees.
- Avoid unnecessary conversions, such as USD to another currency and back.
- Ask your bank about foreign currency accounts, which let you hold dollars and convert when you choose.

### Should you wait for a better rate?

Some freelancers hold dollars hoping the rupee will weaken. Exchange rates are unpredictable, and nobody can reliably time them. A balanced approach is to convert what you need for monthly expenses and taxes, and keep any savings in whatever currency your bank and the current rules allow, without speculation.

### Price with fees in mind

Chapter 7 built your minimum rate on money after fees. Revisit it when fees or exchange rates change significantly. If a platform raises its service fee or the conversion margin grows, your minimum rate in dollars should rise with it.

### Track your real income

Keep a simple record of gross earnings, each fee and the rupees received. Many freelancers only ever look at the platform balance and are surprised at year end. Knowing your real, after-fee income is essential for pricing, budgeting and tax, which the next two lessons cover.
      `,
        [
          q('Why might two freelancers earning the same dollars receive different rupee amounts?', [
            'Banks pay more to experienced freelancers',
            'Fees and conversion rates differ between withdrawal methods',
            'Clients pay different amounts for the same invoice',
            'The government sets a separate rate for each freelancer',
          ], 1, 'Platform fees, withdrawal fees and conversion margins vary by method, changing how many rupees arrive.'),
          q('What does the lesson suggest about timing currency conversions?', [
            'Always wait for the rupee to weaken before converting',
            'Convert everything to another currency first',
            'Never convert dollars at all',
            'Convert what you need and avoid speculating, since rates are unpredictable',
          ], 3, 'Exchange rates cannot be timed reliably, so converting for your needs without speculation is the safer approach.'),
          q('Why should your minimum rate change when a platform raises its fees?', [
            'Your rate is calculated on after-fee income, which the higher fee reduces',
            'Platforms require you to raise rates',
            'Clients expect prices to change monthly',
            'Higher fees reduce your billable hours',
          ], 0, 'A higher fee lowers the money you keep from each dollar, so the gross rate must rise to reach the same after-fee income.'),
        ]
      ),
      lesson('Tax, FBR Filing and PSEB Registration', 14, `
Many freelancers in Pakistan worry about tax and avoid the topic entirely. That usually costs them more: non-filers typically pay higher withholding taxes on banking and many other transactions, and they miss benefits available to registered IT exporters. Filing properly is often cheaper than not filing, and it builds a financial record that helps with visas, loans and business growth.

This lesson explains the landscape. Tax rules and rates change with each federal budget, so confirm current details with the Federal Board of Revenue (FBR) or a qualified tax adviser before filing.

### Step 1: register with FBR

Registering on FBR's online system, called IRIS, gives you a National Tax Number (NTN), which for individuals is linked to your CNIC. Registration is free and done online.

### Step 2: file your annual return

Each year you file an income tax return declaring your income, and a wealth statement listing your assets. The deadline is usually 30 September for the previous tax year, which runs from July to June, though the FBR sometimes extends it. Filing on time puts you on the Active Taxpayers List (ATL).

| Filer (on the ATL) | Non-filer |
|---|---|
| Lower withholding tax on many transactions | Higher withholding rates on many transactions |
| Proof of income for visas and loans | Harder to prove legitimate income |
| Eligible for reduced rates available to IT exporters | May miss those reduced rates |

### How freelance income is treated

Income from providing IT and IT-enabled services to clients abroad, received through proper banking channels, has generally been treated as export of services, which has had lower tax rates than ordinary income, especially for those registered with the Pakistan Software Export Board. The exact rates and conditions are set in each year's Finance Act, so check them for the year you are filing. This is where the bank certificates from the first lesson become essential: they show the income was received from abroad through official channels.

### PSEB freelancer registration

The Pakistan Software Export Board (PSEB) offers registration for individual IT freelancers. Registration involves an application and a fee, and gives you a certificate recognising you as an IT exporter. Benefits have included eligibility for reduced tax rates on IT export income and access to programmes and events. Check PSEB's website for current requirements, fees and benefits.

### A simple annual routine

\`\`\`text
Throughout the year
- Keep platform statements and bank remittance certificates
- Record income and business expenses monthly
- Set aside a percentage of every withdrawal for tax

Before the deadline
- Confirm current rates and rules for the tax year
- File the return and wealth statement on IRIS
- Check that your name appears on the Active Taxpayers List
\`\`\`

### Get help when you need it

Many tax practitioners help freelancers file for a modest fee, and the FBR provides guides and helplines. Paying for help in your first year, then learning to do it yourself, is a sensible approach. What matters most is starting: an honest, filed return is far better than waiting until you are "big enough".

### Keep business and personal separate

As your income grows, a separate bank account for freelance income makes your records much clearer, simplifies filing and makes the next step of registering a business, covered in chapter 12, straightforward.
      `,
        [
          q('What is the main practical cost of not filing taxes as a freelancer?', [
            'Your platform account is closed immediately',
            'Clients cannot hire you',
            'Non-filers typically face higher withholding taxes and miss IT export benefits',
            'You cannot withdraw any money',
          ], 2, 'Being off the Active Taxpayers List generally means paying higher withholding on transactions and losing access to reduced rates.'),
          q('Why confirm tax rates each year before filing?', [
            'Rates are secret until the deadline',
            'Rates depend on the client\'s country',
            'Rates only change for companies',
            'Rules and rates are set by each year\'s Finance Act and can change',
          ], 3, 'Each federal budget can change tax rates and conditions, so current rules must be checked for the year being filed.'),
          q('What does PSEB freelancer registration provide?', [
            'Recognition as an IT exporter and eligibility for benefits such as reduced rates',
            'A guaranteed number of clients each month',
            'Automatic exemption from filing returns',
            'A free laptop and internet connection',
          ], 0, 'PSEB registration recognises you as an IT exporter, which has made you eligible for reduced tax rates and other programmes.'),
        ]
      ),
      lesson('Records, Invoices and a Freelance Budget', 12, `
A salaried employee knows exactly what arrives on the first of the month. A freelancer might earn a great deal in March and very little in April. Irregular income is manageable, but only with simple records and a budget designed for it. These habits also make tax filing, loan applications and business growth far easier.

### Keep a simple income log

A spreadsheet is enough. Record every payment:

| Date | Client | Platform | Gross USD | Fees USD | Net USD | PKR received | Withdrawal date |
|---|---|---|---|---|---|---|---|
| 3 Mar | Emma Store | Upwork | 400 | 40 | 360 | 99,900 | 7 Mar |
| 12 Mar | Ahmed Clinic | Direct | 250 | 0 | 250 | 69,500 | 14 Mar |

Add business expenses in a second sheet: software subscriptions, internet, electricity share, equipment and courses. These records support your tax return and show which clients and services are most profitable.

### Invoices for direct clients

Platforms create invoices automatically. For clients you work with directly, send a professional invoice:

\`\`\`text
INVOICE  #2025-014
From:     Ayesha Khan, Brand Designer, Lahore, Pakistan
          NTN: [your NTN]
To:       Northfield Coffee Ltd, Manchester, UK
Date:     5 March 2025
Due:      19 March 2025

Description                              Amount
Logo refresh and brand guide              USD 450
Social media template set (10 designs)    USD 150
Total                                     USD 600

Payment: bank transfer to [account name, bank, IBAN, SWIFT]
\`\`\`

Number invoices in order, keep copies, and match each one to the payment when it arrives.

### Budgeting for irregular income

The key idea is to pay yourself a steady salary from a buffer, rather than spending whatever arrives each month:

\`\`\`text
1. Every payment goes into a "business" account.
2. Set aside tax (a percentage you have checked) into a separate saving.
3. Pay yourself a fixed monthly amount into your personal account.
4. Anything left stays as a buffer for slow months.
\`\`\`

In a great month, the buffer grows. In a slow month, your salary still arrives from the buffer. Life stays stable even when income does not.

### Build an emergency fund

Aim to build a buffer covering at least three months of personal and business costs, and grow towards six months over time. This protects you from slow seasons, a paused account, a lost client, a broken laptop or illness. It also lets you say no to bad projects, since you are not desperate for any work.

### Plan for equipment and growth

Set aside a small amount each month for replacing your laptop, upgrading your internet or power backup, and learning new skills. Sudden large expenses then come from savings rather than debt.

### Review monthly

Spend thirty minutes at the end of each month updating the log, checking the buffer and comparing income with your minimum rate from chapter 7. Freelancers who review their numbers monthly catch problems early: a client paying late, rising fees, or too much time on low-paying work.
      `,
        [
          q('What is the main purpose of paying yourself a fixed monthly salary from a buffer?', [
            'To avoid keeping any records',
            'To pay less tax',
            'To keep personal income stable even when earnings vary',
            'To impress clients with a large balance',
          ], 2, 'A buffer smooths irregular income, so your personal finances stay stable through good and slow months.'),
          q('What should an invoice for a direct client include?', [
            'Only the total amount and your first name',
            'Number, parties, dates, itemised work and payment details',
            'Your platform password so the client can check your balance',
            'A request for a five-star review before payment',
          ], 1, 'A complete, numbered invoice creates a clear record for both sides and supports your accounting and tax filing.'),
          q('Why build an emergency fund of several months\' costs?', [
            'Banks require it for freelancers',
            'It replaces the need for tax filing',
            'Platforms pay interest on it',
            'It protects you in slow months and lets you turn down bad projects',
          ], 3, 'A financial buffer covers unexpected gaps and gives you the freedom to decline work that does not meet your standards.'),
        ]
      ),
      ],
      [
      q('Which is a common, legitimate withdrawal route for Fiverr sellers in Pakistan?', [
        'PayPal',
        'An informal exchange agent',
        'A friend\'s foreign bank account',
        'Payoneer to a local bank account',
      ], 3, 'Payoneer is widely used by Pakistani sellers, while PayPal is unavailable and informal routes put money and records at risk.'),
      q('Where can a freelancer lose money between a client\'s payment and their bank account?', [
        'Only in the platform\'s service fee',
        'Platform fees, withdrawal fees and currency conversion margins',
        'Nowhere, as all transfers are free',
        'Only in bank charges',
      ], 1, 'Several small deductions add up, which is why comparing methods and rates increases what you receive.'),
      q('What does being on FBR\'s Active Taxpayers List generally give you?', [
        'Exemption from all taxes',
        'A guaranteed loan',
        'Lower withholding tax on many transactions and proof of income',
        'Free internet from the government',
      ], 2, 'Filers on the ATL generally pay lower withholding rates and can show documented income for visas, loans and business needs.'),
      q('A freelancer earns a lot in March and little in April. What habit keeps their life stable?', [
        'Paying themselves a fixed monthly amount from a buffer',
        'Spending everything earned in March immediately',
        'Taking any work at any price in April',
        'Stopping all record keeping',
      ], 0, 'Paying a steady salary from saved earnings smooths out irregular months without desperate decisions.'),
      ]
    ),
    chapter(
      'Reviews, Rankings and Repeat Work',
      'Deliver work that earns five-star reviews, understand Upwork\'s Job Success Score and Fiverr\'s seller levels, turn single projects into long-term clients, and ask for referrals naturally.',
      [
      lesson('Delivering So Clients Leave Five Stars', 13, `
On freelance platforms, reviews are your currency. Clients read them before they read your profile, and platforms use them to decide who appears in search results. Great reviews rarely come from luck. They come from how you finish a project as much as from the work itself.

### The delivery moment matters most

A client's feeling at the moment of delivery shapes the review they leave. The same work can earn four stars or five depending on how it is handed over. Compare:

| Weak delivery | Strong delivery |
|---|---|
| "Done, files attached." | A short summary of what was delivered and how it meets the goal |
| Raw files with confusing names | Organised files with clear names and a short guide |
| Nothing about next steps | Tips on using or maintaining the work |
| Delivered at 11:59pm on the deadline | Delivered on time, ideally a little early |

### A delivery message template

\`\`\`text
Hi Emma,

The store speed work is complete. Here is a summary:

What changed
- Product images compressed, average page weight down noticeably
- Two unused apps removed, one slow script replaced
- Checkout tested on Android and iPhone

What to check
- The home and product pages on your phone
- A test order through checkout

For the future
- Upload new images at the recommended size (guide attached)
- Before adding a new app, test it on the duplicate theme first

It was a pleasure working on this. Let me know if anything needs a tweak.

Bilal
\`\`\`

The client understands the value, knows how to check it, and feels looked after. That feeling becomes the review.

### Exceed expectations, carefully

Small extras make a big impression: a short screen recording walking through the work, a checklist for maintaining it, or a quick fix you noticed along the way. Keep extras small and relevant. Large unrequested extras can confuse clients or create expectations for future projects.

### Handle final feedback before closing

Before the contract or order closes, ask whether everything meets expectations. If something is not quite right, fix it now. A problem solved before the review is written rarely appears in it.

### Asking for a review

On most platforms the client is prompted automatically, but a friendly note helps:

\`\`\`text
"If you are happy with the work, a short review would mean a lot and
helps other clients find me. Thank you!"
\`\`\`

Never offer money, discounts or extra work in exchange for a positive review, and never ask a client to change a review. Platforms treat review manipulation seriously, and it can lead to account penalties.

### Private feedback exists too

On Upwork, clients can also give private feedback that you cannot see, and it influences your Job Success Score. A client may leave a polite public review but a less positive private rating if they felt the communication was poor. The only reliable strategy is to make every part of the experience genuinely good, not only the parts that are visible.
      `,
        [
          q('What makes the strongest delivery message?', [
            '"Done, files attached."',
            'A long apology for any possible mistakes',
            'A summary of what changed, what to check and tips for the future',
            'A request for payment only',
          ], 2, 'Explaining the value, how to verify it and how to maintain it makes the client feel looked after, which shapes their review.'),
          q('Which is acceptable when asking for a review?', [
            'A friendly note explaining that a review helps other clients find you',
            'Offering a discount for a five-star review',
            'Asking the client to change a four-star review to five',
            'Promising free extra work in exchange for a positive review',
          ], 0, 'A polite request is fine, but offering incentives or pressuring clients to change reviews breaks platform rules.'),
          q('Why should you ask whether everything meets expectations before the contract closes?', [
            'To delay the payment',
            'Because platforms require a second delivery',
            'To request more money',
            'So any problem can be fixed before the client writes the review',
          ], 3, 'Issues solved before closing rarely appear in reviews, while unresolved ones often do.'),
        ]
      ),
      lesson('Job Success Score and Seller Levels', 13, `
Beyond individual reviews, both major platforms summarise your track record in a score or level. These strongly affect how often your profile or gigs appear in search and how much clients trust you. Understanding what influences them helps you protect them, without obsessing over every number.

### Upwork's Job Success Score

The Job Success Score (JSS) is a percentage shown on your profile once you have enough completed work. Upwork does not publish its exact formula, but its help pages explain the main influences:

- Public and private feedback from clients.
- Long-term relationships and repeat work from the same clients.
- Contracts that end without clear outcomes, which can count against you in some cases.

Upwork also awards badges such as Rising Talent for promising new freelancers, and Top Rated and Top Rated Plus for consistently strong freelancers who meet the requirements. Badges improve visibility and trust.

### Fiverr's seller levels

Fiverr ranks sellers in levels, from new sellers through Level 1, Level 2 and Top Rated. Progress depends on criteria that Fiverr publishes and updates, which have included a success score reflecting client satisfaction, ratings, response rate, completed orders, earnings and time active on the platform. Levels bring benefits such as more visibility and additional features.

Because both systems change over time, read the current help pages rather than relying on older advice in videos or forums.

### What reliably protects your score

| Protects your score | Damages your score |
|---|---|
| Clear scope before starting | Taking jobs outside your skill |
| Regular updates and early warnings | Missed deadlines and silence |
| Closing contracts properly with a clear outcome | Contracts left open with no activity |
| Repeat work with good clients | Many one-off jobs that end badly |
| Politely declining unsuitable projects | Accepting every job and delivering poorly |
| Resolving concerns before closing | Cancellations and disputes |

### Choosing clients carefully

A single difficult client can affect your score more than several good ones improve it, especially early when you have few projects. Check a client's history before accepting: payment verification, past hires, reviews they have left for others, and how they communicate in the first messages. Declining a risky project is often better for your career than winning it.

### Ending contracts cleanly

On Upwork, close contracts when work is complete, and agree with the client when a contract should end. Long-inactive contracts can create uncertainty in your record. On Fiverr, avoid cancellations where possible by clarifying requirements before an order starts, for example with good gig requirements questions.

### Keep perspective

A score dip after one difficult project is frustrating, but scores recover with steady good work. Focus on the behaviours in the table, not on refreshing your profile every hour. Freelancers who concentrate on genuinely happy clients find the numbers follow.
      `,
        [
          q('What does Upwork\'s Job Success Score take into account?', [
            'Only the number of hours you have worked',
            'Public and private feedback, long-term relationships and contract outcomes',
            'How many Connects you have bought',
            'The length of your profile description',
          ], 1, 'Upwork\'s help pages describe JSS as reflecting client feedback, repeat relationships and how contracts end, though the exact formula is not published.'),
          q('Why read the platform\'s current help pages about levels and scores?', [
            'The criteria are secret and never published',
            'Old videos are always more accurate',
            'Levels are identical on every platform',
            'Criteria change over time, so older advice may be out of date',
          ], 3, 'Platforms update their ranking and level systems, so the current official pages are the reliable source.'),
          q('Why can declining a risky project protect your career?', [
            'Platforms reward freelancers who decline most jobs',
            'Declining raises your hourly rate automatically',
            'One bad outcome can hurt your score more than several good ones help, especially early',
            'Clients cannot see declined projects',
          ], 2, 'With few completed projects, a single poor outcome weighs heavily, so choosing clients carefully protects your record.'),
        ]
      ),
      lesson('Turning One Project Into a Long-Term Client', 12, `
Finding a new client takes time: searching, writing proposals, discovery calls and building trust. Keeping a good client takes a fraction of that effort. The most successful freelancers build much of their income from a small group of long-term clients who come back again and again.

### Why repeat clients matter so much

| One-off clients | Long-term clients |
|---|---|
| New proposals and Connects for each job | Work arrives without bidding |
| Trust built from zero every time | Trust already exists |
| Unpredictable monthly income | Steadier, more predictable income |
| Learning a new business each time | You understand their business deeply |
| One review each | Stronger long-term relationship signals on the platform |

### Look for the next need during the project

While working, you learn about the client's business. Note the problems you see that are outside the current scope. Mention them at the right moment, usually at delivery, without pressure:

\`\`\`text
"While working on the product pages, I noticed your abandoned cart
emails are not set up. Many stores recover some lost sales this way.
If you would like, I can set up a simple sequence as a small follow-on
project."
\`\`\`

This is not pushy selling. It is useful advice from someone who knows their store.

### Stay in touch after the project

After a project ends, a brief message a few weeks later keeps you in mind:

\`\`\`text
"Hi Ahmed, hope the new booking page is working well for the clinic.
Have the online bookings picked up since launch? Happy to help if
anything needs adjusting."
\`\`\`

Keep it genuine and occasional, perhaps every month or two. Avoid spamming clients with offers.

### Offer ongoing support

Many clients need regular help after the first project: monthly website maintenance, a set number of social media posts every week, ongoing bookkeeping, or a fixed number of video edits each month. Offering a simple ongoing arrangement, which chapter 12 develops into retainers, turns one project into a steady relationship.

### Make it easy to come back

- Keep notes on each client: their preferences, brand colours, logins they have given you access to, and past decisions.
- Keep project files organised so you can pick up quickly months later.
- Respond fast to returning clients; they notice when you remember them.
- Honour your past pricing for a reasonable time, and give notice before changes.

### Know when to let go

Not every client should be kept. If a client constantly disrespects boundaries, pays late or offers only low-paid work, a long-term relationship may hold you back. Freeing time from a difficult client often creates space for a much better one.

### A small book of great clients

Five good long-term clients can support a stable freelance income with far less stress than a constant stream of new ones. Aim to build that small, strong base, then choose new projects because they interest you, not because you are desperate.
      `,
        [
          q('Why are long-term clients so valuable?', [
            'Work arrives without bidding, trust already exists and income is steadier',
            'They always pay more per hour than new clients',
            'Platforms charge them no fees',
            'They never need updates or communication',
          ], 0, 'Repeat clients save you the cost of finding new work and provide predictable income built on established trust.'),
          q('What is a good way to suggest further work to a current client?', [
            'Refuse to deliver until they agree to more work',
            'Send daily sales messages after the project ends',
            'Mention a problem you noticed and offer to help as a follow-on project',
            'Add extra work and charge for it without asking',
          ], 2, 'Suggesting genuinely useful next steps, without pressure, comes across as helpful advice rather than selling.'),
          q('When might ending a long-term client relationship be the right choice?', [
            'As soon as they send a second project',
            'Whenever they ask a question',
            'After every five projects, as a rule',
            'When they constantly disrespect boundaries, pay late or offer only low-paid work',
          ], 3, 'A difficult or low-value client can consume time that could go to better clients, so letting go can improve your business.'),
        ]
      ),
      lesson('Asking for Referrals and Testimonials', 12, `
Referrals are the warmest leads a freelancer can get. A client who arrives because a friend said "you have to work with her" is already half convinced, rarely argues about price, and often becomes a long-term client too. Testimonials do similar work for people who do not know you yet. Both come most reliably when you ask for them at the right moment, in the right way.

### When to ask

The best time is when a client has just expressed happiness: right after a successful delivery, a thank-you message, or a result such as higher sales. Their satisfaction is fresh, and helping you feels natural.

### A simple referral request

\`\`\`text
"Thank you, Emma, I am so glad the store is performing better. If you
know any other store owners who are struggling with speed or checkout
issues, I would be grateful for an introduction. I will look after
them just as carefully."
\`\`\`

It is specific about who you help, so the client can think of the right person. It is easy to say no to, which paradoxically makes people more willing to say yes.

### Referrals and platform rules

Clients you find through referrals outside the platform are generally your own clients. Be careful, though, when a platform client refers someone they know through that platform relationship. Read the platform's terms about referred clients and keep the rules from chapter 9 in mind. When in doubt, the new client can simply hire you through the platform.

### Collecting testimonials

A strong testimonial is specific. "Great work!" is pleasant, but "Bilal cut our store's load time and our checkout complaints stopped" persuades. Help clients by asking guiding questions:

\`\`\`text
Would you be happy to share a few lines about working together?
These questions might help:
- What problem were you facing before?
- What was it like working with me?
- What changed after the project?
\`\`\`

Always ask permission before using a client's name, company or logo, and respect a request to stay anonymous, for example "Owner, clothing brand, Lahore".

### Where to use them

| Place | How to use testimonials |
|---|---|
| LinkedIn | Recommendations on your profile, quotes in posts |
| Portfolio site | Next to the matching case study |
| Proposals | A short, relevant quote for a similar project |
| Fiverr and Upwork | Platform reviews already do this; your profile text can mention results |

### Thank the people who refer you

When a referral becomes a client, thank the person who introduced you. A sincere message is often enough; some freelancers send a small gift. Referrers who feel appreciated tend to refer again.

### Build a referral habit

Make referral and testimonial requests part of your delivery checklist, not something you remember occasionally. Over a year, a simple habit of asking every happy client can create a steady flow of warm introductions that no amount of proposal writing can match.
      `,
        [
          q('When is the best time to ask for a referral?', [
            'Before starting any work',
            'During a disagreement about scope',
            'Right after a successful delivery, while satisfaction is fresh',
            'Only after the client has left the platform',
          ], 2, 'Clients are most willing to help when they have just experienced a good result and expressed their happiness.'),
          q('What makes a testimonial persuasive?', [
            'It is very short and general, like "Great work!"',
            'It describes the problem, the experience and what changed',
            'It is written by you without the client\'s input',
            'It includes the client\'s private contact details',
          ], 1, 'Specific testimonials describing a real problem and outcome are far more convincing to future clients than general praise.'),
          q('What should you do before using a client\'s name or logo in a testimonial?', [
            'Nothing, reviews are public anyway',
            'Pay the client a fee',
            'Change their name slightly',
            'Ask their permission and respect a request to stay anonymous',
          ], 3, 'Using names or logos requires permission, and anonymous testimonials can still be persuasive when they are specific.'),
        ]
      ),
      ],
      [
      q('What shapes a client\'s review more than almost anything else?', [
        'The price of the project',
        'How long your profile description is',
        'How the work is handed over at delivery',
        'How many other clients you have',
      ], 2, 'The delivery experience, with a clear summary and guidance, strongly shapes how satisfied the client feels when reviewing.'),
      q('Which behaviour is most likely to damage a Job Success Score or seller level?', [
        'Closing contracts properly',
        'Sending regular updates',
        'Building repeat work with good clients',
        'Missing deadlines and going silent',
      ], 3, 'Poor communication and late delivery lead to weak feedback and bad outcomes, which lower scores and levels.'),
      q('Why do many successful freelancers focus on a small group of long-term clients?', [
        'Platforms require at least five long-term clients',
        'They provide steady income with far less effort than constantly finding new clients',
        'Long-term clients are always easier to work with',
        'It removes the need for any communication',
      ], 1, 'A stable base of good repeat clients brings predictable income and trust without the constant cost of winning new work.'),
      q('What makes a referral request more effective?', [
        'Asking every client, including unhappy ones, the same way',
        'Offering money for every introduction before any work',
        'Making the request long and formal',
        'Being specific about who you help and asking at a happy moment',
      ], 3, 'Specific requests at the right time help clients think of suitable contacts and make helping you feel natural.'),
      ]
    ),
    chapter(
      'From Freelancer to Agency',
      'Build productivity systems for a solo business, package services into productised offers and retainers, bring in other freelancers safely, and register a business when growth calls for it.',
      [
      lesson('Productivity Systems for a Solo Business', 13, `
As a freelancer, you are the salesperson, project manager, accountant and the person doing the work. Without systems, the extra roles eat into billable time and cause missed messages, forgotten deadlines and late nights. Simple systems let you handle more clients with less stress, and they are the foundation for growing beyond yourself.

### One place for every task

Keep all tasks, across every client, in a single list or board. Tools such as Trello, Notion, ClickUp or even a well-organised spreadsheet work; the tool matters less than using one consistently.

| Column | What goes there |
|---|---|
| Inbox | Every new request, idea or task, captured quickly |
| This week | Tasks you have committed to this week |
| In progress | What you are working on now, ideally one or two items |
| Waiting on client | Blocked tasks, with the date you asked |
| Done | Completed tasks, useful for updates and invoicing |

The "Waiting on client" column is especially useful: it reminds you to follow up and shows clients exactly what you need from them.

### Plan the week, protect focus

Spend twenty minutes each Monday planning the week: deadlines, client calls, proposals to send and admin. Then protect blocks of focused time for deep work, such as a three-hour block for design or coding with notifications off. Check messages at set times, for example late morning and early evening, rather than constantly.

### Templates for everything you repeat

Most freelance communication repeats. Save templates for:

\`\`\`text
templates/
  proposal-website.txt
  proposal-video-editing.txt
  discovery-summary.txt
  update-weekly.txt
  change-request.txt
  delivery-message.txt
  referral-request.txt
  rate-increase.txt
\`\`\`

Personalise each one before sending, but never start from a blank page. Templates can save hours every week and keep your quality consistent even on tired days.

### A checklist for each service

For each service you offer, write a checklist of every step from kick-off to delivery. A website checklist might include backups, mobile testing, speed checks and handing over logins. Checklists prevent small mistakes that damage reviews, and later they become the training material for anyone you hire.

### Use AI and automation carefully

AI tools can help draft proposals, summarise long client messages, suggest outlines and check writing. Use them to speed up your work, but always review and personalise the output: clients notice generic, copied text, and you remain responsible for accuracy and confidentiality. Do not paste private client data into tools unless you are sure it is allowed.

### Track your time, even on fixed-price work

Recording roughly how long each project takes shows which services and clients are really profitable. You may find that a "small" monthly client takes twice the hours you thought, while another service earns far more per hour. Those insights drive better pricing and better choices.

### Rest is part of the system

Burnout is common among freelancers who work every evening and weekend. Build breaks, exercise and time off into your weekly plan. A rested freelancer makes fewer mistakes, communicates better and lasts longer in the career.
      `,
        [
          q('Why keep all tasks for every client in one place?', [
            'Platforms require a single task list',
            'It prevents missed deadlines and makes planning across clients possible',
            'Clients can edit your task list',
            'It removes the need for communication',
          ], 1, 'A single task system gives a complete view of your commitments, so nothing is forgotten and priorities are clear.'),
          q('What is the benefit of writing a checklist for each service?', [
            'It makes proposals longer',
            'It replaces the need for a contract',
            'It guarantees higher prices',
            'It prevents small mistakes and later becomes training material for helpers',
          ], 3, 'Checklists capture every step so quality stays consistent, and they help others do the work the same way when you grow.'),
          q('What is the responsible way to use AI tools in freelance work?', [
            'Send AI output to clients without reading it',
            'Paste all private client data into any tool',
            'Use them to speed up drafts, then review, personalise and protect client data',
            'Avoid mentioning that you check your work',
          ], 2, 'AI can speed up drafting, but you remain responsible for accuracy and confidentiality, so review and protect client information.'),
        ]
      ),
      lesson('Productised Services and Retainers', 13, `
Trading hours for money has a ceiling: there are only so many hours in a week. Two changes help freelancers break through it. Productised services turn custom work into a clearly defined package with a fixed price. Retainers turn one-off projects into regular monthly income.

### What a productised service looks like

A productised service has a fixed scope, fixed price, fixed timeline and a repeatable process:

\`\`\`text
Shopify Speed Tune-Up, USD 250
- Full speed audit of home, collection and product pages
- Image compression and removal of unused apps
- Fixes applied on a duplicate theme, tested, then published
- Before and after report
Delivered in 5 working days, 1 round of adjustments
\`\`\`

Fiverr gigs are productised services by design, which is why Fiverr experience is a good training ground.

### Why productising helps

| Custom projects | Productised service |
|---|---|
| New quote every time | Price already known |
| Scope negotiated for each client | Scope fixed and written |
| Process reinvented | Checklist reused, getting faster each time |
| Hard to delegate | Easy to train someone else to do |
| Clients compare hourly rates | Clients compare outcomes |

Each time you deliver the same service, you become faster and better, which increases your effective hourly rate without raising prices.

### Choosing what to productise

Look at your past projects. Which requests came up repeatedly? Which did you deliver well and enjoy? Those are candidates. Good productised services solve one clear problem for one clear type of client, such as "monthly bookkeeping for small online stores" or "ten short-form video edits a month for coaches".

### Retainers: steady monthly income

A retainer is an ongoing agreement where a client pays a fixed amount each month for a defined amount of work or availability:

| Retainer type | Example |
|---|---|
| Fixed deliverables | Eight social media posts and a monthly report |
| Block of hours | Up to 15 hours of website support each month |
| Ongoing role | Part-time virtual assistant, set hours each week |

On Upwork, retainers can run as ongoing hourly contracts or as recurring fixed-price milestones. On Fiverr, some services can be offered as subscriptions where the platform supports it; check the current options.

### Setting retainer terms

Write down what is included each month, what happens to unused hours (usually they do not roll over indefinitely), how extra work is charged, and how much notice either side gives to end it. Clear terms prevent the retainer from quietly growing into unlimited work.

### Moving a client onto a retainer

Offer a retainer when a client has come back several times with similar work:

\`\`\`text
"We have worked on your store most months this year. Would a monthly
support plan be useful? For a fixed monthly fee, I would handle updates,
speed checks and small fixes, with priority response times."
\`\`\`

Many clients welcome the predictability as much as you do.

### Building towards stability

A combination of a few retainers for a stable base, plus productised services for new clients, gives many freelancers a predictable income with room to grow.
      `,
        [
          q('What defines a productised service?', [
            'A new custom quote for every client',
            'Unlimited revisions at any time',
            'A fixed scope, price, timeline and repeatable process',
            'Charging by the hour only',
          ], 2, 'Productised services package the same well-defined outcome repeatedly, making pricing, delivery and delegation simpler.'),
          q('Why do productised services often increase your effective hourly rate?', [
            'Platforms pay a bonus for them',
            'Clients always pay extra for packages',
            'They remove all platform fees',
            'Repeating the same service makes you faster while the price stays fixed',
          ], 3, 'Repetition improves speed and quality, so the same fixed price is earned in fewer hours.'),
          q('What should retainer terms clearly state?', [
            'What is included, how unused hours and extra work are handled, and notice to end it',
            'Only the monthly price',
            'That the client can request anything at any time',
            'Nothing, retainers work best without terms',
          ], 0, 'Clear terms stop a retainer from growing into unlimited work and set expectations for both sides.'),
        ]
      ),
      lesson('Hiring and Subcontracting Other Freelancers', 13, `
There comes a point where you have more good work than you can do alone. Turning clients away is one option. Another is bringing in other freelancers to help, which is how many one-person freelance businesses become small agencies. Done well, it multiplies what you can deliver. Done badly, it damages your reputation.

### Start with the tasks you should not be doing

Look at your time log. Which tasks are necessary but do not need your specific skills? Common first tasks to delegate:

- Research, data entry and preparing assets.
- Routine edits or production work following your checklists.
- Admin such as scheduling, invoicing and organising files.
- A second skill clients keep asking for, such as copywriting alongside your design work.

### Where to find help

| Source | Good for |
|---|---|
| Your freelance network and classmates | People you already trust |
| Freelancers you meet in communities | Specialists in skills you lack |
| Platforms, hiring as a client | Clear contracts and payment protection |
| Local universities and training programmes | Juniors eager to learn |

### Test before trusting

Start any new helper on a small, paid task with clear instructions. Review the result carefully. Then increase responsibility gradually. Never put a new, untested person straight onto an important client's project.

### You remain responsible

When you subcontract, the client hired you, and your reputation is on the line. That means:

- Review everything before it reaches the client.
- Keep communication with the client in your hands, unless the client has agreed otherwise.
- Tell clients honestly if others are working on their project when that matters to them, and follow any contract terms about subcontracting or confidentiality.
- Protect client data: give helpers only the access they need and remove it when the work ends.

### Pay fairly and clearly

Agree the price, deadline and revisions with your helper in writing, just as your clients do with you. Pay on time, even if your client pays late. Reliable, fair payment is how you keep good people.

### Platform considerations

Platforms have rules on this. For example, Upwork offers agency accounts designed for teams, where work can be assigned to agency members. Fiverr sellers remain responsible for their orders and must follow Fiverr's rules on who works on them and how. Review the current terms for your platform before bringing others into platform work.

### A simple delegation brief

\`\`\`text
Task:        Resize and compress 40 product images
Client:      Clothing store (name not needed)
Standards:   Max width 2048px, under 300KB each, keep file names
Deadline:    Thursday 6pm Pakistan time
Deliver to:  Shared folder "Store images / done"
Payment:     PKR 3,000 on approval, by bank transfer
Questions:   Message me before guessing
\`\`\`

Clear briefs save more time than they take to write, and they turn your checklists into a small, reliable team.
      `,
        [
          q('How should you start working with a new helper?', [
            'Give them your most important client immediately',
            'Start with a small paid task, review it, then increase responsibility',
            'Ask them to work for free as a trial',
            'Share all your client logins on the first day',
          ], 1, 'Small paid tests let you check quality safely before trusting someone with important work.'),
          q('When you subcontract work, who is responsible for quality to the client?', [
            'The subcontractor alone',
            'The platform',
            'You, because the client hired you',
            'Nobody, once the work is shared',
          ], 2, 'The client\'s agreement is with you, so you must review and stand behind every deliverable.'),
          q('Why should you pay helpers on time even if your client pays late?', [
            'Platforms fine you for late payments to helpers',
            'Helpers can close your client\'s account',
            'It is required by the client\'s contract',
            'Reliable payment is how you keep good people working with you',
          ], 3, 'Fair, dependable payment builds trust with helpers, which is essential to growing a reliable team.'),
        ]
      ),
      lesson('Registering a Business and Planning Growth', 12, `
Many freelancers eventually ask: "Should I register a company?" The answer depends on your income, your clients and your plans. Registration can make you look more established, open business banking, help with larger clients and prepare you for hiring. It also brings more paperwork. This lesson gives a practical overview; for decisions, speak to a tax adviser or corporate consultant, since rules and procedures change.

### Common options in Pakistan

| Structure | What it means | Suits |
|---|---|---|
| Sole proprietorship | You trade under a business name; the business is legally you, taxed as an individual with an NTN | Most freelancers growing a solo or very small business |
| Partnership | Two or more people share ownership, registered with the Registrar of Firms | Friends or colleagues building together |
| Single Member Company (SMC-Private) | A company with one shareholder, registered with the SECP | Freelancers wanting a separate legal entity |
| Private Limited Company | A company with two or more shareholders, registered with the SECP | Growing agencies, especially with partners or investors |

A company registered with the Securities and Exchange Commission of Pakistan (SECP) is a separate legal entity, with its own tax registration and annual compliance, such as filing returns and keeping proper accounts. The SECP offers online registration; check its website for current steps and fees.

### Signs it may be time

- Clients ask for a company invoice or a registered business to contract with.
- You are hiring or subcontracting regularly.
- Your income is large enough that professional accounting pays for itself.
- You want to apply for business bank accounts, office space or government programmes.

### Keep your tax benefits in view

Registering a business affects how your income is taxed, how IT export benefits apply and whether you need separate PSEB registration for the company. Before changing structure, ask an adviser to compare your current position with the new one.

### Plan the next twelve months

Growth works best with a simple written plan:

\`\`\`text
Where I am now
- Monthly income:           USD 1,400, mostly Upwork
- Services:                 Shopify speed and setup
- Clients:                  3 retainers, 2 to 4 projects a month

Where I want to be in 12 months
- Monthly income:           USD 3,000
- Channels:                 Upwork, LinkedIn and referrals
- Offer:                    Two productised services plus retainers
- Team:                     One part-time helper for routine tasks

This quarter
- Launch the speed tune-up package
- Publish two LinkedIn case studies a month
- Hire and train one helper on image optimisation
\`\`\`

### Reduce dependence on one platform

Chapter 9 showed that platforms can change fees, rules and rankings. A healthy business has several sources of clients: a platform or two, LinkedIn, referrals and a simple website. If any one changes, your business continues.

### Keep learning

The skills that won your first clients will not stay in demand forever. Set aside time each month to learn, whether a new tool, a deeper specialism or business skills like sales. Freelancers who keep learning keep raising their rates, and some of them go on to build the agencies that hire the next generation of freelancers.
      `,
        [
          q('Which structure means the business is legally you, taxed as an individual?', [
            'Sole proprietorship',
            'Private limited company',
            'Single member company',
            'Partnership registered with the SECP',
          ], 0, 'A sole proprietorship trades under a business name but is not a separate legal entity, so income is taxed as the owner\'s.'),
          q('Why speak to an adviser before changing your business structure?', [
            'Registration is always free and has no effects',
            'Clients require an adviser\'s signature',
            'It affects taxation, IT export benefits and compliance duties',
            'Platforms close accounts that register companies',
          ], 2, 'A new structure changes how income is taxed and what filings are required, so the trade-offs should be compared first.'),
          q('Why should a growing freelance business have several client sources?', [
            'Platforms require it for Top Rated status',
            'It removes the need for proposals',
            'It guarantees a higher tax rate',
            'If one platform changes rules or rankings, the business continues',
          ], 3, 'Relying on one channel creates risk, while several sources keep work flowing if any one changes.'),
        ]
      ),
      ],
      [
      q('What is the main purpose of templates in a freelance business?', [
        'To send identical messages without reading them',
        'To avoid personalising anything for clients',
        'To make proposals longer',
        'To save time and keep quality consistent, personalised before sending',
      ], 3, 'Templates remove the blank-page problem and keep communication consistent, while personalisation keeps them relevant.'),
      q('A client has returned with similar work every month for a year. What does the chapter suggest offering?', [
        'A one-time discount only',
        'A monthly retainer with clear terms',
        'A new custom quote each time',
        'A referral to another freelancer',
      ], 1, 'Regular repeat work is a natural fit for a retainer, giving both sides predictable scope and income.'),
      q('When you bring in a subcontractor, what stays your responsibility?', [
        'Quality, client communication and protecting client data',
        'Nothing, once the work is delegated',
        'Only paying the platform fee',
        'Only the subcontractor\'s tax filing',
      ], 0, 'The client hired you, so you review the work, manage the relationship and control access to their data.'),
      q('Which registration option creates a separate legal entity with one shareholder?', [
        'Sole proprietorship',
        'Partnership',
        'Single Member Company registered with the SECP',
        'An NTN as an individual',
      ], 2, 'A Single Member Company is registered with the SECP as a separate legal entity owned by one shareholder.'),
      ]
    ),
  ],
  final: [
    q('What do clients on freelance platforms mainly pay for?', [
      'The number of tools a freelancer knows',
      'The longest possible list of skills',
      'An outcome delivered with low risk',
      'The freelancer\'s years of education',
    ], 2, 'Clients hire to solve a problem, so they buy a reliable outcome and choose the freelancer who seems least risky.'),
    q('Which platform generally suits packaged services with set prices best?', [
      'Fiverr',
      'LinkedIn',
      'A personal blog',
      'Email newsletters',
    ], 0, 'Fiverr is built around gigs with defined packages, while Upwork suits custom work and LinkedIn builds trust and relationships.'),
    q('What makes a portfolio piece persuasive to a client?', [
      'Including every project you have ever done',
      'Using only stock images of finished products',
      'Hiding the problem so the result looks effortless',
      'Showing the problem, your approach and the result',
    ], 3, 'Clients relate to a clear problem and result, which proves you can deliver the outcome they need.'),
    q('How should practice or concept work be shown in a portfolio?', [
      'Presented as paid client work',
      'Labelled clearly as concept or practice work',
      'Removed entirely from every profile',
      'Credited to a well-known brand without permission',
    ], 1, 'Honest labelling keeps trust intact while still demonstrating your skills.'),
    q('What should an Upwork profile title communicate?', [
      'Every skill you have, separated by commas',
      'The problem you solve for a specific client',
      'Your full name and city only',
      'That you can do any job at all',
    ], 1, 'A focused title tells the right clients quickly what you solve, which improves both search relevance and invitations.'),
    q('Why does Upwork allow only one account per person?', [
      'To limit how many proposals you can read',
      'Because profiles cannot be edited later',
      'To keep freelancers from using specialised profiles',
      'To keep identities verified and trustworthy for clients',
    ], 3, 'Verified single accounts protect clients from fake identities, and duplicate accounts can lead to suspension.'),
    q('How should a strong Upwork proposal open?', [
      'With the client\'s problem and how you would solve it',
      'With your life story and qualifications',
      'With a request for the client\'s budget',
      'With a generic greeting copied for every job',
    ], 0, 'Opening with the client\'s problem shows you read the post and immediately signals relevance.'),
    q('What is the best way to spend Connects?', [
      'On every new job, as fast as possible',
      'Only on jobs with the largest budgets',
      'On jobs that match your skills well',
      'On jobs with the most proposals already',
    ], 2, 'Connects cost money, so applying where your fit is strongest gives the best chance of a return.'),
    q('On Fiverr, why does the middle package matter?', [
      'Fiverr only shows the middle package in search',
      'Buyers cannot purchase the other packages',
      'It must always be the cheapest option',
      'Many buyers choose it, so it should be your best-value offer',
    ], 3, 'The middle tier often attracts the most buyers, so designing it as the strongest value option lifts sales.'),
    q('What should a LinkedIn headline do?', [
      'Say who you help and what you deliver',
      'List every job title you have ever held',
      'Stay blank so people click on your profile',
      'Include only your university and graduation year',
    ], 0, 'A clear headline tells visitors within seconds whether you solve their problem, which turns views into conversations.'),
    q('What separates good LinkedIn outreach from spam?', [
      'Sending the same pitch to hundreds of people daily',
      'Pitching your services in the connection request itself',
      'Relevant, personal messages that lead with value',
      'Messaging everyone who views your profile about prices',
    ], 2, 'Personal, relevant outreach that offers value builds conversations, while mass pitches are ignored or reported.'),
    q('A client\'s scope is unclear and may change. Which pricing model is fairest?', [
      'Value pricing',
      'Hourly pricing',
      'Fixed pricing without a written scope',
      'Free work until the scope is clear',
    ], 1, 'Hourly pricing pays you for investigation and change while the client only pays for work that is actually needed.'),
    q('A client says your quote is above their budget. What is the stronger response?', [
      'Reduce the scope to fit, keeping your rate',
      'Cut the price immediately to win the job',
      'Refuse any further discussion of the project',
      'Accept, then quietly deliver lower quality work',
    ], 0, 'Adjusting what is delivered keeps your prices credible while giving the client a workable option.'),
    q('What should follow every discovery call?', [
      'An invoice for the time spent on the call',
      'Starting work before the client replies',
      'A second call to repeat everything discussed',
      'A written summary of goal, scope and deadline',
    ], 3, 'A written summary records what was agreed and prevents misunderstandings about scope later.'),
    q('A client asks for new work outside the agreed scope. What is the recommended approach?', [
      'Do it silently for free to keep them happy',
      'Refuse and close the contract immediately',
      'Treat it as an add-on with price and timing options',
      'Ignore the request until the project ends',
    ], 2, 'Framing extra work as an optional add-on keeps the relationship warm while protecting your time and pricing.'),
    q('On an Upwork fixed-price contract, when should you start a milestone?', [
      'As soon as the client sends a message',
      'Once it is funded in escrow',
      'After delivering all the files first',
      'When the client promises to fund it later',
    ], 1, 'A funded milestone is held in escrow by the platform, so waiting for funding means your payment is protected.'),
    q('What is the most common first sign of a freelance scam?', [
      'A detailed written job description',
      'A client with a verified payment method',
      'A small, funded first milestone',
      'A request to move off the platform before hiring',
    ], 3, 'Scammers move conversations away from the platform, where their actions are not monitored and you lose protection.'),
    q('Which is a legitimate way for Pakistani freelancers to receive platform earnings?', [
      'Payoneer or direct transfer to their own bank',
      'A friend\'s PayPal account in another country',
      'An informal agent offering better exchange rates',
      'Cash collected from a stranger who buys your balance',
    ], 0, 'Official channels in your own name protect your money and create records, while informal routes risk fraud and frozen funds.'),
    q('Why is filing taxes with FBR usually worthwhile for freelancers?', [
      'It removes the need to keep any records',
      'Filers generally pay lower withholding and can prove income',
      'It guarantees more clients on every platform',
      'It replaces the need for a bank account',
    ], 1, 'Filers on the Active Taxpayers List generally face lower withholding and can document income for visas, loans and growth.'),
    q('What most improves a freelancer\'s income stability over time?', [
      'Taking every job regardless of price',
      'Relying on a single platform for all clients',
      'Repeat clients, retainers and several client sources',
      'Changing services every month to follow trends',
    ], 2, 'Long-term clients, retainers and multiple channels create predictable income that survives changes on any one platform.'),
  ],
});
