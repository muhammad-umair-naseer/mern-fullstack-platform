import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'ai-tools-for-everyone',
  title: 'AI Tools for Everyone',
  category: 'AI/ML',
  level: 'Beginner',
  duration: '4 weeks',
  accent: 'rose',
  coverKey: 'ai-tools-for-everyone',
  summary:
    'Use ChatGPT, Claude, Gemini and other AI tools confidently and safely for writing, research, studying, office work, images, business and everyday tasks, with no technical background needed.',
  description:
    'You start with what generative AI is, how chatbots work and how to choose the right tool without overspending. You learn prompting that gets useful results, then apply it to writing and communication, research with sources, learning faster, spreadsheets, meetings and presentations. You create images, audio and video responsibly, see how students, teachers, small businesses and freelancers use AI well, and automate simple tasks without programming. The course covers privacy, scams, deepfakes, bias and copyright, using AI in Urdu and Roman Urdu, and finishes with a personal AI workflow and the skills that matter in an AI-shaped job market.',
  chapters: [
    chapter(
      'Understanding AI Tools',
      'Learn what generative AI can and cannot do, how chatbots such as ChatGPT, Claude and Gemini produce their answers, how to pick the right tool for a task, and how to decide whether a paid plan is worth it.',
      [
      lesson('What Generative AI Is and Is Not', 12, `
In a few short years, AI tools went from research labs to phones in almost every pocket. Students use them to understand difficult topics, shopkeepers to write product descriptions, office workers to draft emails and summarise reports. To use them well, you first need a clear picture of what they are, and what they are not.

### Generative AI in one sentence

Generative AI creates new content, text, images, audio, video or code, based on patterns learned from enormous amounts of existing examples. You describe what you want in ordinary language, and the tool produces something that fits.

| You type | The AI produces |
|---|---|
| "Write a polite email asking my landlord to fix the water pump" | A ready-to-edit email |
| "Explain photosynthesis to a 12-year-old" | A simple explanation |
| "A watercolour painting of Badshahi Mosque at sunset" | An image |
| "Summarise this 20-page report in five bullet points" | A short summary |

### What it is good at

- **Drafting**: first versions of emails, posts, letters, reports.
- **Explaining**: breaking down difficult ideas at your level.
- **Summarising**: turning long text into key points.
- **Rewriting**: changing tone, length or language.
- **Brainstorming**: ideas for names, gifts, business plans, lesson activities.
- **Organising**: turning messy notes into structured lists and plans.

### What it is not

| Myth | Reality |
|---|---|
| "It knows everything." | It learned from data up to a point in time and can be out of date or simply wrong. |
| "It is always right." | It can state false information confidently. This is called hallucination. |
| "It understands like a person." | It predicts likely words; it has no life experience or real-world awareness. |
| "It remembers everything about me." | Memory depends on the tool and settings; many conversations are not remembered. |
| "It replaces thinking." | It works best as an assistant, with you checking and deciding. |

### A helpful mental model

Think of an AI tool as a very fast, well-read assistant who has never been to your city, does not know your family, sometimes misremembers facts, and never gets tired. You would happily ask such an assistant for a first draft or an explanation. You would not sign a legal document, take medicine or send money based only on what they said without checking.

### Why it matters for you

People who use AI tools well get more done: a report that took a day takes an hour, a difficult concept that took a week to understand takes an afternoon. This is true for students in Multan, freelancers in Lahore and shop owners in Hyderabad alike. The skill is not technical; it is knowing what to ask, how to ask it and how to check the answer. That is exactly what this course teaches.

### Using it responsibly

Throughout the course, three habits appear again and again: check important facts, protect private information, and be honest about when AI helped you. Practising them from the start makes AI a tool that improves your work rather than one that gets you into trouble.
      `,
        [
          q('What does generative AI do?', [
            'It only searches the internet and copies pages',
            'It creates new content based on patterns it learned',
            'It stores all your personal files',
            'It replaces your phone\'s operating system',
          ], 1, 'Generative AI produces new text, images and other content from learned patterns.'),
          q('What is an AI hallucination?', [
            'A confident answer that is actually false',
            'A picture the AI refuses to create',
            'A slow response from the server',
            'A reminder to take a break',
          ], 0, 'Chatbots can present incorrect information as if it were true, so important facts need checking.'),
          q('Which task should never rely on AI alone without checking?', [
            'Brainstorming names for a new shop',
            'Rewriting a message in a friendlier tone',
            'Deciding a medicine dose',
            'Turning notes into a to-do list',
          ], 2, 'High-stakes decisions such as health and money require expert or verified information.'),
        ]
      ),
      lesson('How Chatbots Like ChatGPT, Claude and Gemini Work', 13, `
You do not need to understand the mathematics to use AI chatbots well, but a basic idea of how they work explains their strengths and their mistakes. It also helps you write better requests and judge answers more wisely.

### The main chatbots

| Chatbot | Company | Notes |
|---|---|---|
| ChatGPT | OpenAI | Very widely used; text, images, voice and file analysis in many plans |
| Claude | Anthropic | Known for long documents, careful writing and analysis |
| Gemini | Google | Connected with Google services such as Gmail and Docs in some plans |
| Microsoft Copilot | Microsoft | Built into Windows, Edge and Microsoft 365 apps |
| Meta AI | Meta | Available inside WhatsApp, Instagram and Facebook in many regions |
| Others | Various companies | Including DeepSeek, Mistral's Le Chat and Perplexity for search |

Features, names and availability change often and differ by country, so check each tool's current website.

### Large language models

These chatbots are powered by large language models (LLMs). An LLM was trained on huge amounts of text, books, websites, articles and code, to predict what text is likely to come next. By doing this billions of times, it learned grammar, facts, reasoning patterns and styles of writing.

\`\`\`text
You:   "The capital of Pakistan is"
Model: predicts likely next words -> "Islamabad."
\`\`\`

When you ask a question, the model generates an answer word by word, each time choosing a likely continuation. That is why answers flow naturally, and also why they can sound confident while being wrong: the model produces what sounds right, not what it has verified.

### Training and fine-tuning

After the initial training, companies further train models to follow instructions, be helpful and avoid harmful content, often using feedback from human reviewers. This is why chatbots answer questions politely and sometimes decline requests.

### Knowledge cutoff and web search

A model's knowledge stops at the point its training data ends. It may not know about recent events, new prices or this year's rules. Many chatbots can now search the web and include sources, which helps with current information. When search is used, the answer is only as good as the pages found, so checking sources still matters.

### Context: what the chatbot "sees"

In a conversation, the chatbot considers your messages and its replies so far, plus any files you upload. This is called the context. It does not see your screen, your other apps or your past chats unless the tool has memory features switched on or you share them. If an answer ignores something, you may need to restate it.

### Why answers change

Ask the same question twice and you may get different wording, or even different answers. The model includes some randomness when choosing words, which makes writing more natural. For factual questions, differences between answers are a warning sign that you should check.

### Multimodal abilities

Modern tools often handle more than text: they can read photos of documents, describe images, listen to speech and create pictures. You might photograph a handwritten recipe and ask for a typed version, or upload an electricity bill and ask what each charge means.
      `,
        [
          q('What does a large language model fundamentally do?', [
            'Looks up every answer in a fixed database',
            'Copies whole websites into its replies',
            'Contacts human experts for each question',
            'Predicts likely text, one piece at a time',
          ], 3, 'LLMs generate answers by predicting likely next words, which is why they can sound confident yet be wrong.'),
          q('Why might a chatbot not know about last month\'s events?', [
            'It deletes news automatically',
            'Recent events are not allowed',
            'Its training data stops at a cutoff date',
            'It only reads books',
          ], 2, 'Knowledge ends where training data ends, unless the tool searches the web.'),
          q('What is the "context" in a chatbot conversation?', [
            'The messages and files the model can currently consider',
            'Your phone\'s location history',
            'Every conversation you have ever had',
            'The website you visited last',
          ], 0, 'The model works from the current conversation and shared files, not your whole digital life.'),
        ]
      ),
      lesson('Choosing the Right AI Tool for a Task', 12, `
There are now hundreds of AI tools, and new ones appear every week. Trying them all wastes time and money. A better approach is to start from what you need to do, then choose the simplest tool that does it well.

### Match tools to tasks

| Task | Good starting tools |
|---|---|
| Writing, explaining, brainstorming | A general chatbot such as ChatGPT, Claude or Gemini |
| Research with sources | Chatbots with web search, or search-focused tools such as Perplexity |
| Working inside Word, Excel, Gmail or Docs | Built-in assistants such as Microsoft Copilot or Gemini in Google Workspace |
| Creating images | Image features in chatbots, Canva's AI tools, Adobe Firefly, Midjourney |
| Designing social posts and flyers | Canva with AI features |
| Transcribing meetings or voice notes | Transcription features in meeting apps or dedicated tools |
| Editing short videos | CapCut and similar apps with AI features |
| Coding help | Chatbots, or coding assistants built into code editors |

For most people, one good general chatbot plus the AI features already inside apps they use covers most needs.

### Questions to ask before choosing

\`\`\`text
1. What exactly do I want to produce?
2. Does a tool I already use have this feature?
3. Does the tool work well in my language (English, Urdu, Roman Urdu)?
4. What happens to the data I put in?
5. Is it free, or is the paid plan worth it for my use?
6. Is it available in Pakistan, and can I pay for it if needed?
\`\`\`

### Try the same task in two tools

Different chatbots have different strengths. For an important task, such as a scholarship essay outline or a business plan, try the same request in two tools and compare. You will quickly learn which suits your style and needs. Many people keep two favourite tools and switch depending on the job.

### Beware of copycat apps

App stores contain many apps with names and icons that imitate well-known AI tools, often charging high subscriptions or collecting personal data. Download apps only from the official company, check the developer name carefully, and read reviews. The official websites link to their genuine apps.

### Specialised tools versus general chatbots

Specialised tools, for example for writing resumes or generating logos, often use the same underlying models as general chatbots, wrapped in a simpler interface. Sometimes they are genuinely better for their task; sometimes they are an expensive wrapper around what a general chatbot does for free. Try the general tool first.

### Keep a short list

Write down the three or four tools you actually use and what you use each for. Revisit the list every few months. This simple habit prevents "tool overload", where time is spent trying new apps instead of doing useful work with the good ones you already have.

### Availability and payment in Pakistan

Most major AI tools work in Pakistan, though some features may launch later than in other countries. Paid plans usually need an international debit or credit card; many Pakistani banks and digital banks offer cards that work for online subscriptions. Check your card's international and online payment settings before subscribing.
      `,
        [
          q('What is the best first step in choosing an AI tool?', [
            'Download every new AI app',
            'Start from the task you need to do',
            'Choose the most expensive tool',
            'Pick the app with the most colourful icon',
          ], 1, 'Matching the tool to a clear task avoids wasted time and money.'),
          q('How can you avoid copycat AI apps?', [
            'Choose apps with the lowest price',
            'Trust any app with "AI" in its name',
            'Share your password to test the app',
            'Download from the official company and check the developer name',
          ], 3, 'Imitation apps often charge high fees or misuse data, so verify the developer.'),
          q('Why try an important task in two different chatbots?', [
            'One chatbot will always be wrong',
            'To compare results and learn each tool\'s strengths',
            'Chatbots require it for accuracy',
            'It makes answers load faster',
          ], 1, 'Comparing outputs helps you choose the tool that best suits the task and your style.'),
        ]
      ),
      lesson('Free Versus Paid Plans and What You Actually Need', 13, `
Most AI tools offer a free plan and one or more paid plans. The marketing makes paid plans sound essential, but many people get excellent value from free versions. Understanding what paid plans typically add helps you spend only when it genuinely saves time or money.

### What free plans usually include

- Access to capable models, sometimes not the very latest or most powerful.
- A limit on the number of messages, images or file uploads per day or hour.
- Basic features such as text chat and simple image understanding.

For occasional use, such as a few emails a week or help with homework, free plans are often enough.

### What paid plans typically add

| Addition | Why it can matter |
|---|---|
| Higher usage limits | Heavy daily users stop hitting the limit mid-task |
| Access to the most capable models | Better results on complex reasoning, writing and analysis |
| Longer file and document handling | Analysing long reports, contracts or books |
| Advanced features | Deeper research modes, data analysis, more image or video generation |
| Priority access | Faster responses at busy times |
| Team and business features | Shared workspaces, admin controls, stronger data commitments |

Exact features and prices change frequently, so read the current plan pages rather than relying on older advice.

### A simple way to decide

\`\`\`text
Step 1: Use the free plan for two to four weeks on real tasks.
Step 2: Note how often you hit limits or wish results were better.
Step 3: Estimate time saved per week with a paid plan.
Step 4: Compare the monthly price with the value of that time.
\`\`\`

A freelancer who saves five hours a week drafting proposals and reports may find a paid plan an easy decision. A student asking a few questions a week probably does not need one.

### Avoid paying for several overlapping tools

A common mistake is subscribing to three chatbots and two writing apps that all do similar things. One paid general chatbot, used well, usually beats several subscriptions used a little. If you pay for one, choose the one that performs best on your most important tasks.

### Currency and costs in Pakistan

Paid plans are usually priced in US dollars, so the rupee cost changes with the exchange rate, and your bank may add fees for international payments. Check the final rupee charge on your statement and include it in your decision. Some tools offer regional pricing or annual discounts; compare before committing.

### Business and education plans

Organisations can buy business plans with admin controls and stronger commitments about how data is handled, which matters when employees use AI with company information. Some tools offer discounted or free access for students and teachers. If you are part of a university, school or company, ask whether a licensed plan is already available to you.

### Watch for automatic renewals

Subscriptions renew automatically. Set a calendar reminder before your renewal date and cancel any plan you no longer use. Small monthly charges add up, and forgotten subscriptions are one of the most common money leaks for people exploring AI tools.
      `,
        [
          q('For whom is a free plan often enough?', [
            'A team analysing long contracts all day',
            'Someone asking a few questions a week',
            'A company needing admin controls',
            'A freelancer drafting proposals daily',
          ], 1, 'Occasional users rarely reach limits that justify paying.'),
          q('What is a sensible way to decide on a paid plan?', [
            'Pay immediately for every plan to compare',
            'Choose the plan with the longest feature list',
            'Use the free plan on real tasks, then weigh time saved against cost',
            'Ask the app for a recommendation',
          ], 2, 'Real usage shows whether limits and quality justify the monthly price.'),
          q('Why check your bank statement after subscribing?', [
            'Banks refund all AI subscriptions',
            'The subscription stops if you do not',
            'Statements show the AI\'s answers',
            'Exchange rates and bank fees change the final rupee cost',
          ], 3, 'Dollar pricing plus international fees means the real cost can differ from the listed price.'),
        ]
      ),
      ],
      [
      q('Which is a good mental model for AI chatbots?', [
        'A fast, well-read assistant whose work you still check',
        'An expert who is never wrong',
        'A search engine that only copies text',
        'A replacement for all human decisions',
      ], 0, 'Treating AI as a capable assistant keeps you in charge of checking and deciding.'),
      q('Why can the same question give different answers?', [
        'The chatbot changes companies daily',
        'Your internet speed changes the answer',
        'Models include some randomness when choosing words',
        'Chatbots copy different websites each time',
      ], 2, 'Randomness makes writing natural, but differing factual answers signal a need to check.'),
      q('Where might you already have AI features without a new subscription?', [
        'Only in paid chatbots',
        'Only in research labs',
        'Nowhere, all AI requires new apps',
        'Inside apps you already use, like office and design tools',
      ], 3, 'Many everyday apps now include AI features, often reducing the need for extra tools.'),
      q('What is a common money leak when exploring AI tools?', [
        'Using the free plans of several tools',
        'Forgotten subscriptions that renew automatically',
        'Comparing two tools on the same task',
        'Reading each tool\'s plan pages carefully',
      ], 1, 'Automatic renewals add up quickly if unused plans are not cancelled.'),
      ]
    ),
    chapter(
      'Prompting That Works',
      'Write prompts with a clear task, context, format and constraints, give examples that guide the style, improve results through conversation rather than one-shot requests, and build a personal library of reusable prompt templates.',
      [
      lesson('The Anatomy of a Good Prompt', 13, `
A prompt is what you type into an AI tool. The same tool can give a vague, generic answer or a precise, useful one depending on how you ask. Good prompting is not a secret technique; it is simply clear communication, the same skill that helps you brief a colleague or a tailor.

### Weak versus strong prompts

\`\`\`text
Weak:   "Write about my shop."

Strong: "Write a 100-word Instagram caption for my bakery, Crumbs, in
         Gulshan-e-Iqbal, Karachi. We are launching chocolate fudge cake
         slices for Rs 350 this weekend. Tone: warm and fun. Include a
         call to action to order on WhatsApp and two relevant hashtags."
\`\`\`

The first prompt forces the AI to guess everything. The second tells it exactly what is needed.

### The building blocks

| Part | What it answers | Example |
|---|---|---|
| Task | What should the AI do? | "Write an email", "Summarise", "Explain" |
| Context | What background does it need? | Who you are, the situation, the audience |
| Details | What specifics must be included? | Dates, prices, names, key points |
| Format | What should the output look like? | Bullet points, table, 150 words, three options |
| Tone | How should it sound? | Formal, friendly, persuasive, simple |
| Constraints | What must it avoid or respect? | "No jargon", "Do not mention prices" |

You do not need every part every time, but the more important the task, the more of them you should include.

### Start with a clear verb

Begin with what you want done: write, explain, summarise, compare, list, rewrite, translate, suggest, check, plan. A clear verb removes ambiguity immediately.

### Say who the audience is

"Explain inflation" gives a generic answer. "Explain inflation to my father, who runs a grocery store and is not interested in economics theory, using examples from shop prices" gives an answer he will actually understand. Audience is one of the most powerful details you can add.

### Ask for a specific format

\`\`\`text
"Give me the answer as a table with three columns: option, cost, pros."
"Reply in five bullet points, each under 15 words."
"Write two versions: one formal, one friendly."
\`\`\`

Specifying format saves editing time and makes answers easier to use directly.

### Assign a role, sensibly

Starting with "You are an experienced HR manager" or "Act as a patient maths teacher" often shapes tone and focus. It does not give the AI real expertise, so still check important facts, but it helps produce answers in the right style.

### A reusable checklist

\`\`\`text
Before sending an important prompt, check:
[ ] Did I say exactly what I want done?
[ ] Did I give the context and audience?
[ ] Did I include the key facts it cannot guess?
[ ] Did I say what format and length I want?
[ ] Did I mention anything it must avoid?
\`\`\`

Ten seconds with this checklist often saves several rounds of fixing a poor answer.
      `,
        [
          q('Why does "Write about my shop" give weak results?', [
            'AI tools cannot write about shops',
            'The prompt is too long',
            'It gives no task details, audience or format',
            'Shops are not allowed as topics',
          ], 2, 'Without specifics, the AI must guess, producing generic output.'),
          q('Which detail most improves an explanation\'s usefulness?', [
            'Who the audience is',
            'The colour of your screen',
            'How fast you type',
            'The number of apps on your phone',
          ], 0, 'Knowing the audience lets the AI choose the right level, examples and tone.'),
          q('What does assigning a role, such as "patient maths teacher", do?', [
            'Gives the AI real teaching qualifications',
            'Guarantees every fact is correct',
            'Removes the need for checking',
            'Shapes the tone and focus of the answer',
          ], 3, 'Roles influence style and approach, but they do not add verified expertise.'),
        ]
      ),
      lesson('Giving Context, Examples and Constraints', 13, `
Context, examples and constraints are the three most effective ways to move from "good enough" answers to answers that fit exactly. They work because the AI cannot read your mind: everything it knows about your situation comes from what you tell it.

### Context: the background the AI needs

Imagine asking a new employee to "reply to this customer". They would ask: who is the customer, what happened, what is our policy? Give the AI the same information:

\`\`\`text
"I run an online clothing store. A customer ordered a kurta in size M,
received size L, and is upset because it was for her sister's mehndi
tomorrow. Our policy: free exchange, but delivery to Lahore takes 2 days.
Write a reply that apologises sincerely, explains the exchange, and offers
a 10% discount on her next order."
\`\`\`

The answer will be far more appropriate than a generic apology.

### Pasting information

You can paste text for the AI to work with: a report, an email thread, lecture notes, a job advertisement. Tell it what the text is and what to do with it:

\`\`\`text
"Below is a job advertisement. List the five most important skills it asks
for, then suggest how I can show each one in my CV, based on my
experience as a customer service officer at a bank.

[paste advertisement here]"
\`\`\`

Many tools also accept uploaded files such as PDFs, spreadsheets and images. Never paste passwords, bank details or other people's private information (chapter 10).

### Examples: show, do not only tell

If you want a particular style, show an example:

\`\`\`text
"Write three more product descriptions in the same style as this one:

'Handmade in Multan. Soft leather, gold tilla embroidery, and a cushioned
sole for long wedding nights. Pairs beautifully with any shalwar kameez.'

Products: 1) blue embroidered clutch, 2) silver jhumka earrings,
3) maroon velvet shawl."
\`\`\`

Examples communicate tone, length and structure far better than descriptions like "short and elegant".

### Constraints: what to avoid or respect

| Constraint | Example |
|---|---|
| Length | "Under 120 words" |
| Reading level | "Simple English suitable for a Grade 6 student" |
| Content limits | "Do not promise delivery dates" |
| Style limits | "Avoid emojis and exclamation marks" |
| Format rules | "Use Pakistani rupees and local city names" |
| Accuracy | "If you are not sure of a fact, say so instead of guessing" |

The last constraint is especially useful: asking the AI to admit uncertainty reduces confident-sounding mistakes.

### Too much or too little?

Too little context produces generic answers; too much irrelevant detail can distract. Include what a capable human helper would need, and leave out what they would not. If the answer misses the point, the usual cause is missing context.

### Put the most important instruction clearly

In long prompts, important instructions can get lost. State the main task at the start, add context, then repeat any critical requirement at the end: "Remember: under 120 words and no prices."
      `,
        [
          q('Why does context improve AI answers?', [
            'The AI only knows about your situation from what you tell it',
            'Context makes the AI respond faster',
            'AI tools refuse prompts without context',
            'Context unlocks paid features',
          ], 0, 'Everything situational must come from the prompt, just like briefing a new colleague.'),
          q('What is the benefit of including an example in your prompt?', [
            'It makes the answer longer',
            'It removes the need for any instructions',
            'It guarantees correct facts',
            'It shows the tone, length and structure you want',
          ], 3, 'Examples communicate style far more clearly than descriptive words.'),
          q('Which constraint helps reduce confident mistakes?', [
            '"Use as many emojis as possible"',
            '"If you are not sure of a fact, say so"',
            '"Answer in exactly 500 words"',
            '"Never use bullet points"',
          ], 1, 'Inviting the AI to admit uncertainty discourages invented details.'),
        ]
      ),
      lesson('Iterating: Conversations, Not One-Shot Requests', 12, `
Beginners often expect a perfect answer from the first prompt and give up when it disappoints. Experienced users treat AI as a conversation: they ask, review, then refine. The second and third messages are often where the best results appear.

### Refine instead of restarting

When an answer is close but not right, say what to change:

\`\`\`text
"Good start. Make it shorter, about half the length."
"Keep the second paragraph, but make the opening more friendly."
"Replace the example about cars with one about mobile phones."
"Too formal. Write it the way I would message my manager on WhatsApp."
\`\`\`

The AI keeps the earlier context, so small instructions produce targeted changes.

### Ask for options

\`\`\`text
"Give me five different subject lines for this email."
"Suggest three ways to open this speech: one funny, one emotional, one factual."
\`\`\`

Choosing from options is faster than describing exactly what you want. You can then say, "I like option 2; make it slightly shorter."

### Ask the AI to question you

For complex tasks, let the AI gather what it needs:

\`\`\`text
"I want to plan a small business selling homemade achar online. Before
giving advice, ask me the questions you need answered, one at a time."
\`\`\`

The questions it asks often reveal things you had not considered, such as packaging, food safety rules or delivery costs.

### Ask it to critique and improve

\`\`\`text
"Review my cover letter below. List its three biggest weaknesses, then
rewrite it fixing them."
"What might a sceptical investor object to in this plan?"
\`\`\`

AI tools are useful critics, catching gaps and unclear sentences you might miss in your own writing.

### Break big tasks into steps

Instead of "write my whole final-year project report", work step by step:

\`\`\`text
1. "Suggest an outline for a report on solar energy use in Pakistani homes."
2. "Expand section 2 into key points I should research."
3. "Here are my notes for section 2. Help me turn them into clear paragraphs."
4. "Check this section for unclear sentences."
\`\`\`

Each step is easier to check, and the result reflects your own research and thinking.

### Know when to start fresh

Very long conversations can drift: the AI may confuse earlier instructions or lose track of details. If answers become muddled, start a new chat with a clear summary of what you need. Many people keep separate chats for separate projects, such as one for a university assignment and another for a family business, so that details from one never leak into the other.

### Keep what works

When a sequence of prompts produces a great result, save it. The next lesson turns these into reusable templates.
      `,
        [
          q('An answer is close but too formal. What is the best next step?', [
            'Delete the chat and try another app',
            'Accept the answer as it is',
            'Ask for the same answer in a more casual tone',
            'Repeat the original prompt exactly',
          ], 2, 'Targeted follow-up instructions refine good drafts efficiently.'),
          q('Why ask the AI to question you before planning a business?', [
            'It makes the AI legally responsible',
            'AI tools cannot give advice otherwise',
            'It shortens the conversation',
            'Its questions reveal details you had not considered',
          ], 3, 'Letting the AI gather requirements surfaces important factors early.'),
          q('When should you start a new chat?', [
            'When a long conversation becomes muddled',
            'After every single message',
            'Only when the app crashes',
            'Never, one chat is best for everything',
          ], 0, 'Long chats can drift, so a fresh start with a clear summary restores focus.'),
        ]
      ),
      lesson('Prompt Templates for Everyday Tasks', 13, `
Many tasks repeat: weekly reports, customer replies, lesson plans, social media posts. Writing a good prompt from scratch each time wastes effort. A small library of templates, prompts with blanks to fill in, makes quality consistent and saves time every day.

### What a template looks like

\`\`\`text
TEMPLATE: Professional email
Write an email to [recipient and their role].
Purpose: [what I want them to do or know].
Key points: [points].
Tone: [polite / firm / friendly].
Length: under [number] words.
End with: [call to action or closing].
\`\`\`

Fill in the brackets, paste into the chatbot, and review.

### Templates for common tasks

\`\`\`text
SUMMARY
Summarise the text below for [audience]. Give [number] bullet points,
then one sentence on what action, if any, is needed.
[text]

EXPLAIN
Explain [topic] to [audience and their level]. Use one everyday example
from Pakistan. Then ask me two questions to check I understood.

COMPARE
Compare [option A] and [option B] for [my situation]. Use a table with
cost, benefits, risks and a recommendation. Say what information would
change the recommendation.

SOCIAL POST
Write [number] [platform] posts for [business] about [offer/topic].
Audience: [who]. Tone: [tone]. Include a call to action to [action].
Keep each under [number] words.

MEETING NOTES
Turn these rough meeting notes into: a short summary, decisions made,
and action items with owner and due date.
[notes]
\`\`\`

### Where to keep templates

| Option | Notes |
|---|---|
| A notes app or document | Simple and searchable |
| Your phone's text shortcuts | Quick for short templates |
| Custom instructions or saved prompts in the AI tool | Many tools let you save preferences or reusable prompts |
| Custom assistants | Some tools let you build a mini-assistant with fixed instructions (chapter 9) |

### Custom instructions

Many chatbots let you set standing instructions that apply to every chat, such as:

\`\`\`text
"I am a small business owner in Karachi. Use Pakistani rupees, local
examples and simple English. Keep answers concise unless I ask for detail."
\`\`\`

This saves repeating the same background in every prompt. Review these settings occasionally, and avoid including sensitive personal information.

### Improve templates over time

When a template produces a poor result, adjust it. When it produces a great one, note what worked. After a month, your library will reflect exactly how you like to work, and your results will be noticeably better than those of people who start from scratch each time.

### Share within a team

Teams benefit from shared templates: consistent customer replies, uniform report formats, agreed tone of voice. A shared document of approved templates is a simple, powerful way for a small business or office to use AI consistently and safely.
      `,
        [
          q('What is a prompt template?', [
            'A paid add-on for chatbots',
            'A reusable prompt with blanks to fill in',
            'A type of AI-generated image',
            'A setting that speeds up the internet',
          ], 1, 'Templates capture good prompt structure so it can be reused quickly.'),
          q('What do custom instructions in chatbots do?', [
            'Make every answer longer',
            'Share your chats publicly',
            'Remove all usage limits',
            'Apply standing preferences to every chat',
          ], 3, 'Saved background and preferences avoid repeating them in each prompt.'),
          q('Why share prompt templates within a team?', [
            'AI tools require shared templates',
            'Replies and reports stay consistent in quality and tone',
            'Templates are free only for teams',
            'It prevents anyone from editing outputs',
          ], 1, 'Shared templates standardise quality and voice across people.'),
        ]
      ),
      ],
      [
      q('What most improves the prompt "Write something about cake"?', [
        'Adding more exclamation marks to it',
        'Typing the prompt in capital letters',
        'Adding the offer, audience, format and tone',
        'Sending the same prompt three times',
      ], 2, 'Specific task, context, format and tone turn a vague request into a usable result.'),
      q('What should you do if an important instruction might get lost in a long prompt?', [
        'State it at the start and repeat it at the end',
        'Remove all other context',
        'Write the prompt in capital letters only',
        'Split it across several apps',
      ], 0, 'Placing critical requirements prominently, and repeating them, keeps them from being overlooked.'),
      q('What is the benefit of breaking a big report into steps with AI?', [
        'It makes the AI write everything for you',
        'It avoids any need for research',
        'Each step is easier to check and reflects your own thinking',
        'It hides the use of AI',
      ], 2, 'Step-by-step work keeps you in control and the output grounded in your research.'),
      q('How should prompt templates evolve?', [
        'They should never change once written',
        'They should be deleted monthly',
        'They should become as long as possible',
        'Adjust them when results are poor and note what works',
      ], 3, 'Continuous improvement makes templates fit how you work.'),
      ]
    ),
    chapter(
      'Writing and Communication',
      'Use AI to draft clear emails and professional messages, structure reports and proposals, edit tone and translate between English and Urdu, while keeping your writing authentic and in your own voice.',
      [
      lesson('Emails and Professional Messages', 13, `
Email and messaging take a large share of every working day. AI tools can turn a few rough notes into a clear, polite message in seconds, especially helpful for difficult messages or when writing in a second language. The key is giving the AI the facts and the tone, then checking the draft before sending.

### From notes to a finished email

\`\`\`text
Prompt:
"Write a polite email to my manager, Mr Tariq. I need leave on 14 and
15 March for my cousin's wedding in Faisalabad. My work on the monthly
report will be finished by 13 March, and Sana has agreed to cover
urgent client calls. Keep it under 120 words."
\`\`\`

A few seconds later you have a clear, well-structured request. Read it, adjust anything that does not sound like you, and send.

### Difficult messages

AI is especially useful when emotions or stakes are high:

| Situation | Helpful prompt addition |
|---|---|
| Complaint to a company | "Firm but polite; state the facts and what I want resolved" |
| Declining a request | "Warm, clear no, with a brief reason and an alternative" |
| Following up on unpaid invoices | "Professional reminder; mention the due date and payment details" |
| Apologising to a customer | "Sincere, takes responsibility, offers a specific fix" |
| Resignation letter | "Grateful, professional, notice period, offer to help handover" |

Writing these yourself when upset can come out harsher than intended. An AI draft gives you a calm starting point.

### Replying to long threads

Paste a long email thread and ask:

\`\`\`text
"Summarise what the client is asking for in this thread, then draft a
reply that answers each question clearly and confirms the next step."
\`\`\`

This helps you avoid missing a question buried in a long message.

### WhatsApp and short messages

Much professional communication in Pakistan happens on WhatsApp. AI can help keep business messages clear and appropriately short:

\`\`\`text
"Rewrite this as a short, polite WhatsApp message to a customer confirming
their order will be delivered tomorrow between 2 and 5 pm."
\`\`\`

### Check before sending

AI drafts can contain mistakes: wrong dates, invented details, or phrases that sound unnatural. Before sending:

\`\`\`text
[ ] Names, dates, amounts and places are correct
[ ] Nothing was added that I did not say
[ ] The tone matches the relationship
[ ] It sounds like something I would write
[ ] No private information is included unnecessarily
\`\`\`

Never send an AI draft unread. A wrong amount in an invoice reminder or an invented promise in a customer reply can cause real problems.

### Built-in email assistants

Email services increasingly include AI features that suggest replies, summarise threads or draft messages. These are convenient, but the same checks apply. For sensitive company information, follow your employer's rules about which AI tools may be used.

### Better communication, not just faster

Used well, AI helps you communicate more clearly than before: organised points, the right tone and no forgotten details. Over time, reading good drafts also improves your own writing, especially if English is your second or third language.
      `,
        [
          q('What should a prompt for a leave request email include?', [
            'Only the word "leave"',
            'Your bank account number',
            'A request for the AI to decide the dates',
            'The dates, reason, work arrangements and length limit',
          ], 3, 'Specific facts let the AI draft a complete, accurate request.'),
          q('Why is AI useful for difficult messages such as complaints?', [
            'It sends the message automatically',
            'It guarantees the company will agree',
            'It gives a calm, clear draft when emotions are high',
            'It removes the need to state facts',
          ], 2, 'A composed draft helps avoid messages that sound harsher than intended.'),
          q('What must you always do before sending an AI-drafted email?', [
            'Read it and check names, dates, amounts and tone',
            'Add more emojis',
            'Translate it into three languages',
            'Forward it to the AI company',
          ], 0, 'Drafts can contain errors or invented details, so a careful read is essential.'),
        ]
      ),
      lesson('Reports, Proposals and Documents', 13, `
Longer documents, reports, proposals, business plans, applications, take hours to structure and write. AI tools help most with the parts people find hardest: getting started, organising ideas and polishing the final text. The substance, your facts, findings and judgement, must still come from you.

### Start with an outline

A blank page is the hardest part. Ask for structure first:

\`\`\`text
"I need to write a proposal to my school's principal for starting a
weekend coding club for Grade 8 to 10 students. Suggest an outline
with section headings and what each section should cover."
\`\`\`

Review the outline, remove what does not fit, add what is missing, then write section by section.

### Turn your notes into prose

Write your own rough notes, then ask AI to shape them:

\`\`\`text
"Turn these notes into two clear paragraphs for the 'Budget' section.
Keep all numbers exactly as given.

Notes: laptops available in lab, 12; need internet upgrade Rs 8,000/month;
volunteer teachers 2; snacks optional; total monthly Rs 15,000 approx."
\`\`\`

The instruction to keep numbers exact matters: AI sometimes rounds or changes figures.

### Common document types

| Document | How AI helps |
|---|---|
| Business plan | Outline, market questions to research, clear wording |
| Project report | Structure, summary, readable explanations of findings |
| Grant or scholarship proposal | Aligning to the criteria, strengthening clarity |
| Standard operating procedure | Turning a process into numbered steps |
| Meeting minutes | Structuring notes into decisions and actions |
| Policy document | Clear headings and plain language |

### Executive summaries

Busy readers often read only the summary. After writing, ask:

\`\`\`text
"Write a 150-word executive summary of the report below for a manager
who has two minutes. Focus on the key finding and the decision needed."
\`\`\`

### Improve readability

\`\`\`text
"Rewrite this section in plainer English. Shorter sentences, no jargon,
and use headings and bullet points where helpful."
\`\`\`

Clear documents get read and acted on; dense ones get skimmed and ignored.

### Tables and structure

AI can turn messy information into tables, comparisons and checklists that make documents easier to scan, such as comparing three suppliers by price, delivery time and quality.

### Facts and figures are your responsibility

AI may invent statistics, quote non-existent studies or misstate rules. In any document others will rely on:

- Use numbers only from your own data or sources you have checked.
- Verify every statistic, date and legal or policy claim.
- Ask the AI to mark places where evidence is needed instead of inventing it: "Where a fact or number is needed, write [SOURCE NEEDED]."

### Formatting for the final tool

Ask AI to produce text ready for your destination: headings for Word, short slides for PowerPoint, or plain text for an online form. It saves reformatting time, though you should still review the final layout yourself.
      `,
        [
          q('What is the best first step when writing a long proposal with AI?', [
            'Ask it to write the whole proposal without details',
            'Copy a proposal from the internet',
            'Ask for an outline, then review and adjust it',
            'Start with the budget table',
          ], 2, 'An outline provides structure that you then refine and fill with your own content.'),
          q('Why instruct AI to keep numbers exactly as given?', [
            'Numbers slow down the AI',
            'AI sometimes rounds or changes figures',
            'Budgets cannot contain numbers',
            'It makes the text shorter',
          ], 1, 'Explicit instructions help protect exact figures, which must still be checked.'),
          q('How can AI avoid inventing statistics in a report?', [
            'By writing longer paragraphs',
            'By using more technical words',
            'By removing all headings',
            'By marking [SOURCE NEEDED] where evidence is required',
          ], 3, 'Placeholders prompt you to add verified facts instead of accepting invented ones.'),
        ]
      ),
      lesson('Editing, Tone and Translation', 12, `
Sometimes you have already written something and want it better: clearer, more polite, more persuasive or in another language. AI editing is quick and often excellent, especially for people writing in a second language, but it works best with specific instructions.

### Editing with clear goals

| Goal | Prompt |
|---|---|
| Fix mistakes only | "Correct grammar and spelling only. Do not change my wording otherwise." |
| Improve clarity | "Make this clearer and easier to read, keeping the meaning." |
| Shorten | "Cut this to about 100 words without losing key points." |
| Change tone | "Make this more polite and less direct." |
| Persuade | "Make this more convincing for a busy manager." |
| Explain changes | "Show what you changed and why." |

"Fix mistakes only" is important when you want your own voice preserved; otherwise AI tends to rewrite everything.

### Tone adjustments

Tone matters in Pakistani workplaces, where respect, formality and relationships carry weight. AI can adjust between:

\`\`\`text
Formal:     "I would be grateful if you could share the updated figures
             at your earliest convenience."
Neutral:    "Could you please share the updated figures when possible?"
Friendly:   "Hi! Could you send over the updated figures when you get a chance?"
\`\`\`

Tell the AI who the reader is and your relationship with them; it will choose suitable phrasing.

### Translation between English and Urdu

AI tools translate between English and Urdu reasonably well, and can also write Roman Urdu, which many people use in messages:

\`\`\`text
"Translate this notice into simple Urdu for parents of primary school
students. Keep it warm and respectful."

"Write this reminder in Roman Urdu for a WhatsApp group of shop staff."
\`\`\`

Quality is generally good for everyday text but weaker for poetry, idioms, legal language and specialised terms. For important documents, such as official notices, legal agreements or medical information, have a fluent person check the translation.

### Formal Urdu versus everyday Urdu

Ask for the style you need: formal Urdu for official letters, everyday Urdu for community announcements, Roman Urdu for chats. Without guidance, AI may choose an overly formal or unnatural style.

### Translating into other languages

AI can help communicate with clients abroad, for example translating a message into Arabic for a Gulf customer or into simple English for an international partner. Always tell the recipient's context and check key details, such as prices and dates, in the translated version.

### Proofreading your own writing

Paste your writing and ask:

\`\`\`text
"Point out unclear sentences, grammar mistakes and any places where a
reader might misunderstand. Do not rewrite; just list the issues."
\`\`\`

This keeps the writing yours while catching problems you might miss.

### Learning from edits

Ask the AI to explain its corrections. Over time you will notice patterns in your mistakes, such as tense errors or missing articles, and your own writing will improve, which matters in interviews, exams and anywhere AI is not available.
      `,
        [
          q('Which instruction best preserves your own wording while fixing errors?', [
            '"Correct grammar and spelling only; do not change my wording otherwise."',
            '"Make this better and more impressive overall."',
            '"Rewrite this completely in a new style."',
            '"Make it sound professional and polished."',
          ], 0, 'Limiting edits to corrections keeps your voice and phrasing.'),
          q('When should a fluent person check an AI translation into Urdu?', [
            'For a casual chat with friends',
            'For a grocery list',
            'For legal, medical or official documents',
            'Never, AI translations are perfect',
          ], 2, 'High-stakes translations need human verification, as specialised language is harder for AI.'),
          q('Why ask AI to explain its corrections?', [
            'It makes the text longer',
            'AI requires it for accuracy',
            'It hides the edits',
            'You learn your common mistakes and improve your own writing',
          ], 3, 'Understanding corrections builds your skills for situations without AI.'),
        ]
      ),
      lesson('Keeping Your Own Voice', 13, `
When everyone uses AI to write, much writing starts to sound the same: polished, generic and oddly formal. Readers notice. Messages and documents that sound like you, with your experience and personality, stand out and build trust. The goal is to use AI to write better, not to disappear behind it.

### Signs of generic AI writing

- Overused phrases, such as grand openings and empty praise.
- Long, balanced sentences with little specific detail.
- Lists of three everywhere and a summary repeating the obvious.
- Enthusiasm that does not match the situation.
- No personal examples, opinions or specifics.

A cover letter full of such phrases tells an employer little about you, and many recruiters now recognise the style quickly.

### Put yourself into the prompt

Give the AI your real details, experiences and opinions:

\`\`\`text
Generic:   "Write a cover letter for a marketing job."

Personal:  "Help me write a cover letter for a marketing assistant role at
            a Lahore food brand. Use these real details: I ran my college
            society's Instagram and grew it from 400 to 2,100 followers in
            one year; I made reels about campus food stalls; I love how
            food brands tell family stories. Keep my simple, direct style."
\`\`\`

The more of yourself you put in, the more the result sounds like you.

### Give a sample of your writing

\`\`\`text
"Here are two messages I wrote myself. Match this style when drafting
the reply below: short sentences, friendly, a little humour, no big words."
\`\`\`

The AI will imitate your natural style instead of its default.

### Edit the draft by hand

Treat the AI's output as a draft. Read it aloud, and change anything you would never say. Replace generic phrases with specific details. Delete filler. Add a line only you could write. Five minutes of personal editing transforms a generic draft into your message.

### Where your voice matters most

| Situation | Why authenticity matters |
|---|---|
| Job applications and personal statements | Employers and universities want to know you |
| Messages to family and friends | Personal warmth cannot be outsourced |
| Leadership messages to a team | Trust depends on sincerity |
| Creative writing | The value is your perspective |
| Condolences and congratulations | Generic words can feel cold |

For these, consider writing first yourself and using AI only to check spelling and clarity.

### Honesty about AI help

Some situations require disclosing AI use: many universities, publications and employers have rules. Even where not required, honesty builds trust. It is fine to use AI as a writing assistant; it is not fine to present AI-generated work as entirely your own where that matters. Chapter 7 covers academic rules and chapter 10 discusses disclosure more broadly.

### A balanced approach

\`\`\`text
You:  the ideas, facts, experiences, opinions and final judgement
AI:   structure, clarity, grammar, alternatives and speed
\`\`\`

Used this way, AI makes your writing clearer and faster while it remains unmistakably yours.
      `,
        [
          q('Which is a sign of generic AI writing?', [
            'Grand phrases with few specific details',
            'Personal examples and real numbers',
            'Short, direct sentences in your style',
            'Opinions you actually hold',
          ], 0, 'Polished but vague text lacking specifics is typical of unedited AI drafts.'),
          q('How can you make AI drafts sound more like you?', [
            'Ask for longer, more formal text',
            'Remove all details from the prompt',
            'Use a different chatbot each time',
            'Share a sample of your own writing to match',
          ], 3, 'Samples of your style guide the AI to imitate your voice.'),
          q('For which message is writing it yourself first most important?', [
            'A routine delivery confirmation',
            'A meeting reminder',
            'A condolence message to a colleague',
            'A list of office supplies',
          ], 2, 'Personal, emotional messages need sincerity that generic drafts cannot provide.'),
        ]
      ),
      ],
      [
      q('What is the right way to use an AI-drafted customer reply?', [
        'Send it immediately without reading',
        'Check facts, tone and promises, then send',
        'Forward it to the AI company for approval',
        'Add as many apologies as possible',
      ], 1, 'Drafts need checking because they can include errors or commitments you did not intend.'),
      q('What is the most important rule about facts in AI-assisted reports?', [
        'Trust any statistic the AI provides',
        'Remove all numbers from reports',
        'Verify every statistic, date and policy claim yourself',
        'Only use round numbers',
      ], 2, 'AI can invent figures and sources, so the author must check them.'),
      q('Which style should you request for a WhatsApp reminder to shop staff?', [
        'Formal legal Urdu with official terms',
        'Academic English with technical vocabulary',
        'Classical poetry in rhyming couplets',
        'Roman Urdu or simple everyday language',
      ], 3, 'Matching the style to the audience and medium makes messages natural and clear.'),
      q('What balance keeps writing authentic?', [
        'AI provides the ideas; you provide nothing',
        'You avoid AI entirely for all writing',
        'You provide ideas and judgement; AI helps with clarity and speed',
        'AI writes everything and you sign it',
      ], 2, 'Keeping your ideas and final judgement central while using AI for polish preserves your voice.'),
      ]
    ),
    chapter(
      'Research and Learning',
      'Use AI as a patient tutor to learn anything faster, research with sources you can verify, recognise and catch hallucinations before they cause harm, and summarise long documents, lectures and videos accurately.',
      [
      lesson('Using AI to Learn Anything Faster', 13, `
AI tools may be the most patient tutor you will ever have. They explain the same idea ten different ways without losing patience, answer "silly" questions without judgement, and adjust to your level instantly. Used well, they can make learning a new skill, subject or language dramatically faster.

### Ask for explanations at your level

\`\`\`text
"Explain compound interest like I am 15, using an example of saving
Rs 1,000 a month."

"I understand basic algebra. Explain what a derivative is, with a
real-life example, then give me two easy practice questions."
\`\`\`

If an explanation is too difficult, say so: "Simpler, please, and use an example from cricket." If it is too basic, ask for more depth. The AI adjusts immediately.

### Learning techniques that work with AI

| Technique | How to use AI |
|---|---|
| Analogies | "Explain how the internet works using an analogy of the postal system" |
| Step-by-step | "Walk me through solving this equation, one step at a time, and wait for me after each step" |
| Test yourself | "Ask me five questions on the causes of the First World War, one at a time, and correct my answers" |
| Teach back | "I will explain photosynthesis; point out anything I get wrong or miss" |
| Spaced review | "Make ten flashcards from these notes that I can review later" |
| Mistake analysis | "Here is my wrong answer. Explain what I misunderstood" |

Research on learning consistently shows that testing yourself and explaining ideas in your own words produce stronger memory than rereading. AI makes both easy.

### Learn a practical skill

Beyond school subjects, AI can guide practical learning:

\`\`\`text
"I want to learn Excel for office work in four weeks, 30 minutes a day.
Create a weekly plan with specific topics and small practice tasks."

"I am learning to cook daal chawal. What are the most common beginner
mistakes and how do I avoid them?"
\`\`\`

### Language learning

AI can be a conversation partner for learning English, Arabic, Chinese or any language:

\`\`\`text
"Let us practise English conversation. Pretend to be a hotel receptionist
in Dubai. Correct my grammar gently after each message."
\`\`\`

Voice features in many apps let you practise speaking and listening too.

### Keep your brain in the loop

The danger is letting AI do the thinking for you. If you ask for the answer to every problem, you learn nothing. Better habits:

- Ask for a hint before asking for the answer.
- Try the problem first, then ask the AI to check your working.
- After an explanation, close the chat and explain it to yourself from memory.
- Ask "why" questions, not only "what" questions.

### Check what you learn

AI explanations are usually good for well-established subjects, but they can contain errors, especially on specialised, recent or local topics. Cross-check important facts with textbooks, teachers or reliable websites, particularly before exams or when the knowledge will be used for real decisions.

### Build a learning routine

A short daily session, 20 to 30 minutes, with AI as a tutor and quiz master is more effective than occasional long sessions. Keep a notebook of what you learned and questions still open. Over months, this steady practice builds real skills, which remain yours even when no AI tool is at hand.
      `,
        [
          q('What should you do if an AI explanation is too difficult?', [
            'Give up on the topic',
            'Ask for a simpler version with an everyday example',
            'Switch to a different subject',
            'Copy it without understanding',
          ], 1, 'AI adjusts to your level instantly when you ask for simpler explanations or familiar examples.'),
          q('Which technique builds stronger memory than rereading?', [
            'Testing yourself and explaining ideas in your own words',
            'Reading the same notes many times',
            'Highlighting every line of the textbook',
            'Listening to explanations only',
          ], 0, 'Active recall and teaching back produce more durable learning than passive review.'),
          q('How can you avoid letting AI do all the thinking?', [
            'Ask for every answer immediately',
            'Avoid asking follow-up questions',
            'Try the problem first, then ask AI to check your working',
            'Only use AI during exams',
          ], 2, 'Attempting first and using AI for feedback keeps the learning in your own head.'),
        ]
      ),
      lesson('Research With Sources and Citations', 14, `
For research, whether for a university assignment, a business decision or buying a car, you need information you can trust and trace. Plain chatbot answers do not show where information came from. Research-focused AI features and careful habits turn AI into a powerful research assistant rather than an unreliable one.

### Chatbot knowledge versus web search

| Mode | How it answers | Reliability |
|---|---|---|
| Model knowledge only | From patterns learned in training | Can be outdated or invented; no sources |
| With web search | Searches the web, then answers with links | Better for current information; check the sources |
| Deep research modes | Runs many searches, reads pages, writes a report with citations | Thorough, slower; still needs checking |
| Your own documents | Answers from files you upload | Grounded in your sources; good for course readings |

Many chatbots now offer web search and deeper research features. Search-focused tools such as Perplexity are built around cited answers, and tools such as Google's NotebookLM answer questions using only the documents you provide.

### Ask for sources

\`\`\`text
"What are the current requirements for a Pakistani passport renewal?
Search the web and include links to official sources."
\`\`\`

Then open the links. Check that each source exists, is reliable, is current, and actually says what the AI claims. AI tools sometimes cite a real page but misstate its content.

### Prefer primary and official sources

| Question | Best source type |
|---|---|
| Tax rules | FBR's official website |
| Visa requirements | The embassy's official page |
| Medical information | Health authorities, qualified doctors |
| University admissions | The university's official prospectus |
| Scientific claims | Peer-reviewed studies, reputable institutions |
| Company information | The company's official site and filings |

Use AI to find and understand these sources, not to replace them.

### Research with your own documents

For assignments based on course readings, upload the readings and ask:

\`\`\`text
"Using only the three uploaded articles, what are the main arguments
for and against remote work? Cite which article each point comes from."
\`\`\`

Grounding the AI in specific documents reduces invented information and keeps your research tied to the required sources.

### Build a research workflow

\`\`\`text
1. Clarify the question: ask AI to help sharpen a vague topic
2. Explore: ask for key concepts, debates and search terms
3. Find sources: use search-enabled AI and library databases
4. Read the important sources yourself
5. Use AI to summarise and compare what you read
6. Write your own analysis, citing the original sources, not the AI
\`\`\`

### Citations in academic work

Cite the original sources you read, not the chatbot. Never copy references an AI gives you into a bibliography without checking them: AI tools have produced convincing references to articles that do not exist. If your institution requires disclosing AI assistance, follow its rules (chapter 7).

### Keep a research log

Note what you searched, which sources you used and what you concluded. It makes writing easier, helps you cite properly and shows your process if anyone asks how you reached your conclusions.
      `,
        [
          q('Why should you open the links an AI provides?', [
            'Links make the answer longer',
            'Opening links trains the AI',
            'Links are required to save the chat',
            'AI may misstate what a real page says',
          ], 3, 'Verifying that each source exists and supports the claim is essential.'),
          q('Which is the best source for current tax rules in Pakistan?', [
            'A random social media post',
            'A chatbot answer without sources',
            'FBR\'s official website',
            'An old newspaper article',
          ], 2, 'Official primary sources are authoritative and current for regulations.'),
          q('What should you cite in an academic assignment?', [
            'The original sources you actually read',
            'The chatbot as the source of all facts',
            'References suggested by AI without checking',
            'Nothing, if AI helped',
          ], 0, 'Academic citations must point to verified original sources, not to AI summaries.'),
        ]
      ),
      lesson('Checking Facts and Spotting Hallucinations', 13, `
AI tools can produce false information that sounds completely convincing: invented statistics, wrong dates, non-existent laws, fake quotes and references to books that were never written. This is called hallucination. It happens because models generate plausible text rather than looking up verified facts. Learning to spot and check it is essential for anyone who uses AI.

### Where hallucinations are most likely

| High risk | Why |
|---|---|
| Specific numbers and statistics | Plausible-sounding figures are easy to generate |
| Citations and references | Titles, authors and journals are invented convincingly |
| Recent events | Beyond the training data |
| Local and niche topics | Less training data about Pakistani rules, small towns, local businesses |
| Legal, medical and financial details | Complex, changing and jurisdiction-specific |
| Quotes attributed to people | Often paraphrased or invented |

Well-known facts and general explanations are usually more reliable, but still not guaranteed.

### Warning signs

- Very specific figures with no source ("exactly 37.4% of Pakistani students...").
- References you cannot find with a quick search.
- Different answers when you ask the same question again.
- Confident claims about recent events or local regulations.
- Answers that perfectly match what you hoped to hear.

### Checking techniques

\`\`\`text
1. Ask for sources, then open and read them.
2. Search the key claim yourself on a reliable site.
3. Ask the AI: "How confident are you? Which parts might be wrong?"
4. Ask a second AI tool and compare.
5. For numbers, find the original report or dataset.
6. For rules and laws, check the official government or institution website.
7. For health, law and money, consult a qualified professional.
\`\`\`

### Asking the AI to check itself

Prompts that reduce errors:

\`\`\`text
"If you do not know, say you do not know."
"Separate facts you are confident about from things I should verify."
"List any claims in your answer that I should double-check."
\`\`\`

These do not eliminate hallucinations, but they help surface uncertainty.

### Match checking to the stakes

| Stakes | Example | Checking needed |
|---|---|---|
| Low | Ideas for a birthday party | Little or none |
| Medium | A school presentation | Check key facts and numbers |
| High | A business decision, legal matter, health question | Verify everything with authoritative sources and experts |

Spending five minutes checking a fact that goes into a report for your manager is always worth it; spending an hour checking party ideas is not.

### A real risk

People have faced serious consequences from unchecked AI output: lawyers who submitted court documents citing cases that did not exist, students who submitted essays with invented references, and business reports built on fictional statistics. In each case, the person, not the AI, was held responsible.

### The habit

Treat AI answers as a helpful first draft of the truth, not the final word. The combination of AI's speed and your checking produces work that is both fast and reliable.
      `,
        [
          q('Why do AI tools hallucinate?', [
            'They are designed to mislead users',
            'They generate plausible text rather than looking up verified facts',
            'They only work offline',
            'They copy false websites on purpose',
          ], 1, 'Language models produce likely-sounding text, which can be false.'),
          q('Which claim deserves the most careful checking?', [
            'A list of ideas for a class party',
            'A friendly tone suggestion for a message',
            'Synonyms for the word "happy"',
            'A specific statistic for a business report',
          ], 3, 'Specific figures are a high hallucination risk and high stakes in reports.'),
          q('Who is responsible when unchecked AI output causes harm?', [
            'The person who used and submitted it',
            'Only the AI company',
            'Nobody',
            'The internet provider',
          ], 0, 'Users remain accountable for work they submit, regardless of AI assistance.'),
        ]
      ),
      lesson('Summarising Long Documents and Videos', 12, `
Much of modern work and study involves reading more than anyone has time for: long reports, contracts, lecture notes, policy documents, hour-long videos. AI summarisation saves enormous time, but only if you ask for the right kind of summary and verify the parts that matter.

### Uploading and pasting documents

Most chatbots accept pasted text and uploaded files such as PDFs, Word documents and spreadsheets, within size limits that vary by tool and plan. For very long documents, tools with larger capacities, or splitting the document into sections, work better.

### Ask for the summary you need

| Need | Prompt |
|---|---|
| Quick overview | "Summarise this in five bullet points" |
| Decision support | "What decisions or actions does this document require from me?" |
| Specific focus | "What does this contract say about termination and penalties?" |
| Audience-specific | "Summarise this policy for new employees in simple language" |
| Comparison | "Compare these two proposals on cost, timeline and risks" |
| Study | "Summarise this chapter, then give me ten revision questions" |

A targeted question usually beats a general "summarise this".

### Ask where information comes from

\`\`\`text
"For each point in your summary, give the page number or quote the
sentence it comes from."
\`\`\`

This lets you quickly check important points and catches cases where the summary drifts from the text.

### Videos and lectures

Some AI tools can summarise online videos from a link, and others can work from a transcript:

\`\`\`text
1. Get the transcript: many video platforms show one, or use a transcription tool
2. Paste or upload it
3. Ask: "Summarise the main arguments and list any practical steps mentioned"
\`\`\`

This is useful for long lectures, webinars and tutorials. Watch the key sections yourself when the details matter.

### Meeting recordings and notes

Summaries of meeting transcripts are covered in chapter 5; the same principle applies: check decisions and action items against what was actually agreed.

### Limits of summaries

- Summaries lose nuance: exceptions, conditions and caveats are often dropped.
- AI may overemphasise what appears early in a document and miss details buried later.
- Numbers and legal wording can be subtly misstated.

For contracts, legal notices, medical instructions and financial agreements, read the key sections yourself, and ask a professional where the stakes are high. A summary helps you know where to look; it does not replace reading what matters.

### Build a reading workflow

\`\`\`text
1. Ask for a short summary to decide whether the document is relevant
2. Ask targeted questions about the sections you need
3. Read those sections yourself
4. Ask for help understanding difficult parts
5. Note the key points in your own words
\`\`\`

This combines AI's speed with your understanding, and turns an overwhelming pile of reading into a manageable task.
      `,
        [
          q('Which prompt gets the most useful summary of a contract?', [
            '"Summarise this document for me, please."',
            '"What does this contract say about termination and penalties?"',
            '"Make this whole contract a lot shorter."',
            '"Tell me everything that is in this file."',
          ], 1, 'Targeted questions extract the details you actually need.'),
          q('Why ask for page numbers or quotes in a summary?', [
            'To make the summary longer',
            'Because AI requires them',
            'To hide errors',
            'To check key points quickly against the original text',
          ], 3, 'Traceable points make verifying the summary fast and reliable.'),
          q('What is a known limitation of AI summaries?', [
            'They always include every detail',
            'They cannot handle PDFs',
            'They often drop exceptions, conditions and caveats',
            'They only work in English',
          ], 2, 'Nuances can be lost, so important sections should be read in full.'),
        ]
      ),
      ],
      [
      q('What is a good way to use AI as a tutor for exams?', [
        'Ask it to quiz you and correct your answers',
        'Ask it to take the exam for you',
        'Only read its answers without practising',
        'Avoid asking questions you find hard',
      ], 0, 'Self-testing with feedback builds real understanding and memory.'),
      q('Which AI mode is most grounded in your required course readings?', [
        'Model knowledge only',
        'Random web search',
        'Answering from documents you upload',
        'Image generation',
      ], 2, 'Using your uploaded sources keeps answers tied to the required material.'),
      q('Which is a warning sign of a hallucination?', [
        'A general explanation of photosynthesis',
        'A suggestion to check official sources',
        'An answer that admits uncertainty',
        'A precise statistic with no source',
      ], 3, 'Very specific unsourced figures are a common form of invented information.'),
      q('How should you handle a summary of a legal notice?', [
        'Rely on the summary alone',
        'Use it to find key sections, then read them and seek advice if needed',
        'Ignore the notice entirely',
        'Ask the AI to reply on your behalf',
      ], 1, 'Summaries guide attention, but high-stakes documents need direct reading and expert help.'),
      ]
    ),
    chapter(
      'Productivity at Work',
      'Use AI with spreadsheets and data, turn meetings into notes and action items, build presentations faster, and plan tasks, projects and schedules so that everyday office work takes less time.',
      [
      lesson('AI in Spreadsheets and Data', 13, `
Spreadsheets run offices across Pakistan: sales records, attendance, stock lists, budgets, fee collections. Many people know only the basics of Excel or Google Sheets and spend hours on tasks that a formula or pivot table could do in seconds. AI tools bridge that gap, writing formulas, explaining them and even analysing data directly.

### Getting formulas written for you

Describe what you want in plain language:

\`\`\`text
"In Excel, column A has product names, column B has quantities and
column C has prices. Write a formula for column D that calculates the
total, and another that shows 'Reorder' if quantity is below 10."
\`\`\`

The AI replies with formulas such as \`=B2*C2\` and \`=IF(B2<10,"Reorder","")\`, and explains how to copy them down the column.

### Common tasks AI can help with

| Task | Example request |
|---|---|
| Lookups | "Find each employee's department from another sheet" (XLOOKUP or VLOOKUP) |
| Conditional totals | "Total sales for Lahore in March" (SUMIFS) |
| Cleaning data | "Split full names into first and last names" |
| Dates | "Calculate days between order date and delivery date" |
| Summaries | "Make a pivot table of sales by city and month" |
| Charts | "Which chart best shows monthly sales trends?" |
| Error fixing | "Why does my formula show #N/A?" |

### Understand what you use

Ask the AI to explain any formula before relying on it:

\`\`\`text
"Explain this formula step by step: =SUMIFS(D:D, B:B, "Lahore", C:C, ">=2025-03-01")"
\`\`\`

Understanding formulas lets you spot mistakes and adapt them later, and builds skills valued in every office job.

### Built-in AI in spreadsheet apps

Microsoft Excel with Copilot and Google Sheets with Gemini can, depending on your plan, suggest formulas, create charts and answer questions about the data inside the spreadsheet. Many chatbots can also analyse an uploaded spreadsheet: finding trends, calculating totals and producing charts.

\`\`\`text
"Here is our sales file for last quarter. Which three products grew the
most, which cities declined, and what patterns do you notice?"
\`\`\`

### Check the numbers

AI data analysis can make mistakes: misreading column meanings, miscounting rows, or confidently describing trends that are not there. Before using AI analysis in a report:

- Check a few calculations yourself.
- Confirm the AI understood each column correctly.
- Compare totals with figures you already know.
- Ask how it calculated each result.

### Protect sensitive data

Spreadsheets often contain salaries, customer phone numbers, CNIC numbers and bank details. Do not upload these to AI tools unless your organisation has approved the tool for such data. Remove or replace sensitive columns before sharing a file for analysis; the AI rarely needs personal details to find patterns.

### A practical skill boost

Even with AI, knowing core spreadsheet skills, sorting, filtering, basic formulas and pivot tables, makes you faster and more confident. Use AI to learn them as you go, and within weeks you will handle spreadsheet tasks that once required asking a colleague.
      `,
        [
          q('What should you do before relying on an AI-written formula?', [
            'Copy it into every sheet immediately',
            'Delete your original data',
            'Ask the AI to explain it step by step',
            'Change it to a different formula',
          ], 2, 'Understanding a formula lets you catch mistakes and adapt it later.'),
          q('What should you remove before uploading a spreadsheet for AI analysis?', [
            'Sensitive data such as CNIC numbers and salaries',
            'All column headings',
            'Every number in the file',
            'The sheet names',
          ], 0, 'Personal and confidential data should not be shared unless the tool is approved for it.'),
          q('How can you check AI data analysis before using it in a report?', [
            'Trust it because computers do not make mistakes',
            'Ask the AI to confirm it is correct',
            'Round all numbers to the nearest thousand',
            'Recalculate a few results and compare known totals',
          ], 3, 'Spot-checking catches misread columns and invented trends.'),
        ]
      ),
      lesson('Meetings, Notes and Action Items', 13, `
Meetings consume many working hours, and much of their value is lost when nobody records decisions clearly. AI tools can transcribe meetings, summarise discussions and extract action items, turning a rambling hour into a clear page of decisions and next steps.

### How meeting AI works

\`\`\`text
Recording or live transcription
  -> transcript (who said what)
  -> summary, decisions, action items, open questions
\`\`\`

Many meeting platforms, such as Microsoft Teams, Google Meet and Zoom, offer AI summaries and notes in some plans. Standalone transcription tools and mobile apps can record in-person meetings. You can also paste a transcript or rough notes into any chatbot.

### From rough notes to clear minutes

\`\`\`text
"Turn these rough notes into meeting minutes with: a three-line summary,
decisions made, action items (owner and deadline), and open questions.

Notes: discussed Eid stock, Ali says fabric delay 1 wk, decided to order
extra from Faisalabad supplier, Sana to call them tmrw, budget max
Rs 500k, need price list by Fri, next meeting Mon 11am"
\`\`\`

The result is a structured record everyone can follow.

### Consent comes first

Recording and transcribing people requires their knowledge and, in many workplaces, their agreement. Always:

- Tell participants that the meeting will be recorded or transcribed.
- Follow your organisation's rules on recording.
- Avoid recording confidential discussions with tools not approved for such content.

Many platforms announce recording automatically, but in-person meetings and phone calls need you to ask.

### Check the output

Transcription and summaries make mistakes:

| Problem | Example |
|---|---|
| Misheard names and terms | Urdu names, product codes and local places transcribed wrongly |
| Mixed languages | Conversations switching between Urdu and English are harder to transcribe |
| Misattributed statements | The summary says Ali agreed when Sana did |
| Missed nuance | "We might consider" recorded as a firm decision |

Review action items especially carefully; an incorrect owner or deadline causes confusion. The meeting organiser should confirm the summary before sharing it.

### Share and follow up

After the meeting:

\`\`\`text
"Draft a short follow-up email to all attendees with the decisions and
action items from these minutes. Friendly and clear."
\`\`\`

Sending clear action items the same day dramatically improves follow-through.

### Personal notes and voice memos

Beyond meetings, AI helps with personal notes: record a voice memo while driving or walking, transcribe it, and ask the AI to organise it into a to-do list or a draft email. Many phones and apps now transcribe voice notes automatically.

### Preparing for meetings

AI can also help before the meeting:

\`\`\`text
"I have a meeting with a supplier about late deliveries. Suggest an
agenda, key questions to ask and points I should prepare."
\`\`\`

Better preparation makes meetings shorter and more productive, reducing the need for follow-up meetings.
      `,
        [
          q('What must you do before recording a meeting for AI notes?', [
            'Nothing, recording is always allowed',
            'Inform participants and follow your organisation\'s rules',
            'Turn off everyone\'s microphones',
            'Record secretly to avoid disruption',
          ], 1, 'Consent and organisational rules must be respected when recording people.'),
          q('Which part of an AI meeting summary needs the most careful review?', [
            'The title of the meeting',
            'The date format',
            'The number of attendees',
            'Action items, owners and deadlines',
          ], 3, 'Errors in who does what by when cause real confusion, so they must be checked.'),
          q('Why are mixed Urdu and English conversations harder for transcription?', [
            'Switching languages confuses speech recognition',
            'Transcription tools only work at night',
            'Urdu cannot be recorded',
            'English words are always removed',
          ], 0, 'Code-switching and local names reduce transcription accuracy, requiring careful review.'),
        ]
      ),
      lesson('Presentations and Visual Documents', 12, `
Creating a presentation often takes hours: deciding the story, writing slides, finding images and formatting everything neatly. AI tools can produce a first draft of the structure and content in minutes, leaving you to focus on the message and the delivery.

### Start with the story, not the slides

Ask for structure first:

\`\`\`text
"I am presenting to my company's managers about reducing delivery delays
in our Lahore warehouse. Suggest a 10-slide outline: the problem, causes,
data, three solutions, costs, and recommendation."
\`\`\`

A clear story makes a presentation persuasive. Refine the outline until the flow makes sense, then build slides.

### Tools that build slides

| Tool type | Examples |
|---|---|
| Built into office apps | Copilot in PowerPoint, Gemini in Google Slides (depending on plan) |
| Design platforms | Canva with AI features |
| Dedicated AI presentation tools | Tools that generate decks from a prompt or document |
| General chatbots | Write slide text you paste into your own template |

Tools that generate full decks are fast, but results can look generic. Many people get better results by using AI for content and a company template for design.

### Writing slide content

\`\`\`text
"Turn this section of my report into three slides. Each slide: a short
headline stating the key point, and no more than four bullet points of
under 10 words each."
\`\`\`

Slides crowded with text lose audiences. Asking for short headlines that state the message, rather than topic labels, makes slides clearer.

### Speaker notes and practice

\`\`\`text
"Write speaker notes for these slides, about 1 minute per slide, in a
confident but conversational tone."

"Ask me five tough questions the managers might ask after this presentation."
\`\`\`

Practising answers to likely questions is one of the best uses of AI before an important presentation.

### Visuals and charts

AI can suggest the best chart for your data, create simple diagrams and generate illustrative images (chapter 6). For data charts, create them from your real data in Excel or Sheets rather than asking an image generator to draw them, since generated images can show incorrect numbers.

### Other visual documents

The same approach works for:

- Posters and flyers for events.
- Infographics summarising a process.
- Reports with clear headings and tables.
- Social media carousels.

Canva's AI features, for example, can generate layouts, write text and resize designs for different platforms.

### Keep it accurate and your own

Check every number, name and claim on generated slides. Remove generic filler slides. Add your own examples, photos from real projects and insights only you have. Audiences remember presenters who speak from experience, not slides that sound like everyone else's.

### Time saved, used well

If AI saves two hours of formatting, spend part of that time rehearsing. A well-rehearsed talk with simple slides beats a beautiful deck presented nervously.
      `,
        [
          q('What is the best starting point for an AI-assisted presentation?', [
            'An outline of the story and key messages',
            'Choosing the fanciest slide design',
            'Generating fifty images first',
            'Writing every word the speaker will say',
          ], 0, 'A clear structure makes the presentation persuasive before design begins.'),
          q('Why build data charts from real data rather than image generators?', [
            'Image generators cannot draw shapes',
            'Charts from spreadsheets are always colourful',
            'Generated images can show incorrect numbers',
            'Spreadsheets are required by law',
          ], 2, 'Charts must reflect actual data, which image generators do not guarantee.'),
          q('How can AI help you prepare for audience questions?', [
            'By answering questions during the presentation for you',
            'By suggesting tough questions you can practise answering',
            'By hiding difficult slides',
            'By shortening the presentation to one slide',
          ], 1, 'Practising likely questions builds confidence and better answers.'),
        ]
      ),
      lesson('Planning Tasks, Projects and Schedules', 13, `
Busy people juggle work tasks, studies, family responsibilities and personal goals. AI tools can help turn overwhelming lists into clear plans, break big projects into steps and create realistic schedules. They will not do the work, but they make starting and organising much easier.

### From chaos to a plan

Dump everything on your mind into a prompt:

\`\`\`text
"Here is everything I need to do this week. Organise it by priority,
estimate time for each, and suggest a daily plan. I work 9 to 5 and
have two hours each evening.

- finish sales report (due Thursday)
- prepare for driving test Saturday
- buy gifts for sister's wedding
- reply to 3 client emails
- gym 3 times
- pay electricity bill before due date"
\`\`\`

Adjust the plan to your reality; AI does not know about traffic, family visits or load-shedding unless you tell it.

### Breaking down big projects

\`\`\`text
"I want to launch a home-based tiffin service in Rawalpindi within
six weeks. Break this into weekly milestones and specific tasks,
including permissions, menu, pricing, packaging and marketing."
\`\`\`

Big goals become manageable when broken into small, concrete steps. Ask follow-up questions on any step you do not understand.

### Prioritising

When everything feels urgent, ask the AI to apply a simple framework:

| Framework | How it works |
|---|---|
| Urgent and important matrix | Sort tasks into do now, schedule, delegate, drop |
| Biggest impact first | Rank tasks by how much they move your main goal |
| Deadlines first | Order by due date, with buffers |

\`\`\`text
"Sort these tasks into an urgent/important matrix and explain why."
\`\`\`

### Schedules and routines

AI can create study timetables, workout routines, weekly meal plans and shift schedules:

\`\`\`text
"Create a 6-week study timetable for my matriculation board exams:
subjects are maths, physics, chemistry, biology, English and Urdu.
I can study 3 hours on weekdays and 6 hours on weekends. Include
revision weeks and rest time."
\`\`\`

Build in breaks and realistic buffers. Plans that assume perfect productivity collapse within days.

### Connecting to your tools

Some AI assistants integrate with calendars, email and task apps, depending on the tool and plan, and can create events or reminders directly. Even without integrations, you can copy AI-generated plans into your calendar or task app. The plan only helps if it lives somewhere you will see it daily.

### Weekly review

A short weekly review keeps plans useful:

\`\`\`text
"Here is what I planned last week and what I actually finished.
What should I carry over, what should I drop, and how should I
plan next week more realistically?"
\`\`\`

This reflection, with AI as a thinking partner, steadily improves how you plan.

### Keep it human

Plans are tools, not rules. Life in Pakistan brings unexpected events: family obligations, power cuts, traffic, sudden guests. Leave slack, adjust without guilt, and use AI to replan quickly when things change.
      `,
        [
          q('Why should you adjust an AI-generated weekly plan?', [
            'AI plans are always perfect',
            'Plans must be changed daily by rule',
            'AI requires edits before saving',
            'AI does not know your real constraints unless told',
          ], 3, 'Traffic, family events and power cuts affect plans in ways the AI cannot know.'),
          q('What helps most with an overwhelming big project?', [
            'Waiting until you feel motivated',
            'Breaking it into weekly milestones and concrete tasks',
            'Doing everything on one day',
            'Avoiding planning altogether',
          ], 1, 'Small, specific steps make large goals achievable.'),
          q('Why build breaks and buffers into study timetables?', [
            'AI tools require breaks',
            'Breaks make timetables look longer',
            'Plans assuming perfect productivity quickly collapse',
            'Exams are always postponed',
          ], 2, 'Realistic buffers keep plans sustainable when things take longer than expected.'),
        ]
      ),
      ],
      [
      q('Which spreadsheet task can AI help with by writing a SUMIFS formula?', [
        'Changing the font colour',
        'Totalling sales for one city in one month',
        'Printing the sheet',
        'Renaming the file',
      ], 1, 'SUMIFS adds values meeting several conditions, a common AI-assisted formula.'),
      q('What is the first responsibility when using AI meeting notes?', [
        'Getting participants\' awareness and agreement for recording',
        'Choosing the most expensive tool',
        'Sharing the transcript publicly',
        'Deleting the notes immediately',
      ], 0, 'Recording people requires their knowledge and adherence to organisational rules.'),
      q('How should AI-generated slides be improved before presenting?', [
        'Add more text to every slide',
        'Use every generated image',
        'Remove your own examples',
        'Check facts and add your own examples and insights',
      ], 3, 'Accurate, personal content makes presentations credible and memorable.'),
      q('Why include a weekly review in an AI-assisted planning routine?', [
        'To make plans longer each week',
        'AI tools stop working without reviews',
        'Reflecting on what actually happened improves future plans',
        'Reviews replace doing the tasks',
      ], 2, 'Comparing plans with results makes future planning more realistic.'),
      ]
    ),
    chapter(
      'Images, Audio and Video',
      'Create images from text descriptions, edit photos and designs with AI features, use transcription, voice and text-to-speech tools, and understand what AI video tools can do, always with honesty about AI-generated media.',
      [
      lesson('Creating Images With AI', 13, `
Image generators create pictures from text descriptions. A few words can produce an illustration for a presentation, a concept for a logo, a background for a social media post or artwork for a children's story. The results can be impressive, but good images still depend on clear descriptions and responsible use.

### The tools

| Tool | Notes |
|---|---|
| Image features in chatbots | ChatGPT, Gemini and others can generate and edit images in conversation |
| Canva's AI features | Generates images inside a design tool, convenient for social posts |
| Adobe Firefly | Integrated with Adobe apps; Adobe states it is trained on licensed content |
| Midjourney | Known for artistic, high-quality results |
| Others | Ideogram, which is known for handling text in images, and many more |

Features, quality and terms change quickly, so check current capabilities and usage rules before relying on any tool.

### Describing what you want

Good image prompts describe:

| Element | Example |
|---|---|
| Subject | A young woman working on a laptop |
| Setting | In a bright café in Islamabad |
| Style | Flat vector illustration / realistic photo / watercolour |
| Composition | Wide shot, subject on the left, space for text on the right |
| Mood and lighting | Warm, morning light, cheerful |
| Colours | Brand colours of teal and orange |

\`\`\`text
"A flat vector illustration of a young woman working on a laptop in a
bright café, warm morning light, teal and orange colour palette, simple
background with empty space on the right for text."
\`\`\`

### Iterating on images

Rarely is the first image perfect. Refine:

\`\`\`text
"Same image, but make her wear a dupatta and add a cup of chai on the table."
"Make the style simpler, suitable for a mobile app icon."
\`\`\`

### Where AI images work well

- Illustrations for presentations and blog posts.
- Social media backgrounds and concept visuals.
- Mood boards and design ideas before hiring a designer.
- Children's story illustrations for personal use.
- Placeholder images while real photos are arranged.

### Where to be careful

| Situation | Concern |
|---|---|
| Product photos for selling | Generated images misrepresent the real product; customers must see what they will receive |
| Images of real people | Creating realistic images of real people can mislead, defame or violate their rights |
| Logos and trademarks | Generated logos may resemble existing brands; check before using commercially |
| News and events | Realistic generated "photos" of events spread misinformation |
| Text inside images | Many generators still misspell words; check carefully |

### Label realistic AI images

When a realistic image is AI-generated and could be mistaken for a real photograph, say so. Many platforms, including major social networks and video sites, have rules requiring disclosure of realistic synthetic media. Honesty protects your credibility and your audience.

### Commercial use

If you use AI images for business, read the tool's terms about commercial use and ownership, which vary. Chapter 10 covers copyright questions in more detail. For important brand assets like logos, many businesses use AI for ideas and then work with a designer on the final version.
      `,
        [
          q('Which element should a good image prompt include?', [
            'Only a single word',
            'Your phone number',
            'The price of the tool',
            'Subject, setting, style and mood',
          ], 3, 'Detailed descriptions guide the generator towards the image you want.'),
          q('Why avoid AI-generated product photos for items you sell?', [
            'Customers must see what they will actually receive',
            'AI images are always too small',
            'Product photos cannot be generated',
            'Selling platforms reject all images',
          ], 0, 'Generated images can misrepresent products, misleading customers.'),
          q('When should you label an image as AI-generated?', [
            'Never, labels reduce engagement',
            'Only for cartoons',
            'Only when printing posters',
            'When a realistic image could be mistaken for a real photo',
          ], 3, 'Disclosure prevents audiences being misled by realistic synthetic images.'),
        ]
      ),
      lesson('Editing Photos and Designs', 12, `
Beyond creating images from scratch, AI makes photo editing that once required professional skills available to anyone. Removing backgrounds, erasing unwanted objects, extending images and improving quality now take seconds in apps many people already use.

### Common AI editing features

| Feature | What it does | Typical use |
|---|---|---|
| Background removal | Cuts the subject out cleanly | Product photos on white, profile pictures |
| Object removal | Erases unwanted items or people | Removing a bin from a shop photo |
| Generative fill or expand | Adds or extends parts of an image | Widening a photo to fit a banner |
| Enhancement and upscaling | Improves sharpness and resolution | Old or low-quality photos |
| Relighting and colour correction | Adjusts light and colour | Photos taken in poor light |
| Style changes | Applies artistic styles | Social media creativity |

These features appear in apps such as Canva, Adobe Photoshop and Express, phone gallery apps from Google and Samsung, and many mobile editors.

### Product photos done right

For small businesses selling online, AI editing is extremely useful:

\`\`\`text
1. Photograph the real product in good light
2. Remove the background
3. Place it on a clean white or branded background
4. Adjust brightness and colour to match the real product
5. Resize for each platform
\`\`\`

The product itself stays real; only the presentation improves. This keeps listings honest while looking professional.

### Design with AI help

Design tools with AI can:

- Suggest layouts for posters, flyers and posts.
- Resize one design for Instagram, Facebook and WhatsApp status.
- Write headline and caption options.
- Apply consistent brand colours and fonts.

For a small business without a designer, this makes consistent, professional-looking marketing achievable.

### Restoring old photos

AI can repair scratches, improve faces and add colour to old black-and-white family photos. It is a meaningful way to preserve family history, but remember that restoration involves the AI guessing details; colours and features may not be exactly as they were.

### Where editing crosses a line

| Acceptable | Problematic |
|---|---|
| Removing background clutter | Removing product defects to hide them from buyers |
| Improving lighting | Changing someone's body or face in ways that mislead |
| Correcting colours to match reality | Altering documents, ID cards or evidence |
| Combining images creatively with disclosure | Creating fake images of people in places they never were |

Editing official documents, such as certificates or bills, is fraud, whatever tool is used.

### Respect people in photos

Get permission before editing and posting photos of other people, especially children and women in conservative family contexts. Heavy editing of someone's appearance without their agreement can cause real hurt and conflict.

### Keep originals

Always keep the original photo. If an edit goes wrong, or you need proof of what the original looked like, you can return to it. Non-destructive editing, where apps keep the original separately, makes this automatic.
      `,
        [
          q('What keeps AI-edited product photos honest?', [
            'Improving presentation while the product itself stays real',
            'Removing every defect from the product',
            'Using a different product that looks better',
            'Generating the product from a text description',
          ], 0, 'Cleaner backgrounds and lighting are fine; changing the product misleads buyers.'),
          q('Which edit is fraud regardless of the tool used?', [
            'Removing a bin from a shop photo',
            'Brightening a dark photo',
            'Altering a certificate or bill',
            'Resizing an image for Instagram',
          ], 2, 'Changing official documents is forgery, whatever software is used.'),
          q('Why keep the original photo after editing?', [
            'Originals improve AI quality',
            'Apps require it by law',
            'Originals are smaller',
            'You can return to it if an edit goes wrong',
          ], 3, 'Keeping originals protects against mistakes and preserves proof of the real image.'),
        ]
      ),
      lesson('Voice, Transcription and Text to Speech', 13, `
Speech is one of the most natural ways to communicate, and AI has made working with it remarkably easy. Tools can turn speech into text, read text aloud in natural voices and even hold spoken conversations. These features help with note-taking, accessibility, content creation and learning languages.

### Speech to text: transcription

| Use | Example |
|---|---|
| Voice notes | Speak ideas while walking; get text to edit later |
| Interviews and lectures | Transcribe recordings for study or articles |
| Meetings | Notes and summaries (chapter 5) |
| Subtitles | Captions for videos, improving reach and accessibility |
| Dictation | Write messages and documents by speaking |

Modern transcription is highly accurate for clear English and increasingly good for Urdu, though accuracy drops with background noise, strong accents, multiple people speaking at once and frequent switching between languages. Review transcripts before relying on them.

### Voice conversations with AI

Many chatbot apps offer voice mode: you speak, and the AI replies aloud. This is useful for:

- Practising spoken English for interviews or IELTS preparation.
- Hands-free help while cooking or driving (safely).
- People who find typing difficult.
- Quickly brainstorming ideas by talking them through.

### Text to speech

Text-to-speech tools read text aloud in natural-sounding voices:

\`\`\`text
Uses:
- Listening to articles or study notes while commuting
- Voiceovers for simple videos and presentations
- Accessibility for people with visual impairments or reading difficulties
- Announcements and audio guides
\`\`\`

Quality varies by language; English voices are often very natural, while Urdu voices are improving. Test before using for public content.

### Voice cloning: powerful and risky

Some tools can clone a voice from a short sample, producing speech that sounds like a specific person. Legitimate uses exist, such as a person creating their own voiceovers or restoring a voice lost to illness. The risks are serious:

- Scammers clone voices of family members to request urgent money transfers.
- Fake audio of public figures spreads misinformation.
- People's voices are used without consent.

Only clone your own voice, or a voice with the owner's explicit permission, and never to deceive. Chapter 10 explains how to protect yourself and your family from voice scams.

### Podcasts and audio content

AI can help plan podcast episodes, write scripts, remove background noise, generate show notes and create transcripts that make episodes searchable. Tools that turn documents into audio discussions, such as some study tools, offer a new way to review material.

### Accessibility

Voice tools are transformative for accessibility: people with visual impairments can have text read aloud; people with hearing impairments benefit from live captions; people with motor difficulties can dictate instead of typing. Adding captions and transcripts to your own content makes it usable by more people.

### Privacy with voice

Voice recordings can reveal identity, location and private conversations. Check where recordings are stored, whether they are used to improve the tool, and delete recordings you no longer need.
      `,
        [
          q('What reduces transcription accuracy?', [
            'Clear speech in a quiet room',
            'Background noise and frequent language switching',
            'Speaking slowly and clearly',
            'Using a good microphone',
          ], 1, 'Noise, overlapping speakers and code-switching make transcription harder.'),
          q('When is voice cloning acceptable?', [
            'Cloning your own voice or with explicit permission, never to deceive',
            'Cloning a relative\'s voice to surprise them with a request for money',
            'Cloning a celebrity\'s voice for an advert without asking',
            'Cloning any voice found online',
          ], 0, 'Consent and honest use are essential; unauthorised cloning enables scams and misuse.'),
          q('How do captions and transcripts help your content?', [
            'They make videos shorter',
            'They replace the need for audio',
            'They hide your voice',
            'They make content accessible to more people',
          ], 3, 'Captions help people with hearing impairments and those watching without sound.'),
        ]
      ),
      lesson('AI Video Tools', 12, `
Video is the most popular content format online, and AI now assists at every stage: generating clips from text, editing footage automatically, adding captions, translating speech and creating presenter avatars. The tools are developing rapidly, and so are the questions about their responsible use.

### What AI video tools do

| Capability | Examples of use |
|---|---|
| Text to video | Short clips generated from a description |
| Image to video | Animating a still image |
| Automatic editing | Cutting pauses, selecting highlights, reframing for vertical video |
| Auto captions | Subtitles generated from speech |
| AI avatars | A digital presenter speaking a script |
| Dubbing and translation | Speech translated into another language, sometimes matching lip movement |
| Background and object changes | Replacing backgrounds, removing objects |

Tools include video generators from major AI companies, editing apps such as CapCut with AI features, and specialised avatar and dubbing platforms. Availability, quality and pricing vary widely and change quickly.

### Practical uses

- **Small businesses**: short product videos with captions, quick promotional clips.
- **Educators**: explainer videos, translated lessons.
- **Creators**: faster editing, captions and reframing for Reels, TikTok and Shorts.
- **Offices**: training videos from scripts without filming.

### Where AI video helps most

For most people, the biggest time savings come from AI-assisted editing of real footage, such as automatic captions, removing silences and reframing, rather than fully generated video. Real footage of your real product, shop or team builds more trust than generated scenes.

### Limits of generated video

Generated clips can look impressive but often show inconsistencies: hands, text, physics and faces that change between frames. They are best for short, abstract or illustrative content, not for showing real products, places or events.

### Serious risks: deepfakes

The same technology can create realistic videos of real people saying or doing things they never did. Deepfakes have been used for scams, political misinformation, harassment and fake celebrity endorsements of investment schemes.

\`\`\`text
Never:
- Create realistic videos of real people without their consent
- Present generated footage as real events
- Use a person's likeness to promote products they did not endorse
\`\`\`

### Platform rules and disclosure

Major platforms increasingly require creators to disclose realistic AI-generated or altered content, and some label it automatically. Follow each platform's current rules. Clear labelling protects your audience and your account.

### Consent for avatars and dubbing

Creating an avatar of yourself, with your permission, is legitimate. Creating one of an employee, teacher or anyone else requires their informed consent, including how and where it will be used. Dubbing someone's speech into another language also needs their agreement.

### Getting started sensibly

Start with AI features in editing apps you already use: automatic captions and simple edits bring immediate benefits. Experiment with generation tools for creative, clearly fictional or illustrative content, and keep real people and real events out of generated video unless you have consent and disclose it.
      `,
        [
          q('Where do most people gain the most time with AI video?', [
            'Generating every scene from text',
            'AI-assisted editing of real footage, like captions and cutting pauses',
            'Creating avatars of celebrities',
            'Faking events for social media',
          ], 1, 'Editing assistance on genuine footage delivers practical savings and keeps content trustworthy.'),
          q('What is a deepfake?', [
            'A blurry video',
            'A video with captions',
            'A realistic fake video of a real person',
            'A video longer than one hour',
          ], 2, 'Deepfakes show real people saying or doing things they never did.'),
          q('What is required before creating an AI avatar of a colleague?', [
            'Nothing, if it is for work',
            'Only your manager\'s approval',
            'The colleague\'s informed consent',
            'A paid subscription',
          ], 2, 'Using someone\'s likeness requires their clear agreement on how it will be used.'),
        ]
      ),
      ],
      [
      q('What makes AI image prompts produce better results?', [
        'Using one word only',
        'Asking the tool to choose everything',
        'Repeating the same prompt without changes',
        'Describing subject, style, composition and mood, then refining',
      ], 3, 'Detailed descriptions and iteration steer the generator effectively.'),
      q('Which AI photo edit is appropriate for an online shop?', [
        'Hiding scratches on a used phone',
        'Removing a cluttered background from a real product photo',
        'Generating a product you do not stock',
        'Editing the price on a supplier\'s invoice',
      ], 1, 'Improving presentation of the real product is honest; hiding defects or faking items is not.'),
      q('What is the biggest risk of voice cloning technology?', [
        'Scams that imitate family members asking for money',
        'Voices sounding too clear',
        'Recordings taking up storage',
        'Podcasts becoming longer',
      ], 0, 'Cloned voices are used to deceive people into urgent money transfers.'),
      q('What should creators do with realistic AI-generated video?', [
        'Present it as real footage',
        'Remove any disclosure labels',
        'Disclose it according to platform rules',
        'Use real people\'s faces without asking',
      ], 2, 'Disclosure protects audiences and complies with platform requirements.'),
      ]
    ),
    chapter(
      'AI for Students and Teachers',
      'Study with AI in ways that build real understanding rather than shortcuts, prepare for exams with practice questions and feedback, help teachers plan lessons and materials, and follow academic integrity rules and school policies.',
      [
      lesson('Studying With AI Without Cheating', 13, `
For students, AI can be the best study partner imaginable or a shortcut that quietly destroys learning. The difference lies in how it is used. Asking AI to do your homework produces an answer but no understanding; asking it to help you understand produces both, and only understanding helps in exams, interviews and careers.

### Helpful uses versus harmful uses

| Helpful | Harmful |
|---|---|
| "Explain this concept I did not understand in class" | "Write my assignment" |
| "Give me a hint for this problem, not the answer" | "Solve all these homework questions" |
| "Check my solution and show where I went wrong" | "Rewrite this essay so it cannot be detected" |
| "Quiz me on this chapter" | "Answer these quiz questions for me" |
| "Suggest how to structure my essay" | Submitting AI text as your own work |

The helpful column builds skills; the harmful column builds dependence and, often, violates school rules.

### A study session with AI

\`\`\`text
1. Read the chapter or attend the lecture first.
2. List what you did not understand.
3. Ask AI to explain those points, simpler if needed.
4. Explain each idea back in your own words; ask AI to correct you.
5. Try practice questions yourself.
6. Ask AI to check your answers and explain mistakes.
7. Write short notes in your own words.
\`\`\`

This process uses AI where it adds most: explanations and feedback, while the thinking stays yours.

### Hints, not answers

When stuck on a problem, ask for the smallest helpful push:

\`\`\`text
"Do not give me the answer. Give me one hint about the first step."
"What concept should I use to solve this?"
"Is my approach on the right track?"
\`\`\`

Struggling a little before getting help is how learning sticks. Jumping straight to the answer skips the part that builds skill.

### Understanding over memorising

In Pakistan's exam-focused system, many students memorise answers without understanding them. AI can break this pattern by explaining the reasons behind facts and formulas: why a chemical reaction happens, why a historical event mattered, why a formula works. Understanding makes memorising easier and lasts longer.

### When AI is wrong

AI can make mistakes in subjects like mathematics, physics and local history, especially with multi-step calculations or curriculum-specific details. If an explanation contradicts your textbook or teacher, check with them. Board exams mark answers against the syllabus, not against a chatbot.

### Protect your future self

Every skill AI does for you is a skill you do not develop. Writing, problem-solving and critical thinking are exactly the abilities employers and universities test, often without AI available. Using AI to strengthen these abilities, rather than replace them, is the smartest long-term choice a student can make.

### Honesty with teachers

If you used AI to help understand material or brainstorm, and your institution allows it, say so when asked. Teachers generally respond well to honesty about helpful use, and badly to discovering hidden use. The next lessons and the final lesson of this chapter cover school rules in detail.
      `,
        [
          q('Which is a helpful way for a student to use AI?', [
            'Asking it to write the whole assignment',
            'Asking it to explain a concept not understood in class',
            'Asking it to answer a quiz during the test',
            'Asking it to make copied text undetectable',
          ], 1, 'Explanations build understanding, while outsourcing work removes learning and may break rules.'),
          q('Why ask for a hint rather than the full answer?', [
            'Struggling a little before help makes learning stick',
            'Hints are faster to generate',
            'AI cannot give full answers',
            'Teachers require hints',
          ], 0, 'Working through difficulty with minimal help builds lasting skill.'),
          q('What should you do if AI contradicts your textbook?', [
            'Always trust the AI',
            'Ignore both sources',
            'Check with your teacher or textbook',
            'Ask a different AI and pick the answer you prefer',
          ], 2, 'Exams follow the syllabus, and AI can be wrong on curriculum details.'),
        ]
      ),
      lesson('Exam Preparation and Practice Questions', 13, `
Exam preparation is where AI can make one of the biggest positive differences for students: generating unlimited practice questions, explaining mistakes instantly and building revision plans. Used consistently, it turns passive reading into active practice, the method research shows works best.

### Practice questions on demand

\`\`\`text
"Create 10 multiple-choice questions on Newton's laws for Grade 10
physics, with four options each. Do not show the answers until I reply."

"Give me three past-paper-style long questions on the causes of the
War of Independence 1857, for matric level."
\`\`\`

You can request questions at different difficulty levels, in the format of your board or university, and in English or Urdu.

### Feedback on your answers

Write your answer first, then ask for feedback:

\`\`\`text
"Here is my answer to this 8-mark question. Mark it as a strict
examiner would, explain what would lose marks, and show how to
improve it."
\`\`\`

This is especially useful for essays and long answers, where knowing what examiners look for is half the battle. Remember that AI marking is an estimate; your teacher's guidance on your board's marking scheme matters more.

### Flashcards and quick review

\`\`\`text
"Turn these biology notes into 20 flashcards: question on one side,
short answer on the other."
\`\`\`

Review flashcards regularly with spaced repetition: more often for cards you get wrong, less often for cards you know. Many flashcard apps support this and can import AI-generated cards.

### Revision timetables

\`\`\`text
"My board exams start on 1 April. Subjects: maths, physics, chemistry,
biology, English, Urdu, Islamiat. I am weakest in chemistry and English.
Create a revision plan from today with more time for weak subjects,
weekly mock tests and rest days."
\`\`\`

### Explaining mistakes

The most valuable moment in exam practice is understanding a wrong answer:

\`\`\`text
"I chose option B but the answer is D. Explain why D is correct and
what misunderstanding led me to choose B."
\`\`\`

Keeping a notebook of mistakes and their explanations, then reviewing it before the exam, is one of the most effective revision techniques.

### Mock exam conditions

Use AI to create a full mock paper, then take it under real conditions: timed, no notes, no AI. Afterwards, use AI to check and explain. Practising without help is essential, because the exam will not offer any.

### Accuracy of generated questions

AI-generated questions and answer keys sometimes contain errors, especially in calculations and syllabus-specific facts. If an answer key looks wrong, verify it with your textbook or teacher. Also check that questions match your syllabus; AI may include topics not in your course.

### Balance and wellbeing

Exam season is stressful. AI can help you plan realistic study schedules with breaks, suggest ways to manage anxiety and keep motivation. For serious stress or anxiety, talk to family, teachers or a counsellor; AI is not a substitute for real support.
      `,
        [
          q('What is the best way to get AI feedback on a long answer?', [
            'Write your answer first, then ask for examiner-style feedback',
            'Ask AI to write the answer and memorise it',
            'Skip writing and only read model answers',
            'Ask AI for the marks only',
          ], 0, 'Attempting first and then getting feedback develops exam-writing skill.'),
          q('Why take mock exams without notes or AI?', [
            'AI cannot create mock exams',
            'Notes make mock exams too easy to mark',
            'It saves electricity',
            'The real exam offers no help, so practice must match it',
          ], 3, 'Practising under real conditions builds the independence the exam requires.'),
          q('What should you do if an AI answer key looks wrong?', [
            'Assume your own answer is wrong',
            'Verify it with your textbook or teacher',
            'Skip that topic entirely',
            'Ask the AI to confirm and accept its reply',
          ], 1, 'Generated keys can contain errors, especially in calculations.'),
        ]
      ),
      lesson('Lesson Plans and Materials for Teachers', 12, `
Teachers in Pakistan often manage large classes, limited resources and heavy administrative work. AI tools can save hours each week on planning and preparing materials, leaving more time and energy for what matters most: teaching students directly.

### Lesson planning

\`\`\`text
"Create a 40-minute lesson plan for Grade 6 science on the water cycle.
Class of 45 students, no projector. Include learning objectives, a
starter activity, explanation, group activity using local examples,
and a 5-minute check for understanding."
\`\`\`

Including class size and resource limits makes plans realistic rather than suited only to well-equipped schools.

### Differentiated materials

Classes include students at very different levels. AI can adapt the same content:

| Need | Prompt |
|---|---|
| Struggling readers | "Rewrite this passage at a simpler reading level" |
| Advanced students | "Create three challenge questions that extend this topic" |
| Urdu-medium learners | "Explain this science concept in simple Urdu" |
| Visual learners | "Suggest a diagram students can draw to understand this" |

### Worksheets and assessments

\`\`\`text
"Make a worksheet on fractions for Grade 4: 5 simple, 5 medium and
2 word problems using Pakistani contexts like buying fruit or sharing
roti. Include an answer key."
\`\`\`

Always check answer keys and content accuracy before printing; AI makes calculation and fact errors.

### Rubrics and feedback

AI can draft marking rubrics and help write feedback comments:

\`\`\`text
"Create a simple rubric for a Grade 8 persuasive essay with four
criteria and three levels each."
\`\`\`

For feedback on individual work, avoid uploading students' personal information. Use AI to help phrase constructive comments, while your judgement decides the assessment.

### Activities and engagement

- Quiz games and riddles for revision.
- Role plays for history and social studies.
- Real-life problems for mathematics.
- Discussion questions for literature.
- Short stories illustrating moral lessons.

Ask for activities suited to your classroom's space and resources.

### Administrative tasks

Emails to parents, notices, reports, meeting agendas and event plans take significant time. AI drafts save much of it:

\`\`\`text
"Write a polite notice in Urdu and English informing parents about
the parent-teacher meeting on Saturday at 10 am, requesting attendance."
\`\`\`

### Keep the teacher in charge

AI does not know your students, your school's culture or your curriculum's exact requirements. Review every plan and material, adapt it to your class, and check alignment with your board's syllabus. The best results come from combining AI's speed with a teacher's knowledge of the children in front of them.

### Learning together

Teachers who explore AI themselves are better placed to guide students in using it well. Sharing effective prompts and honest discussions about AI's strengths and weaknesses helps students build good habits.
      `,
        [
          q('Why include class size and resources in a lesson plan prompt?', [
            'AI tools require these fields',
            'It makes the plan longer',
            'It reduces the number of activities',
            'Plans become realistic for your actual classroom',
          ], 3, 'Realistic constraints produce lessons that work in real conditions.'),
          q('What must teachers do before printing an AI-made worksheet?', [
            'Check the content and answer key for errors',
            'Add more questions',
            'Remove all local examples',
            'Translate it into several languages',
          ], 0, 'AI can make calculation and fact errors, so materials need review.'),
          q('What should teachers avoid when using AI for feedback?', [
            'Asking for help phrasing constructive comments',
            'Creating rubrics',
            'Using simple language',
            'Uploading students\' personal information',
          ], 3, 'Protecting student privacy means keeping personal details out of AI tools.'),
        ]
      ),
      lesson('Academic Integrity and School Policies', 13, `
Schools, colleges and universities are still deciding how AI should be used in education. Rules differ widely: one course may ban AI entirely, another may encourage it with disclosure. Understanding and following the rules protects students from serious consequences and teaches honesty that matters beyond education.

### Why integrity rules exist

Assessments exist to measure what a student knows and can do. If AI does the work, the grade measures the AI, not the student. Degrees and certificates only have value if they reliably reflect real ability. Integrity rules protect that value for everyone, including honest students.

### Common policy approaches

| Approach | What it means |
|---|---|
| Prohibited | No AI use for the assessment |
| Limited | AI allowed for specific tasks, such as brainstorming or grammar checks |
| Allowed with disclosure | AI allowed, but you must state how you used it |
| Encouraged | AI use is part of the assignment |

Policies can differ between institutions, departments, courses and even individual assignments. When unclear, ask your teacher before starting, not after submitting.

### Consequences of misuse

Submitting AI-generated work where it is not allowed can be treated like plagiarism, with consequences ranging from a zero mark to failing a course, suspension or cancellation of a degree. In Pakistan, universities and boards take plagiarism seriously, and many use tools to check submitted work.

### Detection tools are imperfect

Some institutions use AI-detection software. These tools can produce false positives, flagging human writing as AI-generated, especially for students writing in a second language. If you write your own work, keep evidence of your process: drafts, notes and version history in your documents. This protects you if your work is questioned.

### Disclosing AI use

Where disclosure is required or expected, be specific:

\`\`\`text
"I used ChatGPT to brainstorm possible essay structures and to check my
grammar. All arguments, research and writing are my own."
\`\`\`

Clear disclosure shows honesty and helps teachers understand your process.

### Research and theses

For research projects and theses, AI raises additional issues:

- Never include fabricated references or data generated by AI.
- Do not upload unpublished research, confidential data or participants' information to AI tools.
- Follow your supervisor's and university's guidance on permitted AI use.
- Your analysis and conclusions must be your own intellectual work.

Higher education bodies and universities have been developing guidance on AI in academic work; check the current policies of your institution.

### For teachers: setting clear rules

Teachers can reduce confusion by stating clearly, for each assignment, what AI use is allowed and how to disclose it. Designing assessments that value process, such as drafts, oral explanations, in-class writing and reflections, makes learning visible and reduces the temptation to outsource work.

### Integrity beyond the classroom

The habit of honesty about how work was produced continues into professional life. Employers increasingly have AI policies, clients may ask how work was created, and trust depends on transparency. Students who learn to use AI openly and responsibly are well prepared for that world.
      `,
        [
          q('What should you do if an assignment\'s AI policy is unclear?', [
            'Ask your teacher before starting the work',
            'Assume AI is allowed',
            'Assume AI is banned and say nothing',
            'Ask other students and follow the majority',
          ], 0, 'Clarifying rules in advance prevents accidental violations.'),
          q('Why keep drafts and notes of your own writing?', [
            'Teachers require every draft to be printed',
            'Drafts improve AI detection accuracy',
            'Notes are needed to use AI tools',
            'They prove your process if detection tools wrongly flag your work',
          ], 3, 'Evidence of your writing process protects against false positives.'),
          q('What must never appear in a thesis?', [
            'Your own analysis',
            'Properly cited sources',
            'AI-fabricated references or data',
            'A clear methodology section',
          ], 2, 'Fabricated references and data are research misconduct, with serious consequences.'),
        ]
      ),
      ],
      [
      q('Which study habit makes the best use of AI?', [
        'Copying AI answers into notebooks',
        'Asking AI to do all homework',
        'Avoiding practice questions',
        'Using AI for explanations and feedback while doing the thinking yourself',
      ], 3, 'Keeping the thinking yours while using AI for support builds real skills.'),
      q('What is the most valuable use of AI after a wrong practice answer?', [
        'Changing the answer key',
        'Understanding why the correct answer is right and what you misunderstood',
        'Skipping to the next question',
        'Asking for more difficult questions immediately',
      ], 1, 'Learning from mistakes is the core of effective exam preparation.'),
      q('What keeps AI-generated teaching materials effective?', [
        'The teacher reviews and adapts them to the class and syllabus',
        'Printing them without changes',
        'Using only international examples',
        'Letting students choose the content',
      ], 0, 'Teachers\' knowledge of their students and syllabus turns drafts into good materials.'),
      q('What is a sound approach to disclosing AI use?', [
        'Never mention it',
        'Say "AI helped" with no detail',
        'State specifically how AI was used and what is your own work',
        'Disclose only if caught',
      ], 2, 'Specific, honest disclosure builds trust and meets many institutional requirements.'),
      ]
    ),
    chapter(
      'AI for Small Businesses and Freelancers',
      'Create marketing content and social media posts faster, handle customer messages with consistent quality, write product descriptions that sell honestly, and use AI to deliver freelance work faster without losing quality or trust.',
      [
      lesson('Marketing Content and Social Media', 13, `
Small businesses in Pakistan, from boutiques in Lahore to bakeries in Karachi and tailoring shops in Peshawar, rely heavily on social media to reach customers. Producing regular, attractive content takes time most owners do not have. AI tools make consistent marketing achievable for businesses without a marketing team.

### A content plan in minutes

\`\`\`text
"I run a women's clothing boutique in Lahore selling lawn suits and
formal wear. Create a 4-week Instagram and Facebook content plan with
3 posts per week: mix of new arrivals, styling tips, customer stories
and offers. Eid is in week 3."
\`\`\`

The plan gives a structure; you fill it with real photos and details.

### Writing posts and captions

\`\`\`text
"Write three caption options for a post showing our new lawn collection.
Mention prices from Rs 4,500, free delivery in Lahore, and order through
WhatsApp. Friendly tone, one or two relevant hashtags, under 80 words.
One version in Roman Urdu."
\`\`\`

Asking for options and a Roman Urdu version helps match how your customers actually talk.

### Types of content AI helps with

| Content | Example |
|---|---|
| Captions and posts | New arrivals, offers, announcements |
| Reel and video scripts | 30-second product showcases, behind-the-scenes |
| Stories and polls | Engaging questions for customers |
| Festive campaigns | Eid, Independence Day, wedding season |
| Email and WhatsApp broadcasts | Offers to existing customers |
| Blog posts | Guides such as "How to choose fabric for summer" |

### Keep it real

Customers trust real photos, real prices and real voices. Use AI for words and ideas, but show your actual products, shop and team. Avoid exaggerated claims such as "best in Pakistan" or "100% guaranteed" unless you can support them; misleading advertising damages trust and may break consumer protection rules.

### Consistency matters more than perfection

Posting regularly, three times a week for months, usually beats occasional perfect posts. AI makes consistency realistic: in one hour a week, you can prepare all the posts for the coming week.

### Understanding your audience

\`\`\`text
"My customers are mostly working women aged 25 to 40 in Lahore who shop
on their phones in the evening. What kind of content would they find
useful and engaging? Suggest ten post ideas."
\`\`\`

AI can suggest ideas, but real feedback from customers, likes, comments, messages and sales, tells you what works. Track which posts bring enquiries and ask AI to help you create more like them.

### Advertising copy

For paid ads on social media, AI can write multiple headline and text variations to test:

\`\`\`text
"Write five short ad headlines for our Eid formal wear collection,
each under 40 characters, focusing on different benefits: price,
quality, delivery speed, exclusivity, customisation."
\`\`\`

Testing several versions and keeping the best performers is a proven way to improve ad results.

### Brand voice

Define your brand voice once and include it in prompts or custom instructions: "Warm, elegant, simple English with occasional Urdu phrases, never pushy." Consistent voice makes a small business look professional and memorable.
      `,
        [
          q('What should AI content never replace in small business marketing?', [
            'Caption writing',
            'Post ideas',
            'Real photos of your actual products',
            'Hashtag suggestions',
          ], 2, 'Customers trust real products and faces; AI should help with words and ideas.'),
          q('Why ask for a Roman Urdu version of a caption?', [
            'It matches how many customers actually write and read online',
            'Roman Urdu is required on Instagram',
            'English captions are not allowed',
            'It makes posts load faster',
          ], 0, 'Speaking your customers\' language increases engagement and trust.'),
          q('What tells you which content really works?', [
            'The AI\'s opinion of each post',
            'The number of hashtags used',
            'How long the caption is',
            'Customer responses such as comments, enquiries and sales',
          ], 3, 'Real audience behaviour is the measure of content success.'),
        ]
      ),
      lesson('Customer Service and Replies', 13, `
Customers message businesses at all hours through WhatsApp, Instagram, Facebook and email, asking about prices, delivery, sizes, returns and complaints. Fast, polite and consistent replies win sales and loyalty. AI helps small businesses reply well without spending the whole day on messages.

### Templates for common questions

Most questions repeat. Create a set of approved replies with AI's help:

\`\`\`text
"Create polite, short reply templates for my online bakery for:
1) delivery areas and charges, 2) how to place a custom cake order,
3) payment methods (cash on delivery, JazzCash, EasyPaisa, bank transfer),
4) order cancellation policy, 5) a customer asking about sugar-free options.
Provide English and Roman Urdu versions."
\`\`\`

Save these as quick replies in WhatsApp Business or your messaging tool. Personalise each one with the customer's name and details before sending.

### Handling complaints

Complaints need care. Paste the complaint and give the facts:

\`\`\`text
"A customer says her birthday cake arrived 2 hours late and the design
was damaged. It was our rider's fault. Write a sincere apology offering
a full refund or a free cake next time, and asking which she prefers."
\`\`\`

A thoughtful reply can turn an angry customer into a loyal one. Never let AI invent facts, promise things you cannot deliver, or blame the customer.

### Chatbots for businesses

Some businesses use AI chatbots on their website or messaging accounts to answer common questions automatically. If you consider this:

| Consider | Why |
|---|---|
| Accuracy | The bot must only give correct information about prices and policies |
| Hand-off | Customers must be able to reach a human easily |
| Tone | The bot should match your brand's voice |
| Disclosure | Customers should know they are talking to an automated assistant |
| Monitoring | Review conversations regularly to catch mistakes |

An automated reply that gives a wrong price or refuses a reasonable request can cost sales and reputation. Start with templates and human replies; automate gradually and carefully.

### Understanding customer messages

AI can help analyse many messages or reviews at once:

\`\`\`text
"Here are 50 customer reviews from our Google page. Summarise the main
praises and complaints, and suggest three improvements."
\`\`\`

This turns scattered feedback into clear priorities for improving your business.

### Language and tone

Customers write in English, Urdu, Roman Urdu and mixtures of all three. AI can help you understand messages and reply in the customer's style. Match their formality: a customer writing formally deserves a formal reply; a friendly customer can receive a warm, casual response.

### Privacy

Customer messages contain names, phone numbers and addresses. Avoid pasting full customer details into AI tools; remove personal information and keep only what is needed to draft the reply.

### Response time matters

Many customers choose the business that replies first. With templates ready and AI helping draft unusual replies, even a one-person business can respond within minutes during business hours, a real competitive advantage.
      `,
        [
          q('What should you do before sending an AI reply template to a customer?', [
            'Send it unchanged to save time',
            'Personalise it with the customer\'s name and details',
            'Remove the greeting',
            'Translate it into three languages',
          ], 1, 'Personalised replies feel caring and avoid mistakes from generic templates.'),
          q('What must an AI business chatbot always allow?', [
            'Unlimited discounts',
            'Access to other customers\' orders',
            'Anonymous complaints only',
            'An easy way to reach a human',
          ], 3, 'Customers need a human option when the bot cannot help or makes mistakes.'),
          q('How can AI help with 50 customer reviews?', [
            'By deleting negative reviews',
            'By writing fake positive reviews',
            'By summarising praises, complaints and suggested improvements',
            'By replying automatically to all of them without checking',
          ], 2, 'Summarising feedback reveals clear priorities for improvement.'),
        ]
      ),
      lesson('Product Descriptions and Online Selling', 12, `
Selling online, on your own website, Daraz, Facebook Marketplace or Instagram, depends on clear, attractive product listings. Writing descriptions for dozens or hundreds of products is tedious, and many sellers leave them almost empty. AI makes complete, persuasive and honest listings quick to produce.

### Writing a product description

Give the AI the real details:

\`\`\`text
"Write a product description for Daraz for this item:
Men's leather sandals, handmade in Charsadda, genuine cow leather,
sizes 7 to 11, brown and black, cushioned sole, price Rs 3,200.
Include a short headline, 4 bullet points on benefits, care
instructions and a sizing tip. Simple English."
\`\`\`

### What makes a good listing

| Element | Why it matters |
|---|---|
| Clear title with key details | Helps search and quick understanding |
| Benefits, not just features | "Comfortable for all-day wear" rather than only "cushioned sole" |
| Accurate specifications | Size, material, colour, dimensions |
| Honest photos | Real product, real colours |
| Care and use information | Reduces returns and complaints |
| Delivery and return details | Builds trust before purchase |

### Batch creation

For many products, prepare a simple table of details and ask AI to produce descriptions for each:

\`\`\`text
"For each product in this table, write a title under 80 characters and
a 60-word description in the same style. Keep all prices and sizes
exactly as given."
[paste table]
\`\`\`

Check every result: AI can swap details between products or change numbers.

### Honesty protects your business

Do not let AI exaggerate:

- Do not claim materials the product does not contain, such as "pure silk" for a blend.
- Do not invent certifications, awards or guarantees.
- Do not describe colours or sizes differently from reality.

Misleading listings lead to returns, negative reviews, platform penalties and loss of customer trust. Marketplaces also have rules against misleading content.

### Search-friendly listings

Customers search using simple words. Ask AI:

\`\`\`text
"What words would Pakistani customers type when searching for this
product on Daraz or Google? Suggest a title and description that
naturally include the most important ones."
\`\`\`

Use the suggestions naturally; stuffing titles with repeated keywords reads badly and may be penalised.

### Photos and presentation

As chapter 6 explained, AI editing can remove backgrounds and improve lighting on real product photos, giving a professional, consistent look to your catalogue while keeping the product itself accurate.

### Pricing and offers

AI can help think through pricing and promotions:

\`\`\`text
"My sandals cost Rs 1,900 to make and I sell them at Rs 3,200. Suggest
three Eid promotion ideas that keep a healthy profit margin."
\`\`\`

Final pricing decisions depend on your costs and market knowledge, which AI does not have unless you provide them. Check the numbers yourself.
      `,
        [
          q('What makes a product description effective?', [
            'Exaggerated claims about quality',
            'Very short text with no details',
            'Benefits, accurate specifications and honest information',
            'Repeated keywords in every sentence',
          ], 2, 'Clear benefits and accurate details help customers buy confidently and reduce returns.'),
          q('What is the risk when creating many descriptions in one batch?', [
            'The descriptions will be too short',
            'AI can swap details between products or change numbers',
            'Marketplaces reject batch listings',
            'Prices are automatically increased',
          ], 1, 'Batch generation needs checking, since details can mix between products.'),
          q('Why avoid claiming "pure silk" for a silk blend?', [
            'Misleading listings cause returns, bad reviews and penalties',
            'Silk is not allowed on marketplaces',
            'AI cannot write about fabrics',
            'Customers prefer blends',
          ], 0, 'Honest descriptions protect trust and avoid platform and consumer protection problems.'),
        ]
      ),
      lesson('Freelancing Faster With AI', 13, `
Pakistan has one of the world's largest freelance workforces, delivering writing, design, development, marketing and virtual assistance to clients around the world. AI tools can make freelancers dramatically faster, but clients pay for quality, reliability and judgement. Using AI well means delivering better work, not just more work.

### Where AI speeds up freelance work

| Task | How AI helps |
|---|---|
| Proposals | Draft tailored proposals from the job post and your experience |
| Client communication | Clear, professional messages and summaries of requirements |
| Research | Background on the client's industry, competitors and audience |
| First drafts | Outlines and drafts for writing, marketing and documentation |
| Editing and proofreading | Polishing your work before delivery |
| Coding help | Explaining errors, suggesting code, writing tests |
| Admin | Invoices, contracts drafts, project plans |

### Proposals that stand out

Generic AI proposals are easy to spot, and clients receive dozens of them. Use AI to understand the job and structure your proposal, then add specific details:

\`\`\`text
"Here is a job post for a Shopify store product description writer.
My experience: 2 years writing for fashion brands, samples available.
Draft a short proposal that mentions two specific points from the post,
suggests one idea for their store, and asks one clarifying question.
Under 120 words, confident but not pushy."
\`\`\`

Edit the draft so it sounds like you and references the client's actual needs.

### Quality and originality

Clients expect original, accurate work. Before delivering:

- Check facts, figures and claims.
- Edit AI-generated text heavily so it matches the client's voice and is not generic.
- Test code thoroughly; never deliver code you do not understand.
- Check for accidental similarity to existing content where originality matters.

Delivering unedited AI output risks poor reviews, lost clients and account problems.

### Honesty with clients

Some clients welcome AI assistance; others prohibit it or require disclosure. Read job requirements and contracts carefully, and ask if unclear. Being transparent about your process, for example "I use AI tools for research and first drafts, and every deliverable is reviewed and edited by me", builds trust. Hiding AI use from a client who prohibited it can end the relationship and damage your reputation on the platform.

### Confidentiality

Clients share business information, unpublished content and sometimes customer data. Do not paste confidential client material into AI tools unless the client permits it and the tool's data handling is suitable. Many clients include confidentiality clauses in contracts.

### Pricing when AI makes you faster

If AI halves the time a task takes, consider pricing by value or project rather than by hour. Clients pay for results; your expertise in producing quality results efficiently is worth rewarding.

### Staying valuable

As AI makes basic tasks easier, clients value skills AI cannot provide: understanding their business, strategic thinking, reliability, communication and specialised expertise. Freelancers who combine AI speed with these human strengths are well positioned; those offering only what AI can produce alone will face falling rates.
      `,
        [
          q('How should AI be used for freelance proposals?', [
            'Send the same AI proposal to every job',
            'Copy the job post back to the client',
            'Avoid mentioning the client\'s needs',
            'Draft with AI, then add specific details and your own voice',
          ], 3, 'Tailored, personal proposals stand out from generic AI text.'),
          q('What should a freelancer do if a client prohibits AI use?', [
            'Respect the rule and discuss any questions openly',
            'Use AI secretly',
            'Ignore the contract',
            'Raise the price without explanation',
          ], 0, 'Honesty and contract compliance protect the relationship and reputation.'),
          q('Which skills keep freelancers valuable as AI spreads?', [
            'Typing speed only',
            'Using the largest number of AI tools',
            'Business understanding, reliability, communication and expertise',
            'Working the most hours',
          ], 2, 'Human judgement and trust complement AI speed in ways clients value.'),
        ]
      ),
      ],
      [
      q('What is the most practical benefit of AI for small business social media?', [
        'Replacing all product photos',
        'Making regular, consistent posting achievable',
        'Guaranteeing viral posts',
        'Removing the need to understand customers',
      ], 1, 'AI helps busy owners prepare posts quickly and keep a consistent schedule.'),
      q('What should an AI-drafted complaint reply never do?', [
        'Apologise sincerely',
        'Offer a fix',
        'Invent facts or blame the customer',
        'Ask what the customer prefers',
      ], 2, 'Replies must be accurate and respectful to rebuild trust.'),
      q('What keeps a product listing search-friendly without harming quality?', [
        'Using customers\' search words naturally',
        'Repeating keywords many times',
        'Removing product details',
        'Using only technical terms',
      ], 0, 'Natural use of common search terms helps discovery while staying readable.'),
      q('What must freelancers protect when using AI tools?', [
        'Their typing speed',
        'The number of proposals sent',
        'Their profile photo',
        'Clients\' confidential information',
      ], 3, 'Client material should not be shared with AI tools without permission.'),
      ]
    ),
    chapter(
      'Automation Without Being a Programmer',
      'Get help with code safely as a beginner, write spreadsheet formulas and simple scripts with AI, automate repetitive tasks with no-code tools, and build simple custom assistants for recurring needs.',
      [
      lesson('Getting Help With Code as a Beginner', 13, `
You do not need to be a programmer to benefit from code. Small scripts can rename hundreds of files, clean up spreadsheets, send reminder messages or build a simple web page. AI tools make these achievable for beginners, provided you approach them carefully and learn as you go.

### What beginners can realistically do

| Task | Example |
|---|---|
| Simple web pages | A one-page site for a small business with contact details |
| Spreadsheet automation | Scripts that format reports or send emails from a sheet |
| File tasks | Renaming or organising many files at once |
| Data cleaning | Removing duplicates or fixing formats in a list |
| Learning to code | Step-by-step explanations of Python or JavaScript basics |

### How to ask for code

Be specific about what you want, what you have and where it will run:

\`\`\`text
"I am a beginner. I use Windows and have Python installed. I have a
folder of 300 photos named randomly. Write a Python script that renames
them to shop_001.jpg, shop_002.jpg and so on, in order of date taken.
Explain each line simply, and tell me exactly how to run it."
\`\`\`

Asking for explanations turns each task into a lesson.

### Test safely

Code can delete or damage files if something goes wrong. Before running a script:

\`\`\`text
1. Back up the files or work on a copy.
2. Ask the AI: "What could go wrong with this script?"
3. Test it on a small sample first, such as 5 files.
4. Check the result before running it on everything.
\`\`\`

### Never run code you do not trust

Be cautious with code that:

- Deletes files or folders.
- Asks for passwords or sends data to the internet.
- Installs unknown software.
- Comes from strangers online claiming to "hack" or "unlock" something.

Ask the AI to explain any part you do not understand before running it. If the explanation involves anything harmful or suspicious, do not run it.

### Fixing errors

Errors are normal. Copy the full error message and ask:

\`\`\`text
"I ran the script and got this error. What does it mean and how do I fix it?
[paste the error]"
\`\`\`

This back-and-forth is how most people, including professionals, work with code today.

### Learning versus copying

If you want to build real coding skills, use AI as a tutor: ask why each line works, try changing things yourself, and write small programs without help. Cortexis's programming courses offer structured learning if you want to go further. Even if you never become a programmer, understanding the basics makes you far more capable with automation and AI tools.

### When to hire help

For anything handling payments, customer data, security or business-critical systems, involve an experienced developer. AI-assisted code written by a beginner may work in simple tests but contain security weaknesses or bugs that appear later, when the consequences are serious.

### Start small

Pick one repetitive task you do every week, automate it with AI's help, and enjoy the time saved. Each small success builds confidence for the next.
      `,
        [
          q('What should you do before running an AI-written script on important files?', [
            'Run it immediately on everything',
            'Share it on social media first',
            'Delete the originals to save space',
            'Back up the files and test on a small sample',
          ], 3, 'Backups and small tests prevent a faulty script from causing damage.'),
          q('Which code should make you especially cautious?', [
            'A script that prints "Hello"',
            'Code that deletes files or sends data to the internet',
            'A script that adds two numbers',
            'Code that you fully understand',
          ], 1, 'Destructive or data-sending code can cause harm and must be understood before running.'),
          q('When should a beginner involve an experienced developer?', [
            'For systems handling payments or customer data',
            'For renaming a few photos in a folder',
            'For learning the basics of Python',
            'For writing a simple spreadsheet formula',
          ], 0, 'High-stakes systems need professional review to avoid security weaknesses and bugs.'),
        ]
      ),
      lesson('Spreadsheet Formulas and Simple Scripts', 12, `
Spreadsheets are where most office automation begins. Beyond formulas (chapter 5), both Excel and Google Sheets support small scripts that automate repetitive work: formatting reports, sending emails, combining sheets and creating documents. AI makes writing these scripts accessible to non-programmers.

### Advanced formulas with AI help

Complex formulas become easy to create:

\`\`\`text
"In Google Sheets, I have student names in column A and marks in
columns B to F. Write formulas to calculate the total, percentage and
grade (A above 80%, B 70 to 80%, C 60 to 70%, otherwise F)."
\`\`\`

Ask for explanations of each formula so you can adjust them later.

### Google Apps Script

Google Sheets supports Apps Script, a simple scripting language, through the Extensions menu. With AI help, you can:

\`\`\`text
"Write a Google Apps Script that sends an email reminder to each
customer in my sheet whose payment due date (column D) is tomorrow.
Use their name (column A) and email (column B). Explain how to set it
to run automatically every morning."
\`\`\`

Scripts can run on schedules, triggered daily or when a form is submitted.

### Excel automation

Excel offers macros (recorded or written in VBA) and, in newer versions, Office Scripts. AI can write these and explain how to install and run them:

\`\`\`text
"Write an Excel macro that formats my monthly sales report: bold
headers, currency format for column C, auto-fit column widths and a
total row at the bottom."
\`\`\`

### Common automations

| Automation | Benefit |
|---|---|
| Email reminders from a sheet | No more manually messaging each customer |
| Combining monthly sheets | One summary instead of copy-pasting |
| Generating certificates or letters | Personalised documents for many people |
| Cleaning imported data | Consistent formatting every time |
| Form responses to reports | Automatic summaries of survey results |

### Permissions and safety

Scripts that send emails or access files ask for permissions. Read what they request: a script that only formats a sheet should not need access to all your emails. Test email scripts on your own address first, so a mistake does not send wrong messages to hundreds of customers.

### Keep a copy and document

Keep a copy of your spreadsheet before adding scripts, and write a short note in the sheet explaining what each script does and when it runs. Months later, you or a colleague will need to know why emails are being sent every morning.

### Understand, then extend

Once a script works, ask AI to explain it and try small changes yourself: a different message, another column, a new condition. This is how many office workers become confident automators without formal programming training, and it is a valuable skill in any workplace.
      `,
        [
          q('Where do you write Google Apps Script for a Google Sheet?', [
            'In a separate phone app only',
            'Inside a cell formula',
            'In the file\'s name',
            'Through the Extensions menu of the sheet',
          ], 3, 'Apps Script is accessed from the sheet\'s Extensions menu and can run on schedules.'),
          q('Why test an email script on your own address first?', [
            'Scripts only work for one email',
            'A mistake would otherwise send wrong messages to many customers',
            'Testing makes emails arrive faster',
            'Google requires it',
          ], 1, 'Testing prevents embarrassing or harmful mass emails.'),
          q('Which permission request should make you suspicious?', [
            'A formatting script asking to access all your emails',
            'An email script asking to send email',
            'A sheet script asking to edit the sheet',
            'A report script asking to read the sheet',
          ], 0, 'Permissions should match what the script actually needs to do.'),
        ]
      ),
      lesson('No-Code Automation With AI', 13, `
Many repetitive tasks involve moving information between apps: a new form response becomes a spreadsheet row and a WhatsApp message; a new order triggers an invoice email; a new email attachment is saved to a folder. No-code automation tools connect apps with simple rules, and AI is making them more powerful and easier to build.

### How no-code automation works

\`\`\`text
Trigger:  something happens   (a new Google Form response)
Actions:  things that follow  (add a row to a sheet, send an email,
                               notify the team on Slack)
\`\`\`

You build these flows with menus and forms instead of code.

### The tools

| Tool | Character |
|---|---|
| Zapier | Very easy to start, thousands of app integrations |
| Make | Visual flows, more complex logic, often cheaper at volume |
| Microsoft Power Automate | Strong with Microsoft 365 apps |
| n8n | Flexible, can be self-hosted by technical users |
| Built-in automations | Many apps include simple rules of their own |

Free plans usually allow a limited number of tasks per month; check pricing as usage grows.

### Adding AI steps

Automations can include AI steps that read, write or classify text:

\`\`\`text
New customer email arrives
  -> AI step: classify as order, complaint or question; extract key details
  -> If complaint: create a high-priority task and notify the owner
  -> If order: add to the orders sheet and send a confirmation draft
\`\`\`

Other examples:

- Summarise new support tickets and post them to a team channel.
- Draft replies to enquiries for a human to review.
- Extract data from invoices received by email into a spreadsheet.
- Translate incoming messages into the team's preferred language.

### Describing automations to AI

Many automation tools now let you describe what you want in plain language, and chatbots can help plan the flow:

\`\`\`text
"I receive orders through a Google Form. I want each order added to a
sheet, a confirmation email sent to the customer, and a WhatsApp
message to my delivery rider. Which tool could do this, and what are
the steps?"
\`\`\`

### Keep humans in the loop

AI steps can misclassify messages or draft wrong replies. For anything customer-facing or financial, have the automation create a draft or task for human review rather than sending automatically, at least until you have seen it work reliably for weeks.

### Watch for failures

Automations fail silently: an app changes its settings, a login expires, a limit is reached. Set up notifications for failed runs, check your automation dashboard weekly, and keep a list of what each automation does.

### Privacy and data

Automations move data between services, sometimes including customer details. Only connect apps you trust, give minimal permissions, and avoid sending sensitive data through AI steps unless the tools are approved for it.

### Start with one flow

Choose a task you do many times a week that follows the same steps each time. Automate it, check it for two weeks, then build the next. Small businesses and offices can save hours every week with just three or four well-chosen automations.
      `,
        [
          q('What starts a no-code automation?', [
            'A programmer writing code',
            'A monthly subscription payment',
            'A trigger such as a new form response',
            'Restarting your computer',
          ], 2, 'Automations run actions when a defined trigger event occurs.'),
          q('Why should customer-facing AI automations create drafts at first?', [
            'AI steps can misclassify or draft wrong replies',
            'Drafts are required by all tools',
            'Automated emails are illegal',
            'Drafts use fewer tasks',
          ], 0, 'Human review catches mistakes until the automation proves reliable.'),
          q('How can you catch automations that fail silently?', [
            'Assume they always work',
            'Delete them monthly',
            'Run each one by hand daily',
            'Set failure notifications and review the dashboard weekly',
          ], 3, 'Monitoring reveals broken logins, limits and settings changes early.'),
        ]
      ),
      lesson('Building Simple Custom Assistants', 13, `
If you repeatedly give an AI tool the same background and instructions, for example "I am a school teacher; create materials for Grade 7 in simple English with Pakistani examples", you can often save them as a custom assistant. Many chatbots let you create these tailored helpers without any programming.

### What custom assistants are

Different tools use different names: custom GPTs in ChatGPT, Projects in Claude, Gems in Gemini, and similar features elsewhere. The idea is the same:

\`\`\`text
A custom assistant = standing instructions + optional reference files
                     + a name and purpose
\`\`\`

Every conversation with it starts with that context already in place.

### Useful examples

| Assistant | Instructions and files |
|---|---|
| Shop reply helper | Brand voice, prices, delivery policy, return policy |
| Lesson planner | Class level, syllabus topics, resource limits |
| Proposal writer | Your experience, portfolio highlights, proposal style |
| Recipe planner | Family preferences, budget, available ingredients |
| Policy helper for staff | The company handbook, so staff can ask questions |

### Writing good instructions

\`\`\`text
Role and purpose:
"You help staff at Crumbs Bakery reply to customer messages."

Knowledge:
"Our prices, delivery areas and policies are in the attached file.
Only use information from this file for prices and policies."

Style:
"Warm, short replies. English or Roman Urdu, matching the customer."

Rules:
"Never promise delivery times not in the file. If unsure, say a
team member will confirm. Never share other customers' information."
\`\`\`

Clear rules about what the assistant must not do are as important as what it should do.

### Reference files

Uploading documents, such as a price list, handbook or syllabus, lets the assistant answer from your information. Keep files current: an assistant quoting last year's prices causes problems. Do not upload confidential documents unless the tool and your organisation's policies allow it.

### Test before sharing

Before relying on an assistant or sharing it with colleagues:

\`\`\`text
- Ask typical questions and check answers against your documents.
- Ask tricky or unusual questions; does it admit uncertainty?
- Ask about things outside its knowledge; does it avoid inventing answers?
- Try to make it break its rules; does it hold firm?
\`\`\`

Adjust instructions based on what you find.

### Sharing assistants

Some tools let you share assistants with colleagues or publicly. Before sharing, check what the attached files reveal, since users may be able to extract information from them. Never include private data in a shared assistant.

### Limits

Custom assistants are still powered by the same models: they can make mistakes, misread documents or ignore instructions occasionally. For important uses, keep a human checking outputs, and review the assistant's behaviour regularly.

### The payoff

A well-built assistant turns a general chatbot into a specialist for your work, saving time on every use. Building one for your most frequent task is often the single most valuable step in making AI part of your daily routine.
      `,
        [
          q('What does a custom assistant add to a regular chatbot?', [
            'A different underlying company',
            'Unlimited free usage',
            'Guaranteed correct answers',
            'Standing instructions and reference files for a specific purpose',
          ], 3, 'Custom assistants start each chat with saved context and documents.'),
          q('Why include rules about what an assistant must not do?', [
            'Rules make the assistant faster',
            'Tools reject assistants without rules',
            'They prevent promises and answers beyond its knowledge',
            'Rules reduce subscription costs',
          ], 2, 'Clear limits reduce invented answers and inappropriate commitments.'),
          q('What should you check before sharing a custom assistant publicly?', [
            'Whether its attached files contain information you should not reveal',
            'Whether it has a colourful icon',
            'Whether it writes long answers',
            'Whether it uses emojis',
          ], 0, 'Users may extract content from attached files, so private data must be excluded.'),
        ]
      ),
      ],
      [
      q('What is the best way for a beginner to learn from AI-written code?', [
        'Copy it without reading',
        'Ask for line-by-line explanations and try small changes',
        'Run it on all important files immediately',
        'Share it without testing',
      ], 1, 'Explanations and experimentation turn each task into real learning.'),
      q('Which automation is well suited to Google Apps Script?', [
        'Designing a new logo for the business',
        'Editing a promotional video',
        'Emailing reminders to customers in a sheet',
        'Recording a weekly podcast episode',
      ], 2, 'Apps Script automates actions based on spreadsheet data, such as reminder emails.'),
      q('Which tool connects apps with triggers and actions without code?', [
        'A spreadsheet formula',
        'A text-to-speech app',
        'An image generator',
        'Zapier or Make',
      ], 3, 'No-code automation platforms link apps through triggers and actions.'),
      q('What keeps a custom assistant reliable over time?', [
        'Updating its files and reviewing its answers regularly',
        'Never changing its instructions',
        'Sharing it with as many people as possible',
        'Removing all rules',
      ], 0, 'Current information and regular review prevent outdated or wrong answers.'),
      ]
    ),
    chapter(
      'Safety, Privacy and Ethics',
      'Protect your private information when using AI tools, recognise AI-powered scams, deepfakes and misinformation, understand bias in AI outputs, and handle copyright, ownership and disclosure responsibly.',
      [
      lesson('What Not to Share With AI Tools', 13, `
AI chatbots feel like private conversations, but what you type is sent to a company's servers, stored for some period and, depending on the tool and your settings, may be reviewed or used to improve future models. A few simple rules keep your personal, family and work information safe.

### Never share

| Information | Why |
|---|---|
| Passwords, PINs and one-time codes | Anyone with them can access your accounts |
| Full card numbers, CVV codes, bank login details | Direct financial risk |
| CNIC numbers and scans of identity documents | Identity theft and fraud |
| Other people's private information | Their privacy is not yours to share |
| Medical records with identifying details | Highly sensitive, hard to undo |
| Confidential work documents without permission | May breach employment rules or contracts |

A useful test: would you be comfortable if this text appeared on a notice board at your office or in your neighbourhood? If not, do not paste it.

### How your data may be used

Policies differ between tools and plans:

- Some consumer plans may use conversations to improve models unless you opt out in settings.
- Business and enterprise plans typically commit not to train on customer data.
- Conversations may be kept for a period for safety and legal reasons, even after you delete them from your view.
- Features such as memory store details about you across conversations.

Read the privacy settings of the tools you use, switch off training on your data if you prefer, and review or clear saved memories periodically.

### Anonymise before sharing

You can often get the help you need without personal details:

\`\`\`text
Instead of:  "Write a letter to Muhammad Ali Khan, CNIC 35202-XXXXXXX-X,
              at House 12, Street 5, Model Town, about his overdue loan."

Try:         "Write a polite letter to a customer about an overdue loan
              payment of Rs [amount] due on [date]."
\`\`\`

Fill in real details yourself after the AI drafts the text.

### Work and client information

Many employers now have policies on AI use: which tools are approved, what data may be used, and what is prohibited. Follow them. If there is no policy, ask before pasting customer data, financial figures, contracts or unreleased plans into an AI tool. Leaked confidential information has cost employees their jobs.

### Photos and files

Uploaded images and documents can contain more than you think: location data in photo files, names in document properties, other people in the background, or account numbers visible on a bill. Crop, blur or remove sensitive parts before uploading.

### Children and family

Teach children not to share their full name, school, address or photos with AI tools or apps they do not know. Supervise younger children's use of AI chatbots, and check the age requirements of each tool; many require users to be at least 13 or 18.

### Shared devices

On shared family or office computers, log out of AI accounts after use, and be aware that chat histories may be visible to others. Use a private account rather than a shared one for anything personal.

### The simple rule

Share what the AI needs to help you, and nothing more. Most tasks, writing, explaining, planning, need very little personal information at all.
      `,
        [
          q('Which information should never be shared with an AI chatbot?', [
            'A request to explain photosynthesis',
            'Your bank PIN or a one-time code',
            'A general question about recipes',
            'A draft of a public social media post',
          ], 1, 'Passwords, PINs and codes give direct access to accounts and money.'),
          q('How can you get help with a letter without sharing personal data?', [
            'Use placeholders and fill in real details yourself afterwards',
            'Include the person\'s CNIC for accuracy',
            'Upload their identity card photo',
            'Share their home address',
          ], 0, 'Anonymised prompts produce the same help without exposing private information.'),
          q('What should employees do before pasting customer data into AI tools?', [
            'Nothing, AI tools are always private',
            'Share it quickly to save time',
            'Check their employer\'s AI policy or ask permission',
            'Post it publicly first',
          ], 2, 'Company rules on approved tools and data use must be followed.'),
        ]
      ),
      lesson('Scams, Deepfakes and Misinformation', 14, `
The same AI technology that helps people write and create is also used by criminals. Scammers use AI to write convincing messages, clone voices and create fake videos. Misinformation spreads faster when fake images and articles look real. Knowing the common tricks protects you and your family.

### AI-powered scams to know

| Scam | How it works |
|---|---|
| Voice clone emergency calls | A voice sounding like a relative says they are in trouble and need money urgently |
| Fake celebrity investment videos | A deepfake of a famous person promotes a trading app or scheme |
| Perfect phishing messages | Well-written fake bank, courier or government messages asking you to click a link |
| Fake customer service | Scammers pose as bank or wallet staff to get your codes |
| Fake job offers | Polished offers requiring a "registration fee" or personal documents |
| Romance and friendship scams | AI-written messages build trust before asking for money |

Spelling mistakes used to be a warning sign in scam messages. AI has removed that sign; well-written messages can still be scams.

### Protecting your family from voice scams

\`\`\`text
1. Agree on a family code word that only family members know.
2. If a caller claims to be a relative in trouble, hang up and call
   them back on their known number.
3. Never transfer money under time pressure from a phone call alone.
4. Tell elderly relatives about these scams; they are often targeted.
\`\`\`

Scammers rely on panic and urgency. Slowing down defeats most scams.

### Spotting deepfakes

Deepfakes are improving, and visual clues are becoming less reliable, but some checks still help:

- Does the source make sense? Would this celebrity really promote a trading app on an unknown page?
- Is it reported by reliable news outlets?
- Are there unnatural details: odd lip movements, strange lighting, blurry edges, unusual voice rhythm?
- Does it push you to act quickly, pay money or share personal information?

The strongest defence is not detecting the fake, but checking the claim through trusted channels.

### Misinformation

Fake images of disasters, fabricated quotes from politicians and invented news articles spread rapidly on WhatsApp and social media, especially during elections, floods and emergencies. Before sharing:

\`\`\`text
- Where did this come from originally?
- Is it reported by credible news organisations?
- Could the image be old, edited or generated?
- Does it make me angry or afraid? (Misinformation often targets emotions.)
\`\`\`

When unsure, do not forward it. Stopping misinformation is as important as spotting it.

### Verifying images

Reverse image search, available in major search engines, shows where an image appeared before. An image claimed to show today's event that appeared online years ago is misleading, whether or not AI was involved.

### Reporting

Report scams to your bank or mobile wallet provider immediately if money or codes are involved, and to Pakistan's official cybercrime reporting channels. Report fake accounts and deepfakes to the platform where they appear. Quick reporting can stop a fraudulent transaction and protect others.

### Staying calm and sceptical

Healthy scepticism is not paranoia. Most messages and videos are genuine. But when something asks for money, codes, urgency or strong emotional reaction, pause and verify. That pause is the most effective protection available.
      `,
        [
          q('A caller sounding like your cousin urgently asks for money. What should you do?', [
            'Transfer the money quickly to help',
            'Share your bank details to speed things up',
            'Ask the caller for their account number',
            'Hang up and call your cousin back on their known number',
          ], 3, 'Verifying through a known number defeats voice-clone emergency scams.'),
          q('Why are spelling mistakes no longer a reliable scam warning?', [
            'Scammers stopped sending messages',
            'Banks now make spelling mistakes',
            'AI helps scammers write polished messages',
            'Phones correct all spelling automatically',
          ], 2, 'Well-written text can still be a scam, so check the request, not the grammar.'),
          q('What is the strongest defence against a convincing deepfake?', [
            'Watching it several times',
            'Checking the claim through trusted, independent channels',
            'Sharing it to ask others',
            'Trusting videos with high view counts',
          ], 1, 'Verifying the claim itself works even when visual clues fail.'),
        ]
      ),
      lesson('Bias and Fairness', 12, `
AI models learn from huge amounts of human-created text and images, and human data contains biases: stereotypes about gender, ethnicity, religion, region and class. AI systems can reflect and sometimes amplify these biases. Understanding this helps you notice unfair outputs and use AI more responsibly, especially where decisions affect people.

### How bias appears

| Example | Possible bias |
|---|---|
| Image prompt "a doctor" mostly produces men | Gender stereotypes about professions |
| Descriptions of certain regions focus on problems | Regional or ethnic stereotyping |
| CV screening favours certain universities or names | Unfair hiring decisions |
| Examples and names default to Western contexts | Cultural bias and invisibility of local experiences |
| Uneven quality in different languages | Less support for Urdu and regional languages |

Bias is not always obvious; it can appear in subtle word choices, assumptions or who is included in examples.

### Why it matters

For casual uses, bias may be merely annoying. But AI increasingly influences decisions about people: shortlisting job applicants, assessing loan applications, grading, customer service priority. Biased outputs in these areas can unfairly harm individuals and groups.

### Noticing and correcting bias

When outputs seem stereotyped or one-sided, adjust the prompt:

\`\`\`text
"Show a diverse group of Pakistani doctors, including women, of
different ages, in a hospital in Peshawar."

"Rewrite this job advertisement using gender-neutral language and
avoid requirements that are not essential for the role."

"Give balanced perspectives on this issue, including views from
different regions of Pakistan."
\`\`\`

Asking explicitly for diversity, balance and neutral language often improves results.

### Using AI in decisions about people

If you use AI in hiring, admissions, lending or similar decisions:

- Never let AI make the final decision alone.
- Check outputs for patterns that disadvantage particular groups.
- Base decisions on relevant criteria, such as skills and qualifications, not names, photos or backgrounds.
- Be transparent with people about how decisions are made.
- Follow any laws and organisational policies that apply.

A human who can explain and take responsibility for a decision must remain involved.

### Cultural representation

AI tools are often trained mostly on English-language, Western content. Answers about Pakistani culture, history, religion and daily life may be incomplete, stereotyped or wrong. Local knowledge from people who live the culture remains essential. When AI gets something about your community wrong, correct it and do not repeat the error.

### Religious and sensitive topics

For questions about religion, AI can provide general information but may make errors or oversimplify complex matters. For religious rulings and guidance, consult qualified scholars and authentic sources rather than relying on a chatbot.

### Your role

Everyone who uses AI shapes how it affects society. Questioning biased outputs, choosing inclusive language and keeping humans accountable for important decisions all contribute to fairer use of these powerful tools.
      `,
        [
          q('Where does bias in AI outputs come from?', [
            'Biases present in the human-created data it learned from',
            'Random errors in the internet connection',
            'The colour of the app\'s interface',
            'The user\'s phone model',
          ], 0, 'Models learn patterns, including stereotypes, from their training data.'),
          q('How can you reduce stereotyped image results?', [
            'Use shorter prompts',
            'Generate the same image many times',
            'Ask explicitly for diversity and specific details',
            'Avoid mentioning people at all',
          ], 2, 'Explicit requests for diverse representation steer outputs away from defaults.'),
          q('What must remain true when AI assists in hiring decisions?', [
            'AI makes the final decision alone',
            'A responsible human reviews and decides based on relevant criteria',
            'Names and photos decide the shortlist',
            'Candidates are never told how decisions are made',
          ], 1, 'Human accountability and relevant criteria protect fairness in decisions about people.'),
        ]
      ),
      lesson('Copyright, Ownership and Disclosure', 13, `
When AI helps create a text, image or song, who owns it? Can you use AI images in your business? Must you tell people AI was involved? These questions are still being worked out by courts and governments worldwide, but some sensible practices protect you today.

### Ownership of AI outputs

| Question | Current general picture |
|---|---|
| Does the tool company claim your outputs? | Many major tools' terms give users rights to their outputs, but terms vary; read them |
| Are purely AI-generated works protected by copyright? | In several countries, protection generally requires human creative contribution; rules vary and are evolving |
| Does your editing and creative input matter? | Significant human selection, arrangement and editing strengthens your claim |

Laws differ by country and are changing. For important commercial uses, check the tool's terms and seek legal advice where needed.

### Copying and similarity risks

AI tools can sometimes produce outputs similar to existing copyrighted works: text resembling published articles, images in the recognisable style of specific artists or characters, logos resembling brands. Risks increase when you ask for them directly:

\`\`\`text
Risky:   "Write the lyrics of this famous song" or "Draw a well-known
          cartoon character for my shop's logo"
Safer:   "Write an original song about Lahore's winter evenings"
          "Design an original mascot: a friendly cartoon mango for a juice shop"
\`\`\`

Using others' characters, logos or copyrighted text in commercial work can lead to legal claims, whether or not AI produced it.

### Your inputs matter too

Uploading someone else's copyrighted book, course material or photos into AI tools may breach their rights or the terms under which you received them. Use materials you have rights to, or content that is openly licensed.

### Disclosure

When should you say that AI helped?

| Situation | Guidance |
|---|---|
| Schools and universities | Follow the institution's rules (chapter 7) |
| Clients and employers | Follow contracts and policies; be transparent when asked |
| Journalism and publishing | Many outlets require clear disclosure |
| Realistic images, audio and video | Label them, especially if they could be mistaken for real |
| Social media platforms | Follow their rules for synthetic or altered content |
| Personal messages | Use judgement; heartfelt messages should be genuinely yours |

A simple principle: disclose whenever the audience would reasonably want to know, or when not knowing could mislead them.

### Credit and honesty

Presenting AI-generated work as entirely your own creative effort, such as entering AI art in a competition for human artists or claiming AI-written articles as your independent writing where that matters, is dishonest. Many competitions and publications now have explicit rules.

### Practical guidelines

\`\`\`text
- Ask for original work, not copies of existing works.
- Add substantial human creativity: ideas, editing, selection.
- Keep records of prompts and drafts for important projects.
- Read tool terms for commercial use.
- Disclose AI use where expected or where it matters.
- Seek legal advice for high-value commercial assets like logos and brand names.
\`\`\`

These habits keep you on the right side of both the law and honest practice as the rules continue to develop.
      `,
        [
          q('Which request carries the highest copyright risk?', [
            'An original poem about monsoon rain',
            'A new mascot design for a juice shop',
            'A famous cartoon character for a shop logo',
            'An original short story for your children',
          ], 2, 'Using existing protected characters commercially risks legal claims.'),
          q('When should you disclose AI involvement?', [
            'When the audience would reasonably want to know or could be misled',
            'Never, AI use is private',
            'Only when the work is poor quality',
            'Only if someone accuses you',
          ], 0, 'Disclosure where it matters maintains honesty and trust.'),
          q('What strengthens a claim to creative ownership of AI-assisted work?', [
            'Using the longest possible prompt',
            'Generating many versions',
            'Paying for a premium plan',
            'Substantial human selection, arrangement and editing',
          ], 3, 'Human creative contribution is central to copyright in many jurisdictions.'),
        ]
      ),
      ],
      [
      q('What is the simple rule for sharing information with AI?', [
        'Share only what the AI needs to help you',
        'Share everything for better answers',
        'Share passwords to save time',
        'Never use AI for anything',
      ], 0, 'Most tasks need little personal data, so minimise what you share.'),
      q('What defeats most AI-powered scams?', [
        'Replying quickly to urgent messages',
        'Clicking links to check them',
        'Pausing and verifying through trusted channels',
        'Trusting well-written messages',
      ], 2, 'Scams rely on urgency; slowing down and verifying breaks them.'),
      q('For religious rulings, what should you rely on?', [
        'A chatbot\'s first answer',
        'A viral social media post',
        'Whatever answer you prefer',
        'Qualified scholars and authentic sources',
      ], 3, 'AI can oversimplify or err on complex religious matters.'),
      q('Why is uploading someone else\'s copyrighted course material to AI tools a concern?', [
        'It makes the AI slower',
        'It may breach their rights or the terms you received it under',
        'AI cannot read course materials',
        'It deletes the material',
      ], 1, 'Inputs are subject to copyright and licensing terms too.'),
      ]
    ),
    chapter(
      'AI in Urdu and Pakistani Contexts',
      'Get good results from AI in Urdu and Roman Urdu, apply AI to everyday family and business needs in Pakistan, use AI to make information more accessible and inclusive, and understand the limits of AI with local languages and local knowledge.',
      [
      lesson('Using AI in Urdu and Roman Urdu', 13, `
Most Pakistanis communicate in a mix of Urdu, English and regional languages, often switching within a single sentence, and many write Urdu in Roman script on their phones. AI tools increasingly understand and write Urdu, but getting good results requires knowing their strengths and a few practical techniques.

### What works well

| Task | Typical quality |
|---|---|
| Understanding Urdu and Roman Urdu questions | Generally good |
| Translating everyday text between Urdu and English | Generally good |
| Writing simple Urdu messages and notices | Good, with some unnatural phrasing |
| Roman Urdu for chats and social posts | Good |
| Explaining concepts in simple Urdu | Good for common topics |

Quality varies between tools and improves with each new model; try the same Urdu task in two tools to see which suits you.

### Where it struggles

- Poetry, idioms and literary Urdu often sound unnatural or lose meaning.
- Very formal or legal Urdu may use awkward or incorrect terms.
- Spelling of Roman Urdu varies ("kya", "kia"), which can cause occasional confusion.
- Nastaliq script rendering in images, where generators often produce incorrect or meaningless Urdu text.
- Specialised terms in medicine, law and technology may be translated inconsistently.

### Techniques for better Urdu results

\`\`\`text
"Answer in simple Urdu that a Grade 5 student can understand."
"Use everyday conversational Urdu, not formal or literary language."
"Write in Roman Urdu the way young people text on WhatsApp."
"Give the Urdu version, then the English version below it."
"Keep technical terms in English where Pakistanis normally use English."
\`\`\`

The last instruction reflects how people actually speak: words like "mobile", "account", "download" and "form" are usually kept in English.

### Asking questions in your language

You can ask in Urdu, Roman Urdu or a mix, and request the answer in whichever language you prefer:

\`\`\`text
"Mujhe bijli ke bill mein 'FPA' ka matlab samjhao, simple Urdu mein."
\`\`\`

Many people find it easier to think and ask in the language they speak at home, even if they want the answer in English for work.

### Voice in Urdu

Voice modes and transcription in Urdu are improving, allowing people who find typing difficult, including many elderly relatives, to ask questions by speaking. Accuracy is higher for clear speech in quiet surroundings and lower with strong regional accents or background noise.

### Regional languages

Support for Punjabi, Sindhi, Pashto, Saraiki, Balochi and other regional languages is generally weaker than for Urdu and English, particularly in their written forms. Results can still be useful for simple tasks; always have a fluent speaker check anything important.

### Check important Urdu text

For official notices, legal documents, religious text and anything published widely, have a fluent reader review AI-produced Urdu. Small errors in formal Urdu can change meaning or appear careless to readers.
      `,
        [
          q('Which Urdu task is AI generally good at?', [
            'Translating complex classical poetry perfectly',
            'Translating everyday text between Urdu and English',
            'Writing flawless Nastaliq inside generated images',
            'Legal Urdu without any review',
          ], 1, 'Everyday translation works well, while literary, legal and in-image Urdu remain weaker.'),
          q('Why ask the AI to keep common technical terms in English?', [
            'It matches how Pakistanis actually speak and write',
            'Urdu has no words at all',
            'AI cannot write Urdu words',
            'English terms are required by law',
          ], 0, 'Everyday Urdu naturally uses English terms like mobile and account.'),
          q('What should happen before publishing an AI-written official notice in Urdu?', [
            'Publish immediately to save time',
            'Translate it into five languages',
            'Convert it into an image',
            'Have a fluent reader review it',
          ], 3, 'Formal Urdu errors can change meaning or look careless, so human review is essential.'),
        ]
      ),
      lesson('Everyday Uses for Pakistani Families and Businesses', 14, `
AI tools are most valuable when they solve real problems in daily life. For families and small businesses in Pakistan, that means help with paperwork, bills, applications, health information, budgeting, education and running a business. These practical uses show how AI can save time and reduce stress for ordinary people.

### Understanding documents and bills

Many people struggle with complicated documents written in formal English or bureaucratic language:

\`\`\`text
"Explain this electricity bill in simple Urdu. What are these charges,
and why is my bill higher than last month?"
[upload a photo of the bill with account numbers covered]

"Explain what this tenancy agreement says about rent increases and
notice periods, in simple language."
\`\`\`

For legal and financial documents, use AI to understand, and consult a professional before important decisions.

### Applications and forms

AI can help understand requirements and prepare applications for:

- University admissions and scholarship essays.
- Job applications, CVs and cover letters.
- Visa document checklists (always confirm with the embassy's official site).
- Complaints to service providers and government departments.

\`\`\`text
"Help me write a complaint to my internet provider about repeated
outages over two weeks. Include dates, request compensation, and keep
it polite but firm."
\`\`\`

### Health information

AI can explain medical terms, prepare questions for a doctor's appointment and describe general information about conditions:

\`\`\`text
"My mother was diagnosed with type 2 diabetes. Explain it in simple
Urdu, and list questions we should ask her doctor at the next visit."
\`\`\`

AI must never replace a doctor. Do not use it to decide medicines, doses or treatments, and seek urgent care for emergencies.

### Household budgeting

\`\`\`text
"My family's monthly income is Rs 150,000. Help me make a budget for
rent, groceries, school fees, utilities, transport and savings, and
suggest ways to reduce electricity costs in summer."
\`\`\`

### Children's education

Parents can use AI to understand their children's homework, find simple explanations to help them, and create practice questions, while encouraging children to do their own thinking (chapter 7).

### Running a small business

| Need | AI help |
|---|---|
| Business idea evaluation | Questions to consider, costs to estimate |
| Pricing | Calculating margins with your real costs |
| Marketing | Posts, captions and WhatsApp messages (chapter 8) |
| Record keeping | Spreadsheet templates for sales and expenses |
| Registration and tax | Understanding the steps, then confirming with official sources |
| Supplier communication | Clear messages and negotiation preparation |

### Local context is your job

AI may not know current local prices, regulations, procedures in your city or recent policy changes. Use it to understand and organise, then confirm details with official sources, local offices and people with experience. That combination, AI for speed and local knowledge for accuracy, produces the best results.
      `,
        [
          q('What should you cover before uploading a photo of a bill to AI?', [
            'Account numbers and personal identifiers',
            'The electricity company\'s logo',
            'The total amount you owe',
            'The billing month and year',
          ], 0, 'Hiding identifiers protects your account while still getting an explanation.'),
          q('How should AI be used for health questions?', [
            'To decide medicine doses',
            'To replace doctor visits',
            'To diagnose emergencies at home',
            'To understand terms and prepare questions for a doctor',
          ], 3, 'AI can explain and help prepare, but medical decisions belong with qualified doctors.'),
          q('Why confirm visa or registration steps with official sources?', [
            'Official sites are shorter',
            'AI may not know current local procedures or changes',
            'AI is not allowed to discuss visas',
            'Official sites use simpler language',
          ], 1, 'Procedures change, and official sources are authoritative.'),
        ]
      ),
      lesson('Accessibility and Inclusion', 12, `
AI tools can open doors for people who have been excluded from information and services: people with disabilities, those who cannot read well, elderly citizens unfamiliar with technology and people in areas with limited access to experts. Used thoughtfully, AI can make society more inclusive.

### Accessibility uses

| Need | How AI helps |
|---|---|
| Visual impairment | Describing images, reading documents aloud, identifying objects through the camera |
| Hearing impairment | Live captions, transcription of calls and videos |
| Reading difficulties | Simplifying text, reading aloud, explaining in plain language |
| Limited literacy | Voice questions and spoken answers in Urdu |
| Motor difficulties | Dictation instead of typing, voice control |
| Learning differences | Step-by-step explanations at a comfortable pace |

Many phones include built-in accessibility features, such as screen readers, live captions and image descriptions, that increasingly use AI.

### Helping elderly relatives

For many older people, voice is the easiest way to use technology:

\`\`\`text
- Set up a voice assistant on their phone in Urdu.
- Show them how to ask questions by speaking.
- Teach them to photograph a document and ask for an explanation.
- Warn them clearly about scams (chapter 10).
\`\`\`

Spending an hour setting this up can give a grandparent much greater independence.

### Making your own content accessible

Anyone creating content can use AI to make it more inclusive:

- Add captions to videos automatically, then correct them.
- Write alternative text descriptions for images on websites and social media.
- Produce simple-language versions of important information.
- Offer information in both Urdu and English.
- Provide audio versions of written content.

\`\`\`text
"Write short alt text for this image for visually impaired readers."
"Rewrite this health notice in simple language suitable for readers
with limited literacy, in Urdu and English."
\`\`\`

### Education and opportunity

Students in areas without strong schools or tutors can use AI for explanations and practice they could not otherwise access. People can learn skills, English, digital literacy and trades, at their own pace and cost. This has real potential to reduce inequality, provided internet access and basic digital skills are available.

### The digital divide

Not everyone benefits equally. Many people in Pakistan lack reliable internet, smartphones or the digital literacy to use AI tools. Women and rural communities often have less access. Helping family members, neighbours and communities learn to use these tools safely is one practical way to share the benefits.

### Respect and dignity

When using AI to support people with disabilities or limited literacy, respect their choices and privacy. Ask what help they want rather than assuming. Accessibility tools should increase independence, not take decisions away from people.

### Limitations

Accessibility features are not perfect: image descriptions can be wrong, captions can mishear words, and simplified text can lose important details. For critical information, such as medical instructions or legal notices, combine AI tools with human support.
      `,
        [
          q('How can AI help someone with a visual impairment?', [
            'By making text smaller',
            'By removing all audio',
            'By describing images and reading documents aloud',
            'By adding more colours to screens',
          ], 2, 'Image descriptions and text-to-speech make visual information accessible.'),
          q('What is a practical way to help an elderly relative use AI?', [
            'Set up voice questions in Urdu and warn them about scams',
            'Give them your passwords',
            'Subscribe them to many paid tools',
            'Let them discover everything alone',
          ], 0, 'Voice access plus scam awareness gives independence safely.'),
          q('What is the digital divide?', [
            'A type of AI model',
            'A feature of image generators',
            'A new social media platform',
            'Unequal access to internet, devices and digital skills',
          ], 3, 'Many people cannot benefit from AI without access and skills, making inclusion an active task.'),
        ]
      ),
      lesson('Limits With Local Languages and Knowledge', 13, `
AI tools are trained mostly on English-language content from Western countries. Their knowledge of Pakistan, its laws, institutions, history, culture, prices and daily realities, is thinner and less reliable. Understanding these limits helps you use AI where it is strong and rely on local sources where it is weak.

### Where local knowledge is often weak

| Area | Typical problems |
|---|---|
| Laws and regulations | Outdated or incorrect rules; confusion with Indian or British law |
| Government procedures | Wrong offices, fees, documents or steps |
| Prices and costs | Outdated figures, especially with inflation |
| Local geography | Incorrect details about towns, areas and distances |
| Recent events | Missing or wrong information |
| Local businesses and people | Invented details |
| History and culture | Oversimplified or stereotyped accounts |

### Common confusion with neighbours

Because there is far more online content about India, AI tools sometimes mix up Pakistani and Indian systems: education boards, tax rules, legal terms or cultural practices. Check that answers refer to Pakistan specifically, and tell the AI clearly: "Answer for Pakistan only."

### Current information

Prices, exchange rates, electricity tariffs, fuel prices, taxes and regulations in Pakistan change frequently. Use AI tools with web search for current information, and confirm with official sources such as government websites, the State Bank of Pakistan, utility companies and regulators.

### Using AI to find local information

AI can still help by pointing you in the right direction:

\`\`\`text
"Which government department in Punjab handles vehicle registration,
and what official website should I check for current requirements?"
\`\`\`

Then visit the official source for accurate, current details.

### Local experts and community knowledge

Some knowledge is best found through people: a lawyer familiar with local courts, a chartered accountant for tax matters, a doctor for health, experienced traders for market prices, community elders for local history. AI can help you prepare better questions for these conversations, but it cannot replace their experience.

### Contributing local knowledge

When AI gets something wrong about Pakistan, many tools let you give feedback. Pakistani writers, researchers and businesses also help improve AI's local knowledge by publishing accurate, high-quality content online in Urdu and English. Over time, more local content means better AI understanding of local realities.

### A balanced approach

\`\`\`text
AI is strong at:    explaining general concepts, writing, structuring,
                    translating everyday text, brainstorming
AI is weaker at:    current local facts, Pakistani laws and procedures,
                    regional languages, local businesses and events
So:                 use AI for the first, and verify the second
                    with official sources and local experts
\`\`\`

Knowing where AI is reliable and where it is not is what separates skilled users from those who get misled. For Pakistani users, that knowledge is especially valuable.
      `,
        [
          q('Why might AI confuse Pakistani and Indian systems?', [
            'The two countries use identical systems',
            'There is far more online content about India in its training data',
            'AI tools are banned in Pakistan',
            'Pakistani content is always hidden',
          ], 1, 'Imbalanced training data leads to mix-ups, so specify Pakistan clearly.'),
          q('Where should you confirm current electricity tariffs?', [
            'A chatbot without web search',
            'A social media rumour',
            'Official sources such as the utility or regulator',
            'An old newspaper',
          ], 2, 'Tariffs change often, and official sources are authoritative.'),
          q('What is AI strongest at for Pakistani users?', [
            'Explaining general concepts and helping with writing',
            'Knowing today\'s local prices',
            'Providing exact local legal procedures',
            'Knowing details of small local businesses',
          ], 0, 'General explanation and writing are strengths; current local facts need verification.'),
        ]
      ),
      ],
      [
      q('How can you get simpler Urdu from an AI tool?', [
        'Use only English prompts',
        'Ask for simple, everyday conversational Urdu',
        'Request literary Urdu',
        'Avoid specifying the language',
      ], 1, 'Clear instructions about style produce natural, simple Urdu.'),
      q('What is the right way to use AI for a tenancy agreement?', [
        'Understand it with AI, then get professional advice',
        'Sign whatever the AI recommends',
        'Ask AI to sign it on your behalf',
        'Ignore the agreement completely',
      ], 0, 'AI aids understanding, but legal decisions need professional advice.'),
      q('Which AI feature helps people with hearing impairments?', [
        'Image generation',
        'Voice cloning',
        'Text-to-image art',
        'Live captions and transcription',
      ], 3, 'Captions turn speech into readable text.'),
      q('What should you add to prompts about laws or procedures?', [
        'A request for longer answers',
        'A random location',
        '"Answer for Pakistan only"',
        'A request to ignore sources',
      ], 2, 'Specifying Pakistan reduces confusion with other countries\' systems.'),
      ]
    ),
    chapter(
      'Your AI-Powered Future',
      'Build a personal AI workflow that fits your daily life, evaluate new AI tools with a simple checklist, understand which careers and skills are growing in an AI world, and stay current without being overwhelmed by constant change.',
      [
      lesson('Building a Personal AI Workflow', 13, `
Knowing about AI tools is one thing; using them consistently in daily life is another. A personal AI workflow is a simple routine of which tools you use, for which tasks, and how. It turns scattered experiments into steady time savings and better work.

### Map your week

Start by listing the tasks you do regularly:

\`\`\`text
Work:      emails, reports, meetings, spreadsheets, presentations
Study:     notes, assignments, exam preparation
Business:  social posts, customer replies, product listings
Personal:  budgeting, planning, learning, family paperwork
\`\`\`

Mark the ones that are repetitive, time-consuming or difficult. These are your best candidates for AI help.

### Assign tools to tasks

| Task | Tool | How |
|---|---|---|
| Emails and messages | Main chatbot | Template prompts from chapter 2 |
| Meeting notes | Meeting app's AI or transcription tool | Summaries checked the same day |
| Social media posts | Chatbot plus Canva | Weekly batch on Sunday |
| Learning English | Chatbot voice mode | 15 minutes daily conversation practice |
| Budget | Spreadsheet with AI-written formulas | Monthly review |

Keep the list short. Two or three well-used tools beat ten occasional ones.

### Build habits, not just tools

\`\`\`text
Morning:   use AI to plan the day's priorities (5 minutes)
During:    use templates for repetitive writing
Evening:   voice-note ideas, AI turns them into tomorrow's to-do list
Weekly:    batch social posts; review what AI helped with and what did not
\`\`\`

Habits make AI use automatic, so benefits accumulate without extra effort.

### Your prompt library

Save the prompts that work well (chapter 2) in one place, organised by task. Add custom instructions to your main chatbot with your background and preferences. Over time, this library becomes one of your most valuable productivity assets.

### Measure the benefit

After a month, ask yourself:

- Which tasks became faster?
- Which outputs improved in quality?
- Where did AI cause problems or waste time?
- What should I stop, start or change?

Some tasks will benefit hugely; others may not benefit at all. Drop what does not help.

### Keep your skills strong

A good workflow uses AI to enhance your abilities, not replace them. Keep writing some things yourself, keep doing mental arithmetic sometimes, keep reading full documents when they matter. Skills you never practise fade, and you will still need them in interviews, exams and situations without AI.

### Protect your time and attention

AI can also become a distraction: endless experimenting, chasing new tools, generating content nobody needs. Set limits: use AI for defined tasks, then close it and do the work. The goal is more time for what matters: people, rest and meaningful work.

### Share with family and colleagues

When you find a workflow that helps, teach it to others: show a colleague your meeting-notes routine, help your parents with voice questions, share prompt templates with your team. Helping others use AI well multiplies its benefit and makes you known as someone who makes work easier.
      `,
        [
          q('Which tasks are the best candidates for AI help?', [
            'Tasks you enjoy and do rarely',
            'Repetitive, time-consuming or difficult tasks',
            'Tasks that need no thought at all',
            'Only tasks involving images',
          ], 1, 'Repetitive and time-consuming work gives AI the most room to save effort.'),
          q('Why review your AI workflow after a month?', [
            'AI tools stop working after a month',
            'Reviews are required by law',
            'To add as many tools as possible',
            'To keep what helps and drop what does not',
          ], 3, 'Reflection shows where AI truly saves time and where it wastes it.'),
          q('Why keep practising skills yourself?', [
            'Unpractised skills fade, and you still need them',
            'AI tools require regular practice sessions',
            'It makes AI answers arrive faster',
            'Employers ban AI completely at work',
          ], 0, 'Exams, interviews and many situations still depend on your own abilities.'),
        ]
      ),
      lesson('Evaluating New AI Tools', 12, `
New AI tools launch constantly, each promising to transform how you work. Many are useful; many are short-lived, overpriced or unsafe. A quick, sensible evaluation process helps you adopt the good ones and ignore the rest.

### A simple evaluation checklist

| Question | Why it matters |
|---|---|
| What problem does it solve for me? | Tools without a clear use waste time |
| Can my current tools already do this? | Avoid duplicate subscriptions |
| Who makes it? | Established, identifiable companies are more accountable |
| What happens to my data? | Privacy policies vary widely |
| How much does it really cost? | Check pricing, limits and renewal terms |
| Does it work in my language and in Pakistan? | Availability and language support differ |
| What do trustworthy reviews say? | Independent opinions reveal real-world quality |
| Can I leave easily? | Export your data; avoid lock-in |

### Test with a real task

Instead of watching demos, try the tool on an actual task you need to do this week. Compare the result with your current approach:

\`\`\`text
Task: create 5 Instagram posts for next week
Current way: chatbot plus Canva, 45 minutes
New tool:    ?? minutes, quality ??
\`\`\`

If it is not clearly better, faster or cheaper, it is not worth switching.

### Red flags

- Unclear company identity or contact information.
- Requests for unnecessary permissions, such as access to all your contacts or files.
- Pressure tactics: "Only 2 spots left at this price!"
- Promises that sound too good: "Earn Rs 500,000 a month with this AI tool."
- No privacy policy, or one that allows selling your data.
- Apps imitating the names and logos of well-known tools (chapter 1).

"AI money-making" schemes promoted on social media, promising easy income from AI-generated content or trading bots, are frequently scams or wildly exaggerated. Be especially cautious with anything asking for upfront payment.

### Free trials

Free trials are useful, but many require card details and convert to paid plans automatically. Set a reminder before the trial ends, and cancel if you are not convinced. Check whether cancelling is easy before you sign up.

### Business tools

For businesses, evaluation adds questions:

- Does the tool meet our data protection and confidentiality needs?
- Does it integrate with the systems we already use?
- What support is available when something goes wrong?
- What happens to our data if the company closes?

Start with a small pilot, measure results, then decide.

### Stay open, stay critical

Genuine breakthroughs do appear, and ignoring all new tools means missing real improvements. Balance curiosity with scepticism: try promising tools on real tasks, keep what clearly helps, and let the rest go.
      `,
        [
          q('What is the best way to test a new AI tool?', [
            'Watch its advertising video',
            'Read only its homepage',
            'Try it on a real task you need to do',
            'Subscribe to the most expensive plan',
          ], 2, 'Real tasks show whether a tool is actually better than your current approach.'),
          q('Which is a red flag for an AI tool?', [
            'Promises of huge easy income for an upfront fee',
            'A clear privacy policy',
            'An identifiable company with contact details',
            'A free plan with limits',
          ], 0, 'Get-rich-quick claims with upfront payments are common scam patterns.'),
          q('What should you do when starting a free trial that needs card details?', [
            'Forget about it until the charge appears',
            'Set a reminder before it converts to a paid plan',
            'Share the card with family',
            'Start trials for every tool at once',
          ], 1, 'Trials often auto-renew, so reminders prevent unwanted charges.'),
        ]
      ),
      lesson('Careers and Skills in an AI World', 13, `
AI is changing work in every field, from offices and classrooms to shops and studios. Some tasks are being automated; many jobs are changing; new roles are appearing. The people who thrive are those who learn to work with AI, while developing the human skills AI cannot replace.

### How work is changing

| Change | Example |
|---|---|
| Routine tasks automated | Basic data entry, simple translations, standard reports |
| Jobs reshaped | Marketers spend less time writing drafts, more on strategy and analysis |
| Productivity expected to rise | Employers expect faster output from AI-assisted staff |
| New roles | AI trainers, prompt specialists, AI product managers, automation specialists |
| Skills in higher demand | Judgement, communication, domain expertise, AI literacy |

The common pattern is not that AI replaces people entirely, but that people who use AI well are increasingly preferred over those who do not.

### Skills that grow in value

**AI literacy**: knowing what AI can and cannot do, prompting effectively, checking outputs and using AI responsibly. This course builds exactly this foundation.

**Critical thinking**: evaluating information, spotting errors and making good decisions, essential when AI produces confident but sometimes wrong outputs.

**Communication**: explaining ideas clearly, persuading, listening and building relationships. AI can draft words, but trust between people is built by people.

**Domain expertise**: deep knowledge of a field, such as accounting, medicine, law, agriculture or teaching. AI is most powerful in the hands of someone who knows the subject and can judge the output.

**Creativity and problem-solving**: finding new approaches, connecting ideas and adapting to unfamiliar situations.

**Adaptability**: learning new tools and ways of working continuously.

### Opportunities in Pakistan

- **Freelancing**: AI-assisted writing, design, marketing, video editing and virtual assistance for international clients (chapter 8).
- **Local businesses**: helping shops, clinics, schools and companies adopt AI tools, a growing need.
- **Training**: teaching others to use AI safely and effectively.
- **Technical careers**: for those interested in going deeper, AI engineering, data science and automation, covered in other Cortexis courses.
- **Every profession**: teachers, accountants, doctors and lawyers who use AI well can serve more people and deliver better work.

### Showing AI skills to employers

\`\`\`text
- Mention specific AI-assisted achievements on your CV:
  "Reduced weekly reporting time by 60% using AI-assisted spreadsheet automation."
- Build a small portfolio: automations, templates, projects.
- Be ready to discuss how you check AI outputs and protect data.
- Show responsible use, not just enthusiasm.
\`\`\`

Employers value people who use AI to deliver results safely, not those who simply claim to "know AI".

### A realistic outlook

AI will change many jobs, and some roles will shrink. The best response is neither fear nor hype but preparation: build AI literacy, deepen your expertise, strengthen human skills and keep learning. These choices are within your control, and they make you valuable in any future.
      `,
        [
          q('Which skill grows in value as AI spreads?', [
            'Memorising large amounts of text',
            'Typing faster than others',
            'Avoiding new technology',
            'Critical thinking to evaluate information and outputs',
          ], 3, 'Judging AI outputs and making good decisions become more important as AI produces more.'),
          q('How should you show AI skills on a CV?', [
            'Simply write "expert in AI"',
            'Describe specific results achieved with AI, used responsibly',
            'List every AI tool you have heard of',
            'Avoid mentioning AI at all',
          ], 1, 'Concrete, responsible achievements convince employers more than general claims.'),
          q('What is the most common pattern in how AI affects jobs?', [
            'Every job disappears within a year',
            'Nothing changes at all',
            'People who use AI well are preferred over those who do not',
            'Only technical jobs are affected',
          ], 2, 'AI reshapes work across fields, rewarding those who adapt.'),
        ]
      ),
      lesson('Staying Current Without Overwhelm', 13, `
AI changes so quickly that it can feel impossible to keep up. New models, tools and features appear every week, and social media is full of claims that everything has changed again. Staying informed is useful, but trying to follow everything leads to stress and wasted time. A calm, sustainable approach works better.

### You do not need to know everything

Most announcements do not affect your daily work. What matters is whether your tools become meaningfully better for your tasks. Focus on:

- Updates to the few tools you actually use.
- Major new capabilities relevant to your work or studies.
- Important safety and privacy changes.

Ignore the rest without guilt.

### A light routine

| Frequency | Activity |
|---|---|
| Weekly | Skim one or two trusted newsletters or sources |
| Monthly | Try one new feature or tool on a real task |
| Quarterly | Review your workflow and subscriptions (first lesson of this chapter) |
| Yearly | Take a course or deeper learning step |

Fifteen minutes a week is enough to stay reasonably informed.

### Choose trusted sources

Prefer sources that explain carefully rather than hype:

- Official blogs and announcement pages of the tools you use.
- Reputable technology journalists and newsletters.
- Educators and professionals in your field who share practical uses.
- Communities of practice: colleagues and groups discussing real experiences.

Be wary of accounts that claim every update "changes everything" or push paid courses promising overnight success.

### Learn by doing

Reading about AI teaches less than using it. When you hear about a useful capability, try it on a real task the same week. Practical experience helps you judge what is genuinely useful.

### Learn with others

Share discoveries with colleagues, classmates, friends or family. Set up a small group chat where people share useful prompts and tools. Explaining what you learned deepens understanding, and others' experiences reveal uses you might not have found.

### Protect your wellbeing

Constant change can create anxiety about falling behind or about AI's effect on jobs. Remember:

- The fundamentals you learned, clear prompting, checking outputs, protecting privacy and thinking critically, stay relevant even as tools change.
- Human skills, relationships and expertise remain valuable.
- Learning steadily is enough; nobody knows everything.

### Your next steps

\`\`\`text
1. Choose your main AI tool and set up custom instructions.
2. Build five prompt templates for your most common tasks.
3. Automate or speed up one weekly task this month.
4. Teach one person something useful you learned in this course.
5. Explore a deeper Cortexis course if a topic interested you.
\`\`\`

You now have the foundation to use AI confidently, safely and effectively. The tools will keep changing, but the habits you have built, clarity, checking, honesty and continuous learning, will keep serving you well.
      `,
        [
          q('Which AI news should you focus on?', [
            'Updates to tools you actually use and relevant new capabilities',
            'Every announcement from every company',
            'Only social media rumours',
            'Nothing, ever',
          ], 0, 'Focusing on what affects your work avoids overwhelm while keeping you informed.'),
          q('What is the best way to judge whether a new capability is useful?', [
            'Read many opinions about it',
            'Try it on a real task the same week',
            'Wait several years',
            'Buy an expensive course about it',
          ], 1, 'Hands-on use reveals practical value better than reading.'),
          q('Which fundamentals stay relevant as AI tools change?', [
            'Knowing each tool\'s exact button layout',
            'Memorising every model\'s version number',
            'Following every AI influencer online',
            'Clear prompting and checking outputs',
          ], 3, 'Core habits transfer across tools, even as specific products change.'),
        ]
      ),
      ],
      [
      q('What makes a personal AI workflow effective?', [
        'Using as many tools as possible',
        'Letting AI do all your thinking',
        'A few tools assigned to regular tasks, with habits and reviews',
        'Changing tools every day',
      ], 2, 'Consistent routines with a small set of tools build lasting benefits.'),
      q('Which question matters most before adopting a new AI tool?', [
        'What problem does it solve for me?',
        'How colourful is its logo?',
        'How many followers does it have?',
        'Is it the newest tool this week?',
      ], 0, 'A clear use case prevents wasted time and money.'),
      q('Which combination makes people most valuable in an AI world?', [
        'Avoiding AI entirely',
        'Relying on AI for all decisions',
        'Knowing tool names without using them',
        'AI literacy plus domain expertise and human skills',
      ], 3, 'Using AI well within a field of expertise, with strong human skills, is highly valued.'),
      q('How much time is enough to stay reasonably current on AI?', [
        'Several hours every day',
        'Around fifteen minutes a week with trusted sources',
        'Nothing, since tools never change',
        'Only once every five years',
      ], 1, 'A light, steady routine keeps you informed without overwhelm.'),
      ]
    ),
  ],
  final: [
    q('What does generative AI do?', [
      'Stores all your files',
      'Creates new content from patterns it learned',
      'Replaces your operating system',
      'Only copies web pages',
    ], 1, 'Generative AI produces new text, images and other content from learned patterns.'),
    q('What is an AI hallucination?', [
      'A slow response',
      'A refused request',
      'A reminder to rest',
      'A confident but false answer',
    ], 3, 'Chatbots can state incorrect information as if it were true.'),
    q('Which prompt is most likely to get a useful result?', [
      'One with a clear task, context, format and tone',
      'A single vague word',
      'A prompt in capital letters',
      'The same prompt sent three times',
    ], 0, 'Specific instructions remove guesswork and produce usable output.'),
    q('What should you do when an AI answer is close but not right?', [
      'Give up and try another app',
      'Accept it as it is',
      'Ask for specific changes in a follow-up',
      'Delete your account',
    ], 2, 'Iterating with targeted feedback refines good drafts efficiently.'),
    q('What must you check before sending an AI-drafted email?', [
      'The font size',
      'The number of emojis',
      'Names, dates, amounts and tone',
      'The AI company\'s logo',
    ], 2, 'Drafts can contain errors or invented details.'),
    q('What should you cite in an academic assignment?', [
      'The original sources you actually read',
      'The chatbot for every fact',
      'AI-suggested references without checking',
      'Nothing if AI helped',
    ], 0, 'Citations must point to verified original sources.'),
    q('Which claim needs the most careful checking?', [
      'Party theme ideas',
      'A friendlier message tone',
      'Synonyms for "happy"',
      'A precise statistic in a business report',
    ], 3, 'Specific figures are prone to invention and carry high stakes.'),
    q('What should you remove before uploading a spreadsheet to AI?', [
      'The column headings in every sheet',
      'Sensitive data like CNIC numbers and salaries',
      'Every number in the whole file',
      'The names of each worksheet',
    ], 1, 'Personal and confidential data should not be shared without approval.'),
    q('What must happen before recording a meeting for AI notes?', [
      'Participants are informed and rules are followed',
      'Microphones are muted',
      'The meeting is kept secret',
      'Nothing at all',
    ], 0, 'Consent and organisational rules apply to recording people.'),
    q('When should a realistic AI image be labelled?', [
      'Never, labels reduce engagement',
      'Only for cartoon-style images',
      'When it could be mistaken for a real photo',
      'Only when the image is printed',
    ], 2, 'Disclosure prevents audiences being misled.'),
    q('What is the healthiest way for students to use AI?', [
      'Letting it write every assignment',
      'For explanations and feedback, thinking themselves',
      'Using it secretly during exams',
      'Hiding its use against school rules',
    ], 1, 'Support that keeps thinking in the student\'s hands builds real skills.'),
    q('What keeps small business marketing trustworthy?', [
      'Exaggerated claims',
      'AI-generated product photos',
      'Copying competitors\' posts',
      'Real products and honest details',
    ], 3, 'Customers trust genuine photos, prices and voices.'),
    q('What should a freelancer do if a client prohibits AI?', [
      'Use it secretly',
      'Ignore the contract',
      'Raise prices silently',
      'Respect the rule and discuss questions openly',
    ], 3, 'Honesty and contract compliance protect reputation and relationships.'),
    q('What should you do before running an AI-written script on important files?', [
      'Back up the files and test on a small sample',
      'Run it on everything immediately',
      'Share it publicly first',
      'Delete the originals',
    ], 0, 'Backups and small tests prevent damage from faulty code.'),
    q('Why should customer-facing AI automations start by creating drafts?', [
      'Drafts are required by every tool',
      'Automated emails are illegal',
      'AI steps can make mistakes that humans should catch',
      'Drafts cost less',
    ], 2, 'Human review catches errors until automations prove reliable.'),
    q('Which information should never be shared with an AI chatbot?', [
      'A question about recipes',
      'A one-time banking code',
      'A public social post draft',
      'A request for study tips',
    ], 1, 'Codes and passwords grant direct access to accounts.'),
    q('A caller sounding like a relative urgently needs money. What should you do?', [
      'Hang up and call them back on their known number',
      'Transfer money quickly',
      'Share your bank details',
      'Ask for their account number',
    ], 0, 'Verifying through a known number defeats voice-clone scams.'),
    q('Why add "Answer for Pakistan only" to questions about procedures?', [
      'It makes answers shorter',
      'AI requires a country',
      'It unlocks paid features',
      'It reduces confusion with other countries\' systems',
    ], 3, 'Specifying Pakistan helps avoid mixed-up rules and terms.'),
    q('What makes a personal AI workflow effective?', [
      'Using every new tool',
      'A few tools assigned to regular tasks with reviews',
      'Letting AI decide everything',
      'Changing tools daily',
    ], 1, 'Consistent habits with a small set of tools build lasting benefit.'),
    q('Which combination makes people most valuable in an AI world?', [
      'Avoiding AI completely',
      'Relying on AI for all decisions',
      'AI literacy with expertise and human skills',
      'Knowing tool names only',
    ], 2, 'Skilled, responsible AI use within a field of expertise is highly valued.'),
  ],
});
