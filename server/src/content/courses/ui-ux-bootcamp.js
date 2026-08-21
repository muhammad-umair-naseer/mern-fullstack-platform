import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'ui-ux-bootcamp',
  title: 'UI/UX Design Bootcamp',
  category: 'UI/UX',
  level: 'Beginner',
  duration: '8 weeks',
  accent: 'rose',
  coverKey: 'ui-ux-bootcamp',
  summary:
    'Learn to design interfaces people can actually use — from the first user interview to a tested, accessible, production-ready design system.',
  description:
    'You research real users, map their journey, structure the information, and build the screens — wireframe to type scale to colour system to Figma prototype. Then you test the result with people, fix what breaks, and hand off something a developer can build.',
  chapters: [
    chapter(
      'Research and the People You Design For',
      'Finding out what users actually do, and turning those findings into personas and journey maps that settle arguments.',
      [
        lesson('Interviews That Produce Facts, Not Flattery', 14, `
Design starts with a problem you did not invent. The fastest way to find one is to talk to people — but only if you ask the right kind of question.

### What people say is not what people do

Ask "would you use a feature that tracks your study streak?" and roughly everyone says yes. It is free to agree, it makes the asker happy, and imagining a future self is cheap. The answer tells you nothing.

Ask instead: "Tell me about the last time you tried to keep up with an online course. What happened?" Now they are describing **memory, not imagination** — and memory contains details you can design against.

| Weak question | Why it fails | Stronger version |
|---|---|---|
| Would you pay for this? | Hypothetical; costs nothing to say yes | What do you currently pay for to solve this? |
| Do you find the dashboard confusing? | Leading, and yes/no | Walk me through what you did the last time you opened it |
| How often do you study? | Invites an aspirational number | When did you last sit down to study? What was that session like? |
| Would a reminder help? | Pitching, not researching | What made you stop last time you dropped a course? |

### The shape of a 30-minute interview

\`\`\`text
0–3 min   Warm-up. Their role, their context. No product talk.
3–8 min   The last time. "Tell me about the most recent time you..."
8–20 min  Dig. Follow every concrete detail with "what happened next?"
20–26 min Workarounds. "Is there anything you do to get around that?"
26–30 min Anything I should have asked? Who else should I talk to?
\`\`\`

Workarounds are the richest section in the whole interview. A spreadsheet someone maintains by hand, a screenshot they keep in their photos, a group chat they use as a to-do list — every one of those is a feature the market failed to ship, and evidence of a need strong enough to make someone do manual work.

### The five whys, used lightly

When someone states a preference, ask why once or twice. "I always use the mobile app." *Why?* "The laptop is in the other room." *Why does that matter?* "I study on the bus." You started with a platform preference and ended with a **context** — noisy, one-handed, interrupted, offline half the time. That context changes your typography, your tap targets, and your autosave behaviour.

Stop at two or three. Pushed further, people invent reasons to satisfy you.

### The classic mistake

The single most common failure in real research is **pitching during the interview**. The moment you say "so what we are building is...", the participant switches from informant to guest, and guests are polite. Everything after that point is contaminated. Describe your idea at the end, or in a separate session, never in the middle.

The second most common failure is taking only summary notes. Write down **verbatim quotes**. "I gave up because I could never find where I left off" is usable evidence; "user found navigation hard" is your interpretation already baked in, and you will not be able to unbake it three weeks later.

### How many people

Five to eight per distinct user group. You are looking for patterns, not statistical significance — by the fifth conversation the same complaints start repeating, and a sixth rarely changes the design. If you have two genuinely different groups (say students and instructors), that is five to eight *each*, not five in total.

Record with permission, note the timestamp when something surprises you, and write up within 24 hours while you can still hear the tone.
        `),
        lesson('Personas That Can Settle an Argument', 13, `
A persona is a decision-making tool. If it cannot end a debate about what to build, it is a poster.

### The persona that does nothing

> **Sarah, 34.** Marketing manager from Lahore. Loves yoga, travel, and oat-milk lattes. Tech-savvy. Wants a beautiful, intuitive experience.

Every product team has one of these. Notice that nothing in it constrains a single design decision. "Intuitive" is not a requirement. Yoga is not a use case. Age 34 does not tell you whether she uses one hand on a bus.

### The persona that does something

> **Sara — the interrupted learner.** *Primary persona.*
> **Context:** studies in 15–25 minute blocks on a phone, usually commuting, often on a weak connection.
> **Goal:** finish the certificate before her appraisal in March.
> **Behaviour we observed:** resumes on a different device than she left on, 4 of 6 participants. Skips text and hunts for the video. Uses screenshots as bookmarks.
> **Frustration:** "I could never find where I left off." (P3, verbatim)
> **Kills:** an onboarding tour, a desktop-first layout, anything that loses scroll position.
> **Demands:** resume-where-you-left-off on every surface, offline-tolerant progress saving, tap targets usable one-handed.

Now run a feature debate through it. Should the course page open at the top or at the last lesson? Sara answers that in one line. That is the whole test: **a good persona is a rule you can apply, not a person you can picture.**

### Build them from behaviour, not demographics

Cluster your interview notes by what people *do*, not who they are. Two 22-year-old students who behave differently belong to different personas; a 22-year-old and a 45-year-old with identical behaviour belong to the same one. Age, gender, and city earn a place only when they change a design decision — screen size, language, literacy, connection quality usually do; hobbies almost never.

Useful clustering axes:

- **Frequency** — daily vs. occasional. Daily users want density and shortcuts; occasional users want signposting.
- **Expertise** — do they know the domain vocabulary? This decides your labels.
- **Context** — device, environment, interruption level, connectivity.
- **Motivation** — obligation (employer required it) behaves differently from curiosity.

### Three, and one of them is primary

Beyond three personas nobody remembers them and the set stops functioning. Name **one primary persona**: the person whose needs the interface must satisfy completely, even at some cost to the others. Without a declared primary, every trade-off reopens the argument you built personas to close.

The others are secondary — you accommodate them where it is cheap, but they do not get to bend the core flow.

### Jobs to be done, if personas feel fluffy

An alternative framing that some teams find sharper:

> **When** I have a 20-minute commute, **I want to** continue exactly where I stopped, **so I can** finish a lesson before I arrive.

This deliberately drops the person and keeps the situation. It is excellent for feature decisions and weaker for empathy and tone. Use whichever your team will actually reference — both fail identically if they get written once and filed.

### The rule that keeps them honest

Every claim on a persona needs a source: an interview quote, an analytics number, a support ticket. If you cannot cite where a line came from, you invented it, and invented details are how a persona quietly turns back into a poster.
        `),
        lesson('Journey Maps and Where the Pain Actually Is', 13, `
A persona tells you who. A **journey map** tells you where it goes wrong — laid out in time, across every channel, including the parts that are not your product.

### The anatomy

A journey map is a table read left to right. Stages across the top, the same rows down the side every time:

| | Discover | Decide | Sign up | First lesson | Week 2 | Finish |
|---|---|---|---|---|---|---|
| **Doing** | Sees an ad | Compares 3 courses | Fills form | Watches lesson 1 | Opens app on bus | Downloads certificate |
| **Thinking** | "Is this legit?" | "Is 8 weeks realistic?" | "Why do they need my phone?" | "This is fine" | "Where was I?" | "Can I show this to an employer?" |
| **Feeling** | Curious | Anxious | Suspicious | Confident | **Frustrated** | Proud |
| **Pain** | No pricing on the card | No syllabus visible | 9 required fields | — | Resumes at top of course | Certificate has no verify link |
| **Opportunity** | Show price + duration | Public outline | Ask 3 fields, defer rest | — | Resume banner + deep link | Shareable verify URL |

The emotion row is not decoration. It is where you find the **drop-off** — and the trough is almost never where the team assumed. Teams polish sign-up because they can see it in the funnel; the actual failure in this map is week two, where nothing is broken but nothing helps either.

### Map what happens between sessions

The most valuable cells are usually outside your interface: the WhatsApp message asking a friend if the course is worth it, the email that arrives at a bad moment, the moment they close the laptop and never come back. If your map only contains screens you have already designed, you have drawn a **flow diagram**, not a journey — and it will only ever confirm what you already believe.

### Grounding it in numbers

Overlay whatever data you have on the stages:

\`\`\`text
Course page viewed      12,400
Started registration     3,100   (25%)
Completed registration   1,240   (40% of starts — 1,860 abandoned mid-form)
Watched lesson 1           980   (79%)
Watched lesson 4           210   (21% — the real cliff)
\`\`\`

Two numbers here reframe the project. The form loses 1,860 people, which is a UI problem you can fix in a week. But lesson 1 to lesson 4 loses 770 of 980 — a **79% collapse** — and no amount of form polish touches it. Qualitative research tells you why people leave; numbers tell you where to spend the month.

### The common mistake

Mapping only the happy path. A journey where every stage succeeds tells you nothing, because your users are not the ones who succeeded — they are the ones who hit an expired link, an out-of-stock, a failed payment, a lost password. Add a row for **what happens when this stage fails**, and design those cells. Chapter 2 turns them into real screens.

### Keep it alive

A journey map is worth making twice: once from research, and once six months later from behaviour. Put the date and the evidence source on it. An undated map from a workshop that nobody has revisited is a historical document being used as a plan.
        `),
      ],
      [
        q('A participant says "yes, I would definitely use that". Why is this weak evidence?', [
          'Because it is a hypothetical about the future, which costs nothing to agree with',
          'Because the sample size is too small to be significant',
          'Because preferences change over time',
          'Because they have not seen the final visual design yet',
        ], 0, 'Hypothetical questions measure politeness and imagination; asking about a specific past event measures behaviour.'),
        q('Which detail belongs on a useful persona?', [
          'Enjoys yoga and travel',
          'Wants a beautiful, intuitive experience',
          'Studies in 15–25 minute blocks on a phone, usually on a weak connection',
          'Is 34 years old and lives in a city',
        ], 2, 'Context that constrains a design decision — session length, device, connectivity — is what makes a persona usable.'),
        q('During an interview, a participant mentions a spreadsheet they maintain by hand. Why is this the most valuable moment?', [
          'It shows they are technically skilled',
          'It means they will pay for a product',
          'Spreadsheets are easy to replicate in an interface',
          'A workaround is proof of a need strong enough to justify manual effort',
        ], 3, 'Workarounds are unmet needs made visible — someone doing manual work has already proven the problem is worth solving.'),
        q('Your funnel shows 60% abandon the sign-up form and 79% of registrants finish lesson 1 but only 21% reach lesson 4. Where is the real problem?', [
          'The sign-up form, because 60% is the largest single percentage drop',
          'Between lessons 1 and 4, where the largest share of engaged users is lost',
          'Lesson 1, because that is the first content screen',
          'There is no problem; these are normal rates',
        ], 1, 'The form is a visible, fixable leak, but the 1→4 collapse loses far more already-committed users and needs the bigger investment.'),
      ]
    ),
    chapter(
      'Structure Before Pixels',
      'Information architecture, task flows, and wireframes — deciding what goes where before anything gets styled.',
      [
        lesson('Information Architecture and Card Sorting', 13, `
Most "the site is confusing" feedback is not a visual problem. It is a **structure** problem: things are grouped the way the company is organised rather than the way users think, and no amount of styling fixes that.

### Your org chart is not a menu

A real before/after from a training site:

\`\`\`text
BEFORE (mirrors the company)     AFTER (mirrors the user's task)
  Home                             Courses
  About Us                         Internships
  Our Services                     Certificates
  Resources                        Pricing
  Corporate                        About
  Media                            Contact
  Contact
\`\`\`

"Resources" and "Our Services" are the tell. They are containers invented because nobody could decide where three unrelated pages belonged. Users do not go looking for *resources* — they go looking for a **syllabus**, a **price**, or a **certificate**. If a nav label does not name a thing a user came for, it is a dumping ground.

### Card sorting tells you the groups

Write every page or content item on a card — 30 to 60 is the workable range. Then:

- **Open sort**: participants group the cards however they like and name each group themselves. Use this when you do not yet know the categories. The group *names* people invent are the real prize; they are your labels, in your users' vocabulary.
- **Closed sort**: you supply the categories, they file the cards. Use this to validate a structure you already drafted.

Eight to twelve participants is enough to see agreement. Look for cards that land in a different group every single time — those are genuinely ambiguous and need renaming, splitting, or duplicating into two places.

### Tree testing proves it works

Card sorting builds the structure; **tree testing** checks whether anyone can navigate it. Show the text-only hierarchy with no visual design and ask: *"Where would you go to find out whether the certificate is recognised by employers?"*

Score three things:

| Metric | What it means | Healthy |
|---|---|---|
| Success | Landed on the right node | 80%+ |
| Directness | Got there without backtracking | 70%+ |
| Time | Seconds to answer | Under 30s |

Low directness with high success is the interesting result: people find it eventually, by trial and error. That means your labels are wrong even though your grouping is right.

### Breadth beats depth

Given a choice, prefer a wider, shallower tree. Every extra level is a decision the user must get right blind, and the error compounds — three levels of five options is 125 leaves reached through three guesses, while two levels of eleven is 121 leaves through two. Depth is where people get lost.

The "seven items maximum" rule you will hear quoted is a misreading of Miller's 1956 paper on short-term recall. A visible, scannable menu is not held in memory — a supermarket aisle sign lists far more than seven things and nobody struggles. Group sensibly; do not amputate at seven.

### Label with their words, not yours

From your interviews (Chapter 1), harvest the exact nouns people used. Users searched for "fees", the team wrote "Investment". Users said "teacher", the site said "facilitator". Users said "sign up", the button said "Commence enrolment". Every one of those mismatches costs a click and a moment of doubt, and they are invisible to the team that wrote them because the internal word feels normal from the inside.

### The mistake

Designing navigation from the homepage outward. Real users arrive from search or a shared link, three levels deep, with no idea where they are. Design so that **any single page** answers: where am I, what is this, what can I do next, and how do I get to the thing next door.
        `),
        lesson('Task Flows and the States Nobody Designs', 12, `
Before drawing a screen, draw the **path**. A task flow is a map of the decisions between intent and outcome, and it is where you discover you need eleven screens instead of the four you sketched.

### Notation you can draw in five minutes

\`\`\`text
[ ] rectangle = screen        < > diamond = decision
( ) rounded   = system action  ▢ dashed  = state (empty / error / loading)
\`\`\`

Password reset, drawn honestly:

\`\`\`text
[Login] --forgot?--> [Enter email] --> (send link) --> [Check your inbox]
                          |                                  |
                   <email known?>                     [Link clicked]
                       no |                                  |
                          v                            <token valid?>
              ▢ "If that address is registered,        no |      | yes
                 we've sent a link"                       v      v
                                              ▢ Link expired   [New password]
                                                  --> [Request again]      |
                                                                     <meets rules?>
                                                                    no |     | yes
                                                                       v     v
                                                             ▢ Inline error  [Signed in]
\`\`\`

Four screens became eight boxes. Every one of the extra four is a real thing a user will hit, and if you do not design them a developer will improvise them — usually as a raw error string.

Note the "email not known" branch: it deliberately shows the **same message either way**. Saying "no account with that email" tells anyone who asks which addresses are registered.

### Every decision node needs both branches designed

That is the rule. A diamond with only one arrow leaving it is an unfinished design. Walk each flow and ask, at each node: what if it fails, what if it is slow, what if it is empty, what if the user has done this before?

### The four states of any data-bearing screen

| State | When | What it must do |
|---|---|---|
| **Loading** | Fetch in flight | Show shape, not a spinner-in-the-void — skeletons reduce perceived wait |
| **Empty** | Nothing yet | Explain why it is empty and give the one action that fills it |
| **Error** | Request failed | Say what happened in plain language and offer a retry |
| **Ideal** | Data present | The screen everyone designs first |

The empty state is the most under-designed screen in software, and it is the **first** screen every new user sees. "No courses yet" wastes it. "You have not enrolled yet — browse 12 beginner courses" turns a dead end into onboarding.

Also design the **overflow** state: what the list looks like with 500 items, and what a name looks like at 60 characters. Both break layouts that were only ever tested with three tidy rows.

### Count the steps, then cut one

Write the flow as a numbered list and challenge each step: can it be defaulted, remembered, inferred, or deferred?

- Asking for a phone number at sign-up when you first need it at enrolment: **defer it.**
- Asking for country when you can infer it: **default it, let them change it.**
- Asking users to confirm their email address by typing it twice: **replace with a visible value they can check.**

Each removed field is a measurable lift in completion. From Chapter 1's funnel, a nine-field form losing 60% of starters is not a copywriting problem — it is four fields too long.
        `),
        lesson('Wireframing at the Right Fidelity', 14, `
A wireframe answers three questions: what is on this screen, what matters most, and what can you do here. It deliberately answers nothing about colour, font, or brand — because as soon as those appear, the conversation moves to them and the structure stops being reviewed.

### Match fidelity to the question

| Fidelity | Looks like | Good for | Takes |
|---|---|---|---|
| **Crazy 8s** | 8 sketches, 8 minutes, pen | Generating options fast | 8 min |
| **Low-fi** | Grey boxes, real headings | Layout, hierarchy, order | 20 min/screen |
| **Mid-fi** | Real text, real spacing, no colour | Content fit, flow reviews, first tests | 1 hr/screen |
| **High-fi** | Final visual design | Stakeholder sign-off, dev handoff | 3 hr+/screen |

The costly mistake is jumping to high fidelity on day one. Polish creates commitment: after four hours in a mockup, you will defend a layout you should have thrown away, and reviewers who see a finished-looking screen critique the button radius instead of telling you the flow is wrong. Stay ugly while the structure is still in question.

### Use real content — never lorem ipsum

Lorem ipsum is a lie in three directions:

1. **Length.** Real course titles are 4 to 60 characters. Latin filler is uniformly medium-length, so your card grid looks perfect and then breaks on "Advanced Front-End Engineering with React, TypeScript and Testing".
2. **Meaning.** You cannot judge whether a label is clear if it is not a label.
3. **Emptiness.** Filler always fills. It hides every empty state from the previous lesson.

Take real strings out of your research and your database. Include the longest one you can find and the shortest — if the layout survives both, it will survive production.

### Before and after, one card

> **Before.** A course card with: thumbnail, title, instructor name, star rating, review count, category tag, level tag, duration, price, discount badge, "New" badge, a bookmark icon, and an *Enrol* button. Twelve elements, all roughly the same visual weight.
>
> **After.** Thumbnail. Title. One line of metadata reading *Beginner · 8 weeks · Rs 12,000*. One *Enrol* button. Four elements.

Nothing was lost that a user needed at the *browsing* stage — ratings, instructor bio and the syllabus all live one tap deeper on the detail page. What was gained is a card you can scan in under a second, which is the entire job of a card in a grid. **When every element shouts, the screen is silent.**

### Draw on a grid from the start

Even in grey boxes, commit to an **8-point spacing system**: every gap, padding and offset is a multiple of 8 (with 4 available for tight optical adjustments). Two cards 14px apart and 18px from the edge look wrong long before anyone can say why. Working on the grid in wireframes means your handoff spacing is already decided.

Use a 12-column layout for desktop and design the **narrow screen first** — 375px wide. A layout that works at 375 expands gracefully; a desktop layout squeezed down never does, because you have to decide what to *remove*, and by then everything has a stakeholder.

### Annotate what a picture cannot show

Beside each wireframe, write the behaviour: what happens on submit, what the validation rules are, what appears when the list is empty, what is sticky when scrolling, where focus goes after the dialog closes. A wireframe without annotations gets built as a static picture of itself.
        `),
      ],
      [
        q('A tree test shows 85% task success but only 45% directness. What does that tell you?', [
          'The hierarchy is too shallow',
          'The test had too few participants to be meaningful',
          'Users need a search box instead of navigation',
          'People eventually find it by backtracking, so the grouping is roughly right but the labels mislead',
        ], 3, 'High success with low directness means wrong first guesses — a labelling problem, not a structural one.'),
        q('Why is "Resources" a poor top-level navigation label?', [
          'It names an internal container rather than something a user came looking for',
          'It is too long to fit in a menu bar',
          'It ranks poorly in search engines',
          'It cannot be translated consistently',
        ], 0, 'Users search for a syllabus, a price or a certificate; catch-all labels exist because the team could not decide, and hide content.'),
        q('Which screen state is most often skipped and most often seen first by new users?', [
          'The loading state', 'The empty state', 'The error state', 'The ideal state',
        ], 1, 'A brand-new account has no data, so the empty state is the first real screen — and it is the one designers rarely draw.'),
        q('Why should wireframes use real content instead of lorem ipsum?', [
          'Lorem ipsum is copyrighted in some countries',
          'Real content is faster to type',
          'Filler text is uniformly medium-length, hiding both overflow and empty states',
          'Clients prefer to read English',
        ], 2, 'Real strings expose the longest title and the missing value — the two cases that break layouts in production.'),
      ]
    ),
    chapter(
      'Visual Craft: Hierarchy, Type, and Colour',
      'Making the eye move in the right order, on a type and spacing system, in colours everyone can read.',
      [
        lesson('Visual Hierarchy: Directing the Eye', 13, `
Hierarchy is the order in which a viewer notices things. You are not decorating a screen; you are choosing what gets seen first, second, and never.

### Five tools, in order of power

1. **Size** — the loudest signal. A 32px heading beats a 16px one instantly.
2. **Weight** — 700 against 400 reads as importance without taking more space.
3. **Colour and contrast** — a high-contrast element on a low-contrast field wins. This is why one saturated button beats five.
4. **Space** — the most underused. Isolation creates importance more quietly than size does.
5. **Position** — top and left get read first in left-to-right scripts, but only in the absence of stronger signals.

Use **two or three at once, in the same direction**. Bigger *and* bolder *and* darker reads as one clear level. Bigger but lighter and greyer cancels itself out and produces the muddled screen where nothing seems to be the point.

### Make steps obvious, not subtle

If two levels are close in size, the eye reads them as equal and the hierarchy collapses. A heading at 17px above body at 16px is not a heading, it is a typo. Keep at least a **1.25× step** between adjacent levels; 1.5× for the jump from body to page title.

The same rule applies to weight: 500 next to 400 is invisible on most screens. Jump 400 → 600 or 400 → 700.

### The squint test

Blur your screen — squint, or apply a 6px Gaussian blur to a screenshot. What is still legible as a shape is your real hierarchy. If the blurred image shows one dark rectangle and it is the cookie banner, you have learned something. If your primary action disappears while a decorative illustration survives, the emphasis is inverted.

Do this before every review. It takes ten seconds and it is the most reliable critique tool that exists.

### Proximity beats borders

Related things go close together; unrelated things get space. Most "cluttered" interfaces are not too full, they are **evenly spaced** — everything 16px from everything else, so the eye gets no grouping information at all.

> **Before.** Label, input, helper text, next label, next input — all separated by a uniform 16px, with a 1px divider line between each field to compensate.
>
> **After.** 8px between a label and its input, 6px to its helper text, **32px** before the next field. Dividers deleted.

Nothing was added; one gap was changed from 16 to 32 and another from 16 to 8. The form now reads as three groups rather than nine floating parts. As a rule, **the gap inside a group must be visibly smaller than the gap around it** — otherwise the group is not a group. Reach for space before you reach for a line or a box; borders add visual noise to solve a problem that whitespace solves silently.

### One primary action per view

Give exactly one element the filled, high-contrast treatment. Secondary actions get an outline or a plain text style; destructive actions get colour but not primacy. Three equally weighted buttons force a decision the user did not ask to make, and the measurable result is that fewer people press *any* of them.

> **Before.** *Save*, *Save and continue*, *Preview*, *Cancel* — all four as solid rose buttons.
>
> **After.** *Save and continue* solid. *Save* as an outline. *Preview* as a text link. *Cancel* as a text link on the far left, separated by space.

### Alignment is free

Pick one alignment edge and hold it. Every left edge of every text block in a column should sit on the same x-coordinate. Mixed centre and left alignment inside a single card is the most common reason a layout feels amateur even when the type and colour are fine — the eye tracks a ragged invisible line and reads it as carelessness.
        `),
        lesson('Type and Spacing Scales', 14, `
Arbitrary numbers are what make an interface feel homemade. A **scale** is a short, fixed list of allowed values — and refusing to use anything off the list is most of what "polished" means.

### Build the type scale by ratio

Start at a 16px base (the browser default — never make body text smaller than this on the web) and multiply by a constant. A **1.25 major third** is the safest general-purpose ratio:

| Step | Size | Line height | Use |
|---|---|---|---|
| −1 | 12px | 16px | Legal, timestamps |
| 0 | 16px | 24px (1.5) | Body |
| 1 | 20px | 28px (1.4) | Lead paragraph, card title |
| 2 | 25px | 32px (1.3) | Section heading |
| 3 | 31px | 38px (1.25) | Page heading |
| 4 | 39px | 46px (1.2) | Hero |
| 5 | 49px | 54px (1.1) | Display |

Round to whole pixels. Seven steps is plenty; if you need an eighth, you probably need a different layout.

Notice line height **shrinks as size grows**. 1.5 is right for body text and far too airy at 49px, where lines start to look unrelated. Set it as a unitless multiplier so it scales with the font size rather than freezing at one value.

### Measure: 45–75 characters

Line length controls reading more than font choice does. Below ~45 characters the eye jumps lines too often; above ~75 it loses the return sweep and re-reads lines. Cap your text containers:

\`\`\`css
.prose {
  max-width: 68ch;      /* ch = width of "0" in the current font */
  font-size: 1rem;      /* 16px, and it respects the user's browser setting */
  line-height: 1.5;
}
\`\`\`

A full-width paragraph on a 1440px monitor is roughly 200 characters per line. It is technically legible and nobody reads it.

### Optical adjustments that separate good from fine

- Large headings need **negative tracking**: about \`-0.02em\` at 39px and above. Type designers space fonts for body sizes; at display sizes the gaps look loose.
- All-caps needs **positive tracking**: \`0.08em\`, because capitals were never designed to sit together.
- Never fake bold or italic by transforming a regular weight; load the real cut.
- Two families maximum — one for headings, one for text. One good family with several weights beats three families every time.

### The spacing scale

The same discipline, with 4 as the unit:

\`\`\`css
:root {
  --space-1: 4px;    --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;   --space-5: 24px;   --space-6: 32px;
  --space-7: 48px;   --space-8: 64px;   --space-9: 96px;
}
\`\`\`

Nine values, and every margin, padding and gap in the product comes from this list. The value of the constraint is not tidiness — it is that **spacing differences become meaningful**. When gaps are 16 or 32 and never 21, a bigger gap reliably signals a bigger separation, and users read the grouping without being told.

Notice the scale gets coarser as it grows: 4, 8, 12, 16 then jumps of 8, 16, 32. Small differences matter at small sizes and stop mattering at large ones.

### The mistake that undoes all of it

One-off values. A designer nudges a heading to 22px because it "looked better", a developer adds \`margin-top: 13px\` to fix an alignment, and six months later the codebase has 40 font sizes and 60 spacing values. The scale is only worth having if it is the *only* source. When something genuinely does not fit the scale, that is a signal the layout is wrong — not that the scale needs another number.
        `),
        lesson('Colour and Contrast You Can Prove', 15, `
Colour is the fastest thing to get wrong, because the person choosing it is looking at a bright calibrated screen indoors with good eyesight. Contrast is not an opinion; it is a number you can compute.

### The ratio

Contrast ratio compares the relative luminance of two colours and runs from **1:1** (identical) to **21:1** (black on white). WCAG 2.2 sets these thresholds:

| Requirement | Level AA | Level AAA |
|---|---|---|
| Body text (under 24px, or under 18.66px bold) | **4.5:1** | 7:1 |
| Large text (24px+, or 18.66px+ bold) | **3:1** | 4.5:1 |
| UI components, icons, focus rings, chart lines | **3:1** | — |
| Disabled controls, decorative graphics | exempt | exempt |

Target AA as the floor for anything shipping to the public. Note that the large-text allowance is a real escape hatch: a colour that fails at 16px may pass legitimately at 24px bold.

### Real numbers, checked

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| \`#999999\` | \`#FFFFFF\` | 2.85:1 | Fails everything — the classic placeholder grey |
| \`#767676\` | \`#FFFFFF\` | 4.54:1 | Passes AA body text, barely. The lightest safe grey on white |
| \`#0F172A\` | \`#FFFFFF\` | 17.85:1 | Passes AAA comfortably |
| \`#FFFFFF\` | \`#F43F5E\` | 3.67:1 | **Fails** AA for a button label at 16px |
| \`#FFFFFF\` | \`#E11D48\` | 4.70:1 | Passes AA |
| \`#E11D48\` | \`#FFF1F2\` | 4.28:1 | Fails — brand colour on its own tint |
| \`#CBD5E1\` | \`#FFFFFF\` | 1.48:1 | Fails the 3:1 rule for a form border |

That fourth row is the single most common contrast failure in real products: **white text on a mid-tone brand colour**. It looks fine on a designer's monitor and disappears on a phone in daylight. Darkening rose-500 to rose-600 fixes it and nobody notices the change.

The last row matters too — input borders are UI components and need 3:1 against their background, so the fashionable near-invisible grey outline is a failure, not a style.

### Grey text is the other epidemic

Secondary text at \`#999\` on white is 2.85:1. It fails, and it fails for exactly the users who need help most: anyone over 45, anyone on a cheap screen, anyone outdoors. If you want de-emphasis, use \`#6B7280\` (4.83:1) or reduce **size and weight** instead of lightness.

### Never let colour carry the meaning alone

WCAG 1.4.1: information must not be conveyed by colour alone. Around 8% of men have some form of colour vision deficiency, most commonly red/green — and red/green is precisely what interfaces use for error and success.

> **Before.** Invalid fields get a red border. Valid ones get a green border.
>
> **After.** Invalid fields get a red border, a warning icon, and the text *"Enter a valid email address"* under the field. Valid fields get a subtle check.

Do the same for charts (label the lines, or vary the dash pattern), for status badges (icon plus word, not just a coloured dot) and for links in body text (underline them; colour alone is not enough).

### Build a palette that survives

- One brand colour, plus a full neutral ramp from near-white to near-black. Most of any good interface is neutral.
- Semantic colours: success, warning, danger, info — each defined as a *pair* (a background and a text colour that passes against it).
- Roughly **60/30/10**: 60% neutral background, 30% supporting surfaces and text, 10% brand accent. Accent colour spent everywhere buys nothing anywhere.
- Check dark mode separately. Contrast does not invert — \`#E11D48\` on \`#0F172A\` is only 3.80:1, so your light-mode brand colour usually needs to lighten (\`#FB7185\` on the same dark ground is 6.63:1).

### Test it, do not trust it

Run every text/background pair through a contrast checker before handoff, view the screen at 50% brightness, and take it outside. Contrast is the one part of accessibility with a definite right answer, which makes it inexcusable to ship wrong.
        `),
      ],
      [
        q('A page heading is 17px and body text is 16px. What is the problem?', [
          'The heading is too small to be readable',
          'Odd pixel values break the grid',
          'The step is too small to register, so the eye reads them as the same level',
          'Headings must always be at least 24px',
        ], 2, 'Adjacent levels need roughly a 1.25x jump; a 1px difference is read as an inconsistency, not a hierarchy.'),
        q('Body text at 16px in #999999 on a white background measures 2.85:1. What is the correct fix?', [
          'Increase the font size to 18px, which qualifies for the 3:1 large-text rule',
          'Add a text shadow to improve legibility',
          'Nothing — 2.85:1 passes AA for secondary text',
          'Darken the text to at least 4.5:1, for example #767676',
        ], 3, 'AA requires 4.5:1 for normal text, and the large-text exemption starts at 24px (or 18.66px bold), not 18px.'),
        q('In a form, which spacing arrangement groups fields correctly?', [
          'A uniform 16px gap between every element, with divider lines',
          '8px between a label and its input, 32px between one field and the next',
          '32px between a label and its input, 8px between fields',
          '16px everywhere, with each field in a bordered box',
        ], 1, 'Proximity signals grouping: the gap inside a group must be visibly smaller than the gap around it.'),
        q('Why is a red border the wrong way, on its own, to mark an invalid field?', [
          'Colour alone excludes users with colour vision deficiency; an icon and error text are needed too',
          'Red is culturally associated with different meanings',
          'Borders are hard to see on mobile screens',
          'Red borders fail the 4.5:1 text contrast requirement',
        ], 0, 'WCAG 1.4.1 requires a second, non-colour cue — text and an icon — because roughly 8% of men cannot reliably distinguish red.'),
      ]
    ),
    chapter(
      'Design Systems and Figma',
      'Tokens, components and prototypes — turning one-off screens into a system a team can build from.',
      [
        lesson('Tokens: The Vocabulary of a System', 13, `
The scales from Chapter 3 only become a system when they have **names**. A design token is a named decision — one place where a value lives, referenced everywhere it is used.

### Three tiers, and the middle one is the point

\`\`\`css
/* Tier 1 — primitives. Raw values. No meaning. */
--rose-400: #FB7185;
--rose-500: #F43F5E;
--rose-600: #E11D48;
--slate-50:  #F8FAFC;
--slate-400: #94A3B8;
--slate-500: #64748B;
--slate-900: #0F172A;

/* Tier 2 — semantic. What the value is FOR. Components use only these. */
--color-bg-page:        var(--slate-50);
--color-text-primary:   var(--slate-900);
--color-text-secondary: var(--slate-500);
--color-action-primary: var(--rose-600);
--color-border-default: var(--slate-500);

/* Tier 3 — component-scoped, only when a component genuinely differs. */
--button-primary-bg:    var(--color-action-primary);
--button-primary-label: #FFFFFF;
\`\`\`

Skipping tier 2 is the mistake that makes design systems fail. If a button references \`--rose-500\` directly, then rebranding, adding dark mode, or fixing a contrast bug means finding every usage by hand and guessing which ones meant "brand" and which just happened to be pink.

With semantic tokens, dark mode is a redefinition of one small block:

\`\`\`css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page:      var(--slate-900);
    --color-text-primary: var(--slate-50);
    --color-text-secondary: var(--slate-400); /* slate-500 is only 3.75:1 here */
    --color-action-primary: var(--rose-400);  /* lightened for contrast on dark */
  }
}
\`\`\`

Not one component changed. That is the entire return on the extra layer.

### Name by role, never by appearance

| Bad token name | Why it breaks | Better |
|---|---|---|
| \`--blue-button\` | Fails the day marketing goes green | \`--color-action-primary\` |
| \`--small-text\` | Small relative to what? | \`--font-size-100\` / \`--text-caption\` |
| \`--margin-20\` | Encodes the value in the name | \`--space-5\` |
| \`--sidebar-grey\` | Only usable in one place | \`--color-bg-surface\` |

The test: if you changed the value, would the name become a lie? \`--color-danger\` survives a red-to-orange change. \`--red-alert\` does not.

### What belongs in a system

- **Colour** — primitives plus semantic pairs (each background paired with a text colour that passes contrast against it).
- **Type** — the scale from Chapter 3, as named steps with size, line height and weight bundled together.
- **Space** — the 4-based scale, named \`--space-1\` through \`--space-9\`.
- **Radius, shadow, border width** — three values each is usually enough. Twelve shadow values means nobody chooses consistently.
- **Motion** — duration and easing tokens, so every transition in the product moves alike.

### Documentation is part of the component

A component nobody understands gets rebuilt. Each entry needs: what it is for, **when not to use it**, every state (default, hover, focus, active, disabled, loading, error), the content rules (max characters, sentence case or title case), and the accessibility notes (what a screen reader announces, where focus lands).

That "when not to use it" line prevents more inconsistency than any amount of pixel documentation. *"Use a Banner for page-level status. Do not use it for field validation — that is an inline error."*

### Start small and grow from evidence

Do not design 60 components before the product exists. Build the screens, then look for repetition: the moment you have drawn the same card three times, promote it. A system extracted from real screens fits the product; a system invented in advance produces beautiful components nobody needs and gaps where the real work is.
        `),
        lesson('Components, Variants, and Auto Layout in Figma', 15, `
Figma rewards you for building things once. The three features that do all the work are auto layout, components with properties, and styles/variables bound to the tokens from the previous lesson.

### Auto layout is flexbox

Select the elements, press **Shift + A**, and the frame gains a direction, a gap, and padding. The concepts map exactly onto CSS, which is why an auto-layout design translates cleanly to code:

| Figma | CSS | Meaning |
|---|---|---|
| Direction: horizontal | \`flex-direction: row\` | Which way children stack |
| Gap between items | \`gap\` | Space between children — never fake it with margins |
| Padding | \`padding\` | Inside space |
| **Hug contents** | \`width: fit-content\` | Box shrinks to fit its content |
| **Fill container** | \`flex: 1\` | Box expands to take available space |
| **Fixed** | \`width: 320px\` | Locked size |
| Alignment (9-dot grid) | \`justify-content\` + \`align-items\` | Where children sit |

The rule that makes designs behave: a button should **hug** horizontally with fixed padding, so it grows with its label. A fixed-width button breaks the moment the label is translated into German, and Figma will show you that breakage immediately if you type a long label into a hugging button.

Nest auto layout inside auto layout — a card is a vertical stack containing a horizontal row — and the whole card resizes correctly when any child changes.

### One component, many variants

Do not create \`Button-primary\`, \`Button-primary-hover\`, \`Button-secondary-small\`. Create **one** Button component with properties:

\`\`\`text
Component: Button
  Variant  ▸ primary | secondary | ghost | danger
  Size     ▸ sm | md | lg
  State    ▸ default | hover | focus | disabled
  Icon     ▸ boolean (show/hide the leading icon slot)
  Label    ▸ text
\`\`\`

That is 4 × 3 × 4 = 48 combinations from one component, driven by dropdowns in the right-hand panel. A designer places one instance and configures it; nobody hunts through a page of near-identical layers.

Build the variant matrix as an actual grid — variants down, sizes across — so a missing combination is visible as a hole.

### Naming controls the menu

Figma turns slashes into folders in the insert menu:

\`\`\`text
Form/Input/Text
Form/Input/Select
Form/Checkbox
Navigation/Tab Bar
\`\`\`

Name components the day you make them. Renaming 40 components later breaks every instance's place in the menu and nobody will do it.

### Bind styles and variables to tokens

Every fill, text style, radius and spacing value should come from a **variable or style**, not a hand-typed hex. When \`--color-action-primary\` shifts from rose-500 to rose-600 to fix the 3.67:1 contrast failure from Chapter 3, one variable change updates every button in every file. Typed hex values do not update, and you will find the stragglers in production.

Figma variables also give you **modes** — light and dark, or compact and comfortable — switchable per frame. This is the same three-tier idea as CSS custom properties, in a canvas.

### The mistake that destroys a library

**Detaching an instance.** The moment someone right-clicks *Detach instance* to change one corner radius, that copy stops receiving updates forever — and it looks identical, so nobody notices until the brand changes and one screen stays old. If an instance cannot do what you need, the honest fixes are: expose a new property on the component, or make a genuine second component. Detaching is never the answer inside a shared library.

Related: overriding a fill on an instance instead of adding a variant. It survives, but it silently breaks theming, because an override outranks the variable.
        `),
        lesson('Prototyping Interactions Worth Testing', 13, `
A prototype exists to answer a question. Before you connect a single arrow, write down the question — *"can a new user find and resume their last lesson within 30 seconds?"* — because it determines exactly how much you need to build and nothing more.

### Triggers, actions, and the three you will use

Switch to the **Prototype** tab, drag from a layer to a destination, and configure:

| Trigger | Use it for |
|---|---|
| On click / tap | The default. Buttons, cards, links |
| On drag | Sheets, carousels, swipe-to-delete |
| While hovering / pressing | Desktop hover states, press feedback |
| After delay | Auto-advancing content, fake loading states |
| Mouse enter / leave | Tooltips, menus |

| Action | Use it for |
|---|---|
| **Navigate to** | Moving between screens |
| **Open overlay** | Modals, dropdowns, toasts — keeps the underlying screen in place |
| **Change to** | Swapping a component's variant in place: the single most useful action, because it gives you toggles, tabs, and expanding rows without duplicating screens |
| **Back / Close** | Returning without hardcoding a destination |

Prefer *Change to* over a duplicate screen. Ten screens that differ only by which tab is selected is ten screens to update when the header changes.

### Smart Animate needs matching names

Smart Animate interpolates between two frames by matching layers that share **the same name at the same nesting level**. If a layer is called \`Rectangle 41\` on one frame and \`Card BG\` on the next, it will not tween — it will cross-fade, and the motion will look broken.

Name layers consistently before animating. This is the entire reason most Smart Animate transitions fail.

### Timing that feels right

| Motion | Duration | Easing |
|---|---|---|
| Hover / small state change | 100–150ms | Ease out |
| Dropdown, tooltip, toast | 150–200ms | Ease out |
| Modal, sheet, page transition | 250–300ms | Ease in-out |
| Large element moving a long distance | 300–400ms | Ease in-out |

Anything over ~400ms feels sluggish on the second viewing, and users see every transition hundreds of times. **Ease out** for things entering (fast start, gentle landing) and **ease in** for things leaving. Linear looks mechanical for anything except a progress bar.

Add a \`prefers-reduced-motion\` note in your handoff: large sliding and parallax motion triggers nausea for people with vestibular disorders, and the reduced alternative is a simple fade.

### Make it realistic where realism is tested

If the test involves typing, use a real input — Figma's variables let a typed value carry to the next screen, and watching someone type a genuine email into a field surfaces problems a static mock hides. If the test involves waiting, build the loading state with an *after delay* of 800ms rather than jumping instantly. A prototype where everything is instantaneous cannot reveal that your loading state is unclear.

### Prototype the path, not the product

Connect only the screens on the tested route, plus the first wrong turn a user is likely to take. Wiring every button in a 40-screen file takes days and adds nothing — testers do not explore a prototype the way they explore a product; they follow the task you gave them.

Do build **one dead end deliberately**: a screen your task does not need. Watching how someone recovers from a wrong turn is often the most informative moment of the whole session, and it is the thing a fully-wired happy-path prototype can never show you.
        `),
      ],
      [
        q('Why should a Button component reference --color-action-primary rather than --rose-600?', [
          'Semantic names are shorter to type',
          'Primitive tokens cannot be used in components',
          'It improves rendering performance',
          'A role-based name survives rebrands, theming and contrast fixes without touching components',
        ], 3, 'The semantic tier is the indirection that lets one redefinition change every component — dark mode and rebrands become a token edit.'),
        q('A Figma button has a fixed width of 120px. What breaks first?', [
          'A longer or translated label overflows or gets clipped',
          'It will not respond to hover',
          'It cannot use auto layout',
          'It loses its variant properties',
        ], 0, 'Buttons should hug their contents with fixed padding so they grow with the label; fixed widths break on long or localised text.'),
        q('A designer needs a card with a different corner radius and detaches the instance. What is the consequence?', [
          'Nothing — detaching is the standard way to customise',
          'The copy stops receiving library updates while looking identical, so it silently drifts out of date',
          'Figma deletes the original component',
          'The instance loses its auto layout',
        ], 1, 'A detached instance is a permanent fork that no longer inherits changes — and because it looks the same, nobody notices until it is stale.'),
        q('Smart Animate cross-fades instead of tweening between two frames. The most likely cause?', [
          'The duration is set too short',
          'The frames are different sizes',
          'The matching layers have different names, so Figma cannot pair them',
          'Easing is set to linear',
        ], 2, 'Smart Animate pairs layers by identical name and nesting level; unmatched names fall back to a cross-fade.'),
      ]
    ),
    chapter(
      'Testing, Accessibility, and Handoff',
      'Proving the design works, making sure everyone can use it, and getting it built the way you designed it.',
      [
        lesson('Usability Testing That Changes the Design', 14, `
A usability test is not a demo and not a survey. You give someone a realistic task, you watch them attempt it, and you say almost nothing.

### Five people, and why that is enough

Jakob Nielsen's finding still holds: roughly **five participants surface about 85% of the usability problems** in a given design, because the serious problems are the ones almost everyone hits. Participant six mostly repeats participant three.

So run five, fix what you found, and run five more on the fixed version. Three rounds of five beats one round of fifteen, because rounds two and three test a better design.

### Tasks, not questions

| Weak prompt | Why it fails | Task |
|---|---|---|
| "What do you think of this page?" | Invites design criticism, which is not your job to collect | "Find out how long this course takes and when the next intake starts." |
| "Would you sign up here?" | Hypothetical, and they know you built it | "Sign up for the beginner UI course using this test card." |
| "Is the navigation clear?" | Leading and yes/no | "You finished lesson 3 yesterday. Get back to where you stopped." |

Write the task in the user's language, never yours. If the task says *"open the dashboard and locate the resume module"*, you have handed them the labels you were trying to test. Describe the **goal**, not the route.

### Say almost nothing

The instinct to help is overwhelming and it destroys the data. Prepare three responses and use only those:

- "What are you trying to do right now?"
- "What did you expect to happen?"
- "What would you do next if I were not here?"

When they ask *"is this the right button?"*, do not answer. Say "what do you think?" Every hint you give buys a successful task and costs you the finding.

**Think aloud**, requested once at the start, is worth the slight artificiality: "keep telling me what you are thinking, even if it feels odd."

### Measure something

| Metric | How | Why it helps |
|---|---|---|
| Task success | Completed / with help / failed | The headline number |
| Time on task | Stopwatch | Compare before and after a fix |
| Errors | Wrong turns per task | Localises the problem |
| Single Ease Question | "How difficult was that task?" 1–7, asked immediately | One number per task, comparable across rounds |
| System Usability Scale | 10 statements at the end | Score out of 100; ~68 is average, so 72 is unremarkable, not good |

Never ask "was that easy?" People say yes, especially to the person who designed it. The SEQ works because it is a graded scale asked at the moment of pain, not a yes/no asked at the end while being polite.

### Rate severity, then fix in order

| Severity | Meaning | Response |
|---|---|---|
| 4 — Critical | Blocks the task; users cannot proceed | Fix before launch |
| 3 — Major | Most users struggle, workaround exists | Fix this cycle |
| 2 — Minor | Slows people down | Backlog |
| 1 — Cosmetic | Noticed but harmless | If convenient |

The count matters as much as the label: something four of five people hit is systemic, and something one person hit may be that person.

### Report what happened, not what you concluded

> **Weak.** "Users found navigation confusing."
>
> **Strong.** "4/5 participants looked for the syllabus under *Courses* and did not find it under *Resources*. Mean time on task 71s; two gave up. P2: 'I assumed the outline would be on the course page.'"

The second version names the fix. The first invites a debate about whose interpretation is right — and that debate is always won by whoever is most senior, not whoever watched the tape.
        `),
        lesson('Accessibility as a Design Constraint', 15, `
Accessibility is not a checklist applied at the end. Most violations are decided in the wireframe, and by the time it is a ticket the cost has multiplied. The four WCAG principles — **Perceivable, Operable, Understandable, Robust** — are a design brief, not paperwork.

### Keyboard is the fastest test you own

Put the mouse away and press Tab through your screen. Ask three things:

1. **Can I reach everything interactive?** A \`div\` with a click handler is invisible to Tab. If it acts like a button, it must be a button.
2. **Can I see where I am?** The focus ring must be visible and meet 3:1 contrast against its background. Deleting it because it is "ugly" removes the only navigation aid a keyboard user has — style it instead.
3. **Does the order make sense?** Tab order follows the DOM, not the visual layout. A field placed visually first but written last in the markup traps people in a confusing loop.

Then check that focus is **managed**: opening a dialog moves focus into it, Escape closes it, and closing returns focus to the button that opened it. Without that, a keyboard user opens a modal and continues tabbing through the page behind it.

### Labels, names, and alt text

\`\`\`html
<!-- Before: no label. The placeholder is only a fallback accessible name —
     support varies, and it disappears the moment the user types -->
<input type="email" placeholder="Email address" />

<!-- After: announced as "Email address, edit text, required" -->
<label for="email">Email address</label>
<input id="email" type="email" required />
\`\`\`

A placeholder is not a label. It vanishes the moment someone types, it fails contrast at typical greys, and it leaves people who got interrupted staring at a filled box with no idea what it holds.

Alt text rules that cover almost every case:

- **Informative image** — describe the information, not the picture. \`alt="Certificate of completion, signed"\`, not \`alt="image of a certificate"\`.
- **Decorative image** — \`alt=""\`, deliberately empty, so it is skipped rather than announced as a filename.
- **Image used as a link or button** — the alt describes the *destination or action*: \`alt="Download syllabus (PDF)"\`.
- **Icon-only button** — needs \`aria-label="Close"\`. A bare \`✕\` is announced as nothing useful.

### Targets, motion, and structure

- **Target size**: WCAG 2.2 requires a minimum of **24 × 24 CSS pixels**; platform guidance recommends 44 × 44. A 16px icon with 4px padding fails, and it fails hardest for anyone with a tremor or on a bus.
- **Headings** form the outline screen-reader users navigate by. Do not skip from \`h1\` to \`h4\` to get a smaller size — that is what your type scale is for.
- **Motion**: honour \`prefers-reduced-motion\` and replace large sliding or parallax movement with a fade. Vestibular disorders make aggressive motion genuinely nauseating.
- **Text spacing**: the layout must survive users increasing line height and letter spacing. Fixed-height containers with text inside are the usual failure.
- **Zoom**: the page must work at 200% without horizontal scrolling.

### The ARIA rule

**No ARIA is better than bad ARIA.** \`<button>\` already announces itself as a button, is focusable, and fires on Enter and Space. \`<div role="button">\` gets you the announcement and none of the behaviour, so you must reimplement focus, keyboard handling and disabled state — and most implementations forget at least one. Use the native element; reach for ARIA only for patterns HTML genuinely lacks, and follow the authoring practices pattern exactly.

### Automation finds about a third

Automated tools catch missing alt text, contrast failures and unlabelled inputs — real, worthwhile, and roughly **30–40% of issues**. They cannot tell you the alt text is wrong, the tab order is nonsense, or the error message is meaningless. The other two-thirds need a human with a keyboard, and ideally a test with someone who uses a screen reader daily.
        `),
        lesson('Critique, Handoff, and Measuring the Result', 13, `
A design is finished when someone else can build it correctly and you can tell afterwards whether it worked.

### Critique with a structure

Unstructured review produces taste-based opinion. Use three passes, in order, and hold the room to them:

1. **Describe** — say what you see, no judgement. "The primary action is bottom-right, below the fold on a 375px screen." This step alone resolves half of all disagreements, because people were describing different things.
2. **Analyse** — measure it against the stated goal. "The goal is enrolment completion; the action being below the fold means users must scroll to find it."
3. **Suggest** — offer a direction, not a pixel. "Consider a sticky action bar on narrow screens."

Open every critique by restating the **goal and the constraints**. Without that, "I don't like the pink" is unanswerable; with it, "does the pink serve the goal of a scannable primary action?" is a question with an answer. Critique the work against its purpose, never the person, and never against the reviewer's personal preference.

### Handoff is behaviour, not coordinates

Developers can read spacing and colour from the file. What they cannot read is what happens:

- **Every state** for every component: default, hover, focus, active, disabled, loading, error, empty.
- **Responsive behaviour**: what reflows, what hides, what the breakpoints are, and which element wraps first.
- **Content rules**: max lengths, truncation vs wrapping, what a missing value shows.
- **Validation**: which rules fire, when they fire (on blur, not on every keystroke), and the exact error copy.
- **Motion**: durations and easing from your motion tokens.
- **Accessibility**: focus order, what the screen reader announces, where focus goes after a dialog closes.
- **Edge cases**: the 60-character title, the 500-item list, the zero-item list, the failed request.

Hand over tokens by name — \`--space-5\`, \`--color-action-primary\` — not "24px, rose". Names travel into the code; measurements get re-typed and drift.

The most useful handoff habit is a short review **after** the build: sit with the developer, walk the real screens, and note the differences. Half will be your omissions, and those are the ones to fix in the file so the next feature inherits the answer.

### Measure whether it worked

Ship, then check the same numbers you started with in Chapter 1:

| Signal | What it tells you |
|---|---|
| Task success in a follow-up test | Did the specific problem go away? |
| Funnel completion rate | Did the drop-off move? |
| Time on task | Did it get faster or just prettier? |
| Support tickets by topic | The cheapest usability lab you have |
| SUS or SEQ, same wording as before | Comparable to your baseline |

Compare against the **baseline you recorded before the change**. Without a baseline, every result is an anecdote and every argument about it is unwinnable.

### Where to go next

You have the whole loop now: research, personas and journeys, information architecture, flows and wireframes, hierarchy, type and spacing scales, accessible colour, tokens, Figma components and prototypes, usability testing, accessibility and handoff. The natural next steps are content design (the words are the interface), motion and interaction detail, quantitative methods like A/B testing to complement your five-participant studies, and enough front-end code to prototype in the real medium.

The habit that matters most is the shortest one: **design, test with five people, fix, repeat.** Everything else in this course makes that loop faster.
        `),
      ],
      [
        q('Why run three rounds of five participants rather than one round of fifteen?', [
          'Five surface most major problems, so rounds two and three test an already-improved design',
          'Fifteen participants are harder to recruit',
          'Statistical significance requires at least three rounds',
          'Participants get tired after five sessions',
        ], 0, 'About 85% of issues appear in the first five; iterating between rounds means each round tests a better design instead of re-finding the same bugs.'),
        q('Which is a properly written usability test task?', [
          '"Is the navigation clear to you?"',
          '"Open the dashboard and locate the resume module."',
          '"Would you recommend this site to a friend?"',
          '"You finished lesson 3 yesterday. Get back to where you stopped."',
        ], 3, 'It states a goal in the user\'s own language without naming any interface element, so it tests the design rather than reading it aloud.'),
        q('Why is a placeholder not an acceptable substitute for a label?', [
          'Placeholders cannot be styled',
          'It disappears on typing, usually fails contrast, and is only an unreliable fallback accessible name',
          'Placeholders are not supported on mobile browsers',
          'Labels are required by HTML validators',
        ], 1, 'The label must persist and be programmatically associated; a placeholder vanishes exactly when the user needs to check what the field was.'),
        q('An automated accessibility scan reports zero issues. What can you conclude?', [
          'The interface is WCAG AA compliant',
          'Only colour contrast has been verified',
          'Only that machine-checkable issues are clear; tab order, alt text quality and error clarity still need a human',
          'The scan failed to run',
        ], 2, 'Automation catches roughly a third of issues — the rest require judgement, a keyboard, and ideally a screen-reader user.'),
      ]
    ),
    chapter(
      'Responsive Layouts and the Words Inside Them',
      'One interface that survives every screen size, and the microcopy and form craft that carry most of its usability.',
      [
        lesson('Breakpoints, Fluid Type, and Container Queries', 14, `
A responsive layout is not three fixed designs stapled together. It is one design with a small number of declared moments where it is allowed to change, and those moments come from your content, not from a list of phones.

### Name breakpoints after what breaks

Device-named breakpoints go stale — "iPad portrait" stopped meaning anything years ago. Resize the browser slowly and note the width where something actually stops working:

| Width | What breaks | Decision |
|---|---|---|
| 380px | Course title wraps to four lines | Reduce title step from 25px to 20px |
| 560px | Card grid can hold two columns | \`repeat(2, 1fr)\` |
| 760px | Metadata row fits beside the thumbnail | Card becomes horizontal |
| 1080px | Text measure passes 75 characters | Cap the prose column, add the sidebar |

Four breakpoints, each with a reason you can defend in review. Three or four is normal for a whole product; a file with eleven means somebody was patching symptoms.

### Fluid type, with the zoom bug avoided

Between breakpoints, let the type scale from Chapter 3 stretch rather than jump:

\`\`\`css
:root {
  /* min 20px, preferred 16px + 1.5vw, max 31px — steps 1 and 3 of the scale */
  --text-page-title: clamp(1.25rem, 1rem + 1.5vw, 1.9375rem);
}
h1 { font-size: var(--text-page-title); line-height: 1.25; }
\`\`\`

The classic bug is writing \`font-size: 4vw\` instead. A pure viewport unit ignores the user's browser text-size setting entirely, so someone who set 20px as their default gets your 4vw anyway — a WCAG 1.4.4 failure. The middle term of a \`clamp()\` must contain a \`rem\` component so the value still responds to user text settings; the \`vw\` part only adds to it.

### Container queries ask the question a component actually has

A media query asks how wide the **window** is. A card does not care about the window; it cares how much room it has been given. Put the same card in a 280px sidebar and a 900px main column and only one of these works:

\`\`\`css
.card-list { container-type: inline-size; container-name: cards; }

@container cards (min-width: 34rem) {
  .card { display: grid; grid-template-columns: 96px 1fr; gap: var(--space-4); }
}
\`\`\`

Now the card is horizontal wherever it has 34rem of room and stacked wherever it does not — in a sidebar, in a modal, in a two-column dashboard. This is what makes the component library from Chapter 4 genuinely reusable instead of reusable-on-the-page-it-was-designed-for.

### The layout that needs no breakpoint at all

\`\`\`css
.grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
}
\`\`\`

One declaration, one to four columns, no media queries. Note the \`min(16rem, 100%)\`: written as a bare \`minmax(16rem, 1fr)\` the track refuses to shrink below 16rem — 256px — so anywhere the grid is handed less room than that, the track overflows its container and the page scrolls sideways. A 240px sidebar does it, a narrow modal does it, and so does a card grid nested inside another padded column. That horizontal-scroll bug is in production on a very large number of sites.

### Width is not the only thing that changes

| At narrow widths | Design consequence |
|---|---|
| Input is a thumb, not a cursor | 44 × 44px targets, and the primary action within reach at the bottom |
| Hover does not exist | Nothing may be hover-only — no hover-revealed delete buttons |
| Attention is fragmented | Sara from Chapter 1 is on a bus: autosave, restore scroll position |
| Bandwidth is worse | The loading state you designed in Chapter 2 is the state most seen |
| Notches and home bars | Respect \`env(safe-area-inset-bottom)\` on fixed bars |

### The mistake

Deleting content on small screens with \`display: none\`. Mobile users are not a different species who want less; they are the same people in a worse posture, and the price they still need to see is still the price. Reorder it, collapse it behind a disclosure, defer it to a second screen — but do not decide on their behalf that they came for less.

The second mistake is testing only by dragging the browser window. Device emulation shows you widths; it does not show you a real phone at 200% text size, in daylight, on Slow 4G, with one thumb.
        `),
        lesson('Microcopy: The Words Are the Interface', 13, `
Users do not read your layout. They read the words in it, and a badly named button costs more than a badly aligned one. Copy is a design material — it is drawn last only by teams who then discover it does not fit.

### Buttons name the outcome

The label should complete the sentence *"I want to ..."*:

| Weak | Why | Better |
|---|---|---|
| Submit | Names the mechanism, not the result | Send message |
| OK | Confirms nothing in particular | Delete 3 files |
| Yes / No | Forces the user to re-read the question | Cancel enrolment / Keep enrolment |
| Learn more | Same label on nine links; useless to a screen-reader user listing links | See the 8-week syllabus |

The screen-reader consequence is concrete: a common navigation mode reads out every link on a page in isolation. Nine identical "Learn more" entries are nine dead ends.

### Errors say what happened, why, and what to do next

> **Before.** "Error: invalid input."
>
> **After.** "That email address is missing an @ — check for a typo. We'll send your receipt here."

| Never | Because | Instead |
|---|---|---|
| "You entered an invalid date" | Blames the user | "Enter a date as 3 Apr 2026" |
| "Error 422: unprocessable entity" | Exposes the plumbing | "We couldn't save that — try again in a moment" |
| "Something went wrong" | True and useless | Name the thing that failed and offer the retry |
| "Oops! 🙈" on a failed payment | Tone mismatched to stakes | Plain, calm, specific |

Tone scales inversely with stakes. Playful is fine on an empty state; on lost work, money or data it reads as the product not taking the user seriously.

### The three-part empty state

Chapter 2 called the empty state the first screen every new user sees. It has exactly three parts:

> **Heading** — what would be here. "No enrolments yet"
> **One line** — why, and what it gets them. "Enrolled courses appear here with your progress and certificates."
> **One action** — "Browse 12 beginner courses"

Not two actions. Not an illustration and no action.

### Dates, numbers, and the ambiguity trap

\`03/04/2026\` is 3 April in Karachi and 4 March in Chicago, and no amount of user research fixes that. Write \`3 Apr 2026\`. For anything recent, pair a relative label with an absolute one: **"Updated 2 hours ago"** as the visible text, the full timestamp in the tooltip and the \`title\` attribute.

Round large numbers in scanning contexts (\`12.4k views\`) and never round anything a user might reconcile — money, remaining lessons, days left.

### Write the copy in the wireframe

Chapter 2 banned lorem ipsum for layout reasons; the stronger reason is that copy written after the box exists gets squeezed to fit the box. Write the real error message while you are drawing the error state and you will discover the field needs two lines, or that the rule itself is unreasonable.

### The mistake

Writing in the voice of the company instead of the voice of the task.

> **Before.** "Your enrolment request has been successfully submitted for processing."
>
> **After.** "You're enrolled. Lesson 1 is ready."

Cut *please*, *successfully*, *kindly*, and every noun phrase that names an internal process. Use sentence case, second person, present tense. Then read it aloud: if you would not say it to someone standing next to you, it is not finished.
        `),
        lesson('Forms People Actually Finish', 14, `
The funnel in Chapter 1 lost 1,860 people inside a nine-field form. Chapter 2 removed four of the fields. This is the craft that recovers most of the rest — and almost all of it is decided in the markup.

### One column, labels above

Multi-column forms make the eye zigzag and make it ambiguous which label belongs to which input. Eye-tracking work on this is old and consistent: a single column is faster to complete. The only honest exception is genuinely paired data — card expiry and CVC, or a house number beside a street.

Labels sit **above** the input, not beside it and never inside it. Above survives translation into a longer language, survives narrow screens, and stays visible while typing (Chapter 5's placeholder rule).

### The markup does half the work

\`\`\`html
<label for="phone">Mobile number</label>
<input id="phone" name="phone" type="tel" inputmode="numeric"
       autocomplete="tel" enterkeyhint="next" />
\`\`\`

| Field | type | inputmode | autocomplete |
|---|---|---|---|
| Email | \`email\` | \`email\` | \`email\` |
| Phone | \`tel\` | \`numeric\` | \`tel\` |
| SMS code | \`text\` | \`numeric\` | \`one-time-code\` |
| Card number | \`text\` | \`numeric\` | \`cc-number\` |
| New password | \`password\` | — | \`new-password\` |

Correct \`autocomplete\` tokens are the highest-return twenty minutes in form work: the browser fills the field, the phone shows the right keyboard, and the password manager offers to save instead of silently failing. Getting this wrong is invisible to you and expensive for everyone else.

### Validate on blur, then live

\`\`\`js
// Check when the user leaves the field — never while they are still typing
input.addEventListener('blur', () => validate(input));

// Once an error is already visible, update live so they watch the fix land
input.addEventListener('input', () => {
  if (input.getAttribute('aria-invalid') === 'true') validate(input);
});
\`\`\`

The classic bug is validating on every keystroke from the start: the user types \`u\` and the form shouts *"enter a valid email address"* at someone who is doing nothing wrong. It reads as hostile, and people abandon hostile forms.

Tie the message to the field so it is announced, not just seen:

\`\`\`html
<input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error">Enter an email address like name@example.com</p>
\`\`\`

### Never destroy what they typed

| Anti-pattern | What it costs |
|---|---|
| Clearing the form on a failed submit | Everything, and they do not come back |
| Blocking paste in password or card fields | Password-manager users, who have the strongest passwords |
| \`maxlength\` that truncates silently | A wrong value the user believes is right |
| Reformatting a phone number mid-typing | The cursor jumps to the end and the number is mangled |
| Errors summarised only at the top | Scrolling back and forth to find which field |

Show errors inline, at the field, **and** move focus to the first one on submit.

### Ask cheap things first, expensive things last

Email and a password cost nothing to give. A phone number, a CNIC, a card — those are trust purchases, and they belong after the user has invested effort. Split long forms into named steps, show *"Step 2 of 3 — Payment"*, and persist each step so a dropped connection on the bus does not cost the whole session.

### The mistake

Marking every required field with a red asterisk that is never explained. If eight of nine fields are required, invert it: leave required fields unmarked and label the exception **"Phone number (optional)"**. One word, in the label, where it is read.
        `),
      ],
      [
        q('A heading is styled \`font-size: 4vw\`. What is wrong with it?', [
          'Viewport units are not supported in older mobile browsers',
          'It cannot be used together with a line height',
          'It ignores the user\'s browser text-size setting, so the text will not respond to zoom',
          'It renders at a fractional pixel value and looks blurry',
        ], 2, 'A pure viewport unit is anchored to the window rather than the user\'s font preference; the middle term of a clamp() needs a rem component so text settings still apply.'),
        q('The same card component appears in a 280px sidebar and a 900px main column. Which rule makes it lay out correctly in both?', [
          'A container query on the card\'s wrapper, because the card responds to its own available width',
          'A media query at 900px, because that is where the main column starts',
          'A fixed width on the card so it looks the same everywhere',
          'Two separate card components, one per context',
        ], 0, 'Media queries measure the window, but a component only ever has the space its container gives it — which is exactly what a container query measures.'),
        q('Which button label is written correctly?', [
          'Submit',
          'OK',
          'Learn more',
          'Delete 3 files',
        ], 3, 'A label should name the outcome so it completes "I want to ..." — the user should not have to re-read the dialog to know what the button does.'),
        q('A sign-up form marks the email field invalid as soon as the first character is typed. What is the fix?', [
          'Validate only when the form is submitted',
          'Validate on blur, then re-validate on input only while an error is already showing',
          'Remove client-side validation and rely on the server',
          'Show the error but style it in a softer colour',
        ], 1, 'Blur-first validation waits until the user has finished the field, while live re-validation afterwards lets them see the correction take effect.'),
      ]
    ),
    chapter(
      'Shipping It and Keeping It Alive',
      'Auditing the real build, measuring the change with numbers, and running a design system into its second year without it rotting.',
      [
        lesson('Design QA: Auditing the Build in the Browser', 14, `
The build is never exactly what you drew, and the gap grows every sprint until someone measures it. Design QA is that measurement: a fixed pass over the real, running interface, producing bugs specific enough to fix.

### Compare, do not feel

"It looks a bit off" starts an argument. Open the staging build at 375px and at 1440px, open the design file beside it, and use DevTools to read the actual computed values. Faster still: screenshot the build, paste it over the frame in Figma at 50% opacity, and a systematic 4px offset becomes visible in about three seconds.

### The pass, in this order

| Step | What you are checking | Typical finding |
|---|---|---|
| 1. Spacing | Every gap is on the Chapter 3 scale | 13px and 21px paddings |
| 2. Colour | Values come from tokens, not typed hex | \`#999\` secondary text at 2.85:1 |
| 3. States | Hover, focus, active, disabled, loading, error | Focus ring removed for being "ugly" |
| 4. Content | Longest title, longest name, zero items, 500 items | Two-line title clipped to one |
| 5. Keyboard | Tab through, Escape out of the dialog | Modal does not trap or restore focus |
| 6. Zoom | 200% with no horizontal scroll | Fixed-height card, text overflows |
| 7. Throttled | Slow 4G, mid-range Android | The loading state nobody has ever seen |

Step 7 catches the failure that local development structurally hides: on localhost every request returns in 8ms, so the loading state never renders and nobody notices it says "Loading..." in unstyled 12px grey. Throttle the network in DevTools and it appears.

### Count the off-system values

Paste this into the console on any page to see what the product is really made of:

\`\`\`js
// Tally every rendered value for a few properties, most common first
const seen = new Map();
for (const el of document.querySelectorAll('*')) {
  const s = getComputedStyle(el);
  for (const prop of ['font-size', 'gap', 'padding-top', 'border-radius']) {
    const v = s.getPropertyValue(prop);
    if (!v || v === '0px') continue;
    const key = prop + ': ' + v;
    seen.set(key, (seen.get(key) || 0) + 1);
  }
}
console.table([...seen].sort((a, b) => b[1] - a[1]).slice(0, 40));
\`\`\`

A product on a system prints 4, 8, 12, 16, 24, 32 and seven font sizes. A product that has drifted prints 41 font sizes including 13px, 15px and 22px. That table is not an opinion, which is why it ends the conversation about whether things are "basically consistent".

### Write a bug a developer can fix

> **Weak.** "Spacing looks off on the course card and the grey is too light."
>
> **Strong.** "Course card, grid view, 375px, Chrome 141. Gap between title and metadata renders 13px; should be \`--space-2\` (8px). Metadata colour is \`#999999\` (2.85:1, fails AA); should be \`--color-text-secondary\`. Screenshot attached. Severity 3."

Name the screen, the width, the browser, the measured value, the **token** it should be, and the severity from Chapter 5's scale. A bug written as a token name gets fixed once; a bug written as "24px" gets re-typed and drifts again next sprint.

### Half of the findings are yours

Expect a third to a half of the differences to be things you never specified — a state you did not draw, a breakpoint you did not annotate, an error message that did not exist. Those are not developer bugs. Fix them in the design file, not just in the ticket, so the next feature inherits the answer instead of re-improvising it.

### The mistake

Doing QA once, at the end, on a fast machine in Chrome. Design QA belongs on every ticket, at the moment the branch is reviewable — a 13px gap is a two-minute fix on an open branch and a backlog item nobody ever picks up once it has shipped.
        `),
        lesson('A/B Tests That Do Not Fool You', 14, `
Five participants tell you *why* something fails. They cannot tell you whether version B earns more enrolments than version A — five people cannot measure a three-point difference. That needs an experiment, and experiments go wrong in a small number of very predictable ways.

### Write the hypothesis as a prediction

> **Hypothesis.** Because 4 of 5 testers went looking for the syllabus under *Courses* rather than *Resources*, and P2 expected the outline on the course page itself (Chapter 5), showing the outline above the fold will raise registration starts from 25% to at least 28%. **Guardrail:** refund rate must not rise.

One primary metric, one baseline, one expected effect, and a guardrail that would make you reject the win anyway. Written before the test, this is a prediction. Written after, it is a story.

### Sample size is not negotiable

For a conversion rate, a workable approximation for 80% power at the usual 5% threshold:

\`\`\`text
n per arm  =  16 x p x (1 - p) / d²        p = baseline rate, d = absolute lift

p = 0.25, d = 0.05 (25% -> 30%)   n = 16 x 0.1875 / 0.0025    =  1,200 per arm
p = 0.25, d = 0.025 (25% -> 27.5%) n = 16 x 0.1875 / 0.000625  =  4,800 per arm
p = 0.25, d = 0.0125 (25% -> 26.25%) n = 16 x 0.1875 / 0.00015625 = 19,200 per arm
\`\`\`

Halving the effect you want to detect quadruples the traffic you need. At Chapter 1's 12,400 monthly course-page views, a 5-point lift is testable in under two weeks and a 1.25-point lift needs over three months — during which the page will change for other reasons and invalidate the whole thing.

The honest conclusion when the arithmetic does not work: **do not run the test.** Small sites do not have an A/B testing problem, they have a sample size. Run a moderated study with five people, ship the fix on judgement, and spend the measurement budget where the traffic is.

### Peeking is how teams ship noise

Checking daily and stopping the moment p drops below 0.05 does not give you a 5% false-positive rate. Repeated looks at accumulating data push it towards 20–30%: given enough peeks, random noise will cross the line eventually.

Fix the sample size and the end date in advance and do not look at significance until you reach them — or use a sequential testing method that is designed for continuous monitoring. Run at least one full week regardless, because Tuesday and Sunday behave differently, and two weeks if your buying cycle is weekly.

### The other four traps

- **Novelty effect.** Regulars react to any change, then stop. Segment new versus returning users; if the whole effect sits in returning users and decays over two weeks, it was novelty.
- **Sample ratio mismatch.** If a 50/50 split delivers 53/47, something is broken in assignment or logging. Stop and fix it; do not interpret the result.
- **Metric shopping.** Look at 20 metrics and one will be "significant" by chance. Declare the primary metric in advance; everything else is a hint for the next test.
- **Local maximum.** A/B tests optimise the design you already have. No amount of button testing produces the restructure that Chapters 1 and 2 produce.

### What a flat result actually means

Usually not "design does not matter". Usually the change was too small to move a metric that far downstream — you tested a button colour against a conversion rate three screens later. Move the metric closer to the change (clicks on that element) or make the change bigger.

And note that flat-but-clearer is often still worth shipping: if the moderated test showed higher task success and the experiment shows no revenue harm, you have improved the product without paying for it. Some things are never A/B tested at all — you do not run an experiment on whether a focus ring should exist.
        `),
        lesson('Design Debt, Governance, and Deprecation', 13, `
A design system's second year is harder than its first. The components exist, the enthusiasm has gone, three teams are shipping on deadlines, and every shortcut taken now looks identical to a decision. Governance is the boring machinery that keeps Chapter 4's system from quietly becoming a folder of old files.

### Audit with numbers, not adjectives

Run the console tally from the previous lesson across your ten highest-traffic pages and count distinct values:

| Signal | Healthy | Drifting |
|---|---|---|
| Font sizes | 7 | 41 |
| Text/background colours | ~20 | 180 |
| Shadow values | 3 | 27 |
| Button implementations | 1 | 6 |
| Detached instances in the Figma file | 0 | 74 |

Track these monthly. A number that grows every month is a process problem, not a tidiness problem, and no amount of one-off cleanup fixes it.

### A contribution model with four doors

| Door | When | Who decides |
|---|---|---|
| **Use as-is** | The component exists | Nobody — just use it |
| **Compose** | It can be built from existing parts | The designer, noted in the file |
| **Extend** | An existing component needs a new property | System owner reviews, ships as a minor version |
| **New component** | Two teams, three real use cases, already shipped once locally | System owner plus one product designer |

The rule that keeps a library small: **nothing enters the system until it has shipped twice.** Chapter 4 said grow from evidence; this is the same idea written as a policy so it survives an enthusiastic new hire.

### Deprecate on a timetable

\`\`\`text
2.3.0  Added Banner variant "info"                  additive — safe
2.4.0  Deprecated Alert; use Banner instead         warn, do not delete
       Figma: rename to "Alert [deprecated -> Banner]"
       Code:  console.warn once, with the migration link
3.0.0  Removed Alert                                breaking — announced 8 weeks earlier
\`\`\`

Deleting a component the same day you replace it is how a system loses its users: a team gets a broken build on a release afternoon, and the next time they need something they will detach an instance rather than depend on you. Announce, warn, give a date and a migration note, then remove.

### Measure adoption or you are guessing

\`\`\`bash
# Every raw hex colour outside the token file — the drift number, tracked weekly
grep -rEoh '#[0-9a-fA-F]{3,8}' src --include='*.css' --include='*.jsx' \\
  --exclude=tokens.css | sort | uniq -c | sort -rn
\`\`\`

Simpler versions of the same idea work fine: count library instances versus raw layers in Figma, count imports of the Button component versus hand-rolled \`<button className="...">\`, and watch both over time. Adoption is the only proof a system is a system; an unused component library is a beautiful, expensive folder.

### Not all inconsistency is worth fixing

Prioritise debt in this order: anything that **fails accessibility** (fix now, it is a legal and human problem), anything on a **high-traffic flow**, anything that **blocks a rebrand or a dark mode**, then everything else. A 2px radius difference on an internal admin page is not worth a sprint, and treating it as though it were is how design teams acquire a reputation for pedantry.

### The mistake

Running the system as a product with no customers — shipping components nobody requested while product teams quietly build their own. Sit in their design reviews, read their tickets, and let the backlog come from real screens. The Chapter 5 loop still applies at system scale: audit, fix the worst thing, measure, repeat.
        `),
      ],
      [
        q('Why does throttling the network during design QA matter?', [
          'It shows how the layout degrades on a narrower screen',
          'It makes screenshots more accurate',
          'It reduces the number of browsers you need to test',
          'On a fast local connection the loading state never renders, so nobody sees that it was never designed',
        ], 3, 'Requests that resolve in milliseconds hide the loading state entirely, which is why it is so often shipped unstyled.'),
        q('A two-week test reaches p = 0.04 on day three. What is the correct action?', [
          'Ship the winner immediately and free up the traffic',
          'Keep running to the pre-declared sample size and end date',
          'Extend the test until p drops below 0.01',
          'Switch the primary metric to the one that is moving fastest',
        ], 1, 'Stopping at the first look that crosses the threshold inflates the false-positive rate well above 5%, because repeated peeks let noise cross the line eventually.'),
        q('Your baseline is 25%, you want to detect a 1.25-point lift (19,200 per arm), and you get 12,400 course-page views a month. What should you do?', [
          'Run the test anyway and stop when it looks positive',
          'Reduce the confidence level until the sample size fits',
          'Do not run it — test the change with five participants and ship on judgement',
          'Run it on a single arm and compare against last month',
        ], 2, 'When the traffic cannot support the effect you are looking for, an underpowered test produces noise dressed as evidence; qualitative work answers it far more cheaply.'),
        q('A component is being replaced. What is the safe way to retire the old one?', [
          'Mark it deprecated with a migration note and a removal date, then remove it in a later major version',
          'Delete it as soon as the replacement ships, so nobody uses it by mistake',
          'Leave it in place indefinitely and document that it is discouraged',
          'Change the old component to render the new one silently',
        ], 0, 'A warned, dated deprecation lets teams migrate on their own schedule; a same-day deletion breaks builds and teaches people to detach rather than depend on the library.'),
      ]
    ),
  ],
  final: [
    q('Which interview question produces the most reliable evidence?', [
      'Would you use a study-streak feature?',
      'Do you find the current dashboard confusing?',
      'Tell me about the last time you tried to keep up with an online course.',
      'How often do you usually study?',
    ], 2, 'Asking about a specific recent event retrieves behaviour from memory instead of a hypothetical answer people give to be agreeable.'),
    q('What makes a persona capable of settling a design argument?', [
      'Observed behaviour and context that rule specific design options in or out',
      'A realistic photograph and a memorable name',
      'Demographic detail such as age, city and hobbies',
      'Being written by the most senior stakeholder',
    ], 0, 'A persona is useful only when it constrains decisions — "studies in 20-minute blocks on a phone" answers questions that "loves yoga" cannot.'),
    q('A journey map shows sign-up as smooth and week two as flat and frustrating, with no broken feature. What does this indicate?', [
      'The map is wrong, since nothing is broken',
      'That sign-up needs further optimisation',
      'That the emotion row should be removed',
      'A gap where the product does nothing to help, which is where users quietly drop out',
    ], 3, 'Drop-off often happens where nothing fails but nothing helps — the trough in the emotion row, not the visible funnel step.'),
    q('Card sorting produced clean groups, but a tree test shows high success with low directness. What do you change?', [
      'The grouping — merge the categories',
      'The labels — people guess wrong first and recover by backtracking',
      'The visual design of the navigation',
      'Nothing; success rate is what matters',
    ], 1, 'Backtracking means the first guess was wrong, which is a naming problem rather than a structural one.'),
    q('Why should wireframes stay low-fidelity while the structure is still in question?', [
      'Polish creates commitment and moves critique to colour and radius instead of the flow',
      'Low-fidelity files are smaller',
      'High-fidelity tools are harder to learn',
      'Clients cannot understand high-fidelity mockups',
    ], 0, 'A finished-looking screen gets critiqued on surface detail, and hours invested make you defend a layout you should discard.'),
    q('Body text is #999999 on white (2.85:1). Which change makes it WCAG AA compliant?', [
      'Increase the size to 18px to qualify as large text',
      'Add a subtle text shadow',
      'Darken it to at least 4.5:1, for example #767676',
      'Set it to 50% opacity black instead',
    ], 2, 'AA demands 4.5:1 for normal text, and the 3:1 large-text exemption only starts at 24px (or 18.66px bold).'),
    q('Adjacent text levels sized 16px and 17px produce what problem?', [
      'A broken baseline grid',
      'Failure of the contrast requirement',
      'Inconsistent line lengths',
      'No perceptible hierarchy — the eye reads them as the same level',
    ], 3, 'Hierarchy steps need a clear jump — roughly 1.25x — or the difference reads as an error rather than a level.'),
    q('Why does a design system need a semantic token tier between primitives and components?', [
      'It reduces the total number of colours',
      'It lets one redefinition retheme everything, so dark mode and rebrands do not touch components',
      'Primitive values cannot be referenced directly',
      'It makes the CSS file smaller',
    ], 1, 'Components referencing roles rather than raw values mean a theme change is a token edit instead of a hunt through every usage.'),
    q('Which of these is a design decision rather than a development detail, and so belongs in handoff?', [
      'What the screen shows when the list is empty and when a request fails',
      'Which CSS framework to use',
      'The database schema for courses',
      'Whether to use REST or GraphQL',
    ], 0, 'Empty and error states are designed content; leaving them out means a developer improvises them, usually as a raw error string.'),
    q('You have ten participants and a two-week timeline. What is the most effective plan?', [
      'Test all ten at the end, once the design is finished',
      'Skip testing and rely on an automated accessibility scan',
      'Send a survey to 200 users instead',
      'Test five now, fix what you find, and test five more on the revision',
    ], 3, 'Iterative rounds test an improved design each time; a single late round finds problems too expensive to act on.'),
    q('A grid uses repeat(auto-fit, minmax(16rem, 1fr)) and overflows sideways when it is placed in a 240px sidebar. What is the fix?', [
      'Add a viewport media query below 360px that switches to a single column',
      'Wrap the track minimum as min(16rem, 100%) so it can shrink below 16rem',
      'Change auto-fit to auto-fill',
      'Set overflow-x: hidden on the body',
    ], 1, 'A bare 16rem minimum is 256px and refuses to shrink, so it overflows any container narrower than that; min(16rem, 100%) lets the track collapse to the room it actually has.'),
    q('A failed save shows "Error 422: unprocessable entity". What is the main problem?', [
      'The message should be shown in red rather than grey',
      'Status codes should be shown only to signed-in users',
      'It needs a friendlier tone and an emoji',
      'It names the plumbing instead of saying what failed and what to do next',
    ], 3, 'An error message has three jobs — what happened, why, and the next action — and an internal status code does none of them.'),
    q('A two-week experiment crosses p = 0.05 on day three. Why is stopping there unsafe?', [
      'Repeated looks at accumulating data let random noise cross the threshold, so the real false-positive rate is far above 5%',
      'Three days is never long enough to reach the sample size',
      'Significance must be measured at the end of a calendar month',
      'The effect will always be larger later in a test',
    ], 0, 'The 5% threshold assumes a single planned look; peeking daily turns it into many chances for noise to look like a result.'),
    q('Which design QA bug report is most likely to be fixed correctly?', [
      '"The course card spacing looks a bit tight in the grid."',
      '"Please make the metadata text darker and add more space above it."',
      '"Course card at 375px: title-to-metadata gap renders 13px, should be --space-2; metadata is #999999 (2.85:1), should be --color-text-secondary."',
      '"Card spacing should be 8px and the grey should be darker."',
    ], 2, 'Naming the screen, the measured value and the token means the fix lands on the system rather than being re-typed as a one-off number.'),
  ],
});
