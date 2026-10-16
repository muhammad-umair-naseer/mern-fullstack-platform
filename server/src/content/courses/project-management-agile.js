import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'project-management-agile',
  title: 'Project Management: Agile, Scrum & PMP Basics',
  category: 'Business',
  level: 'Beginner → Intermediate',
  duration: '6 weeks',
  accent: 'sky',
  coverKey: 'project-management-agile',
  summary:
    'Run projects with confidence: charters, scope, schedules, budgets, risk and communication, then Agile, Scrum and Kanban sprint by sprint, the tools teams use, leading people, and a clear path to CAPM, PMP and PSM I.',
  description:
    'This course is for new and accidental project managers: the team lead, coordinator or founder who suddenly owns a deadline. You learn what makes something a project and how predictive, agile and hybrid lifecycles differ, then start a project properly with a charter and a stakeholder map. You break scope into a work breakdown structure, estimate effort, build a schedule and find its critical path, set a budget and read earned value, and manage risk, quality and communication. The second half covers the Agile Manifesto, Scrum exactly as the Scrum Guide defines it, Kanban flow, and tools such as Jira, Trello and Asana. You finish with leading teams through conflict, closing projects and running retrospectives, and a realistic plan for CAPM, PMP or PSM I based on what PMI and Scrum.org publish, using the PMBOK Guide and the Scrum Guide as your references.',
  chapters: [
    chapter(
      'What Project Management Really Is',
      'Learn what separates a project from everyday operations, what a project manager actually does, how scope, time and cost pull against each other, and how the PMBOK Guide and the Scrum Guide serve as your two main references.',
      [
      lesson('Projects, Operations and Programs', 12, `
Most work in an organisation falls into two kinds. Some of it repeats every day: taking orders, paying salaries, answering customer calls. Some of it happens once to create something new: opening a branch, launching an app, moving the office. The second kind is a project, and recognising the difference is the first skill of project management.

### What makes something a project

The PMBOK Guide, published by the Project Management Institute (PMI), describes a project as a temporary endeavour undertaken to create a unique product, service or result. Two words carry the meaning.

- **Temporary** means it has a definite start and a definite end. The end comes when the objectives are met, or when the project is cancelled because they cannot or should not be met. Temporary does not mean short: building a motorway can take years.
- **Unique** means the output has not been produced in exactly this way before. A bakery in Lahore baking 400 naans every morning is not running a project. The same bakery fitting out a second outlet in DHA is.

A project also has a defined goal, limited resources and some uncertainty, because nobody has done this exact thing in this exact setting before.

### Projects compared with operations

| | Project | Operations |
|---|---|---|
| Purpose | Create something new or change something | Keep the business running |
| Duration | Has a planned end | Ongoing |
| Output | Unique deliverable | Repeated product or service |
| Example in Karachi | Setting up an online ordering website for a pharmacy | Packing and dispatching the pharmacy's daily orders |
| Success measure | Delivered as agreed, benefits realised | Consistent, efficient, reliable output |

The two depend on each other. Projects usually hand their results over to operations. Once the ordering website is live, it becomes part of daily operations and someone keeps it running. A common failure is a project that "finishes" without anyone in operations ready to take over, so the new system quietly dies.

### Programs and portfolios

As organisations grow, projects rarely stand alone.

- A **program** is a group of related projects managed together because coordinating them brings benefits you would not get by running them separately. A telecom company expanding fibre internet across Punjab might run one project per city under a single program, sharing contractors, equipment and lessons.
- A **portfolio** is the full collection of projects, programs and operations an organisation chooses to invest in to meet its strategy. Portfolio managers decide which projects get funded at all.

\`\`\`text
Portfolio: everything the company invests in
  Program: Fibre expansion in Punjab
    Project: Lahore rollout
    Project: Faisalabad rollout
    Project: Multan rollout
  Project: New billing system (stand-alone)
  Operations: Customer support, network maintenance
\`\`\`

You do not need to manage programs or portfolios to start. But knowing they exist explains why your project might be paused, merged or reprioritised by people above you. That decision usually reflects the portfolio, not your performance.

### Spotting projects hidden in your job

Many people already run projects without the label. Ask three questions about any piece of work:

1. Does it have an end point where you can say "done"?
2. Is the result something new for your team or organisation?
3. Does it need coordinating people, money or time beyond normal routine?

If the answer to all three is yes, treat it as a project. A school's annual prize day, migrating a shop's stock records from registers to software, or preparing a factory for an export audit all qualify. Treating them as projects means giving them a clear goal, an owner, a plan and a finish line, instead of squeezing them in around daily work and hoping.

### Why the distinction matters

Operations are managed for efficiency and stability. Projects are managed for delivery under uncertainty. Using operational habits on a project, such as waiting for problems to appear before planning, tends to produce late and over-budget results. Using project habits on operations, such as a kickoff meeting for every routine task, wastes effort. The rest of this course is about managing the first kind of work well.
      `,
        [
          q('According to the PMBOK Guide, which two features define a project?', [
            'It is expensive and involves outside contractors',
            'It is temporary and creates a unique result',
            'It runs for more than one year and has a sponsor',
            'It is ongoing and produces a repeated output',
          ], 1, 'The PMBOK Guide defines a project as a temporary endeavour that creates a unique product, service or result.'),
          q('A Lahore bakery bakes the same naans every morning. Which description fits this work?', [
            'A program, because it repeats',
            'A portfolio, because it earns money',
            'A project, because it has a daily end point',
            'Operations, because it is ongoing and repeated',
          ], 3, 'Repeated, ongoing work that keeps the business running is operations, not a project.'),
          q('What best describes a program?', [
            'Any project that lasts longer than six months',
            'The software used to schedule project tasks',
            'Related projects coordinated together for extra benefit',
            'The daily operations that follow a project',
          ], 2, 'A program groups related projects so that managing them together delivers benefits separate management would miss.'),
        ]
      ),
      lesson('The Project Manager Role and Accidental PMs', 13, `
Ask ten people what a project manager does and you will hear ten answers: makes Gantt charts, chases people, runs meetings, writes reports. All of these happen, but none of them is the core of the job.

### What the role is really for

A project manager is the person assigned by the organisation to lead the team responsible for achieving the project's objectives. The key word is objectives. The project manager is accountable for the whole project coming together, not for doing every task personally. In practice that means:

- Making sure everyone understands what the project must deliver and why.
- Planning the work so it fits the time and money available.
- Removing obstacles and getting decisions made quickly.
- Spotting risks and problems early and acting on them.
- Keeping stakeholders informed and their expectations realistic.
- Closing the project properly and handing over the result.

Much of this is communication. Experienced project managers often say most of their day is spent talking, writing and listening rather than working on plans.

### The accidental project manager

Many people never apply for a project manager job. They become one by accident. A senior developer at a Karachi software house is told to "handle" a client delivery. An HR officer is asked to organise the company's move to a new office. A founder of a small clothing brand finds herself coordinating a photographer, a website developer and a courier company for a launch.

These accidental project managers share some common traps:

| Trap | What it looks like | Better habit |
|---|---|---|
| Doing instead of leading | Fixing tasks yourself while nobody tracks the whole | Block time each day to look at the full picture |
| Plan in your head | Only you know the dates and dependencies | Write the plan down and share it |
| Saying yes to everything | Every new request quietly added | Ask what it changes in time or cost first |
| Avoiding bad news | Hoping a delay will fix itself | Raise problems early with options |
| No clear authority | Unsure who can approve spending | Agree your decision rights at the start |

If you recognise yourself here, you are the audience for this course. The good news is that accidental project managers usually know the subject matter well, which is a real advantage once a few habits are added.

### Authority and influence

Project managers often have limited formal authority. Team members may report to other managers, and you may not control their pay or appraisals. This is normal, especially in what the PMBOK Guide calls matrix organisations, where people work for a functional manager and a project manager at the same time.

Without direct authority, you lead through influence:

1. **Clarity**: people follow someone who knows exactly what is needed.
2. **Reliability**: do what you say you will do, every time.
3. **Respect for others' workload**: ask their manager before booking their time.
4. **Shared credit**: make the team's success visible to leadership.

### Skills that matter most

PMI describes the skills a project manager needs in three groups, often shown as the PMI Talent Triangle. The names have changed over the years, so check pmi.org for the current wording, but the idea is stable:

\`\`\`text
Ways of working     : planning, estimating, agile and predictive methods
Power skills        : communication, leadership, negotiation, empathy
Business acumen     : understanding strategy, value and the wider organisation
\`\`\`

Technical method alone is not enough. A perfect schedule fails if the project manager cannot persuade a busy department head to release a key person for two weeks.

### Project manager compared with other roles

Agile teams add new names. In Scrum there is no "project manager" role at all: the Scrum Guide defines a Product Owner, a Scrum Master and Developers, and the responsibilities a project manager would hold are shared among them. Later chapters cover this in detail. For now, remember that the work of coordinating, planning and communicating still has to happen, whatever the job title says.
      `,
        [
          q('What is a project manager mainly accountable for?', [
            'Personally completing the hardest technical tasks',
            'Approving every expense in the organisation',
            'Writing the company\'s long-term strategy',
            'Leading the team to achieve the project\'s objectives',
          ], 3, 'The project manager leads the team toward the project objectives rather than doing every task personally.'),
          q('An accidental PM keeps the schedule only in her head. What is the better habit?', [
            'Write the plan down and share it with the team',
            'Memorise the plan more carefully each morning',
            'Ask each team member to keep their own private plan',
            'Wait until the client asks for a written schedule',
          ], 0, 'A shared, written plan lets everyone see dates and dependencies and stops the project relying on one person\'s memory.'),
          q('In a matrix organisation, how does a project manager usually get work done?', [
            'By controlling every team member\'s salary',
            'By escalating every request to the chief executive',
            'Through influence, clarity and reliability',
            'By hiring a new team for each project',
          ], 2, 'In matrix organisations team members often report elsewhere, so the project manager leads mainly through influence.'),
        ]
      ),
      lesson('The Triple Constraint and Trade-Offs', 13, `
Every project lives inside limits. You have a certain amount of work to deliver, a certain amount of time, and a certain amount of money. These three, scope, time and cost, are traditionally called the triple constraint, and they pull against each other constantly.

### The three constraints

- **Scope** is the work and the features the project must deliver.
- **Time** is the schedule, including the final deadline and key dates in between.
- **Cost** is the budget: money for people, materials, equipment and services.

Quality sits in the middle, because squeezing any of the three usually shows up as lower quality. Later versions of the PMBOK Guide widened the idea into competing constraints, adding things such as risk, resources and customer satisfaction. The lesson is the same: you cannot change one limit without affecting the others.

\`\`\`text
              Scope
               /\\
              /  \\
             / Q  \\
            /______\\
         Time      Cost

Q = quality, which suffers when the triangle is squeezed
\`\`\`

### How the trade-offs work

Imagine a Lahore restaurant planning to open a second branch in three months with a budget it has already fixed. The owner then asks for an outdoor seating area as well.

| Change requested | What else must move |
|---|---|
| Add outdoor seating (more scope) | More time, more money, or drop something else |
| Open one month earlier (less time) | More money for extra workers, or less scope |
| Cut the budget (less cost) | Smaller scope, longer time, or cheaper materials |
| Keep all three fixed | Quality or team wellbeing takes the hit |

The last row is the dangerous one. When a sponsor fixes scope, time and cost together and then adds work, the project does not magically absorb it. People work late, testing gets skipped, and problems appear after handover.

### Fixed and flexible constraints

A useful conversation at the start of any project is to ask which constraint is the most fixed. Usually one is close to immovable:

1. **Time fixed**: an Eid sale campaign must launch before Eid. Missing the date makes the project worthless.
2. **Cost fixed**: a government grant gives a set amount and no more.
3. **Scope fixed**: a regulatory audit requires every listed item, no exceptions.

Once you know which one is fixed, you know where to look for flexibility when something goes wrong. If the Eid date cannot move, you negotiate scope or spend more. Agile approaches usually fix time and cost per iteration and let scope flex, which is one reason they handle changing requirements well.

### Making trade-offs visible

Project managers should not make trade-off decisions alone and in silence. The job is to show the options clearly and let the person with authority decide. A simple format works:

\`\`\`text
Request: Add outdoor seating to the Gulberg branch
Option A: Add it, opening moves from 1 March to 22 March
Option B: Add it, keep 1 March, hire a second crew (extra cost to be quoted)
Option C: Defer it to a phase two after opening
Recommendation: C, because the opening date is tied to the lease
Decision needed from: Owner, by Friday
\`\`\`

This turns a vague request into a clear choice with consequences. It also protects you later, because the decision and its reasons are written down.

### Common mistakes

- **Promising all three.** Saying yes to more scope with no change to time or cost sets the project up to fail.
- **Hiding the squeeze.** Absorbing extra work quietly makes stakeholders believe it was free, so they ask for more.
- **Ignoring quality.** Delivering on time and on budget with a product that does not work is not success.
- **Forgetting people.** Long-term overtime is a hidden cost that shows up as mistakes, sick days and resignations.

The triple constraint is simple, but using it consistently in conversations is one of the most valuable habits a new project manager can build.
      `,
        [
          q('Which three limits make up the traditional triple constraint?', [
            'Risk, quality and stakeholders',
            'People, tools and processes',
            'Budget, profit and market share',
            'Scope, time and cost',
          ], 3, 'The traditional triple constraint is scope, time and cost, with quality affected when they are squeezed.'),
          q('A sponsor adds features but keeps the deadline and budget fixed. What usually suffers?', [
            'Nothing, if the team is motivated enough',
            'Quality and the team\'s wellbeing',
            'Only the sponsor\'s reputation',
            'The number of stakeholders',
          ], 1, 'When scope grows and time and cost cannot move, the pressure usually lands on quality and the people doing the work.'),
          q('An Eid campaign cannot launch late. Where should the PM look for flexibility?', [
            'In moving the launch date by a week',
            'In hiding the delay from the sponsor',
            'In scope or in spending more money',
            'In skipping the stakeholder updates',
          ], 2, 'When time is fixed, the remaining levers are scope and cost.'),
        ]
      ),
      lesson('The PMBOK Guide and the Scrum Guide as References', 12, `
Project management has its own body of published guidance. Two documents matter most for this course: the PMBOK Guide for project management in general, and the Scrum Guide for Scrum specifically. Knowing what each one is, and what it is not, saves you from both ignoring them and treating them as rule books.

### The PMBOK Guide

PMBOK stands for Project Management Body of Knowledge. The PMBOK Guide is published by the Project Management Institute (PMI), a professional body based in the United States with members and chapters worldwide, including chapters in Pakistan.

Key points about it:

- It describes generally recognised good practice, not one mandatory method.
- It is revised every few years. Older editions were organised around process groups and knowledge areas, such as scope, schedule and cost management. The seventh edition shifted towards principles and performance domains, and PMI has continued to update it since. Check pmi.org for the edition that is current when you read this.
- It covers predictive, agile and hybrid ways of working, not only traditional planning.
- PMI's certification exams, such as CAPM and PMP, draw on it alongside other references. The exam content outlines published on pmi.org say exactly what is tested.

Older terms from earlier editions, such as "the five process groups" (initiating, planning, executing, monitoring and controlling, closing), are still widely used in workplaces and job adverts. You will meet them in this course because they remain a clear way to describe what happens in a project.

### The Scrum Guide

The Scrum Guide is a short document written by Ken Schwaber and Jeff Sutherland, the creators of Scrum. It is free to read at scrumguides.org. The 2020 version was the current official edition at the time of writing; check the site in case a newer one has been released.

Key points about it:

- It defines Scrum completely in under twenty pages.
- It is deliberately minimal. It says what Scrum is, not how to run every meeting.
- It defines three accountabilities (Product Owner, Scrum Master, Developers), five events (the Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective) and three artifacts (Product Backlog, Sprint Backlog, Increment).
- It states that changing Scrum's core design or rules produces something that is not Scrum.

Scrum.org's PSM certifications are based on the Scrum Guide, which makes it essential reading if you plan to take one.

### How the two compare

| | PMBOK Guide | Scrum Guide |
|---|---|---|
| Publisher | Project Management Institute | Ken Schwaber and Jeff Sutherland |
| Scope | All kinds of projects and approaches | One agile framework |
| Length | Several hundred pages | Under twenty pages |
| Cost | Included with PMI membership, otherwise purchased | Free |
| Style | Principles, practices, tools and techniques | Minimal rules, roles, events and artifacts |
| Linked certifications | CAPM, PMP and others | PSM I and others (Scrum.org) |

### How to use them well

Neither document is meant to be followed line by line on day one. A sensible approach for a new project manager:

1. **Read the Scrum Guide in full once.** It is short. Read it again after you have run a few sprints; it will make far more sense.
2. **Use the PMBOK Guide as a reference, not a novel.** Look up a topic, such as risk or stakeholders, when you face it in real work.
3. **Use the exact terms.** In interviews and certification exams, saying "Developers" rather than "the dev team", or "Sprint Review" rather than "demo", shows you know the source.
4. **Adapt with care.** The PMBOK Guide encourages tailoring the approach to the project. The Scrum Guide allows many practices around Scrum but not changes to its core.

\`\`\`text
Weekly study habit for a new PM
Mon: read one PMBOK Guide topic linked to this week's work
Wed: re-read one section of the Scrum Guide
Fri: write three lines on how you applied either one
\`\`\`

### A note on other sources

Many books, blogs and videos summarise these guides, and some are excellent. Others repeat outdated terms, such as "Development Team", a name the 2020 Scrum Guide replaced with "Developers". When a source disagrees with the official guide, the official guide wins, especially for exams.
      `,
        [
          q('Who publishes the PMBOK Guide?', [
            'The Project Management Institute',
            'Scrum.org',
            'The Agile Alliance',
            'The International Standards Office',
          ], 0, 'The PMBOK Guide is published by the Project Management Institute, which also runs the CAPM and PMP certifications.'),
          q('Which list matches the three Scrum accountabilities in the Scrum Guide?', [
            'Product Owner, Scrum Master and Developers',
            'Project Manager, Team Lead and Testers',
            'Sponsor, Scrum Master and Development Team Lead',
            'Product Manager, Agile Coach and Engineers',
          ], 0, 'The Scrum Guide defines exactly three accountabilities: Product Owner, Scrum Master and Developers.'),
          q('When a blog post contradicts the Scrum Guide, which should you trust for an exam?', [
            'The blog post, if it is newer',
            'The Scrum Guide, as the official source',
            'Whichever has more readers online',
            'Neither, since exams use their own definitions',
          ], 1, 'The official guide is the reference that Scrum.org certifications are based on.'),
        ]
      ),
      ],
      [
      q('An HR officer is asked to move the company to a new office by June. How should she treat this work?', [
        'As routine operations needing no plan',
        'As a portfolio decision for the board',
        'As a program because many people are involved',
        'As a project with a goal, owner, plan and end date',
      ], 3, 'The move is temporary and creates a unique result, so it is a project and benefits from a clear goal, plan and finish line.'),
      q('A client asks for extra features. What should the PM do first?', [
        'Show the options and their effect on time and cost',
        'Agree immediately to keep the client happy',
        'Refuse, since the scope was already signed',
        'Ask the team to work weekends without telling anyone',
      ], 0, 'Making the trade-off visible lets the decision maker choose with full knowledge of the consequences.'),
      q('Why is the Scrum Guide worth reading in full early on?', [
        'It replaces the need for any other reference',
        'It contains the full PMP exam question bank',
        'It is short and defines Scrum completely',
        'It is only available to paid members',
      ], 2, 'The Scrum Guide is free, short and is the complete definition of Scrum.'),
      q('What usually happens to a project\'s result after it finishes?', [
        'It is archived and no longer used',
        'It is handed over to operations to run',
        'It becomes a new program',
        'It is returned to the sponsor for approval again',
      ], 1, 'Projects usually hand their deliverables to operations, which keeps them running day to day.'),
      ]
    ),
    chapter(
      'Lifecycles and Ways of Working',
      'Compare predictive, iterative, incremental, agile and hybrid lifecycles, see where each one fits, and learn how to choose and explain an approach that suits your project rather than following fashion.',
      [
      lesson('Predictive Waterfall Lifecycles', 13, `
A project lifecycle is the series of phases a project passes through from start to finish. The oldest and most familiar is the predictive lifecycle, often called waterfall because work flows down from one phase to the next.

### How a predictive lifecycle works

In a predictive lifecycle, the team decides scope, schedule and cost as early as possible and then executes the plan. Each phase finishes, or largely finishes, before the next one starts.

\`\`\`text
Requirements -> Design -> Build -> Test -> Deploy -> Handover
     |            |         |        |        |
  sign-off    sign-off  sign-off sign-off  sign-off
\`\`\`

The sign-offs between phases are often called phase gates or stage gates. At each gate, someone with authority reviews the work and decides whether the project continues, changes direction or stops.

### Where predictive works well

Predictive approaches suit projects where the requirements are clear and stable, and where changing course late is very expensive.

| Project | Why predictive fits |
|---|---|
| Building a house in Bahria Town | Drawings must be approved before construction; moving a wall later is costly |
| Installing a solar system at a textile mill in Faisalabad | Equipment, wiring and permits follow a known sequence |
| Organising a large conference | The venue, date and programme are fixed well in advance |
| Upgrading a hospital's electrical supply | Safety rules require full design before work starts |

In each case, the team knows fairly precisely what the end result should be, and the cost of discovering a change halfway is high.

### Strengths

- **Clear plan from the start.** Sponsors know what they will get, when, and roughly what it will cost.
- **Easy to explain.** Phases and milestones are simple for clients, banks and senior managers to follow.
- **Good for contracts.** Fixed-price contracts and tenders usually need a defined scope, which predictive planning provides.
- **Strong documentation.** Each phase produces records that help with audits, safety and handover.

### Weaknesses

- **Late feedback.** The customer may not see a working result until near the end. If the requirements were misunderstood, the mistake is discovered when it is most expensive to fix.
- **Change is painful.** Every change after sign-off goes through a formal change process and may affect several completed phases.
- **Big-bang risk.** Testing and integration happen late, so problems can pile up just before the deadline.

A classic failure in software projects runs like this: a Lahore company spends months writing a detailed specification for an inventory system, the developers build it exactly to the document, and at the final demonstration the warehouse staff point out that the screens do not match how they actually work. Nobody did anything wrong according to the plan, but the plan was based on assumptions that were never tested.

### Making predictive projects safer

Predictive does not have to mean blind. Experienced project managers add feedback points without abandoning the plan:

1. **Prototypes and mock-ups** during design, so users can react to something concrete.
2. **Early testing of risky parts**, such as a new machine or an unfamiliar integration.
3. **Regular reviews with the customer**, not just at the gates.
4. **Rolling wave planning**, where near-term work is planned in detail and later work is planned at a higher level and refined as you go.

### The language you will hear

Predictive projects use terms you will meet throughout your career and in PMI exams: baseline (the approved version of the scope, schedule or cost plan used to measure performance), phase gate, change control, and sign-off. Learning these words makes it easier to work with engineering firms, government departments and large corporates, many of which still run most projects this way.

Predictive is not old-fashioned or wrong. It is the right choice when you can know the destination in advance and the road is well mapped.
      `,
        [
          q('What is a phase gate in a predictive lifecycle?', [
            'A software tool that blocks late tasks',
            'A review point where someone decides whether to continue',
            'The final payment made to a contractor',
            'A meeting where developers estimate story points',
          ], 1, 'At a phase gate an authority reviews the completed phase and decides to proceed, change course or stop.'),
          q('Which project is the best fit for a predictive lifecycle?', [
            'A new mobile app whose users and features are still unclear',
            'An experimental marketing campaign testing many ideas',
            'A research study whose direction depends on early findings',
            'Constructing a house from approved architectural drawings',
          ], 3, 'Construction from approved drawings has clear, stable requirements and costly late changes, which suits predictive planning.'),
          q('What is the main weakness of a strict predictive approach?', [
            'Customers often see working results only near the end',
            'It cannot produce any documentation',
            'It does not allow a project budget',
            'It requires daily stand-up meetings',
          ], 0, 'Late feedback means misunderstandings are discovered when they are most expensive to correct.'),
        ]
      ),
      lesson('Iterative and Incremental Delivery', 13, `
Between strict waterfall and fully agile ways of working sit two ideas that are easy to confuse: iterative development and incremental delivery. Most modern approaches, including Scrum, combine them. Understanding each one separately helps you see why.

### Iterative: improve through repeated cycles

An iterative approach builds a rough version of the whole solution, gets feedback, and then refines it in repeated cycles. Each cycle improves the same thing.

Imagine designing a new menu for a Karachi café. Iteratively, the team would:

1. Sketch a full rough menu with every section.
2. Show it to regular customers and staff.
3. Rework prices, wording and layout based on what they say.
4. Repeat until the menu feels right.

The whole menu exists early, but it gets better with each pass. Iteration is about learning and reducing uncertainty in the design.

### Incremental: deliver in usable pieces

An incremental approach delivers the solution in pieces, each one finished and usable, adding to what came before.

For the same café, incrementally might mean launching breakfast items first, then adding lunch two months later, then desserts. Each piece is complete, customers can use it, and the café earns value from it while the next piece is built.

### The difference side by side

| | Iterative | Incremental |
|---|---|---|
| Focus | Refining the solution | Adding finished parts |
| What you get early | A rough version of everything | A finished version of something |
| Main benefit | Learning and better design | Earlier value and lower risk |
| Café example | Rough full menu, improved repeatedly | Breakfast first, lunch later |

A well-known way to picture it uses a painting. Iterative is sketching the whole picture, then adding colour, then adding detail. Incremental is painting one corner completely, then the next corner.

### Combining both

Most real teams do both at once. They deliver a usable piece (incremental) and improve it based on feedback before or alongside the next piece (iterative). This combination is the foundation of agile ways of working, and the Scrum Guide describes Scrum as an iterative, incremental approach.

\`\`\`text
Release 1: Login + view products        -> feedback: search is hard
Release 2: Improved search + cart        -> feedback: checkout too long
Release 3: Shorter checkout + payments   -> feedback: add order tracking
\`\`\`

Each release is a usable increment, and each one also improves earlier work based on what users said.

### Why this reduces risk

Delivering in pieces protects the project in several ways:

- **Early value.** If funding stops halfway, the organisation still has something that works.
- **Early warning.** Real users reveal problems while they are still cheap to fix.
- **Better decisions.** Sponsors can see progress in working results rather than in percentage-complete reports.
- **Motivation.** Teams that ship regularly see the effect of their work.

### Where it is harder

Not everything can be split usefully. Half a bridge carries nobody, and a wedding cannot be delivered in increments on different days. Some products also need a minimum set of features before anyone can use them at all. In those cases the team may still work iteratively inside the project, with prototypes and reviews, even if the final delivery happens all at once.

### Questions to ask on your own project

1. Can we split the result into pieces that are useful on their own?
2. Which piece gives the most value or answers the biggest question first?
3. How will we collect feedback after each piece, and who will give it?
4. How will feedback change the plan for the next piece?

If you can answer these well, iterative and incremental delivery will usually beat a single big delivery at the end.
      `,
        [
          q('A café launches breakfast first, then lunch, then desserts. Which approach is this?', [
            'Iterative, because the menu keeps being refined and improved',
            'Predictive, because the order was planned',
            'Incremental, because finished pieces are added over time',
            'Ad hoc, because there is no plan',
          ], 2, 'Delivering complete, usable parts one after another is incremental delivery.'),
          q('What is the main purpose of iterative development?', [
            'To learn and improve the solution through repeated cycles',
            'To finish each phase before starting the next',
            'To deliver everything in a single release',
            'To avoid any contact with users until the end',
          ], 0, 'Iteration builds a rough version, gathers feedback and refines it, reducing uncertainty in the design.'),
          q('Why does incremental delivery protect a project if funding stops halfway?', [
            'The sponsor must return the unused budget',
            'The team can restart from the beginning later',
            'All documentation is already complete',
            'Some working value has already been delivered',
          ], 3, 'Each increment is usable, so the organisation keeps the value delivered so far.'),
        ]
      ),
      lesson('Agile Lifecycles and When They Fit', 13, `
An agile lifecycle combines iterative and incremental delivery with short cycles, close customer collaboration and a willingness to change the plan as the team learns. It is not a single method. Scrum and Kanban are the best-known approaches, and both are covered in detail later in the course.

### What an agile lifecycle looks like

Instead of one long sequence of phases, the team repeats a short cycle many times:

\`\`\`text
Plan a small slice -> Build it -> Review with stakeholders -> Reflect and adjust
        ^                                                          |
        |__________________________________________________________|
\`\`\`

In Scrum each cycle is a Sprint of one month or less. In Kanban there are no fixed cycles; work flows continuously, and the team reviews and improves on a regular cadence. In both, the plan for future work is kept deliberately light and updated often.

### When agile fits

Agile lifecycles suit work with high uncertainty, where requirements are likely to change or nobody can fully define them in advance.

| Situation | Why agile fits |
|---|---|
| A startup in Islamabad building a new fintech app | User needs are unknown until people try it |
| A marketing team testing campaign ideas | Results from each test shape the next one |
| Redesigning an internal HR portal | Staff feedback reveals what really matters |
| Software for a client whose market is shifting | Priorities change month to month |

A simple way to judge fit is to ask two questions. How clear are the requirements? How certain is the technology or method? The less clear and less certain, the stronger the case for agile.

### When agile fits poorly

- **Fixed, well-understood work.** Building a boundary wall to a set design gains little from two-week cycles.
- **No access to customers or users.** Agile depends on frequent feedback. If the client will only meet at the start and end, much of the benefit disappears.
- **Heavy regulation requiring full upfront design.** Some safety-critical or legal work needs complete approval before anything is built, though teams can still work iteratively inside those limits.
- **Teams that cannot work together closely.** Agile needs people who talk daily and make decisions quickly.

### What changes for the project manager

Agile shifts some responsibilities that a project manager traditionally held:

1. **Scope** is managed through a prioritised list of work, often owned by a Product Owner, rather than a fixed scope statement signed once.
2. **Planning** happens at several levels: a broad direction for the product, and detailed plans only for the next short cycle.
3. **Progress** is measured by working results, not by documents completed.
4. **Decisions** are pushed to the team doing the work wherever possible.

The coordinating work does not disappear. Someone still has to manage budgets, contracts, dependencies on other teams, and communication with senior stakeholders. In many organisations a project manager does this around one or more agile teams.

### Common misunderstandings

- **"Agile means no planning."** Agile teams plan constantly, just in smaller pieces and closer to when the work happens.
- **"Agile means no documentation."** The Agile Manifesto values working software over comprehensive documentation, which is a preference, not a ban.
- **"Agile means no deadlines."** Short cycles create many deadlines. Fixed release dates are common.
- **"Daily meetings make us agile."** Rituals without real feedback and adaptation are just meetings.

### A practical test before choosing agile

Before proposing an agile lifecycle, check that you can honestly say yes to most of these:

- A customer or product owner can give feedback at least every few weeks.
- The work can be split into small, valuable slices.
- The team can be largely dedicated to this work.
- Senior stakeholders accept that detailed scope will emerge over time.

If several answers are no, a pure agile lifecycle may struggle, and a hybrid approach is often wiser.
      `,
        [
          q('In Scrum, how long can a single Sprint be at most?', [
            'Six months',
            'One month',
            'One week exactly',
            'As long as the release needs',
          ], 1, 'The Scrum Guide sets Sprints at one month or less to keep feedback cycles short.'),
          q('Which situation most strongly suggests an agile lifecycle?', [
            'Building a boundary wall to an approved design',
            'Repainting a school building in its existing colours',
            'Building a new app whose user needs are still unknown',
            'Printing a fixed number of exam papers',
          ], 2, 'High uncertainty about requirements is the strongest signal that agile will help.'),
          q('Which statement about agile planning is accurate?', [
            'Agile teams plan often, in smaller pieces, close to the work',
            'Agile teams skip planning so they can move faster',
            'Agile teams plan everything in detail before starting',
            'Agile planning is done only by senior management',
          ], 0, 'Agile replaces one big upfront plan with frequent, smaller planning closer to execution.'),
        ]
      ),
      lesson('Choosing a Hybrid Approach', 14, `
Many real projects are neither purely predictive nor purely agile. A hybrid approach combines elements of both, using each where it fits best. Hybrid is not a compromise to avoid choosing. Done well, it is a deliberate design.

### What hybrid looks like in practice

Hybrid approaches take many forms. Three common patterns:

| Pattern | How it works | Example |
|---|---|---|
| Predictive outside, agile inside | Fixed budget, contract and milestones; agile teams deliver the work | A bank funds a mobile app with a fixed launch date; developers work in Sprints |
| Agile for some parts, predictive for others | Each workstream uses the approach that suits it | Opening a new store: fit-out is predictive, the website and loyalty app are agile |
| Agile then predictive | Explore with prototypes, then lock the design and build | A product team prototypes a device, then runs predictive manufacturing |

### A worked example

A Lahore school group is launching an online learning platform for its campuses. The project has:

- A fixed start date for the academic year.
- Hardware purchases and network upgrades in each campus.
- Training for over a hundred teachers.
- A web platform whose features depend on teacher and parent feedback.

A sensible hybrid plan:

\`\`\`text
Workstream             Approach      Why
Network and hardware   Predictive    Known work, procurement lead times, fixed sequence
Teacher training       Predictive    Dates, venues and trainers booked in advance
Web platform           Agile         Features will change as teachers try it
Overall project        Milestones    Board needs clear dates and budget checkpoints
\`\`\`

The project manager runs an overall schedule with milestones, such as "network ready at all campuses" and "pilot with two campuses", while the platform team works in short cycles and shows working features at each review.

### How to choose

Look at each part of the project and ask:

1. **How stable are the requirements?** Stable suggests predictive; changing suggests agile.
2. **How expensive is late change?** Very expensive suggests detailed upfront planning.
3. **Can the work be delivered in useful pieces?** If yes, agile or incremental delivery is possible.
4. **What does the organisation require?** Some sponsors, banks and government bodies need fixed plans and formal sign-offs.
5. **How experienced is the team?** A team new to agile may benefit from introducing it gradually.

The PMBOK Guide calls this tailoring: adapting the approach to fit the project, the organisation and the environment, rather than applying one method to everything.

### Pitfalls to avoid

- **Hybrid as an excuse.** Calling a project hybrid while running it as waterfall with daily meetings adds overhead without the benefits.
- **Two plans that disagree.** If the predictive milestones and the agile backlog tell different stories, stakeholders lose trust. Link them: show which backlog items must be done for each milestone.
- **Unclear decision rights.** Decide early who controls scope in each workstream. In Scrum, the Product Owner orders the Product Backlog; that authority should be respected even inside a larger predictive plan.
- **Mismatched reporting.** Senior managers may want percentage complete, while the agile team reports working features. Agree one simple status format that serves both.

### Explaining your choice

Stakeholders rarely care about lifecycle names. They care about what they will get and when. When you present your approach, explain it in their terms:

"The building work will follow a fixed plan with three checkpoints because the contractor and permits require it. The app will be built in two-week cycles so you can see and adjust it every fortnight. You will get one combined status report each week showing both."

That explanation is more persuasive than any method label. Choosing an approach is ultimately about managing uncertainty sensibly, and a thoughtful hybrid is often the most honest answer to a mixed project.
      `,
        [
          q('A store opening has a predictable fit-out and an uncertain loyalty app. Which approach fits best?', [
            'Fully predictive for both parts',
            'Fully agile for both parts, with reviews every two weeks',
            'No formal approach for either part',
            'Predictive for the fit-out and agile for the app',
          ], 3, 'A hybrid matches each workstream to the approach that suits its level of uncertainty.'),
          q('What does the PMBOK Guide call adapting the approach to fit the project?', [
            'Baselining',
            'Tailoring',
            'Crashing',
            'Decomposing',
          ], 1, 'Tailoring means adapting the approach, processes and practices to suit the project and its environment.'),
          q('A hybrid project\'s milestones and backlog tell different stories. What is the fix?', [
            'Delete the backlog and keep the milestones',
            'Report only to the team, never to sponsors',
            'Link backlog items to the milestones they support',
            'Run two separate projects with no connection',
          ], 2, 'Linking backlog items to milestones keeps both views consistent and preserves stakeholder trust.'),
        ]
      ),
      ],
      [
      q('A team builds a rough full version of a report template, gets feedback and refines it three times. What is this?', [
        'Iterative development',
        'Incremental delivery',
        'Predictive phase gating',
        'Schedule compression',
      ], 0, 'Repeatedly refining the same complete solution through feedback is iterative development.'),
      q('Which question best helps decide between predictive and agile for one workstream?', [
        'Which software tool does the team prefer?',
        'How many meetings does each approach require?',
        'Which approach is more popular online this year?',
        'How stable are the requirements for this workstream?',
      ], 3, 'Requirement stability is one of the strongest signals for choosing an approach.'),
      q('A client will meet the team only at the start and at the end. What does this mean for a pure agile approach?', [
        'It makes agile easier because there are fewer meetings',
        'It removes the frequent feedback agile depends on',
        'It has no effect, since agile ignores customers',
        'It means the project must be cancelled',
      ], 1, 'Agile relies on frequent stakeholder feedback, so very limited customer contact weakens it.'),
      q('Which description of hybrid project management is accurate?', [
        'A way to avoid choosing any method at all',
        'Waterfall with a daily meeting added',
        'A deliberate mix of approaches matched to each part',
        'Agile used only by senior management',
      ], 2, 'A good hybrid is a deliberate choice that applies each approach where it fits best.'),
      ]
    ),
    chapter(
      'Starting a Project Right',
      'Learn how organisations decide which projects are worth doing, how to write a project charter that authorises your work, how to find and map the people who can make or break the project, and how to run a kickoff meeting that sets everyone off in the same direction.',
      [
      lesson('Business Cases and Project Selection', 13, `
Before a project starts, someone has to decide it is worth doing. That decision is usually based on a business case: a document or presentation that explains why the project should happen, what it will cost, and what the organisation will gain.

### What a business case contains

A business case does not need to be long. For a small project it might be two pages. It should answer a few clear questions:

| Section | Question it answers |
|---|---|
| Problem or opportunity | What is wrong now, or what could we gain? |
| Options considered | What are the realistic ways to respond, including doing nothing? |
| Recommended option | Which option do we propose and why? |
| Costs | What will it cost to deliver and to run afterwards? |
| Benefits | What will improve, and how will we measure it? |
| Risks | What could stop the benefits arriving? |
| Timeline | Roughly when will costs fall and benefits appear? |

The "do nothing" option is important. It forces the writer to show what happens if the organisation simply carries on, which is often the real competitor to any project.

### A worked example

A family-owned distribution business in Karachi still takes orders from shopkeepers by phone and writes them in registers. Mistakes and lost orders are common. The owner's son proposes a simple order-taking app for the sales team.

His business case compares three options:

\`\`\`text
Option 1: Do nothing
  Cost: none upfront
  Impact: order errors continue, growth limited by phone capacity

Option 2: Use an off-the-shelf order app (monthly subscription)
  Cost: subscription plus training
  Impact: fewer errors within weeks, limited custom features

Option 3: Build a custom app with a local software house
  Cost: higher upfront build cost plus maintenance
  Impact: fits the business exactly, takes months to deliver

Recommendation: Option 2 now, review custom build after one year
\`\`\`

He gets real quotes from vendors rather than guessing prices, and he uses the business's own records to estimate how many orders currently go wrong. Real numbers from your own context make a business case far more convincing than general claims.

### Common ways to compare projects

When an organisation has more ideas than money, it compares projects using simple financial and non-financial measures.

- **Payback period**: how long until the benefits repay the initial cost. Easy to understand, but ignores benefits after payback.
- **Return on investment (ROI)**: the net benefit as a percentage of the cost.
- **Net present value (NPV)**: future benefits converted into today's money using a discount rate, minus costs. A positive NPV suggests the project adds value. Finance teams usually set the discount rate.
- **Scoring models**: each project is scored against criteria such as strategic fit, risk, urgency and benefit, and the scores are weighted and added.

Non-financial reasons count too. A project may be required by law, by a major customer, or to keep the organisation safe. These are often called compliance or mandatory projects, and they can go ahead even with weak financial returns.

### The project manager's role

Project managers are often appointed after the business case is approved, but you should still read it carefully. It tells you:

1. **Why the project exists**, which guides every trade-off later.
2. **What benefits the sponsor expects**, which defines success beyond on time and on budget.
3. **What assumptions were made**, such as vendor prices or adoption rates, which become risks to watch.

If there is no business case, ask the sponsor to explain the reasons in a short conversation and write down what you hear. A project with no clear reason is easily cancelled or endlessly reshaped.

### Keep the business case alive

Conditions change. A competitor launches first, a supplier raises prices, or exchange rates move sharply, which matters for any project buying imported equipment or paying for software in dollars. Revisit the business case at major milestones and ask: is this still worth doing? Stopping a project that no longer makes sense is a good decision, not a failure.
      `,
        [
          q('Why should a business case include a "do nothing" option?', [
            'Because sponsors always choose to do nothing',
            'Because it is required by the Scrum Guide',
            'To show what happens if the organisation carries on as now',
            'To make the document longer and more formal',
          ], 2, 'Comparing against doing nothing shows whether any project option is actually better than the current situation.'),
          q('What does a positive net present value suggest about a project?', [
            'It is expected to add value after costs, in today\'s money',
            'It is certain to repay its full cost within the first year',
            'It has no risks at all',
            'It does not need a project manager',
          ], 0, 'A positive NPV means discounted future benefits exceed the costs, suggesting the project adds value.'),
          q('A PM is appointed after approval. Why should she still read the business case?', [
            'To check the spelling before it is filed',
            'To rewrite all of the financial figures herself before anyone sees them',
            'To decide whether to accept the job',
            'It explains why the project exists and what benefits are expected',
          ], 3, 'The business case gives the reasons, expected benefits and assumptions that guide decisions throughout the project.'),
        ]
      ),
      lesson('Writing a Project Charter', 13, `
A project charter is the document that formally authorises a project to exist and gives the project manager authority to use organisational resources. Think of it as the project's birth certificate. The PMBOK Guide treats it as the key output of starting a project.

### Why a charter matters

Without a charter, a project often starts with a casual instruction: "Can you sort out the new website?" Weeks later, people disagree about what was asked, who is paying, and who decides. A charter prevents this by putting the essentials in writing and getting the sponsor to sign or approve it.

The charter is usually issued by the sponsor, the person or group who provides funding and support. The project manager often drafts it, because the sponsor rarely has time, but the sponsor's approval is what gives it force.

### What goes in a charter

Keep it short. One to three pages is enough for most projects.

| Section | What to write |
|---|---|
| Project name and sponsor | Who owns it at senior level |
| Project manager | Who is named, and their level of authority |
| Purpose | Why the project exists, linked to the business case |
| Objectives | Measurable results the project must achieve |
| High-level scope | What is in, and anything clearly out |
| Key deliverables | The main things that will be handed over |
| Milestones | A few important dates |
| Budget | The approved amount or range |
| Key stakeholders | Main groups and people involved |
| High-level risks and assumptions | The biggest known uncertainties |
| Success criteria | How the sponsor will judge the project |
| Approval | Sponsor's name, signature and date |

### Writing good objectives

Vague objectives create arguments later. Make them specific and measurable. The SMART checklist helps: specific, measurable, achievable, relevant and time-bound.

\`\`\`text
Weak:   Improve the clinic's appointment system.
Better: Launch online appointment booking for all three branches of the
        clinic in Rawalpindi by 30 June, with at least half of new
        appointments booked online by the end of September.
\`\`\`

The better version tells everyone what will be delivered, where, by when, and how success will be checked.

### Defining what is out of scope

One of the most useful lines in a charter is the list of exclusions. For the clinic project above, the charter might say:

- Out of scope: online payments, video consultations, changes to the billing software.

Writing exclusions early is far easier than refusing requests later. When someone asks for video consultations in month three, you can point to the approved charter and treat it as a change request rather than an argument.

### Authority: say it plainly

Accidental project managers often struggle because nobody told the organisation they were in charge. The charter should state the project manager's authority clearly. For example:

"The project manager may assign tasks to the named team members, approve spending up to an agreed limit, and escalate to the sponsor any decision outside these limits."

Agreeing this upfront avoids awkward moments when a department head questions why you are directing their staff.

### Charters on agile projects

Agile teams also benefit from a charter, sometimes called a team charter or project vision document. It usually focuses on the product vision, the target users, how the team will work together, and how often stakeholders will review progress. In Scrum, the Product Goal plays a related role by describing the future state the team is working towards. A short charter alongside it still helps with funding, authority and organisational support, which the Scrum Guide does not cover.

### Common mistakes

1. **Too long.** A forty-page charter will not be read. Move detail into later plans.
2. **No sponsor approval.** An unsigned draft carries no authority.
3. **Objectives without numbers or dates.** These cannot be checked.
4. **Never looked at again.** Bring the charter to key reviews and use it to settle disputes about purpose and scope.

A good charter takes an afternoon to write and can save weeks of confusion.
      `,
        [
          q('What is the main purpose of a project charter?', [
            'To list every task in the project schedule',
            'To formally authorise the project and the PM\'s authority',
            'To record the daily progress of each team member',
            'To replace the contract with the client',
          ], 1, 'The charter formally authorises the project and gives the project manager authority to use organisational resources.'),
          q('Who usually issues or approves the project charter?', [
            'The newest member of the project team',
            'An external auditor',
            'The client\'s accounts department',
            'The project sponsor',
          ], 3, 'The sponsor provides funding and support, and their approval gives the charter its authority.'),
          q('Why is listing out-of-scope items in the charter useful?', [
            'Later requests for those items can be handled as changes',
            'It makes the project budget smaller automatically',
            'It removes the need for any stakeholder meetings',
            'It guarantees the project finishes early',
          ], 0, 'Clear exclusions let the project manager treat later requests as change requests rather than disputes.'),
        ]
      ),
      lesson('Identifying and Mapping Stakeholders', 13, `
A stakeholder is any person, group or organisation that can affect the project, be affected by it, or believe they will be affected by it. That last part matters. People who simply think a project threatens them can block it as effectively as people with real authority.

### Who counts as a stakeholder

Stakeholders are usually far more numerous than the people in the project team. For a project to introduce a new attendance system at a factory in Sialkot, the list might include:

- The owner, who is sponsoring the project.
- The HR manager, who will run the system daily.
- Line supervisors, who will approve shift changes.
- Factory workers, whose pay depends on accurate attendance.
- The workers' representatives or union, if there is one.
- The IT vendor supplying the devices.
- The accounts team, who calculate salaries.
- Major buyers who audit working conditions.

Missing a stakeholder is one of the most common causes of late surprises. A project that ignores the accounts team may deliver a system whose data cannot be used for payroll.

### How to find them

Use several methods together:

1. **Brainstorm with the team** and ask who uses, pays for, approves, supports or is affected by the result.
2. **Read the charter and business case** for named groups.
3. **Follow the process**: trace the work from start to end and note every person who touches it.
4. **Ask each stakeholder** who else you should talk to.

### The power and interest grid

Once you have a list, you need to decide how much attention each stakeholder needs. A widely used tool is the power and interest grid, which places each stakeholder by how much influence they have over the project and how much they care about it.

\`\`\`text
                 Low interest            High interest
High power   |  Keep satisfied        |  Manage closely        |
             |  (e.g. finance head)   |  (e.g. owner, HR head) |
Low power    |  Monitor               |  Keep informed         |
             |  (e.g. canteen staff)  |  (e.g. factory workers)|
\`\`\`

| Quadrant | Approach |
|---|---|
| Manage closely | Involve in key decisions, meet regularly, listen carefully |
| Keep satisfied | Brief, focused updates; consult on matters they care about |
| Keep informed | Regular communication, chances to give feedback |
| Monitor | Light-touch updates, watch for changes in their position |

Stakeholders move between quadrants. Factory workers may have low formal power, but if they refuse to use the new system, their real influence becomes very high. Review the grid as the project progresses.

### A stakeholder register

Record what you learn in a stakeholder register. A simple spreadsheet works.

| Name or group | Role | Interest | Power | Current attitude | Desired attitude | Notes |
|---|---|---|---|---|---|---|
| Owner | Sponsor | High | High | Supportive | Leading | Wants fewer payroll disputes |
| HR manager | Main user | High | Medium | Neutral | Supportive | Worried about extra workload |
| Line supervisors | Approvers | Medium | Medium | Resistant | Neutral | Fear losing flexibility |

The current and desired attitude columns show where you need to put effort. Moving the line supervisors from resistant to neutral might be one of the most important pieces of work in the whole project.

### Understanding what people want

Behind every attitude is an interest. The supervisors in this example may not oppose attendance tracking itself. They may worry that rigid rules will stop them giving workers flexibility for family events, which they rely on to keep good staff. Once you understand that, you can design a solution, such as an approval process for exceptions, that addresses the real concern.

Conversations work better than assumptions. A short, respectful one-to-one meeting with each key stakeholder early in the project often reveals concerns no document would show.

### Handle the register with care

Notes about people's attitudes can cause offence if shared carelessly. Keep the detailed register for the project manager and sponsor, and share only a summary more widely. Write notes you would be comfortable for the person to read.
      `,
        [
          q('Which description of a stakeholder is the most complete?', [
            'Anyone who is paid by the project budget',
            'Only the sponsor, the project manager and the paid team members',
            'Only people who sign the project contract',
            'Anyone who affects, is affected by, or feels affected by it',
          ], 3, 'Stakeholders include people who believe they are affected, because their perception can shape the project as much as real authority.'),
          q('Where on the power and interest grid should a high-power, high-interest stakeholder sit?', [
            'Monitor from a distance',
            'Keep informed by email',
            'Manage closely',
            'Keep satisfied',
          ], 2, 'Stakeholders with both high power and high interest need close involvement and regular engagement.'),
          q('Why does a register include current and desired attitude?', [
            'To decide who should be removed from the project',
            'To show where engagement effort is most needed',
            'To calculate each stakeholder\'s share of the budget',
            'To rank stakeholders by seniority for the org chart',
          ], 1, 'The gap between current and desired attitude shows where the project manager should focus engagement work.'),
        ]
      ),
      lesson('The Kickoff Meeting', 12, `
The kickoff meeting is the official start of the project for the people who will do the work and the people who care about it. A good kickoff creates shared understanding and energy. A poor one, or none at all, leaves people guessing about goals, roles and priorities for weeks.

### Why hold a kickoff at all

Even in small organisations, team members often hear about a project in fragments: a corridor conversation, a forwarded email, a rumour. The kickoff replaces fragments with one clear story told to everyone at the same time. It also signals that the project is real and supported by leadership.

### Who should attend

Invite the people who will do the work and the stakeholders who need to understand and support it. Typically:

- The sponsor, who explains why the project matters.
- The project manager, who runs the meeting.
- Core team members.
- Key stakeholders from the manage closely group.
- Vendor representatives, if they are central to delivery.

For larger projects, some organisations hold two sessions: one with senior stakeholders focused on goals and governance, and one with the delivery team focused on how work will be done.

### A practical agenda

Keep it to about an hour for most projects. A clear agenda shared in advance helps.

\`\`\`text
Kickoff: Online booking for clinic branches
1. Welcome and purpose (Sponsor)                         10 min
2. Objectives, scope and what is out of scope (PM)       10 min
3. Key milestones and how we will work (PM)              10 min
4. Roles and responsibilities (PM and team)              10 min
5. Known risks and open questions (All)                  10 min
6. Communication: how and when updates happen (PM)        5 min
7. Next steps and actions (PM)                            5 min
\`\`\`

Starting with the sponsor is powerful. When the person who funds the project explains in their own words why it matters, the team takes it more seriously than any slide from the project manager.

### Clarifying roles

Confusion about who does what is one of the biggest sources of friction in projects. A responsibility assignment matrix, often called a RACI chart, makes roles visible.

| Deliverable | Sponsor | PM | IT vendor | Clinic manager | Reception staff |
|---|---|---|---|---|---|
| Booking website | A | R | R | C | I |
| Staff training | I | A | C | R | C |
| Go-live decision | A | R | C | C | I |

R means responsible for doing the work, A means accountable for the final result (only one per row), C means consulted before decisions, and I means informed of the outcome. Reviewing the chart in the kickoff surfaces disagreements while they are cheap to fix.

### Making it a conversation

A kickoff should not be a one-way lecture. Leave time for questions and concerns. Useful prompts:

1. "What worries you most about this project?"
2. "What could get in the way of these dates?"
3. "Is anyone missing from this room who should be here?"

Write the answers down. Concerns raised here often become the first entries in the risk register, and missing people go straight onto the stakeholder list.

### Practical tips for local teams

- **Language**: if some team members are more comfortable in Urdu or a regional language, let them ask questions in it and summarise in the shared notes. Understanding matters more than formality.
- **Hierarchy**: junior staff may hesitate to question senior people openly. Invite written questions after the meeting, or ask for input in smaller groups.
- **Remote attendees**: share slides beforehand in case of slow connections or power cuts, and record key decisions in writing.

### After the meeting

Send a short summary within a day: the purpose, the main decisions, the role chart, the actions with owners and dates, and where project documents live. Without this follow-up, much of the meeting's value fades within a week.
      `,
        [
          q('Why is it powerful for the sponsor to open the kickoff meeting?', [
            'It shows leadership support and explains why the project matters',
            'It allows the project manager to skip the meeting',
            'Sponsors are the only ones allowed to speak first',
            'It replaces the need for a project charter',
          ], 0, 'Hearing the purpose from the sponsor signals real support and helps the team take the project seriously.'),
          q('In a RACI chart, what does the letter A stand for?', [
            'Assigned to the work each day',
            'Accountable for the final result',
            'Approved by the client in writing',
            'Available for questions if needed',
          ], 1, 'A marks the single person accountable for the final result of that deliverable.'),
          q('What should happen within a day after the kickoff meeting?', [
            'A second kickoff to repeat the agenda',
            'A full detailed schedule for the next year',
            'A short written summary with decisions and actions',
            'A vote on whether to continue the project',
          ], 2, 'A prompt written summary keeps decisions, roles and actions clear and stops the meeting\'s value fading.'),
        ]
      ),
      ],
      [
      q('A project starts with a casual verbal request and no written authorisation. What problem is most likely?', [
        'The budget will be too large',
        'The team will finish too early',
        'The stakeholders will all be fully supportive from the very first day',
        'People will disagree later about scope, funding and authority',
      ], 3, 'Without a charter, nobody has an agreed written record of scope, funding or decision rights, so disputes follow.'),
      q('Workers have little formal power but refuse to use a new system. What should the PM conclude?', [
        'Their real influence is high, so engagement must increase',
        'They can safely be ignored because their formal power is low',
        'The project should be cancelled at once',
        'Only the sponsor\'s view matters now',
      ], 0, 'Stakeholders move on the grid; low formal power can still mean high practical influence.'),
      q('Which objective is written most usefully for a charter?', [
        'Make the clinic better for patients soon',
        'Improve bookings as much as possible',
        'Launch online booking at three branches by 30 June',
        'Use modern technology in the clinic',
      ], 2, 'A specific deliverable, location and date make the objective measurable and checkable.'),
      q('Concerns raised at the kickoff often feed which project document first?', [
        'The final lessons learned report',
        'The risk register',
        'The vendor\'s invoice',
        'The closing sign-off form',
      ], 1, 'Worries about what could go wrong are candidate risks, so they belong in the risk register.'),
      ]
    ),
    chapter(
      'Scope and the Work Breakdown Structure',
      'Gather and document requirements, write a scope statement that says clearly what is and is not included, break the work into a work breakdown structure, and keep scope under control with a simple, fair change request process.',
      [
      lesson('Gathering and Documenting Requirements', 13, `
Requirements describe what the project's result must do or have to meet the needs of its stakeholders. Most project disputes trace back to requirements that were vague, missing or understood differently by different people. Time spent getting them right early is some of the best time you will spend.

### Types of requirements

It helps to sort requirements into a few groups so nothing important is forgotten.

| Type | What it covers | Example for a school fee portal in Lahore |
|---|---|---|
| Business | Why the organisation needs it | Reduce queues at the accounts office during fee week |
| Stakeholder | What particular groups need | Parents need to pay from a phone; accounts need a daily report |
| Functional | What the solution must do | Show each student's dues and accept online payment |
| Non-functional | How well it must do it | Pages load quickly on mobile data; works in Urdu and English |
| Transition | What is needed to switch over | Import existing student records; train accounts staff |

Non-functional requirements are often forgotten until late. Speed, security, accessibility, language support and the ability to work on low-cost phones are all requirements, even if nobody mentions them at first.

### Techniques for gathering them

No single technique finds everything. Combine several.

1. **Interviews**: one-to-one conversations with key stakeholders. Good for depth and for sensitive topics.
2. **Workshops**: bring several groups together to agree requirements and resolve conflicts face to face.
3. **Observation**: watch people do the work today. You will see steps nobody thinks to mention, such as the accountant cross-checking a paper register.
4. **Document analysis**: study existing forms, reports, policies and complaint records.
5. **Questionnaires**: useful when you need input from many people, such as all parents.
6. **Prototypes**: show a rough screen or model and let people react. People often discover what they want only when they see something concrete.

### Asking good questions

Stakeholders often describe solutions rather than needs. "We need a WhatsApp button" may really mean "parents need a quick way to ask about fees". Ask why, gently and more than once, to reach the underlying need.

Useful questions include:

- "What problem does this solve for you?"
- "What happens today when this goes wrong?"
- "How would you know this works well?"
- "What would happen if we did not include it?"

### Documenting requirements

Write each requirement so it is clear, testable and tied to its source. A simple requirements list or spreadsheet is enough for many projects.

\`\`\`text
ID     Requirement                                        Source         Priority
REQ-01 Parent can view outstanding fees for each child    Parent survey  Must
REQ-02 Parent can pay by card or mobile wallet            Accounts head  Must
REQ-03 Accounts receive a daily payment report by 9 am    Accounts head  Must
REQ-04 Fee reminders are sent by SMS three days before    Principal      Should
REQ-05 Parents can download past receipts                 Parent survey  Could
\`\`\`

Agile teams often write requirements as user stories with acceptance criteria. That format is covered later in the course, but the same principles apply: clear, testable and linked to a real need.

### Prioritising with MoSCoW

When there are more requests than time or money, prioritise. The MoSCoW method is simple and widely used:

- **Must have**: without it, the solution does not work or is not acceptable.
- **Should have**: important, but the solution still works without it.
- **Could have**: nice if time allows.
- **Won't have this time**: agreed as out of this release.

The "won't have" list is valuable. It records what people asked for and shows they were heard, even though the answer for now is no.

### Traceability

For larger projects, keep a traceability matrix that links each requirement to its source, the deliverable that meets it, and the test that proves it. This helps you check that nothing was lost and that every feature built traces back to a real need, which is also a defence against unrequested extras.
      `,
        [
          q('"Pages must load quickly on mobile data." What type of requirement is this?', [
            'Business requirement',
            'Transition requirement',
            'Functional requirement',
            'Non-functional requirement',
          ], 3, 'It describes how well the solution performs rather than what it does, so it is non-functional.'),
          q('A stakeholder says "We need a WhatsApp button". What should the PM do next?', [
            'Add it to the plan immediately as a must have',
            'Ask what problem it would solve for them',
            'Reject it because it is a solution, not a need',
            'Send the request straight to the developers',
          ], 1, 'Asking why uncovers the underlying need, which may have several possible solutions.'),
          q('In MoSCoW prioritisation, what does "Won\'t have this time" record?', [
            'Requests agreed to be out of this release',
            'Requirements that were rejected permanently',
            'Features that the sponsor dislikes personally',
            'Tasks that the team forgot to estimate',
          ], 0, 'The won\'t have list records requests deferred from the current release, showing they were heard.'),
        ]
      ),
      lesson('Writing a Scope Statement', 13, `
The project scope statement describes the project's deliverables and the work required to create them. Where the charter gives a high-level outline, the scope statement adds enough detail for the team to plan and for stakeholders to agree exactly what they will get.

### Product scope and project scope

Two kinds of scope are easy to mix up:

- **Product scope** is the features and characteristics of the result. For a shop renovation, it might be new shelving, lighting and a billing counter.
- **Project scope** is the work needed to deliver that result, including things that are not part of the final product, such as obtaining permits, coordinating contractors and training staff.

A good scope statement covers both.

### What a scope statement contains

| Section | Purpose |
|---|---|
| Scope description | A summary of what the project will deliver |
| Deliverables | Each tangible output, described clearly |
| Acceptance criteria | The conditions each deliverable must meet to be accepted |
| Exclusions | What is explicitly not included |
| Constraints | Fixed limits, such as dates, budget or rules |
| Assumptions | Things believed to be true but not yet confirmed |

### A worked example

A garment exporter in Faisalabad needs its warehouse reorganised to handle a new buyer's packing requirements.

\`\`\`text
Project: Warehouse reorganisation for new buyer packing

Scope description:
  Reorganise the finished goods warehouse into labelled zones and set up
  a packing line that meets the new buyer's carton and labelling rules.

Deliverables:
  1. Zoned floor layout with labelled racks
  2. Packing line with two stations and a carton check point
  3. Written packing procedure in English and Urdu
  4. Training for packing staff on both shifts

Acceptance criteria:
  - Every rack location matches the approved layout drawing
  - A trial shipment of 50 cartons passes the buyer's checklist
  - All packing staff have attended training and signed attendance

Exclusions:
  - New warehouse management software
  - Changes to the dyeing or stitching sections
  - Building repairs outside the warehouse

Constraints:
  - Warehouse must keep dispatching existing orders during the work
  - Work completed before the buyer's first order date

Assumptions:
  - Existing racks can be reused after repair
  - The buyer's checklist will not change before the trial shipment
\`\`\`

Notice how specific each part is. Anyone reading this knows what will be delivered, how acceptance will be judged, and what is not included.

### Writing acceptance criteria

Acceptance criteria turn opinions into checks. "The packing line works well" invites argument. "A trial shipment of 50 cartons passes the buyer's checklist" can be tested and agreed. Each deliverable should have at least one criterion that a neutral person could verify.

### Constraints and assumptions

Constraints are limits you must work within. Assumptions are beliefs you have not proved. Both deserve attention:

- Every assumption is a potential risk. If the racks cannot be reused, cost and time change. Record assumptions so they can be checked early.
- Constraints shape the plan. The need to keep dispatching during the work may mean reorganising one zone at a time at night or on weekends.

### Getting agreement

A scope statement only protects the project if the key stakeholders have read and agreed it. Walk the sponsor and main users through it, section by section, rather than sending it by email and hoping. Pay particular attention to the exclusions, because that is where expectations most often differ.

Once agreed, the scope statement becomes part of the scope baseline, together with the work breakdown structure covered next. Future changes are measured against it.

### Scope on agile projects

On agile projects, detailed scope is not fixed upfront. Instead, the Product Backlog holds the work, and its contents change as the team learns. A short scope summary with clear exclusions and constraints is still useful, especially for contracts and budgets, even when the detail will evolve.
      `,
        [
          q('What is the difference between product scope and project scope?', [
            'Product scope is the result\'s features; project scope is the work to deliver it',
            'Product scope is set by the team; project scope is set by the vendor',
            'Product scope is for agile projects; project scope is for predictive ones',
            'Product scope covers cost; project scope covers schedule',
          ], 0, 'Product scope describes the result itself, while project scope includes all the work, such as permits and training, needed to deliver it.'),
          q('Which acceptance criterion is most useful?', [
            'The packing line should work well for everyone',
            'The warehouse should look much more organised',
            'A trial of 50 cartons passes the buyer\'s checklist',
            'Staff should feel happy with the new layout',
          ], 2, 'A criterion that a neutral person can test and verify avoids arguments about whether a deliverable is accepted.'),
          q('Why should assumptions be written in the scope statement?', [
            'They replace the need for a risk register',
            'They are legally binding on the sponsor',
            'They show which tasks are already complete',
            'Each one could become a risk if it proves false',
          ], 3, 'Unproven assumptions are potential risks, so recording them lets the team check them early.'),
        ]
      ),
      lesson('Building a Work Breakdown Structure', 14, `
A work breakdown structure, or WBS, is a hierarchical breakdown of the total scope of work into smaller, manageable pieces. It is one of the most useful tools in project management because almost everything else, from estimates to schedules to budgets, is built on top of it.

### The basic idea

You start with the whole project at the top and break it into major deliverables, then break each of those into smaller pieces, until each piece is small enough to estimate, assign and track. The lowest level is called a work package.

The WBS describes deliverables and work, not the order in which things happen. Sequence comes later, when you build the schedule.

### An example

A Karachi events company is organising a two-day technology conference.

\`\`\`text
1.0 Tech Conference
  1.1 Venue
      1.1.1 Venue shortlist and site visits
      1.1.2 Signed venue contract
      1.1.3 Hall layout and stage plan
  1.2 Programme
      1.2.1 Speaker list confirmed
      1.2.2 Session schedule published
      1.2.3 Speaker travel and hotel booked
  1.3 Marketing and registration
      1.3.1 Website and registration form
      1.3.2 Social media campaign
      1.3.3 Attendee confirmations
  1.4 Event operations
      1.4.1 Catering arranged
      1.4.2 Audio, video and internet set up
      1.4.3 Volunteers recruited and briefed
  1.5 Project management
      1.5.1 Plans and budget
      1.5.2 Status reporting
      1.5.3 Post-event review
\`\`\`

Each element has a code, which makes it easy to refer to in estimates, schedules and budgets. Notice that project management itself appears as a branch. It is real work and should be planned and costed.

### The 100 percent rule

A core principle is the 100 percent rule: the WBS must include all of the work in the project scope, and nothing outside it. At each level, the child elements must add up to exactly the parent. If something is missing from the WBS, it will be missing from the estimates, the schedule and the budget.

The reverse also holds. If the WBS contains work that is not in scope, such as a gala dinner nobody approved, it should be removed or handled through a change request.

### How small should work packages be?

There is no single rule, but common guidelines help:

| Guideline | Why it helps |
|---|---|
| Can be estimated with reasonable confidence | Large, vague items hide risk |
| Can be assigned to one person or team | Clear ownership avoids "I thought you were doing it" |
| Produces a clear, checkable output | Progress is visible, not guessed |
| Short enough to track between status updates | Problems are spotted early |

Some teams use a rough rule that a work package should take no more than one or two reporting periods. Treat this as a guide, not a law.

### Building the WBS with the team

Do not build the WBS alone. The people who will do the work know what it involves. A practical approach:

1. Put the project name on a whiteboard or shared screen.
2. Agree the major deliverables, perhaps four to eight of them.
3. Break each deliverable down with the people who know that area.
4. Check every branch against the scope statement and the 100 percent rule.
5. Write a short WBS dictionary entry for each work package.

### The WBS dictionary

The WBS dictionary gives detail for each element: a description, the owner, acceptance criteria, key assumptions and, later, the estimate and dates. For example, "1.4.2 Audio, video and internet set up" might note that the venue's internet must support live streaming, that a backup connection is required, and that a test is due the day before the event.

### Nouns, not verbs

Many practitioners write WBS elements as deliverables (nouns), such as "Signed venue contract" or "Venue shortlist", rather than activities (verbs). Activities are listed later when building the schedule. Focusing on outcomes keeps the WBS about what will exist when the work is done.

### Agile equivalents

Agile teams rarely draw a formal WBS, but they decompose work in a similar way: large features are split into smaller backlog items until each can be completed in a short cycle. The principle of breaking big, uncertain work into small, clear pieces is the same.
      `,
        [
          q('What is a work package in a WBS?', [
            'The full list of stakeholders, grouped by their power and interest',
            'The contract signed with each vendor',
            'The lowest WBS level, small enough to estimate and assign',
            'The highest level that names the whole project',
          ], 2, 'Work packages sit at the lowest level of the WBS and are small enough to estimate, assign and track.'),
          q('What does the 100 percent rule require?', [
            'Every task must be fully complete before the next one starts',
            'The budget must include a reserve of one hundred percent',
            'Every team member must work full time on the project',
            'The WBS includes all scoped work and nothing outside it',
          ], 3, 'The 100 percent rule says the WBS must capture all of the scope and only the scope.'),
          q('Why should project management appear as its own branch in the WBS?', [
            'Because the sponsor must approve each meeting',
            'Because it is real work that needs time and budget',
            'Because agile teams require it in every Sprint',
            'Because it replaces the need for a schedule',
          ], 1, 'Planning, reporting and coordination take real effort, so they belong in the WBS and the budget.'),
        ]
      ),
      lesson('Controlling Scope Creep and Change Requests', 13, `
Scope creep is the gradual, uncontrolled growth of a project's scope without matching changes to time, cost or resources. It rarely arrives as one big demand. It arrives as a series of small, reasonable-sounding requests, each one "just a small addition".

### How scope creep happens

Common sources include:

- **Clients adding requests informally**: "While you're at it, could you also add..."
- **Team members gold-plating**: adding extras nobody asked for because they seem nice.
- **Vague requirements**: when scope is unclear, every new idea seems to fit.
- **New stakeholders**: someone joins late and brings their own wishes.
- **Senior pressure**: a request from a director is accepted without question.

Each addition may look small. Together they push the project past its deadline and budget, and the team ends up blamed for overruns caused by work that was never planned.

### Change is not the enemy

Some change is healthy. Markets shift, users learn what they need, and new regulations appear. The goal is not to block change but to control it, so every change is a conscious decision with known consequences. Agile approaches embrace changing requirements, but they still manage change deliberately, through the Product Owner ordering the Product Backlog, rather than letting it slip in unnoticed.

### A simple change control process

For most projects, a lightweight process is enough.

\`\`\`text
1. Request     Anyone submits a change request in writing
2. Log         PM records it in the change log with an ID
3. Assess      PM and team estimate impact on scope, time, cost, risk, quality
4. Decide      Sponsor or change control board approves, rejects or defers
5. Update      If approved, update plans, baselines and budget
6. Communicate Tell everyone affected what changed and why
\`\`\`

A change control board is simply the group authorised to approve changes. On small projects this may be just the sponsor.

### A change request example

| Field | Entry |
|---|---|
| ID | CR-07 |
| Requested by | Marketing manager |
| Description | Add an Urdu version of the conference website |
| Reason | Many attendees from smaller cities prefer Urdu |
| Impact on time | Website launch moves by about one week |
| Impact on cost | Translator and extra developer days, quote attached |
| Impact on risk | Slight delay to registration opening |
| Options | Approve; defer Urdu to after launch; approve a partial version |
| Decision | Approved partial version: registration pages in Urdu |
| Decided by and date | Sponsor, 12 March |

This record protects everyone. The marketing manager sees the request taken seriously. The sponsor makes an informed choice. The project manager has evidence of why the timeline moved.

### Handling informal requests

Many requests arrive in passing: in a WhatsApp message, at the end of a meeting, or in a call. A polite, consistent response works well:

"That sounds useful. Let me log it and come back to you by Thursday with what it would mean for the timeline and cost, so you can decide."

This is neither a yes nor a no. It moves the request into the process without sounding defensive.

### Preventing scope creep

1. **Clear scope and exclusions** from the charter and scope statement.
2. **Agreed acceptance criteria** so "done" is not open to endless reinterpretation.
3. **Regular demonstrations** so stakeholders see progress and raise needs early.
4. **A visible change log** so everyone sees how many changes have been accepted and their combined effect.
5. **No gold-plating**: remind the team to deliver what was agreed, and suggest extras through the same process.

### When to say no

Sometimes the right answer is no, or not now. If a change does not support the project's objectives, adds risk close to a fixed deadline, or would be better as a separate project, recommend rejecting or deferring it. Present the reasons calmly and in writing. Saying no with evidence is part of protecting the project, and sponsors usually respect it more than silent overruns.
      `,
        [
          q('Which description best fits scope creep?', [
            'An approved change with updated time and budget',
            'Uncontrolled growth of scope without matching changes',
            'A reduction in scope agreed by the sponsor',
            'A delay caused by bad weather on site',
          ], 1, 'Scope creep is growth in scope that happens without matching adjustments to time, cost or resources.'),
          q('A developer adds extra animations nobody requested. What is this called?', [
            'Gold-plating',
            'Fast tracking',
            'Rolling wave planning',
            'Decomposition',
          ], 0, 'Adding unrequested extras is gold-plating, a common internal source of scope creep.'),
          q('A client asks for a new feature on a call. What is a good first reply?', [
            'Agree at once to keep the relationship strong',
            'Refuse because the scope is already signed off',
            'Say you will log it and return with its impact',
            'Ask the team to start quietly without telling the sponsor',
          ], 2, 'Logging the request and assessing impact moves it into change control without saying yes or no too early.'),
        ]
      ),
      ],
      [
      q('Observation is used to gather requirements. What does it often reveal?', [
        'The exact cost of every deliverable',
        'The sponsor\'s preferred project lifecycle',
        'Steps in the current work nobody thought to mention',
        'The final schedule for the project',
      ], 2, 'Watching people work exposes real steps and workarounds that interviews and documents often miss.'),
      q('A WBS contains a gala dinner that was never approved. What should happen?', [
        'Keep it because the WBS is already drawn',
        'Hide it inside another work package',
        'Add it to the budget without telling anyone',
        'Remove it or raise it as a change request',
      ], 3, 'Under the 100 percent rule the WBS must not include work outside the approved scope.'),
      q('Which document lists exclusions, acceptance criteria and assumptions in detail?', [
        'The project scope statement',
        'The kickoff meeting agenda and notes',
        'The stakeholder register',
        'The change log kept by the project manager',
      ], 0, 'The scope statement details deliverables, acceptance criteria, exclusions, constraints and assumptions.'),
      q('Who decides whether a change request is approved?', [
        'Whoever requested the change',
        'The sponsor or change control board',
        'The newest team member',
        'The vendor doing the work',
      ], 1, 'Changes are approved by the authorised group, which on small projects may be the sponsor alone.'),
      ]
    ),
    chapter(
      'Estimating and Scheduling',
      'Turn your work breakdown structure into a realistic schedule by estimating effort and duration, linking activities through dependencies, finding the critical path, and presenting it as a Gantt chart with milestones you can defend.',
      [
      lesson('Estimating Effort and Duration', 13, `
An estimate is a reasoned guess about how much work something needs and how long it will take. It is never a promise. The goal is not to be perfectly right but to be honest about what you know, what you assume, and how uncertain the number is.

### Effort is not duration

Two words get mixed up constantly, and the mix-up wrecks schedules.

| Term | Meaning | Example |
|---|---|---|
| Effort | Total person-hours of work | Writing product descriptions needs 24 hours of work |
| Duration | Calendar time from start to finish | It will take 6 working days because the writer is only free 4 hours a day |
| Elapsed time | Calendar time including weekends and holidays | It finishes 8 calendar days later because of a weekend |

When a manager in Karachi asks "how long will the catalogue take?", they usually mean duration. When you estimate cost, you need effort. Always ask which one someone wants, and always note how available the person doing the work really is. A developer who also handles support calls is not available eight hours a day.

### Four common estimating techniques

The PMBOK Guide describes several estimating approaches. These four cover most real situations.

**Analogous estimating** uses a similar past project. "Last year's website for a Lahore clinic took six weeks, and this one is about the same size, so start with six weeks." It is fast and cheap but only as good as the similarity.

**Parametric estimating** uses a rate multiplied by a quantity. If your team has historically installed one point-of-sale terminal in about two hours, then 40 terminals is roughly 80 hours of effort. It works when you have reliable historical rates from your own work.

**Bottom-up estimating** estimates each work package in the WBS and adds them up. It takes longer but is usually the most accurate, because the people doing the work estimate the pieces they understand.

**Three-point estimating** asks for three numbers instead of one: optimistic (O), most likely (M) and pessimistic (P). You then combine them.

\`\`\`text
Task: set up the warehouse shelving
Optimistic (O)  = 4 days
Most likely (M) = 6 days
Pessimistic (P) = 11 days

Triangular average = (O + M + P) / 3      = (4 + 6 + 11) / 3 = 7.0 days
PERT (beta) average = (O + 4M + P) / 6    = (4 + 24 + 11) / 6 = 6.5 days
\`\`\`

The PERT formula weights the most likely value more heavily. Both give a number higher than the most likely value whenever the pessimistic case is far away, which is exactly the point: real risks pull the average up.

### Who should estimate

The people who will do the work should estimate it. A project manager who writes every estimate alone usually produces numbers the team does not believe and will not own. Your role is to ask good questions: What are you assuming? What could make this take twice as long? Have we done something like this before?

### Ranges and assumptions

Early in a project, give ranges rather than single numbers. "Four to seven weeks, assuming the client approves designs within three days" is more useful than "five weeks". Write the assumptions down. When an assumption breaks, such as approvals taking two weeks over Eid holidays, you can show exactly why the estimate changed instead of looking as though you were wrong.

### Common traps

- **Anchoring**: the first number anyone says, often from a senior person, pulls every later estimate towards it.
- **Padding in secret**: each person adds a hidden buffer, and the schedule bloats without anyone seeing where the slack is. Visible contingency is better, as later chapters show.
- **Forgetting non-work time**: reviews, travel, public holidays, power cuts and waiting for others all consume duration.
- **Estimating only the happy path**: testing, fixing and rework are part of the job.
      `,
        [
          q('A task needs 24 person-hours, and the only person who can do it works on it 4 hours a day. What is its duration?', [
            '24 working days of calendar time',
            '3 working days assuming an 8 hour day',
            '6 working days of calendar time',
            '4 working days because of the part-time rate',
          ], 2, 'Duration depends on availability, so 24 hours of effort at 4 hours per day takes 6 working days.'),
          q('Using the PERT formula, what is the estimate when O = 2, M = 5 and P = 14 days?', [
            '5 days, the most likely value',
            '6 days, from (2 + 20 + 14) / 6',
            '7 days, from (2 + 5 + 14) / 3',
            '14 days, the pessimistic value',
          ], 1, 'PERT weights the most likely value four times: (2 + 4 x 5 + 14) / 6 = 36 / 6 = 6 days.'),
          q('Which technique estimates each WBS work package and adds the results together?', [
            'Analogous estimating from one past project',
            'Parametric estimating with a unit rate',
            'Expert judgement from a senior manager',
            'Bottom-up estimating',
          ], 3, 'Bottom-up estimating builds the total from estimates of each work package, which is why it is usually the most accurate.'),
        ]
      ),
      lesson('Dependencies and Network Diagrams', 13, `
Activities rarely happen in isolation. You cannot test a website before it is built, and you cannot print brochures before the design is approved. Dependencies capture these links, and a network diagram shows them as a picture of how work flows.

### From work packages to activities

Your WBS lists deliverables. To schedule, break each work package into activities, the actions that produce it. "Shop signage" becomes "get quotes", "approve design", "fabricate sign" and "install sign". Each activity gets an estimate and a list of what must happen before it.

### The four dependency types

The PMBOK Guide uses the precedence diagramming method, where boxes are activities and arrows are dependencies. There are four logical relationships.

| Type | Rule | Example |
|---|---|---|
| Finish-to-start (FS) | B cannot start until A finishes | Install the sign after it is fabricated |
| Start-to-start (SS) | B cannot start until A starts | Proofreading can start once writing has started |
| Finish-to-finish (FF) | B cannot finish until A finishes | Documentation cannot finish until testing finishes |
| Start-to-finish (SF) | B cannot finish until A starts | The old security shift cannot end until the new shift starts |

Finish-to-start covers the large majority of real links. Start-to-finish is rare, and if you find yourself using it often, check your logic.

### Why the dependency exists

Knowing why a link exists tells you whether you can change it.

- **Mandatory** (hard logic): physically or contractually required. You cannot paint a wall before it is plastered.
- **Discretionary** (preferred logic): chosen because it is good practice. You prefer to finish the design before starting content, but you could overlap them if needed.
- **External**: depends on someone outside the team, such as a government permit, a landlord handing over keys, or a supplier delivering stock from abroad.
- **Internal**: depends on another team inside your organisation, such as IT setting up laptops.

External dependencies are where schedules often slip, because you control them least. Mark them clearly and follow them up early.

### Leads and lags

A **lag** is a forced wait after a dependency. Concrete must cure before you load it, so "pour floor, then lag of several days, then install machines". The exact curing time comes from the engineer or supplier, not from a general rule.

A **lead** lets the next activity start early. "Start drafting the user guide 5 days before development finishes" is a finish-to-start link with a 5 day lead.

### Drawing the network

Here is a small project: launching a website for a home bakery in Karachi.

\`\`\`text
ID  Activity              Duration  Depends on
A   Agree requirements    3 days    -
B   Design pages          5 days    A
C   Write content         4 days    A
D   Build site            6 days    B
E   Load content          2 days    C, D
F   Test and launch       3 days    E

        +--> B (5) --> D (6) --+
A (3) --+                      +--> E (2) --> F (3)
        +--> C (4) ------------+
\`\`\`

A diagram like this immediately shows things a task list hides. B and C can run in parallel after A. E is a merge point: it waits for both C and D, so a delay in either one holds it up. The next topic uses this same network to find the critical path.

### Practical tips

- Every activity except the first should have a predecessor, and every activity except the last should have a successor. Dangling activities usually mean a missing link.
- Draw the network with the team on a whiteboard or sticky notes before typing it into software. Arguments about order surface quickly.
- Keep activities a sensible size. A common guide is that one activity should fit within a single reporting period so you can track it.
      `,
        [
          q('Proofreading can begin as soon as writing has begun. Which dependency type is this?', [
            'Finish-to-start',
            'Start-to-start',
            'Finish-to-finish',
            'Start-to-finish',
          ], 1, 'Start-to-start means the second activity can start once the first has started.'),
          q('Waiting for a city authority to issue a building permit is which kind of dependency?', [
            'Discretionary, chosen by the team',
            'Internal, on another department',
            'External, outside the project',
            'Mandatory lead built into the plan',
          ], 2, 'A permit depends on someone outside the project team and organisation, so it is an external dependency.'),
          q('In the bakery network, why is activity E a merge point?', [
            'It cannot start until both C and D are finished',
            'It is the longest activity in the whole network',
            'It has no predecessors at all in the plan',
            'It can run at the same time as activity A',
          ], 0, 'E depends on both C and D, so whichever finishes later controls when E can begin.'),
        ]
      ),
      lesson('Finding the Critical Path', 14, `
The critical path is the longest path through the network. Its length is the shortest possible duration of the project. Any delay to an activity on it delays the finish date, unless you take action. Knowing which activities are critical tells you where to focus your attention.

### The simple method: add up each path

For small networks, list every path from start to finish and add the durations. Using the Karachi bakery website from the previous topic:

| Path | Calculation | Total |
|---|---|---|
| A, B, D, E, F | 3 + 5 + 6 + 2 + 3 | 19 days |
| A, C, E, F | 3 + 4 + 2 + 3 | 12 days |

The longest path is A, B, D, E, F at 19 days. That is the critical path, and 19 days is the minimum project duration.

### The forward and backward pass

For bigger networks, listing paths becomes impractical, so scheduling tools use two passes. Doing it by hand once makes the tools make sense.

**Forward pass** (earliest dates). Start at day 0. Early start (ES) is the latest early finish of all predecessors. Early finish (EF) = ES + duration.

**Backward pass** (latest dates). Start from the project finish. Late finish (LF) is the earliest late start of all successors. Late start (LS) = LF minus duration.

**Total float** = LS minus ES. It is how long an activity can slip without delaying the project.

\`\`\`text
Act  Dur  ES  EF  LS  LF  Float
A     3    0   3   0   3    0   critical
B     5    3   8   3   8    0   critical
C     4    3   7  10  14    7
D     6    8  14   8  14    0   critical
E     2   14  16  14  16    0   critical
F     3   16  19  16  19    0   critical
\`\`\`

Look at E in the forward pass: its predecessors are C (EF 7) and D (EF 14), so E starts at 14, the later of the two. In the backward pass, C must finish by 14 because E starts then, so C can start as late as day 10. That gives C seven days of float.

### What float means for you as a manager

Activity C, writing content, can slip up to seven days without moving the launch. That is useful flexibility. You could lend the writer to another urgent job for a few days, or start C later if the client is slow to send product photos.

Activities with zero float need daily attention. If the developer building the site (D) falls sick for two days, the launch moves by two days unless you recover the time somewhere else on the critical path.

Two cautions:

- **Float belongs to the path, not the person.** If C uses up five of its seven days, there are only two left for anything else on that path.
- **The critical path can change.** If C slips by more than seven days, path A, C, E, F becomes longer than 19 days and turns critical. Recheck the critical path every time you update the schedule.

### Near-critical paths

A path with only a day or two of float is near-critical. In practice it deserves almost as much attention as the critical path, because one small slip makes it the new critical path. Many experienced managers watch the top two or three paths, not just one.

### Resources change the picture

The critical path method assumes people are available whenever the logic allows. Real teams are limited. If the same designer must do both B and C, they cannot run in parallel, and the real schedule gets longer. Adjusting for limited people is called resource levelling, and it can extend the finish date even though the logic has not changed. Scheduling tools can level automatically, but always review what they did.
      `,
        [
          q('What does the length of the critical path tell you?', [
            'The total effort in person-hours for the project',
            'The number of team members the project needs',
            'The shortest possible duration of the project',
            'The amount of float on every activity in it',
          ], 2, 'The critical path is the longest path through the network, so the project cannot finish faster than its length.'),
          q('An activity has ES 4, EF 9, LS 7 and LF 12. What is its total float?', [
            '3 days',
            '5 days',
            '7 days',
            '12 days',
          ], 0, 'Total float is LS minus ES, which is 7 minus 4, giving 3 days.'),
          q('In the bakery example, activity C slips by 9 days. What happens?', [
            'Nothing changes, because C is not on the critical path',
            'The whole project finishes a full 9 days later than planned',
            'Only activity F is delayed, while the launch date holds',
            'The finish moves 2 days and C\'s path becomes critical',
          ], 3, 'C had 7 days of float, so a 9 day slip uses all of it and pushes the finish out by 2 days, making path A, C, E, F the critical path.'),
        ]
      ),
      lesson('Gantt Charts, Milestones and Schedule Compression', 13, `
A network diagram is great for logic but hard for a busy sponsor to read. A Gantt chart puts the same schedule on a calendar, and milestones give everyone clear checkpoints. When the date is too late, compression techniques help you pull it in.

### Reading a Gantt chart

A Gantt chart lists activities down the left and time across the top. Each activity is a bar from its start to its finish. Most tools also draw dependency arrows, highlight the critical path, and show progress as a filled portion of each bar.

\`\`\`text
Week:            1      2      3      4
A Requirements   ###
B Design            #####
C Content           ####
D Build                  ######
E Load content                 ##
F Test, launch                   ###
                                    ^ Launch milestone
\`\`\`

A Gantt chart is a communication tool. Keep the version you show stakeholders at a summary level, perhaps 10 to 20 lines, and keep the detailed version for the team.

### Milestones

A milestone is a significant point or event with zero duration. It marks that something is done or decided, not work being performed.

| Good milestones | Weak milestones |
|---|---|
| Design approved by client | Design 50% done |
| Shop handed over by landlord | Working on the shop |
| Payment gateway live in production | Gateway in progress |

Good milestones are binary: either they happened or they did not. Link them to decisions, approvals, handovers and payments. Many contracts in Pakistan and elsewhere tie vendor payments to milestones such as delivery or acceptance, so a clear milestone definition protects both sides.

### The schedule baseline

Once stakeholders agree the schedule, save a copy as the baseline. From then on, you compare actual progress to the baseline to see variance. Changing the baseline should go through your change control process, not happen quietly whenever things slip.

### Compressing the schedule

Sometimes the critical path says 19 weeks and the sponsor needs 15. Before cutting scope, two compression techniques are worth trying. Both only help when applied to critical path activities.

**Crashing** adds resources to shorten activities, usually for extra cost. Examples include paying overtime, hiring a second contractor, or renting extra equipment. Crash the critical activities that give the most time saved for the least extra cost, and stop when another path becomes critical.

**Fast tracking** overlaps activities that were planned in sequence, usually by changing discretionary dependencies. You might start building pages before every design is approved. It costs little money but adds risk of rework if earlier work changes.

| Technique | Main cost | Main risk |
|---|---|---|
| Crashing | Extra money | New people slow things down before they help |
| Fast tracking | Little extra money | Rework if earlier work changes |

Not every activity can be compressed. Adding a second painter may halve the painting time, but adding people to a task like approvals or curing concrete does nothing. Brooks's law from software engineering warns that adding people to a late software project can make it later, because new people need onboarding and coordination.

### When compression is not enough

If crashing and fast tracking cannot meet the date, present options to the sponsor openly:

1. Reduce scope, delivering the most important features first.
2. Move the date.
3. Accept a higher risk and document it.

Present these with the numbers from your schedule. A sponsor in Lahore who sees "15 weeks is possible only if we drop the mobile app from phase one" can make a real decision instead of hoping for a miracle.

### Keeping the schedule alive

Update progress at a regular rhythm, such as weekly. Record actual start and finish dates, update remaining durations, and recheck the critical path. A schedule that nobody updates becomes decoration within a month.
      `,
        [
          q('Which of these is the best example of a milestone?', [
            'Coding the checkout page for the store',
            'Design work about halfway complete',
            'Holding weekly meetings with the vendor',
            'Client signs approval of the final design',
          ], 3, 'A milestone is a zero-duration event that clearly either happened or did not, such as a signed approval.'),
          q('The team starts building pages before all designs are approved to save time. What is this?', [
            'Crashing the schedule',
            'Fast tracking the schedule',
            'Resource levelling the plan',
            'Rebaselining the project',
          ], 1, 'Overlapping activities that were planned in sequence is fast tracking, which saves time at the risk of rework.'),
          q('Why does crashing a non-critical activity usually not help the finish date?', [
            'Crashing is only allowed for milestones',
            'Non-critical activities have no cost at all',
            'Gantt charts cannot display those activities',
            'Shortening it does not shorten the longest path',
          ], 3, 'Only the critical path sets the finish date, so shortening an activity with float does not bring the end date in.'),
        ]
      ),
      ],
      [
      q('Your developer says a feature is "about 40 hours" but she also handles support half of each day. What should your schedule show?', [
        'A duration of 5 working days based on 8 hour days',
        'An effort of 20 hours because she is part time',
        'Roughly 10 working days of duration for 40 hours of effort',
        'Nothing, until she can work on it full time',
      ], 2, 'At about 4 productive hours a day, 40 hours of effort becomes roughly 10 working days of duration.'),
      q('Which statement about float is correct?', [
        'Float is how long an activity can slip without delaying the finish',
        'Every activity in a project has exactly the same float',
        'Float is the time added secretly to each estimate',
        'Critical activities always have the largest float',
      ], 0, 'Total float measures how far an activity can slip before it pushes out the project finish date.'),
      q('The sponsor wants the project two weeks earlier and has budget for overtime. Which technique fits best?', [
        'Crash critical path activities with paid overtime',
        'Add overtime to the activities with the most float',
        'Remove all milestones from the Gantt chart',
        'Change the baseline without telling anyone',
      ], 0, 'Crashing adds resources such as overtime to critical activities, which is the only place it shortens the project.'),
      q('Why should you write down the assumptions behind each estimate?', [
        'Assumptions make the estimate look more precise',
        'When one breaks, you can show why the estimate changed',
        'The PMBOK Guide forbids estimates without them',
        'It removes the need for the team to estimate',
      ], 1, 'Recorded assumptions let you explain changes clearly, for example when approvals take longer than assumed.'),
      ]
    ),
    chapter(
      'Budgets and Earned Value',
      'Build a cost estimate from your work breakdown structure, set aside the right reserves for risk, and use earned value to see in plain numbers whether a project is ahead or behind on both cost and schedule.',
      [
      lesson('Building a Cost Estimate and Budget', 13, `
A budget is not a single number someone writes on a slide. It is the sum of estimated costs for every piece of work, organised by time, so you can see how much money the project needs and when. Getting this right early prevents the awkward meeting where you ask the sponsor for more money halfway through.

### Start from the WBS

The most reliable cost estimates are built bottom-up from the work breakdown structure. For each work package, ask what it will consume.

| Cost category | Examples |
|---|---|
| Labour | Staff time, freelancers, contractors paid by the day |
| Materials | Furniture, cables, printed brochures, raw stock |
| Equipment | Laptops, generators, rented tools |
| Services | Hosting, software subscriptions, consultants, courier |
| Travel | Site visits from Lahore to Faisalabad, hotel nights |
| Fees and permits | Government fees, registration, licences |

Labour is usually the biggest and the most underestimated cost. Multiply the effort estimates from your schedule by a cost rate for each role. If your organisation has standard internal rates, use them. If not, ask finance or HR what to use rather than inventing one.

### Getting real prices

Prices for equipment, rent, imported parts and services change, sometimes quickly, especially when exchange rates move. Never copy a price from an old blog post or a friend's memory. Get written quotations from at least two or three suppliers, note the quote date and how long it is valid, and record whether tax is included. For tax and duty rates, check the current rules with your finance team or the relevant government authority, since these change too.

### A simple cost estimate

Here is a slice of a hypothetical estimate for setting up a small training room in a Karachi office. The figures are placeholders to show the structure, not real prices.

\`\`\`text
WBS   Work package          Basis of estimate                  Cost (PKR)
1.1   Furniture             Quote from Vendor A, valid 30 days   [quote]
1.2   Projector and screen  Lower of two quotes                  [quote]
1.3   Electrical work       Contractor quote, 3 days labour      [quote]
1.4   Internal staff time   40 hrs x internal rate               [calc]
                                                         Total:  [sum]
\`\`\`

The basis of estimate column matters as much as the number. Anyone reviewing the budget can see where each figure came from and whether it is still valid.

### From estimate to budget

The cost estimate tells you how much. The budget adds when. Spread each work package's cost across the weeks or months it happens, using your schedule. Adding these up period by period gives a time-phased budget.

\`\`\`text
Month         1        2        3        4
Planned     low     high     high      low
Cumulative  rises slowly, then steeply, then flattens
\`\`\`

Plotted as a running total, a time-phased budget usually forms an S-curve: slow at the start while you plan, steep in the middle when most work happens, and flat at the end during closing. This curve, before any reserves, is called the cost baseline in the PMBOK Guide. You will measure performance against it.

### Cash flow is a separate question

A project can be within budget and still run out of cash. If a supplier wants full advance payment but the client pays you only on delivery, you need to fund the gap. Small businesses in Pakistan often feel this sharply. Check payment terms with every major supplier and plan the timing of money in and money out, not just the total.

### Get the budget approved properly

Before work begins:

1. Walk the sponsor through the major cost lines and their basis.
2. State the assumptions, such as exchange rate used and quote validity dates.
3. Agree who can approve spending and up to what amount.
4. Record the approved budget as the baseline.

Approval thresholds protect you. If you know you can sign purchases below an agreed amount but need the sponsor above it, you avoid both delays and awkward surprises.
      `,
        [
          q('Why should every line of a cost estimate include a basis of estimate?', [
            'It makes the total budget look larger to the sponsor',
            'Reviewers can see where each figure came from and check it',
            'The tax authority requires it for every project',
            'It replaces the need to get supplier quotations',
          ], 1, 'The basis shows the source and validity of each number, so it can be reviewed and updated when things change.'),
          q('What shape does a cumulative time-phased budget usually make?', [
            'A flat horizontal line from start to end',
            'A straight line that falls over time',
            'An S-curve that is steepest in the middle',
            'A sharp spike in the very first week',
          ], 2, 'Spending is slow during planning, fastest during execution and slows again at closing, forming an S-curve.'),
          q('A project is within its total budget but cannot pay a supplier this month. What is the problem?', [
            'The cost baseline is too high',
            'The WBS is missing work packages',
            'The management reserve is too large',
            'Cash flow timing, not the total budget',
          ], 3, 'Money arriving later than it must be paid out creates a cash flow gap even when the total is fine.'),
        ]
      ),
      lesson('Contingency and Management Reserves', 12, `
Every estimate is uncertain. Reserves are how you budget honestly for that uncertainty, in the open, instead of hiding padding inside every line. The PMBOK Guide distinguishes two kinds, and the difference matters for who can spend them.

### Known unknowns and unknown unknowns

Some risks you can name in advance. You know the generator might fail during load shedding, or that a shipment might be held at port. You do not know whether it will happen, but you know it might. These are **known unknowns**.

Other problems nobody can foresee: a sudden change in regulations, a key supplier closing, a flood. These are **unknown unknowns**.

| Reserve | Covers | Part of cost baseline? | Who usually controls it |
|---|---|---|---|
| Contingency reserve | Known unknowns from the risk register | Yes | Project manager, within agreed rules |
| Management reserve | Unknown unknowns | No, but part of the total budget | Sponsor or management |

### How the pieces fit together

\`\`\`text
Work package estimates
+ Contingency reserves
= Cost baseline            (what performance is measured against)
+ Management reserve
= Project budget           (total money approved)
\`\`\`

When you use contingency for a risk that happens, the cost baseline does not change, because you already planned for it. When you need management reserve, you ask the sponsor, and once approved the money moves into the cost baseline through change control.

### Sizing contingency

There is no universal percentage, and you should be suspicious of anyone who quotes one as a rule. Good ways to size it:

- **From the risk register**: for each significant threat, estimate its cost impact and probability. Multiply them to get an expected value and add those up.
- **From three-point estimates**: the gap between the most likely and the weighted average estimate shows how much uncertainty you carry.
- **From history**: if your last five similar projects overran by a consistent pattern, that tells you something real about your organisation.

A worked example of the expected value method:

\`\`\`text
Risk                          Impact (PKR)   Probability   Expected value
Imported switch held at port      200,000         20%            40,000
Contractor rate increases         100,000         30%            30,000
Rework after client review         60,000         50%            30,000
                                             Contingency:       100,000
\`\`\`

These numbers are illustrative only. The method is what matters: each risk's possible cost weighted by how likely it is.

### Management reserve

Management reserve is usually set by the organisation, sometimes as a policy for a type of project. If your company has such a policy, follow it. If not, discuss it with your sponsor. The key point is that the project manager does not spend it alone.

### Rules for using reserves

Agree these at the start and write them in your plan:

1. Contingency is drawn only for risks that occur or for identified risk responses.
2. Every draw is logged with the risk ID, amount and reason.
3. Unused contingency for a risk that has passed is released or reported, not quietly spent elsewhere.
4. Requests for management reserve go to the sponsor with a short written case.

### Why visible reserves beat hidden padding

When each team member secretly adds a buffer, three things happen. The schedule and budget swell without anyone seeing why. Work expands to fill the padded time. And when a real problem hits, nobody can find the slack because it is scattered everywhere. A visible reserve owned by the project is smaller in total, easier to defend to a sponsor, and available where it is actually needed.
      `,
        [
          q('A generator might fail during load shedding, and you budget for it. Which reserve covers this?', [
            'Contingency reserve, since it is a known unknown',
            'Management reserve, since nobody can foresee it',
            'No reserve, since risks are not budgeted at all',
            'The cash flow plan, since it is a timing issue',
          ], 0, 'A named risk you can foresee is a known unknown, covered by contingency within the cost baseline.'),
          q('How does the project budget relate to the cost baseline?', [
            'The budget is smaller than the baseline',
            'They are always exactly the same amount',
            'The budget is the baseline plus management reserve',
            'The baseline is the budget plus contingency',
          ], 2, 'Contingency sits inside the cost baseline, and management reserve is added on top to form the total project budget.'),
          q('A risk could cost PKR 300,000 and has a 10% probability. What is its expected value?', [
            'PKR 3,000',
            'PKR 30,000',
            'PKR 270,000',
            'PKR 300,000',
          ], 1, 'Expected value is impact times probability: 300,000 x 0.10 = 30,000.'),
        ]
      ),
      lesson('Earned Value Basics: PV, EV and AC', 14, `
Imagine your sponsor asks, "Are we on budget?" You say you have spent half the money. Is that good or bad? It depends on how much work is actually done. Earned value management answers this by comparing three numbers that together show cost and schedule performance at the same time.

### The three core measures

| Measure | Question it answers | Also called |
|---|---|---|
| Planned value (PV) | How much work should be done by now, in money terms? | Budgeted cost of work scheduled |
| Earned value (EV) | How much work is actually done, in money terms? | Budgeted cost of work performed |
| Actual cost (AC) | How much have we actually spent? | Actual cost of work performed |

You also need the **budget at completion (BAC)**: the total planned budget for the work, from your cost baseline.

The clever idea is EV. It measures progress in budget terms. If a work package is budgeted at PKR 100,000 and it is 40% done, it has earned PKR 40,000 of value, regardless of what you have actually spent on it.

### A worked example

A Lahore company is fitting out a new office. These are illustrative figures.

\`\`\`text
BAC (total budget)          = PKR 1,000,000
Planned length              = 10 weeks, evenly spread

Status at the end of week 4:
Planned value  (PV) = 4/10 of 1,000,000      = 400,000
Work complete       = 35% of all the work
Earned value   (EV) = 35% of 1,000,000       = 350,000
Actual cost    (AC) = from the accounts       = 420,000
\`\`\`

Without earned value, the sponsor might hear "we have spent 420,000 of 1,000,000, which is 42%, and we are 40% of the way through the time". That sounds almost fine. Earned value tells a different story.

### Variances

Two simple subtractions tell you which way you are off.

\`\`\`text
Cost variance     CV = EV - AC = 350,000 - 420,000 = -70,000
Schedule variance SV = EV - PV = 350,000 - 400,000 = -50,000
\`\`\`

The rule to remember: **negative is bad**. A negative CV means the work done cost more than planned. A negative SV means less work is done than planned by this date. In the example, the project is both over budget and behind schedule.

Notice that both formulas start with EV. Earned value is always the reference point, because it is the only measure that reflects work actually completed.

### Measuring percent complete honestly

EV is only as good as your percent complete. "The developer says it is 90% done" is famously unreliable, since the last 10% often takes as long as the first 90. Safer rules:

- **0/100**: a work package earns nothing until it is finished. Strict, best for short tasks.
- **50/50**: earns half when it starts and half when it finishes. A common compromise.
- **Milestone weights**: earn fixed portions at defined, checkable milestones, such as design approved, built, tested.

Pick a rule and apply it consistently. The smaller your work packages, the less the rule matters.

### Where the numbers come from

PV comes from your time-phased budget. AC comes from accounting or your own spending log, and it must cover the same work and period as EV. A common mistake is comparing AC that includes invoices for materials not yet used with EV that counts only completed work. Agree with finance how costs are recorded, including committed purchase orders, before the first report.
      `,
        [
          q('A work package is budgeted at PKR 200,000 and is 25% complete. What is its earned value?', [
            'PKR 50,000',
            'PKR 25,000',
            'PKR 150,000',
            'PKR 200,000',
          ], 0, 'Earned value is percent complete times the budget: 25% of 200,000 is 50,000.'),
          q('EV is 500,000 and AC is 560,000. What is the cost variance, and what does it mean?', [
            '+60,000, the project is under budget',
            '-60,000, the project is behind schedule',
            '+60,000, the project is ahead of schedule',
            '-60,000, the work done cost more than planned',
          ], 3, 'CV = EV - AC = -60,000; a negative cost variance means the completed work cost more than its budget.'),
          q('Why is the 0/100 rule useful for measuring percent complete?', [
            'It makes every project look ahead of schedule',
            'It removes the need to track actual costs',
            'It avoids over-optimistic claims about unfinished work',
            'It is the only rule the PMBOK Guide allows',
          ], 2, 'Earning nothing until a work package is finished stops vague claims like "90% done" from inflating EV.'),
        ]
      ),
      lesson('Reading CPI, SPI and Forecasts', 14, `
Variances tell you the size of the problem in money. Indices tell you the rate of performance, which lets you compare projects of different sizes and forecast where the project will end up.

### The two performance indices

\`\`\`text
Cost performance index      CPI = EV / AC
Schedule performance index  SPI = EV / PV
\`\`\`

| Value | CPI means | SPI means |
|---|---|---|
| Greater than 1 | Under budget: more value than cost | Ahead of schedule |
| Exactly 1 | On budget | On schedule |
| Less than 1 | Over budget | Behind schedule |

Continuing the Lahore office fit-out from the previous topic (BAC 1,000,000, PV 400,000, EV 350,000, AC 420,000):

\`\`\`text
CPI = 350,000 / 420,000 = 0.83
SPI = 350,000 / 400,000 = 0.875
\`\`\`

A CPI of 0.83 means you are getting about 83 paisa of planned work for every rupee spent. An SPI of 0.875 means you are progressing at about 87.5% of the planned rate.

### Forecasting the final cost

The most common forecast assumes the current cost efficiency continues.

\`\`\`text
Estimate at completion  EAC = BAC / CPI       = 1,000,000 / 0.83 = about 1,200,000
Estimate to complete    ETC = EAC - AC        = 1,200,000 - 420,000 = 780,000
Variance at completion  VAC = BAC - EAC       = 1,000,000 - 1,200,000 = -200,000
\`\`\`

In plain words: if nothing changes, the fit-out will cost about 1.2 million, roughly 200,000 over budget, and you still need about 780,000 to finish.

This formula is a forecast, not a fate. Other EAC methods exist. If the overrun came from a one-off problem that will not repeat, a simpler forecast is EAC = AC + (BAC - EV), which assumes the remaining work goes to plan. Choose the method that matches what actually caused the variance, and say which one you used.

### How hard must the rest of the work go?

The to-complete performance index (TCPI) shows the efficiency needed on remaining work to hit a target.

\`\`\`text
TCPI (to finish on the original BAC) = (BAC - EV) / (BAC - AC)
                                     = 650,000 / 580,000 = about 1.12
\`\`\`

You have been running at 0.83 and now need 1.12. That jump is rarely realistic without changing something. A TCPI well above your current CPI is a strong signal to talk to the sponsor about extra funding or reduced scope now, not in the final month.

### A word of caution about SPI

SPI uses money, not time. At the end of a project, all planned work is done, so EV equals PV and SPI becomes 1.0, even if the project finished months late. In the later stages, check the schedule itself and the critical path rather than relying on SPI alone. SPI also ignores whether the completed work was on the critical path; you might be ahead on easy tasks and behind on critical ones.

### Turning numbers into a status message

Sponsors rarely want formulas. Translate:

\`\`\`text
Weak:   "CPI is 0.83 and SPI is 0.875."
Better: "Work done so far has cost about 20% more than budgeted, and
         we are slightly behind. If this continues we finish near 1.2 million against
         1.0 million. Main cause: electrical rework. Options: approve
         200,000 from management reserve, or drop the meeting room
         upgrade. Decision needed by Friday."
\`\`\`

Earned value is most useful when it is reported regularly, from the same rules each time, and combined with a clear explanation of causes and options. A trend over several weeks says far more than one snapshot.
      `,
        [
          q('EV is 300,000 and AC is 250,000. What is the CPI, and is that good?', [
            '0.83, the project is over budget',
            '1.2, more value is earned than spent',
            '1.2, the project is behind schedule',
            '0.83, the project is ahead of schedule',
          ], 1, 'CPI = 300,000 / 250,000 = 1.2, and a CPI above 1 means the work done cost less than planned.'),
          q('BAC is 2,000,000 and CPI is 0.8. Assuming performance continues, what is the EAC?', [
            '2,500,000',
            '1,600,000',
            '2,000,000',
            '2,800,000',
          ], 0, 'EAC = BAC / CPI = 2,000,000 / 0.8 = 2,500,000.'),
          q('Why can SPI be misleading near the end of a late project?', [
            'SPI only measures cost, not progress',
            'SPI cannot be calculated after the halfway point',
            'SPI always shows a value below zero',
            'EV approaches PV, so SPI drifts towards 1.0 anyway',
          ], 3, 'Once all planned work is done EV equals PV, so SPI returns to 1.0 even if the finish date was missed.'),
        ]
      ),
      ],
      [
      q('At week 6, PV is 600,000, EV is 540,000 and AC is 500,000. Which statement is correct?', [
        'Over budget and ahead of schedule',
        'Over budget and behind schedule',
        'Under budget and behind schedule',
        'Under budget and ahead of schedule',
      ], 2, 'CV = 540,000 - 500,000 is positive (under budget) and SV = 540,000 - 600,000 is negative (behind schedule).'),
      q('Who normally approves spending from the management reserve?', [
        'Any team member who finds a problem',
        'The sponsor or management, through change control',
        'The supplier who raised the invoice',
        'The project manager alone, with no record',
      ], 1, 'Management reserve sits outside the cost baseline and is released by management, usually through change control.'),
      q('Your TCPI to meet BAC is 1.25 while your CPI has been 0.9 for months. What should you do?', [
        'Keep going and hope performance improves',
        'Recalculate PV until the numbers match',
        'Stop reporting earned value to the sponsor',
        'Raise it with the sponsor now and present options',
      ], 3, 'A required efficiency far above current performance is unrealistic, so early discussion of funding or scope is needed.'),
      q('You need a price for imported equipment. What is the best basis for the estimate?', [
        'Current written quotes with dates and validity periods',
        'A price from a blog post written a few years ago',
        'The figure a colleague remembers paying once',
        'Last year\'s invoice adjusted by a guess',
      ], 0, 'Prices and exchange rates change, so dated, written quotations with their validity give a reliable basis.'),
      ]
    ),
    chapter(
      'Risk, Quality and Communication',
      'Find and rank the risks that could hurt or help your project, plan responses and track them in a risk register, define quality and acceptance criteria up front, and keep stakeholders informed with a communication plan and clear status reports.',
      [
      lesson('Identifying and Assessing Risks', 13, `
A risk is an uncertain event or condition that, if it happens, affects at least one project objective. Two words in that definition matter. **Uncertain** means it has not happened yet; once it happens, it is an issue. **Affects** can be negative or positive: the PMBOK Guide treats threats and opportunities as two sides of risk.

### Threats and opportunities

| Type | Example for a Lahore garment exporter's new website |
|---|---|
| Threat | The payment gateway approval takes longer than expected |
| Threat | The lead developer leaves mid-project |
| Opportunity | A buyer at a trade fair wants a demo early, which could bring an order |
| Opportunity | A reusable design template cuts build time if it fits |

Most teams only list threats. Asking "what could go better than planned?" often finds opportunities worth chasing.

### Writing a clear risk statement

Vague risks like "budget" or "vendor problems" cannot be managed. Use a cause, event, effect structure.

\`\`\`text
Because   our hosting provider has had outages in the past month (cause),
there is a risk that   the site goes down during the launch campaign (event),
which would   lose orders and damage trust with new customers (effect).
\`\`\`

The cause tells you what you can act on. The effect tells you which objective is at stake.

### Ways to identify risks

- **Brainstorm with the team and key stakeholders.** People closest to the work know where things break.
- **Review lessons learned** from similar past projects. The same problems repeat with surprising regularity.
- **Check your assumptions.** Every assumption in your charter, scope and estimates is a potential risk if it turns out false.
- **Walk the WBS and schedule.** Look at external dependencies, new technology, single points of failure and activities with no float.
- **Use a prompt list.** Categories such as technical, external, organisational and project management help people think wider.

Local conditions belong on the list where relevant: power outages, internet disruption, public holidays, import delays, weather during monsoon season, and changes in regulations. Treat each as a proper risk with a cause and effect, not a general complaint.

### Assessing risks qualitatively

You cannot respond to everything, so rank the risks. Rate each one for probability and impact on a simple scale, then combine them.

| Probability \\ Impact | Low (1) | Medium (2) | High (3) |
|---|---|---|---|
| High (3) | 3 | 6 | 9 |
| Medium (2) | 2 | 4 | 6 |
| Low (1) | 1 | 2 | 3 |

Agree in advance what the levels mean for your project so people rate consistently. For example, high impact on schedule might mean "delays a milestone by more than two weeks". Without definitions, one person's high is another person's medium.

Scores of 6 or 9 get active responses. Scores of 1 or 2 may simply be watched. This is a prioritisation tool, not a precise calculation.

### Quantitative analysis, briefly

On larger projects, teams sometimes go further and estimate risk impacts in money and time, then use techniques such as expected monetary value or simulation to see the overall effect on cost and finish date. For most small and medium projects, a well-run qualitative assessment is enough. The expected value calculation you saw for contingency reserves is the simplest form of quantitative analysis.

### Risk is a continuous activity

Risk identification is not a one-time workshop at kickoff. New risks appear as the project moves, and old ones change or disappear. Add a short risk check to your regular team meeting: "Anything new that worries you? Has anything on the list changed?" Five minutes a week catches far more than one big session at the start.
      `,
        [
          q('A supplier has already delivered the wrong cables and the team must wait. Is this a risk?', [
            'Yes, it is a high probability risk',
            'Yes, it is a positive risk or opportunity',
            'No, it has happened, so it is an issue',
            'No, supplier problems are never risks',
          ], 2, 'A risk is uncertain and in the future; once the event occurs it becomes an issue to resolve.'),
          q('Which risk statement is most useful?', [
            '"Because the vendor is new, delivery may slip, delaying launch"',
            '"Budget risk: we may spend more money than we expect to spend"',
            '"Vendor problems might happen at some point during the project"',
            '"Something could go wrong with the server, so watch it closely"',
          ], 0, 'A cause, event and effect statement shows what to act on and which objective is affected.'),
          q('Why should a team agree what "high impact" means before rating risks?', [
            'So that different people rate risks consistently',
            'So that every risk can be rated as low impact',
            'Because the PMBOK Guide gives fixed numbers for it',
            'So that opportunities can be left off the list',
          ], 0, 'Shared definitions stop one person\'s high from being another person\'s medium, which keeps the ranking meaningful.'),
        ]
      ),
      lesson('Risk Responses and the Risk Register', 13, `
Identifying risks is only useful if you decide what to do about them. The PMBOK Guide describes a set of response strategies for threats and a matching set for opportunities. Each risk then gets an owner and lives in the risk register.

### Responses to threats

| Strategy | What it means | Example |
|---|---|---|
| Avoid | Change the plan to remove the threat | Drop a feature that depends on an unproven third-party service |
| Mitigate | Reduce probability or impact | Run a test transaction weeks before launch; arrange a backup UPS |
| Transfer | Shift the impact to a third party | Buy insurance; use a fixed-price contract with a vendor |
| Accept | Acknowledge it and take no action now, or set aside contingency | Accept a minor risk of a short delay in printing |
| Escalate | Pass it to a higher level when it is outside the project's authority | A citywide regulation change goes to senior management |

Transfer does not make the risk disappear. If a courier company is responsible for delivery, a late parcel still hurts your launch; you have only shifted the financial consequence.

Acceptance can be passive (deal with it if it happens) or active (set aside contingency time or money).

### Responses to opportunities

| Strategy | What it means | Example |
|---|---|---|
| Exploit | Make sure the opportunity happens | Assign your best developer to finish the demo before the trade fair |
| Enhance | Increase its probability or impact | Prepare a polished sample so an early demo is more likely to win the order |
| Share | Partner with someone better placed to capture it | Team up with a logistics firm to bid jointly |
| Accept | Take it if it comes, without effort to pursue it | Use a free upgrade if the vendor offers one |
| Escalate | Pass it upwards if it is bigger than the project | A chance to sell the product to a whole retail chain |

### Triggers and contingency plans

A **trigger** is a warning sign that a risk is about to happen. "If the payment gateway has not confirmed approval by 1 March" is a trigger. Tie a **contingency plan** to it: "launch with cash on delivery only and add online payment later". Having the decision made in advance means the team can act calmly instead of scrambling.

### Risk owners

Every significant risk needs one named owner: the person responsible for watching it and carrying out the response. It does not have to be the project manager. The procurement officer is a natural owner for supplier risks; the lead developer for technical ones. A risk owned by "the team" is owned by nobody.

### The risk register

The risk register is the single list where all this is recorded. A spreadsheet is fine.

\`\`\`text
ID   Risk (cause, event, effect)          P  I  Score  Response         Owner     Trigger                Status
R01  New gateway approval may slip,       2  3    6    Mitigate: apply  Ayesha    No approval by 1 Mar    Open
     delaying online payments                          early; COD as
                                                       fallback
R02  Lead dev may leave, slowing build     1  3    3    Mitigate: pair   Bilal     Resignation notice      Open
                                                       programming,
                                                       documented code
R03  Trade fair demo request could         2  2    4    Enhance: prep    Usman     Buyer email received    Open
     bring an early order                              demo by Feb
\`\`\`

Typical columns are ID, description, probability, impact, score, response, owner, trigger, contingency plan, and status. Some teams add date raised and date last reviewed.

### Keeping the register alive

- Review the top risks in every regular team meeting, and the full register at a slower rhythm such as monthly.
- Close risks that have passed and say what happened.
- Watch **secondary risks**, new risks created by your responses. Switching to a backup vendor might introduce a new quality risk.
- Report the top few risks to the sponsor in every status report.

A register written at kickoff and never opened again is one of the most common failures in project management. A short, current register is worth far more than a long, stale one.
      `,
        [
          q('You buy insurance against damage to equipment in transit. Which threat response is this?', [
            'Avoid',
            'Mitigate',
            'Transfer',
            'Exploit',
          ], 2, 'Insurance shifts the financial impact of the threat to a third party, which is transfer.'),
          q('Who should own a supplier delivery risk on most projects?', [
            'Everyone on the team together',
            'One named person, such as the procurement lead',
            'The supplier who might cause the delay',
            'Nobody, until the risk actually happens',
          ], 1, 'A single named owner is accountable for watching the risk and carrying out the response.'),
          q('Switching to a backup vendor creates a new quality concern. What is this called?', [
            'An opportunity that should be exploited',
            'A trigger for the original risk response',
            'A residual issue already on the register',
            'A secondary risk caused by the response',
          ], 3, 'New risks that arise from implementing a response are secondary risks and belong in the register.'),
        ]
      ),
      lesson('Quality Planning and Acceptance Criteria', 13, `
Quality means the deliverables meet the requirements and are fit for their purpose. It does not mean gold-plated or luxurious. A plain, reliable product that does exactly what was agreed is high quality. A beautiful one that crashes is not.

### Quality is not grade

The PMBOK Guide separates two ideas people often mix up.

| Term | Meaning | Example |
|---|---|---|
| Quality | How well the product meets its requirements | The app works without errors and loads fast enough |
| Grade | The category or level of features | A basic app versus a premium app with many features |

A low-grade product can be high quality: a simple, bug-free ordering form for a Karachi pharmacy. A high-grade product can be low quality: a feature-rich app full of bugs. Low quality is always a problem. Low grade may be exactly what the client wants.

### Prevention over inspection

Finding defects late is expensive. A wrong measurement caught on paper costs an eraser; caught after the cupboards are built, it costs materials and days. The idea of the cost of quality captures this.

| Cost category | Examples |
|---|---|
| Prevention | Training, clear standards, templates, design reviews |
| Appraisal | Testing, inspections, audits |
| Internal failure | Rework and scrap found before delivery |
| External failure | Returns, complaints, warranty work, lost customers |

The first two are the cost of good quality. The last two are the cost of poor quality. Spending a little on prevention usually saves much more in failure costs.

### The quality plan

For a small project, a quality plan can be one page. It answers:

1. **What standards apply?** Company brand guidelines, building codes, accessibility standards, client specifications.
2. **How will we check?** Peer review, testing, inspection, sign-off.
3. **Who checks?** Name people, not departments.
4. **When?** Build checks into the schedule as real activities with time, not afterthoughts.
5. **What happens with defects?** How they are logged, prioritised and fixed.

### Acceptance criteria

Acceptance criteria are the conditions a deliverable must meet before the customer or sponsor accepts it. They turn "make a good brochure" into something you can check.

\`\`\`text
Deliverable: Product brochure for a Sialkot sports goods maker
Acceptance criteria:
  - A4 size, 8 pages, full colour, on the paper stock in the approved quote
  - All product names and codes match the current price list
  - Logo and colours follow the brand guide
  - Proofread and signed off by the marketing manager
  - 2,000 copies delivered to the factory by 15 April
\`\`\`

Good acceptance criteria are specific, measurable and agreed before work starts. Each one can be answered with yes or no. Write them with the person who will accept the work, not alone. Most acceptance disputes come from criteria that were never written down.

### Verify, then validate

Two checks happen at different moments.

- **Quality control** checks the deliverable is correct against requirements, usually inside the team. Did the printer use the right paper? Are the codes correct?
- **Scope validation** is the formal acceptance by the customer or sponsor. They review the deliverable against the acceptance criteria and sign it off.

Do your own quality control first. Handing an unchecked deliverable to a client for acceptance turns them into your testers and damages trust.

### Continuous improvement

Quality management also means improving the process, not just fixing the product. When the same type of defect keeps appearing, ask why several times until you reach a root cause. If brochure codes are wrong again and again, the real fix may be pulling them directly from the price list file instead of retyping them.
      `,
        [
          q('A client wants a simple, bug-free booking form with few features. How would you describe it?', [
            'Low quality and low grade',
            'High quality and high grade',
            'Low grade but potentially high quality',
            'High grade but low quality',
          ], 2, 'Grade is the level of features and quality is meeting requirements, so a simple but reliable product is low grade and high quality.'),
          q('Which is an example of a prevention cost of quality?', [
            'Training staff on the brand style guide',
            'Reprinting brochures that had errors',
            'Handling returns from unhappy customers',
            'Inspecting a finished batch of products',
          ], 0, 'Training prevents defects from being made in the first place, which is a prevention cost.'),
          q('What makes an acceptance criterion useful?', [
            'It uses words like "good" and "professional"',
            'It is written by the vendor after delivery',
            'It is kept private from the customer',
            'It is specific and can be answered yes or no',
          ], 3, 'Specific, checkable criteria agreed in advance make acceptance clear and prevent disputes.'),
        ]
      ),
      lesson('Communication Plans and Status Reports', 13, `
Many project failures are really communication failures. The work was fine, but the sponsor was surprised, a key stakeholder was left out, or a decision was made on old information. A communication plan prevents this by deciding in advance who needs what, when, and how.

### Why communication gets harder as teams grow

Each pair of people is a possible communication channel. The number of channels grows quickly.

\`\`\`text
Channels = n (n - 1) / 2

 4 people  ->  6 channels
 8 people  -> 28 channels
15 people  -> 105 channels
\`\`\`

Adding a few people to a project multiplies the number of conversations that can go wrong. This is why structured communication matters more as projects grow.

### The communication plan

A communication plan is usually a simple table built from your stakeholder register.

| What | Audience | Purpose | Method | Frequency | Owner |
|---|---|---|---|---|---|
| Status report | Sponsor, steering group | Progress, risks, decisions needed | Email with one-page report | Weekly, Friday | PM |
| Team stand-up | Project team | Coordinate daily work | Short meeting or call | Daily | Team lead |
| Steering meeting | Sponsor, department heads | Decisions, approvals | Meeting with agenda | Monthly | PM |
| Customer update | Client contact | Milestones, upcoming needs | Call plus written summary | Every two weeks | Account manager |
| Project board | Everyone | Current tasks and status | Shared board or tracker | Always live | Whole team |

Match the method to the purpose. The PMBOK Guide describes three broad methods:

- **Interactive**: meetings, calls, video. Best for decisions, problems and anything sensitive.
- **Push**: emails, reports, messages sent to people. Good for updates that need a record.
- **Pull**: shared drives, dashboards, intranet pages people visit when they need information. Good for large audiences and reference material.

### WhatsApp groups and chat tools

In Pakistan, many projects run on WhatsApp groups. They are fast and everyone already has them, but decisions get buried among hundreds of messages, files get lost, and it is unclear who agreed to what. Use chat for quick coordination, but record decisions, approvals and change requests in one agreed place, such as a decision log, email or the project tool. A simple rule helps: "If it changes scope, cost or dates, it goes in writing outside the chat."

### Writing a good status report

A status report should let a busy reader understand the situation in under a minute.

\`\`\`text
PROJECT: Clinic booking system      PERIOD: week ending 12 April
OVERALL: AMBER

Summary: Build is on track. Payment integration is 1 week behind
because bank test credentials arrived late.

Done this period:   Patient registration screens; doctor schedule setup
Next period:        Payment testing; staff training plan
Top risks:          R04 Payment approval may slip further (owner: Hina)
Decisions needed:   Approve launch with cash payment only if online
                    payment is not ready by 30 April. Needed by 19 April.
Milestones:         Design sign-off  DONE | UAT start 22 Apr  AT RISK
\`\`\`

### Using red, amber and green honestly

RAG status gives a quick visual signal, but only if it is honest. Define what each colour means for your project, for example green as on track, amber as at risk but recoverable within the team, and red as needing sponsor help. A project that stays green for months then jumps straight to red has usually been hiding problems. Reporting amber early is a sign of control, not failure.

### Tailor to the audience

The sponsor wants outcomes, risks and decisions. The team wants tasks and dependencies. The client wants milestones and what is needed from them. Same project, different messages. Also consider language: a summary in Urdu for site staff or shop-floor workers may land far better than a long English email.

### Listening is communication too

Communication plans tend to focus on sending. Build in ways to receive: regular one-to-ones, a question slot in team meetings, and asking stakeholders how the updates are working for them. Adjust the plan when it is not working.
      `,
        [
          q('A team grows from 5 to 10 people. How many communication channels are there now?', [
            '10',
            '45',
            '90',
            '100',
          ], 1, 'Using n(n - 1)/2, ten people give 10 x 9 / 2 = 45 channels.'),
          q('Which communication method suits a large audience looking up reference material when needed?', [
            'Interactive, such as a meeting with everyone',
            'Pull, such as a shared dashboard or drive',
            'Push, such as a daily message to all',
            'Private calls to each person every day',
          ], 1, 'Pull communication lets many people access information when they need it without being sent everything.'),
          q('A client approves a scope change in a busy WhatsApp group. What should you do?', [
            'Nothing, the chat message is a full record',
            'Delete the message to keep the group tidy',
            'Ask the client to repeat it in a voice note',
            'Record the decision in the agreed formal place',
          ], 3, 'Decisions that affect scope, cost or dates should be recorded outside the chat, where they will not be lost.'),
        ]
      ),
      ],
      [
      q('A good opportunity appears: an early demo might win a big order. Which response increases its chances?', [
        'Avoid',
        'Transfer',
        'Mitigate',
        'Enhance',
      ], 3, 'Enhance increases the probability or impact of an opportunity, such as preparing a polished demo.'),
      q('In a risk register, what is a trigger?', [
        'A warning sign that a risk is about to happen',
        'The person who is accountable for the risk',
        'The total cost of the risk if it occurs',
        'The date the risk was first written down',
      ], 0, 'A trigger is an early signal that tells the owner to act on the contingency plan.'),
      q('What is the difference between quality control and scope validation?', [
        'They are two names for the same activity',
        'Control checks correctness; validation is formal acceptance',
        'Validation happens first, then quality control',
        'Quality control is done only by the client',
      ], 1, 'The team checks deliverables against requirements in quality control, then the customer formally accepts them in scope validation.'),
      q('A project has been green for three months and suddenly turns red. What does this most likely show?', [
        'The RAG colours were defined very carefully',
        'The sponsor did not read the reports at all',
        'Problems were probably hidden instead of reported early',
        'Red status is always caused by external events',
      ], 2, 'Projects rarely fail overnight, so a jump from green to red usually means earlier warning signs were not reported.'),
      ]
    ),
    chapter(
      'Agile Values and Principles',
      'Learn the four values and twelve principles of the Agile Manifesto and what they look like in real work, then write user stories with clear acceptance criteria and size them with relative estimation and story points.',
      [
      lesson('The Agile Manifesto and Its Four Values', 13, `
In February 2001, seventeen software practitioners met at a ski resort in Snowbird, Utah. Several of them had been developing lighter ways of working, such as Scrum and Extreme Programming. They agreed on a short statement now known as the Manifesto for Agile Software Development, published at agilemanifesto.org. It is only a few lines long, and it still shapes how many teams work today.

### The four values

The manifesto says the authors came to value:

| We value this more | Over this |
|---|---|
| Individuals and interactions | Processes and tools |
| Working software | Comprehensive documentation |
| Customer collaboration | Contract negotiation |
| Responding to change | Following a plan |

It then adds a sentence many people skip: while there is value in the items on the right, the authors value the items on the left more.

That sentence matters. Agile does not say "no processes", "no documentation", "no contracts" or "no plans". It says that when they conflict, the left side wins.

### Individuals and interactions over processes and tools

A good process helps, but it cannot replace people talking. If a developer and a designer in a Lahore agency can resolve a question in a five-minute conversation, filing a formal ticket and waiting two days for a reply is the process getting in the way. Tools like Jira are useful, but buying a tool does not make a team agile.

### Working software over comprehensive documentation

The best evidence of progress is something that works. A 60-page specification describing a mobile banking feature tells you less than a working screen the customer can tap through. Teams still write documentation, but just enough for it to be useful, and they show real working results often.

Outside software, read "working software" as a usable result: a tested prototype of a product, a finished section of a training course, or a pilot of a new process in one branch.

### Customer collaboration over contract negotiation

Contracts set the framework, but the best results come from working with the customer throughout, not arguing over clauses. A Karachi software house that shows its client progress every two weeks and adjusts together usually ends up with a happier client than one that disappears for six months and then argues about what the contract meant.

### Responding to change over following a plan

Plans are valuable, and agile teams plan constantly, but in shorter horizons. When the market shifts, a competitor launches, or users react differently than expected, an agile team changes course. Sticking to an outdated plan just because it was approved delivers the wrong thing on time.

### Common misreadings

\`\`\`text
Misreading                          What the manifesto actually says
"Agile means no planning"           Plans exist, but adapt as you learn
"Agile means no documentation"      Document what is useful, not everything
"Agile means no deadlines"          Deliver frequently, often in fixed timeboxes
"Agile is a methodology"            It is a set of values and principles;
                                    Scrum and Kanban are ways to apply them
\`\`\`

### Where the manifesto fits with this course

The manifesto is not a method. It is a mindset. Scrum, Kanban and other frameworks are ways of putting it into practice, and you will study them in later chapters. The PMBOK Guide also recognises agile and hybrid approaches alongside predictive ones, so an agile mindset is useful whichever lifecycle your project uses.

### A quick self-check for your team

Ask these questions about your current project:

1. When people hit a problem, do they talk first or file paperwork first?
2. How often does the customer see something that actually works?
3. Do we treat the customer as a partner or as an opponent?
4. When we learn something new, can we change the plan easily?

Honest answers show where you sit between the left and right side of each value.
      `,
        [
          q('What does the Agile Manifesto say about the items on the right, such as documentation and plans?', [
            'They should be removed from agile projects',
            'They have value, but the items on the left are valued more',
            'They are only needed for government contracts',
            'They matter more than the items on the left',
          ], 1, 'The manifesto states there is value in the items on the right, but the authors value the items on the left more.'),
          q('Which pair is one of the four Agile Manifesto values?', [
            'Speed of delivery over quality of work',
            'Tools and technology over processes',
            'Meeting deadlines over controlling budgets',
            'Responding to change over following a plan',
          ], 3, 'Responding to change over following a plan is one of the four values; the others are not part of the manifesto.'),
          q('For a team that does not build software, how is "working software" best interpreted?', [
            'The value does not apply to non-software teams',
            'They must first buy project software tools',
            'A usable result, such as a tested prototype or pilot',
            'A complete, approved specification document',
          ], 2, 'The value is about showing real, usable results rather than documents describing them, which applies beyond software.'),
        ]
      ),
      lesson('The Twelve Agile Principles in Practice', 14, `
Behind the four values, the manifesto authors wrote twelve principles. They are more concrete than the values and give practical guidance. The original text is on agilemanifesto.org; the table below paraphrases each one with an example of what it looks like in practice.

### The principles, paraphrased

| # | Principle in brief | What it looks like |
|---|---|---|
| 1 | Satisfy the customer through early and continuous delivery of valuable software | Release a basic version early, then improve it |
| 2 | Welcome changing requirements, even late, for the customer's advantage | Treat a new request as information, not an insult |
| 3 | Deliver working software frequently, from a couple of weeks to a couple of months, preferring shorter | Short, regular delivery cycles |
| 4 | Business people and developers work together daily | A product contact who is reachable every day, not once a month |
| 5 | Build projects around motivated individuals, give them support and trust them | Remove obstacles instead of micromanaging |
| 6 | Face-to-face conversation is the most efficient and effective way to convey information | Talk first; write down the outcome |
| 7 | Working software is the primary measure of progress | Show what works, not percent complete |
| 8 | Sustainable development: a constant pace that can be kept up indefinitely | No permanent overtime culture |
| 9 | Continuous attention to technical excellence and good design enhances agility | Clean work now makes change cheaper later |
| 10 | Simplicity, the art of maximising the amount of work not done, is essential | Do not build features nobody asked for |
| 11 | The best architectures, requirements and designs emerge from self-organising teams | The team decides how to do the work |
| 12 | At regular intervals the team reflects on how to become more effective and adjusts | Regular retrospectives with real changes |

### Principles that challenge traditional habits

**Welcoming change (principle 2).** In many organisations, a late change request is seen as a failure of the requirements stage. Agile reframes it: if a customer of a Lahore e-commerce startup learns that buyers prefer cash on delivery, building that now beats launching a product nobody uses. Change still has a cost, and the product owner decides what gets dropped to make room.

**Face-to-face conversation (principle 6).** Written in 2001, this was about people talking directly instead of passing documents. For remote teams spread across Islamabad, Karachi and abroad, video calls with cameras on and quick voice conversations serve the same purpose better than long email chains.

**Sustainable pace (principle 8).** Teams that work late every night for months make more mistakes and lose good people. If deadlines regularly need heroics, the plan is wrong, not the people.

**Simplicity (principle 10).** This one is often quoted because it is counter-intuitive. The most productive teams are good at not doing things: not building the rarely used admin report, not adding the extra settings screen. Every feature has to be built, tested and maintained.

### From principles to daily behaviour

\`\`\`text
Situation                                Principle-driven response
Client asks for a new report mid-month   Discuss value, add to the list,
                                         drop something less important
Team member works till midnight daily    Investigate the plan; pace must
                                         be sustainable (8)
Manager wants 100% of features done      Ask which features deliver most
before showing anything                  value; release those first (1, 3)
Same problem recurs every month          Run a retrospective and agree
                                         one concrete change (12)
\`\`\`

### Self-organising does not mean unmanaged

Principle 11 is sometimes misread as "no managers needed". In practice, a self-organising team decides how to do its work, while goals, priorities and constraints still come from the organisation and the customer. The manager's role shifts from assigning tasks to clearing obstacles, protecting the team from distractions, and making sure the goal is clear.

### Using the principles as a checklist

You do not need to adopt a whole framework to benefit. Pick two or three principles your team struggles with most, such as frequent delivery, daily collaboration with the business, or regular reflection, and improve those first. Small, steady changes stick better than a sudden reorganisation.
      `,
        [
          q('A team regularly works late every night to hit deadlines. Which principle does this conflict with?', [
            'Maintaining a sustainable, constant pace',
            'Welcoming changing requirements late on',
            'Preferring face-to-face conversation',
            'Building self-organising teams',
          ], 0, 'The principle of sustainable development says the team should keep a pace it can maintain indefinitely.'),
          q('What does the principle of simplicity describe as essential?', [
            'Maximising the amount of work not done',
            'Using only one tool for all the work',
            'Writing every requirement in full detail',
            'Making the product look as plain as possible',
          ], 0, 'The manifesto describes simplicity as the art of maximising the amount of work not done.'),
          q('In a self-organising team, what typically remains the manager\'s or organisation\'s job?', [
            'Assigning each task to each person every day',
            'Deciding exactly how every task is done',
            'Writing all the estimates for the team',
            'Setting goals and clearing obstacles',
          ], 3, 'Self-organising teams decide how to do the work, while goals, priorities and support still come from outside the team.'),
        ]
      ),
      lesson('User Stories and Acceptance Criteria', 13, `
A user story is a short description of something a user needs, written from their point of view. User stories are widely used by agile teams, although the Scrum Guide does not require them; it only requires a Product Backlog, and stories are one popular way to write its items.

### The common template

\`\`\`text
As a <type of user>,
I want <some goal>,
so that <some benefit>.
\`\`\`

Example for a food delivery app in Lahore:

\`\`\`text
As a customer ordering lunch at work,
I want to see an estimated delivery time before I pay,
so that I can decide whether to order now or pick up instead.
\`\`\`

Each part does a job. The user tells you whose need it is. The goal says what they want to do. The benefit says why, which helps the team find better solutions and helps the product owner judge value.

### Card, conversation, confirmation

A popular way to think about stories, often credited to Ron Jeffries, is the three Cs:

- **Card**: the story is short enough to fit on an index card. It is a reminder, not a full specification.
- **Conversation**: the details come from talking with the people who need it.
- **Confirmation**: acceptance criteria confirm when the story is done correctly.

A story is a placeholder for a conversation. Writing a long document instead of talking misses the point.

### Good stories follow INVEST

The INVEST checklist, attributed to Bill Wake, is a quick quality test.

| Letter | Meaning | Question to ask |
|---|---|---|
| I | Independent | Can this be built without waiting for another story? |
| N | Negotiable | Is the detail open for discussion? |
| V | Valuable | Does it deliver value to a user or customer? |
| E | Estimable | Does the team understand it well enough to size it? |
| S | Small | Can it be finished within one iteration? |
| T | Testable | Can we tell clearly when it is done? |

### Splitting large stories

A story too big to finish in one iteration is often called an epic. Split it into thinner slices that each deliver something usable.

\`\`\`text
Epic: As a shopper, I want to pay online so that I do not need cash.

Split:
1. Pay by debit or credit card
2. Pay through a mobile wallet
3. Save a payment method for next time
4. Receive a payment receipt by SMS
\`\`\`

Split by user value, not by technical layer. "Build the database" and "build the screen" are not good stories, because neither one is usable alone.

### Writing acceptance criteria

Acceptance criteria are the conditions a story must meet to be accepted. You saw acceptance criteria for project deliverables earlier; for stories they are smaller and more specific. A widely used format is Given, When, Then, which comes from behaviour-driven development.

\`\`\`text
Story: See estimated delivery time before paying

Given  I have items in my cart and have entered my address
When   I open the checkout page
Then   I see an estimated delivery time in minutes

Given  the restaurant is closed
When   I open the checkout page
Then   I see a message that the restaurant is closed and cannot pay
\`\`\`

A simple checklist works too:

- The estimate is shown before the Pay button
- The estimate updates if the address changes
- Closed restaurants show a clear message instead of an estimate

### Acceptance criteria versus Definition of Done

Acceptance criteria are specific to one story. A Definition of Done, which you will meet in the Scrum chapters, applies to every item: for example, code reviewed, tested and deployed to the test environment. A story is complete only when it meets both.

### Who writes stories?

Anyone can propose a story, including developers, support staff and customers. The person responsible for the product, in Scrum the Product Owner, decides their order and makes sure they are clear. The best stories come from real conversations with users, such as calls with shop owners or observing how customers actually use the app.
      `,
        [
          q('What is the purpose of the "so that" part of a user story?', [
            'To say which developer will build the story',
            'To set the deadline for finishing the story',
            'To explain the benefit, which helps judge value',
            'To list the screens that the story will need',
          ], 2, 'The benefit explains why the user wants it, which helps the team find good solutions and the product owner judge value.'),
          q('Which is the best way to split the epic "pay online"?', [
            'Build the database first, then the screens',
            'Separate stories for card, wallet and saved payments',
            'One story for design and another for testing',
            'Split it by which developer is available',
          ], 1, 'Splitting by user value gives slices that are each usable, unlike splitting by technical layer or task type.'),
          q('How do acceptance criteria differ from a Definition of Done?', [
            'They are the same thing with different names',
            'Acceptance criteria apply to every item in the backlog',
            'Definition of Done is written by the customer for each story',
            'Acceptance criteria are per story; Definition of Done applies to all',
          ], 3, 'Acceptance criteria are specific to one story, while the Definition of Done is a shared standard every item must meet.'),
        ]
      ),
      lesson('Relative Estimation With Story Points', 14, `
Humans are poor at estimating absolute size but good at comparing. You may not know exactly how many kilograms a bag of rice weighs, but you can tell instantly that it is heavier than a bag of sugar and lighter than a sack of flour. Relative estimation uses this strength. Story points are the best-known way to do it.

### What a story point is

A story point is a unit of relative size for a backlog item. It combines how much work there is, how complex it is, and how much uncertainty is involved. It is not hours. A 2-point story is roughly twice the size of a 1-point story; an 8-point story is roughly four times a 2-point one.

Story points are a team practice, not part of the Scrum Guide. Scrum requires that Product Backlog items be sized in some way but leaves the method to the team. Some teams use points, some use T-shirt sizes, and some simply count items.

### The scale

Most teams use a modified Fibonacci-like sequence, where gaps grow as numbers get larger.

\`\`\`text
1   2   3   5   8   13   20   40   100
\`\`\`

The growing gaps reflect reality: you can tell 2 from 3, but arguing whether something is 21 or 22 is false precision. Large numbers signal that an item should probably be split.

### Choosing a reference story

Relative estimation needs an anchor. The team picks a small, well-understood story they have done before and calls it a 2 or a 3. Everything else is compared to it.

| Story | Compared to the reference | Points |
|---|---|---|
| Add a contact form to the website (reference) | Baseline | 2 |
| Show estimated delivery time at checkout | A bit bigger, more logic | 3 |
| Add mobile wallet payment | Much bigger, external integration | 8 |
| Change the footer text | Smaller | 1 |

### Planning Poker

Planning Poker is a popular way to estimate together. It was described by James Grenning and later popularised by Mike Cohn.

1. The Product Owner reads a story and answers questions.
2. Each developer privately picks a card with a point value.
3. Everyone reveals at the same time.
4. If estimates differ widely, the highest and lowest explain their thinking.
5. The team discusses and votes again until estimates converge.

The simultaneous reveal prevents anchoring on the most senior person's number. The discussion is often the real value: when one developer says 2 and another says 13, someone knows something the other does not. Perhaps the payment provider's test environment is unreliable, or an existing component already does half the work.

### Why not just estimate in hours?

Hours feel more natural, but they cause problems:

- Different people take different times for the same work, so an hour estimate depends on who does it.
- Hours quickly turn into commitments and pressure, while points stay a measure of size.
- Comparing items is faster and usually more consistent than predicting duration.

Teams later use the total points they complete per iteration to plan, which you will see in the chapter on running Scrum sprint by sprint.

### Rules that keep points useful

\`\`\`text
Do                                       Do not
Estimate as a whole team                 Let the manager assign points
Compare to reference stories             Convert points to hours per person
Re-estimate only when understanding      Change points after work is done
changes before work starts               to make numbers look better
Use points for the team's own planning   Compare points between teams
\`\`\`

That last rule matters. Each team's points scale is its own. A Karachi team's 5 points and an Islamabad team's 5 points are not the same size, so comparing teams by points completed is meaningless and quickly leads to inflated estimates.

### When to skip points

Points are a tool, not a goal. Stable teams with similar-sized items sometimes stop estimating in points and simply count items, after splitting everything to a similar small size. If estimation meetings take hours and add little, try simpler sizing and see whether planning gets worse.
      `,
        [
          q('Why do story point scales usually use growing gaps like 1, 2, 3, 5, 8, 13?', [
            'Larger items carry more uncertainty, so fine precision is false',
            'The Scrum Guide requires the Fibonacci sequence',
            'Bigger numbers always mean more team members',
            'It converts directly into hours for each person',
          ], 0, 'Growing gaps reflect that big items are more uncertain, so arguing over small differences at the high end is pointless.'),
          q('In Planning Poker, why does everyone reveal their estimate at the same time?', [
            'To finish the meeting as quickly as possible',
            'To avoid anchoring on one person\'s number',
            'Because the Product Owner chooses the final number',
            'So that the lowest estimate is automatically used',
          ], 1, 'A simultaneous reveal stops people from adjusting towards the first or most senior estimate they hear.'),
          q('A manager wants to compare two teams by the story points each completes. What is the problem?', [
            'Story points can only be used in Kanban',
            'Points are too precise for comparisons',
            'Each team\'s point scale is relative to its own work',
            'Teams in different cities cannot use points',
          ], 2, 'Points are relative to each team\'s own reference stories, so comparing totals across teams is meaningless.'),
        ]
      ),
      ],
      [
      q('A manager says, "We are agile now, so we no longer need any plans." What is the best reply?', [
        'Correct, the manifesto removes all planning',
        'Correct, plans are only for predictive projects',
        'Wrong, agile teams must follow the first plan exactly',
        'Wrong, agile teams plan often and adapt as they learn',
      ], 3, 'The manifesto values responding to change more than following a plan, but planning still happens in shorter, adaptive cycles.'),
      q('Which user story is written best?', [
        'As a shop owner, I want a daily sales summary so that I can restock on time',
        'Build the sales summary database table and its indexes',
        'Make the reporting part of the system much better',
        'As a developer, I want to finish my tasks this week',
      ], 0, 'It names a user, a goal and a benefit, and delivers value, unlike the technical task or vague request.'),
      q('A developer estimates a story at 2 points and another at 13. What should happen next?', [
        'Take the average of the two and move on',
        'Both explain their reasoning, then the team re-estimates',
        'The manager picks whichever number they prefer',
        'Use the higher number to be on the safe side',
      ], 1, 'A large gap means someone has information the others lack, so discussion followed by a new vote is the right step.'),
      q('Which acceptance criterion is testable?', [
        'The checkout should feel fast and modern',
        'Customers should like the new design a lot',
        'The receipt SMS is sent within one minute of payment',
        'The payment page should be as good as possible',
      ], 2, 'A specific, measurable condition like a time limit can be checked as pass or fail, unlike subjective wording.'),
      ]
    ),
    chapter(
      'Scrum Roles and Artifacts',
      'Learn the theory behind Scrum, the three accountabilities on a Scrum Team, the three artifacts and the commitment that belongs to each, exactly as the Scrum Guide describes them.',
      [
      lesson('Scrum Theory: Empiricism and the Scrum Values', 13, `
Scrum is a lightweight framework for teams that build complex products, where you cannot know everything at the start. Its official definition lives in the Scrum Guide, a short free document written by Ken Schwaber and Jeff Sutherland and published at scrumguides.org. The current version at the time of writing is the November 2020 edition; check scrumguides.org in case a newer one has been released. When people argue about what "real Scrum" is, the Scrum Guide is the reference that settles it, so read it once from start to finish. It is short enough to finish in one sitting.

### Empiricism: decide from what you observe

Scrum is founded on empiricism and lean thinking. Empiricism means knowledge comes from experience, and decisions are made on what is actually observed rather than on detailed predictions. Lean thinking means reducing waste and focusing on what matters.

Compare two ways of building a food delivery app for a restaurant chain in Karachi:

| Predictive thinking | Empirical thinking |
|---|---|
| Write a full specification for every screen up front | Build the ordering flow first and show it to real customers |
| Assume customers want card payment | Watch what customers actually choose, then adjust |
| Measure progress by documents completed | Measure progress by working product people can use |
| Discover problems near the end | Discover problems every few weeks |

Neither column is wrong in every situation. Chapter 2 covered when each lifecycle fits. Scrum is built for the right column, where the problem changes as you learn.

### The three pillars

The Scrum Guide names three pillars that make empiricism work:

1. **Transparency.** The work and the process must be visible to the people doing the work and the people receiving it. If the Product Backlog is hidden in one person's notebook, nobody can inspect it.
2. **Inspection.** The artifacts and progress toward agreed goals must be inspected frequently and diligently to detect problems.
3. **Adaptation.** If any aspect of the process or product moves outside acceptable limits, the process or the materials being produced must be adjusted as soon as possible.

The pillars depend on each other. Inspection without transparency is misleading, because you inspect a false picture. Inspection without adaptation is pointless, because you see the problem and do nothing about it.

### The five Scrum values

The Scrum Guide lists five values that the Scrum Team commits to living by:

| Value | What it looks like on a real team |
|---|---|
| Commitment | Team members commit to achieving their goals and supporting each other |
| Focus | Attention stays on the work of the Sprint and the progress toward goals |
| Openness | The team is open about the work and the challenges, including bad news |
| Respect | Members respect each other as capable, independent people |
| Courage | Members have the courage to do the right thing and work on tough problems |

Values sound soft, but they decide whether the pillars work. A developer in a Lahore software house who fears blame will hide a delay, and transparency fails. A team that lacks courage will not tell a client that the requested feature is a bad idea, and adaptation fails.

### Small teams, short cycles

Scrum applies empiricism through a repeated cycle. Each Sprint, the team plans, builds a usable Increment, inspects the result with stakeholders, and inspects its own way of working. Because a Sprint is one month or less, the cost of a wrong guess is limited to a few weeks of work, not a whole year.

### A quick self check

Ask these questions about any team that says it does Scrum:

\`\`\`text
Can everyone see the current Product Backlog?        (transparency)
Does the team look at real progress at least daily?  (inspection)
Did anything change after the last review?           (adaptation)
Would a junior member feel safe raising a problem?   (values)
\`\`\`

If the answer to any line is no, the team may be following Scrum's events on the calendar without getting Scrum's benefits.
      `,
        [
          q('On what two ideas does the Scrum Guide say Scrum is founded?', [
            'Detailed planning and strict change control',
            'Empiricism and lean thinking',
            'Earned value and critical path analysis',
            'Hierarchy and individual performance targets',
          ], 1, 'The Scrum Guide states that Scrum is founded on empiricism and lean thinking, meaning decisions come from observation and waste is reduced.'),
          q('Why is inspection without transparency a problem?', [
            'Inspection is only allowed once per Sprint',
            'Transparency is the Product Owner\'s private task',
            'Inspection makes transparency unnecessary',
            'The team ends up inspecting a false picture of the work',
          ], 3, 'If the work is not visible as it truly is, inspecting it leads to wrong conclusions and poor decisions.'),
          q('Which list gives the five Scrum values from the Scrum Guide?', [
            'Commitment, focus, openness, respect and courage',
            'Speed, quality, cost, scope and risk',
            'Transparency, inspection, adaptation, trust and focus',
            'Honesty, loyalty, discipline, speed and courage',
          ], 0, 'The Scrum Guide lists commitment, focus, openness, respect and courage as the Scrum values. Transparency, inspection and adaptation are the pillars, not values.'),
        ]
      ),
      lesson('The Scrum Team: Product Owner, Scrum Master and Developers', 14, `
The Scrum Guide describes one small unit of people, the Scrum Team. It consists of one Scrum Master, one Product Owner and Developers. There are no sub-teams and no hierarchies inside it. The 2020 Scrum Guide talks about accountabilities rather than job titles, which matters: a person in your company might be called "Team Lead" or "Senior Engineer", but in Scrum terms what counts is what they are accountable for.

### Size and shape

The Scrum Guide says the Scrum Team is typically 10 or fewer people, small enough to stay nimble and large enough to complete significant work within a Sprint. If a team grows too large, the guide suggests reorganising into multiple cohesive Scrum Teams that share the same Product Goal, Product Backlog and Product Owner.

The team is cross-functional, meaning members have all the skills needed to create value each Sprint, and self-managing, meaning they decide internally who does what, when and how.

### The three accountabilities

| Accountability | Accountable for | Common mistake |
|---|---|---|
| Product Owner | Maximising the value of the product resulting from the Scrum Team's work | Acting as a committee or a messenger with no authority |
| Scrum Master | Establishing Scrum as defined in the Scrum Guide and the Scrum Team's effectiveness | Becoming a meeting secretary or task assigner |
| Developers | Creating any aspect of a usable Increment each Sprint | Thinking only programmers count as Developers |

### The Product Owner

The Product Owner is one person, not a committee. They may represent the needs of many stakeholders, but one person makes the product decisions. The Product Owner is accountable for effective Product Backlog management, which includes developing and communicating the Product Goal, creating and clearly communicating Product Backlog items, ordering them, and making sure the Product Backlog is transparent, visible and understood.

The Product Owner may delegate some of that work to others, but stays accountable. For their decisions to stick, the whole organisation must respect them. If the owner of a Faisalabad textile export business overrules the Product Owner every week, the team is not really doing Scrum.

### The Scrum Master

The Scrum Master is accountable for establishing Scrum as the Scrum Guide defines it, by helping everyone understand Scrum theory and practice. They serve the team, the Product Owner and the wider organisation. Typical work includes:

- Coaching team members in self-management and cross-functionality
- Helping the team focus on creating high-value Increments that meet the Definition of Done
- Causing the removal of impediments to the team's progress
- Ensuring Scrum events take place and are positive, productive and kept within the timebox
- Helping the Product Owner find techniques for Product Goal definition and backlog management
- Leading, training and coaching the organisation in its Scrum adoption

The Scrum Guide calls Scrum Masters "true leaders who serve". They are not project managers who assign tasks. Note that "causing the removal" of impediments does not always mean removing them personally; often it means helping the right person act.

### The Developers

Developers are the people committed to creating any aspect of a usable Increment each Sprint. On a website project that can include designers, testers, content writers and data analysts, not only programmers. The Scrum Guide says Developers are always accountable for:

\`\`\`text
1. Creating a plan for the Sprint, the Sprint Backlog
2. Instilling quality by adhering to a Definition of Done
3. Adapting their plan each day toward the Sprint Goal
4. Holding each other accountable as professionals
\`\`\`

### Where does a project manager fit?

The Scrum Guide does not define a project manager accountability. In practice, an accidental PM moving into Scrum often becomes a Scrum Master or a Product Owner, or works outside the team handling budgets, contracts and reporting to senior management. Be clear which one you are, because mixing them confuses the team. A Scrum Master who also sets priorities is quietly acting as Product Owner, and the real Product Owner loses authority.
      `,
        [
          q('According to the Scrum Guide, who makes up the Scrum Team?', [
            'A project manager, a team lead and the Developers',
            'A Product Owner committee and a Development Team',
            'One Scrum Master, one Product Owner and Developers',
            'Developers, testers and a separate quality team',
          ], 2, 'The Scrum Guide defines the Scrum Team as one Scrum Master, one Product Owner and Developers, with no sub-teams or hierarchies.'),
          q('Who is accountable for ordering the Product Backlog?', [
            'The Product Owner',
            'The Scrum Master',
            'The most senior Developer',
            'The client\'s finance manager',
          ], 0, 'Ordering Product Backlog items is part of effective Product Backlog management, which the Product Owner is accountable for.'),
          q('A content writer helps build a usable website Increment each Sprint. In Scrum terms, what is she?', [
            'A stakeholder who only attends the Sprint Review',
            'An assistant to the Scrum Master',
            'Outside the team because she does not write code',
            'One of the Developers',
          ], 3, 'Developers are the people who create any aspect of a usable Increment, so the role is not limited to programmers.'),
        ]
      ),
      lesson('Product Backlog, Sprint Backlog and Increment', 13, `
Scrum has exactly three artifacts: the Product Backlog, the Sprint Backlog and the Increment. The Scrum Guide says artifacts represent work or value and are designed to maximise transparency of key information. Everyone inspecting them should have the same basis for adaptation.

### The Product Backlog

The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team. "Emergent" means it is never finished; it changes as the team and stakeholders learn. "Ordered" means items near the top are the ones the team is likely to work on next, so they should be clearer and smaller than items further down.

Imagine a team building an online booking system for a chain of clinics in Islamabad. A slice of its Product Backlog might look like this:

| Order | Product Backlog item | Readiness |
|---|---|---|
| 1 | Patient books an appointment with a chosen doctor | Refined, small enough for one Sprint |
| 2 | Patient receives an SMS reminder the day before | Refined |
| 3 | Receptionist sees today's bookings on one screen | Mostly refined |
| 4 | Online payment for consultation fees | Large, needs splitting |
| 5 | Urdu language option | Idea, not yet discussed |

Items at the top are ready to be selected in Sprint Planning. Items at the bottom are rough. The Product Owner is accountable for the ordering, though the Developers who will do the work are responsible for sizing it.

### The Sprint Backlog

The Sprint Backlog is made up of three things:

1. The Sprint Goal, which explains why the Sprint matters
2. The set of Product Backlog items selected for the Sprint
3. An actionable plan for delivering the Increment

The Sprint Backlog is a plan by and for the Developers. It is a highly visible, real-time picture of the work the Developers plan to do during the Sprint. It is updated throughout the Sprint as more is learned. The Developers own it, so a manager adding tasks to it directly in the middle of a Sprint is a warning sign.

\`\`\`text
Sprint Backlog, Sprint 4
Sprint Goal: A patient can book and be reminded of an appointment

PBI 1  Book an appointment
  - Doctor availability table        Done
  - Booking form and validation      In progress
  - Confirmation screen              To do
PBI 2  SMS reminder
  - Choose SMS gateway with PO       To do
  - Scheduled reminder job           To do
\`\`\`

### The Increment

An Increment is a concrete stepping stone toward the Product Goal. Each Increment adds to all prior Increments and is thoroughly verified, so all Increments work together. To provide value, the Increment must be usable.

Some points from the Scrum Guide that surprise beginners:

- Work cannot be considered part of an Increment unless it meets the Definition of Done.
- Multiple Increments may be created within a Sprint. The team does not have to wait for the Sprint Review to release.
- The sum of the Increments is presented at the Sprint Review, but an Increment may be delivered to stakeholders before the end of the Sprint.

### Comparing the artifacts

| Artifact | Owned or managed by | Time horizon | Question it answers |
|---|---|---|---|
| Product Backlog | Product Owner accountable | Whole product life | What could we build to improve the product? |
| Sprint Backlog | Developers | One Sprint | What will we do this Sprint, and how? |
| Increment | Scrum Team | Ongoing | What usable value exists right now? |

### Keeping artifacts honest

Artifacts only help if they are transparent. A Product Backlog with 400 vague items nobody reads, or a Sprint Backlog that is updated only the night before the review, gives a false picture. Keep the top of the Product Backlog clear, update the Sprint Backlog as work moves, and never call something part of the Increment if it is "done except testing".
      `,
        [
          q('How does the Scrum Guide describe the Product Backlog?', [
            'An emergent, ordered list of what is needed to improve the product',
            'A fixed list of requirements signed at the start of the project',
            'A private task list owned by the Scrum Master',
            'A record of completed work for the client invoice',
          ], 0, 'The Product Backlog is emergent and ordered, and it is the single source of work undertaken by the Scrum Team.'),
          q('Which three things make up the Sprint Backlog?', [
            'The Product Goal, the budget and the risk register',
            'The Definition of Done, the velocity and the burndown chart',
            'The Sprint Goal, the selected items and an actionable plan',
            'The team roster, the meeting schedule and the release date',
          ], 2, 'The Scrum Guide defines the Sprint Backlog as the Sprint Goal, the Product Backlog items selected for the Sprint, and a plan for delivering the Increment.'),
          q('A feature is coded but not yet tested, and testing is part of the Definition of Done. Is it part of the Increment?', [
            'Yes, if the Product Owner approves it',
            'Yes, because the code exists',
            'Only if the Sprint ends tomorrow and the client is waiting for it',
            'No, because it does not meet the Definition of Done',
          ], 3, 'The Scrum Guide says work cannot be considered part of an Increment unless it meets the Definition of Done.'),
        ]
      ),
      lesson('Commitments: Product Goal, Sprint Goal and Definition of Done', 13, `
The 2020 Scrum Guide pairs each artifact with a commitment. The commitment gives the artifact a clear purpose and a way to measure progress. This pairing is one of the most useful ideas in the guide, because without it the backlogs become long lists with no direction.

| Artifact | Its commitment | What the commitment provides |
|---|---|---|
| Product Backlog | Product Goal | The long-term objective for the Scrum Team |
| Sprint Backlog | Sprint Goal | The single objective for the Sprint |
| Increment | Definition of Done | The quality standard the Increment must meet |

### The Product Goal

The Product Goal describes a future state of the product that serves as a target for the Scrum Team to plan against. It is in the Product Backlog, and the rest of the Product Backlog emerges to define what will fulfil it. The Scrum Team must fulfil or abandon one Product Goal before taking on the next.

A good Product Goal is specific enough to guide choices but not a feature list:

\`\`\`text
Weak:   Build the best clinic app in Pakistan
Weak:   Add booking, payments, reminders, reports and chat
Better: Patients of our three Islamabad clinics can book, pay and
        get reminders online without phoning reception
\`\`\`

The better version tells the Product Owner which backlog items matter now. A "chat with doctor" idea can wait, because it does not serve this goal.

### The Sprint Goal

The Sprint Goal is the single objective for the Sprint. It is created during Sprint Planning and added to the Sprint Backlog. Although it is a commitment by the Developers, it gives flexibility in the exact work needed to achieve it. If the work turns out different from what was expected, the Developers collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal.

That flexibility is the point. Suppose a Lahore team's Sprint Goal is "a customer can track their parcel by entering the tracking number". Midway, they find the courier's data feed is slower than expected. They can drop a nice-to-have animation and still meet the goal. The goal stays fixed; the route to it can bend.

### The Definition of Done

The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. The moment a Product Backlog item meets the Definition of Done, an Increment is born.

If the organisation already has a Definition of Done as a standard, all Scrum Teams must follow it as a minimum. If not, the Scrum Team must create one appropriate for the product. A Definition of Done for a small web team might read:

| Check | Example standard |
|---|---|
| Code | Reviewed by another Developer and merged |
| Testing | Automated tests pass, and the feature is tested on a mid-range Android phone |
| Content | Text proofread in English and Urdu where needed |
| Deployment | Running on the staging server |
| Documentation | User help page updated |

If a Product Backlog item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review. It returns to the Product Backlog for future consideration.

### Definition of Done versus acceptance criteria

Chapter 8 covered acceptance criteria for user stories. The difference is simple. Acceptance criteria are specific to one item: "the reminder SMS includes the doctor's name and time". The Definition of Done applies to every item: "tested, reviewed, deployed to staging". An item needs both to be finished.

### When commitments are missing

Teams without a Product Goal tend to build whatever the loudest stakeholder asked for last. Teams without a Sprint Goal end each Sprint with a scattered set of half-related tasks. Teams with a weak Definition of Done pile up hidden work such as untested features, which explodes at release time. If you take over a struggling Scrum team, checking these three commitments is one of the fastest diagnostics available.
      `,
        [
          q('Which commitment belongs to the Sprint Backlog?', [
            'The Product Goal',
            'The Definition of Done',
            'The release plan',
            'The Sprint Goal',
          ], 3, 'The Scrum Guide pairs the Sprint Backlog with the Sprint Goal, the Product Backlog with the Product Goal, and the Increment with the Definition of Done.'),
          q('Midway through a Sprint the work turns out larger than expected. What does the Scrum Guide allow?', [
            'The Scrum Master rewrites the Sprint Goal alone',
            'Developers and Product Owner renegotiate scope, keeping the Sprint Goal',
            'The Sprint is extended by a week or two so that all of the planned work fits',
            'Developers lower the Definition of Done for this Sprint only',
          ], 1, 'The Sprint Goal stays fixed, while the Developers collaborate with the Product Owner to adjust the Sprint Backlog scope.'),
          q('Your organisation already has a Definition of Done as a company standard. What must each Scrum Team do?', [
            'Ignore it and write a fresh one for each Sprint',
            'Use it only when the client asks for it',
            'Follow it as a minimum standard for its work',
            'Ask the Product Owner to relax it for each item',
          ], 2, 'The Scrum Guide says that if the organisation has a Definition of Done as a standard, all Scrum Teams must follow it as a minimum.'),
        ]
      ),
      ],
      [
      q('A team hides a delay because members fear blame. Which part of Scrum theory fails first?', [
        'Transparency, because the real state of work is not visible',
        'Velocity, because story points stop adding up correctly',
        'The Product Goal, because it becomes obsolete overnight',
        'Timeboxing, because the Daily Scrum runs longer',
      ], 0, 'Hidden problems break transparency, and without transparency inspection and adaptation are based on a false picture.'),
      q('A company names a five-person committee as "Product Owner". What does the Scrum Guide say?', [
        'This is ideal because more opinions improve the backlog',
        'This is allowed if the Scrum Master chairs the committee',
        'This works only for teams with more than ten members',
        'The Product Owner is one person, though they may represent many stakeholders',
      ], 3, 'The Scrum Guide states that the Product Owner is one person, not a committee, so product decisions have a single accountable owner.'),
      q('Which pairing of artifact and commitment is correct?', [
        'Increment and Sprint Goal',
        'Sprint Backlog and Product Goal',
        'Product Backlog and Product Goal',
        'Product Backlog and Definition of Done',
      ], 2, 'The Product Backlog carries the Product Goal, the Sprint Backlog carries the Sprint Goal, and the Increment carries the Definition of Done.'),
      q('Who owns and updates the Sprint Backlog during the Sprint?', [
        'The Product Owner',
        'The Developers',
        'The Scrum Master',
        'The project sponsor',
      ], 1, 'The Sprint Backlog is a plan by and for the Developers, and they update it throughout the Sprint as they learn.'),
      ]
    ),
    chapter(
      'Running Scrum Sprint by Sprint',
      'Run each Scrum event well, from Sprint Planning and the Daily Scrum to the Sprint Review and Retrospective, and use backlog refinement, velocity and burndown charts to keep forecasts honest.',
      [
      lesson('Sprint Planning', 13, `
The Sprint is the container for all the other Scrum events. It is a fixed length of one month or less, and a new Sprint starts immediately after the previous one ends. Many teams choose two weeks, but the Scrum Guide does not require any particular length. Sprint Planning is the event that starts the Sprint, and the whole Scrum Team attends.

### The timebox

The Scrum Guide timeboxes Sprint Planning to a maximum of eight hours for a one-month Sprint. For shorter Sprints the event is usually shorter. A timebox is a maximum, not a target. A two-week Sprint for a small team in Rawalpindi might plan comfortably in two or three hours.

### The three topics

The Scrum Guide organises Sprint Planning around three questions:

| Topic | Question | Who leads the thinking |
|---|---|---|
| One | Why is this Sprint valuable? | Product Owner proposes how the product could increase its value; the whole team crafts the Sprint Goal |
| Two | What can be Done this Sprint? | Developers select items from the Product Backlog, discussing with the Product Owner |
| Three | How will the chosen work get done? | Developers plan the work needed to create an Increment that meets the Definition of Done |

The Sprint Goal must be finalised before the end of Sprint Planning. The Sprint Goal, the selected Product Backlog items and the plan for delivering them together form the Sprint Backlog.

### Selecting the right amount

Topic two is where teams most often go wrong. The Scrum Guide says selecting how much can be completed may be challenging, and that the more the Developers know about their past performance, upcoming capacity and Definition of Done, the more confident their forecasts will be.

A practical capacity check before selecting items:

\`\`\`text
Team: 5 Developers, 10 working days in the Sprint
Known absences: one person on leave for 3 days, Eid holiday 2 days for all
Available person-days: (5 x 10) - 3 - (5 x 2) = 37
Time for meetings, support and refinement: about 20 percent, so roughly 30
Recent Sprints completed about 24 points with 40 available person-days
Forecast: aim for about 18 points of work, not 30
\`\`\`

The numbers are an aid to judgement, not a formula. Public holidays such as Eid, Independence Day or local events that close offices in your city reduce capacity, and teams that ignore them overcommit.

### Breaking items into a plan

For topic three, Developers often decompose each selected item into work of one day or less. How they do this is their decision. A small team building a school fee portal might break a "parent pays fees online" item into tasks such as designing the payment screen, connecting to the bank gateway's test environment, handling failed payments, and testing on slow mobile connections.

Not every item needs a full breakdown on day one. Enough planning to start confidently is the aim; the rest can be planned during the Sprint as the team learns.

### Inputs to bring

Good Sprint Planning depends on preparation done earlier:

- A Product Backlog whose top items are already refined and understood
- The Product Goal, so the Sprint Goal can move toward it
- The latest Increment and what was learned at the last Sprint Review
- Known capacity, including leave and holidays
- The Definition of Done

If the top of the Product Backlog is vague, Sprint Planning turns into a long refinement session and runs out of time. That is a sign to invest more in refinement during the Sprint, as the last topic of this chapter explains.

### Signs of a healthy planning event

You leave with one clear Sprint Goal that everyone can say in a sentence, a selection of work the Developers believe they can finish, and a first plan for the opening days. You do not leave with a list of tasks that a manager assigned to named people, because the Developers decide how to organise their own work.
      `,
        [
          q('What is the maximum timebox for Sprint Planning in a one-month Sprint?', [
            'Two hours',
            'Eight hours',
            'Fifteen minutes',
            'One full working week',
          ], 1, 'The Scrum Guide timeboxes Sprint Planning to a maximum of eight hours for a one-month Sprint, usually shorter for shorter Sprints.'),
          q('Which question is the first topic of Sprint Planning?', [
            'How will the chosen work get done?',
            'Who will do each task?',
            'What did we finish last Sprint?',
            'Why is this Sprint valuable?',
          ], 3, 'The Scrum Guide lists three topics in order: why the Sprint is valuable, what can be Done, and how the chosen work will get done.'),
          q('A team plans a two-week Sprint that includes a two-day public holiday. What should they do?', [
            'Reduce their capacity and select less work',
            'Ignore it because velocity already averages it out',
            'Extend the Sprint by two days to make up for it',
            'Ask the Developers to work over the holiday instead',
          ], 0, 'Known absences and holidays reduce available capacity, so the forecast for the Sprint should be smaller. Sprint length stays fixed.'),
        ]
      ),
      lesson('The Daily Scrum', 13, `
The Daily Scrum is a 15-minute event for the Developers of the Scrum Team. Its purpose, according to the Scrum Guide, is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work.

### The basic rules

| Rule from the Scrum Guide | Why it matters |
|---|---|
| Timeboxed to 15 minutes | Keeps it a quick inspection, not a meeting that eats the morning |
| Held at the same time and place every working day of the Sprint | Removes scheduling effort and makes it a habit |
| It is for the Developers | They own the Sprint Backlog and adapt the plan |
| Developers choose its structure and techniques | It should focus on progress toward the Sprint Goal and produce a plan for the next day |

If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers. Otherwise the Scrum Master's job is to make sure the event happens and stays within the timebox, not to run it.

### Beyond the three questions

Many teams use three questions: what did I do yesterday, what will I do today, and what is blocking me. Older versions of the Scrum Guide suggested them; the 2020 version removed them and leaves the format to the Developers. The questions are not wrong, but they can turn the event into a round of individual status reports to a manager.

A goal-focused alternative is to walk the board item by item:

\`\`\`text
Sprint Goal: Parents can pay school fees online

Item: Payment screen            Done, tested on mobile
Item: Bank gateway connection   Stuck, test credentials not received
  -> Ayesha will call the bank's support at 11 today
Item: Failed payment handling   Not started
  -> Bilal starts after lunch, pairs with Ayesha if the gateway is ready
Are we still on track for the Sprint Goal?  Yes, if credentials arrive by Wednesday
\`\`\`

This version keeps attention on the work and the goal rather than on who looks busy.

### What it is not

The Daily Scrum is not the only time Developers talk. The Scrum Guide notes that Developers often meet throughout the day for more detailed discussions about adapting or re-planning. A practical habit is to note topics that need deeper discussion and hold a short follow-up right after the Daily Scrum with only the people involved.

It is also not a status meeting for management. If a director in a Karachi bank's IT department attends every morning and asks each person to justify their hours, the event loses its purpose and people start performing instead of inspecting.

### Remote and hybrid teams

Many South Asian teams are now partly remote, with members across Lahore, Islamabad and sometimes overseas time zones. Some practical points:

- Choose a time that suits the Developers' overlapping working hours, and keep it fixed.
- Share the board on screen so everyone inspects the same picture.
- Keep cameras optional if internet speeds are poor, but keep the board visible.
- If load shedding or connectivity regularly drops someone, agree on a written update in the team chat as a fallback, not a replacement.

### Common problems and fixes

| Problem | Likely cause | Fix to try |
|---|---|---|
| Runs to 40 minutes | Problem solving during the event | Park detailed discussions for after |
| Nobody mentions blockers | People fear looking incompetent | Scrum Master works on safety; praise early warnings |
| Same updates every day | Items too large to show progress | Split work into smaller pieces |
| Feels pointless | No clear Sprint Goal | Fix Sprint Planning first |

When a Daily Scrum consistently ends with a clear, adjusted plan for the next 24 hours, it is working.
      `,
        [
          q('What is the purpose of the Daily Scrum according to the Scrum Guide?', [
            'To report each person\'s hours to the project sponsor',
            'To refine, split and estimate the new Product Backlog items for upcoming Sprints',
            'To inspect progress toward the Sprint Goal and adapt the Sprint Backlog',
            'To demonstrate finished work to stakeholders',
          ], 2, 'The Daily Scrum exists to inspect progress toward the Sprint Goal and adjust the upcoming planned work.'),
          q('When does the Product Owner take part in the Daily Scrum as a participant?', [
            'When they are actively working on items in the Sprint Backlog',
            'Every day, because they own the Product Backlog',
            'Only on the last day of the Sprint',
            'Never, because the Scrum Guide bans the Product Owner from this event',
          ], 0, 'The Scrum Guide says the Product Owner or Scrum Master participate as Developers only if they are actively working on Sprint Backlog items.'),
          q('The Daily Scrum keeps running past 40 minutes because people solve problems in it. What is a good fix?', [
            'Move the event to once a week so there is more time to solve each problem',
            'Let the Scrum Master assign every task to save time',
            'Cancel it and rely only on chat messages for updates',
            'Hold detailed discussions right after with only those involved',
          ], 3, 'Keeping the 15-minute event focused and moving problem solving to a follow-up respects the timebox and still solves the problem.'),
        ]
      ),
      lesson('Sprint Review and Sprint Retrospective', 14, `
The last two events of a Sprint look backward in different directions. The Sprint Review inspects the product. The Sprint Retrospective inspects the way the team works. Mixing them up, or skipping the second one, is one of the most common ways Scrum teams stop improving.

### The Sprint Review

The Scrum Guide describes the purpose of the Sprint Review as inspecting the outcome of the Sprint and determining future adaptations. The Scrum Team presents the results of its work to key stakeholders, and progress toward the Product Goal is discussed. It is the second to last event of the Sprint and is timeboxed to a maximum of four hours for a one-month Sprint.

The guide is explicit that the Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation. A good review feels like a workshop:

| Part | What happens |
|---|---|
| Show the Increment | Stakeholders see and try the working product, not slides about it |
| Gather feedback | Stakeholders say what works, what does not, and what they need next |
| Review the environment | Changes in the market, budget, competition or regulation are discussed |
| Adapt the Product Backlog | The attendees collaborate on what to do next, and the Product Backlog may be adjusted |

Imagine a team building an inventory app for a pharmacy chain in Multan. At the review, the pharmacy manager uses the new stock screen and points out that staff scan barcodes, they do not type codes. That one observation reshapes the next Sprint. A slide deck would never have revealed it.

### Who should attend

Invite the stakeholders whose feedback can change the product: users, the client, the sponsor and people from support or sales. A review with only the Scrum Team in the room loses most of its value. If senior stakeholders cannot attend in person, a short recorded walk-through is better than nothing, but live feedback is better still.

### The Sprint Retrospective

The purpose of the Sprint Retrospective, in the words of the Scrum Guide, is to plan ways to increase quality and effectiveness. The Scrum Team inspects how the last Sprint went with regard to individuals, interactions, processes, tools and their Definition of Done. It concludes the Sprint and is timeboxed to a maximum of three hours for a one-month Sprint.

The team identifies the most helpful changes to improve its effectiveness. The most impactful improvements are addressed as soon as possible, and they may even be added to the Sprint Backlog for the next Sprint.

### A simple retrospective format

\`\`\`text
1. Set the scene (5 min)   Remind everyone: we judge the process, not people
2. Gather data (15 min)    Sticky notes: what helped, what hurt, what puzzled us
3. Find causes (15 min)    Group the notes; pick the two biggest themes
4. Decide actions (15 min) One or two concrete changes with an owner each
5. Close (5 min)           Check last Sprint's actions: did they work?
\`\`\`

For a two-week Sprint this fits comfortably in about an hour. Vary the format every few Sprints so it does not go stale. Chapter 12 returns to lessons learned at the end of a whole project, which is a different, larger exercise.

### Making retrospectives safe

Retrospectives fail when people feel they cannot speak honestly. In many workplaces, junior staff will not criticise a decision made by a senior colleague in front of others. Practical ways to help:

- Collect notes anonymously, on paper or in an online board, before discussing them.
- Have the Scrum Master facilitate rather than the most senior person.
- Focus on events and systems: "the test server was down for two days", not "Usman broke the server".
- Keep what is said in the room unless the team agrees to share it.

### Review versus retrospective

| | Sprint Review | Sprint Retrospective |
|---|---|---|
| Inspects | The product and the Product Goal progress | The team's way of working |
| Attendees | Scrum Team plus key stakeholders | Scrum Team |
| Max timebox, one-month Sprint | Four hours | Three hours |
| Typical output | An adjusted Product Backlog | Improvement actions for the team |
      `,
        [
          q('Which description of the Sprint Review matches the Scrum Guide?', [
            'A formal sign-off meeting where the client approves the invoice',
            'A working session where stakeholders inspect the outcome and help decide next steps',
            'A slide presentation by the Scrum Master to senior management',
            'A private team meeting to discuss how people worked together',
          ], 1, 'The Scrum Guide says the Sprint Review is a working session and should not be limited to a presentation.'),
          q('Which event concludes the Sprint?', [
            'The Sprint Review',
            'The Daily Scrum',
            'The Sprint Retrospective',
            'Product Backlog refinement',
          ], 2, 'The Sprint Retrospective concludes the Sprint; the Sprint Review is the second to last event.'),
          q('What should a team do with the most impactful improvement found in a retrospective?', [
            'Address it as soon as possible, possibly adding it to the next Sprint Backlog',
            'Write it in a report and review it at the end of the project',
            'Send it to the Product Owner to place at the bottom of the backlog',
            'Wait until the same problem has appeared in three more Sprints',
          ], 0, 'The Scrum Guide says the most impactful improvements are addressed as soon as possible and may be added to the Sprint Backlog for the next Sprint.'),
        ]
      ),
      lesson('Product Backlog Refinement, Velocity and Burndown Charts', 14, `
Three practices keep Scrum running smoothly between events. Refinement keeps the Product Backlog ready for planning. Velocity and burndown charts help teams forecast. Only refinement is described in the Scrum Guide itself; velocity and burndowns are common practices that many teams add, and they come with traps.

### Product Backlog refinement

The Scrum Guide describes refinement as the act of breaking down and further defining Product Backlog items into smaller, more precise items. It is an ongoing activity to add details such as a description, order and size. It is not one of the Scrum events, so there is no official timebox or format.

Many teams hold a regular refinement session once or twice a Sprint. Developers who will be doing the work are responsible for the sizing, and the Product Owner may influence them by helping them understand and select trade-offs.

A refinement checklist for the top of the backlog:

| Question | Example for "online fee payment" |
|---|---|
| Is the item small enough for one Sprint? | Split into "pay by card" and "pay by bank transfer" |
| Is the value clear? | Parents stop queuing at the school office |
| Are acceptance criteria written? | Receipt is sent by SMS and email |
| Are dependencies known? | Needs the bank's test account |
| Is it sized? | Developers estimate it, for example in story points from Chapter 8 |

Items that pass this check can be selected in Sprint Planning without a long debate.

### Velocity

Velocity is the amount of work, often in story points, that a team completes in a Sprint, counting only items that met the Definition of Done. It is a team practice, not part of the Scrum Guide.

\`\`\`text
Sprint 1: 21 points
Sprint 2: 18 points
Sprint 3: 25 points
Sprint 4: 20 points
Average of last 4 Sprints: 21 points
Remaining release backlog: about 105 points
Rough forecast: 105 / 21 = about 5 more Sprints, give or take
\`\`\`

Use a range, not a single date, because velocity varies. Saying "between four and six Sprints" is more honest than promising a date.

Traps to avoid:

- **Comparing teams.** As Chapter 8 explained, points are relative to each team, so team A's 40 is not "better" than team B's 20.
- **Using velocity as a target.** If management demands higher velocity, estimates quietly inflate and the number becomes meaningless.
- **Counting partly done work.** Only Done items count, or the forecast becomes fiction.

### Burndown charts

A Sprint burndown chart plots remaining work against days in the Sprint. The vertical axis shows remaining work, in points, tasks or hours, and the horizontal axis shows days. A diagonal "ideal" line runs from the total at the start to zero at the end.

| Pattern on the chart | What it often means |
|---|---|
| Actual line close to the ideal line | Work is flowing steadily |
| Flat for several days, then a sudden drop | Large items only finish at the end; split work smaller |
| Line goes up mid-Sprint | Work was added or re-estimated; check with the Product Owner |
| Line well above ideal near the end | The Sprint Goal may be at risk; talk about it now |

A release burndown or burnup chart does the same across several Sprints, and a burnup also shows when scope was added, which a burndown hides.

### Keep empiricism in charge

The Scrum Guide notes that practices such as burn-downs, burn-ups and cumulative flows can be useful for forecasting progress, but they do not replace the importance of empiricism. In complex work, what will happen is unknown, and only what has already happened can be used for forward-looking decisions. Treat charts as conversation starters at the Daily Scrum or Sprint Review, never as a scoreboard for judging people.
      `,
        [
          q('How does the Scrum Guide treat Product Backlog refinement?', [
            'As a mandatory event with a two-hour timebox',
            'As a task done only by the Scrum Master',
            'As a one-time activity at the start of a project',
            'As an ongoing activity, not a formal Scrum event',
          ], 3, 'The Scrum Guide describes refinement as an ongoing activity of breaking down and defining items, not as one of the Scrum events.'),
          q('Management demands that velocity rise every Sprint. What is the most likely result?', [
            'The team will deliver more value every Sprint',
            'Estimates quietly inflate and velocity loses meaning',
            'The Scrum Guide will require a longer Sprint',
            'Burndown charts will stop working in Jira',
          ], 1, 'When velocity becomes a target, teams tend to inflate estimates, so the number rises without more work being done and stops being useful for forecasting.'),
          q('A burndown line stays flat for most of the Sprint, then drops sharply on the last day. What is a likely cause?', [
            'The team finished early and stopped working',
            'The Product Owner removed the Sprint Goal halfway',
            'Items are large and only reach Done at the end',
            'The chart software is set to the wrong time zone',
          ], 2, 'A flat line followed by a late drop usually means work is in large pieces that finish only at the end, so splitting items smaller helps.'),
        ]
      ),
      ],
      [
      q('A team\'s Sprint Planning keeps running out of time because top backlog items are vague. What should improve?', [
        'Refinement during the Sprint, so top items arrive ready',
        'The Daily Scrum should be extended to one hour',
        'The Sprint should be lengthened to two months',
        'The Scrum Master should select the items alone',
      ], 0, 'Vague items turn planning into refinement, so regular refinement makes Sprint Planning faster and clearer. Sprints cannot exceed one month.'),
      q('A director attends every Daily Scrum and asks each person to justify their hours. What is the main problem?', [
        'The Daily Scrum must always be held in the afternoon',
        'Directors must attend the Sprint Retrospective instead',
        'The event should have been timeboxed at 30 minutes',
        'It turns an inspection for Developers into a status report',
      ], 3, 'The Daily Scrum is for Developers to inspect progress and adapt their plan, and management status reporting undermines that purpose.'),
      q('Which event inspects the team\'s way of working rather than the product?', [
        'The Sprint Review',
        'Sprint Planning',
        'The Sprint Retrospective',
        'The Daily Scrum',
      ], 2, 'The Sprint Retrospective inspects individuals, interactions, processes, tools and the Definition of Done to plan improvements.'),
      q('A team\'s average velocity is 20 points and 100 points remain. What forecast is most honest?', [
        'Exactly five Sprints, guaranteed by the numbers',
        'Roughly five Sprints, stated as a range',
        'Ten Sprints, to be safe against any surprise at all',
        'Impossible to say anything without a Gantt chart',
      ], 1, 'Velocity varies from Sprint to Sprint, so a forecast should be given as a range rather than a promised date.'),
      ]
    ),
    chapter(
      'Kanban and Project Tools',
      'Manage flow with Kanban boards and WIP limits, then learn how teams run projects in Jira, Trello, Asana and plain spreadsheets, and how to choose the right tool for your team and budget.',
      [
      lesson('Kanban Boards, WIP Limits and Flow', 13, `
Kanban is a way of managing work by making it visible and controlling how much is in progress at once. It grew from ideas in lean manufacturing and was adapted for knowledge work. Unlike Scrum, it has no Sprints, no fixed roles and no required events. Work flows continuously from request to done.

Two published descriptions are widely used. The Kanban Guide from ProKanban.org focuses on three practices and four flow measures. The Kanban Method, associated with David J. Anderson and Kanban University, adds principles about starting from your current process and evolving it gradually. Both share the core ideas below.

### The board

A Kanban board shows each stage of your workflow as a column and each piece of work as a card. A print shop in Lahore that designs and prints wedding cards might use:

| Requests | Design (2) | Client approval (3) | Printing (2) | Delivery | Done |
|---|---|---|---|---|---|
| Card for Ahmed family | Card for Khan family | Rizvi order | Malik order | Shah order | |
| Card for Butt family | Card for Qureshi family | | | | |

The numbers in brackets are WIP limits, explained next. The columns should match how work really moves, not an ideal process from a textbook. Many teams also define what it means for a card to leave each column, for example "client has approved in writing".

### WIP limits

WIP means work in progress. A WIP limit caps how many items can sit in a column, or in the whole system, at once. When the Design column already has two cards, the designer does not start a third. Instead, they help clear work further right, such as chasing a slow client approval.

This feels strange at first because people believe starting more work means finishing more. In practice the opposite is usually true. Too much work in progress means constant switching, long waits and late surprises. The Kanban slogan is "stop starting, start finishing".

### Pull, not push

In a push system, a manager assigns new work whenever someone looks free. In a pull system, a person pulls the next card only when they have capacity under the WIP limit. Pull keeps the system from overloading and makes bottlenecks visible: if cards pile up in "Client approval", the problem is there, not in design.

### The four flow measures

The Kanban Guide names four measures every team should track:

| Measure | Meaning | Print shop example |
|---|---|---|
| WIP | Number of items started but not finished | 8 orders in progress |
| Throughput | Number of items finished per unit of time | 6 orders delivered per week |
| Work item age | Time elapsed since an item started | Rizvi order started 9 days ago |
| Cycle time | Time from start to finish for a completed item | Last orders took 5 to 12 days |

Work item age is especially useful because it warns you about stuck work before it becomes late.

### Little's Law

A relationship from queueing theory, known as Little's Law, links these measures on average over time for a stable system:

\`\`\`text
Average cycle time = Average WIP / Average throughput

Example: 8 orders in progress, 4 finished per week
Average cycle time = 8 / 4 = 2 weeks

Cut WIP to 4 with the same throughput:
Average cycle time = 4 / 4 = 1 week
\`\`\`

This is why limiting WIP shortens delivery time even if nobody works faster. Treat it as a guide for understanding the system, not as a precise prediction for one order.

### Kanban with Scrum

Kanban is not a rival to Scrum that you must choose against. Many Scrum Teams use a Kanban board for their Sprint Backlog, add WIP limits and track cycle time. Scrum.org and ProKanban.org have published material on using the two together. Kanban alone often suits work that arrives unpredictably, such as IT support, maintenance or marketing requests, where planning a fixed Sprint is hard.

### Getting started

Map your current workflow honestly, put every active item on the board, and watch for a week or two before setting limits. Then set WIP limits a little below what you see today, and discuss the board at a short daily check-in. Improve one thing at a time.
      `,
        [
          q('What is the main purpose of a WIP limit?', [
            'To make sure every team member is always fully busy',
            'To cap work in progress so items finish faster and bottlenecks show',
            'To fix the number of Sprints a team can plan before each product release',
            'To set the maximum number of columns on a board',
          ], 1, 'Limiting work in progress reduces switching and waiting, shortens cycle time and makes bottlenecks visible.'),
          q('Which pair of measures does Little\'s Law use to give average cycle time?', [
            'Velocity and story points',
            'Budget and actual cost',
            'Work item age and team size',
            'Average WIP and average throughput',
          ], 3, 'Little\'s Law states that average cycle time equals average work in progress divided by average throughput, for a stable system.'),
          q('Cards pile up in the "Client approval" column while design has spare capacity. What does this show?', [
            'The bottleneck is in client approval, not in design',
            'The design team needs more cards started at once',
            'The board has too few columns to be useful at all',
            'Kanban does not work for small businesses',
          ], 0, 'In a pull system, a pile of waiting cards in one column points to the stage that is limiting flow.'),
        ]
      ),
      lesson('Running Projects in Jira', 14, `
Jira, made by Atlassian, is one of the most widely used tools for software and IT teams, and many Pakistani software houses and outsourcing firms use it because their international clients do. Knowing your way around Jira is a practical advantage when applying for project coordinator or Scrum Master roles. Atlassian changes features, plan names and terminology from time to time, so check its own documentation for current details.

### The building blocks

| Jira concept | What it is | Example |
|---|---|---|
| Project | A container for related work, with its own key | CLINIC for a clinic booking app |
| Work item (long called an issue) | A single piece of work with a key like CLINIC-42 | "Patient books an appointment" |
| Work types | Kinds of item | Epic, Story, Task, Bug, Subtask |
| Workflow | The statuses an item moves through | To Do, In Progress, In Review, Done |
| Board | A visual view of items by status | Scrum board or Kanban board |

Atlassian has been renaming "issues" to "work items", so you will meet both words in tutorials and job descriptions. They mean the same thing.

### The hierarchy

A common structure is:

\`\`\`text
Epic:    Online appointments
  Story: Patient books an appointment with a chosen doctor
    Subtask: Build doctor availability API
    Subtask: Booking form validation
  Story: Patient receives SMS reminder
  Bug:   Booking fails for doctors with no surname
\`\`\`

Epics group large pieces of value, stories and tasks fit within a Sprint, and subtasks break a story into steps. Keep the hierarchy shallow; deep nesting makes the backlog hard to read.

### Scrum and Kanban templates

When creating a software project, Jira offers Scrum and Kanban templates.

- **Scrum template:** gives you a backlog view where you order items, create Sprints, drag items into a Sprint, set a Sprint Goal and start the Sprint. The board then shows only that Sprint's items.
- **Kanban template:** gives a continuous board where you can set column limits that highlight a column when it is over its WIP limit.

Remember that Jira is a tool, not Scrum. Jira lets anyone edit a Sprint mid-way or skip the goal field; the discipline comes from the team.

### Reports

Jira provides built-in reports, which vary by plan and project type. The ones beginners use most:

| Report | Use it to |
|---|---|
| Burndown chart | Track remaining work in the current Sprint |
| Velocity report | See completed work across recent Sprints |
| Sprint report | Review what was completed and what was not |
| Cumulative flow diagram | Spot growing queues in a Kanban flow |

### Searching with JQL

JQL, the Jira Query Language, lets you filter work items precisely. A few examples:

\`\`\`text
project = CLINIC AND status != Done ORDER BY priority DESC
project = CLINIC AND type = Bug AND created >= -7d
assignee = currentUser() AND sprint in openSprints()
\`\`\`

Save useful queries as filters, then show them on a dashboard for stakeholders who do not want to open the board.

### Good habits

1. Write a clear summary line; "Fix bug" tells nobody anything.
2. Put acceptance criteria in the description so Developers and testers share one reference.
3. Move items yourself as work progresses, so the board stays transparent without a manager chasing updates.
4. Keep workflows simple. Every extra status is another place for items to stall.
5. Do not use Jira's time tracking to judge individuals; it damages the honesty that boards depend on.

### Cost and access

Atlassian offers a free plan for small teams and paid plans as teams grow. User limits and prices change, and prices are usually in US dollars, so check Atlassian's pricing page and whether your card can pay in foreign currency before committing a client project to it.
      `,
        [
          q('In Jira, what usually groups several related stories into a larger piece of value?', [
            'A subtask',
            'A filter',
            'An epic',
            'A dashboard gadget',
          ], 2, 'Epics group large pieces of value, which are broken into stories or tasks that fit within a Sprint.'),
          q('What does the Jira Scrum template add that the Kanban template does not?', [
            'A backlog view with Sprints you can plan and start',
            'The ability to create bugs and tasks',
            'Any way to move items between statuses',
            'Support for more than one user on a board',
          ], 0, 'The Scrum template provides a backlog where you create and start Sprints, while the Kanban template offers a continuous board.'),
          q('Your team lets anyone change the Sprint mid-way in Jira, and the Sprint Goal field is always empty. What is the lesson?', [
            'Jira does not support Scrum teams properly',
            'The team should switch immediately to Trello',
            'Sprint Goals are optional in Scrum, so the empty field does not matter',
            'The tool allows it, but Scrum discipline comes from the team',
          ], 3, 'Jira is flexible and will not enforce Scrum, so practices like a Sprint Goal depend on the team itself.'),
        ]
      ),
      lesson('Trello and Asana for Smaller Teams', 13, `
Not every project needs Jira. A marketing agency in Karachi, an NGO running a school programme in Sindh, or a family business in Sialkot launching an export website may find Jira heavy. Trello and Asana are two popular, simpler tools. Both change features and plans regularly, so check their own websites for current details.

### Trello: boards made simple

Trello, also owned by Atlassian, is built around the Kanban board idea from the first topic of this chapter.

| Trello element | What it does |
|---|---|
| Board | One project or workflow |
| List | A column, such as To Do, Doing, Done |
| Card | One piece of work, with description, checklist, due date, labels, attachments and comments |
| Power-Ups | Add-ons such as calendar views or integrations with other apps |
| Automation | Rules that move cards, set due dates or notify people when something happens |

A small event company organising a corporate dinner at a Lahore hotel might set up lists for Ideas, Booked, Waiting on Vendor, Confirmed and Done, with a card each for the venue, catering, sound system, invitations and transport. Checklists inside each card hold the steps, and due dates show on the card.

Trello's strength is that anyone understands it in minutes. Its weakness is that larger projects with many dependencies and reports can outgrow it.

### An automation example

Automation saves the small reminders a coordinator usually does by hand. A rule might read:

\`\`\`text
When a card is moved into list "Waiting on Vendor",
  set due date 3 days from now
  and add the label "Follow up"
When a card is moved into list "Done",
  mark the due date complete
\`\`\`

Check your plan's limits on automation runs before relying on it for a large board.

### Asana: tasks, projects and timelines

Asana is a work management tool built around tasks and projects, with several ways to view the same work.

| Asana element | What it does |
|---|---|
| Project | A set of tasks for one goal, such as "Website launch" |
| Section | A group of tasks inside a project, like a phase |
| Task and subtask | One piece of work with an assignee, due date and comments |
| Views | List, Board, Calendar and Timeline views of the same tasks |
| Dependencies | Mark that one task waits on another, on paid plans |

The Timeline view shows tasks as bars on a calendar, similar to a Gantt chart from Chapter 5, which helps when a project has dates and handoffs. For example, an NGO running teacher training across several districts can see that printing materials must finish before trainers travel.

### Choosing between them

| Situation | Trello fits well | Asana fits well |
|---|---|---|
| Simple visual workflow | Yes | Yes |
| Team new to project tools | Very easy to start | Easy, slightly more to learn |
| Many dependencies and dates | Limited | Stronger with Timeline |
| Several projects to track together | Possible with separate boards | Better portfolio style tracking on paid plans |
| Software Sprints with reports | Jira is usually better | Jira is usually better |

Both offer free plans with limits and paid plans priced per user, usually in US dollars. Limits change, so compare current plans when you decide.

### Habits that matter more than the tool

- One place for the work. If tasks live in Trello, WhatsApp and someone's notebook, nothing is transparent.
- Every card or task has one owner and a clear next step.
- Agree when updates happen, for example before the weekly meeting.
- Archive finished projects so the active view stays clean.

A common pattern in Pakistani teams is that work gets assigned in WhatsApp groups and never reaches the board. Agree early that WhatsApp is for quick conversation, and any real task gets a card. Otherwise the tool becomes an outdated copy of reality.
      `,
        [
          q('In Trello, what is a list?', [
            'An add-on that connects Trello with other apps',
            'A checklist of steps inside one card',
            'A rule that moves cards automatically',
            'A column on a board, such as To Do or Done',
          ], 3, 'Trello boards contain lists, which act as columns, and lists contain cards for each piece of work.'),
          q('Which Asana view is closest to a Gantt chart?', [
            'The List view',
            'The Timeline view',
            'The Board view',
            'The Inbox view',
          ], 1, 'The Timeline view shows tasks as bars across dates, similar to a Gantt chart.'),
          q('Tasks are assigned in WhatsApp groups but never added to the team\'s board. What is the main risk?', [
            'WhatsApp messages cost more than the board subscription',
            'The board will run out of free storage quickly',
            'The board becomes an outdated copy and work is not transparent',
            'Trello and Asana will block the team\'s account',
          ], 2, 'When work lives outside the shared tool, the board no longer shows the real state of work and transparency is lost.'),
        ]
      ),
      lesson('Spreadsheets, Templates and Choosing a Tool', 13, `
Many real projects in Pakistan and South Asia run on Excel or Google Sheets, and that is not a failure. A spreadsheet is free or already paid for, everyone knows it, and it opens on a slow connection. The question is not "spreadsheet or tool" but which one fits this project, team and client.

### What a spreadsheet does well

A single well-built sheet can hold a task list, a simple Gantt view, a risk register from Chapter 7 and a budget tracker from Chapter 6. A small construction contractor in Peshawar might track a house renovation like this:

| Task | Owner | Start | End | Status | Days left |
|---|---|---|---|---|---|
| Demolition | Saleem | 2 Mar | 6 Mar | Done | 0 |
| Plumbing | Arif | 7 Mar | 14 Mar | In progress | 4 |
| Electrical | Nadeem | 10 Mar | 18 Mar | Not started | 8 |
| Tiling | Saleem | 15 Mar | 24 Mar | Not started | 14 |

### Useful formulas

A few formulas turn a list into a live tracker. These work in both Excel and Google Sheets:

\`\`\`text
Working days between two dates (skips weekends):
=NETWORKDAYS(C2, D2)

Flag late tasks:
=IF(AND(E2<>"Done", D2<TODAY()), "Late", "")

Count open tasks (rows that have a task name and are not Done):
=COUNTIFS(A2:A50, "<>", E2:E50, "<>Done")

Percent complete by count:
=COUNTIF(E2:E50, "Done") / COUNTA(E2:E50)
\`\`\`

NETWORKDAYS treats Saturday and Sunday as the weekend and also accepts an optional list of holiday dates, so you can add public holidays such as Eid to keep schedules realistic. If your team works a six-day week, NETWORKDAYS.INTL lets you choose which days count as the weekend; check the function help in your spreadsheet for the weekend codes. Conditional formatting can colour the cells for a simple Gantt view: fill a cell when its column date falls between a task's start and end.

### Templates worth keeping

Build these once and reuse them on every project:

1. **Project charter** from Chapter 3, as a one-page document
2. **Stakeholder register** with influence and interest
3. **Task tracker** with the formulas above
4. **RAID log**: Risks, Assumptions, Issues and Dependencies in one sheet
5. **Status report** with a short red, amber or green summary
6. **Lessons learned log**, which Chapter 12 uses at closing

A template saves time and, more importantly, makes sure you never forget a step.

### Where spreadsheets break down

- Several people editing at once in a desktop file, with versions emailed around
- No easy history of who changed what, unless you use a shared online sheet
- No automatic notifications or reminders
- Dependencies and critical path calculations become fragile and error-prone
- Hundreds of rows become unreadable

When you see two or more of these, it is time to consider a dedicated tool.

### Choosing a tool

Use a simple scoring table. List what matters for your project, weight it, and score each option from 1 to 5:

| Criterion | Weight | Google Sheets | Trello | Asana | Jira |
|---|---|---|---|---|---|
| Team can learn it this week | 3 | 5 | 5 | 4 | 3 |
| Fits our way of working (Scrum, Kanban, dates) | 3 | 3 | 4 | 4 | 5 |
| Client already uses it | 2 | 3 | 2 | 2 | 5 |
| Cost within budget | 2 | 5 | 4 | 3 | 3 |
| Works on slow internet and mobile | 1 | 5 | 4 | 4 | 3 |

Multiply each score by its weight and add up the column. The numbers above are an example only; your scores will depend on your team, your client and current pricing, which you should check on each vendor's site.

### Questions to ask before you switch

- Who will set it up and keep it tidy?
- Does the client need access, and on which plan?
- Can it be paid in a way your company can actually use, such as an international card?
- Can you export your data if you leave?

Start with the simplest tool that works, run one project on it, and move up only when the pain is real. A tidy shared spreadsheet beats an expensive tool nobody updates.
      `,
        [
          q('Which formula counts working days between a start date in C2 and an end date in D2, skipping weekends?', [
            '=DAYS(C2, D2) * 5',
            '=COUNTIF(C2:D2, "Done")',
            '=TODAY() minus C2 plus D2',
            '=NETWORKDAYS(C2, D2)',
          ], 3, 'NETWORKDAYS counts working days between two dates, skipping weekends, and can also take a list of holidays.'),
          q('What does a RAID log track?', [
            'Revenue, Accounts, Invoices and Discounts',
            'Risks, Assumptions, Issues and Dependencies',
            'Roles, Actions, Ideas and Deadlines',
            'Reports, Approvals, Inputs and Decisions',
          ], 1, 'A RAID log keeps risks, assumptions, issues and dependencies together in one place.'),
          q('Which situation most clearly suggests moving from a spreadsheet to a dedicated tool?', [
            'The project has fewer than ten tasks and one person updating the sheet',
            'The team already knows Excel well',
            'Many people edit emailed versions and dependencies keep breaking',
            'The client prefers to receive a weekly email summary',
          ], 2, 'Version confusion and fragile dependencies are signs a spreadsheet has reached its limits for that project.'),
        ]
      ),
      ],
      [
      q('A support team gets unpredictable requests every day. Which approach usually fits best?', [
        'Kanban with WIP limits and continuous flow',
        'Fixed one-month Sprints planned in advance',
        'A full predictive plan with a baseline',
        'Waiting until requests are batched each quarter',
      ], 0, 'Kanban suits work that arrives unpredictably because it manages continuous flow rather than planning fixed Sprints.'),
      q('A team has 10 items in progress and finishes 5 per week. Using Little\'s Law, what is the average cycle time?', [
        'Half a week',
        'Five weeks',
        'Fifty weeks',
        'Two weeks',
      ], 3, 'Average cycle time equals average WIP divided by average throughput, so 10 divided by 5 gives two weeks.'),
      q('A small NGO needs to see training dates and which tasks wait on others. Which tool feature helps most?', [
        'A Trello Power-Up for adding stickers to cards',
        'A JQL filter showing only bugs from last week',
        'Asana\'s Timeline view with task dependencies',
        'A spreadsheet COUNTIF formula on the status column',
      ], 2, 'A timeline with dependencies shows dates and handoffs, which suits a project driven by schedules.'),
      q('When scoring tools in a weighted table, what should you do with pricing?', [
        'Assume the prices you remember from last year still apply',
        'Check current prices on each vendor\'s own site',
        'Ignore cost because all tools are free for everyone',
        'Use the cheapest tool whatever the other scores say',
      ], 1, 'Plans and prices change over time, so they should be checked on the vendor\'s site before deciding.'),
      ]
    ),
    chapter(
      'Leading, Closing and Getting Certified',
      'Lead and motivate a project team, handle conflict and difficult stakeholders, close a project properly with lessons learned, and plan a realistic route to the CAPM, PMP or PSM I certification.',
      [
      lesson('Leading and Motivating a Project Team', 13, `
Plans, charts and tools do not deliver projects; people do. Most accidental project managers discover that their hardest problems are not technical. Someone stops replying to messages, two members will not work together, or the whole team loses energy halfway through. Leadership is the skill of getting a group of people to do their best work toward a shared goal, often without formal authority over them.

### Authority you have and authority you earn

Many project managers do not manage their team members' salaries or promotions. A coordinator at a Lahore software house may lead developers who report to a technical head. Influence then comes from other sources:

| Source of influence | What it looks like |
|---|---|
| Formal | Your title or the sponsor's backing in the charter |
| Expertise | People trust your judgement on planning and risk |
| Relationships | You know people well and they want to help you |
| Information | You know what is happening and share it openly |
| Example | You meet your own commitments and admit your mistakes |

Formal authority gets compliance at best. The other sources get real commitment, and they are available to anyone.

### Servant leadership

Agile approaches, including the Scrum Master accountability from Chapter 9, emphasise servant leadership: the leader's job is to help the team succeed rather than to command it. In practice that means removing obstacles, protecting the team from constant interruptions, making sure people have what they need, and asking more questions than you answer. It does not mean doing whatever anyone wants; a servant leader still holds standards and makes hard calls.

### How teams develop

Bruce Tuckman's model describes stages many teams pass through. He published the first four in 1965 and later added a fifth.

| Stage | What you see | What the leader does |
|---|---|---|
| Forming | Polite, unsure, waiting for direction | Set clear goals, roles and ways of working |
| Storming | Disagreements about approach and roles | Bring conflict into the open and keep it about the work |
| Norming | Agreed habits, growing trust | Step back, let the team own more decisions |
| Performing | Self-directed, high output | Remove obstacles, protect focus |
| Adjourning | Project ends, team disbands | Recognise contributions, close well |

Teams do not always move in order. A new member or a big change can send a performing team back to storming. That is normal, not a failure.

### What motivates people at work

Money matters, and in an economy with rising costs nobody should pretend otherwise. But beyond fair pay, project managers rarely control salaries, so focus on what you can influence. Daniel Pink's book Drive popularised three factors that are widely used in practice:

1. **Autonomy.** Let people decide how to do their work. Tell the team what outcome is needed and why, not every step.
2. **Mastery.** Give chances to learn and grow, such as a junior developer leading a small feature with support.
3. **Purpose.** Connect the work to people it helps. "This system means patients in Hyderabad will not queue for two hours" motivates more than "finish ticket 42".

Recognition is the cheapest tool you have and the most underused. Thank people specifically and publicly: "Hina's test cases caught the payment bug before launch" beats a general "good job, team".

### Working across cultures and hierarchies

In many South Asian workplaces, respect for seniority runs deep. Juniors may agree in meetings and raise concerns only privately, if at all. Practical ways to get honest input:

- Ask for written input before meetings so quieter people are heard.
- Ask juniors for their view before seniors speak.
- Hold short one-to-one check-ins with each team member every week or two.
- Respond calmly to bad news so people keep bringing it early.

### A weekly leadership routine

\`\`\`text
Monday:    Check the plan or board with the team; confirm priorities
Midweek:   One-to-one chats with two or three team members
Ongoing:   Remove at least one obstacle the team raised
Friday:    Share one specific piece of recognition
Monthly:   Ask the team, "What should I do more of, or less of?"
\`\`\`

None of this needs a budget. It needs consistency, which is what turns a group of people into a team.
      `,
        [
          q('You lead developers who report to a technical head, not to you. Which influence source is most dependable over time?', [
            'Threatening to report problems to their head',
            'Earned trust from expertise, relationships and example',
            'Your job title written in the email signature',
            'Control of the team\'s salaries and promotions',
          ], 1, 'Without formal authority, influence comes from expertise, relationships, information and your own example, which build real commitment.'),
          q('A team argues openly about how to split work and who decides. Which Tuckman stage is this?', [
            'Forming',
            'Norming',
            'Adjourning',
            'Storming',
          ], 3, 'Storming is the stage where disagreements about approach and roles surface, and the leader keeps the conflict focused on the work.'),
          q('Which is the clearest example of giving autonomy?', [
            'Explaining the outcome and why, then letting the team decide how',
            'Writing a detailed step list for every task each morning',
            'Approving every small decision before work continues',
            'Checking each person\'s screen activity throughout the day',
          ], 0, 'Autonomy means people decide how to do their work once they understand the goal and its purpose.'),
        ]
      ),
      lesson('Handling Conflict and Difficult Stakeholders', 14, `
Conflict on projects is normal. People compete for limited time, money and attention, and they see the same problem from different positions. Conflict about the work, such as which approach is better, can improve decisions. Conflict that becomes personal damages trust and slows everything down. The project manager's job is not to eliminate conflict but to keep it useful.

### Common sources of project conflict

| Source | Example |
|---|---|
| Priorities | Sales wants a feature for a big client; operations wants a bug fixed first |
| Resources | Two projects both need the only experienced designer next week |
| Schedules | A vendor's delay squeezes the testing time |
| Technical opinions | Developers disagree on which framework to use |
| Personalities and style | One person wants detail, another wants speed |

Knowing the source helps you pick the right response.

### Five ways to handle conflict

A widely used model, the Thomas-Kilmann instrument, describes five modes. The PMBOK Guide has described similar techniques with slightly different names.

| Mode | Also called | When it fits | Risk |
|---|---|---|---|
| Collaborating | Problem solving | Important issue, time to find a solution that works for both sides | Takes time and effort |
| Compromising | Reconciling | Both sides give something to reach a quick, acceptable deal | Nobody gets what they really needed |
| Accommodating | Smoothing | Issue matters more to the other person; relationship is the priority | Your needs keep being ignored |
| Competing | Forcing, directing | Urgent safety or legal issue needing a quick decision | Resentment if overused |
| Avoiding | Withdrawing | Trivial issue, or emotions need time to cool | Problem grows if ignored for good |

No mode is always right. Collaborating usually gives the most lasting result, but forcing is correct if someone wants to skip a safety check on a construction site in Gujranwala.

### A conversation structure that works

When two team members are in conflict, meet them together after cooling down, and use a simple structure:

\`\`\`text
1. Facts:     "The API was due Tuesday; testing started Friday."
2. Impact:    "We lost three test days and the release is at risk."
3. Views:     Each person explains their side without interruption.
4. Interests: "What do you each actually need here?"
5. Options:   Brainstorm at least three solutions together.
6. Agree:     One action, one owner, one date. Follow up.
\`\`\`

Separating positions from interests is the key move. A position is what someone demands: "I need the designer all week." An interest is why: "My client presentation is on Thursday." Interests often have more than one solution.

### Difficult stakeholders

Some stakeholders resist the project, change their minds often, or bypass you to give orders to your team. Common types and responses:

| Behaviour | Likely cause | Response to try |
|---|---|---|
| Constant new requests | Unclear scope or fear of missing out | Route every request through the change process from Chapter 4 |
| Silence, then late objections | Not consulted early | Involve them in reviews; ask for sign-off at milestones |
| Going around you to the team | Low trust or urgency | Meet privately, agree one channel, involve the sponsor if needed |
| Open hostility | Project threatens their role or budget | Understand the threat; show what is in it for them |

Return to your stakeholder map from Chapter 3. A high-power stakeholder who is unhappy deserves more of your time, not less.

### Escalating well

Escalation is not a failure; it is a tool, but use it carefully. Before escalating to the sponsor:

- Try to resolve the issue directly first, and say that you did.
- Bring facts, impact and options, not complaints.
- Tell the other person you plan to escalate, so it is not a surprise.

For example: "Our Faisalabad plant manager and the IT lead disagree on the go-live date. Option A protects the season's orders; option B gives more test time. I recommend A with an extra weekend of testing. I need your decision by Thursday."

### Look after yourself

Handling conflict is tiring. Take notes after difficult meetings, keep promises in writing, and find a mentor or peer you can talk to. Staying calm is easier when you are not carrying everything alone.
      `,
        [
          q('Which conflict mode fits best when someone wants to skip a safety check on a building site?', [
            'Avoiding, until the person calms down',
            'Accommodating, to protect the relationship',
            'Competing or forcing, because safety is not negotiable',
            'Compromising, by skipping only half the check',
          ], 2, 'Forcing is appropriate for urgent safety or legal issues where a quick, firm decision is required.'),
          q('What is the difference between a position and an interest in a conflict?', [
            'A position is what someone demands; an interest is why they need it',
            'A position is written down; an interest is only ever spoken aloud',
            'Positions belong to managers; interests belong to the team members',
            'They are two names for exactly the same thing in a negotiation',
          ], 0, 'Interests explain the need behind a demand, and they usually allow more possible solutions than the stated position.'),
          q('A stakeholder raises objections only at the end of each phase after staying silent. What is a good response?', [
            'Remove them from the stakeholder register',
            'Ignore the objections because they came late',
            'Ask the sponsor to stop them from commenting',
            'Involve them earlier in reviews and milestone sign-offs',
          ], 3, 'Late objections often come from not being consulted early, so involving the stakeholder at reviews surfaces concerns when they are cheaper to fix.'),
        ]
      ),
      lesson('Closing a Project and Capturing Lessons Learned', 13, `
Many projects never really end. The product launches, everyone moves to the next urgent thing, the vendor's last invoice stays unpaid, and nobody records what was learned. Closing is a short phase, but skipping it causes problems for months: the client disputes completion, the support team does not know how the system works, and the next project repeats the same mistakes.

### What closing includes

The PMBOK Guide treats closing as formally completing the project or phase. Whatever lifecycle you used, the same checklist applies:

| Step | What to do | Example |
|---|---|---|
| Confirm acceptance | Get written confirmation that deliverables meet the agreed criteria | Client signs off the new website against the acceptance list |
| Hand over | Transfer the product to the people who will run it | Training and documents for the support team |
| Close contracts | Confirm vendors delivered, settle final payments, return any guarantees | Final payment to the printing vendor |
| Finalise finances | Record final costs against the budget from Chapter 6 | Actual spend compared with plan |
| Release resources | Free people, equipment and office space | Developers return to their departments |
| Archive | Store plans, decisions, contracts and reports where others can find them | Shared drive folder with a clear name |
| Capture lessons | Hold a lessons learned session and record the results | Lessons log, shared with other PMs |
| Celebrate | Recognise the team's work | A team lunch or a thank-you note from the sponsor |

### Projects that end early

Not every project finishes as planned. Funding is cut, priorities change or the business case collapses. A project that is stopped still needs closing: record what was completed, what was spent and why it ended, and hand over anything useful. Ending a failing project early can be a good decision; it frees people and money for better work.

### Lessons learned versus retrospectives

Chapter 10 covered the Sprint Retrospective, which improves the team's way of working every Sprint. A project lessons learned session looks at the whole project, often with a wider group including the sponsor, vendors and key stakeholders. Agile teams that ran retrospectives throughout will find this session easier, because many lessons are already recorded.

The best practice is not to wait for the end. Keep a lessons log open from the start and add to it at each milestone, while details are fresh.

### Running the session

\`\`\`text
Before:   Send three questions in advance; collect anonymous input
Question: What went well that we should repeat?
Question: What went badly that we should avoid?
Question: What would we do differently if we started again?
During:   Group answers by theme: scope, schedule, people, vendors, tools
After:    For each theme, write one specific, reusable lesson
Share:    Put the lessons where the next project manager will find them
\`\`\`

### Writing useful lessons

Vague lessons help nobody. Compare:

| Vague | Useful |
|---|---|
| Communication should be better | Weekly status emails to the client cut repeat questions; start them from week one |
| Vendors were a problem | Ask printing vendors in Karachi for a sample run before the bulk order; one sample saved a reprint |
| Testing was rushed | Protect at least the planned testing days; when development slipped, we cut testing and found bugs after launch |

A good lesson names the situation, what happened, and what to do next time.

### Making lessons stick

Most organisations collect lessons and never read them again. To break that pattern:

- Start each new project by reading the lessons from two similar past projects.
- Turn repeated lessons into changes to templates or checklists, such as adding a vendor sample step to your procurement checklist.
- Keep the lessons log short and searchable rather than a long report.

### A closing report

Finish with a one or two page closing report for the sponsor: objectives and whether they were met, final scope, schedule and cost against plan, key lessons, and any open items with owners. It gives the sponsor a clear end point and gives you a record of your work for your next role or certification application.
      `,
        [
          q('A website launched, but the client never signed off and the vendor\'s final invoice is unpaid. What has been skipped?', [
            'The kickoff meeting',
            'Formal project closing',
            'Sprint Planning',
            'The risk identification workshop',
          ], 1, 'Closing includes confirming acceptance and settling contracts, so a missing sign-off and an unpaid vendor show closing was skipped.'),
          q('How does a project lessons learned session differ from a Sprint Retrospective?', [
            'It is only for the Developers on the Scrum Team',
            'It happens every two weeks during delivery',
            'It is limited to a strict 15-minute timebox',
            'It reviews the whole project, often with a wider group',
          ], 3, 'A Sprint Retrospective improves the team\'s work each Sprint, while lessons learned review the whole project with stakeholders such as the sponsor and vendors.'),
          q('Which is the most useful way to record a lesson?', [
            'Name the situation, what happened, and what to do next time',
            'Write one word per lesson so the log stays short',
            'Record only successes, so the team stays motivated',
            'Note who made each mistake so it does not happen again',
          ], 0, 'A specific lesson with context and a clear next action can be reused, unlike vague or blame-focused notes.'),
        ]
      ),
      lesson('Certification Paths: CAPM, PMP and PSM I', 14, `
A certification is not required to manage projects, and many excellent project managers have none. But a recognised credential can help you get interviews, especially for roles with international clients, and studying for it fills gaps in your knowledge. This topic covers three common choices. Exam rules, fees and formats change, so treat everything here as a starting map and confirm each detail on the official website before you pay.

### The three at a glance

| Certification | Awarded by | Aimed at | Main reference |
|---|---|---|---|
| CAPM, Certified Associate in Project Management | PMI, the Project Management Institute | Beginners and those early in their careers | PMI's CAPM Exam Content Outline and handbook |
| PMP, Project Management Professional | PMI | Experienced project leaders | PMI's PMP Exam Content Outline and handbook |
| PSM I, Professional Scrum Master I | Scrum.org | Anyone wanting to prove Scrum knowledge | The Scrum Guide |

### CAPM

PMI describes the CAPM as an entry-level certification. At the time of writing, PMI's published eligibility asks for a secondary degree, such as a high school diploma or global equivalent, plus 23 hours of project management education completed by the time you sit the exam. No work experience is required, which makes it suitable for students and accidental PMs.

PMI publishes an Exam Content Outline that lists the domains and tasks the exam covers. Download the current one from pmi.org before you study, because PMI revises it.

### PMP

The PMP is PMI's best-known certification and is aimed at people who already lead projects. PMI's eligibility is based on education, experience and training. The main routes have been:

\`\`\`text
Four-year degree:
  36 months of experience leading projects within the past eight years
  + 35 hours of project management education or training, or a CAPM

Secondary degree:
  60 months of experience leading projects within the past eight years
  + 35 hours of project management education or training, or a CAPM
\`\`\`

PMI has also listed other routes, and requirements can change, so read the current PMP handbook. Your application describes the projects you led, and PMI may audit it, so keep records such as the closing reports from the previous topic.

The PMP exam covers predictive, agile and hybrid approaches, which matches the structure of this course. PMI updates the exam content outline periodically, so study from the version that applies on your exam date.

### PSM I

PSM I is offered by Scrum.org, which was founded by Ken Schwaber, a co-creator of Scrum. It tests your understanding of Scrum as described in the Scrum Guide. Scrum.org does not require you to attend a course before taking the assessment. At the time of writing, Scrum.org lists it as an online assessment of 80 questions in 60 minutes with a passing score of 85 percent, and the certification does not need renewal. Check scrum.org for the current format and fee.

Scrum.org also offers a free practice assessment called Scrum Open. Many candidates use it repeatedly until they score consistently high, then read the Scrum Guide again carefully, because exam questions often turn on its exact wording.

### Keeping PMI certifications active

PMI certifications have a renewal cycle. You earn professional development units, or PDUs, through learning and work activities, and report them to PMI within each cycle. The number required differs by certification, so check PMI's continuing certification requirements.

### Practical points for learners in Pakistan

| Question | What to check |
|---|---|
| How do I pay? | Fees are usually charged in US dollars; check your bank card allows international payments |
| Is PMI membership worth it? | Members usually pay lower exam fees; compare total cost on pmi.org |
| Where do I take the exam? | Check the online and test-centre options listed on the official site |
| Is there local support? | PMI lists its local chapters in a chapter directory on pmi.org; some Pakistani cities have chapters that hold events |

Be careful with training providers who promise guaranteed passes or "real exam questions". Sharing live exam content breaks the certification rules and can cost you the credential.

### Choosing your path

- **New to projects, no experience:** start with the CAPM, or the PSM I if you are joining a Scrum team.
- **Working in a software company using Scrum:** PSM I is a strong, affordable first step.
- **Several years leading projects:** the PMP is the widely recognised goal; log your hours now.

Whichever you choose, apply what you learn on a real project at the same time. The credential opens doors, but the experience is what keeps you in the room.
      `,
        [
          q('Which certification is designed for people with no project management work experience?', [
            'PMP',
            'PMI-RMP for risk managers',
            'CAPM',
            'Senior Scrum Master certification',
          ], 2, 'PMI describes the CAPM as an entry-level certification that does not require project work experience.'),
          q('What is the main reference for the PSM I assessment?', [
            'The PMBOK Guide',
            'The Scrum Guide',
            'Atlassian\'s Jira documentation',
            'The Kanban Guide',
          ], 1, 'Scrum.org\'s PSM I tests understanding of Scrum as described in the Scrum Guide.'),
          q('A friend says a training centre guarantees a PMP pass using real exam questions. What should you tell them?', [
            'It is a smart shortcut used by most candidates',
            'It is fine as long as the centre is in Pakistan',
            'Sharing live exam content breaks the rules and risks the credential',
            'It is required because PMI does not publish any study guidance',
          ], 2, 'Using or sharing live exam content breaks certification rules and can lead to losing the credential.'),
        ]
      ),
      ],
      [
      q('A performing team gains two new members and arguments start again. What is the best way to read this?', [
        'It is normal; teams can move back to storming after changes',
        'The team has failed and should be disbanded right away',
        'The new members should be removed from the project',
        'The leader should stop all discussion until the end',
      ], 0, 'Tuckman\'s stages are not strictly one-way, and a change in membership often sends a team back to storming for a while.'),
      q('Before escalating a dispute to the sponsor, what should a project manager bring?', [
        'A complaint about the other person\'s attitude',
        'A request for the sponsor to choose a side',
        'Nothing, since escalation should happen at once',
        'Facts, impact and options with a recommendation',
      ], 3, 'Good escalation shows the issue clearly with facts, impact and options so the sponsor can decide quickly.'),
      q('A project is cancelled halfway because funding was cut. What should happen next?', [
        'Nothing, since only finished projects are closed',
        'Delete the files so nobody repeats the work',
        'Close it formally: record status, costs and reasons, and hand over',
        'Keep the team assigned until funding returns',
      ], 2, 'Projects that end early still need closing, so completed work, spending and reasons are recorded and useful outputs handed over.'),
      q('Where should you confirm the current exam format and fees for CAPM, PMP or PSM I?', [
        'In a training centre\'s social media advertisement',
        'On the official PMI and Scrum.org websites',
        'In a forum post from several years ago',
        'From a colleague who passed a long time ago',
      ], 1, 'Exam formats, fees and eligibility change, so the awarding bodies\' own websites are the reliable source.'),
      ]
    ),
  ],
  final: [
    q('A Karachi telecom firm runs a call centre and plans to move it to a new building next year. Which part of this work is a project?', [
      'Answering customer calls every day of the year',
      'Moving the call centre into the new building',
      'Training new agents on the usual scripts each month',
      'Reporting monthly call volumes to the board',
    ], 1, 'The move is temporary and creates a unique result, while the other tasks repeat as ongoing operations.'),
    q('You are told to coordinate a school\'s new admissions portal on top of your normal job. What is the most useful first step?', [
      'Start building the portal pages yourself to save time',
      'Wait until the principal gives you a formal job title and a team',
      'Keep the plan in your head until things settle down',
      'Agree the goal, your decision rights and who approves spending',
    ], 3, 'Accidental project managers need clear goals and authority agreed at the start, otherwise every decision stalls later.'),
    q('A wedding hall renovation has a fixed opening date and a fixed budget, and the owner now wants a larger kitchen. What is the sound response?', [
      'Show which other scope must shrink to make room for it',
      'Add the kitchen quietly and ask the team to work faster',
      'Refuse the request because the plan is already approved',
      'Accept it and lower the finishing standard everywhere else without telling anyone',
    ], 0, 'With time and cost fixed, extra scope must be balanced by removing other scope, and that trade-off should be visible to the owner.'),
    q('A learner preparing for both PSM I and general project work asks which reference to use for what. What is the best advice?', [
      'Use only blog summaries, since both official guides are too long to read',
      'Use the PMBOK Guide for Scrum events and the Scrum Guide for budgets',
      'Use the Scrum Guide for Scrum and the PMBOK Guide for wider practice',
      'Use the PMBOK Guide alone, because it replaces the Scrum Guide',
    ], 2, 'The Scrum Guide is the official definition of Scrum, while the PMBOK Guide covers project practice across many approaches.'),
    q('A government building contract requires full design approval and permits before any construction starts. Which lifecycle fits this work best?', [
      'An agile lifecycle with one-month Sprints',
      'A predictive lifecycle with phase gates',
      'Kanban with no planned end date',
      'Iterative prototypes built on site',
    ], 1, 'Stable, approved requirements and costly late changes are the conditions where a predictive lifecycle works well.'),
    q('A company releases a finished payroll module first and a leave tracking module months later, each usable on its own. What is this?', [
      'Incremental delivery of finished parts',
      'Iterative refinement of one rough version',
      'A predictive project with no releases until the very end',
      'Gold-plating the payroll module',
    ], 0, 'Delivering complete, usable pieces one after another is incremental delivery.'),
    q('An Islamabad founder cannot say which features users want, but she can meet the team every week. Why does an agile lifecycle suit her?', [
      'It removes the need for any budget or deadline',
      'It lets the team skip testing until launch',
      'It guarantees the full product is finished sooner and for less money',
      'Short cycles let real user feedback shape the next steps',
    ], 3, 'Agile works best when needs are uncertain and a customer is available to give frequent feedback on each cycle.'),
    q('A bank insists on a fixed budget and launch date, but the app\'s exact features are still uncertain. Which hybrid pattern fits?', [
      'Agile outside for funding and predictive inside for all the features',
      'Predictive outside for budget and milestones, with Sprints inside',
      'Pure predictive with every screen specified before work starts',
      'Pure Kanban with no dates',
    ], 1, 'Fixing the commercial frame predictively while delivering the uncertain work in Sprints is a common hybrid pattern.'),
    q('Two options in a business case cost the same, but one brings its benefits years earlier. Which measure reflects that timing difference?', [
      'Net present value, which discounts future cash flows',
      'The total cost of each option on its own',
      'The number of deliverables in each option',
      'The length of the business case document for each option',
    ], 0, 'Net present value converts future money into today\'s terms, so earlier benefits score higher.'),
    q('A vendor asks the PM whether she can approve a small extra cost, and nobody knows. What does this reveal about the charter?', [
      'It listed too many stakeholders',
      'It should have included a detailed Gantt chart',
      'It did not state the PM\'s authority plainly',
      'It was signed by the sponsor too early',
    ], 2, 'A charter should say what the project manager may decide and spend, so these questions have a clear answer.'),
    q('A union leader shows little interest in your project now but could stop it if he chose. Where does he sit on the power and interest grid?', [
      'Manage closely',
      'Keep informed',
      'Monitor only',
      'Keep satisfied',
    ], 3, 'High power with low interest calls for focused updates that keep the person satisfied without overloading them.'),
    q('A RACI chart marks two managers as A for the same deliverable. What is wrong?', [
      'Nobody on the chart is responsible for the actual work',
      'Final accountability is split; only one person should be A',
      'The chart should not include managers at all',
      'Every deliverable needs at least two people marked A',
    ], 1, 'One accountable person per deliverable avoids confusion about who owns the final result.'),
    q('"Parents can see each child\'s dues and pay them online by card." What type of requirement is this?', [
      'Functional requirement',
      'Non-functional requirement',
      'Transition requirement',
      'Business requirement',
    ], 0, 'It describes what the solution must do, which makes it a functional requirement.'),
    q('Which line belongs under assumptions in a scope statement?', [
      'Total spending must stay within the approved budget',
      'Printing of shop signage is not included in this project',
      'Each brochure must pass the client\'s proof checklist',
      'The landlord will hand over the shop by 1 March',
    ], 3, 'An assumption is believed true but not yet confirmed; the others are a constraint, an exclusion and an acceptance criterion.'),
    q('The work packages under one WBS branch include a task that is not in the approved scope. Which rule does this break?', [
      'The rule that work packages are verbs',
      'The rule that every branch has three levels',
      'The 100 percent rule',
      'The rule that the PM owns every package',
    ], 2, 'The 100 percent rule says the WBS covers all approved work and nothing outside it.'),
    q('Small requests have been added through chat for weeks with no change to time or budget, and the deadline is slipping. What fixes this going forward?', [
      'Log every request and assess its impact before approval',
      'Ask the team to work weekends until the schedule catches up again',
      'Stop answering the client on chat altogether',
      'Remove testing time to make room for the new work',
    ], 0, 'A simple change control process makes the cost of each request visible before anyone agrees to it.'),
    q('Using the PERT formula, what is the estimate when O = 4, M = 6 and P = 14 days?', [
      '6 days',
      '7 days',
      '8 days',
      '9 days',
    ], 1, 'PERT gives (O + 4M + P) / 6, so (4 + 24 + 14) / 6 = 7 days.'),
    q('Path A, B, D takes 15 days and path A, C, D takes 11 days. Activity C slips by 3 days. What happens to the finish date?', [
      'It moves 3 days later',
      'It moves 4 days later',
      'It moves 1 day earlier',
      'It does not move',
    ], 3, 'C\'s path has 4 days of float against the 15-day critical path, so a 3-day slip is absorbed.'),
    q('Painting can start only after plastering finishes and the plaster has had time to dry. How is this best modelled?', [
      'Finish-to-start with a lag',
      'Start-to-start with a lead',
      'Finish-to-finish with no wait',
      'Start-to-finish with a lead',
    ], 0, 'Painting waits for plastering to finish and then for a forced waiting period, which is a finish-to-start dependency with a lag.'),
    q('You are two weeks behind, there is no extra money, and design and build could overlap. Which technique fits?', [
      'Crashing with paid overtime and extra staff',
      'Moving the baseline without telling anyone',
      'Fast tracking, while accepting a risk of rework',
      'Adding more milestones to the plan',
    ], 2, 'Fast tracking overlaps activities for little extra cost, but changes in the earlier work can cause rework.'),
    q('Where does the money for a planned response to a known risk usually sit?', [
      'In the management reserve, held by the sponsor',
      'In the contingency reserve, inside the cost baseline',
      'Outside the budget, as hidden padding in each cost line',
      'In the next project\'s budget',
    ], 1, 'Known unknowns from the risk register are covered by contingency reserve, which is part of the cost baseline.'),
    q('At a status date, PV is 400,000, EV is 400,000 and AC is 480,000. What is the position?', [
      'Ahead of schedule and under budget',
      'Behind schedule and under budget',
      'Behind schedule and on budget',
      'On schedule and over budget',
    ], 3, 'EV equals PV so SPI is 1.0, while AC exceeds EV by 80,000 so the work cost more than planned.'),
    q('BAC is 1,200,000 and the CPI has been steady at 0.75. Assuming that continues, what is the estimate at completion?', [
      '1,600,000',
      '900,000',
      '1,275,000',
      '1,200,000',
    ], 0, 'EAC = BAC / CPI, so 1,200,000 / 0.75 = 1,600,000.'),
    q('A work package has been reported as "90 percent done" for four weeks running. What change to measurement helps most?', [
      'Ask the owner to report a higher percentage',
      'Credit progress only at defined completion points',
      'Stop measuring that package until it finishes',
      'Move its budget into the management reserve',
    ], 1, 'Rules such as 0/100 or 50/50 tie earned value to visible completion and stop optimistic estimates of unfinished work.'),
    q('On a 3 by 3 matrix, a risk has medium probability (2) and high impact (3). What is its score?', [
      '3',
      '5',
      '6',
      '9',
    ], 2, 'Multiplying probability by impact gives 2 x 3 = 6.'),
    q('The team drops a feature that depends on an unproven third-party service. Which threat response is this?', [
      'Transfer',
      'Mitigate',
      'Accept',
      'Avoid',
    ], 3, 'Changing the plan so the threat can no longer occur is avoidance.'),
    q('Customers return faulty products after delivery and complain publicly. Which cost of quality category is this?', [
      'External failure cost',
      'Prevention cost',
      'Appraisal cost',
      'Internal failure cost',
    ], 0, 'Failures found by customers after delivery are external failure costs, usually the most expensive kind.'),
    q('The sponsor wants one page a week, while developers need daily task detail. What should the communication plan do?', [
      'Send everyone the full daily task list',
      'Tailor the content and frequency to each audience',
      'Send only the weekly page to everyone involved',
      'Leave each person to ask for what they need',
    ], 1, 'Good communication plans match purpose, method and frequency to what each audience needs.'),
    q('The schedule is slipping and the PM believes she can recover it with an agreed plan. How should the status be shown?', [
      'Green, since recovery is likely',
      'Red, with no explanation',
      'Amber, with the recovery plan stated',
      'Left blank until the outcome is known',
    ], 2, 'Amber honestly signals a problem that is being managed, and the recovery plan tells readers what is being done.'),
    q('A team shows the client a clickable prototype instead of sending a long specification for approval. Which manifesto value is it applying?', [
      'Processes and tools over individuals and interactions',
      'Contract negotiation over customer collaboration',
      'Following a plan over responding to change',
      'Working software over comprehensive documentation',
    ], 3, 'A usable result shows progress better than a document, which is what this value prefers.'),
    q('The client\'s product contact can only meet the team once a month. Which agile principle does this weaken?', [
      'Business people and developers working together daily',
      'Maximising the amount of work not done',
      'Keeping a sustainable, constant pace',
      'Attention to technical excellence and good design',
    ], 0, 'The principle expects business people to be reachable every day so questions are answered quickly.'),
    q('"As a parent, I want the fee page to be fast, so that I can pay quickly." Which INVEST quality does this story most clearly fail?', [
      'Independent',
      'Negotiable',
      'Testable',
      'Valuable',
    ], 2, 'Nobody can tell when "fast" has been achieved, so the story cannot be tested until a measurable limit, such as a load time, is agreed.'),
    q('A new team wants to start estimating in story points. What should it agree first?', [
      'An exchange rate of one point to eight hours for every Developer',
      'A familiar reference story to compare others against',
      'A target number of points per person per day',
      'The manager\'s own estimate for every story',
    ], 1, 'Story points are relative, so a shared reference story gives everyone the same baseline.'),
    q('A team checks its progress every day but never changes its plan when the numbers show trouble. Which Scrum pillar is missing?', [
      'Transparency',
      'Inspection',
      'Adaptation',
      'Commitment',
    ], 2, 'Inspection without adjustment wastes the information; adaptation means changing course when inspection reveals a problem.'),
    q('An experienced project manager joins a Scrum Team. What does the Scrum Guide say about her role?', [
      'It defines none, so she takes a defined accountability or works outside',
      'It makes her the team\'s fourth accountability, above the Scrum Master',
      'It places her above the Product Owner for all backlog decisions',
      'It requires her to run every Scrum event and approve each Increment',
    ], 0, 'The Scrum Guide has only Product Owner, Scrum Master and Developers, so a PM becomes one of these or supports the team from outside.'),
    q('A Scrum Master assigns each task to individual Developers every morning. Who should decide how the Sprint work gets done?', [
      'The Product Owner',
      'The Scrum Master',
      'The Developers',
      'The project sponsor',
    ], 2, 'Developers own the Sprint Backlog and plan how to turn selected items into a Done Increment.'),
    q('At the end of a Sprint, an item does not meet the Definition of Done. What happens to it?', [
      'It returns to the Product Backlog for future consideration',
      'It is shown at the Sprint Review as almost finished and counted in velocity',
      'It is released, and testing finishes later',
      'It is marked done if the Product Owner approves',
    ], 0, 'Work that does not meet the Definition of Done is not part of the Increment and goes back to the Product Backlog.'),
    q('An organisation puts 18 people into one Scrum Team. What does the Scrum Guide suggest?', [
      'Appoint two Product Owners so each can order half of the backlog',
      'Split into cohesive teams sharing one Product Backlog and Owner',
      'Keep one team and lengthen every Sprint',
      'Remove the Scrum Master to save meeting time',
    ], 1, 'The guide says a Scrum Team is typically 10 or fewer, and larger groups should reorganise into multiple teams sharing one Product Goal, Product Backlog and Product Owner.'),
    q('During Sprint Planning, who crafts the Sprint Goal?', [
      'The Product Owner alone, before the event',
      'The Scrum Master, after the event ends',
      'The stakeholders at the previous Sprint Review',
      'The whole Scrum Team together',
    ], 3, 'The Product Owner proposes how the product could gain value, and the whole Scrum Team then crafts the Sprint Goal.'),
    q('A Scrum Master runs the Daily Scrum by asking each Developer for a status update in turn. What should change?', [
      'The Product Owner should run it instead',
      'Developers run it, focused on the Sprint Goal',
      'It should move to once a week to save time',
      'Each update should be sent by email instead',
    ], 1, 'The Daily Scrum is for the Developers to inspect progress toward the Sprint Goal and adapt their plan.'),
    q('A team\'s Sprint Review has become a slide presentation with no working product shown. What should it be?', [
      'A meeting where the team defends its velocity',
      'A private session for the Scrum Team only, with no stakeholders invited',
      'A working session where stakeholders try the Increment',
      'A review of each person\'s hours for the Sprint',
    ], 2, 'The Sprint Review inspects the real Increment with stakeholders and adapts the Product Backlog from their feedback.'),
    q('Halfway through a Sprint, the burndown line rises for two days. What should the team do first?', [
      'Check whether work was added or re-estimated',
      'Ignore it until the last day of the Sprint',
      'Redraw the ideal line to match the actual one',
      'Cancel the Sprint immediately',
    ], 0, 'A rising line usually means scope was added or estimates grew, which should be discussed with the Product Owner.'),
    q('The Design column has a WIP limit of 2 and holds 2 cards when a new request arrives. What should the designer do?', [
      'Start the new request at once to keep the client happy',
      'Raise the WIP limit to 3 for this week only',
      'Finish a current card before pulling the new one',
      'Move one current card back to Requests',
    ], 2, 'WIP limits make the team finish work before starting more, which keeps flow steady and exposes bottlenecks.'),
    q('A team has on average 12 items in progress and finishes 4 per week. Using Little\'s Law, what is the average cycle time?', [
      '2 weeks',
      '3 weeks',
      '4 weeks',
      '6 weeks',
    ], 1, 'Average cycle time equals average WIP divided by average throughput, so 12 / 4 = 3 weeks.'),
    q('What is JQL used for in Jira?', [
      'Searching and filtering work items precisely',
      'Drawing Gantt charts for the sponsor\'s monthly steering meeting',
      'Setting each team member\'s monthly salary',
      'Translating Jira screens into Urdu',
    ], 0, 'The Jira Query Language lets you build precise filters, such as open bugs in one project sorted by priority.'),
    q('Why give each criterion its own weight when scoring project tools?', [
      'So that cheaper tools always win the comparison',
      'So that every tool ends up with the same total',
      'So that the vendor\'s own ratings can be reused',
      'So the factors that matter most count for more',
    ], 3, 'Weights reflect what matters to your team, so an important criterion affects the total more than a minor one.'),
    q('A PM spends her week clearing a delayed laptop order and shielding the team from side requests. Which leadership style is this?', [
      'Command and control',
      'Servant leadership',
      'Laissez-faire',
      'Transactional leadership',
    ], 1, 'Servant leaders help the team succeed by removing obstacles and protecting focus rather than commanding.'),
    q('Two departments both need the only experienced designer next week, and there is time to find a solution that suits both. Which conflict mode fits best?', [
      'Competing, with the senior department head deciding',
      'Avoiding the issue until the week has passed',
      'Collaborating on a plan that works for both',
      'Accommodating whichever department asks loudest',
    ], 2, 'When an issue matters and time allows, collaborating looks for a solution that meets both sides\' real needs.'),
    q('A project\'s lessons learned are saved only on the PM\'s personal laptop. What is the problem?', [
      'The lessons are too detailed to be useful',
      'Lessons should be kept secret from the sponsor',
      'Nothing, as long as the PM remembers them',
      'Other teams cannot find or reuse them later',
    ], 3, 'Archiving lessons in a shared, well-named place lets future projects benefit from them.'),
    q('What must a PMP holder do to keep the certification active?', [
      'Retake the full PMP exam every year at an approved test centre',
      'Pass the PSM I assessment as well',
      'Work only on predictive projects',
      'Earn and report PDUs within each renewal cycle',
    ], 3, 'PMI certifications renew by earning professional development units in each cycle; check PMI\'s current requirements for the number.'),
  ],
});
