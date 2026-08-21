import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: "excel-business-analytics",
  title: "Excel & Business Analytics",
  category: "Data",
  level: "Beginner",
  duration: "6 weeks",
  accent: "amber",
  coverKey: "excel-business-analytics",
  summary:
    "Turn a spreadsheet from a place you store numbers into a tool that answers business questions reliably.",
  description:
    "You learn the formulas, lookups, and PivotTables that do real analytical work, and the error patterns that cause expensive mistakes. Every example uses one running sales dataset so the skills compound.",
  chapters: [
    chapter(
      "Foundations That Prevent Errors",
      "Cell references, data types, and the structural habits that stop spreadsheets breaking.",
      [
        lesson("Relative, Absolute, and Why $ Matters", 12, `
Nearly every "my formula broke when I copied it" problem comes from one concept: **how a reference changes when it moves**.

### The three reference types

Say \`D2\` contains \`=B2*C2\`. Copy it down to \`D3\` and it becomes \`=B3*C3\`. The reference moved with the formula. That is a **relative** reference, and it is usually what you want.

Now suppose the tax rate lives in \`G1\` and you write \`=B2*$G$1\`:

| Written | Copied down | Copied right | Called |
|---|---|---|---|
| \`G1\` | \`G2\` | \`H1\` | Relative |
| \`$G$1\` | \`$G$1\` | \`$G$1\` | Absolute |
| \`G$1\` | \`G$1\` | \`H$1\` | Row locked |
| \`$G1\` | \`$G2\` | \`$G1\` | Column locked |

**The \`$\` locks whatever follows it.** \`$G$1\` locks both, so the reference never moves.

Press **F4** (Cmd+T on Mac) while editing a reference to cycle through the four forms.

### The classic failure

You build a commission column:

\`\`\`
D2:  =C2*G1        ← should be *$G$1
\`\`\`

Copy down and row 3 reads \`=C3*G2\`. \`G2\` is empty, so every commission below the first row becomes **zero**. The spreadsheet shows no error — just wrong numbers. This is the single most common source of quietly incorrect spreadsheets in business, precisely because nothing looks broken.

### The mixed-reference trick

Build a multiplication-style grid — units across the top, prices down the side:

\`\`\`
=$A2*B$1
\`\`\`

\`$A2\` keeps the price column fixed while the row moves; \`B$1\` keeps the header row fixed while the column moves. One formula fills the entire grid correctly.

### Name things instead

\`\`\`
=C2*TaxRate
\`\`\`

Select \`G1\`, type \`TaxRate\` in the Name Box, press Enter. Named ranges are absolute automatically, and \`=C2*TaxRate\` tells the next person what the formula means. \`=C2*$G$1\` does not.

### Habits that prevent trouble

- **One fact per cell.** "Ali Raza — Lahore" in one cell cannot be sorted by city.
- **No blank rows inside a data block.** They break sorting, filtering, and PivotTable ranges.
- **Headers in row 1, data below, nothing else on the sheet.** Put summaries on a separate sheet.
- **Never type a number that could be calculated.** A hardcoded total will be wrong the moment data changes.
        `),
        lesson("Data Types, Dates, and Dirty Data", 12, `
Excel stores four kinds of value: numbers, text, booleans, and error values. Dates are not a separate type — they are numbers wearing a date format. Confusing them causes calculations that silently do nothing.

### Numbers stored as text

The most common import problem. A column looks numeric but \`SUM\` returns 0.

Tells:
- Values are **left-aligned** (real numbers align right)
- A small green triangle in the corner
- \`=ISNUMBER(A2)\` returns FALSE

Fixes:

\`\`\`
=VALUE(A2)                              Convert text to number
=VALUE(SUBSTITUTE(A2,",",""))           Strip thousands separators first
\`\`\`

Or select the column, Data → Text to Columns → Finish. That forces re-evaluation of the whole column at once.

### Dates are numbers

\`01/03/2026\` (1 March 2026) is stored as the serial number 46082 — serial 1 is 1 January 1900 and each later day counts up by one. This is why:

- Subtracting dates gives days: \`=B2-A2\` → \`45\`
- \`=A2+30\` gives the date 30 days later
- A date formatted as General shows a five-digit number

\`\`\`
=TODAY()                    Current date, updates daily
=YEAR(A2)  =MONTH(A2)       Extract parts
=EOMONTH(A2,0)              Last day of that month
=NETWORKDAYS(A2,B2)         Working days, excluding weekends
\`\`\`

**The regional trap:** \`03/04/2026\` is 3 April in most of the world and 4 March in the US. Importing a CSV under the wrong locale silently produces valid but wrong dates — and only rows where the day exceeds 12 are unambiguous, so the roughly two rows in five that land on the 1st to the 12th are undetectable by eye. Use ISO \`YYYY-MM-DD\` in any file that crosses systems.

### Cleaning text

\`\`\`
=TRIM(A2)                          Remove leading/trailing/double spaces
=CLEAN(A2)                         Strip non-printing characters
=PROPER(A2)  =UPPER(A2)            Fix casing
=SUBSTITUTE(A2,"Ltd.","Ltd")       Standardise variants
=TEXTSPLIT(A2," ")                 Split into columns
\`\`\`

\`TRIM\` matters more than it looks: \`"Lahore "\` and \`"Lahore"\` are different values to every lookup and PivotTable in Excel, so an untrimmed column produces duplicate categories that quietly split your totals.

### Finding duplicates

\`\`\`
=COUNTIF($A$2:$A$500,A2)>1
\`\`\`

Use it as a helper column or a conditional-formatting rule. Note that Remove Duplicates is **destructive and immediate** — always flag first, inspect, then delete.

### Handling errors deliberately

\`\`\`
=IFERROR(VLOOKUP(...), "Not found")
\`\`\`

Wrap lookups so one missing value does not turn a whole summary column into \`#N/A\`. But do not wrap blindly — \`IFERROR\` hides genuine problems too. If 200 of 500 rows return "Not found", you want to know that, not to see a tidy report.
        `),
        lesson("Building a Sheet That Others Can Use", 11, `
A spreadsheet only you can operate is a liability. These structural choices decide whether it survives being handed over.

### Separate the three layers

| Sheet | Contains |
|---|---|
| \`Data\` | Raw records only. Never edited by hand |
| \`Calc\` | Working columns, lookups, helpers |
| \`Report\` | What people read — summaries and charts |

Mixing them is how you get a file where nobody can tell which numbers are typed and which are calculated.

### Use real Tables

Select your data and press **Ctrl+T**. A Table gives you:

- **Automatic expansion.** Add a row and formulas, PivotTables, and charts include it. A range like \`A2:D500\` silently ignores row 501.
- **Readable formulas.** \`=SUM(Sales[Amount])\` instead of \`=SUM(D2:D500)\`.
- **Filter buttons and banded rows** for free.

The auto-expansion alone prevents a whole class of bug where a report quietly stops including new data.

### Make inputs obvious

Put every assumption — tax rate, target, exchange rate — in one clearly labelled block at the top of a \`Settings\` sheet, shaded a distinct colour. Values buried inside formulas are invisible and get missed when they change.

### Restrict what can be typed

Data → Data Validation:

- **List** for categories, so "Lahore", "lahore", and "Lhr" cannot all appear
- **Decimal, between 0 and 1** for rates
- **Date, after 2020-01-01** to catch typos like \`2206\`

Validation is prevention. Cleaning is repair. Prevention is far cheaper.

### Protect the structure

Unlock only the input cells (Format Cells → Protection → uncheck Locked), then Review → Protect Sheet. Now users can enter data but cannot overwrite a formula — the most common way a working spreadsheet gets broken.

### Document it

A \`Notes\` sheet with three lines — what this file does, where the data comes from, who owns it — saves hours when it resurfaces in eight months.

### When to stop using Excel

Excel is the wrong tool when:

- Several people need to edit at once
- You are past roughly 100,000 rows and it has become slow
- The same manual clean-up happens every week
- You need an audit trail of who changed what

At that point the answer is a database (see the SQL course) with Excel connected to it for reporting. Pushing past these limits is how organisations end up with a critical spreadsheet nobody dares touch.
        `),
      ],
      [
        q("You copy =C2*G1 down a column and every result below row 2 is zero. Why?", [
          "G1 is text",
          "The relative reference moved to G2, G3… which are empty",
          "Excel needs IFERROR",
          "The column is formatted as text",
        ], 1, "Without $ the reference shifts with the formula, pointing at empty cells — and no error appears, just wrong numbers."),
        q("SUM over a numeric-looking column returns 0. Most likely cause?", [
          "The cells contain text, not numbers",
          "SUM cannot handle decimals",
          "The range is wrong",
          "Values are negative",
        ], 0, "Imported numbers stored as text are ignored by SUM; they show left-aligned and ISNUMBER returns FALSE."),
        q("Why prefer ISO YYYY-MM-DD in files shared between systems?", [
          "It sorts faster",
          "03/04 is ambiguous between locales and imports silently wrong",
          "Excel requires it",
          "It uses less memory",
        ], 1, "Day/month order varies by region, and only dates past the 12th are unambiguous — so every date from the 1st to the 12th, roughly two rows in five, is silently wrong with nothing to show it."),
        q("What is the main advantage of Ctrl+T Tables over plain ranges?", [
          "Coloured rows",
          "They expand automatically, so new rows are included everywhere",
          "They are faster",
          "They allow merged cells",
        ], 1, "A fixed range like A2:D500 silently excludes later rows; a Table grows with the data."),
      ]
    ),
    chapter(
      "Formulas That Do Real Work",
      "Conditional logic and aggregation — the everyday analytical workhorses.",
      [
        lesson("IF, Nested Logic, and IFS", 12, `
\`IF\` is the foundation of every decision a spreadsheet makes.

\`\`\`
=IF(test, value_if_true, value_if_false)
=IF(C2>1000, "Large", "Standard")
\`\`\`

### Comparison and combination

\`\`\`
=IF(AND(C2>1000, D2="Lahore"), "Priority", "Normal")
=IF(OR(D2="Lahore", D2="Karachi"), "Core market", "Other")
=IF(NOT(E2="Cancelled"), "Active", "Closed")
\`\`\`

\`AND\` requires every condition; \`OR\` requires at least one.

### Grading with nested IF

\`\`\`
=IF(C2>=5000,"Platinum", IF(C2>=2000,"Gold", IF(C2>=500,"Silver","Bronze")))
\`\`\`

**Order matters and must run one direction.** Reverse it — testing \`>=500\` first — and every value above 500 stops at "Silver", because the first true test wins. A customer spending 9,000 is graded Silver, and nothing flags it.

### IFS is clearer

\`\`\`
=IFS(C2>=5000,"Platinum", C2>=2000,"Gold", C2>=500,"Silver", TRUE,"Bronze")
\`\`\`

Same logic, flat. The final \`TRUE\` is the catch-all — omit it and unmatched values return \`#N/A\`.

### Prefer a lookup table over long logic

For more than about four branches, put the thresholds in cells:

| Min | Tier |
|---|---|
| 0 | Bronze |
| 500 | Silver |
| 2000 | Gold |
| 5000 | Platinum |

\`\`\`
=XLOOKUP(C2, Tiers[Min], Tiers[Tier], , -1)
\`\`\`

The \`-1\` means "next smaller item". Now changing a threshold is editing a cell, not rewriting a formula in 500 rows. Business rules buried in nested formulas are the reason spreadsheets become unmaintainable.

### The blank-cell trap

\`\`\`
=IF(C2>1000,"Large","Standard")
\`\`\`

An empty \`C2\` is treated as 0, so it silently reports "Standard" — indistinguishable from a genuine small order. Guard explicitly:

\`\`\`
=IF(C2="", "Missing", IF(C2>1000,"Large","Standard"))
\`\`\`

Missing data should look different from real data. Conflating the two produces reports that understate problems.
        `),
        lesson("SUMIFS, COUNTIFS, and Aggregation", 13, `
This family answers the everyday business question: *how much, for which subset?*

### The pattern

\`\`\`
=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)
\`\`\`

The **sum range comes first**, then pairs of range-and-condition. (Older \`SUMIF\` puts it last — a genuine inconsistency worth remembering.) Always prefer the \`...IFS\` versions; they take multiple conditions and have consistent argument order.

\`\`\`
=SUMIFS(Sales[Amount], Sales[City],"Lahore")
=SUMIFS(Sales[Amount], Sales[City],"Lahore", Sales[Rep],"Ali")
=COUNTIFS(Sales[City],"Lahore", Sales[Amount],">1000")
=AVERAGEIFS(Sales[Amount], Sales[City],"Lahore")
\`\`\`

### Criteria that are not just equals

\`\`\`
">1000"                          Greater than
">="&G1                          Compare to a cell — note the & concatenation
"<>Cancelled"                    Not equal to
"Lah*"                           Wildcard: starts with "Lah"
">="&DATE(2026,1,1)              On or after a date
\`\`\`

The \`&\` is essential when comparing to a cell. \`">=G1"\` is the literal text "≥G1"; \`">="&G1\` builds the actual condition. This catches everyone at least once.

### Building a summary grid

With cities down column A and months across row 1:

\`\`\`
=SUMIFS(Sales[Amount], Sales[City], $A2, Sales[Month], B$1)
\`\`\`

Mixed references from Lesson 1 let one formula fill the whole block.

### Counting distinct values

There is no \`COUNTUNIQUE\`. In modern Excel:

\`\`\`
=COUNTA(UNIQUE(Sales[Customer]))
\`\`\`

Older versions need:

\`\`\`
=SUMPRODUCT(1/COUNTIF(range, range))
\`\`\`

which fails on blanks — a good reason to use \`UNIQUE\` where available.

### SUBTOTAL respects filters

\`\`\`
=SUM(D2:D500)          Always totals everything
=SUBTOTAL(109, D2:D500) Totals only VISIBLE rows
\`\`\`

If you filter to Lahore and your total does not change, you used \`SUM\`. Function code \`109\` is sum-ignoring-hidden; \`101\` is average, \`102\` is count of numbers and \`103\` is count of non-empty cells. This is the difference between a report that responds to filters and one that quietly contradicts what is on screen.

### Watch for double counting

\`SUMIFS\` with overlapping criteria across several formulas can count the same rows twice. Always sanity-check that your category subtotals add to the grand total. A summary whose parts do not sum to the whole is the clearest signal that something is wrong — and it is easy to miss when each number looks plausible on its own.
        `),
        lesson("Text, Dates, and Useful Odds and Ends", 11, `
A handful of functions handle most remaining day-to-day work.

### Joining and splitting

\`\`\`
=A2&" "&B2                        Concatenate
=TEXTJOIN(", ", TRUE, A2:A5)      Join a range, TRUE skips blanks
=LEFT(A2,3)   =RIGHT(A2,4)        Fixed-position extraction
=MID(A2,4,2)                      From position 4, take 2
=LEN(A2)                          Length
=FIND("-",A2)                     Position (case-sensitive; SEARCH is not)
\`\`\`

Extract a code before a dash, whatever its length:

\`\`\`
=LEFT(A2, FIND("-",A2)-1)
\`\`\`

Wrap in \`IFERROR\` — \`FIND\` returns \`#VALUE!\` when the character is absent, and one malformed row otherwise breaks the column.

### Formatting numbers into text

\`\`\`
=TEXT(A2,"#,##0.00")        1234.5  → "1,234.50"
=TEXT(A2,"yyyy-mm-dd")      Date    → "2026-08-19"
=TEXT(A2,"0.0%")            0.153   → "15.3%"
\`\`\`

Useful for building labels. Remember the result is **text** and will no longer sum.

### Rounding, properly

\`\`\`
=ROUND(A2,2)        Standard, to 2 decimals
=ROUNDUP(A2,0)      Always away from zero
=CEILING(A2,50)     Up to the next multiple of 50
\`\`\`

Formatting a cell to two decimals **only changes the display** — the stored value keeps its full precision. Displayed values that appear to sum incorrectly usually mean you formatted where you should have rounded. For money, round explicitly at the point the value becomes a real amount.

### Date arithmetic in practice

\`\`\`
=EOMONTH(TODAY(),0)                     End of this month
=EOMONTH(TODAY(),-1)+1                  Start of this month
=NETWORKDAYS(A2,B2)                     Working days between
=DATEDIF(A2,TODAY(),"Y")                Whole years — useful for age/tenure
\`\`\`

### Conditional formatting that earns its place

Use a formula rule, not the presets, when you want the whole row highlighted:

\`\`\`
=$E2="Overdue"
\`\`\`

Note \`$E2\`: the column is locked so every cell in the row evaluates the same condition; the row is relative so it moves down.

Keep it to two or three rules. A sheet where everything is coloured communicates nothing — the point of highlighting is that most things are *not* highlighted.
        `),
      ],
      [
        q("Nested IF grading returns Silver for a value of 9000. Why?", [
          "IF has a nesting limit",
          "The tests run smallest-first, so the first true test wins before reaching higher tiers",
          "IFS is required",
          "9000 exceeds the maximum",
        ], 1, "Order determines the result — testing >=500 before >=5000 catches every large value at the lowest tier."),
        q("Which correctly compares to a threshold stored in G1?", [
          "\">=G1\"",
          "\">=\"&G1",
          "\"=>\"&G1",
          "\">=\" G1",
        ], 1, "The & concatenates the operator with the cell's value; the quoted version is the literal text \">=G1\"."),
        q("You filter a list to one city, but the total under the column does not change. Which function produced it?", [
          "SUBTOTAL(109, …)",
          "SUM",
          "AGGREGATE(9, 5, …)",
          "A Table Total Row, which is built on SUBTOTAL",
        ], 1, "SUM totals every row in the range whether it is visible or not; the other three all skip rows the filter has hidden."),
        q("Formatting a cell to 2 decimals does what to the stored value?", [
          "Rounds it permanently",
          "Nothing — only the display changes",
          "Converts it to text",
          "Truncates it",
        ], 1, "Formatting is display-only; use ROUND to change the actual value, which is why formatted columns can appear not to add up."),
      ]
    ),
    chapter(
      "Lookups",
      "Joining data across tables — the skill that separates casual users from analysts.",
      [
        lesson("VLOOKUP and Why It Breaks", 12, `
Lookups answer: *given a value in this table, fetch the matching value from that one.*

### VLOOKUP

\`\`\`
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)
\`\`\`

"Find \`A2\` in the first column of the range, return the 3rd column, exact match."

**Always pass FALSE** (or 0) as the fourth argument. Omitting it defaults to TRUE — approximate match — which on unsorted data returns confidently wrong values with no error. This default is the source of an enormous amount of silently incorrect business analysis.

### The three structural weaknesses

**1. It only looks right.** The lookup column must be the leftmost column of the range. To fetch something to its left you must rearrange your data.

**2. The column index is a hardcoded number.** \`3\` means "third column". Insert a column into the source table and every formula now returns the wrong field — and nothing errors, because column 3 still contains valid-looking data. This breaks reports weeks after the change, with no clue what happened.

**3. It is slow** across large ranges, because it rescans for every row.

### Reading the errors

| Error | Meaning |
|---|---|
| \`#N/A\` | Not found — genuinely absent, or a type/spacing mismatch |
| \`#REF!\` | Column index exceeds the range width |
| \`#VALUE!\` | Column index below 1 |

Most \`#N/A\` results are not missing data. They are \`"Lahore "\` vs \`"Lahore"\`, or a number stored as text matched against a real number. Check with:

\`\`\`
=COUNTIF(Products!A:A, A2)      0 means truly absent
=EXACT(A2, Products!A2)         Reveals invisible differences
\`\`\`

Wrap \`TRIM\` around both sides when data comes from an export.

### INDEX/MATCH: the durable fix

\`\`\`
=INDEX(Products[Price], MATCH(A2, Products[SKU], 0))
\`\`\`

Read inside out: \`MATCH\` finds *which row*; \`INDEX\` returns the value at that row of the chosen column.

- Looks in **any** direction
- References columns **by name**, so inserting columns cannot break it
- Faster on large data

The \`0\` in \`MATCH\` means exact — same discipline as \`FALSE\` in VLOOKUP.
        `),
        lesson("XLOOKUP: the Modern Default", 12, `
\`XLOOKUP\` replaces VLOOKUP, HLOOKUP, and most INDEX/MATCH. If your Excel has it, use it.

\`\`\`
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
=XLOOKUP(A2, Products[SKU], Products[Price], "Not found")
\`\`\`

### What it fixes

- **Exact match by default.** No forgotten \`FALSE\`.
- **Any direction.** The return array is independent of the lookup array.
- **Column names, not indexes.** Inserting columns cannot break it.
- **Built-in not-found handling.** No \`IFERROR\` wrapper needed — and unlike \`IFERROR\`, it only catches "not found", not genuine formula errors you would want to see.

### Returning several columns at once

\`\`\`
=XLOOKUP(A2, Products[SKU], Products[[Name]:[Price]])
\`\`\`

Spills Name through Price across adjacent cells from one formula.

### Range lookups

\`\`\`
=XLOOKUP(C2, Tiers[Min], Tiers[Discount], , -1)
\`\`\`

\`-1\` means "exact match, or the next smaller item" — the correct tool for banded rates. \`1\` means next larger. This is the safe replacement for VLOOKUP's dangerous TRUE mode, because the behaviour is explicit rather than a default you might forget.

### Matching on two conditions

There is no two-key lookup, but concatenation works:

\`\`\`
=XLOOKUP(A2&"|"&B2, Sales[SKU]&"|"&Sales[Month], Sales[Amount])
\`\`\`

The \`|\` separator matters: without it, \`"AB"&"1"\` and \`"A"&"B1"\` both produce \`"AB1"\` and silently collide.

### Choosing

| Situation | Use |
|---|---|
| Modern Excel or Microsoft 365 | **XLOOKUP** |
| Must open in Excel 2016/2019 | **INDEX/MATCH** |
| Inherited a working sheet | VLOOKUP — leave it |

Never rebuild working VLOOKUPs just to modernise. Change them when you touch them for another reason; a large "improvement" pass across a live spreadsheet is a good way to introduce errors into something that was correct.

### Verify every join

After any lookup, count the misses:

\`\`\`
=COUNTIF(D2:D500, "Not found")
\`\`\`

If 40 of 500 rows failed to match, that is a data problem to investigate — not something to hide behind a tidy default. Unverified joins are how a report ends up quietly missing a tenth of the business.
        `),
        lesson("Combining Data From Several Sheets", 11, `
Real analysis usually spans more than one table.

### Referencing another sheet

\`\`\`
=Products!B2                        Another sheet
='Q1 Sales'!B2                      Quotes needed when the name has spaces
=[Budget.xlsx]Summary!B2            Another workbook
\`\`\`

Links between workbooks are fragile: they break when files move, they open stale, and they are a common source of numbers that nobody can reproduce. Prefer one workbook with multiple sheets, or a proper database.

### Stacking tables

For several sheets with identical columns:

\`\`\`
=VSTACK(Jan, Feb, Mar)
\`\`\`

A bare Table name means its data body, so the headers appear once at the top. Writing \`Jan[#All]\` instead would stack each table's header row into the middle of the result.

In older versions, or for anything recurring, use **Power Query**: Data → Get Data → Combine. Power Query is worth learning the moment you find yourself repeating a manual clean-up. It records the steps and replays them on new data with one refresh, which turns a two-hour monthly ritual into a button.

### Reconciling two lists

The everyday task — which customers are in the CRM but not the invoice list?

\`\`\`
=IF(COUNTIF(Invoices[Customer], A2)=0, "Missing", "OK")
\`\`\`

Run it in both directions. Records missing from either side are exactly what reconciliation is for, and checking only one direction finds only half the discrepancies.

### Before you trust a merge

1. **Row counts.** Does the combined total equal the sum of the parts?
2. **Duplicate keys.** \`=COUNTIF(range, A2)>1\` on the lookup column. A duplicate key means a lookup silently returns the *first* match and ignores the rest — a quiet, serious error.
3. **Type consistency.** SKU as text in one sheet and number in another will never match.
4. **Whitespace and case.** \`TRIM\` both sides.

### Keep a check row

Put a small block at the top of the report:

\`\`\`
Source rows      =ROWS(Sales)
Matched          =COUNTIF(D:D,"OK")
Unmatched        =COUNTIF(D:D,"Missing")
Total checks     =SUM(...)  vs  grand total
\`\`\`

If these ever disagree, the report is wrong and you will know immediately. Building the check *into* the file is far more reliable than remembering to verify by hand — especially for a report someone else refreshes.
        `),
      ],
      [
        q("Why must you pass FALSE as VLOOKUP's fourth argument?", [
          "It speeds up the lookup",
          "The default is approximate match, which returns wrong values on unsorted data without any error",
          "It makes the match case-sensitive",
          "It allows leftward lookups",
        ], 1, "Omitting it defaults to TRUE, which finds the nearest value and reports it confidently as a match."),
        q("Someone inserts a column in the source table and VLOOKUPs now return the wrong field. Why?", [
          "The range shifted",
          "The column index is a hardcoded position, not a name",
          "VLOOKUP caches results",
          "The table was not sorted",
        ], 1, "col_index_num is positional, so the third column becomes a different field — and no error is raised."),
        q("XLOOKUP's match_mode of -1 does what?", [
          "Reverse search",
          "Exact match or next smaller item",
          "Case-insensitive match",
          "Wildcard match",
        ], 1, "It is the safe, explicit replacement for VLOOKUP's approximate mode — correct for banded rates and tiers."),
        q("A lookup key appears twice in the source table. What happens?", [
          "An error is raised",
          "The first match is returned silently and the rest ignored",
          "Both values are summed",
          "The formula returns #N/A",
        ], 1, "Duplicate keys produce quietly wrong results, which is why checking for them before a merge matters."),
      ]
    ),
    chapter(
      "PivotTables and Analysis",
      "Summarising thousands of rows in seconds, and the settings that decide whether the answer is right.",
      [
        lesson("PivotTable Fundamentals", 13, `
A PivotTable answers "total X by Y" over any amount of data without writing a single formula. It is the highest-leverage feature in Excel.

### Building one

Select your Table → Insert → PivotTable. Then drag fields into four zones:

| Zone | Purpose |
|---|---|
| **Rows** | What you group down the side |
| **Columns** | What you group across the top |
| **Values** | What gets aggregated |
| **Filters** | A filter applied to the whole PivotTable |

City in Rows, Month in Columns, Amount in Values gives you sales by city by month — from 50,000 rows, instantly.

### Change the aggregation

Values defaults to **Sum** for numbers and **Count** for anything else. Click the field → Value Field Settings to choose Sum, Count, Average, Max or Min. Distinct Count is listed there too, but it only appears when the PivotTable was built with “Add this data to the Data Model” ticked.

**If a numeric field defaults to Count, some of its cells are text.** The PivotTable is telling you the column is dirty — a genuinely useful diagnostic that most people mistake for a bug.

### Show percentages instead of totals

Value Field Settings → Show Values As:

- **% of Grand Total** — each cell's share of everything
- **% of Row Total** — composition within each row
- **Running Total In** — cumulative
- **% Difference From** — growth versus a previous period

These answer "what share" and "how fast is it growing" without any formula.

### Grouping

Right-click a date field → Group → Months, Quarters, Years. One date column becomes a full time hierarchy. Numbers group into bands the same way — useful for order-size distributions.

### Two settings worth changing immediately

1. **Refresh on open.** A PivotTable does **not** update when the source changes. It shows a snapshot from the last refresh. Right-click → PivotTable Options → Data → "Refresh data when opening the file". Presenting stale pivot numbers is one of the most common ways wrong figures reach a meeting.

2. **Preserve column widths.** Same dialog, Layout & Format — stops your formatting resetting on every refresh.

### Slicers

Insert → Slicer gives clickable filter buttons. Connect one slicer to several PivotTables (Report Connections) and they filter together — that is a dashboard, with no macros involved.

### The source must be a Table

If the source is a fixed range, new rows are excluded and the pivot quietly under-reports. Ctrl+T first, always.
        `),
        lesson("Charts That Tell the Truth", 12, `
A chart is an argument. Choosing the wrong form, or the wrong axis, makes an argument you did not intend.

### Match the chart to the question

| Question | Chart |
|---|---|
| How does this change over time? | **Line** |
| How do categories compare? | **Bar / Column** |
| What is the relationship between two variables? | **Scatter** |
| What is the composition? | Stacked bar (rarely pie) |

Use **horizontal bars** when category names are long — rotated labels are hard to read. Sort bars by value, not alphabetically, unless the category order carries meaning. Sorting by size is usually the whole insight.

### Avoid pie charts

People compare angles poorly. A pie with more than about four slices is unreadable, and two similar slices are indistinguishable. A sorted bar chart shows the same data and can actually be read. Reserve pie for a single "this vs the rest" split.

### The truncated axis

Starting a **column chart's** y-axis anywhere but zero exaggerates differences. Values of 98 and 100 on an axis from 97 to 101 draw bars of length 1 and 3, so the second looks three times the first. Bar length encodes magnitude, so the length must be proportional to the value.

Line charts are the exception — they encode *change*, so a zoomed axis is legitimate and often necessary. The distinction is length-encoding versus position-encoding.

### Cut the decoration

Remove gridlines you do not need, drop the legend when there is one series, delete the chart border, and lose 3-D entirely — 3-D perspective distorts the very lengths the reader is trying to compare.

Label directly on the series rather than forcing a trip to a legend, and keep the number of series to about five. Beyond that, use small multiples: several small charts instead of one crowded one.

### Say what the chart shows

Title it with the finding, not the field names:

- Weak: "Sales by Month"
- Strong: "Sales fell 18% after the March price change"

A chart titled with its conclusion is read correctly. A chart titled with its axes makes every reader do the work again, and some will reach a different answer.

### Always label units and time

"Revenue" is ambiguous. "Revenue (PKR, thousands)" is not. Every axis needs units; every chart needs its period stated.
        `),
        lesson("What-If Analysis and Sanity Checks", 11, `
Analysis is not finished when the number appears. It is finished when you know the number is right and how much it could move.

### Goal Seek

Data → What-If Analysis → Goal Seek. Answers "what input gives me this result?"

Set cell \`B10\` (profit) to value \`500000\` by changing cell \`B3\` (units sold). Excel solves it directly, rather than you nudging the input repeatedly.

### Data Tables

Show a result across a range of inputs. Put your formula in a corner, candidate values down one side and across the top, then Data → What-If Analysis → Data Table.

This turns "profit at 12% margin" into "profit at every margin from 8% to 20%" — which is a far more honest way to present a forecast than a single confident figure.

### Scenario Manager

Save named sets of inputs — Base, Optimistic, Pessimistic — and switch between them. Better than three copies of the file, which inevitably diverge.

### Sanity checks that catch real errors

Before anyone else sees the numbers:

- **Do the parts sum to the whole?** Category subtotals must equal the grand total.
- **Is the order of magnitude right?** If monthly revenue reads 40 million and the business does about 4 million, you have a units or double-count problem.
- **Spot-check three rows by hand.** Recompute one small, one large, one weird row manually.
- **Check the extremes.** Sort ascending and descending. Negative quantities, dates in 1900, and 10,000% margins surface immediately.
- **Compare to last period.** A 300% jump is either the story or a bug, and you need to know which before presenting it.

### Trace the formula

Formulas → Trace Precedents draws arrows to a cell's inputs. Trace Dependents shows what relies on it. Evaluate Formula steps through a complex expression one piece at a time. These three tools resolve most "where does this number come from?" questions in minutes.

### Report the uncertainty

A forecast presented as a single number invites false confidence. "Between 4.2 and 5.1 million, most likely 4.6" is more useful and more honest — and it is what the Data Table you just built already tells you. Presenting a range is not hedging; it is reporting what the analysis actually supports.
        `),
      ],
      [
        q("A numeric column defaults to Count rather than Sum in a PivotTable. What does that indicate?", [
          "The pivot is broken",
          "Some cells in that column contain text",
          "The source is not a Table",
          "Count is always the default",
        ], 1, "Excel picks Count when a field is not consistently numeric — it is a useful signal that the column is dirty."),
        q("Source data changes but the PivotTable shows old numbers. Why?", [
          "The source is not a Table",
          "PivotTables show a cached snapshot until refreshed",
          "Filters are applied",
          "Grouping blocks updates",
        ], 1, "A pivot does not auto-update; enable refresh-on-open or refresh manually before presenting."),
        q("Why is a truncated y-axis misleading on a column chart but acceptable on a line chart?", [
          "Columns are wider",
          "Column length encodes magnitude, so it must start at zero; lines encode change",
          "Line charts have no axis",
          "It is misleading on both",
        ], 1, "Bar length is read as quantity, so a non-zero baseline distorts it; a line shows movement, where zooming is legitimate."),
        q("Which is the strongest chart title?", [
          "Sales by Month",
          "Monthly Sales Data",
          "Sales fell 18% after the March price change",
          "Figure 3: Sales",
        ], 2, "A title stating the finding is read correctly; one naming the axes makes every reader re-derive the conclusion."),
      ]
    ),
    chapter(
      "From Spreadsheet to Analysis",
      "Automating the repetitive parts and communicating results so they change decisions.",
      [
        lesson("Power Query: Stop Cleaning by Hand", 12, `
If you clean the same export every week, you are doing work a tool should do. Power Query records your cleaning steps once and replays them on demand.

### The workflow

Data → Get Data → From File / From Folder. The Power Query Editor opens on a preview. Every action you take — remove a column, split text, change a type, filter rows — is recorded as a **step** in the Applied Steps list.

Click Close & Load and the cleaned result lands in Excel. Next month, drop in the new file and press **Refresh**. Every step reruns in order.

### What it handles well

- **Combine a folder of files.** Point at a folder and every file in it stacks into one table — twelve monthly exports become one dataset.
- **Unpivot.** The most valuable single feature. Data arrives with months as columns:

\`\`\`
Customer | Jan | Feb | Mar
\`\`\`

Select the month columns → Unpivot Columns:

\`\`\`
Customer | Month | Amount
\`\`\`

That second shape is what PivotTables and charts actually need. Doing this by hand every month is a genuine waste of a working day, and it is error-prone.

- **Merge and append.** Joins between tables, without a lookup formula in 50,000 rows.
- **Type and error handling.** Set a column's type once and bad values are flagged consistently.

### Why it beats formulas

| | Formulas | Power Query |
|---|---|---|
| Repeatable | Copy and pray | One Refresh |
| Auditable | Read 500 formulas | Read the step list |
| Handles new files | Manual | Automatic |
| Big data | Slows badly | Handles millions of rows |

### Keep the raw data raw

Never edit the source file. Load it, transform it in Power Query, and output a clean table. When something looks wrong you can always go back to what actually arrived — which is impossible once you have hand-edited the original.

### Name your steps

Rename steps to say *why*: "Removed cancelled orders" rather than "Filtered Rows". In six months, the step list is the only documentation of what this transformation does and why.

### When to move on

Power Query is the bridge between spreadsheets and real data tooling. Once several people need the same cleaned data, or it needs to run on a schedule without someone opening a file, that is the point to move the pipeline into a database.
        `),
        lesson("Dashboards People Actually Use", 11, `
A dashboard is not a pile of charts. It answers a specific set of recurring questions at a glance.

### Start with the questions

Before building anything, write down the three to five questions the reader asks every week. "Are we on target?" "Which region is behind?" "What changed since last month?"

Every element on the dashboard must answer one of them. Anything that answers none gets removed, however interesting it looks. Dashboards fail far more often from including too much than too little.

### Structure

\`\`\`
┌─────────────────────────────────────┐
│  4 headline numbers, with change    │   ← the answer
├──────────────────┬──────────────────┤
│  Trend over time │  Breakdown by    │   ← the context
│                  │  category        │
├──────────────────┴──────────────────┤
│  Detail table (filterable)          │   ← the drill-down
└─────────────────────────────────────┘
\`\`\`

Top-left gets read first — put the most important number there.

### Headline numbers need comparison

\`Revenue: 4,250,000\` means nothing alone. Is that good?

\`\`\`
Revenue        4,250,000
vs last month     +12%
vs target          -3%
\`\`\`

A number with no comparison cannot support a decision. Always pair the value with a reference point.

### Build it on PivotTables and slicers

Charts from PivotTables, one set of slicers connected to all of them (Report Connections), refresh-on-open enabled. That is an interactive dashboard with no VBA and nothing to maintain.

### Presentation

- Hide the working sheets, or at least group them away from the report tab.
- View → uncheck Gridlines and Headings. It stops looking like a spreadsheet.
- Freeze panes so headers stay visible.
- Set the print area and fit to one page — someone will print it.
- Use two or three colours. Reserve one strong colour to mean "attention here".

### State the refresh date

Put \`=TEXT(TODAY(),"dd mmm yyyy")\` or, better, a manually stamped refresh date on the dashboard. A dashboard whose age is unknown gets distrusted quickly, and rightly so — the reader cannot tell whether they are looking at this morning's numbers or last quarter's.
        `),
        lesson("Communicating Findings", 11, `
Analysis that nobody acts on has produced no value. Delivery is part of the job.

### Lead with the answer

Business readers want the conclusion first, then support:

1. **The finding.** "Lahore revenue fell 22% in Q2."
2. **The evidence.** The chart that shows it.
3. **The cause,** if you know it — and say plainly when you do not.
4. **The recommendation.** What you would do.

Building up to a conclusion works in a lecture. In a meeting the decision is often made in the first thirty seconds, and if you spend those explaining methodology, someone else fills the gap.

### Be precise about uncertainty

Distinguish clearly between:

- **What the data shows.** "Orders from repeat customers fell 22%."
- **What you infer.** "This coincides with the March price change."
- **What you are guessing.** "It may be competitor pricing — we do not have that data."

Blurring these three is the fastest way to lose credibility, because the moment one guess is wrong every fact you presented gets re-examined.

### Correlation is not causation

Two series moving together is a starting point, not a conclusion. Before claiming cause, ask:

- Could a third factor drive both? (Ice cream and drownings both rise in summer.)
- Could the direction be reversed?
- Is the sample big enough, or is it four data points?

State the alternative explanations you considered. It strengthens the argument rather than weakening it.

### Beware the small denominator

"Conversion up 200%" from 1 sale to 3 is noise. Always show the underlying counts alongside a percentage. Percentages on tiny bases are the most common way spreadsheets mislead — usually unintentionally.

### Show your workings

Include a source note: where the data came from, the date range, what was excluded and why. "Excludes 47 cancelled orders and 3 test records" is exactly the sort of detail that decides whether a number can be trusted or has to be redone from scratch.

### Where to go next

You now have the core analytical toolkit. The natural next steps are **SQL**, once your data outgrows a spreadsheet, and **Power BI or Tableau** for dashboards that refresh themselves and are shared with many people. The thinking transfers directly — only the tool changes.
        `),
      ],
      [
        q("What is Power Query's Unpivot used for?", [
          "Removing duplicate rows",
          "Turning month-per-column layouts into one row per month, which charts and pivots need",
          "Merging two tables",
          "Sorting data",
        ], 1, "Wide layouts are readable but unusable for analysis; unpivoting produces the long format tools expect."),
        q("Why should the raw source file never be edited directly?", [
          "It is usually read-only",
          "You lose the ability to go back to what actually arrived when something looks wrong",
          "It breaks Power Query",
          "Excel forbids it",
        ], 1, "Keeping the source untouched means every transformation is reproducible and auditable."),
        q("A headline figure reads 'Revenue: 4,250,000'. What is missing?", [
          "A currency symbol",
          "A comparison — versus target or last period",
          "A chart",
          "A percentage",
        ], 1, "Without a reference point the reader cannot tell whether the number is good, so it cannot support a decision."),
        q("Conversion 'up 200%' from 1 sale to 3 illustrates which problem?", [
          "Truncated axis",
          "A percentage on a tiny denominator, which is noise",
          "Correlation vs causation",
          "Double counting",
        ], 1, "Percentage change on very small counts is dominated by randomness; always show the underlying numbers."),
      ]
    ),
    chapter(
      "Dynamic Arrays and Workbooks That Stay Fast",
      "Spill formulas, calculation speed, and how to take over a file that is already broken.",
      [
        lesson("Dynamic Arrays: One Formula, Many Cells", 13, `
A modern formula can return more than one value. Type it in a single cell and the result **spills** into the cells below and to the right, resizing itself whenever the data changes. That removes most of the drag-the-formula-down work from Chapters 2 and 3.

### The core four

\`\`\`
=UNIQUE(Sales[City])                     Distinct list, duplicates removed
=SORT(UNIQUE(Sales[City]))               Same list, alphabetical
=FILTER(Sales[Amount], Sales[City]="Lahore", 0)   Matching rows only
=SEQUENCE(12)                            1 to 12, spilled down a column
\`\`\`

\`FILTER\`'s third argument is what to show when nothing matches. Omit it and an empty result returns \`#CALC!\` instead of a blank.

### Combining conditions

\`\`\`
=FILTER(Sales[[Rep]:[Amount]],
        (Sales[City]="Lahore")*(Sales[Amount]>1000),
        "No rows")
\`\`\`

**\`*\` means AND and \`+\` means OR**, applied row by row. Writing \`AND(Sales[City]="Lahore", Sales[Amount]>1000)\` reads more naturally and is wrong: \`AND\` collapses both columns into a single TRUE or FALSE, and one value cannot say which of the rows to keep, so \`FILTER\` rejects the mismatched size and the whole formula returns \`#VALUE!\`. Everyone makes this mistake once, and the giveaway is a dimension error on a filter that reads perfectly sensibly.

### The spill operator

A spilled block has one real formula, in its top-left cell. Refer to the whole block with \`#\`:

\`\`\`
F2:  =SORT(UNIQUE(Sales[City]))
G2:  =SUMIFS(Sales[Amount], Sales[City], F2#)
H1:  =COUNTA(F2#)                  Counts the block, whatever size it is today
\`\`\`

\`F2#\` means "however many cities exist right now". Writing \`F2:F20\` instead is the stale-range bug from Chapter 1 in new clothes — add a twenty-first city and the summary quietly drops it while still looking complete.

### A live top-five block

\`\`\`
=TAKE(SORT(FILTER(Sales[[Rep]:[Amount]], Sales[Month]=$B$1),
           2, -1),
      5)
\`\`\`

Filter to the month named in \`B1\`, sort by the second column descending, keep the first five rows. Change \`B1\` and the whole block redraws instantly — a report with no PivotTable and nothing to refresh.

### A whole grid from two spilled headers

\`\`\`
F2:  =SORT(UNIQUE(Sales[City]))                spills down
G1:  =TRANSPOSE(SORT(UNIQUE(Sales[Month])))    spills across
G2:  =SUMIFS(Sales[Amount], Sales[City], F2#, Sales[Month], G1#)
\`\`\`

That last formula spills in both directions at once and produces the entire city-by-month grid from one cell. Compare it with the mixed-reference version in Chapter 1: the same answer, except this one grows a row when a new city appears instead of needing anything dragged.

### Self-maintaining dropdowns

Data → Data Validation → List, with the Source set to \`=$F$2#\`. The dropdown now offers exactly the cities present in today's data. The validation lists from Chapter 1 stop being something anybody has to remember to update.

### LET: name the parts

Repeating a sub-expression makes Excel compute it twice and makes the formula unreadable:

\`\`\`
=LET(
  rows,  FILTER(Sales[Amount], Sales[Rep]=$A2, 0),
  total, SUM(rows),
  IF(total=0, "No sales", total)
)
\`\`\`

\`LET\` takes any number of name/value pairs and then one final expression. The filter runs once, the sum runs once, the intent is visible, and the formula can be read aloud to a colleague — which is a fair test of whether it belongs in a shared file.

Note the \`0\` on the end of the \`FILTER\`. Leave it off and a rep with no sales makes \`rows\` a \`#CALC!\` error rather than an empty list, and every later mention of the name inherits it — so a guard like \`IF(COUNT(rows)=0, …)\` never gets the chance to fire. Errors propagate through \`LET\` names; they are not values you can test.

### #SPILL! and what causes it

| Cause | Fix |
|---|---|
| A value or stray space in the spill path | Clear the blocking cells — Excel highlights them |
| The formula sits inside a Ctrl+T Table | Tables cannot spill; move it to the report sheet |
| Merged cells in the way | Unmerge, and stop merging cells in data areas |
| Result too large | A whole-column reference asks for a million rows; use Table columns |

Note the second row: Tables and dynamic arrays are both good and they do not mix. Keep Tables for raw data, put spilled results on the \`Report\` sheet from Chapter 1.

### Version reality

Dynamic arrays need Microsoft 365 or Excel 2021. Open the file in Excel 2019 and every one of these formulas appears as \`_xlfn.FILTER\` and returns \`#NAME?\`. The line is not quite one date, either: \`UNIQUE\`, \`SORT\`, \`FILTER\`, \`SEQUENCE\` and \`LET\` shipped in Excel 2021, while the newer array shapers — \`TAKE\`, \`DROP\`, \`VSTACK\`, \`TEXTSPLIT\` — are Microsoft 365 and Excel 2024 only, so the top-five block above is \`#NAME?\` on a 2021 install that handles everything else on this page. Check what the recipient runs before you build a workbook on them — the same discipline as choosing between XLOOKUP and INDEX/MATCH in Chapter 3. If a file has to serve both, keep the spilled blocks on the report sheet and leave the underlying calculations as ordinary formulas: an older Excel then loses the convenience rather than the numbers.
        `),
        lesson("Why the Workbook Got Slow", 12, `
Excel recalculates along a dependency chain: change one cell and it recomputes that cell and everything downstream. A file that freezes for five seconds after every keystroke is almost always doing far more of that work than the data requires.

### Volatile functions recalculate always

\`NOW\`, \`TODAY\`, \`RAND\`, \`RANDBETWEEN\`, \`OFFSET\`, \`INDIRECT\`, \`CELL\` and \`INFO\` are **volatile**. They recompute on every change anywhere in the workbook, whether or not their own inputs moved, and they drag every dependent formula with them.

Five hundred \`OFFSET\` formulas built as "dynamic ranges" therefore rebuild constantly. Replace them:

\`\`\`
=OFFSET($A$1,0,0,COUNTA(A:A),1)        Volatile dynamic range
=Sales[Amount]                         A Table already resizes itself

=INDIRECT("Sheet"&A1&"!B2")            Volatile, and unreadable
=CHOOSE(A1, Jan!B2, Feb!B2, Mar!B2)    Not volatile
\`\`\`

### Whole-column references

\`=SUMIFS(A:A, B:B, D2)\` asks Excel to consider 1,048,576 rows. Copied down 5,000 rows that is over five billion cell evaluations to summarise 5,000 records. Use Table columns — \`Sales[Amount]\` covers exactly the rows that exist and grows on its own.

### Repeated identical work

\`\`\`
=XLOOKUP($A2, P[SKU], P[Name])          Three separate scans of the
=XLOOKUP($A2, P[SKU], P[Price])         same table, per row
=XLOOKUP($A2, P[SKU], P[Category])

=XLOOKUP($A2, P[SKU], P[[Name]:[Category]])   One scan, spills three columns
\`\`\`

### The bloated used range

Press **Ctrl+End**. If it lands on row 900,000 in a sheet holding 4,000 rows, Excel is storing formatting for cells you emptied long ago. Select the first truly empty row down to the last, right-click and Delete; do the same for columns; then **save, close and reopen**, because the used range only resets on reopen. A 40 MB file routinely drops to 3 MB.

### Conditional formatting that has multiplied

Copying rows copies rules. Home → Conditional Formatting → Manage Rules → "This Worksheet". Three hundred near-identical rules each covering one row is normal in an inherited file; delete them all and reapply one rule to the whole column. Check Name Manager for the same rot — hundreds of unused names, many pointing at \`#REF!\`.

### Calculation mode

Formulas → Calculation Options → **Manual** suspends recalculation until you press **F9** (Shift+F9 for the active sheet only). It is the right tool while surgery is in progress and a dangerous one to leave switched on: displayed numbers may be stale, and the only warning is a small "Calculate" in the status bar. Switch it back to Automatic before the file leaves your machine.

### Measure, do not guess

Note the file size, press Ctrl+End, count the conditional formatting rules, then Ctrl+F with Look in: **Formulas** for "OFFSET" and "INDIRECT". Fix the largest item and re-time. Rewriting formulas that were never the bottleneck is a reliable way to spend a day and gain nothing. Ten seconds on Ctrl+End frequently saves an afternoon, because file bloat and volatile functions between them explain most slow workbooks.

### SUMPRODUCT and legacy array formulas

\`\`\`
=SUMPRODUCT((Sales[City]="Lahore")*(Sales[Amount]))    Touches every row, every time
=SUMIFS(Sales[Amount], Sales[City], "Lahore")          Uses Excel's internal index
\`\`\`

\`SUMPRODUCT\` was the only way to do multi-condition arithmetic before \`SUMIFS\` existed, and inherited workbooks are still full of it. Swapping the two is often the largest single speed gain available, and the results should match exactly — check a few before replacing the lot. Old Ctrl+Shift+Enter array formulas spanning whole columns behave the same way.

### Save heavy models as .xlsb

File → Save As → **Excel Binary Workbook** (\`.xlsb\`) keeps every feature, typically halves the file size, and opens and saves noticeably faster on a large model. The trade-off is that it cannot be co-authored (Chapter 7), so use it for your own heavy working files rather than the shared report.

### The real ceiling

Somewhere around 200,000 rows with a lookup on every row, formulas stop being the right approach however well written they are. That is what the Data Model in Chapter 7 exists for: it compresses each column and evaluates in a different engine, handling millions of rows on the same laptop that could not open your workbook.
        `),
        lesson("Taking Over a Workbook You Did Not Build", 12, `
The request is always phrased the same way: "this file is giving the wrong number, can you look at it?" Work in this order, and resist the urge to start rewriting formulas.

First, ask which figure is wrong and what it should be instead. "The total is too high, it should be about 4.6 million" turns an open-ended audit into a search with a target, and the size of the gap frequently names the cause on its own — it turns out to be exactly one region, or exactly the value of the 47 cancelled orders.

### 1. Copy it before you touch it

Save a dated copy first. You need something to compare against, and \`#REF!\` damage cannot be undone once the file has been saved and closed.

### 2. Map the sheet

**Show Formulas** — Ctrl plus the grave-accent key, left of the 1 — displays every formula on the sheet at once. It is the fastest way to see which columns are calculated and, more importantly, where a pattern breaks halfway down.

Then Ctrl+G → **Special**:

- **Constants**, applied to a formula column, selects the cells where somebody typed a number over a formula. This is the single most common cause of "the total is wrong but every formula looks fine".
- **Formulas → Errors** selects every error cell in one go.
- **Precedents** and **Dependents** show what a cell reads and what reads it.

Excel flags the first case itself with a small green triangle and an "Inconsistent Formula" warning. In an inherited file, take those seriously — they are usually right.

### Reveal formula drift

\`\`\`
=FORMULATEXT(D2)
\`\`\`

Put that in a spare column beside a calculated one and copy it down. Every row should show the same formula with only the row numbers shifting. Filter or sort that helper column and any row where the text differs groups itself together — which finds the one edited cell in 5,000 far faster than scrolling ever will.

### 3. Read the errors

| Error | What it actually means |
|---|---|
| \`#REF!\` | The target was deleted; the original reference is gone and must come from a previous version |
| \`#NAME?\` | A typo, a deleted named range, or a function this Excel version lacks (the \`_xlfn.\` prefix) |
| \`#VALUE!\` | Wrong type — usually text where a number is expected |
| \`#DIV/0!\` | Division by an empty or zero cell |
| \`#N/A\` | A lookup found nothing (Chapter 3) |
| \`#SPILL!\` | A dynamic array is blocked |
| \`#CALC!\` | An empty array, typically \`FILTER\` with no matches |

### 4. Circular references

The status bar reads "Circular References: B12", and Formulas → Error Checking → Circular References jumps straight to it. It is almost always a \`SUM\` that includes its own cell. Switching on iterative calculation makes the warning disappear and the number meaningless — fix the reference instead.

### 5. Step through the suspect formula

Formulas → **Evaluate Formula** walks one operation at a time. For a quicker look, select a fragment inside the formula bar and press **F9** to see what that piece returns — then press **Esc**. Press Enter instead and the fragment is permanently replaced by its literal result, silently converting a working formula into a hardcoded number. That is exactly how a file that was correct last month becomes wrong this month.

### 6. Check the edges

- **Edit Links** (Data → Edit Links): a broken workbook link shows its last cached value rather than an error, so the number looks fine and stopped updating months ago.
- **Name Manager**: any name whose reference reads \`#REF!\`.
- **Hidden sheets and filtered rows**: right-click a tab → Unhide. A hidden row still counts in \`SUM\` unless \`SUBTOTAL\` was used (Chapter 2).
- **Manual calculation left on**: press F9 and watch whether numbers move.

### 7. Rebuild the check block

Before declaring it fixed, add the reconciliation block from Chapter 3: source row count, matched, unmatched, and parts summing to the whole. If those four lines will not agree, the file is not fixed yet. If they do agree, you have left behind something that catches the next failure without anyone remembering to look — which is the actual deliverable.

Then write what was wrong and what you changed on the Notes sheet from Chapter 1. The person who inherits this file next is often you.
        `),
      ],
      [
        q("Which correctly requires BOTH conditions inside FILTER?", [
          "AND(Sales[City]=\"Lahore\", Sales[Amount]>1000)",
          "Sales[City]=\"Lahore\" AND Sales[Amount]>1000",
          "(Sales[City]=\"Lahore\")*(Sales[Amount]>1000)",
          "IF(Sales[City]=\"Lahore\", Sales[Amount]>1000)",
        ], 2, "FILTER needs one TRUE/FALSE per row, and * combines the two arrays element by element; AND collapses the whole column into a single value."),
        q("A dynamic array formula returns #SPILL!. The most likely cause is:", [
          "Something already occupies the cells the result needs to fill",
          "The formula is volatile",
          "The source range is not a Table",
          "The result contains text as well as numbers",
        ], 0, "A spill needs an empty block below and to the right, so stray values, merged cells, or sitting inside a Ctrl+T Table all block it."),
        q("A file recalculates for several seconds after every keystroke. The most likely culprit is:", [
          "Too many worksheets",
          "Conditional formatting on the header row",
          "XLOOKUP used instead of VLOOKUP",
          "Hundreds of OFFSET and INDIRECT formulas, which are volatile",
        ], 3, "Volatile functions recalculate on every change anywhere in the workbook and drag every dependent formula with them, whether or not their inputs moved."),
        q("You select part of a formula in the formula bar and press F9 to inspect it. What must you press next?", [
          "Enter, to keep the evaluated value",
          "Esc, or that fragment is committed as a hardcoded value",
          "F9 again, which restores the formula",
          "Nothing — F9 is display-only",
        ], 1, "Enter permanently replaces the selected fragment with its literal result, which is a quiet and common way a correct formula gets destroyed."),
      ]
    ),
    chapter(
      "Excel in Production",
      "Data models, sharing files safely, and running a report other people depend on.",
      [
        lesson("The Data Model: Relationships Instead of Lookups", 13, `
Attaching a product category to 80,000 sales rows with \`XLOOKUP\` works, and it is the wrong shape. You are copying a value that already exists in another table into 80,000 cells so a PivotTable can group by it. The **Data Model** lets the PivotTable read both tables directly.

### Load two tables and relate them

1. Ctrl+T both tables (Chapter 1) and give them real names — \`Sales\`, \`Products\`.
2. Insert → PivotTable, and tick **Add this data to the Data Model**.
3. For the second table: Data → From Table/Range → Close & Load To → Only Create Connection, with Add to Data Model ticked.
4. Data → **Relationships** → New, or Power Pivot → Manage → Diagram View, then drag \`Sales[SKU]\` onto \`Products[SKU]\`.

\`Products[Category]\` now appears in the PivotTable field list beside \`Sales[Amount]\`, and grouping works with no lookup column anywhere.

### The rule that decides everything

One side of a relationship must be **unique**. \`Products[SKU]\` is the "one" side and must have no duplicates and no blanks; \`Sales[SKU]\` is the "many" side and repeats freely.

If Excel refuses to create the relationship, the key column has duplicates — the exact problem from Chapter 3, except that here it is raised as an error instead of silently returning the first match. Deduplicate the dimension table; never work around it.

Arrange tables in a **star**: one fact table (\`Sales\`) in the middle, dimension tables (\`Products\`, \`Customers\`, \`Calendar\`) around it, each joined only to the fact table. Joining a dimension to another dimension creates ambiguous paths and wrong totals.

### Measures beat calculated columns

A calculated column is stored once per row. A **measure** is evaluated at query time, inside whatever filters apply to the PivotTable cell being drawn:

\`\`\`
Total Sales := SUM(Sales[Amount])
Orders      := COUNTROWS(Sales)
Customers   := DISTINCTCOUNT(Sales[CustomerID])
Avg Order   := DIVIDE([Total Sales], [Orders])
\`\`\`

\`DIVIDE\` returns blank instead of \`#DIV/0!\`, which alone makes it a better choice than \`/\`.

Because measures respond to filter context, \`[Avg Order]\` is correct in every cell of the pivot — every city, every month, every subtotal — from one definition. A calculated column with a hardcoded denominator is correct only at the level you happened to build it for.

### Comparisons over time

\`\`\`
Sales LY := CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date]))
Growth % := DIVIDE([Total Sales] - [Sales LY], [Sales LY])
\`\`\`

\`CALCULATE\` re-evaluates a measure under different filters, and it is the function the rest of DAX is built around.

**The classic failure:** time-intelligence measures return blank everywhere. The cause is almost never the formula — it is the absence of a proper **Calendar table**. You need a separate table with one continuous row per date across the whole range, related to the fact table's date column, and set with Power Pivot → Design → **Mark as Date Table**. Dates living only inside \`Sales\` are not enough, and a calendar with gaps produces silently wrong comparisons.

### Where measures live

Measures belong to the model, not to a sheet. Write them once in Power Pivot → Manage → the calculation area, name them plainly (\`Total Sales\`, never \`Measure 1\`), and every PivotTable in the workbook can use them. When a report needs a hand-laid-out shape rather than a pivot grid, \`CUBEVALUE\` pulls the same measures into ordinary cells:

\`\`\`
=CUBEVALUE("ThisWorkbookDataModel",
           "[Measures].[Total Sales]",
           "[Products].[Category].[Beverages]")
\`\`\`

That is how a formatted board pack takes its numbers from the model without a single lookup formula.

### One caution

A Data Model does not travel backwards. The workbook needs a recent Excel version, and a large model needs a 64-bit installation to hold it in memory. Decide who has to open the file before you build on it — the same version question as Chapter 3, with higher stakes.

### Why bother

- Millions of rows compress into memory that a formula-based workbook could not open at all.
- Changing the definition of "active customer" is one measure edit, not 80,000 formulas.
- The model moves to Power BI unchanged — the measures are written in the same language.

The Distinct Count you enabled in Chapter 4 was already a Data Model feature. This is the rest of it.
        `),
        lesson("Sharing a File Without Leaking It", 12, `
Where the file lives decides how it behaves. A workbook on OneDrive or SharePoint has version history and co-authoring. The same workbook emailed as an attachment becomes six divergent copies inside a week, and nobody can say which one is right.

### One live file, dated exports

Version history is what replaces \`sales_final_v3_FINAL(2).xlsx\`. Right-click the file → Version History to view and restore any earlier state, with the author and timestamp attached.

Keep exactly one editable workbook. When a period must be frozen for the record, export it — a PDF, or a values-only copy named \`2026-07 Sales Report.xlsx\`. Two editable copies always diverge, and the divergence is discovered by someone quoting a number you cannot reproduce.

Co-authoring needs the modern format: \`.xlsx\` on OneDrive or SharePoint. \`.xls\`, \`.xlsb\` and anything using the legacy Shared Workbook feature open exclusively, one person at a time.

### Hidden is not removed

Every item below is fully present in the file and one click from being read:

- Hidden columns, rows and sheets, including "very hidden" ones
- Rows removed by a filter
- White text on a white background
- Comments, and the author names attached to them
- The full path of every linked workbook, visible under Data → Edit Links

### The PivotTable cache

**The classic leak.** You summarise raw salary data, delete the raw sheet, and send the pivot. A PivotTable keeps its own **complete copy** of the source. Double-click any value and Show Details rebuilds those rows on a fresh sheet — including the ones you thought you had deleted.

Deleting the source sheet does not empty the cache. To share a summary safely, copy it, Paste Special → Values, into a **new workbook**. Anything short of that carries the data along with it.

### Inspect before sending

File → Info → Check for Issues → **Inspect Document** finds and strips comments, personal information, hidden sheets, hidden rows and columns, and embedded content. Run it on anything leaving the organisation, and save under a new name afterwards — the removals cannot be undone.

### Protection is not encryption

| Feature | What it actually does |
|---|---|
| Review → Protect Sheet | Prevents accidental edits. Not encrypted, removed in seconds |
| Protect Workbook Structure | Stops sheets being added or unhidden. Same |
| File → Info → **Encrypt with Password** | Genuinely encrypts the file. Lose the password and the file is gone |
| Sensitivity labels | Encryption plus per-person permissions that survive forwarding |

Sheet protection (Chapter 1) prevents accidents. Only encryption prevents access. Confusing the two is how confidential files travel with a false sense of safety.

### Personal data

Names, phone numbers, national ID numbers and salaries should be aggregated or removed before a file circulates. Aggregation is not automatically anonymity: a table of region, job title and salary with one row per person identifies everyone in it. If any group has fewer than about five rows, aggregate to a coarser level.

### Links travel with the file

A workbook linked to \`Budget.xlsx\` on your desktop carries that full path inside it. The recipient sees your folder structure under Data → Edit Links, gets a prompt about updating links they cannot resolve, and reads whatever value was cached the last time you saved. Before sending, Data → Edit Links → **Break Links** converts every linked formula to its current value. Do it on a copy — breaking links cannot be undone.

Query connections behave the same way. A Power Query pointing at a folder on your machine simply fails on theirs, and the credentials are stored per user rather than in the file, so "it works for me" is guaranteed and meaningless.

### Choose the export format deliberately

| Format | Use for | Loses |
|---|---|---|
| \`.xlsx\` | People who must edit | Nothing |
| PDF | People who only read | All interactivity |
| CSV | Machines and imports | Formulas, formatting, every sheet but one |

CSV also re-mangles dates by locale and strips leading zeros, so \`00123\` comes back as \`123\`. That is Chapter 1's problem returning: a CSV round trip is where clean data goes to be broken again.
        `),
        lesson("The Monthly Run", 12, `
A report that only works when you run it is a report that fails the week you are on leave. Write the run down, make it verify itself, and hand it over.

### The runbook

Keep it on a \`Runbook\` sheet next to the Notes sheet from Chapter 1. Six lines is usually enough:

\`\`\`
1  Save the export to  finance/drops/sales/  as YYYY-MM-sales.csv
2  Open Report.xlsx, Data -> Refresh All, wait for the status bar to clear
3  Confirm the CHECKS block reads OK
4  Explain every line moving more than +/-15% (Variance sheet)
5  File -> Export -> PDF  as  2026-07 Sales Report.pdf
6  Post to the Finance channel, quoting the row count
\`\`\`

### Refresh in the right order

Queries feed the model; the model feeds the pivots. If **background refresh** is enabled, Refresh All returns before the query has finished and the PivotTables rebuild against last month's data. The numbers look entirely plausible and are one month stale — the worst kind of wrong.

Fix it once: Data → Queries & Connections → right-click each query → Properties → untick **Enable background refresh**. Refresh All then becomes a single reliable action.

### Checks that fail loudly

Build this block on the report tab, using the reconciliation idea from Chapter 3:

\`\`\`
       C                    D          E
 2   Source rows (CSV)   12,480              typed from the export, or counted by a query
 3   Loaded rows         12,433              D3:  =ROWS(Sales)
 4   Dropped                 47              D4:  =D2-D3    cancelled orders, expected
 5   Unmatched SKUs           6              D5:  =COUNTIF(Match[Result],"Missing")
 6   Grand total      4,612,300              D6:  =SUM(Sales[Amount])
 7   Sum of regions   4,612,300              D7:  =SUM(Regions[Amount])
 8
 9   Drop rate under 1%              OK      E9:  =IF(D4/D2<0.01,"OK","CHECK")
10   All SKUs matched             CHECK      E10: =IF(D5=0,"OK","CHECK")
11   Parts = whole                   OK      E11: =IF(ROUND(D6-D7,2)=0,"OK","CHECK")
12   STATUS                       CHECK      E12: =IF(COUNTIF(E9:E11,"CHECK")=0,"OK","CHECK")
\`\`\`

Figures on the left, verdicts on the right, and one STATUS cell that turns to CHECK the moment any verdict below it does — so a completed run is confirmed by reading a single cell. Each verdict needs a number it can be compared against, which is why the grand total has a \`Sum of regions\` row underneath it: a total can only be reconciled against something built a different way. Here 47 dropped rows out of 12,480 is 0.38%, comfortably inside the threshold, and the regions add up, so the run fails on one line only.

Six unmatched SKUs is the run telling you the product master is behind — items were sold before anyone added them. Add them, refresh, and the count returns to zero. A check that reads OK when it should not is worse than no check at all, so set every threshold at a level you would genuinely act on.

### Variance review before publishing

Every line moving more than ±15% against last month gets one sentence of explanation before the file leaves your hands. Usually it is a real story. Occasionally it is a duplicate file left in the drop folder, which shows up as one region roughly doubling — an almost-exact doubling is nearly always double-loaded data, not a sales record.

### Stamp every run

On the report tab: refresh date, source file name, row count, and who ran it. When someone asks in November which version of the July numbers they are holding, that answers it in two seconds instead of an afternoon.

### When it goes wrong

- **Wrong number, right structure:** compare this month's CHECKS block against last month's before editing a single formula.
- **File will not open:** File → Open → the arrow beside Open → **Open and Repair**. If it opens, save it under a new name immediately.
- **A formula was overwritten:** version history from the previous lesson, not memory.
- **Excel crashed:** File → Info → Manage Workbook → Recover Unsaved Workbooks.

### Automate the button, not the judgement

Record a macro (View → Macros → Record Macro) for the mechanical part: refresh, wait, recalculate, stamp the date, set the print area. Assign it to a shape on the report tab labelled "Run monthly report" and save the file as \`.xlsm\`.

\`\`\`
ThisWorkbook.RefreshAll
Application.CalculateUntilAsyncQueriesDone   ' wait for queries to land
Range("RefreshStamp").Value = Now
\`\`\`

What must not be automated is the variance review. A macro that refreshes and publishes with nobody reading the checks will cheerfully send out a report built from a duplicated file. Automate the steps that are identical every month; keep the judgement manual.

### Keep a change log

Three columns on the \`Runbook\` sheet — date, what changed, who changed it. "2026-07-04, added SKU mapping for the new drinks range, Hafsa." When a figure shifts three months later and nobody can explain it, that log is usually the whole answer.

### Hand it over properly

Give someone the runbook, then watch them do the run while you say nothing. Every step you have to explain out loud is a step missing from the sheet. A process one person can run is not finished; a process anyone can run is.
        `),
      ],
      [
        q("Power Pivot refuses to create a relationship between Sales[SKU] and Products[SKU]. Why?", [
          "The tables sit on different sheets",
          "Products[SKU] contains duplicates or blanks, so it cannot be the 'one' side",
          "Sales has too many rows",
          "Relationships require a numeric key",
        ], 1, "A relationship needs one side to be a unique key, and Excel refuses rather than guessing which duplicate row to match."),
        q("You delete the raw data sheet, keep the PivotTable built from it, and email the file. The risk is:", [
          "The pivot will show #REF!",
          "Nothing — the data is gone with the sheet",
          "The file becomes too large to send",
          "Double-clicking a value rebuilds the underlying rows from the pivot cache",
        ], 3, "A PivotTable stores a full copy of its source, so Show Details reproduces records the sender believed were deleted."),
        q("Which actually stops someone opening a workbook and reading it?", [
          "File → Info → Protect Workbook → Encrypt with Password",
          "Review → Protect Sheet with a password",
          "Hiding every sheet",
          "Marking the file read-only",
        ], 0, "Only encryption secures the contents; sheet protection prevents accidents and is removed in seconds."),
        q("After Refresh All the PivotTables show last month's figures while the query table is current. Why?", [
          "The pivots must be rebuilt from scratch",
          "The Data Model cannot be refreshed",
          "Background refresh let the pivots update before the query finished",
          "The source folder path changed",
        ], 2, "With background refresh enabled the pivots read the previous query result, so untick it in the query properties to force the steps to run in order."),
      ]
    ),
  ],
  final: [
    q("=C2*G1 copied down returns zeros below the first row. The fix is:", [
      "Format as number",
      "Use $G$1 so the reference does not move",
      "Add IFERROR",
      "Convert to a Table",
    ], 1, "The relative reference walks down to empty cells; absolute locking keeps it pointed at the rate."),
    q("SUM ignores a column of numeric-looking values. Why?", [
      "They are stored as text",
      "The range is wrong",
      "They are negative",
      "SUM needs a Table",
    ], 0, "Text-formatted numbers are skipped by SUM; they align left and ISNUMBER returns FALSE."),
    q("Which VLOOKUP argument prevents silently wrong matches?", [
      "The table array",
      "col_index_num",
      "FALSE as the fourth argument",
      "A named range",
    ], 2, "Without FALSE it defaults to approximate matching and returns the nearest value with no error."),
    q("What breaks a VLOOKUP when a column is inserted into the source?", [
      "The lookup value changes",
      "col_index_num is positional, so it now points at a different field",
      "The range shrinks",
      "Nothing breaks",
    ], 1, "Positional indexes do not track structural changes, and the wrong field is returned without any error."),
    q("XLOOKUP's advantage over VLOOKUP includes:", [
      "It is the only one that works on Tables",
      "Exact match by default, any direction, and column references by name",
      "It sorts automatically",
      "It requires no lookup array",
    ], 1, "Those three differences remove the main ways VLOOKUP silently fails."),
    q("You filter a list and the total under the column is unchanged. Which function produced it?", [
      "SUBTOTAL(109, …)",
      "SUM",
      "AGGREGATE(9, 5, …)",
      "A Table Total Row, which is built on SUBTOTAL",
    ], 1, "SUM totals the whole range regardless of filtering; the other three all ignore rows the filter hides."),
    q("A PivotTable shows outdated figures. Why?", [
      "It caches a snapshot until refreshed",
      "The source is filtered",
      "Grouping is applied",
      "Slicers block updates",
    ], 0, "PivotTables do not auto-refresh; enable refresh-on-open before presenting."),
    q("Starting a column chart's y-axis above zero does what?", [
      "Nothing meaningful",
      "Exaggerates differences, because bar length encodes magnitude",
      "Improves readability",
      "Is required for large values",
    ], 1, "Length is read as quantity, so a non-zero baseline overstates the difference between values."),
    q("Duplicate keys in a lookup source cause what?", [
      "An error",
      "The first match returned silently, later ones ignored",
      "Values summed together",
      "A #N/A result",
    ], 1, "The result is quietly wrong, which is why duplicate keys should be checked before merging."),
    q("'Conversion up 200%' based on 1 sale rising to 3 is an example of:", [
      "Correlation vs causation",
      "A percentage on a tiny denominator",
      "A truncated axis",
      "Double counting",
    ], 1, "Small-base percentages are dominated by noise and must be shown with the underlying counts."),
    q("What does the # in =SUM(F2#) refer to?", [
      "A comment marker",
      "An absolute reference",
      "The whole spill range produced by F2's formula, however it resizes",
      "A placeholder for an error value",
    ], 2, "The spill operator always covers the current result, so the summary follows the data instead of going stale like a fixed range."),
    q("Whole-column references such as SUMIFS(A:A, B:B, …) copied down thousands of rows cause what?", [
      "Excel evaluating over a million rows per formula, which is why the file crawls",
      "A #REF! error",
      "Incorrect totals",
      "Nothing — they are equivalent to Table columns",
    ], 0, "The totals are right but the work is enormous; Table columns cover only the rows that actually exist."),
    q("Time-intelligence measures such as SAMEPERIODLASTYEAR return blank. What is missing?", [
      "A slicer",
      "Manual calculation mode",
      "A PivotTable filter",
      "A dedicated Calendar table, related and marked as the date table",
    ], 3, "DAX time functions need a continuous date table to walk along; dates living only inside the fact table are not enough."),
    q("Which step strips hidden sheets, comments and author metadata before a file is sent out?", [
      "Save As CSV",
      "File → Info → Check for Issues → Inspect Document",
      "Review → Protect Sheet",
      "Data → Edit Links → Break Links",
    ], 1, "Document Inspector removes the content that hiding merely conceals, which is what makes hidden columns and comments leak."),
  ],
});
