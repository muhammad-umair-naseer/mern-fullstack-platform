import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'power-bi-business-intelligence',
  title: 'Power BI & Business Intelligence',
  category: 'Data',
  level: 'Beginner → Intermediate',
  duration: '6 weeks',
  accent: 'amber',
  coverKey: 'power-bi-business-intelligence',
  summary:
    'Turn messy spreadsheets and databases into interactive dashboards that managers actually use: Power Query, data modelling, DAX, report design, sharing and security, with a portfolio project and PL-300 preparation.',
  description:
    'You start with what business intelligence is and build your first Power BI report in minutes. Then you learn to connect and clean data with Power Query, shape messy spreadsheets, and design a proper star schema model with relationships and a date table. You write DAX measures, from simple totals to CALCULATE and time intelligence, and design interactive reports and dashboards that answer real business questions. Finally you publish to the Power BI Service, schedule refreshes, secure data with row-level security, tune performance, and finish with a portfolio project, PL-300 exam preparation and advice on BI jobs and freelancing.',
  chapters: [
    chapter(
      'Business Intelligence and Power BI',
      'Understand what business intelligence is and why companies invest in it, meet the Power BI family of tools, install Power BI Desktop and build a first working report.',
      [
      lesson('What Business Intelligence Is and Why Companies Pay for It', 12, `
Every business collects data: sales from tills and websites, stock levels, customer records, expenses, delivery times. Most of it sits in spreadsheets and databases that nobody looks at until something goes wrong. Business intelligence, usually shortened to BI, is the practice of turning that raw data into information people can act on, quickly and reliably.

### From data to decisions

Imagine Mehran Mart, a grocery chain with branches in Karachi, Lahore, Islamabad and Faisalabad. Every night each branch emails an Excel file of the day's sales to head office. A manager spends Monday morning copying the files together, building pivot tables and emailing a summary. By the time it arrives, the numbers are days old, and a copy-paste mistake occasionally makes them wrong.

A BI solution changes that:

| Before BI | After BI |
|---|---|
| Files emailed and copied by hand | Data loaded automatically every night |
| One static summary per week | Interactive dashboard, always current |
| Questions need a new spreadsheet | Managers filter and drill down themselves |
| Errors from manual copying | The same tested logic every time |
| Only head office sees the numbers | Each branch manager sees their own branch |

The manager's Monday morning is freed, the numbers are trusted, and decisions happen faster.

### The questions BI answers

BI mainly answers descriptive and diagnostic questions:

- What happened? Sales last month by branch and category.
- Where and when? Which branch, which week, which product.
- Why? Did sales fall because of fewer customers or smaller baskets?
- How are we tracking? Progress towards monthly targets.

More advanced analytics, such as forecasting and machine learning, build on this foundation. Without clean, trusted BI, those projects rarely succeed.

### The BI workflow

Almost every BI project follows the same four steps, and this course follows them too:

\`\`\`text
1. Get data      Connect to Excel files, databases, web sources
2. Transform     Clean and shape it so it is consistent
3. Model         Relate tables and define calculations
4. Visualise     Build reports and dashboards, then share them
\`\`\`

Most beginners want to jump straight to the charts. Experienced analysts know that most of the value, and most of the time, sits in steps 2 and 3. A beautiful chart built on messy data is still wrong.

### Why companies pay for BI skills

Organisations in banking, telecom, retail, pharmaceuticals, logistics and government all run on reports. People who can build reliable, self-updating dashboards save hours of manual work every week and help leaders act on current information. That is why roles such as data analyst, BI developer and reporting analyst are in steady demand, locally and for remote clients abroad.

### Where Power BI fits

Power BI is Microsoft's BI platform. It is widely used partly because it connects naturally to tools companies already have, such as Excel, SQL Server, SharePoint and Microsoft 365. Other tools like Tableau and Looker Studio do similar work, and the ideas in this course, clean data, good models and clear visuals, transfer to all of them.
      `,
        [
          q('What is business intelligence mainly about?', [
            'Storing as much data as possible on company servers',
            'Turning raw data into information people can act on',
            'Replacing every employee with automated software',
            'Designing company logos and brand colours',
          ], 1, 'BI turns scattered raw data into reliable, understandable information that supports decisions.'),
          q('In the four-step BI workflow, where do experienced analysts say most of the value lies?', [
            'Choosing chart colours',
            'Emailing the final report',
            'Transforming and modelling the data',
            'Buying more expensive computers',
          ], 2, 'Clean, well-modelled data is what makes reports correct; visuals built on messy data are still wrong.'),
          q('Which is a typical question BI answers?', [
            'What will the weather be next year in Karachi?',
            'Which font is most readable on mobile phones?',
            'How do we write a new mobile app?',
            'Which branch\'s sales fell last month, and why?',
          ], 3, 'BI focuses on describing and diagnosing what happened in the business, such as sales by branch and period.'),
        ]
      ),
      lesson('The Power BI Family: Desktop, Service and Mobile', 12, `
Power BI is not a single program. It is a family of tools that work together, and understanding which does what saves a lot of confusion when you start. Most of your building happens in one place, most sharing happens in another, and people consume the results in a third.

### The three main parts

| Part | What it is | Who uses it most |
|---|---|---|
| Power BI Desktop | A free Windows application for building reports | Analysts and report builders |
| Power BI Service | A website (app.powerbi.com) for publishing, sharing and refreshing | Everyone in the organisation |
| Power BI Mobile | Apps for phones and tablets | Managers on the move |

The usual workflow is simple: build in Desktop, publish to the Service, and people view the result in a browser, in Microsoft Teams or on their phones.

### Power BI Desktop

Desktop is where you connect to data, clean it with Power Query, build the data model, write DAX calculations and design report pages. It is free to download and use. It runs on Windows only; if you use a Mac, you can run Windows in a virtual machine or on a separate PC, or build some reports directly in the Service using a browser.

A Desktop file is saved with the \`.pbix\` extension. That file contains the queries, the model, the calculations, the report pages and, for imported data, a compressed copy of the data itself.

### Power BI Service

The Service is the cloud part. When you publish a report, it lands in a workspace in the Service, where you can:

- Share reports with colleagues and control who sees what.
- Schedule automatic data refreshes, so reports stay current.
- Pin visuals to dashboards and package content as apps.
- Set up alerts and subscriptions that email reports on a schedule.

The data behind a published report is called a semantic model. Older material calls it a dataset; the two names mean the same thing.

### Power BI Mobile

The mobile apps display published reports on phones and tablets. Report designers can create a special mobile layout for each page, so a sales manager in a car between branches sees large, readable numbers rather than a shrunken desktop page.

### Power BI and Microsoft Fabric

Microsoft now positions Power BI as part of Microsoft Fabric, a broader analytics platform that also includes data engineering and data warehousing tools. For a report builder, the core skills stay the same. You will see the Fabric name in the Service and in Microsoft's documentation.

### Licences in one paragraph

Desktop is free. Sharing content with others in the Service generally requires paid licences, such as Power BI Pro, or content hosted on a paid capacity. Chapter 10 covers licences and sharing in detail, and Microsoft's pricing page has the current options and costs.

### Where Excel still fits

Power BI does not replace Excel. Many analysts still use Excel for quick one-off analysis and use Power BI for repeatable, shared reporting. Power Query, the data preparation tool you meet in chapter 2, exists in both, so skills transfer directly between them.
      `,
        [
          q('Where do analysts usually build reports, including the data model and calculations?', [
            'Power BI Desktop',
            'Power BI Mobile',
            'Microsoft Word',
            'The Windows file explorer',
          ], 0, 'Desktop is the building tool for connecting data, modelling, writing DAX and designing pages.'),
          q('What is the main purpose of the Power BI Service?', [
            'Editing photos for reports',
            'Writing Python code offline',
            'Publishing, sharing and refreshing reports online',
            'Replacing the Windows operating system',
          ], 2, 'The Service is the cloud platform where reports are published, shared, secured and refreshed.'),
          q('What is a semantic model in Power BI?', [
            'A type of chart designed for displaying text data',
            'A licence that lets mobile users view reports',
            'A theme file that stores report colours and fonts',
            'The published data model behind reports',
          ], 3, 'Semantic model is the current name for the published data model that reports are built on.'),
        ]
      ),
      lesson('Installing Power BI Desktop and Touring the Interface', 12, `
Before building anything, you need Power BI Desktop installed and a feel for where things are. The interface looks busy at first, but it follows a clear pattern: a few main views on the left, panes on the right, and the ribbon across the top.

### Installing

There are two common ways to install Power BI Desktop on Windows:

| Method | Advantage |
|---|---|
| Microsoft Store | Updates install automatically every month |
| Direct download from Microsoft's Power BI site | Useful where the Store is blocked, for example on some company laptops |

Microsoft releases updates regularly, often monthly. The Store version keeps you current automatically, which matters because features and menus change over time. If your organisation manages your laptop, ask IT which version they support.

Power BI Desktop works best with a reasonable amount of memory. Larger models use more RAM, so close unnecessary programs when working with big files.

### The three main views

Down the left side are icons for the main views:

\`\`\`text
Report view   Design pages with charts, tables and slicers
Table view    See the rows of data in each table (formerly Data view)
Model view    See tables as boxes and the relationships between them
\`\`\`

Newer versions may also show a DAX query view for writing and testing DAX queries. You will spend most time in Report view, regularly visiting Model view and Table view to check your work.

### The panes on the right

In Report view, the right side holds several panes that you can open and close:

| Pane | What it does |
|---|---|
| Data | Lists every table, column and measure in your model |
| Visualizations | Choose a visual and assign fields to it |
| Format (inside Visualizations) | Change colours, titles, labels and sizes |
| Filters | Apply filters to a visual, a page or all pages |

When you select a visual on the canvas, the Visualizations pane shows its field wells, such as X-axis, Y-axis and Legend. Dragging fields from the Data pane into these wells is how you build charts.

### The ribbon

The ribbon at the top holds commands grouped into tabs. On the Home tab you will use these most:

- Get data, to connect to sources.
- Transform data, which opens the Power Query Editor.
- Refresh, to reload data from the sources.
- Publish, to send the report to the Power BI Service.

### Settings worth checking first

Open File, then Options and settings, then Options. Two areas are worth a look early on:

- Regional settings, which control how dates and numbers are interpreted. If a file uses day-month-year dates, the locale matters.
- Preview features, where Microsoft lets you try new features before full release. Enable them only if you understand they may change.

### Save early, save often

Save your work as a \`.pbix\` file straight away and keep files in a clear folder structure, such as one folder per project with a \`data\` subfolder for source files. Power BI files can grow large, and a simple structure makes it easier to move, back up and share your work later.
      `,
        [
          q('What is an advantage of installing Power BI Desktop from the Microsoft Store?', [
            'It includes free Pro licences for everyone',
            'It runs on macOS without Windows',
            'Updates install automatically',
            'It never needs an internet connection to install',
          ], 2, 'The Store version keeps itself up to date, which matters because Power BI releases updates frequently.'),
          q('Which view shows tables as boxes with the relationships between them?', [
            'Report view',
            'Model view',
            'Table view',
            'The Filters pane',
          ], 1, 'Model view displays tables and relationships, making it the place to design and check the data model.'),
          q('Why check regional settings early?', [
            'They control how dates and numbers are interpreted',
            'They change the colour of the ribbon',
            'They decide which licence you have',
            'They set your internet speed',
          ], 0, 'Locale settings affect how text dates and numbers are read, which can turn 03/04 into March or April.'),
        ]
      ),
      lesson('Your First Report in Twenty Minutes', 13, `
The fastest way to understand Power BI is to build something. In this walkthrough you load a small sales spreadsheet, create a few visuals and see them interact. Later chapters explain each step in depth; for now, the goal is a working report.

### The sample data

Create an Excel workbook named \`sales.xlsx\` with a sheet called \`Sales\` and a few dozen rows like these:

| OrderDate | Branch | Category | Product | Quantity | UnitPrice |
|---|---|---|---|---|---|
| 01/03/2025 | Karachi | Beverages | Green Tea 100g | 4 | 450 |
| 01/03/2025 | Lahore | Snacks | Salted Crisps | 10 | 60 |
| 02/03/2025 | Islamabad | Dairy | Yoghurt 1kg | 6 | 320 |
| 02/03/2025 | Faisalabad | Beverages | Mango Juice 1L | 8 | 280 |

Fill in rows for several branches, categories and dates across two or three months, so the charts have something interesting to show.

### Step 1: load the data

In Power BI Desktop, choose Get data, then Excel workbook, and select the file. In the Navigator, tick the \`Sales\` sheet. You will see two buttons: Load and Transform data. Choose Transform data to peek at Power Query, check that \`OrderDate\` is a date and \`Quantity\` and \`UnitPrice\` are numbers, then choose Close & Apply.

### Step 2: add a measure for revenue

In Report view, select the \`Sales\` table in the Data pane, choose New measure, and type:

\`\`\`dax
Revenue = SUMX ( Sales, Sales[Quantity] * Sales[UnitPrice] )
\`\`\`

This measure multiplies quantity by price for each row and adds up the results. Chapter 5 explains exactly how it works.

### Step 3: build four visuals

| Visual | Fields |
|---|---|
| Card | Revenue |
| Clustered column chart | Branch on the X-axis, Revenue on the Y-axis |
| Line chart | OrderDate on the X-axis, Revenue on the Y-axis |
| Slicer | Category |

Click a visual type in the Visualizations pane, then drag fields from the Data pane into the wells. Resize and arrange the visuals so the card sits at the top left, the column and line charts side by side, and the slicer on the right.

### Step 4: explore the interactions

Now use the report as a manager would:

- Click the Karachi column. The line chart and card update to show Karachi only.
- Choose Beverages in the slicer. Every visual filters to beverages.
- Hover over a point on the line chart to see a tooltip.

This cross-filtering happens automatically, because every visual uses the same model. It is one of the biggest differences from a static Excel chart.

### Step 5: add a title and save

Insert a text box with a clear title such as "Mehran Mart Sales, March to May 2025", then save the file as \`mehran-mart-sales.pbix\`.

### What you just did

In a few minutes you followed the complete BI workflow: you got data, checked its types, created a calculation, built visuals and explored them interactively. Every later chapter deepens one of those steps. Keep this file; you will improve it throughout the course.
      `,
        [
          q('What does the Revenue measure in the walkthrough calculate?', [
            'The number of rows in the Sales table',
            'The average unit price across all products',
            'Quantity times unit price for each row, added together',
            'The highest single sale in the table',
          ], 2, 'SUMX evaluates Quantity times UnitPrice row by row and sums the results to give total revenue.'),
          q('You click the Karachi column in the chart. What happens to the other visuals?', [
            'Nothing, visuals never affect each other',
            'The report closes and reopens',
            'The data is deleted for other branches',
            'They filter to show Karachi only',
          ], 3, 'Visuals on a page share the model, so selecting a data point cross-filters the other visuals automatically.'),
          q('Why choose Transform data instead of Load when first connecting?', [
            'To check and fix column types before loading',
            'Because Load deletes the Excel file',
            'Transform data is the only way to create visuals',
            'To publish the report immediately',
          ], 0, 'Opening Power Query first lets you confirm that dates and numbers have the right types before they reach the model.'),
        ]
      ),
      ],
      [
      q('What problem did Mehran Mart have before using BI?', [
        'Too few branches to report on',
        'Manual copying of files made reports slow and error-prone',
        'No sales data was being recorded',
        'Managers refused to look at any numbers',
      ], 1, 'Copying emailed spreadsheets by hand delayed reports and introduced mistakes, which automated BI removes.'),
      q('What file extension does Power BI Desktop use for reports?', [
        '.xlsx',
        '.docx',
        '.pbix',
        '.csv',
      ], 2, 'Power BI Desktop saves queries, model, calculations and report pages in a .pbix file.'),
      q('Which part of the Power BI family schedules automatic data refreshes?', [
        'Power BI Mobile',
        'The Visualizations pane',
        'The Format pane',
        'The Power BI Service',
      ], 3, 'Scheduled refresh is configured in the Service, which reloads data so published reports stay current.'),
      q('In Report view, how do you assign data to a chart?', [
        'Drag fields from the Data pane into the visual\'s wells',
        'Type numbers directly onto the chart',
        'Paste the data from Excel into the chart title',
        'Change the regional settings',
      ], 0, 'Fields dragged from the Data pane into wells such as X-axis and Y-axis define what a visual shows.'),
      ]
    ),
    chapter(
      'Getting Data In With Power Query',
      'Connect Power BI to Excel files, CSVs, whole folders, databases and web sources, work confidently in the Power Query Editor, and clean data so it is reliable before it reaches the model.',
      [
      lesson('Connecting to Excel, CSV and Folders', 13, `
Most BI projects in small and medium businesses start with files: Excel workbooks from accounts, CSV exports from a point-of-sale system, or a folder of daily reports. Power BI connects to all of them, and a few good habits at this stage save hours later.

### Excel workbooks: prefer tables

When you connect to an Excel workbook, the Navigator lists sheets, named ranges and Excel tables. Whenever you control the workbook, format the data as an Excel table (Insert, Table) and give it a clear name such as \`SalesData\`.

| Source type in Navigator | Behaviour |
|---|---|
| Sheet | Includes everything on the sheet, including stray notes and blank rows |
| Excel table | Includes only the table, and grows automatically as rows are added |
| Named range | A fixed area, which may miss new rows unless it is updated |

Tables are the most reliable because their boundaries move with the data.

### CSV and text files

CSV files look simple but hide traps. When connecting, check three settings in the preview dialog:

- **Delimiter**: comma, semicolon or tab. Some systems in Europe export with semicolons.
- **File origin or encoding**: UTF-8 is common. The wrong encoding turns Urdu names or special characters into strange symbols.
- **Data type detection**: Power BI guesses types from the first rows. You will confirm them in the next lesson.

### A folder of files: the most useful connector

Mehran Mart's branches each send a daily file, and head office saves them all in one folder:

\`\`\`text
Sales Exports/
  2025-03-01_karachi.csv
  2025-03-01_lahore.csv
  2025-03-01_islamabad.csv
  2025-03-02_karachi.csv
  ...
\`\`\`

Instead of connecting to each file, choose Get data, then Folder, and point to \`Sales Exports\`. Power BI lists every file with its name, extension and dates. Choose Combine & Transform Data, and Power Query stacks every file into one table.

To do this, Power Query creates helper queries: a sample file, a transformation applied to that sample, and a function that repeats the transformation for every file. Any cleaning you do on the sample is applied to all files automatically.

### Keep the file name

The file name often contains information, such as the branch or date. When combining, keep the \`Source.Name\` column that Power Query adds, then split it to extract the branch:

\`\`\`text
Source.Name                    Branch
2025-03-01_karachi.csv    ->   karachi
\`\`\`

You will learn to split columns in chapter 3.

### New files arrive automatically

The real power of the folder connector is what happens tomorrow. When new files are saved into the folder and you refresh, they are picked up and combined automatically. Nobody has to copy and paste again.

### Rules for a healthy folder

- Every file must have the same column structure. A file with an extra or renamed column can break the refresh.
- Keep only data files in the folder. A stray notes document or a temporary Excel file (starting with \`~$\`) causes errors, so filter by extension in Power Query if needed.
- Agree a naming pattern with whoever saves the files.

### Local paths versus shared locations

A file on your own laptop, such as \`C:\\Users\\you\\Desktop\\sales.xlsx\`, works in Desktop but cannot refresh in the Power BI Service without extra setup. For reports that will be shared, store files in SharePoint or OneDrive for work, which the Service can reach directly. Chapter 10 returns to this when you set up scheduled refresh.
      `,
        [
          q('Why prefer an Excel table over a sheet when connecting to a workbook?', [
            'Tables load faster on every computer, regardless of size',
            'A table grows with the data and excludes stray content',
            'Sheets cannot be loaded into Power BI at all',
            'Tables automatically create charts in the report',
          ], 1, 'Excel tables have boundaries that expand with new rows and exclude notes or blanks elsewhere on the sheet.'),
          q('What does the Folder connector with Combine & Transform Data do?', [
            'Opens each file in a separate report page',
            'Deletes files after loading them into the model',
            'Stacks all matching files into one table',
            'Converts CSV files into Excel workbooks',
          ], 2, 'The folder connector combines every file with the same structure into a single table and picks up new files on refresh.'),
          q('Which issue commonly breaks a folder-based refresh?', [
            'Files saved with dates in their names',
            'Too many rows in a single CSV file',
            'Using UTF-8 encoding',
            'A file with different columns from the others',
          ], 3, 'Combining relies on every file sharing the same structure, so an extra or renamed column can cause errors.'),
        ]
      ),
      lesson('The Power Query Editor and Applied Steps', 13, `
Power Query is the data preparation engine inside Power BI, and also inside Excel. It lets you clean and reshape data through menus, while quietly recording every action as a repeatable step. Understanding how those steps work is the key to reliable reports.

### Opening the editor

In Power BI Desktop, choose Transform data on the Home ribbon. The Power Query Editor opens in its own window, with four main areas:

| Area | Purpose |
|---|---|
| Queries pane (left) | Lists every query, usually one per table |
| Data preview (centre) | Shows a preview of the current query's rows |
| Ribbon (top) | Home, Transform, Add Column and View tabs |
| Query Settings (right) | The query name and its Applied Steps |

### Applied Steps: a recipe, not an edit

Every action you take becomes a step in the Applied Steps list. A typical query might show:

\`\`\`text
Source
Navigation
Promoted Headers
Changed Type
Removed Top Rows
Filtered Rows
Replaced Value
\`\`\`

Power Query never changes your source file. Instead, on every refresh it replays the recipe from the beginning on fresh data. That is why cleaning once in Power Query is so much better than cleaning by hand in Excel each week.

### Working with steps

- Click any step to see the data as it was at that point, which is excellent for debugging.
- Rename steps (right-click, Rename) with clear names like \`Removed test orders\`.
- Delete a step with the X beside it, but check later steps still work.
- Insert a step in the middle by selecting an earlier step and applying a new transformation; Power Query asks you to confirm.
- The gear icon beside some steps reopens the settings you used.

### Turn on the formula bar

Under the View tab, tick Formula Bar. Each step is actually a line of code in the M language, and the formula bar shows it:

\`\`\`powerquery
= Table.SelectRows(#"Changed Type", each [Quantity] > 0)
\`\`\`

You do not need to write M yet, but reading it helps you understand what each step does. Chapter 3 introduces M properly.

### Data profiling tools

Also under View, turn on:

- **Column quality**: shows the percentage of valid, error and empty values in each column.
- **Column distribution**: shows how many distinct and unique values each column has.
- **Column profile**: shows detailed statistics for the selected column.

By default these are calculated from the first 1,000 rows. Click the text at the bottom of the window to switch to profiling the entire dataset when you need an accurate picture.

### Load or not

Some queries are only helpers, such as a list of values used by another query. Right-click a query and untick Enable load to keep it out of the model, which keeps your model smaller and cleaner.

### Close & Apply

When you finish, choose Close & Apply. Power BI runs every query and loads the results into the model. Keep an eye on errors reported at this stage: they usually point to a step that fails on the full data but worked on the preview.
      `,
        [
          q('What happens to your source file when you apply steps in Power Query?', [
            'It is overwritten with the cleaned data',
            'It is moved into the report file',
            'It is converted into a CSV file',
            'Nothing, the steps are replayed on each refresh',
          ], 3, 'Power Query records a recipe of steps and reapplies it on refresh, leaving the original source unchanged.'),
          q('Why rename applied steps with clear names?', [
            'It makes the query easier to understand and debug',
            'Renamed steps run faster during refresh',
            'Power BI requires every step to be renamed',
            'It hides the steps from other users',
          ], 0, 'Descriptive step names document what the query does, helping you and colleagues maintain it.'),
          q('By default, how many rows do the data profiling tools examine?', [
            'Only the first 10 rows',
            'Every row in the source',
            'The first 1,000 rows',
            'The last 100 rows',
          ], 2, 'Profiling uses the top 1,000 rows unless you switch it to the entire dataset for a full picture.'),
        ]
      ),
      lesson('Cleaning Data: Types, Nulls, Duplicates and Errors', 14, `
Real data is messy. Dates arrive as text, prices contain the letters "Rs", some rows are blank, a few customers appear twice, and one cell says "N/A" in a numeric column. Power Query gives you tools for all of these, and cleaning them properly is what separates trustworthy reports from misleading ones.

### Set data types deliberately

Data types decide what you can do with a column: you cannot sum text or filter a date range on text. Power Query often adds an automatic Changed Type step, but it guesses from a sample, so always review it. The icon in each column header shows its type:

| Icon | Type | Use for |
|---|---|---|
| ABC | Text | Names, codes, phone numbers |
| 123 | Whole number | Counts, quantities |
| 1.2 | Decimal number | Prices, weights |
| Calendar | Date | Order dates |
| $ | Fixed decimal (currency) | Money, where rounding matters |

Treat codes like phone numbers, postcodes and CNIC numbers as text. Stored as numbers, they lose leading zeros and can be summed by accident.

### Dates in the wrong format

A date such as \`03/04/2025\` means 3 April in Pakistan and the UK but 4 March in the United States. If dates convert wrongly, right-click the column header, choose Change Type, then Using Locale, and pick the date type with the locale that matches the source, such as English (United Kingdom) or English (Pakistan).

### Cleaning text

- **Trim** removes spaces at the start and end, so "Karachi " matches "Karachi".
- **Clean** removes hidden, non-printable characters.
- **Capitalize Each Word** makes "LAHORE" and "lahore" consistent.
- **Replace Values** fixes known mistakes, such as "Isb" to "Islamabad", or removes "Rs" from prices before changing the type.

### Nulls and blanks

Power Query shows missing values as \`null\`. Decide what they mean before acting:

\`\`\`text
Blank Quantity on a sales row   -> probably an error; investigate or filter out
Blank Discount                  -> probably zero; replace null with 0
Blank Region for new customers  -> keep, but replace with "Unknown"
Fully blank rows                -> Home, Remove Rows, Remove Blank Rows
\`\`\`

For reports laid out with a value only on the first row of each group, Fill Down copies the value into the empty rows below it.

### Duplicates

Select the columns that define a unique record, such as \`OrderID\`, then choose Remove Rows, Remove Duplicates. Be careful: removing duplicates on the wrong column can delete valid data, such as two different orders on the same date. Also note that duplicate removal is case-sensitive, so trim and standardise text first.

### Errors

Errors appear when a conversion fails, such as text "N/A" in a column changed to a number. Options:

- **Replace Errors** with a value like null, when the value is genuinely unknown.
- **Remove Errors**, when the rows are unusable.
- **Keep Errors** temporarily, to inspect exactly which rows fail and fix the cause upstream.

Removing errors silently can hide a real problem, such as a whole branch exporting in a new format. Look before you delete.

### Order matters

Clean text before removing duplicates, and fix values before changing types. A good sequence for most tables is: remove unwanted rows, fix text, replace values, set types, handle nulls and errors, and finally remove duplicates.
      `,
        [
          q('Why should phone numbers and CNIC numbers be stored as text?', [
            'Text columns use less memory than numbers',
            'Numbers cannot be displayed in tables',
            'As numbers they lose leading zeros and can be summed by mistake',
            'Power BI only accepts text in slicers',
          ], 2, 'Identifiers are labels, not quantities, so text keeps their exact form and prevents meaningless arithmetic.'),
          q('A date column converts 03/04/2025 to 4 March, but the source means 3 April. What fixes it?', [
            'Removing duplicates from the column',
            'Changing the type using the source\'s locale',
            'Replacing errors with null',
            'Sorting the column in ascending order',
          ], 1, 'Change Type Using Locale tells Power Query how the source formats dates, so day and month are read correctly.'),
          q('Why is removing every error row automatically risky?', [
            'It makes the report load more slowly',
            'It changes the column names in the model',
            'Power BI cannot refresh after errors are removed',
            'It can hide a real problem, such as a source changing format',
          ], 3, 'Errors often signal an upstream change; inspecting them first prevents silently dropping important data.'),
        ]
      ),
      lesson('Connecting to Databases and the Web', 13, `
Files are a common starting point, but larger organisations keep their data in databases, and many useful datasets live on the web or behind APIs. Power BI connects to all of these, and connecting to a database brings one extra benefit worth understanding: query folding.

### Connecting to a SQL database

To connect to SQL Server, choose Get data, then SQL Server database, and enter:

| Field | Example | Notes |
|---|---|---|
| Server | \`sql01.mehranmart.local\` | Provided by the database team |
| Database | \`RetailDW\` | Optional, but narrows the Navigator |
| Data connectivity mode | Import or DirectQuery | Chapter 11 compares them; start with Import |

You then sign in with Windows credentials or a database username and password. The Navigator lists tables and views; select the ones you need. Similar connectors exist for PostgreSQL, MySQL, Oracle, Azure SQL and many others.

### Views and SQL queries

Database teams often create views, saved queries that present clean, business-ready data. Prefer views over raw tables when they exist. You can also type a SQL statement in the advanced options:

\`\`\`sql
SELECT OrderID, OrderDate, BranchID, ProductID, Quantity, UnitPrice
FROM sales.Orders
WHERE OrderDate >= '2024-01-01'
\`\`\`

This works, but it can prevent query folding for later steps, so many analysts prefer selecting a table or view and filtering in Power Query.

### Query folding

When you connect to a database and apply steps like filtering rows or removing columns, Power Query can translate those steps into a single SQL query that the database runs. This is called query folding.

\`\`\`text
Without folding: download 10 million rows, then filter in Power BI
With folding:    ask the database for the 200,000 rows you need
\`\`\`

Folding makes refreshes much faster and lighter. Right-click a step and look for View Native Query; if it is available, that step folds. Some transformations, such as certain custom columns, break folding, so apply filters and column removals early, before complex steps.

### Web pages

Choose Get data, then Web, and paste a URL. If the page contains HTML tables, the Navigator shows them, often with suggested tables Power Query detected. This works well for public reference data such as a list of cities or exchange rates published in a table. Web pages change their layout, so expect occasional maintenance.

### APIs returning JSON

Many services offer data through APIs that return JSON. The Web connector can call them, and Power Query turns the JSON into records and lists you can expand into columns. Keys and tokens should never be pasted into shared files carelessly; use the connector's authentication options or parameters, and follow your organisation's rules.

### Credentials and privacy levels

Power BI stores the credentials you use for each source. Manage them under File, Options and settings, Data source settings. When you combine data from different sources, Power BI asks for privacy levels (Private, Organizational or Public) to prevent sensitive data from one source being sent to another. Set them honestly rather than disabling the checks.

### Ask before you connect

Before connecting to a production database, ask its owners. They may prefer you use a reporting copy or a specific view, so your refreshes do not slow down systems that serve customers.
      `,
        [
          q('What is query folding?', [
            'Hiding columns in the report view',
            'Translating Power Query steps into a query the source runs',
            'Compressing a .pbix file before sharing',
            'Combining several CSV files from a folder',
          ], 1, 'Folding pushes steps like filters back to the database, so only the needed data is transferred.'),
          q('How can you check whether a step folds to the database?', [
            'Check the column quality bar',
            'Look at the file size of the report',
            'Refresh the report twice',
            'Right-click the step and look for View Native Query',
          ], 3, 'If View Native Query is available for a step, Power Query has translated it into a native database query.'),
          q('Why should you ask a database\'s owners before connecting reports to it?', [
            'Refreshes may slow systems that serve customers',
            'Databases cannot be read by Power BI without permission codes',
            'Owners must design every visual in the report',
            'Connecting deletes existing database tables',
          ], 0, 'Owners may point you to a reporting copy or view so that report refreshes do not burden production systems.'),
        ]
      ),
      ],
      [
      q('Which connector best handles a new sales file arriving in the same place every day?', [
        'A separate Excel connection for each file',
        'Copying each file into the report by hand',
        'The Folder connector with Combine & Transform',
        'The Web connector',
      ], 2, 'The folder connector combines all files with the same structure and includes new ones automatically on refresh.'),
      q('What is the Applied Steps list in Power Query?', [
        'A recorded recipe replayed on every refresh',
        'A list of report pages in the file',
        'The history of who opened the report',
        'A list of DAX measures in the model',
      ], 0, 'Each transformation becomes a step, and Power Query replays the steps in order whenever data is refreshed.'),
      q('A Discount column contains nulls that mean no discount was given. What is the sensible fix?', [
        'Remove every row with a null discount',
        'Change the column type to text',
        'Remove duplicates from the Discount column',
        'Replace null with 0',
      ], 3, 'When null means zero in the business, replacing it with 0 keeps rows and makes calculations correct.'),
      q('Why apply filters and column removals early when connecting to a database?', [
        'They must always be the final steps',
        'They are likely to fold, reducing data transferred',
        'They change the privacy level of the source',
        'Power BI rejects queries with late filters',
      ], 1, 'Early, simple steps usually fold to the source, so the database returns only the rows and columns you need.'),
      ]
    ),
    chapter(
      'Shaping Data Like a Pro',
      'Split and derive columns, unpivot spreadsheet-style layouts into analysis-ready tables, merge and append queries, and use parameters, functions and the M language to make preparation reusable.',
      [
      lesson('Splitting Columns, Custom Columns and Conditional Columns', 13, `
Cleaning fixes what is wrong with data. Shaping adds what is missing: a branch name hidden inside a file name, a revenue column that does not exist yet, a size band that managers want to filter by. Power Query offers three everyday tools for this.

### Splitting columns

Select a column, then choose Split Column on the Home or Transform tab. The common options:

| Split by | Example |
|---|---|
| Delimiter | \`2025-03-01_karachi.csv\` split at \`_\` gives date and file part |
| Number of characters | Product code \`BEV-00123\` split after 3 characters |
| Positions | Fixed-width exports from older systems |
| Lowercase to uppercase, digit to non-digit | Codes like \`KHI2025\` |

After splitting a file name, you might split again at \`.\` to remove \`.csv\`, then capitalise the result to get a clean \`Branch\` column: Karachi, Lahore, Islamabad.

The Extract command is a useful alternative when you only need part of a column, such as Text Before Delimiter or the first N characters, without creating extra columns.

### Custom columns

Add Column, then Custom Column, lets you write a formula that runs for every row. For a line total:

\`\`\`powerquery
[Quantity] * [UnitPrice]
\`\`\`

Column names go in square brackets, and M is case-sensitive, so \`[quantity]\` will fail if the column is \`Quantity\`. After adding a custom column, set its data type, because custom columns start with the "any" type.

A few useful formulas:

\`\`\`powerquery
Text.Upper([Branch])
Date.Year([OrderDate])
Text.Combine({[FirstName], [LastName]}, " ")
if [Quantity] = null then 0 else [Quantity]
\`\`\`

### Conditional columns

Managers often want groupings that do not exist in the source: order size bands, regions, or a flag for weekend sales. Add Column, then Conditional Column, gives a form where you build rules without writing code:

\`\`\`text
If   LineTotal  is greater than or equal to  5000  then  "Large"
Else if  LineTotal  is greater than or equal to  1000  then  "Medium"
Else  "Small"
\`\`\`

Rules are checked in order and stop at the first match, so put the most specific conditions first. Behind the scenes, Power Query writes an \`if ... then ... else\` expression you can later edit.

### Column From Examples

If you are unsure how to write a transformation, Add Column, then Column From Examples, lets you type the result you want for a few rows. For instance, typing "Karachi" beside \`2025-03-01_karachi.csv\` often lets Power Query work out the rule. Check the generated formula in the formula bar to confirm it does what you expect on all rows.

### Power Query or DAX?

You can create columns in Power Query or as DAX calculated columns in the model. A useful rule from experienced modellers: do row-level shaping as far upstream as possible. Columns created in Power Query are prepared once at refresh and usually compress better, while DAX is best kept for calculations that depend on filters, which chapter 5 explores.

### Remove what you do not need

Shaping also means removing. Every unused column increases model size and refresh time. Use Choose Columns to keep only what the report needs; you can always add a column back later by editing that step.
      `,
        [
          q('Why might the custom column formula [quantity] * [UnitPrice] fail?', [
            'M is case-sensitive and the column is named Quantity',
            'Custom columns cannot multiply numbers',
            'Square brackets are not allowed in M formulas',
            'UnitPrice must always be written in capitals',
          ], 0, 'M matches column names exactly, including capitalisation, so the reference must match the real name.'),
          q('In a conditional column, why put the most specific rule first?', [
            'Power Query sorts the rules alphabetically',
            'Only the first rule is ever evaluated',
            'Rules are checked in order and stop at the first match',
            'Later rules always override earlier ones',
          ], 2, 'Because evaluation stops at the first true condition, broad rules placed first would catch rows meant for specific ones.'),
          q('What should you do right after adding a custom column?', [
            'Remove duplicates from the whole table',
            'Rename the query',
            'Refresh the report in the Service',
            'Set its data type',
          ], 3, 'Custom columns start with the any type, so setting the correct type keeps calculations and filters working properly.'),
        ]
      ),
      lesson('Unpivoting Messy Spreadsheets', 14, `
Many spreadsheets are designed for people to read, not for analysis. The most common example has one column per month. It looks tidy on screen, but it makes analysis in Power BI awkward. Unpivoting turns it into the long, narrow shape that BI tools expect.

### The problem with wide tables

A regional manager sends targets like this:

| Branch | Jan | Feb | Mar | Apr |
|---|---|---|---|---|
| Karachi | 900,000 | 850,000 | 1,000,000 | 950,000 |
| Lahore | 800,000 | 780,000 | 900,000 | 870,000 |
| Islamabad | 500,000 | 520,000 | 560,000 | 540,000 |

To chart targets over time or compare them with actual sales by month, you would need a separate measure for each month column. Adding May means changing the model. This layout fights against filtering.

### The long shape

What Power BI needs is one row per branch per month:

| Branch | Month | Target |
|---|---|---|
| Karachi | Jan | 900,000 |
| Karachi | Feb | 850,000 |
| Lahore | Jan | 800,000 |

Now Month is a single column you can filter, slice and relate to a date table, and Target is one column you sum. This is sometimes called tidy or normalised data.

### How to unpivot

1. Select the columns that should stay as they are, here \`Branch\`.
2. Right-click and choose Unpivot Other Columns.
3. Rename the resulting \`Attribute\` column to \`Month\` and \`Value\` to \`Target\`.
4. Set the data types.

There is also an Unpivot Columns command that works on the columns you select. Prefer Unpivot Other Columns: when the manager adds a May column next month, it is unpivoted automatically, because the step only names the columns to keep.

\`\`\`powerquery
= Table.UnpivotOtherColumns(#"Changed Type", {"Branch"}, "Month", "Target")
\`\`\`

### Turning month names into dates

Month names alone do not relate to a date table. Add a custom column that builds a real date, for example the first day of each month:

\`\`\`powerquery
Date.FromText("1 " & [Month] & " 2025")
\`\`\`

If the year appears in a header or file name, extract it rather than typing it into the formula.

### Headers spread over two rows

Some sheets have a header in two rows, such as a year on the first row and months on the second. A common approach: transpose the table, fill down the year, merge the year and month into one column, transpose back, promote headers, then unpivot. It sounds complicated, but each step is a single menu command, and the query then handles every future file automatically.

### Pivoting: the reverse

Occasionally you need the opposite. Pivot Column turns values in one column into separate columns. It is useful for small lookup tables, for example turning a list of attributes into columns, but in general BI models favour the long shape.

### Totals rows and subtotals

Human-designed sheets often include "Total" rows and subtotal columns. Remove them in Power Query. Power BI calculates totals itself, and leaving them in means every total is counted twice.

### A quick test for any table

Ask: "If a new month, branch or product appears, does the table get more rows, or more columns?" In a good BI table, new data adds rows. If it adds columns, it probably needs unpivoting.
      `,
        [
          q('Why is a table with one column per month awkward for Power BI?', [
            'Power BI cannot load more than three columns',
            'Time cannot be filtered as one column, and new months change the model',
            'Wide tables cannot contain numbers',
            'Month names are not allowed as column headers',
          ], 1, 'Months spread across columns cannot be sliced as a single field, and every new month requires model changes.'),
          q('Why prefer Unpivot Other Columns over Unpivot Columns?', [
            'It runs twice as fast on every refresh',
            'It removes duplicates automatically',
            'It creates a date table as well',
            'New month columns are included automatically',
          ], 3, 'Unpivot Other Columns names only the columns to keep, so any new columns added later are unpivoted too.'),
          q('Why remove "Total" rows from a source spreadsheet?', [
            'Power BI calculates totals itself, so they would be counted twice',
            'Total rows are always wrong in Excel',
            'Power BI cannot display the word Total',
            'They prevent the query from refreshing',
          ], 0, 'Leaving source totals in the data inflates every sum, because Power BI adds them to the detail rows.'),
        ]
      ),
      lesson('Merging and Appending Queries', 13, `
Data often lives in more than one table. Sales lines might come from one system and product details from another; this year's data might be in one file and last year's in another. Power Query combines tables in two ways: appending stacks rows, and merging joins columns.

### Append: stacking tables

Append Queries puts the rows of one table under another. Use it when tables have the same columns but different rows:

\`\`\`text
Sales_2024  (OrderID, OrderDate, Branch, Amount)   120,000 rows
Sales_2025  (OrderID, OrderDate, Branch, Amount)    40,000 rows
Appended    (OrderID, OrderDate, Branch, Amount)   160,000 rows
\`\`\`

Columns are matched by name. If one table calls a column \`Branch\` and the other \`Store\`, you get two half-empty columns, so rename to match before appending. Choose Append Queries as New to keep the original queries unchanged and create a combined one.

### Merge: joining tables

Merge Queries adds columns from another table by matching keys, much like a lookup in Excel or a JOIN in SQL. For example, adding the supplier from a \`Products\` table to each sales row by matching \`ProductID\`.

After choosing Merge Queries, select the matching column in each table and a join kind:

| Join kind | Keeps |
|---|---|
| Left outer | All rows from the first table, matches from the second |
| Right outer | All rows from the second table, matches from the first |
| Full outer | All rows from both |
| Inner | Only rows with a match in both |
| Left anti | Rows in the first table with no match in the second |
| Right anti | Rows in the second table with no match in the first |

Left outer is the most common choice. The merge adds a column of nested tables; click the expand icon in its header and pick the columns you want, unticking "Use original column name as prefix" for cleaner names.

### Anti joins for data quality

Anti joins are excellent detectives. A left anti join from Sales to Products shows sales rows whose \`ProductID\` does not exist in the product list, perhaps new products someone forgot to add. Checking this regularly catches problems before managers see blank categories in reports.

### Merge in Power Query or relate in the model?

This is an important design decision. Merging product details into the sales table makes one wide table. Often it is better to keep \`Sales\` and \`Products\` as separate tables and create a relationship between them in the model, which chapter 4 covers. Relationships keep the model smaller and more flexible. Use merges for enriching a table with a few columns, for lookups during cleaning, or for data quality checks.

### Matching keys carefully

Merges fail silently when keys do not match exactly. "P-001" and "p-001 " are different to Power Query. Trim and standardise keys in both tables before merging, and make sure both columns have the same data type.

### Fuzzy matching

When names are typed inconsistently, such as "Mehran Mart Karachi" and "Mehran Mart, Karachi", the merge dialog offers fuzzy matching with a similarity threshold. It is useful for one-off cleaning, but review the results, because fuzzy matches can join things that should not match.
      `,
        [
          q('When should you use Append Queries?', [
            'To add product details to each sales row',
            'To find sales with no matching product',
            'To stack tables with the same columns, such as two years of sales',
            'To split a column into two parts',
          ], 2, 'Appending places the rows of one table under another when both share the same columns.'),
          q('Which join kind finds sales rows whose ProductID is missing from the product list?', [
            'Inner',
            'Full outer',
            'Right outer',
            'Left anti',
          ], 3, 'A left anti join returns rows in the first table that have no match in the second, revealing missing keys.'),
          q('Why might a merge silently miss matches?', [
            'Keys differ in case, spaces or data type',
            'Merges only work with numbers',
            'Power Query merges only the first 100 rows',
            'Merged tables cannot contain text columns',
          ], 0, 'Exact matching means small differences like trailing spaces or type mismatches prevent rows from joining.'),
        ]
      ),
      lesson('Parameters, Functions and a First Look at M', 13, `
Everything you do through Power Query menus is written as M code. You can build excellent reports without writing M from scratch, but knowing a little makes you much faster, and parameters and functions turn one-off queries into reusable tools.

### The shape of an M query

Open a query and choose Advanced Editor on the Home tab. You will see something like:

\`\`\`powerquery
let
    Source = Csv.Document(File.Contents("C:\\Data\\sales.csv"), [Delimiter = ","]),
    #"Promoted Headers" = Table.PromoteHeaders(Source),
    #"Changed Type" = Table.TransformColumnTypes(
        #"Promoted Headers",
        {{"OrderDate", type date}, {"Quantity", Int64.Type}}
    ),
    #"Filtered Rows" = Table.SelectRows(#"Changed Type", each [Quantity] > 0)
in
    #"Filtered Rows"
\`\`\`

The pattern is always the same:

- \`let\` starts a list of named steps, separated by commas.
- Each step usually takes the previous step as its input.
- Names with spaces are written as \`#"Step name"\`.
- \`in\` names the step whose result is returned.
- \`each\` is shorthand for a function applied to every row, with \`[Column]\` meaning that row's value.

### Parameters: values you can change in one place

Hard-coded paths and dates are fragile. If the data folder moves, you would have to edit every query. Instead, choose Manage Parameters, then New, and create:

| Parameter | Type | Example value |
|---|---|---|
| DataFolder | Text | \`C:\\Mehran Mart\\Sales Exports\\\` |
| StartDate | Date | 1 January 2024 |

Then use them in queries:

\`\`\`powerquery
Source = Folder.Files(DataFolder),
#"Recent" = Table.SelectRows(Source, each [Date modified] >= DateTime.From(StartDate))
\`\`\`

Now one change updates everything. Parameters can also be changed in the Power BI Service settings for published semantic models, which is useful when moving from a test folder to a production location.

### Custom functions: repeat logic safely

If the same cleaning applies to many tables, turn it into a function. The folder connector does this automatically when combining files. You can also create your own: right-click a query that uses a parameter and choose Create Function, or write one directly:

\`\`\`powerquery
(price as number, discountPct as number) as number =>
    price * (1 - discountPct / 100)
\`\`\`

Save it as a query named \`ApplyDiscount\`, then use Invoke Custom Function from the Add Column tab to call it for every row.

### Reading error messages

M errors mention the step and often the column. Common ones:

\`\`\`text
Expression.Error: The column 'Qty' of the table wasn't found.
  -> The source renamed a column; update the step or rename it back.
DataFormat.Error: We couldn't convert to Number.
  -> A value like "N/A" or "Rs 450" is in a numeric column.
\`\`\`

### How far to go with M

For most analysts, the right level is to read M confidently, make small edits in the formula bar and Advanced Editor, and use parameters and simple functions. Complex M is powerful, but code that nobody else in your team can read becomes a maintenance risk. Add comments with \`//\` for anything that is not obvious.
      `,
        [
          q('In an M query, what does the in keyword do?', [
            'Imports a file from a folder',
            'Starts a comment',
            'Declares a parameter',
            'Names the step whose result is returned',
          ], 3, 'A let expression defines named steps, and in specifies which one becomes the query\'s output.'),
          q('Why use a parameter for the data folder path?', [
            'Parameters make refreshes run twice as fast',
            'One change updates every query that uses the path',
            'Folder paths cannot be typed directly in M',
            'Parameters hide the data from other users',
          ], 1, 'A parameter stores the value in one place, so moving the data only requires updating the parameter.'),
          q('What does the error "The column \'Qty\' of the table wasn\'t found" usually mean?', [
            'The source column was renamed or removed',
            'The file is too large for Power BI',
            'The report needs a Pro licence',
            'Quantities cannot be stored as numbers',
          ], 0, 'The query refers to a column by name, so a renamed or missing source column breaks that step.'),
        ]
      ),
      ],
      [
      q('A file name like 2025-03-01_lahore.csv contains the branch. How do you extract it?', [
        'Merge the query with itself',
        'Split the column at the underscore and clean the result',
        'Unpivot the file name column',
        'Create a DAX measure for each branch',
      ], 1, 'Splitting by delimiter separates the date and branch parts, which can then be trimmed and capitalised.'),
      q('In a well-shaped BI table, what should happen when a new month of data arrives?', [
        'A new column is added for the month',
        'A new table is created',
        'The report must be rebuilt',
        'New rows are added',
      ], 3, 'Long, tidy tables grow by rows, which keeps filters, measures and the model unchanged as data arrives.'),
      q('What is often a better alternative to merging product details into a sales table?', [
        'Keeping separate tables and relating them in the model',
        'Appending the products table under sales',
        'Copying product names into every row by hand',
        'Deleting the products table',
      ], 0, 'Separate tables joined by a relationship keep the model smaller and more flexible than one wide merged table.'),
      q('What is the main benefit of a custom function in Power Query?', [
        'It removes the need for data types',
        'It replaces DAX measures in the report',
        'The same logic can be applied consistently to many rows or tables',
        'It publishes the report automatically',
      ], 2, 'Functions package repeated transformation logic so it is written once and reused reliably.'),
      ]
    ),
    chapter(
      'Data Modelling Foundations',
      'Separate facts from dimensions, arrange tables in a star schema, create relationships with the right cardinality and filter direction, and build a proper date table for time analysis.',
      [
      lesson('Fact Tables and Dimension Tables', 13, `
The data model is the heart of a Power BI report. Get it right and measures are simple, reports are fast and numbers are trustworthy. Get it wrong and even basic totals become a struggle. Good modelling starts with one idea: separating what happened from the things it happened to.

### Facts: what happened

A fact table records events or measurements. Each row is one thing that happened:

- A sales line: this product, sold at this branch, on this date, in this quantity.
- A delivery: this order, this driver, this time.
- A bank transaction: this account, this amount, this moment.

Fact tables are usually long, often millions of rows, and contain numbers you add up, such as \`Quantity\`, \`Amount\` or \`Duration\`, plus keys pointing to the things involved.

### Dimensions: who, what, where and when

Dimension tables describe the things involved in facts. They answer the questions managers use to slice data:

| Dimension | Example columns | Question it answers |
|---|---|---|
| Product | ProductID, Name, Category, Brand | What was sold? |
| Branch | BranchID, City, Region, Manager | Where was it sold? |
| Customer | CustomerID, Name, Segment | Who bought it? |
| Date | Date, Month, Quarter, Year | When was it sold? |

Dimensions are usually short and wide: hundreds or thousands of rows, with many descriptive text columns.

### Why not one big table?

Beginners often load one giant flat table with every column repeated on every row. It seems simpler, but it causes problems:

\`\`\`text
Flat table: 2,000,000 rows x 25 columns
  "Beverages", "Mehran Mart Karachi", "Sindh", "Ahmed Khan"...
  repeated on every single row

Star model: 2,000,000 fact rows x 6 columns
          + 800 products, 12 branches, 5,000 customers, 1,500 dates
\`\`\`

The flat version is larger, slower to refresh, harder to maintain when a product's category changes, and harder to extend when you add a second fact table such as targets or returns.

### Keys connect them

Each dimension has a key column that is unique for every row, such as \`ProductID\`. The fact table contains the same key, repeated for every sale of that product. Relationships between these columns let filters flow from dimensions to facts.

Keys are usually IDs from the source system. If a source has no clean ID, you can create one in Power Query, but make sure every fact row can find its dimension row.

### Identify facts and dimensions in your data

For each table, ask:

- Does each row represent an event, with numbers to add up? It is probably a fact.
- Does each row describe a thing, with mostly text attributes? It is probably a dimension.
- Is it a mix? Split it: keep event columns in the fact table and move descriptive columns to a dimension.

### Granularity

Every fact table has a grain: what exactly one row represents. "One row per product per order" is a different grain from "one row per order". State the grain explicitly for each fact table. Mixing grains in one table, such as order lines and order totals together, is a common source of double counting.
      `,
        [
          q('Which table is most likely a fact table?', [
            'A list of branches with city and manager',
            'Sales lines with date, product, branch and quantity',
            'A list of product categories',
            'A calendar of dates with month names',
          ], 1, 'Fact tables record events with numeric measures and keys, like individual sales lines.'),
          q('What is the grain of a fact table?', [
            'The number of columns it has',
            'The colour used for its visuals',
            'The date it was last refreshed',
            'What exactly one row represents',
          ], 3, 'The grain defines the level of detail of each row, such as one row per product per order.'),
          q('Why is one giant flat table often a poor model?', [
            'It repeats descriptive text, grows larger and is harder to maintain and extend',
            'Power BI cannot load tables with more than ten columns',
            'Flat tables cannot be filtered at all',
            'Flat tables are not allowed in the Power BI Service',
          ], 0, 'Repeating dimension attributes on every row inflates size and complicates changes and additional fact tables.'),
        ]
      ),
      lesson('The Star Schema in Power BI', 13, `
Once you separate facts from dimensions, arranging them follows a pattern so common it has a name: the star schema. Microsoft's own guidance recommends it for Power BI, and building models this way makes DAX simpler and reports faster.

### What a star looks like

In Model view, a star schema has a fact table in the middle, with dimension tables around it, each connected by a single relationship:

\`\`\`text
                Date
                 |
   Product --- Sales --- Branch
                 |
              Customer
\`\`\`

Every dimension connects directly to the fact table with a one-to-many relationship: one product, many sales. Dimensions do not connect to each other.

### Why stars work so well

| Benefit | Why |
|---|---|
| Simple filtering | Filters flow in one direction, from dimension to fact |
| Simple DAX | Measures aggregate one fact table, sliced by any dimension |
| Good performance | The engine is optimised for this shape |
| Easy to understand | Business users can see which fields describe what |
| Easy to extend | Add a new fact table that shares the same dimensions |

### Snowflakes and flattening

Sometimes a source has chains of dimensions: Sales to Product, Product to Subcategory, Subcategory to Category. This is a snowflake schema. It works, but it adds relationships and makes the Data pane more confusing. In Power BI, it is usually better to flatten the chain in Power Query by merging subcategory and category names into the Product table, giving one Product dimension.

### Several fact tables sharing dimensions

Mehran Mart also has monthly targets per branch. Rather than squeezing targets into the sales table, add a second fact table:

\`\`\`text
   Date ---- Sales ---- Branch
     \\                  /
      \\---- Targets ---/
\`\`\`

Both facts relate to the same \`Date\` and \`Branch\` dimensions. Now a single visual can show Sales and Targets side by side for each branch and month, because the dimensions filter both. Dimensions shared this way are called conformed dimensions.

Targets are monthly while sales are daily. Relate targets to the date table using the first day of each month, and design visuals at month level when comparing the two.

### Tidy up the model

A clean model is easier for report builders and for you six months from now:

- Hide key columns such as \`ProductID\` in the fact table, since users should filter using dimension columns.
- Hide raw numeric columns once you have created measures for them, so people use the measures.
- Use clear, business-friendly names: \`Sales\`, not \`tbl_fact_sales_v2\`.
- Group measures in a dedicated measures table or in display folders.
- Set Sort by Column so month names sort by month number rather than alphabetically.
- Set data categories, such as City or Country, to help map visuals.

### When a star is not possible

Some data genuinely needs more complex patterns, such as many-to-many relationships between students and courses. The next lesson covers those. Start from a star, and depart from it only when the business question requires it.
      `,
        [
          q('In a star schema, how do dimensions connect?', [
            'Each dimension connects to every other dimension',
            'Each dimension connects directly to the fact table',
            'Dimensions connect only to the date table',
            'Dimensions are not connected at all',
          ], 1, 'A star places the fact table at the centre, with each dimension related directly to it.'),
          q('What is usually recommended for a snowflake chain like Product, Subcategory, Category?', [
            'Keep all three tables and add more relationships',
            'Delete the category information',
            'Merge everything into the sales table',
            'Flatten it into one Product dimension in Power Query',
          ], 3, 'Flattening the chain gives a simpler star with one Product table containing subcategory and category names.'),
          q('Why hide key columns like ProductID in the fact table?', [
            'They slow down every visual',
            'Power BI requires hidden keys for relationships',
            'Users should filter using dimension columns instead',
            'Hidden columns do not use any memory',
          ], 2, 'Hiding fact keys steers report builders to the descriptive dimension fields that filter correctly.'),
        ]
      ),
      lesson('Relationships, Cardinality and Filter Direction', 13, `
Relationships are how filters travel through the model. When a manager selects "Beverages" in a slicer on the Product table, a relationship carries that filter to the Sales table so only beverage sales are counted. Understanding a relationship's settings explains most "why is this number wrong?" moments.

### Creating relationships

In Model view, drag a key column from one table onto the matching column in another, for example \`Product[ProductID]\` onto \`Sales[ProductID]\`. Power BI may also auto-detect relationships when loading data; always check them, because auto-detection can connect columns that merely share a name.

Double-click a relationship line to see its properties.

### Cardinality

Cardinality describes how many rows match on each side:

| Cardinality | Meaning | Typical use |
|---|---|---|
| One-to-many (1:*) | One dimension row matches many fact rows | Product to Sales; the normal case |
| One-to-one (1:1) | One row matches exactly one row | Rare; often the tables should be merged |
| Many-to-many (*:*) | Many rows on both sides | Special cases; use with care |

For one-to-many to work, the "one" side must have unique values. If \`Product[ProductID]\` contains a duplicate, Power BI refuses to create a one-to-many relationship. That is a data quality alarm: find and fix the duplicate in Power Query.

### Filter direction

Each relationship has a cross filter direction:

- **Single**: filters flow from the one side to the many side, from Product to Sales. This is the default and the right choice in almost all star schemas.
- **Both**: filters flow in both directions. Tempting, because it can make a slicer show only products that have sales, but it can create ambiguous paths, slow performance and confusing numbers.

A safer way to make a slicer show only relevant items is to add a visual-level filter on the slicer, for example a measure such as \`Revenue\` is not blank.

### Active and inactive relationships

Only one active relationship can exist between two tables. Suppose \`Sales\` has both \`OrderDate\` and \`DeliveryDate\`, and both should relate to \`Date\`. The first relationship is active (a solid line); the second is inactive (a dashed line). A measure can use the inactive one when needed:

\`\`\`dax
Revenue by Delivery Date =
CALCULATE (
    [Revenue],
    USERELATIONSHIP ( Sales[DeliveryDate], 'Date'[Date] )
)
\`\`\`

This pattern, one date table used in different roles, is called a role-playing dimension.

### When numbers look wrong

| Symptom | Likely cause |
|---|---|
| Every row shows the same total | No relationship, or the wrong column was related |
| A blank row appears in a slicer | Fact rows have keys missing from the dimension |
| Totals look inflated | Relationship on a column that is not unique, or mixed grain |
| Slicer shows items with no data | Normal with single direction; filter the slicer visual |

The blank row is especially useful: it tells you exactly which fact rows have no matching dimension row, often a new product not yet added to the product list. The anti join from chapter 3 finds them.

### Many-to-many with care

Genuine many-to-many situations, such as a customer belonging to several segments, are usually modelled with a bridge table between the two tables. Power BI also supports direct many-to-many relationships, but they are easy to misread. Use them only when you understand exactly how totals will behave.
      `,
        [
          q('Which cross filter direction suits almost all star schema relationships?', [
            'Single, from dimension to fact',
            'Both directions on every relationship',
            'None, relationships should not filter',
            'Single, from fact to dimension',
          ], 0, 'Single-direction filtering from dimensions to facts keeps a star model predictable and fast.'),
          q('A slicer shows a blank item. What does this usually indicate?', [
            'The report needs refreshing in the Service',
            'The slicer has the wrong colour theme',
            'Some fact rows have keys that are missing from the dimension',
            'The dimension has too many columns',
          ], 2, 'The blank member collects fact rows that cannot find a matching dimension row, revealing missing or mismatched keys.'),
          q('Sales has OrderDate and DeliveryDate, both related to Date. How do you calculate by DeliveryDate?', [
            'Delete the OrderDate relationship permanently',
            'Set both relationships to filter in both directions',
            'Create a second copy of every measure without relationships',
            'Use USERELATIONSHIP with the inactive relationship',
          ], 3, 'USERELATIONSHIP activates the inactive relationship for one measure, while the other remains the default.'),
        ]
      ),
      lesson('Building a Proper Date Table', 14, `
Almost every business question involves time: this month versus last month, year to date, the same period last year. Power BI's time intelligence functions need a proper date table to work reliably, and building one is among the first things experienced modellers do.

### Why not use the date column directly?

A sales table only contains dates when something was sold. There may be gaps for holidays or closed days, and it has no columns for month names, quarters or fiscal years. A dedicated date table has one row for every day in a continuous range, with all the attributes you need.

### Turn off Auto date/time

By default, Power BI creates a hidden date table for every date column in the model. It is convenient for a first report but bloats larger models and cannot be customised. Most professionals turn it off: File, Options and settings, Options, then under Current File, Data Load, untick Auto date/time. Do this before building your own date table.

### Creating a date table with DAX

Choose New table in Report or Table view, and write:

\`\`\`dax
Date =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2023, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Year", YEAR ( [Date] ),
    "Month Number", MONTH ( [Date] ),
    "Month", FORMAT ( [Date], "MMM" ),
    "Year Month", FORMAT ( [Date], "YYYY-MM" ),
    "Quarter", "Q" & QUARTER ( [Date] ),
    "Weekday", FORMAT ( [Date], "ddd" ),
    "Weekday Number", WEEKDAY ( [Date], 2 )
)
\`\`\`

\`CALENDAR\` produces one row per day between the two dates. Choose a range that covers all your data, from the earliest year to at least the end of the current year. You can also build a date table in Power Query, or use one provided by your data warehouse.

### Mark it as a date table

Select the table, then Table tools, Mark as date table, and choose the \`Date\` column. Power BI checks that the column contains unique, continuous dates with no blanks. Marking tells Power BI to use this table for time intelligence.

### Sort month names correctly

Month names sort alphabetically by default: Apr, Aug, Dec. Select the \`Month\` column, choose Sort by column, and pick \`Month Number\`. Do the same for weekday names with \`Weekday Number\`.

### Fiscal years

Pakistan's government and many companies use a fiscal year from July to June. Add columns for it:

\`\`\`dax
Fiscal Year =
VAR y = YEAR ( 'Date'[Date] )
RETURN IF ( MONTH ( 'Date'[Date] ) >= 7, "FY" & ( y + 1 ), "FY" & y )
\`\`\`

With this formula, 15 August 2025 falls in FY2026. Check your organisation's naming convention, since some label the same year FY2025-26.

### Relate it to the facts

Create a one-to-many relationship from \`Date[Date]\` to each fact table's date column, such as \`Sales[OrderDate]\` and \`Targets[MonthStart]\`. Make sure the fact date columns contain dates only, without time; a column with times will not match the date table.

### Useful extra columns

Depending on the business, add flags such as \`Is Weekend\`, \`Is Ramadan\` or \`Is Public Holiday\`. A holiday list can live in a small table merged into the date table in Power Query. These columns let managers compare, for example, Ramadan evenings with ordinary weeks, which is a common retail question in Pakistan.
      `,
        [
          q('Why is a dedicated date table better than the date column in the sales table?', [
            'It has every day in a continuous range, plus attributes like month and fiscal year',
            'Sales tables cannot contain date columns',
            'Date tables load faster than any other table',
            'It removes the need for relationships',
          ], 0, 'A continuous calendar with descriptive columns supports time intelligence and consistent filtering.'),
          q('What does Mark as date table check?', [
            'That the table has a colour theme',
            'That every date has sales',
            'That the table has fewer than 1,000 rows',
            'That the date column has unique, continuous dates with no blanks',
          ], 3, 'Power BI validates the date column so time intelligence functions can rely on a complete calendar.'),
          q('Why might a fact table date fail to match the date table?', [
            'The date table uses DAX',
            'The fact column contains times as well as dates',
            'The fact table has too many rows',
            'Month names are sorted alphabetically',
          ], 1, 'Date and time values do not equal plain dates, so fact dates should be converted to date only before relating.'),
        ]
      ),
      ],
      [
      q('Which question does a dimension table typically answer?', [
        'How much was sold in total?',
        'How many rows does the report have?',
        'Where, what, who or when something happened',
        'How fast the refresh runs',
      ], 2, 'Dimensions describe the context of events, such as product, branch, customer and date.'),
      q('Why add Targets as a separate fact table instead of forcing it into Sales?', [
        'Power BI allows only one column per fact table',
        'It has a different grain and can share the same dimensions',
        'Targets cannot be summed',
        'Separate tables remove the need for a date table',
      ], 1, 'Monthly targets and daily sales have different grains; sharing dimensions lets them be compared cleanly.'),
      q('Power BI refuses to create a one-to-many relationship from Product[ProductID]. What is the likely cause?', [
        'The Product table has too many columns',
        'The report has not been published',
        'The fact table has no dates',
        'ProductID has duplicate values',
      ], 3, 'The one side must have unique values, so a duplicate key blocks the relationship and signals a data quality problem.'),
      q('Why sort the Month column by Month Number?', [
        'So months appear in calendar order instead of alphabetically',
        'So months load faster during refresh',
        'Because text columns cannot appear on an axis',
        'So fiscal years start in July',
      ], 0, 'Sort by column makes month names follow the calendar order defined by their numeric column.'),
      ]
    ),
    chapter(
      'DAX Fundamentals',
      'Learn when to use calculated columns and when to use measures, write the core aggregations, understand row context, filter context and iterators, and keep DAX readable with variables and DIVIDE.',
      [
      lesson('Calculated Columns Versus Measures', 13, `
DAX, short for Data Analysis Expressions, is the formula language of Power BI. It looks similar to Excel formulas, but it works on whole tables and columns rather than cells. The first decision in any DAX calculation is where it belongs: in a calculated column or in a measure.

### Calculated columns

A calculated column adds a new column to a table. Its formula runs once for every row when the data is refreshed, and the results are stored in the model:

\`\`\`dax
Line Total = Sales[Quantity] * Sales[UnitPrice]
\`\`\`

After refresh, every row of \`Sales\` has a \`Line Total\` value. You can use it on an axis, in a slicer, or as a filter, just like any imported column.

### Measures

A measure is a calculation that runs at query time, whenever a visual needs it. It returns a single value for the current filters:

\`\`\`dax
Revenue = SUMX ( Sales, Sales[Quantity] * Sales[UnitPrice] )
\`\`\`

Put \`Revenue\` in a card and it shows the grand total. Put it in a chart by branch and it is calculated separately for each branch. Select Karachi in a slicer and it recalculates for Karachi. Nothing is stored; the answer is computed for each combination the visual asks for.

### Side by side

| | Calculated column | Measure |
|---|---|---|
| Calculated | At refresh, for every row | At query time, for each visual cell |
| Stored in model | Yes, uses memory | No, only the formula |
| Responds to slicers | No, values are fixed per row | Yes, recalculates for current filters |
| Can go on an axis or slicer | Yes | No |
| Typical use | Categorising rows, keys, flags | Totals, averages, ratios, comparisons |

### A simple rule

Ask: "Do I need to slice or filter by this value, row by row?" If yes, such as an order size band ("Small", "Medium", "Large") to use in a slicer, it is a column, and it is often better created in Power Query. If you want a number that summarises many rows and should change with filters, such as total revenue or average basket size, it is a measure.

### A common mistake

Beginners often write a calculated column for ratios:

\`\`\`dax
Margin % Column = DIVIDE ( Sales[Profit], Sales[Revenue] )
\`\`\`

This gives a margin for each row. But when a visual sums the column for a branch, it adds the percentages together, producing a meaningless 3,000% margin. A ratio must be calculated from totals, as a measure:

\`\`\`dax
Margin % = DIVIDE ( SUM ( Sales[Profit] ), SUM ( Sales[Revenue] ) )
\`\`\`

### Where to store measures

Measures belong to a home table, but they are not really part of any table's rows. Many modellers create an empty table named \`_Measures\` (Enter data, one blank column, then hide the column) and store all measures there, so they appear together at the top of the Data pane. Display folders help organise large numbers of measures into groups such as Sales, Targets and Customers.

### Explicit measures everywhere

Power BI lets you drag a numeric column into a visual and choose Sum or Average, creating an implicit measure. Explicit measures, written in DAX, are better: they have clear names, consistent formats and can be reused inside other measures. Make a habit of writing a measure for every number that appears in a report.
      `,
        [
          q('When is a calculated column the right choice?', [
            'For a total that should change when a slicer changes',
            'For a row-level value you want to slice or filter by',
            'For a percentage of total revenue',
            'For every number that appears on a card',
          ], 1, 'Columns store a fixed value per row, which makes them usable on axes, slicers and filters.'),
          q('Why does a margin percentage calculated as a column give wrong totals?', [
            'Columns cannot contain percentages',
            'DIVIDE does not work in calculated columns',
            'Columns are calculated at query time',
            'Visuals add the row percentages together instead of dividing the totals',
          ], 3, 'Ratios must be computed from aggregated values, so a measure dividing totals gives the correct result.'),
          q('What is an advantage of explicit measures over implicit ones?', [
            'Clear names, consistent formatting and reuse in other measures',
            'They are stored for every row, so they load faster',
            'They can be placed in slicers',
            'They do not require a data model',
          ], 0, 'Explicit DAX measures are named, formatted once and can be referenced by other measures, keeping reports consistent.'),
        ]
      ),
      lesson('Core Aggregations: SUM, AVERAGE, COUNTROWS and DISTINCTCOUNT', 13, `
Most report numbers come from a small set of aggregation functions. Knowing exactly what each one counts, and what it ignores, prevents a surprising number of wrong answers in meetings.

### The core functions

| Function | Returns | Example |
|---|---|---|
| \`SUM\` | Total of a numeric column | Total quantity sold |
| \`AVERAGE\` | Mean of a numeric column, ignoring blanks | Average unit price |
| \`MIN\`, \`MAX\` | Smallest or largest value | Earliest order date |
| \`COUNT\` | Number of non-blank values in a column | Rows with a discount code |
| \`COUNTROWS\` | Number of rows in a table | Number of sales lines |
| \`DISTINCTCOUNT\` | Number of different values | Number of unique customers |

### Writing the measures

\`\`\`dax
Quantity Sold = SUM ( Sales[Quantity] )

Sales Lines = COUNTROWS ( Sales )

Orders = DISTINCTCOUNT ( Sales[OrderID] )

Customers = DISTINCTCOUNT ( Sales[CustomerID] )

Average Unit Price = AVERAGE ( Sales[UnitPrice] )
\`\`\`

Notice the difference between \`Sales Lines\` and \`Orders\`. One order with three products creates three sales lines. Asking "how many orders?" with \`COUNTROWS\` would overcount. Always check the grain of the table, as chapter 4 described.

### Averages are tricky

\`Average Unit Price\` gives the average of the price column, treating every sales line equally. That may not be what the business means. Consider average basket value, the average spend per order:

\`\`\`dax
Average Basket = DIVIDE ( [Revenue], [Orders] )
\`\`\`

This divides total revenue by the number of orders, which is what managers usually mean by "average order value". An average of line values would give a very different, and misleading, number. Before writing an average, ask: "Average per what?"

### Reusing measures

Measures can reference other measures by name in square brackets, as \`Average Basket\` does. This is powerful: if the definition of \`Revenue\` changes, for example to exclude returns, every measure built on it updates automatically.

A good convention: reference columns with the table name, \`Sales[Quantity]\`, and measures without it, \`[Revenue]\`. Anyone reading the formula then knows immediately which is which.

### Blanks versus zeros

When there is no data for a combination, most aggregations return blank, not zero. Visuals hide rows where every measure is blank, which is usually helpful: a branch with no sales of a product does not clutter the table. If a manager specifically needs to see zeros, you can add \`+ 0\` to a measure, but this makes every combination appear, so use it deliberately.

### Formatting

Select a measure and set its format in the Measure tools ribbon: whole number with thousands separator for counts, currency or decimal for money, percentage for ratios. Formatting the measure once applies everywhere it is used, so every visual shows "PKR 1,250,000" consistently rather than 1250000.

### Checking your numbers

Before trusting a new measure, compare it with a known value. Build a simple table visual with the measure by month, then check one month against the source system or an Excel pivot. A few minutes of checking prevents a wrong number being presented to the managing director.
      `,
        [
          q('Why can COUNTROWS(Sales) overcount orders?', [
            'COUNTROWS ignores blank values',
            'COUNTROWS only counts the first 1,000 rows',
            'One order can have several sales lines',
            'COUNTROWS counts columns instead of rows',
          ], 2, 'When the grain is one row per product per order, counting rows counts lines, so DISTINCTCOUNT of OrderID is needed.'),
          q('What does average basket value usually mean to managers?', [
            'The average of the UnitPrice column',
            'Total revenue divided by the number of orders',
            'The highest order value in the period',
            'The number of products per category',
          ], 1, 'Average order value is revenue per order, which differs from averaging individual line values.'),
          q('What is the benefit of building measures on other measures, like [Revenue]?', [
            'It makes measures calculate at refresh time',
            'It converts measures into columns',
            'It removes the need for relationships',
            'A change to the base measure flows to every dependent measure',
          ], 3, 'Referencing a base measure keeps definitions consistent, since updating it updates all measures that use it.'),
        ]
      ),
      lesson('Row Context, Filter Context and Iterators', 14, `
Two ideas explain almost everything DAX does: filter context and row context. Once they click, formulas that seemed mysterious become predictable. This is the most important lesson in the chapter, so take it slowly.

### Filter context: which rows are visible

When a visual calculates a measure, it first applies filters: from slicers, from the filters pane, and from the row and column headers of the visual itself. The set of filters active for one calculation is its filter context.

Consider a matrix with branches on rows and years on columns. The cell for Lahore in 2025 calculates \`[Revenue]\` with the filter context:

\`\`\`text
Branch[City] = "Lahore"
'Date'[Year] = 2025
plus any slicer selections, such as Category = "Beverages"
\`\`\`

\`SUM ( Sales[Quantity] )\` then adds only the rows visible under those filters. The same measure in the next cell sees a different filter context and returns a different number. That is why one measure can fill a whole matrix.

Filters on dimension tables reach the fact table through relationships, as chapter 4 explained. A filter on \`Product[Category]\` flows to \`Sales\` along the Product to Sales relationship.

### Row context: the current row

Row context means "the row being evaluated right now". It exists in two places:

- In a calculated column, the formula runs once per row, so \`Sales[Quantity]\` means this row's quantity.
- Inside an iterator function, which loops over a table.

A plain measure has no row context. This is why the following measure fails:

\`\`\`dax
Revenue Wrong = Sales[Quantity] * Sales[UnitPrice]
\`\`\`

Without a current row, DAX cannot know which quantity you mean, and it returns an error about a single value not being determined.

### Iterators: creating row context in a measure

Functions ending in X, such as \`SUMX\`, \`AVERAGEX\`, \`MINX\`, \`MAXX\` and \`COUNTX\`, are iterators. They take a table, evaluate an expression for each row with a row context, then aggregate the results:

\`\`\`dax
Revenue = SUMX ( Sales, Sales[Quantity] * Sales[UnitPrice] )
\`\`\`

Step by step, for the current filter context:

1. Take the rows of \`Sales\` visible under the filters.
2. For each row, multiply its quantity by its price.
3. Add up all the results.

### Iterating over a dimension

Iterators can loop over any table, which enables powerful measures. Average revenue per branch:

\`\`\`dax
Avg Revenue per Branch =
AVERAGEX ( VALUES ( Branch[City] ), [Revenue] )
\`\`\`

\`VALUES ( Branch[City] )\` returns the list of visible branches. For each, \`[Revenue]\` is calculated, and the results are averaged. When a measure is used inside an iterator like this, DAX automatically turns the current row into a filter, a behaviour called context transition, which the next chapter builds on.

### Iterators and performance

Iterators over large fact tables are normal and fast for simple expressions. Problems appear when the expression inside is complex, especially nested iterators over millions of rows. If a measure is slow, look first at what it iterates over and how complex each step is.

### A mental checklist

When a DAX result surprises you, ask:

| Question | Why it helps |
|---|---|
| What filters are active for this cell? | Explains which rows are included |
| Is there a row context here? | Explains column references working or failing |
| Is an iterator looping over the right table? | Explains per-row versus total logic |
| Do relationships carry the filter to this table? | Explains unfiltered totals |
      `,
        [
          q('What is filter context?', [
            'The formatting applied to a measure',
            'The list of tables in the model',
            'The set of filters active when a value is calculated',
            'The order in which measures were created',
          ], 2, 'Filter context combines slicers, filters pane and visual headers to decide which rows a calculation sees.'),
          q('Why does the measure Sales[Quantity] * Sales[UnitPrice] fail?', [
            'Measures cannot multiply numbers',
            'The columns are in different tables',
            'The measure needs a date table first',
            'A measure has no row context to identify a single row',
          ], 3, 'Without a current row, DAX cannot choose one quantity and price, so an iterator like SUMX is needed.'),
          q('What does SUMX do?', [
            'Evaluates an expression for each row of a table and adds the results',
            'Sums a column and ignores all filters',
            'Counts distinct values in a column',
            'Creates a new table from two others',
          ], 0, 'SUMX iterates the visible rows, computing the expression per row, then sums those results.'),
        ]
      ),
      lesson('Variables, DIVIDE and Readable DAX', 12, `
DAX that works is good. DAX that works and can be read by a colleague, or by you in six months, is much better. Two tools make the biggest difference: variables and the DIVIDE function. Together with consistent formatting, they turn tangled formulas into clear logic.

### Variables with VAR and RETURN

Variables store an intermediate result, with a name, inside a measure:

\`\`\`dax
Revenue Growth % =
VAR CurrentRevenue = [Revenue]
VAR PreviousRevenue = [Revenue Last Year]
VAR Change = CurrentRevenue - PreviousRevenue
RETURN
    DIVIDE ( Change, PreviousRevenue )
\`\`\`

Variables bring three benefits:

- **Readability**: each step has a meaningful name.
- **Performance**: each variable is calculated once, even if used several times.
- **Debugging**: temporarily change \`RETURN\` to show \`CurrentRevenue\` or \`PreviousRevenue\` to check each step.

Variables are evaluated where they are defined, in the filter context at that point. That becomes important when combined with \`CALCULATE\` in the next chapter.

### DIVIDE instead of the slash

Dividing by zero or by blank is common in reports: a new branch has no sales last year, or a product has no orders this month. The \`/\` operator returns an error or infinity in these cases. \`DIVIDE\` handles them safely:

\`\`\`dax
Margin % = DIVIDE ( [Profit], [Revenue] )
Margin % Zero = DIVIDE ( [Profit], [Revenue], 0 )
\`\`\`

By default \`DIVIDE\` returns blank when the denominator is zero or blank, which hides meaningless cells. The optional third argument gives an alternative value, such as 0.

### Format your code

Long DAX on one line is hard to read. Put each function argument on its own line, indent nested functions, and put spaces inside parentheses. Compare:

\`\`\`dax
Top Branch Share = DIVIDE(MAXX(VALUES(Branch[City]),[Revenue]),CALCULATE([Revenue],ALL(Branch)))
\`\`\`

with:

\`\`\`dax
Top Branch Share =
VAR TopBranchRevenue =
    MAXX ( VALUES ( Branch[City] ), [Revenue] )
VAR AllBranchesRevenue =
    CALCULATE ( [Revenue], ALL ( Branch ) )
RETURN
    DIVIDE ( TopBranchRevenue, AllBranchesRevenue )
\`\`\`

Free tools such as DAX Formatter by SQLBI format code automatically. The DAX editor in Power BI also supports Shift+Enter for new lines and Tab for indentation.

### Comments

Explain the why, not the what:

\`\`\`dax
Active Customers =
// Customers with at least one order in the current period.
// Excludes staff accounts, which use the segment "Internal".
CALCULATE (
    DISTINCTCOUNT ( Sales[CustomerID] ),
    Customer[Segment] <> "Internal"
)
\`\`\`

Use \`//\` for single-line comments and \`/* ... */\` for longer notes.

### Naming conventions

Choose conventions and use them everywhere:

| Convention | Example |
|---|---|
| Measures named for the business | \`Revenue\`, \`Orders\`, \`Average Basket\` |
| Time variants as suffixes | \`Revenue LY\`, \`Revenue YTD\` |
| Percentages marked clearly | \`Margin %\`, \`Revenue Growth %\` |
| No technical prefixes for users | Avoid \`m_Rev_Tot_v2\` |

A report's measure list is part of its user interface. Clear names let managers build their own visuals with confidence.
      `,
        [
          q('What is one benefit of using variables in DAX?', [
            'Variables store results permanently in the model',
            'Each variable is calculated once and makes the logic readable',
            'Variables can be used as slicers',
            'Variables remove the need for relationships',
          ], 1, 'Variables name intermediate steps and avoid repeated calculation, improving both clarity and performance.'),
          q('What does DIVIDE return by default when the denominator is zero?', [
            'An error that stops the visual',
            'Infinity',
            'Blank',
            'The numerator unchanged',
          ], 2, 'DIVIDE returns blank for zero or blank denominators unless an alternative result is given.'),
          q('What should a DAX comment mainly explain?', [
            'The colour of the visual that uses the measure',
            'Every function\'s definition from the documentation',
            'The name of the person who wrote it, only',
            'Why the logic works this way, such as business rules',
          ], 3, 'Comments are most useful when they record business reasons and exceptions that the code alone cannot show.'),
        ]
      ),
      ],
      [
      q('Which calculation should be a measure rather than a calculated column?', [
        'Total revenue that changes with slicers',
        'An order size band used in a slicer',
        'A flag marking weekend orders',
        'A key combining branch and date',
      ], 0, 'Values that summarise many rows and respond to filters belong in measures.'),
      q('How do you count unique customers who bought something?', [
        'COUNTROWS ( Sales )',
        'SUM ( Sales[CustomerID] )',
        'COUNT ( Customer[Name] )',
        'DISTINCTCOUNT ( Sales[CustomerID] )',
      ], 3, 'DISTINCTCOUNT on the customer key in the fact table counts each purchasing customer once.'),
      q('Why can one measure show different values in each cell of a matrix?', [
        'It is copied into a new column for each cell',
        'Each cell has its own filter context',
        'The matrix stores a separate formula per cell',
        'Measures are random until refreshed',
      ], 1, 'Row and column headers add filters to each cell, so the same formula calculates over different rows.'),
      q('What makes DIVIDE safer than the / operator?', [
        'It always returns zero',
        'It rounds results to whole numbers',
        'It handles zero or blank denominators without errors',
        'It works only on calculated columns',
      ], 2, 'DIVIDE returns blank or a chosen alternative when the denominator is zero or blank, avoiding errors.'),
      ]
    ),
    chapter(
      'CALCULATE and Time Intelligence',
      'Use CALCULATE to change the filter context, compute percentages of total with ALL and REMOVEFILTERS, and build year-to-date, previous-year, growth, rolling and running-total measures.',
      [
      lesson('CALCULATE and Changing the Filter Context', 14, `
If you learn one DAX function deeply, make it \`CALCULATE\`. It is the only function that lets you change the filter context of a calculation, and almost every interesting business measure depends on it: sales for one category, last year's revenue, percentage of total, targets achieved.

### The basic pattern

\`\`\`dax
CALCULATE ( <expression>, <filter 1>, <filter 2>, ... )
\`\`\`

\`CALCULATE\` evaluates the expression, usually a measure, after modifying the filter context with the filters you provide.

\`\`\`dax
Beverage Revenue =
CALCULATE ( [Revenue], Product[Category] = "Beverages" )
\`\`\`

Put \`Beverage Revenue\` in a table by branch and you get beverage revenue for each branch, whatever else is selected, apart from the category.

### Filters replace, not add

This is the key behaviour to understand. A filter argument on a column replaces any existing filter on that same column. Suppose the report has a Category slicer set to "Snacks":

| Measure | Result with Snacks selected |
|---|---|
| \`[Revenue]\` | Snacks revenue |
| \`[Beverage Revenue]\` | Beverages revenue, because the filter on Category was replaced |

Filters on other columns, such as Branch or Date, stay in place. If you want the new filter to intersect with the existing one instead of replacing it, wrap it in \`KEEPFILTERS\`:

\`\`\`dax
Beverage Revenue Kept =
CALCULATE ( [Revenue], KEEPFILTERS ( Product[Category] = "Beverages" ) )
\`\`\`

With Snacks selected, this returns blank, because no product is both Snacks and Beverages.

### Several filters at once

Multiple filter arguments are combined with AND:

\`\`\`dax
Karachi Beverage Revenue =
CALCULATE (
    [Revenue],
    Product[Category] = "Beverages",
    Branch[City] = "Karachi"
)
\`\`\`

For OR conditions on one column, use \`IN\`:

\`\`\`dax
Hot Drinks Revenue =
CALCULATE ( [Revenue], Product[Subcategory] IN { "Tea", "Coffee" } )
\`\`\`

### Filters on measures need FILTER

A simple filter argument compares a column with a value. To filter by a measure, such as customers who spent more than PKR 50,000, use \`FILTER\` over a table:

\`\`\`dax
Revenue from Big Customers =
CALCULATE (
    [Revenue],
    FILTER ( VALUES ( Customer[CustomerID] ), [Revenue] > 50000 )
)
\`\`\`

\`FILTER\` iterates the visible customers and keeps those whose revenue exceeds the threshold. Keep \`FILTER\` for cases that need it, and filter on columns directly when you can; it is simpler and faster.

### Context transition

When \`CALCULATE\` runs inside a row context, such as in a calculated column or an iterator, it converts the current row into a filter. This is context transition, and it is why measures can be used inside \`SUMX\` or \`AVERAGEX\` over a dimension:

\`\`\`dax
Customer Lifetime Revenue =
CALCULATE ( [Revenue] )  // as a calculated column in the Customer table
\`\`\`

In each row of \`Customer\`, the row becomes a filter on that customer, so the column shows each customer's total revenue. Every measure reference is implicitly wrapped in \`CALCULATE\`, which is why \`[Revenue]\` inside an iterator behaves the same way.

### Why this matters

Once you can change the filter context deliberately, you can express nearly any business rule: a specific segment, a comparison period, a benchmark, or a total that ignores some filters. The rest of this chapter applies \`CALCULATE\` to the questions managers ask most often.
      `,
        [
          q('A slicer selects Snacks. What does CALCULATE([Revenue], Product[Category] = "Beverages") return?', [
            'Snacks revenue',
            'Blank',
            'Beverages revenue',
            'Snacks plus Beverages revenue',
          ], 2, 'A filter argument on the same column replaces the slicer\'s filter, so the result is Beverages revenue.'),
          q('How do you make a CALCULATE filter intersect with the existing filter instead of replacing it?', [
            'Use the ALL function around the filter',
            'Add a second CALCULATE inside the first one',
            'Wrap the filter in KEEPFILTERS',
            'Move the filter into a calculated column',
          ], 2, 'KEEPFILTERS combines the new condition with existing filters rather than overwriting them.'),
          q('When do you need FILTER inside CALCULATE?', [
            'When the condition uses a measure',
            'Whenever you filter by a text column',
            'Every time you use CALCULATE',
            'Only when working with date tables',
          ], 0, 'Simple column filters work directly, but conditions on measures require iterating a table with FILTER.'),
        ]
      ),
      lesson('ALL, REMOVEFILTERS and Percent of Total', 13, `
Managers rarely want raw numbers alone. They want context: what share of total sales does Karachi contribute? What percentage of the category does this product represent? These questions need a measure that deliberately ignores some filters to find the total, then divides by it.

### Removing filters

\`ALL\` and \`REMOVEFILTERS\` remove filters from a table or column when used as \`CALCULATE\` filter arguments:

\`\`\`dax
Revenue All Branches =
CALCULATE ( [Revenue], REMOVEFILTERS ( Branch ) )
\`\`\`

In a table with branches on rows, every row now shows the total for all branches, while other filters such as year or category still apply. \`REMOVEFILTERS\` is a newer, clearer name for this use of \`ALL\`; they behave the same inside \`CALCULATE\`. \`ALL\` also works as a table function returning all rows, which \`REMOVEFILTERS\` does not.

### Percent of total

\`\`\`dax
Branch Share % =
DIVIDE ( [Revenue], [Revenue All Branches] )
\`\`\`

| Branch | Revenue | Branch Share % |
|---|---|---|
| Karachi | 4,200,000 | 42% |
| Lahore | 3,100,000 | 31% |
| Islamabad | 1,700,000 | 17% |
| Faisalabad | 1,000,000 | 10% |
| Total | 10,000,000 | 100% |

With a year slicer set to 2025, both numerator and denominator respect the year, so shares are for 2025.

### Choose what to remove carefully

The choice of table or column changes the meaning:

| Filter removal | Meaning of the denominator |
|---|---|
| \`REMOVEFILTERS ( Branch )\` | All branches, same product and date filters |
| \`REMOVEFILTERS ( Branch[City] )\` | Only the city filter removed; other Branch columns still filter |
| \`REMOVEFILTERS ( Product )\` | All products, current branch |
| \`REMOVEFILTERS ()\` | Everything removed: grand total of the whole model |

Ask what the share should be "of". Share of the branch's own sales? Share of the company? Share of the category? Each needs a different removal.

### ALLSELECTED: respecting the user's selection

Suppose a user selects three branches in a slicer. Should shares add up to 100% across those three, or show each branch's share of all branches? \`ALLSELECTED\` removes filters from the visual but keeps the outer selections from slicers:

\`\`\`dax
Share of Selected % =
DIVIDE (
    [Revenue],
    CALCULATE ( [Revenue], ALLSELECTED ( Branch ) )
)
\`\`\`

With three branches selected, the three shares add up to 100%. \`ALLSELECTED\` is useful but subtle; test it with different slicer combinations to be sure it behaves as expected.

### ALLEXCEPT

\`ALLEXCEPT\` removes all filters from a table except the columns you name:

\`\`\`dax
Share within Category % =
DIVIDE (
    [Revenue],
    CALCULATE ( [Revenue], ALLEXCEPT ( Product, Product[Category] ) )
)
\`\`\`

Each product's revenue is divided by its category's total, so you see its share within Beverages or Snacks rather than of all products.

### Show it clearly

Percent-of-total measures work well in tables alongside the raw value, in bar charts sorted descending, or in a 100% stacked bar. Format them as percentages with one decimal place at most. And always label clearly what the share is of: "Share of company revenue" leaves no room for misunderstanding.
      `,
        [
          q('What does REMOVEFILTERS(Branch) do inside CALCULATE?', [
            'Deletes the Branch table from the model',
            'Ignores filters on Branch while keeping other filters',
            'Removes every filter in the report',
            'Hides the Branch column from users',
          ], 1, 'It clears filters coming from the Branch table only, so date, product and other filters still apply.'),
          q('Three branches are selected in a slicer. Which function makes their shares add up to 100%?', [
            'ALL',
            'REMOVEFILTERS',
            'KEEPFILTERS',
            'ALLSELECTED',
          ], 3, 'ALLSELECTED respects outer selections like slicers while removing the visual\'s own filters, giving shares of the selection.'),
          q('What does ALLEXCEPT(Product, Product[Category]) keep?', [
            'Every filter on the Product table',
            'No filters at all',
            'Only the filter on Category from the Product table',
            'Only filters from the Date table',
          ], 2, 'ALLEXCEPT removes Product filters except those on the named columns, giving a category-level total.'),
        ]
      ),
      lesson('Year to Date, Previous Year and Growth', 14, `
Time comparisons are the most requested measures in business reporting. "How are we doing this year so far?" "How does this month compare with the same month last year?" DAX has a family of time intelligence functions for exactly these questions. They rely on the marked date table from chapter 4.

### Year to date

\`\`\`dax
Revenue YTD =
TOTALYTD ( [Revenue], 'Date'[Date] )
\`\`\`

For any date in the visual, \`TOTALYTD\` sums revenue from the start of that year up to that date. In a monthly chart, March shows January to March combined.

For Pakistan's July to June fiscal year, add the year-end date as the third argument:

\`\`\`dax
Revenue FYTD =
TOTALYTD ( [Revenue], 'Date'[Date], "6-30" )
\`\`\`

\`TOTALYTD\` is shorthand for \`CALCULATE\` with \`DATESYTD\`. The longer form is useful when you need extra filters:

\`\`\`dax
Revenue FYTD Long =
CALCULATE ( [Revenue], DATESYTD ( 'Date'[Date], "6-30" ) )
\`\`\`

Similar functions exist for months and quarters: \`TOTALMTD\` and \`TOTALQTD\`.

### Same period last year

\`\`\`dax
Revenue LY =
CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
\`\`\`

Whatever period the visual shows, a day, month, quarter or year, \`SAMEPERIODLASTYEAR\` shifts it back one year. \`DATEADD\` is more flexible and shifts by any interval:

\`\`\`dax
Revenue Previous Month =
CALCULATE ( [Revenue], DATEADD ( 'Date'[Date], -1, MONTH ) )
\`\`\`

### Growth

With both periods available, growth follows naturally:

\`\`\`dax
Revenue YoY =
[Revenue] - [Revenue LY]

Revenue YoY % =
DIVIDE ( [Revenue] - [Revenue LY], [Revenue LY] )
\`\`\`

| Month | Revenue | Revenue LY | YoY % |
|---|---|---|---|
| Jan 2025 | 820,000 | 700,000 | 17.1% |
| Feb 2025 | 760,000 | 780,000 | -2.6% |
| Mar 2025 | 1,050,000 | 830,000 | 26.5% |

A new branch has no revenue last year, so \`DIVIDE\` returns blank instead of an error or an infinite growth figure.

### Watch out for incomplete periods

If today is 10 March, "March 2025" contains ten days while "March 2024" contains a full month, so the comparison looks terrible. Two common solutions:

- Compare only complete periods, for example by filtering the report to months before the current one.
- Limit last year to the same number of days, using a date filter that stops at the equivalent of the latest date with data.

Also consider moving calendar events. Eid and Ramadan move by roughly eleven days each year, so a month that contained Eid last year may not this year. Explaining that in a note beside the chart prevents managers from drawing the wrong conclusions.

### Why the date table matters

Time intelligence functions work on the date table's continuous calendar. Using a date column from the fact table, with its gaps, gives wrong or blank results. If a time measure behaves oddly, check first that the date table is marked, covers the full range, and is related to the fact table.

### Naming variants consistently

Keep a family of names: \`Revenue\`, \`Revenue LY\`, \`Revenue YTD\`, \`Revenue YoY %\`. Once you have built the pattern for Revenue, the same variants for Orders, Customers and Profit follow quickly, and report users learn to find them easily.
      `,
        [
          q('How do you calculate year-to-date revenue for a fiscal year ending 30 June?', [
            'TOTALYTD ( [Revenue], \'Date\'[Date] )',
            'SAMEPERIODLASTYEAR ( \'Date\'[Date] )',
            'SUM ( Sales[Revenue] ) / 12',
            'TOTALYTD ( [Revenue], \'Date\'[Date], "6-30" )',
          ], 3, 'The third argument sets the year-end date, so the year to date starts on 1 July.'),
          q('What does SAMEPERIODLASTYEAR do inside CALCULATE?', [
            'Removes all date filters',
            'Shifts the visible period back by one year',
            'Sums every year together',
            'Returns only the last day of the year',
          ], 1, 'It moves the current date filter back one year, whatever period granularity the visual uses.'),
          q('Why can the current month look much worse than the same month last year?', [
            'The current month may be incomplete',
            'Time intelligence functions ignore the current year',
            'DIVIDE always returns lower values',
            'Last year\'s data is always inflated',
          ], 0, 'Comparing a partial month with a full month understates performance unless periods are aligned.'),
        ]
      ),
      lesson('Rolling Averages and Running Totals', 13, `
Daily sales jump around: a busy Friday, a quiet Monday, a holiday spike. Managers want to see the underlying trend without the noise, and to see how totals build up over a period. Rolling averages and running totals answer those needs.

### Rolling totals with DATESINPERIOD

\`DATESINPERIOD\` returns a range of dates ending at a given date. Combined with \`CALCULATE\`, it gives a rolling window:

\`\`\`dax
Revenue Last 30 Days =
CALCULATE (
    [Revenue],
    DATESINPERIOD ( 'Date'[Date], MAX ( 'Date'[Date] ), -30, DAY )
)
\`\`\`

For each date on the axis, the measure sums revenue for the 30 days ending on that date. \`MAX ( 'Date'[Date] )\` finds the last date in the current filter context.

### Rolling averages

A rolling average divides the rolling total by the number of periods. For a 7-day average of daily revenue:

\`\`\`dax
Revenue 7 Day Avg =
AVERAGEX (
    DATESINPERIOD ( 'Date'[Date], MAX ( 'Date'[Date] ), -7, DAY ),
    [Revenue]
)
\`\`\`

\`AVERAGEX\` calculates revenue for each of the seven days and averages them. Plotted on a line chart next to daily revenue, the rolling line shows the trend clearly while the daily line shows the spikes.

For monthly data, a 3-month or 12-month rolling average smooths seasonal effects:

\`\`\`dax
Revenue 12M Rolling =
CALCULATE (
    [Revenue],
    DATESINPERIOD ( 'Date'[Date], MAX ( 'Date'[Date] ), -12, MONTH )
)
\`\`\`

A 12-month rolling total is especially useful for businesses with strong seasons, such as retail around Eid or school supplies before the academic year, because every point includes one full cycle.

### Running totals

A running total accumulates from the start of the data, or of a period, up to each point:

\`\`\`dax
Revenue Running Total =
CALCULATE (
    [Revenue],
    FILTER (
        ALL ( 'Date'[Date] ),
        'Date'[Date] <= MAX ( 'Date'[Date] )
    )
)
\`\`\`

\`ALL ( 'Date'[Date] )\` removes the date filter, and \`FILTER\` keeps every date up to the current one. Note that this pattern keeps other filters, such as branch and category, so each branch gets its own running total.

To restart each year, year-to-date functions from the previous lesson are simpler, since a year to date is a running total that resets every year.

### Visual calculations

Recent versions of Power BI also offer visual calculations, which let you add calculations such as running sums and moving averages directly on a visual, using the data already in that visual. They are convenient for one visual. Model measures remain the better choice when the calculation should be reused across the report or shown consistently everywhere.

### Handle the edges

Rolling measures at the start of the data include fewer days than the window, so the first few points may look low. Similarly, measures may extend into future dates with no data. A common fix is to return blank after the last date that has sales:

\`\`\`dax
Revenue 7 Day Avg Clean =
VAR LastSaleDate = CALCULATE ( MAX ( Sales[OrderDate] ), REMOVEFILTERS () )
RETURN
    IF ( MAX ( 'Date'[Date] ) <= LastSaleDate, [Revenue 7 Day Avg] )
\`\`\`

### When to use which

| Question | Measure |
|---|---|
| What is the underlying trend? | Rolling average |
| How much in the last 30 days or 12 months? | Rolling total |
| How are we accumulating towards a target? | Running total or year to date |
| How does this year compare with last? | Previous year and growth |
      `,
        [
          q('What does DATESINPERIOD(\'Date\'[Date], MAX(\'Date\'[Date]), -30, DAY) return?', [
            'Every date in the model',
            'The first 30 days of the year',
            'The 30 days ending on the current date',
            'Only dates with sales',
          ], 2, 'It builds a window of dates ending at the latest date in context and going back 30 days.'),
          q('Why is a 12-month rolling total useful for seasonal businesses?', [
            'It removes the need for a date table',
            'It only counts the busiest month',
            'It resets at the start of each month',
            'Every point includes one full seasonal cycle',
          ], 3, 'Including a full year at every point smooths out seasonal peaks and reveals the real trend.'),
          q('In the running total pattern, what does ALL(\'Date\'[Date]) do?', [
            'Removes the date filter so earlier dates can be included',
            'Removes filters from every table in the model',
            'Sorts the dates in ascending order',
            'Creates a new date table',
          ], 0, 'Removing the date filter lets FILTER keep all dates up to the current one, accumulating the total.'),
        ]
      ),
      ],
      [
      q('What is unique about CALCULATE compared with other DAX functions?', [
        'It is the only function that can add numbers',
        'It runs only in calculated columns',
        'It can change the filter context of a calculation',
        'It creates relationships between tables',
      ], 2, 'CALCULATE modifies the filter context, which is the basis for comparisons, shares and time intelligence.'),
      q('A measure should show each branch\'s share of company revenue. What goes in the denominator?', [
        'Revenue with filters removed from Branch',
        'Revenue with filters removed from Date',
        'Revenue filtered to one branch',
        'The number of branches',
      ], 0, 'Removing branch filters gives the company total for the same period and products, which is the correct base for shares.'),
      q('Which pair gives a year-over-year growth percentage?', [
        'TOTALYTD for this year, then SUM of both years',
        'ALL on the date table, then KEEPFILTERS on year',
        'DATESINPERIOD over 12 months, then AVERAGEX',
        'SAMEPERIODLASTYEAR, then DIVIDE',
      ], 3, 'Last year\'s value from SAMEPERIODLASTYEAR is the base, and DIVIDE handles periods with no prior data.'),
      q('Daily sales are noisy. Which measure best shows the underlying trend?', [
        'A running total since the first sale',
        'A 7-day rolling average',
        'A percent of total by branch',
        'The maximum daily sale',
      ], 1, 'A rolling average smooths daily spikes, making the underlying direction visible.'),
      ]
    ),
    chapter(
      'Visuals That Communicate',
      'Match each business question to the right visual, build bar, line, card and table visuals that read at a glance, use maps, scatter charts and the decomposition tree well, and format with colour and accessibility in mind.',
      [
      lesson('Choosing the Right Visual for the Question', 13, `
Power BI offers dozens of visuals, and it is tempting to use as many as possible to make a report look impressive. Good analysts do the opposite. They start from the question the reader is asking and choose the simplest visual that answers it clearly.

### Start with the question

Every visual should answer one question. Write it down before choosing the chart:

| Question type | Example question | Best visuals |
|---|---|---|
| Comparison | Which branch sold the most? | Bar or column chart |
| Trend over time | How have sales changed month by month? | Line chart, column chart for few periods |
| Part of a whole | What share does each category contribute? | Stacked bar, 100% stacked bar, treemap; pie only for 2 to 4 parts |
| Single key number | What is revenue this month? | Card or KPI visual |
| Relationship | Do bigger discounts bring bigger orders? | Scatter chart |
| Detail lookup | Which orders are overdue? | Table |
| Cross-tab | Revenue by branch and month | Matrix |
| Contribution to change | What drove the change in profit? | Waterfall chart |
| Location | Where are our customers concentrated? | Map |

### Bars beat circles

People compare lengths accurately, but angles and areas poorly. That is why bar charts usually beat pie and donut charts. With four branches of similar size, a pie chart makes it almost impossible to tell which is largest; a sorted bar chart makes it obvious instantly. Pies are acceptable only for two to four clearly different parts, and never for comparing across several pies.

### Horizontal or vertical bars?

- Use horizontal bars when category names are long, such as product names, so labels remain readable.
- Use vertical columns when the categories are time periods, since people read time left to right.
- Sort bars by value, largest first, unless the categories have a natural order like months or age bands.

### Line charts for time

Line charts show trends and patterns over time: growth, seasonality, sudden changes. Use them for continuous periods such as days, weeks or months. For a handful of periods, such as four quarters, a column chart also works. Avoid putting more than about five lines on one chart; beyond that, it becomes spaghetti.

### Combo charts for two measures

A line and clustered column chart shows two related measures with different scales, such as revenue as columns and margin percentage as a line on a secondary axis. Use them sparingly and label both axes clearly, since dual axes can mislead readers who do not notice the second scale.

### Tables and matrices still matter

Charts show patterns; tables show exact values. Managers often need both. A well-formatted table with conditional formatting, covered in chapter 9, can be the most useful visual on a page, especially for operational reports where people look up specific items.

### Visuals to use with care

| Visual | Caution |
|---|---|
| Gauge | Uses much space for one number; a card with target comparison is often clearer |
| 3D-looking effects | Not available natively, and custom visuals with them distort values |
| Funnel | Only for genuine stage-by-stage processes, like leads to sales |
| Custom visuals from AppSource | Check they are certified and allowed by your organisation |

### Five seconds

A useful test: can someone understand what each visual is saying within five seconds? If not, simplify it, change the type, or add a clear title stating the insight.
      `,
        [
          q('Which visual best answers "Which branch sold the most?"', [
            'A sorted bar chart',
            'A pie chart with ten slices',
            'A scatter chart',
            'A gauge',
          ], 0, 'Bar charts compare lengths, which people read accurately, and sorting makes the largest immediately visible.'),
          q('Why do bar charts usually beat pie charts?', [
            'Pie charts cannot show percentages',
            'Bar charts use brighter colours',
            'People compare lengths more accurately than angles',
            'Pie charts are not available in Power BI',
          ], 2, 'Human perception judges length far better than angle or area, so bars make comparisons clearer.'),
          q('When are horizontal bars better than vertical columns?', [
            'When showing monthly trends',
            'When category names are long',
            'When there is only one category',
            'When the data includes dates',
          ], 1, 'Horizontal bars give long labels room to be read without rotating or truncating them.'),
        ]
      ),
      lesson('Bar, Line, Card and Table Visuals Done Well', 13, `
The most common visuals, bars, lines, cards and tables, do most of the work in business reports. The difference between an average report and an excellent one is often not the visual type, but the small formatting decisions that make each one easy to read.

### Cards: the headline numbers

Cards show single values such as revenue, orders or margin. Make them count:

- Show the number with sensible units: "PKR 12.4M" rather than "12,436,218.52". Set display units in the format pane.
- Add context: a comparison with last year or target, using a second card, a subtitle or the reference labels available in the newer card visual.
- Use clear labels: "Revenue this month", not "Sum of Line Total".
- Keep the number of cards small, typically three to five key metrics along the top of a page.

### Bar and column charts

Formatting checklist:

| Element | Recommendation |
|---|---|
| Sort | By value, descending, unless order is natural |
| Data labels | On, if there are few bars; then consider removing the value axis |
| Gridlines | Remove or lighten them |
| Colours | One colour for all bars; highlight only what matters |
| Axis titles | Remove if the chart title already explains the axes |
| Number of bars | Top 10 with an "Others" note beats 60 tiny bars |

To show the top 10, use the visual-level filter with Filter type Top N, showing the top 10 items by the measure.

### Line charts

- Start from a clear title that states the insight, such as "Revenue grew every month since January".
- Use markers only when there are few points.
- Show the previous year as a lighter or grey line beside the current year, so the current year stands out.
- Consider whether the Y-axis should start at zero. For bars it must, since the bar length is the value. For lines, a non-zero axis can reveal meaningful changes, but make it obvious to avoid exaggeration.

### Tables and matrices

Tables are for looking things up, so optimise for scanning:

\`\`\`text
Good table habits
- Right-align numbers, left-align text
- Use consistent decimals: none for counts, one for percentages
- Limit columns to those needed for the decision
- Put the most important column first after the item name
- Use conditional formatting sparingly to draw the eye
- Turn on totals only when they are meaningful
\`\`\`

A matrix adds row and column groupings, such as branches down the side and months across the top, with the ability to expand categories into products. Keep hierarchy levels meaningful and avoid more than two or three levels.

### Titles that say something

Default titles like "Revenue by Branch" describe the chart. Better titles tell the reader what to notice: "Karachi generated 42% of revenue". You can even create dynamic titles with a measure:

\`\`\`dax
Revenue Title =
"Revenue by branch, " & SELECTEDVALUE ( 'Date'[Year], "all years" )
\`\`\`

Then, in the visual's title settings, choose the conditional formatting option (the fx button) and select the measure. The title now updates with the year slicer.

### Remove the clutter

Every element that does not help the reader competes for attention: heavy borders, background images, shadows, unnecessary legends, decimal places no one needs. Remove them one by one and check whether the visual still works. Usually it works better.
      `,
        [
          q('How should a revenue card display a large number?', [
            'With every decimal place for accuracy',
            'Without any label, to save space',
            'With sensible units such as PKR 12.4M and a clear label',
            'As a percentage of an unknown total',
          ], 2, 'Rounded display units and clear labels let readers take in the key number instantly.'),
          q('Why must a bar chart\'s axis start at zero?', [
            'The bar length represents the value, so truncating it exaggerates differences',
            'Power BI does not allow other starting points',
            'Line charts require it for comparison',
            'Zero-based axes load faster in reports',
          ], 0, 'Because readers compare bar lengths, cutting the axis makes small differences look large.'),
          q('What makes a chart title more useful than "Revenue by Branch"?', [
            'Adding the report author\'s name',
            'Making the text larger and bold',
            'Removing the title completely',
            'Stating the insight, such as which branch leads',
          ], 3, 'Insight-driven titles tell the reader what to notice, turning a description into a message.'),
        ]
      ),
      lesson('Maps, Scatter Charts and the Decomposition Tree', 13, `
Beyond the everyday visuals, Power BI offers specialised ones that answer particular kinds of questions very well. Used for the right question, they reveal patterns that bars and lines hide. Used for the wrong one, they become decoration.

### Maps: only when location matters

A map is the right choice when the question is genuinely about geography: where customers are concentrated, which delivery zones are slow, how sales spread across cities. If you simply want to compare five branches, a bar chart is clearer, even though the branches are in different cities.

Power BI offers several map visuals. Microsoft recommends the Azure Maps visual and has announced the retirement of the older Map and Filled Map visuals, so check the current status before building new reports on them. Map visuals may need to be enabled by your organisation's Power BI administrator.

To help maps locate places correctly:

- Set the data category of columns in Column tools, for example City, State or Province, or Country.
- Include context to avoid ambiguity. "Hyderabad" exists in both Pakistan and India, so combine city with country, or use latitude and longitude.
- For accurate points, such as individual branches, store latitude and longitude columns and use them instead of names.

### Scatter charts: relationships between measures

A scatter chart places items by two measures, one on each axis, and can size bubbles by a third. It answers questions like:

| Question | X-axis | Y-axis | Each point |
|---|---|---|---|
| Do bigger discounts bring bigger baskets? | Average discount % | Average basket | Branch |
| Which products sell a lot but earn little? | Quantity sold | Margin % | Product |
| Do more staff mean more sales? | Staff count | Revenue | Branch |

Points far from the others, called outliers, often deserve investigation. The analytics pane can add a trend line, average lines or quadrants to make patterns easier to see. Remember that a pattern shows association, not proof that one causes the other.

### The decomposition tree

The decomposition tree lets users break a measure down step by step through different dimensions, choosing the path as they go:

\`\`\`text
Revenue: PKR 10.0M
  -> by Region: North PKR 5.5M, South PKR 4.5M
     -> North by City: Lahore 3.1M, Islamabad 1.7M, Faisalabad 0.7M
        -> Faisalabad by Category: Beverages 0.4M, Snacks 0.2M, Dairy 0.1M
\`\`\`

Users can also choose "High value" or "Low value" to let Power BI pick the dimension that best explains the highest or lowest result. It is excellent for exploratory questions like "Why are Faisalabad's sales lower?" and for managers who want to investigate themselves.

### Key influencers

The key influencers visual analyses which factors are associated with an outcome, such as which customer attributes relate to higher spending or which factors relate to late deliveries. It uses statistical analysis to rank influences. Treat its findings as hints to investigate further, not as final conclusions, and make sure the dataset is large enough for patterns to be meaningful.

### Waterfall charts for change

A waterfall chart shows how a starting value becomes an ending value through positive and negative contributions: last year's profit, plus higher sales, minus higher costs, minus discounts, equals this year's profit. Finance teams especially like it, because it explains changes in a single picture.

### Choose deliberately

Each of these visuals shines for a specific type of question. Before adding one, check that your question matches it. A report with one well-chosen decomposition tree is more useful than one with five advanced visuals that confuse the reader.
      `,
        [
          q('When is a map the right visual?', [
            'Whenever the data contains a city column',
            'To compare five branches\' revenue',
            'When the question is genuinely about geography',
            'Whenever the report needs more colour',
          ], 2, 'Maps help when location patterns matter; simple comparisons between places are clearer as bar charts.'),
          q('How can you prevent a map placing "Hyderabad" in the wrong country?', [
            'Use a pie chart instead of a map',
            'Rename the city to something unique',
            'Remove the country column',
            'Add country context or use latitude and longitude',
          ], 3, 'Ambiguous place names need extra context or precise coordinates for the map to locate them correctly.'),
          q('What is the decomposition tree best used for?', [
            'Breaking a measure down step by step to explore causes',
            'Showing a single key number',
            'Displaying long lists of orders',
            'Showing trends over many years',
          ], 0, 'It lets users drill a measure through dimensions of their choice, making it ideal for exploratory questions.'),
        ]
      ),
      lesson('Formatting, Colour and Accessibility', 13, `
Formatting is not decoration. Consistent colour, spacing and fonts make a report feel trustworthy and easy to use, while inconsistent ones make readers work harder and doubt the numbers. Accessibility makes sure everyone, including people with visual impairments or colour vision deficiency, can use the report.

### Use a theme

Instead of formatting each visual by hand, apply a report theme: View, Themes. Power BI includes built-in themes, and you can customise one or import a JSON theme file that sets colours, fonts and default formatting for every visual:

\`\`\`json
{
  "name": "Mehran Mart",
  "dataColors": ["#1F4E79", "#F2A900", "#5B9BD5", "#A5A5A5", "#70AD47"],
  "background": "#FFFFFF",
  "foreground": "#252423",
  "tableAccent": "#1F4E79"
}
\`\`\`

Themes keep every page consistent and let you update the whole report's look by changing one file. Many organisations provide a corporate theme; use it when one exists.

### Colour with purpose

Colour is the strongest tool for directing attention, so use it deliberately:

| Purpose | Approach |
|---|---|
| Default data | One neutral brand colour for all bars |
| Highlight | A contrasting colour for the one item that matters |
| Good and bad | A consistent pair, used the same way everywhere |
| Categories | A limited palette, with the same category always the same colour |
| Background | White or very light, never busy images |

If Karachi is dark blue on one page, it should be dark blue on every page. Avoid using colour for decoration; when everything is colourful, nothing stands out.

### Do not rely on colour alone

Around one in twelve men and a smaller share of women have some form of colour vision deficiency, most commonly difficulty distinguishing red from green. Red and green for bad and good may be invisible to them. Combine colour with another signal:

- Icons such as up and down arrows alongside colours.
- Labels like "+12%" or "Below target".
- Blue and orange instead of green and red, which remain distinguishable for most people.

### Contrast and size

Text should contrast strongly with its background. Light grey text on white may look elegant, but it is hard to read, especially on projectors and phones. Keep font sizes readable: titles clearly larger than labels, and no labels so small that people lean towards the screen.

### Built-in accessibility features

Power BI supports several accessibility features worth using:

- **Alt text**: in each visual's General settings, describe what the visual shows, so screen reader users can understand it. Alt text can be dynamic using a measure.
- **Tab order**: View, Selection pane, Tab order, so keyboard users move through visuals in a logical order.
- **Titles and labels**: clear titles help everyone, especially screen reader users.
- **Show as a table**: users can view the data behind a visual, which helps anyone who cannot read the chart.

### Consistency checklist

Before sharing any report, check that fonts, colours, number formats, title styles and spacing are consistent across all pages. Align visuals to a grid, which chapter 9 covers in detail. A consistent report looks professional, is faster to read and makes readers more likely to trust what it says.
      `,
        [
          q('What is the main advantage of a report theme?', [
            'It adds animations to every visual',
            'It applies consistent colours and fonts across the whole report',
            'It makes reports refresh faster',
            'It replaces the need for measures',
          ], 1, 'Themes set formatting in one place, keeping every visual consistent and easy to update.'),
          q('Why should you not rely on red and green alone to show good and bad?', [
            'Red and green are not available in Power BI',
            'They always print in black and white',
            'Managers dislike those colours',
            'Some readers cannot distinguish red from green',
          ], 3, 'Colour vision deficiency often affects red-green perception, so icons, labels or other colour pairs are needed.'),
          q('What does alt text on a visual do?', [
            'Changes the colour of the visual',
            'Adds a hidden filter to the report page',
            'Describes the visual for screen reader users',
            'Translates the report into Urdu',
          ], 2, 'Alt text gives screen reader users a description of what the visual shows.'),
        ]
      ),
      ],
      [
      q('What should you decide before choosing a visual type?', [
        'The question the visual should answer',
        'The most colourful option available',
        'How many visuals fit on the page',
        'Which custom visual is newest',
      ], 0, 'Starting from the reader\'s question leads to the simplest visual that answers it clearly.'),
      q('Which visual shows how last year\'s profit became this year\'s through gains and losses?', [
        'Scatter chart',
        'Map',
        'Card',
        'Waterfall chart',
      ], 3, 'A waterfall chart displays positive and negative contributions between a starting and ending value.'),
      q('A table shows 60 products in a bar chart and nobody can read it. What helps most?', [
        'Switching to a pie chart',
        'Showing the top 10 with a Top N filter',
        'Adding more colours',
        'Removing the chart title',
      ], 1, 'Limiting to the most important items keeps the chart readable while focusing on what matters.'),
      q('Which approach makes a good/bad indicator accessible to colour-blind readers?', [
        'Using brighter red and green',
        'Removing all colour from the report',
        'Adding icons or labels alongside colour',
        'Making the font smaller',
      ], 2, 'Pairing colour with another signal ensures the meaning is clear even without distinguishing colours.'),
      ]
    ),
    chapter(
      'Interactive Reports',
      'Give users control with slicers and the filters pane, fine-tune how visuals filter each other, add drill down, drill through and report page tooltips, and build app-like navigation with bookmarks and buttons.',
      [
      lesson('Slicers and the Filters Pane', 13, `
Interactivity is what makes Power BI more than a set of charts. Instead of asking the analyst for a new report every time they have a question, managers can filter the report themselves. Slicers and the filters pane are the two main ways they do it.

### Slicers: filters on the canvas

A slicer is a visual that filters other visuals on the page. Add one from the Visualizations pane and drop a field into it, such as \`Branch[City]\` or \`'Date'[Date]\`. Slicers come in several styles:

| Slicer style | Best for |
|---|---|
| Vertical list | A few items, visible at once |
| Dropdown | Many items, saving space |
| Between (range) | Dates or numbers, with a sliding range |
| Relative date | "Last 30 days", "This month", rolling automatically |
| Tile or button style | A few options, like regions, shown as buttons |

The relative date option is especially useful for operational reports: a slicer set to "last 7 days" always shows the most recent week without anyone changing it.

### Slicer settings worth knowing

- **Single select** forces one choice, useful when measures only make sense for one item, such as one year.
- **Select all** adds an option to select everything quickly.
- **Multi-select with Ctrl** is on by default; users hold Ctrl to choose several items.
- **Search** in list and dropdown slicers helps with long lists like products.

### Sync slicers across pages

By default, a slicer only affects its own page. To keep a Year selection consistent across the whole report, open View, then Sync slicers. For each page, choose whether the slicer is synced (affects that page) and visible (appears on that page). A common design: one visible year slicer on every page, all synced, so moving between pages keeps the same year.

### The filters pane

The filters pane on the right side of the report holds filters at three levels:

\`\`\`text
Filters on this visual    affect only the selected visual
Filters on this page      affect every visual on the page
Filters on all pages      affect the whole report
\`\`\`

Filter types include basic (tick items), advanced (conditions like "contains" or "is greater than"), Top N and relative date.

### Filters pane or slicers?

| Use a slicer when | Use the filters pane when |
|---|---|
| Users change the filter often | The filter rarely changes |
| The filter is central to the page's story | It is a technical filter, like excluding test data |
| You want it visible and obvious | You want to save canvas space |

### Lock and hide filters

As the report author, you can lock a filter so users cannot change it, or hide it so users do not see it. For example, a hidden filter excluding the internal "Staff" customer segment keeps totals clean without cluttering the pane. Be careful: hidden filters can confuse users who compare numbers with other reports, so mention important ones in a note or subtitle.

Filters are not security. Anyone with access to the underlying data model could build their own report without your filter. To restrict what people can see, use row-level security, covered in chapter 11.

### Keep it clear what is filtered

When filters are applied, readers must know. Include selected values in titles using dynamic title measures, as shown in chapter 7, and keep slicers in a consistent place, such as a strip along the top or a panel on the left, on every page.
      `,
        [
          q('Which slicer option keeps showing the most recent week automatically?', [
            'A vertical list of dates',
            'A dropdown of months',
            'A relative date slicer set to the last 7 days',
            'A between slicer with fixed dates',
          ], 2, 'Relative date slicers move with the current date, so the report always shows the latest period.'),
          q('How do you make a Year slicer apply on every page?', [
            'Copy the slicer and paste it without syncing',
            'Use Sync slicers to sync it across pages',
            'Add the year to every visual\'s title',
            'Put the slicer only on the first page',
          ], 1, 'Sync slicers links a slicer\'s selection across chosen pages, keeping the filter consistent.'),
          q('Why are hidden report filters not a security measure?', [
            'Hidden filters are removed when the report is published',
            'Hidden filters only work in Power BI Desktop',
            'Users can always unhide any filter',
            'Users with model access could build reports without them',
          ], 3, 'Filters shape a report\'s view, but restricting data access requires row-level security on the model.'),
        ]
      ),
      lesson('Cross-Filtering and Editing Interactions', 13, `
When a user clicks a bar in one visual, the other visuals on the page respond. This cross-filtering is one of Power BI's most powerful features, and also a source of confusion when it behaves differently from what the report author intended. Controlling it is part of good report design.

### Default behaviour

By default, selecting a data point in a visual affects other visuals on the page in one of two ways:

| Behaviour | What the user sees |
|---|---|
| Cross-highlight | The other visual keeps all bars but highlights the selected portion, with the rest faded |
| Cross-filter | The other visual shows only the data related to the selection |

Bar and column charts usually cross-highlight by default, which shows the selection as a share of the whole. Line charts, cards and tables are cross-filtered.

Users can select several data points with Ctrl+click, and clear a selection by clicking the same point again or an empty area of the visual.

### Editing interactions

Sometimes the default does not suit the design. Select the visual that users click on, then choose Format, Edit interactions. Small icons appear on every other visual:

\`\`\`text
Filter icon     the target visual is filtered by the selection
Highlight icon  the target visual highlights the selection
None icon       the target visual ignores the selection
\`\`\`

Click the icon you want for each target visual. Repeat for other source visuals.

### When to change interactions

- **A total card should stay unchanged**: a card showing company revenue as context should ignore clicks on a branch chart. Set it to None.
- **A trend line should filter, not highlight**: a line chart of monthly revenue should filter to the chosen branch so the trend is for that branch.
- **Two slicers that should not affect each other**: for example, a date slicer should not limit a slicer of product categories.
- **A detail table should respond to everything**: leave it filtering, so users click a chart and immediately see the matching orders.

### Interactions and slicers

Slicers are also visuals, and they have interactions too. By default, a slicer filters every visual on the page. If one visual should ignore a particular slicer, such as a "company total" card, use Edit interactions on the slicer and set that visual to None.

### Designing for discovery

Users often do not realise they can click charts. Help them:

- Add a short hint in a subtitle: "Click a branch to filter the page".
- Keep interactions consistent across pages, so users learn the behaviour once.
- Avoid too many visuals on one page; when everything filters everything, users lose track of what is selected.

### Checking interactions before sharing

Test the page as a user would. Click each visual in turn and confirm that every other visual responds sensibly. Check what happens when two things are selected at once, such as a slicer choice and a chart selection. Many confusing reports have correct measures but interactions that nobody tested, leading managers to see a filtered number and believe it is the total.

### Highlighting and performance

Every click triggers new queries for every affected visual. On pages with many visuals, a single click can generate dozens of queries. Setting unnecessary interactions to None reduces work for the engine and makes the page feel faster, which chapter 11 explores further.
      `,
        [
          q('What is the difference between cross-highlight and cross-filter?', [
            'Highlight fades non-selected data; filter shows only related data',
            'Highlight deletes data; filter hides the visual',
            'There is no difference between them',
            'Highlight works only on maps',
          ], 0, 'Cross-highlighting keeps the whole picture with the selection emphasised, while cross-filtering shows only the matching data.'),
          q('A card shows total company revenue as context. How do you stop a branch chart from filtering it?', [
            'Delete the relationship between Branch and Sales',
            'Move the card to another page',
            'Convert the card into a table visual',
            'Use Edit interactions and set the card to None',
          ], 3, 'Setting the interaction to None makes the card ignore selections in that source visual.'),
          q('Why test interactions before sharing a report?', [
            'Power BI resets interactions after publishing',
            'A filtered number can be mistaken for a total',
            'Interactions change the underlying data',
            'Untested reports cannot be published',
          ], 1, 'Unexpected filtering can mislead readers, so checking every combination ensures numbers mean what users think.'),
        ]
      ),
      lesson('Drill Down, Drill Through and Report Tooltips', 14, `
Managers rarely stop at the first number. They see that Punjab is down, then want to know which city, then which category, then which products. Power BI supports this natural investigation with drill down, drill through and report page tooltips, each suited to a different kind of question.

### Drill down: exploring a hierarchy in place

Drill down lets users move through levels of a hierarchy within the same visual. Put several fields in a visual's axis in order, for example Region, City, Branch, or Year, Quarter, Month.

Arrows appear at the top of the visual:

| Control | Action |
|---|---|
| Down arrow (drill mode) | Click a bar to drill into that item |
| Double down arrow | Go to the next level for all items |
| Forked arrow | Expand all down one level, showing both levels together |
| Up arrow | Drill back up |

A user clicks Punjab, sees Lahore and Faisalabad, then clicks Faisalabad to see its branches. Drill down suits hierarchies where each level is a natural subdivision of the one above.

### Drill through: a detail page for one item

Drill through takes the user to a separate page focused on one item, carrying the selection with it. Build it like this:

1. Create a page named "Product Details" with visuals about a single product: trend, branches selling it, stock levels.
2. In the page's Visualizations pane, add \`Product[Product Name]\` to the Drill through well.
3. Power BI adds a back button to the page automatically.

Now, on any page, a user can right-click a product in any visual and choose Drill through, then Product Details. The detail page opens filtered to that product. The "Keep all filters" option controls whether other filters, such as the current year or branch, travel with it.

Drill through works well for detail pages about customers, products, branches or employees, keeping summary pages clean while detail stays one click away.

### Report page tooltips

By default, hovering over a data point shows a small tooltip with the values used by the visual. Report page tooltips replace that with a mini report page:

\`\`\`text
1. Create a new page, e.g. "Branch Tooltip".
2. In Page information, turn on "Allow use as tooltip".
3. In Canvas settings, choose the Tooltip page size.
4. Add small visuals, such as a card and a sparkline-style line chart.
5. On the target visual, set Tooltip type to Report page,
   and choose "Branch Tooltip".
\`\`\`

Now hovering over a branch shows its monthly trend and key numbers, without leaving the page. Tooltips are excellent for adding context while keeping the main page uncluttered.

### Which to use when

| Need | Feature |
|---|---|
| Explore levels of one hierarchy in the same chart | Drill down |
| Open a full detail page about one item | Drill through |
| Show a little extra context on hover | Report page tooltip |

### Make the paths visible

Users do not discover drill through or drill down by accident. Add hints, such as "Right-click a product for details" in a subtitle, or add a button that triggers drill through for the selected item. Train key users briefly when the report launches. A feature nobody uses adds no value.
      `,
        [
          q('Which feature opens a separate page filtered to one selected product?', [
            'Drill down',
            'Cross-highlight',
            'A relative date slicer',
            'Drill through',
          ], 3, 'Drill through navigates to a target page carrying the selected item as a filter.'),
          q('When is drill down the best choice?', [
            'Exploring levels of a hierarchy, like region to city, in the same visual',
            'Showing a single number in a card',
            'Moving to a different report page',
            'Filtering data from another report',
          ], 0, 'Drill down moves through hierarchy levels within the same visual as the user investigates.'),
          q('What must you enable on a page to use it as a report page tooltip?', [
            'Sync slicers across every report page',
            'Drill through with Keep all filters on',
            'Allow use as tooltip',
            'Mark as date table in Table tools',
          ], 2, 'A page must be allowed as a tooltip, usually with the tooltip canvas size, before visuals can use it.'),
        ]
      ),
      lesson('Bookmarks, Buttons and Page Navigation', 13, `
With bookmarks and buttons, a Power BI report can behave like a small application: a home page with navigation, toggles that switch between chart and table, and a reset button that clears all filters. These features make reports easier to use, especially for managers who are not comfortable exploring on their own.

### Page navigation with buttons

Insert, Buttons offers several button types, including blank, back, and arrows. Set a button's Action to Page navigation and choose the destination page. In Power BI Desktop, hold Ctrl and click to test a button; in the Service, a normal click works.

Faster still, the page navigator (Insert, Buttons, Navigator, Page navigator) creates a set of buttons for every visible page automatically, and updates when pages are added or renamed. Place it in the same position on every page, like a menu bar.

### What bookmarks capture

A bookmark saves the current state of a page. In View, open the Bookmarks pane and choose Add. Each bookmark can capture:

| Option | What it saves |
|---|---|
| Data | Filters, slicer selections, sort order and drill state |
| Display | Which visuals are visible or hidden, and spotlight |
| Current page | Which page is shown |
| All visuals or selected visuals | Whether the bookmark applies to all or some visuals |

Turning off Data for a bookmark means it changes only what is shown, without touching the user's filters. That is important for toggles.

### The Selection pane

View, Selection pane lists every object on the page. The eye icon shows or hides each one. Bookmarks combined with the Selection pane allow you to swap visuals in the same place.

### Building a chart and table toggle

\`\`\`text
1. Place a bar chart and a table in the same position.
2. Bookmark "Show chart": chart visible, table hidden. Turn off Data.
3. Bookmark "Show table": table visible, chart hidden. Turn off Data.
4. Add two buttons, "Chart" and "Table", with Action set to Bookmark,
   each pointing to its bookmark.
\`\`\`

Users click the buttons to switch views, and their filters stay as they were. A bookmark navigator (Insert, Buttons, Navigator) can create the buttons for a group of bookmarks automatically.

### A reset filters button

Users often get lost after applying many filters. Create a bookmark with all slicers cleared and Data turned on, then add a "Reset filters" button pointing to it. One click returns the page to its default state.

### Home pages and guided stories

For reports used by many people, a simple home page with a title, a short description, navigation buttons and the date of the last refresh helps users start in the right place. Bookmarks can also create a guided presentation: a sequence of states that tells a story in a meeting, using View in the Bookmarks pane to step through them.

### Keep it maintainable

Bookmarks capture the state of visuals when they are created. If you later add a visual to a page, existing bookmarks do not know about it and may leave it visible or hidden unexpectedly. Name bookmarks clearly, group them by page, and retest them after every change to the report. A few well-built bookmarks are much easier to maintain than dozens of fragile ones.
      `,
        [
          q('What does the page navigator do?', [
            'Hides selected pages from report users',
            'Deletes unused pages when the report is published',
            'Builds a button for each visible page',
            'Syncs every slicer across all pages',
          ], 2, 'The page navigator generates and updates buttons for all visible pages, acting like a menu.'),
          q('Why turn off Data for a chart and table toggle bookmark?', [
            'So the bookmark loads faster',
            'Because Data is required only for reset buttons',
            'So the chart shows no data',
            'So switching views keeps the user\'s current filters',
          ], 3, 'Without the Data option, the bookmark changes visibility only and leaves filters and slicers untouched.'),
          q('What is a known maintenance risk with bookmarks?', [
            'New visuals added later may not be handled by existing bookmarks',
            'Bookmarks are deleted when the report is published',
            'Bookmarks cannot be renamed after creation',
            'Bookmarks only work in Power BI Mobile',
          ], 0, 'Bookmarks store the state at creation time, so later page changes require retesting and updating them.'),
        ]
      ),
      ],
      [
      q('When should a filter be placed in the filters pane rather than a slicer?', [
        'When users change it constantly',
        'When it is the main story of the page',
        'When it rarely changes or is a technical filter',
        'When it must restrict access to data',
      ], 2, 'The filters pane suits background or rarely changed filters, saving canvas space for key controls.'),
      q('Which feature lets a user hover over a branch and see its monthly trend?', [
        'Drill down',
        'Sync slicers',
        'A reset bookmark',
        'A report page tooltip',
      ], 3, 'Report page tooltips display a small designed page on hover, adding context without navigation.'),
      q('A slicer should not affect one specific card. What do you do?', [
        'Delete the slicer',
        'Use Edit interactions on the slicer and set the card to None',
        'Hide the card with the Selection pane',
        'Sync the slicer to another page',
      ], 1, 'Slicers have interactions like other visuals, so the card can be set to ignore that slicer.'),
      q('How do you give users a one-click way back to the default page state?', [
        'Ask them to close and reopen the report',
        'Remove all slicers from the page',
        'Publish the report again',
        'A button linked to a bookmark with cleared filters',
      ], 3, 'A reset bookmark with Data captured restores the default filters when the button is clicked.'),
      ]
    ),
    chapter(
      'Dashboards for Decision-Makers',
      'Design dashboards around their audience and a few meaningful KPIs, lay pages out with grids and visual hierarchy, use conditional formatting and KPI indicators, and assemble a complete sales dashboard.',
      [
      lesson('Knowing the Audience and Choosing KPIs', 13, `
A dashboard is only useful if the people it is built for actually open it and act on it. Many dashboards fail not because the numbers are wrong, but because they show the wrong numbers to the wrong people in the wrong way. Good dashboard design starts with people, not with data.

### Different audiences, different needs

| Audience | Main question | What they need |
|---|---|---|
| Managing director | Are we on track overall? | A few top KPIs, trends, exceptions |
| Regional manager | Which of my branches need attention? | Comparisons between branches, drill to detail |
| Branch manager | What happened in my branch yesterday? | Daily detail, stock, staff, targets |
| Finance team | Do the numbers reconcile? | Exact figures, tables, export options |

A single dashboard trying to serve all four ends up serving none. Often the best solution is one report with separate pages for different audiences, or separate reports that share the same semantic model.

### Ask before you build

Before designing anything, spend time with the people who will use it:

\`\`\`text
Questions for dashboard users
- What decisions do you make each week or month?
- What numbers do you look at now, and where do they come from?
- What question do you ask first when you open a report?
- What would make you act immediately? Which number worries you?
- Where do you view reports: laptop, big screen, phone?
- How often do you need the data refreshed?
\`\`\`

The answers shape everything: which KPIs, which level of detail, which layout, and whether a mobile layout is needed.

### What makes a good KPI

A key performance indicator is a measure that tells you whether an important objective is being achieved. Good KPIs are:

- **Linked to a goal**: revenue against target, not just revenue.
- **Actionable**: someone can do something when it moves.
- **Clearly defined**: everyone agrees exactly how it is calculated.
- **Few in number**: typically three to seven on a main page.

### Define each KPI in writing

Disagreements about numbers usually come from different definitions. Write a short definition for each KPI and agree it with the business owner:

| KPI | Definition | Owner |
|---|---|---|
| Revenue | Sum of quantity times price, excluding returns and internal orders | Finance |
| Average basket | Revenue divided by distinct orders | Sales |
| Target achievement % | Revenue divided by branch target for the same period | Sales |
| Stock-out rate | Share of product-days with zero stock | Operations |

These definitions become your DAX measures, and the table can sit in the report's documentation or on an "About" page.

### Leading and lagging indicators

Revenue is a lagging indicator: it tells you what already happened. Leading indicators hint at what is coming, such as footfall, new customer sign-ups or stock availability. A strong dashboard pairs them, so managers can act before revenue suffers.

### Less is more

The temptation is to include every number available. Resist it. Each extra visual dilutes attention from the ones that matter. If a number never influences a decision, it does not belong on the main page; it can live on a detail page or in drill through.

### Test with real users

Show an early draft to two or three real users and watch them use it without explanation. Where do they look first? What confuses them? What do they ask for that is missing? A short test session saves weeks of building features nobody uses.
      `,
        [
          q('Why does a single dashboard for every audience often fail?', [
            'Power BI limits each report to one user',
            'Different roles need different KPIs and levels of detail',
            'Executives cannot open dashboards',
            'Dashboards cannot contain more than one page',
          ], 1, 'Directors, managers and analysts ask different questions, so one design rarely serves them all well.'),
          q('What makes a KPI good?', [
            'It includes as many numbers as possible',
            'It changes colour every week',
            'It is calculated differently by each team',
            'It is linked to a goal, actionable and clearly defined',
          ], 3, 'Good KPIs connect to objectives, prompt action and have one agreed definition.'),
          q('What is a leading indicator?', [
            'A measure that hints at future results, like footfall',
            'The first visual on a report page',
            'A measure that only shows last year\'s results',
            'The largest number on the dashboard',
          ], 0, 'Leading indicators signal what is likely to happen, giving managers time to act before lagging results change.'),
        ]
      ),
      lesson('Layout, Grids and Visual Hierarchy', 13, `
Two dashboards can contain identical visuals, yet one feels clear and professional while the other feels chaotic. The difference is layout: where things are placed, how they align, and what the eye sees first. Good layout guides the reader through the page without them noticing.

### How people scan a page

In languages read left to right, including English reports, readers typically start at the top left and scan across and down. Place the most important information where the eye lands first:

\`\`\`text
+---------------------------------------------------------+
| Title, date range, last refresh            | Slicers    |
+---------------------------------------------------------+
| KPI card | KPI card | KPI card | KPI card               |
+---------------------------------------------------------+
| Main trend chart (large)          | Comparison chart   |
|                                   | (by branch)        |
+---------------------------------------------------------+
| Detail table or secondary visuals                       |
+---------------------------------------------------------+
\`\`\`

The most important KPIs sit at the top, the main story in the largest space, and detail at the bottom.

### Size signals importance

Readers assume that larger visuals are more important. Give the main chart the most space, and keep secondary visuals smaller. If every visual is the same size, nothing looks important.

### Align to a grid

Misaligned visuals, even by a few pixels, make a report look careless. Power BI helps:

- View, then turn on Gridlines and Snap to grid.
- Select several visuals and use Format, Align to align edges and Distribute to space them evenly.
- Set exact sizes and positions in the General section of the Format pane, for example every KPI card at the same width and height.

Keep consistent margins around the page edges and equal gaps between visuals. Whitespace is not wasted space; it separates groups and lets the eye rest.

### Group related visuals

Place visuals that belong together close to each other, and separate groups with space or subtle background shapes. A card showing revenue should sit near the chart that explains it. A light grey rectangle behind a group of related visuals can signal that they belong together, without heavy borders.

### Canvas size and devices

The default canvas is 16:9, which suits laptops and large screens. Consider where the report will be viewed:

| Device | Consideration |
|---|---|
| Laptop | Default 16:9 works well |
| Large meeting-room screen | Larger fonts, fewer visuals |
| Phone | Create a mobile layout for key pages |

The mobile layout, available from the View tab, lets you arrange a vertical version of a page using the same visuals. Include only the essential KPIs and one or two charts; phones are for quick checks, not deep analysis.

### Consistency across pages

If KPI cards sit at the top of one page, they should sit at the top of all pages. Slicers should stay in the same place. The title, logo and navigation should never move. A consistent frame lets users focus on the content rather than hunting for controls. Create one page with the layout, then duplicate it as the starting point for other pages.

### A final layout check

Step back and look at the page from a distance, or squint at it. Can you tell immediately where to look first? Are there clear groups? Is anything competing for attention without deserving it? This simple test reveals most layout problems in seconds.
      `,
        [
          q('Where should the most important KPIs usually be placed?', [
            'Bottom right corner',
            'Hidden behind a bookmark',
            'Top left, where readers look first',
            'Spread randomly across the page',
          ], 2, 'Readers of left-to-right languages typically start scanning at the top left, so key numbers belong there.'),
          q('Which Power BI features help align visuals precisely?', [
            'Gridlines, Snap to grid, and the Align and Distribute commands',
            'Sync slicers and drill through',
            'Row-level security roles',
            'The Performance Analyzer',
          ], 0, 'Grid and alignment tools make edges line up and spacing consistent, giving a professional look.'),
          q('What should a mobile layout focus on?', [
            'Every visual from the desktop page',
            'Only the report title and logo',
            'Long detail tables with many columns',
            'The essential KPIs and one or two charts',
          ], 3, 'Phones suit quick checks, so the mobile layout should show only the most important information.'),
        ]
      ),
      lesson('Conditional Formatting and KPI Indicators', 14, `
A number on its own does not say whether it is good or bad. PKR 950,000 might be excellent for a small branch and worrying for the flagship store. Conditional formatting and KPI indicators add that judgement visually, so readers see instantly where attention is needed.

### Conditional formatting in tables and matrices

In a table or matrix, open the Format pane, find Cell elements, and choose the column to format. Options include:

| Option | Effect | Good for |
|---|---|---|
| Background colour | Cell colour changes with value | Heatmaps across branches and months |
| Font colour | Text colour changes | Highlighting negatives in red |
| Data bars | A small bar inside the cell | Comparing values down a column |
| Icons | Arrows, circles, flags | Status against target |
| Web URL | Turns text into a link | Linking to source systems |

Data bars are a subtle favourite: they turn a table into a compact bar chart while keeping exact numbers.

### Rules, gradients and field values

Each option can be driven in three ways:

- **Gradient**: colours scale from lowest to highest, like a heatmap.
- **Rules**: specific colours for ranges, such as below 90% red, 90 to 100% amber, above 100% green.
- **Field value**: a measure returns the colour itself, giving full control.

A field value measure lets you apply business logic:

\`\`\`dax
Target Status Colour =
VAR Achievement = [Target Achievement %]
RETURN
    SWITCH (
        TRUE (),
        Achievement >= 1, "#2E7D32",
        Achievement >= 0.9, "#F9A825",
        "#C62828"
    )
\`\`\`

Use this measure as the field value for background or font colour. When the thresholds change, you update one measure and every visual that uses it follows.

### KPI indicators beyond colour

As chapter 7 emphasised, colour alone excludes colour-blind readers. Pair colours with symbols. A measure can return a text indicator:

\`\`\`dax
Target Status =
VAR Achievement = [Target Achievement %]
RETURN
    SWITCH (
        TRUE (),
        Achievement >= 1, "▲ On target",
        Achievement >= 0.9, "● Close",
        "▼ Below target"
    )
\`\`\`

Alternatively, use the Icons option in conditional formatting, which offers built-in icon sets.

### The KPI visual and cards with targets

The built-in KPI visual shows a value, a target and a trend in one compact tile, with colour indicating whether the target is met. The newer card visual can also show reference labels, such as last year's value or the target. These are excellent for the top row of a dashboard, where managers want status at a glance.

### Formatting charts conditionally

Conditional formatting also works on charts. In a bar chart, set the bar colour by a field value measure so branches below target appear in a warning colour while others stay neutral. This highlights exceptions without adding extra visuals.

### Use restraint

Conditional formatting works because it stands out. If every cell is coloured, the effect disappears and the table becomes tiring to read. Format only the columns that matter for the decision, use a small, consistent set of colours, and make sure the thresholds reflect agreed business rules rather than arbitrary choices. Document the thresholds on an "About" page so everyone knows what red actually means.
      `,
        [
          q('What are data bars in a table?', [
            'A separate bar chart visual',
            'Small bars inside cells that compare values down a column',
            'Bars that appear only when drilling through',
            'A type of slicer',
          ], 1, 'Data bars add an in-cell bar proportional to each value, combining the precision of a table with visual comparison.'),
          q('Why drive conditional colours from a field value measure?', [
            'Measures are the only way to use colour in Power BI',
            'It makes the report refresh faster',
            'It removes the need for any thresholds',
            'Business rules live in one measure that every visual can reuse',
          ], 3, 'A colour measure centralises threshold logic, so changes apply consistently everywhere it is used.'),
          q('Why is formatting every cell in a table counterproductive?', [
            'Power BI slows down with any conditional formatting',
            'Conditional formatting cannot be printed',
            'When everything stands out, nothing does',
            'It hides the numbers in the cells',
          ], 2, 'Highlighting works through contrast, so formatting only what matters keeps attention on the exceptions.'),
        ]
      ),
      lesson('A Complete Sales Dashboard Walkthrough', 13, `
This lesson brings the previous chapters together into one dashboard page for Mehran Mart's regional managers. It shows how audience, KPIs, layout, visuals, interactions and formatting combine into a page that answers real questions quickly.

### The brief

After interviews, the regional managers agreed on their questions:

1. Are we on track against this month's target?
2. How is the trend compared with last year?
3. Which branches need attention?
4. Which categories are driving the change?

### The measures

The model already has \`Sales\`, \`Targets\`, \`Date\`, \`Branch\` and \`Product\`. The page needs these measures:

\`\`\`dax
Revenue = SUMX ( Sales, Sales[Quantity] * Sales[UnitPrice] )
Revenue LY = CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
Revenue YoY % = DIVIDE ( [Revenue] - [Revenue LY], [Revenue LY] )
Target = SUM ( Targets[Target] )
Target Achievement % = DIVIDE ( [Revenue], [Target] )
Orders = DISTINCTCOUNT ( Sales[OrderID] )
Average Basket = DIVIDE ( [Revenue], [Orders] )
\`\`\`

Plus the \`Target Status Colour\` measure from the previous lesson.

### The layout

| Area | Content | Answers question |
|---|---|---|
| Top strip | Title, month slicer (single select), region slicer, last refresh date | Context |
| KPI row | Revenue, Target Achievement %, Revenue YoY %, Average Basket | 1 |
| Main left | Line chart: Revenue this year and last year by day of month | 2 |
| Main right | Bar chart: Target Achievement % by branch, coloured by status | 3 |
| Bottom | Matrix: Category by branch with YoY % data bars | 4 |

### Building it step by step

- **Top strip**: a text box title, a month slicer set to single select, a region slicer as buttons, and a card showing the last refresh date from a small table or measure.
- **KPI row**: four cards of equal size, with the newer card visual's reference labels showing last year's value or the target.
- **Trend**: a line chart with current revenue in the brand colour and last year's in grey, so this year stands out.
- **Branch chart**: horizontal bars sorted ascending by achievement, so the branches needing attention appear first; bar colour from \`Target Status Colour\`, plus data labels.
- **Matrix**: categories on rows, branches on columns, \`Revenue YoY %\` with a diverging background gradient and a clear midpoint at zero.

### Interactions

- Clicking a branch in the bar chart filters the trend line and the matrix to that branch.
- The KPI cards also filter, so they show the selected branch's numbers; the title updates with a dynamic measure to say which branch is selected.
- A "Reset" button, built with a bookmark, clears selections.
- Drill through from any branch to a "Branch Details" page, and a report page tooltip on the bar chart shows each branch's monthly trend.

### Checking before release

\`\`\`text
Release checklist
- Numbers match the finance report for last month
- Every slicer combination tested, including a region with no data
- Titles, units and formats consistent
- Colours accessible, with icons or labels alongside
- Mobile layout created for the KPI row and branch chart
- About page with KPI definitions and data refresh schedule
\`\`\`

### Iterate after launch

After two weeks, ask the managers what they use and what they ignore. Perhaps the matrix is rarely used but everyone wants stock availability. Dashboards are products; they improve through feedback, and a small, well-used page is worth more than a large, ignored one.
      `,
        [
          q('Why sort the branch achievement chart in ascending order?', [
            'Ascending order loads faster',
            'Power BI requires ascending sorting for bar charts',
            'It hides branches that are below target',
            'The branches needing attention appear first',
          ], 3, 'Sorting ascending puts the lowest achievers at the top, matching the manager\'s question about who needs attention.'),
          q('Why show last year\'s revenue as a grey line?', [
            'So the current year stands out while still providing comparison',
            'Grey lines cannot be filtered',
            'Last year\'s data is less accurate',
            'Power BI shows previous years in grey automatically',
          ], 0, 'A muted colour for the comparison keeps focus on the current year while preserving context.'),
          q('What should happen after a dashboard is launched?', [
            'Nothing, it is complete',
            'Delete visuals randomly to simplify it',
            'Gather feedback and improve what users need',
            'Rebuild it from scratch every week',
          ], 2, 'Treating dashboards as products that evolve with user feedback keeps them relevant and used.'),
        ]
      ),
      ],
      [
      q('What should you do before designing a dashboard?', [
        'Choose the colour theme',
        'Add as many visuals as possible',
        'Publish an empty report',
        'Ask users what decisions they make and what they need',
      ], 3, 'Understanding users\' decisions and questions determines which KPIs, detail and layout the dashboard needs.'),
      q('Why write a definition for each KPI?', [
        'Different definitions are the most common cause of disagreements about numbers',
        'Power BI cannot calculate undefined measures',
        'Definitions make visuals larger',
        'Definitions are required to publish reports',
      ], 0, 'Agreed written definitions ensure everyone calculates and interprets each KPI the same way.'),
      q('What does giving one chart much more space than others communicate?', [
        'That it is less important',
        'That it is interactive',
        'That it is the most important visual on the page',
        'That it uses a different data source',
      ], 2, 'Readers assume larger elements matter more, so size should reflect importance.'),
      q('Which approach makes a status indicator both clear and accessible?', [
        'A red background only',
        'A green font only',
        'Removing all colours from the table',
        'Colour combined with symbols or text like "Below target"',
      ], 3, 'Pairing colour with symbols or words keeps the meaning clear for all readers, including those with colour vision deficiency.'),
      ]
    ),
    chapter(
      'Publishing and Sharing in the Power BI Service',
      'Publish reports to workspaces, understand semantic models, reports, dashboards and apps, keep data current with scheduled refresh and gateways, and share content with the right licences and permissions.',
      [
      lesson('Publishing, Workspaces and Semantic Models', 13, `
A report on your laptop helps one person. A published report helps an organisation. Publishing moves your work from Power BI Desktop to the Power BI Service, where it can be shared, refreshed automatically and viewed in a browser, in Teams or on phones.

### Publishing from Desktop

Save the report, then choose Publish on the Home ribbon. Sign in with your work or school account if prompted, then choose a destination workspace. Power BI uploads the file and shows a link to open it in the Service.

Publishing creates two items in the workspace:

| Item | What it contains |
|---|---|
| Report | The pages and visuals you designed |
| Semantic model | The data, relationships and measures (formerly called a dataset) |

If you publish again with the same file name to the same workspace, Power BI asks whether to replace the existing items, keeping the same links for users.

### Workspaces: shared folders for content

A workspace is a container for related reports, semantic models and dashboards. Every user has a personal area called My workspace, which is fine for experiments but not for sharing with a team. For real projects, create a shared workspace, such as "Sales Analytics", and give colleagues roles:

| Role | Can do |
|---|---|
| Admin | Everything, including managing access and deleting the workspace |
| Member | Publish, edit and share content, add others with lower roles |
| Contributor | Publish and edit content, but not share or manage access |
| Viewer | View and interact with content only |

Give each person the lowest role that lets them do their job. Most report consumers should not be in the workspace at all; they receive content through an app, as the next lesson explains.

### Separate development from production

As reports become important, keep separate workspaces for development and production, for example "Sales Analytics [Dev]" and "Sales Analytics". You test changes in development, then publish to production when they are ready. Organisations with higher licence tiers can use deployment pipelines to move content between development, test and production stages in a controlled way.

### One semantic model, many reports

A well-built semantic model can serve many reports. Instead of every analyst importing the same sales data into their own file, one published model becomes the shared source. Other report builders connect to it from Desktop with Get data, then Power BI semantic models, and build their own reports without duplicating data or logic.

\`\`\`text
Sales semantic model (one source of truth)
   |-- Executive dashboard report
   |-- Regional manager report
   |-- Finance reconciliation report
\`\`\`

This approach ensures everyone uses the same definitions of Revenue and Target, reduces refresh load and makes maintenance far easier.

### Editing in the Service

You can make light edits to reports in the Service, and newer features allow some model editing in the browser. For substantial changes, most teams still edit in Desktop, where the \`.pbix\` file acts as the master copy. Keep that file in a shared, backed-up location such as SharePoint, OneDrive for work or a version-controlled folder, not only on one person's laptop. Losing the only copy of a critical report's source file is a painful, avoidable mistake.

### Check after every publish

After publishing, open the report in the Service, check that visuals load, test a slicer or two, and confirm the refresh settings. Problems such as missing credentials usually appear immediately and are easiest to fix while the change is fresh in your mind.
      `,
        [
          q('What two items does publishing a report usually create in a workspace?', [
            'A dashboard and an app',
            'A report and a semantic model',
            'A gateway and a licence',
            'A theme and a bookmark',
          ], 1, 'Publishing uploads the report pages and the underlying semantic model containing data and measures.'),
          q('Which workspace role can publish and edit content but not manage access?', [
            'Admin',
            'Member',
            'Viewer',
            'Contributor',
          ], 3, 'Contributors can create and edit content but cannot share it or change workspace access.'),
          q('Why build several reports on one shared semantic model?', [
            'Everyone uses the same data and definitions with less duplication',
            'Shared models do not need refreshing',
            'Reports cannot be published without a shared model',
            'It removes the need for workspaces',
          ], 0, 'A single shared model provides one source of truth and avoids duplicate data and conflicting measures.'),
        ]
      ),
      lesson('Reports, Dashboards and Apps', 12, `
In everyday speech, people call any Power BI page a dashboard. In the Power BI Service, reports, dashboards and apps are distinct items with different purposes. Knowing the difference helps you give users the right experience.

### Reports

A report is what you build in Desktop: one or more pages of interactive visuals with slicers, drill through and bookmarks, all connected to one semantic model. Reports are where users explore and analyse.

### Dashboards

A dashboard in the Service is a single canvas of tiles, created by pinning visuals from one or more reports. Hover over a visual in a published report and choose the pin icon to add it to a new or existing dashboard.

| | Report | Dashboard |
|---|---|---|
| Created in | Desktop, or the Service | Service only |
| Pages | One or many | Exactly one |
| Data sources | One semantic model | Tiles from several reports and models |
| Interactivity | Full: slicers, cross-filtering, drill | Limited: clicking a tile opens its report |
| Data alerts | No | Yes, on card, KPI and gauge tiles |

Dashboards are useful for a combined overview drawn from several reports, such as sales, finance and operations on one screen. Clicking any tile takes users to the source report for detail.

### Data alerts

On a dashboard tile showing a single number, such as a card, KPI or gauge, users can set an alert: "Notify me if daily revenue falls below PKR 500,000". Power BI checks after each data refresh and sends a notification, and alerts can also trigger automated flows using Power Automate. Alerts turn a passive dashboard into an active warning system.

### Apps: the professional way to distribute content

An app packages content from a workspace into a clean, read-only experience for a wide audience. The workspace remains the place where authors build; the app is what consumers see.

\`\`\`text
Workspace "Sales Analytics" (authors only)
  -> reports, dashboards, semantic models, work in progress
App "Mehran Mart Sales" (all managers)
  -> selected reports and dashboards, with navigation
\`\`\`

Apps bring several advantages:

- Authors can change content in the workspace without users seeing unfinished work, then choose Update app when ready.
- Navigation can group content into sections, with custom names and links.
- Different audiences within one app can see different reports, for example regional managers and head office.
- Users find apps in one place in the Service, rather than searching workspaces.

### Subscriptions

Many managers prefer receiving reports rather than visiting them. Users can subscribe to a report page or dashboard and receive an email snapshot on a schedule, such as every Monday at 8am, with a link to the live report. Report authors can often subscribe others too, depending on permissions and organisation settings.

### Other ways to share views

- **Microsoft Teams**: add a report as a tab in a team channel, so discussion and data live side by side.
- **Export to PowerPoint or PDF**: useful for board packs, though the exported copy is static and becomes outdated.
- **Power BI Mobile**: everything published is available on phones, using mobile layouts where you created them.

### Choosing the right format

Use reports for analysis, dashboards for a combined overview with alerts, and apps to distribute both to wide audiences. For most organisations, apps are the recommended way for report consumers to access content.
      `,
        [
          q('How many pages can a Power BI Service dashboard have?', [
            'As many as needed',
            'Exactly one',
            'Two, one for desktop and one for mobile',
            'None, dashboards only exist in Desktop',
          ], 1, 'A dashboard is a single canvas of pinned tiles, while reports can have many pages.'),
          q('What is a key advantage of distributing content through an app?', [
            'Apps allow consumers to edit the data model',
            'Apps remove the need for any licences',
            'Apps refresh data every minute automatically',
            'Authors can work in the workspace without users seeing unfinished changes',
          ], 3, 'Apps separate the authoring workspace from the published experience, updating only when authors choose.'),
          q('Where can users set data alerts in the Power BI Service?', [
            'On any report page visual',
            'In Power Query',
            'On card, KPI and gauge tiles in dashboards',
            'Only in Power BI Desktop',
          ], 2, 'Data alerts are available on single-number dashboard tiles and are checked after each refresh.'),
        ]
      ),
      lesson('Scheduled Refresh and Data Gateways', 14, `
A report is only as useful as its data is current. In Desktop, you click Refresh to reload data. In the Service, scheduled refresh does it automatically, so managers open the report in the morning and see yesterday's figures without anyone lifting a finger.

### Setting up scheduled refresh

In the workspace, find the semantic model, open its settings and expand Scheduled refresh:

1. Check Data source credentials and sign in for each source.
2. Turn on Keep your data up to date.
3. Choose a frequency (daily or weekly) and add times.
4. Set the time zone, for example Pakistan Standard Time.
5. Choose who receives failure notifications.

The number of scheduled refreshes per day depends on your licence: shared capacity with Pro licences allows fewer refreshes per day than Premium Per User or larger capacities. Check Microsoft's documentation for current limits.

### When do you need a gateway?

The Service runs in Microsoft's cloud. It can reach cloud sources directly, but not data inside your company's network or on someone's laptop:

| Source | Gateway needed? |
|---|---|
| SharePoint Online or OneDrive for work files | No |
| Azure SQL Database and many cloud services | No |
| SQL Server on the office network | Yes |
| Excel file on a shared drive, such as \`\\\\fileserver\\sales\` | Yes |
| File on your laptop's desktop | Yes, and not recommended |

### The on-premises data gateway

The on-premises data gateway is software installed on a computer inside your network. It acts as a secure bridge: the Service sends refresh requests to the gateway, the gateway queries the local source and returns the data. It connects outbound, so no inbound ports need opening in the firewall.

There are two modes:

- **Standard mode**: shared by many users and semantic models, managed centrally, supports more features. The right choice for organisations.
- **Personal mode**: for one user only, with fewer features. Suitable for personal experiments.

Install a standard gateway on a reliable, always-on machine, ideally a server rather than a laptop that goes to sleep at night. Many organisations install gateways in a cluster for high availability. After installing, add data sources to the gateway in the Service and map your semantic model to them.

### Why refreshes fail

| Error type | Common cause | Fix |
|---|---|---|
| Credentials | Password changed or expired | Update credentials in settings |
| Gateway offline | Gateway machine turned off or asleep | Keep it on; consider a cluster |
| Source changed | Column renamed or file moved | Update the query in Desktop and republish |
| Timeout | Model too large or queries slow | Optimise queries, use folding, incremental refresh |

Always turn on failure notifications, and check the refresh history regularly. A report that silently stopped refreshing a week ago is worse than no report, because people trust stale numbers.

### Show when data was refreshed

Add a "Last refreshed" value to every report page. A simple approach is a Power Query query that records the current date and time at refresh:

\`\`\`powerquery
let
    Source = #table({"Last Refresh"}, {{DateTimeZone.FixedUtcNow()}})
in
    Source
\`\`\`

Load it as a small table and show it in a card. Convert from UTC to local time if your audience expects Pakistan time.

### Incremental refresh for large tables

For large fact tables, reloading years of history every night is wasteful. Incremental refresh keeps historical partitions and only refreshes recent data, such as the last few days. It is configured in Desktop using parameters named \`RangeStart\` and \`RangeEnd\`, and makes refreshes much faster for growing datasets.
      `,
        [
          q('When do you need an on-premises data gateway?', [
            'For files stored in SharePoint Online',
            'For every cloud data source',
            'For sources inside a company network, like an office SQL Server',
            'Only for reports viewed on phones',
          ], 2, 'The gateway bridges the cloud Service to data it cannot reach directly inside a private network.'),
          q('Why install a standard gateway on an always-on server rather than a laptop?', [
            'Refreshes fail when the gateway machine is off or asleep',
            'Gateways only install on server operating systems',
            'Laptops cannot connect to the internet',
            'Servers do not need credentials',
          ], 0, 'Scheduled refresh depends on the gateway being available, so an always-on machine prevents failures.'),
          q('Why show a last refreshed time on report pages?', [
            'It is required before publishing',
            'It speeds up the refresh process',
            'It replaces failure notifications',
            'Users can see if data is stale instead of trusting old numbers',
          ], 3, 'Visible refresh times let users judge data freshness and notice when refreshes have stopped.'),
        ]
      ),
      lesson('Licences, Sharing and Permissions', 13, `
Building a great report is only half the job; the right people must be able to see it, and the wrong people must not. Power BI's licensing and permissions determine both, and misunderstandings here are common. Microsoft updates licences and prices from time to time, so always check its current pricing and licensing pages.

### The main licence types

| Licence | What it allows, in general |
|---|---|
| Free | Use Desktop; use My workspace; view content hosted on a qualifying paid capacity |
| Pro | Publish to shared workspaces, share content, and view content shared by other Pro users |
| Premium Per User (PPU) | Pro features plus premium features, such as more frequent refresh; content in PPU workspaces generally requires PPU to view |
| Capacity (Fabric or Premium) | The organisation buys dedicated capacity; on a sufficiently large capacity, users with free licences can view content |

The key rule for most small and medium organisations: to share content and view shared content, both the creator and the viewers usually need Pro licences, unless the content is hosted on a qualifying paid capacity.

### Ways to share

- **Workspace access**: for authors and collaborators, using roles.
- **Apps**: for wide audiences of consumers, the recommended approach.
- **Direct sharing**: the Share button on a report sends a link to specific people, useful for small, informal sharing.
- **Links**: share links can be limited to specific people or people in your organisation.

### Build permission and the semantic model

Viewing a report and building on its data are different permissions. Build permission on a semantic model lets a user create their own reports from it in Desktop or the Service. Grant it to analysts who need self-service reporting, not to every viewer, so the number of uncontrolled reports stays manageable.

### Publish to web: public, not private

Power BI has a Publish to web feature that creates a public link and embed code. Anyone on the internet with the link can see the report, and search engines might index it. It is intended only for genuinely public data, such as a published statistics report. Never use it for internal or confidential data, however convenient it seems. Many organisations disable it through admin settings for this reason.

### Exporting and data leakage

Users with the right permissions can export data from visuals to Excel or CSV. That is useful, but it means data can leave Power BI. Administrators can restrict export options, and sensitivity labels from Microsoft Purview can mark reports as confidential and carry protection into exported files, depending on your organisation's setup.

### Controlling who sees which rows

Sharing a report shares all of its data with everyone who can view it, unless you restrict it. If branch managers should see only their own branch, you need row-level security, which the next chapter covers. Do not rely on separate filtered copies of reports; they multiply maintenance and are easy to get wrong.

### A sharing plan

Before launch, write down a simple plan:

\`\`\`text
Authors (workspace Members):         2 analysts
Reviewers (workspace Viewers):       finance lead
Consumers (app audience):            12 branch managers, 3 regional managers
Build permission:                    finance analyst
Row-level security:                  branch managers see own branch only
Publish to web:                      never
Licences needed:                     check Pro or capacity for all of the above
\`\`\`

A short plan like this prevents last-minute surprises, such as a director who cannot open the report on launch day because nobody checked their licence.
      `,
        [
          q('In a typical small organisation without paid capacity, who needs Pro licences to share and view content?', [
            'Only the report creator',
            'Only the viewers',
            'Both the creator and the viewers',
            'Nobody, sharing is always free',
          ], 2, 'Without a qualifying capacity, sharing and viewing shared content generally require Pro for both sides.'),
          q('Why should Publish to web never be used for confidential data?', [
            'It deletes the report from the workspace',
            'It creates a public link anyone on the internet can view',
            'It only works for Premium users',
            'It disables scheduled refresh',
          ], 1, 'Publish to web makes content publicly accessible, so it is only suitable for genuinely public data.'),
          q('What does Build permission on a semantic model allow?', [
            'Deleting the workspace',
            'Changing other users\' licences',
            'Viewing the report on a phone',
            'Creating new reports from the model',
          ], 3, 'Build permission lets users author their own reports using the shared semantic model.'),
        ]
      ),
      ],
      [
      q('Why keep separate development and production workspaces?', [
        'Power BI allows only one report per workspace',
        'Changes can be tested before users see them',
        'Production workspaces do not need refresh',
        'Development workspaces are free of licences',
      ], 1, 'Separating environments lets authors test changes safely before releasing them to users.'),
      q('What is the recommended way to distribute reports to a wide audience of consumers?', [
        'Add everyone as workspace Admins',
        'Email the .pbix file to each person',
        'Publish an app from the workspace',
        'Use Publish to web',
      ], 2, 'Apps provide a clean, controlled, read-only experience for consumers while authors keep working in the workspace.'),
      q('A refresh fails because the office SQL Server cannot be reached from the cloud. What is missing?', [
        'A Pro licence for viewers',
        'A dashboard tile',
        'A report theme',
        'An on-premises data gateway',
      ], 3, 'The Service needs a gateway inside the network to reach on-premises sources during refresh.'),
      q('Branch managers should only see their own branch. What is the right approach?', [
        'Row-level security on the semantic model',
        'A separate report copy for every branch',
        'Hidden filters in the filters pane',
        'Asking managers not to look at other branches',
      ], 0, 'Row-level security restricts data by user within one model, avoiding fragile copies and unreliable filters.'),
      ]
    ),
    chapter(
      'Security, Performance and Governance',
      'Restrict data with static and dynamic row-level security, diagnose slow reports with Performance Analyzer, choose between Import and DirectQuery, and govern content with endorsement, naming and documentation.',
      [
      lesson('Row-Level Security', 14, `
Mehran Mart wants one report for all branch managers, but each manager should see only their own branch. Head office should see everything. Row-level security, or RLS, makes this possible with a single semantic model, instead of a fragile copy of the report for every branch.

### How RLS works

RLS adds roles to the semantic model. Each role has a DAX filter on one or more tables. When a user in that role views any report built on the model, the filter is applied automatically, and relationships carry it to the fact tables, just like a slicer the user cannot remove.

### Static RLS: one role per group

In Desktop, choose Modeling, then Manage roles, create a role and add a filter on a table:

\`\`\`dax
// Role: Karachi
[City] = "Karachi"
\`\`\`

applied to the \`Branch\` table. Anyone in the Karachi role sees only Karachi's rows in \`Sales\`, \`Targets\` and every related table.

Static roles are simple but do not scale. With 40 branches you would need 40 roles, and every new branch means editing the model.

### Dynamic RLS: one role for everyone

Dynamic RLS uses the identity of the person viewing the report. Create a security table that maps users to what they may see:

| UserEmail | City |
|---|---|
| ayesha@mehranmart.pk | Karachi |
| hamza@mehranmart.pk | Lahore |
| sana@mehranmart.pk | Islamabad |
| sana@mehranmart.pk | Faisalabad |

Relate \`Security[City]\` to \`Branch[City]\`, then create a single role with a filter on the security table:

\`\`\`dax
// Role: Branch Managers, filter on the Security table
[UserEmail] = USERPRINCIPALNAME ()
\`\`\`

\`USERPRINCIPALNAME()\` returns the signed-in user's login, usually their email. Sana sees Islamabad and Faisalabad; Ayesha sees Karachi. Adding a manager means adding a row to the security table, not changing the model.

For the filter to travel from \`Security\` through \`Branch\` to \`Sales\`, the relationship between \`Security\` and \`Branch\` needs to pass the filter in the right direction; a common approach is to make the Security to Branch relationship filter from Security to Branch, and to tick "Apply security filter in both directions" only when your model design requires it.

### Test before publishing

In Desktop, choose Modeling, then View as, pick a role and, for dynamic RLS, enter another user's email under "Other user". Check that the numbers match what that person should see. Test at least one user with several branches and one with none; a user with no matching rows should see an empty report, not everything.

### Assigning people in the Service

After publishing, open the semantic model's Security settings in the Service and add users or, better, security groups to each role. Groups are easier to manage than individuals as people join and leave.

### An important limitation

RLS restricts users with Viewer access to the content, including through apps. Users with Admin, Member or Contributor roles in the workspace can edit the model and are not restricted by RLS. Keep managers out of the workspace and give them access through an app.

### Beyond rows

RLS hides rows. If certain columns or tables must be hidden, such as salary data, object-level security can restrict them, typically configured with external tools like Tabular Editor. Hiding a column in the report view is not security; it only tidies the field list.
      `,
        [
          q('What is the main advantage of dynamic RLS over static roles?', [
            'It works without a semantic model',
            'It removes the need for relationships',
            'One role serves everyone, driven by a security table',
            'It makes reports load faster',
          ], 2, 'Dynamic RLS filters by the signed-in user\'s identity, so new users only need a row in the security table.'),
          q('What does USERPRINCIPALNAME() return in an RLS filter?', [
            'The name of the report',
            'The workspace name',
            'The last refresh time',
            'The signed-in user\'s login, usually their email',
          ], 3, 'The function identifies the viewer, which the security table matches to the data they may see.'),
          q('Which users are not restricted by RLS?', [
            'App viewers',
            'Workspace Admins, Members and Contributors',
            'Users added to a security group',
            'Users with free licences on a capacity',
          ], 1, 'Users who can edit content in the workspace bypass RLS, so consumers should access content through apps or Viewer roles.'),
        ]
      ),
      lesson('Performance Analyzer and Faster Models', 13, `
A report that takes ten seconds to respond to every click will not be used, however good its insights. Most performance problems come from a handful of causes, and Power BI includes tools to find them. Fixing them is usually a matter of model design rather than more powerful hardware.

### Performance Analyzer

In Desktop, choose View, then Performance Analyzer, and click Start recording. Then refresh the visuals or interact with the page. Each visual is listed with timings:

| Timing | What it measures |
|---|---|
| DAX query | Time for the engine to calculate the visual's data |
| Visual display | Time to draw the visual |
| Other | Waiting, for example behind other visuals |

Sort by total time to find the slowest visuals. If the DAX query dominates, the measure or model needs work. If visual display dominates, the visual may show too many points or be a heavy custom visual.

You can copy a visual's query and run it in the DAX query view or in free tools such as DAX Studio to analyse it in more detail.

### The most common causes

| Cause | Fix |
|---|---|
| Too many visuals on one page | Fewer visuals; move detail to other pages or drill through |
| Unused columns in the model | Remove them in Power Query |
| High-cardinality columns | Split date-time into date and time; round excessive decimals; remove unique IDs not needed |
| Flat, wide tables | Build a star schema |
| Bidirectional relationships | Use single direction where possible |
| Auto date/time left on | Turn it off and use one date table |
| Complex iterators over large tables | Simplify measures, use variables, pre-calculate in Power Query |

### Why cardinality matters

Power BI's import engine, called VertiPaq, stores data by column and compresses columns with few distinct values extremely well. A \`City\` column with 12 values costs almost nothing. A \`Timestamp\` column with a unique value on every row compresses poorly and can be the largest thing in the model. Splitting it into a \`Date\` column and, if genuinely needed, a \`Time\` column rounded to the minute can shrink the model dramatically.

Free tools such as VertiPaq Analyzer, available through DAX Studio, show which tables and columns use the most memory.

### Measures that scale

A few DAX habits help performance:

- Use variables to avoid calculating the same expression twice.
- Filter on columns rather than whole tables inside \`CALCULATE\` where possible.
- Avoid \`FILTER\` over a large fact table when a simple column filter works.
- Be careful with measures that iterate a large table and call other complex measures for every row.

### Page design and interactions

Each visual sends at least one query. A page with 25 visuals sends 25 queries on load and again on each slicer click. Consider:

- Combining several cards into one multi-row card or the newer card visual.
- Setting unnecessary interactions to None, as chapter 8 described.
- Using an Apply button on slicers, available in slicer settings, so filters apply once after several selections.

### Measure before and after

Performance work should be evidence-based. Record timings before a change, make one change, then record again. Guessing often leads to effort spent on things that were never the bottleneck, while the real cause stays in place.
      `,
        [
          q('In Performance Analyzer, a visual\'s DAX query time is very high. What does that suggest?', [
            'The measure or model needs optimisation',
            'The visual\'s colours are too complex',
            'The report needs a different theme',
            'The gateway is offline',
          ], 0, 'A slow DAX query points to calculation or model design issues rather than drawing time.'),
          q('Why does a timestamp column with unique values hurt model size?', [
            'Timestamps cannot be imported',
            'Power BI converts them to text',
            'High-cardinality columns compress poorly',
            'It creates extra relationships automatically',
          ], 2, 'VertiPaq compresses columns with few distinct values well, while unique values on every row compress badly.'),
          q('How can slicers reduce the number of queries when users make several selections?', [
            'Syncing them across pages',
            'Converting them to dropdowns',
            'Hiding them with bookmarks',
            'Adding an Apply button so filters apply once',
          ], 3, 'An Apply button waits until the user finishes selecting, sending one set of queries instead of many.'),
        ]
      ),
      lesson('Import, DirectQuery and Storage Modes', 13, `
When you connect to a database, Power BI asks how it should get the data: import a copy, or query the source live. This choice, the storage mode, affects speed, freshness, model size and which features are available. Choosing well depends on the data and the business need.

### Import mode

In Import mode, Power BI loads a compressed copy of the data into the model. Visuals query this in-memory copy, which is extremely fast.

- **Strengths**: fastest performance, full DAX and Power Query features, works offline in Desktop.
- **Limitations**: data is only as fresh as the last refresh; model size is limited by your licence and capacity; large refreshes take time.

Import is the default and the right choice for most reports.

### DirectQuery mode

In DirectQuery mode, no data is stored in the model. Every visual sends queries to the source database each time it loads or a user interacts.

- **Strengths**: data is as current as the source; very large data does not need importing; data stays in the source system.
- **Limitations**: each interaction depends on the source's speed; some DAX and Power Query transformations are restricted; heavy report usage adds load on the source database.

DirectQuery suits cases where near real-time data is essential, or where data is too large or too sensitive to copy, and the source database is fast and well-tuned for analytical queries.

### Comparing the two

| | Import | DirectQuery |
|---|---|---|
| Speed of visuals | Very fast | Depends on the source |
| Data freshness | As of last refresh | Near real time |
| Model size | Limited by licence or capacity | Small; data stays in source |
| Transformations | Full Power Query | Some restrictions |
| Load on source | During refresh only | On every interaction |

### Composite models and Dual mode

A composite model mixes storage modes. For example, a huge \`Sales\` fact table in DirectQuery while small dimension tables like \`Branch\` and \`Product\` are imported. Dimension tables can be set to Dual mode, meaning they act as imported or DirectQuery depending on what each query needs. Composite models can also combine a published semantic model with your own local data.

Aggregation tables are an advanced technique in composite models: a small imported summary, such as sales by day and branch, answers most queries quickly, while the detailed DirectQuery table serves drill-downs.

### Live connection

When you connect Desktop to a published Power BI semantic model or to Analysis Services, you use a live connection. The report contains no model of its own; it uses the shared model, including its measures and security. This is how several reports share one source of truth, as chapter 10 described.

### Direct Lake

In Microsoft Fabric, Direct Lake mode reads data directly from files in OneLake in a way designed to combine near-import performance with fresh data, without a traditional import refresh. If your organisation uses Fabric lakehouses or warehouses, it is worth exploring; otherwise Import and DirectQuery remain the main choices.

### How to decide

Ask these questions in order:

\`\`\`text
1. Can the data be imported within size limits?        If yes, prefer Import.
2. Is refreshing a few times a day fresh enough?        If yes, Import.
3. Is near real-time data truly required?              Consider DirectQuery.
4. Is the source fast enough for interactive queries?  If not, DirectQuery will frustrate users.
5. Is the data huge but mostly summarised?             Consider composite with aggregations.
\`\`\`

Many teams request "real time" when an hourly or daily refresh would fully meet their needs. Ask what decision the freshness supports before accepting the trade-offs of DirectQuery.
      `,
        [
          q('What is the main strength of Import mode?', [
            'Data is always real time',
            'No refresh is ever needed',
            'Model size is unlimited',
            'Very fast visuals with full feature support',
          ], 3, 'Imported data is compressed in memory, giving the fastest performance and complete DAX and Power Query support.'),
          q('When is DirectQuery most appropriate?', [
            'Whenever a report has more than one page',
            'When near real-time data is essential and the source is fast',
            'When the source database is slow',
            'For small Excel files on a laptop',
          ], 1, 'DirectQuery trades speed for freshness, so it suits cases needing live data from a well-performing source.'),
          q('What does Dual mode on a dimension table allow?', [
            'Acting as imported or DirectQuery, depending on the query',
            'Refreshing twice as often as other tables',
            'Applying two RLS roles at once',
            'Storing two copies of every column',
          ], 0, 'Dual tables can serve queries from memory or the source, helping composite models perform well.'),
        ]
      ),
      lesson('Governance, Endorsement and Documentation', 12, `
When one analyst builds one report, governance hardly matters. When dozens of people publish hundreds of reports, organisations quickly face problems: three versions of "Revenue" with different numbers, reports nobody owns, and sensitive data shared too widely. Governance is the set of practices that keeps self-service BI trustworthy as it grows.

### Endorsement: signalling trusted content

Power BI lets content be endorsed so users know what to rely on:

| Endorsement | Meaning | Who can apply it |
|---|---|---|
| Promoted | The owner believes it is ready and useful | Content owners and contributors |
| Certified | Reviewed and meets the organisation's quality standards | Only people authorised by the administrator |

A certified Sales semantic model tells every analyst, "build on this one". Endorsed items are highlighted in search and in Get data, steering people away from unofficial copies.

### Naming conventions

Consistent names make content easy to find and understand. Agree simple rules, for example:

\`\`\`text
Workspaces:       [Department] [Topic] [Stage]      Sales Analytics Dev
Semantic models:  [Subject] Model                   Sales Model
Reports:          [Audience] [Topic] Report         Regional Sales Report
Measures:         Business names                    Revenue, Revenue LY
\`\`\`

### Documentation that people use

Documentation does not need to be long. The most useful pieces are:

- **An About page** inside each report: purpose, audience, KPI definitions, data sources, refresh schedule and a contact person.
- **Measure descriptions**: select a measure and fill in its Description property. Report builders see it when hovering over the measure in the Data pane.
- **A short model guide** for shared semantic models: tables, grain, relationships and known limitations.

### Ownership and lifecycle

Every workspace and semantic model should have a named owner responsible for accuracy, refreshes and access. Review content periodically. The Service's usage metrics show how often reports are viewed; reports unused for months can often be archived, reducing clutter and confusion.

### Lineage and impact

The lineage view in a workspace shows how data flows from sources through semantic models to reports and dashboards. Before changing or deleting a semantic model, check lineage and impact analysis to see which reports depend on it, so you do not break a report someone relies on every morning.

### Sensitivity and tenant settings

Organisations using Microsoft Purview can apply sensitivity labels, such as Confidential, which travel with exported files. Power BI administrators control tenant settings in the admin portal, including who can publish to web, export data or create workspaces. An analyst does not usually manage these, but knowing they exist helps you understand why a feature might be unavailable.

### Governance that enables

Good governance does not mean blocking everyone. It means making the right path the easy one: certified models to build on, templates with the corporate theme, clear naming, and simple rules for sharing. Analysts then spend less time reconciling conflicting numbers and more time answering new questions.
      `,
        [
          q('What does a Certified semantic model signal?', [
            'It was created in the last week',
            'It has no row-level security',
            'It is available to the public',
            'It meets quality standards and was reviewed by authorised people',
          ], 3, 'Certification is applied by authorised reviewers to indicate content that meets organisational standards.'),
          q('Why fill in the Description property of measures?', [
            'It makes the measure calculate faster',
            'It is required before publishing',
            'Report builders see it when hovering over the measure',
            'It changes the measure\'s format',
          ], 2, 'Descriptions document each measure\'s meaning right where report builders use it.'),
          q('Why check lineage before changing a semantic model?', [
            'To see which reports depend on it before anything breaks',
            'To speed up the next refresh',
            'To add users to RLS roles',
            'To change the workspace theme',
          ], 0, 'Lineage and impact analysis show dependent content, preventing unexpected breaks for users.'),
        ]
      ),
      ],
      [
      q('How do you test row-level security in Power BI Desktop?', [
        'Publish and ask each manager to check',
        'Remove all relationships temporarily',
        'Use View as to pick a role and user',
        'Hide the Security table',
      ], 2, 'View as simulates a role and identity so you can confirm what each user will see before publishing.'),
      q('Which change is most likely to make an imported model smaller and faster?', [
        'Turning on Auto date/time',
        'Adding bidirectional relationships',
        'Merging all tables into one flat table',
        'Removing unused and high-cardinality columns',
      ], 3, 'Fewer columns and lower cardinality improve compression, reducing memory use and speeding up queries.'),
      q('A team asks for real-time data. What should you ask first?', [
        'Which colour theme they prefer',
        'What decision the freshness supports',
        'How many pages the report needs',
        'Whether they use Power BI Mobile',
      ], 1, 'Many needs are met by scheduled refresh, so understanding the decision avoids DirectQuery\'s trade-offs unnecessarily.'),
      q('What is the purpose of governance in self-service BI?', [
        'Preventing anyone from creating reports',
        'Replacing all analysts with administrators',
        'Removing all security settings',
        'Keeping content trustworthy, findable and well-owned as it grows',
      ], 3, 'Governance makes the trusted path easy, reducing conflicting numbers and unmanaged content.'),
      ]
    ),
    chapter(
      'Careers, Portfolio and PL-300',
      'See how organisations use Power BI, build a complete portfolio project from raw data to published insight, prepare for the PL-300 certification, and find BI work as an employee or freelancer.',
      [
      lesson('Power BI in Real Businesses', 12, `
Every chapter so far used a retail example, but the same skills apply across nearly every industry. Seeing how different organisations use BI helps you choose portfolio projects, talk confidently in interviews and spot opportunities where you work now.

### Industry examples

| Industry | Typical reports | Common data sources |
|---|---|---|
| Retail and FMCG | Sales vs target, stock availability, promotions | POS systems, ERP, distributor files |
| Banking | Branch performance, loan portfolios, digital channel usage | Core banking databases, data warehouses |
| Telecom | Subscriber growth, churn, network usage | Billing systems, CRM |
| Pharmaceuticals | Sales by territory, medical rep activity | ERP, field force apps |
| Textiles and manufacturing | Production efficiency, wastage, export orders | ERP, production logs |
| Logistics and e-commerce | Delivery times, returns, courier performance | Order systems, courier APIs |
| Education | Enrolment, attendance, results | Student information systems |
| NGOs and development | Programme reach, funding use, beneficiary data | Survey tools, spreadsheets |
| Government | Service delivery, budgets, public statistics | Departmental databases |

### What these projects share

Across industries, the pattern is familiar:

1. Data sits in several systems and spreadsheets.
2. Someone spends days each month building reports by hand.
3. Managers get numbers late and argue about which version is right.
4. A BI solution automates the data, agrees definitions and delivers interactive reports.

If you can describe a project in these terms, the manual effort saved, the time to insight and the decisions improved, you can explain the value of BI to any employer or client.

### Typical roles

| Role | Focus |
|---|---|
| Data or reporting analyst | Builds reports, answers business questions, often also uses Excel and SQL |
| BI developer | Designs models, writes complex DAX, manages refresh and security |
| Analytics engineer | Prepares data pipelines and models upstream for BI tools |
| BI or analytics manager | Leads the team, sets standards, works with stakeholders |

Most people start as analysts. Strong SQL, solid modelling and clear communication are what move people towards developer and lead roles.

### Skills that complement Power BI

Power BI is rarely used alone. Employers commonly look for:

- **SQL**, to query databases and prepare data at the source.
- **Excel**, still used everywhere for quick analysis and by many stakeholders.
- **Data modelling concepts**, especially star schemas, which transfer to every BI tool.
- **Communication**, to gather requirements and present findings.
- **Domain knowledge**, understanding the business you report on, which often matters as much as technical skill.

Cortexis also offers courses on SQL for data analysis and Excel business analytics, which pair naturally with this one.

### Start where you are

If you already work in an office, look for a manual report that takes someone hours each month. Offer to automate it with Power BI. A real report that saves real time for your current employer is often the fastest route to a BI role, either through promotion inside the company or as a strong story for your next interview.

### Stay current

Power BI changes monthly. Microsoft publishes a regular feature summary on the Power BI blog, and following it, even briefly, keeps you aware of new visuals, DAX functions and Service features. Employers notice candidates who know the tool as it is today, not as it was years ago.
      `,
        [
          q('What pattern do BI projects share across industries?', [
            'They always use the same data source',
            'They only matter to retail companies',
            'Manual reporting is automated with agreed definitions and interactive reports',
            'They never involve spreadsheets',
          ], 2, 'Most BI work replaces slow, manual reporting with automated, trusted and interactive information.'),
          q('Which skill most commonly complements Power BI in job requirements?', [
            'SQL',
            'Video editing',
            'Mobile game design',
            'Network cabling',
          ], 0, 'SQL is widely required because much business data lives in databases that analysts must query and prepare.'),
          q('What is often the fastest route into a BI role for someone already employed?', [
            'Waiting for a BI job advert in their company',
            'Only studying theory without practice',
            'Changing industry immediately',
            'Automating a real manual report for their current employer',
          ], 3, 'A real report that saves time provides proof of value and can lead to promotion or a strong interview story.'),
        ]
      ),
      lesson('Building a Portfolio Project End to End', 14, `
Certificates show you studied; portfolio projects show you can deliver. A single well-documented project that follows the full BI workflow is worth more than ten screenshots of tutorial dashboards. This lesson outlines how to build one that impresses employers and clients.

### Choose a realistic scenario

Pick data that resembles a real business problem, ideally in an industry you want to work in:

| Idea | Possible data |
|---|---|
| Retail sales performance | Public sample sales datasets, or data you generate carefully |
| Pakistan economic indicators | Pakistan Bureau of Statistics, State Bank of Pakistan, World Bank open data |
| E-commerce delivery analysis | Public e-commerce datasets from open data platforms |
| Hospital or clinic operations | Public health datasets, anonymised |
| Your own freelance or household finances | Your own records, anonymised before sharing |

Avoid the most overused tutorial datasets if possible. A fresh angle on public Pakistani data, for example inflation by city or remittance trends, stands out.

### Follow the whole workflow

Your project should demonstrate every stage from this course:

\`\`\`text
1. Business questions   Write 3 to 5 questions a manager would ask
2. Get data             Connect to at least two sources, e.g. CSV plus web
3. Transform            Clean, unpivot, merge; document the steps
4. Model                Star schema with a date table
5. DAX                  Base measures, time intelligence, a percent of total
6. Visualise            An overview page, a detail page, drill through
7. Interactivity        Slicers, tooltips, a bookmark toggle or reset
8. Polish               Theme, accessibility, an About page
\`\`\`

### Answer the questions explicitly

A dashboard alone leaves viewers guessing what it means. Add a short summary of findings, either on an insights page in the report or in your write-up:

\`\`\`text
Key findings
- Revenue grew 18% year on year, driven mainly by Lahore and Islamabad.
- Faisalabad missed target in 7 of 12 months; beverages were the weak category.
- Average basket rises sharply in Ramadan evenings, suggesting staffing changes.
\`\`\`

This shows you think like an analyst, not only a report builder.

### Present it well

- **Screenshots**: clear images of each page, in your write-up.
- **A short video**: a two to three minute walkthrough explaining the questions, the model and the findings. Recruiters often watch a video when they would not download a file.
- **The model view**: a screenshot of your star schema demonstrates modelling skill instantly.
- **Selected DAX**: show two or three measures you are proud of, with a sentence explaining each.
- **The file**: share the \`.pbix\` on GitHub or a cloud folder, with a README describing the project.

Publish to web should only be used for genuinely public data and where your account and organisation allow it, as chapter 10 explained. Screenshots and videos work for everyone.

### Write the case study

Use the same structure freelancers use for case studies: the problem, your approach, the result, and what you would do next. Post it on LinkedIn with a few screenshots, and link to it from your CV.

### Quality over quantity

Two or three strong, complete projects in different industries are enough for most job applications. Keep improving them as you learn: add row-level security, incremental refresh, or a mobile layout. Each improvement is also something new to talk about in interviews.
      `,
        [
          q('What makes a portfolio project more impressive than tutorial dashboards?', [
            'Using the most popular tutorial dataset',
            'Including as many visuals as possible',
            'Following the full workflow and stating clear findings',
            'Hiding the data model from viewers',
          ], 2, 'A complete project from questions to insights demonstrates real analyst skills rather than copying a tutorial.'),
          q('Why include a screenshot of the model view in your portfolio?', [
            'Employers only care about colours',
            'It replaces the need for measures',
            'It proves the report was published',
            'It demonstrates your modelling skill at a glance',
          ], 3, 'A clean star schema shows employers you understand data modelling, which is central to BI roles.'),
          q('Why add a written summary of key findings?', [
            'It shows you interpret data like an analyst, not just build visuals',
            'Power BI requires text on every page',
            'It reduces the file size',
            'Recruiters cannot read charts',
          ], 0, 'Stating insights shows you can turn data into conclusions that support decisions.'),
        ]
      ),
      lesson('Preparing for the PL-300 Exam', 13, `
The PL-300 exam leads to the Microsoft Certified: Power BI Data Analyst Associate certification. It is widely recognised by employers and clients, and preparing for it fills gaps in your knowledge. It does not replace practical experience, but combined with a portfolio it strengthens any application.

### What the exam covers

Microsoft publishes a study guide listing the skills measured. At the time of writing, the exam is organised into four areas:

| Area | Topics include |
|---|---|
| Prepare the data | Connecting to sources, Power Query, cleaning and transforming, data profiling |
| Model the data | Relationships, star schemas, DAX measures, time intelligence, optimisation |
| Visualise and analyse the data | Report visuals, interactivity, bookmarks, AI visuals, identifying patterns |
| Manage and secure Power BI | Workspaces, apps, refresh, gateways, row-level security, sharing |

Microsoft updates the skills list periodically, so always download the current study guide from the official exam page before you begin, and check what has changed.

This course has covered all four areas. Map each chapter against the study guide to find topics that need extra practice.

### Question formats

Microsoft exams include several question types: multiple choice, multiple answer, drag-and-drop ordering, choosing the right DAX or M from options, and case studies where you read a business scenario and answer several questions about it. The passing score for Microsoft role-based exams is 700 on a scale up to 1,000.

### A study plan

\`\`\`text
Weeks 1 to 2   Read the study guide; complete Microsoft Learn's free PL-300 learning paths
Weeks 3 to 4   Build a practice project covering every skill area
Week 5         Take Microsoft's free practice assessment; list weak areas
Week 6         Revise weak areas hands-on; retake the practice assessment
Week 7         Book and sit the exam
\`\`\`

Adjust the pace to your experience. People who already use Power BI daily may need less time; complete beginners should allow more.

### Study hands-on, not just by reading

The exam tests whether you know what to do in realistic situations: which join kind, which storage mode, which DAX function, which workspace role. The most reliable preparation is building things. For each skill in the study guide, open Desktop and do it yourself at least once.

### Common weak areas

Candidates often find these harder:

- The exact behaviour of \`CALCULATE\` with filters and \`ALL\` variants.
- Row-level security configuration and who it applies to.
- Differences between workspace roles and between sharing methods.
- Storage modes, gateways and refresh options.
- Less common Power Query transformations, such as pivoting and grouping.

### Exam day

Exams can be taken at a test centre or online with a proctor, depending on availability in your area. For online exams, test your computer, camera and internet in advance, and clear your desk. Read case studies carefully; details in the scenario often decide the answer.

### Keeping the certification

Microsoft role-based certifications need renewing each year. Renewal is done through a free online assessment on Microsoft Learn, available in the months before expiry. It covers recent changes, which is another good reason to follow Power BI updates.

### Pricing and discounts

Exam prices vary by country, and Microsoft sometimes offers student discounts or free exam offers through events and programmes. Check the official exam page for the price in Pakistan and any current offers before paying.
      `,
        [
          q('Why download the current PL-300 study guide before starting?', [
            'It contains the exact exam questions',
            'Microsoft updates the skills measured periodically',
            'The guide is required to book the exam',
            'It replaces the need for practice',
          ], 1, 'The skills list changes over time, so the current guide ensures you study what is actually tested.'),
          q('What is the most reliable way to prepare for PL-300?', [
            'Memorising function names without using them',
            'Only watching videos at double speed',
            'Doing each skill hands-on in Power BI Desktop',
            'Skipping the practice assessment',
          ], 2, 'The exam tests practical decisions, so building and doing each skill yourself is the strongest preparation.'),
          q('How is the Power BI Data Analyst certification renewed?', [
            'Through a free online assessment on Microsoft Learn each year',
            'By retaking the full paid exam every month',
            'It never needs renewing',
            'By publishing a report to the web',
          ], 0, 'Microsoft role-based certifications are renewed annually through a free online renewal assessment.'),
        ]
      ),
      lesson('Getting Hired or Freelancing as a BI Analyst', 13, `
With skills, a portfolio and perhaps a certification, the next step is turning them into income. BI skills are in demand in local companies across Pakistan and among international clients looking for remote help. The approach differs slightly between the two paths, but both reward proof over promises.

### Your CV and LinkedIn

Describe results, not just tools. Compare:

| Weak | Strong |
|---|---|
| "Used Power BI, DAX and Power Query" | "Automated monthly sales reporting for 12 branches in Power BI, saving about 3 days of manual work per month" |
| "Made dashboards" | "Built a sales vs target dashboard with row-level security for 15 branch managers" |

Add your portfolio projects with links, your certification if you have it, and the complementary skills: SQL, Excel and data modelling. On LinkedIn, set a clear headline such as "Power BI Developer | Sales and Finance Dashboards" and post occasionally about your projects.

### Interviews

BI interviews often include:

- **Conceptual questions**: measure versus calculated column, star schema, filter context, Import versus DirectQuery.
- **Practical tasks**: build a small report from a dataset, write a DAX measure, or clean data in Power Query, sometimes as a take-home task.
- **Business scenarios**: "A manager says the numbers are wrong. What do you do?"

For scenario questions, show a methodical approach: clarify the definition, compare with the source, check filters and relationships, and communicate clearly. Employers value that calm process as much as technical knowledge.

### Freelancing with Power BI

Power BI work is common on freelance platforms and through LinkedIn. Typical jobs include:

\`\`\`text
- Build a dashboard from Excel or Google Sheets data
- Fix a broken or slow report
- Write or correct DAX measures
- Connect Power BI to a database or an e-commerce platform
- Set up scheduled refresh, gateways or row-level security
- Train a small team to use and maintain reports
\`\`\`

Fixing and improving existing reports is a particularly good entry point: the client already understands Power BI's value, the scope is clear, and a quick win builds trust for larger projects.

### Working with client data safely

Freelance BI work means handling business data. Agree how data will be shared, preferably through the client's own workspace or secure file sharing, not by email. Sign any confidentiality agreement requested, delete local copies when the project ends, and never use a client's data in your portfolio without explicit permission. Anonymise or recreate data if you want to show similar work.

### Pricing BI work

Estimate the hours honestly, including requirements gathering, data cleaning and revisions, which usually take longer than building visuals. Fixed prices suit well-defined dashboards; hourly work suits investigation of broken reports. Ongoing support, such as monthly report maintenance and small changes, can become a steady retainer.

### Keep growing

The field keeps moving: Microsoft Fabric, AI features in Power BI, and data engineering skills upstream of BI are all growing areas. Once you are comfortable with this course's material, deepening your SQL and learning about data pipelines and warehouses opens roles in analytics engineering and data engineering, where many BI professionals move next.
      `,
        [
          q('How should BI experience be described on a CV?', [
            'As a list of tools only',
            'With vague terms like "made dashboards"',
            'With results, such as time saved and users served',
            'Without mentioning any projects',
          ], 2, 'Concrete outcomes show employers the value you delivered, not just the software you used.'),
          q('Why is fixing existing reports a good entry point for freelancers?', [
            'It never requires DAX',
            'Clients pay more for fixes than new builds',
            'It avoids communicating with clients',
            'The client already values Power BI and the scope is clear',
          ], 3, 'Clients with existing reports understand the value, and a clear, quick fix builds trust for larger work.'),
          q('How should a freelancer handle client data in their portfolio?', [
            'Only use it with explicit permission, or anonymise or recreate it',
            'Publish it to the web to show the work',
            'Share it freely once the project is paid',
            'Keep copies indefinitely for future reference',
          ], 0, 'Client data is confidential, so portfolio examples need permission or anonymised and recreated data.'),
        ]
      ),
      ],
      [
      q('Which role focuses on designing models, complex DAX, refresh and security?', [
        'Graphic designer',
        'BI developer',
        'Network engineer',
        'Social media manager',
      ], 1, 'BI developers specialise in the technical foundations of reports: models, DAX, refresh and security.'),
      q('What should a portfolio project include beyond the dashboard itself?', [
        'Only the report title',
        'The client\'s confidential data',
        'A list of every DAX function in existence',
        'Business questions, model screenshot, key findings and a write-up',
      ], 3, 'Context, modelling evidence and findings show employers how you think and what you delivered.'),
      q('Which of these is one of the four PL-300 skill areas?', [
        'Model the data',
        'Design company logos',
        'Build mobile games',
        'Configure office networks',
      ], 0, 'The exam covers preparing, modelling and visualising data, and managing and securing Power BI.'),
      q('In an interview, a manager says the report numbers are wrong. What approach impresses most?', [
        'Insisting the report is correct',
        'Rebuilding the report from scratch immediately',
        'Methodically checking definitions, source, filters and relationships',
        'Blaming the data source owners',
      ], 2, 'A calm, systematic investigation shows the problem-solving and communication employers value.'),
      ]
    ),
  ],
  final: [
    q('Which order reflects the typical BI workflow?', [
      'Visualise, model, transform, get data',
      'Get data, transform, model, visualise',
      'Model, visualise, get data, transform',
      'Transform, publish, get data, model',
    ], 1, 'Data is connected, cleaned and shaped, modelled with relationships and measures, then visualised and shared.'),
    q('What does Power Query do with its Applied Steps on each refresh?', [
      'Deletes the source file and saves a new one',
      'Asks the user to repeat every step manually',
      'Skips steps that were already run before',
      'Replays them in order on fresh data',
    ], 3, 'Applied Steps are a recorded recipe that Power Query reruns on every refresh, leaving the source unchanged.'),
    q('A targets sheet has one column per month. Which transformation fixes it?', [
      'Unpivot Other Columns',
      'Remove Duplicates',
      'Merge Queries with an inner join',
      'Change Type Using Locale',
    ], 0, 'Unpivoting turns month columns into rows, creating one Month column and one value column.'),
    q('What is query folding?', [
      'Hiding queries from the Data pane',
      'Combining CSV files from a folder',
      'Pushing Power Query steps back to the source as a native query',
      'Compressing a report before publishing',
    ], 2, 'Folding lets the source database do the filtering and shaping, so less data is transferred.'),
    q('In a star schema, what sits at the centre?', [
      'The date table',
      'A dimension table',
      'A fact table',
      'The security table',
    ], 2, 'The fact table holds events and measures, surrounded by dimension tables related to it.'),
    q('Why should a dimension key column have unique values?', [
      'One-to-many relationships need a unique one side',
      'Unique values make visuals more colourful',
      'Power BI hides duplicate values automatically',
      'Unique values are required for slicers only',
    ], 0, 'The one side of a one-to-many relationship must be unique, or Power BI cannot create the relationship.'),
    q('Why is Auto date/time commonly turned off?', [
      'It prevents any date filtering',
      'It deletes the date table',
      'It makes DAX measures return errors',
      'It creates hidden date tables that bloat the model',
    ], 3, 'Auto date/time adds a hidden table per date column; one custom date table is leaner and more flexible.'),
    q('Which should be a measure rather than a calculated column?', [
      'An order size band for a slicer',
      'Margin percentage for any selection',
      'A weekend flag for each order',
      'A branch name extracted from a file name',
    ], 1, 'Ratios must be computed from totals in the current filter context, which only a measure does.'),
    q('What is filter context?', [
      'The filters active when a value is calculated',
      'The theme colours used by visuals',
      'The order in which tables were loaded',
      'The list of users with access',
    ], 0, 'Slicers, filters and visual headers form the filter context that decides which rows a calculation sees.'),
    q('Why does a measure need SUMX to multiply Quantity by UnitPrice?', [
      'SUM cannot add decimal numbers',
      'SUMX runs faster than every other function',
      'SUMX creates a row context for each row',
      'Multiplication is not allowed in measures',
    ], 2, 'Measures have no row context, so an iterator is needed to evaluate the expression row by row.'),
    q('What does CALCULATE do?', [
      'Creates a new table from two others',
      'Evaluates an expression in a modified filter context',
      'Refreshes the data from the source',
      'Converts a measure into a column',
    ], 1, 'CALCULATE changes the filters applied to an expression, which enables comparisons, shares and time intelligence.'),
    q('Which measure pattern gives each branch\'s share of company revenue?', [
      'Revenue divided by the number of branches',
      'Revenue with KEEPFILTERS on Branch',
      'Revenue for last year only',
      'Revenue divided by revenue with Branch filters removed',
    ], 3, 'Removing branch filters in the denominator gives the company total, making each branch\'s share correct.'),
    q('Which function shifts the visible period back by one year?', [
      'DATESINPERIOD',
      'TOTALYTD',
      'USERELATIONSHIP',
      'SAMEPERIODLASTYEAR',
    ], 3, 'SAMEPERIODLASTYEAR moves the current date filter back one year for prior-year comparisons.'),
    q('Which visual best compares revenue across ten branches?', [
      'A sorted bar chart',
      'A pie chart',
      'A gauge',
      'A map with ten bubbles',
    ], 0, 'Sorted bars let readers compare lengths accurately and see the ranking instantly.'),
    q('What does drill through provide?', [
      'A hover preview of a mini page',
      'Automatic refresh every hour',
      'A detail page filtered to the selected item',
      'A way to edit data in the source',
    ], 2, 'Drill through navigates to a dedicated page with the selected item carried as a filter.'),
    q('How can one visual be stopped from responding to clicks in another?', [
      'Hide it with the Selection pane',
      'Set its interaction to None with Edit interactions',
      'Remove its relationships',
      'Mark it as a date table',
    ], 1, 'Edit interactions controls how each visual responds to selections, including ignoring them.'),
    q('When is an on-premises data gateway needed?', [
      'When refreshing data stored inside a private network',
      'For every file in SharePoint Online',
      'To view reports on mobile phones',
      'To add bookmarks to a report',
    ], 0, 'The gateway lets the cloud Service reach sources it cannot access directly, such as office servers.'),
    q('What is the recommended way to share reports with many consumers?', [
      'Publish to web',
      'Email the .pbix file',
      'Add everyone as workspace Admins',
      'Publish an app from the workspace',
    ], 3, 'Apps give consumers a clean, read-only experience that authors update when changes are ready.'),
    q('How does dynamic row-level security decide what a user sees?', [
      'By the colour theme of the report',
      'By matching the user\'s login to a security table',
      'By the order of report pages',
      'By the size of the semantic model',
    ], 1, 'USERPRINCIPALNAME returns the viewer\'s login, which is matched to allowed values in a security table.'),
    q('Which change usually improves an imported model\'s performance?', [
      'Turning on bidirectional filters everywhere',
      'Merging every table into one wide table',
      'Removing unused and high-cardinality columns',
      'Adding more visuals to each page',
    ], 2, 'Fewer columns and lower cardinality improve compression, making the model smaller and queries faster.'),
  ],
});
