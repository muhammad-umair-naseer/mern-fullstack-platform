import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'ecommerce-shopify-amazon-va',
  title: 'E-commerce: Shopify & Amazon Virtual Assistant',
  category: 'Business',
  level: 'Beginner',
  duration: '6 weeks',
  accent: 'indigo',
  coverKey: 'ecommerce-shopify-amazon-va',
  summary:
    'Build and run Shopify stores and manage Amazon Seller Central like a professional virtual assistant: products, listings, keyword research, PPC, inventory, customer service and the reporting clients pay for.',
  description:
    'You start with how e-commerce businesses make money and what an e-commerce virtual assistant actually does. You build a Shopify store with products, collections, payments and shipping, then move to Amazon Seller Central: listings, FBA and FBM, and the policies every assistant must follow. You learn product research with tools like Helium 10 and Jungle Scout, write optimised listings, run Sponsored Products campaigns, plan inventory and shipments, and handle customer messages, reviews and claims. The course ends with store marketing and conversion, plus how to win and keep VA clients safely with the right access, SOPs and reports.',
  chapters: [
    chapter(
      'How E-commerce Works',
      'Understand the main e-commerce business models, how Shopify and Amazon differ, what e-commerce virtual assistants do day to day, and the practical realities of selling and working from Pakistan.',
      [
      lesson('E-commerce Business Models', 13, `
Every online store sells products, but not every store makes money the same way. The business model decides where products come from, who holds stock, how much profit each sale leaves, and what work the business needs help with. As a virtual assistant, understanding your client's model helps you understand their priorities immediately.

### The main models

| Model | How it works | Main advantage | Main challenge |
|---|---|---|---|
| Dropshipping | The store sells products a supplier ships directly to customers | No stock to buy upfront | Low margins, slow shipping, less control over quality |
| Private label | The seller brands a generic product made by a manufacturer | Own brand, better margins | Needs investment, research and marketing |
| Wholesale | The seller buys branded products in bulk and resells them | Proven products with existing demand | Competition on price, brand approvals |
| Retail arbitrage | Buying discounted products in shops and reselling online | Low starting cost | Hard to scale, time-consuming |
| Print on demand | Designs printed on products only when ordered | No inventory, creative | Low margins, many competitors |
| Handmade and own products | The seller makes or designs products themselves | Unique products, loyal customers | Production limits growth |

### Examples

Ayesha in Lahore makes handmade khussas and sells them through her own Shopify store to customers in Pakistan and abroad. Her model is handmade products: she controls quality and design, but production capacity limits how much she can sell.

Mike in Texas sells silicone kitchen tools on Amazon under his own brand. They are manufactured in China and shipped to Amazon's warehouses. His model is private label: good margins, but he must research products, manage suppliers and advertise constantly. Mike employs Hamza, a virtual assistant in Multan, to handle much of the daily work.

### Margins decide everything

Every model is judged by the profit left after all costs:

\`\`\`text
Selling price                         $25.00
Product cost                         - $5.00
Shipping to warehouse                - $1.50
Marketplace fees                     - $3.75
Fulfilment fees                      - $5.50
Advertising (per unit, average)      - $3.00
Profit per unit                        $6.25   (25% margin)
\`\`\`

These numbers are illustrative. A VA who understands this calculation can explain why a price change, a higher advertising cost or a new fee matters to the business.

### Where marketplaces and own stores fit

Businesses sell through two main types of channel:

- **Marketplaces**, such as Amazon, eBay, Etsy, Walmart Marketplace and Daraz, bring existing customers but charge fees and set strict rules.
- **Own stores**, built on platforms like Shopify, give full control of branding and customer relationships but require the business to bring its own traffic.

Many successful brands use both: a marketplace for reach, an own store for brand building and repeat customers.

### What this means for you

When you start with a new client, ask: What is your business model? Where do you sell? What are your main costs? Which part of the business takes the most time? The answers show where you can add the most value, whether that is product listings, advertising, customer service or inventory planning. The rest of this course teaches the skills behind each of those areas.
      `,
        [
          q('In a private label model, what does the seller do?', [
            'Ships products they never see from a supplier\'s catalogue',
            'Brands a manufactured product and sells it as their own',
            'Buys discounted items from local shops to resell',
            'Prints designs only when customers order',
          ], 1, 'Private label sellers put their own brand on products made by a manufacturer, gaining control and better margins.'),
          q('What is a main challenge of dropshipping?', [
            'Buying large amounts of stock upfront',
            'Designing products by hand',
            'Getting brand approval for every product',
            'Low margins and less control over quality and shipping',
          ], 3, 'Dropshippers depend on suppliers for quality and delivery, and competition keeps margins thin.'),
          q('Why should a VA understand the client\'s profit calculation?', [
            'Clients expect VAs to set all prices alone',
            'Marketplaces require VAs to report profits',
            'To explain how fees, prices and ad costs affect the business',
            'It replaces the need for bookkeeping',
          ], 2, 'Knowing where money goes lets a VA see why changes in fees, prices or advertising matter.'),
        ]
      ),
      lesson('The Shopify and Amazon Ecosystems', 13, `
Shopify and Amazon are the two platforms this course focuses on, and they represent two very different approaches to selling online. Shopify gives a business its own store; Amazon gives it access to a huge marketplace of existing buyers. Most e-commerce VA work involves one or both.

### Shopify: your own store

Shopify is a platform for building an online store. The business pays a monthly subscription and gets a website with a catalogue, cart, checkout, order management and a large app store for extra features.

- The store has its own domain, such as \`ayeshakhussa.com\`.
- The business controls design, pricing, customer data and branding.
- The business must attract visitors itself, through social media, ads, search engines and email.
- Features can be extended with apps, from reviews to shipping labels.

### Amazon: the marketplace

Amazon is a marketplace where millions of customers already search for products. Sellers list products through Seller Central, their management dashboard.

- Customers trust Amazon's checkout, delivery and returns.
- Listings appear in Amazon's search results alongside competitors.
- Amazon charges fees on each sale and, for Fulfilment by Amazon, for storage and delivery.
- Amazon sets strict rules on listings, reviews and customer contact, and enforces them.

### Side by side

| | Shopify | Amazon |
|---|---|---|
| Traffic | You bring it | Amazon's existing shoppers |
| Branding | Full control | Limited, within Amazon's templates |
| Customer data | You own the relationship | Amazon owns it; contact is restricted |
| Costs | Subscription, apps, payment fees, marketing | Subscription or per-item fee, referral fees, fulfilment and storage fees, advertising |
| Competition | Outside the store | Right next to your listing |
| Rules | Shopify's terms and the law | Amazon's detailed seller policies |

### Other platforms you will meet

Clients may also use Etsy for handmade and vintage goods, eBay, Walmart Marketplace in the US, TikTok Shop, and in Pakistan, Daraz. WooCommerce is a popular WordPress alternative to Shopify. The skills in this course, product data, listings, customer service, inventory and advertising, transfer to all of them.

### How they connect

Many brands run both a Shopify store and an Amazon account. Inventory may be shared, customer questions arrive through both, and marketing on one channel affects sales on the other. Some businesses use Amazon's fulfilment network to deliver Shopify orders too, through Multi-Channel Fulfilment. A VA who understands both platforms can support the whole business, which makes them more valuable than one who knows only one.

### Keeping up with changes

Both platforms change fees, features and policies regularly. Amazon in particular updates seller policies and fee structures, and violations can suspend an account. Make a habit of checking Seller Central news and Shopify's changelog, and never rely on old blog posts or videos for policy details. Always confirm with the official help pages.
      `,
        [
          q('What is the main difference in traffic between Shopify and Amazon?', [
            'Shopify stores must bring their own visitors; Amazon has existing shoppers',
            'Shopify guarantees visitors to every store',
            'Amazon requires sellers to buy all their traffic',
            'Both platforms provide identical traffic',
          ], 0, 'A Shopify store must attract visitors, while Amazon listings appear to shoppers already searching there.'),
          q('Why is contacting customers more restricted on Amazon?', [
            'Amazon customers do not have email addresses',
            'Sellers are not allowed to ship orders',
            'Amazon owns the customer relationship and enforces communication rules',
            'Shopify controls Amazon\'s messaging',
          ], 2, 'Amazon manages customer relationships and limits seller contact to protect buyers.'),
          q('Why should VAs check official help pages instead of old videos for policies?', [
            'Videos about Amazon are always wrong',
            'Official pages are shorter and quicker to read',
            'Clients never watch videos about their business',
            'Rules change, and outdated advice risks the account',
          ], 3, 'Platforms update their rules often, so only current official sources are reliable for policy decisions.'),
        ]
      ),
      lesson('What an E-commerce Virtual Assistant Does', 13, `
A virtual assistant, or VA, works remotely to support an online business. In e-commerce, VAs handle much of the daily work that keeps a store running, freeing the owner to focus on strategy, products and growth. The role ranges from simple admin to specialised skills such as advertising management.

### Common VA tasks

| Area | Typical tasks |
|---|---|
| Listings | Creating and updating product listings, images, titles and descriptions |
| Product research | Finding product opportunities, analysing competitors |
| Advertising | Managing Amazon PPC or Shopify store ads, reporting results |
| Inventory | Tracking stock, planning restocks, preparing shipments |
| Customer service | Answering messages, handling returns, monitoring reviews |
| Store management | Updating Shopify pages, collections, discounts and apps |
| Account health | Monitoring metrics and policy notifications, responding to issues |
| Reporting | Weekly sales, ad and inventory summaries |
| Supplier coordination | Communicating with manufacturers and freight forwarders |

### General VAs and specialist VAs

Some VAs are generalists who handle a variety of tasks. Others specialise, for example in Amazon PPC, listing optimisation or Shopify development. Specialists usually earn more because they bring deeper skills that directly affect sales. A common path is to start as a generalist, find which area you enjoy and do well, and then specialise.

### A day in the life

Hamza's typical day working for Mike's Amazon brand:

\`\`\`text
Morning (US night)
- Check account health and any policy notifications
- Answer customer messages from overnight
- Review yesterday's sales and ad performance

Midday
- Adjust PPC bids and add negative keywords
- Update a listing's bullet points with new keywords

Evening (US morning)
- Call with Mike: weekly priorities
- Prepare the restock plan for the next shipment
- Send the daily summary report
\`\`\`

The time zone difference lets Hamza handle overnight messages before Mike wakes up, an advantage Pakistani VAs often offer US clients.

### Skills that matter

- **Attention to detail**: a wrong price or missing variation can cost sales or cause policy problems.
- **Clear English writing**: for listings, customer messages and reports.
- **Spreadsheet skills**: inventory, ads and profit data live in spreadsheets.
- **Reliability**: owners hand over access to their business; trust is everything.
- **Learning ability**: platforms change constantly.

### Where VAs find work

E-commerce VA jobs appear on Upwork, Fiverr, LinkedIn, Facebook groups for Amazon sellers and specialist job boards. Many long-term roles are with individual sellers and small agencies. Chapter 12 covers how to build a profile and portfolio that win this work.

### Responsibility and trust

As a VA, you often work inside a client's accounts, with access to their sales, customers and sometimes payments. That access comes with responsibility: follow platform rules, protect data, never make risky changes without approval, and communicate clearly about what you have done. A single careless action, such as a policy violation, can suspend an account, which is why professional VAs work carefully and document everything.
      `,
        [
          q('Why do specialist VAs usually earn more than generalists?', [
            'They work longer hours',
            'Platforms pay them directly',
            'Their deeper skills directly affect sales',
            'They never need to communicate with clients',
          ], 2, 'Specialised skills like PPC or listing optimisation have direct revenue impact, which clients value highly.'),
          q('What advantage can the time difference give Pakistani VAs with US clients?', [
            'They can avoid all meetings with clients',
            'It makes Amazon fees lower',
            'Clients do not expect any reports',
            'Handling overnight messages before the client wakes up',
          ], 3, 'Working during the client\'s night lets VAs clear messages and tasks before the business day begins.'),
          q('Why must VAs work carefully inside client accounts?', [
            'A careless action, like a policy violation, can suspend the account',
            'Accounts close automatically after each login',
            'Clients cannot see what VAs do',
            'Platforms do not allow VAs to log in',
          ], 0, 'VAs handle sensitive access, and mistakes can damage the client\'s business, so care and documentation are essential.'),
        ]
      ),
      lesson('Selling and Working From Pakistan', 13, `
Pakistan has a fast-growing community of e-commerce professionals. Many work as VAs for international sellers, some run their own Shopify stores, and an increasing number sell on Amazon directly. Each path has practical realities worth understanding before you start.

### Working as a VA for international sellers

This is the most common path and the easiest to start:

- You need skills, a reliable internet connection, power backup and a laptop, but no inventory or capital.
- Payment usually arrives through freelance platforms or direct international transfers, as covered in freelancing courses.
- Clients are mostly in the US, UK, Canada, Europe and the Gulf.

The main challenges are building trust with clients abroad and working hours that overlap with their time zones.

### Running a Shopify store from Pakistan

Pakistani businesses can use Shopify, but some features differ from those in the US or UK:

| Area | Situation to check |
|---|---|
| Payments | Shopify Payments is not available for Pakistani stores; businesses use third-party gateways that integrate with Shopify, and cash on delivery for local orders |
| Local customers | Cash on delivery is common, so order confirmation and return rates need attention |
| Couriers | Local courier companies offer Shopify apps or integrations for booking and tracking |
| International customers | Card payments through supported gateways and international shipping partners |

Check which payment gateways currently support Pakistani merchants, since options change.

### Selling on Amazon from Pakistan

Amazon added Pakistan to its list of countries eligible for seller registration in 2021. Pakistani sellers can register for marketplaces such as the US and UK, subject to Amazon's verification of identity, business details and bank accounts. Practical considerations include:

- Verification requires accurate, matching documents; any mismatch can delay or block registration.
- Many sellers use Fulfilment by Amazon, shipping inventory to Amazon warehouses abroad.
- Receiving payouts requires a supported bank account or payment service.
- Textiles, leather goods, handicrafts and sports goods are categories where Pakistani manufacturing has natural strengths.

Always follow Amazon's official registration guidance, and never use someone else's documents or identity. Account linking rules are strict, and using another person's details can lead to permanent suspension.

### Daraz and local marketplaces

Daraz is Pakistan's largest online marketplace, and many local businesses sell there. Skills in listings, product photography, customer service and inventory apply directly. Some VAs start by helping local sellers on Daraz before moving to international clients.

### Legal and financial basics

If you earn from international clients or sell abroad, keep proper records, receive money through official banking channels, and register for tax as your income grows. Get professional advice on business registration and export rules if you start selling physical products internationally.

### Choosing your path

\`\`\`text
No capital, want income soon          -> VA for international sellers
Have a product and some capital       -> Shopify store, local and international
Have capital, manufacturing access    -> Amazon private label or wholesale
Want local experience first           -> Help sellers on Daraz
\`\`\`

Many people combine paths: working as a VA while learning, then starting their own brand with the experience and savings gained.
      `,
        [
          q('Which is the easiest e-commerce path to start from Pakistan without capital?', [
            'Working as a VA for international sellers',
            'Launching a private label brand on Amazon',
            'Opening a warehouse in the US',
            'Buying wholesale stock for resale',
          ], 0, 'VA work needs skills and equipment but no inventory or investment, making it the most accessible start.'),
          q('Why is cash on delivery important for Pakistani Shopify stores?', [
            'Shopify requires it for every store worldwide',
            'International customers prefer paying this way',
            'Local shoppers use it widely',
            'It removes the need to use any courier',
          ], 2, 'Local shoppers frequently choose cash on delivery, which affects order confirmation and return management.'),
          q('What is a serious risk when registering an Amazon seller account?', [
            'Choosing the UK marketplace',
            'Using Fulfilment by Amazon',
            'Selling textile products',
            'Using someone else\'s documents or identity',
          ], 3, 'Amazon verifies identity strictly, and using another person\'s details can lead to permanent suspension.'),
        ]
      ),
      ],
      [
      q('Which model involves buying branded products in bulk and reselling them?', [
        'Print on demand',
        'Dropshipping',
        'Wholesale',
        'Handmade',
      ], 2, 'Wholesale sellers buy established branded products in quantity and resell them.'),
      q('What does a Shopify store give a business that Amazon does not?', [
        'Millions of existing shoppers',
        'Automatic reviews on every product',
        'Free fulfilment to every country',
        'Full control of branding and the customer relationship',
      ], 3, 'An own store lets the business control design, data and customer relationships, though it must bring its own traffic.'),
      q('Which task is typical for an e-commerce VA?', [
        'Updating listings and answering customer messages',
        'Manufacturing the products',
        'Setting Amazon\'s fee structure',
        'Designing Shopify\'s checkout software',
      ], 0, 'VAs handle daily operations like listings, messages, ads, inventory and reporting.'),
      q('Why is trust so important in e-commerce VA work?', [
        'VAs are paid only after a year',
        'VAs access sensitive accounts, customers and sales data',
        'Platforms require VAs to sign contracts with them',
        'Clients rarely check VA work',
      ], 1, 'Clients give VAs access to core business systems, so reliability and care are essential.'),
      ]
    ),
    chapter(
      'Building a Shopify Store',
      'Set up a Shopify store with the right plan, domain and settings, customise a theme with the theme editor, build pages, menus and policies, and choose apps carefully so the store stays fast.',
      [
      lesson('Setting Up a Store: Plans, Domain and Settings', 13, `
Setting up a Shopify store takes minutes, but the choices made in the first hour affect the business for years: the plan, the domain, the currency and the basic settings. As a VA, you may set up stores for clients or inherit ones set up badly, so knowing the right foundation matters.

### Creating the store

Shopify usually offers a free trial. After signing up, the store receives a permanent address ending in \`.myshopify.com\`, such as \`ayesha-khussa.myshopify.com\`. This internal address never changes, even after a custom domain is added, and it is how apps and support identify the store.

### Plans

Shopify offers several plans, from basic plans for new stores to advanced plans and Shopify Plus for large businesses. Higher plans generally add more staff accounts, better reporting and lower transaction fees in regions where Shopify Payments is available. Prices and features change, so check Shopify's pricing page. Most small stores start on a basic plan and upgrade when the business grows.

### Connecting a domain

A custom domain, such as \`ayeshakhussa.com\`, builds trust and brand recognition. There are two routes:

| Route | How it works |
|---|---|
| Buy through Shopify | Shopify registers and connects the domain automatically |
| Connect an existing domain | Update DNS records at the domain registrar to point to Shopify |

When connecting a domain bought elsewhere, Shopify's instructions typically ask for:

\`\`\`text
A record    @     points to Shopify's IP address (shown in the admin)
CNAME       www   points to shops.myshopify.com
\`\`\`

Follow the exact values shown in the Shopify admin, since they are the authoritative source. DNS changes can take up to a couple of days to spread. Then set the custom domain as the primary domain so visitors are redirected to it.

### Essential settings

Open Settings in the Shopify admin and check these early:

| Setting | Why it matters |
|---|---|
| Store details | Business name, contact email and address appear on receipts and policies |
| Store currency | The currency prices are set in; changing it after sales creates complications |
| Time zone | Affects reports and order timestamps |
| Units of measurement | Weight units affect shipping rate calculations |
| Order ID format | Prefixes like \`AK-1001\` help recognise orders |
| Checkout settings | Whether customers need accounts, what information is required |
| Notifications | Order confirmation and shipping emails customers receive |

For a Pakistani store selling mainly locally, the currency is usually PKR. For stores targeting international customers, discuss currency and payment options with the client before setup; chapter 4 covers selling internationally.

### Staff and collaborator accounts

Never ask a client for their owner login. Instead, the owner adds you as a staff member with only the permissions you need, or, for agencies and developers, sends a collaborator request. Chapter 12 explains access and security in detail.

### Before launch

A new store is password-protected by default, so only people with the password can see it. Remove the password only when the store is ready: products added, payments tested, shipping configured, policies published and a test order placed and refunded. Launching too early, with broken checkout or missing policies, wastes the first visitors and advertising spend.

### Keep a setup log

Record every major setting and decision in a shared document: domain registrar, DNS changes, apps installed, payment gateway, courier accounts. When something breaks months later, or when another VA takes over, this log saves hours of detective work.
      `,
        [
          q('What happens to a store\'s .myshopify.com address after a custom domain is added?', [
            'It is deleted permanently',
            'It changes to match the new domain',
            'It stays the same and is used internally',
            'It becomes the primary domain automatically',
          ], 2, 'The myshopify.com address is permanent and still identifies the store to apps and support.'),
          q('How should a VA get access to a client\'s Shopify store?', [
            'By asking for the owner\'s password',
            'Through a staff or collaborator account with limited permissions',
            'By creating a copy of the store',
            'By logging in through the client\'s email',
          ], 1, 'Staff and collaborator accounts give controlled access without sharing the owner\'s login.'),
          q('When should a store\'s password protection be removed?', [
            'Immediately after signing up for the trial',
            'Before adding any products, to attract early visitors',
            'As soon as the theme and logo have been chosen',
            'Once the store works end to end and is tested',
          ], 3, 'Launching only when the store works end to end avoids wasting early visitors and ad spend.'),
        ]
      ),
      lesson('Themes and the Theme Editor', 13, `
The theme controls how a Shopify store looks and how customers move through it. A good theme, well configured, makes a store look trustworthy and easy to shop. Most customisation today happens in the theme editor without touching code, which is where VAs spend much of their store design time.

### Choosing a theme

The Shopify Theme Store offers free themes made by Shopify and paid themes made by other developers. When choosing:

| Consider | Why |
|---|---|
| Industry fit | Fashion stores need large images; electronics stores need specifications and filters |
| Speed | Lighter themes load faster, especially on mobile |
| Features built in | Mega menus, filters, quick view or colour swatches without extra apps |
| Support and updates | Themes that are actively maintained stay compatible with new Shopify features |
| Mobile experience | Most visitors shop on phones |

Free Shopify themes are a solid starting point for most small stores. Paid themes can save time with advanced features, but more features also mean more complexity.

### Sections and blocks

Modern Shopify themes are built from sections, and sections contain blocks:

\`\`\`text
Home page template
  Section: Image banner       (blocks: heading, text, button)
  Section: Featured collection
  Section: Image with text
  Section: Testimonials       (blocks: one per testimonial)
  Section: Newsletter signup
\`\`\`

In the theme editor (Online Store, Themes, Customize), you add, remove and reorder sections, and adjust each one's settings, such as images, headings and colours. Changes appear in the live preview before you save.

### Templates

Different page types use templates: home, product, collection, page, blog post and more. You can create alternative templates, for example a special product template for bundles with extra information sections, then assign it to specific products in their settings. This lets different products present different content without code.

### Theme settings

Global theme settings control the brand look across the whole store:

- **Colours**: backgrounds, text, buttons and sale badges.
- **Typography**: heading and body fonts.
- **Logo and favicon**: sized correctly for desktop and mobile headers.
- **Buttons and cards**: shapes and styles.
- **Social media links** and **cart behaviour**.

Setting these once keeps every page consistent.

### Always work on a duplicate

Before significant changes, duplicate the live theme (Actions, Duplicate) and edit the copy. Preview it, check it on mobile, and publish only when ready. If something goes wrong, the previous theme is one click away. For big projects like a redesign, name duplicates clearly, such as \`Live backup 2025-03-10\` and \`Redesign draft\`.

### When code is needed

Some changes require editing theme code, written in Shopify's Liquid templating language with HTML, CSS and JavaScript. Examples include custom product badges or unusual layouts. Many e-commerce VAs learn small CSS adjustments, but larger code changes are usually done by Shopify developers. If you edit code, always work on a duplicate theme and note every change.

### Check the mobile view

The theme editor has a mobile preview button. Check every important page on it, then on a real phone. Look for text that is too small, images that crop badly, buttons that are hard to tap and menus that are confusing. A store that looks great on a laptop but awkward on phones loses most of its customers.
      `,
        [
          q('What are sections and blocks in a Shopify theme?', [
            'The building units of page templates',
            'Payment options shown at checkout',
            'Types of shipping rates for each zone',
            'Customer account levels and permissions',
          ], 0, 'Sections form a page, and blocks inside them hold content such as headings, text and buttons.'),
          q('Why duplicate the live theme before making major changes?', [
            'Shopify charges less for duplicated themes',
            'Duplicates load faster for customers',
            'Only duplicates can be edited in the theme editor',
            'You can preview safely and restore the previous version if needed',
          ], 3, 'Working on a copy protects the live store and keeps an easy backup.'),
          q('Why use an alternative product template?', [
            'To change the store\'s currency',
            'To give specific products a different layout or information',
            'To connect a custom domain',
            'To add staff accounts',
          ], 1, 'Alternative templates let some products, like bundles, show different content without code.'),
        ]
      ),
      lesson('Pages, Navigation and Store Policies', 12, `
Beyond products, a store needs supporting pages that answer customers' questions and build trust: who the business is, how to contact it, how shipping and returns work. Clear navigation helps customers find what they want quickly. Together, these make the difference between a store that feels real and one that feels risky.

### Essential pages

| Page | Purpose |
|---|---|
| About | The story, values and people behind the brand |
| Contact | Email, phone, WhatsApp or a contact form, business hours |
| FAQ | Answers to common questions about sizing, delivery and payment |
| Shipping information | Delivery areas, times and costs |
| Size guide | Essential for clothing and shoes |
| Track order | A link or page for tracking, often provided by a courier app |

Create pages under Online Store, Pages, and add them to menus.

### Writing the About page

Customers buy from people they trust. A short, genuine About page works far better than generic claims:

\`\`\`text
Weak:   "We are a leading provider of high-quality footwear solutions."

Strong: "Every pair is hand-stitched in our Lahore workshop by artisans
         who have made khussas for over twenty years. We started in 2021
         with twelve designs; today we ship across Pakistan and abroad."
\`\`\`

Specific details, real photos of the workshop or team, and honest numbers build credibility.

### Navigation menus

Menus are managed under Content or Online Store, Navigation (the location varies by admin version). Most stores have:

- **Main menu**: the header navigation with the most important collections, such as Women, Men, New Arrivals and Sale.
- **Footer menu**: policies, contact, FAQ and about links.

Keep the main menu short and clear, around five to seven items, using words customers use rather than internal jargon. Nested dropdown menus help large catalogues, but too many levels confuse customers on mobile.

### Store policies

Shopify lets you create legal policies under Settings, Policies:

| Policy | What it covers |
|---|---|
| Refund or return policy | Conditions, time limits and process for returns |
| Privacy policy | What customer data is collected and how it is used |
| Terms of service | The rules of buying from the store |
| Shipping policy | Delivery areas, times and costs |
| Contact information | Required business contact details |

Shopify can generate templates, but they must be edited to reflect how the business actually operates. A return policy that promises 30-day returns when the client only accepts 7 days creates disputes. Policies are linked automatically in checkout, and many payment providers and ad platforms require clear policies before approving a store. The client is responsible for the legal content; for complex businesses, recommend they check policies with a legal professional.

### Trust signals

Customers look for signs that a store is legitimate, especially new brands:

- Real contact details, including a phone or WhatsApp number.
- Clear, visible return and shipping information.
- Genuine reviews and photos from customers.
- Secure checkout and recognised payment options.
- A consistent, professional design across all pages.

For cash on delivery stores in Pakistan, clear delivery and return information reduces refused orders, because customers know what to expect before ordering.

### Keep pages current

Outdated pages hurt trust: an old phone number, delivery times that no longer apply, or a sale banner from last Eid. Review key pages every few months and whenever policies change.
      `,
        [
          q('What makes an About page build trust?', [
            'Generic claims about being an industry leader',
            'No details, to keep it short',
            'Only the company\'s registration number',
            'Specific, genuine details about the people and story',
          ], 3, 'Concrete details and real photos make a brand feel credible, unlike vague marketing language.'),
          q('Why must Shopify\'s generated policy templates be edited?', [
            'They must reflect how the business actually operates',
            'Shopify deletes unedited templates',
            'Templates are written in the wrong language',
            'Unedited templates cannot be linked in checkout',
          ], 0, 'Policies that do not match real practice cause disputes and mislead customers.'),
          q('How many items should a main menu usually have?', [
            'One single link',
            'Every collection in the store',
            'Around five to seven clear items',
            'At least twenty for search engines',
          ], 2, 'A short, clear main menu helps customers find categories quickly, especially on mobile.'),
        ]
      ),
      lesson('Choosing Apps Without Bloating the Store', 12, `
The Shopify App Store offers thousands of apps for reviews, upsells, subscriptions, shipping, email marketing and more. Apps are one of Shopify's great strengths, but they are also the most common cause of slow, buggy stores. Choosing apps carefully is a core skill for anyone managing a Shopify store.

### What apps are for

Apps extend a store with features the theme and Shopify do not include. Common categories:

| Category | Example uses |
|---|---|
| Reviews | Collect and display product reviews with photos |
| Email and SMS | Newsletters, abandoned cart messages, flows |
| Shipping and couriers | Rate calculation, label printing, tracking pages |
| Upsells and bundles | "Frequently bought together", volume discounts |
| Subscriptions | Recurring orders for consumables |
| SEO and images | Image compression, structured data |
| Translation and currency | Multiple languages and currencies |

### Why fewer is better

Many apps add scripts that load on every page. Each script slows the store, and slow stores lose customers, especially on mobile connections. Apps can also conflict with each other or with the theme, causing layout problems or broken features.

\`\`\`text
Before installing an app, ask:
1. Does Shopify or our theme already do this?
2. Is this feature essential, or just nice to have?
3. What does it cost monthly, and does it pay for itself?
4. How many good recent reviews does it have?
5. What access does it request?
\`\`\`

Many features that once required apps are now built into Shopify or modern themes, such as product filtering, basic discounts, some bundles and customer reviews in certain setups. Check first.

### Evaluating an app

- **Reviews and ratings**: read recent reviews, especially negative ones, for recurring problems.
- **Built for Shopify badge**: Shopify awards this to apps meeting its quality and performance standards; it is a useful signal.
- **Permissions**: an app requesting access far beyond its purpose is a warning sign.
- **Support**: responsive developers matter when something breaks during a sale.
- **Pricing**: note free trials and when billing starts; monthly costs add up across several apps.

### Test before committing

Install new apps first while working on a duplicate theme where possible, and test on mobile. Check page speed and look for layout issues. Then enable on the live theme when satisfied.

### Removing apps properly

Uninstalling an app does not always remove the code it added to the theme. Leftover code can still slow the store or cause errors. After uninstalling, check the app's documentation for removal steps, and review the theme for leftover snippets or app blocks. Modern app blocks and app embeds, which are added through the theme editor, are generally cleaner to remove than older apps that edited theme code directly.

### Keep an app register

Maintain a simple list:

| App | Purpose | Monthly cost | Installed | Owner approval |
|---|---|---|---|---|
| Reviews app | Product reviews with photos | Free plan | 2025-02-01 | Yes |
| Courier app | Booking and tracking | Per shipment | 2025-02-03 | Yes |

Review it quarterly. Remove apps nobody uses. Clients appreciate VAs who reduce costs and keep their store fast, and it is an easy win to show value.
      `,
        [
          q('Why can too many apps harm a Shopify store?', [
            'Their scripts slow pages and they can conflict',
            'Shopify limits stores to three apps',
            'Apps delete products automatically',
            'Apps change the store\'s domain',
          ], 0, 'Each app can add code that slows loading or clashes with the theme and other apps.'),
          q('What should you check before installing a new app?', [
            'Only whether it has a free plan',
            'Whether it has the most downloads ever',
            'Whether it changes the store\'s colours',
            'Whether Shopify or the theme already provides the feature',
          ], 3, 'Many features are built in, so checking first avoids unnecessary apps, costs and slowdowns.'),
          q('What should you do after uninstalling an app?', [
            'Reinstall it to confirm it works',
            'Change the store currency',
            'Check for leftover code and follow removal steps',
            'Delete the theme',
          ], 2, 'Uninstalling does not always remove added code, which can keep slowing the store.'),
        ]
      ),
      ],
      [
      q('A client bought a domain elsewhere. How is it connected to Shopify?', [
        'By emailing Shopify support the password',
        'By renaming the myshopify address',
        'By updating DNS records at the registrar as the admin instructs',
        'It cannot be connected',
      ], 2, 'Pointing the domain\'s DNS records to Shopify, as shown in the admin, connects an existing domain.'),
      q('Where should most visual customisation of a modern Shopify theme happen?', [
        'In the store\'s policies under Settings',
        'In the theme editor',
        'In the payment and checkout settings',
        'In the app register spreadsheet',
      ], 1, 'The theme editor controls layout and style without code for most changes.'),
      q('What is a key reason clear policies matter for a store?', [
        'They improve product photo quality',
        'They replace the need for an About page',
        'They increase the number of apps allowed',
        'Customers, payment providers and ad platforms rely on them',
      ], 3, 'Clear, accurate policies build trust and are often required for payments and advertising approval.'),
      q('What is a quick way for a VA to show value in an existing store?', [
        'Removing unused apps to reduce costs and speed up the store',
        'Installing as many apps as possible',
        'Changing the theme every week',
        'Deleting the store\'s policies',
      ], 0, 'Auditing apps lowers costs and improves speed, a visible, low-risk improvement.'),
      ]
    ),
    chapter(
      'Products and Collections on Shopify',
      'Add products with correct variants, prices and inventory, write descriptions and prepare photos that sell, organise the catalogue with collections, tags and metafields, and edit many products at once with the bulk editor and CSV imports.',
      [
      lesson('Adding Products, Variants and Inventory', 14, `
Products are the heart of any store, and adding them correctly is the task e-commerce VAs perform most often. A product with a wrong price, missing size or inaccurate stock count costs sales and creates customer complaints. Getting the structure right from the start keeps the catalogue clean as it grows.

### The product form

In the Shopify admin, Products, Add product opens a form with these key fields:

| Field | Purpose and tips |
|---|---|
| Title | Clear name customers understand, such as "Embroidered Khussa, Maroon" |
| Description | Benefits, details, materials and care; covered in the next lesson |
| Media | Photos and videos; the first is the main image |
| Price | The selling price |
| Compare-at price | The original price, shown crossed out during a sale |
| Cost per item | What the product costs the business; used in profit reports, never shown to customers |
| SKU | The internal stock code, such as \`KH-MAR-38\` |
| Barcode | GTIN, UPC or EAN if the product has one |
| Inventory | Quantity per location, and whether to keep selling when out of stock |
| Shipping | Weight and, for international orders, country of origin and HS code |
| Product organisation | Type, vendor, category, collections and tags |
| Status | Draft or Active; drafts are hidden from customers |

### Variants

When a product comes in different options, such as size and colour, use variants rather than separate products. Add options like Size (36, 37, 38, 39, 40) and Colour (Maroon, Gold), and Shopify creates each combination as a variant with its own price, SKU, stock and image.

\`\`\`text
Product: Embroidered Khussa
  Option 1: Colour   Maroon, Gold
  Option 2: Size     36, 37, 38, 39, 40
  Variants: 10 combinations, each with SKU, price and stock
    KH-MAR-36   PKR 4,500   stock 5
    KH-MAR-37   PKR 4,500   stock 8
    ...
    KH-GLD-40   PKR 4,800   stock 3
\`\`\`

Shopify has limits on the number of options and variants per product; check the current limits for large catalogues.

### SKU conventions

A consistent SKU system makes inventory, orders and reports far easier. Agree a pattern with the client:

\`\`\`text
[Category]-[Style/Colour]-[Size]
KH-MAR-38   Khussa, maroon, size 38
BG-BLK-L    Bag, black, large
\`\`\`

Avoid spaces and special characters, and never reuse a SKU for a different product.

### Inventory tracking

Turn on inventory tracking for physical products so Shopify reduces stock with each order. Decide deliberately about "Continue selling when out of stock": useful for made-to-order products with a clear delivery time, dangerous for items that cannot be restocked. Stores with more than one location, such as a shop and a warehouse, can track stock per location.

### Draft first, then publish

Create new products as drafts, check them on the storefront preview, including on mobile, and set them to Active only when images, prices, variants and descriptions are correct. Also check the sales channels the product is published to, such as the online store, social shops or other channels.

### A product checklist

\`\`\`text
[ ] Title clear and consistent with the catalogue
[ ] All variants created with correct SKUs and prices
[ ] Cost per item entered for profit reporting
[ ] Stock quantities checked with the client
[ ] Weight entered for shipping rates
[ ] Main image and gallery images in order
[ ] Collections, type and tags assigned
[ ] SEO title and description reviewed
[ ] Previewed on mobile before activating
\`\`\`

Following a checklist for every product prevents the small errors that add up in large catalogues.
      `,
        [
          q('When a shoe comes in five sizes and two colours, how should it be set up?', [
            'As ten separate products with different titles',
            'As one product with variants for each combination',
            'As one product with sizes listed only in the description',
            'As two products, one per colour, without sizes',
          ], 1, 'Variants keep all combinations under one product, each with its own SKU, price and stock.'),
          q('What is the "cost per item" field used for?', [
            'Showing a crossed-out price to customers',
            'Calculating shipping rates for each order',
            'Profit reporting, without being shown to customers',
            'Setting the tax rate for the product',
          ], 2, 'Cost per item stays internal and lets Shopify report margins and profit.'),
          q('When is "continue selling when out of stock" risky?', [
            'For made-to-order products with clear delivery times',
            'For digital products that never run out',
            'For products with many photos in the gallery',
            'For items that cannot be restocked',
          ], 3, 'Selling items that cannot be replaced leads to cancelled orders and disappointed customers.'),
        ]
      ),
      lesson('Product Photos and Descriptions That Sell', 13, `
Online shoppers cannot touch, try or examine products. Photos and descriptions do the job a shop assistant would do in person. Strong product content increases sales and reduces returns, because customers know exactly what they are buying.

### What product photos should show

| Image type | Purpose |
|---|---|
| Main image | The product clearly on a clean background, the first thing customers see |
| Angles | Front, back, sides and top for a complete view |
| Details | Close-ups of stitching, materials, textures and features |
| Scale | The product in a hand or on a person, so size is obvious |
| Lifestyle | The product in use, showing how it fits into life |
| Variants | Each colour or style photographed accurately |
| Infographic | Key features or dimensions labelled on the image |

For clothing and footwear, photos on real people of different sizes help customers judge fit.

### Consistency and technical quality

- Use the same background, lighting and angles across a collection so the catalogue looks professional.
- Use a consistent aspect ratio, often square or 4:5, so product grids line up.
- Export images large enough to zoom on (Shopify supports large images) but compressed so pages load quickly.
- Name image files descriptively, such as \`maroon-embroidered-khussa-side.jpg\`, and add alt text describing the image for accessibility and search.

Colour accuracy matters: if a maroon khussa looks red in photos, customers may return it. Photograph in natural light or with neutral lighting, and compare the photo on a phone with the real product.

### Writing product descriptions

A good description answers the questions a customer would ask a shop assistant:

\`\`\`text
Headline benefit:   Why this product? (comfort, style, occasion)
Key details:        Material, size and fit, colours, dimensions
Use and care:       How to use, wash or store it
Reassurance:        Delivery time, returns, handmade note
\`\`\`

Write for scanning. Most shoppers skim, so use short paragraphs and bullet points.

### Example

\`\`\`text
Hand-embroidered in Lahore, this maroon khussa pairs beautifully with
wedding and Eid outfits.

- Genuine leather upper with golden tilla embroidery
- Cushioned insole for all-day comfort
- True to size; if between sizes, choose the larger
- Handmade, so small variations make each pair unique

Care: wipe with a dry cloth; store in the dust bag provided.
Ships in 2 to 3 working days across Pakistan.
\`\`\`

### Features and benefits

A feature describes the product; a benefit explains why it matters to the customer. "Cushioned insole" is a feature; "comfortable for long wedding functions" is the benefit. Strong descriptions connect the two.

### Avoid copying supplier text

Dropshippers and wholesalers often receive manufacturer descriptions. Copying them word for word creates duplicate content found on many other sites, and supplier text is often poorly written. Rewrite descriptions in the brand's voice, with the details customers care about.

### Honest claims only

Never exaggerate or invent claims such as "100% waterproof" or "best in Pakistan" unless they are true and provable. Misleading descriptions cause returns, negative reviews, and can break advertising and consumer protection rules. Clear, accurate information sells better over time than hype.
      `,
        [
          q('Why include a scale image of a product?', [
            'It replaces the need for a main image',
            'Platforms require at least one scale image',
            'It shows customers the real size of the product',
            'It makes the page load faster',
          ], 2, 'Seeing the product in a hand or on a person helps shoppers judge size accurately.'),
          q('What is the difference between a feature and a benefit?', [
            'A feature describes the product; a benefit explains why it matters',
            'A feature is a price; a benefit is a discount',
            'Features are for Amazon; benefits are for Shopify',
            'There is no difference between them',
          ], 0, 'Connecting features to benefits shows customers how the product improves their situation.'),
          q('Why should VAs rewrite supplier descriptions?', [
            'Supplier text cannot be pasted into Shopify',
            'Rewritten descriptions are always shorter',
            'Shopify charges for copied descriptions',
            'Copied text is duplicated elsewhere and often poorly written',
          ], 3, 'Original descriptions in the brand\'s voice are more persuasive and avoid duplicate content.'),
        ]
      ),
      lesson('Collections, Tags and Metafields', 13, `
As a catalogue grows from ten products to hundreds, organisation becomes essential. Customers need to browse logically, and store managers need to find and update products quickly. Shopify's collections, tags, product types and metafields provide this structure.

### Collections

Collections group products for customers to browse, such as "Women's Khussas", "Bridal Collection" or "Under PKR 3,000". There are two kinds:

| Type | How products are added | Best for |
|---|---|---|
| Manual | You choose each product individually | Curated selections, small featured groups |
| Automated (smart) | Products added automatically when they meet conditions | Categories, price ranges, new arrivals |

An automated collection might use conditions like:

\`\`\`text
Product type   is equal to   Khussa
AND Tag        is equal to   women
\`\`\`

Every new women's khussa is added automatically when created with the right type and tag. For large catalogues, automated collections save enormous time and prevent products being forgotten.

### Tags

Tags are labels attached to products. They are flexible and invisible to customers unless a theme displays them. Common uses:

- Feeding automated collections: \`bridal\`, \`new-arrival\`, \`sale\`.
- Filtering in the admin: find all products tagged \`eid-2025\`.
- Triggering app behaviour, such as badges or shipping rules.

Tags only work if they are consistent. \`Bridal\`, \`bridal\` and \`bridal-wear\` may be treated as different tags by apps or collection rules. Agree a tag list with the client and document it:

\`\`\`text
Tag standards (lowercase, hyphens)
season:    eid-2025, winter-2025
audience:  women, men, kids
feature:   handmade, bridal, casual
status:    new-arrival, bestseller, clearance
\`\`\`

### Product types, vendors and categories

Product type (such as Khussa, Bag, Clutch) and vendor (brand or supplier) help organise the admin and can drive collections. Shopify's standard product category, chosen from a list, helps with taxes in some regions and with marketplaces and sales channels. Fill all three consistently.

### Filters

Customers shopping large collections expect filters by size, colour, price and availability. Shopify's Search & Discovery app lets stores add filters based on variant options, product type, vendor, tags, price and metafields. Clean, consistent product data is what makes filters work; messy data creates confusing filter options.

### Metafields: custom product information

Sometimes products need information that has no standard field, such as material, heel height, care instructions, fabric weight or a size chart. Metafields are custom fields for this:

1. Define the metafield in Settings, Custom data, for products, for example "Material" as a single-line text field.
2. Fill it in on each product's page.
3. Display it on the product page by connecting it to a theme section through the theme editor's dynamic source option.

Metafields keep structured information consistent across products and make it filterable. They are more reliable than writing the same details in every description, because a change to the field updates how it appears everywhere.

### Plan the structure early

Before adding hundreds of products, plan the collections, tags, types and metafields with the client. Reorganising a large, messy catalogue later takes far longer than setting it up well at the start, and a clear structure is one of the most valuable things a VA can deliver.
      `,
        [
          q('What is the advantage of an automated collection?', [
            'Products matching its conditions are added automatically',
            'It changes product prices during sales',
            'It hides products from search engines',
            'It can only contain one product',
          ], 0, 'Condition-based collections stay up to date as matching products are created, without manual work.'),
          q('Why must tags be consistent?', [
            'Customers read every tag on the storefront',
            'Shopify deletes inconsistent tags',
            'Variations like Bridal and bridal-wear break collection rules and filters',
            'Tags determine the store\'s currency',
          ], 2, 'Collection conditions and apps match exact tags, so inconsistent spelling causes products to be missed.'),
          q('What are metafields used for?', [
            'Storing customer passwords',
            'Changing the store\'s domain',
            'Recording staff login times',
            'Custom product information, like material or heel height',
          ], 3, 'Metafields hold structured custom data that can be displayed and filtered consistently.'),
        ]
      ),
      lesson('Bulk Editing and CSV Imports', 12, `
Adding or updating products one at a time works for a small store. For a catalogue of hundreds or thousands of items, or a price change across a whole collection, bulk tools save hours and reduce errors. Every e-commerce VA should be comfortable with Shopify's bulk editor and CSV files.

### The bulk editor

In the Products list, select several products and choose Bulk edit. A spreadsheet-like view opens where each row is a product or variant and columns are fields. You can add columns such as price, compare-at price, SKU, inventory, tags and weight, then edit values directly.

Useful for:

- Updating prices for a sale across a collection.
- Adding cost per item to many products.
- Fixing weights for shipping calculations.
- Adding tags to a group of products.

Click Save when finished, and spot-check a few products on the storefront afterwards.

### CSV import and export

For larger changes, Shopify's product CSV file is powerful. Export products (Products, Export), edit the file in a spreadsheet, and import it back. Shopify's product CSV includes columns such as:

\`\`\`text
Handle, Title, Body (HTML), Vendor, Type, Tags, Published,
Option1 Name, Option1 Value, Option2 Name, Option2 Value,
Variant SKU, Variant Price, Variant Compare At Price,
Variant Inventory Tracker, Variant Weight Unit,
Image Src, Image Position, SEO Title, SEO Description, Status
\`\`\`

The Handle column identifies each product. Rows with the same handle belong to the same product: the first row holds product details, and following rows hold additional variants or images.

### A safe CSV workflow

\`\`\`text
1. Export the current products first, as a backup.
2. Work on a copy of the export, not the backup.
3. Change only the columns you need.
4. Import a few products as a test and check them in the admin and storefront.
5. Import the full file, choosing whether to overwrite existing products
   with the same handle.
6. Check a sample of products after import.
\`\`\`

When importing, Shopify offers an option to overwrite products with matching handles. Understand exactly what it does before using it: blank cells in some columns can overwrite existing data.

### Spreadsheet pitfalls

- **Leading zeros**: SKUs or barcodes like \`00123\` may lose zeros in spreadsheet software. Format those columns as text.
- **Encoding**: save as UTF-8 CSV to keep special characters and Urdu text intact.
- **Commas and line breaks**: descriptions with commas or line breaks must stay inside quotes; spreadsheet software handles this if you save as CSV properly.
- **Scientific notation**: long barcodes can turn into \`1.23E+12\`. Format as text before pasting.

### Inventory CSV

Inventory quantities have their own export and import under Inventory, useful after a stock count. Always confirm which location the quantities apply to.

### When to use an app

For very large or complex catalogues, dedicated import and export apps offer more control, such as updating metafields, collections and redirects in bulk, and scheduled imports from supplier files. Many agencies use them. For most small stores, the built-in tools are enough.

### Double-check before saving

Bulk tools make mistakes bulk too. A wrong formula can set every price to zero or delete every compare-at price. Keep the backup export, check a sample after every change, and tell the client what you changed. That habit is what makes clients comfortable giving you access to their whole catalogue.
      `,
        [
          q('In a Shopify product CSV, what does the Handle column do?', [
            'Identifies which rows belong to the same product',
            'Sets the product\'s price',
            'Controls the store\'s theme',
            'Lists customer names',
          ], 0, 'Rows sharing a handle are treated as one product, holding its variants and images.'),
          q('Why export products before a CSV import?', [
            'Shopify requires an export before every import',
            'To keep a backup in case the import causes problems',
            'Exports make imports run faster',
            'To delete old products automatically',
          ], 1, 'A backup export lets you restore the original data if an import goes wrong.'),
          q('A barcode shows as 1.23E+12 after editing in a spreadsheet. What prevents this?', [
            'Saving the file as a PDF',
            'Adding more columns',
            'Deleting the barcode column',
            'Formatting the column as text before pasting',
          ], 3, 'Text formatting stops spreadsheets converting long numbers into scientific notation.'),
        ]
      ),
      ],
      [
      q('What should new products be set to until they are checked?', [
        'Active, so customers see them immediately',
        'Draft',
        'Archived',
        'Deleted',
      ], 1, 'Draft status hides products until details, images and prices are verified.'),
      q('Which image helps customers most when judging colour and texture?', [
        'A company logo',
        'A size chart only',
        'Accurate close-up detail shots',
        'A stock photo of a similar product',
      ], 2, 'Detailed, colour-accurate close-ups show materials and textures, reducing returns.'),
      q('A client wants all bridal products to appear in one collection automatically. What is the best setup?', [
        'A manual collection updated weekly',
        'A separate store for bridal products',
        'Writing "bridal" in each description',
        'An automated collection based on a bridal tag',
      ], 3, 'Automated collections with a consistent tag include every matching product without manual updates.'),
      q('What is the most important habit when using bulk editing tools?', [
        'Editing without looking at the results',
        'Changing every column at once',
        'Keeping a backup and checking samples after changes',
        'Avoiding telling the client about changes',
      ], 2, 'Bulk tools can spread mistakes widely, so backups and spot checks protect the catalogue.'),
      ]
    ),
    chapter(
      'Payments, Shipping and Orders',
      'Set up payment methods and a smooth checkout, configure shipping zones and rates, process orders, refunds and returns correctly, and handle taxes, currencies and international customers.',
      [
      lesson('Payment Gateways and Checkout', 13, `
The checkout is where browsing turns into revenue. A confusing or untrustworthy checkout loses customers at the final step, after all the effort of attracting them. Setting up payments correctly and testing the checkout are among the most important jobs before launch.

### Payment options in Shopify

Payment settings live under Settings, Payments. There are three broad types:

| Type | Examples | Notes |
|---|---|---|
| Shopify Payments | Shopify's own card processing | Simplest option, but only available in supported countries |
| Third-party providers | Payment gateways and wallets that integrate with Shopify | Needed where Shopify Payments is unavailable; each has its own fees and approval |
| Manual methods | Cash on delivery, bank transfer | Orders marked as payment pending until confirmed manually |

Shopify Payments is not available for stores based in Pakistan, so Pakistani stores use third-party gateways that support Shopify, along with manual methods like cash on delivery and bank transfer. Gateway options change, so check which providers currently support Pakistani merchants and compare their fees, settlement times and approval requirements.

### Cash on delivery: the Pakistani reality

For many local stores, a large share of orders are cash on delivery (COD). COD builds trust with first-time buyers but brings challenges:

- **Fake or impulse orders**: some customers order without intending to accept delivery.
- **Returned parcels**: refused COD parcels come back, and the store pays courier costs both ways.
- **Cash flow**: money arrives only after the courier collects and settles it.

Common practices to reduce problems:

\`\`\`text
1. Confirm each COD order by WhatsApp message or call before shipping.
2. Flag orders with incomplete addresses or suspicious details.
3. Offer a small discount for prepaid orders.
4. Track refusal rates by city and courier.
\`\`\`

A VA who confirms orders promptly and politely can noticeably reduce refused deliveries.

### Testing the checkout

Never launch without testing. Shopify provides a test gateway, and many providers offer test modes. Place test orders that cover:

- A card or wallet payment through the real gateway, then refund it.
- A COD order, checking the confirmation email wording.
- Discount codes and free shipping thresholds.
- Different shipping zones and addresses.

Check the order confirmation email and the order in the admin. Problems found in testing cost nothing; problems found by customers cost sales and trust.

### Checkout settings

Under Settings, Checkout, review:

| Setting | Consideration |
|---|---|
| Customer accounts | Allowing guest checkout usually reduces abandonment |
| Contact method | Email, phone or both; phone numbers matter for couriers and COD confirmation |
| Address fields | Require the details couriers need, such as phone and city |
| Tipping, notes and marketing consent | Enable only what the business needs |
| Order processing | Automatic fulfilment settings and archiving |

### Abandoned checkouts

When a customer enters contact details but leaves without paying, Shopify records an abandoned checkout. Automated abandoned checkout emails, available through Shopify's marketing automations or email apps, remind customers and often recover sales. Keep the message friendly and helpful, not pushy.

### Trust at checkout

Show recognisable payment logos, clear delivery costs before the final step, and links to return policies. Surprise costs at checkout, especially shipping fees revealed only at the end, are one of the most common reasons customers abandon their carts.
      `,
        [
          q('Why do Pakistani Shopify stores use third-party payment gateways?', [
            'Third-party gateways never charge fees',
            'Shopify Payments is not available for stores based in Pakistan',
            'Shopify forbids cash on delivery in Pakistan',
            'Customers in Pakistan cannot use cards',
          ], 1, 'Where Shopify Payments is unavailable, supported third-party gateways and manual methods are used.'),
          q('What is a common way to reduce refused COD deliveries?', [
            'Shipping orders without any customer contact',
            'Removing all delivery information from the store',
            'Charging customers twice for delivery',
            'Confirming orders by WhatsApp or call before shipping',
          ], 3, 'Confirming orders filters out fake or impulse orders before courier costs are incurred.'),
          q('What commonly causes customers to abandon checkout?', [
            'Guest checkout being available',
            'Clear return policy links',
            'Unexpected costs, like shipping, revealed at the end',
            'Recognisable payment logos',
          ], 2, 'Surprise costs at the final step erode trust and cause many abandoned carts.'),
        ]
      ),
      lesson('Shipping Zones, Rates and Fulfilment', 13, `
Shipping is where many stores lose money or customers. Charge too little and profit disappears into courier fees; charge too much and customers abandon their carts. Shopify's shipping settings let you match rates to real costs, and a clear fulfilment routine gets orders to customers quickly.

### Shipping profiles, zones and rates

Shipping is configured under Settings, Shipping and delivery:

| Concept | Meaning | Example |
|---|---|---|
| Shipping profile | A group of products with the same shipping rules | General products versus heavy items |
| Zone | A set of countries or regions | Pakistan; Gulf countries; Rest of world |
| Rate | The price customers pay for a zone | PKR 250 standard delivery |

Most small stores use one general profile, with zones for domestic and international shipping.

### Types of rates

\`\`\`text
Flat rate               PKR 250 for any order in Pakistan
Weight-based            PKR 250 up to 1 kg, PKR 400 up to 3 kg
Price-based             Free shipping on orders over PKR 5,000
Carrier-calculated      Live rates from carriers (depends on plan and region)
Local delivery          Delivery within the city by the store's own riders
Local pickup            Customers collect from the shop
\`\`\`

Free shipping thresholds are popular because they encourage larger orders. Set the threshold above the average order value, so customers add one more item to qualify, and make sure the margin covers the shipping cost.

### Weights must be accurate

Weight-based rates only work if every product has an accurate weight, including packaging. A missing weight can mean shipping calculated as zero, costing the business on every order. Check weights as part of the product checklist from chapter 3.

### Couriers in Pakistan

Local stores typically work with courier companies that offer booking portals, COD collection and Shopify integrations or apps. These integrations can:

- Create bookings from Shopify orders automatically.
- Print shipping labels and airway bills.
- Send tracking numbers back to Shopify, which emails them to customers.
- Show COD collection and settlement reports.

Compare couriers on delivery speed by city, COD settlement time, return handling and reliability, not only on price.

### The fulfilment routine

A consistent daily routine keeps orders flowing:

\`\`\`text
1. Review new orders; confirm COD orders.
2. Check stock and pick items.
3. Pack securely with invoice and any inserts.
4. Book the courier and print labels.
5. Mark orders as fulfilled in Shopify with tracking numbers.
6. Hand parcels to the courier; keep receipts.
7. Follow up on exceptions: delays, failed deliveries, returns.
\`\`\`

Marking an order as fulfilled with a tracking number triggers the shipping confirmation email, which reduces "where is my order?" messages.

### Setting delivery expectations

Show estimated delivery times on product pages, in the cart and in the shipping policy, such as "2 to 4 working days in major cities". Update them during busy periods like Eid, sales events or courier disruptions. Customers are far more patient when they know what to expect.

### Packaging and presentation

Good packaging protects the product and builds the brand: a sturdy box or mailer, tissue paper, a thank-you card, and clear return instructions. For handmade or gift products, presentation often features in customer reviews and social media posts.

### Track shipping costs

Every month, compare what customers paid for shipping with what the business paid couriers, including returned parcels. If the gap is large, adjust rates or thresholds. Shipping silently eating profit is a common problem that a VA can spot and fix.
      `,
        [
          q('What is a shipping zone in Shopify?', [
            'A group of products with the same weight',
            'A set of countries or regions with their own rates',
            'The warehouse where stock is kept',
            'A courier\'s delivery vehicle',
          ], 1, 'Zones group destinations so each can have appropriate shipping rates.'),
          q('Why must every product have an accurate weight?', [
            'Customers see the weight in the product title',
            'Shopify refuses to publish products without weights',
            'Weight-based rates are calculated from it',
            'It changes the product\'s tax rate',
          ], 2, 'Missing or wrong weights produce incorrect shipping charges, often costing the business money.'),
          q('What happens when an order is marked fulfilled with a tracking number?', [
            'The order is refunded automatically',
            'The product is deleted from the catalogue',
            'The customer is charged again',
            'Shopify sends the customer a shipping confirmation',
          ], 3, 'Fulfilment with tracking triggers the shipping email, reducing customer enquiries.'),
        ]
      ),
      lesson('Processing Orders, Refunds and Returns', 13, `
Orders are the daily heartbeat of a store. Processing them accurately, and handling cancellations, refunds and returns fairly, keeps customers happy and protects the business. VAs often own this entire process, so understanding each step and its effects is essential.

### Reading an order

Each order in the Shopify admin shows two separate statuses:

| Status | Possible values | Meaning |
|---|---|---|
| Payment status | Paid, Pending, Authorised, Partially refunded, Refunded | Whether money has been received |
| Fulfilment status | Unfulfilled, Partially fulfilled, Fulfilled | Whether items have been shipped |

A COD order typically shows Payment pending until the cash is collected and the order is marked as paid. The order timeline records every action, email and note, which is invaluable when investigating problems.

### Useful order tools

- **Tags**: label orders, such as \`confirmed\`, \`vip\`, \`address-issue\`, to filter and track them.
- **Notes**: record customer requests or phone call outcomes.
- **Saved views**: create filtered lists, like "Unfulfilled COD orders older than 2 days".
- **Risk indicators**: where available, review orders flagged as risky before shipping.

### Cancelling orders

If a customer cancels before shipping, cancel the order in Shopify, choose whether to restock the items, and refund any payment received. Record the reason. Tracking cancellation reasons, such as "ordered by mistake" or "delivery too slow", reveals problems worth fixing.

### Refunds

To refund, open the order and choose Refund:

\`\`\`text
1. Select the items and quantities being refunded.
2. Choose whether to restock them.
3. Decide whether to refund shipping.
4. Confirm the amount and add a reason.
5. Notify the customer.
\`\`\`

For payments through a gateway, the refund returns to the original payment method. For COD orders, refunds are paid manually, often by bank transfer or wallet, and marked in Shopify. Always follow the client's refund policy and get approval for exceptions.

### Returns and exchanges

Shopify includes return management: you can create a return on an order, track its progress, and restock items once received. Some regions support return shipping labels and self-service return requests from customers.

A clear returns process:

| Step | Action |
|---|---|
| Request | Customer asks within the policy period, with order number and reason |
| Approval | Check eligibility against the policy |
| Instructions | Tell the customer how and where to send the item |
| Receipt | Inspect the item when it arrives |
| Resolution | Refund, exchange or store credit, and restock if appropriate |

For exchanges, such as a different shoe size, many stores send the new item once the original is received, or create a new order and link it in notes.

### Why accurate processing matters

Every refund and restock updates reports and inventory. Forgetting to restock a returned item makes stock appear lower than it is; restocking a damaged item leads to selling something unsellable. Refunding without recording the reason loses information that could improve the business.

### Communicate at every step

Customers worry about their money. Confirm when a return is received, when a refund is issued and how long it may take to appear. Most negative reviews about returns come from silence, not from the policy itself.
      `,
        [
          q('What does "payment pending" typically mean on a COD order?', [
            'Cash has not yet been collected and confirmed',
            'The order was cancelled',
            'The customer paid twice',
            'The order has been refunded',
          ], 0, 'COD orders stay pending until the cash is collected and the order is marked as paid.'),
          q('Why record reasons for cancellations and refunds?', [
            'Shopify deletes orders without reasons',
            'Customers must approve each reason',
            'Patterns in reasons reveal problems worth fixing',
            'Reasons change the tax on the order',
          ], 2, 'Tracking why orders are cancelled or refunded highlights issues like slow delivery or sizing.'),
          q('What happens if a returned item is not restocked?', [
            'The customer is charged again',
            'The product is removed from the store',
            'The refund is cancelled automatically',
            'Stock appears lower than it really is',
          ], 3, 'Forgetting to restock usable returns makes inventory inaccurate and can cause missed sales.'),
        ]
      ),
      lesson('Taxes, Currencies and Selling Internationally', 13, `
Selling to customers in other countries opens a much larger market, especially for Pakistani products with strong demand abroad, such as handmade crafts, textiles, leather goods and traditional clothing. International selling adds complexity: taxes, currencies, customs and delivery times. VAs should understand the basics and know when to involve professionals.

### Taxes

Tax rules depend on where the business is registered and where customers are located. Shopify's tax settings, under Settings, Taxes and duties, can calculate and collect taxes in many regions, but the business is responsible for knowing its obligations, registering where required and filing returns.

As a VA, your role is to configure settings according to instructions from the client or their accountant, not to decide tax obligations yourself. When in doubt, recommend the client consults a qualified tax professional in their country.

### Currencies

| Setup | What customers experience |
|---|---|
| Single currency | All prices and checkout in the store's currency, such as PKR or USD |
| Converted display only | Prices shown in the visitor's currency for reference, but charged in the store currency |
| Multi-currency checkout | Customers pay in their own currency; depends on supported payment providers |

Automatic multi-currency checkout in Shopify has relied on Shopify Payments, which Pakistani stores cannot use. Many Pakistani stores that sell abroad therefore charge in one currency, often PKR or USD depending on the gateway, and clearly state this at checkout. Always explain to customers which currency they will be charged in, to avoid disputes.

### Shopify Markets

Shopify Markets lets stores manage international selling in one place: which countries to sell to, pricing adjustments, languages, domains and duties, depending on the plan and payment setup. Features vary, so explore the current Markets settings for the client's plan and region.

### Customs and duties

International parcels need customs information:

\`\`\`text
Product description   Handmade leather khussa shoes
HS code               Harmonised System code for the product type
Country of origin     Pakistan
Value                 Declared value in the correct currency
\`\`\`

Enter country of origin and HS codes on products (chapter 3) so shipping integrations can fill customs forms automatically.

Duties and import taxes may be charged to the customer on arrival (often called delivered duty unpaid), or collected at checkout and paid by the sender (delivered duty paid). Unexpected duties on arrival cause refused parcels and angry reviews, so state clearly who pays them.

### International shipping options

Pakistani stores can ship abroad through international couriers, postal services or cross-border shipping companies that consolidate parcels. Compare cost, delivery time, tracking quality and how returns are handled. International returns are expensive, so many stores offer exchanges or store credit rather than full returns for international orders, clearly stated in policies.

### Localise the experience

For customers abroad, clear English content, sizes converted to international standards, delivery times by country, and prices in a familiar currency increase trust. A size chart showing Pakistani, UK, EU and US sizes, for example, prevents many returns for footwear and clothing.

### Start small

Rather than opening to every country at once, many stores start with a few markets where demand is proven, such as the UK, UAE or US, where many Pakistani diaspora customers live. Learn the shipping, customs and customer questions for those markets, then expand.
      `,
        [
          q('What is a VA\'s role in configuring taxes?', [
            'Deciding which taxes the business owes',
            'Filing tax returns for the client',
            'Ignoring tax settings entirely',
            'Configuring settings as the client or accountant instructs',
          ], 3, 'Tax obligations are the business\'s responsibility, so VAs follow professional instructions rather than deciding.'),
          q('Why should stores state clearly who pays import duties?', [
            'Duties are always free for customers',
            'Shopify refuses international orders otherwise',
            'Surprise duties on arrival cause refused parcels and bad reviews',
            'Couriers only deliver prepaid duties',
          ], 2, 'Customers who face unexpected charges often refuse delivery, costing the store money and reputation.'),
          q('What information do international parcels need for customs?', [
            'Description, HS code, country of origin and value',
            'Only the customer\'s email address',
            'The store\'s theme name',
            'The product\'s SEO title',
          ], 0, 'Customs declarations require these details, which can be stored on products for automatic forms.'),
        ]
      ),
      ],
      [
      q('Which payment method is especially common for local Pakistani online orders?', [
        'Cheques by post',
        'Cryptocurrency',
        'Cash on delivery',
        'Gift cards only',
      ], 2, 'Cash on delivery is widely used locally, bringing trust benefits and return risks.'),
      q('Why set a free shipping threshold above the average order value?', [
        'To make shipping free on every order',
        'To encourage customers to add items to qualify',
        'To avoid calculating shipping at all',
        'Shopify requires it',
      ], 1, 'A threshold slightly above typical spending nudges customers to increase their order size.'),
      q('An order shows Paid and Unfulfilled. What does this mean?', [
        'The order has been delivered and refunded',
        'The customer has not paid yet',
        'The order was cancelled',
        'Money is received but items have not shipped',
      ], 3, 'Payment and fulfilment statuses are separate, so this order still needs to be shipped.'),
      q('What should customers always know before paying on an international order?', [
        'Which currency they will be charged in',
        'The store owner\'s personal address',
        'The HS code of every product',
        'The VA\'s working hours',
      ], 0, 'Clear currency information prevents confusion and disputes over charges.'),
      ]
    ),
    chapter(
      'Amazon Seller Central Foundations',
      'Navigate Seller Central and monitor account health, understand ASINs, SKUs, variations and the featured offer, compare FBA with FBM, and follow the Amazon policies that protect a seller\'s account.',
      [
      lesson('A Tour of Seller Central and Account Health', 13, `
Seller Central is the dashboard where Amazon sellers manage everything: listings, inventory, orders, advertising, payments and performance. For an Amazon VA, it is the main workplace. Knowing where things are, and especially how to read account health, is the foundation of every other skill.

### The main menu areas

| Menu | What you do there |
|---|---|
| Catalog | Add products, edit listings, manage variations |
| Inventory | Manage stock, FBA inventory and shipments |
| Pricing | Adjust prices, automate pricing, view fee previews |
| Orders | View and manage orders, returns and messages |
| Advertising | Campaign Manager for Sponsored Products and other ads |
| Stores | Brand storefronts, for brand-registered sellers |
| Growth | Recommendations and programmes from Amazon |
| Reports | Business reports, fulfilment reports, payments and returns |
| Performance | Account Health, feedback, A-to-z claims and notifications |

Menu layouts change from time to time, and the search bar in Seller Central is often the fastest way to find a page.

### The home dashboard

The home page shows sales summaries, open orders, buyer messages awaiting replies, and alerts. Many VAs start every shift by checking three things: new messages, account health and any performance notifications. Problems caught early are much easier to fix.

### Account health: the most important page

Amazon measures sellers against performance targets and policy compliance. The Account Health page shows them in one place. Amazon's published targets have included:

| Metric | What it measures | Target |
|---|---|---|
| Order Defect Rate (ODR) | Orders with negative feedback, A-to-z claims or chargebacks | Under 1% |
| Late Shipment Rate | Seller-fulfilled orders confirmed as shipped late | Under 4% |
| Pre-fulfilment Cancel Rate | Seller-fulfilled orders cancelled by the seller before shipping | Under 2.5% |
| Valid Tracking Rate | Seller-fulfilled shipments with valid tracking | Above 95% |

Check Amazon's current Account Health pages, since targets and metrics can change.

### Account Health Rating

The Account Health Rating summarises policy compliance. It considers issues such as intellectual property complaints, listing policy violations, product safety concerns and restricted products. A healthy rating keeps the account in good standing; a poor one can lead to listings being removed or the account being deactivated.

### Performance notifications

Amazon communicates important issues through Performance Notifications: listing removals, policy warnings, requests for documents and account reviews. These often have deadlines. A VA should:

\`\`\`text
1. Check notifications daily.
2. Read each one carefully and note any deadline.
3. Inform the client immediately about serious issues.
4. Gather the requested information or documents.
5. Respond through the correct Seller Central process, never by guessing.
\`\`\`

Ignoring notifications is one of the most common causes of preventable account problems.

### Reports worth knowing

- **Business Reports**: sessions, page views, units ordered, conversion rate and sales by ASIN.
- **Inventory reports**: stock levels, stranded inventory and restock recommendations.
- **Payments reports**: settlements, fees and deductions.
- **Return reports**: return reasons by product.

Chapter 12 shows how to turn these into weekly client reports.
      `,
        [
          q('What does Order Defect Rate include?', [
            'Late shipments and cancelled orders',
            'Negative feedback, A-to-z claims and chargebacks',
            'Returns for any reason',
            'Out-of-stock listings',
          ], 1, 'ODR combines negative feedback, A-to-z Guarantee claims and credit card chargebacks as a share of orders.'),
          q('What should a VA check at the start of every shift?', [
            'Only the advertising budget',
            'Only the competitor prices',
            'Only the product images',
            'New messages, account health and performance notifications',
          ], 3, 'Checking these first catches urgent issues before they grow into bigger problems.'),
          q('Why must performance notifications be handled quickly?', [
            'They disappear after one hour',
            'Customers can read them',
            'They often have deadlines, and ignoring them risks the account',
            'They reduce advertising costs when answered',
          ], 2, 'Notifications flag policy and performance issues that require timely responses to protect the account.'),
        ]
      ),
      lesson('Listings: ASINs, SKUs and Variations', 14, `
On Amazon, products are organised differently from a Shopify store. Many sellers can sell the same product on one shared product page, and each seller's offer competes for the featured position. Understanding identifiers, listings and variations is essential before creating or editing anything.

### The key identifiers

| Identifier | What it is | Who owns it |
|---|---|---|
| ASIN | Amazon Standard Identification Number, a 10-character code for each product page | Amazon |
| SKU | The seller's own stock code for their offer | The seller |
| GTIN (UPC, EAN) | A global product barcode number | Issued through GS1 or held by the brand |
| FNSKU | Amazon's label code used to track a seller's FBA units | Amazon, per seller offer |

A single ASIN, such as a popular water bottle, can have offers from several sellers, each with their own SKU and price.

### Detail pages and offers

Amazon keeps one detail page per product. When you list a product:

- If the product already exists on Amazon, you add your offer to the existing ASIN. You cannot change the page freely, and your product must exactly match it.
- If the product does not exist, you create a new ASIN with its own detail page, title, bullets, images and description.

Private label brands create their own ASINs. Wholesale sellers usually add offers to existing ASINs.

### The featured offer

When several sellers offer the same ASIN, Amazon chooses one offer to show in the main "Add to Cart" position, known as the featured offer or Buy Box. Factors include price, delivery speed, fulfilment method and seller performance. Most sales go to the featured offer, so wholesale VAs monitor it closely.

### GTINs and exemptions

Most new listings require a GTIN, such as a UPC or EAN barcode. Brands that manufacture their own products and lack barcodes can apply for a GTIN exemption in certain categories. Barcodes should come from legitimate sources; Amazon checks GTINs against GS1 data and may remove listings with invalid ones.

### Variations: parent and child

Products with sizes, colours or styles are grouped as variations:

\`\`\`text
Parent ASIN (not buyable): Silicone Spatula Set
  Child ASIN: Red,   3-piece
  Child ASIN: Red,   5-piece
  Child ASIN: Black, 3-piece
  Child ASIN: Black, 5-piece
\`\`\`

The parent groups the children on one page with selectors. Each child has its own ASIN, SKU, price, stock and images. Each category supports specific variation themes, such as Size, Color or SizeColor.

Rules to remember:

- Variations must be genuinely the same product in different sizes, colours or styles. Grouping different products to share reviews breaks Amazon's policy.
- Choose the variation theme carefully; changing it later can be difficult.

### Brand Registry

Brand owners with a registered or pending trademark can enrol in Amazon Brand Registry. It gives more control over listings and access to tools such as A+ Content, Sponsored Brands ads, Stores and brand analytics. Many VA tasks, like A+ Content in chapter 7, require Brand Registry.

### Editing listings safely

Before editing a listing, record the current values. Make one change at a time and check that it appears correctly. Some fields may be controlled by the brand owner or by Amazon's catalogue data, so your change may not display. Use Amazon's listing quality tools to find missing attributes, which can also affect search visibility.
      `,
        [
          q('What is an ASIN?', [
            'The seller\'s own stock code',
            'A shipping label for FBA units',
            'Amazon\'s identifier for a product detail page',
            'A barcode issued by the supplier\'s country',
          ], 2, 'ASINs identify product pages in Amazon\'s catalogue, while SKUs belong to individual sellers.'),
          q('What is the featured offer, often called the Buy Box?', [
            'The offer Amazon shows in the main Add to Cart position',
            'A box of free samples for reviewers',
            'The packaging used for FBA shipments',
            'An advertising campaign type',
          ], 0, 'Amazon selects one offer for the main purchase button, and most sales go through it.'),
          q('Why is grouping unrelated products as variations a problem?', [
            'Amazon charges extra for each variation',
            'Variations cannot have images',
            'Customers cannot buy child ASINs',
            'It breaks Amazon\'s policy against misusing variations',
          ], 3, 'Variations must be the same product in different sizes, colours or styles, not unrelated items sharing reviews.'),
        ]
      ),
      lesson('FBA Versus FBM', 13, `
Once a product is listed, someone has to store it, pack it and deliver it. On Amazon, sellers choose between two main methods: Fulfilment by Amazon (FBA), where Amazon does the work, and Fulfilment by Merchant (FBM), where the seller does. Many sellers use both for different products.

### Fulfilment by Amazon (FBA)

With FBA, the seller sends inventory to Amazon's fulfilment centres. When customers order, Amazon picks, packs, ships, handles customer service for delivery issues, and processes returns.

Advantages:

- Products usually become eligible for Prime delivery, which many customers prefer.
- Amazon handles storage, shipping and many customer queries.
- FBA offers often compete strongly for the featured offer.
- The seller can scale without their own warehouse.

Costs and challenges:

- Fulfilment fees per unit, based on size and weight.
- Monthly storage fees, which rise in the busy season, plus surcharges for inventory stored too long.
- Amazon has introduced additional fees in recent years, such as fees related to inbound placement and low inventory levels.
- Strict preparation and labelling rules for inbound shipments.
- Capacity limits on how much inventory can be stored.

Check Amazon's current fee pages, since fees change regularly.

### Fulfilment by Merchant (FBM)

With FBM, the seller stores inventory and ships orders themselves or through a third-party logistics company (3PL).

Advantages:

- No FBA storage or fulfilment fees.
- More control over packaging and presentation.
- Suits large, heavy, slow-moving or custom products.

Challenges:

- The seller must meet the shipping performance targets shown on the Account Health page.
- Customer service for delivery issues is the seller's responsibility.
- Without Prime eligibility, offers may be less attractive, although some sellers qualify for Seller Fulfilled Prime.

### Comparing the two

| | FBA | FBM |
|---|---|---|
| Storage | Amazon warehouses | Seller or 3PL |
| Shipping | Amazon | Seller or 3PL |
| Prime badge | Usually yes | Only through Seller Fulfilled Prime |
| Returns | Amazon processes | Seller processes |
| Fees | Fulfilment and storage fees | Shipping costs and own operations |
| Best for | Fast-moving, small to medium products | Heavy, slow-moving or made-to-order items |

### A worked comparison

\`\`\`text
Product: silicone spatula set, sells 300 units a month

FBA:   fulfilment fee per unit + storage fee
       -> Prime badge, higher conversion, less daily work

FBM:   packaging + courier cost per unit + staff time
       -> no storage fees, but slower delivery and more work
\`\`\`

The right choice depends on actual numbers. Amazon's revenue calculator helps estimate fees for a product under each method.

### Multi-Channel Fulfilment

Inventory stored with FBA can also fulfil orders from other channels, such as a Shopify store, through Multi-Channel Fulfilment. This lets brands use one stock pool for both, though fees apply and Amazon's rules on packaging should be checked.

### The VA's role

Whichever method a client uses, VAs typically monitor stock levels, create shipments, track deliveries into Amazon, resolve problems and compare fulfilment costs. Chapter 9 covers FBA shipments and inventory planning in detail.
      `,
        [
          q('What is a key advantage of FBA?', [
            'No fees of any kind',
            'Complete control over custom packaging',
            'No preparation rules for shipments',
            'Products usually become Prime-eligible and Amazon handles fulfilment',
          ], 3, 'FBA provides Prime eligibility and hands storage, shipping and many customer issues to Amazon.'),
          q('Which product is often better suited to FBM?', [
            'A small, fast-selling phone accessory',
            'A heavy, slow-moving item',
            'A lightweight product in high demand',
            'Any product eligible for Prime',
          ], 1, 'Heavy or slow-moving items can incur high FBA fees, making self-fulfilment more economical.'),
          q('What does Multi-Channel Fulfilment allow?', [
            'Listing products on several Amazon accounts',
            'Shipping directly from suppliers to customers',
            'Using FBA inventory to fulfil orders from other channels',
            'Avoiding all fulfilment fees',
          ], 2, 'MCF lets brands fulfil orders from channels like Shopify using stock stored in Amazon warehouses.'),
        ]
      ),
      lesson('Amazon Policies Every VA Must Know', 13, `
Amazon enforces its rules strictly and often automatically. A single serious violation can remove listings, freeze payments or deactivate an account, sometimes permanently. Because VAs work inside client accounts, knowing the key policies is not optional; it is part of the job.

### The Seller Code of Conduct

Amazon's Seller Code of Conduct requires sellers to act fairly and honestly, provide accurate information, avoid misleading customers and not manipulate reviews, sales rankings or search. Most specific policies grow from these principles.

### Reviews: the most dangerous area

| Allowed | Not allowed |
|---|---|
| Using the Request a Review button in Seller Central | Offering refunds, gifts, discounts or free products for reviews |
| Amazon's own programmes such as Vine, where eligible | Asking only happy customers to review |
| Neutral follow-up messages permitted by Amazon | Asking customers to change or remove negative reviews in exchange for anything |
| Improving products based on review feedback | Friends, family or employees reviewing products |
| | Buying reviews or using review-exchange groups |

Review manipulation is one of the most common reasons for account suspension. If a client asks you to do anything in the right-hand column, explain the risk and decline.

### Communicating with buyers

Buyer-seller messages are for completing orders and customer service, such as delivery questions, returns and product help. Messages must not contain marketing, links to external websites, requests for positive reviews, or attempts to move the customer off Amazon. Reply to customer messages promptly; Amazon has long expected replies within 24 hours, including weekends.

### Intellectual property

- Do not use other brands' trademarks in titles, keywords or images unless you sell their genuine product.
- Do not copy other sellers' images or text.
- Never sell counterfeit goods.
- Take intellectual property complaints seriously; repeated complaints damage account health.

### Accurate listings

- Products must match their listing exactly: condition, brand, size and contents.
- Do not add an offer to an ASIN for a product that is not identical.
- Claims such as "FDA approved", "organic" or "antibacterial" require proof and may be restricted.
- Some categories and products are restricted or need approval before listing.

### Accounts and access

- Amazon generally expects one seller account per seller, unless there is a legitimate business need that complies with its rules.
- Never log into a client's account from devices or networks linked to suspended accounts, and avoid sharing logins; use user permissions instead (chapter 12).
- Keep business details accurate and respond to verification requests promptly.

### Pricing and dropshipping

Amazon's fair pricing policy prohibits prices far above recent prices or significantly higher than elsewhere, especially during emergencies. Its dropshipping policy requires the seller to be the seller of record, with no other retailer's packing slips or branding in the package.

### When in doubt, ask and document

\`\`\`text
1. Check the official policy page in Seller Central Help.
2. Tell the client what the policy says and what you recommend.
3. Get written approval before any risky change.
4. Keep a log of what was changed and why.
\`\`\`

A VA who protects the account earns deep trust. Clients remember the assistant who prevented a suspension far longer than the one who saved an hour.
      `,
        [
          q('Which review practice is allowed on Amazon?', [
            'Using the Request a Review button',
            'Offering a discount for a five-star review',
            'Asking friends to review the product',
            'Refunding customers who leave positive reviews',
          ], 0, 'Amazon\'s own tools are permitted, while any incentive or manipulation risks suspension.'),
          q('What must buyer-seller messages avoid?', [
            'Answering delivery questions',
            'Explaining how to return a product',
            'Replying within 24 hours',
            'Marketing, external links and requests for positive reviews',
          ], 3, 'Messages are for order completion and service, so promotional content and review requests are prohibited.'),
          q('A client asks the VA to add a product to an ASIN that is similar but not identical. What should the VA do?', [
            'Add it, since similar is close enough',
            'Add it but change the title',
            'Decline, because offers must match the ASIN exactly',
            'Add it under a different SKU',
          ], 2, 'Offers must be identical to the product page, and mismatches lead to complaints and policy problems.'),
        ]
      ),
      ],
      [
      q('Which Seller Central page shows ODR, shipping metrics and policy compliance together?', [
        'Campaign Manager',
        'Business Reports',
        'Account Health',
        'Manage Inventory',
      ], 2, 'The Account Health page summarises performance targets and policy compliance in one place.'),
      q('Several sellers offer the same water bottle. How is this represented on Amazon?', [
        'One ASIN with offers from each seller',
        'A separate ASIN for every seller',
        'One seller per product only',
        'Separate detail pages per country only',
      ], 0, 'Amazon keeps one detail page per product, with multiple sellers\' offers competing on it.'),
      q('Which is a cost specific to FBA?', [
        'Printing your own courier labels',
        'Paying your own warehouse staff',
        'Buying packaging for each order',
        'Monthly storage fees in Amazon warehouses',
      ], 3, 'FBA sellers pay Amazon for storage and fulfilment, while FBM sellers bear their own operational costs.'),
      q('What is one of the most common reasons for Amazon account suspension?', [
        'Replying to customers quickly',
        'Review manipulation',
        'Using Brand Registry',
        'Selling in more than one category',
      ], 1, 'Incentivised or fake reviews violate Amazon policy and frequently lead to suspension.'),
      ]
    ),
    chapter(
      'Product Research and Sourcing',
      'Find products with genuine demand and room to compete, use research tools like Helium 10, Jungle Scout and Keepa, analyse competitors and reviews for opportunities, and work with suppliers while calculating real profit.',
      [
      lesson('Finding Products With Real Demand', 13, `
Choosing the right product is the most important decision in an e-commerce business. A great listing and clever advertising cannot rescue a product nobody wants, or one in a market dominated by giants. Product research is a common VA service, and doing it well requires combining data with judgement.

### What makes a good product opportunity

Private label sellers commonly look for a combination of these factors:

| Factor | What to look for | Why |
|---|---|---|
| Demand | Steady sales across several sellers, not one dominant seller | Customers are already buying |
| Competition | Top listings with a moderate number of reviews, not tens of thousands | A new seller can realistically compete |
| Price | A price that leaves margin after all fees | Low-priced items rarely leave profit after FBA fees and ads |
| Size and weight | Small and light where possible | Lower shipping and fulfilment fees |
| Seasonality | Consistent demand, or clearly planned seasonal sales | Avoid stock stuck after the season |
| Differentiation | Clear ways to improve on existing products | Gives customers a reason to choose you |
| Simplicity | Few parts, low breakage risk, no complex compliance | Fewer returns and legal problems |

No product meets every criterion perfectly. The goal is a good balance with a clear reason customers would choose it.

### Best Sellers Rank

Every Amazon product has a Best Sellers Rank (BSR) in its category. A lower number means more recent sales relative to other products in that category. BSR is useful for comparing products, but it is relative, changes constantly and differs by category. Research tools convert BSR into estimated monthly sales, which are estimates, not exact figures.

### Sources of ideas

- Amazon's Best Sellers, Movers and Shakers, and New Releases lists.
- Amazon's own Product Opportunity Explorer in Seller Central, which shows niche-level search and sales data for eligible sellers.
- Research tool databases, filtered by price, sales and reviews.
- Customer complaints in reviews of existing products.
- Trends in social media and search, checked against actual sales data.
- Local manufacturing strengths, such as sports goods in Sialkot or textiles in Faisalabad, for sellers with access to Pakistani suppliers.

### Avoid common traps

\`\`\`text
Trap                                  Why it hurts
Big brands dominate the search        Customers prefer the brand they know
Seasonal spike mistaken for demand    Sales vanish after the season
Very low price                        Fees and ads leave no profit
Fragile or complex products           Returns and damage eat margins
Products needing special approvals    Delays, restrictions and legal risk
Patented or trademarked designs       Infringement complaints and removals
\`\`\`

Always check that a product does not infringe patents or trademarks. Many sellers have lost inventory by copying a design protected by someone else's rights.

### Validate before committing

Before recommending a product, validate it with several data points: sales estimates from more than one tool, search volume for its main keywords, price history, and the number of competing sellers. Then calculate profit, as the last lesson shows. A product that looks exciting in one tool but fails the profit calculation is not an opportunity.

### Present research clearly

Clients want a clear recommendation, not a spreadsheet dump. A strong research summary covers the opportunity, the evidence, the competition, the estimated profit, the risks and your recommendation. Chapter 12 returns to how professional reporting builds long-term client relationships.
      `,
        [
          q('What does a lower Best Sellers Rank indicate?', [
            'Fewer sales than higher-ranked products',
            'More recent sales relative to its category',
            'A lower price than competitors',
            'Fewer reviews than competitors',
          ], 1, 'BSR is relative within a category, with lower numbers meaning more recent sales.'),
          q('Why are very low-priced products often poor private label choices?', [
            'Customers do not buy cheap products',
            'Amazon does not allow low prices',
            'They cannot be shipped through FBA',
            'Fees and advertising leave little or no profit',
          ], 3, 'Fixed fees and ad costs consume most of a low price, leaving thin or negative margins.'),
          q('Why check patents and trademarks before choosing a product?', [
            'Amazon charges extra for patented products',
            'Patented products cannot be photographed',
            'Infringement leads to complaints, removals and lost inventory',
            'Trademarked products always sell less',
          ], 2, 'Selling products that infringe others\' rights risks listing removal and account problems.'),
        ]
      ),
      lesson('Research Tools: Helium 10, Jungle Scout and Keepa', 13, `
Amazon does not publish exact sales figures, so sellers rely on research tools that estimate sales, track prices and reveal keywords. Helium 10, Jungle Scout and Keepa are among the most widely used. Clients often expect VAs to know at least one of them well.

### What these tools do

| Tool | Known for |
|---|---|
| Helium 10 | A suite covering product research, keyword research, listing optimisation and more |
| Jungle Scout | Product research, sales estimates, supplier information and keyword tools |
| Keepa | Price and sales rank history for Amazon products |

Features, names and prices change, and both Helium 10 and Jungle Scout offer many modules. Many clients already pay for one of them and give their VA access.

### Helium 10 modules VAs commonly use

- **Black Box**: search a product database with filters such as price, revenue, reviews and weight.
- **Xray** (browser extension): estimates sales and revenue for products on an Amazon search results page.
- **Cerebro**: reverse ASIN lookup, showing keywords a competitor's product ranks for.
- **Magnet**: keyword research from a seed keyword.

### Jungle Scout features VAs commonly use

- **Product Database** and **Opportunity Finder**: filter products and niches by demand and competition.
- **Browser extension**: sales estimates on Amazon pages.
- **Keyword Scout**: search volume and related keywords.
- **Supplier Database**: information about manufacturers based on import records.

### Keepa: the history view

Keepa shows graphs of a product's price, BSR and offer count over time. It answers questions that snapshots cannot:

\`\`\`text
Is demand steady or seasonal?          BSR graph over 12 months
Do sellers keep cutting prices?         Price history
Does the product often go out of stock? Gaps in the offer graph
Did a new competitor change the market? Changes in rank or price
\`\`\`

A product selling well only in December, or one where prices have fallen steadily for a year, looks very different through Keepa than through a single day's data.

### Using an estimate responsibly

All sales estimates are models based on BSR and other signals. Different tools can give noticeably different numbers for the same product. Good practice:

- Compare estimates from two tools where possible.
- Look at trends over time, not one day.
- Treat estimates as ranges, not precise facts.
- Combine them with keyword search volume and review growth, which provide independent evidence.

### A simple research workflow

\`\`\`text
1. Filter a product database for your criteria (price, revenue, reviews, size).
2. Shortlist 10 to 20 products or niches.
3. For each, run the extension on the main keyword's search page.
4. Check Keepa history for seasonality and price stability.
5. Run Cerebro or Keyword Scout on top competitors for keyword data.
6. Record results in a comparison spreadsheet.
7. Calculate profit for the best candidates.
\`\`\`

### Access and accounts

Research tools are paid subscriptions. Use the client's account where they provide it, through team or sub-user features if available, rather than sharing a single login. Never use cracked or shared "group buy" accounts, which break the tools' terms, can expose client data and look unprofessional if discovered.
      `,
        [
          q('What does Keepa mainly show?', [
            'Customer email addresses',
            'Supplier factory locations',
            'Price and sales rank history over time',
            'Advertising bids for keywords',
          ], 2, 'Keepa graphs price, rank and offers over time, revealing trends and seasonality.'),
          q('What does a reverse ASIN lookup like Cerebro reveal?', [
            'The keywords a competitor\'s product ranks for',
            'The competitor\'s supplier contract',
            'The competitor\'s exact profit',
            'The names of the competitor\'s customers',
          ], 0, 'Reverse ASIN tools list the search terms that bring traffic to a given product.'),
          q('How should sales estimates from research tools be treated?', [
            'As exact figures from Amazon',
            'As useless numbers to be ignored',
            'As guaranteed future sales',
            'As ranges, compared across tools and over time',
          ], 3, 'Estimates are modelled from signals like BSR, so they are best used as ranges and trends.'),
        ]
      ),
      lesson('Competitor and Review Analysis', 12, `
Competitors' listings are a free education. Their reviews tell you exactly what customers love and hate, their listings show which features they emphasise, and gaps between them reveal opportunities. Careful competitor analysis is how private label sellers design better products and write better listings.

### What to analyse for each competitor

| Area | Questions |
|---|---|
| Price | Where do they sit, and does price seem to drive sales? |
| Reviews | How many, what rating, how fast are they growing? |
| Images | What do they show, and what is missing? |
| Title and bullets | Which features and keywords do they emphasise? |
| Variations | Which sizes, colours or bundles do they offer? |
| Fulfilment | FBA or FBM, delivery speed |
| Brand presence | A+ Content, brand store, video |

Record findings in a spreadsheet so patterns across competitors become visible.

### Mining reviews for insights

Reviews, especially three-star and lower, are the richest source of product improvement ideas. Read enough reviews to see recurring themes:

\`\`\`text
Product: silicone spatula set

Common complaints            Opportunity
"Handle got loose"           Stronger one-piece moulded design
"Stains with turmeric"       Darker colour or stain-resistant silicone
"Too big for small pans"     Add a smaller spatula to the set
"Smells of chemicals"        Food-grade certification, clearly stated

Common praise                Must keep
"Heat resistant"             Maintain high heat rating
"Easy to clean"              Dishwasher-safe
\`\`\`

These insights feed directly into product design, packaging, images and bullet points.

### Questions and answers

The customer questions section shows what buyers are unsure about before purchasing: sizes, compatibility, materials. Every repeated question is something the listing should answer clearly, in bullets or images.

### Look for differentiation

A new product needs a reason to be chosen. Common differentiation strategies:

- **Fix a common complaint**: better materials, better design.
- **Bundle**: include a useful accessory competitors do not.
- **Better presentation**: clearer images, better packaging, gift-ready design.
- **Target a niche**: a version for a specific audience, such as left-handed users or small kitchens.

Avoid differentiation that adds cost without adding value customers care about.

### Review authenticity signals

Some listings have suspicious review patterns: sudden bursts of five-star reviews, generic wording, or reviews for a different product. Do not assume every high review count is organic, and never copy manipulative tactics. Focus on genuine customer feedback for your insights.

### Monitor competitors over time

Competitor analysis is not a one-time task. For existing brands, VAs often monitor main competitors monthly: price changes, new variations, new images, stock-outs and rating changes. A competitor running out of stock, for example, may be a moment to increase advertising.

### Summarise for the client

End every analysis with clear conclusions: the top three customer complaints, the features customers value most, the differentiation you recommend and the keywords competitors rely on. That summary is often more valuable to a client than all the raw data behind it.
      `,
        [
          q('Which reviews are usually richest in product improvement ideas?', [
            'Only five-star reviews',
            'Reviews without any text',
            'Three-star and lower reviews',
            'Reviews from the seller\'s friends',
          ], 2, 'Critical reviews reveal problems and unmet needs that a better product can solve.'),
          q('What do repeated customer questions on a listing indicate?', [
            'The product should be removed',
            'Information the listing should answer clearly',
            'Customers are not interested in the product',
            'The price is too low',
          ], 1, 'Recurring questions highlight gaps in the listing\'s content that bullets or images should fill.'),
          q('Why monitor competitors regularly?', [
            'Amazon requires monthly competitor reports',
            'To copy their listings word for word',
            'To report their reviews as fake',
            'Price changes, stock-outs and new variations create opportunities',
          ], 3, 'Markets change, and timely awareness of competitor moves lets a brand respond effectively.'),
        ]
      ),
      lesson('Suppliers, Samples and Profit Calculations', 13, `
Research identifies an opportunity; sourcing turns it into a product. VAs often help clients find suppliers, manage communication and calculate whether a product will actually make money. Careful sourcing prevents the two biggest disasters in private label: poor quality and unprofitable products.

### Where to find suppliers

| Source | Notes |
|---|---|
| Alibaba | Large marketplace of manufacturers and trading companies, mostly in China |
| Other B2B marketplaces and 1688 | Wider options, some with lower prices but more complexity |
| Trade shows | Meet suppliers in person, see quality directly |
| Local manufacturers | Pakistan has strong clusters: sports goods and surgical instruments in Sialkot, textiles in Faisalabad and Karachi, leather in Lahore and Kasur |
| Supplier databases | Research tools show which factories supply competitors, based on import records |

### Evaluating suppliers

Contact several suppliers and compare:

\`\`\`text
- Product quality and materials
- Price at different order quantities
- Minimum order quantity (MOQ)
- Production time
- Customisation: logo, packaging, colours
- Certifications required for the target market
- Communication speed and clarity
- Years in business, verification status, trade history
\`\`\`

A supplier who communicates clearly and honestly before the order is more likely to do so after it.

### Always order samples

Never place a production order without samples. Order samples from two or three suppliers, compare them side by side, test them as a customer would, and photograph any issues. Samples reveal problems that photos and specifications hide.

### Inspections and terms

For production orders, many sellers pay for a pre-shipment inspection by a third-party company, which checks quality before goods leave the factory. Agree payment terms carefully; a common approach is a deposit before production and the balance after inspection. Understand shipping terms (Incoterms) such as EXW, FOB and DDP, which define who pays for what and where responsibility transfers; chapter 9 covers them.

### Calculating profit per unit

A proper calculation includes every cost:

\`\`\`text
Selling price                               $24.99
Product cost (per unit)                    - 4.20
Shipping and duties to warehouse (per unit) - 1.60
Amazon referral fee (varies by category)    - 3.75
FBA fulfilment fee (depends on size/weight) - 5.10
Storage (average per unit)                  - 0.30
Advertising (average per unit)              - 3.00
Returns and damages allowance               - 0.50
Profit per unit                              $6.54
Margin                                       26%
Return on product cost ((6.54 / 5.80))      113%
\`\`\`

All figures are examples. Use Amazon's revenue calculator for current fees, and real quotes for product and shipping costs.

### Margin, ROI and cash

- **Margin** shows how much of each sale is profit.
- **ROI** compares profit to what was invested in inventory.
- **Cash flow** matters too: inventory is paid for weeks or months before it sells.

A product with a thin margin can still look good on ROI, but leaves little room if advertising costs rise or prices fall. Many sellers look for healthy margins before advertising, to allow for a competitive launch.

### Communicate carefully

When contacting suppliers for a client, follow the client's instructions on what to share. Never commit to orders or payments without written approval, and keep all communication records organised. Sourcing decisions involve the client's money, and clear documentation protects both of you.
      `,
        [
          q('Why order samples before a production order?', [
            'Suppliers refuse production orders otherwise',
            'Samples reveal quality problems photos and specifications hide',
            'Samples are always free',
            'Amazon requires sample photos',
          ], 1, 'Testing physical samples from several suppliers exposes quality issues before committing money.'),
          q('What does a pre-shipment inspection do?', [
            'Calculates Amazon\'s referral fee',
            'Designs the product packaging',
            'Books the freight forwarder',
            'Checks product quality before goods leave the factory',
          ], 3, 'Third-party inspectors verify quality before shipment, when problems can still be fixed.'),
          q('Why include advertising and returns in a profit calculation?', [
            'They are real costs that reduce profit per unit',
            'Amazon requires them in listings',
            'They increase the selling price automatically',
            'They only apply to FBM sellers',
          ], 0, 'Ignoring ad spend and returns overstates profit, leading to poor product decisions.'),
        ]
      ),
      ],
      [
      q('Which product is usually the best private label candidate?', [
        'A fragile product dominated by major brands',
        'A patented design copied from a competitor',
        'A small, light product with steady demand and fixable complaints',
        'A product that only sells during one week each year',
      ], 2, 'Steady demand, manageable competition, low fees and clear improvement opportunities make a strong candidate.'),
      q('Which tool best reveals whether demand is seasonal?', [
        'A supplier database',
        'The product\'s title',
        'Keepa\'s sales rank history over twelve months',
        'The number of images on the listing',
      ], 2, 'Long-term rank history shows whether sales are steady or concentrated in certain months.'),
      q('Competitors\' reviews repeatedly say "handle gets loose". What does this suggest?', [
        'A product improvement opportunity with a stronger handle',
        'The product category should be avoided entirely',
        'Customers do not care about handles',
        'The competitors should be reported',
      ], 0, 'Recurring complaints show where a better-designed product can win customers.'),
      q('What should a VA do before committing to a supplier order for a client?', [
        'Pay the supplier from their own account',
        'Choose the cheapest supplier without samples',
        'Place the order to save time',
        'Get the client\'s written approval',
      ], 3, 'Orders involve the client\'s money, so written approval protects both the client and the VA.'),
      ]
    ),
    chapter(
      'Listing Optimisation and Amazon SEO',
      'Research the keywords Amazon shoppers use, write titles, bullet points and descriptions that rank and convert, use backend search terms and A+ Content, and create images that follow Amazon\'s rules and sell.',
      [
      lesson('Keyword Research for Amazon', 14, `
Amazon is a search engine for products. Most shoppers type what they want into the search bar and buy from the first page of results. If a listing does not contain the words shoppers use, it will not appear for them, however good the product is. Keyword research is therefore the foundation of listing optimisation, and one of the most requested VA services.

### How Amazon search works, in practice

Amazon does not publish its ranking formula, but two broad factors are widely understood:

| Factor | Meaning |
|---|---|
| Relevance | Does the listing contain words matching the search? |
| Performance | Do shoppers click, add to cart and buy when the listing appears? |

Keywords help a listing become eligible to appear for a search. Sales and conversion then influence how high it ranks. That is why a good listing needs both the right words and persuasive content.

### Where keywords come from

- **Amazon's search bar suggestions**: type a seed keyword and note the autocomplete suggestions, which reflect real searches.
- **Competitor listings**: titles and bullets of top sellers show the language that works.
- **Research tools**: Helium 10's Magnet and Cerebro, Jungle Scout's Keyword Scout and similar tools estimate search volume and reveal competitor keywords.
- **Brand Analytics**: brand-registered sellers can see search query data from Amazon itself.
- **PPC search term reports**: once ads run, they show the exact searches customers used before buying, the most valuable data of all (chapter 8).
- **Customer reviews and questions**: the words customers use to describe the product.

### Building a keyword list

\`\`\`text
Seed:   silicone spatula

Keyword                            Est. monthly searches   Relevance
silicone spatula                   high                    core
silicone spatula set               high                    core
heat resistant spatula             medium                  core
rubber spatula for baking          medium                  strong
spatula for non stick pans         medium                  strong
kitchen utensils set               high                    partial (broader)
cake scraper                       low                     partial
\`\`\`

Estimated volumes come from tools and should be treated as approximate.

### Prioritise by relevance first

A high-volume keyword that does not describe the product exactly brings clicks without sales, which can hurt performance. Sort keywords into:

- **Core**: exactly describes the product; use in the title.
- **Strong**: closely related uses and features; use in bullets.
- **Partial**: related but broader or narrower; use in backend terms or ads, carefully.
- **Irrelevant**: remove, however high the volume.

### Long-tail keywords

Longer, more specific phrases, such as "silicone spatula set for non stick cookware", usually have lower volume but higher purchase intent and less competition. New listings often gain their first sales through long-tail keywords before ranking for the most competitive terms.

### Avoid what is not allowed

Never use competitor brand names, trademarked terms you do not own, or misleading words in listings or backend search terms. They violate Amazon policy and can lead to listing suppression or intellectual property complaints.

### Organise the output

Deliver keyword research as a clear spreadsheet: keyword, estimated volume, relevance group and where it will be used (title, bullets, backend, ads). This becomes the blueprint for writing the listing and for building PPC campaigns, and it should be updated as search term reports reveal new customer language.
      `,
        [
          q('What two broad factors influence Amazon search ranking?', [
            'Image size and listing age',
            'Relevance and performance',
            'Seller location and currency',
            'Number of variations and colours',
          ], 1, 'Listings must be relevant to the search and then perform well through clicks and sales.'),
          q('Why prioritise relevance over search volume?', [
            'Amazon hides high-volume keywords',
            'Relevant keywords are always cheaper',
            'Irrelevant traffic brings clicks without sales, which can hurt performance',
            'High-volume keywords cannot be used in titles',
          ], 2, 'Keywords that do not truly describe the product attract shoppers who do not buy, weakening conversion.'),
          q('Which keyword source shows the exact searches customers used before buying?', [
            'The product\'s variation theme',
            'The supplier\'s catalogue',
            'The Account Health page',
            'PPC search term reports',
          ], 3, 'Search term reports list the real queries that led to ad clicks and orders.'),
        ]
      ),
      lesson('Titles, Bullet Points and Descriptions', 13, `
Once keywords are chosen, they must be woven into listing copy that ranks and persuades. The title, bullet points and description each have a distinct job. A good listing reads naturally to shoppers while including the words that help Amazon match it to searches.

### The title

The title is the most important text field for search relevance and the first thing shoppers read. Amazon's title requirements have included limits of around 200 characters for most categories, restrictions on certain special characters, no promotional phrases such as "best seller" or "free shipping", and not repeating the same word more than twice. Some categories are stricter, and Amazon has encouraged shorter, clearer titles, so always check the current style guide for the category.

A common structure:

\`\`\`text
Brand + Product type + Key feature + Material/Size + Quantity/Variant

KitchenJoy Silicone Spatula Set, Heat Resistant up to 230°C,
Non-Stick Safe Kitchen Utensils for Baking and Cooking, 5 Pieces, Black
\`\`\`

Place the most important keywords early, because mobile screens show only the beginning of titles.

### Bullet points

Most categories allow five bullet points. They should answer the key questions a shopper has and highlight benefits:

| Bullet | Focus | Example start |
|---|---|---|
| 1 | Main benefit or differentiator | HEAT RESISTANT AND SAFE: ... |
| 2 | Material and quality | FOOD-GRADE SILICONE: ... |
| 3 | Use and compatibility | SAFE FOR NON-STICK PANS: ... |
| 4 | Ease of cleaning or care | DISHWASHER SAFE: ... |
| 5 | What is included, reassurance | COMPLETE 5-PIECE SET: ... |

A short capitalised label at the start of each bullet helps skimming, a widely used convention. Write in clear, simple English, include strong keywords naturally, and address concerns found in competitor reviews from chapter 6.

### Writing benefits, not only features

\`\`\`text
Feature only:   Made of silicone rated to 230°C.
Feature + benefit: Made of silicone rated to 230°C, so you can stir
                   sizzling sauces without melting or warping.
\`\`\`

### The description

The product description gives more room for details and brand story. For brands with A+ Content, the A+ modules typically appear in place of the plain description on the product page. For listings without A+, write a clear, well-structured description covering use cases, specifications and care.

### Rules for all copy

- Be accurate: every claim must be true and provable.
- No prohibited claims, such as unapproved medical or pesticide claims, and no competitor comparisons by name.
- No contact details, website links or promotions like "buy now and get 10% off".
- No keyword stuffing: repeated keywords make copy unreadable and can break style rules.

### Localisation

Clients selling in the UK use British spelling (colour, aluminium), while US listings use American spelling (color, aluminum). Units matter too: inches and ounces for the US, centimetres and grams for the UK and Europe. Small mistakes like "colour" on a US listing look unprofessional and may miss searches.

### Review and test

Read the finished listing on a phone, as most shoppers will. Is the title clear in the first few words? Can a shopper understand the product from the bullets alone? Then watch conversion rate in Business Reports after changes, and make one significant change at a time so you can see what worked.
      `,
        [
          q('Why place the most important keywords early in a title?', [
            'Mobile screens show only the beginning of titles',
            'Amazon ignores the second half of every title',
            'Early keywords reduce referral fees',
            'It makes the title longer',
          ], 0, 'Shoppers and search results on phones see the start of titles first, so key terms belong there.'),
          q('Which phrase does not belong in an Amazon title?', [
            'Heat Resistant',
            '5 Pieces',
            'Silicone Spatula Set',
            'Best Seller, Free Shipping',
          ], 3, 'Promotional phrases are prohibited in titles under Amazon\'s style rules.'),
          q('A UK client\'s listing uses "color" and "inches". What should change?', [
            'Nothing, US spelling is standard everywhere',
            'Remove all measurements',
            'Use British spelling and metric units',
            'Translate the listing into French',
          ], 2, 'Listings should match the marketplace\'s spelling and units to look professional and match searches.'),
        ]
      ),
      lesson('Backend Search Terms and A+ Content', 13, `
Two more tools help listings rank and convert: backend search terms, hidden keywords only Amazon sees, and A+ Content, rich visual content for brand-registered sellers. Used correctly, both give a listing an edge; used carelessly, backend terms can be wasted and A+ Content can confuse shoppers.

### Backend search terms

In the listing's Keywords section, sellers can add generic search terms that do not appear to shoppers but help Amazon match the product to searches. Amazon's guidelines have included:

| Guideline | Why |
|---|---|
| Stay under the byte limit, currently less than 250 bytes | Terms beyond the limit may be ignored entirely |
| Do not repeat words already in the title or bullets | Repetition wastes space |
| Separate words with spaces; punctuation is unnecessary | Amazon combines words into phrases |
| No brand names, ASINs or competitor names | Prohibited and risky |
| No temporary or subjective terms like "new", "sale", "amazing" | Not allowed or not useful |
| Include synonyms, spelling variants and other languages where relevant | Captures more searches |

Characters such as accented letters can use more than one byte, so the limit is in bytes, not simply characters.

### Example

\`\`\`text
Title and bullets already include: silicone, spatula, set, heat,
resistant, baking, cooking, non-stick, dishwasher

Backend search terms:
scraper turner flipper spoonula utensils cookware bakeware jar
mixing frosting pastry nonstick heatproof bpa free
\`\`\`

Every word is new, relevant and useful. Amazon matches combinations of words across title, bullets and backend terms, so each word needs to appear only once.

### A+ Content

A+ Content lets brand-registered sellers replace the plain description with modules of images, comparison charts and formatted text. Premium A+ Content, with larger and interactive modules, has additional eligibility requirements.

A+ Content mainly improves conversion: shoppers understand the product and brand better and buy with more confidence. Common modules:

| Module | Use |
|---|---|
| Brand story | Who the brand is and why it exists |
| Feature images with text | Explain key benefits visually |
| Comparison chart | Compare the product with other products in the same brand |
| Lifestyle images | Show the product in real use |
| Technical specifications | Dimensions, materials, care |

### A+ design principles

- Design mobile-first; many modules shrink on phones, making small text unreadable.
- Use images to explain, not just decorate: before-and-after, how-to steps, size comparisons.
- Keep brand fonts and colours consistent with the listing images.
- Use a comparison chart to guide shoppers to the right variant and to sell other products in the brand.
- Add alt text to images as prompted.

Because A+ text may not contribute to search in the same way as the title, bullets and backend terms, keep important keywords in those fields rather than relying on A+ for ranking.

### Approval process

A+ Content is submitted for review and can be rejected for issues such as prohibited claims, pricing or promotional language, references to competitors, or poor image quality. Read the rejection reason carefully, correct the specific issue and resubmit.

### Measuring impact

After A+ Content goes live, compare conversion rate in Business Reports for the weeks before and after. Some brands test different A+ versions using Amazon's experiment tools where available, which is the most reliable way to see what works.
      `,
        [
          q('What is the backend search terms limit based on?', [
            'The number of words',
            'Bytes, currently less than 250',
            'The number of sentences',
            'The number of bullet points',
          ], 1, 'The limit is measured in bytes, and terms beyond it may be ignored.'),
          q('Why avoid repeating title words in backend search terms?', [
            'Repetition wastes limited space without adding reach',
            'Amazon suspends listings with any repeated word',
            'Backend terms are shown to customers',
            'Titles are ignored when backend terms exist',
          ], 0, 'Amazon already indexes title words, so backend space is better used for new relevant terms.'),
          q('What is the main purpose of A+ Content?', [
            'Replacing the product title',
            'Adding hidden keywords',
            'Changing the product\'s price',
            'Improving conversion with rich visual content',
          ], 3, 'A+ Content helps shoppers understand the product and brand, increasing their confidence to buy.'),
        ]
      ),
      lesson('Product Images and Image Rules', 13, `
Shoppers look at images before reading anything. On Amazon, where many listings look similar in search results, images often decide whether a shopper clicks and whether they buy. Amazon also has strict rules, especially for the main image, and non-compliant images can suppress a listing.

### Main image requirements

Amazon's main image rules have included:

| Rule | Detail |
|---|---|
| Background | Pure white (RGB 255, 255, 255) |
| Content | Only the product being sold, without extra props or accessories not included |
| Size in frame | The product filling most of the image, around 85% |
| No additions | No text, logos, watermarks, badges or borders |
| Quality | Professional photograph or accurate render, in focus, true colour |
| Resolution | At least 1,000 pixels on the longest side to enable zoom |

Some categories have extra rules, such as clothing shown on a model or flat, so check the category style guide.

### Secondary images

Secondary images have more freedom and should answer every question a shopper might ask. A proven set for most products:

\`\`\`text
1. Main image: product on white
2. Key benefit infographic: 3 to 4 main features with icons and short text
3. Size or dimensions: the product with measurements or in a hand
4. Lifestyle: the product in real use
5. Details and materials: close-ups of quality
6. What is included: all pieces laid out clearly
7. Comparison or problem-solution: why this product is better
8. Care, instructions or certifications
\`\`\`

A product video, uploaded where available, adds further conversion power.

### Design for mobile

Most Amazon shoppers browse on phones, where images appear small. Infographic text must be large and minimal: a few words per feature, bold fonts, strong contrast. Test by viewing images on a phone before uploading.

### Answer review complaints visually

If competitor reviews reveal that customers worry about size, show a size comparison. If they worry about durability, show a strength test. Images that address known concerns reduce hesitation and returns.

### Technical preparation

- Use JPEG or other supported formats, in sRGB colour.
- Export large, sharp images; higher resolution improves zoom.
- Name files using the product's SKU or ASIN and an order number if uploading in bulk, following Amazon's image naming rules for bulk uploads.
- Keep original high-resolution files and design source files in the client's shared folder.

### Working with designers and photographers

VAs often manage product photography and graphic design rather than doing it themselves. Provide the photographer or designer with a clear brief: required shots, main image rules, key features for infographics, brand colours and fonts, and reference examples. A good brief is the difference between a set of images that sells and one that must be redone.

### Watch for suppressed listings

If the main image breaks the rules, Amazon may suppress the listing, removing it from search. Check the inventory page for suppressed or inactive listings and Amazon's reasons. Fixing image compliance issues quickly restores visibility and sales.
      `,
        [
          q('What background must an Amazon main image use?', [
            'A lifestyle scene',
            'The brand\'s colour',
            'A light grey gradient',
            'Pure white, RGB 255, 255, 255',
          ], 3, 'Amazon requires main images on a pure white background, showing only the product.'),
          q('Why keep infographic text large and minimal?', [
            'Amazon charges per word in images',
            'Most shoppers view images on small phone screens',
            'Large text improves search ranking directly',
            'Small text is prohibited in all images',
          ], 1, 'Images appear small on phones, so short, bold text stays readable.'),
          q('What can happen if the main image breaks Amazon\'s rules?', [
            'The price is lowered automatically',
            'Amazon redesigns the image for free',
            'Nothing, image rules are optional',
            'The listing may be suppressed from search',
          ], 3, 'Non-compliant main images can suppress listings, removing them from search until fixed.'),
        ]
      ),
      ],
      [
      q('Which keywords should go in the title?', [
        'Competitor brand names with high volume',
        'Every keyword found, repeated for emphasis',
        'Core keywords that exactly describe the product',
        'Broad terms unrelated to the product',
      ], 2, 'The title carries the most relevant, core terms, placed early and read naturally.'),
      q('What should bullet points mainly do?', [
        'Answer shopper questions and highlight benefits',
        'List every keyword separated by commas',
        'Include the seller\'s phone number',
        'Mention competitor products by name',
      ], 0, 'Bullets persuade shoppers by addressing their questions and showing benefits clearly.'),
      q('Which belongs in backend search terms?', [
        'A competitor\'s brand name',
        'The word "sale"',
        'The same words already in the title',
        'Relevant synonyms and spelling variants',
      ], 3, 'Backend terms add new relevant words, such as synonyms, without brand names or repetition.'),
      q('A shopper worries about size in reviews. How can images help?', [
        'Remove all size information',
        'Use a smaller main image',
        'Add an image showing the product\'s size in context',
        'Add more text to the main image',
      ], 2, 'Visual size references address the concern directly, reducing hesitation and returns.'),
      ]
    ),
    chapter(
      'Amazon PPC Advertising',
      'Understand how Sponsored Products ads and auctions work, structure automatic and manual campaigns, read ACoS, ROAS and TACoS correctly, and optimise with bids, keyword harvesting and negative keywords.',
      [
      lesson('How Sponsored Products Work', 13, `
Amazon advertising, usually called PPC for pay-per-click, is one of the most valuable skills an Amazon VA can offer. On competitive searches, sponsored results fill much of the first page, and new products often depend on ads to gain their first sales. Managing ads well can make a product profitable; managing them badly can drain a client's money fast.

### Amazon's main ad types

| Ad type | Where it appears | Requirement |
|---|---|---|
| Sponsored Products | In search results and on product pages, looking like normal listings | Professional selling account |
| Sponsored Brands | Banners with logo, headline and several products, often at the top of search | Brand Registry |
| Sponsored Display | On and off Amazon, targeting audiences and product pages | Brand Registry in most cases |

Sponsored Products usually drives most sales for sellers and is where VAs start. This chapter focuses on it.

### The auction

When a shopper searches, Amazon runs an auction among advertisers targeting that search. Each advertiser sets a maximum bid, the most they will pay per click. Amazon considers bids and the ad's relevance to decide which ads appear and where. When a shopper clicks, the advertiser pays, typically no more than their bid, and often less.

\`\`\`text
Shopper searches: "silicone spatula set"
Advertisers bidding on this search:
  Brand A   max bid $1.20
  Brand B   max bid $0.95   (your client)
  Brand C   max bid $0.80
Relevance and bid decide placement; you pay only when clicked.
\`\`\`

### Placements

Sponsored Products ads can appear in different places:

- **Top of search**: the first row of results, usually the most valuable placement.
- **Rest of search**: lower positions and later pages.
- **Product pages**: on competitors' and related product detail pages.

Campaign settings allow bid adjustments by placement, for example bidding higher for top of search when it converts best.

### Bidding strategies

Each campaign has a bidding strategy:

| Strategy | What Amazon does |
|---|---|
| Dynamic bids, down only | Lowers bids when a click seems less likely to convert |
| Dynamic bids, up and down | Raises or lowers bids based on likelihood of conversion |
| Fixed bids | Uses your exact bid |

Dynamic down only is a common, cautious starting point.

### Budgets

Each campaign has a daily budget. Amazon may spend somewhat more on a single day but aims to keep the month's total around the daily budget multiplied by days. When a campaign runs out of budget early in the day, it stops showing, missing sales. VAs monitor budget usage and recommend adjustments.

### How ads and organic ranking connect

Sales generated by ads count as sales for the product, which can help organic ranking for the keywords involved. That is why brands often advertise heavily during a launch. Over time, the goal is usually for organic sales to grow so the business depends less on advertising.

### Responsibility with money

PPC spends the client's money daily. Before changing budgets or bids significantly, agree limits with the client: a maximum daily spend, a target profitability and how often you will report. Small, deliberate changes with regular reporting build confidence; sudden large changes without explanation damage trust, even if they work.
      `,
        [
          q('When does an advertiser pay for a Sponsored Products ad?', [
            'Whenever the ad is displayed',
            'When a shopper clicks the ad',
            'Only when the product is returned',
            'Once a month regardless of results',
          ], 1, 'Pay-per-click advertising charges when a shopper clicks, not when the ad is shown.'),
          q('What happens when a campaign runs out of budget early in the day?', [
            'Amazon doubles the budget automatically',
            'The campaign is deleted',
            'The ads stop showing, missing potential sales',
            'Clicks become free for the rest of the day',
          ], 2, 'Once the daily budget is spent, ads stop appearing until the next day.'),
          q('Why agree spending limits with the client before optimising PPC?', [
            'Amazon requires written client approval',
            'It removes the need for reports',
            'Limits make clicks cheaper',
            'PPC spends the client\'s money daily and needs agreed boundaries',
          ], 3, 'Clear limits and targets protect the client\'s budget and build trust in the VA\'s management.'),
        ]
      ),
      lesson('Campaign Structure: Automatic and Manual', 13, `
A well-organised campaign structure makes advertising easier to control and understand. A messy one, with every keyword and product mixed together, hides what is working and wastes money. Most successful Amazon advertisers use a combination of automatic and manual campaigns.

### Automatic campaigns

In an automatic campaign, Amazon chooses which searches and products to show the ad for, based on the listing's content. Automatic campaigns have four targeting groups, each with its own bid:

| Targeting group | Shows ads for |
|---|---|
| Close match | Searches closely related to the product |
| Loose match | Searches loosely related to the product |
| Substitutes | Product pages of similar alternatives |
| Complements | Product pages of complementary products |

Automatic campaigns are excellent for discovery: they reveal search terms and products you may not have thought of.

### Manual campaigns

In manual campaigns, you choose the targets:

- **Keyword targeting**: choose keywords and match types.
- **Product targeting**: choose specific ASINs or categories to show ads on.

Keyword match types control how closely a search must match:

\`\`\`text
Keyword: silicone spatula

Broad:   may show for "spatula made of silicone for baking",
         "silicone kitchen utensils"
Phrase:  shows for searches containing the phrase,
         e.g. "red silicone spatula set"
Exact:   shows for "silicone spatula" and very close variants
         such as plurals
\`\`\`

Broad reaches more searches with less control; exact gives the most control with narrower reach.

### A simple, proven structure

Many advertisers use a structure like this for each product:

\`\`\`text
Campaign 1: Auto          discovery of search terms and products
Campaign 2: Manual Broad  research on a few core keywords
Campaign 3: Manual Exact  proven converting keywords, higher bids
Campaign 4: Product       competitor ASINs and categories
\`\`\`

Search terms that convert in the auto or broad campaigns are moved into the exact campaign, where they can be bid on precisely. This process is called keyword harvesting.

### Harvesting and cross-negating

When you move a winning search term into the exact campaign, add it as a negative exact keyword in the campaign it came from. This prevents two of your campaigns competing for the same search and makes performance data clean:

| Step | Action |
|---|---|
| 1 | Search term "spatula for non stick pan" converts well in Auto |
| 2 | Add it as an exact keyword in Campaign 3 |
| 3 | Add it as a negative exact keyword in Auto |
| 4 | Monitor its performance in Campaign 3 |

### Naming conventions

Clear campaign names make management and reporting far easier:

\`\`\`text
SP | Spatula Set | Auto
SP | Spatula Set | Exact | Core
SP | Spatula Set | Product | Competitors
\`\`\`

Include the ad type, product and targeting type. When a client has dozens of products, consistent names are essential.

### One product per ad group

Keep closely related products together and avoid mixing different products in one ad group. When different products share an ad group, it becomes hard to see which one drives results, and bids cannot reflect each product's different profitability.

### Launch settings

For a new product, start with an auto campaign and a small set of manual keywords, with moderate bids and budgets. Let campaigns gather data for at least a week or two before making major judgements, since a few days of data can be misleading.
      `,
        [
          q('What is the main purpose of an automatic campaign?', [
            'Discovering new search terms and products',
            'Bidding precisely on proven keywords',
            'Targeting only competitor brands',
            'Avoiding all advertising costs',
          ], 0, 'Automatic campaigns let Amazon find relevant searches, revealing terms to use in manual campaigns.'),
          q('What does the exact match type do?', [
            'Shows ads for any loosely related search',
            'Shows ads for searches containing the phrase anywhere',
            'Shows ads only on competitor product pages',
            'Shows ads for the exact keyword and very close variants',
          ], 3, 'Exact match gives the tightest control, matching the keyword and close variants like plurals.'),
          q('After moving a converting search term into an exact campaign, what should you do in the source campaign?', [
            'Increase its bid there too',
            'Delete the whole source campaign',
            'Add it as a negative exact keyword',
            'Change the campaign\'s name',
          ], 2, 'Negating it in the source campaign stops your own campaigns competing and keeps data clean.'),
        ]
      ),
      lesson('ACoS, TACoS and Reading Reports', 14, `
Advertising data can look overwhelming: impressions, clicks, spend, sales and a series of ratios. A few key metrics, understood properly, tell you almost everything about whether campaigns are working. Reading them correctly is what separates a PPC manager from someone who just adjusts bids randomly.

### Core metrics

| Metric | Formula | What it tells you |
|---|---|---|
| Impressions | Times the ad was shown | Visibility |
| Clicks | Times the ad was clicked | Interest |
| CTR (click-through rate) | Clicks divided by impressions | How appealing the ad and main image are |
| CPC (cost per click) | Spend divided by clicks | What each visitor costs |
| Conversion rate | Orders divided by clicks | How well the listing turns visitors into buyers |
| Ad sales | Sales attributed to ads | Revenue from advertising |
| ACoS | Ad spend divided by ad sales | Share of ad sales spent on ads |
| ROAS | Ad sales divided by ad spend | Revenue per unit spent; the inverse of ACoS |

### ACoS in practice

If a campaign spends $30 and generates $120 in sales:

\`\`\`text
ACoS = 30 / 120 = 25%
ROAS = 120 / 30 = 4.0
\`\`\`

A 25% ACoS means a quarter of the ad-generated revenue went to advertising.

### Break-even ACoS

Whether 25% is good depends on the product's margin. Break-even ACoS equals the profit margin before advertising:

\`\`\`text
Selling price                        $25.00
All costs except advertising       - $15.00
Profit before ads                    $10.00
Break-even ACoS = 10 / 25 = 40%
\`\`\`

Below 40%, ad sales are profitable; above it, each ad sale loses money. Many brands accept a higher ACoS during a launch to build sales and ranking, then aim lower once established. Agree the target with the client.

### TACoS: the bigger picture

TACoS, total advertising cost of sale, compares ad spend with all sales, including organic:

\`\`\`text
Ad spend       $1,000
Total sales    $8,000 (ads + organic)
TACoS = 1,000 / 8,000 = 12.5%
\`\`\`

ACoS measures ad efficiency; TACoS measures how dependent the business is on advertising. If TACoS falls over time while total sales grow, ads are helping build organic sales, a healthy sign.

### Diagnosing with metrics

| Pattern | Likely issue |
|---|---|
| Low impressions | Bids too low, targets too narrow or poor relevance |
| Many impressions, low CTR | Weak main image, title, price or reviews compared with competitors |
| Many clicks, low conversion | Listing content, price, reviews or irrelevant search terms |
| Good conversion, high ACoS | Bids or CPC too high for the margin |

### Reports to use

Campaign Manager provides downloadable reports. The most useful for VAs:

- **Search term report**: the actual searches that triggered ads, with clicks, spend and orders. The foundation of optimisation.
- **Targeting report**: performance by keyword or product target.
- **Placement report**: performance at top of search, rest of search and product pages.
- **Advertised product report**: performance by ASIN.

### Attribution delay

Amazon attributes sales to ad clicks within a set window of days, so recent days' sales figures can still increase. Avoid judging the last two or three days harshly; base decisions on complete periods, such as the previous 14 or 30 days.

### Report clearly to clients

Clients want to know: How much did we spend? What did we earn? Is it profitable? What changed and why? A weekly summary with spend, ad sales, ACoS, TACoS, total sales and key actions is far more useful than raw exports.
      `,
        [
          q('A campaign spends $50 and generates $200 in ad sales. What is the ACoS?', [
            '4%',
            '40%',
            '400%',
            '25%',
          ], 3, 'ACoS equals ad spend divided by ad sales: 50 divided by 200 is 25%.'),
          q('What does break-even ACoS equal?', [
            'The profit margin before advertising',
            'The average ACoS of competitors',
            'The product\'s conversion rate',
            'The daily budget divided by clicks',
          ], 0, 'At an ACoS equal to the pre-ad margin, advertising profit is zero; below it, ad sales are profitable.'),
          q('A listing gets many clicks but few orders. What is the likely issue?', [
            'Bids are too low to show ads',
            'The budget is too high',
            'The campaign has too few impressions',
            'Listing content, price, reviews or irrelevant search terms',
          ], 3, 'Clicks without orders point to problems converting visitors, on the listing or from poor-fit searches.'),
        ]
      ),
      lesson('Bids, Negative Keywords and Optimisation', 12, `
Optimisation is the ongoing work of PPC management: raising bids on what works, lowering bids on what does not, and blocking searches that waste money. Done consistently, it steadily improves profitability. Done randomly, it creates chaos.

### A regular optimisation routine

\`\`\`text
Weekly (or twice weekly for large accounts)
1. Download the search term report for the last 14 to 30 days.
2. Harvest converting search terms into exact campaigns.
3. Add negative keywords for irrelevant or wasteful searches.
4. Adjust bids on keywords based on ACoS versus target.
5. Check budgets: campaigns running out early?
6. Review placements and adjust top-of-search bids if justified.
7. Record changes in a change log.
\`\`\`

### Negative keywords

Negative keywords stop ads showing for searches that waste money. Two types:

| Type | Blocks |
|---|---|
| Negative exact | Only that exact search |
| Negative phrase | Any search containing the phrase |

Examples for a silicone spatula set:

\`\`\`text
Negative phrase: "wooden"      (shoppers want wooden spatulas)
Negative phrase: "metal"
Negative exact:  "spatula"     (too broad, rarely converts, expensive)
Negative phrase: "replacement handle"
\`\`\`

Negate searches that are clearly irrelevant immediately. For relevant searches with poor results, wait for enough data, such as a meaningful number of clicks without orders, before negating. Negative product targeting blocks ads from appearing on specific ASINs that perform poorly.

### Bid adjustments based on data

A simple rule-based approach:

| Situation (enough clicks) | Action |
|---|---|
| ACoS well below target, good sales | Increase bid moderately to gain more traffic |
| ACoS near target | Keep bid, monitor |
| ACoS above target | Lower bid gradually |
| Many clicks, no orders | Lower bid significantly or pause, check relevance |
| Few impressions on a strong keyword | Increase bid to test visibility |

Change bids in small steps, such as 10 to 20%, and wait for new data before changing again. Large, frequent changes make it impossible to tell what worked.

### Enough data

Decisions based on three clicks are guesses. Set minimum thresholds, for example at least 10 to 20 clicks before judging a keyword, adjusted for the product's conversion rate and price. Higher-priced products naturally need more clicks per sale.

### Look beyond ads

Many PPC problems are listing problems. If CTR is low across campaigns, the main image, price or review rating may be weaker than competitors'. If conversion is low, the listing content or price may need work. A skilled PPC VA tells the client when the listing, not the bids, is the real issue.

### Keep a change log

| Date | Campaign | Change | Reason |
|---|---|---|---|
| 12 Mar | Exact Core | Bid +15% on "silicone spatula set" | ACoS 18% vs target 30% |
| 12 Mar | Auto | Negative phrase "wooden" | 25 clicks, 0 orders, irrelevant |

A change log explains results later, helps reports, and allows reversing mistakes. It also shows clients the careful work behind the numbers.

### Automation tools

Amazon offers rule-based bidding options, and third-party PPC tools automate bid changes and harvesting. They save time on large accounts, but they follow rules, not judgement. Review their actions regularly and understand the rules they apply before trusting them with a client's budget.
      `,
        [
          q('What does a negative phrase keyword do?', [
            'Increases bids for that phrase',
            'Blocks only that exact search',
            'Blocks any search containing the phrase',
            'Adds the phrase to backend search terms',
          ], 2, 'Negative phrase stops ads for all searches including the phrase, filtering irrelevant traffic.'),
          q('Why change bids in small steps and wait for data?', [
            'So you can tell which changes worked',
            'Amazon rejects large bid changes',
            'Small changes are free',
            'Bids can only change once a month',
          ], 0, 'Gradual adjustments with time to observe results make cause and effect clear.'),
          q('CTR is low across all campaigns. What should the VA investigate?', [
            'Only the daily budget',
            'The campaign names',
            'The number of negative keywords',
            'The main image, price and reviews compared with competitors',
          ], 3, 'Low click-through usually reflects how the listing looks in results, not just bid levels.'),
        ]
      ),
      ],
      [
      q('Which ad type usually drives most advertising sales for Amazon sellers?', [
        'Sponsored Display',
        'Sponsored Brands video',
        'Sponsored Products',
        'Off-Amazon banner ads',
      ], 2, 'Sponsored Products appears within search results and product pages and drives most ad sales.'),
      q('What is keyword harvesting?', [
        'Deleting all keywords from campaigns',
        'Moving converting search terms into exact campaigns',
        'Copying competitors\' keywords into titles',
        'Buying keywords from a tool provider',
      ], 1, 'Harvesting takes proven search terms from discovery campaigns into precise, controllable exact campaigns.'),
      q('Ad spend is $1,000 and total sales are $10,000. What is TACoS?', [
        '1%',
        '100%',
        '1,000%',
        '10%',
      ], 3, 'TACoS is ad spend divided by total sales: 1,000 divided by 10,000 is 10%.'),
      q('Why avoid judging the last two or three days of PPC data?', [
        'Sales can still be attributed to recent clicks',
        'Amazon deletes recent data',
        'Recent days never have any clicks',
        'Reports only show data older than a month',
      ], 0, 'Attribution windows mean recent sales figures can still rise, so complete periods give fairer judgements.'),
      ]
    ),
    chapter(
      'Inventory, Fulfilment and Logistics',
      'Plan stock so products never run out or pile up, prepare and send shipments to FBA correctly, manage returns, removals and stranded inventory, and coordinate freight, customs and suppliers.',
      [
      lesson('Inventory Planning and Restocking', 13, `
Running out of stock is one of the most expensive mistakes on Amazon. Sales stop, advertising momentum is lost, and organic ranking can drop, taking weeks to recover. Holding too much stock is expensive too, with storage fees and cash tied up in boxes. Inventory planning is about finding the balance, and it is a core responsibility for many VAs.

### The key numbers

| Term | Meaning |
|---|---|
| Daily sales velocity | Average units sold per day, based on recent weeks |
| Lead time | Total days from placing a supplier order to stock being available to sell |
| Safety stock | Extra units kept as a buffer for delays or sales spikes |
| Reorder point | The stock level at which a new order must be placed |
| Days of cover | How many days current stock will last at current sales |

### Calculating the reorder point

\`\`\`text
Daily sales velocity      10 units per day
Lead time                 60 days
  (production 30 + sea freight 20 + customs and delivery 5 +
   Amazon receiving 5)
Safety stock              14 days x 10 units = 140 units

Reorder point = (10 x 60) + 140 = 740 units
\`\`\`

When available plus inbound stock falls to about 740 units, it is time to reorder. Waiting longer risks a stock-out before the new shipment arrives.

### Lead time is often underestimated

New sellers count only production and shipping time. Real lead time also includes:

- Time to confirm the order and pay the deposit.
- Pre-shipment inspection.
- Booking freight and waiting for a vessel or flight.
- Customs clearance.
- Delivery from the port to Amazon.
- Amazon's receiving time, which can vary, especially before busy seasons.

Adding these realistically prevents most stock-outs.

### Seasonality and events

Sales are rarely flat. Plan for:

- Seasonal demand, such as kitchen products before the holiday season or summer products in spring.
- Events like Prime Day and Black Friday, when sales can multiply.
- Advertising pushes and promotions planned by the client.
- Amazon's inbound deadlines before peak season, which require shipments to arrive earlier.

Adjust velocity for expected changes rather than using only the last month's average.

### Amazon's tools and limits

Seller Central provides restock recommendations and inventory reports showing available, inbound, reserved and unfulfillable units. Amazon also applies FBA capacity limits, which cap how much inventory each seller can store or send, based partly on how efficiently their inventory sells. Check the capacity page before planning large shipments, because a shipment that exceeds capacity cannot be created.

### Avoiding overstock

Excess inventory costs money through storage fees and, for stock stored too long, additional surcharges. It also ties up cash the business could use elsewhere. Signs of overstock include days of cover far beyond the lead time plus safety stock, and products with falling sales. Solutions include pausing reorders, promotions, reducing prices or removing stock to a cheaper warehouse.

### A simple inventory tracker

Many VAs maintain a weekly spreadsheet:

| SKU | Available | Inbound | Daily velocity | Days of cover | Reorder point | Action |
|---|---|---|---|---|---|---|
| SP-SET-BLK | 820 | 0 | 10 | 82 | 740 | Monitor |
| SP-SET-RED | 350 | 500 | 6 | 142 | 444 | OK |
| SP-SET-5PC | 210 | 0 | 8 | 26 | 592 | Reorder now |

Sharing this tracker weekly with the client turns inventory from a source of anxiety into a controlled process.
      `,
        [
          q('Daily sales are 5 units, lead time is 40 days and safety stock is 70 units. What is the reorder point?', [
            '45 units',
            '200 units',
            '270 units',
            '2,800 units',
          ], 2, 'Reorder point equals daily sales times lead time plus safety stock: 5 times 40 plus 70 is 270.'),
          q('Why is lead time often underestimated?', [
            'Sellers forget steps like inspection, customs and Amazon receiving',
            'Suppliers always deliver early',
            'Amazon receives shipments instantly',
            'Lead time only includes production',
          ], 0, 'Real lead time includes many steps beyond production and shipping, each adding days.'),
          q('Why check FBA capacity before planning a large shipment?', [
            'Capacity decides the product\'s price',
            'It changes the product\'s ASIN',
            'Capacity limits only apply to FBM',
            'Shipments exceeding capacity cannot be created',
          ], 3, 'Amazon caps inventory each seller can send and store, so large shipments must fit within capacity.'),
        ]
      ),
      lesson('Sending Shipments to FBA', 14, `
Getting inventory into Amazon's warehouses correctly is a detailed process with strict rules. Mistakes in labelling, packing or box information can delay receiving, cause fees, or leave units unsellable. VAs who manage shipments carefully save clients money and frustration.

### The shipment workflow

Amazon's Send to Amazon workflow in Seller Central guides the process. The main steps are:

\`\`\`text
1. Choose the SKUs and quantities to send.
2. Enter packing details: individual units or case-packed boxes,
   box dimensions and weights.
3. Confirm prep and labelling requirements for each SKU.
4. Choose placement: which fulfilment centres receive the boxes.
5. Choose shipping mode and carrier: small parcel or pallets (LTL/FTL).
6. Print box labels and, if needed, pallet labels.
7. Confirm shipping and enter tracking details.
8. Monitor receiving and reconcile any discrepancies.
\`\`\`

The exact screens and options change over time, so follow the current workflow and Amazon's help pages.

### Labels

Every unit sent to FBA must be identifiable:

| Label | Purpose |
|---|---|
| FNSKU label | Identifies each unit as belonging to your client's offer |
| Manufacturer barcode | Some eligible products can use the existing barcode instead of an FNSKU label |
| Box ID label | Identifies each box and links it to the shipment |
| Pallet labels | Required for pallet shipments |

Many sellers ask their supplier to apply FNSKU labels during production, which saves time and cost. Provide the supplier with the exact label files and placement instructions, and ask for photos to confirm before shipping.

### Prep requirements

Some products need preparation before Amazon accepts them, such as poly bags for loose fabric items, bubble wrap for fragile items, or suffocation warning labels on poly bags above a certain size. Liquids, sharp items and sets have specific rules. Seller Central shows prep guidance per SKU; follow it exactly, or Amazon may prep the items for a fee or reject them.

### Box and packing rules

Amazon sets limits on box weight and dimensions, and requires boxes to be sturdy. Box content information must be accurate: which SKUs and quantities are in each box. Inaccurate information causes receiving delays and can lead to extra fees or problems with future shipments.

### Placement options and fees

Amazon may split a shipment across several fulfilment centres. Sellers can often choose between options, such as letting Amazon split the shipment across multiple locations, or sending to fewer locations for a placement fee. Compare the total cost, including freight to each location, before choosing.

### Tracking receiving

After delivery, Amazon receives and checks in the units, which can take days or longer in busy periods. Monitor the shipment's status:

- **Delivered**: the carrier has delivered it.
- **Checked in**: Amazon has started processing it.
- **Receiving**: units are being counted and made available.
- **Closed**: receiving is complete.

### Reconciliation

Compare units sent with units received. If Amazon received fewer than sent, and the shipment was packed and labelled correctly, the seller can request an investigation through the shipment's reconciliation tools within Amazon's time limits. Keep packing lists, photos of boxes and proof of delivery for every shipment; they are the evidence needed for a successful claim.

### A pre-shipment checklist

\`\`\`text
[ ] Quantities match the shipment plan
[ ] FNSKU labels correct, scannable, covering old barcodes
[ ] Prep requirements completed
[ ] Box weights and dimensions within limits
[ ] Box contents recorded accurately
[ ] Box and pallet labels attached correctly
[ ] Photos taken of labelled units and boxes
[ ] Carrier booked and tracking entered
\`\`\`
      `,
        [
          q('What does an FNSKU label do?', [
            'Shows the product\'s retail price',
            'Identifies the shipping carrier',
            'Identifies each unit as belonging to the seller\'s offer',
            'Replaces the product\'s main image',
          ], 2, 'FNSKU labels let Amazon track which seller owns each unit in its warehouses.'),
          q('Why keep packing lists, box photos and proof of delivery?', [
            'Amazon requires them for every listing',
            'They are evidence if units are missing at receiving',
            'They reduce storage fees',
            'They replace box content information',
          ], 1, 'Documentation supports reconciliation claims when Amazon receives fewer units than were sent.'),
          q('What can happen if prep requirements are not followed?', [
            'Amazon lowers the product\'s price',
            'The listing gains more reviews',
            'Nothing, prep is optional',
            'Amazon may prep items for a fee or reject them',
          ], 3, 'Items not prepared correctly can incur prep fees or be refused at the fulfilment centre.'),
        ]
      ),
      lesson('Returns, Removals and Stranded Inventory', 13, `
Inventory does not only flow in; it also comes back as returns, gets stuck when listings have problems, and sometimes needs to be removed. Managing these flows prevents money being lost quietly in fees and forgotten stock.

### FBA customer returns

For FBA orders, Amazon handles customer returns. Returned units are inspected and given a disposition:

| Disposition | Meaning | Typical next step |
|---|---|---|
| Sellable | Returned in good condition | Returned to available stock |
| Customer damaged | Damaged by the customer | Unfulfillable; remove or dispose |
| Defective | Product fault | Unfulfillable; investigate quality |
| Carrier or warehouse damaged | Damaged in transit or storage | May be eligible for reimbursement |

The FBA customer returns report shows each return with its reason and disposition. Reviewing it monthly reveals patterns, such as "too small" or "arrived broken", which can point to listing, sizing or packaging problems.

### Return rates matter

High return rates hurt profit and can trigger Amazon warnings about product quality or listing accuracy. Common fixes:

\`\`\`text
Return reason            Possible fix
"Too small"              Clearer size information and images
"Not as described"       Correct inaccurate listing details
"Defective"              Supplier quality check, inspection
"Damaged in transit"     Stronger packaging
"No longer needed"       Usually normal; monitor the rate
\`\`\`

### Unfulfillable inventory and removals

Units that cannot be sold sit in Amazon's warehouses as unfulfillable, still costing storage fees. Create a removal order to:

- **Return** units to the seller's address or a warehouse for inspection, repackaging or sale elsewhere.
- **Dispose** of units that are not worth returning.

Removal fees apply per unit. Amazon may also have automatic removal settings; check them with the client so units are handled the way they prefer.

### Stranded inventory

Stranded inventory is stock sitting in FBA without an active, buyable listing, often because the listing was suppressed, closed, or has a pricing or compliance issue. Stranded units earn nothing but still incur storage fees.

Check the stranded inventory page regularly. Common fixes include:

- Resolving the listing issue, such as a missing attribute or image problem.
- Relisting a closed offer.
- Correcting a price flagged as too high or too low.
- Creating a removal order if the product should no longer be sold.

### Aged inventory

Inventory stored for long periods attracts additional surcharges on top of monthly storage fees. The inventory age report shows how long units have been in stock. For slow-moving products, act before surcharges start: promotions, price adjustments, advertising or removals.

### Reimbursements

Amazon's FBA reimbursement policies cover certain situations where inventory is lost or damaged in its warehouses, or where customer returns are not received. Many reimbursements are processed automatically, but rules, time limits and eligibility change. VAs often review reports for discrepancies and open cases where eligible, supported by evidence. Some sellers use specialised services for this.

### A monthly inventory health routine

\`\`\`text
[ ] Review returns report and top return reasons
[ ] Check unfulfillable inventory; create removals as agreed
[ ] Fix stranded inventory
[ ] Check inventory age; plan action for slow stock
[ ] Review reimbursement eligibility and open cases
\`\`\`

This routine often recovers money clients did not know they were losing, which is one of the clearest ways a VA proves their value.
      `,
        [
          q('What is stranded inventory?', [
            'FBA stock without an active, buyable listing',
            'Stock lost during sea freight',
            'Inventory waiting at the supplier',
            'Stock reserved for customer orders',
          ], 0, 'Stranded units sit in FBA earning nothing because their listing is inactive or has an issue.'),
          q('What does a removal order allow a seller to do?', [
            'Remove negative reviews',
            'Remove competitors from a listing',
            'Remove fees from past orders',
            'Have units returned or disposed of from FBA',
          ], 3, 'Removal orders take unfulfillable or unwanted units out of FBA by return or disposal.'),
          q('Many returns cite "too small". What is the best response?', [
            'Ignore it, returns are normal',
            'Improve size information and images on the listing',
            'Raise the price',
            'Stop advertising the product',
          ], 1, 'A repeated sizing complaint points to unclear size information that the listing should fix.'),
        ]
      ),
      lesson('Freight, Customs and Supplier Coordination', 12, `
Between the factory and Amazon's warehouse lies a chain of freight, customs and paperwork. VAs frequently coordinate this chain for clients, communicating with suppliers, freight forwarders and customs brokers. Understanding the basics prevents delays and expensive surprises.

### Shipping methods compared

| Method | Speed | Cost | Best for |
|---|---|---|---|
| Express courier | Fastest, days | Highest per kg | Samples, urgent small restocks |
| Air freight | About one to two weeks door to door | High | Urgent stock, light products |
| Sea freight | Often several weeks | Lowest per unit | Regular bulk restocks |

Many sellers use sea freight for regular inventory and air for urgent top-ups when stock runs low. Planning well, as the first lesson showed, reduces the need for expensive air shipments.

### Freight forwarders

A freight forwarder organises international transport: booking space on ships or planes, handling documents and often arranging customs clearance and delivery to Amazon. When comparing forwarders, consider price, transit time, experience with Amazon deliveries, communication and whether they handle customs and final delivery.

### Incoterms: who pays for what

Incoterms define where responsibility and costs move from supplier to buyer. Common ones:

\`\`\`text
EXW (Ex Works)          Buyer handles everything from the factory door
FOB (Free On Board)     Supplier delivers goods onto the ship at the origin port;
                        buyer handles freight, insurance and import
DDP (Delivered Duty Paid) Seller or forwarder delivers to destination,
                        including duties and import clearance
\`\`\`

FOB is popular because the supplier handles export steps in their country while the buyer controls freight. Always confirm Incoterms in writing on the purchase order, since misunderstandings lead to unexpected costs.

### Customs essentials

Importing into a marketplace country requires:

- **An importer of record**: the party legally responsible for the import. Amazon does not act as importer of record, so the seller or their service provider must.
- **Commercial invoice and packing list**: product descriptions, quantities and values.
- **HS codes**: classification codes that determine duty rates.
- **Other filings**: for example, ocean shipments to the US require an Importer Security Filing before loading.
- **Product compliance**: certain products need certificates or testing, such as for children's products, electronics or food-contact items.

Customs rules are complex and change. The VA's role is to coordinate information between supplier, forwarder and customs broker, not to give legal advice.

### Coordinating suppliers

Clear, organised communication with suppliers prevents most production problems:

| Stage | VA actions |
|---|---|
| Order | Send the purchase order with specifications, packaging, labels and Incoterms |
| Production | Request updates and photos; confirm the production date |
| Labelling | Provide FNSKU and box label files; confirm placement |
| Inspection | Arrange inspection; share the report with the client |
| Shipping | Confirm cargo-ready date with the forwarder; share documents |
| Arrival | Track the shipment to Amazon and confirm receiving |

### Time zones and culture

Many suppliers are in China, and some in Pakistan itself. Clear, polite written communication, with numbered questions and confirmed details, works across language barriers. Summarise every agreement in writing, including quantities, prices, dates and specifications, and save it in the client's shared folder.

### Keep a shipment tracker

Track every shipment in a shared sheet: purchase order number, supplier, quantity, cargo-ready date, forwarder, departure and arrival dates, Amazon shipment ID and receiving status. When the client asks "Where is the stock?", you have the answer immediately.
      `,
        [
          q('Under FOB, where does responsibility pass from supplier to buyer?', [
            'At the factory door',
            'At the Amazon warehouse',
            'Once goods are loaded on the ship at the origin port',
            'When the customer receives the product',
          ], 2, 'Under FOB, the supplier handles export and loading, and the buyer takes over from the origin port.'),
          q('Why does a seller need an importer of record?', [
            'Amazon acts as importer for all FBA shipments',
            'It is only required for air freight',
            'It replaces the need for HS codes',
            'Someone must be legally responsible for the import, and Amazon is not',
          ], 3, 'The importer of record carries legal responsibility for imports, which Amazon does not assume.'),
          q('What is the VA\'s role in customs matters?', [
            'Coordinating information between supplier, forwarder and broker',
            'Giving legal advice on duty rates',
            'Signing import documents on the client\'s behalf without approval',
            'Choosing HS codes without checking',
          ], 0, 'VAs coordinate documents and communication, while customs brokers and professionals handle legal classification.'),
        ]
      ),
      ],
      [
      q('What is the main risk of running out of stock on Amazon?', [
        'Storage fees increase',
        'Sales stop and organic ranking can drop',
        'Reviews are deleted',
        'The product\'s ASIN changes',
      ], 1, 'Stock-outs halt sales and can reduce ranking, which takes time to recover after restocking.'),
      q('What should be done before goods leave the supplier for FBA?', [
        'Nothing, Amazon labels everything on arrival',
        'Remove all barcodes from the products',
        'Ship without box content information',
        'Confirm labels, prep, packing and box information are correct',
      ], 3, 'Correct labelling, prep and box details prevent receiving delays, fees and lost units.'),
      q('Why review stranded and aged inventory monthly?', [
        'Amazon requires monthly written reports',
        'It changes the product\'s category',
        'It stops storage fees being wasted on stock that is not selling',
        'It increases the product\'s price automatically',
      ], 2, 'Regular checks catch stock that earns nothing but still incurs fees, allowing timely action.'),
      q('A product is urgently running low. Which shipping method fits best for a small top-up?', [
        'Sea freight',
        'Waiting for the next scheduled order',
        'Rail freight across several countries',
        'Air freight or express courier',
      ], 3, 'Air and express are faster though costlier, suitable for urgent small restocks.'),
      ]
    ),
    chapter(
      'Customer Service and Reviews',
      'Answer customer messages quickly and within the rules, understand the difference between reviews and seller feedback, handle negative reviews, returns and A-to-z claims calmly, and create a customer experience on Shopify that earns loyalty.',
      [
      lesson('Answering Customer Messages', 13, `
Customer service is often the first task a new e-commerce VA is given, and it matters more than it seems. Fast, helpful replies prevent negative reviews, returns and claims, and on Amazon they protect account health. On Shopify stores, good service turns first-time buyers into repeat customers.

### Speed matters

Amazon has long expected sellers to respond to buyer messages within 24 hours, including weekends and holidays, and tracks response times in account metrics. Customers everywhere expect quick answers; a question left unanswered for two days often becomes a cancellation or a complaint. With the time difference, a Pakistani VA can answer US customers' overnight messages before the business day begins, which clients value highly.

### A good reply structure

\`\`\`text
1. Greet the customer by name.
2. Acknowledge the question or problem.
3. Give a clear answer or solution.
4. Explain the next step and when it will happen.
5. Close politely.
\`\`\`

Example:

\`\`\`text
Hi Sarah,

Thank you for reaching out, and sorry the lid arrived cracked.
We'd like to make this right. We've arranged a free replacement,
which will ship within 1 business day; you'll receive tracking by email.
There's no need to return the damaged item.

Best regards,
KitchenJoy Customer Care
\`\`\`

### Templates, personalised

Most questions repeat: delivery times, sizes, returns, product use, damaged items. Create a library of approved templates, sometimes called macros, and personalise each one with the customer's name and details. Templates keep answers accurate and consistent; personalisation keeps them human.

| Common question | Template covers |
|---|---|
| Where is my order? | Tracking steps, expected delivery, what to do if late |
| Wrong size | Exchange or return process |
| Damaged item | Apology, replacement or refund options, photo request if needed |
| How to use | Clear steps, link to instructions where allowed |
| Cancel order | Whether cancellation is still possible |

### Amazon messaging rules

Amazon's buyer-seller messaging is only for completing orders and customer service. Messages must not:

- Include marketing or promotions.
- Contain links to external websites, except those Amazon allows.
- Ask for positive reviews or offer anything for reviews.
- Ask the customer to contact the seller outside Amazon.

When a message needs no reply, such as a simple thank-you, use the option to mark it as no response needed, so response metrics stay accurate.

### Escalate wisely

Agree with the client which decisions you can make alone and which need approval:

\`\`\`text
VA can decide:        replacements under $20, standard returns, delivery questions
Needs client approval: refunds above an agreed limit, legal threats,
                       safety complaints, media or influencer requests
\`\`\`

Safety complaints, such as a product causing injury, must be escalated immediately, both for the customer's wellbeing and because they can lead to serious account issues.

### Tone under pressure

Some customers are angry. Stay calm, polite and factual; never argue or blame the customer. Acknowledge their frustration, focus on the solution and keep the message short. A calm reply often turns an angry customer into a satisfied one, and sometimes a critical review into a positive one, without ever asking for it.
      `,
        [
          q('What response time has Amazon long expected for buyer messages?', [
            'Within one week',
            'Only on business days',
            'Within 24 hours, including weekends',
            'Within one month',
          ], 2, 'Amazon measures response times and expects replies within 24 hours, every day of the week.'),
          q('Which content is not allowed in Amazon buyer-seller messages?', [
            'Tracking information for an order',
            'Return instructions',
            'An apology for a delay',
            'Requests for positive reviews and marketing',
          ], 3, 'Messages are for order service only; promotions and review requests are prohibited.'),
          q('A customer reports a product caused an injury. What should the VA do?', [
            'Escalate to the client immediately',
            'Reply with a standard template and close the case',
            'Ignore it unless they message again',
            'Offer a discount on their next order',
          ], 0, 'Safety complaints need urgent attention from the client for the customer\'s sake and the account\'s.'),
        ]
      ),
      lesson('Reviews, Ratings and Feedback Rules', 13, `
Reviews strongly influence buying decisions, and on Amazon they also affect conversion and therefore ranking. But Amazon's rules around reviews are strict, and many sellers have lost accounts by breaking them. Understanding what is allowed, and what is not, is essential for any VA.

### Product reviews versus seller feedback

On Amazon, there are two separate systems:

| | Product reviews | Seller feedback |
|---|---|---|
| About | The product itself | The seller's service: shipping, packaging, communication |
| Where shown | On the product detail page | On the seller's profile |
| Affects | Conversion, ranking, brand reputation | Account health, featured offer eligibility |
| Removal | Only if it breaks Amazon's community guidelines | Can be removed in specific cases |

Customers often confuse them, leaving product complaints as seller feedback or service complaints as reviews.

### Seller feedback removal

Amazon may remove seller feedback in specific situations, such as when:

- It is actually a product review, not about the seller's service.
- It contains obscene language or personal information.
- It concerns delivery for an FBA order, which is Amazon's responsibility; in that case Amazon typically strikes it through.

Sellers can request removal through Seller Central for eligible feedback. Genuine negative feedback about the seller's own service cannot be removed simply because the seller dislikes it.

### What is allowed for getting reviews

| Allowed | Why it works |
|---|---|
| The Request a Review button, within the allowed time after delivery | Amazon's own neutral request |
| Amazon Vine, for eligible brands | Trusted reviewers receive products and give honest reviews |
| Great products and packaging | Satisfied customers review naturally |
| Clear instructions and inserts that do not ask for positive reviews | Better experience, fewer complaints |

### What is never allowed

- Paying for reviews or offering refunds, gifts or discounts in exchange.
- Asking only happy customers to review, or directing unhappy ones elsewhere.
- Reviews by the seller, family, friends or employees.
- Review swapping groups or services selling reviews.
- Inserts that ask for five-star reviews.

Amazon detects manipulation increasingly well, and penalties include removed reviews, lost selling privileges and legal action.

### Reporting reviews that break the rules

Brand owners can report reviews that violate Amazon's community guidelines, such as reviews containing hate speech, personal information, promotional content or clearly about a different product. Reporting is not a way to remove honest negative reviews; it is only for reviews that break the rules.

### Monitoring reviews

VAs typically monitor new reviews weekly, recording rating, main theme and any action:

\`\`\`text
Date     ASIN     Rating  Theme                    Action
10 Mar   SP-5PC   2       Handle loosened           Sent to client; supplier QC
11 Mar   SP-BLK   5       Heat resistant, sturdy    Use insight in bullets
12 Mar   SP-RED   1       Wrong product received    Check FBA labelling issue
\`\`\`

Patterns in reviews guide product improvements, listing updates and quality checks, as chapter 6 described for competitors.

### The honest path is the sustainable one

Brands built on genuine reviews survive policy changes and competitor complaints. Brands built on manipulated reviews live under constant risk. A VA who steers clients firmly towards honest methods protects their business, and their own professional reputation.
      `,
        [
          q('What is the difference between product reviews and seller feedback?', [
            'There is no difference',
            'Reviews are private; feedback is public',
            'Feedback is only for Shopify stores',
            'Reviews rate the product; feedback rates the seller\'s service',
          ], 3, 'Product reviews appear on detail pages, while seller feedback measures service and affects account health.'),
          q('Which is an allowed way to get more Amazon reviews?', [
            'Using the Request a Review button',
            'Offering a refund for a five-star review',
            'Asking employees to review products',
            'Joining a review exchange group',
          ], 0, 'Amazon\'s neutral review request is permitted, while incentives and fake reviews are prohibited.'),
          q('When can a brand report a product review to Amazon?', [
            'Whenever the review is negative',
            'When the rating is below four stars',
            'When the client disagrees with it',
            'When it breaks Amazon\'s community guidelines',
          ], 3, 'Reporting is only for reviews that violate guidelines, not for honest criticism.'),
        ]
      ),
      lesson('Negative Reviews, Returns and A-to-z Claims', 13, `
Every seller eventually faces unhappy customers: a negative review, a return request or a formal claim. How these are handled affects account health, future sales and the brand's reputation. The goal is always a fair resolution for the customer, within the platform's rules, while protecting the client.

### Responding to negative reviews

A negative review is feedback about a real experience, even when it feels unfair. Useful steps:

\`\`\`text
1. Read it carefully: what exactly went wrong?
2. Check whether it points to a pattern (product, listing, packaging).
3. Share it with the client and suggest a fix.
4. Improve the product, listing or process to prevent repeats.
\`\`\`

On Amazon, sellers cannot contact reviewers to ask them to change reviews, and incentives for changes are prohibited. The best response is fixing the cause so future customers have a better experience. On Shopify stores, many review apps allow public replies; a calm, helpful public response shows future customers that the brand cares.

### Returns

Returns are part of e-commerce. For FBA orders, Amazon handles the process. For seller-fulfilled orders, the seller must follow Amazon's return policy and respond to return requests on time. Good practice:

- Approve eligible returns promptly according to policy.
- Provide clear return instructions.
- Refund promptly once the return is received, or as the policy requires.
- Record return reasons to spot patterns.

### A-to-z Guarantee claims

The A-to-z Guarantee protects Amazon buyers when an item does not arrive, arrives damaged or defective, or is materially different from its description, and the seller has not resolved the issue. Buyers can file a claim, and Amazon asks the seller to respond.

| Step | Action |
|---|---|
| Notification | Claim appears in Performance, A-to-z Guarantee claims |
| Review | Check the order, tracking, messages and listing |
| Respond | Within the time Amazon allows: refund, or provide evidence such as tracking and delivery proof |
| Record | Note the outcome and cause |

Claims decided against the seller count towards the Order Defect Rate. Many claims can be prevented by responding quickly to customer messages, since customers often file claims after feeling ignored.

### Chargebacks

A chargeback occurs when a customer disputes a payment with their card provider. Amazon notifies the seller and may ask for information. Respond with order details, tracking and communication records. Chargebacks also count towards the Order Defect Rate.

### Prevention is better than defence

| Cause of problems | Prevention |
|---|---|
| Late or lost deliveries (FBM) | Reliable carriers, valid tracking, realistic handling times |
| Damaged items | Better packaging and prep |
| "Not as described" | Accurate listings, clear images, correct variations |
| Slow responses | Daily message checks, templates, clear escalation rules |

### Documentation protects everyone

Keep records of every claim, return and difficult case: dates, messages, evidence and outcomes. When Amazon reviews an account, or a client asks what happened, organised records make the answer quick and credible. They also reveal the most common problems, which is where improvements should start.
      `,
        [
          q('What is the best response to a pattern of negative reviews on Amazon?', [
            'Contact reviewers and offer refunds for changes',
            'Report every negative review to Amazon',
            'Fix the cause in the product, listing or process',
            'Ask friends to leave positive reviews to balance them',
          ], 2, 'Fixing the underlying problem prevents repeats, while incentives or fake reviews break rules.'),
          q('When can an Amazon buyer file an A-to-z Guarantee claim?', [
            'When an item does not arrive or differs from its description and the seller has not resolved it',
            'Whenever they change their mind within a year',
            'Only for Shopify orders',
            'Only before the order is shipped',
          ], 0, 'The A-to-z Guarantee covers non-delivery and significant problems that sellers have not resolved.'),
          q('How can many A-to-z claims be prevented?', [
            'By hiding tracking information',
            'By refusing all returns',
            'By reducing prices',
            'By responding quickly to customer messages',
          ], 3, 'Customers often file claims after feeling ignored, so prompt replies resolve issues earlier.'),
        ]
      ),
      lesson('Customer Experience on Shopify Stores', 12, `
On a Shopify store, the business owns the entire customer relationship. That brings more responsibility than on Amazon, and more opportunity. Customers who have a great experience come back, recommend the store and leave reviews, which is how independent brands grow.

### Service channels

Shopify stores typically offer several ways to reach them:

| Channel | Notes |
|---|---|
| Email | Standard for order issues and detailed questions |
| Live chat | Shopify Inbox or chat apps answer questions during shopping |
| WhatsApp | Extremely popular in Pakistan and the Gulf for orders and support |
| Social media messages | Instagram and Facebook direct messages |
| Phone | Important for some customers and higher-value orders |

For VAs managing several channels, a helpdesk app that brings messages into one inbox, with templates and order information alongside, saves time and prevents missed messages.

### The post-purchase experience

What happens after purchase shapes whether customers return:

\`\`\`text
Order confirmation email   clear summary, expected delivery date
Shipping confirmation      tracking link, courier name
Delivery follow-up         care tips, how to get help
Review request             a few days after delivery
Win-back or restock email  later, for repeat purchase
\`\`\`

Customise Shopify's notification templates so they match the brand's voice and include useful information, such as how to contact the store on WhatsApp.

### Order status and tracking

"Where is my order?" is the most common question for most stores. Reduce it by:

- Sending tracking links promptly when orders are fulfilled.
- Providing a tracking page on the store, often through courier apps.
- Stating realistic delivery times on product pages and in emails.
- Proactively messaging customers when delays happen, such as during Eid or courier disruptions.

### Collecting and showing reviews

Unlike Amazon, Shopify stores can ask customers for reviews through their own emails, within the law and platform policies. Review apps send requests after delivery, collect photo reviews and display them on product pages. Best practices:

- Ask all customers, not only happy ones.
- Show negative reviews too; a mix of ratings looks more believable.
- Reply publicly to critical reviews with helpful solutions.
- Never fake or buy reviews; consumer protection laws in many countries prohibit it.

### Handling COD and delivery issues

For Pakistani stores, customer service often includes confirming COD orders, rescheduling failed deliveries and handling refused parcels. Polite, quick contact reduces refused orders, and a record of each customer's history helps identify repeat problems.

### Turning complaints into loyalty

Customers whose problems are solved quickly and generously often become more loyal than those who never had a problem. A fast replacement, a sincere apology and a small gesture, such as free delivery on the next order, can turn a complaint into a glowing review and a repeat customer.

### Measure service quality

Track a few simple metrics weekly: first response time, number of tickets by reason, refund and return rates, and review ratings. Share them with the client. They show where problems come from and prove the value of good service work.
      `,
        [
          q('Why use a helpdesk app for a store with many channels?', [
            'It brings messages into one inbox with templates and order details',
            'Shopify requires it for all stores',
            'It automatically removes negative reviews',
            'It replaces the need for couriers',
          ], 0, 'A unified inbox reduces missed messages and speeds up replies across email, chat and social channels.'),
          q('How can a store reduce "where is my order?" messages?', [
            'By hiding delivery times',
            'By sending tracking only on request',
            'By disabling order confirmation emails',
            'By sending tracking promptly and messaging customers about delays',
          ], 3, 'Proactive updates answer customers\' questions before they need to ask.'),
          q('Why show negative reviews alongside positive ones?', [
            'Shopify forces stores to display them',
            'A mix of ratings looks more believable to shoppers',
            'Negative reviews improve search ranking directly',
            'It reduces the number of returns automatically',
          ], 1, 'Shoppers trust a realistic range of reviews more than an unbroken wall of five stars.'),
        ]
      ),
      ],
      [
      q('What should a good customer reply include?', [
        'Only an apology',
        'A long explanation of company policy',
        'Acknowledgement, a clear solution and the next step',
        'A request for a positive review',
      ], 2, 'Customers want to feel heard and know exactly what will happen next.'),
      q('Which seller feedback may Amazon remove?', [
        'Any negative feedback the seller disagrees with',
        'Feedback about slow seller shipping',
        'Feedback that is really a product review',
        'Feedback left more than a week ago',
      ], 2, 'Amazon may remove feedback that reviews the product rather than the seller\'s service.'),
      q('Which counts towards the Order Defect Rate?', [
        'A customer question about sizing',
        'A positive product review',
        'A return marked as sellable',
        'An A-to-z claim decided against the seller',
      ], 3, 'ODR includes negative feedback, A-to-z claims and chargebacks.'),
      q('On a Shopify store, which review practice is acceptable?', [
        'Asking all customers for reviews after delivery',
        'Buying reviews from a service',
        'Deleting every critical review',
        'Writing reviews under customer names',
      ], 0, 'Honest requests to all customers are fine, while fake or bought reviews are prohibited.'),
      ]
    ),
    chapter(
      'Store Marketing and Conversion',
      'Bring visitors to a Shopify store through search engine optimisation and content, build email and SMS flows with proper consent, support social and paid ads, and increase the share of visitors who buy.',
      [
      lesson('Shopify SEO and Content', 13, `
Unlike Amazon, a Shopify store has no built-in crowd of shoppers. Search engine optimisation (SEO) helps the store appear in Google when people search for its products, bringing free, steady traffic over time. Many SEO tasks are practical and repetitive, which makes them ideal VA work.

### How search engines see a store

Google reads each page's content, titles and structure, and ranks pages based on relevance, quality and many other signals. For stores, the pages that matter most are:

| Page type | Target searches |
|---|---|
| Collection pages | Category searches: "handmade khussa for women" |
| Product pages | Specific searches: "maroon embroidered khussa size 38" |
| Blog posts | Questions and guides: "how to choose khussa size" |
| Home page | Brand name and main category |

### The SEO fields in Shopify

Each product, collection, page and blog post has a search engine listing section:

\`\`\`text
Page title:        Maroon Embroidered Khussa for Women | Ayesha Khussa
Meta description:  Handmade in Lahore with golden tilla embroidery.
                   Cushioned insole, sizes 36 to 41. Free delivery
                   across Pakistan on orders over PKR 5,000.
URL handle:        /products/maroon-embroidered-khussa
\`\`\`

The page title appears as the headline in Google results; the meta description often appears beneath it. Write both for people: clear, specific and inviting, including the main keyword naturally. Keep titles concise so they are not cut off.

### Keyword research for stores

Use Google's autocomplete, the "People also ask" box, Google Search Console data and keyword tools to find what customers search. Match keywords to page types: category terms to collections, specific product terms to products, questions to blog posts.

### Collection pages deserve content

Many stores leave collection pages as grids of products with no text. Adding a short, useful introduction, such as a paragraph about the collection and how to choose, helps search engines understand the page and helps shoppers. Keep it helpful, not stuffed with keywords.

### Images and alt text

Add descriptive alt text to product images, such as "maroon embroidered khussa with golden tilla, side view". Alt text helps visually impaired customers using screen readers and helps search engines understand images. Compressed, correctly sized images also keep pages fast.

### Technical basics Shopify handles

Shopify automatically creates a sitemap at \`/sitemap.xml\`, adds canonical tags to reduce duplicate content, and provides secure HTTPS. VAs should:

- Submit the sitemap in Google Search Console.
- Monitor Search Console for errors and pages not indexed.
- Create URL redirects when products are deleted or handles change, so old links do not break. Shopify offers to create a redirect when a handle is edited.
- Keep the store fast by limiting apps, as chapter 2 explained.

### Content marketing

A blog answering real customer questions builds long-term traffic and trust:

\`\`\`text
"How to choose the right khussa size"
"What to wear with khussas for a mehndi"
"How to care for embroidered footwear"
\`\`\`

Each post can link to relevant collections and products. Content takes months to gain traction, so consistency matters more than volume.

### Measure progress

Search Console shows which searches bring impressions and clicks, and which pages rank. Review it monthly, improve pages that appear but get few clicks, and share progress with the client. SEO is slow, but it compounds: traffic earned this year keeps arriving next year without ad spend.
      `,
        [
          q('Which page type usually targets category searches like "handmade khussa for women"?', [
            'The contact page',
            'Collection pages',
            'The checkout page',
            'The refund policy',
          ], 1, 'Collection pages group products by category, matching broad category searches.'),
          q('Why create URL redirects when product handles change?', [
            'Shopify charges for broken links',
            'Redirects increase product prices',
            'Customers cannot buy without redirects',
            'So old links and search results do not lead to broken pages',
          ], 3, 'Redirects send visitors and search engines from old URLs to the new ones, preserving traffic.'),
          q('What should a VA do with the Shopify sitemap?', [
            'Delete it to speed up the store',
            'Email it to every customer',
            'Submit it in Google Search Console',
            'Copy it into product descriptions',
          ], 2, 'Submitting the sitemap helps Google discover and index the store\'s pages.'),
        ]
      ),
      lesson('Email and SMS Marketing', 13, `
Email is one of the most profitable marketing channels for online stores because the store owns the list: no algorithm decides who sees the message. Automated email and SMS flows run in the background, recovering abandoned carts and bringing customers back, while campaigns announce launches and sales.

### Tools

Shopify stores commonly use Shopify Email, Klaviyo, Omnisend or similar tools. They connect to store data, so messages can be personalised with names, products viewed and past orders.

### Consent comes first

Email and SMS marketing are regulated. Rules differ by country, but common principles include:

- Only send marketing to people who have agreed to receive it.
- Make it easy to unsubscribe in every message.
- Identify the business clearly.
- SMS and WhatsApp marketing usually need explicit consent and have stricter rules.

For stores selling to the US, UK or EU, laws such as CAN-SPAM, UK and EU data protection rules and US rules on text messages apply. Never buy email lists or add customers without consent. Follow the client's legal guidance on compliance.

### Automated flows

Flows are sequences triggered by customer behaviour:

| Flow | Trigger | Purpose |
|---|---|---|
| Welcome | New subscriber | Introduce the brand; often a first-order offer |
| Abandoned checkout | Customer leaves checkout without paying | Recover the sale |
| Browse abandonment | Customer views products but does not add to cart | Gentle reminder |
| Post-purchase | Order placed | Thank you, care tips, review request |
| Win-back | No purchase for a long time | Re-engage lapsed customers |

Flows are set up once and keep working, which makes them extremely valuable.

### An abandoned checkout sequence

\`\`\`text
Email 1 (about 1 hour after abandonment)
  Subject: Did you forget something?
  Content: product image, reminder, link back to checkout

Email 2 (about 24 hours later)
  Subject: Still thinking about your khussas?
  Content: reviews, delivery information, answers to common doubts

Email 3 (about 48 to 72 hours later, optional)
  Subject: A little something to help you decide
  Content: small discount or free delivery, if the client approves
\`\`\`

Test timings and content over time; not every store needs a discount in the sequence.

### Campaigns

Campaigns are one-off messages to the list or segments: new collections, Eid sales, restocks, blog posts. Good practices:

- Segment the list, for example past buyers versus subscribers who have never bought.
- Write clear subject lines that reflect the content honestly.
- Design for mobile: one clear message, a strong image and one main button.
- Send at a consistent frequency without overwhelming subscribers.

### WhatsApp in Pakistan

For Pakistani stores, WhatsApp is often the most effective channel. Businesses use WhatsApp Business for order confirmations and customer service, and approved WhatsApp Business messaging solutions for broadcasts and automated messages. Opt-in and respectful frequency matter even more on WhatsApp, where messages feel personal; spam quickly leads to blocks.

### Measure what matters

Track open rates carefully, since privacy features in some email apps distort them. Focus on clicks, orders and revenue per email, and unsubscribe rates. Report flow revenue separately from campaign revenue, so the client sees how much the automated flows contribute every month.
      `,
        [
          q('Why is email valuable for online stores?', [
            'The store owns the list, so no algorithm limits who sees messages',
            'Emails are always opened by every subscriber',
            'Email marketing requires no consent',
            'Email replaces the need for a website',
          ], 0, 'Owning the audience means the store can reach subscribers directly and repeatedly.'),
          q('What triggers an abandoned checkout flow?', [
            'A customer subscribing to the newsletter',
            'A customer leaving a review',
            'A new product being added',
            'A customer leaving checkout without paying',
          ], 3, 'The flow reminds customers who started checkout but did not complete it.'),
          q('Why should stores never buy email lists?', [
            'Bought lists are always too small',
            'Marketing requires consent, and bought lists break rules and damage deliverability',
            'Email tools cannot import lists',
            'Bought lists only contain business emails',
          ], 1, 'Contacting people without consent breaks laws and harms sender reputation.'),
        ]
      ),
      lesson('Social Media and Paid Ads for Stores', 12, `
Social media and paid ads are how many Shopify stores get their first customers. Instagram, Facebook and TikTok are where many shoppers discover new brands, especially in fashion, beauty and lifestyle. VAs often support this work: preparing content, managing catalogues, setting up tracking and reporting results.

### Organic social media

Organic posting builds brand awareness and trust at no ad cost:

| Content type | Example for a khussa brand |
|---|---|
| Product showcases | New designs, close-ups of embroidery |
| Behind the scenes | Artisans stitching in the workshop |
| Customer photos | Brides wearing the khussas (with permission) |
| Styling ideas | Outfits for Eid, weddings and casual days |
| Short videos | Reels showing the making process or styling |

Consistency matters more than volume. A realistic schedule the brand can maintain beats a burst of posts followed by silence.

### Connecting the store to social platforms

Shopify's sales channels and apps connect the product catalogue to Meta (Facebook and Instagram), TikTok and Google. This enables:

- Shoppable posts and product tags.
- Catalogue ads that show relevant products automatically.
- Tracking of visits, add-to-carts and purchases from ads.

Keeping catalogue data clean, with accurate titles, prices, images and stock, matters here just as on the store itself.

### Tracking: the pixel and server events

Ad platforms need to know which ads lead to sales. Installing their tracking, such as the Meta pixel and server-side events through Shopify's official integrations, allows accurate reporting and better ad optimisation. Without tracking, platforms cannot learn which customers are likely to buy. Privacy changes have made tracking less complete, so reported results are estimates; compare them with Shopify's own sales data.

### Paid ads basics

| Platform | Strength |
|---|---|
| Meta (Facebook and Instagram) | Detailed audiences, strong for visual products and retargeting |
| TikTok | Reaching new audiences with short video, strong for trends |
| Google Shopping and Search | Customers already searching for the product |

Common campaign types include prospecting (reaching new people), retargeting (people who visited or added to cart) and catalogue ads.

### Key metrics

\`\`\`text
ROAS = revenue from ads / ad spend
Example: $500 spend, $2,000 revenue -> ROAS 4.0

CPA (cost per acquisition) = ad spend / purchases
Example: $500 spend, 40 purchases -> CPA $12.50
\`\`\`

Compare CPA with profit per order. If each customer costs more to acquire than the order earns, ads lose money unless customers buy again later.

### Creative matters most

In modern social advertising, the ad creative, the video or image and its first seconds, often matters more than audience settings. Test several creatives, keep the ones that perform and refresh them regularly before audiences tire of them. User-generated style videos, showing real people using the product, often perform well.

### The VA's role

VAs commonly prepare creatives and captions, keep catalogues accurate, set up tracking with the client's approval, monitor spend and results, and write weekly reports. Launching or scaling significant ad budgets should always follow the client's agreed limits, just like Amazon PPC.
      `,
        [
          q('Why install tracking like the Meta pixel on a store?', [
            'It speeds up the store',
            'It removes the need for product photos',
            'Ad platforms learn which ads lead to sales',
            'It replaces Shopify\'s analytics',
          ], 2, 'Tracking connects ads to purchases, enabling reporting and better optimisation.'),
          q('A campaign spends $300 and generates 20 purchases. What is the CPA?', [
            '$6',
            '$20',
            '$300',
            '$15',
          ], 3, 'CPA equals spend divided by purchases: 300 divided by 20 is $15.'),
          q('What often matters most in modern social media ads?', [
            'The ad creative and its first seconds',
            'The length of the store\'s policies',
            'The number of apps installed',
            'The store\'s domain extension',
          ], 0, 'Strong, fresh creative drives attention and results more than detailed targeting settings.'),
        ]
      ),
      lesson('Conversion Rate Optimisation', 13, `
Getting visitors to a store costs time and money. Conversion rate optimisation (CRO) increases the share of those visitors who buy. A store converting 2% of visitors instead of 1% doubles its sales from the same traffic, which is often cheaper than doubling traffic.

### Key metrics

| Metric | Meaning |
|---|---|
| Conversion rate | Orders divided by sessions |
| Add-to-cart rate | Sessions where a product was added to cart |
| Checkout reached | Sessions that reached checkout |
| Average order value (AOV) | Revenue divided by orders |

Shopify's analytics show a conversion funnel: sessions, added to cart, reached checkout and completed. Where the biggest drop happens tells you where to focus.

### Diagnosing the funnel

\`\`\`text
Low add-to-cart rate      -> product pages: images, price, description, trust
Carts abandoned           -> shipping costs, delivery time, surprise fees
Checkout abandoned        -> payment options, form friction, trust at checkout
\`\`\`

For example, if many visitors add to cart but few reach checkout, shipping costs revealed in the cart may be the problem.

### Product page improvements

- Clear, high-quality images, including scale and lifestyle photos (chapter 3).
- Benefit-focused descriptions answering common questions.
- Visible reviews, ideally with customer photos.
- Clear price, delivery time and return information near the Add to Cart button.
- Obvious variant selection with size guides.
- Fast loading, especially on mobile.

### Trust and reassurance

New brands must earn trust quickly. Real contact details, clear policies, recognised payment options, genuine reviews and professional design all help. For cash on delivery markets, showing that COD is available can significantly increase orders from first-time buyers.

### Increasing average order value

Raising AOV increases revenue without more visitors:

| Tactic | Example |
|---|---|
| Free shipping threshold | Free delivery over PKR 5,000 |
| Bundles | Khussa with matching clutch at a bundle price |
| Cross-sells | "Complete the look" suggestions on product pages |
| Volume discounts | Buy two pairs, save 10% |
| Post-purchase upsells | An offer after checkout, where the platform supports it |

### Testing changes

Guesswork leads to wasted effort. Test changes where possible:

- Change one major thing at a time.
- Measure over a meaningful period, usually at least a couple of weeks, depending on traffic.
- Compare conversion rate and revenue, not only clicks.
- A/B testing apps can split traffic between versions for stores with enough visitors.

Small stores with little traffic cannot run reliable A/B tests; for them, following proven best practices and watching trends over time is more practical.

### Speed and mobile

Most store visitors use phones, often on mobile networks. Slow pages lose customers before they see the product. Compress images, limit apps, and test the store on a real mid-range phone, not just a fast laptop.

### Report improvements

Document each change, when it was made and the results before and after. A clear record of improvements, such as "conversion rate rose from 1.2% to 1.6% after adding size guides and delivery information", demonstrates the VA's value and guides future work.
      `,
        [
          q('How is conversion rate calculated?', [
            'Revenue divided by orders',
            'Ad spend divided by revenue',
            'Visitors divided by products',
            'Orders divided by sessions',
          ], 3, 'Conversion rate is the share of sessions that result in an order.'),
          q('Many visitors add to cart but few reach checkout. What is a likely cause?', [
            'Poor product photos',
            'Shipping costs or delivery times revealed in the cart',
            'Too many reviews on product pages',
            'A fast-loading store',
          ], 1, 'Drop-off between cart and checkout often comes from surprise costs or unclear delivery details.'),
          q('Why can\'t small stores rely on A/B tests?', [
            'Shopify blocks A/B tests for small stores',
            'Tests always increase costs',
            'Low traffic makes results unreliable',
            'A/B tests only work on Amazon',
          ], 2, 'Without enough visitors, differences between versions may just be random noise.'),
        ]
      ),
      ],
      [
      q('What should a product\'s SEO page title do?', [
        'Repeat the main keyword as many times as possible',
        'Describe the product clearly with its main keyword, for people',
        'Include the store\'s phone number only',
        'Stay empty so Google chooses',
      ], 1, 'Clear, specific titles with natural keywords attract clicks from search results.'),
      q('Which email flow thanks customers and later asks for a review?', [
        'Welcome flow',
        'Abandoned checkout flow',
        'Browse abandonment flow',
        'Post-purchase flow',
      ], 3, 'Post-purchase flows follow an order with thanks, care tips and a review request.'),
      q('Ads cost $20 per purchase, but each order earns $12 profit. What does this mean?', [
        'The ads are highly profitable',
        'The store should double the budget immediately',
        'Ads lose money unless customers buy again later',
        'CPA does not affect profit',
      ], 2, 'When acquisition cost exceeds order profit, ads are unprofitable without repeat purchases.'),
      q('Which tactic increases average order value?', [
        'A free shipping threshold slightly above typical spending',
        'Removing product images',
        'Hiding the size guide',
        'Adding more checkout steps',
      ], 0, 'A threshold encourages customers to add items to qualify, raising order value.'),
      ]
    ),
    chapter(
      'Working as an E-commerce VA',
      'Choose the services clients pay for, build a portfolio and profile that win e-commerce VA work, handle account access and security professionally, and keep clients long term with SOPs and clear reporting.',
      [
      lesson('Skills and Services Clients Hire For', 12, `
E-commerce sellers hire VAs to save time, fill skill gaps and grow faster. Understanding which services they value, and how to package your skills, helps you win work and charge fairly. This lesson connects the skills from earlier chapters to the services clients actually buy.

### Common services and their value

| Service | Skills from this course | Why clients pay |
|---|---|---|
| Listing creation and optimisation | Chapters 3 and 7 | Better ranking and conversion |
| Product research | Chapter 6 | Choosing profitable products avoids costly mistakes |
| Amazon PPC management | Chapter 8 | Direct effect on sales and profit |
| Inventory and shipment management | Chapter 9 | Prevents stock-outs and fee waste |
| Customer service | Chapter 10 | Protects reviews and account health |
| Shopify store setup and management | Chapters 2 to 4 | A working, trustworthy store |
| Store marketing support | Chapter 11 | Traffic and sales for independent brands |
| Account health monitoring | Chapter 5 | Avoids suspensions |

### General VA or specialist?

Generalist VAs handle many daily tasks and are valuable to small sellers who need broad help. Specialists focus on one high-impact area, such as PPC or listing optimisation, and usually command higher rates because their results are measurable.

A practical path:

\`\`\`text
Months 1 to 6:   General tasks, learning the platforms deeply
Months 6 to 12:  Notice which work you enjoy and do best
After a year:    Specialise and position yourself as an expert,
                 while offering related services
\`\`\`

### Packaging your services

Clients understand packages more easily than hourly promises:

\`\`\`text
Listing Optimisation Package
- Keyword research (up to 100 keywords, grouped by relevance)
- Rewritten title, 5 bullet points and description
- Backend search terms
- Image recommendations brief
Delivery: 5 working days per ASIN

PPC Management (monthly)
- Campaign structure review and setup
- Weekly optimisation: harvesting, negatives, bids
- Weekly report and monthly strategy call
\`\`\`

Packages set clear scope, expectations and pricing, reducing disagreements.

### Soft skills clients value

Technical skills win the first contract; soft skills win the long-term relationship:

- **Reliability**: doing what you said, when you said.
- **Proactive communication**: flagging problems and opportunities before being asked.
- **Judgement**: knowing when to act and when to ask.
- **Discretion**: keeping client data and business information confidential.
- **Learning**: keeping up with platform changes.

### Keep learning

Amazon and Shopify change constantly: new fees, new policies, new ad types, new features. Set aside time each week to read Seller Central news, Shopify updates and trusted industry sources. Clients notice when a VA alerts them to a new fee or opportunity before they hear about it elsewhere, and that awareness is part of what they are paying for.

### Pricing your work

Start with rates that reflect your experience, and raise them as you build results and reviews. Specialist services tied to revenue, such as PPC, often use monthly retainers. Always define what is included, and avoid open-ended arrangements like "help with everything" for a small fixed fee.
      `,
        [
          q('Why do specialist VAs often charge higher rates?', [
            'Their work has measurable impact on sales',
            'They work fewer hours than generalists',
            'Platforms pay specialists directly',
            'Specialists never need to communicate',
          ], 0, 'Specialised services like PPC produce measurable results, which justify higher rates.'),
          q('What is an advantage of offering services as packages?', [
            'Packages remove the need for any communication',
            'Packages allow unlimited work for a fixed fee',
            'Clients cannot request changes to packages',
            'Clear scope, expectations and pricing reduce disagreements',
          ], 3, 'Defined packages make it clear what is delivered and at what price.'),
          q('Which soft skill most helps win long-term clients?', [
            'Working only when asked',
            'Avoiding updates to save time',
            'Proactively flagging problems and opportunities',
            'Making major changes without telling the client',
          ], 2, 'Clients value VAs who communicate early and bring ideas, not just complete tasks.'),
        ]
      ),
      lesson('Building a VA Portfolio and Profile', 13, `
Clients hiring an e-commerce VA want proof that you can do the job and that you can be trusted with their accounts. A good portfolio shows the first; a professional profile, reviews and clear communication show the second.

### What to put in a portfolio

| Portfolio item | How to create it without clients |
|---|---|
| Listing rewrite samples | Choose a real listing, write an improved version, show before and after |
| Keyword research sheet | Research a product niche and present a clean, grouped keyword list |
| Product research report | Analyse a niche with demand, competition, profit estimates and a recommendation |
| PPC structure plan | Design a campaign structure for a sample product with naming and targets |
| Shopify store demo | Build a small demo store with products, collections and policies |
| Customer service templates | A set of professional, policy-compliant reply templates |
| Inventory planner | A spreadsheet with reorder calculations and sample data |

Label practice work honestly, for example "Sample listing optimisation for a public product; not a client project". Honesty builds trust with clients reviewing your work.

### Show results when you have them

After working with clients, and with their permission, add results:

\`\`\`text
Case study: Kitchen utensils brand (US marketplace)
Problem:  Listing ranked poorly for main keywords; conversion 8%
Work:     Keyword research, new title and bullets, image brief,
          PPC restructure with exact campaigns
Result:   Conversion rose to 12% over 8 weeks; ACoS fell from 42% to 29%
\`\`\`

Remove client names and confidential figures unless you have explicit permission to share them. Percentages and trends often communicate results without revealing sensitive data.

### Your freelance profile

On Upwork, Fiverr or LinkedIn, a strong e-commerce VA profile includes:

- **A specific headline**: "Amazon PPC and Listing Optimisation Specialist" rather than "Virtual Assistant".
- **An overview focused on client problems**: stock-outs, low conversion, rising ad costs, and how you solve them.
- **Relevant skills and tools**: Seller Central, Helium 10, Jungle Scout, Shopify, Excel or Google Sheets.
- **Portfolio items**: your best three to five samples.
- **Availability**: working hours in the client's time zone.

### Proposals that stand out

When applying to e-commerce jobs, show that you have looked at the client's store or listing:

\`\`\`text
"I looked at your silicone spatula listing. The title is missing
'heat resistant', which appears in the top competitors' titles and has
strong search volume, and your main image is smaller in frame than
competitors'. I'd start with a keyword and listing audit, then review
your auto campaign's search terms for negatives."
\`\`\`

Specific observations prove competence far better than general claims.

### Communities and learning

Seller communities on Facebook, Reddit, LinkedIn and specialist forums are places to learn and, occasionally, find clients. Contribute helpful answers rather than advertising yourself; helpful people get noticed and recommended.

### Certifications and courses

Some tools and platforms offer training and certificates, and completing courses like this one shows commitment to learning. Clients still care most about results and professionalism, so treat certificates as supporting evidence alongside a strong portfolio.
      `,
        [
          q('How should practice portfolio work be presented?', [
            'As real client projects',
            'Without any explanation',
            'Labelled honestly as sample or practice work',
            'Only with invented results',
          ], 2, 'Honest labels keep trust intact while still demonstrating skills.'),
          q('What makes a proposal for an e-commerce job stand out?', [
            'A long list of every tool you have heard of',
            'Specific observations about the client\'s listing or store',
            'Offering to work for free forever',
            'Copying the same message to every job',
          ], 1, 'Specific, relevant observations prove you understand the client\'s situation and can help.'),
          q('How can results be shared without revealing confidential data?', [
            'Publish the client\'s full sales reports',
            'Share login screenshots from their account',
            'Avoid mentioning any results at all',
            'Use percentages and trends, with permission',
          ], 3, 'Percentages and trends show impact without exposing sensitive figures.'),
        ]
      ),
      lesson('Access, Permissions and Security', 13, `
E-commerce VAs work inside the most important systems of a client's business. How you get access, and how you protect it, is a matter of professionalism, platform rules and trust. Clients remember VAs who handle access carefully, and a security mistake can end a relationship instantly.

### Never ask for the owner's password

Both Amazon and Shopify provide ways to give team members their own access:

| Platform | How to give access |
|---|---|
| Amazon Seller Central | User Permissions: the owner invites you by email; you sign in with your own credentials; the owner chooses which areas you can view or edit |
| Shopify | Staff accounts with specific permissions, or collaborator accounts for agencies and developers |
| Research and ad tools | Team or sub-user seats where available |

Your own login, with your own two-step verification, means actions are traceable to you and the owner can remove access at any time without changing their password. Sharing the owner's credentials risks the account's security and can conflict with platform rules.

### Ask only for the access you need

A VA handling customer messages does not need access to payments or bank details. Request the minimum permissions for your tasks, and ask for more only when a new task requires it. This protects both the client and you: if something goes wrong in an area you cannot access, you are clearly not responsible.

### Secure your own setup

\`\`\`text
[ ] Strong, unique passwords for every account
[ ] A password manager to store them
[ ] Two-step verification on your email and all client logins
[ ] Up-to-date operating system and antivirus
[ ] A separate browser profile for each client
[ ] Screen lock when away from your computer
[ ] No client work on shared or public computers
\`\`\`

Separate browser profiles keep each client's sessions, bookmarks and extensions apart, reducing the chance of making a change in the wrong account.

### Be transparent about location

Amazon's user permissions are designed for team members anywhere. Log in honestly from your own location. Do not use tricks to disguise where you work unless the client and platform rules require a specific setup; unusual login patterns can look suspicious and trigger security checks.

### Protect customer data

Customer names, addresses and order details are personal data, protected by platform policies and privacy laws. Download only what you need, store it securely, never use it for anything outside the task, and delete it when no longer needed. Never contact customers outside the platform's rules.

### Confidentiality

Many clients ask VAs to sign a non-disclosure agreement. Even without one, treat all business information, including sales figures, suppliers, product plans and advertising data, as confidential. Never share one client's information with another, even as an example.

### Ending access properly

When a contract ends, remind the client to remove your access, and confirm when it is done. Return or delete any files you hold. A clean handover, with notes on ongoing tasks, leaves a professional final impression and often leads to referrals.

### If something goes wrong

If you make a mistake, such as a wrong price or an accidental deletion, tell the client immediately, explain what happened and what you have done to fix it. Hiding mistakes destroys trust; reporting them quickly and professionally usually strengthens it.
      `,
        [
          q('How should a VA get access to Amazon Seller Central?', [
            'Through User Permissions with their own login',
            'By using the owner\'s email and password',
            'By creating a second seller account',
            'By asking Amazon support for the password',
          ], 0, 'User Permissions give the VA traceable, removable access without sharing the owner\'s credentials.'),
          q('Why request only the permissions you need?', [
            'Platforms charge per permission',
            'More permissions make the account slower',
            'It protects the client and limits your responsibility',
            'Clients cannot remove permissions later',
          ], 2, 'Minimum access reduces risk and makes responsibilities clear.'),
          q('A VA accidentally sets a wrong price. What should they do?', [
            'Hide it and fix it later if noticed',
            'Blame the platform',
            'Wait until the client asks',
            'Tell the client immediately and explain the fix',
          ], 3, 'Prompt, honest reporting preserves trust and allows quick correction.'),
        ]
      ),
      lesson('SOPs, Reporting and Long-Term Clients', 13, `
Winning a client is the start; keeping them for years is where a VA career becomes stable and rewarding. Two habits make the biggest difference: documenting processes in standard operating procedures (SOPs), and reporting clearly and regularly on results.

### Standard operating procedures

An SOP is a written, step-by-step guide for a recurring task. It ensures the task is done the same way every time, by you or anyone else.

\`\`\`text
SOP: Daily Amazon Account Check (10 minutes)
1. Log in via User Permissions in the client's browser profile.
2. Open Account Health; note any change in metrics.
3. Check Performance Notifications; record deadlines.
4. Open Buyer Messages; reply to all within the day.
5. Check Inventory for stranded or suppressed listings.
6. Record findings in the daily log sheet.
7. Message the client only if action is needed.
\`\`\`

SOPs benefit everyone: fewer mistakes, faster onboarding of helpers, and a business that does not depend on memory. Clients value VAs who create SOPs because they make the client's business more robust.

### Useful SOPs to write

- Creating a new product listing.
- Weekly PPC optimisation.
- Creating an FBA shipment.
- Handling returns and refunds.
- Answering common customer questions.
- Monthly inventory health review.

Store them in a shared folder the client can access, and update them when platforms change.

### Reporting that clients read

Clients are busy. A good report is short, visual and focused on decisions:

| Section | Content |
|---|---|
| Headline | Total sales, change versus last period |
| Advertising | Spend, ad sales, ACoS, TACoS |
| Inventory | Days of cover by SKU, reorder alerts |
| Customer | Reviews, rating changes, messages and returns |
| Actions taken | What you did this week |
| Recommendations | What you suggest next, and why |

\`\`\`text
Weekly summary, 10 to 16 March
Sales: $8,420 (+6% vs last week)
PPC: spend $1,050, ad sales $3,900, ACoS 27% (target 30%), TACoS 12.5%
Inventory: 5-piece set has 26 days of cover; reorder needed this week
Reviews: 4 new, average 4.5; one mentions loose handle (sent to supplier)
Actions: harvested 12 search terms; added 18 negatives; fixed 1 stranded SKU
Next: approve reorder of 800 units; test new main image
\`\`\`

### Regular calls

A short weekly or fortnightly call builds the relationship far more than messages alone. Use it to review the report, agree priorities and discuss ideas. Prepare an agenda and follow up with written notes.

### Growing with the client

As trust grows, clients often give VAs more responsibility: new products, new marketplaces, managing other assistants. Take on more only when you can maintain quality, and adjust pricing to match the expanded scope.

### Signs of a healthy relationship

- The client asks your opinion before decisions.
- You have clear priorities and agreed boundaries.
- Payments are on time and scope changes are discussed openly.
- Both sides communicate problems early.

### The long-term view

Many successful e-commerce VAs in Pakistan work with the same clients for years, build small teams, and some eventually start their own brands using the experience they gained. Reliability, clear communication, careful work within platform rules and a habit of learning are what make that journey possible.
      `,
        [
          q('What is an SOP?', [
            'A type of Amazon advertising campaign',
            'A written step-by-step guide for a recurring task',
            'A shipping label for FBA boxes',
            'A customer service complaint',
          ], 1, 'Standard operating procedures document tasks so they are done consistently by anyone.'),
          q('What should a weekly client report focus on?', [
            'Every raw number exported from Seller Central',
            'Only the VA\'s working hours',
            'Key results, actions taken and recommendations',
            'Competitors\' private data',
          ], 2, 'Clients need concise insights and clear next steps, not raw data dumps.'),
          q('When should a VA take on more responsibility from a client?', [
            'Immediately, whenever offered, regardless of workload',
            'Only if the client pays in advance for a year',
            'Never, to keep the relationship simple',
            'When quality can be maintained and pricing matches the scope',
          ], 3, 'Growing responsibility is positive when quality stays high and pay reflects the larger scope.'),
        ]
      ),
      ],
      [
      q('Which service directly affects sales and is often priced as a monthly retainer?', [
        'Setting up a store password',
        'Choosing a theme colour',
        'Writing a contact page',
        'Amazon PPC management',
      ], 3, 'PPC management is ongoing and revenue-focused, making monthly retainers common.'),
      q('What makes a portfolio case study persuasive?', [
        'Problem, work done and measurable result, shared with permission',
        'A list of tools only',
        'The client\'s login screenshots',
        'General claims without specifics',
      ], 0, 'A clear before-and-after story with results shows real impact.'),
      q('Why use a separate browser profile for each client?', [
        'Platforms require one profile per client',
        'It makes pages load faster',
        'It removes the need for passwords',
        'It keeps sessions separate and prevents changes in the wrong account',
      ], 3, 'Separate profiles reduce mix-ups between client accounts and keep sessions organised.'),
      q('What is the main benefit of writing SOPs for a client?', [
        'They replace the need for reporting',
        'They allow skipping steps when busy',
        'Tasks are done consistently and the business depends less on memory',
        'They make the VA impossible to replace',
      ], 2, 'SOPs make work consistent, reduce errors and let others help reliably.'),
      ]
    ),
  ],
  final: [
    q('Which business model brands a manufactured product and sells it as its own?', [
      'Dropshipping',
      'Retail arbitrage',
      'Print on demand',
      'Private label',
    ], 3, 'Private label sellers put their own brand on products made by a manufacturer.'),
    q('What must a Shopify store do that an Amazon listing does not?', [
      'Pay referral fees on every sale',
      'Bring its own visitors',
      'Follow Amazon\'s review policy',
      'Use FBA for fulfilment',
    ], 1, 'Own stores must attract traffic themselves, while Amazon listings reach existing shoppers.'),
    q('How should a VA get access to a client\'s Shopify admin?', [
      'Through a staff or collaborator account',
      'By using the owner\'s password',
      'By creating a copy of the store',
      'Through the client\'s personal email',
    ], 0, 'Staff and collaborator accounts provide controlled, removable access without sharing the owner\'s login.'),
    q('A shoe comes in several sizes and colours. How should it be set up on Shopify?', [
      'As a separate product for each size',
      'As one product with sizes in the description only',
      'As one product with variants',
      'As a collection with no products',
    ], 2, 'Variants keep all combinations under one product, each with its own SKU, price and stock.'),
    q('Why confirm cash on delivery orders before shipping?', [
      'To reduce fake orders and refused parcels',
      'Couriers refuse unconfirmed parcels',
      'Shopify requires confirmation calls',
      'It removes shipping costs',
    ], 0, 'Confirmation filters out orders unlikely to be accepted, saving courier costs both ways.'),
    q('What does Order Defect Rate include on Amazon?', [
      'Late shipments and cancellations',
      'Out-of-stock listings',
      'Negative feedback, A-to-z claims and chargebacks',
      'Customer questions about sizing',
    ], 2, 'ODR combines negative feedback, A-to-z Guarantee claims and chargebacks.'),
    q('What is the featured offer, or Buy Box?', [
      'A free sample programme',
      'A type of FBA packaging',
      'A sponsored ad placement',
      'The offer shown in the main Add to Cart position',
    ], 3, 'When several sellers offer the same ASIN, Amazon chooses one offer for the main purchase button.'),
    q('Which review practice is allowed on Amazon?', [
      'Offering refunds for five-star reviews',
      'Using the Request a Review button',
      'Asking employees to leave reviews',
      'Joining review exchange groups',
    ], 1, 'Amazon\'s own neutral request tool is permitted, while incentives and fake reviews are prohibited.'),
    q('What does Keepa show that snapshot data cannot?', [
      'A competitor\'s supplier',
      'Price and rank history over time',
      'Customer email addresses',
      'Exact profit per unit',
    ], 1, 'Long-term history reveals seasonality, price trends and stock-outs.'),
    q('Why include ad costs and returns in a product profit calculation?', [
      'Amazon requires them in listings',
      'They increase the selling price',
      'They only apply to Shopify stores',
      'They are real costs that reduce profit per unit',
    ], 3, 'Ignoring ads and returns overstates profit and leads to poor decisions.'),
    q('Where should core keywords go in an Amazon listing?', [
      'Only in backend search terms',
      'Only in A+ Content',
      'Early in the title',
      'In the seller\'s store name',
    ], 2, 'The title carries the most important keywords, placed early for search and mobile display.'),
    q('What is the backend search terms limit measured in?', [
      'Bytes, currently less than 250',
      'Words, with a limit of ten',
      'Sentences',
      'Bullet points',
    ], 0, 'Amazon counts backend terms in bytes, and terms beyond the limit may be ignored.'),
    q('A campaign spends $40 and earns $160 in ad sales. What is the ACoS?', [
      '4%',
      '25%',
      '40%',
      '400%',
    ], 1, 'ACoS equals ad spend divided by ad sales: 40 divided by 160 is 25%.'),
    q('What is keyword harvesting in Amazon PPC?', [
      'Moving converting search terms into exact campaigns',
      'Deleting every keyword each week',
      'Copying competitor brand names into titles',
      'Buying keywords from a research tool',
    ], 0, 'Harvesting moves proven search terms into precise exact campaigns for control.'),
    q('Daily sales are 8 units, lead time 50 days and safety stock 80 units. What is the reorder point?', [
      '138 units',
      '400 units',
      '58 units',
      '480 units',
    ], 3, 'Reorder point equals 8 times 50 plus 80, which is 480 units.'),
    q('What is stranded inventory?', [
      'Stock waiting at the supplier',
      'Stock lost at sea',
      'FBA stock without an active, buyable listing',
      'Stock reserved for orders',
    ], 2, 'Stranded units sit in FBA earning nothing because their listing has a problem.'),
    q('Under FOB terms, who usually arranges the main international freight?', [
      'The supplier',
      'Amazon',
      'The buyer',
      'The end customer',
    ], 2, 'Under FOB the supplier loads goods at the origin port and the buyer handles freight onward.'),
    q('What response time has Amazon long expected for buyer messages?', [
      'One week',
      'Only on business days',
      'One month',
      'Within 24 hours, including weekends',
    ], 3, 'Amazon tracks response times and expects replies within 24 hours every day.'),
    q('How is a store\'s conversion rate calculated?', [
      'Orders divided by sessions',
      'Revenue divided by orders',
      'Ad spend divided by sales',
      'Visitors divided by products',
    ], 0, 'Conversion rate is the share of sessions that result in an order.'),
    q('What is a key benefit of writing SOPs for a client?', [
      'They replace weekly reports',
      'Tasks are done consistently by anyone',
      'They make the VA impossible to replace',
      'They allow skipping steps',
    ], 1, 'SOPs document recurring tasks so they are done the same way every time.'),
  ],
});
