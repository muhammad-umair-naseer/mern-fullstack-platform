import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'business-english-communication',
  title: 'Business English & Communication',
  category: 'Business',
  level: 'Beginner → Intermediate',
  duration: '6 weeks',
  accent: 'sky',
  coverKey: 'business-english-communication',
  summary:
    'Speak and write English at work with confidence: clear pronunciation, small talk, calls, meetings, presentations, emails, reports, negotiation, interviews and customer service, built for learners in Pakistan and South Asia.',
  description:
    'This course is for people whose English works but does not yet feel confident at work. You start by fixing the grammar slips and sounds that Urdu speakers often carry into English, then practise the everyday conversations of an office: introductions, small talk, asking for help and giving instructions. You learn to handle phone and video calls, join and run meetings, disagree politely and give short presentations that describe numbers clearly. On the writing side you shape emails and chat messages with the right tone, avoid outdated phrases, and write short reports, minutes, requests and apologies. You then practise persuasion and negotiation, answer interview questions and talk about salary, serve customers in English and work across cultures. The course closes with a 30-day practice plan you can follow on your own.',
  chapters: [
    chapter(
      'Foundations of Confident Workplace English',
      'Find out where your business English stands, learn why plain English beats fancy English at work, fix the grammar slips Urdu speakers often carry over, and start a personal word bank you will use every day.',
      [
      lesson('Where Your Business English Stands Today', 12, `
Most people who join this course already use English at work. You read emails, you follow meetings, you can explain your job. What is missing is confidence: the feeling that you can speak without rehearsing every sentence in your head first. The first step is an honest look at where you stand, so you spend practice time on the right things.

### Four skills, not one

Business English is really four skills, and most people are uneven across them.

| Skill | What it looks like at work | Common sign of weakness |
|---|---|---|
| Listening | Following a fast meeting or a client call | Nodding along, then asking a colleague later what was decided |
| Speaking | Giving an update, asking a question, disagreeing | Staying silent even when you have a useful point |
| Reading | Understanding emails, policies, reports | Reading the same paragraph three times |
| Writing | Emails, chat messages, short reports | Copying old emails because starting fresh feels risky |

A typical pattern for learners in Pakistan is strong reading, decent writing, and weaker speaking and listening. School exams rewarded reading and writing, while spoken English was often practised only in a few settings. That is normal, and it is fixable.

### A quick self-check

Rate yourself from 1 (very hard) to 5 (easy) on each statement. Be honest; nobody else will see it.

\`\`\`text
1. I can introduce myself and my role to a new client in English.
2. I can follow a 30-minute meeting in English without losing the thread.
3. I can say "I disagree" politely in a meeting.
4. I can write a clear email asking for something in under 10 minutes.
5. I can explain a delay to my manager without switching to Urdu.
6. I can answer an unexpected question on a call without long silences.
7. I understand colleagues or clients with accents different from mine.
8. I can check my own email for mistakes before I send it.
\`\`\`

Any statement you scored 1 or 2 is a priority. Write those down. They become the focus of your practice in later chapters.

### Notice where you switch languages

Many professionals in Lahore, Karachi or Islamabad mix English and Urdu all day, and that is fine in many offices. Code switching only becomes a problem when you switch because you cannot find the English, especially with clients or colleagues who do not speak Urdu. For one working day, keep a small note on your phone. Each time you switch to Urdu because the English would not come, write the idea you were trying to express.

\`\`\`text
Wanted to say: "Is kaam ko thora aage kar dein" (push this work back a bit)
English: "Can we push this back to Thursday?"
\`\`\`

After a few days you will see patterns. Usually it is the same small set of situations: requesting more time, saying no, correcting someone, or asking a question in front of seniors.

### Set a realistic goal

Avoid goals like "become fluent". They are too vague to act on. A useful goal names a situation and a behaviour.

| Vague goal | Useful goal |
|---|---|
| Improve my English | Give my weekly update in English without notes by the end of next month |
| Speak more confidently | Ask at least one question in every team meeting |
| Write better emails | Send client emails without asking a colleague to check them first |

Pick one speaking goal and one writing goal. Keep them visible, on a sticky note or as your phone wallpaper.

### Accent is not the target

You do not need a British or American accent. Clients in Dubai, London or Toronto work with people from every country every day. What matters is that you are understood the first time, that your sentences are clear, and that you sound calm. A Pakistani accent with clear sounds and good pacing is completely professional.
      `,
        [
          q('According to the self-check, what should you do with statements you scored 1 or 2?', [
            'Ignore them, since they are probably too hard to fix',
            'Treat them as priorities and focus later practice on them',
            'Ask your manager to rate you on them instead',
            'Practise them only after every other skill is perfect',
          ], 1, 'Low scores show where practice time will make the biggest difference, so they become your priorities.'),
          q('When does switching to Urdu become a problem at work?', [
            'Whenever you speak to a colleague from your own city',
            'Any time you use a single Urdu word in a meeting',
            'Only when you are writing formal emails to managers',
            'When you switch because you cannot find the English words',
          ], 3, 'Mixing languages is normal in many offices; it only hurts when it hides a gap, especially with people who do not speak Urdu.'),
          q('Which goal is the most useful by the standards of this topic?', [
            'Become fluent in English as quickly as I can',
            'Sound exactly like a native British speaker',
            'Ask at least one question in every team meeting',
            'Improve my overall English level this year',
          ], 2, 'A useful goal names a specific situation and a behaviour you can check, which this one does.'),
        ]
      ),
      lesson('Plain English Over Fancy English', 12, `
Many of us were taught that good English means long words and formal phrases. At work, the opposite is usually true. The best business English is plain: short sentences, common words, and the main point first. Plain English is faster to read, harder to misunderstand, and it sounds more confident, not less.

### Why fancy English backfires

Busy readers skim. A manager in Karachi reading thirty emails before lunch, or a client in Manchester reading on a phone, wants to know what you need in the first line. Long, formal sentences slow them down and can hide your request.

| Fancy version | Plain version |
|---|---|
| I would like to bring to your kind notice that the shipment has been delayed. | The shipment is delayed. |
| Please do the needful at your earliest convenience. | Please send the signed form by Friday. |
| We are in receipt of your esteemed letter. | Thank you for your letter. |
| It is requested that the meeting may kindly be rescheduled. | Can we move the meeting to Tuesday? |
| In view of the fact that | Because |

The plain versions are not rude. They are clear, and clarity is a form of respect for the reader's time.

### Phrases to retire

Some phrases are common in South Asian offices but sound old fashioned or confusing to international readers. You will meet more of these in the email chapter; for now, notice these few in your speaking too.

\`\`\`text
"Do the needful"           -> say exactly what you need done
"Revert back"              -> "reply" (revert means go back to an earlier state)
"Kindly"                   -> "please" in most cases
"Prepone"                  -> "bring forward" or "move earlier"
"Out of station"           -> "away", "travelling" or "out of the office"
\`\`\`

"Prepone" and "out of station" are understood across Pakistan and India but often confuse colleagues elsewhere. Use them with local teams if you like, but switch when your audience is mixed.

### Three rules for plain English

**1. Main point first.** Start with the request, the answer or the decision. Background comes after.

\`\`\`text
Before: As you know, the vendor in Faisalabad had some issues with the dye
        batch last week, and after several discussions with their team...
After:  The fabric order will arrive five days late. The vendor had a problem
        with the dye batch and has promised delivery by the 18th.
\`\`\`

**2. One idea per sentence.** If a sentence has three "and"s, split it.

**3. Choose the short word.** "Use" not "utilise". "Help" not "facilitate". "Start" not "commence". "Buy" not "procure", unless your company really uses "procurement" as a department name.

### Plain does not mean casual

Plain English still uses full sentences, correct grammar and polite words. It just removes padding. "Please send the report by 3 pm" is plain and polite. "Send report asap" is plain but abrupt. "It would be highly appreciated if the report could be sent at the earliest" is polite but padded. Aim for the first.

### A quick drill

Take the last three emails you wrote. For each one, try to cut the word count by a third without losing any facts. Ask yourself:

| Question | Action |
|---|---|
| Is my main point in the first two lines? | Move it up if not |
| Did I use a long word where a short one works? | Swap it |
| Are any sentences over 25 words? | Split them |
| Did I use a phrase only because it sounds formal? | Remove or replace it |

Do the same with spoken updates. Before your next meeting, say your update aloud in three short sentences: what is done, what is next, and what you need. You will sound more senior, not less.
      `,
        [
          q('Why does plain English usually work better than fancy English at work?', [
            'It is the only style that international clients will accept',
            'Busy readers can find the main point faster and misread less',
            'Formal phrases are now banned in most companies',
            'It lets you avoid using polite words with seniors',
          ], 1, 'Readers skim, so short sentences with the main point first are quicker to read and harder to misunderstand.'),
          q('What is the problem with writing "revert back" to mean reply?', [
            'It is too informal for a message to your manager',
            'It is a phrase used only in American offices',
            'It makes the email much longer than it needs to be',
            'Revert means return to an earlier state, not reply',
          ], 3, 'Many international readers understand revert as going back to a previous state, so "reply" is clearer.'),
          q('Which update follows the main-point-first rule best?', [
            'The fabric order will arrive five days late because of a dye problem.',
            'As you know, the vendor has had some issues over the last week.',
            'After several long discussions with the vendor team, it appears that...',
            'I would like to bring to your kind notice a matter about the vendor.',
          ], 0, 'It states the outcome the reader cares about in the first sentence, then gives the reason.'),
        ]
      ),
      lesson('Fixing Common Urdu-Speaker Grammar Slips', 14, `
Every language leaves fingerprints on the next one you learn. Urdu and Punjabi speakers tend to make a small, predictable set of English grammar slips. The good news is that because the set is small, fixing a handful of patterns makes a big difference to how polished you sound.

### Why these slips happen

Urdu grammar differs from English in a few key ways: the verb usually comes at the end, questions are often formed just by tone, there are no articles like "a" and "the", and some tenses map differently. When you translate in your head, those Urdu patterns slip into your English.

### The most common slips

| Slip | Correct | Why |
|---|---|---|
| I am having two brothers. | I have two brothers. | "Have" for possession is not used in the continuous form |
| He is knowing the answer. | He knows the answer. | Know, understand, want, need are usually not used with -ing |
| I am working here since 2021. | I have been working here since 2021. | "Since" and "for" need the present perfect |
| Where you are going? | Where are you going? | English questions swap the subject and verb |
| He told that he is late. | He said that he was late. | "Tell" needs a person: he told me |
| I did not went. | I did not go. | After "did", use the base verb |
| She is coming tomorrow, isn't it? | She is coming tomorrow, isn't she? | The tag must match the subject and verb |
| Myself Ali from accounts. | I am Ali from accounts. | "Myself" is not a way to introduce yourself |

### Articles: a, an and the

Because Urdu has no articles, they are often dropped or overused. A simple working rule:

\`\`\`text
a / an  -> one thing, mentioned for the first time, not specific
           "We need a new printer."
the     -> a specific thing both people know about
           "The printer on the second floor is broken."
nothing -> general plural or uncountable ideas
           "Printers are expensive."  "Information is attached."
\`\`\`

Watch out for uncountable nouns that Urdu speakers often pluralise: information, advice, equipment, furniture, feedback, luggage. Say "some information", "a piece of advice", "your feedback", never "informations" or "advices".

### "Only" and "itself"

Translating "hi" and "hee" can create odd English.

| Urdu-influenced | Natural English |
|---|---|
| I will do it today only. | I will do it today. |
| We discussed it in the meeting itself. | We discussed it during the meeting. |
| He is only like that. | That is just how he is. |

In international English, "only" limits something, so "I will send it today only" sounds like a time limit, the way a shop sign says "Sale today only". If you mean "definitely today", say "I will send it today" or "I will send it before 5 pm".

### Prepositions that trip people up

\`\`\`text
discuss the plan          (not "discuss about the plan")
married to someone        (not "married with")
reply to an email         (not "reply the email")
on Monday, in March, at 3 pm
good at Excel             (not "good in Excel")
\`\`\`

### How to fix slips without freezing

Trying to fix everything at once makes people afraid to speak. Use this method instead:

1. **Pick two slips per week** from the table that you know you make.
2. **Write five correct sentences** using each pattern about your own job.
3. **Say them aloud** daily until they feel natural.
4. **Listen for them** in your own speech during meetings. When you catch one, simply say the correct version and carry on: "I am working here, sorry, I have been working here since 2021." Self-correction sounds professional.

### A drill to start now

Correct these, then check the table above.

\`\`\`text
1. Kindly discuss about this with your team.
2. Where the meeting is happening?
3. I am wanting to request one leave.
4. He is working with us from three years.
\`\`\`

Answers: Please discuss this with your team. Where is the meeting? I would like to request a day off. He has been working with us for three years.
      `,
        [
          q('Which sentence is correct?', [
            'I am working here since 2021.',
            'I am work here since 2021.',
            'I working here since 2021.',
            'I have been working here since 2021.',
          ], 3, 'Actions that started in the past and continue now, with "since" or "for", need the present perfect.'),
          q('Which noun should never be made plural with an "s"?', [
            'Report',
            'Meeting',
            'Equipment',
            'Invoice',
          ], 2, 'Equipment is uncountable, like information, advice and feedback, so it has no plural form.'),
          q('What is the recommended way to handle a grammar slip you notice while speaking?', [
            'Stop talking and apologise for your English',
            'Say the correct version briefly and carry on',
            'Switch to Urdu so the point is not lost',
            'Ignore it and avoid that pattern in future',
          ], 1, 'A quick self-correction keeps the conversation moving and sounds professional rather than nervous.'),
        ]
      ),
      lesson('Building a Workplace Word Bank', 12, `
Vocabulary is the raw material of confident English. You do not need thousands of rare words. You need a few hundred words and phrases that come up in your own job, ready to use without searching your memory. A personal word bank is the simplest way to build that.

### What a word bank is

A word bank is a list you keep, on paper, in a notes app or in a spreadsheet, of useful words and phrases you meet at work. The key difference from a dictionary is that every entry includes a real sentence from your own context.

| Word or phrase | Meaning | My sentence |
|---|---|---|
| follow up | check on something later | I will follow up with the vendor on Thursday. |
| on track | going as planned | The audit is on track for the end of the month. |
| bottleneck | a step that slows everything else | Approvals from head office are the bottleneck. |
| touch base | have a short conversation | Can we touch base after lunch? |
| heads-up | early warning | Just a heads-up, the client may call today. |

The "my sentence" column is what makes the word yours. A word you have only read stays passive. A word you have used in a sentence about your own work becomes active.

### Collect phrases, not single words

English at work runs on fixed phrases, groups of words that native speakers use together. Learning the whole phrase saves you from translating word by word.

\`\`\`text
Requests:       "Could you possibly...", "Would it be possible to..."
Updates:        "Just to update you,...", "Quick update on..."
Agreeing:       "That makes sense.", "Fair point."
Delays:         "We are running a bit behind on...", "This may slip to..."
Checking:       "Just to confirm,...", "Am I right in thinking...?"
Closing:        "Let me know if you need anything else."
\`\`\`

### Where to find words for your bank

- **Emails from senior colleagues or clients** whose writing you admire. Note phrases you would not have thought of.
- **Meetings.** When someone says something neatly, write it down afterwards.
- **Your industry.** A bank employee in Karachi needs words like reconciliation, overdraft and compliance. A textile exporter in Faisalabad needs lead time, shipment and quality inspection. A software house in Lahore needs sprint, deployment and backlog.
- **Job adverts in your field.** They show which words employers use to describe your work.

### A simple weekly routine

| Day | Action | Time |
|---|---|---|
| Daily | Add one to three new words or phrases with your own sentence | 5 minutes |
| Friday | Read through the week's entries aloud | 10 minutes |
| Friday | Pick three and plan where you will use them next week | 5 minutes |
| Monthly | Delete entries you now use without thinking | 10 minutes |

Using new words deliberately is the step people skip. If you added "bottleneck" this week, plan to say it in Monday's meeting. Once you have used a word three times in real situations, it usually stays.

### Words that are false friends in South Asian English

Some English words have taken a local meaning that confuses outsiders. Add the international version to your bank.

| Local use | International alternative |
|---|---|
| "Please do one thing" | "Could you please..." |
| "I have a doubt" (meaning a question) | "I have a question" |
| "Pass out" (graduate) | "graduate" |
| "Cousin brother" | "cousin" |
| "Timepass" | "killing time" or simply "a break" |

"I have a doubt" is very common. To many international listeners, doubt means you do not believe something, so "I have a doubt about the figures" may sound like an accusation when you only meant a question.

### Keep it small and alive

A word bank of 40 phrases you actually use is worth more than a list of 500 you never look at. Review, use, and prune. Over a few months you will notice that you search for words less often, and that is exactly the confidence this course is building.
      `,
        [
          q('What makes a word bank entry more useful than a dictionary entry?', [
            'It includes the word\'s origin and spelling history',
            'It lists every possible meaning of the word',
            'It includes a real sentence from your own work',
            'It is written in both English and formal Urdu',
          ], 2, 'Writing your own sentence about your work turns a word you recognise into one you can actually use.'),
          q('Why can "I have a doubt about the figures" cause a problem?', [
            'It is too long for a professional email or meeting',
            'It is grammatically incorrect in all English varieties',
            'It sounds far too casual for a meeting with clients',
            'Doubt can sound like you do not believe the figures',
          ], 3, 'Internationally, doubt suggests disbelief, so "I have a question" avoids sounding like an accusation.'),
          q('What is the step people most often skip when building vocabulary?', [
            'Planning to use new words in real situations',
            'Writing new words down when they first hear them',
            'Looking up the meaning of unfamiliar words',
            'Reading English emails from their colleagues',
          ], 0, 'Deliberately using a new word in a meeting or email is what moves it from passive to active vocabulary.'),
        ]
      ),
      ],
      [
      q('A learner reads English reports easily but stays silent in meetings. What pattern does this match?', [
        'Weak reading and strong speaking skills',
        'A problem that only an accent course can solve',
        'Equal strength across all four language skills',
        'Strong reading with weaker speaking and listening',
      ], 3, 'School exams rewarded reading and writing, so many learners are stronger there than in speaking and listening.'),
      q('Which is the best plain English version of "Please do the needful at your earliest convenience"?', [
        'Do it fast.',
        'Please send the signed form by Friday.',
        'Kindly revert back with the needful.',
        'It is requested that action may be taken.',
      ], 1, 'The plain version says exactly what is needed and by when, while staying polite.'),
      q('Which question is grammatically correct?', [
        'Where are you going after the meeting?',
        'Where you are going after the meeting?',
        'Where you going after the meeting?',
        'Where are going you after the meeting?',
      ], 0, 'English questions put the auxiliary verb before the subject: where are you going.'),
      q('How large should a useful word bank be?', [
        'At least 500 words before it becomes useful',
        'Exactly 100 words, refreshed every month',
        'Small enough that you review and use every entry',
        'As large as possible, with no entries deleted',
      ], 2, 'A small list you actively use beats a long list you never look at, so review, use and prune.'),
      ]
    ),
    chapter(
      'Pronunciation and Clarity',
      'Work on the sounds Urdu speakers often mix up, use word and sentence stress to sound clear, control your pace and fillers, and learn simple habits that get you understood the first time.',
      [
      lesson('Sounds Urdu Speakers Often Mix Up', 13, `
You do not need to lose your accent to be clear. You only need to fix the few sounds that change meaning or make listeners work too hard. For Urdu and Punjabi speakers, a short list of sound pairs causes most of the confusion on calls and in meetings.

### Why some sounds are hard

Every language uses a set of sounds. When English has a sound that Urdu does not, or Urdu treats two English sounds as one, your mouth falls back on the nearest familiar sound. The listener then hears a different word, or has to guess from context.

### The main pairs to practise

| Pair | Example words | What often happens |
|---|---|---|
| V and W | vest / west, vine / wine | Both said with the same sound, somewhere in between |
| F and P | fan / pan, full / pull | F softened towards a P sound in some speakers |
| TH and T or D | thin / tin, they / day | TH replaced by a hard T or D |
| Short I and long EE | ship / sheep, live / leave | The two vowels merge |
| S and SH | sell / shell | Usually fine, but watch "she sells" in fast speech |
| Z and J | zero / jero, zone / jone | Z replaced by J in some regional accents |

You do not need all of these at once. Ask a friend or record yourself to find the two or three that affect you most.

### How to make each sound

**V and W.** For V, touch your top teeth lightly to your bottom lip and push air so it buzzes. For W, round your lips like you are about to whistle and keep your teeth away from your lip. Practise in pairs:

\`\`\`text
vest  -  west
vine  -  wine
very  -  worry
vet   -  wet
\`\`\`

The test: put a finger on your lower lip. For V you should feel your teeth. For W you should not.

**TH.** Put the tip of your tongue lightly between your teeth and blow. "Thin" has no voice; "this" has a buzz. Many clear international speakers use a soft T or D here, and that is usually understood, so treat TH as lower priority unless it causes confusion.

**Short I and long EE.** "Ship" is short and relaxed. "Sheep" is longer, with your lips spread like a small smile. This pair matters at work because of words like:

\`\`\`text
live (stay) / leave (go)       "I live in Rawalpindi." / "I leave at six."
fill / feel                    "Please fill the form." / "I feel it is too late."
sit / seat                     "Please sit." / "Your seat is 14A."
\`\`\`

### Silent letters and spelling traps

Urdu is largely written as it sounds, so English spelling can mislead you into pronouncing letters that are silent.

| Word | Common mistake | Natural |
|---|---|---|
| receipt | re-seept with a P | re-SEET |
| debt | debt with a B | DET |
| Wednesday | Wed-nes-day | WENZ-day |
| comfortable | com-for-table | KUMF-ta-bul |
| suite (hotel) | suit | SWEET |
| schedule | not a mistake: two accepted forms | SHED-yool (UK) or SKED-jool (US) |

### Adding vowels at the start

Many speakers add a short vowel before words that begin with S plus another consonant: "istation", "ischool", "isport". Practise by hissing the S first and gliding into the word: "sss-tation", "sss-chool". Slow it down, then speed up.

### A five-minute daily drill

1. Pick one pair from the table.
2. Say ten word pairs slowly, then in short sentences.
3. Record yourself on your phone.
4. Listen back the next day, when your ear is fresh.

\`\`\`text
Monday:    V / W   "We value our vendors very well."
Tuesday:   I / EE  "Please fill the sheet and leave it on my seat."
Wednesday: Z / J   "The zone manager joined at zero hour."
\`\`\`

Small, regular practice works better than one long session. Most people notice a change in a few weeks, and colleagues stop asking them to repeat themselves.
      `,
        [
          q('How can you check that you are making a V sound rather than a W?', [
            'Your lips should be fully rounded with no teeth showing',
            'Your tongue should touch the roof of your mouth',
            'Your top teeth should touch your lower lip',
            'You should say the word without any voice at all',
          ], 2, 'V is made with the top teeth on the lower lip, while W uses rounded lips and no teeth contact.'),
          q('Which word pair shows the short I and long EE difference?', [
            'live and leave',
            'vest and west',
            'thin and tin',
            'fan and pan',
          ], 0, 'Live has a short relaxed vowel and leave has a longer spread vowel, so they are the I and EE pair.'),
          q('Why is TH treated as a lower priority than some other sounds?', [
            'Because English speakers never use the TH sound at work',
            'A soft T or D in its place is usually still understood',
            'Because it is impossible for adult learners to learn it',
            'Because TH only appears in a few very rare words',
          ], 1, 'Many clear international speakers replace TH with a soft T or D, and listeners generally follow them without trouble.'),
        ]
      ),
      lesson('Word Stress and Sentence Stress', 12, `
Two people can pronounce every sound correctly and still be hard to understand. The difference is often stress: which syllable in a word is stronger, and which words in a sentence carry the weight. English depends on stress far more than Urdu does, so getting it right makes a big difference to clarity.

### Word stress

In English words with more than one syllable, one syllable is louder, longer and slightly higher. The others are weaker. If you stress the wrong syllable, listeners may not recognise the word at all, even if each sound is correct.

| Word | Stress | Common slip |
|---|---|---|
| deVELopment | second syllable | DEvelopment |
| COMpany | first syllable | comPAny |
| deTERmine | second syllable | deterMINE |
| CATegory | first syllable | caTEgory |
| apPROPriate | second syllable | approPRIate |
| PHOtograph / phoTOgraphy | changes with the word | same stress for both |
| eCOnomy / ecoNOmic | changes with the word | same stress for both |

### Stress that changes meaning

Some English words are a noun with stress on the first syllable and a verb with stress on the second.

\`\`\`text
a REcord (noun)       to reCORD (verb)
a PREsent (gift)      to preSENT (give a talk)
an INcrease (noun)    to inCREASE (verb)
a PROject (noun)      to proJECT (verb, to forecast)
\`\`\`

"We expect an INcrease in sales" and "We need to inCREASE sales" both sound natural when stress follows the role of the word.

### How to find word stress

Most online dictionaries, such as Cambridge or Oxford Learner's Dictionaries, show stress with a small mark before the strong syllable and have an audio button. When you add a word to your word bank, mark its stress in capital letters: "deVELopment". That habit alone fixes most problems over time.

### Sentence stress

In a sentence, English speakers stress the content words, the words that carry meaning: nouns, main verbs, adjectives, numbers and negatives. Small grammar words like "a", "the", "to", "of", "is" and "can" are said quickly and softly.

\`\`\`text
I NEED the REPORT by FRIday.
We CAN'T SHIP the ORDER until we get PAYment.
The MEETing has MOVED to THREE o'CLOCK.
\`\`\`

Many South Asian speakers give every word equal weight, which can sound flat or tiring to listen to. Others stress grammar words heavily, which can sound like emphasis where none is meant.

### Stress to show what matters

You can move stress to change the message. Same words, different meaning:

| Sentence | Meaning |
|---|---|
| I didn't say HE took the files. | Someone else took them |
| I didn't say he TOOK the files. | Maybe he borrowed them |
| I didn't say he took the FILES. | He took something else |
| I DIDN'T say he took the files. | I deny saying it |

This is useful at work. When you correct a figure on a call, stress the corrected part: "The total is fifTEEN thousand, not FIFty." That stress also helps with numbers like 15 and 50, 13 and 30, which are easy to mishear.

### Numbers: teen versus ty

\`\`\`text
thirTEEN   (13)   stress on the end, long "teen"
THIRty     (30)   stress at the start, short "ty"
\`\`\`

On calls with suppliers, banks or clients, numbers matter. If there is any doubt, say the digits separately: "fifteen, one five".

### A practice drill

Read each sentence aloud, tapping the table on every stressed syllable.

\`\`\`text
1. Our DEADline is the END of the MONTH.
2. Can you SEND me the UPdated FIGures?
3. The SHIPment from KARachi arrived on TUESday.
4. We INcreased our PRICes by a SMALL amount.
\`\`\`

Record yourself, then compare with a dictionary's audio for any words you were unsure about.
      `,
        [
          q('In the sentence "We need to increase sales", where does the stress in "increase" fall?', [
            'On the first syllable, because it is a noun here',
            'On the second syllable, because it is a verb here',
            'On both syllables equally, as with all verbs',
            'It depends only on the speaker\'s regional accent',
          ], 1, 'Increase as a verb takes stress on the second syllable, while the noun takes it on the first.'),
          q('Which kind of words usually carry stress in an English sentence?', [
            'Articles and prepositions such as a, the and of',
            'Every word in the sentence carries equal stress',
            'Only the very first and the very last words',
            'Content words such as nouns, main verbs and numbers',
          ], 3, 'Content words carry the meaning, so they are stressed while small grammar words are said lightly.'),
          q('What is the safest way to avoid confusing 15 and 50 on a call?', [
            'Say the number faster so that it sounds more confident',
            'Always round numbers to the nearest hundred',
            'Stress the ending clearly and say the digits separately',
            'Avoid mentioning any numbers on phone calls',
          ], 2, 'Clear stress on "teen" plus digits said one by one removes doubt between similar numbers.'),
        ]
      ),
      lesson('Speaking Pace, Pausing and Fillers', 12, `
Many nervous speakers talk too fast. They want to get through the sentence before someone interrupts or before they make a mistake. The result is the opposite of what they want: listeners miss words, ask them to repeat, and the speaker becomes even more nervous. Controlling pace and pauses is one of the quickest ways to sound confident.

### Why slowing down helps

When you slow down a little, three things happen. Each sound becomes clearer. You have time to choose your next word, so you make fewer grammar slips. And you sound calm, which listeners read as competence. Senior people in most organisations rarely rush.

A useful target for workplace speaking is a pace where a listener whose first language is not English could follow you comfortably. If you are unsure, record a one-minute update and listen back. If you hear words running together, slow down.

### Pausing in the right places

Pauses are not empty time. They group your words into chunks of meaning, which makes you much easier to follow.

\`\`\`text
Without pauses:
"Theclientcalledthismorningandtheywanttomovethedeliverytonextweek
becausetheirwarehouseinMultanisfull."

With pauses ( / marks a short pause):
"The client called this morning / and they want to move the delivery
to next week / because their warehouse in Multan is full."
\`\`\`

Good places to pause:

| Pause point | Example |
|---|---|
| After a time phrase | "This morning / the client called." |
| Before "because", "but", "so" | "We can do it / but not by Friday." |
| Between list items | "Sales / marketing / and finance." |
| Before an important number | "The total is / two point four million rupees." |
| After a question | Stop and let the other person answer |

### Fillers: um, uh, like, basically

Everyone uses some fillers. A few are normal. The problem is when they appear in every sentence and distract the listener. Common fillers in Pakistani offices include "basically", "actually", "like", "you know", "what to say", and repeated "so so so".

\`\`\`text
Heavy fillers:
"So basically, actually, what happened is, like, the vendor, you know,
basically didn't send the, um, invoice."

Cleaner:
"The vendor did not send the invoice."
\`\`\`

### How to reduce fillers

1. **Find your filler.** Record a two-minute explanation of your job. Count your fillers. Most people have one or two favourites.
2. **Replace it with a pause.** When you feel "basically" coming, close your mouth and pause for one breath instead. A silent pause sounds thoughtful; a filler sounds unsure.
3. **Use thinking phrases when you need time.** If you need longer than a pause, use a real phrase:

\`\`\`text
"Let me think about that for a moment."
"Good question. Give me a second."
"That is a fair point. I would say..."
\`\`\`

These buy time and sound professional.

4. **Practise short answers.** Fillers often appear when you do not know where your sentence is going. Plan the end of your point before you start: "Main point, one reason, done."

### Breathing and volume

Fast speech often comes with shallow breathing and a quiet voice. Before you speak in a meeting, take one slow breath through your nose. Speak from a full breath, slightly louder than feels natural. On video calls, low volume is a common reason people ask you to repeat yourself.

### Drill: the one-minute update

| Step | What to do |
|---|---|
| 1 | Write three bullet points about your work this week |
| 2 | Speak for one minute using only the bullets |
| 3 | Record it and count fillers and fast patches |
| 4 | Repeat, replacing fillers with pauses |
| 5 | Compare the two recordings |

Do this three times a week. Most people hear a clear difference in their second or third recording.
      `,
        [
          q('Why does speaking slightly slower often make you sound more confident?', [
            'Listeners assume slower speakers are older and senior',
            'Slower speech hides an accent completely from listeners',
            'It gives others more time to interrupt you politely',
            'Sounds are clearer and you have time to choose words',
          ], 3, 'A calmer pace improves clarity and reduces slips, and listeners read that calm as competence.'),
          q('What should you do when you feel a filler like "basically" coming?', [
            'Close your mouth and pause for one breath',
            'Say it twice so that it sounds deliberate',
            'Switch it to a different filler word',
            'Speed up so nobody notices it',
          ], 0, 'A short silent pause sounds thoughtful, while a filler makes you sound unsure.'),
          q('Which is a good place to put a short pause?', [
            'In the middle of a person\'s name or a number',
            'Before a word such as "because" or "but"',
            'Between an adjective and the noun it describes',
            'Between "the" and the word right after it',
          ], 1, 'Pausing before linking words groups your ideas into chunks of meaning that are easy to follow.'),
        ]
      ),
      lesson('Being Understood on the First Try', 12, `
Clear sounds, good stress and steady pace all serve one goal: the listener understands you the first time. This topic pulls those skills together and adds habits for real situations, such as calls with foreign clients, noisy offices and conversations where English is a second language for both sides.

### Know your listener

The same message needs different delivery for different listeners.

| Listener | What helps |
|---|---|
| Local colleague who shares your accent | Normal pace, local terms are fine |
| Client in the UK or US | Slightly slower, avoid local expressions, clear numbers |
| Colleague in the Gulf, China or Europe for whom English is also a second language | Short sentences, common words, no idioms |
| Senior leadership | Main point first, short, confident pace |

When both people speak English as a second language, simple and clear always wins. Idioms like "ballpark figure" or "touch base" may not be understood, so use plain alternatives: "rough estimate", "talk briefly".

### Spell and confirm key details

Names, emails, numbers, dates and addresses cause the most errors. Use these habits:

\`\`\`text
Spelling with words:  "That is S for Sugar, H for Hotel, A for Apple."
Email addresses:      "ali dot raza at company dot p k"
Dates:                "Tuesday the 14th of March" not just "14/3"
Money:                "Two hundred thousand rupees, that is two lakh"
Confirming:           "Just to confirm, that is 4,500 units by the 20th?"
\`\`\`

Lakh and crore are standard in Pakistan and India, but international listeners may not know them. With foreign clients, use thousands and millions: one lakh is one hundred thousand, and one crore is ten million.

The NATO alphabet (Alpha, Bravo, Charlie...) is widely understood on calls, but any clear word works as long as it is common: "B for Bombay" is fine with local suppliers.

### Check understanding without sounding rude

Do not ask "Did you understand?", which can sound like you doubt the other person. Try:

| Instead of | Try |
|---|---|
| Did you understand? | Does that make sense? |
| Are you getting me? | Is that clear, or shall I explain it another way? |
| You understood, na? | Any questions on that? |

### Rephrase, do not just repeat

If someone does not understand you, repeating the exact same sentence louder rarely helps. Change the words instead.

\`\`\`text
First try:  "We need to expedite the consignment."
Not clear.
Rephrase:   "We need to send the goods faster."
\`\`\`

If a single word is the problem, spell it or give a synonym: "invoice, the bill".

### Reduce background noise

Many offices in Pakistan are open plan, and calls often happen near traffic, generators or busy family homes. Simple fixes:

- Use wired earphones with a microphone close to your mouth.
- Move away from fans and air conditioners, which create steady noise.
- Mute when you are not speaking.
- Tell the other side if there is noise: "Sorry, there is some noise here. I will move to a quieter room."

### A checklist before an important call

\`\`\`text
[ ] I know the three points I need to make
[ ] Key numbers and names are written in front of me
[ ] I have practised any hard words aloud
[ ] I am in a quiet place with a working headset
[ ] I will confirm the key details at the end
\`\`\`

### Drill: explain your job to an outsider

Imagine a client in Malaysia whose English is good but not native. Explain in five short sentences what your department does. Avoid local terms and idioms. Then explain it again in different words, as if they did not understand the first time. This trains both clarity and rephrasing, two skills you will use on every call.
      `,
        [
          q('How should you say two lakh rupees to an international client?', [
            'Two lakh rupees, and leave it unexplained',
            'Two hundred thousand rupees',
            'Twenty thousand rupees',
            'Two million rupees',
          ], 1, 'One lakh is one hundred thousand, so two lakh is two hundred thousand, which international listeners understand.'),
          q('What should you do if a listener did not understand your sentence?', [
            'Repeat exactly the same sentence a little louder',
            'Move on and hope the meaning comes later',
            'Ask them if they understand English well enough',
            'Say the same idea again using different words',
          ], 3, 'Rephrasing with simpler words solves the problem, while repeating louder usually does not.'),
          q('Which question checks understanding most politely?', [
            'Did you understand what I said?',
            'Are you getting me or not?',
            'Does that make sense?',
            'You understood, right?',
          ], 2, '"Does that make sense?" checks the explanation rather than the listener\'s ability.'),
        ]
      ),
      ],
      [
      q('Which pair of sounds should you practise if colleagues hear "wine" when you say "vine"?', [
        'S and SH',
        'Short I and long EE',
        'TH and T',
        'V and W',
      ], 3, 'Vine and wine differ only in the V and W sounds, so that is the pair to practise.'),
      q('Which syllable carries the stress in the word "photography"?', [
        'The first syllable, pho',
        'The second syllable, to',
        'The third syllable, gra',
        'The last syllable, phy',
      ], 1, 'The stress moves to the second syllable in photography, unlike PHOtograph.'),
      q('Which phrase is a professional way to buy thinking time?', [
        'So basically, actually, like...',
        'What to say, you know...',
        'Good question. Give me a second.',
        'Um, uh, so, so, so...',
      ], 2, 'A real thinking phrase sounds calm and deliberate, unlike a string of fillers.'),
      q('When you and the listener both speak English as a second language, what works best?', [
        'Short sentences and common words without idioms',
        'Idioms and phrasal verbs to sound more natural',
        'Speaking faster so the call takes less time',
        'Using local terms like lakh and prepone freely',
      ], 0, 'Simple, clear language avoids misunderstandings when neither side is a native speaker.'),
      ]
    ),
    chapter(
      'Everyday Workplace Conversation',
      'Handle introductions and first days, make small talk that feels natural, ask for help and clarification without embarrassment, and give and receive instructions clearly in English.',
      [
      lesson('Greetings, Introductions and First Days', 12, `
First impressions at work are built in the first few seconds of a conversation: how you greet someone, how you say your name and role, and whether you can keep the exchange going. These moments are short and predictable, which makes them easy to prepare for.

### Greetings for different situations

| Situation | Greeting | Reply |
|---|---|---|
| Colleague in the morning | Morning, Sana. How are you? | Good, thanks. You? |
| Senior manager | Good morning, Mr Qureshi. | Good morning. |
| Client you have met before | Nice to see you again. | Good to see you too. |
| Someone new | Hi, I don't think we've met. I'm Bilal. | Hi Bilal, I'm Hina. Nice to meet you. |
| End of the day | See you tomorrow. / Have a good evening. | You too. |

"Assalam o Alaikum" is natural and welcome in most Pakistani offices, including in otherwise English conversations. With international colleagues, a simple "Hello" or "Good morning" is the default.

### Introducing yourself

A good self-introduction at work has three parts: your name, your role, and a link to the other person.

\`\`\`text
"Hi, I'm Ayesha Khan. I've just joined the finance team as an
accounts executive. I think I'll be sending you the monthly
reconciliations."
\`\`\`

Avoid "Myself Ayesha" and "This is Ayesha speaking" in face-to-face meetings. "This is Ayesha" is correct on the phone, but in person say "I'm Ayesha".

### Introducing other people

When you introduce two people, give each a name and one useful detail so they have something to talk about.

\`\`\`text
"Hamza, this is Fatima from our Karachi office. She handles the
port clearance for our imports. Fatima, Hamza runs the warehouse
here in Lahore, so you two will be working together a lot."
\`\`\`

Traditionally you introduce the junior person to the senior person first, but in most modern offices nobody will notice the order. Remembering both names matters more.

### Names and titles

Naming customs vary across offices and countries.

| Setting | Common practice |
|---|---|
| Pakistani corporate office | Sir or Madam for seniors, or first name with "sahib" or "ji" in some teams |
| Multinational in Pakistan | First names for most people, sometimes even seniors |
| UK or US clients | First names after the first email, unless they sign with a title |
| Gulf clients | Mr or Ms with first name is common, such as "Mr Ahmed" |

When unsure, listen to what others call that person, or ask: "How would you like me to address you?" Using "Sir" with international colleagues is polite, but many will ask you to use their first name. If they do, switch; continuing with "Sir" can feel distant to them.

### Your first day

The first day is full of short conversations. Prepare a few lines in advance.

\`\`\`text
Meeting your manager:
"Thank you for having me. I'm looking forward to getting started.
Is there anything you'd like me to read or set up first?"

Meeting the team:
"Hi everyone, I'm Usman. I've joined as a junior developer.
I've worked mostly with React before. Looking forward to working
with you all."

Finding your way:
"Sorry to bother you. Could you tell me where the HR office is?"
\`\`\`

### Remembering names

Forgetting a name is common and forgivable. Two habits help:

1. **Repeat it once** when you hear it: "Nice to meet you, Hina."
2. **Ask early** if you missed it: "Sorry, could you tell me your name again?" Asking in the first minute is easy. Asking after a month is awkward.

### Drill: your 20-second introduction

Write an introduction you could use with a new client, a new colleague and a senior manager. Each should include your name, your role and one detail that links to the listener. Say each aloud five times until it sounds natural rather than memorised.
      `,
        [
          q('Which self-introduction is correct in a face-to-face meeting?', [
            'Myself Ayesha from the finance team.',
            'This is Ayesha speaking from finance.',
            'I\'m Ayesha. I\'ve just joined the finance team.',
            'Ayesha is myself, and I am from the finance team.',
          ], 2, 'In person, "I\'m" plus your name is correct; "myself" is not used this way and "this is" belongs on the phone.'),
          q('What should you do if an international colleague asks you to stop calling them Sir?', [
            'Switch to using their first name as they asked',
            'Keep saying Sir, because it is always more polite',
            'Use Madam or Mr instead of Sir from now on',
            'Avoid using any name at all when you talk to them',
          ], 0, 'Respecting their stated preference is polite, and continuing with Sir can feel distant to them.'),
          q('What makes an introduction between two colleagues useful?', [
            'Introducing the senior person first in every case',
            'Giving each person\'s full job title and department',
            'Keeping it as short as possible, with names only',
            'Giving each person one useful detail to talk about',
          ], 3, 'A shared detail, such as working on the same imports, gives both people a reason to continue the conversation.'),
        ]
      ),
      lesson('Small Talk That Feels Natural', 13, `
Small talk is the short, light conversation before a meeting starts, in the lift, or at the tea station. Many people from South Asia find it awkward in English, especially with foreign colleagues. Yet small talk builds trust, and trust makes every later conversation easier. The good news is that small talk follows simple patterns.

### What small talk is for

Small talk is not about the information. Nobody really needs to know about the weather. It signals: I am friendly, I am relaxed, and I see you as a person. A minute of small talk before a call with a client in Dubai or Manchester often makes the business part go more smoothly.

### Safe and unsafe topics

| Usually safe | Usually avoid with people you do not know well |
|---|---|
| Weather and seasons | Salary and money |
| Weekend plans | Religion and politics |
| Travel and the commute | Marriage plans and children, especially "why not yet?" |
| Food and restaurants | Weight, appearance or health |
| Sport, especially cricket with South Asian colleagues | Gossip about other colleagues |
| Work events, a recent launch | Complaints about your company |

In Pakistan, questions about marriage, family and salary can be part of friendly conversation. With international colleagues, these can feel intrusive. Let them share personal details first.

### The three-step pattern: ask, answer, add

The key to natural small talk is to answer and then add something, instead of giving one-word replies.

\`\`\`text
Weak:
A: How was your weekend?
B: Good.
(silence)

Better:
A: How was your weekend?
B: Good, thanks. We went to my cousin's wedding in Sialkot,
   so it was busy but fun. How about you? Did you do anything nice?
\`\`\`

The second reply answers, adds one detail, and asks a question back. That gives the other person something to pick up.

### Useful openers

\`\`\`text
"How's your week going?"
"Did you have a good weekend?"
"Have you been busy?"
"It's really hot today. Is it like this where you are?"
"How's the weather in London at the moment?"
"Have you tried the new café downstairs?"
"Are you following the cricket?"
\`\`\`

With remote colleagues, the weather or time difference is an easy start: "It's evening here in Karachi already. Is it still morning for you?"

### Showing interest

Small reactions keep the conversation alive and show you are listening.

| To show | Say |
|---|---|
| Interest | Oh really? / That sounds interesting. |
| Pleasure | That's great. / Good for you. |
| Sympathy | Oh no, that's a shame. / Sorry to hear that. |
| Surprise | Wow, I didn't know that. |
| Agreement | Same here. / I know what you mean. |

### Ending small talk politely

Many people struggle to leave a conversation. Use a signal phrase and a warm close.

\`\`\`text
"Anyway, I'd better get back to these reports. Good talking to you."
"Right, shall we get started?" (to move into the meeting)
"I'll let you go. Have a good afternoon."
\`\`\`

### Small talk with seniors

Small talk with your manager's manager can feel risky. Keep it short and positive. A question about their trip, a recent company event or a light comment on the weather is enough. You do not need to be funny; you need to be friendly and relaxed.

### Drill: build your small talk bank

Write three short stories you can share in small talk: your weekend, a place you like in your city, and something about your work you enjoy. Each should be two or three sentences ending with a question back. For example:

\`\`\`text
"I tried the new biryani place near Tariq Road last week. It was
really good, though the queue was long. Do you have a favourite
place for lunch around here?"
\`\`\`

Practise them until you can say them easily. Prepared material removes most of the fear from small talk.
      `,
        [
          q('What is the main purpose of small talk at work?', [
            'To share important project information quickly',
            'To signal friendliness and build trust',
            'To find out what colleagues are paid',
            'To fill time when there is no work to do',
          ], 1, 'Small talk is about relationships rather than information, and that trust helps later business conversations.'),
          q('Which reply follows the ask, answer, add pattern?', [
            'Good.',
            'It was okay, nothing special happened.',
            'Fine, thank you very much for asking me about it.',
            'Good, thanks. We went to Sialkot. How about you?',
          ], 3, 'It answers, adds a detail and asks a question back, which keeps the conversation going.'),
          q('Which topic is usually best avoided with an international colleague you have just met?', [
            'Weekend plans',
            'The weather where they live and work at the moment',
            'Why they are not married yet',
            'A recent cricket match',
          ], 2, 'Questions about marriage can feel intrusive with people you do not know well, while the others are safe.'),
        ]
      ),
      lesson('Asking for Help and Clarification', 12, `
Many capable people waste hours because they do not ask a question. They worry that asking will make them look weak, or they are not sure how to phrase it politely in English. In reality, a clear, well-timed question shows that you care about doing the job right. Managers usually prefer a question today to a mistake next week.

### Why people avoid asking

In many South Asian workplaces, questioning a senior can feel disrespectful, and saying "I don't understand" can feel like losing face. These feelings are real, but the cost of not asking is higher. A wrong assumption about a deadline, a format or a client's request can mean redoing a whole task.

### Polite ways to ask for help

The more you are asking for, and the more senior the person, the softer the phrasing.

| Level | Phrase |
|---|---|
| Quick, to a peer | Can you help me with something? |
| Small favour | Could you have a quick look at this? |
| Bigger favour | Would you mind helping me with the pivot table later? |
| Very polite, to a senior | I'm sorry to bother you, but could I ask your advice on something? |
| Checking availability | Do you have five minutes sometime today? |

Notice the pattern: "can" is direct, "could" is softer, and "would you mind" plus "-ing" is softer still. Remember that "Would you mind?" means "Is it a problem for you?", so "No, not at all" is a yes.

### Asking for clarification

Clarification questions are about understanding something already said or written.

\`\`\`text
"Sorry, could you repeat that last part?"
"Could you explain what you mean by 'phase two'?"
"When you say 'end of the week', do you mean Thursday or Friday?"
"I'm not sure I follow. Could you give me an example?"
"Just to make sure I've understood: you want the report in Excel,
not PDF, and by Wednesday?"
\`\`\`

The last one, summarising back what you heard, is the most powerful. It shows you listened, and it catches misunderstandings before they cost time.

### Be specific about what you did not understand

"I didn't understand" forces the other person to repeat everything. Point to the exact part.

| Vague | Specific |
|---|---|
| I didn't understand. | I understood the deadline, but I'm not clear on who approves the final draft. |
| Can you explain again? | Could you explain the second step, the one about the vendor code? |
| What do you mean? | When you say "clean up the data", do you mean remove duplicates or fix the formats too? |

### Show you have tried first

Before asking for help with a task, try for a reasonable time and mention what you tried. This respects the other person's time and makes the answer quicker.

\`\`\`text
"I've been trying to reconcile the March account. I've checked
the bank statement and the ledger, and there's a difference of
12,400 rupees I can't trace. Could you show me where else to look?"
\`\`\`

### Choosing the right moment and channel

| Situation | Better approach |
|---|---|
| Quick factual question | A short chat message |
| Complex question | Ask for five minutes, then talk |
| Manager is clearly busy | "Is now a good time, or shall I come back later?" |
| You need a written record | Ask, then confirm by email |

### Saying thank you

Close the loop. A short thank-you, and later a note that their help worked, makes people glad to help again: "Thanks for your help with the pivot table yesterday. The report went out on time."

### Drill: rewrite the questions

Turn each vague question into a specific one about your own job.

\`\`\`text
1. "I didn't understand the task."
2. "What is the deadline?"
3. "Can you help me?"
\`\`\`

For each, add what you already know, the exact gap, and a polite opening. Say the new versions aloud.
      `,
        [
          q('What does "No, not at all" mean as a reply to "Would you mind checking this?"', [
            'Yes, I am happy to check it',
            'No, I will not check it',
            'I am not sure yet',
            'Please ask someone else',
          ], 0, '"Would you mind" asks whether it is a problem, so "not at all" means it is fine and they will help.'),
          q('Which clarification question is the most useful?', [
            'Sorry, I didn\'t understand anything at all that you said.',
            'Can you please explain the whole thing again?',
            'When you say end of the week, do you mean Thursday?',
            'What exactly do you mean by all of that?',
          ], 2, 'It points to the exact unclear part, so the other person can answer quickly.'),
          q('Why should you mention what you have already tried when asking for help?', [
            'It proves you are more senior than your colleague',
            'It means you will not need to say thank you later',
            'It makes your message longer and so more formal',
            'It respects their time and makes the answer quicker',
          ], 3, 'Showing your attempt narrows the problem, so the helper can go straight to the missing piece.'),
        ]
      ),
      lesson('Giving and Receiving Instructions', 12, `
Instructions move work forward every day. When they are vague, tasks get done twice. When they are too blunt, people feel ordered around. Whether you are a team lead in a software house or a new associate at a bank, you need to give instructions that are clear and polite, and receive them in a way that confirms you have understood.

### Clear instructions have four parts

| Part | Question it answers | Example |
|---|---|---|
| Task | What? | Prepare the sales summary |
| Detail | How, in what format? | One page, in the usual Excel template |
| Deadline | By when? | By 2 pm Thursday |
| Reason | Why? | I need it for the regional review on Friday |

The reason is the part most people skip. It helps the other person make good decisions when something unexpected happens.

\`\`\`text
Unclear:  "Do the summary."
Clear:    "Could you prepare a one-page sales summary in the usual
           template by 2 pm Thursday? I need it for Friday's regional
           review, so please include the Karachi and Hyderabad figures."
\`\`\`

### Softening without losing clarity

Bare imperatives like "Send the file" can sound rude in English, even if the same form is normal in Urdu with "aap" and a polite tone. Add a softener.

| Direct | Softer, still clear |
|---|---|
| Send me the file. | Could you send me the file? |
| Finish this today. | Can you try to finish this today? |
| Call the client. | Would you mind calling the client? |
| Don't change the format. | Please keep the same format. |

Do not soften so much that the instruction disappears. "If you get a chance, maybe you could look at the file at some point" sounds optional. If it is required by a deadline, say so.

### Sequencing steps

For a task with several steps, use sequence words or numbers.

\`\`\`text
"First, download the report from the portal.
Then, filter it for last month.
After that, copy the totals into the summary sheet.
Finally, email it to me and to Adeel."
\`\`\`

Numbered steps in a chat message are even clearer, because the person can refer back to "step 3".

### Checking the instructions landed

Instead of "Is that clear?", which nearly everyone answers with "Yes", ask an open question: "What will you do first?" or "Any questions about the template?" This catches misunderstandings early.

### Receiving instructions

When someone gives you a task, three moves make you look reliable.

1. **Listen and note.** Write down the task, format and deadline.
2. **Ask about gaps.** "Should I include the returns or only net sales?"
3. **Confirm back.** Summarise in one sentence.

\`\`\`text
"So, a one-page summary in the usual template, with Karachi and
Hyderabad, to you by 2 pm Thursday. I'll let you know by Wednesday
if anything is missing."
\`\`\`

### When you cannot meet the deadline

Say so at the start, not on the day. Give a reason and an alternative.

| Avoid | Say instead |
|---|---|
| "Okay, I'll try." (and then miss it) | "I can do it by Thursday if I move the audit work to next week. Is that okay?" |
| Silence until the deadline | "I'm running behind on this. I'll have it by Friday morning instead. Does that still work?" |

Saying yes to everything and then missing deadlines damages trust far more than an honest answer up front.

### Drill: give and receive

With a friend or colleague, take turns. One gives an instruction for a real task in four parts. The other asks one clarifying question and confirms back in one sentence. Swap roles. Do three rounds, then try the same with a task that has a deadline you cannot meet.
      `,
        [
          q('Which part of an instruction do people most often leave out?', [
            'The task itself',
            'The format',
            'The deadline',
            'The reason',
          ], 3, 'The reason is often skipped, yet it helps the other person make good decisions when plans change.'),
          q('Why is "Is that clear?" a weak way to check understanding?', [
            'It is grammatically incorrect in formal English',
            'Nearly everyone answers yes, even when unsure',
            'It is too long for a quick conversation at work',
            'It is only suitable for written instructions',
          ], 1, 'People rarely admit confusion to a yes or no question, so an open question reveals more.'),
          q('What should you do if you know you cannot meet a deadline you are given?', [
            'Say you will try and then work late until it is done',
            'Say so early and offer a realistic alternative',
            'Stay silent and explain on the day it is due',
            'Ask a colleague to take over without telling anyone',
          ], 1, 'Raising it early with an alternative protects trust far better than missing the deadline later.'),
        ]
      ),
      ],
      [
      q('A new colleague introduces themselves as Hina. What is a good way to help yourself remember the name?', [
        'Repeat it once, as in "Nice to meet you, Hina."',
        'Ask HR for a full staff list with everyone\'s photographs',
        'Wait a month and then ask them again',
        'Call them Madam until you feel sure',
      ], 0, 'Saying the name back once fixes it in memory, and asking early is easy if you miss it.'),
      q('Which is a polite way to leave a small talk conversation?', [
        'Walk away when there is a short silence',
        'Say you are bored and need to work now',
        'Anyway, I\'d better get back to work. Good talking to you.',
        'Check your phone quietly until they finally stop talking to you',
      ], 2, 'A signal phrase plus a warm close ends the conversation politely.'),
      q('Which question is the most polite way to ask a senior colleague for help?', [
        'Help me with this file.',
        'You can help me, na?',
        'Can you do this for me right now, as it is very urgent?',
        'Sorry to bother you, could I ask your advice?',
      ], 3, 'Softer phrasing with "could" and an apology for the interruption suits a request to a senior colleague.'),
      q('After receiving a task, what is the best way to confirm you understood it?', [
        'Say "okay" and start working at once',
        'Ask the person to send the whole task again by email later',
        'Summarise the task, format and deadline in one sentence',
        'Ask whether the task is really necessary',
      ], 2, 'A one-sentence summary shows you listened and catches any misunderstanding before work starts.'),
      ]
    ),
    chapter(
      'Phone and Video Calls',
      'Open and close business calls with confidence, recover when the line is bad or you miss words, set up and behave well on video calls, and leave voice notes and voicemails that people actually answer.',
      [
      lesson('Opening and Closing a Business Call', 12, `
Phone calls feel harder than face-to-face conversation because you lose facial expressions and gestures. You have only your voice and your words. The beginning and end of a call follow fixed patterns, though, and once those are automatic, you can focus your energy on the middle.

### Answering a call

At work, answer with a greeting and your name, and the company or team if it is an external line.

\`\`\`text
"Good morning, Crescent Textiles, Imran speaking."
"Hello, this is Sara from the accounts team."
"Hi, Bilal here."   (internal, with a colleague you know)
\`\`\`

Avoid answering a work call with only "Hello? Hello?" or "Haan ji?" The caller then has to ask who you are, which wastes the first seconds.

### Making a call: the first three lines

When you call someone, they need three things quickly: who you are, where you are from, and why you are calling.

| Step | Example |
|---|---|
| Greet and name yourself | Hello, this is Zainab Malik from Indus Logistics. |
| Check timing | Is this a good time to talk? |
| State the purpose | I'm calling about the shipment due in Port Qasim next week. |

Checking timing is polite and practical. If they are driving or in a meeting, you will get their attention later instead of half of it now.

\`\`\`text
Caller:   Hello, is this Mr Farooq?
Farooq:   Yes, speaking.
Caller:   Hi, this is Zainab from Indus Logistics. Is this a good
          time for a quick call?
Farooq:   I've got about five minutes.
Caller:   That's plenty. I'm calling to confirm the delivery date
          for your order of 200 cartons.
\`\`\`

### Asking for someone

If you need to reach a specific person through a reception or a shared line:

\`\`\`text
"Could I speak to Ms Rabia Hassan, please?"
"Could you put me through to the procurement department?"
"Is Adnan available?"
\`\`\`

If they are not available:

\`\`\`text
"Could I leave a message?"
"When would be a good time to call back?"
"Could you ask him to call me on 0300 1234567?"
\`\`\`

When you give your number, say each digit and pause between groups: "zero three zero zero, one two three, four five six seven". Avoid "oh three hundred", which a listener abroad may write down as 300.

### Taking a message

If you answer for someone else, take down five things.

| Item | Ask |
|---|---|
| Name | Could I have your name, please? |
| Company | And which company are you calling from? |
| Number | What's the best number to reach you? |
| Reason | What is it regarding? |
| Urgency | Is there a time by which he should call you back? |

Read the number back to confirm it. Wrong numbers on message slips are a classic office problem.

### Closing a call

Many calls end awkwardly because nobody signals the end. Use a three-step close: signal, summarise, thank.

\`\`\`text
Signal:     "Okay, I think that covers everything."
Summarise:  "So you'll send the revised invoice today, and I'll
             confirm the payment by Thursday."
Thank:      "Thanks for your time, Mr Farooq. Have a good day."
\`\`\`

The summary is the step that saves the most trouble. Many disputes start because two people left a call with different ideas of what was agreed.

### Phrases to avoid on calls

| Avoid | Use instead |
|---|---|
| Who is this? | May I ask who's calling? |
| Wait. | Could you hold on a moment, please? |
| He is not there. | I'm afraid he's not at his desk at the moment. |
| What do you want? | How can I help you? |
| Okay, bye. (mid-sentence) | Thanks for calling. Goodbye. |

### Drill: script your openings

Write the first three lines you would use to call a supplier, a client and a colleague in another city. Then write a three-step close for each. Say them aloud while holding your phone to your ear; the physical position helps it feel real.
      `,
        [
          q('What three things should a caller give in the first lines of a business call?', [
            'Their age, their job title and their salary grade',
            'Who they are, where they are from and why they are calling',
            'The time, the date and the weather where they are',
            'Their manager\'s name, phone number and office address',
          ], 1, 'The other person needs to know who is calling, from where and why before the conversation can move on.'),
          q('Which step of the call close saves the most trouble later?', [
            'Signalling the end',
            'Saying goodbye warmly',
            'Summarising what was agreed',
            'Thanking them for their time',
          ], 2, 'A summary makes sure both people leave the call with the same understanding of what was agreed.'),
          q('Which phrase is the most professional when someone asks for a colleague who is away?', [
            'I\'m afraid he\'s not at his desk at the moment.',
            'He is not there, so you will have to call again later.',
            'Who is this asking for him?',
            'Wait, I don\'t know where he went.',
          ], 0, 'It is polite, gives a clear answer and leaves room to offer a message.'),
        ]
      ),
      lesson('Handling Bad Lines and Missed Words', 12, `
Calls in Pakistan often happen over patchy mobile signals, crowded Wi-Fi or internet apps that freeze. Even on a perfect line, you will sometimes miss a word because of an accent you are not used to or a speaker who talks fast. What matters is not avoiding these moments but handling them calmly in English.

### Saying the line is bad

Be honest and specific. People prefer a quick fix to a long call where half is lost.

\`\`\`text
"Sorry, you're breaking up. Could you say that again?"
"The line's not very clear. I missed the last part."
"I think we've got a bad connection. Shall I call you back?"
"You froze for a second. Could you repeat the date?"
"Your voice is quite faint. Could you speak a little louder?"
\`\`\`

If the problem continues, suggest a change rather than struggling on: "Shall we switch to a normal phone call?" or "Let me move closer to the router."

### Asking someone to repeat

Asking for repetition is normal. The trick is to say what you missed so they do not repeat everything.

| General | Targeted |
|---|---|
| Sorry? | Sorry, what was the name of the company? |
| Pardon? | Could you repeat the figure? Was it 15 or 50? |
| What? | I missed the part after "next Tuesday". |
| Can you say again? | Could you spell the email address for me? |

"What?" alone can sound rude in English. "Sorry?" or "Pardon?" is the polite short form. "Come again?" is informal and fine with colleagues you know.

### When you cannot understand an accent

You will work with people from Manchester, Texas, Lagos, Manila and Cairo, and some accents will be hard at first. They may also find your accent hard. Both are normal.

\`\`\`text
"Sorry, I'm having trouble following. Could you slow down a little?"
"Could you say that another way?"
"Just to check I've got it right: you need the samples by the 3rd?"
\`\`\`

Asking someone to slow down is not insulting. Most people will happily adjust. Never pretend to understand and say "yes" to something you did not catch. That is how wrong orders get shipped.

### Confirming key details

On any call where numbers, dates or names matter, confirm them out loud and in writing.

\`\`\`text
Supplier:  We can deliver four thousand units on the twelfth.
You:       Just to confirm: four thousand, that's four zero zero zero,
           on Thursday the twelfth?
Supplier:  That's right.
You:       Great. I'll send you an email now to confirm.
\`\`\`

The follow-up email is your safety net. If something was misheard, the other person can correct it before it causes a problem.

### If the call drops

Agree in advance who calls back. If it was not agreed, the person who made the call usually calls back. When you reconnect:

\`\`\`text
"Sorry about that, we got cut off. I think you were saying
something about the delivery schedule."
\`\`\`

This restarts the conversation smoothly without making anyone repeat the whole thing.

### Hearing yourself clearly

Sometimes the problem is on your side. Common fixes:

| Problem | Fix |
|---|---|
| Echo on the other side | Use earphones instead of the phone speaker |
| Your voice cuts out | Move away from walls that block signal, or switch to mobile data |
| Background noise | Close the window, mute when not speaking |
| Low volume | Hold the microphone closer, speak from a full breath |

### Drill: the bad line role play

With a friend, practise a call where one person deliberately "breaks up" every few sentences by mumbling a word. The other must ask a targeted question about the missing part each time. Then switch. Finish each round by confirming two numbers and one name aloud, and writing a two-line follow-up email.
      `,
        [
          q('Which is the best response when you miss one number in a sentence?', [
            'What? I did not hear any of that, say it again.',
            'Say everything again, please.',
            'Could you repeat the figure? Was it 15 or 50?',
            'Yes, okay, that sounds fine to me.',
          ], 2, 'A targeted question asks only for the missing piece, which is faster and clearer.'),
          q('What should you never do when you cannot understand a speaker\'s accent?', [
            'Ask them to slow down a little',
            'Ask them to say it another way',
            'Summarise what you think they said',
            'Pretend to understand and say yes',
          ], 3, 'Agreeing to something you did not catch leads to real mistakes, such as wrong orders.'),
          q('Why should you send an email after confirming details on a call?', [
            'It lets the other side correct anything that was misheard',
            'It is a legal requirement for every business phone call',
            'It replaces the need to confirm anything on the call',
            'It shows your manager how many calls you have made',
          ], 0, 'A written follow-up is a safety net that catches errors before they cause problems.'),
        ]
      ),
      lesson('Video Call Etiquette and Setup', 13, `
Video calls on Zoom, Microsoft Teams and Google Meet are now part of everyday work, especially for freelancers and remote teams working with clients abroad. Your English matters on these calls, but so does your setup. A frozen camera, a noisy room or a bad angle makes even good English harder to follow.

### Before the call: a technical check

| Item | What to check |
|---|---|
| Internet | Close downloads and video streaming; use a cable or sit near the router if you can |
| Power | Laptop charged, and a plan for load shedding such as a UPS or a charged phone hotspot |
| Audio | Earphones with a microphone; test it in the app's settings |
| Camera | At eye level, so you are not looking down into it |
| Light | Face a window or lamp; avoid a bright window behind you |
| Background | Tidy, or a plain blur if the room is busy |
| Name | Your display name shows your full name, not "Dell User" or a nickname |

Join a few minutes early so you can fix problems before others arrive.

### Load shedding and backup plans

Power and internet cuts happen. Tell the organiser in advance if your area has scheduled outages at that time, and keep a backup ready.

\`\`\`text
"Just a heads-up: we sometimes have power cuts in the afternoon.
If I drop off, I'll rejoin from my phone straight away."
\`\`\`

This short message shows professionalism. If you do drop, rejoin and say: "Sorry, I lost power. I'm back now."

### Joining and opening

When you join, a short greeting is enough. You do not need to greet each person by name.

\`\`\`text
"Hi everyone. Good morning from Lahore."
"Hello, sorry I'm a minute late. I had a connection issue."
\`\`\`

If people are waiting for others, light small talk fills the gap. Time zones are a natural topic: "Is it early for you in London?"

### Speaking on video

| Habit | Why it helps |
|---|---|
| Look at the camera when making a key point | It feels like eye contact to others |
| Pause a little longer than in person | There is often a short delay |
| Say the person's name before a question | "Ahmed, could you update us on the budget?" |
| Use the raise hand button or chat in large calls | Avoids people talking over each other |
| Mute when not speaking | Removes background noise and echo |

When two people start speaking at once, which happens often because of the delay, say "Sorry, go ahead" and let them finish. Then say "Thanks. I was going to add..."

### Using the chat box

The chat box is useful for sharing links, spelling names and asking short questions without interrupting.

\`\`\`text
"Here's the link to the sheet: [link]"
"Just to confirm the spelling: Qasim with a Q."
"Sorry, need to step away for two minutes. Back shortly."
\`\`\`

Keep chat messages professional; everyone can usually see them, and chats may be saved.

### Camera on or off?

Many teams expect cameras on for small meetings, especially with clients. In large meetings, cameras off is often fine. If you need to turn your camera off because of bandwidth or a private situation at home, say so briefly: "I'll turn off my video to save bandwidth." Follow your team's norm, and ask if you are unsure.

### Sharing your screen

Before you share, close personal tabs, chats and notifications. Share one window rather than the whole screen when you can. Then guide people:

\`\`\`text
"I'm going to share my screen. Can everyone see the spreadsheet?"
"If you look at column D, you'll see the totals for each city."
"I'll stop sharing now."
\`\`\`

### Leaving the call

Do not just click "Leave". Say a short goodbye: "Thanks, everyone. Bye for now." If you need to leave early, mention it at the start: "I have a hard stop at 4, so I'll drop off then."

### Drill: run a test call

Set up a call with a friend or with yourself on two devices. Check the camera angle, light and sound. Record two minutes of you introducing a project and sharing your screen. Watch it back and fix the most obvious problem first.
      `,
        [
          q('Where should your camera be on a video call?', [
            'Below your face, looking up at you',
            'At about eye level',
            'Behind you, facing a window',
            'Off to one side at an angle',
          ], 1, 'An eye-level camera gives a natural view, while a low camera makes others look up at you.'),
          q('What should you do when you and another person start speaking at the same time?', [
            'Keep talking louder so the others hear you clearly',
            'Turn off your microphone and leave the meeting',
            'Type your whole point into the chat box instead',
            'Say "Sorry, go ahead" and let them finish first',
          ], 3, 'Video delays make overlaps common, and giving way politely keeps the call smooth.'),
          q('What is a professional way to prepare for a possible power cut during a client call?', [
            'Say nothing and hope that the power stays on',
            'Cancel any call that is planned for the afternoon',
            'Warn the organiser and have a backup way to rejoin',
            'Ask the client to call you on a landline instead',
          ], 2, 'A short warning and a ready backup show you planned ahead, and you can rejoin quickly if needed.'),
        ]
      ),
      lesson('Voice Notes and Voicemails That Get Answered', 12, `
Voice notes on WhatsApp are everywhere in Pakistani business, from suppliers in Gujranwala to clients in Dubai. Voicemail is less common locally but still used by many international clients and offices. Both are short recorded messages, and both often get ignored when they ramble. A clear structure makes yours easy to act on.

### When a voice note is the right choice

| Good use | Better as text |
|---|---|
| Explaining something with tone, such as an apology | Phone numbers, addresses, account details |
| A quick update when you are driving or walking | Anything the other person needs to search for later |
| Talking a colleague through a small process | Formal requests or approvals that need a record |
| Close colleagues who prefer voice | International clients who have not used voice with you |

Many people, especially senior managers and international clients, prefer text because they can read it in a meeting. If you are unsure, send text. If someone sends you voice notes, voice notes back are usually fine.

### The structure of a good voice note or voicemail

Use the same five-part pattern for both.

\`\`\`text
1. Who:      "Hi Ahmed, it's Mariam from Bright Packaging."
2. Why:      "I'm calling about the quote for the gift boxes."
3. Detail:   "We can do the 5,000 boxes, but the printing will take
              ten working days, not seven."
4. Action:   "Could you let me know by Wednesday if that works?"
5. Contact:  "You can reach me on 0321 7654321. That's 0321 7654321.
              Thanks, bye."
\`\`\`

Repeat your number slowly at the end of a voicemail. Listeners often need to replay a message just to catch the digits.

### Keep it short

Aim for under a minute. If you need longer, a call or a written message is probably better. Plan your message before you press record; even three words on a scrap of paper helps: "quote, ten days, Wednesday".

### Common problems in voice notes

| Problem | Fix |
|---|---|
| Starting with "Hello? Hello?" and silence | Start speaking straight away with your name |
| Recording in traffic or a busy shop | Find a quiet corner or send text |
| Several voice notes in a row, each a few seconds | Plan, then record one complete message |
| Long story before the point | Lead with why you are calling |
| Mixing languages unpredictably | Use one language, matched to the listener |

Code switching between Urdu and English is normal with local colleagues. With international clients, keep the whole message in English.

### Answering machine and voicemail greetings

If you use voicemail, record a short professional greeting.

\`\`\`text
"Hello, you've reached Kamran Ali at Northline Software.
I can't take your call right now. Please leave your name,
number and a short message, and I'll get back to you today."
\`\`\`

Avoid long greetings, background music and jokes on a work number.

### Replying to a voice note

If someone asks a question in a voice note, reply to the question first. If you reply in text, quote the key point so the conversation is easy to follow: "About the ten working days: yes, that works for us."

### Follow up in writing

After an important voice note, send a short text with the key facts. People skim chats later, and nobody wants to replay three voice notes to find a date.

\`\`\`text
"Summary of my voice note: 5,000 boxes, printing takes 10 working
days. Please confirm by Wednesday."
\`\`\`

### Drill: record and review

Record a voice note to a pretend supplier asking to move a delivery by two days. Use the five-part structure and keep it under 45 seconds. Listen back. Is your name clear? Is the request in the first ten seconds? Could someone write down your number on the first listen? Re-record until all three answers are yes.
      `,
        [
          q('Which information is better sent as text than as a voice note?', [
            'A bank account number',
            'A short apology to a colleague',
            'A quick update while walking',
            'An explanation where tone matters',
          ], 0, 'Numbers and details the other person must copy or search for later are much easier to use in text.'),
          q('Why should you repeat your phone number slowly at the end of a voicemail?', [
            'Repeating it makes the message sound longer and more formal',
            'Listeners often have to replay a message to catch the digits',
            'Some voicemail systems will delete messages without a number',
            'It is required by most telephone service providers in Pakistan',
          ], 1, 'Saying the number twice and slowly lets the listener write it down without replaying the message.'),
          q('What is the best fix for sending several short voice notes in a row?', [
            'Speak faster so each note is even shorter',
            'Send them as voice notes in both languages',
            'Add a text message between each voice note',
            'Plan first, then record one complete message',
          ], 3, 'One planned message is easier to follow than a chain of fragments the listener must piece together.'),
        ]
      ),
      ],
      [
      q('Which opening is best when you make a business call?', [
        'Hello? Hello? Who is this speaking on the line right now, please?',
        'Haan ji, I am calling you about something.',
        'Hi, this is Zainab from Indus Logistics. Is this a good time?',
        'I need to talk to you now about our order.',
      ], 2, 'It gives your name, company and a timing check, so the other person can give you full attention.'),
      q('If a call drops and nobody agreed who calls back, who usually calls back?', [
        'The more senior person on the call',
        'The person who made the call',
        'The person who received the call',
        'Whoever has the cheaper phone package',
      ], 1, 'By common convention the original caller calls back, which avoids both people calling at once.'),
      q('What should you do before sharing your screen on a video call?', [
        'Close personal tabs, chats and notifications',
        'Turn off your camera and microphone',
        'Ask everyone else in the meeting to stop their video first',
        'Share your whole desktop to save time',
      ], 0, 'Closing personal items prevents private messages appearing in front of colleagues or clients.'),
      q('What is the right first step in a voice note or voicemail?', [
        'Explain the background of the problem in full',
        'Ask the listener to call you back as soon as possible',
        'Wait a few seconds to check that recording started',
        'Say who you are, then why you are calling',
      ], 3, 'Leading with your name and purpose tells the listener at once what the message is about.'),
      ]
    ),
    chapter(
      'Meetings',
      'Prepare for and join meetings with confidence, run a meeting from a clear agenda, disagree and interrupt politely, and close every meeting with spoken decisions and named action points.',
      [
      lesson('Preparing for and Joining a Meeting', 12, `
Many people with good English stay silent in meetings. The reason is rarely vocabulary. It is usually that the meeting moves fast, the topic changes, and by the time they have built a perfect sentence in their head, the moment has passed. Preparation fixes most of this.

### Read the invite properly

Before any meeting, check four things in the calendar invite or message:

| Question | Why it matters |
|---|---|
| What is the purpose? | Tells you whether you will be asked to inform, decide or just listen |
| Who is attending? | Tells you how formal to be and who the decision maker is |
| Is there an agenda or a document? | Gives you the words people will use |
| What is expected from you? | You may be asked for an update without warning |

If the purpose is unclear, it is fine to ask before the meeting: "Hi Sana, just to prepare, is there anything you need from me for Thursday's call?" This is a normal, professional question, not a sign of weakness.

### Prepare three sentences, not a speech

You do not need a script. Prepare three short sentences for the item that concerns you: where things stand, the main issue, and what you need.

\`\`\`text
Item: Karachi warehouse stock report

1. Status:  "The stock count for September is finished."
2. Issue:   "We found a gap of about forty cartons in the dairy section."
3. Need:    "I need finance to confirm whether those were written off in August."
\`\`\`

Say these out loud once before the meeting. Hearing your own voice say the key words, such as "written off" or "reconciliation", makes them easier to say under pressure.

### Joining: the first thirty seconds

Arriving well sets your confidence for the rest of the meeting. Useful lines:

- "Good morning, everyone. Sorry, am I in the right meeting for the Q3 review?"
- "Hi all, Bilal here from the Lahore office."
- "Sorry I am a couple of minutes late. Please carry on."

Notice the last one. Do not give a long excuse about traffic on Canal Road. A short apology and "please carry on" is enough, and it lets the meeting continue.

### Making your first contribution early

The longer you wait to speak, the harder it becomes. Try to say something, even something small, in the first ten minutes. Easy early contributions include:

- Agreeing and adding: "I agree with Ahmed, and I would add that the vendor also delayed the last order."
- Asking a short question: "Could you say a bit more about the timeline?"
- Confirming: "So the deadline is still the fifteenth, right?"

Once your voice has been heard once, speaking again feels much easier.

### Common slips to avoid

Urdu speakers often carry a few habits into meeting English. Watch for these:

| Instead of | Say |
|---|---|
| "I will tell you after some time." | "I will come back to you on that by Friday." |
| "Can you repeat once again?" | "Could you say that again, please?" |
| "I am not getting you." | "Sorry, I'm not sure I follow." |
| "Please tell the status." | "Could you give us a quick update?" |

"After some time" gives no real deadline, so the listener cannot plan around it. "Repeat once again" says the same thing twice, because repeat already means say again. The phrases from Chapter 1, such as "I have a question" instead of "I have a doubt", matter even more in meetings, where many people hear you at once.

### A quick pre-meeting checklist

1. Read the invite and agenda.
2. Write your three sentences.
3. Open any document you might need to share.
4. Note one question you could ask.
5. Arrive on time, or a minute early for online calls.

None of this takes more than ten minutes, and it changes how you sound in the room.
      `,
        [
          q('What is the main purpose of preparing three short sentences before a meeting?', [
            'To read a full script aloud word for word',
            'To state status, issue and need clearly when asked',
            'To avoid speaking unless the manager calls on you',
            'To show off advanced vocabulary to senior staff',
          ], 1, 'Three prepared sentences cover where things stand, the problem and what you need, so you can speak quickly without a script.'),
          q('You join a call two minutes late. Which line is most suitable?', [
            '"Sorry, the traffic on Canal Road was terrible today and my car broke down."',
            '"Myself Bilal, I am now joined, please repeat everything."',
            '"Sorry I am a couple of minutes late. Please carry on."',
            'Say nothing and wait for someone to notice you',
          ], 2, 'A short apology that lets the meeting continue is polite and keeps attention on the work, not on you.'),
          q('Why is "I will come back to you on that by Friday" better than "I will tell you after some time"?', [
            'It gives a clear deadline instead of a vague one',
            'It is shorter and uses fewer words overall',
            '"Tell" is considered rude in British meetings',
            'It avoids making any firm promise to the whole group',
          ], 0, 'A named day tells everyone in the meeting when to expect your answer, while "after some time" leaves them guessing.'),
        ]
      ),
      lesson('Running a Meeting With an Agenda', 13, `
Sooner or later you will be asked to run a meeting: a weekly team catch up, a client call, or a project review. Running a meeting in English is less about perfect grammar and more about a few fixed phrases that guide people from one point to the next.

### Write a short agenda

An agenda is a numbered list of topics, ideally with a time for each and the person leading it. Send it at least a day before if you can.

\`\`\`text
Subject: Agenda for Monday's marketing catch up (30 min)

1. Eid campaign results            Ayesha   10 min
2. Budget for November ads         Kamran   10 min
3. New product photos              Hina      5 min
4. Any other business (AOB)        All       5 min

Please bring the final campaign numbers.
\`\`\`

"AOB" means any other business: a short slot at the end for small items not on the list. Keeping it last stops new topics from taking over the meeting.

### Opening the meeting

The first minute sets the tone. A simple opening has three parts: greet, state the purpose, and show the agenda.

| Step | Example |
|---|---|
| Greet | "Good morning, everyone. Thanks for joining." |
| Purpose | "The aim today is to agree the November ad budget." |
| Agenda | "We have three items, and we should finish by 10:30." |
| Roles | "Hina, could you take notes today?" |

Naming a note taker at the start saves confusion at the end.

### Moving through the items

These phrases move the meeting along without sounding rude:

- "Let us start with the first item. Ayesha, over to you."
- "Thanks, that is clear. Shall we move on to the budget?"
- "We have about five minutes left on this point."
- "Kamran, what is your view on this?"

The phrase "over to you" is especially useful. It hands the floor to someone clearly and politely.

### Keeping the meeting on track

Meetings drift. Someone starts talking about the office generator or last week's cricket match. You can bring people back without embarrassing anyone:

- "That is a good point, but it is a bit outside today's agenda. Can we take it offline?"
- "Let us park that for now and come back to it in AOB."
- "I am conscious of time, so let us return to the budget."

"Take it offline" means discuss it separately later, not in this meeting. "Park it" means put it aside for now.

### Bringing in quiet people

In many South Asian offices, junior staff wait to be invited before they speak, especially when a senior person is present. A good chair invites them directly and gently:

- "Zainab, you worked on the photos. Anything to add?"
- "Before we decide, does anyone see a problem with this?"

Asking by name works better than a general "Any questions?", which often gets silence.

### Handling time

If an item runs long, give people a choice rather than cutting them off:

\`\`\`text
Chair: "We are over time on this item. We can either decide now with
        what we have, or set up a separate call on Wednesday.
        Which do you prefer?"
\`\`\`

This keeps the chair in control while still respecting the discussion.

### Closing smoothly

End on time whenever possible. A clean close sounds like this: "Thanks, everyone. That covers everything on the agenda. Hina will send the notes today." The detail of summing up decisions comes in the last topic of this chapter, but even a short close like this makes a meeting feel organised.
      `,
        [
          q('What does "AOB" on an agenda mean?', [
            'Action on budget, a section for spending decisions',
            'Attendance of board members at the meeting',
            'Any other business, a short slot at the end',
            'Agenda order breakdown for the chair only',
          ], 2, 'AOB stands for any other business and keeps small extra items at the end of the meeting.'),
          q('A colleague starts discussing an unrelated issue. Which response keeps the meeting on track politely?', [
            '"Good point, but can we take it offline and return to the budget?"',
            '"Stop, that has nothing at all to do with this meeting, so please drop it."',
            'Ignore it and wait until they finish speaking',
            '"We will discuss it now since you raised it."',
          ], 0, 'Acknowledging the point and moving it offline keeps the agenda intact without embarrassing anyone.'),
          q('Why is asking a quiet colleague by name often better than saying "Any questions?"', [
            'It forces them to give a long presentation in front of the whole team',
            'General questions are considered rude in business English',
            'It shows the chair already knows the answer to the question',
            'A general question often gets silence; a named one opens the floor',
          ], 3, 'Many people wait to be invited before speaking, so a direct, gentle invitation brings them in.'),
        ]
      ),
      lesson('Disagreeing Politely and Interrupting Well', 14, `
Disagreeing in a meeting feels risky, especially with a senior person or a client. Many learners either stay silent and complain later, or they disagree in a way that sounds harsher than they meant. English has a set of softening tools that let you say "I do not agree" clearly while keeping the relationship safe.

### Why direct translation sounds harsh

In Urdu, a sentence like "Yeh galat hai" can be said warmly with the right tone. Translated straight into English as "This is wrong", it often sounds blunt, even aggressive, to colleagues from other places. English meetings tend to soften disagreement with extra words.

| Blunt | Softened |
|---|---|
| "This is wrong." | "I am not sure that is quite right." |
| "No, that will not work." | "I can see the idea, but I am worried about the cost." |
| "You do not understand." | "Maybe I did not explain it clearly." |
| "Your numbers are wrong." | "I got a different figure. Can we check it together?" |

The softened versions still disagree. They simply attack the idea, not the person.

### A simple pattern: acknowledge, disagree, suggest

\`\`\`text
Acknowledge: "I take your point about speed."
Disagree:    "My concern is that a new courier in Faisalabad
              has no track record with us."
Suggest:     "Could we test them on a small batch first?"
\`\`\`

This three-step pattern works in almost any situation. Ending with a suggestion turns disagreement into problem solving.

### Useful softeners

- "I see it slightly differently."
- "I am not fully convinced yet."
- "That is one option. Another might be..."
- "Could I offer a different view?"
- "With respect, I think the data shows something else."

Be careful with "with respect". In British English it can sound like the speaker is quite annoyed. Use it sparingly.

### Disagreeing with a senior person

In many workplaces in Pakistan and South Asia, openly contradicting a boss in front of others feels uncomfortable. You have options:

1. Ask a question instead of stating disagreement: "How would that work with the current staff numbers?"
2. Offer information rather than an opinion: "Last time we tried this, delivery took two extra days."
3. Raise it privately after the meeting if the issue is sensitive.

Questions and facts let the senior person change their mind without losing face.

### Interrupting well

Sometimes you must interrupt: someone has misunderstood, or the meeting is about to decide something based on a mistake. Interrupting is acceptable when it is short and polite.

| Situation | Phrase |
|---|---|
| Quick correction | "Sorry to interrupt, but the deadline moved to the twentieth." |
| You want a turn | "Could I come in here for a second?" |
| On a video call | Raise your hand icon, then "Just to add quickly..." |
| Someone interrupts you | "If I could just finish this point, then I will hand over." |

Notice the last row. Holding your turn calmly is as important as taking one.

### Tone and volume

Your voice carries meaning too. Keep your volume steady, do not speed up, and avoid laughing nervously after disagreeing, which can make you seem unsure. Saying "I disagree" calmly is more persuasive than saying it loudly.

### Practice drill

Take three statements you heard at work this week and rewrite each one in the acknowledge, disagree, suggest pattern. Say them aloud. The aim is that these phrases come out naturally when you need them, not that you memorise long speeches.
      `,
        [
          q('What are the three steps of the polite disagreement pattern?', [
            'Interrupt, correct, repeat',
            'Apologise, agree, stay silent',
            'Question, criticise, conclude',
            'Acknowledge, disagree, suggest',
          ], 3, 'Acknowledging the other view, stating your concern and offering a suggestion keeps disagreement constructive.'),
          q('Which line is the best way to disagree with a manager\'s plan in a meeting?', [
            '"No, that will not work at all, so please drop the idea."',
            '"How would that work with the current staff numbers?"',
            '"You do not understand our situation here."',
            '"I will not do that, sir, it is simply not possible."',
          ], 1, 'A question lets the senior person reconsider without losing face, while still raising your concern.'),
          q('A colleague interrupts you before you finish an important point. What is a calm response?', [
            'Stop talking and never return to your point again',
            'Raise your voice and keep talking until they stop',
            '"If I could just finish this point, then I will hand over."',
            'Leave the call quietly so that everyone can see you are upset',
          ], 2, 'Politely holding your turn lets you finish and then gives the floor back.'),
        ]
      ),
      lesson('Summing Up Decisions and Action Points', 13, `
Many meetings end with everyone nodding, and then nothing happens. A week later, three people remember three different decisions. The fix is simple: before the meeting ends, someone says out loud what was decided, who will do what, and by when. That someone can be you, even if you are not the chair.

### Decisions versus action points

These two are different, and good summaries keep them separate.

| Type | Meaning | Example |
|---|---|---|
| Decision | Something the group agreed | "We will use the new courier for Multan orders." |
| Action point | A task one person must do | "Usman will sign the courier contract by Friday." |
| Open question | Not yet settled | "We still need to decide the return policy." |

An action point always has three parts: a person, a task and a deadline. "Someone should look into it" is not an action point.

### Spoken summary phrases

Use these in the last five minutes:

- "Let me quickly sum up what we agreed."
- "So, to recap, we have decided two things."
- "Just to confirm the actions: Usman, you will send the contract by Friday."
- "Is there anything I have missed?"

The final question is important. It gives others a chance to correct you before the meeting ends, which is much easier than correcting an email later.

### A full spoken summary

\`\`\`text
"Okay, let me sum up before we finish.

We agreed on two things. First, we will use the new courier
for Multan orders from next month. Second, the November ad
budget stays the same as October.

Actions: Usman will send the signed courier contract by Friday.
Ayesha will share the ad plan on Wednesday. I will update the
client on Thursday.

One thing is still open: the return policy. We will discuss it
next Monday. Did I miss anything?"
\`\`\`

This takes under a minute and prevents a week of confusion.

### Making action points specific

Vague action points are the main reason tasks fall through. Compare:

| Vague | Specific |
|---|---|
| "We will check the stock." | "Faraz will count the stock in the Gulberg store by Tuesday." |
| "Let us follow up with the client." | "Maria will email the client the revised quote today." |
| "Sort out the website." | "Owais will fix the broken checkout button by Thursday noon." |

When you hear a vague action, ask politely: "Who will own that?" or "When should that be done by?" These two questions are among the most useful in any meeting.

### Confirming your own actions

When a task is given to you, repeat it back. "Sure, I will send the updated price list to the Karachi distributor by Wednesday." Repeating it shows you understood and gives the chair a chance to correct the detail.

If the deadline is not realistic, say so now, not later: "I can do that, but Wednesday is tight because of the audit. Would Friday work?"

### The short follow-up message

After the meeting, send a brief written note to everyone who attended. Keep it to decisions and actions only:

\`\`\`text
Hi all, thanks for today. Quick summary:

Decisions
- New courier for Multan orders from 1 November
- November ad budget same as October

Actions
- Usman: send signed courier contract, Friday
- Ayesha: share ad plan, Wednesday

Open: return policy, next Monday's meeting
\`\`\`

Formal minutes for larger meetings are covered later in the course. For most team meetings, a short note like this is all you need.
      `,
        [
          q('Which of these is a complete action point?', [
            '"Usman will sign the courier contract by Friday."',
            '"Someone should look into the courier contract."',
            '"The courier contract is important."',
            '"We discussed the courier contract in detail."',
          ], 0, 'A complete action point names a person, a task and a deadline.'),
          q('Why should a spoken summary end with "Is there anything I have missed?"', [
            'It shows that the speaker is unsure of the summary they just gave',
            'It is required by law in formal meetings',
            'It politely ends the meeting immediately',
            'It lets others correct the summary before everyone leaves',
          ], 3, 'Inviting corrections at the end is much easier than fixing a wrong summary in an email later.'),
          q('You are given a task with an unrealistic deadline. What is the best response?', [
            'Accept it silently and finish whenever you can',
            'Say so now and suggest a date that works',
            'Refuse the task without giving any reason',
            'Complain to colleagues after the meeting ends',
          ], 1, 'Raising the issue in the meeting and offering an alternative keeps expectations realistic for everyone.'),
        ]
      ),
      ],
      [
      q('You have no idea what will be expected from you in tomorrow\'s meeting. What should you do?', [
        'Skip the meeting in case you are asked something difficult',
        'Prepare a ten-minute speech covering every possible topic',
        'Wait and see, since preparing is unnecessary',
        'Send a short message asking if anything is needed from you',
      ], 3, 'Asking ahead is normal and professional, and it lets you prepare the right three sentences.'),
      q('As chair, what does "Let us park that for now" mean?', [
        'Cancel the topic permanently from all future meetings',
        'Ask the speaker to leave the meeting room',
        'Put the topic aside and return to it later',
        'Move the meeting to a different location',
      ], 2, 'Parking a topic sets it aside so the agenda can continue, often returning to it in AOB.'),
      q('Which sentence softens disagreement while still disagreeing?', [
        '"I got a different figure. Can we check it together?"',
        '"Your numbers are wrong, so please do them again."',
        '"Yes, you are right about everything you said."',
        '"This is wrong and we all know it, honestly."',
      ], 0, 'It states that the figures differ and invites joint checking, without attacking the person.'),
      q('What separates a decision from an action point?', [
        'Decisions are spoken aloud while action points are always written down',
        'A decision is the group\'s agreement; an action point is one person\'s task',
        'Action points are only for senior managers to assign and track',
        'There is no real difference between them in practice',
      ], 1, 'Decisions record agreement, while action points assign a task with an owner and a deadline.'),
      ]
    ),
    chapter(
      'Presentations',
      'Build a short presentation with a clear beginning, middle and end, guide listeners with signposting phrases, describe charts and numbers accurately, and handle questions and nerves calmly.',
      [
      lesson('Structuring a Short Presentation', 13, `
Most workplace presentations are short: five to ten minutes in a team meeting, a client pitch, or an update to management. You do not need to be a natural speaker to do these well. You need a structure that the audience can follow without effort.

### The three-part shape

Almost every good short presentation follows the same shape:

| Part | Purpose | Share of time |
|---|---|---|
| Opening | Tell them what you will talk about and why it matters | About 10 to 15 percent |
| Body | Two or three main points, each with evidence or an example | About 70 to 80 percent |
| Close | Repeat the main message and say what you want next | About 10 percent |

The old advice is: tell them what you will tell them, tell them, then tell them what you told them. It sounds repetitive on paper, but listeners cannot scroll back like readers can. Repetition helps them follow.

### Start with the main message

Many learners start with long background: the history of the project, the company, the team. By the time they reach the point, the audience has stopped listening. Put your main message in the first minute.

\`\`\`text
Weak opening:
"Good morning. As you know, our company was founded in 2015
in Lahore, and over the years we have grown in many areas..."

Strong opening:
"Good morning. In the next eight minutes I want to show you
why moving our Karachi deliveries to a second courier would
cut late orders, and what we need to approve today."
\`\`\`

The strong opening tells the audience the topic, the time and the decision they are being asked to make.

### Choose two or three points only

Ten points in eight minutes means none are remembered. Pick the two or three that matter most for this audience. A useful test is to ask: if they remember only one thing, what should it be? Build the other points around that.

For each point, use this mini pattern:

1. **Point**: "Our current courier is late on many Karachi orders."
2. **Evidence**: "In September, the tracking report showed late deliveries in most weeks."
3. **Meaning**: "That is why customers in Clifton and DHA keep calling support."

The last step, explaining what the evidence means, is the one most people skip.

### Know your audience

The same content needs a different shape for different listeners:

| Audience | What they want |
|---|---|
| Senior management | The decision, the cost and the risk, quickly |
| Your own team | Practical details: who does what and when |
| A client | How this helps them, in their language, not yours |
| Technical colleagues | Data, method and limitations |

Before writing a single slide, write one sentence: "This presentation is for ___, and I want them to ___." Keep that sentence in front of you.

### Slides support you, they do not replace you

Slides full of paragraphs push people to read instead of listen. Keep slides simple: a short headline, one chart or image, a few words. Your spoken English carries the detail.

A practical rule: if you are reading your slides aloud word for word, there is too much text on them.

### Closing with a clear ask

End by repeating the message and stating the next step:

- "So, to sum up, a second courier should reduce late orders. I would like approval to run a one-month trial."
- "That is all from me. The key point is that the launch moves to March. Any questions?"

Never end with just "That's it" or "Thank you" after the last slide. The audience should leave knowing exactly what you want them to remember or do.
      `,
        [
          q('Where should the main message of a short presentation usually appear?', [
            'Only on the final slide, as a surprise ending',
            'In the first minute, as part of the opening',
            'After a long history of the company and team',
            'It should be left for the audience to work out',
          ], 1, 'Stating the main message early helps listeners follow everything that comes after it.'),
          q('What is the step most speakers skip in the point, evidence, meaning pattern?', [
            'Stating the main point clearly at the start of each section',
            'Showing a chart or a number as evidence',
            'Greeting the audience before the first slide',
            'Explaining what the evidence means for the listener',
          ], 3, 'Speakers often show evidence but forget to say what it means, leaving the audience to guess.'),
          q('You notice you are reading your slides aloud word for word. What does this suggest?', [
            'The slides have too much text on them',
            'The audience cannot read the slides well',
            'Your English pronunciation needs more work',
            'The presentation is too short for the slot',
          ], 0, 'Slides should support speech, so if you read them in full, they carry too much text.'),
        ]
      ),
      lesson('Signposting Language and Transitions', 12, `
Signposts on a road tell drivers where they are and what comes next. Signposting language does the same for listeners. It is the single fastest way to make your presentation sound organised, even if your grammar is not perfect.

### Why listeners need signposts

A reader can see headings, paragraphs and page numbers. A listener has only your voice. Without signposts, they lose track of where one point ends and the next begins. With them, even a nervous speaker sounds clear.

### Signposts for each stage

| Stage | Useful phrases |
|---|---|
| Introducing the talk | "Today I am going to talk about..." / "I have divided this into three parts." |
| Starting a point | "Let me start with..." / "First of all..." |
| Moving on | "Now let us move on to..." / "That brings me to my second point." |
| Giving an example | "For example..." / "To give you an idea..." |
| Referring to a slide | "As you can see here..." / "If you look at this chart..." |
| Going back | "As I mentioned earlier..." / "Coming back to the cost question..." |
| Summing up | "To sum up..." / "So, the key point is..." |
| Inviting questions | "I am happy to take any questions now." |

You do not need all of these. Choose one or two for each stage and use them every time until they feel natural.

### A short talk with signposts marked

\`\`\`text
"Good afternoon. Today I am going to talk about our new
returns process. I have divided this into three parts:
what is changing, why, and what it means for your team.

Let me start with what is changing. From next month,
customers can return items at any of our Lahore branches...

That brings me to my second point: why we are doing this.
As you can see on this chart, most complaints last quarter
were about returns...

Now let us move on to what this means for you...

So, to sum up: returns move to the branches, complaints
should drop, and your team needs a short training session.
I am happy to take any questions now."
\`\`\`

Read this aloud and notice how easy it is to follow, even without slides.

### Linking words inside a point

Inside each point, small linking words show how ideas connect:

| Meaning | Linking words |
|---|---|
| Adding | also, in addition, on top of that |
| Contrast | however, on the other hand, but |
| Cause | because, since, due to |
| Result | so, as a result, that is why |
| Sequence | first, then, after that, finally |

A common mistake is using "moreover" and "furthermore" in every sentence. These are fine in writing, but in speech they sound stiff. "Also" and "on top of that" sound more natural aloud.

### Common Urdu-speaker slips in presentations

- "Now I will discuss about the budget." The verb "discuss" does not take "about". Say "Now I will discuss the budget" or "Now I will talk about the budget."
- "Kindly see the next slide." "Kindly" is overused in South Asian English. "If you look at the next slide" sounds more natural.
- "The last point is that, that, that..." When you lose your place, pause silently instead of repeating a word. A two-second pause sounds confident. Repetition sounds nervous.

### Practice drill

Take any short report you have written recently. Without changing the content, add one signpost at the start, one between each point, and one at the end. Then record yourself giving it as a two-minute talk. Listen back and check: could a listener tell when each point started?
      `,
        [
          q('Why is signposting more important in a presentation than in a written report?', [
            'Presentations are always much longer than written reports',
            'Written reports do not need any structure',
            'Listeners cannot see headings and must follow by ear',
            'Signposting is required by most companies',
          ], 2, 'A listener has no visual headings, so spoken signposts show where each part begins and ends.'),
          q('Which sentence is correct?', [
            '"Now I will discuss the budget."',
            '"Now I will discuss about the budget."',
            '"Now I will discussing the budget."',
            '"Now I discuss about on the budget."',
          ], 0, 'The verb "discuss" takes a direct object without "about".'),
          q('You lose your place in the middle of a sentence. What is the best thing to do?', [
            'Repeat the last word until you remember',
            'Apologise several times and start the talk again',
            'Read the full slide text aloud from the top',
            'Pause silently for a moment, then continue',
          ], 3, 'A short silent pause sounds controlled, while repeating words sounds nervous.'),
        ]
      ),
      lesson('Describing Charts, Numbers and Trends', 14, `
Charts and numbers appear in almost every business presentation: sales, costs, website visits, customer complaints. Describing them clearly in English takes a small set of verbs, adverbs and prepositions. Get these right and your data sounds precise.

### Verbs for movement

| Direction | Verbs | Noun forms |
|---|---|---|
| Up | rise, increase, grow, go up, climb | a rise, an increase, growth |
| Down | fall, drop, decrease, decline, go down | a fall, a drop, a decrease, a decline |
| No change | stay the same, remain stable, level off | stability |
| Up and down | fluctuate | a fluctuation |
| Highest point | peak, reach a peak | a peak |
| Lowest point | hit a low, bottom out | a low |

Use the past tense for finished periods: "Sales rose in March." Use the present perfect for a period up to now: "Sales have risen since January."

### How big and how fast

Adverbs tell the audience the size and speed of the change:

- Large: sharply, significantly, dramatically
- Small: slightly, gradually, steadily
- Fast: rapidly, quickly
- Slow: gradually, slowly

"Orders rose sharply in Ramadan" paints a different picture from "Orders rose slightly in Ramadan". Choose carefully, because senior listeners notice when "dramatically" describes a small change.

### The preposition trap: by, to, from, at

These four small words change the meaning completely:

\`\`\`text
Sales rose BY 20 percent.          (the size of the change)
Sales rose TO 1.2 million rupees.  (the new level)
Sales rose FROM 1 million TO 1.2 million rupees.
Sales peaked AT 1.5 million rupees in April.
\`\`\`

The figures above are invented for practice. A common slip is "Sales increased of 20 percent". The correct preposition is "by".

### Percent versus percentage points

If a rate moves from 10 percent to 12 percent, it has risen by two percentage points, not by two percent. In percentage terms, that is a rise of 20 percent. Mixing these up is common even among native speakers, and finance colleagues will catch it. When in doubt, say the two numbers: "The return rate went from 10 to 12 percent."

### Large numbers: lakh, crore and million

In Pakistan and India, people often think in lakh and crore. International audiences use thousands, millions and billions. Convert before you present.

| South Asian | International |
|---|---|
| 1 lakh | 100,000 (one hundred thousand) |
| 10 lakh | 1,000,000 (one million) |
| 1 crore | 10,000,000 (ten million) |
| 100 crore | 1,000,000,000 (one billion) |

Also notice commas: 1,00,000 is the South Asian way to write one lakh. For international slides, write 100,000.

### Saying numbers aloud

- 3.5 is "three point five", not "three comma five".
- 1,250 is "one thousand two hundred and fifty" in British English (American speakers often drop the "and"), or "twelve hundred and fifty" informally.
- 2024 as a year is "twenty twenty-four".
- Say the currency clearly: "two hundred thousand rupees" or "PKR two hundred thousand".

### Describing a chart, step by step

1. Say what the chart shows: "This chart shows monthly online orders for our Islamabad store this year."
2. Point out the main trend: "Overall, orders rose steadily."
3. Highlight one or two key features: "There was a sharp peak in March, during Ramadan."
4. Explain the meaning: "So we should plan extra staff for next Ramadan."

Do not describe every bar. Pick what matters and explain why.
      `,
        [
          q('A rate moves from 10 percent to 12 percent. How should you describe the change accurately?', [
            'It rose by two percent',
            'It rose by two percentage points',
            'It rose to two percentage points',
            'It rose by twelve percent overall',
          ], 1, 'The difference between two rates is measured in percentage points, which is not the same as percent.'),
          q('Which sentence uses the correct preposition?', [
            '"Sales increased of 20 percent."',
            '"Sales increased on 20 percent."',
            '"Sales increased by 20 percent."',
            '"Sales increased at 20 percent."',
          ], 2, '"By" shows the size of a change, while "to" shows the new level.'),
          q('How much is one crore in international terms?', [
            'Ten million',
            'One million',
            'One hundred thousand',
            'One billion',
          ], 0, 'One crore equals 10,000,000, which is ten million.'),
        ]
      ),
      lesson('Handling Questions and Nerves', 12, `
For many learners, the question and answer part is scarier than the presentation itself. You can prepare your talk, but you cannot control the questions. The good news is that a small set of phrases and habits can handle almost any question calmly.

### Why nerves happen and what helps

Feeling nervous before speaking in English is normal, even for experienced professionals. Your heart beats faster and your mouth feels dry. These feelings do not mean you will do badly. What helps:

- **Practise aloud**, not just in your head. At least two full run-throughs.
- **Learn your first two sentences by heart.** The opening is when nerves are worst. Once you are past it, you relax.
- **Breathe slowly** before you start: in through the nose, out through the mouth, a few times.
- **Slow down.** Nerves make people speak fast. Aim to speak slightly slower than feels natural.
- **Look at friendly faces.** In any room, someone is nodding. Talk to them for the first minute.

### A simple way to answer any question

Use this four-step pattern:

\`\`\`text
1. Listen to the full question. Do not start answering early.
2. Thank or acknowledge:  "Good question." / "Thanks for asking that."
3. Answer briefly:        one or two sentences, then stop.
4. Check:                 "Does that answer your question?"
\`\`\`

The last step matters. Many speakers keep talking long after they have answered, which creates confusion and new questions.

### When you did not understand the question

Do not guess. Ask:

- "Sorry, could you repeat the question?"
- "Just to check I understand, are you asking about the cost or the timeline?"
- "Could you say a bit more about what you mean by 'scale'?"

Repeating the question in your own words also buys you a few seconds to think, and helps the rest of the room hear it.

### When you do not know the answer

This is the moment learners fear most. The honest answer is always the safest:

| Situation | Phrase |
|---|---|
| You do not know | "I do not have that figure with me. I will check and email you today." |
| Someone else knows | "Ayesha led that part. Ayesha, would you like to answer?" |
| Outside your area | "That is outside what I looked at, but I can find out who knows." |
| Needs more time | "That needs a proper answer. Can we discuss it after the meeting?" |

Never invent a number to look confident. A wrong figure in a presentation can follow you for months. Saying "I will check" sounds professional. Then make sure you do follow up.

### Difficult or hostile questions

Sometimes a question sounds like an attack: "Why should we trust these numbers?" Stay calm and treat it as a real question.

\`\`\`text
Question: "Why should we trust these numbers?"
Answer:   "Fair question. They come from the courier's own tracking
           report for September. I can share the raw file after
           the meeting if that helps."
\`\`\`

You do not need to win. You need to stay polite, give the facts, and offer a next step.

### Buying time politely

When you need a few seconds to think:

- "That is an interesting point. Let me think about that for a moment."
- "Good question. There are two parts to the answer."

Avoid fillers like "basically", "actually" and long "umm" sounds. A short silent pause is better.

### After the presentation

Note every question you could not answer and follow up the same day. Also note which questions surprised you. These are the questions to prepare for next time, and over time your list of prepared answers will grow.
      `,
        [
          q('Someone asks for a figure you do not have. What is the best response?', [
            'Give an approximate number that sounds right',
            'Ignore the question and move to the next slide',
            'Say the figure is confidential so that you can avoid answering the question',
            '"I do not have that figure with me. I will check and email you."',
          ], 3, 'Admitting you do not know and promising a follow up is professional, while invented figures damage trust.'),
          q('What is the final step in the four-step pattern for answering questions?', [
            'Repeat your whole presentation again from the start',
            'Check whether your answer has satisfied the questioner',
            'Thank the audience and end the session at once',
            'Invite the next question before answering this one',
          ], 1, 'Checking with "Does that answer your question?" stops you from talking too long and confirms understanding.'),
          q('Which habit helps most with nerves at the start of a presentation?', [
            'Speaking faster so the opening is over quickly',
            'Avoiding eye contact with everyone in the room',
            'Learning your first two sentences by heart',
            'Reading the whole talk from your notes',
          ], 2, 'Nerves are strongest at the opening, so a memorised start carries you into the talk with confidence.'),
        ]
      ),
      ],
      [
      q('What should you write before making any slides?', [
        'One sentence saying who the talk is for and what they should do',
        'A full script of every word you plan to say aloud',
        'A list of every chart and table that could possibly be included',
        'The history of the company and the project team',
      ], 0, 'A one-line purpose keeps every slide focused on the audience and the action you want.'),
      q('Which phrase best moves a presentation from the first point to the second?', [
        '"Kindly see this, moreover, furthermore."',
        '"Now I will discuss about the next thing."',
        '"That brings me to my second point."',
        '"That\'s it for this part, thank you."',
      ], 2, '"That brings me to my second point" is a clear, natural signpost between sections.'),
      q('Which sentence describes a large, sudden change?', [
        '"Orders rose slightly in March."',
        '"Orders remained stable in March."',
        '"Orders levelled off in March."',
        '"Orders rose sharply in March."',
      ], 3, '"Sharply" signals a large and fast movement, while the others describe small or no change.'),
      q('A colleague asks, "Why should we trust these numbers?" What is the best approach?', [
        'Tell them the question is unfair and move on',
        'Stay calm, explain the source and offer to share it',
        'Change the numbers to make them sound safer',
        'Ask the manager to answer every question for you',
      ], 1, 'Treating a challenging question as a real one, giving facts and offering a next step keeps trust intact.'),
      ]
    ),
    chapter(
      'Emails and Work Messages',
      'Write business emails with a clear subject, purpose and next step, set a tone that is polite and direct without sounding stiff, drop outdated phrases, and use WhatsApp, Slack and Teams messages well at work.',
      [
      lesson('The Shape of a Clear Business Email', 13, `
A busy manager in Karachi may receive dozens of emails a day. Most are opened on a phone and read for a few seconds. Your email must make its point quickly, or it gets left for later, and later often means never. The good news is that clear emails follow a predictable shape.

### The five parts of a clear email

| Part | What it does | Example |
|---|---|---|
| Subject line | Tells the reader what the email is about and if action is needed | "Approval needed: November ad budget by Thursday" |
| Greeting | Opens politely | "Hi Kamran," |
| Purpose | States why you are writing in the first line or two | "I am writing to ask for approval of the November budget." |
| Details | Gives only the information needed to act | Short paragraphs or a bullet list |
| Next step and close | Says what you need, by when, then signs off | "Could you approve it by Thursday? Thanks, Hina" |

If a reader saw only the subject and first line, would they know what you want? If not, rewrite the opening.

### Subject lines that work

A good subject line is specific and, where needed, signals the action.

| Weak | Strong |
|---|---|
| "Hello" | "Question about the Multan delivery schedule" |
| "Urgent!!!" | "Urgent: client site down since 9am" |
| "Report" | "September sales report attached for review" |
| "Meeting" | "Can we move Tuesday's meeting to 3pm?" |

Avoid writing "Urgent" unless something is truly urgent. If every email is urgent, none of them are.

### Put the purpose first

Many learners were taught to write a long, polite introduction before the request. In business email, this hides the point.

\`\`\`text
Before:
Dear Sir,
I hope this email finds you in the best of health. I am working
in the accounts department since 2021 and I have been handling
vendor payments. As you know, the year end is coming and there
are many tasks. In this regard I wanted to ask about the
leave policy...

After:
Hi Mr Rashid,
Could I take annual leave from 20 to 24 December?
My vendor payments for the month will be finished by the 18th,
and Faraz has agreed to cover any urgent queries.
Please let me know if those dates work.
Thanks,
Sara
\`\`\`

The second email is shorter, clearer and still polite. The reader can say yes in ten seconds.

### Make details easy to scan

- Keep paragraphs to two or three sentences.
- Use bullet points for lists of items, dates or questions.
- Put key dates and amounts where the eye will find them.
- If you have several questions, number them so the reply can answer "1, 2, 3".

\`\`\`text
Hi Usman,
Three quick questions about the Faisalabad order:

1. Can you confirm the delivery date?
2. Is the price still the same as the last order?
3. Who should we contact at the warehouse?

Thanks,
Ali
\`\`\`

### One email, one topic

If you need to discuss two unrelated things, such as an invoice problem and a holiday request, send two emails. Mixed topics get half answered, and they are hard to find later in a search.

### Greetings and sign-offs

| Situation | Greeting | Sign-off |
|---|---|---|
| First contact, formal | "Dear Ms Khan," | "Kind regards," |
| Colleague or regular client | "Hi Ayesha," | "Thanks," or "Best," |
| Group email | "Hi all," or "Hi team," | "Thanks," |

Follow the other person's lead. If a client replies with "Hi Ali" and signs off "Best", you can match that level.

### The final check

Before you send, read your email once as the receiver. Ask: what do they need to do, and is it obvious? Check names, dates and attachments. "Please find attached" with no attachment is one of the most common email mistakes in any office.
      `,
        [
          q('Where should the purpose of a business email appear?', [
            'At the end, after all the background details',
            'In the first line or two of the email',
            'Only in the subject line and nowhere else',
            'In a separate attachment for the reader to open',
          ], 1, 'Readers decide quickly whether to act, so the purpose belongs at the very start.'),
          q('Which subject line is the most useful?', [
            '"Hello from the accounts team"',
            '"Report for you to look at"',
            '"September sales report attached for review"',
            '"Urgent!!! Please read this report today, it matters"',
          ], 2, 'A specific subject line tells the reader what the email contains and what to do with it.'),
          q('You need to raise an invoice problem and request leave. What should you do?', [
            'Send two separate emails, one for each topic',
            'Put both topics in one long email to save time',
            'Mention only the more urgent topic and skip the other',
            'Ask about both topics on WhatsApp instead of email',
          ], 0, 'One topic per email gets both answered and makes each easy to find later.'),
        ]
      ),
      lesson('Tone: Polite and Direct Without Being Stiff', 13, `
Tone is how your email feels to the reader. Two emails with the same information can feel friendly or cold, respectful or rude. Learners from Pakistan and South Asia often face two opposite problems: sounding too formal and old fashioned, or sounding too blunt when they try to be short.

### The tone scale

| Too stiff | Natural and professional | Too blunt |
|---|---|---|
| "It is hereby requested that the report be submitted." | "Could you send the report by Friday?" | "Send the report." |
| "Your kind attention is required." | "Could you take a look at this?" | "Look at this." |
| "I humbly request your good self." | "I would like to ask you." | "I want." |

The middle column is your target: polite, clear, and sounding like a real person.

### Softening requests

English uses small words to make requests polite. Direct commands can sound rude in English even when they are normal in Urdu, where tone of voice does the softening.

| Direct | Softer |
|---|---|
| "Send me the file." | "Could you send me the file?" |
| "Tell me the price." | "Can you let me know the price?" |
| "I need this today." | "Would it be possible to get this today?" |
| "You did not reply." | "I am just following up on my last email." |

"Could you" and "would it be possible" are the two most useful softeners in business email.

### But do not over-soften

Too much softening hides the request. Compare:

\`\`\`text
Over-soft:
"Sorry to disturb you, I know you are very busy, and please
ignore this if it is not convenient, but I was just wondering
if maybe at some point you might be able to look at the invoice?"

Better:
"Could you check the attached invoice by Wednesday? The vendor
needs payment before the 30th."
\`\`\`

The better version is still polite, and it includes a reason and a deadline. Giving a reason is one of the best ways to sound polite and direct at the same time.

### Respect without bowing

Respect for seniors is important in South Asian workplaces, and that is a strength. But very deferential phrases can sound strange to international readers.

- "Respected Sir" is common locally but unusual in international email. "Dear Mr Ahmed" works everywhere.
- "Your good self" sounds very old fashioned. Use "you".
- "I shall be highly obliged" can become "I would really appreciate it".

When writing to a local senior colleague, follow your company's habits. When writing to clients or colleagues abroad, choose the plainer, international version.

### Positive framing

Small word choices change the feel of an email.

| Negative framing | Positive framing |
|---|---|
| "We cannot deliver before Monday." | "We can deliver on Monday." |
| "You forgot to attach the file." | "I think the file did not come through. Could you resend it?" |
| "Your request is not possible." | "Here is what we can do instead." |

The facts are the same. The positive version keeps the relationship comfortable.

### Exclamation marks, capitals and emojis

- One exclamation mark in a friendly line is fine: "Thanks for this!" Several in a row look unprofessional.
- Writing in CAPITALS reads as shouting.
- Emojis are normal in some internal chats, but avoid them in formal email and with new clients.

### Read it aloud

The fastest tone check is to read your email aloud in your head as if a stranger said it to you. If it sounds like a government notice, make it plainer. If it sounds like an order, add "could you" and a reason. If it sounds like an apology for existing, cut the extra softeners.
      `,
        [
          q('Which request has the most natural professional tone?', [
            '"It is hereby requested that the report be submitted."',
            '"Send the report to me today."',
            '"Could you send the report by Friday?"',
            '"I humbly request your good self for the report."',
          ], 2, '"Could you" with a clear deadline is polite and direct without sounding stiff or bossy.'),
          q('What is a good way to sound polite and direct at the same time?', [
            'Give a clear reason and a deadline with your request',
            'Apologise several times before you make the request',
            'Write the request in capital letters so it is noticed',
            'Use "Respected Sir" in every email to every reader',
          ], 0, 'A reason and a deadline make a request clear while showing respect for the reader\'s time.'),
          q('Which line reframes "You forgot to attach the file" positively?', [
            '"You must attach the file before sending anything to me again."',
            '"Please be more careful next time with your files."',
            '"The file is missing, as usual, from your email."',
            '"I think the file did not come through. Could you resend it?"',
          ], 3, 'Positive framing states the problem without blame and asks for the next step.'),
        ]
      ),
      lesson('Common Email Mistakes and Outdated Phrases', 13, `
Much of the email English taught in schools and found in old office templates comes from letter writing many decades ago. Phrases like "do the needful" or "please revert" are widely used in South Asia but can confuse or amuse international readers. This topic gives you modern replacements.

### Outdated phrases and modern alternatives

| Outdated or regional | Modern, international |
|---|---|
| "Please do the needful." | "Could you please process the refund?" (say exactly what) |
| "Kindly revert." | "Please reply." / "Let me know." |
| "Please find enclosed herewith." | "I have attached..." |
| "I am writing this mail to inform you that..." | Start with the information itself |
| "Prepone the meeting." | "Bring the meeting forward." / "Move the meeting earlier." |
| "Intimate me." | "Let me know." / "Inform me." |
| "Same is attached for your reference." | "I have attached it." |

"Revert" means return to an earlier state, so "please revert" can puzzle a reader outside South Asia. "Prepone" is understood in India and Pakistan but is not standard international English. "Intimate" usually suggests something personal, so avoid it in a work context.

### Grammar slips that appear in emails

| Mistake | Correct |
|---|---|
| "I have sent you the file yesterday." | "I sent you the file yesterday." |
| "Please send me the details of same." | "Please send me the details." |
| "I didn't received your email." | "I didn't receive your email." |
| "Looking forward to hear from you." | "Looking forward to hearing from you." |
| "Waiting for your positive response." | "I look forward to your reply." |
| "PFA" | "I have attached the file." |

A finished time such as "yesterday" or "last week" takes the past simple, not the present perfect. In "looking forward to", the "to" is a preposition, so the verb after it takes -ing. "Waiting for your positive response" can sound as if you are pressing the reader to say yes.

Abbreviations like PFA (please find attached) and "pls" are common in local offices but look careless to new clients. Write words out in full.

### Mistakes of content, not grammar

Some of the worst email mistakes are not language errors at all:

1. **Reply all by mistake.** Before sending, check who is in the "To" and "CC" lines.
2. **Missing attachment.** Attach the file before writing the email, so you never forget.
3. **Wrong name.** Writing "Hi Sana" to a person called Saima is a fast way to look careless.
4. **No clear action.** The reader finishes and does not know what to do.
5. **Emotional replies.** Never send an angry email at once. Save it as a draft and reread it later.

### CC and BCC

- **To**: people who must act.
- **CC**: people who need to know, but not act.
- **BCC**: hidden recipients. Use it for large external lists so you do not share everyone's address. Avoid using it to secretly copy your boss on a disagreement, because it damages trust if discovered.

### A before and after

\`\`\`text
Before:
Dear Sir,
PFA the quotation. Kindly do the needful and revert at the
earliest. Myself Imran from Al Noor Traders, Gujranwala.
Regards

After:
Dear Mr Siddiqui,
I have attached our quotation for 500 school bags.
Could you confirm the order by Friday so we can start
production next week?
Kind regards,
Imran Ali
Al Noor Traders, Gujranwala
\`\`\`

The second version says exactly what is attached, what action is needed and when.

### Self-editing checklist

Before you press send, check:

- Is the purpose in the first two lines?
- Have you replaced any outdated phrases?
- Is every abbreviation written out?
- Are names, dates and amounts correct?
- Is the attachment actually attached?

Five quick checks can save a long chain of confused replies.
      `,
        [
          q('Why should you avoid "Please intimate me" in a work email?', [
            'It is too long for a short work message',
            '"Intimate" usually suggests something personal',
            'It is only correct in American business English',
            'It makes the email sound far too casual for clients',
          ], 1, 'Outside South Asia, "intimate" usually refers to close personal matters, so "let me know" is the safe choice at work.'),
          q('Which email sentence is grammatically correct?', [
            '"I have sent you the file yesterday."',
            '"Looking forward to hear from you soon."',
            '"I didn\'t received your email on Monday."',
            '"I sent you the file yesterday."',
          ], 3, 'A finished time such as yesterday takes the past simple; the others break the -ing rule after "looking forward to" or the base verb rule after "didn\'t".'),
          q('Who should go in the CC line of an email?', [
            'People who must take action on the email',
            'People who need to know but do not need to act',
            'People you want to hide from the other readers',
            'Only people outside your own company',
          ], 1, 'CC is for people who should stay informed, while those who must act go in the To line.'),
        ]
      ),
      lesson('WhatsApp, Slack and Teams Messages at Work', 12, `
In many Pakistani businesses, especially smaller ones, WhatsApp groups run daily operations: orders, staff updates, supplier chats. In larger companies and remote roles, Slack and Microsoft Teams are common. Chat messages are faster and more informal than email, but they still need care.

### When to use chat and when to use email

| Use chat for | Use email for |
|---|---|
| Quick questions with short answers | Formal requests, approvals and decisions |
| Coordinating in real time | Anything that needs a record later |
| Friendly team updates | Messages to new clients or senior external contacts |
| Simple confirmations | Long or detailed information |

If you would need to find the message again in six months, it probably belongs in email or a shared document.

### Do not just say "Hi"

One of the most common chat habits is sending only "Hi" or "Salam" and waiting for a reply before asking the real question. The other person has to stop, reply, and wait again.

\`\`\`text
Less helpful:
Ali: Hi
(waits ten minutes)
Ali: Are you there?
(waits again)

More helpful:
Ali: Hi Sana, quick question: is the Lahore stock report
     ready? Finance wants it by 3pm today.
\`\`\`

Greet and ask in one message. It is still polite, and it saves time for both people.

### Keep messages complete but short

- Put the question or update first.
- One message is better than five short ones sent in a row, which trigger five notifications.
- Use line breaks for lists.
- Mention the person by name with @ in group chats so they know it is for them.

### Voice notes in work chats

Voice notes are very common in South Asian work groups. They are fine for quick, informal updates, but they have limits: the receiver cannot skim them, search them or listen in a meeting. For anything with numbers, addresses or instructions, type it. Recording longer voice messages well is a separate skill covered earlier in the course.

### Tone in short messages

Short messages can sound colder than you intend.

| Can sound abrupt | Warmer version |
|---|---|
| "ok" | "Okay, thanks!" |
| "Why is this late?" | "Hi, any update on this? The client is asking." |
| "Do it today." | "Could you do this today if possible?" |
| "?" | "Did you get a chance to look at my last message?" |

A single "k" or "ok" can feel dismissive, especially to a senior colleague. Adding "thanks" costs two seconds.

### Group chat manners

- Stay on topic. Do not forward unrelated videos or greetings to a work group.
- Reply in a thread when the tool allows it, so conversations stay organised.
- Avoid "Thanks" replies from twenty people. A thumbs up reaction is enough.
- Respect working hours. A message at 11pm about a non-urgent task can be scheduled for the morning if your tool allows it.

### Roman Urdu and code switching

Many local teams chat in a mix of English and Roman Urdu. That is normal inside a team that shares it. With international colleagues, clients or new contacts, switch fully to English. If you are unsure whether everyone in a group reads Urdu, use English.

### Status and availability

On Slack and Teams, your status tells people whether to expect a reply. Update it when you are in a meeting, on leave or working different hours: "On leave until Monday, contact Faraz for urgent issues." This small habit prevents a lot of unanswered messages and frustration.
      `,
        [
          q('Why is sending only "Hi" and waiting for a reply unhelpful in work chat?', [
            'Greetings on their own are considered rude on Slack and Microsoft Teams',
            'Chat tools do not deliver very short messages',
            'The other person must reply and wait before learning your question',
            'It breaks the company\'s written email policy',
          ], 2, 'Combining the greeting and the question in one message saves time for both people.'),
          q('Which kind of message is better sent by email than chat?', [
            'A quick yes or no question to a teammate',
            'A friendly reminder about lunch at the office',
            'Confirming you have joined the video call',
            'A formal approval that needs a record later',
          ], 3, 'Decisions and approvals that must be found later belong in email or a shared document.'),
          q('A senior colleague asks if you sent the file. Which reply sounds best?', [
            '"Yes, sent it a few minutes ago. Thanks!"',
            '"k, check your inbox again please"',
            '"? I already sent it this morning"',
            '"Yes obviously, check your inbox before asking me."',
          ], 0, 'A short reply with a thank you sounds warm, while "k" or "?" can feel dismissive.'),
        ]
      ),
      ],
      [
      q('A manager will read your email on a phone in a few seconds. What matters most?', [
        'A specific subject and the purpose in the first lines',
        'A long polite introduction before the main request',
        'Several attachments that explain the background',
        'Formal phrases such as "your good self"',
      ], 0, 'A clear subject and an early purpose let a busy reader act quickly.'),
      q('Which request is polite but not over-softened?', [
        '"Sorry to disturb, please ignore if you are busy, but maybe you might look at it?"',
        '"Check the invoice and pay the vendor today, nothing else."',
        '"Could you check the invoice by Wednesday? The vendor needs payment."',
        '"I humbly request your good self to check the invoice."',
      ], 2, 'It uses "could you", gives a deadline and a reason, and avoids both stiffness and bluntness.'),
      q('What is the modern alternative to "Please find enclosed herewith"?', [
        '"Please do the needful with this."',
        '"Same is attached for reference."',
        '"PFA for your kind perusal."',
        '"I have attached..."',
      ], 3, '"I have attached" is the plain, modern way to mention an attachment.'),
      q('You are unsure whether everyone in a work group reads Urdu. What should you write in?', [
        'Roman Urdu, since most people will understand it',
        'English, so every member can follow the message',
        'A voice note, so tone is clear to everyone',
        'A mix of both, alternating sentence by sentence',
      ], 1, 'When you are not sure everyone shares Urdu, English keeps the whole group included.'),
      ]
    ),
    chapter(
      'Reports and Longer Writing',
      'Write short reports and status updates that lead with the key message, take clear meeting minutes, handle requests, complaints and apologies in writing, and proofread your own work before anyone else sees it.',
      [
      lesson('Writing Short Reports and Status Updates', 13, `
Most workplace reports are not long documents with chapters. They are one or two pages, or a weekly update in an email: what happened, what it means and what comes next. Writing them clearly is one of the fastest ways to be noticed by managers.

### Lead with the conclusion

School essays build up to a conclusion at the end. Business reports do the opposite. The reader wants the answer first, then the support.

\`\`\`text
School style:
"In September we visited 40 shops in Rawalpindi. We spoke to
owners about our biscuits. Many said the packaging was attractive.
Some mentioned price. After analysis, we found that..."

Business style:
"Summary: Shop owners in Rawalpindi like our packaging, but most
say our price is higher than the main competitor's. We recommend
a smaller, cheaper pack for this market.

Details below."
\`\`\`

The business version lets a busy manager stop after three lines and still know the result. The numbers in a real report should come from your own data.

### A simple report structure

| Section | What goes in it |
|---|---|
| Summary | The main finding and recommendation in two or three sentences |
| Background | Why the report was written, in one short paragraph |
| Findings | What you found, with evidence, often as bullet points or a table |
| Recommendations | What you suggest doing, numbered |
| Next steps | Who does what, by when |

For a one-page report, each section may be only a few lines. The headings still help the reader find what they need.

### The weekly status update

Many teams, especially in remote and freelance work, ask for a weekly update. A common format is done, next, blocked.

\`\`\`text
Subject: Weekly update, website project, week of 6 October

Done
- Product pages for the Karachi store are live
- Payment page tested with two local banks' cards

Next
- Add Urdu language option to the menu
- Fix slow loading on the home page

Blocked
- Waiting for final logo files from the client
  (asked on 2 October, reminder sent today)

Overall: on track for launch on 25 October.
\`\`\`

The "Blocked" section is the most useful one for a manager, because it shows where they can help. Do not hide problems in a status update. Raising them early is a sign of professionalism, not failure.

### Status words that are clear

| Vague | Clear |
|---|---|
| "Work is going on." | "The design is 80 percent complete; testing starts Monday." |
| "There are some issues." | "Two pages load slowly on mobile; Owais is fixing them." |
| "Will be done soon." | "Will be done by Thursday afternoon." |
| "Almost finished." | "Finished except the final client review." |

"Work is going on" is very common in local offices, and it tells the reader nothing. Replace it with what, how much and when.

### Writing style for reports

- **Short sentences.** One idea per sentence.
- **Active voice.** "We tested the system" is clearer than "The system was tested by us."
- **Numbers over adjectives.** "Complaints fell from 30 to 12" is stronger than "Complaints decreased greatly".
- **Consistent tense.** Use the past for what happened, the present for what is true now, and "will" for plans.

### Headings and tables

If a section has more than five or six lines, give it a heading. If you are comparing items, such as three suppliers on price, delivery time and quality, use a table. A table that takes ten seconds to read can replace three paragraphs.

### Check before sending

Read your summary alone. Does it answer the question the reader asked? If your manager asked "Should we enter the Rawalpindi market?", the summary must say yes, no, or "yes, with conditions". Everything else in the report supports that answer.
      `,
        [
          q('Where should the main finding appear in a business report?', [
            'At the end, after the reader has seen all the details',
            'At the start, in a short summary section',
            'In the appendix, for readers who want more detail',
            'Nowhere, the reader should work it out from the data',
          ], 1, 'Business readers want the answer first, so the summary leads with the main finding.'),
          q('In a done, next, blocked update, why is the "Blocked" section so useful?', [
            'It lets you blame other people for delays',
            'It makes the update look longer and more detailed',
            'It replaces the need for any other sections',
            'It shows the manager exactly where they can help',
          ], 3, 'Listing blockers early lets a manager remove obstacles before they delay the project.'),
          q('Which status line is the clearest?', [
            '"The design is 80 percent complete; testing starts Monday."',
            '"Work is going on and progress is being made."',
            '"There are some issues here and there, but things are fine overall."',
            '"It will be done soon, hopefully, as planned."',
          ], 0, 'A clear status says how much is done and when the next step happens.'),
        ]
      ),
      lesson('Meeting Minutes and Summaries', 13, `
Minutes are the written record of a meeting. For a quick team call, a short follow-up note is often enough. For board meetings, client meetings, committee meetings or anything where decisions must be traceable later, proper minutes are expected. Being the person who takes good minutes is a quiet way to become trusted in any team.

### What minutes are, and are not

Minutes are not a transcript. Nobody needs to know that Kamran said "I think" three times. Minutes record:

- Who attended, and who sent apologies
- What was discussed, briefly
- What was decided
- Who will do what, by when

| Include | Leave out |
|---|---|
| Decisions and the main reasons | Every comment word for word |
| Action points with owners and dates | Jokes, side talk and repetition |
| Disagreements that affect a decision | Personal opinions of the note taker |
| Date of the next meeting | Long background everyone already knows |

### A standard minutes format

\`\`\`text
Minutes: Monthly operations meeting
Date: 14 October, 10:00 to 11:00
Location: Head office, Gulberg, Lahore / Teams
Present: Rashid Ahmed (chair), Hina Malik, Usman Tariq, Faraz Ali
Apologies: Sana Iqbal
Minutes taken by: Hina Malik

1. Courier performance
   Usman reported continued late deliveries in Karachi.
   Decision: Trial a second courier for Karachi in November.
   Action: Usman to sign trial agreement by 18 October.

2. Warehouse stock count
   Faraz reported a shortfall in the dairy section.
   Decision: Finance to review August write-offs.
   Action: Faraz to send count sheets to finance by 16 October.

3. AOB
   None.

Next meeting: 11 November, 10:00
\`\`\`

Notice the numbered items match the agenda. This makes minutes easy to check against what was planned.

### Reported speech in minutes

Minutes usually describe what people said rather than quoting them. This is called reported speech, and it normally uses the past tense.

| What was said | In the minutes |
|---|---|
| "The courier is late again." | Usman reported that the courier was late again. |
| "We should try a second courier." | Hina suggested trying a second courier. |
| "I disagree, it will cost more." | Faraz raised a concern about the extra cost. |
| "Okay, let us do it." | The chair approved the proposal. |

Useful verbs: reported, suggested, proposed, raised a concern, agreed, approved, confirmed, noted.

### Neutral language

The note taker must stay neutral. Write "Faraz raised a concern about cost," not "Faraz complained again about cost." Write "The proposal was not approved," not "Hina's weak proposal was rejected." Minutes are a shared record, and loaded words can cause real conflict.

### Taking notes during the meeting

You cannot write everything, so use a simple system:

1. Prepare a template before the meeting, with the agenda items already typed.
2. Under each item, write only D for decision, A for action and Q for open question.
3. If you miss something, ask: "Sorry, could I confirm the action on that one?" This is expected from a note taker.
4. Write up the final version within a day, while it is fresh.

### Sending and correcting

Send the minutes to all attendees with a short line: "Please find the minutes below. Let me know of any corrections by Friday." Silence after the deadline usually means people accept them. In formal settings, the minutes are approved at the start of the next meeting.
      `,
        [
          q('What should meeting minutes mainly record?', [
            'Every comment made, word for word, in order',
            'The note taker\'s personal opinions on each item',
            'Attendees, decisions and actions with owners and dates',
            'Only the jokes and side conversations for team spirit',
          ], 2, 'Minutes are a record of who attended, what was decided and who will do what, not a transcript.'),
          q('How would "We should try a second courier" usually appear in minutes?', [
            'Hina suggested trying a second courier.',
            'Hina says we should try a second courier.',
            'We should try a second courier, Hina said loudly.',
            'Hina was insisting about second courier.',
          ], 0, 'Minutes use neutral reported speech, usually in the past tense, with a verb such as "suggested".'),
          q('Which line is the most neutral for minutes?', [
            'Faraz complained again about the cost as usual.',
            'Faraz wrongly argued against the excellent plan.',
            'Faraz was negative about everything today.',
            'Faraz raised a concern about the extra cost.',
          ], 3, 'Neutral verbs like "raised a concern" record the point without judging the person.'),
        ]
      ),
      lesson('Requests, Complaints and Apologies in Writing', 14, `
Some of the most important workplace writing is also the most uncomfortable: asking for something, complaining about a problem, or apologising for a mistake. Each has a reliable shape. Following it keeps you polite, clear and in control, even when you are frustrated or embarrassed.

### Writing a request

A strong written request has four parts: what you want, why, by when, and thanks.

\`\`\`text
Subject: Request: access to the sales dashboard

Hi Owais,

Could you give me view access to the sales dashboard?
I need it to prepare the monthly report for the Islamabad
region, which is due on the 5th.

If possible, could access be set up by Wednesday?

Thanks a lot,
Mehwish
\`\`\`

Giving the reason makes the request easier to approve. Asking "if possible" with a date is polite but still clear.

### Writing a complaint

Complaints are best when they are factual and calm. Anger in writing almost always works against you, and the email may be forwarded to people you did not expect.

| Part | Example |
|---|---|
| Context | "On 3 October we received order 4512, 200 cartons of cooking oil." |
| Problem | "Thirty cartons were damaged and leaking." |
| Impact | "We could not supply two of our Hyderabad retailers on time." |
| Request | "Please arrange replacement cartons by 10 October." |
| Close | "We value working with you and hope to resolve this quickly." |

Notice what is missing: insults, capitals, threats and long stories. Attach photos or documents as evidence and refer to them.

### Phrases for complaints

- "I am writing about a problem with order 4512."
- "Unfortunately, the delivery did not match the order."
- "I would appreciate it if you could replace the damaged items."
- "Could you let me know what steps you will take?"

If you have complained before without a result, it is fine to be firmer: "This is the second time I have raised this issue, and I need a resolution by Friday."

### Writing an apology

A good written apology does three things: takes responsibility, explains briefly, and says what happens next.

\`\`\`text
Subject: Apology for the late report

Hi Rashid,

I am sorry the September report reached you two days late.
I underestimated the time needed to check the Karachi figures.

The full report is attached. From next month I will start
the checks a week earlier so this does not happen again.

Best regards,
Ali
\`\`\`

The apology is short and specific. It does not blame others, and it does not over-apologise.

### Apology mistakes to avoid

| Avoid | Why | Better |
|---|---|---|
| "Sorry for the inconvenience caused, if any." | "If any" sounds like you doubt there was a problem | "I am sorry for the delay." |
| "Mistakes happen, it was not my fault." | Sounds defensive | "I should have checked the figures earlier." |
| "Extremely, extremely sorry, sir, please forgive." | Too much, sounds anxious | "I am very sorry about this." |
| A long story about the server, traffic and load shedding | The reader wants the fix, not the excuse | One sentence of reason, then the solution |

### Responding when someone else complains to you

Thank them for raising it, confirm the facts, and say what you will do. Handling customer complaints on chat and phone is a separate skill covered later in the course. In internal emails, the same calm, factual pattern works.

### Before sending a difficult message

Write the draft, then wait. If you are upset, reread it after an hour or the next morning. Ask a trusted colleague to read it if the stakes are high. A calm message you sent tomorrow is far better than an angry one you regret today.
      `,
        [
          q('What are the four parts of a strong written request?', [
            'Greeting, background, history and long thanks',
            'Apology, complaint, warning and signature',
            'What you want, why, by when, and thanks',
            'Subject line, CC list, attachments and emojis',
          ], 2, 'A request with a reason and a clear date is easier for the reader to approve quickly.'),
          q('Why is "Sorry for the inconvenience caused, if any" a weak apology?', [
            '"If any" suggests you doubt there was a real problem',
            'It is too short to be taken seriously by a client',
            'Apologies should never mention the inconvenience',
            'It uses the word "sorry", which sounds informal',
          ], 0, 'Adding "if any" undermines the apology by questioning whether harm happened.'),
          q('Which element should a calm written complaint include?', [
            'A detailed description of how angry you feel',
            'A warning written in capital letters at the top',
            'Threats to post about the company online',
            'The impact of the problem and a clear request',
          ], 3, 'Stating the impact and what you want done gives the reader a clear way to resolve the issue.'),
        ]
      ),
      lesson('Proofreading and Editing Your Own Writing', 12, `
Everyone makes mistakes when writing, including native speakers and professional writers. The difference is that careful writers find and fix them before anyone else sees them. Proofreading is a habit, not a talent, and a few minutes of it makes your writing look far more professional.

### Editing and proofreading are different

| Step | Question it answers | When |
|---|---|---|
| Editing | Is the message clear, complete and well organised? | First |
| Proofreading | Are spelling, grammar, names and numbers correct? | Last |

Do not proofread a draft you may still rewrite. Fix the big things first: is the purpose clear, is anything missing, can anything be cut? Then check the small things.

### Editing: cut and simplify

Most first drafts are too long. Look for:

- **Repeated ideas.** If two sentences say the same thing, keep the better one.
- **Empty phrases.** "Due to the fact that" becomes "because". "At this point in time" becomes "now". "In order to" usually becomes "to".
- **Long sentences.** If a sentence has more than about 25 words, try splitting it.
- **Passive voice where active is clearer.** "A decision was taken by management" becomes "Management decided".

\`\`\`text
Before (38 words):
"Due to the fact that the stock has not yet been received by us
from the supplier at this point in time, it is not possible for us
to dispatch the orders in order to meet Friday's deadline."

After (18 words):
"We have not received the stock from the supplier yet, so we
cannot dispatch the orders by Friday."
\`\`\`

### Proofreading: a checklist for Urdu speakers

Certain errors appear again and again in writing by Urdu speakers. Check for them on purpose.

| Check | Common error | Correct |
|---|---|---|
| Articles | "Please send report." | "Please send the report." |
| Plurals | "We have many informations." | "We have a lot of information." |
| Verb after "did" | "Did you received it?" | "Did you receive it?" |
| Agreement | "The list of items are attached." | "The list of items is attached." |
| Its and it's | "The company changed it's policy." | "The company changed its policy." |
| Question order in statements | "Tell me where is the file." | "Tell me where the file is." |

Add the slips from Chapter 1, such as "since" and "for" and uncountable nouns like "information", to this list if you still make them. "It's" always means "it is" or "it has"; the possessive is "its", with no apostrophe.

### Techniques that work

1. **Take a break.** Even five minutes away from the text helps you see it fresh.
2. **Read aloud.** Your ear catches missing words and awkward sentences that your eye skips.
3. **Change the view.** Read on your phone if you wrote on a laptop, or print it out.
4. **Read the numbers separately.** Check every date, amount, phone number and name against the source. A wrong figure in a quote or invoice costs more than a grammar slip.
5. **Check one thing at a time.** Do one pass for names and numbers, another for grammar.

### Using tools wisely

Spell checkers and grammar tools, including free ones built into email and word processors, catch many errors. AI writing assistants can suggest clearer wording. These are useful, but:

- They can miss correctly spelled words in the wrong place, such as "form" instead of "from".
- They may change your meaning or make your tone too formal.
- They do not know your facts, names or numbers.

Use them as a first filter, then read the final version yourself. Never paste confidential company or client information into a public online tool without checking your company's policy first.

### Keep an error log

Write down every mistake a manager, client or tool points out, with the corrected version. After a month, you will see your personal pattern: perhaps articles, perhaps tenses. Then you know exactly what to check every time. This turns proofreading from a general worry into a short, targeted routine.
      `,
        [
          q('What is the right order for editing and proofreading?', [
            'Proofread first, then decide what the message should say',
            'Edit for clarity and content first, then proofread details',
            'Do both at the same time in one quick reading',
            'Edit only, since proofreading is the reader\'s job',
          ], 1, 'Fixing structure first avoids wasting time correcting sentences you later delete.'),
          q('Which sentence puts the words in the right order?', [
            '"Tell me where is the file."',
            '"Can you tell me where is it the file?"',
            '"Tell me where the file is it."',
            '"Can you tell me where the file is?"',
          ], 3, 'Inside a longer sentence or an indirect question, the subject comes before the verb, so it is "where the file is", not "where is the file".'),
          q('Why should you still read the final text yourself after using a grammar tool?', [
            'Tools can miss real words in the wrong place and do not know your facts',
            'Grammar tools are not allowed in most professional workplaces at all',
            'Tools always make text much shorter than intended',
            'Reading aloud is required before any email is sent',
          ], 0, 'Tools cannot check names, numbers or meaning, and they miss real words used wrongly.'),
        ]
      ),
      ],
      [
      q('Which phrase gives a manager the least useful status information?', [
        '"Testing starts Monday."',
        '"Two pages load slowly; Owais is fixing them."',
        '"Work is going on."',
        '"Finished except the final client review."',
      ], 2, '"Work is going on" gives no detail on progress, problems or timing.'),
      q('What is the difference between a transcript and minutes?', [
        'Minutes are longer and include every comment made',
        'Minutes record decisions and actions, not every word said',
        'A transcript is always shorter than the minutes',
        'There is no difference, because the two words mean exactly the same',
      ], 1, 'Minutes summarise what was decided and assigned, while a transcript records everything said.'),
      q('You are angry about a supplier\'s mistake. What should you do before sending your complaint?', [
        'Send it at once while the problem is still fresh',
        'Wait, reread the draft calmly and keep it factual',
        'Add capital letters so the supplier takes it seriously',
        'Copy every customer on the email as witnesses',
      ], 1, 'A calm, factual complaint is more effective, and waiting helps remove anger from the draft.'),
      q('How can "Due to the fact that" be edited?', [
        '"Owing to the fact of"',
        '"In view of the fact that"',
        '"Because"',
        '"Due to the reason that"',
      ], 2, '"Because" says the same thing in one plain word.'),
      ]
    ),
    chapter(
      'Negotiation and Persuasion',
      'Learn the English of persuading people, making and answering offers, refusing a request while keeping the relationship, and confirming what was agreed in a clear written note.',
      [
      lesson('The Language of Persuasion', 13, `
Persuasion at work is rarely about clever speeches. It is about making a clear request, giving a reason the other person cares about, and making it easy for them to say yes. Many South Asian professionals know what they want but either ask too softly ("if possible, maybe, kindly consider") or too hard ("you must approve this"). Good persuasive English sits in the middle.

### Start from their interest, not yours

Compare two ways a sales executive in Karachi might ask a manager for a second delivery van:

| Weak | Stronger |
|---|---|
| I need another van, we are very busy. | Orders in DHA and Clifton are now arriving late two or three times a week. A second van would let us keep our same-day promise. |
| Please approve, it is urgent. | If we can decide by Friday, I can have the van running before the month-end rush. |

The stronger version names a problem the manager already worries about (late deliveries, broken promises) and links the request to solving it. That is the core move: **problem, proposal, benefit**.

### A simple persuasion pattern

\`\`\`text
Problem:   "Right now, customers wait up to a week for refunds."
Proposal:  "I suggest we let branch managers approve refunds under a set limit."
Benefit:   "Customers get their money faster and head office handles fewer requests."
Ask:       "Could we try it in two branches for one month?"
\`\`\`

Notice the last line. A small, low-risk ask ("try it in two branches") is easier to accept than a big permanent change. Pilots, trials and "let's review in a month" are powerful persuasive tools because they lower the cost of saying yes.

### Useful phrases

| Purpose | Phrases |
|---|---|
| Introduce a suggestion | I'd like to suggest... / What if we... / One option is to... |
| Give a reason | The main reason is... / This would help us... / The advantage is... |
| Use evidence | Last quarter we saw... / Our customer feedback shows... / For example... |
| Acknowledge concerns | I understand the cost is a concern. / That's a fair point. |
| Make a soft ask | Would you be open to...? / Could we try...? / How would you feel about...? |

"Would you be open to..." is especially useful. It is polite, it is clearly a request, and it invites a real answer rather than a forced yes.

### Evidence beats adjectives

Words like "very", "really", "extremely" and "huge" do little to persuade. A specific example does more. Instead of "Customers are very unhappy", say "Three customers complained about the same delay last week, and one cancelled a repeat order." Use only facts you can show. If you are estimating, say so: "My rough estimate is..." Stating a guess as a fact can destroy trust when someone checks.

### Common mistakes by Urdu speakers

| Mistake | Better |
|---|---|
| Kindly do the needful. | Could you please approve the attached request? |
| You have to agree, it is the best option. | I think this is the strongest option, and here is why. |
| Sir, please, please consider. | I'd really appreciate it if you could consider this. |
| I am requesting you to... | Could you...? / I'd like to ask you to... |

Repeating "please" or adding "sir" to every line can sound like begging, which weakens your position. One polite request with a good reason is more persuasive than five pleas.

### Drill

Pick one real change you want at work or in your studies. Write it in four lines using problem, proposal, benefit and ask. Read it aloud. If any line contains only adjectives and no fact, rewrite it with a specific example.
      `,
        [
          q('What is the basic persuasion pattern recommended in this topic?', [
            'Compliment, complaint, threat, deadline',
            'Problem, proposal, benefit, then a clear ask',
            'Greeting, apology, request, repeated thanks',
            'Opinion, emotion, urgency, final warning',
          ], 1, 'Naming a problem the listener cares about, proposing a fix and showing the benefit gives them a reason to agree.'),
          q('Why does suggesting a short pilot or trial often help persuade a manager?', [
            'It means the manager has no real choice to make',
            'It removes the need to give any reasons',
            'It lowers the risk and cost of saying yes',
            'It guarantees the idea will become permanent',
          ], 2, 'A small, reversible step is easier to approve than a large permanent change.'),
          q('Which sentence is the most persuasive way to describe a problem?', [
            'Customers are extremely, extremely unhappy with us these days.',
            'Everyone knows our service is really bad now.',
            'Sir, please believe me, this is a huge problem.',
            'Three customers complained about the same delay last week.',
          ], 3, 'A specific, checkable example persuades better than adjectives or pleading.'),
        ]
      ),
      lesson('Making Offers and Counteroffers', 14, `
Negotiation happens far more often than people think: agreeing a price with a supplier in Faisalabad, a deadline with a client in Dubai, a discount for a bulk order, or a fee for freelance work on a platform. The English you use shapes how firm, fair and professional you sound.

### Conditional language is your main tool

Most offers and counteroffers use "if" sentences. They link what you give to what you get, so you never give something away for free.

| Pattern | Example |
|---|---|
| If you..., we can... | If you order 500 units, we can offer free delivery to Lahore. |
| We could..., provided that... | We could start next week, provided that the advance is paid by Monday. |
| As long as..., we'd be happy to... | As long as the design is final by the 10th, we'd be happy to meet that deadline. |
| What if we... and you...? | What if we lower the price slightly and you sign for twelve months? |

The words "could", "would" and "might" make an offer sound open and flexible. "Will" and "can" sound more fixed. Choose based on how firm you want to be.

### A sample exchange

\`\`\`text
Client:     Your quote is higher than we expected. Can you do better?
Freelancer: I understand. Could you tell me what budget you had in mind?
Client:     Something closer to 80% of your quote.
Freelancer: I could work with that if we reduce the scope. For example,
            two rounds of revisions instead of four. Would that work?
Client:     Hmm. What if we keep three revisions?
Freelancer: Three revisions would be possible at around 90% of the
            original quote. Shall I send an updated proposal?
\`\`\`

Notice three things. The freelancer asks a question before giving a number, which reveals the client's position. The freelancer trades: lower price for less work, rather than simply cutting the price. And the freelancer ends by moving to a concrete next step.

### Phrases for each stage

| Stage | Phrases |
|---|---|
| Opening | We're looking for... / Our starting point is... / We'd like to propose... |
| Probing | What's most important to you here? / What budget do you have in mind? |
| Countering | I see where you're coming from, but... / That's a bit lower than we can go. |
| Trading | In return for..., we could... / If we move on price, could you move on timing? |
| Closing | It sounds like we have a deal. / So, to confirm, we've agreed... |

### Staying calm and polite

Avoid emotional or vague words like "that's unfair", "you are cheating" or "this is too much". Replace them with neutral facts: "That price doesn't cover our material costs" or "That deadline doesn't leave time for proper testing." Silence is also useful. After making an offer, stop talking. Many people rush to fill the silence with a lower price.

### Common mistakes

| Mistake | Better |
|---|---|
| Give me last price. | What's the best price you can offer? |
| Less it a little. | Could you reduce it a little? |
| Final is final. | This is the best we can do on price, but we could look at payment terms. |
| OK fine, whatever you say. | Let me check with my team and come back to you by tomorrow. |

"Give me last price" is common in bazaar Urdu translated directly, but in professional English it sounds abrupt. "What's the best price you can offer?" carries the same meaning politely.

### Drill

Write three "if" offers for a situation you know: selling a used laptop, quoting a tuition fee, or agreeing a delivery date. For each, write the counteroffer the other side might make, then your trade in reply.
      `,
        [
          q('Why are "if" sentences useful when making offers?', [
            'They make the offer sound like a final ultimatum',
            'They link what you give to what you get in return',
            'They avoid mentioning any numbers or dates',
            'They show that you will accept any price offered',
          ], 1, 'Conditional offers ensure every concession is traded for something rather than given away.'),
          q('In the sample exchange, what did the freelancer do instead of simply lowering the price?', [
            'Refused to talk about the price at all',
            'Asked the client to pay the full amount upfront before starting',
            'Cut the price and kept the same amount of work',
            'Reduced the scope of work in return for a lower price',
          ], 3, 'Trading scope for price keeps the deal fair and protects the value of the work.'),
          q('Which is the most professional way to ask a supplier for a lower price?', [
            'Give me last price, I am a regular customer.',
            'Less it a little, please, sir, a little more.',
            'What\'s the best price you can offer?',
            'Final is final, reduce it now.',
          ], 2, 'This phrase is polite and clear, unlike direct translations of bazaar bargaining.'),
        ]
      ),
      lesson('Saying No Without Burning Bridges', 13, `
Saying no is hard in many South Asian workplaces, where refusing a senior person or a client can feel rude. Many people say "yes, inshallah" or "I will try" when they mean no, and then miss the deadline. That damages trust far more than a clear, polite refusal would have. Inshallah itself is not the problem; many colleagues say it sincerely alongside a firm commitment. The problem is using any phrase in place of a clear yes or no.

### The soft no structure

A good refusal has four parts:

\`\`\`text
1. Appreciate:  "Thanks for thinking of me for this."
2. Decline:     "Unfortunately, I won't be able to take it on this week."
3. Reason:      "I'm committed to the audit report due on Thursday."
4. Alternative: "I could help from Monday, or Sana may have time now."
\`\`\`

The reason should be short and true. A long story sounds like an excuse. The alternative is what keeps the bridge standing: it shows you want to help, even if not right now.

### Phrases that refuse politely

| Too blunt | Too vague | Clear and polite |
|---|---|---|
| No, I can't. | I'll try, inshallah. | I'm afraid I can't take this on before Friday. |
| That's not possible. | Maybe, let's see. | Unfortunately, that's outside what we can offer. |
| Not my job. | I will check. | That's handled by the finance team. I'll connect you with them. |
| Your price is too low. | It's a bit difficult. | We can't go below this price, but we could adjust the delivery schedule. |

The vague column is the most dangerous. The other person hears a possible yes and plans around it.

### Refusing a senior person

When your manager adds work to an already full week, you can turn the no into a question about priorities:

\`\`\`text
"I'm happy to do this. Right now I'm working on the client proposal
and the stock report, both due Wednesday. Which one should I move
to make room for this?"
\`\`\`

This is not a refusal on paper, but it makes the trade-off visible and lets the manager decide. It is often the safest way to say no upward.

### Refusing a customer or client

For clients, focus on what you can do rather than what you cannot:

| Instead of | Try |
|---|---|
| We don't do refunds after 7 days. | Our refund window has closed, but I can offer an exchange or store credit. |
| We can't deliver to your area. | We don't deliver to Gilgit yet, but you can collect from our Islamabad office or use a courier you prefer. |
| That's against our policy. | I'm not able to do that, and here is what I can do instead. |

Always check your organisation's actual policy before quoting it. Never invent a rule to end a conversation.

### Refusing in writing

In email, keep a refusal short and warm:

\`\`\`text
Dear Mr Haider,

Thank you for inviting us to quote for the Multan warehouse project.
After reviewing the timeline, we have decided not to bid this time,
as our team is fully committed until March.

We would be glad to be considered for future projects, and I will
reach out when our schedule opens up.

Kind regards,
Ayesha Malik
\`\`\`

### Common mistakes

Avoid "I am not agree", "I cannot able to" and "It is not possible for me to do this thing." Say "I don't agree", "I'm not able to" or "I can't do this". Also avoid "sorry" three times in one message. One sincere "I'm sorry" or "unfortunately" is enough.

### Drill

Write three requests you often receive that you would like to refuse more clearly. For each, write a four-part soft no: appreciate, decline, reason, alternative. Say them aloud until they sound natural rather than guilty.
      `,
        [
          q('What keeps a refusal from damaging the relationship in the four-part structure?', [
            'A long, detailed story explaining every single reason you have',
            'Apologising several times in the same message',
            'Offering an alternative such as another time or person',
            'Leaving the answer vague so they can hope',
          ], 2, 'An alternative shows goodwill and keeps the door open even while you decline.'),
          q('Why is replying "I\'ll try, inshallah" risky when you actually mean no?', [
            'The other person may plan around a yes that never comes',
            'It is grammatically incorrect English in any context',
            'It forces the other person to escalate immediately',
            'It legally commits you to finishing the work',
          ], 0, 'Vague answers sound like a possible yes, which causes missed deadlines and broken trust.'),
          q('How can you safely say no to a manager who adds more work?', [
            'Ignore the task and hope they forget about it',
            'Tell them clearly that it is not your job',
            'Accept it silently and stay late every night',
            'Ask which current task should move to make room',
          ], 3, 'Turning the refusal into a priority question makes the trade-off visible and lets the manager decide.'),
        ]
      ),
      lesson('Confirming Agreements in Writing', 12, `
A spoken agreement on a call or in a meeting is easy to forget or remember differently. A short written confirmation, sent soon after, protects both sides. In Pakistan many deals are agreed over WhatsApp voice notes or phone calls, which makes a clear written follow-up even more important.

### Why confirm in writing

- Memories differ. One side remembers "delivery by the 15th", the other "delivery from the 15th".
- People change roles. A new manager needs to see what was agreed.
- Disputes are easier to settle when there is a dated record both sides saw.

A confirmation email is a useful record, but it is not a substitute for a proper written contract on large or legal matters; for those, involve a lawyer where needed. For everyday business, a clear summary email prevents most misunderstandings.

### The structure of a confirmation email

\`\`\`text
Subject: Confirming our agreement: 300 cartons, delivery 15 March

Dear Mr Siddiqui,

Thank you for your time on the call today. To confirm what we agreed:

1. Quantity: 300 printed cartons, size shown in the attached drawing.
2. Price: as quoted in your quotation dated 2 March, including delivery.
3. Delivery: to our Korangi warehouse on or before 15 March.
4. Payment: 50% advance on approval, balance within 15 days of delivery.

Please reply to confirm this matches your understanding, or let me
know if anything needs correcting.

Best regards,
Bilal Ahmed
Purchase Officer
\`\`\`

Key features: a subject line that states the agreement, numbered points with one item each, exact dates and quantities, and a request for the other side to confirm.

### Vague versus exact

| Vague | Exact |
|---|---|
| Delivery next week. | Delivery on or before Thursday 15 March. |
| Payment as discussed. | 50% advance, balance within 15 days of delivery. |
| Some revisions included. | Two rounds of revisions, requested within 7 days of each draft. |
| We will send it soon. | We will send the final file by 5 pm Friday. |

Every vague word is a future argument. Replace "soon", "next week", "some" and "as discussed" with numbers and dates.

### Confirming on WhatsApp

For small deals, a WhatsApp message can work, but write it as text, not a voice note, so it can be searched later:

\`\`\`text
Assalam o Alaikum Ahmed sahib, confirming our call:
- 20 office chairs, the model shown in your photo
- Delivery to our Gulberg office on Saturday before 1 pm
- Payment on delivery by bank transfer
Please reply "confirmed" if this is correct. Thank you.
\`\`\`

### Handling a correction

If the other side replies with a change, do not argue in a long thread. Acknowledge and restate the full corrected point:

\`\`\`text
Thanks for pointing that out. So the corrected delivery date is
18 March, not 15 March. Everything else stays the same.
\`\`\`

### Phrases to use

| Purpose | Phrase |
|---|---|
| Open | Further to our call today... / Following our meeting... |
| Summarise | To confirm what we agreed... / Here is a summary of the key points... |
| Ask for agreement | Please reply to confirm. / Let me know if I've missed anything. |
| Next step | Once you confirm, I'll raise the purchase order. |

Avoid outdated phrases like "as per our telephonic conversation" or "PFA". "Following our call" and "I've attached" sound more natural.

### Drill

Think of a recent agreement you made by phone or in person, even something small like a tuition schedule or a repair job. Write a confirmation with four numbered points and exact dates. Check it: could a stranger read it and know exactly what each side must do?
      `,
        [
          q('What should a confirmation email ask the other person to do at the end?', [
            'Forward it to everyone in their company',
            'Reply to confirm or point out anything to correct',
            'Sign and post a printed paper copy back',
            'Call back to discuss the whole deal again from the start',
          ], 1, 'Asking for a reply turns your summary into a record both sides have agreed.'),
          q('Which line is the clearest way to state a payment term?', [
            'Payment as discussed on the phone.',
            'Payment will be made soon, as usual.',
            'Payment in the normal way we always follow with you.',
            '50% advance, balance within 15 days of delivery.',
          ], 3, 'Exact amounts and dates leave no room for different memories later.'),
          q('Why should a WhatsApp confirmation be written as text rather than a voice note?', [
            'Written text can be searched and checked later',
            'Voice notes are not allowed in business chats',
            'Text messages cannot be deleted by anyone',
            'Voice notes always sound too informal to clients',
          ], 0, 'A typed message is easy to search and quote, which is the whole point of a record.'),
        ]
      ),
      ],
      [
      q('A colleague writes "Kindly do the needful, sir, please, please." What is the main weakness?', [
        'It is too short for a manager to understand what it means',
        'It uses too many technical terms',
        'It pleads instead of giving a clear request and reason',
        'It is far too direct for a senior person',
      ], 2, 'Repeated pleading weakens your position; one clear request with a reason persuades better.'),
      q('A supplier says your offer is too low. Which reply trades rather than simply gives in?', [
        'OK fine, we will accept whatever price you decide on.',
        'If you can deliver by the 10th, we can increase it slightly.',
        'That\'s unfair, you are clearly trying to cheat us here.',
        'Final is final, so please take it or leave it today.',
      ], 1, 'A conditional trade gets something in return for each concession.'),
      q('Which refusal to a client is clear and still keeps the relationship?', [
        'That\'s against our policy, sorry.',
        'We\'ll see, maybe a bit later on.',
        'Not possible, sorry, so please don\'t ask us about it again.',
        'We can\'t refund now, but we can offer an exchange.',
      ], 3, 'It declines clearly and offers an alternative instead of a flat no or a false maybe.'),
      q('Which change makes a written agreement less likely to cause a dispute?', [
        'Replacing words like "soon" with exact dates and numbers',
        'Sending it as a voice note so the tone is clear',
        'Writing it as one long paragraph without numbering',
        'Waiting a few weeks before sending it to the other side',
      ], 0, 'Exact dates and quantities remove the vague words that later lead to arguments.'),
      ]
    ),
    chapter(
      'Job Interviews in English',
      'Prepare a clear answer to tell me about yourself, tell work stories with the STAR method, ask interviewers sensible questions and discuss salary and notice period in confident, polite English.',
      [
      lesson('Answering Tell Me About Yourself', 13, `
Almost every interview in English starts with some version of "Tell me about yourself" or "Walk me through your background." It sounds friendly, but it is a test: can you summarise yourself clearly, in good order, in about one to two minutes? Many candidates in Pakistan either recite their CV line by line, starting from matriculation, or talk about family and hometown. Neither answers the real question, which is "Why are you a good fit for this job?"

### The present, past, future structure

A simple, reliable shape:

| Part | What to say | Length |
|---|---|---|
| Present | Your current role or status and your main strength | 2 to 3 sentences |
| Past | One or two experiences that led here, with a result | 2 to 4 sentences |
| Future | Why this job and company are the next step | 1 to 2 sentences |

### A sample answer

For a junior accountant applying to a firm in Lahore:

\`\`\`text
Present: "I'm currently a junior accountant at a textile exporter in
Faisalabad, where I handle accounts payable and monthly bank
reconciliations for three bank accounts."

Past: "I completed my B.Com from Punjab University and did my
internship at a mid-sized audit firm. In my current job, I noticed
that vendor payments were often delayed because invoices were
approved by email, so I set up a shared tracker. Since then, late
payments have fallen noticeably and my manager asked me to train two
new staff on it."

Future: "I'm now looking for a role with more exposure to financial
reporting, and your firm's work with manufacturing clients is
exactly the area I want to grow in."
\`\`\`

This takes about a minute to say. It mentions education briefly, focuses on one real achievement and ends by connecting to the employer.

### What to leave out

| Leave out | Why |
|---|---|
| Your full CV from school onwards | They have the CV already. |
| Family background, marital status | Not relevant and invites personal questions. |
| "I am hard-working, honest and punctual." | Every candidate says this. Show it with an example instead. |
| Complaints about your current employer | Sounds negative and raises doubts. |

### Language tips

Use the present continuous for what you are doing now ("I'm currently working on..."), the past simple for finished experiences ("I completed", "I set up") and the present perfect for experience up to now ("I've worked with SAP for two years"). The since and for slip from Chapter 1 shows up often in interviews: say "I have been working here since 2022", not "I am working here since 2022".

Other common slips:

| Slip | Correct |
|---|---|
| Myself Ali Raza. | I'm Ali Raza. / My name is Ali Raza. |
| I did my graduation from... | I graduated from... / I did my bachelor's at... |
| I have done B.Com. | I have a B.Com. / I completed a B.Com. |
| I am having two years experience. | I have two years of experience. |

"Myself Ali" is very common in South Asia, but interviewers abroad may find it odd. "I'm Ali" is simple and natural.

### For freshers

If you have no full-time job yet, use your degree, final-year project, internship, volunteer work or a freelance task as your present and past. "I recently graduated in computer science from COMSATS. For my final-year project, my team built a booking app for a local clinic, and I handled the database..." is a strong start.

### Drill

Write your own present, past, future answer in under 150 words. Record yourself saying it on your phone. Time it. If it runs over two minutes, cut details. Listen for "um" and for tense errors like "I am working here since". Record again until it sounds natural, not memorised.
      `,
        [
          q('What is the real question behind "Tell me about yourself"?', [
            'What is your full family background?',
            'Why are you a good fit for this job?',
            'Which school did you attend first?',
            'What are your hobbies on weekends?',
          ], 1, 'The interviewer wants a short, relevant summary that connects you to the role.'),
          q('Which order does the recommended structure use?', [
            'Past, future, present',
            'Future, past, present',
            'Present, past, future',
            'Past, present, future',
          ], 2, 'Start with where you are now, explain how you got there, then link to this job.'),
          q('Which sentence describes your degree in natural English?', [
            'I did my graduation from Punjab University.',
            'I have done graduation in B.Com from Punjab.',
            'I am graduated from Punjab University in commerce.',
            'I graduated from Punjab University with a B.Com.',
          ], 3, 'Graduate is a verb in English, so "I graduated from" is natural, while "did my graduation" and "am graduated" sound odd to interviewers outside South Asia.'),
        ]
      ),
      lesson('Behavioural Questions and the STAR Method', 14, `
Behavioural questions ask about what you actually did in the past, on the idea that past behaviour predicts future behaviour. They usually begin with "Tell me about a time when...", "Give me an example of..." or "Describe a situation where...". Answering them with general claims ("I am good under pressure") is weak. You need a short, specific story.

### The STAR method

STAR gives your story a clear shape:

| Letter | Meaning | What to say | Share of answer |
|---|---|---|---|
| S | Situation | Where, when, the background | Short |
| T | Task | Your responsibility or the goal | Short |
| A | Action | What you did, step by step | Longest part |
| R | Result | What happened, ideally measurable, and what you learned | Short |

Most weak answers spend too long on the situation and almost nothing on the action. The interviewer wants to hear what **you** did.

### A sample STAR answer

Question: "Tell me about a time you dealt with a difficult customer."

\`\`\`text
S: "I was working at the customer service desk of a mobile phone
   store in Saddar, Karachi, during the Eid sale."
T: "A customer came back angry because his new phone wouldn't charge,
   and he wanted a full refund on the spot."
A: "I let him explain without interrupting, then apologised for the
   trouble. I tested the phone with a different cable and found the
   cable was faulty, not the phone. I replaced the cable from stock,
   showed him the phone charging, and gave him my direct number in
   case of any other issue."
R: "He left satisfied, and the next week he came back and bought a
   phone for his brother. My manager later used this as an example
   in staff training."
\`\`\`

Notice the action uses "I", not "we". In team stories, explain your own part clearly: "Our team was late, so I took over the testing."

### Common behavioural questions

| Question | What they want to see |
|---|---|
| Tell me about a time you made a mistake. | Honesty, ownership, learning |
| Describe a conflict with a colleague. | Calm, respectful problem solving |
| Give an example of meeting a tight deadline. | Planning and priorities |
| Tell me about a time you showed leadership. | Initiative, even without a title |
| Describe a time you had to learn something quickly. | Adaptability |

Prepare five or six stories from work, study, freelancing or volunteering. One good story can often answer two or three different questions.

### The mistake question

Many candidates fear "Tell me about a mistake" and say "I have never made a big mistake" or name a fake weakness like "I work too hard." Both sound rehearsed. Choose a real but recoverable mistake, then spend most of the answer on how you fixed it and what you now do differently:

\`\`\`text
"Early in my job, I sent a price list to a client with last month's
rates. When I realised, I called the client the same day, apologised
and sent the correct list. Since then, I always check the date on any
file before sending it, and I suggested we add the date to the file name."
\`\`\`

### Useful phrases

| Purpose | Phrase |
|---|---|
| Start | One example that comes to mind is... / A good example would be... |
| Shift to action | So what I did was... / My first step was to... |
| Give the result | As a result... / In the end... / The outcome was... |
| Reflect | What I learned from that was... / Since then, I always... |

### Grammar note

Tell stories in the past simple: "I called", "I found", "I replaced". A common slip is mixing tenses: "So I call him and I told him." Keep it consistent. For results that still matter now, the present perfect works: "Since then, I've always checked the date."

### Drill

Write three STAR stories: a problem you solved, a mistake you fixed and a time you worked under pressure. Keep each under 200 words, with the Action as the longest part. Practise each aloud until you can tell it in about ninety seconds.
      `,
        [
          q('Which part of a STAR answer should usually be the longest?', [
            'Situation',
            'Task',
            'Action',
            'Result',
          ], 2, 'The interviewer mainly wants to hear what you personally did, so the action deserves the most time.'),
          q('Why should a team story use "I" for the action part?', [
            'The interviewer needs to know your own contribution',
            'Using "we" is grammatically incorrect in English',
            'It makes the story sound shorter and less detailed',
            'Teams are not respected by most employers anymore',
          ], 0, 'Saying what you did separates your role from the team\'s work.'),
          q('What is the best way to answer "Tell me about a mistake you made"?', [
            'Say you have never made any important mistake',
            'Describe a fake weakness like working too hard',
            'Blame a colleague or your manager for the error to protect yourself',
            'Share a real mistake and focus on the fix and lesson',
          ], 3, 'A real but recoverable mistake shows honesty, ownership and learning.'),
        ]
      ),
      lesson('Asking Good Questions at the End', 12, `
Near the end of most interviews you will hear: "Do you have any questions for us?" Many candidates say "No, everything is clear, thank you." That is a missed chance. Asking good questions shows interest, helps you judge whether the job suits you and leaves the interviewer with a final, positive impression.

### What good questions do

Good questions are about the work, the team and success in the role. They show you are already imagining doing the job well. Questions only about leave, perks or how soon you can be promoted can make you look interested in benefits rather than the work, especially early in the process.

### Questions worth asking

| Category | Example |
|---|---|
| The role | What would a typical week look like in this role? |
| Success | What would success look like in the first three months? |
| Team | Could you tell me a little about the team I'd be working with? |
| Challenges | What are the main challenges someone in this role would face? |
| Growth | How do people usually grow from this position? |
| Process | What are the next steps in the hiring process? |

Prepare four or five and ask two or three. Some may already be answered during the interview, so you need spares.

### Questions to avoid

| Avoid | Why |
|---|---|
| What does your company do? | Shows you didn't research. Check the website first. |
| How many days of leave will I get? | Better asked once an offer is discussed. Outside South Asia, say "leave" or "days off", not "leaves". |
| Did I get the job? | Puts the interviewer in an awkward spot. |
| Can I work from home from the first day? | Ask about working arrangements more neutrally, if at all. |

If remote work matters to you, ask in a neutral way: "Could you tell me how the team usually works, in the office or remotely?"

### Phrasing questions politely

Direct questions in English can sound blunt. Softer forms are better:

\`\`\`text
Blunt:   "What is the salary?"
Softer:  "Could you tell me about the salary range for this role?"

Blunt:   "Why did the last person leave?"
Softer:  "Is this a new position, or is it replacing someone?"

Blunt:   "When will you tell me?"
Softer:  "What's the timeline for the next steps?"
\`\`\`

Useful openers: "Could you tell me...", "I'd be interested to know...", "I was wondering...".

### Showing you listened

The strongest questions refer to something said earlier:

\`\`\`text
"You mentioned the team is expanding into Saudi Arabia next year.
Would this role be involved in that work?"
\`\`\`

This proves you were listening and connects you to the company's future plans. Keep a small notepad, or a few lines in your notes if the interview is online, to jot down points to come back to.

### Closing the interview well

After your questions, close with a short, warm sentence:

| Situation | Closing line |
|---|---|
| In person | Thank you for your time. I really enjoyed learning more about the role. |
| Online | Thanks so much for speaking with me today. I look forward to hearing from you. |
| Strong interest | This conversation has made me even more interested in the position. |

Avoid over-the-top closings like "Please sir, I really need this job." Confidence is more attractive to employers than desperation.

### Follow-up email

Sending a short thank-you email within a day is a good habit:

\`\`\`text
Subject: Thank you, Sales Coordinator interview

Dear Ms Farooq,

Thank you for meeting me today. I enjoyed hearing about the plans
for the Islamabad branch, and I'm excited about the chance to
support the sales team there.

Please let me know if you need anything else from me.

Best regards,
Hamza Tariq
\`\`\`

### Drill

For a job you would like, research the company for fifteen minutes, then write five questions using "Could you tell me..." or "I'd be interested to know...". Practise asking two of them aloud, then add a closing line.
      `,
        [
          q('Why is "No, everything is clear" a weak reply when asked for questions?', [
            'It is grammatically incorrect in formal English',
            'It misses a chance to show interest and learn about the role',
            'It forces the interviewer to end the meeting early and move on',
            'It means you will automatically be rejected',
          ], 1, 'Good questions show engagement and help you judge the job, so saying none wastes that chance.'),
          q('Which question is best to ask at the end of a first interview?', [
            'How many days of leave will I get each year?',
            'What does your company actually do?',
            'What would success look like in three months?',
            'Did I get the job, or should I wait?',
          ], 2, 'It focuses on doing the job well and shows you are thinking ahead.'),
          q('Which is the softer way to ask why a position is open?', [
            'Is this a new position, or a replacement?',
            'Why did the last person leave this job?',
            'Who left and why did they go?',
            'Tell me why this seat is empty.',
          ], 0, 'It asks for the same information without sounding suspicious or blunt.'),
        ]
      ),
      lesson('Talking About Salary and Notice Period', 13, `
Salary talk makes many candidates nervous, especially in cultures where discussing money openly feels impolite. But employers expect it, and a clear, calm answer helps you get a fair offer. This topic covers the English you need: stating expectations, responding to an offer and explaining your notice period.

### Research before you talk numbers

Before any interview, find out the typical pay range for the role, city and experience level. Salaries change over time and vary greatly between Karachi, Lahore, Islamabad and smaller cities, and between local companies, multinationals and remote roles for foreign clients. Check current job ads on sites such as Rozee.pk or LinkedIn, ask people in similar roles, and look at salary surveys if your industry publishes them. Use a range, not a single number, and base it on this research rather than on your current salary alone.

### When asked about expectations

| Situation | What to say |
|---|---|
| Early in the process | I'd like to learn more about the role first, but I'm sure we can find a fair figure. |
| They insist on a number | Based on my research and experience, I'm looking for something in the range of X to Y. |
| You want flexibility | I'm open to discussing this, depending on the full package. |
| They ask your current salary | My current salary is X, but I'm looking for a role that reflects my growing experience. |

"Package" is a useful word. It covers basic salary plus allowances, medical cover, provident fund, bonus or fuel, which in Pakistan can make a large difference to the total.

### Responding to an offer

Do not say yes immediately unless the offer is clearly excellent. Thank them and ask for details:

\`\`\`text
"Thank you, I'm really pleased to receive this offer. Could you send
me the details in writing, including allowances and benefits? I'd
like to review everything and get back to you by Thursday."
\`\`\`

If the offer is below your expectations, counter politely with a reason:

\`\`\`text
"Thank you for the offer. I'm very interested in the role. Based on
my three years of experience with SAP and the market range I've seen
for similar roles, I was hoping for something closer to X. Is there
any flexibility on the basic salary or the allowances?"
\`\`\`

Notice the pattern from the negotiation chapter: appreciate, give a reason, make a clear request, and leave space for a trade such as a review after six months.

### Notice period

Your notice period is how long you must keep working for your current employer after you resign. It is usually written in your employment contract or appointment letter, so check it before the interview rather than guessing. Be honest about it, because starting dates are planned around it.

| Question | Good answer |
|---|---|
| What is your notice period? | My contract requires one month's notice, so I could start in early May. |
| Can you join earlier? | I'll ask my employer whether they can release me earlier, but I'd like to leave properly. |
| Are you serving notice now? | Not yet. I'll resign once I receive a written offer. |

The figure in the first answer is only an example; use whatever your own contract says. Saying you want to "leave properly" shows the new employer you will treat them with the same respect.

### Words and phrases

| Term | Meaning |
|---|---|
| Gross salary | Salary before tax and deductions |
| Net or take-home salary | What reaches your bank account |
| Allowances | Extra payments, for example for fuel, house rent or mobile |
| Probation | A trial period after joining, often with different terms |
| Joining date | The day you start the new job |

Tax rules and deductions change, so if you need to compare gross and net pay, check the current rules on the FBR website or ask the employer's HR team. Do not rely on old figures from a friend.

### Common mistakes

Avoid "Salary is not an issue for me", which removes your negotiating room, and "Whatever you give, I will accept", which sounds desperate. Avoid "What is my salary?" before an offer is made. Say "Could you tell me the salary range for this role?" instead.

### Drill

Research the range for a role you want. Write your answer to "What are your salary expectations?" using a range and a reason. Then write a polite counteroffer and a one-line answer about your notice period. Say all three aloud with a calm, steady voice.
      `,
        [
          q('How should you base a salary range you give in an interview?', [
            'Only on what your friends say they earn',
            'Only on your current salary plus a small amount on top',
            'On current research for the role, city and experience',
            'On the highest salary you have ever heard of',
          ], 2, 'Pay varies by role, city and employer type and changes over time, so research current ranges.'),
          q('What does "package" usually mean when discussing salary?', [
            'Salary plus allowances and benefits such as medical cover',
            'The box of documents you bring to the interview',
            'The basic salary alone, before any other benefit is added',
            'A bonus that is paid only when you resign',
          ], 0, 'Package covers the full set of pay and benefits, which can change the total a lot.'),
          q('Where should you check your notice period before an interview?', [
            'In a general guide on the internet',
            'By asking the interviewer to decide it for you',
            'By guessing based on what colleagues have said',
            'In your employment contract or appointment letter',
          ], 3, 'The notice period is set by your own contract, so read it rather than guess.'),
        ]
      ),
      ],
      [
      q('A candidate opens with "Myself Sana, I am having five years experience." What is the best correction?', [
        'Myself is Sana, I having five years experience.',
        'I\'m Sana, and I have five years of experience.',
        'Me Sana, and I am have five years experiences.',
        'Sana is myself, having experience of five years.',
      ], 1, '"I\'m Sana" and "I have five years of experience" are the natural, correct forms.'),
      q('A STAR answer spends a minute on background and ten seconds on what the speaker did. What is wrong?', [
        'The result should always come first',
        'Background should take even longer than a minute',
        'The story should not include any background at all',
        'The action, the most important part, is too short',
      ], 3, 'Interviewers mainly want to hear your actions, so the action needs the most time.'),
      q('Which end-of-interview question refers back to what the interviewer said?', [
        'What are the office hours here, and how much leave is given?',
        'What does your company sell to customers?',
        'You mentioned expanding to Saudi Arabia; would I be involved?',
        'When exactly will I get the result of this interview?',
      ], 2, 'Referring to an earlier point shows you listened and links you to the company\'s plans.'),
      q('An offer arrives below your expectation. Which reply is most professional?', [
        'Thank you; is there flexibility on the basic salary?',
        'Whatever you decide to give, I will happily accept it, sir.',
        'That is too low, I\'m not interested at all.',
        'Salary is not really an issue for me, sir.',
      ], 0, 'Thanking them and politely asking about flexibility keeps the offer alive while you negotiate.'),
      ]
    ),
    chapter(
      'Customer Service and Cross-Cultural Communication',
      'Serve customers in clear, warm English on chat and phone, calm angry customers, and work smoothly with colleagues and clients whose ideas about directness, politeness and time differ from yours.',
      [
      lesson('Customer Service English on Chat and Phone', 13, `
Customer service is one of the biggest sources of English-speaking jobs in Pakistan and South Asia, from call centres in Karachi and Lahore serving foreign clients to local banks, telecoms and online stores handling chat support. The English is not complicated, but it must be clear, warm and consistent. Customers judge the whole company by a few lines from you.

### The service conversation in five steps

| Step | Goal | Example |
|---|---|---|
| Greet | Friendly, professional start | Hi, thanks for contacting ShopEasy support. My name is Hira. |
| Understand | Find out the real problem | Could you tell me a little more about what happened? |
| Confirm | Repeat back to check | So your order arrived, but one item is missing. Is that right? |
| Solve | Explain what you will do | I've raised a request for the missing item. It should be sent within the timeframe shown in your account. |
| Close | Check and end warmly | Is there anything else I can help with today? |

The confirm step is the one most often skipped, and skipping it causes many repeat contacts. Repeating the problem back shows you listened and catches misunderstandings early.

Company and brand names in examples are illustrations only. Every company has its own scripts and policies, so learn and follow your employer's.

### Chat versus phone

| Chat | Phone |
|---|---|
| Customer can reread every word, so check spelling and tone. | Tone of voice carries much of the message. |
| Short paragraphs, one idea each. | Short sentences, clear pace, pauses. |
| Avoid long silences; say "Let me check that for you, one moment." | Avoid dead air; say "I'm just checking your account now." |
| Avoid all capitals, which reads as shouting. | Smile while you speak; it changes your voice. |
| Emojis only if the brand style allows them. | Use the customer's name, but not in every sentence. |

### Useful phrases

| Purpose | Phrases |
|---|---|
| Show you are listening | I see. / I understand. / Thanks for explaining that. |
| Ask for details | Could you share your order number, please? |
| Ask them to wait | Would you mind holding for a moment while I check? |
| Give good news | Good news, I can see the refund has been processed. |
| Give bad news gently | I'm afraid that item is out of stock at the moment. |
| Offer options | I can either... or... Which would you prefer? |

### A sample chat

\`\`\`text
Agent:    Hi, thanks for messaging us. I'm Usman. How can I help today?
Customer: my internet not working since morning
Agent:    I'm sorry to hear that. Could you share the account number or
          the phone number linked to your connection?
Customer: 0300xxxxxxx
Agent:    Thank you. I can see there's maintenance work in your area of
          Gulshan-e-Iqbal right now. The service should be back once the
          work is finished. I'll add a note so you receive an SMS update.
Customer: ok thanks
Agent:    You're welcome. Is there anything else I can help with?
\`\`\`

The agent does not correct the customer's grammar, does not invent an exact repair time and gives a clear next step.

### Phrases to avoid

| Avoid | Why | Better |
|---|---|---|
| Calm down. | Feels dismissive. | I understand this is frustrating. |
| That's not my department. | Sounds unhelpful. | Let me connect you with the team that handles this. |
| You should have read the terms. | Blames the customer. | Let me explain how this works. |
| Dear customer, your issue is noted. | Cold and robotic. | Thanks, Sara. I've noted the issue and here's what happens next. |
| Kindly revert. | Outdated and unclear. | Please reply here when you can. |

### Never promise what you cannot deliver

If you do not know a timeline, say so and give the next step: "I can't give an exact time yet, but I'll update you by 4 pm." Inventing a deadline to end a chat creates an angrier customer later.

### Drill

Pick a service you use, such as a bank, a food delivery app or a mobile network. Write a five-step chat for a common problem, using one phrase from each row of the useful phrases table. Then say the same conversation aloud as if on the phone.
      `,
        [
          q('Which step of the service conversation is most often skipped?', [
            'Greeting the customer at the very start of the call',
            'Confirming the problem back to the customer',
            'Closing the conversation politely',
            'Asking for an account or order number',
          ], 1, 'Repeating the problem back catches misunderstandings and avoids repeat contacts.'),
          q('What should you do on chat when you need time to check something?', [
            'Stay silent until you have the full answer',
            'Send a reply in capital letters so it stands out',
            'Say "Let me check that for you, one moment."',
            'Ask the customer to message again tomorrow',
          ], 2, 'A short holding message reassures the customer that you are still working on it.'),
          q('You do not know when a fault will be fixed. What should you say?', [
            'I can\'t give an exact time yet, but I\'ll update you by 4 pm.',
            'It will definitely be fixed within one hour, don\'t worry.',
            'That\'s not my department, please contact someone else.',
            'You should have checked the maintenance schedule first.',
          ], 0, 'Being honest and giving a clear next step builds more trust than an invented deadline.'),
        ]
      ),
      lesson('Calming Angry Customers', 13, `
Angry customers are part of every service job. They may shout on the phone, type in capital letters or threaten to post a bad review. Your goal is not to win the argument. It is to lower the temperature, solve what can be solved and keep your own professionalism. The right English phrases help a great deal.

### Why customers get angry

Most anger comes from feeling ignored, cheated or stuck. A customer who has called three times about a refund is angry less about the money and more about not being heard. That is why the first step is always to listen.

### The LEAP pattern

Service trainers use several acronyms of this kind; LEAP here is simply a memory aid for the order of steps.

\`\`\`text
L  Listen     Let them speak without interrupting.
E  Empathise  Show you understand how they feel.
A  Apologise  Say sorry for the experience, even if it is not your fault.
P  Problem-solve  Explain clearly what you will do and when.
\`\`\`

### Phrases for each step

| Step | Phrases |
|---|---|
| Listen | Please go ahead, I'm listening. / Take your time. |
| Empathise | I can understand why you're upset. / That must be really frustrating. |
| Apologise | I'm sorry this has happened. / I apologise for the inconvenience this has caused. |
| Problem-solve | Here's what I'm going to do. / I'll personally follow up and call you back by 5 pm. |

"I'm sorry this has happened" apologises for the situation without admitting a fault that you have not yet checked. That is useful when the cause is still unclear.

### A sample phone call

\`\`\`text
Customer: This is the third time I'm calling! Nobody does anything!
          My refund of a cancelled flight still hasn't come!
Agent:    I'm really sorry you've had to call three times. That must be
          very frustrating. Could I take your booking reference so I can
          look at this properly?
Customer: It's KHI-4471. I've given it before!
Agent:    Thank you, and I apologise for asking again. I can see the
          refund request was approved but hasn't been sent to the bank
          yet. I'm going to escalate it to our refunds team now and mark
          it as a repeat complaint. I'll call you back tomorrow before
          noon with an update. Is this number the best one to reach you?
Customer: Yes. Fine. But please actually call.
Agent:    I will. You have my name, Faraz, and your case number is
          on its way to you by SMS.
\`\`\`

The agent never argues, acknowledges the repeat calls, gives a specific action and timeline and then keeps the promise.

### Things that make anger worse

| Trigger | Why it hurts | Instead |
|---|---|---|
| Interrupting | Customer feels unheard | Let them finish, then respond. |
| "Calm down" or "Relax" | Sounds like you think they're overreacting | "I understand. Let's sort this out." |
| Arguing about facts early | Feels like a fight | Acknowledge first, check facts after. |
| Over-scripted lines | Sounds fake | Use the customer's words: "the refund for your cancelled flight". |
| Passing them around | Adds to the frustration | Take ownership: "I'll handle this myself." |

### When the customer is abusive

You do not have to accept insults or threats. A calm boundary works better than anger:

\`\`\`text
"I want to help you, and I can do that if we keep the conversation
respectful. If the abuse continues, I'll need to end this call."
\`\`\`

Follow your company's policy on ending calls and escalating to a supervisor. Most organisations have one, and supervisors expect to be called in such cases.

### Written replies to complaints

On email or social media, the same steps apply, but keep it brief and move details to a private channel:

\`\`\`text
Hi Rabia, I'm really sorry about the late delivery and the damaged box.
That's not the experience we want for you. I've sent you a direct
message so we can arrange a replacement today.
\`\`\`

Never argue publicly with a customer. Other customers read the reply, and they judge you on your calm, not on who was right.

### Look after yourself

Handling angry people is tiring. Take a short pause after a difficult call, breathe slowly and remember the anger is about the situation, not about you personally.

### Drill

Write down an angry message you have received or seen online. Draft a LEAP reply under 80 words. Then roleplay it with a friend who plays the angry customer, and practise staying calm while they interrupt.
      `,
        [
          q('What does LEAP stand for in this topic?', [
            'Learn, Explain, Argue, Promise',
            'Listen, Escalate, Agree, Pause',
            'Laugh, Empathise, Ask, Pass on',
            'Listen, Empathise, Apologise, Problem-solve',
          ], 3, 'LEAP moves from hearing the customer to showing understanding, apologising and then acting.'),
          q('Why is "I\'m sorry this has happened" useful when the cause is unclear?', [
            'It legally proves the company was not at fault',
            'It apologises for the situation without admitting a fault',
            'It ends the call quickly without any further discussion needed',
            'It tells the customer that the problem is theirs',
          ], 1, 'It shows care for the experience while you still check what went wrong.'),
          q('How should you reply to an angry customer on public social media?', [
            'Explain in detail why the customer is wrong',
            'Ignore the comment until the customer gets tired and gives up',
            'Apologise briefly and move details to a private channel',
            'Post their order details to prove your side',
          ], 2, 'A short, calm public reply plus private follow-up protects the customer and your brand.'),
        ]
      ),
      lesson('Working With Colleagues From Other Cultures', 13, `
More and more South Asian professionals work with people from other countries: remote clients in the UK or US, managers in the Gulf, teammates in Malaysia, the Philippines or Europe. English is the shared language, but each person brings their own habits about how to speak, write, agree and disagree. Misunderstandings usually come from those habits, not from grammar.

### Same words, different meanings

| What is said | Possible meaning to one person | Possible meaning to another |
|---|---|---|
| "That's an interesting idea." | I like it. | I don't really agree. |
| "I'll try." | I will do it. | I probably can't. |
| "Yes." | I agree. | I heard you. |
| "Let's discuss later." | We will discuss later. | Polite way to drop the subject. |
| A head shake from side to side | No, in many places. | Yes or okay, for some South Asians. |

The head wobble is a good example. Some South Asian colleagues, especially from India, use a side-to-side movement to mean "yes, I understand", while someone from Europe may read it as "no" or "maybe". On video calls, add the words: "Yes, that works for me."

### Check, don't assume

When working across cultures, assume less and confirm more:

\`\`\`text
"Just to make sure I understood: you'd like the first draft by
Wednesday, and the final version after your team reviews it?"
\`\`\`

Confirming is not a sign of weak English. Strong international communicators do it constantly.

### Avoid local expressions

Earlier chapters covered "do the needful", "revert", "prepone" and "out of station". A few more South Asian English expressions that can confuse others:

| Local expression | Clearer international English |
|---|---|
| Kindly adjust. | Could you please accommodate this? |
| Same to same. | Exactly the same. |
| Tell me one thing. | Can I ask you something? |
| What is your good name? | May I have your name? |
| I am coming. (meaning: back soon) | I'll be right back. |
| He is in the washroom, he will call. | He's away from his desk; he'll call you back. |

These are not wrong within South Asia, and colleagues in the region will understand them. But with an international audience, the clearer version avoids confusion.

### Names, titles and forms of address

Many South Asians add "sir" or "madam" to every sentence out of respect. In many Western workplaces, people use first names, even with senior managers, and repeated "sir" can feel very formal or distant. In the Gulf and in parts of Asia, titles may matter more. A safe approach:

1. Start with the form they use in their email signature or introduction.
2. If they sign with a first name, it is usually fine to use it.
3. If unsure, ask: "How would you prefer me to address you?"

Learn to pronounce names correctly too, and never shorten or change someone's name because it is hard for you. Asking "Could you tell me how to say your name?" is always polite.

### Humour, religion and small talk

Humour often does not translate well and can offend. Keep jokes light and avoid those about religion, nationality, gender or politics. Small talk topics also vary: weather, weekend plans, food and travel are usually safe. Questions about salary, age, marriage or children, common in some South Asian conversations, can feel too personal to colleagues from many other cultures.

### Time zones and working hours

When working with people in other time zones, write meeting times with the zone and use a tool to check: "Thursday 3 pm Pakistan time (PKT), which is 10 am in London." That gap is true only in the UK winter; when the UK is on summer time, 3 pm PKT is 11 am in London. Pakistan does not currently change its clocks, but many countries do, so check the current difference in a world clock rather than relying on memory.

### Drill

List five expressions you use at work. For each, ask: would someone from outside South Asia understand it? Rewrite any that might confuse in plain international English. Then write one email to an imaginary client in another country, confirming a deadline and a meeting time with both time zones.
      `,
        [
          q('A colleague abroad says "That\'s an interesting idea." What is the safest response?', [
            'Ask a follow-up question to check what they think',
            'Assume they love it and start work right away',
            'Assume they hate it and drop the idea quietly',
            'Ignore the comment and move to the next topic',
          ], 0, 'The phrase can mean approval or polite disagreement, so checking avoids misunderstanding.'),
          q('You are not sure how to pronounce a new client\'s name. What is the most respectful approach?', [
            'Avoid using their name in every meeting and email',
            'Ask them, "Could you tell me how to say your name?"',
            'Give them a shorter nickname that is easier for you',
            'Copy how other colleagues say it, even if it seems wrong',
          ], 1, 'Asking how to say a name is always polite and shows respect, while avoiding it or inventing a nickname can feel dismissive.'),
          q('How should you write a meeting time for a colleague in another country?', [
            'Write only your local time and let them work it out',
            'Write the time without any zone to keep it simple',
            'Give the time with zones and check the current gap',
            'Ask them to always use Pakistan time from now on',
          ], 2, 'Time differences can shift with daylight saving, so state both zones and check the gap.'),
        ]
      ),
      lesson('Directness, Politeness and Time Across Cultures', 13, `
Cultures differ in how directly people say things, how they show respect and how they treat time. None of these styles is better or worse. But if you know the differences, you can adjust your English so your message lands as you intend. These are broad tendencies, not rules: every person is an individual, and many professionals adapt to international norms.

### Direct and indirect communication

| More direct styles | More indirect styles |
|---|---|
| Say the main point first. | Build context and relationship first. |
| "No" is said clearly. | "No" is softened or implied. |
| Criticism is specific and open. | Criticism is gentle, often private. |
| Silence may mean disagreement or thinking. | Silence may mean politeness or discomfort. |

Many workplaces in Germany, the Netherlands, Australia and the US are often described as more direct. Many in Pakistan, India, Japan and the Gulf are often described as more indirect. Within any country, industries, companies and individuals vary.

### Adjusting your message

If you are writing to someone who prefers directness, put the point first:

\`\`\`text
Indirect: "Hope you're well. We've been looking into the timeline and
there have been some developments with the supplier, and the team has
been working very hard, so it might perhaps be possible that..."

Direct:   "The delivery will be one week late, now 22 March, because
the supplier's shipment was delayed. Here's what we're doing to
reduce the impact."
\`\`\`

If the other person prefers a softer style, add a little warmth before the point, but still make the point clear:

\`\`\`text
"Thanks for all your support on this project. I wanted to let you
know early that the delivery will move to 22 March because of a
supplier delay."
\`\`\`

The key is that the main message is clear in both. Softening the delivery is fine; hiding the message is not.

### Feedback across cultures

Giving and receiving criticism is where cultural styles clash most. A manager from a direct culture might say, "This report is not good enough. The figures are wrong." A Pakistani employee may hear that as harsh or personal. Equally, a South Asian manager's "Maybe you could look at the figures again, if you have time" may be heard by a direct colleague as optional.

| If you want to be clear but kind | Phrase |
|---|---|
| Name the issue | The figures in section 2 don't match the sales data. |
| Show it's about the work | This is about the report, not your effort. |
| Say what's needed | Could you correct them by tomorrow? |

### Ideas about time

| Aspect | Clock-focused tendency | Flexible tendency |
|---|---|---|
| Meeting start | On the minute | Within some minutes is acceptable |
| Deadlines | Fixed commitments | Can move if relationships require |
| Agenda | Followed closely | Adjusted as the conversation flows |

In Pakistan, "I'll be there in five minutes" may be understood loosely. A client in Germany or Japan may take it literally. With international partners, treat stated times as promises. If you will be late, say so in advance with a specific new time: "I'm running about ten minutes late. I'll join at 3:10."

### Respect and hierarchy

In more hierarchical settings, junior staff may wait for a senior to speak first and rarely contradict them openly. In flatter workplaces, juniors are expected to speak up, ask questions and even challenge a manager's idea in a meeting. If you join a flatter team, practise phrases like "Could I add something?" and "I see it a little differently." If you lead a team with more hierarchical habits, invite input directly: "Ayesha, what do you think?"

### A quick self-check

Before an important message to someone from another culture, ask:

1. Is my main point clear in the first two sentences?
2. Have I used any local expressions they may not know?
3. Have I stated times and dates exactly, with time zones?
4. Would my tone feel too blunt or too vague to them?

### Drill

Take a recent message where you had to deliver bad news. Rewrite it twice: once in a direct style with the point first, once in a softer style with a short warm opening. Check that the main message is equally clear in both.
      `,
        [
          q('How should cultural descriptions such as "direct" or "indirect" be treated?', [
            'As fixed rules that apply to every person',
            'As proof that one style is clearly better than another',
            'As broad tendencies, with individuals varying a lot',
            'As something to ignore completely in business',
          ], 2, 'They describe general patterns, but people and companies differ widely.'),
          q('What should stay the same when you soften a message for an indirect audience?', [
            'The main message must still be clear',
            'The number of apologies in the message',
            'The length of the message must be shorter',
            'The time zone should not be mentioned at all',
          ], 0, 'Softening the delivery is fine, but the core point must not be hidden.'),
          q('You will be late for a call with a client in Germany. What is best?', [
            'Say "five minutes" and join when you can',
            'Join late without saying anything at all',
            'Cancel the call and ask to meet next week',
            'Tell them in advance with a specific new time',
          ], 3, 'Clock-focused partners treat times as promises, so give early notice and an exact time.'),
        ]
      ),
      ],
      [
      q('A chat customer writes in broken English. What should the agent do?', [
        'Politely correct the customer\'s grammar first',
        'Answer clearly without commenting on their English',
        'Ask them to find someone who speaks better English',
        'Reply only in very formal, complex sentences',
      ], 1, 'The goal is to solve the problem; correcting the customer is unhelpful and rude.'),
      q('Which reply to a shouting customer follows the LEAP method best?', [
        'Calm down, sir, you are really overreacting about this.',
        'That\'s not my department, call the other number.',
        'I\'m sorry you\'ve had to call again; let me look properly.',
        'You should have read our refund terms more carefully.',
      ], 2, 'It empathises, apologises and moves straight to solving the problem.'),
      q('An international client looks confused when you write "The new design is same to same." What is clearer?', [
        'The new design is same to same as before.',
        'The new design is totally same to the old one.',
        'The new design is equal same like the old design was.',
        'The new design is exactly the same as the old one.',
      ], 3, '"Same to same" is a South Asian expression; "exactly the same as" is the standard form understood everywhere.'),
      q('Which message works for both direct and indirect readers?', [
        'Thanks for your support. The delivery moves to 22 March due to a supplier delay.',
        'There have been some developments and things might perhaps change a little later.',
        'Late again. New date 22 March. Supplier problem, sorry, nothing to do.',
        'Hope all is well with you and your family, more updates on everything soon.',
      ], 0, 'It adds a little warmth but states the main point and date clearly.'),
      ]
    ),
    chapter(
      'Your 30-Day Practice Plan',
      'Turn everything in the course into a daily habit: build a short routine, use shadowing and recordings to correct yourself, find free tools and practice partners, and follow a clear 30-day plan.',
      [
      lesson('Building a Daily Practice Routine', 12, `
Knowing the right phrases is not the same as using them under pressure in a meeting or interview. That only comes from regular practice. The good news is that business English improves faster with a short daily habit than with a long session once a week. Twenty to thirty minutes a day, done consistently, beats three hours every Sunday.

### Why short and daily works

Speaking is a physical skill as much as a mental one. Your mouth, ears and memory need repetition to make new sounds and phrases automatic. Daily practice also keeps English "warm", so that switching from Urdu, Punjabi, Sindhi or Pashto at home to English at work feels less like starting a cold engine.

### The four-part daily session

| Part | Time | What you do |
|---|---|---|
| Listen | 5 minutes | Listen to a short piece of business English: a podcast clip, a news report, a talk. |
| Speak | 10 minutes | Shadow, record or roleplay a work situation aloud. |
| Write | 5 to 10 minutes | Write one short email, message or summary. |
| Review | 2 to 5 minutes | Note one new phrase and one mistake you want to fix. |

On busy days, do just one part. A five-minute session keeps the habit alive; skipping completely makes it easier to skip again.

### Attach practice to something you already do

New habits stick better when linked to an existing one:

\`\`\`text
After my morning chai      -> listen to one 5-minute clip
On the bus or in the van   -> read my phrase list silently
After lunch                -> write one practice email
Before sleep               -> record a 1-minute summary of my day
\`\`\`

Commuters in Karachi or Lahore often have 30 to 60 minutes of travel. With earphones, that time can become listening practice without changing anything else in the day.

### Keep a simple log

A notebook or a phone note is enough. Each day, write three lines:

\`\`\`text
Date: 4 May
Did: shadowed 3 minutes of a business podcast, wrote a refund reply
New phrase: "Would you be open to..."
Fix: I said "discuss about", should be "discuss" (no "about")
\`\`\`

After a week, read your "Fix" lines. The same mistakes often repeat, which tells you exactly what to drill next.

### Choose a theme each week

Practising randomly feels busy but builds less skill. Choosing one theme per week gives focus:

| Week | Theme | Example tasks |
|---|---|---|
| 1 | Clear speech and small talk | Introductions, small talk, shadowing |
| 2 | Calls and meetings | Phone openings, meeting phrases, disagreeing politely |
| 3 | Writing | Emails, minutes, requests, confirmations |
| 4 | High-stakes speaking | Presentations, negotiation, interviews |

The full 30-day plan at the end of this chapter follows this structure.

### Protect your motivation

Progress in a language feels slow because you measure it day by day. Measure it month by month instead. Record a two-minute introduction on day one and keep it. On day thirty, record the same introduction and compare. Most learners hear a clear difference in confidence, pace and clarity, which is the best motivation to continue.

Also accept mistakes as part of the process. Many South Asian learners were taught to fear errors in school. At work, people care far more that you are clear and confident than that every article and preposition is perfect.

### Drill

Decide today: what time will you practise, what existing habit will you attach it to, and where will you keep your log? Write those three answers down, then do a five-minute session right now: listen to one short clip and note one phrase.
      `,
        [
          q('Why is a short daily session better than one long weekly session?', [
            'Long sessions are not allowed by most tutors',
            'Regular repetition makes phrases and sounds automatic',
            'Weekly sessions always cause pronunciation problems',
            'Short sessions mean you never make any mistakes',
          ], 1, 'Speaking is partly a physical skill, so frequent repetition builds it faster.'),
          q('What should you do on a very busy day?', [
            'Skip practice entirely and double it tomorrow',
            'Practise for three hours late at night instead',
            'Restart the whole plan from day one next week',
            'Do just one part, even for five minutes',
          ], 3, 'A tiny session keeps the habit alive, while skipping makes skipping easier.'),
          q('What is the main benefit of reading your "Fix" lines after a week?', [
            'It proves you have no mistakes left at all',
            'It replaces the need for any speaking practice',
            'It shows how many new words you learnt',
            'It reveals repeated mistakes to drill next',
          ], 3, 'Patterns in your mistakes show exactly which point needs focused practice.'),
        ]
      ),
      lesson('Shadowing, Recording and Self-Feedback', 13, `
Two of the most effective solo speaking techniques are shadowing, where you speak along with a recording, and self-recording, where you listen back to your own voice. Neither needs a teacher or money, only a phone and earphones.

### What shadowing is

Shadowing means listening to a short clip of a fluent speaker and repeating it at the same time, or a split second behind, copying their rhythm, stress and intonation. You are not just repeating words. You are copying how they sound: where they pause, which words they stress and how their voice rises and falls.

### How to shadow, step by step

\`\`\`text
1. Choose a clip of 30 to 60 seconds, ideally with a transcript.
2. Listen once without speaking. Understand the meaning.
3. Listen again while reading the transcript. Mark stressed words.
4. Read the transcript aloud along with the audio.
5. Shadow without the transcript, just listening and speaking.
6. Repeat 3 to 5 times over a few days until it feels smooth.
\`\`\`

Good sources are business news reports, interviews and short talks. Choose speakers whose role is similar to what you want: a sales manager, a customer service agent, a presenter. Pick clear, standard accents rather than very fast or regional speech at first.

### What to focus on while shadowing

| Focus | Why it matters |
|---|---|
| Sentence stress | English stresses key words and shortens small ones like "to", "of", "a". |
| Linking | Fluent speakers link words: "pick it up" sounds like "pi-ki-tup". |
| Pausing | Pauses between ideas make speech easier to follow. |
| Intonation | Questions, lists and emphasis all have their own melody. |

Many Urdu speakers give every syllable equal weight, which can sound flat or hurried in English. Shadowing is one of the best ways to absorb English rhythm naturally.

### Self-recording

Record yourself regularly, and listen back. It feels uncomfortable at first because most people dislike their recorded voice. That feeling passes quickly, and the benefit is large: you hear what others hear.

What to record:

- Your answer to "Tell me about yourself".
- A 60-second summary of a meeting or news story.
- The opening of a presentation.
- A practice voicemail or customer service greeting.

### A self-feedback checklist

Listen back once for each line of this checklist rather than trying to notice everything at once:

| Check | Question to ask |
|---|---|
| Clarity | Could a stranger understand every word? |
| Pace | Was I rushing? Were there pauses between ideas? |
| Fillers | How many "um", "basically", "actually" and "you know"? |
| Grammar | Any repeated slips, such as "discuss about" or "I am agree"? |
| Structure | Was my main point clear in the first few sentences? |
| Confidence | Did my voice drop or rise at the end of statements? |

Pick one item to improve in the next recording. Trying to fix everything at once is overwhelming and rarely works.

### Compare with the model

A powerful routine is to record yourself reading the same transcript you shadowed, then play your version straight after the original. Differences in stress and pace become very obvious. Note one difference and fix it in the next attempt.

### Using AI tools for feedback

AI chat assistants and some speech apps can transcribe your recording and point out grammar mistakes or awkward phrasing. They are useful, but they can also be wrong or suggest unnatural phrases. Treat their feedback as suggestions to check, not as final truth, and never paste confidential work information into them.

### Drill

Find a 45-second clip of a clear business speaker with a transcript. Shadow it five times using the six steps. Then record yourself reading the transcript alone, compare with the original and write down one stress or pausing difference to fix tomorrow.
      `,
        [
          q('What is shadowing?', [
            'Speaking along with a recording while copying its rhythm',
            'Following a senior colleague around the office all day',
            'Writing down every word you hear in a podcast',
            'Translating an English clip into Urdu in your head',
          ], 0, 'Shadowing trains rhythm, stress and intonation by speaking with a fluent model.'),
          q('How should you use the self-feedback checklist?', [
            'Try to fix every item in a single recording',
            'Listen once per item and pick one to improve next',
            'Use it only after you finish the entire course',
            'Give the checklist to a colleague and stop recording',
          ], 1, 'Focusing on one item at a time makes improvement manageable and steady.'),
          q('How should you treat feedback from AI tools on your recordings?', [
            'As always correct, so accept every change',
            'As useless, so never try these tools at all',
            'As suggestions to check, and keep work data private',
            'As a full replacement for any human feedback from now on',
          ], 2, 'AI feedback can help but may be wrong, and confidential information should never be pasted in.'),
        ]
      ),
      lesson('Free Tools and Practice Partners', 12, `
You do not need expensive classes to improve your business English. Many good resources are free, and the most valuable thing of all, real conversation, can be found among colleagues, friends and online communities. The challenge is choosing a few and using them regularly rather than collecting dozens and using none.

Names of apps and websites in this topic are examples only. Features, free plans and availability change over time, so check each one's current terms before relying on it.

### Free listening and reading sources

| Type | Examples | Use it for |
|---|---|---|
| Learning sites | BBC Learning English | Short business and grammar lessons with transcripts |
| Talks | TED Talks | Presentations, with subtitles and transcripts |
| News | International and Pakistani English news channels | Business vocabulary and clear speech |
| Podcasts | Business and career podcasts on any podcast app | Commute listening and shadowing |
| Newspapers | Business pages of English-language newspapers | Reading formal vocabulary |

Choose listening at or slightly above your level. If you understand almost nothing, it is too hard; if you understand everything, it is too easy to teach you new phrases.

### Free writing helpers

| Tool type | What it helps with | Caution |
|---|---|---|
| Built-in spell check in Gmail, Outlook or Word | Typos, basic grammar | Misses wrong words that are spelled correctly |
| Grammar checker browser extensions | Grammar, clarity, tone | Free versions often have limits |
| AI chat assistants | Rewriting, explaining errors, roleplay | Can be wrong; check suggestions, keep data private |
| Online dictionaries with audio | Meaning and pronunciation | Check that the example matches your context |

Use these tools to learn, not just to fix. When a checker corrects "discuss about the issue" to "discuss the issue", write the rule in your log so you stop making the error.

### Using an AI assistant for roleplay

An AI chat assistant can play an interviewer, an angry customer or a client in a negotiation. A clear prompt helps:

\`\`\`text
Act as a hiring manager at a software company in Islamabad. Interview
me for a junior project coordinator role. Ask one question at a time
and wait for my answer. After five questions, give me feedback on my
grammar, clarity and structure, with corrected versions of my weakest
two answers.
\`\`\`

Many assistants also support voice mode, so you can practise speaking rather than typing. Remember the limits: the feedback is a guide, not a certificate, and you should never share private company information.

### Finding human practice partners

Nothing replaces real conversation. Options include:

| Partner | How to find them | Good for |
|---|---|---|
| A colleague or friend | Agree to speak only English for 15 minutes a day | Small talk, meeting practice |
| A study group | Classmates or course mates on WhatsApp | Mock interviews, presentation practice |
| Language exchange apps | Apps that pair you with people learning Urdu or another language you speak | Natural conversation with fluent speakers |
| Public speaking clubs | Toastmasters and similar clubs; check whether one meets near you or online | Presentations, impromptu speaking |
| Online communities | Professional groups and forums in your field | Writing posts and comments in English |

When practising with a partner, agree on how to give feedback. A good rule: the listener notes only two or three points and shares them at the end, rather than interrupting every sentence.

### A sample partner session

\`\`\`text
15-minute session with a colleague:
0-5 min   Small talk about the week, English only
5-12 min  One person presents a 2-minute update; the other asks
          two questions; then switch roles
12-15 min Each gives one strength and one thing to improve
\`\`\`

### Safety and privacy online

When using exchange apps or online groups, keep personal details private, meet only in public places if you ever meet in person, and leave any conversation that becomes uncomfortable. Be careful with anyone who asks for money or personal documents.

### Drill

Choose one listening source, one writing helper and one human partner from the tables. Write down when you will use each this week. Then send a message to one possible partner today asking for a 15-minute English practice session.
      `,
        [
          q('How do you know a listening source is at the right level?', [
            'You understand every single word without effort',
            'You understand almost nothing even with subtitles',
            'It is at or slightly above your current level',
            'It uses only very formal and technical words',
          ], 2, 'Material slightly above your level teaches new language without overwhelming you.'),
          q('What is the best way to learn from a grammar checker\'s correction?', [
            'Note the rule in your log so you stop repeating it',
            'Accept it quickly and move on without reading it',
            'Turn the checker off so you make your own choices',
            'Ask the checker to rewrite all of your future emails',
          ], 0, 'Writing down the rule turns a one-off fix into lasting learning.'),
          q('How should a practice partner give feedback during a session?', [
            'Interrupt every sentence to correct each error',
            'Give no feedback so the speaker feels comfortable',
            'Only give feedback by message the following week',
            'Note two or three points and share them at the end',
          ], 3, 'A few points at the end keep the conversation flowing while still helping you improve.'),
        ]
      ),
      lesson('The 30-Day Business English Plan', 14, `
This plan pulls the whole course into thirty days of practice. Each day takes about 20 to 30 minutes. Follow it in order, but do not panic if you miss a day: continue from where you stopped rather than restarting. At the end you will have recordings, written samples and a log that show your progress.

### Before day 1

- Set up your log: a notebook or a phone note.
- Choose one listening source and one practice partner.
- Record a two-minute "Tell me about yourself" answer and save it as "Day 0". Do not listen to it yet.

### Week 1: Clear speech and everyday conversation

| Day | Task |
|---|---|
| 1 | List ten Urdu-speaker slips you make, using your log and earlier chapters. Practise the correct forms aloud. |
| 2 | Shadow a 45-second clip three times. Mark stressed words. |
| 3 | Practise introductions: yourself, your role, your company, in under 30 seconds. |
| 4 | Write and say five small talk openers for a Monday morning at work. |
| 5 | Roleplay asking for help and clarification with your partner or an AI assistant. |
| 6 | Record giving clear instructions for a simple task you do at work. Check pace and fillers. |
| 7 | Review: read your week's log, then repeat the two hardest tasks. |

### Week 2: Calls and meetings

| Day | Task |
|---|---|
| 8 | Practise opening and closing a business call. Record both. |
| 9 | Write five phrases for bad lines and missed words. Say them until automatic. |
| 10 | Prepare a three-item agenda for a real or imaginary meeting. |
| 11 | Practise disagreeing politely: write three disagreements on work topics, soft but clear. |
| 12 | Summarise a meeting you attended in five bullet points with owners and dates. |
| 13 | Leave yourself a 30-second voicemail with name, reason and callback number. Listen back. |
| 14 | Review week 2 and repeat the weakest task with your partner. |

### Week 3: Writing

| Day | Task |
|---|---|
| 15 | Rewrite an old email of yours: clear subject, point first, clear ask. |
| 16 | Replace five outdated phrases, such as "PFA" and "kindly revert", in your own emails. |
| 17 | Write a short status update on a project, under 150 words. |
| 18 | Write a polite request and a polite refusal on the same topic. |
| 19 | Write an apology email for a real or imagined mistake, with a fix. |
| 20 | Write a confirmation of an agreement with numbered points and exact dates. |
| 21 | Proofread all week 3 writing aloud. Note repeated errors in your log. |

### Week 4: High-stakes speaking

| Day | Task |
|---|---|
| 22 | Prepare a three-minute presentation with an opening, three points and a close. |
| 23 | Add signposting phrases and describe one chart or set of numbers. Record it. |
| 24 | Practise a negotiation: an offer, a counteroffer and a trade, with your partner. |
| 25 | Prepare three STAR stories and tell each in about ninety seconds. |
| 26 | Hold a mock interview with your partner or an AI assistant, including salary and notice period questions. |
| 27 | Roleplay calming an angry customer using LEAP. |
| 28 | Rewrite one message for an international reader: no local expressions, exact times with time zones. |
| 29 | Deliver your presentation to your partner and take two questions. |
| 30 | Record "Tell me about yourself" again. Compare it with Day 0. |

### Comparing Day 0 and Day 30

Listen to both recordings one after the other. Use this checklist:

\`\`\`text
Clarity:     Easier to understand?          Day 0 [ ]  Day 30 [ ]
Pace:        Calmer, with pauses?           Day 0 [ ]  Day 30 [ ]
Fillers:     Fewer "um" and "basically"?    Day 0 [ ]  Day 30 [ ]
Structure:   Present, past, future clear?   Day 0 [ ]  Day 30 [ ]
Confidence:  Steadier voice?                Day 0 [ ]  Day 30 [ ]
\`\`\`

Write three lines in your log: what improved, what still needs work and what you will focus on next month.

### After the 30 days

Do not stop practice completely. Keep a lighter routine, such as three short sessions a week, and choose a new monthly focus based on your Day 30 review, for example meetings, writing or presentations. Repeat the Day 0 and Day 30 comparison every few months. Real progress in business English comes from many small sessions over time, not from any single course.

### Drill

Copy the week 1 table into your log now, with real dates next to each day. Record your Day 0 introduction today, before you start.
      `,
        [
          q('What should you do if you miss a day of the plan?', [
            'Restart the whole plan from day one',
            'Give up, because the plan no longer works',
            'Continue from the day where you stopped',
            'Do all the missed days together at once',
          ], 2, 'Continuing where you stopped keeps momentum without punishing a missed day.'),
          q('Why do you record a Day 0 introduction before starting?', [
            'To send it to an employer straight away',
            'To compare it with the same recording on Day 30',
            'To check that your phone microphone is working',
            'To replace the need for a practice partner',
          ], 1, 'Comparing the two recordings shows real progress that day-to-day practice can hide.'),
          q('Which week of the plan focuses on emails, requests and confirmations?', [
            'Week 1',
            'Week 2',
            'Week 3',
            'Week 4',
          ], 2, 'Week 3 is the writing week, covering emails, updates, requests, apologies and confirmations.'),
        ]
      ),
      ],
      [
      q('Which habit link is the best example of attaching practice to an existing routine?', [
        'Practising only when you happen to feel motivated',
        'Listening to a five-minute clip after morning chai',
        'Waiting for a free weekend to study for hours',
        'Buying a new app every week to stay interested',
      ], 1, 'Linking practice to something you already do every day makes the habit stick.'),
      q('While shadowing, what should you copy besides the words?', [
        'The speaker\'s accent from their home city exactly',
        'Only the vocabulary, ignoring how it sounds',
        'The stress, pauses and intonation of the speaker',
        'The speed, even if you cannot keep up at all',
      ], 2, 'Shadowing trains the rhythm and melody of English, not just vocabulary.'),
      q('A friend offers 15 minutes of English practice each day. What makes the session most useful?', [
        'Speaking mostly Urdu so neither of you feels shy',
        'Correcting every mistake the moment it happens',
        'Chatting freely with no structure or feedback at all',
        'A set structure with a short feedback point at the end',
      ], 3, 'Structure plus brief feedback keeps practice focused without breaking the flow.'),
      q('What should guide your focus after finishing the 30-day plan?', [
        'Your Day 30 review of what still needs work',
        'Whatever topic your friends are currently studying',
        'Starting the same plan again without any changes',
        'Stopping practice since the course is now complete',
      ], 0, 'The review shows your weakest area, which becomes next month\'s focus.'),
      ]
    ),
  ],
  final: [
    q('A colleague writes "I would like to bring to your kind notice that the payment is pending." Which rewrite is plain and still polite?', [
      'Kindly note the payment may please be checked at the earliest.',
      'The payment is still pending. Could you check it today?',
      'Payment pending. Check it and revert back to me.',
      'It is hereby brought to your notice that payment is due.',
    ], 1, 'Plain English puts the fact first and adds a clear, polite request, without padding or bluntness.'),
    q('You tell a colleague that the office needs a printer and that the one you both use is broken. Which sentence uses a, an and the correctly?', [
      'We need a new printer because the printer on the second floor is broken.',
      'We need new printer, because printer on the second floor is broken.',
      'We need the new printer because a printer on second floor is broken.',
      'We need a new printer because a printer on a second floor of ours is broken.',
    ], 0, '"A" introduces a new printer that is not yet specific, while "the" marks the particular printer on the second floor that both people know about.'),
    q('Which sentence reports what a colleague said correctly?', [
      'He said that he was running late.',
      'He told that he is running late.',
      'He told to me that he is late today.',
      'He said me that he was running late.',
    ], 0, '"Said" needs no person after it, while "told" needs one, as in "he told me", and the tense shifts back.'),
    q('A developer in Lahore adds "deployment" to a word bank. What turns it into a word they will actually use?', [
      'Writing its spelling and meaning in Roman Urdu beside it',
      'Copying every meaning listed in a dictionary',
      'Noting the date they first read the word',
      'Writing a sentence with it about their own work',
    ], 3, 'A sentence from your own context moves a word from passive recognition to active use.'),
    q('A client says your "receipt" sounds odd. What is the most likely cause?', [
      'Adding a short vowel before the S sound',
      'Merging the short I and long EE vowels',
      'Pronouncing the silent P in the word',
      'Using a V sound instead of a W sound',
    ], 2, 'Receipt is said re-SEET; English spelling misleads many speakers into sounding the silent P.'),
    q('A client heard 50 thousand when you said 15 thousand. How should you correct it?', [
      'Repeat the same sentence faster so it sounds sure',
      'Stress the "teen" and say the digits: one five',
      'Say the number more quietly to avoid seeming rude',
      'Round it to the nearest hundred thousand instead',
    ], 1, 'Clear stress on the "teen" ending plus separate digits removes doubt between numbers that sound alike.'),
    q('A colleague says "I will PREsent the results tomorrow." What is the stress problem?', [
      'Present should never carry any stress at all in a sentence',
      'As a noun, present is stressed on the last syllable',
      'As a verb, present is stressed on the second syllable',
      'The stress should fall on "results", not on "present"',
    ], 2, 'Many two-syllable words stress the first syllable as nouns and the second as verbs, so the verb is preSENT.'),
    q('You record a one-minute update and count "basically" eight times. What should you practise next?', [
      'Swapping "basically" for "actually" or "you know"',
      'Speaking faster so the fillers are less noticeable',
      'Pausing for one breath where the filler would come',
      'Writing out the whole update and reading it aloud each time',
    ], 2, 'A silent pause sounds thoughtful, so replacing the filler with a breath is the fix.'),
    q('A client in Malaysia does not follow "We need to expedite the consignment." What should you say next?', [
      'We need to expedite the consignment, okay?',
      'We need to send the goods faster.',
      'WE NEED TO EXPEDITE THE CONSIGNMENT.',
      'Did you understand what I just said?',
    ], 1, 'Rephrasing in simpler words solves the problem, while repeating or checking the listener does not.'),
    q('Your manager asks you to "clean up the data". Which question clarifies best?', [
      'Sorry, I didn\'t understand. Can you say it all again?',
      'Do you mean remove duplicates, or fix the formats too?',
      'What exactly do you mean by all of that, please?',
      'Okay, should I just do whatever I think is best?',
    ], 1, 'A good clarification points to the exact unclear part, so the answer is quick and specific.'),
    q('Which small talk question is safest with a London client you met today?', [
      'How much do you earn in your current role?',
      'Why have you not had any children yet?',
      'Which political party do you vote for?',
      'Is it still morning for you in London?',
    ], 3, 'Time zones and weather are safe openers, while salary, family plans and politics can feel intrusive.'),
    q('You ask, "Would you mind sharing the template?" Your colleague replies, "Not at all." What does this mean?', [
      'They are happy to share it',
      'They refuse to share it',
      'They have not decided yet',
      'They want you to ask HR',
    ], 0, '"Would you mind" asks whether it is a problem, so "not at all" means yes, it is fine.'),
    q('You tell a junior, "Prepare the sales summary by Thursday." What could you add to help them handle surprises?', [
      'Why you need it, such as Friday\'s regional review',
      'A reminder that the task is very important',
      'The word "kindly" at the start of the sentence',
      'A request that they reply "noted" straight away',
    ], 0, 'The reason lets the other person make good decisions when something unexpected happens.'),
    q('You answer an external work line. Which greeting is best?', [
      'Good morning, Indus Logistics, Sara speaking.',
      'Hello? Hello? Who is on the line, please?',
      'Haan ji, yes, tell me, what is it about?',
      'Yes, this is the office. What do you want?',
    ], 0, 'A greeting with the company and your name tells the caller at once that they have reached the right place.'),
    q('A caller asks for your manager, who is out. What should your message include?', [
      'The caller\'s name and the time they called',
      'Only the reason, since your manager knows them',
      'Your own view of how important the call was',
      'Name, company, number, reason and urgency',
    ], 3, 'These five items let your manager return the call properly, and reading the number back avoids errors.'),
    q('A client\'s video freezes just as they give a date. What do you say?', [
      'You froze for a second. Could you repeat the date?',
      'Yes, that date is fine with us, thank you so much.',
      'What? Your video is bad, please say everything again.',
      'Sorry, I will just guess the date and email you.',
    ], 0, 'A targeted request names the problem and asks only for the missing detail.'),
    q('A supplier needs your bank account number and delivery address. How should you send them?', [
      'As a voice note, so your tone is clear to them',
      'As two short voice notes, one for each detail',
      'By reading them out during a quick phone call',
      'As a typed message they can copy and search',
    ], 3, 'Details the other person must copy or find later are far easier to use in text.'),
    q('Your stock count found a gap and you need finance\'s help at tomorrow\'s meeting. How should you prepare?', [
      'Write a full script and read it word for word in the room',
      'Wait to see if anyone asks you about the stock count first',
      'Prepare a long history of how stock counts have been done',
      'Write a short status, issue and need, and say them aloud once',
    ], 3, 'Three prepared sentences let you speak quickly and clearly without a script.'),
    q('You are chairing and item 2 is ten minutes over time. What is the best move?', [
      'Let it run on and drop the remaining items',
      'Cut the speaker off and move to the next item',
      'End the meeting early and leave the rest to email',
      'Offer to decide now or set up a separate call',
    ], 3, 'Giving the group a choice keeps the chair in control while respecting the discussion.'),
    q('A peer says a new courier will be faster. Which reply follows acknowledge, disagree, suggest?', [
      'I take your point on speed, but they\'re untested. Could we try a small batch?',
      'No, that will not work, because we have never used this courier before.',
      'You are right, the new courier will be faster, so let us switch to them at once.',
      'I am worried about this courier and I do not think we should use them.',
    ], 0, 'It recognises the other view, names a specific concern and turns the disagreement into a next step.'),
    q('Near the end of a meeting someone says, "Let\'s follow up with the client." What should you ask?', [
      'Who will own that, and by when?',
      'Is that really a good idea, though?',
      'Shall we discuss this in more detail?',
      'Can we add it to the next agenda?',
    ], 0, 'An action point needs a person and a deadline, and these two questions supply both.'),
    q('Your presentation is for senior management. What should it focus on?', [
      'Who in the team does each small task',
      'The decision, the cost and the risk',
      'Your data, method and its limitations',
      'The history of the project from the start',
    ], 1, 'Senior listeners want the decision, cost and risk quickly; other audiences want other details.'),
    q('Which phrase signals that you are returning to an earlier point?', [
      'That brings me to my second point...',
      'I am happy to take any questions now.',
      'Coming back to the cost question...',
      'To give you an idea of the numbers...',
    ], 2, '"Coming back to" points the audience to something already mentioned, while the others move forward or invite questions.'),
    q('Weekly complaints went from 20 to 25. Which sentence describes this accurately?', [
      'Complaints rose from 20 to 25 a week.',
      'Complaints rose by 25 a week.',
      'Complaints rose to 5 a week.',
      'Complaints peaked by 20 a week.',
    ], 0, '"From" and "to" give the old and new levels, while "by" would mean a change of 25.'),
    q('You must quote 50 lakh rupees to a client in Dubai. How should you say it?', [
      'Fifty million rupees',
      'Five hundred thousand rupees',
      'Fifty thousand rupees',
      'Five million rupees',
    ], 3, 'Ten lakh is one million, so fifty lakh is five million, which international listeners understand.'),
    q('In the Q and A, someone asks about a topic outside your area. What is the best reply?', [
      'Give your best guess so that you appear confident and prepared.',
      'That\'s outside what I looked at, but I can find out who knows.',
      'Say that the question is not relevant to this presentation.',
      'Move to the next slide and hope nobody notices the question.',
    ], 1, 'Being honest and offering a next step keeps trust, while guesses or dodging damage it.'),
    q('You want your manager to approve leave from 20 to 24 December. Which subject line is best?', [
      'A quick request from Sara in accounts',
      'Urgent!!! Please read this today',
      'Hello, hope you are well',
      'Leave request: 20 to 24 December',
    ], 3, 'A specific subject tells the reader what the email is about and what is needed.'),
    q('Which closing line gives the reader a clear next step?', [
      'Kindly do the needful and revert at the earliest, regards.',
      'Could you confirm the order by Friday so we can start production?',
      'Please find attached herewith the quotation for your kind perusal.',
      'Hoping for a positive and early response from your good self soon.',
    ], 1, 'It says what the reader must do, by when and why, in plain modern English.'),
    q('You are emailing a newsletter to 200 external clients. Where should their addresses go?', [
      'In the To line, so everyone feels included',
      'In CC, so that all of them stay informed',
      'In BCC, so no one sees anyone else\'s address',
      'Split across To and CC in alphabetical order',
    ], 2, 'BCC hides recipients from each other, which protects a large external list.'),
    q('On Slack you need a file from a colleague. Which message is best?', [
      'Hi Sana, could you share the Q3 file? Finance needs it by 3pm.',
      'Hi Sana, are you there? I need something from you when you\'re free.',
      '?? Still waiting for that file from this morning',
      'Send the Q3 file now, finance is asking for it.',
    ], 0, 'Greeting and asking in one message, with a reason and a time, saves both people time and stays polite.'),
    q('Your manager asked, "Should we open a Multan branch?" What must your report summary do?', [
      'Describe how the research was done, step by step, before anything else',
      'Answer yes, no or yes with conditions in its first lines',
      'Hold the answer back until the final section',
      'List every finding without giving any view',
    ], 1, 'Business reports lead with the answer to the reader\'s question, and the rest supports it.'),
    q('You are taking minutes and miss who owns an action. What should you do?', [
      'Leave it out and hope someone remembers who owns it later',
      'Ask, "Sorry, could I confirm the action on that one?"',
      'Assign it to whoever seemed most interested',
      'Write "someone will do this" in the minutes',
    ], 1, 'Checking an action during the meeting is expected of a note taker and keeps the record accurate.'),
    q('Your report was late because you underestimated the checks. Which apology is best?', [
      'Sorry for the inconvenience caused, if any, due to the late report.',
      'Mistakes happen, and the server and the load shedding were the real cause here.',
      'I\'m sorry it was late. I\'ll start the checks a week earlier from now on.',
      'Extremely, extremely sorry, sir, please forgive me for this delay.',
    ], 2, 'A good apology takes responsibility, explains briefly and says what will change.'),
    q('A grammar tool finds no errors in "Please send the file form the server." Why?', [
      'It missed a real word used in the wrong place',
      'The sentence is correct and needs no change at all',
      'Grammar tools never check spelling',
      '"Form" is the British spelling of "from"',
    ], 0, 'Tools can miss correctly spelled words in the wrong place, so you must still read the text yourself.'),
    q('You want staff to work from home on Fridays. Which ask is easiest for a manager to accept?', [
      'Please approve it for everyone from next week.',
      'Could we try it with one team for a month?',
      'Sir, please, please consider this request.',
      'You have to agree, it is the best option.',
    ], 1, 'A small, reversible trial lowers the cost of saying yes.'),
    q('A client says, "Your quote is too high." What is a strong first move?', [
      'Cut your price by half at once',
      'Ask what budget they had in mind',
      'Tell them your price is final',
      'Say their budget is unfair',
    ], 1, 'A question reveals the other side\'s position before you give away anything.'),
    q('A colleague asks you to cover their Saturday shift, but you are committed. Which reply follows the soft no?', [
      'I\'ll try, let\'s see how the whole week goes, and I will tell you more about it then.',
      'No, I can\'t do it, please ask someone else for help with your shift.',
      'Thanks for asking. I\'m on the audit this Saturday, but I could help next week.',
      'Sorry, sorry, really sorry, I am so busy, it\'s not possible this time.',
    ], 2, 'It appreciates, declines, gives a short true reason and offers an alternative.'),
    q('After your confirmation email, the supplier says delivery is the 18th, not the 15th. What do you write?', [
      'We clearly agreed the 15th on the call, so please check your notes again.',
      'Thanks. So delivery is 18 March. Everything else stays the same.',
      'Okay, noted, as discussed earlier on our phone call today.',
      'Please send a voice note explaining why the date changed.',
    ], 1, 'Acknowledging and restating the full corrected point keeps the record clear without an argument.'),
    q('A fresh graduate with no job yet is asked, "Tell me about yourself." What can fill the present and past parts?', [
      'Their family background and home town',
      'Every school exam result since matriculation',
      'A list of qualities like honest and punctual',
      'Their degree, final-year project or internship',
    ], 3, 'Freshers can use study, projects, internships and volunteering as their experience.'),
    q('You are asked about a time you showed leadership, but you have never had a title. What works best?', [
      'A STAR story of a time you took initiative',
      'Saying you cannot answer without a title',
      'A general claim that you are a natural leader',
      'A story about your team, told only with "we"',
    ], 0, 'Leadership questions look for initiative, and a STAR story with your own actions shows it.'),
    q('Remote work matters to you. How should you ask about it at the end of an interview?', [
      'Could you tell me how the team usually works, in the office or remotely?',
      'Can I work from home from the very first day, or is that not allowed here?',
      'How many leaves and work from home days will I get in a year?',
      'I only want a remote job, so is this one remote or not?',
    ], 0, 'A neutral question about how the team works gets the information without sounding demanding.'),
    q('An interviewer asks if you can join next week, but your contract needs one month\'s notice. What do you say?', [
      'Yes, I can join next week, and I will sort out my notice later.',
      'I will just stop going to my current job once you make an offer.',
      'Notice periods do not really matter much, so whatever date you prefer is fine with me.',
      'My contract needs a month\'s notice, but I\'ll ask if they can release me earlier.',
    ], 3, 'Being honest about notice, while offering to ask for an early release, shows you will leave properly.'),
    q('A chat customer writes, "parcel came but charger missing". What should you send next?', [
      'Dear customer, your issue is noted and will be looked into by the team.',
      'You should have checked the box before signing for it.',
      'Kindly revert with complete details of your complaint.',
      'So your parcel arrived but the charger was missing. Is that right?',
    ], 3, 'Confirming the problem back shows you listened and catches misunderstandings early.'),
    q('A caller keeps swearing at you on the phone. What should you do?', [
      'Shout back so they understand you will not accept it',
      'Hang up at once without saying anything to them',
      'Set a calm boundary and follow your company\'s policy',
      'Stay silent and accept the insults until they stop',
    ], 2, 'A calm boundary, with escalation or ending the call as policy allows, protects you and stays professional.'),
    q('On a video call, a European colleague looks confused when you move your head side to side. What helps?', [
      'Nod more strongly so the meaning is clearer',
      'Turn your camera off for the rest of the call',
      'Explain the gesture\'s history across South Asia',
      'Add words, such as "Yes, that works for me."',
    ], 3, 'The head wobble can read as no or maybe elsewhere, so saying your answer removes the doubt.'),
    q('A teammate\'s figures are wrong and you want to be clear but kind. What should you say?', [
      'Maybe you could look at the figures again sometime, if you get a free moment this week.',
      'This report is not good enough. Your figures are all wrong, so redo them.',
      'The figures in section 2 don\'t match sales data. Could you fix them by tomorrow?',
      'I don\'t want to say anything, but some people think there may be issues.',
    ], 2, 'Naming the issue, keeping it about the work and saying what is needed is clear without being harsh.'),
    q('You spend 45 minutes on a bus each day. What is the best way to use it for practice?', [
      'Wait for a free weekend and study for three hours',
      'Download five new apps and try each one briefly on the way',
      'Listen to a short business English clip with earphones',
      'Write a long formal essay by hand on your lap',
    ], 2, 'Commute time can become listening practice without changing anything else in the day.'),
    q('You compare your recording with a clip you shadowed, and yours sounds flat. What should you work on?', [
      'Copying the speaker\'s regional accent exactly',
      'Speaking every syllable with the same weight',
      'Stressing key words and shortening small ones',
      'Learning longer and more formal vocabulary',
    ], 2, 'Flat speech usually means equal weight on every syllable, so stressing content words fixes it.'),
    q('You want an AI assistant to play an interviewer. Which instruction makes the practice most useful?', [
      'Ask all ten questions in one message, with no feedback',
      'Write perfect answers for you to memorise word for word first',
      'Ask one question at a time, then give feedback at the end',
      'Use your real company\'s confidential details as context',
    ], 2, 'One question at a time mimics a real interview, and feedback at the end shows you what to fix.'),
    q('Your Day 30 recording shows a calmer pace but just as many fillers. What should next month focus on?', [
      'Starting the same plan again unchanged',
      'Cutting fillers, using pauses instead',
      'Pace, since it improved the most so far',
      'Stopping practice, as the plan is done',
    ], 1, 'The Day 30 review shows your weakest area, which becomes the focus of the next month.'),
  ],
});
