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
        `,
        [
          q("You copy a formula containing G$1 one column to the right and two rows down. What does that reference become?", [
            "H$1",
            "$H$1",
            "G1",
            "G3",
          ], 0, "The $ locks only what follows it, so the row stays on 1 while the column shifts with the copy."),
          q("Why is =C2*TaxRate preferable to =C2*$G$1 in a file someone else will maintain?", [
            "Named ranges work in older versions of Excel",
            "Named ranges calculate faster",
            "A name is absolute automatically and says what the formula means",
            "$ signs stop working when a sheet is copied",
          ], 2, "Both point at the same cell, but only the name carries the meaning and it needs no dollar signs to stay put."),
          q("Prices run down column A and units across row 1. Which single formula fills the whole grid correctly?", [
            "=$A$2*$B$1",
            "=$A2*B$1",
            "=A$2*$B1",
            "=A2*B1",
          ], 1, "Locking the price column and the header row lets one formula move correctly in both directions at once."),
        ]
      ),
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
        `,
        [
          q("=VALUE(A2) returns #VALUE! on the text 1,250. What has to happen first?", [
            "Apply TRIM instead",
            "Test it with ISNUMBER",
            "Format the cell as Number",
            "Strip the thousands separator with SUBSTITUTE",
          ], 3, "VALUE cannot parse the comma, so the separator has to be removed before the conversion."),
          q("A cell you believe holds a date shows 46082 when formatted as General. What does that tell you?", [
            "It holds text, not a date",
            "It is a genuine date — dates are stored as serial numbers",
            "The regional setting is wrong",
            "The cell is corrupt",
          ], 1, "Dates are numbers wearing a date format, counting days up from 1 January 1900."),
          q("Why does a city column with trailing spaces quietly split PivotTable totals?", [
            "Excel sorts spaces last",
            "PivotTables ignore text fields",
            "Lahore with a trailing space is a different value, so it becomes a second category",
            "Spaces truncate the source range",
          ], 2, "Every lookup and pivot compares the exact string, so one untrimmed value splits a category in two."),
        ]
      ),
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
        `,
        [
          q("Which prevents Lahore, lahore and Lhr all appearing in a city column?", [
            "Conditional formatting",
            "Data Validation set to List",
            "Protect Sheet",
            "A TRIM formula in a helper column",
          ], 1, "Validation stops the bad value being entered at all, which is prevention rather than repair."),
          q("What is the correct order for letting users type data but not overwrite formulas?", [
            "Hide the formula columns, then protect the workbook",
            "Password-protect the workbook structure",
            "Protect the sheet, then unlock the input cells",
            "Unlock the input cells, then Protect Sheet",
          ], 3, "Every cell is locked by default and locking only takes effect once the sheet is protected, so the inputs are unlocked first."),
          q("Which is one of the stated signals that the work has outgrown Excel?", [
            "The same manual clean-up happens every week",
            "The file uses XLOOKUP",
            "Someone has asked for a chart",
            "The workbook has more than ten sheets",
          ], 0, "Repeated manual work, concurrent editing, roughly 100,000 rows and the need for an audit trail are the four signals."),
        ]
      ),
        lesson("Sorting and Filtering Without Scrambling Your Data", 11, `
The fastest way to destroy a dataset is to select one column, click Sort A→Z, and save the file.

### What that actually does

Only the selected column moves. Every other column stays exactly where it was, so row 12's customer now sits beside row 400's invoice amount. Nothing errors, nothing is highlighted, and no key remains in the file to rebuild the original pairing from. Catch it and press Ctrl+Z. Once the file has been saved and closed, the data is gone.

Excel usually offers to **Expand the selection** — but not when a blank column separates your data (the no-blank-rows rule applies to columns too), and not when you sorted a range you had deliberately selected. Do not rely on the warning.

Two habits remove the risk entirely:

- **Sort inside a Table.** Ctrl+T first; a Table always moves whole rows.
- **Click one cell, then sort.** Never select a column first — Data → Sort works out the block for you.

And add an **ID column** — a plain 1, 2, 3 typed once — before you sort anything. Any order can then be restored by sorting on it. It costs one column and it is the only undo that survives a save.

### Sorting on more than one key

Data → Sort → Add Level:

| Level | Column | Order |
|---|---|---|
| Sort by | City | A → Z |
| Then by | Amount | Largest to Smallest |

Levels apply top down: the list groups by city, and within each city the largest order comes first. Write them in reading order and Excel handles the rest.

### Month names sort alphabetically

Apr, Aug, Dec, Feb is text sorting doing exactly what it was told. In the Sort dialog set **Order → Custom List** and pick the month list, or build your own for Bronze, Silver, Gold, Platinum. The alternative is a numeric helper column (\`=MONTH(A2)\`), which also survives being sent to someone else — custom lists live in the application, not in the file.

### The traps

| Symptom | Cause |
|---|---|
| 1, 10, 100, 2, 20 | Numbers stored as text, sorted as characters |
| Blanks at the bottom in both directions | Excel always places empty cells last |
| Only some rows moved | A filter is on, and sorting reorders visible rows only |
| The header sorted into the data | "My data has headers" was unticked |

### Filtering

**Ctrl+Shift+L** toggles the filter buttons. Beyond ticking boxes:

- **Number Filters → Greater Than**, Top 10, Above Average
- **Text Filters → Contains** for partial matches
- The search box, with **Add current selection to filter** to build one selection over several searches
- **Filter by Colour**, where fill has been used to mark rows

Watch the status bar: it reads *"12 of 480 records found"*. If that second number is not your row count, the filter range stopped at a blank row and you are filtering part of your data.

### Copying what you filtered

With an AutoFilter applied, copying a range copies **only the visible rows** — which is what everybody expects. With rows hidden **manually**, copying takes the hidden ones too and they reappear on paste. Press **Alt+;** (Go To Special → Visible cells only) before copying whenever you are not certain which situation you are in.

Deleting behaves the same way: under a filter, deleting the visible rows deletes only those. Re-check the record count before and after either operation.

### Advanced Filter

Data → Sort & Filter → Advanced extracts rows matching a criteria range to another location, and its **Unique records only** box gives a distinct list without a formula. Worth knowing for one-off extracts; anything you repeat belongs in Power Query.

Sorting and filtering change what you see. The total underneath has to agree with it — which is what SUBTOTAL is for, in the next chapter.
        `,
        [
          q("Someone selected a single column in a 500-row block, sorted it A→Z, and saved. What is the damage?", [
            "None — Excel expands the selection automatically",
            "The header row moved into the data",
            "Only that column reordered, so every row now pairs the wrong values and no key remains to rebuild it",
            "The formulas below it return #REF!",
          ], 2, "Sorting one column in isolation reorders it against all the others, and once the file is saved there is nothing left to restore the pairing from."),
          q("Months come out as Apr, Aug, Dec, Feb. Which fix also survives the file being sent to someone else?", [
            "Sorting on a numeric =MONTH() helper column",
            "Filtering rather than sorting",
            "Sorting descending instead",
            "Converting the column to real dates and hiding the year",
          ], 0, "A custom list sorts correctly but lives in the application, whereas a helper column travels inside the workbook."),
          q("You copy a block that has rows hidden manually — not by a filter. What gets pasted?", [
            "Only the visible rows",
            "Nothing, until the rows are unhidden",
            "Only the first visible row",
            "The hidden rows as well, unless you selected visible cells only with Alt+;",
          ], 3, "AutoFilter copying takes visible rows only, but manually hidden rows come along unless Go To Special → Visible cells only is used."),
        ]
      ),
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
        `,
        [
          q("=IFS(C2>=5000,\"Platinum\", C2>=2000,\"Gold\") is given the value 100. What does it return?", [
            "#N/A",
            "An empty cell",
            "Bronze",
            "0",
          ], 0, "IFS has no built-in catch-all, so an unmatched value errors until a final TRUE condition is added."),
          q("C2 is empty and the formula reads =IF(C2>1000,\"Large\",\"Standard\"). What appears, and why does it matter?", [
            "Nothing at all",
            "#VALUE!, because blanks cannot be compared",
            "Standard, because a blank counts as 0 and now looks like a genuine small order",
            "Large, because blanks sort high",
          ], 2, "Missing data is reported as a real small value, which is why the blank needs its own explicit test."),
          q("Four commission tiers are expected to change every quarter. What is the maintainable design?", [
            "A nested IF, rewritten each quarter",
            "A thresholds table looked up with XLOOKUP and match mode -1",
            "IFS with a TRUE catch-all",
            "A recorded macro",
          ], 1, "Thresholds held in cells make a rule change one edit instead of rewriting a formula down 500 rows."),
        ]
      ),
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
        `,
        [
          q("Where does the range being added go in SUMIFS?", [
            "It is inferred from the first criteria range",
            "Anywhere — the order is flexible",
            "Last, as in SUMIF",
            "First, before the criteria pairs",
          ], 3, "SUMIFS takes the sum range first and then range/criteria pairs, which is the reverse of the older SUMIF."),
          q("Which criteria string counts every city beginning with Lah?", [
            "\"Lah?\"",
            "\"Lah*\"",
            "\"<>Lah\"",
            "\"=Lah\"",
          ], 1, "The asterisk stands for any number of characters, while ? stands for exactly one."),
          q("Which counts distinct customers in modern Excel?", [
            "=COUNTA(Sales[Customer])",
            "=COUNTIF(Sales[Customer],\"*\")",
            "=COUNTA(UNIQUE(Sales[Customer]))",
            "=COUNTUNIQUE(Sales[Customer])",
          ], 2, "There is no COUNTUNIQUE; UNIQUE produces the distinct list and COUNTA measures it, without the blank problem of the SUMPRODUCT trick."),
        ]
      ),
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
        `,
        [
          q("=LEFT(A2, FIND(\"-\",A2)-1) works on most rows but one returns #VALUE!. Why?", [
            "The cell is blank",
            "That row contains no dash, so FIND fails",
            "LEFT cannot take a negative length",
            "The column is formatted as text",
          ], 1, "FIND returns #VALUE! when the character is absent, which is why the formula belongs inside IFERROR."),
          q("=TEXT(A2,\"#,##0.00\") is used to build a label. What is the catch?", [
            "It only works on dates",
            "It changes the cell's number format",
            "It rounds the source cell",
            "The result is text and will no longer sum",
          ], 3, "TEXT returns a string, so a column of formatted values stops being numeric."),
          q("A conditional formatting rule of =$E2=\"Overdue\" is applied to A2:H500. What does the $ achieve?", [
            "Every cell in a row tests the same column E, while the row still moves down",
            "It highlights column E only",
            "Nothing — the $ is optional here",
            "It makes the rule absolute so it never moves",
          ], 0, "Locking the column and leaving the row relative is what turns a single-cell test into a whole-row highlight."),
        ]
      ),
        lesson("Percentages, Growth, and Rank", 12, `
Business reporting is mostly percentages, and percentages are where the arithmetic quietly goes wrong.

### Share of total

\`\`\`
=C2/$C$21                Each row's share of the total in C21
\`\`\`

The \`$\` from Chapter 1 is doing the work: the denominator must not move as the formula copies down. Format the column as Percentage rather than multiplying by 100 yourself — a cell holding 0.153 and displaying 15.3% still adds up, and a cell holding 15.3 does not.

**The formatting trap:** a cell that already contains 15, formatted afterwards as Percentage, becomes **1500%**. Percent format multiplies the display by 100; the stored value was never a rate. Rates are stored as decimals.

### Percentage change

\`\`\`
=(C2-B2)/ABS(B2)
\`\`\`

New minus old, over old. \`ABS\` matters as soon as the old value can be negative: a loss of -200 improving to -100 is a gain, and dividing by -200 flips the sign on every such row.

Zero is not simply a small number here. Growth from 0 to 5 is not 500% and not infinite — it is undefined, and the honest output says so:

\`\`\`
=IF(B2=0, "n/a", (C2-B2)/ABS(B2))
\`\`\`

Wrapping it in \`IFERROR(...,1)\` to make \`#DIV/0!\` disappear reports 100% growth for every brand-new category, and those rows then float straight to the top of the fastest-growing list.

### Percentage points

Margin moves from 20% to 25%. That is **5 percentage points**, and also a **25% increase** in the margin. Both are true and only one is what your reader assumed. Write "up 5pp (20% → 25%)" and the ambiguity disappears.

### Reversing a discount

An item costs 800 after a 20% discount. The list price was not 960.

\`\`\`
=800*1.2   → 960      wrong
=800/0.8   → 1,000    right
\`\`\`

To remove a percentage, divide by (1 - rate); to strip a markup or a tax, divide by (1 + rate), so \`=B2/(1+$G$1)\` takes 17% sales tax out of a gross figure. Multiplying back by the same rate is the most common piece of bad arithmetic in commercial spreadsheets.

### Compound growth

Revenue of 2,000,000 grows to 3,500,000 over three years. The annual rate is not 75%/3:

\`\`\`
=(3500000/2000000)^(1/3)-1        → 20.5%
=(End/Start)^(1/Years)-1           CAGR
\`\`\`

For the same reason, the average of twelve monthly growth rates is not the year's growth. Up 50% then down 50% averages 0% and leaves you at 75. Use \`=GEOMEAN(1+range)-1\`, or simply compare the endpoints.

### Averages of ratios do not work either

| Product | Revenue | Profit | Margin |
|---|---|---|---|
| A | 100,000 | 5,000 | 5% |
| B | 2,000 | 800 | 40% |
| **Total** | **102,000** | **5,800** | **5.7%** |

The average of 5% and 40% is 22.5%, which is the margin of nothing at all. A ratio is total over total, never the average of the ratios. This one reaches board packs regularly.

### Rank and top-n

\`\`\`
=RANK.EQ(C2,$C$2:$C$500)                          1, 2, 2, 4 — ties share a rank
=RANK.EQ(C2,$C$2:$C$500)+COUNTIF($C$2:C2,C2)-1    Unique ranks, ties split by row order
=LARGE($C$2:$C$500,3)                             Third largest value
=SMALL($C$2:$C$500,1)                             Smallest value
\`\`\`

Note the expanding range \`$C$2:C2\` in the tiebreak — it counts how many equal values have already appeared above this row.

### Averages that describe the data

\`\`\`
=AVERAGE(range)                Pulled about by outliers
=MEDIAN(range)                 The typical order
=PERCENTILE.INC(range,0.9)     The size the top tenth exceed
\`\`\`

When the mean and the median are far apart the distribution is skewed and the mean is the wrong summary. Quote both, or quote the median and say why.
        `,
        [
          q("A jacket costs 800 after a 20% discount. What was the list price?", [
            "840",
            "960",
            "1,000",
            "1,024",
          ], 2, "Removing a percentage means dividing by (1 - rate), so 800/0.8 = 1,000, while multiplying back by 1.2 gives 960."),
          q("Product A: revenue 100,000 and profit 5,000. Product B: revenue 2,000 and profit 800. What is the combined margin?", [
            "5.7%",
            "40%",
            "5%",
            "22.5%",
          ], 0, "A ratio is total profit over total revenue — 5,800/102,000 — not the average of the two product margins."),
          q("A category sold nothing last month and 5 units this month. What should the growth column show?", [
            "500%",
            "100%",
            "0%",
            "n/a, because growth from zero is undefined",
          ], 3, "Dividing by zero has no meaningful answer, and forcing one with IFERROR puts every new category at the top of the fastest-growing list."),
        ]
      ),
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
        `,
        [
          q("A VLOOKUP over a four-column range returns #REF!. What is wrong?", [
            "col_index_num is larger than the range is wide",
            "The range is not sorted",
            "The fourth argument is FALSE",
            "The lookup value is missing from the source",
          ], 0, "#REF! means a column outside the table array was requested; below 1 gives #VALUE! and a genuine miss gives #N/A."),
          q("In =INDEX(Products[Price], MATCH(A2, Products[SKU], 0)), what does MATCH contribute?", [
            "Only the exact-match flag",
            "The value to return",
            "The position of the matching row",
            "The column to read from",
          ], 2, "MATCH finds which row the key sits on, and INDEX returns the value at that row of the chosen column."),
          q("A lookup returns #N/A although you can see the value in the source. What do you check first?", [
            "Whether the source is sorted",
            "Whether the key has stray spaces, or is text on one side and a number on the other",
            "Whether col_index_num is 1",
            "Whether the sheet is protected",
          ], 1, "Most #N/A results are mismatches rather than missing rows, and COUNTIF and EXACT expose them."),
        ]
      ),
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
        `,
        [
          q("Why does a two-key lookup concatenate with a separator, as in A2&\"|\"&B2?", [
            "XLOOKUP requires a pipe character",
            "It speeds up the match",
            "It makes the formula easier to read",
            "Without it, different pairs of values can build the same key and match the wrong row",
          ], 3, "AB joined to 1 and A joined to B1 both produce AB1, so the collision is silent."),
          q("How does XLOOKUP's if_not_found argument differ from wrapping the formula in IFERROR?", [
            "It is faster to calculate",
            "It only catches a genuine miss, whereas IFERROR also hides real formula errors",
            "It returns 0 rather than text",
            "There is no practical difference",
          ], 1, "IFERROR swallows #VALUE! and #REF! as well, so problems you would want to see disappear."),
          q("The file has to open in Excel 2019. Which lookup do you build?", [
            "XLOOKUP",
            "FILTER",
            "INDEX/MATCH",
            "VLOOKUP with TRUE",
          ], 2, "XLOOKUP is unavailable there, and INDEX/MATCH gives the same column-by-name safety in older versions."),
        ]
      ),
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
        `,
        [
          q("What is the difference between =VSTACK(Jan, Feb) and =VSTACK(Jan[#All], Feb[#All])?", [
            "Nothing — they are equivalent",
            "The bare table name stacks data only, while [#All] pushes each table's header row into the middle of the result",
            "[#All] is faster on large tables",
            "The bare name returns only the first column",
          ], 1, "A bare Table name means its data body, which is why the headers appear once at the top."),
          q("You compare the CRM list against the invoice list in one direction only. What do you miss?", [
            "Formatting differences",
            "Nothing, if the row counts agree",
            "Duplicate keys",
            "Every record present in the invoice list but absent from the CRM",
          ], 3, "Reconciliation has two sides, and checking one of them finds only half the discrepancies."),
          q("Why put the row-count and matched/unmatched checks on the report itself?", [
            "So the file catches its own failure without anyone remembering to verify",
            "It makes the refresh faster",
            "It replaces the need for source data",
            "It looks more professional",
          ], 0, "A check built into the file still runs when someone else refreshes it, which is exactly when a manual check is skipped."),
        ]
      ),
        lesson("When the Keys Do Not Match", 12, `
A join fails for one of two reasons: the record genuinely is not there, or the key is written differently on each side. Establish which before writing anything.

\`\`\`
=COUNTIF(Products[SKU], A2)      0 = absent, 1 = present, >1 = duplicate
\`\`\`

If that returns 1 and the lookup still fails, the keys differ in a way you cannot see.

### Normalise into a key column, never in place

Add a helper column on **both** sides. Never edit the raw values — you will need them to explain yourself later, and the three-layer rule from Chapter 1 exists for exactly this.

\`\`\`
=UPPER(TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " "))))
\`\`\`

Working outwards: \`SUBSTITUTE(A2, CHAR(160), " ")\` converts the non-breaking space that arrives with anything copied from a web page or a PDF. **\`TRIM\` does not remove it** — \`TRIM\` handles character 32, and this is character 160 — which is the whole explanation for "I trimmed it and it still will not match". \`CLEAN\` strips control characters, \`TRIM\` collapses ordinary spacing, \`UPPER\` removes case differences.

Then the type problem:

\`\`\`
=ISNUMBER(A2)                 TRUE on one side and FALSE on the other means never a match
=A2&""                        Force both sides to text
=TEXT(A2,"00000")             Restore leading zeros a CSV stripped
\`\`\`

An order number that is the text \`00123\` in one export and the number \`123\` in the other will never match, and neither value looks wrong on screen.

### Match on IDs, not names

"Khan Traders", "Khan Traders Ltd." and "KHAN TRADERS (PVT) LTD" are one customer and three keys. If either system holds a customer ID, join on that and treat the name as a label. Names are edited by people; IDs are not.

### Wildcards, carefully

\`XLOOKUP\`'s fifth argument accepts \`2\` for wildcard mode:

\`\`\`
=XLOOKUP("*"&A2&"*", Master[Name], Master[ID], "No match", 2)
\`\`\`

The first match wins, so "Khan Trading Co" is returned just as readily as "Khan Traders". Use this to **produce candidates for review**, in a column headed as such — never to attach a payment to an account.

### The crosswalk table

The professional answer to messy keys is not a cleverer formula. It is a small mapping table that a person owns:

| Raw | Canonical | Added by | Date |
|---|---|---|---|
| KHAN TRADERS (PVT) LTD | Khan Traders Ltd | Hafsa | 2026-07-04 |
| Khan Traders | Khan Traders Ltd | Hafsa | 2026-07-04 |

Look through it first, then into the master:

\`\`\`
=LET(
  raw, [@Customer],
  key, XLOOKUP(raw, Map[Raw], Map[Canonical], raw),
  XLOOKUP(key, Master[Name], Master[ID], "UNMATCHED")
)
\`\`\`

The fourth argument of the inner lookup is \`raw\` itself, so anything absent from the map passes straight through unchanged. Every "UNMATCHED" row is then a decision for a person: add a mapping row, or investigate. The map survives next month's refresh; a hand-edit of this month's data does not.

### Check what the join did to the row count

\`\`\`
Rows before     =ROWS(Sales)
Rows after      =ROWS(Result)
Match rate      =1-COUNTIF(D:D,"UNMATCHED")/ROWS(Sales)
\`\`\`

If the row count grew, the key was not unique on the lookup side, rows have been duplicated, and every total is now inflated. If it shrank, rows were dropped. Both happen silently, which is why the count is compared rather than assumed.

Agree the acceptable match rate before you start. "We proceed above 99% and stop below it" is a decision made calmly in advance; at 94% on the morning the report is due, it becomes a negotiation with yourself.
        `,
        [
          q("A key was copied from a web page. TRIM and UPPER have been applied to both sides and it still will not match. What is left?", [
            "Case sensitivity in the lookup",
            "The source table is not sorted",
            "A non-breaking space, CHAR(160), which TRIM does not remove",
            "A trailing full stop",
          ], 2, "TRIM only strips character 32, so the character 160 that arrives with web and PDF text has to be substituted out first."),
          q("Why does a wildcard XLOOKUP belong in a column headed \"candidate\" rather than in a payment file?", [
            "The first match wins, so a similar but different customer is returned with no warning",
            "Wildcards do not work against Table columns",
            "It returns an array rather than a value",
            "Wildcard matching is slow on large tables",
          ], 0, "Wildcard matching cannot tell Khan Traders from Khan Trading Co, so its output is a suggestion for a person to confirm."),
          q("After a join, the result has more rows than the source. What happened?", [
            "Rows were dropped and the count is misread",
            "The map table was applied twice",
            "Nothing — a join always adds a header row",
            "The lookup key was not unique on the lookup side, so rows were duplicated and every total is inflated",
          ], 3, "A one-to-many match multiplies rows silently, which is why the row count is compared before and after."),
        ]
      ),
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
        `,
        [
          q("Cities are in Rows and months in Columns. Which Show Values As answers \"what share of each city's sales fell in each month?\"", [
            "% of Row Total",
            "Running Total In",
            "% Difference From",
            "% of Grand Total",
          ], 0, "% of Row Total expresses each cell against its own row, which is the composition within one city."),
          q("Distinct Count is missing from Value Field Settings. Why?", [
            "Distinct Count works only on date fields",
            "The field contains text",
            "The PivotTable was not created with Add this data to the Data Model ticked",
            "The source is a Table rather than a range",
          ], 2, "Distinct Count is a Data Model feature and only appears when the pivot was built with that option."),
          q("One set of slicers filters four PivotTables at once. What made that work?", [
            "Copying the slicer beside each pivot",
            "Report Connections, which links one slicer to several PivotTables",
            "A macro attached to the slicer",
            "Placing all four pivots on the same sheet",
          ], 1, "Report Connections attaches a slicer to multiple pivots, which is an interactive dashboard with no VBA involved."),
        ]
      ),
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
        `,
        [
          q("Twelve product names, several of them long. Which chart form?", [
            "Pie chart",
            "3-D column chart",
            "Column chart with rotated labels",
            "Horizontal bar chart",
          ], 3, "Horizontal bars give long labels a full line of readable space instead of rotating them."),
          q("When should bars be left in alphabetical order?", [
            "Never, under any circumstances",
            "When the category order itself carries meaning, such as sizes or stages",
            "Whenever there are more than ten bars",
            "Always — it makes a category easier to find",
          ], 1, "Sorting by value is usually the insight, so the original order is kept only when the sequence means something."),
          q("You have nine series to show over time. What is the recommended approach?", [
            "A stacked area chart",
            "One chart with nine lines and a legend",
            "Small multiples — several small charts instead of one crowded one",
            "A 3-D chart, to separate the series visually",
          ], 2, "Beyond about five series a single chart stops being readable, and small multiples keep each one legible."),
        ]
      ),
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
        `,
        [
          q("Which tool answers \"how many units must we sell for profit to reach 500,000?\"", [
            "A Data Table",
            "Goal Seek",
            "Scenario Manager",
            "Trace Precedents",
          ], 1, "Goal Seek sets a target result and solves backwards for one changing input cell."),
          q("You want profit shown at every margin from 8% to 20%. Which tool?", [
            "Conditional formatting",
            "Goal Seek",
            "Scenario Manager",
            "A Data Table",
          ], 3, "A Data Table recomputes one formula across a whole range of input values at once."),
          q("A total looks wrong and you need to see which cells feed it. Which tool?", [
            "Trace Precedents",
            "Trace Dependents",
            "Goal Seek",
            "Scenario Manager",
          ], 0, "Precedents are the cells a formula reads; dependents are the cells that read it."),
        ]
      ),
        lesson("Pivot Layouts, Calculated Fields, and GETPIVOTDATA", 12, `
A PivotTable built to be read and one built to feed other formulas are laid out differently, and the defaults suit neither job particularly well.

### Make it a real table

Design → Report Layout:

| Layout | What you get |
|---|---|
| Compact (default) | Every row field stacked into one column headed "Row Labels" |
| Outline | One column per field, values indented |
| **Tabular Form** | One column per field, with the field name as its header |

Tabular Form plus **Repeat All Item Labels** produces a rectangle with a proper header row and no blanks — the shape a lookup, a chart, or another pivot can actually read. Then Design → Subtotals → Do Not Show Subtotals, and Grand Totals off, whenever the pivot is feeding something rather than being read.

Set it once for every new pivot: File → Options → Data → Edit Default Layout.

### Sorting and Top N inside the pivot

Right-click a value → Sort → Largest to Smallest sorts by the numbers rather than the labels, and it holds through a refresh. The row field dropdown → **Value Filters → Top 10** takes the top *n* by any value field; set it to 5 and the pivot maintains its own top-five list as the data changes.

### Calculated fields, and the trap

PivotTable Analyze → Fields, Items & Sets → **Calculated Field**. A field named Margin with the formula \`=Profit/Revenue\` behaves correctly: the pivot sums Profit, sums Revenue, then divides — the weighted margin, which is exactly what the average-of-ratios warning in Chapter 2 demands.

Now try \`=Price*Quantity\`:

| Row | Price | Quantity | True line total |
|---|---|---|---|
| 1 | 100 | 2 | 200 |
| 2 | 50 | 10 | 500 |
| **Total** | **150** | **12** | **700** |

The calculated field reports **1,800**. It multiplied 150 by 12.

**A calculated field aggregates first and calculates second.** Any formula that is not linear — a product of two fields, a MAX, a conditional — must be a helper column in the source data or a measure in the Data Model, never a calculated field.

Calculated **Items** are worse: they insert a computed row inside a field, are counted in some totals and not others, and slow the pivot noticeably. Avoid them. Neither exists when the pivot is built on the Data Model, where you write measures instead and this behaviour does not arise.

### GETPIVOTDATA

Click a pivot cell while writing a formula and Excel hands you this instead of a reference:

\`\`\`
=GETPIVOTDATA("Amount",$A$3,"City","Lahore","Month","Jul")
\`\`\`

Most people switch it off — PivotTable Analyze → the Options dropdown → untick Generate GetPivotData — because it will not drag across cells. That is the wrong instinct for a dashboard. Feed the arguments from cells and it drags perfectly well:

\`\`\`
=GETPIVOTDATA("Amount",$A$3,"City",$A10,"Month",B$9)
\`\`\`

It fetches **by label**, so it keeps returning Lahore's July figure however the pivot resorts or resizes. A plain \`=D14\` silently reads whichever city has moved into row 14. And when Lahore leaves the data altogether, GETPIVOTDATA returns \`#REF!\` rather than quietly handing someone another city's number.

### Two things that catch everyone

**"Cannot group that selection"** on a date field means the column contains blanks or text — the dirty-data diagnostic from Chapter 1, raised by a different feature.

**Grouping one pivot regroups another.** Two pivots built from the same source share a cache, so grouping dates into quarters in one applies it to both, and refreshing one refreshes both. Build the second from a separate Table when they need to stay independent.
        `,
        [
          q("A calculated field of =Price*Quantity reports 1,800 where the true total is 700. Why?", [
            "The pivot needs refreshing",
            "It skipped a row with a blank price",
            "It multiplied the sum of Price by the sum of Quantity",
            "Price is stored as text",
          ], 2, "Calculated fields aggregate first and calculate second, so any row-level product belongs in a helper column or a measure."),
          q("Which layout produces a rectangle another formula can read?", [
            "Tabular Form with Repeat All Item Labels",
            "Compact with subtotals switched off",
            "Compact",
            "Outline",
          ], 0, "Tabular Form gives one headed column per field, and repeating the labels removes the blanks that break lookups."),
          q("Why keep GETPIVOTDATA for a dashboard cell instead of a plain =D14 reference?", [
            "It refreshes the PivotTable automatically",
            "It can be dragged, which =D14 cannot",
            "It calculates faster than a direct reference",
            "It fetches by label, so it follows Lahore's figure when the pivot resorts and errors loudly if Lahore disappears",
          ], 3, "A positional reference silently reads whichever city has moved into that row after a refresh."),
        ]
      ),
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
        `,
        [
          q("Why rename a step to \"Removed cancelled orders\" instead of leaving it as \"Filtered Rows\"?", [
            "The step list is the only documentation of what the transformation does and why",
            "Power Query requires unique step names",
            "It prevents refresh errors",
            "Renamed steps run faster",
          ], 0, "In six months the Applied Steps list is what explains the pipeline, so the names should say why."),
          q("Twelve monthly export files sit in one folder with identical columns. What does Power Query do with them?", [
            "It merges them with a lookup on the file name",
            "Nothing — they must be pasted together first",
            "Get Data → From Folder stacks every file into a single table",
            "It converts them into one PivotTable",
          ], 2, "Pointing at the folder appends every file in it, and next month's file joins the set on Refresh."),
          q("When has the work outgrown Power Query?", [
            "When the query has more than ten steps",
            "When several people need the same cleaned data, or it must run without anyone opening a file",
            "When the source is a CSV rather than a database",
            "As soon as you start using Unpivot",
          ], 1, "Power Query still needs a person to open the workbook, which is the point at which the pipeline belongs in a database."),
        ]
      ),
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
        `,
        [
          q("What is the first thing to do before building a dashboard?", [
            "Build the PivotTables",
            "Set the print area",
            "Choose a colour scheme",
            "Write down the three to five questions the reader asks every week",
          ], 3, "Every element then has to answer one of those questions, and anything that answers none is removed."),
          q("Where does the most important number belong?", [
            "On a separate summary tab",
            "Top left",
            "Bottom right",
            "Centred under the charts",
          ], 1, "The top-left corner is read first, so the headline answer goes there."),
          q("Why stamp the refresh date on the dashboard?", [
            "It forces the file to refresh",
            "It is required before printing",
            "Readers cannot otherwise tell whether the figures are today's or last quarter's",
            "It stops other people editing the file",
          ], 2, "A dashboard whose age is unknown gets distrusted quickly, and rightly so."),
        ]
      ),
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
        `,
        [
          q("What goes first in a business readout?", [
            "The caveats",
            "The finding",
            "The method",
            "The data sources",
          ], 1, "The decision is often made in the first thirty seconds, so the conclusion leads and the support follows."),
          q("\"Repeat-customer orders fell 22%\" and \"this coincides with the March price change\" are:", [
            "Two guesses",
            "A guess and a recommendation",
            "Two findings of equal standing",
            "A finding and an inference, which must be labelled differently",
          ], 3, "Blurring what the data shows with what you infer costs credibility the moment one inference proves wrong."),
          q("Ice cream sales and drownings both rise in summer. What does that illustrate?", [
            "A third factor driving both series",
            "A small denominator",
            "A truncated axis",
            "Reverse causation",
          ], 0, "Season drives both, which is why a shared third cause has to be ruled out before claiming causation."),
        ]
      ),
        lesson("Comparing Periods Without Fooling Yourself", 12, `
Most reporting is comparison, and most comparison errors come from comparing two things that were never alike.

### Month-on-month is contaminated

July 2026 has 23 working days; August has 21. A business selling at an identical daily rate reports a **9% fall**:

\`\`\`
=SUM(JulAmounts)/NETWORKDAYS(DATE(2026,7,1),DATE(2026,7,31))     Revenue per working day
\`\`\`

Per-working-day figures remove it, and so does year-on-year, which also removes seasonality by comparing December with December rather than with November. The cost of year-on-year is a twelve-month lag: it will not show a turn that happened last month. Report both, and label which is which.

### Like-for-like

Two branches in 2025, three in 2026:

| Branch | 2025 | 2026 |
|---|---|---|
| Lahore | 1,200 | 1,150 |
| Karachi | 900 | 890 |
| Multan (opened Mar 2026) | — | 400 |
| **Total** | **2,100** | **2,440** |

Headline growth is **+16.2%**. Like-for-like — the two branches trading in both years — is 2,040 against 2,100, or **-2.9%**. The existing business is shrinking and the group is buying growth by opening branches. Both numbers are true; only one answers "is what we already had getting better?"

Always state the basis: which units are included and why.

### Mix shifts

Every product's price fell, and the average price rose:

| Product | Units 2025 | Price 2025 | Units 2026 | Price 2026 |
|---|---|---|---|---|
| Standard | 900 | 100 | 400 | 95 |
| Premium | 100 | 500 | 600 | 480 |
| **Average price** | | **140** | | **326** |

Nothing is wrong with the arithmetic. The mix moved towards the expensive product. Any average taken across a changing population is a mix effect waiting to be mistaken for a price story, so check the components before you explain the total.

### Smooth before you conclude

\`\`\`
D4:   =AVERAGE(C2:C4)         Trailing 3-month, from the third month onward
D13:  =AVERAGE(C2:C13)        Trailing 12-month, which removes seasonality entirely
\`\`\`

A trailing average lags. It sits about half its window behind the data, so a 12-month average turns roughly six months after the business does. That is the price of the smoothing, and the smoothed line must never be presented as the current level.

### Index to 100 to compare shapes

Series of very different sizes cannot usefully share an axis:

\`\`\`
=C2/$C$2*100
\`\`\`

A region worth 40,000 and one worth 4,000,000 now sit on one chart, and the question becomes "which grew faster", which was what you meant.

### The partial period

Today is the 12th. Month-to-date against last month's full total always shows a collapse. Compare the same number of days:

\`\`\`
=SUMIFS(Sales[Amount], Sales[Date],">="&EOMONTH(TODAY(),-1)+1, Sales[Date],"<="&TODAY())
=SUMIFS(Sales[Amount], Sales[Date],">="&EOMONTH(TODAY(),-2)+1, Sales[Date],"<="&EDATE(TODAY(),-1))
\`\`\`

Then label it "1-12 July vs 1-12 June" on the chart itself, or somebody will read it as a full month and act on the fall.

### When the definition changed

If "active customer" was redefined in March, the line either side of March is two different series drawn as one. Annotate the change on the chart, or rebuild the earlier months on the new definition. A step that comes from a definition change and gets explained as performance is the most expensive kind of wrong.

### The three questions

Before presenting any comparison: same length of period, same set of things, same definition. If any answer is no, either fix it or say so in the same sentence as the number.
        `,
        [
          q("Total sales rose 16% while like-for-like sales fell 3%. What does that mean?", [
            "The two periods are different lengths",
            "One of the two figures must be miscalculated",
            "Growth came entirely from new branches while the existing ones shrank",
            "Seasonality has not been removed from the totals",
          ], 2, "Like-for-like restricts the comparison to units trading in both periods, so the whole gap is the new branch."),
          q("August revenue is 9% below July at an identical daily selling rate. What explains it?", [
            "August had 21 working days against July's 23",
            "A week of double-counted orders",
            "An unrecorded price change",
            "Seasonality in the customer base",
          ], 0, "Month length and working days move a month-on-month figure before anything in the business has changed."),
          q("What is the cost of a 12-month trailing average?", [
            "It cannot be charted alongside the raw series",
            "It removes the trend as well as the seasonality",
            "It exaggerates outliers",
            "It lags, turning about six months after the real turning point",
          ], 3, "A trailing window sits roughly half its length behind the data, so it must not be read as the current level."),
        ]
      ),
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
        `,
        [
          q("=FILTER(Sales[Amount], Sales[City]=\"Multan\") returns #CALC!. What does that mean and what fixes it?", [
            "No rows matched; supply the third argument, such as 0 or \"None\"",
            "The formula is volatile; switch to SUMIFS",
            "The result is too large; narrow the range",
            "The range is invalid; convert the source to a Table",
          ], 0, "#CALC! is an empty array, and FILTER's third argument is what to show when nothing matches."),
          q("F2 holds =SORT(UNIQUE(Sales[City])). Why write =COUNTA(F2#) rather than =COUNTA(F2:F20)?", [
            "F2# is an absolute reference",
            "F2# calculates faster",
            "F2# always covers the current spill, so a newly added city cannot be dropped from the summary",
            "F2:F20 returns an error on a spilled range",
          ], 2, "A fixed range is the stale-range bug in new clothes — the summary keeps looking complete while quietly excluding the twenty-first city."),
          q("Inside LET a name is bound to a FILTER with no third argument, and the rep has no sales. What happens to a later IF(COUNT(name)=0, ...) guard?", [
            "It returns TRUE and handles the case cleanly",
            "It never fires, because the name holds #CALC! and the error propagates",
            "It returns 0",
            "LET recalculates the filter and returns a blank",
          ], 1, "Errors travel through LET names instead of being values you can test, so the guard has to be the FILTER's own third argument."),
        ]
      ),
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
        `,
        [
          q("=SUMIFS(A:A, B:B, D2) copied down 5,000 rows returns correct totals. What is the problem?", [
            "Whole-column references are not allowed inside Tables",
            "It double counts the header row",
            "It returns #REF! on large sheets",
            "Each formula evaluates over a million rows, so the file crawls",
          ], 3, "The answers are right and the work is enormous; a Table column covers only the rows that actually exist."),
          q("What is the trade-off of saving a heavy model as .xlsb?", [
            "It loses macros",
            "It cannot be co-authored",
            "It drops PivotTables on save",
            "It cannot be opened on a Mac",
          ], 1, "The binary format keeps every feature and roughly halves the size, but co-authoring needs .xlsx."),
          q("Ctrl+End lands on row 900,000 in a sheet holding 4,000 rows. After deleting the empty rows and columns, what else is needed?", [
            "Switch calculation to Manual",
            "Nothing — the change is immediate",
            "Save, close and reopen, because the used range only resets then",
            "Convert the block to a Table",
          ], 2, "The used range is stored in the file and is only rebuilt when the workbook is reopened."),
        ]
      ),
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
        `,
        [
          q("\"The total is wrong but every formula looks fine.\" Which tool finds the cause fastest?", [
            "Trace Dependents",
            "Ctrl+G → Special → Constants, applied to the calculated column",
            "Evaluate Formula",
            "Name Manager",
          ], 1, "Selecting the constants inside a formula column exposes the cells where somebody typed a number over a formula."),
          q("What does a =FORMULATEXT(D2) helper column, copied down and sorted, reveal?", [
            "Circular references",
            "Broken workbook links",
            "Which cells are volatile",
            "The one row whose formula differs from the pattern",
          ], 3, "Identical formulas produce identical text, so any edited row groups itself apart when the helper column is sorted."),
          q("A link to a workbook you cannot reach shows a plausible number rather than an error. Why is that dangerous?", [
            "It is displaying the last cached value and stopped updating months ago",
            "It slows every recalculation",
            "It creates a circular reference",
            "The link will eventually turn into #REF!",
          ], 0, "Broken links look correct, which is why Data → Edit Links belongs in the audit."),
        ]
      ),
        lesson("LAMBDA: Naming Your Own Functions", 12, `
When the same ninety-character formula appears in fourteen places, fixing it means finding all fourteen. \`LAMBDA\` lets you write the logic once, give it a name, and call it like any built-in function.

### Write it, test it, then name it

A \`LAMBDA\` is a list of arguments followed by a body. On its own it does nothing; you call it by appending the arguments in a second pair of brackets:

\`\`\`
=LAMBDA(new, old, IF(old=0, "n/a", (new-old)/ABS(old)))(C2, B2)
\`\`\`

That runs in the cell and returns a number, which is how you debug it. Once it is right, delete the trailing \`(C2, B2)\`, copy what remains, and go to Formulas → **Define Name**:

- Name: \`GROWTH\`
- Comment: \`GROWTH(new, old) - percentage change, n/a when old is zero\`
- Refers to: \`=LAMBDA(new, old, IF(old=0, "n/a", (new-old)/ABS(old)))\`

Now \`=GROWTH(C2, B2)\` works anywhere in the workbook, and the comment you wrote appears in the formula autocomplete tooltip.

**Never paste an untested lambda straight into Name Manager.** A mistake there surfaces as \`#VALUE!\` in every cell that calls it, with nothing to inspect. Debug in a cell, promote afterwards.

### Keep the body readable with LET

\`\`\`
=LAMBDA(amount, rate,
  LET(
    net, amount/(1+rate),
    tax, amount-net,
    ROUND(tax, 2)
  )
)
\`\`\`

Named \`TAXPART\`, that becomes \`=TAXPART(B2, $G$1)\`, and the next person reads a name instead of decoding a division by one-plus-a-rate.

### The functions that take a LAMBDA

This is where the feature earns its place. Each of these applies your lambda across an array:

\`\`\`
=BYROW(Sales[[Q1]:[Q4]], LAMBDA(r, SUM(r)))            One total per row, spilled
=BYCOL(Sales[[Q1]:[Q4]], LAMBDA(c, MAX(c)))            One result per column
=MAP(Sales[Amount], LAMBDA(a, IF(a>1000,"Large","Standard")))
=SCAN(0, Sales[Amount], LAMBDA(acc, v, acc+v))         Running total
=REDUCE(0, Sales[Amount], LAMBDA(acc, v, acc+v))       One value from the whole column
\`\`\`

\`SCAN\` returns every intermediate result; \`REDUCE\` returns only the last. Note that the \`REDUCE\` above is a slow way to write \`SUM\` — where a built-in exists, use it. \`REDUCE\` is for accumulations Excel has no function for, such as applying a list of substitutions one after another to the same string.

### Recursion

A named lambda can call itself, which is how one function cleans a key against a whole table of replacements instead of nesting twenty \`SUBSTITUTE\` calls. It is powerful and it is unlit: there is no step-through, no stack view, and a mistake gives you a hung recalculation. Keep recursive lambdas short and give each one a depth guard.

### Where lambdas go wrong

- **They travel with the workbook, not with the formula.** Paste \`=GROWTH(C2,B2)\` into a different file and it is \`#NAME?\`. Copy the sheet instead — names come with it.
- **They need Microsoft 365.** Excel 2021 has \`LET\` but not \`LAMBDA\`, so the whole model reads \`#NAME?\` there. It is the same version question as everywhere else in this chapter.
- **They hide policy.** A lambda should be a *function* — a growth rate, a tax split, a key cleaner. It is not where commission tiers belong; thresholds go in a table somebody can read without opening Name Manager.

### A reasonable house rule

Promote a formula to a lambda when it appears three times, or when it is longer than one readable line. Name it after what it returns rather than how it works. Then list every lambda on the Notes sheet from Chapter 1 with a one-line description — an undocumented custom function is a dependency nobody knows the file has.
        `,
        [
          q("Why write =LAMBDA(...)(C2,B2) in a cell before defining the name?", [
            "The arguments are otherwise stored in the wrong order",
            "Named lambdas cannot contain LET",
            "It is the only way to debug it — a faulty lambda in Name Manager gives #VALUE! everywhere with nothing to inspect",
            "Excel refuses to save a name that has never been called",
          ], 2, "The trailing call form runs the lambda in place, so mistakes are fixed while the result is still visible."),
          q("Which returns a running total down a column?", [
            "=SCAN(0, Sales[Amount], LAMBDA(acc,v,acc+v))",
            "=MAP(Sales[Amount], LAMBDA(a, SUM(a)))",
            "=REDUCE(0, Sales[Amount], LAMBDA(acc,v,acc+v))",
            "=BYROW(Sales[Amount], LAMBDA(r, SUM(r)))",
          ], 0, "SCAN returns every intermediate accumulation, whereas REDUCE returns only the final one."),
          q("You paste =GROWTH(C2,B2) into a different workbook. What happens?", [
            "Excel recreates the name automatically on paste",
            "#VALUE!, because the arguments do not carry across",
            "It works — lambda names are global to the installation",
            "#NAME?, because the name lives in the workbook where it was defined",
          ], 3, "Names travel with the workbook or with a copied sheet, never with a pasted formula."),
        ]
      ),
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
        `,
        [
          q("Why is Avg Order := DIVIDE([Total Sales],[Orders]) correct in every cell of a PivotTable?", [
            "A measure is evaluated inside whatever filters apply to the cell being drawn",
            "It is recalculated whenever the model refreshes",
            "It is stored once per row of the fact table",
            "Because it uses DIVIDE rather than /",
          ], 0, "Filter context is what makes one definition correct at city, month and grand-total level alike."),
          q("Why should dimension tables join only to the fact table?", [
            "It makes the refresh faster",
            "Excel allows a maximum of one relationship per table",
            "Joining a dimension to another dimension creates ambiguous paths and wrong totals",
            "Dimension tables cannot be related to each other at all",
          ], 2, "The star shape keeps a single unambiguous path from every dimension to the facts."),
          q("What does DIVIDE give you that / does not?", [
            "Support for text operands",
            "A blank result instead of #DIV/0!",
            "Automatic rounding",
            "Faster evaluation",
          ], 1, "A blank keeps the pivot readable wherever the denominator is zero or missing."),
        ]
      ),
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
        `,
        [
          q("Before emailing a workbook that links to Budget.xlsx on your desktop, what do you do?", [
            "Hide the sheets that contain the links",
            "Protect the workbook structure",
            "Nothing — links resolve automatically at the other end",
            "Data → Edit Links → Break Links, working on a copy",
          ], 3, "Breaking links converts the formulas to their current values and cannot be undone, so it is done on a copy."),
          q("A table of region, job title and salary with one row per person is not anonymous. Why?", [
            "Region counts as personal data by itself",
            "The combination of attributes identifies individuals, especially in small groups",
            "Salary is always confidential regardless of format",
            "The file has not been encrypted",
          ], 1, "Aggregation is only anonymity when each group is large enough — under about five rows, people are identifiable."),
          q("What does a CSV round trip cost you?", [
            "Nothing, provided the file is small",
            "Just the header row",
            "Formulas, formatting and every sheet but one, plus leading zeros and locale-safe dates",
            "Only the cell formatting",
          ], 2, "CSV holds one sheet of plain values, so 00123 returns as 123 and every date is re-read by locale."),
        ]
      ),
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
        `,
        [
          q("Why does the CHECKS block carry a Sum of regions row directly under the grand total?", [
            "To make the block look complete",
            "A total can only be reconciled against a figure built a different way",
            "Because regions refresh on a separate query",
            "It is required for the PDF export",
          ], 1, "Two independent routes to the same number is what makes the check meaningful."),
          q("One region's figures are almost exactly double last month's. What do you suspect first?", [
            "A broken formula in the region column",
            "A currency conversion change",
            "A price increase",
            "A duplicate file left in the drop folder",
          ], 3, "An almost-exact doubling is nearly always double-loaded data rather than a sales record."),
          q("Which part of the monthly run must stay manual?", [
            "The variance review",
            "Refreshing the queries",
            "Stamping the refresh date",
            "Setting the print area",
          ], 0, "A macro will cheerfully publish a report built from a duplicated file; the judgement is what a person is there for."),
        ]
      ),
        lesson("Connecting to a Live Data Source", 12, `
A monthly CSV sitting in a folder is a copy of the truth that was already out of date when it was written. Connecting Excel to the system that produced it removes the export step, and introduces a different set of things to get right.

### Connect, and load almost nothing

Data → Get Data → From Database → **From SQL Server**. Give the server and database, then either pick tables or supply a query. In the navigator choose **Transform Data** rather than Load — you want to see the steps before anything arrives.

Then Close & Load To → **Only Create Connection**, with **Add this data to the Data Model** ticked. Nothing lands on a sheet. That is not a nicety: a worksheet holds 1,048,576 rows and the model holds far more, so a four-million-row fact table has nowhere else to go. Load to a sheet only the small tables a person actually reads.

### Query folding decides whether this is fast

Power Query tries to translate your steps into SQL and let the server do the work. Filter to one year and remove twenty columns and it sends a narrower \`SELECT\` with a \`WHERE\` — seconds instead of minutes.

Right-click any step → **View Native Query**. If it is greyed out, folding has stopped at that step, and everything after it is running on your laptop against the whole downloaded table.

Folding usually breaks at custom columns, index columns, and steps referencing another query. So order them:

1. Filter rows first.
2. Remove columns next.
3. Group or aggregate while it still folds.
4. Custom columns and renaming last.

A query that reorders those four steps can be twenty times slower and return exactly the same table.

### Parameters instead of hardcoded dates

Home → **Manage Parameters** → New, \`StartDate\`. Use it in a filter step rather than typing \`2026-01-01\` into a query. The date is then changed in one dialog and — unlike a hand-written SQL statement with the date pasted inside it — the filter still folds.

Avoid pasting a large hand-written query as the source at all. It works, and it turns every future change into editing SQL inside a plain text box with no formatting, no validation and no version history.

### Credentials and access

Credentials are stored per user by the Excel installation and not inside the workbook, which has two consequences.

- Sending the file never sends your access. The recipient is prompted for their own, and if they have none the refresh simply fails.
- Data → Get Data → **Data Source Settings** is where a wrong saved credential is cleared. That dialog answers most "it asks me every time" complaints.

Ask for a **read-only account limited to the tables the report needs**. Never build a shared report on your personal admin login: when your access changes the report stops, and while it works it lends everyone your permissions by proxy.

### Do not point at production carelessly

An unfiltered query against a live transactional database scans the whole table on every refresh, during business hours. Ask for a view, a reporting replica, or an off-peak window. That is a conversation with whoever owns the database, and having it before your first refresh is considerably better than after.

### What Excel cannot do

Excel refreshes when somebody opens the file and clicks. There is no built-in schedule. If the report must be current at 08:00 whether or not anyone is at a desk, the options are a Power Automate flow or an Office Script against a file in SharePoint, or moving the model into Power BI — which reads the same queries and the same measures unchanged.

That threshold is worth recognising early. Everything in this chapter still applies at that point; it simply stops being Excel's job.
        `,
        [
          q("View Native Query is greyed out halfway down the Applied Steps. What does that tell you?", [
            "The query is being served from the Data Model",
            "The connection to the server has failed",
            "Folding stopped there, so every later step runs locally against the whole downloaded table",
            "That step contains a syntax error",
          ], 2, "Once folding breaks the server stops filtering for you and the remaining work moves onto your machine."),
          q("Why load a four-million-row fact table as connection-only into the Data Model?", [
            "A worksheet holds about 1,048,576 rows, so the table physically cannot go on a sheet",
            "Connection-only queries fold better",
            "It avoids having to supply credentials",
            "Connection-only queries refresh more often",
          ], 0, "The sheet grid has a hard row limit and the model does not, so large tables go to the model and only summaries reach a sheet."),
          q("The report must be current at 08:00 whether or not anyone opens it. What does that require?", [
            "Ticking refresh on open",
            "Enabling background refresh",
            "Setting calculation to Manual and using F9",
            "Power Automate, an Office Script, or moving the model to Power BI — Excel has no built-in schedule",
          ], 3, "Excel only refreshes when a person opens the file, so any schedule has to come from outside it."),
        ]
      ),
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
      chapter(
      'Power Query Beyond the Applied Steps',
      'Writing M by hand, structuring queries so somebody else can follow them, and surviving the source changes that arrive with next month\'s file.',
      [
      lesson('Reading and Writing M by Hand', 13, `
Open Home → Advanced Editor on a query you built entirely by clicking. Fifteen minutes of point and click produce this:

\`\`\`powerquery
let
    Source = Csv.Document(File.Contents("C:\\finance\\drops\\2026-07-sales.csv"), [Delimiter=",", Encoding=65001]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers", {{"OrderDate", type date}, {"Amount", type number}}),
    #"Filtered Rows" = Table.SelectRows(#"Changed Type", each [Status] <> "Cancelled")
in
    #"Filtered Rows"
\`\`\`

That is the whole language on one screen. Applied Steps is a list view of those four lines.

### let binds names, it does not run a script

Each line binds a name to a value. Names containing spaces need \`#"..."\` quoting, which is why every generated step wears it. The word after \`in\` is the query's answer.

Everything else exists only because something downstream asks for it. Change the last line to \`in #"Changed Type"\` and the filter never runs at all. M is lazy, and a binding nobody reads is never evaluated. That catches people who expect steps to fire top to bottom like a recorded macro.

It also means the chain is yours to rewire. A step can reference any earlier step, not just the one above it, so you can branch, keep a step around for debugging, and point \`in\` wherever you like while you work.

Rename a step in the Applied Steps list and Power Query rewrites every reference to it. Type over the name in the Advanced Editor and it does not. The line below still says \`#"Filtered Rows"\`, that name no longer exists, and refresh fails.

### each is sugar for a one argument function

\`each [Status] <> "Cancelled"\` expands to \`(_) => _[Status] <> "Cancelled"\`. The underscore is the current record and a bare \`[Status]\` is field access on it. Once that clicks, custom columns stop being magic:

\`\`\`powerquery
Table.AddColumn(#"Filtered Rows", "Net", each [Amount] - [Discount], type number)
\`\`\`

Leave off the trailing \`type number\`, as the UI does every time you use the Custom Column dialog, and the column arrives typed \`any\`. Excel then guesses on load. One row containing \`N/A\` in an otherwise numeric column is enough for the whole thing to land as text, at which point the PivotTable offers Count where you wanted Sum.

### M is case sensitive

\`Text.Upper\` works. \`text.upper\` throws \`Expression.Error: The name 'text.upper' wasn't recognized\`. Field references behave the same way, so \`[amount]\` will not find \`Amount\`.

### Where writing beats clicking

| Written by the UI | Written by you | Why it matters |
|---|---|---|
| \`each [OrderDate] >= #date(2026, 4, 1)\` | \`each [OrderDate] >= Date.AddDays(Date.From(DateTime.LocalNow()), -90)\` | No literal to edit next month |
| Fifteen separate rename steps | one \`Table.RenameColumns\` with fifteen pairs | One step to read, one to fix |
| \`Table.SelectRows\` then \`Table.SelectColumns\` in click order | filter first, then columns | Folding survives, per chapter 7 |

The rolling date is the clearest case. The clicked version hardcodes 1 April 2026 into the query, somebody edits that literal every month, and in November they forget. The written version has nothing to forget.

### Two things worth knowing on day one

Create a blank query, set its formula to \`= #shared\`, then click Into Table. You get every function available in your build, searchable, each with its own documentation page. It is the fastest reference there is and it ships inside the product.

Second, read the error line properly. \`Expression.Error: The column 'Amount' of the table wasn't found\` arrives attached to a step name. Click that step, read the formula bar, and you are looking at the one line that broke rather than hunting through twenty.
      `,
        [
          q('You change a query\'s last line to in #"Changed Type" while the Filtered Rows step still sits above it. What happens on refresh?', [
            'The filter still runs, because steps execute top to bottom',
            'Refresh fails, because every named step must be referenced',
            'The filter never runs, because M evaluates only what the result needs',
            'Both tables load, one filtered and one unfiltered',
          ], 2, 'M is lazy and a let binding nobody reads is never evaluated, so a step the final expression does not depend on is simply skipped.'),
          q('A custom column is added with each [Amount] - [Discount] and no type argument. What is the real consequence?', [
            'The step fails until a type is supplied in the dialog',
            'The column arrives as any, so Excel guesses a type on load',
            'The subtraction returns text rather than a number',
            'The column is dropped the next time the query refreshes',
          ], 1, 'An untyped column is any, and Excel infers the type when it loads, so a single non-numeric value can turn the whole column into text.'),
          q('You retype the step name #"Filtered Rows" as #"Removed cancelled orders" inside the Advanced Editor. What breaks?', [
            'Nothing, because step references are resolved by position',
            'Power Query renames it back on the next refresh',
            'The query loses its credentials and prompts you again',
            'Any later line still naming the old step now fails',
          ], 3, 'Renaming in the Applied Steps list rewrites the references for you, but editing the name in the code leaves later lines pointing at a name that no longer exists.'),
        ]
      ),
      lesson('Custom Functions and a Staging Layer', 13, `
Fourteen queries, one per branch export, each carrying the same nine cleaning steps. Finance decides cancelled orders should be flagged rather than removed. You open fourteen queries, edit fourteen filter steps, and miss the two where somebody renamed the step. Karachi and Multan keep the old rule for another three months, and nobody notices until the quarter is reconciled.

### A query becomes a function by adding a signature

Take the query that already works for one file, open Advanced Editor, and put a parameter line in front of \`let\`:

\`\`\`powerquery
(filePath as text) as table =>
let
    Source = Csv.Document(File.Contents(filePath), [Delimiter=",", Encoding=65001]),
    Headers = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Headers, {{"OrderDate", type date}, {"Amount", type number}}, "en-GB"),
    Flagged = Table.AddColumn(Typed, "IsCancelled", each [Status] = "Cancelled", type logical)
in
    Flagged
\`\`\`

Name it \`fnLoadSalesFile\` and the icon changes to fx. Now invoke it across a list of files:

\`\`\`powerquery
Table.AddColumn(Files, "Data", each fnLoadSalesFile([Folder Path] & [Name]))
\`\`\`

Expand the Data column and fourteen branches arrive under one rule. The next change is one edit.

One caution with the folder pattern: the sample file query that Power Query generates for you binds to a specific file name, so the whole combine breaks the month that file leaves the folder. Point the sample at a parameter, or invoke your own function and delete the generated helper queries entirely.

The typed signature earns its keep. \`(filePath as text) as table =>\` makes a wrong argument fail at the call, naming the function, instead of surfacing as a strange error inside step six of something three layers down.

### Three layers, and the query pane shows them

Right-click in the Queries pane → New Group. Number the groups so the ordering sticks.

| Group | Contains | Loads to |
|---|---|---|
| 00 Parameters | SourceFolder, StartDate | nothing |
| 10 Sources | one query per raw source, no transformations | connection only |
| 20 Staging | typed, cleaned, renamed, one per entity | connection only |
| 30 Output | joined and shaped for the report | sheet or model |

The rules are short. A Sources query touches a data source and does nothing else. A Staging query touches no data source, only other queries. Output queries are the only ones that load anywhere. That discipline costs ten minutes and pays for itself twice, once when somebody else has to read the file, and once when the Formula Firewall starts refusing shapes that break exactly this rule.

### Reference, not Duplicate

Right-click a query and the menu offers both. Duplicate copies the code into a second query. Reference creates a query whose Source is the first one. Duplicate gives you two definitions that drift apart; Reference gives you one.

Here is the cost nobody mentions. Referencing does not cache. Three Output queries referencing \`stgSales\` means \`stgSales\`, and the source behind it, is evaluated three times in a single Refresh All. Against a local CSV that is a few seconds. Against a paged web API it is three full pulls, and the rate limit notices before you do.

Three ways out, in order of preference:

- Do the combining in one Output query instead of three.
- Load the staged table into the Data Model once and let reports read the model.
- End the staging query with \`Table.Buffer(...)\`, which holds the result in memory for that evaluation only. It does not persist between queries, and it stops folding dead, so it is a last resort rather than a habit.

### Names that survive handover

\`fnParseDate\`, \`srcOrdersSql\`, \`stgSales\`, \`outMonthlySummary\`. The prefix says what a query is for before anyone opens it, which is the difference between a file a colleague can pick up and a file they quietly rebuild.
      `,
        [
          q('Two output queries need the same cleaned sales table. Why choose Reference over Duplicate?', [
            'Reference is the only option that keeps a query connection only',
            'Reference caches the result, so the source is read just once',
            'Duplicate copies the code, so a later fix has to be made twice',
            'Duplicate cannot be used on a query that loads to the model',
          ], 2, 'Duplicate creates a second independent definition that drifts away from the first, while Reference leaves one definition that both outputs read.'),
          q('Three output queries reference one staging query that pulls from a paged web API. How many times is the API hit during Refresh All?', [
            'Once, because the staging query is connection only',
            'Once, because Power Query caches the staging result',
            'Twice, once for the sheet and once for the model',
            'Three times, once for each referencing query',
          ], 3, 'Referencing does not cache, so the staging query and everything behind it is evaluated again for every query that references it.'),
          q('What does writing the signature (filePath as text) as table => actually buy you?', [
            'A wrong argument fails at the call rather than deep inside a step',
            'The function runs faster because M can skip its type checks',
            'The function becomes callable with no arguments at all',
            'Power Query folds the function body back to the source',
          ], 0, 'Declared types are checked at the boundary, so a bad argument produces an error naming the function instead of a confusing failure several steps later.'),
        ]
      ),
      lesson('Schema Drift, Nulls, and Errors on Refresh Day', 13, `
The August export lands on the 3rd. The finance system was upgraded on the 1st, \`Amount\` is now \`Order Amount\`, and a new \`Channel\` column sits in the middle. Refresh, and Excel returns \`Expression.Error: The column 'Amount' of the table wasn't found\`. The data is fine. The query is pointing at a name that no longer exists.

### The steps the UI writes are the ones that break

Two auto-generated steps name columns explicitly, and both die on a rename:

\`\`\`powerquery
#"Changed Type" = Table.TransformColumnTypes(Source, {{"OrderDate", type date}, {"Amount", type number}}),
#"Removed Columns" = Table.RemoveColumns(#"Changed Type", {"Internal Ref"})
\`\`\`

Every column-list function takes an optional missing field behaviour:

\`\`\`powerquery
Table.RemoveColumns(Source, {"Internal Ref"}, MissingField.Ignore)
Table.SelectColumns(Source, {"OrderDate", "Amount", "Status"}, MissingField.UseNull)
\`\`\`

\`MissingField.Ignore\` means carry on without it. \`MissingField.UseNull\` means hand me the column anyway, full of nulls. Pick deliberately: Ignore suits a column you are discarding, UseNull suits one the rest of the query depends on, because the query then survives to reach a check you wrote instead of stopping at a red banner at 08:40.

Better still, absorb the rename at the top so everything below sees one name:

\`\`\`powerquery
Renamed = Table.RenameColumns(Source, {{"Order Amount", "Amount"}}, MissingField.Ignore)
\`\`\`

July's file and August's file now both produce \`Amount\`.

### null is not zero and it is not false

\`\`\`powerquery
= Table.SelectRows(Typed, each [Amount] > 1000)
\`\`\`

Where \`Amount\` is null, \`null > 1000\` evaluates to null, not false. \`Table.SelectRows\` keeps rows where the condition is true, so those 214 rows disappear with no error and no message. The same trap sits inside \`each [Region] <> "Punjab"\`, which drops every row with a blank region even though a blank is obviously not Punjab.

| Expression | Result |
|---|---|
| \`null + 5\` | null |
| \`List.Sum({1, null, 5})\` | 6 |
| \`null > 1000\` | null |
| \`null = null\` | true |
| \`"INV-" & null\` | Expression.Error |

Write the guard yourself: \`each [Amount] <> null and [Amount] > 1000\`, or replace the nulls before the filter and record how many you replaced.

### A cell error and a step error are different animals

A step error stops the refresh. A cell error sits quietly in one cell and only bites when a later step touches it, which may be next month. Right-click a column → Keep Errors to see just the offending rows with the message attached, then choose a handling:

\`\`\`powerquery
Table.AddColumn(Typed, "AmountClean", each try [Amount] otherwise 0, type number)
Table.ReplaceErrorValues(Typed, {{"Amount", 0}})
\`\`\`

Remove Errors is the dangerous one, because it deletes rows and tells nobody. If you use it, count on both sides:

\`\`\`powerquery
RowsIn = Table.RowCount(Typed),
Cleaned = Table.RemoveRowsWithErrors(Typed, {"Amount"}),
Dropped = RowsIn - Table.RowCount(Cleaned)
\`\`\`

Surface \`Dropped\` in the checks block from the monthly run rather than trusting it. Forty-seven dropped rows out of 12,480 is expected. Four thousand is a schema change nobody told you about.

### Locale is schema drift wearing a disguise

\`\`\`powerquery
Table.TransformColumnTypes(Headers, {{"OrderDate", type date}}, "en-GB")
\`\`\`

Without that third argument the conversion uses the machine's locale. \`03/04/2026\` becomes 3 April on your laptop and 4 March on a colleague's, both silently. Amounts do the same dance between \`1,234.56\` and \`1.234,56\`. Pass the culture of the file, not the culture of whoever opens the workbook.
      `,
        [
          q('A filter step reads each [Amount] > 1000, and 214 rows have a null Amount. What happens to those rows?', [
            'They are kept, because null is treated as zero here',
            'The step fails with a type mismatch error',
            'They are dropped, because null > 1000 is null and not true',
            'They are kept and marked as error values',
          ], 2, 'Comparing null with a number yields null rather than false, and Table.SelectRows keeps only rows where the condition is true, so those rows vanish silently.'),
          q('A column may or may not be present in next month\'s export, and the rest of the query needs it to exist. What handles that?', [
            'Table.SelectColumns with MissingField.UseNull',
            'Table.RemoveColumns with no third argument',
            'Changing the column type to any beforehand',
            'Turning off Detect Data Types in the options',
          ], 0, 'MissingField.UseNull returns the column full of nulls when it is absent, so downstream steps still find the name they expect instead of failing.'),
          q('The same query returns 3 April on your laptop and 4 March on a colleague\'s, with no error on either. Why?', [
            'The file was saved with a different text encoding',
            'The type change has no culture, so each machine uses its own locale',
            'One machine has background refresh switched on',
            'The date column was loaded as an any typed column',
          ], 1, 'Table.TransformColumnTypes falls back to the local machine\'s locale when no culture is supplied, so an ambiguous date parses differently on each machine.'),
        ]
      ),
      lesson('The Formula Firewall and Other Refresh Failures', 13, `
The preview pane showed the joined table. Refresh, and Excel says:

\`\`\`text
Formula.Firewall: Query 'outSales' (step 'Merged Queries') references other
queries or steps, so it may not directly access a data source.
Please rebuild this data combination.
\`\`\`

Nothing is wrong with the data. Nothing is wrong with the join. The complaint is about the shape of the query.

### What the firewall actually guards

Power Query evaluates each query inside a partition, and it refuses to let one partition both open a data source and consume data that arrived from a different source. The reason is leakage. If a customer ID from your SQL server can be concatenated into \`Web.Contents("https://api.vendor.com/lookup?id=" & id)\`, private data leaves the building inside a URL, and the engine has no way to tell your harmless case from that one.

So it rules on structure rather than content, before any data moves. That is why rewriting the join never helps, and why the error mentions steps and queries instead of columns.

### The staging layer is the fix

The shape that fails, one query doing everything:

\`\`\`powerquery
let
    Db = Sql.Database("finance-sql", "Reporting"),
    Rates = Csv.Document(File.Contents("C:\\finance\\ref\\fx-rates.csv")),
    Merged = Table.NestedJoin(Db{[Name="Orders"]}[Data], {"Currency"}, Rates, {"Currency"}, "fx")
in
    Merged
\`\`\`

Split it into three:

- \`srcOrders\` calls \`Sql.Database\` and stops.
- \`srcRates\` calls \`Csv.Document(File.Contents(...))\` and stops.
- \`outSales\` references both and joins them, touching no source directly.

Identical result, and no single query now both opens a source and reads another query's output. This is the same layering as the previous topic, which is why building it early costs you nothing later.

### Privacy levels, and the switch people reach for first

Data → Get Data → Query Options → Current Workbook → Privacy has a setting called Ignore the Privacy Levels. It makes the error go away, and it removes the guard for the entire workbook, including queries you have not written yet.

There is a genuine performance argument in the other direction. While privacy levels are active, a merge across two sources cannot fold, so the server stops filtering and the whole join runs on your machine. That is the real reason a 40 second query becomes a 40 minute one after somebody adds a small lookup file.

The honest fix is Data Source Settings → Edit Permissions, setting both sources to Organizational when they genuinely sit inside the same trust boundary. Ignoring privacy is a decision to write on the runbook sheet, not a default to leave on.

### Dynamic URLs fail a different check

\`\`\`powerquery
// refuses to refresh unattended
Source = Json.Document(Web.Contents("https://api.crm.local/v1/orders?since=" & startDate))

// static base, variable parts declared
Source = Json.Document(Web.Contents("https://api.crm.local",
    [RelativePath = "v1/orders", Query = [since = startDate]]))
\`\`\`

The first builds a different URL on every run, so the credential store cannot match it against anything you saved and the address is treated as a dynamic data source. The second keeps one stable base URL that credentials attach to, with the moving parts passed as options.

### The rest of refresh day

| Symptom | Usual cause | Fix |
|---|---|---|
| "We couldn't find the file" | a path typed into the source step | a folder parameter, edited once |
| Credentials requested every time | a stale entry saved per URL | clear it in Data Source Settings |
| Works for you, fails for a colleague | credentials are stored per user | their own read-only account |
| "The key didn't match any rows" | \`Db{[Name="Orders"]}\` and the view was renamed | fix the name in the source step |

One habit outranks all of them: never wrap a whole query in \`try ... otherwise null\`. A refresh that errors gets fixed that morning. A refresh that quietly returns an empty table gets published, and the first person to notice is whoever is reading the report.
      `,
        [
          q('Splitting one query into srcOrders, srcRates and outSales clears a Formula.Firewall error. Why does that work?', [
            'The smaller queries fold, and folding bypasses the firewall',
            'No single query now both opens a source and reads another query',
            'Connection only queries are exempt from the privacy checks',
            'The join has moved into the Data Model instead of Power Query',
          ], 1, 'The firewall is a structural rule about partitions, so separating source access from combination satisfies it without changing the result.'),
          q('A merge between a SQL view and a local CSV is left with privacy levels active. What is the performance cost?', [
            'The merge cannot fold, so filtering moves onto your machine',
            'The CSV is re-read once for every row of the SQL table',
            'The query refuses to load into the Data Model at all',
            'Credentials have to be entered again on every refresh',
          ], 0, 'Privacy levels prevent Power Query from sending a combined query to the server, so the server stops filtering and the join runs locally over everything.'),
          q('An API query builds its URL by concatenating a start date onto the address. What goes wrong, and what fixes it?', [
            'Nothing goes wrong, since concatenation is the documented approach',
            'The date arrives as text, so it needs wrapping in Date.From',
            'Credentials cannot match a changing URL, so use RelativePath and Query',
            'The filter folds badly, so move the date filter to a later step',
          ], 2, 'A URL that changes every run is treated as a dynamic data source with no saved credential to match, while a static base with RelativePath and Query keeps one addressable source.'),
        ]
      ),
      ],
      [
      q('Next month\'s file renames Amount to Order Amount. Which change keeps the query running instead of failing at the type step?', [
        'Set that column\'s type to any in the type step',
        'Add Table.RenameColumns near the top with MissingField.Ignore',
        'Switch off Detect Data Types in the query options',
        'Wrap the whole type step in a try otherwise expression',
      ], 1, 'Absorbing the rename in one step at the top means every later step sees the name it expects, whichever version of the file arrives.'),
      q('In a staging layer, which query is allowed to call Sql.Database?', [
        'The output query that joins everything together',
        'Any query, provided privacy is set to Organizational',
        'Only a query that loads into the Data Model',
        'Only a source query that does nothing else',
      ], 3, 'Keeping source access in its own query is what stops one query both opening a source and consuming another query\'s output, which is exactly what the firewall forbids.'),
      q('Four output queries reference one staging query built on a slow SQL view, and refresh takes four times as long as expected. Why?', [
        'The underlying SQL view is missing an index',
        'Background refresh is running the queries in parallel',
        'Connection only queries always refresh twice per run',
        'Referencing does not cache, so the staging query runs per output',
      ], 3, 'Power Query re-evaluates a referenced query for each query that references it, so a slow staging query is paid for once per consumer.'),
      q('Which habit turns a silently wrong number into a visible failure on refresh day?', [
        'Counting rows before and after any row removing step',
        'Wrapping the whole query in try otherwise null',
        'Using Remove Errors on every column as a precaution',
        'Setting each column type to any to avoid type errors',
      ], 0, 'A recorded before and after count exposes rows that disappeared without an error, which is the failure mode that otherwise reaches the published report.'),
      ]
    ),
    chapter(
      'Models That Answer Harder Questions',
      'Filter context, CALCULATE, and the model shapes that keep one measure correct at every level of a report.',
      [
      lesson('Filter Context, Row Context, and Why a Measure Moves', 13, `
\`Total Sales := SUM(Sales[Amount])\` returns 4,182,000 in the grand total, 312,400 on the Lahore row, and 27,900 where Lahore meets March. One definition, three answers, and nobody touched the formula in between.

### Every cell is its own query

A PivotTable cell is not a stored result. It is a question. Excel collects the coordinates of that cell (the row label, the column label, the report filters, every slicer selection), turns them into a set of filters over the model, applies them so the tables shrink, and only then runs the measure over whatever rows survived.

That set of filters is the **filter context**. Change the cell, change the context, change the number. The measure itself never moved.

### Row context is a different animal

Row context means "the current row". It exists in exactly two places: a calculated column, and the inside of an iterator such as \`SUMX\`. It knows which row you are standing on. It filters nothing.

| | Filter context | Row context |
|---|---|---|
| Created by | pivot cells, slicers, CALCULATE | calculated columns, iterators |
| Knows | which rows survive | which single row you are on |
| Filters the model | yes | no |
| Available in a measure | always | only inside an iterator |

The consequence catches everyone once:

\`\`\`dax
Margin % := (Sales[Amount] - Sales[Cost]) / Sales[Amount]
\`\`\`

That fails with "A single value for column 'Amount' in table 'Sales' cannot be determined". A measure has no row context, so \`Sales[Amount]\` is ambiguous across the 80,000 rows still standing. Aggregate first, then divide:

\`\`\`dax
Margin % := DIVIDE(SUM(Sales[Amount]) - SUM(Sales[Cost]), SUM(Sales[Amount]))
\`\`\`

### The quiet version of the same mistake

The reverse error produces no message at all. Someone builds a calculated column, which does have row context, so it works:

\`\`\`dax
Sales[Margin %] = DIVIDE(Sales[Amount] - Sales[Cost], Sales[Amount])
\`\`\`

Then they drag it into Values, and Excel offers Sum or Average of it. Both are wrong at every subtotal.

| Row | Amount | Cost | Margin % |
|---|---|---|---|
| Order 4471 | 100 | 90 | 10.0% |
| Order 4472 | 900 | 450 | 50.0% |
| Average of the column | | | 30.0% |
| Measure, aggregated first | 1,000 | 540 | 46.0% |

The average treats a 100 rupee sale and a 900 rupee sale as equals. The measure weights them, because it sums the raw amounts inside the cell's filter context and divides once. Percentages, rates and ratios almost never survive being averaged.

### Context transition

One bridge connects the two. When you call a measure from inside a row context, the engine wraps it in an implicit \`CALCULATE\` and converts the current row into filters on the model. That is **context transition**, and it is why this counts customers rather than rows:

\`\`\`dax
Customers Above 50k :=
COUNTROWS(FILTER(VALUES(Sales[Customer]), [Total Sales] > 50000))
\`\`\`

\`VALUES\` hands back the distinct customer list under the current filters. \`[Total Sales]\` is then evaluated once per customer, filtered to that customer, because the row it sits on became a filter. Replace the measure with a bare \`SUM(Sales[Amount])\` and the comparison runs against the whole visible table instead, so either every customer qualifies or none does.

### Reading a strange number

Two questions, in this order. What is the filter context of this cell? Does anything inside my measure change it?

Almost every "the total does not equal the sum of the rows" complaint answers itself at question one, because the grand total is not adding the rows above it. It is running the same measure again in a wider context, and for anything other than a plain sum, those are different calculations.
      `,
        [
          q('Why does Margin % := (Sales[Amount] - Sales[Cost]) / Sales[Amount] fail when written as a measure?', [
            'The two columns sit in different tables and need RELATED',
            'A measure has no row context, so a bare column reference is ambiguous',
            'DAX requires DIVIDE rather than the / operator for any ratio',
            'Calculated columns must be defined before a measure can use them',
          ], 1, 'Without row context the engine cannot decide which of the surviving rows the bare column reference means, so you must aggregate first.'),
          q('Two rows are 100 amount against 90 cost and 900 amount against 450 cost. What does averaging a Margin % calculated column report, against a correct 46%?', [
            '30%, because each row counts equally regardless of its size',
            '46%, since the average of ratios equals the ratio of the sums',
            '50%, because the larger row dominates the average completely',
            '10%, because the weakest margin sets the floor for the group',
          ], 0, 'Averaging percentages gives every row the same weight, so a 100 rupee sale pulls as hard as a 900 rupee one and you get 30% instead of 46%.'),
          q('Inside COUNTROWS(FILTER(VALUES(Sales[Customer]), [Total Sales] > 50000)), why is [Total Sales] evaluated per customer?', [
            'VALUES hands FILTER a fresh copy of the fact table each pass',
            'FILTER applies its condition only after aggregation finishes',
            'The measure call is wrapped in an implicit CALCULATE, so the current row becomes a filter',
            'Iterators ignore the surrounding filter context unless told otherwise',
          ], 2, 'Context transition converts the row FILTER is standing on into a filter over the model, which is why the measure returns that customer\'s total rather than everyone\'s.'),
        ]
      ),
      lesson('CALCULATE, ALL, and Removing Filters Deliberately', 13, `
A share column that reads 100.0% on every single row is the most common first result anyone gets from DAX. The measure behind it usually looks reasonable:

\`\`\`dax
Pct of Total := DIVIDE([Total Sales], [Total Sales])
\`\`\`

Written out like that the problem is obvious, but that is exactly what a denominator does when it sits in the same filter context as the numerator. The Lahore row filters both halves to Lahore, and 312,400 divided by 312,400 is 1.

### CALCULATE replaces, it does not add

\`CALCULATE\` takes an expression and a list of filter arguments, and runs in a fixed order:

1. Evaluate the filter arguments in the current context.
2. **Overwrite** any existing filter on the same column with the result.
3. Evaluate the expression in the modified context.

Step 2 is the one that surprises people. Drop this measure into a pivot with Category on rows:

\`\`\`dax
Beverage Sales := CALCULATE([Total Sales], Products[Category] = "Beverages")
\`\`\`

The Snacks row does not go blank. It shows the beverage figure, and so does every other row, because the filter argument replaced whatever filter the row supplied on that column. Ask for intersection instead and say so out loud:

\`\`\`dax
Beverage Sales := CALCULATE([Total Sales], KEEPFILTERS(Products[Category] = "Beverages"))
\`\`\`

Now Snacks is blank, because no row is both.

### Clearing filters on purpose

\`ALL\` and its relatives exist to be used as filter arguments, and each clears a different amount:

| Function | Clears | Typical use |
|---|---|---|
| \`ALL(Products)\` | every filter on that table | share of the grand total |
| \`ALL(Products[SKU])\` | only the SKU filter | share within a category |
| \`ALLEXCEPT(Products, Products[Category])\` | everything except Category | share within a category, safer |
| \`REMOVEFILTERS(Products)\` | same as ALL, honest name | any deliberate clearing |
| \`ALLSELECTED(Products)\` | pivot filters, keeps slicers | share of what the reader can see |

So the working versions:

\`\`\`dax
Pct of Grand Total := DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Products)))
Pct of Category    := DIVIDE([Total Sales], CALCULATE([Total Sales], ALLEXCEPT(Products, Products[Category])))
\`\`\`

Prefer \`ALLEXCEPT\` over listing the columns you want cleared. Someone adds a Brand column to Products next quarter, and the \`ALL(Products[SKU])\` version silently starts dividing by a brand subtotal.

### ALL against ALLSELECTED

A slicer limits the report to three of twenty cities. Same numerator, two denominators:

| Measure | Lahore | Karachi | Multan | Column adds to |
|---|---|---|---|---|
| Pct with ALL | 7.5% | 5.9% | 2.1% | 15.5% |
| Pct with ALLSELECTED | 48.4% | 38.1% | 13.5% | 100.0% |

Neither is wrong. \`ALL\` divides by the whole company including the cities the slicer hid. \`ALLSELECTED\` divides by the visible selection. Decide which question the reader is asking, then label the column so nobody has to guess. A percentage column that does not total 100 and is not meant to needs a footnote saying so.

### The shorthand is hiding an ALL

\`Products[Category] = "Beverages"\` is sugar. The engine expands it to:

\`\`\`dax
FILTER(ALL(Products[Category]), Products[Category] = "Beverages")
\`\`\`

There is the \`ALL\`, sitting inside the filter argument. That is where the replacement behaviour comes from, and once you have seen it, \`KEEPFILTERS\` stops looking like magic. The shorthand also only works over one column: anything that compares two columns, such as \`Sales[Amount] > Sales[Budget]\`, needs a full \`FILTER\` written by hand.

### The diagnostic

When a measure ignores a slicer it should respect, look for an \`ALL\` you forgot to narrow. When it respects a slicer it should ignore, look for a \`CALCULATE\` you forgot to write. Check those two before you rewrite anything.
      `,
        [
          q('A pivot has Category on rows. What does CALCULATE([Total Sales], Products[Category] = "Beverages") show on the Snacks row?', [
            'Blank, because no row is both Snacks and Beverages',
            'An error, since the two category filters conflict',
            'The Snacks total, because the outer row filter wins',
            'The Beverages total, because the argument overwrites it',
          ], 3, 'A CALCULATE filter argument replaces any existing filter on the same column, so the Snacks row reports the beverage figure.'),
          q('Which change makes that same measure return blank on the Snacks row?', [
            'Wrap the filter argument in KEEPFILTERS so it intersects',
            'Swap CALCULATE for CALCULATETABLE and leave the rest',
            'Add ALL(Products) as a second filter argument to it',
            'Replace the equals test with FILTER over ALL(Products)',
          ], 0, 'KEEPFILTERS makes the new filter intersect with the existing one instead of replacing it, and nothing is both Snacks and Beverages.'),
          q('A slicer limits a report to three of twenty cities, and the share column adds to 15.5% rather than 100%. What explains it?', [
            'The slicer is applied after the measure has evaluated',
            'KEEPFILTERS is missing from around the denominator',
            'The denominator uses ALL, so it divides by all twenty cities',
            'The percentages are formatted against the wrong base value',
          ], 2, 'ALL clears the slicer as well as the row filter, so each city is measured against the whole company rather than the visible selection.'),
        ]
      ),
      lesson('Iterators: SUMX, RANKX, and Row-Level Maths', 13, `
Three order lines: 2 units at 500, 10 at 40, and 1 at 1,200. Revenue is 1,000 plus 400 plus 1,200, so 2,600.

\`SUM(Sales[Qty]) * SUM(Sales[Price])\` returns 13 times 1,740, which is 22,620. Off by a factor of nearly nine, and the error grows with every row added, because that expression pairs every quantity with every price.

| SKU | Qty | Price | Line total |
|---|---|---|---|
| BEV-01 | 2 | 500 | 1,000 |
| SNK-04 | 10 | 40 | 400 |
| BEV-09 | 1 | 1,200 | 1,200 |
| SUM times SUM | 13 | 1,740 | **22,620** |
| SUMX | | | **2,600** |

### An iterator carries a row context

\`SUMX(table, expression)\` walks the table one row at a time, evaluates the expression with that row in scope, and adds the results:

\`\`\`dax
Revenue := SUMX(Sales, Sales[Qty] * Sales[Price])
\`\`\`

When price lives on the product rather than the line, \`RELATED\` follows the relationship from the many side to the one side:

\`\`\`dax
Revenue := SUMX(Sales, Sales[Qty] * RELATED(Products[Price]))
\`\`\`

The family is consistent: \`AVERAGEX\`, \`MINX\`, \`MAXX\`, \`COUNTX\`, \`PRODUCTX\`, \`CONCATENATEX\`, \`RANKX\`. Table first, expression second.

### The table argument sets the grain

Average order value is not \`AVERAGE(Sales[Amount])\` when a row is an order line rather than an order. Change the table you iterate and you change what the average is an average of:

\`\`\`dax
Avg Order Value    := AVERAGEX(VALUES(Sales[OrderID]), [Total Sales])
Avg Customer Spend := AVERAGEX(VALUES(Sales[Customer]), [Total Sales])
\`\`\`

\`VALUES\` returns the distinct list under the current filters, and calling \`[Total Sales]\` inside triggers context transition, so each pass is filtered to that one order or that one customer. Same measure, same data, two different questions answered correctly.

### RANKX and the column full of ones

\`\`\`dax
SKU Rank := RANKX(Products, [Total Sales])
\`\`\`

Every row shows 1. Ask the filter context question: on the BEV-01 row, \`Products\` has already been filtered down to BEV-01, so the ranking runs over a one row table and BEV-01 wins it. Rank over the unfiltered list instead:

\`\`\`dax
SKU Rank := RANKX(ALL(Products[SKU]), [Total Sales])
\`\`\`

Ties skip by default, so two products tied at 3 leave the next at 5. Ask for 4 with \`DENSE\`:

\`\`\`dax
SKU Rank := RANKX(ALL(Products[SKU]), [Total Sales], , DESC, DENSE)
\`\`\`

Rank the measure, not the column. \`RANKX(ALL(Products[SKU]), Products[Price])\` ranks by list price, which looks plausible in a screenshot and answers a question nobody asked.

### The cost that only appears at scale

Iterating the fact table is fine. The engine scans compressed columns quickly and it is built for exactly this. What is expensive is an iterator whose table argument has to be constructed first:

\`\`\`dax
Slow := SUMX(FILTER(Sales, RELATED(Products[Category]) = "Beverages"), Sales[Amount])
Fast := CALCULATE(SUM(Sales[Amount]), Products[Category] = "Beverages")
\`\`\`

The first builds a filtered copy of a 2.4 million row table for every cell in the report. On a matrix with 800 visible cells that is 800 materialisations, and the workbook that felt fine on a 50 row sample takes ninety seconds on the real one. The second pushes the filter into storage and never leaves it.

Two habits follow. Filter the dimension table, not the fact table, because \`Products\` has 900 rows and \`Sales\` has millions. And put \`FILTER\` around the smallest table that expresses the condition.

### Choosing between them

Ask whether the arithmetic happens before or after the aggregation. Price times quantity on each line, then add: iterator. Add the amounts, then divide once: plain aggregation inside \`CALCULATE\`. Getting that backwards is how you arrive at 22,620 and how a margin percentage ends up as the average of percentages instead of a ratio of totals.
      `,
        [
          q('Why does SUM(Sales[Qty]) * SUM(Sales[Price]) overstate revenue, and get worse as rows are added?', [
            'SUM skips blank prices, which inflates the quantity side',
            'It multiplies every quantity by every price instead of pairing them line by line',
            'The two columns come from separate tables and need RELATED',
            'Filter context reaches Qty but is not applied to Price',
          ], 1, 'Aggregating each column first destroys the pairing between a line\'s quantity and its own price, and the gap widens with every extra row.'),
          q('SKU Rank := RANKX(Products, [Total Sales]) shows 1 on every product row. What is the cause?', [
            'RANKX needs its sort order set to DESC explicitly',
            'A measure cannot be used as the value argument of RANKX',
            'Ties are being skipped, which collapses ranks to the top',
            'On a SKU row, Products is already filtered to that one SKU',
          ], 3, 'The table argument inherits the cell\'s filter context, so RANKX ranks a one row table and everything wins; ALL(Products[SKU]) restores the full list.'),
          q('Each row of Sales is an order line. Which expression gives the average value per order?', [
            'AVERAGE(Sales[Amount]) across the filtered fact table',
            'DIVIDE([Total Sales], COUNTROWS(Sales)) at line grain',
            'AVERAGEX(VALUES(Sales[OrderID]), [Total Sales])',
            'AVERAGEX(Sales, Sales[Qty] * Sales[Price])',
          ], 2, 'Iterating the distinct order list makes each pass one order, so the average is per order rather than per line.'),
        ]
      ),
      lesson('Bridge Tables, Role-Playing Dates, and Ambiguous Paths', 13, `
The budget arrives by category and month. Sales sit at SKU and day. Finance wants variance in one pivot, so you try to relate \`Budget[Category]\` to \`Products[Category]\` and Excel refuses. Neither side is unique: Products repeats Beverages across 40 SKUs, Budget repeats it across 12 months.

### Build the bridge

Make a table holding each category exactly once and relate both facts to it. In Power Query, reference Products, keep Category, Remove Duplicates, and load as Connection Only with Add to Data Model ticked. Append the category column from Budget before deduplicating, so a category that is budgeted but never sold still appears rather than vanishing from the report.

The relationships run one to many outward from the bridge:

\`\`\`text
Category[Category] ──1:*──> Products[Category] ──1:*──> Sales[SKU]
Category[Category] ──1:*──> Budget[Category]
\`\`\`

Then obey the rule that makes it work: **slice on the bridge**. A slicer built on \`Products[Category]\` filters sales and leaves the budget completely still, because filters flow from the one side to the many and Products is the many side of Category. Nothing propagates upward. The variance column reads as a catastrophic overspend that does not exist.

### The grain trap

Even with the bridge correct, put SKU on rows and the budget measure repeats the whole category figure against every SKU, because Budget has no SKU column for anything to filter. Blank it where it is meaningless:

\`\`\`dax
Budget Amount := IF(HASONEVALUE(Products[SKU]), BLANK(), SUM(Budget[Amount]))
Variance      := [Total Sales] - [Budget Amount]
\`\`\`

A blank cell tells the reader this number does not exist at this level. A repeated one tells them a lie in a confident font.

### Role playing dates

\`Sales\` has \`OrderDate\` and \`ShipDate\`. One Calendar table, two candidate relationships, and only one may be active. Excel draws the second as a dotted line and ignores it.

| Approach | Cost | Best when |
|---|---|---|
| Two calendar tables | two date slicers on the page | both dates get sliced often |
| One calendar, inactive link | measures must opt in | ship date is a secondary view |

The opt in is \`USERELATIONSHIP\`, which lives only inside \`CALCULATE\` and only for that call:

\`\`\`dax
Total Sales   := SUM(Sales[Amount])
Shipped Sales := CALCULATE([Total Sales], USERELATIONSHIP('Calendar'[Date], Sales[ShipDate]))
\`\`\`

Every other measure keeps the order date view, which is usually what you want and always what confuses people. A reader sees Total Sales of 412,000 and Shipped Sales of 388,000 in March and reports a fulfilment gap. There is none. One counts orders placed in March, the other counts orders shipped in March, and those are different sets of rows entirely. Name the columns "Ordered in March" and "Shipped in March" and the question stops being asked.

### Ambiguous paths

If two routes exist between two tables, Excel deactivates one at creation time rather than guess. It happens innocently: \`Sales\` joins \`Customers\`, \`Customers\` joins \`Region\`, then someone adds a direct \`Sales\` to \`Region\` relationship for convenience. Region can now reach Sales two ways, one gets switched off, and half the report quietly reads through a path nobody chose.

Delete the shortcut. One path between any two tables, always. That is the star rule from chapter 7 holding up once the model grows past a single fact table.

Bidirectional cross filtering looks like the easy fix for the bridge problem, and it is the fastest way to manufacture ambiguity in a two fact model. Worse, its failures show up as totals that are slightly wrong rather than as an error message, so they survive review. Leave relationships single directional and reach for \`CROSSFILTER\` inside one specific measure when you genuinely need the filter to travel the other way.
      `,
        [
          q('With a Category bridge in place, a slicer built on Products[Category] moves sales but leaves budget unchanged. Why?', [
            'The bridge table needs a direct relationship to Sales',
            'Filters flow one to many, so Products cannot filter upward',
            'Budget loaded as connection only and was never refreshed',
            'Category is a text key, and text keys do not propagate',
          ], 1, 'Products sits on the many side of the bridge, so its filter never reaches the Category table and therefore never reaches Budget.'),
          q('Sales are held by SKU and budget only by category. What does a plain SUM(Budget[Amount]) show on a pivot with SKU on rows?', [
            'The whole category budget repeated against every SKU',
            'Blank, because Budget holds no SKU column at all',
            'The category budget divided evenly across the SKUs',
            'An error stating that the relationship path is ambiguous',
          ], 0, 'Nothing in the SKU row can filter a table that has no SKU column, so the untouched category total is drawn again on every line.'),
          q('Which statement about USERELATIONSHIP(\'Calendar\'[Date], Sales[ShipDate]) is accurate?', [
            'It permanently activates the ship date relationship',
            'It works in any measure, with or without CALCULATE',
            'It applies only inside the CALCULATE containing it',
            'It needs the order date relationship deleted first',
          ], 2, 'USERELATIONSHIP is a CALCULATE modifier that swaps the active relationship for that one evaluation, leaving every other measure on order date.'),
        ]
      ),
      ],
      [
      q('A measure shows the identical figure on every row of a Category pivot. Which cause fits best?', [
        'The measure aggregates a calculated column instead of raw values',
        'An iterator is being used where a plain SUM would have worked',
        'The Calendar table was never marked as a date table in the model',
        'A CALCULATE filter argument is overwriting the row\'s own category',
      ], 3, 'A filter argument replaces the filter the row supplied on that column, so every row is evaluated under the same hardcoded selection.'),
      q('Which pair of places creates row context?', [
        'Calculated columns and the inside of an iterator',
        'Slicers and the rows area of a PivotTable report',
        'CALCULATE filter arguments and the report filters',
        'Relationships and the Mark as Date Table setting',
      ], 0, 'Only a calculated column and an iterator expression know which single row they are standing on; everything else supplies filter context instead.'),
      q('You need each city\'s share of the cities currently selected in a slicer, not of the whole company. Which denominator does that?', [
        'CALCULATE([Total Sales], ALL(Sales[City]))',
        'CALCULATE([Total Sales], ALLSELECTED(Sales[City]))',
        'CALCULATE([Total Sales], KEEPFILTERS(Sales[City]))',
        'CALCULATE([Total Sales], VALUES(Sales[City]))',
      ], 1, 'ALLSELECTED clears the filter the pivot row applied while respecting the slicer, so the shares total 100% of what the reader can see.'),
      q('Sales already reaches Region through Customers, and someone adds a direct Sales to Region relationship. What happens?', [
        'Filters from Region are combined across both routes',
        'The model refuses to refresh until one route is removed',
        'Region totals are duplicated for every customer row',
        'Excel deactivates one path, so filters take a route you did not pick',
      ], 3, 'Rather than guess between two routes, Excel switches one off, and the report then reads through whichever relationship survived.'),
      ]
    ),
    chapter(
      'From Analysis to Decisions',
      'Regression, forecasting, optimisation, and simulation for the business questions a summary table cannot answer.',
      [
      lesson('Spread, Outliers, and the Average That Lies', 13, `
The Karachi warehouse promises delivery within 5 days. Last quarter the average delivery time was 3.8 days, which the operations deck reported as comfortable. Then 18% of orders missed the promise and the retention team spent November apologising.

### One number cannot describe a shape

Five formulas over the same column, five different pictures:

\`\`\`excel
=AVERAGE(Orders[Days])                             3.8
=MEDIAN(Orders[Days])                              3
=STDEV.S(Orders[Days])                             3.1
=PERCENTILE.INC(Orders[Days],0.95)                 11
=COUNTIFS(Orders[Days],">5")/COUNT(Orders[Days])   0.18
\`\`\`

A mean above the median means a right tail: a minority of very late orders drags the average up while most orders sit below it. The SLA was never a promise about the mean. It is a promise about a percentile, and only the last formula answers it.

Use \`STDEV.S\` when the rows are a sample of something larger, \`STDEV.P\` only when they are the whole population you care about. Across 1,200 orders the two agree to the fourth decimal. Across 8 branches they do not.

### The average that describes nobody

Two customer types share one table:

| Segment | Orders | Typical order |
|---|---|---|
| Retail | 4,100 | 2,000 |
| Wholesale | 190 | 92,000 |
| Combined | 4,290 | mean of 5,986 |

Not one customer places a 5,986 order. The mean landed in the empty gap between two populations. Whenever a histogram shows two humps, the mean is an artefact, and the fix is to split the population before summarising it, not to find a cleverer average.

### Spread, compared fairly

Lahore averages 3.6 days with a standard deviation of 1.4. Karachi averages 3.8 with a standard deviation of 3.4. The means are nearly identical and the branches are not:

\`\`\`excel
=STDEV.S(range)/AVERAGE(range)     Coefficient of variation
Lahore    0.39
Karachi   0.89
\`\`\`

Coefficient of variation strips the units out, so the volatility of delivery days becomes comparable with the volatility of order value. A planner reading only the means would staff both branches the same way.

### Outliers: rule first, judgement second

The standard fence uses the interquartile range:

\`\`\`excel
Q1          =QUARTILE.INC(Orders[Days],1)      2
Q3          =QUARTILE.INC(Orders[Days],3)      5
IQR         =Q3-Q1                             3
Upper fence =Q3+1.5*IQR                        9.5
\`\`\`

Anything past 9.5 days is flagged. Flagged is not the same as wrong. Two of those rows are a genuine port strike and belong in the analysis. One is a 400 day delivery caused by an order date typed as 2024 instead of 2025, and belongs in a correction log.

Deleting outliers silently is the most common quiet fraud in business analysis. If you exclude rows, say how many, state the rule, and show the figure both ways. \`=TRIMMEAN(Orders[Days],0.1)\` drops the top and bottom 5% and averages the rest, which is honest when you label it and misleading when you do not.

### Z scores lie on skewed data

A z score says how many standard deviations a value sits from the mean:

\`\`\`excel
=(A2-AVERAGE(Orders[Days]))/STDEV.S(Orders[Days])
\`\`\`

The familiar reading, that beyond 3 is rare, assumes a symmetric bell. Delivery days are not symmetric: bounded at zero, unbounded above. On this data a 15 day delivery scores 3.6, which sounds impossible, and it happened eleven times. Percentiles carry no distribution assumption, which is exactly why service targets and pay bands are written as percentiles rather than as z scores.

### What goes on the slide

Report the median beside the mean whenever they disagree by more than a few percent, add the one percentile that matches the promise the business made, and state the count behind both. Three numbers instead of one, and the argument about whether the quarter went well becomes an argument about the right numbers.
      `,
        [
          q('Mean delivery time is 3.8 days, the median is 3, and the SLA promises 5 days. Which figure tells you whether the promise was kept?', [
            'The mean, since it accounts for every order placed',
            'The gap between mean and median, read as a miss rate',
            'The share of orders past 5 days, which is a percentile question',
            'The standard deviation, compared against the 5 day limit',
          ], 2, 'An SLA is a promise about a proportion of orders, so only counting the orders past the threshold answers it, and a mean well under the limit is perfectly compatible with a large miss rate.'),
          q('Retail customers order around 2,000 and wholesale around 92,000, and the combined mean is 5,986. Why is that mean unhelpful?', [
            'It falls between two populations, so it describes no real customer',
            'It is dragged down by the far larger count of retail orders',
            'It should have been weighted by revenue rather than order count',
            'The two segments were measured over different date ranges',
          ], 0, 'A bimodal population has no single centre, so the mean lands in the empty gap between the two humps and the fix is to report the segments separately.'),
          q('Delivery days are bounded at zero with a long right tail. Why is a z score a poor outlier test on that data?', [
            'Standard deviation is undefined for data bounded below',
            'Z scores require the population form STDEV.P to be valid',
            'Mean and median must agree before a z score can compute',
            'The rule that beyond 3 is rare assumes a symmetric bell curve',
          ], 3, 'On a skewed distribution values past three standard deviations are common rather than rare, so the familiar threshold flags ordinary business as impossible.'),
        ]
      ),
      lesson('Correlation, Regression, and What LINEST Tells You', 13, `
Marketing pulled 36 months of ad spend and revenue, ran \`=CORREL\`, got 0.91, and asked for double the budget. The correlation was real. The conclusion was not.

### Correlation measures one specific thing

\`CORREL\` returns the strength of a **linear** association between two series on a scale of -1 to 1. It knows nothing about time, causation, or curves.

Both series were growing. Spend rose because revenue rose because the business was expanding, and a shared trend pushes almost any two growing series above 0.9. Correlate the month on month changes instead and the story collapses:

\`\`\`excel
=CORREL(Spend, Revenue)                  0.91
=CORREL(SpendChange, RevenueChange)      0.12
\`\`\`

Same data. The second number is the one that answers "does spending more this month sell more this month".

Two further traps. Correlation only sees straight lines, so a perfect inverted U (spend so hard you saturate the market) can score near zero while being completely predictable. And r is not the share of variation explained, r squared is: an r of 0.7 sounds strong and leaves 51% of the movement unaccounted for.

### From association to a fitted line

For a single predictor, three functions:

\`\`\`excel
=SLOPE(Revenue, Spend)        3.18
=INTERCEPT(Revenue, Spend)    184000
=RSQ(Revenue, Spend)          0.83
\`\`\`

Read it as: each extra rupee of ad spend is **associated with** 3.18 more revenue, within the range of spend actually observed. Say "associated with", not "produces", until somebody has run an experiment.

### LINEST, and the order that catches everyone

\`LINEST\` fits several predictors at once. Model revenue (column D) from ad spend (column B) and store footfall (column C):

\`\`\`excel
=LINEST(D2:D37, B2:C37, TRUE, TRUE)
\`\`\`

It spills a block five rows tall and three columns wide:

| Row | Column 1 | Column 2 | Column 3 |
|---|---|---|---|
| 1 | 92.4 footfall | 3.18 spend | 171,500 intercept |
| 2 | 21.6 std error | 0.74 std error | 38,900 std error |
| 3 | 0.86 r squared | 41,200 std error of y | |
| 4 | 101.3 F | 33 df | |
| 5 | ss regression | ss residual | |

**The coefficients come out backwards.** The leftmost number belongs to the *last* X column. Nearly every wrong LINEST reading in circulation is somebody who assumed left to right and swapped two coefficients that both looked plausible.

Divide a coefficient by the standard error directly beneath it to get a t statistic. 3.18 / 0.74 is 4.3, comfortably past the rough threshold of 2, so spend carries real signal. Footfall lands at 4.3 as well. A coefficient with an absolute t below 2 is a variable you cannot defend in a meeting.

### What the fit does not tell you

**Multicollinearity.** If spend and footfall move together, the model cannot separate their effects. Standard errors inflate, and one coefficient can come back with the wrong sign or as a flat zero. Check \`CORREL\` between your predictors before trusting either number.

**Extrapolation.** The slope was fitted between 40,000 and 210,000 of monthly spend. Feeding it 900,000 is not a prediction, it is arithmetic.

**Residuals.** Subtract fitted from actual and chart the result against time. A shapeless cloud is a healthy model. A visible wave means seasonality is still sitting in the data, the rows are not independent, and every standard error above is optimistic.

The Data Analysis ToolPak regression tool prints all of this with labels, which is far easier to read, and unlike LINEST it is a static paste that will never update when next month's row lands. Use the ToolPak to understand a model once. Use LINEST in the workbook that has to refresh.
      `,
        [
          q('Monthly ad spend and revenue correlate at 0.91, but the correlation of their month on month changes is 0.12. What does that indicate?', [
            'The revenue series holds errors that differencing happens to remove',
            'A shared trend produced most of the 0.91, not a spend to sales link',
            'Ad spend affects revenue with a lag longer than a single month',
            'The relationship is genuine but curved rather than a straight line',
          ], 1, 'Two series that both grow over time correlate highly whatever else is true, and differencing strips that trend out so only the month to month link remains.'),
          q('=LINEST(D2:D37, B2:C37, TRUE, TRUE) spills a block whose top row reads 92.4, 3.18, 171500. Which value is the coefficient on column B?', [
            '92.4, because coefficients follow the order of the X columns',
            '171500, because the intercept is always reported first',
            'Neither, the top row carries standard errors not coefficients',
            '3.18, because LINEST returns coefficients in reverse column order',
          ], 3, 'LINEST lists coefficients right to left relative to the X range, so the leftmost result belongs to the last X column and column B is the second value along.'),
          q('A model fitted on monthly spend between 40,000 and 210,000 is asked to predict revenue at 900,000 of spend. What is wrong with the answer?', [
            'It extrapolates far outside the range the slope was fitted on',
            'LINEST rejects any input beyond the largest observed X value',
            'The r squared drops below the level needed for prediction',
            'The intercept turns negative, which invalidates the whole fit',
          ], 0, 'A regression describes the relationship only across the data it actually saw, so applying the slope four times beyond the observed range is arithmetic rather than evidence.'),
        ]
      ),
      lesson('Forecasting a Seasonal Series Honestly', 13, `
A wholesaler fed 36 months of revenue into \`FORECAST.LINEAR\` and told the board that January would be the strongest month of the year. January is always the weakest month of the year. The straight line had averaged the seasonality away, then extrapolated the trend straight into the trough.

### A trend line cannot see December

\`=FORECAST.LINEAR(DATE(2026,1,1), Revenue, MonthStart)\` fits one line through everything. Any repeating pattern becomes noise scattered around it, and the projection inherits the trend without the season.

### FORECAST.ETS does model the season

\`\`\`excel
=FORECAST.ETS(DATE(2026,1,1), Revenue, MonthStart, 12, 1, 1)               512,000
=FORECAST.ETS.SEASONALITY(Revenue, MonthStart)                             12
=FORECAST.ETS.CONFINT(DATE(2026,1,1), Revenue, MonthStart, 0.95, 12, 1, 1) 64,000
\`\`\`

The arguments matter more than the function name. Seasonality is 12 for monthly data with an annual cycle, 7 for daily data with a weekly cycle, 1 to let Excel detect it, 0 to declare there is none. Data completion of 1 interpolates missing points; 0 treats a gap as a zero and teaches the model a crash that never happened. Aggregation decides how duplicate timestamps combine, and 1 averages them.

The requirements bite. The timeline needs a constant step, up to 30% of points may be missing before it refuses, and you need at least two full cycles. Two is thin. At three years the seasonal profile stops shifting every time a new month arrives.

\`Data > Forecast Sheet\` does all of this with a chart and the confidence band drawn, then writes the formulas into the sheet so you can read back what it chose.

### The version a finance director can audit

FORECAST.ETS will not explain itself. Seasonal indices will.

\`\`\`excel
D8:  =(AVERAGE(C2:C13)+AVERAGE(C3:C14))/2    centred 12 month trend for row 8
E8:  =C8/D8                                  actual against trend
H2:  =AVERAGEIF($B$2:$B$37,G2,$E$2:$E$37)    mean ratio for that calendar month
I2:  =H2*12/SUM($H$2:$H$13)                  normalise so the 12 indices sum to 12
\`\`\`

| Month | Raw ratio | Normalised index |
|---|---|---|
| January | 0.77 | 0.78 |
| July | 1.06 | 1.07 |
| December | 1.40 | 1.42 |

Deseasonalise with \`actual / index\`, fit \`SLOPE\` and \`INTERCEPT\` on that clean series, project forward, then multiply the index back on. Every step is a cell somebody can point at. The normalisation is the step people skip, and unnormalised indices quietly scale the entire forecast up or down.

### Score it before you ship it

Fit on months 1 to 30 only and predict 31 to 36, where you already know the answer:

\`\`\`excel
=AVERAGE(ABS(Actual-Forecast))              MAE, 31,400
=AVERAGE(ABS(Actual-Forecast)/Actual)       MAPE, 6.4%
\`\`\`

MAPE is popular and unstable. Near zero actuals send it to infinity, and it punishes over forecasting less than under forecasting, so a model tuned on MAPE quietly learns to forecast low. MAE, in the currency the business uses, is harder to game.

Then beat the free baseline. Last year, same month:

\`\`\`excel
=INDEX(Revenue, MATCH(EDATE(TargetMonth,-12), MonthStart, 0))
\`\`\`

If seasonal naive scores 7.1% MAPE and your model scores 6.4%, you bought 0.7 points for a week of work. Say that, rather than presenting the model as a breakthrough.

### The honest output

A single number is a hostage. Publish the interval CONFINT gives you, name the assumptions that would break it (the March price rise, the branch opening in June, neither of which the model has ever seen), and write the forecast down with the date you made it. A model with a level shift buried in the history is the worst case: exponential smoothing smears a step change across the following months instead of recognising it, so the forecast is wrong in a way the fit statistics will not show. Forecasts that are never scored never improve.
      `,
        [
          q('FORECAST.LINEAR on 36 months of seasonal revenue predicts January as the strongest month, though January is always the weakest. Why?', [
            'The timeline held gaps that shifted the fitted line forward',
            'Three years is too short a history to estimate any trend',
            'Month start dates are not a constant step, so the fit skews',
            'A straight line absorbs the seasonal swing as noise around the trend',
          ], 3, 'FORECAST.LINEAR fits a single line with no seasonal term, so the repeating December peak and January trough are averaged away and only the upward trend gets projected.'),
          q('Your hand built seasonal indices average 1.04 across the twelve months. What happens if you skip the normalisation step?', [
            'The seasonal shape flattens and December stops standing out',
            'Every forecast month is inflated by about 4% on top of the trend',
            'FORECAST.ETS refuses to run against a manually indexed series',
            'The deseasonalised series gains a trend it did not have before',
          ], 1, 'Indices that do not average to one carry a systematic multiplier into every projected month, so the entire forecast is scaled up or down by that error.'),
          q('Your model scores 6.4% MAPE on a holdout while the seasonal naive baseline scores 7.1%. What is the right conclusion?', [
            'The model is validated and should replace the baseline outright',
            'MAPE differences under one point are always statistical noise',
            'The model buys 0.7 points over a free baseline, so say exactly that',
            'The holdout was too small, since a good model should halve the error',
          ], 2, 'A backtest only means something against a baseline, and a small edge over last year same month should be reported as a small edge rather than as a breakthrough.'),
        ]
      ),
      lesson('Solver and Monte Carlo: Deciding Under Uncertainty', 14, `
Solver returned the profit maximising plan: 57.14 units of Standard and 77.14 of Premium. The plant cannot build 0.14 of a machine. Somebody rounded both up, the plan broke the labour constraint, and the schedule was rebuilt by hand on a Friday night.

### Solver is three ranges and nothing else

Decision cells, the only cells Solver may change. One objective cell, a formula that eventually reads those decision cells. Constraints, each a formula compared against a limit. Enable it under \`File > Options > Add-ins > Manage Excel Add-ins > Go > Solver Add-in\`.

| Product | Contribution | Machine hrs | Labour hrs |
|---|---|---|---|
| Standard | 40 | 2 | 3 |
| Premium | 90 | 5 | 4 |
| Available | | 500 | 480 |

\`\`\`excel
E2:E3  units to make, the decision cells
B8   =SUMPRODUCT(B2:B3,$E$2:$E$3)   objective, contribution to maximise
B9   =SUMPRODUCT(C2:C3,$E$2:$E$3)   machine hours used, constrained <= 500
B10  =SUMPRODUCT(D2:D3,$E$2:$E$3)   labour hours used, constrained <= 480
\`\`\`

Simplex LP returns 57.14 and 77.14 for 9,228.57 of contribution. Add the constraint \`E2:E3 = integer\` and it returns 55 and 78 for 9,220. That 8.57 gap is what the fractional answer was always borrowing, and it is why you constrain first and round never.

### Choosing the method

| Method | Use when | You get |
|---|---|---|
| Simplex LP | objective and constraints are all SUMPRODUCT shaped | the global optimum, fast |
| GRG Nonlinear | smooth curves, powers, division by a decision cell | a local optimum near your start |
| Evolutionary | IF, MAX, VLOOKUP or ROUND anywhere in the chain | a decent answer, no proof, slowly |

"The linearity conditions required by this LP Solver are not satisfied" almost never means Solver is confused. It means an IF or a lookup crept into the objective chain and the model stopped being linear.

GRG is the dangerous one, because it always returns something. Run it from three different starting sets of decision values. Three different answers means local optima, and the first one was never the answer.

Tick **Make Unconstrained Variables Non-Negative**, or Solver will cheerfully propose making -220 units at a magnificent profit. Then open the **Sensitivity Report**: the shadow price on machine hours says what one more hour is worth, which is the number that actually prices the decision to rent capacity.

### Solver optimises exactly one future

Every input above was a point estimate. Demand is not a point estimate.

Buy at 110, sell at 180, salvage unsold stock at 60, demand roughly normal around 4,200 with a standard deviation of 650. The critical ratio (180-110)/(180-60) puts the best order near 4,337 units.

\`\`\`excel
B1   4337                                        order quantity
D2   =MAX(0, NORM.INV(RAND(), 4200, 650))        simulated demand
E2   =180*MIN(D2,$B$1)+60*MAX($B$1-D2,0)-110*$B$1
\`\`\`

To run it 10,000 times, list 1 to 10000 down a column, put \`=E2\` at the top of the next column, select the block, then \`Data > What-If Analysis > Data Table\` with the **column input cell pointing at any empty cell**. Every row recalculates, RAND redraws, and you have 10,000 profits.

Report the shape, not the mean:

\`\`\`excel
=AVERAGE(Trials)                            263,600
=PERCENTILE.INC(Trials,0.1)                 187,200
=PERCENTILE.INC(Trials,0.9)                 303,600
=COUNTIF(Trials,"<200000")/COUNT(Trials)    0.13
\`\`\`

P90 sits exactly at 70 times 4,337 because you can never sell more than you bought. The upside is capped by the order; the downside is not. That asymmetry is invisible in the mean and it is the whole reason to simulate.

Four things that cost real money. RAND is volatile, so every keystroke redraws all 10,000 trials and your numbers change while you write about them: set calculation to Manual, or paste the trial column as values before quoting anything. Excel has no random seed, so a colleague reopening the file gets different answers, which is another reason to keep the pasted trials. A raw normal has no floor and will generate negative demand, hence the \`MAX(0, ...)\`. And drawing correlated inputs independently understates the tail badly: if a bad month means weak demand **and** a weak exchange rate, simulating them separately produces a comfortable P10 the business will never actually see.
      `,
        [
          q('Solver\'s objective cell contains a VLOOKUP into a discount tier table. What happens when you run it with Simplex LP?', [
            'It stops, reporting that the linearity conditions are not satisfied',
            'It reaches the global optimum but takes far longer to finish',
            'It ignores the lookup and optimises the rest of the model silently',
            'It rewrites the lookup as a set of additional integer constraints',
          ], 0, 'A lookup makes the objective non linear and Simplex LP can only solve linear models, so it halts with the linearity message instead of returning a plan.'),
          q('GRG Nonlinear returns three different answers from three different starting values. What does that tell you?', [
            'The constraints conflict, so no feasible solution exists at all',
            'The model needs the non-negativity option switched on first',
            'The surface has local optima, so no single run proves anything',
            'The decision cells must be constrained to integers before solving',
          ], 2, 'GRG climbs from wherever it starts and halts at the nearest peak, so differing results across starting points reveal several local optima and no proof of the global best.'),
          q('In a 10,000 trial newsvendor simulation with an order of 4,337 units, why does the P90 profit sit exactly at 303,590?', [
            'Ten percent of trials failed and were dropped from the range',
            'Profit is capped once demand rises above the quantity you bought',
            'PERCENTILE.INC rounds up to the nearest observed trial value',
            'The normal distribution truncates its upper tail at 1.28 sigma',
          ], 1, 'You can never sell more than you ordered, so every trial where demand exceeds 4,337 earns the same full margin and the whole upper tail collapses onto that ceiling.'),
        ]
      ),
      ],
      [
      q('A dataset\'s mean sits well above its median and the business promises a 5 day turnaround. Which summary belongs on the slide?', [
        'The mean on its own, with the standard deviation in brackets',
        'The trimmed mean, which removes the pull of the very late orders',
        'The mean and the coefficient of variation shown side by side',
        'The median, the mean, and the share of orders past 5 days',
      ], 3, 'The promise is a percentile so it needs a count past the threshold, and showing the mean beside the median tells the reader the distribution is skewed.'),
      q('You must forecast next December for a series with three years of monthly history and a clear annual cycle. Which approach fits?', [
        'FORECAST.ETS with a seasonality of 12, plus its confidence interval',
        'SLOPE and INTERCEPT on the raw monthly series, projected forward',
        'Solver, maximising the fit between a trend line and the actuals',
        'CORREL between month number and revenue to size the December lift',
      ], 0, 'Triple exponential smoothing models level, trend and season together, and the paired CONFINT function reports the uncertainty a single point forecast hides.'),
      q('A regression says ad spend explains 83% of revenue variation. What can you honestly claim to the board?', [
        'Spend causes 83% of revenue, because r squared measures causation',
        'Spend is associated with revenue, and causation needs an experiment',
        'Nothing at all, since r squared above 0.8 indicates overfitting',
        'Revenue will rise 83% of the way to target if spend is doubled',
      ], 1, 'Regression measures association within the observed data, and only a designed test that varies spend independently can support a causal claim.'),
      q('Why report P10, P50 and P90 from a Monte Carlo run rather than just the mean profit?', [
        'The mean is biased upward whenever inputs are drawn at random',
        'Percentiles are the only statistics that survive a volatile RAND',
        'A single figure hides the downside the decision is actually risking',
        'Excel cannot compute a mean across a Data Table output block',
      ], 2, 'The point of simulating is to see the spread of outcomes, and a decision maker needs to know how bad the bad cases get rather than where the centre sits.'),
      ]
    ),
    chapter(
      'Automation Beyond the Recorded Macro',
      'VBA that somebody can maintain, Office Scripts and Power Automate for runs nobody attends, and Python in Excel for the work formulas cannot do.',
      [
      lesson('VBA Somebody Else Can Maintain', 13, `
The macro button from Chapter 7 worked for eleven months. Then somebody inserted a column in front of D, and the next run wrote line totals into the delivery notes column. Nobody noticed for a fortnight.

That is the recorded macro's defining weakness. It records where you clicked, not what you meant.

### Read what the recorder actually wrote

\`\`\`vba
Sub Macro1()
    Sheets("Sales").Select
    Range("D2").Select
    ActiveCell.FormulaR1C1 = "=RC[-2]*RC[-1]"
    Selection.AutoFill Destination:=Range("D2:D5000")
    Range("A1").Select
End Sub
\`\`\`

Three faults, all invisible while it works. It leans on the active sheet and the active cell, so anything that moves focus mid run sends the output somewhere else. It hardcodes row 5000, so row 5001 onwards is silently skipped the month sales grow. And \`RC[-2]\` is relative to wherever the cursor happens to sit, which is exactly why an inserted column moved the answer.

Rewrite it to name what it touches and find its own edges:

\`\`\`vba
Option Explicit

Sub AddLineTotal()
    Dim ws As Worksheet, lastRow As Long
    Set ws = ThisWorkbook.Worksheets("Sales")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    ws.Range("D2:D" & lastRow).Formula = "=B2*C2"
End Sub
\`\`\`

No \`Select\`, no \`ActiveCell\`, no magic row number. \`Option Explicit\` at the top of every module is not a style preference: without it a mistyped variable name quietly creates a new empty Variant and the macro carries on multiplying by zero. Tools, Options, Require Variable Declaration writes it in for you from then on.

### The loop that takes eighteen seconds

Every time VBA reads or writes a cell it crosses the boundary between your code and the calculation engine. A hundred thousand crossings cost real time.

\`\`\`vba
' about 18 seconds
For i = 2 To 50001
    ws.Cells(i, 3).Value = ws.Cells(i, 1).Value * ws.Cells(i, 2).Value
Next i

' about 0.3 seconds
Dim data As Variant, i As Long
data = ws.Range("A2:C50001").Value2
For i = 1 To UBound(data, 1)
    data(i, 3) = data(i, 1) * data(i, 2)
Next i
ws.Range("A2:C50001").Value2 = data
\`\`\`

Two crossings instead of a hundred thousand. Use \`Value2\` rather than \`Value\` because it hands back raw doubles instead of converting dates and currency into VBA types on the way through.

### Restore state even when it crashes

\`\`\`vba
Sub RunMonthly()
    On Error GoTo Cleanup
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual

    RefreshSources
    RebuildSummary
    StampRunDate

Cleanup:
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    If Err.Number <> 0 Then MsgBox "Run failed: " & Err.Description
End Sub
\`\`\`

The version without that handler is the one that generates a support ticket. It sets calculation to manual, hits an error at row 40,000, and stops. Calculation is an application setting, not a workbook setting, so every file that person opens for the rest of the day stops recalculating. They report it as "Excel is broken" and the real cause is three days upstream.

### Structure it like the runbook

\`RunMonthly\` reads as a list of steps because each step is its own Sub with a name that says what it does. Whoever inherits the file reads five lines and knows the shape of the run before opening anything else. A single 400 line Sub with identical logic is technically the same program and practically unmaintainable.

Two constraints to plan around. The file must be saved as \`.xlsm\`, and a macro workbook that arrives by email or download opens with macros blocked by Mark of the Web: the recipient sees a red banner and a dead button, and concludes your automation does not work. Publish it to a trusted SharePoint location instead of attaching it.
      `,
        [
          q('A recorded macro fills column D with =RC[-2]*RC[-1] and stops at row 5000. Sales grow to 6,200 rows. What does the next run produce?', [
            'An error on the first row past the recorded range',
            'Correct totals for 5,000 rows and nothing for the other 1,200',
            'A prompt asking whether to extend the recorded range',
            'Totals for every row, since AutoFill follows the table',
          ], 1, 'The row number was baked in when the macro was recorded, so rows beyond it are skipped in silence and nothing flags the gap.'),
          q('A macro sets Application.Calculation to xlCalculationManual, then errors out before the last line. What does the user notice?', [
            'Only that workbook stops recalculating until it is reopened',
            'Excel restores automatic calculation as soon as the macro halts',
            'The macro reruns from the start with calculation left manual',
            'Every workbook they open afterwards stops recalculating',
          ], 3, 'Calculation is an application level setting, so it stays manual for the whole Excel session until something puts it back, which is why the restore belongs in an error handler.'),
          q('Why is reading a range into a Variant array and writing it back faster than looping over cells?', [
            'Each cell read or write crosses into the calculation engine',
            'Variant arrays are held in a compressed form in memory',
            'Arrays skip the volatile functions that force a recalculation',
            'VBA compiles array loops but interprets cell loops',
          ], 0, 'The cost is the boundary crossing between VBA and the grid, so two crossings beat a hundred thousand regardless of how the arithmetic is written.'),
        ]
      ),
      lesson('Office Scripts: Automation That Runs in the Cloud', 13, `
Your VBA macro cannot run at 06:00 on a Sunday. It needs Excel open, on a machine that is switched on, signed in, and not sitting behind a dialog box waiting for someone to click OK. Office Scripts exist for the runs nobody attends.

An Office Script is TypeScript, it runs against a workbook in OneDrive or SharePoint, and it can be called by a scheduled process.

### One function, and no active anything

\`\`\`typescript
function main(workbook: ExcelScript.Workbook) {
  const table = workbook.getWorksheet("Sales").getTable("SalesData");
  const rows = table.getRangeBetweenHeaderAndTotal().getValues();
  let total = 0;
  for (const row of rows) {
    total += row[3] as number;
  }
  workbook.getWorksheet("Report").getRange("B2").setValue(total);
}
\`\`\`

Every script is a single \`main\` that receives the workbook. There is no \`ActiveSheet\` and no \`Selection\`, and that absence is the point: a script running before dawn has no active anything. You name what you touch or you do not touch it. The habit the VBA rewrite asked for is enforced here by the API.

### The round trip is the cost

\`\`\`typescript
// 9,998 separate calls to the service holding the workbook
for (let r = 2; r <= 5000; r++) {
  const v = sheet.getRange("C" + r).getValue() as number;
  sheet.getRange("D" + r).setValue(v * 1.17);
}

// two calls
const src = sheet.getRange("C2:C5000").getValues();
const out = src.map(row => [(row[0] as number) * 1.17]);
sheet.getRange("D2:D5000").setValues(out);
\`\`\`

Same lesson as the VBA array, sharper. In VBA the boundary is a process; here it is a network. The first version does not merely feel slow, it walks into the runtime cap and dies partway through, leaving half the column written.

### Where the script actually lives

Not in the workbook. In your OneDrive, under Documents and Office Scripts. Your colleague opens \`Report.xlsx\` from SharePoint, finds no automation of any kind, and assumes it was never built. Save anything shared to the SharePoint document library beside the file, or the handover fails on day one.

| | VBA | Office Scripts |
|---|---|---|
| Runs on | desktop Excel, Windows or Mac | Excel on the web and desktop M365 |
| Unattended run | no | yes, when called by a flow |
| File type | \`.xlsm\` | \`.xlsx\` |
| Code stored in | the workbook itself | OneDrive or SharePoint, separately |
| Reach outside the file | yes, through COM | none, workbook only |

### Parameters and return values

\`\`\`typescript
function main(workbook: ExcelScript.Workbook, region: string): string {
  // ... build the report for that region
  return "OK";
}
\`\`\`

A calling flow reads the parameter list to build its input boxes, and parses whatever you return. Keep the types simple: string, number, boolean, or an interface made of those. Return a \`Date\` or a class instance and the caller receives something it cannot read.

The Action Recorder will write a first draft for you, and it carries the recorder's usual habit of baking in the literal range you happened to select. Treat its output as a starting point, then swap those addresses for table and sheet lookups before it goes anywhere near a schedule.

### The limits worth knowing before you commit

A script is capped on runtime, and the allowance is tighter when a flow calls it than when you press Run yourself, so a job that finished on your screen can time out overnight. The workbook has to sit in OneDrive or SharePoint, because there is no service to talk to for a file on a local drive. And a script cannot reach outside its workbook at all: no other applications, no file system, no web request. When the report needs data from elsewhere, the calling flow fetches it and passes it in as a parameter.

That last restriction reads as a limitation and works as a discipline. The script does one thing, to one workbook, with inputs it was handed, which is exactly the shape you want for something that runs while everyone is asleep.
      `,
        [
          q('An Office Script loops 5,000 rows calling getValue then setValue on each one. Why does it crawl and then fail?', [
            'TypeScript loops run slower than the equivalent VBA loop',
            'Excel recalculates the whole sheet after every setValue call',
            'Each get and set is a separate round trip to the service',
            'The script re-reads the table headers on every iteration',
          ], 2, 'The workbook lives on a service rather than in local memory, so ten thousand individual calls burn the runtime allowance long before the loop ends.'),
          q('A colleague opens Report.xlsx from SharePoint and finds no automation anywhere. What is the likely reason?', [
            'The script sits in your OneDrive rather than inside the file',
            'Scripts only appear when the file is opened in desktop Excel',
            'The workbook was saved as .xlsx when it needed to be .xlsm',
            'Scripts stay hidden until the file is marked as trusted',
          ], 0, 'An Office Script is stored separately from the workbook, so a script kept in a personal OneDrive is invisible to everyone else until it is saved to a shared library.'),
          q('Which return value would stop a calling flow from reading a script\'s result?', [
            'A plain string such as the text OK',
            'A number giving how many rows were written',
            'A boolean saying whether the checks passed',
            'A Date object holding the last refresh time',
          ], 3, 'The caller parses simple types only, so a Date or a class instance comes back as something it cannot turn into a usable value.'),
        ]
      ),
      lesson('Power Automate: A Run That Happens Without You', 13, `
The finance pack went out at 06:10 every working day for nine months. Then the analyst who built the automation moved on, her account was disabled on the Friday, and on Monday nothing arrived. The run history showed one red line: the connection was no longer authorised.

A flow is a trigger plus a list of actions, and every one of those actions runs as somebody.

### The shape of a scheduled run

\`\`\`text
Trigger  Recurrence, 06:00, Asia/Karachi, Monday to Friday
1  Excel Online (Business) : Run script
     Location SharePoint   Library Finance
     File     Report.xlsx  Script  RefreshAndCheck
2  Parse JSON on the script result
3  Condition: status is equal to OK
     yes : convert the file to PDF, post it to the Teams channel
     no  : post the failure text and terminate as Failed
\`\`\`

### Connections belong to a person

The Run script action does not execute as "the flow". It executes as whoever signed in to create the Excel Online connection. Disable that account and the job dies quietly. Anything the business depends on should authenticate through a service account, and the flow should be co-owned or sit in a shared environment, so it does not leave the building with a leaver.

### The refresh that cannot happen in the cloud

The most common design failure is invisible from your desk. Your workbook's Power Query reads a CSV from a folder on your laptop, or a SQL Server behind the corporate firewall. From your machine it refreshes perfectly. The cloud has no route to either one, so at 06:00 the step fails with nobody watching.

Sources reachable from the cloud (SharePoint, OneDrive, Azure SQL, a published dataflow) refresh. Anything local does not. Either move the source into SharePoint, or have the flow fetch the data itself and hand it to the script as a parameter.

### Retries make duplicates

Actions retry automatically when the service returns a transient error. An "Add a row into a table" step that half succeeded and then retried leaves half the month's figures in twice, and the report reads as a very good month.

Design so that repeating the run is harmless: have the script clear the target table and write the whole batch, rather than appending. State it as a rule and hold to it. A scheduled job must be safe to run twice.

### Failure is silent unless you make noise

A flow that fails tells nobody. Add a final action that posts to a channel and set its Configure run after to include \`has failed\` and \`has timed out\`, so it fires precisely when the happy path did not. Power Automate also switches a flow off after a long run of failures and emails the owner, which helps only if the owner still has a mailbox.

| Trigger | Fires when | Suits |
|---|---|---|
| Recurrence | a clock you set | the daily or monthly run |
| When a file is created | the export lands in a folder | starting work the moment data arrives |
| When a new email arrives | a supplier sends the attachment | files you do not control |
| For a selected file | someone clicks it in SharePoint | a manual run with an audit trail |

### One at a time

A recurrence trigger does not wait for the previous run to finish. A job that takes 40 minutes on a 30 minute schedule ends up with two copies writing into the same workbook, and the losing copy overwrites the winner. Settings, Concurrency control, degree of parallelism 1. Set it before you find out the interesting way.
      `,
        [
          q('A daily flow stops the day its author leaves the company. What is the right fix for a business critical run?', [
            'Rebuild the flow whenever a team member changes role',
            'Authenticate the connection with a service account and co-own the flow',
            'Raise the flow timeout so it survives an account change',
            'Keep the workbook in the author\'s OneDrive rather than SharePoint',
          ], 1, 'Actions execute as whoever authorised the connection, so a run the business depends on needs an identity and an owner that outlive any one employee.'),
          q('Your workbook\'s query reads a CSV from a folder on your laptop. The scheduled flow runs it at 06:00. What happens?', [
            'It refreshes normally because the full file path is saved',
            'It refreshes but returns only the columns cached last time',
            'It fails, because the cloud has no route to your machine',
            'It queues the refresh until your laptop next comes online',
          ], 2, 'A cloud run can only reach cloud reachable sources, so a local path resolves to nothing and the step fails while nobody is watching.'),
          q('Which design makes an accidentally repeated run harmless?', [
            'Clear the target table, then write the whole batch each run',
            'Add one row to the table for every record as it arrives',
            'Configure the action to retry three times at longer intervals',
            'Append the rows and remove duplicates in a later flow step',
          ], 0, 'Rewriting the full batch gives the same end state whether the job runs once or five times, while appending leaves duplicated figures behind.'),
        ]
      ),
      lesson('Python in Excel and When It Beats a Formula', 13, `
A LAMBDA that computes a rolling 12 month median across 40,000 rows takes twenty lines to write and several seconds to recalculate. \`df.rolling(12).median()\` is one line, and you stop thinking about it. That gap is the entire case for Python in Excel.

### It runs in the cloud, not on your machine

Type \`=PY(\` in a cell, or use Formulas, Insert Python. The code is sent to a container in the Microsoft cloud, runs there against a preloaded Anaconda distribution, and the result comes back. Three consequences that people meet late: it needs a live internet connection, the referenced data leaves the device, and the round trip is measured in seconds rather than the microseconds a formula costs. It is not a faster Excel. It is a different tool reached from a cell.

### xl() is the only door in

\`\`\`python
=PY(
df = xl("Sales[#All]", headers=True)
df["Date"] = pd.to_datetime(df["Date"])
monthly = df.groupby(df["Date"].dt.to_period("M"))["Amount"].sum()
monthly.rolling(3).mean().round(0)
)
\`\`\`

\`xl("A2:C500", headers=True)\` returns a DataFrame, \`xl("Sales[Amount]")\` a Series, \`xl("B2")\` a single value. \`pd\`, \`np\`, \`plt\` and \`sns\` are already imported. There is no \`open()\`, no \`requests\`, no \`pip install\`: the container has no network path out and no sight of your disk, so everything the code sees arrives through \`xl()\`.

### The last line is the answer

There is no \`return\`. The value of the final expression becomes the cell's value, which is why this shows an empty cell:

\`\`\`python
total = monthly.sum()
\`\`\`

and this does not:

\`\`\`python
total = monthly.sum()
total
\`\`\`

Output defaults to a Python Object, drawn as a small card. Ctrl+Alt+Shift+M switches the cell to Excel Value, and a DataFrame then spills onto the grid as real cells you can chart, filter and reference.

### The calculation order that catches everyone

Ordinary formulas recalculate in dependency order: Excel works out what feeds what and does that first. Python cells do not. They run in row major order across the workbook, left to right, top to bottom, sheet by sheet. A Python cell in C5 that uses a variable defined by a Python cell in C20 fails, because C20 has not run yet.

The fix is layout, not code. Put definitions above and to the left of everything that uses them, and keep the setup cells on the first sheet of the book.

### When it earns its place

| Job | Reach for |
|---|---|
| Sums by category, lookups, growth rates | formulas, every time |
| Repeatable cleaning of a monthly file | Power Query |
| Rolling quantiles, matching untidy names | Python |
| Regression with p values and residual plots | Python, statsmodels |
| Seasonal decomposition, a clustering pass | Python |
| Anything a colleague without M365 must open | formulas |

\`LINEST\` gives you coefficients and standard errors. \`sm.OLS(y, sm.add_constant(X)).fit().summary()\` gives the same coefficients plus p values, confidence intervals, R squared and a warning when your predictors move together. When the question is whether a relationship is real rather than what its slope is, that difference is the whole answer.

The honest limits: a workbook full of Python cells opens slowly, calculates for nobody on an older licence, and hides logic where a reviewer will not think to look. Use it for work formulas genuinely cannot do, label those cells clearly, and leave the rest of the workbook readable by people who will never write a line of Python.
      `,
        [
          q('A Python cell in C5 uses a variable created by a Python cell in C20 on the same sheet. What is the result?', [
            'It works, because Excel resolves dependencies before any Python runs',
            'It works, but only once the workbook is closed and reopened',
            'C20 is promoted and calculated first because it holds the definition',
            'It fails, because Python cells run in row major order and C20 is later',
          ], 3, 'Python cells ignore the dependency graph and execute top to bottom, left to right, so a definition further down the sheet has not run when C5 asks for it.'),
          q('A Python cell whose final line is total = monthly.sum() shows nothing at all. Why?', [
            'The output type is set to Excel Value instead of Python Object',
            'The final line is an assignment, so there is no value to return',
            'A sum over a grouped Series cannot be displayed inside a cell',
            'The cell needs an explicit return statement on its last line',
          ], 1, 'The cell takes the value of its last expression, and an assignment is a statement rather than an expression, so repeating the bare name afterwards fixes it.'),
          q('Why can a Python in Excel cell not pull a currency rate from a web API?', [
            'The PY function strips import lines it does not recognise',
            'The requests library is missing from the shipped distribution',
            'The code runs in a cloud container with no network path out',
            'API calls need the workbook to be stored in SharePoint first',
          ], 2, 'The sandbox is deliberately closed, with no outbound network and no access to your disk, so every input has to arrive through the xl function.'),
        ]
      ),
      ],
      [
      q('A report must run at 06:00 against a workbook in SharePoint, whether or not anyone is logged in. What builds it?', [
        'An Office Script called by a scheduled Power Automate flow',
        'A VBA macro assigned to a shape on the report worksheet',
        'A Python in Excel cell that recalculates when the file opens',
        'A recorded macro started by the Windows task scheduler',
      ], 0, 'Only a script driven by a cloud schedule runs with no desktop session, since every VBA route still needs Excel open on a machine somebody signed in to.'),
      q('Which statement about where automation code is stored is correct?', [
        'VBA and Office Scripts are both saved inside the workbook file',
        'An Office Script sits in the workbook and VBA in a separate add-in',
        'Both are kept in OneDrive and attach to the file when it opens',
        'VBA sits inside the .xlsm file and an Office Script in OneDrive',
      ], 3, 'The two models differ on this point, and it is why a shared workbook can carry its VBA with it while a script has to be saved somewhere the team can reach.'),
      q('Why does reading one cell at a time hurt in VBA and in Office Scripts alike?', [
        'Both languages interpret loop bodies one statement at a time',
        'Each read crosses a boundary, a process in VBA and a network in scripts',
        'Excel recalculates every dependent formula after each single read',
        'Both runtimes cap how many distinct ranges the code may name',
      ], 1, 'The arithmetic is never the bottleneck; the repeated hop out of the runtime and back is, so both languages want one bulk read and one bulk write.'),
      q('Which is the strongest reason to keep a monthly sales total in a formula rather than a Python cell?', [
        'Python cannot aggregate a column without an extra helper library',
        'Python in Excel refuses to read any table that has a totals row',
        'The Python round trip goes to the cloud and needs a licence some lack',
        'Formulas evaluate in row major order, which is more predictable',
      ], 2, 'A plain total is exactly the work formulas do instantly and offline, so sending it to a cloud container adds latency and a licensing dependency for no gain.'),
      ]
    ),
    chapter(
      'When the Business Runs on Your Spreadsheet',
      'Spreadsheet risk, formal review, shared standards, and moving a critical model onto stronger tools without losing the logic inside it.',
      [
      lesson('How Spreadsheet Errors Become Expensive', 13, `
On 3 October 2020, Public Health England reported that 15,841 positive COVID-19 test results had never reached the contact tracing teams. No server had crashed. Lab results were being collated into an XLS workbook, the pre-2007 format that stops at 65,536 rows, and each test consumed several columns, so a template filled up after roughly 1,400 cases and quietly dropped everything after that. Tens of thousands of potentially infectious contacts were never called.

Nothing about that file looked broken. That is the whole problem.

### Errors are normal, not rare

Repeated field audits of working business spreadsheets have found errors in the large majority of files inspected, with per-cell error rates around 1 to 2 percent. Treat that as an engineering rate rather than a character flaw and do the arithmetic on your own model:

| Unique formulas | Chance of a clean model at 1% per formula |
|---|---|
| 10 | 90% |
| 50 | 61% |
| 200 | 13% |
| 500 | 0.7% |

A 200 formula model, which is a modest departmental report, carries roughly an 87% chance of at least one error somewhere inside it. Care does not change that number much. Process does.

### Three kinds of error, and only one is easy to find

**Mechanical.** A mistyped reference or a range that stopped short. Someone inserts a row at the bottom of the data and \`=SUM(B2:B12)\` never notices B13.

**Logical.** The right cells, the wrong maths. The 2012 JPMorgan task force report into the London Whale losses described a value-at-risk model operated through spreadsheets with manual copy and paste between them, where one step divided by the sum of two rates instead of their average. Reported volatility came out roughly half of what it should have been.

**Omission.** A rule nobody wrote down. The refund policy, the customer excluded since March, the region that reports a week late. Omissions survive every audit because there is no wrong cell to point at, and they are the expensive ones.

### The famous ones were all small

Reinhart and Rogoff's 2010 debt and growth paper averaged rows 30 to 44 when the data ran to row 49. Five countries silently vanished from a result that was quoted in national austerity debates. In 2003 TransAlta lost about 24 million US dollars when a cut and paste error misaligned rows in a bidding spreadsheet. Not one of these was an exotic formula. Each was one range, one paste, one format.

### Why spreadsheets get away with it

Application code gets review, tests, and a diff that shows exactly what changed. A workbook gets opened, edited, and saved. There is no diff, no author separate from the user, and no line between the program and the data it operates on. A colleague can retype over a formula in a fraction of a second and nobody will ever know unless a check catches it.

### Rate your files before you fix any of them

You cannot review every workbook in the business. Find the handful that can actually hurt you:

\`\`\`text
Score each file 1 to 3 and add up

Materiality   money or decisions the output moves
Audience      one person, a team, the board, a regulator
Lifetime      one afternoon, a quarter, four years and counting
Complexity    links, macros, queries, undocumented rules
Users         who can edit it today

11+   critical, formal review and a named owner
7-10  important, checks block and a second reader
under 7  leave it alone
\`\`\`

The reliable tell that a file has become a system: it has a name people say out loud, it runs to a schedule, someone acts on its output without checking, and more than one person edits it. \`Q3 model.xlsx\` is a document. \`Pricing.xlsx\` that quotes go out from is software with no tests, no owner, and no logs.

The rest of this chapter is about the files that score 11.
      `,
        [
          q('A departmental model contains about 200 unique formulas and the team is careful. What does a 1% per formula error rate imply?', [
            'Careful review makes the rate negligible in practice',
            'Errors concentrate in the newest formulas only',
            'Roughly an 87% chance the model carries at least one error',
            'About a 1% chance the model carries an error',
          ], 2, 'Independent chances compound, so 0.99 raised to 200 leaves only about 13% of models clean, which is why process rather than care is what moves the number.'),
          q('Why are omission errors harder to find than mechanical ones?', [
            'There is no wrong cell to point at, only a rule nobody recorded',
            'They occur mainly in very large workbooks',
            'Excel error checking does not run on hidden sheets',
            'They only appear after the file is shared widely',
          ], 0, 'An omission is a missing requirement rather than a faulty formula, so every cell audits as correct while the output stays wrong.'),
          q('Which of these most strongly suggests a workbook has become a system rather than a document?', [
            'It contains more than a thousand rows of data',
            'It uses several PivotTables and a chart',
            'It has been saved under a new name each quarter',
            'It runs to a schedule and people act on its output unchecked',
          ], 3, 'A scheduled run that others depend on without verifying is software behaviour, and it deserves ownership and tests that a one-off analysis does not need.'),
        ]
      ),
      lesson('Testing a Model Before Anyone Trusts It', 13, `
A pricing team spent three days chasing a 18,500 rupee gap between their model and the ledger. The cause was one cell: \`D103\` in a column of 500 formulas held a typed number, pasted in during a hurried month end two years earlier and never removed. Every review had read the formula at the top of the column and assumed the rest.

Assume nothing about a column. Ask it.

### Hunt the constants first

Select the range you believe is all formulas, then F5 → Special → **Constants** → Numbers. Every typed value inside a formula column lights up at once. On the report sheet, make it permanent:

\`\`\`excel
=COUNTA(D2:D500)-SUMPRODUCT(--ISFORMULA(D2:D500))
\`\`\`

That returns the number of hardcoded cells sitting in a column that should have none. Any answer above zero is a finding, not a curiosity. Excel's own inconsistent formula flag catches some of these, and the Inquire add-in (File → Options → Add-ins → COM Add-ins) reports them across a whole workbook, but the count above works everywhere and can live in the checks block.

### Known answer tests

Cut the input to six rows you can total on paper, run the model, and compare. If a model cannot reproduce a figure you worked out by hand, the argument is over. Then feed it the cases real data will eventually contain:

| Case | What it should do | What broken models do |
|---|---|---|
| Quantity of zero | Return zero revenue | \`#DIV/0!\` in the unit price column |
| A refund, quantity -3 | Reduce the total | Counted as a sale |
| Blank order date | Land in an unassigned bucket | Silently join January 1900 |
| Duplicate order ID | Flag it | Lookup takes the first row |
| Order on 31 December | Fall in the right period | Slips a year on a locale mismatch |

### Make the output move

Change one input by 10% and predict the output before you look. Two failures matter. If the output does not move at all, that input is not wired into the answer, which is the omission error from the previous topic showing itself. If it moves far more than you predicted, something is compounding that should not be.

### Reconcile against something built differently

A total agreeing with itself proves nothing. Foot the rows and cross-foot the columns, then compare both against a figure that came another way, such as the ledger or a \`GROUP BY\` from the source system.

\`\`\`excel
=IF(ROUND(SUM(RowTotals)-SUM(ColumnTotals),2)=0,"OK","CROSSFOOT FAIL")
\`\`\`

### Keep a baseline and diff against it

Before any change, paste the output block as values into \`baseline_2026-08.xlsx\`. After the change, compare cell by cell rather than eyeballing the headline:

\`\`\`excel
=IF(ROUND(Current!B5-Baseline!B5,2)=0,"",TEXT(Current!B5-Baseline!B5,"+#,##0.00;-#,##0.00"))
\`\`\`

Fill that across the output shape and every unexpected movement announces itself. Spreadsheet Compare, shipped with Inquire, does the same job across two whole files.

### Two traps that look like fixes

**Blanket IFERROR.** Wrapping the model in \`IFERROR(...,0)\` converts a loud \`#N/A\` into a quiet zero that flows into the total. Use it only where blank is genuinely the right answer, and keep a count of what it suppressed.

**Iterative calculation.** Enabling it to silence a circular reference warning does not resolve the circularity. It stops after a set number of passes, so the figure depends on how many times somebody pressed F9. Find the loop and break it.

### Sign it off

Record the reviewer and date on the Runbook sheet from Chapter 7 alongside the change log. A model nobody signed for is a model everybody assumes somebody else checked.
      `,
        [
          q('Why is =COUNTA(D2:D500)-SUMPRODUCT(--ISFORMULA(D2:D500)) worth putting in a checks block?', [
            'It measures how long the column takes to recalculate',
            'It counts hardcoded values sitting inside a formula column',
            'It confirms every formula in the column is identical',
            'It detects circular references in the column',
          ], 1, 'Subtracting the formula cells from the filled cells leaves the typed overrides, and any result above zero is a plug that has to be explained or removed.'),
          q('You raise one input by 10% and the headline output does not change at all. What does that indicate?', [
            'Calculation has been left on manual',
            'The model is correctly insulated from small changes',
            'The change was below the model\'s rounding threshold',
            'That input is not actually wired into the answer',
          ], 3, 'A live input must move the result, so a completely flat response points at a broken link or a requirement the model never implemented.'),
          q('What is wrong with enabling iterative calculation to clear a circular reference warning?', [
            'The result depends on how many passes ran, so it is not reproducible',
            'It disables automatic recalculation across the workbook',
            'It prevents the file from being saved as .xlsx',
            'It removes the ability to trace precedents',
          ], 0, 'Iteration stops after a fixed number of passes rather than resolving the loop, so the figure shifts with recalculation history instead of being determined by the inputs.'),
        ]
      ),
      lesson('Standards, Templates, and Analysis a Team Can Share', 13, `
Two analysts on the same team reported active customers for July. One said 41,200, the other 37,050. Both were right. One counted anyone who ordered in the last 90 days, the other used 30, and neither definition was written down anywhere. The meeting spent forty minutes on the discrepancy and zero minutes on the customers.

Shared analysis fails at definitions long before it fails at formulas.

### A definitions register, one row per metric

Put it on a \`Definitions\` sheet in the shared template, and make it the only place a metric is defined:

| Metric | Definition | Owner | Agreed |
|---|---|---|---|
| Active customer | At least one paid order in the trailing 90 days | Hafsa | 2026-03-11 |
| Revenue | Net of refunds and credit notes, excluding tax | Bilal | 2026-01-20 |
| Region | Ship-to region, not the billing address | Hafsa | 2026-04-02 |

Then implement each one once, as a named LAMBDA or a model measure, and have every report call that. Two implementations of one definition drift within a quarter, without exception.

### Colour tells the reviewer what a cell is

The convention financial modellers have used for decades, and the fastest review tool there is:

| Font colour | Meaning |
|---|---|
| Blue | A typed input, safe to change |
| Black | A formula calculated on this sheet |
| Green | A link to another sheet in this workbook |
| Red | A link to another workbook |

Build them as Cell Styles (Home → Cell Styles → New) rather than manual formatting, so they apply in one click and stay consistent. The payoff is instant: a blue cell in the middle of a black column is a hardcoded plug, visible from across the room without opening a single formula.

### Layout that carries the dependency direction

Sheets left to right in flow order: \`Cover\`, \`Inputs\`, \`Data\`, \`Calc\`, \`Output\`, \`Checks\`, \`Log\`. The rule that makes it worth anything is that no formula points to a sheet on its right. Break that once and the workbook can no longer be read in any order.

Within a sheet, one row means one formula, repeated identically across every column, with a single date header row that everything keys off.

\`\`\`text
BROKEN                Q2         Q3         Q4
 12  Revenue      =C10*C11   =D10*D11   =E10*E11+45000

FIXED                 Q2         Q3         Q4
 12  Revenue      =C10*C11   =D10*D11   =E10*E11
 13  Adjustment          0          0      45000
 14  Total         =C12+C13   =D12+D13   =E12+E13
\`\`\`

The broken row is arithmetically correct and unmaintainable. The one-off adjustment is invisible, and the next person who copies Q3 across the row silently deletes 45,000.

### Ship the template, then keep it alive

An \`.xltx\` template holding the cell styles, the sheet skeleton, the checks block from Chapter 7 and the definitions register is the cheapest standard you will ever deploy. The failure mode is equally predictable: everyone takes a copy on day one, and the fix you make in month three never reaches any of them.

Stamp the version inside the file and let the workbook complain about itself:

\`\`\`excel
TemplateVersion  =  3.1          named cell on the Cover sheet
=IF(TemplateVersion<LatestVersion,"TEMPLATE OUT OF DATE","OK")
\`\`\`

Keep the shared part small. A library of forty helper functions nobody remembers is worse than six that everybody uses.

### The review gate

Nothing that leaves the team is single-authored. A second reader who runs the checks block, opens Go To Special on the formula columns, and asks what changed since last month costs twenty minutes and catches the class of error that no amount of individual care will.
      `,
        [
          q('Why does the colour convention make a hardcoded plug easy to spot?', [
            'Excel refuses to calculate cells styled as inputs',
            'Blue cells are excluded from the workbook recalculation',
            'Conditional formatting recolours any changed cell',
            'A blue input cell sitting inside a black formula column is visible instantly',
          ], 3, 'The colour encodes what a cell is rather than how it looks, so an override announces itself without anyone opening a formula.'),
          q('What breaks if a formula on the Calc sheet points at the Output sheet to its right?', [
            'Excel raises a circular reference warning on open',
            'The workbook can no longer be read in sheet order, since dependencies now run both ways',
            'The Output sheet stops refreshing with the queries',
            'Cell styles stop applying to the Calc sheet',
          ], 1, 'Left to right flow is only useful while it holds everywhere, because one backward reference means a reader can no longer trust the order to explain the model.'),
          q('A shared .xltx template gets a fix in month three. Why does the fix usually fail to reach anyone?', [
            'Templates cannot be edited once distributed',
            'Cell styles are stored per user rather than per file',
            'Everyone took a copy on day one and their copies never look back',
            'Excel caches templates and ignores newer versions',
          ], 2, 'A template is copied rather than linked, so a version stamp that makes the workbook flag itself as stale is what turns a standard into a live one.'),
        ]
      ),
      lesson('Migrating Off Excel Without Losing the Logic', 13, `
A pricing engine rewritten in Python matched the retiring workbook on 98,412 of 98,500 lines. The 88 that differed were all off by exactly one cent, and all of them ended in a half cent. Excel's \`ROUND(2.5,0)\` returns 3. Python's \`round(2.5)\` returns 2, because it rounds half to even. Nobody had written that rule down, because in Excel nobody had ever needed to.

Migrations do not fail on architecture. They fail on the rules that were never spoken.

### Replace one layer at a time

A workbook that runs a business is doing four jobs at once, and they move at different speeds:

| Layer | What it does now | Where it usually goes |
|---|---|---|
| Capture | People typing into cells | A form writing to a database |
| Transformation | Power Query steps and cleanup | SQL views, or a scheduled job |
| Calculation | The formulas and the model | Measures in Power BI, or service code |
| Presentation | Sheets, pivots, the board pack | Last, and often still Excel |

Move the source of truth first so the workbook reads from the database instead of a CSV drop. Then move transformation. Then calculation. Presentation goes last, because it is the only layer users can see, and changing it first turns a technical project into a political one while every rule underneath is still unproven.

### Harvest the rules before writing any code

The logic is not only in the formulas. It is in the exception list a person applies by hand, the customer excluded since a dispute in March, the rounding done at line level rather than invoice level. Write each rule as one sentence plus one worked example with real numbers, and get the analyst who runs the file to disagree with your version. They will.

### Arithmetic that will not match

\`\`\`python
from decimal import Decimal, ROUND_HALF_UP

round(2.5)                                        # 2, banker's rounding
float(Decimal("2.5").quantize(Decimal("1"),
      rounding=ROUND_HALF_UP))                    # 3.0, matches Excel

0.1 + 0.2 == 0.3                                  # False, and Excel hides this
\`\`\`

Three more that show up in every reconciliation. Excel displays 15 significant digits and rounds the display, so a float difference invisible on the sheet appears in a database to the full precision. Excel's default date system treats serial 60 as 29 February 1900, a day that never existed, so naive serial conversion is a day out before 1 March 1900. And rounding at a different point in the chain, per line rather than per invoice, moves totals by pennies per row and thousands per year.

### Parallel run, reconciled line by line

Run both systems for three full cycles. Compare at line level, never on the grand total, because two opposite errors cancel beautifully in a sum.

\`\`\`sql
SELECT COALESCE(e.line_id, n.line_id) AS line_id,
       e.amount AS excel_amount,
       n.amount AS new_amount,
       ROUND(COALESCE(n.amount,0) - COALESCE(e.amount,0), 2) AS diff
FROM       excel_baseline e
FULL JOIN  new_engine     n ON n.line_id = e.line_id
WHERE  e.line_id IS NULL
    OR n.line_id IS NULL
    OR ROUND(n.amount - e.amount, 2) <> 0
ORDER BY ABS(ROUND(COALESCE(n.amount,0) - COALESCE(e.amount,0), 2)) DESC;
\`\`\`

Read the shape of the differences. All one direction means something systematic: rounding, a time zone, an inclusive date boundary. Scattered in both directions means data, usually a join that matched more rows than you expected. Sign off only when the remaining differences are explained, not when they are small.

### Decommission on purpose

Two live systems is worse than one bad system, because the answer people quote becomes whichever file they opened. Set the old workbook read only, rename it \`ARCHIVE 2026-09 pricing model.xlsx\`, and put a banner in A1 pointing at the replacement. If it can still be refreshed, somebody will refresh it, and they will quote the number.

### And sometimes the answer is to stay

One-off analysis, small stable inputs, a model one person owns and reads: Excel is the right tool and rewriting it buys nothing. Migrate the files that scored 11 in the first topic. Leave the rest alone.
      `,
        [
          q('A Python rewrite matches Excel except on values ending in a half cent, where it is one cent lower. What explains it?', [
            'Python rounds half to even while Excel rounds half away from zero',
            'Python stores currency as text and truncates it',
            'Excel calculates at higher precision than a float allows',
            'The two systems are reading different source data',
          ], 0, 'Banker\'s rounding sends 2.5 to 2 while Excel sends it to 3, so matching Excel requires an explicit ROUND_HALF_UP on a Decimal.'),
          q('Why is presentation usually the last layer to migrate?', [
            'It holds the largest volume of data',
            'Reporting tools cannot read a database directly',
            'It is the only layer users see, so moving it early makes the rules unprovable',
            'Charts are the slowest part of any workbook to rebuild',
          ], 2, 'Changing the visible surface first forces users to judge the migration before the calculations underneath have been reconciled, which turns a technical checkpoint into an argument.'),
          q('During a parallel run every difference points the same direction. What does that pattern suggest?', [
            'A join in the new system matched extra rows',
            'Something systematic such as rounding or a date boundary',
            'Random data entry errors in the source file',
            'The baseline extract was taken from the wrong period',
          ], 1, 'A consistent sign means one rule is applied differently on every line, whereas genuine data problems scatter differences in both directions.'),
        ]
      ),
      ],
      [
      q('Which workbook most deserves formal review under the rating approach from this chapter?', [
        'A 40,000 row file one analyst uses for ad hoc questions',
        'A heavily formatted board pack that only reads from a governed model',
        'A macro-enabled file that nobody has opened since last year',
        'A four year old pricing file two people edit that quotes go out from',
      ], 3, 'Materiality, multiple editors, a long life and unchecked downstream action are exactly the combination that turns a workbook into untested software.'),
      q('A reviewer wants the fastest single check on a 500 row calculation column. What should they run?', [
        'Go To Special on Constants to reveal typed values inside the column',
        'Trace Dependents from the column header',
        'Turn on Show Formulas and read down the column',
        'Recalculate the workbook with F9 and watch for changes',
      ], 0, 'Hardcoded plugs inside a formula column are the most common silent defect, and Constants highlights every one of them in a single action.'),
      q('Why does implementing a metric definition twice cause trouble even when both versions are correct today?', [
        'Excel cannot store two named formulas with related logic',
        'The two copies drift as rules change, and reports stop agreeing',
        'Duplicate definitions slow the workbook recalculation',
        'Only one definition can be referenced by a PivotTable',
      ], 1, 'One of the two copies always gets the next amendment, and the resulting disagreement is discovered in a meeting rather than by a check.'),
      q('A migration reconciles perfectly on the monthly grand total but was never compared line by line. What is the risk?', [
        'The new system may be slower than the workbook it replaces',
        'Row counts cannot be verified after the workbook is archived',
        'Offsetting errors cancel inside the sum and stay hidden',
        'Grand totals are stored at lower precision than line values',
      ], 2, 'Two mistakes of opposite sign add to zero at the top, so only a line level comparison proves the rules were actually reproduced.'),
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
      q('A monthly export renames Amount to Order Amount. You change the top step to Table.SelectColumns with MissingField.UseNull so the named columns still arrive, and a later step filters with each [Amount] > 1000. The refresh now succeeds. What does the loaded table contain?', [
      'A red error banner naming the missing column, because UseNull only delays the failure',
      'Every row, since Table.SelectRows treats a null condition as though it were true',
      'No rows at all and no error, because null > 1000 evaluates to null rather than true',
      'Every row with Amount showing 0, since UseNull fills a numeric column with zeros',
    ], 2, 'MissingField.UseNull hands the column back full of nulls so the query survives the rename, but null > 1000 evaluates to null, and Table.SelectRows keeps only rows where the condition is true, so every row is dropped silently and the report is empty rather than visibly broken.'),
    q('Customers Above 50k := COUNTROWS(FILTER(VALUES(Sales[Customer]), SUM(Sales[Amount]) > 50000)) was written with a bare SUM where the [Total Sales] measure belonged. What does it return?', [
      'Either every visible customer or none, because the bare SUM is not refiltered per customer',
      'The same answer as the measure version, since FILTER already supplies row context to SUM',
      'An error, because SUM may not be called inside a FILTER over a VALUES table like this',
      'A count of sales rows above 50,000, because FILTER iterates the Sales fact table itself',
    ], 0, 'Calling a measure from inside a row context triggers context transition, which turns the current row into a filter so the total is recomputed for that one customer; a bare SUM gets no transition, so it returns the same whole visible total on every pass and the comparison is true for all customers or false for all of them.'),
    q('Sales and Budget both hang off a one column Category bridge table. A slicer built on Products[Category] moves the sales figures but leaves the budget completely unchanged. Why?', [
      'The Budget relationship was created inactive, so it needs USERELATIONSHIP inside the measure',
      'Budget sits at a coarser grain, so HASONEVALUE blanks it for every slicer selection made',
      'Two paths now reach Budget, so the engine deactivated the one carrying the slicer filter',
      'Filters flow from the one side to the many, and Products is on the many side of the bridge',
    ], 3, 'Cross filtering travels from the one side of a relationship to the many side only, so a filter placed on Products stops there instead of propagating up to the Category bridge and back down to Budget, which is why a bridge model only works when the slicer is built on the bridge column itself.'),
    q('Ad spend sits in column B and store footfall in column C. =LINEST(D2:D37, B2:C37, TRUE, TRUE) returns 92.4, 3.18, 171500 across its first row and 21.6, 0.74, 38900 across its second. Which reading is correct?', [
      'Ad spend has a coefficient of 92.4, so each extra rupee of spend brings back about 92',
      'Footfall has a coefficient of 92.4, and its t statistic is 92.4 over 21.6, roughly 4.3',
      'Ad spend has a coefficient of 3.18 and a standard error of 21.6, so its t is about 0.15',
      'Footfall has a coefficient of 3.18 and a standard error of 0.74, so its t sits above 4',
    ], 1, 'LINEST returns its coefficients in reverse order of the X columns, so the leftmost 92.4 belongs to footfall, the last X column, and the standard error printed directly beneath a coefficient is the one that pairs with it, which puts footfall\'s t statistic at roughly 4.3.'),
    q('A daily flow calls an Office Script that appends the day\'s rows into a table. One morning a transient service error makes the action retry, and the table ends up holding part of the batch twice. Which change actually removes that risk?', [
      'Switch the action\'s automatic retry policy off so a transient failure surfaces at once',
      'Set concurrency control to a degree of parallelism of one so two runs cannot overlap',
      'Move the recurrence to a wider interval so transient errors have cleared before it fires',
      'Have the script clear the target table and write the whole batch, so a repeat is harmless',
    ], 3, 'Retries are how the platform absorbs transient errors, so the run itself has to be safe to repeat: a script that clears the target and rewrites the entire batch leaves the same result whether it runs once or three times, while an append step duplicates rows every time the action fires again.'),
    q('A parallel run of a new pricing engine agrees with the retiring workbook on the grand total, yet the line level comparison shows differences in both directions that happen to net to zero. What does that pattern point at?', [
      'A rounding rule difference, which a grand total will always mask by cancelling it out',
      'A date serial offset, since the totals are computed after the offset has been applied',
      'A data problem such as a join matching extra rows, which opposite errors hide in a sum',
      'A float precision gap, since Excel shows 15 digits and rounds every figure on display',
    ], 2, 'Differences that all point the same way suggest a systematic rule such as rounding or an inclusive date boundary, while differences scattered in both directions usually mean the new query matched a different set of rows, and either way the grand total is worthless as a check because opposite errors cancel inside a sum.'),
  ],
});
