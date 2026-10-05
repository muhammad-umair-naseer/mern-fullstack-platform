import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'data-analyst-bootcamp',
  title: 'Data Analyst Bootcamp',
  category: 'Data',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'emerald',
  coverKey: 'data-analyst-bootcamp',
  summary:
    'Go from zero to job-ready data analyst: ask sharp business questions, pull data with SQL and spreadsheets, clean it, analyse it with statistics and Python, and turn the result into charts and recommendations people act on.',
  description:
    'This course follows the real working day of a data analyst from the first vague request to the decision it informs. You learn to turn a question into a metric, query and join data with SQL, work fast in spreadsheets, and clean messy exports without losing rows or trust. You apply descriptive statistics, segmentation, cohorts, funnels and A/B tests to real business problems, use pandas when a spreadsheet stops coping, and design charts and dashboards that answer one question each. The last chapters cover writing insight memos, presenting to managers, building a portfolio from public datasets and passing analyst interviews, including remote and freelance work from Pakistan.',
  chapters: [
    chapter(
      'The Data Analyst Role',
      'Understand what data analysts do all day, the workflow that turns a question into a decision, how analysis-ready tables are shaped, and how spreadsheets, SQL, Python and dashboards fit together.',
      [
      lesson('What a Data Analyst Actually Does', 12, `
A data analyst helps people make better decisions by turning raw records into clear answers. The records might be orders from an online store, calls to a support centre, students enrolled in a course, or deliveries made by a courier company. The answer might be a single number, a chart, a short memo or a dashboard that a manager checks every morning.

### A typical week

Most analysts split their time across a small set of recurring jobs:

| Activity | Share of time | Example |
|---|---|---|
| Pulling and cleaning data | 35% | Exporting last month's orders and fixing duplicate customer IDs |
| Answering ad hoc questions | 25% | "Why did returns jump in Karachi last week?" |
| Maintaining reports and dashboards | 20% | Refreshing the weekly sales dashboard |
| Deeper analysis projects | 15% | Measuring whether free delivery increases repeat purchases |
| Meetings and presenting | 5% | Walking the marketing team through campaign results |

The percentages vary between companies, but one pattern holds almost everywhere: getting data into a trustworthy state takes longer than analysing it. People who enjoy that detective work tend to enjoy the job.

### What analysts are not

A data analyst is not the same as a data scientist or a data engineer, although the roles overlap.

- **Data engineers** build the pipelines and warehouses that collect and store data reliably.
- **Data analysts** query that data to answer business questions and explain what happened and why.
- **Data scientists** build predictive models and run more advanced statistics, often writing production code.

In a small company in Lahore or Islamabad one person may do all three. In a large bank or telecom they are separate teams. Knowing the boundaries helps you read job adverts correctly: a "data analyst" advert that asks for deep learning experience is really a data science role.

### The skills that matter most

Employers consistently look for five things:

1. **SQL** to pull exactly the data you need.
2. **Spreadsheets** for quick checks, small models and sharing with non-technical colleagues.
3. **A visualisation tool** such as Power BI, Tableau or Looker Studio.
4. **Basic statistics** so you know when a difference is real.
5. **Communication** so your findings change what people do.

Python is increasingly expected too, especially for larger datasets and repeatable work. You will learn all six in this course.

### Where analysts work

Almost every sector hires analysts now. Banks track loan defaults, e-commerce companies track conversion and returns, telecoms track churn, hospitals track waiting times, and NGOs track programme outcomes for donors. Remote work has also opened international roles to analysts in Pakistan, paid in dollars, as long as their portfolio proves they can do the work.

### The mindset

Good analysts are curious and sceptical in equal measure. When a number looks surprising, the first question is "is this real, or is the data wrong?" The second is "so what should we do about it?" Holding both questions at once is the core of the job.
      `,
        [
          q('Which activity usually takes the largest share of an analyst\'s time?', [
            'Presenting to senior management',
            'Building machine learning models',
            'Pulling and cleaning data',
            'Designing database servers',
          ], 2, 'Getting data into a trustworthy state is the most time-consuming part of most analyst jobs.'),
          q('How does a data analyst\'s role usually differ from a data engineer\'s?', [
            'Analysts answer business questions; engineers build the pipelines that store data',
            'Analysts write production apps; engineers write reports',
            'Analysts only use Excel; engineers only use Python',
            'There is no real difference between the two',
          ], 0, 'Engineers make data available and reliable, while analysts query it to explain what happened and why.'),
          q('A surprising number appears in your weekly report. What should your first question be?', [
            'How quickly can I send this to the CEO?',
            'Which chart will make it look most dramatic?',
            'Should I remove it from the report?',
            'Is this real, or is something wrong with the data?',
          ], 3, 'Checking data quality first prevents confident decisions built on broken numbers.'),
        ]
      ),
      lesson('The Analysis Workflow From Question to Decision', 12, `
Every analysis, from a five-minute check to a month-long project, follows the same basic shape. Learning the shape early stops you from jumping straight into data before you know what you are looking for.

### The six steps

| Step | Key question | Output |
|---|---|---|
| 1. Ask | What decision will this inform? | A clear analysis question |
| 2. Collect | Which data answers it, and where does it live? | A raw extract |
| 3. Clean | Can I trust these rows? | An analysis-ready table |
| 4. Analyse | What patterns, differences or changes exist? | Numbers and charts |
| 5. Share | What does this mean for the audience? | A memo, slide or dashboard |
| 6. Act | What will change because of it? | A decision and a follow-up check |

The steps are not strictly one-way. Cleaning often reveals that you need different data, and early analysis often sharpens the original question. Expect to loop back.

### A worked example

A clothing store that sells through Instagram and its own website asks: "Are we wasting money on Instagram ads?"

1. **Ask.** The real decision is whether to cut, keep or increase the monthly ad budget of PKR 400,000. The analysis question becomes: "What is the cost per paying customer from Instagram ads compared with other channels over the last six months?"
2. **Collect.** Ad spend comes from Meta Ads Manager. Orders come from the website database. Customer source comes from UTM tags on the links.
3. **Clean.** About 18% of orders have no UTM tag. You decide to report them as "unknown" rather than guessing, and you remove test orders placed by staff.
4. **Analyse.** Instagram brings customers at PKR 1,450 each; Google search brings them at PKR 900. However, Instagram customers spend 30% more on their first order.
5. **Share.** A one-page memo with one chart comparing cost per customer and first-order value.
6. **Act.** The owner keeps Instagram but shifts 20% of its budget to search and asks for the same comparison next quarter.

### Why the first step matters most

Analysts who skip the Ask step often produce beautiful reports nobody uses. A request like "send me the sales data" hides a real question. Ask "what will you decide with it?" and the job becomes smaller, faster and more useful.

### Keeping a log

Write a short log as you work: where data came from, which filters you applied, what you excluded and why. It takes minutes and saves hours when someone asks, three weeks later, why your total differs from finance's total.

\`\`\`text
2026-03-04  Orders export from Shopify, 1 Sep to 28 Feb, 14,212 rows
2026-03-04  Removed 37 staff test orders (email ends @ourstore.pk)
2026-03-04  2,558 orders lack UTM source, labelled "unknown"
\`\`\`

A log like this also makes your work repeatable, which is the difference between a one-off answer and a trusted process.
      `,
        [
          q('What is the main purpose of the Ask step?', [
            'To choose the chart type early',
            'To identify the decision the analysis will inform',
            'To request database access',
            'To estimate how many rows the data has',
          ], 1, 'Knowing the decision behind a request keeps the analysis focused and useful.'),
          q('In the store example, how were orders without a UTM tag handled?', [
            'They were assigned to Instagram',
            'They were deleted from the dataset',
            'They were reported as "unknown"',
            'They were split evenly across channels',
          ], 2, 'Labelling them unknown avoids inventing attribution while keeping the total honest.'),
          q('Why keep a log of your analysis steps?', [
            'It is required by tax law',
            'It makes queries run faster',
            'It replaces the need for charts',
            'It explains differences later and makes the work repeatable',
          ], 3, 'A record of sources and filters lets you defend results and rerun the analysis.'),
        ]
      ),
      lesson('Tables, Rows and Tidy Data', 12, `
Nearly all analysis happens on tables. Before you write a single formula or query, you need to know what one row means and whether the table is shaped in a way tools can work with.

### The grain of a table

The grain is what a single row represents. It is the most important fact about any table.

| Table | Grain | Example row |
|---|---|---|
| orders | One order | Order 10452, customer 881, 3 Mar, PKR 4,200 |
| order_items | One product within an order | Order 10452, product "Lawn kurta", qty 2 |
| daily_sales | One store on one day | Gulberg branch, 3 Mar, PKR 312,000 |
| customers | One customer | Customer 881, Lahore, joined 2024 |

If you count rows in order_items and call it "number of orders", you will overcount every order with more than one product. Many reporting mistakes come from confusing grains, so always ask "what does one row mean?" first.

### Tidy data

Tidy data follows three rules:

1. Each variable has its own column.
2. Each observation has its own row.
3. Each value has its own cell.

Here is an untidy sheet that a manager might send you:

| City | Jan | Feb | Mar |
|---|---|---|---|
| Lahore | 120 | 135 | 150 |
| Karachi | 210 | 190 | 230 |

It is easy for humans to read, but "month" is spread across three column headers. The tidy version has one column per variable:

| City | Month | Orders |
|---|---|---|
| Lahore | Jan | 120 |
| Lahore | Feb | 135 |
| Lahore | Mar | 150 |
| Karachi | Jan | 210 |

Tidy tables are longer, but every tool, from PivotTables to SQL to pandas, can filter, group and chart them without special handling. Adding April means adding rows, not changing the structure.

### Keys

A primary key uniquely identifies each row, like order_id in orders. A foreign key points to a row in another table, like customer_id in orders pointing to customers. Keys are how you combine tables safely. Before trusting a key, check it really is unique:

\`\`\`sql
SELECT order_id, COUNT(*) AS copies
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;
\`\`\`

If this returns rows, your "unique" key has duplicates, and any join on it will multiply rows.

### Facts and dimensions

Analytics databases often separate fact tables, which record events with numbers such as sales and clicks, from dimension tables, which describe things such as products, customers and stores. A sales question usually means starting from a fact table and joining the dimensions you need to group or filter by.

### Practical habit

Whenever you receive a new table, write one sentence at the top of your notes: "One row in this table is one ___." It takes ten seconds and prevents the most common mistake in the profession.
      `,
        [
          q('What does the grain of a table describe?', [
            'The number of columns it has',
            'The database it is stored in',
            'What a single row represents',
            'How often it is refreshed',
          ], 2, 'Knowing what one row means prevents counting and joining mistakes.'),
          q('Why is a sheet with months as separate column headers considered untidy?', [
            'One variable, the month, is spread across several columns',
            'It has too few rows to analyse',
            'Months should always be numbers',
            'It uses city names instead of codes',
          ], 0, 'Tidy data keeps each variable in one column so tools can filter and group it.'),
          q('What does a query grouping by order_id with HAVING COUNT(*) > 1 check?', [
            'Which orders have more than one product',
            'Which customers ordered twice',
            'Which orders were cancelled',
            'Whether the supposed unique key has duplicates',
          ], 3, 'Any order_id appearing more than once means the key is not unique and joins will multiply rows.'),
        ]
      ),
      lesson('The Analyst Toolkit and How the Tools Fit Together', 12, `
Beginners often ask which tool to learn first, as if they must pick one. In practice, analysts use several tools in one workflow, each for what it does best.

### The core tools

| Tool | Best for | Weak at |
|---|---|---|
| Excel or Google Sheets | Quick checks, small data, sharing with anyone | Millions of rows, repeatable pipelines |
| SQL | Pulling, filtering, joining and summarising data where it lives | Charts, ad hoc formatting |
| Power BI, Tableau, Looker Studio | Interactive dashboards and recurring reports | Complex data cleaning |
| Python with pandas | Large files, automation, advanced analysis | Quick one-off edits by non-coders |

### A realistic workflow

Consider a weekly churn report at a telecom company:

1. A **SQL** query pulls last week's cancelled connections from the data warehouse, joined to customer plans and regions.
2. The result feeds a **Power BI** dashboard that managers open on Monday mornings.
3. When the regional manager for Sindh asks a one-off question, the analyst exports a small slice to **Excel** and builds a quick PivotTable.
4. Every quarter, a **Python** notebook combines churn data with complaint logs to find which complaint types predict cancellations.

No single tool could do all four jobs well.

### Where to start

Learn in this order if you are new:

1. **Spreadsheets** first, because every employer uses them and they teach you to think in rows, columns and formulas.
2. **SQL** next, because it is in almost every analyst job advert and is easier than people expect.
3. **One BI tool**, usually Power BI in Pakistan and Tableau in many international roles.
4. **Python** once the first three feel comfortable.

### The same question in three tools

Total revenue per city looks different in each tool but means the same thing.

\`\`\`sql
SELECT city, SUM(amount) AS revenue
FROM orders
GROUP BY city;
\`\`\`

In Excel, the same result comes from a PivotTable with City in Rows and Sum of Amount in Values. In pandas:

\`\`\`py
orders.groupby("city")["amount"].sum()
\`\`\`

Once you understand the idea of grouping and aggregating, switching tools is mostly a matter of syntax.

### Supporting tools

You will also meet version control such as Git for saving queries and notebooks, cloud storage such as Google Drive or SharePoint, and communication tools like Slack or Teams where most questions arrive. AI assistants are now common too: they can draft SQL or explain an error, but you remain responsible for checking that the result is correct.

### Choosing for each task

Before starting any task, ask three questions. How big is the data? Will I need to repeat this? Who needs to see the result? Small, one-off and for a colleague suggests a spreadsheet. Large or recurring suggests SQL and a dashboard. Complex or automated suggests Python.
      `,
        [
          q('Which tool is usually best for a dashboard managers open every Monday?', [
            'A Python script printed to the terminal',
            'A BI tool such as Power BI or Tableau',
            'A fresh Excel file emailed each week',
            'A handwritten summary',
          ], 1, 'BI tools are built for interactive dashboards that refresh on a schedule.'),
          q('What is the recommended first tool for a complete beginner?', [
            'Python with pandas and Jupyter',
            'Tableau',
            'Spreadsheets such as Excel or Google Sheets',
            'A cloud data warehouse',
          ], 2, 'Spreadsheets are used everywhere and build the row and column thinking that other tools rely on.'),
          q('What is true about grouping and aggregating across SQL, Excel and pandas?', [
            'Only SQL can group data correctly',
            'Each tool produces different totals for the same data',
            'pandas cannot sum values by group',
            'The idea is the same and mainly the syntax changes',
          ], 3, 'Group-and-summarise is a universal concept that every analysis tool supports.'),
        ]
      ),
      ],
      [
      q('A manager asks you to "send all the sales data". What is the most useful response?', [
        'Export every table and send them immediately',
        'Refuse until a formal ticket is raised',
        'Ask what decision they want to make with it',
        'Send last year\'s report instead',
      ], 2, 'Uncovering the real decision turns a vague request into a focused, useful analysis.'),
      q('You count rows in an order_items table and report it as the number of orders. What goes wrong?', [
        'Orders with several products are counted more than once',
        'Cancelled orders are excluded automatically',
        'The count is always exactly correct',
        'Customers are counted instead of orders',
      ], 0, 'The grain of order_items is one product per order, so counting rows overstates orders.'),
      q('Which combination best describes tidy data?', [
        'One sheet per month with merged header cells',
        'Totals and subtotals mixed into the data rows',
        'Several values separated by commas in one cell',
        'One variable per column, one observation per row, one value per cell',
      ], 3, 'These three rules make tables usable by spreadsheets, SQL and pandas alike.'),
      q('A large monthly report must be rebuilt every month from the warehouse. Which approach fits best?', [
        'Copying and pasting into a new spreadsheet each month',
        'A saved SQL query feeding a dashboard or repeatable script',
        'Rewriting the analysis from scratch each time',
        'Asking a colleague to type the numbers in',
      ], 1, 'Recurring work on large data should be automated with saved queries and repeatable tools.'),
      ]
    ),
    chapter(
      'Asking the Right Questions',
      'Learn to turn vague requests into answerable questions, define metrics so everyone counts the same way, manage stakeholders and scope, and write a one-page plan before touching any data.',
      [
      lesson('Turning a Vague Request Into an Analysis Question', 12, `
Most requests arrive in a vague form: "Can you look into sales?", "Why are customers unhappy?", "Is the new app feature working?" None of these can be answered as written. Your first job is to turn them into a question that data can actually answer.

### Properties of a good analysis question

A good question is:

| Property | Vague version | Sharp version |
|---|---|---|
| Specific | How are sales? | How did revenue change month on month? |
| Measurable | Are customers happy? | What share of support tickets get a 4 or 5 rating? |
| Bounded in time | Is the feature working? | Did weekly active users change in the 4 weeks after launch? |
| Tied to a decision | Look into returns | Should we stop free returns on sale items? |
| Comparable | Is Lahore doing well? | How does Lahore's conversion rate compare with Karachi's? |

If you cannot imagine what the final chart or number will look like, the question is not sharp enough yet.

### The five whys, adapted

Ask "why?" a few times to get from the request to the decision behind it.

- Request: "I need the list of customers who stopped buying."
- Why? "We want to win them back."
- Why those customers? "We think a discount will bring them back."
- Why do you think so? "Competitors are cheaper."
- So the real question is: "Did lapsed customers leave because of price, and would a discount bring enough of them back to cover its cost?"

That is a much better project than a list of names, and it may need survey data or a test rather than only a customer export.

### Questions that cannot be answered yet

Some questions cannot be answered with the data you have. "Would customers buy a premium plan?" has no historical data if the plan does not exist. Say so early and suggest an alternative: a survey, a landing-page test, or data from a similar product. Admitting a limit on day one builds more trust than delivering a weak answer on day ten.

### Descriptive, diagnostic, predictive

Classify each question by type, because the type sets the method:

- **Descriptive**: what happened? Monthly sales by region.
- **Diagnostic**: why did it happen? The causes behind a drop in sign-ups.
- **Predictive**: what will happen? Next quarter's demand.
- **Prescriptive**: what should we do? Which customers to target with an offer.

Most analyst work is descriptive and diagnostic. Be careful when a predictive or prescriptive question arrives disguised as a simple report.

### A template

When a request arrives, reply with a short confirmation before starting:

\`\`\`text
To make sure I answer the right thing:
Question: How did repeat purchase rate change for customers acquired
          in Q1 versus Q4?
Decision: Whether to continue the Q1 loyalty discount.
Data: Orders table, Jan 2025 to Mar 2026.
Delivery: One chart and a short summary by Thursday.
Does that match what you need?
\`\`\`

This message takes two minutes to write and prevents most of the rework analysts complain about.
      `,
        [
          q('Which is the sharpest analysis question?', [
            'Look into our sales performance',
            'Are our customers satisfied overall?',
            'How did weekly active users change in the four weeks after launch?',
            'Tell me everything about the app',
          ], 2, 'It is specific, measurable, bounded in time and comparable with the period before.'),
          q('What is the purpose of asking "why?" several times about a request?', [
            'To delay starting the work',
            'To uncover the real decision behind the request',
            'To find who to blame for a problem',
            'To increase the number of charts needed',
          ], 1, 'Repeated why questions move from a surface request to the decision that matters.'),
          q('What should you do when the data cannot answer a question?', [
            'Produce an answer from whatever data exists',
            'Ignore the request quietly',
            'Guess the answer from experience',
            'Say so early and suggest another way to get evidence',
          ], 3, 'Being honest about limits and proposing alternatives builds trust and avoids misleading results.'),
        ]
      ),
      lesson('Metrics, KPIs and Precise Definitions', 12, `
A metric is a number you track. A KPI, or key performance indicator, is a metric the business has chosen as a measure of success. The hardest part of either is not calculating it; it is defining it so that everyone counts the same way.

### Why definitions cause arguments

Ask three teams "how many active customers do we have?" and you may get three different answers:

| Team | Their definition | Result |
|---|---|---|
| Marketing | Anyone who opened an email in 90 days | 48,000 |
| Sales | Anyone who bought in 12 months | 31,000 |
| Finance | Anyone who paid an invoice this quarter | 12,500 |

None of them is wrong. They are measuring different things with the same name. The analyst's job is to make the definition explicit and agreed.

### Writing a metric definition

A complete definition answers five questions:

1. **What is counted?** Distinct customers, orders, or rupees?
2. **What qualifies?** Paid orders only, or including cancelled?
3. **Over what period?** Calendar month, rolling 30 days, financial year?
4. **From which source?** Which table or system is the truth?
5. **What is excluded?** Staff accounts, test orders, refunds?

For example:

\`\`\`text
Monthly Active Customers (MAC)
Count of distinct customer_id with at least one paid order
(status = 'paid', refunds excluded) in the calendar month,
from warehouse table fact_orders. Staff and test accounts excluded.
\`\`\`

### Rates and their denominators

Many KPIs are rates, and the denominator changes everything. A conversion rate of "orders divided by visitors" differs from "orders divided by sessions", because one visitor can have several sessions. Always state both the numerator and the denominator.

### Good KPIs and vanity metrics

A good KPI is connected to value and can be influenced by the team that owns it. Vanity metrics look impressive but do not guide decisions.

| Vanity metric | Better alternative |
|---|---|
| Total app downloads | Users active 30 days after install |
| Page views | Sign-ups or purchases per visitor |
| Followers | Clicks or sales from social posts |
| Emails sent | Revenue per email sent |

### Leading and lagging indicators

Lagging indicators, such as quarterly revenue, show results after the fact. Leading indicators, such as free-trial sign-ups or items added to carts, move earlier and give time to react. A healthy dashboard contains both.

### Keep a metric dictionary

Store every agreed definition in a shared document or a tab in your dashboard. When someone asks why two reports disagree, the dictionary usually settles it in a minute. It is one of the most valuable things a junior analyst can build in their first months at a company.
      `,
        [
          q('Why might three teams report different numbers of "active customers"?', [
            'They use different definitions under the same name',
            'One of the databases must be broken',
            'Active customers cannot be measured',
            'They are using different currencies',
          ], 0, 'Different qualifying rules produce different counts, so definitions must be explicit.'),
          q('Which is a vanity metric rather than a useful KPI?', [
            'Users active 30 days after installing',
            'Revenue per email sent',
            'Purchases per visitor',
            'Total number of app downloads',
          ], 3, 'Downloads look impressive but say little about value or retention.'),
          q('What is a leading indicator?', [
            'A metric reported only once a year',
            'A measure that moves early and gives time to react',
            'The most important KPI on a dashboard',
            'A metric owned by senior leaders',
          ], 1, 'Leading indicators such as trial sign-ups change before results such as revenue do.'),
        ]
      ),
      lesson('Stakeholders, Scope and Deadlines', 12, `
Analysis happens for people. Stakeholders are the people who asked for the work, will use it, or will be affected by it. Managing them well matters as much as writing correct queries.

### Mapping your stakeholders

For any project bigger than a quick check, list the people involved:

| Role | Example | What they need from you |
|---|---|---|
| Requester | Head of Marketing | A clear answer they can act on |
| Decision maker | CEO | A short recommendation with the key number |
| Data owner | IT or data engineering | Clear requests and respect for their systems |
| Affected team | Customer support | To understand how changes affect their work |

The requester and the decision maker are not always the same person. If the CEO will make the final call, the output must work for the CEO, who may read only the first paragraph.

### Agreeing scope

Scope is what is in and out of the project. Without it, projects grow quietly until they miss every deadline. A simple scope statement covers:

- **In scope**: online orders, January to June, Pakistan only.
- **Out of scope**: retail store sales, international orders, forecasting.
- **Assumptions**: the orders table is complete for the period.
- **Delivery**: one dashboard page and a summary email.

When someone asks for "just one more breakdown", check it against the scope. Small additions are fine. Large ones deserve a conversation about the deadline.

### Estimating time honestly

Beginners underestimate how long cleaning takes. A rough guide for a new analysis:

\`\`\`text
Understanding the question and data   20%
Getting access and pulling data       15%
Cleaning and validating               30%
Analysis                              20%
Charts, writing, review               15%
\`\`\`

If you think the analysis itself takes one day, the whole project is closer to five. Add buffer when the data source is new to you.

### Communicating progress

Send a short update at agreed points rather than going silent for a week. A three-line message works:

\`\`\`text
Done: data pulled and cleaned, 2 issues found in refund records.
Next: comparison by city, due Wednesday.
Risk: refund data for March may be incomplete; checking with finance.
\`\`\`

Flagging risks early lets stakeholders adjust plans instead of being surprised on the deadline.

### Saying no politely

You will receive more requests than you can handle. Prioritise by the size of the decision and the urgency, and say so openly. "I can deliver the pricing analysis by Friday or the campaign report by Thursday, but not both this week. Which matters more?" puts the trade-off where it belongs, with the person who owns the priority.

### Building trust

Stakeholders trust analysts who are accurate, predictable and honest about uncertainty. Deliver what you promised, when you promised it, and say clearly when a number is an estimate. Over time, that reputation brings you the most interesting work.
      `,
        [
          q('Why should you identify the decision maker, not just the requester?', [
            'The decision maker writes the SQL',
            'Requesters cannot read charts',
            'The output must work for the person who makes the final call',
            'Decision makers set database permissions',
          ], 2, 'If a senior leader decides, the result must be readable at their level and length.'),
          q('Which stage of a new analysis is most often underestimated?', [
            'Choosing a chart colour scheme',
            'Cleaning and validating the data',
            'Sending the final email',
            'Opening the spreadsheet tool',
          ], 1, 'Cleaning and validation typically take the largest share of project time.'),
          q('What is the best way to handle two urgent requests you cannot both meet?', [
            'Work late until both are done badly',
            'Choose one without telling anyone',
            'Ignore both until things calm down',
            'Explain the trade-off and ask the owner to set priority',
          ], 3, 'Making the trade-off visible lets the right person decide what matters most.'),
        ]
      ),
      lesson('Writing a One-Page Analysis Plan', 12, `
Before opening a query editor for any project longer than a day, write a one-page plan. It forces clear thinking, gets early agreement, and gives you something to point to when scope starts to drift.

### The sections

| Section | Content |
|---|---|
| Background | Two or three sentences on why this matters now |
| Question | The sharp analysis question |
| Decision | What will change depending on the answer |
| Metrics | Exact definitions of every number you will report |
| Data sources | Tables, files or systems and their owners |
| Method | Comparisons, segments or tests you will use |
| Risks | Known data gaps or assumptions |
| Deliverable | Format, audience and deadline |

### An example plan

\`\`\`text
Background: Delivery complaints rose after we switched couriers in
February. Operations wants to know if the new courier is the cause.

Question: Did the share of late deliveries change after the switch,
by city, and is the change larger than normal monthly variation?

Decision: Renew, renegotiate or replace the courier contract in May.

Metrics: Late delivery = delivered more than 3 days after dispatch.
Late rate = late deliveries / all delivered orders, per city per week.

Data: shipments table (operations), complaints log (support).

Method: Compare weekly late rate 12 weeks before and 8 weeks after
the switch, per city. Check whether order volume changed too.

Risks: Delivery dates missing for about 5% of rows in January.

Deliverable: 1-page memo and 2 charts for Head of Operations, 15 April.
\`\`\`

### Write the hypotheses down

List what you expect to find before you look. For the courier example:

1. Late rate rose mainly in smaller cities where the new courier has fewer hubs.
2. Order volume also rose, so some lateness is due to load, not the courier.
3. Complaints rose more than late rate, suggesting a communication problem.

Writing hypotheses first protects you from seeing patterns only because you expected them. If the data rejects a hypothesis, record that too; negative results are useful.

### Sketch the output

Draw the chart or table you expect to deliver, even roughly on paper, with empty values. A sketch of "late rate by week, one line per city, with a vertical line at the switch date" tells you exactly which columns your query must return.

### Getting sign-off

Share the plan with the requester and ask one question: "If I deliver this, will it help you make the decision?" A yes means you can start. A no means you just saved days of work on the wrong problem.

### Updating the plan

Plans change as you learn. Keep the document alive, add a dated note when scope or method changes, and share significant changes. At the end, the plan doubles as documentation for anyone who repeats the analysis later.
      `,
        [
          q('Why sketch the expected chart before writing queries?', [
            'It shows exactly which columns and values the query must return',
            'It makes the final chart prettier',
            'Stakeholders require hand drawings',
            'It replaces the need to clean data',
          ], 0, 'A rough sketch of the output defines the data shape you need to produce.'),
          q('Why write hypotheses before looking at the data?', [
            'To make sure the data confirms them',
            'Because hypotheses are legally required',
            'To avoid seeing patterns only because you expected them',
            'To reduce the number of queries needed',
          ], 2, 'Recording expectations first guards against confirmation bias and makes surprises visible.'),
          q('What single question should you ask when sharing the plan for sign-off?', [
            'Which chart colours do you prefer?',
            'Can I have more time for this?',
            'Who else should receive the report?',
            'If I deliver this, will it help you make the decision?',
          ], 3, 'Confirming the plan serves the decision prevents work on the wrong problem.'),
        ]
      ),
      ],
      [
      q('A conversion rate is reported without saying what it is divided by. Why is this a problem?', [
        'Conversion rates never need a denominator',
        'Visitors and sessions give different rates for the same orders',
        'Only the numerator affects the result',
        'Rates should always be shown as counts',
      ], 1, 'The denominator defines the metric; changing it changes the number.'),
      q('Which question is diagnostic rather than descriptive?', [
        'What were total sales last month?',
        'How many users signed up in March?',
        'Why did sign-ups fall after the pricing change?',
        'Which city had the most orders?',
      ], 2, 'Diagnostic questions ask why something happened, not just what happened.'),
      q('A stakeholder keeps adding breakdowns that were not agreed. What helps most?', [
        'Silently adding every request to keep them happy',
        'Refusing every change, however small it is',
        'Restarting the whole project from the beginning',
        'Checking each request against the agreed scope',
      ], 3, 'A written scope makes it easy to accept small changes and negotiate large ones.'),
      q('What belongs in a complete metric definition?', [
        'What is counted, what qualifies, period, source and exclusions',
        'Only the metric name and its preferred chart type',
        'The analyst who built it and the date it was created',
        'The SQL query used to calculate it and nothing else',
      ], 0, 'These five parts make a metric reproducible and stop teams counting differently.'),
      ]
    ),
    chapter(
      'Spreadsheets for Analysts',
      'Use the formulas analysts rely on every day, combine sheets with lookups, answer questions in seconds with PivotTables, and keep workbooks clean enough that colleagues can check and trust them.',
      [
      lesson('Formulas Every Analyst Uses Daily', 13, `
Spreadsheets are still the most widely used analysis tool in the world. A small set of formulas covers most daily work, and knowing them well makes you fast in any team. Everything here works in both Excel and Google Sheets unless noted.

### Conditional aggregates

The workhorses of analysis are SUMIFS, COUNTIFS and AVERAGEIFS. They add, count or average only the rows that meet one or more conditions.

| Formula | What it answers |
|---|---|
| \`=SUMIFS(D:D, B:B, "Lahore")\` | Total revenue from Lahore |
| \`=COUNTIFS(B:B, "Lahore", E:E, "Returned")\` | Returned orders from Lahore |
| \`=AVERAGEIFS(D:D, C:C, ">=2026-01-01")\` | Average order value since January |

Note the argument order: in SUMIFS the column you are adding comes first, followed by pairs of criteria range and criteria.

### Logic with IF and IFS

IF returns one value when a test is true and another when it is false.

\`\`\`text
=IF(D2>=5000, "Large", "Standard")
=IFS(D2>=10000, "Premium", D2>=5000, "Large", TRUE, "Standard")
\`\`\`

IFS checks conditions in order and stops at the first true one, which avoids deeply nested IFs that nobody can read.

### Handling errors

IFERROR replaces an error with a value you choose. Use it carefully: hiding errors can hide real problems.

\`\`\`text
=IFERROR(D2/E2, 0)
\`\`\`

Here a division by zero becomes 0. That may be right for a display, but for an average it would drag the result down. Often a blank, written as "", is safer.

### Text and dates

Data rarely arrives clean, so text and date functions matter.

| Function | Use |
|---|---|
| \`TRIM(A2)\` | Remove extra spaces from names |
| \`PROPER(A2)\` | Turn "aSIF khan" into "Asif Khan" |
| \`LEFT(A2,3)\` | First three characters, such as an area code |
| \`TEXT(B2,"yyyy-mm")\` | Month label from a date |
| \`EOMONTH(B2,0)\` | Last day of the date's month |
| \`DATEDIF(B2,C2,"d")\` | Days between two dates |

### Absolute and relative references

When you copy a formula, relative references like A2 move with it while absolute references like $A$2 stay fixed. Use absolute references for fixed inputs such as an exchange rate in one cell:

\`\`\`text
=D2*$H$1
\`\`\`

Copying this down converts every row using the same rate in H1. Forgetting the dollar signs is one of the most common spreadsheet bugs.

### Dynamic arrays

Modern Excel and Google Sheets have functions that return many results at once:

\`\`\`text
=UNIQUE(B2:B5000)
=SORT(UNIQUE(B2:B5000))
=FILTER(A2:E5000, E2:E5000="Returned")
\`\`\`

UNIQUE lists distinct cities, and FILTER pulls every returned order into a new range that updates automatically when the data changes.

### Checking your work

After writing any important formula, test it on a case you can verify by eye. Filter the data to Lahore and look at the status bar total; it should match your SUMIFS. This ten-second habit catches most mistakes before anyone else sees them.
      `,
        [
          q('In SUMIFS, which argument comes first?', [
            'The first criteria value',
            'The range of values to add up',
            'The first criteria range',
            'The sheet name containing the data',
          ], 1, 'SUMIFS starts with the sum range, followed by pairs of criteria ranges and criteria.'),
          q('Why use $H$1 instead of H1 for an exchange rate cell?', [
            'It makes the formula calculate faster',
            'It formats the cell as currency',
            'It hides the cell from other users',
            'It stays fixed when the formula is copied',
          ], 3, 'Absolute references keep pointing to the same cell as formulas are copied.'),
          q('What is a risk of wrapping every formula in IFERROR(...,0)?', [
            'It slows the spreadsheet to a stop',
            'It deletes rows that contain errors',
            'It can hide real problems and distort averages',
            'It only works in Google Sheets',
          ], 2, 'Replacing errors with zero conceals issues and pulls averages down.'),
        ]
      ),
      lesson('Lookups for Combining Data in a Sheet', 13, `
Data often lives in separate sheets: orders in one, product details in another, targets in a third. Lookups bring the right value from one table into another, the spreadsheet version of a join.

### XLOOKUP

XLOOKUP is the modern lookup in Excel 365 and Google Sheets. It finds a value in one column and returns the matching value from another.

\`\`\`text
=XLOOKUP(B2, Products!A:A, Products!C:C, "Not found")
\`\`\`

This looks up the product code in B2 within column A of the Products sheet and returns the category from column C. The fourth argument handles missing codes cleanly.

### INDEX and MATCH

In older Excel versions, INDEX with MATCH does the same job:

\`\`\`text
=INDEX(Products!C:C, MATCH(B2, Products!A:A, 0))
\`\`\`

The 0 in MATCH means exact match. Leaving it out triggers approximate matching, which returns wrong results on unsorted data without any warning.

### VLOOKUP and its traps

VLOOKUP is still everywhere in inherited workbooks, so you need to read it:

\`\`\`text
=VLOOKUP(B2, Products!A:D, 3, FALSE)
\`\`\`

| Trap | Effect |
|---|---|
| Missing FALSE at the end | Approximate match, silently wrong values |
| Column number 3 hard-coded | Inserting a column breaks every formula |
| Can only look to the right | Cannot return a column left of the key |

When you maintain an old workbook, replacing VLOOKUP with XLOOKUP removes all three problems.

### Duplicate keys

Every lookup returns only the first match. If the product sheet contains code P-104 twice with different prices, your lookup quietly picks the first one. Before trusting a lookup table, check its keys are unique:

\`\`\`text
=COUNTIF(Products!A:A, A2)
\`\`\`

Any result above 1 means a duplicate key that needs resolving with whoever owns the data.

### Hidden mismatches

A lookup may fail even when the value looks identical. The usual causes:

1. **Extra spaces**: "P-104 " with a trailing space. Fix with TRIM.
2. **Numbers stored as text**: "104" versus 104. Fix with VALUE or by converting the column.
3. **Different case or spelling**: "Lahore" versus "LHR". Fix with a mapping table.

When a lookup returns "Not found", test the two values with \`=A2=B2\`. FALSE confirms they differ even though they look the same.

### Approximate match on purpose

Approximate lookups are useful for bands, such as commission rates:

| Sales from | Rate |
|---|---|
| 0 | 2% |
| 100,000 | 3% |
| 500,000 | 5% |

\`\`\`text
=XLOOKUP(D2, Bands!A:A, Bands!B:B, , -1)
\`\`\`

The -1 match mode returns the rate for the largest threshold that does not exceed the sales value. Sales of 250,000 get 3%.

### Checking lookup results

After filling a lookup column, count how many rows returned "Not found" with COUNTIF. Even 2% unmatched can bias a total, so resolve them or report them clearly.
      `,
        [
          q('What does the 0 in MATCH(B2, A:A, 0) mean?', [
            'Find an exact match only',
            'Start searching from row zero',
            'Return zero when nothing is found',
            'Ignore blank cells in the range',
          ], 0, 'A match type of 0 forces exact matching; omitting it allows approximate matches.'),
          q('A product code appears twice in a lookup table. What does a lookup return?', [
            'An error showing the duplicate',
            'The average of both matching rows',
            'The last matching row in the table',
            'Only the first match, silently',
          ], 3, 'Lookups stop at the first match, so duplicates cause silent, possibly wrong results.'),
          q('Two codes look identical but a lookup fails. What is a likely cause?', [
            'The spreadsheet has too many rows',
            'A trailing space or a number stored as text',
            'The lookup function is turned off',
            'The column is formatted in bold',
          ], 1, 'Invisible differences such as spaces or text-formatted numbers break exact matches.'),
        ]
      ),
      lesson('PivotTables for Fast Answers', 13, `
A PivotTable summarises thousands of rows in seconds by grouping and aggregating them through drag and drop. It is often the fastest way to answer an ad hoc question.

### Building one

Start from a tidy table with headers and no blank rows. Convert it to an Excel Table first with Ctrl+T so the pivot picks up new rows automatically. Then insert a PivotTable and place fields in four areas:

| Area | Purpose | Example |
|---|---|---|
| Rows | Groups down the side | City |
| Columns | Groups across the top | Month |
| Values | What to calculate | Sum of Revenue |
| Filters | Restrict the whole table | Channel = Online |

Revenue by city by month, filtered to online orders, takes about fifteen seconds.

### Choosing the right summary

Values default to Sum for numbers and Count for text, but you can change them:

- **Count** of order IDs for the number of orders.
- **Distinct Count** for unique customers, available when you tick "Add this data to the Data Model".
- **Average** for average order value.
- **Max and Min** for checking ranges and spotting outliers.

Counting customer IDs without Distinct Count counts orders, not customers, which is a common mistake.

### Show Values As

Right-click a value and choose Show Values As to turn totals into comparisons:

| Option | Answers |
|---|---|
| % of Grand Total | What share of revenue comes from each city? |
| % of Row Total | Within Lahore, what share came each month? |
| Difference From previous | How much did revenue change month on month? |
| % Difference From previous | What was the growth rate month on month? |
| Running Total In | What is year-to-date revenue? |

These save you from writing helper formulas next to the pivot.

### Grouping dates and numbers

Right-click a date field and group it by months, quarters or years. Group a numeric field such as order value into bands of 1,000 to see the distribution of order sizes without any formulas.

### Slicers

Slicers are clickable filter buttons. Add slicers for City and Channel, and a manager can explore the pivot without knowing how PivotTables work. Connect one slicer to several pivots so they filter together, which turns a sheet into a simple dashboard.

### Refreshing and pitfalls

PivotTables do not update automatically when data changes. Use Refresh, or Refresh All for every pivot in the workbook.

Common pitfalls:

1. **Blank rows in the source** split your data and hide records.
2. **Numbers stored as text** get counted rather than summed.
3. **Calculated fields on averages** average the averages incorrectly. Calculate ratios like conversion rate as Sum of orders divided by Sum of visitors, not as an average of row-level rates.

### Using pivots to check data

Pivots are also a quality tool. Pivot by status and you may discover statuses like "Cancelled", "cancelled" and "CANCELED" that should be one value. A two-minute pivot reveals problems that formulas would quietly include.
      `,
        [
          q('Why convert the source data to an Excel Table before building a pivot?', [
            'Tables calculate averages more accurately',
            'Pivots cannot use ordinary ranges at all',
            'New rows are picked up automatically on refresh',
            'Tables remove duplicate rows by default',
          ], 2, 'A Table expands as rows are added, so the pivot range never goes stale.'),
          q('You need the number of unique customers per city. Which summary should you use?', [
            'Sum of customer ID',
            'Count of customer ID',
            'Average of customer ID',
            'Distinct Count of customer ID',
          ], 3, 'A plain count counts orders; Distinct Count counts each customer once.'),
          q('Which Show Values As option gives month-on-month growth?', [
            '% Difference From the previous month',
            '% of Grand Total for the month',
            'Running Total In by month',
            'Rank Largest to Smallest by month',
          ], 0, '% Difference From previous compares each month with the one before as a rate.'),
        ]
      ),
      lesson('Spreadsheet Hygiene and Audit Trails', 12, `
A spreadsheet is only useful if others can understand and trust it. Messy workbooks cause real damage: famous cases include public health figures lost to row limits and economic research distorted by a formula that skipped rows. Good hygiene prevents most of this.

### Separate inputs, calculations and outputs

Organise workbooks into clear layers:

| Sheet | Contains | Rule |
|---|---|---|
| README | Purpose, sources, owner, last update | Always the first tab |
| Inputs | Raw data and assumptions | Never edited by formulas |
| Calc | Working formulas | No hard-coded numbers |
| Output | Final tables and charts | Only references to Calc |

Anyone opening the file then knows where to change assumptions and where to read results.

### Never overwrite raw data

Keep the original export untouched on its own sheet or file. Clean in a copy or in formula columns. When a question arises about the source, you can always go back to it.

### Colour conventions

Many finance and analytics teams use a simple code:

- **Blue text** for typed inputs and assumptions.
- **Black text** for formulas.
- **Green text** for links to other sheets or files.

Combined with a light yellow fill for cells users may change, this makes the workbook readable at a glance.

### No hard-coded numbers inside formulas

Compare these two formulas:

\`\`\`text
=D2*0.17
=D2*Inputs!$B$3
\`\`\`

The first hides the tax rate inside the formula. When the rate changes, someone must find every formula that contains 0.17. The second points to one labelled input cell, so changing it once updates the whole workbook.

### Checks and reconciliations

Build check cells that prove totals match:

\`\`\`text
=IF(ABS(SUM(Output!C:C) - SUM(Inputs!D:D)) < 1, "OK", "CHECK")
\`\`\`

If the output total drifts from the raw total, the check turns to CHECK. Put conditional formatting on it so it turns red. Professional models often have a dedicated Checks sheet with a single overall status.

### Version control

Avoid file names like final_v3_REAL_final.xlsx. Use a date and a short note instead:

\`\`\`text
2026-04-10_courier_analysis_v2_added_hyderabad.xlsx
\`\`\`

Better still, keep files in OneDrive or Google Drive where version history is automatic, and record major changes in the README tab.

### Know the limits

Excel handles about one million rows per sheet, but it becomes slow well before that, especially with many lookups. Google Sheets has a lower cell limit. When data reaches hundreds of thousands of rows, or the same work repeats every week, move the heavy lifting to SQL, Power Query or Python and use the spreadsheet only for the final summary.

### Peer review

Before an important workbook is shared, ask a colleague to spend fifteen minutes trying to break it: change inputs, trace a few formulas, and compare one total with the source. Teams that do this routinely catch errors that would otherwise reach a board meeting.
      `,
        [
          q('Why should a tax rate live in a labelled input cell rather than inside formulas?', [
            'Input cells calculate more precisely than formulas',
            'Changing it once updates every formula that uses it',
            'Formulas cannot contain decimal numbers',
            'It makes the file smaller to email',
          ], 1, 'A single referenced input avoids hunting for hidden constants when a value changes.'),
          q('What does a reconciliation check cell do?', [
            'Formats totals as currency automatically',
            'Sends an email when the file changes',
            'Flags when an output total no longer matches the source',
            'Locks the sheet against editing',
          ], 2, 'Check cells compare totals so silent errors become visible immediately.'),
          q('When should heavy spreadsheet work move to SQL, Power Query or Python?', [
            'As soon as the file has more than one sheet',
            'Whenever charts are needed in the output',
            'Only when the company buys new software',
            'When data is very large or the work repeats regularly',
          ], 3, 'Large or recurring workloads are faster and safer in tools built for them.'),
        ]
      ),
      ],
      [
      q('A VLOOKUP lacks FALSE as its last argument and the table is unsorted. What happens?', [
        'It returns an error for every row',
        'It sorts the lookup table automatically',
        'It may return wrong values without warning',
        'It works exactly the same as XLOOKUP',
      ], 2, 'Without FALSE, VLOOKUP uses approximate matching and can silently return incorrect results.'),
      q('A pivot shows statuses "Cancelled", "cancelled" and "CANCELED". What does this reveal?', [
        'Inconsistent text values that need standardising',
        'Three genuinely different order states',
        'A bug in the PivotTable feature',
        'That the data is sorted incorrectly',
      ], 0, 'Pivots expose spelling and case variations that should be merged before analysis.'),
      q('How should a conversion rate be calculated in a pivot?', [
        'By averaging each row\'s conversion rate',
        'By counting rows with a conversion',
        'By using the maximum rate in each group',
        'By dividing total orders by total visitors per group',
      ], 3, 'Averaging row-level rates weights small rows equally; ratios of totals give the true rate.'),
      q('Which workbook structure is easiest for others to check?', [
        'Everything on one sheet so nothing is hidden',
        'Raw data edited directly by the formulas',
        'Separate README, inputs, calculation and output sheets',
        'Formulas with numbers typed into them directly',
      ], 2, 'Clear layers show where assumptions live and where results come from.'),
      ]
    ),
    chapter(
      'SQL for Analysts',
      'Write SQL that answers business questions directly: filter and sort rows, summarise with GROUP BY, join tables without inflating totals, and use CTEs and window functions for rankings, running totals and comparisons.',
      [
      lesson('Filtering and Sorting to Answer Real Questions', 14, `
SQL, Structured Query Language, is how analysts ask questions of databases. It appears in nearly every analyst job advert because it lets you pull exactly the rows you need from tables far too large for a spreadsheet.

### The basic query

Every query you write starts from the same shape:

\`\`\`sql
SELECT order_id, customer_id, city, amount, order_date
FROM orders
WHERE city = 'Lahore'
  AND order_date >= '2026-01-01'
ORDER BY amount DESC
LIMIT 20;
\`\`\`

This returns the 20 largest Lahore orders since January. Read it in the order the database runs it: FROM picks the table, WHERE keeps matching rows, SELECT picks the columns, ORDER BY sorts, and LIMIT cuts the result.

### Useful WHERE conditions

| Condition | Example | Meaning |
|---|---|---|
| IN | \`city IN ('Lahore','Karachi')\` | Any value in a list |
| BETWEEN | \`amount BETWEEN 1000 AND 5000\` | Inclusive range |
| LIKE | \`email LIKE '%@gmail.com'\` | Pattern match, % is any text |
| IS NULL | \`delivered_at IS NULL\` | Missing value |
| NOT | \`status NOT IN ('test','void')\` | Exclude values |

### NULL needs special care

NULL means unknown, and it does not behave like an ordinary value. \`delivered_at = NULL\` never matches anything; you must write \`IS NULL\`. Also, \`status <> 'cancelled'\` silently drops rows where status is NULL. If those rows matter, include them explicitly:

\`\`\`sql
WHERE status <> 'cancelled' OR status IS NULL
\`\`\`

### AND, OR and brackets

AND is evaluated before OR, which surprises people:

\`\`\`sql
WHERE city = 'Lahore' OR city = 'Karachi' AND amount > 5000
\`\`\`

This returns all Lahore orders plus only large Karachi orders. Brackets fix it:

\`\`\`sql
WHERE (city = 'Lahore' OR city = 'Karachi') AND amount > 5000
\`\`\`

Use brackets whenever you mix AND and OR, even when you think you do not need them.

### Dates

Date filters are the most common source of off-by-one errors. If order_date includes a time, \`order_date <= '2026-03-31'\` excludes orders placed during 31 March after midnight. The safer pattern uses a half-open range:

\`\`\`sql
WHERE order_date >= '2026-03-01'
  AND order_date <  '2026-04-01'
\`\`\`

This captures every moment of March regardless of time.

### Calculated columns

You can compute new columns and name them with AS:

\`\`\`sql
SELECT order_id,
       amount,
       amount * 0.17 AS sales_tax,
       CASE WHEN amount >= 10000 THEN 'large' ELSE 'standard' END AS size_band
FROM orders;
\`\`\`

CASE WHEN works like IF in a spreadsheet and is one of the most used tools in analytical SQL.

### Explore before you trust

When meeting a new table, run a few quick checks before writing real queries:

\`\`\`sql
SELECT * FROM orders LIMIT 10;
SELECT COUNT(*) FROM orders;
SELECT MIN(order_date), MAX(order_date) FROM orders;
\`\`\`

These show the columns, the size, and the date range covered. Two minutes of exploring often reveals that a table stops last Tuesday or contains test data.
      `,
        [
          q('How do you find rows where delivered_at is missing?', [
            'WHERE delivered_at = NULL',
            'WHERE delivered_at IS NULL',
            'WHERE delivered_at = \'\'',
            'WHERE delivered_at = 0',
          ], 1, 'Comparisons with = never match NULL; IS NULL is required.'),
          q('Why is a half-open date range safer for selecting a month?', [
            'It runs faster on every database',
            'It removes duplicate orders',
            'It converts dates to text first',
            'It includes every time on the last day',
          ], 3, 'Using >= the first day and < the next month\'s first day captures all timestamps.'),
          q('Which clause works like IF in a spreadsheet?', [
            'WHERE with several conditions',
            'ORDER BY with DESC',
            'CASE WHEN ... THEN ... ELSE ... END',
            'LIMIT with an offset',
          ], 2, 'CASE WHEN returns different values depending on conditions, row by row.'),
        ]
      ),
      lesson('GROUP BY and Aggregates for Summaries', 14, `
Most business questions are about totals, counts and averages by some category. GROUP BY turns many rows into one row per group, and aggregate functions summarise each group.

### The pattern

\`\`\`sql
SELECT city,
       COUNT(*)                    AS orders,
       COUNT(DISTINCT customer_id) AS customers,
       SUM(amount)                 AS revenue,
       AVG(amount)                 AS avg_order_value
FROM orders
WHERE status = 'paid'
GROUP BY city
ORDER BY revenue DESC;
\`\`\`

The rule is simple: every column in SELECT must either appear in GROUP BY or be inside an aggregate function.

### Common aggregates

| Function | Returns | Watch out for |
|---|---|---|
| COUNT(*) | Number of rows | Counts rows with NULLs too |
| COUNT(col) | Rows where col is not NULL | Smaller than COUNT(*) when values are missing |
| COUNT(DISTINCT col) | Unique values | Slower on huge tables |
| SUM(col) | Total | Ignores NULLs |
| AVG(col) | Mean | Ignores NULLs, which can mislead |
| MIN and MAX | Smallest and largest | Useful for date ranges |

### WHERE versus HAVING

WHERE filters rows before grouping. HAVING filters groups after aggregation.

\`\`\`sql
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY customer_id
HAVING COUNT(*) >= 3;
\`\`\`

This finds customers with at least three orders this year. You cannot put \`COUNT(*) >= 3\` in WHERE because the count does not exist until after grouping.

### Grouping by time

Monthly trends need a month column. Function names differ by database:

\`\`\`sql
-- PostgreSQL
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;
\`\`\`

In MySQL you might use \`DATE_FORMAT(order_date, '%Y-%m')\`, and in SQL Server \`FORMAT(order_date, 'yyyy-MM')\`. GROUP BY 1 means group by the first selected column, a handy shortcut.

### Conditional aggregation

Combining CASE with SUM produces several metrics in one pass:

\`\`\`sql
SELECT city,
       COUNT(*) AS orders,
       SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) AS returns,
       ROUND(100.0 * SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END)
             / COUNT(*), 1) AS return_rate_pct
FROM orders
GROUP BY city;
\`\`\`

This gives orders, returns and return rate per city in one compact result. Note the 100.0: multiplying by a decimal stops some databases from doing integer division, where 7 divided by 50 becomes 0.

### Sense-check totals

After any aggregation, compare the grand total with a simple query on the raw table. If SUM of revenue across all cities does not equal the total revenue in the table, something is being filtered or duplicated. Analysts who check totals catch problems before stakeholders do.

### Averages hide NULLs

AVG ignores NULL values entirely. If 40% of orders have no delivery rating, AVG(rating) describes only the 60% who answered, and those customers may be happier or angrier than the rest. Report the count of non-NULL values next to any average so readers know how many rows it actually covers:

\`\`\`sql
SELECT AVG(rating) AS avg_rating, COUNT(rating) AS rated, COUNT(*) AS orders
FROM orders;
\`\`\`
      `,
        [
          q('What is the difference between WHERE and HAVING?', [
            'WHERE filters rows before grouping; HAVING filters groups after',
            'WHERE works on text; HAVING works on numbers',
            'HAVING is faster than WHERE on large tables',
            'They are interchangeable in every query',
          ], 0, 'Aggregates such as COUNT only exist after grouping, so they are filtered with HAVING.'),
          q('Why might COUNT(email) be smaller than COUNT(*)?', [
            'COUNT(email) only counts unique emails',
            'COUNT(*) double-counts every row',
            'COUNT(email) skips rows where email is NULL',
            'Emails are counted as text, not numbers',
          ], 2, 'COUNT on a column ignores NULLs, while COUNT(*) counts every row.'),
          q('Why multiply by 100.0 rather than 100 when calculating a rate?', [
            'To round the result to one decimal',
            'To convert the result into a percentage sign',
            'To make the query run faster',
            'To avoid integer division returning zero',
          ], 3, 'Some databases divide integers as integers, so 7/50 becomes 0 without a decimal.'),
        ]
      ),
      lesson('Joins Without Duplicating Rows', 14, `
Business data is split across tables: orders, customers, products, payments. Joins combine them. They are also where most serious SQL mistakes happen, because a careless join silently multiplies rows and inflates totals.

### Join types

| Join | Keeps |
|---|---|
| INNER JOIN | Only rows that match in both tables |
| LEFT JOIN | All rows from the left table, plus matches from the right |
| RIGHT JOIN | All rows from the right table, plus matches from the left |
| FULL OUTER JOIN | All rows from both, matched where possible |

In practice, analysts use INNER and LEFT almost exclusively.

\`\`\`sql
SELECT o.order_id, o.amount, c.city, c.signup_date
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id;
\`\`\`

LEFT JOIN keeps every order even if a customer record is missing, which prevents orders quietly disappearing from your totals.

### The fan-out problem

Suppose each order has several rows in order_items. Joining orders to order_items repeats each order's amount once per item:

| order_id | amount | product |
|---|---|---|
| 10452 | 4,200 | Lawn kurta |
| 10452 | 4,200 | Dupatta |

SUM(amount) now counts order 10452 twice. This is called fan-out, and it is the classic cause of revenue reports that are suspiciously high.

### Preventing fan-out

Aggregate the many side first, then join one row per key:

\`\`\`sql
WITH items AS (
  SELECT order_id, COUNT(*) AS item_count
  FROM order_items
  GROUP BY order_id
)
SELECT o.order_id, o.amount, i.item_count
FROM orders o
LEFT JOIN items i ON i.order_id = o.order_id;
\`\`\`

Now each order appears once, and the item count comes along safely.

### The row-count check

Before and after every join, count rows:

\`\`\`sql
SELECT COUNT(*) FROM orders;                    -- 14,212
SELECT COUNT(*) FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id;  -- should be 14,212
\`\`\`

If a LEFT JOIN from orders to customers returns more rows than orders has, the customers table has duplicate customer IDs. Investigate before continuing.

### Filtering in the wrong place

A WHERE condition on the right table of a LEFT JOIN turns it into an INNER JOIN:

\`\`\`sql
SELECT o.order_id, p.method
FROM orders o
LEFT JOIN payments p ON p.order_id = o.order_id
WHERE p.method = 'JazzCash';
\`\`\`

Orders without a payment vanish, because their p.method is NULL. If you want to keep all orders and only match JazzCash payments, move the condition into the ON clause:

\`\`\`sql
LEFT JOIN payments p ON p.order_id = o.order_id AND p.method = 'JazzCash'
\`\`\`

### Anti-joins

Finding rows with no match is a frequent question, such as customers who never ordered:

\`\`\`sql
SELECT c.customer_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;
\`\`\`

This pattern, a LEFT JOIN followed by IS NULL on the right table's key, answers every "who has not done X" question.
      `,
        [
          q('What is fan-out in a join?', [
            'A join that returns no rows at all',
            'Rows repeated because one key matches many rows',
            'A join across more than three tables',
            'A query that runs on several servers',
          ], 1, 'When one order matches several items, its values repeat and inflate sums.'),
          q('A LEFT JOIN from orders to customers returns more rows than orders has. Why?', [
            'LEFT JOIN always adds extra rows',
            'Some orders have no customer',
            'The customers table has duplicate customer IDs',
            'The orders table is sorted incorrectly',
          ], 2, 'A left join should keep the left row count unless keys on the right are duplicated.'),
          q('How do you find customers who have never placed an order?', [
            'INNER JOIN orders and count the rows',
            'GROUP BY customer_id HAVING COUNT(*) = 1',
            'SELECT DISTINCT customer_id FROM orders',
            'LEFT JOIN orders and keep rows where order_id IS NULL',
          ], 3, 'A left join with a NULL check on the right key isolates rows with no match.'),
        ]
      ),
      lesson('CTEs and Window Functions for Analysis', 14, `
As questions get harder, queries get longer. Common Table Expressions keep them readable, and window functions let you rank, compare and accumulate without losing row detail.

### CTEs

A CTE is a named subquery defined with WITH. It lets you build a query in readable steps:

\`\`\`sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
  GROUP BY 1
)
SELECT month, revenue
FROM monthly
ORDER BY month;
\`\`\`

Each CTE does one job, and you can stack several, separated by commas. Reviewers can test each step on its own, which makes CTEs the standard style in analytics teams.

### Window functions

A window function calculates across a set of related rows while keeping every row. The OVER clause defines the window.

| Function | Use |
|---|---|
| ROW_NUMBER() | Number rows within a group, 1, 2, 3 |
| RANK() | Rank with ties sharing a position |
| SUM() OVER | Running totals |
| LAG() and LEAD() | Value from the previous or next row |
| AVG() OVER | Moving averages |

### Ranking within groups

Top three products per city:

\`\`\`sql
WITH ranked AS (
  SELECT city, product, SUM(amount) AS revenue,
         ROW_NUMBER() OVER (PARTITION BY city ORDER BY SUM(amount) DESC) AS rn
  FROM sales
  GROUP BY city, product
)
SELECT * FROM ranked WHERE rn <= 3;
\`\`\`

PARTITION BY restarts the numbering for each city. You cannot filter on rn in the same query level, which is why the CTE wraps it.

### Month-on-month change

LAG fetches the previous row's value, perfect for growth rates:

\`\`\`sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT month,
       revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct
FROM monthly;
\`\`\`

The first month has no previous value, so its growth is NULL, which is correct.

### Running totals and moving averages

\`\`\`sql
SELECT day, revenue,
       SUM(revenue) OVER (ORDER BY day) AS running_total,
       AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg_7d
FROM daily_sales;
\`\`\`

The seven-day moving average smooths out weekday swings, making trends easier to see.

### First and latest records

ROW_NUMBER also answers "first order per customer" or "latest status per shipment":

\`\`\`sql
WITH firsts AS (
  SELECT customer_id, order_date, amount,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders
)
SELECT * FROM firsts WHERE rn = 1;
\`\`\`

Order by order_date DESC instead and rn = 1 becomes each customer's latest order. This single pattern solves a surprising share of real analyst questions, from first-touch attribution to current subscription status.
      `,
        [
          q('What does PARTITION BY city do in a window function?', [
            'Restarts the calculation separately for each city',
            'Removes duplicate cities from the result',
            'Sorts the final result by city',
            'Groups rows into one row per city',
          ], 0, 'Partitioning applies the window calculation independently within each group, keeping every row.'),
          q('Which function returns the previous month\'s revenue on each row?', [
            'ROW_NUMBER()',
            'RANK()',
            'LAG()',
            'COUNT(DISTINCT)',
          ], 2, 'LAG looks back to the prior row in the window\'s order.'),
          q('Why wrap a ROW_NUMBER calculation in a CTE before filtering rn <= 3?', [
            'CTEs make window functions run faster',
            'ROW_NUMBER only works inside a CTE',
            'Window results cannot be filtered in the same query level',
            'It removes NULL values from the ranking',
          ], 2, 'Window functions are computed after WHERE, so filtering needs an outer query.'),
        ]
      ),
      ],
      [
      q('Revenue in a report is far higher than finance\'s figure after joining orders to order_items. What is the likely cause?', [
        'The finance team excluded online orders',
        'A WHERE clause removed too many rows',
        'Fan-out repeated order amounts once per item',
        'SUM cannot handle large numbers',
      ], 2, 'Joining to a many-row table repeats order amounts, inflating totals.'),
      q('What does WHERE city = \'Lahore\' OR city = \'Karachi\' AND amount > 5000 return?', [
        'Large orders from both cities only',
        'Only large orders from Lahore',
        'No rows, because the logic conflicts',
        'All Lahore orders plus large Karachi orders',
      ], 3, 'AND binds before OR, so brackets are needed to apply the amount filter to both cities.'),
      q('A WHERE filter on the right table of a LEFT JOIN removes unmatched rows. How do you keep them?', [
        'Move the condition into the ON clause',
        'Change the join to INNER JOIN',
        'Add DISTINCT to the SELECT',
        'Sort the result by the join key',
      ], 0, 'Conditions in ON limit matches without discarding left rows that have no match.'),
      q('Which query pattern finds each customer\'s first order?', [
        'GROUP BY customer_id with COUNT(*)',
        'ROW_NUMBER partitioned by customer, ordered by date, keeping rn = 1',
        'SELECT DISTINCT customer_id ordered by date',
        'HAVING MIN(order_date) after a join to products',
      ], 1, 'Numbering each customer\'s orders by date and keeping the first isolates first orders with full detail.'),
      ]
    ),
    chapter(
      'Cleaning and Preparing Data',
      'Profile a new dataset before analysing it, deal with missing values, duplicates and outliers deliberately, fix types, dates and messy text, and record every change so your cleaned data can be trusted and rebuilt.',
      [
      lesson('Profiling a New Dataset', 13, `
Profiling means getting to know a dataset before you analyse it: its size, its columns, the range of each value and its obvious problems. Fifteen minutes of profiling prevents days of wrong conclusions.

### The profiling checklist

For every new dataset, answer these questions:

| Question | How to check |
|---|---|
| How many rows and columns? | COUNT(*), or the shape of the table |
| What is the grain? | Is the supposed key unique? |
| What period does it cover? | MIN and MAX of the date columns |
| Which columns have missing values? | Count NULLs or blanks per column |
| What values do categories take? | Distinct values with their counts |
| Are numbers in a sensible range? | MIN, MAX, average and percentiles |

### Profiling in SQL

\`\`\`sql
SELECT COUNT(*)                      AS rows_total,
       COUNT(DISTINCT order_id)      AS unique_orders,
       MIN(order_date)               AS first_date,
       MAX(order_date)               AS last_date,
       SUM(CASE WHEN city IS NULL THEN 1 ELSE 0 END) AS missing_city,
       MIN(amount) AS min_amount,
       MAX(amount) AS max_amount
FROM orders;
\`\`\`

If rows_total and unique_orders differ, you have duplicates. If max_amount is 9,999,999, someone probably typed a placeholder.

### Profiling categories

\`\`\`sql
SELECT city, COUNT(*) AS n
FROM orders
GROUP BY city
ORDER BY n DESC;
\`\`\`

The result often reveals problems at once:

| city | n |
|---|---|
| Lahore | 5,210 |
| Karachi | 4,870 |
| lahore | 312 |
| LHR | 95 |
| NULL | 140 |

Lahore appears in three spellings. Without cleaning, a city comparison would understate Lahore by about 7%.

### Profiling in pandas

\`\`\`py
import pandas as pd
df = pd.read_csv("orders.csv")
df.shape
df.info()
df.describe()
df["city"].value_counts(dropna=False)
df.isna().sum()
\`\`\`

info shows column types and non-null counts, describe gives numeric summaries, and value_counts with dropna=False includes missing values in the count.

### Look at the data by eye

Statistics miss things your eyes catch. Scroll through a random sample of 50 rows, not just the first 10, because files are often sorted and the first rows are unusually clean.

\`\`\`sql
SELECT * FROM orders ORDER BY RANDOM() LIMIT 50;
\`\`\`

Look for strange values: dates in 1900, negative quantities, phone numbers in the name column, or the word "test" anywhere.

### Compare with a known total

If finance says March revenue was PKR 48.2 million, check your extract sums to roughly the same. A large gap means you are missing data, including data you should not, or using a different definition. Find out which before going further.

### Write it down

Record your profiling results in a short note: row count, date range, known issues and their size. This becomes the first section of your cleaning log and helps anyone who works with the data after you.
      `,
        [
          q('Your profile shows rows_total of 14,500 but unique order IDs of 14,212. What does this suggest?', [
            'The data covers more than one year',
            'Some orders appear more than once',
            'Some orders have missing amounts',
            'The query needs a GROUP BY clause',
          ], 1, 'More rows than unique keys means duplicate records exist.'),
          q('Why sample random rows instead of only reading the first ten?', [
            'Random sampling makes queries run faster',
            'The first rows are always deleted later',
            'Files are often sorted, so the first rows may be unusually clean',
            'Databases only show ten rows at a time',
          ], 2, 'A random sample shows typical rows, including problems hidden further down.'),
          q('What does value_counts(dropna=False) add compared with the default?', [
            'It sorts values alphabetically',
            'It removes rare categories',
            'It converts text to numbers',
            'It includes missing values in the counts',
          ], 3, 'With dropna=False, missing values appear as their own category.'),
        ]
      ),
      lesson('Missing Values, Duplicates and Outliers', 14, `
These three problems appear in almost every real dataset. There is rarely one correct fix; the right choice depends on why the problem exists and how it affects your question.

### Why values are missing

Ask why before deciding what to do:

| Reason | Example | Usual approach |
|---|---|---|
| Not applicable | No delivery date for a cancelled order | Leave missing, it is correct |
| Not collected | Age not asked before 2025 | Analyse only the period with data, or flag it |
| Lost in a system error | Courier API failed for two days | Report the gap; avoid guessing |
| Optional field skipped | Customer did not give gender | Keep as "Not given" |

### Options for missing values

1. **Leave them** and let aggregates ignore them, while reporting how many there are.
2. **Drop rows** when few are missing and they are random. Dropping 0.5% rarely matters; dropping 20% often does.
3. **Fill with a label** such as "Unknown" for categories.
4. **Impute** with a median or a related value. Use sparingly and always document it.

Never fill missing revenue with zero unless the value truly was zero. A missing amount and a free order are different facts.

### Duplicates

Exact duplicates, where every column matches, usually come from double imports and can be removed:

\`\`\`sql
SELECT DISTINCT * FROM raw_orders;
\`\`\`

Partial duplicates are harder: the same order ID with two different statuses, perhaps "pending" then "paid". Decide which record wins, often the latest:

\`\`\`sql
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY updated_at DESC) AS rn
  FROM raw_orders
)
SELECT * FROM ranked WHERE rn = 1;
\`\`\`

In pandas:

\`\`\`py
df = df.sort_values("updated_at").drop_duplicates("order_id", keep="last")
\`\`\`

### Outliers

An outlier is a value far from the rest. Some are errors, others are the most important rows in the data.

| Value | Likely meaning | Action |
|---|---|---|
| Order of PKR 99,999,999 | Placeholder or typo | Exclude and report |
| Quantity of -5 | A return recorded as negative | Treat as a return |
| Order of PKR 2,400,000 | A genuine bulk corporate order | Keep, but check its effect |
| Age of 212 | Data entry error | Set to missing |

A simple screening rule uses the interquartile range: values more than 1.5 times the IQR beyond the quartiles deserve a look. It flags candidates; it does not decide for you.

### Test the impact

When unsure, run the analysis twice, with and without the questionable rows. If the conclusion is the same, the choice does not matter much. If it flips, the outliers are central to the story and the stakeholder needs to know.

### Report what you did

Every decision belongs in your summary: "140 orders with no city were labelled Unknown; 3 orders above PKR 50 million were excluded as test entries." Readers can then judge for themselves, and nobody discovers your choices by accident later.
      `,
        [
          q('A cancelled order has no delivery date. How should this usually be treated?', [
            'Fill it with the order date',
            'Delete the order from the dataset',
            'Leave it missing because it is correct',
            'Fill it with today\'s date',
          ], 2, 'A cancelled order was never delivered, so a blank delivery date is accurate.'),
          q('Why should missing revenue not simply be filled with zero?', [
            'A missing amount and a genuinely free order are different facts',
            'Zero cannot be stored in a numeric column',
            'Filling values is always against company policy',
            'It would make queries run more slowly',
          ], 0, 'Zero claims the order was free, which distorts totals and averages.'),
          q('What is the best way to judge whether outliers matter to your conclusion?', [
            'Always delete every outlier first',
            'Always keep every outlier as it is',
            'Replace outliers with the column average',
            'Run the analysis with and without them and compare',
          ], 3, 'If the result changes, the outliers are important and must be discussed openly.'),
        ]
      ),
      lesson('Fixing Types, Dates and Messy Text', 13, `
Data often arrives with the right information in the wrong form: numbers stored as text, dates in several formats, and names typed a dozen ways. These problems break joins, sorts and totals.

### Data types

Every column should have the type that matches its meaning:

| Column | Wrong type | Problem caused |
|---|---|---|
| amount | Text "4,200" | Cannot sum; sorts as "10" before "9" |
| order_date | Text "03/04/2026" | Sorts wrongly; month is ambiguous |
| phone | Number 3001234567 | Leading zero lost |
| customer_id | Number | Fine, unless IDs contain letters later |

Phone numbers, postal codes and IDs that are never added together should be stored as text.

### Converting numbers

Commas, currency symbols and spaces stop text becoming numbers:

\`\`\`py
df["amount"] = (df["amount"].astype(str)
                .str.replace("PKR", "", regex=False)
                .str.replace(",", "", regex=False)
                .str.strip())
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
\`\`\`

errors="coerce" turns anything unconvertible into NaN instead of crashing. Count those afterwards; they are rows you need to inspect.

### Dates

Dates cause more confusion than any other type. "03/04/2026" is 3 April in Pakistan and the UK but 4 March in the United States. Always confirm the source format, then parse explicitly:

\`\`\`py
df["order_date"] = pd.to_datetime(df["order_date"], format="%d/%m/%Y", errors="coerce")
\`\`\`

In SQL, store dates as DATE or TIMESTAMP types, never as text. Watch time zones too: a server in UTC records a 2 a.m. Pakistan order as the previous day, which shifts daily totals.

### Cleaning text

Common text fixes, in order:

1. **Trim** leading and trailing spaces.
2. **Standardise case**, usually title case for names and cities.
3. **Map variants** to a standard value with a lookup table.
4. **Remove odd characters**, such as non-breaking spaces copied from web pages.

\`\`\`py
city_map = {"lhr": "Lahore", "lahore": "Lahore", "khi": "Karachi",
            "karachi": "Karachi", "isb": "Islamabad", "islamabad": "Islamabad"}
df["city_clean"] = df["city"].str.strip().str.lower().map(city_map)
\`\`\`

Any city not in the map becomes NaN, which is useful: list those values and extend the map until nothing important is left.

### Splitting and combining

Sometimes one column holds two facts, like "Lahore - Gulberg". Split it:

\`\`\`py
df[["city", "area"]] = df["location"].str.split(" - ", n=1, expand=True)
\`\`\`

Sometimes you need the opposite, such as building a full address from parts. Keep the original columns until you have checked the result.

### Booleans and flags

Yes and no answers arrive as "Y", "yes", "1", "TRUE" or a blank. Convert them to one true or false column early, and decide explicitly what a blank means. A blank in "is_refunded" might mean no refund, or it might mean nobody recorded it, and the two give very different refund rates. Ask the data owner rather than guessing.

### Validation rules

After cleaning, test rules the data must satisfy:

\`\`\`py
assert df["order_id"].is_unique
assert (df["amount"] >= 0).all()
assert df["order_date"].between("2024-01-01", "2026-12-31").all()
\`\`\`

If any assertion fails, the script stops and tells you. Building these checks into cleaning scripts turns silent errors into loud ones, which is exactly what you want.
      `,
        [
          q('Why should phone numbers be stored as text rather than numbers?', [
            'Text uses less storage space',
            'Numbers cannot be longer than eight digits',
            'Numeric storage drops the leading zero',
            'Text sorts faster than numbers',
          ], 2, 'Numbers lose leading zeros, and phone numbers are never added together.'),
          q('What does errors="coerce" do in pd.to_numeric?', [
            'Stops the script at the first bad value',
            'Deletes rows that cannot be converted',
            'Turns unconvertible values into NaN',
            'Rounds all values to whole numbers',
          ], 2, 'Bad values become NaN so the script continues and you can inspect them.'),
          q('Why is "03/04/2026" risky in a dataset?', [
            'It has too many digits for a date',
            'It means different dates in different countries',
            'Dates cannot contain slashes',
            'It is always stored in UTC',
          ], 1, 'Day and month order differ by region, so the format must be confirmed and parsed explicitly.'),
        ]
      ),
      lesson('Documenting Every Cleaning Step', 12, `
Cleaning involves dozens of small decisions. If they live only in your head, nobody can check them, you cannot repeat them next month, and you will forget why you made them. Documentation turns cleaning from a private act into a trustworthy process.

### A cleaning log

Keep a running log with what changed, why, and how many rows were affected:

| Step | Action | Reason | Rows affected |
|---|---|---|---|
| 1 | Removed exact duplicates | Double import on 12 Feb | 288 |
| 2 | Kept latest record per order_id | Status updates create copies | 1,104 |
| 3 | Excluded staff test orders | Email domain @ourstore.pk | 37 |
| 4 | Mapped city spellings | LHR, lahore to Lahore | 407 |
| 5 | City missing set to Unknown | Not captured before May 2024 | 140 |
| 6 | Excluded amount above 50 million | Placeholder values | 3 |

Row counts matter. "Removed duplicates" tells a reader little; "removed 288 duplicates out of 14,500" tells them the impact.

### Prefer scripts to manual edits

Manual edits in a spreadsheet leave no trace. A script records every step and can be rerun on next month's data in seconds.

\`\`\`py
raw = pd.read_csv("orders_2026_03.csv")
n0 = len(raw)

df = raw.drop_duplicates()
print("exact duplicates removed:", n0 - len(df))

df = df[~df["email"].str.endswith("@ourstore.pk", na=False)]
print("rows after removing staff tests:", len(df))
\`\`\`

Printing row counts after each step creates the log automatically. SQL works the same way when each cleaning step is a CTE with a comment.

### Keep raw and clean separate

Never overwrite the original file. A common folder layout:

\`\`\`text
project/
  data/raw/        original exports, never edited
  data/clean/      outputs of the cleaning script
  scripts/         cleaning and analysis code
  notes/           cleaning log, questions, decisions
\`\`\`

If someone challenges a number, you can rebuild the clean data from raw with one command and show exactly what changed.

### Data dictionary

Alongside the log, keep a short data dictionary describing each column of the clean dataset:

| Column | Type | Meaning | Notes |
|---|---|---|---|
| order_id | text | Unique order reference | Primary key |
| city_clean | text | Standardised city | Unknown if missing |
| amount_pkr | number | Order value after discount | Excludes delivery fee |

This is the document new team members ask for most, and the one most teams forget to write.

### Communicating limitations

Summarise cleaning in plain words in your final output, usually in a short "About the data" note:

\`\`\`text
About the data: 14,212 paid orders from 1 Sep 2025 to 28 Feb 2026.
1% of orders had no city and are shown as Unknown. Three placeholder
orders were excluded. Delivery fees are not included in revenue.
\`\`\`

Three sentences like these answer most questions before they are asked and show that you handled the data carefully. Stakeholders trust analysts who are open about limitations far more than those whose numbers look suspiciously perfect.
      `,
        [
          q('Why include row counts in each cleaning log entry?', [
            'Row counts are required for SQL to run',
            'They show how much each step changed the data',
            'They make the log easier to sort',
            'They replace the need for a data dictionary',
          ], 1, 'Knowing how many rows each decision affected lets readers judge its impact.'),
          q('What is the main advantage of a cleaning script over manual spreadsheet edits?', [
            'Scripts always produce smaller files',
            'Manual edits cannot remove duplicates',
            'Scripts do not need any testing',
            'Every step is recorded and can be rerun on new data',
          ], 3, 'Scripts create a repeatable, reviewable record of all cleaning steps.'),
          q('What belongs in a short "About the data" note?', [
            'Period covered, main exclusions and known gaps',
            'The full SQL code used for cleaning',
            'Every row that was changed',
            'The analyst\'s personal opinions on the data',
          ], 0, 'A brief summary of scope and limitations answers most questions up front.'),
        ]
      ),
      ],
      [
      q('City shows "Lahore", "lahore" and "LHR". What is the best fix?', [
        'Delete the rows with variant spellings',
        'Map every variant to one standard value with a lookup',
        'Analyse each spelling as a separate city',
        'Replace all cities with Unknown',
      ], 1, 'A mapping table standardises variants so the city is counted once.'),
      q('An order ID appears twice, once as pending and once as paid. Which record usually wins?', [
        'The first one recorded',
        'Both should be kept and summed',
        'The latest record by update time',
        'Whichever has the larger amount',
      ], 2, 'The most recent update usually reflects the current state of the order.'),
      q('Which statement about outliers is correct?', [
        'They are always errors and must be removed',
        'They never affect averages or totals',
        'They should be replaced with zero',
        'Some are errors and some are genuine, important rows',
      ], 3, 'Each outlier needs investigating, because a genuine bulk order is real data.'),
      q('Why keep raw data in a separate folder from clean data?', [
        'Raw files load more quickly that way',
        'Clean data cannot share a folder with raw data',
        'You can always rebuild and check the clean version',
        'It prevents others from reading the raw data',
      ], 2, 'Untouched raw data lets you rerun cleaning and prove what changed.'),
      ]
    ),
    chapter(
      'Descriptive Statistics for Decisions',
      'Choose the right average, describe spread and distributions with percentiles, avoid confusing correlation with causation, and express how much a sample result can be trusted with margins of error and confidence intervals.',
      [
      lesson('Mean, Median and When Each Misleads', 13, `
"Average" sounds simple, but choosing the wrong one is one of the easiest ways to mislead, even by accident. Analysts need to know which average fits the data and the question.

### Three averages

| Measure | Definition | Example on 1, 2, 2, 3, 22 |
|---|---|---|
| Mean | Sum divided by count | 30 / 5 = 6 |
| Median | Middle value when sorted | 2 |
| Mode | Most frequent value | 2 |

The single large value of 22 drags the mean to 6, even though four of the five values are 3 or less. The median ignores how extreme the largest value is.

### Skewed data

Many business measures are right-skewed: most values are small and a few are very large. Order values, salaries, house prices, time on site and customer spending all behave this way.

Consider monthly salaries at a small software house in Islamabad:

| Role | Salary (PKR) |
|---|---|
| 6 junior developers | 120,000 each |
| 3 senior developers | 300,000 each |
| 1 founder | 2,500,000 |

The mean salary is 412,000, but nine of ten people earn far less. The median is 120,000. A job advert saying "average salary above 400,000" would be technically correct and deeply misleading.

### When to use each

- **Mean** suits roughly symmetric data, and when totals matter. Revenue per customer multiplied by customers gives total revenue, which only works with the mean.
- **Median** suits skewed data when you want the typical case, such as typical delivery time or typical order value.
- **Mode** suits categories, like the most common payment method.

Often the best answer is to report both: "The median order is PKR 2,800, while the mean is PKR 4,100 because of a small number of bulk orders."

### Calculating them

\`\`\`sql
SELECT AVG(amount) AS mean_amount,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_amount
FROM orders;
\`\`\`

In pandas:

\`\`\`py
df["amount"].mean()
df["amount"].median()
df["payment_method"].mode()
\`\`\`

In Excel, use AVERAGE, MEDIAN and MODE.SNGL.

### Averages of averages

A frequent mistake is averaging values that are already averages. Suppose Lahore has 1,000 orders averaging PKR 3,000 and Quetta has 50 orders averaging PKR 6,000. The simple average of the two averages is PKR 4,500, but the true average across all 1,050 orders is about PKR 3,143. Always recalculate from totals: total revenue divided by total orders.

### Weighted averages

When groups differ in size, weight each group's average by its count:

\`\`\`text
(1,000 x 3,000 + 50 x 6,000) / (1,000 + 50) = 3,143
\`\`\`

The same logic applies to rates. An average of city conversion rates treats a city with 100 visitors as equal to one with 100,000. Recompute from total conversions divided by total visitors.

### The habit

Whenever you see the word average in a request or report, ask two questions: which average, and is the data skewed? Answering them takes a minute and prevents some of the most persistent errors in business reporting.
      `,
        [
          q('Order values are heavily right-skewed. Which measure best describes a typical order?', [
            'The mean order value',
            'The median order value',
            'The maximum order value',
            'The sum of order values',
          ], 1, 'The median is not pulled upward by a few very large orders.'),
          q('Why is averaging two city averages often wrong?', [
            'Averages cannot be added together',
            'Cities must be averaged by population',
            'It ignores how many orders each city has',
            'Averages are only valid for one city',
          ], 2, 'Groups of different sizes need weighting by their counts.'),
          q('Which average is most useful for a category such as payment method?', [
            'The mean',
            'The median',
            'The weighted mean',
            'The mode',
          ], 3, 'The mode identifies the most frequent category.'),
        ]
      ),
      lesson('Spread, Percentiles and Distributions', 13, `
Two datasets can share the same average and be completely different. Spread describes how much values vary, and it often matters more than the average itself.

### Why spread matters

Two couriers both average 3 days per delivery:

| Courier | Typical range | Late beyond 5 days |
|---|---|---|
| Courier A | 2 to 4 days | 1% |
| Courier B | 1 to 9 days | 18% |

Customers care about the late deliveries, not the average. Courier B's wide spread produces far more complaints despite the identical mean.

### Measures of spread

| Measure | What it tells you | Sensitive to extremes? |
|---|---|---|
| Range | Max minus min | Very |
| Standard deviation | Typical distance from the mean | Yes |
| Interquartile range (IQR) | Spread of the middle 50% | No |
| Percentiles | Value below which a given share falls | No |

Standard deviation suits roughly symmetric data. For skewed data, percentiles and the IQR are more honest.

### Percentiles in practice

Percentiles answer questions businesses actually ask:

- The **50th percentile** is the median.
- The **90th percentile** delivery time tells you the wait that 90% of customers beat. Service-level targets often use it: "90% of orders delivered within 4 days".
- The **95th or 99th percentile** of page load time shows what slow users experience.

\`\`\`sql
SELECT PERCENTILE_CONT(0.5)  WITHIN GROUP (ORDER BY delivery_days) AS p50,
       PERCENTILE_CONT(0.9)  WITHIN GROUP (ORDER BY delivery_days) AS p90,
       PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY delivery_days) AS p99
FROM shipments;
\`\`\`

\`\`\`py
df["delivery_days"].quantile([0.5, 0.9, 0.99])
\`\`\`

### Distributions

A distribution is the shape of how values are spread. The quickest way to see it is a histogram. Common shapes:

- **Symmetric**, like heights or exam scores in a large class, where mean and median are close.
- **Right-skewed**, like income and order value, with a long tail of large values.
- **Bimodal**, with two peaks, often signalling two different groups mixed together, such as retail and wholesale customers.

A bimodal distribution is a clue to split the data. Averaging retail and wholesale orders together describes neither group well.

### The normal distribution

Many statistical methods assume a normal, bell-shaped distribution. In that case, about 68% of values lie within one standard deviation of the mean and about 95% within two. Business data is often not normal, so check the histogram before relying on these rules.

### Box plots

A box plot summarises a distribution in one shape: a box from the 25th to the 75th percentile, a line at the median, and whiskers reaching out to typical extremes, with outliers drawn as dots. Placing box plots for each city side by side compares their typical values and spread at a glance, which a table of averages cannot do.

### Reporting spread

Pair every average with a measure of spread. "Median delivery time is 3 days, and 90% of orders arrive within 5" is far more useful than "average delivery time is 3.2 days".
      `,
        [
          q('Two couriers both average 3 days. Why might one cause far more complaints?', [
            'Its deliveries vary more, so more are very late',
            'It delivers to fewer cities',
            'Its average is calculated differently',
            'It uses a different currency',
          ], 0, 'Wider spread means more extreme late deliveries despite the same mean.'),
          q('What does the 90th percentile delivery time tell you?', [
            'The average delivery time of the slowest orders',
            'The fastest 90 deliveries in the data',
            'The time 90 out of every 1,000 orders take',
            'The time within which 90% of orders arrive',
          ], 3, 'Ninety percent of deliveries take this long or less.'),
          q('A histogram of order values shows two separate peaks. What does this suggest?', [
            'The data has been sorted incorrectly',
            'The mean and median are equal',
            'Two different groups may be mixed together',
            'Order values follow a normal distribution',
          ], 2, 'Bimodal shapes often mean distinct customer types should be analysed separately.'),
        ]
      ),
      lesson('Correlation, Causation and Confounders', 13, `
Finding that two things move together is easy. Knowing whether one causes the other is hard, and confusing the two leads to expensive decisions based on coincidence.

### Correlation

The correlation coefficient, r, measures how strongly two numeric variables move together in a straight-line pattern. It runs from -1 to +1.

| r | Meaning |
|---|---|
| +0.8 to +1 | Strong positive: both rise together |
| +0.3 to +0.8 | Moderate positive |
| -0.3 to +0.3 | Weak or no linear relationship |
| -1 to -0.3 | Negative: one rises as the other falls |

\`\`\`py
df[["ad_spend", "revenue"]].corr()
\`\`\`

In Excel, \`=CORREL(A2:A100, B2:B100)\` gives the same number.

### Why correlation is not causation

Ice cream sales and drowning incidents are correlated. Ice cream does not cause drowning; hot weather increases both. Business data is full of the same trap.

Suppose customers who use the mobile app spend 40% more than website-only customers. It is tempting to conclude "the app makes people spend more, so push everyone to it". But perhaps loyal, high-spending customers are simply more likely to install the app in the first place. The app may have little effect at all.

### Confounders

A confounder is a third factor that influences both variables. Common business confounders:

- **Seasonality**: Ramadan and Eid lift both ad spend and sales in the same weeks.
- **Customer type**: wholesale buyers differ from retail on almost every measure.
- **Time**: two metrics that both grow over time will correlate even if unrelated.
- **Location**: big cities have more of everything.

### Simpson's paradox

Sometimes a trend reverses when you split the data. A hospital may show higher overall death rates than another, yet lower rates within every severity group, simply because it treats more severe cases. In business, a promotion might seem to lower conversion overall while raising it in every city, because it shifted traffic towards cities that always convert less. Always check whether a headline result holds within key segments.

### Checking for confounders

Segment the comparison. If app users spend more than web users within each customer tenure band and within each city, the case for the app is stronger. If the gap disappears within segments, tenure or city was driving it.

\`\`\`sql
SELECT tenure_band, uses_app, AVG(monthly_spend) AS avg_spend
FROM customers
GROUP BY tenure_band, uses_app
ORDER BY tenure_band, uses_app;
\`\`\`

### Establishing causation

The strongest evidence comes from an experiment, an A/B test, in which customers are randomly assigned to groups so that confounders balance out. Randomly offering half your website visitors a prompt to install the app, then comparing spending, would show the app's real effect.

When experiments are impossible, use careful language. Say "app users spend more" rather than "the app increases spending". The wording matters, because a manager will act on what your sentence implies.
      `,
        [
          q('What does a correlation of -0.7 between price and units sold indicate?', [
            'Price changes cause no difference in sales',
            'As price rises, units sold tend to fall',
            'Price and units sold rise together strongly',
            'The data contains errors',
          ], 1, 'A strong negative correlation means the variables move in opposite directions.'),
          q('App users spend more than web users. What is a plausible confounder?', [
            'The colour of the app\'s icon',
            'The number of rows in the table',
            'Loyal customers are more likely to install the app',
            'The analyst\'s choice of chart',
          ], 2, 'Customer loyalty could drive both app use and higher spending.'),
          q('What gives the strongest evidence that a change causes an effect?', [
            'A high correlation coefficient',
            'A large sample of historical data',
            'A chart showing both lines rising',
            'A randomised experiment such as an A/B test',
          ], 3, 'Random assignment balances confounders so differences can be attributed to the change.'),
        ]
      ),
      lesson('Samples, Margins of Error and Confidence', 13, `
Analysts often work with samples: a customer survey, a month of data, a test group. Results from a sample vary by chance, and decisions need to account for how much.

### Population and sample

The population is everyone you care about, such as all your customers. A sample is the subset you observe. If 300 of 1,000 surveyed customers say they would recommend you, the sample rate is 30%. The true rate among all customers is probably close to 30%, but not exactly.

### Margin of error

The margin of error tells you how far the sample result might be from the truth. For a proportion, a common approximation at 95% confidence is:

\`\`\`text
margin = 1.96 x sqrt( p x (1 - p) / n )
p = 0.30, n = 1,000
margin = 1.96 x sqrt(0.30 x 0.70 / 1000) = 0.028, about 2.8 points
\`\`\`

So the result is 30% plus or minus 2.8 points, or roughly 27% to 33%.

### Sample size matters

| Sample size | Margin of error at p = 50% |
|---|---|
| 100 | about 10 points |
| 400 | about 5 points |
| 1,000 | about 3 points |
| 10,000 | about 1 point |

To halve the margin, you need about four times the sample. This is why small surveys produce wildly varying results, and why a city with 40 orders can show a "50% jump" that means nothing.

### Confidence intervals

A 95% confidence interval is a range built so that, if you repeated the sampling many times, about 95% of such ranges would contain the true value. In practice, report results as a range when the sample is small:

"Satisfaction is 72%, with a likely range of 66% to 78%."

This sentence tells the reader how much weight the number can bear.

### Comparing two groups

When comparing groups, check whether their intervals overlap heavily. If Lahore's satisfaction is 72% with a range of 66% to 78% and Karachi's is 69% with a range of 63% to 75%, you cannot claim Lahore is happier. The difference is within normal sampling noise.

### Sampling bias

A large sample does not fix a biased one. If only angry customers answer a complaint survey, or only app users see an in-app poll, the result reflects them, not everyone. Ask how the sample was chosen:

- **Random**: everyone had an equal chance. Best.
- **Convenience**: whoever was easy to reach. Risky.
- **Self-selected**: people chose to respond. Often skewed towards strong opinions.

### Small numbers warning

Be careful with percentages from small groups. "Returns in Gilgit rose 100%" may mean they went from 2 to 4. Show counts next to percentages whenever groups are small, and resist ranking cities or products whose samples are tiny. A simple rule many teams use: hide or grey out any segment with fewer than 30 observations.
      `,
        [
          q('Roughly how much bigger must a sample be to halve the margin of error?', [
            'Twice as big',
            'Three times as big',
            'Four times as big',
            'Ten times as big',
          ], 2, 'Margin of error shrinks with the square root of the sample size.'),
          q('Two cities\' satisfaction ranges overlap heavily. What can you conclude?', [
            'The difference may just be sampling noise',
            'The city with the higher number is clearly better',
            'Both surveys must be invalid',
            'The cities have identical satisfaction',
          ], 0, 'Heavily overlapping intervals do not support claiming a real difference.'),
          q('Why can a very large self-selected survey still mislead?', [
            'Large samples always have big margins of error',
            'Surveys cannot measure satisfaction',
            'Self-selected responses are illegal to use',
            'The people who chose to respond may not represent everyone',
          ], 3, 'Sample size does not fix bias in who is included.'),
        ]
      ),
      ],
      [
      q('A report says average salary is PKR 412,000, but most staff earn 120,000. What is happening?', [
        'The median has been calculated wrongly',
        'A few very high salaries are pulling up the mean',
        'Salaries are reported in the wrong currency',
        'The mode is higher than the mean',
      ], 1, 'Skewed data makes the mean unrepresentative of the typical case.'),
      q('Which pair best summarises skewed delivery times?', [
        'The mean and the maximum',
        'The mode and the range',
        'The minimum and the sum',
        'The median and the 90th percentile',
      ], 3, 'The median shows the typical case and the 90th percentile shows the slow tail.'),
      q('A promotion lowers conversion overall but raises it within every city. What explains this?', [
        'The data must contain duplicate rows',
        'Conversion cannot be compared across cities',
        'Simpson\'s paradox caused by a shift in the city mix',
        'The promotion was never actually launched',
      ], 2, 'Changing group mix can reverse an overall trend even when every group improves.'),
      q('Returns in a small city "doubled" from 2 to 4. How should this be reported?', [
        'Show the counts and note the small sample',
        'Highlight it as the biggest problem in the business',
        'Remove the city from all future reports',
        'Report only the percentage change',
      ], 0, 'Tiny groups produce dramatic percentages from random variation.'),
      ]
    ),
    chapter(
      'Exploratory Analysis',
      'Find the story in a dataset by comparing segments, separating trends from seasonality, tracking how customer cohorts retain over time, and measuring where people drop out of a conversion funnel.',
      [
      lesson('Segmenting and Comparing Groups', 13, `
A single overall number hides most of what matters. Segmentation splits the data into meaningful groups so you can see where performance is strong, where it is weak, and why the total moved.

### Common segments

| Dimension | Examples |
|---|---|
| Geography | City, province, urban versus rural |
| Customer | New versus returning, tenure, plan type |
| Product | Category, price band, brand |
| Channel | Website, app, marketplace, retail |
| Acquisition source | Paid search, social, referral, organic |
| Time | Weekday versus weekend, hour of day |

Pick segments that someone can act on. Splitting by customer star sign is possible but useless; splitting by acquisition channel can change where the marketing budget goes.

### The segment table

The basic tool is a table with volume, rate and change for each segment:

\`\`\`sql
SELECT channel,
       COUNT(*)                                   AS orders,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS share_pct,
       ROUND(AVG(amount))                         AS avg_order,
       ROUND(100.0 * AVG(CASE WHEN status = 'returned' THEN 1 ELSE 0 END), 1) AS return_rate
FROM orders
WHERE order_date >= '2026-01-01'
GROUP BY channel
ORDER BY orders DESC;
\`\`\`

Show volume alongside rates so readers can tell a big problem from a small one. A 20% return rate on 50 orders matters less than a 9% rate on 20,000.

### Explaining a change with mix and rate

When an overall metric moves, it moves for two reasons: the rates within segments changed, or the mix of segments changed. Consider average order value falling from PKR 3,400 to PKR 3,100:

| Channel | Jan share | Mar share | Jan AOV | Mar AOV |
|---|---|---|---|---|
| Website | 60% | 40% | 3,800 | 3,800 |
| Marketplace | 40% | 60% | 2,800 | 2,650 |

Website order value did not change at all. Most of the fall came from the shift towards the marketplace, where orders are smaller, plus a small price drop on the marketplace. The fix is a business conversation about channels, not a website problem.

### Index against the average

An index compares each segment with the overall average, set to 100:

\`\`\`text
index = segment rate / overall rate x 100
\`\`\`

A city with a return rate index of 150 returns 50% more than average. Indexing makes comparisons quick to read when the raw rates are small or unfamiliar.

### Drill down step by step

Start broad, then go one level deeper only where something stands out:

1. Total revenue fell 8%.
2. By channel: marketplace fell 20%, website flat.
3. Within marketplace, by category: footwear fell 45%.
4. Within marketplace footwear, by product: two best-selling sandals went out of stock.

Each step narrows the search. Four short queries found what a giant table with every combination would have buried.

### Beware of slicing too thin

If you split the data into enough segments, some will look remarkable by pure chance. Treat surprising results in small segments as hypotheses to check, not findings to announce, and confirm them with more data or a follow-up period.
      `,
        [
          q('Why show order volume next to rates in a segment table?', [
            'Volume makes the table look more complete',
            'It shows whether a high rate affects many or few orders',
            'Rates cannot be calculated without volume columns',
            'Volume is required for sorting the table',
          ], 1, 'Rates without volume hide whether a problem is large or tiny.'),
          q('Average order value fell, but website AOV did not change. What is a likely explanation?', [
            'The website must have a data error',
            'Average order value cannot be compared across months',
            'More orders shifted to a lower-value channel',
            'The marketplace stopped selling entirely',
          ], 2, 'A change in segment mix can move the overall average even when rates stay flat.'),
          q('What does a return rate index of 150 mean?', [
            'The segment has 150 returns',
            'The return rate is 150%',
            'The segment is ranked 150th',
            'The segment returns 50% more than average',
          ], 3, 'An index of 100 equals the overall average, so 150 is half again above it.'),
        ]
      ),
      lesson('Trends, Seasonality and Time Comparisons', 13, `
Most business questions involve time: is it growing, is this month unusual, are we better than last year? Answering well means separating the long-term trend from regular seasonal patterns and random noise.

### Three components

| Component | Meaning | Example |
|---|---|---|
| Trend | Long-term direction | Online sales growing 25% per year |
| Seasonality | Regular repeating pattern | Spikes before Eid and on 11.11 sales |
| Noise | Random variation | A rainy Tuesday with fewer orders |

A sales jump in the week before Eid tells you nothing about the trend. It happens every year.

### Choosing the right comparison

| Comparison | Good for | Weakness |
|---|---|---|
| Day on day | Spotting outages and sudden breaks | Very noisy |
| Week on week | Short-term operations | Holidays distort it |
| Month on month | Monthly targets | Months have different lengths and holidays |
| Year on year | Removing seasonality | Slow to react |

For seasonal businesses, year-on-year comparison of the same period is usually the fairest. Comparing Ramadan sales with the month before Ramadan will always look dramatic.

### Moving Islamic holidays

Eid and Ramadan move about 11 days earlier each year in the Gregorian calendar. A March to March comparison may compare a Ramadan month with a normal one. When holidays drive your business, align comparisons by holiday period, such as "the 30 days before Eid ul Fitr", rather than by calendar month.

### Smoothing noise

Daily data is jumpy. A 7-day moving average removes weekday patterns and shows the underlying direction:

\`\`\`py
daily = df.groupby("order_date")["amount"].sum()
smooth = daily.rolling(7).mean()
\`\`\`

\`\`\`sql
SELECT day, revenue,
       AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7
FROM daily_sales;
\`\`\`

Plot both the raw values and the moving average, so readers see the noise and the signal.

### Calendar effects

Some differences come from the calendar itself:

- February has fewer days than March, so monthly totals differ before anything changes.
- A month with five Saturdays may have higher retail sales than one with four.
- Public holidays reduce B2B activity and may increase consumer spending.

Comparing averages per day, or per working day, removes much of this effect.

### Year to date

Year-to-date totals compare progress so far with the same point last year:

\`\`\`sql
SELECT EXTRACT(YEAR FROM order_date) AS yr, SUM(amount) AS ytd_revenue
FROM orders
WHERE EXTRACT(DOY FROM order_date) <= EXTRACT(DOY FROM CURRENT_DATE)
GROUP BY 1;
\`\`\`

Comparing this year's full-to-date with last year's full year would be meaningless; the day-of-year condition keeps the comparison fair.

### Annotate the chart

Mark known events on trend charts: a price change, a website outage, a new competitor, a campaign. A spike with a label "Eid campaign" needs no further explanation, and a spike without one invites wrong guesses in every meeting.
      `,
        [
          q('Sales jump every year in the week before Eid. What is this pattern called?', [
            'Trend',
            'Seasonality',
            'Noise',
            'Correlation',
          ], 1, 'Regular repeating patterns tied to the calendar are seasonality.'),
          q('Why compare Ramadan periods across years rather than by calendar month?', [
            'Calendar months are not allowed in reports',
            'Ramadan always falls in the same month',
            'It removes the need for a moving average',
            'Islamic holidays move earlier each Gregorian year',
          ], 3, 'Aligning by holiday period avoids comparing a festive month with a normal one.'),
          q('What does a 7-day moving average remove from daily sales data?', [
            'The long-term growth trend',
            'The effect of price changes',
            'Weekday ups and downs',
            'All seasonal patterns across the year',
          ], 2, 'Averaging seven days smooths the weekly cycle while keeping the overall direction.'),
        ]
      ),
      lesson('Cohorts and Retention', 14, `
A cohort is a group of customers who share a starting point, usually the month they first bought or signed up. Cohort analysis tracks each group over time, showing whether customers stay, and whether newer customers behave better or worse than older ones.

### Why overall numbers mislead

If a business grows quickly, total active customers can rise even while most new customers leave after one purchase. Fresh sign-ups hide the leak. Cohorts reveal it by following each group separately.

### The cohort table

Each row is a cohort, each column is months since joining, and each cell is the share still active:

| Cohort | Month 0 | Month 1 | Month 2 | Month 3 |
|---|---|---|---|---|
| Jan 2026 | 100% | 32% | 24% | 21% |
| Feb 2026 | 100% | 35% | 27% | 23% |
| Mar 2026 | 100% | 41% | 33% | |
| Apr 2026 | 100% | 44% | | |

Reading down a column compares cohorts at the same age. Month 1 retention improved from 32% to 44%, so something in March or April, perhaps a new onboarding email, is working.

### Building it in SQL

\`\`\`sql
WITH firsts AS (
  SELECT customer_id, DATE_TRUNC('month', MIN(order_date)) AS cohort
  FROM orders GROUP BY customer_id
),
activity AS (
  SELECT DISTINCT o.customer_id, f.cohort,
         DATE_TRUNC('month', o.order_date) AS active_month
  FROM orders o JOIN firsts f ON f.customer_id = o.customer_id
)
SELECT cohort,
       (EXTRACT(YEAR FROM active_month) - EXTRACT(YEAR FROM cohort)) * 12
       + EXTRACT(MONTH FROM active_month) - EXTRACT(MONTH FROM cohort) AS month_n,
       COUNT(DISTINCT customer_id) AS active_customers
FROM activity
GROUP BY 1, 2
ORDER BY 1, 2;
\`\`\`

Divide each cell by the cohort's month 0 count to get percentages. A PivotTable with cohort in rows and month_n in columns produces the familiar triangle.

### Retention curves

Plot each cohort as a line of retention against months since joining. Healthy products show curves that flatten: after early drop-off, a stable core keeps buying. Curves that keep sliding towards zero mean the product does not create lasting value, and acquisition spending will never pay back.

### Definitions matter

Decide exactly what "active" means: placed an order, logged in, or paid a subscription. For a grocery app, active monthly makes sense. For a furniture store, customers naturally buy once every few years, so a monthly retention table would look terrible for no reason. Choose a period that matches the natural buying cycle.

### Cohorts by other starting points

Cohorts need not be monthly sign-ups. Useful alternatives include:

- **Acquisition channel**: do referral customers retain better than paid social ones?
- **First product bought**: do customers who start with a starter kit stay longer?
- **First order discount**: do heavily discounted first orders attract one-time bargain hunters?

The last question often reveals that big first-order discounts bring customers who never return, an insight that can save a large share of the marketing budget.

### Revenue retention

Customer retention counts people. Revenue retention measures how much of a cohort's spending continues, including customers who spend more over time. For subscription businesses, net revenue retention above 100% means existing customers grow their spending faster than others leave.
      `,
        [
          q('What defines a cohort in a typical retention analysis?', [
            'Customers who share the same starting month',
            'Customers who live in the same city',
            'Customers who bought the same product last',
            'Customers who share an account manager',
          ], 0, 'Cohorts group customers by a common starting point such as first purchase month.'),
          q('How do you compare cohorts fairly in a cohort table?', [
            'Read across the most recent row only',
            'Add up all the cells in each row',
            'Compare the oldest cohort with the overall total',
            'Read down a column to compare cohorts at the same age',
          ], 3, 'Each column holds cohorts at the same number of months since joining.'),
          q('Retention curves keep sliding towards zero without flattening. What does this suggest?', [
            'The business has a healthy core of loyal customers',
            'Customers are not finding lasting value in the product',
            'The cohort table has been built incorrectly',
            'Retention is improving with every cohort',
          ], 1, 'Flattening curves show a stable core; steadily falling ones show a leak.'),
        ]
      ),
      lesson('Funnels and Conversion Rates', 13, `
A funnel is a sequence of steps that people take towards a goal, such as visiting a site, viewing a product, adding to cart, checking out and paying. Funnel analysis measures how many people complete each step and where they drop off.

### A basic funnel

| Step | Users | Step conversion | Overall conversion |
|---|---|---|---|
| Visited site | 100,000 | | 100% |
| Viewed product | 42,000 | 42% | 42% |
| Added to cart | 9,800 | 23% | 9.8% |
| Started checkout | 5,100 | 52% | 5.1% |
| Paid | 2,300 | 45% | 2.3% |

Step conversion compares each step with the one before. Overall conversion compares each step with the top. The biggest absolute loss here is between product view and cart, but the checkout to payment step, losing more than half of committed buyers, is often the cheapest to fix.

### Building a funnel in SQL

With an events table holding one row per user action:

\`\`\`sql
SELECT
  COUNT(DISTINCT CASE WHEN event = 'visit'          THEN user_id END) AS visited,
  COUNT(DISTINCT CASE WHEN event = 'view_product'   THEN user_id END) AS viewed,
  COUNT(DISTINCT CASE WHEN event = 'add_to_cart'    THEN user_id END) AS carted,
  COUNT(DISTINCT CASE WHEN event = 'begin_checkout' THEN user_id END) AS checkout,
  COUNT(DISTINCT CASE WHEN event = 'purchase'       THEN user_id END) AS paid
FROM events
WHERE event_date BETWEEN '2026-03-01' AND '2026-03-31';
\`\`\`

This simple version counts users who did each event at any point in the month. A strict funnel also checks the order of steps, counting only users who added to cart after viewing a product.

### Segmenting the funnel

Funnels become useful when compared across segments:

| Segment | Cart to paid |
|---|---|
| Desktop | 58% |
| Mobile web | 31% |
| App | 62% |

Mobile web converts far worse at checkout. That points to a specific problem, perhaps a payment page that is hard to use on small screens, or an OTP that fails to arrive. Payment method splits are especially revealing in Pakistan, where cash on delivery, cards, JazzCash and Easypaisa can behave very differently.

### Choosing the time window

Decide how long a user has to complete the funnel. A user who adds to cart today and buys in five days counts as converted under a 7-day window but not a 1-day window. Keep the window consistent when comparing periods, or conversion will appear to change when only the measurement did.

### Cash on delivery and the hidden last step

For cash-on-delivery businesses, the funnel does not end at "order placed". A meaningful share of COD orders are refused at the door. Add "delivered and paid" as the final step, because an order that is refused costs shipping both ways and earns nothing.

### From funnel to action

A funnel tells you where people leave, not why. Pair it with qualitative evidence: session recordings, customer support tickets, or a quick survey on the checkout page. Then test fixes one at a time, which leads directly into A/B testing, covered later in the course.
      `,
        [
          q('What is the difference between step conversion and overall conversion?', [
            'Step conversion uses revenue; overall uses users',
            'They are two names for the same calculation',
            'Overall conversion ignores the first step',
            'Step compares with the previous step; overall with the top',
          ], 3, 'Step conversion shows each stage\'s efficiency; overall shows cumulative progress.'),
          q('Mobile web converts much worse at checkout than desktop. What does this point to?', [
            'A specific checkout problem on mobile web',
            'Mobile users never intend to buy anything',
            'The funnel query must be wrong',
            'Desktop users are counted twice',
          ], 0, 'A drop isolated to one segment and step suggests a targeted fix.'),
          q('Why add "delivered and paid" as a final step for cash-on-delivery orders?', [
            'Payment gateways require it',
            'It makes the funnel look longer',
            'Refused COD orders earn nothing and cost shipping',
            'Delivery data is always more accurate',
          ], 2, 'Orders refused at the door are not real conversions and carry costs.'),
        ]
      ),
      ],
      [
      q('Total revenue fell 8%. What is the best first exploration step?', [
        'Build a table of every possible combination of segments',
        'Break revenue down by one broad dimension such as channel',
        'Immediately compare individual product sales',
        'Wait for next month\'s data to arrive',
      ], 1, 'Drilling down one level at a time finds the source of a change efficiently.'),
      q('Monthly totals for February are lower than January. What should you check first?', [
        'Whether the database lost data',
        'Whether the trend has reversed',
        'Whether the difference is due to fewer days',
        'Whether customers stopped buying entirely',
      ], 2, 'February is shorter, so per-day comparisons remove the calendar effect.'),
      q('Total active customers rise each month, yet most new customers buy only once. Which analysis reveals this?', [
        'A funnel by device type',
        'A year-to-date comparison',
        'A moving average of daily sales',
        'A cohort retention table',
      ], 3, 'Cohorts follow each group separately, exposing churn hidden by new sign-ups.'),
      q('Why keep the funnel completion window consistent across periods?', [
        'Changing it alters conversion even if behaviour has not changed',
        'Longer windows are always more accurate',
        'Short windows cannot be calculated in SQL',
        'The window determines which users visit the site',
      ], 0, 'A different window changes the measurement, not the customers\' behaviour.'),
      ]
    ),
    chapter(
      'Python and pandas for Analysts',
      'Learn just enough Python to be productive, then use pandas to load, filter, group, merge and reshape data, and matplotlib and seaborn to chart results, all in repeatable notebooks rather than one-off spreadsheets.',
      [
      lesson('Python Essentials for Analysis Work', 14, `
Python has become the second language of data analysts after SQL. You do not need to become a software engineer; a focused set of concepts covers most analysis work. The easiest way to start is Jupyter Notebook, Google Colab or VS Code, where you run code in small cells and see results immediately.

### Values and variables

\`\`\`py
city = "Lahore"
orders = 1250
avg_order = 3420.50
is_active = True
\`\`\`

Python has text (str), whole numbers (int), decimals (float) and booleans (bool). A variable is just a name for a value.

### Lists and dictionaries

\`\`\`py
cities = ["Lahore", "Karachi", "Islamabad"]
cities[0]            # "Lahore"
len(cities)          # 3

targets = {"Lahore": 500000, "Karachi": 650000}
targets["Karachi"]   # 650000
\`\`\`

Lists hold ordered items. Dictionaries map keys to values, which is perfect for lookups such as city to target or old spelling to new spelling.

### Loops and conditions

\`\`\`py
for city in cities:
    target = targets.get(city, 0)
    if target > 550000:
        print(city, "has a high target")
    else:
        print(city, "target:", target)
\`\`\`

Indentation matters in Python: the lines inside a loop or if block must be indented consistently, usually by four spaces. The .get method returns a default when a key is missing instead of crashing.

### Functions

Functions package logic you use repeatedly:

\`\`\`py
def growth_pct(current, previous):
    if previous == 0:
        return None
    return round(100 * (current - previous) / previous, 1)

growth_pct(1250, 1000)   # 25.0
\`\`\`

Handling the zero case inside the function means every caller is protected from a division error.

### Libraries

Python's power for analysis comes from libraries:

| Library | Purpose |
|---|---|
| pandas | Tables of data: load, clean, group, merge |
| numpy | Fast numeric calculations |
| matplotlib | Charts |
| seaborn | Statistical charts with less code |
| openpyxl | Reading and writing Excel files |

\`\`\`py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
\`\`\`

The short names pd, np and plt are universal conventions; every tutorial and colleague uses them.

### Reading errors

Errors look alarming but are usually helpful. Read the last line first:

\`\`\`text
KeyError: 'Amount'
\`\`\`

This means the column "Amount" does not exist, perhaps because it is actually "amount" in lowercase. Python is case-sensitive. Other common errors are NameError, a variable not yet defined, and TypeError, mixing incompatible types such as adding text to a number.

### Notebooks well organised

Keep notebooks readable: imports at the top, one task per cell, short Markdown notes explaining each step, and a final cell that produces the output. Restart the kernel and run all cells before sharing, to prove the notebook works from top to bottom and does not depend on cells you ran out of order.

### Using AI assistants

AI tools can write a first draft of pandas code or explain an error message. Treat their output like a colleague's suggestion: run it on a small sample, check the row counts, and make sure you understand each line before relying on the result.
      `,
        [
          q('Which Python structure is best for mapping old city spellings to standard names?', [
            'A list',
            'A boolean',
            'A dictionary',
            'A float',
          ], 2, 'Dictionaries map keys to values, ideal for lookup and replacement tables.'),
          q('You see KeyError: \'Amount\'. What is the most likely cause?', [
            'The file is too large to load',
            'Python cannot read numbers',
            'The notebook needs restarting',
            'The column name differs, perhaps in its capitalisation',
          ], 3, 'KeyError means the key or column does not exist exactly as written.'),
          q('Why restart the kernel and run all cells before sharing a notebook?', [
            'To prove it works top to bottom without hidden state',
            'To make the notebook file smaller',
            'To remove all the charts from the output',
            'Because notebooks expire after one day',
          ], 0, 'Running all cells from scratch catches dependence on out-of-order execution.'),
        ]
      ),
      lesson('Loading, Filtering and Grouping With pandas', 14, `
pandas gives Python a table structure called a DataFrame, similar to a spreadsheet or SQL table but scriptable. Most analyst tasks in pandas use a small set of operations.

### Loading data

\`\`\`py
import pandas as pd

orders = pd.read_csv("orders.csv", parse_dates=["order_date"])
targets = pd.read_excel("targets.xlsx", sheet_name="2026")
\`\`\`

parse_dates converts the column to real dates at load time. For a database, pd.read_sql runs a query and returns a DataFrame directly.

### First look

\`\`\`py
orders.head()          # first 5 rows
orders.shape           # (rows, columns)
orders.dtypes          # column types
orders.describe()      # numeric summary
\`\`\`

### Selecting and filtering

\`\`\`py
orders["amount"]                          # one column
orders[["order_id", "city", "amount"]]    # several columns
orders[orders["city"] == "Lahore"]        # filter rows
orders[(orders["city"] == "Lahore") & (orders["amount"] > 5000)]
orders[orders["city"].isin(["Lahore", "Karachi"])]
\`\`\`

Use & for and, | for or, and wrap each condition in brackets. Forgetting the brackets is the most common pandas error for beginners.

### Creating columns

\`\`\`py
orders["month"] = orders["order_date"].dt.to_period("M")
orders["is_large"] = orders["amount"] >= 10000
orders["size_band"] = pd.cut(orders["amount"],
                             bins=[0, 2000, 5000, 10000, float("inf")],
                             labels=["small", "medium", "large", "bulk"])
\`\`\`

The .dt accessor works on dates, .str on text, and pd.cut creates bands like a CASE WHEN in SQL.

### Grouping

The groupby method mirrors SQL's GROUP BY:

\`\`\`py
summary = (orders
           .groupby("city")
           .agg(orders=("order_id", "count"),
                customers=("customer_id", "nunique"),
                revenue=("amount", "sum"),
                avg_order=("amount", "mean"))
           .sort_values("revenue", ascending=False)
           .reset_index())
\`\`\`

Named aggregation, the orders= style, produces clean column names. nunique counts distinct values, the equivalent of COUNT(DISTINCT).

### SQL to pandas translation

| SQL | pandas |
|---|---|
| SELECT col | df["col"] |
| WHERE | df[condition] |
| GROUP BY | df.groupby() |
| ORDER BY | df.sort_values() |
| LIMIT 10 | df.head(10) |
| COUNT(DISTINCT x) | nunique |
| CASE WHEN | np.where or pd.cut |

If you know SQL, you already know what most pandas code is trying to do.

### Chaining

Writing operations as a chain inside brackets, as in the summary example, reads top to bottom like a recipe. It avoids a clutter of temporary variables called df2, df3 and df_final_new.

### Saving results

\`\`\`py
summary.to_csv("city_summary.csv", index=False)
summary.to_excel("city_summary.xlsx", index=False)
\`\`\`

index=False stops pandas writing its row numbers as an extra column, which otherwise confuses anyone opening the file.

### Checking as you go

After each important step, check the shape and a total:

\`\`\`py
print(orders.shape, orders["amount"].sum())
\`\`\`

If a filter drops more rows than expected, or a total changes when it should not, you find out immediately rather than at the end.

### Missing values in pandas

pandas marks missing values as NaN, and most methods skip them by default. sum ignores them, mean averages only the rows that have a value, and count tells you how many non-missing values exist. That default is convenient but can hide gaps, so check \`orders.isna().sum()\` before grouping. When you do decide to fill gaps, do it deliberately with fillna and a value you can justify, such as "Unknown" for a missing city, and note the decision in your cleaning log so the choice is visible to anyone who reruns the notebook.
      `,
        [
          q('How do you combine two filter conditions with "and" in pandas?', [
            'Use the word and between conditions',
            'Use & and wrap each condition in brackets',
            'Use a comma between the conditions',
            'Use + between the conditions',
          ], 1, 'pandas needs & with bracketed conditions; the word and causes an error.'),
          q('Which pandas aggregation matches COUNT(DISTINCT customer_id)?', [
            'count',
            'sum',
            'size',
            'nunique',
          ], 3, 'nunique counts distinct values within each group.'),
          q('Why pass index=False when saving a DataFrame to CSV?', [
            'It makes the file load faster',
            'It removes duplicate rows before saving',
            'It stops an extra column of row numbers being written',
            'It sorts the output by the first column',
          ], 2, 'Without it, pandas writes the index as an unnamed first column.'),
        ]
      ),
      lesson('Merging and Reshaping DataFrames', 14, `
Real analysis combines several tables and often needs data in a different shape from how it arrived. pandas handles both with merge, concat, pivot and melt.

### Merging

merge is pandas' join:

\`\`\`py
orders = orders.merge(customers[["customer_id", "signup_date", "segment"]],
                      on="customer_id", how="left", validate="many_to_one")
\`\`\`

| how | SQL equivalent |
|---|---|
| "inner" | INNER JOIN |
| "left" | LEFT JOIN |
| "right" | RIGHT JOIN |
| "outer" | FULL OUTER JOIN |

The validate argument is a safety check. "many_to_one" tells pandas that each customer_id should appear once in customers; if it appears more than once, pandas raises an error instead of silently duplicating orders. It is the pandas version of the row-count check after a SQL join.

### Finding unmatched rows

\`\`\`py
check = orders.merge(customers, on="customer_id", how="left", indicator=True)
check["_merge"].value_counts()
\`\`\`

indicator=True adds a column saying whether each row matched in both tables or only on the left. Rows marked "left_only" are orders with no customer record, which you should investigate or report.

### Stacking tables

concat stacks DataFrames with the same columns, such as monthly exports:

\`\`\`py
import glob
files = sorted(glob.glob("exports/orders_2026_*.csv"))
all_orders = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
\`\`\`

Twelve monthly files become one table in two lines, a job that takes many minutes of copying and pasting in a spreadsheet and often goes wrong.

### Wide to long with melt

Managers often send wide tables with one column per month. melt converts them into tidy long format:

\`\`\`py
wide = pd.DataFrame({"city": ["Lahore", "Karachi"],
                     "Jan": [120, 210], "Feb": [135, 190]})
long = wide.melt(id_vars="city", var_name="month", value_name="orders")
\`\`\`

| city | month | orders |
|---|---|---|
| Lahore | Jan | 120 |
| Karachi | Jan | 210 |
| Lahore | Feb | 135 |
| Karachi | Feb | 190 |

### Long to wide with pivot_table

The reverse turns long data into a report-friendly layout:

\`\`\`py
report = long.pivot_table(index="city", columns="month",
                          values="orders", aggfunc="sum", fill_value=0)
\`\`\`

pivot_table works like an Excel PivotTable: index sets the rows, columns sets the column headers, and aggfunc decides how to combine duplicates. fill_value replaces missing combinations with 0.

### Cross tabulation

pd.crosstab counts combinations of two categories quickly:

\`\`\`py
pd.crosstab(orders["city"], orders["payment_method"], normalize="index")
\`\`\`

normalize="index" shows each city's payment mix as proportions that sum to 1 across the row, revealing, for example, that cash on delivery dominates in smaller cities.

### Dates as an index

Time series work is easier when dates are the index:

\`\`\`py
daily = orders.set_index("order_date").resample("D")["amount"].sum()
weekly = orders.set_index("order_date").resample("W")["amount"].sum()
\`\`\`

resample groups by calendar periods, including days with no orders, which a simple groupby would skip. Missing days showing as zero is exactly what you want in a trend chart.

### Keep the original until you have checked

When reshaping, assign the result to a new name rather than overwriting the source. If the melt or pivot produces something unexpected, you can compare it with the original and try again without reloading data. Once the result is confirmed, delete the intermediate copies to keep the notebook tidy.
      `,
        [
          q('What does validate="many_to_one" do in a merge?', [
            'Raises an error if the right table\'s key has duplicates',
            'Removes duplicate rows from the left table',
            'Sorts both tables before merging',
            'Converts the merge into an inner join',
          ], 0, 'It enforces that each key appears once on the right, preventing silent fan-out.'),
          q('A manager sends a table with one column per month. Which method makes it tidy?', [
            'concat',
            'merge',
            'melt',
            'resample',
          ], 2, 'melt turns columns into rows, producing one month column.'),
          q('Why use resample instead of groupby for daily sales?', [
            'resample is the only way to sum values',
            'groupby cannot handle date columns',
            'resample automatically removes outliers',
            'resample includes days with no orders',
          ], 3, 'Calendar resampling fills empty days, keeping the time series complete.'),
        ]
      ),
      lesson('Charts in Python With matplotlib and seaborn', 13, `
Charts in Python take a little more code than in Excel, but they are repeatable: rerun the notebook next month and every chart updates with the same styling.

### The matplotlib pattern

Almost every chart follows the same structure:

\`\`\`py
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(monthly["month"], monthly["revenue"], marker="o")
ax.set_title("Monthly revenue, 2026")
ax.set_ylabel("PKR")
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig("monthly_revenue.png", dpi=150)
\`\`\`

fig is the whole image and ax is the chart area. Setting titles, labels and removing the top and right borders makes charts cleaner straight away.

### Common chart types

| Question | Chart | matplotlib |
|---|---|---|
| Change over time | Line | ax.plot |
| Compare categories | Bar | ax.bar or ax.barh |
| Distribution | Histogram | ax.hist |
| Relationship | Scatter | ax.scatter |

Horizontal bars, barh, are easier to read when category names are long, such as product names.

### seaborn for statistical charts

seaborn builds on matplotlib and handles grouping automatically:

\`\`\`py
import seaborn as sns

sns.histplot(data=orders, x="amount", bins=40)
sns.boxplot(data=orders, x="city", y="delivery_days")
sns.lineplot(data=monthly_by_city, x="month", y="revenue", hue="city")
sns.barplot(data=summary, x="revenue", y="city", errorbar=None)
\`\`\`

The hue argument draws one line or bar colour per category with a legend, which takes several lines in plain matplotlib.

### Formatting numbers

Large axis values like 12000000 are hard to read. Format them:

\`\`\`py
from matplotlib.ticker import FuncFormatter
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v/1e6:.0f}M"))
\`\`\`

The axis now shows 12M instead of 12000000.

### Small multiples

Instead of eight overlapping lines on one chart, draw one small chart per category with a shared scale:

\`\`\`py
g = sns.relplot(data=monthly_by_city, x="month", y="revenue",
                col="city", col_wrap=3, kind="line", height=2.5)
\`\`\`

Small multiples make each city's pattern clear while keeping them comparable.

### Highlighting what matters

Grey out everything except the series you want readers to notice:

\`\`\`py
for city, grp in monthly_by_city.groupby("city"):
    colour = "tab:red" if city == "Quetta" else "lightgrey"
    ax.plot(grp["month"], grp["revenue"], color=colour)
\`\`\`

One coloured line against grey context tells the story faster than eight colours competing for attention.

### Exporting for reports

Save charts as PNG at dpi of 150 or more for slides and documents, or as SVG for crisp scaling. Keep consistent sizes and fonts across a report by setting defaults once at the top of the notebook:

\`\`\`py
plt.rcParams.update({"figure.figsize": (9, 4), "font.size": 11})
\`\`\`

A consistent look makes your work feel professional and lets readers focus on the data instead of adjusting to each new style.

### A checklist before sharing a chart

Before a chart leaves your notebook, check five things. The title states the finding, such as "Quetta revenue fell for three months", rather than only naming the data. Axes are labelled with units, so nobody wonders whether the values are rupees or orders. Bar charts start at zero, because truncated bars exaggerate small differences. Colours are used for meaning, not decoration, and remain distinguishable for readers with colour blindness. Finally, the chart answers one question; if it is trying to answer three, split it into three charts. The next chapter covers these design choices in depth, and they apply equally to charts built in Python, Excel or a BI tool.
      `,
        [
          q('In fig, ax = plt.subplots(), what does ax represent?', [
            'The saved image file',
            'The data being plotted',
            'The chart area where data is drawn',
            'The colour palette for the chart',
          ], 2, 'fig is the whole figure; ax is the plotting area you draw on.'),
          q('What does the hue argument do in a seaborn chart?', [
            'Draws a separate colour for each category',
            'Changes the background colour of the chart',
            'Sets the transparency of every point',
            'Sorts the bars from largest to smallest',
          ], 0, 'hue splits the data by a category and colours each group with a legend.'),
          q('Why use small multiples instead of one chart with eight lines?', [
            'Small multiples use less memory',
            'seaborn cannot draw eight lines on one chart',
            'They remove the need for axis labels',
            'Each pattern is clear while scales stay comparable',
          ], 3, 'Separate panels on a shared scale avoid a tangle of overlapping lines.'),
        ]
      ),
      ],
      [
      q('Twelve monthly CSV exports must be combined into one table. Which approach fits best?', [
        'Copy and paste each file into one spreadsheet',
        'Merge the files on order_id one by one',
        'Read them in a loop and stack them with pd.concat',
        'Use melt on each file separately',
      ], 2, 'concat stacks tables with the same columns, quickly and repeatably.'),
      q('After a merge, how do you find orders with no matching customer?', [
        'Use validate="one_to_one"',
        'Sort the result by customer_id',
        'Count rows with value_counts on city',
        'Use indicator=True and look for left_only rows',
      ], 3, 'The indicator column labels rows that matched only on the left side.'),
      q('Which pandas code mirrors SQL\'s GROUP BY with SUM?', [
        'df.groupby("city")["amount"].sum()',
        'df.sort_values("city")["amount"]',
        'df.merge(df, on="city")',
        'df.melt(id_vars="city")',
      ], 0, 'groupby followed by an aggregate is the pandas form of GROUP BY.'),
      q('What is the main advantage of building charts in a Python notebook?', [
        'Python charts are always more colourful than Excel charts',
        'Notebook charts cannot contain mistakes',
        'They regenerate consistently when the data updates',
        'They do not need titles or axis labels',
      ], 2, 'Code-based charts are repeatable, so monthly reports update with one run.'),
      ]
    ),
    chapter(
      'Data Visualisation and Dashboards',
      'Pick the chart that matches the question, strip away clutter so the message stands out, avoid the design tricks that mislead readers, and build dashboards that people open, understand and act on.',
      [
      lesson('Choosing the Right Chart for the Question', 13, `
A chart exists to answer a question faster than a table could. The right chart type depends on the question being asked, not on what looks impressive or what the tool suggests first.

### Match the chart to the question

| Question | Best chart | Avoid |
|---|---|---|
| How has it changed over time? | Line chart | Pie chart |
| Which category is biggest? | Sorted bar chart | 3D bars |
| What is the share of the whole? | Stacked bar or a simple pie with few slices | Pie with 12 slices |
| How are values distributed? | Histogram or box plot | Line chart |
| Are two measures related? | Scatter plot | Two separate bar charts |
| How does actual compare with target? | Bar with target marker, or bullet chart | Gauge dial |
| What is the exact value? | A table or a single big number | Any chart |

### Line charts for time

Lines show continuity, so use them only when the horizontal axis is ordered, usually time. Limit them to about four or five lines; beyond that, use small multiples or highlight one line and grey the rest.

### Bar charts for comparison

Bars are the most accurate chart for comparing quantities because people judge lengths well. Sort bars from largest to smallest unless the categories have a natural order, such as age bands or months. Use horizontal bars when labels are long, like product or branch names, so they can be read without tilting your head.

### Pie charts, carefully

People judge angles poorly. A pie chart works only when there are two or three slices and the point is a rough share, such as "two thirds of orders are cash on delivery". With more categories, a sorted bar chart is almost always clearer. Never use 3D pies; the perspective distorts slice sizes.

### Single numbers

Sometimes the best visual is no chart at all. A key number displayed large, with a comparison, communicates instantly:

\`\`\`text
Revenue this month
PKR 48.2M
up 12% on last year
\`\`\`

These "KPI cards" sit at the top of most dashboards.

### Scatter plots for relationships

To see whether delivery time relates to customer rating, plot one dot per order or per city with delivery time on one axis and rating on the other. Add a trend line if the relationship is clear, and label notable dots. Scatter plots also reveal clusters and outliers that summary tables hide.

### Tables still matter

When readers need exact numbers to look up, such as a branch manager checking their own figures, a well-formatted table beats a chart. Right-align numbers, use thousand separators, round sensibly, and use light conditional formatting to highlight values that need attention.

### A quick decision routine

Before making any chart, write the question it answers as a sentence. "Which product categories drove the March decline?" leads straight to a sorted bar chart of change by category. If you cannot write the sentence, you do not yet know what the chart is for, and the reader will not either.
      `,
        [
          q('Which chart best shows how monthly revenue changed over two years?', [
            'A line chart',
            'A pie chart',
            'A scatter plot',
            'A 3D bar chart',
          ], 0, 'Line charts show continuous change over ordered time periods.'),
          q('When is a pie chart reasonable?', [
            'When comparing twelve product categories',
            'When showing change over several years',
            'When the exact values must be read precisely',
            'When showing a rough share with two or three slices',
          ], 3, 'People judge angles poorly, so pies only work with very few slices.'),
          q('Why use horizontal bars for branch names?', [
            'Horizontal bars are always more accurate',
            'They take less space on any screen',
            'Long labels can be read without tilting your head',
            'Vertical bars cannot be sorted',
          ], 2, 'Horizontal layouts give long category names room to sit level.'),
        ]
      ),
      lesson('Removing Clutter and Guiding the Eye', 13, `
Most default charts contain more ink than information: heavy gridlines, borders, legends far from their lines, and colours chosen by the software. Removing clutter and adding emphasis makes the message obvious.

### Remove what does not help

Go through every chart element and ask whether it helps the reader understand:

| Element | Usually |
|---|---|
| Chart border | Remove |
| Heavy gridlines | Lighten or remove |
| Background colour | Remove |
| Legend | Replace with direct labels |
| Decimal places | Reduce |
| 3D effects and shadows | Remove |
| Data labels on every point | Keep only the important ones |

Each removal makes the remaining elements easier to see.

### Label directly

Legends force readers to look back and forth. Placing the series name at the end of each line, or labelling bars directly, removes that effort. Similarly, if you show data labels on bars, you can often remove the axis entirely.

### Use colour on purpose

Colour is the strongest tool for directing attention, so use it sparingly:

- Make most data grey and colour only the part that carries the message.
- Use one consistent colour for the same thing across all charts, such as your company in blue and competitors in grey.
- Use red and green only when they mean bad and good, and remember that about one in twelve men has red-green colour blindness. Adding labels or icons removes the reliance on colour alone.

### Titles that say the finding

A descriptive title names the data. An action title states the conclusion:

| Descriptive | Action title |
|---|---|
| Revenue by month | Revenue recovered in March after two weak months |
| Return rate by city | Hyderabad's return rate is double the national average |
| Funnel by device | Mobile web loses half its buyers at payment |

Busy managers often read only the title. Make sure it carries the message by itself.

### Order and alignment

Sort categories meaningfully, align related charts so their axes match, and keep consistent scales when charts are meant to be compared. Two charts side by side with different y-axis ranges invite false comparisons.

### Annotation

Add short notes directly on the chart where something important happened: "Courier changed" with an arrow at the date, or "Eid sale" over the spike. Annotations answer the reader's first question before they ask it.

### Before and after

A typical default chart might show eight coloured lines, a legend, gridlines, a grey background and a title saying "Sales Data". The improved version shows the same lines in grey with Quetta in red, the city name written next to its line, light horizontal guides only, and the title "Quetta sales have fallen for three straight months". The data is identical; the second version makes the point in two seconds.

### Consistent style

Create a simple style guide for your team: fonts, a colour palette, number formats and title style. Consistency across reports makes each new chart easier to read, because readers already know the visual language.
      `,
        [
          q('Why replace a legend with direct labels?', [
            'Legends are not supported by most tools',
            'Readers no longer need to look back and forth',
            'Direct labels make the chart larger',
            'Legends always use the wrong colours',
          ], 1, 'Labels next to the data remove the effort of matching colours to a key.'),
          q('Which is an action title rather than a descriptive one?', [
            'Return rate by city',
            'Monthly revenue chart',
            'Funnel analysis by device',
            'Hyderabad\'s return rate is double the average',
          ], 3, 'An action title states the finding so readers get the message immediately.'),
          q('What is the most effective way to use colour in a chart with many lines?', [
            'Give every line a different bright colour',
            'Use red and green for alternate lines',
            'Grey most lines and colour the one that matters',
            'Remove all colour from the chart',
          ], 2, 'Highlighting one series against grey context directs attention to the message.'),
        ]
      ),
      lesson('Misleading Charts and How to Avoid Them', 13, `
Charts can mislead without containing a single false number. Some distortions are deliberate, but most are accidents caused by defaults or haste. Analysts are responsible for both.

### Truncated bar axes

Bars encode values by length, so their axis must start at zero. If two bars show 96 and 100 on an axis starting at 95, the second bar looks five times longer than the first, though the difference is about 4%.

Line charts are different: they encode change by slope, so a non-zero baseline is acceptable when small changes matter, such as an interest rate moving from 11% to 12%. Label the axis clearly so readers know it does not start at zero.

### Common distortions

| Distortion | Effect | Fix |
|---|---|---|
| Truncated bar axis | Small differences look huge | Start bars at zero |
| Dual y-axes | Any two lines can be made to look related | Use two charts or index both to 100 |
| Cherry-picked time range | Trend seems to reverse | Show a longer, natural period |
| Area or bubble scaling by diameter | Size differences exaggerated | Scale area, not radius |
| Cumulative charts | Always rise, hiding a slowdown | Show period values too |
| Inconsistent intervals | Missing months hide drops | Keep regular spacing |

### Dual axes

Two lines on separate left and right axes can be made to cross, diverge or move together just by changing the scales. Readers will see a relationship that the designer created. Prefer two aligned charts, or convert both series to an index where the first period equals 100.

### Percentages without bases

"Sales up 300%" from 10 to 40 units is technically true and practically trivial. Show counts alongside percentages whenever the base is small.

### Cumulative totals

A cumulative revenue chart rises every month, even if monthly revenue is falling. Cumulative views are useful for tracking progress towards an annual target, but should not be the only view of performance.

### Maps that mislead

Choropleth maps colour regions by value. Large, sparsely populated areas such as Balochistan dominate visually even when few customers live there. Use rates per customer rather than totals, or consider a bar chart of regions instead.

### Honest uncertainty

When numbers are estimates or based on small samples, show it: add error bars, shaded ranges, or a footnote. A forecast line drawn as solid as actual data suggests certainty that does not exist. A dashed line for forecasts is a simple, widely understood convention.

### A self-check

Before publishing a chart, ask: would a sceptical reader, seeing the full data, feel this chart was fair? If you had to defend the axis range or the time window in a meeting, could you? If the answer is uncertain, adjust the chart. Your credibility as an analyst depends on people trusting that your visuals show the data as it is.
      `,
        [
          q('Why must bar chart axes start at zero?', [
            'Bars encode value by length, so a cut axis exaggerates differences',
            'Charting tools require it for bar charts to render',
            'Zero makes the chart easier to colour',
            'Bars cannot show negative numbers otherwise',
          ], 0, 'Truncating a bar axis makes small differences look dramatic.'),
          q('What is the main risk of a chart with two different y-axes?', [
            'It cannot be printed in black and white',
            'It always uses too many colours',
            'It must start both axes at zero',
            'Scale choices can create a relationship that is not real',
          ], 3, 'Adjusting either axis changes how the lines appear to relate.'),
          q('How should a forecast be distinguished from actual data on a line chart?', [
            'Draw it thicker than the actual line',
            'Use a dashed line or a shaded range',
            'Remove the actual data from the chart',
            'Use a different chart type entirely',
          ], 1, 'A dashed line or range signals uncertainty that a solid line would hide.'),
        ]
      ),
      lesson('Designing Dashboards People Actually Use', 14, `
Many dashboards are built, admired once, and never opened again. A useful dashboard is designed around specific people, specific decisions and a specific rhythm of use.

### Start with the user and the question

Before building anything, answer:

1. **Who uses it?** A CEO, a regional manager and a warehouse supervisor need different things.
2. **How often?** Daily operational checks differ from monthly reviews.
3. **What decisions does it support?** Restocking, staffing, budget shifts?
4. **What action follows a bad number?** If nothing would change, the metric may not belong.

### Types of dashboard

| Type | Audience | Content |
|---|---|---|
| Strategic | Senior leaders | Few KPIs, monthly trends, targets |
| Operational | Team leads | Daily or real-time numbers, alerts |
| Analytical | Analysts and managers | Filters and drill-down for exploration |

Trying to serve all three on one page produces a cluttered dashboard that serves nobody well.

### Layout

People scan screens in a rough Z or F pattern starting at the top left. Use that:

\`\`\`text
+--------------------------------------------------+
| KPI: Revenue | KPI: Orders | KPI: AOV | KPI: Return % |
+--------------------------------------------------+
| Revenue trend vs target     | Revenue by channel      |
+-----------------------------+-------------------------+
| Top 10 products table       | Return rate by city     |
+--------------------------------------------------+
\`\`\`

Headline numbers at the top, trends in the middle, detail at the bottom. Keep to a single screen where possible; scrolling hides content.

### KPI cards with context

A number alone is meaningless. Each card should show a comparison: versus target, versus last period, or versus the same period last year, with a small arrow or colour to show direction. "Orders 12,400, 8% below target" is actionable; "Orders 12,400" is not.

### Filters, but not too many

Offer the filters users really need, typically date range, region and channel. Each extra filter adds confusion and increases the chance of users misreading a filtered view as the total. Show active filters clearly on the page.

### Performance and trust

A dashboard that takes thirty seconds to load will not be used. Pre-aggregate data, limit visuals per page to around eight, and schedule refreshes. Display "Data refreshed: 6 April, 7:00" prominently; stale data shown as current is one of the fastest ways to lose trust.

### Definitions on the page

Add an info icon or a notes panel with metric definitions from your metric dictionary. When someone asks what counts as an active customer, the answer should be one click away.

### Launch and iterate

Release a first version quickly to a few users, watch how they use it, and ask what decision they made with it last week. Remove visuals nobody uses. Track usage statistics if your BI tool provides them. A dashboard is a product, and the best ones evolve through feedback rather than being designed perfectly upfront.

### Tools

Power BI, Tableau and Looker Studio all support these principles. Power BI is the most common in Pakistani companies, Looker Studio is free and pairs well with Google Sheets and Google Analytics, and Tableau is popular in international analyst roles. The design thinking transfers between them.
      `,
        [
          q('What should a KPI card show alongside the number?', [
            'The SQL query behind the number',
            'A decorative icon for the metric',
            'A comparison such as target or last period',
            'The analyst\'s name and contact details',
          ], 2, 'A comparison tells the reader whether the number is good or bad.'),
          q('Why separate strategic and operational dashboards?', [
            'Each audience needs different metrics and refresh rates',
            'BI tools only allow one type per file',
            'Operational data cannot be shown as charts',
            'Senior leaders do not use dashboards',
          ], 0, 'Mixing audiences produces clutter that serves none of them well.'),
          q('Why display the last refresh time on a dashboard?', [
            'It is required by every BI tool',
            'It makes the dashboard load faster',
            'It replaces the need for a date filter',
            'Users can tell whether they are seeing current data',
          ], 3, 'Showing data freshness prevents stale numbers being mistaken for current ones.'),
        ]
      ),
      ],
      [
      q('Which chart best compares sales across fifteen product categories?', [
        'A pie chart with fifteen slices',
        'A line chart with fifteen points',
        'A 3D column chart',
        'A sorted horizontal bar chart',
      ], 3, 'Sorted bars allow accurate comparison of many categories with readable labels.'),
      q('A bar chart\'s axis starts at 95 to show values of 96 and 100. What is the problem?', [
        'The small difference looks far larger than it is',
        'The values are rounded incorrectly',
        'The chart should have used a pie instead',
        'Nothing, as long as the bars are labelled',
      ], 0, 'Bars must start at zero because their length represents the value.'),
      q('What is the best place for headline KPIs on a dashboard?', [
        'At the bottom, after the detail tables',
        'Hidden behind a filter panel',
        'Across the top of the page',
        'On a separate page from the charts',
      ], 2, 'Readers start scanning at the top, so headline numbers belong there.'),
      q('A dashboard is rarely used three months after launch. What should you do?', [
        'Add more charts and filters to it',
        'Rebuild it in a different BI tool',
        'Email it as a PDF each day instead',
        'Ask users what decisions they need it for and simplify',
      ], 3, 'Dashboards succeed by serving real decisions, which feedback reveals.'),
      ]
    ),
    chapter(
      'Business Analysis Methods',
      'Apply the methods analysts use on real business problems: read A/B test results correctly, build simple forecasts you can explain, find the root cause when a metric drops, and calculate the unit economics behind growth.',
      [
      lesson('A/B Tests and Reading Their Results', 14, `
An A/B test randomly splits users into two groups, shows each a different version, and compares outcomes. Because the split is random, any meaningful difference can be attributed to the change rather than to who the users were. It is the most reliable way to learn whether something works.

### The setup

| Element | Example |
|---|---|
| Hypothesis | Showing delivery time on the product page will raise conversion |
| Control (A) | Current product page |
| Variant (B) | Product page with "Delivered in 2 to 3 days" |
| Primary metric | Purchase conversion rate |
| Guardrail metrics | Return rate, average order value |
| Duration | Two full weeks |

Choose one primary metric before the test starts. Guardrail metrics make sure the change does not harm something else, such as raising conversion while increasing refunds.

### Reading the result

Suppose after two weeks:

| Group | Visitors | Purchases | Conversion |
|---|---|---|---|
| A | 24,000 | 720 | 3.00% |
| B | 24,000 | 816 | 3.40% |

B looks better, but is the difference real or random? A significance test answers that. In Python:

\`\`\`py
from statsmodels.stats.proportion import proportions_ztest
stat, p = proportions_ztest([816, 720], [24000, 24000])
print(round(p, 4))
\`\`\`

### p-values in plain words

The p-value is the probability of seeing a difference at least this large if the change had no real effect. A common threshold is 0.05. Here the p-value is about 0.013, below 0.05, so the result is statistically significant: random chance alone would rarely produce a gap this big.

Statistical significance is not the same as importance. A difference of 0.01 percentage points can be significant with millions of users and still not be worth building. Always report the size of the effect, ideally with a confidence interval: "Conversion rose by about 0.4 points, likely between 0.1 and 0.7."

### Common mistakes

1. **Stopping early.** Checking results daily and stopping when they look good inflates false positives. Decide the sample size or duration in advance.
2. **Too small a sample.** Small tests can only detect very large effects. Use a sample size calculator before launching.
3. **Testing many metrics.** With twenty metrics, one will look significant by chance. Commit to the primary metric.
4. **Ignoring weekly cycles.** Run tests for full weeks so weekdays and weekends are balanced.
5. **Unequal splits by accident.** If you planned 50/50 and got 53/47, check the randomisation for bugs before trusting anything.

### When you cannot test

Some changes cannot be randomised: a new national price, a change of courier for every order, a TV campaign. In those cases, compare before and after with care, use a similar region or product as a comparison group, and describe the result as evidence rather than proof.

### Writing up a test

A good test summary states the hypothesis, the dates, the sample sizes, the primary result with its range, guardrail results, and a recommendation. Record inconclusive tests too. Knowing that a change made no measurable difference prevents someone testing the same idea again next year.
      `,
        [
          q('Why are users assigned to A/B groups randomly?', [
            'To make the test finish faster',
            'So differences can be attributed to the change, not user type',
            'To give each user a fair chance of a discount',
            'Because analytics tools require it',
          ], 1, 'Random assignment balances other factors between the groups.'),
          q('What does a p-value of 0.013 indicate in an A/B test?', [
            'There is a 1.3% chance variant B is better',
            'The effect is large enough to matter',
            'The test should run for 13 more days',
            'A gap this big would rarely occur by chance alone',
          ], 3, 'A small p-value means the observed difference is unlikely if there were no real effect.'),
          q('Why is stopping a test as soon as results look good a mistake?', [
            'Tests must always last exactly one month',
            'Early results are always negative',
            'It inflates the chance of a false positive',
            'The control group needs more time than the variant',
          ], 2, 'Repeated peeking with early stopping makes random swings look significant.'),
        ]
      ),
      lesson('Simple Forecasting You Can Defend', 13, `
Forecasting estimates future values, such as next quarter's sales or next month's support tickets. Analysts are often asked for forecasts to plan stock, staff and budgets. Simple methods, explained clearly, usually beat complex ones that nobody understands.

### Start with a baseline

Every forecast should be compared against a simple baseline:

| Method | Forecast for next month | Good when |
|---|---|---|
| Naive | Same as this month | Stable series |
| Seasonal naive | Same month last year | Strong yearly pattern |
| Moving average | Average of last 3 months | Noisy but level series |
| Growth rate | Last year's same month times growth | Steady growth plus seasonality |

If a sophisticated model cannot beat the seasonal naive method on past data, use the simple method.

### Growth plus seasonality

A practical approach for many businesses:

\`\`\`text
Forecast for Eid month 2027 =
  Eid month 2026 sales x (1 + recent year-on-year growth)

Eid month 2026 sales = PKR 62M
Last 6 months YoY growth = 18%
Forecast = 62 x 1.18 = PKR 73.2M
\`\`\`

It captures both the seasonal peak and the growth trend, and anyone in the room can follow the logic.

### Trend lines

For steadily growing series without strong seasonality, a linear trend fits well:

\`\`\`py
import numpy as np
x = np.arange(len(monthly))
slope, intercept = np.polyfit(x, monthly["revenue"], 1)
next_value = slope * len(monthly) + intercept
\`\`\`

In Excel, FORECAST.LINEAR does the same, and FORECAST.ETS adds seasonality automatically.

### Always give a range

A single number implies false precision. Give a range based on how wrong past forecasts were:

"Next quarter revenue: PKR 140M, likely between 128M and 152M."

One simple way to set the range is to backtest: forecast each of the last twelve months using only data available before it, measure the typical percentage error, and apply it to the new forecast.

### Measuring accuracy

Mean absolute percentage error, MAPE, is the most understandable accuracy measure:

| Month | Forecast | Actual | Absolute % error |
|---|---|---|---|
| Jan | 40 | 42 | 4.8% |
| Feb | 38 | 35 | 8.6% |
| Mar | 45 | 46 | 2.2% |

MAPE here is about 5.2%. Tracking it monthly shows whether your method is getting better or worse, and builds credibility.

### Assumptions in writing

Forecasts depend on assumptions: no major price changes, a similar marketing budget, no supply disruption. Write them down next to the number. When reality differs, the assumptions explain why, and the conversation becomes "the budget was cut" rather than "the analyst was wrong".

### Scenarios

When uncertainty is high, present three scenarios instead of one forecast: a low case, a base case and a high case, each tied to a clear assumption. "If the new courier contract cuts delivery time by a day, the high case applies." Scenarios help leaders plan for several futures rather than betting on one.
      `,
        [
          q('What is a seasonal naive forecast?', [
            'Using the same period last year as the forecast',
            'Using the average of all past months',
            'Using a machine learning model for each season',
            'Doubling last month\'s value',
          ], 0, 'It repeats last year\'s value for the same period, capturing seasonality simply.'),
          q('Why give a forecast as a range rather than one number?', [
            'Ranges are easier to calculate',
            'Managers prefer larger numbers',
            'A single number is not allowed in reports',
            'A single number implies more precision than exists',
          ], 3, 'Ranges communicate the real uncertainty in any forecast.'),
          q('What does backtesting a forecasting method involve?', [
            'Forecasting only the next week',
            'Forecasting past periods using only earlier data and measuring errors',
            'Testing the forecast on a different company\'s data',
            'Removing outliers from the history',
          ], 1, 'Backtests show how accurate a method would have been in practice.'),
        ]
      ),
      lesson('Root Cause Analysis When a Metric Drops', 14, `
One of the most common and urgent requests an analyst receives is "our numbers dropped, why?" A structured approach finds the cause faster and avoids blaming the wrong thing.

### Step 1: Is the drop real?

Before investigating the business, rule out the data:

- Did a tracking tag break, or an app release stop sending events?
- Is the data complete for the latest day, or still loading?
- Did a definition, filter or source change?
- Is it a calendar effect such as a holiday or a shorter month?

A surprising share of "drops" turn out to be data problems. Checking a second, independent source, such as payment gateway totals against website orders, settles this quickly.

### Step 2: Size and timing

Pin down exactly how big the drop is and when it started. A sudden step change on one date suggests a specific event like a release, an outage or a price change. A gradual slide suggests competition, seasonality or slowly worsening service.

### Step 3: Decompose the metric

Break the metric into its components. Revenue, for example:

\`\`\`text
Revenue = Visitors x Conversion rate x Average order value
\`\`\`

| Component | Last month | This month | Change |
|---|---|---|---|
| Visitors | 410,000 | 402,000 | -2% |
| Conversion | 2.6% | 2.1% | -19% |
| AOV | PKR 3,300 | PKR 3,320 | +1% |

Revenue fell about 20%, and almost all of it came from conversion. The investigation now focuses on why fewer visitors bought.

### Step 4: Segment

Split the component that moved by the usual dimensions: device, channel, city, product category, new versus returning customers, payment method. Look for the segment where the change is concentrated:

| Device | Conversion before | After |
|---|---|---|
| Desktop | 3.1% | 3.0% |
| App | 3.4% | 3.3% |
| Mobile web | 2.0% | 1.1% |

Mobile web nearly halved while other devices barely moved.

### Step 5: Find the event

Line up the timing with known changes: deployments, campaigns, pricing updates, payment provider issues, stock-outs, competitor promotions. Ask engineering, marketing and operations what changed around that date. In this example, a checkout redesign launched for mobile web on the same day.

### Step 6: Confirm and quantify

Confirm the cause with evidence, such as error logs showing payment failures on mobile web, and estimate its cost: "The mobile checkout issue cost around 3,500 orders, roughly PKR 11.6 million, over 12 days."

### The issue tree

For complex problems, draw an issue tree: the metric at the top, its components below, and segments below those. It keeps the investigation systematic and shows stakeholders what you have ruled out.

### Communicate early

Share a short update as soon as you have Step 1 and 2 answers, even before the full cause is known. Leaders would rather hear "the drop is real, started on 14 March and is concentrated in mobile web" within an hour than a perfect report three days later.
      `,
        [
          q('What should you check first when a metric suddenly drops?', [
            'Which competitor caused the drop',
            'How to present the drop to leadership',
            'Whether a tracking or data problem explains it',
            'Which team should be blamed',
          ], 2, 'Many apparent drops are caused by broken tracking or incomplete data.'),
          q('Revenue fell, and conversion fell 19% while visitors and AOV barely moved. Where should you focus?', [
            'Visitor acquisition campaigns',
            'Why fewer visitors are buying',
            'Raising average order value',
            'The accuracy of the revenue table',
          ], 1, 'Decomposition shows conversion drove the drop, so that is where to investigate.'),
          q('A sudden step change on one exact date most likely points to what?', [
            'Gradual competition from new rivals',
            'Normal seasonal variation',
            'Slowly worsening customer service',
            'A specific event such as a release or outage',
          ], 3, 'Abrupt changes usually have a specific trigger on that date.'),
        ]
      ),
      lesson('Unit Economics: CAC, LTV and Margin', 13, `
Unit economics asks whether each customer or each order makes money. A business can grow fast and still lose money on every sale. Analysts who understand unit economics can judge whether growth is healthy.

### Contribution margin per order

Start with what one order really earns after the costs it directly causes:

| Item | PKR |
|---|---|
| Order value | 3,500 |
| Cost of goods | -1,900 |
| Delivery cost | -250 |
| Payment fees | -70 |
| Packaging | -40 |
| Expected returns cost | -120 |
| **Contribution margin** | **1,120** |

The contribution margin of PKR 1,120, or 32%, is what each order contributes towards rent, salaries and profit. For cash-on-delivery orders, include the cost of refused deliveries, which can be substantial.

### Customer acquisition cost

CAC is what it costs to gain one new paying customer:

\`\`\`text
CAC = marketing and sales spend in a period / new customers in that period
CAC = PKR 1,200,000 / 800 = PKR 1,500
\`\`\`

Calculate CAC by channel. Blended CAC can look fine while one channel is wildly expensive.

### Lifetime value

LTV estimates the total contribution margin a customer brings over their relationship with you:

\`\`\`text
LTV = margin per order x orders per year x expected years
LTV = 1,120 x 3 x 2 = PKR 6,720
\`\`\`

Use contribution margin, not revenue. An LTV based on revenue overstates value, sometimes by several times. Cohort retention data from earlier in the course gives realistic figures for orders per year and years retained.

### The LTV to CAC ratio

| LTV / CAC | Interpretation |
|---|---|
| Below 1 | Losing money on every customer |
| 1 to 3 | Thin; may struggle to cover fixed costs |
| Around 3 or more | Generally healthy |
| Very high | Possibly under-investing in growth |

Here 6,720 / 1,500 is about 4.5, which suggests room to spend more on acquisition, especially in efficient channels.

### Payback period

Payback period is how long a customer takes to repay their acquisition cost:

\`\`\`text
Monthly margin per customer = 1,120 x 3 / 12 = 280
Payback = 1,500 / 280 = about 5.4 months
\`\`\`

Shorter payback means cash returns faster, which matters greatly for businesses with limited funding. Many investors look for payback within twelve months.

### Common traps

1. **Using revenue instead of margin** inflates LTV.
2. **Ignoring discounts** in first orders understates true CAC.
3. **Assuming retention** from a few good months rather than measured cohorts.
4. **Counting organic customers** in CAC, which makes paid channels look cheaper than they are.

### Using unit economics in decisions

Unit economics turn vague debates into concrete ones. "Should we offer free delivery above PKR 2,500?" becomes a calculation: the extra delivery cost per order against the expected rise in order value and conversion. Analysts who frame proposals this way quickly become trusted advisors rather than report producers.
      `,
        [
          q('Why should LTV be based on contribution margin rather than revenue?', [
            'Revenue data is usually unavailable',
            'Margin is easier to calculate than revenue',
            'Revenue ignores the costs of serving each order',
            'Investors do not understand revenue',
          ], 2, 'Only the margin left after direct costs represents value the customer adds.'),
          q('CAC is PKR 1,500 and LTV is PKR 6,720. What does this suggest?', [
            'Acquisition is efficient, with room to invest more',
            'The business loses money on every customer',
            'Marketing spend should be cut immediately',
            'Customers repay their cost within one week',
          ], 0, 'A ratio around 4.5 indicates healthy returns on acquisition spending.'),
          q('Why calculate CAC separately for each channel?', [
            'Each channel uses a different currency',
            'Blended CAC is not allowed in reports',
            'Channels always have identical costs',
            'A healthy blended figure can hide one expensive channel',
          ], 3, 'Channel-level CAC shows where acquisition money is working and where it is not.'),
        ]
      ),
      ],
      [
      q('An A/B test result is significant but the effect is tiny. What should you report?', [
        'Only that the result is significant',
        'The effect size with a range, so its value can be judged',
        'That the test failed',
        'Nothing until a larger test runs',
      ], 1, 'Significance shows an effect is likely real; size shows whether it matters.'),
      q('Which formula decomposes revenue for root cause analysis?', [
        'Revenue = Profit minus Costs',
        'Revenue = Customers divided by Orders',
        'Revenue = Visitors x Conversion x Average order value',
        'Revenue = Returns plus Refunds',
      ], 2, 'Breaking revenue into these drivers shows which one moved.'),
      q('A complex forecasting model cannot beat the seasonal naive method on past data. What should you do?', [
        'Use the complex model anyway',
        'Stop forecasting altogether',
        'Average the two methods together',
        'Use the simpler method',
      ], 3, 'Complexity is only worth it when it improves accuracy.'),
      q('A business grows quickly but its LTV to CAC ratio is below 1. What does this mean?', [
        'Growth is healthy and should accelerate',
        'Customers are extremely loyal',
        'Each new customer costs more than they return',
        'Marketing spend is too low',
      ], 2, 'A ratio below 1 means acquisition destroys value, so faster growth loses more money.'),
      ]
    ),
    chapter(
      'Communicating Insights',
      'Turn analysis into influence: structure findings as a story with a clear point, write short insight memos, present to non-technical audiences with confidence, and respond to pushback and uncertainty without losing credibility.',
      [
      lesson('Structuring a Data Story', 13, `
An analysis only creates value when someone acts on it. Most analysts present findings in the order they did the work: data, method, results, and finally a conclusion. Audiences need the opposite order.

### Lead with the answer

The pyramid principle, used widely in consulting, puts the main point first, then the supporting arguments, then the evidence:

\`\`\`text
Main point: Move 20% of Instagram budget to Google search.
  Support 1: Search customers cost 38% less to acquire.
  Support 2: Their first orders are 23% smaller, a gap the lower cost outweighs.
  Support 3: Search capacity is not yet saturated.
    Evidence: charts, tables, method notes
\`\`\`

A busy reader who stops after one sentence still gets the message. A reader who wants proof can keep going.

### Situation, complication, resolution

A simple story structure that works for most findings:

| Part | Purpose | Example |
|---|---|---|
| Situation | Shared context everyone agrees on | We spend PKR 400,000 a month on Instagram ads |
| Complication | What changed or what is wrong | Cost per customer rose 45% since January |
| Resolution | What you recommend | Shift 20% to search and retest in June |

This creates natural tension and makes the recommendation feel like the answer to a real problem rather than a list of observations.

### From observation to insight

An observation states a fact. An insight explains why it matters and what to do:

| Observation | Insight |
|---|---|
| Returns are 14% in Hyderabad | Hyderabad returns are double average, mostly wrong sizes on kurtas, so a size guide could save PKR 900,000 a quarter |
| App users buy more often | App users buy 2.1 times a month versus 1.3 on web, so app install prompts after a first order are worth testing |

Push every finding until it answers "so what?" If you cannot answer that, the finding may not belong in the presentation.

### Choose three points, not twelve

Analysis produces many interesting facts. Presenting all of them dilutes the important ones. Pick the two or three findings that matter most for the decision and move the rest to an appendix. Leaving out good work is hard, but it is what makes the remaining points land.

### Know your audience

Adjust depth and vocabulary:

- **Executives** want the decision, the impact in rupees, and the risk.
- **Managers** want what changes for their team and when.
- **Technical colleagues** want the method and the caveats.

The same analysis may need three versions: a one-line summary, a one-page memo and a detailed appendix.

### Quantify impact

Translate results into the language of the business, usually money, time or customers. "Conversion improved 0.4 points" is abstract. "The change would add about 1,300 orders and PKR 4.3 million in revenue per quarter" gets attention and makes comparison with other priorities possible.

### End with a clear ask

Finish with exactly what you need: a decision, a budget, a test approval, or data access. "Please approve a four-week test starting 1 May" is far more likely to happen than "let me know your thoughts".
      `,
        [
          q('According to the pyramid principle, what comes first?', [
            'The data sources used',
            'The method and its assumptions',
            'The main point or recommendation',
            'A list of every finding',
          ], 2, 'Leading with the answer serves readers who stop early.'),
          q('What turns an observation into an insight?', [
            'Adding more decimal places to the numbers',
            'Explaining why it matters and what to do about it',
            'Showing it in a more colourful chart',
            'Repeating it several times in the presentation',
          ], 1, 'Insights connect facts to consequences and actions.'),
          q('How should you end a presentation of findings?', [
            'With a summary of the data sources',
            'With an open invitation for any thoughts',
            'With the most complex chart you made',
            'With a specific ask, such as a decision or approval',
          ], 3, 'A specific request tells the audience exactly what decision or action is needed next.'),
        ]
      ),
      lesson('Writing an Insight Memo', 13, `
A short written memo is often more effective than a slide deck. It can be read in two minutes, forwarded without the presenter, and kept as a record of what was found and decided.

### The one-page format

\`\`\`text
Subject: Recommendation: add size guide for kurtas to cut returns

Summary
Kurta returns cost PKR 3.6M last quarter. 61% of these were for wrong
size. A size guide and fit notes on the product page could cut size
returns by a third, saving about PKR 0.7M per quarter. I recommend a
four-week A/B test on kurta pages starting 1 May.

Findings
1. Kurtas have a 19% return rate versus 8% for other categories.
2. Wrong size is the reason for 61% of kurta returns.
3. Similar retailers report 25 to 40% fewer size returns after adding
   size guides.

Recommendation and next steps
Run an A/B test on kurta pages for four weeks. Success = size-related
return rate down by at least 20% with no fall in conversion.

About the data
Orders and returns, 1 Jan to 31 Mar 2026. Return reasons are chosen
by customers and may be imprecise.
\`\`\`

### Writing principles

- **Put the summary first** and make it complete on its own. Many readers stop there.
- **Use numbered findings**, each starting with the point, followed by evidence.
- **Write short sentences** and remove jargon. "Statistically significant uplift in CVR" becomes "more visitors bought".
- **Use specific numbers**, rounded sensibly. "Nearly a fifth" or "19%" both beat "a significant proportion".
- **Include one or two charts** at most, each with an action title.

### Subject lines that work

The subject line is the first and sometimes only thing read. Make it state the conclusion:

| Weak | Strong |
|---|---|
| Returns analysis | Size guide could cut kurta returns by a third |
| Q1 report | Q1 revenue beat target by 6%, led by Karachi |
| Data update | Checkout issue cost about 3,500 mobile orders |

### Precise language

Choose words that match the strength of your evidence:

| Evidence | Language |
|---|---|
| A/B test result | "The change increased conversion by..." |
| Strong correlation, plausible mechanism | "is strongly associated with..." |
| Early or small sample | "early signs suggest..." |
| Speculation | "one possible explanation is..." |

Overstating evidence damages trust when results do not hold. Understating hides useful findings.

### Editing

Write a first draft quickly, then cut it by a third. Remove sentences that describe your process unless the reader needs them, words like "very" and "basically", and findings that do not support the recommendation. Read it aloud; awkward sentences become obvious.

### Ask someone to review

Before sending, give the memo to a colleague who knows nothing about the project and ask them to explain back the main point. If they cannot do it in one sentence, the summary needs work.

### Keep a record

Store memos in a shared folder or wiki. Six months later, when someone asks why the size guide was introduced or why a test was abandoned, the memo answers instantly. A library of past memos is also excellent material for your portfolio, once confidential details are removed.
      `,
        [
          q('Why should the summary section of a memo be complete on its own?', [
            'It is the only section managers are allowed to read',
            'Memos cannot include a findings section',
            'Many readers stop after the summary',
            'It replaces the need for a subject line',
          ], 2, 'A self-contained summary ensures busy readers still get the message.'),
          q('Which subject line is strongest?', [
            'Returns analysis',
            'Data update for this week',
            'Q1 report attached',
            'Size guide could cut kurta returns by a third',
          ], 3, 'A subject line that states the conclusion delivers value before the email is opened.'),
          q('Your evidence is a small early sample. Which wording fits?', [
            'Early signs suggest the change helps',
            'The change proved to increase sales',
            'The change definitely caused the increase',
            'The change is guaranteed to work',
          ], 0, 'Language should match the strength of the evidence.'),
        ]
      ),
      lesson('Presenting to Non-Technical Audiences', 13, `
Presenting findings to managers, founders or clients is where analysis turns into decisions. Many talented analysts struggle here, not because their work is weak but because they present it like analysts.

### One message per slide

Each slide should make one point, stated in its title. The chart or table below supports that point. A slide titled "Data" with three charts asks the audience to do the analysis themselves.

\`\`\`text
Slide title: Mobile web lost half its buyers at payment after 14 March
Chart:       Conversion by device, daily, with a line on 14 March
Note:        Desktop and app unchanged
\`\`\`

### Structure of a short presentation

| Slide | Content |
|---|---|
| 1 | The recommendation and its impact |
| 2 | The problem or opportunity |
| 3 to 5 | Key findings, one per slide |
| 6 | Recommendation, next steps, the ask |
| Appendix | Method, definitions, extra detail |

For a ten-minute slot, aim for about six main slides. The appendix handles detailed questions without cluttering the story.

### Explain charts out loud

Never assume a chart speaks for itself. Walk the audience through it:

1. Say what the chart shows: "This is conversion rate by day for each device."
2. Explain how to read it: "Each line is a device; the dotted line is the release date."
3. Point to the insight: "Notice mobile web drops sharply here, while the others stay flat."

It takes twenty seconds and prevents half the room from looking at the wrong thing.

### Avoid jargon

Replace technical terms with everyday language:

| Technical | Plain |
|---|---|
| Statistically significant at p < 0.05 | Very unlikely to be chance |
| Cohort retention curve | How many customers keep buying over time |
| Median | The typical order |
| Confidence interval | The likely range |
| Fan-out in a join | Some orders were counted twice |

You can still be accurate. Plain language is a sign of understanding, not of oversimplification.

### Handling questions

When asked something you cannot answer, say so and commit to a follow-up: "I do not have that split with me; I will send it by tomorrow." Guessing in the moment and being wrong is far more damaging than a short delay.

### Practise

Rehearse at least once aloud, ideally with a colleague, and time yourself. Most presentations run longer than planned. Prepare answers for the three questions you most expect, such as "how reliable is this?", "what does it cost?" and "what happens if we do nothing?"

### Presenting remotely

Many presentations now happen on Zoom, Google Meet or Teams. Share only the slide window, not your whole screen with notifications. Pause more often to ask for questions, since you cannot read the room. Send the slides or memo afterwards so people can revisit the numbers.

### Confidence without arrogance

Speak as the person who knows the data best, because you are. Equally, acknowledge what you do not know and where the data is weak. Leaders trust analysts who are clear, calm and honest about limits, and those analysts are invited back to the meetings where decisions are made.
      `,
        [
          q('What should each slide\'s title contain?', [
            'The name of the dataset used',
            'The date of the presentation',
            'The single point the slide makes',
            'The type of chart shown',
          ], 2, 'An insight title tells the audience what to take from the slide.'),
          q('How should "statistically significant at p < 0.05" be phrased for a general audience?', [
            'Mathematically certain to be true',
            'Very unlikely to be due to chance',
            'Significant for the business',
            'Proven beyond any doubt',
          ], 1, 'Plain language keeps the meaning accurate without jargon.'),
          q('You are asked a question you cannot answer during a presentation. What is best?', [
            'Give your best guess confidently',
            'Change the subject quickly',
            'Say the data cannot answer it',
            'Say you will find out and follow up by a set time',
          ], 3, 'A prompt, accurate follow-up protects credibility far better than a wrong guess.'),
        ]
      ),
      lesson('Handling Pushback and Uncertainty', 13, `
Findings that challenge assumptions often meet resistance. A manager may doubt your numbers, a team may feel blamed, or someone may simply prefer a different conclusion. How you respond determines whether the analysis leads anywhere.

### Expect pushback and prepare

Before presenting, list the objections people are likely to raise and prepare evidence:

| Likely objection | Preparation |
|---|---|
| "Your numbers don't match mine" | Reconcile with their source in advance |
| "That's just one month" | Show the longer period or several cohorts |
| "Correlation isn't causation" | Be clear about evidence type; propose a test |
| "Our city is different" | Show the segment view for their city |
| "We tried that before" | Ask what happened and how it was measured |

Meeting the main finance or operations stakeholder privately before a big meeting avoids surprises in front of senior leaders.

### When numbers do not match

Mismatched figures are the most common challenge. Respond with curiosity, not defensiveness:

1. Ask which source and filters they used.
2. Compare definitions: gross or net revenue, order date or payment date, with or without returns.
3. Reconcile the gap step by step until it is explained.

Usually both numbers are correct for different definitions. Resolving it calmly, and adding the definition to the metric dictionary, builds trust in your work.

### Separating the analysis from the person

When findings reflect badly on a team, such as rising complaints in one branch, frame them around processes and data, not people. "Late deliveries rose after the courier change" invites problem solving. "The operations team failed" invites defence and denial.

### Communicating uncertainty

Uncertainty does not make analysis useless; hiding it does. Explain it in practical terms:

- **Ranges**: "Between PKR 6M and 9M, most likely around 7.5M."
- **Confidence levels**: "We are fairly confident in the direction, less sure about the size."
- **What would change the conclusion**: "If returns in April stay above 15%, this recommendation no longer holds."

Decision makers handle uncertainty every day. What they need from you is an honest sense of how much to rely on the number.

### Admitting mistakes

Every analyst eventually makes an error that reaches a stakeholder. When it happens, correct it quickly and openly: what was wrong, the corrected figure, whether the conclusion changes, and what you have done to prevent a repeat. Analysts who own mistakes promptly keep their credibility; those who hide them lose it permanently when the error surfaces.

### When the decision goes the other way

Sometimes leaders decide against your recommendation for reasons beyond the data: strategy, relationships, timing or risk appetite. That is their role. Record your recommendation, offer to measure the outcome of the chosen path, and stay professional. Measuring results objectively, whichever option was chosen, is what makes the next analysis more influential.

### Saying "I don't know"

"The data cannot tell us that yet" is a legitimate and valuable answer, especially when followed by how to find out: a test, a survey or more time. Analysts who are comfortable saying it are trusted more when they do give firm answers.
      `,
        [
          q('A manager says your revenue number does not match theirs. What should you do first?', [
            'Insist your number is correct',
            'Quietly change your number to match',
            'Compare sources, filters and definitions to reconcile the gap',
            'Remove the number from the report',
          ], 2, 'Most mismatches come from different definitions and can be reconciled calmly.'),
          q('How should findings about a struggling team be framed?', [
            'Around processes and data rather than people',
            'As the personal failure of the team lead',
            'Without any numbers to avoid upsetting anyone',
            'Only in private messages to senior leaders',
          ], 0, 'Process framing invites solutions instead of defensiveness.'),
          q('You find an error in a report already shared with stakeholders. What should you do?', [
            'Wait to see if anyone notices',
            'Fix it silently in the next version',
            'Blame the data source publicly',
            'Correct it openly and explain whether the conclusion changes',
          ], 3, 'Prompt, transparent correction preserves long-term credibility.'),
        ]
      ),
      ],
      [
      q('Which order works best for presenting findings to a busy executive?', [
        'Data sources, method, results, conclusion',
        'Recommendation, key supporting findings, then evidence',
        'All charts first, then a discussion',
        'Caveats first, then results',
      ], 1, 'Leading with the answer respects limited attention and still allows deeper reading.'),
      q('Why move most findings to an appendix?', [
        'Appendices are read more carefully',
        'Executives prefer long presentations',
        'Too many points dilute the ones that matter',
        'Charts are not allowed in the main section',
      ], 2, 'Focusing on two or three findings makes them land.'),
      q('What is the best way to express an uncertain estimate?', [
        'A single precise number to sound confident',
        'Refuse to give any estimate',
        'Say the data is unreliable',
        'Give a range and say what would change the conclusion',
      ], 3, 'Ranges and conditions give decision makers an honest basis for action.'),
      q('Leaders choose against your recommendation. What is the most professional response?', [
        'Repeat the analysis until they agree',
        'Withdraw from the project',
        'Share your disagreement with other teams',
        'Record your view and offer to measure the chosen option\'s results',
      ], 3, 'Objectively measuring outcomes builds influence for future analyses.'),
      ]
    ),
    chapter(
      'Getting Hired as a Data Analyst',
      'Build a portfolio from public data that proves your skills, write a CV and LinkedIn profile that pass screening, prepare for SQL tests and case interviews, and find remote and freelance analyst work from Pakistan.',
      [
      lesson('Building a Portfolio From Public Data', 13, `
For entry-level analyst roles, a portfolio often matters more than a degree. It shows employers that you can take messy data, ask a sensible question, and communicate an answer. Three strong projects beat ten copied tutorials.

### What makes a strong project

| Weak project | Strong project |
|---|---|
| Titanic survival, as done by thousands | A question tied to a real business or public issue |
| Code only, no explanation | A clear summary of question, findings and recommendation |
| Perfectly clean tutorial dataset | Real data that needed cleaning, with the steps documented |
| Dozens of charts | Three to five charts with action titles |
| No conclusion | A specific recommendation and its limits |

### Where to find data

- **Kaggle datasets**, filtered to recent uploads with real business data such as e-commerce orders or app reviews.
- **World Bank Open Data** and **UN data** for development, health and economic questions.
- **Pakistan Bureau of Statistics** publications for local economic and population data.
- **Google Dataset Search** for almost any topic.
- **Your own data**, such as scraping public product prices or collecting survey responses, which makes a project unique.

### A balanced set of three

Aim to show the full range of analyst skills:

1. **A SQL project**: load an e-commerce dataset into PostgreSQL or SQLite, answer five business questions with queries, and present results. Show joins, CTEs and window functions.
2. **A dashboard project**: build a Power BI or Tableau dashboard on sales or operational data, with KPI cards, trends and filters, published publicly where possible.
3. **A Python analysis**: a notebook that cleans a messy dataset, explores it, and ends with a written recommendation. A cohort or funnel analysis is especially impressive.

### Project structure

Present each project the same way, in a GitHub README or a portfolio page:

\`\`\`text
Title: What drives late deliveries for a Pakistani e-commerce store?
Question: Which factors predict deliveries arriving after 5 days?
Data: 98,000 orders, Kaggle, cleaned (log included)
Tools: SQL, pandas, Power BI
Key findings:
  1. Late rate is 3x higher for orders placed Friday after 6 p.m.
  2. Two courier hubs account for 41% of late deliveries.
Recommendation: Rebalance weekend dispatch and audit the two hubs.
Limitations: No data on weather or courier staffing.
\`\`\`

A recruiter should understand the project in thirty seconds from this summary alone.

### Where to publish

- **GitHub** for code, SQL files and notebooks, with a clear README.
- **Tableau Public** or a published Power BI report for dashboards.
- **A simple portfolio page**, even a free Notion or GitHub Pages site, linking everything together.
- **LinkedIn posts** summarising each project with one chart, which often reach recruiters directly.

### Avoid common mistakes

Do not copy a project from a tutorial and present it as your own; interviewers recognise popular datasets and will ask detailed questions. Do not hide behind complexity: a clear analysis with simple methods is more impressive than a confusing machine learning model. And proofread everything, because spelling mistakes in a portfolio suggest carelessness with data too.

### Keep improving

Revisit projects as your skills grow. Add a better chart, a cleaner query or a sharper recommendation. A portfolio is a living document, and the improvements themselves show progress to employers.
      `,
        [
          q('What usually makes a portfolio project stand out?', [
            'Using the most popular tutorial dataset',
            'Including as many charts as possible',
            'A real question, documented cleaning and a clear recommendation',
            'Code with no written explanation',
          ], 2, 'Employers want evidence of end-to-end analyst thinking, not just code.'),
          q('Which set of three projects best shows analyst skills?', [
            'A SQL project, a dashboard and a Python analysis',
            'Three dashboards using the same dataset',
            'Three Kaggle tutorial notebooks',
            'Three machine learning models',
          ], 0, 'A balanced set demonstrates querying, visualisation and analysis.'),
          q('Why should a project README include a short summary of findings?', [
            'GitHub requires a summary to publish',
            'It makes the repository larger',
            'It replaces the need for any code',
            'Recruiters can understand the project in seconds',
          ], 3, 'Busy reviewers judge projects quickly from the summary.'),
        ]
      ),
      lesson('CV and LinkedIn for Analyst Roles', 12, `
Many applications are screened in seconds, first by software and then by a recruiter. Your CV and LinkedIn profile must make it easy to see that you can do the job.

### CV structure

Keep it to one page for entry-level roles:

| Section | Content |
|---|---|
| Header | Name, city, email, phone, LinkedIn, portfolio link |
| Summary | Two lines on who you are and what you do |
| Skills | SQL, Excel, Power BI or Tableau, Python, statistics |
| Projects | Two or three portfolio projects with results |
| Experience | Jobs or internships, framed around data work |
| Education | Degree, relevant courses and certificates |

Put projects above experience if your experience is not related to data.

### Write achievements, not duties

Recruiters care about what you achieved. Use action verbs and numbers:

| Duty | Achievement |
|---|---|
| Responsible for weekly sales report | Automated weekly sales report with SQL and Power BI, saving 6 hours a week |
| Worked on customer data | Cleaned 120,000 customer records, removing 8% duplicates before a CRM migration |
| Did analysis for marketing | Found two campaigns with 3x higher cost per customer; budget was reallocated |

Even non-analyst jobs contain data work. A shop job where you tracked stock in Excel, or a teaching role where you analysed exam results, can be described this way.

### Keywords and applicant tracking systems

Many companies use software to filter CVs. Mirror the language of the job advert: if it says "Power BI" and "stakeholder management", use those exact terms where they are true. Avoid tables, columns and graphics in the CV itself, as they confuse some parsing systems. A clean single-column layout in a standard font is safest.

### LinkedIn profile

- **Headline**: more than a job title. "Data Analyst | SQL, Power BI, Python | Turning sales data into decisions".
- **About**: a short paragraph on what you do, the problems you like solving and links to your projects.
- **Featured section**: pin your best portfolio projects and dashboards.
- **Skills**: add the main tools and ask colleagues or classmates for endorsements.
- **Open to work**: set your preferences, including remote roles, so recruiters can find you.

### Certificates

Certificates help you get past filters and show commitment, especially when you lack a related degree. Commonly recognised options include the Google Data Analytics Certificate, Microsoft's PL-300 for Power BI, and Tableau certifications. Pair them with projects; a certificate without a portfolio rarely gets interviews.

### Tailor each application

Send fewer, better applications. For each role, adjust the summary and reorder skills to match the advert, and mention one specific thing about the company in a short cover message. Twenty tailored applications usually beat two hundred identical ones.

### Networking

Many analyst jobs are filled through referrals. Comment thoughtfully on posts from analysts and hiring managers, share your projects, join local data communities and meetups in Lahore, Karachi and Islamabad, and ask people for short informational chats rather than jobs directly. A warm introduction moves your CV to the top of the pile.
      `,
        [
          q('Which CV line is written as an achievement?', [
            'Responsible for the weekly sales report',
            'Worked on customer data tasks',
            'Automated the weekly report, saving 6 hours a week',
            'Helped the team with analysis',
          ], 2, 'Achievements show measurable results rather than listing duties.'),
          q('Why avoid tables and multi-column layouts in a CV?', [
            'Some applicant tracking systems cannot read them correctly',
            'Recruiters dislike any formatting at all',
            'They make the CV longer than one page',
            'Tables are not allowed in PDF files',
          ], 0, 'Simple layouts parse reliably in automated screening software.'),
          q('What is the best way to use certificates when job hunting?', [
            'List as many certificates as possible instead of projects',
            'Leave them off the CV entirely',
            'Only mention them in interviews',
            'Pair them with portfolio projects that prove the skills',
          ], 3, 'Certificates open doors, but projects show you can do the work.'),
        ]
      ),
      lesson('SQL Tests and Case Interviews', 14, `
Analyst interviews usually combine a technical test, often SQL, with a business case or take-home task, plus behavioural questions. Each can be prepared for systematically.

### Typical interview stages

| Stage | What it tests |
|---|---|
| Recruiter screen | Basic fit, salary expectations, communication |
| SQL or Excel test | Querying and data handling under time pressure |
| Case or take-home | Analytical thinking and communication |
| Hiring manager interview | Problem solving and team fit |
| Final round | Presentation of take-home, culture fit |

### SQL tests

Common question types, in rough order of frequency:

1. Aggregation with GROUP BY and HAVING.
2. Joins, including finding rows with no match.
3. Window functions: ranking, running totals, previous values.
4. Date handling: monthly totals, retention, time between events.
5. Deduplication: latest record per key.

A classic example: "Find the top two products by revenue in each category."

\`\`\`sql
WITH ranked AS (
  SELECT category, product, SUM(amount) AS revenue,
         RANK() OVER (PARTITION BY category ORDER BY SUM(amount) DESC) AS rnk
  FROM sales
  GROUP BY category, product
)
SELECT category, product, revenue
FROM ranked
WHERE rnk <= 2;
\`\`\`

During live tests, think aloud. Clarify assumptions first: "Should ties both appear? Are cancelled orders excluded?" Interviewers value clear reasoning as much as the final query.

### Practising SQL

Practise daily for a few weeks on platforms like LeetCode's database problems, HackerRank, StrataScratch or DataLemur, which have real interview questions. Time yourself, then review cleaner solutions after each attempt.

### Case interviews

A case question gives a business problem and asks how you would approach it: "Orders in our app fell 15% last month. How would you investigate?" Use the frameworks from this course:

1. **Clarify** the metric, period and any known changes.
2. **Check the data** for tracking issues.
3. **Decompose** orders into users and orders per user, or into the funnel steps.
4. **Segment** by platform, city, new versus returning, and channel.
5. **Hypothesise** causes and say how you would test each.
6. **Recommend** next steps.

Structure matters more than reaching a single right answer.

### Take-home assignments

You receive a dataset and a few days to analyse it. Treat it like a real project: state assumptions, document cleaning, keep the analysis focused on the question, and deliver a short written summary or a few slides. Do not spend thirty hours; a clean, well-communicated answer in six to eight hours is what most companies expect.

### Behavioural questions

Prepare stories using the STAR structure, situation, task, action and result, for common prompts:

- A time you found an error in data.
- A time a stakeholder disagreed with your findings.
- A time you had to learn a new tool quickly.
- A time you explained something technical to a non-technical person.

Your portfolio projects and university or job experiences can supply these stories.

### Questions to ask them

End by asking good questions: "What does a typical week look like for this role?", "Which tools and data sources does the team use?", "How do analysts work with decision makers here?" Thoughtful questions show genuine interest and help you judge whether the job suits you.
      `,
        [
          q('What should you do first in a live SQL test?', [
            'Start typing the longest query you can',
            'Clarify assumptions such as ties and exclusions',
            'Ask to skip to the next question',
            'Explain your university grades',
          ], 1, 'Clarifying requirements avoids solving the wrong problem and shows clear thinking.'),
          q('In a case interview about a 15% drop in orders, what matters most?', [
            'Guessing the exact cause quickly',
            'Naming as many tools as possible',
            'Avoiding any assumptions at all',
            'A clear, structured approach to investigating',
          ], 3, 'Interviewers assess how you structure the problem more than a single answer.'),
          q('What does STAR stand for in behavioural interviews?', [
            'Skills, Tools, Analysis, Reporting',
            'Summary, Timeline, Audience, Recommendation',
            'Situation, Task, Action, Result',
            'Strategy, Tactics, Assessment, Review',
          ], 2, 'STAR structures stories so they are concise and show impact.'),
        ]
      ),
      lesson('Remote and Freelance Analyst Work From Pakistan', 13, `
Data analysis is well suited to remote work: the inputs are data, the outputs are reports and dashboards, and communication happens online. Analysts in Pakistan can work for international employers and clients, often earning in dollars, if they present themselves professionally.

### Routes to remote work

| Route | How it works | Good for |
|---|---|---|
| Full-time remote employment | Hired directly by a foreign company | Stable income, career growth |
| Employer of record platforms | Platforms like Deel or Remote employ you on a company's behalf | Access to international teams |
| Freelance marketplaces | Upwork, Fiverr, Toptal | Building experience and a client base |
| Local companies with foreign clients | Pakistani firms serving US, UK or Gulf clients | A gentler start with local support |

### Freelance services that sell

Clients on freelance platforms rarely ask for "analysis". They ask for specific outcomes:

- Building or fixing a Power BI or Looker Studio dashboard.
- Cleaning and merging messy Excel or Google Sheets files.
- Setting up automated reports from Shopify, Google Analytics or a CRM.
- Writing SQL queries for an existing database.
- One-off analyses: customer segmentation, sales trends, survey results.

Package services clearly, for example "Shopify sales dashboard in Looker Studio, delivered in 5 days", with a fixed price and a defined scope. Clear packages convert better than vague hourly offers.

### Winning the first clients

1. **Niche down**: "Power BI dashboards for e-commerce stores" beats "data analyst for all needs".
2. **Show relevant samples**: link portfolio dashboards that resemble what the client wants.
3. **Write short, specific proposals**: restate the client's problem, describe your approach in three steps, and ask one clarifying question.
4. **Price for reviews at first**, then raise rates as ratings accumulate.
5. **Over-communicate**: regular updates matter even more when clients cannot see you.

### Working across time zones

US clients are 9 to 10 hours behind Pakistan, which often means evening calls. Agree overlap hours clearly, use asynchronous updates such as short recorded videos with Loom, and confirm deadlines in the client's time zone to avoid confusion.

### Getting paid

Common methods include Payoneer, direct bank transfer to a Pakistani account, and platform withdrawals. Registering as an IT freelancer with the Pakistan Software Export Board can help with banking and tax treatment of export earnings. Keep records of every payment and invoice, and consult a tax adviser once income becomes regular.

### Infrastructure

Reliable internet and power matter as much as skills. A backup internet connection such as a mobile data device, and a UPS or solar backup for load shedding, protect your reputation when a client meeting or deadline arrives.

### Data protection and ethics

International clients may share sensitive data. Use their systems where possible rather than downloading files, keep data off personal devices when asked, sign NDAs professionally, and never reuse a client's data in your portfolio. Trustworthy handling of data is a selling point that leads to repeat work and referrals.

### Growing over time

Many analysts start with small freelance gigs, build a track record, and then move into long-term contracts or full-time remote roles. Keep learning, keep publishing projects, and treat every client as a future reference. The skills in this course, from SQL to storytelling, are exactly what those clients are looking for.
      `,
        [
          q('Which freelance offer is likely to convert best?', [
            'Data analyst available for any task',
            'Hourly help with anything involving numbers',
            'Shopify sales dashboard in Looker Studio, delivered in 5 days',
            'General consulting on business strategy',
          ], 2, 'Specific, outcome-based packages are easier for clients to buy.'),
          q('Why should deadlines be confirmed in the client\'s time zone?', [
            'It prevents confusion when working many hours apart',
            'Platforms reject deadlines in Pakistan time',
            'Clients cannot convert time zones themselves',
            'It makes the project cheaper',
          ], 0, 'Clear time zone agreements avoid missed deadlines across continents.'),
          q('How should client data be treated in your portfolio?', [
            'Use it if you remove the client\'s name',
            'Use it after the contract ends',
            'Use only the charts, not the raw data',
            'Never reuse it; build portfolio projects from public data',
          ], 3, 'Client data remains confidential, so portfolios should rely on public datasets.'),
        ]
      ),
      ],
      [
      q('An interviewer recognises your portfolio project as a popular tutorial. What is the likely problem?', [
        'Tutorials always use incorrect data',
        'It does not show your own thinking or a unique question',
        'Recruiters do not look at portfolios',
        'Tutorial projects are too complex to discuss',
      ], 1, 'Copied projects fail to demonstrate independent analytical skill.'),
      q('Your experience is in teaching, not data. Where should projects go on your CV?', [
        'Above experience, so data skills are seen first',
        'At the very bottom of the page',
        'Only on a separate second page',
        'Nowhere; only list your jobs',
      ], 0, 'Leading with relevant projects shows the skills the role requires.'),
      q('A take-home assignment arrives with a weekend deadline. What approach is best?', [
        'Spend thirty or more hours to impress them',
        'Submit raw query results without explanation',
        'Use every advanced technique you know',
        'A focused analysis with stated assumptions and a short summary',
      ], 3, 'Clear, well-scoped work demonstrates judgement as well as skill.'),
      q('Which step most protects a remote analyst\'s reputation with foreign clients?', [
        'Charging the lowest price on the platform',
        'Accepting every request regardless of scope',
        'Reliable internet and power backups plus clear communication',
        'Working only in Pakistani office hours',
      ], 2, 'Dependable availability and communication build the trust that brings repeat work.'),
      ]
    ),
  ],
  final: [
    q('A junior analyst spends most of the week fixing duplicate IDs and odd dates. How typical is this?', [
      'Unusual, because data usually arrives clean',
      'A clear sign that the analyst lacks the basic skills for the job',
      'Normal, since preparing data takes the largest share of time',
      'Only common in very small companies',
    ], 2, 'Cleaning and preparing data is the most time-consuming part of most analyst roles.'),
    q('A job advert titled data analyst asks for deep learning and production model deployment. What is it really describing?', [
      'A data science role',
      'A typical entry-level analyst role',
      'A data entry role',
      'A database administrator role',
    ], 0, 'Building and deploying predictive models is data science work, whatever the job title says.'),
    q('In the analysis workflow, cleaning reveals the data cannot answer the question. What should happen?', [
      'Continue and report whatever the data shows',
      'Skip ahead to the Share step and present the partial results',
      'Delete the rows that cause problems',
      'Loop back to refine the question or collect different data',
    ], 3, 'The workflow is iterative, so discoveries in later steps often send you back to earlier ones.'),
    q('A daily_sales table has one row per store per day. What is the total of its rows for one store over March?', [
      'The number of orders that store took in March',
      'The number of days in March with a record for that store',
      'The number of products that store sold in March',
      'The number of customers who visited in March',
    ], 1, 'With a grain of one store per day, each row is a day, not an order or customer.'),
    q('A request says "send me last quarter\'s returns". What should your reply confirm first?', [
      'The file format they prefer',
      'Which colour scheme to use in charts',
      'Whether they want rows sorted by date',
      'What decision the returns data will inform',
    ], 3, 'Confirming the decision turns a data dump into a focused, useful analysis.'),
    q('"Would customers pay for a premium plan?" arrives, but no such plan has ever existed. What is the best response?', [
      'Use total revenue as a proxy and estimate it',
      'Decline the request with no explanation',
      'Ask engineering to build the plan first',
      'Explain the data gap and suggest a survey or landing-page test',
    ], 3, 'With no historical data, the honest path is to propose a way to gather evidence.'),
    q('Marketing reports 48,000 active customers and finance reports 12,500. What resolves this fastest?', [
      'Comparing the written definition each team uses',
      'Averaging the two numbers together',
      'Choosing the number from the more senior team',
      'Rebuilding the database from scratch',
    ], 0, 'Different qualifying rules explain most mismatches, so definitions must be compared.'),
    q('Which pair shows a leading and a lagging indicator?', [
      'Quarterly revenue and annual profit',
      'Annual revenue and total employee count',
      'Free-trial sign-ups and quarterly revenue',
      'Last year\'s churn and last year\'s profit',
    ], 2, 'Trial sign-ups move before revenue does, giving time to react.'),
    q('A one-page analysis plan lists "Delivery times missing for 5% of January rows". Which section is this?', [
      'Decision',
      'Background',
      'Deliverable',
      'Risks',
    ], 3, 'Known data gaps belong under risks so stakeholders see them before results.'),
    q('Which formula counts returned orders from Karachi?', [
      '=SUMIFS(D:D, B:B, "Karachi")',
      '=AVERAGEIFS(D:D, B:B, "Karachi")',
      '=COUNTIFS(B:B, "Karachi", E:E, "Returned")',
      '=COUNT(B:B, "Karachi", "Returned")',
    ], 2, 'COUNTIFS counts rows that meet several criteria at once.'),
    q('An XLOOKUP returns "Not found" for 3% of orders. What should you do before reporting totals?', [
      'Delete the unmatched orders silently',
      'Investigate the mismatches and resolve or report them',
      'Replace them with the most common category',
      'Ignore them because 3% is too small to matter',
    ], 1, 'Unmatched rows can bias totals, so they need fixing or clear disclosure.'),
    q('A PivotTable\'s Count of customer_id per city is higher than the true number of customers. Why?', [
      'Count includes repeat orders from the same customers',
      'PivotTables round every count upwards to the nearest ten',
      'Customer IDs are stored as numbers',
      'The pivot needs a Filters field',
    ], 0, 'A plain count counts rows, so repeat buyers are counted once per order.'),
    q('A workbook formula reads =D2*0.17 in two hundred cells. What is the main risk?', [
      'Updating the rate means finding every hidden constant',
      'The formula calculates more slowly than a lookup',
      'Decimals cannot be multiplied in spreadsheets',
      'The file will exceed the row limit',
    ], 0, 'Hard-coded constants are easy to miss when a value changes.'),
    q('Which WHERE clause selects every order placed in February 2026, including those late on 28 February?', [
      'order_date BETWEEN \'2026-02-01\' AND \'2026-02-28\'',
      'order_date = \'2026-02\'',
      'order_date >= \'2026-02-01\' AND order_date < \'2026-03-01\'',
      'order_date >= \'2026-02-01\' AND order_date <= \'2026-02-28\'',
    ], 2, 'A half-open range captures every timestamp in the month.'),
    q('status <> \'cancelled\' returns fewer rows than expected. What is a likely reason?', [
      'The column contains numbers',
      'Rows with a NULL status are silently excluded',
      'The query needs an ORDER BY clause before it can filter',
      'Cancelled orders are stored in another table',
    ], 1, 'Comparisons with NULL are never true, so NULL rows drop out unless included explicitly.'),
    q('You need customers who placed at least five orders this year. Where does COUNT(*) >= 5 go?', [
      'In the WHERE clause, before the GROUP BY',
      'In the ORDER BY clause',
      'In the SELECT list only',
      'In the HAVING clause after GROUP BY',
    ], 3, 'Conditions on aggregates are applied to groups with HAVING.'),
    q('Which query pattern finds products that have never been sold?', [
      'INNER JOIN products to order_items and count rows',
      'GROUP BY product with HAVING COUNT(*) = 0',
      'LEFT JOIN order_items and keep rows where the item key IS NULL',
      'SELECT DISTINCT product FROM order_items',
    ], 2, 'The left join plus NULL check isolates rows with no match on the right.'),
    q('Which window function suits a 7-day moving average of daily revenue?', [
      'AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)',
      'SUM(revenue) GROUP BY day HAVING COUNT(*) = 7',
      'AVG(revenue) OVER (PARTITION BY day ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)',
      'LAG(revenue, 7) OVER (PARTITION BY revenue)',
    ], 0, 'The window covers the current day and the six before it, averaging seven values.'),
    q('Profiling shows a maximum order value of 9,999,999 in a shop selling clothes. What is the most likely explanation?', [
      'A genuine wholesale order',
      'A currency conversion applied automatically by the database',
      'A rounding error in the database',
      'A placeholder or typing error that needs checking',
    ], 3, 'Suspicious round or repeated-digit extremes are often placeholders, not real orders.'),
    q('Your March extract totals PKR 41M but finance reports PKR 48.2M. What should you do first?', [
      'Scale your numbers up to match finance',
      'Find out whether data, filters or definitions differ',
      'Report your figure and ignore finance',
      'Average the two figures and report that as the final number',
    ], 1, 'A large gap means missing data or a different definition that must be explained.'),
    q('An optional gender field is blank for 30% of customers. What is the best treatment?', [
      'Fill blanks with the most common value',
      'Keep the rows and label blanks as Not given',
      'Delete every customer with a blank',
      'Guess gender from the customer\'s name',
    ], 1, 'Labelling preserves the rows and avoids inventing information.'),
    q('Order dates arrive as text like "07/08/2026" from a Pakistani system. How should you parse them?', [
      'Let the software guess the format automatically',
      'Treat them as text and sort them alphabetically to find the order',
      'Assume month first, as in US systems',
      'Parse explicitly as day, month, year after confirming the source',
    ], 3, 'Explicit parsing with a confirmed format avoids swapping days and months.'),
    q('Why print the row count after each step of a cleaning script?', [
      'It makes the script run faster',
      'Python requires a print statement after each step to save changes',
      'It records each step\'s impact and exposes unexpected drops',
      'It removes duplicates automatically',
    ], 2, 'Row counts after each step create an automatic log and reveal mistakes early.'),
    q('Delivery times range from 1 to 40 days with a long right tail. Which summary is most honest?', [
      'The median plus the 90th percentile',
      'The mean, rounded to the nearest whole day',
      'The mode and the minimum',
      'The standard deviation alone',
    ], 0, 'Skewed data needs the typical value and the tail, which percentiles describe.'),
    q('Region A has 2,000 customers averaging PKR 5,000 and Region B has 200 averaging PKR 10,000. What is the overall average?', [
      'About PKR 7,500',
      'About PKR 15,000',
      'About PKR 10,000',
      'About PKR 5,455',
    ], 3, 'The weighted average is total spend divided by total customers: 12,000,000 / 2,200.'),
    q('A city\'s satisfaction is 70% from a survey of 100 people. Roughly how wide is the margin of error?', [
      'About 9 points either way',
      'About 1 point either way',
      'About 30 points either way',
      'There is no margin of error',
    ], 0, 'For p = 0.7 and n = 100, 1.96 x sqrt(0.21/100) is about 0.09.'),
    q('Stores with more staff have higher sales. Which explanation shows a confounder?', [
      'More staff always cause higher sales',
      'Higher sales always cause more hiring',
      'Bigger stores in busy areas have more staff and more sales',
      'The two measures are unrelated and the pattern is a coincidence',
    ], 2, 'Store size and location can drive both variables without one causing the other.'),
    q('Overall return rate rose, yet every city\'s rate fell. Which explanation fits?', [
      'More orders came from cities with naturally higher return rates',
      'The data must contain an error somewhere in the city-level totals',
      'Returns were counted twice in every city',
      'Return rates cannot be compared across months',
    ], 0, 'A shift in mix towards high-return cities can raise the total while each city improves.'),
    q('Which segmentation is most likely to lead to action?', [
      'Customers split by the day of the month they were born',
      'Customers split by acquisition channel',
      'Orders split by the length of the customer\'s name',
      'Orders split by whether the order number is even',
    ], 1, 'Channel segments connect directly to where marketing money is spent.'),
    q('Sales in the 30 days before Eid this year are compared with the 30 days before Eid last year. Why is this fair?', [
      'It ignores any growth in the business over the past twelve months',
      'Eid falls on the same date each year',
      'It uses calendar months for both periods',
      'It aligns the same seasonal period despite the moving date',
    ], 3, 'Aligning by holiday period removes the distortion of a holiday moving between months.'),
    q('The March 2026 cohort\'s month 1 retention is 44% versus 32% for January 2026. What does this suggest?', [
      'March customers spent more on their first order',
      'The cohort table has been built incorrectly',
      'Something changed that helped newer customers come back',
      'January customers were counted twice',
    ], 2, 'Comparing cohorts at the same age shows whether retention is improving.'),
    q('Big first-order discounts bring many new customers. What cohort check reveals whether they are worth it?', [
      'Total sign-ups in the discount month',
      'Average first-order value across all customers',
      'The number of discount codes issued',
      'Retention of discount-acquired cohorts versus others',
    ], 3, 'Cohorts by first-order discount show whether those customers ever return.'),
    q('A funnel shows 9,800 users adding to cart and 2,300 paying. What is the cart-to-paid conversion?', [
      'About 23%',
      'About 2.3%',
      'About 43%',
      'About 77%',
    ], 0, 'Step conversion divides payers by cart users, and 2,300 divided by 9,800 is roughly 0.23.'),
    q('Which pandas expression keeps Karachi orders above PKR 5,000?', [
      'df[df["city"] == "Karachi" and df["amount"] > 5000]',
      'df[(df["city"] == "Karachi") & (df["amount"] > 5000)]',
      'df.groupby("city")["amount"] > 5000',
      'df[(df["city"] == "Karachi") or (df["amount"] > 5000)]',
    ], 1, 'pandas combines bracketed conditions with &, not the word and.'),
    q('A merge of orders with customers suddenly has more rows than orders. Which argument would have caught this?', [
      'how="outer"',
      'indicator=False',
      'validate="many_to_one"',
      'suffixes=("_order", "_cust")',
    ], 2, 'Validation raises an error if customer keys are duplicated, preventing silent fan-out.'),
    q('A table has columns Jan, Feb and Mar for each product. Which pandas method makes it tidy?', [
      'pivot_table',
      'concat',
      'resample',
      'melt',
    ], 3, 'melt gathers the month columns into one month column and one value column.'),
    q('Why build monthly charts in a notebook instead of by hand each month?', [
      'Rerunning the notebook rebuilds every chart consistently',
      'Notebook charts never need labels',
      'Hand-made charts cannot show dates on the horizontal axis at all',
      'Notebooks automatically pick the right chart type',
    ], 0, 'Code-generated charts are repeatable and consistent across reporting periods.'),
    q('A manager wants to see how actual sales compare with a monthly target. Which visual fits best?', [
      'A pie chart of the twelve months',
      'Bars for actual with a target marker',
      'A scatter plot of sales against month number',
      'A 3D gauge dial',
    ], 1, 'Bars with target markers show the gap to target clearly for each period.'),
    q('A chart shows eight brightly coloured lines and a legend. What change helps most?', [
      'Add a 3D effect to separate the lines',
      'Make every line thicker and brighter',
      'Grey most lines, colour the key one and label it directly',
      'Move the legend to the bottom of the chart',
    ], 2, 'Highlighting one series against grey context and labelling directly makes the point fast.'),
    q('A cumulative revenue chart rises every month. What might it hide?', [
      'That revenue is reported in rupees',
      'That the data covers twelve months',
      'That the chart has a title',
      'That monthly revenue is actually falling',
    ], 3, 'Cumulative totals always rise, so they can conceal a slowdown.'),
    q('Users keep misreading a filtered dashboard view as company totals. What helps?', [
      'Removing all filters from the dashboard',
      'Showing active filters clearly on the page',
      'Adding more filters for each team',
      'Refreshing the data more often',
    ], 1, 'Visible filter states prevent filtered numbers being mistaken for totals.'),
    q('An A/B test was planned as a 50/50 split but ended 54/46. What should you do before reading results?', [
      'Check the randomisation for a bug',
      'Declare the larger group the winner',
      'Remove users until the groups are equal',
      'Extend the test for another month',
    ], 0, 'An unexpected imbalance often signals a flaw that could bias the whole test.'),
    q('A forecast method had a MAPE of 4% last year and 12% this year. What does this indicate?', [
      'The forecasts became more accurate',
      'Forecast accuracy has worsened',
      'The business grew by 8%',
      'Actual values were 12% higher than forecast every month',
    ], 1, 'A higher mean absolute percentage error means forecasts are further from actual results.'),
    q('Revenue drops 20% overnight, and payment gateway totals show no change. What is the likely cause?', [
      'A sudden loss of customers',
      'A competitor\'s new promotion',
      'A tracking or data pipeline problem',
      'Normal seasonal variation',
    ], 2, 'If an independent source shows no drop, the problem is in the data, not the business.'),
    q('An order earns PKR 3,000 with goods costing 1,600, delivery 200, fees 60 and packaging 40. What is its contribution margin?', [
      'PKR 3,000',
      'PKR 1,400',
      'PKR 1,300',
      'PKR 1,100',
    ], 3, '3,000 minus 1,600, 200, 60 and 40 leaves 1,100.'),
    q('Why include the cost of refused cash-on-delivery orders in unit economics?', [
      'Refused orders increase revenue',
      'It is required by tax law for all online sellers in Pakistan',
      'Refusals carry shipping costs with no revenue',
      'Refused orders improve customer retention',
    ], 2, 'Ignoring refusal costs makes each order look more profitable than it is.'),
    q('Which slide title works best for a finding?', [
      'Analysis of delivery data',
      'Chart 4: deliveries by city',
      'Delivery data for the first quarter, by courier and by city',
      'Two courier hubs cause 41% of late deliveries',
    ], 3, 'A title that states the finding tells the audience what to take away.'),
    q('Your strongest evidence is a correlation with a plausible explanation. Which phrasing fits?', [
      'The change caused sales to rise across every city and channel',
      'The change is strongly associated with higher sales',
      'The change guarantees higher sales',
      'The change has been proven to work',
    ], 1, 'Association language matches evidence that falls short of an experiment.'),
    q('Before a high-stakes meeting, you expect finance to dispute your figure. What is the best preparation?', [
      'Reconcile with finance\'s source beforehand',
      'Leave the figure out of the slides',
      'Present it last so there is no time for questions',
      'Round the figure to avoid any challenge',
    ], 0, 'Reconciling in advance prevents a public dispute and builds trust.'),
    q('Which portfolio project would most impress an e-commerce employer?', [
      'A copy of a popular Titanic survival notebook',
      'A long list of SQL syntax examples covering every join and window type',
      'A cohort retention analysis of real order data with a recommendation',
      'A dashboard with twenty charts and no titles',
    ], 2, 'An end-to-end analysis with a business recommendation shows job-ready skills.'),
  ],
});
