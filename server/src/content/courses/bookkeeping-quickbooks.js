import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'bookkeeping-quickbooks',
  title: 'Bookkeeping & QuickBooks',
  category: 'Business',
  level: 'Beginner → Intermediate',
  duration: '6 weeks',
  accent: 'emerald',
  coverKey: 'bookkeeping-quickbooks',
  summary:
    'Keep a small business\'s books from zero: double-entry, chart of accounts, invoices and bills, bank reconciliation, payroll basics, accruals, financial statements and month-end close, then run it all in QuickBooks Online and find bookkeeping clients.',
  description:
    'This course teaches bookkeeping as a job you can do for real businesses, not as exam theory. You start with what bookkeeping is for and the accounting equation, then learn debits and credits, build a chart of accounts and record transactions in journals and ledgers. You handle invoices, bills, receivables and payables, reconcile bank and cash accounts, and process payroll records and deductions in general terms. You learn accruals, prepayments, depreciation and inventory, prepare the income statement, balance sheet and cash flow statement, and run a month-end close with a checklist. The second half moves everything into QuickBooks Online: company setup, products and services, customers and vendors, invoicing, expenses, bank feeds and rules, reconciliation, reports and sales tax settings. Tax is kept general, with Pakistan examples, and you learn to check current rules with the tax authority such as FBR. The course closes with packaging your services, finding bookkeeping clients locally and online, and running client work safely.',
  chapters: [
    chapter(
      'What Bookkeeping Is and Why Businesses Need It',
      'Learn what a bookkeeper actually does each week, how bookkeeping differs from accounting and tax work, when to use cash or accrual basis, and how to collect and keep the source documents every entry depends on.',
      [
      lesson('The Job of a Bookkeeper', 12, `
Bookkeeping is the routine work of recording every money event in a business so that the owner always knows what came in, what went out, who owes the business money and whom the business owes. A bookkeeper turns a shoebox of receipts, a bank statement and a WhatsApp chat full of payment screenshots into clean, organised records that anyone can trust.

### What a bookkeeper does in a normal week

The work is steady and repetitive, which is exactly why businesses pay for it. A typical week for a bookkeeper serving a small Lahore clothing shop might look like this:

| Day | Task | Why it matters |
|---|---|---|
| Monday | Record last week's sales from the till and bank | Sales are the starting point for profit |
| Tuesday | Enter supplier bills for fabric and packaging | Shows what the shop owes |
| Wednesday | Match bank and JazzCash transactions to records | Catches missing or duplicate entries |
| Thursday | Send reminders for unpaid customer invoices | Brings cash in faster |
| Friday | Update a short summary for the owner | Lets the owner decide with real numbers |

None of these tasks is difficult on its own. The value comes from doing them every week, accurately, without letting anything slip.

### Why businesses need it

Many small business owners in Pakistan and across South Asia run their business from memory and a bank balance. That works until something goes wrong. Good books help an owner to:

- **Know real profit.** A full bank account does not mean the business is profitable. Some of that money may already belong to suppliers.
- **Collect what is owed.** Without a list of unpaid invoices, customers quietly forget to pay.
- **Avoid paying twice.** A clear record of bills paid stops duplicate payments to suppliers.
- **Get a loan or investor.** Banks and investors ask for financial statements, and those come from the books.
- **Meet tax duties.** Tax returns are built from business records. Messy records lead to stress, guesswork and penalties.

### The skills that matter most

You do not need to be a maths expert. Bookkeeping uses addition, subtraction and percentages. What matters more:

1. **Accuracy.** A wrong digit in an amount can take hours to trace later.
2. **Consistency.** The same type of transaction should always be recorded the same way.
3. **Curiosity.** When a number looks odd, a good bookkeeper asks why instead of forcing it to fit.
4. **Discretion.** You will see salaries, debts and private spending. That information stays private.
5. **Organisation.** Files, folders and naming habits save enormous time at month end.

### Where bookkeepers work

Bookkeepers work in-house for one business, inside accounting firms that serve many clients, or as freelancers who keep books for several small businesses remotely. Software such as QuickBooks Online has made remote bookkeeping common, because the books live in the cloud and the bookkeeper can log in from Karachi while the client sits in Dubai or London.

### What a bookkeeper does not usually do

Bookkeepers record and organise. They usually do not sign audit reports, give formal tax opinions or set business strategy. Knowing where your role ends is part of doing it professionally, and later in the course you will see how to refer clients to accountants and tax advisers when a question goes beyond bookkeeping.
      `,
        [
          q('A shop owner says the business must be profitable because the bank balance is high. What is the bookkeeper\'s best response?', [
            'Agree, because the bank balance is the same as profit',
            'Explain that some of that cash may already be owed to suppliers',
            'Suggest closing the bank account to simplify records',
            'Advise ignoring the bank balance completely',
          ], 1, 'Cash in the bank can include money that is owed to others, so it does not show profit on its own.'),
          q('Which quality matters most when the same kind of transaction appears every week?', [
            'Recording it the same way every time',
            'Using a different account each week for variety',
            'Recording it only when the amount is large',
            'Waiting until year end to record it all',
          ], 0, 'Consistency makes records comparable and makes errors easy to spot.'),
          q('Which task is usually outside a bookkeeper\'s role?', [
            'Entering supplier bills',
            'Matching bank transactions to records',
            'Sending reminders for unpaid invoices',
            'Signing a formal audit report',
          ], 3, 'Audit opinions are given by qualified auditors, not by bookkeepers.'),
        ]
      ),
      lesson('Bookkeeping, Accounting and Tax Compared', 12, `
People often use the words bookkeeping, accounting and tax as if they mean the same thing. They are linked, but they are different jobs with different skills, and knowing the difference helps you explain your services and stay within your role.

### Three layers of the same records

Think of a business's financial work as three layers built on top of each other:

| Layer | Main question | Typical output |
|---|---|---|
| Bookkeeping | What happened? | Recorded transactions, reconciled accounts, ledgers |
| Accounting | What does it mean? | Financial statements, adjustments, analysis, budgets |
| Tax | What is owed to the government? | Tax returns, withholding statements, sales tax filings |

Bookkeeping is the foundation. If the bookkeeping is wrong, the accounting and the tax work built on it will also be wrong, no matter how skilled the accountant is.

### Bookkeeping in detail

Bookkeeping covers the daily and weekly recording of transactions: sales, purchases, payments, receipts, payroll records and bank activity. It also includes reconciling accounts so the records agree with bank statements. The bookkeeper's job is to make the data complete and correct.

### Accounting in detail

Accounting takes the recorded data and shapes it into useful information. An accountant makes period-end adjustments, prepares financial statements, interprets results and advises on decisions. In many businesses the same person does both bookkeeping and basic accounting, especially in small firms. In larger companies they are separate roles, and senior accountants often hold professional qualifications such as ACCA, CA or CMA.

### Tax in detail

Tax work applies the law to the business's numbers. It includes calculating income tax, sales tax and withholding tax, filing returns and responding to notices. Tax laws change often, sometimes every budget. In Pakistan, federal taxes are administered by the Federal Board of Revenue (FBR), and provinces have their own revenue authorities for sales tax on services, such as the Punjab Revenue Authority and the Sindh Revenue Board. Rates, thresholds and deadlines change, so they must always be checked on the authority's website or with a qualified tax adviser before acting.

### How they work together

Consider a small catering business in Karachi:

1. The **bookkeeper** records each event invoice, every purchase of meat and vegetables, staff wages and rent, then reconciles the bank account every month.
2. The **accountant** reviews the books at year end, adds adjustments such as depreciation on the cooking equipment, and prepares the income statement and balance sheet.
3. The **tax adviser** uses those statements to prepare the tax return and checks which withholding obligations apply.

\`\`\`text
Receipts, invoices, bank statements
          |
     Bookkeeping  (record and reconcile)
          |
     Accounting   (adjust, report, analyse)
          |
        Tax       (apply current law, file returns)
\`\`\`

### Why this matters for your career

When you offer bookkeeping services, clients will ask tax questions. A simple and honest answer protects you: "I will keep your records clean and ready, and your tax adviser will use them to file." You can still learn how taxes appear in the books, such as recording sales tax collected or tax withheld from a payment, without giving formal tax advice. That boundary keeps clients safe and keeps you out of trouble.
      `,
        [
          q('Which question is bookkeeping mainly designed to answer?', [
            'What should the business invest in next year?',
            'How much tax does the law require this year?',
            'What transactions happened and were they recorded correctly?',
            'Which auditor should sign the accounts?',
          ], 2, 'Bookkeeping records what happened; accounting interprets it and tax applies the law to it.'),
          q('Why should a bookkeeper check tax rates with the authority before using them?', [
            'Tax rates are secret and only bookkeepers can see them',
            'Bookkeepers set tax rates for their clients',
            'Tax rates never apply to small businesses',
            'Rates and thresholds change, often with each budget',
          ], 3, 'Tax rules change regularly, so current figures must come from the authority or a qualified adviser.'),
          q('What happens to accounting and tax work when the bookkeeping is wrong?', [
            'The errors flow into the statements and returns built on it',
            'The accountant\'s software corrects every error automatically',
            'Tax returns ignore bookkeeping records completely',
            'Nothing, because accounting uses different data',
          ], 0, 'Accounting and tax are built on the recorded transactions, so bookkeeping errors carry through.'),
        ]
      ),
      lesson('Cash Basis and Accrual Basis', 13, `
A business can record income and expenses at two different moments: when cash actually moves, or when the sale or cost is earned or incurred. These two approaches are called cash basis and accrual basis, and choosing between them changes what the profit figure says.

### Cash basis

Under cash basis, you record income when money is received and expenses when money is paid. It is simple and matches the bank account closely.

Example: a freelance graphic designer in Islamabad finishes a logo in March but the client pays in April. On cash basis, the income appears in April.

### Accrual basis

Under accrual basis, you record income when it is earned, meaning the work is done or goods are delivered, and expenses when they are incurred, even if no cash has moved yet. Unpaid sales become **accounts receivable** and unpaid bills become **accounts payable**.

Using the same example, the designer records the income in March, because the work was completed in March, and shows a receivable until April.

### Side by side

| Situation | Cash basis | Accrual basis |
|---|---|---|
| Invoice sent in March, paid in April | Income in April | Income in March |
| Electricity used in May, bill paid in June | Expense in June | Expense in May |
| Customer pays in advance in January for February work | Income in January | Income in February |
| Supplier bill received but not yet paid | Not recorded | Recorded as payable |

### Why accrual gives a truer picture

Imagine a Faisalabad textile trader who sells goods worth a large amount in December on 60-day credit. On cash basis, December looks like a weak month and February looks excellent, even though the actual trading happened in December. Accrual basis matches income with the period in which it was earned and with the costs that produced it. This matching makes month-to-month comparisons meaningful.

Accrual basis also shows things that cash basis hides: how much customers owe, how much the business owes suppliers, and whether the business is profitable but short of cash, which is a very common small business problem.

### Why some businesses still use cash basis

Cash basis is easier to keep, needs fewer adjustments and is often enough for very small, simple businesses such as a sole tutor or a home baker who is paid on delivery. Some tax systems allow small businesses to report on cash basis, while larger businesses and companies are generally expected to use accrual accounting under financial reporting standards. Which basis is allowed for tax depends on the country, the business type and its size, and these rules change, so confirm with the tax authority, such as FBR in Pakistan, or a qualified adviser.

### A practical approach

Many bookkeepers keep daily records in a way that supports accrual, by entering invoices and bills as they happen, then produce cash-based views when a client wants them. Software such as QuickBooks Online lets you run many reports on either basis with a single setting.

\`\`\`text
Invoice dated 28 March, PKR 80,000, paid 10 April

Accrual: March sales      +80,000   (receivable until 10 April)
Cash:    April sales      +80,000
\`\`\`

The total income over the two months is identical. Only the timing changes, and timing is what managers and lenders care about when they read monthly figures.
      `,
        [
          q('Under accrual basis, when is income recorded?', [
            'When it is earned, even if cash has not arrived',
            'Only when the customer\'s payment clears the bank',
            'At the end of the year in one entry',
            'When the tax return is filed',
          ], 0, 'Accrual records income in the period the work is done or goods are delivered.'),
          q('Electricity is used in May and the bill is paid in June. When does cash basis record the expense?', [
            'In May',
            'In June',
            'Split equally across May and June',
            'It is never recorded under cash basis',
          ], 1, 'Cash basis records the expense when the money is actually paid.'),
          q('Why does accrual basis give a truer monthly picture for a trader who sells on credit?', [
            'It removes all receivables from the books',
            'It records income only when it reaches the bank',
            'It matches income to the month the trading happened',
            'It makes every month show the same profit',
          ], 2, 'Matching income and costs to the period they relate to makes monthly results comparable.'),
        ]
      ),
      lesson('Source Documents and Keeping Records', 13, `
Every entry in the books must be backed by evidence. That evidence is called a source document. If a tax officer, auditor, bank or business partner asks why an amount was recorded, the source document is your answer.

### Common source documents

| Document | Created by | What it proves |
|---|---|---|
| Sales invoice | The business | A sale was made and an amount is due |
| Sales receipt or till slip | The business | A sale was paid at the time of sale |
| Supplier bill or invoice | The supplier | The business owes for goods or services |
| Payment receipt | The supplier | The business paid a bill |
| Bank statement | The bank | Money moved in or out of the account |
| Mobile wallet statement | JazzCash, Easypaisa or similar | Wallet payments and receipts |
| Payslip and attendance record | The business | Wages earned and paid |
| Contract or agreement | Both parties | Terms of a sale, rent or loan |

### What a good source document shows

A useful document answers five questions: **who** (the other party), **what** (goods or service), **when** (date), **how much** (amount and any tax) and **reference** (invoice or receipt number). A payment screenshot on WhatsApp proves money moved but often lacks what it was for. When that happens, add a note or attach the related invoice so the record is complete.

### Building a simple filing system

A filing system only works if it is used every day. A practical structure for a small client:

\`\`\`text
ClientName/
  2026/
    01-January/
      Sales/
      Purchases/
      Bank/
      Payroll/
      Other/
\`\`\`

Name each file in a consistent way so it sorts and searches well, for example:

\`\`\`text
2026-01-14_Bill_AlNoorPackaging_INV-2231_PKR18500.pdf
\`\`\`

The date first, then the type, the other party, the reference and the amount. Anyone can find it in seconds months later.

### Paper and digital records

Many small businesses in Pakistan still receive handwritten bills from wholesale markets. Photograph or scan them the same day, because thermal till slips fade and paper gets lost. Store scans in cloud storage with a backup, and keep the originals in a labelled box or file for each month. Accounting software also lets you attach the document image directly to each transaction, which is the cleanest option.

### How long to keep records

Laws set minimum periods for keeping business records, and these differ by country and by type of record. Tax authorities can review past years, so records must be available for the full required period. Do not rely on a number you heard from a friend: check the current requirement with the tax authority, such as FBR in Pakistan, or with a qualified adviser, and keep records at least that long.

### Handling missing documents

Sometimes a document truly does not exist, such as a small cash payment to a rickshaw driver for a delivery. Record it with an internal note or a petty cash voucher signed by the person who made the payment, stating the date, purpose and amount. Do this sparingly. If many transactions lack documents, it is a warning sign that the client's process needs fixing, not a habit to accept.

### Your rule of thumb

No document, no entry, unless you write down why. This one habit protects your client during reviews and makes your own work faster, because you never have to guess what an old transaction was.
      `,
        [
          q('A client sends a WhatsApp payment screenshot with no description. What should the bookkeeper do?', [
            'Record it as a general expense and move on',
            'Delete it because screenshots are never accepted as evidence of anything',
            'Leave it unrecorded and wait until year end to ask the client',
            'Find the related invoice or add a note on what it was for',
          ], 3, 'A screenshot proves money moved, but the record also needs to show what the payment was for.'),
          q('Why should handwritten bills and till slips be scanned the same day?', [
            'Scanning makes the amounts tax free',
            'Software refuses paper documents older than a week',
            'Paper gets lost and thermal slips fade over time',
            'Suppliers require scans before they accept payment',
          ], 2, 'Fading slips and lost paper destroy evidence, so a same-day digital copy protects the record.'),
          q('How should a bookkeeper decide how long to keep a client\'s records?', [
            'Keep them for exactly one year in every case, then shred them all',
            'Check the current legal requirement with the tax authority or an adviser',
            'Follow whatever period another bookkeeper friend once suggested',
            'Delete them as soon as the year\'s bank balance agrees',
          ], 1, 'Retention periods are set by law, differ by country and change, so they must be checked at the source.'),
        ]
      ),
      ],
      [
      q('A home baker is paid in cash on delivery and has no credit customers. Which statement fits best?', [
        'Cash basis may be simple and adequate, subject to local tax rules',
        'Accrual basis is impossible for this business',
        'The baker does not need any records at all',
        'Cash basis would make her profit look higher forever',
      ], 0, 'For a tiny cash business the two bases give similar results, but tax rules on which basis is allowed must still be checked.'),
      q('A designer finishes work on 30 June and is paid on 5 July. Under accrual, which month shows the income?', [
        'July, when the cash arrives',
        'Neither month until the year closes',
        'June, when the work was completed',
        'Half in June and half in July',
      ], 2, 'Accrual records income when it is earned, which is when the work was completed.'),
      q('Which file name follows a clear, searchable naming habit?', [
        'scan0042 final new.pdf',
        'bill from that packaging guy.pdf',
        'IMG_20260114_093011.jpg',
        '2026-01-14_Bill_AlNoor_INV-2231.pdf',
      ], 3, 'Date first, then type, party and reference makes files sort and search well.'),
      q('A client asks the bookkeeper which tax rate applies to a new service. What is the professional answer?', [
        'Give the rate remembered from last year\'s return without checking',
        'Keep the records ready and refer the rate question to the tax authority or an adviser',
        'Tell the client that tax never applies to small or new businesses of any kind',
        'Choose the lowest rate available so the client saves as much money as possible',
      ], 1, 'Tax rates change and applying law is tax work, so the bookkeeper refers it to a current, authoritative source.'),
      ]
    ),
    chapter(
      'The Accounting Equation and Double-Entry',
      'Understand assets, liabilities, equity, income, expenses and drawings, see why every transaction has two sides, learn debits and credits with a simple rule, and record your first set of real transactions so the books stay in balance.',
      [
      lesson('Assets, Liabilities and Equity', 13, `
Every set of books rests on one short equation. Once it makes sense, debits, credits and financial statements stop feeling mysterious.

\`\`\`text
Assets = Liabilities + Equity
\`\`\`

The equation says that everything a business owns or controls was paid for by someone: either by outsiders who lent it money or supplied it on credit, or by the owner.

### Assets: what the business owns or is owed

An asset is a resource the business controls that is expected to bring a future benefit. Common assets for a small business:

| Asset | Example for a Rawalpindi pharmacy |
|---|---|
| Cash and bank | Till cash and the current account balance |
| Mobile wallet balance | Money sitting in the business Easypaisa account |
| Accounts receivable | A clinic that buys on credit and pays monthly |
| Inventory | Medicines on the shelves and in storage |
| Prepaid expenses | Shop insurance paid in advance for the year |
| Equipment | Refrigerator for vaccines, computer, billing printer |

Assets that will turn into cash or be used up within about a year are called **current assets**. Assets used for several years, such as furniture or a delivery bike, are **non-current** or **fixed assets**.

### Liabilities: what the business owes

A liability is an obligation to pay money or provide something in the future. Examples:

- **Accounts payable**: medicines bought from a distributor on 30-day credit.
- **Loans**: a bank loan used to fit out the shop.
- **Wages payable**: staff salary earned but not yet paid at month end.
- **Taxes payable**: tax collected or withheld that must be paid to the government.
- **Customer advances**: money received before goods are delivered.

Liabilities due within about a year are **current liabilities**; longer obligations, such as a multi-year loan, are **non-current**.

### Equity: the owner's share

Equity is what is left for the owner after all liabilities are paid from the assets. It is sometimes called net assets or owner's capital.

\`\`\`text
Equity = Assets - Liabilities
\`\`\`

Equity grows when the owner puts money in or when the business makes a profit. It shrinks when the owner takes money out or when the business makes a loss. In a sole proprietorship it is usually called **capital**; in a company it is split into **share capital** and **retained earnings**.

### Seeing the equation hold

Suppose Ayesha opens a tailoring business in Multan:

| Event | Assets | Liabilities | Equity |
|---|---|---|---|
| Puts PKR 200,000 of her savings into a business account | Bank +200,000 | | Capital +200,000 |
| Buys sewing machines on credit for PKR 90,000 | Equipment +90,000 | Payable +90,000 | |
| Pays the supplier PKR 40,000 | Bank -40,000 | Payable -40,000 | |
| **Totals** | **250,000** | **50,000** | **200,000** |

Assets of 250,000 equal liabilities of 50,000 plus equity of 200,000. Each event changed at least two figures, and the equation still balanced after every single step.

### Why this matters

Because the equation must always balance, it is a built-in error check. If your records ever show assets that do not equal liabilities plus equity, something has been recorded on only one side or with the wrong amount. That idea is the heart of double-entry bookkeeping.
      `,
        [
          q('Which item is a liability for a small shop?', [
            'Medicines held on the shelves for sale soon',
            'Cash kept in the till drawer at night',
            'Money owed to a distributor on credit',
            'A vaccine refrigerator owned by the shop',
          ], 2, 'A liability is something the business owes, such as unpaid supplier invoices.'),
          q('A business has assets of PKR 500,000 and liabilities of PKR 180,000. What is equity?', [
            'PKR 320,000',
            'PKR 680,000',
            'PKR 180,000',
            'PKR 500,000',
          ], 0, 'Equity equals assets minus liabilities, so 500,000 minus 180,000 gives 320,000.'),
          q('The owner buys equipment on credit. How does the equation stay balanced?', [
            'Assets fall and equity rises by the same amount',
            'Assets and liabilities both rise by the same amount',
            'Only equity changes because the owner made the decision',
            'Nothing changes until the supplier is finally paid',
          ], 1, 'Equipment (an asset) increases and accounts payable (a liability) increases by the same amount.'),
        ]
      ),
      lesson('Income, Expenses and Owner Drawings', 13, `
The basic equation explains what a business owns and owes at one moment. To see how profit changes that position over time, you expand equity into its moving parts: income, expenses and drawings.

### The expanded equation

\`\`\`text
Assets = Liabilities + Capital + Income - Expenses - Drawings
\`\`\`

Income increases equity, because the owner is better off when the business earns. Expenses and drawings reduce equity. This expanded version is what you actually use when recording day-to-day transactions.

### Income

Income, also called revenue, is the value a business earns from its normal activities. Examples:

- Sales of goods, such as shoes sold by a Peshawar retailer.
- Fees for services, such as a tutor's monthly fee or a web developer's project fee.
- Other income, such as interest earned on a savings account or rent received for sub-letting space.

Money received is not always income. A bank loan brings cash in, but it must be repaid, so it is a liability. The owner putting in savings is capital, not income. A customer paying an invoice you already recorded as a sale is collecting a receivable, not new income.

### Expenses

An expense is a cost used up in running the business during a period. Examples include rent, electricity, staff wages, internet, advertising, delivery charges and bank fees. The cost of goods that were sold, such as the purchase cost of the shoes, is also an expense, usually shown separately as **cost of goods sold**.

Not every payment is an expense. Buying a laptop that will be used for three years creates an asset, which is expensed gradually through depreciation. Repaying the principal of a loan reduces a liability; only the interest is an expense.

### Drawings

Drawings are money or goods the owner takes out of the business for personal use. In Pakistan and across South Asia it is very common for family-run businesses to pay household bills, school fees or wedding costs from the shop's account. These are not business expenses and must never be recorded as such.

| Payment from the business account | Correct treatment |
|---|---|
| Shop electricity bill | Expense |
| Owner's home electricity bill | Drawings |
| Owner's children's school fees | Drawings |
| Staff salaries | Expense |
| Owner's monthly "salary" in a sole proprietorship | Usually drawings |

The last row surprises people. In a sole proprietorship the owner and the business are the same legal person, so money the owner pays themselves is generally treated as drawings. In a company, a director who is employed may receive a salary that is an expense of the company. Local rules differ, so check with an accountant when a client's structure is unclear.

### Why drawings must be separated

If personal spending is recorded as expenses, profit looks smaller than it really is. That misleads the owner about how the business is doing, distorts any figures given to a bank, and can create serious problems with tax authorities, who may disallow personal costs claimed as business expenses.

### Profit in one line

\`\`\`text
Profit = Income - Expenses
\`\`\`

Drawings do not appear in this calculation. They are what the owner does with profit, or with capital, after it is earned. A business can be profitable and still run out of cash if the owner draws more than the business earns.
      `,
        [
          q('The owner pays a son\'s university fees from the shop account. How is it recorded?', [
            'As an expense for staff training',
            'As cost of goods sold',
            'As income for the shop',
            'As drawings by the owner',
          ], 3, 'Personal payments made from business funds are drawings, not business expenses.'),
          q('A business receives a bank loan of PKR 1,000,000. Why is this not income?', [
            'Loans are always recorded as an expense',
            'It must be repaid, so it is a liability',
            'Only cash sales count as any kind of money received',
            'Bank deposits are never recorded in the books',
          ], 1, 'A loan creates an obligation to repay, which is a liability rather than earned income.'),
          q('Recording personal spending as expenses has which effect?', [
            'Profit appears smaller than it really is',
            'Profit appears larger than it really is',
            'Assets increase by the same amount',
            'Liabilities are reduced automatically',
          ], 0, 'Extra expenses lower reported profit, misleading the owner, lenders and the tax authority.'),
        ]
      ),
      lesson('Debits and Credits Without Confusion', 14, `
Double-entry bookkeeping means every transaction is recorded in at least two accounts, with equal amounts on each side. The two sides are called **debit** (Dr) and **credit** (Cr). Forget what your bank uses these words to mean; in bookkeeping they simply mean left side and right side.

### The one rule to remember

Each type of account has a normal side, the side that increases it.

| Account type | Increases with | Decreases with |
|---|---|---|
| Assets | Debit | Credit |
| Expenses | Debit | Credit |
| Drawings | Debit | Credit |
| Liabilities | Credit | Debit |
| Equity / Capital | Credit | Debit |
| Income | Credit | Debit |

A popular memory aid is **DEAD CLIC**:

\`\`\`text
DEAD: Debit increases Expenses, Assets, Drawings
CLIC: Credit increases Liabilities, Income, Capital
\`\`\`

### Why the rule works

The rule comes straight from the expanded equation. Items on the left (assets) and items that reduce equity (expenses, drawings) sit on the debit side. Items on the right (liabilities, capital, income) sit on the credit side. When every transaction has equal debits and credits, the equation can never go out of balance.

### The T-account

A T-account is a sketch of one account, with debits on the left and credits on the right.

\`\`\`text
            Bank
  Dr                   Cr
  200,000 (capital)  |  40,000 (supplier)
   15,000 (sale)     |   8,000 (rent)
  ----------------------------------
  Balance 167,000 Dr
\`\`\`

Add each side, subtract the smaller from the larger, and the balance sits on the larger side. A bank account normally has a debit balance. If it shows a credit balance, the account is overdrawn.

### Why your bank seems to do the opposite

Your bank statement says "credit" when money comes into your account. That is because the bank records your account from its own point of view: your deposit is money the bank owes you, a liability for the bank, which increases with a credit. In your business's books, the same deposit increases your asset, which is a debit. Both are correct; they are simply two different sets of books.

### A three-step method for any transaction

1. **Which accounts are affected?** Name at least two.
2. **What type is each account, and is it going up or down?**
3. **Apply the rule** to decide debit or credit, and check the totals are equal.

Example: a Hyderabad printing shop pays PKR 12,000 for internet.

| Step | Answer |
|---|---|
| Accounts | Internet expense, Bank |
| Types and direction | Expense goes up; asset (bank) goes down |
| Debit / credit | Debit Internet expense 12,000; Credit Bank 12,000 |

### Common beginner mistakes

- Treating debit as "good" and credit as "bad". They are just sides.
- Recording only one side, such as the expense but not the bank reduction.
- Using the bank's perspective in the business's books.
- Forgetting that a decrease in a liability is a debit, for example paying off a supplier.

With practice, most everyday transactions become automatic. Software like QuickBooks Online creates the debits and credits for you when you enter an invoice or a bill, but you still need to understand them to fix errors and read reports correctly.
      `,
        [
          q('Which side increases an expense account?', [
            'Credit',
            'Debit',
            'Either side, depending on the amount',
            'Neither side, because expenses are never recorded',
          ], 1, 'Expenses follow the DEAD rule: debits increase expenses, assets and drawings.'),
          q('A business pays a supplier it owed. What happens to accounts payable?', [
            'It is credited, because payables increase with credits',
            'It is not affected because only the bank changes',
            'It is debited, because the liability goes down',
            'It moves into income because the debt is cleared',
          ], 2, 'Liabilities increase with credits, so a reduction in a liability is recorded as a debit.'),
          q('Why does a bank statement show a deposit as a credit?', [
            'The bank made an error that should be reported',
            'Deposits are income for every business',
            'Bank statements always use the business\'s own view',
            'To the bank, your balance is a liability it owes you',
          ], 3, 'The bank records your money as its liability, which increases with a credit.'),
        ]
      ),
      lesson('Recording Your First Transactions', 14, `
Now it is time to apply everything to a real month. Bilal opens a small mobile phone repair shop in Saddar, Karachi. Follow each transaction, identify the accounts, apply the debit and credit rule, then confirm the books balance.

### Bilal's first month

| # | Date | Event |
|---|---|---|
| 1 | 1 Mar | Bilal deposits PKR 300,000 of his savings into a business bank account |
| 2 | 2 Mar | Pays shop rent of PKR 45,000 by bank transfer |
| 3 | 4 Mar | Buys repair tools for PKR 60,000 on 30-day credit from a supplier |
| 4 | 10 Mar | Buys spare parts for PKR 25,000, paid from the bank |
| 5 | 15 Mar | Repairs phones for cash customers, receiving PKR 70,000 into the bank |
| 6 | 20 Mar | Repairs phones for a corporate client on credit, PKR 30,000 invoiced |
| 7 | 28 Mar | Pays the tools supplier PKR 20,000 |
| 8 | 30 Mar | Takes PKR 15,000 for personal use |

For simplicity, assume the spare parts were all used in repairs during March, so they are an expense.

### Working out each entry

| # | Debit | Credit | Amount |
|---|---|---|---|
| 1 | Bank | Capital | 300,000 |
| 2 | Rent expense | Bank | 45,000 |
| 3 | Equipment (tools) | Accounts payable | 60,000 |
| 4 | Spare parts expense | Bank | 25,000 |
| 5 | Bank | Repair income | 70,000 |
| 6 | Accounts receivable | Repair income | 30,000 |
| 7 | Accounts payable | Bank | 20,000 |
| 8 | Drawings | Bank | 15,000 |

Look at entry 6: no cash moved, yet income is recorded because the work was done. That is accrual basis in action, with the receivable showing what the client owes.

### Account balances at month end

\`\`\`text
Bank:        300,000 - 45,000 - 25,000 + 70,000 - 20,000 - 15,000 = 265,000 Dr
Receivable:  30,000 Dr
Equipment:   60,000 Dr
Payable:     60,000 - 20,000 = 40,000 Cr
Capital:     300,000 Cr
Income:      70,000 + 30,000 = 100,000 Cr
Rent:        45,000 Dr
Spare parts: 25,000 Dr
Drawings:    15,000 Dr
\`\`\`

### Checking that it balances

Add every debit balance and every credit balance:

| Debit balances | Amount | Credit balances | Amount |
|---|---|---|---|
| Bank | 265,000 | Accounts payable | 40,000 |
| Accounts receivable | 30,000 | Capital | 300,000 |
| Equipment | 60,000 | Repair income | 100,000 |
| Rent expense | 45,000 | | |
| Spare parts expense | 25,000 | | |
| Drawings | 15,000 | | |
| **Total** | **440,000** | **Total** | **440,000** |

Both columns total 440,000. Equal totals do not prove every entry is correct, since a payment posted to the wrong expense would still balance, but unequal totals always prove there is a mistake.

### What Bilal learns from his books

- Profit for March is income 100,000 minus expenses 70,000, which is **30,000**.
- He took 15,000 in drawings, so half the profit stayed in the business.
- He still owes the tools supplier 40,000 and is owed 30,000 by the corporate client.

None of this is visible from the bank balance alone. That is the practical payoff of double entry.

### Practise the habit

When you first start, write each transaction in a simple table like the one above before entering it anywhere. Name the accounts, decide debit or credit, and check equal amounts. After a few dozen transactions you will do it in your head, and when you later use software you will understand every entry it creates.
      `,
        [
          q('Bilal invoices a corporate client PKR 30,000 for repairs not yet paid. What is the entry?', [
            'Debit accounts receivable, credit repair income',
            'Debit bank, credit repair income',
            'Debit repair income, credit accounts receivable',
            'No entry until the client pays the invoice',
          ], 0, 'Under accrual the income is earned when the work is done, and the unpaid amount is a receivable.'),
          q('The debit and credit totals agree. What can you conclude?', [
            'Every transaction is definitely posted to the right account',
            'The business made a profit for the month',
            'The bank balance must equal the total debits',
            'No one-sided error exists, though some errors may remain',
          ], 3, 'Equal totals rule out one-sided errors, but a payment posted to the wrong account still balances.'),
          q('Bilal pays PKR 20,000 to the tools supplier he owes. Which entry is correct?', [
            'Debit equipment, credit bank',
            'Debit bank, credit accounts payable',
            'Debit accounts payable, credit bank',
            'Debit tools expense, credit capital',
          ], 2, 'Paying a supplier reduces the liability (debit) and reduces the bank asset (credit).'),
        ]
      ),
      ],
      [
      q('Which pair of accounts both increase with a debit?', [
        'Income and capital',
        'Liabilities and income',
        'Capital and liabilities',
        'Assets and drawings',
      ], 3, 'Under DEAD CLIC, debits increase expenses, assets and drawings.'),
      q('An owner adds PKR 100,000 of savings to the business bank account. What is the entry?', [
        'Debit bank, credit capital',
        'Debit capital, credit bank',
        'Debit bank, credit income',
        'Debit drawings, credit bank',
      ], 0, 'Owner contributions increase the bank asset and the owner\'s capital, not income.'),
      q('A business buys a laptop to use for three years. How is it treated when bought?', [
        'As an expense in full in the month it is bought',
        'As an asset, expensed gradually through depreciation',
        'As drawings because the owner chose it',
        'As a liability until the laptop is fully worn out',
      ], 1, 'Items used over several years are assets, and their cost is spread over their useful life.'),
      q('Income of PKR 250,000, expenses of PKR 180,000 and drawings of PKR 40,000. What is profit?', [
        'PKR 30,000',
        'PKR 110,000',
        'PKR 70,000',
        'PKR 470,000',
      ], 2, 'Profit is income minus expenses; drawings are not an expense and do not reduce profit.'),
      ]
    ),
    chapter(
      'Chart of Accounts, Journals and Ledgers',
      'Design a chart of accounts that fits a real small business, write proper journal entries with narrations, post them to the general ledger with running balances, and use the trial balance to find and correct common errors.',
      [
      lesson('Designing a Chart of Accounts', 13, `
The chart of accounts is the list of every account a business uses to record its transactions. It is the filing cabinet of the books: each transaction goes into named drawers, and reports are built by adding up what is in each drawer. A well designed chart makes every later task easier.

### The standard structure

Accounts are grouped in the same order as the financial statements, and each group gets a number range. A common pattern:

| Range | Group | Examples |
|---|---|---|
| 1000 to 1999 | Assets | Cash in hand, Meezan Bank current account, Accounts receivable, Inventory, Equipment |
| 2000 to 2999 | Liabilities | Accounts payable, Wages payable, Sales tax payable, Bank loan |
| 3000 to 3999 | Equity | Owner's capital, Drawings, Retained earnings |
| 4000 to 4999 | Income | Product sales, Service income, Delivery charges recovered |
| 5000 to 5999 | Cost of sales | Purchases of goods, Freight inward, Packaging |
| 6000 to 6999 | Operating expenses | Rent, Salaries, Electricity, Internet, Marketing, Bank charges |

Numbers are not compulsory, and some software hides them by default, but they keep accounts in a logical order and make it easy to add new ones in the right place.

### Leave gaps when numbering

Number accounts in steps, such as 6010, 6020, 6030, rather than 6001, 6002, 6003. When a client later starts paying for a co-working space or a software subscription, you can add 6015 or 6025 next to related costs without renumbering everything.

### How detailed should it be?

Too few accounts and reports tell the owner nothing; too many and every entry becomes a guessing game. A useful test is: **will anyone make a decision based on this number?**

| Too vague | About right | Too detailed |
|---|---|---|
| Expenses | Electricity, Gas, Water | Electricity for the front counter light |
| Sales | Clothing sales, Alteration fees | Sales of blue shirts size M |

Detail about individual products, customers or projects usually belongs elsewhere: in product lists, customer records, or tags and classes in software, not in extra accounts.

### Tailor it to the business

A Lahore restaurant, a Karachi software house and a Sialkot sports goods exporter need different accounts:

- **Restaurant**: Food sales, Delivery app sales, Food cost, Gas, Kitchen staff wages, Delivery app commissions.
- **Software house**: Project income, Retainer income, Contractor costs, Software subscriptions, Hosting.
- **Exporter**: Export sales, Raw materials, Factory wages, Freight outward, Bank charges on foreign receipts, Foreign exchange gains and losses.

Start from a standard template, then delete what will never be used and add what the business truly needs.

### Special accounts worth having

- **Separate bank accounts**: one account in the chart for every real bank account and mobile wallet, so each can be reconciled.
- **Suspense or "Ask the client"**: a temporary holding account for transactions you cannot yet identify. It should be cleared to zero at every month end.
- **Opening balance equity**: used by some software when setting up starting balances. It should also be cleared once setup is complete.
- **Tax accounts**: separate liability accounts for each kind of tax collected or withheld, so amounts owed are clear.

### Naming rules

Use clear, plain names that the owner understands. Write "Electricity" instead of "Utility exp 2". Avoid personal names in account names, except for owner capital and drawings. Keep naming consistent, and do not create two accounts that mean the same thing, such as "Advertising" and "Marketing", unless the business really separates them.

### Changing the chart later

You can add accounts at any time. Renaming or merging accounts mid-year can confuse comparisons, so do it at a clean point such as the start of a financial year, and note what changed. Never delete an account that already has transactions; make it inactive instead.
      `,
        [
          q('Why leave gaps such as 6010, 6020 when numbering accounts?', [
            'So new accounts can be inserted next to related ones later',
            'Because software rejects accounts with consecutive numbers',
            'To make the trial balance totals larger',
            'Because tax authorities require gaps in numbering',
          ], 0, 'Gaps allow new accounts to fit in the right group without renumbering the whole chart.'),
          q('What is the best way to track sales of individual products?', [
            'Create a separate income account for every single product',
            'Record all product sales in a suspense account',
            'Use one account named Expenses for everything',
            'Use product lists or tags rather than extra accounts',
          ], 3, 'Product-level detail belongs in item lists or tags, keeping the chart of accounts manageable.'),
          q('What should happen to a suspense account at month end?', [
            'It should hold the business\'s largest balance',
            'It should be investigated and cleared to zero',
            'It should be renamed to Miscellaneous income',
            'It should be closed into the owner\'s drawings',
          ], 1, 'Suspense is temporary; every item in it must be identified and moved to the correct account.'),
        ]
      ),
      lesson('The General Journal and Journal Entries', 13, `
A journal is the book of first entry. Before anything reaches the ledger accounts, it is written in date order in a journal, showing which accounts are debited and credited and why. Software keeps the journal for you behind the scenes, but every bookkeeper still writes manual journal entries for adjustments and corrections, so the format must become second nature.

### The format of a journal entry

Every entry has the same parts:

| Part | Purpose |
|---|---|
| Date | When the transaction happened |
| Reference | Invoice number, bill number or journal number |
| Account debited | With the amount |
| Account credited | With the amount, usually indented |
| Narration | A short note explaining the entry |

By convention, debits are listed first and credits below them.

\`\`\`text
Date        Ref     Account                     Dr        Cr
05-04-2026  JV-014  Office supplies           6,500
                       Bank - Meezan                    6,500
            Narration: Printer paper and toner, receipt 7781,
            Paramount Stationers, Rawalpindi
\`\`\`

### Why the narration matters

The narration is the most neglected part of the entry and the most valuable months later. "Payment" tells nobody anything. "Advance rent for May, shop 12, Liberty Market, cheque 004512" tells a reviewer exactly what happened and where to find the evidence. Write narrations for a stranger who knows nothing about the business.

### Compound entries

Some transactions affect more than two accounts. A compound entry has several debits, several credits, or both, but the totals must still be equal.

Example: a Gujranwala electrical shop buys stock costing PKR 150,000, paying PKR 50,000 now and owing the rest.

\`\`\`text
Date        Ref      Account                  Dr         Cr
12-04-2026  BL-0091  Inventory              150,000
                        Bank - HBL                       50,000
                        Accounts payable                100,000
            Narration: Wires and switches from Shah Traders,
            bill 3302, part paid by transfer
\`\`\`

### Special journals

Businesses with many similar transactions often split the journal into specialised books:

| Journal | Records |
|---|---|
| Sales journal | Credit sales |
| Purchases journal | Credit purchases |
| Cash book | Receipts and payments through cash and bank |
| General journal | Everything else: adjustments, corrections, opening entries |

In modern software, invoices, bills and payments act as these special journals automatically. The **general journal** remains, and you will use it for depreciation, accruals, corrections and opening balances.

### Rules for good journal entries

1. **Always balanced.** Total debits must equal total credits.
2. **One event per entry.** Do not bundle unrelated transactions together just to save time.
3. **Evidence attached or referenced.** The reference should point to a document someone can find.
4. **Never erase.** If an entry is wrong, reverse it with a new entry and then record the correct one. In software, editing may be possible, but in a closed period a reversing entry keeps the history clear.
5. **Use journals sparingly in software.** If a transaction can be entered as an invoice, bill or payment, use that form instead, because it updates customer and supplier records too.

### A quick practice

Write the journal entry for this: on 20 April, a client in Quetta pays PKR 18,000 for an invoice issued in March, by bank transfer to UBL.

\`\`\`text
20-04-2026  RCPT-221  Bank - UBL             18,000
                         Accounts receivable           18,000
            Narration: Payment of invoice INV-0457, Kakar Traders
\`\`\`

Income is not credited again, because it was already recorded when the invoice was raised in March.
      `,
        [
          q('In a journal entry, what is the purpose of the narration?', [
            'To show the total of all entries for the month',
            'To explain what happened so a reviewer can understand it later',
            'To list every account number used in the business in order',
            'To replace the need for keeping any source document on file',
          ], 1, 'The narration explains the transaction and points to the evidence for anyone reviewing it.'),
          q('A shop buys stock for PKR 150,000, paying 50,000 now and owing the rest. What kind of entry is this?', [
            'A reversing entry that cancels an earlier posting',
            'An opening balance entry for a brand new business',
            'A compound entry with one debit and two credits',
            'A suspense entry pending more information',
          ], 2, 'It debits inventory once and credits both bank and accounts payable, totalling the same amount.'),
          q('An entry in a closed period was posted to the wrong account. What is the cleanest fix?', [
            'Erase it and write over the original line',
            'Ignore it because the totals still balance',
            'Delete the source document to match the books',
            'Post a reversing entry and then the correct one',
          ], 3, 'Reversing and re-posting keeps a clear history of what was changed and why.'),
        ]
      ),
      lesson('Posting to the General Ledger', 13, `
The journal tells you what happened in date order. The general ledger tells you what is in each account. Posting is the step of copying each journal line into the ledger account it belongs to, so you can see the balance of every account at any time.

### What a ledger account looks like

The running balance format is the one you will see in software and in most offices today:

\`\`\`text
Account: 1110 Bank - Meezan
Date     Ref      Description                 Dr        Cr      Balance
01-05    OB       Opening balance                                210,000 Dr
03-05    RCPT-30  Payment from Raza Foods   45,000              255,000 Dr
05-05    BILL-88  Rent, May                           60,000    195,000 Dr
09-05    PAY-12   K-Electric bill                     14,200    180,800 Dr
15-05    RCPT-31  Cash sales deposited      38,500              219,300 Dr
\`\`\`

Each line comes from one journal entry, and the reference lets you trace it back.

### The posting process step by step

1. Take a journal entry.
2. For each debit line, go to that account in the ledger and enter the amount in the debit column with the date, reference and a short description.
3. For each credit line, do the same in the credit column of that account.
4. Update the running balance.
5. Mark the journal entry as posted, often with a tick or the ledger page number, so nothing is posted twice or missed.

### Posting a full entry

Journal entry:

\`\`\`text
18-05  INV-210  Accounts receivable  85,000
                   Service income            85,000
       Narration: Website build for Noor Clinic, Phase 1
\`\`\`

This one entry becomes two ledger lines:

| Ledger account | Date | Ref | Dr | Cr |
|---|---|---|---|---|
| Accounts receivable | 18-05 | INV-210 | 85,000 | |
| Service income | 18-05 | INV-210 | | 85,000 |

### Subsidiary ledgers

The general ledger has one Accounts receivable account, but you also need to know which customer owes what. That detail lives in a **subsidiary ledger**, a separate record for each customer. The same applies to suppliers.

| Customer ledger | Balance |
|---|---|
| Noor Clinic | 85,000 |
| Raza Foods | 12,000 |
| Kakar Traders | 0 |
| **Total** | **97,000** |

The total of all customer balances must equal the Accounts receivable balance in the general ledger. That general ledger account is called a **control account**. If the two do not agree, something was posted to one but not the other.

### Reading balances correctly

Every account has a normal balance side. If an account shows the opposite side, investigate:

- A bank account with a credit balance means an overdraft or an error.
- An expense with a credit balance usually means a refund was posted wrongly or an entry was reversed twice.
- A customer with a credit balance may have overpaid or paid twice.

### What software changes

In QuickBooks Online and similar tools, posting happens instantly when you save a transaction. You never write ledger lines by hand. But the ledger still exists: the General Ledger report and the account history screens show exactly the layout above. When a client asks why an account balance looks wrong, you open that ledger, scan the lines, and trace each one to its source. Understanding manual posting is what lets you do that confidently.
      `,
        [
          q('What does the general ledger show that the journal does not?', [
            'The written narration explaining each transaction',
            'The exact date on which each transaction happened',
            'The reference numbers of source documents',
            'The running balance of each individual account',
          ], 3, 'The journal lists entries in date order; the ledger groups them by account with balances.'),
          q('Customer balances add up to 97,000 but the receivable control account shows 102,000. What does this suggest?', [
            'Something was posted to one record but not the other',
            'The business has made a profit of 5,000',
            'The trial balance must be fully correct',
            'The extra 5,000 is automatically treated as income',
          ], 0, 'The control account must equal the total of the subsidiary ledger, so a difference signals a posting error.'),
          q('An expense account shows a credit balance. What is the most sensible first step?', [
            'Leave it, since credit balances are normal for expenses',
            'Move the balance into the suspense account permanently',
            'Check for wrongly posted refunds or double reversals',
            'Rename the account as an income account',
          ], 2, 'Expenses normally carry debit balances, so a credit balance points to a posting mistake to investigate.'),
        ]
      ),
      lesson('The Trial Balance and Finding Errors', 14, `
A trial balance is a list of every ledger account and its balance at a date, with debit balances in one column and credit balances in another. If double entry was followed, the two columns total the same. It is the bookkeeper's first check before preparing financial statements.

### A sample trial balance

\`\`\`text
Trial balance of Hamza Electronics as at 31 May 2026
Account                     Dr          Cr
Bank                     219,300
Accounts receivable       97,000
Inventory                180,000
Equipment                120,000
Accounts payable                     110,000
Bank loan                            150,000
Owner's capital                      250,000
Sales                                290,000
Cost of goods sold       140,000
Rent                      60,000
Salaries                  55,000
Electricity               14,200
Drawings                  20,000
Bank charges                 500
                         -------     -------
Total                    906,000     800,000
\`\`\`

The columns do not agree: debits exceed credits by 106,000. Something is wrong.

### Errors the trial balance catches

| Error | Example |
|---|---|
| One-sided posting | Debit posted to rent, credit never posted to bank |
| Unequal amounts | Debit 5,400, credit 4,500 |
| Wrong side | A credit balance listed in the debit column |
| Addition mistake | A ledger column totalled wrongly |
| Balance left out | An account forgotten when listing the trial balance |

### Errors the trial balance does not catch

These leave debits and credits equal, so the totals still agree:

| Error | Example |
|---|---|
| Omission | A bill never entered at all |
| Commission | Payment to supplier A posted to supplier B's account |
| Principle | A new computer recorded as an expense instead of an asset |
| Original entry | Both sides entered as 4,500 when the bill was 5,400 |
| Reversal | Debit and credit swapped |
| Compensating | Two separate errors that cancel each other out |

This is why reconciliations and reviews are still needed even when the trial balance agrees.

### A method for finding a difference

1. **Calculate the difference** and halve it. Look for a balance of that half amount in the wrong column. Here the difference is 106,000; half is 53,000. No such balance exists, so check further.
2. **Check whether the difference matches an account balance.** A missing account would create a difference equal to its balance.
3. **Check whether the difference is divisible by 9.** If it is, a transposition such as 54 written as 45 is likely.
4. **Re-add each column** and each ledger account.
5. **Trace postings** from the journal to the ledger for the period, ticking each one.

In Hamza's case, the receivable balance is correct, but the 110,000 in accounts payable should be 216,000: a supplier bill of 106,000 was debited to inventory but never credited to payables. Posting the missing credit makes both columns total 906,000.

### Correcting errors properly

Correct with journal entries, not by changing figures directly:

\`\`\`text
Error: Computer of 95,000 debited to Office expenses
Fix:   Dr Equipment          95,000
          Cr Office expenses           95,000
Narration: Reclassify laptop bought 08-05, bill 4471, to fixed assets
\`\`\`

### When to run a trial balance

Run it at least monthly, before preparing statements, and any time something looks odd. In software it is one click, and it will almost always balance, because software forces every entry to balance. That is exactly why, in software, the errors you hunt for are mostly the ones from the second table: the ones a balanced trial balance cannot reveal.
      `,
        [
          q('A supplier payment was posted to the wrong supplier\'s account. Will the trial balance show it?', [
            'Yes, the totals will differ by twice the amount',
            'No, because debits and credits remain equal',
            'Yes, the difference will be divisible by 9',
            'No, because supplier accounts are left out of it',
          ], 1, 'An error of commission puts the amount in the wrong account of the same type, so totals still agree.'),
          q('Credits exceed debits by 3,000 on the trial balance. Why is it worth looking for a debit balance of 1,500?', [
            'Every difference must be split evenly between two accounts',
            'Software always halves an error when it posts the entry',
            'A 1,500 debit listed as a credit creates a 3,000 gap',
            'A balance of 1,500 is the largest one the ledger allows',
          ], 2, 'Listing a balance in the wrong column removes it from one side and adds it to the other, so the gap is twice the balance.'),
          q('A new computer was recorded as office expenses. What type of error is this?', [
            'An error of principle',
            'An error of transposition',
            'A one-sided posting error',
            'An addition error in the ledger',
          ], 0, 'Recording an asset as an expense uses the wrong class of account, which is an error of principle.'),
        ]
      ),
      ],
      [
      q('Which number range in a common chart of accounts usually holds liabilities?', [
        '1000 to 1999',
        '2000 to 2999',
        '4000 to 4999',
        '6000 to 6999',
      ], 1, 'In the common pattern, assets come first in the 1000s and liabilities follow in the 2000s.'),
      q('An account has old transactions but is no longer needed. What should you do?', [
        'Delete it so the chart stays short',
        'Merge it into suspense without a note',
        'Rename it as a new account for other costs',
        'Make it inactive rather than delete it',
      ], 3, 'Deleting an account with history damages past records; making it inactive keeps the history.'),
      q('Which statement about the trial balance is correct?', [
        'Equal totals do not prove that every entry is in the right account',
        'Equal totals prove the books are completely correct',
        'The trial balance includes only bank and cash accounts',
        'The trial balance replaces the need for reconciliations',
      ], 0, 'Several kinds of error keep debits equal to credits, so further checks are always needed.'),
      q('A customer pays an invoice raised last month. Which accounts does the receipt entry use?', [
        'Debit bank, credit service income',
        'Debit service income, credit bank',
        'Debit bank, credit accounts receivable',
        'Debit accounts receivable, credit bank',
      ], 2, 'The income was recorded with the invoice, so the receipt only clears the receivable into the bank.'),
      ]
    ),
    chapter(
      'Sales, Invoices and Accounts Receivable',
      'Record the full sales cycle correctly: quotes, invoices and sales receipts, customer payments including partial and short payments, credit notes, discounts and refunds, then use an aged receivables report to chase late payers and deal with debts that will never be paid.',
      [
      lesson('Quotes, Invoices and Sales Receipts', 13, `
Sales are where money enters a business, so they deserve careful records. Three documents cover almost every sale: the quote, the invoice and the sales receipt. Each has a different job and a different effect on the books.

### The three documents compared

| Document | When it is used | Entry in the books |
|---|---|---|
| Quote (estimate) | Before the customer agrees to buy | None |
| Invoice | Goods or services supplied, payment due later | Dr Accounts receivable, Cr Sales |
| Sales receipt | Customer pays at the time of sale | Dr Bank or Cash, Cr Sales |

### Quotes

A quote states what will be supplied, at what price and on what terms. It is a promise, not a sale, so nothing is recorded in the ledger. Keep quotes anyway: when the customer accepts, the quote becomes the basis for the invoice, and any argument about the agreed price is settled by what the quote said.

A good quote includes an expiry date, such as "valid for 15 days", because the cost of materials, fuel and imported parts can change quickly.

### Invoices

An invoice is a formal request for payment after you have delivered. It creates a receivable: the customer now owes the business. A complete invoice shows:

- Your business name, address and contact details, plus any tax registration number if registered.
- The customer's name and address.
- A unique invoice number in sequence, such as INV-0458.
- Invoice date and due date.
- A description of each item or service, quantity, rate and line total.
- Any tax shown separately, with the total payable.
- Payment instructions: bank account title, IBAN, and accepted wallets.

Never reuse or skip invoice numbers without a note. A clean sequence shows that no sales were left out, which matters to auditors and tax officers.

### Tax on invoices

If a business is registered for sales tax, the invoice usually has to show particular details, such as the registration numbers and the tax amount. Some authorities also require certain retailers to issue invoices through approved systems linked to the authority. These requirements differ by country, province and business type in Pakistan, and they change, so check current rules with FBR or the relevant provincial authority, such as the Punjab Revenue Authority or the Sindh Revenue Board, before designing a client's invoice template.

When tax is charged, it is not income for the business. It is collected on behalf of the government:

\`\`\`text
Invoice INV-0458: Services 100,000 plus tax at an illustrative 10,000

Dr Accounts receivable   110,000
   Cr Service income               100,000
   Cr Sales tax payable             10,000
\`\`\`

The rate in this example is only for illustration; always use the current rate that applies to the specific service.

### Sales receipts

When a customer pays on the spot, as in a pharmacy, restaurant or retail counter, there is no receivable. You record a sales receipt directly into the bank or cash account. A busy shop does not need one entry per customer: a daily summary from the till or point of sale system, split by payment method, is the usual approach.

| Daily summary, Al Madina Store, 14 June | Amount |
|---|---|
| Cash sales | 42,300 |
| Card sales | 18,750 |
| Wallet sales (JazzCash, Easypaisa) | 9,950 |
| **Total sales** | **71,000** |

Each payment method goes to its own account, so cash can be counted, card settlements can be matched and wallet balances can be reconciled.

### Credit terms

Payment terms state when an invoice is due. "Due on receipt" means immediately. "Net 30" means within 30 days of the invoice date. Agree terms before work starts and print them on every invoice. Clear terms are the first step in getting paid on time, and they make the aged receivables report meaningful.
      `,
        [
          q('A customer accepts a quote but the work has not started. What entry is made?', [
            'Debit accounts receivable, credit sales for the quoted amount',
            'Debit bank, credit sales as if it were already paid',
            'Debit sales, credit accounts receivable for the quote',
            'No entry until goods or services are supplied',
          ], 3, 'A quote is only an offer; the sale is recorded when the invoice is raised after delivery.'),
          q('Why does sales tax shown on an invoice go to a liability account?', [
            'Because it is the business\'s income for the month',
            'Because it is collected on behalf of the government',
            'Because customers never actually pay the tax portion',
            'Because tax is always refunded at the end of the year',
          ], 1, 'Sales tax collected is owed to the tax authority, so it is a liability, not income.'),
          q('A busy shop has hundreds of cash customers a day. What is the usual way to record sales?', [
            'One invoice for every customer with a due date',
            'A single monthly entry estimated from memory',
            'A daily summary split by payment method',
            'No entry until the bank statement arrives',
          ], 2, 'A daily summary by payment method is accurate and lets each cash, card and wallet account be checked.'),
        ]
      ),
      lesson('Recording Customer Payments', 13, `
When a customer pays an invoice, the receivable becomes cash. The entry is simple, but real payments are often messy: partial payments, one transfer covering several invoices, bank charges deducted, or tax withheld by the customer. Each needs to be recorded so the customer's balance stays correct.

### The basic payment entry

\`\`\`text
Dr Bank                   50,000
   Cr Accounts receivable          50,000
Narration: Payment of INV-0461, Ali Builders, IBFT ref 88213
\`\`\`

Always link the payment to the specific invoice it settles. In software this is done by ticking the invoice when receiving the payment. If you skip this, the invoice stays open and the customer appears to owe money they already paid.

### Partial payments

A customer may pay part of an invoice now and the rest later. Record the amount actually received against the invoice. The invoice stays open with the balance due.

| Invoice | Total | Paid 5 July | Balance |
|---|---|---|---|
| INV-0462 | 120,000 | 70,000 | 50,000 |

### One payment for several invoices

Corporate customers often pay several invoices in one transfer. Split the payment across the invoices it covers, using the customer's remittance advice, which is the note or email that lists what they paid. If there is no remittance advice, apply the payment to the oldest invoices first and confirm with the customer.

### Bank charges deducted

International payments and some local transfers arrive with fees deducted. If a client in Dubai pays a 500 US dollar invoice but only 485 reaches the account, the customer still settled the full invoice; the difference is a bank charge.

\`\`\`text
Dr Bank (amount received)     485
Dr Bank charges expense        15
   Cr Accounts receivable            500
\`\`\`

Amounts shown in dollars here for clarity; in the books they are converted to rupees at the rate on the relevant date. Exchange differences between the invoice date and the payment date are a separate topic for an accountant to advise on.

### Tax withheld by the customer

In Pakistan and many other countries, companies and government bodies are often required to withhold income tax from payments for services or supplies and pay it to the tax authority. The customer pays you the net amount and gives you a withholding certificate. The invoice is still fully settled, and the tax withheld is usually recorded as an asset, since it may be adjusted against the business's own tax liability.

\`\`\`text
Invoice 200,000. Customer withholds tax and pays the net amount.

Dr Bank                                 (net amount received)
Dr Advance income tax / Tax withheld    (amount on certificate)
   Cr Accounts receivable                200,000
\`\`\`

Withholding rates and who must withhold depend on the type of payment, the status of the payee and the current law, and they change with budgets. Never guess the amount: record what the certificate shows, keep the certificate safely, and refer questions about rates or adjustments to a tax adviser or FBR guidance.

### Overpayments and unidentified receipts

If a customer pays more than they owe, the extra creates a credit balance on their account. You can apply it to the next invoice or refund it. If money arrives and you cannot tell who sent it, record it in a suspense account and ask the client the same day; do not guess which customer it belongs to.

### Undeposited funds

When cash or cheques are collected but not yet banked, many systems first record them in a holding account, often called **undeposited funds**, and then move them to the bank as one deposit. That way the books match the single deposit line on the bank statement.

| Collected 10 July | Amount |
|---|---|
| Cheque from Ali Builders | 50,000 |
| Cash from Hassan Traders | 22,000 |
| **Deposit on 11 July** | **72,000** |
      `,
        [
          q('A customer pays a 500 dollar invoice and 485 arrives after bank fees. How much of the invoice is settled?', [
            'The full 500, with 15 recorded as bank charges',
            'Only 485, leaving 15 still owed by the customer',
            'Nothing until the customer pays the missing fee',
            '485, with the 15 recorded as extra income',
          ], 0, 'The customer paid the full amount; the bank\'s deduction is an expense of the business.'),
          q('A corporate client withholds income tax and sends a certificate. How is the withheld amount usually recorded?', [
            'As a bad debt written off immediately against the customer',
            'As extra income for the business in the month it was withheld',
            'As an asset, since it may be adjusted against the business\'s tax',
            'As an unpaid balance the customer still owes',
          ], 2, 'Tax withheld and evidenced by a certificate is usually an asset that may be adjusted against the business\'s own tax.'),
          q('Money arrives in the bank and nobody knows who sent it. What should the bookkeeper do?', [
            'Apply it to the customer with the biggest balance',
            'Record it as other income and close the matter',
            'Leave it out of the books until year end',
            'Hold it in suspense and ask the client promptly',
          ], 3, 'Guessing can wrongly clear a customer\'s balance; suspense keeps it visible until identified.'),
        ]
      ),
      lesson('Credit Notes, Discounts and Refunds', 13, `
Not every sale ends with the full invoice being paid. Goods come back, prices are reduced after a complaint, customers pay early for a discount, or money is refunded. Each of these reduces what the customer owes or what they paid, and each must be recorded properly instead of simply editing the original invoice.

### Credit notes

A credit note is a document that reduces an invoice. It is the reverse of an invoice and should have its own number sequence, such as CN-0012, and refer to the original invoice number.

Example: a Sialkot sports goods supplier invoices a shop for 100 footballs at PKR 1,500 each. Ten arrive damaged and are returned.

\`\`\`text
Invoice INV-0510:  100 x 1,500 = 150,000
Credit note CN-0012 for 10 returned balls: 15,000

Dr Sales returns             15,000
   Cr Accounts receivable            15,000
\`\`\`

The customer now owes 135,000. Many businesses use a separate **Sales returns and allowances** account rather than debiting sales directly, so the owner can see how much is being returned and why. If tax was charged on the original invoice, the tax part is usually reversed on the credit note too, subject to the authority's rules on credit notes.

### Why not just edit the invoice?

If the invoice is from an earlier period, editing it changes reports that were already shared with the owner, the bank or the tax authority. A credit note keeps the original record intact and shows clearly what changed and when. In a current, open period, some businesses do edit a draft invoice that was never sent, which is fine, but once an invoice has gone to the customer, use a credit note.

### Types of discount

| Discount | What it is | How it is recorded |
|---|---|---|
| Trade discount | Price reduction agreed before the sale, such as 10% for wholesalers | Not recorded separately; invoice is simply at the lower price |
| Early payment discount | Reduction offered for paying early, such as 2% if paid in 10 days | Recorded when taken, as a discount allowed expense or a reduction of sales |
| Promotional discount | Eid or seasonal offer shown on the invoice | Shown on the invoice; net sale recorded, or discount shown as a line for tracking |

For an early payment discount taken by the customer:

\`\`\`text
Invoice 50,000, 2% discount for payment within 10 days. Customer pays 49,000.

Dr Bank                        49,000
Dr Discount allowed             1,000
   Cr Accounts receivable              50,000
\`\`\`

Without the discount entry, the invoice would show 1,000 still owing, and someone would chase the customer for money they were never meant to pay.

### Refunds

A refund is money paid back to a customer. It usually follows a credit note or an overpayment. The credit note reduces the receivable; the refund pays out the resulting credit balance.

\`\`\`text
Customer had paid 150,000 in full. Credit note of 15,000 issued.

Step 1, credit note:  Dr Sales returns 15,000 / Cr Accounts receivable 15,000
Step 2, refund:       Dr Accounts receivable 15,000 / Cr Bank 15,000
\`\`\`

After both steps the customer's balance is zero, sales are reduced by 15,000, and the bank shows the money going out.

### Good practice

- Require a reason for every credit note, written in its description.
- Have someone other than the person who raised the invoice approve credit notes above an agreed amount. Unchecked credit notes are a common way for staff to hide missing cash.
- Review the sales returns account monthly. A rising balance may point to quality problems or to a particular customer who returns too much.
      `,
        [
          q('An invoice already sent to a customer last month needs reducing. What should be issued?', [
            'A new invoice for a higher amount',
            'A credit note referring to the original invoice',
            'An edit to the original invoice amount',
            'A refund before anything else is recorded',
          ], 1, 'A credit note keeps the original record intact and documents the reduction clearly.'),
          q('A wholesaler always gets 10% off the list price, agreed before the sale. How is this trade discount recorded?', [
            'The invoice is simply raised at the lower price',
            'As a separate discount allowed expense each time',
            'As a credit note issued after every invoice',
            'As a refund paid from the bank each month',
          ], 0, 'Trade discounts are part of the agreed price, so the invoice is recorded at the reduced amount.'),
          q('Why should someone else approve large credit notes?', [
            'Because software cannot create credit notes alone',
            'Because customers prefer two signatures on paper',
            'Because tax law requires two approvers everywhere',
            'Because unchecked credit notes can hide missing cash',
          ], 3, 'A credit note reduces what a customer owes, so it can be misused to cover cash taken from the business.'),
        ]
      ),
      lesson('Aged Receivables and Chasing Late Payments', 14, `
Recording sales is only half the job. A business that sells on credit must also collect, and late payment is one of the most common reasons small businesses in Pakistan and elsewhere run short of cash even when they are profitable. The aged receivables report is the bookkeeper's main tool for keeping collections under control.

### What the aged receivables report shows

It lists every customer who owes money, split by how long each amount has been outstanding past its due date.

\`\`\`text
Aged receivables, Zainab Interiors, as at 30 June
Customer          Current   1-30    31-60   61-90   90+     Total
Bahria Homes       80,000   40,000      0       0      0   120,000
Gulberg Cafe            0   25,000  15,000      0      0    40,000
Khan Residence          0        0       0  60,000      0    60,000
DHA Office Fitout  50,000        0       0       0  35,000   85,000
Total             130,000   65,000  15,000  60,000  35,000  305,000
\`\`\`

"Current" means not yet due. The columns to the right are increasingly overdue. The older an amount gets, the less likely it is to be collected.

### Reading the report

- **Khan Residence** owes 60,000 that is two to three months overdue, with no newer sales. Was there a dispute, or has the customer simply stopped paying?
- **DHA Office Fitout** has a current invoice but also 35,000 over 90 days. The old amount may be a disputed item. Should more work be done for them before it is resolved?
- **Gulberg Cafe** is drifting: amounts are moving from one bucket to the next.

Run the report at least monthly, and weekly for businesses with many credit customers.

### A simple collection routine

| Stage | Action |
|---|---|
| Before due date | Friendly reminder with a copy of the invoice and payment details |
| 1 to 7 days overdue | Polite message or call asking when payment will be made |
| 8 to 30 days overdue | Firmer follow-up, statement of account, ask for a payment date in writing |
| 31 to 60 days overdue | Owner speaks to owner; consider pausing further credit |
| Over 60 days | Formal letter, payment plan, or advice on recovery options |

A short, polite WhatsApp message often works better than a long email:

\`\`\`text
Assalam o Alaikum Sajid sahib, a gentle reminder that invoice
INV-0472 for PKR 25,000 was due on 15 June. Bank details are on
the attached copy. Could you let us know when to expect payment?
Thank you, Zainab Interiors
\`\`\`

### Statements of account

A statement lists every invoice, payment and credit note for one customer over a period and shows the closing balance. Sending statements monthly lets customers spot invoices they missed and catches disagreements early, while documents are still easy to find.

### When a debt will not be paid

Sometimes a customer closes down, disappears or refuses to pay after every effort. Keeping that amount in receivables overstates the business's assets. With the owner's approval, the debt is written off:

\`\`\`text
Dr Bad debts expense         35,000
   Cr Accounts receivable            35,000
Narration: Write off INV-0398, DHA Office Fitout, uncollectable
after legal notice, approved by owner 30 June
\`\`\`

If the customer later pays, the write-off is reversed and the payment recorded. Whether a bad debt can be deducted for tax, and what evidence is needed, depends on tax law that varies and changes, so the client's tax adviser should confirm before the return is filed.

### Prevention beats collection

The best collections work happens before the sale: clear terms on every quote and invoice, deposits for large or custom jobs, credit limits for regular customers, and stopping credit for customers who are already far behind. A bookkeeper who shows the owner a clean aged receivables report every month helps the business make these decisions with facts instead of feelings.
      `,
        [
          q('What does the 61 to 90 column in an aged receivables report show?', [
            'Invoices issued in the last 61 to 90 days that are not due',
            'Customers who paid within 61 to 90 days of invoicing',
            'Amounts overdue by between 61 and 90 days past the due date',
            'The total sales made to each customer over the last quarter',
          ], 2, 'Each column groups unpaid amounts by how long they have been overdue past the due date.'),
          q('Why is a debt that will never be collected written off?', [
            'To increase the business\'s reported income',
            'To remove the customer from all future sales',
            'To avoid sending the customer any statements',
            'Because keeping it would overstate the business\'s assets',
          ], 3, 'A receivable that will not be paid is no longer a real asset, so it is moved to bad debts expense.'),
          q('What is a key benefit of sending monthly statements of account?', [
            'Customers can spot missed invoices and raise disputes early',
            'They replace the need to issue invoices to customers',
            'They automatically collect payment from the customer\'s bank',
            'They remove overdue amounts from the aged report',
          ], 0, 'Statements show the full account history, helping both sides catch and resolve differences quickly.'),
        ]
      ),
      ],
      [
      q('A customer pays at the counter when collecting goods. Which document fits best?', [
        'A quote with an expiry date',
        'A sales receipt',
        'A credit note',
        'An invoice with Net 30 terms',
      ], 1, 'When payment happens at the time of sale, a sales receipt records it directly to cash or bank.'),
      q('A 50,000 invoice offers 2% off for early payment and the customer pays 49,000 in time. What is the entry?', [
        'Dr Bank 49,000 and Dr Discount allowed 1,000, Cr Accounts receivable 50,000',
        'Dr Bank 49,000, Cr Accounts receivable 49,000, leaving 1,000 open on the account',
        'Dr Bank 50,000, Cr Sales 50,000, with the 1,000 entered as extra other income',
        'Dr Accounts receivable 1,000, Cr Discount allowed 1,000, with no bank entry at all',
      ], 0, 'The discount clears the remaining 1,000 so the invoice closes fully and the cost is recorded.'),
      q('A customer\'s remittance advice lists three invoices covered by one transfer. What should the bookkeeper do?', [
        'Apply the whole amount to the newest invoice only',
        'Record the transfer as income without linking it',
        'Split the payment across the three listed invoices',
        'Hold the full amount in suspense until year end',
      ], 2, 'The remittance advice says which invoices were paid, so the payment is applied to each of them.'),
      q('An amount moves from the 31 to 60 column to the 61 to 90 column over a month. What does it mean?', [
        'The customer has partly paid the amount',
        'The amount remains unpaid and is getting older',
        'The invoice has been automatically written off',
        'A credit note has been issued for the amount',
      ], 1, 'Amounts move right in the aged report as time passes without payment, which makes collection less likely.'),
      ]
    ),
    chapter(
      'Purchases, Bills and Accounts Payable',
      'Record what the business buys on credit, from purchase orders and supplier bills to paying them, handling petty cash and staff expense claims, and keeping accounts payable accurate with aged reports and supplier statements.',
      [
      lesson('Purchase Orders and Supplier Bills', 12, `
Every business buys things: stock to sell, raw materials, rent, internet, repairs, packaging. When a supplier lets the business pay later, the amount owed becomes a liability called accounts payable. Your job as bookkeeper is to record each of these debts correctly, once, and on time.

### The purchase cycle

A well run purchase usually follows this path:

1. **Purchase request.** Someone inside the business says what is needed.
2. **Purchase order (PO).** The business sends the supplier a document listing items, quantities, agreed prices and delivery terms.
3. **Delivery.** Goods arrive with a delivery note or goods received note (GRN).
4. **Supplier bill.** The supplier sends an invoice asking for payment. From the buyer's side, this is called a bill.
5. **Payment.** The business pays the bill by bank transfer, cheque or another method.

Small businesses often skip the first two steps. A small bakery in Lahore may phone the flour dealer and only receive a bill. That is fine, but the more steps you keep on paper, the easier it is to catch mistakes.

### Purchase orders are not accounting entries

A purchase order records an intention to buy. Nothing has been received and nothing is owed yet, so a PO does not change the books. It matters because it gives you something to compare the bill against later.

### The three-way match

Before a bill is recorded and approved for payment, careful businesses compare three documents:

| Document | What it proves |
|---|---|
| Purchase order | What the business agreed to buy and at what price |
| Goods received note | What actually arrived, and in what condition |
| Supplier bill | What the supplier is charging |

If the PO says 100 cartons at PKR 450 each, the GRN says 95 cartons arrived, and the bill charges for 100, something is wrong. You record only what is correct, or you hold the bill and ask the supplier for a corrected one.

### Recording a supplier bill

When a valid bill arrives, you record the expense or asset and the liability at the same time. Suppose a Karachi clothing shop receives a bill for packaging bags worth PKR 30,000, payable in 30 days:

\`\`\`text
Date       Account                     Debit      Credit
05 Mar     Packaging Expense           30,000
           Accounts Payable (Ali Pack)            30,000
           Bill AP-1043, due 04 Apr
\`\`\`

If the purchase is stock for resale, the debit goes to Inventory or Purchases, depending on how the business tracks stock. If it is a long lasting item like a laptop, the debit goes to a fixed asset account instead of an expense.

### What to check on every bill

- The supplier's name and, where relevant, their tax registration number
- Bill number and bill date
- Description, quantity and price of each line
- Any sales tax shown separately
- The due date or payment terms, such as "Net 30"
- That the business has not already recorded the same bill

Duplicate bills are a common and costly error. Suppliers sometimes resend a bill as a reminder, and a tired bookkeeper records it twice. Searching by bill number before entering prevents this.

### Sales tax on bills

If the business is registered for sales tax, the tax on a supplier bill may be claimable against the tax it charges customers, often called input tax. Whether it can be claimed depends on the type of purchase, the supplier's registration status and the current law. In Pakistan, rules for federal sales tax come from FBR and provincial revenue authorities handle sales tax on many services. These rules change, so record the tax amount in its own account and confirm the treatment with the business's tax adviser or the relevant authority.

### Keep the paper trail

File every bill with its PO and GRN, either scanned into a shared folder or attached in your accounting software. When someone asks next year why PKR 30,000 went to Ali Pack, you should be able to show the document in a minute.
      `,
        [
          q('Why does a purchase order not create an entry in the books?', [
            'Purchase orders are only used by large companies',
            'Nothing has been received or owed when it is issued',
            'The supplier records it on the buyer\'s behalf',
            'It is always cancelled before goods arrive',
          ], 1, 'A PO only records an intention to buy, so no asset, expense or liability exists yet.'),
          q('A bill charges for 100 cartons but the goods received note shows 95. What should the bookkeeper do?', [
            'Record the full bill so the supplier is paid quickly',
            'Record nothing and throw the bill away',
            'Record 100 cartons and fix it next year',
            'Hold the bill and ask the supplier for a corrected one',
          ], 3, 'The three-way match exposes the difference, and only the correct amount should be owed.'),
          q('Which entry records a PKR 30,000 packaging bill payable later?', [
            'Debit Accounts Payable, credit Packaging Expense',
            'Debit Bank, credit Accounts Payable',
            'Debit Packaging Expense, credit Accounts Payable',
            'Debit Packaging Expense, credit Bank',
          ], 2, 'The expense increases with a debit and the amount owed to the supplier increases with a credit to payables.'),
        ]
      ),
      lesson('Paying Bills and Recording Supplier Payments', 12, `
Recording a bill creates the debt. Paying it clears the debt. Many beginner errors happen at this second step, usually because the payment is recorded as a fresh expense instead of being matched to the bill already in the books.

### The payment entry

When the Karachi shop pays Ali Pack the PKR 30,000 owed, the entry reduces the liability and reduces the bank balance:

\`\`\`text
Date       Account                     Debit      Credit
02 Apr     Accounts Payable (Ali Pack) 30,000
           Bank (Meezan current)                  30,000
           Paid bill AP-1043 by IBFT
\`\`\`

Notice that no expense appears here. The expense was recorded when the bill arrived. If you also debit Packaging Expense on payment, the expense is counted twice and payables never clear.

### Bill or direct expense?

Not every purchase goes through payables. Use this rule:

| Situation | How to record |
|---|---|
| Supplier gives a bill and is paid later | Record the bill, then record the payment against it |
| Business pays on the spot, receipt in hand | Record a direct expense or cash purchase, no payable |
| Card or wallet payment at checkout | Direct expense from the card or wallet account |

In accounting software, a direct payment is often called an expense or a cheque, while a bill payment is a separate screen that lets you pick which open bills you are paying.

### Partial payments

Suppliers sometimes agree to be paid in parts. If the shop pays PKR 10,000 now, the bill stays open with PKR 20,000 still owing. Record the payment against the same bill so the balance is correct, and note the plan in the memo.

### Paying several bills at once

A supplier with many bills may receive one transfer covering them all. Record one payment and allocate it across the bills it covers. If the transfer is PKR 75,000 and the open bills are PKR 30,000, PKR 25,000 and PKR 20,000, all three are cleared. If the amounts do not add up, ask the client which bills the money was meant for rather than guessing.

### Early payment discounts

Some suppliers offer a discount for paying early, written as terms such as "2/10, Net 30", meaning a 2 percent discount if paid within 10 days, otherwise full payment within 30. If the business takes the discount, the bill is still cleared in full, but less cash leaves the bank. The difference is recorded in an account such as Discounts Received, which is usually treated as income or as a reduction of purchase cost depending on the business's policy.

### Withholding tax on supplier payments

In many countries, including Pakistan, certain businesses must deduct income tax from some payments to suppliers and pay it to the government on the supplier's behalf. When this applies, the supplier receives less than the bill total, and the deducted amount becomes a liability until it is paid to the tax authority.

\`\`\`text
Accounts Payable (supplier)     full bill amount     Debit
Bank                            amount actually paid  Credit
Withholding Tax Payable         amount deducted       Credit
\`\`\`

Who must withhold, on which payments and at what rate is set by law and changes often. Never pick a rate from memory or an old blog post. Check the current rules on the FBR website or with the client's tax adviser, and keep the payment receipt for the tax deposited.

### Approval before payment

A bookkeeper often prepares payments but should not be the only person who approves them. A simple control is that the owner approves a weekly list of bills due, and only then are payments made. This protects the business from fraud and protects you from blame if something goes wrong.

### Keep proof of payment

Save the bank transfer confirmation, cheque counterfoil or wallet receipt with the bill. When a supplier claims they were never paid, the proof settles the matter quickly.
      `,
        [
          q('The shop pays a bill that was already recorded. Which account is debited?', [
            'Packaging Expense',
            'Accounts Payable',
            'Bank',
            'Sales Revenue',
          ], 1, 'Paying a recorded bill reduces the liability, so payables is debited and the bank is credited.'),
          q('What goes wrong if a bookkeeper debits an expense again when paying a recorded bill?', [
            'The expense is counted twice and payables stay open',
            'The bank balance increases by mistake',
            'The supplier is paid twice by the bank',
            'Nothing, because the trial balance still balances',
          ], 0, 'The expense was already recorded with the bill, so repeating it doubles the cost and leaves the payable uncleared.'),
          q('A supplier is paid less than the bill because tax was withheld. Where does the deducted amount go?', [
            'Into a discount income account',
            'Back to the supplier\'s payable balance',
            'Into the owner\'s drawings account',
            'Into a withholding tax liability until paid over',
          ], 3, 'The business owes the deducted tax to the authority, so it sits as a liability until deposited.'),
        ]
      ),
      lesson('Petty Cash and Expense Claims', 11, `
Not every business cost goes through a bill or a bank transfer. Staff buy tea and milk for the office, pay a rickshaw fare to deliver documents, or buy printer paper from the shop next door. Petty cash and expense claims are how these small costs reach the books without chaos.

### What petty cash is

Petty cash is a small amount of physical cash kept in the office for minor spending. It is treated as its own asset account, separate from the main bank account and from any cash taken in from customers.

### The imprest system

The most common way to run petty cash is the imprest system. The business sets a fixed float, for example PKR 15,000. Staff spend from it and leave a voucher or receipt for every payment. When the cash runs low, the total of the vouchers is reimbursed from the bank, bringing the float back to PKR 15,000.

At any moment:

\`\`\`text
Cash in the box + vouchers for money spent = fixed float
\`\`\`

If the box holds PKR 4,200 and the vouchers total PKR 10,800, everything is accounted for. If the vouchers total only PKR 9,800, PKR 1,000 is missing and someone needs to find out why.

### Recording petty cash

Setting up the float:

\`\`\`text
Petty Cash        15,000  Debit
Bank              15,000  Credit
\`\`\`

Topping up after a period of spending, with vouchers sorted by type:

| Account | Debit | Credit |
|---|---|---|
| Office Refreshments | 3,600 | |
| Local Travel | 2,400 | |
| Stationery | 4,800 | |
| Bank | | 10,800 |

The expenses are recorded when the vouchers are summarised at top up time. The Petty Cash account itself does not move during a top up, because the float returns to its fixed amount.

### Rules that keep petty cash honest

- One named person holds the box and the key.
- No payment without a voucher showing date, amount, purpose and who received the money.
- Attach the shop receipt where one exists. For a rickshaw or a small dhaba purchase where no receipt is given, the voucher should be signed by the person who spent the money.
- Count the box at least monthly, with a second person present.
- Set a maximum for any single petty cash payment, so larger purchases go through the normal approval process.

### Expense claims

An expense claim is when an employee pays a business cost with their own money and asks to be paid back. A sales officer in Faisalabad might pay for fuel and a client lunch, then submit a claim with receipts at month end.

Recording the approved claim:

\`\`\`text
Fuel Expense                   2,500  Debit
Client Entertainment           3,000  Debit
Employee Claims Payable        5,500  Credit
\`\`\`

When the business reimburses the employee, Employee Claims Payable is debited and Bank is credited. Some businesses skip the payable and record the expenses directly when they pay, which is fine if the claim is paid quickly.

### Policies matter more than entries

The entries are simple. The hard part is having a clear policy that says what can be claimed, what proof is needed and who approves. Without one, claims become arguments. As a bookkeeper you can suggest a one page policy to your client covering limits, deadlines for submitting claims and what counts as a business cost.

### Personal costs are not business expenses

If the owner uses petty cash to buy groceries for home, that is not an office expense. Record it as owner drawings so the profit figure stays honest.
      `,
        [
          q('Under the imprest system, what does the petty cash float equal at any time?', [
            'The total of all bank transfers in the month',
            'The cash in the box minus last month\'s vouchers',
            'The cash in the box plus vouchers for money spent',
            'The amount approved by the tax authority',
          ], 2, 'Cash remaining plus vouchers for spending should always equal the fixed float, which exposes any shortage.'),
          q('When petty cash is topped up from the bank, which accounts are usually debited?', [
            'Petty Cash, to restore the fixed float amount',
            'The expense accounts shown on the vouchers',
            'Bank and the owner\'s equity account',
            'Employee Claims Payable',
          ], 1, 'The voucher totals are recorded as expenses and the bank is credited, while the float returns to its fixed amount.'),
          q('The owner takes petty cash to buy groceries for home. How should it be recorded?', [
            'As owner drawings',
            'As office refreshments',
            'As a staff welfare expense',
            'As a loan to an employee',
          ], 0, 'Personal spending by the owner is not a business cost, so it reduces equity as drawings.'),
        ]
      ),
      lesson('Aged Payables and Supplier Statements', 12, `
Once bills and payments are flowing through the books, you need a way to see the whole picture: who the business owes, how much, and how long each amount has been waiting. Two tools do this job: the aged payables report and the supplier statement reconciliation.

### The aged payables report

An aged payables report lists every unpaid bill, grouped by supplier, and sorts the amounts into age bands based on the due date.

| Supplier | Current | 1 to 30 days overdue | 31 to 60 | Over 60 | Total |
|---|---|---|---|---|---|
| Ali Pack | 30,000 | | | | 30,000 |
| Shahid Fabrics | 85,000 | 40,000 | | | 125,000 |
| City Electric Repairs | | | 12,000 | | 12,000 |
| Total | 115,000 | 40,000 | 12,000 | 0 | 167,000 |

The total of this report must equal the Accounts Payable balance in the general ledger. If it does not, something has been posted directly to the payables account without a supplier attached, and you need to find it.

### Reading the report

- **Current** amounts are not yet due. Plan cash for them.
- **Overdue** amounts may damage supplier relationships or trigger late fees.
- **Very old** amounts are often not real debts at all. They may be bills already paid but not matched, duplicates, or disputed bills that were never cancelled.

The owner uses this report to decide what to pay this week. You use it to spot errors.

### Why old balances need investigating

Suppose City Electric Repairs shows PKR 12,000 overdue for two months. Before telling the owner to pay it, check the bank for a payment around that amount. If you find one recorded as a direct expense instead of a bill payment, the repair is now in the books twice and the bill still looks open. The fix is to remove the duplicate expense (or reverse it, if that period is already closed) and record the payment against the bill.

### Supplier statements

Most suppliers send a monthly statement listing every bill and payment they have on record for your client, with a closing balance. This is their version of your payables account for them. Comparing the two is called a supplier statement reconciliation.

\`\`\`text
Shahid Fabrics statement balance         132,000
Our payables balance for Shahid Fabrics  125,000
Difference                                 7,000
\`\`\`

### Finding the difference

Line up both lists by date and amount, and tick off what matches. Typical causes of the leftover items:

| Cause | Typical fix |
|---|---|
| Bill on their statement not yet in our books | Get a copy, check it, record it |
| Payment we sent that they have not yet applied | Note it as timing; send proof if it stays unapplied |
| Credit note we recorded that they have not | Send them the credit note reference |
| Pricing difference on a bill | Raise it with the supplier before paying |

In the example, the PKR 7,000 might be a bill dated 30 March that the shop never received. Ask for a copy rather than recording a number straight from the statement.

### How often to do this

For the main suppliers, reconcile statements every month as part of month end. For small occasional suppliers, check whenever a statement arrives or when the supplier chases payment.

### Good habits with payables

- Enter bills as they arrive, not in a pile at month end.
- Match every payment to its bill.
- Keep disputed bills clearly marked so they are not paid by accident.
- Review the aged payables report weekly with the owner.

Clean payables protect the business from paying twice, paying the wrong amount, or losing a good supplier through missed payments. They also make the balance sheet trustworthy, which matters when a bank or investor looks at the accounts.
      `,
        [
          q('The aged payables total does not match the Accounts Payable ledger balance. What is a likely cause?', [
            'An entry was posted to payables without a supplier',
            'The report was printed in the wrong currency',
            'All the suppliers have been paid in full',
            'The business has no overdue bills at all',
          ], 0, 'Postings made directly to the control account without a supplier do not appear on the supplier based report.'),
          q('A small bill has shown as overdue for many months. What should the bookkeeper check first?', [
            'Whether the supplier has closed down',
            'Whether the owner wants to pay it in cash',
            'Whether it was paid but recorded as an expense',
            'Whether the bill amount should be doubled',
          ], 2, 'Old open bills are often payments recorded the wrong way, which also duplicates the expense.'),
          q('A supplier statement shows a bill the business never recorded. What is the right response?', [
            'Record the amount straight from the statement',
            'Ignore it until the supplier complains',
            'Write it off as a bad debt immediately',
            'Request a copy of the bill, check it, then record it',
          ], 3, 'A statement line is not a source document, so the bill itself must be obtained and checked first.'),
        ]
      ),
      ],
      [
      q('Which three documents are compared in a three-way match?', [
        'Quote, sales invoice and bank statement',
        'Bill, credit note and payslip',
        'Purchase order, goods received note and supplier bill',
        'Receipt, petty cash voucher and the monthly supplier statement',
      ], 2, 'The match confirms what was ordered, what arrived and what is being charged before the bill is approved.'),
      q('A business takes an early payment discount from a supplier. How is the saving usually recorded?', [
        'As an increase in Accounts Payable',
        'As an extra expense on the bill',
        'As a loan from the supplier',
        'In an account such as Discounts Received',
      ], 3, 'The bill is cleared in full while less cash is paid, and the difference goes to a discount account.'),
      q('Petty cash vouchers total PKR 9,800 but the float of 15,000 should leave 5,200 in the box, and only 4,200 is there. What does this show?', [
        'PKR 1,000 is missing and needs explaining',
        'The float should be reduced to PKR 14,000',
        'The vouchers were recorded twice by mistake',
        'Everything balances and no action is needed',
      ], 0, 'Cash plus vouchers comes to 14,000 against a 15,000 float, so 1,000 is unaccounted for.'),
      q('Who should decide the withholding tax rate on a supplier payment?', [
        'The bookkeeper, from memory of last year',
        'Current law, checked with FBR or a tax adviser',
        'The supplier, based on what they prefer',
        'Whatever rate the accounting software suggests',
      ], 1, 'Withholding rules and rates change, so they must be confirmed from the current official source.'),
      ]
    ),
    chapter(
      'Bank, Cash and Reconciliation',
      'Set up bank, wallet and cash accounts properly, reconcile them against statements every month, fix timing differences and errors, and record transfers, loans and the owner\'s own money without distorting profit.',
      [
      lesson('Bank Accounts, Wallets and Cash in the Books', 11, `
Money sits in several places in a typical small business. There is a current account at a bank, maybe a second account for savings, a mobile wallet that customers pay into, a card machine settlement account, and cash in the till. Each of these needs its own account in the books.

### One real place, one account

The golden rule is simple: every place money can sit gets its own asset account, and the balance in the books should be explainable against an outside record of that place.

| Where the money is | Account in the books | Outside record to check against |
|---|---|---|
| HBL current account | Bank: HBL Current | Bank statement |
| Savings or deposit account | Bank: Savings | Bank statement |
| JazzCash or Easypaisa business wallet | Wallet: JazzCash | Wallet transaction history |
| Card or payment gateway balance | Clearing: Card Payments | Gateway settlement report |
| Shop till | Cash on Hand | Daily cash count |
| Office float | Petty Cash | Voucher box count |

Never lump these together into one "Cash" account. When the totals disagree, you will have no way to tell which place the problem is in.

### Mobile wallets are bank accounts in the books

Many small sellers in Pakistan take payment through mobile wallets or instant bank transfers such as Raast. Treat a business wallet just like a bank account: payments in are debits to the wallet account, fees are expenses, and moving money from the wallet to the bank is a transfer, not income.

### Clearing accounts for card and online sales

When customers pay by card or through an online checkout, the money does not arrive in the bank immediately or in full. The provider collects it, deducts a fee, and settles a net amount days later.

\`\`\`text
Day 1  Sale paid by card          PKR 10,000
Day 3  Bank receives settlement   PKR  9,750
       Provider fee                PKR    250
\`\`\`

Use a clearing account to hold the money while it is in transit:

\`\`\`text
Day 1  Clearing: Card Payments   10,000  Debit
       Sales                     10,000  Credit
Day 3  Bank                       9,750  Debit
       Payment Processing Fees      250  Debit
       Clearing: Card Payments   10,000  Credit
\`\`\`

The clearing account returns to zero once settlement arrives. If it does not, a settlement is missing or a fee was not recorded.

### Cash on hand

Cash is the hardest place to control because it leaves no automatic record. For a shop, a daily routine helps:

1. Start the day with a fixed opening float.
2. Record every cash sale, ideally through a till or point of sale app.
3. Count the drawer at closing.
4. Compare the count with expected cash: opening float plus cash sales minus any cash paid out.
5. Record any difference in a Cash Over and Short account, and note the reason.
6. Bank the takings regularly, keeping the deposit slip.

Small differences happen. Repeated shortages are a warning sign and the owner needs to know.

### Personal and business accounts

Many owners run business money through their personal account. This makes bookkeeping much harder because every transaction must be sorted into business or personal. The best advice you can give is to open a separate business account and wallet. Until that happens, you will record only business transactions and treat money moving between the personal and business sides as owner contributions or drawings, as explained in the topic on transfers, loans and owner money.

### Naming and numbering

Include the bank name and the last four digits of the account number in the account name, such as "Bank: Meezan Current 4471". When a client has two accounts at the same bank, this stops entries landing in the wrong one.
      `,
        [
          q('Why should each bank account, wallet and cash location have its own account in the books?', [
            'Tax law requires a separate ledger for every location',
            'So each balance can be checked against its own outside record',
            'Because software cannot add balances together',
            'So that cash sales can be hidden from the bank',
          ], 1, 'Separate accounts let you reconcile each place against its statement or count and find where a difference lies.'),
          q('Money moves from the business JazzCash wallet to the business bank account. How is it recorded?', [
            'As sales income in the bank account',
            'As an expense from the wallet',
            'As a transfer between two asset accounts',
            'As a loan from the wallet provider',
          ], 2, 'Moving money between the business\'s own accounts changes where it sits, not how much the business earned.'),
          q('A card clearing account still shows a balance weeks after the sales. What does this suggest?', [
            'The business made extra profit that month',
            'The clearing account was set up correctly',
            'Card sales should be recorded as loans',
            'A settlement or fee has not been recorded',
          ], 3, 'The clearing account should return to zero when each settlement and its fee are recorded.'),
        ]
      ),
      lesson('How a Bank Reconciliation Works', 13, `
A bank reconciliation proves that the bank balance in your books agrees with the balance on the bank statement, after allowing for items that one side knows about and the other does not yet. It is the single most important check a bookkeeper performs, because it catches missing transactions, duplicates, wrong amounts and fraud.

### Why the two balances differ

Your books and the bank record the same money, but at different times and with different information.

| Item | In your books? | On the bank statement? |
|---|---|---|
| Cheque you wrote but supplier has not yet deposited | Yes | Not yet |
| Cash or cheque deposited late on the last day | Yes | Not yet |
| Bank charges and tax deducted by the bank | Not until you see them | Yes |
| Profit or interest credited by the bank | Not until you see it | Yes |
| Customer transfer you did not know about | Not yet | Yes |

The first two are timing differences: the bank will catch up. The rest are items you need to add to the books.

### The method step by step

1. **Gather** the bank statement for the month and the bank account ledger from your books.
2. **Tick** every transaction that appears in both, matching amounts and roughly matching dates.
3. **Book** anything on the statement that is missing from your books, after confirming what it is. Bank charges, profit credits and unrecorded customer receipts are common.
4. **List** what is in your books but not on the statement. These are outstanding cheques and deposits in transit.
5. **Prepare** the reconciliation statement and check it agrees.
6. **Investigate** anything left over until the difference is zero.

### A worked example

A printing business in Rawalpindi closes March with these figures:

\`\`\`text
Balance per bank statement, 31 Mar             412,500
Add: deposit in transit (cash banked 31 Mar)     35,000
Less: outstanding cheque no. 2219 to supplier   (48,000)
Adjusted bank balance                          399,500

Balance per books, before adjustments          401,200
Less: bank charges not yet recorded              (1,700)
Adjusted book balance                          399,500

Difference                                            0
\`\`\`

Both adjusted balances agree, so the books are reconciled. The bank charges must now be recorded as an expense in the books. The deposit and the cheque need no entry; they should simply appear on April's statement.

### Opening balance first

A reconciliation only works if last month's ended correctly. Before starting, confirm the books' opening bank balance equals last month's reconciled balance, and that last month's outstanding items have now cleared. A cheque still outstanding after several months needs a phone call to the payee.

### How often

Monthly is the minimum. Busy businesses with many transactions benefit from weekly reconciliation, because a small batch of unmatched items is far easier to investigate than a month's worth. Accounting software with bank feeds makes daily matching practical, which you will see in the QuickBooks chapters.

### Keep the evidence

Save each completed reconciliation with the statement it was done against. Auditors, tax officials and the business's own lenders may ask to see that the bank was reconciled, and an accountant preparing annual accounts will rely on your reconciliations.

### What reconciliation does not prove

A reconciled bank account proves that the bank account balance is right. It does not prove that each transaction was coded to the right expense or income account. A payment to a supplier coded as rent will still reconcile. Coding accuracy is checked separately when you review the profit and loss report.
      `,
        [
          q('Which item is a timing difference rather than something to add to the books?', [
            'Bank charges shown only on the statement',
            'A cheque written but not yet deposited by the payee',
            'Profit credited by the bank at month end',
            'A customer transfer the business did not know about',
          ], 1, 'The cheque is already in the books and the bank will show it once the payee deposits it.'),
          q('In the worked example, what entry is needed after the reconciliation?', [
            'Record PKR 1,700 of bank charges as an expense',
            'Record the PKR 35,000 deposit a second time',
            'Reverse cheque 2219 for PKR 48,000',
            'Change the bank statement balance to match',
          ], 0, 'Bank charges appeared only on the statement, so they must be added to the books; the timing items need no entry.'),
          q('A payment to a supplier was coded to Rent by mistake. Will the bank reconciliation catch it?', [
            'Yes, because the amounts will not match',
            'Yes, because rent has its own bank account',
            'No, because rent is never paid by bank',
            'No, because the bank amount is still correct',
          ], 3, 'Reconciliation checks the bank balance, not which expense account a payment was coded to.'),
        ]
      ),
      lesson('Fixing Timing Differences and Errors', 12, `
Most months, a reconciliation leaves you with a handful of items that do not match at first. Some will clear by themselves next month. Others are errors that you must correct. Knowing which is which, and how to fix each kind, is what makes reconciliation quick instead of painful.

### Sorting the leftovers

| Type | Example | Action |
|---|---|---|
| Timing difference | Cheque issued, not yet presented | List it, wait, follow up if old |
| Missing entry | Bank SMS charge never recorded | Record it in the books |
| Duplicate | Same customer receipt entered twice | Delete or void one copy |
| Wrong amount | PKR 18,500 entered as 15,800 | Correct the entry |
| Wrong account | Payment posted to savings, not current | Move it to the right account |
| Bank error | Bank debited another customer's cheque | Ask the bank to correct it |

Bank errors are rare, but they happen. Never alter your books to match a bank mistake. Record the item on the reconciliation as a reconciling item and keep the bank's correspondence.

### Clues from the size of the difference

When you are left with an unexplained difference, the number itself often points to the cause.

- **Difference equals one transaction.** Look for a missing or duplicated item of that exact amount.
- **Difference is twice a transaction.** An item was probably recorded on the wrong side, a deposit entered as a payment or the reverse. Half the difference is the amount to look for.
- **Difference divides exactly by 9.** This often means a transposition, two digits swapped, such as 18,500 typed as 15,800. The difference here is 2,700, and 2,700 divided by 9 is 300.

\`\`\`text
Correct      18,500
Entered      15,800
Difference    2,700   ->  2,700 / 9 = 300, a classic swap
\`\`\`

These are clues, not proof. Always confirm by finding the actual entry.

### Correcting errors properly

How you correct depends on whether the period is closed.

- **Open period:** edit or delete the wrong entry directly, and note why in the memo.
- **Closed period:** do not change old entries, because reports already shared with the owner or tax adviser would change silently. Post a correcting entry in the current period instead and explain it.

Many accounting systems let you lock a period with a closing date. Respect it, and only unlock with the owner's or accountant's agreement.

### Stale cheques

A cheque that stays outstanding for a long time may never be cashed. Banks usually refuse cheques older than a certain age, and the exact period depends on the banking rules in force, so check with the bank. Contact the payee first. If the cheque will not be presented, cancel it in the books by reversing the payment, which brings the money back to the bank account and reopens the bill (or removes the expense, if it was a direct payment). Then arrange a fresh payment if the debt is still owed.

### Unknown deposits

Sometimes money arrives and nobody knows why. Do not guess that it is sales. Ask the owner, check customer remittances and wallet messages, and if needed post it temporarily to a suspense or "Unidentified Receipts" account. Clear the suspense account as soon as the source is known. A suspense account with an old balance is a sign of unfinished work.

### Habits that prevent most errors

- Enter transactions from source documents, not from memory.
- Reconcile monthly without fail, ideally within the first week of the next month.
- Write a clear memo on every manual entry.
- Keep one person responsible for each bank account's records.

The aim is a reconciliation where every leftover item has a name, a reason and a plan.
      `,
        [
          q('An unexplained difference of PKR 2,700 divides exactly by 9, and no single missing item is worth 2,700. What is the most likely cause?', [
            'A missing bank charge of PKR 2,700',
            'A deposit recorded as a payment',
            'Two digits swapped when an amount was typed',
            'A cheque written in the wrong currency',
          ], 2, 'Differences that divide evenly by 9 are a common sign of a transposition error.'),
          q('An error is found in a period that has already been closed and reported. What should the bookkeeper do?', [
            'Post a correcting entry in the current period',
            'Edit the original entry quietly so reports are right',
            'Delete the closed period and redo it',
            'Leave the error since the period is closed',
          ], 0, 'Changing closed periods alters reports already shared, so a correcting entry in the open period is safer.'),
          q('Money arrives in the bank and nobody knows what it is for. What is the right temporary treatment?', [
            'Post it to a suspense account until the source is known',
            'Record it as sales income straight away',
            'Ignore it until the year end accounts',
            'Treat it as owner drawings by default',
          ], 0, 'A suspense account holds the amount honestly until it can be identified and moved to the correct account.'),
        ]
      ),
      lesson('Transfers, Loans and Owner Money', 12, `
Not every movement of money is income or expense. Moving funds between the business's own accounts, borrowing from a bank, repaying a loan, and the owner putting in or taking out money all change balances without being profit or loss. Recording these wrongly is one of the fastest ways to make a profit and loss report meaningless.

### Transfers between accounts

When the business moves PKR 100,000 from its savings account to its current account, both accounts belong to the business. Total money has not changed.

\`\`\`text
Bank: Current     100,000  Debit
Bank: Savings     100,000  Credit
\`\`\`

A common mistake is recording the money leaving savings as an expense and the money arriving in current as income. Profit is then overstated on one side and expenses on the other, and both are fiction. In software, use the transfer feature so both sides are linked and will reconcile on each statement.

### Loans received

When a bank or a relative lends the business money, the business gains cash and a liability.

\`\`\`text
Bank                  500,000  Debit
Loan Payable: Bank    500,000  Credit
\`\`\`

A loan is not income, even though cash arrives. It must be paid back.

### Loan repayments

Repayments usually contain two parts: principal, which reduces the loan, and interest or a finance charge, which is an expense. Islamic financing products used widely in Pakistan are structured differently, often as rental or profit payments, but the bookkeeping idea is similar: split each payment between the part that reduces what is owed and the part that is a cost.

| Monthly payment | Amount | Account |
|---|---|---|
| Principal portion | 18,000 | Loan Payable (debit) |
| Interest or profit portion | 7,000 | Finance Costs (debit) |
| Total paid from bank | 25,000 | Bank (credit) |

Get the split from the lender's repayment schedule or statement. Do not guess it. Once a year, compare the loan balance in the books with the lender's statement, just as you would a supplier statement.

### The owner putting money in

When a sole owner adds personal money to the business, it is a capital contribution, recorded in equity:

\`\`\`text
Bank                  200,000  Debit
Owner's Capital       200,000  Credit
\`\`\`

It is not sales and must not appear on the profit and loss report. In a company, where the owner and the business are legally separate, money from a shareholder may be share capital or a director's loan, depending on what was agreed. Ask the client and their accountant which it is, and keep a written record.

### The owner taking money out

For a sole trader or partnership, money the owner takes for personal use is drawings, a reduction of equity:

\`\`\`text
Owner's Drawings      50,000  Debit
Bank                  50,000  Credit
\`\`\`

Drawings are not a business expense, so they do not reduce profit. Paying the owner's home electricity bill from the business account is also drawings. In a company, money paid to directors is usually salary, dividends or a director's loan, each with its own legal and tax treatment, so confirm with the accountant.

### Mixed personal and business payments

If an owner pays a business bill from a personal account, record the expense and credit Owner's Capital, because the owner effectively put money into the business. If the business pays a personal bill, debit Drawings. Keeping this tidy throughout the year saves arguments at tax time.

### Quick test before coding any bank line

Ask: did the business earn this money or spend it to run the business? If yes, it is income or expense. If the money simply moved, was borrowed, was repaid, or went to or from the owner, it belongs on the balance sheet instead.
      `,
        [
          q('The business moves PKR 100,000 from savings to its current account. What is the correct entry?', [
            'Debit Expenses, credit Bank: Savings',
            'Debit Bank: Current, credit Sales',
            'Debit Owner\'s Capital, credit Bank: Current',
            'Debit Bank: Current, credit Bank: Savings',
          ], 3, 'Both accounts belong to the business, so the entry simply moves money between two asset accounts.'),
          q('A monthly loan payment of PKR 25,000 includes PKR 7,000 interest. How much reduces the loan balance?', [
            'PKR 25,000',
            'PKR 7,000',
            'PKR 18,000',
            'PKR 32,000',
          ], 2, 'Only the principal portion reduces the liability; the interest portion is a finance cost.'),
          q('A sole owner pays a business supplier from a personal account. Which account is credited?', [
            'Sales Revenue',
            'Owner\'s Capital',
            'Owner\'s Drawings',
            'Loan Payable: Bank',
          ], 1, 'The owner has effectively put money into the business, which increases owner\'s capital.'),
        ]
      ),
      ],
      [
      q('A card sale of PKR 10,000 settles as PKR 9,750 in the bank. How is the PKR 250 recorded?', [
        'As a payment processing fee expense',
        'As a reduction in owner\'s capital',
        'As a customer refund liability',
        'As extra sales income for the month',
      ], 0, 'The provider keeps its fee, which is a cost of accepting card payments.'),
      q('What should be checked before starting a monthly bank reconciliation?', [
        'That the bank has approved last year\'s accounts',
        'That every cheque was written in blue ink',
        'That the opening balance equals last month\'s reconciled balance',
        'That no bank charges were made during the month',
      ], 2, 'A reconciliation builds on the previous one, so the starting balance must already be agreed.'),
      q('A deposit of PKR 6,000 was recorded as a payment of PKR 6,000. What difference appears on the reconciliation?', [
        'PKR 3,000',
        'PKR 6,000',
        'Nothing, because the amount is right',
        'PKR 12,000',
      ], 3, 'Posting to the wrong side creates a difference of twice the amount, here 12,000.'),
      q('A relative lends the business PKR 500,000. Why is this not income?', [
        'Because money from family is never recorded',
        'Because the business must repay it later',
        'Because only banks can make business loans',
        'Because it was received by bank transfer',
      ], 1, 'Borrowed money creates a liability to repay, so it belongs on the balance sheet rather than in profit.'),
      ]
    ),
    chapter(
      'Payroll Basics',
      'Keep accurate pay records for employees and contractors, work from gross pay to net pay, post payroll journal entries that clear their liabilities, and know where payroll rules come from so you check them instead of guessing.',
      [
      lesson('Employees, Contractors and Pay Records', 12, `
Payroll is the process of paying people who work for the business and recording what was paid, deducted and owed. Before calculating anything, you need to know who is being paid and on what basis, because employees and independent contractors are treated very differently.

### Employee or contractor?

An employee works under the business's direction, usually on a regular schedule, using the business's tools, and is paid a salary or wage. A contractor runs their own small business and is paid for a result or a service, often against an invoice.

| Question | Points towards employee | Points towards contractor |
|---|---|---|
| Who sets working hours and methods? | The business | The worker |
| Who provides tools and equipment? | The business | The worker |
| How is payment made? | Fixed salary or hourly wage | Per job, per project, against an invoice |
| Can they work for many clients? | Usually not | Yes, normally |
| Who bears the risk of a loss on the job? | The business | The worker |

The difference matters because employers usually have obligations for employees that do not apply to contractors, such as withholding income tax from salary, registering for social security schemes and following labour law on leave and working hours. Contractor payments may still carry their own withholding tax rules.

Labelling someone a contractor does not make them one. Tax authorities and labour courts look at the real working relationship. If a client is unsure, the decision belongs to the owner with advice from a lawyer or tax adviser. Your job is to record the arrangement correctly and flag doubts.

### The employee master file

Every employee needs a file, kept confidential, with at least:

- Full name, CNIC or national ID number, and contact details
- Job title, start date and contract or appointment letter
- Agreed pay: monthly salary, hourly rate or daily wage
- Allowances, such as house rent, conveyance or medical, as stated in the contract
- Bank account or wallet details for salary transfer
- Tax number where applicable, and registration numbers for any social security schemes
- Leave entitlement and leave taken

Any change in pay should be backed by a signed letter or approved email, saved to the file before the new rate is used.

### Time and attendance records

For salaried staff, attendance mainly affects unpaid leave and overtime. For hourly or daily workers, such as helpers in a Gujranwala workshop or part time staff at a café, attendance is the basis of pay. A simple sheet works:

\`\`\`text
Employee: Bilal Ahmed       Month: April
Rate: PKR 1,200 per day
Days worked: 24
Overtime hours: 6 at agreed overtime rate
Approved by: Supervisor (signature)
\`\`\`

Payroll should never be calculated from someone's memory. If attendance is recorded on a biometric machine or app, export the monthly report and keep it with the payroll file.

### The payroll register

The payroll register is the master sheet for each pay run. It lists every employee in rows and shows gross pay, each deduction and net pay in columns. It is the source document for the payroll journal entry in the next topics, and its totals must agree with what actually leaves the bank.

### Payslips

Give each employee a payslip showing the period, gross pay broken into its parts, each deduction and the net amount paid. Payslips reduce disputes, help staff apply for loans or visas, and show the business is keeping proper records. Some countries make them a legal requirement.

### Confidentiality

Payroll data is among the most sensitive information a business holds. Keep files password protected, share payroll reports only with people who need them, and never discuss one employee's pay with another.
      `,
        [
          q('Which feature points most strongly towards a worker being an employee?', [
            'They send an invoice after each project',
            'They work for several other clients as well',
            'The business sets their hours and methods of work',
            'They supply all their own tools and equipment',
          ], 2, 'Control over how and when work is done is a key sign of employment rather than an independent business.'),
          q('What should back up a change in an employee\'s pay rate?', [
            'A verbal promise from the supervisor',
            'A signed letter or approved email on file',
            'An entry in the general ledger only',
            'A note on the employee\'s payslip',
          ], 1, 'Pay changes need written approval saved before the new rate is used in payroll.'),
          q('What is the payroll register used for?', [
            'Showing each employee\'s gross pay, deductions and net pay',
            'Recording every customer receipt and refund for the month',
            'Storing scanned copies of employee CNICs',
            'Listing the contractors who sent the business invoices this year',
          ], 0, 'The register is the master sheet for a pay run and the source of the payroll journal entry.'),
        ]
      ),
      lesson('Gross Pay, Deductions and Net Pay', 12, `
Every pay calculation follows the same shape: start with what the employee earned, take away what must or may be deducted, and pay the rest. The bookkeeper must understand each part, even when software does the arithmetic.

### Gross pay

Gross pay is the total earned before any deductions. It can include:

| Component | Example |
|---|---|
| Basic salary | Fixed monthly amount in the contract |
| Allowances | House rent, conveyance, utilities, medical |
| Overtime | Extra hours at the agreed overtime rate |
| Commission or bonus | Sales commission, Eid bonus, performance bonus |
| Arrears | Back pay from an earlier period, such as a late increment |

Some countries tax certain allowances differently from basic salary, and some allowances are tax free up to a limit. These rules change, so treat the contract as the source for what is paid and the tax authority for how it is taxed.

### Deductions

Deductions fall into two groups.

**Statutory deductions** are required by law. Common types around the world include:

- Income tax withheld from salary, which the employer pays to the tax authority on the employee's behalf
- Employee contributions to pension or social security schemes

**Voluntary or agreed deductions** come from an agreement with the employee:

- Repayment of a salary advance or staff loan
- Contributions to a provident fund, where the business has one
- Deductions for unpaid leave, as allowed by the contract and the law

Every deduction needs a basis: the law, a written agreement, or an approved policy. Deducting money without one can break labour law and will certainly damage trust.

### Net pay

Net pay is what reaches the employee's bank account or hand.

\`\`\`text
Gross pay
  - income tax withheld
  - employee social security or pension contribution
  - loan or advance repayment
  - other agreed deductions
= Net pay
\`\`\`

### A worked example with illustrative numbers

Ayesha works in the accounts office of a Lahore distributor. Her pay for May, using made up figures for illustration only:

\`\`\`text
Basic salary                  80,000
House rent allowance          20,000
Conveyance allowance           5,000
Gross pay                    105,000

Income tax withheld           (4,500)
Social security contribution  (1,000)
Advance repayment             (5,000)
Net pay                       94,500
\`\`\`

The tax and contribution figures here are invented to show the method. Real amounts depend on the tax tables, thresholds and scheme rules in force for that year and that province or country, which must be looked up each time.

### Employer costs on top of gross pay

Many schemes also require an employer contribution, paid by the business on top of the employee's gross pay. This never appears as a deduction on the payslip, but it is a real cost to the business. In Pakistan, examples include contributions to EOBI for old age benefits and to provincial employees social security institutions, where the business is covered. Whether a business is covered, and how much it pays, depends on current rules, so check with each institution.

\`\`\`text
Total payroll cost = gross pay + employer contributions
\`\`\`

### Advances and staff loans

When an employee receives an advance, record it as an asset, such as Staff Advances, not as salary expense. Each month's repayment through payroll reduces that asset. If an advance is later forgiven, the forgiven amount becomes an expense, and it may also count as taxable pay, so ask the tax adviser.

### Checking your figures

Before payment, check that:

- Every employee on the register is a real, current employee
- Gross pay matches contracts and approved changes
- Deductions have a basis and match last month unless something changed
- Total net pay matches the amount being transferred from the bank

Ghost employees, people on the payroll who do not work for the business, are a classic fraud. Comparing the register to the employee files each month is a cheap defence.
      `,
        [
          q('Which item is part of gross pay rather than a deduction?', [
            'Income tax withheld from salary',
            'Repayment of a salary advance',
            'A house rent allowance in the contract',
            'An employee pension contribution',
          ], 2, 'Allowances are earnings, so they are included in gross pay before any deductions are taken.'),
          q('Why does an employer social security contribution not appear as a deduction on the payslip?', [
            'It is paid by the business on top of gross pay',
            'It is taken from the employee\'s net pay later',
            'It is optional and rarely paid in practice',
            'It is included inside the basic salary figure',
          ], 0, 'Employer contributions are an extra business cost, not money taken from the employee.'),
          q('An employee receives a PKR 20,000 salary advance. Where is it recorded?', [
            'As salary expense for the month',
            'As owner\'s drawings',
            'As income tax payable',
            'As a staff advances asset',
          ], 3, 'The employee owes the money back, so it is an asset until repaid through payroll.'),
        ]
      ),
      lesson('Payroll Journal Entries', 13, `
Payroll creates several entries: the cost of wages, the liabilities for amounts withheld, the employer's own contributions, and the payments that clear each liability. Getting these right means the profit and loss shows the true cost of staff and the balance sheet shows exactly what is still owed to employees and to the authorities.

### The accounts you need

| Account | Type | Purpose |
|---|---|---|
| Salaries and Wages Expense | Expense | Total gross pay |
| Employer Contributions Expense | Expense | Employer's share of social security or pension |
| Salaries Payable | Liability | Net pay owed to employees until paid |
| Income Tax Withheld Payable | Liability | Tax deducted, owed to the tax authority |
| Social Security Payable | Liability | Employee and employer contributions owed |
| Staff Advances | Asset | Advances being repaid through payroll |

Keep a separate liability account for each authority or scheme. Lumping them together makes it impossible to see which payment is late.

### Entry 1: recording the payroll

Using a small business with three employees and a payroll register that totals, in illustrative figures:

\`\`\`text
Gross pay                         300,000
Income tax withheld                12,000
Employee social security            3,000
Advance repayments                  5,000
Net pay                           280,000
Employer social security            6,000
\`\`\`

The entry at the end of the month:

\`\`\`text
Salaries and Wages Expense         300,000  Debit
Employer Contributions Expense       6,000  Debit
  Income Tax Withheld Payable                12,000  Credit
  Social Security Payable                     9,000  Credit
  Staff Advances                              5,000  Credit
  Salaries Payable                          280,000  Credit
\`\`\`

Check that it balances: debits are 306,000, and credits are 12,000 plus 9,000 plus 5,000 plus 280,000, which is also 306,000. Social Security Payable carries both shares, 3,000 from employees and 6,000 from the employer.

### Entry 2: paying the employees

When salaries are transferred:

\`\`\`text
Salaries Payable     280,000  Debit
Bank                 280,000  Credit
\`\`\`

If salaries are paid on the same day they are recorded, some bookkeepers combine entries 1 and 2 and credit Bank directly. Keeping them separate is clearer, especially when salaries are paid a few days after month end.

### Entry 3: paying the authorities

When the withheld tax and contributions are paid over, each liability is cleared:

\`\`\`text
Income Tax Withheld Payable   12,000  Debit
Social Security Payable        9,000  Debit
Bank                          21,000  Credit
\`\`\`

Keep the payment receipt or challan for each deposit with the payroll file. After the payments, each payroll liability account should return to zero, or show only the amount for the latest month that is not yet due.

### Reviewing payroll liabilities

At each month end, look at the balance of every payroll liability account and ask: does this equal what is genuinely still owed? An old balance sitting in Income Tax Withheld Payable usually means tax was deducted from staff but not paid to the authority. That can create penalties for the business and must be raised with the owner immediately.

### Accruing unpaid wages

If the month ends before daily workers are paid for their last week, record the wages earned but not yet paid as an accrued liability, so the expense lands in the right month. Adjustments like this are covered fully in the next chapter.

### Bonuses and arrears

A one off Eid bonus or arrears payment follows the same pattern: gross amount to expense, deductions to their liability accounts, net to Salaries Payable. Mark the memo clearly so the owner can see what was special about that month's payroll cost.
      `,
        [
          q('Which account receives the credit for net pay owed but not yet transferred?', [
            'Salaries and Wages Expense',
            'Salaries Payable',
            'Staff Advances',
            'Employer Contributions Expense',
          ], 1, 'Net pay is owed to employees until paid, so it sits in Salaries Payable as a liability.'),
          q('In the example, why is Social Security Payable credited PKR 9,000?', [
            'Because 9,000 is the employee share alone',
            'Because it equals the tax withheld from pay',
            'Because it is a fixed amount set by the bank',
            'Because it holds both employee and employer shares',
          ], 3, 'The employee share of 3,000 and the employer share of 6,000 are both owed to the scheme.'),
          q('Income Tax Withheld Payable has carried a balance for several months. What does this usually mean?', [
            'Tax was deducted from staff but not paid over',
            'The business overpaid tax and is due a refund',
            'Employees were paid too much net salary',
            'The account was set up as an expense by error',
          ], 0, 'A lingering balance shows deductions made but not deposited, which can lead to penalties.'),
        ]
      ),
      lesson('Payroll Compliance and Where Rules Come From', 11, `
Payroll is the area of bookkeeping where the law changes most often and where mistakes become personal. An employee who is underpaid notices immediately, and an authority that is not paid will eventually notice too. A good bookkeeper does not memorise rates. A good bookkeeper knows where the rules live and checks them every time.

### The layers of payroll rules

Payroll obligations usually come from several sources at once.

| Source | What it typically governs |
|---|---|
| Income tax law and the tax authority | Withholding tax on salaries, tax tables, filing of withholding statements |
| Social security and pension schemes | Who must register, contribution rates, payment deadlines |
| Labour law | Minimum wage, working hours, overtime, leave, final settlement |
| Employment contracts and company policy | Agreed pay, allowances, bonus, notice periods |

In Pakistan, for example, withholding tax on salary falls under federal income tax law administered by FBR. Old age benefits are handled by EOBI. Employees social security is run by provincial institutions, so the rules in Punjab and Sindh may differ. Minimum wages are announced by governments and are revised over time, and provinces set their own. Other countries have their own equivalents, and the principle is the same: identify each authority, then check its current rules.

### Why you should never rely on memory

Rates, thresholds and deadlines are changed through budgets, finance acts and notifications, sometimes mid year. A figure that was correct last year can be wrong today. Treat every number as something to verify:

1. Go to the official website of the authority, such as fbr.gov.pk for federal tax in Pakistan.
2. Find the current tax table, rate card or notification for the relevant year.
3. Note the source and date in your payroll file.
4. When the rules are unclear, ask the client's tax adviser or the authority's helpline, and keep their answer in writing.

### A payroll compliance calendar

Most obligations repeat on a schedule. A simple calendar keeps you ahead of them:

\`\`\`text
Monthly
  - Process payroll and issue payslips
  - Deposit tax withheld by its due date
  - Pay social security and pension contributions
Periodically, as each authority requires
  - File withholding statements
  - File returns for social security schemes
Annually
  - Issue tax deduction certificates to employees where required
  - Review minimum wage and tax table changes after the budget
\`\`\`

Fill in the actual due dates from each authority's current rules. Do not copy dates from a template made for another country or another year.

### Final settlements

When an employee leaves, the final settlement may include unpaid salary, leave encashment, gratuity or provident fund balances depending on the contract and law, minus any advances still owed. These calculations can be legally sensitive. Prepare the figures from records, but let the owner or a qualified adviser confirm the legal entitlements.

### Knowing your limits

A bookkeeper records payroll accurately and keeps it on schedule. Deciding whether a business must register for a scheme, how to treat a complex benefit, or how to handle a labour dispute is work for a tax adviser, a labour lawyer or the authority itself. Saying "I will confirm that with your adviser" is professional, not a weakness.

### Records to keep

Keep payroll registers, payslips, attendance records, contracts, deposit challans and filed statements for as long as the law requires, which varies by country and by type of record. When in doubt, keep them longer. Payroll records are often requested years later in audits, tax inquiries and disputes with former employees.
      `,
        [
          q('In Pakistan, which body administers withholding tax on salaries?', [
            'EOBI',
            'FBR',
            'The provincial social security institution',
            'The State Bank of Pakistan',
          ], 1, 'Withholding tax on salary falls under federal income tax law, which FBR administers.'),
          q('What is the safest way to find the current salary tax rates for a payroll run?', [
            'Use the rates from last year\'s payroll file',
            'Copy them from a popular accounting blog',
            'Check the authority\'s official current tables',
            'Ask an employee what they paid last year',
          ], 2, 'Rates change through budgets and notifications, so the official current source must be checked.'),
          q('A client asks whether their business must register for a social security scheme. What should the bookkeeper do?', [
            'Decide based on how many staff they have',
            'Tell them registration is never required',
            'Register the business without asking anyone',
            'Refer the question to an adviser or the authority',
          ], 3, 'Registration duties are a legal question, so the answer should come from a qualified adviser or the scheme itself.'),
        ]
      ),
      ],
      [
      q('A worker is paid per project against invoices and serves several clients. How are they most likely classed?', [
        'As a salaried employee',
        'As an independent contractor',
        'As a director of the business',
        'As a ghost employee',
      ], 1, 'Invoicing per project and working for many clients point to an independent business, though the real relationship decides.'),
      q('Gross pay is PKR 105,000 and deductions total PKR 10,500. What is net pay?', [
        'PKR 94,500',
        'PKR 115,500',
        'PKR 105,000',
        'PKR 10,500',
      ], 0, 'Net pay is gross pay minus all deductions, so 105,000 minus 10,500 is 94,500.'),
      q('What is the total payroll cost to a business for a month?', [
        'Net pay transferred to staff, with nothing else added',
        'Gross pay minus tax withheld',
        'Gross pay plus employer contributions',
        'Net pay plus advance repayments deducted from staff',
      ], 2, 'The business bears the full gross pay and its own contributions on top.'),
      q('Which entry clears withheld tax when it is paid to the authority?', [
        'Debit Salaries Expense, credit Bank',
        'Debit Bank, credit Income Tax Withheld Payable',
        'Debit Salaries Payable, credit Income Tax Withheld Payable',
        'Debit Income Tax Withheld Payable, credit Bank',
      ], 3, 'Paying the authority reduces the liability and reduces the bank balance.'),
      ]
    ),
    chapter(
      'Adjustments and Period-End Entries',
      'Make the period-end adjustments that turn raw transactions into accurate accounts: accrued income and expenses, prepayments and deferred income, depreciation of fixed assets, and inventory with cost of goods sold.',
      [
      lesson('Accrued Income and Accrued Expenses', 12, `
Cash moves on its own timetable. Customers pay late, suppliers bill late, and some costs are only invoiced after the month has ended. If the books only recorded cash, each month's profit would depend on when money happened to move, not on what the business actually earned and used. Accruals fix that by placing income and expenses in the period they belong to.

### The matching idea

Under accrual accounting, income is recorded when it is earned and expenses when they are incurred, whether or not cash has moved. An accrual is an adjustment for something that has happened but has not yet been recorded through a normal invoice or bill.

| Type | What happened | What has not happened yet |
|---|---|---|
| Accrued expense | The business used a service | No bill received, nothing paid |
| Accrued income | The business earned income | No invoice sent, nothing received |

### Accrued expenses

A software house in Islamabad uses electricity throughout June, but the bill for June arrives in mid July. Without an accrual, June looks cheaper than it really was and July looks more expensive.

At 30 June, estimate the cost from the meter reading or recent bills and record:

\`\`\`text
30 Jun   Electricity Expense      45,000  Debit
         Accrued Expenses         45,000  Credit
         Estimated June electricity, bill due mid July
\`\`\`

Common accrued expenses include utilities, wages earned but not yet paid, interest on loans, professional fees for work already done, and rent where the landlord bills in arrears.

### Accrued income

The same software house finished a fixed price project milestone worth PKR 250,000 on 28 June, but the client's purchasing team only accepts invoices on the first working day of the month. The income was earned in June.

\`\`\`text
30 Jun   Accrued Income (asset)   250,000  Debit
         Service Revenue          250,000  Credit
         June milestone, invoice to be issued 1 July
\`\`\`

Only accrue income when it is genuinely earned and the amount is reasonably certain. Hoping a client will approve extra work is not enough.

### Reversing accruals

Accruals are temporary. When the real bill or invoice arrives next month, you do not want the cost or income counted twice. The cleanest method is a reversing entry on the first day of the new period:

\`\`\`text
01 Jul   Accrued Expenses         45,000  Debit
         Electricity Expense      45,000  Credit
\`\`\`

When the actual bill of, say, PKR 46,200 is entered in July, July's electricity expense shows only the PKR 1,200 difference from the estimate, and June carries the main cost. Many accounting systems can create the reversal automatically when you mark a journal as reversing.

For accrued income, the reversal takes the income back out of July, and the actual invoice puts it back in. The customer's balance then appears in receivables as normal.

### How accurate must an estimate be?

Use the best information available: meter readings, contracts, timesheets, last month's bill or the supplier's quotation. Write the basis in the memo so someone reviewing the books can follow your reasoning. Small differences between estimate and actual are normal and simply fall into the next month.

### Materiality

Not every small item needs an accrual. A PKR 900 courier bill arriving late may not change any decision anyone makes. Businesses often agree a threshold with their accountant, below which items are not accrued. Big or recurring items, such as rent, salaries and utilities, should always be accrued if they are not already in the books.

### Keep an accruals schedule

At each month end, keep a simple list of every accrual you made, the amount, the basis, and whether it was reversed. This makes the next close faster and gives the accountant a clear trail at year end.
      `,
        [
          q('June electricity is used in June but billed in July. What entry is made on 30 June?', [
            'Debit Bank, credit Electricity Expense',
            'Debit Electricity Expense, credit Accrued Expenses',
            'Debit Accrued Income, credit Electricity Expense',
            'No entry at all until the actual bill arrives in July',
          ], 1, 'The cost belongs to June, so it is recorded as an expense with a liability for the bill still to come.'),
          q('Why is a reversing entry made on the first day of the next period?', [
            'So the actual bill does not double count the cost',
            'So the tax authority can see the estimate',
            'Because accrued amounts must be paid that day',
            'To move the expense permanently into July',
          ], 0, 'The reversal cancels the estimate so that only the actual bill, less the reversed estimate, lands in the new month.'),
          q('When should income be accrued?', [
            'Whenever a client might approve extra work',
            'Only when the customer\'s cash has reached the bank account',
            'Only at the end of the financial year',
            'When it is earned and the amount is reasonably certain',
          ], 3, 'Accrued income must reflect work genuinely completed, not hopes or possible future approvals.'),
        ]
      ),
      lesson('Prepayments and Deferred Income', 12, `
Accruals deal with things that happened before cash moved. Prepayments and deferred income deal with the opposite: cash that moved before the thing it pays for has happened. Both need adjusting so that each month carries only its fair share.

### Prepaid expenses

A business that pays in advance for something it will use over several months has bought an asset: the right to future service. Common examples include annual rent paid upfront, yearly insurance premiums, software subscriptions billed annually and advance fees for an exhibition stall.

Suppose a clinic in Peshawar pays PKR 360,000 on 1 January for twelve months of rent.

\`\`\`text
01 Jan   Prepaid Rent (asset)    360,000  Debit
         Bank                    360,000  Credit
\`\`\`

Each month end, move one month's share to expense:

\`\`\`text
31 Jan   Rent Expense             30,000  Debit
         Prepaid Rent             30,000  Credit
\`\`\`

After January, Prepaid Rent shows PKR 330,000, the eleven months still to come. By December it reaches zero.

### A prepayment schedule

When a client has several prepayments, a schedule keeps them under control:

| Item | Paid | Months | Monthly charge | Balance at 31 Mar |
|---|---|---|---|---|
| Shop rent | 360,000 | 12 | 30,000 | 270,000 |
| Vehicle insurance | 48,000 | 12 | 4,000 | 36,000 |
| Accounting software | 24,000 | 12 | 2,000 | 18,000 |

The total of the last column must equal the Prepaid Expenses balance in the ledger. If it does not, a charge was missed or posted twice.

### When to skip it

Small advance payments, such as a PKR 2,000 annual domain renewal, are often expensed immediately because spreading them makes no real difference. As with accruals, agree a sensible threshold with the business's accountant and apply it consistently.

### Deferred income

Deferred income, also called unearned revenue, is money received from customers before the business has delivered what they paid for. Until it is delivered, the business owes the customer either the service or a refund, so the money is a liability.

A tuition academy in Multan collects PKR 90,000 from a student on 1 September for a three month course.

\`\`\`text
01 Sep   Bank                     90,000  Debit
         Deferred Income          90,000  Credit
\`\`\`

At the end of each month, recognise the part that has been taught:

\`\`\`text
30 Sep   Deferred Income          30,000  Debit
         Tuition Revenue          30,000  Credit
\`\`\`

By the end of November, the full PKR 90,000 is revenue and the liability is zero.

### Common sources of deferred income

- Annual memberships at gyms or clubs
- Software or website maintenance contracts billed in advance
- Deposits taken for future orders, such as wedding catering or custom furniture
- Course fees paid before classes start

Treating customer deposits as immediate sales makes a month look far more profitable than it was, and leaves the business with no record of what it still owes to customers. For a business that takes many advance bookings, that can hide a serious cash problem.

### Linking it together

| Situation | Cash before or after? | Adjustment account |
|---|---|---|
| Expense used, not yet billed | Cash after | Accrued Expenses (liability) |
| Income earned, not yet invoiced | Cash after | Accrued Income (asset) |
| Expense paid in advance | Cash before | Prepaid Expenses (asset) |
| Income received in advance | Cash before | Deferred Income (liability) |

Learn this table and most period-end adjustments become a matter of asking two questions: has the cash moved, and has the service happened?
      `,
        [
          q('A clinic pays PKR 360,000 for a year\'s rent in advance. What is the monthly rent expense?', [
            'PKR 360,000',
            'PKR 3,000',
            'PKR 36,000',
            'PKR 30,000',
          ], 3, 'The advance payment is spread evenly over twelve months, so each month carries 30,000.'),
          q('Why is money received for a course not yet taught recorded as a liability?', [
            'Because the bank holds it in a separate account',
            'Because the business still owes the service or a refund',
            'Because tuition fees are never treated as income',
            'Because the student may pay a second time',
          ], 1, 'Until the course is delivered, the business has an obligation to the student, which is a liability.'),
          q('What should the total of a prepayment schedule equal?', [
            'The rent expense for the year',
            'The total bank balance at month end',
            'The Prepaid Expenses balance in the ledger',
            'The deferred income balance',
          ], 2, 'The schedule supports the ledger balance, so the two must agree.'),
        ]
      ),
      lesson('Depreciation of Fixed Assets', 13, `
Some purchases last for years: a delivery van, an oven in a bakery, computers, furniture, machinery. Charging the whole cost as an expense in the month of purchase would make that month look terrible and every later year look better than it was. Instead, these items are recorded as fixed assets and their cost is spread over their useful life through depreciation.

### What counts as a fixed asset

A fixed asset is an item the business owns, expects to use for more than one year, and uses to run the business rather than to resell. Most businesses set a capitalisation threshold: items below it are expensed even if they last a long time. A PKR 3,000 stapler is not worth tracking as an asset. Agree the threshold with the business's accountant and apply it consistently.

### Recording the purchase

The cost of a fixed asset includes the price plus costs needed to get it working, such as delivery and installation.

\`\`\`text
Delivery van price          2,400,000
Registration and transfer      60,000
Total cost capitalised      2,460,000
\`\`\`

\`\`\`text
Vehicles (fixed asset)      2,460,000  Debit
Bank or Loan Payable        2,460,000  Credit
\`\`\`

Routine running costs such as fuel, servicing and insurance are expenses, not part of the asset's cost.

### Straight line depreciation

The simplest and most common method charges the same amount each year:

\`\`\`text
Annual depreciation = (cost - estimated residual value) / useful life in years
\`\`\`

For the van, if the business expects to use it for five years and sell it for PKR 460,000 at the end:

\`\`\`text
(2,460,000 - 460,000) / 5 = 400,000 per year, or about 33,333 per month
\`\`\`

### Reducing balance depreciation

This method charges a fixed percentage of the remaining book value each year, so depreciation is higher in early years and lower later. It suits assets like computers and vehicles that lose value quickly at first. The table below follows a set of computers costing PKR 400,000.

| Year | Opening book value | Depreciation at 25% | Closing book value |
|---|---|---|---|
| 1 | 400,000 | 100,000 | 300,000 |
| 2 | 300,000 | 75,000 | 225,000 |
| 3 | 225,000 | 56,250 | 168,750 |

The 25 percent here is an illustration of the method, not a recommended rate.

### The depreciation entry

Depreciation does not reduce the asset account directly. It builds up in a separate contra asset account, so the original cost remains visible.

\`\`\`text
Depreciation Expense            33,333  Debit
Accumulated Depreciation: Vehicles  33,333  Credit
\`\`\`

On the balance sheet after the van's first full year:

\`\`\`text
Vehicles at cost                 2,460,000
Less accumulated depreciation     (400,000)
Net book value                   2,060,000
\`\`\`

### The fixed asset register

Keep a register listing each asset with its description, purchase date, cost, supplier, location, method, useful life, residual value, depreciation to date and net book value. Its totals must agree with the ledger. It also helps the owner know what the business owns, which matters for insurance and if an asset is stolen or damaged.

### Disposing of an asset

When an asset is sold or scrapped, remove both its cost and its accumulated depreciation, record any cash received, and the difference becomes a gain or loss on disposal. Work this out from the register, so the right figures for that specific asset are removed.

### Accounting depreciation versus tax depreciation

The depreciation in the books follows the business's accounting policy. Tax law often has its own rules and rates for deductible depreciation, sometimes called tax depreciation or capital allowances. In Pakistan these are set out in income tax law administered by FBR. The two figures can differ, and reconciling them is the accountant's or tax adviser's job. Do not change the accounting depreciation just to match a tax table, and do not quote tax rates without checking the current law.
      `,
        [
          q('Which cost is included in the capitalised cost of a new delivery van?', [
            'Monthly fuel bought for the van after delivery',
            'The van\'s annual insurance premium',
            'Registration and transfer fees on purchase',
            'Routine servicing after six months',
          ], 2, 'Costs needed to bring the asset into use are capitalised, while running costs are expenses.'),
          q('A machine costs PKR 600,000, has a residual value of 100,000 and a life of 5 years. What is annual straight line depreciation?', [
            'PKR 100,000',
            'PKR 120,000',
            'PKR 140,000',
            'PKR 500,000',
          ], 0, 'The depreciable amount is 600,000 minus 100,000, which is 500,000, divided by 5 years gives 100,000.'),
          q('Why is depreciation credited to Accumulated Depreciation instead of the asset account?', [
            'Because tax law forbids reducing assets',
            'Because depreciation is a liability to the bank',
            'Because it makes the profit figure higher',
            'So the original cost stays visible in the books',
          ], 3, 'The contra account shows total depreciation separately, keeping cost and net book value both clear.'),
        ]
      ),
      lesson('Inventory and Cost of Goods Sold', 13, `
A business that sells physical goods has to answer a simple question every period: what did the goods we sold actually cost us? That figure, cost of goods sold, or COGS, sits directly below sales on the income statement and decides the gross profit. Getting inventory right is therefore one of the biggest influences on whether a trading business's profit is real.

### Inventory is an asset until it is sold

When a shop buys stock, the goods are not an expense yet. They are inventory, an asset, because they will be sold later. They become an expense only when sold, through COGS.

### The COGS formula

\`\`\`text
Opening inventory
+ Purchases during the period
- Closing inventory
= Cost of goods sold
\`\`\`

A mobile accessories shop in Hall Road, Lahore, has:

| Item | PKR |
|---|---|
| Opening inventory, 1 April | 850,000 |
| Purchases in April | 1,200,000 |
| Goods available for sale | 2,050,000 |
| Closing inventory, 30 April (counted) | 900,000 |
| Cost of goods sold | 1,150,000 |

If April sales were PKR 1,600,000, gross profit is PKR 450,000.

### Periodic and perpetual systems

There are two ways to keep track of inventory.

- **Periodic:** purchases are recorded in a Purchases account during the month. Inventory is counted at the end, and COGS is calculated with the formula above. Common in small shops without stock software.
- **Perpetual:** each purchase increases Inventory and each sale records COGS immediately, using item level records in software or a point of sale system. The system always shows an expected stock quantity and value.

Even with a perpetual system, physical counts are needed, because the system cannot see theft, damage or recording mistakes.

### Valuing stock when prices change

If the shop bought the same charger at different prices during the month, which cost goes to COGS? The business chooses a cost formula and applies it consistently.

| Method | Idea | Effect when prices rise |
|---|---|---|
| FIFO (first in, first out) | Oldest costs are used up first | Lower COGS, closing stock at newer prices |
| Weighted average | Each unit carries the average cost | COGS between oldest and newest prices |

Accounting standards limit which methods are acceptable, so the business's accountant should confirm the policy. Your job is to apply it the same way every period.

### The period-end inventory adjustment

Under a periodic system, after counting closing stock you adjust the Inventory account from the opening figure to the counted figure. Using the shop's numbers:

\`\`\`text
30 Apr   Inventory                 50,000  Debit
         Cost of Goods Sold        50,000  Credit
         Increase inventory from 850,000 to 900,000 per count
\`\`\`

Purchases of 1,200,000 were already charged to COGS or Purchases during the month. The adjustment brings COGS to 1,150,000 and inventory to its counted value. If closing stock had fallen, the entry would be reversed in direction, increasing COGS.

### Stock counts

A reliable count follows a plan:

1. Stop or freeze stock movements during the count, or record them carefully.
2. Count in teams of two, one counting and one writing.
3. Use count sheets by location and item code.
4. Recount any large differences against the system.
5. Value the count using the agreed cost method.

### Damaged, expired and slow moving stock

Inventory should not be shown at more than it can realistically be sold for. If phone cases are damaged or medicines near expiry cannot be sold at their cost, the value must be written down to what they can fetch, with the loss recorded as an expense. Hidden write downs make the balance sheet look stronger than it is.

### Sales tax and inventory

If the business can claim input tax on purchases, inventory is usually recorded excluding that tax. If it cannot, the tax may become part of the cost. This depends on registration and current rules, so check the treatment with the tax adviser.
      `,
        [
          q('Opening inventory is 850,000, purchases are 1,200,000 and closing inventory is 900,000. What is COGS?', [
            'PKR 2,050,000',
            'PKR 950,000',
            'PKR 1,150,000',
            'PKR 1,250,000',
          ], 2, 'Goods available of 2,050,000 minus closing stock of 900,000 gives cost of goods sold of 1,150,000.'),
          q('Why are physical stock counts still needed in a perpetual system?', [
            'Because perpetual systems cannot record sales',
            'Because the system cannot see theft or damage',
            'Because tax law bans perpetual records',
            'Because counts replace the need for a ledger',
          ], 1, 'Software tracks recorded movements only, so counts find losses and errors the system cannot see.'),
          q('Medicines in stock are close to expiry and will sell below cost. What should happen?', [
            'Write them down to what they can realistically fetch',
            'Keep them at full cost until they expire',
            'Move them into the fixed asset register',
            'Record them as deferred income instead',
          ], 0, 'Inventory should not be shown above the amount it can be sold for, so the loss is recognised now.'),
        ]
      ),
      ],
      [
      q('Annual insurance of PKR 48,000 is paid upfront. What does the balance sheet show after three months?', [
        'Prepaid insurance of PKR 48,000',
        'Prepaid insurance of PKR 12,000',
        'Accrued insurance of PKR 36,000',
        'Prepaid insurance of PKR 36,000',
      ], 3, 'Three months of 4,000 each have been expensed, leaving nine months, or 36,000, as a prepayment.'),
      q('A caterer takes a PKR 150,000 deposit for a wedding next month. How is it recorded today?', [
        'As catering revenue for this month',
        'As deferred income, a liability',
        'As accrued income, an asset',
        'As owner\'s capital contribution',
      ], 1, 'The service has not been delivered, so the deposit is owed to the customer until the event happens.'),
      q('Under reducing balance depreciation, how does the annual charge change over time?', [
        'It gets smaller each year',
        'It stays the same each year',
        'It gets larger each year',
        'It is charged only in the final year',
      ], 0, 'A fixed percentage of a shrinking book value gives a smaller charge each year.'),
      q('Closing inventory is overstated by PKR 40,000. What is the effect on gross profit?', [
        'Gross profit is understated by PKR 40,000',
        'Gross profit is not affected at all',
        'Gross profit is overstated by PKR 40,000',
        'Gross profit is overstated by PKR 80,000',
      ], 2, 'Higher closing stock lowers COGS, which raises gross profit by the same amount.'),
      ]
    ),
    chapter(
      'Financial Statements and Month-End Close',
      'Read the income statement, balance sheet and cash flow statement the way an owner or lender reads them, see how the three link together, and close the books each month with a checklist you can repeat for every client.',
      [
      lesson('Reading the Income Statement', 13, `
The income statement, also called the profit and loss statement or P&L, answers one question: did the business make or lose money over a period? It covers a span of time, such as a month, a quarter or a year, and it is built from the income and expense accounts in your ledger.

### The basic layout

Most small business income statements follow the same order, from sales at the top to net profit at the bottom.

| Line | Noor Bakers, Lahore, March (PKR) |
|---|---|
| Sales revenue | 1,200,000 |
| Less: cost of goods sold | (540,000) |
| **Gross profit** | **660,000** |
| Rent | (150,000) |
| Salaries and wages | (220,000) |
| Electricity and gas | (65,000) |
| Delivery and fuel | (30,000) |
| Depreciation | (15,000) |
| **Operating profit** | **180,000** |
| Bank charges and interest | (8,000) |
| **Net profit before tax** | **172,000** |

The figures in brackets are deductions. These are example numbers for a made-up bakery, not a benchmark for real bakeries.

### What each section tells you

**Revenue** is what the business earned from customers in the period. Under the accrual basis it includes sales invoiced but not yet paid. Under the cash basis it only includes money received.

**Cost of goods sold** (COGS) is the direct cost of what was sold: flour, sugar, butter and packaging for a bakery, or the purchase cost of stock for a shop. A service business such as a design studio may have little or no COGS.

**Gross profit** is revenue minus COGS. It shows whether the core product makes money before overheads. The gross margin is gross profit divided by revenue: here 660,000 divided by 1,200,000, or 55 percent.

**Operating expenses** are the costs of running the business that do not change directly with each item sold: rent, salaries, utilities, marketing, software.

**Net profit** is what is left after everything. It is the number owners care about most, but it is not the same as cash in the bank, which is why the cash flow statement exists.

### Questions an owner should ask of a P&L

A bookkeeper does not just produce the report; you help the owner read it. Useful questions:

1. **Compared with what?** One month alone says little. Put this month beside last month and the same month last year.
2. **Did gross margin change?** If sales grew but margin fell, input prices may have risen or discounts may be too generous.
3. **Which expense grew fastest?** A jump in electricity in summer is normal in Karachi; a jump in "miscellaneous" needs investigating.
4. **Is anything missing?** If there is no rent line one month, an invoice may not have been recorded.

### Common errors that distort the P&L

| Error | Effect |
|---|---|
| Owner's personal shopping booked as an expense | Profit understated |
| Loan repayment principal booked as an expense | Profit understated; the principal reduces a liability instead |
| Purchase of a new oven booked as an expense | Profit understated this month; it should be a fixed asset and depreciated |
| Customer deposit booked as sales before the work is done | Revenue overstated; it is deferred income until earned |
| Bills left unrecorded at month end | Profit overstated |

Each of these comes up again and again in real client books. When a P&L looks surprisingly good or bad, check this list first.

### Tax is a separate step

Net profit before tax is not automatically the taxable profit. Tax law adds back some expenses and allows others differently. The rules and rates change, so for a Pakistan business the current position must be checked with FBR guidance or a qualified tax adviser. Your job as a bookkeeper is to give the adviser clean, complete numbers.
      `,
        [
          q('What does gross profit measure on an income statement?', [
            'Cash left in the bank at month end',
            'Revenue minus the direct cost of goods sold',
            'Profit after every expense and tax',
            'Total sales including unpaid invoices only',
          ], 1, 'Gross profit is revenue less cost of goods sold, showing whether the core product earns money before overheads.'),
          q('A client bought a new oven and it was booked as an expense. What is the effect?', [
            'Revenue is overstated for the month',
            'Cash in the bank is overstated',
            'Liabilities are understated for the month',
            'Profit is understated for the month',
          ], 3, 'A long-lasting asset belongs on the balance sheet and is depreciated, so expensing it all at once understates profit.'),
          q('Why should a P&L be compared with other periods?', [
            'One month alone says little about whether results are improving',
            'Tax law requires a monthly comparison column on every report',
            'The figures are only correct when shown beside another month',
            'Comparison columns remove the need for bank reconciliation',
          ], 0, 'Trends and changes are what reveal problems, such as falling margin or a fast-rising expense.'),
        ]
      ),
      lesson('Reading the Balance Sheet', 13, `
The balance sheet shows what a business owns and owes at a single moment, usually the last day of a month or year. Where the income statement is a video of a period, the balance sheet is a photograph of one date. It is built straight from the accounting equation: assets equal liabilities plus equity.

### The layout

| Noor Bakers, balance sheet at 31 March (PKR) | |
|---|---|
| **Non-current assets** | |
| Ovens and equipment, at cost | 900,000 |
| Less: accumulated depreciation | (240,000) |
| **Current assets** | |
| Inventory (ingredients and packaging) | 85,000 |
| Accounts receivable (cafes on credit) | 140,000 |
| Bank and cash | 310,000 |
| **Total assets** | **1,195,000** |
| **Current liabilities** | |
| Accounts payable (suppliers) | 120,000 |
| Accrued expenses (unpaid electricity) | 40,000 |
| **Non-current liabilities** | |
| Bank loan | 300,000 |
| **Equity** | |
| Owner's capital | 500,000 |
| Retained profit | 235,000 |
| **Total liabilities and equity** | **1,195,000** |

The two totals must match. If they do not, something has been posted to one side only, and the books are not ready to share.

### Current and non-current

Assets and liabilities are split by timing. **Current** means expected to turn into cash, or be paid, within about a year: stock, receivables, bank balances, supplier bills. **Non-current** means longer term: equipment, vehicles, long-term loans. The split matters because a lender wants to know whether short-term debts can be paid from short-term assets.

A simple check is the current ratio: current assets divided by current liabilities. Here 535,000 divided by 160,000 gives about 3.3. A ratio below 1 means short-term debts exceed short-term assets, which is a warning sign worth raising with the owner. There is no single "correct" ratio for every industry, so treat it as a conversation starter, not a verdict.

### How equity connects to the P&L

Equity is the owner's stake. It grows when the owner puts money in and when the business makes a profit. It shrinks when the owner takes drawings and when the business makes a loss.

\`\`\`text
Opening equity          650,000
+ Net profit for March  172,000
- Owner drawings        (87,000)
= Closing equity        735,000
\`\`\`

This is the link between the two statements: the net profit at the bottom of the P&L flows into retained profit on the balance sheet. If a P&L shows a profit but equity did not move, something is wrong.

### Reading it for problems

Walk down the balance sheet and ask whether each number makes sense.

- **Bank:** does it match the reconciled bank statement exactly? If not, reconcile before anything else.
- **Receivables:** does it match the aged receivables report? Are some customers 90 days overdue and unlikely to pay?
- **Inventory:** was it counted, or is it a guess carried forward for six months?
- **Payables:** does it match supplier statements? A negative payable usually means a payment was recorded but the bill was not.
- **Suspense or "ask my accountant" accounts:** these should be zero at month end. Anything left there is unexplained.
- **Loans:** does the balance agree to the lender's statement?

A balance sheet where every line has been checked against an outside document is one a bank or investor can trust. That checking is a large part of what clients pay a bookkeeper for.

### Negative balances are clues

An asset account showing a negative balance, such as negative cash or negative inventory, is almost always an error, not a real situation. Negative cash in the books while the real bank shows money usually means deposits were not recorded. Investigate every negative before closing the month.
      `,
        [
          q('What is the key difference between a balance sheet and an income statement?', [
            'The balance sheet only shows income and expense accounts',
            'The income statement shows one date while the balance sheet covers a period',
            'The balance sheet shows one date while the income statement covers a period',
            'They show the same accounts arranged in a different order',
          ], 2, 'The balance sheet is a snapshot at a moment in time; the income statement covers activity over a span of time.'),
          q('Accounts payable shows a negative balance at month end. What is the most likely cause?', [
            'A supplier payment was recorded but the matching bill was not',
            'The business has made a large profit this month',
            'The owner put more capital into the business',
            'Depreciation was posted twice in the same month',
          ], 0, 'Paying a supplier reduces payables, so without the bill entered first the balance goes below zero.'),
          q('How does net profit for the month affect the balance sheet?', [
            'It reduces the bank loan balance directly',
            'It is added to accumulated depreciation',
            'It has no effect until the year is closed',
            'It increases equity through retained profit',
          ], 3, 'Profit belongs to the owners, so it flows from the P&L into retained profit within equity.'),
        ]
      ),
      lesson('The Cash Flow Statement', 13, `
Profitable businesses run out of cash all the time. A wholesaler in Faisalabad can show a healthy profit while unable to pay salaries, because customers owe money and the warehouse is full of stock. The cash flow statement explains why profit and cash differ, and where the cash actually went.

### Three sections

Every cash flow statement groups cash movements into three activities.

| Section | What goes here | Examples |
|---|---|---|
| Operating | Cash from running the business day to day | Cash from customers, payments to suppliers, salaries, rent |
| Investing | Cash spent on or received from long-term assets | Buying an oven or a delivery bike, selling old equipment |
| Financing | Cash from or to owners and lenders | New bank loan, loan repayments, owner capital, owner drawings |

The total of the three sections is the net change in cash for the period. Add it to opening cash and you must arrive at closing cash on the balance sheet. That tie-out is the first check on any cash flow statement.

### The indirect method in plain steps

Most accounting software, including QuickBooks Online, builds the operating section with the indirect method. It starts with net profit and adjusts for items where profit and cash differ.

\`\`\`text
Net profit                                   172,000
+ Depreciation (an expense with no cash out)  15,000
- Increase in receivables (sales not yet paid) (40,000)
- Increase in inventory (cash tied up in stock) (25,000)
+ Increase in payables (bills not yet paid)    30,000
= Cash from operating activities             152,000

Investing: bought a mixer                    (60,000)
Financing: loan repayment (principal)        (25,000)
Financing: owner drawings                    (87,000)

Net change in cash                           (20,000)
Opening cash                                 330,000
Closing cash                                 310,000
\`\`\`

Read the adjustments with one rule in mind: **when an asset other than cash goes up, cash went down; when a liability goes up, cash was kept.** More receivables means customers kept your money. More payables means you kept the supplier's money for now.

### Why depreciation is added back

Depreciation reduces profit, but no cash leaves the business when you post it. The cash left when the equipment was bought, and that payment shows in investing activities in the period of purchase. Adding depreciation back simply removes a non-cash expense from the operating figure.

### What owners learn from it

- **Operating cash lower than profit, month after month:** customers are paying slowly or stock is building up. Look at the aged receivables and the stock count.
- **Big investing outflow:** the business bought equipment. That may be healthy growth, but check how it was funded.
- **Financing inflows keeping the business alive:** if operating cash is negative and loans or the owner's own money cover the gap every month, the business model needs attention.
- **Drawings larger than profit:** the owner is taking out more than the business earns, which drains cash and equity over time.

### Direct method as a cross-check

The direct method lists actual cash receipts and payments: cash from customers, cash to suppliers, cash for salaries. Small business owners often find it easier to understand because it looks like their bank statement grouped into categories. You can build a rough version from a categorised bank account. If your direct and indirect operating totals disagree, a transaction has likely been classified in the wrong section, such as a loan repayment hiding in operating expenses.

### Keep personal and business money apart

The cash flow statement only makes sense when the bank account belongs to the business. When an owner runs family expenses through the shop account, operating cash looks worse than it is. Record those payments as drawings in financing so the operating figure stays honest.
      `,
        [
          q('Under the indirect method, why is depreciation added back to net profit?', [
            'It is a cash receipt from selling old equipment',
            'It reduced profit without any cash leaving the business',
            'It represents a new loan received during the month',
            'Tax rules require it to be shown twice on the statement',
          ], 1, 'Depreciation is a non-cash expense; the cash went out when the asset was bought.'),
          q('Receivables rose by PKR 40,000 during the month. How does this affect operating cash compared with profit?', [
            'Operating cash is PKR 40,000 higher than profit',
            'It has no effect on operating cash at all',
            'Operating cash is PKR 40,000 lower than profit',
            'It moves to the financing section instead',
          ], 2, 'Sales were counted in profit but customers have not paid, so less cash came in than profit suggests.'),
          q('In which section does buying a delivery motorbike for the business appear?', [
            'Operating activities',
            'Financing activities',
            'It does not appear on the statement',
            'Investing activities',
          ], 3, 'Buying long-term assets such as vehicles and equipment is an investing outflow.'),
        ]
      ),
      lesson('A Month-End Close Checklist', 14, `
Closing the month means bringing the books to a point where the reports are complete and correct, then locking the period so nobody changes it by accident. A good close follows the same checklist every month. The checklist is what makes you reliable, and reliability is what clients pay for.

### When to close

Most small businesses can close within the first week or two of the following month, once bank statements and supplier bills have arrived. Agree a date with each client, such as "books closed by the 10th", and ask for documents by a fixed earlier date.

### The checklist

| Step | Task | Done when |
|---|---|---|
| 1 | Record all sales invoices and receipts for the month | Invoice numbers run in sequence with no gaps |
| 2 | Record all supplier bills and expense receipts | Every bill received is entered; missing ones are listed |
| 3 | Reconcile every bank account and mobile wallet | Reconciled balance equals the statement |
| 4 | Count and reconcile petty cash | Cash counted equals the book balance |
| 5 | Review accounts receivable | Ties to the aged report; doubtful debts flagged |
| 6 | Review accounts payable | Ties to supplier statements |
| 7 | Post payroll for the month | Salary expense and payroll liabilities recorded |
| 8 | Post adjustments | Accruals, prepayments, deferred income, depreciation |
| 9 | Update inventory | Count or estimate recorded; COGS adjusted |
| 10 | Clear suspense and uncategorised accounts | Balance is zero |
| 11 | Reconcile loans and credit cards | Agree to lender and card statements |
| 12 | Review the trial balance and reports | P&L, balance sheet, cash flow checked for oddities |
| 13 | Review tax accounts | Sales tax and withholding balances agree to returns or workings |
| 14 | Lock the period and send the report pack | Closing date set; owner receives reports and notes |

Steps 1 to 4 make the records complete. Steps 5 to 11 make the balances correct. Steps 12 to 14 check, protect and communicate.

### Analytical review: does it look right?

After the entries are posted, step back and look at the numbers as a whole. This is called analytical review.

1. Compare each P&L line with last month and the same month last year.
2. Investigate any line that moved by a large amount, say more than 20 percent, without a known reason. Choose a threshold that suits the client.
3. Check that recurring costs appear once each: one rent, one internet bill, one salary run.
4. Check balance sheet accounts against outside documents, not just against last month.

A restaurant in Islamabad showing no gas expense in January is almost certainly missing a bill, not having a lucky month.

### Write notes, not just numbers

Send the owner a short note with the reports. Three to five bullet points work well:

\`\`\`text
March close notes, Noor Bakers
- Sales up 8% on February; Ramadan orders from two cafes.
- Gross margin down from 57% to 55%; butter price rose.
- Al Noor Cafe owes PKR 60,000, now 75 days overdue.
- Electricity bill not received yet; accrued at February amount.
- Please send the new oven invoice for the asset register.
\`\`\`

The note is where you show value. Most owners will not read a balance sheet, but they will read five lines that tell them what changed and what you need from them.

### Locking the period

After the close, set a closing date in your software so earlier transactions cannot be edited without a password or a warning. In QuickBooks Online this is the "Close the books" option in the Accounting section of the Advanced tab under Account and settings; menu names can shift as Intuit updates the product. Without a lock, a client or a colleague can change last month's numbers after the reports have gone to the bank.

### Keep a close file

Save each month's reconciliation reports, the checklist with dates and initials, and the report pack in one folder per month. If a question arrives months later from the owner, an auditor or the tax authority, you can show exactly what was done and when.
      `,
        [
          q('Why should the books be locked after the month is closed?', [
            'Locking automatically files the client\'s tax returns',
            'It stops earlier transactions being changed after reports are sent',
            'Software deletes unlocked periods after ninety days',
            'It is the only way to produce a balance sheet',
          ], 1, 'A closing date protects reported figures from accidental edits by the client or colleagues.'),
          q('During analytical review, a restaurant shows no gas expense for January. What is the best response?', [
            'Accept it as a good month and move on',
            'Delete the gas expense account from the chart',
            'Post a random estimate without any notes',
            'Investigate a missing bill and accrue it if needed',
          ], 3, 'A recurring cost that vanishes usually means a bill was not recorded, so investigate and accrue it.'),
          q('What should a suspense or uncategorised account show after the close?', [
            'A zero balance with every item explained',
            'The same balance as the bank account',
            'Whatever amount is left over from the month',
            'A balance equal to the month\'s net profit',
          ], 0, 'Suspense holds unexplained items, so a proper close clears it to zero.'),
        ]
      ),
      ],
      [
      q('Which statement best describes how the three financial statements connect?', [
        'They are independent reports built from unrelated accounts',
        'The cash flow statement replaces the balance sheet each month',
        'Profit flows into equity and the cash flow ends at balance sheet cash',
        'The balance sheet total always equals the month\'s revenue',
      ], 2, 'Net profit feeds retained profit in equity, and the cash flow statement explains the change in the cash shown on the balance sheet.'),
      q('A shop shows a strong profit but cannot pay salaries. Which report best explains why?', [
        'The trial balance',
        'The chart of accounts',
        'The sales receipt list',
        'The cash flow statement',
      ], 3, 'The cash flow statement shows where cash went, such as into receivables, stock or loan repayments.'),
      q('An owner\'s family grocery bills were paid from the business account. How should they be recorded?', [
        'As owner drawings, not as business expenses',
        'As cost of goods sold for the month',
        'As an investing outflow for new assets',
        'As a prepayment to be expensed next year',
      ], 0, 'Personal spending is a withdrawal of the owner\'s equity, so booking it as an expense would understate profit.'),
      q('Which month-end step should come before reviewing the reports?', [
        'Sending the report pack to the owner',
        'Reconciling every bank account and wallet',
        'Locking the period with a closing date',
        'Filing the close folder for the month',
      ], 1, 'Reports are only worth reviewing once the records are complete and the bank balances are proven.'),
      ]
    ),
    chapter(
      'QuickBooks Online Setup and Daily Work',
      'Set up a QuickBooks Online company with the right settings, bring in a clean chart of accounts and opening balances, create products, services, customers and vendors, and record invoices, payments and expenses the way a working bookkeeper does every day.',
      [
      lesson('Creating a Company File and Settings', 14, `
QuickBooks Online (QBO) is cloud accounting software from Intuit. Everything you learned on paper still applies: QBO records debits and credits behind every form, and the reports are built from the same ledger. What changes is speed, and the fact that a few settings chosen on day one are hard or impossible to undo.

### Before you sign up

QBO is sold as a monthly subscription with several plans, and each higher plan unlocks more features such as bills, inventory tracking, classes and more users. Plan names, features and prices change and differ by country, so check Intuit's website for the current offer in your region. There is no edition built specifically for Pakistan's tax rules at the time of writing, so businesses here usually use an international or regional edition and set up their own tax rates. Confirm what is available before promising a client anything.

Free trials let you practise. Many bookkeepers also open a free QuickBooks Online Accountant account, which gives a sample company and a dashboard for managing client files.

### The setup wizard

When a new company is created, QBO asks a few questions: business name, industry, what you sell, and how the business is structured. Answer honestly but do not worry about perfection; most of these can be edited later. The answers mainly decide which default accounts QBO creates.

### Settings to get right on day one

Open the gear icon and choose **Account and settings**. The menu names shift as Intuit updates the product, but the sections stay similar.

| Setting | Where | Why it matters |
|---|---|---|
| Company name, address, tax ID | Company | Appears on invoices and reports |
| Home currency | Advanced | Locked for good once multicurrency is turned on |
| Multicurrency | Advanced | Needed for USD or AED customers; cannot be turned off once on |
| First month of financial year | Advanced | Sets the year for reports; Pakistan businesses often use July to June, but confirm with the client |
| Accounting method | Advanced | Accrual or cash for reports; you can switch the report view later |
| Account numbers | Advanced | Turn on if your chart uses numbers |
| Close the books | Advanced | Locks earlier periods after month end |
| Invoice terms and numbering | Sales | Default due dates and sequential numbers |
| Purchase orders | Expenses | Turn on if the client raises POs; bills themselves depend on the plan |

**Home currency** deserves extra care. For a Karachi business that banks in rupees, it should be Pakistani rupee. A freelancer who wants to see everything in rupees but bills clients in dollars still sets PKR as home currency and turns on multicurrency. Once multicurrency is on, the home currency can no longer be changed, so a wrong choice may mean starting a new company file.

### Users and access

Under **Manage users**, invite the owner, staff and the accountant. Give each person the lowest level of access they need. A shop assistant who enters sales receipts does not need to see payroll or the bank balance. Add your accountant through the dedicated accountant invitation rather than sharing the owner's login. Shared logins break the audit log, which records who changed what.

### Choosing a start date

Decide the date from which QBO will hold full records, usually the first day of a month or a financial year. Everything before that date comes in as opening balances, which the next topic covers. A clean start date makes it easy to reconcile the first bank statement.

\`\`\`text
Start date:          1 July
Opening balances:    as at 30 June (from old books or trial balance)
First reconciliation: July bank statement, opening balance must match 30 June
\`\`\`

### Keep a setup record

Write down every setting you chose and why, in a short document saved in the client folder. When a client asks months later why invoices show 15-day terms or why the year starts in July, you have the answer ready.
      `,
        [
          q('Why should home currency be chosen carefully when setting up QBO?', [
            'It controls which bank feeds the company can connect',
            'It decides how many users can access the company file',
            'It is locked for good once multicurrency is turned on',
            'It sets the tax rate applied to every invoice',
          ], 2, 'Turning on multicurrency locks the home currency, so a wrong choice may mean starting a new company file.'),
          q('A Lahore freelancer bills foreign clients in US dollars but banks in rupees. What setup fits best?', [
            'PKR as home currency with multicurrency turned on',
            'USD as home currency with multicurrency turned off',
            'Two separate company files, one for each currency',
            'PKR as home currency and dollars entered as rupees',
          ], 0, 'Rupees as home currency matches the bank, and multicurrency lets invoices be raised in dollars.'),
          q('Why should the accountant get their own invitation instead of the owner\'s login?', [
            'QBO charges less when fewer people use one login',
            'Separate logins keep the audit log accurate about who changed what',
            'Accountants cannot view reports through a shared login',
            'Shared logins automatically turn off bank feeds',
          ], 1, 'Each user\'s actions are recorded under their own name, which keeps a reliable trail of changes.'),
        ]
      ),
      lesson('Importing and Editing the Chart of Accounts', 13, `
QBO creates a default chart of accounts based on the industry you chose. It is a starting point, not a finished design. Before entering transactions, shape the chart to fit the client so reports make sense from the first month.

### Account types and detail types

Every QBO account has two labels. The **account type** decides where it appears on the reports, such as Bank, Accounts receivable, Current assets, Fixed assets, Accounts payable, Credit card, Income, Cost of goods sold or Expenses. The **detail type** is a finer label inside that type, such as "Rent or lease of buildings" under Expenses.

The account type is what matters for the statements. An electricity account set up as a Current asset will put the bill on the balance sheet instead of the P&L. Check types carefully when you build or import a chart.

### Editing the default chart

Go to the chart of accounts list (under Accounting or Transactions, depending on the menu version). Common edits:

- **Rename** generic accounts to match the client's language, for example "Utilities" to "Electricity and gas".
- **Make inactive** accounts the client will never use. QBO does not allow most accounts to be deleted once created; making them inactive hides them from lists.
- **Add sub-accounts** for detail without cluttering the reports, such as Salaries with sub-accounts for kitchen staff and front of house.
- **Turn on account numbers** in Advanced settings if you prefer a numbered chart.

### Importing a chart from a spreadsheet

For a client with a chart you have already designed, importing saves time. Use **Import data** from the gear menu and choose Accounts. Prepare a spreadsheet with clear columns.

| Account number | Account name | Type | Detail type |
|---|---|---|---|
| 1010 | Meezan Bank current account | Bank | Checking |
| 1020 | JazzCash business wallet | Bank | Cash on hand |
| 1200 | Accounts receivable | Accounts receivable (A/R) | Accounts Receivable (A/R) |
| 4010 | Sales, cakes and pastries | Income | Sales of Product Income |
| 5010 | Ingredients | Cost of Goods Sold | Supplies and Materials |
| 6010 | Shop rent | Expenses | Rent or Lease of Buildings |

The exact type and detail type names must match what QBO expects, and those lists vary slightly by regional edition. Download QBO's sample import file first and copy its spelling. After importing, open the chart and check that every account landed with the right type.

### Entering opening balances

Opening balances bring the position at your start date into QBO. The cleanest method is a single journal entry dated the day before the start date, taken from the closing trial balance of the old books.

\`\`\`text
Journal entry, 30 June
Dr Meezan Bank current account     310,000
Dr Inventory                        85,000
Dr Ovens and equipment             900,000
   Cr Accumulated depreciation              240,000
   Cr Bank loan                             300,000
   Cr Opening balance equity                755,000
\`\`\`

Receivables and payables are better entered as individual open invoices and bills dated when they were raised, so that each customer and supplier balance is correct and payments can be matched later. Use a dedicated item, such as "Opening balance", whose account is opening balance equity, so these old invoices and bills do not inflate the new period's income or expenses.

**Opening balance equity** is a temporary holding account. Once all openings are in, move its balance into the client's proper equity accounts, such as owner's capital and retained earnings, with a journal entry. A leftover balance there tells any reviewer that the setup was never finished.

### Check before moving on

Run a trial balance as at the day before the start date. It should match the old books line by line. Run a balance sheet for the same date and confirm the bank balance equals the bank statement. Fixing a wrong opening balance later means every report since then has been wrong too.
      `,
        [
          q('Which label decides whether an account appears on the P&L or the balance sheet?', [
            'The detail type chosen for the account',
            'The account type chosen for the account',
            'The account number given to the account',
            'The description typed for the account',
          ], 1, 'Account type controls report placement; detail type is a finer label within it.'),
          q('A client never uses the default "Travel meals" account. What should you do in QBO?', [
            'Delete it along with any history',
            'Rename it to the bank account name',
            'Change its type to fixed assets',
            'Make it inactive so it is hidden from lists',
          ], 3, 'QBO generally keeps accounts rather than deleting them, so inactive status hides unused ones safely.'),
          q('What does a balance left in opening balance equity after setup suggest?', [
            'Opening balances were never moved into the proper equity accounts',
            'The business made a profit in its very first month',
            'The bank feed has stopped downloading new transactions',
            'The owner has taken drawings before the start date',
          ], 0, 'Opening balance equity is temporary and should be cleared into capital and retained earnings once setup is complete.'),
        ]
      ),
      lesson('Products, Services, Customers and Vendors', 13, `
Lists are the backbone of daily work in QBO. Every invoice needs a customer and at least one product or service; every bill needs a vendor. Set up the lists properly and transactions take seconds; set them up badly and every report is muddled.

### Products and services

The products and services list holds everything the business sells and, if you choose, everything it buys regularly. Each item has a type.

| Item type | Use it for | Example |
|---|---|---|
| Service | Work or time you sell | Bridal makeup session, website maintenance |
| Non-inventory | Goods you sell but do not track in stock | Custom printed banners made to order |
| Inventory | Goods you buy and track quantity on hand | Phone chargers in a Hall Road shop |
| Bundle | A group of items sold together | Birthday package: cake, candles and delivery |

Inventory tracking is only available on some plans. When turned on, QBO tracks quantity and posts cost of goods sold automatically each time you sell, using the first in, first out method. For a business with simple stock and a monthly count, non-inventory items plus a month-end stock adjustment may be easier.

### What to fill in for each item

- **Name and SKU:** short and consistent, so staff pick the right one.
- **Sales description and price:** what appears on the invoice. Prices can be overwritten on each invoice.
- **Income account:** where the sale is recorded. Point different item groups to different income accounts if the owner wants sales split on the P&L, such as "Sales, catering" and "Sales, shop".
- **Purchase details:** tick "I purchase this" to set a cost and an expense or COGS account.
- **Tax:** whether sales tax applies by default. Only set this after the tax settings are correct.

Use **categories** to group items, such as cakes, pastries and drinks, for cleaner sales reports.

### Customers

Create a customer record for every customer who receives an invoice. Cash walk-in sales can go to a single "Walk-in customer" record to keep the list tidy.

Fill in:

- Display name exactly as it should appear on invoices.
- Email, so invoices can be sent from QBO.
- Billing address and, for a business customer, their tax registration number if invoices must show it.
- Payment terms, such as Net 15 or Due on receipt.
- Currency, if multicurrency is on. A customer's currency cannot be changed after transactions exist.

**Sub-customers** are useful for projects. A construction contractor in Rawalpindi might have one customer, a property developer, with sub-customers for each building site.

### Vendors

Vendors are suppliers: the flour mill, the landlord, the internet provider, the freelance designer. Set them up with name, contact details, payment terms and default expense category. The default category saves time on every bill and keeps classification consistent.

For contractors who may need tax withheld on their payments, record their tax registration details in the vendor record. Withholding rules depend on the type of payment and change from year to year, so check FBR's current guidance or a tax adviser before setting anything up.

### Importing lists

For a client with hundreds of customers, use **Import data** with a spreadsheet. Clean it first:

\`\`\`text
Before import, check:
- No duplicates ("Ali Traders" and "Ali Traders Pvt Ltd")
- Phone numbers in one format
- Emails valid and in one column
- Names short enough to fit QBO's field limit
\`\`\`

Duplicates are the most common mess. Two records for one customer mean two half balances, two aged receivable lines and confused chasing. If they already exist, QBO lets you merge them by renaming one to exactly match the other, but merging cannot be undone, so check carefully first.
      `,
        [
          q('A Hall Road shop wants QBO to track how many phone chargers are on hand. Which item type fits?', [
            'Service',
            'Bundle',
            'Inventory',
            'Non-inventory',
          ], 2, 'Inventory items track quantity on hand and post cost of goods sold when sold.'),
          q('Why set a default expense category on each vendor record?', [
            'It speeds up entry and keeps classification consistent',
            'It is required before QBO will allow any payment',
            'It automatically files withholding tax returns',
            'It stops the vendor from sending duplicate bills',
          ], 0, 'A default category fills in the account for each bill, saving time and reducing misclassification.'),
          q('What is the main problem with duplicate customer records?', [
            'QBO charges extra for each additional customer record',
            'Invoices for that customer can no longer be emailed',
            'Duplicate records stop the bank feed from working',
            'The customer\'s balance gets split across two records',
          ], 3, 'Two records mean split balances and unreliable aged receivables, which makes chasing payment harder.'),
        ]
      ),
      lesson('Invoicing, Receiving Payments and Entering Expenses', 15, `
Daily bookkeeping in QBO comes down to a handful of forms. Learn which form fits each situation and the ledger takes care of itself. Most forms open from the **+ New** button.

### Which sales form to use

| Situation | QBO form | What it posts |
|---|---|---|
| Customer will pay later | Invoice | Dr Accounts receivable, Cr Income |
| Customer pays on the spot | Sales receipt | Dr Bank or Payments to deposit, Cr Income |
| Customer pays an invoice | Receive payment | Dr Bank or Payments to deposit, Cr Accounts receivable |
| Customer returns goods or gets credit | Credit memo | Dr Income, Cr Accounts receivable |
| Price offer before a sale | Estimate | Nothing; no accounting entry until converted |

### Creating an invoice

1. Choose the customer. Terms and email fill in from their record.
2. Check the invoice date and due date.
3. Add lines: product or service, description, quantity, rate.
4. Apply tax if relevant, then check the total.
5. Attach any supporting file, such as a signed delivery note.
6. **Save and send** to email it, or save and print.

Customise the invoice template under Sales settings with the logo, payment instructions and bank details. Payment instructions on the invoice, such as an IBAN and the invoice number as reference, make matching payments far easier.

### Receiving a payment

When a cafe in Gulberg pays two invoices with one bank transfer, use **Receive payment**:

1. Choose the customer. Open invoices appear.
2. Tick the invoices being paid and check the amounts.
3. Enter the payment date, method and reference.
4. Choose where the money went: directly to the bank account, or to the holding account QBO uses for payments awaiting deposit, called Payments to deposit in recent versions and Undeposited Funds in older ones.

Use the holding account when several payments arrive in the bank as one deposit, for example a day's cash taken to the bank together. Then record a **bank deposit** that groups them, so the single figure matches the bank statement. When each payment arrives separately, deposit straight to the bank.

If the payment came through a bank feed, you can instead match the feed line to the open invoice, which the next chapter covers. Never record the payment both ways, or the bank will be doubled.

### Recording expenses

| Situation | QBO form | Notes |
|---|---|---|
| Paid immediately by bank, card or cash | Expense | Choose the payment account and category |
| Supplier bill to pay later | Bill | Posts to accounts payable |
| Paying a bill already entered | Pay bills | Clears the bill and reduces payables |
| Cheque payment | Cheque or check | Name depends on regional edition |
| Supplier refund or credit | Vendor credit | Reduces what you owe |

The key rule: if a bill was entered, pay it with **Pay bills**. Recording the payment as a fresh Expense posts the cost twice and leaves the bill open forever in aged payables.

### Receipts and attachments

Every expense should carry its evidence. Staff can photograph receipts in the QBO mobile app, or, where your edition offers it, forward them by email to the company's receipt address, and QBO will read the details and suggest a match. Check suggestions before accepting them; scanned amounts and dates are sometimes misread, especially from faded thermal receipts.

### A daily routine for a small client

\`\`\`text
Each working day (15 to 30 minutes):
1. Enter new invoices and sales receipts
2. Record payments received and match to invoices
3. Enter bills and expense receipts with attachments
4. Review the bank feed (next chapter)
Each week:
5. Check overdue invoices and send reminders
6. Pay bills due this week
\`\`\`

Small, regular sessions keep the books current. A client whose receipts pile up for three months becomes a cleanup job, which takes far longer and costs both of you more.
      `,
        [
          q('A customer pays in cash at the counter when buying. Which QBO form fits?', [
            'Invoice with Net 15 terms',
            'Estimate converted later',
            'Credit memo for the sale',
            'Sales receipt',
          ], 3, 'A sales receipt records a sale paid at the time, with no receivable left open.'),
          q('A supplier bill was entered last week and is now paid. How should the payment be recorded?', [
            'Use Pay bills so the existing bill is cleared',
            'Enter a new Expense for the full amount',
            'Create a vendor credit for the amount paid',
            'Delete the bill and enter a journal entry',
          ], 0, 'Pay bills clears the open bill; a new Expense would double the cost and leave the bill unpaid in payables.'),
          q('When is the holding account for undeposited payments most useful?', [
            'When each payment reaches the bank on its own',
            'When several payments reach the bank as one deposit',
            'When a customer is given a credit memo',
            'When a supplier bill is paid by cheque',
          ], 1, 'Grouping payments into one bank deposit makes QBO\'s figure match the single line on the bank statement.'),
        ]
      ),
      ],
      [
      q('Which setting is locked for good once multicurrency is turned on?', [
        'Invoice numbering format',
        'Home currency of the company',
        'The company\'s logo and address',
        'Default payment terms on invoices',
      ], 1, 'Multicurrency locks the home currency, while display and sales settings can be edited at any time.'),
      q('What is the cleanest way to enter customer balances owed at the start date?', [
        'One journal entry crediting sales for the total',
        'Leave them out and record payments as new income',
        'Enter each open invoice so balances can be matched later',
        'Add them to the bank balance as a single deposit',
      ], 2, 'Individual open invoices give correct customer balances and let later payments be matched properly.'),
      q('An electricity expense account was imported with the type Current assets. What goes wrong?', [
        'The bill will be doubled in accounts payable',
        'QBO will refuse to record any bills to it',
        'Sales tax will be applied to the electricity bill',
        'The cost appears on the balance sheet instead of the P&L',
      ], 3, 'Account type controls report placement, so a wrong type moves an expense onto the balance sheet.'),
      q('A payment arrives by bank transfer and also appears in the bank feed. What must you avoid?', [
        'Recording it with Receive payment and again from the feed',
        'Matching the feed line to the open invoice in QBO',
        'Adding the customer\'s reference to the payment record',
        'Choosing the bank account as the deposit destination',
      ], 0, 'Recording the same payment twice doubles the bank balance, so record it once and match the other side.'),
      ]
    ),
    chapter(
      'QuickBooks Online Banking, Tax and Reports',
      'Bring bank transactions into QuickBooks Online by feed or file, categorise and match them correctly, automate repeat items with bank rules, reconcile every account, set up sales tax as a general framework, and produce the reports clients actually use.',
      [
      lesson('Connecting Bank Feeds and Categorising Transactions', 14, `
Bank feeds are what make cloud bookkeeping fast. Instead of typing each line from a bank statement, transactions flow into QBO and you decide what each one is. The work moves from data entry to review, which is where a bookkeeper's judgement matters.

### Two ways to get bank data in

| Method | How it works | When to use it |
|---|---|---|
| Direct connection | QBO links to the bank with the client's online banking login and downloads new transactions regularly | When the bank is supported in your QBO edition |
| File upload | Download a statement file (CSV, or formats such as QBO or OFX) from online banking and upload it | When no direct connection exists, or the connection breaks |

Direct connections depend on which banks Intuit's data partners support in each country, and that list changes. Many Pakistani banks and mobile wallets are not available for direct connection, so file upload is common. Check the current list inside QBO before promising a client automatic feeds.

### Uploading a CSV file

Most banks let you export a statement as CSV or Excel. QBO accepts CSV with either three columns (date, description, amount) or four columns (date, description, money in, money out).

\`\`\`text
Date,Description,Amount
01/07/2026,IBFT FROM AL NOOR CAFE,60000
02/07/2026,K-ELECTRIC BILL PAYMENT,-18450
03/07/2026,POS PURCHASE METRO,-12300
\`\`\`

Tidy the file first: remove the bank's header rows and opening balance lines, keep one date format, and make sure amounts have no commas or currency symbols. Upload one statement period at a time and never overlap dates, or you will import duplicates.

When the client's money also sits in a JazzCash or Easypaisa account, treat each wallet as its own bank account in QBO and import its statement the same way.

### The review screen

Imported transactions wait in a review list before they touch the books. They are not recorded until you act on each one. For every line, QBO offers choices:

- **Categorise:** choose a payee and an account, such as Rent or Sales, and add it. QBO creates a new expense or deposit.
- **Match:** link the line to a transaction already in QBO, such as an invoice payment or a bill you entered. No new transaction is created.
- **Transfer:** mark it as a movement between two of the client's own accounts, such as bank to wallet.
- **Exclude:** remove a line that should not be recorded, such as a duplicate from an overlapping upload.

### Match before you categorise

This is the most important habit. If an invoice is open for Al Noor Cafe and a PKR 60,000 deposit arrives, QBO will usually suggest the match. Accept it. If you categorise the deposit as Sales instead, you have counted the sale twice, once from the invoice and once from the deposit, and the invoice stays unpaid.

| Feed line | Already in QBO | Right action |
|---|---|---|
| Deposit from customer | Open invoice | Match to the invoice payment |
| Payment to supplier | Bill entered | Match to the bill payment |
| Rent paid | Nothing | Categorise to Rent |
| Transfer to wallet | Nothing | Record as transfer |
| Same line imported twice | Already added | Exclude |

### Splitting a line

One bank payment can cover several things. A card payment at a Metro store might be partly cleaning supplies and partly food for staff. Use the split option to divide the amount across accounts so each cost lands in the right place.

### Bank descriptions are clues, not answers

Descriptions like "IBFT" or "POS PURCHASE" do not say what was bought. Keep a list of questions for the client each week: "PKR 12,300 at Metro on 3 July, what was it?" Guessing fills the books with confident mistakes. When a line cannot be explained yet, post it to a clearly named suspense account and clear it before the month closes.
      `,
        [
          q('A client\'s bank is not available for direct connection in QBO. What is the usual alternative?', [
            'Type every statement line in as a journal entry',
            'Download a statement file and upload it to QBO',
            'Wait until the bank becomes supported next year',
            'Record only the month-end balance in one entry',
          ], 1, 'Uploading CSV or similar statement files brings the same transactions in when no direct feed exists.'),
          q('A deposit arrives for an invoice that is already open in QBO. What should you do?', [
            'Categorise the deposit to the sales income account',
            'Exclude the deposit from the review list entirely',
            'Record the deposit as a transfer between accounts',
            'Match the deposit to the open invoice\'s payment',
          ], 3, 'Matching links the deposit to the invoice; categorising would count the sale twice and leave the invoice open.'),
          q('Why should statement uploads never overlap in dates?', [
            'Overlapping periods import the same transactions twice',
            'QBO rejects any file that contains a weekend date',
            'Overlaps change the company\'s home currency setting',
            'Bank rules stop working after an overlapping upload',
          ], 0, 'Each upload adds its lines to the review list, so overlapping dates create duplicates that must be excluded.'),
        ]
      ),
      lesson('Bank Rules That Save Hours', 13, `
Most small businesses pay the same people for the same things every month: rent, electricity, internet, the same three suppliers, the same salary transfers. Bank rules tell QBO how to handle these repeat lines automatically, so your review time goes to the transactions that genuinely need thought.

### How a rule works

A rule has three parts: which account and direction it applies to, the conditions that must match, and what QBO should do.

\`\`\`text
Rule name:   K-Electric bills
Applies to:  Money out, Meezan Bank current account
Conditions:  Description contains "K-ELECTRIC"
Action:      Payee = K-Electric
             Category = Electricity and gas
             Memo = Monthly electricity
Auto-add:    Off (review before adding)
\`\`\`

When a new line matches, QBO fills in the payee and category for you. With auto-add off, the line still waits for you to press add, which is the safer setting while a rule is new. With auto-add on, QBO records it without review.

### Writing good conditions

Conditions can test the description, the amount, or both. The description is usually the most useful, but bank descriptions vary.

| Condition | Good for | Watch out for |
|---|---|---|
| Description contains "PTCL" | Internet and phone bills | Make sure no other payee name contains the same letters |
| Description contains "SALARY" and amount equals 45000 | A fixed monthly salary | Breaks when the salary changes |
| Amount is between 2000 and 3000 | Rarely useful alone | Catches unrelated transactions of similar size |
| Description contains "AL NOOR" money in | Customer deposits | Customer deposits should normally be matched to invoices, not categorised |

Look at three or four months of the client's statements before writing a rule, so you see how the bank actually prints each payee. Use the shortest text that is unique, such as "K-ELECTRIC" rather than the full line with a reference number that changes every month.

### Splits in rules

Rules can split a transaction by percentage or fixed amount. A shop owner who pays one combined monthly rent for the shop and the flat above it could split the payment between shop rent and owner drawings. Agree the split with the owner in writing and review it if the arrangement changes.

### Rule order

When a line matches more than one rule, QBO applies the first one in the list. Put specific rules above general ones. A rule for "JAZZCASH TRANSFER TO OWNER" must sit above a general rule for "JAZZCASH", or the owner's drawings will be posted as a business expense.

### When not to use a rule

- **Customer receipts against invoices.** These should be matched, so receivables stay correct.
- **Bill payments.** If bills are entered, payments should match them.
- **One-off or unusual payments.** A rule for a single transaction adds clutter and may misfire later.
- **Anything you are unsure about.** A wrong rule repeats the same mistake every month without anyone noticing.

### Reviewing rules regularly

Rules quietly do a lot of work, so check them. Once a quarter, run a report of transactions by category for the accounts your rules post to and scan for lines that do not belong. Delete rules for suppliers the client no longer uses. When you take on a new client who already has rules, review every one before trusting it; rules created by someone else may be the source of errors you are about to inherit.

### Rules and the audit trail

Transactions added by a rule are marked as such in QBO. That lets a reviewer see which entries were automatic, and it helps you trace a misclassification back to the rule that caused it.
      `,
        [
          q('Why is auto-add safer turned off when a rule is new?', [
            'Rules with auto-add on cannot be edited later',
            'Auto-add charges an extra fee for each transaction',
            'Each matched line still waits for your review first',
            'Auto-add only works for money coming into the bank',
          ], 2, 'With auto-add off, the rule suggests the category but you confirm each line, which catches mistakes early.'),
          q('Two rules both match a JazzCash transfer to the owner. Which one applies?', [
            'The rule listed first in the rules order',
            'The rule that was created most recently',
            'The rule with the longest condition text',
            'Both rules split the amount equally',
          ], 0, 'QBO applies the first matching rule, so specific rules belong above general ones.'),
          q('Which transactions should usually not be handled with a categorising rule?', [
            'Monthly internet bills from the same provider',
            'Monthly electricity bills paid by bank transfer',
            'Monthly rent paid to the same landlord',
            'Customer payments against invoices already in QBO',
          ], 3, 'Customer payments should be matched to open invoices so accounts receivable stays correct.'),
        ]
      ),
      lesson('Reconciling Accounts in QuickBooks', 14, `
You learned the logic of bank reconciliation on paper. QBO's reconcile tool does the same job: it proves that the transactions marked as cleared in QBO add up to the balance on the bank's statement. A bank feed does not replace reconciliation. Feeds can drop lines, duplicate them, or be matched wrongly, and only a reconciliation against the real statement catches that.

### Before you start

- Have the bank statement for the full month, as a PDF from the bank, not just the feed.
- Make sure all transactions up to the statement date are reviewed and added.
- Check that last month's reconciliation was completed. Each reconciliation starts from where the last one ended.

### Step by step

1. Open the reconcile tool (from the gear menu or the accounting menu, depending on the version).
2. Choose the account, such as the Meezan Bank current account.
3. Enter the statement ending date and ending balance exactly as printed.
4. QBO shows the beginning balance. It must equal the previous statement's closing balance. If it does not, stop and investigate before ticking anything.
5. Tick each transaction that appears on the statement. Transactions matched from the bank feed are usually ticked already.
6. Watch the **difference** figure. When every statement item is ticked, the difference should be zero.
7. Click **Finish now**, then save or print the reconciliation report.

\`\`\`text
Statement ending balance       310,000
Cleared balance in QBO         310,000
Difference                           0   <- only finish here
\`\`\`

### When the difference is not zero

| Symptom | Likely cause | Fix |
|---|---|---|
| Difference equals one transaction amount | One item not ticked, or ticked wrongly | Compare line by line with the statement |
| Difference is twice an amount | A deposit entered as a payment, or the reverse | Correct the transaction direction |
| Difference divisible by 9 | Digits swapped, such as 18,450 entered as 18,540 | Find and correct the amount |
| Beginning balance wrong | A reconciled transaction was edited or deleted later | Run the reconciliation discrepancy report or history and restore it |
| Lots of small gaps | Bank charges or tax deducted by the bank not recorded | Enter them from the statement |

Never force a reconciliation. QBO lets you finish with a difference by posting an adjustment to a discrepancy account, but that hides the real error. An adjustment is only acceptable for a tiny, explained amount, and the owner or accountant should agree it.

### Uncleared items

After finishing, some transactions may stay unticked because they have not reached the bank yet: a cheque the supplier has not cashed, or a deposit made on the last evening of the month. These are timing differences. They should clear on next month's statement. Any item uncleared for more than two or three months needs investigation; it may be a duplicate, a cancelled cheque, or an error.

### Reconcile everything, not just the main bank

Reconcile every account that has an outside statement:

- Each bank account and each mobile wallet.
- Credit cards, against the card statement.
- Loans, against the lender's statement, usually monthly or quarterly.
- Petty cash, against a physical count.

### Keep the reports

Save each reconciliation report as a PDF in the client's monthly close folder. If someone later edits a reconciled transaction, the saved report proves what the reconciled position was. Also treat a reconciled transaction as finished; if one truly needs correcting, note why, and re-check the reconciliation afterwards.
      `,
        [
          q('The beginning balance in QBO\'s reconcile screen does not match last month\'s statement closing balance. What should you do?', [
            'Tick extra transactions until the difference reaches zero',
            'Finish now and let QBO post a discrepancy adjustment',
            'Stop and find which reconciled transaction was changed',
            'Change the statement ending balance to match QBO',
          ], 2, 'A wrong beginning balance means earlier reconciled work was altered, and that must be fixed before this month is reconciled.'),
          q('QBO offers to finish a reconciliation by posting an adjustment for the remaining difference. When is that acceptable?', [
            'Only for a tiny, explained amount the owner or accountant agrees',
            'Whenever the difference is taking too long to find this month',
            'Whenever the bank feed stayed connected for the whole of the month',
            'Only when last month\'s reconciliation also needed an adjustment',
          ], 0, 'A discrepancy adjustment hides the real error, so it is only acceptable for a tiny difference that has been explained and agreed.'),
          q('Why is reconciliation still needed when a bank feed is connected?', [
            'QBO will not produce reports unless a reconciliation exists',
            'Bank feeds only download deposits and never payments',
            'Reconciliation is what sends the statement to the bank',
            'Feeds can drop, duplicate or wrongly match transactions',
          ], 3, 'Only checking against the real statement proves the books are complete and correct.'),
        ]
      ),
      lesson('Sales Tax Settings and Key Reports', 15, `
Two jobs finish the QBO workflow: making sure tax is recorded in a way the client can file from, and producing reports that people actually read. Both are where clients judge whether you know what you are doing.

### Sales tax in general terms

Many countries charge a tax on sales, called sales tax, VAT or GST depending on the country. In each case a registered business usually collects tax from customers on top of its prices, may be able to claim back tax paid on its own purchases, and pays the net amount to the tax authority by a deadline.

In Pakistan, sales tax on goods is administered federally by FBR, while sales tax on services is administered by provincial bodies such as the Punjab Revenue Authority and the Sindh Revenue Board. Who must register, which rates apply, which goods or services are exempt and how often returns are filed all depend on the business and change through budgets and notifications. Never set up a rate from memory or from an old blog post. Get the current rate and rules from the authority's website or the client's tax adviser, and write down the source and date in your setup notes.

### How tax is set up in QBO

The exact screens depend on the regional edition. Some editions calculate tax automatically for their home country; for a Pakistan business you will usually create tax settings yourself. The general pattern:

| Step | What you set up |
|---|---|
| 1 | Turn on sales tax and choose the filing frequency |
| 2 | Add the tax agency, such as FBR or the relevant provincial authority |
| 3 | Create each tax rate with a clear name and the current percentage you have verified |
| 4 | Set which products and services are taxable by default |
| 5 | Set customers who are exempt, with a reason, if the rules allow it |

Once set up, QBO adds tax on invoices, tracks tax on purchases where the edition supports it, and keeps a liability balance of tax owed. When a return is filed and paid, record the payment through the tax centre rather than as an ordinary expense, so the liability clears properly.

Rate changes happen. When a rate changes, create a new rate effective from the change date or edit it according to your edition's process, and keep old invoices at the rate that applied when they were issued.

Withholding tax deducted from supplier or salary payments is a separate liability. Record it in its own liability account and clear it when it is deposited with the authority.

### The reports clients use

QBO has dozens of reports. A small business owner needs only a handful.

| Report | Answers | Use it |
|---|---|---|
| Profit and Loss | Did we make money? | Monthly, with comparison columns |
| Balance Sheet | What do we own and owe? | Monthly, at month end |
| Statement of Cash Flows | Where did the cash go? | Monthly or quarterly |
| Accounts receivable ageing | Who owes us and how late? | Weekly |
| Accounts payable ageing | Whom do we owe and when? | Weekly |
| Sales by customer or by product | What and who drives revenue? | Monthly |
| Sales tax liability | How much tax do we owe? | Each filing period |
| General ledger and transaction detail | What is inside an account? | When investigating |
| Audit log | Who changed what and when? | When something looks altered |

### Customising and saving reports

Use the customise option to set the date range, accounting method, columns and filters. Useful changes include comparing to the previous period, adding a percentage of income column on the P&L, and splitting by class or location where the plan supports it. Save customised versions so you produce the same report the same way every month, and set up scheduled emails if the owner wants reports in their inbox.

\`\`\`text
Monthly pack for Noor Bakers:
1. P&L, this month vs last month, with % of income
2. Balance sheet at month end vs previous month end
3. AR ageing summary
4. Close notes (written by you, not by QBO)
\`\`\`

### Check reports before sending

Before a report leaves your hands, do three quick checks: the balance sheet balances and bank equals the reconciled figure, no suspense or uncategorised account has a balance, and the P&L has no surprising jumps you cannot explain. A report sent with an obvious error damages trust far more than one sent a day late.
      `,
        [
          q('Where should a bookkeeper get the sales tax rate to set up in QBO?', [
            'The tax authority\'s current guidance or the client\'s tax adviser',
            'The default rate QBO suggests for any edition',
            'A rate remembered from a previous client\'s setup',
            'A popular blog post about tax in Pakistan',
          ], 0, 'Rates and rules change, so they must come from the authority or an adviser, with the source and date recorded.'),
          q('How should a sales tax payment to the authority be recorded in QBO?', [
            'As an ordinary expense in the P&L',
            'Through the tax centre so the liability clears',
            'As a credit memo against the customer',
            'As a transfer to the owner\'s wallet',
          ], 1, 'Recording the payment against the tax liability clears what is owed instead of creating a false expense.'),
          q('Which QBO report helps find who edited a transaction after month end?', [
            'Profit and Loss with comparison columns',
            'Accounts payable ageing summary',
            'The audit log of user changes',
            'Sales by product or service summary',
          ], 2, 'The audit log records each change with the user and time, which shows who altered a transaction.'),
        ]
      ),
      ],
      [
      q('A rent payment appears in the bank feed and nothing for it exists in QBO yet. What is the right action?', [
        'Match it to the nearest open invoice',
        'Exclude it from the review list',
        'Record it as a transfer to savings',
        'Categorise it to the rent expense account',
      ], 3, 'With no existing transaction to match, categorising creates the expense in the correct account.'),
      q('Why should a specific rule for owner transfers sit above a general JazzCash rule?', [
        'QBO deletes rules that sit lower in the list',
        'The first matching rule is the one QBO applies',
        'General rules only run once at the end of each month',
        'Specific rules are ignored unless they sit at the top',
      ], 1, 'Rule order decides which rule wins, so specific cases must come before broad ones.'),
      q('A cheque issued on 30 June is not on the June statement. How is it treated at reconciliation?', [
        'Left unticked as a timing difference that should clear next month',
        'Deleted from QBO because the bank has no record of it',
        'Ticked anyway so the difference reaches zero this month',
        'Posted to the reconciliation discrepancy account now',
      ], 0, 'Uncashed cheques are timing differences that clear when the bank processes them.'),
      q('Which approach to sales tax is correct for a Pakistan client in QBO?', [
        'Use the rate built into whichever edition was bought',
        'Skip tax setup and adjust the totals once a year',
        'Copy the tax rates used by another client\'s file',
        'Verify current rules with the authority, then set rates',
      ], 3, 'Tax rules depend on the business and change over time, so they must be verified before being set up.'),
      ]
    ),
    chapter(
      'Working as a Bookkeeper',
      'Turn your skills into paid work: package bookkeeping into clear services, price them sensibly, find clients in your city and online, onboard and clean up messy books, and protect client data while staying inside the limits of what a bookkeeper should do.',
      [
      lesson('Packaging and Pricing Bookkeeping Services', 14, `
Clients do not buy debits and credits. They buy peace of mind: knowing their numbers, never missing a deadline, and having clean records when the bank, an investor or the tax adviser asks. Package your work around those outcomes and pricing becomes much easier to explain.

### Turn tasks into named services

A list of tasks confuses a shop owner. A small menu of named services does not.

| Service | What it includes | Who it suits |
|---|---|---|
| Monthly bookkeeping | Bank feeds, categorisation, reconciliation, month-end close, report pack with notes | Most small businesses |
| Catch-up or cleanup | Bringing months or years of neglected records up to date | Businesses that fell behind |
| Accounts receivable support | Invoicing, payment matching, weekly ageing, polite reminders | Businesses with many credit customers |
| Payroll records | Payroll entries and payslip records, using rules the client's adviser confirms | Businesses with staff |
| QuickBooks setup | Company file, chart of accounts, opening balances, rules, training | New businesses or those moving from Excel |
| Tax-ready pack | Year-end reports and schedules handed to the tax adviser | Anyone who files through an adviser |

Note the last line: you prepare information for the tax adviser; you do not replace them unless you are qualified and registered to give that advice.

### What drives the effort

Before quoting, find out the factors that decide how long the work takes each month:

- Number of bank accounts, wallets and credit cards.
- Number of transactions per month.
- Number of invoices issued and bills received.
- Whether there is inventory, payroll or more than one currency.
- How organised the client is with receipts and replies.
- How quickly they need reports after month end.

A home bakery with one bank account and 40 transactions a month is a different job from a Karachi distributor with three banks, 600 transactions and stock.

### Pricing models

| Model | How it works | Strengths | Risks |
|---|---|---|---|
| Fixed monthly fee | One price per month for an agreed scope | Predictable for both sides; rewards your efficiency | Scope creep if the limits are vague |
| Tiered packages | Bands by transaction volume or number of accounts | Easy to explain; clients self-select | Need a rule for moving between tiers |
| Hourly rate | Bill time actually spent | Fair for unclear cleanup work | Clients dislike open-ended bills; slower work earns more |
| Project fee | One price for a defined job | Good for setup and catch-up | Underquoting when records are worse than expected |

Most bookkeepers settle on a fixed monthly fee for ongoing work and a project fee for setup or cleanup, quoted after seeing the records.

### Setting your own numbers

Rates vary widely by city, platform, client size and your experience, and they change over time, so do your own research rather than copying a figure. Look at what local firms and freelancers advertise, ask other bookkeepers, and check the rates shown on freelance platforms for similar profiles. Then estimate your hours for the job and check the fee covers them.

\`\`\`text
Quote worksheet
Monthly transactions:        ~150
Accounts to reconcile:       2 banks + 1 wallet
Estimated hours per month:   6
Your target hourly value:    (your research)
Monthly fee:                 hours x target value, rounded to a package
Review after:                3 months of actual time spent
\`\`\`

Track your real time for the first three months. If a client takes twice the hours you expected, raise the fee or narrow the scope at the review.

### Write the scope down

Every arrangement needs a short written agreement, often called an engagement letter: services included, what the client must provide and by when, the fee and payment terms, what costs extra, and how either side can end the arrangement. It prevents the most common dispute in bookkeeping, which is the client assuming that "monthly bookkeeping" includes everything they think of later.
      `,
        [
          q('Which pricing model best suits ongoing monthly work with a clear scope?', [
            'An hourly rate billed with no limits',
            'A fixed monthly fee for the agreed scope',
            'A single project fee charged once a year',
            'A percentage of the client\'s annual sales',
          ], 1, 'A fixed monthly fee is predictable for the client and rewards the bookkeeper for efficient work.'),
          q('What is the main purpose of an engagement letter?', [
            'To register the bookkeeper with the tax authority',
            'To give the bookkeeper access to the bank account',
            'To set out the scope, duties, fee and terms in writing',
            'To replace the need for monthly report notes',
          ], 2, 'A written scope prevents disputes about what is included and what each side must do.'),
          q('Why track your actual hours for a new client\'s first three months?', [
            'To check whether the fee matches the real effort',
            'Because clients must approve every hour in advance',
            'To report the hours to the software provider',
            'Because fixed fees are not allowed without time logs',
          ], 0, 'Real time data shows whether the quote was right, so the fee or scope can be adjusted at review.'),
        ]
      ),
      lesson('Finding Bookkeeping Clients Locally and Online', 13, `
Bookkeeping is a trust business. People hand you their bank statements and their worries. That means your first clients usually come from people who already know you or someone who vouches for you, and online platforms work best once you can show proof of good work.

### Start close to home

Small businesses around you need help and often have no one doing it properly: a family relative's shop, a friend's online clothing store, a clinic, a tuition academy, a pharmacy on your street. Many keep records in a register, a spreadsheet or not at all.

Practical first steps:

1. **List 30 businesses you can reach** through family, friends, your university or your neighbourhood market.
2. **Offer a free health check:** spend an hour reviewing their records and give them three concrete improvements in writing.
3. **Do one small paid job well,** such as a catch-up of three months, and ask for a testimonial.
4. **Ask for referrals.** Traders in a market like Liberty in Lahore or Saddar in Rawalpindi talk to each other. One happy shopkeeper can lead to several more.

### Work with accountants, not against them

Chartered and cost accountants, tax practitioners and audit firms often have more small clients than they can handle month to month. Their work peaks around tax deadlines, and they prefer to receive clean books. Offer to do the monthly bookkeeping for their clients so they can focus on tax and advice. This can give you a steady flow of work without marketing to each business yourself.

| Channel | Why it works | First move |
|---|---|---|
| Family and friends' businesses | Trust already exists | Free health check |
| Local accountants and tax firms | They need reliable monthly help | Offer to take a few small clients |
| Business associations and chambers | Many members in one place | Attend events, offer a short talk |
| LinkedIn | Owners and finance staff are there | Post short lessons from real (anonymised) cases |
| Freelance platforms | Global demand for remote bookkeeping | A focused profile and small first jobs |
| Overseas Pakistanis' businesses | Want a trusted, time-zone-friendly helper | Ask your network abroad |

### Freelance platforms

Upwork, Fiverr and similar sites list bookkeeping work from clients around the world, many using QuickBooks Online or Xero. To stand out:

- **Specialise.** "QuickBooks Online bookkeeping for e-commerce stores" beats "Accounting services".
- **Show proof.** Certifications, a portfolio of sample (fictional) reconciliation reports and close notes, and early reviews.
- **Learn the client's context.** Foreign clients use their own country's tax terms and deadlines. Do the bookkeeping, and leave their tax questions to their local adviser.
- **Start with small jobs** to earn reviews, then raise your rate.

Platform rules, fees and payment withdrawal options change, so read the current terms before you rely on any platform. Make sure you understand how you will receive payments into Pakistan and how that income should be reported for tax; check current FBR guidance or ask a tax practitioner.

### Certifications

Intuit offers a free QuickBooks Online certification through its ProAdvisor program, taken inside a free QuickBooks Online Accountant account, and certified users can list themselves in Intuit's ProAdvisor directory. Program details change, so check the current requirements on Intuit's site. Formal qualifications from accounting bodies take longer but open doors for more senior work.

### A simple outreach message

\`\`\`text
Assalam o Alaikum Sana,
I help small businesses in Lahore keep their books
in QuickBooks: bank reconciliations, monthly reports and
clean records for your tax adviser. I'd be happy to do a
free one-hour review of your records and send you three
suggestions, no obligation. Would next week suit you?
\`\`\`

Short, specific, helpful and with an easy next step. Follow up once politely, then move on.
      `,
        [
          q('Why can local accountants and tax firms be a good source of bookkeeping work?', [
            'They often need help with monthly work so they can focus on tax',
            'They are required by law to outsource all bookkeeping',
            'They pay bookkeepers through the tax authority directly',
            'They only accept clients who already use QuickBooks',
          ], 0, 'Firms busy with tax and advice benefit from someone keeping clients\' monthly books clean.'),
          q('Which freelance profile headline is likely to stand out?', [
            'Accounting services for anyone anywhere',
            'Hard working person, all tasks done fast',
            'Finance, data entry, design and writing',
            'QuickBooks Online bookkeeping for online stores',
          ], 3, 'A specialised headline shows clients exactly what you do and for whom.'),
          q('A US client asks you a detailed question about their tax deduction rules. What is the sensible response?', [
            'Answer from a quick search to keep the client happy',
            'Keep the books clean and refer tax questions to their adviser',
            'Apply Pakistani tax rules since you work from Pakistan',
            'Refuse to work with any client outside Pakistan',
          ], 1, 'Bookkeepers should prepare accurate records and leave foreign tax advice to someone qualified in that country.'),
        ]
      ),
      lesson('Onboarding a Client and Cleaning Up Messy Books', 15, `
The first month with a new client decides the whole relationship. A structured onboarding shows you are organised, and it uncovers problems before they become your problems. Many new clients also arrive with messy books, so cleanup is a core skill.

### The onboarding checklist

| Step | What to collect or do |
|---|---|
| 1 | Signed engagement letter |
| 2 | Business details: legal name, owners, tax registrations, financial year |
| 3 | List of all bank accounts, wallets, cards and loans |
| 4 | Statements for each account from the start date |
| 5 | Last year's financial statements or trial balance, if any |
| 6 | Customer and supplier lists with balances owed |
| 7 | Payroll records and staff list, if any |
| 8 | Access: an accountant invitation to QBO, view-only bank access if the client agrees |
| 9 | A main contact person and how they prefer to communicate |
| 10 | Agreed monthly deadlines for documents and for reports |

Use a shared folder with a clear structure, such as one folder per month with subfolders for bank, sales, purchases and payroll. Ask the client to drop documents there instead of sending them across many WhatsApp chats.

Never ask for or accept the client's online banking password. Use view-only access, statement downloads or bank feeds the client authorises themselves.

### Assessing messy books

Before quoting a cleanup, look at what exists. Common situations:

- No books at all, only bank statements and a box of receipts.
- A spreadsheet with income and expenses but no balance sheet.
- A QuickBooks file someone else started, with unreconciled accounts and a large uncategorised balance.
- Personal and business transactions mixed in one account.

Run a few tests in an existing file: when was each account last reconciled, what sits in uncategorised and suspense accounts, does the bank balance in QBO match the real bank, and do receivables and payables look believable? The answers tell you how deep the cleanup goes.

### A cleanup plan

Work in a fixed order so each step builds on a solid one.

\`\`\`text
1. Agree the cleanup start date (usually start of the financial year)
2. Confirm opening balances from the last reliable accounts
3. Bring in all bank, wallet and card transactions for the period
4. Reconcile each account month by month, oldest first
5. Match receipts and payments to invoices and bills
6. Clear uncategorised and suspense items with the client's answers
7. Fix receivables and payables against customer and supplier records
8. Post adjustments: depreciation, accruals, payroll, stock
9. Review reports, then lock the cleaned periods
\`\`\`

Reconciling oldest first matters. If January is wrong, every later month carries the same error, and fixing March first just means fixing it again.

### Handling unanswered questions

Cleanup always produces questions the client cannot answer, such as a deposit from two years ago with no description. Batch your questions in a spreadsheet with date, amount, description and your best guess, and send them in one go rather than one message at a time. For items that stay unexplained after a reasonable effort, agree a treatment with the client and their accountant, record it, and note it in your handover.

### Fixing the cause, not just the books

A cleanup is wasted if the habits that created the mess continue. Before moving to monthly work, agree a few rules: business money only through business accounts, receipts photographed on the day, invoices raised in QBO rather than by hand, and a monthly document deadline. Then show the owner their first clean report. Seeing their own numbers clearly is often what turns a cleanup job into a long-term client.
      `,
        [
          q('Why reconcile months in order from the oldest first during a cleanup?', [
            'QBO only allows the oldest month to be reconciled',
            'Older months are always the quickest to finish',
            'Errors in early months carry into every later month',
            'Clients only care about the oldest months of data',
          ], 2, 'Each month starts from the last, so fixing earlier months first stops errors repeating.'),
          q('A new client offers you their online banking password to save time. What should you do?', [
            'Decline and use view-only access, statements or authorised feeds',
            'Accept it but promise never to make any payments',
            'Accept it and change the password to one you choose',
            'Decline the whole engagement as too risky to take',
          ], 0, 'Holding a client\'s banking password creates serious risk; safer access methods exist.'),
          q('What is the best way to handle many unanswered cleanup questions?', [
            'Guess each item and never mention the guesses',
            'Send each question in a separate message',
            'Post every unknown item to owner drawings',
            'Batch them in a list with dates, amounts and guesses',
          ], 3, 'A single organised list is easier for the client to answer and gives a record of what was asked.'),
        ]
      ),
      lesson('Confidentiality, Backups and Professional Limits', 13, `
A bookkeeper sees salaries, profits, debts, family transfers and sometimes problems the owner has told nobody else. Handling that responsibly is as much part of the job as reconciling a bank account.

### Confidentiality in practice

- **Share nothing outside the engagement.** Not a client's name, profit or customers, not even as an example, without permission. When you use real cases in a LinkedIn post or a portfolio, change every detail so nobody could identify the business.
- **Talk to the right person.** If an employee or a relative asks about the books, check with the owner that they are authorised.
- **Mind your phone.** Client documents in WhatsApp chats sit on your phone and in its backups. Move them to the client folder and delete them from chats.
- **Put it in writing.** Include a confidentiality clause in the engagement letter, and sign the client's non-disclosure agreement if they have one.

### Securing accounts and devices

| Risk | Protection |
|---|---|
| Stolen or guessed password | Unique long passwords in a password manager |
| Account takeover | Two-step verification on email, QBO and cloud storage |
| Lost laptop or phone | Device passcode, disk encryption, remote wipe |
| Shared computer at home or a cafe | Separate user account, sign out after work |
| Phishing email pretending to be Intuit or a bank | Check the sender, never log in from a link you did not expect |
| Former staff with access | Remove users the day they leave |

Your email account is the master key; anyone who controls it can reset most other passwords. Protect it first.

### Backups

QBO stores data in the cloud, but cloud does not mean backed up against every risk. A user can delete transactions, a bad import can damage a file, or a subscription can lapse. Backup options inside QBO vary by plan, and third-party backup apps exist, so check what your client's plan includes.

At minimum, at each month end:

\`\`\`text
Export and save to the client's month-end folder:
- Trial balance, P&L, balance sheet (PDF and Excel)
- General ledger for the month (Excel)
- Reconciliation reports for every account (PDF)
- Customer and vendor lists with balances (Excel)
\`\`\`

Keep source documents too. Tax and company law in most countries require records to be kept for a number of years. The required period depends on the country and the type of record, and it can change, so confirm the current requirement with FBR or the client's adviser.

### Professional limits

Knowing what you should not do protects you and the client.

| Within a bookkeeper's role | Usually outside it, unless qualified and authorised |
|---|---|
| Recording transactions and reconciling accounts | Signing an audit opinion |
| Preparing management reports and close notes | Giving formal tax advice or planning |
| Preparing schedules for the tax adviser | Representing a client before the tax authority |
| Flagging unusual items to the owner | Giving legal advice on contracts or disputes |
| Explaining what the numbers show | Investment or loan advice |

Statutory audits, where the law requires them, are carried out by licensed auditors, such as members of the Institute of Chartered Accountants of Pakistan. Who may file returns or represent clients before tax authorities is also set by law. If a client asks for something outside your role, say so and recommend a qualified professional.

### When something looks wrong

Sometimes you will notice transactions that look improper: sales kept off the books, fake invoices, or requests to backdate documents. Do not alter records to hide anything, and do not create documents that misstate what happened. Raise your concern with the owner in writing. If you are asked to do something dishonest, decline and consider ending the engagement; your name and future work depend on the integrity of the records you keep. For serious matters, take advice from a qualified professional on your own obligations.

### Keep learning

Software menus, tax rules and platform terms all change. Set a regular time each month to read release notes from QuickBooks, updates from FBR and provincial revenue authorities, and news from accounting bodies. A bookkeeper who keeps up is one clients keep.
      `,
        [
          q('Why should your email account be the first one you protect?', [
            'It is the account QBO uses to store client data',
            'Whoever controls it can reset most of your other passwords',
            'Email accounts cannot use two-step verification',
            'Clients can only reach you through that one account',
          ], 1, 'Password resets go to email, so a compromised inbox can unlock many other accounts.'),
          q('How long must a client\'s records be kept?', [
            'One year, the same in every country',
            'Only until the month\'s books are closed',
            'As current law requires; check with FBR',
            'Forever, under every country\'s tax law',
          ], 2, 'Retention periods vary by country and record type and can change, so they must be confirmed.'),
          q('A client asks you to sign an audit opinion on their accounts. What should you do?', [
            'Sign it if the books are fully reconciled',
            'Sign it after checking the bank statements',
            'Sign it and add a confidentiality clause',
            'Decline and refer them to a licensed auditor',
          ], 3, 'Audit opinions are given by licensed auditors, so a bookkeeper should refer the client to one.'),
        ]
      ),
      ],
      [
      q('A client\'s records turn out far worse than expected after a fixed project fee was agreed. What would have prevented this?', [
        'Quoting an hourly rate with no limits at all',
        'Agreeing the fee before any discussion of scope',
        'Offering the cleanup as a free trial instead',
        'Reviewing the records before quoting the project',
      ], 3, 'Assessing the records first lets the quote reflect the real cleanup effort.'),
      q('Which first step builds trust with a local business that has never used a bookkeeper?', [
        'Offering a free health check with written suggestions',
        'Sending a long price list with every possible service',
        'Asking for a year\'s fee in advance before starting',
        'Requesting their online banking password on day one',
      ], 0, 'A short, useful free review shows your skill at low risk to the owner.'),
      q('Where should a client\'s documents live during the engagement?', [
        'Spread across WhatsApp chats with different staff',
        'In one structured shared folder organised by month',
        'Only on your personal phone\'s photo gallery',
        'In the client\'s email inbox with no folders',
      ], 1, 'A structured folder keeps records complete, findable and easier to secure.'),
      q('A client asks you to backdate an invoice to move income into a different year. What should you do?', [
        'Do it once since the client owns the business',
        'Do it and note the change in the close notes',
        'Decline and raise the concern with the client in writing',
        'Do it but charge an extra fee for the change',
      ], 2, 'Backdating documents misstates what happened, so a bookkeeper should refuse and put the concern in writing.'),
      ]
    ),
  ],
  final: [
    q('A tailoring shop owner wants someone to record daily sales, enter supplier bills and match the bank every week. Which role is the owner describing?', [
      'Statutory auditor',
      'Bookkeeper',
      'Tax lawyer',
      'Investment banker',
    ], 1, 'Routine recording, bill entry and bank matching are core bookkeeping tasks, while audits and legal tax advice belong to other professionals.'),
    q('A Karachi printing firm finishes and invoices a job in March and is paid in May. Which statement compares the two bases correctly?', [
      'Both bases show the income in March, when it was invoiced',
      'Both bases show the income in May, when the money arrived',
      'Accrual shows it in May, cash basis in March',
      'Accrual shows the income in March, cash basis in May',
    ], 3, 'Accrual records income when it is earned, and cash basis records it when the money is received.'),
    q('Which record best supports an expense entry for a generator repair?', [
      'The repairer\'s bill showing the date, work done and amount',
      'A note written from memory at the end of the year',
      'The owner\'s spoken confirmation some months later',
      'A bank line reading "IBFT 25,000" with no other detail',
    ], 0, 'A source document that shows who, what, when and how much lets anyone check the entry later.'),
    q('Which piece of work belongs to the tax layer rather than to bookkeeping?', [
      'Entering this week\'s supplier bills in the accounting books',
      'Matching the bank statement to the records',
      'Preparing and filing the business\'s tax return',
      'Filing receipts in monthly folders by date',
    ], 2, 'Tax work uses the bookkeeping records to prepare returns, while recording, matching and filing are bookkeeping tasks.'),
    q('A business buys stock of PKR 80,000 and pays in cash. What happens to total assets?', [
      'They rise by PKR 80,000 because stock was added',
      'They fall by PKR 80,000 because cash went out',
      'They stay the same, as one asset replaces another',
      'They rise by PKR 160,000 across both sides',
    ], 2, 'Stock goes up and cash goes down by the same amount, so total assets do not change.'),
    q('A shop has assets of PKR 900,000, liabilities of 350,000 and capital introduced of 400,000, with no drawings. What profit has been kept in the business?', [
      'PKR 150,000',
      'PKR 550,000',
      'PKR 500,000',
      'PKR 250,000',
    ], 0, 'Equity is 900,000 minus 350,000, which is 550,000, and taking away the 400,000 of capital leaves 150,000 of retained profit.'),
    q('An owner pays the shop\'s electricity bill from the business account and also takes PKR 30,000 for household use. Which treatment is correct?', [
      'Both reduce profit, since both left the business account',
      'Neither affects equity until the end of the year',
      'Both are recorded as drawings by the owner',
      'Only the electricity reduces profit; the 30,000 is drawings',
    ], 3, 'Electricity is a business expense, while money taken for personal use is drawings and does not reduce profit.'),
    q('Which account normally carries a credit balance?', [
      'Office equipment at cost',
      'Accounts payable',
      'Rent expense',
      'Owner drawings',
    ], 1, 'Liabilities increase with credits, so payables normally show a credit balance, while assets, expenses and drawings are debit balances.'),
    q('A new client\'s chart of accounts has one account called "Expenses" for everything. What is the main problem?', [
      'The trial balance debit and credit totals will stop agreeing at all',
      'The owner cannot see where money goes, such as rent versus fuel',
      'The software will refuse to post any more entries to it',
      'Bank reconciliation becomes impossible for every account',
    ], 1, 'A single expense account still balances, but it hides what the money was spent on, which is the information the owner needs.'),
    q('Which error would make the trial balance totals disagree?', [
      'A supplier bill entered twice, in full, on both sides',
      'A rent payment posted to the wrong expense account',
      'A cash sale left out of the books altogether',
      'A PKR 12,000 sale debited to receivables but credited as 1,200',
    ], 3, 'Only the one-sided amount error makes debits differ from credits; the others keep both sides equal.'),
    q('How do the general journal and the general ledger relate to each other?', [
      'The journal lists entries by date; the ledger groups them by account',
      'The journal holds cash items only; the ledger holds all the credit items',
      'The ledger is written first and the journal summarises it later',
      'They hold different transactions and are never compared',
    ], 0, 'Each journal entry is posted to the ledger accounts it affects, which turns a date-order record into account balances.'),
    q('Why keep a separate record for each customer alongside the receivables control account?', [
      'Because a control account can only hold one balance under the tax law',
      'So that receivables are kept out of the trial balance',
      'To see who owes what, while the control account gives the total',
      'To record the cash sales that never involved any credit',
    ], 2, 'The subsidiary ledger shows each customer\'s balance, and its total should agree with the control account.'),
    q('A customer is invoiced PKR 100,000 plus an illustrative sales tax of 10,000. Which entry is correct?', [
      'Dr Receivables 110,000; Cr Sales 110,000 with no tax line at all',
      'Dr Receivables 100,000; Cr Sales 100,000; Dr Tax expense 10,000',
      'Dr Receivables 110,000; Cr Sales 100,000; Cr Tax payable 10,000',
      'Dr Sales 110,000; Cr Receivables 100,000; Cr Tax payable 10,000',
    ], 2, 'The customer owes the full 110,000, the business earns 100,000, and the tax is a liability held for the authority.'),
    q('A customer returns faulty goods worth PKR 8,000 from an invoice raised last month. What does the credit note do?', [
      'Reduces both sales and accounts receivable by PKR 8,000',
      'Raises sales and reduces receivables by PKR 8,000',
      'Reduces only the bank balance by PKR 8,000',
      'Deletes the original invoice so it can be reissued',
    ], 0, 'A credit note reverses part of the sale, so income falls and the customer owes 8,000 less, with the original invoice left intact.'),
    q('One customer owes PKR 40,000, all of it more than 90 days overdue, yet keeps ordering on credit. What is the sensible action?', [
      'Write the whole balance off now without contacting them first',
      'Raise their credit limit to keep the customer happy',
      'Leave it until the year-end accounts are prepared',
      'Pause further credit and follow the collection routine',
    ], 3, 'Old debts grow harder to collect, so further credit should stop while the business chases the balance.'),
    q('An invoice is for PKR 60,000 and the customer pays 25,000. How should receivables show this invoice afterwards?', [
      'The invoice is closed and a new one raised for 35,000',
      'PKR 35,000 stays open against the same invoice',
      'Nothing changes until the full amount arrives',
      'The 25,000 is booked as income with no link to the invoice',
    ], 1, 'Applying the part payment to the invoice leaves the unpaid 35,000 visible on the customer\'s account.'),
    q('Before entering a supplier bill, which check matters most?', [
      'That the bill is printed on the supplier\'s letterhead',
      'That quantities and prices agree with the order and goods received',
      'That the supplier\'s office is based in the same city',
      'That the bill total is a round number with no paisa',
    ], 1, 'Comparing the bill with the order and receipt of goods stops the business paying for things it did not order or get.'),
    q('A bill of PKR 50,000 is entered in May and the business pays 20,000 of it in June. What does the business still owe on this bill?', [
      'PKR 50,000',
      'PKR 20,000',
      'PKR 70,000',
      'PKR 30,000',
    ], 3, 'The payment reduces accounts payable by 20,000, leaving 30,000 open on the bill.'),
    q('A petty cash float of PKR 10,000 has vouchers for 6,500 and the right cash left in the box. How much is the top-up?', [
      'PKR 6,500',
      'PKR 10,000',
      'PKR 3,500',
      'PKR 16,500',
    ], 0, 'Under the imprest system the top-up equals the vouchers spent, which brings the float back to 10,000.'),
    q('Your payables ledger shows PKR 120,000 owed to a supplier after a 45,000 payment on the last day of the month, but their statement shows 165,000. What is the likely reason?', [
      'The business must pay the extra 45,000 to the supplier straight away',
      'The payables ledger should be raised to 165,000 so that it matches the statement',
      'The supplier had not yet recorded the payment when the statement was made',
      'The supplier has charged the business sales tax twice on the same bill',
    ], 2, 'The difference equals the late payment, so it is a timing difference that should clear on next month\'s statement.'),
    q('The bank statement shows PKR 200,000. A cheque of 30,000 is still outstanding and a deposit of 15,000 is in transit. What is the adjusted bank balance?', [
      'PKR 215,000',
      'PKR 245,000',
      'PKR 185,000',
      'PKR 155,000',
    ], 2, 'Start with 200,000, subtract the 30,000 cheque not yet cleared and add the 15,000 deposit not yet shown, giving 185,000.'),
    q('Which item found during a bank reconciliation needs a new entry in the books?', [
      'Bank profit the bank credited that was not yet recorded',
      'A deposit made on the last day that the bank shows next month',
      'A cheque issued that the supplier has not yet presented',
      'A cheque from last month that cleared this month as expected',
    ], 0, 'Items the bank knows about but the books do not need recording, while timing differences clear on their own.'),
    q('A supplier says a cheque issued eight months ago will never be presented. What should the bookkeeper do?', [
      'Leave it outstanding on every future reconciliation, for good',
      'Record the amount as other income for the month',
      'Delete the original payment from the earlier period\'s books entirely',
      'Reverse the payment so bank goes back up and the bill reopens',
    ], 3, 'Cancelling a stale cheque with a reversal returns the money to the bank account and shows the bill as unpaid again.'),
    q('A sole trader moves PKR 50,000 from the business account to a personal account for home use. What is the entry?', [
      'Debit Salaries Expense, credit Bank account',
      'Debit Owner\'s Drawings, credit Bank',
      'Debit Bank, credit Owner\'s Capital',
      'Debit Loan Payable, credit Bank',
    ], 1, 'Money a sole owner takes for personal use is drawings, not a salary expense, and it reduces the bank balance.'),
    q('Gross pay is PKR 80,000, employee deductions are 8,000 and the employer adds a contribution of 4,000. These are illustrative figures. What does the month cost the business?', [
      'PKR 72,000',
      'PKR 84,000',
      'PKR 80,000',
      'PKR 92,000',
    ], 1, 'Employee deductions come out of gross pay, so the cost is gross pay plus the employer\'s own contribution.'),
    q('When payroll is recorded, which account takes the debit for gross pay?', [
      'Salaries Payable',
      'Bank: Current',
      'Income Tax Withheld Payable',
      'Salaries Expense',
    ], 3, 'Gross pay is the cost of employing staff, so it is debited to the expense, while payables and withheld tax are credited.'),
    q('Why should payroll files sit in a folder with restricted access?', [
      'Salaries and personal details are confidential',
      'Payroll files are usually too large for shared folders',
      'The tax authority forbids printing payslips',
      'Restricted files open faster in the software',
    ], 0, 'Pay and personal data are private, so only people who need them should be able to see them.'),
    q('An employee repays a PKR 20,000 advance through a 5,000 deduction each month. What happens to the staff advances asset each payroll?', [
      'It rises by PKR 5,000 each month',
      'It stays at 20,000 until fully repaid',
      'It falls by PKR 5,000 as the deduction is made',
      'It is moved to the salaries expense',
    ], 2, 'Each deduction recovers part of the amount owed by the employee, so the asset reduces by 5,000.'),
    q('A consultant finishes PKR 70,000 of work in June but invoices it on 5 July. Under accrual, what entry is made on 30 June?', [
      'Debit Bank, credit Consulting Income',
      'Debit Consulting Income, credit Accrued Income instead',
      'Debit Accrued Income, credit Consulting Income',
      'No entry until the invoice is raised in July',
    ], 2, 'The income was earned in June, so it is recognised then with an asset for the amount not yet invoiced.'),
    q('A gym collects a 12-month membership of PKR 24,000 in January. How much income belongs to March?', [
      'PKR 2,000',
      'PKR 24,000',
      'PKR 6,000',
      'PKR 4,000',
    ], 0, 'The fee is deferred income released evenly over twelve months, so each month earns 2,000.'),
    q('An asset costs PKR 500,000 and is depreciated at 20% a year on the reducing balance. What is the charge in year two?', [
      'PKR 100,000',
      'PKR 120,000',
      'PKR 60,000',
      'PKR 80,000',
    ], 3, 'Year one is 100,000, leaving 400,000, and 20% of 400,000 is 80,000.'),
    q('Closing inventory is understated by PKR 25,000. What is the effect on cost of goods sold?', [
      'COGS is understated by PKR 25,000',
      'COGS is overstated by PKR 25,000',
      'COGS is not affected at all',
      'COGS is overstated by PKR 50,000',
    ], 1, 'Closing stock is subtracted in the COGS formula, so a lower closing figure makes COGS higher by the same amount.'),
    q('A fully depreciated laptop is scrapped. What happens in the books?', [
      'Only the cost is removed and the accumulated depreciation stays',
      'Its cost and accumulated depreciation are both removed',
      'A new depreciation charge is booked for the year',
      'Nothing, because its book value is already zero',
    ], 1, 'Disposal clears both the cost and the depreciation built up against it, so the register matches the assets still held.'),
    q('Which item is a current liability on the balance sheet?', [
      'A bank loan due for repayment in four years',
      'A delivery van owned by the business',
      'Owner\'s capital introduced at the start',
      'Sales tax payable due next month',
    ], 3, 'Current liabilities are amounts due within the next year, such as tax owed next month.'),
    q('A business receives a bank loan of PKR 500,000. Where does it appear in the cash flow statement?', [
      'Financing activities',
      'Operating activities',
      'Investing activities',
      'It does not appear there',
    ], 0, 'Borrowing and repaying loans are financing cash flows, separate from trading and from buying assets.'),
    q('Revenue is PKR 1,000,000, cost of goods sold is 600,000 and operating expenses are 250,000. What is net profit before tax?', [
      'PKR 400,000',
      'PKR 350,000',
      'PKR 150,000',
      'PKR 750,000',
    ], 2, 'Gross profit is 400,000, and taking away 250,000 of operating expenses leaves 150,000.'),
    q('Revenue has doubled from last month although the client has no new customers. What should you do before sending the reports?', [
      'Send them, since higher revenue is good news',
      'Cut expenses so the margin looks normal again',
      'Check for duplicated or misposted income first',
      'Delete the largest sales so the trend looks steady',
    ], 2, 'Analytical review looks for changes that cannot be explained, and a sudden jump often points to a duplicate or wrong posting.'),
    q('Accounts payable rose by PKR 30,000 during the month. Using the indirect method, how does operating cash compare with profit?', [
      'Operating cash is PKR 30,000 higher than profit',
      'Operating cash is PKR 30,000 lower than profit',
      'Operating cash equals profit, as payables are not cash',
      'Operating cash is PKR 60,000 higher than profit',
    ], 0, 'Costs that are still unpaid reduced profit without using cash, so the rise in payables is added back.'),
    q('An owner wants a shop assistant to enter sales receipts in QBO and nothing else. What is the best approach?', [
      'Share the owner\'s login and ask them to be careful',
      'Give them full admin access to save time later',
      'Have them email each sale to the owner to enter',
      'Invite them as a user with limited access rights',
    ], 3, 'Each person should have their own login with the lowest access they need, which also keeps the audit log meaningful.'),
    q('A Karachi salon already has makeup, hair and mehndi set up as separate service items and wants to add all three to a sale as one bridal package. Which QBO item type fits?', [
      'Inventory',
      'Bundle',
      'Non-inventory',
      'Service',
    ], 1, 'A bundle groups several items so they can be added to a sale together.'),
    q('A client\'s books start in QBO on 1 July and the business already has money in the bank. What should be entered for the bank account?', [
      'Every bank transaction since the business opened',
      'The balance at the start date, checked against the statement',
      'Nothing, because the bank feed sets balances by itself',
      'An estimated figure the owner remembers from last year',
    ], 1, 'An opening balance that matches the statement on the start date gives later reconciliations a correct starting point.'),
    q('Why attach a photo of the receipt to an expense entered in QBO?', [
      'QBO cannot save an expense unless one is attached',
      'It sets the correct sales tax rate automatically',
      'It sends a copy of the receipt to the tax authority each month',
      'The evidence stays with the transaction for later review',
    ], 3, 'Keeping the source document with the entry lets the owner, accountant or reviewer check it without searching folders.'),
    q('One bank feed line of PKR 15,000 covers 12,000 of rent and a 3,000 water bill. How should you handle it?', [
      'Split the line between rent and utilities',
      'Code the whole amount to the rent account',
      'Exclude the line from the books entirely',
      'Leave it in suspense for the rest of the year',
    ], 0, 'Splitting lets one bank line be coded to more than one account so each cost lands in the right place.'),
    q('A new bank rule sends any description containing "TRF" to Rent. What is the risk?', [
      'The rule will never match any transaction',
      'QBO will refuse to save a rule with such short text',
      'Many unrelated transfers will be coded as rent',
      'Rent payments will be removed from the feed',
    ], 2, 'Short, common text matches many payees, so a rule needs a condition that only the intended transactions share.'),
    q('The QBO reconciliation shows a zero difference, but one ticked item is not on the bank statement. What does this mean?', [
      'Nothing, since a zero difference proves accuracy',
      'The bank has made an error that must be reported to it in writing',
      'Something is still wrong even though the figures balance',
      'QBO will remove the ticked item automatically',
    ], 2, 'Only items on the statement should be ticked, so a wrong tick means another error is hiding the difference.'),
    q('An owner wants to see which customers owe money and how long each amount has been unpaid. Which QBO report fits?', [
      'Accounts receivable ageing summary',
      'Profit and loss by month with a percentage',
      'Audit log of user changes',
      'Balance sheet comparison',
    ], 0, 'The receivables ageing report lists each customer\'s balance by how long it has been outstanding.'),
    q('You are asked to clean up a backlog without being able to see the records first. Which pricing model is fairest for now?', [
      'A fixed monthly fee agreed today',
      'A project fee guessed from the business size',
      'Tiered packages based on the owner\'s estimate',
      'An hourly rate until the scope is clear',
    ], 3, 'Hourly billing suits cleanup work with an unclear size, and a project fee should only be quoted after seeing the records.'),
    q('Before starting a cleanup project, what should be agreed in writing?', [
      'Only the start date, since the other details can be sorted out later',
      'The months covered, the fee and what the client must supply',
      'The client\'s online banking password and PIN code',
      'A promise that the client\'s tax bill will go down',
    ], 1, 'A written scope protects both sides from surprises about what is included and what the client needs to provide.'),
    q('Which practice best protects client files kept on your laptop?', [
      'One easy password shared across all your accounts',
      'Strong unique passwords, two-step login and regular backups',
      'Keeping files only on the desktop with no copies',
      'Emailing every client file to a personal email address daily',
    ], 1, 'Unique passwords and two-step login keep others out, and backups mean a lost or broken laptop does not lose the work.'),
    q('You notice repeated cash withdrawals with no receipts coded to "Supplies". What should you do?', [
      'Quietly recode them all to drawings without asking anyone',
      'Post about the client\'s books on social media',
      'Ignore it, since the coding is the client\'s problem',
      'Raise it with the client in writing and ask for support',
    ], 3, 'Unsupported withdrawals need evidence, and concerns should be raised with the owner in writing rather than hidden or guessed at.'),
  ],
});
