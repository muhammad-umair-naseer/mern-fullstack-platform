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
        `,
        [
          q('Halfway through an interview you explain what you are building so the participant has context. What does that do to the rest of the session?', [
            'It contaminates it, because the participant becomes a polite guest',
            'It helps, because an informed participant gives sharper feedback',
            'It has no effect if you keep asking about past behaviour',
            'It shortens the session, since they stop asking what it does',
          ], 0, 'Once you pitch, the participant switches from informant to guest, and guests are polite, so everything said after that moment is unreliable.'),
          q('Which interview note is still usable evidence three weeks later?', [
            'User found the navigation hard to understand',
            'Participant seemed frustrated during the browsing task',
            '"I gave up because I could never find where I left off" (P3)',
            'Navigation needs simplifying before the next release',
          ], 2, 'A verbatim quote preserves the participant\'s own words so it can be re-read and re-interpreted, while a summary bakes in your interpretation permanently.'),
          q('You are researching a product used by both students and instructors. How many interviews do you need?', [
            'Five to eight in total, split across the two groups',
            'Thirty or more, so the findings are statistically significant',
            'Five to eight for each group, since patterns repeat per group',
            'As many as possible, until literally nobody says anything new',
          ], 2, 'Complaints start repeating after about five conversations inside one behaviour group, so two genuinely different groups each need their own five to eight.'),
        ]
      ),
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
        `,
        [
          q('Why does a persona set need one persona declared as primary?', [
            'Because it makes the set easier to present to stakeholders',
            'Because secondary personas can then be dropped from the set',
            'Because research budgets rarely cover more than one group',
            'Because without one, every trade-off reopens the argument the set was built to settle',
          ], 3, 'A primary persona names whose needs win when two groups conflict, which is precisely the decision the set exists to make.'),
          q('Two 22 year old students behave completely differently when they study. How should they be clustered?', [
            'As separate personas, because clustering follows behaviour not demographics',
            'As one persona, since they share age, occupation and life stage',
            'As one persona with two sets of goals listed underneath',
            'As a single persona plus a note describing the variation',
          ], 0, 'Behaviour is what constrains design decisions, so people who act differently belong to different personas even when their demographics match exactly.'),
          q('A persona claims learners study on a weak connection, but nobody can say where that came from. What should happen to the line?', [
            'Keep it, since it is a reasonable assumption about the market',
            'Move it to a secondary persona, where accuracy matters less',
            'Cut it or find its source, because unsourced lines are invented',
            'Soften the wording to hedge until research can confirm it',
          ], 2, 'Every claim on a persona should trace back to a quote, an analytics number or a support ticket, because invented detail is how a persona turns back into a poster.'),
        ]
      ),
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
        `,
        [
          q('Your journey map contains only screens your team has already designed. What is the problem?', [
            'It will be hard for developers to read without annotations',
            'It is a flow diagram, so it can only confirm what you believe',
            'It has too many stages to fit on one page in a workshop',
            'It cannot be kept in sync once the screens change in Figma',
          ], 1, 'The valuable cells sit outside the product, in the messages, emails and gaps between sessions, so a map made of your own screens can never surprise you.'),
          q('Every stage on your journey map succeeds. Why is that a warning sign?', [
            'Because a map should always show at least one negative emotion',
            'Because stakeholders distrust maps that look too positive',
            'Because the stages have to match the analytics funnel exactly',
            'Because your lost users are the ones who hit expired links and failed payments, and those cells are undesigned',
          ], 3, 'A happy path map describes the people you did not lose, so each stage needs a row for what happens when it fails and those cells need designing.'),
          q('Why is a journey map worth building twice, once from research and once about six months later?', [
            'The second one is drawn from real behaviour, so it corrects what research only predicted',
            'Maps expire after six months under most research standards',
            'Two versions let you show progress to stakeholders in reviews',
            'The first is a draft that should be discarded once you ship',
          ], 0, 'The first map predicts from what people said and the second measures what they did, and dating both stops an old workshop artefact being used as a current plan.'),
        ]
      ),
            lesson('Synthesis: Turning 400 Notes Into Six Insights', 13, `
Three days of interviews leave you with about 400 observations and a strong feeling that you understand the problem. Feelings do not survive a stakeholder meeting. Synthesis is the step that turns a pile of quotes into six statements a team can design against, and skipping it is the main reason research gets presented once and then never opened again.

### Cut the transcripts into atoms

Go through every transcript and pull out one observation per note. One note, one idea, in the participant's own words, tagged with who said it.

\`\`\`text
P3  | "I could never find where I left off."
P3  | Screenshots the lesson list and uses it as a bookmark
P7  | Starts on the laptop at home, continues on the phone on the bus
P7  | "I thought I had lost my progress, so I stopped"
P11 | Keeps a WhatsApp note to herself with the last lesson number
\`\`\`

Three rules keep this honest. Do not summarise: "navigation is confusing" is your conclusion, not their observation, and once it is written that way nobody can audit it. Do not merge two ideas into one note, because a merged note cannot be regrouped. Never drop the participant ID, because that ID is what lets you count later.

### Group upward, never into folders you prepared

Spread the notes out and pair the ones that feel related. Keep pairing until clusters form. Only then name each cluster, and name it with a full sentence rather than a noun.

"Navigation" is a folder. "People lose their place between devices and assume their progress is gone" is a finding you can act on, and it already implies three fixes.

Writing the category names first is the classic failure. Do that and you file notes into the beliefs you walked in with, and the research becomes an expensive confirmation of your own assumptions. Categories come out of notes, never the other way around.

### Count, because volume is the argument

A theme that four of eleven people hit is interesting. A theme that nine hit is a roadmap item. Put the numbers where everyone can see them:

| Theme | Participants | Corroborated by |
|---|---|---|
| Loses place across devices | 9 of 11 | 41 support tickets in 90 days |
| Cannot tell how long a lesson is | 6 of 11 | 22% bounce on lesson pages |
| Unsure the certificate is worth anything | 5 of 11 | 12 pre sales emails |
| Wants downloadable video | 2 of 11 | Nothing else |

The bottom row is the one to watch. Two people asked for it loudly, it is easy to remember, and nothing else in your data touches it. Single source themes belong in a parked list, not on the roadmap. Do not delete them either: a strange observation that appears again in the next round is often the most valuable thing you own.

### Write insights as sentences with tension

An insight is not a topic. It carries a behaviour, a reason, and a consequence for the design:

> Learners resume on a different device than they left on (9 of 11), and because progress is only shown on the course page they assume it was lost, so resume state has to be visible anywhere the course is.

Compare that with "users want better progress tracking", which is true, unarguable, and gives a designer nothing to hold. A usable test: if an insight does not rule out at least one design you could otherwise have shipped, it is a summary.

### Ship it in a shape people reuse

One page. Six insight sentences at most, each with a verbatim quote, a count, and the design implication. Link the raw notes underneath so anyone can check your work, and put the date and the participant count at the top so a reader knows how old the evidence is.

The 40 slide deck gets read once, praised, and closed. A one page insight sheet gets pinned next to the backlog and quoted in arguments six months later, which is the only measure of research that matters.
      `,
        [
          q('A synthesis note reads "navigation is confusing". What is wrong with it?', [
            'It is too short to be useful once the clusters form',
            'It is a conclusion, so nobody can check what was observed',
            'It lacks a participant ID, which is the only real problem',
            'It belongs on the insight sheet rather than on a note',
          ], 1, 'Notes must hold observations in the participant\'s words, because a conclusion written as a note cannot be audited or regrouped and smuggles your interpretation into the data.'),
          q('A team writes the cluster names on the wall first, then files notes underneath them. What does that produce?', [
            'Faster synthesis with the same findings, since names are provisional',
            'Balanced clusters, because each category collects similar volume',
            'Research that mostly confirms the assumptions the team held',
            'Cleaner grouping, provided the names come from the interview guide',
          ], 2, 'Pre-written categories act as a filter, so notes land in existing beliefs and the clusters that would have contradicted the team never get a chance to form.'),
          q('Two of eleven participants asked loudly for downloadable video and nothing else in your data touches it. What do you do with that theme?', [
            'Park it on a watch list and look for it in the next round',
            'Delete it, since two participants prove nothing on their own',
            'Promote it, because strongly stated needs outrank quiet ones',
            'Merge it into the nearest larger theme so it is not lost',
          ], 0, 'A single source theme is not a roadmap item yet, but deleting it discards a signal that becomes your most valuable finding if it reappears next round.'),
        ]
      ),
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
        `,
        [
          q('You do not yet know what your categories should be. Which method fits, and what is its most valuable output?', [
            'A closed sort, because it validates the structure you drafted',
            'An open sort, because the group names participants invent become your labels',
            'A tree test, because it reports success and directness scores',
            'A closed sort, because comparable data needs fixed categories',
          ], 1, 'An open sort lets participants build the groups and name them, and those names are your labels written in your users\' own vocabulary.'),
          q('In an open sort, one card lands in a different group with almost every participant. What does that tell you?', [
            'The card is genuinely ambiguous and needs renaming, splitting or a second home',
            'The sample is too small, so more participants will settle it',
            'The card describes content that should be removed from the site',
            'Participants misread the task, so the session should be rerun',
          ], 0, 'Cards that attract no agreement are ambiguous content, and the fix lives in the label or the structure rather than in recruiting more participants.'),
          q('Why prefer a wider, shallower hierarchy over a deep one?', [
            'Because a menu should never contain more than seven items',
            'Because search engines rank shallow sites more highly',
            'Because deep trees load more slowly on mobile connections',
            'Because every extra level is another blind guess, and wrong guesses compound',
          ], 3, 'Users pick each level without seeing what is inside it, so depth multiplies the chance of an early wrong turn that hides the target completely.'),
        ]
      ),
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
        `,
        [
          q('The password reset flow shows the same confirmation whether or not the email is registered. Why is that deliberate?', [
            'It saves designing a second screen for a rare edge case',
            'It keeps the flow diagram symmetrical and easier to read',
            'A different message would reveal which addresses have accounts',
            'Email providers reject messages naming an unknown account',
          ], 2, 'Distinct messages turn the reset form into an account lookup tool, so the safe design confirms nothing about whether an address exists.'),
          q('A decision diamond in your flow has only one arrow leaving it. What happens when it ships?', [
            'The missing branch gets improvised in code, usually as a raw error string',
            'The developer asks for the missing screen before building it',
            'The application simply skips that branch at runtime',
            'QA catches the gap because the diagram is visibly incomplete',
          ], 0, 'Undesigned branches still happen to real users, so whoever builds the screen invents the experience under deadline, which is how raw error text reaches production.'),
          q('Sign up asks for a phone number that the product first needs at enrolment. What is the right call?', [
            'Keep it but mark it optional, so the form still collects it',
            'Keep it and add helper text explaining why it is needed',
            'Move it to a second step of the same sign up form',
            'Defer it to enrolment, where the reason is obvious to the user',
          ], 3, 'Every field asked before its purpose is clear costs completions, and moving it to the moment it is genuinely required removes that cost without losing the data.'),
        ]
      ),
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
        `,
        [
          q('A team opens its first design review with a fully styled high fidelity mockup. What predictably goes wrong?', [
            'Reviewers critique the button radius while the flow goes unquestioned',
            'Stakeholders refuse to sign off before seeing wireframes',
            'The file grows too heavy for the review session to load',
            'Developers start building before the copy is finalised',
          ], 0, 'Polish invites polish level feedback, and after hours of visual work the team defends a structure that should still be open to challenge.'),
          q('You are testing a checkout flow with five users next week. Which fidelity earns its cost?', [
            'Crazy 8s sketches, since speed matters more than realism here',
            'Mid fidelity with real text and real spacing but no colour',
            'Low fidelity grey boxes with placeholder headings throughout',
            'High fidelity final visuals, so nothing distracts the testers',
          ], 1, 'Mid fidelity carries the real content and spacing a tester needs to make decisions, without the visual polish that costs hours and pulls feedback onto styling.'),
          q('Why design the 375px layout before the desktop one?', [
            'Because most traffic arrives from phones in every product',
            'Because narrow frames are quicker to draw and iterate on',
            'Because squeezing a finished desktop layout forces removals nobody will accept',
            'Because desktop browsers scale narrow layouts up automatically',
          ], 2, 'Starting narrow makes you rank content while it is still cheap, whereas cutting from a finished desktop layout means removing elements that already have defenders.'),
        ]
      ),
            lesson('Navigation Shells and the Cost of a Hamburger', 13, `
A team moved five sections out of a hamburger drawer and into a bottom tab bar. Same labels, same pages, same content, nothing else touched. Visits to the Certificates section went from 3% of sessions to 19%. The navigation had never been broken. It was invisible, and invisible costs far more than ugly.

Card sorting told you what the groups are. The shell decides how many of them a person can see at once, and that is a separate decision with its own rules.

### Pick the shell from the count and the context

| Shell | Holds | Right for | Cost |
|---|---|---|---|
| Bottom tab bar | 3 to 5 | Phone apps with repeat destinations | Anything past five gets buried |
| Sidebar or rail | 5 to 15 | Desktop tools people sit in all day | Eats horizontal space |
| Top bar plus mega menu | 20 plus | Catalogues and marketing sites | Hover based, weak on touch |
| Drawer or hamburger | Any | Secondary, rarely used items | Roughly halves discovery |
| Segmented control | 2 to 4 | Views of one thing, not destinations | Constantly confused with navigation |

The last row is where teams go wrong. A tab bar item is a **place**, with its own state and its own scroll position, that you can leave and come back to. A segmented control switches the view of the place you are already in. Putting "All", "In progress" and "Completed" in a bottom tab bar tells someone they are in three different areas of the product, and they are not.

### Destinations, never actions

Navigation answers where. A button answers what. The moment "New post" or "Log out" appears in a tab bar, the model breaks, because pressing it does not take you anywhere you can navigate back from.

\`\`\`text
Bad tab bar:   Home | Search | New | Settings | Log out
Better:        Home | Search | Library | Profile
               New     = floating action button on Home and Library
               Log out = inside Profile, where account things live
\`\`\`

Settings and Log out reach tab bars for a predictable reason: two teams argued about priority and the shell became the compromise. Notice that neither is a place anyone visits twice a week.

### The More tab is a junk drawer

When six sections have to fit five slots, the reflex is a More tab. Watch what lands in it over the following year: every feature nobody could rank, filed where nobody looks. The honest alternative is a priority list you actually maintain, where the overflow is chosen from measured usage, reviewed each quarter, and governed by a written rule about what earns a top slot.

If you cannot name your least used section today, you are not ready to design an overflow.

### Every page is a landing page

People arrive from search and shared links, three levels deep, with no idea what site they are on. So each page carries the shell plus two things the shell cannot provide: a statement of where this sits, and a route to its siblings.

\`\`\`text
Courses  /  Design  /  UI/UX Design Bootcamp  /  Chapter 2
\`\`\`

A breadcrumb that only repeats the page title is decoration. A breadcrumb where every ancestor is a real link is a second navigation system for the price of one line of layout, and it is the cheapest fix for the deep arrival problem there is.

### Check it before you commit

Take the five tasks from your tree test and ask, for each one, which element of the shell a user would touch first. Three answers you do not want: "they would use search" means your labels are carrying nothing, "it depends" means the section belongs in two places, and "they would scroll the homepage" means you have a page pretending to be a menu.

Then count taps to the most frequent task. If your busiest daily action sits behind a drawer, a tab and a filter, no amount of visual polish will move the numbers.
      `,
        [
          q('A product has seven top level sections and the team wants a bottom tab bar. What is the disciplined move?', [
            'Ship all seven tabs, since users learn the icons quickly',
            'Cut or nest until three to five remain, giving the rest a home inside those',
            'Add a More tab holding the three least important sections',
            'Use a drawer instead, so every section is listed together',
          ], 1, 'A tab bar past five items truncates labels and shrinks targets, and the real work is deciding which sections are genuine destinations rather than hiding that decision.'),
          q('Why do All, In progress and Completed belong in a segmented control rather than a bottom tab bar?', [
            'They are filtered views of one place, not destinations with their own state',
            'Segmented controls are cheaper to build than a tab bar',
            'A tab bar can hold only two items on small phones',
            'Filters must sit at the top of a screen to stay reachable',
          ], 0, 'Navigation tells a user where they are, so presenting three views of a single list as three areas hands them a false model of the product.'),
          q('Moving five sections from a drawer into a visible tab bar lifted one section from 3% to 19% of sessions. Why?', [
            'Tab bars render faster, so people wait less when navigating',
            'The drawer needed two taps where the tab bar needs one',
            'Hidden options are never weighed, so the section never competed',
            'Bottom placement sits closer to the thumb on a modern phone',
          ], 2, 'People choose from what they can see, so an item behind a drawer is not considered and rejected, it is simply absent from the decision entirely.'),
        ]
      ),
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
        `,
        [
          q('You blur a screenshot by 6px and the only clearly readable shape left is the cookie banner. What have you learned?', [
            'The blur is too strong for the test to say anything useful',
            'The banner needs a lighter background colour',
            'Your real hierarchy puts the banner above the page content',
            'The screenshot was captured before the fonts had loaded',
          ], 2, 'The squint test strips detail and leaves what the eye registers first, so whatever survives the blur is what the page is genuinely emphasising.'),
          q('A section heading is larger than the body text but set in a lighter weight and a paler grey. What is the result?', [
            'The signals pull against each other and the level reads as flat',
            'A refined hierarchy, since size alone is enough to lead the eye',
            'Better readability, because heavy headings tire the reader',
            'The heading dominates, as size outranks every other signal',
          ], 0, 'Size, weight and contrast have to point the same way, so larger but lighter and paler cancels itself out and nothing on the screen looks like the point.'),
          q('A dialog offers Save, Save and continue, Preview and Cancel, all as solid rose buttons. What tends to happen?', [
            'Users press the leftmost button by default',
            'Fewer people press any of them, since the choice was handed back',
            'Completion improves, because every option is equally visible',
            'Cancel gets pressed most often, having the shortest label',
          ], 1, 'Equal weight forces the user to compare four options they never asked to compare, and hesitation rather than a click is the usual response.'),
        ]
      ),
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
        `,
        [
          q('Why set line height as a unitless 1.5 rather than a fixed 24px?', [
            'Fixed pixel values are rejected by most CSS linters',
            'Unitless values render more consistently across browsers',
            'It scales with the font size, so one value works at every step',
            'Unitless values inherit from the body element only once',
          ], 2, 'A multiplier recomputes at each size, which matters because 1.5 suits body text and looks far too airy on a 49px display heading.'),
          q('A paragraph fills the width of a 1440px monitor, roughly 200 characters per line. What breaks?', [
            'Nothing, provided contrast and font size both pass',
            'The eye loses the return sweep and re-reads or skips lines',
            'The font renders with incorrect hinting at that width',
            'Line height becomes visually too tight to follow',
          ], 1, 'Past roughly 75 characters the jump back to the start of the next line becomes unreliable, so readers repeat lines even though the text is perfectly legible.'),
          q('A developer adds margin-top: 13px to fix one alignment. Why does that matter more than it looks?', [
            'Odd numbers render on half pixels on high density screens',
            'It will be overwritten by the next component library update',
            '13px is too small a difference for any user to notice',
            'Off scale values make spacing differences stop carrying meaning',
          ], 3, 'The scale works because a bigger gap reliably signals a bigger separation, and once arbitrary values leak in the reader can no longer read grouping from spacing.'),
        ]
      ),
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
        `,
        [
          q('Your input borders are #CBD5E1 on white, measuring 1.48:1. Is that acceptable?', [
            'Yes, borders are decorative and exempt from contrast rules',
            'Yes, as long as the label and helper text pass 4.5:1',
            'No, interface components need 3:1 against their background',
            'No, every visible element must reach 4.5:1 like body text',
          ], 2, 'A form border is a user interface component, so WCAG asks for 3:1, and the fashionable near invisible outline is a failure rather than a style.'),
          q('Rose #E11D48 passes at 4.70:1 on white. On your dark background #0F172A it measures 3.80:1. What is the fix?', [
            'Lighten the brand colour for dark mode, for example to #FB7185',
            'Nothing, because contrast ratios invert along with the theme',
            'Darken the dark background until the brand colour passes',
            'Keep it and enlarge the text to claim the large text rule',
          ], 0, 'Contrast has to be recomputed for every pair, and a mid tone that clears 4.5:1 on white usually needs lightening to clear it on a dark ground.'),
          q('Your brand rose is used for the header, all links, both buttons and every card border. What is the effect?', [
            'A strong, memorable brand presence right across the interface',
            'Nothing is emphasised, because the accent no longer marks anything',
            'Better accessibility, since only one colour needs checking',
            'Faster scanning, as users learn to look for rose elements',
          ], 1, 'An accent works by scarcity, so keeping it near 10 percent of the surface over a neutral base is what lets a rose button read as the one thing to press.'),
        ]
      ),
            lesson('Depth: Shadows, Borders, and Elevation', 13, `
Take any card that looks cheap and inspect its shadow. It is almost always one layer: a wide soft blur at 30 or 40 percent black sitting under the box. Real objects never cast a single shadow, and that is why the card reads as a sticker pasted onto the page instead of a surface lifted off it.

### Two layers, because there are two lights

A room has a key light that throws a directional shadow, and ambient bounce that darkens the ground immediately under an object. Copy both:

\`\`\`css
:root {
  /* resting: a card in a grid */
  --shadow-1: 0 1px 2px rgba(15, 23, 42, 0.06),
              0 1px 3px rgba(15, 23, 42, 0.10);
  /* raised: dropdown, popover */
  --shadow-2: 0 2px 4px rgba(15, 23, 42, 0.06),
              0 4px 8px rgba(15, 23, 42, 0.10);
  /* floating: modal, sheet */
  --shadow-3: 0 4px 8px rgba(15, 23, 42, 0.06),
              0 12px 24px rgba(15, 23, 42, 0.12);
}
\`\`\`

Three details carry it. The tight layer stays close and slightly darker, the wide layer spreads and stays faint, and the vertical offset grows with the blur so light always arrives from above. More offset than blur reads as a hard drop shadow from 2004. Zero offset reads as a glow.

Now look at the colour. Those are not \`rgba(0, 0, 0, ...)\`, they are slate-900 at low alpha. Pure black shadows turn grey and dead over any tinted surface because they desaturate what sits under them. Tint the shadow with the darkest neutral in your palette and it belongs to the same world as the rest of the screen.

### An elevation scale is hierarchy, not decoration

| Level | Shadow | What lives here |
|---|---|---|
| 0 | none, hairline border | Page background, table rows, flat list items |
| 1 | --shadow-1 | Cards and resting surfaces |
| 2 | --shadow-2 | Dropdowns, menus, headers that stick on scroll |
| 3 | --shadow-3 | Modals and sheets, anything with a scrim behind it |

Four levels covers almost every product. Two rules keep it legible: nothing overlaps something at its own level, and hover raises an element by exactly one step. A card that jumps from level 1 to level 3 on hover feels like it snapped rather than lifted.

### Dark mode breaks shadows completely

A black shadow on a near black background is invisible. Port a light theme across untouched and every card fuses into the page. The fix is to stop encoding height with shadow and encode it with **surface lightness**, so higher elevation means a lighter surface:

\`\`\`css
:root[data-theme="dark"] {
  --surface-0: #0F172A;  /* page */
  --surface-1: #1E293B;  /* card */
  --surface-2: #273449;  /* menu */
  --surface-3: #334155;  /* modal */
}
\`\`\`

Keep a faint shadow if you like it, but the lightness step is the part people actually see.

### Borders are what separate

A shadow at 10 percent alpha carries roughly 1.2:1 of contrast. On a dim phone in daylight it is simply not there. So apply this test: if deleting the shadow would leave two regions indistinguishable, that boundary needs a hairline border reaching 3:1 against both sides, like any other interface component. Shadow is a hint about height. Border is the guarantee that an edge exists.

### The cost that only shows up at scale

Animating \`box-shadow\` forces a repaint every frame, and a grid of 40 cards with a shadow transition drops frames on a mid range phone. Put the raised shadow on a pseudo element and animate its \`opacity\` instead. Identical result, and the compositor does the work rather than the paint stage.

The bigger mistake is quieter: giving everything a shadow. When every card, input, tab and badge floats, none of them do, and depth stops carrying any information at all. Spend elevation on the few things that genuinely sit above the page, and let the rest lie flat.
      `,
        [
          q('A card uses a black shadow at 12 percent alpha. In dark mode the same card vanishes into the page. What is the fix?', [
            'Raise the shadow opacity until the card separates again',
            'Put a white glow behind the card instead of a shadow',
            'Encode elevation with a lighter surface colour at each level',
            'Increase the blur radius so the shadow spreads further out',
          ], 2, 'A dark shadow on a dark ground carries almost no contrast, so height in a dark theme has to be read from surface lightness rather than from shadow.'),
          q('Why is a single 24px blur at 35 percent black a worse card shadow than two stacked layers?', [
            'It repaints more slowly because of the larger blur radius',
            'It is uniformly soft, so the card reads as pasted on rather than lifted',
            'It fails the 3:1 contrast requirement for interface components',
            'It cannot be expressed as a single design token',
          ], 1, 'Real objects cast a tight contact shadow plus a wide ambient one, so reproducing only the wide layer removes the contact cue that makes an edge look raised.'),
          q('A dashboard gives every card, input, tab and badge the same shadow. What does that cost?', [
            'Depth stops carrying information, since nothing sits above anything',
            'Page load slows down, because shadows are expensive to paint',
            'The shadows start failing contrast checks where they stack',
            'Nothing, as long as one elevation token is used everywhere',
          ], 0, 'Elevation is a comparison between surfaces, so when everything floats at the same height the reader gets no ranking and the shadows become texture.'),
        ]
      ),
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
        `,
        [
          q('Which token name passes the test that changing its value must not turn the name into a lie?', [
            '--red-alert',
            '--color-danger',
            '--margin-20',
            '--sidebar-grey',
          ], 1, 'A role based name survives a value change, so shifting danger from red to orange breaks --red-alert while leaving --color-danger accurate.'),
          q('What does a documentation line saying "do not use a Banner for field validation" actually buy you?', [
            'A disclaimer that helps during accessibility audits',
            'A record of which team currently owns the component',
            'A boundary that stops the component spreading into other jobs',
            'A shortcut for developers implementing the markup',
          ], 2, 'Saying when not to use a component prevents it drifting into work another component already does, which is where most inconsistency in a system starts.'),
          q('A team designs 60 components before the product has any real screens. What usually results?', [
            'Polished components nobody needs, and gaps where the real work is',
            'A faster build, since developers can start immediately',
            'A consistent product, because every case was covered up front',
            'A smaller library, since duplication was prevented early',
          ], 0, 'A system extracted from real screens fits the product, while one invented in advance guesses at needs and misses the patterns that only appear on the third card.'),
        ]
      ),
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
        `,
        [
          q('A row holds an avatar, a title that should take the remaining width, and a fixed badge. What resizing does the title need?', [
            'Hug contents, so the frame shrinks to the text',
            'Fixed width, matching the longest title you expect',
            'Fill container, so it takes whatever space the others leave',
            'Hug contents plus a maximum width constraint',
          ], 2, 'Fill container maps to flex: 1, so the title absorbs the space the avatar and badge do not use and the row survives a long or translated string.'),
          q('Why name a component Form/Input/Text on the day you build it rather than later?', [
            'Slashes make Figma render nested layers faster',
            'Slashes build the insert menu, and a late rename moves every instance',
            'Figma requires unique names before variant properties will work',
            'It lets developers import the component name directly',
          ], 1, 'Figma turns slashes into menu folders, so renaming later reshuffles where each component appears and nobody goes back to fix forty of them.'),
          q('A designer overrides a button\'s fill on one instance instead of adding a variant. What quietly breaks?', [
            'The instance loses its auto layout settings',
            'The component\'s variant list becomes unreadable',
            'Theming, because the override outranks the bound variable',
            'Nothing, since overriding is what instances are for',
          ], 2, 'An override wins over the variable it replaced, so when the token or theme changes that instance keeps the old colour while still looking correct.'),
        ]
      ),
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
        `,
        [
          q('Your prototype has ten screens that differ only by which tab is selected. What should replace them?', [
            'One screen using Change to, swapping the tab component variant',
            'An overlay per tab, opened over a single base screen',
            'One screen with After delay triggers cycling through the tabs',
            'Ten components, each wired together with Navigate to',
          ], 0, 'Change to swaps a component variant in place, so the tabs behave correctly and a later header edit is made once instead of ten times.'),
          q('A modal slides in over 600ms. Why is that wrong even though it looks smooth in the first demo?', [
            'Smart Animate cannot interpolate beyond 500ms',
            'Users see the transition repeatedly and it starts to feel sluggish',
            'Long transitions break the prototype\'s overlay stacking',
            'Ease in out is only defined for durations up to 400ms',
          ], 1, 'A transition is watched once by a stakeholder and hundreds of times by a user, so anything past roughly 400ms stops reading as elegant and starts reading as waiting.'),
          q('Why build the loading state with an After delay of 800ms instead of jumping straight to the loaded screen?', [
            'Figma needs a delay between two frames that share layer names',
            'It makes the prototype feel more polished during reviews',
            'Instant transitions hide whether the loading state communicates anything',
            'It gives Smart Animate time to match the layer names correctly',
          ], 2, 'If the wait never happens in the prototype, the session cannot reveal that your skeleton or spinner leaves people unsure whether the app is working.'),
        ]
      ),
            lesson('File Structure, Branching, and Version History', 13, `
A designer opens the shared library at 9am on review day and the primary button has 4px corners instead of 8. Somebody was experimenting at 1am, in the main file, on the published component. Nothing was malicious, and nothing was easy to undo, because the version history reads "Auto saved 01:14" forty times in a row.

File hygiene is not admin work. It is the difference between a library a team trusts and one they quietly copy out of.

### Pages, numbered so they sort themselves

Figma orders pages however you last dragged them, which survives until the first busy week. Prefix them instead:

\`\`\`text
00 Cover
01 Research and flows
02 Explorations
03 Ready for build
04 Shipped
99 Archive
\`\`\`

The cover page holds one frame, and that frame becomes the file thumbnail in the project view. Put the file name, the owner, the current status and the date on it. A project full of identical grey thumbnails costs everyone the same five seconds, several times a day, forever.

Explorations live on their own page, never scattered beside the real screens. One rule keeps the file honest: anything on **03 Ready for build** is what the team believes today, and everything it replaced moves to 99 rather than sitting next to it half greyed out.

### Split the library from the products

One file holds the system: tokens, components and their documentation. Product files consume it and define no components of their own. When the library publishes, consumers see what changed and choose when to accept it, so a live redesign never lands in someone's review mid sentence.

If a component only makes sense in one product, it stays in that product file. Promoting it to the library later takes ten minutes. Demoting a library component that three teams already use is a negotiation.

### Branches are for changing what other people use

Editing a published component in the main file ships your half finished idea to everyone. A branch gives you a private copy of the whole file:

| Step | What happens |
|---|---|
| Create branch | A linked copy of the file, invisible to consumers |
| Edit and iterate | Publishing from the branch affects nobody |
| Request review | A reviewer sees a visual diff of every changed component |
| Merge | Changes land in main and consumers get one update prompt |

Conflicts resolve per layer, so two people working on different components merge cleanly and two people on the same component do not. Branch for component work. For a brand new screen, a page is enough.

### Name the versions that matter

Autosave entries are noise. At each real checkpoint, open version history and name it: "Nav v2, after round 2 testing", or "Pre handoff freeze". Restoring from a named version takes seconds. Scrolling 200 timestamps hunting for the layout from Tuesday afternoon does not.

Before a risky refactor, duplicate the page rather than trusting restore. Restore reverts the entire file, including the work a colleague did while you were experimenting.

### Why the file takes 40 seconds to open

Weight comes from a short list of predictable sources:

- Screenshots pasted at full resolution, often 4000px wide inside a 320px frame.
- Every exploration ever made, kept in the live file.
- Hundreds of hidden layers inside detached copies nobody deletes.
- Large vector illustrations that were never flattened.

Downscale images before pasting, move dead explorations into an archive file, and check the file size once a month. A slow file is a file people stop opening, and a system nobody opens has already stopped being a system.
      `,
        [
          q('Why name a version in Figma\'s history instead of relying on the autosave entries?', [
            'Autosave stops recording once a file passes a hundred entries',
            'Named versions can be shared with stakeholders as their own link',
            'Only named versions can be restored by editors other than you',
            'Timestamps mean nothing later, so finding Tuesday\'s layout is a hunt',
          ], 3, 'Restoring is only quick if you can recognise the moment you want, and a wall of automatic timestamps gives you nothing to recognise it by.'),
          q('You need to change the padding on a published Button that three product files consume. Where do you do the work?', [
            'In a branch of the library file, merged after a review',
            'In the library file directly, publishing once it is finished',
            'In each product file, so every team can opt out individually',
            'In a duplicate of the library, republished as a second library',
          ], 0, 'A branch keeps the change invisible to consumers until it is reviewed and merged, so nobody receives a half finished component in the middle of their day.'),
          q('A shared design file now takes 40 seconds to open. Which cause is most likely?', [
            'Too many components published from a single library file',
            'Full resolution screenshots and years of explorations kept inside it',
            'Variant properties applied across too many placed instances',
            'Version history holding too many named checkpoints',
          ], 1, 'File weight comes mostly from large raster images and abandoned exploration pages rather than from component counts or history entries.'),
        ]
      ),
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
        `,
        [
          q('Halfway through a task a participant asks you, is this the right button? What should you do?', [
            'Confirm it, then note the hesitation in the findings',
            'End the task and record it as completed with help',
            'Ask what they think, because answering buys a task and costs the finding',
            'Tell them yes so the session can reach the next task',
          ], 2, 'Every hint you give purchases a successful task at the price of the problem you came to find, so the facilitator redirects the question instead of answering it.'),
          q('Why is the Single Ease Question a better measure than asking, was that easy?', [
            'It is a graded scale asked at the moment of difficulty, so politeness biases it less',
            'It produces a yes or no answer that is simpler to chart across rounds',
            'It removes the need to measure task success and time on task separately',
            'It is asked at the end of the session, when the participant has calmed down',
          ], 0, 'A graded rating captured immediately after the task records the friction while it is still fresh, whereas a yes or no question invites a polite yes to the person who built the thing.'),
          q('Four of five participants hit one problem, and a fifth hit a different problem alone. What does that count tell you?', [
            'Both are severity 4, because each one blocked a task',
            'The four-person problem is systemic, while the single hit may be that person',
            'Neither can be judged without a sample of at least fifteen',
            'The single hit is the more urgent one because it was unexpected',
          ], 1, 'Frequency across participants separates a design flaw everyone meets from an individual quirk, which is why the count matters as much as the severity label.'),
        ]
      ),
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
        `,
        [
          q('A team swaps a native button for a div with role of button so they do not have to reset browser styles. What breaks?', [
            'It is announced as a button but is not focusable and does not fire on Enter or Space',
            'It becomes focusable but screen readers announce it as ordinary text',
            'It behaves correctly but can no longer meet the contrast requirement',
            'It cannot be given a visible focus ring in any current browser',
          ], 0, 'The role attribute supplies the announcement only, so focusability, keyboard activation and disabled handling all have to be rebuilt by hand and are usually forgotten.'),
          q('A field sits first in the visual layout but is written last in the markup. What is the consequence for a keyboard user?', [
            'Screen readers skip the field because its position is ambiguous',
            'The field can no longer be given an accessible name',
            'Tab reaches it last, because tab order follows the DOM and not the layout',
            'The browser reorders the DOM to match the visual arrangement',
          ], 2, 'Tab order is driven by document order, so a visually repositioned field is reached out of sequence and traps people in a confusing loop.'),
          q('A close control contains nothing but an X glyph. What does it need to be usable?', [
            'An empty alt attribute so that screen readers skip past it',
            'A role of button, which supplies the accessible name for it',
            'A title attribute containing the single word Close',
            'An aria-label of Close, because the bare glyph announces nothing useful',
          ], 3, 'An icon-only control has no text to become its accessible name, so it needs an explicit label that says what activating it will do.'),
        ]
      ),
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
        `,
        [
          q('A reviewer opens a critique with, I do not like the pink. What has gone wrong with the session?', [
            'The reviewer should have opened with a suggested alternative colour',
            'The goal and constraints were never restated, so the comment cannot be answered',
            'Colour should not be discussed until the visual design stage',
            'The describe pass should be skipped once work is nearly final',
          ], 1, 'Without a stated goal there is nothing to measure the pink against, so preference wins; restating the goal converts the comment into a question that has an answer.'),
          q('Why does a handoff spec name a token such as --space-5 rather than the value 24px?', [
            'Pixel values are rounded differently by each browser engine',
            'Developers are unable to measure spacing from a design file',
            'Token names compress better when the design file is exported',
            'Token names travel into the code, while measurements get re-typed and drift',
          ], 3, 'A name is a reference that both files share, so the value stays in one place instead of being copied out by hand and diverging on the next change.'),
          q('After a redesign ships, a System Usability Scale run comes back at 74. What is missing before calling it a win?', [
            'The baseline score from before the change, measured with the same wording',
            'A larger sample, because the scale needs at least fifty responses',
            'A task success rate, which supersedes the scale entirely',
            'A second run a year later to confirm that the score holds',
          ], 0, 'A single score is uninterpretable on its own; only the comparison with the pre-change baseline shows whether the design moved anything.'),
        ]
      ),
            lesson('Finding Five Participants Who Are Actually Your Users', 13, `
Five people surface most of the problems, but only if the five are the right five. Run the test on colleagues and you will discover that colleagues know exactly where the buttons are, because they watched you draw them.

That failure is silent. The sessions run, the tasks succeed, the write-up says the flow works, and the drop-off in the funnel does not move a point. Recruitment is the step that decides whether a usability test measures your design or measures your address book.

### A screener people cannot game

A screener is the short survey that decides who gets invited. The mistake is asking the qualifying question directly, because the reader can see which answer earns the incentive.

| Weak screener item | What goes wrong | Rewrite |
|---|---|---|
| Do you take online courses weekly? | Broadcasts the answer worth giving | Which of these did you do in the past 7 days? Eight options, one of them a lesson |
| Are you comfortable with technology? | Everyone says yes | Which of these have you set up yourself? Router, password manager, neither |
| Are you a designer? | Only works if they answer against their own interest | What is your job title, in your own words |

Ask the same thing twice in different shapes and drop anyone whose answers disagree. Add one hard disqualifier: people who work in design, front-end development or market research know too much, and they critique instead of use.

### Recruit in this order

1. **Your own users.** Highest fidelity and nearly free, and you can segment on behaviour your database already knows. Everyone who opened the enrolment form and abandoned it in the last 14 days is a query, not a guess.
2. **A panel.** Fast and expensive, roughly 60 to 150 dollars a head for a general consumer and several times that for a niche professional. Panels are full of practised testers, and the screener is the only thing keeping them out.
3. **Your own network, last.** Friends of friends turn up, are pleasant, and will not tell you the thing you need to hear.

### Over-recruit, because people do not turn up

Plan for 20 to 30 percent no-shows on remote sessions. Six confirmed bookings gets you five completed ones. A reminder the day before and again 30 minutes before roughly halves the rate, and one paid standby costs less than a round that yields four sessions.

### Moderated or unmoderated

| | Moderated | Unmoderated |
|---|---|---|
| Best for | Why something failed | Whether it fails, and how often |
| Sample | 5 to 8 | 15 to 50 |
| Turnaround | Days | Hours |
| Cost per participant | High, your time included | Low |
| Main risk | You talk too much | Bad task wording, with nobody there to notice |

Unmoderated tools hand you a screen recording and a think-aloud track with no facilitator. They are excellent once the task is watertight and dangerous before that, because a confusing instruction produces 30 confused recordings instead of one you could have reworded on the spot. Pilot every unmoderated study on a single person first. That one habit has rescued more studies than any other on this page.

### Consent, payment, and the boring paperwork

State the incentive up front and pay it even when the screen share dies and the session collapses. Get recording permission explicitly, and name who sees the footage: "the product team, deleted after 90 days" is a sentence people accept. Say plainly that you are testing the interface and not them, because a participant who feels judged stops narrating and starts performing.

\`\`\`text
Recruiting checklist, one round of five
[ ] Screener uses behaviour questions, plus one disqualifier
[ ] 6 booked for 5 slots, plus 1 paid standby
[ ] Consent and recording permission collected before the call
[ ] Incentive stated in the invite, paid within 48 hours
[ ] Pilot session run, tasks reworded
\`\`\`

The habit that separates a useful round from a decorative one: recruit for the behaviour you are designing for, never for the demographic you imagined.
      `,
        [
          q('Why does a screener ask which of eight activities you did in the past 7 days instead of asking directly whether you study online weekly?', [
            'It takes the participant noticeably less time to complete',
            'It records a date the analyst can later filter sessions by',
            'It avoids putting a legally sensitive question into a survey',
            'The direct version shows the reader which answer earns the incentive',
          ], 3, 'A question that reveals the qualifying answer selects for people who want the payment rather than for people who have the behaviour you are designing for.'),
          q('You need five completed sessions for a moderated round. How many people should you book?', [
            'Exactly five, and reschedule anyone who fails to appear',
            'Six, plus a paid standby, because 20 to 30 percent do not turn up',
            'Ten, so the weaker half of the sessions can be discarded later',
            'Five, with the incentive withheld until they actually attend',
          ], 1, 'Remote no-show rates run around a quarter, so booking to the exact number you need reliably delivers four sessions instead of five.'),
          q('When is an unmoderated study the wrong instrument to reach for?', [
            'When the finding requires at least fifteen separate participants',
            'When the sessions have to be delivered inside a single day',
            'When the task wording is untested, since nobody is there to correct it',
            'When the participants are recruited from your own user base',
          ], 2, 'A facilitator can rescue a misread instruction on the spot, so without one a badly worded task multiplies into dozens of unusable recordings.'),
        ]
      ),
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
        `,
        [
          q('A stylesheet carries eleven breakpoints, each named after a phone or tablet model. What does that most likely indicate?', [
            'The product supports a wider range of devices than usual',
            'Breakpoints were added to patch symptoms rather than taken from where content breaks',
            'The type scale is fluid instead of stepping at fixed sizes',
            'Container queries have been applied to the wrong elements',
          ], 1, 'Breakpoints should come from the width at which the content itself stops working, and a long device-named list is the signature of fixing bugs one screen at a time.'),
          q('A team hides the price on screens narrower than 560px to save vertical space. Why is that the wrong call?', [
            'Hidden elements are still downloaded, so no bytes are saved',
            'Mobile browsers ignore display none inside grid containers',
            'Mobile users are the same people in a worse posture, and still need the price',
            'The price would be better placed inside a hover tooltip instead',
          ], 2, 'Narrow screens change posture and attention, not intent, so removing content decides on the user behalf that they came for less than they did.'),
          q('You drag the desktop browser down to 375px and the layout looks correct. What has that check not told you?', [
            'Whether the grid collapses to one column at the right width',
            'Whether the type scale steps down between the breakpoints',
            'Whether the gaps still match the values in the spacing scale',
            'How it behaves at 200 percent text, one-handed, on a slow connection',
          ], 3, 'Emulation reproduces width and nothing else, so it hides the text-size setting, the thumb, the glare and the network that a real device exposes.'),
        ]
      ),
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
        `,
        [
          q('Nine links on a page all read Learn more. Why is that specifically a screen reader problem?', [
            'Screen readers announce only the first link when a label repeats',
            'A common navigation mode lists every link alone, giving nine identical dead ends',
            'Screen readers cannot follow links whose text is under three words',
            'Repeated link text triggers an automated colour contrast failure',
          ], 1, 'Listing links out of context is a standard way to scan a page, and identical labels strip away the only information that list carries.'),
          q('A payment fails and the interface shows, Oops, something went wrong. What is the problem beyond the tone?', [
            'It names neither what failed nor what the user should do next',
            'It should appear as a toast notification rather than inline',
            'It should include the internal status code so support can trace it',
            'It uses sentence case where title case would be expected',
          ], 0, 'An error message has three jobs, saying what happened, why, and what to do next, and a generic apology delivers none of them.'),
          q('An empty enrolments screen shows a large illustration and the heading, Nothing here yet. What is missing?', [
            'A second call to action so the user is offered a choice',
            'A progress indicator showing how much of the catalogue is unseen',
            'One line saying what appears here, plus one action such as browsing courses',
            'A lighter grey treatment so the screen does not feel so heavy',
          ], 2, 'An empty state has exactly three parts, and without the explanatory line and the single action it tells a new user nothing about what to do.'),
        ]
      ),
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
        `,
        [
          q('What does setting the correct autocomplete token on a field actually buy you?', [
            'It validates the format of the entry before the form is submitted',
            'It stops the browser from caching the value between visits',
            'It encrypts the value on its way to the server',
            'The browser fills the field, and the password manager offers to save it',
          ], 3, 'Autocomplete tokens are what let the browser and the password manager recognise a field, so a wrong token silently costs autofill and saved credentials.'),
          q('A card payment form blocks pasting in order to prevent typing errors. Who does that hurt most?', [
            'Password manager users, who hold the strongest credentials',
            'Users on slow connections, who retry submissions frequently',
            'Screen reader users, who cannot reach the field by keyboard',
            'Desktop users, whose field is wider than they actually need',
          ], 0, 'Blocking paste breaks the exact workflow of people using generated credentials, pushing them towards weaker passwords they can type by hand.'),
          q('Eight of the nine fields on a form are required. How should required and optional be marked?', [
            'Group all required fields into their own section at the top',
            'Mark every required field with a red asterisk and add a legend',
            'Leave required fields unmarked and label the single exception as optional',
            'Split the form so each required field sits on a step of its own',
          ], 2, 'Marking the rarer case puts one plain word in the label where it is read, instead of scattering symbols across almost every field.'),
        ]
      ),
            lesson('Images That Fit Every Screen Without Wrecking the Layout', 13, `
You tap **Enrol** and land on **Report a problem**. Nothing was broken. The hero image finished decoding half a second late, claimed 240 pixels of height it had never reserved, and shoved the page down under your thumb. That is Cumulative Layout Shift, and images cause most of it.

### Reserve the space before the pixels arrive

A browser can only hold a slot open if it knows the shape in advance. Give it the intrinsic dimensions and let CSS handle the resizing.

\`\`\`html
<!-- Broken: no dimensions, so the layout reflows when the file lands -->
<img src="/covers/ui-ux.webp" alt="UI/UX Design Bootcamp cover" />

<!-- Fixed: the ratio is known immediately, the slot is held -->
<img src="/covers/ui-ux.webp" alt="UI/UX Design Bootcamp cover"
     width="1200" height="675" />
\`\`\`

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

Those two attributes are not a size, they are a ratio. The browser reads 1200 by 675 as 16:9, reserves a box of the right height at whatever width the column offers, and paints into it later. Leave out \`height: auto\` and the image locks to a literal 675px tall, which is the bug almost everyone hits the first time they try this.

### Stop sending a 1600px file to a 360px slot

A lone \`src\` means every device downloads the largest version you own. On a 360px phone that is roughly four times the bytes for nothing visible.

\`\`\`html
<img src="/covers/ui-ux-800.webp"
     srcset="/covers/ui-ux-400.webp 400w,
             /covers/ui-ux-800.webp 800w,
             /covers/ui-ux-1600.webp 1600w"
     sizes="(min-width: 60rem) 33vw, 100vw"
     width="1200" height="675" alt="UI/UX Design Bootcamp cover" />
\`\`\`

\`sizes\` is the attribute everyone forgets, and forgetting it is worse than doing nothing: with no \`sizes\`, the browser assumes the image fills the viewport, picks the biggest candidate, and you have added three files and a maintenance burden while downloading exactly what you were trying to avoid. \`sizes\` describes the layout slot, so it has to be updated whenever the grid around it changes.

| Approach | Bytes on a 360px phone | Note |
|---|---|---|
| One 1600px JPEG | 340 KB | The default nobody revisits |
| One 1600px WebP | 190 KB | Format alone, roughly half |
| srcset with correct sizes | 34 KB | Serves the 400w candidate |

### Crop for the screen, do not just shrink for it

Scaling a 16:9 hero down to 360px makes the subject unreadably small. A different crop for a different shape is a design decision, not a build detail:

\`\`\`html
<picture>
  <source media="(min-width: 48rem)" srcset="/hero-wide.avif" type="image/avif" />
  <source media="(min-width: 48rem)" srcset="/hero-wide.webp" />
  <img src="/hero-square.webp" width="800" height="800" alt="Students in a workshop" />
</picture>
\`\`\`

Where two crops are not affordable, \`object-fit: cover\` with \`object-position\` at least lets you choose which part survives. The default centres the crop, which is how faces end up decapitated on narrow screens.

### The lazy-loading trap

\`loading="lazy"\` is a genuine win below the fold and a self-inflicted wound above it. Lazy-loading the hero delays the exact element the browser measures as Largest Contentful Paint, because the request now waits for layout instead of starting during the initial scan of the markup.

| Position | loading | fetchpriority |
|---|---|---|
| Hero, above the fold | eager (the default) | high |
| Cards visible on load | eager | auto |
| Anything further down | lazy | auto |

Two closing rules. Decorative flourishes belong in CSS, where they never block anything and never get announced. Anything carrying meaning stays an \`img\` with real alt text, sized, listed in \`srcset\`, and cropped deliberately for the narrowest screen you support.
      `,
        [
          q('An img element carries width and height attributes, but the CSS never sets height to auto. What happens?', [
            'The image locks to a literal 675px tall and the reserved-ratio benefit is lost',
            'The browser ignores both attributes and reflows the layout anyway',
            'The file is downloaded twice, once purely for measurement',
            'The srcset candidates get evaluated against the wrong slot width',
          ], 0, 'The attributes give the browser a ratio to reserve space with, but without height auto the CSS pins the rendered height to the raw number instead.'),
          q('A team adds a srcset with three candidates but leaves out the sizes attribute. What is the result?', [
            'The browser picks the smallest candidate and the image looks soft',
            'The srcset is ignored completely and the plain src is used',
            'The browser alternates between candidates on each page load',
            'The browser assumes the image fills the viewport and picks the largest file',
          ], 3, 'With no sizes, the default assumption is 100vw, so a phone requests the widest candidate and the whole optimisation is undone.'),
          q('Why should the hero image at the top of a page not carry loading equals lazy?', [
            'Lazy loading is unsupported for images that sit above the fold',
            'It delays the very element measured as Largest Contentful Paint',
            'Lazy images cannot be given width and height attributes',
            'It makes the browser skip the srcset candidate list entirely',
          ], 1, 'A lazy request waits for layout instead of starting during the initial markup scan, which pushes back the paint the metric is timing.'),
        ]
      ),
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
        `,
        [
          q('Why screenshot the running build and lay it over the design frame at 50 percent opacity?', [
            'It exports a higher resolution image to attach to the ticket',
            'It converts the measured pixel values into token names automatically',
            'A systematic offset across the whole layout becomes visible at a glance',
            'It confirms the colours match without needing a contrast checker',
          ], 2, 'Overlaying turns a vague feeling that something is off into a visible, measurable displacement that nobody can argue about.'),
          q('The console tally prints 41 distinct font sizes, including 13px, 15px and 22px. What has that established?', [
            'That the type scale is not being used, as a measurement rather than an opinion',
            'That the CSS bundle is larger than it strictly needs to be',
            'That the page fails the WCAG requirement on text sizing',
            'That the browser is rounding rem values inconsistently',
          ], 0, 'Counting rendered values replaces the argument about whether things are basically consistent with a number that settles it.'),
          q('A design QA pass turns up a component state that was never drawn. Where does the fix belong?', [
            'In the ticket alone, since the developer improvised it',
            'In the backlog, to be revisited once the release has shipped',
            'In a new component, so the original one stays untouched',
            'In the design file as well, so the next feature inherits the answer',
          ], 3, 'An unspecified state is a gap in the source of truth, so fixing only the build guarantees the next team improvises it again.'),
        ]
      ),
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
        `,
        [
          q('What is a guardrail metric for, given that the experiment already has a primary metric?', [
            'It substitutes for the primary metric if that one stays flat',
            'It gives you a reason to reject a win, such as a rising refund rate',
            'It reduces the sample size needed to reach significance',
            'It measures how long the effect persists after the test ends',
          ], 1, 'A guardrail is declared in advance so that a lift bought at the cost of something worse, like refunds or complaints, does not get shipped as a success.'),
          q('A lift shows up in week one, sits entirely with returning users, and decays by week two. What is the likely explanation?', [
            'A sample ratio mismatch inside the assignment logic',
            'The primary metric was measured too far downstream',
            'Novelty, because regulars react to any change and then stop',
            'The experiment was underpowered for the effect size',
          ], 2, 'A short-lived effect concentrated in existing users is the signature of reaction to change rather than a durable improvement.'),
          q('You test a button colour and measure revenue three screens later. The result is flat. What is the most likely reason?', [
            'The change was too small to move a metric that far downstream',
            'Colour has no measurable effect on any user behaviour',
            'The test needed a third arm before it could be interpreted',
            'Revenue is never a valid primary metric for an experiment',
          ], 0, 'The further a metric sits from the change, the more other factors dilute it, so a tiny edit disappears into the noise before it reaches revenue.'),
        ]
      ),
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
        `,
        [
          q('A designer proposes a new library component after using the pattern once, on one screen. What does the contribution model say?', [
            'Ship it as a minor version and review its adoption later',
            'Add it now, because a new pattern is evidence of a gap',
            'Compose it from existing parts, which is always possible',
            'Hold it back until it has shipped twice and two teams need it',
          ], 3, 'Requiring a pattern to prove itself in real screens before it enters the library is what keeps the system small enough to stay learnable.'),
          q('Which of these pieces of design debt should be fixed first?', [
            'A contrast failure in the body text of the sign-up form',
            'A 2px corner radius difference on an internal admin page',
            'A shadow value typed by hand instead of taken from a token',
            'A button component carrying two variants that nobody uses',
          ], 0, 'Accessibility failures are both a legal and a human problem and sit at the top of the priority order, above tidiness on low-traffic screens.'),
          q('A system team ships six new components in a quarter and none of them get adopted. What is the diagnosis?', [
            'The components need better documentation screenshots',
            'The backlog came from the system team rather than from real product screens',
            'The versioning scheme has confused the product teams',
            'The components should have been released as a major version',
          ], 1, 'A design system is a product whose customers are product teams, so a backlog that ignores their live screens produces components nobody asked for.'),
        ]
      ),
            lesson('Rolling Out a Redesign Without a Revolt', 13, `
A team ships a redesign to everyone on a Monday morning. By Tuesday, support tickets are up six times and the loudest customer has written a thread. On Thursday, leadership rolls it back. The uncomfortable part: enrolment completion had risen 4 points and stayed there. Nobody had agreed in advance what bad looked like, so the noisiest signal won.

### Change aversion is not a regression

Existing users are fluent in the old layout. Move anything and they get slower, feel worse, and complain, even when the new version is measurably better for someone arriving fresh. That dip is real, and it is temporary, usually one to three weeks depending on how often people visit.

The trap is that a genuine regression looks identical on day one. Two things separate them:

| Signal | Change aversion | Real regression |
|---|---|---|
| New-user cohort | Unaffected or better | Also worse |
| Trend over two weeks | Climbs back towards baseline | Flat or falling further |
| What the complaints say | "Where did X go" | "I cannot do X at all" |
| Task success in a moderated test | Fine | Fails |

Segment by cohort before you interpret anything. New users happy and returning users unhappy means wait. Both unhappy means roll back.

### Ship in stages, and decide the exits first

\`\`\`text
Stage 0   Internal only, all staff       1 day    smoke test, obvious breakage
Stage 1   1% of traffic                  2 days   error rate, p95 latency
Stage 2   5%                             3 days   funnel completion, support volume
Stage 3   25%                            1 week   cohort split, in-product searches
Stage 4   50%                            1 week   the real read on the primary metric
Stage 5   100% with an opt-out link      2 weeks  opt-out rate is the honest vote
\`\`\`

Write the exit thresholds into the plan before stage 0, as numbers:

\`\`\`text
ROLL BACK IMMEDIATELY IF
  error rate            > 0.5%           at any stage
  enrolment completion  < 22%            (baseline 25%, tolerance 3 points)
  support tickets/day   > 2x baseline    measured after 48 hours, not on day one
HOLD AND INVESTIGATE IF
  opt-out rate          > 5% of exposed users
  new-user cohort       worse than baseline on the primary metric
\`\`\`

Numbers agreed while everyone is calm turn a Thursday panic into a decision anyone in the room can check for themselves.

### The opt-out link is a measurement, not a kindness

Give people a way back for a limited window, then watch the rate. Under 2 percent is a healthy transition. Above 10 percent, something concrete is broken and the angry thread is right. Read the free-text box people fill in on the way out, because that is the cheapest research you will get all quarter.

Set the removal date the day you ship the link. A toggle with no end date forks the product into two designs forever, and every feature after that costs twice as much to build, test, and support.

### Tell people what moved

| Weak notice | Better |
|---|---|
| "We have refreshed the experience" | "Your certificates now live under Profile, not Courses" |
| A modal that blocks the screen on load | A dismissible bar, plus one coach mark on the thing that moved |
| Announced only in a blog post | Announced in the product, where the confused user actually is |

Then watch in-product search queries for the following week. A spike in searches for a feature name is a map of everything you moved without saying so, and it arrives before the first ticket is filed.

### The mistake

Rolling back on volume rather than evidence. Ten furious messages feel like the entire user base and are perfectly compatible with 99 percent of people never noticing. Count how many, out of how many were exposed, against the thresholds you wrote down before you launched.
      `,
        [
          q('Returning users complain and their task times rise, while the new-user cohort performs slightly better than baseline. What does that pattern indicate?', [
            'A genuine regression, since any rise in task time is a failure',
            'Change aversion, which should climb back towards baseline within weeks',
            'A sample ratio mismatch between the two cohorts',
            'A measurement error, since both cohorts ought to behave alike',
          ], 1, 'People fluent in the old layout slow down after any move, so a dip confined to returning users and absent in fresh ones is familiarity, not damage.'),
          q('Why should the rollback thresholds be written as numbers before stage 0 rather than agreed when trouble appears?', [
            'It cuts down the number of stages the rollout must pass through',
            'It removes the need to segment the audience into cohorts',
            'It lets the primary metric be chosen once the data has arrived',
            'It turns a panicked Thursday into a decision anyone can check',
          ], 3, 'Thresholds fixed while everyone is calm give the team an agreed test to apply, instead of letting the loudest voice define what counts as bad.'),
          q('Two weeks after full rollout, 12 percent of exposed users have taken the opt-out link. What does that tell you?', [
            'The transition is healthy and the link can now be removed',
            'The rollout moved too slowly through the earlier percentage stages',
            'Something concrete is broken, so investigate before defending the design',
            'The notice copy was too prominent and talked people into leaving',
          ], 2, 'A healthy transition sits under a couple of percent, so a double-digit rate is users voting with an action rather than expressing a preference.'),
        ]
      ),
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
      chapter(
      'Time as a Material: Motion, Latency, and Feedback',
      'Designing what happens between a tap and a result, so movement, waiting and feedback read as intentional rather than as something broken.',
      [
      lesson('The Physics of Motion: Easing, Duration, and Distance', 13, `
A dropdown that opens in 400 milliseconds feels broken. The same dropdown at 180 feels instant and faintly expensive. Nothing changed except one number, and that number is doing more work for your product than most of your colour decisions.

### Duration follows distance

There is no correct duration. There is a correct speed, and duration falls out of how far the thing travels. A chevron rotating inside a 24px box and a full screen sheet climbing 800px cannot share a number: give them both 300ms and the chevron looks sticky while the sheet looks right.

| What moves | Travel | Duration |
|---|---|---|
| Chevron rotate, checkbox tick, hover colour | under 40px | 100ms to 150ms |
| Tooltip, dropdown, small popover | 40 to 200px | 150ms to 200ms |
| Side drawer, modal entering | 200 to 600px | 250ms to 300ms |
| Full screen sheet on a phone | 600px and up | 300ms to 400ms |
| Anything at all | any | never past 500ms |

Below roughly 100ms nobody perceives movement, they perceive a jump, so the animation is wasted work. Past 400ms the user has finished the thought that caused the animation and is now waiting for the product to catch up. The usable band is narrow: 100 to 400.

### Easing carries the meaning

Linear motion is the tell of an unfinished build. Nothing physical starts and stops at full speed, so linear reads as mechanical and your eye notices without knowing why.

\`\`\`css
/* entering: fast in, gentle settle. The user asked for this, so deliver it */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* leaving: slow start, accelerate away. Nobody watches an exit */
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);

/* moving between two visible points: symmetric */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* linear: spinners and progress bars only */
\`\`\`

Enter with ease-out so content arrives quickly and lands softly. Exit with ease-in because the user has already moved on, and a slow exit holds them hostage to something they just dismissed. Exits should also be shorter than entrances, roughly 70 percent of them: a drawer that opens in 280ms should close in 200.

### The gotcha that eats your frame budget

At 60fps you get 16.7 milliseconds per frame to do everything. Animating \`width\`, \`height\`, \`top\`, \`left\`, \`margin\` or \`padding\` forces the browser to recompute layout for that element and often its siblings on every single frame. On a mid range Android phone that blows the budget and you get judder, which users read as "this app is slow" rather than "this animation is badly built".

\`\`\`css
/* broken: layout recalculates 60 times a second */
.drawer { left: -320px; transition: left 280ms ease-out; }
.drawer.open { left: 0; }

/* fixed: compositor only, no layout, no paint */
.drawer {
  transform: translateX(-320px);
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer.open { transform: translateX(0); }
\`\`\`

\`transform\` and \`opacity\` are the two cheap properties. Design inside that constraint and your motion survives contact with real devices.

### Springs answer a different question

A spring takes stiffness, damping and mass rather than a duration, and it finishes when the physics finishes. That is why springs feel alive, and why an interruptible spring is the right choice for anything a finger is dragging: a sheet flicked halfway up carries its velocity into the animation instead of restarting from zero. For a discrete state change such as a tooltip appearing, a curve is simpler and cheaper to reason about, and reviewers can check it against a spec.

### Reduced motion is a real setting with real users

Large parallax and sliding transitions make some people genuinely nauseous, and vestibular disorders are more common than most teams assume. The operating system already knows, and it will tell you.

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

Cut the travel, not the feedback. A modal that still fades in over 100ms is fine and still explains itself. A modal that snaps into existence with nothing at all is disorienting for everybody, which is the opposite of what the setting asked for.
      `,
        [
          q('A side drawer is animated with `transition: left 280ms ease-out` and it judders badly on a mid range Android phone. What is causing it?', [
            '280ms is too long for a drawer, so the browser drops frames',
            'The ease-out curve costs more to compute than a linear one',
            'Animating left makes the browser recalculate layout every frame',
            'The drawer travels too far for a single transition to stay smooth',
          ], 2, 'left is a layout property, so the browser recomputes geometry on every frame and blows the 16.7ms budget, whereas transform and opacity are handled by the compositor.'),
          q('A modal enters over 280ms and exits over the same 280ms, and testers describe the close as sluggish. What is the standard fix?', [
            'Shorten the exit to about 70 percent of the entrance and ease it in',
            'Keep both at 280ms and switch the exit to a linear timing curve',
            'Lengthen both so the pair reads as deliberate instead of rushed',
            'Remove the exit movement and hold the same 280ms as a plain fade',
          ], 0, 'The user has already dismissed the modal and moved on, so a matching exit duration holds them hostage to something they stopped caring about; exits should be quicker and use ease-in.'),
          q('Someone has prefers-reduced-motion set to reduce. Which handling of your drawer and modal transitions is correct?', [
            'Strip every transition so all state changes happen with no animation',
            'Keep the sliding motion in place but halve every duration in the app',
            'Honour it on full page moves only and ignore it on smaller elements',
            'Cut the travel but keep a short fade so changes still read as changes',
          ], 3, 'The setting objects to large movement, not to feedback, so removing travel while keeping a brief fade avoids nausea and still tells everyone that something changed.'),
        ]
      ),
      lesson('Choreography: Transitions That Explain What Just Happened', 12, `
Tap a course card in a badly built app and a new screen simply exists. Did you go forward? Sideways? Into a different product? You find out by reading the back button. That half second of reconstruction happens on every navigation, all day, and it is entirely avoidable.

A transition is an argument about what just happened. Win the argument and the user never has to work it out from the text.

### The four questions motion answers

| Question in the user's head | Motion that answers it |
|---|---|
| Where did this come from? | It grows out of the element that was tapped |
| Am I going deeper or coming back? | Forward slides in from the right, back leaves to the right |
| Is this temporary or permanent? | Sheets rise from the bottom, pages replace sideways |
| What did I just change? | The changed row lights up for 600ms and fades |

A cross fade answers none of them. It says "a different thing is here now" and stops talking.

### Continuity: keep the object alive

The strongest transition you can build takes one element and moves it. Tapping the "Design Systems in Figma" card should not destroy a card and create a header. It should grow the card into the header: same thumbnail, same title, ending in the new position.

There is an expensive version and a cheap one.

- Expensive: a shared element transition, where the thumbnail and title animate to their destination coordinates over 300ms while everything else fades in behind them.
- Cheap: give the destination header the same background colour, corner radius and vertical position as the card, then fade the rest in. That buys most of the perceived continuity for a fraction of the work.

The test to apply in review: at every frame, could the user point at the thing they tapped? If the answer is no even for four frames, the eye loses the thread and the screen reads as a replacement rather than an expansion.

### Origin matters more than the animation

A dropdown scaling up from the centre of the viewport is noise. The same dropdown scaling from the corner nearest the button that opened it is an explanation.

\`\`\`css
/* menu opened by the avatar button in the top right */
.menu {
  transform-origin: top right;
  transform: scale(0.96) translateY(-4px);
  opacity: 0;
  transition: transform 160ms var(--ease-out), opacity 120ms linear;
}
.menu[data-open] { transform: scale(1) translateY(0); opacity: 1; }
\`\`\`

Scale from 0.96, not from 0. Starting at zero is cartoon physics. Starting near full size reads as the menu having been there all along, just arriving.

### Stagger, and the tail it hides

Staggering a list gives it life. It also gives it a tail, and the tail is time the user spends waiting.

\`\`\`text
12 rows, 50ms apart, 200ms each
  row 1   starts 0ms      done 200ms
  row 12  starts 550ms    done 750ms   <- 750ms to read a list
\`\`\`

Two fixes, use both. Cut the interval to 20ms or 30ms, and stop staggering after the fifth item so everything below it arrives together. Total choreography should land inside 300ms no matter how many rows there are.

### The mistakes

Animating things the user did not cause. A dashboard where six cards fly in on every visit is charming once and irritating on the fortieth, because someone came to read a number and now has to sit through a performance first. Reserve motion for state changes the user triggered, plus the first paint of genuinely new content.

Then uninterruptible transitions. If someone opens a drawer and immediately taps close, the close must start from wherever the drawer currently sits, not queue up behind the open and run afterwards. Queued animations are exactly how an interface ends up feeling like it is arguing with the person using it, and the fix is to animate from the current computed value rather than from the declared start state.
      `,
        [
          q('A list of 12 rows staggers in at 50ms intervals, with each row animating for 200ms. What is wrong with that?', [
            'Rows at the top finish before the user\'s eye has reached them',
            'The last row lands at 750ms, so reading the list means waiting',
            'The interval is too short for the eye to track individual rows',
            'Staggering pushes every row onto its own compositor layer',
          ], 1, 'Stagger delay accumulates, so twelve rows at 50ms apart plus a 200ms animation puts the final row at 750ms, which is real waiting time added to a list the user came to read.'),
          q('A dropdown opened by the avatar button in the top right scales up from the centre of the viewport. Why is that the wrong choice?', [
            'A centre origin makes the scale animation more expensive to render',
            'The menu will overshoot its final position on slower devices',
            'Centre scaling needs a longer duration before it looks correct',
            'The motion no longer shows which control produced the menu',
          ], 3, 'Setting transform-origin to the corner nearest the trigger ties the menu visually to the button that opened it, and a centre origin throws that explanation away.'),
          q('A user opens a drawer, then taps close while the open transition is still running. What should happen?', [
            'The close begins from wherever the drawer currently sits',
            'The open finishes first, then the close animation runs after it',
            'Both animations are dropped and the drawer snaps shut instantly',
            'The close is ignored until the open transition has fully ended',
          ], 0, 'Animating from the current computed position keeps the interface responsive to the person using it, while queueing or ignoring the second input makes the UI feel like it is arguing back.'),
        ]
      ),
      lesson('Designing the Wait: Skeletons, Spinners, and Perceived Speed', 13, `
Two builds of the same screen, both fetching in 240 milliseconds. One shows a spinner, one shows nothing. Testers consistently rate the one with the spinner as slower. The spinner appeared, flickered and vanished, and the only thing it communicated was that something might have gone wrong.

Waiting is a design surface. The response time belongs to the backend. How long it feels belongs to you.

### The thresholds have not moved since the 1960s

| Budget | What the person experiences | What you show |
|---|---|---|
| Under 100ms | Direct manipulation, no delay felt | Nothing, just the result |
| 100ms to 1s | A pause they notice, attention holds | Nothing, or a disabled button |
| 1s to 10s | Attention drifts, they look away | Skeleton or inline progress |
| Over 10s | They switch tabs | Determinate progress, cancel, notify |

These are properties of human attention, not of hardware, which is why faster machines have never shifted them.

### Delay the spinner, then commit to it

Most requests on a warm connection return in 150 to 400ms. Render a loading state the instant the request fires and the majority of your users see a flash. Two rules kill it:

\`\`\`js
// show nothing for 300ms; if the data arrives first, no loading state ever appears
const showAfter = setTimeout(() => setLoading(true), 300);
let shownAt = null;

function stop() {
  clearTimeout(showAfter);
  const held = shownAt ? Date.now() - shownAt : 0;
  // once visible, hold it 500ms so it cannot flash on the way out either
  setTimeout(() => setLoading(false), Math.max(0, 500 - held));
}
\`\`\`

The product did not get faster by a single millisecond. It feels faster, because a state that never appears cannot be read as trouble.

### Skeletons only where the layout is known

A skeleton is a promise about what is coming. Keep the promise. If the skeleton shows three even rows and the real content lands as one row plus an empty state illustration, you have built a jolt that is worse than a spinner, and on a slow connection you have moved the button someone was about to tap.

Use a skeleton where the shape of the result is fixed: a table of enrolled courses, a profile header, a card grid. Use a spinner where it genuinely is not: a search that may return zero results or two hundred.

Never skeleton the whole page when one region changed. Filtering a course list should dim the list and leave the filters, header and sidebar solid. Blanking the entire screen tells the user they navigated somewhere, and they did not.

### Optimistic updates and the failure path

For actions that almost always succeed and are cheap to reverse, render the result before the server confirms it. A bookmark toggle should fill in on the tap, at zero milliseconds.

\`\`\`text
tap   ->  icon fills, saved count 12 becomes 13, request goes out
ok    ->  nothing visible happens, which is the entire point
fail  ->  icon reverts, count returns to 12,
          toast: "Could not save that bookmark. Try again."
\`\`\`

The failure path is the whole design. Revert to the exact previous state, name what failed in the user's words, and never leave the interface asserting something the server disagrees with. Keep this pattern away from anything the user cannot easily redo: a payment, a delete, a graded submission.

### Order the work, not just the code

Perceived speed is mostly about what arrives first. Paint the shell, the navigation and the headings immediately, then fetch the expensive analytics panel. A dashboard where the title and course names land at 200ms while one chart fills at 1.4 seconds feels quick. The same dashboard held blank until everything is ready at 1.4 seconds feels slow. The total time is identical, and only one of them gets complained about.
      `,
        [
          q('Most of your requests return in 150 to 400ms, yet showing a spinner the instant each request fires makes the product test as slower. Why?', [
            'The spinner animation competes with the response for main thread time',
            'A spinner implies a long job, so users pause before acting on the result',
            'A loading state that flashes and vanishes reads as something going wrong',
            'Spinners at that speed drop frames, and the judder is read as slowness',
          ], 2, 'A loading indicator that appears and disappears within a couple of hundred milliseconds registers as a glitch rather than as progress, which is why delaying it by 300ms feels faster.'),
          q('A user applies a filter to a list of courses and the request takes about 900ms. Which loading treatment is right?', [
            'Replace the whole page with a skeleton until the results arrive',
            'Dim the result list only, leaving filters and header solid',
            'Show a full screen spinner overlay to block further filtering',
            'Blank the list area entirely and show nothing until data lands',
          ], 1, 'Only the results changed, so keeping the surrounding chrome stable tells the user they are still on the same screen instead of implying they navigated somewhere new.'),
          q('Which of these actions is the worst candidate for an optimistic update?', [
            'Toggling a bookmark on a course card in a browse list',
            'Marking a lesson complete from the lesson page footer',
            'Renaming a saved filter that appears in the sidebar',
            'Submitting a graded assessment attempt for marking',
          ], 3, 'Optimistic updates require a cheap, silent reversal, and a graded submission cannot be quietly rolled back if the request fails, so the user must see the real server outcome.'),
        ]
      ),
      lesson('Slow and Streaming Systems: Progress, Partial Results, and Cancelling', 14, `
A university admin uploads a 40,000 row CSV of student records. The importer shows a spinner. Three minutes later it is still spinning, so she refreshes the tab, and now nobody in the building knows how many rows landed. That is not a backend failure. Nobody designed minute three.

Past ten seconds the rules from short waits stop applying, because the user is no longer watching. Design for someone who left and came back.

### Indeterminate is a last resort

A spinner that turns for three minutes tells you the page is not frozen and nothing else. If you can count units, count them. If you cannot, show steps, which are honest and still read as movement.

| Situation | Right pattern |
|---|---|
| Known total, countable units | Percent bar plus "12,400 of 40,000 rows" |
| Fixed pipeline, unknown timing | Step list with ticks: Upload, Validate, Import, Index |
| Genuinely unknown, under 10s | Indeterminate bar |
| Genuinely unknown, over 10s | Step list plus elapsed time |

\`\`\`text
Importing students.csv

  [x] Uploaded              2.1 MB
  [x] Validated             40,000 rows, 118 warnings
  [>] Importing             12,400 of 40,000     about 2 minutes left
  [ ] Rebuilding search index

                                                 [ Cancel ]
\`\`\`

A step list survives a stall. If Importing sits at 12,400 for forty seconds the user still knows exactly where they are, which beats a bar frozen at 31 percent with no label attached to it.

### Never let a progress bar lie

The classic sin is a bar that sprints to 90 percent in four seconds and then parks. Users learn that behaviour in two uses and stop trusting every bar you ship, including the honest ones. If the last step is unpredictable, give it its own segment and label it, rather than smearing the uncertainty across the whole track.

Time remaining is worse than useless when it jumps around. Smooth the estimate over the last several seconds, round it hard (about 2 minutes, not 1m 47s), and drop it entirely rather than show a number that swings from 30 seconds to 4 minutes and back.

### Stream partial results

For anything that produces output progressively, first output matters more than last output. A search that starts painting rows at 400ms and finishes at 8 seconds feels faster than one that appears complete at 5 seconds, because reading starts at 400ms in the first and at 5 seconds in the second.

Two things break streaming interfaces in practice.

- Reflow. Content that arrives and shoves earlier content around means nobody can read what is already on screen. Reserve the space, append below, never insert above.
- Scroll hijacking. Auto scrolling to the newest content is correct only while the user is already at the bottom. The moment they scroll up they are reading, so stop following and offer a jump to latest control instead.

### Cancel has to mean something

Any operation over about five seconds needs a cancel, and the cancel must abort the work rather than just hide the dialog.

\`\`\`js
const controller = new AbortController();
cancelButton.onclick = () => controller.abort();

await fetch('/api/imports/981', { signal: controller.signal });
\`\`\`

Then tell the truth about what is left behind. "Cancelled" is not enough. "Cancelled. 12,400 of 40,000 rows were imported and are live. Resume this import, or roll it back?" respects the three minutes she already spent and gives her a way out of the mess.

### Let them leave

For anything measured in minutes, the strongest design removes the wait entirely. Hand the job to a queue, put it in a jobs list the user can navigate away from, and notify on completion. One rule makes this safe: never require someone to hold a tab open to protect their data. If closing the browser can lose the work, you have shipped a trap rather than a feature.
      `,
        [
          q('A three minute CSV import shows a bar that races to 90 percent in four seconds and then sits there. What is the real cost of that?', [
            'Users stop trusting every progress bar you ship, honest ones included',
            'The bar consumes render time that the import work actually needs',
            'Users abandon early because 90 percent looks close enough to leave',
            'The bar has no room left to report the final indexing step properly',
          ], 0, 'A bar that lies once teaches users that progress in your product is decorative, so later screens with accurate progress get ignored too.'),
          q('Results are streaming into a list and the user scrolls up to read something that already arrived. What should the interface do?', [
            'Pause the stream until the user scrolls back down to the bottom',
            'Keep auto scrolling so the newest result is always on screen',
            'Stop following the stream and offer a jump to latest control',
            'Insert new results above so they are seen without any scrolling',
          ], 2, 'Scrolling up is a signal that the user is reading, so continuing to follow the stream drags the text out from under them; a jump to latest control returns control to them.'),
          q('An import is cancelled after 12,400 of 40,000 rows have already been written. Which message is the right design?', [
            'Import cancelled. No changes have been made to your data.',
            'Cancelled. 12,400 rows are live. Resume, or roll this back?',
            'Import cancelled successfully. Please upload the file again.',
            'Cancelled. The remaining rows will finish in the background.',
          ], 1, 'Rows were committed before the abort, so the message has to state what survived and offer a route forward, and the alternatives either state a falsehood or waste the work already done.'),
        ]
      ),
      ],
      [
      q('A designer sets a single 300ms duration for everything: chevron rotations, tooltips, drawers and full screen sheets. What is the result?', [
        'Every animated element gets its own layer and memory use climbs',
        'Only the largest elements feel right and the rest visibly overshoot',
        'The timing curve has to become linear for a shared duration to work',
        'Small movements feel sticky while the large ones are about right',
      ], 3, 'Duration should fall out of travel distance, so a fixed number that suits an 800px sheet leaves a 24px chevron crawling through a movement the eye expects to be near instant.'),
      q('Which pairing of a wait length with its treatment is correct?', [
        'A 240ms fetch: show nothing, then render the result when it arrives',
        'A 4 second report build: an indeterminate spinner and no cancel option',
        'A 3 minute import: one spinner held steady until the work completes',
        'A 900ms filtered search: a full page skeleton over the entire screen',
      ], 0, 'Under about 300ms any loading state only flashes, so showing nothing is correct, while the other three all under communicate for waits long enough to need progress, cancel or scoped feedback.'),
      q('A team animates six dashboard cards flying in on every page load. Daily users complain, but new users like it. Why?', [
        'The animation delays the first paint of the data underneath it',
        'Motion the user did not cause becomes a tax on a repeated task',
        'Flying cards cannot honour the reduced motion setting correctly',
        'Six simultaneous animations exceed the browser frame budget',
      ], 1, 'Motion earns its place by explaining a change the user triggered, so an unrequested entrance animation is charming once and pure delay on the fortieth visit for someone checking a number.'),
      q('Backend response times are fixed and cannot be improved this quarter. Which change most improves perceived speed?', [
        'Increase every transition duration so the app feels more considered',
        'Add a skeleton screen over the whole page on every navigation',
        'Paint the shell and headings first, fill the slow chart panel later',
        'Replace all spinners with indeterminate bars across the product',
      ], 2, 'Perceived speed is driven by when the first useful content appears, so streaming the cheap parts of a page immediately makes an unchanged total load time feel much faster.'),
      ]
    ),
    chapter(
      'Dense Interfaces: Tables, Filters, and Dashboards',
      'Designing the data heavy screens people work in all day, where thousands of rows, stacked filters and bulk actions still have to stay readable, honest and safe.',
      [
      lesson('Data Tables That Survive Ten Thousand Rows', 13, `
A support tool renders every open ticket in one table. 12,000 rows, nine columns, roughly 110,000 DOM nodes before a single character of content is measured. The tab settles at 380MB, the first click takes six seconds to register, and scrolling runs at twelve frames per second on the laptop the support team was actually issued. The data was not the problem. Rendering all of it was.

### Pick the paging strategy before you draw a column

This is a design decision, not an engineering one, because each option changes what a person is able to do on the screen.

| Strategy | Works when | What it costs you |
|---|---|---|
| Pagination | People search, then act on a handful of rows | Nothing spans pages: no running total, no cross page selection |
| Infinite scroll | Browsing where absolute position does not matter | No sense of size, no way back to row 4,200, footer unreachable |
| Virtual scroll | Long lists people genuinely scan top to bottom | Only visible rows exist, so browser find and print stop working |

Virtual scrolling is the one that surprises people. Windowing keeps about forty rows in the document and recycles them as you scroll, so 12,000 rows cost roughly what forty cost. Then a user presses Ctrl+F, searches for an invoice number that is definitely in the table, and the browser finds nothing. Same for select all and paste into a spreadsheet. Same for print. If you window, ship a real search field and an export button, because you have quietly removed the two the browser was giving away for free.

### Sorting is where dense tables lie

\`\`\`js
// Broken: sorts the 50 rows already downloaded, labels itself "Amount, high to low"
const sorted = [...rowsOnThisPage].sort((a, b) => b.amount - a.amount);
\`\`\`

A user on page 1 of 240 sorts by amount descending and expects the largest of 12,000 invoices. They get the largest of fifty. No error, no spinner, nothing red. The interface hands over a wrong answer in exactly the shape of a right one, which is why this bug survives months of daily use and is usually found by an accountant, not by QA.

\`\`\`js
// Fixed: order is decided where the whole set lives, the page is a window onto it
fetch(\`/api/invoices?sort=amount&dir=desc&page=1&limit=50\`);
\`\`\`

The same rule covers totals. A footer reading "Total: 41,209 invoices" under a paginated table has to come from the query, never from summing what happens to be on screen.

### Column craft

| Content | Align | Reason |
|---|---|---|
| Names, subjects, email addresses | Left | The eye scans a straight left edge |
| Currency, counts, percentages | Right | Digit places line up, so size is visible without reading |
| Dates and relative times | Left | They read as words rather than quantities |
| Row actions | Right | Keeps the destructive control away from the identity column |

Numbers also need \`font-variant-numeric: tabular-nums\`. In most proportional fonts a 1 is narrower than an 8, so a column of figures wobbles by a few pixels per row and the alignment you carefully designed never arrives on screen.

Density matters more than it sounds. A 48px row is comfortable for someone who visits weekly. Someone who lives in this screen for six hours a day wants 32px, because that is the difference between seeing eleven rows and seeing eighteen, and eighteen is one fewer scroll per ticket. Offer a density control and remember the choice per user, not per session.

### Two mistakes that ship constantly

Hover only row actions. They do not exist on touch, they are invisible to anyone driving the page from the keyboard, and they turn every row into a small mouse hunt. Keep one action visible and put the rest behind a menu button that is always rendered.

Sticky headers without a sticky identity column. Scroll right on a wide table and the column telling you which customer this row belongs to slides off the screen, so every number after that has no owner. Pin the first column as well, and check it at 1280px, which is what most work laptops actually give you once a sidebar is open.
      `,
        [
          q('A table uses virtual scrolling to show 12,000 rows smoothly. A user reports that Ctrl+F cannot find an invoice number that is definitely in the table. What is happening?', [
            'The browser find bar is disabled on pages that use a sticky table header',
            'Virtual scrolling reorders rows by relevance, so the number moved elsewhere',
            'Only rows near the viewport exist in the document, so find sees about forty',
            'The invoice column is truncated, so the full number never reaches the markup',
          ], 2, 'Windowing keeps only the rows near the viewport in the document and recycles them as you scroll, so the browser find command can search just the few dozen currently rendered, which is why a windowed table has to ship its own search and an export.'),
          q('A paginated table shows 50 of 12,000 invoices, and clicking the Amount header sorts only the rows already downloaded. Why is this worse than an obvious crash?', [
            'It returns a wrong answer that looks exactly like a correct one',
            'It doubles the number of requests the table sends to the server',
            'It resets the pagination control back to the first page of results',
            'It makes the sort arrow point the opposite way to the real data',
          ], 0, 'Sorting the current page produces a plausible ordered list with no error state, so someone on page 1 of 240 believes they are looking at the largest invoices in the system when they are seeing the largest of fifty, and nothing on screen contradicts them.'),
          q('Row actions in a dense table appear only when a row is hovered. Which group does this break for?', [
            'Users on very wide monitors, where the actions column falls off screen',
            'Users who sort the table, because hover targets shift after reordering',
            'Users on slow connections, because hover styles load after the rows do',
            'Touch and keyboard users, who never produce a hover state at all',
          ], 3, 'A hover state requires a pointer, so on a touch screen the controls are simply absent and a keyboard user tabs into buttons that are still invisible, which is why at least one action should always be rendered.'),
        ]
      ),
      lesson('Search, Filters, and Facets Without a Dead End', 13, `
An analyst opens the orders screen, sets Status to Refunded, Region to Nordics, Channel to Partner. The screen says "No results found." Three filters are on. Which one emptied it? The interface will not say, so she clears everything and starts again. Fourth time today.

### Facet counts, and the query mistake underneath them

Put the number of matching rows next to every option, so a zero is visible before it is chosen rather than after.

\`\`\`text
Status                Region              Channel
[x] Refunded    412   [ ] Nordics    0    [ ] Partner    93
[ ] Shipped   8,204   [x] DACH     260    [x] Direct    319
[ ] Pending     771   [ ] UK       118    [ ] Reseller    0
\`\`\`

The subtle part is which filters each count respects. A group's counts are computed with every other active filter applied, and with that group's own selection ignored. Include a group's own selection and every unselected option in it reports 0, because nothing can be both Refunded and Shipped. The panel then looks completely broken while each number in it is technically correct.

\`\`\`sql
-- Counts for the Region facet: honour Status and Channel, ignore Region
SELECT region, COUNT(*) FROM orders
WHERE status IN ('refunded') AND channel IN ('direct')
GROUP BY region;
\`\`\`

### AND across groups, OR inside one

| The user does | They expect | So the query is |
|---|---|---|
| Ticks a second status | More rows | \`status IN ('refunded','pending')\` |
| Ticks a region as well | Fewer rows | \`AND region IN ('dach')\` |
| Clears the whole group | Back to everything | The group drops out of the WHERE clause |

Invert either half and selections start behaving in a way people cannot predict. Within a group, adding a checkbox has to widen the set. Across groups, adding one has to narrow it.

### Put the state in the address bar

\`\`\`text
/orders?status=refunded,pending&region=dach&sort=total:desc&page=3
\`\`\`

That one line buys four things: the view can be pasted into Slack, the back button removes the last filter instead of leaving the screen, a refresh does not wipe fifteen seconds of work, and support can reproduce a reported bug from a link. A filter panel whose state lives only in component memory is a filter panel nobody can talk about.

### The dead end and the way out

Never ship a bare empty state on a filtered screen.

\`\`\`text
Broken:  No results found.

Fixed:   No orders match all 3 filters.
         Region: Nordics is the filter with 0 matches.
         [Remove Region: Nordics]  shows 412 orders     [Clear all filters]
\`\`\`

The fixed version costs one extra query per facet and removes the restart entirely.

### Search and filter are different controls

Search is forgiving: partial words, near misses, results ranked by relevance. Filters are exact and countable. Merge them into one box and you get exact matching on a typo, which reads to the user as missing data rather than as a spelling mistake.

Search also has a race condition that ships surprisingly often. Typing "nordics" fires seven requests, and the response for "nord" can land after the response for "nordics" and overwrite it. The user sees results for a query they finished typing half a second ago.

\`\`\`js
let latest = 0;
async function runSearch(q) {
  const id = ++latest;
  const rows = await fetch(\`/api/orders?q=\${encodeURIComponent(q)}\`).then(r => r.json());
  if (id !== latest) return;          // a newer query has already answered
  render(rows);
}
\`\`\`

Debounce at roughly 250ms on top of that, and keep the previous results visible while the new ones load rather than flashing an empty table.

### The mistake

Filters that persist across sessions while hiding inside a collapsed panel. Someone narrows the view to one region on Tuesday, comes back on Wednesday, and reports that most of the orders have disappeared. Persistence is worth keeping. Invisibility is not. Render every active filter as a removable chip directly above the results, always, and never only inside the panel that produced it.
      `,
        [
          q('A facet panel has Refunded ticked under Status, and every other status in that same group now reports a count of 0. What is the likely cause?', [
            'The counts were cached from before the Refunded filter was applied',
            'The Status counts are computed with the Status filter applied to them',
            'The groups are combined with OR, so one selection empties the others',
            'The count query runs against the current page instead of the whole set',
          ], 1, 'Counts for a facet group must honour every other active filter while ignoring that group\'s own selection, otherwise nothing can be both Refunded and Shipped and each unselected option correctly reports zero.'),
          q('Filter state lives only in component memory and never reaches the URL. Which problem does that create?', [
            'Filters stop applying once the result set grows past one page',
            'Facet counts drift out of step with the rows shown below them',
            'Search and filtering start competing for the same query parameter',
            'The back button leaves the screen instead of undoing the last filter',
          ], 3, 'With no filter state in the address bar the browser has nothing to step back through, so back exits the page entirely, and the view cannot be shared, refreshed or reproduced by support from a pasted link.'),
          q('Three filters are active and the result set is empty. Which response actually helps the user?', [
            'Name the filter with zero matches and offer a button to drop it',
            'Clear every filter automatically and show the full result set again',
            'Grey out the results area until at least one filter is removed',
            'Show the last non empty result set with a warning banner above it',
          ], 0, 'The dead end is expensive because the user cannot tell which of the three filters emptied the set, so naming the offending facet and offering one click removal turns a full restart into a single correction.'),
        ]
      ),
      lesson('Bulk Actions, Destructive Choices, and Undo', 13, `
Someone filters a subscriptions table down to 8,342 rows, ticks the checkbox in the header, clicks Delete, confirms. Either fifty records vanish or 8,342 do, depending on how one endpoint was written two years ago. The interface never said which. Both outcomes are bugs. Only one of them ends up in an incident review.

### Say out loud what select all selected

\`\`\`text
All 50 rows on this page are selected.  [Select all 8,342 matching these filters]
\`\`\`

After that second click:

\`\`\`text
All 8,342 rows matching these filters are selected.  [Clear selection]
\`\`\`

Underneath there are two selection modes, and they behave differently. An explicit list of IDs is stable: you know exactly what you are acting on. A selection expressed as a query is not, because rows can enter or leave the set between the click and the commit. Send the query to the server rather than expanding it into 8,342 IDs in a URL, and re-state the count in the confirmation so a drift from 8,342 to 8,351 is visible before anything runs.

Selection also has to survive paging. Three rows on page 1 and two on page 2 should leave the toolbar reading "5 selected". If your implementation cannot hold that, clear the selection loudly when the page changes rather than dropping rows in silence.

### Confirmation dialogs stop almost nothing

People pattern match. By the twentieth "Are you sure?", clicking Confirm is muscle memory that happens before the sentence is read. Match the safeguard to the blast radius instead.

| Blast radius | Safeguard that works | Safeguard that does not |
|---|---|---|
| One reversible row | Undo toast, no dialog at all | A modal on every single archive |
| Many reversible rows | Undo with the count written in it | A generic "Are you sure?" prompt |
| One irreversible object | Type the object name to confirm | A red button and a warning icon |
| Many irreversible rows | Type the count, then a delayed job | Anything with Confirm focused first |

Two rules that cost nothing: never focus the destructive button by default, and never place Delete where Cancel normally sits.

### Undo is a delay, not a rewind

The version that works is a window during which nothing has actually happened yet.

\`\`\`js
function deleteSubscriptions(ids) {
  hideRows(ids);                                  // optimistic, rows go at once
  const job = setTimeout(() => commitDelete(ids), 10000);
  showToast(\`\${ids.length} subscriptions deleted\`, {
    action: {
      label: 'Undo',
      onClick: () => { clearTimeout(job); restoreRows(ids); }
    }
  });
}
\`\`\`

Ten seconds is the floor, because the user has to notice the toast, read a count, and decide. Place it where it does not cover the control they reach for next, which on a dense table is usually the toolbar. If undo genuinely cannot be built, say so in the confirmation with the specific consequence attached: "This cannot be undone. 8,342 subscriptions and their invoice history will be removed."

### Partial failure is the normal case, not the edge case

Of 8,342 deletions, seventeen fail because those accounts have open disputes.

\`\`\`text
Broken:  Done.
Broken:  Something went wrong.

Fixed:   8,325 deleted. 17 could not be deleted.
         Reason: open payment dispute.
         [Show these 17]   [Retry the 17]
\`\`\`

"Something went wrong" after a bulk action is the most expensive message in the product, because the user cannot tell whether none, some or all of it applied, and the only safe response left to them is checking thousands of rows by hand.

### Who owns a long job

The browser tab must not be the thing holding a bulk operation together. Closing it at 60 percent should not leave 40 percent of the work undone forever. Start the job server side, give it an ID, list it somewhere the user can find it again, and let the result be waiting when they come back. Bulk work that only exists while a tab is open is bulk work that will be interrupted, because six thousand rows take longer than the average person's attention.
      `,
        [
          q('A header checkbox is ticked while the active filter matches 8,342 rows and 50 are rendered. What should the interface do next?', [
            'State that 50 rows are selected and offer to select all 8,342',
            'Select all 8,342 rows, since the filter is the user\'s real intent',
            'Select the 50 rendered rows and load the remainder in the background',
            'Disable the header checkbox until the filter matches under 100 rows',
          ], 0, 'The ambiguity between the visible page and the whole filtered set is where the damage comes from, so the interface has to state which one it selected and make the wider selection a separate, deliberate click.'),
          q('Why does typing an object name to confirm protect better than a red Are you sure dialog?', [
            'It gives the server time to snapshot the records before the delete',
            'It is announced differently by screen readers, so it gets noticed',
            'It cannot be cleared by muscle memory, since it needs the real name',
            'It records the typed name in the audit log for later investigation',
          ], 2, 'Repeated confirmation dialogs get dismissed reflexively once someone has seen enough of them, while typing the object\'s name forces the user to read what is about to be destroyed and cannot be completed without doing so.'),
          q('A bulk delete of 8,342 rows finishes with 17 failures. Which result message is safe to show?', [
            'Something went wrong, please run the bulk delete again',
            '8,325 deleted, 17 failed on open disputes, retry those 17',
            'Bulk delete completed, check the audit log for any issues',
            'Delete partly applied, refresh the table to see the result',
          ], 1, 'After a partial failure the user needs the split between success and failure, the reason for the failure, and a way to act on only the failed rows, otherwise the sole safe response is auditing thousands of rows by hand.'),
        ]
      ),
      lesson('Dashboards People Act On, Not Just Look At', 13, `
A logistics team gets a dashboard with 22 tiles. Six weeks later the analytics say the median session on it lasts eleven seconds, and 70 percent of those sessions touch one tile: on time delivery rate. Twenty one tiles, four weeks of work, answering questions nobody had.

### Write the question and the action before the chart

Fill this in for every tile before any of it gets designed.

\`\`\`text
Question:   Are we shipping late this week?
Metric:     On time delivery rate, last 7 days against previous 7
Threshold:  Below 94 percent is a problem
Action:     Open the late shipments table, filtered to this week
Owner:      Duty manager, checks at 08:30 each morning
\`\`\`

A tile that cannot fill in Action and Owner is a tile for a slide deck. Cut it, and the twenty two becomes six.

### A number on its own is not information

94.1 percent means nothing until it is next to something.

| Comparison | Reads as | Use it when |
|---|---|---|
| Previous period | 94.1 percent, down 1.2 points on last week | Direction is the decision |
| Target | 94.1 percent against a 96 percent target | The number is committed to someone |
| Distribution | p50 four hours, p95 thirty one hours | An average is hiding the tail |

That last row is the one people get wrong. Across 8,000 deliveries a mean of 4.2 hours looks healthy, and the mean is dominated by the thousands of fast cases, so it barely moves when a few hundred shipments take a day and a half. The p95 of thirty one hours is the four hundred customers who are about to call. Show the tail or the tile is describing a product nobody uses.

### Layout is a ranking, not a grid

Twelve equal tiles tell the reader that twelve things matter equally, which is never true.

\`\`\`text
+---------------------------------------------------------------+
| ON TIME  94.1%   down 1.2 pts vs last week   target 96%        |   primary
+--------------------------------+------------------------------+
| Late by carrier                | Late by depot                |   what moved it
+--------------------------------+------------------------------+
| 214 late shipments this week          [Open filtered table]    |   the actual rows
+---------------------------------------------------------------+
\`\`\`

One primary metric, then the two or three breakdowns that explain a move in it, then a route into the rows themselves. Someone should get from "this got worse" to "these 214 shipments" in a single click, which is why a dashboard and the table it links into are one product rather than two.

### One time range, printed on the tile

The classic failure: tile A covers the last 7 days, tile B is month to date, tile C is since launch. Two of them get added together in a Thursday meeting, the total disagrees with a finance report, and confidence in the whole page is gone inside a quarter. Put one range control at the top, apply it everywhere, and print the resolved dates on each tile, "1 Aug to 24 Aug", not just "last 30 days".

Print the freshness too: "updated 09:12, 6 minutes ago". A dashboard with no timestamp is one broken pipeline away from being confidently wrong, and a flat line is indistinguishable from a stopped feed.

### Small multiples beat one crowded chart

Nine lines in a single chart is spaghetti, and the legend does the work the chart was supposed to do. Nine small charts sharing one y axis, sorted largest first, let a reader find the odd one in about a second. The shared axis is not optional. Rescale each panel to its own data and every line looks equally dramatic, which turns a comparison into a lie told with real numbers.

### The mistake

Building the dashboard instead of the alert. If a threshold matters enough that someone must react within the hour, something has to go and tell them when it is crossed. The dashboard is then where they go to find out why. A page that relies on a human remembering to open it gets opened on the days when nothing is wrong.
      `,
        [
          q('A delivery dashboard reports a mean delivery time of 4.2 hours while the support queue fills with complaints about late parcels. What is the tile missing?', [
            'A comparison against the same week in the previous year',
            'A breakdown of delivery time by carrier and by depot',
            'A bigger sample, since 8,000 deliveries is too few to trust',
            'A tail figure such as p95, which the mean cannot reveal',
          ], 3, 'A mean is dominated by the many fast cases, so a long tail of very slow deliveries barely moves it, and only a percentile such as p95 exposes the customers whose experience is generating the complaints.'),
          q('One tile covers the last 7 days, another is month to date, a third is since launch. What is the main risk of that mix?', [
            'The slowest query on the page sets the load time for every tile',
            'Numbers get compared across windows, so the page loses trust',
            'The dashboard cannot be exported into a single spreadsheet file',
            'Tiles refresh at different moments, so the layout shifts on load',
          ], 1, 'Mixed windows invite people to add or compare figures covering different periods, and once those totals disagree with a finance report in a meeting the entire page stops being believed.'),
          q('A threshold matters enough that someone has to react within an hour of it being crossed. What should you build?', [
            'A tile with the threshold drawn on it as a reference line',
            'A daily email containing an image of the whole dashboard',
            'An alert that fires on the breach, with the tile as the why',
            'A larger copy of the tile pinned to the top of the page',
          ], 2, 'A dashboard is only read when somebody remembers to open it, which is rarely the moment things break, so the notification has to carry the urgency and the dashboard becomes the place they go to diagnose it.'),
        ]
      ),
      ],
      [
      q('A table windows its rows, a facet panel shows counts, and a bulk action can target the whole filtered set. Which of these must be computed on the server?', [
        'The sort order, the facet counts and the selected row count',
        'The sort order only, since counts are cheap to derive locally',
        'The facet counts only, because sorting is a presentation concern',
        'None of them, provided the client caches the full result set once',
      ], 0, 'Each of those three answers describes the entire matching set rather than the rows currently downloaded, so deriving any of them in the browser produces a confident figure that is really based on one page of data.'),
      q('Filters are applied, then a bulk archive runs against the filtered set. Which safeguard fits a reversible action on 900 rows?', [
        'A modal asking the user to confirm before the archive starts',
        'A typed confirmation containing the exact number of rows hit',
        'An undo toast naming the count, with the commit delayed',
        'A read only preview page listing every one of the 900 rows',
      ], 2, 'Archiving can be reversed, so the cheapest correct safeguard is a delayed commit with an undo control that states how many rows were affected, which costs nothing at all when the action was intended.'),
      q('A dashboard tile reads 214 late shipments this week. Which single addition makes it most useful to the duty manager?', [
        'A sparkline of the same figure across the past twelve weeks',
        'The same figure recalculated as a percentage of all shipments',
        'A note giving the query and the table the number comes from',
        'A link into the shipments table filtered to those 214 rows',
      ], 3, 'The job of a dashboard is to send someone to the work, so a route from the summary number straight into the filtered rows is what turns a reading into an action the manager can actually take.'),
      q('An analyst leaves a region filter applied, returns the next morning, and reports that most orders are missing. What prevents this?', [
        'Expiring saved filters after a fixed period of inactivity',
        'Showing applied filters as chips above the results at all times',
        'Refusing to persist any filter state between separate sessions',
        'Warning on every page load that filters may still be applied',
      ], 1, 'Persisted filters are worth keeping, but they have to stay visible, so rendering each active filter as a removable chip directly above the results keeps the user aware of why the set is smaller than expected.'),
      ]
    ),
    chapter(
      'Deep Accessibility: Semantics, Focus, and Conformance',
      'Going past the contrast checker into what assistive technology actually consumes, and into the audits and standards a shipped product gets judged against.',
      [
      lesson('The Accessibility Tree: What a Screen Reader Actually Announces', 14, `
A course editor ships its delete control as \`<div class="btn danger" onclick="remove()">Delete</div>\`. It looks right, it works with a mouse, and it passes every contrast check. A screen reader user tabs through the page and never reaches it. No role, no tab stop, no announcement. For that user the feature does not exist.

### The tree the browser builds behind your DOM

Assistive technology does not read your HTML, and it certainly does not read your CSS. The browser derives a second structure from the DOM, the accessibility tree, and every node in it carries four things.

| Property | Example | Where it comes from |
|---|---|---|
| Role | button, heading, listitem | The native element, or an explicit \`role\` |
| Name | "Save draft" | Computed by a fixed precedence order |
| State | expanded, disabled, checked | \`aria-expanded\`, \`disabled\`, \`aria-checked\` |
| Value | "3 of 10" | \`aria-valuenow\`, an input value |

A div styled to look like a button arrives as a generic node. Nothing says "button", nothing implies Enter will fire it, and it takes no tab stop. Open Chrome DevTools, Elements, then the Accessibility pane, and read the computed role and name of anything you are unsure about. That pane is the truth. Your Figma file is not.

### How the name is computed

The accessible name is not "the text inside". Browsers walk this order and stop at the first hit.

\`\`\`text
1. aria-labelledby    wins over everything, including visible text
2. aria-label         replaces visible text entirely
3. Native semantics   <label for>, <img alt>, the button's own text
4. title attribute    last resort, unreliable across readers
5. placeholder        vanishes the moment typing starts
\`\`\`

Which explains the most common icon bug on the web.

\`\`\`html
<!-- broken: announces "button", with no name at all -->
<button onclick="saveDraft()">
  <svg aria-hidden="true" width="16" height="16">...</svg>
</button>

<!-- fixed -->
<button onclick="saveDraft()">
  <svg aria-hidden="true" focusable="false" width="16" height="16">...</svg>
  <span class="visually-hidden">Save draft</span>
</button>
\`\`\`

The icon was hidden correctly. Nobody noticed it was carrying the only name the button had.

### The override that only hurts voice users

Putting \`aria-label="Send enrolment form"\` on a button whose visible text reads **Submit** feels generous. It is a bug. A Dragon or Voice Control user says "click Submit" and nothing happens, because the name being matched is the label, not the pixels. WCAG 2.5.3 Label in Name requires the visible text to appear inside the accessible name. The habit that keeps you safe: when there is visible text, let it be the name, and reach for \`aria-label\` only when there is none.

### Live regions and the ordering trap

Announcing "Draft saved" after an autosave needs a live region, and live regions have a rule people learn the hard way.

\`\`\`js
// broken: the region and its text arrive together, so nothing is announced
container.innerHTML = '<div aria-live="polite">Draft saved</div>';

// fixed: an empty region ships with the page, then you write into it
// <div id="status" role="status" aria-live="polite" class="visually-hidden"></div>
document.getElementById('status').textContent = 'Draft saved at 14:32';
\`\`\`

A live region is announced when its contents change while it is already being watched. If the container and the message arrive at the same instant, there was no change to observe. Use \`polite\` for status, and save \`assertive\` for something worth cutting a person off mid sentence, which is almost never.

### What this changes in your spec

Every interactive thing you draw needs three annotations before handoff: what it is (role), what it is called (name), and what it announces when its state changes. "Toggle, pill shaped, brand blue when on" is half a spec. "Switch, name Email notifications, announces on and off, controls the panel below it" is one an engineer can build without guessing, and it is the half that decides whether the control exists for a third of your users.
      `,
        [
          q('An icon-only button contains an SVG marked aria-hidden="true" and no other content. What does a screen reader announce when focus lands on it?', [
            '"button" with no name, so its purpose is unknown',
            'The SVG file name, read out character by character',
            'The CSS class applied to the button element itself',
            'The page title, repeated on every icon button here',
          ], 0, 'Hiding the icon removed the only text the browser could use to compute an accessible name, so the node keeps its button role but arrives with an empty name.'),
          q('A button shows the visible text "Submit" and carries aria-label="Send enrolment form". Which group does this break, and why?', [
            'Screen reader users, because aria-label is ignored on native buttons',
            'Keyboard users, because aria-label drops the element from the tab order',
            'Low vision users, because aria-label suppresses the browser zoom setting',
            'Voice control users, because the spoken visible text no longer matches',
          ], 3, 'aria-label replaces the accessible name, so a command like "click Submit" matches nothing, which is the exact failure WCAG 2.5.3 Label in Name exists to prevent.'),
          q('A save handler injects a div with aria-live="polite" containing "Draft saved" at the moment the save completes. Why is nothing announced?', [
            'Polite regions are only announced after the user presses Tab',
            'The message is too short for a reader to treat as an update',
            'The region must already exist for the change to be observed',
            'aria-live applies to form controls only, never to a plain div',
          ], 2, 'A live region is announced when its contents change while it is being watched, so the empty container has to be in the DOM before the message text is written into it.'),
        ]
      ),
      lesson('Keyboard and Focus: Modals, Menus, and Complex Widgets', 14, `
Unplug your mouse and open your own product. Press Tab and count. On one learning platform the filter drawer opened with focus left behind on the page underneath, so a keyboard user pressed Tab 34 times through the course grid before landing inside a panel that was already covering it. Every automated check passed. The feature was simply unusable without a pointer.

### Focus order is DOM order, always

CSS moves boxes. It does not move the tab sequence. Flexbox \`order\`, grid placement, absolute positioning and \`row-reverse\` all reorder what the eye sees while the keyboard keeps walking the source.

\`\`\`html
<!-- renders as: Cancel  Save.  Tabs as: Save, Cancel -->
<div class="actions" style="display:flex; flex-direction:row-reverse">
  <button>Save</button>
  <button>Cancel</button>
</div>
\`\`\`

Fix the markup, not the CSS. When the visual order carries meaning, the source order has to match it.

### tabindex has three values and one of them is forbidden

| Value | Effect | When to use it |
|---|---|---|
| \`0\` | Joins the tab order at its DOM position | A custom control with no native equivalent |
| \`-1\` | Focusable by script only, never by Tab | Dialog containers, error summaries, roving items |
| \`1\` or higher | Jumps ahead of the whole document | Never, it corrupts order across every page |

### The five obligations of a modal

\`\`\`text
1  On open      move focus into the dialog
2  While open   Tab and Shift+Tab cycle inside it and nowhere else
3  Escape       closes without saving
4  Background   inert, so the virtual cursor cannot read what is behind
5  On close     focus returns to the control that opened it
\`\`\`

The native \`<dialog>\` element with \`showModal()\` gives you 1, 3 and 4 with no script at all, which is the strongest argument for it over a div carrying \`role="dialog"\`.

Point 5 hides a trap. Restore focus to a button that no longer exists and focus falls to \`<body>\`, which throws the screen reader back to the top of the page. Deleting a table row is exactly that case: the delete button that opened the confirmation is gone by the time the dialog closes. Move focus to the next row instead, or to a status region announcing "Row deleted, 41 remaining", and the person keeps their place.

### One widget, one tab stop

A tab list with six tabs should not cost six Tab presses. Composite widgets take a single stop and hand navigation to the arrow keys, a pattern called roving tabindex: exactly one child holds \`tabindex="0"\`, every sibling holds \`-1\`, and those values move as the user arrows.

| Widget | Enter it with | Move inside with | Activate with |
|---|---|---|---|
| Tabs | Tab | Left and Right | Enter, or on focus |
| Menu | Enter on the trigger | Up, Down, letter keys | Enter |
| Radio group | Tab | Arrow keys | Selection follows focus |
| Data grid | Tab | Four arrows, Home, End | Enter to edit |

\`\`\`js
function move(tabs, from, to) {
  tabs[from].tabIndex = -1;
  tabs[to].tabIndex = 0;
  tabs[to].focus();
}
\`\`\`

### Never delete the outline

\`outline: none\` still ships every week, usually because the default ring looked untidy on a rounded button. Replace it, do not remove it. \`:focus-visible\` gives keyboard users a ring while leaving mouse clicks clean, the indicator needs 3:1 contrast against whatever sits beside it under WCAG 1.4.11, and WCAG 2.2 added 2.4.11 Focus Not Obscured, which a sticky footer or a chat launcher sitting over the focused field will fail. Design the focus state in Figma, at the same time as hover, and it stops being something an engineer invents at the end of the sprint.
      `,
        [
          q('A checkout page puts the "Continue" button first in the HTML and uses CSS order to render it last. What happens for a keyboard user?', [
            'The button never receives focus, because CSS order removes it',
            'Focus reaches the button first, before the fields drawn above it',
            'Tab order matches the visual order, because flexbox rewrites it',
            'The button shares a single tab stop with the fields around it',
          ], 1, 'The tab sequence follows DOM order rather than painted position, so a control moved visually with CSS is still reached at its position in the source.'),
          q('A confirmation dialog closes after deleting a table row, and focus is restored to that row\'s delete button. What is the result?', [
            'Focus moves to the next row automatically in every browser',
            'Focus stays on the dialog element, which is still in the DOM',
            'The browser recreates the removed button so restoration works',
            'Focus falls to body and the reader restarts from the page top',
          ], 3, 'Restoring focus to an element that no longer exists sends focus to the document body, which throws the screen reader\'s reading position back to the start of the page.'),
          q('A tab list of six tabs is built with tabindex="0" on every tab. Which change fixes the keyboard experience?', [
            'Set tabindex="-1" on all six and rely on click handlers alone',
            'Add positive tabindex values so the tabs are visited in order',
            'Keep one tab at 0, set the rest to -1, and move with arrow keys',
            'Wrap each tab in a link so the browser handles focus natively',
          ], 2, 'The roving tabindex pattern gives a composite widget a single tab stop and hands movement between its items to the arrow keys, which is what the ARIA tabs pattern expects.'),
        ]
      ),
      lesson('Zoom, Reflow, and Hit Targets: The Criteria Designers Own', 13, `
Set a browser to 400% zoom on a 1280 by 1024 monitor. You are now designing for 320 by 256 CSS pixels. Not 320 wide with the usual tall phone canvas: 256 pixels of height, which a 64 pixel sticky header and a 56 pixel cookie bar cut down to 136. That is the viewport WCAG 1.4.10 Reflow is measured in, and it fails more design systems than colour contrast ever has.

### The criteria that land on you, not on the engineer

| Criterion | Level | What it demands | What breaks it |
|---|---|---|---|
| 1.4.4 Resize Text | AA | 200% text zoom, nothing lost | px type inside fixed height boxes |
| 1.4.10 Reflow | AA | 320 by 256 CSS px, no two way scroll | Wide tables, fixed side rails |
| 1.4.12 Text Spacing | AA | User raises line and letter spacing | \`height\` on anything holding text |
| 1.4.11 Non-text Contrast | AA | 3:1 for controls, borders, focus rings | Grey 1px input borders at 1.6:1 |
| 2.5.8 Target Size | AA (2.2) | 24 by 24 CSS px, or spacing | 20px icons packed in a toolbar |
| 2.4.11 Focus Not Obscured | AA (2.2) | Focused item stays visible | Sticky footers, chat launchers |

### Fixed heights cause more failures than anything else

1.4.12 lets a user apply their own stylesheet: line height 1.5, paragraph spacing twice the font size, letter spacing 0.12em, word spacing 0.16em. Your text has to grow into that with nothing clipped and nothing overlapping.

\`\`\`css
/* broken: the label is cut off the moment line height rises */
.btn { height: 40px; line-height: 40px; overflow: hidden; }

/* fixed: the box grows, padding keeps the rhythm */
.btn { min-height: 40px; padding: 0.625rem 1rem; line-height: 1.4; }
\`\`\`

The same applies to cards pinned at \`height: 220px\`, to badges, to table cells and to nav items. Set \`min-height\` and let the content decide the rest.

### Target size, and the exception nobody reads

WCAG 2.2 asks for 24 by 24 CSS pixels as the minimum, and 44 by 44 at AAA, which is what Apple and Google recommend anyway. The escape hatch is spacing: an undersized target still passes when a 24 pixel diameter circle centred on it does not overlap the circle of any neighbour. A row of 20 pixel icons therefore passes with centres 24 pixels apart, and fails when they are packed at 22.

You can buy that space without redrawing the icon.

\`\`\`css
.icon-btn { position: relative; width: 20px; height: 20px; }
.icon-btn::after {
  content: ""; position: absolute; inset: -6px;   /* 32 by 32 hit area */
}
\`\`\`

### Reflow is a content problem, not a media query

Adding a \`@media (max-width: 320px)\` block does not create reflow support if the content inside refuses to narrow. Three things fail predictably.

Data tables. At 320 pixels a seven column table cannot shrink, so either it scrolls sideways inside its own container, which the criterion allows for content that genuinely requires two dimensions, or each row collapses into a stacked card.

Fixed side rails. A 240 pixel filter panel with \`position: fixed\` leaves 80 pixels for results. Collapse it into a drawer below 600 pixels wide.

Horizontal padding. \`padding: 0 48px\` on a 320 pixel viewport leaves 224 pixels of text, roughly 28 characters per line. Step the padding down with the viewport instead of holding it constant.

### Test it in ninety seconds

Press Ctrl and plus five times to reach 400%, then scroll. If you have to scroll sideways to read a sentence, that is a failure you can file today. Then set the browser font size to 200% in settings, which is a different test from zoom because it changes the rem basis without scaling the layout, and watch what clips. Two minutes of this per screen catches more real barriers than an afternoon with a colour picker.
      `,
        [
          q('WCAG 1.4.10 Reflow is tested at 400% zoom in a 1280 pixel wide window. What content width must survive without horizontal scrolling?', [
            '480 CSS pixels, matching a small phone held in portrait',
            '320 CSS pixels, the same as a narrow phone viewport',
            '768 CSS pixels, which is the usual tablet breakpoint',
            '1024 CSS pixels, one quarter of the physical width',
          ], 1, 'Zooming a 1280 pixel window to 400% leaves 320 CSS pixels of usable width, which is why a layout that genuinely works at 320px satisfies the criterion.'),
          q('A button is styled height: 32px with overflow: hidden. A user applies a text spacing stylesheet that raises line height to 1.5. What fails?', [
            'The label is clipped, which fails WCAG 1.4.12 Text Spacing',
            'Contrast falls below 4.5:1 because the text is repositioned',
            'The button loses its accessible name and reads as generic',
            'The target shrinks below the 24 by 24 CSS pixel minimum',
          ], 0, 'A fixed height cannot grow when the user increases line height, so the label is cut off and content is lost, which is precisely what 1.4.12 forbids.'),
          q('A toolbar uses 20 by 20 pixel icon buttons. Under WCAG 2.2 target size (minimum), when do those undersized buttons still pass?', [
            'When each button carries a visible text label underneath it',
            'When the toolbar is fully operable by keyboard as well as pointer',
            'When the buttons hold 3:1 contrast against the toolbar surface',
            'When 24 pixel circles centred on each button do not overlap',
          ], 3, 'The spacing exception lets an undersized target pass when a 24 pixel diameter circle centred on it does not intersect a neighbour\'s circle, meaning centres at least 24 pixels apart.'),
        ]
      ),
      lesson('Audits, VPATs, and Fixing a Product You Inherited', 13, `
An enterprise buyer asks for your VPAT before signing a 90,000 dollar contract. Nobody on the team has heard the word. Someone runs axe against the product, gets 340 violations, and panics. Both reactions miss: the number is not the problem, and 340 automated findings represent roughly a third of the barriers actually in there.

### What automation catches, and what it never will

Automated tools resolve about 30 to 40 percent of WCAG failures. They are excellent at the mechanical ones and blind to everything needing judgement.

| Caught by axe or Lighthouse | Only found by a human |
|---|---|
| Missing alt attribute | Alt text that reads "image1.png" |
| Contrast below 4.5:1 | Focus order that jumps around the page |
| Empty button, missing form label | A label describing the wrong field |
| Invalid ARIA attribute or role | Valid ARIA that states the wrong thing |
| Missing document language | Headings picked for size, not structure |

A product with zero axe violations can still be unusable with a screen reader. Conformance is claimed against the criteria, never against a tool's score.

### Auditing a product you inherited

Do not audit pages, audit templates. A catalogue of 4,000 course pages has one template, so one audit covers all of them.

\`\`\`text
Templates    home, catalogue, course detail, lesson player, checkout, settings
Key flows    sign up, enrol, complete a lesson, download a certificate
Per screen   keyboard only pass, then NVDA or VoiceOver pass, then axe
Record       criterion number, component, severity, screenshot, exact steps
\`\`\`

Then group every finding by the component that caused it rather than the page it appeared on.

| Root component | Instances | Criteria | Fix effort |
|---|---|---|---|
| Icon button | 96 | 4.1.2, 2.5.8 | 1 day |
| Modal shell | 41 | 2.4.3, 2.1.2 | 3 days |
| Data table | 38 | 1.3.1, 1.4.10 | 4 days |
| Form field | 25 | 1.3.1, 3.3.2 | 1 day |

Four component fixes retire 200 issues in nine days. Page by page triage reaches the same place months later, and reopens every time someone builds a new screen.

### Conformance, and the paperwork that proves it

WCAG has three levels. A is the floor, AA is what contracts and laws point at, AAA is a goal for chosen criteria rather than a whole product. Target WCAG 2.2 level AA and say so in writing.

The document buyers ask for is an ACR, an accessibility conformance report, written on a VPAT template. Every criterion gets one of four verdicts.

| Verdict | Meaning |
|---|---|
| Supports | Meets the criterion with no known defects |
| Partially Supports | Meets it in places, with the gaps described |
| Does Not Support | Fails, with the barrier named plainly |
| Not Applicable | The product has no content of that kind |

Marking "Supports" on every row of an untested product is not optimism. It is a written representation to a buyer and, under EN 301 549 in Europe or the US Department of Justice rule for public bodies, to a regulator. Partially Supports with an honest remark and a remediation date beats a clean sheet that collapses in the first demo.

### The shortcut that makes it worse

Overlay widgets promise one line of JavaScript and instant compliance. They cannot repair semantics they did not author, they routinely break screen reader behaviour that already worked, and firms using them have been sued at a higher rate than firms with no overlay at all. Put the money into the component library. That fixes the problem once, in the place the problem lives, and it is the version you can honestly write down.
      `,
        [
          q('A team fixes all 340 violations that axe reported across the product. What is a fair statement about accessibility afterwards?', [
            'The product now conforms to WCAG 2.2 level AA by definition',
            'Around a third of real barriers are gone, so manual testing remains',
            'Only colour contrast issues can remain, since axe covers the rest',
            'Conformance can be claimed once the count holds at zero a month',
          ], 1, 'Automated tooling reliably detects only about a third of WCAG failures, so focus order, meaningful alt text and heading structure still need keyboard and screen reader passes.'),
          q('An ACR marks every success criterion as "Supports" for a product nobody has tested with a screen reader. Why is that dangerous?', [
            'Buyers discard any report that lists no Does Not Support rows',
            'The VPAT template forbids marking more than half the rows alike',
            'It is a written claim that buyers and regulators can hold you to',
            'It invalidates the report, because AAA criteria must be listed too',
          ], 2, 'An accessibility conformance report is a formal statement to procurement and to regulators, so an untested claim of support is a representation the organisation can be held to.'),
          q('An audit finds 200 issues that trace back to 12 shared components. What is the most efficient order of repair?', [
            'Fix the components, then re-audit the pages that consume them',
            'Fix page by page, starting with the pages that get most traffic',
            'Fix issues in order of success criterion number, lowest first',
            'Fix only the blockers now and leave shared components for later',
          ], 0, 'Repairing a shared component closes every instance it generates at once, so component level fixes retire far more issues per day of work than patching page by page.'),
        ]
      ),
      ],
      [
      q('A course card that opens a lesson is built as a clickable div with a hover style. What does it need before assistive technology can present it as interactive?', [
        'A background colour meeting 3:1 against the surrounding surface',
        'A title attribute holding the course name and its description',
        'An explicit role, a tab stop, and Enter or Space key handling',
        'An aria-hidden attribute on the decorative thumbnail image only',
      ], 2, 'A generic div reaches the accessibility tree with no role, no tab stop and no key handling, so all three have to be added before it behaves as a control.'),
      q('Which of these would break a modal for a screen reader user even though the dialog looks correct on screen?', [
        'Leaving the background page reachable behind the open dialog',
        'Closing the dialog on Escape as well as on the cancel button',
        'Moving focus to the dialog heading rather than the first field',
        'Rendering the dialog as the last element inside the document body',
      ], 0, 'If the background is not made inert, the virtual cursor wanders out of the dialog into content the user cannot tell is covered by an overlay, which loses their place completely.'),
      q('A dashboard pins a 64 pixel header and a 56 pixel cookie bar. At 400% zoom on a 1280 by 1024 screen, why does it fail Reflow?', [
        'Sticky positioning stops being supported above 300% browser zoom',
        'The two bars leave under 140 CSS pixels of height for the content',
        'Both bars lose contrast once the browser rescales their label text',
        'Horizontal scrolling appears because the bars stretch full width',
      ], 1, 'That viewport reflows to roughly 320 by 256 CSS pixels, so 120 pixels of pinned bars leave about 136 pixels for the actual content, which is a loss of content and function.'),
      q('A product is sold to European and United States public sector buyers. Which conformance target is defensible in the contract?', [
        'Level AAA across the product, because it includes all lower levels',
        'Whatever passing score the automated scanner reports each release',
        'Level A only, because AA applies to government websites alone',
        'WCAG 2.2 level AA, which EN 301 549 and US rules both point to',
      ], 3, 'Public sector procurement in Europe and the United States both reference WCAG level AA, and 2.2 is the current version, while AAA is not expected as a whole product target.'),
      ]
    ),
    chapter(
      'One Product, Many Contexts: Language, Theme, and Platform',
      'Holding one design system together across languages, writing directions, brands and native platforms without quietly forking it into four separate products.',
      [
      lesson('Localisation: Text Expansion, Names, Dates, and Currency', 13, `
The German for "Add to cart" is "In den Warenkorb legen". Eleven characters become twenty two. If your primary button is a fixed 120px pill with a centred label, German splits it, Finnish splits it harder, and Japanese leaves it looking half empty. None of that is a translation bug. It is a layout that assumed English.

### Budget for expansion before anything is translated

Expansion is not a flat percentage. Short strings swell the most, because there is nothing to average against.

| English source | Expect up to |
|---|---|
| 1 to 10 characters | 200% to 300% |
| 11 to 20 characters | 180% |
| 21 to 30 characters | 160% |
| 31 to 50 characters | 140% |
| over 70 characters | 130% |

So a 7 character "Sign up" needs room for roughly 21, while a 60 character paragraph needs about a third more. Size buttons to hug their label with a min-width, let labels wrap to a second line rather than truncate, and never bake text into a PNG.

Pseudo-localisation finds most of this on day one, with no translator involved:

\`\`\`text
source   Save changes
pseudo   [Šàŭé çhàñĝéš ~~~~~~~~~~~]
\`\`\`

The accents prove the font actually has the glyphs. The tildes pad the string to a worst case length. The brackets show you exactly where it clips. Anything still rendering as plain ASCII was never externalised, and it stands out on the screen like a missed patch of paint.

### Names are not first plus last

A required "First name" and "Last name" pair looks harmless and blocks real people. Many Indonesians use a single name, so a mandatory surname field forces them to type a full stop or repeat themselves. Spanish speakers often carry two surnames, so splitting Ana Garcia Lopez on the last space files her under Lopez when her family calls her Garcia. Japanese order puts the family name first, so a greeting assembled as given plus family reads backwards.

One "Full name" field, stored as typed, solves all three. If you want a friendly greeting, ask a separate optional question: "What should we call you?" Store the answer. Do not parse the name.

### Dates, numbers and money

03/04/2026 is 3 April in London and 4 March in Chicago. Never format by hand.

\`\`\`js
const d = new Date('2026-04-03T09:30:00Z');

new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(d);
// '3 April 2026'
new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(d);
// '3. April 2026'

new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(1234.5);
// '1.234,50 €'
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(1234.5);
// '€1,234.50'
\`\`\`

Look at the last two. Same amount, same currency, symbol on opposite sides and the separators swapped. Locale controls the shape, the currency code controls the symbol, and they are separate inputs. Changing the price itself is a pricing decision that needs a product owner, not a formatter.

### Plurals are grammar, not concatenation

"You have " + count + " items" is broken across most of the world. Polish has four plural categories, Arabic has six, Japanese has one. String joining cannot express that. Use an ICU message and let the translator supply the categories their language needs:

\`\`\`text
{count, plural,
  =0 {No courses yet}
  one {# course in progress}
  other {# courses in progress}}
\`\`\`

The same rule applies to any sentence you were about to assemble from two halves. A translator handed a fragment cannot see where it lands, and the word order they need may put your fragment first.

### The mistake

Sorting names with a plain string comparison. In Swedish, "ä" sorts after "z"; the default JavaScript sort drops it next to "a" and a Swedish user sees a list that looks shuffled. \`new Intl.Collator('sv').compare\` fixes it in one line.

The second mistake is handing over a spreadsheet of strings with no screenshots. A translator who sees the word "Home" alone cannot tell whether it means a house or the start screen, and about half the time the guess is wrong.
      `,
        [
          q('Which button specification is most likely to survive translation into German and Finnish?', [
            'A fixed width button whose label truncates with an ellipsis',
            'A fixed width button whose font size shrinks until it fits',
            'A button that hugs its label with a min-width and can wrap',
            'A button whose label is a pre-rendered image asset per locale',
          ], 2, 'Short English labels can expand by 200% to 300%, so the only reliable approach is to let the button size itself from the translated string and allow a second line rather than clipping or shrinking the text.'),
          q('Why is building a label as \'You have \' + count + \' items\' unsafe once the product is translated?', [
            'Languages differ in how many plural forms they need, so one joined template cannot serve them',
            'The count must be run through Intl.NumberFormat before it is shown',
            'Concatenation renders more slowly than an ICU message at runtime',
            'Translators cannot see the numeric value while they are working',
          ], 0, 'Polish has four plural categories and Arabic has six, so a single concatenated sentence cannot express the forms those languages require, which is exactly what an ICU plural message exists to handle.'),
          q('A sign up form requires separate First name and Last name fields, both mandatory. Which user does this block?', [
            'A user in the Netherlands, because \'van der\' is a name particle',
            'A user in Japan, because the given name is displayed second',
            'A user in France, because accented characters need their own field',
            'A user in Indonesia who has a single name and no surname at all',
          ], 3, 'Mononyms are common in Indonesia, so a mandatory surname field forces people to invent a value, which is why a single full name field stored exactly as typed is the safer design.'),
        ]
      ),
      lesson('Right to Left: Mirroring a Layout Without Breaking It', 12, `
A team adds \`dir="rtl"\` to the html element, ships Arabic, and the layout mirrors on the first try. Then the reports arrive. The back arrow points right, away from the page it returns to. The video scrubber fills from the wrong end. And a support screenshot shows the phone number +971 4 555 1234 with its country code stranded at the wrong end of the line.

### Direction is a property of content, not a stylesheet toggle

Set \`dir\` on the html element and the browser flips block direction, the inline flow of text, and the order of anything laid out with normal flow, flexbox or grid. What it cannot know is which of your icons carry meaning about direction.

| Mirrors | Stays exactly as it is |
|---|---|
| Back and forward arrows | Play, pause, fast forward |
| Chevrons in lists and breadcrumbs | Checkmark, close, search, trash |
| Progress bars and sliders | Clock faces and analogue dials |
| Undo and redo | Brand logos and wordmarks |
| Indentation and tree lines | Code, file paths, URLs |

Media transport controls do not mirror because they map to a physical tape moving one way, not to reading order. Clocks do not mirror because a clock is the same object everywhere. Get this backwards and you flip your own logo, which is the most visible localisation bug there is.

### Logical properties do the work for you

Broken, because the direction is baked in:

\`\`\`css
.alert {
  padding-left: 40px;
  border-left: 3px solid;
  text-align: left;
}
.alert__icon { position: absolute; left: 12px; }
\`\`\`

In Arabic the icon sits on the left while the text is right aligned, and the padding protects an empty edge.

Fixed:

\`\`\`css
.alert {
  padding-inline-start: 40px;
  border-inline-start: 3px solid;
  text-align: start;
}
.alert__icon { position: absolute; inset-inline-start: 12px; }
\`\`\`

\`start\` and \`end\` resolve against the current direction, so one rule serves both. The same pattern covers \`margin-inline\`, \`inset-inline\` and \`border-start-start-radius\`. Grep the codebase for \`left:\`, \`right:\`, \`margin-left\` and \`padding-right\`, and you will find nearly every RTL defect before a translator is hired.

### Bidi, the part that surprises everyone

Numbers, Latin words and URLs keep left to right order even inside an Arabic sentence. Mixing directions makes the browser run the Unicode bidirectional algorithm, and when a run of neutral characters (spaces, punctuation, brackets) sits between two directions, it has to guess which side they belong to. That is why a trailing full stop jumps to the front of a line, and why a username like ali_92 renders with its underscore in a place nobody expects.

Isolate any string whose direction you do not control:

\`\`\`html
<p>تم رفع الملف بواسطة <bdi>ali_92</bdi>.</p>
\`\`\`

\`<bdi>\` isolates the run so the neutral characters around it resolve against the paragraph rather than against the inserted text. Apply it to every user supplied value: names, filenames, search terms, tags, comment bodies.

### Test before a single string is translated

Force \`dir="rtl"\` on the html element and leave all the copy in English. The result is unreadable and perfect for finding faults: anything still pinned to the left, any icon pointing the wrong way, any tooltip or dropdown that now opens off screen. Ten minutes of pseudo-RTL catches most of what would otherwise arrive as bug reports in week one of the Arabic launch.

### Scrollbars, shadows and the small stuff

Horizontal scroll position starts at the right, so a carousel that programmatically sets \`scrollLeft = 0\` jumps to the wrong card. Directional shadows that suggest a light source from the top left should stay put, because the light source is not a reading convention. Charts with a time axis usually keep time running left to right, since the convention travels with the data, but the axis labels and legend still mirror.

### The mistake

Mirroring in Figma by flipping the whole frame horizontally. The arrangement mirrors correctly, and so does every logo, screenshot, digit and letter on it. Mirror the arrangement, then walk the icon set one by one and make a decision for each.
      `,
        [
          q('Which icon should keep its original orientation when the interface switches to right to left?', [
            'The back chevron in the navigation bar',
            'The play button on the video player',
            'The indent control in the text editor',
            'The forward arrow in a breadcrumb trail',
          ], 1, 'Media transport controls map to a tape moving in one physical direction rather than to reading order, so play, pause and fast forward stay put while anything expressing reading order mirrors.'),
          q('A card uses padding-left: 40px and border-left: 3px to make room for an icon. What happens in Arabic, and what fixes it?', [
            'It mirrors on its own, because dir=rtl rewrites left into right',
            'It mirrors, but the border colour must be redeclared per direction',
            'It stays put, and setting direction: rtl on the card moves both',
            'It stays put, and padding-inline-start plus border-inline-start fix it',
          ], 3, 'Physical properties like padding-left never respond to the document direction, so the padding and border stay on the wrong edge until they are rewritten as logical properties that resolve against start and end.'),
          q('A username inside an Arabic sentence renders with its trailing full stop at the wrong end of the line. What is going on?', [
            'Neutral characters resolved against the wrong run, so isolate it with bdi',
            'The font is missing Arabic glyphs, so the fallback reorders the string',
            'The username was translated and lost its own direction attribute',
            'The paragraph needs text-align: right rather than text-align: start',
          ], 0, 'Punctuation and spaces are direction neutral, so the bidirectional algorithm attaches them to whichever run it infers, and wrapping the unknown value in a bdi element isolates it so the neutrals resolve against the paragraph.'),
        ]
      ),
      lesson('Dark Mode and Multi-Brand Theming Through Token Tiers', 14, `
Pure white on pure black is 21:1, comfortably past every WCAG threshold, and it is one of the worst choices you can make. On an OLED panel the white glyphs bloom into the black, and for readers with astigmatism that halation makes body text physically tiring to hold. It is why the Material dark surface is #121212 rather than #000000, and why Apple's dark backgrounds live in the same neighbourhood.

Dark mode is not an inversion. It is a second set of decisions.

### Four things that do not survive a straight invert

| Light mode | Naive invert | What actually works |
|---|---|---|
| #FFFFFF surface | #000000 | #121212, lifting for elevation |
| Brand blue #0B5FFF at 4.6:1 | Same blue, about 2.3:1 | #7EA6FF, about 8:1 |
| Drop shadow for elevation | Invisible on dark | Raise the surface lightness |
| A PNG illustration on white | Still a white box | SVG using currentColor |

Saturated colour is the trap. A blue that reads as calm on white vibrates on a dark surface, and it usually fails contrast too, because contrast now depends on lightness running the other way. Every accent needs a dark variant that was measured, not eyeballed.

Elevation in the dark is expressed as light. The Material overlay table is a sound default:

\`\`\`text
0dp    #121212         base surface
1dp    +5%  white      cards
4dp    +9%  white      app bar
8dp    +12% white      menus, bottom sheets
24dp   +16% white      dialogs
\`\`\`

### Three tiers, and the one rule that keeps them honest

Primitives feeding semantics is familiar ground. The tier teams skip is the component tier, and it is what stops a theme from forking.

\`\`\`json
{
  "primitive": { "blue-500": "#0B5FFF", "blue-200": "#7EA6FF", "grey-950": "#121212" },
  "semantic":  { "surface-base": "{grey-950}", "action-primary": "{blue-200}" },
  "component": { "button-primary-bg": "{action-primary}", "card-bg": "{surface-base}" }
}
\`\`\`

The rule: **a component token may reference a semantic token and never a primitive.** Break it once and the damage stays invisible until the second theme arrives.

Broken:

\`\`\`css
.btn--primary { background: var(--blue-500); }
\`\`\`

That button is now welded to one brand and one mode. Fixed:

\`\`\`css
.btn--primary { background: var(--button-primary-bg); }
\`\`\`

Now two brands times two modes is four small files that redefine the semantic layer only. The primitive palette can grow freely, the component layer never changes, and a new brand costs a day rather than a fork of the component library.

### The combinatorics people meet too late

Two brands and two modes is four themes. Add a high contrast mode and it is six. If components point at primitives, all six need their own component definitions, and every component you add after that multiplies by six forever. If components point at semantics, you define the new component token once and all six themes inherit it.

The opposite failure is just as expensive: one token per component property. \`card-header-padding-top\` is not a design decision, it is a spacing value that belongs in the component. Tokenise what a theme would actually change, and leave the rest alone. A system with 4,000 tokens is not more expressive than one with 400, it is just unsearchable.

### Test the theme, not the palette

Contrast holds per pair, so a token swap can pass on paper and fail on screen. Check the combinations that exist in the product: disabled text on a raised surface, a focus ring against the darkest and lightest surfaces, a selected row behind a hover state. Those are the pairs that break, and no palette-level check will catch them.

### The mistake

Wiring theme selection to \`prefers-color-scheme\` alone with no in-product override. Plenty of people run their phone in dark mode permanently and still want a light document editor at midday in the sun. Read the system preference as the default, store an explicit choice the moment someone makes one, and apply it before first paint or the page flashes the wrong theme on every load.
      `,
        [
          q('Brand blue #0B5FFF passes at 4.6:1 on white. What happens when that same value is reused on a #121212 surface?', [
            'Contrast improves, because dark surfaces raise the measured ratio',
            'Contrast is unchanged, since the ratio is a property of the colour',
            'Contrast improves a little, though the colour looks less saturated',
            'Contrast falls to roughly 2.3:1, so a lighter tint has to replace it',
          ], 3, 'Contrast is computed between two luminances, so a mid dark blue that separates well from white sits very close to a near black surface and has to be lightened for dark mode.'),
          q('Why must a component token reference a semantic token instead of pointing straight at a primitive?', [
            'Primitives are renamed more often, so references to them go stale',
            'A theme swaps the semantic layer, so a primitive reference skips it',
            'Build tooling cannot resolve a primitive reference from a component',
            'Primitives carry no contrast metadata, so accessibility checks fail',
          ], 1, 'Themes are implemented by redefining the semantic layer, so a component wired directly to a primitive keeps the same value in every brand and mode and has to be forked for each one.'),
          q('A dialog looks flat in dark mode even though its drop shadow is defined correctly. What is the right fix?', [
            'Increase the shadow blur and opacity until the edge becomes visible',
            'Reduce the dialog opacity so the layer beneath it shows through',
            'Raise the surface lightness, because elevation reads as light here',
            'Darken the page behind it so the shadow has something to fall on',
          ], 2, 'A shadow works by darkening a light surface, which has almost no effect against a near black page, so dark themes express elevation by lifting the surface with a white overlay instead.'),
        ]
      ),
      lesson('iOS, Android, and Web: When to Follow the Platform and When Not To', 13, `
A team builds one design for iOS, Android and web and calls the pixel identical result a win. Three weeks after launch, Android users swipe from the left edge to go back and open a drawer instead, iOS users cannot find account settings because it lives in a hamburger menu they have no habit of opening, and a web thread asks why the browser back button logs them out.

None of those are visual bugs. They are the same decision made wrong three times.

### The line: the platform owns the mechanics, you own the content

| Follow the platform | Keep your own |
|---|---|
| Back behaviour and system gestures | Colour, type scale, spacing, tone |
| Primary navigation pattern | Your components: cards, charts, editors |
| Date pickers, share sheets, permission prompts | Empty states, onboarding, illustration |
| Text fields, keyboard type, autofill | Layout inside your own screens |
| Haptics, dynamic type and font scale | Iconography on your product surfaces |

The reasoning is simple. Anything a user learned from the operating system is a habit you cannot retrain, and anything they learned from you is yours to define. A custom date picker is almost always a downgrade, because the system one already supports autofill, voice control, screen readers and the user's own calendar settings.

### Concrete deltas that bite

\`\`\`text
Minimum target       iOS 44x44 pt                  Android 48x48 dp
Back                 edge swipe plus nav chevron   gesture or button, must be handled
Destructive confirm  action sheet, red at the top  dialog, confirm on the right
Type scale           Dynamic Type up to AX5        font scale up to 200%
Tabs                 bottom tab bar, 5 maximum     bottom nav 3 to 5, or a nav rail
\`\`\`

Font scale is the one that quietly breaks everything. A card specified as \`height: 88\` looks perfect in the simulator and clips its second line the moment someone with low vision turns text up. Use a minimum height and let content push, everywhere, with no exceptions.

Gestures come second. Android predictive back starts from either screen edge, so an edge anchored carousel that responds to horizontal swipe will fight the system and lose. Inset the swipe region, or give the control a visible affordance instead.

### The web is a platform, not a fallback

Do not port a bottom tab bar onto a 1440px desktop screen. Do not fake native page transitions in a browser. And every state a user can reach needs a real URL, because the browser back button is a system gesture too. An app that swallows it produces exactly the confused support thread above.

### Maintaining this without three design files

One spec, plus a delta list. The screen gets designed once and the differences are written down as rules:

\`\`\`text
Screen: Course detail
  Shared     hero, progress ring, lesson list, primary CTA
  iOS        back chevron top left, share via the system activity sheet
  Android    up arrow top left, share via intent chooser, handle system back
  Web        breadcrumb instead of back, copy link button, route /courses/:id
\`\`\`

Four artefacts collapse into one plus a short table, and the table is a thing a reviewer can actually check line by line. It also survives a redesign, because the deltas rarely change even when the visuals do.

### When to break the platform on purpose

There are real cases. A drawing app overrides edge gestures because the canvas needs the whole screen. A keyboard heavy tool keeps its own shortcut scheme across platforms because muscle memory travels with the user, not the device. The test is whether the override buys the user something they cannot get otherwise. "It matches our Figma file" does not qualify.

### The mistake

Using "identical on every platform" as the QA criterion. It sounds like consistency and it is the opposite: every platform inherits the conventions of whichever one the designer used most, and the other two ship an app that feels subtly wrong in a way users report as slow or clunky without ever naming the cause.
      `,
        [
          q('Which of these should follow the platform convention rather than your own design system?', [
            'The date picker used to choose a course start date',
            'The colour and type scale used across your screens',
            'The layout of the hero area on a course detail page',
            'The illustration shown in an empty search result state',
          ], 0, 'System pickers arrive with autofill, voice control, screen reader support and the user\'s own calendar settings already working, so replacing one with a custom control almost always removes capability.'),
          q('A card is specified as height: 88 and looks correct in the simulator. Which user reports it as broken, and why?', [
            'A user on a small phone, because the card overflows the viewport',
            'A user on a tablet, because the card stretches and reads as empty',
            'A user at 200% font scale, because the second line gets clipped',
            'A user in dark mode, because the card border loses its contrast',
          ], 2, 'Both platforms let people enlarge text well beyond the default, so a fixed height container cuts off the extra lines and the fix is a minimum height that lets content push the box taller.'),
          q('A web app renders every screen at the same URL. What breaks first, and why does it matter?', [
            'Analytics cannot fire page views, so the funnel data goes missing',
            'Browser back leaves the app, since no history entry was ever created',
            'Search engines cannot index it, so organic traffic never materialises',
            'The service worker cannot cache it, so offline mode stops working',
          ], 1, 'The back button is a system gesture on the web in the same way an edge swipe is on a phone, so an app with no history entries throws the user out of the product when they use it.'),
        ]
      ),
      ],
      [
      q('Your product has no translations yet, but you want to de-risk localisation now. What gives the most signal for the least effort?', [
        'Hire one Arabic translator and fully localise a single key screen',
        'Replace all body copy with Lorem Ipsum and inspect the line lengths',
        'Run a contrast audit across every theme in both light and dark mode',
        'Run pseudo-localisation and force dir=rtl with the copy still in English',
      ], 3, 'Padded accented strings expose clipping and unexternalised text while forced right to left exposes every hardcoded left, so both faults surface before any translation budget is spent.'),
      q('A team supports two brands and two modes, and their buttons reference primitive colour tokens directly. What is the cost of adding a third brand?', [
        'Every component needs fresh definitions, because none of them theme',
        'Only the primitive palette grows, so the work sits in one small file',
        'Contrast has to be retested, but the component layer stays untouched',
        'The semantic layer is duplicated, while the components keep working',
      ], 0, 'A component pinned to a primitive ignores the semantic layer that themes redefine, so each brand and mode combination requires its own copy of every component definition.'),
      q('Which difference is a legitimate reason to diverge from a single shared design spec?', [
        'Marketing prefers a slightly different accent colour on Android',
        'The iOS engineer finds the shared empty state harder to build',
        'Android has to handle system back, which iOS expresses differently',
        'The web team wants larger spacing so the page feels less dense',
      ], 2, 'System navigation is a habit the operating system taught the user, so it belongs in the per platform delta list, while brand colour, spacing and build convenience are not reasons to fork a spec.'),
      q('A German user sees prices rendered as \'€1,234.50\' instead of \'1.234,50 €\'. Which part of the setup is wrong?', [
        'The currency code, which should be a locale specific symbol',
        'The locale given to the formatter, which is still set to en-US',
        'The price data, which needs converting before it gets displayed',
        'The font, which has no glyph for the German decimal comma',
      ], 1, 'The currency code only chooses the symbol, while separator style and symbol placement come from the locale, so passing de-DE rather than en-US produces the grouping, comma decimal and trailing symbol a German reader expects.'),
      ]
    ),
    chapter(
      'Above the Screen: Strategy, Ethics, and Design at Scale',
      'The work that decides which interfaces get made at all, who they serve, and how a design practice holds its quality across many teams and several years.',
      [
      lesson('Design Strategy: Choosing What Not to Build', 13, `
A product team opened the year with 34 roadmap items and shipped 9 of them. The other 25 were not free. Each had been written up, estimated, argued over in three meetings and drawn in Figma before it quietly died. Roughly four months of the team's year went into work no user ever saw.

### A roadmap of requests is an inbox, not a strategy

Strategy is the set of things you have decided not to do, written down where people can see it. Everything else is a backlog with ambition. The first move is to stop reading requests as features and start reading them as evidence of an outcome someone wants.

| Request | Outcome underneath | Decision |
|---|---|---|
| "Add a study streak" | Learners lose momentum in week two | Yes, but as resumable progress, not a streak |
| "Export the catalogue to CSV" | Ops reconciles enrolments by hand | Yes, and retire the manual report |
| "Add a discussion forum" | Learners feel alone | No this year, moderation costs a full person |
| "Dark mode" | Two enterprise buyers asked in sales calls | No, revisit if it blocks a signed deal |

The middle column is where the work is. Two requests that look unrelated often share one outcome, and one build serves both.

### Every shipped screen bills you forever

\`\`\`text
Feature: offline video download
Build             3 weeks of design plus engineering
Then, every year:
  support articles and macros       ~4 hours per quarter
  accessibility audit rows          +9 criteria across 2 new screens
  localisation strings              31 strings x 7 languages
  release regression matrix         +2 devices x 4 OS versions
  system work                       1 new component, 3 variants
\`\`\`

A feature is not three weeks. It is three weeks plus a small permanent tax, paid every year by people who were not in the room when you decided.

### Scoring, and the place it lies to you

RICE multiplies reach by impact by confidence, then divides by effort. Run it on four candidates for a course platform.

| Candidate | Reach per quarter | Impact | Confidence | Effort | Score |
|---|---|---|---|---|---|
| Study streaks | 40,000 | 0.5 | 0.5 | 3 weeks | 3,333 |
| Certificate sharing | 8,000 | 1 | 0.9 | 2 weeks | 3,600 |
| Offline video | 12,000 | 1 | 0.6 | 6 weeks | 1,200 |
| Bulk enrolment for teams | 900 | 3 | 0.8 | 5 weeks | 432 |

Streaks and certificate sharing win by a factor of eight. Now add the strategy: next year's revenue is meant to come from selling seats to companies. Bulk enrolment is bottom of the score and top of the plan, because reach counts the audience you already have and cannot see a market you have not entered yet.

Confidence is the other soft spot. It is the only input a person can quietly set to 0.9 because they like their own idea. Make it cite something: a test result, a support volume, a signed contract. No evidence means 0.3.

### Kill criteria, written before the build starts

\`\`\`text
BET: bulk enrolment for teams
We believe   companies give up at the point of adding 40 learners by hand
Measured by  trial to paid on team plans, currently 6%
Success      12% or better within 8 weeks of launch
Kill         under 8% at 8 weeks, or fewer than 5 accounts using it twice
Reviewed     8 weeks after launch, date in the calendar today
\`\`\`

Without the kill line a weak feature never dies. It gets a redesign, and then the redesign gets a redesign, and three years later it is still on the settings page consuming a QA row.

### The mistake

Saying no by not replying. An unanswered request does not disappear. It gets asked again in a louder room, and arrives back as a decision made without you. Publish the no list with a reason and a revisit date beside each item. "No, because moderation needs a full time hire we do not have, revisit in Q3" ends an argument. Silence extends it forever.
      `,
        [
          q('RICE ranks study streaks and certificate sharing far above bulk enrolment, but next year\'s revenue depends on selling seats to companies. Why does the score mislead here?', [
            'Reach counts only the audience you already have, so it cannot value a new market',
            'Effort estimates are unreliable this early, which makes the whole ranking noise',
            'Impact belongs on a scale of 1 to 10 rather than on fractional multipliers',
            'Confidence should be left out of the formula when comparing unfamiliar work',
          ], 0, 'Reach is measured against the current user base, so a bet aimed at customers you do not have yet always scores low even when it carries the strategy.'),
          q('A team estimates a feature at three weeks and treats that as the cost. What recurring cost does the ledger add on top of the build?', [
            'The design tokens will need renaming when the component library updates',
            'A yearly tax in support content, audit criteria, translation and regression testing',
            'Engineering estimates for this kind of work run short by about forty percent',
            'The queue behind it moves back by the same three weeks of calendar time',
          ], 1, 'Shipping adds permanent obligations such as support articles, extra accessibility criteria, strings in every language and more rows in the regression matrix, and those repeat every year the feature exists.'),
          q('A request for a discussion forum is declined internally but the requester is never given an answer. What follows?', [
            'The research that justified the decision gets lost in the backlog',
            'The backlog grows until nobody can score any item accurately',
            'Engineering builds a partial version to unblock its own roadmap',
            'It returns in a louder room and gets decided without the design team',
          ], 3, 'An unanswered request is not a closed one, so it gets escalated until someone else decides it, which is why the no list needs a published reason and a revisit date.'),
        ]
      ),
      lesson('Influence Without Authority: Getting the Decision Made', 13, `
The best research deck in the company sat in a shared drive for nine months. It was rigorous, well argued and beautifully made. The decision it recommended was taken in a corridor by two people who had never opened it.

### Decisions are made before the meeting

A design review with nine attendees is not where minds change. By the time everyone is in the room most people have arrived with a position, and a room full of positions produces discussion, not a decision.

Pre-wire it. Two or three short conversations beforehand, one per person who can approve or block, each asking the same question: "here is where I am heading, what would make this a no for you?" You hear the real objection privately, in plain language, in a form nobody says out loud in front of their director. Then you fix it, or you answer it in the first two minutes of the review rather than the last.

### Speak in the currency of whoever decides

The same design carries a different argument for each person in the room.

| Who | What they protect | The line that lands |
|---|---|---|
| Engineering lead | The quarter, and unplanned work | "This removes two of the four states the form handles" |
| Product manager | The metric on their goal sheet | "Drop off at step 3 is 34%, this targets step 3" |
| Support lead | Ticket volume and handle time | "Half the certificate tickets start on this screen" |
| Legal or privacy | Exposure and defensibility | "Refusing takes one click, same as accepting" |
| Finance or the CEO | Revenue, cost and risk | "Three named enterprise deals stall here" |

None of that is spin. It is one change, described in the terms of the person being asked to pay for it.

### Bring options, not a design

Broken:

\`\`\`text
"Here is the new onboarding. I think we should build it."
\`\`\`

Fixed:

\`\`\`text
Problem    58% of new accounts never finish a first lesson.
Option A   Cut sign up to email plus one goal question. 1 week, lowest risk.
Option B   Add a guided first lesson straight after sign up. 3 weeks, best expected lift.
Option C   Do nothing, revisit after the pricing change lands.
Recommend  B, because the drop sits at the first lesson, not at sign up.
Needed     A decision by Friday, or engineering starts B without QA cover.
\`\`\`

Options plus a recommendation give the decider something to do. A single design gives them a choice between approving and being difficult, and some people take the second just to prove the meeting was necessary.

### Match the weight of the argument to the door

A change you can undo next week deserves a day of thought and a feature flag. A change you cannot undo deserves the heavy evidence. URLs customers have bookmarked, a pricing page, a data model that will hold three years of records, an email going to 200,000 addresses: those are one way doors. Spending two weeks of research on an empty state illustration while the URL scheme gets decided in a stand up is a common and expensive inversion.

### Write down what was decided

\`\`\`text
DR-014   Certificates move to Profile
Decided  2026-03-11 by Priya (PM), with Sam (engineering) and design
Because  sharing traffic arrives on profile links, not course pages
Rejected keeping a duplicate entry under Courses, two sources of truth
Revisit  if in-product searches for "certificate" pass 400 per week
\`\`\`

Six lines, written the same day. Without them the same argument returns every quarter with new people in the room, and the person who remembers loudest wins.

### The mistake

Arguing quality. "This design is better" cannot be checked by anyone, so it becomes a contest of confidence and the most senior confident person takes it. Attach the claim to something falsifiable: a number, a support queue, a named account, a legal requirement. Then you are not asking to be trusted. You are asking to be checked.
      `,
        [
          q('A designer presents a rebuilt onboarding flow to nine stakeholders seeing it for the first time, and the meeting ends with no decision. What went wrong?', [
            'The audience was too large for anyone to read the screens properly',
            'Nine people cannot reach consensus inside a single scheduled hour',
            'Positions form privately, so a cold room debates instead of deciding',
            'The presentation should have opened with the research method used',
          ], 2, 'People arrive at reviews with views already formed, so the objections need to be surfaced and answered in short conversations beforehand rather than discovered live.'),
          q('Which framing is most likely to move an engineering lead who is protecting the current quarter?', [
            '"The current spacing is inconsistent with our documented type scale"',
            '"Five participants told us the screen felt cluttered and busy"',
            '"Every competitor moved to this pattern over the last year"',
            '"This removes two of the four states the form has to handle"',
          ], 3, 'An engineering lead is protecting scope and unplanned work, so the argument that lands is the one showing the change reduces the states they have to build and test.'),
          q('Which change deserves the heaviest evidence before it ships?', [
            'Changing the URL structure that customers have bookmarked and linked to',
            'Swapping the empty state illustration shown on the learner dashboard',
            'Trying a new label on the primary button behind a feature flag',
            'Reordering the three cards that appear on the settings page',
          ], 0, 'URLs live in bookmarks, links and search results outside your control, which makes the change effectively irreversible and therefore worth heavy evidence before shipping.'),
        ]
      ),
      lesson('Dark Patterns and Consent: The Line You Do Not Cross', 13, `
In January 2022 the French regulator fined Google 150 million euros and Meta 60 million euros over one design detail. Accepting cookies took a single click. Refusing them took several. Nothing was hidden and nothing was untrue, and the flow still cost 210 million euros because of where the buttons sat.

### Asymmetry is the tell

Almost every dark pattern reduces to one measurable thing: the path that serves the business is cheaper than the path that serves the person. So count the clicks.

| Pattern | How it looks | The honest version |
|---|---|---|
| Roach motel | Join in one click, cancel by phone on weekdays | Cancel where you subscribed |
| Confirmshaming | "No thanks, I like paying full price" | "No thanks" |
| Sneak into basket | Insurance pre-added at checkout | Offered, unticked, priced clearly |
| Trick question | "Untick if you do not want to not receive email" | "Email me about new courses" |
| Nagging | The same upsell modal every session | Ask once, respect it for 90 days |
| Disguised ad | A sponsored card styled as a course card | Same card, labelled, normal contrast |

Broken:

\`\`\`html
<button class="primary">Accept all</button>
<a href="/cookie-settings">Manage preferences</a>
\`\`\`

Fixed:

\`\`\`html
<button class="primary">Accept all</button>
<button class="primary">Reject all</button>
<a href="/cookie-settings">Manage preferences</a>
\`\`\`

Two buttons, same size, same weight, same number of clicks. That is the whole fix, and it is the one most banners still fail.

### Consent has a legal shape, not only an ethical one

Under GDPR consent must be freely given, specific, informed and unambiguous, and withdrawing it has to be as easy as giving it. A pre-ticked box is not consent: the European Court settled that in 2019. Bundling marketing consent into terms you must accept to use the product is not consent either, because it was not freely given. Every one of those is a design decision before it is a legal one.

### Defaults are decisions about people who never change them

Most people never open the settings screen. That makes a default not a starting point but the choice you made on behalf of nearly everyone. Ask one question of every toggle you draw: if this person never opens settings, has the product treated them well? Marketing email on by default, profile public by default, data sharing on by default. Each is a decision made for someone who never saw it.

### The plain words test

Write the flow as a sentence in the user's voice, then read it out loud.

"I clicked buy, and a service I did not choose was already in my basket."

"I wanted to cancel, so I called a number, waited eleven minutes, and was offered a discount three times."

If the sentence would embarrass you in front of the person saying it, the design is the problem, not their comprehension.

### The metric that catches you six weeks later

Persuasion and manipulation both lift the number on launch day. They separate afterwards, in measures nobody puts on the launch dashboard.

\`\`\`text
GUARDRAILS for any opt-in, pricing or checkout change
  unsubscribe rate within 30 days     no worse than baseline + 1 point
  refund and chargeback rate          no worse than baseline
  "how do I cancel" searches          no worse than baseline
  store rating, rolling 30 days       no drop greater than 0.2
  complaints naming the flow          any trend stops the rollout
\`\`\`

Ship the guardrails with the experiment, not after the first bad week.

### The mistake

Treating an A/B win as permission. Confirmshaming reliably lifts opt-in, sometimes by ten points, and reliably returns later as unsubscribes, one star reviews and a support queue that has learned to distrust you. The test measured the click. It never measured what the click cost.
      `,
        [
          q('A cookie banner offers "Accept all" as a button, while refusing requires two more clicks inside a settings sheet. What is the defect?', [
            'The settings sheet is not reachable by keyboard on small screens',
            'Refusal must not cost more effort than acceptance for consent to be free',
            'Every vendor has to be named on the banner before either choice counts',
            'Consent has to be collected again on each visit rather than stored',
          ], 1, 'Consent counts as freely given only when declining is as cheap as agreeing, which is exactly the asymmetry the French regulator fined Google and Meta over.'),
          q('Why is choosing a default setting an ethical decision rather than a neutral one?', [
            'Defaults are hard to change once analytics and reports depend on them',
            'Regulators treat any default setting as equivalent to a pre-ticked box',
            'Most people never change it, so the default is the choice made for them',
            'A wrong default shows up in usability testing as a clear task failure',
          ], 2, 'Since the large majority of people never open settings, whatever the default says is the outcome you have selected on their behalf without them ever seeing the question.'),
          q('An A/B test shows confirmshaming copy lifts newsletter opt-in by ten points. What should be checked before it ships?', [
            'Whether the same effect holds when the test runs a further two weeks',
            'Whether the copy still meets the reading level target for the product',
            'Whether the sample contained enough returning users to be representative',
            'Whether unsubscribes, complaints and store ratings move in the weeks after',
          ], 3, 'The experiment measured the click and not its cost, so guardrail metrics that surface later, such as unsubscribes, complaints and ratings, decide whether the lift was real.'),
        ]
      ),
      lesson('Design Ops: Twelve Designers, One Coherent Product', 13, `
An audit of one product turned up 11 button styles, 4 date pickers and 3 different empty states for the same table. Nobody had been careless. Four squads had each met the problem once, solved it well, and had no forum in which to discover the other three.

### Design ops is the work that is not design

It is the plumbing: how designers are staffed, what they own, when they meet, how a new hire ships something in week one, and how anyone can tell whether the practice is improving. Skip it at three designers and nothing breaks. Skip it at twelve and the product forks quietly along the org chart.

### Team shape decides what stays consistent

| Shape | Designers sit | Good at | Fails at |
|---|---|---|---|
| Embedded | Inside each squad | Domain depth, fast delivery | Anything crossing two squads |
| Centralised | One team taking requests | Consistency, craft standards | Speed, and being treated as a service desk |
| Hybrid | Embedded, plus a shared system and research group | Both, if the shared part is staffed | Everything, if the shared part is one person |

Hybrid is the usual answer and the usual failure. The shared function gets named, given no headcount, and becomes a queue behind one person who now sits in fourteen meetings a week.

Ratios are blunt but useful. Roughly one designer per eight to ten engineers is workable. At one per eighteen the designer stops doing structural work and becomes a ticket queue, producing screens on request and never touching the flow that generates the requests.

### Decision rights on one page

| Decision | Decided by | Consulted |
|---|---|---|
| Add a component to the library | System owner | The squad designer who proposed it |
| Change a core token value | System owner and design lead | Every squad designer, engineering |
| Deviate from the system in one squad | Squad designer, logged as an exception | System owner |
| Levelling and calibration | Design lead | Managers, panel peers |

The third row is the one teams forget. Deviation has to be allowed, or people stop asking and start forking. Allowed and logged beats forbidden and hidden.

### Rituals, and the cadence that makes them stick

\`\`\`text
Weekly     Crit, 60 min, work in progress only, no approvals
Weekly     System office hours, 30 min, open door
Biweekly   Cross squad walkthrough, every team shows one screen
Monthly    Product wide UI audit, one hour, screenshots side by side
Quarterly  Calibration on levels and growth, managers and lead
\`\`\`

The monthly audit is the cheapest of these and the one that finds the four date pickers. One hour, the same pattern screenshotted from every squad onto one board, and duplication stops being arguable.

### Onboarding is a deliverable, not a welcome email

\`\`\`text
Day 1  Accounts, files, tokens installed, staging login working
Day 2  Read the last three decision records, meet the squad engineers
Day 3  Shadow a support call, then a usability session
Day 4  Fix one small real thing, ship it down the normal path
Day 5  Present it at crit
\`\`\`

A designer who ships something small in week one learns how work actually moves while the stakes are tiny. One who spends three weeks reading the design system learns the library and nothing about the pipeline.

### Measure the practice, not the output

| Measure | What it reads as |
|---|---|
| Share of shipped UI built from library components | Whether the system is real or decorative |
| Days from brief to first crit | Whether designers are stuck upstream |
| Exceptions logged per quarter | Where the system is missing something |
| Designers per engineer, by squad | Where quality is about to slip |

Counting files made or screens delivered rewards volume, and volume is exactly what twelve uncoordinated designers already produce.

### The mistake

Hiring a design ops person to fix a strategy problem. If nobody has decided what the product is for, better rituals produce better organised confusion. Design ops multiplies the direction that already exists, including none.
      `,
        [
          q('Four embedded designers each built a different date picker for the same product. What does the topic identify as the cause?', [
            'The designers skipped the weekly crit where duplication normally surfaces',
            'No shared ownership or shared time existed for problems bigger than one squad',
            'The component library lacked documentation for the date picker that existed',
            'File branching was switched off, so nobody could see anyone else\'s work',
          ], 1, 'Embedded designers deliver well inside their own squad but have no forum or owner for cross squad problems, so each solves the same thing independently and correctly.'),
          q('One designer supports eighteen engineers spread across three squads. What does the topic predict happens?', [
            'The designer becomes a ticket queue and stops doing structural work',
            'Craft quality holds steady while delivery slows by roughly a third',
            'Engineers begin writing their own research plans to compensate',
            'The design system grows faster because more squads contribute to it',
          ], 0, 'At that ratio there is only time to produce screens on request, so the designer never gets upstream to the flows that keep generating the requests.'),
          q('Which measure tells you most about the health of a twelve person design practice?', [
            'Number of design files created by each designer every quarter',
            'Average count of finished screens delivered per sprint by the team',
            'Share of shipped interface built from library components rather than one offs',
            'How many crit sessions the whole design team managed to attend',
          ], 2, 'Component adoption shows whether the shared system is genuinely used in production or merely decorative, while counting files or screens rewards volume that uncoordinated teams already produce.'),
        ]
      ),
      ],
      [
      q('A roadmap lists 34 items gathered from sales, support and leadership. What would make it a strategy rather than an inbox?', [
        'Every item carries an owner, an estimate and a target release date',
        'Items are ranked by a scoring model the whole company has agreed on',
        'It gets reviewed every quarter with the leadership team in the room',
        'It states what will not be built this year, and why, beside what will',
      ], 3, 'A strategy is defined by its declared exclusions, because the list of things you have decided not to do is what actually protects the capacity for the things you have chosen.'),
      q('Which pairing of decision weight and evidence matches the chapter\'s advice?', [
        'A reversible change shipped behind a flag, decided in a day on a rough read',
        'An irreversible pricing page change settled inside the weekly design review',
        'A reversible copy tweak held back until a full moderated study finishes',
        'An irreversible URL change delegated to whoever next picks up the ticket',
      ], 0, 'Effort spent gathering evidence should scale with how hard the decision is to undo, so a flagged reversible change can be decided quickly while one way doors get the heavy work.'),
      q('Cancelling a subscription requires a phone call while signing up takes one click. What is the strongest objection in the chapter\'s terms?', [
        'Phone support costs far more per contact than a self serve cancellation',
        'The gap in effort between entry and exit is the defining shape of a dark pattern',
        'People who cancel by phone cannot be surveyed about why they left',
        'Call centre opening hours exclude customers in other time zones',
      ], 1, 'The test for a dark pattern is asymmetry, meaning the route serving the business is made cheaper than the route serving the person, and a one click join with a phone only exit is that asymmetry in its clearest form.'),
      q('Twelve designers work across four squads and the product is visibly drifting apart. Which move addresses the cause named in the chapter?', [
        'Hire a design ops lead and hand them roadmap prioritisation as well',
        'Ask every designer to review the other squads\' files before shipping',
        'Give cross squad problems an owner, shared time and written decision rights',
        'Move all twelve designers into one central team that takes in requests',
      ], 2, 'Drift comes from problems that belong to no single squad having nobody who owns them and no time set aside for them, so naming owners and decision rights is what closes the gap.'),
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
      q('A side drawer is built with `transition: left 280ms linear` and closes with the same 280ms linear curve. It judders on a mid-range Android, and anyone who taps close straight after opening says the drawer keeps arguing with them. Which combination of changes addresses both complaints?', [
      'Keep the left transition but add will-change, ease both directions, and queue the close behind the open',
      'Animate margin-left with ease-out, raise both durations to 400ms, and restart the close from its declared start',
      'Animate transform instead of left, ease-out in and ease-in out at around 200ms, and close from the current value',
      'Animate width with a linear curve, hold both directions at 280ms, and block the close until the open has ended',
    ], 2, 'Animating left forces the browser to recompute layout on every frame and blows the 16.7ms budget on mid-range hardware, so the cheap compositor property transform is the fix; exits should also be shorter than entrances and use ease-in, and an interrupted close has to animate from the drawer\'s current computed position rather than queue behind the opening animation.'),
    q('A support table windows about forty rows into the document at a time out of 12,000, and its Amount column sorts whatever rows are currently loaded. Which pair of problems most needs fixing before launch?', [
      'Row height cannot be set per user, and a sticky header hides the identity column once the table scrolls sideways',
      'Ctrl+F and print no longer find rows that exist, and the sort reports the top of the loaded slice as the top overall',
      'Memory use climbs on every scroll, and the footer count has to be recomputed from the visible rows each time',
      'Hover-only row actions vanish on touch devices, and the sort silently drops rows that fail the current filter',
    ], 1, 'Windowing removes browser find, select-all and print because those rows are not in the document, so a real search field and an export button have to replace what the browser was giving away for free; separately, sorting only the loaded rows hands the user a wrong answer in exactly the shape of a right one, which is why ordering has to happen where the whole set lives.'),
    q('A user ticks Region: DACH on an orders screen. Every other option in the Region group immediately shows a count of 0, while the Status and Channel groups still show believable numbers. What has gone wrong?', [
      'The counts are read from the current page of results rather than from the whole set of matching orders',
      'The groups are combined with OR across groups and AND inside one, so a second region can never add rows',
      'The Region counts ignore the other active filters, so they are computed against the unfiltered orders table',
      'The Region counts are computed with the Region selection applied, and no row can sit in two regions at once',
    ], 3, 'A facet group\'s counts must honour every other active filter while ignoring that group\'s own selection; once the group\'s own selection is included, every unselected option in it correctly reports zero, so the panel looks completely broken while each number in it is technically true.'),
    q('A button shows the word Submit on screen and carries aria-label="Send enrolment form". Screen reader users are fine, but a Voice Control user says "click Submit" and nothing happens. Why does that label cause the failure?', [
      'aria-label replaces the visible text as the accessible name, and voice control matches the name, not the pixels',
      'Voice control matches roles ahead of names, so a button carrying an explicit label is skipped by a spoken command',
      'aria-label is applied only after first paint, so the accessible name is missing at the moment the command is spoken',
      'The visible text stays the name and aria-label becomes the description, so the command matches an empty string',
    ], 0, 'aria-label sits near the top of the name computation order and replaces the visible text entirely, and speech control drives the interface by accessible name, which is exactly why WCAG 2.5.3 Label in Name requires the visible words to appear inside the accessible name.'),
    q('A button\'s CSS reads `background: var(--blue-500)`. The team already ships two brands in light and dark, and is now adding a high contrast mode, taking the total to six themes. Why is that one line so expensive?', [
      'Primitives resolve at build time, so all six themes have to recompile the component library on every change',
      'The primitive palette can no longer grow, so adding a brand renames the values every component already points at',
      'The component is welded to a primitive, so each of the six themes needs its own definition of that component',
      'The blue was measured on light surfaces, so five of the themes must override that contrast pair by pair by hand',
    ], 2, 'A component token may reference a semantic token and never a primitive: pointing at the semantic layer means a new theme is one small file redefining semantics, while pointing straight at a primitive makes every theme carry its own component definitions, and every component added afterwards multiplies by six forever.'),
    q('An A/B test shows that confirmshaming the newsletter opt-out, with "No thanks, I like missing out", lifts sign-ups by ten points. Which result would tell you the lift is manipulation rather than persuasion?', [
      'The variant wins the primary metric in every segment, including people who arrived from an unpaid search result',
      'Unsubscribes within thirty days and support messages naming that flow both move past their agreed baselines',
      'The opt-in rate keeps climbing across all four weeks the experiment is left running against live traffic',
      'Legal signs the wording off, since neither of the two options presented to the user states anything untrue',
    ], 1, 'Persuasion and manipulation both lift the number on launch day and only separate weeks later, which is why guardrails such as unsubscribe rate, refunds, cancel searches and complaints naming the flow have to ship alongside the experiment; a win on the primary metric measured the click and never measured what the click cost.'),
  ],
});
